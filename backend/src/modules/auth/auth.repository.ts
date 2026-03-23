import { prisma } from "../../lib/prisma.js";

export async function findUserByEmail(email: string) {
  return prisma.user.findFirst({
    where: {
      email: {
        equals: email,
        mode: "insensitive",
      },
    },
  });
}
