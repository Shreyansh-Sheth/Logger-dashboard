import LogsEventHandler from "@/lib/event";
import { keyModel } from "@/schema/key";
import { logModel } from "@/schema/log";
import dbConnect from "@/server/db";
import { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";

const logValidation = z.object({
  key: z.string(),
  data: z.object({
    title: z.string(),
    message: z.string(),
    icon: z.string().emoji().optional(),
    userId: z.string().optional(),
    timestamp: z
      .date()
      .optional()
      .default(() => new Date()),
  }),
});

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    return saveLog(req, res);
  } else {
    res.status(405).send({ message: "Method not allowed" });
  }
}

const saveLog = async (req: NextApiRequest, res: NextApiResponse) => {
  const validateLog = logValidation.safeParse(req.body);

  if (!validateLog.success) {
    res.status(400).send(validateLog.error);
    return;
  }
  await dbConnect();

  const keyData = await keyModel.findOne({
    key: validateLog.data.key,
  });
  if (!keyData) {
    res.status(400).send({ message: "Key not found" });
    return;
  }
  const logData = await logModel.create({
    ...validateLog.data.data,
    projectId: keyData.projectId,
  });
  res.status(200).send({ message: "OK" });

  LogsEventHandler.emit("newLog", logData);
  res.send({ message: "OK" });
};
