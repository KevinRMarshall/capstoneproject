<template>
  <div class="createprofile">
    <header><NavBar /></header>
    <body>
      <div class="container mt-5" id="app">
        <div class="row">
          <div class="col-sm-12 a">
            <form>
              <div v-if="error" class="alert alert-dismissible alert-warning">
                <button type="button" class="close" data-dismiss="alert">&times;</button>
                <h4 class="alert-heading">Error!</h4>
                <p class="mb-0">{{error}}</p>
              </div>
              <fieldset>
                <legend>Create Profile</legend>
                <div class="form-group">
                  <label for="strongestCourse">Strongest Course</label>
                  <input
                    v-model="profile.strongestCourse"
                    type="text"
                    class="form-control"
                    id="strongestCourse"
                    placeholder="What is your strongest course"
                  />
                </div>
                <div class="form-group">
                  <label for="weakestCourse">Weakest Course</label>
                  <input
                    v-model="profile.weakestCourse"
                    type="text"
                    class="form-control"
                    id="weakestCourse"
                    placeholder="What are your weakest courses"
                  />
                </div>
                <div class="form-group">
                  <label for="studyStrengths">Study Strengths</label>
                  <input
                    v-model="profile.studyStrengths"
                    type="text"
                    class="form-control"
                    id="studyStrengths"
                    placeholder="What are your study strengths"
                  />
                </div>
                <div class="form-group">
                  <label for="studyWeakness">Study Weakness</label>
                  <input
                    v-model="profile.studyWeakness"
                    type="text"
                    class="form-control"
                    id="studyWeakness"
                    placeholder="What are your study weakness"
                  />
                </div>
                <div class="form-group">
                  <label for="avalibility">Availability</label>
                  <input
                    v-model="profile.available"
                    type="Text"
                    class="form-control"
                    id="avalibility"
                    placeholder="Enter Availability"
                  />
                </div>
                <div class="form-group">
                  <label for="contact">Contact</label>
                  <input
                    v-model="profile.contact"
                    type="text"
                    class="form-control"
                    id="contact"
                    placeholder="What is the best way to contact you"
                  />
                </div>
                <div v-if="!edit" class="form-group">
                  <label for="program">Program</label>
                  <select class="form-control" id="programSelect" v-model="profile.program">
                    <option>CPA</option>
                    <option>ITID</option>
                  </select>
                </div>
                <div class="btn-group" role="group" aria-label="submit, cancel">
                  <button v-if="this.edit" @click.prevent="createProfile()"
                  class="btn btn-primary mr-3">Edit</button>
                  <button v-else @click.prevent="createProfile()"
                  class="btn btn-primary mr-3">Submit</button>
                  <button @click.prevent="cancel()" class="btn btn-primary">Cancel</button>
                </div>
              </fieldset>
            </form>
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

const API_URL = `${process.env.VUE_APP_API_BASE_URL}profile`;

// @ is an alias to /src
export default {
  name: 'CreateProfile',
  components: {
    NavBar,
    Footer,
  },
  data: () => ({
    error: '',
    profile: {
      userId: '',
      strongestCourse: '',
      weakestCourse: '',
      studyStrengths: '',
      studyWeakness: '',
      available: '',
      timezone: '',
      meritPoints: 0,
      contact: '',
      program: '',
    },
    programs: [],
    submitted: false,
    edit: false,
  }),
  methods: {
    createProfile() {
      let httpMethod;
      if (!this.edit) {
        httpMethod = 'POST';
      } else {
        httpMethod = 'PATCH';
      }
      console.log(this.profile);
      this.profile.userId = localStorage.userId;
      fetch(API_URL, {
        method: httpMethod,
        body: JSON.stringify(this.profile),
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
            this.submitted = true;
            this.$router.push(`/profile?userId=${result.userId}`);
          }
        });
    },
    cancel() {
      this.$router.push({ name: 'Profile', query: { userId: localStorage.getItem('userId') } });
    },
  },
  mounted() {
    this.edit = this.$route.query.edit;
    if (this.edit) {
      fetch(`${process.env.VUE_APP_API_BASE_URL}profile?userId=${localStorage.userId}`).then((response) => response.json()).then((result) => {
        this.profile = result.prof;
      });
    }
  },
};
</script>

<style>
@import "../assets/style.css";
</style>
