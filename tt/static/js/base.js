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