gsap.from("#img-div", {
  y: -40,
  opacity: 0,
  duration: 0.8,
});

gsap.from(".form", {
  x: -100,
  opacity: 0,
  duration: 0.8,
});

const password = document.querySelector("#c_pass");
console.log(password);

const s_eye1 = document.querySelector(".s_eye1");
console.log(s_eye1);
const s_eye2 = document.querySelector(".s_eye2");
console.log(s_eye2);

s_eye1.onclick = () => {
  if (password.type === "password") {
    password.type = "text";
    s_eye1.style.display = "none";
    s_eye2.style.display = "block";
  }
};
s_eye2.onclick = () => {
  if (password.type === "text") {
    password.type = "password";
    s_eye1.style.display = "block";
    s_eye2.style.display = "none";
  }
};
