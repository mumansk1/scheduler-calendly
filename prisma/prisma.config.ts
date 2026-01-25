// prisma/prisma.config.ts
interface PrismaConfig {
  adapter: {
    provider: string;
    url?: string;
  };
}

const config: PrismaConfig = {
  adapter: {
    provider: 'postgres',
    url: process.env.DATABASE_URL,
  },
};

export default config;