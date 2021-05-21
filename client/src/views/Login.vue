<template>
<div class="login">
<body>
    <div class="container-sm mt-5">
        <div class="jumbotron" style="background-color: #d2d2d2;">
            <img :src='require(`/src/assets/ACSIT_StudySupport_Logo_Small.png`)'>
            <h1 class="display-3">Welcome, Conestoga Students!</h1>
            <p class="lead">This website is meant to provide Conestoga College a website that
                 allows students to build study habits and learn course materials
                 within a community of learning.</p>
            <hr class="my-4">
            <p>If you are a current Conestoga Student, please click the button
                down below to log in with your Conestoga College email.</p>
            <p class="lead">
                <a class="btn btn-primary btn-lg" :href="url" role="button">Click here to log in</a>
            </p>
        </div>
    </div>
</body>
</div>
</template>
<script>
export default {
  name: 'Login',
  components: {},
  data: () => ({
    url: `${process.env.VUE_APP_API_BASE_URL}auth/login`,
  }),
  created() {
    document.title = 'ACSIT Study Supports';
  },
};
</script>
