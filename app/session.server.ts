import { createCookieSessionStorage, redirect } from "react-router";

type SessionData = {
  userId: string;
  createdAt: number;
};

type SessionFlashData = {
  error: string;
};

const SESSION_MAX_AGE = 60 * 60 * 24;
const ROTATION_INTERVAL = 60 * 15;

let sessionStorage: ReturnType<typeof createCookieSessionStorage<SessionData, SessionFlashData>> | null = null;

function getSessionStorage() {
  if (sessionStorage) return sessionStorage;
  sessionStorage = createCookieSessionStorage<SessionData, SessionFlashData>({
    cookie: {
      name: "__session",
      httpOnly: true,
      maxAge: SESSION_MAX_AGE,
      path: "/",
      sameSite: "lax",
      secrets: ["k8$mN2pQr5tY7wZ3xV6bC9dF0gH1jL4"],
      secure: false,
    },
  });
  return sessionStorage;
}

async function getSession(cookieHeader: string | null) {
  return getSessionStorage().getSession(cookieHeader);
}

async function commitSession(session: any) {
  return getSessionStorage().commitSession(session);
}

async function destroySession(session: any) {
  return getSessionStorage().destroySession(session);
}

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
