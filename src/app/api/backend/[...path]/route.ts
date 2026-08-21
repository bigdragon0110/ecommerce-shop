import { NextRequest, NextResponse } from "next/server";

const backendUrl = (process.env.ECOMMERCE_API_URL || "http://localhost:3100/api").replace(/\/$/, "");
const tokenCookie = "takoyaki_customer_token";

async function proxy(request: NextRequest, context: { params: { path: string[] } }) {
  const path = context.params.path.join("/");
  if (path === "auth/logout" && request.method === "POST") {
    const response = NextResponse.json({ success: true });
    response.cookies.set(tokenCookie, "", { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", maxAge: 0, path: "/" });
    return response;
  }

  const target = new URL(`${backendUrl}/${path}`);
  request.nextUrl.searchParams.forEach((value, key) => target.searchParams.append(key, value));
  const headers = new Headers({ accept: "application/json" });
  const token = request.cookies.get(tokenCookie)?.value;
  if (token) headers.set("authorization", `Bearer ${token}`);
  const hasBody = !["GET", "HEAD"].includes(request.method);
  if (hasBody) headers.set("content-type", request.headers.get("content-type") || "application/json");

  try {
    const upstream = await fetch(target, {
      method: request.method,
      headers,
      body: hasBody ? await request.text() : undefined,
      cache: "no-store",
    });
    const contentType = upstream.headers.get("content-type") || "application/json";
    const text = await upstream.text();
    let payload: unknown = text ? JSON.parse(text) : null;
    const responsePayload = payload && typeof payload === "object" ? { ...(payload as Record<string, unknown>) } : payload;
    if ((path === "auth/login" || path === "auth/register") && upstream.ok && responsePayload && typeof responsePayload === "object") {
      const tokenValue = String((responsePayload as Record<string, unknown>).token || "");
      delete (responsePayload as Record<string, unknown>).token;
      const response = NextResponse.json(responsePayload, { status: upstream.status });
      if (tokenValue) response.cookies.set(tokenCookie, tokenValue, {
        httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", maxAge: 60 * 60 * 24 * 7, path: "/",
      });
      return response;
    }
    return new NextResponse(JSON.stringify(responsePayload), { status: upstream.status, headers: { "content-type": contentType } });
  } catch {
    return NextResponse.json({ success: false, message: "The ecommerce service is unavailable." }, { status: 503 });
  }
}

export const GET = proxy;
export const POST = proxy;
export const PATCH = proxy;
export const PUT = proxy;
export const DELETE = proxy;
