<template>
  <div style="text-align: left">
    <div class="field">
      <div class="columns">
        <div>
          <label for="selectProject">Select Project</label>
        </div>
        <select
          placeholder="Select Project"
          class="custom-select d-block w-100"
          v-model="$finalModel.selectedProject"
          id="selectProject"
          @change="getUsersClustersList()"
        >
          <option :value="null" disabled>Select Project...</option>
          <option v-for="item in projectsList" :key="item.ID" :value="item.ID">
            {{ item.Name }}
          </option>
        </select>
        <br />
      </div>
      <div v-if="clustersList.length == 0">
        No clusters exist in the selected project.
      </div>
      <div v-else>
        <div class="columns">
          <div>
            <label for="selectCluster">Select Cluster</label>
          </div>
          <select
            class="custom-select d-block w-100"
            v-model="$finalModel.selectedCluster"
            id="selectCluster"
            @change="
              setClusterID($event.target.value);
              setServiceOptions(this);
              setDefaultName(this);
            "
          >
            <option
              v-for="item in clustersList"
              :key="item.ID"
              :value="item.ID"
            >
              {{ item.Name }}
            </option>
          </select>
        </div>
        <b-collapse class="row" visible>
          <div class="col-12">
            <div v-if="serviceOptions.name" class="control" id="serviceName">
              <br />
              <label class="control-label m-0 mt-2">Name</label>
              <input
                required
                class="form-control"
                type="text"
                v-bind:placeholder="defaultName"
                v-model="form.name"
                :value="form.name"
                @input="setFormName"
                autocomplete="off"
                @keyup="formExtraFieldsCheck"
              />
              <div
                v-if="invalidName"
                class="text-danger"
                style="font-size: 1rem"
              >
                Service name can contain only lowercase alphanumeric characters
                or '-' between 1 and 30 characters and must start and ends with
                a alphanumeric character.
              </div>
              <div
                v-else-if="existingServiceName"
                class="text-danger"
                style="font-size: 1rem"
              >
                Service name already exists.
              </div>
              <div style="height: 1.2rem; margin-top: 0rem"></div>
            </div>

            <div v-if="serviceOptions.namespace" id="namespace">
              <div
                v-if="showAddNewNamespace"
                class="control"
                id="serviceNamespace"
              >
                <label class="control-label m-0">Namespace</label>
                <input
                  required
                  class="form-control"
                  type="text"
                  placeholder="Please provide a namespace"
                  v-model="formExtraFields.namespace"
                  autocomplete="off"
                  @keyup="
                    formExtraFieldsCheck();
                    serviceOptionsCheck();
                    setFormNamespace(formExtraFields.namespace);
                  "
                  @keydown="
                    formExtraFieldsCheck();
                    serviceOptionsCheck();
                    setFormNamespace(formExtraFields.namespace);
                  "
                />
              </div>

              <div
                v-if="!showAddNewNamespace"
                class="control"
                id="serviceNamespaceList"
              >
                <div>
                  <label class="control-label m-0">Namespace</label>
                </div>
                <select
                  required
                  v-model="formExtraFields.namespace"
                  @change="
                    formExtraFieldsCheck();
                    addNewNamespace();
                    serviceOptionsCheck();
                    setFormNamespace(formExtraFields.namespace);
                  "
                  class="custom-select d-block w-100"
                  id="namespace"
                >
                  <option
                    v-for="namespace in listNamespaces"
                    :key="namespace.index"
                    :value="namespace"
                  >
                    {{ namespace }}
                  </option>
                  <option>...Add new namespace</option>
                </select>
              </div>
              <p
                v-if="getFormNamespace() == ''"
                class="help text-danger text-start"
                style="margin: 0rem"
              >
                Please provide a valid Namespace
              </p>
              <div v-else style="height: 1.15rem; margin-top: 0rem"></div>
            </div>

            <div
              v-if="
                this.singleCloudProvider == false &&
                !showCustom &&
                serviceOptions.cloud_providers
              "
            >
              <div class="control" id="serviceReplicas">
                <label class="control-label m-0">Replicas</label>
                <input
                  class="form-control"
                  type="number"
                  v-on:change="parseReplicaCount"
                  placeholder="1"
                  min="1"
                  v-model="form.replicas"
                />
              </div>
            </div>
          </div>
          <div
            v-if="loadingAvailableProviders && serviceOptions.cloud_providers"
            class="col-7 ml-5 pl-5"
          >
            <div class="spinner-border" role="status"></div>
          </div>
        </b-collapse>

        <div v-if="selectedProviders.length != 1" class="col-7 p-0">
          <b-collapse :visible="!showCustom && !loadingAvailableProviders">
            <div v-if="serviceOptions.cloud_providers">
              <label class="control-label m-0 mt-2"
                >Provider nodes to be installed on</label
              >
              <div class="col">
                <br />
                <div class="card daiteap-content-card p-0 m-0">
                  <label
                    v-if="
                      showProviderAws &&
                      serviceOptions.cloud_providers.values.includes('aws')
                    "
                    class="card-header pl-0 ml-0"
                  >
                    <div class="custom-control custom-checkbox">
                      <input
                        type="checkbox"
                        class="custom-control-input"
                        id="awsSelected"
                        @click="
                          selectDeselectProvider(
                            'aws',
                            form.cloud_providers.awsSelected
                          )
                        "
                        :checked="form.cloud_providers.awsSelected"
                      />
                      <label class="custom-control-label" for="awsSelected">
                        <img
                          title="aws"
                          margin-top="auto"
                          margin-bottom="auto"
                          class="pr-2"
                          height="20pix"
                          width="auto"
                          src="../../../assets/img/aws_logo_small.png"
                          alt=""
                        />
                        AWS
                      </label>
                    </div>
                  </label>

                  <label
                    v-if="
                      showProviderAzure &&
                      serviceOptions.cloud_providers.values.includes('azure')
                    "
                    class="card-header pl-0 ml-0"
                  >
                    <div class="custom-control custom-checkbox">
                      <input
                        type="checkbox"
                        class="custom-control-input"
                        id="azureSelected"
                        @click="
                          selectDeselectProvider(
                            'azure',
                            form.cloud_providers.azureSelected
                          )
                        "
                        :checked="form.cloud_providers.azureSelected"
                      />
                      <label class="custom-control-label" for="azureSelected">
                        <img
                          title="Azure"
                          margin-top="auto"
                          margin-bottom="auto"
                          class="pr-2"
                          height="20pix"
                          width="auto"
                          src="../../../assets/img/azure_logo_small.png"
                          alt=""
                        />
                        Azure
                      </label>
                    </div>
                  </label>

                  <label
                    v-if="
                      showProviderGoogle &&
                      serviceOptions.cloud_providers.values.includes('google')
                    "
                    class="card-header pl-0 ml-0"
                  >
                    <div class="custom-control custom-checkbox">
                      <input
                        type="checkbox"
                        class="custom-control-input"
                        id="googleSelected"
                        @click="
                          selectDeselectProvider(
                            'google',
                            form.cloud_providers.googleSelected
                          )
                        "
                        :checked="form.cloud_providers.googleSelected"
                      />
                      <label class="custom-control-label" for="googleSelected">
                        <img
                          title="Google"
                          margin-top="auto"
                          margin-bottom="auto"
                          class="pr-2"
                          height="20pix"
                          width="auto"
                          src="../../../assets/img/googleCloud_logo_small.png"
                          alt=""
                        />
                        Google
                      </label>
                    </div>
                  </label>

                  <label
                    v-if="
                      showProviderOpenstack &&
                      serviceOptions.cloud_providers.values.includes(
                        'openstack'
                      )
                    "
                    class="card-header pl-0 ml-0"
                  >
                    <div class="custom-control custom-checkbox">
                      <input
                        type="checkbox"
                        class="custom-control-input"
                        id="openstackSelected"
                        @click="
                          selectDeselectProvider(
                            'openstack',
                            form.cloud_providers.openstackSelected
                          )
                        "
                        :checked="form.cloud_providers.openstackSelected"
                      />
                      <label
                        class="custom-control-label"
                        for="openstackSelected"
                      >
                        <img
                          v-if="computed_theme == 'daiteap'"
                          title="OpenStack"
                          margin-top="auto"
                          margin-bottom="auto"
                          class="pr-2"
                          height="20pix"
                          width="auto"
                          src="../../../assets/img/openstack_logo_small.png"
                          alt=""
                        />
                        <span class="openstack-text" />
                      </label>
                    </div>
                  </label>

                  <label
                    v-if="
                      showProviderOnpremise &&
                      serviceOptions.cloud_providers.values.includes(
                        'onpremise'
                      )
                    "
                    class="card-header pl-0 ml-0"
                  >
                    <div class="custom-control custom-checkbox">
                      <input
                        type="checkbox"
                        class="custom-control-input"
                        id="onpremiseSelected"
                        @click="
                          selectDeselectProvider(
                            'onpremise',
                            form.cloud_providers.onpremiseSelected
                          )
                        "
                        :checked="form.cloud_providers.onpremiseSelected"
                      />
                      <label
                        class="custom-control-label"
                        for="onpremiseSelected"
                      >
                        <img
                          title="Onpremise"
                          margin-top="auto"
                          margin-bottom="auto"
                          class="pr-2"
                          height="20pix"
                          width="auto"
                          src="../../../assets/img/onpremise.svg"
                          alt=""
                        />
                        Onpremise
                      </label>
                    </div>
                  </label>

                  <label
                    v-if="
                      showProviderIotArm &&
                      serviceOptions.cloud_providers.values.includes('iotarm')
                    "
                    class="card-header pl-0 ml-0"
                  >
                    <div class="custom-control custom-checkbox">
                      <input
                        type="checkbox"
                        class="custom-control-input"
                        id="iotarmSelected"
                       @click="
                          selectDeselectProvider(
                            'iotarm',
                            form.cloud_providers.iotarmSelected
                          )
                        "
                        :checked="form.cloud_providers.iotarmSelected"
                      />
                      <label class="custom-control-label" for="iotarmSelected">
                        <img
                          title="IotArm"
                          margin-top="auto"
                          margin-bottom="auto"
                          class="pr-2"
                          height="20pix"
                          width="auto"
                          src="../../../assets/img/IoTArm_logo_small.svg"
                          alt=""
                        />
                        IotArm
                      </label>
                    </div>
                  </label>
                </div>
              </div>
              <p
                v-if="
                  this.singleCloudProvider == false &&
                  this.form.cloud_providers.alicloudSelected == false &&
                  this.form.cloud_providers.awsSelected == false &&
                  this.form.cloud_providers.googleSelected == false &&
                  this.form.cloud_providers.openstackSelected == false &&
                  this.form.cloud_providers.azureSelected == false &&
                  this.form.cloud_providers.onpremiseSelected == false &&
                  this.form.cloud_providers.iotarmSelected == false
                "
                class="help text-danger text-start"
                style="margin-top: 1rem"
              >
                Please select one or more providers
              </p>
              <p
                v-else-if="
                  this.singleCloudProvider == true &&
                  this.form.cloud_providers.alicloudSelected == false &&
                  this.form.cloud_providers.awsSelected == false &&
                  this.form.cloud_providers.googleSelected == false &&
                  this.form.cloud_providers.openstackSelected == false &&
                  this.form.cloud_providers.azureSelected == false &&
                  this.form.cloud_providers.onpremiseSelected == false &&
                  this.form.cloud_providers.iotarmSelected == false
                "
                class="help text-danger text-start"
                style="margin-top: 1rem"
              >
                Please select a provider
              </p>
              <div v-else style="height: 1.15rem; margin-top: 1rem"></div>
            </div>
          </b-collapse>
          <b-collapse :visible="showCustom">
            <YAMLUpload
              ref="YAMLUpload"
              :key="YAMLUploadKey"
              @yaml-upload-update-form="yamlUploadUpdateForm"
            ></YAMLUpload>
          </b-collapse>
        </div>

        <br />
        <!-- <div>
          <span class="pointer" @click="showAdvanced = !showAdvanced"
            >Advanced options
            <i v-show="!showAdvanced" class="fas fa-angle-right">...</i>
            <i v-show="showAdvanced" class="fas fa-angle-down"></i>
          </span>
          <hr />
          <b-collapse id="advanced" :visible="showAdvanced" class="mt-2">
            <div class="row">
              <b-collapse id="chooseServiceType" visible class="col-4 mt-2">
                <div
                  v-show="!showCustom"
                  v-if="
                    serviceOptions.service_type && serviceOptions.yamlConfig
                  "
                >
                  <label class="control-label">Service Type: </label>
                  <label class="card-header" id="clusterIPRadioHeader">
                    <div class="custom-control custom-radio">
                      <input
                        v-model="form.service_type"
                        type="radio"
                        id="clusterIPRadio"
                        name="service_type"
                        value="NodePort"
                        class="custom-control-input"
                      />
                      <label
                        class="custom-control-label pointer"
                        for="clusterIPRadio"
                        >NodePort</label
                      >
                      <br />
                    </div>
                  </label>
                  <div class="radios">
                    <label class="card-header">
                      <div class="custom-control custom-radio">
                        <input
                          v-model="form.service_type"
                          type="radio"
                          id="loadBalancerRadio"
                          name="service_type"
                          value="LoadBalancer"
                          class="custom-control-input"
                          disabled="true"
                        />
                        <label
                          class="custom-control-label pointer"
                          for="loadBalancerRadio"
                          >LoadBalancer</label
                        >
                        <br />
                      </div>
                    </label>
                  </div>
                </div>
              </b-collapse>

              <b-collapse
                v-if="serviceOptions.yamlConfig"
                visible
                class="col-7 ml-5 p-0"
              >
                <label class="control-label m-0 mt-2"
                  >Provide custom configured YAML file:</label
                >
                <div class="col">
                  <div class="row justify-content-start">
                    <div
                      class="card mb-2 mr-3 baseBlock"
                      :class="showCustom ? 'selected-alert' : 'baseBlock'"
                      style="text-align: center"
                      @click="
                        showUploadYAML = !showUploadYAML;
                        showCustom = !showCustom;
                        toggleCustomConfig();
                      "
                    >
                      <div class="providerLogoDiv">
                        <img
                          src="../../../assets/img/yaml.svg"
                          alt=""
                          class="providerLogo"
                        />
                      </div>
                      <div v-if="!showCustom" class="m-0 p-0">Upload</div>
                      <div v-else class="m-0 p-0">Cancel YAML</div>
                    </div>
                  </div>
                </div>
              </b-collapse>
            </div>
            <div v-show="!showCustom" class="row">
              <div
                class="col-xl-3 col-lg-6 col-md-6 col-sm-12 pt-4"
                v-show="!showCustom"
                v-if="serviceOptions.service_type && !serviceOptions.yamlConfig"
              >
                <label class="control-label" style="font-weight: bold"
                  >Service Type:
                </label>
                <label class="card-header" id="clusterIPRadioHeader">
                  <div class="custom-control custom-radio">
                    <input
                      v-model="form.service_type"
                      type="radio"
                      id="clusterIPRadio"
                      name="service_type"
                      value="NodePort"
                      class="custom-control-input"
                    />
                    <label
                      class="custom-control-label pointer"
                      for="clusterIPRadio"
                      >NodePort</label
                    >
                    <br />
                  </div>
                </label>
                <div class="radios">
                  <label class="card-header">
                    <div class="custom-control custom-radio">
                      <input
                        v-model="form.service_type"
                        type="radio"
                        id="loadBalancerRadio"
                        name="service_type"
                        value="LoadBalancer"
                        class="custom-control-input"
                        disabled="true"
                      />
                      <label
                        class="custom-control-label pointer"
                        for="loadBalancerRadio"
                        >LoadBalancer</label
                      >
                      <br />
                    </div>
                  </label>
                </div>
              </div>
              <div
                class="col-xl-3 col-lg-4 col-md-6 col-sm-12 pt-4"
                v-for="(parameter, name, index) in serviceOptionsReduced"
                :key="index"
              >
                <label class="control-label pb-0 mb-0" style="font-weight: bold"
                  >{{ convertToTitleCase(name) }}:
                </label>
                <div v-if="parameter.choice == 'single'">
                  <hr class="m-0 p-0" />
                  <label
                    class="card-header"
                    v-for="(option, index) in parameter.values"
                    :key="option + index"
                  >
                    <div class="custom-control custom-radio">
                      <input
                        required
                        v-model="formExtraFields[name]"
                        type="radio"
                        :id="option + index"
                        :name="name"
                        :value="option"
                        class="custom-control-input"
                        @change="formExtraFieldsCheck"
                      />
                      <label
                        class="custom-control-label pointer"
                        :for="option + index"
                        >{{ option }}</label
                      >
                      <br />
                    </div>
                  </label>
                </div>

                <div v-if="parameter.choice == 'multiple'">
                  <hr class="m-0 p-0" />
                  <label
                    class="card-header"
                    v-for="(option, index) in parameter.values"
                    :key="option + index"
                  >
                    <div class="custom-control custom-checkbox">
                      <input
                        required
                        v-model="formExtraFields[name]"
                        type="checkbox"
                        :id="option + index"
                        :name="name"
                        :value="option"
                        class="custom-control-input"
                        @change="formExtraFieldsCheck"
                      />
                      <label
                        class="custom-control-label pointer"
                        :for="option + index"
                        >{{ option }}</label
                      >
                      <br />
                    </div>
                  </label>
                </div>

                <div
                  v-if="
                    parameter.choice == 'custom' && parameter.type == 'string'
                  "
                >
                  <div class="control" :id="name">
                    <input
                      required
                      v-model="formExtraFields[name]"
                      class="form-control"
                      type="text"
                      autocomplete="off"
                      @change="formExtraFieldsCheck"
                      @keyup="formExtraFieldsCheck()"
                      @keydown="formExtraFieldsCheck()"
                    />
                    <div style="height: 1.2rem; margin-top: 0rem"></div>
                  </div>
                </div>

                <div
                  v-if="parameter.choice == 'custom' && parameter.type == 'int'"
                >
                  <div class="control" :id="name">
                    <input
                      required
                      v-model="formExtraFields[name]"
                      class="form-control"
                      type="number"
                      autocomplete="off"
                      @change="formExtraFieldsCheck"
                      min="0"
                      @keyup="formExtraFieldsCheck()"
                      @keydown="formExtraFieldsCheck()"
                    />
                    <div
                      v-if="formExtraFields[name] <= 0"
                      style="
                        height: 1.2rem;
                        margin-top: 0rem;
                        color: red;
                        font-size: 12px;
                      "
                    >
                      Please provide integer greater than 0
                    </div>
                    <div style="height: 1.2rem; margin-top: 0rem"></div>
                  </div>
                </div>
              </div>
            </div>
          </b-collapse>
        </div> -->
      </div>
    </div>
  </div>
</template>

<script>
import { validationMixin } from "vuelidate";
import Vue from "vue";
import axios from "axios";
import YAMLUpload from "./YAMLUpload";

export default {
  name: "SimpleConfig",
  props: [
    "clickedNext",
    "currentStep"
  ],
  mixins: [validationMixin],
  mounted() {
    let self = this;
    self.$root.$on("clicking-back-" + Vue.prototype.$currentIndex, () =>
      (function () {
        self.$destroy();
      })()
    );
    this.getUsersProjectsList();
  },
  destroyed() {
    this.$finalModel = {};
  },
  methods: {
    setFormName(value) {
      this.$emit('set-form-name', value);
    },
    setFormNamespace(value) {
      this.$emit('set-form-namespace', value);
    },
    setClusterID(value) {
      this.$emit('set-cluster-id', value);
    },
    setFormValuesFile(value) {
      this.$emit('set-form-values-file', value);
    },
    setFormConfigurationType(value) {
      this.$emit('set-form-configuration-type', value);
    },
    getFormName() {
      return this.$emit('get-form-name');
    },
    getFormNamespace() {
      return this.$emit('get-form-namespace');
    },
    getFormConfigurationType() {
      return this.$emit('get-form-configuration-type');
    },
    async getUsersClustersList() {
      let self = this;
      let clusters = await this.getAllClusters();

      self.$finalModel.selectedCluster = {};
      this.serviceOptions = {};
      this.serviceOptionsReduced = {};
      this.formExtraFields = {};
      this.listNamespaces = [];

      self.clustersList = [];
      let kubernetesClusters = clusters.filter(
        (el) =>
          (el.type == 1 ||
            el.type == 3 ||
            el.type == 5 ||
            el.type == 7 ||
            el.type == 8) &&
          el.project_id == self.$finalModel.selectedProject &&
          el.installstep == 0
      );
      for (let i = 0; i < kubernetesClusters.length; i++) {
        self.clustersList[i] = {
          Name: "",
          Status: "",
          ID: "",
        };
        self.clustersList[i].Name = kubernetesClusters[i].name;
        self.clustersList[i].Description = kubernetesClusters[i].description;
        self.clustersList[i].ProjectName = kubernetesClusters[i].project_name;
        self.clustersList[i].Contact = kubernetesClusters[i].contact;
        self.clustersList[i].ID = kubernetesClusters[i].id;
        self.clustersList[i].InstallStep = kubernetesClusters[i].installstep;
        self.clustersList[i].ResizeStep = kubernetesClusters[i].resizestep;
        self.clustersList[i].Type = kubernetesClusters[i].type;
        self.clustersList[i].Status = kubernetesClusters[i].status;
        self.clustersList[i].CreatedAt = new Date(
          kubernetesClusters[i].created_at
        );
        self.clustersList[i].ErrorMsgDelete =
          kubernetesClusters[i].error_msg_delete;
        self.clustersList[i].Providers = "";
        if (kubernetesClusters[i].providers != null) {
          try {
            let clusterProviders = JSON.parse(kubernetesClusters[i].providers);
            for (let y = 0; y < clusterProviders.length; y++) {
              self.clustersList[i].Providers += clusterProviders[y] + ", ";
            }
            self.clustersList[i].Providers = self.clustersList[
              i
            ].Providers.substring(0, self.clustersList[i].Providers.length - 2);
          } catch (error) {
            console.log(error);
          }
        }
      }

      self.loading = false;
      if (self.clustersList.length > 0) {
        self.$finalModel.selectedCluster = self.clustersList[0].ID;
        self.setClusterID(self.$finalModel.selectedCluster);
        self.setServiceOptions(self);
        self.setDefaultName(self);
      }
    },
    async getUsersProjectsList() {
      let self = this;
      self.clustersList = [];
      self.$finalModel.selectedCluster = {};
      self.projectsList = [];
      self.$finalModel.selectedProject = null;

      let projects = await this.getProjects();

      self.projectsList = [];
      for (let i = 0; i < projects.length; i++) {
        self.projectsList[i] = {
          Name: "",
          Status: "",
          ID: "",
        };
        self.projectsList[i].Name = projects[i].name;
        self.projectsList[i].Description = projects[i].description;
        self.projectsList[i].Contact = projects[i].contact;
        self.projectsList[i].ID = projects[i].id;
        self.projectsList[i].CreatedAt = new Date(projects[i].created_at);
      }

      self.loading = false;
      // if (
      //   Object.keys(self.$finalModel.selectedProject).length === 0 &&
      //   self.projectsList.length > 0
      // ) {
      //   self.$finalModel.selectedProject = self.projectsList[0].ID;
      // }
    },
    updateSingleProvider(singleCloudProviderSelected) {
      if (this.singleCloudProvider == true) {
        this.form.cloud_providers.alicloudSelected = false;
        this.form.cloud_providers.awsSelected = false;
        this.form.cloud_providers.googleSelected = false;
        this.form.cloud_providers.openstackSelected = false;
        this.form.cloud_providers.azureSelected = false;
        this.form.cloud_providers.onpremiseSelected = false;
        this.form.cloud_providers.iotarmSelected = false;
        if (singleCloudProviderSelected == "alicloud") {
          this.form.cloud_providers.alicloudSelected = true;
        } else if (singleCloudProviderSelected == "aws") {
          this.form.cloud_providers.awsSelected = true;
        } else if (singleCloudProviderSelected == "google") {
          this.form.cloud_providers.googleSelected = true;
        } else if (singleCloudProviderSelected == "openstack") {
          this.form.cloud_providers.openstackSelected = true;
        } else if (singleCloudProviderSelected == "azure") {
          this.form.cloud_providers.azureSelected = true;
        } else if (singleCloudProviderSelected == "onpremise") {
          this.form.cloud_providers.onpremiseSelected = true;
        } else if (singleCloudProviderSelected == "iotarm") {
          this.form.cloud_providers.iotarmSelected = true;
        }
      }
    },
    yamlUploadUpdateForm(fileUploaded) {
      this.setFormValuesFile(this.valuesFile);
      if (fileUploaded){
        this.setFormConfigurationType("yamlConfig");
        this.$finalModel.configurationType = "yamlConfig";
        this.$finalModel.valuesFile = this.valuesFile;
      } else {
        this.setFormConfigurationType("simpleConfig");
        this.$finalModel.configurationType = "simpleConfig";
      }
    },
    setServiceOptions() {
      let self = this;
      axios
        .get(
          "/server/services/" + self.$finalModel.serviceName + "/options",
          this.get_axiosConfig()
        )
        .then(function (response) {
          self.formExtraFields = {};
          self.serviceOptions = response.data.options;
          self.singleCloudProvider = false;
          if (response.data.options.cloud_providers) {
            if (response.data.options.cloud_providers.choice == "single") {
              self.singleCloudProvider = true;
            }
          }
          if (response.data.options.service_type) {
            if (response.data.options.service_type.default) {
              self.defaultServiceType =
                response.data.options.service_type.default;
            }
          }
          if (response.data.options["cloud_providers"]) {
            if (response.data.options["cloud_providers"].default) {
              for (
                let i = 0;
                i < response.data.options["cloud_providers"].default.length;
                i++
              ) {
                if (
                  response.data.options["cloud_providers"].default[i] == "aws"
                ) {
                  self.selectDeselectProvider(
                    "aws",
                    self.form.cloud_providers.awsSelected
                  );
                }
                if (
                  response.data.options["cloud_providers"].default[i] == "azure"
                ) {
                  self.selectDeselectProvider(
                    "azure",
                    self.form.cloud_providers.azureSelected
                  );
                }
                if (
                  response.data.options["cloud_providers"].default[i] ==
                  "google"
                ) {
                  self.selectDeselectProvider(
                    "google",
                    self.form.cloud_providers.googleSelected
                  );
                }
                if (
                  response.data.options["cloud_providers"].default[i] ==
                  "openstack"
                ) {
                  self.selectDeselectProvider(
                    "openstack",
                    self.form.cloud_providers.openstackSelected
                  );
                }
                if (
                  response.data.options["cloud_providers"].default[i] ==
                  "onpremise"
                ) {
                  self.selectDeselectProvider(
                    "onpremise",
                    self.form.cloud_providers.onpremiseSelected
                  );
                }
                if (
                  response.data.options["cloud_providers"].default[i] ==
                  "iotarm"
                ) {
                  self.selectDeselectProvider(
                    "iotarm",
                    self.form.cloud_providers.iotarmSelected
                  );
                }
              }
            }
          }

          if (response.data.options["namespace"]) {
            if (response.data.options["namespace"].default) {
              self.formExtraFields["namespace"] =
                response.data.options["namespace"].default;
              self.setFormNamespace(response.data.options["namespace"].default);
              if (
                !self.listNamespaces.includes(
                  response.data.options["namespace"].default
                )
              ) {
                self.listNamespaces.push(
                  response.data.options["namespace"].default
                );
              }
            } else {
              self.formExtraFields["namespace"] = "";
            }
          }
          for (const item in response.data.options) {
            if (
              ![
                "name",
                "namespace",
                "service_type",
                "replicas",
                "cloud_providers",
                "yamlConfig",
              ].includes(item)
            ) {
              self.serviceOptionsReduced[item] = response.data.options[item];
              if (
                response.data.options[item].default &&
                response.data.options[item].choice != "multiple"
              ) {
                self.formExtraFields[item] =
                  response.data.options[item].default;
              } else if (response.data.options[item].choice == "multiple") {
                self.formExtraFields[item] = [];
                if (response.data.options[item].default[0]) {
                  for (
                    let i = 0;
                    i < response.data.options[item].default.length;
                    i++
                  ) {
                    self.formExtraFields[item].push(
                      response.data.options[item].default[i]
                    );
                  }
                }
              } else {
                self.formExtraFields[item] = "";
              }
            }
          }
          self.formExtraFieldsCheck();
          self.serviceOptionsCheck();
          self.getClusterDetails(self);
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
    setDefaultName() {
      let self = this;
      axios
        .get(
          "/server/tenants/" +
            self.computed_active_tenant_id +
            "/clusters/" +
            self.$finalModel.selectedCluster +
            "/services/" +
            self.$finalModel.serviceName +
            "/default-name",
          this.get_axiosConfig()
        )
        .then(function (response) {
          self.defaultName = response.data.defaultName;
          self.setFormName(response.data.defaultName);
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
    parseReplicaCount() {
      this.form.replicas = parseInt(this.form.replicas);
    },
    async getClusterDetails(currentObject) {
      let self = currentObject;
      let cluster = await this.getClusterDetailsMain(
        self.$finalModel.selectedCluster
      );

      // if (self.serviceOptions.service_type) {
      //   if (cluster.hasLoadBalancerIntegration) {
      //     $("#loadBalancerRadio")[0].disabled = false;
      //   }
      //   if (
      //     self.defaultServiceType == "LoadBalancer" &&
      //     $("#loadBalancerRadio")[0].disabled == false
      //   ) {
      //     $("#loadBalancerRadio")[0].checked = true;
      //     self.form.service_type = "LoadBalancer";
      //   } else {
      //     $("#clusterIPRadio")[0].checked = true;
      //     self.form.service_type = "NodePort";
      //   }
      // }
      self.form.service_type = "NodePort";

      self.selectedProviders = [];

      self.showProviderAws = false;
      self.showProviderAzure = false;
      self.showProviderGoogle = false;
      self.showProviderOpenstack = false;
      self.showProviderOnpremise = false;
      self.showProviderIotArm = false;

      if (cluster.providers.awsSelected) {
        self.selectedProviders.push("awsSelected");
        self.showProviderAws = true;
        self.$bvModal.show("bv-modal-provideraws");
      }
      if (cluster.providers.azureSelected) {
        self.selectedProviders.push("azureSelected");
        self.showProviderAzure = true;
        self.$bvModal.show("bv-modal-providerazure");
      }
      if (cluster.providers.googleSelected) {
        self.selectedProviders.push("googleSelected");
        self.showProviderGoogle = true;
        self.$bvModal.show("bv-modal-providergoogle");
      }
      if (cluster.providers.openstackSelected) {
        self.selectedProviders.push("openstackSelected");
        self.showProviderOpenstack = true;
        self.$bvModal.show("bv-modal-provideropenstack");
      }
      if (cluster.providers.onpremiseSelected) {
        self.selectedProviders.push("onpremiseSelected");
        self.showProviderOnpremise = true;
        self.$bvModal.show("bv-modal-provideronpremise");
      }
      if (cluster.providers.iotarmSelected) {
        self.selectedProviders.push("iotarmSelected");
        self.showProviderIotArm = true;
        self.$bvModal.show("bv-modal-provideriotarm");
      }

      self.reservedServiceNames = [];

      for (let i = 0; i < cluster.serviceList.length; i++) {
        self.reservedServiceNames.push(cluster.serviceList[i]["name"]);
        if (cluster.serviceList[i].namespace) {
          if (!self.listNamespaces.includes(cluster.serviceList[i].namespace)) {
            self.listNamespaces.push(cluster.serviceList[i].namespace);
          }
        }
      }

      if (self.selectedProviders.length == 1) {
        self.form.cloud_providers[self.selectedProviders[0]] = true;
        self.formExtraFieldsCheck();
        self.$emit("can-continue", { value: true });
      }
      self.loadingAvailableProviders = false;
    },
    selectDeselectProvider(provider, selected) {
      if (this.singleCloudProvider == true) {
        this.updateSingleProvider(provider);
      } else {
        if (selected == false) {
          if (provider == "aws") {
            this.form.cloud_providers.awsSelected = true;
          } else if (provider == "azure") {
            this.form.cloud_providers.azureSelected = true;
          } else if (provider == "google") {
            this.form.cloud_providers.googleSelected = true;
          } else if (provider == "openstack") {
            this.form.cloud_providers.openstackSelected = true;
          } else if (provider == "onpremise") {
            this.form.cloud_providers.onpremiseSelected = true;
          } else if (provider == "iotarm") {
            this.form.cloud_providers.iotarmSelected = true;
          }
        } else {
          if (provider == "aws") {
            this.form.cloud_providers.awsSelected = false;
          } else if (provider == "azure") {
            this.form.cloud_providers.azureSelected = false;
          } else if (provider == "google") {
            this.form.cloud_providers.googleSelected = false;
          } else if (provider == "openstack") {
            this.form.cloud_providers.openstackSelected = false;
          } else if (provider == "onpremise") {
            this.form.cloud_providers.onpremiseSelected = false;
          } else if (provider == "iotarm") {
            this.form.cloud_providers.iotarmSelected = false;
          }
        }
      }
      this.formExtraFieldsCheck();
    },
    toggleCustomConfig() {
      if (this.showCustom) {
        this.setFormConfigurationType("yamlConfig");
      } else {
        this.setFormConfigurationType("simpleConfig");
      }
    },
    resetForm() {
      this.form.cloud_providers.alicloudSelected = false;
      this.form.cloud_providers.awsSelected = false;
      this.form.cloud_providers.googleSelected = false;
      this.form.cloud_providers.openstackSelected = false;
      this.form.cloud_providers.azureSelected = false;
      this.form.cloud_providers.onpremiseSelected = false;
      this.form.cloud_providers.iotarmSelected = false;
      this.form.valuesFile = "";
      this.form.replicas = 1;
      if (this.showCustom && this.showUploadYAML) {
        this.toggleCustomConfig();
      }
      this.showAdvanced = false;
      this.$bvModal.hide("bv-modal-advanced");
      this.showCustom = false;
      this.$bvModal.hide("bv-modal-custom");
      this.showUploadYAML = false;
      this.$bvModal.hide("bv-modal-uploadyaml");
      this.setFormNamespace("");
      this.showAddNewNamespace = false;
      this.$bvModal.hide("bv-modal-addnewnamespace");
      this.setFormValuesFile("");
      this.YAMLUploadKey += 1;
      Vue.prototype.$finalModel = {};
      this.serviceOptions = {};
      this.serviceOptionsReduced = {};
      this.formExtraFields = {};
      this.listNamespaces = [];
    },
    addNewNamespace() {
      if (this.formExtraFields.namespace === "...Add new namespace") {
        this.formExtraFields.namespace = "";
        this.showAddNewNamespace = true;
      }
      this.formExtraFieldsCheck();
    },
    convertToTitleCase(text) {
      let title = text.toLowerCase().replace("_", " ");
      title = title.split(" ");
      for (let i = 0; i < title.length; i++) {
        title[i] = title[i][0].toUpperCase() + title[i].slice(1);
      }
      return title.join(" ");
    },
    updateArraySelectedOptions(name, option) {
      if (this.formExtraFields[name][option]) {
        this.formExtraFields[name].push(option);
        delete this.formExtraFields[name][option];
      } else if (this.formExtraFields[name].includes(option)) {
        delete this.formExtraFields[name][option];
        this.removeValueFromArray(option, this.formExtraFields[name]);
      }
    },
    removeValueFromArray(value, array) {
      function findIndexToRemove(valueToRemove) {
        return valueToRemove === value;
      }
      let indexToRemove = array.findIndex(findIndexToRemove);
      array.splice(indexToRemove, 1);
    },
    updateFormExtraFieldsObjectsToArrayofValues() {
      for (let item in this.formExtraFields) {
        if (Array.isArray(this.formExtraFields[item])) {
          for (let subItem in this.formExtraFields[item]) {
            if (!this.formExtraFields[item][subItem]) {
              if (subItem) {
                delete this.formExtraFields[item][subItem];
                this.removeValueFromArray(subItem, this.formExtraFields[item]);
              }
            } else if (this.formExtraFields[item][subItem] === true) {
              this.formExtraFields[item].push(subItem);
              delete this.formExtraFields[item][subItem];
            }
          }
        }
      }
    },
    cloudProvidersToArrayofValues() {
      if (this.serviceOptions.cloud_providers) {
        this.updateFormCloudProvidersToArrayofValues();
      }
    },
    updateFormCloudProvidersToArrayofValues() {
      if (this.serviceOptions.cloud_providers.choice == "multiple") {
        let arrayOfProviders = [];
        if (this.form.cloud_providers.alicloudSelected == true) {
          arrayOfProviders.push("alicloud");
        }
        if (this.form.cloud_providers.awsSelected == true) {
          arrayOfProviders.push("aws");
        }
        if (this.form.cloud_providers.azureSelected == true) {
          arrayOfProviders.push("azure");
        }
        if (this.form.cloud_providers.googleSelected == true) {
          arrayOfProviders.push("google");
        }
        if (this.form.cloud_providers.openstackSelected == true) {
          arrayOfProviders.push("openstack");
        }
        if (this.form.cloud_providers.onpremiseSelected == true) {
          arrayOfProviders.push("onpremise");
        }
        if (this.form.cloud_providers.iotarmSelected == true) {
          arrayOfProviders.push("iotarm");
        }
        Vue.prototype.$finalModel.cloud_providers = arrayOfProviders;
      }
      if (this.serviceOptions.cloud_providers.choice == "single") {
        let providerString = "";
        if (this.form.cloud_providers.alicloudSelected == true) {
          providerString = "alicloud";
        }
        if (this.form.cloud_providers.awsSelected == true) {
          providerString = "aws";
        }
        if (this.form.cloud_providers.azureSelected == true) {
          providerString = "azure";
        }
        if (this.form.cloud_providers.googleSelected == true) {
          providerString = "google";
        }
        if (this.form.cloud_providers.openstackSelected == true) {
          providerString = "openstack";
        }
        if (this.form.cloud_providers.onpremiseSelected == true) {
          providerString = "onpremise";
        }
        if (this.form.cloud_providers.iotarmSelected == true) {
          providerString = "iotarm";
        }
        Vue.prototype.$finalModel.cloud_providers = providerString;
      }
    },
    formExtraFieldsCheck() {
      this.emptyExtraFields = false;

      formName = this.getFormName();
      if (
        !(
          formName &&
          formName.length > 0 &&
          formName.length < 31 &&
          formName.match(/^[a-z0-9-]+$/) &&
          !formName.startsWith("-") &&
          !formName.endsWith("-")
        )
      ) {
        this.emptyExtraFields = true;
        this.invalidName = true;
      } else {
        this.invalidName = false;
      }

      if (
        this.reservedServiceNames.indexOf(formName) > -1
      ) {
        this.emptyExtraFields = true;
        this.existingServiceName = true;
      } else {
        this.existingServiceName = false;
      }

      if (this.serviceOptions.cloud_providers) {
        if (
          (this.form.cloud_providers.alicloudSelected == false &&
            this.form.cloud_providers.awsSelected == false &&
            this.form.cloud_providers.googleSelected == false &&
            this.form.cloud_providers.openstackSelected == false &&
            this.form.cloud_providers.azureSelected == false &&
            this.form.cloud_providers.onpremiseSelected == false &&
            this.form.cloud_providers.iotarmSelected == false) ||
          this.form.replicas < 1
        ) {
          this.emptyExtraFields = true;
        }
      }
      for (let field in this.formExtraFields) {
        if (
          this.formExtraFields[field] == false ||
          this.formExtraFields[field].length == 0 ||
          this.formExtraFields[field] == ""
        ) {
          this.emptyExtraFields = true;
        }
      }
      if (this.emptyExtraFields == false) {
        this.$emit("can-continue", { value: true });
      } else {
        this.$emit("can-continue", { value: false });
      }
    },
    checkIfObjectIsEmpty(value) {
      return Object.keys(value).length === 0 && value.constructor === Object;
    },
    serviceOptionsCheck() {
      let emptyFields = false;
      formName = this.getFormName();

      if (this.checkIfObjectIsEmpty(this.formExtraFields)) {
        if (
          !formName ||
          !this.getFormConfigurationType()
        ) {
          emptyFields == true;
        }
        if (emptyFields == false) {
          this.$emit("can-continue", { value: true });
        } else {
          this.$emit("can-continue", { value: false });
        }
      }
    },
  },
  data() {
    return {
      reservedServiceNames: [],
      invalidName: false,
      existingServiceName: false,
      selectedProviders: [],
      defaultName: "name",
      projectsList: [],
      clustersList: [],
      singleCloudProvider: true,
      singleCloudProviderSelected: "",
      showProviderAlicloud: false,
      showProviderAws: false,
      showProviderAzure: false,
      showProviderGoogle: false,
      showProviderOpenstack: false,
      showProviderOnpremise: false,
      showProviderIotArm: false,
      showAdvanced: false,
      showCustom: false,
      showUploadYAML: false,
      showAddNewNamespace: false,
      loadingAvailableProviders: true,
      emptyExtraFields: true,
      valuesFile: "",
      form: {
        replicas: 1,
        service_type: "",
        valuesFile: "",
        cloud_providers: {
          alicloudSelected: false,
          awsSelected: false,
          googleSelected: false,
          openstackSelected: false,
          azureSelected: false,
          onpremiseSelected: false,
          iotarmSelected: false,
        },
      },
      serviceOptions: {},
      serviceOptionsReduced: {},
      formExtraFields: {},
      listNamespaces: [],
      YAMLUploadKey: 0,
    };
  },
  components: {
    YAMLUpload,
  },
  validations: {
    form: {},
  },
  watch: {
    $v: {
      handler: function () {
        if (
          (this.form.cloud_providers.alicloudSelected == false &&
            this.form.cloud_providers.awsSelected == false &&
            this.form.cloud_providers.googleSelected == false &&
            this.form.cloud_providers.openstackSelected == false &&
            this.form.cloud_providers.azureSelected == false &&
            this.form.cloud_providers.onpremiseSelected == false &&
            this.form.cloud_providers.iotarmSelected == false) ||
          this.form.replicas < 1 ||
          this.emptyExtraFields
        ) {
          this.$emit("can-continue", { value: false });
          setTimeout(() => {
            this.$emit("change-next", { nextBtnValue: false });
          }, 3000);
        } else {
          Vue.prototype.$finalModel = {
            ...Vue.prototype.$finalModel,
            ...this.form,
            ...this.formExtraFields,
          };
          this.$emit("can-continue", { value: true });
        }
        if (this.form.configurationType === "yamlConfig") {
          Vue.prototype.$finalModel = {
            ...Vue.prototype.$finalModel,
            ...this.form,
          };
          this.$emit("can-continue", { value: true });
        }
      },
      deep: true,
    },
  },
};
</script>

<style scoped>
.card-header {
  background-color: white;
  box-shadow: none;
  border-top: none;
  cursor: pointer;
}
#clusterIPRadioHeader {
  border-top: 1px rgba(128, 128, 128, 0.459) solid;
}
.pointer {
  cursor: pointer;
}

.btn-primary {
  margin-bottom: 15px;
}
.providerLogoDiv {
  height: 100px;
  width: 100px;
}
.providerLogo {
  object-fit: cover;
  position: relative;
  top: 50%;
  -webkit-transform: translateY(-50%);
  -ms-transform: translateY(-50%);
  transform: translateY(-50%);
  display: block;
  margin-left: auto;
  margin-right: auto;
  width: 95%;
}
.baseBlock {
  -moz-transition: all 0.3s cubic-bezier(0.165, 0.84, 0.44, 1);
  -o-transition: all 0.3s cubic-bezier(0.165, 0.84, 0.44, 1);
  transition: all 0.3s cubic-bezier(0.165, 0.84, 0.44, 1);
}

.baseBlock:hover {
  cursor: pointer;
  -webkit-transform: translate(0, -4px);
  -moz-transform: translate(0, -4px);
  -ms-transform: translate(0, -4px);
  -o-transform: translate(0, -4px);
  transform: translate(0, -4px);
  box-shadow: 0 10px 10px rgba(0, 0, 0, 0.2);
}
.selected {
  cursor: pointer;
  -webkit-transform: translate(0, -4px);
  -moz-transform: translate(0, -4px);
  -ms-transform: translate(0, -4px);
  -o-transform: translate(0, -4px);
  transform: translate(0, -4px);
  box-shadow: 0 15px 10px #07c78781;
}
.selected-alert {
  cursor: pointer;
  -webkit-transform: translate(0, -4px);
  -moz-transform: translate(0, -4px);
  -ms-transform: translate(0, -4px);
  -o-transform: translate(0, -4px);
  transform: translate(0, -4px);
  box-shadow: 0 15px 10px #ee5a0494;
}
.selected-alert:hover {
  cursor: pointer;
  -webkit-transform: translate(0, -4px);
  -moz-transform: translate(0, -4px);
  -ms-transform: translate(0, -4px);
  -o-transform: translate(0, -4px);
  transform: translate(0, -4px);
  box-shadow: 0 15px 10px #964e2436;
}
.card-body {
  border: #00708c10 1px solid;
  border-top: none;
  border-bottom: none;
}
.card-text {
  border: none;
}
.service .card-header {
  background-color: white;
  border: none;
}
.card-footer {
  background-color: white;
  border: none;
}
input:invalid {
  border: red 1px solid;
}
input[value="0"] {
  border: red 1px solid;
}
</style>