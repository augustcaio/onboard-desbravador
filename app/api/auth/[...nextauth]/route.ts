import { NextAuthOptions } from "next-auth";
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import { Role } from "@/types/auth";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60,
  },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "google" && profile?.email) {
        const existingMembro = await prisma.membro.findUnique({
          where: { googleEmail: profile.email },
        });

        if (!existingMembro) {
          return true;
        }
      }
      return true;
    },
    async jwt({ token, user, account, profile }) {
      if (account?.provider === "google" && profile?.email) {
        let membro = await prisma.membro.findUnique({
          where: { googleEmail: profile.email },
        });

        // Se não existe, criar automaticamente como DESBRAVADOR
        if (!membro) {
          // Buscar primeira unidade como padrão
          const defaultUnidade = await prisma.unidade.findFirst({
            orderBy: { nome: "asc" },
          });

          if (defaultUnidade) {
            membro = await prisma.membro.create({
              data: {
                nome: profile.name || profile.email,
                googleEmail: profile.email,
                role: "DESBRAVADOR",
                unidadeId: defaultUnidade.id,
              },
            });
          }
        }

        if (membro) {
          token.id = membro.id;
          token.role = membro.role as Role;
        } else {
          token.id = user?.id || "";
          token.role = "DESBRAVADOR";
        }
      } else if (user) {
        token.id = user.id;
        token.role = (user as { role: Role }).role || "DESBRAVADOR";
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as Role;
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
