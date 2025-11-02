import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  
  session: {
    strategy: "jwt",
  },

  callbacks: {
    // Triggered after successful Google login
    async signIn({ user }) {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/provider`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: user.name,
            email: user.email,
            image: user.image,
          }),
        });

        const data = await res.json();

        if (!res.ok) {
          console.error("Provider auth failed:", data);
          return false;
        }

        // Attach backend JWT + role to user object
        user.backendToken = data.token;
        user.role = data.user?.role || "viewer";

        return true;
      } catch (err) {
        console.error("Error syncing with backend:", err);
        return false;
      }
    },

    async redirect({ url, baseUrl }) {
      // redirect to home after login
      return baseUrl;
    },

    // Add backend token + role to session
    async jwt({ token, user }) {
      if (user) {
        token.backendToken = user.backendToken;
        token.role = user.role;
      }
      return token;
    },

    // Expose them in session for client-side access
    async session({ session, token }) {
      session.user.backendToken = token.backendToken;
      session.user.role = token.role;
      return session;
    },
  },

  pages: {
    signIn: "/login",
  },

  secret: process.env.NEXTAUTH_SECRET,
  // For security & URL base
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
