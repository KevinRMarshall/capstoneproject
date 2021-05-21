<template>
  <div>
    <p>{{displayName}}</p>
    <p>{{program}}</p>
    <span hidden><UserId/></span>
  </div>
</template>

<script>
import UserId from './UserId.vue';

const API_URL = `${process.env.VUE_APP_API_BASE_URL}auth/user?userId=${localStorage.getItem('userId')}`;

export default {
  name: 'DisplayName',
  components: {
    UserId,
  },
  data: () => ({
    displayName: '',
    program: '',
  }),
  mounted() {
    fetch(API_URL).then((response) => response.json()).then((result) => {
      if (result.error) {
        const error = result.details.map((detail) => detail.message).join('. ');
        this.error = error;
      } else if (!result.profile && this.$router.name !== 'CreateProfile') {
        this.$router.push({ name: 'CreateProfile' });
      }
      this.displayName = result.display;
      this.program = result.program;
    });
  },
};
</script>
