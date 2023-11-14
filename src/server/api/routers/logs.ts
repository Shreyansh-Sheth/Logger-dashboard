import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { ProjectModel, projectType } from "@/schema/project";
import { ProjectUserModel } from "@/schema/project-user";
import { observable } from "@trpc/server/observable";
import LogsEventHandler from "@/lib/event";

export const logsRouter = createTRPCRouter({
  live: protectedProcedure
    .input(z.object({ projectId: z.string().min(1) }))
    .subscription(({ ctx, input }) => {
      return observable<string>((emit) => {
        const sendLog = (log: string) => {
          emit.next(log);
        };
        LogsEventHandler.on("newLog", sendLog);
        return () => {
          LogsEventHandler.off("newLog", sendLog);
        };
      });
    }),
});
