<template>
  <div id="wrapper">
    <Navbar
      v-if="$route.path == '/app/platform/overview'"
      :key="navbarKey"
    />
    <Navbar v-else :navbarLeftMargin="navbarLeftMargin" :key="navbarKey" />

    <Sidebar
      @collapsed="resizeNavBar"
      @avatarChanged="onAvatarChange"
      :class="[{ 'no-sidebar': $route.path == '/app/platform/overview' }]"
    />
    <notifications width="300px" position="bottom right" group="msg" />

    <b-navbar-brand v-if="this.computed_theme == 'daiteap'" to="/app/platform/overview">
      <img
        width="60"
        height="42"
        alt=""
        id="daiteap-top-navbar-img"
      />
    </b-navbar-brand>
  </div>
</template>

<script>
import Sidebar from "@/components/platform/Sidebar";
import Navbar from "@/components/platform/Navbar";

export default {
  name: "Layout",
  created() {
  },
  mounted() {
    window.addEventListener("resize", this.onResize);
  },
  data() {
    return {
      navbarLeftMargin: "250",
      navbarKey: 0,
    };
  },
  components: { Sidebar, Navbar },
  methods: {
    resizeNavBar(collapsed) {
      if (collapsed) {
        this.navbarLeftMargin = "50";
      } else {
        this.navbarLeftMargin = "250";
      }
    },
    clusterDetailsIsActivePage() {
      var path = this.$route.path.split("/")[3];
      if (path == "clusterdetails") {
        return true;
      }
      return false;
    },
    onAvatarChange() {
      this.navbarKey += 1;
    },
  },
  watch: {
    "$route.path": {
      handler: function () {
        this.navbarKey += 1;
      },
      deep: true,
      immediate: true,
    },
  },
};
</script>

<style>
.no-sidebar {
  max-width: 1800px;
  margin: auto;
}

.notification-title {
  font-size: 17px;
}
.notification-content {
  font-size: 17px;
}

.vue-notification.warn {
  background: #ffb648;
  border-left-color: #f48a06;
}
.vue-notification.error {
  background: #9d4561;
  color: #fff;
  border-left-color: #9d4561;
}
.vue-notification.success {
  background: #9d4561;
  color: #fff;
  border-left-color: #9d4561;
}
</style>
