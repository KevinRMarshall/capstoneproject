<template>
<div class="home">
<header>
  <NavBar/>
</header>
<div class="container">
   <div class="row">
          <div class="col-lg-4 d-flex flex-align-stretch">
            <div class="bs-component">
              <div class="card border-primary mb-3" style="max-width: 20rem;">
                <div class="card-header">My Calendar</div>
                <div class="card-body" style="padding: 5px;">
            </div>
             <div v-for="(day, i) in days" :key="i" class="card border-danger mb-1"
             style="margin: auto; width: 100%;">
              <div class="card-header" style="padding: 2px"><sup>{{week[i]}} </sup>{{days[i]}}</div>
              <div class="card-body" style="padding: 0.25rem;">
                <div v-for="event in weeklyEvents" :key="event._id">
                  <p v-if="formatDay(new Date(event.date).getDate()) === week[i]"
                class="card-text" style= "font-size: 10px;">
                {{event.startTime}}-{{event.endTime}} {{event.eventName}}</p>
                </div>
              </div>
            </div>
            <a href="/#/calendar" button type="button"
                  class="btn btn-secondary"><img
                  :src='require(`/src/assets/calendar.png`) '
                  height="36px" width="36px">View Your Calendar</a>
            </div>
            </div>
          </div>
          <!--2nd row-->
          <div class="col-lg-4 d-flex flex-align-stretch mb-3">
            <div class="bs-component">
              <div class="card border-primary mb-3 h-100" style="overflow-y: scroll;">
                <div class="card-header">Events</div>
                <div class="card-body" style = "padding: .50rem;">
                  <div v-for="(schoolEvent) in schoolEvents" :key="schoolEvent._id"
                  class="card border-info mb-3" style="max-width: 20rem; padding: 0.10rem;">
                    <div class="card-body">
                      <h4 class="card-title">{{getSchoolEventFormattedDate(schoolEvent.date)}}</h4>
                      <p class="card-text"><u>{{schoolEvent.title}}</u></p>
                      <p class="card-text">{{schoolEvent.starttime}}-{{schoolEvent.endtime}}</p>
                      <button type="button" class="btn btn-primary btn-sm"
                       data-toggle="modal" data-target="#myModal2"
                       @click="findEvent(schoolEvent._id)">View Details</button>
                    </div>
                  </div>
                </div>
              </div>
                <button v-if="isAdmin" type="button" class="btn btn-outline-info"
                 data-toggle="modal" data-target="#myModal"  @click="clearData">Add Event</button>
              </div>
          </div>
          <!--3rd row-->
          <div class="col-lg-4 d-flex flex-align-stretch">
            <SideBar/>
        </div>
    </div>

    <Footer/>
<div class="modal" id="myModal">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">Add Event</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
        <div v-if="errors.length" class="alert alert-dismissible alert-danger">
          <button type="button" class="close" data-dismiss="alert">&times;</button>
          <p v-for="error in errors" :key="error">
            {{error}}
          </p>
        </div>
        <div data-v-c7d534aa="" data-v-3d5c248f="" class="v-cal-input">
          <label data-v-c7d534aa="" for="title">Title: </label>
          <input v-model="schoolEvent.title" data-v-c7d534aa="" placeholder="title"
          type="text" required="required" id="title">
        </div>
        <br>
          <label for="date">Date: </label>
         <input v-model="schoolEvent.date" data-v-c7d534aa="" placeholder="Date"
            type="date" required="required" id="date">
         <br>
          <div data-v-3d5c248f="" class="v-cal-input-group">
          <label data-v-3d5c248f="">Times</label>
          <div data-v-c7d534aa="" data-v-3d5c248f="" class="v-cal-input ">
            <label data-v-c7d534aa="" for="starttime">Start Time: </label>
            <input v-model="schoolEvent.starttime" data-v-c7d534aa=""
                type="time" required="required" id="starttime">
          </div>
          <div data-v-c7d534aa="" data-v-3d5c248f="" class="v-cal-input ">
            <label data-v-c7d534aa="" for="endtime">End Time: </label>
            <input v-model="schoolEvent.endtime" data-v-c7d534aa=""
            type="time" required="required" id="endtime">
          </div>
        </div>
         <br>
        <div data-v-c7d534aa="" data-v-3d5c248f="" class="v-cal-input ">
          <label data-v-c7d534aa="" for="comments">Comments: </label>
          <textarea v-model="schoolEvent.content" data-v-c7d534aa="" id="comments"
          name="comments" placeholder="comments" spellcheck="false"></textarea>
        </div>
      </div>
      <div class="modal-footer">
        <button type="submit" class="btn btn-primary" @click.prevent="createEvent"
        data-dismiss="modal">Add Event</button>
        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
      </div>
    </div>
  </div>
</div>
<div class="modal" id="myModal2">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">Event Details</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
        <div v-if="isAdmin" class="">
          <div class="form-group row">
            <label for="title" class="col-sm-2 col-form-label">Title</label>
            <input v-model="schoolEvent.title" type="text"
            class="form-control-plaintext col-sm-10" id="" required>
          </div>
          <br>
          <div class="form-group row">
            <label for="date" class="col-sm-2 col-form-label">Date</label>
            <input v-model="schoolEvent.date" type="date"
            class="form-control-plaintext col-sm-10" id="" required>
          </div>
          <br>
          <label for="times" class="form-label">Times</label>
          <div class="form-group row">
            <label for="start" class="col-sm-2 col-form-label">Start:</label>
            <input v-model="schoolEvent.starttime" type="time"
            class="form-control-plaintext col-sm-4" id="" required>
            <label for="end" class="col-sm-2 col-form-label">End:</label>
            <input v-model="schoolEvent.endtime" type="time"
            class="form-control-plaintext col-sm-4" id="" required>
          </div>
          <br>
          <div class="form-group row">
            <label for="comments" class="col-sm-3 col-form-label">Comments</label>
            <textarea v-model="schoolEvent.content" spellcheck="false"
            class="form-control-plaintext col-sm-9" required/>
          </div>
          <br>
        </div>
        <div v-if="!isAdmin" class="">
          <div class="form-group row">
            <label for="title" class="col-sm-2 col-form-label">Title</label>
            <p>{{schoolEvent.title}}</p>
          </div>
          <br>
          <div class="form-group row">
            <label for="date" class="col-sm-2 col-form-label">Date</label>
            <p>{{getSchoolEventFormattedDate(schoolEvent.date)}}</p>
          </div>
          <br>
          <div class="form-group row">
            <label for="start" class="col-sm-2 col-form-label">Start:</label>
            <p>{{schoolEvent.starttime}}</p>
            <label for="end" class="col-sm-2 col-form-label">End:</label>
            <p>{{schoolEvent.endtime}}</p>
          </div>
          <div class="form-group row">
            <label for="comments" class="col-sm-3 col-form-label">Comments:</label>
            <br>
            <p id="comments">{{schoolEvent.content}}</p>
          </div>
          <br>
        </div>
      </div>
      <div class="modal-footer">
        <button v-if="isAdmin"  type="submit" class="btn btn-primary"  @click="editEvent"
        data-dismiss="modal">Edit Event</button>
        <button v-if="isAdmin" type="submit" class="btn btn-danger" @click="eventDelete"
        data-dismiss="modal">Delete Event</button>
        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
      </div>
    </div>
  </div>
</div>
</div>
</div>
</template>

<script>
import NavBar from '@/components/NavBar.vue';
import Footer from '@/components/Footer.vue';
import SideBar from '@/components/SideBar.vue';
import dates from '@/utils/dates';
import admin from '@/utils/admin';

const API_URL = `${process.env.VUE_APP_API_BASE_URL}schoolevents`;
const API_EVENT = `${process.env.VUE_APP_API_BASE_URL}event`;

// @ is an alias to /src
/* eslint no-underscore-dangle: 0 */
/* eslint-disable */
export default {
  name: 'Home',
  components: {
    NavBar,
    Footer,
    SideBar,
  },
  data: () => ({
    schoolEvent: {
      title: '',
      content: '',
      date: '',
      starttime: '',
      endtime: '',
      _id: '',
    },
    schoolEvents:[],
    week:[],
    weeksFormated:[],
    weeklyEvents:[],
    days: ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'],
    isAdmin: false,
    errors: [],
  }),
  methods: {
    validEvent() {
      this.errors = [];
      if (this.schoolEvent.title.length < 3) {
        this.errors.push('Title length must be longer than 3 characters.');
      }
      if (this.schoolEvent.starttime === '' || this.schoolEvent.endtime === '') {
        this.errors.push('Start time must not be empty.');
      }
      if (this.schoolEvent.date == '') {
        this.errors.push('Date must not be empty.');
      }

      if(this.errors.length > 0) {
        return false;
      } else {
        return true;
      }
    },
    createEvent() {
      if (!this.validEvent()) {
        return;
      }
      this.schoolEvent.program = localStorage.programId;
      fetch(API_URL, {
        method: 'POST',
        body: JSON.stringify(this.schoolEvent),
        headers: {
          'content-type': 'application/json',
        },
      })
        .then((response) => response.json())
        .then((result) => {
          if (result.details) {
            const error = result.details.map((detail) => detail.message).join('. ');
            this.error = error;
          } else {
            this.fetchEvents();
          }
        });
    },
    getSchoolEventFormattedDate(date) {
    return dates.getSchoolEventFormattedDate(date);
    },
    editEvent() {
      this.modify = false;
      this.schoolEvent.date = dates.formatSchoolEventDateForSaving(this.schoolEvent.date);
      fetch(API_URL, {
        method: 'PATCH',
        body: JSON.stringify(this.schoolEvent),
        headers: {
          'content-type': 'application/json',
        },
      })
        .then((response) => response.json())
        .then((result) => {
          if (result.details) {
            const error = result.details.map((detail) => detail.message).join('. ');
            this.error = error;
          } else {
            this.fetchEvents();
            this.error = '';
          }
        });
    },
    eventDelete() {
      this.$confirm({
        message: 'Are you sure you want to delete your event?',
        button: {
          no: 'Cancel',
          yes: 'Yes',
        },
        callback: (confirm) => {
          if (confirm) {
            console.log('deleting process');
            fetch(`${API_URL}?eventId=${this.schoolEvent._id}`, {
              method: 'DELETE',
              headers: {
                'content-type': 'application/json',
              },
            })
              .then((response) => response.json())
              .then((result) => {
                if (result.details) {
                  const error = result.details.map((detail) => detail.message).join('. ');
                  this.error = error;
                } else {
                  this.fetchEvents();
                }
              });
          }
        },
      });
    },
    findEvent(id) {
      fetch(`${API_URL}/findevent`, {
        method: 'POST',
        body: JSON.stringify({ id: id }),
        headers: {
          'content-type': 'application/json',
        },
      }).then((response) => response.json())
        .then((result) => {
          try {
            this.schoolEvent = result;
            this.schoolEvent.date = dates.getSchoolEventEditDate(result.date);
          } catch (error) {
            console.log(error);
          }
        });
    },
    fetchEvents() {
      fetch(`${API_URL}/schoolevents`, {
        method: 'POST',
        body: JSON.stringify({ program: localStorage.programId }),
        headers: {
          'content-type': 'application/json',
        },
      }).then((response) => response.json())
        .then((result) => {
          try {
            this.schoolEvents = result;
          } catch (error) {
            console.log(error);
          }
        });
    },
    formatDay(n) {
      return dates.formatDay(n);
    },
     clearData() {
      this.schoolEvent.title =''
      this.schoolEvent.date =''
      this.schoolEvent.starttime =''
      this.schoolEvent.endtime =''
      this.schoolEvent.content =''
      this.schoolEvent._id =''
    },
  },
    mounted() {
    fetch(`${API_URL}/schoolevents`, {
      method: 'POST',
      body: JSON.stringify({ program: localStorage.programId }),
      headers: {
        'content-type': 'application/json',
      },
    }).then((response) => response.json())
      .then((result) => {
        try {
          this.schoolEvents = result;
        } catch (error) {
          console.log(error);
        }
      });
      admin.isAdmin(localStorage.userId).then((result) => {
      this.isAdmin = result;
    }).catch(() => {});
    this.week = dates.getCurrentWeek();
    this.weeksFormated = dates.getCurrentWeekFormated();
      fetch(`${API_EVENT}/frontevents?userId=${localStorage.getItem('userId')}
      &startdate=${new Date(this.weeksFormated[0]).toString()}&enddate=${new Date(this.weeksFormated[6]).toString()}`)
      .then((response) => response.json())
      .then((result) => {
        this.weeklyEvents = result;
      });
  },
};
</script>
