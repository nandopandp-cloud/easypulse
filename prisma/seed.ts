import { PrismaClient, EvaluationStatus, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const adminPassword = await bcrypt.hash("admin123", 10);
  const userPassword = await bcrypt.hash("user123", 10);

  const admin = await prisma.user.upsert({
    where: { email: "admin@easypulse.app" },
    update: {},
    create: {
      name: "Administradora Geral",
      email: "admin@easypulse.app",
      passwordHash: adminPassword,
      role: Role.ADMIN,
    },
  });

  const user = await prisma.user.upsert({
    where: { email: "ana@easypulse.app" },
    update: {},
    create: {
      name: "Ana Lima",
      email: "ana@easypulse.app",
      passwordHash: userPassword,
      role: Role.USER,
    },
  });

  const user2 = await prisma.user.upsert({
    where: { email: "carlos@easypulse.app" },
    update: {},
    create: {
      name: "Carlos Souza",
      email: "carlos@easypulse.app",
      passwordHash: userPassword,
      role: Role.USER,
    },
  });

  const samples = [
    {
      userId: user.id,
      schoolName: "EMEF Monteiro Lobato",
      region: "Zona Leste",
      location: "Sala 12 — Bloco B",
      evaluationName: "Pulso de Leitura — 5º ano",
      datetime: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2),
      status: EvaluationStatus.SCHEDULED,
    },
    {
      userId: user.id,
      schoolName: "EMEF Cecília Meireles",
      region: "Zona Sul",
      location: "Auditório",
      evaluationName: "Pulso de Matemática — 7º ano",
      datetime: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1),
      status: EvaluationStatus.COMPLETED,
    },
    {
      userId: user2.id,
      schoolName: "EMEF Paulo Freire",
      region: "Zona Norte",
      location: "Sala 03",
      evaluationName: "Pulso de Ciências — 9º ano",
      datetime: new Date(Date.now() + 1000 * 60 * 60 * 6),
      status: EvaluationStatus.IN_PROGRESS,
    },
    {
      userId: user2.id,
      schoolName: "EMEF Anísio Teixeira",
      region: "Zona Oeste",
      location: "Sala Multimídia",
      evaluationName: "Pulso de Redação — 8º ano",
      datetime: new Date(Date.now() + 1000 * 60 * 60 * 24 * 5),
      status: EvaluationStatus.RESCHEDULED,
      rescheduleReason: "Greve dos professores na data original.",
    },
  ];

  for (const data of samples) {
    await prisma.evaluation.create({ data });
  }

  console.log("Seed concluído.");
  console.log("Admin: admin@easypulse.app / admin123");
  console.log("Usuária: ana@easypulse.app / user123");
  console.log("Usuário: carlos@easypulse.app / user123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
