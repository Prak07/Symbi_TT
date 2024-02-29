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

gsap.from(".calendar", {
  x: 100,
  opacity: 0,
  duration: 0.5,
});
gsap.from("#data-cont", {
  x: -100,
  opacity: 0,
  duration: 0.5,
});
gsap.from("#nav-left img", {
  y: -100,
  opacity: 0,
  duration: 1,
});
tl.from("#nav-1 a", {
  y: -50,
  opacity: 0,
  duration: 0.8,
  stagger: 0.1,
});
gsap.from("#nav-2", {
  y: -200,
  opacity: 0,
  duration: 1,
  delay: 0.2,
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
function calendar() {
  document.addEventListener("DOMContentLoaded", function () {
    const prevButton = document.querySelector(".prev");
    const nextButton = document.querySelector(".next");
    const monthYearElement = document.querySelector(".month-year");
    const daysElement = document.querySelector(".days");

    let currentDate = new Date();
    let selectedDate = null;

    function renderCalendar() {
      const today = new Date(); // Get today's date
      const currentMonth = currentDate.getMonth();
      const currentYear = currentDate.getFullYear();

      const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
      const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);
      const daysInMonth = lastDayOfMonth.getDate();
      const firstDayOfWeek = firstDayOfMonth.getDay();

      monthYearElement.textContent = new Intl.DateTimeFormat("en-US", {
        month: "long",
        year: "numeric",
      }).format(currentDate);

      let daysHTML = "";
      for (let i = 0; i < firstDayOfWeek; i++) {
        daysHTML += `<div></div>`;
      }
      for (let i = 1; i <= daysInMonth; i++) {
        const date = new Date(currentYear, currentMonth, i);
        const isSelected =
          selectedDate && date.toDateString() === selectedDate.toDateString();
        const isToday = date.toDateString() === today.toDateString(); // Check if the date is today

        // Add classes based on selection and current date
        let classes = "day";
        if (isSelected) {
          classes += " selected";
        }
        if (isToday) {
          classes += " today";
        }

        daysHTML += `<div class="${classes}" data-date="${date.toISOString()}">${i}</div>`;
      }
      daysElement.innerHTML = daysHTML;

      // Add event listeners to each day element for date selection
      const dayElements = document.querySelectorAll(".day");
      dayElements.forEach((dayElement) => {
        dayElement.addEventListener("click", function () {
          const selectedDateString = this.dataset.date;
          selectedDate = new Date(selectedDateString);
          renderCalendar(); // Re-render the calendar to update the selected date UI
          // You can perform further operations with the selected date here
          console.log("Selected date:", selectedDate);
        });
      });
    }

    prevButton.addEventListener("click", function () {
      currentDate.setMonth(currentDate.getMonth() - 1);
      renderCalendar();
    });

    nextButton.addEventListener("click", function () {
      currentDate.setMonth(currentDate.getMonth() + 1);
      renderCalendar();
    });

    renderCalendar();
  });
}

calendar();
