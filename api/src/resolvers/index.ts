// Reglas de negocio y acceso a datos centralizados en resolvers
import { PrismaClient } from "@prisma/client";
import { AuthenticationError, UserInputError, ForbiddenError } from "apollo-server-express";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

// Guardias reutilizables: claridad de intención
function ensureAuth(ctx: any) {
  if (!ctx.user) throw new AuthenticationError("Not authenticated");
}

function ensureAdmin(ctx: any) {
  ensureAuth(ctx);
  if (ctx.user.role !== "ADMIN") throw new ForbiddenError("Admin only");
}

// Regla de negocio clave: no permitir solapes de reservas
async function validateNoOverlap(roomId: string, startsAt: Date, endsAt: Date, ignoreId?: string) {
  if (endsAt <= startsAt) throw new UserInputError("endsAt must be > startsAt");
  const conflict = await prisma.booking.findFirst({
    where: {
      roomId,
      ...(ignoreId ? { NOT: { id: ignoreId } } : {}),
      startsAt: { lt: endsAt },  // comienza antes de que termine la nueva
      endsAt: { gt: startsAt }   // termina después de que comience la nueva
    }
  });
  if (conflict) throw new UserInputError("El salon ya fue reservado en ese intervalo de tiempo");
}

export const resolvers = {
  Query: {
    me: (_: any, __: any, ctx: any) => ctx.user || null,
    rooms: async (_: any, args: { search?: string }) => {
      const where: any = { isActive: true };
      if (args.search) where.name = { contains: args.search };
      return prisma.room.findMany({ where });
    },
    users: async (_: any, args: { search?: string }) => {
      const where: any = { isActive: true };
      if (args.search) where.name = { contains: args.search };
      return prisma.user.findMany({ where });
    },
    bookings: async (_: any, args: { roomId?: string; from?: string; to?: string }) => {
      const where: any = {
        room: { isActive: true },
        endsAt: { gte: new Date() } // Solo mostrar reservas futuras o en curso
      };
      if (args.roomId) where.roomId = args.roomId;
      if (args.from || args.to) {
        if (args.from) where.startsAt = { gte: new Date(args.from) };
        if (args.to) where.endsAt = { lte: new Date(args.to) };
      }
      return prisma.booking.findMany({
        where,
        include: { room: true, user: true },
        orderBy: { startsAt: "asc" }
      });
    }
  },
  Mutation: {
    login: async (_: any, { email, password }: any, ctx: any) => {
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) throw new AuthenticationError("Credenciales Invalidas");
      
      // Validar que el usuario esté activo
      if (!user.isActive) {
        throw new ForbiddenError("Su cuenta ha sido desactivada. Por favor, contacte al administrador.");
      }
      
      const bcrypt = await import("bcryptjs");
      const ok = await bcrypt.default.compare(password, user.password);
      if (!ok) throw new AuthenticationError("Credenciales Invalidas");
      // JWT con claims mínimos (sub, role, email)
      const token = jwt.sign({ sub: user.id, role: user.role, email: user.email }, ctx.jwtSecret, { expiresIn: "2h" });
      return { token, user };
    },
    createRoom: async (_: any, { input }: any, ctx: any) => {
      ensureAdmin(ctx);
      if (!input?.name) throw new UserInputError("Nombre de sala requerido");
      if (input.capacity <= 0) throw new UserInputError("Capacidad debe ser mayor a 0");
      return prisma.room.create({ data: { name: input.name, capacity: input.capacity, isActive: true, createdBy: ctx.user.sub, updatedBy: ctx.user.sub } });
    },
    updateRoom: async (_: any, { id, input }: any, ctx: any) => {
      ensureAdmin(ctx);
      const room = await prisma.room.findUnique({ where: { id } });
      if (!room) throw new UserInputError("Sala no encontrada");
      if (!input?.name) throw new UserInputError("Nombre de sala requerido");
      if (input.capacity <= 0) throw new UserInputError("Capacidad debe ser mayor a 0");
      return prisma.room.update({ 
        where: { id },
        data: { ...input}
      });
    },
    deleteRoom: async (_: any, { id }: any, ctx: any) => {
      ensureAdmin(ctx);
      const room = await prisma.room.findUnique({ where: { id } });
      if (!room) return true;
      if (ctx.user.role !== "ADMIN") throw new ForbiddenError("Forbidden");
      await prisma.room.update({ where: { id }, data: { isActive: false } });
      return true;
    },
    createBooking: async (_: any, { input }: any, ctx: any) => {
      ensureAuth(ctx);
      const startsAt = new Date(input.startsAt);
      const endsAt = new Date(input.endsAt);
      await validateNoOverlap(input.roomId, startsAt, endsAt);
      return prisma.booking.create({
        data: { ...input, startsAt, endsAt, userId: ctx.user.sub, createdBy: ctx.user.sub, updatedBy: ctx.user.sub },
        include: { room: true, user: true }
      });
    },
    updateBooking: async (_: any, { id, input }: any, ctx: any) => {
      ensureAuth(ctx);
      // Solo admins pueden editar reservas
      if (ctx.user.role !== "ADMIN") throw new ForbiddenError("Solo administradores pueden editar reservas");
      const booking = await prisma.booking.findUnique({ where: { id } });
      if (!booking) throw new UserInputError("Booking not found");
      const startsAt = new Date(input.startsAt);
      const endsAt = new Date(input.endsAt);
      await validateNoOverlap(input.roomId, startsAt, endsAt, id);
      return prisma.booking.update({
        where: { id },
        data: { ...input, startsAt, endsAt },
        include: { room: true, user: true }
      });
    },
    deleteBooking: async (_: any, { id }: any, ctx: any) => {
      ensureAuth(ctx);
      // Solo admins pueden eliminar reservas
      if (ctx.user.role !== "ADMIN") throw new ForbiddenError("Solo administradores pueden eliminar reservas");
      const booking = await prisma.booking.findUnique({ where: { id } });
      if (!booking) return true;
      await prisma.booking.delete({ where: { id } });
      return true;
    },
    createUser: async (_: any, { input }: any, ctx: any) => {
      ensureAdmin(ctx);
      if (!input?.email) throw new UserInputError("Email de usuario requerido");
      if (!input?.password) throw new UserInputError("Contraseña de usuario requerida");
      if (!input?.role) throw new UserInputError("Rol de usuario requerido");
      const bcrypt = await import("bcryptjs");
      const hashedPassword = await bcrypt.default.hash(input.password, 10);
      return prisma.user.create({
        data: {
          email: input.email,
          password: hashedPassword,
          role: input.role,
          isActive: true,
          createdBy: ctx.user.sub,
          updatedBy: ctx.user.sub,
          name: input.name,

        }
      });
    },
    updateUser: async (_: any, { id, input }: any, ctx: any) => {
      ensureAdmin(ctx);
      const user = await prisma.user.findUnique({ where: { id } });
      if (!user) throw new UserInputError("Usuario no encontrado");
      const updateData: any = { updatedBy: ctx.user.sub };
      if (input.email) updateData.email = input.email;
      if (input.role) updateData.role = input.role;
      if (input.name) updateData.name = input.name;
      if (input.password) {
        const bcrypt = await import("bcryptjs");
        updateData.password = await bcrypt.default.hash(input.password, 10);
      }
      return prisma.user.update({
        where: { id },
        data: updateData
      });
    },
    deleteUser: async (_: any, { id }: any, ctx: any) => {
      ensureAdmin(ctx);
      const user = await prisma.user.findUnique({ where: { id } });
      if (!user) return true;
      if (ctx.user.role !== "ADMIN") throw new ForbiddenError("Forbidden");
      //Eliminacion logica de usuario
      await prisma.user.update({ where: { id }, data: { isActive: false } });
      return true;
    }
  }
};
