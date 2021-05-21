<template>
<div>
<header>
  <NavBar/>
</header>
<body>
    <div class="container">
    <h1 style="text-align:center">Report Page - Admins Only</h1>
    <h4 style="text-align:center">If you are seeing this as a regular user, please let us know.</h4>
    <hr class="my-4">
    <!--thread display section -->
    <div class="row">
    <div class="col-lg-8">
    <div v-if="threads.length === 0 && replies.length === 0">
      <h1 class="text-center">No reports to handle</h1>
    </div>
    <div v-if="threads.length">
      <div class="card border-info mb-3">
        <div class="card-header">{{threads[index].title}}</div>
        <div class="card-body">
          <p class="card-text">{{threads[index].displayName}}
          <span class="float-right small">{{getFormattedDate(threads[index].dateCreated)}}</span>
          </p>
          <div v-html="threads[index].content"></div>
        </div>
      </div>
      <div class="mb-3 text-danger">Total Reports: {{threads[index].reports.length}}</div>
      <div v-for="(report, i) in threads[index].reports" :key="i">
        <div v-if="report.content" class="card border-danger mb-3">
          <div class="card-body">
            <div>{{report.content}}</div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="threads.length === 0 && replies.length">
      <div class="card border-warning mb-3">
        <div class="card-body">
          <p class="card-text">{{replies[index].displayName}}
          <span class="float-right small">{{getFormattedDate(replies[index].dateCreated)}}</span>
          </p>
          <div v-html="replies[index].content"></div>
        </div>
      </div>
      <div class="mb-3 text-danger">Total Reports: {{replies[index].reports.length}}</div>
        <div v-for="(report, i) in replies[index].reports" :key="i">
          <div v-if="report.content" class="card border-danger mb-3">
            <div class="card-body">
              <div>{{report.content}}</div>
            </div>
          </div>
        </div>
    </div>
    <div v-if="threads.length !== 0 || replies.length !== 0" class="d-flex justify-content-center">
      <button class="btn btn-primary btn-success" @click.prevent="approve()">Approve</button>
      <button class="btn btn-primary btn-danger ml-2" @click.prevent="remove()">Delete</button>
    </div>
    </div>
    <div class="col-lg-4">
        <SideBar/>
    </div>
    </div>
    </div>
    </body>
    <Footer/>
</div>
</template>
<script>
import NavBar from '@/components/NavBar.vue';
import Footer from '@/components/Footer.vue';
import SideBar from '@/components/SideBar.vue';
import dates from '@/utils/dates';
import admin from '@/utils/admin';

const API_URL = `${process.env.VUE_APP_API_BASE_URL}report/`;
const DELETE_URL = `${process.env.VUE_APP_API_BASE_URL}forum`;
const APPROVE_URL = `${API_URL}approve`;

/* eslint no-underscore-dangle: 0 */
export default {
  name: 'report',
  components: {
    NavBar,
    Footer,
    SideBar,
  },
  data: () => ({
    threads: {},
    replies: {},
    index: 0,
    type: '',
  }),
  methods: {
    approve() {
      let url = APPROVE_URL;
      if (this.type === 'thread') {
        url = `${url}?threadId=${this.threads[this.index]._id}`;
      } else {
        url = `${url}?replyId=${this.replies[this.index]._id}`;
      }
      fetch(url, {
        method: 'PATCH',
        headers: {
          'content-type': 'application/json',
        },
      }).then((response) => response.json())
        .then(() => {
          this.nextReport();
        });
    },
    remove() {
      let url = DELETE_URL;
      if (this.type === 'thread') {
        url = `${url}?threadId=${this.threads[this.index]._id}`;
      } else {
        url = `${url}/thread?replyId=${this.replies[this.index]._id}`;
      }
      fetch(url, {
        method: 'DELETE',
        headers: {
          'content-type': 'application/json',
        },
      }).then((response) => response.json())
        .then(() => {
          this.nextReport();
        });
    },
    nextReport() {
      if (this.type === 'thread') {
        this.threads.splice(this.index, 1);
      } else {
        this.replies.splice(this.index, 1);
      }

      if (this.threads.length > 0) {
        this.type = 'thread';
      } else {
        this.type = 'reply';
      }

      this.index = 0;
    },
    fetchThreads() {
      fetch(API_URL).then((response) => response.json()).then((result) => {
        this.threads = result.threads;
        this.replies = result.replies;

        if (this.threads.length) {
          this.type = 'thread';
        } else {
          this.type = 'reply';
        }
      });
    },
    getFormattedDate(date) {
      return dates.getFormattedDate(date);
    },
  },
  mounted() {
    admin.isAdmin(localStorage.getItem('userId')).then((result) => {
      if (!result) {
        this.$router.push({ name: 'Home' });
      }
      this.fetchThreads();
    }).catch(() => {});
  },
};
</script>
