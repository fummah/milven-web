"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { CheckCircle2, Loader2, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  trainingSchema,
  type TrainingInput,
  DELIVERY_MODES,
  SENIORITY_LEVELS
} from "@/lib/validations"
import { track } from "@/lib/analytics"

export function TrainingEnquiryForm({
  programmes = []
}: {
  programmes?: string[]
}) {
  const [submitted, setSubmitted] = React.useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset
  } = useForm<TrainingInput>({
    resolver: zodResolver(trainingSchema),
    defaultValues: {
      programme: "",
      organisation: "",
      contactName: "",
      email: "",
      telephone: "",
      delegateCount: "",
      seniority: "",
      preferredDates: "",
      location: "",
      deliveryMode: "",
      objectives: "",
      honeypot: ""
    }
  })

  async function onSubmit(values: TrainingInput) {
    try {
      const res = await fetch("/api/training-enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values)
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.error || "Could not send your request")
      setSubmitted(true)
      reset()
      track("training_proposal_submit", { programme: values.programme || "Custom" })
      toast.success("Training proposal request received", {
        description: "Our Academy team will be in touch shortly."
      })
    } catch (e) {
      toast.error("We couldn't send your request", {
        description: e instanceof Error ? e.message : "Please try again."
      })
    }
  }

  if (submitted) {
    return (
      <div className="rounded-2xl border border-gold-500/30 bg-white p-10 text-center shadow-card">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gold-500/15 text-gold-600">
          <CheckCircle2 className="h-7 w-7" />
        </span>
        <h3 className="mt-5 font-serif text-2xl text-navy-900">
          Thank you — request received.
        </h3>
        <p className="mx-auto mt-3 max-w-md text-sm text-slate-500">
          Our Academy team will review your objectives and respond with a tailored
          proposal.
        </p>
        <Button variant="outline" className="mt-6" onClick={() => setSubmitted(false)}>
          Submit another request
        </Button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-5" noValidate>
      <input
        type="text"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="hidden"
        {...register("honeypot")}
      />

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Programme of interest" error={errors.programme?.message}>
          <select
            className="h-12 w-full rounded-xl border border-navy-100 bg-white px-4 text-sm text-navy-900 shadow-sm outline-none transition-colors focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20"
            {...register("programme")}
          >
            <option value="">Select or specify below</option>
            {programmes.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
            <option value="Customised programme">Customised programme</option>
          </select>
        </Field>
        <Field label="Organisation" required error={errors.organisation?.message}>
          <Input placeholder="Organisation name" {...register("organisation")} />
        </Field>
        <Field label="Contact name" required error={errors.contactName?.message}>
          <Input placeholder="Your full name" {...register("contactName")} />
        </Field>
        <Field label="Email" required error={errors.email?.message}>
          <Input type="email" placeholder="you@company.com" {...register("email")} />
        </Field>
        <Field label="Telephone" error={errors.telephone?.message}>
          <Input placeholder="+263 ..." {...register("telephone")} />
        </Field>
        <Field label="Number of delegates" error={errors.delegateCount?.message}>
          <Input placeholder="e.g. 15" {...register("delegateCount")} />
        </Field>
        <Field label="Seniority / audience" error={errors.seniority?.message}>
          <select
            className="h-12 w-full rounded-xl border border-navy-100 bg-white px-4 text-sm text-navy-900 shadow-sm outline-none transition-colors focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20"
            {...register("seniority")}
          >
            <option value="">Select audience</option>
            {SENIORITY_LEVELS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Delivery mode" error={errors.deliveryMode?.message}>
          <select
            className="h-12 w-full rounded-xl border border-navy-100 bg-white px-4 text-sm text-navy-900 shadow-sm outline-none transition-colors focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20"
            {...register("deliveryMode")}
          >
            <option value="">Select mode</option>
            {DELIVERY_MODES.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Preferred dates" error={errors.preferredDates?.message}>
          <Input placeholder="e.g. Q2 2026" {...register("preferredDates")} />
        </Field>
        <Field label="Location" error={errors.location?.message}>
          <Input placeholder="City / venue" {...register("location")} />
        </Field>
      </div>

      <Field label="Specific learning objectives" required error={errors.objectives?.message}>
        <Textarea
          placeholder="Tell us about the team, the outcomes you want and any context."
          className="min-h-32"
          {...register("objectives")}
        />
      </Field>

      <Button type="submit" size="lg" disabled={isSubmitting} className="w-fit">
        {isSubmitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Sending...
          </>
        ) : (
          <>
            Request a Corporate Training Proposal
            <Send className="h-4 w-4" />
          </>
        )}
      </Button>
    </form>
  )
}

function Field({
  label,
  required,
  error,
  children
}: {
  label: string
  required?: boolean
  error?: string
  children: React.ReactNode
}) {
  return (
    <div className="grid gap-2">
      <Label>
        {label}
        {required && <span className="ml-1 text-gold-600">*</span>}
      </Label>
      {children}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  )
}
