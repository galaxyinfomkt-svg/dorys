/* Insert a CSS-only filterable image gallery into the home, after #services.
   Uses existing site images, framed honestly as the environments Dory's
   sanitizes (not fake "our projects"). No JS — radio+:checked filtering. */
const fs = require("fs");
const fp = "data/home.json";
const d = JSON.parse(fs.readFileSync(fp, "utf8"));
let h = d.mainHtml;
if (h.includes("home-gallery")) { console.log("gallery already present"); process.exit(0); }

const IMG = "/assets/images/services/";
const items = [
  ["medical", "Medical Offices", "medical-office-new.webp"],
  ["medical", "Physician Practices", "healthcare-cleaning-office.webp"],
  ["medical", "Medical Office Sanitation", "medical-office-cleaning.webp"],
  ["specialty", "Specialty Clinics", "specialty-clinic.webp"],
  ["specialty", "Outpatient Sanitation", "clinic-outpatient-sanitation.webp"],
  ["ambulatory", "Ambulatory & Outpatient", "ambulatory-facility.webp"],
  ["rehab", "Rehab & Nursing", "rehab-nursing.webp"],
  ["rehab", "Assisted Living & Senior Care", "assisted-living-senior-care.webp"],
  ["admin", "Healthcare Admin Offices", "healthcare-admin.webp"],
  ["action", "Our Team in Action", "healthcare-cleaning-team-1.webp"],
  ["action", "Environmental Services Crew", "healthcare-cleaning-team-2.webp"],
  ["action", "Terminal Disinfection", "bed-cleaning-disinfection.webp"],
  ["action", "Infection-Control Cleaning", "infection-control-disinfection.webp"],
];
const tabs = [
  ["all", "All"], ["medical", "Medical Offices"], ["specialty", "Specialty Clinics"],
  ["ambulatory", "Ambulatory"], ["rehab", "Rehab & Nursing"], ["admin", "Admin"], ["action", "In Action"],
];

const radios = tabs.map((t, i) =>
  `<input type="radio" name="gf" id="gf-${t[0]}" class="gallery-filter"${i === 0 ? " checked" : ""}>`).join("\n ");
const tabEls = tabs.map(t =>
  `<label for="gf-${t[0]}" class="gallery-tab">${t[1]}</label>`).join("\n ");
const figs = items.map(it =>
  `<figure class="gallery-item cat-${it[0]}"><img src="${IMG}${it[2]}" alt="${it[1]} — healthcare cleaning by Dory's" loading="lazy" decoding="async" width="600" height="400"><figcaption>${it[1]}</figcaption></figure>`).join("\n ");

const section = `<section class="section section--light home-gallery">
 <div class="container">
 <div class="section__header section__header--center">
 <span class="section__badge">Environments We Serve</span>
 <h2 class="section__title">The Healthcare Environments We Sanitize</h2>
 <p class="section__description">From medical offices and specialty clinics to ambulatory centers, rehab &amp; nursing facilities, and healthcare administration — clinical-grade sanitation tailored to each environment.</p>
 </div>
 ${radios}
 <div class="gallery-tabs">${tabEls}</div>
 <div class="gallery-grid">${figs}</div>
 </div>
 </section>
 `;

// insert after the #services section's closing </section>
const si = h.indexOf('id="services"');
const close = h.indexOf("</section>", si) + "</section>".length;
d.mainHtml = h.slice(0, close) + "\n " + section + h.slice(close);
fs.writeFileSync(fp, JSON.stringify(d) + "\n");
console.log("gallery inserted after #services:", d.mainHtml.includes("home-gallery"), "| items:", items.length);
