gsap.from("#footer #footer-container", {
  opacity: 0,
  duration: 1,
  delay: 0.5,
  scrollTrigger: {
    trigger: "#footer #footer-container",
    scroller: "#main",
    start: "top 97%",
  },
});

gsap.from(".links h3 ", {
  y: 200,
  opacity: 0,
  duration: 1,
  delay: 0.1,
  scrollTrigger: {
    trigger: ".links h3",
    scroller: "#main",
    start: "top 96%",
  },
});
Shery.makeMagnet("#nav-1 a,.links a", {
  ease: "cubic-bezier(0.23, 1, 0.320, 1)",
  duration: 1,
});

var profile = document.querySelector("#profile");
var close = document.querySelector("#close");
var overlay = document.querySelector(".overlay");
var editbtn = document.querySelector("#edit-btn");
var card1 = document.querySelector(".card-client1");
var card2 = document.querySelector(".card-client2");
var cancel = document.querySelector("#cancel");

if (profile) {
  profile.addEventListener("click", function () {
    overlay.style.display = "flex";
  });
}

if (close) {
  close.addEventListener("click", function () {
    overlay.style.display = "none";
  });
}

if (editbtn && card1 && card2) {
  editbtn.addEventListener("click", function () {
    card1.style.transform = "translateX(-100%)";
    card2.style.transform = "translateX(-100%)";
  });
}

if (cancel && card1 && card2) {
  cancel.addEventListener("click", function () {
    card1.style.transform = "translateX(0%)";
    card2.style.transform = "translateX(0%)";
  });
}
