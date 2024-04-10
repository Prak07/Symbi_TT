function locogsap() {
  gsap.registerPlugin(ScrollTrigger);

  const locoScroll = new LocomotiveScroll({
    el: document.querySelector("#main"),
    smooth: true,
    multiplier: 0.7,
    tablet: { smooth: true },

    smartphone: { smooth: true },
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
function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== '') {
      const cookies = document.cookie.split(';');
      for (let i = 0; i < cookies.length; i++) {
          const cookie = cookies[i].trim();
          // Does this cookie string begin with the name we want?
          if (cookie.substring(0, name.length + 1) === (name + '=')) {
              cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
              break;
          }
      }
  }
  return cookieValue;
}

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
        const isSelected =selectedDate && date.toDateString() === selectedDate.toDateString();
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
      const csrftoken = getCookie('csrftoken');
      // Add event listeners to each day element for date selection
      const dayElements = document.querySelectorAll(".day");
      dayElements.forEach((dayElement) => {
        dayElement.addEventListener("click", function () {
          document.getElementById("loader").style.display = "block";
          document.getElementById("time_table").style.display = "none";
          const selectedDateString = this.dataset.date;
          selectedDate = new Date(selectedDateString);
          renderCalendar(); // Re-render the calendar to update the selected date UI
          // You can perform further operations with the selected date here
          fetch('/update_routine/',{
            method:'POST',
            headers:{'Content-Type':'application/json',
            'X-CSRFToken':csrftoken,},
            body:JSON.stringify({"date":selectedDate})
          }).then(response => {
    if (!response.ok) {
        throw new Error("Network response was not ok");
    }
    return response.json(); // Parse JSON response
})
.then(data => {
    // Extract the list from the JSON response
    const dataList = data.data_list;

        // Select the container element with class 'elem'
        
        // Clear previous content
        if (dataList && dataList.length > 0) {
          const container = document.querySelector('#time_table')
          container.innerHTML = '';
          for(let i=0;i<dataList.length;i++){
        // Iterate over each item in dataList and generate HTML
            // Create elements
            const div1 = document.createElement("div");
            div1.classList.add("elem");

            const div11 = document.createElement("div");
            div11.classList.add("elem-parts");
            const h3_1 = document.createElement("h3");
            h3_1.textContent = dataList[i][0];
            div11.appendChild(h3_1);
            div1.appendChild(div11)

            const div12 = document.createElement("div");
            div12.classList.add("elem-parts");
            const h3_2 = document.createElement("h3");
            h3_2.textContent = dataList[i][1] + "-" + dataList[i][2];
            div12.appendChild(h3_2);
            div1.appendChild(div12)

            const div13 = document.createElement("div");
            div13.classList.add("elem-parts");
            const h3_3 = document.createElement("h3");
            h3_3.textContent = dataList[i][3];
            div13.appendChild(h3_3);
            div1.appendChild(div13)

            container.appendChild(div1);
          };
        }
        else {
          // If there is no data available, display a message
          const container = document.querySelector('#time_table')
          container.innerHTML='';
          const message = document.createElement('p');
          message.classList.add('signin_message');
          message.textContent = 'NO CLASSES TODAY';
          container.appendChild(message);
      }
      document.getElementById("loader").style.display = "none";
      document.getElementById("time_table").style.display = "block";
})
.catch(error => {
    console.error("Error updating HTML content:", error);
});
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
