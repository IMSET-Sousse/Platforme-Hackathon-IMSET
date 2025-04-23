"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export interface Challenge {
  id: string
  title: string
  description: string
  difficulty: "easy" | "medium" | "hard"
  category: string
  isSelected?: boolean
}

interface ChallengeCardProps {
  challenge: Challenge
  onSelect?: (id: string) => void
  selectionMode?: boolean
  className?: string
}

export function ChallengeCard({ challenge, onSelect, selectionMode = false, className }: ChallengeCardProps) {
  const difficultyColors = {
    easy: "bg-green-100 text-green-800",
    medium: "bg-yellow-100 text-yellow-800",
    hard: "bg-red-100 text-red-800",
  }

  return (
    <Card className={`overflow-hidden transition-all hover:shadow-md ${className}`}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-[#222222] text-lg">{challenge.title}</CardTitle>
          <Badge className={difficultyColors[challenge.difficulty]}>
            {challenge.difficulty.charAt(0).toUpperCase() + challenge.difficulty.slice(1)}
          </Badge>
        </div>
        <CardDescription className="text-xs text-[#8b8b8bde]">{challenge.category}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-[#8b8b8bde] line-clamp-3">{challenge.description}</p>
      </CardContent>
      <CardFooter className="flex justify-between pt-2">
        <Link href={`/challenges/${challenge.id}`} className="text-sm text-[#d7b369] hover:text-[#d89f2b]">
          Voir les détails
        </Link>
        {selectionMode && (
          <Button
            variant={challenge.isSelected ? "destructive" : "secondary"}
            size="sm"
            onClick={() => onSelect && onSelect(challenge.id)}
          >
            {challenge.isSelected ? "Désélectionner" : "Sélectionner"}
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
