import { createCookieSessionStorage, redirect, data } from "react-router";

type SessionData = {
  userId: string;
  createdAt: number;
};

type SessionFlashData = {
  error: string;
};

const SESSION_MAX_AGE = 60 * 60 * 24; // 24 horas
const ROTATION_INTERVAL = 60 * 15; // 15 minutos

const { getSession, commitSession, destroySession } =
  createCookieSessionStorage<SessionData, SessionFlashData>({
    cookie: {
      name: "__session",
      httpOnly: true,
      maxAge: SESSION_MAX_AGE,
      path: "/",
      sameSite: "lax",
      secrets: [process.env.SESSION_SECRET ?? "s3cret1"],
      secure: process.env.NODE_ENV === "production",
    },
  });

async function requireAuth(request: Request) {
  const session = await getSession(request.headers.get("Cookie"));

  if (!session.has("userId")) {
    throw redirect("/login");
  }

  return session.get("userId") as string;
}

async function rotateSession(request: Request) {
  const session = await getSession(request.headers.get("Cookie"));

  if (!session.has("userId")) return null;

  const createdAt = session.get("createdAt") || 0;
  const now = Math.floor(Date.now() / 1000);

  if (now - createdAt > ROTATION_INTERVAL) {
    const newSession = await getSession(null);
    newSession.set("userId", session.get("userId")!);
    newSession.set("createdAt", now);

    return {
      headers: {
        "Set-Cookie": await commitSession(newSession),
      },
    };
  }

  return null;
}

export {
  getSession,
  commitSession,
  destroySession,
  requireAuth,
  rotateSession,
};
