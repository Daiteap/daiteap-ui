<template>
  <div class="card daiteap-content-card">
    <div class="d-flex justify-content-between cardHeaderLight">
      <CardTitle :title="`Resource Quotas - ${computed_userInfo.username}`" />
    </div>
    <hr />
    <br />

    <div v-if="loading" class="d-flex justify-content-center">
      <div class="spinner-border" role="status">
        <span class="sr-only">Loading...</span>
      </div>
    </div>

    <div v-if="!loading">
      <QuotasBar
        :progressBarClasses="'daiteap-progress-bar-2'"
        :max="this.quotas['limit_nodes']"
        :text="`Nodes: ${this.quotas['used_nodes']} / ${this.quotas['limit_nodes']}`"
        :used="this.quotas['used_nodes']"
      />

      <QuotasBar
        :progressBarClasses="'daiteap-progress-bar-2'"
        :max="this.quotas['limit_services']"
        :text="`Services: ${this.quotas['used_services']} / ${this.quotas['limit_services']}`"
        :used="this.quotas['used_services']"
      />

      <QuotasBar
        :progressBarClasses="'daiteap-progress-bar'"
        :max="this.quotas['limit_kubernetes_cluster_environments']"
        :text="`Kubernetes Clusters: ${this.quotas['used_kubernetes_cluster_environments']} / ${this.quotas['limit_kubernetes_cluster_environments']}`"
        :used="this.quotas['used_kubernetes_cluster_environments']"
      />

      <div v-if="computed_account_settings.enable_compute">
        <QuotasBar
          :progressBarClasses="'daiteap-progress-bar'"
          :max="this.quotas['limit_compute_vms_environments']"
          :text="`Compute VMs: ${this.quotas['used_compute_vms_environments']} / ${this.quotas['limit_compute_vms_environments']}`"
          :used="this.quotas['used_compute_vms_environments']"
        />
      </div>
    </div>
  </div>
</template>

<script>
import CardTitle from "@/components/platform/CardTitle";
import QuotasBar from "@/components/platform/QuotasBar";

export default {
  name: "ResourceQuotas",
  components: {
    CardTitle,
    QuotasBar,
  },
  data() {
    return {
      quotas: {},
      loading: true,
    };
  },
  created() {
    this.getUserQuota().then((quota) => {
      this.quotas = quota;
      this.loading = false;
    });
  },
};
</script>
