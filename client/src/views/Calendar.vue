<template>
<div class="calendar">
<header>
  <NavBar/>
</header>
<div v-if="!modify" class="container">
  <vue-scheduler :events="events" @event-created="saveEvents" @event-clicked="eventClicked"
  :event-dialog-config="dialogConfig" :event-display="eventDisplay"/>
</div>

<div v-else class="container">
  <div class="card border-primary mb-3 card text-center" style=" margin-left: 18%;
    margin-right: 18%; width: auto;">
    <form data-v-3d5c248f="">
    <header data-v-3d5c248f="" class="v-cal-dialog-card__header">
      <h5 data-v-3d5c248f="" class="v-cal-dialog__title">Event Information</h5>
    </header>
    <section data-v-3d5c248f="" class="v-cal-dialog-card__body">
      <div data-v-3d5c248f="" class="v-cal-fields">
        <div data-v-c7d534aa="" data-v-3d5c248f="" class="v-cal-input ">
          <label data-v-c7d534aa="" for="date">Date: </label>
          <input v-model="event.date" data-v-c7d534aa="" placeholder="Date"
            type="date" required="required" id="date">
        </div>
        <div data-v-3d5c248f="" class="v-cal-input-group">
          <label data-v-3d5c248f="">Times</label>
          <div data-v-c7d534aa="" data-v-3d5c248f="" class="v-cal-input ">
            <label data-v-c7d534aa="" for="startTime">Start Time: </label>
            <input v-model="event.startTime" data-v-c7d534aa="" placeholder="Start Time"
                type="time" required="required" id="startTime">
          </div>
          <div data-v-c7d534aa="" data-v-3d5c248f="" class="v-cal-input ">
            <label data-v-c7d534aa="" for="endTime">End Time: </label>
            <input v-model="event.endTime" data-v-c7d534aa="" placeholder="End Time"
            type="time" required="required" id="endTime">
          </div>
        </div>
        <div data-v-c7d534aa="" data-v-3d5c248f="" class="v-cal-input ">
          <label data-v-c7d534aa="" for="eventName">Event name: </label>
          <input v-model="event.eventName" data-v-c7d534aa="" placeholder="Event name"
          type="text" required="required" id="eventName">
        </div>
        <div data-v-c7d534aa="" data-v-3d5c248f="" class="v-cal-input ">
          <label data-v-c7d534aa="" for="comments">Comments: </label>
          <textarea v-model="event.comments" data-v-c7d534aa="" id="comments"
          name="comments" placeholder="comments" spellcheck="false"></textarea>
        </div>
      </div>
    </section>
    <footer data-v-3d5c248f="" class="v-cal-dialog-card__footer">
      <button type="submit" class="btn btn-info" @click="editEvent">Update Event</button>
      <button type="submit" class="btn btn-danger"
       @click.prevent="eventDelete">Delete Event</button>
      <button type="submit" class="btn btn-primary" @click="toggleCalendar">Close</button>
    </footer>
  </form>
</div>
</div>
  <Footer/>
</div>
</template>

<script>
import NavBar from '@/components/NavBar.vue';
import Footer from '@/components/Footer.vue';
import dates from '@/utils/dates';

const API_URL = `${process.env.VUE_APP_API_BASE_URL}event`;

// @ is an alias to /src
/* eslint no-underscore-dangle: 0 */
/* eslint-disable */
export default {
  name: 'Calendar',
  components: {
    NavBar,
    Footer,
  },
  data() {
    return {
      event: {
        userId: '',
        eventName: '',
        date: '',
        startTime: '',
        endTime: '',
        comments: '',
        _id: '',
      },
      events: [],
      modify: false,
      dialogConfig: {
        title: 'Create Event',
        createButtonLabel: 'Save Event',
        enableTimeInputs: true,
        fields: [
          {
            name: 'eventName',
            label: 'Event name',
            required: true,
          },
          {
            name: 'comments',
            type: 'textarea',
            label: 'comments',
          },
        ],
      },
    };
  },
  methods: {
    eventDisplay(event) {
      return event.eventName;
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
            fetch(`${API_URL}?eventId=${this.event._id}`, {
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
                  this.toggleCalendar();
                }
              });
          }
        },
      });
    },
    eventClicked(event) {
      console.log(event);
      this.event.eventName = event.eventName;
      this.event.startTime = event.startTime;
      this.event.date = dates.getEventFormattedDate(event.date);
      this.event.endTime = event.endTime;
      this.event.comments = event.comments;
      this.event._id = event._id;
      this.toggleCalendar();
    },
    toggleCalendar() {
      this.modify = !this.modify;
    },
    saveEvents(event) {
      this.event.userId = localStorage.getItem('userId');
      this.event.eventName = event.eventName;
      this.event.startTime = event.startTime;
      this.event.date = event.date;
      this.event.endTime = event.endTime;
      this.event.comments = event.comments;
      fetch(API_URL, {
        method: 'POST',
        body: JSON.stringify(this.event),
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
    editEvent() {
      this.modify = false;
      this.event.date = dates.formatDateForSaving(this.event.date);
      fetch(API_URL, {
        method: 'PATCH',
        body: JSON.stringify(this.event),
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
    fetchEvents() {
      fetch(`${API_URL}/events`, {
        method: 'POST',
        body: JSON.stringify({ userId: localStorage.getItem('userId') }),
        headers: {
          'content-type': 'application/json',
        },
      }).then((response) => response.json())
        .then((result) => {
          try {
            this.events = result;
          } catch (error) {
            console.log(error);
          }
        });
    },
  },
  mounted() {
    fetch(`${API_URL}/events`, {
      method: 'POST',
      body: JSON.stringify({ userId: localStorage.getItem('userId') }),
      headers: {
        'content-type': 'application/json',
      },
    }).then((response) => response.json())
      .then((result) => {
        try {
          this.events = result;
        } catch (error) {
          console.log(error);
        }
      });
  },
};
</script>
<style>

</style>
