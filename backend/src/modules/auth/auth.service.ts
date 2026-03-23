import bcrypt from "bcryptjs";
import { findUserByEmail } from "./auth.repository.js";
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from "./auth.tokens.js";

type LoginInput = {
  email: string;
  password: string;
};

function getUnauthorizedEmailError() {
  return new Error("Invalid email");
}

function getUnauthorizedPasswordError() {
  return new Error("Invalid password");
}

async function verifyUserPassword(password: string, passwordHash: string) {
  try {
    return await bcrypt.compare(password, passwordHash);
  } catch {
    return false;
  }
}

export async function login(input: LoginInput) {
  const user = await findUserByEmail(input.email.trim());

  if (!user) {
    throw getUnauthorizedEmailError();
  }

  const passwordOk = await verifyUserPassword(
    input.password,
    user.passwordHash,
  );

  if (!passwordOk) {
    throw getUnauthorizedPasswordError();
  }

  return {
    accessToken: signAccessToken({
      sub: user.id,
      email: user.email,
    }),
    refreshToken: signRefreshToken({
      sub: user.id,
      email: user.email,
    }),
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
    },
  };
}

export async function refreshAccessToken(token: string) {
  const payload = verifyRefreshToken(token);
  const user = await findUserByEmail(payload.email);
  if (!user) {
    throw new Error("Invalid refresh token");
  }
  return {
    accessToken: signAccessToken({
      sub: user.id,
      email: user.email,
    }),
    refreshToken: signRefreshToken({
      sub: user.id,
      email: user.email,
    }),
  };
}
