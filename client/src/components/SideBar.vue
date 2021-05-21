<template>
  <div class="bs-component">
    <div class="card border-primary mb-3">
      <div class="card-header">Community Forum</div>
      <div class="card-body">
          <button button type="button" @click="switchPage('study')"
          class="btn btn-secondary"><img :src='require(`/src/assets/icons/findGroup.png`) '
          height="36px" width="36px"> Find A Study Group</button>
          <button button type="button" @click="switchPage('help')"
          class="btn btn-secondary"><img :src='require(`/src/assets/icons/findHelp.png`) '
          height="36px" width="36px"> Help Me!</button>
          <button button type="button" @click="switchPage('share')"
          class="btn btn-secondary"><img :src='require(`/src/assets/icons/shareResources.png`) '
          height="36px" width="36px"> Share Resources</button>
          <button button type="button" @click="switchPage('services')"
          class="btn btn-secondary"><img :src='require(`/src/assets/icons/studentServices.png`) '
          height="36px" width="36px"> Student Services</button>
          <button v-if="isAdmin" button type="button" @click="switchPage('reports')"
          class="btn btn-secondary"><img :src='require(`/src/assets/icons/studentServices.png`) '
          height="36px" width="36px"> Reports</button>
      </div>
    </div>
    <!--4th card-->
    <Feed ref='feed'/>
  </div>
</template>
<script>
import admin from '@/utils/admin';
import Feed from './Feed.vue';

export default {
  name: 'sidebar',
  components: {
    Feed,
  },
  data: () => ({
    isAdmin: false,
  }),
  methods: {
    switchPage(page) {
      switch (page) {
        case 'help':
          this.$router.replace({ name: 'Discussion', query: { forum: 'help' } });
          break;
        case 'share':
          this.$router.replace({ name: 'Discussion', query: { forum: 'share' } });
          break;
        case 'study':
          this.$router.replace({ name: 'Discussion', query: { forum: 'study' } });
          break;
        case 'services':
          this.$router.replace({ name: 'Discussion', query: { forum: 'services' } });
          break;
        case 'reports':
          this.$router.push({ name: 'Report' });
          break;
        default:
          this.$router.push({ name: 'Home' });
          break;
      }
    },
  },
  mounted() {
    admin.isAdmin(localStorage.userId).then((result) => {
      this.isAdmin = result;
    }).catch(() => {});
  },
};
</script>
