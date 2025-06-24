import Link from "next/link"
import React from "react"
import CustomImage from "./ui/image"

const SearchResult = ({
  label,
  thumbnail,
  sub,
  href,
}: {
  label: string
  thumbnail?: string
  sub?: string
  href: string
}) => {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 p-3 rounded-md bg-muted/50 hover:bg-muted transition-colors border border-border/50"
    >
      {thumbnail && (
        <CustomImage
          alt={label}
          src={thumbnail}
          width={36}
          height={36}
          className="rounded-md object-cover ring-1 ring-slate-700"
        />
      )}
      <div className="flex flex-col overflow-hidden">
        <p className="text-sm font-medium text-foreground truncate">{label}</p>
        {sub && (
          <p className="text-xs text-muted-foreground truncate">{sub}</p>
        )}
      </div>
    </Link>
  )
}

export default SearchResult
