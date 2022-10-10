<template>
<div class="row">
    <DetailsVirtualMachine
      v-show="showDetailsVirtualMachine"
      :machineDetails="machineDetails"
    ></DetailsVirtualMachine>
    <div class="card mb-4 w-100">
      <div class="card-header py-3 cardHeaderLight d-flex justify-content-between">
        <h6 class="m-0 mt-1 font-weight-bold">Nodes:</h6>
        <span v-if="$parent.cluster.resizestep>0" class=" mt-1">
          <b-spinner style="width: 1.2rem; height: 1.2rem; " variant="info" class="mr-2"></b-spinner>
          Resizing {{$parent.clusterName}} in progress - {{resizeStatus($parent.cluster.resizestep, $parent.cluster.clusterType)}}
        </span>
        <span v-if="$parent.cluster.resizestep<0" class="text-danger mt-1">
          Error resizing {{$parent.clusterName}} - {{resizeStatus($parent.cluster.resizestep, $parent.cluster.clusterType)}}
        </span>
        <span class="float-sm-right ">
          <AddButton text='Add Machines ' @onClickAddButton="$parent.addMachineToCluster()" />
        </span>
      </div>
      <div class="card-body">
        <div v-if="$parent.loading" class="d-flex justify-content-center">
          <div class="spinner-border" role="status">
          </div>
        </div>
        <div v-else>
          <div class="col mb-3">
            <b-form-group
              label="Available columns"
              label-cols-sm="3"
              label-align-sm="right"
              label-size="sm"
              class="mb-0"
            >
              <b-form-checkbox-group
                v-model="selectedeColums"
                class="row mt-1"
              >
              <div class="col-12">
                <b-form-checkbox class="col-1" value="name">Name</b-form-checkbox>
                <b-form-checkbox class="col-1" value="statusText">Status</b-form-checkbox>
                <b-form-checkbox class="col-1" value="type">Type</b-form-checkbox>
                <b-form-checkbox class="col-1" value="operating_system">OS</b-form-checkbox>
                <b-form-checkbox class="col-1" value="provider">Provider</b-form-checkbox>
                <b-form-checkbox class="col-1" value="manage">Manage</b-form-checkbox>
              </div>
              <div class="col-12">
                <b-form-checkbox class="col-1" value="publicIP">publicIP</b-form-checkbox>
                <b-form-checkbox class="col-1" value="privateIP">privateIP</b-form-checkbox>
                <b-form-checkbox class="col-1" value="network">network</b-form-checkbox>
                <b-form-checkbox class="col-1" value="region">Region</b-form-checkbox>
                <b-form-checkbox class="col-1" value="zone">Zone</b-form-checkbox>
                <b-form-checkbox class="col-1" value="resources">Resources</b-form-checkbox>
              </div>
              </b-form-checkbox-group>
            </b-form-group>
          </div>
          <b-table
            ref="table" 
            small 
            responsive 
            bordered 
            hover 
            sort-icon-left 
            :items="$parent.cluster.machinesList" 
            :fields="fields"
            v-model="shownItems"
            style="overflow:visible;cursor:pointer"
            @row-clicked="updateSelectedMachineDetails"
          >
            <template slot="actions" slot-scope="data">
              <b-btn size="sm" @click="log(data.item)">Details</b-btn>
            </template>
            <template #cell(provider)="data">
              <img v-if="data.item.provider === 'alicloud'" title="Alibaba Cloud"  margin-top="auto" margin-bottom="auto" class="pr-2" height="20pix" width="auto"  src="../../../assets/img/alicloud_logo_small.png" alt="">
              <img v-if="data.item.provider === 'aws'" title="AWS"  margin-top="auto" margin-bottom="auto" class="pr-2" height="20pix" width="auto"  src="../../../assets/img/aws_logo_small.png" alt="">
              <img v-if="data.item.provider === 'azure'" title="Azure"  margin-top="auto" margin-bottom="auto" class="pr-2" height="20pix" width="auto"  src="../../../assets/img/azure_logo_small.png" alt="">
              <img v-if="data.item.provider === 'google'" title="Google Cloud"  margin-top="auto" margin-bottom="auto" class="pr-2" height="20pix" width="auto"  src="../../../assets/img/googleCloud_logo_small.png" alt="">
              <img v-if="data.item.provider === 'onpremise'" title="on-premise"  margin-top="auto" margin-bottom="auto" class="pr-2" height="20pix" width="auto"  src="../../../assets/img/onpremise.svg" alt="">
              <img v-if="data.item.provider === 'iotarm'" title="IoT-ARM"  margin-top="auto" margin-bottom="auto" class="pr-2" height="20pix" width="auto"  src="../../../assets/img/IoTArm_logo_small.svg" alt="">
            </template>
            <template #cell(cpu)="data">
              <span>{{data.item.cpu ? data.item.cpu : '--'}}<small> vCPU</small></span>
            </template>
            <template #cell(ram)="data">
              <span>{{data.item.ram ? data.item.ram : '--'}}<small> GB</small></span>
            </template>
            <template #cell(hdd)="data">
              <span>{{data.item.hdd ? data.item.hdd : '--'}}<small> GB</small></span>
            </template>
            <template #cell(manage)="data">
              <div>
                <b-dropdown right size="sm" class="dropDownMenuButton" no-caret>
                  <template #button-content>
                    <i class="fa fa-ellipsis-v" aria-hidden="true"></i>
                  </template>
                  <b-dropdown-item
                   :disabled="data.item.status != 10"
                    v-on:click="startMachine(data.item)"
                   >
                    <span >
                      <i class="fas fa-play"></i>
                      Start machine
                    </span>
                  </b-dropdown-item>
                  <b-dropdown-item :disabled="data.item.status != 0"
                    v-on:click="stopMachine(data.item)"
                  >
                    <span><i class="fas fa-stop"></i>
                    Stop machine
                    </span>
                  </b-dropdown-item>
                  <b-dropdown-item :disabled="data.item.status != 0"
                    v-on:click="restartMachine(data.item)"
                  >
                    <span>
                      <i class="fas fa-sync-alt"></i>
                      Restart machine
                    </span>
                  </b-dropdown-item>
                  <b-dropdown-item disabled>
                    <span>
                      <i class="fas fa-trash"></i>
                    </span>
                    Delete machine
                  </b-dropdown-item>
                  <b-dropdown-divider>
                  </b-dropdown-divider>
                  <b-dropdown-item
                  @click="machineDetails=data.item; showDetailsVirtualMachine=true">
                    <span>
                      <i class="fa fa-info mx-1"></i>
                    </span>
                     Details
                  </b-dropdown-item>
                </b-dropdown>
              </div>
            </template>
          </b-table>
        </div>
      </div>
    </div>
    <br />
</div>
</template>

<script>
import DetailsVirtualMachine from "@/components/platform/popup_modals/DetailsVirtualMachine";
import AddButton from "@/components/platform/AddButton"

export default {
  name: 'ClusterMachines',
  components: {
    DetailsVirtualMachine,
    AddButton,
  },
  data() {
    return {
      shownItems:[],
      showDetailsVirtualMachine:false,
      selectedeColums:[
        "name",
        "statusText",
        "type",
        "operating_system",
        "provider",
        "publicIP",
        "privateIP",
        "network", 
        "region", 
        "zone", 
        "manage", 
        "resources"
      ],
      fields:[],
      machineDetails:{}
      
    };
  },
  created() {},
  mounted() {
    if (window.localStorage.getItem('selectedeColums')){
      this.selectedeColums = window.localStorage.getItem('selectedeColums').split(',');
    }
    this.updateColumns()
  },
  watch:{
    selectedeColums(){
      this.updateColumns()
    }
  },
  methods: {
    updateColumns(){
        this.fields=[]
        if (this.selectedeColums.includes('name')){
          this.fields.push({ key:'name', sortable:true})
        }
        if (this.selectedeColums.includes('statusText')){
          this.fields.push({ key:'statusText', sortable:true, label:"Status"})
        }
        if (this.selectedeColums.includes('type')){
          this.fields.push({ key:'type', sortable:true})
        }
        if (this.selectedeColums.includes('operating_system')){
          this.fields.push({ key:'operating_system', sortable:true})
        }
        if (this.selectedeColums.includes('provider')){
          this.fields.push({ key:'provider', sortable:true})
        }
        if (this.selectedeColums.includes('publicIP')){
          this.fields.push({ key:'publicIP', sortable:true})
        }
        if (this.selectedeColums.includes('privateIP')){
          this.fields.push({ key:'privateIP', sortable:true})
        }
        if (this.selectedeColums.includes('network')){
          this.fields.push({ key:'network', sortable:true})
        }
        if (this.selectedeColums.includes('region')){
          this.fields.push({ key:'region', sortable:true})
        }
        if (this.selectedeColums.includes('zone')){
          this.fields.push({ key:'zone', sortable:true})
        }
        if (this.selectedeColums.includes('resources')){
            this.fields.push({ key:'cpu', sortable:true, label:"CPU"})
            this.fields.push({ key:'ram', sortable:true, label:"RAM"})
            this.fields.push({ key:'hdd', sortable:true, label:"HDD"})
        }
        if (this.selectedeColums.includes('manage')){
          this.fields.push({ key:'manage', sortable:false, label:" "})
        }
        if (this.$refs.table){
          this.$refs.table.refresh()
        }
        window.localStorage.setItem('selectedeColums', this.selectedeColums);


    },
    startMachine(machine){
      this.$parent.startMachine(this.$parent.clusterID, machine.name, machine.provider)
    },
    stopMachine(machine){
      this.$parent.stopMachine(this.$parent.clusterID, machine.name, machine.provider)
    },
    restartMachine(machine){
      this.$parent.restartMachine(this.$parent.clusterID, machine.name, machine.provider)
    },
    updateSelectedMachineDetails(machine){
      this.machineDetails = machine
      this.showDetailsVirtualMachine=true
      this.$bvModal.show("bv-modal-detailsvirtualmachine");
    },
    resizeStatus(reiszeStep, type){
      let currentStatus = ""
      if (type == 1) {
        if(reiszeStep >= 1 && reiszeStep <= 3){
          currentStatus = "Creating machines"
        }
        if(reiszeStep >= 4 && reiszeStep <= 10){
          currentStatus = "Configuring machines"
        }
        if(reiszeStep >= 11 && reiszeStep <= 14){
          currentStatus = "Adding machines to Kubernetes"
        }
        if(reiszeStep == 0){
          currentStatus = ""
        }
        if(reiszeStep <= -1 && reiszeStep >= -3){
          currentStatus = "Creating machines error"
        }
        if(reiszeStep <= -4 && reiszeStep >= -10){
          currentStatus = "Error configuring machines"
        }
        if(reiszeStep <= -11 && reiszeStep >= -14){
          currentStatus = "Error adding machines to Kubernetes"
        }
      }
      if (type==2){
        if(reiszeStep >= 1 && reiszeStep <= 3){
          currentStatus = "Creating machines"
        }
        if(reiszeStep >= 4 && reiszeStep <= 10){
          currentStatus = "Configuring machines"
        }
        if(reiszeStep == 0){
          currentStatus = ""
        }
        if(reiszeStep <= -1 && reiszeStep >= -3){
          currentStatus = "Creating machines error"
        }
        if(reiszeStep <= -4 && reiszeStep >= -10){
          currentStatus = "Error configuring machines"
        }
      }
      return currentStatus
    }
  }
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
.scrollable {
  /* padding-left: 225px; */
  overflow-x: auto;
}
.b-dropdown{
  background: #fff;
}
::v-deep .dropDownMenuButton .btn-secondary {
    color: #1d1e22 !important;
    font-weight: bold;
    background-color: #fff !important;
    border: none;
    box-shadow: none;
    outline: none;
}
::v-deep .dropDownMenuButton .btn-secondary:hover{
    color: #034758 !important;
    background-color: #fff !important;
    border: none;
}
::v-deep .dropDownMenuButton .btn-secondary:focus{
    color: #1d1e22 !important;
    background-color: #fff !important;
    border: none;
    box-shadow: none;
}
::v-deep .dropDownMenuButton .btn-secondary.focus{
    color: #1d1e22 !important;
    background-color: #fff !important;
    border: none;
    box-shadow: none;
}
::v-deep .dropDownMenuButton #createDropdown:active{
    border: none;
    box-shadow: none;
}
::v-deep .dropDownMenuButton .btn-secondary:not(:disabled):not(.disabled):active:focus, .btn-secondary:not(:disabled):not(.disabled).active:focus,
  .show > .btn-secondary.dropdown-toggle:focus {
    box-shadow: none;
  }
::v-deep .dropDownMenuButton .dropdown-menu{
    background-color: #fff;
    background-clip: padding-box;
    border: 2px solid #5f737950;
    border-radius: 0.35rem;
  }
</style>
