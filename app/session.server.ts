import { createCookieSessionStorage, redirect } from "react-router";

type SessionData = {
  userId: string;
};

type SessionFlashData = {
  error: string;
};

const { getSession, commitSession, destroySession } =
  createCookieSessionStorage<SessionData, SessionFlashData>({
    cookie: {
      name: "__session",
      httpOnly: true,
      maxAge: 60 * 60 * 24,
      path: "/",
      sameSite: "lax",
      secrets: ["s3cret1"],
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

export { getSession, commitSession, destroySession, requireAuth };
