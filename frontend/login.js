function login() {
    const user = document.getElementById("username").value.trim();
    const pass = document.getElementById("password").value.trim();
    const errorMsg = document.getElementById("error-msg");
  
    // Simples validação (pode trocar por backend futuramente)
    if (user === "admin" && pass === "1234") {
      localStorage.setItem("auth", "true"); // marca como logado
      window.location.replace("admin.html"); // impede voltar para login.html
    } else {
      errorMsg.style.display = "block";
    }
  }
  
  // Bloqueia acesso direto ao painel sem login
  if (window.location.pathname.includes("admin.html")) {
    const auth = localStorage.getItem("auth");
    if (!auth) {
      window.location.href = "login.html";
    }
  }
  