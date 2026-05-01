import express from "express";
import cors from "cors";
import helmet from "helmet";
import { profileRouter } from "./routes/profile.js";
import { skillsRouter } from "./routes/skills.js";
import { servicesRouter } from "./routes/services.js";
import { projectsRouter } from "./routes/projects.js";
import { testimonialsRouter } from "./routes/testimonials.js";
import { pluginsRouter } from "./routes/plugins.js";
import { contactRouter } from "./routes/contact.js";

const app = express();
const PORT = Number(process.env.PORT ?? 4000);

app.set("trust proxy", 1);
app.use(helmet());
app.use(
  cors({
    origin: (process.env.FRONTEND_ORIGIN || "*").split(",").map((s) => s.trim()),
    methods: ["GET", "POST"],
    credentials: false,
  })
);
app.use(express.json({ limit: "32kb" }));

app.get("/healthz", (_req, res) => res.json({ ok: true }));

app.use("/api/profile", profileRouter);
app.use("/api/skills", skillsRouter);
app.use("/api/services", servicesRouter);
app.use("/api/projects", projectsRouter);
app.use("/api/testimonials", testimonialsRouter);
app.use("/api/plugins", pluginsRouter);
app.use("/api/contact", contactRouter);

// 404
app.use((_req, res) => res.status(404).json({ error: "Not found" }));

// Error handler
app.use((err: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  // eslint-disable-next-line no-console
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`API listening on http://0.0.0.0:${PORT}`);
});
