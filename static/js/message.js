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

gsap.from("#page1 h3", {
  y: 300,
  opacity: 0,
  duration: 1,
});
gsap.from("#left", {
  x: -300,
  opacity: 0,
  duration: 1,
});
gsap.from("#right", {
  x: 550,
  opacity: 0,
  duration: 1,
  delay: 0.1,
});

gsap.from(".desc h2", {
  y: 550,
  opacity: 0,
  duration: 1,
});

gsap.from(" .desc a", {
  y: 300,
  opacity: 0,
  duration: 1,
});
var text = document.querySelectorAll("#message h2");
text.forEach(function (e) {
  var clutter = "";
  var eachtext = e.textContent;
  var splitText = eachtext.split("");
  splitText.forEach(function (e) {
    clutter += `<span>${e}</span>`;
  });
  e.innerHTML = clutter;
});

gsap.to("#message h2 span", {
  color: "#fff",
  stagger: 0.1,
  duration: 0.1,
  scrollTrigger: {
    trigger: "#message h2",
    start: "top 90%",
    end: "bottom 50%",
    scroller: "#main",
    start: "top 84%",
    end: "top -000001%",
    scrub: 5,
  },
});

gsap.from("#message", {
  y: 100,
  opacity: 0,
  duration: 1,
});
