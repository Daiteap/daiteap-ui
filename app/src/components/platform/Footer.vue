<template>
  <footer class="sticky-footer">
    <div>
      <span>API: {{ API_COMMIT_INFO }}</span>
      <br />
      <span>UI: {{ GIT_COMMIT_INFO }}</span>
    </div>
  </footer>
</template>

<script>

export default {
  name: 'Footer',
  data() {
    return {
      GIT_COMMIT_INFO: process.env.VUE_APP_GIT_COMMIT_INFO,
      API_COMMIT_INFO: "",
    };
  },
  created() {
    this.getAPIVersion(this);
  },
  mounted() {
    let self = this;
    let interval = setInterval(() => {
      self.getAPIVersion(self);
    }, 100000);

    window.intervals = [];
    window.intervals.push(interval);
  },
  methods: {
    getAPIVersion(currentObject) {
      let self = currentObject;
      this.axios
        .get("/server/getVersion", this.get_axiosConfig())
        .then(function (response) {
          self.API_COMMIT_INFO =
            response.data.version +
            " | " +
            response.data.gitsha +
            " | " +
            response.data.date +
            " | " +
            response.data.time;
        })
        .catch(function (error) {
          console.log(error);
          self.$notify({
            group: "msg",
            type: "error",
            title: "Notification:",
            text: "Error while getting api version!",
          });
        });
    },
  },
};
</script>

<style scoped>
.sticky-footer {
  background-color: #1d1e22;
  color: #fff;
  font-size: 12px;
}
</style>