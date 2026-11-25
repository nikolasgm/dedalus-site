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
