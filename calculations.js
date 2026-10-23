import { Router } from "express";
import mongoose from "mongoose";
import Calculation from "../models/Calculation.js";
import { protect } from "../middleware/auth.js";
import { splitEqually } from "../utils/settle.js";

const router = Router();
router.use(protect);

// Create (calculate + save)
router.post("/", async (req, res) => {
  try {
    const { title, members } = req.body;

    if (!Array.isArray(members) || members.length < 2)
      return res.status(400).json({ message: "Add at least 2 people" });
    if (members.length > 50)
      return res.status(400).json({ message: "Maximum 50 people" });

    const cleaned = [];
    for (const m of members) {
      const name = String(m?.name || "").trim();
      const paid = Number(m?.paid);
      if (!name) return res.status(400).json({ message: "Every person needs a name" });
      if (!Number.isFinite(paid) || paid < 0)
        return res.status(400).json({ message: `Invalid amount for ${name}` });
      cleaned.push({ name, paid });
    }

    const names = cleaned.map((m) => m.name.toLowerCase());
    if (new Set(names).size !== names.length)
      return res.status(400).json({ message: "Each person needs a unique name" });

    const result = splitEqually(cleaned);

    const calc = await Calculation.create({
      user: req.user._id,
      title: String(title || "").trim() || "Untitled bill",
      members: cleaned,
      ...result,
    });

    res.status(201).json(calc);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Could not save calculation" });
  }
});

// List my history (newest first)
router.get("/", async (req, res) => {
  try {
    const calcs = await Calculation.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(calcs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Could not load history" });
  }
});

// Delete one
router.delete("/:id", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id))
      return res.status(400).json({ message: "Invalid id" });

    const deleted = await Calculation.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });
    if (!deleted) return res.status(404).json({ message: "Not found" });
    res.json({ message: "Deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Could not delete" });
  }
});

export default router;
