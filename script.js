function loginUser() {
  const user = document.getElementById("user").value;
  const pass = document.getElementById("pass").value;
  if (user && pass) {
    window.location.href = "home.html";
  } else {
    alert("Usuário ou senha inválidos.");
  }
}

function loginAdmin() {
  const email = document.getElementById("admin-email").value;
  const senha = document.getElementById("admin-pass").value;
  if (email === "costarael87@gmail.com" && senha === "1206israel") {
    window.location.href = "admin-panel.html";
  } else {
    alert("Credenciais de administrador inválidas.");
  }
}

function logout() {
  window.location.href = "index.html";
}