"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Clock, Send, AlertCircle, Github, FileText, Code } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { useToast } from "@/hooks/use-toast"
import AuthenticatedLayout from "@/components/layout/authenticated-layout"
import CountdownTimer from "@/components/countdown-timer"

// Données fictives pour la démo
const MOCK_CHALLENGES = [
  {
    id: "1",
    title: "API RESTful avec Express",
    category: "Backend",
    status: "not_submitted" as const,
  },
  {
    id: "2",
    title: "Application React Native",
    category: "Mobile",
    status: "submitted" as const,
    submissionDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 jours avant
    repository: "https://github.com/codecrafters/react-native-app",
    branch: "main",
    description:
      "Notre application React Native implémente toutes les fonctionnalités demandées, avec une interface utilisateur intuitive et une gestion d'état efficace via Redux.",
  },
]

// Date fictive pour la fin des soumissions
const SUBMISSION_END_DATE = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000) // 5 jours à partir de maintenant

export default function SubmissionsPage() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [challenges, setChallenges] = useState<typeof MOCK_CHALLENGES>([])
  const [selectedChallenge, setSelectedChallenge] = useState<string>("")
  const [formData, setFormData] = useState({
    repository: "",
    branch: "main",
    description: "",
  })

  useEffect(() => {
    // Simuler le chargement des données
    const timer = setTimeout(() => {
      setChallenges(MOCK_CHALLENGES)
      setLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    if (name === "challenge") {
      setSelectedChallenge(value)

      // Pré-remplir le formulaire si le défi a déjà été soumis
      const challenge = challenges.find((c) => c.id === value)
      if (challenge && challenge.status === "submitted") {
        setFormData({
          repository: challenge.repository,
          branch: challenge.branch,
          description: challenge.description,
        })
      } else {
        // Réinitialiser le formulaire pour un nouveau défi
        setFormData({
          repository: "https://github.com/codecrafters/hackathon-project",
          branch: "main",
          description: "",
        })
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validation basique
    if (!selectedChallenge || !formData.repository || !formData.description) {
      toast({
        title: "Formulaire incomplet",
        description: "Veuillez remplir tous les champs obligatoires.",
        variant: "error",
      })
      return
    }

    // Dans une application réelle, vous enverriez ces données à votre API
    setChallenges(
      challenges.map((challenge) =>
        challenge.id === selectedChallenge
          ? {
              ...challenge,
              status: "submitted",
              submissionDate: new Date(),
              repository: formData.repository,
              branch: formData.branch,
              description: formData.description,
            }
          : challenge,
      ),
    )

    toast({
      title: "Soumission réussie",
      description: "Votre solution a été soumise avec succès.",
      variant: "success",
    })

    // Réinitialiser le formulaire
    setSelectedChallenge("")
    setFormData({
      repository: "",
      branch: "main",
      description: "",
    })
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

  return (
    <AuthenticatedLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#222222]">Soumissions</h1>
          <p className="text-[#8b8b8bde] mt-2">Soumettez vos solutions pour les défis sélectionnés par votre équipe.</p>
        </div>

        {/* Compteur à rebours */}
        <div className="bg-white p-6 rounded-lg shadow-sm mb-8 border border-gray-100">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-[#222222] flex items-center">
                <Clock className="mr-2 h-5 w-5 text-[#d7b369]" />
                Phase de soumission
              </h2>
              <p className="text-[#8b8b8bde] mt-1">
                Vous avez jusqu'à la fin de cette phase pour soumettre vos solutions.
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <p className="text-sm text-[#8b8b8bde] mb-2 text-center">Temps restant:</p>
              <CountdownTimer targetDate={SUBMISSION_END_DATE} />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Formulaire de soumission */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl text-[#222222]">Soumettre une solution</CardTitle>
                <CardDescription>
                  Remplissez le formulaire ci-dessous pour soumettre votre solution à un défi.
                </CardDescription>
              </CardHeader>
              <form onSubmit={handleSubmit}>
                <CardContent className="space-y-4">
                  <div>
                    <label htmlFor="challenge" className="block text-sm font-medium text-[#222222] mb-1">
                      Défi <span className="text-[#710e20de]">*</span>
                    </label>
                    <Select value={selectedChallenge} onValueChange={(value) => handleSelectChange("challenge", value)}>
                      <SelectTrigger id="challenge">
                        <SelectValue placeholder="Sélectionnez un défi" />
                      </SelectTrigger>
                      <SelectContent>
                        {challenges.map((challenge) => (
                          <SelectItem key={challenge.id} value={challenge.id}>
                            {challenge.title}
                            {challenge.status === "submitted" && " (Déjà soumis)"}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label htmlFor="repository" className="block text-sm font-medium text-[#222222] mb-1">
                      URL du dépôt GitHub <span className="text-[#710e20de]">*</span>
                    </label>
                    <div className="flex">
                      <div className="bg-gray-100 flex items-center px-3 rounded-l-md border border-r-0 border-gray-300">
                        <Github className="h-4 w-4 text-gray-500" />
                      </div>
                      <Input
                        id="repository"
                        name="repository"
                        value={formData.repository}
                        onChange={handleInputChange}
                        className="rounded-l-none"
                        placeholder="https://github.com/votre-equipe/projet"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="branch" className="block text-sm font-medium text-[#222222] mb-1">
                      Branche (optionnel)
                    </label>
                    <Input
                      id="branch"
                      name="branch"
                      value={formData.branch}
                      onChange={handleInputChange}
                      placeholder="main"
                    />
                    <p className="text-xs text-[#8b8b8bde] mt-1">
                      Laissez "main" si vous soumettez depuis la branche principale.
                    </p>
                  </div>

                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-[#222222] mb-1">
                      Description de la solution <span className="text-[#710e20de]">*</span>
                    </label>
                    <Textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="Décrivez brièvement votre solution et comment elle répond aux exigences du défi..."
                      rows={4}
                      maxLength={500}
                    />
                    <p className="text-xs text-[#8b8b8bde] mt-1">{formData.description.length}/500 caractères</p>
                  </div>
                </CardContent>
                <CardFooter className="border-t pt-4">
                  <Button type="submit" className="bg-[#d7b369] hover:bg-[#d89f2b]" disabled={!selectedChallenge}>
                    <Send className="mr-2 h-4 w-4" />
                    Soumettre la solution
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </div>

          {/* Statut des soumissions */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="text-xl text-[#222222]">Statut des soumissions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {challenges.map((challenge) => (
                    <div key={challenge.id} className="p-4 border rounded-md">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium text-[#222222]">{challenge.title}</h3>
                          <p className="text-xs text-[#8b8b8bde]">{challenge.category}</p>
                        </div>
                        {challenge.status === "submitted" ? (
                          <Badge className="bg-green-100 text-green-800">Soumis</Badge>
                        ) : (
                          <Badge className="bg-yellow-100 text-yellow-800">En attente</Badge>
                        )}
                      </div>

                      {challenge.status === "submitted" && (
                        <div className="mt-3 pt-3 border-t border-dashed">
                          <p className="text-xs text-[#8b8b8bde]">
                            Soumis le {challenge.submissionDate.toLocaleDateString()}
                          </p>
                          <a
                            href={challenge.repository}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-[#d7b369] hover:text-[#d89f2b] flex items-center mt-1"
                          >
                            <Github className="h-3 w-3 mr-1" />
                            {challenge.repository}
                          </a>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-xl text-[#222222]">Instructions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                      <Code className="h-3 w-3" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[#222222]">Code propre et documenté</p>
                      <p className="text-xs text-[#8b8b8bde]">
                        Assurez-vous que votre code est bien organisé et documenté.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="h-6 w-6 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                      <FileText className="h-3 w-3" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[#222222]">README complet</p>
                      <p className="text-xs text-[#8b8b8bde]">
                        Incluez un README détaillé avec les instructions d'installation et d'utilisation.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="h-6 w-6 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-600">
                      <AlertCircle className="h-3 w-3" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[#222222]">Délai final</p>
                      <p className="text-xs text-[#8b8b8bde]">
                        Aucune soumission ne sera acceptée après la date limite.
                      </p>
                    </div>
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
