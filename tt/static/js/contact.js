function locogsap() {
  gsap.registerPlugin(ScrollTrigger);

  const locoScroll = new LocomotiveScroll({
    el: document.querySelector("#main"),
    smooth: true,
  });
  locoScroll.on("scroll", ScrollTrigger.update);

  ScrollTrigger.scrollerProxy("#main", {
    scrollTop(value) {
      return arguments.length
        ? locoScroll.scrollTo(value, 0, 0)
        : locoScroll.scroll.instance.scroll.y;
    },
    getBoundingClientRect() {
      return {
        top: 0,
        left: 0,
        width: window.innerWidth,
        height: window.innerHeight,
      };
    },

    pinType: document.querySelector("#main").style.transform
      ? "transform"
      : "fixed",
  });

  ScrollTrigger.addEventListener("refresh", () => locoScroll.update());

  ScrollTrigger.refresh();
}
locogsap();
function cursor() {
  Shery.mouseFollower({
    skew: true,
    ease: "cubic-bezier(0.23, 1, 0.320, 1)",
    duration: 0.3,
  });
}
cursor();
var tl = gsap.timeline();

gsap.from("#nav-left img", {
  y: -100,
  opacity: 0,
  duration: 1,
});
gsap.from("#nav-2", {
  y: -50,
  opacity: 0,
  duration: 1,
  delay: 1,
});
gsap.from("#nav-1 a", {
  y: -50,
  opacity: 0,
  duration: 1,

  stagger: 0.1,
});

gsap.from("#contact .content h1", {
  opacity: 0,
  y: 500,
  duration: 2,
  delay: 0.7,
});

gsap.from("#contact .underline", {
  opacity: 0,
  x: 100,
  duration: 1,
  delay: 1,
});
gsap.from("#form-container form", {
  opacity: 0,
  x: -400,
  duration: 1.5,
  delay: 1,
});
gsap.from("#contact-info .elem-cont h1, #info .elem-cont h3", {
  opacity: 0,
  y: 300,
  duration: 2,
  delay: 1,
});

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
  duration: 1.3,
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
