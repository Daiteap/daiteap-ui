<template>
  <div class="card daiteap-content-card">
    <div class="d-flex justify-content-between cardHeaderLight">
      <CardTitle :title="`User Quotas - ${this.username}`" />
    </div>
    <hr />

    <div class="columns">
      <div>
        <label> Workspace: </label>
      </div>
      <select
        class="custom-select d-block w-100"
        v-model="selectedTenant"
        @change="getUserQuotas"
      >
        <option v-for="item in tenants" :key="item.id" :value="item.id">
          {{ item.name }}
        </option>
      </select>
      <br />
      <br />
    </div>

    <div>
      <label>Kubernetes Nodes: {{ quotas.nodes }} - (Used: {{ used.nodes }})</label>
      <div>
        <vue-slider
          v-model="quotas.nodes"
          :min="used.nodes"
          :interval="1"
          :max="maxQuota"
        />
      </div>
      <br />
    </div>

    <div>
      <label>Services: {{ quotas.services }} - (Used: {{ used.services }})</label>
      <div>
        <vue-slider
          v-model="quotas.services"
          :min="used.services"
          :interval="1"
          :max="maxQuota"
        />
      </div>
      <br />
    </div>

    <div>
      <label>Kubernetes Clusters: {{ quotas.clusters }} - (Used: {{ used.clusters }})</label>
      <div>
        <vue-slider
          v-model="quotas.clusters"
          :min="used.clusters"
          :interval="1"
          :max="maxQuota"
        />
      </div>
      <br />
    </div>

    <div>
      <label>Compute VMs: {{ quotas.compute }} - (Used: {{ used.compute }})</label>
      <div>
        <vue-slider
          v-model="quotas.compute"
          :min="used.compute"
          :interval="1"
          :max="maxQuota"
        />
      </div>
      <br />
    </div>

    <hr />

    <div class="form-group">
      <div class="">
        <div
          class="custom-button float-right float-right ml-5"
          @click="setUserQuotas()"
        >
          Save
        </div>
        <div
          class="custom-button float-right mr-5"
          @click="cancelBtn()"
        >
          Cancel
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import CardTitle from "@/components/platform/CardTitle";

export default {
  name: "UserQuotas",
  props: {
    userID: {
      type: Number,
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      tenants: [],
      selectedTenant: "",
      quotas: {
        nodes: 0,
        services: 0,
        clusters: 0,
        compute: 0,
      },
      used: {
        nodes: 0,
        services: 0,
        clusters: 0,
        compute: 0,
      },
      maxQuota: 1000,
    };
  },
  components: {
    CardTitle,
  },
  created() {
    this.getUserTenants();
  },
  methods: {
    getUserTenants() {
      let self = this;
      this.axios
        .post(
          "/server/getUserTenants",
          { user_id: this.userID },
          this.get_axiosConfig()
        )
        .then(function (response) {
          self.tenants = response.data.user_tenants;
          self.selectedTenant = self.tenants[0].id;
          self.getUserQuotas();
        })
        .catch(function (error) {
          console.log(error);
          if (error.response && error.response.status == "403") {
            self.$notify({
              group: "msg",
              type: "error",
              title: "Notification:",
              text: "Access Denied",
            });
          } else {
            self.$notify({
              group: "msg",
              type: "error",
              title: "Notification:",
              text: "Error while getting user's workspaces.",
            });
          }
        });
    },
    getUserQuotas() {
      let self = this;
      this.axios
        .post(
          "/server/getUserQuotas",
          { user_id: this.userID, tenant_id: this.selectedTenant },
          this.get_axiosConfig()
        )
        .then(function (response) {
          self.quotas.nodes = response.data.limit_nodes;
          self.quotas.services = response.data.limit_services;
          self.quotas.clusters =
            response.data.limit_kubernetes_cluster_environments;
          self.quotas.compute = response.data.limit_compute_vms_environments;

          self.used.nodes = response.data.used_nodes;
          self.used.services = response.data.used_services;
          self.used.clusters =
            response.data.used_kubernetes_cluster_environments;
          self.used.compute = response.data.used_compute_vms_environments;
        })
        .catch(function (error) {
          console.log(error);
          if (error.response && error.response.status == "403") {
            self.$notify({
              group: "msg",
              type: "error",
              title: "Notification:",
              text: "Access Denied",
            });
          } else {
            self.$notify({
              group: "msg",
              type: "error",
              title: "Notification:",
              text: "Error while getting user's quotas.",
            });
          }
        });
    },
    setUserQuotas() {
      let self = this;
      this.axios
        .post(
          "/server/setUserQuotas",
          {
            user_id: this.userID,
            tenant_id: this.selectedTenant,
            nodes_quota: this.quotas.nodes,
            services_quota: this.quotas.services,
            clusters_quota: this.quotas.clusters,
            compute_quota: this.quotas.compute,
          },
          this.get_axiosConfig()
        )
        .then(function () {
          self.$notify({
            group: "msg",
            type: "success",
            title: "Notification:",
            text: "Successfully saved user's quotas!",
          });
          self.cancelBtn();
        })
        .catch(function (error) {
          console.log(error);
          if (error.response && error.response.status == "403") {
            self.$notify({
              group: "msg",
              type: "error",
              title: "Notification:",
              text: "Access Denied",
            });
          } else {
            self.$notify({
              group: "msg",
              type: "error",
              title: "Notification:",
              text: "Error while saving user's quotas.",
            });
          }
        });
    },
    cancelBtn() {
      this.$router.push({
        name: "UsersList",
      });
    },
  },
};
</script>
