// this class will hold utilities that are needed more than once

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const lMonths = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
// formats a date
function getFormattedDate(date) {
  const time = new Date(date);
  return `${this.addZero((months[time.getMonth()]))} ${this.addZero(time.getDate())}, ${time.getFullYear()}
  ${this.addZero(time.getHours())}:${this.addZero(time.getMinutes())}:${this.addZero(time.getSeconds())}`;
}
// return 0 + 1-9 to make it 2 digits, for example 9 becomes 09
function addZero(n) {
  if (n <= 9) {
    return `0${n}`;
  }
  return n;
}

function formatDay(n) {
  if (n <= 9) {
    return `0${n}`;
  }
  return `${n}`;
}

function getFeedFormattedDate(date) {
  const time = new Date(date);
  return `${this.addZero((lMonths[time.getMonth()]))} ${this.addZero(time.getDate())}, ${time.getFullYear()}`;
}

function getEventFormattedDate(date) {
  const time = new Date(date);
  return `${time.getFullYear()}-${this.addZero((time.getMonth() + 1))}-${this.addZero(time.getDate())}`;
}

function formatDateForSaving(date) {
  const time = new Date(date);
  return `${time.getFullYear()}-${this.addZero((time.getMonth() + 1))}-${this.addZero(time.getDate() + 1)}T04:00:00.000+00:00`;
}

function getSchoolEventFormattedDate(date) {
  const time = new Date(date);
  return `${this.addZero((months[time.getMonth()]))} ${this.addZero(time.getDate())}, ${time.getFullYear()}`;
}

function getSchoolEventEditDate(date) {
  const time = new Date(date);
  return `${time.getFullYear()}-${this.addZero((time.getMonth() + 1))}-${this.addZero(time.getDate() + 1)}`;
}

function formatSchoolEventDateForSaving(date) {
  const time = new Date(date);
  return `${time.getFullYear()}-${this.addZero((time.getMonth() + 1))}-${this.addZero(time.getDate())}T04:00:00.000+00:00`;
}

// function getCurrentDay(date) {
//   let day;
//   switch (date.getDay()) {
//     case 0:
//       day = 'Sunday';
//       break;
//     case 1:
//       day = 'Monday';
//       break;
//     case 2:
//       day = 'Tuesday';
//       break;
//     case 3:
//       day = 'Wednesday';
//       break;
//     case 4:
//       day = 'Thursday';
//       break;
//     case 5:
//       day = 'Friday';
//       break;
//     case  6:
//       day = 'Saturday';
//       break;
//     default:
//       day = 'ERROR';
//       break;
//   }
//   return day;
// }

function getCurrentWeek() {
  let i = 0;
  const currentDate = new Date();
  const previousMonday = new Date();
  const week = [];
  switch (currentDate.getDay()) {
    case 0:
      previousMonday.setDate(previousMonday.getDate() - 6);
      break;
    case 1:
      previousMonday.setDate(previousMonday.getDate());
      break;
    case 2:
      previousMonday.setDate(previousMonday.getDate() - 1);
      break;
    case 3:
      previousMonday.setDate(previousMonday.getDate() - 2);
      break;
    case 4:
      previousMonday.setDate(previousMonday.getDate() - 3);
      break;
    case 5:
      previousMonday.setDate(previousMonday.getDate() - 4);
      break;
    case 6:
      previousMonday.setDate(previousMonday.getDate() - 5);
      break;
    default:
      break;
  }
  while (i < 7) {
    week.push(`${this.addZero(previousMonday.getDate())}`);
    previousMonday.setDate(previousMonday.getDate() + 1);
    i += 1;
  }

  return week;
}
function getCurrentWeekFormated() {
  let i = 0;
  const currentDate = new Date();
  const previousMonday = new Date();
  const week = [];
  switch (currentDate.getDay()) {
    case 0:
      previousMonday.setDate(previousMonday.getDate() - 6);
      break;
    case 1:
      previousMonday.setDate(previousMonday.getDate());
      break;
    case 2:
      previousMonday.setDate(previousMonday.getDate() - 1);
      break;
    case 3:
      previousMonday.setDate(previousMonday.getDate() - 2);
      break;
    case 4:
      previousMonday.setDate(previousMonday.getDate() - 3);
      break;
    case 5:
      previousMonday.setDate(previousMonday.getDate() - 4);
      break;
    case 6:
      previousMonday.setDate(previousMonday.getDate() - 5);
      break;
    default:
      break;
  }
  while (i < 7) {
    week.push(`${previousMonday.getFullYear()}-${this.addZero((previousMonday.getMonth() + 1))}-${this.addZero(previousMonday.getDate())}T04:00:00.000+00:00`);
    previousMonday.setDate(previousMonday.getDate() + 1);
    i += 1;
  }
  return week;
}

module.exports = {
  addZero,
  getFormattedDate,
  getEventFormattedDate,
  formatDateForSaving,
  getSchoolEventFormattedDate,
  getSchoolEventEditDate,
  formatSchoolEventDateForSaving,
  getCurrentWeek,
  getFeedFormattedDate,
  getCurrentWeekFormated,
  formatDay,
};
