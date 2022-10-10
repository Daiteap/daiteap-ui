<template>
<div class="row">
    <div class="col-lg-12">
      <div v-if="loading" class="d-flex justify-content-center">
        <div class="spinner-border" role="status">
          <span class="sr-only">Loading...</span>
        </div>
      </div>
    </div>
    <div v-if="(clusterType == 1  || clusterType == 3 || clusterType == 5)&& (kubernetesVersion || kubernetesNetworkPlugin || kubernetesPodsSubnet || kubernetesServiceAddresses)" class="card  mb-4 w-100" id="kubernetesConfs">
      <div class="card-header py-3 cardHeaderLight">
        <h6 v-if="clusterType == 1 || clusterType == 5" class="m-0 font-weight-bold">Kubernetes Configurations:</h6>
        <h6 v-if="clusterType == 3" class="m-0 font-weight-bold">K3S Configurations:</h6>
      </div>
      <div class="card-body">
      <div v-if="loading" class="d-flex justify-content-center">
        <div class="spinner-border" role="status">
          <span class="sr-only">Loading...</span>
        </div>
      </div>
        <div v-else class="table-responsive">
          <table class="table table-bordered" id="dataTable" width="100%" cellspacing="0">
            <thead>
              <tr>
                <th>Configuration</th>
                <th>Parameter Value</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="kubernetesVersion">
                <td>Version</td>
                <td>
                  {{ kubernetesVersion }}
                  <a
                    v-if="upgradeAvailable && kubeUpgradeStatus == 0 && clusterType == 1"
                    v-on:click="$emit('upgradeKubernetesCluster')"
                    class="float-sm-right"
                    >Upgrade available</a
                  >
                  <a
                    v-if="upgradeAvailable && kubeUpgradeStatus == 0 && clusterType == 3"
                    v-on:click="$emit('upgradeK3sCluster')"
                    class="float-sm-right"
                    >Upgrade available</a
                  >
                  <span v-else-if="kubeUpgradeStatus == 1" class="float-sm-right"
                    >Upgrade in progress...</span
                  >
                  <a
                    v-else-if="kubeUpgradeStatus == -1 && clusterType == 1"
                    v-on:click="$emit('upgradeKubernetesCluster')"
                    class="float-sm-right"
                    >Upgrade failed</a
                  >
                  <a
                    v-else-if="kubeUpgradeStatus == -1 && clusterType == 3"
                    v-on:click="$emit('upgradeK3sCluster')"
                    class="float-sm-right"
                    >Upgrade failed</a
                  >
                </td>
              </tr>

              <tr v-if="kubernetesNetworkPlugin">
                <td>Network plugin</td>
                <td>{{ kubernetesNetworkPlugin }}</td>
              </tr>

              <tr v-if="kubernetesPodsSubnet">
                <td>Pods Subnet</td>
                <td>{{ kubernetesPodsSubnet }}</td>
              </tr>

              <tr v-if="kubernetesServiceAddresses">
                <td>Services Subnet</td>
                <td>{{ kubernetesServiceAddresses }}</td>
              </tr>

              <tr v-if="loadBalancerIntegration">
                <td>Load Balancer Provider</td>
                <td>{{ loadBalancerIntegration }}</td>
              </tr>

            </tbody>
          </table>
        </div>
      </div>
    </div>
    <br />
  </div>
</template>

<script>
export default {
  name: 'ClusterKubernetesIntegration',
  props: [
    "loading",
    "kubernetesVersion",
    "upgradeAvailable",
    "clusterType",
    "kubeUpgradeStatus",
    "kubernetesNetworkPlugin",
    "kubernetesPodsSubnet",
    "kubernetesServiceAddresses",
    "loadBalancerIntegration"
  ],
  created() {},
  mounted() {},
  methods: {},
};
</script>

<style scoped>
a:not([href]):not([tabindex]) {
  color: #4e73df;
  text-decoration: none;
  cursor: pointer;
}

a:not([href]):not([tabindex]):hover {
  color: #224abe;
  text-decoration: underline;
  cursor: pointer;
}

.fa-user-plus {
  color: #000;
}

.fa-server {
  color: #000;
}

.card-header {
  display: block;
}

.card-header > h6 {
  display: inline-block;
}
* {
  white-space: inherit;
}

.row {
    display: flex;
    width: 100%;
    align-items: stretch;
}
.sidebar{
  position: fixed;
  padding-left: 1rem;
  margin-left: 1rem;
  top: 5rem;
}
.cardHeaderLight{
  background-color: #fff;
  color: #1d1e22;
  border-bottom: #1d1e22 2px solid;
  border: #d1d1d1 1px solid;
}
.card-body {
  border: #00708C10 1px solid;
}
</style>
