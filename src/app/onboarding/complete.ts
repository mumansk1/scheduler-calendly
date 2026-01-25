// app/api/onboarding/complete.ts
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/db';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export default async function handler(req: any, res: any) {
  const session = await getServerSession(req, res, authOptions);
  if (!session?.user?.id) return res.status(401).json({ error: 'Not authenticated' });

  await prisma.user.update({
    where: { id: session.user.id },
    data: { onboardingCompleted: true },
  });

  res.status(200).json({ ok: true });
}