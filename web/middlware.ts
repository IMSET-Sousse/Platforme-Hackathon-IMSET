import { withAuth } from "next-auth/middleware"

export default withAuth({
  pages: {
    signIn: "/auth/github",
  },
})

export const config = {
  matcher: ["/dashboard/:path*", "/submissions/:path*", "/team/:path*"],
}