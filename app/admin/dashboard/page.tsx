"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRouter } from "next/navigation"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { AlertCircle, Loader2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useLanguage } from "@/contexts/language-context"

// Types for our application data
interface Application {
  id: string
  orbisAddress: string
  tonAddress: string
  tokenAmount: number
  contact: string
  approved: boolean
  createdAt: string
}

interface Stats {
  totalOrbcMigrated: number
  totalOmMigrated: number
}

export default function AdminDashboardPage() {
  const { t } = useLanguage()
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [stats, setStats] = useState<Stats>({ totalOrbcMigrated: 0, totalOmMigrated: 0 })
  const [applications, setApplications] = useState<Application[]>([])
  const [filter, setFilter] = useState<"all" | "approved" | "not-approved">("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null)
  const [tokenAmount, setTokenAmount] = useState("")
  const [tonAddress, setTonAddress] = useState("")
  const [isOmHolder, setIsOmHolder] = useState(false)
  const [isCheckingOm, setIsCheckingOm] = useState(false)
  const [omCheckError, setOmCheckError] = useState("")
  const [isCompletingOperation, setIsCompletingOperation] = useState(false)

  // Check authentication on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/admin/check-auth")
        const data = await response.json()

        if (!data.authenticated) {
          router.push("/admin")
          return
        }

        setIsAuthenticated(true)
        fetchData()
      } catch (error) {
        router.push("/admin")
      }
    }

    checkAuth()
  }, [router, fe])

  // Fetch dashboard data
  const fetchData = async () => {
    setIsLoading(true)
    try {
      // Fetch stats
      const statsResponse = await fetch("/api/admin/stats")
      const statsData = await statsResponse.json()

      if (statsData.success) {
        setStats(statsData.data)
      }

      // Fetch applications with pagination and filtering
      const applicationsResponse = await fetch(`/api/admin/applications?page=${currentPage}&filter=${filter}`)
      const applicationsData = await applicationsResponse.json()

      if (applicationsData.success) {
        setApplications(applicationsData.data.applications)
        setTotalPages(applicationsData.data.totalPages)
      }
    } catch (error) {
      console.error("Error fetching data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // Refetch data when page or filter changes
  useEffect(() => {
    if (isAuthenticated) {
      fetchData()
    }
  }, [currentPage, filter, isAuthenticated])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/logout", { method: "POST" })
      router.push("/admin")
    } catch (error) {
      console.error("Error logging out:", error)
    }
  }

  const openSendTokensModal = (application: Application) => {
    setSelectedApplication(application)
    setTokenAmount(application.tokenAmount.toString())
    setTonAddress(application.tonAddress)
    setIsOmHolder(false)
    setOmCheckError("")
    setIsModalOpen(true)
    checkOmHolder(application.orbisAddress)
  }

  const checkOmHolder = async (address: string) => {
    setIsCheckingOm(true)
    setOmCheckError("")

    try {
      const response = await fetch(`/api/checkom/?address=${address}`)
      const data = await response.json()

      if (data.success) {
        setIsOmHolder(data.om_holder)
      } else {
        setOmCheckError(data.error || "Failed to check OM holder status")
      }
    } catch (error) {
      setOmCheckError("An error occurred while checking OM holder status")
    } finally {
      setIsCheckingOm(false)
    }
  }

  const handleCompleteOperation = async () => {
    if (!selectedApplication) return

    setIsCompletingOperation(true)

    try {
      const response = await fetch("/api/admin/complete-operation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          applicationId: selectedApplication.id,
          tokenAmount,
          tonAddress,
          mintOmNft: isOmHolder,
        }),
      })

      const data = await response.json()

      if (data.success) {
        setIsModalOpen(false)
        fetchData() // Refresh data
      } else {
        console.error("Operation failed:", data.error)
      }
    } catch (error) {
      console.error("Error completing operation:", error)
    } finally {
      setIsCompletingOperation(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      // ... existing code ...
    } catch (err) {
      console.error('Error submitting form:', err)
      // Use the error variable or remove it
    }
  }

  if (!isAuthenticated || isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
      </div>
    )
  }

  return (
    <div className="w-full max-w-6xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{t("admin.dashboard.title")}</h1>
        <Button variant="outline" onClick={handleLogout}>
          {t("admin.dashboard.logout")}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>{t("admin.dashboard.stats.orbc")}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats.totalOrbcMigrated.toLocaleString()}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t("admin.dashboard.stats.om")}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats.totalOmMigrated.toLocaleString()}</p>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>{t("admin.dashboard.applications.title")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-4">
            <Select value={filter} onValueChange={(value) => setFilter(value as any)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder={t("admin.dashboard.filter.all")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("admin.dashboard.filter.all")}</SelectItem>
                <SelectItem value="approved">{t("admin.dashboard.filter.approved")}</SelectItem>
                <SelectItem value="not-approved">{t("admin.dashboard.filter.notApproved")}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("admin.dashboard.table.orbisAddress")}</TableHead>
                  <TableHead>{t("admin.dashboard.table.tonAddress")}</TableHead>
                  <TableHead>{t("admin.dashboard.table.tokenAmount")}</TableHead>
                  <TableHead>{t("admin.dashboard.table.contact")}</TableHead>
                  <TableHead>{t("admin.dashboard.table.status")}</TableHead>
                  <TableHead>{t("admin.dashboard.table.date")}</TableHead>
                  <TableHead>{t("admin.dashboard.table.action")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {applications.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-4">
                      {t("admin.dashboard.table.noApplications")}
                    </TableCell>
                  </TableRow>
                ) : (
                  applications.map((app) => (
                    <TableRow key={app.id}>
                      <TableCell className="font-mono text-xs">{app.orbisAddress}</TableCell>
                      <TableCell className="font-mono text-xs">{app.tonAddress}</TableCell>
                      <TableCell>{app.tokenAmount.toLocaleString()}</TableCell>
                      <TableCell>{app.contact}</TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            app.approved ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {app.approved
                            ? t("admin.dashboard.table.status.approved")
                            : t("admin.dashboard.table.status.pending")}
                        </span>
                      </TableCell>
                      <TableCell>{new Date(app.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell>
                        {!app.approved && (
                          <Button size="sm" onClick={() => openSendTokensModal(app)}>
                            {t("admin.dashboard.sendTokens")}
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {totalPages > 1 && (
            <div className="flex justify-between items-center mt-4">
              <Button
                variant="outline"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                {t("admin.dashboard.pagination.previous")}
              </Button>

              <span>
                {t("admin.dashboard.pagination.page")} {currentPage} {t("admin.dashboard.pagination.of")} {totalPages}
              </span>

              <Button
                variant="outline"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                {t("admin.dashboard.pagination.next")}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("modal.sendTokens.title")}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="tokenAmount">{t("modal.sendTokens.tokenAmount")}</Label>
              <Input
                id="tokenAmount"
                value={tokenAmount}
                onChange={(e) => setTokenAmount(e.target.value)}
                type="number"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tonAddress">{t("modal.sendTokens.tonAddress")}</Label>
              <Input id="tonAddress" value={tonAddress} onChange={(e) => setTonAddress(e.target.value)} />
            </div>

            <div className="flex items-center space-x-2">
              {isCheckingOm ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Checkbox
                  id="omNft"
                  checked={isOmHolder}
                  onCheckedChange={(checked) => setIsOmHolder(checked as boolean)}
                />
              )}
              <Label htmlFor="omNft">{t("modal.sendTokens.mintOmNft")}</Label>
            </div>

            {omCheckError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  {omCheckError}
                  <p className="mt-1">{t("modal.sendTokens.checkError")}</p>
                </AlertDescription>
              </Alert>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              {t("modal.sendTokens.cancel")}
            </Button>
            <Button
              onClick={handleCompleteOperation}
              disabled={isCompletingOperation}
              className="bg-purple-600 hover:bg-purple-700"
            >
              {isCompletingOperation ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t("modal.sendTokens.processing")}
                </>
              ) : (
                t("modal.sendTokens.complete")
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

