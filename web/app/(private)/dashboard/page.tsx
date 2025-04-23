"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Users, Code, ArrowRight, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ChallengeCard, type Challenge } from "@/components/ui/challenge-card"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
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
]

const MOCK_TEAM = {
  name: "CodeCrafters",
  members: 3,
  repository: "https://github.com/codecrafters/hackathon-project",
  isLeader: true,
}

const MOCK_LEADERBOARD = [
  { rank: 1, name: "ByteBusters", score: 1250, commits: 78 },
  { rank: 2, name: "CodeCrafters", score: 1120, commits: 65 },
  { rank: 3, name: "DevDynamos", score: 980, commits: 52 },
  { rank: 4, name: "TechTitans", score: 870, commits: 43 },
  { rank: 5, name: "PixelPioneers", score: 760, commits: 38 },
]

// Date fictive pour la phase actuelle
const PHASE_END_DATE = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000) // 2 jours à partir de maintenant

export default function DashboardPage() {
  const [loading, setLoading] = useState(true)
  const [selectedChallenges, setSelectedChallenges] = useState<Challenge[]>([])

  useEffect(() => {
    // Simuler le chargement des données
    const timer = setTimeout(() => {
      setSelectedChallenges(MOCK_CHALLENGES.filter((c) => c.isSelected))
      setLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

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
        {/* En-tête du tableau de bord */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#222222]">Tableau de bord</h1>
          <p className="text-[#8b8b8bde] mt-2">
            Bienvenue sur la plateforme du Hackathon IMSET. Suivez votre progression et gérez votre équipe.
          </p>
        </div>

        {/* Compteur à rebours */}
        <div className="bg-white p-6 rounded-lg shadow-sm mb-8 border border-gray-100">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-[#222222] flex items-center">
                <Clock className="mr-2 h-5 w-5 text-[#d7b369]" />
                Phase actuelle: Sélection des défis
              </h2>
              <p className="text-[#8b8b8bde] mt-1">
                Sélectionnez jusqu'à 5 défis pour votre équipe avant la fin de cette phase.
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <p className="text-sm text-[#8b8b8bde] mb-2 text-center">Temps restant:</p>
              <CountdownTimer targetDate={PHASE_END_DATE} />
            </div>
          </div>
        </div>

        {/* Grille principale */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Colonne gauche - Statut de l'équipe */}
          <div className="lg:col-span-2 space-y-6">
            {/* Carte d'équipe */}
            <Card>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-xl text-[#222222]">Votre équipe</CardTitle>
                  <Link href="/team">
                    <Button variant="ghost" size="sm" className="text-[#d7b369] hover:text-[#d89f2b]">
                      Gérer <ArrowRight className="ml-1 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                {MOCK_TEAM ? (
                  <div className="flex flex-col md:flex-row md:items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold">{MOCK_TEAM.name}</h3>
                      <p className="text-[#8b8b8bde] text-sm mt-1">
                        {MOCK_TEAM.members} membres • {MOCK_TEAM.isLeader ? "Vous êtes le chef d'équipe" : "Membre"}
                      </p>
                      <p className="text-[#8b8b8bde] text-sm mt-1 truncate max-w-xs">Dépôt: {MOCK_TEAM.repository}</p>
                    </div>
                    <div className="mt-4 md:mt-0">
                      <Button className="bg-[#d7b369] hover:bg-[#d89f2b]">
                        <Users className="mr-2 h-4 w-4" />
                        Inviter des membres
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <Users className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                    <h3 className="text-lg font-medium text-[#222222]">Vous n'avez pas encore d'équipe</h3>
                    <p className="text-[#8b8b8bde] mb-4">Créez ou rejoignez une équipe pour participer au hackathon</p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                      <Button className="bg-[#d7b369] hover:bg-[#d89f2b]">Créer une équipe</Button>
                      <Button variant="outline">Rejoindre une équipe</Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Défis sélectionnés */}
            <Card>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-xl text-[#222222]">Défis sélectionnés</CardTitle>
                  <Link href="/challenges">
                    <Button variant="ghost" size="sm" className="text-[#d7b369] hover:text-[#d89f2b]">
                      Gérer <ArrowRight className="ml-1 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
                <CardDescription>{selectedChallenges.length}/5 défis sélectionnés</CardDescription>
              </CardHeader>
              <CardContent>
                {selectedChallenges.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedChallenges.map((challenge) => (
                      <ChallengeCard key={challenge.id} challenge={challenge} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <Code className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                    <h3 className="text-lg font-medium text-[#222222]">Aucun défi sélectionné</h3>
                    <p className="text-[#8b8b8bde] mb-4">Sélectionnez jusqu'à 5 défis pour votre équipe</p>
                    <Link href="/challenges">
                      <Button className="bg-[#d7b369] hover:bg-[#d89f2b]">Parcourir les défis</Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Activité récente */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl text-[#222222]">Activité récente</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                      <Users className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Nouveau membre dans l'équipe</p>
                      <p className="text-xs text-[#8b8b8bde]">Sarah a rejoint votre équipe</p>
                      <p className="text-xs text-[#8b8b8bde]">Il y a 2 heures</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                      <Code className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Défi sélectionné</p>
                      <p className="text-xs text-[#8b8b8bde]">
                        Vous avez sélectionné le défi "API RESTful avec Express"
                      </p>
                      <p className="text-xs text-[#8b8b8bde]">Il y a 1 jour</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Colonne droite - Classement et statistiques */}
          <div className="space-y-6">
            {/* Classement */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-xl text-[#222222]">Classement</CardTitle>
                  <Link href="/leaderboard">
                    <Button variant="ghost" size="sm" className="text-[#d7b369] hover:text-[#d89f2b]">
                      Voir tout <ArrowRight className="ml-1 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {MOCK_LEADERBOARD.map((team) => (
                    <div
                      key={team.rank}
                      className={`flex items-center justify-between p-3 rounded-md ${
                        team.name === "CodeCrafters" ? "bg-[#d7b369]/10 border border-[#d7b369]/30" : ""
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`h-8 w-8 rounded-full flex items-center justify-center font-semibold ${
                            team.rank <= 3 ? "bg-[#d7b369] text-white" : "bg-gray-100 text-[#555555]"
                          }`}
                        >
                          {team.rank}
                        </div>
                        <div>
                          <p className="font-medium">{team.name}</p>
                          <p className="text-xs text-[#8b8b8bde]">{team.commits} commits</p>
                        </div>
                      </div>
                      <div className="text-lg font-bold text-[#555555]">{team.score}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="border-t pt-4">
                <p className="text-xs text-[#8b8b8bde] w-full text-center">Dernière mise à jour: aujourd'hui à 14:30</p>
              </CardFooter>
            </Card>

            {/* Statistiques */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl text-[#222222]">Statistiques</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-[#8b8b8bde]">Équipes</p>
                    <p className="text-2xl font-bold text-[#555555]">24</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-[#8b8b8bde]">Participants</p>
                    <p className="text-2xl font-bold text-[#555555]">87</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-[#8b8b8bde]">Défis</p>
                    <p className="text-2xl font-bold text-[#555555]">15</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-[#8b8b8bde]">Commits</p>
                    <p className="text-2xl font-bold text-[#555555]">1,243</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Ressources */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl text-[#222222]">Ressources</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Link href="#" className="block p-3 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors">
                    <p className="font-medium">Guide du participant</p>
                    <p className="text-sm text-[#8b8b8bde]">Tout ce que vous devez savoir pour participer</p>
                  </Link>
                  <Link href="#" className="block p-3 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors">
                    <p className="font-medium">Documentation API</p>
                    <p className="text-sm text-[#8b8b8bde]">Accédez aux API disponibles pour le hackathon</p>
                  </Link>
                  <Link href="#" className="block p-3 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors">
                    <p className="font-medium">FAQ</p>
                    <p className="text-sm text-[#8b8b8bde]">Questions fréquemment posées</p>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  )
}
