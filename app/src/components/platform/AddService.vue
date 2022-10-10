<template>
  <div class="col">
    <WarningAlert v-if="alert.show" color="warning" :closeOption="true">
      <div v-html="alert.msg"></div>
    </WarningAlert>
    <QuotaExceededModal
      v-show="showQuotaExceeded"
      :exceededResources="exceededResources"
    ></QuotaExceededModal>
    <!--     <div v-if="showAccordion('chooseService')" class="col-12 w-100 text-center ">
      <h2 class="d-flex justify-content-center">Available services for your cluster:</h2>
    </div> -->
    <div style="text-align: left" class="col w-100">
      <b-collapse
        id="chooseService"
        :visible="showAccordion('chooseService')"
        class="mt-2"
      >
        <div v-if="loadingSrvices" class="d-flex justify-content-center p-5">
          <div class="circle-loader-large" role="status"></div>
        </div>
        <div v-if="!loadingSrvices">
          <div class="col d-flex p-0 mb-3 justify-content-start">
            <div>Catergories:</div>
            <span
              class="badge m-1 badge-pill pointer"
              :class="
                categoriesListSelected.length == categoriesListAll.length
                  ? 'badge-info'
                  : 'badge-secondary'
              "
              @click="selectAllCategories()"
            >
              All
            </span>
            <div
              v-for="cat in categoriesListAll"
              :key="cat"
              class="badge m-1 badge-pill pointer"
              :class="
                categoriesListSelected.includes(cat)
                  ? 'badge-info'
                  : 'badge-secondary'
              "
              @click="categoriesListSelected = [cat]"
            >
              {{ " " + cat }}
            </div>
          </div>
          <div class="row justify-content-start">
            <div
              v-show="
                searachResults(item.name, item.description) &&
                !form.serviceName &&
                categorySelected(item.categories)
              "
              class="mb-3 mx-4"
              v-for="item in servicesList"
              :key="item.name"
            >
              <b-card-group deck>
                <b-card
                  no-body
                  style="
                    min-width: 18.25rem;
                    max-width: 18.25rem;
                    height: 20rem;
                  "
                  class="mb-2 text-center mx-auto baseBlock"
                >
                  <!-- <hr class="m-0" /> -->
                  <b-card-body class="p-0 m-0">
                    <div class="h-50">
                      <img class="logo" :src="item.logo_url" :alt="item.name" />
                    </div>

                    <!-- <hr /> -->
                    <b-card-text class="py-2 px-1 mt-3">
                      <span
                        v-for="cat in item.categories"
                        :key="cat"
                        class="badge m-1 badge-pill badge-info"
                      >
                        {{ cat }}
                      </span>
                      <div
                        style="
                          font-size: 15px;
                          overflow: hidden;
                          text-overflow: ellipsis;
                          -webkit-line-clamp: 2;
                        "
                      >
                        {{ item.description.substr(0, 60) }}...
                      </div>
                    </b-card-text>
                  </b-card-body>

                  <template #footer>
                    <div class="d-flex justify-content-center">
                      <b-button
                        class="btn col-5"
                        @click="
                          currentServiceDetails = item;
                          currentAccordion = 'serviceDetails';
                        "
                        >Details</b-button
                      >
                      <!--                     <b-button
                      class="btn btn-outline-success col-5"
                      @click="
                        chooseService(item.name);
                        currentAccordion = 'simpleConfiguration';
                        installStep = 2;
                        copyUrl(item.logo_url);
                        chosenServicelogoUrl = item.logo_url;
                        chosenServiceDescription = item.description;
                      "
                      >Install</b-button
                    > -->
                    </div>
                  </template>
                </b-card>
              </b-card-group>
            </div>
          </div>
        </div>
      </b-collapse>

      <b-collapse
        id="advancedConfiguration"
        :visible="showAccordion('advancedConfiguration')"
        class="mt-2"
      >
        <h4 class="text-center">
          Custom configuration for {{ form.serviceName }} service
        </h4>
        <div class="row m-0 p-0">
          <div class="col">
            <AdvancedConfig
              ref="advancedConfig"
              @can-continue="proceed"
            ></AdvancedConfig>
            <div class="row">
              <div
                class="col-md-12 pt-5 align-items-end text-right"
                style="border-top: black solid 1 pix"
              >
                <input
                  type="button"
                  class="btn btn-outline-success mr-5"
                  @click="
                    currentAccordion = 'simpleConfiguration';
                    form.configurationType = 'simpleConfig';
                  "
                  value="Cancel Custom Configuration"
                />
                <input
                  type="button"
                  class="btn btn-outline-success ml-5"
                  @click="
                    submitServiceConfiguration();
                    currentAccordion = 'submitted';
                    installStep = 4;
                  "
                  value="Submit"
                  :disabled="!canContinue"
                />
              </div>
            </div>
            <br />
            <br />
          </div>
        </div>
      </b-collapse>

      <b-collapse
        id="serviceDetails"
        :visible="showAccordion('serviceDetails')"
        class="mt-2"
      >
        <h2 class="text-center">
          Details for service <b>{{ currentServiceDetails.name }} </b>
        </h2>
        <div class="row m-0 p-0">
          <div class="col">
            <!-- <SimpleConfig ref="simpleConfig" @can-continue="proceed"></SimpleConfig> -->
            <div>
              <br />
              <div class="d-flex justify-content-between">
                <div class="col-2">
                  <img
                    :src="currentServiceDetails.logo_url"
                    alt=""
                    style="max-width: 100%; height: auto"
                  />
                </div>
                <div class="col-7">
                  <h5>Description:</h5>
                  {{ currentServiceDetails.description }}
                </div>
                <div class="col-2">
                  <h5>Categories:</h5>
                  <div
                    v-for="cat in currentServiceDetails.categories"
                    :key="cat"
                    class="badge m-1 badge-pill badge-info"
                  >
                    {{ cat }}
                  </div>
                </div>
              </div>
            </div>
            <div class="row">
              <div
                class="col-md-12 pt-5 align-items-end text-right"
                style="border-top: black solid 1 pix"
              >
                <div
                  class="custom-button float-right ml-5"
                  @click="installService()"
                >
                  Install
                </div>
                <div
                  class="custom-button float-right mr-5"
                  @click="
                    resetService(form.serviceName);
                    currentAccordion = 'chooseService';
                    $refs.simpleConfig.resetForm();
                    $refs.simpleConfig.showCustom = false;
                    proceed(false);
                  "
                >
                  Cancel
                </div>
              </div>
            </div>
            <br />
            <br />
          </div>
        </div>
      </b-collapse>

      <b-collapse
        id="simpleConfiguration"
        :visible="showAccordion('simpleConfiguration')"
        class="mt-2"
      >
        <h4>Configuration for {{ form.serviceName }} service</h4>
        <br />
        <div class="row m-0 p-0">
          <div class="col m-0 p-0">
            <SimpleConfig
              ref="simpleConfig"
              @can-continue="proceed"
            ></SimpleConfig>
            <div class="row">
              <div
                class="col-md-12 pt-5 align-items-end text-right"
                style="border-top: black solid 1 pix"
              >
                <div
                  class="custom-button float-right ml-5"
                  :class="[!canContinue ? 'deactivated' : '']"
                  @click="
                    submitServiceConfiguration();
                    currentAccordion = 'submitted';
                    $refs.simpleConfig.cloudProvidersToArrayofValues();
                    $refs.simpleConfig.showCustom = false;
                    installStep = 4;
                    canContinue = false;
                    $refs.simpleConfig.resetForm();
                  "
                >
                  Install Service
                </div>
                <div
                  class="custom-button float-right mr-5"
                  @click="
                    resetService(form.serviceName);
                    currentAccordion = 'chooseService';
                    $refs.simpleConfig.resetForm();
                    $refs.simpleConfig.showCustom = false;
                    proceed(false);
                  "
                >
                  Cancel
                </div>
              </div>
            </div>
            <br />
            <br />
          </div>
        </div>
      </b-collapse>
      <hr />

      <b-collapse
        id="submitted"
        :visible="showAccordion('submitted')"
        class="mt-2"
      >
        <div class="row m-0 p-0">
          <div class="col text-center text-success">
            <br />
            <br />
            <br />
            <div class="justify-content-center">
              <div class="h3 text-center">
                Submitted configuration for {{ form.serviceName }} service
              </div>
              <div class="spinner-border" role="status"></div>
            </div>
          </div>
        </div>
      </b-collapse>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import Vue from "vue";
import QuotaExceededModal from "@/components/platform/popup_modals/QuotaExceededModal";
import AdvancedConfig from "./servicesSteps/AdvancedConfig.vue";
import SimpleConfig from "./servicesSteps/SimpleConfig.vue";
import WarningAlert from "@/components/platform/WarningAlert.vue";

export default {
  name: 'AddService',
  components: {
    QuotaExceededModal,
    AdvancedConfig,
    SimpleConfig,
    WarningAlert,
  },
  data() {
    return {
      alert: {
        show: false,
        msg: "",
      },
      activeStep: 0,
      currentServiceDetails: {},
      canContinue: false,
      errorMsg: "",
      showQuotaExceeded: false,
      exceededResources: [],
      categoriesListAll: [],
      categoriesListSelected: [],
      loadingSrvices: true,
      installStep: 1,
      servicesList: [],
      form: {
        name: "service",
        namespace: "",
        serviceName: "",
        configurationType: "simpleConfig",
      },
      serchQuery: "",
      chosenService: {
        image: "",
        description: "",
      },
      currentAccordion: "chooseService",
      chosenServiceLogoUrl: "",
      chosenServiceDescription: "",
    };
  },
  props: ["clusterID"],
  created() {
    this.getServicesList(this);
  },
  methods: {
    installService() {
      let self = this;
      this.getUserQuota().then((quota) => {
        if (quota["available_services"] < 1) {
          self.alert = {
            show: true,
            msg: 'User quota exceeded. For more information, <a href="/documentation/users/#user-resource-quotas">check the documentation</a>.',
          };
        } else {
          this.chooseService(this.currentServiceDetails.name);
          this.currentAccordion = "simpleConfiguration";
          this.installStep = 2;
          this.copyUrl(this.currentServiceDetails.logo_url);
          this.chosenServicelogoUrl = this.currentServiceDetails.logo_url;
          this.chosenServiceDescription =
            this.currentServiceDetails.description;
        }
      });
    },
    completeStep(payload) {
      this.servicesSteps.forEach((step) => {
        if (step.name === payload.name) {
          step.completed = true;
        }
      });
    },
    isStepActive(payload) {
      this.servicesSteps.forEach((step) => {
        if (step.name === payload.name) {
          if (step.completed === true) {
            step.completed = false;
          }
        }
      });
    },
    submitService() {
      var request = {};
      if (this.$finalModel.configurationType == "yamlConfig") {
        request.name = this.$finalModel.name;
        request.serviceName = this.$finalModel.serviceName;
        request.namespace = this.$finalModel.namespace;
        request.configurationType = this.$finalModel.configurationType;
        request.valuesFile = this.$finalModel.valuesFile;
        request.clusterID = this.$finalModel.clusterID;
      } else {
        request = this.$finalModel;
        delete request["valuesFile"];
      }
      request.clusterID = this.clusterID;
      let self = this;
      self.currentAccordion = "submitted";

      this.axios
        .post("/server/addService", request, this.get_axiosConfig())
        .then(function () {
          Vue.prototype.$finalModel = {};
          self.$router.push({
            name: "ClusterDetails",
            params: {
              clusterID: self.clusterID,
              detailPage: "overview",
            },
          });
        })
        .catch(function (error) {
          if (
            error.response != undefined &&
            error.response.data != undefined &&
            error.response.data.authorized == false
          ) {
            self.exceededResources = error.response.data.exceededResources;
            self.showQuotaExceeded = true;
            this.$bvModal.show("bv-modal-quotaexceeded");
          } else {
            if (
              error.response != undefined &&
              error.response.data != undefined &&
              error.response.data.error.message == undefined
            ) {
              self.$notify({
                group: "msg",
                type: "error",
                title: "Notification:",
                text: "Error while adding service!",
              });
            } else {
              self.$notify({
                group: "msg",
                type: "error",
                title: "Notification:",
                text: error,
              });
            }
          }
          // eslint-disable-next-line no-console
          console.log(error);
          self.errorMsg = error;
          self.resetService(self.form.serviceName);
          self.currentAccordion = "chooseService";
          self.$refs.simpleConfig.resetForm();
          self.$refs.simpleConfig.showCustom = false;
          self.proceed(false);
          Vue.prototype.$finalModel = {};
        });
    },
    getServicesList(currentObject) {
      let self = currentObject;

      axios
        .post("/server/getServiceList", {}, this.get_axiosConfig())
        .then(function (response) {
          let servicesList = [];
          for (let i = 0; i < response.data.serviceList.length; i++) {
            let categories = ["other"];
            if (response.data.serviceList[i].categories) {
              if (response.data.serviceList[i].categories.length > 0) {
                categories = response.data.serviceList[i].categories;
              }
            }
            for (let cat in categories) {
              if (!self.categoriesListAll.includes(categories[cat])) {
                self.categoriesListAll.push(categories[cat]);
                self.categoriesListSelected.push(categories[cat]);
              }
            }
            
            servicesList.push({
              name: response.data.serviceList[i].name,
              description: response.data.serviceList[i].description,
              logo_url: response.data.serviceList[i].logo_url,
              categories: categories,
              implemented: response.data.serviceList[i].implemented,
            });
          }

          //put working services at the top
          for (let i = 0; i < servicesList.length; i++) {
            if (servicesList[i].implemented) {
              self.servicesList.push(servicesList[i]);
            }
          }
          for (let i = 0; i < servicesList.length; i++) {
            if (!servicesList[i].implemented) {
              self.servicesList.push(servicesList[i]);
            }
          }

          self.loadingSrvices = false;
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    searachResults(service, description) {
      let showAsResult = true;
      if (
        this.serchQuery &&
        !service.toLowerCase().includes(this.serchQuery.toLowerCase()) &&
        !description.toLowerCase().includes(this.serchQuery.toLowerCase())
      ) {
        showAsResult = false;
      }
      return showAsResult;
    },
    chooseService(service) {
      Vue.prototype.$finalModel = {};
      if (this.form.serviceName === service) {
        this.form.serviceName = "";
        Vue.prototype.$finalModel.serviceName = "";
        this.serchQuery = "";
        this.installStep = 1;
      } else {
        this.form.serviceName = service;
        Vue.prototype.$finalModel.serviceName = service;
        // this.$refs.simpleConfig.setServiceOptions(this);
        // this.$refs.simpleConfig.setDefaultName(this);
      }
    },
    resetService(service) {
      if (this.form.serviceName === service) {
        this.form.serviceName = "";
        Vue.prototype.$finalModel.serviceName = "";
        this.serchQuery = "";
        this.installStep = 1;
      }
    },
    showAccordion(current) {
      if (current === this.currentAccordion) {
        return true;
      } else {
        return false;
      }
    },
    submitServiceConfiguration() {
      Vue.prototype.$finalModel = {
        ...Vue.prototype.$finalModel,
        ...this.form,
      };
      this.submitService();
    },
    copyUrl(url) {
      this.chosenServiceLogoUrl = url;
    },
    proceed(payload) {
      this.canContinue = payload.value;
    },
    goToDetails(id, details) {
      this.$router
        .push({
          name: "ClusterDetails",
          params: {
            clusterID: id,
            detailPage: details,
          },
        })
        .catch((error) => {
          return error;
        });
    },
    toggleSelectedCategory(category) {
      if (this.categoriesListSelected.length == this.categoriesListAll.length) {
        this.categoriesListSelected = [];
      }
      if (!this.categoriesListSelected.includes(category)) {
        this.categoriesListSelected.push(category);
      } else {
        this.removeValueFromArray(category, this.categoriesListSelected);
        if (this.categoriesListSelected.length == 0) {
          this.selectAllCategories();
        }
      }
    },
    selectAllCategories() {
      for (let cat in this.categoriesListAll) {
        let category = this.categoriesListAll[cat];
        if (!this.categoriesListSelected.includes(category)) {
          this.categoriesListSelected.push(category);
        }
      }
    },
    removeValueFromArray(value, array) {
      function findIndexToRemove(valueToRemove) {
        return valueToRemove === value;
      }
      let indexToRemove = array.findIndex(findIndexToRemove);
      array.splice(indexToRemove, 1);
    },
    categorySelected(categories) {
      let showService = false;
      for (let cat in categories) {
        if (this.categoriesListSelected.includes(categories[cat])) {
          showService = true;
        }
      }
      return showService;
    },
  },
};
</script>

<style scoped>
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

.pointer {
  cursor: pointer;
}

h1,
h2 {
  font-weight: normal;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #0b99b9;
  text-decoration: underline;
}

.text-medium-grey {
  color: #333;
}

.text-light-grey {
  color: #888;
}

.box.formated {
  position: relative;
  padding: 0;
}

.box.formated .heading {
  font-size: 1rem;
  text-transform: capitalize;
  padding: 0.8rem 1.5rem;
  background-color: #fafafa;
}

.box.formated .content {
  padding: 1rem 2rem;
}

i.top-left {
  position: absolute;
  left: 1.5rem;
  top: 0.8rem;
}

.vertical-separator {
  display: flex;
  justify-content: space-around;
}

.vertical-separator .line {
  border-right: 1px solid #cccccc;
}

.card-header {
  background-color: white;
  border: none;
}
.card-footer {
  background-color: white;
  border: none;
}

.logo {
  object-fit: cover;
  max-height: 7rem;
  max-width: 10rem;
  position: relative;
  top: 50%;
  -webkit-transform: translateY(-50%);
  -ms-transform: translateY(-50%);
  transform: translateY(-50%);
}
.baseBlock {
  -moz-transition: all 0.3s cubic-bezier(0.165, 0.84, 0.44, 1);
  -o-transition: all 0.3s cubic-bezier(0.165, 0.84, 0.44, 1);
  transition: all 0.3s cubic-bezier(0.165, 0.84, 0.44, 1);
}

.baseBlock:hover {
  -webkit-transform: translate(0, 2px);
  -moz-transform: translate(0, 2px);
  -ms-transform: translate(0, 2px);
  -o-transform: translate(0, 2px);
  transform: translate(0, 2px);
  box-shadow: 0 10px 10px rgba(0, 0, 0, 0.2);
}
.circle-loader {
  border: 2px solid rgba(0, 0, 0, 0.2);
  border-left-color: #228ae6;
  animation-name: loader-spin;
  animation-duration: 1s;
  animation-iteration-count: infinite;
  animation-timing-function: linear;
  position: relative;
  display: inline-block;
  vertical-align: top;
}

.circle-loader,
.circle-loader:after {
  border-radius: 50%;
  width: 2em;
  height: 2em;
}

.circle-loader-large {
  border: 2px solid rgba(0, 0, 0, 0.2);
  border-left-color: #228ae6;
  animation-name: loader-spin;
  animation-duration: 2s;
  animation-iteration-count: infinite;
  animation-timing-function: linear;
  position: relative;
  display: inline-block;
  vertical-align: top;
}

.circle-loader-large,
.circle-loader-large:after {
  border-radius: 50%;
  width: 5em;
  height: 5em;
}
@keyframes loader-spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
.btn {
  width: 10rem;
}
</style>