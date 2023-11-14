import * as mongoose from "mongoose";
import { MODEL_NAMES } from "./model-name";

const projectSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
  },
  {
    timestamps: true,
  },
);
export type projectType = mongoose.InferSchemaType<typeof projectSchema>;

export const ProjectModel: mongoose.Model<projectType> =
  mongoose.models[MODEL_NAMES.PROJECT] ??
  mongoose.model(MODEL_NAMES.PROJECT, projectSchema);
