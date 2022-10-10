<template>
  <div class="container-fluid">
    <ChooseAzureSubscription
      v-show="showChooseAzureSubscription"
      :tenant="tenant"
      :subscriptions="subscriptions"
      @createApp="createApp"
    ></ChooseAzureSubscription>
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
import ChooseAzureSubscription from "../popup_modals/ChooseAzureSubscription";
export default {
  name: 'AzureAuthorize',
  data() {
    return {
      msg: "",
      error: "",
      error_description: "",
      subscriptions: [],
      showChooseAzureSubscription: false,
      tenant: "",
      loading: true
    };
  },
  components: {
    ChooseAzureSubscription
  },
  mounted() {
    let self = this;

    if ("error" in self.$route.query) {
      self.loading = false;
      self.error = "Error: " + self.$route.query.error;
      console.log(self.$route.query.error);
      if ("error_description" in self.$route.query) {
        self.error_description =
          "Error description: " + self.$route.query.error_description;
        console.log(self.$route.query.error_description);
      }
    } else if ("authCode" in self.$route.query && "authState" in self.$route.query) {
      self.tenant = self.$route.query.authState;
      self.msg = "Getting azure credentials...";

      self.selectSubscription(self.tenant);
    } else {
      self.loading = false;
      self.error = "Error: Missing query parameter tenant";
    }
  },
  methods: {
    backToCloudProfile() {
      this.$router.push({ name: "CloudProfile" });
    },
    createApp(tenant, subscriptionId) {
      let self = this;
      this.axios
        .post(
          "/server/oauth/azure/getauthurlcreateapp",
          {
            origin: window.origin,
            tenant: tenant,
            subscriptionId: subscriptionId
          },
          this.get_axiosConfig()
        )
        .then(function(response) {
          window.location.href = response.data.auth_url;
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
            text: "Error creating user credentials"
          });
        });
    },
    selectSubscription(tenant) {
      let self = this;

      let authCode = self.$route.query.authCode;
      this.axios
        .post(
          "/server/oauth/azure/getsubscriptions",
          {
            tenant: tenant,
            authCode: authCode,
            origin: window.origin
          },
          this.get_axiosConfig()
        )
        .then(function(response) {
          let subscriptions = response.data.subscriptions;
          if (subscriptions) {
            self.subscriptions = subscriptions;
            self.showChooseAzureSubscription = true;
            self.$bvModal.show("bv-modal-chooseazuresubscription");
          } else {
            self.msg =
              "Error: no valid Azure subscriptions. Please make sure you have valid subscription in Azure.";
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
            text: "Error while getting Azure subscriptions"
          });
        });
    }
  }
};
</script>