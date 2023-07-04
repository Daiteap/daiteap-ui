<template>
  <div>
    <div class="card daiteap-content-card p-0 m-0">
      <br />
      <br />
      <br />
      <b-card-group deck class="ml-2">
        <!-- aws -->
        <b-card v-if="
          computed_account_settings.providers_enable_aws &&
          this.computed_create_cluster_settings.cluster_type_number != 5 &&
          this.computed_create_cluster_settings.cluster_type_number != 8
        " no-body @click="awsProvided ? (form.awsSelected = !form.awsSelected) : ''" class="user-select-none my-3 mr-3 ml-0"
          :class="awsProvided ? 'custom-card' : 'custom-card-disabled'">
          <div>
            <img src="../../../assets/img/aws_logo_small.png" height="60rem" alt="Image" class="p-2 m-2" />
            <div class="my-3 ml-5 float-right m-3 customCheckbox"
              :class="{ checked: form.awsSelected, disabled: !awsProvided }" style="vertical-align: middle">
              <span v-if="form.awsSelected" class="fas fa-check checkboxCheckmark"></span>
            </div>
          </div>
          <div class="m-3">Amazon Web Services</div>
          <div v-on:click.stop="" style="cursor: initial">
            <div class="m-3">Cloud Credentials:</div>
            <div class="m-3">
              <select class="custom-select" v-model="selectedCredentials.aws" @change.stop="waitForRegionsFetch('aws')"
                :disabled="!form.awsSelected">
                <option v-for="item in credentials.filter(
                  (creds) => creds.provider == 'aws'
                )" :key="item.id" :value="item.id">
                  {{ item.label }}
                </option>
              </select>
            </div>
          </div>
          <div v-on:click.stop="" style="cursor: initial">
            <div class="m-3">Region:</div>
            <div class="m-3">
              <div v-if="regions.aws.updating" class="text-center">
                <div class="spinner-border text-primary" style="color: #eaebed !important" role="status"></div>
                <span>
                  The available resources are being updated, this will take a
                  few moments.
                </span>
              </div>
              <div v-else-if="regions.aws.loading" class="text-center">
                <div class="spinner-border text-primary" style="color: #eaebed !important" role="status">
                  <span class="sr-only">Loading...</span>
                </div>
              </div>
              <select v-else class="custom-select" v-model="selectedCredentials.awsRegion"
                @change.stop="selectRegion('aws')" :disabled="!form.awsSelected">
                <option v-for="item in regions.aws.regions" :key="item.value" :value="item.value">
                  {{ item.name }}
                </option>
              </select>
            </div>
          </div>
        </b-card>

        <!-- azure -->
        <b-card v-if="
          computed_account_settings.providers_enable_azure &&
          this.computed_create_cluster_settings.cluster_type_number != 5 &&
          this.computed_create_cluster_settings.cluster_type_number != 8
        " no-body @click="
  azureProvided ? (form.azureSelected = !form.azureSelected) : ''
" class="user-select-none m-3" :class="azureProvided ? 'custom-card' : 'custom-card-disabled'">
          <div>
            <img src="../../../assets/img/azure_logo_small.png" height="60rem" alt="Image" class="p-2 m-2" />
            <div class="my-3 ml-5 float-right m-3 customCheckbox"
              :class="{ checked: form.azureSelected, disabled: !azureProvided }" style="vertical-align: middle">
              <span v-if="form.azureSelected" class="fas fa-check checkboxCheckmark"></span>
            </div>
          </div>
          <div class="m-3">Microsoft Azure Cloud</div>
          <div v-on:click.stop="" style="cursor: initial">
            <div class="m-3">Cloud Credentials:</div>
            <div class="m-3">
              <select class="custom-select" v-model="selectedCredentials.azure"
                @change.stop="waitForRegionsFetch('azure')" :disabled="!form.azureSelected">
                <option v-for="item in credentials.filter(
                  (creds) => creds.provider == 'azure'
                )" :key="item.id" :value="item.id">
                  {{ item.label }}
                </option>
              </select>
            </div>
          </div>
          <div v-on:click.stop="" style="cursor: initial">
            <div class="m-3">Region:</div>
            <div class="m-3">
              <div v-if="regions.azure.updating" class="text-center">
                <div class="spinner-border text-primary" style="color: #eaebed !important" role="status"></div>
                <span>
                  The available resources are being updated, this will take a
                  few moments.
                </span>
              </div>
              <div v-else-if="regions.azure.loading" class="text-center">
                <div class="spinner-border text-primary" style="color: #eaebed !important" role="status">
                  <span class="sr-only">Loading...</span>
                </div>
              </div>
              <select v-else class="custom-select" v-model="selectedCredentials.azureRegion"
                @change.stop="selectRegion('azure')" :disabled="!form.azureSelected">
                <option v-for="item in regions.azure.regions" :key="item.value" :value="item.value">
                  {{ item.name }}
                </option>
              </select>
            </div>
          </div>
        </b-card>

        <!-- google -->
        <b-card v-if="
          computed_account_settings.providers_enable_gcp &&
          this.computed_create_cluster_settings.cluster_type_number != 5 &&
          this.computed_create_cluster_settings.cluster_type_number != 8
        " no-body @click="
  googleProvided ? (form.googleSelected = !form.googleSelected) : ''
" class="user-select-none m-3" :class="googleProvided ? 'custom-card' : 'custom-card-disabled'">
          <div>
            <img src="../../../assets/img/googleCloud_logo_small.png" height="60rem" alt="Image" class="p-2 m-2" />
            <div class="my-3 ml-5 float-right m-3 customCheckbox"
              :class="{ checked: form.googleSelected, disabled: !googleProvided }" style="vertical-align: middle">
              <span v-if="form.googleSelected" class="fas fa-check checkboxCheckmark"></span>
            </div>
          </div>
          <div class="m-3">Google Cloud Platform</div>
          <div v-on:click.stop="" style="cursor: initial">
            <div class="m-3">Cloud Credentials:</div>
            <div class="m-3">
              <select class="custom-select" v-model="selectedCredentials.google"
                @change.stop="waitForRegionsFetch('google')" :disabled="!form.googleSelected">
                <option v-for="item in credentials.filter(
                  (creds) => creds.provider == 'google'
                )" :key="item.id" :value="item.id">
                  {{ item.label }}
                </option>
              </select>
            </div>
          </div>
          <div v-on:click.stop="" style="cursor: initial">
            <div class="m-3">Region:</div>
            <div class="m-3">
              <div v-if="regions.google.updating" class="text-center">
                <div class="spinner-border text-primary" style="color: #eaebed !important" role="status"></div>
                <span>
                  The available resources are being updated, this will take a
                  few moments.
                </span>
              </div>
              <div v-else-if="regions.google.loading" class="text-center">
                <div class="spinner-border text-primary" style="color: #eaebed !important" role="status">
                  <span class="sr-only">Loading...</span>
                </div>
              </div>
              <select v-else class="custom-select" v-model="selectedCredentials.googleRegion"
                @change.stop="selectRegion('google')" :disabled="!form.googleSelected">
                <option v-for="item in regions.google.regions" :key="item.value" :value="item.value">
                  {{ item.name }}
                </option>
              </select>
            </div>
          </div>
        </b-card>
      </b-card-group>

      <b-card-group deck class="ml-2">
        <!-- openstack -->
        <b-card v-if="computed_account_settings.providers_enable_openstack" no-body @click="
          openstackProvided
            ? (form.openstackSelected = !form.openstackSelected)
            : ''
        " class="user-select-none m-3" :class="openstackProvided ? 'custom-card' : 'custom-card-disabled'">
          <div>
            <img v-if="computed_theme == 'daiteap'" src="../../../assets/img/openstack_logo_small.png" height="60rem"
              alt="Image" class="p-2 m-2" />
            <div class="my-3 ml-5 float-right m-3 customCheckbox"
              :class="{ checked: form.openstackSelected, disabled: !openstackProvided }" style="vertical-align: middle">
              <span v-if="form.openstackSelected" class="fas fa-check checkboxCheckmark"></span>
            </div>
          </div>
          <div class="m-3"><span class="openstack-text" /></div>
          <div v-on:click.stop="" style="cursor: initial">
            <div class="m-3">Cloud Credentials:</div>
            <div class="m-3">
              <select class="custom-select" v-model="selectedCredentials.openstack"
                @change.stop="waitForRegionsFetch('openstack')" :disabled="!form.openstackSelected">
                <option v-for="item in credentials.filter(
                  (creds) => creds.provider == 'openstack'
                )" :key="item.id" :value="item.id">
                  {{ item.label }}
                </option>
              </select>
            </div>
          </div>
          <div v-on:click.stop="" style="cursor: initial">
            <div class="m-3">Region:</div>
            <div class="m-3">
              <div v-if="regions.openstack.updating" class="text-center">
                <div class="spinner-border text-primary" style="color: #eaebed !important" role="status"></div>
                <span>
                  The available resources are being updated, this will take a
                  few moments.
                </span>
              </div>
              <div v-else-if="regions.openstack.loading" class="text-center">
                <div class="spinner-border text-primary" style="color: #eaebed !important" role="status">
                  <span class="sr-only">Loading...</span>
                </div>
              </div>
              <select v-else class="custom-select" v-model="selectedCredentials.openstackRegion"
                @change.stop="selectRegion('openstack')" :disabled="!form.openstackSelected">
                <option v-for="item in regions.openstack.regions" :key="item.value" :value="item.value">
                  {{ item.name }}
                </option>
              </select>
            </div>
          </div>
        </b-card>

        <!-- onpremise -->
        <b-card v-if="
          computed_account_settings.providers_enable_onprem &&
          this.computed_create_cluster_settings.cluster_type_number != 5 &&
          this.computed_create_cluster_settings.cluster_type_number != 8
        " no-body @click="
  onpremiseProvided
    ? (form.onpremiseSelected = !form.onpremiseSelected)
    : ''
" class="user-select-none m-3" :class="onpremiseProvided ? 'custom-card' : 'custom-card-disabled'">
          <div>
            <img src="../../../assets/img/onpremise.svg" height="60rem" alt="Image" class="p-2 m-2" />
            <div class="my-3 ml-5 float-right m-3 customCheckbox"
              :class="{ checked: form.onpremiseSelected, disabled: !onpremiseProvided }" style="vertical-align: middle">
              <span v-if="form.onpremiseSelected" class="fas fa-check checkboxCheckmark"></span>
            </div>
          </div>
          <div class="m-3">On-Premise</div>
          <div v-on:click.stop="" style="cursor: initial">
            <div class="m-3">Cloud Credentials:</div>
            <div class="m-3">
              <select class="custom-select" v-model="selectedCredentials.onpremise"
                @change.stop="selectRegion('onpremise')" :disabled="!form.onpremiseSelected">
                <option v-for="item in credentials.filter(
                  (creds) => creds.provider == 'onpremise'
                )" :key="item.id" :value="item.id">
                  {{ item.label }}
                </option>
              </select>
            </div>
          </div>
        </b-card>

        <!-- iotarm -->
        <b-card v-if="
          computed_account_settings.providers_enable_arm &&
          clusterType == 'K3S'
        " no-body @click="
  iotarmProvided ? (form.iotarmSelected = !form.iotarmSelected) : ''
" class="user-select-none m-3" :class="iotarmProvided ? 'custom-card' : 'custom-card-disabled'">
          <div>
            <img src="../../../assets/img/IoTArm_logo_small.svg" height="60rem" alt="Image" class="p-2 m-2" />
            <div class="my-3 ml-5 float-right m-3 customCheckbox"
              :class="{ checked: form.iotarmSelected, disabled: !iotarmProvided }" style="vertical-align: middle">
              <span v-if="form.iotarmSelected" class="fas fa-check checkboxCheckmark"></span>
            </div>
          </div>
          <div class="m-3">IOT ARM</div>
          <div v-on:click.stop="" style="cursor: initial">
            <div class="m-3">Cloud Credentials:</div>
            <div class="m-3">
              <select class="custom-select" v-model="selectedCredentials.iotarm" @change.stop="selectRegion('iotarm')"
                :disabled="!form.iotarmSelected">
                <option v-for="item in credentials.filter(
                  (creds) => creds.provider == 'iotarm'
                )" :key="item.id" :value="item.id">
                  {{ item.label }}
                </option>
              </select>
            </div>
          </div>
        </b-card>
      </b-card-group>
    </div>
  </div>
</template>

<script>
import {useVuelidate} from "@vuelidate/core";
import Vue from "vue";

export default {
  name: "StepProviders",
  props: ["clickedNext", "currentStep", "clusterType"],
  activated() {
    this.getAccountSettings();
  },
  mounted() {
    let self = this;

    this.$emit('set-show-cluster-details', false);
    self.$root.$on("clicking-back-" + Vue.prototype.$currentIndex, () =>
      (function () {
        self.$emit('set-show-cluster-details', true);
        self.$destroy();
      })()
    );
    this.axios
      .get(
        "/server/tenants/" +
          this.computed_active_tenant_id +
          "/cloud-credentials/check-provided-credentials",
        this.get_axiosConfig()
      )
      .then(function (response) {
        self.alicloudProvided = response.data.alicloud_key_provided;
        self.awsProvided = response.data.aws_key_provided;
        self.azureProvided = response.data.azure_key_provided;
        self.googleProvided = response.data.google_key_provided;
        self.openstackProvided = response.data.openstack_key_provided;
        self.onpremiseProvided = response.data.onpremise_key_provided;
        self.iotarmProvided = response.data.iotarm_key_provided;
      })
      .catch(function (error) {
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
            text: "Error while getting user information!",
          });
        }
      });

    this.getCloudCredentials();
    this.checkCanContinue();
  },
  methods: {
    async getCloudCredentials() {
      let credentials = await this.getCredentials();
      this.credentials = credentials.filter((creds) => creds.valid == true);
    },
    checkCanContinue() {
      let canContinue = true;
      let providersCount = 0;

      if (this.form.awsSelected) {
        if (
          this.selectedCredentials.aws == "" ||
          this.selectedCredentials.awsRegion == ""
        ) {
          canContinue = false;
        }
        providersCount += 1;
      }
      if (this.form.azureSelected) {
        if (
          this.selectedCredentials.azure == "" ||
          this.selectedCredentials.azureRegion == ""
        ) {
          canContinue = false;
        }
        providersCount += 1;
      }
      if (this.form.googleSelected) {
        if (
          this.selectedCredentials.google == "" ||
          this.selectedCredentials.googleRegion == ""
        ) {
          canContinue = false;
        }
        providersCount += 1;
      }
      if (this.form.openstackSelected) {
        if (
          this.selectedCredentials.openstack == "" ||
          this.selectedCredentials.openstackRegion == ""
        ) {
          canContinue = false;
        }
        providersCount += 1;
      }
      if (this.form.onpremiseSelected) {
        if (this.selectedCredentials.onpremise == "") {
          canContinue = false;
        }
        providersCount += 1;
      }
      if (this.form.iotarmSelected) {
        if (this.selectedCredentials.iotarm == "") {
          canContinue = false;
        }
        providersCount += 1;
      }
      if (providersCount == 0) {
        canContinue = false;
      }

      this.$emit("can-continue", { value: canContinue });
    },
    selectRegion(provider) {
      if (provider == "aws") {
        Vue.prototype.$finalModel.aws = {
          account: this.selectedCredentials.aws,
          region: this.selectedCredentials.awsRegion,
          nodes: [],
          vpcCidr: "10.10.0.0/16",
        };
      } else if (provider == "azure") {
        Vue.prototype.$finalModel.azure = {
          account: this.selectedCredentials.azure,
          region: this.selectedCredentials.azureRegion,
          nodes: [],
          vpcCidr: "10.20.0.0/16",
        };
      } else if (provider == "google") {
        Vue.prototype.$finalModel.google = {
          account: this.selectedCredentials.google,
          region: this.selectedCredentials.googleRegion,
          nodes: [],
          vpcCidr: "10.30.0.0/16",
        };
      } else if (provider == "openstack") {
        if (this.computed_create_cluster_settings.cluster_type_number == 5 || this.computed_create_cluster_settings.cluster_type_number == 8) {
          Vue.prototype.$finalModel.openstack = {
            account: this.selectedCredentials.openstack,
            region: this.selectedCredentials.openstackRegion,
            workerNodes: [],
            controlPlane: {},
          };
        } else {
          Vue.prototype.$finalModel.openstack = {
            account: this.selectedCredentials.openstack,
            region: this.selectedCredentials.openstackRegion,
            nodes: [],
            vpcCidr: "10.30.0.0/16",
          };
        }
      } else if (provider == "onpremise") {
        Vue.prototype.$finalModel.onpremise = {
          account: this.selectedCredentials.onpremise,
          operatingSystem: "",
          machines: [],
          vpcCidr: "",
        };
      } else if (provider == "iotarm") {
        Vue.prototype.$finalModel.iotarm = {
          account: this.selectedCredentials.iotarm,
          operatingSystem: "",
          machines: [],
          vpcCidr: "",
        };
      }

      this.checkCanContinue();
    },
    waitForRegionsFetch(provider) {
      let regions, credentialId;
      if (provider == "aws") {
        regions = this.regions.aws;
        credentialId = this.selectedCredentials.aws;
      } else if (provider == "azure") {
        regions = this.regions.azure;
        credentialId = this.selectedCredentials.azure;
      } else if (provider == "google") {
        regions = this.regions.google;
        credentialId = this.selectedCredentials.google;
      } else if (provider == "openstack") {
        regions = this.regions.openstack;
        credentialId = this.selectedCredentials.openstack;
      }

      regions.loading = true;
      let self = this;

      self.interval = setInterval(function () {
        self.axios
          .get(
            "/server/tenants/" +
              self.computed_active_tenant_id +
              "/cloud-credentials/" +
              credentialId +
              "/regions/update-status",
            self.get_axiosConfig()
          )
          .then(function (response) {
            let status, error;
            if (provider == "aws") {
              status = response.data.aws.status;
              error = response.data.aws.error;
            } else if (provider == "azure") {
              status = response.data.azure.status;
              error = response.data.azure.error;
            } else if (provider == "google") {
              status = response.data.google.status;
              error = response.data.google.error;
            } else if (provider == "openstack") {
              status = response.data.openstack.status;
              error = response.data.openstack.error;
            }

            if (status == 0) {
              // updated
              self.getProviderRegionsList(provider, credentialId, regions);
              regions.updating = false;
              clearInterval(self.interval);
              self.stopAllIntervals();
            } else if (status == -1) {
              // failed
              self.errorMsg = error;
              console.log(error);
              self.$notify({
                group: "msg",
                type: "error",
                title: "Notification:",
                text: "Error while getting regions updating status.",
              });
              clearInterval(self.interval);
              self.stopAllIntervals();
              regions.updating = false;
            } else if (status == 1) {
              regions.updating = true;
            } else {
              if (status != 1) {
                self.errorMsg = "Failed to get regions information";
                clearInterval(self.interval);
                self.stopAllIntervals();
                regions.updating = false;
                self.$notify({
                  group: "msg",
                  type: "error",
                  title: "Notification:",
                  text: "Failed to get regions information.",
                });
              }
            }
          })
          .catch(function (error) {
            clearInterval(self.interval);
            console.log(error);
            regions.updating = false;
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
                text: "Error while getting regions information.",
              });
            }
          });
      }, 1000);
      window.intervals.push(self.interval);
    },
    getProviderRegionsList(provider, credentialId, regions) {
      let self = this;
      this.axios
        .get(
          "/server/tenants/" +
            this.computed_active_tenant_id +
            "/cloud-credentials/" +
            credentialId +
            "/regions",
          this.get_axiosConfig()
        )
        .then(function (response) {
          regions.regions = [];
          for (let i = 0; i < response.data.regions.length; i++) {
            regions.regions.push({
              name: response.data.regions[i],
              value: response.data.regions[i],
            });
          }
          regions.loading = false;
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
              text: "Error while getting regions information. " + error,
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
      v$: useVuelidate(),
      account_settings: {
        providers_enable_gcp: false,
        providers_enable_aws: false,
        providers_enable_ali: false,
        providers_enable_azure: false,
        providers_enable_onprem: false,
        providers_enable_openstack: false,
        providers_enable_arm: false,
      },
      alicloudProvided: false,
      awsProvided: false,
      azureProvided: false,
      googleProvided: false,
      openstackProvided: false,
      onpremiseProvided: false,
      iotarmProvided: false,
      form: {
        alicloudSelected: false,
        awsSelected: false,
        googleSelected: false,
        openstackSelected: false,
        azureSelected: false,
        onpremiseSelected: false,
        iotarmSelected: false,
      },
      credentials: [],
      selectedCredentials: {
        aws: "",
        awsRegion: "",
        azure: "",
        azureRegion: "",
        google: "",
        googleRegion: "",
        openstack: "",
        openstackRegion: "",
        onpremise: "",
        iotarm: "",
      },
      regions: {
        aws: {
          regions: [],
          loading: false,
          updating: false,
        },
        azure: {
          regions: [],
          loading: false,
          updating: false,
        },
        google: {
          regions: [],
          loading: false,
          updating: false,
        },
        openstack: {
          regions: [],
          loading: false,
          updating: false,
        },
      },
      interval: "",
    };
  },
  validations: {
    form: {
      alicloudSelected: {},
      awsSelected: {},
      googleSelected: {},
      openstackSelected: {},
      azureSelected: {},
      onpremiseSelected: {},
      iotarmSelected: {},
    },
  },
  watch: {
    v$: {
      handler: function () {
        this.$root.$emit(
          "updateSteps",
          this.form.alicloudSelected,
          this.form.awsSelected,
          this.form.azureSelected,
          this.form.googleSelected,
          this.form.openstackSelected,
          this.form.onpremiseSelected,
          this.form.iotarmSelected
        );
        if (
          this.form.alicloudSelected == false &&
          this.form.awsSelected == false &&
          this.form.googleSelected == false &&
          this.form.openstackSelected == false &&
          this.form.azureSelected == false &&
          this.form.onpremiseSelected == false &&
          this.form.iotarmSelected == false
        ) {
          this.$emit("can-continue", { value: false });
          setTimeout(() => {
            this.$emit("change-next", { nextBtnValue: false });
          }, 3000);
        } else {
          Vue.prototype.$finalModel = {
            ...Vue.prototype.$finalModel,
            ...this.form,
          };
          this.$emit("can-continue", { value: true });
        }

        if (this.form.awsSelected == false) {
          Vue.prototype.$finalModel.awsSelected = false;
          delete Vue.prototype.$finalModel.aws;
        } else {
          if (
            this.selectedCredentials.aws &&
            this.selectedCredentials.awsRegion
          ) {
            Vue.prototype.$finalModel.aws = {
              account: this.selectedCredentials.aws,
              region: this.selectedCredentials.awsRegion,
              nodes: [],
              vpcCidr: "10.10.0.0/16",
            };
          }
        }
        if (this.form.azureSelected == false) {
          Vue.prototype.$finalModel.azureSelected = false;
          delete Vue.prototype.$finalModel.azure;
        } else {
          if (
            this.selectedCredentials.azure &&
            this.selectedCredentials.azureRegion
          ) {
            Vue.prototype.$finalModel.azure = {
              account: this.selectedCredentials.azure,
              region: this.selectedCredentials.azureRegion,
              nodes: [],
              vpcCidr: "10.20.0.0/16",
            };
          }
        }
        if (this.form.googleSelected == false) {
          Vue.prototype.$finalModel.googleSelected = false;
          delete Vue.prototype.$finalModel.google;
        } else {
          if (
            this.selectedCredentials.google &&
            this.selectedCredentials.googleRegion
          ) {
            Vue.prototype.$finalModel.google = {
              account: this.selectedCredentials.google,
              region: this.selectedCredentials.googleRegion,
              nodes: [],
              vpcCidr: "10.30.0.0/16",
            };
          }
        }
        if (this.form.openstackSelected == false) {
          Vue.prototype.$finalModel.openstackSelected = false;
          delete Vue.prototype.$finalModel.openstack;
        } else {
          if (
            this.selectedCredentials.openstack &&
            this.selectedCredentials.openstackRegion
          ) {
            if (this.computed_create_cluster_settings.cluster_type_number == 5 || this.computed_create_cluster_settings.cluster_type_number == 8) {
              Vue.prototype.$finalModel.openstack = {
                account: this.selectedCredentials.openstack,
                region: this.selectedCredentials.openstackRegion,
                workerNodes: [],
                controlPlane: {},
              };
            } else {
              Vue.prototype.$finalModel.openstack = {
                account: this.selectedCredentials.openstack,
                region: this.selectedCredentials.openstackRegion,
                nodes: [],
                vpcCidr: "10.30.0.0/16",
              };
            }
          }
        }
        if (this.form.onpremiseSelected == false) {
          Vue.prototype.$finalModel.onpremiseSelected = false;
          delete Vue.prototype.$finalModel.onpremise;
        } else {
          if (this.selectedCredentials.onpremise) {
            Vue.prototype.$finalModel.onpremise = {
              account: this.selectedCredentials.onpremise,
              operatingSystem: "",
              machines: [],
              vpcCidr: "",
            };
          }
        }
        if (this.form.iotarmSelected == false) {
          Vue.prototype.$finalModel.iotarmSelected = false;
          delete Vue.prototype.$finalModel.iotarm;
        } else {
          if (this.selectedCredentials.iotarm) {
            Vue.prototype.$finalModel.iotarm = {
              account: this.selectedCredentials.iotarm,
              operatingSystem: "",
              machines: [],
              vpcCidr: "",
            };
          }
        }

        this.checkCanContinue();
      },
      deep: true,
    },
  },
};
</script>

