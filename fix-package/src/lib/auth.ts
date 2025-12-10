import { NextAuthOptions } from 'next-auth';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import CredentialsProvider from 'next-auth/providers/credentials';
import DiscordProvider from 'next-auth/providers/discord';
import bcrypt from 'bcryptjs';
import prisma from './db';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email?: string | null;
      name?: string | null;
      image?: string | null;
      role: 'CREATOR' | 'ADMIN' | 'SUPER_ADMIN';
      status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'SUSPENDED';
      creatorId?: string;
    };
  }
  
  interface User {
    role: 'CREATOR' | 'ADMIN' | 'SUPER_ADMIN';
    status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'SUSPENDED';
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    role: 'CREATOR' | 'ADMIN' | 'SUPER_ADMIN';
    status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'SUSPENDED';
    creatorId?: string;
  }
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    // Discord OAuth for creators
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID!,
      clientSecret: process.env.DISCORD_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: 'identify email guilds',
        },
      },
    }),
    
    // Credentials for admin login
    CredentialsProvider({
      name: 'Admin Login',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email and password required');
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
          include: { admin: true },
        });

        if (!user || !user.password) {
          throw new Error('Invalid credentials');
        }

        // Only allow admin users to login with credentials
        if (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN') {
          throw new Error('Admin access required');
        }

        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) {
          throw new Error('Invalid credentials');
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          role: user.role,
          status: user.status,
        };
      },
    }),
  ],
  
  callbacks: {
    async signIn({ user, account, profile }) {
      // For Discord OAuth, create or update creator profile
      if (account?.provider === 'discord') {
        const discordProfile = profile as {
          id: string;
          username: string;
          avatar: string;
        };
        
        try {
          // Check if user exists
          const existingUser = await prisma.user.findFirst({
            where: {
              OR: [
                { email: user.email },
                { accounts: { some: { providerAccountId: discordProfile.id } } },
              ],
            },
            include: { creator: true },
          });

          if (existingUser) {
            // Update Discord info on creator
            if (existingUser.creator) {
              await prisma.creator.update({
                where: { id: existingUser.creator.id },
                data: {
                  discordUserId: discordProfile.id,
                  discordUsername: discordProfile.username,
                  discordAvatar: discordProfile.avatar
                    ? `https://cdn.discordapp.com/avatars/${discordProfile.id}/${discordProfile.avatar}.png`
                    : null,
                },
              });
            }
          } else {
            // New user - they'll be created by the adapter
            // We'll create the creator profile in the session callback
          }
        } catch (error) {
          console.error('Error in signIn callback:', error);
        }
      }
      
      return true;
    },
    
    async jwt({ token, user, account, trigger }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.status = user.status;
      }
      
      // Fetch creator ID if exists
      if (token.id && !token.creatorId) {
        const creator = await prisma.creator.findUnique({
          where: { userId: token.id },
          select: { id: true },
        });
        if (creator) {
          token.creatorId = creator.id;
        }
      }
      
      // Refresh user data on session update
      if (trigger === 'update' && token.id) {
        const freshUser = await prisma.user.findUnique({
          where: { id: token.id },
          select: { role: true, status: true },
        });
        if (freshUser) {
          token.role = freshUser.role;
          token.status = freshUser.status;
        }
      }
      
      return token;
    },
    
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.status = token.status;
        session.user.creatorId = token.creatorId;
      }
      return session;
    },
  },
  
  events: {
    async createUser({ user }) {
      // Create creator profile for new users (from Discord OAuth)
      if (user.id) {
        const existingCreator = await prisma.creator.findUnique({
          where: { userId: user.id },
        });
        
        if (!existingCreator) {
          await prisma.creator.create({
            data: {
              userId: user.id,
            },
          });
        }
      }
    },
  },
  
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
    newUser: '/dashboard',
  },
  
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  
  secret: process.env.NEXTAUTH_SECRET,
  
  debug: process.env.NODE_ENV === 'development',
};

export default authOptions;
