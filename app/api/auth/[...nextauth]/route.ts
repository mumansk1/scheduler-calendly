// app/api/auth/[...nextauth]/route.ts
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import type { Session } from 'next-auth';

export const authOptions = {
  secret: process.env.NEXTAUTH_SECRET, // Add this line
  providers: [
    // 1. Credentials Provider (Email + Password)
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // This is where you'll eventually check your database.
        // For now, we'll allow any login to test the UI.
        if (credentials?.email && credentials?.password) {
          return { 
            id: '1', 
            name: 'Demo User', 
            email: credentials.email 
          };
        }
        return null;
      }
    }),
    
    // 2. Google Provider (Optional)
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/auth/signin',
    signUp: '/auth/signup',
  },
  callbacks: {
    async session({ session, token } : { session: Session, token: any }) {
      if (session.user) {
        // @ts-ignore
        session.user.id = token.sub;
      }
      return session;
    }
  }
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
