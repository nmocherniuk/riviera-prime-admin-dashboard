import { prisma } from "../../lib/prisma.js";

export async function findUserByEmail(email: string) {
  return prisma.users.findFirst({
    where: {
      email: {
        equals: email,
        mode: "insensitive",
      },
    },
  });
}
