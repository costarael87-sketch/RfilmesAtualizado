document.addEventListener('DOMContentLoaded',()=>{
  const loginForm=document.getElementById('login-form');
  const adminForm=document.getElementById('admin-login-form');
  let users=JSON.parse(localStorage.getItem('users')||'[]');

  function saveUsers(){localStorage.setItem('users',JSON.stringify(users));}
  function now(){return new Date().getTime();}

  // LOGIN USER
  if(loginForm){
    loginForm.addEventListener('submit',e=>{
      e.preventDefault();
      let u=document.getElementById('username').value;
      let p=document.getElementById('password').value;
      let user=users.find(x=>x.username===u&&x.password===p);
      if(!user){alert('Usuário não encontrado');return;}
      if(user.expires && now()>user.expires){user.status='bloqueado';saveUsers();alert('Acesso expirado');return;}
      if(user.status==='bloqueado'){alert('Usuário bloqueado');return;}
      localStorage.setItem('loggedUser',u);
      window.location.href='home.html';
    });
  }

  // LOGIN ADMIN
  if(adminForm){
    adminForm.addEventListener('submit',e=>{
      e.preventDefault();
      let eMail=document.getElementById('admin-email').value;
      let pass=document.getElementById('admin-password').value;
      if(eMail==='costarael87@gmail.com'&&pass==='1206israel'){
        window.location.href='admin-panel.html';
      } else alert('Credenciais inválidas');
    });
  }

  // ADMIN PANEL
  const formAdd=document.getElementById('formAddUser');
  const formTrial=document.getElementById('formTrial');
  const userList=document.getElementById('user-list');

  function renderUsers(){
    if(!userList) return;
    userList.innerHTML='';
    users.forEach(u=>{
      let li=document.createElement('li');
      let left=`${u.username} (${u.status})`;
      if(u.expires){let diff=u.expires-now();if(diff>0){let d=Math.floor(diff/86400000);let h=Math.floor((diff%86400000)/3600000);left+=` - expira em ${d}d ${h}h`;} else {u.status='bloqueado';}}
      li.innerHTML=`<span>${left}</span>
      <div>
        <button onclick="toggleUser('${u.username}','liberar')" class='btn-secondary'>Liberar</button>
        <button onclick="toggleUser('${u.username}','bloquear')" class='btn-secondary'>Bloquear</button>
        <button onclick="toggleUser('${u.username}','excluir')" class='btn-secondary'>Excluir</button>
      </div>`;
      userList.appendChild(li);
    });
    saveUsers();
  }

  if(formAdd){
    formAdd.addEventListener('submit',e=>{
      e.preventDefault();
      let u=document.getElementById('new-username').value;
      let p=document.getElementById('new-password').value;
      if(users.some(x=>x.username===u)){alert('Usuário já existe');return;}
      users.push({username:u,password:p,status:'liberado',expires:now()+30*24*60*60*1000});
      saveUsers();renderUsers();alert('Usuário criado por 30 dias');
      formAdd.reset();
    });
  }

  if(formTrial){
    formTrial.addEventListener('submit',e=>{
      e.preventDefault();
      let u=document.getElementById('trial-username').value;
      let p=document.getElementById('trial-password').value;
      if(users.some(x=>x.username===u)){alert('Usuário já existe');return;}
      users.push({username:u,password:p,status:'liberado',expires:now()+1*60*60*1000});
      saveUsers();renderUsers();alert('Teste de 1h criado');
      formTrial.reset();
    });
  }

  window.toggleUser=(uname,act)=>{
    let u=users.find(x=>x.username===uname);
    if(!u) return;
    if(act==='liberar'){u.status='liberado';u.expires=now()+30*24*60*60*1000;}
    if(act==='bloquear'){u.status='bloqueado';}
    if(act==='excluir'){users=users.filter(x=>x.username!==uname);}
    saveUsers();renderUsers();
  }

  if(userList) setInterval(renderUsers,2000);

  // LOGOUT
  window.logout=()=>{localStorage.removeItem('loggedUser');window.location.href='index.html';}

  // PLAYER
  const overlay=document.getElementById('video-player-overlay');
  const player=document.getElementById('video-player');
  window.openPlayer=el=>{player.src=el.dataset.url;overlay.classList.add('visible');}
  window.closePlayer=()=>{player.src='';overlay.classList.remove('visible');}
});