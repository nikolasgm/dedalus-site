const f=document.getElementById('f'),msg=document.getElementById('msg');
document.querySelectorAll('[data-role]').forEach(a=>a.addEventListener('click',()=>{const r=[...f.role].find(x=>x.value===(a.dataset.role==='operator'?'Charter operator':'Travel partner'));if(r)r.checked=true}));
f.addEventListener('submit',async e=>{e.preventDefault();msg.textContent='';
 const d=Object.fromEntries(new FormData(f));
 if(!d.name.trim()||!d.company.trim()||!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(d.email)){msg.textContent='Please enter your name, company and a valid email.';return}
 const b=f.querySelector('button');b.disabled=true;
 try{const r=await fetch('/api/request',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(d)});
  if(r.ok){f.reset();msg.textContent='Thank you. We will be in touch shortly.'}else msg.textContent='Sending failed. Please email hello@dedalus.travel.'}
 catch{msg.textContent='Sending failed. Please email hello@dedalus.travel.'}
 b.disabled=false});

(()=>{const B={athens:['Athens, Alimos','Saronic Gulf',['Alimos','Aegina','Poros','Hydra','Spetses'],[[30,110],[110,70],[170,95],[250,45],[330,80]]],
split:['Split','Dalmatian coast',['Split','Hvar','Vis','Korčula','Brač'],[[40,40],[110,85],[60,125],[200,100],[300,60]]],
lefkada:['Lefkada','Ionian islands',['Lefkas','Meganisi','Ithaca','Kefalonia','Paxos'],[[250,25],[290,60],[220,90],[170,125],[330,20]]],
naples:['Naples','Amalfi coast',['Naples','Procida','Ischia','Capri','Amalfi'],[[50,50],[100,30],[150,60],[230,100],[330,70]]]};
const $=i=>document.getElementById(i),ns='http://www.w3.org/2000/svg';if(!$('d-map'))return;
const el=(t,a)=>{const e=document.createElementNS(ns,t);for(const k in a)e.setAttribute(k,a[k]);return e};
function draw(){const b=B[$('d-base').value],p=Math.max(500,Math.min(60000,+$('d-price').value||0)),m=$('d-map');
$('d-tag').textContent='7 nights · '+b[1];$('d-title').textContent=$('d-type').value+' from '+b[0];
m.replaceChildren(el('polyline',{points:b[3].map(q=>q.join(',')).join(' '),fill:'none',stroke:'#0e7c86','stroke-width':3,'stroke-dasharray':'2 7','stroke-linecap':'round'}));
b[3].forEach((q,i)=>{m.append(el('circle',{cx:q[0],cy:q[1],r:i?6:9,fill:i?'#fff':'#ff5a5f',stroke:'#0e7c86','stroke-width':3}))});
$('d-stops').replaceChildren(...b[2].map(s=>{const l=document.createElement('li');l.textContent=s;return l}));
$('d-total').textContent='€'+p.toLocaleString('en-US');$('d-inc').textContent=($('d-sk').checked?'Skipper included · ':'Skipper extra · ')+'sample preview';}
['d-type','d-base','d-price','d-sk'].forEach(i=>$(i).addEventListener('input',draw));draw()})();
document.getElementById('demo-f')?.addEventListener('submit',e=>e.preventDefault());
