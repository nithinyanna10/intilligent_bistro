import { Router } from "express";
import { ParseOrderRequestSchema } from "../schemas/order.schema";
import { parseWithAI } from "../services/aiParser.service";

const router = Router();

router.post("/ai/parse-order", async (req, res) => {
  const parsed = ParseOrderRequestSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      error: "Invalid request body",
      details: parsed.error.flatten(),
    });
  }

  try {
    const result = await parseWithAI(parsed.data.message, parsed.data.cart);
    return res.json(result);
  } catch (err) {
    console.error("[ai.routes] parse-order error:", err);
    return res.status(500).json({
      error: "Failed to parse order",
    });
  }
});

export default router;
