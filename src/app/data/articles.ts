/**
 * src/app/data/articles.ts
 * All article data in one place - easy to update or move to CMS later
 */

export interface Article {
  id: number;
  title: string;
  excerpt: string;
  body: string[];
  category: string;
  author: string;
  date: string;
  readTime: string;
  tag: string;
  image: string;
  tagColor: string;
  tagBg: string;
}

export const articles: Article[] = [
  {
    id: 1,
    title: "The Hidden Cost of Compound Interest: What Banks Won't Tell You",
    excerpt: "Understanding how compound interest works against you in debt — and for you in investments — is the single most valuable financial concept most people never learn properly.",
    body: [
      "The implications run deeper than most people initially appreciate. Whether you're making decisions about personal finance, health, or scientific understanding, having a solid grasp of the underlying mathematics prevents manipulation.",
      "A savings account earning 5% annually doesn't just add 5% to your balance — it adds 5% to a balance that already includes last year's interest. Over 30 years, a $10,000 deposit becomes $43,219. That's not 150% growth; it's 332% growth.",
      "The same mathematics that works in your favor with investments works against you with debt. A credit card at 20% APR compounded monthly effectively charges 21.94% annually. Most cardholders don't realize they're paying this hidden premium.",
      "The antidote is converting percentages to absolute values. How many hours of post-tax work does this cost? That anchor tends to produce clearer, less manipulable judgments.",
    ],
    category: "Finance",
    author: "Elena Marchetti",
    date: "June 12, 2026",
    readTime: "8 min",
    tag: "FEATURED",
    image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=900&h=500&fit=crop&auto=format",
    tagColor: "#4f46e5",
    tagBg: "#eef0fd",
  },
  {
    id: 2,
    title: "Metric vs Imperial: Why the US Never Switched and the Real Cost",
    excerpt: "The United States is one of three countries that haven't adopted the metric system. We examine the historical decisions, the ongoing cost, and whether a switch is still possible.",
    body: [
      "In 1975, the United States passed the Metric Conversion Act, declaring a national policy of voluntary metric conversion. The key word was voluntary — and Americans largely chose not to voluntarily convert.",
      "The economic cost of maintaining dual systems is staggering. The US Department of Commerce estimated in a 2009 study that dual-system operations cost American businesses $17 billion annually.",
      "The most dramatic example remains the 1999 Mars Climate Orbiter disaster. A $327.6 million spacecraft was lost when one engineering team used imperial units while another used metric.",
      "Several industries have quietly gone fully metric: pharmaceuticals, military, science, and global trade all operate in SI units regardless of what appears on consumer packaging.",
    ],
    category: "Science",
    author: "David Okafor",
    date: "June 8, 2026",
    readTime: "6 min",
    tag: "ANALYSIS",
    image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=900&h=500&fit=crop&auto=format",
    tagColor: "#06b6d4",
    tagBg: "#ecfeff",
  },
  {
    id: 3,
    title: "BMI is Broken: A Better Framework for Measuring Health",
    excerpt: "Body Mass Index was invented in the 1830s for statistical population studies — not individual health assessment. Here's what modern medicine uses instead.",
    body: [
      "Adolphe Quetelet was a Belgian mathematician, not a physician. He developed the Quetelet Index in 1832 as a tool for characterizing the average man in population statistics.",
      "The formula divides weight in kilograms by the square of height in meters. It has no way to distinguish between muscle and fat, and doesn't account for bone density.",
      "Modern sports medicine favors waist-to-hip ratio, DEXA body composition scans, and metabolic markers like fasting insulin and triglycerides.",
      "Despite its limitations, BMI remains widely used because it's free, requires no equipment, and produces a single number easy to track across large populations.",
    ],
    category: "Health",
    author: "Dr. Sadia Rahman",
    date: "June 3, 2026",
    readTime: "7 min",
    tag: "HEALTH",
    image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=900&h=500&fit=crop&auto=format",
    tagColor: "#10b981",
    tagBg: "#d1fae5",
  },
  {
    id: 4,
    title: "How Logarithms Changed Navigation Forever",
    excerpt: "Before calculators, sailors used logarithm tables to multiply enormous numbers through addition. This elegant trick made ocean navigation tractable and saved countless lives.",
    body: [
      "John Napier published his discovery of logarithms in 1614. Within a decade, navigators worldwide had adopted logarithm tables as essential shipboard equipment.",
      "The core insight: multiplication becomes addition in log space. log(A × B) = log(A) + log(B). For a navigator working with 6-digit celestial position numbers, this transformed hours into minutes.",
      "Henry Briggs refined Napier's work into base-10 logarithms and spent years computing tables by hand to 14 decimal places — the primary computational tool until electronic calculators arrived.",
      "Logarithms still underpin modern technology: the decibel scale, the Richter scale, the pH scale, and your smartphone's dynamic range compression all rely on logarithmic mathematics.",
    ],
    category: "Mathematics",
    author: "Prof. James Weatherington",
    date: "May 28, 2026",
    readTime: "10 min",
    tag: "HISTORY",
    image: "https://images.unsplash.com/photo-1509228468518-180dd4864904?w=900&h=500&fit=crop&auto=format",
    tagColor: "#f59e0b",
    tagBg: "#fef3c7",
  },
  {
    id: 5,
    title: "The Psychology of Percentage Thinking",
    excerpt: "Our brains are notoriously bad at understanding percentages in context. Why 20% off a $400 item feels bigger than 20% off a $40 item — even though proportionally they're identical.",
    body: [
      "Amos Tversky and Daniel Kahneman documented a striking finding in 1981: people would drive 20 minutes to save $5 on a $15 calculator but wouldn't drive the same distance to save $5 on a $1,000 computer.",
      "This is proportional thinking failure. We evaluate gains and losses relative to a reference point, not in absolute terms. The $5 saving feels large against $15 (33%) but trivial against $1,000 (0.5%).",
      "Retailers exploit this systematically. A $500 item marked down from $800 feels like a bargain even if the original price was artificially inflated.",
      "The antidote is converting percentages to absolute values before making decisions — how many hours of your post-tax work time does this cost?",
    ],
    category: "Psychology",
    author: "Mia Kowalski",
    date: "May 20, 2026",
    readTime: "5 min",
    tag: "PSYCHOLOGY",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=900&h=500&fit=crop&auto=format",
    tagColor: "#ec4899",
    tagBg: "#fce7f3",
  },
  {
    id: 6,
    title: "Unit Conversion Errors That Changed History",
    excerpt: "The Mars Climate Orbiter was lost because one team used imperial units while another used metric. A tour of history's most expensive conversion mistakes.",
    body: [
      "The Mars Climate Orbiter failure in 1999 is the most famous unit conversion disaster, but the Gimli Glider incident of 1983 saw an Air Canada Boeing 767 run out of fuel mid-flight due to a metric-to-imperial mistake.",
      "Columbus's 1492 voyage was built on a unit conversion error — he confused the Arabic mile with the Roman mile when estimating Earth's circumference, concluding Asia was reachable by sailing west.",
      "The lesson is not that unit systems are dangerous — it's that they're invisible until they break. The most reliable safeguard is dimensional analysis: tracking units through every calculation.",
      "Several industries have quietly standardized on SI units regardless of regional convention, specifically to eliminate this class of error from safety-critical systems.",
    ],
    category: "Engineering",
    author: "Carlos Ybarra",
    date: "May 15, 2026",
    readTime: "9 min",
    tag: "ENGINEERING",
    image: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=900&h=500&fit=crop&auto=format",
    tagColor: "#4f46e5",
    tagBg: "#eef0fd",
  },
];
