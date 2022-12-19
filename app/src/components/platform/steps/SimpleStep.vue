<template>
  <div>
    <div class="card daiteap-content-card p-0 m-0">
      <br />
      <h4 class="mx-2">Choose Cloud Providers <br /></h4>
      <br />
      <b-card-group deck class="mx-2" style="
          border: 1px solid lightgray;
          padding: 20px 20px 20px 20px;
          border-radius: 10px;
        ">
        <!-- aws -->
        <b-card v-if="
          computed_account_settings.providers_enable_aws &&
          this.$selectedType != 5 &&
          this.$selectedType != 8
        " no-body @click="selectCloud('aws')" class="user-select-none m-3"
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
                @change.stop="selectRegion('aws')" :disabled="!form.awsSelected || calculatingSizes">
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
          this.$selectedType != 5 &&
          this.$selectedType != 8
        " no-body @click="selectCloud('azure')" class="user-select-none m-3"
          :class="azureProvided ? 'custom-card' : 'custom-card-disabled'">
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
                @change.stop="selectRegion('azure')" :disabled="!form.azureSelected || calculatingSizes">
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
          this.$selectedType != 5 &&
          this.$selectedType != 8
        " no-body @click="selectCloud('google')" class="user-select-none m-3"
          :class="googleProvided ? 'custom-card' : 'custom-card-disabled'">
          <div>
            <img src="../../../assets/img/googleCloud_logo_small.png" height="60rem" alt="Image" class="p-2 m-2" />
            <div class="my-3 ml-5 float-right m-3 customCheckbox" :class="{
              checked: form.googleSelected,
              disabled: !googleProvided,
            }" style="vertical-align: middle">
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
                @change.stop="selectRegion('google')" :disabled="!form.googleSelected || calculatingSizes">
                <option v-for="item in regions.google.regions" :key="item.value" :value="item.value">
                  {{ item.name }}
                </option>
              </select>
            </div>
          </div>
        </b-card>
      </b-card-group>

      <br /><br /><br />
      <WarningAlert v-if="showAlert" msg="Resource quota exceeded." color="warning" :key="alertKey"
        link="/documentation/users/#user-resource-quotas" class="ml-2" style="max-width: 90rem" />
      <br />

      <h4 class="mx-2">Select Kubernetes Cluster Size <br /></h4>
      <div v-if="calculatingSizes" class="mx-2">
        <b-spinner style="width: 1rem; height: 1rem" variant="info" class="mr-2"></b-spinner>Please wait, calculating
        resources... <br />
      </div>

      <br />
      <div class="mx-2" style="
          border: 1px solid lightgray;
          padding: 20px 20px 20px 20px;
          border-radius: 10px;
        ">
        <b-card-group deck class="mx-2">
          <!-- small -->
          <b-card no-body @click="selectSize('small')" class="user-select-none m-3 custom-card">
            <div>
              <img src="../../../assets/img/kubernetes_icon.png" height="60rem" alt="Image" class="p-2 m-2" />
              <span>Size S</span>
              <input type="radio" name="clusterSize" value="small" @change="selectSize('small')" checked
                class="my-3 ml-5 custom-checkbox-size float-right m-3" />
            </div>
            <div class="m-3">
              Control Planes: {{ sizes.small.controls }} <br />
              Worker Nodes: {{ sizes.small.workers }} <br />
              vCPU: {{ sizes.small.cpu }} <br />
              Memory: {{ sizes.small.memory }} GB <br />
              Storage: {{ sizes.small.storage }} GB <br />
            </div>
          </b-card>

          <!-- medium -->
          <b-card no-body @click="selectSize('medium')" class="user-select-none m-3 custom-card">
            <div>
              <img src="../../../assets/img/kubernetes_icon.png" height="60rem" alt="Image" class="p-2 m-2" />
              <span>Size M</span>
              <input type="radio" name="clusterSize" value="medium" @change="selectSize('medium')"
                class="my-3 ml-5 custom-checkbox-size float-right m-3" />
            </div>
            <div class="m-3">
              Control Planes: {{ sizes.medium.controls }} <br />
              Worker Nodes: {{ sizes.medium.workers }} <br />
              vCPU: {{ sizes.medium.cpu }} <br />
              Memory: {{ sizes.medium.memory }} GB <br />
              Storage: {{ sizes.medium.storage }} GB <br />
            </div>
          </b-card>

          <!-- large -->
          <b-card no-body @click="selectSize('large')" class="user-select-none m-3 custom-card">
            <div>
              <img src="../../../assets/img/kubernetes_icon.png" height="60rem" alt="Image" class="p-2 m-2" />
              <span>Size L</span>
              <input type="radio" name="clusterSize" value="large" @change="selectSize('large')"
                class="my-3 ml-5 custom-checkbox-size float-right m-3" />
            </div>
            <div class="m-3">
              Control Planes: {{ sizes.large.controls }} <br />
              Worker Nodes: {{ sizes.large.workers }} <br />
              vCPU: {{ sizes.large.cpu }} <br />
              Memory: {{ sizes.large.memory }} GB <br />
              Storage: {{ sizes.large.storage }} GB <br />
            </div>
          </b-card>

          <!-- xl -->
          <b-card no-body @click="selectSize('xl')" class="user-select-none m-3 custom-card">
            <div>
              <img src="../../../assets/img/kubernetes_icon.png" height="60rem" alt="Image" class="p-2 m-2" />
              <span>Size XL</span>
              <input type="radio" name="clusterSize" value="xl" @change="selectSize('xl')"
                class="my-3 ml-5 custom-checkbox-size float-right m-3" />
            </div>
            <div class="m-3">
              Control Planes: {{ sizes.xl.controls }} <br />
              Worker Nodes: {{ sizes.xl.workers }} <br />
              vCPU: {{ sizes.xl.cpu }} <br />
              Memory: {{ sizes.xl.memory }} GB <br />
              Storage: {{ sizes.xl.storage }} GB <br />
            </div>
          </b-card>

        </b-card-group>
        <div class="m-3 pl-2">
          <br />
          <toggle-button :value="highAvailability" @input="changeHighAvailability()" :disabled="calculatingSizes"
            sync />
          &nbsp;
          <span>
            Switch on High Availability to get 3 Control Plane Nodes as default
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { validationMixin } from "vuelidate";
import Vue from "vue";
import WarningAlert from "@/components/platform/WarningAlert";

export default {
  name: "SimpleStep",
  components: {
    WarningAlert,
  },
  props: ["clickedNext", "currentStep"],
  mixins: [validationMixin],
  activated() {
    this.getAccountSettings();
  },
  created() {
    this.clearSizes();

    delete Vue.prototype.$finalModel.aws;
    delete Vue.prototype.$finalModel.azure;
    delete Vue.prototype.$finalModel.google;
    delete Vue.prototype.$finalModel.load_balancer_integration;
  },
  mounted() {
    let self = this;

    this.$parent.$parent.$parent.showClusterDetails = false;
    self.$root.$on("clicking-back-" + Vue.prototype.$currentIndex, () =>
      (function () {
        self.$parent.$parent.$parent.showClusterDetails = true;
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
        self.awsProvided = response.data.aws_key_provided;
        self.azureProvided = response.data.azure_key_provided;
        self.googleProvided = response.data.google_key_provided;
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

    setInterval(() => {
      this.checkCanContinue();
      this.selectLoadBalancer();
    }, 1000);
  },
  methods: {
    async getCloudCredentials() {
      let credentials = await this.getCredentials();
      this.credentials = credentials.filter((creds) => creds.valid == true);
    },
    selectCloud(provider) {
      if (!this.calculatingSizes) {
        if (provider == "aws") {
          if (this.awsProvided) {
            this.form.awsSelected = !this.form.awsSelected;
          }
        } else if (provider == "azure") {
          if (this.azureProvided) {
            this.form.azureSelected = !this.form.azureSelected;
          }
        } else if (provider == "google") {
          if (this.googleProvided) {
            this.form.googleSelected = !this.form.googleSelected;
          }
        }
      }
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
      if (providersCount == 0) {
        canContinue = false;
      }

      if (this.calculatingSizes) {
        canContinue = false;
      }
      if (this.showAlert) {
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
      }

      this.calculateSizes();
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
    selectSize(size) {
      if (!this.calculatingSizes) {
        this.clusterSize = size;

        var buttons = document.getElementsByName("clusterSize");
        for (let i = 0; i < buttons.length; i++) {
          if (buttons[i].value == size) {
            buttons[i].checked = true;
          }
        }

        this.addSizeInfo();
      }
    },
    async calculateSizes() {
      this.clearSizes();
      this.calculatingSizes = true;
      let selectedProviders = [];
      let model = Vue.prototype.$finalModel;
      let ipConflicts = await this.ipConflictsExist();

      if (!ipConflicts) {
        // Get zones, os, instances and selected providers
        if (model.aws) {
          selectedProviders.push("aws");

          this.regions.aws.zones = await this.getRegionZonesList(
            "aws",
            model.aws.account,
            model.aws.region
          );
          this.sizes.awsZone = this.regions.aws.zones[0];

          this.regions.aws.os = await this.getOperatingSystemsList(
            "aws",
            model.aws.account,
            model.aws.region
          );
          this.sizes.awsOS = this.regions.aws.os[0];

          this.regions.aws.instances = await this.getZoneInstancesList(
            "aws",
            model.aws.account,
            model.aws.region,
            this.regions.aws.zones[0]
          );
          this.sizes.awsInstance = this.regions.aws.instances[0];
        }

        if (model.azure) {
          selectedProviders.push("azure");

          this.regions.azure.zones = await this.getRegionZonesList(
            "azure",
            model.azure.account,
            model.azure.region
          );
          this.sizes.azureZone = this.regions.azure.zones[0];

          this.regions.azure.os = await this.getOperatingSystemsList(
            "azure",
            model.azure.account,
            model.azure.region
          );
          this.sizes.azureOS = this.regions.azure.os[0];

          this.regions.azure.instances = await this.getZoneInstancesList(
            "azure",
            model.azure.account,
            model.azure.region,
            this.regions.azure.zones[0]
          );
          this.sizes.azureInstance = this.regions.azure.instances[0];
        }

        if (model.google) {
          selectedProviders.push("google");

          this.regions.google.zones = await this.getRegionZonesList(
            "google",
            model.google.account,
            model.google.region
          );
          this.sizes.googleZone = this.regions.google.zones[0];

          this.regions.google.os = await this.getOperatingSystemsList(
            "google",
            model.google.account,
            model.google.region
          );
          this.sizes.googleOS = this.regions.google.os[0];

          this.regions.google.instances = await this.getZoneInstancesList(
            "google",
            model.google.account,
            model.google.region,
            this.regions.google.zones[0]
          );
          this.sizes.googleInstance = this.regions.google.instances[0];
        }

        // add cp count to sizes
        let cpCount = 1;
        if (this.highAvailability) {
          cpCount = 3;
        }
        this.sizes.small.controls = cpCount;
        this.sizes.medium.controls = cpCount;
        this.sizes.large.controls = cpCount;
        this.sizes.xl.controls = cpCount;

        // calculate sizes - 1 provider
        if (selectedProviders.length == 1) {
          // add wn count to sizes
          this.sizes.small.workers = 1;
          this.sizes.medium.workers = 2;
          this.sizes.large.workers = 3;
          this.sizes.xl.workers = 4;

          // add cp nodes to sizes and worker nodes for size S
          for (let i = 0; i < this.sizes.small.controls; i++) {
            this.addNode(selectedProviders[0], "small", true);
          }
          for (let i = 0; i < this.sizes.medium.controls; i++) {
            this.addNode(selectedProviders[0], "medium", true);
          }
          for (let i = 0; i < this.sizes.large.controls; i++) {
            this.addNode(selectedProviders[0], "large", true);
          }
          for (let i = 0; i < this.sizes.xl.controls; i++) {
            this.addNode(selectedProviders[0], "xl", true);
          }
          for (let i = 0; i < this.sizes.small.workers; i++) {
            this.addNode(selectedProviders[0], "small", false);
          }
        }

        // calculate sizes - 2 providers
        if (selectedProviders.length == 2) {
          // add wn count to sizes
          this.sizes.small.workers = 2;
          this.sizes.medium.workers = 4;
          this.sizes.large.workers = 6;
          this.sizes.xl.workers = 8;

          // add cp nodes to sizes and worker nodes for size S
          if (cpCount == 1) {
            let provider = this.getRandomProvider();
            this.addNode(provider, "small", true);
            this.addNode(provider, "medium", true);
            this.addNode(provider, "large", true);
            this.addNode(provider, "xl", true);

          } else {
            let provider = this.getRandomProvider();
            this.addNode(provider, "small", true);
            this.addNode(provider, "small", true);
            this.addNode(provider, "medium", true);
            this.addNode(provider, "medium", true);
            this.addNode(provider, "large", true);
            this.addNode(provider, "large", true);
            this.addNode(provider, "xl", true);
            this.addNode(provider, "xl", true);

            if (provider == selectedProviders[0]) {
              this.addNode(selectedProviders[1], "small", true);
              this.addNode(selectedProviders[1], "medium", true);
              this.addNode(selectedProviders[1], "large", true);
              this.addNode(selectedProviders[1], "xl", true);
            } else {
              this.addNode(selectedProviders[0], "small", true);
              this.addNode(selectedProviders[0], "medium", true);
              this.addNode(selectedProviders[0], "large", true);
              this.addNode(selectedProviders[0], "xl", true);
            }
          }

          this.addNode(selectedProviders[0], "small", false);
          this.addNode(selectedProviders[1], "small", false);
        }

        // calculate sizes - 3 providers
        if (selectedProviders.length == 3) {
          // add wn count to sizes
          this.sizes.small.workers = 3;
          this.sizes.medium.workers = 6;
          this.sizes.large.workers = 9;
          this.sizes.xl.workers = 12;

          // add cp nodes to sizes and worker nodes for size S
          if (cpCount == 1) {
            let provider = this.getRandomProvider();
            this.addNode(provider, "small", true);
            this.addNode(provider, "medium", true);
            this.addNode(provider, "large", true);
            this.addNode(provider, "xl", true);
          } else {
            this.addNode(selectedProviders[0], "small", true);
            this.addNode(selectedProviders[1], "small", true);
            this.addNode(selectedProviders[2], "small", true);
            this.addNode(selectedProviders[0], "medium", true);
            this.addNode(selectedProviders[1], "medium", true);
            this.addNode(selectedProviders[2], "medium", true);
            this.addNode(selectedProviders[0], "large", true);
            this.addNode(selectedProviders[1], "large", true);
            this.addNode(selectedProviders[2], "large", true);
            this.addNode(selectedProviders[0], "xl", true);
            this.addNode(selectedProviders[1], "xl", true);
            this.addNode(selectedProviders[2], "xl", true);
          }

          this.addNode(selectedProviders[0], "small", false);
          this.addNode(selectedProviders[1], "small", false);
          this.addNode(selectedProviders[2], "small", false);
        }

        // add worker nodes to sizes
        for (
          let i = 0;
          i < this.sizes.medium.workers / selectedProviders.length;
          i++
        ) {
          for (let j = 0; j < selectedProviders.length; j++) {
            this.addNode(selectedProviders[j], "medium", false);
          }
        }
        for (
          let i = 0;
          i < this.sizes.large.workers / selectedProviders.length;
          i++
        ) {
          for (let j = 0; j < selectedProviders.length; j++) {
            this.addNode(selectedProviders[j], "large", false);
          }
        }
        for (
          let i = 0;
          i < this.sizes.xl.workers / selectedProviders.length;
          i++
        ) {
          for (let j = 0; j < selectedProviders.length; j++) {
            this.addNode(selectedProviders[j], "xl", false);
          }
        }

        // add size details
        if (model.aws) {
          let instanceValues = this.getNumbersFromInstanceDetails(
            this.sizes.awsInstance.details
          );
          this.sizes.small.cpu +=
            this.sizes.small.awsNodes.length * instanceValues[0];
          this.sizes.small.memory +=
            this.sizes.small.awsNodes.length * instanceValues[1];
          this.sizes.small.storage +=
            this.sizes.small.awsNodes.length * instanceValues[2];
          this.sizes.medium.cpu +=
            this.sizes.medium.awsNodes.length * instanceValues[0];
          this.sizes.medium.memory +=
            this.sizes.medium.awsNodes.length * instanceValues[1];
          this.sizes.medium.storage +=
            this.sizes.medium.awsNodes.length * instanceValues[2];
          this.sizes.large.cpu +=
            this.sizes.large.awsNodes.length * instanceValues[0];
          this.sizes.large.memory +=
            this.sizes.large.awsNodes.length * instanceValues[1];
          this.sizes.large.storage +=
            this.sizes.large.awsNodes.length * instanceValues[2];
          this.sizes.xl.cpu +=
            this.sizes.xl.awsNodes.length * instanceValues[0];
          this.sizes.xl.memory +=
            this.sizes.xl.awsNodes.length * instanceValues[1];
          this.sizes.xl.storage +=
            this.sizes.xl.awsNodes.length * instanceValues[2];
        }
        if (model.azure) {
          let instanceValues = this.getNumbersFromInstanceDetails(
            this.sizes.azureInstance.details
          );
          this.sizes.small.cpu +=
            this.sizes.small.azureNodes.length * instanceValues[0];
          this.sizes.small.memory +=
            this.sizes.small.azureNodes.length * instanceValues[1];
          this.sizes.small.storage +=
            this.sizes.small.azureNodes.length * instanceValues[2];
          this.sizes.medium.cpu +=
            this.sizes.medium.azureNodes.length * instanceValues[0];
          this.sizes.medium.memory +=
            this.sizes.medium.azureNodes.length * instanceValues[1];
          this.sizes.medium.storage +=
            this.sizes.medium.azureNodes.length * instanceValues[2];
          this.sizes.large.cpu +=
            this.sizes.large.azureNodes.length * instanceValues[0];
          this.sizes.large.memory +=
            this.sizes.large.azureNodes.length * instanceValues[1];
          this.sizes.large.storage +=
            this.sizes.large.azureNodes.length * instanceValues[2];
          this.sizes.xl.cpu +=
            this.sizes.xl.azureNodes.length * instanceValues[0];
          this.sizes.xl.memory +=
            this.sizes.xl.azureNodes.length * instanceValues[1];
          this.sizes.xl.storage +=
            this.sizes.xl.azureNodes.length * instanceValues[2];
        }
        if (model.google) {
          let instanceValues = this.getNumbersFromInstanceDetails(
            this.sizes.googleInstance.details
          );
          this.sizes.small.cpu +=
            this.sizes.small.googleNodes.length * instanceValues[0];
          this.sizes.small.memory +=
            this.sizes.small.googleNodes.length * instanceValues[1];
          this.sizes.small.storage +=
            this.sizes.small.googleNodes.length * instanceValues[2];
          this.sizes.medium.cpu +=
            this.sizes.medium.googleNodes.length * instanceValues[0];
          this.sizes.medium.memory +=
            this.sizes.medium.googleNodes.length * instanceValues[1];
          this.sizes.medium.storage +=
            this.sizes.medium.googleNodes.length * instanceValues[2];
          this.sizes.large.cpu +=
            this.sizes.large.googleNodes.length * instanceValues[0];
          this.sizes.large.memory +=
            this.sizes.large.googleNodes.length * instanceValues[1];
          this.sizes.large.storage +=
            this.sizes.large.googleNodes.length * instanceValues[2];
          this.sizes.xl.cpu +=
            this.sizes.xl.googleNodes.length * instanceValues[0];
          this.sizes.xl.memory +=
            this.sizes.xl.googleNodes.length * instanceValues[1];
          this.sizes.xl.storage +=
            this.sizes.xl.googleNodes.length * instanceValues[2];
        }

        this.addSizeInfo();
        this.calculatingSizes = false;
      }
    },
    addNode(provider, selectedSize, isCP) {
      let nodes, zone, os, instance, size;

      if (selectedSize == "small") {
        size = this.sizes.small;
      } else if (selectedSize == "medium") {
        size = this.sizes.medium;
      } else if (selectedSize == "large") {
        size = this.sizes.large;
      } else if (selectedSize == "xl") {
        size = this.sizes.xl;
      }

      if (provider == "aws") {
        zone = this.sizes.awsZone;
        os = this.sizes.awsOS;
        instance = this.sizes.awsInstance;
        nodes = size.awsNodes;
      } else if (provider == "azure") {
        zone = this.sizes.azureZone;
        os = this.sizes.azureOS;
        instance = this.sizes.azureInstance;
        nodes = size.azureNodes;
      } else if (provider == "google") {
        zone = this.sizes.googleZone;
        os = this.sizes.googleOS;
        instance = this.sizes.googleInstance;
        nodes = size.googleNodes;
      }

      nodes.push({
        is_control_plane: isCP,
        zone: zone,
        instanceType: instance.value,
        operatingSystem: os,
      });
    },
    addSizeInfo() {
      let size;
      if (this.clusterSize == "small") {
        size = this.sizes.small;
      } else if (this.clusterSize == "medium") {
        size = this.sizes.medium;
      } else if (this.clusterSize == "large") {
        size = this.sizes.large;
      } else if (this.clusterSize == "xl") {
        size = this.sizes.xl;
      }

      if (Vue.prototype.$finalModel.aws) {
        Vue.prototype.$finalModel.aws.nodes = size.awsNodes;
      }
      if (Vue.prototype.$finalModel.azure) {
        Vue.prototype.$finalModel.azure.nodes = size.azureNodes;
      }
      if (Vue.prototype.$finalModel.google) {
        Vue.prototype.$finalModel.google.nodes = size.googleNodes;
      }

      this.checkQuota();
    },
    selectLoadBalancer() {
      if (
        Vue.prototype.$finalModel.aws &&
        !Vue.prototype.$finalModel.azure &&
        !Vue.prototype.$finalModel.google
      ) {
        Vue.prototype.$finalModel.load_balancer_integration = "aws";
      }
      if (
        Vue.prototype.$finalModel.azure &&
        !Vue.prototype.$finalModel.aws &&
        !Vue.prototype.$finalModel.google
      ) {
        Vue.prototype.$finalModel.load_balancer_integration = "azure";
      }
      if (
        Vue.prototype.$finalModel.google &&
        !Vue.prototype.$finalModel.azure &&
        !Vue.prototype.$finalModel.aws
      ) {
        Vue.prototype.$finalModel.load_balancer_integration = "google";
      }
    },
    async checkQuota() {
      this.quotas = await this.getUserQuota();
      let nodesCount = 0;

      if (Vue.prototype.$finalModel.aws) {
        nodesCount += Vue.prototype.$finalModel.aws.nodes.length;
      }
      if (Vue.prototype.$finalModel.azure) {
        nodesCount += Vue.prototype.$finalModel.azure.nodes.length;
      }
      if (Vue.prototype.$finalModel.google) {
        nodesCount += Vue.prototype.$finalModel.google.nodes.length;
      }

      if (
        nodesCount > this.quotas["available_nodes"] ||
        this.quotas["available_kubernetes_cluster_environments"] == 0
      ) {
        this.showAlert = true;
      } else {
        this.showAlert = false;
      }
      this.alertKey += 1;
    },
    ipConflictsExist() {
      let self = this;
      let model = Vue.prototype.$finalModel;
      let networks = [];

      if ("kubernetesConfiguration" in model) {
        networks.push(model.kubernetesConfiguration.podsSubnet);
        networks.push(model.kubernetesConfiguration.serviceAddresses);
      }
      if ("aws" in model) {
        networks.push(model.aws.vpcCidr);
      }
      if ("azure" in model) {
        networks.push(model.azure.vpcCidr);
      }
      if ("google" in model) {
        networks.push(model.google.vpcCidr);
      }

      return new Promise((resolve) => {
        this.axios
          .post(
            "/server/check-ip-conflicts",
            {
              networks: networks,
            },
            self.get_axiosConfig()
          )
          .then(function (response) {
            if (response.data.conflicts == true) {
              self.$notify({
                group: "msg",
                type: "error",
                title: "Notification:",
                text: "IP conflicts exist.",
              });
            }

            resolve(response.data.conflicts);
          })
          .catch(function (error) {
            console.log(error);
            self.$notify({
              group: "msg",
              type: "error",
              title: "Notification:",
              text: "Error while checking for IP conflicts.",
            });
            resolve(false);
          });
      });
    },
    getRegionZonesList(provider, credentialId, region) {
      let self = this;
      return new Promise((resolve) => {
        this.axios
          .get(
            "/server/tenants/" +
              this.computed_active_tenant_id +
              "/cloud-credentials/" +
              credentialId +
              "/regions/" +
              region +
              "/zones",
            this.get_axiosConfig()
          )
          .then(function (response) {
            resolve(response.data.zones);
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
                text: "Error while getting zones.",
              });
            }
          });
      });
    },
    getZoneInstancesList(provider, credentialId, region, zone) {
      let self = this;
      return new Promise((resolve) => {
        this.axios
          .get(
            "/server/tenants/" +
              this.computed_active_tenant_id +
              "/cloud-credentials/" +
              credentialId +
              "/regions/" +
              region +
              "/zones/" +
              zone +
              "/instances",
            this.get_axiosConfig()
          )
          .then(function (response) {
            let instanceTypes = [];
            for (let i = 0; i < response.data.instances.length; i++) {
              instanceTypes.push({
                zone: zone,
                value: response.data.instances[i].name,
                details: response.data.instances[i].description,
              });
            }
            resolve(instanceTypes);
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
                text: "Error while getting instances.",
              });
            }
          });
      });
    },
    getOperatingSystemsList(provider, credentialId, region) {
      let self = this;
      return new Promise((resolve) => {
        this.axios
          .get(
            "/server/tenants/" +
              this.computed_active_tenant_id +
              "/cloud-credentials/" +
              credentialId +
              "/regions/" +
              region +
              "/environment-type/" +
              this.$selectedType +
              "/operating-systems",
            this.get_axiosConfig()
          )
          .then(function (response) {
            let operatingSystems = [];
            for (let i = 0; i < response.data.operatingSystems.length; i++) {
              operatingSystems.push(response.data.operatingSystems[i].value);
            }
            resolve(operatingSystems);
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
                text: "Error while getting operating systems.",
              });
            }
          });
      });
    },
    getRandomProvider() {
      let selectedProviders = [];
      if (Vue.prototype.$finalModel.aws) {
        selectedProviders.push("aws");
      }
      if (Vue.prototype.$finalModel.azure) {
        selectedProviders.push("azure");
      }
      if (Vue.prototype.$finalModel.google) {
        selectedProviders.push("google");
      }

      let randomProvider =
        selectedProviders[Math.floor(Math.random() * selectedProviders.length)];

      return randomProvider;
    },
    getNumbersFromInstanceDetails(str) {
      let array = str.split(" ");
      let numArray = [];

      for (let i = 0; i < array.length; i++) {
        let num = parseInt(array[i]);
        if (!isNaN(num)) {
          numArray.push(num);
        }
      }

      return numArray;
    },
    clearSizes() {
      this.sizes = {
        small: {
          awsNodes: [],
          azureNodes: [],
          googleNodes: [],
          controls: 0,
          workers: 0,
          cpu: 0,
          memory: 0,
          storage: 0,
        },
        medium: {
          awsNodes: [],
          azureNodes: [],
          googleNodes: [],
          controls: 0,
          workers: 0,
          cpu: 0,
          memory: 0,
          storage: 0,
        },
        large: {
          awsNodes: [],
          azureNodes: [],
          googleNodes: [],
          controls: 0,
          workers: 0,
          cpu: 0,
          memory: 0,
          storage: 0,
        },
        xl: {
          awsNodes: [],
          azureNodes: [],
          googleNodes: [],
          controls: 0,
          workers: 0,
          cpu: 0,
          memory: 0,
          storage: 0,
        },
        awsZone: "",
        awsOS: "",
        awsInstance: "",
        azureZone: "",
        azureOS: "",
        azureInstance: "",
        googleZone: "",
        googleOS: "",
        googleInstance: "",
      };
    },
    changeHighAvailability() {
      this.highAvailability = !this.highAvailability;

      if (
        Vue.prototype.$finalModel.aws ||
        Vue.prototype.$finalModel.azure ||
        Vue.prototype.$finalModel.google
      ) {
        this.calculateSizes();
      }
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
      awsProvided: false,
      azureProvided: false,
      googleProvided: false,
      form: {
        awsSelected: false,
        azureSelected: false,
        googleSelected: false,
      },
      credentials: [],
      selectedCredentials: {
        aws: "",
        awsRegion: "",
        azure: "",
        azureRegion: "",
        google: "",
        googleRegion: "",
      },
      regions: {
        aws: {
          regions: [],
          loading: false,
          updating: false,
          zones: [],
          instances: [],
          os: [],
        },
        azure: {
          regions: [],
          loading: false,
          updating: false,
          zones: [],
          instances: [],
          os: [],
        },
        google: {
          regions: [],
          loading: false,
          updating: false,
          zones: [],
          instances: [],
          os: [],
        },
      },
      interval: "",
      clusterSize: "small",
      calculatingSizes: false,
      sizes: {},
      quotas: {},
      showAlert: false,
      alertKey: 0,
      highAvailability: false,
    };
  },
  validations: {
    form: {
      awsSelected: {},
      azureSelected: {},
      googleSelected: {},
    },
  },
  watch: {
    $v: {
      handler: function () {
        if (
          this.form.awsSelected == false &&
          this.form.azureSelected == false &&
          this.form.googleSelected == false
        ) {
          delete Vue.prototype.$finalModel.load_balancer_integration;
          this.clearSizes();

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

          if (Vue.prototype.$finalModel.load_balancer_integration == "aws") {
            delete Vue.prototype.$finalModel.load_balancer_integration;
          }

          this.selectedCredentials.aws = "";
          this.selectedCredentials.awsRegion = "";
        }

        if (this.form.azureSelected == false) {
          Vue.prototype.$finalModel.azureSelected = false;
          delete Vue.prototype.$finalModel.azure;

          if (Vue.prototype.$finalModel.load_balancer_integration == "azure") {
            delete Vue.prototype.$finalModel.load_balancer_integration;
          }

          this.selectedCredentials.azure = "";
          this.selectedCredentials.azureRegion = "";
        }

        if (this.form.googleSelected == false) {
          Vue.prototype.$finalModel.googleSelected = false;
          delete Vue.prototype.$finalModel.google;

          if (Vue.prototype.$finalModel.load_balancer_integration == "google") {
            delete Vue.prototype.$finalModel.load_balancer_integration;
          }

          this.selectedCredentials.google = "";
          this.selectedCredentials.googleRegion = "";
        }

        if (
          Vue.prototype.$finalModel.aws ||
          Vue.prototype.$finalModel.azure ||
          Vue.prototype.$finalModel.google
        ) {
          this.calculateSizes();
        }
      },
      deep: true,
    },
  },
};
</script>

<style scoped>
.custom-card,
.custom-card-disabled {
  min-width: 15rem;
}

.custom-checkbox-size {
  width: 25px;
  height: 25px;
}
</style>
