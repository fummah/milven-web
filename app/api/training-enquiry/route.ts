import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { sendTrainingEnquiryEmail } from "@/lib/mail"
import { notifyEnquiry, sendAcknowledgement } from "@/lib/email/service"
import { forwardToCrm } from "@/lib/crm"
import { trainingSchema } from "@/lib/validations"

export async function POST(req: Request) {
  let json: unknown
  try {
    json = await req.json()
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  }

  const parsed = trainingSchema.safeParse(json)
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.flatten().fieldErrors },
      { status: 400 }
    )
  }

  const data = parsed.data
  if (data.honeypot) return NextResponse.json({ ok: true })

  const saved = await prisma.trainingEnquiry.create({
    data: {
      programme: data.programme || null,
      organisation: data.organisation,
      contactName: data.contactName,
      email: data.email,
      telephone: data.telephone || null,
      delegateCount: data.delegateCount || null,
      seniority: data.seniority || null,
      preferredDates: data.preferredDates || null,
      location: data.location || null,
      deliveryMode: data.deliveryMode || null,
      objectives: data.objectives
    }
  })

  let emailed = false
  let emailError: string | null = null
  try {
    const result = await notifyEnquiry({
      type: "training_enquiry",
      submissionRef: `training:${saved.id}`,
      visitorEmail: data.email,
      vars: {
        programme: data.programme || "",
        organisation: data.organisation,
        contactName: data.contactName,
        email: data.email,
        telephone: data.telephone || "",
        delegateCount: data.delegateCount || "",
        seniority: data.seniority || "",
        preferredDates: data.preferredDates || "",
        location: data.location || "",
        deliveryMode: data.deliveryMode || "",
        objectives: data.objectives,
        date: new Date().toLocaleString("en-GB", {
          dateStyle: "medium",
          timeStyle: "short"
        })
      },
      details: [
        ["Programme", data.programme || ""],
        ["Organisation", data.organisation],
        ["Contact", data.contactName],
        ["Email", data.email],
        ["Phone", data.telephone || ""],
        ["Delegates", data.delegateCount || ""],
        ["Seniority", data.seniority || ""],
        ["Preferred dates", data.preferredDates || ""],
        ["Location", data.location || ""],
        ["Delivery mode", data.deliveryMode || ""]
      ]
    })

    if (result.ok) {
      emailed = true
    } else if (result.skipped && process.env.RESEND_API_KEY) {
      emailed = await sendTrainingEnquiryEmail({
        programme: data.programme || undefined,
        organisation: data.organisation,
        contactName: data.contactName,
        email: data.email,
        telephone: data.telephone || undefined,
        delegateCount: data.delegateCount || undefined,
        seniority: data.seniority || undefined,
        preferredDates: data.preferredDates || undefined,
        location: data.location || undefined,
        deliveryMode: data.deliveryMode || undefined,
        objectives: data.objectives
      })
      if (!emailed) emailError = "Email not sent (delivery failed)"
    } else {
      emailError = result.error || "Email not sent (configuration missing or delivery failed)"
    }

    if (emailed) {
      await sendAcknowledgement({
        submissionRef: `training:${saved.id}`,
        to: data.email,
        vars: { name: data.contactName, organisation: data.organisation }
      }).catch(() => undefined)
    }
  } catch (error) {
    emailError = error instanceof Error ? error.message : "Unknown email error"
    console.error("Training email failed (enquiry saved):", error)
  }

  await prisma.trainingEnquiry
    .update({ where: { id: saved.id }, data: { emailed, emailError } })
    .catch(() => undefined)

  await forwardToCrm("training_enquiry", {
    programme: data.programme,
    organisation: data.organisation,
    contactName: data.contactName,
    email: data.email,
    telephone: data.telephone,
    delegateCount: data.delegateCount,
    seniority: data.seniority,
    preferredDates: data.preferredDates,
    location: data.location,
    deliveryMode: data.deliveryMode
  })

  return NextResponse.json({ ok: true, id: saved.id, emailed })
}
