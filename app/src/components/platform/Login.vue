<template>
</template>

<script>
import Vue from 'vue'
import Button from "./Button.vue";

export default {
  components: { Button },
  data() {
    return {
      username: "",
      password: "",
      error: "",
      registrationOpen: false,
    };
  },
  created() { },
  mounted() {
    this.resetState();
    let self = this;

    if (Vue.SingleUserMode){
      self.$router.push({ name: "DaiteapWebLandingPage" });
    }

    if (Vue.$keycloak.authenticated) {
        self.$router.push({ name: "DaiteapWebLandingPage" });
    } else {
      self.login_keycloak();
    }
  },
  name: "Login",
  methods: {
    login_keycloak () {
      Vue.$keycloak.login()
    },
    forgotPassword_keycloak () {
      window.open("https://localhost:8090/auth/realms/Daiteap/login-actions/reset-credentials", "_blank");
    }
  },
};
</script>