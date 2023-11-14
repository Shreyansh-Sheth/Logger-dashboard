import { createTRPCRouter } from "@/server/api/trpc";
import { projectRouter } from "./routers/project";
import { keyRouter } from "./routers/key";
import { logsRouter } from "./routers/logs";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  project: projectRouter,
  key: keyRouter,
  log: logsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
