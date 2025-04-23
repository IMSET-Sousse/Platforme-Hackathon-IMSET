"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, FileText, CheckCircle, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { useToast } from "@/hooks/use-toast"
import AuthenticatedLayout from "@/components/layout/authenticated-layout"
import type { Challenge } from "@/components/ui/challenge-card"

// Données fictives pour la démo
const MOCK_CHALLENGES: (Challenge & {
  fullDescription: string
  requirements: string[]
  resources: { title: string; url: string }[]
})[] = [
  {
    id: "1",
    title: "API RESTful avec Express",
    description:
      "Créer une API RESTful complète avec Express.js, incluant l'authentification JWT et la validation des données.",
    fullDescription:
      "Développez une API RESTful robuste et sécurisée en utilisant Express.js. Cette API devra gérer l'authentification des utilisateurs via JWT, implémenter une validation des données entrantes, et fournir une documentation complète via Swagger. L'API devra également inclure des tests unitaires et d'intégration pour assurer sa fiabilité.",
    difficulty: "medium",
    category: "Backend",
    isSelected: true,
    requirements: [
      "Implémentation de routes CRUD pour au moins 3 ressources",
      "Authentification JWT avec gestion des rôles",
      "Validation des données entrantes",
      "Documentation Swagger/OpenAPI",
      "Tests unitaires et d'intégration (couverture > 80%)",
      "Gestion des erreurs et logging",
    ],
    resources: [
      { title: "Documentation Express.js", url: "https://expressjs.com/" },
      { title: "Guide JWT", url: "https://jwt.io/introduction/" },
      { title: "Tutoriel Swagger", url: "https://swagger.io/docs/specification/basic-structure/" },
    ],
  },
  {
    id: "2",
    title: "Application React Native",
    description:
      "Développer une application mobile cross-platform avec React Native qui consomme une API et gère l'état avec Redux.",
    fullDescription:
      "Créez une application mobile cross-platform en utilisant React Native. L'application devra consommer une API externe, gérer l'état global avec Redux, et offrir une expérience utilisateur fluide et intuitive. L'application devra également être capable de fonctionner en mode hors ligne en mettant en cache les données nécessaires.",
    difficulty: "hard",
    category: "Mobile",
    isSelected: true,
    requirements: [
      "Interface utilisateur responsive et intuitive",
      "Gestion d'état avec Redux ou Redux Toolkit",
      "Consommation d'API REST avec gestion des erreurs",
      "Navigation entre écrans avec React Navigation",
      "Mode hors ligne avec mise en cache des données",
      "Tests unitaires et d'intégration",
    ],
    resources: [
      { title: "Documentation React Native", url: "https://reactnative.dev/docs/getting-started" },
      { title: "Guide Redux", url: "https://redux.js.org/introduction/getting-started" },
      { title: "React Navigation", url: "https://reactnavigation.org/docs/getting-started" },
    ],
  },
  {
    id: "3",
    title: "Dashboard Analytics",
    description:
      "Créer un tableau de bord d'analyse de données avec des graphiques interactifs et des filtres avancés.",
    fullDescription:
      "Développez un tableau de bord d'analyse de données complet avec des visualisations interactives. Le dashboard devra permettre aux utilisateurs d'explorer des données complexes à travers des graphiques personnalisables, des filtres avancés, et des fonctionnalités d'exportation. L'interface devra être intuitive et performante, même avec de grands volumes de données.",
    difficulty: "medium",
    category: "Frontend",
    isSelected: false,
    requirements: [
      "Au moins 5 types de visualisations différentes (graphiques, tableaux, cartes, etc.)",
      "Filtres avancés et recherche en temps réel",
      "Exportation des données et des visualisations",
      "Interface responsive adaptée aux mobiles et tablettes",
      "Optimisation des performances pour de grands volumes de données",
      "Thème clair/sombre et personnalisation de l'interface",
    ],
    resources: [
      { title: "Documentation D3.js", url: "https://d3js.org/" },
      { title: "Guide Recharts", url: "https://recharts.org/en-US/" },
      {
        title: "Tutoriel sur les tableaux de bord",
        url: "https://www.smashingmagazine.com/2020/03/dashboard-design-principles/",
      },
    ],
  },
]

export default function ChallengeDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [challenge, setChallenge] = useState<
    | (Challenge & {
        fullDescription: string
        requirements: string[]
        resources: { title: string; url: string }[]
      })
    | null
  >(null)

  useEffect(() => {
    // Simuler le chargement des données
    const timer = setTimeout(() => {
      const foundChallenge = MOCK_CHALLENGES.find((c) => c.id === params.id)
      setChallenge(foundChallenge || null)
      setLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [params.id])

  const handleToggleSelection = () => {
    if (!challenge) return

    // Dans une application réelle, vous enverriez cette demande à votre API
    setChallenge({
      ...challenge,
      isSelected: !challenge.isSelected,
    })

    if (challenge.isSelected) {
      toast({
        title: "Défi désélectionné",
        description: `Le défi "${challenge.title}" a été retiré de votre sélection.`,
        variant: "success",
      })
    } else {
      toast({
        title: "Défi sélectionné",
        description: `Le défi "${challenge.title}" a été ajouté à votre sélection.`,
        variant: "success",
      })
    }
  }

  if (loading) {
    return (
      <AuthenticatedLayout>
        <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
          <LoadingSpinner size="lg" />
        </div>
      </AuthenticatedLayout>
    )
  }

  if (!challenge) {
    return (
      <AuthenticatedLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100 text-center">
            <XCircle className="h-12 w-12 mx-auto text-[#710e20de] mb-3" />
            <h3 className="text-lg font-medium text-[#222222]">Défi non trouvé</h3>
            <p className="text-[#8b8b8bde] mt-2">Le défi que vous recherchez n'existe pas ou a été supprimé.</p>
            <Link href="/challenges">
              <Button className="mt-4 bg-[#d7b369] hover:bg-[#d89f2b]">Retour aux défis</Button>
            </Link>
          </div>
        </div>
      </AuthenticatedLayout>
    )
  }

  const difficultyColors = {
    easy: "bg-green-100 text-green-800",
    medium: "bg-yellow-100 text-yellow-800",
    hard: "bg-red-100 text-red-800",
  }

  return (
    <AuthenticatedLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button variant="ghost" className="mb-4" onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour aux défis
          </Button>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-3xl font-bold text-[#222222]">{challenge.title}</h1>
                <Badge className={difficultyColors[challenge.difficulty]}>
                  {challenge.difficulty.charAt(0).toUpperCase() + challenge.difficulty.slice(1)}
                </Badge>
                <Badge variant="outline">{challenge.category}</Badge>
              </div>
              <p className="text-[#8b8b8bde] mt-2">{challenge.description}</p>
            </div>

            <Button
              className={
                challenge.isSelected ? "bg-[#710e20de] hover:bg-[#710e20de]/90" : "bg-[#d7b369] hover:bg-[#d89f2b]"
              }
              onClick={handleToggleSelection}
            >
              {challenge.isSelected ? (
                <>
                  <XCircle className="mr-2 h-4 w-4" />
                  Désélectionner
                </>
              ) : (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Sélectionner
                </>
              )}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Description complète */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold text-[#222222] mb-4">Description</h2>
                <p className="text-[#222222] whitespace-pre-line">{challenge.fullDescription}</p>
              </CardContent>
            </Card>

            {/* Exigences */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold text-[#222222] mb-4">Exigences et contraintes</h2>
                <ul className="space-y-2">
                  {challenge.requirements.map((req, index) => (
                    <li key={index} className="flex items-start">
                      <span className="inline-block h-5 w-5 rounded-full bg-[#d7b369]/20 text-[#d7b369] flex items-center justify-center mr-2 mt-0.5 text-xs font-bold">
                        {index + 1}
                      </span>
                      <span className="text-[#222222]">{req}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            {/* Ressources */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold text-[#222222] mb-4">Ressources recommandées</h2>
                <div className="space-y-3">
                  {challenge.resources.map((resource, index) => (
                    <a
                      key={index}
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center p-3 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors"
                    >
                      <FileText className="h-4 w-4 text-[#d7b369] mr-2" />
                      <span className="text-[#222222]">{resource.title}</span>
                    </a>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Statut */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold text-[#222222] mb-4">Statut</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[#8b8b8bde]">Sélectionné</span>
                    <span className={`font-medium ${challenge.isSelected ? "text-green-600" : "text-[#710e20de]"}`}>
                      {challenge.isSelected ? "Oui" : "Non"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#8b8b8bde]">Soumission</span>
                    <span className="font-medium text-yellow-600">En attente</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#8b8b8bde]">Équipes participantes</span>
                    <span className="font-medium text-[#555555]">12</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  )
}
