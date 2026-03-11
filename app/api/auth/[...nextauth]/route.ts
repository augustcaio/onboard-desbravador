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
    async jwt({ token, user, account, profile }) {
      console.log("JWT Callback - Email:", profile?.email);
      
      if (account?.provider === "google" && profile?.email) {
        try {
          let membro = await prisma.membro.findUnique({
            where: { googleEmail: profile.email },
          });

          console.log("Membro encontrado:", membro ? "sim" : "não");

          // Se não existe, criar automaticamente como DESBRAVADOR
          if (!membro) {
            // Buscar unidade Quetzal como padrão
            let defaultUnidade = await prisma.unidade.findUnique({
              where: { nome: "Quetzal" },
            });

            // Se não existir, buscar qualquer unidade
            if (!defaultUnidade) {
              defaultUnidade = await prisma.unidade.findFirst();
            }

            console.log("Unidade padrão:", defaultUnidade?.nome);

            if (defaultUnidade) {
              membro = await prisma.membro.create({
                data: {
                  nome: profile.name || profile.email,
                  googleEmail: profile.email,
                  role: "DESBRAVADOR",
                  unidadeId: defaultUnidade.id,
                },
              });
              console.log("Membro criado com ID:", membro.id);
            }
          }

          if (membro) {
            token.id = membro.id;
            token.role = membro.role as Role;
          } else {
            token.id = user?.id || "";
            token.role = "DESBRAVADOR";
          }
        } catch (error) {
          console.error("Erro ao criar/buscar membro:", error);
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
