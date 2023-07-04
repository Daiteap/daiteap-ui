<template>
  <div style="text-align: left">
    <div class="field">
      <br />

      <div class="h4 d-flex">
        <div class="mt-1" v-if="!!$finalModel.kubernetesConfiguration">
          Define Nodes below
        </div>
        <div class="mt-1" v-else>Define VMs below</div>
        <div class="ml-auto mt-1" v-if="!!$finalModel.kubernetesConfiguration">
          
        </div>
        <div class="ml-auto mt-1" v-else>Add VMs</div>
        <div class="ml-2">
          <AddButton text='Add Nodes' @onClickAddButton="addNodeGroup()" />
        </div>
      </div>

      <div class="text-center">
        <div class="alert alert-warning" role="alert" style="text-align: left; color: black;">
          <i class="fas fa-exclamation-circle" style="font-size: 1.5rem; color: red;"></i>
          <strong>
            Remember to
            <a @click="goToDocumentation()">check the quota</a> in your
            your <span class="openstack-text"/> project. Otherwise the cluster creation will fail.
          </strong>
        </div>
      </div>

      <div class="row">
        <div
          v-for="(item, index) in nodeGroups"
          :key="index"
          :value="item.value"
          class="col-12 col-sm-6"
        >
          <NodeGroup
            @updatedNodesParams="updateNodesParams()"
            @removeNodeGroup="removeNodeGroup(index)"
            :index="index"
            :item="item"
            :region="form.openstack.region"
            :nodeTypes="nodeTypes"
            :operatingSystems="operatingSystems"
            :loadingOperatingSystems="loadingOperatingSystems"
            :deleteButton="index < 2 ? false : true"
            :disable_nodetype_selection="index < 2 ? true : false"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {useVuelidate} from "@vuelidate/core";
import { minLength, required } from "@vuelidate/validators";
import Vue from "vue";
import axios from "axios";
import "vue-slider-component/theme/default.css";
import NodeGroup from "../NodeGroup.vue";
import AddButton from "@/components/platform/AddButton"

export default {
  name: "StepCAPIOpenstack",
  props: ["clickedNext", "currentStep", "disableAccountSelector", "isInResize"],
  components: {
    NodeGroup,
    AddButton,
  },
  methods: {
    goToDocumentation() {
      window.open(
        "/documentation/users/#user-resource-quotas",
        "_blank"
      );
    },
    removeAccountParams() {
      this.nodeGroups.forEach((item) => {
        item.loadingInstanceTypes = false;
        item.instanceType = "";
        item.operatingSystem = "";
      });
      this.instanceTypes = [],
      this.form.openstack.region = ""
    },
    setForm() {
      let self = this;
      if (Vue.prototype.$finalModel.openstack) {
        this.form = {
          openstack: {
            account: Vue.prototype.$finalModel.openstack.account,
            region: Vue.prototype.$finalModel.openstack.region,
            workerNodes: Vue.prototype.$finalModel.openstack.workerNodes,
            controlPlane: Vue.prototype.$finalModel.openstack.controlPlane,
          },
        };

        if (Vue.prototype.$finalModel.openstack.nodes.length < 1) {
          self.getRegionZonesList();
          self.getOperatingSystemsList();
          return;
        }

        self.nodeGroups = [];

        self.nodeGroups.push({
          instanceTypes: [],
          loadingInstanceTypes: false,
          nodes: self.form.openstack.controlPlane.replicas,
          nodeType: "Control plane",
          instanceType: self.form.openstack.controlPlane.instanceType,
          operatingSystem: self.form.openstack.controlPlane.operatingSystem,
        });

        let helper = {};
        for (let i = 0; i < self.form.openstack.workerNodes.length; i++) {
          let workerNode = self.form.openstack.workerNodes[i];
          if (helper[workerNode.instanceType + workerNode.operatingSystem]) {
            helper[
              workerNode.instanceType + workerNode.operatingSystem
            ].nodes += 1;
          } else {
            helper[workerNode.instanceType + workerNode.operatingSystem] = {
              instanceTypes: [],
              loadingInstanceTypes: false,
              nodes: 1,
              nodeType: "Worker",
              instanceType: workerNode.instanceType,
              operatingSystem: workerNode.operatingSystem,
            };
          }
        }

        for (let key in helper) {
          while (helper[key].nodes > 10) {
            let nodeGroup = { ...helper[key] };
            nodeGroup.nodes = 10;
            self.nodeGroups.push(nodeGroup);
            helper[key].nodes -= 10;
          }
          if (helper[key].nodes > 0) {
            self.nodeGroups.push(helper[key]);
          }
        }

        self.getInstancesList();
        self.getOperatingSystemsList();
      }
    },
    addNodeGroup() {
      this.nodeGroups.push({
        instanceTypes: this.instanceTypes,
        loadingInstanceTypes: false,
        nodes: 1,
        nodeType: "Worker",
        instanceType: this.instanceTypes[0].value,
        operatingSystem: this.operatingSystems[0].value,
      });
      this.updateNodesParams();
      self.checkCanContinue();
    },
    removeNodeGroup(index) {
      if (this.nodeGroups.length > 2) {
        this.nodeGroups.splice(index, 1);
      }
      this.updateNodesParams();
    },
    checkCanContinue() {
      let canContinue = true;
      if (this.form.openstack.workerNodes.length == 0 || 
        (
          this.isLastProvider("openstack") &&
          this.evenControlPlaneNodes()
        )) {
        canContinue = false;
      } else {
        for (
          let i = 0;
          i < this.form.openstack.workerNodes.length && canContinue;
          i++
        ) {
          if (
            this.form.openstack.workerNodes[i].instanceType == "" ||
            this.form.openstack.workerNodes[i].operatingSystem == ""
          ) {
            canContinue = false;
          }
        }
      }
      this.$emit("can-continue", { value: canContinue });
      setTimeout(() => {
        this.$emit("change-next", { nextBtnValue: canContinue });
      }, 3000);
      return canContinue;
    },
    updateNodesParams() {
      this.form.openstack.workerNodes = [];
      this.form.openstack.controlPlane = {};

      this.form.openstack.controlPlane = {
        replicas: this.nodeGroups[0].nodes,
        instanceType: this.nodeGroups[0].instanceType,
        operatingSystem: this.nodeGroups[0].operatingSystem,
      };

      for (let i = 0; i < this.nodeGroups.length; i++) {
        for (let j = 0; j < this.nodeGroups[i].nodes; j++) {
          if (this.nodeGroups[i].nodeType == "Worker") {
            this.form.openstack.workerNodes.push({
              instanceType: this.nodeGroups[i].instanceType,
              operatingSystem: this.nodeGroups[i].operatingSystem,
            });
          }
        }
      }
      this.checkCanContinue();
    },
    getInstancesList() {
      let self = this;
      self.nodeGroups.forEach(function (nodeGroup) {
        nodeGroup.loadingInstanceTypes = true;
      });
      axios
        .get(
          "/server/tenants/" +
            self.computed_active_tenant_id +
            "/cloud-credentials/" +
            self.form.openstack.account +
            "/regions/" +
            self.form.openstack.region +
            "/instances",
          this.get_axiosConfig()
        )
        .then(function (response) {
          self.nodeGroups.map((nodeGroup) => {
            nodeGroup.instanceTypes = [];
          });
          self.instanceTypes = [];
          for (let i = 0; i < response.data.instances.length; i++) {
            self.instanceTypes.push({
              name: response.data.instances[i].description,
              value: response.data.instances[i].name,
            });
            self.nodeGroups.map((nodeGroup) => {
              nodeGroup.instanceTypes.push({
                name: response.data.instances[i].description,
                value: response.data.instances[i].name,
              });
              if (nodeGroup.instanceType === "") {
                nodeGroup.instanceType = response.data.instances[i].name;
              }
            });
          }

          for (let nodeGroup of self.nodeGroups) {
            for (let instanceType in nodeGroup.instanceTypes) {
              if (
                nodeGroup.instanceTypes[instanceType].name ==
                nodeGroup.instanceType
              ) {
                nodeGroup.instanceType =
                  nodeGroup.instanceTypes[instanceType].value;
              }
            }
          }
          self.nodeGroups.map((nodeGroup) => {
            nodeGroup.loadingInstanceTypes = false;
          });
          self.updateNodesParams();
          self.checkCanContinue();
        })
        .catch(function (error) {
          self.errorMsg = error;
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
              text: "Error while getting instances information! " + error,
            });
          }
        });
    },
    getOperatingSystemsList() {
      let self = this;
      self.loadingOperatingSystems = true;
      axios
        .get(
          "/server/tenants/" +
            self.computed_active_tenant_id +
            "/cloud-credentials/" +
            self.form.openstack.account +
            "/regions/" +
            self.form.openstack.region +
            "/environment-type/5/operating-systems",
          this.get_axiosConfig()
        )
        .then(function (response) {
          self.operatingSystems = [];
          for (let i = 0; i < response.data.operatingSystems.length; i++) {
            self.operatingSystems.push({
              name: response.data.operatingSystems[i].os,
              value: response.data.operatingSystems[i].value,
            });
          }
          self.loadingOperatingSystems = false;
          for (let operatingSystem of self.operatingSystems) {
            for (let nodeGroup in self.nodeGroups) {
              if (
                self.nodeGroups[nodeGroup].operatingSystem ===
                operatingSystem.name
              ) {
                self.nodeGroups[nodeGroup].operatingSystem =
                  operatingSystem.value;
              } else if (self.nodeGroups[nodeGroup].operatingSystem === "") {
                self.nodeGroups[nodeGroup].operatingSystem =
                  operatingSystem.value;
              }
            }
          }
          self.updateNodesParams();
          self.checkCanContinue();
        })
        .catch(function (error) {
          self.errorMsg = error;
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
              text: "Error while getting operating systems information! " + error,
            });
          }
        });
    },
    stopAllIntervals() {
      for (let i = 0; i < window.intervals.length; i++) {
        clearInterval(window.intervals[i]);
      }
      clearInterval(this.interval);
    },
    isLastProvider(provider) {
      if (provider == "onpremise"){
        return true;
      } else if (provider == "openstack" &&
        this.$finalModel.onpremiseSelected == false) {
        return true;
      } else if (provider == "iotarm" &&
        this.$finalModel.onpremiseSelected == false &&
        this.$finalModel.openstackSelected == false) {
        return true;
      } else if (provider == "google" &&
        this.$finalModel.onpremiseSelected == false &&
        this.$finalModel.openstackSelected == false &&
        this.$finalModel.iotarmSelected == false) {
        return true;
      } else if (provider == "azure" &&
        this.$finalModel.onpremiseSelected == false &&
        this.$finalModel.openstackSelected == false &&
        this.$finalModel.iotarmSelected == false &&
        this.$finalModel.googleSelected == false) {
        return true;
      } else if (provider == "aws" &&
        this.$finalModel.onpremiseSelected == false &&
        this.$finalModel.openstackSelected == false &&
        this.$finalModel.iotarmSelected == false &&
        this.$finalModel.googleSelected == false &&
        this.$finalModel.azureSelected == false) {
        return true;
      } else if (provider == "alicloud" &&
        this.$finalModel.onpremiseSelected == false &&
        this.$finalModel.openstackSelected == false &&
        this.$finalModel.iotarmSelected == false &&
        this.$finalModel.googleSelected == false &&
        this.$finalModel.azureSelected == false &&
        this.$finalModel.awsSelected == false) {
        return true;
      }
      return false;
    },
    evenControlPlaneNodes() {
      let cpNodes = 0;
      if (this.$finalModel.alicloudSelected){
        for (let i=0; i<this.$finalModel.alicloud.nodes.length; i++){
          if (this.$finalModel.alicloud.nodes[i].is_control_plane == true){
            cpNodes += 1;
          }
        }
      }
      if (this.$finalModel.awsSelected){
        for (let i=0; i<this.$finalModel.aws.nodes.length; i++){
          if (this.$finalModel.aws.nodes[i].is_control_plane == true){
            cpNodes += 1;
          }
        }
      }
      if (this.$finalModel.azureSelected){
        for (let i=0; i<this.$finalModel.azure.nodes.length; i++){
          if (this.$finalModel.azure.nodes[i].is_control_plane == true){
            cpNodes += 1;
          }
        }
      }
      if (this.$finalModel.googleSelected){
        for (let i=0; i<this.$finalModel.google.nodes.length; i++){
          if (this.$finalModel.google.nodes[i].is_control_plane == true){
            cpNodes += 1;
          }
        }
      }
      if (this.$finalModel.iotarmSelected){
        for (let i=0; i<this.$finalModel.iotarm.nodes.length; i++){
          if (this.$finalModel.iotarm.nodes[i].is_control_plane == true){
            cpNodes += 1;
          }
        }
      }
      if (this.$finalModel.openstackSelected){
        for (let i=0; i<this.form.openstack.nodes.length; i++){
          if (this.form.openstack.nodes[i].is_control_plane == true){
            cpNodes += 1;
          }
        }
      }
      if (this.$finalModel.onpremiseSelected){
        for (let i=0; i<this.$finalModel.onpremise.nodes.length; i++){
          if (this.$finalModel.onpremise.nodes[i].is_control_plane == true){
            cpNodes += 1;
          }
        }
      }

      if (cpNodes%2==0){
        return true;
      } else {
        return false;
      }
    }
  },
  data() {
    return {
      v$: useVuelidate(),
      errorMsg: "",
      loadingAccounts: true,
      loadingRegions: false,
      loadingOperatingSystems: false,
      updating: false,
      username: "",
      instanceTypes: [],
      nodeTypes: ["Control plane", "Worker"],
      controlNodeType: ["Control plane"],
      nodeGroups: [
        {
          instanceTypes: [],
          loadingInstanceTypes: false,
          nodes: 1,
          nodeType: "Control plane",
          instanceType: "",
          operatingSystem: "",
        },
        {
          instanceTypes: [],
          loadingInstanceTypes: false,
          nodes: 2,
          nodeType: "Worker",
          instanceType: "",
          operatingSystem: "",
        },
      ],
      form: {
        openstack: {
          account: "",
          region: "",
          workerNodes: [],
          controlPlane: {},
        },
      },
      provider: "openstack",
      accounts: [],
      regions: [],
      operatingSystems: [],
    };
  },
  validations: {
    form: {
      openstack: {
        account: {
          required,
          minLength: minLength(1),
        },
        region: {
          required,
          minLength: minLength(3),
        },
        workerNodes: {
          required,
          $each: {
            instanceType: {
              required,
            },
            operatingSystem: {
              required,
            },
          },
        },
        controlPlane: {
          required,
          instanceType: {
            required,
          },
          operatingSystem: {
            required,
          },
        },
      },
    },
  },

  watch: {
    v$: {
      handler: function (val) {
        if (!val.$invalid && this.checkCanContinue) {
          Vue.prototype.$finalModel = {
            ...Vue.prototype.$finalModel,
            ...this.form,
          };
          this.$emit("can-continue", { value: true });
        } else {
          this.$emit("can-continue", { value: false });
          setTimeout(() => {
            this.$emit("change-next", { nextBtnValue: false });
          }, 3000);
        }
      },
      deep: true,
    },
  },
  created() {
    this.getUserInfo();
  },
  mounted() {
    let self = this;
    self.setForm();
    self.$root.$on("clicking-back-" + Vue.prototype.$currentIndex, () =>
      self.$destroy()
    );
  },
  destroyed() {
    clearInterval(this.interval);
    for (let i = 0; i < window.intervals.length; i++) {
      clearInterval(window.intervals[i]);
    }
  },
};
</script>

<style scoped>
#errorMsg {
  max-height: 15rem;
}
.spinner-border {
  width: 2.15rem;
  height: 2.15rem;
}
.removeNodeGroupIcon {
  cursor: pointer;
  align-content: center;
  font-size: 1.5rem;
  padding-top: 0.2rem;
  color: #ea002f;
}
.instance-group {
  border: solid 1px rgb(29, 30, 34);
  border-radius: 0.6rem;
}
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
</style>