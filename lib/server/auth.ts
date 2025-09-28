import jwt from "jsonwebtoken";
import type { NextRequest } from "next/server";
import { User } from "@/lib/types";

// Cookie and JWT settings
export const COOKIE_NAME = "as_session";
export const COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 14; // 14 days
const JWT_ALG: jwt.Algorithm = "HS256";

function getSecret() {
  const secret = process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET || "dev-insecure-secret-change-me";
  if (!secret) throw new Error("AUTH_SECRET is not set");
  return secret;
}

export type SessionToken = {
  sub: string; // user id
  name: string;
  email: string;
  avatar?: string;
  plan: User["plan"];
  iat?: number;
  exp?: number;
};

export function signSession(user: User): string {
  const payload: SessionToken = {
    sub: user.id,
    name: user.name,
    email: user.email,
    avatar: user.avatar,
    plan: user.plan,
  };
  return jwt.sign(payload, getSecret(), {
    algorithm: JWT_ALG,
    expiresIn: COOKIE_MAX_AGE_SECONDS,
  });
}

export function verifySession(token: string): SessionToken | null {
  try {
    return jwt.verify(token, getSecret(), { algorithms: [JWT_ALG] }) as SessionToken;
  } catch {
    return null;
  }
}

export function getSessionFromRequest(req: NextRequest): SessionToken | null {
  const token = req.cookies.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifySession(token);
}
