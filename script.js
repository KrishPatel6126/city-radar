/* ================= LOGIN SYSTEM ================= */

let isLogin = true;

function openAuth() {
  document.getElementById("authModal").classList.remove("hidden");
}

function toggleAuth() {
  isLogin = !isLogin;
  document.getElementById("authTitle").innerText = isLogin ? "Login" : "Signup";
}

function handleAuth() {
  const name = document.getElementById("authName").value.trim();
  const pass = document.getElementById("authPass").value.trim();

  if (!name || !pass) return alert("Fill all fields");

  if (isLogin) {
    const saved = JSON.parse(localStorage.getItem(name));

    if (!saved || saved.pass !== pass) {
      alert("Invalid credentials");
      return;
    }

    loginUser(name);
  } else {
    localStorage.setItem(name, JSON.stringify({ pass }));
    alert("Signup successful");
    loginUser(name);
  }
}

function loginUser(name) {
  localStorage.setItem("currentUser", name);
  document.getElementById("authModal").classList.add("hidden");
  updateUserUI();
}

function logout() {
  localStorage.removeItem("currentUser");
  updateUserUI();
}

function updateUserUI() {
  const user = localStorage.getItem("currentUser");
  const display = document.getElementById("userDisplay");

  if (!display) return;

  if (user) {
    display.innerHTML = `Hi, ${user} <button onclick="logout()">Logout</button>`;
  } else {
    display.innerHTML = "";
  }
}

/* RUN ON LOAD */
window.onload = updateUserUI;
