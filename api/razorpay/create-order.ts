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
    const { name, phone, email, vehicle, theme, deliveryType, addressLine, shippingEmail, shippingPhone, city, state, pincode, country } = req.body || {};
    const cleanDeliveryType = deliveryType === "physical" ? "physical" : "digital";
    const cleanAddressLine = String(addressLine || "").trim();
    const cleanShippingEmail = String(shippingEmail || "").trim();
    const cleanShippingPhone = String(shippingPhone || "").trim().replace(/[\s()-]/g, "");
    const cleanCity = String(city || "").trim();
    const cleanState = String(state || "").trim();
    const cleanPincode = String(pincode || "").trim();
    const cleanCountry = String(country || "").trim();
    const cleanName = String(name || "").trim();
    const cleanPhone = String(phone || "").trim();
    const cleanEmail = String(email || "").trim();
    const cleanVehicle = String(vehicle || "").trim().toUpperCase();
    const cleanTheme = theme === "light" || theme === "dark" || theme === "physical" ? theme : "dark";

    if (cleanName.length < 2 || cleanName.length > 80) return json(res, 400, { error: "Invalid name." });
    if (!/^\+?[0-9]{7,15}$/.test(cleanPhone.replace(/[\s()-]/g, ""))) return json(res, 400, { error: "Invalid phone number." });
    if (cleanEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) return json(res, 400, { error: "Invalid email address." });
    if (cleanVehicle.length < 2 || cleanVehicle.length > 40) return json(res, 400, { error: "Invalid vehicle number." });
    if (cleanDeliveryType === "physical") {
      if (cleanCountry !== "India") return json(res, 400, { error: "Physical delivery is currently available in India only." });
      if (cleanAddressLine.length < 5 || cleanAddressLine.length > 200) return json(res, 400, { error: "Enter a valid delivery address." });
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanShippingEmail)) return json(res, 400, { error: "Enter a valid shipping email." });
      if (!/^\+?[0-9]{7,15}$/.test(cleanShippingPhone)) return json(res, 400, { error: "Enter a valid delivery contact number." });
      if (cleanCity.length < 2 || cleanCity.length > 80) return json(res, 400, { error: "Enter a valid delivery city." });
      if (cleanState.length < 2 || cleanState.length > 80) return json(res, 400, { error: "Enter a valid delivery state." });
      if (!/^[1-9][0-9]{5}$/.test(cleanPincode)) return json(res, 400, { error: "Enter a valid 6-digit Indian PIN code." });
    }

    const receipt = `RL-${crypto.randomUUID().replace(/-/g, "").slice(0, 32)}`;
    const auth = Buffer.from(`${keyId}:${keySecret}`).toString("base64");

    const response = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: cleanDeliveryType === "physical" ? 39900 : 19900,
        currency: "INR",
        receipt,
        partial_payment: false,
        notes: {
          product: "smart-parking-sticker",
          deliveryType: cleanDeliveryType,
          addressLine: cleanDeliveryType === "physical" ? cleanAddressLine : "",
          shippingEmail: cleanDeliveryType === "physical" ? cleanShippingEmail : "",
          shippingPhone: cleanDeliveryType === "physical" ? cleanShippingPhone : "",
          city: cleanDeliveryType === "physical" ? cleanCity : "",
          state: cleanDeliveryType === "physical" ? cleanState : "",
          pincode: cleanDeliveryType === "physical" ? cleanPincode : "",
          country: cleanDeliveryType === "physical" ? cleanCountry : "",
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
