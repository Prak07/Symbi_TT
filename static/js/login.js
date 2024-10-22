const container = document.getElementById("container");
const registerBtn = document.getElementById("register");
const loginBtn = document.getElementById("login");
const password = document.querySelector(".password");
const s_eye1 = document.querySelector(".s_eye1");
const s_eye2 = document.querySelector(".s_eye2");
const eye1 = document.querySelector(".eye1");
const eye2 = document.querySelector(".eye2");
const s_password = document.querySelector(".s_password");

eye1.onclick = () => {
  if (password.type === "password") {
    password.type = "text";
    eye1.style.display = "none";
    eye2.style.display = "block";
  }
};
eye2.onclick = () => {
  if (password.type === "text") {
    password.type = "password";
    eye1.style.display = "block";
    eye2.style.display = "none";
  }
};

s_eye1.onclick = () => {
  if (s_password.type === "password") {
    s_password.type = "text";
    s_eye1.style.display = "none";
    s_eye2.style.display = "block";
  }
};
s_eye2.onclick = () => {
  if (s_password.type === "text") {
    s_password.type = "password";
    s_eye1.style.display = "block";
    s_eye2.style.display = "none";
  }
};

registerBtn.addEventListener("click", () => {
  container.classList.add("active");
});

loginBtn.addEventListener("click", () => {
  container.classList.remove("active");
});

gsap.from("#img-div", {
  y: -40,
  opacity: 0,
  duration: 0.8,
});

gsap.from("#container", {
  x: -300,
  opacity: 0,
  duration: 0.8,
});
