import * as mongoose from "mongoose";
import { MODEL_NAMES } from "./model-name";

const logSchema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: MODEL_NAMES.PROJECT,
    },
    timestamp: { type: Date, required: true },
    /////
    title: { type: String, required: false },
    message: { type: String, required: false },
    userId: {
      type: String,
      required: false,
    },
    icon: { type: String, required: false },
    /////
  },
  {
    timeseries: {
      timeField: "timestamp",
      metaField: "projectId",
    },
  },
);
type logType = mongoose.InferSchemaType<typeof logSchema>;
export const logModel: mongoose.Model<logType> =
  mongoose.models[MODEL_NAMES.LOG] ??
  mongoose.model(MODEL_NAMES.LOG, logSchema);
