<template>
  <div class="bs-component">
    <div class="card border-primary mb-3" style=" max-height: 21rem; overflow-y: scroll;">
      <div class="card-header">What's New?</div>
      <div class="card-body">
        <div v-for="f in feed" :key="f._id">
          <div v-if="f.link != ''">
            <div class="card border-warning mb-3" style="max-width: 20rem; padding: 0.1rem;">
              <div class="card-body" style= "padding: .5rem; font-size: 11px;">
              <h6 class="card-text">{{getFormattedDate(f.dateCreated)}}</h6>
              <p class="card-text mb-1"><a :href="url + f.userId">
                {{f.displayName}}</a> has made a post.</p>
              <p  align="right"><a :href="f.link">View Post</a></p>
              </div>
            </div>
          </div>
          <div v-else>
            <div class="card border-warning mb-3" style="max-width: 20rem; padding: 0.1rem;">
              <div class="card-body" style= "padding: .5rem; font-size: 11px;">
                <h6 class="card-text">{{getFormattedDate(f.dateCreated)}}</h6>
                <p class="card-text" style="margin-bottom:0.25rem;">
                  {{f.displayName}} has completed a goal.</p>
                <button  class="btn btn-secondary" style = "height: 28px; width: 28px;
                padding: 5px; float: right;">
                <img class="img-fluid" :src='require(`/src/assets/icons/endorsements.png`)'>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import dates from '@/utils/dates';

const API_URL = `${process.env.VUE_APP_API_BASE_URL}feed`;
export default {
  name: 'feed',
  components: {},
  data: () => ({
    feed: [],
    url: `${process.env.VUE_APP_BASE_URL}profile?userId=`,
  }),
  methods: {
    fetchFeed() {
      fetch(`${API_URL}?programId=${localStorage.programId}`)
        .then((response) => response.json())
        .then((result) => {
          this.feed = result;
        });
    },
    createFeed(userId, content, date, link, programId) {
      const body = {
        userId,
        content,
        dateCreated: date,
        link,
        programId,
      };
      fetch(API_URL, {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
          'content-type': 'application/json',
        },
      }).then((response) => response.json())
        .then((result) => {
          this.feed.push(result);
        });
    },
    getFormattedDate(date) {
      return dates.getFeedFormattedDate(date);
    },
  },
  mounted() {
    this.fetchFeed();
  },
};
</script>
