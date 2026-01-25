// app/api/auth/[...nextauth]/route.ts
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
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) return null;

        const email = credentials.email.toLowerCase().trim();

        // Use findFirst in case email is not marked UNIQUE in Prisma introspected schema
        const user = await prisma.user.findFirst({
          where: { email },
          select: {
            id: true,
            name: true,
            email: true,
            password: true,
            role: true,
            onboardingCompleted: true,
          },
        });

        if (!user || !user.password) return null;

        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) return null;

        return {
          id: user.id,
          name: user.name ?? null,
          email: user.email,
          role: user.role ?? null,
          onboardingCompleted: user.onboardingCompleted ?? false,
        } as any;
      },
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
    // Runs after a successful sign-in (both credentials and providers)
    async signIn({ user, account }: any) {
      try {
        // Google / OAuth provider: ensure a User row exists and set isNewUser flag
        if (account?.provider === 'google') {
          const email = (user?.email || '').toLowerCase().trim();
          if (!email) {
            // No email in OAuth profile (rare) — allow sign-in but don't attempt DB logic
            return true;
          }

          // Try to find existing user and include onboardingCompleted
          const existing = await prisma.user.findFirst({
            where: { email },
            select: { id: true, onboardingCompleted: true },
          });

          if (!existing) {
            // Create minimal user row (password null for OAuth users)
            try {
              const created = await prisma.user.create({
                data: {
                  email,
                  name: user?.name ?? null,
                  image: user?.image ?? null,
                  role: 'client',
                  password: null,
                  onboardingCompleted: false,
                },
                select: { id: true, onboardingCompleted: true },
              });

              (user as any).id = created.id;
              (user as any).isNewUser = true; // newly created -> needs onboarding
            } catch (err) {
              console.error('Failed to create user row in signIn callback:', err);
              // block sign-in so user doesn't get redirected to availability while DB create failed
              return false;
            }
          } else {
            (user as any).id = existing.id;
            (user as any).isNewUser = !existing.onboardingCompleted; // true if onboarding incomplete
          }
        } else {
          // Credentials provider: authorize returned onboardingCompleted already
          // Mark isNewUser based on onboardingCompleted value
          (user as any).isNewUser = !(user as any).onboardingCompleted;
        }
      } catch (err) {
        // Log and block sign-in on unexpected errors so we don't incorrectly allow redirect
        console.error('signIn callback error:', err);
        return false;
      }
      return true;
    },

    // Persist id and isNewUser into the token
    async jwt({ token, user }: any) {
      if (user) {
        if ((user as any).id) token.sub = (user as any).id;
        if ((user as any).isNewUser !== undefined) token.isNewUser = (user as any).isNewUser;
      }
      return token;
    },

    // Expose id and isNewUser on the client session
    async session({ session, token }: { session: Session; token: any }) {
      if (session.user) {
        // @ts-ignore - augmenting session.user
        session.user.id = token.sub;
        (session.user as any).isNewUser = Boolean(token.isNewUser);
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };