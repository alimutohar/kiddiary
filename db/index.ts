import {createClient} from '@libsql/client'
import {drizzle} from 'drizzle-orm/libsql'
import * as schema from './schema/auth'
if(process.env.NODE_ENV==='production'&&!process.env.TURSO_DATABASE_URL)throw Error('TURSO_DATABASE_URL is required')
export const client=createClient({url:process.env.TURSO_DATABASE_URL||'file:local.db',authToken:process.env.TURSO_AUTH_TOKEN||undefined})
export const db=drizzle(client,{schema})
