function locogsap() {
  gsap.registerPlugin(ScrollTrigger);

  const locoScroll = new LocomotiveScroll({
    el: document.querySelector("#main"),
    smooth: true,
    multiplier: 0.7,
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

tl.from("#about h1", {
  y: 500,
  opacity: 0,
  duration: 1.5,
});
tl.from("#about .underline", {
  x: -200,
  opacity: 0,
  duration: 0.7,
});
tl.from("#about p", {
  opacity: 0,
  duration: 0.7,
});
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

gsap.from("#founders .content h1", {
  y: 100,
  opacity: 0,
  duration: 1,
  scrollTrigger: {
    trigger: "#founders .content h1",
    scroller: "#main",
    start: "top 90%",
  },
});
gsap.from("#founders .underline", {
  x: 200,
  opacity: 0,
  duration: 0.7,
  scrollTrigger: {
    trigger: "#founders .underline",
    scroller: "#main",
    start: "top 90%",
  },
});

gsap.from("#cont1 h2", {
  y: 100,
  opacity: 0,
  duration: 1,
  scrollTrigger: {
    trigger: ".cont h2",
    scroller: "#main",
    start: "top 98%",
  },
});

gsap.from("#desc1 p", {
  y: 100,
  opacity: 0,
  duration: 1,
  scrollTrigger: {
    trigger: "#desc1 p",
    scroller: "#main",
    start: "top 99%",
  },
});
gsap.from("#desc1 a", {
  y: 100,
  opacity: 0,
  duration: 1,
  scrollTrigger: {
    trigger: "#desc1 a",
    scroller: "#main",
    start: "top 98%",
  },
});

gsap.from("#cont2 h2", {
  y: 100,
  opacity: 0,
  duration: 1,
  scrollTrigger: {
    trigger: ".cont h2",
    scroller: "#main",
    start: "bottom 95%",
  },
});

gsap.from("#desc2 p", {
  y: 100,
  opacity: 0,
  duration: 1,
  scrollTrigger: {
    trigger: "#desc2 p",
    scroller: "#main",
    start: "top 98%",
  },
});
gsap.from("#desc2 a", {
  y: 100,
  opacity: 0,
  duration: 1,
  scrollTrigger: {
    trigger: "#desc2 a",
    scroller: "#main",
    start: "bottom 95%",
  },
});
gsap.from("#cont3 h2", {
  y: 100,
  opacity: 0,
  duration: 1,
  scrollTrigger: {
    trigger: "#cont3 h2",
    scroller: "#main",
    start: "bottom 110%",
  },
});

gsap.from("#desc3 p", {
  y: 100,
  opacity: 0,
  duration: 1,
  scrollTrigger: {
    trigger: "#desc3 p",
    scroller: "#main",
    start: "bottom 111%",
  },
});

gsap.from("#desc3 a", {
  y: 100,
  opacity: 0,
  duration: 1,
  scrollTrigger: {
    trigger: "#desc3 a",
    scroller: "#main",
    start: "top 99%",
  },
});
function rearrangeElements() {
  var cont = document.getElementById("cont2");
  var desc = document.getElementById("desc2");
  var partners = document.getElementById("partners");

  if (window.innerWidth <= 600) {
    partners.insertBefore(cont, desc);
  } else {
    partners.insertBefore(desc, cont);
  }
}

rearrangeElements();

window.addEventListener("resize", rearrangeElements);
