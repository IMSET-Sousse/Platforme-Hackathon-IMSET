import { authOptions } from "@/lib/auth"
import NextAuth from "next-auth"

// This is the correct way to export handlers for Next.js App Router
const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }

