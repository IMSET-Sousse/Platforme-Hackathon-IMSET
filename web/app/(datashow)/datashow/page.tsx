"use client"

import CountdownTimer from "@/components/countdown-timer"
import AuthenticatedLayout from "@/components/layout/authenticated-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Award, Clock, Code, GitCommit, Maximize, Moon, RefreshCw, Sun, Users } from "lucide-react"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

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
  },
  {
    id: "2",
    rank: 2,
    name: "CodeCrafters",
    score: 1120,
    commits: 65,
    contributors: 3,
    challenges: ["API RESTful", "Application React Native"],
  },
  {
    id: "3",
    rank: 3,
    name: "DevDynamos",
    score: 980,
    commits: 52,
    contributors: 4,
    challenges: ["Dashboard Analytics", "Système de recommandation ML", "Jeu HTML5"],
  },
  {
    id: "4",
    rank: 4,
    name: "TechTitans",
    score: 870,
    commits: 43,
    contributors: 3,
    challenges: ["Application PWA", "Chatbot avec NLP"],
  },
  {
    id: "5",
    rank: 5,
    name: "PixelPioneers",
    score: 760,
    commits: 38,
    contributors: 3,
    challenges: ["Jeu HTML5", "Application de e-commerce"],
  },
  {
    id: "6",
    rank: 6,
    name: "WebWizards",
    score: 720,
    commits: 35,
    contributors: 2,
    challenges: ["Application PWA", "Dashboard Analytics"],
  },
  {
    id: "7",
    rank: 7,
    name: "DataDragons",
    score: 680,
    commits: 32,
    contributors: 3,
    challenges: ["Système de recommandation ML", "Chatbot avec NLP"],
  },
  {
    id: "8",
    rank: 8,
    name: "MobileMasters",
    score: 650,
    commits: 30,
    contributors: 2,
    challenges: ["Application React Native", "Application PWA"],
  },
  {
    id: "9",
    rank: 9,
    name: "CloudCoders",
    score: 620,
    commits: 28,
    contributors: 3,
    challenges: ["Microservices", "API RESTful"],
  },
  {
    id: "10",
    rank: 10,
    name: "AIArtisans",
    score: 590,
    commits: 26,
    contributors: 2,
    challenges: ["Chatbot avec NLP", "Système de recommandation ML"],
  },
]

const MOCK_CHALLENGES = [
  { name: "API RESTful", value: 8 },
  { name: "Application React Native", value: 6 },
  { name: "Dashboard Analytics", value: 7 },
  { name: "Système de recommandation ML", value: 5 },
  { name: "Chatbot avec NLP", value: 4 },
]

const MOCK_RECENT_ACTIVITY = [
  {
    id: "1",
    team: "ByteBusters",
    action: "commit",
    message: "Fix authentication bug in API",
    time: "Il y a 5 minutes",
  },
  {
    id: "2",
    team: "CodeCrafters",
    action: "submission",
    challenge: "Application React Native",
    time: "Il y a 15 minutes",
  },
  {
    id: "3",
    team: "DevDynamos",
    action: "commit",
    message: "Add data visualization components",
    time: "Il y a 22 minutes",
  },
  {
    id: "4",
    team: "TechTitans",
    action: "commit",
    message: "Implement offline mode",
    time: "Il y a 35 minutes",
  },
  {
    id: "5",
    team: "PixelPioneers",
    action: "submission",
    challenge: "Jeu HTML5",
    time: "Il y a 45 minutes",
  },
]

// Date fictive pour la fin du hackathon
const HACKATHON_END_DATE = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000) // 3 jours à partir de maintenant

// Couleurs pour les graphiques
const COLORS = ["#d7b369", "#d89f2b", "#e6c677", "#f0d48a", "#f5e3ad", "#f9edc5"]

export default function DataShowPage() {
  const [loading, setLoading] = useState(true)
  const [teams, setTeams] = useState<typeof MOCK_TEAMS>([])
  const [recentActivity, setRecentActivity] = useState<typeof MOCK_RECENT_ACTIVITY>([])
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [activeTab, setActiveTab] = useState("classement")
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())
  const [isMounted, setIsMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    setIsMounted(true)

    // Simuler le chargement des données
    const timer = setTimeout(() => {
      setTeams(MOCK_TEAMS)
      setRecentActivity(MOCK_RECENT_ACTIVITY)
      setLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  // Rotation automatique des onglets pour le mode présentation
  useEffect(() => {
    if (isFullscreen) {
      const interval = setInterval(() => {
        setActiveTab(prev => {
          if (prev === "classement") return "activite"
          if (prev === "activite") return "defis"
          return "classement"
        })
      }, 10000) // Changer toutes les 10 secondes

      return () => clearInterval(interval)
    }
  }, [isFullscreen])

  // Actualisation automatique des données
  useEffect(() => {
    const interval = setInterval(() => {
      // Dans une application réelle, vous feriez un appel API ici
      setLastUpdated(new Date())
    }, 60000) // Actualiser toutes les minutes

    return () => clearInterval(interval)
  }, [])

  // Surveillance des changements de taille d'écran en fullscreen
  useEffect(() => {
    if (isFullscreen) {
      const handleResize = () => {
        const vh = window.innerHeight;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
      };

      handleResize();
      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
        document.documentElement.style.removeProperty('--vh');
      };
    }
  }, [isFullscreen]);

  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.error(`Erreur lors du passage en plein écran: ${err.message}`)
      })
      setIsFullscreen(true)
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen()
        setIsFullscreen(false)
      }
    }
  }

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light')
  }

  const isDarkMode = isMounted && (theme === 'dark' || (!theme && window?.matchMedia('(prefers-color-scheme: dark)').matches))

  // Données pour le graphique des scores
  const scoreChartData = teams.slice(0, 10).map(team => ({
    name: team.name,
    score: team.score,
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
      <div className={`mx-auto px-2 sm:px-4 py-4 ${isFullscreen ? 'h-[var(--vh,100vh)] overflow-auto' : ''} ${isFullscreen && isDarkMode ? 'bg-black text-white' : ''}`}>
        <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
          <div>
            <h1 className={`text-2xl sm:text-3xl md:text-4xl font-bold ${isFullscreen && isDarkMode ? 'text-white' : 'text-[#222222] dark:text-white'}`}>
              Hackathon IMSET 2025
            </h1>
            <p className={`mt-1 text-sm ${isFullscreen && isDarkMode ? 'text-gray-300' : 'text-[#8b8b8bde] dark:text-gray-300'}`}>
              Tableau de bord en temps réel
            </p>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <div className={`hidden sm:block text-center ${isFullscreen && isDarkMode ? 'text-white' : 'dark:text-white'}`}>
              <p className={`text-xs sm:text-sm ${isFullscreen && isDarkMode ? 'text-gray-300' : 'text-[#8b8b8bde] dark:text-gray-300'} mb-1`}>
                Fin dans:
              </p>
              <CountdownTimer targetDate={HACKATHON_END_DATE} />
            </div>

            <Button
              variant="outline"
              size="icon"
              onClick={toggleTheme}
              className={isFullscreen && isDarkMode ? 'border-white text-white hover:bg-gray-800' : 'dark:border-gray-700 dark:text-white dark:hover:bg-gray-800'}
            >
              {isDarkMode ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
              <span className="sr-only">Changer de thème</span>
            </Button>

            <Button
              variant="outline"
              size="icon"
              onClick={handleToggleFullscreen}
              className={isFullscreen && isDarkMode ? 'border-white text-white hover:bg-gray-800' : 'dark:border-gray-700 dark:text-white dark:hover:bg-gray-800'}
            >
              <Maximize className="h-4 w-4" />
              <span className="sr-only">Plein écran</span>
            </Button>
          </div>
        </div>

        {/* Statistiques globales */}
        <div className="grid grid-cols-2 gap-2 sm:gap-4 mb-4 sm:mb-6">
          <Card className={isFullscreen && isDarkMode ? 'bg-gray-900 border-gray-700' : 'dark:bg-gray-900 dark:border-gray-700'}>
            <CardContent className="p-3 sm:p-4 flex items-center justify-between">
              <div>
                <p className={`text-xs sm:text-sm ${isFullscreen && isDarkMode ? 'text-gray-400' : 'text-[#8b8b8bde] dark:text-gray-400'}`}>Équipes</p>
                <p className={`text-xl sm:text-2xl md:text-3xl font-bold ${isFullscreen && isDarkMode ? 'text-white' : 'text-[#555555] dark:text-white'}`}>
                  {teams.length}
                </p>
              </div>
              <Users className={`h-6 w-6 sm:h-8 sm:w-8 md:h-10 md:w-10 ${isFullscreen && isDarkMode ? 'text-[#d7b369]' : 'text-[#d7b369]/20 dark:text-[#d7b369]'}`} />
            </CardContent>
          </Card>

          <Card className={isFullscreen && isDarkMode ? 'bg-gray-900 border-gray-700' : 'dark:bg-gray-900 dark:border-gray-700'}>
            <CardContent className="p-3 sm:p-4 flex items-center justify-between">
              <div>
                <p className={`text-xs sm:text-sm ${isFullscreen && isDarkMode ? 'text-gray-400' : 'text-[#8b8b8bde] dark:text-gray-400'}`}>Commits</p>
                <p className={`text-xl sm:text-2xl md:text-3xl font-bold ${isFullscreen && isDarkMode ? 'text-white' : 'text-[#555555] dark:text-white'}`}>
                  {teams.reduce((sum, team) => sum + team.commits, 0)}
                </p>
              </div>
              <GitCommit className={`h-6 w-6 sm:h-8 sm:w-8 md:h-10 md:w-10 ${isFullscreen && isDarkMode ? 'text-[#d7b369]' : 'text-[#d7b369]/20 dark:text-[#d7b369]'}`} />
            </CardContent>
          </Card>

          <Card className={isFullscreen && isDarkMode ? 'bg-gray-900 border-gray-700' : 'dark:bg-gray-900 dark:border-gray-700'}>
            <CardContent className="p-3 sm:p-4 flex items-center justify-between">
              <div>
                <p className={`text-xs sm:text-sm ${isFullscreen && isDarkMode ? 'text-gray-400' : 'text-[#8b8b8bde] dark:text-gray-400'}`}>Défis</p>
                <p className={`text-xl sm:text-2xl md:text-3xl font-bold ${isFullscreen && isDarkMode ? 'text-white' : 'text-[#555555] dark:text-white'}`}>
                  {MOCK_CHALLENGES.length}
                </p>
              </div>
              <Code className={`h-6 w-6 sm:h-8 sm:w-8 md:h-10 md:w-10 ${isFullscreen && isDarkMode ? 'text-[#d7b369]' : 'text-[#d7b369]/20 dark:text-[#d7b369]'}`} />
            </CardContent>
          </Card>

          <Card className={isFullscreen && isDarkMode ? 'bg-gray-900 border-gray-700' : 'dark:bg-gray-900 dark:border-gray-700'}>
            <CardContent className="p-3 sm:p-4 flex items-center justify-between">
              <div>
                <p className={`text-xs sm:text-sm ${isFullscreen && isDarkMode ? 'text-gray-400' : 'text-[#8b8b8bde] dark:text-gray-400'}`}>Temps</p>
                <p className={`text-xl sm:text-2xl md:text-3xl font-bold ${isFullscreen && isDarkMode ? 'text-white' : 'text-[#555555] dark:text-white'}`}>
                  {Math.ceil((HACKATHON_END_DATE.getTime() - Date.now()) / (1000 * 60 * 60 * 24))} j
                </p>
              </div>
              <Clock className={`h-6 w-6 sm:h-8 sm:w-8 md:h-10 md:w-10 ${isFullscreen && isDarkMode ? 'text-[#d7b369]' : 'text-[#d7b369]/20 dark:text-[#d7b369]'}`} />
            </CardContent>
          </Card>
        </div>

        <Tabs
          defaultValue="classement"
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-3 sm:space-y-4"
        >
          <div className="flex justify-between items-center flex-wrap gap-2">
            <TabsList className={isFullscreen && isDarkMode ? 'bg-gray-800' : 'dark:bg-gray-800'}>
              <TabsTrigger
                value="classement"
                className={isFullscreen && isDarkMode ? 'data-[state=active]:bg-gray-700 text-white text-xs sm:text-sm' : 'text-xs sm:text-sm dark:data-[state=active]:bg-gray-700 dark:text-white'}
              >
                <Award className="mr-1 h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden xs:inline">Classement</span>
                <span className="xs:hidden">Top</span>
              </TabsTrigger>
              <TabsTrigger
                value="activite"
                className={isFullscreen && isDarkMode ? 'data-[state=active]:bg-gray-700 text-white text-xs sm:text-sm' : 'text-xs sm:text-sm dark:data-[state=active]:bg-gray-700 dark:text-white'}
              >
                <GitCommit className="mr-1 h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden xs:inline">Activité</span>
                <span className="xs:hidden">Act</span>
              </TabsTrigger>
              <TabsTrigger
                value="defis"
                className={isFullscreen && isDarkMode ? 'data-[state=active]:bg-gray-700 text-white text-xs sm:text-sm' : 'text-xs sm:text-sm dark:data-[state=active]:bg-gray-700 dark:text-white'}
              >
                <Code className="mr-1 h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden xs:inline">Défis</span>
                <span className="xs:hidden">Déf</span>
              </TabsTrigger>
            </TabsList>

            <div className="flex items-center gap-2 text-xs">
              <p className={`${isFullscreen && isDarkMode ? 'text-gray-400' : 'text-[#8b8b8bde] dark:text-gray-400'}`}>
                Mis à jour: {lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
              <Button
                variant="ghost"
                size="icon"
                className={`h-6 w-6 ${isFullscreen && isDarkMode ? 'text-white hover:bg-gray-800' : 'dark:text-white dark:hover:bg-gray-800'}`}
              >
                <RefreshCw className="h-3 w-3" />
                <span className="sr-only">Actualiser</span>
              </Button>
            </div>
          </div>

          <TabsContent value="classement" className="space-y-3 sm:space-y-4 mt-0">
            <Card className={isFullscreen && isDarkMode ? 'bg-gray-900 border-gray-700' : 'dark:bg-gray-900 dark:border-gray-700'}>
              <CardHeader className={`p-3 sm:p-4 ${isFullscreen && isDarkMode ? 'border-b border-gray-800' : 'border-b dark:border-gray-800'}`}>
                <CardTitle className={`text-base sm:text-lg ${isFullscreen && isDarkMode ? 'text-white' : 'dark:text-white'}`}>Top 10 des équipes</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className={isFullscreen && isDarkMode ? 'border-b border-gray-800' : 'border-b dark:border-gray-800'}>
                        <th className={`text-left p-2 sm:p-3 font-medium ${isFullscreen && isDarkMode ? 'text-gray-400' : 'text-[#8b8b8bde] dark:text-gray-400'}`}>#</th>
                        <th className={`text-left p-2 sm:p-3 font-medium ${isFullscreen && isDarkMode ? 'text-gray-400' : 'text-[#8b8b8bde] dark:text-gray-400'}`}>Équipe</th>
                        <th className={`text-left p-2 sm:p-3 font-medium ${isFullscreen && isDarkMode ? 'text-gray-400' : 'text-[#8b8b8bde] dark:text-gray-400'}`}>Score</th>
                        <th className={`text-left p-2 sm:p-3 font-medium ${isFullscreen && isDarkMode ? 'text-gray-400' : 'text-[#8b8b8bde] dark:text-gray-400'}`}>Commits</th>
                        <th className={`text-left p-2 sm:p-3 font-medium ${isFullscreen && isDarkMode ? 'text-gray-400' : 'text-[#8b8b8bde] dark:text-gray-400'}`}>Membres</th>
                      </tr>
                    </thead>
                    <tbody>
                      {teams.slice(0, isFullscreen ? 8 : 5).map((team) => (
                        <tr
                          key={team.id}
                          className={isFullscreen && isDarkMode ? 'border-b border-gray-800 hover:bg-gray-800' : 'border-b hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-800'}
                        >
                          <td className="p-2 sm:p-3">
                            <div className={`h-6 w-6 sm:h-7 sm:w-7 rounded-full flex items-center justify-center text-xs sm:text-sm font-semibold ${team.rank <= 3
                              ? "bg-[#d7b369] text-white"
                              : isFullscreen && isDarkMode ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-[#555555] dark:bg-gray-700 dark:text-gray-300"
                              }`}>
                              {team.rank}
                            </div>
                          </td>
                          <td className={`p-2 sm:p-3 font-medium text-xs sm:text-sm ${isFullscreen && isDarkMode ? 'text-white' : 'dark:text-white'}`}>{team.name}</td>
                          <td className={`p-2 sm:p-3 font-bold text-xs sm:text-sm ${isFullscreen && isDarkMode ? 'text-[#d7b369]' : 'text-[#555555] dark:text-[#d7b369]'}`}>{team.score}</td>
                          <td className={`p-2 sm:p-3 text-xs sm:text-sm ${isFullscreen && isDarkMode ? 'text-gray-300' : 'dark:text-gray-300'}`}>{team.commits}</td>
                          <td className={`p-2 sm:p-3 text-xs sm:text-sm ${isFullscreen && isDarkMode ? 'text-gray-300' : 'dark:text-gray-300'}`}>{team.contributors}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            <div className="h-[120px] sm:h-[200px]">
              <Card className={`h-full ${isFullscreen && isDarkMode ? 'bg-gray-900 border-gray-700' : 'dark:bg-gray-900 dark:border-gray-700'}`}>
                <CardHeader className={`p-2 sm:p-3 ${isFullscreen && isDarkMode ? 'border-b border-gray-800' : 'border-b dark:border-gray-800'}`}>
                  <CardTitle className={`text-base sm:text-lg ${isFullscreen && isDarkMode ? 'text-white' : 'dark:text-white'}`}>Scores des équipes</CardTitle>
                </CardHeader>
                <CardContent className="p-2 sm:p-3 h-[calc(100%-40px)]">
                  <div className="w-full h-full relative">
                    {/* Simple bar chart simulation */}
                    <div className="absolute inset-0 flex items-end justify-around">
                      {scoreChartData.slice(0, 6).map((data, index) => (
                        <div key={index} className="flex flex-col items-center">
                          <div
                            style={{
                              height: `${(data.score / 1300) * 100}%`,
                              backgroundColor: COLORS[index % COLORS.length],
                              width: '20px',
                              maxWidth: '30px'
                            }}
                            className="rounded-t"
                          />
                          <p className={`text-xs mt-1 font-medium truncate max-w-[40px] ${isFullscreen && isDarkMode ? 'text-gray-400' : 'text-[#8b8b8bde] dark:text-gray-400'}`}>
                            {data.name.substring(0, 3)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="activite" className="space-y-3 sm:space-y-4 mt-0">
            <Card className={isFullscreen && isDarkMode ? 'bg-gray-900 border-gray-700' : 'dark:bg-gray-900 dark:border-gray-700'}>
              <CardHeader className={`p-3 sm:p-4 ${isFullscreen && isDarkMode ? 'border-b border-gray-800' : 'border-b dark:border-gray-800'}`}>
                <CardTitle className={`text-base sm:text-lg ${isFullscreen && isDarkMode ? 'text-white' : 'dark:text-white'}`}>Activité récente</CardTitle>
              </CardHeader>
              <CardContent className="p-3 sm:p-4">
                <div className="space-y-3">
                  {recentActivity.slice(0, isFullscreen ? 4 : 3).map((activity) => (
                    <div
                      key={activity.id}
                      className={`p-3 rounded-lg text-xs sm:text-sm ${isFullscreen && isDarkMode ? 'bg-gray-800' : 'bg-gray-50 dark:bg-gray-800'}`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className={`font-medium ${isFullscreen && isDarkMode ? 'text-white' : 'text-[#555555] dark:text-white'}`}>
                            {activity.team}
                          </p>
                          {activity.action === 'commit' ? (
                            <p className={isFullscreen && isDarkMode ? 'text-gray-300' : 'dark:text-gray-300'}>
                              <span className="font-medium text-[#d7b369]">Commit:</span> {activity.message}
                            </p>
                          ) : (
                            <p className={isFullscreen && isDarkMode ? 'text-gray-300' : 'dark:text-gray-300'}>
                              <span className="font-medium text-[#d7b369]">Soumission:</span> {activity.challenge}
                            </p>
                          )}
                        </div>
                        <p className={`text-xs ${isFullscreen && isDarkMode ? 'text-gray-400' : 'text-[#8b8b8bde] dark:text-gray-400'}`}>
                          {activity.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="defis" className="space-y-3 sm:space-y-4 mt-0">
            <Card className={isFullscreen && isDarkMode ? 'bg-gray-900 border-gray-700' : 'dark:bg-gray-900 dark:border-gray-700'}>
              <CardHeader className={`p-3 sm:p-4 ${isFullscreen && isDarkMode ? 'border-b border-gray-800' : 'border-b dark:border-gray-800'}`}>
                <CardTitle className={`text-base sm:text-lg ${isFullscreen && isDarkMode ? 'text-white' : 'dark:text-white'}`}>Défis populaires</CardTitle>
              </CardHeader>
              <CardContent className="p-3 sm:p-4">
                <div className="space-y-3 sm:space-y-4">
                  {MOCK_CHALLENGES.slice(0, isFullscreen ? 5 : 3).map((challenge, index) => (
                    <div key={index} className="space-y-1">
                      <div className="flex justify-between items-center">
                        <p className={`font-medium text-xs sm:text-sm ${isFullscreen && isDarkMode ? 'text-white' : 'text-[#555555] dark:text-white'}`}>
                          {challenge.name}
                        </p>
                        <p className={`text-xs ${isFullscreen && isDarkMode ? 'text-gray-400' : 'text-[#8b8b8bde] dark:text-gray-400'}`}>
                          {challenge.value} éq.
                        </p>
                      </div>
                      <div className={`w-full h-1.5 rounded-full ${isFullscreen && isDarkMode ? 'bg-gray-800' : 'bg-gray-100 dark:bg-gray-800'}`}>
                        <div
                          className="h-full rounded-full bg-[#d7b369]"
                          style={{ width: `${(challenge.value / 10) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {isFullscreen && (
              <Card className={isFullscreen && isDarkMode ? 'bg-gray-900 border-gray-700' : 'dark:bg-gray-900 dark:border-gray-700'}>
                <CardHeader className={`p-3 sm:p-4 ${isFullscreen && isDarkMode ? 'border-b border-gray-800' : 'border-b dark:border-gray-800'}`}>
                  <CardTitle className={`text-base sm:text-lg ${isFullscreen && isDarkMode ? 'text-white' : 'dark:text-white'}`}>Technologies populaires</CardTitle>
                </CardHeader>
                <CardContent className="p-3 sm:p-4">
                  <div className={`p-2 sm:p-3 grid grid-cols-3 gap-2 rounded-lg ${isFullscreen && isDarkMode ? 'bg-gray-800' : 'bg-gray-50 dark:bg-gray-800'}`}>
                    {["React", "Next.js", "TypeScript", "Node.js", "Python", "TensorFlow"].map((tech, index) => (
                      <div
                        key={index}
                        className={`p-2 rounded-lg border text-xs sm:text-sm text-center ${isFullscreen && isDarkMode ? 'border-gray-700 bg-gray-900' : 'border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900'}`}
                      >
                        <p className={`font-medium ${isFullscreen && isDarkMode ? 'text-white' : 'text-[#555555] dark:text-white'}`}>
                          {tech}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>

        <div className={`mt-4 sm:mt-6 text-center text-xs ${isFullscreen && isDarkMode ? 'text-gray-500' : 'text-[#8b8b8bde] dark:text-gray-500'}`}>
          <p>© 2025 Hackathon IMSET - Tous droits réservés</p>
        </div>
      </div>
    </AuthenticatedLayout>
  )
}
