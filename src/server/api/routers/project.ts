import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { ProjectModel, projectType } from "@/schema/project";
import { ProjectUserModel } from "@/schema/project-user";

export const projectRouter = createTRPCRouter({
  create: protectedProcedure
    .input(z.object({ name: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      const project = await ProjectModel.create({ name: input.name });
      const projectUser = await ProjectUserModel.create({
        projectId: project._id,
        role: "ADMIN",
        userId: ctx.session.user.id,
      });
      return project;
    }),
  getList: protectedProcedure.query(async ({ ctx }) => {
    const projectUsers = await ProjectUserModel.find({
      userId: ctx.session.user.id,
    }).populate<{
      projectId: projectType & { _id: string };
    }>("projectId");

    return projectUsers;
  }),
  getOne: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) => {
      return ProjectUserModel.findOne({
        userId: ctx.session.user.id,
        projectId: input.id,
      }).populate<{
        projectId: projectType;
      }>("projectId");
    }),
});
