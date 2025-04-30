import { withAuth } from "next-auth/middleware"

// Apply auth middleware to routes that require authentication
export default withAuth({
    pages: {
        signIn: "/auth/signin",
    },
})

// Configure what routes middleware should run on
export const config = {
    matcher: [
        "/dashboard/:path*",
        "/submissions/:path*",
        "/team/:path*",
        "/profile/:path*",
        "/challenges/:path*",
        "/leaderboard/:path*",
        "/datashow/:path*"
    ],
} 