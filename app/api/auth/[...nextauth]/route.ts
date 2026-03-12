import { NextAuthOptions } from "next-auth";
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import { Role, getCargoRole, Cargo } from "@/types/cargo";

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
          // Primeiro, verificar se o usuário já existe via NextAuth adapter
          let existingUser = await prisma.user.findUnique({
            where: { email: profile.email },
            include: { membro: true },
          });

          console.log("User encontrado:", existingUser ? "sim" : "não");

          // Se não existe, criar usuário e membro
          if (!existingUser) {
            // Buscar unidade Quetzal como padrão
            let defaultUnidade = await prisma.unidade.findUnique({
              where: { nome: "Quetzal" },
            });

            if (!defaultUnidade) {
              defaultUnidade = await prisma.unidade.findFirst();
            }

            console.log("Unidade padrão:", defaultUnidade?.nome);

            if (defaultUnidade) {
              // Criar usuário primeiro
              const newUser = await prisma.user.create({
                data: {
                  name: profile.name || profile.email,
                  email: profile.email,
                  image: (profile as { picture?: string }).picture || null,
                },
              });

              // Depois criar o membro vinculado ao usuário
              const defaultCargo: Cargo = "DESBRAVADOR";
              const newMembro = await prisma.membro.create({
                data: {
                  nome: profile.name || profile.email,
                  googleEmail: profile.email,
                  cargo: defaultCargo,
                  role: getCargoRole(defaultCargo),
                  unidadeId: defaultUnidade.id,
                  userId: newUser.id,
                },
              });

              console.log("User criado com ID:", newUser.id);
              console.log("Membro criado com ID:", newMembro.id);

              token.id = newMembro.id;
              token.role = newMembro.role as Role;
              token.image = (profile as { picture?: string }).picture;
              return token;
            }
          }

          // Se o usuário existe, buscar membro vinculado
          if (existingUser?.membro) {
            token.id = existingUser.membro.id;
            // Use getCargoRole to ensure the role is correct based on cargo
            token.role = getCargoRole(existingUser.membro.cargo as Cargo);
            token.image = existingUser.image;
          } else if (existingUser) {
            // Usuário existe mas não tem membro, criar membro
            let defaultUnidade = await prisma.unidade.findUnique({
              where: { nome: "Quetzal" },
            }) || await prisma.unidade.findFirst();

            if (defaultUnidade) {
              const defaultCargo: Cargo = "DESBRAVADOR";
              const newMembro = await prisma.membro.create({
                data: {
                  nome: existingUser.name || existingUser.email || "Membro",
                  googleEmail: profile.email,
                  cargo: defaultCargo,
                  role: getCargoRole(defaultCargo),
                  unidadeId: defaultUnidade.id,
                  userId: existingUser.id,
                },
              });
              token.id = newMembro.id;
              token.role = newMembro.role as Role;
              token.image = existingUser.image;
            }
          }
        } catch (error) {
          console.error("Erro ao criar/buscar membro:", error);
          token.id = user?.id || "";
          token.role = "MEMBRO";
        }
      } else if (user) {
        token.id = user.id;
        token.role = (user as { role: Role }).role || "MEMBRO";
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as Role;
        session.user.image = token.image as string | null;
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
