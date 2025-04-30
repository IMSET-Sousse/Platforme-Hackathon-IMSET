"use client"

import type React from "react"

import AuthenticatedLayout from "@/components/layout/authenticated-layout"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { CheckCircle, Edit, Github, LogOut, Search, Trash, UserMinus, UserPlus, Users, X } from "lucide-react"
import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"

// Type for GitHub user search results
type GitHubUser = {
  id: number;
  login: string;
  avatar_url: string;
  html_url: string;
}

// Type for team member
type TeamMember = {
  id: string;
  name: string;
  role: string;
  avatar: string;
  isCurrentUser: boolean;
}

// Type for team data
type TeamData = {
  id: string;
  name: string;
  description: string;
  repository: string;
  inviteCode: string;
  isLeader: boolean;
  members: TeamMember[];
}

export default function TeamPage() {
  const { toast } = useToast()
  const { data: session, status } = useSession()
  const [isLoading, setIsLoading] = useState(true)

  // Default empty team
  const emptyTeam: TeamData = {
    id: "",
    name: "",
    description: "",
    repository: "",
    inviteCode: "",
    isLeader: true,
    members: [],
  }

  const [team, setTeam] = useState<TeamData | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    repository: "",
  })
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [createFormData, setCreateFormData] = useState({
    name: "",
    description: "",
    repository: "",
  })
  const [showInviteSearch, setShowInviteSearch] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [searchResults, setSearchResults] = useState<GitHubUser[]>([])
  const [isSearching, setIsSearching] = useState(false)

  // Load user data when session is available
  useEffect(() => {
    if (status === "loading") return

    if (session?.user) {
      // In a real app, you would fetch team data from your API here
      // For now, we'll create a mock team with the authenticated user as leader

      // Mock team with current user as leader
      const mockTeam: TeamData = {
        id: "team-1",
        name: "CodeCrafters",
        description: "Une équipe passionnée par le développement web et mobile, spécialisée dans les technologies JavaScript modernes.",
        repository: "https://github.com/codecrafters/hackathon-project",
        inviteCode: "CODECRAFTERS-2025",
        isLeader: true,
        members: [
          {
            id: "user-1",
            name: session.user.name || "Utilisateur",
            role: "Leader",
            avatar: session.user.image || "/placeholder.svg?height=40&width=40",
            isCurrentUser: true,
          }
        ],
      }

      setTeam(mockTeam)
      setFormData({
        name: mockTeam.name,
        description: mockTeam.description,
        repository: mockTeam.repository,
      })
    }

    setIsLoading(false)
  }, [session, status])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleCreateInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setCreateFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSaveTeam = () => {
    // Dans une application réelle, vous enverriez ces données à votre API
    setTeam((prev) => prev ? { ...prev, ...formData } : null)
    setIsEditing(false)
    toast({
      title: "Équipe mise à jour",
      description: "Les informations de l'équipe ont été mises à jour avec succès.",
      variant: "success",
    })
  }

  const handleCreateTeam = () => {
    // Dans une application réelle, vous enverriez ces données à votre API
    if (!session?.user) return

    const newTeam: TeamData = {
      id: "team-" + Date.now(),
      name: createFormData.name,
      description: createFormData.description,
      repository: createFormData.repository,
      inviteCode: `${createFormData.name.toUpperCase().substring(0, 8)}-${Math.floor(Math.random() * 9000) + 1000}`,
      isLeader: true,
      members: [
        {
          id: "user-1",
          name: session.user.name || "Utilisateur",
          role: "Leader",
          avatar: session.user.image || "/placeholder.svg?height=40&width=40",
          isCurrentUser: true,
        }
      ],
    }

    setTeam(newTeam)
    setFormData({
      name: newTeam.name,
      description: newTeam.description,
      repository: newTeam.repository,
    })
    setShowCreateForm(false)
    toast({
      title: "Équipe créée",
      description: "Votre équipe a été créée avec succès.",
      variant: "success",
    })
  }

  const handleCopyInviteCode = () => {
    if (!team?.inviteCode) return

    navigator.clipboard.writeText(team.inviteCode)
    toast({
      title: "Code d'invitation copié",
      description: "Le code d'invitation a été copié dans le presse-papiers.",
      variant: "success",
    })
  }

  const handleRemoveMember = (memberId: string) => {
    // Dans une application réelle, vous enverriez cette demande à votre API
    setTeam((prev) => {
      if (!prev) return prev

      return {
        ...prev,
        members: prev.members.filter((member) => member.id !== memberId),
      }
    })
    toast({
      title: "Membre retiré",
      description: "Le membre a été retiré de l'équipe.",
      variant: "success",
    })
  }

  const handleLeaveTeam = () => {
    // Dans une application réelle, vous enverriez cette demande à votre API
    // et redirigeriez l'utilisateur
    toast({
      title: "Équipe quittée",
      description: "Vous avez quitté l'équipe avec succès.",
      variant: "success",
    })
    // Simuler l'absence d'équipe
    setTeam(null)
  }

  const searchGitHubUsers = async () => {
    if (!searchTerm.trim()) return

    setIsSearching(true)
    try {
      const response = await fetch(`https://api.github.com/search/users?q=${encodeURIComponent(searchTerm)}`)
      const data = await response.json()

      if (data.items) {
        setSearchResults(data.items.slice(0, 5))
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de rechercher des utilisateurs GitHub.",
        variant: "error",
      })
    } finally {
      setIsSearching(false)
    }
  }

  const handleInviteUser = (user: GitHubUser) => {
    // Dans une application réelle, vous enverriez cette demande à votre API
    const newMember = {
      id: `user-${user.id}`,
      name: user.login,
      role: "Membre",
      avatar: user.avatar_url,
      isCurrentUser: false,
    }

    // Vérifier si l'utilisateur existe déjà dans l'équipe
    const memberExists = team?.members.some(member => member.id === `user-${user.id}`)

    if (!memberExists && team) {
      setTeam(prev => {
        if (!prev) return prev

        return {
          ...prev,
          members: [...prev.members, newMember]
        }
      })

      toast({
        title: "Membre invité",
        description: `${user.login} a été ajouté à l'équipe.`,
        variant: "success",
      })
    } else {
      toast({
        title: "Membre déjà présent",
        description: `${user.login} est déjà membre de l'équipe.`,
        variant: "default",
      })
    }

    // Réinitialiser la recherche
    setShowInviteSearch(false)
    setSearchTerm("")
    setSearchResults([])
  }

  // Loading state
  if (isLoading) {
    return (
      <AuthenticatedLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#d7b369]"></div>
          </div>
        </div>
      </AuthenticatedLayout>
    )
  }

  return (
    <AuthenticatedLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#222222]">Gestion d'équipe</h1>
          <p className="text-[#8b8b8bde] mt-2">Créez ou gérez votre équipe pour le hackathon.</p>
        </div>

        {team && !showCreateForm ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Informations de l'équipe */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-xl text-[#222222]">Informations de l'équipe</CardTitle>
                    {team.isLeader && !isEditing && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsEditing(true)}
                        className="text-[#d7b369] border-[#d7b369] hover:bg-[#d7b369]/10"
                      >
                        <Edit className="mr-2 h-4 w-4" />
                        Modifier
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  {isEditing ? (
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-[#222222] mb-1">
                          Nom de l'équipe
                        </label>
                        <Input
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          className="w-full"
                        />
                      </div>
                      <div>
                        <label htmlFor="description" className="block text-sm font-medium text-[#222222] mb-1">
                          Description
                        </label>
                        <Textarea
                          id="description"
                          name="description"
                          value={formData.description}
                          onChange={handleInputChange}
                          className="w-full"
                          rows={3}
                        />
                      </div>
                      <div>
                        <label htmlFor="repository" className="block text-sm font-medium text-[#222222] mb-1">
                          URL du dépôt GitHub
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
                            className="rounded-l-none w-full"
                          />
                        </div>
                      </div>
                      <div className="flex justify-end space-x-3 pt-2">
                        <Button variant="outline" onClick={() => setIsEditing(false)}>
                          Annuler
                        </Button>
                        <Button className="bg-[#d7b369] hover:bg-[#d89f2b]" onClick={handleSaveTeam}>
                          Enregistrer
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-sm font-medium text-[#8b8b8bde]">Nom de l'équipe</h3>
                        <p className="text-lg font-semibold text-[#222222]">{team.name}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-[#8b8b8bde]">Description</h3>
                        <p className="text-[#222222]">{team.description}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-[#8b8b8bde]">Dépôt GitHub</h3>
                        <a
                          href={team.repository}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#d7b369] hover:text-[#d89f2b] flex items-center"
                        >
                          <Github className="h-4 w-4 mr-1" />
                          {team.repository}
                        </a>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Membres de l'équipe */}
              <Card className="mt-6">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-xl text-[#222222]">Membres de l'équipe</CardTitle>
                    {team.isLeader && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-[#d7b369] border-[#d7b369] hover:bg-[#d7b369]/10"
                        onClick={() => setShowInviteSearch(!showInviteSearch)}
                      >
                        <UserPlus className="mr-2 h-4 w-4" />
                        Inviter
                      </Button>
                    )}
                  </div>
                  <CardDescription>{team.members.length} membres dans l'équipe</CardDescription>
                </CardHeader>
                <CardContent>
                  {showInviteSearch && (
                    <div className="mb-5 space-y-4 bg-gray-50 p-4 rounded-lg border border-gray-100">
                      <p className="text-sm font-medium text-[#222222]">Rechercher un utilisateur GitHub</p>
                      <div className="flex gap-2">
                        <div className="relative flex-1">
                          <Input
                            placeholder="Entrez un nom d'utilisateur..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pr-10"
                          />
                          {searchTerm && (
                            <button
                              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                              onClick={() => setSearchTerm("")}
                            >
                              <X className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                        <Button
                          onClick={searchGitHubUsers}
                          disabled={isSearching || !searchTerm.trim()}
                          className="bg-[#d7b369] hover:bg-[#d89f2b]"
                        >
                          <Search className="h-4 w-4 mr-2" />
                          Rechercher
                        </Button>
                      </div>

                      {isSearching && <p className="text-sm text-[#8b8b8bde]">Recherche en cours...</p>}

                      {searchResults.length > 0 && (
                        <div className="space-y-2">
                          <p className="text-sm text-[#8b8b8bde]">Résultats de recherche:</p>
                          <div className="max-h-60 overflow-y-auto space-y-2">
                            {searchResults.map(user => (
                              <div key={user.id} className="flex items-center justify-between p-3 bg-white rounded-md border border-gray-100">
                                <div className="flex items-center space-x-3">
                                  <Avatar>
                                    <AvatarImage src={user.avatar_url} alt={user.login} />
                                    <AvatarFallback>{user.login.charAt(0).toUpperCase()}</AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <p className="font-medium">{user.login}</p>
                                    <a
                                      href={user.html_url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-xs text-[#d7b369] hover:text-[#d89f2b]"
                                    >
                                      Voir profil
                                    </a>
                                  </div>
                                </div>
                                <Button
                                  size="sm"
                                  className="bg-[#d7b369] hover:bg-[#d89f2b]"
                                  onClick={() => handleInviteUser(user)}
                                >
                                  <UserPlus className="h-4 w-4 mr-1" />
                                  Inviter
                                </Button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {searchTerm && searchResults.length === 0 && !isSearching && (
                        <p className="text-sm text-[#8b8b8bde]">Aucun résultat trouvé pour "{searchTerm}"</p>
                      )}
                    </div>
                  )}

                  <div className="space-y-4">
                    {team.members.map((member) => (
                      <div
                        key={member.id}
                        className="flex items-center justify-between p-3 rounded-md border border-gray-100"
                      >
                        <div className="flex items-center space-x-3">
                          <Avatar>
                            <AvatarImage src={member.avatar || "/placeholder.svg"} alt={member.name} />
                            <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">
                              {member.name}
                              {member.isCurrentUser && (
                                <span className="ml-2 text-xs bg-gray-100 px-2 py-0.5 rounded-full">Vous</span>
                              )}
                            </p>
                            <p className="text-xs text-[#8b8b8bde]">{member.role}</p>
                          </div>
                        </div>
                        {team.isLeader && !member.isCurrentUser && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveMember(member.id)}
                            className="text-[#710e20de] hover:bg-red-50"
                          >
                            <UserMinus className="h-4 w-4" />
                            <span className="sr-only">Retirer</span>
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
                {!team.isLeader && (
                  <CardFooter className="border-t pt-4">
                    <Button
                      variant="outline"
                      className="text-[#710e20de] border-[#710e20de] hover:bg-red-50 w-full"
                      onClick={handleLeaveTeam}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Quitter l'équipe
                    </Button>
                  </CardFooter>
                )}
              </Card>
            </div>

            {/* Statistiques et actions */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl text-[#222222]">Statistiques de l'équipe</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-[#8b8b8bde]">Défis sélectionnés</p>
                      <p className="text-2xl font-bold text-[#555555]">2/5</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-[#8b8b8bde]">Commits</p>
                      <p className="text-2xl font-bold text-[#555555]">65</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-[#8b8b8bde]">Classement actuel</p>
                      <p className="text-2xl font-bold text-[#555555]">
                        2<span className="text-sm font-normal">/24</span>
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {team.isLeader && (
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle className="text-xl text-[#222222]">Actions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <Button
                        variant="outline"
                        className="w-full justify-start text-[#710e20de] border-[#710e20de] hover:bg-red-50"
                      >
                        <Trash className="mr-2 h-4 w-4" />
                        Dissoudre l'équipe
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle className="text-xl text-[#222222]">
                {showCreateForm ? "Créer une nouvelle équipe" : "Vous n'avez pas encore d'équipe"}
              </CardTitle>
              <CardDescription>
                {showCreateForm
                  ? "Remplissez le formulaire ci-dessous pour créer votre équipe"
                  : "Créez une nouvelle équipe ou rejoignez une équipe existante"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {showCreateForm ? (
                <div className="space-y-4">
                  <div>
                    <label htmlFor="create-name" className="block text-sm font-medium text-[#222222] mb-1">
                      Nom de l'équipe
                    </label>
                    <Input
                      id="create-name"
                      name="name"
                      value={createFormData.name}
                      onChange={handleCreateInputChange}
                      className="w-full"
                      placeholder="Ex: CodeCrafters"
                    />
                  </div>
                  <div>
                    <label htmlFor="create-description" className="block text-sm font-medium text-[#222222] mb-1">
                      Description
                    </label>
                    <Textarea
                      id="create-description"
                      name="description"
                      value={createFormData.description}
                      onChange={handleCreateInputChange}
                      className="w-full"
                      rows={3}
                      placeholder="Décrivez votre équipe en quelques mots"
                    />
                  </div>
                  <div>
                    <label htmlFor="create-repository" className="block text-sm font-medium text-[#222222] mb-1">
                      URL du dépôt GitHub
                    </label>
                    <div className="flex">
                      <div className="bg-gray-100 flex items-center px-3 rounded-l-md border border-r-0 border-gray-300">
                        <Github className="h-4 w-4 text-gray-500" />
                      </div>
                      <Input
                        id="create-repository"
                        name="repository"
                        value={createFormData.repository}
                        onChange={handleCreateInputChange}
                        className="rounded-l-none w-full"
                        placeholder="https://github.com/votre-equipe/projet"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6">
                  <Users className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                  <p className="text-[#8b8b8bde] mb-6">
                    Participez au hackathon en créant votre propre équipe ou en rejoignant une équipe existante.
                  </p>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex flex-col sm:flex-row gap-3 border-t pt-4">
              {showCreateForm ? (
                <>
                  <Button variant="outline" className="w-full sm:w-auto" onClick={() => setShowCreateForm(false)}>
                    Annuler
                  </Button>
                  <Button className="bg-[#d7b369] hover:bg-[#d89f2b] w-full sm:w-auto" onClick={handleCreateTeam}>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Créer l'équipe
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    className="bg-[#d7b369] hover:bg-[#d89f2b] w-full sm:w-auto"
                    onClick={() => setShowCreateForm(true)}
                  >
                    <UserPlus className="mr-2 h-4 w-4" />
                    Créer une équipe
                  </Button>
                  <Button variant="outline" className="w-full sm:w-auto">
                    Rejoindre une équipe
                  </Button>
                </>
              )}
            </CardFooter>
          </Card>
        )}
      </div>
    </AuthenticatedLayout>
  )
}
