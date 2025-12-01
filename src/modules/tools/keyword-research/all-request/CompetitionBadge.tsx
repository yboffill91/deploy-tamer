interface CompetitionBadgeProps {
  competition: "LOW" | "MEDIUM" | "HIGH"
}

export default function CompetitionBadge({ competition }: CompetitionBadgeProps) {
  const variants: Record<string, { bg: string; text: string }> = {
    LOW: {
      bg: "bg-green-100",
      text: "text-green-800",
    },
    MEDIUM: {
      bg: "bg-yellow-100",
      text: "text-yellow-800",
    },
    HIGH: {
      bg: "bg-red-100",
      text: "text-red-800",
    },
  }

  const { bg, text } = variants[competition] || variants.LOW

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${bg} ${text}`}>
      {competition}
    </span>
  )
}
