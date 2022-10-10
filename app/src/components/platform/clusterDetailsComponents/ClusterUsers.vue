<template>
<div class="row">

      <div class="card mb-4 w-100" id="users">
        <div class="card-header py-3 cardHeaderLight">
          <h6 class="m-0 font-weight-bold">Users:</h6>
        <span class="float-sm-right">
          <AddButton text='Add User' @onClickAddButton="$parent.addUserToCluster()" />
          </span>
        </div>
        <div class="card-body">
            <div v-if="$parent.loading" class="d-flex justify-content-center">
              <div class="spinner-border" role="status">
              </div>
            </div>
          <div v-else class="table-responsive">
            <table class="table table-bordered" id="dataTable" width="100%" cellspacing="0">
              <thead>
                <tr>
                  <th>Username</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th>Delete</th>
                  <th v-if="$parent.clusterType == 1 || $parent.clusterType == 3" >Downloads</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in $parent.cluster.usersList" :key="item.ID">
                  <td
                    class="userDetailsLink"
                    @click="goToUserDetails(item)"
                  >{{ item.username }}</td>
                  <td>{{ item.type }}</td>
                  <td>{{ item.status }}</td>
                  <td>
                    <AddButton text='' @onClickAddButton="$parent.deleteUserFromCluster(item)" />
                  </td>
                  <td v-if="$parent.clusterType == 1 || $parent.clusterType == 3">
            <kbd v-if="item.type !='user'" :title="'Download '+ item.username +' kubeconfig'"
              v-on:click="$parent.downloadClusterUserKubeconfig($parent.clusterID, item.username)"
            ><i class="fa fa-download largeIcon"></i> kubeconfig</kbd>
            <div v-else>no kubeconfig file</div>
            </td>
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
import AddButton from "@/components/platform/AddButton"

export default {
  name: 'ClusterUsers',
  components: {
    AddButton,
  },
  data() {
    return {};
  },
  created() {},
  mounted() {},
  methods: {
    goToUserDetails(user){
      this.$parent.showClusterUserInfoModal = true;
      this.$bvModal.show("bv-modal-clusteruserinfomodal");
      this.$parent.clusterUserDetails = user
    }
  },
  destroyed() {},
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
kbd{
  padding: 0.5rem;
  background-color: #1d1e22;
  cursor: pointer;
}
kbd:hover{
  background-color: #00708caf;
}
.userDetailsLink{
  cursor: pointer;
  color: #1d1e22;
}
.userDetailsLink:hover{
  text-decoration-line: underline;
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
