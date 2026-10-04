const json = (res: any, status: number, body: unknown) => {
  res.status(status).setHeader("Content-Type", "application/json").json(body);
};

const getCredentials = () => {
  const keyId = process.env.RAZORPAY_KEY_ID?.trim();
  const keySecret = process.env.RAZORPAY_KEY_SECRET?.trim();
  if (!keyId || !keySecret) throw new Error("Razorpay server credentials are not configured.");
  return { keyId, keySecret };
};

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return json(res, 405, { error: "Method not allowed." });
  }

  try {
    const { keyId, keySecret } = getCredentials();
    const { name, phone, email, vehicle, theme } = req.body || {};
    const cleanName = String(name || "").trim();
    const cleanPhone = String(phone || "").trim();
    const cleanEmail = String(email || "").trim();
    const cleanVehicle = String(vehicle || "").trim().toUpperCase();
    const cleanTheme = theme === "light" ? "light" : "dark";

    if (cleanName.length < 2 || cleanName.length > 80) return json(res, 400, { error: "Invalid name." });
    if (!/^\+?[0-9]{7,15}$/.test(cleanPhone.replace(/[\s()-]/g, ""))) return json(res, 400, { error: "Invalid phone number." });
    if (cleanEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) return json(res, 400, { error: "Invalid email address." });
    if (cleanVehicle.length < 2 || cleanVehicle.length > 40) return json(res, 400, { error: "Invalid vehicle number." });

    const receipt = `RL-${crypto.randomUUID().replace(/-/g, "").slice(0, 32)}`;
    const auth = Buffer.from(`${keyId}:${keySecret}`).toString("base64");

    const response = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: 19900,
        currency: "INR",
        receipt,
        partial_payment: false,
        notes: {
          product: "smart-parking-sticker",
          name: cleanName,
          phone: cleanPhone,
          email: cleanEmail,
          vehicle: cleanVehicle,
          theme: cleanTheme,
        },
      }),
    });

    const data = await response.json();
    if (!response.ok || !data?.id) {
      return json(res, 502, { error: data?.error?.description || "Unable to create Razorpay order." });
    }

    return json(res, 200, {
      keyId,
      orderId: data.id,
      amount: data.amount,
      currency: data.currency,
    });
  } catch (error) {
    return json(res, 500, {
      error: error instanceof Error ? error.message : "Unable to create Razorpay order.",
    });
  }
}
