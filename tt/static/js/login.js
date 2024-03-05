const container = document.getElementById("container");
const registerBtn = document.getElementById("register");
const loginBtn = document.getElementById("login");

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
