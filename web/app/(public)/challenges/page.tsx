"use client"

import CountdownTimer from "@/components/countdown-timer"
import AuthenticatedLayout from "@/components/layout/authenticated-layout"
import { Button } from "@/components/ui/button"
import { ChallengeCard } from "@/components/ui/challenge-card"
import { Input } from "@/components/ui/input"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { CheckCircle, Clock, Filter, Search } from "lucide-react"
import { useEffect, useState } from "react"

// Updated Challenge type to match API response
export type Challenge = {
  id: string
  title: string
  description: string
  difficulty: "easy" | "medium" | "hard"
  tags: { id: number, name: string }[]
  created_at?: string
  isSelected?: boolean
  category: string
}

// Date fictive pour la phase de sélection
const SELECTION_END_DATE = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000) // 2 jours à partir de maintenant

export default function ChallengesPage() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [challenges, setChallenges] = useState<Challenge[]>([])
  const [selectedChallenges, setSelectedChallenges] = useState<Challenge[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [difficultyFilter, setDifficultyFilter] = useState<string>("all")
  const [tagFilter, setTagFilter] = useState<string>("all")

  useEffect(() => {
    // Fetch challenges from API
    const fetchChallenges = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/defis/")
        const data = await response.json()

        // Add isSelected property to each challenge
        const formattedChallenges = data.map((challenge: any) => ({
          ...challenge,
          isSelected: false,
          // Ensure id is a string for consistency
          id: String(challenge.id),
          // Add category based on first tag for compatibility
          category: challenge.tags.length > 0 ? challenge.tags[0].name : "Divers",
          // Ensure description exists
          description: challenge.description || "Aucune description disponible.",
          // Ensure difficulty is one of the valid options
          difficulty: ["easy", "medium", "hard"].includes(challenge.difficulty) ? challenge.difficulty : "medium"
        }))

        setChallenges(formattedChallenges)
        setLoading(false)
      } catch (error) {
        console.error("Error fetching challenges:", error)
        toast({
          title: "Erreur",
          description: "Impossible de charger les défis. Veuillez réessayer plus tard.",
          variant: "error",
        })
        setLoading(false)
      }
    }

    fetchChallenges()
  }, [toast])

  const handleSelectChallenge = (id: string) => {
    const challenge = challenges.find((c) => String(c.id) === id)
    if (!challenge) return

    // Vérifier si le défi est déjà sélectionné
    if (challenge.isSelected) {
      // Désélectionner le défi
      setChallenges(challenges.map((c) => (String(c.id) === id ? { ...c, isSelected: false } : c)))
      setSelectedChallenges(selectedChallenges.filter((c) => String(c.id) !== id))

      toast({
        title: "Défi désélectionné",
        description: `Le défi "${challenge.title}" a été retiré de votre sélection.`,
        variant: "success",
      })
    } else {
      // Vérifier si l'équipe a déjà sélectionné 5 défis
      if (selectedChallenges.length >= 5) {
        toast({
          title: "Limite atteinte",
          description: "Vous ne pouvez pas sélectionner plus de 5 défis.",
          variant: "warning",
        })
        return
      }

      // Sélectionner le défi
      setChallenges(challenges.map((c) => (String(c.id) === id ? { ...c, isSelected: true } : c)))
      setSelectedChallenges([...selectedChallenges, { ...challenge, isSelected: true }])

      toast({
        title: "Défi sélectionné",
        description: `Le défi "${challenge.title}" a été ajouté à votre sélection.`,
        variant: "success",
      })
    }
  }

  const handleConfirmSelection = () => {
    // Dans une application réelle, vous enverriez cette sélection à votre API
    toast({
      title: "Sélection confirmée",
      description: `Vous avez sélectionné ${selectedChallenges.length} défis pour votre équipe.`,
      variant: "success",
    })
  }

  const filteredChallenges = challenges.filter((challenge) => {
    const matchesSearch = challenge.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (challenge.description?.toLowerCase().includes(searchQuery.toLowerCase()) || false)
    const matchesDifficulty = difficultyFilter === "all" || challenge.difficulty === difficultyFilter
    const matchesTag = tagFilter === "all" || challenge.tags.some(tag => tag.name === tagFilter)

    return matchesSearch && matchesDifficulty && matchesTag
  })

  // Extract all unique tags from challenges
  const tags = Array.from(new Set(challenges.flatMap(c => c.tags.map(tag => tag.name))))

  if (loading) {
    return (
      <AuthenticatedLayout>
        <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
          <LoadingSpinner size="lg" />
        </div>
      </AuthenticatedLayout>
    )
  }

  return (
    <AuthenticatedLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#222222]">Sélection des défis</h1>
          <p className="text-[#8b8b8bde] mt-2">Parcourez et sélectionnez jusqu'à 5 défis pour votre équipe.</p>
        </div>

        {/* Compteur à rebours */}
        <div className="bg-white p-6 rounded-lg shadow-sm mb-8 border border-gray-100">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-[#222222] flex items-center">
                <Clock className="mr-2 h-5 w-5 text-[#d7b369]" />
                Phase de sélection des défis
              </h2>
              <p className="text-[#8b8b8bde] mt-1">
                Vous avez jusqu'à la fin de cette phase pour finaliser votre sélection.
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <p className="text-sm text-[#8b8b8bde] mb-2 text-center">Temps restant:</p>
              <CountdownTimer targetDate={SELECTION_END_DATE} />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filtres et recherche */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <h2 className="text-lg font-semibold text-[#222222] mb-4">Filtres</h2>

              <div className="space-y-4">
                <div>
                  <label htmlFor="search" className="block text-sm font-medium text-[#8b8b8bde] mb-1">
                    Recherche
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="search"
                      placeholder="Rechercher un défi..."
                      className="pl-10"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="difficulty" className="block text-sm font-medium text-[#8b8b8bde] mb-1">
                    Difficulté
                  </label>
                  <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
                    <SelectTrigger id="difficulty">
                      <SelectValue placeholder="Toutes les difficultés" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Toutes les difficultés</SelectItem>
                      <SelectItem value="easy">Facile</SelectItem>
                      <SelectItem value="medium">Moyen</SelectItem>
                      <SelectItem value="hard">Difficile</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label htmlFor="tag" className="block text-sm font-medium text-[#8b8b8bde] mb-1">
                    Tag
                  </label>
                  <Select value={tagFilter} onValueChange={setTagFilter}>
                    <SelectTrigger id="tag">
                      <SelectValue placeholder="Tous les tags" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous les tags</SelectItem>
                      {tags.map((tag) => (
                        <SelectItem key={tag} value={tag}>
                          {tag}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  variant="outline"
                  className="w-full mt-2"
                  onClick={() => {
                    setSearchQuery("")
                    setDifficultyFilter("all")
                    setTagFilter("all")
                  }}
                >
                  <Filter className="mr-2 h-4 w-4" />
                  Réinitialiser les filtres
                </Button>
              </div>
            </div>

            {/* Défis sélectionnés */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <h2 className="text-lg font-semibold text-[#222222] mb-4">Défis sélectionnés</h2>

              <div className="space-y-3">
                {selectedChallenges.length > 0 ? (
                  <>
                    <p className="text-sm text-[#8b8b8bde]">{selectedChallenges.length}/5 défis sélectionnés</p>

                    <div className="space-y-2">
                      {selectedChallenges.map((challenge) => (
                        <div key={challenge.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                          <div>
                            <p className="font-medium text-sm">{challenge.title}</p>
                            <p className="text-xs text-[#8b8b8bde]">
                              {challenge.tags.map(tag => tag.name).join(", ")}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-[#710e20de] hover:bg-red-50 h-8 w-8 p-0"
                            onClick={() => handleSelectChallenge(String(challenge.id))}
                          >
                            <span className="sr-only">Retirer</span>
                            &times;
                          </Button>
                        </div>
                      ))}
                    </div>

                    <Button className="w-full bg-[#d7b369] hover:bg-[#d89f2b] mt-4" onClick={handleConfirmSelection}>
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Confirmer la sélection
                    </Button>
                  </>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-[#8b8b8bde] text-sm">Vous n'avez pas encore sélectionné de défis.</p>
                    <p className="text-[#8b8b8bde] text-sm mt-1">Sélectionnez jusqu'à 5 défis dans la liste.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Liste des défis */}
          <div className="lg:col-span-3">
            <div className="mb-4 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-[#222222]">{filteredChallenges.length} défis disponibles</h2>
            </div>

            {filteredChallenges.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                {filteredChallenges.map((challenge) => (
                  <ChallengeCard
                    key={challenge.id}
                    challenge={challenge}
                    onSelect={handleSelectChallenge}
                    selectionMode={true}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100 text-center">
                <Filter className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                <h3 className="text-lg font-medium text-[#222222]">Aucun défi trouvé</h3>
                <p className="text-[#8b8b8bde] mt-2">Aucun défi ne correspond à vos critères de recherche.</p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => {
                    setSearchQuery("")
                    setDifficultyFilter("all")
                    setTagFilter("all")
                  }}
                >
                  Réinitialiser les filtres
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  )
}
