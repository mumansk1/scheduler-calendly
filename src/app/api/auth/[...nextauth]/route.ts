// src/app/api/auth/[...nextauth]/route.ts
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import NextAuth, { AuthOptions } from 'next-auth';
import type { Session } from 'next-auth';
import { Prisma } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/db';

export const authOptions: AuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    // Credentials provider: sign-in OR sign-up (creates user if not found)
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) return null;

        const email = credentials.email.toLowerCase().trim();
        const plainPassword = credentials.password;

        try {
          // Find user by email (use findFirst to avoid relying on Prisma unique mapping)
          const existing = await prisma.user.findFirst({
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

          if (existing) {
            // If the account exists but has no password (OAuth-only), disallow credentials sign-in.
            // This preserves separation between OAuth sign-in and credentials sign-in.
            if (!existing.password) {
              // Return null -> NextAuth will respond 401 for credentials callback.
              console.log('Auth failed: User exists but has no password (OAuth user)');
              return null;
            }

            // Verify password
            const isValid = await bcrypt.compare(plainPassword, existing.password);
            if (!isValid) {
              console.log('Auth failed: Invalid password for', email);
              return null;
            }

            // Successful sign-in
            return {
              id: existing.id,
              name: existing.name ?? null,
              email: existing.email,
              role: existing.role ?? null,
              onboardingCompleted: existing.onboardingCompleted ?? false,
            } as any;
          }

          // User doesn't exist -> create new credentials user (signup)
          const saltRounds = 12;
          const hash = await bcrypt.hash(plainPassword, saltRounds);

          try {
            const created = await prisma.user.create({
              data: {
                email,
                password: hash,
                name: email.split('@')[0],
                role: 'client',
                onboardingCompleted: false,
              },
              select: {
                id: true,
                name: true,
                email: true,
                role: true,
                onboardingCompleted: true,
              },
            });

            console.log('Created credentials user:', created.id);
            return {
              id: created.id,
              name: created.name ?? null,
              email: created.email,
              role: created.role ?? null,
              onboardingCompleted: created.onboardingCompleted ?? false,
            } as any;
          } catch (createErr: any) {
            // Handle unique constraint race where another process created the user
            if (
              createErr instanceof Prisma.PrismaClientKnownRequestError &&
              createErr.code === 'P2002'
            ) {
              console.log('Race condition: user created concurrently, retrying lookup for', email);
              const raced = await prisma.user.findFirst({
                where: { email },
                select: { id: true, password: true, name: true, role: true, onboardingCompleted: true },
              });
              if (!raced || !raced.password) return null;
              const ok = await bcrypt.compare(plainPassword, raced.password);
              if (!ok) return null;
              return {
                id: raced.id,
                name: raced.name ?? null,
                email,
                role: raced.role ?? null,
                onboardingCompleted: raced.onboardingCompleted ?? false,
              } as any;
            }

            console.error('Error creating user in authorize():', createErr);
            return null;
          }
        } catch (err) {
          console.error('Credentials authorize error:', err);
          return null;
        }
      },
    }),

    // Google OAuth provider
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
    // After successful sign-in (credentials or provider)
    async signIn({ user, account }: any) {
      try {
        // For Google/OAuth: ensure a User row exists and set isNewUser flag
        if (account?.provider === 'google') {
          const email = (user?.email || '').toLowerCase().trim();
          if (!email) return true; // no email on profile; allow sign-in but no DB logic

          const existing = await prisma.user.findFirst({
            where: { email },
            select: { id: true, onboardingCompleted: true },
          });

          if (!existing) {
            // Create OAuth user (password null)
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
              (user as any).isNewUser = true;
            } catch (err) {
              console.error('Failed to create user row in signIn callback:', err);
              // Block sign-in so user doesn't get redirected incorrectly
              return false;
            }
          } else {
            (user as any).id = existing.id;
            (user as any).isNewUser = !existing.onboardingCompleted;
          }
        } else {
          // Credentials provider: authorize already returned onboardingCompleted
          (user as any).isNewUser = !(user as any).onboardingCompleted;
        }
      } catch (err) {
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