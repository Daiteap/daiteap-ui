<template>
  <div class="container-fluid">
    <ChooseGoogleProject
      v-show="showChooseGoogleProjects"
      :projects="projects"
      @createServiceAccount="createServiceAccount"
    ></ChooseGoogleProject>
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
      <button v-if="!loading" class="btn btn-primary mx-1"  v-on:click="backToCloudProfile">Back</button>
    </div>
  </div>
</template>


<script>
import ChooseGoogleProject from "../popup_modals/ChooseGoogleProject";
export default {
  name: 'GoogleProjects',
  data() {
    return {
      msg: "",
      error: "",
      error_description: "",
      showChooseGoogleProjects: false,
      loading: true,
      projects: []
    };
  },
  components: {
    ChooseGoogleProject
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
    } else if ("authCode" in self.$route.query) {
      self.msg = "Getting google projects...";
      let authCode = self.$route.query.authCode;

      this.axios
        .post("/server/oauth/google/getprojects", { authCode: authCode, origin: window.location.origin }, this.get_axiosConfig())
        .then(function(response) {
          let projects = response.data.projects;
          if (projects) {
            self.projects = projects;
            self.showChooseGoogleProjects = true;
            self.$bvModal.show("bv-modal-choosegoogleprojects");
          } else {
            self.msg = "Error: no projects found.";
          }
        })
        .catch(function(error) {
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
            text: "Error while getting Google projects"
          });
        });
    } else {
      self.error = "Error: missing code query parameter";
      self.loading = false;
    }
  },
  methods: {
    backToCloudProfile() {
      this.$router.push({ name: "CloudProfile" });
    },
    createServiceAccount(projectId) {
      let self = this;

      self.msg = "Creating service account...";

      this.axios
        .post(
          "/server/oauth/google/createserviceaccount",
          { projectId: projectId },
          this.get_axiosConfig()
        )
        .then(function() {
          self.$notify({
            group: "msg",
            type: "success",
            title: "Notification:",
            text: "Successfuly updated user information!"
          });
          self.backToCloudProfile()
        })
        .catch(function(error) {
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
            text: "Error while getting Google projects"
          });
        });
    }
  }
};
</script>