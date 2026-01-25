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
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email.toLowerCase() },
        });

        if (!user || !user.password) {
          return null;
        }

        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) {
          return null;
        }

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
    // Runs after a successful sign-in
    async signIn({ user, account }: any) {
      try {
        if (account?.provider === 'google') {
          const email = user?.email;
          if (!email) return true; // let NextAuth handle if no email

          // Try to find existing user by email
          const existing = await prisma.user.findUnique({
            where: { email: email.toLowerCase() },
          });

          if (!existing) {
            // Create minimal user row. DO NOT include fields that don't exist in your schema.
            const created = await prisma.user.create({
              data: {
                email: email.toLowerCase(),
                name: user?.name ?? '',
                role: 'user', // adjust default role if needed
                // if you DO have onboardingCompleted or similar, add it here
              },
            });

            // Attach id & new-user flag to user object for jwt callback
            (user as any).id = created.id;
            (user as any).isNewUser = true;
          } else {
            (user as any).id = existing.id;
            (user as any).isNewUser = false;
          }
        } else {
          // Credentials provider already returns existing user from authorize()
          (user as any).isNewUser = false;
        }
      } catch (err) {
        // Log but don't block sign-in — client will run profile check and handle onboarding
        console.error('signIn callback error (non-fatal):', err);
      }
      return true;
    },

    // Copy isNewUser and user id into the token
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
        // @ts-ignore
        session.user.id = token.sub;
        (session.user as any).isNewUser = Boolean(token.isNewUser);
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };