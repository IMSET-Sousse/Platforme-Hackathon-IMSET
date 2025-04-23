"use client"

import { useState, useEffect } from "react"
import { Search, Filter, Clock, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChallengeCard, type Challenge } from "@/components/ui/challenge-card"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { useToast } from "@/hooks/use-toast"
import AuthenticatedLayout from "@/components/layout/authenticated-layout"
import CountdownTimer from "@/components/countdown-timer"

// Données fictives pour la démo
const MOCK_CHALLENGES: Challenge[] = [
  {
    id: "1",
    title: "API RESTful avec Express",
    description:
      "Créer une API RESTful complète avec Express.js, incluant l'authentification JWT et la validation des données.",
    difficulty: "medium",
    category: "Backend",
    isSelected: true,
  },
  {
    id: "2",
    title: "Application React Native",
    description:
      "Développer une application mobile cross-platform avec React Native qui consomme une API et gère l'état avec Redux.",
    difficulty: "hard",
    category: "Mobile",
    isSelected: true,
  },
  {
    id: "3",
    title: "Dashboard Analytics",
    description:
      "Créer un tableau de bord d'analyse de données avec des graphiques interactifs et des filtres avancés.",
    difficulty: "medium",
    category: "Frontend",
    isSelected: false,
  },
  {
    id: "4",
    title: "Système de recommandation ML",
    description:
      "Implémenter un système de recommandation basé sur le machine learning pour suggérer des produits aux utilisateurs.",
    difficulty: "hard",
    category: "Data Science",
    isSelected: false,
  },
  {
    id: "5",
    title: "Chatbot avec NLP",
    description:
      "Développer un chatbot intelligent utilisant le traitement du langage naturel pour répondre aux questions des utilisateurs.",
    difficulty: "hard",
    category: "IA",
    isSelected: false,
  },
  {
    id: "6",
    title: "Application de e-commerce",
    description: "Créer une application de e-commerce complète avec panier, paiement et gestion des commandes.",
    difficulty: "medium",
    category: "Fullstack",
    isSelected: false,
  },
  {
    id: "7",
    title: "Système de gestion de contenu",
    description: "Développer un CMS personnalisé avec éditeur WYSIWYG et gestion des médias.",
    difficulty: "medium",
    category: "Fullstack",
    isSelected: false,
  },
  {
    id: "8",
    title: "Application PWA",
    description: "Créer une Progressive Web App avec fonctionnalités offline et notifications push.",
    difficulty: "medium",
    category: "Frontend",
    isSelected: false,
  },
  {
    id: "9",
    title: "Microservices avec Docker",
    description: "Implémenter une architecture microservices avec Docker et orchestration Kubernetes.",
    difficulty: "hard",
    category: "DevOps",
    isSelected: false,
  },
  {
    id: "10",
    title: "Jeu HTML5 Canvas",
    description: "Développer un jeu 2D interactif utilisant HTML5 Canvas et JavaScript.",
    difficulty: "easy",
    category: "Frontend",
    isSelected: false,
  },
]

// Date fictive pour la phase de sélection
const SELECTION_END_DATE = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000) // 2 jours à partir de maintenant

export default function ChallengesPage() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [challenges, setChallenges] = useState<Challenge[]>([])
  const [selectedChallenges, setSelectedChallenges] = useState<Challenge[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [difficultyFilter, setDifficultyFilter] = useState<string>("all")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")

  useEffect(() => {
    // Simuler le chargement des données
    const timer = setTimeout(() => {
      setChallenges(MOCK_CHALLENGES)
      setSelectedChallenges(MOCK_CHALLENGES.filter((c) => c.isSelected))
      setLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  const handleSelectChallenge = (id: string) => {
    const challenge = challenges.find((c) => c.id === id)
    if (!challenge) return

    // Vérifier si le défi est déjà sélectionné
    if (challenge.isSelected) {
      // Désélectionner le défi
      setChallenges(challenges.map((c) => (c.id === id ? { ...c, isSelected: false } : c)))
      setSelectedChallenges(selectedChallenges.filter((c) => c.id !== id))

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
      setChallenges(challenges.map((c) => (c.id === id ? { ...c, isSelected: true } : c)))
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
    const matchesSearch =
      challenge.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      challenge.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesDifficulty = difficultyFilter === "all" || challenge.difficulty === difficultyFilter
    const matchesCategory = categoryFilter === "all" || challenge.category === categoryFilter

    return matchesSearch && matchesDifficulty && matchesCategory
  })

  const categories = Array.from(new Set(challenges.map((c) => c.category)))

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
                  <label htmlFor="category" className="block text-sm font-medium text-[#8b8b8bde] mb-1">
                    Catégorie
                  </label>
                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Toutes les catégories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Toutes les catégories</SelectItem>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
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
                    setCategoryFilter("all")
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
                            <p className="text-xs text-[#8b8b8bde]">{challenge.category}</p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-[#710e20de] hover:bg-red-50 h-8 w-8 p-0"
                            onClick={() => handleSelectChallenge(challenge.id)}
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
                    setCategoryFilter("all")
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
