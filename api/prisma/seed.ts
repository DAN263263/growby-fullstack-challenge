// Carga datos básicos para probar la app end-to-end
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Hash de contraseñas (NUNCA guardar texto plano)
  const adminPass = await bcrypt.hash("Admin123!", 10);
  const userPass = await bcrypt.hash("User123!", 10);

  // upsert garantiza idempotencia del seed
  const admin = await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: { email: "admin@example.com", isActive: true, name: "Admin", role: "ADMIN", password: adminPass, createdBy: "SYSTEM", updatedBy: "SYSTEM"}
  });

  const user = await prisma.user.upsert({
    where: { email: "user@example.com" },
    update: {},
    create: { email: "user@example.com", isActive: true, name: "User", role: "USER", password: userPass, createdBy: "SYSTEM", updatedBy: "SYSTEM"}
  });

  await prisma.room.upsert({
    where: { name: "Sala A" },
    update: {},
    create: { name: "Sala A", capacity: 10, isActive: true, createdBy: "SYSTEM", updatedBy: "SYSTEM" }
  });

  console.log("Seed listo:", { admin: admin.email, user: user.email });
}

main().finally(() => prisma.$disconnect());
