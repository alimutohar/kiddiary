import {NextRequest,NextResponse} from 'next/server';
import {client} from '@/db';import {auth} from '@/lib/auth';import {assertInstallation} from '@/lib/installation';import {ownerResetContext} from '@/lib/recovery-channel';import {normalizeDomain} from '@/stakku-guard';
export const runtime='nodejs';
export async function POST(request:NextRequest){
 if(request.headers.get('origin')!==request.nextUrl.origin)return NextResponse.json({error:'Origin tidak valid'},{status:403});
 if(Number(request.headers.get('content-length')||0)>4096)return NextResponse.json({error:'Input terlalu besar'},{status:413});
 try{
  const raw=await request.text();if(raw.length>4096)throw Error('Input terlalu besar');const input=JSON.parse(raw);
  if(typeof input.code!=='string'||!/^[A-Za-z0-9_-]{43}$/.test(input.code)||typeof input.password!=='string'||input.password.length<12||input.password.length>128)return NextResponse.json({error:'Isi kode pemulihan dan password baru 12–128 karakter.'},{status:400});
  const domain=normalizeDomain(request.nextUrl.hostname);await assertInstallation(domain);
  const row=(await client.execute("SELECT license_key FROM installation_license WHERE id='license'")).rows[0];const key=process.env.STAKKU_LICENSE_KEY||String(row?.license_key||'');
  // Fixed portal origin: neither a form field nor a URL can redirect the grant/license elsewhere.
  const result=await fetch('https://app.stakku.id/api/owner-recovery/consume',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({code:input.code,license_key:key,domain}),cache:'no-store',redirect:'error',signal:AbortSignal.timeout(8000)});
  if(!result.ok)return NextResponse.json({error:'Kode tidak valid, kedaluwarsa, sudah dipakai, atau domain tidak sesuai. Buat kode baru di portal.'},{status:401});
  const grant=await result.json();if(typeof grant.owner_email!=='string')throw Error('Invalid portal response');
  const email=grant.owner_email.toLowerCase();
  const account=(await client.execute({sql:'SELECT id FROM user WHERE lower(email)=?',args:[email]})).rows[0];
  if(!account)return NextResponse.json({error:'Akun aplikasi dengan email pemilik lisensi belum ada. Daftar memakai email pembelian; kode ini sudah digunakan.'},{status:409});
  const context:{email:string;token?:string}={email};
  await ownerResetContext.run(context,async()=>{
   await auth.api.requestPasswordReset({body:{email}});
   if(!context.token)throw Error('Reset token unavailable');
   await auth.api.resetPassword({body:{token:context.token,newPassword:input.password}});
  });
  return NextResponse.json({success:true},{headers:{'Cache-Control':'no-store'}});
 }catch{return NextResponse.json({error:'Pemulihan belum selesai. Periksa koneksi lalu buat kode baru dari portal; password tidak dikirim ke Stakku.'},{status:503})}
}
