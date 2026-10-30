require("dotenv").config();
const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");
const bcrypt = require("bcryptjs"); // El kit utiliza bcryptjs: hashes bcrypt con costo 10.
const { isValidEmail } = require("../src/utils/validation");

const variantes = [
  ["Fútbol 1", "Vóley 1", "2026-11-10"],
  ["Básquet 1", "Tenis 1", "2026-11-11"],
  ["Fútbol 2", "Pádel 1", "2026-11-12"],
  ["Vóley 2", "Básquet 2", "2026-11-13"],
  ["Tenis 2", "Fútbol 3", "2026-11-16"],
  ["Pádel 2", "Vóley 3", "2026-11-17"],
  ["Básquet 3", "Ecuavóley 1", "2026-11-18"],
  ["Ecuavóley 2", "Tenis 3", "2026-11-19"],
  ["Fútbol 4", "Básquet 4", "2026-11-20"],
  ["Pádel 3", "Ecuavóley 3", "2026-11-23"],
];

async function main() {
  const digits = process.env.ESPE_ID_LAST_TWO || "";
  const name = (process.env.STUDENT_NAME || "").trim();
  const email = (process.env.STUDENT_EMAIL || "").trim().toLowerCase();
  const password = process.env.STUDENT_PASSWORD;
  // Validar ANTES de borrar: un dato pendiente no debe eliminar registros.
  if (!/^\d{2}$/.test(digits)) throw new Error("Completa ESPE_ID_LAST_TWO con dos dígitos (ejemplo: 07).");
  if (process.env.PORT !== `30${digits}`) throw new Error("PORT debe ser 30 seguido de ESPE_ID_LAST_TWO.");
  if (!name || !isValidEmail(email) || email.includes("completar") || !password) {
    throw new Error("Completa STUDENT_NAME, STUDENT_EMAIL y STUDENT_PASSWORD en .env.");
  }
  if (email === "paulo.galarza@example.com") throw new Error("Usa tu propio correo institucional.");
  if (!process.env.DATABASE_URL) throw new Error("Falta DATABASE_URL.");

  const [court1, court2, day] = variantes[Number(digits[1])];
  const adminHash = await bcrypt.hash("admin123", 10);
  const studentHash = await bcrypt.hash(password, 10);
  const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
  const prisma = new PrismaClient({ adapter });
  try {
    const result = await prisma.$transaction(async (tx) => {
      await tx.booking.deleteMany();
      await tx.schedule.deleteMany();
      await tx.user.deleteMany();

      await tx.user.create({ data: {
        name: "Paulo Galarza", email: "paulo.galarza@example.com",
        password: adminHash, role: "ADMIN",
      } });
      const student = await tx.user.create({ data: {
        name, email, password: studentHash, role: "USER",
      } });
      const first = await tx.schedule.create({ data: {
        court: court1,
        startTime: new Date(`${day}T08:00:00.000Z`),
        endTime: new Date(`${day}T10:00:00.000Z`),
      } });
      const second = await tx.schedule.create({ data: {
        court: court2,
        startTime: new Date(`${day}T10:00:00.000Z`),
        endTime: new Date(`${day}T12:00:00.000Z`),
      } });
      for (const schedule of [first, second]) {
        await tx.booking.create({ data: {
          date: new Date(`${day}T00:00:00.000Z`),
          user: { connect: { id: student.id } },
          schedule: { connect: { id: schedule.id } },
        } });
      }
      return { studentId: student.id, firstId: first.id, secondId: second.id };
    });
    console.log("Seed completado: 2 usuarios, 2 horarios y 2 reservas.");
    console.log({ variante: digits[1], fecha: day, canchas: [court1, court2], ...result });
  } finally {
    await prisma.$disconnect();
  }
}
main().catch((error) => {
  console.error("Error en seed:", error.message);
  process.exitCode = 1;
});
