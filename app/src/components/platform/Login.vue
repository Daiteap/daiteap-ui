<template>
  <div></div>
</template>

<script>
import Vue from "vue";

export default {
  name: "Login",
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

    if (this.computed_single_user_mode){
      self.$router.push({ name: "DaiteapWebLandingPage" });
    }

    if (Vue.$keycloak.authenticated) {
        self.$router.push({ name: "DaiteapWebLandingPage" });
    } else {
      self.login_keycloak();
    }
  },
  methods: {
    login_keycloak () {
      Vue.$keycloak.login();
    },
    forgotPassword_keycloak () {
      window.open("https://localhost:8090/auth/realms/Daiteap/login-actions/reset-credentials", "_blank");
    }
  },
};
</script>