import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function GET() {
  // Check authentication
  const authCookie = cookies().get("admin_auth")
  if (authCookie?.value !== "authenticated") {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
  }

  // In a real app, fetch from database
  // This is just placeholder data
  const stats = {
    totalOrbcMigrated: 125000,
    totalOmMigrated: 7500,
  }

  return NextResponse.json({ success: true, data: stats })
}

