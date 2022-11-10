<template>
  <div style="text-align: left">
    <div class="field">
      <div>
        <label v-if="!!$finalModel.clusterName" for="vpcCidr">VPC CIDR</label>
        <input
          class="form-control"
          :class="['input', ipConflicts && !vpcCidrFocus ? 'is-danger' : '']"
          type="text"
          placeholder
          v-model="form.openstack.vpcCidr"
          @input="checkForIpConflicts"
          @focus="vpcCidrFocus = true"
          @blur="vpcCidrFocus = false"
          v-if="!!$finalModel.clusterName"
        />
        <p v-if="ipConflicts && !vpcCidrFocus" class="help is-danger">
          Please enter a valid private Network that does not conflict with other
          providers Networks
        </p>

        <br />
        <br />

        <div class="h4 d-flex">
          <div class="mt-1">Define Nodes below</div>
          <div class="ml-auto mt-1"></div>
          <div class="ml-2">
            <AddButton text='Add Nodes' @onClickAddButton="addNodeGroup()" />
          </div>
        </div>
      </div>

      <br />
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
          <i
            class="fas fa-exclamation-circle"
            style="font-size: 1.5rem; color: red"
          ></i>
          <strong>
            Remember to <a @click="goToDocumentation()">check the quota</a> in
            your <span class="openstack-text" /> project. Otherwise the cluster
            creation will fail.
          </strong>
        </div>
      </div>

      <WarningAlert v-if="alert.show" color="warning" :closeOption="false">
        <div v-html="alert.msg"></div>
      </WarningAlert>

      <div class="row">
        <div
          v-for="(item, index) in nodeGroups"
          :key="index"
          :value="item.value"
          class="col-12 col-sm-6"
        >
          <NodeGroup
            @changedZone="updateNodesParams()"
            @updatedNodesParams="updateNodesParams()"
            @removeNodeGroup="removeNodeGroup(index)"
            :index="index"
            :item="item"
            :region="form.openstack.region"
            :nodeTypes="$finalModel.gatewayCloud === 'openstack' && index < 1 ? [nodeTypes[0]] : nodeTypes"
            :operatingSystems="operatingSystems"
            :loadingOperatingSystems="loadingOperatingSystems"
            :deleteButton="index < 1 ? false : true"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { validationMixin } from "vuelidate";
import { required, minLength } from "vuelidate/lib/validators";
import Vue from "vue";
import axios from "axios";
import "vue-slider-component/theme/default.css";
import NodeGroup from "../NodeGroup.vue";
import WarningAlert from "../WarningAlert.vue";
import AddButton from "@/components/platform/AddButton"

export default {
  name: "StepDLCMV2Openstack",
  props: ["clickedNext", "currentStep", "isInResize"],
  mixins: [validationMixin],
  components: {
    NodeGroup,
    WarningAlert,
    AddButton,
  },
  methods: {
    checkQuota() {
      if (this.userQuota === null) {
        return false;
      }

      let nodesCount = 0;

      for (const key in this.$finalModel) {
        if (Object.hasOwnProperty.call(this.$finalModel, key)) {
          if (this.$finalModel[key] != null && this.$finalModel[key].hasOwnProperty('nodes') && key != "openstack") {
            nodesCount += this.$finalModel[key].nodes.length;
          }
        }
      }

      nodesCount += this.form.openstack.nodes.length;

      if (this.userQuota["available_nodes"] + this.$existingNodesCount < nodesCount) {
        this.alert.show = true;
        this.alert.msg = `User quota exceeded. You can create only ${
          this.userQuota["available_nodes"] + this.$existingNodesCount
        } node${
          this.userQuota["available_nodes"] == 1 ? "" : "s"
        }. For more information, <a href="/documentation/users/#user-resource-quotas">check the documentation</a>.`;
        return false;
      } else {
        this.alert.show = false;
        return true;
      }
    },
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
      (this.instanceTypes = []), (this.form.openstack.region = "");
    },
    setForm() {
      let self = this;
      if (Vue.prototype.$finalModel.openstack) {
        this.form = {
          openstack: {
            account: Vue.prototype.$finalModel.openstack.account,
            region: Vue.prototype.$finalModel.openstack.region,
            nodes: Vue.prototype.$finalModel.openstack.nodes,
            vpcCidr: Vue.prototype.$finalModel.openstack.vpcCidr,
          },
        };

        if (Vue.prototype.$finalModel.openstack.nodes.length < 1) {
          self.getRegionZonesList();
          self.getOperatingSystemsList();
          return;
        }

        self.nodeGroups = [];

        let helper = {};

        for (let i = 0; i < self.form.openstack.nodes.length; i++) {
          let node = self.form.openstack.nodes[i];
          if (
            helper[
              node.instanceType + node.operatingSystem + node.is_control_plane
            ]
          ) {
            helper[
              node.instanceType + node.operatingSystem + node.is_control_plane
            ].nodes += 1;
          } else {
            helper[
              node.instanceType + node.operatingSystem + node.is_control_plane
            ] = {
              instanceTypes: [],
              loadingInstanceTypes: false,
              nodes: 1,
              nodeType: node.is_control_plane ? "Control plane" : "Worker",
              instanceType: node.instanceType,
              operatingSystem: node.operatingSystem,
            };
          }
        }

        for (let key in helper) {
          if (helper[key].nodeType == "Control plane") {
            while (helper[key].nodes > 15) {
              let nodeGroup = { ...helper[key] };
              nodeGroup.nodes = 15;
              self.nodeGroups.push(nodeGroup);
              helper[key].nodes -= 15;
            }
            if (helper[key].nodes > 0) {
              self.nodeGroups.push(helper[key]);
            }
          } else {
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
    },
    removeNodeGroup(index) {
      if (this.nodeGroups.length > 1) {
        this.nodeGroups.splice(index, 1);
      }
      this.updateNodesParams();
    },
    checkCanContinue() {
      if (this.ipConflicts || !this.checkQuota()) {
        this.$emit("can-continue", { value: false });
        setTimeout(() => {
          this.$emit("change-next", { nextBtnValue: false });
        }, 3000);
        return false;
      }

      let canContinue = true;
      if (this.form.openstack.nodes.length == 0 || 
        (
          this.isLastProvider("openstack") &&
          this.evenControlPlaneNodes()
        )) {
        canContinue = false;
      } else {
        for (
          let i = 0;
          i < this.form.openstack.nodes.length && canContinue;
          i++
        ) {
          if (
            this.form.openstack.nodes[i].instanceType == "" ||
            this.form.openstack.nodes[i].operatingSystem == ""
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
      while (this.form.openstack.nodes.length) {
        this.form.openstack.nodes.pop();
      }

      for (let i = 0; i < this.nodeGroups.length; i++) {
        for (let j = 0; j < this.nodeGroups[i].nodes; j++) {
          let isControlPlane = true;
          if (this.nodeGroups[i].nodeType == "Worker") {
            isControlPlane = false;
          }
          this.form.openstack.nodes.push({
            is_control_plane: isControlPlane,
            instanceType: this.nodeGroups[i].instanceType,
            operatingSystem: this.nodeGroups[i].operatingSystem,
          });
        }
      }
      this.checkCanContinue();
    },
    checkForIpConflicts(val) {
      this.checkCanContinue();
      let value = val.srcElement.value;
      let self = this;

      let networks = [];

      if ("kubernetesConfiguration" in this.$finalModel) {
        networks.push(this.$finalModel.kubernetesConfiguration.podsSubnet);
        networks.push(
          this.$finalModel.kubernetesConfiguration.serviceAddresses
        );
      }

      if ("aws" in this.$finalModel) {
        networks.push(this.$finalModel.aws.vpcCidr);
      }

      if ("alicloud" in this.$finalModel) {
        networks.push(this.$finalModel.alicloud.vpcCidr);
      }

      if ("azure" in this.$finalModel) {
        networks.push(this.$finalModel.azure.vpcCidr);
      }

      if ("onpremise" in this.$finalModel) {
        networks.push(this.$finalModel.onpremise.vpcCidr);
      }
      if ("iotarm" in this.$finalModel) {
        networks.push(this.$finalModel.iotarm.vpcCidr);
      }

      networks.push(self.form.openstack.vpcCidr);

      if (value && value.length > 0) {
        return new Promise((resolve) => {
          axios
            .post(
              "/server/checkforipconflicts",
              {
                networks: networks,
              },
              self.get_axiosConfig()
            )
            .then(function (response) {
              if (response.data.conflicts == true) {
                self.ipConflicts = true;
                self.checkCanContinue();
                resolve(false);
              } else {
                self.ipConflicts = false;
                self.checkCanContinue();
                resolve(true);
              }
            })
            .catch(function (error) {
              self.ipConflicts = true;
              self.checkCanContinue();
              console.log(error);
              self.$notify({
                group: "msg",
                type: "error",
                title: "Notification:",
                text: "Error while checking for IP conflicts! " + error,
              });
            });
        });
      } else {
        return false;
      }
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
          self.nodeGroups.map((nodeGroup) => {
            nodeGroup.loadingInstanceTypes = false;
          });
          self.updateNodesParams();
          self.checkCanContinue();
        })
        .catch(function (error) {
          self.errorMsg = error;
          console.log(error);
          self.$notify({
            group: "msg",
            type: "error",
            title: "Notification:",
            text: "Error while getting instances information! " + error,
          });
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
            "/environment-type/7/operating-systems",
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
          self.$notify({
            group: "msg",
            type: "error",
            title: "Notification:",
            text: "Error while getting operating systems information! " + error,
          });
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
      alert: {
        show: false,
        msg: "",
      },
      userQuota: null,
      errorMsg: "",
      vpcCidrFocus: false,
      loadingAccounts: true,
      loadingRegions: false,
      loadingOperatingSystems: false,
      updating: false,
      username: "",
      instanceTypes: [],
      nodeTypes: ["Control plane", "Worker"],
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
          nodes: 1,
          nodeType: "Worker",
          instanceType: "",
          operatingSystem: "",
        },
      ],
      form: {
        openstack: {
          account: "",
          region: "",
          nodes: [],
          vpcCidr: "10.30.0.0/16",
        },
      },
      provider: "openstack",
      accounts: [],
      regions: [],
      operatingSystems: [],
      ipConflicts: false,
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
        nodes: {
          required,
          $each: {
            is_control_plane: {
              required,
            },
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
  },
  watch: {
    $v: {
      handler: function (val) {
        if (!val.$invalid && !this.ipConflicts && this.checkCanContinue()) {
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
    window.intervals = [];
    this.getUserInfo();
  },
  mounted() {
    let self = this;

    Promise.resolve(self.getUserQuota()).then(function (userQuota) {
      self.userQuota = userQuota;
      self.checkCanContinue();
    });

    self.setForm();
    let cidr = { srcElement: { value: this.form.openstack.vpcCidr } };
    this.checkForIpConflicts(cidr);
    self.$root.$on("clicking-back-" + Vue.prototype.$currentIndex, () =>
      self.$destroy()
    );
    if (!this.$v.$invalid && !this.ipConflicts) {
      this.$emit("can-continue", { value: true });
    } else {
      this.$emit("can-continue", { value: false });
    }
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
