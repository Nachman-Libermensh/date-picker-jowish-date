"use client"

import * as React from "react"
import { CheckIcon, CopyIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type CodeSnippetProps = {
  code: string
  language?: string
  title?: string
  className?: string
}

function CodeSnippet({
  code,
  language = "text",
  title,
  className,
}: CodeSnippetProps) {
  const [copied, setCopied] = React.useState(false)

  const onCopy = React.useCallback(async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1800)
    } catch {
      setCopied(false)
    }
  }, [code])

  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border bg-card text-card-foreground shadow-xs",
        className
      )}
    >
      <div className="flex items-center justify-between gap-2 border-b bg-muted/40 px-3 py-2 md:px-4">
        <div className="flex min-w-0 items-center gap-2">
          {title && <p className="truncate text-xs font-medium">{title}</p>}
          <span className="rounded bg-muted px-1.5 py-0.5 text-[11px] tracking-wide text-muted-foreground uppercase">
            {language}
          </span>
        </div>

        <Button
          type="button"
          variant="ghost"
          size="xs"
          className="shrink-0"
          onClick={onCopy}
          aria-label="העתק קוד"
        >
          {copied ? (
            <CheckIcon className="size-3.5" />
          ) : (
            <CopyIcon className="size-3.5" />
          )}
          {copied ? "הועתק" : "העתק"}
        </Button>
      </div>

      <pre
        dir="ltr"
        className="max-h-136 overflow-auto bg-zinc-950/95 p-4 text-xs leading-6 text-zinc-100 md:text-sm"
      >
        <code>{code}</code>
      </pre>
    </div>
  )
}

export { CodeSnippet }
