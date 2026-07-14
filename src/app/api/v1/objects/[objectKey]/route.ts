import { NextResponse } from "next/server";
import { objects } from "@/lib/data";

export async function GET(_: Request, context: { params: Promise<{ objectKey: string }> }) {
  const { objectKey } = await context.params;
  const object = objects.find((item) => item.objectKey.toUpperCase() === decodeURIComponent(objectKey).toUpperCase());
  return object ? NextResponse.json(object) : NextResponse.json({ message: "Object not found" }, { status: 404 });
}
