<template>
<div class="row">
    <div class="card mb-4 w-100">
      <div class="card-header py-3 cardHeaderLight">
        <h6 class="m-0 font-weight-bold">User Cloud Credentials:</h6>
        <span v-if="showAddProviderAccountButton()" class="float-sm-right">
          <AddButton text='Add Provider Cloud Credentials' @onClickAddButton="$emit('addAccountToCluster')" />
        </span>
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
                <th>Provider</th>
                <th>Cloud Credentials</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in accountsList" :key="item.provider">
                <td v-if="item.provider == 'openstack'"><span class="openstack-text"/></td>
                <td v-else>{{ item.provider }}</td>
                <td>{{ item.accountLabel }}</td>
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
  name: 'ClusterProviderAccounts',
  components: { 
    AddButton
  },
  props: ["accountsList", "loading"],
  created() {},
  mounted() {},
  methods: {
    showAddProviderAccountButton(){
      let show = false;
      for (let account in this.accountsList){
        if (this.accountsList[account].account =="---"){
          show = true
        }
      }
      return show
    }
  },
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
