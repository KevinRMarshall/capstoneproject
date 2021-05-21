<template>
<div class="discussion">
<header>
  <NavBar ref="navbar"/>
</header>
<body>
<div class="container">
  <h1 v-if="thread !== null" style="text-align:center">Discussion - {{this.thread.title}}</h1>
  <hr class="my-4">
  <!--comments display section -->
  <div class="row">
      <!--thread create section -->
    <div class="col-lg-8" v-if="display.editThread">
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
        <button class="btn btn-primary mr-2" v-on:click.prevent="editThread()">Update</button>
        <button class="btn btn-primary" v-on:click="toggleDisplay()">Cancel</button>
        <button class="btn btn-danger float-right"
        v-on:click.prevent="deleteThread()">Delete</button>
        <hr class="my-4">
      </form>
    </div>
    <!--report create section -->
    <div class="col-lg-8" v-if="display.reporting">
      <form class="container">
        <div class="form-group">
          <label for="title">Content (optional)</label>
          <textarea v-model="report.content" type="textbox" class="form-control"
          aria-describedby="reportContent" placeholder="why are you reporting this thread...">
          </textarea>
        </div>
        <button class="btn btn-danger mr-2" @click.prevent="createReport()">Report</button>
        <button class="btn btn-primary" @click="toggleDisplay()">Cancel</button>
        <hr class="my-4">
      </form>
    </div>
    <div class="col-lg-8" v-if="thread !== null && display.viewing">
      <div class="card border-info mb-3">
        <div class="card-header">
          <div class="row">
            <div class="col-sm-10">{{this.thread.title}}</div>
            <div class="col-sm-2 text-right">
              <a v-if="thread.userId != userId && thread.discussion != 'services'"
              class="text-danger small" v-on:click="addReport()">Report</a>
              <a v-if="thread.userId == userId || (thread.discussion == 'services' && isAdmin)"
              v-on:click="toggleDisplay('editThread')">edit</a>
            </div>
          </div>
        </div>
        <div class="card-body">
          <div class="row">
            <div class="col-sm-8">
              <p class="card-text"><a :href="`${threadUrl}${this.thread.userId}`">
                {{this.thread.displayName}}</a></p>
            </div>
            <div class="col-sm-4 text-right">
              <span class="small">{{getFormattedDate(this.thread.dateCreated)}}</span>
            </div>
          </div>
          <div class="card-text" v-html="this.thread.content"></div>
          <button v-if="isAdmin == true || this.thread.discussion !== 'services'"
          class="btn btn-sm btn-outline-info float-right" @click="toggleReply()">Reply</button>
        </div>
      </div>
      <!-- create reply section (under thread) -->
      <div v-if="display.replying">
        <div v-if="errors.length" class="alert alert-danger">
          <p v-for="error in errors" :key="error">{{error}}</p>
        </div>
        <div class="form-group px-4">
          <label for="content">Reply To Thread</label>
          <vue-editor class="mb-2" v-model="reply.content"></vue-editor>
          <button class="btn btn-outline-info mr-3" @click="createReply()">Reply</button>
          <button class="btn btn-outline-info" @click="toggleDisplay()">Cancel</button>
          <button v-if="edit"
          class="btn btn-outline-danger float-right" @click="deleteReply()">Delete</button>
        </div>
      </div>
      <div class="px-4" v-if="replys.length > 0 && !display.replying">
        <div v-for="(reply, i) in replys" :key="reply._id">
          <div class="card border-warning mb-3" v-if="reply.reports.length < 3">
            <div class="card-body">
              <p class="card-text">
                <a :href="`${threadUrl}${reply.userId}`">{{reply.displayName}}</a>
                <span class="float-right small">{{getFormattedDate(reply.dateCreated)}}</span></p>
              <hr class="mb-3"/>
              <a v-if="reply.userId == userId" class="float-right small"
              @click="toggleReply(true, i, reply._id)">edit</a>
              <a v-else class="float-right text-danger small"
              v-on:click="addReport(reply._id, 'reply')">Report</a>
              <div class="card-text" v-html="reply.content"></div>
            </div>
          </div>
        </div>
      </div>
      <div v-if="replyCount > (replyCount / perPage)">
          <ul class="pagination">
            <div class="pagination" v-for="page in totalPages" :key="page">
            <li v-if="page == 1" class="page-item">
              <button class="page-link" @click="switchPage(curPage - 1)">&laquo;</button>
            </li>
            <li v-if="page == curPage" class="page-item active">
              <button class="page-link" @click="switchPage(page)">{{page}}</button>
            </li>
            <li v-else class="page-item">
              <button class="page-link" @click="switchPage(page)">{{page}}</button>
            </li>
            <li v-if="page == totalPages" class="page-item">
              <button class="page-link" @click="switchPage(curPage + 1)">&raquo;</button>
            </li>
            </div>
          </ul>
      </div>
    </div>
    <div class="col-lg-8" v-if="thread === null">
      <h1>Thread not found.</h1>
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
import { VueEditor } from 'vue2-editor';
import dates from '@/utils/dates';
import admin from '@/utils/admin';

const API_URL = `${process.env.VUE_APP_API_BASE_URL}forum/thread`;
let alert;
// @ is an alias to /src
/* eslint no-underscore-dangle: 0 */
export default {
  name: 'thread',
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
    image: '',
    threadId: '',
    curReportId: '',
    reportType: '',
    report: {
      content: '',
    },
    thread: {},
    replys: [],
    reply: {
      content: '',
      userId: '',
      threadId: '',
    },
    display: {
      replying: false,
      reporting: false,
      viewing: true,
      editThread: false,
    },
    edit: false,
    userId: '',
    curReplyId: '',
    curIndex: 0,
    replyCount: 0,
    perPage: 0,
    curPage: 0,
    totalPages: 0,
    isAdmin: false,
    threadUrl: `${process.env.VUE_APP_BASE_URL}profile?userId=`,
  }),
  methods: {
    toggleReply(e, i, id) {
      if (e !== null && e === true) {
        this.edit = true;
        this.curReplyId = id;
        this.curIndex = i;
      } else {
        this.edit = false;
      }

      if (this.edit) {
        this.reply.content = this.replys[i].content;
      } else {
        this.reply.content = '';
      }

      this.toggleDisplay('replying');
    },
    toggleDisplay(d) {
      this.display.replying = false;
      this.display.reporting = false;
      this.display.viewing = false;
      this.display.editThread = false;

      switch (d) {
        case 'replying':
          this.display.replying = true;
          this.display.viewing = true;
          break;
        case 'reporting':
          this.display.reporting = true;
          break;
        case 'editThread':
          this.display.editThread = true;
          break;
        default:
          this.display.viewing = true;
          break;
      }
    },
    createReply() {
      if (!this.validate()) {
        return;
      }

      this.reply.userId = localStorage.userId;
      this.reply.threadId = this.threadId;
      let httpMethod = '';
      let reqBody;

      if (this.edit) {
        httpMethod = 'PATCH';
        reqBody = JSON.stringify({
          content: this.reply.content,
          replyId: this.curReplyId,
        });
      } else {
        httpMethod = 'POST';
        reqBody = JSON.stringify(this.reply);
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
            if (!this.edit) {
            // POST REPLY
              alert.createAlert(
                this.thread.userId,
                `${result.displayName} has replied to your thread - ${this.thread.title}`,
                `${process.env.VUE_APP_BASE_URL}thread?threadId=${this.thread._id}`,
                this.userId,
              );
              this.fetchReplys();
            } else {
              this.$set(this.replys, this.curIndex, result);
            }
            this.toggleDisplay();
          }
        });
    },
    deleteReply() {
      this.$confirm({
        message: 'Are you sure you want to delete your reply?',
        button: {
          no: 'Cancel',
          yes: 'Yes',
        },
        callback: (confirm) => {
          if (confirm) {
            fetch(`${API_URL}?replyId=${this.curReplyId}`, {
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
                  this.fetchReplys();
                  this.toggleDisplay();
                }
              });
          }
        },
      });
    },
    validate() {
      let valid = true;
      this.errors = [];

      if (this.reply.content.length < 1 || this.reply.content.length > 500) {
        this.errors.push('Reply content must be between 1 and 500 characters.');
        valid = false;
      }

      return valid;
    },
    validateThread() {
      let valid = true;
      this.errors = [];

      if (this.thread.title.length < 3 || this.thread.title.length > 100) {
        this.errors.push('Title must be between 3 and 100 characters.');
        valid = false;
      }
      if (this.thread.content.length < 3 || this.thread.content.length > 3000) {
        this.errors.push('Body must be between 3 and 3000 characters.');
        valid = false;
      }
      return valid;
    },
    editThread() {
      if (!this.validateThread()) {
        return;
      }

      fetch(`${process.env.VUE_APP_API_BASE_URL}forum`, {
        method: 'PATCH',
        body: JSON.stringify({
          threadId: this.thread._id,
          title: this.thread.title,
          content: this.thread.content,
        }),
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
            this.toggleDisplay();
          }
        });
    },
    deleteThread() {
      this.$confirm({
        message: 'Are you sure you want to delete your post?',
        button: {
          yes: 'Yes',
          no: 'Cancel',
        },
        callback: (confirm) => {
          if (confirm) {
            const url = `${process.env.VUE_APP_API_BASE_URL}forum?threadId=${this.threadId}`;
            fetch(url, {
              method: 'DELETE',
              headers: {
                'content-type': 'application/json',
              },
            })
              .then((response) => response.json())
              .then(() => {
                this.$router.push({ name: 'Discussion', query: { forum: this.thread.discussion } });
              });
          }
        },
      });
    },
    getFormattedDate(date) {
      return dates.getFormattedDate(date);
    },
    addZero(n) {
      return dates.addZero(n);
    },
    switchPage(n) {
      if (n < 1) {
        this.curPage = 1;
      } else if (n > parseInt(this.replyCount / this.perPage, 10) + 1) {
        this.curPage = parseInt(this.replyCount / this.perPage, 10) + 1;
      } else {
        this.curPage = n;
      }
      this.fetchReplys();
    },
    fetchReplys() {
      const url = `${API_URL}?threadId=${this.threadId}&page=${this.curPage}`;
      fetch(url).then((response) => response.json()).then((result) => {
        this.thread = result.thread;
        this.replys = result.replys;
        this.replyCount = result.replyCount;
        this.perPage = result.perPage;
        if (parseInt(this.replyCount % this.perPage, 10) !== 0) {
          this.totalPages = parseInt(this.replyCount / this.perPage, 10) + 1;
        } else {
          this.totalPages = parseInt(this.replyCount / this.perPage, 10);
        }
      });
    },
    addReport(id, type) {
      if (!id) {
        this.curReportId = this.threadId;
        this.reportType = 'thread';
      } else {
        this.curReportId = id;
        this.reportType = type;
      }
      this.toggleDisplay('reporting');
    },
    createReport() {
      let url = '';
      let report = {};

      if (this.reportType === 'thread') {
        url = `${process.env.VUE_APP_API_BASE_URL}report/thread`;
        report = {
          userId: localStorage.userId,
          content: this.report.content,
          threadId: this.curReportId,
        };
      } else {
        url = `${process.env.VUE_APP_API_BASE_URL}report/reply`;
        report = {
          userId: localStorage.userId,
          content: this.report.content,
          replyId: this.curReportId,
        };
      }
      fetch(url, {
        method: 'PATCH',
        body: JSON.stringify(report),
        headers: {
          'content-type': 'application/json',
        },
      })
        .then((response) => response.json())
        .then((result) => {
          let message = '';
          if (!result.duplicate) {
            message = 'Thanks for your report.';
          } else {
            message = 'You have already submitted a report.';
          }
          this.$confirm({
            message: `${message}`,
            button: {
              yes: 'OK',
            },
            callback: () => {
              this.toggleDisplay();
            },
          });
        });
    },
  },
  created() {
    this.userId = localStorage.userId;
  },
  mounted() {
    this.threadId = this.$route.query.threadId;
    this.switchPage(1);
    admin.isAdmin(this.userId).then((result) => {
      this.isAdmin = result;
    }).catch(() => {});
    alert = this.$refs.navbar.$refs.alert;
  },
  watch: {
    $route(page) {
      this.$router.go({ name: 'Thread', query: { threadId: page.query.threadId } });
    },
  },
};
</script>
<style>
  .col-sm-10, .col-sm-4, .col-sm-2, .col-sm-8 {
    margin: 0;
    padding: 0;
  }
  .row {
    margin: 0;
    padding: 0;
  }
</style>
