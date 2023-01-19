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
      <button v-if="!loading" class="btn btn-primary mx-1"  v-on:click="backToCloudProfile">Back</button>
    </div>
  </div>
</template>


<script>
export default {
  name: 'AzureGrantAdminConsent',
  data() {
    return {
      msg: "",
      error: "",
      error_description: "",
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
    } else if ("tenant" in self.$route.query) {
      self.msg = "Getting azure credentials...";

      self.$notify({
                group: "msg",
                type: "success",
                title: "Notification:",
                text: "Successfuly created OAuth credentials"
              });

      self.$router.push({ name: "CloudProfile" });
    }
  },
  methods: {
    backToCloudProfile() {
      this.$router.push({ name: "CloudProfile" });
    }
  }
};
</script>