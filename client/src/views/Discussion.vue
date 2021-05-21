<template>
<div class="discussion">
<header>
  <NavBar/>
</header>
<body>
    <div class="container">
    <h1 style="text-align:center">
      {{this.title}}</h1>
    <h4 style="text-align:center">{{this.subtitle}}</h4>
    <hr class="my-4">
    <!--create thread section -->
    <div v-if="modifying && !reporting">
      <div v-if="errors.length">
        <div class="alert alert-danger">
          <p v-for="error in errors" :key="error">{{error}}</p>
        </div>
      </div>
      <form class="container">
        <div class="form-group">
          <label for="title">Thread Title</label>
          <input v-model="thread.title" type="textbox" class="form-control" id="threadTitle"
          aria-describedby="threadTitle" placeholder="Please enter a thread title">
        </div>
        <div class="form-group">
          <label for="content">Thread Body</label>
          <vue-editor v-model="thread.content"></vue-editor>
        </div>
        <button class="btn btn-primary mr-2" @click.prevent="modifyThread()">Submit Thread</button>
        <button class="btn btn-primary" @click="getEditMode()">Cancel</button>
        <button v-if="edit" class="btn btn-danger float-right"
        @click="deleteThread()">Delete</button>
        <hr class="my-4">
      </form>
    </div>
    <!--thread display section -->
    <div class="row" v-if="!modifying && !reporting">
    <div class="col-lg-8">
      <div class="row">
        <div v-if="isAdmin === true || discussion !== 'services'" class="col-sm-6">
          <button class="btn btn-primary" @click="getEditMode()">Create New Thread</button>
        </div>
        <div class="col-sm-6">
          <input v-model="search" type="textbox" class="form-control"
              aria-describedby="search by title" placeholder="Search..."
              v-on:change="fetchThreads()">
        </div>
        </div>
    <div class="list-unstyled mt-3" v-for="(thread) in threads" v-bind:key="thread._id">
      <li>
        <div v-if="thread.reports.length < 3"
        class="card border-info mb-3">
            <div class="card-header font-weight-bold">{{thread.title}}</div>
            <div class="card-body">
                <p class="card-text"><a :href="'/#/profile?userId=' + thread.userId">
                {{thread.displayName}}</a>
                <span class="small float-right">{{getFormattedDate(thread.dateCreated)}}
                  </span></p>
                <hr class="mb-4">
                <div v-html="thread.content" class="card-text text-truncate">
                </div>
                <a :href="'/#/thread?threadId=' + thread._id"
                class="btn btn-sm btn-outline-info mt-3 float-right">View Thread</a>
            </div>
        </div>
      </li>
    </div>
    <div v-if="threadCount > (threadCount / perPage)">
      <ul class="pagination">
        <div class="pagination" v-for="page in totalPages" :key="page">
        <li v-if="page == 1" class="page-item">
          <button class="page-link" @click="switchPage(discussion, curPage - 1)">&laquo;</button>
        </li>
        <li v-if="page == curPage" class="page-item active">
          <button class="page-link" @click="switchPage(discussion, page)">{{page}}</button>
        </li>
        <li v-else class="page-item">
          <button class="page-link" @click="switchPage(discussion, page)">{{page}}</button>
        </li>
        <li v-if="page == totalPages" class="page-item">
          <button class="page-link" @click="switchPage(discussion, curPage + 1)">&raquo;</button>
        </li>
        </div>
      </ul>
    </div>
    </div>
    <div class="col-lg-4">
        <SideBar ref="sidebar"/>
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
import { VueEditor } from 'vue2-editor';

const API_URL = `${process.env.VUE_APP_API_BASE_URL}forum`;
let params = '';
let feed;

// @ is an alias to /src
/* eslint no-underscore-dangle: 0 */
export default {
  name: 'discussion',
  components: {
    NavBar,
    Footer,
    SideBar,
    VueEditor,
  },
  data: () => ({
    errors: [],
    title: '',
    subtitle: '',
    discussion: '',
    threads: [],
    report: {
      content: '',
    },
    thread: {
      id: '',
      eventDate: '',
      discussion: '',
      title: '',
      content: '',
      userId: '',
      programId: '',
    },
    modifying: false,
    edit: false,
    userId: '',
    isAdmin: false,
    curIndex: 0,
    curThreadId: '',
    search: '',
    threadCount: 0,
    perPage: 0,
    curPage: 0,
    totalPages: 0,
    reporting: false,
  }),
  methods: {
    switchPage(page, n) {
      this.discussion = page;

      if (n < 1) {
        this.curPage = 1;
      } else if (n > parseInt(this.threadCount / this.perPage, 10) + 1) {
        this.curPage = parseInt(this.threadCount / this.perPage, 10) + 1;
      } else {
        this.curPage = n;
      }

      switch (page) {
        case 'help':
          this.title = 'Welcome to the help discussion forum!';
          this.subtitle = 'Here you will find help with your questions!';
          break;
        case 'share':
          this.title = 'Welcome to the share resources forum!';
          this.subtitle = 'Here you can share tools and tips to help fellow students!';
          break;
        case 'study':
          this.title = 'Welcome to the study group discussion forum!';
          this.subtitle = 'Here you will find assistance forming groups!';
          break;
        case 'services':
          this.title = 'Welcome to the student services forum!';
          this.subtitle = 'Here you will find a collection of services the college provides!';
          break;
        default:
          this.$router.push({ path: '/home' });
          break;
      }
      this.fetchThreads();
    },
    formToggle(report) {
      if (report) this.reporting = false;
      this.modifying = !this.modifying;
    },
    getEditMode(idToEdit, threadId) {
      if (idToEdit != null && idToEdit !== '') {
        this.curIndex = idToEdit;
        this.curThreadId = threadId;
        this.thread.content = this.threads[idToEdit].content;
        this.thread.title = this.threads[idToEdit].title;
        this.thread.id = threadId;
        this.edit = true;
      } else {
        this.thread.content = '';
        this.thread.title = '';
        this.thread.id = '';
        this.edit = false;
      }
      this.formToggle();
    },
    modifyThread() {
      if (!this.validate()) {
        return;
      }
      this.thread.userId = localStorage.userId;
      this.thread.programId = localStorage.programId;
      this.thread.discussion = this.discussion;
      let httpMethod = '';
      let reqBody;

      if (this.edit) {
        httpMethod = 'PATCH';
        reqBody = JSON.stringify({
          threadId: this.thread.id,
          title: this.thread.title,
          content: this.thread.content,
        });
      } else {
        httpMethod = 'POST';
        reqBody = JSON.stringify(this.thread);
      }

      fetch(API_URL, {
        method: httpMethod,
        body: reqBody,
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
            this.error = '';
            this.formToggle();
            if (!this.edit) {
              const date = new Date();
              const link = `${process.env.VUE_APP_BASE_URL}thread?threadId=${result._id}`;
              feed.createFeed(this.userId, this.thread.title, date, link, localStorage.programId);
              this.fetchThreads();
            } else {
              this.$set(this.threads, this.curIndex, result);
            }
          }
        });
    },
    validate() {
      let valid = true;
      this.errors = [];

      if (this.thread.title.length < 3 || this.thread.title.length > 100) {
        this.errors.push('Title must be between 3 and 100 characters.');
        valid = false;
      }
      if (this.thread.content.length < 3 || this.thread.content.length > 5000) {
        this.errors.push('Body must be between 3 and 5000 characters.');
        valid = false;
      }

      return valid;
    },
    fetchThreads() {
      if (this.discussion === 'report') {
        params = `?discussion=reports&page=${this.curPage}&search=${this.search}`;
      } else {
        params = `?discussion=${this.discussion}&program=${localStorage.programId}&page=${this.curPage}&search=${this.search}`;
      }
      fetch(API_URL + params).then((response) => response.json()).then((result) => {
        this.threads = result.threads;
        this.threadCount = result.count;
        this.perPage = result.perPage;
        if (parseInt(this.threadCount % this.perPage, 10) !== 0) {
          this.totalPages = parseInt(this.threadCount / this.perPage, 10) + 1;
        } else {
          this.totalPages = parseInt(this.threadCount / this.perPage, 10);
        }
      });
    },
    getFormattedDate(date) {
      return dates.getFormattedDate(date);
    },
    addZero(n) {
      return dates.addZero(n);
    },
  },
  mounted() {
    this.switchPage(this.$route.query.forum, 1);
    this.userId = localStorage.userId;
    admin.isAdmin(this.userId).then((result) => {
      this.isAdmin = result;
    }).catch(() => {});
    feed = this.$refs.sidebar.$refs.feed;
  },
  watch: {
    $route(page) {
      this.switchPage(page.query.forum);
    },
  },
};
</script>
