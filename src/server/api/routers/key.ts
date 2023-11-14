import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { keyModel } from "@/schema/key";
import { ProjectUserModel } from "@/schema/project-user";
import { Types } from "mongoose";
import { randomUUID } from "crypto";

export const keyRouter = createTRPCRouter({
  create: protectedProcedure
    .input(z.object({ projectId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const projectUser = await ProjectUserModel.findOne({
        projectId: new Types.ObjectId(input.projectId),
        userId: new Types.ObjectId(ctx.session.user.id),
      });
      if (!projectUser) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Project not found",
        });
      }
      const key = await keyModel.create({
        projectId: new Types.ObjectId(input.projectId),
        key: "SK-" + randomUUID(),
      });
      return key;
    }),
  /// List of keys
  getList: protectedProcedure
    .input(
      z.object({
        projectId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const isUserInProject = await ProjectUserModel.findOne({
        projectId: new Types.ObjectId(input.projectId),
        userId: new Types.ObjectId(ctx.session.user.id),
      });
      if (!isUserInProject) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Project not found",
        });
      }
      const keys = await keyModel
        .find({
          projectId: new Types.ObjectId(input.projectId),
        })
        .lean();
      return keys.map((e) => ({
        ...e,
        key: e.key,
      }));
    }),

  /// Revoke a key
  revoke: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const key = await keyModel.findOne({
        _id: new Types.ObjectId(input.id),
      });
      if (!key) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Key not found",
        });
      }
      const projectUser = await ProjectUserModel.findOne({
        projectId: key.projectId,
        userId: new Types.ObjectId(ctx.session.user.id),
      });
      if (!projectUser) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Project not found",
        });
      }
      await keyModel.deleteOne({
        _id: new Types.ObjectId(input.id),
      });
      return true;
    }),
});
