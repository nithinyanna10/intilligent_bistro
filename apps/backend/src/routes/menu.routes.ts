import { Router } from "express";
import { getMenu } from "../services/menu.service";

const router = Router();

router.get("/menu", (_req, res) => {
  res.json({ items: getMenu() });
});

export default router;
