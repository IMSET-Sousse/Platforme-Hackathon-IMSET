"use client"

import { useState, useEffect } from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts"
import { Award, RefreshCw, TrendingUp, GitCommit, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import AuthenticatedLayout from "@/components/layout/authenticated-layout"

// Données fictives pour la démo
const MOCK_TEAMS = [
  {
    id: "1",
    rank: 1,
    name: "ByteBusters",
    score: 1250,
    commits: 78,
    contributors: 4,
    challenges: ["API RESTful", "Dashboard Analytics", "Microservices"],
    isCurrentTeam: false,
  },
  {
    id: "2",
    rank: 2,
    name: "CodeCrafters",
    score: 1120,
    commits: 65,
    contributors: 3,
    challenges: ["API RESTful", "Application React Native"],
    isCurrentTeam: true,
  },
  {
    id: "3",
    rank: 3,
    name: "DevDynamos",
    score: 980,
    commits: 52,
    contributors: 4,
    challenges: ["Dashboard Analytics", "Système de recommandation ML", "Jeu HTML5"],
    isCurrentTeam: false,
  },
  {
    id: "4",
    rank: 4,
    name: "TechTitans",
    score: 870,
    commits: 43,
    contributors: 3,
    challenges: ["Application PWA", "Chatbot avec NLP"],
    isCurrentTeam: false,
  },
  {
    id: "5",
    rank: 5,
    name: "PixelPioneers",
    score: 760,
    commits: 38,
    contributors: 3,
    challenges: ["Jeu HTML5", "Application de e-commerce"],
    isCurrentTeam: false,
  },
  {
    id: "6",
    rank: 6,
    name: "WebWizards",
    score: 720,
    commits: 35,
    contributors: 2,
    challenges: ["Application PWA", "Dashboard Analytics"],
    isCurrentTeam: false,
  },
  {
    id: "7",
    rank: 7,
    name: "DataDragons",
    score: 680,
    commits: 32,
    contributors: 3,
    challenges: ["Système de recommandation ML", "Chatbot avec NLP"],
    isCurrentTeam: false,
  },
  {
    id: "8",
    rank: 8,
    name: "MobileMasters",
    score: 650,
    commits: 30,
    contributors: 2,
    challenges: ["Application React Native", "Application PWA"],
    isCurrentTeam: false,
  },
  {
    id: "9",
    rank: 9,
    name: "CloudCoders",
    score: 620,
    commits: 28,
    contributors: 3,
    challenges: ["Microservices", "API RESTful"],
    isCurrentTeam: false,
  },
  {
    id: "10",
    rank: 10,
    name: "AIArtisans",
    score: 590,
    commits: 26,
    contributors: 2,
    challenges: ["Chatbot avec NLP", "Système de recommandation ML"],
    isCurrentTeam: false,
  },
]

const MOCK_CHALLENGES = [
  { id: "1", name: "API RESTful", teams: 8 },
  { id: "2", name: "Application React Native", teams: 6 },
  { id: "3", name: "Dashboard Analytics", teams: 7 },
  { id: "4", name: "Système de recommandation ML", teams: 5 },
  { id: "5", name: "Chatbot avec NLP", teams: 4 },
  { id: "6", name: "Application de e-commerce", teams: 3 },
  { id: "7", name: "Système de gestion de contenu", teams: 2 },
  { id: "8", name: "Application PWA", teams: 5 },
  { id: "9", name: "Microservices", teams: 4 },
  { id: "10", name: "Jeu HTML5", teams: 3 },
]

export default function LeaderboardPage() {
  const [loading, setLoading] = useState(true)
  const [teams, setTeams] = useState<typeof MOCK_TEAMS>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [challengeFilter, setChallengeFilter] = useState<string>("all")
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())
  const [isRefreshing, setIsRefreshing] = useState(false)

  useEffect(() => {
    // Simuler le chargement des données
    const timer = setTimeout(() => {
      setTeams(MOCK_TEAMS)
      setLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  const handleRefresh = () => {
    setIsRefreshing(true)

    // Simuler une actualisation des données
    setTimeout(() => {
      setLastUpdated(new Date())
      setIsRefreshing(false)
    }, 1500)
  }

  const filteredTeams = teams.filter((team) => {
    const matchesSearch = team.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesChallenge = challengeFilter === "all" || team.challenges.some((c) => c.includes(challengeFilter))

    return matchesSearch && matchesChallenge
  })

  // Données pour le graphique
  const chartData = teams.slice(0, 10).map((team) => ({
    name: team.name,
    score: team.score,
    isCurrentTeam: team.isCurrentTeam,
  }))

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
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-[#222222]">Classement</h1>
            <p className="text-[#8b8b8bde] mt-2">Suivez les performances des équipes en temps réel.</p>
          </div>

          <div className="flex items-center gap-2">
            <p className="text-sm text-[#8b8b8bde]">Dernière mise à jour: {lastUpdated.toLocaleTimeString()}</p>
            <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isRefreshing}>
              <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
              Actualiser
            </Button>
          </div>
        </div>

        <Tabs defaultValue="tableau">
          <div className="flex justify-between items-center mb-6">
            <TabsList>
              <TabsTrigger value="tableau">Tableau</TabsTrigger>
              <TabsTrigger value="graphique">Graphique</TabsTrigger>
            </TabsList>

            <div className="flex items-center gap-2">
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Rechercher une équipe..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <Select value={challengeFilter} onValueChange={setChallengeFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Tous les défis" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les défis</SelectItem>
                  {MOCK_CHALLENGES.map((challenge) => (
                    <SelectItem key={challenge.id} value={challenge.name}>
                      {challenge.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <TabsContent value="tableau" className="mt-0">
            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-4 font-medium text-[#8b8b8bde]">Rang</th>
                        <th className="text-left p-4 font-medium text-[#8b8b8bde]">Équipe</th>
                        <th className="text-left p-4 font-medium text-[#8b8b8bde]">Score</th>
                        <th className="text-left p-4 font-medium text-[#8b8b8bde]">Commits</th>
                        <th className="text-left p-4 font-medium text-[#8b8b8bde]">Contributeurs</th>
                        <th className="text-left p-4 font-medium text-[#8b8b8bde]">Défis</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredTeams.map((team) => (
                        <tr
                          key={team.id}
                          className={`border-b hover:bg-gray-50 ${team.isCurrentTeam ? "bg-[#d7b369]/10" : ""}`}
                        >
                          <td className="p-4">
                            <div
                              className={`h-8 w-8 rounded-full flex items-center justify-center font-semibold ${
                                team.rank <= 3 ? "bg-[#d7b369] text-white" : "bg-gray-100 text-[#555555]"
                              }`}
                            >
                              {team.rank}
                            </div>
                          </td>
                          <td className="p-4 font-medium">
                            {team.name}
                            {team.isCurrentTeam && (
                              <Badge variant="outline" className="ml-2">
                                Votre équipe
                              </Badge>
                            )}
                          </td>
                          <td className="p-4 font-bold text-[#555555]">{team.score}</td>
                          <td className="p-4">{team.commits}</td>
                          <td className="p-4">{team.contributors}</td>
                          <td className="p-4">
                            <div className="flex flex-wrap gap-1">
                              {team.challenges.map((challenge, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {challenge}
                                </Badge>
                              ))}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="graphique" className="mt-0">
            <Card>
              <CardHeader>
                <CardTitle>Scores des équipes (Top 10)</CardTitle>
                <CardDescription>Comparaison visuelle des scores des 10 meilleures équipes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" angle={-45} textAnchor="end" height={70} tick={{ fontSize: 12 }} />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="score" fill="#d7b369">
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.isCurrentTeam ? "#d89f2b" : "#d7b369"} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <Award className="mr-2 h-5 w-5 text-[#d7b369]" />
                Top 3 Équipes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {teams.slice(0, 3).map((team) => (
                  <div key={team.id} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-[#d7b369] text-white flex items-center justify-center font-semibold mr-3">
                        {team.rank}
                      </div>
                      <span className="font-medium">{team.name}</span>
                    </div>
                    <span className="font-bold text-[#555555]">{team.score}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <TrendingUp className="mr-2 h-5 w-5 text-[#d7b369]" />
                Statistiques globales
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm text-[#8b8b8bde]">Équipes</p>
                  <p className="text-xl font-bold text-[#555555]">{teams.length}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm text-[#8b8b8bde]">Commits totaux</p>
                  <p className="text-xl font-bold text-[#555555]">
                    {teams.reduce((sum, team) => sum + team.commits, 0)}
                  </p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm text-[#8b8b8bde]">Contributeurs</p>
                  <p className="text-xl font-bold text-[#555555]">
                    {teams.reduce((sum, team) => sum + team.contributors, 0)}
                  </p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm text-[#8b8b8bde]">Score moyen</p>
                  <p className="text-xl font-bold text-[#555555]">
                    {Math.round(teams.reduce((sum, team) => sum + team.score, 0) / teams.length)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <GitCommit className="mr-2 h-5 w-5 text-[#d7b369]" />
                Défis populaires
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {MOCK_CHALLENGES.slice(0, 5).map((challenge) => (
                  <div key={challenge.id} className="flex items-center justify-between">
                    <span className="text-[#222222]">{challenge.name}</span>
                    <Badge variant="outline" className="text-xs">
                      {challenge.teams} équipes
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AuthenticatedLayout>
  )
}
