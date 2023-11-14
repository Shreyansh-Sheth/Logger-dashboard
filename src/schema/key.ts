import * as mongoose from "mongoose";
import { MODEL_NAMES } from "./model-name";

const keySchema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: MODEL_NAMES.PROJECT,
    },
    key: { type: String, required: true },
  },
  {
    timestamps: true,
  },
);
type keyType = mongoose.InferSchemaType<typeof keySchema>;
export const keyModel: mongoose.Model<keyType> =
  mongoose.models[MODEL_NAMES.KEY] ??
  mongoose.model(MODEL_NAMES.KEY, keySchema);
