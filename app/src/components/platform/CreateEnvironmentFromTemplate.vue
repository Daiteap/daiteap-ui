<template>
  <div>
    <QuotaExceededModal v-show="showQuotaExceeded" :exceededResources="exceededResources"></QuotaExceededModal>
    <ShowErrorCreatingCluster v-show="showModalShowErrorCreatingCluster" :errorMessage="errorMsg"
      modalName='createEnvironmentFromTemplate'></ShowErrorCreatingCluster>
    <div v-if="!configuration.config" style="margin-top: 6rem" class="d-flex justify-content-center">
      <div class="spinner-border" role="status">
        <span class="sr-only">Loading...</span>
      </div>
    </div>
    <div v-else>
      <div class="box pt-1">
        <div>
          <hr :class="templateProvidersList.length == 5 ? 'pb-0' : ''" />

          <div>
            <div class="form-group col-lg-12" :class="
              templateProvidersList.length == 5 ? 'px-1 mb-0' : 'px-1 mb-3'
            ">
              <label class="control-label" :class="
                templateProvidersList.length == 5 ? 'py-0 my-0' : 'pt-3'
              ">
                Environment name: *
              </label>
              <div class="">
                <input v-model="environmentName" v-on:change="$v.environmentName.$touch" class="form-control" :class="[
                  'input',
                  $v.environmentName.$invalid ? 'is-danger' : '',
                ]" autocomplete="off" type="text" id="environmentNameField" />
                <p
                  v-if="
                    environmentName != '' &&
                    !$v.environmentName.and &&
                    $v.environmentName.$dirty
                  "
                  class="help text-danger"
                  style="height: 1.2rem"
                >
                  Invalid name
                </p>
                <p
                  v-else-if="
                    environmentName != '' &&
                    clusterNameResolved &&
                    !$v.environmentName.isNameFree
                  "
                  class="help text-danger"
                  style="height: 1.2rem"
                >
                  {{ clusterNameTakenMsg }}
                </p>
                <div v-else style="height: 1.2rem"></div>
              </div>
            </div>
            <div v-if="configuration.type != 2 && configuration.type != 6" class="form-group col-lg-12" :class="
              templateProvidersList.length == 5 ? 'px-1 mb-0' : 'px-1 mb-3'
            ">
              <label class="control-label" :class="
                templateProvidersList.length == 5 ? 'py-0 my-0' : 'pt-3'
              ">
                Description:
              </label>
              <div class="">
                <b-form-textarea
                  v-model="clusterDescription"
                  v-on:change="$v.clusterDescription.$touch"
                  placeholder="Description"
                  class="form-control"
                  :class="[
                    'input',
                    $v.clusterDescription.$invalid ? 'is-danger' : '',
                  ]"
                  autocomplete="off"
                  type="text"
                  id="clusterDescriptionField"
                ></b-form-textarea>
                <p v-if="$v.clusterDescription.$invalid" class="help text-danger">
                  Invalid cluster description
                </p>
              </div>
            </div>
            <div v-if="configuration.config" class="form-group col- lg-12 mb-3">
              <div class="row px-3">
                <div class="col-6 p-0 m-0">
                  <b>Template:</b> {{ configuration.name }}
                </div>
                <div class="col-6 p-0 m-0">
                  <b>From:</b> {{ formatDate(configuration.created_at) }}
                </div>
                <div v-if="configuration.type == 1" class="col-6 p-0 m-0">
                  <b>Type:</b>
                  Kubernetes Cluster (DLCM)
                </div>
                <div v-else-if="configuration.type == 3" class="col-6 p-0 m-0">
                  <b>Type:</b>
                  K3S
                </div>
                <div v-else-if="configuration.type == 5" class="col-6 p-0 m-0">
                  <b>Type:</b>
                  Kubernetes Cluster (CAPI)
                </div>
                <div v-else-if="configuration.type == 7" class="col-6 p-0 m-0">
                  <b>Type:</b>
                  Kubernetes Cluster (DLCMv2)
                </div>
                <div v-else class="col-6 p-0 m-0">
                  <b>Type:</b>
                  Compute (VM)
                </div>
                <div class="col-6 p-0 m-0">
                  <b>Providers: </b>
                  <img v-for="provider in templateProvidersList" :key="provider + 'logo'" :title="provider"
                    margin-top="auto" margin-bottom="auto" class="pr-2" width="auto" style="height: 20px" :src="
                      require('@/assets/img/' + providerImageFilename(provider))
                    " />
                </div>
                <div v-if="configuration.config.load_balancer_integration" class="col-6 p-0 m-0">
                  <b>Load Balancer: </b>
                  {{ configuration.config.load_balancer_integration }}
                </div>
                <div v-if="configuration.config.kubernetesConfiguration" class="col-6 p-0 m-0">
                  <b>Kubernetes Version: </b>
                  {{ configuration.config.kubernetesConfiguration.version }}
                </div>
              </div>

              <br />

              <div class="mt-2" style="max-height: 600px; overflow-y: auto">
                <div class="row p-1 m-0" v-for="provider in templateProvidersList" :key="provider"
                  :style="customisation(provider)">
                  <div class="form-group col-lg-12" :class="
                    templateProvidersList.length == 5
                      ? 'px-1 mb-0'
                      : 'px-1 mb-3'
                  ">
                    <label class="control-label" :class="
                      templateProvidersList.length == 5 ? 'py-0 my-0' : 'pt-3'
                    ">
                      {{ provider[0].toUpperCase() + provider.slice(1) }}
                      account:
                    </label>
                    <div>
                      <select class="custom-select d-block w-100" id="account"
                        v-model="configuration.config[provider].account">
                        <option v-for="account in availableAccounts[provider]" :key="account.id" :value="account.id">
                          {{ account.label }}
                        </option>
                      </select>
                    </div>
                  </div>

                  <!--- CAPI -->

                  <div class="col px-1" v-if="configuration.type == 5">
                    <div class="mb-2">Nodes:</div>
                    <div v-for="index in configuration.config[provider]
                    .controlPlane.replicas" :key="index">
                      <CreateFromTemplateNode :region="configuration.config[provider].region"
                        :zone="configuration.config[provider].controlPlane.zone" :instanceType="
                          configuration.config[provider].controlPlane
                            .instanceType
                        " :instanceTypeName="
  configuration.config[provider].controlPlane
    .instanceTypeName
" :operatingSystem="
  configuration.config[provider].controlPlane
    .operatingSystem
" :operatingSystemName="
  configuration.config[provider].controlPlane
    .operatingSystemName
" type="Control plane" />
                    </div>

                    <div v-for="(workerNode, index) in configuration.config[
                      provider
                    ].workerNodes" :key="index + 1000">
                      <CreateFromTemplateNode :region="configuration.config[provider].region" :zone="workerNode.zone"
                        :instanceType="workerNode.instanceType" :instanceTypeName="workerNode.instanceTypeName"
                        :operatingSystem="workerNode.operatingSystem"
                        :operatingSystemName="workerNode.operatingSystemName" type="Worker Node" />
                    </div>
                  </div>

                  <div class="col px-1" v-else>
                    <div class="mb-2">Nodes:</div>
                    <div v-for="(node, index) in configuration.config[provider]
                    .nodes" :key="index + 5000">
                      <CreateFromTemplateNode :region="configuration.config[provider].region" :zone="node.zone"
                        :instanceType="node.instanceType" :instanceTypeName="node.instanceTypeName"
                        :operatingSystem="node.operatingSystem" :operatingSystemName="node.operatingSystemName" :type="
                          node.is_control_plane
                            ? 'Control plane'
                            : 'Worker Node'
                        " />
                    </div>
                  </div>
                </div>
              </div>

              <br />
            </div>
            <div class="form-group col-lg-12 d-flex m-0 px-0">
              <div class="col-lg-12 p-0 m-0">
                <div class="custom-button float-right ml-5" @click="createEnvironmentFromTemplate()">
                  Submit
                </div>
                <div class="custom-button float-right mr-5" @click="$router.push({ name: 'DaiteapWebLandingPage' })">
                  Cancel
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import helpers from "@/services/helpers.js";
import CreateFromTemplateNode from "@/components/platform/CreateFromTemplateNode.vue";
import { validationMixin } from "vuelidate";
import {
  required,
  and,
  minLength,
  maxLength,
  minValue,
  maxValue,
  requiredIf,
} from "vuelidate/lib/validators";
import QuotaExceededModal from "@/components/platform/popup_modals/QuotaExceededModal";
import ShowErrorCreatingCluster from "@/components/platform/popup_modals/ShowErrorCreatingCluster";
import "vue-slider-component/theme/default.css";

export default {
  name: "CreateEnvironmentFromTemplate",
  props: {
    projectId: String,
  },
  mixins: [validationMixin],
  data() {
    return {
      environmentName: "",
      clusterDescription: "",
      templateProvidersList: [],
      exceededResources: [],
      showQuotaExceeded: false,
      showModalShowErrorCreatingCluster: false,
      loaded: false,
      submitting: false,
      errorMsg: "",
      error: "",
      gettaskmessageErrorCount: 0,
      configuration: {},
      availableAccounts: {
        aws: [],
        azure: [],
        google: [],
        onpremise: [],
        iotarm: [],
        openstack: [],
      },
      loadingAccounts: true,
      loading: true,
      interval: [],
      clusterNameResolved: true,
      clusterNameTakenMsg: "This name is taken",
    };
  },
  validations: {
    configuration: {
      config: {
        aws: {
          nodes: {
            requiredIf: requiredIf(function () {
              return (
                this.templateProvidersList.includes("aws") &&
                this.configuration.type != 7
              );
            }),
            minValue: minValue(1),
            maxValue: maxValue(500),
          },
        },
        azure: {
          nodes: {
            requiredIf: requiredIf(function () {
              return (
                this.templateProvidersList.includes("azure") &&
                this.configuration.type != 7
              );
            }),
            minValue: minValue(1),
            maxValue: maxValue(500),
          },
        },
        google: {
          nodes: {
            requiredIf: requiredIf(function () {
              return (
                this.templateProvidersList.includes("google") &&
                this.configuration.type != 7
              );
            }),
            minValue: minValue(1),
            maxValue: maxValue(500),
          },
        },
        onpremise: {
          nodes: {
            requiredIf: requiredIf(function () {
              return (
                this.templateProvidersList.includes("onpremise") &&
                this.configuration.type != 7
              );
            }),
            minValue: minValue(1),
            maxValue: maxValue(500),
          },
        },
        iotarm: {
          nodes: {
            requiredIf: requiredIf(function () {
              return (
                this.templateProvidersList.includes("iotarm") &&
                this.configuration.type != 7
              );
            }),
            minValue: minValue(1),
            maxValue: maxValue(500),
          },
        },
        openstack: {
          nodes: {
            requiredIf: requiredIf(function () {
              return (
                this.templateProvidersList.includes("openstack") &&
                this.configuration.type != 7
              );
            }),
            minValue: minValue(1),
            maxValue: maxValue(500),
          },
        },
      },
    },
    environmentName: {
      and: and(minLength(3), maxLength(130)),
      required,
      isNameFree(value) {
        if (value.length > 0) {
          if (this.clusterParams) {
            if (value == this.clusterParams.Name) {
              return true;
            }
          }
          return new Promise((resolve) => {
            let self = this;
            self.clusterNameResolved = false;
            self.clusterNameTakenMsg = "";
            setTimeout(() => {
              let self = this;
              let checkNameEndpoint = ""

              if (this.configuration.type == 6 || this.configuration.type == 2) {
                checkNameEndpoint =
                  "/server/tenants/" +
                  this.computed_active_tenant_id +
                  "/clusters/compute-name-available/" +
                  value;
              } else if (this.configuration.type == 7) {
                checkNameEndpoint =
                  "/server/tenants/" +
                  this.computed_active_tenant_id +
                  "/clusters/dlcmv2-name-available/" +
                  value;
              } else {
                checkNameEndpoint =
                  "/server/tenants/" +
                  this.computed_active_tenant_id +
                  "/clusters/cluster-name-available/" +
                  value;
              }
              this.axios
                .get(
                  checkNameEndpoint,
                  this.get_axiosConfig()
                )
                .then(function (response) {
                  if (response.data.free == true) {
                      self.clusterNameResolved = true;
                      self.clusterNameTakenMsg = "";
                      resolve(true);
                    } else {
                      self.clusterNameResolved = true;
                      self.clusterNameTakenMsg = "This name is taken";
                      resolve(false);
                    }
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
                  resolve(false);
                });
            }, 350);
          });
        } else {
          return false;
        }
      },
    },
    clusterDescription: {
      maxLength: maxLength(1024),
    },
  },
  components: {
    CreateFromTemplateNode,
    QuotaExceededModal,
    ShowErrorCreatingCluster,
  },
  methods: {
    createEnvironmentFromTemplate() {
      let self = this;
      self.configuration.config.clusterName = self.environmentName;
      self.configuration.config.clusterDescription = self.clusterDescription;
      self.configuration.config.projectId = self.projectId;

      let checkNameEndpoint = ""

      if (this.configuration.type == 6) {
        checkNameEndpoint =
          "/server/tenants/" +
          this.computed_active_tenant_id +
          "/clusters/compute-name-available/" +
          self.configuration.config.clusterName;
      } else if (this.configuration.type == 7) {
        checkNameEndpoint =
          "/server/tenants/" +
          this.computed_active_tenant_id +
          "/clusters/dlcmv2-name-available/" +
          self.configuration.config.clusterName;
      } else {
        checkNameEndpoint =
          "/server/tenants/" +
          this.computed_active_tenant_id +
          "/clusters/cluster-name-available/" +
          self.configuration.config.clusterName;
      }

      this.axios
        .get(checkNameEndpoint, this.get_axiosConfig())
        .then(function (response) {
          if (response.data.free == true) {
            self.sendToCorrectEndpoint();
          }
        })
        .catch(function (error) {
          console.info(error);
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
              text: "Error confirming name availability " + error,
            });
          }
        });
    },
    sendToCorrectEndpoint() {
      if (this.configuration.type == 1) {
        this.submitKubernetesCluster();
      }
      if (this.configuration.type == 2 || this.configuration.type == 6) {
        this.submitVM();
      }
      if (this.configuration.type == 3) {
        this.submitK3sCluster();
      }
      if (this.configuration.type == 5) {
        this.submitCAPICluster();
      }
      if (this.configuration.type == 7) {
        this.submitKubernetesClusterDLCMv2();
      }
      if (this.configuration.type == 8) {
        this.submitYaookCluster();
      }
    },
    initiateCreateEnvFromTemplate(template, projectId, environmentTemplateId) {
      this.configuration = {};
      this.templateProvidersList = [];
      this.availableAccounts = {
        aws: [],
        azure: [],
        google: [],
        onpremise: [],
        iotarm: [],
        openstack: [],
      };
      this.submitting = false;
      this.loaded = false;
      this.loadingAccounts = true;
      this.loading = true;
      this.interval = [];
      this.errorMsg = "";
      this.error = "";

      this.environmentName = template;
      this.projectId = projectId;
      this.getTemplateConfig(environmentTemplateId, template);
    },
    getTemplateConfig(environmentTemplateId, template) {
      let self = this;
      this.axios
        .get(
          "/server/tenants/" +
            this.computed_active_tenant_id +
            "/environment-templates/" +
            environmentTemplateId,
          this.get_axiosConfig()
        )
        .then(function (response) {
          if (template == response.data.name) {
            self.configuration = response.data;
            self.clusterDescription = response.data.description;
            self.getAvailableAccounts();
          } else {
            self.error =
              "There was a problem with getting the template configuration!";
            self.$notify({
              group: "msg",
              type: "error",
              title: "Notification:",
              text: self.error,
            });
          }
        })
        .catch(function (error) {
          self.error = error;
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
              text: "Error getting template configuration " + error,
            });
          }
        });
    },
    formatDate(date) {
      let options = {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
      };
      date = new Date(date);
      date = date.toLocaleString("en-US", options);
      return date;
    },
    getAvailableAccounts() {
      let provider = this.configuration.providers;

      if (provider.toLowerCase().includes("amazon")) {
        this.getProviderAccountsList("aws");
        this.templateProvidersList.push("aws");
      }
      if (provider.toLowerCase().includes("azure")) {
        this.getProviderAccountsList("azure");
        this.templateProvidersList.push("azure");
      }
      if (provider.toLowerCase().includes("google")) {
        this.getProviderAccountsList("google");
        this.templateProvidersList.push("google");
      }
      if (provider.toLowerCase().includes("premise")) {
        this.getProviderAccountsList("onpremise");
        this.templateProvidersList.push("onpremise");
      }
      if (provider.toLowerCase().includes("arm")) {
        this.getProviderAccountsList("iotarm");
        this.templateProvidersList.push("iotarm");
      }
      if (provider.toLowerCase().includes("openstack")) {
        this.getProviderAccountsList("openstack");
        this.templateProvidersList.push("openstack");
      }
    },
    async getProviderAccountsList(provider) {
      let credentials = await this.getCredentials();

      credentials = credentials.filter(
        (credential) =>
          credential.valid == true && credential.provider == provider
      );

      for (let i = 0; i < credentials.length; i++) {
        this.availableAccounts[provider].push(credentials[i]);
      }
      this.loadingAccounts = false;
    },
    customisation() {
      let color = "200, 200, 200,";
      let stylings =
        "border: rgba(" +
        color +
        " 0.30) 1px solid; border-radius: 4px; background: linear-gradient(172deg, rgba(" +
        color +
        " 0.03) 0% , rgba(" +
        color +
        " 0.01) 48%, rgba(255,255,255,0) 100%);";
      return stylings;
    },
    providerImageFilename(provider) {
      if (provider == "google") {
        return "googleCloud_logo_small.png";
      }
      if (provider == "openstack") {
        if (this.computed_theme == "daiteap") {
          return "openstack_logo_small.png";
        }
      }
      if (provider == "alicloud") {
        return "alicloud_logo_small.png";
      }
      if (provider == "aws") {
        return "aws_logo_small.png";
      }
      if (provider == "azure") {
        return "azure_logo_small.png";
      }
      if (provider == "onpremise") {
        return "onpremise.svg";
      }
      if (provider == "iotarm") {
        return "IoTArm_logo_small.svg";
      }
    },
    submitKubernetesClusterDLCMv2() {
      let self = this;
      var request = self.configuration.config;

      request.name = self.configuration.name;
      request.clusterName = this.environmentName;
      request.type = 7;
      request.projectId = this.projectId;

      request = helpers.templateToClusterConfig_dlcmv2(request);
      request.clusterDescription = this.clusterDescription;

      this.axios
        .post(
          "/server/tenants/" +
            this.computed_active_tenant_id +
            "/clusters/dlcmv2-create",
          request,
          this.get_axiosConfig()
        )
        .then(function (response) {
          self.$router.push({
            name: "SubmitKubernetesCluster",
            params: {
              ID: response.data["ID"],
            },
          });
        })
        .catch(function (error) {
          console.info("ERROR", error);
          if (error.response.data.authorized == false) {
            self.exceededResources = error.response.data.exceededResources;
            self.showQuotaExceeded = true;
            self.$bvModal.show("bv-modal-quotaexceeded");
          } else {
            self.errorMsg = error;
            self.showModalShowErrorCreatingCluster = true;
            self.$bvModal.show("bv-modal-modalshowerrorcreatingcluster");
          }
          console.log(error.response);
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
              text: error.response.data.error.message,
            });
          }
        });
    },
    submitKubernetesCluster() {
      let self = this;
      var request = self.configuration.config;

      this.axios
        .post(
          "/server/tenants/" +
            this.computed_active_tenant_id +
            "/clusters/dlcm-create",
          request,
          this.get_axiosConfig()
        )
        .then(function (response) {
          self.$router.push({
            name: "SubmitKubernetesCluster",
            params: {
              ID: response.data["ID"],
              clusterName: response.data["Name"],
            },
          });
        })
        .catch(function (error) {
          if (error.response.data.authorized == false) {
            self.exceededResources = error.response.data.exceededResources;
            self.showQuotaExceeded = true;
            self.$bvModal.show("bv-modal-quotaexceeded");
          } else {
            self.errorMsg = error;
            self.showModalShowErrorCreatingCluster = true;
            self.$bvModal.show("bv-modal-modalshowerrorcreatingcluster");
          }
          console.log(error.status.code);
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
    submitCAPICluster() {
      let self = this;
      var request = self.configuration.config;

      this.axios
        .post("/server/tenants/" + this.computed_active_tenant_id + "/clusters/capi-create", request, this.get_axiosConfig())
        .then(function (response) {
          self.$router.push({
            name: "SubmitCAPICluster",
            params: {
              ID: response.data["ID"],
              clusterName: response.data["Name"],
            },
          });
        })
        .catch(function (error) {
          if (error.response.data.authorized == false) {
            self.exceededResources = error.response.data.exceededResources;
            self.showQuotaExceeded = true;
            self.$bvModal.show("bv-modal-quotaexceeded");
          } else {
            self.errorMsg = error;
            self.showModalShowErrorCreatingCluster = true;
            self.$bvModal.show("bv-modal-modalshowerrorcreatingcluster");
          }
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
    submitK3sCluster() {
      let self = this;
      var request = self.configuration.config;

      this.axios
        .post(
          "/server/tenants/" +
            this.computed_active_tenant_id +
            "/clusters/k3s-create",
          request,
          this.get_axiosConfig()
        )
        .then(function (response) {
          self.$router.push({
            name: "SubmitK3sCluster",
            params: {
              ID: response.data["ID"],
              clusterName: response.data["Name"],
            },
          });
        })
        .catch(function (error) {
          if (error.response.data.authorized == false) {
            self.exceededResources = error.response.data.exceededResources;
            self.showQuotaExceeded = true;
            self.$bvModal.show("bv-modal-quotaexceeded");
          } else {
            self.errorMsg = error;
            self.showModalShowErrorCreatingCluster = true;
            self.$bvModal.show("bv-modal-modalshowerrorcreatingcluster");
          }
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
    submitVM() {
      let self = this;
      var request = self.configuration.config;

      this.axios
        .post(
          "/server/tenants/" +
            this.computed_active_tenant_id +
            "/clusters/compute-create",
          request,
          this.get_axiosConfig()
        )
        .then(function (response) {
          self.$router.push({
            name: "SubmitVMs",
            params: {
              ID: response.data["ID"],
              clusterName: response.data["Name"],
            },
          });
        })
        .catch(function (error) {
          if (error.response.data.authorized == false) {
            self.exceededResources = error.response.data.exceededResources;
            self.showQuotaExceeded = true;
            self.$bvModal.show("bv-modal-quotaexceeded");
          } else {
            self.errorMsg = error;
            self.showModalShowErrorCreatingCluster = true;
            self.$bvModal.show("bv-modal-modalshowerrorcreatingcluster");
          }
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
    submitYaookCluster() {
      let self = this;
      var request = self.configuration.config;

      this.axios
        .post("/server/tenants/" + this.computed_active_tenant_id + "/clusters/yaook-create", request, this.get_axiosConfig())
        .then(function (response) {
          self.$router.push({
            name: "SubmitYaookCluster",
            params: {
              ID: response.data["ID"],
              clusterName: response.data["Name"],
            },
          });
        })
        .catch(function (error) {
          if (error.response.data.authorized == false) {
            self.exceededResources = error.response.data.exceededResources;
            self.showQuotaExceeded = true;
            self.$bvModal.show("bv-modal-quotaexceeded");
          } else {
            self.errorMsg = error;
            self.showModalShowErrorCreatingCluster = true;
            self.$bvModal.show("bv-modal-modalshowerrorcreatingcluster");
          }
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
  },
};
</script>

<style scoped>
.modal-content {
  width: 850px;
}

.scroll {
  max-height: 325px;
  overflow-y: auto;
}

.btn-success {
  margin-right: 20px;
}

.backgroundLogo {
  opacity: 0.5;
}

.cardHeaderLight {
  background-color: #fff;
  color: #1d1e22;
  border-bottom: #eaebed 2px solid;
  border: #d1d1d1 1px solid;
}

.card-body {
  border: #00708c10 1px solid;
}
</style>