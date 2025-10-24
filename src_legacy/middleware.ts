import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse, type NextRequest } from "next/server";
import { ALLOWED_USER_ID } from "./config/auth";

// ----------------------
// Matchers
// ----------------------
const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/admin(.*)",
]);

const isSignInRoute = createRouteMatcher([
  "/auth/v2/login(.*)"
]);

export default clerkMiddleware(async (auth, req: NextRequest) => {
  try {
    const url = req.nextUrl.clone();
    const currentPath = url.pathname;

    const { isAuthenticated, userId } = await auth();

    // ----------------------
    // 1️⃣ Usuario no autenticado intentando rutas protegidas → login
    // ----------------------
    if (!isAuthenticated && isProtectedRoute(req)) {
      return NextResponse.redirect(new URL("/auth/v2/login", req.url));
    }

    // ----------------------
    // 2️⃣ Usuario autenticado intentando entrar al login → dashboard/admin
    // ----------------------
    if (isAuthenticated && isSignInRoute(req)) {
      const targetPath = userId === ALLOWED_USER_ID
        ? "/admin/default"
        : "/dashboard/default";

      if (currentPath !== targetPath) {
        return NextResponse.redirect(new URL(targetPath, req.url));
      }
    }

    // ----------------------
    // 3️⃣ Usuario normal intentando acceder a admin → dashboard
    // ----------------------
    if (isAuthenticated && userId !== ALLOWED_USER_ID && currentPath.startsWith("/admin")) {
      return NextResponse.redirect(new URL("/dashboard/default", req.url));
    }

    // ----------------------
    // 4️⃣ Usuario admin intentando acceder a dashboard → admin
    // ----------------------
    if (isAuthenticated && userId === ALLOWED_USER_ID && currentPath.startsWith("/dashboard")) {
      return NextResponse.redirect(new URL("/admin/default", req.url));
    }

    // ----------------------
    // 5️⃣ Rutas públicas → siguiente
    // ----------------------
    return NextResponse.next();

  } catch (err) {
    console.error("[Middleware Error]:", err);
    // Redirige al login si algo falla
    return NextResponse.redirect(new URL("/auth/v2/login", req.url));
  }
}, { debug: process.env.NODE_ENV === "development" });

export const config = {
  matcher: [
    "/((?!_next|[^?]\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).)",
    "/(api|trpc)(.*)",
  ],
};