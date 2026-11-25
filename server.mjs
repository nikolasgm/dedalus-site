import http from 'node:http';import {readFile} from 'node:fs/promises';import {join,normalize,extname} from 'node:path';import {fileURLToPath} from 'node:url';
const root=join(fileURLToPath(new URL('.',import.meta.url)),'public');
const types={'.html':'text/html; charset=utf-8','.css':'text/css','.js':'text/javascript','.webp':'image/webp','.png':'image/png','.ico':'image/x-icon','.txt':'text/plain','.xml':'application/xml'};
const KEY=process.env.BREVO_API_KEY||'',TO=process.env.REQUEST_TO||'hello@dedalus.travel',FROM=process.env.MAIL_FROM||'noreply@dedalus.travel';
const hits=new Map();const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const clip=(s,n)=>String(s??'').replace(/[\r\n]+/g,' ').trim().slice(0,n);
const headers={'X-Content-Type-Options':'nosniff','Referrer-Policy':'strict-origin-when-cross-origin','X-Frame-Options':'DENY','Content-Security-Policy':"default-src 'self'; img-src 'self' data:; style-src 'self'; script-src 'self'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'",'Strict-Transport-Security':'max-age=31536000'};
async function handleRequest(req,res){let body='';for await(const c of req){body+=c;if(body.length>8000){res.writeHead(413,headers).end();return}}
 const ip=(req.headers['x-forwarded-for']||req.socket.remoteAddress||'').split(',')[0].trim(),now=Date.now(),list=(hits.get(ip)||[]).filter(t=>now-t<3600e3);
 if(list.length>=5){res.writeHead(429,headers).end();return}list.push(now);hits.set(ip,list);
 let d;try{d=JSON.parse(body)}catch{res.writeHead(400,headers).end();return}
 if(d.website){res.writeHead(200,headers).end('{}');return}
 const name=clip(d.name,120),company=clip(d.company,160),email=clip(d.email,160),role=d.role==='Travel partner'?'Travel partner':'Charter operator',message=clip(d.message,500);
 if(!name||!company||!/^[^@\s<>]+@[^@\s<>]+\.[^@\s<>]+$/.test(email)){res.writeHead(400,headers).end();return}
 if(!KEY){res.writeHead(503,headers).end();return}
 const html=`<p><b>${esc(role)}</b> request</p><p>Name: ${esc(name)}<br>Company: ${esc(company)}<br>Email: ${esc(email)}<br>Note: ${esc(message)||'-'}</p>`;
 try{const r=await fetch('https://api.brevo.com/v3/smtp/email',{method:'POST',headers:{'api-key':KEY,'Content-Type':'application/json',Accept:'application/json'},signal:AbortSignal.timeout(8000),
  body:JSON.stringify({sender:{email:FROM,name:'DEDALUS website'},replyTo:{email,name},to:[{email:TO}],subject:`DEDALUS request: ${role}, ${company}`,htmlContent:html,textContent:`${role}\n${name}\n${company}\n${email}\n${message}`})});
  await r.body?.cancel();res.writeHead(r.ok?200:502,headers).end('{}')}catch{res.writeHead(502,headers).end()}}
http.createServer(async(req,res)=>{try{
 const url=new URL(req.url,'http://x');let p=decodeURIComponent(url.pathname);
 if((req.headers.host||'').toLowerCase().split(':')[0]==='www.dedalus.travel'){res.writeHead(301,{...headers,Location:'https://dedalus.travel'+url.pathname+url.search}).end();return}
 if(p==='/health'){res.writeHead(200,headers).end('ok');return}
 if(p==='/api/request'&&req.method==='POST')return handleRequest(req,res);
 if(req.method!=='GET'&&req.method!=='HEAD'){res.writeHead(405,headers).end();return}
 if(p.endsWith('/'))p+='index.html';const f=normalize(join(root,p));if(!f.startsWith(root)){res.writeHead(403,headers).end();return}
 let data;try{data=await readFile(f)}catch{try{data=await readFile(join(f,'index.html'));}catch{res.writeHead(404,{...headers,'Content-Type':'text/plain'}).end('Not found');return}}
 const ext=extname(f)||'.html';res.writeHead(200,{...headers,'Content-Type':types[ext]||'application/octet-stream','Cache-Control':ext==='.html'?'no-cache':'public, max-age=86400'});res.end(req.method==='HEAD'?undefined:data)
}catch{res.writeHead(500,headers).end()}}).listen(Number(process.env.PORT)||3000,()=>console.log("listening"));
