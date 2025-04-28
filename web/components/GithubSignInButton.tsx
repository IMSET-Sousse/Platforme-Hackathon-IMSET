"use client"

import { Button } from "@/components/ui/button"
import { Github } from "lucide-react"
import { signIn } from "next-auth/react"

export default function GithubSignInButton() {
  return (
    <Button
      onClick={() => signIn("github", { callbackUrl: "/dashboard" })}
      className="bg-[#d7b369] hover:bg-[#d89f2b] text-white px-8 py-6 text-lg rounded-md flex items-center gap-2 transition-all"
      size="lg"
    >
      <Github className="h-5 w-5" />
      Se connecter avec GitHub
    </Button>
  )
}