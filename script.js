let users = [];
let loggedInUser = null;

document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('login-form');
  const adminLoginForm = document.getElementById('admin-login-form');
  const addUserForm = document.getElementById('add-user-form');
  const createTrialForm = document.getElementById('create-trial-form');
  const userList = document.getElementById('user-list');

  // Login usuário
  if(loginForm){
    loginForm.addEventListener('submit', e => {
      e.preventDefault();
      const u = document.getElementById('username').value;
      const p = document.getElementById('password').value;
      const user = users.find(x=>x.username===u && x.password===p);
      if(user && user.status==='liberado'){
        window.location.href='home.html';
      } else {
        alert('Usuário inválido ou bloqueado.');
      }
    });
  }

  // Login admin
  if(adminLoginForm){
    adminLoginForm.addEventListener('submit', e => {
      e.preventDefault();
      const email = document.getElementById('admin-email').value;
      const pass = document.getElementById('admin-password').value;
      if(email==='costarael87@gmail.com' && pass==='1206israel'){
        window.location.href='admin-panel.html';
      } else {
        alert('Admin inválido.');
      }
    });
  }

  // Painel admin: adicionar usuário
  if(addUserForm){
    addUserForm.addEventListener('submit', e => {
      e.preventDefault();
      const u = document.getElementById('new-username').value;
      const p = document.getElementById('new-password').value;
      const exp = new Date(Date.now()+30*24*60*60*1000);
      users.push({id:Date.now(),username:u,password:p,status:'liberado',expires:exp});
      renderUsers();
    });
  }

  // Criar teste
  if(createTrialForm){
    createTrialForm.addEventListener('submit', e => {
      e.preventDefault();
      const u = document.getElementById('trial-username').value;
      const p = document.getElementById('trial-password').value;
      const exp = new Date(Date.now()+60*60*1000);
      users.push({id:Date.now(),username:u,password:p,status:'liberado',expires:exp});
      renderUsers();
    });
  }

  function renderUsers(){
    if(!userList) return;
    userList.innerHTML='';
    users.forEach(user=>{
      let li=document.createElement('li');
      let timeLeft='';
      if(user.expires){
        let diff=user.expires-new Date();
        if(diff<=0){user.status='bloqueado'; timeLeft='Expirado';}
        else timeLeft=Math.floor(diff/60000)+'m';
      }
      li.innerHTML=`${user.username} (${user.status}) - ${timeLeft}
      <button onclick="toggleStatus(${user.id},'liberar')">Liberar</button>
      <button onclick="toggleStatus(${user.id},'bloquear')">Bloquear</button>
      <button onclick="deleteUser(${user.id})">Excluir</button>`;
      userList.appendChild(li);
    });
  }

  window.toggleStatus=(id,action)=>{
    let u=users.find(x=>x.id===id);
    if(u){u.status=action==='liberar'?'liberado':'bloqueado'; renderUsers();}
  };
  window.deleteUser=(id)=>{users=users.filter(x=>x.id!==id); renderUsers();};

  // Player
  window.openPlayer=(el)=>{
    document.getElementById('video-player').src=el.dataset.url;
    document.getElementById('video-player-overlay').classList.add('visible');
  };
  window.closePlayer=()=>{
    document.getElementById('video-player').src='';
    document.getElementById('video-player-overlay').classList.remove('visible');
  };
});