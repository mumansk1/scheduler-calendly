import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import NextAuth, { AuthOptions } from 'next-auth';
import type { Session } from 'next-auth';
import { prisma } from '@/lib/db';
import bcrypt from 'bcryptjs';

export const authOptions: AuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
  if (!credentials?.email || !credentials.password) {
    throw new Error('Email and password are required');
  }

  const user = await prisma.user.findUnique({
    where: { email: credentials.email.toLowerCase() },
  });

  if (!user) {
    // User not found
    throw new Error('No account found with this email');
  }

  if (!user.password) {
    // No password set (e.g., OAuth only)
    throw new Error('No password set for this account');
  }

  const isValid = await bcrypt.compare(credentials.password, user.password);
  if (!isValid) {
    // Password mismatch
    throw new Error('Incorrect password');
  }

  // Success: return user object
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };
}
    }),

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