import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { guardApi } from "@/lib/auth"
import { getEmailConfig } from "@/lib/email/config"
import { sendTemplateEmail, sendAcknowledgement } from "@/lib/email/service"

export async function POST(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const guard = await guardApi()
  if (guard) return guard

  const { id } = await params
  const log = await prisma.emailDeliveryLog.findUnique({ where: { id } })
  if (!log) return NextResponse.json({ error: "Log entry not found" }, { status: 404 })

  const cfg = await getEmailConfig()
  const ref = log.submissionRef || ""
  const parts = ref.split(":")
  const kind = parts[0]
  const subId = parts[1]
  const recipients = cfg.recipients.length ? cfg.recipients : [cfg.senderEmail]

  if (log.templateType === "contact_enquiry" && kind === "contact" && subId) {
    const sub = await prisma.contactSubmission.findUnique({ where: { id: subId } })
    if (!sub) return NextResponse.json({ error: "Original submission not found" }, { status: 404 })
    const result = await sendTemplateEmail({
      type: "contact_enquiry",
      to: recipients,
      replyTo: cfg.replyToBehaviour === "visitor" ? sub.email : undefined,
      submissionRef: ref,
      vars: {
        name: sub.name,
        email: sub.email,
        phone: sub.telephone || "",
        organisation: sub.organisation || "",
        service: sub.service || "",
        preferredMethod: sub.preferredMethod || "",
        message: sub.message,
        date: sub.createdAt.toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" }),
        source: "Milven Consulting Website"
      },
      details: [
        ["Name", sub.name],
        ["Email", sub.email],
        ["Phone", sub.telephone || ""],
        ["Organisation", sub.organisation || ""],
        ["Role", sub.role || ""],
        ["Service", sub.service || ""],
        ["Preferred contact", sub.preferredMethod || ""]
      ]
    })
    return NextResponse.json(result)
  }

  if (log.templateType === "training_enquiry" && kind === "training" && subId) {
    const sub = await prisma.trainingEnquiry.findUnique({ where: { id: subId } })
    if (!sub) return NextResponse.json({ error: "Original submission not found" }, { status: 404 })
    const result = await sendTemplateEmail({
      type: "training_enquiry",
      to: recipients,
      replyTo: cfg.replyToBehaviour === "visitor" ? sub.email : undefined,
      submissionRef: ref,
      vars: {
        programme: sub.programme || "",
        organisation: sub.organisation || "",
        contactName: sub.contactName || "",
        email: sub.email,
        telephone: sub.telephone || "",
        delegateCount: sub.delegateCount || "",
        seniority: sub.seniority || "",
        preferredDates: sub.preferredDates || "",
        location: sub.location || "",
        deliveryMode: sub.deliveryMode || "",
        objectives: sub.objectives || "",
        date: sub.createdAt.toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" })
      },
      details: [
        ["Programme", sub.programme || ""],
        ["Organisation", sub.organisation || ""],
        ["Contact", sub.contactName || ""],
        ["Email", sub.email],
        ["Phone", sub.telephone || ""],
        ["Delegates", sub.delegateCount || ""],
        ["Seniority", sub.seniority || ""],
        ["Preferred dates", sub.preferredDates || ""],
        ["Location", sub.location || ""],
        ["Delivery mode", sub.deliveryMode || ""]
      ]
    })
    return NextResponse.json(result)
  }

  if (log.templateType === "visitor_acknowledgement") {
    if (kind === "contact" && subId) {
      const sub = await prisma.contactSubmission.findUnique({ where: { id: subId } })
      if (!sub) return NextResponse.json({ error: "Original submission not found" }, { status: 404 })
      const result = await sendAcknowledgement({
        submissionRef: `contact:${subId}`,
        to: sub.email,
        vars: { name: sub.name }
      })
      return NextResponse.json(result)
    }
    if (kind === "training" && subId) {
      const sub = await prisma.trainingEnquiry.findUnique({ where: { id: subId } })
      if (!sub) return NextResponse.json({ error: "Original submission not found" }, { status: 404 })
      const result = await sendAcknowledgement({
        submissionRef: `training:${subId}`,
        to: sub.email,
        vars: { name: sub.contactName || "", organisation: sub.organisation || "" }
      })
      return NextResponse.json(result)
    }
  }

  if (log.templateType === "test_email") {
    const result = await sendTemplateEmail({
      type: "test_email",
      to: [log.recipient],
      vars: {},
      bypassEnabled: true
    })
    return NextResponse.json(result)
  }

  return NextResponse.json(
    { error: "Retry is not available for this delivery." },
    { status: 400 }
  )
}
