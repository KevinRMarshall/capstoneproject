<template>
  <span class="hidden"></span>
</template>
<script>
export default {
  name: 'UserId',
  data: () => ({
    userId: '',
    programId: '',
  }),
  mounted() {
    if (this.$route.query.loggedUserId != null) {
      localStorage.userId = this.$route.query.loggedUserId;
      this.userId = localStorage.userId;
    }
    if (this.$route.query.loggedProgramId != null) {
      localStorage.programId = this.$route.query.loggedProgramId;
      this.programId = localStorage.programId;
    }
  },
};
</script>
