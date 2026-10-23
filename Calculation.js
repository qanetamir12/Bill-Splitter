import mongoose from "mongoose";

const memberSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    paid: { type: Number, required: true, min: 0 },
  },
  { _id: false }
);

const settlementSchema = new mongoose.Schema(
  {
    from: { type: String, required: true },
    to: { type: String, required: true },
    amount: { type: Number, required: true },
  },
  { _id: false }
);

const calculationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    title: { type: String, trim: true, default: "Untitled bill", maxlength: 80 },
    members: { type: [memberSchema], required: true },
    total: { type: Number, required: true },
    share: { type: Number, required: true },
    settlements: { type: [settlementSchema], default: [] },
  },
  { timestamps: true }
);

export default mongoose.model("Calculation", calculationSchema);
