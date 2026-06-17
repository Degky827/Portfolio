const { generateGeminiResponse } = require("./gemini.service");
const { SYSTEM_PROMPT } = require("../prompts/system.prompt");
const Skill = require("../../shared/models/Skill");
const Project = require("../../shared/models/Project");
const AboutContent = require("../../shared/models/AboutContent");
const HomeContent = require("../../shared/models/HomeContent");
const SiteSettings = require("../../shared/models/SiteSettings");
const ContactContent = require("../../shared/models/ContactContent");
const FooterContent = require("../../shared/models/FooterContent");

function formatList(items, fn) {
  return items.map(fn).join("\n");
}

async function buildPortfolioContext() {
  const [
    skills,
    projects,
    about,
    home,
    siteSettings,
    contact,
    footer,
  ] = await Promise.all([
    Skill.find({ status: "active" }).sort({ category: 1, displayOrder: 1 }).lean(),
    Project.find({ published: true, archived: false }).sort({ featured: -1, displayOrder: 1 }).lean(),
    AboutContent.findOne({ status: "active" }).lean(),
    HomeContent.findOne({ published: true }).lean(),
    SiteSettings.findOne().sort({ createdAt: -1 }).lean(),
    ContactContent.findOne().sort({ createdAt: -1 }).lean(),
    FooterContent.findOne({ status: "active" }).lean(),
  ]);

  const parts = [];

  // ── Identity ──
  const brand = siteSettings || home || {};
  const brandName = brand.brandName || "Desalegn Kasaye";
  const nameAmharic = brand.nameAmharic || "ደካ";
  const badge = brand.professionalBadge || "Student Developer";
  const greeting = brand.greeting || "Hi, I'm";

  parts.push(`PORTFOLIO OWNER: ${brandName} (${nameAmharic})`);
  parts.push(`PROFESSIONAL BADGE: ${badge}`);
  parts.push(`GREETING: ${greeting}`);

  if (siteSettings?.shortIntroduction) {
    parts.push(`SHORT INTRODUCTION: ${siteSettings.shortIntroduction}`);
  }
  if (siteSettings?.email) {
    parts.push(`EMAIL: ${siteSettings.email}`);
  }
  if (siteSettings?.phone) {
    parts.push(`PHONE: ${siteSettings.phone}`);
  }

  const social = siteSettings?.socialLinks || home?.socialLinks || {};
  const socialParts = [];
  if (social.github) socialParts.push(`GitHub: ${social.github}`);
  if (social.linkedin) socialParts.push(`LinkedIn: ${social.linkedin}`);
  if (social.telegram) socialParts.push(`Telegram: ${social.telegram}`);
  if (social.twitter) socialParts.push(`Twitter: ${social.twitter}`);
  if (social.email) socialParts.push(`Email: ${social.email}`);
  if (socialParts.length) {
    parts.push(`SOCIAL LINKS:\n${socialParts.join("\n")}`);
  }

  // ── About ──
  if (about) {
    if (about.title) parts.push(`ABOUT TITLE: ${about.title}`);
    if (about.subtitle) parts.push(`ABOUT SUBTITLE: ${about.subtitle}`);
    if (about.location) parts.push(`LOCATION: ${about.location}`);
    if (about.yearsOfExperience) parts.push(`YEARS OF EXPERIENCE: ${about.yearsOfExperience}`);
    if (about.storyPillars?.length) {
      parts.push("STORY PILLARS:");
      about.storyPillars.forEach((p) => {
        if (p.title) parts.push(`  ${p.title}: ${p.content || "(no details)"}`);
      });
    }
    if (about.education?.length) {
      parts.push("EDUCATION:");
      about.education.forEach((e) => {
        parts.push(`  - ${e.degree || "Degree"} at ${e.institution || "Institution"} (${e.year || "N/A"})`);
      });
    }
    if (about.experience?.length) {
      parts.push("EXPERIENCE:");
      about.experience.forEach((e) => {
        parts.push(`  - ${e.role || "Role"} at ${e.company || "Company"} (${e.duration || "N/A"}): ${e.description || ""}`);
      });
    }
    if (about.certifications?.length) {
      parts.push("CERTIFICATIONS:");
      about.certifications.forEach((c) => {
        parts.push(`  - ${c.title || "Certification"}${c.verificationUrl ? ` (${c.verificationUrl})` : ""}`);
      });
    }
    if (about.idePresentation?.skills?.length) {
      parts.push(`IDE SKILLS: ${about.idePresentation.skills.join(", ")}`);
    }
    if (about.highlightMetrics?.length) {
      parts.push("HIGHLIGHTS:");
      about.highlightMetrics.forEach((m) => {
        if (m.title && m.value) parts.push(`  - ${m.title}: ${m.value}`);
      });
    }
  }

  // ── Skills ──
  if (skills?.length) {
    const byCategory = {};
    for (const s of skills) {
      if (!byCategory[s.category]) byCategory[s.category] = [];
      byCategory[s.category].push(s);
    }
    parts.push("SKILLS:");
    for (const [cat, items] of Object.entries(byCategory)) {
      const names = items.map((s) => {
        let entry = s.name;
        if (s.proficiency != null) entry += ` (${s.proficiency}%)`;
        if (s.featured) entry += " [FEATURED]";
        return entry;
      });
      parts.push(`  ${cat}: ${names.join(", ")}`);
    }
  }

  // ── Projects ──
  if (projects?.length) {
    parts.push("PROJECTS:");
    projects.forEach((p) => {
      parts.push(`  - ${p.title}${p.featured ? " [FEATURED]" : ""}`);
      if (p.shortDescription) parts.push(`    Description: ${p.shortDescription}`);
      if (p.technologies?.length) parts.push(`    Technologies: ${p.technologies.join(", ")}`);
      if (p.githubUrl) parts.push(`    GitHub: ${p.githubUrl}`);
      if (p.liveDemoUrl) parts.push(`    Live Demo: ${p.liveDemoUrl}`);
      if (p.status) parts.push(`    Status: ${p.status}`);
      parts.push("");
    });
  }

  // ── Contact ──
  if (contact) {
    if (contact.email) parts.push(`CONTACT EMAIL: ${contact.email}`);
    if (contact.phone) parts.push(`CONTACT PHONE: ${contact.phone}`);
    if (contact.address) parts.push(`CONTACT ADDRESS: ${contact.address}`);
  }

  // ── Footer ──
  if (footer) {
    if (footer.brandName) parts.push(`FOOTER BRAND: ${footer.brandName}`);
    if (footer.brandDescription) parts.push(`FOOTER DESCRIPTION: ${footer.brandDescription}`);
    if (footer.copyrightText) parts.push(`COPYRIGHT: ${footer.copyrightText}`);
    if (footer.emailAddress) parts.push(`FOOTER EMAIL: ${footer.emailAddress}`);
    if (footer.phoneNumber) parts.push(`FOOTER PHONE: ${footer.phoneNumber}`);
  }

  return parts.join("\n\n");
}

const processRAGQuery = async (userMessage) => {
  try {
    const context = await buildPortfolioContext();

    const finalPrompt = [
      SYSTEM_PROMPT,
      "",
      "==============================",
      "PORTFOLIO CONTEXT:",
      "==============================",
      "",
      context || "(No portfolio data available yet)",
      "",
      "==============================",
      "VISITOR QUESTION:",
      "==============================",
      "",
      userMessage,
      "",
      "==============================",
      "AI ANSWER:",
      "==============================",
    ].join("\n");

    const answer = await generateGeminiResponse(finalPrompt);
    return answer;
  } catch (error) {
    console.error("RAG Service Error:", error);
    throw error;
  }
};

module.exports = {
  processRAGQuery,
};
