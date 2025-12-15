import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

const handler = NextAuth({
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        console.log("🔐 Received credentials:", credentials);

        // Validate credentials
        if (!credentials?.email || !credentials?.password) {
          console.error("❌ Missing email or password.");
          return null;
        }

        const apiUrl = `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/auth/login`;
        console.log("🌐 Sending login request to:", apiUrl);

        try {
          const res = await fetch(apiUrl, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              // Note: X-CSRF-TOKEN likely not needed for server-to-server
            },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          });

          console.log("📡 Login response status:", res.status);

          let data;
          try {
            data = await res.json();
          } catch (jsonError) {
            console.error("❌ Failed to parse JSON from response:", jsonError);
            return null;
          }

          console.log("📦 Response data:", data);

          if (res.ok && data?.success) {
            return {
              id: data.data.user.id, // or any unique field like user ID
              name: `${data.data.user.firstName} ${data.data.user.lastName}`,
              email: data.data.user.email,
              accessToken: data.data.accessToken,
            };
          } else {
            console.warn("⚠️ Login failed with message:", data?.message || "Unknown error");
            return null;
          }
        } catch (error) {
          console.error("❌ Login request failed:", error);
          return null;
        }
      },
    }),
  ],

  session: {
    strategy: "jwt",
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        console.log("🔑 JWT callback - user:", user);
        token.accessToken = user.accessToken;
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
      }
      return token;
    },

    async session({ session, token }) {
      session.user.id = token.id;
      session.user.accessToken = token.accessToken;
      session.user.email = token.email;
      session.user.name = token.name;
      console.log("📦 Session callback - session:", session);
      return session;
    },
  },
  debug: true, // 🔍 Enable NextAuth debug logs
});

export { handler as GET, handler as POST };
