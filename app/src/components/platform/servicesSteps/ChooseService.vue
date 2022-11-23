<template>
  <div style="padding: 2rem 2rem; text-align: left" class="col w-100">
      <!--       <div class="radios">
        <span
          class="card-header custom-control custom-radio"
          v-for="item in servicesList"
          :key="item.name"
        >
          <input
            v-model="form.serviceName"
            v-on:change="updateForm"
            type="radio"
            :id="item.name"
            name="service_name"
            :value="item.name"
            class="custom-control-input"
          />
          <label class="custom-control-label" :for="item.name">{{
            item.name
          }}</label>
          <br />
        </span>
      </div> -->

      <hr />
      <span v-show="!showAccordion('chooseService')" :class="installStep>1 ? 'text-success':''"
        >&#10102; Choose Service </span
      >
      <b-collapse
        id="chooseService"
        :visible="showAccordion('chooseService')"
        class="mt-2"
      >
      <div v-if="loadingSrvices"
        class="d-flex justify-content-center p-5">
        <div class="circle-loader-large" role="status"></div>
      </div>
      <div v-if="!loadingSrvices">
        <div>
          <h2>&#10102;  Choose Service</h2>
        </div>
        <div class="col pl-5 ml-4 pb-2">
          <p class="m-0 p-0">Search:</p>
          <input
            v-model="searchQuery"
            type="text"
          />
        </div>

        <div class="row justify-content-around">
          <div
            v-show="
              (searachResults(item.name, serviceDescription(item.name)) &&
                !form.serviceName) ||
              item.name === form.serviceName
            "
            class="col-xl-4 col-lg-6 col-md-12 mt-5"
            v-for="item in servicesList"
            :key="item.name"
          >
            <b-card-group deck>
              <b-card
                no-body
                :header="item.name"
                style="min-width: 20rem; max-width: 20rem; height: 25rem"
                class="mb-2 text-center mx-auto"
              >
                <template #header>
                  <div class="h4 m-auto">
                    {{ item.name }}
                  </div>
                </template>
                <b-card-body class="p-0 m-0">
                  <div class="h-50">
                    <!-- <img
                      class="logo"
                      v-if="item.name === 'Jypiter'"
                      src="../../../assets/img/logosServices/Jupyter_logo.png"
                      alt="Jypiter"
                    />
                    <img
                      class="logo"
                      v-if="item.name === 'MySQL'"
                      src="../../../assets/img/logosServices/MySQL_logo.png"
                      alt="MySQL"
                    />
                    <img
                      class="logo"
                      v-if="item.name === 'Nginx'"
                      src="../../../assets/img/logosServices/Nginx_logo.png"
                      alt="Nginx"
                    />
                    <img
                      class="logo"
                      v-if="item.name === 'TensorFlow'"
                      src="../../../assets/img/logosServices/TensorFlow_logo.png"
                      alt="TensorFlow"
                    /> -->
                  </div>

                  <hr />
                  <b-card-text class="py-2 px-1">
                    {{ serviceDescription(item.name) }}
                  </b-card-text>
                </b-card-body>

                <template #footer>
                  <b-button
                    class="btn btn-outline-success mx-4 col-6 mx-auto"
                    @click="
                      chosseOrResetService(item.name);
                      currentAccordion = 'chooseSonfigurationTypeCollapse';
                      installStep = 2;
                    "
                    >Use service</b-button
                  >
                </template>
              </b-card>
            </b-card-group>
          </div>
        </div>
        </div>
      </b-collapse>

      <hr />
      <span v-show="!showAccordion('chooseSonfigurationTypeCollapse')"
      :class="installStep > 2 ? 'text-success':''"
        >&#10103; Choose Configuration Type for Service {{installStep}}</span
      >
      <div>
        <b-collapse
          id="chooseSonfigurationTypeCollapse"
          :visible="showAccordion('chooseSonfigurationTypeCollapse')"
          class="mt-2"
        >
              <h2>&#10103; Choose Configuration Type for {{ form.serviceName }}</h2>
          <div class="row m-0 p-0">
            <div class="col">
              <div class="row pt-2 d-flex justify-content-center" style="min-height: 50px">
                <div class="col-xl-4 col-lg-4 col-md-6 pr-2 text-center">
                  <!-- <img
                    class="logo"
                    v-if="form.serviceName === 'Jypiter'"
                    src="../../../assets/img/logosServices/Jupyter_logo.png"
                    alt="Jypiter"
                  />
                  <img
                    class="logo"
                    v-if="form.serviceName === 'MySQL'"
                    src="../../../assets/img/logosServices/MySQL_logo.png"
                    alt="MySQL"
                  />
                  <img
                    class="logo"
                    v-if="form.serviceName === 'Nginx'"
                    src="../../../assets/img/logosServices/Nginx_logo.png"
                    alt="Nginx"
                  />
                  <img
                    class="logo"
                    v-if="form.serviceName === 'TensorFlow'"
                    src="../../../assets/img/logosServices/TensorFlow_logo.png"
                    alt="TensorFlow"
                  /> -->
                </div>
                <div class="col-xl-4 col-lg-6 col-md-6 d-flex align-items-end">
                  {{ serviceDescription(form.serviceName) }}
                </div>
                
              </div>
              <div class="row justify-content-center">
                <div
                  class="col-md-8 pt-5 d-flex"
                  style="border-top: black solid 1 pix"
                >
                  <input
                    type="button"
                    class="btn btn-outline-success col-md-4 mx-1 px-0"
                    @click="currentAccordion = 'simpleConfiguration'; form.configurationType='simpleConfig'; installStep = 3;"
                    value="Simple Configuration"
                    
                  />
                  <input
                    type="button"
                    class="btn btn-outline-success col-md-4 mx-1 px-0"
                    @click="currentAccordion = 'advancedConfiguration'; form.configurationType='advancedConfig'; installStep = 3;"
                    value="Advanced Configuration"
                  />
                  <input
                    type="button"
                    class="btn btn-outline-success col-md-4 mx-1 px-0"
                    @click="
                      chosseOrResetService(form.serviceName);
                      currentAccordion = 'chooseService';
                    "
                    value="Reset configuration"
                  />
                </div>
              </div>
              <br />
              <br />
            </div>
          </div>
        </b-collapse>
        <hr />
        <span v-show="!showAccordion('advancedConfiguration') && !showAccordion('simpleConfiguration')"
          >&#10104; Configuration</span
        >
        <b-collapse
          id="advancedConfiguration"
          :visible="showAccordion('advancedConfiguration')"
          class="mt-2"
        >
              <h2>&#10104; Advanced configuration for {{ form.serviceName }} service</h2>
          <div class="row m-0 p-0">
            <div class="col">
              <AdvancedConfig></AdvancedConfig>
              <div class="row">
                <div
                  class="col-md-12 pt-5 d-flex align-items-end justify-content-around"
                  style="border-top: black solid 1 pix"
                >
                  <input
                    type="button"
                    class="btn btn-outline-success col-md-4 mx-1 px-0"
                    @click="
                      currentAccordion = 'chooseSonfigurationTypeCollapse'
                    "
                    value="Go Back to Configuration Types"
                  />
                  <input
                    type="button"
                    class="btn btn-outline-success col-md-4 mx-1 px-0"
                    @click="submitServiceConfiguration()"
                    value="Submit"
                  />
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
              <h2>&#10104; Simple configuration for {{ form.serviceName }} service</h2>
          <div class="row m-0 p-0">
            <div class="col">
              <SimpleConfig></SimpleConfig>
              <div class="row">
                <div
                  class="col-md-12 pt-5 d-flex align-items-end justify-content-around"
                  style="border-top: black solid 1 pix"
                >
                  <input
                    type="button"
                    class="btn btn-outline-success col-md-4 mx-1 px-0"
                    @click="
                      currentAccordion = 'chooseSonfigurationTypeCollapse'
                    "
                    value="Go Back to Configuration Types"
                  />
                  <input
                    type="button"
                    class="btn btn-outline-success col-md-4 mx-1 px-0"
                    @click="submitServiceConfiguration()"
                    value="Submit"
                  />
                </div>
              </div>
              <br />
              <br />
            </div>
          </div>
        </b-collapse>
        <hr />
        <span>&#10105; Confirm Configuration and Submit</span>
      </div>
  </div>
</template>

<script>
import axios from "axios";
import { validationMixin } from "vuelidate";
import { required } from "vuelidate/lib/validators";
import Vue from "vue";
import AdvancedConfig from "./AdvancedConfig.vue";
import SimpleConfig from "./SimpleConfig.vue";

export default {
  name: 'ChooseService',
  props: ["clickedNext", "currentStep"],
  mixins: [validationMixin],
  components: {
    AdvancedConfig,
    SimpleConfig,
  },
  data() {
    return {
      loadingSrvices:true,
      installStep:1,
      servicesList: [],
      form: {
        name: "",
        namespace: "default",
        replicas: "1",
        service_type: "",
        serviceName: "",
        configurationType: "",
      },
      searchQuery: "",
      chosenService: {
        image: "",
        description: "",
      },
      currentAccordion: "chooseService",
    };
  },
  validations: {
    form: {
      serviceName: {
        required,
      },
    },
  },
  watch: {
    $v: {
      handler: function (val) {
        if (!val.$invalid) {
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
    clickedNext(val) {
      if (val === true) {
        this.$v.form.$touch();
      }
    },
  },
  created() {
    this.getServicesList(this);
  },
  mounted() {
    if (!this.$v.$invalid) {
      this.$emit("can-continue", { value: true });
    } else {
      this.$emit("can-continue", { value: false });
    }
  },
  methods: {
    getServicesList(currentObject) {
      let self = currentObject;
      axios
        .get("/server/services", this.get_axiosConfig())
        .then(function (response) {
          self.servicesList = [];
          for (let i = 0; i < response.data.serviceList.length; i++) {
            self.servicesList.push({
              name: response.data.serviceList[i].name
            });
          }
          self.loadingSrvices=false
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
          }
        });
    },
    updateForm() {
      Vue.prototype.$finalModel = {
        ...Vue.prototype.$finalModel,
        ...this.form,
      };
    },
    serviceDescription(service) {
      let descriptionText = "service";
      if (service === "Jypiter") {
        descriptionText =
          "The Jupyter Notebook allows you to create and share documents that contain live code, equations, visualizations and narrative text.";
      } else if (service === "MySQL") {
        descriptionText =
          "Use MySQL replication in your environments to allow for redundancy and increase availability";
      } else if (service === "Nginx") {
        descriptionText =
          "Nginx Ingress will allow you to assemble a configuration file.";
      } else if (service === "TensorFlow") {
        descriptionText =
          "TensorFlow is an end-to-end open source platform for machine learning";
      }

      return descriptionText;
    },
    searachResults(service, description) {
      let showAsResult = true;
      if (
        this.searchQuery &&
        !service.toLowerCase().includes(this.searchQuery.toLowerCase()) &&
        !description.toLowerCase().includes(this.searchQuery.toLowerCase())
      ) {
        showAsResult = false;
      }
      return showAsResult;
    },
    chosseOrResetService(service) {
      if (this.form.serviceName === service) {
        this.form.serviceName = "";
        this.searchQuery = "";
        this.installStep = 1;
      } else {
        this.form.serviceName = service;
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
      ...this.form
    };
    this.$parent.form ={
      ...this.$parent.form,
      ...this.form,
    }
    this.$parent.submitService()
    }
  },
};
</script>


<style scoped>
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
</style>