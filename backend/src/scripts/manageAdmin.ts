import { prisma } from "../lib/prisma";
import bcrypt from "bcryptjs";

const [, , command] = process.argv;

const usage = () => console.log(`
Usage:
  npx tsx src/scripts/manageAdmin.ts list
  npx tsx src/scripts/manageAdmin.ts reset <email> <newPassword>
  npx tsx src/scripts/manageAdmin.ts make-admin <email>
`);

if (!command || command === "help") {
  usage();
  process.exit(0);
}

const listAdmins = async () => {
  const admins = await prisma.user.findMany({
    where: { role: "ADMIN" },
    select: { id: true, email: true, name: true, createdAt: true },
  });
  console.table(admins);
  if (admins.length === 0) {
    console.log("No hay usuarios con rol ADMIN.");
  }
};

const resetPassword = async (email: string, newPassword: string) => {
  const normalizedEmail = email.trim().toLowerCase();
  const user = await prisma.user.findUnique({ where: { email: normalizedEmail } });
  if (!user) {
    console.log(`No existe ningún usuario con email ${normalizedEmail}`);
    process.exit(1);
  }
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  await prisma.user.update({
    where: { id: user.id },
    data: { password: hashedPassword },
  });
  console.log(`Password actualizado para ${user.name} <${user.email}> (rol actual: ${user.role})`);
};

const makeAdmin = async (email: string) => {
  const normalizedEmail = email.trim().toLowerCase();
  const user = await prisma.user.findUnique({ where: { email: normalizedEmail } });
  if (!user) {
    console.log(`No existe ningún usuario con email ${normalizedEmail}`);
    process.exit(1);
  }
  await prisma.user.update({
    where: { id: user.id },
    data: { role: "ADMIN" },
  });
  console.log(`El usuario ${user.email} ahora es ADMIN.`);
};

(async () => {
  try {
    if (command === "list") {
      await listAdmins();
    } else if (command === "reset" && process.argv[3] && process.argv[4]) {
      await resetPassword(process.argv[3], process.argv[4]);
    } else if (command === "make-admin" && process.argv[3]) {
      await makeAdmin(process.argv[3]);
    } else {
      usage();
    }
  } catch (error) {
    console.error(error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
})();