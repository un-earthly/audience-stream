import { NextRequest, NextResponse } from "next/server";
import { signSession, COOKIE_NAME, COOKIE_MAX_AGE_SECONDS } from "@/lib/server/auth";
import { User } from "@/lib/types";

export async function POST(req: NextRequest) {
  try {
    const { email, password, provider } = await req.json();

    // In a real app, validate credentials or OAuth provider here.
    // For now, accept any non-empty email/password to match existing mock behavior.
    if (!email || (!provider && !password)) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 400 });
    }

    const user: User = {
      id: "user_123",
      name: "Alex Johnson",
      email,
      avatar: "",
      plan: "pro",
    };

    const token = signSession(user);
    const res = NextResponse.json({ user });
    res.cookies.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: COOKIE_MAX_AGE_SECONDS,
    });
    return res;
  } catch (e) {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }
}
