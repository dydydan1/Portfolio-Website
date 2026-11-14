export const CALENDLY_URL =
  "https://calendly.com/dyann-razonado-5/30min";

export const CALENDLY_EMBED =
  CALENDLY_URL +
  "?hide_gdpr_banner=1&primary_color=C9431D&embed_type=Inline&embed_domain=dyannrazonado.vercel.app";

export const EMAIL = "dyann.razonado.5@gmail.com";
const assetBase = import.meta.env.BASE_URL;

export const projects = [
  {
    id: "tasksy",
    index: "01",
    title: "Tasksy",
    kind: "Full-stack to-do app",
    description:
      "A to-do list with accounts, so tasks survive a refresh. Create, edit, tick off, and clear them from one screen, with a database holding the list.",
    tags: ["React", "Full-stack", "CRUD"],
    href: "https://crud-react-vert-eight.vercel.app/",
    image: `${assetBase}work/tasksy.jpg`,
    alt: "Tasksy landing page with the headline “Keep your tasks organized and simple.”",
  },
  {
    id: "crumbcoded",
    index: "02",
    title: "CrumbCoded",
    kind: "Ordering for a cake business",
    description:
      "Buyers attach a personal note to an order. The shop prints it as a QR code on the box, and whoever opens the cake scans it to read the message.",
    tags: ["QR codes", "Ordering", "Accounts"],
    href: "https://crumbcoded.onrender.com/",
    image: `${assetBase}work/crumbcoded.jpg`,
    alt: "CrumbCoded sign-in screen for its QR message studio.",
  },
  {
    id: "gymhub",
    index: "03",
    title: "Gymhub",
    kind: "Gym management system",
    description:
      "Memberships, trainer schedules, and payments in one admin. Built as my capstone, and it now runs a real gym under the name ASG Strength.",
    tags: ["Capstone", "Admin", "Scheduling"],
    href: "https://asgstrength.online/",
    image: `${assetBase}work/gymhub.jpg`,
    alt: "ASG Strength homepage with the headline “Transform Your Body, Transform Your Life”.",
  },
];
