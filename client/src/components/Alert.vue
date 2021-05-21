<template>
  <li class="nav-item dropdown">
    <a class="nav-link dropdown-toggle" data-toggle="dropdown" v-on:click="readAlerts"
      href="#" role="button" aria-haspopup="true" aria-expanded="false">
      <img v-if="!allRead" src="../assets/messageUnread.png" alt="unread Alerts"/>
      <img v-if="allRead" src="../assets/messageRead.png" alt="read Alerts"/>
    </a>
    <div class="dropdown-menu dropdown-menu-right">
      <h5 class="dropdown-item-text mb-0">Alerts</h5>
      <div class="dropdown-divider"></div>
      <div v-for="alert in alerts" :key="alert._id">
        <a :href="alert.link" class="dropdown-item"
        data-toggle="tooltip" data-placement="left"
        :title="alert.content"
        >{{alert.content}}</a>
      </div>
    </div>
  </li>
</template>
<script>
const API_URL = `${process.env.VUE_APP_API_BASE_URL}alert`;
export default {
  name: 'alert',
  components: {},
  data: () => ({
    alerts: [],
    allRead: false,
  }),
  methods: {
    fetchAlerts() {
      fetch(`${API_URL}?userId=${localStorage.userId}`)
        .then((response) => response.json())
        .then((result) => {
          this.alerts = result.alerts;
          this.allRead = result.allRead;
        });
    },
    createAlert(userId, content, link, senderId) {
      const body = {
        userId,
        content,
        senderId,
        link,
      };
      fetch(API_URL, {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
          'content-type': 'application/json',
        },
      }).then((response) => response.json())
        .then(() => {
          this.fetchAlerts();
        });
    },
    readAlerts() {
      fetch(`${API_URL}/read?userId=${localStorage.userId}`, {
        method: 'PATCH',
        headers: {
          'content-type': 'application/json',
        },
      }).then((response) => response.json())
        .then(() => {});
      this.allRead = true;
    },
  },
  created() {
    this.fetchAlerts();
  },
};
</script>
<style>
  .dropdown-menu {
    overflow-y:scroll;
    overflow-x:hidden;
    max-height: 29rem;
    max-width: 29rem;
  }
</style>
