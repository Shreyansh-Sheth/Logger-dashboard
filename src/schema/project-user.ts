import * as mongoose from "mongoose";
import { MODEL_NAMES } from "./model-name";

import { InferSchemaType } from "mongoose";
import { randomUUID } from "crypto";
const projectUserSchema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: MODEL_NAMES.PROJECT,
    },
    userId: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: MODEL_NAMES.USER,
    },
    role: { type: String, required: true },
  },
  {
    timestamps: true,
  },
);
type projectUserType = InferSchemaType<typeof projectUserSchema>;

export const ProjectUserModel: mongoose.Model<projectUserType> =
  mongoose.models[MODEL_NAMES.PROJECT_USER] ??
  mongoose.model<projectUserType>(MODEL_NAMES.PROJECT_USER, projectUserSchema);
