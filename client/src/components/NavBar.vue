<template>
  <nav class="navbar-fixed-top navbar-expand-sm navbar-dark bg-primary mb-3">
    <button class="navbar-toggler"
    type="button" data-toggle="collapse" data-target="#navbarColor01"
        aria-controls="navbarColor01" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarColor01">
      <a class="navbar-brand" href="/#/home">
        <img :src='require(`/src/assets/ACSIT_StudySupport_Logo_Small.png`) '
        class="img-fluid">
      </a>
      <ul class="navbar-nav mr-auto">
        <li v-if="this.currentPage === 'Home'" class="nav-item active">
          <a class="nav-link" href="/#/home">Home
            <span class="sr-only">(current)</span>
          </a>
        </li>
        <li v-else class="nav-item">
          <a class="nav-link" href="/#/home">Home
          </a>
        </li>
        <li v-if="this.currentPage === 'Discussion'" class="nav-item dropdown active">
          <a class="nav-link dropdown-toggle" data-toggle="dropdown" href="#"
          role="button" aria-haspopup="true" aria-expanded="false">Community Forum
          <span class="sr-only">(current)</span></a>
          <div class="dropdown-menu">
            <a class="dropdown-item" :href="url + 'study'">Find a Study Group</a>
            <a class="dropdown-item" :href="url + 'help'">Help Me!</a>
            <a class="dropdown-item" :href="url + 'share'">Share Resources</a>
            <div class="dropdown-divider"></div>
            <a class="dropdown-item" :href="url + 'services'">Student Services</a>
          </div>
        </li>
        <li v-else class="nav-item dropdown">
          <a class="nav-link dropdown-toggle" data-toggle="dropdown" href="#"
          role="button" aria-haspopup="true" aria-expanded="false">Community Forum</a>
          <div class="dropdown-menu">
            <a class="dropdown-item" :href="url + 'study'">Find a Study Group</a>
            <a class="dropdown-item" :href="url + 'help'">Help Me!</a>
            <a class="dropdown-item" :href="url + 'share'">Share Resources</a>
            <div class="dropdown-divider"></div>
            <a class="dropdown-item" :href="url + 'services'">Student Services</a>
          </div>
        </li>
        <li v-if="this.currentPage === 'Calendar'" class="nav-item active">
          <a class="nav-link" href="/#/calendar">Calendar
          <span class="sr-only">(current)</span></a>
        </li>
        <li v-else class="nav-item">
          <a class="nav-link" href="/#/calendar">Calendar
          <span class="sr-only">(current)</span></a>
        </li>
      </ul>
      <ul class="nav navbar-nav navbar-right pr-5">
        <Alert ref="alert"/>
        <li class="nav-item dropdown">
          <a class="nav-link dropdown-toggle" data-toggle="dropdown"
            href="#" role="button" aria-haspopup="true" aria-expanded="false">
            <img src="../assets/userIcon.png" alt="user"/>
          </a>
          <div class="dropdown-menu dropdown-menu-right">
            <h5 class="dropdown-item-text mb-0"><DisplayName/></h5>
            <div class="dropdown-divider"></div>
            <a :href="'/#/profile?userId=' + userId" class="dropdown-item">Profile</a>
            <a :href="logoutUrl" class="dropdown-item">Log Out</a>
          </div>
        </li>
      </ul>
    </div>
  </nav>
</template>
<script>
import DisplayName from './DisplayName.vue';
import Alert from './Alert.vue';

export default {
  name: 'NavBar',
  components: {
    DisplayName,
    Alert,
  },
  data: () => ({
    userId: '',
    url: `${process.env.VUE_APP_BASE_URL}discussion?forum=`,
    logoutUrl: `${process.env.VUE_APP_API_BASE_URL}auth/logout`,
    currentPage: '',
  }),
  mounted() {
    this.userId = localStorage.userId;
    switch (this.$route.name) {
      case 'Discussion':
        this.currentPage = 'Discussion';
        break;
      case 'Calendar':
        this.currentPage = 'Calendar';
        break;
      default:
        this.currentPage = 'Home';
        break;
    }
  },
  created() {
    document.title = 'ACSIT Study Supports';
  },
};
</script>
<style>
  .img-fluid {
    max-width: 50%;
  }
</style>
