// Single source of truth for portfolio content.
// Edit this file to update the live site (when no backend API is configured).
// The backend seed file mirrors this data.

import type {
  Project,
  Service,
  Skill,
  UserProfile,
} from "@/types/portfolio";

export const profile: UserProfile = {
  id: "profile-1",
  name: "Sameh Naim",
  location: "Cairo, Egypt",
  title: "Freelance Moodle Developer & Full-Stack Engineer",
  short_bio:
    "I help schools, universities and training centers get the most out of Moodle — from custom plugins and integrations to full school management systems.",
  long_bio:
    "I'm a freelance Moodle administrator and full-stack developer based in Cairo. For the past several years I've built custom Moodle plugins, school management systems, and timetable platforms for educational organizations. I work across the full stack — PHP and Node.js on the backend, JavaScript on the frontend, MySQL/PostgreSQL for data, and AWS + Linux for hosting and operations. I particularly enjoy the messy parts: debugging slow Moodle instances, tuning a misbehaving server, and integrating systems that were never designed to talk to each other.",
  avatar_url: "",
  years_experience: 8,
  email: "hello@samehnaim.dev",
  github_url: "https://github.com/",
  linkedin_url: "https://linkedin.com/in/",
};

export const skills: Skill[] = [
  // Moodle & LMS
  { id: "s1", name: "Moodle Core", category: "Moodle & LMS", level: "expert", icon: "graduation-cap" },
  { id: "s2", name: "Plugin Development", category: "Moodle & LMS", level: "expert", icon: "puzzle" },
  { id: "s3", name: "Theme Customization", category: "Moodle & LMS", level: "advanced", icon: "palette" },
  { id: "s4", name: "Moodle Web Services / API", category: "Moodle & LMS", level: "expert", icon: "plug" },
  { id: "s5", name: "LMS Migration & Upgrades", category: "Moodle & LMS", level: "expert", icon: "arrow-up-circle" },

  // Backend
  { id: "s6", name: "PHP", category: "Backend", level: "expert", icon: "code" },
  { id: "s7", name: "Node.js", category: "Backend", level: "advanced", icon: "server" },
  { id: "s8", name: "MySQL", category: "Backend", level: "expert", icon: "database" },
  { id: "s9", name: "PostgreSQL", category: "Backend", level: "advanced", icon: "database" },
  { id: "s10", name: "REST API Design", category: "Backend", level: "expert", icon: "git-merge" },

  // Frontend
  { id: "s11", name: "JavaScript", category: "Frontend", level: "expert", icon: "code-2" },
  { id: "s12", name: "TypeScript", category: "Frontend", level: "advanced", icon: "code-2" },
  { id: "s13", name: "React / Next.js", category: "Frontend", level: "advanced", icon: "atom" },
  { id: "s14", name: "Tailwind CSS", category: "Frontend", level: "advanced", icon: "wind" },

  // DevOps & Cloud
  { id: "s15", name: "AWS (EC2, RDS, S3)", category: "DevOps & Cloud", level: "advanced", icon: "cloud" },
  { id: "s16", name: "Linux Server Management", category: "DevOps & Cloud", level: "expert", icon: "terminal" },
  { id: "s17", name: "Docker", category: "DevOps & Cloud", level: "advanced", icon: "container" },
  { id: "s18", name: "Nginx / Apache", category: "DevOps & Cloud", level: "advanced", icon: "globe" },
  { id: "s19", name: "CI/CD", category: "DevOps & Cloud", level: "intermediate", icon: "git-branch" },
];

export const services: Service[] = [
  {
    id: "sv1",
    title: "Moodle Setup & Hosting",
    short_description:
      "Production-ready Moodle installations on your own server or AWS, tuned for performance.",
    detailed_description:
      "I set up Moodle from scratch on your infrastructure: server provisioning, PHP-FPM tuning, database optimization, caching (Redis/Memcached), HTTPS, backups, and monitoring. I also handle migrations from older Moodle versions or from other LMS platforms with zero data loss.",
    target_clients: ["Schools", "Universities", "Training centers"],
    icon: "server",
  },
  {
    id: "sv2",
    title: "Custom Moodle Plugin Development",
    short_description:
      "Blocks, activity modules, local plugins, reports, and admin tools — built to Moodle coding standards.",
    detailed_description:
      "Need functionality Moodle doesn't ship with? I build custom blocks, activity modules, local plugins, gradebook extensions, custom reports, and admin tools. Every plugin is built to Moodle coding standards, properly internationalized, and shipped with upgrade scripts.",
    target_clients: ["Schools", "Universities", "EdTech companies"],
    icon: "puzzle",
  },
  {
    id: "sv3",
    title: "Theme Customization & Branding",
    short_description: "Pixel-accurate Moodle themes that reflect your brand and improve UX.",
    detailed_description:
      "Custom Moodle themes built on Boost — including layout changes, mobile-first responsive design, custom dashboards, and white-label branding for your institution.",
    target_clients: ["Schools", "Universities", "Corporate training"],
    icon: "palette",
  },
  {
    id: "sv4",
    title: "External System Integration",
    short_description:
      "Connect Moodle to your timetable, SIS, payment gateway, or Google Classroom.",
    detailed_description:
      "I build integrations between Moodle and external systems — student information systems, timetable platforms (including timetable.digital), Google Classroom, payment gateways, HR systems, and custom APIs. I use Moodle web services properly so integrations survive upgrades.",
    target_clients: ["Schools", "Universities", "EdTech companies"],
    icon: "plug",
  },
  {
    id: "sv5",
    title: "Performance & Server Optimization",
    short_description:
      "Slow Moodle? I diagnose, profile, and fix. Most installs can be 3–10x faster.",
    detailed_description:
      "I audit your Moodle install end-to-end — PHP version and config, MySQL slow queries and indexes, opcache, Moodle MUC caches, cron, file storage, and frontend asset delivery. You get a written report and the fixes implemented.",
    target_clients: ["Schools", "Universities", "Training centers"],
    icon: "zap",
  },
];

export const projects: Project[] = [
  {
    id: "p1",
    name: "Student Attendance Block",
    slug: "student-attendance-block",
    short_description:
      "Moodle block that surfaces each student's attendance stats per course, with a card layout and carousel.",
    long_description:
      "A custom Moodle block that gives students and teachers an at-a-glance view of attendance across courses. Pulls live data from mod_attendance, aggregates it per course, and displays it in a swipeable card carousel on the dashboard.",
    problem:
      "Students and teachers had to dig into the mod_attendance reports inside each course to see attendance numbers. There was no consolidated, friendly view.",
    solution:
      "Built a Moodle block that queries mod_attendance data across all of a user's courses, aggregates totals (present / absent / late / excused), and renders them as cards in a carousel. Cached aggressively via MUC to keep the dashboard snappy.",
    outcomes: [
      "Reduced 'where do I see my attendance?' support requests significantly",
      "Loads in <100ms thanks to MUC caching",
      "Reused across multiple Moodle 4.x sites",
    ],
    tech_stack: ["Moodle", "PHP", "MySQL", "JavaScript", "Mustache", "MUC caching"],
    role: "Sole developer",
    start_date: "2024-01-01",
    end_date: "2024-04-01",
    status: "live",
    featured: true,
    project_type: "Moodle plugin",
    live_url: null,
    demo_url: null,
    github_url: null,
  },
  {
    id: "p2",
    name: "Engagement & Analytics Dashboard",
    slug: "engagement-analytics-dashboard",
    short_description:
      "Planned freemium Moodle plugin for tracking student engagement with rich charts.",
    long_description:
      "A Moodle local plugin (in active development) that tracks student engagement signals — logins, resource views, forum posts, assignment submissions, quiz attempts — and visualizes them as time-series charts and at-risk learner alerts. Planned freemium model: core dashboard free, advanced segmentation and exports paid.",
    problem:
      "Moodle's built-in analytics are powerful but not approachable. Teachers want a visual, daily-use dashboard that flags struggling students early.",
    solution:
      "Building a local plugin with its own scheduled task that aggregates engagement events into a denormalized table for fast querying, and renders dashboards with Chart.js. At-risk detection uses simple thresholds out of the box and integrates with Moodle's analytics API for ML predictions.",
    outcomes: [
      "Architecture designed for sites with 10k+ active learners",
      "Pluggable risk-scoring strategies",
      "Targeting Moodle 4.3+ release in 2025",
    ],
    tech_stack: ["Moodle", "PHP", "MySQL", "Chart.js", "Moodle Analytics API"],
    role: "Founder & developer",
    start_date: "2024-09-01",
    end_date: null,
    status: "in progress",
    featured: true,
    project_type: "Moodle plugin",
    live_url: null,
    demo_url: null,
    github_url: null,
  },
  {
    id: "p3",
    name: "timetable.digital",
    slug: "timetable-digital",
    short_description:
      "SaaS timetable scheduling platform with API and Moodle integration; Google Classroom integration on the roadmap.",
    long_description:
      "timetable.digital is a SaaS I own and develop. It generates and manages class timetables for schools and universities, exposes a clean REST API, and integrates with Moodle so course schedules sync into the LMS automatically. Google Classroom integration is on the near-term roadmap.",
    problem:
      "Schools juggle timetables in spreadsheets and then re-enter the same data into their LMS. Mistakes happen, schedules drift, students get confused.",
    solution:
      "A purpose-built scheduling app with conflict detection, room/teacher constraints, and a public REST API. The Moodle integration plugin pulls schedule data and renders it inside courses and on the user dashboard.",
    outcomes: [
      "Used in production by multiple schools",
      "API consumed by Moodle plugin and external integrations",
      "Roadmap: Google Classroom sync, mobile app",
    ],
    tech_stack: ["Node.js", "TypeScript", "PostgreSQL", "React", "Moodle API", "AWS"],
    role: "Founder, lead developer",
    start_date: "2022-06-01",
    end_date: null,
    status: "live",
    featured: true,
    project_type: "SaaS app",
    live_url: "https://timetable.digital",
    demo_url: null,
    github_url: null,
  },
  {
    id: "p4",
    name: "School Management System (MVP)",
    slug: "school-management-system-mvp",
    short_description:
      "Internal school management MVP covering students, classes, attendance, and fees.",
    long_description:
      "A school management system MVP built for an internal client. Covers student records, class assignments, daily attendance, and a basic fees module with invoice generation.",
    problem:
      "A small school was managing students, attendance, and fees across three different spreadsheets and a paper ledger. Nothing reconciled.",
    solution:
      "Designed and built a single web app: relational data model in MySQL, PHP backend exposing a small REST API, and a JavaScript frontend. Role-based access for admin, teachers, and accountants. Fees module generates printable invoices and tracks paid/unpaid.",
    outcomes: [
      "Replaced three spreadsheets and a ledger with one source of truth",
      "Daily attendance now takes minutes instead of hours",
      "Fees collection visibility went from monthly to real-time",
    ],
    tech_stack: ["PHP", "Node.js", "MySQL", "JavaScript", "Bootstrap"],
    role: "Lead developer",
    start_date: "2023-03-01",
    end_date: "2023-10-01",
    status: "live",
    featured: true,
    project_type: "School management system",
    live_url: null,
    demo_url: null,
    github_url: null,
  },
  {
    id: "p5",
    name: "Custom WordPress & WooCommerce Plugins",
    slug: "wordpress-woocommerce-plugins",
    short_description:
      "Custom WordPress plugins and WooCommerce extensions for content and e-commerce clients.",
    long_description:
      "A range of custom WordPress plugins built for clients — including WooCommerce extensions, custom post types, REST API endpoints, and admin dashboards. Work spans content sites and small e-commerce stores.",
    problem:
      "Off-the-shelf plugins almost did what clients needed but always fell short on the last 10% — custom checkout fields, integrations with internal systems, custom shipping logic.",
    solution:
      "Wrote tightly-scoped custom plugins instead of forcing bloated alternatives. Each plugin is small, well-documented, and follows WordPress coding standards.",
    outcomes: [
      "Clients shipped features competitors couldn't",
      "Lower plugin footprint = faster sites",
      "Clean upgrade paths across WP versions",
    ],
    tech_stack: ["WordPress", "WooCommerce", "PHP", "MySQL", "JavaScript"],
    role: "Freelance developer",
    start_date: "2021-01-01",
    end_date: "2024-01-01",
    status: "live",
    featured: false,
    project_type: "WordPress plugin",
    live_url: null,
    demo_url: null,
    github_url: null,
  },
];

export const testimonials = [
  {
    quote:
      "Sameh rebuilt our Moodle instance from a slow, crashing nightmare into something our staff actually enjoy using. The custom attendance block alone saved hours every week.",
    author: "IT Director",
    organization: "Private school, Cairo",
  },
  {
    quote:
      "We needed our timetable system to talk to Moodle. Sameh delivered a clean integration that just works — and is still working two years later.",
    author: "Head of Academics",
    organization: "Training center",
  },
  {
    quote:
      "Reliable, communicative, and genuinely good at the unglamorous parts of LMS work — performance tuning, server hardening, plugin upgrades.",
    author: "CTO",
    organization: "EdTech startup",
  },
];
