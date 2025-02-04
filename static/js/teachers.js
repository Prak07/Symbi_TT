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

gsap.from("#nav-left img", {
  y: -100,
  opacity: 0,
  duration: 1,
});

gsap.from("#nav-2", {
  y: -50,
  opacity: 0,
  duration: 0.8,
  delay: 0.5,
});
gsap.from("#nav-1 a", {
  y: -50,
  opacity: 0,
  duration: 0.8,
  stagger: 0.1,
});

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
function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== "") {
    const cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      // Does this cookie string begin with the name we want?
      if (cookie.substring(0, name.length + 1) === name + "=") {
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
      const csrftoken = getCookie("csrftoken");
      // Add event listeners to each day element for date selection
      if (localStorage.getItem("selected_name")){
        document.querySelector(".search-cont .input").placeholder=localStorage.getItem("selected_name");
      const dayElements = document.querySelectorAll(".day");
      dayElements.forEach((dayElement) => {
        dayElement.addEventListener("click", function () {
          var input = document.querySelector(".search-cont .input");
          const inputValue = input.value.trim().toLowerCase();
          document.getElementById("time_table").style.display = "none";
          document.getElementById("loader").style.display = "block";
          const selectedDateString = this.dataset.date;
          selectedDate = new Date(selectedDateString);
          teacher_name = localStorage.getItem("selected_name");
          renderCalendar(); // Re-render the calendar to update the selected date UI
          // You can perform further operations with the selected date here
          fetch("/update_teacher/", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "X-CSRFToken": csrftoken,
            },
            body: JSON.stringify({ date: selectedDate, teacher: teacher_name }),
          })
            .then((response) => {
              if (!response.ok) {
                throw new Error("Network response was not ok");
              }
              return response.json(); // Parse JSON response
            })
            .then((data) => {
              // Extract the list from the JSON response
              const dataList = data.data_list;

              // Select the container element with class 'elem'

              // Clear previous content
              if (dataList && dataList.length > 0) {
                const container = document.querySelector("#time_table");
                container.innerHTML = "";
                for (let i = 0; i < dataList.length; i++) {
                  // Iterate over each item in dataList and generate HTML
                  // Create elements
                  const div1 = document.createElement("div");
                  div1.classList.add("elem");

                  const div11 = document.createElement("div");
                  div11.classList.add("elem-parts");
                  const h3_1 = document.createElement("h3");
                  h3_1.textContent = dataList[i][0];
                  div11.appendChild(h3_1);
                  div1.appendChild(div11);

                  const div12 = document.createElement("div");
                  div12.classList.add("elem-parts");
                  const h3_2 = document.createElement("h3");
                  h3_2.textContent = dataList[i][1] + "-" + dataList[i][2];
                  div12.appendChild(h3_2);
                  div1.appendChild(div12);

                  const div13 = document.createElement("div");
                  div13.classList.add("elem-parts");
                  const h3_3 = document.createElement("h3");
                  h3_3.textContent = dataList[i][3];
                  div13.appendChild(h3_3);
                  div1.appendChild(div13);

                  container.appendChild(div1);
                }
              } else {
                // If there is no data available, display a message
                const container = document.querySelector("#time_table");
                container.innerHTML = "";
                const message = document.createElement("p");
                message.classList.add("signin_message");
                message.textContent = "no lectures";
                container.appendChild(message);
              }
              document.getElementById("loader").style.display = "none";
              document.getElementById("time_table").style.display = "block";
            })
            .catch((error) => {
              console.error("Error updating HTML content:", error);
            });
        });
      });
    }};

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

if (window.innerWidth > 600) {
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
}

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

gsap.from(".container-input", {
  opacity: 0,
  duration: 1.5,
});

var input = document.querySelector(".search-cont .input");
var search_dets = document.querySelector("#search-dets");
var form = document.getElementById("search-form");
var t_names = [
  "Jatinderkumar Saini",
  "Parag Kaveri",
  "Sarika Sharma",
  "Rajashree Jain",
  "Rajesh Dhanraj",
  "Shirish Joshi",
  "Shraddha Vaidya",
  "Shilpa Mujumdar",
  "Shubhashri Waghmare",
  "Priti Kulkarni",
  "Sachin Naik",
  "Shrikant Mapari",
  "Gaurav Pant",
  "Shashank Gaikwad",
  "Prafulla Bafna",
  "Anuja Bokhare",
  "Hema Gaikwad",
  "Kumari Deepika",
  "Amol Vibhute",
  "Sandeep Gaikwad",
  "Prathamesh Lahande",
  "Pattar Gurunath",
  "Chaitanya Kulkarni",
  "Shashikant Nehul",
  "Sonal Parmar",
  "Kanchangauri Joshi",
  "Rajesh Math",
  "Rohan Pramod Bhase",
  "Anirudha Ketkar",
  "Vijay Haldavnekar",
  "Satyajit Achyut Wale",
  "Janhavi Pednekar",
  "Sarika Zambad",
  "Joshi Ambadas",
  "Vaishali Joshi",
  "Kirti Mehare",
  "Gauri Madan",
  "Shashshank Gaikwad",
  "Kunal Chandak",
  "Renuka Vaidya",
  "Siddharth Subramaniam",
  "Vatsala Gupta",
  "Surbhi Pai",
  "Sagar Bedre",
  "Sneha Shirlokar",
  "Sulaxan Jadhav",
  "Vrushali Kulkarni",
  "Mrinmayi Huprikar",
  "Ramandeep Kaur",
  "Vaishali Kale",
  "Umesh Patwari",
  "Gopal Phadke",
  "Ashwini Shende",
  "Parag Joshi",
  "Nandkumar Khachane",
  "Trupti Adke",
  "Ketki Hasbnis",
  "Ketki Deshpande ",
  "Biswajit Mohpatra",
  "Manjusha Joshi",
  "Manjusha Kalgaonkar",
  "Atul Kahate",
  "Rasila Walhekar",
  "Pranita Dube",
  "Farhana Desai"
];


// Get the form element
var form = document.getElementById('search-form');
// Add submit event listener to the form
form.addEventListener('submit', function(event) {
    // Get form data
    var name = document.getElementById('teacher').value;
    // Store form data in local storage
    localStorage.setItem("selected_name", name.trim());
});


function handleSearch() {
  function updateSearchResults() {
    const inputValue = input.value.trim().toLowerCase();
    if (inputValue === "") {
      gsap.to(search_dets, {
        top: "0%",
        display: "none",
        opacity: 0,
      });
      return;
    }

    const filter_array = t_names.filter(
      (name) => {
      // name.toLowerCase().includes(inputValue.toLowerCase())
      // name.toLowerCase().startsWith(inputValue.toLowerCase())
      if (inputValue.includes(" ")){
        return name.toLowerCase().includes(inputValue.toLowerCase())
      }
      else{
        const names = name.split(" ");
        return names[0].toLowerCase().startsWith(inputValue.toLowerCase()) || names[1].toLowerCase().startsWith(inputValue.toLowerCase());
      }
  });

    let clutter = "";
    if (filter_array.length === 0) {
      clutter = "<h4>No teachers found.</h4>";
    } else {
      filter_array.forEach(function (name) {
        clutter += `<h3><i class="ri-arrow-right-s-line"></i> ${name}</h3>`;
      });
    }
    search_dets.innerHTML = clutter;

    document.querySelectorAll("#search-dets h3").forEach((element) => {
      element.addEventListener("click", function () {
        localStorage.setItem("selected_name", element.innerText.trim());
        input.value = element.innerText.trim();
        gsap.to(search_dets, {
          top: "0%",
          display: "none",
          opacity: 0,
        });
        form.submit();
      });
    });

    gsap.to(search_dets, {
      top: "100%",
      display: "flex",
      opacity: 1,
    });
  }

  input.addEventListener("input", updateSearchResults);
  input.addEventListener("blur", function () {
    gsap.to(search_dets, {
      top: "0%",
      display: "none",
      opacity: 0,
    });
  });

  input.addEventListener("focus", function () {
    const selectedName = localStorage.getItem("selected_name");
    if (selectedName) {
      input.value = selectedName;
    }
    updateSearchResults();
  });
}

handleSearch();
