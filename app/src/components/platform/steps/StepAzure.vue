<template>
  <div style="text-align: left">
    <div class="field">
      <label for="vpcCidr">VPC CIDR</label>
      <input
        class="form-control"
        :class="['input', ipConflicts && !vpcCidrFocus ? 'is-danger' : '']"
        type="text"
        placeholder
        v-model="form.azure.vpcCidr"
        @input="checkForIpConflicts"
        @focus="vpcCidrFocus = true"
        @blur="vpcCidrFocus = false"
      />
      <p v-if="ipConflicts && !vpcCidrFocus" class="help is-danger">
        Please enter a valid private Network that does not conflict with other
        providers Networks
      </p>

      <br />
      <br />

      <div class="h4 d-flex">
        <div class="mt-1" v-if="!!$finalModel.kubernetesConfiguration">
          Define Nodes below
        </div>
        <div class="mt-1" v-else>Define VMs below</div>
        <div class="ml-auto mt-1" v-if="!!$finalModel.kubernetesConfiguration">
          Add nodes
        </div>
        <div class="ml-auto mt-1" v-else></div>
        <div class="ml-2">
          <AddButton text='Add VMs' @onClickAddButton="addNodeGroup()" />
        </div>
      </div>

      <br />
      <br />

      <div class="row">
        <div
          v-for="(item, index) in nodeGroups"
          :key="index"
          :value="item.value"
          class="col-12 col-sm-6"
        >
          <NodeGroup
            @changedZone="
              getZoneInstancesList(item);
              updateNodesParams();
            "
            @updatedNodesParams="updateNodesParams()"
            @removeNodeGroup="removeNodeGroup(index)"
            :index="index"
            :item="item"
            :zones="zones"
            :region="form.azure.region"
            :nodeTypes="nodeTypes"
            :loadingZones="loadingZones"
            :operatingSystems="operatingSystems"
            :loadingOperatingSystems="loadingOperatingSystems"
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
import AddButton from "@/components/platform/AddButton"

export default {
  name: "StepAzure",
  props: ["clickedNext", "currentStep"],
  mixins: [validationMixin],
  components: {
    NodeGroup,
    AddButton
  },
  methods: {
    setForm() {
      let self = this;
      if (Vue.prototype.$finalModel.azure) {
        this.form = {
          azure: {
            account: Vue.prototype.$finalModel.azure.account,
            region: Vue.prototype.$finalModel.azure.region,
            nodes: Vue.prototype.$finalModel.azure.nodes,
            vpcCidr: Vue.prototype.$finalModel.azure.vpcCidr,
          },
        };

        if (Vue.prototype.$finalModel.azure.nodes.length < 1) {
          self.getRegionZonesList();
          self.getOperatingSystemsList();
          return;
        }

        self.nodeGroups = [];

        let helper = {};
        for (let i = 0; i < self.form.azure.nodes.length; i++) {
          let node = self.form.azure.nodes[i];
          if (
            helper[
              node.zone +
                node.instanceType +
                node.operatingSystem +
                node.is_control_plane
            ]
          ) {
            helper[
              node.zone +
                node.instanceType +
                node.operatingSystem +
                node.is_control_plane
            ].nodes += 1;
          } else {
            helper[
              node.zone +
                node.instanceType +
                node.operatingSystem +
                node.is_control_plane
            ] = {
              instanceTypes: [],
              loadingInstanceTypes: false,
              nodes: 1,
              nodeType: node.is_control_plane ? "Control plane" : "Worker",
              zone: node.zone,
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

        self.getRegionZonesList();
        self.getOperatingSystemsList();

        for (let nodeGroup of self.nodeGroups) {
          self.getZoneInstancesList(nodeGroup);
        }
      }
    },
    addNodeGroup() {
      this.nodeGroups.push({
        instanceTypes: [],
        loadingInstanceTypes: false,
        nodes: 1,
        nodeType: "Worker",
        zone: "",
        instanceType: "",
        operatingSystem: "",
      });
      this.updateNodesParams();
    },
    removeNodeGroup(index) {
      this.nodeGroups.splice(index, 1);
      this.updateNodesParams();
    },
    checkCanContinue() {
      if (this.ipConflicts) {
        this.$emit("can-continue", { value: false });
        setTimeout(() => {
          this.$emit("change-next", { nextBtnValue: false });
        }, 3000);
        return false;
      }

      let canContinue = true;
      if (this.form.azure.nodes.length == 0) {
        canContinue = false;
      } else {
        for (let i = 0; i < this.form.azure.nodes.length && canContinue; i++) {
          if (
            this.form.azure.nodes[i].zone == "" ||
            this.form.azure.nodes[i].instanceType == "" ||
            this.form.azure.nodes[i].operatingSystem == ""
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
      while (this.form.azure.nodes.length) {
        this.form.azure.nodes.pop();
      }

      for (let i = 0; i < this.nodeGroups.length; i++) {
        for (let j = 0; j < this.nodeGroups[i].nodes; j++) {
          let isControlPlane = true;
          if (this.nodeGroups[i].nodeType == "Worker") {
            isControlPlane = false;
          }
          this.form.azure.nodes.push({
            is_control_plane: isControlPlane,
            zone: this.nodeGroups[i].zone,
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

      if ("google" in this.$finalModel) {
        networks.push(this.$finalModel.google.vpcCidr);
      }

      if ("onpremise" in this.$finalModel) {
        networks.push(this.$finalModel.onpremise.vpcCidr);
      }
      if ("iotarm" in this.$finalModel) {
        networks.push(this.$finalModel.iotarm.vpcCidr);
      }

      networks.push(self.form.azure.vpcCidr);

      if (value.length > 0) {
        return new Promise((resolve) => {
          axios
            .post(
              "/server/check-ip-conflicts",
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
    getRegionZonesList() {
      let self = this;
      self.loadingZones = true;
      axios
        .get(
          "/server/tenants/" +
            self.computed_active_tenant_id +
            "/cloud-credentials/" +
            self.form.azure.account +
            "/regions/" +
            self.form.azure.region +
            "/zones",
          this.get_axiosConfig()
        )
        .then(function (response) {
          self.zones = [];
          for (let i = 0; i < response.data.zones.length; i++) {
            self.zones.push({
              name: response.data.zones[i],
              value: response.data.zones[i],
            });
          }
          self.loadingZones = false;
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
              text: "Error while getting zones information! " + error,
            });
          }
        });
    },
    getZoneInstancesList(nodeGroup) {
      let self = this;
      nodeGroup.loadingInstanceTypes = true;
      axios
        .get(
          "/server/tenants/" +
            self.computed_active_tenant_id +
            "/cloud-credentials/" +
            self.form.azure.account +
            "/regions/" +
            self.form.azure.region +
            "/zones/" +
            nodeGroup.zone +
            "/instances",
          this.get_axiosConfig()
        )
        .then(function (response) {
          nodeGroup.instanceTypes = [];
          for (let i = 0; i < response.data.instances.length; i++) {
            nodeGroup.instanceTypes.push({
              name: response.data.instances[i].description,
              value: response.data.instances[i].name,
            });
          }
          nodeGroup.loadingInstanceTypes = false;
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
            self.form.azure.account +
            "/regions/" +
            self.form.azure.region +
            "/environment-type/1/operating-systems",
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
  },
  data() {
    return {
      errorMsg: "",
      vpcCidrFocus: false,
      loadingAccounts: true,
      loadingRegions: false,
      loadingZones: false,
      loadingOperatingSystems: false,
      updating: false,
      username: "",
      nodeTypes: ["Control plane", "Worker"],
      nodeGroups: [
        {
          instanceTypes: [],
          loadingInstanceTypes: false,
          nodes: 1,
          nodeType: "Worker",
          zone: "",
          instanceType: "",
          operatingSystem: "",
        },
      ],
      form: {
        azure: {
          account: "",
          region: "",
          nodes: [],
          vpcCidr: "10.20.0.0/16",
        },
      },
      provider: "azure",
      accounts: [],
      regions: [],
      zones: [],
      operatingSystems: [],
      ipConflicts: false,
    };
  },
  validations: {
    form: {
      azure: {
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
            zone: {
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
        if (!val.$invalid && !this.ipConflicts && this.checkCanContinue) {
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
    
    let cidr = { srcElement: { value: this.form.azure.vpcCidr } };
    this.checkForIpConflicts(cidr);
    self.$root.$on("clicking-back-" + Vue.prototype.$currentIndex, () =>
      self.$destroy()
    );
    if (!this.$v.$invalid && !this.ipConflicts) {
      this.$emit("can-continue", { value: true });
    } else {
      this.$emit("can-continue", { value: false });
    }
    window.intervals = [];
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
</style>