import {AsyncLocalStorage} from 'node:async_hooks';
// Only a server-side request authorized by Stakku can receive Better Auth's reset token.
export const ownerResetContext=new AsyncLocalStorage<{email:string;token?:string}>();
export async function captureOwnerResetToken({user,token}:{user:{email:string};token:string}){
 const context=ownerResetContext.getStore();
 if(context&&context.email===user.email.toLowerCase())context.token=token;
}
