"use client"

import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { Github } from "lucide-react"
import { signIn } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"

export default function GitHubAuthPage() {
  const router = useRouter()
  const [status, setStatus] = useState<"loading" | "error" | "success">("loading")
  const [errorMessage, setErrorMessage] = useState("")
  const searchParams = useSearchParams()

  useEffect(() => {
    // Check for error in URL query parameters (e.g., ?error=AccessDenied)
    const error = searchParams.get("error")
    if (error) {
      setStatus("error")
      setErrorMessage("Échec de l'authentification GitHub. Veuillez réessayer.")
      return
    }

    // Initiate GitHub authentication
    const authenticate = async () => {
      try {
        const result = await signIn("github", { redirect: false, callbackUrl: "/dashboard" })
        if (result?.error) {
          setStatus("error")
          setErrorMessage("Échec de l'authentification GitHub. Veuillez réessayer.")
        } else if (result?.ok) {
          setStatus("success")
          // Redirect to dashboard after a short delay to show success UI
          setTimeout(() => {
            router.push("/dashboard")
          }, 1500)
        }
      } catch (err) {
        setStatus("error")
        setErrorMessage("Une erreur inattendue s'est produite. Veuillez réessayer.")
      }
    }

    authenticate()
  }, [router, searchParams])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md text-center">
        <div className="mb-6">
          <Github className="h-12 w-12 mx-auto text-[#222222]" />
          <h1 className="mt-4 text-2xl font-bold text-[#222222]">Authentification GitHub</h1>
        </div>

        {status === "loading" && (
          <div className="flex flex-col items-center space-y-4">
            <LoadingSpinner size="lg" />
            <p className="text-[#8b8b8bde]">Connexion en cours avec GitHub...</p>
          </div>
        )}

        {status === "success" && (
          <div className="flex flex-col items-center space-y-4">
            <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-green-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-green-600 font-medium">Authentification réussie!</p>
            <p className="text-[#8b8b8bde]">Redirection vers le tableau de bord...</p>
          </div>
        )}

        {status === "error" && (
          <div className="flex flex-col items-center space-y-4">
            <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-[#710e20de]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <p className="text-[#710e20de] font-medium">Erreur d'authentification</p>
            <p className="text-[#8b8b8bde]">{errorMessage}</p>
            <button
              onClick={() => (window.location.href = "/")}
              className="mt-2 px-4 py-2 bg-[#d7b369] hover:bg-[#d89f2b] text-white rounded-md transition-colors"
            >
              Retour à l'accueil
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
