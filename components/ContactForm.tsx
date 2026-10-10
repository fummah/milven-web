"use client"

import * as React from "react"
import { useSearchParams } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { CheckCircle2, Loader2, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { contactSchema, type ContactInput, SERVICE_TYPES, CONTACT_METHODS } from "@/lib/validations"

export function ContactForm() {
  const params = useSearchParams()
  const [submitted, setSubmitted] = React.useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset
  } = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      organisation: "",
      role: "",
      email: "",
      telephone: "",
      service: params.get("service") || "",
      message: params.get("programme")
        ? `I would like more information about the "${params.get("programme")}" programme.`
        : params.get("industry")
          ? `I would like to discuss support for the ${params.get("industry")} sector.`
          : "",
      preferredMethod: "Email",
      honeypot: ""
    }
  })

  async function onSubmit(values: ContactInput) {
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values)
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.error || "Request failed")

      setSubmitted(true)
      reset()
      toast.success("Thank you. Your enquiry has been received.", {
        description: "A member of the Milven team will be in touch shortly."
      })
    } catch (e) {
      toast.error("We couldn't send your enquiry", {
        description:
          e instanceof Error ? e.message : "Please try again or email us directly."
      })
    }
  }

  if (submitted) {
    return (
      <div className="rounded-2xl border border-gold-500/30 bg-cream p-10 text-center">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gold-500/15 text-gold-600">
          <CheckCircle2 className="h-7 w-7" />
        </span>
        <h3 className="mt-5 font-serif text-3xl text-navy-900">
          Thank you for reaching out.
        </h3>
        <p className="mx-auto mt-3 max-w-md text-slate-500">
          Your enquiry has been received. A member of the Milven team will respond
          shortly.
        </p>
        <Button
          variant="outline"
          className="mt-7"
          onClick={() => setSubmitted(false)}
        >
          Send another enquiry
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
        <Field label="Full Name" required error={errors.name?.message}>
          <Input placeholder="Your full name" {...register("name")} />
        </Field>
        <Field label="Organisation" error={errors.organisation?.message}>
          <Input placeholder="Organisation name" {...register("organisation")} />
        </Field>
        <Field label="Position / Role" error={errors.role?.message}>
          <Input placeholder="e.g. Finance Director" {...register("role")} />
        </Field>
        <Field label="Email" required error={errors.email?.message}>
          <Input type="email" placeholder="you@company.com" {...register("email")} />
        </Field>
        <Field label="Telephone" error={errors.telephone?.message}>
          <Input placeholder="+263 ..." {...register("telephone")} />
        </Field>
        <Field label="Service of Interest" error={errors.service?.message}>
          <select
            className="h-12 w-full rounded-xl border border-navy-100 bg-white px-4 text-sm text-navy-900 shadow-sm outline-none transition-colors focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20"
            {...register("service")}
          >
            <option value="">Select a service</option>
            {SERVICE_TYPES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <Field label="Requirement Description" required error={errors.message?.message}>
        <Textarea
          placeholder="Tell us about your requirement, challenge or opportunity."
          className="min-h-36"
          {...register("message")}
        />
      </Field>

      <Field label="Preferred Contact Method" error={errors.preferredMethod?.message}>
        <div className="flex flex-wrap gap-2">
          {CONTACT_METHODS.map((m) => (
            <label
              key={m}
              className="cursor-pointer rounded-full border border-navy-100 px-4 py-2 text-sm text-navy-600 transition-colors has-[:checked]:border-navy-900 has-[:checked]:bg-navy-900 has-[:checked]:text-white"
            >
              <input type="radio" value={m} className="hidden" {...register("preferredMethod")} />
              {m}
            </label>
          ))}
        </div>
      </Field>

      <Button type="submit" size="lg" disabled={isSubmitting} className="w-fit">
        {isSubmitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Sending...
          </>
        ) : (
          <>
            Speak to Milven
            <Send className="h-4 w-4" />
          </>
        )}
      </Button>
      <p className="text-xs text-slate-400">
        By submitting this form you consent to Milven contacting you about your
        enquiry. We treat all information confidentially.
      </p>
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
