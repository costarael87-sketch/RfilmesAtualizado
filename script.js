(() => {
  const STORAGE_KEY = 'rfilmes_users_v2';

  function now() { return Date.now(); }
  function addHours(ms,h){ return ms + h*3600000; }
  function addDays(ms,d){ return ms + d*86400000; }
  function toLocalString(ts){ return ts? new Date(ts).toLocaleString() : 'N/A'; }

  function loadUsers(){ try{ return JSON.parse(localStorage.getItem(STORAGE_KEY))||{} }catch{ return {}; } }
  function saveUsers(u){ localStorage.setItem(STORAGE_KEY, JSON.stringify(u)); }

  function upsertUser(username,senha,expira,status='liberado'){
    const users=loadUsers(); users[username]={senha,expira,status}; saveUsers(users);
  }
  function removeUser(u){ const users=loadUsers(); delete users[u]; saveUsers(users); }
  function setStatus(u,s){ const users=loadUsers(); if(users[u]){ users[u].status=s; saveUsers(users);} }
  function renovar30dias(u){ const users=loadUsers(); if(users[u]){ users[u].expira=addDays(now(),30); users[u].status='liberado'; saveUsers(users);} }

  // login usuário
  const loginForm=document.getElementById('login-form');
  if(loginForm){
    loginForm.addEventListener('submit',e=>{
      e.preventDefault();
      const u=document.getElementById('username').value.trim();
      const p=document.getElementById('password').value;
      const users=loadUsers(), usr=users[u];
      if(!usr){ alert('Usuário não encontrado'); return; }
      if(usr.senha!==p){ alert('Senha incorreta'); return; }
      if(usr.status==='bloqueado'){ alert('Usuário bloqueado'); return; }
      if(!usr.expira || now()>usr.expira){ alert('Acesso expirado'); return; }
      window.location.href='home.html';
    });
  }

  // login admin
  const adminForm=document.getElementById('admin-login-form');
  if(adminForm){
    adminForm.addEventListener('submit',e=>{
      e.preventDefault();
      const email=document.getElementById('admin-email').value;
      const senha=document.getElementById('admin-password').value;
      if(email==='costarael87@gmail.com' && senha==='1206israel'){ window.location.href='admin-panel.html'; }
      else alert('Credenciais inválidas');
    });
  }

  // admin painel
  const addUserForm=document.getElementById('formAddUser');
  if(addUserForm){
    addUserForm.addEventListener('submit',e=>{
      e.preventDefault();
      const u=document.getElementById('new-username').value.trim();
      const p=document.getElementById('new-password').value;
      if(!u||!p){ alert('Preencha'); return; }
      upsertUser(u,p,addDays(now(),30));
      renderUsers(); addUserForm.reset();
    });
  }

  const trialForm=document.getElementById('formTrial');
  if(trialForm){
    trialForm.addEventListener('submit',e=>{
      e.preventDefault();
      const u=document.getElementById('trial-username').value.trim();
      const p=document.getElementById('trial-password').value;
      if(!u||!p){ alert('Preencha'); return; }
      upsertUser(u,p,addHours(now(),1));
      renderUsers(); trialForm.reset();
    });
  }

  const list=document.getElementById('user-list');
  function renderUsers(){
    if(!list) return;
    const users=loadUsers(); list.innerHTML='';
    Object.keys(users).forEach(u=>{
      const usr=users[u]; const exp=toLocalString(usr.expira);
      const li=document.createElement('li'); li.className='user-item';
      li.innerHTML=`<div><b>${u}</b><br><small>Senha: ${usr.senha}</small><br><small>Expira: ${exp}</small><br><small>Status: ${usr.status}</small></div>
      <div><button data-a='liberar' data-u='${u}' class='btn'>Liberar</button>
      <button data-a='bloquear' data-u='${u}' class='btn'>Bloquear</button>
      <button data-a='excluir' data-u='${u}' class='btn'>Excluir</button></div>`;
      list.appendChild(li);
    });
    list.querySelectorAll('button').forEach(b=>b.onclick=(ev)=>{
      const a=ev.target.getAttribute('data-a'); const u=ev.target.getAttribute('data-u');
      if(a==='liberar') renovar30dias(u);
      if(a==='bloquear') setStatus(u,'bloqueado');
      if(a==='excluir') removeUser(u);
      renderUsers();
    });
  }
  if(list) renderUsers();

  window.logout=()=>{ window.location.href='index.html'; };
})();