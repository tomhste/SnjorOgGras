#!/usr/bin/env node
/**
 * Run this live with the kids: `npm run interview`
 *
 * A little terminal Q&A that walks through the business details baked
 * into the site (src/lib/content.ts) and lets you update them on the
 * spot — new team member, different phone number, new service blurb,
 * etc. Answers are written straight back into content.ts, in Icelandic,
 * formatted exactly like the existing file.
 */
import { createInterface } from "node:readline/promises";
import { writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const contentPath = path.join(__dirname, "..", "src", "lib", "content.ts");

const rl = createInterface({ input: process.stdin, output: process.stdout });

async function ask(question, fallback) {
  const suffix = fallback ? ` (Enter = "${fallback}")` : "";
  const answer = (await rl.question(`${question}${suffix}\n> `)).trim();
  return answer || fallback || "";
}

async function askYesNo(question, fallback = true) {
  const hint = fallback ? "J/n" : "j/N";
  const answer = (await rl.question(`${question} (${hint})\n> `)).trim().toLowerCase();
  if (!answer) return fallback;
  return answer.startsWith("j");
}

function esc(str) {
  return str.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

async function main() {
  console.log("\n🧊🌱 Snjór & Gras — spjall um vefsíðuna\n");
  console.log(
    "Svaraðu spurningunum hér fyrir neðan. Ýttu bara á Enter til að halda í núverandi svar.\n"
  );

  const phone = await ask("Hvert er símanúmerið sem á að birtast?", "8338568");
  const location = await ask("Hvar eigið þið heima / starfið þið?", "Álftanes");
  const tagline = await ask(
    "Stutt slagorð fyrir síðuna?",
    "Snjómokstur á veturna. Garðsláttur á sumrin."
  );
  const intro = await ask(
    "Kynningartexti (1-2 setningar um ykkur)?",
    "Við erum þrír ungir strákar á Álftanesi sem mokum snjó á veturna og sláum garða á sumrin. Tilboð fer eftir magni vinnu og stærð svæðis."
  );
  const notifyEmail = await ask(
    "Á hvaða netfang eiga tilkynningar um nýjar beiðnir að berast?",
    "tomhste@gmail.com"
  );

  console.log("\n--- Þjónusta ---");
  const snowDesc = await ask(
    "Lýsing á snjómokstri?",
    "Snjómokstur í innkeyrslum og á bílaplönum. Við mætum fljótt eftir að það snjóar svo þú kemst leiðar þinnar."
  );
  const grassDesc = await ask(
    "Lýsing á garðslætti?",
    "Garðsláttur fyrir heimili á Álftanesi — við mætum með sláttuvél og sláttuorf fyrir kanta og erfiða bletti. Við sláum reglulega eða eftir þörfum — þú ákveður."
  );

  console.log("\n--- Hverjir eru með? ---");
  const owners = [];
  const defaults = [
    { name: "Sturla Már Óskarsson", role: "Eigandi og verkstjóri" },
    { name: "Steinar Már Óskarsson", role: "Eigandi" },
    { name: "Frosti Tryggvason", role: "Eigandi" },
  ];
  for (const d of defaults) {
    const keep = await askYesNo(`Er "${d.name}" (${d.role}) ennþá með?`, true);
    if (keep) owners.push(d);
  }
  while (await askYesNo("Bæta við öðrum aðila?", false)) {
    const name = await ask("Nafn?");
    const role = await ask("Hlutverk?", "Eigandi");
    if (name) owners.push({ name, role });
  }

  if (owners.length === 0) owners.push(...defaults);

  const notifyChanged = notifyEmail !== "tomhste@gmail.com";

  const output = `/**
 * All the real-world business info for Snjór & Gras, pulled straight from
 * what the owners sent — kept in one place so copy edits don't need to
 * touch component code.
 *
 * Generated/updated by \`npm run interview\`.
 */

export const business = {
  name: "Snjór & Gras",
  tagline: "${esc(tagline)}",
  intro: "${esc(intro)}",
  phone: "${esc(phone)}",
  phoneHref: "tel:+354${esc(phone)}",
  smsHref: "sms:+354${esc(phone)}",
  location: "${esc(location)}",
  // Where new-order email notifications are sent. Must exactly match the
  // address allowed in firestore.rules (isValidMail) — update both places
  // together if this ever changes.
  notifyEmail: "${esc(notifyEmail)}",
};

export const services = [
  {
    id: "snow" as const,
    season: "Vetur",
    title: "Snjómokstur",
    description: "${esc(snowDesc)}",
    icon: "snow" as const,
  },
  {
    id: "grass" as const,
    season: "Sumar",
    title: "Garðsláttur",
    description: "${esc(grassDesc)}",
    icon: "grass" as const,
  },
];

export const team = [
${owners.map((o) => `  {\n    name: "${esc(o.name)}",\n    role: "${esc(o.role)}",\n  },`).join("\n")}
];
`;

  await writeFile(contentPath, output, "utf8");

  console.log("\n✅ src/lib/content.ts uppfærð!");
  if (notifyChanged) {
    console.log(
      "⚠️  Þú breyttir tilkynningarnetfanginu — mundu að uppfæra líka\n" +
        "   'isValidMail' fallið í firestore.rules (sami tölvupóstur þarf\n" +
        "   að standa þar) og keyra svo: npx firebase deploy --only firestore:rules"
    );
  }
  console.log("Keyrðu `npm run dev` til að sjá breytingarnar.\n");

  rl.close();
}

main().catch((err) => {
  console.error(err);
  rl.close();
  process.exit(1);
});
