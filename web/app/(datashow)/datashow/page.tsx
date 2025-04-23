"use client"

import CountdownTimer from "@/components/countdown-timer"
import AuthenticatedLayout from "@/components/layout/authenticated-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Award, Clock, Code, GitCommit, Maximize, RefreshCw, Users } from "lucide-react"
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
  
  useEffect(() => {
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
      <div className={`container mx-auto px-4 py-8 ${isFullscreen ? 'bg-black text-white' : ''}`}>
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className={`text-4xl font-bold ${isFullscreen ? 'text-white' : 'text-[#222222]'}`}>
              Hackathon IMSET 2025
            </h1>
            <p className={`mt-2 ${isFullscreen ? 'text-gray-300' : 'text-[#8b8b8bde]'}`}>
              Tableau de bord en temps réel
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className={`text-center ${isFullscreen ? 'text-white' : ''}`}>
              <p className={`text-sm ${isFullscreen ? 'text-gray-300' : 'text-[#8b8b8bde]'} mb-1`}>
                Fin du hackathon dans:
              </p>
              <CountdownTimer targetDate={HACKATHON_END_DATE} />
            </div>
            
            <Button 
              variant="outline" 
              size="icon"
              onClick={handleToggleFullscreen}
              className={isFullscreen ? 'border-white text-white hover:bg-gray-800' : ''}
            >
              <Maximize className="h-5 w-5" />
              <span className="sr-only">Plein écran</span>
            </Button>
          </div>
        </div>

        {/* Statistiques globales */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className={isFullscreen ? 'bg-gray-900 border-gray-700' : ''}>
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className={`text-sm ${isFullscreen ? 'text-gray-400' : 'text-[#8b8b8bde]'}`}>Équipes</p>
                <p className={`text-3xl font-bold ${isFullscreen ? 'text-white' : 'text-[#555555]'}`}>
                  {teams.length}
                </p>
              </div>
              <Users className={`h-10 w-10 ${isFullscreen ? 'text-[#d7b369]' : 'text-[#d7b369]/20'}`} />
            </CardContent>
          </Card>
          
          <Card className={isFullscreen ? 'bg-gray-900 border-gray-700' : ''}>
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className={`text-sm ${isFullscreen ? 'text-gray-400' : 'text-[#8b8b8bde]'}`}>Commits</p>
                <p className={`text-3xl font-bold ${isFullscreen ? 'text-white' : 'text-[#555555]'}`}>
                  {teams.reduce((sum, team) => sum + team.commits, 0)}
                </p>
              </div>
              <GitCommit className={`h-10 w-10 ${isFullscreen ? 'text-[#d7b369]' : 'text-[#d7b369]/20'}`} />
            </CardContent>
          </Card>
          
          <Card className={isFullscreen ? 'bg-gray-900 border-gray-700' : ''}>
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className={`text-sm ${isFullscreen ? 'text-gray-400' : 'text-[#8b8b8bde]'}`}>Défis</p>
                <p className={`text-3xl font-bold ${isFullscreen ? 'text-white' : 'text-[#555555]'}`}>
                  {MOCK_CHALLENGES.length}
                </p>
              </div>
              <Code className={`h-10 w-10 ${isFullscreen ? 'text-[#d7b369]' : 'text-[#d7b369]/20'}`} />
            </CardContent>
          </Card>
          
          <Card className={isFullscreen ? 'bg-gray-900 border-gray-700' : ''}>
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className={`text-sm ${isFullscreen ? 'text-gray-400' : 'text-[#8b8b8bde]'}`}>Temps restant</p>
                <p className={`text-3xl font-bold ${isFullscreen ? 'text-white' : 'text-[#555555]'}`}>
                  {Math.ceil((HACKATHON_END_DATE.getTime() - Date.now()) / (1000 * 60 * 60 * 24))} jours
                </p>
              </div>
              <Clock className={`h-10 w-10 ${isFullscreen ? 'text-[#d7b369]' : 'text-[#d7b369]/20'}`} />
            </CardContent>
          </Card>
        </div>

        <Tabs 
          defaultValue="classement" 
          value={activeTab} 
          onValueChange={setActiveTab}
          className="space-y-4"
        >
          <div className="flex justify-between items-center">
            <TabsList className={isFullscreen ? 'bg-gray-800' : ''}>
              <TabsTrigger 
                value="classement" 
                className={isFullscreen ? 'data-[state=active]:bg-gray-700 text-white' : ''}
              >
                <Award className="mr-2 h-4 w-4" />
                Classement
              </TabsTrigger>
              <TabsTrigger 
                value="activite" 
                className={isFullscreen ? 'data-[state=active]:bg-gray-700 text-white' : ''}
              >
                <GitCommit className="mr-2 h-4 w-4" />
                Activité récente
              </TabsTrigger>
              <TabsTrigger 
                value="defis" 
                className={isFullscreen ? 'data-[state=active]:bg-gray-700 text-white' : ''}
              >
                <Code className="mr-2 h-4 w-4" />
                Défis populaires
              </TabsTrigger>
            </TabsList>
            
            <div className="flex items-center gap-2">
              <p className={`text-sm ${isFullscreen ? 'text-gray-400' : 'text-[#8b8b8bde]'}`}>
                Dernière mise à jour: {lastUpdated.toLocaleTimeString()}
              </p>
              <Button 
                variant="ghost" 
                size="icon"
                className={isFullscreen ? 'text-white hover:bg-gray-800' : ''}
              >
                <RefreshCw className="h-4 w-4" />
                <span className="sr-only">Actualiser</span>
              </Button>
            </div>
          </div>

          <TabsContent value="classement" className="space-y-4">
            <Card className={isFullscreen ? 'bg-gray-900 border-gray-700' : ''}>
              <CardHeader className={isFullscreen ? 'border-b border-gray-800' : 'border-b'}>
                <CardTitle className={isFullscreen ? 'text-white' : ''}>Top 10 des équipes</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className={isFullscreen ? 'border-b border-gray-800' : 'border-b'}>
                        <th className={`text-left p-4 font-medium ${isFullscreen ? 'text-gray-400' : 'text-[#8b8b8bde]'}`}>Rang</th>
                        <th className={`text-left p-4 font-medium ${isFullscreen ? 'text-gray-400' : 'text-[#8b8b8bde]'}`}>Équipe</th>
                        <th className={`text-left p-4 font-medium ${isFullscreen ? 'text-gray-400' : 'text-[#8b8b8bde]'}`}>Score</th>
                        <th className={`text-left p-4 font-medium ${isFullscreen ? 'text-gray-400' : 'text-[#8b8b8bde]'}`}>Commits</th>
                        <th className={`text-left p-4 font-medium ${isFullscreen ? 'text-gray-400' : 'text-[#8b8b8bde]'}`}>Contributeurs</th>
                      </tr>
                    </thead>
                    <tbody>
                      {teams.slice(0, 10).map((team) => (
                        <tr 
                          key={team.id} 
                          className={isFullscreen ? 'border-b border-gray-800 hover:bg-gray-800' : 'border-b hover:bg-gray-50'}
                        >
                          <td className="p-4">
                            <div className={`h-8 w-8 rounded-full flex items-center justify-center font-semibold ${
                              team.rank <= 3 
                                ? "bg-[#d7b369] text-white" 
                                : isFullscreen ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-[#555555]"
                            }`}>
                              {team.rank}
                            </div>
                          </td>
                          <td className={`p-4 font-medium ${isFullscreen ? 'text-white' : ''}`}>{team.name}</td>
                          <td className={`p-4 font-bold ${isFullscreen ? 'text-[#d7b369]' : 'text-[#555555]'}`}>{team.score}</td>
                          <td className={`p-4 ${isFullscreen ? 'text-gray-300' : ''}`}>{team.commits}</td>
                          <td className={`p-4 ${isFullscreen ? 'text-gray-300' : ''}`}>{team.contributors}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
            
            <div className="h-[400px]">
              <Card className={`h-full ${isFullscreen ? 'bg-gray-900 border-gray-700' : ''}`}>
                <CardHeader className={isFullscreen ? 'border-b border-gray-800' : 'border-b'}>
                  <CardTitle className={isFullscreen ? 'text-white' : ''}>Scores des équipes</CardTitle>
                </CardHeader>
                <CardContent className="p-4 h-[calc(100%-70px)]">
                  {/* Placeholder for chart - in a real application, use a chart library */}
                  <div className={`w-full h-full flex items-center justify-center ${isFullscreen ? 'text-gray-400' : 'text-[#8b8b8bde]'}`}>
                    <div className="w-full h-full relative">
                      {/* Simple bar chart simulation */}
                      <div className="absolute inset-0 flex items-end justify-around">
                        {scoreChartData.map((data, index) => (
                          <div key={index} className="flex flex-col items-center">
                            <div 
                              style={{ 
                                height: `${(data.score / 1300) * 100}%`,
                                backgroundColor: COLORS[index % COLORS.length],
                                width: '30px'
                              }}
                              className="rounded-t"
                            />
                            <p className={`text-xs mt-2 font-medium ${isFullscreen ? 'text-gray-400' : 'text-[#8b8b8bde]'}`}>
                              {data.name.substring(0, 3)}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="activite" className="space-y-4">
            <Card className={isFullscreen ? 'bg-gray-900 border-gray-700' : ''}>
              <CardHeader className={isFullscreen ? 'border-b border-gray-800' : 'border-b'}>
                <CardTitle className={isFullscreen ? 'text-white' : ''}>Activité récente</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity) => (
                    <div 
                      key={activity.id} 
                      className={`p-4 rounded-lg ${isFullscreen ? 'bg-gray-800' : 'bg-gray-50'}`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className={`font-medium ${isFullscreen ? 'text-white' : 'text-[#555555]'}`}>
                            {activity.team}
                          </p>
                          {activity.action === 'commit' ? (
                            <p className={isFullscreen ? 'text-gray-300' : ''}>
                              <span className="font-medium text-[#d7b369]">Commit:</span> {activity.message}
                            </p>
                          ) : (
                            <p className={isFullscreen ? 'text-gray-300' : ''}>
                              <span className="font-medium text-[#d7b369]">Soumission:</span> {activity.challenge}
                            </p>
                          )}
                        </div>
                        <p className={`text-sm ${isFullscreen ? 'text-gray-400' : 'text-[#8b8b8bde]'}`}>
                          {activity.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="defis" className="space-y-4">
            <Card className={isFullscreen ? 'bg-gray-900 border-gray-700' : ''}>
              <CardHeader className={isFullscreen ? 'border-b border-gray-800' : 'border-b'}>
                <CardTitle className={isFullscreen ? 'text-white' : ''}>Défis populaires</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6 py-2">
                  {MOCK_CHALLENGES.map((challenge, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <p className={`font-medium ${isFullscreen ? 'text-white' : 'text-[#555555]'}`}>
                          {challenge.name}
                        </p>
                        <p className={`text-sm ${isFullscreen ? 'text-gray-400' : 'text-[#8b8b8bde]'}`}>
                          {challenge.value} équipes
                        </p>
                      </div>
                      <div className={`w-full h-2 rounded-full ${isFullscreen ? 'bg-gray-800' : 'bg-gray-100'}`}>
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
            
            <Card className={isFullscreen ? 'bg-gray-900 border-gray-700' : ''}>
              <CardHeader className={isFullscreen ? 'border-b border-gray-800' : 'border-b'}>
                <CardTitle className={isFullscreen ? 'text-white' : ''}>Technologies populaires</CardTitle>
              </CardHeader>
              <CardContent>
                <div className={`p-4 grid grid-cols-2 gap-4 rounded-lg ${isFullscreen ? 'bg-gray-800' : 'bg-gray-50'}`}>
                  {["React", "TypeScript", "Node.js", "Next.js", "TensorFlow", "Python"].map((tech, index) => (
                    <div 
                      key={index} 
                      className={`p-3 rounded-lg border ${isFullscreen ? 'border-gray-700 bg-gray-900' : 'border-gray-200 bg-white'}`}
                    >
                      <p className={`font-medium ${isFullscreen ? 'text-white' : 'text-[#555555]'}`}>
                        {tech}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        <div className={`mt-6 text-center ${isFullscreen ? 'text-gray-500' : 'text-[#8b8b8bde]'}`}>
          <p className="text-sm">© 2025 Hackathon IMSET - Tous droits réservés</p>
        </div>
      </div>
    </AuthenticatedLayout>
  )
}
