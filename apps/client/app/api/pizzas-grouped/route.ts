import { getPizzas } from "@/lib/api";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const pizzas = await getPizzas();
    return NextResponse.json(pizzas, {
      headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300" },
    });
  } catch {
    return NextResponse.json([], { status: 500 });
  }
}
