import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { prisma } from './db'

export const authOptions: NextAuthOptions = {
  session: {
    strategy: 'jwt'
  },
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        try {
          const user = await prisma.user.findUnique({
            where: { email: credentials.email }
          })

          if (!user || !user.isActive) {
            return null
          }

          const isPasswordValid = await bcrypt.compare(credentials.password, user.password)

          if (!isPasswordValid) {
            return null
          }

          return {
            id: user.id,
            email: user.email,
            name: `${user.firstName} ${user.lastName}`,
            role: user.role,
            firstName: user.firstName,
            lastName: user.lastName,
            avatar: user.avatar
          }
        } catch (error) {
          console.error('Auth error:', error)
          return null
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role
        token.firstName = (user as any).firstName
        token.lastName = (user as any).lastName
        token.avatar = (user as any).avatar
      }
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.sub!
        session.user.role = token.role as string
        session.user.firstName = token.firstName as string
        session.user.lastName = token.lastName as string
        session.user.avatar = token.avatar as string
      }
      return session
    }
  },
  pages: {
    signIn: '/login'
  },
  secret: process.env.NEXTAUTH_SECRET
}

export function generateToken(userId: string, role: string) {
  return jwt.sign(
    { userId, role },
    process.env.NEXTAUTH_SECRET!,
    { expiresIn: '7d' }
  )
}

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, process.env.NEXTAUTH_SECRET!) as any
  } catch (error) {
    return null
  }
}