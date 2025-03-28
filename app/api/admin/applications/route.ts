import { NextResponse } from "next/server"
import { cookies } from "next/headers"

// Mock data for applications
const mockApplications = [
  {
    id: "app-1",
    orbisAddress: "ORBC7YHiJzLYrcXvdhi5vT4LcMki6Rq2xTs9uV",
    tonAddress: "UQDrGALUcr_Lm5HJhAhZ5Jw_2PgY_5hB_TBGm-HxNq9vf8wW",
    tokenAmount: 5000,
    contact: "@пользователь1",
    approved: false,
    createdAt: "2023-05-15T10:30:00Z",
  },
  {
    id: "app-2",
    orbisAddress: "ORBC8ZJkMnOpQrStUvWxYzAb9CdFe3gHiLs7pR",
    tonAddress: "UQCJCs4PeNyEYvWRnGmfV8x_3XFt_JtzWZaGP-VSV5bdXVTq",
    tokenAmount: 12500,
    contact: "пользователь2@example.com",
    approved: true,
    createdAt: "2023-05-14T14:20:00Z",
  },
  {
    id: "app-3",
    orbisAddress: "ORBC9TpQwErTyUiOpAsDfGhJkLmNbVcXzAs8uZ",
    tonAddress: "UQBn7-bQVPKcFf0x5R3BYaBWwTlDjJ0RzQWGzx1BZ7aXZtlj",
    tokenAmount: 7800,
    contact: "@пользователь3",
    approved: false,
    createdAt: "2023-05-13T09:15:00Z",
  },
  {
    id: "app-4",
    orbisAddress: "ORBC2AbCdEfGhIjKlMnOpQrStUvWxYzAb9CdFe3gHiL",
    tonAddress: "UQDLMnOpQrStUvWxYzAb9CdFe3gHiLs7pRtUvWxY",
    tokenAmount: 3200,
    contact: "пользователь4@example.com",
    approved: true,
    createdAt: "2023-05-12T16:45:00Z",
  },
  {
    id: "app-5",
    orbisAddress: "ORBC3GhIjKlMnOpQrStUvWxYzAb9CdFe3gHiL",
    tonAddress: "UQCdFe3gHiLs7pRtUvWxYzAb9CdFe3gHiLs7pRtU",
    tokenAmount: 9500,
    contact: "@пользователь5",
    approved: false,
    createdAt: "2023-05-11T11:30:00Z",
  },
]

export async function GET(request: Request) {
  // Check authentication
  const authCookie = cookies().get("admin_auth")
  if (authCookie?.value !== "authenticated") {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
  }

  // Parse query parameters
  const { searchParams } = new URL(request.url)
  const page = Number.parseInt(searchParams.get("page") || "1")
  const filter = searchParams.get("filter") || "all"

  // Filter applications
  let filteredApplications = [...mockApplications]

  if (filter === "approved") {
    filteredApplications = filteredApplications.filter((app) => app.approved)
  } else if (filter === "not-approved") {
    filteredApplications = filteredApplications.filter((app) => !app.approved)
  }

  // Pagination
  const pageSize = 10
  const totalPages = Math.ceil(filteredApplications.length / pageSize)
  const startIndex = (page - 1) * pageSize
  const paginatedApplications = filteredApplications.slice(startIndex, startIndex + pageSize)

  return NextResponse.json({
    success: true,
    data: {
      applications: paginatedApplications,
      totalPages,
      currentPage: page,
    },
  })
}

