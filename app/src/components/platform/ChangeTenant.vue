<template>
  <div>
    <div class="card daiteap-content-card">
      <div class="d-flex justify-content-between cardHeaderLight">
        <CardTitle title="Workspace List" />
      </div>
      <hr />
      <div>
        <div v-if="loading" class="d-flex justify-content-center">
          <div class="spinner-border" role="status">
            <span class="sr-only">Loading...</span>
          </div>
        </div>
        <div v-else class="table-responsive">
          <MyTenantsTable class="mt-4" :tenantsList="activeTenants" :selectedTenant="selectedTenant" />
        </div>
      </div>
      <div v-if="!loading" class="d-flex justify-content-center"></div>
      <br />
    </div>
  </div>
</template>

<script>
import MyTenantsTable from "@/components/platform/tables/MyTenantsTable";
import CardTitle from "@/components/platform/CardTitle";

export default {
  components: {
    CardTitle,
    MyTenantsTable
  },
  data() {
    return {
      loading: false,
      dismissSecs: 30,
      dismissCountDown: 0,
      msg: "",
      activeTenants: [],
      selectedTenant: ""
    };
  },
  created() {
    this.loading = true;
    this.getActiveTenants();
    this.getSelectedTenant();
  },
  methods: {
    countDownChanged(dismissCountDown) {
      this.dismissCountDown = dismissCountDown;
    },
    showAlert(error) {
      this.msg = error;
      this.dismissCountDown = this.dismissSecs;
    },
    makeToast(title, message, append = false) {
      this.toastCount++
      this.$bvToast.toast(message, {
        title: title,
        autoHideDelay: 5000000,
        appendToast: append,
        toaster: "b-toaster-bottom-full",
        variant: "danger",
        solid: true
      })
    },
    getActiveTenants() {
      let self = this;
      this.axios
        .get("/server/getActiveTenants", this.get_axiosConfig())
        .then(function (response) {
          self.activeTenants = response.data.activeTenants;
          self.loading = false;
        })
        .catch(function (error) {
          console.log(error);
          self.$notify({
            group: "msg",
            type: "error",
            title: "Notification:",
            text: "Error while getting active tenants!",
          });
        });
    },
    getSelectedTenant() {
      this.axios
        .get("/server/account/tenant", this.get_axiosConfig()).then((response) => {
          this.selectedTenant = response.data.tenant.id;
        });
    }
  },
};
</script>