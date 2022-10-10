<template>
  <div class="h-100 sideDiv">
    <div class="sidebar-header text-center">
      <h5 class="mt-4 pb-1">{{ clusterName }}</h5>
      <!-- <p class="pb-4" style="color:#eaebed;borderBottom:1px solid #00708c00;fontSize:11.5px">{{ clusterID }}</p> -->
      <!-- <p id="clusterID">{{ clusterID }}</p> -->
    </div>
    <ul class="flex-column list-group">
      <a
        @click="goToDetails(clusterID, 'overview')"
        class="list-group-item list-group-item-action"
        :class="[$route.path == '/app/platform/clusterdetails/'+clusterID+'/overview' ? 'active' : '']"
        data-toggle="list"
        role="tab"
        >Overview</a
      >
      <a
        @click="goToDetails(clusterID, 'operations')"
        class="list-group-item list-group-item-action"
        :class="[$route.path == '/app/platform/clusterdetails/'+clusterID+'/operations' ? 'active' : '']"
        data-toggle="list"
        role="tab"
        >Operations</a
      >
      <a
        @click="goToDetails(clusterID, 'machines')"
        class="list-group-item list-group-item-action"
        :class="[$route.path == '/app/platform/clusterdetails/'+clusterID+'/machines' ? 'active' : '']"
        data-toggle="list"
        role="tab"
        >Virtual Machines</a
      >
      <a
        v-if="clusterType == 1 || clusterType == 3"
        @click="goToDetails(clusterID, 'services')"
        class="list-group-item list-group-item-action"
        :class="[$route.path == '/app/platform/clusterdetails/'+clusterID+'/services' ? 'active' : '']"
        data-toggle="list"
        role="tab"
        >Installed Services</a
      >
      <a
        v-if="clusterType == 1 || clusterType == 3"
        @click="goToDetails(clusterID, 'store')"
        class="list-group-item list-group-item-action"
        :class="[$route.path == '/app/platform/clusterdetails/'+clusterID+'/store' ? 'active' : '']"
        data-toggle="list"
        role="tab"
        >Service Catalog</a
      >
      <a
        @click="goToDetails(clusterID, 'users')"
        class="list-group-item list-group-item-action"
        :class="[$route.path == '/app/platform/clusterdetails/'+clusterID+'/users' ? 'active' : '']"
        data-toggle="list"
        role="tab"
        >Users</a
      >
      <!-- <a
        @click="goToClusterGrafana(clusterID)"
        class="list-group-item list-group-item-action"
        :class="[$route.path == '/app/platform/clusterdetails/'+clusterID+'/grafana' ? 'active' : '']"
        data-toggle="list"
        role="tab"
        >Grafana</a
      >
      <a
        v-if="loadBalancerIntegration"
        @click="goToClusterLoadBalancer(clusterID)"
        :class="[$route.path == '/app/platform/clusterdetails/'+clusterID+'/loadbalancer' ? 'active' : '']"
        class="list-group-item list-group-item-action"
        >Load balancer integration</a
      > -->
      <a
        v-if="
          clusterType == 1 &&
          (kubernetesVersion ||
            kubernetesNetworkPlugin ||
            kubernetesPodsSubnet ||
            kubernetesServiceAddresses)
        "
        @click="goToDetails(clusterID, 'kubernetes-integration')"
        class="list-group-item list-group-item-action"
        :class="[$route.path == '/app/platform/clusterdetails/'+clusterID+'/kubernetes-integration' ? 'active' : '']"
        data-toggle="list"
        role="tab"
        >Kubernetes Configurations</a
      >
      <a
        v-if="
          clusterType == 3 &&
          (kubernetesVersion ||
            kubernetesNetworkPlugin ||
            kubernetesPodsSubnet ||
            kubernetesServiceAddresses)
        "
        @click="goToDetails(clusterID, 'kubernetes-integration')"
        class="list-group-item list-group-item-action"
        :class="[$route.path == '/app/platform/clusterdetails/'+clusterID+'/kubernetes-integration' ? 'active' : '']"
        data-toggle="list"
        role="tab"
        >K3S Configurations</a
      >
     <!--  <a 
        @click="goToClusterKibana(clusterID)"
        class="list-group-item list-group-item-action"
        :class="[$route.path == '/app/platform/clusterdetails/'+clusterID+'/kibana' ? 'active' : '']"
        data-toggle="list"
        role="tab"
        >Kibana logging monitor</a
      >
      <a 
        @click="goToClusterProviderAccounts(clusterID)"
        class="list-group-item list-group-item-action"
        :class="[$route.path == '/app/platform/clusterdetails/'+clusterID+'/provider-accounts' ? 'active' : '']"
        data-toggle="list"
        role="tab"
        >Provider Cloud Credentials</a
      > -->
      <a 
        @click="goToDetails(clusterID, 'cloud-resources')"
        class="list-group-item list-group-item-action"
        :class="[$route.path == '/app/platform/clusterdetails/'+clusterID+'/cloud-resources' ? 'active' : '']"
        data-toggle="list"
        role="tab"
        >Cloud Resources</a
      >
    </ul>
  </div>
</template>

<script>

export default {
  name: 'SidebarClusterDetails',
  props: [
    "clusterName",
    "clusterID",
    "clusterType",
    "loadBalancerIntegration",
    "kubernetesVersion",
    "kubernetesNetworkPlugin",
    "kubernetesPodsSubnet",
    "kubernetesServiceAddresses",
  ],
  methods: {
    goToDetails(id, details) {
      this.$router.push({
        name: "ClusterDetails",
        params: {
          clusterID: id,
          detailPage: details
        },
      }).catch(error=>{return error});
    },
  },
};
</script>

<style scoped>
a {
  color: #fff;
   border-color: #fff;
}
.list-group-item.active {
  color: #eaebed;
  font-weight: bold;
  background-color: #fff;
   border-color: #fff;
    border-top-color: #fff;
    border-right-color: #fff;
    border-bottom-color: #fff;
    border-left-color: #fff;
    
}
.list-group-item:hover {
  color: #eaebed;
  margin-top: -1px;
  background-color: #fff;
   border-color: #fff;
  border-top: 1px solid #fff;
}
.list-group-item.active:hover {
  color: #eaebed;
   border-color: #fff;
  margin-top: -1px;
  border-top: 1px solid #fff;
  background-color: #fff;
}

/* a:not([href]):not([tabindex]):active {
  color: white;
} */
a:not([href]):not([tabindex]):hover {
  color: #000;
   border-color: #fff;
  cursor: pointer;
}

a {
  border: #fff solid 1pix;
}

#clusterID {
  font-size: 1rem;
}
.list-group-item:first-child {
    border-top-left-radius: 0rem;
    border-top-right-radius: 0rem;
   border-color: #fff;
}
.list-group-item:last-child {
    border-bottom-right-radius: 0rem;
    border-bottom-left-radius: 0rem;
   border-color: #fff;
}
.list-group-item:first-child:hover {
  margin-top: 0px;
  border-top: 1px solid #fff;
   border-color: #fff;
}
.list-group-item:first-child.active:hover {
  margin-top: 0px;
  border-top: 1px solid #fff;
   border-color: #fff;
}

.sideDiv{
  position: absolute;
  top: -10px;
  background-color: white;
  /* border-right:0.1px solid #bcbcbc35; */
}
</style>
