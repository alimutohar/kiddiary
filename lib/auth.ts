import {betterAuth} from 'better-auth'
import {drizzleAdapter} from 'better-auth/adapters/drizzle'
import {nextCookies} from 'better-auth/next-js'
import {db} from '@/db'
import * as schema from '@/db/schema/auth'
if(process.env.NODE_ENV==='production'&&!process.env.BETTER_AUTH_SECRET)throw Error('BETTER_AUTH_SECRET is required')
export const auth=betterAuth({database:drizzleAdapter(db,{provider:'sqlite',schema}),emailAndPassword:{enabled:true,minPasswordLength:8},secret:process.env.BETTER_AUTH_SECRET||'local-development-secret-change-before-deploy',baseURL:process.env.BETTER_AUTH_URL||'http://localhost:3000',plugins:[nextCookies()]})
