import { auth } from "@/auth";

export default auth((req) => {
  if (!req.auth && (
    req.nextUrl.pathname.startsWith("/products") ||
    req.nextUrl.pathname.startsWith("/orders") ||
    req.nextUrl.pathname.startsWith("/manage-products")
  )) {
    const newUrl = new URL("/login", req.nextUrl.origin);
    newUrl.searchParams.set("callbackUrl", req.nextUrl.pathname);
    return Response.redirect(newUrl);
  }
});

export const config = {
  matcher: ["/products/:path*", "/orders/:path*", "/manage-products/:path*"],
};