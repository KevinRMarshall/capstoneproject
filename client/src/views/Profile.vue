<template>
  <div class="profile">
  <header>
    <NavBar/>
  </header>
   <div class="container mt-5">
    <div class="row">
      <div v-if="userFound" class="col-sm-8">
        <MeritPoints v-if="isMounted" v-bind:points="profile.meritPoints"/>
        <div>
          <div class="row mb-1">
            <div class="col">
              <h2>{{profile.displayName}}</h2>
            </div>
            <div class="col">
              <div class="btn-group" role="group" aria-label="profile buttons">
                <div v-if="curUserId == localUser">
                  <a v-if="curUserId == localUser"
                  :href="profileUrl"
                  type="button" class="btn btn-primary">Edit</a>
                </div>
                <div v-else>
                  <a type="button" class="btn btn-primary mr-3"
                  :href="`mailto:${profile.email}`">Email</a>
                  <button class="btn btn-primary" v-on:click.prevent="addEndorsement()">
                  Endorse
                </button>
                </div>
              </div>
            </div>
          </div>
          <div class="border-top border-info pt-3 mt-3 text-left">
            <h5>What are my strongest courses?</h5>
            <p>{{profile.strongestCourse}}</p>
            <h5>What are my weakest courses?</h5>
            <p>{{profile.weakestCourse}}</p>
            <h5>What are my study strengths?</h5>
            <p>{{profile.studyStrengths}}</p>
            <h5>What are my study weaknesses?</h5>
            <p>{{profile.studyWeakness}}</p>
            <h5>When am I available?</h5>
            <p>{{profile.available}}</p>
            <h5>What is the best way to contact me?</h5>
            <p>{{profile.contact}}</p>
          </div>
        </div>
      </div>
      <div v-else class="col-sm-8">
        <h1>User not found.</h1>
      </div>
      <div class="col-sm-4"><SideBar/></div>
    </div>
    </div>
     <Footer/>
  </div>
</template>
<script>
import NavBar from '@/components/NavBar.vue';
import Footer from '@/components/Footer.vue';
import SideBar from '@/components/SideBar.vue';
import MeritPoints from '@/components/MeritPoints.vue';

// @ is an alias to /src
export default {
  name: 'Profile',
  components: {
    NavBar,
    Footer,
    SideBar,
    MeritPoints,
  },
  data: () => ({
    profile: {
      strongestCourse: '',
      weakestCourse: '',
      studyStrengths: '',
      studyWeakness: '',
      available: '',
      timezone: '',
      meritPoints: 0,
      contact: '',
      displayName: '',
    },
    curUserId: '',
    localUser: '',
    userFound: true,
    isMounted: false,
    profileUrl: `${process.env.VUE_APP_BASE_URL}createprofile?edit=true`,
  }),
  mounted() {
    const API_URL = `${process.env.VUE_APP_API_BASE_URL}profile?userId=${this.$route.query.userId}`;
    this.curUserId = this.$route.query.loggedUserId || this.$route.query.userId;
    this.localUser = localStorage.userId;
    fetch(API_URL).then((response) => response.json()).then((result) => {
      if (result.error) {
        if (this.localUser === this.curUserId) {
          this.$router.push({ name: 'CreateProfile' });
        } else {
          this.userFound = false;
        }
      } else {
        this.profile = result.prof;
        this.profile.email = result.email;
        this.isMounted = true;
      }
    });
  },
  methods: {
    addEndorsement() {
      const API_URL = `${process.env.VUE_APP_API_BASE_URL}profile/endorse?userId=${this.$route.query.userId}`;
      fetch(API_URL, {
        headers: {
          'content-type': 'application/json',
        },
        method: 'PATCH',
        body: JSON.stringify({
          userId: localStorage.getItem('userId'),
        }),
      })
        .then((response) => response.json())
        .then((result) => {
          let m = 'Your endorsement has been applied.';
          if (result.duplicate) {
            m = 'You have already endorsed this student.';
          }
          this.$confirm({
            message: m,
            button: {
              yes: 'OK',
            },
            callback: () => {
            },
          });
        });
    },
  },
  watch: {
    $route(page) {
      this.$router.go({ name: 'Profile', query: { userId: page.query.userId } });
    },
  },
};
</script>

<style>
@import '../assets/style.css';
</style>
