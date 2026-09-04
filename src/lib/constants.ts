// Personal / contact details (sourced from ~/Development/resume/main.typ)
export const MAIL_ADDRESS = "rdhruva12345@gmail.com";
export const GITHUB_URL = "https://github.com/dhruva430";
export const LINKEDIN_URL = "https://www.linkedin.com/in/dhruva430/";

// Resume lives in /public and is served as a static asset.
export const RESUME_URL = "/resume.pdf";
export const RESUME_FILENAME = "Dhruva_Kushwaha_Resume.pdf";

// Google Form backing the contact form (field IDs copied from the
// full-stack portfolio's Google Form so submissions land in the same sheet).
export const CONTACT_FORM_URL =
  "https://docs.google.com/forms/d/e/1FAIpQLScKJFATcap4dSMvnPk-skpMfZyMEQvBSyggN5_teeibVRpvsw/formResponse";
export const CONTACT_FORM_FIELDS = {
  name: "entry.484269063",
  email: "entry.2024677057",
  subject: "entry.48301378",
  message: "entry.1927163109",
} as const;
