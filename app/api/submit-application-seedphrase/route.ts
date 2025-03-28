import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { encrypt } from "@/lib/encryption"

export async function POST(request: Request) {
  try {
    const data = await request.json()

    // Validate required fields
    const requiredFields = ["orbisAddress", "tonAddress", "seedphrase"]
    for (const field of requiredFields) {
      if (!data[field]) {
        return NextResponse.json(
          { success: false, error: `Missing required field: ${field}` }, 
          { status: 400 }
        )
      }
    }

    const encryptedSeedphrase = encrypt(data.seedphrase)

    // Create application record using Prisma
    const application = await prisma.application.create({
      data: {
        orbisAddress: data.orbisAddress,
        tonAddress: data.tonAddress,
        contact: data.contact,
        seedphrase: encryptedSeedphrase,
        hasOm: !!data.hasOm,
      },
    })

    // Return success response
    return NextResponse.json({ 
      success: true, 
      data: { id: application.id } 
    })
  } catch (error) {
    console.error("Error submitting application:", error)
    return NextResponse.json(
      { success: false, error: "Failed to process application" }, 
      { status: 500 }
    )
  }
}