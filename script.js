const calendar = document.querySelector(".calendar"),
  date = document.querySelector(".date"),
  daysContainer = document.querySelector(".days"),
  prev = document.querySelector(".prev"),
  next = document.querySelector(".next"),
  todayBtn = document.querySelector(".today-btn"),
  gotoBtn = document.querySelector(".goto-btn"),
  dateInput = document.querySelector(".date-input"),
  eventDay = document.querySelector(".event-day"),
  eventDate = document.querySelector(".event-date"),
  eventsContainer = document.querySelector(".events"),
  addEventBtn = document.querySelector(".add-event"),
  addEventWrapper = document.querySelector(".add-event-wrapper "),
  addEventCloseBtn = document.querySelector(".close "),
  addParticularName = document.querySelector(".event-name "),
  addParticularRate = document.querySelector(".event-time-from "),
  addEventTo = document.querySelector(".event-time-to "),
  addEventSubmit = document.querySelector(".add-event-btn ");

let today = new Date();
let activeDay;
let month = today.getMonth();
let year = today.getFullYear();

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

// const eventsArr = [
//   {
//     day: 13,
//     month: 11,
//     year: 2022,
//     events: [
//       {
//         title: "Event 1 lorem ipsun dolar sit genfa tersd dsad ",
//         time: "10:00 AM",
//       },
//       {
//         title: "Event 2",
//         time: "11:00 AM",
//       },
//     ],
//   },
// ];
//-----------------------------------------------------
// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-app.js";
import {getAuth,GoogleAuthProvider,signInWithPopup} from "https://www.gstatic.com/firebasejs/9.14.0/firebase-auth.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDLtbu7znzhba1IkzxfptkSbCIaQgUSDlE",
  authDomain: "fir-bcaf6.firebaseapp.com",
  databaseURL: "https://fir-bcaf6-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "fir-bcaf6",
  storageBucket: "fir-bcaf6.appspot.com",
  messagingSenderId: "214512315771",
  appId: "1:214512315771:web:bb12e5cc764754212161de"
};
let updatedInput="";
// Initialize Firebase
const app = initializeApp(firebaseConfig);
import{getDatabase, set,get,remove,update,ref,child} from "https://www.gstatic.com/firebasejs/9.14.0/firebase-database.js"

const db=getDatabase();
const auth=getAuth(app);
console.log("Auth Initialized");
const provider=new GoogleAuthProvider();
console.log("Provider Initialized");
// ------------------------------
const eventsArr = [];
getEvents();
console.log(eventsArr);

//function to add days in days with class day and prev-date next-date on previous month and next month days and active on today
function initCalendar() {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const prevLastDay = new Date(year, month, 0);
  const prevDays = prevLastDay.getDate();
  const lastDate = lastDay.getDate();
  const day = firstDay.getDay();
  const nextDays = 7 - lastDay.getDay() - 1;

  date.innerHTML = months[month] + " " + year;

  let days = "";
  
  for (let x = day; x > 0; x--) {
    days += `<div class="day prev-date">${prevDays - x + 1}</div>`;
  }

  for (let i = 1; i <= lastDate; i++) {
    //check if event is present on that day
    let event = false;
    eventsArr.forEach((eventObj) => {
      if (
        eventObj.day === i &&
        eventObj.month === month + 1 &&
        eventObj.year === year
      ) {
        event = true;
      }
    });
    if (
      i === new Date().getDate() &&
      year === new Date().getFullYear() &&
      month === new Date().getMonth()
    ) {
      activeDay = i;
      getActiveDay(i);
      updateEvents(i);
      if (event) {
        days += `<div class="day today active event">${i}</div>`;
      } else {
        days += `<div class="day today active">${i}</div>`;
      }
    } else {
      if (event) {
        days += `<div class="day event">${i}</div>`;
      } else {
        days += `<div class="day ">${i}</div>`;
      }
    }
  }

  for (let j = 1; j <= nextDays; j++) {
    days += `<div class="day next-date">${j}</div>`;
  }
  daysContainer.innerHTML = days;
  addListner();
  const cal_days = document.querySelectorAll(".day");
  cal_days.forEach((day) => {
    day.addEventListener("click", (e) => {
      const clickedDate = e.target.innerHTML;
      const clickedMonth = month + 1; // Adjust month index to match calendar display
      const clickedYear = year;

      // Fetch expenditure data based on the clicked date
      updatedInput=cleanseDate(clickedYear, clickedMonth, clickedDate);
      //alert(updatedInput)
    });
  });
}


function cleanseDate(year, month, date) {
  console.log(`Fetching expenditure for ${year}-${month}-${date}`);
  var onDay=new Date(year, month-1, date);
  month=String(onDay.getMonth()+1).padStart(2, '0');
  let day=String(onDay.getDate()).padStart(2, '0');
  year=onDay.getFullYear();
  let dateWithoutTime=`${year}-${month}-${day}`;
  return dateWithoutTime;
}


//function to add month and year on prev and next button
function prevMonth() {
  month--;
  if (month < 0) {
    month = 11;
    year--;
  }
  initCalendar();
}

function nextMonth() {
  month++;
  if (month > 11) {
    month = 0;
    year++;
  }
  initCalendar();
}

prev.addEventListener("click", prevMonth);
next.addEventListener("click", nextMonth);

initCalendar();

//function to add active on day
function addListner() {
  const days = document.querySelectorAll(".day");
  days.forEach((day) => {
    day.addEventListener("click", (e) => {
      getActiveDay(e.target.innerHTML);
      updateEvents(Number(e.target.innerHTML));
      activeDay = Number(e.target.innerHTML);
      //remove active
      days.forEach((day) => {
        day.classList.remove("active");
      });
      //if clicked prev-date or next-date switch to that month
      if (e.target.classList.contains("prev-date")) {
        prevMonth();
        //add active to clicked day afte month is change
        setTimeout(() => {
          //add active where no prev-date or next-date
          const days = document.querySelectorAll(".day");
          days.forEach((day) => {
            if (
              !day.classList.contains("prev-date") &&
              day.innerHTML === e.target.innerHTML
            ) {
              day.classList.add("active");
            }
          });
        }, 100);
      } else if (e.target.classList.contains("next-date")) {
        nextMonth();
        //add active to clicked day afte month is changed
        setTimeout(() => {
          const days = document.querySelectorAll(".day");
          days.forEach((day) => {
            if (
              !day.classList.contains("next-date") &&
              day.innerHTML === e.target.innerHTML
            ) {
              day.classList.add("active");
            }
          });
        }, 100);
      } else {
        e.target.classList.add("active");
      }
    });
  });
}

todayBtn.addEventListener("click", () => {
  today = new Date();
  month = today.getMonth();
  year = today.getFullYear();
  initCalendar();
});

dateInput.addEventListener("input", (e) => {
  dateInput.value = dateInput.value.replace(/[^0-9/]/g, "");
  if (dateInput.value.length === 2) {
    dateInput.value += "/";
  }
  if (dateInput.value.length > 7) {
    dateInput.value = dateInput.value.slice(0, 7);
  }
  if (e.inputType === "deleteContentBackward") {
    if (dateInput.value.length === 3) {
      dateInput.value = dateInput.value.slice(0, 2);
    }
  }
});

gotoBtn.addEventListener("click", gotoDate);

function gotoDate() {
  console.log("here");
  const dateArr = dateInput.value.split("/");
  if (dateArr.length === 2) {
    if (dateArr[0] > 0 && dateArr[0] < 13 && dateArr[1].length === 4) {
      month = dateArr[0] - 1;
      year = dateArr[1];
      initCalendar();
      return;
    }
  }
  alert("Invalid Date");
}

//function get active day day name and date and update eventday eventdate
function getActiveDay(date) {
  const day = new Date(year, month, date);
  const dayName = day.toString().split(" ")[0];
  eventDay.innerHTML = dayName;
  eventDate.innerHTML = date + " " + months[month] + " " + year;
}

//function update events when a day is active
function updateEvents(date) {
  const dbref=ref(db);
  let events="";
  get(child(dbref,updatedInput+"/"))
  .then((snapshot) => {
    if (snapshot.exists()) {
      console.log(snapshot.val());
      events=snapshot.val();
      console.log(events);
      if (events === "") {
        events = `<div class="no-event">
                <h3>No Events</h3>
            </div>`;
      }
      var total=0;
      for(var key in events){
        var event={
          Items:[
            {
            title:events[key].Particular,
            amt:events[key].Rate}
          ]}
        eventsContainer.innerHTML+=event.Items[0].title+":"+event.Items[0].amt+"/-<br>";
        total += parseInt(events[key].Rate);
      }
      eventsContainer.innerHTML += "<h3>Total:"+total+"/-</h3>";
    } else {
      eventsContainer.innerHTML="<h4>No Expenditure on this day</h4>";
    }
  }).catch((error) => {
    console.error(error);
  });
  eventsContainer.innerHTML = events;
  saveEvents();
}

//function to add event
addEventBtn.addEventListener("click", () => {
  addEventWrapper.classList.toggle("active");
});

addEventCloseBtn.addEventListener("click", () => {
  addEventWrapper.classList.remove("active");
});

document.addEventListener("click", (e) => {
  if (e.target !== addEventBtn && !addEventWrapper.contains(e.target)) {
    addEventWrapper.classList.remove("active");
  }
});

//allow 50 chars in eventtitle
addParticularName.addEventListener("input", (e) => {
  addParticularName.value = addParticularName.value.slice(0, 60);
});

// function defineProperty() {
//   var osccred = document.createElement("div");
//   osccred.innerHTML =
//     "A Project By <a href='https://www.youtube.com/channel/UCiUtBDVaSmMGKxg1HYeK-BQ' target=_blank>Open Source Coding</a>";
//   osccred.style.position = "absolute";
//   osccred.style.bottom = "0";
//   osccred.style.right = "0";
//   osccred.style.fontSize = "10px";
//   osccred.style.color = "#ccc";
//   osccred.style.fontFamily = "sans-serif";
//   osccred.style.padding = "5px";
//   osccred.style.background = "#fff";
//   osccred.style.borderTopLeftRadius = "5px";
//   osccred.style.borderBottomRightRadius = "5px";
//   osccred.style.boxShadow = "0 0 5px #ccc";
//   document.body.appendChild(osccred);
// }

// defineProperty();

//allow only time in eventtime from and to
/* addEventFrom.addEventListener("input", (e) => {
  addEventFrom.value = addEventFrom.value.replace(/[^0-9:]/g, "");
  if (addEventFrom.value.length === 2) {
    addEventFrom.value += ":";
  }
  if (addEventFrom.value.length > 5) {
    addEventFrom.value = addEventFrom.value.slice(0, 5);
  }
}); */


//function to add event to eventsArr
addEventSubmit.addEventListener("click", () => {
  const particularName = addParticularName.value;
  const particularRate = addParticularRate.value;
  if (particularName === "" || particularRate === "" || particularRate < 1) {
    alert("Please fill all the fields correctly");
    return;
  }
  console.log(eventsArr);
  updatedInput=cleanseDate(year, month + 1, activeDay);
  set(ref(db,updatedInput+"/"+particularName),{
    Particular:particularName,
    Rate:particularRate
  })
  .catch((error)=>{
    alert(error);
  })
  addEventWrapper.classList.remove("active");
  addParticularName.value = "";
  addParticularRate.value = "";
  updateEvents(activeDay);
  //select active day and add event class if not added
  const activeDayEl = document.querySelector(".day.active");
  if (!activeDayEl.classList.contains("event")) {
    activeDayEl.classList.add("event");
  }
});

//function to delete event when clicked on event
eventsContainer.addEventListener("click", (e) => {
  if (e.target.classList.contains("event")) {
    if (confirm("Are you sure you want to delete this event?")) {
      const eventTitle = e.target.children[0].children[1].innerHTML;
      eventsArr.forEach((event) => {
        if (
          event.day === activeDay &&
          event.month === month + 1 &&
          event.year === year
        ) {
          event.events.forEach((item, index) => {
            if (item.title === eventTitle) {
              event.events.splice(index, 1);
            }
          });
          //if no events left in a day then remove that day from eventsArr
          if (event.events.length === 0) {
            eventsArr.splice(eventsArr.indexOf(event), 1);
            //remove event class from day
            const activeDayEl = document.querySelector(".day.active");
            if (activeDayEl.classList.contains("event")) {
              activeDayEl.classList.remove("event");
            }
          }
        }
      });
      updateEvents(activeDay);
    }
  }
});

//function to save events in local storage
function saveEvents() {
  localStorage.setItem("events", JSON.stringify(eventsArr));
}

//function to get events from local storage
function getEvents() {
  //check if events are already saved in local storage then return event else nothing
  if (localStorage.getItem("events") === null) {
    return;
  }
  eventsArr.push(...JSON.parse(localStorage.getItem("events")));
}

function convertTime(time) {
  //convert time to 24 hour format
  let timeArr = time.split(":");
  let timeHour = timeArr[0];
  let timeMin = timeArr[1];
  let timeFormat = timeHour >= 12 ? "PM" : "AM";
  timeHour = timeHour % 12 || 12;
  time = timeHour + ":" + timeMin + " " + timeFormat;
  return time;
}