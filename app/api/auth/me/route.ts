import { NextRequest, NextResponse } from "next/server";
import { getSessionFromRequest } from "@/lib/server/auth";

export async function GET(req: NextRequest) {
  const session = getSessionFromRequest(req);
  if (!session) {
    return NextResponse.json({ user: null }, { status: 401 });
  }
  const { sub, name, email, avatar, plan } = session;
  return NextResponse.json({
    user: {
      id: sub,
      name,
      email,
      avatar,
      plan,
    },
  });
}
