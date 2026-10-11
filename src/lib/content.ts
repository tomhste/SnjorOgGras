/**
 * All the real-world business info for Snjór & Gras, pulled straight from
 * what the owners sent — kept in one place so copy edits don't need to
 * touch component code.
 */

export const business = {
  name: "Snjór & Gras",
  tagline: "Snjómokstur á veturna. Garðsláttur á sumrin.",
  intro:
    "Við erum þrír ungir strákar á Álftanesi sem mokum snjó á veturna og sláum garða á sumrin. Tilboð fer eftir magni vinnu og stærð svæðis.",
  phone: "8338568",
  phoneHref: "tel:+3548338568",
  smsHref: "sms:+3548338568",
  location: "Álftanes",
  // Where new-order email notifications are sent. Must exactly match the
  // address allowed in firestore.rules (isValidMail) — update both places
  // together if this ever changes.
  notifyEmail: "sturlamar.gardslattur@gmail.com",
  // Default Firebase Hosting URL — swap this for a custom domain later if
  // you buy one, and update it here so SEO/social metadata stays correct.
  siteUrl: "https://snjoroggras.web.app",
};

export const services = [
  {
    id: "snow" as const,
    season: "Vetur",
    title: "Snjómokstur",
    description:
      "Snjómokstur í innkeyrslum og á bílaplönum. Við mætum fljótt eftir að það snjóar svo þú kemst leiðar þinnar.",
    icon: "snow" as const,
  },
  {
    id: "grass" as const,
    season: "Sumar",
    title: "Garðsláttur",
    description:
      "Garðsláttur fyrir heimili á Álftanesi — við mætum með sláttuvél og sláttuorf fyrir kanta og erfiða bletti. Við sláum reglulega eða eftir þörfum — þú ákveður.",
    icon: "grass" as const,
  },
];

export const team = [
  {
    name: "Sturla Már Óskarsson",
    role: "Eigandi og verkstjóri",
  },
  {
    name: "Steinar Már Óskarsson",
    role: "Eigandi",
  },
  {
    name: "Frosti Tryggvason",
    role: "Eigandi",
  },
];
