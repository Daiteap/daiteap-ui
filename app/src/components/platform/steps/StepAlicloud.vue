<template>
  <div style="text-align: left;">
    <div class="field">
      <div>
        <label for="region">Cloud Credentials</label>
      </div>
      <select
        v-model="form.alicloud.account"
        v-on:change="waitForRegionsFetch"
        class="custom-select d-block w-100"
        id="account"
        v-if="!loadingAccounts"
      >
        <option v-for="item in accounts" :key="item.id" :value="item.id">{{ item.label }}</option>
      </select>
      <div v-else class="text-center">
        <div class="spinner-border text-primary" style="color: #eaebed !important;" role="status">
          <span class="sr-only">Loading...</span>
        </div>
      </div>
      <br />
      <div>
        <label for="region">Region</label>
      </div>
      <select
        v-model="form.alicloud.region"
        v-on:change="getRegionZonesList();getOperatingSystemsList();"
        class="custom-select d-block w-100"
        id="region"
        :disabled="form.alicloud.account == ''"
        v-if="!loadingRegions"
      >
        <option v-for="item in regions" :key="item.value" :value="item.value">{{ item.name }}</option>
      </select>
      <div v-else-if="updating" class="text-center">
        <div class="spinner-border text-primary" style="color: #eaebed !important;" role="status">
        </div>
          <span> The available resources for <strong>{{form.alicloud.account}}</strong> are being updated, this will take a few moments.</span>
      </div>
      <div v-else class="text-center">
        <div class="spinner-border text-primary" style="color: #eaebed !important;" role="status">
          <span class="sr-only">Loading...</span>
        </div>
      </div>
      <br />
      <div>
        <label for="zone">Zone</label>
      </div>
      <select
        v-model="form.alicloud.zone"
        v-on:change="getZoneInstancesList"
        class="custom-select d-block w-100"
        id="zone"
        :disabled="form.alicloud.region == ''"
        v-if="!loadingZones"
      >
        <option v-for="item in zones" :key="item.value" :value="item.value">{{ item.name }}</option>
      </select>
      <div v-else class="text-center">
        <div class="spinner-border text-primary" style="color: #eaebed !important;" role="status">
          <span class="sr-only">Loading...</span>
        </div>
      </div>
      <br />
      <div>
        <label for="instanceType">Instance Type</label>
      </div>
      <select
        v-model="form.alicloud.instanceType"
        class="custom-select d-block w-100"
        id="instanceType"
        :disabled="form.alicloud.region == '' || form.alicloud.zone == ''"
        v-if="!loadingInstanceTypes"
      >
        <option v-for="item in instanceTypes" :key="item.value" :value="item.value">{{ item.name }}</option>
      </select>
      <div v-else class="text-center">
        <div class="spinner-border text-primary" style="color: #eaebed !important;" role="status">
          <span class="sr-only">Loading...</span>
        </div>
      </div>

      <br />
      <div>
        <label for="operatingSystem">Operating System</label>
      </div>
      <select
        v-model="form.alicloud.operatingSystem"
        class="custom-select d-block w-100"
        id="operatingSystem"
        :disabled="form.alicloud.region == '' || form.alicloud.zone == '' || form.alicloud.instanceType == '' || loadingOperatingSystems"
      >
        <option v-for="item in operatingSystems" :key="item.value" :value="item.value">{{ item.name }}</option>
      </select>

      <br />
      <label for="nodes">Number of Cluster Nodes including Control Plane Nodes</label>
      <input
        class="form-control"
        type="number"
        placeholder
        v-model="form.alicloud.nodes"
        :disabled="form.alicloud.region == '' || form.alicloud.zone == '' || form.alicloud.instanceType == '' || form.alicloud.operatingSystem == ''"
      />

      <br />
      <label for="vpcCidr">VPC CIDR</label>
      <input
        class="form-control"
        :class="['input', (ipConflicts && !vpcCidrFocus) ? 'is-danger' : '']"
        type="text"
        placeholder
        v-model="form.alicloud.vpcCidr"
        @input="checkForIpConflicts"
        @focus="vpcCidrFocus = true"
        @blur="vpcCidrFocus = false"
      />
      <p v-if="ipConflicts && !vpcCidrFocus" class="help is-danger">
        Please enter a valid private Network that does not conflict with other providers Networks
      </p>
    </div>
  </div>
</template>

<script>
import { validationMixin } from "vuelidate";
import { required, minValue, maxValue } from "vuelidate/lib/validators";
import Vue from "vue";
import axios from "axios";

export default {
  name: "StepAlicloud",
  props: ["clickedNext", "currentStep"],
  mixins: [validationMixin],
  methods: {
    checkCanContinue(){
    if (!this.$v.$invalid && !this.ipConflicts) {
      this.$emit("can-continue", { value: true });
    } else {
      this.$emit("can-continue", { value: false });
    }
    },
    checkForIpConflicts(val) {
      this.checkCanContinue()
      let value = val.srcElement.value
      let self = this;

      let networks = [];

      if ("kubernetesConfiguration" in this.$finalModel) {
        networks.push(this.$finalModel.kubernetesConfiguration.podsSubnet);
        networks.push(this.$finalModel.kubernetesConfiguration.serviceAddresses);
      }

      if ("aws" in this.$finalModel) {
        networks.push(this.$finalModel.aws.vpcCidr);
      }

      if ("google" in this.$finalModel) {
        networks.push(this.$finalModel.google.vpcCidr);
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

      networks.push(self.form.alicloud.vpcCidr);

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
                  self.ipConflicts = true
                  self.checkCanContinue()
                  resolve(false);
                } else {
                  self.ipConflicts = false
                  self.checkCanContinue()
                  resolve(true);
                }
              })
              .catch(function (error) {
                self.ipConflicts = true
                self.checkCanContinue()
                console.log(error);
                self.$notify({
                  group: "msg",
                  type: "error",
                  title: "Notification:",
                  text: "Error while checking for IP conflicts! "+error,
                });
              });
        });
      } else {
        return false;
      }
    },
    waitForRegionsFetch() {
      this.loadingRegions = true;
      let self = this;

      self.interval = setInterval(function() {
        self.axios
          .get(
            "/server/tenants/" +
              self.computed_active_tenant_id +
              "/cloud-credentials/" +
              self.form.alicloud.account +
              "/regions/update-status",
            self.get_axiosConfig()
          )
          .then(function(response) {
            let status = response.data.alicloud.status;
            if (status == 0) {
              // updated
              self.getProviderRegionsList();
              self.updating = false
              clearInterval(self.interval);
              self.stopAllIntervals()
            } else if (status == -1) {
              // failed
              self.errorMsg = response.data.alicloud.error;
              self.$parent.openShowErrorModal(self.errorMsg)
              clearInterval(self.interval);
              self.stopAllIntervals()
              self.updating = false
            } else if (status == 1) {
              self.updating = true
            } else {
              if (status != 1) {
                self.errorMsg = "Failed to get regions information";
                self.$parent.openShowErrorModal(self.errorMsg)
                clearInterval(self.interval);
                self.stopAllIntervals()
                self.updating = false
                self.$notify({
                  group: "msg",
                  type: "error",
                  title: "Notification:",
                  text: "Failed to get regions information",
                });
              }
            }
          })
          .catch(function(error) {
            clearInterval(self.interval);
            self.updating = false
            console.log(error);
            self.$notify({
              group: "msg",
              type: "error",
              title: "Notification:",
              text: "Error while getting detailed cloud credentials information!"
            });
          });
      }, 1000);
      window.intervals.push(self.interval);
    },
    getProviderAccountsList() {
      let self = this;
      axios
        .get(
          "/server/tenants/" +
            this.computed_active_tenant_id +
            "/cloud-credentials/providers/" +
            self.provider,
          this.get_axiosConfig()
        )
        .then(function(response) {
          for (let i = 0; i < response.data.accounts.length; i++) {
            self.accounts.push(response.data.accounts[i]);
          }
          self.loadingAccounts = false;
          if (self.accounts.length === 1){
            self.form.alicloud.account = self.accounts[0].id
            self.waitForRegionsFetch()
          }
        })
        .catch(function(error) {
          self.errorMsg = error;
          console.log(error);
          self.$notify({
            group: "msg",
            type: "error",
            title: "Notification:",
            text: "Error while getting cloud credentials information! "+error,
          });
        });
    },
    getProviderRegionsList() {
      let self = this;
      axios
        .get(
          "/server/tenants/" +
            this.computed_active_tenant_id +
            "/cloud-credentials/" +
            self.form.alicloud.account +
            "/regions",
          this.get_axiosConfig()
        )
        .then(function(response) {
          self.regions = [];
          for (let i = 0; i < response.data.regions.length; i++) {
            self.regions.push({
              name: response.data.regions[i],
              value: response.data.regions[i]
            });
          }
          self.loadingRegions = false;
        })
        .catch(function(error) {
          self.errorMsg = error;
          console.log(error);
          self.$notify({
            group: "msg",
            type: "error",
            title: "Notification:",
            text: "Error while getting regions information! "+error,
          });
        });
    },
    getRegionZonesList() {
      let self = this;
      self.loadingZones = true;
      axios
        .get(
          "/server/tenants/" +
            self.computed_active_tenant_id +
            "/cloud-credentials/" +
            self.form.alicloud.account +
            "/regions/" +
            self.form.alicloud.region +
            "/zones",
          this.get_axiosConfig()
        )
        .then(function(response) {
          self.zones = [];
          for (let i = 0; i < response.data.zones.length; i++) {
            self.zones.push({
              name: response.data.zones[i],
              value: response.data.zones[i]
            });
          }
          self.loadingZones = false;
        })
        .catch(function(error) {
          self.errorMsg = error;
          console.log(error);
          self.$notify({
            group: "msg",
            type: "error",
            title: "Notification:",
            text: "Error while getting zones information! "+error,
          });
        });
    },
    getZoneInstancesList() {
      let self = this;
      self.loadingInstanceTypes = true;
      axios
        .get(
          "/server/tenants/" +
            self.computed_active_tenant_id +
            "/cloud-credentials/" +
            self.form.alicloud.account +
            "/regions/" +
            self.form.alicloud.region +
            "/zones/" +
            self.form.alicloud.zone +
            "/instances",
          this.get_axiosConfig()
        )
        .then(function(response) {
          self.instanceTypes = [];
          for (let i = 0; i < response.data.instances.length; i++) {
            self.instanceTypes.push({
              name: response.data.instances[i].description,
              value: response.data.instances[i].name
            });
          }
          self.loadingInstanceTypes = false;
        })
        .catch(function(error) {
          self.errorMsg = error;
          console.log(error);
          self.$notify({
            group: "msg",
            type: "error",
            title: "Notification:",
            text: "Error while getting instances information! "+error,
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
            self.form.alicloud.account +
            "/regions/" +
            self.form.alicloud.region +
            "/environment-type/1/operating-systems",
          this.get_axiosConfig()
        )
        .then(function(response) {
          self.operatingSystems = []
          for (let i = 0; i < response.data.operatingSystems.length; i++) {
            self.operatingSystems.push({
              name: response.data.operatingSystems[i].os,
              value: response.data.operatingSystems[i].value
            });
          }
          self.loadingOperatingSystems = false;
        })
        .catch(function(error) {
          self.errorMsg = error;
          console.log(error);
          self.$notify({
            group: "msg",
            type: "error",
            title: "Notification:",
            text: "Error while getting operating systems information! "+error,
          });
        });
    },
    stopAllIntervals() {
      for (let i = 0; i < window.intervals.length; i++) {
      clearInterval(window.intervals[i]);
      }
      clearInterval(this.interval);
    }
  },
  data() {
    return {
      errorMsg: "",
      vpcCidrFocus: false,
      loadingAccounts: true,
      loadingRegions: false,
      loadingZones: false,
      loadingInstanceTypes: false,
      loadingOperatingSystems: false,
      updating:false,
      username: "",
      form: {
        alicloud: {
          account: "",
          region: "",
          zone: "",
          instanceType: "",
          operatingSystem: "",
          nodes: 1,
          vpcCidr: "10.0.0.0/16"
        }
      },
      accounts: [],
      provider: "alicloud",
      regions: [],
      zones: [],
      instanceTypes: [],
      operatingSystems: [],
      ipConflicts: false
    };
  },
  validations: {
    form: {
      alicloud: {
        account: {
          required
        },
        region: {
          required
        },
        zone: {
          required
        },
        instanceType: {
          required
        },
        operatingSystem: {
          required
        },
        nodes: {
          required,
          minValue: minValue(1),
          maxValue: maxValue(500)
        }
      }
    }
  },

  watch: {
    $v: {
      handler: function(val) {
        if (!val.$invalid && !this.ipConflicts) {
          Vue.prototype.$finalModel = {
            ...Vue.prototype.$finalModel,
            ...this.form
          };
          this.$emit("can-continue", { value: true });
        } else {
          this.$emit("can-continue", { value: false });
          setTimeout(() => {
            this.$emit("change-next", { nextBtnValue: false });
          }, 3000);
        }
      },
      deep: true
    }
  },
  created() {
    this.getProviderAccountsList();
    this.getUserInfo();
  },
  mounted() {
    let self = this;
    let cidr = {'srcElement': {'value': this.form.alicloud.vpcCidr}}
    this.checkForIpConflicts(cidr)
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
  }
};
</script>

<style scoped>
#errorMsg {
  max-height: 15rem;
}
.spinner-border{
  width: 2.15rem;
  height: 2.15rem;
}
</style>