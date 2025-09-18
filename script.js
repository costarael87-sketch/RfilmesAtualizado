document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('login-form');
  const adminLoginForm = document.getElementById('admin-login-form');

  // Usuários armazenados em memória (simples)
  let users = [];
  let loggedInUser = null;

  // Login normal
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const username = document.getElementById('username').value;
      const password = document.getElementById('password').value;
      const user = users.find(u => u.username === username && u.password === password);
      if (user && user.status === 'liberado') {
        window.location.href = 'home.html';
      } else {
        alert('Usuário inválido ou bloqueado');
      }
    });
  }

  // Login admin
  if (adminLoginForm) {
    adminLoginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('admin-email').value;
      const password = document.getElementById('admin-password').value;
      if (email === 'costarael87@gmail.com' && password === '1206israel') {
        window.location.href = 'admin-panel.html';
      } else {
        alert('Credenciais inválidas');
      }
    });
  }

  // Painel admin
  const addUserForm = document.getElementById('add-user-form');
  const userList = document.getElementById('user-list');
  const createTrialForm = document.getElementById('create-trial-form');

  if (addUserForm) {
    addUserForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const username = document.getElementById('new-username').value;
      const password = document.getElementById('new-password').value;
      users.push({ username, password, status: 'liberado' });
      renderUsers();
      addUserForm.reset();
    });
  }

  if (createTrialForm) {
    createTrialForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const username = document.getElementById('trial-username').value;
      const user = users.find(u => u.username === username);
      if (user) {
        const expires = new Date(Date.now() + 60*60*1000);
        user.accessExpires = expires;
        alert('Teste criado por 1 hora');
        renderUsers();
      } else {
        alert('Usuário não encontrado');
      }
      createTrialForm.reset();
    });
  }

  function renderUsers() {
    if (!userList) return;
    userList.innerHTML = '';
    users.forEach((user, index) => {
      const li = document.createElement('li');
      li.innerHTML = \`
        <span>\${user.username} (\${user.status})</span>
        <button onclick="toggleStatus(\${index}, 'liberar')">Liberar</button>
        <button onclick="toggleStatus(\${index}, 'bloquear')">Bloquear</button>
        <button onclick="deleteUser(\${index})">Excluir</button>
      \`;
      userList.appendChild(li);
    });
  }

  window.toggleStatus = (i, action) => {
    if (users[i]) {
      users[i].status = action === 'liberar' ? 'liberado' : 'bloqueado';
      renderUsers();
    }
  };

  window.deleteUser = (i) => {
    users.splice(i,1);
    renderUsers();
  };
});