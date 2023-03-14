<template>
  <div class="container-fluid">
    <div class="card shadow mb-4">
      <div class="card-header py-3">
        <h6 v-if="!error" class="m-0 font-weight-bold text-primary">{{ msg }}</h6>
        <h6 v-else class="m-0 font-weight-bold text-danger">Error</h6>
      </div>
      <div class="card-body">
        <div v-if="loading" class="d-flex justify-content-center">
          <div class="spinner-border" role="status">
            <span class="sr-only">Loading...</span>
          </div>
        </div>
        <pre v-if="!loading && error">{{ error }}</pre>
        <pre v-if="!loading && error_description">{{ error_description }}</pre>
      </div>
    </div>
    <div class="d-flex justify-content-center">
      <button v-if="!loading" class="btn btn-primary mx-1" v-on:click="backToCloudProfile">Back</button>
    </div>
  </div>
</template>


<script>
export default {
  name: 'AzureCreateApp',
  data() {
    return {
      msg: "",
      error: "",
      error_description: "",
      subscriptionId: "",
      loading: true
    };
  },
  mounted() {
    let self = this;

    if ("error" in self.$route.query) {
      self.error = "Error: " + self.$route.query.error;
      console.log(self.$route.query.error);
      if ("error_description" in self.$route.query) {
        self.error_description =
          "Error description: " + self.$route.query.error_description;
        console.log(self.$route.query.error_description);
      }
      self.loading = false;
    } else if (self.$route.query.authState.split("|").length == 2) {
      let splittedState = self.$route.query.authState.split("|");
      let tenant = splittedState[0];
      self.msg = "Getting azure credentials...";
      self.subscriptionId = splittedState[1];

      let authCode = self.$route.query.authCode;
      this.axios
        .post(
          "/server/oauth/azure/createApp",
          {
            tenant: tenant,
            subscriptionId: self.subscriptionId,
            authCode: authCode,
            origin: window.origin
          },
          this.get_axiosConfig()
        )
        .then(function (response) {
          let taskId = response.data.taskId;

          self.intervalGetTaskMessage = setInterval(() => {
            self.gettaskmessage(taskId);
          }, 1000);

        })
        .catch(function (error) {
          console.log(error);
          self.error = error;
          if (error.response) {
            console.log(error.response.data);
            self.error_description = error.response.data;
          }

          self.$notify({
            group: "msg",
            type: "error",
            title: "Notification:",
            text: "Error creating OAuth credentials"
          });
          self.loading = false;
        });
    } else {
      self.error = "Error: missing required query parameters";
      self.loading = false;
    }
  },
  methods: {
    gettaskmessage(taskId) {
      let self = this;
      self.axios
        .get("/server/task-message/" + taskId, this.get_axiosConfig())
        .then(function (response) {
          if (response.data.status !== "PENDING") {
            clearInterval(self.intervalGetTaskMessage);
            if (response.data.error) {
              self.$notify({
                group: "msg",
                type: "error",
                title: "Notification:",
                text: "Error creating OAuth credentials"
              });
              console.log(response.data.errorMessage);
              self.error = response.data.errorMessage;
            }
            else {
              console.log(response.data);
              self.axios
                .post(
                  "/server/oauth/azure/getgrantauthurladminconsent",
                  { origin: window.origin, subscriptionId: self.subscriptionId },
                  self.get_axiosConfig()
                )
                .then(function (response) {
                  console.log(response.data);
                  window.location.href = response.data.auth_url;
                })
                .catch(function (error) {
                  self.loading = false;
                  console.log(error);
                  self.error = error;
                  if (error.response) {
                    console.log(error.response.data);
                    self.error_description = error.response.data;
                  }

                  self.$notify({
                    group: "msg",
                    type: "error",
                    title: "Notification:",
                    text: "Error creating user credentials"
                  });
                });
            }
          }
        })
        .catch(function (error) {
          clearInterval(self.intervalGetTaskMessage);
          self.$notify({
            group: "msg",
            type: "error",
            title: "Notification:",
            text: "Error creating OAuth credentials"
          });
          console.log(error);
        });
    },
  },
  destroyed() {
    if (window.intervals) {
      for (let i = 0; i < window.intervals.length; i++) {
        clearInterval(window.intervals[i]);
      }
    }
    clearInterval(this.intervalGetTaskMessage);
  },
};
</script>