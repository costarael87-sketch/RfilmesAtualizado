
const ADMIN_EMAIL = "costarael87@gmail.com";
const ADMIN_PASS = "1206israel";
const PER_PAGE = 50;
let contents = [];

async function loadContents(){
  try{
    const resp = await fetch('conteudos.json');
    contents = await resp.json();
  }catch(e){
    console.error('Erro carregando conteudos.json', e);
    contents = [];
  }
}

function saveToSession(user){
  sessionStorage.setItem('rfilmes_user', user);
}

function logoutAndGoHome(){
  sessionStorage.removeItem('rfilmes_user');
  window.location = 'index.html';
}

document.addEventListener('DOMContentLoaded', async ()=>{
  const path = location.pathname.split('/').pop();

  // index page handlers
  if(path === 'index.html' || path === ''){
    const loginForm = document.getElementById('loginForm');
    const adminForm = document.getElementById('adminForm');
    loginForm.addEventListener('submit', async (e)=>{
      e.preventDefault();
      const u = document.getElementById('username').value.trim();
      const p = document.getElementById('password').value.trim();
      if(!u || !p){ alert('Preencha usuário e senha'); return; }
      // check in firebase realtime
      try{
        const fbUrl = 'https://rrfilmes-fad2a-default-rtdb.firebaseio.com/usuarios/' + encodeURIComponent(u) + '.json';
        const r = await fetch(fbUrl);
        const data = await r.json();
        if(!data){ alert('Usuário não encontrado'); return; }
        const now = new Date();
        const exp = data.expira ? new Date(data.expira) : null;
        if(data.senha === p && data.status === 'liberado' && (!exp || exp > now)){
          saveToSession(u);
          window.location = 'filmes.html';
        }else{ alert('Credenciais inválidas ou acesso bloqueado/expirado'); }
      }catch(err){
        console.error(err); alert('Erro ao verificar usuário'); 
      }
    });

    adminForm.addEventListener('submit', (e)=>{
      e.preventDefault();
      const email = document.getElementById('adminEmail').value.trim();
      const pass = document.getElementById('adminPass').value.trim();
      if(email === ADMIN_EMAIL && pass === ADMIN_PASS){
        sessionStorage.setItem('rfilmes_admin','1');
        window.location = 'admin-panel.html';
      }else{ alert('Credenciais de administrador inválidas'); }
    });
  }

  // admin panel
  if(path === 'admin-panel.html'){
    if(!sessionStorage.getItem('rfilmes_admin')){ alert('Acesso negado'); window.location='index.html'; return; }
    const userListDiv = document.getElementById('userList');
    const addForm = document.getElementById('addUserForm');
    const trialForm = document.getElementById('trialForm');
    // load users
    async function refreshUsers(){
      try{
        const r = await fetch('https://rrfilmes-fad2a-default-rtdb.firebaseio.com/usuarios.json');
        const data = await r.json() || {};
        const keys = Object.keys(data);
        if(keys.length === 0){ userListDiv.innerHTML = '<p>Nenhum usuário.</p>'; return; }
        userListDiv.innerHTML = '';
        keys.forEach(k=>{
          const u = data[k];
          const div = document.createElement('div');
          div.className = 'item';
          div.innerHTML = `<strong>${k}</strong> - ${u.status||''} - expira: ${u.expira||'N/A'} 
            <div style="margin-top:6px"><button class="btn" onclick="window._liberar('${k}')">Liberar</button> <button class="btn" onclick="window._bloquear('${k}')">Bloquear</button> <button class="btn" onclick="window._excluir('${k}')">Excluir</button></div>`;
          userListDiv.appendChild(div);
        });
      }catch(e){
        console.error(e); userListDiv.innerText = 'Erro ao carregar usuários';
      }
    }
    await refreshUsers();
    window._liberar = async (id)=>{ await fetch('https://rrfilmes-fad2a-default-rtdb.firebaseio.com/usuarios/'+encodeURIComponent(id)+'.json', {method:'PATCH', body: JSON.stringify({status:'liberado'})}); await refreshUsers(); };
    window._bloquear = async (id)=>{ await fetch('https://rrfilmes-fad2a-default-rtdb.firebaseio.com/usuarios/'+encodeURIComponent(id)+'.json', {method:'PATCH', body: JSON.stringify({status:'bloqueado'})}); await refreshUsers(); };
    window._excluir = async (id)=>{ if(confirm('Confirma excluir?')){ await fetch('https://rrfilmes-fad2a-default-rtdb.firebaseio.com/usuarios/'+encodeURIComponent(id)+'.json', {method:'DELETE'}); await refreshUsers(); } };

    addForm.addEventListener('submit', async (e)=>{
      e.preventDefault();
      const id = document.getElementById('addUserId').value.trim();
      const pass = document.getElementById('addUserPass').value.trim();
      const status = document.getElementById('addUserStatus').value;
      if(!id||!pass){ alert('Preencha'); return; }
      const exp = new Date(); exp.setDate(exp.getDate()+30);
      await fetch('https://rrfilmes-fad2a-default-rtdb.firebaseio.com/usuarios/'+encodeURIComponent(id)+'.json', {method:'PUT', body: JSON.stringify({senha:pass,status:status,expira:exp.toISOString()})});
      alert('Usuário salvo'); await refreshUsers();
      addForm.reset();
    });

    trialForm.addEventListener('submit', async (e)=>{
      e.preventDefault();
      const id = document.getElementById('trialUser').value.trim();
      const pass = document.getElementById('trialPass').value.trim();
      if(!id||!pass){ alert('Preencha'); return; }
      const exp = new Date(Date.now()+60*60*1000);
      await fetch('https://rrfilmes-fad2a-default-rtdb.firebaseio.com/usuarios/'+encodeURIComponent(id)+'.json', {method:'PUT', body: JSON.stringify({senha:pass,status:'liberado',expira:exp.toISOString()})});
      alert('Teste criado'); trialForm.reset(); await refreshUsers();
    });

    document.getElementById('logoutBtn').addEventListener('click', ()=>{ sessionStorage.removeItem('rfilmes_admin'); window.location='index.html'; });
  }

  // filmes page
  if(path === 'filmes.html'){
    if(!sessionStorage.getItem('rfilmes_user')){ alert('Faça login'); window.location='index.html'; return; }
    document.getElementById('logout').addEventListener('click', logoutAndGoHome);
    await loadContents();
    const list = document.getElementById('list');
    const pager = document.getElementById('pager');
    let page = 1;
    const total = contents.length;
    const pages = Math.ceil(total / PER_PAGE);
    function render(){
      list.innerHTML = '';
      const start = (page-1)*PER_PAGE;
      const end = Math.min(start+PER_PAGE, total);
      for(let i=start;i<end;i++){
        const it = contents[i];
        const div = document.createElement('div');
        div.className = 'item';
        div.innerHTML = `<h3>${it.name}</h3><p><a class="btn" href="${it.link}" target="_blank" rel="noopener">▶ Assistir Agora</a></p>`;
        list.appendChild(div);
      }
      pager.innerHTML = '';
      if(page>1){ const a = document.createElement('button'); a.className='btn'; a.textContent='⬅ Anterior'; a.onclick=()=>{page--; render();}; pager.appendChild(a); }
      if(page<pages){ const b = document.createElement('button'); b.className='btn'; b.textContent='Próxima ➡'; b.onclick=()=>{page++; render();}; pager.appendChild(b); }
      pager.appendChild(document.createTextNode('  Página ' + page + ' / ' + pages));
    }
    render();
  }

});