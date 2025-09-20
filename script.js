
// simples gerenciamento local de usuários (admin + lista). Não é seguro — use só localmente.
document.addEventListener('DOMContentLoaded',()=>{
  const adminForm=document.getElementById('admin-login-form');
  if(adminForm){
    adminForm.addEventListener('submit',e=>{
      e.preventDefault();
      const email=document.getElementById('admin-email').value;
      const pass=document.getElementById('admin-password').value;
      if(email==='costarael87@gmail.com' && pass==='1206israel'){
        window.location.href='admin-panel.html';
      } else alert('Credenciais inválidas');
    });
  }
  const loginForm=document.getElementById('login-form');
  if(loginForm){
    loginForm.addEventListener('submit',e=>{
      e.preventDefault();
      const u=document.getElementById('username').value;
      const p=document.getElementById('password').value;
      // dados de demo: busca em localStorage.users
      let users = JSON.parse(localStorage.getItem('rfilmes_users')||'[]');
      const found = users.find(x=>x.username===u && x.password===p && x.status!=='bloqueado');
      if(found){
        window.location.href='home.html';
      } else alert('Usuário inválido ou bloqueado');
    });
  }
  // admin panel actions
  const addForm=document.getElementById('formAddUser');
  const trialForm=document.getElementById('formTrial');
  function save(u){localStorage.setItem('rfilmes_users',JSON.stringify(u));}
  function load(){return JSON.parse(localStorage.getItem('rfilmes_users')||'[]');}
  function renderList(){
    const ul=document.getElementById('user-list'); if(!ul) return;
    const users=load(); ul.innerHTML='';
    users.forEach(user=>{
      const li=document.createElement('li');
      li.innerHTML=`${user.username} (${user.status}) - expira:${new Date(user.expires).toLocaleString()} 
        <button onclick="toggleUser('${user.username}','liberar')">Liberar</button>
        <button onclick="toggleUser('${user.username}','bloquear')">Bloquear</button>
        <button onclick="toggleUser('${user.username}','excluir')">Excluir</button>`;
      ul.appendChild(li);
    });
  }
  window.toggleUser=(u,a)=>{let users=load(); if(a==='excluir'){users=users.filter(x=>x.username!==u);} else {users=users.map(x=>x.username===u?{...x,status:(a==='liberar'?'liberado':'bloqueado')} : x);} save(users); renderList();}
  if(addForm){ addForm.addEventListener('submit',e=>{ e.preventDefault(); let users=load(); const u=document.getElementById('new-username').value; const p=document.getElementById('new-password').value; users.push({username:u,password:p,status:'liberado',expires:Date.now()+30*24*60*60*1000}); save(users); alert('Criado'); renderList(); addForm.reset();}); renderList();}
  if(trialForm){ trialForm.addEventListener('submit',e=>{ e.preventDefault(); let users=load(); const u=document.getElementById('trial-username').value; const p=document.getElementById('trial-password').value; users.push({username:u,password:p,status:'liberado',expires:Date.now()+60*60*1000}); save(users); alert('Teste criado'); renderList(); trialForm.reset();});}
});
