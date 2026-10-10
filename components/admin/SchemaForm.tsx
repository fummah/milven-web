"use client"

import * as React from "react"
import { ChevronUp, ChevronDown, Plus, Trash2, GripVertical } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { MediaPicker } from "@/components/admin/MediaPicker"

export type FieldSchema =
  | { key: string; label: string; type: "text" }
  | { key: string; label: string; type: "textarea"; rows?: number }
  | { key: string; label: string; type: "image" }
  | { key: string; label: string; type: "tags" }
  | { key: string; label: string; type: "group"; fields: FieldSchema[]; itemLabel?: string }
  | { key: string; label: string; type: "list"; fields: FieldSchema[]; itemLabel?: string }

function defaultValue(field: FieldSchema): any {
  switch (field.type) {
    case "tags":
      return []
    case "list":
      return []
    case "group":
      return Object.fromEntries(field.fields.map((f) => [f.key, defaultValue(f)]))
    default:
      return ""
  }
}

export function blankItem(fields: FieldSchema[]) {
  return Object.fromEntries(fields.map((f) => [f.key, defaultValue(f)]))
}

export function SchemaForm({
  schema,
  value,
  onChange
}: {
  schema: FieldSchema[]
  value: any
  onChange: (val: any) => void
}) {
  const v = value ?? {}

  function update(key: string, val: any) {
    onChange({ ...v, [key]: val })
  }

  return (
    <div className="grid gap-5">
      {schema.map((field) => (
        <FieldControl
          key={field.key}
          field={field}
          value={v[field.key]}
          onChange={(val) => update(field.key, val)}
        />
      ))}
    </div>
  )
}

function FieldControl({
  field,
  value,
  onChange
}: {
  field: FieldSchema
  value: any
  onChange: (val: any) => void
}) {
  if (field.type === "text") {
    return (
      <div className="grid gap-2">
        <Label>{field.label}</Label>
        <Input value={value ?? ""} onChange={(e) => onChange(e.target.value)} />
      </div>
    )
  }

  if (field.type === "textarea") {
    return (
      <div className="grid gap-2">
        <Label>{field.label}</Label>
        <Textarea
          rows={field.rows}
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
    )
  }

  if (field.type === "image") {
    return (
      <div className="grid gap-2">
        <Label>{field.label}</Label>
        <MediaPicker value={value} onChange={onChange} label={field.label} />
      </div>
    )
  }

  if (field.type === "tags") {
    const items: string[] = Array.isArray(value) ? value : []
    return (
      <div className="grid gap-2">
        <Label>{field.label}</Label>
        <div className="grid gap-2">
          {items.map((item, i) => (
            <div key={i} className="flex gap-2">
              <Input
                value={item}
                onChange={(e) => {
                  const next = [...items]
                  next[i] = e.target.value
                  onChange(next)
                }}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => onChange(items.filter((_, idx) => idx !== i))}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="w-fit"
          onClick={() => onChange([...items, ""])}
        >
          <Plus className="h-4 w-4" /> Add item
        </Button>
      </div>
    )
  }

  if (field.type === "group") {
    return (
      <div className="rounded-xl border border-navy-100 bg-cream/40 p-4">
        <Label className="text-navy-900">{field.label}</Label>
        <div className="mt-4">
          <SchemaForm schema={field.fields} value={value} onChange={onChange} />
        </div>
      </div>
    )
  }

  // list of objects
  const items: any[] = Array.isArray(value) ? value : []
  return (
    <div className="grid gap-3">
      <div className="flex items-center justify-between">
        <Label className="text-navy-900">{field.label}</Label>
        <span className="text-xs text-slate-400">{items.length} item(s)</span>
      </div>
      <div className="grid gap-3">
        {items.map((item, i) => (
          <div key={i} className="rounded-xl border border-navy-100 bg-white p-4">
            <div className="mb-3 flex items-center justify-between">
              <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
                <GripVertical className="h-3.5 w-3.5" />
                {field.itemLabel || "Item"} {i + 1}
                {field.itemLabel && item?.title ? ` · ${item.title}` : ""}
              </span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  disabled={i === 0}
                  onClick={() => {
                    const next = [...items]
                    ;[next[i - 1], next[i]] = [next[i], next[i - 1]]
                    onChange(next)
                  }}
                  className="rounded p-1 text-slate-400 hover:text-navy-800 disabled:opacity-30"
                >
                  <ChevronUp className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  disabled={i === items.length - 1}
                  onClick={() => {
                    const next = [...items]
                    ;[next[i], next[i + 1]] = [next[i + 1], next[i]]
                    onChange(next)
                  }}
                  className="rounded p-1 text-slate-400 hover:text-navy-800 disabled:opacity-30"
                >
                  <ChevronDown className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => onChange(items.filter((_, idx) => idx !== i))}
                  className="rounded p-1 text-slate-400 hover:text-red-500"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
            <SchemaForm
              schema={field.fields}
              value={item}
              onChange={(val) => {
                const next = [...items]
                next[i] = val
                onChange(next)
              }}
            />
          </div>
        ))}
      </div>
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="w-fit"
        onClick={() => onChange([...items, blankItem(field.fields)])}
      >
        <Plus className="h-4 w-4" /> Add {field.itemLabel || "item"}
      </Button>
    </div>
  )
}
