import "dotenv/config";
import cors from "cors";
import express from "express";
import menuRoutes from "./routes/menu.routes";
import aiRoutes from "./routes/ai.routes";

const app = express();

app.use(cors());
app.use(express.json({ limit: "1mb" }));

app.get("/", (_req, res) => {
  res.json({
    name: "The Intelligent Bistro API",
    endpoints: {
      health: "GET /health",
      menu: "GET /menu",
      parseOrder: "POST /ai/parse-order",
    },
  });
});

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use(menuRoutes);
app.use(aiRoutes);

app.use((_req, res) => {
  res.status(404).json({ error: "Not found" });
});

const PORT = Number(process.env.PORT) || 4000;

app.listen(PORT, () => {
  const usingAI = Boolean(process.env.OPENAI_API_KEY);
  console.log(`\nThe Intelligent Bistro backend`);
  console.log(`   Listening on http://localhost:${PORT}`);
  console.log(`   AI mode: ${usingAI ? "OpenAI" : "deterministic fallback"}`);
  console.log(
    `   Endpoints: GET /, GET /health, GET /menu, POST /ai/parse-order\n`,
  );
});
