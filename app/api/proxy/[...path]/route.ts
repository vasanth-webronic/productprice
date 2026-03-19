import { NextRequest, NextResponse } from "next/server";

const UPSTREAM = "https://matpriskollen.se";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  const upstream = `${UPSTREAM}/api/${path.join("/")}${request.nextUrl.search}`;

  const res = await fetch(upstream, {
    headers: { "User-Agent": "productprice-proxy/1.0" },
    next: { revalidate: 300 },
  });

  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
