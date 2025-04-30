import { NextAuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";

// Check if required environment variables are set
if (!process.env.GITHUB_ID || !process.env.GITHUB_SECRET) {
  throw new Error("Missing GitHub OAuth environment variables. Please set GITHUB_ID and GITHUB_SECRET.");
}

export const authOptions: NextAuthOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async redirect({ url, baseUrl }) {
      // Handle sign-out redirections to home page
      if (url === `${baseUrl}/` || url === baseUrl || url.includes('signout')) {
        return baseUrl;
      }

      // If URL starts with base URL, return the URL
      if (url.startsWith(baseUrl)) return url;

      // Otherwise redirect to dashboard
      return `${baseUrl}/dashboard`;
    },
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
    signOut: '/',
  },
}