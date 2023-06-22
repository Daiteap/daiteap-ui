import axios from "axios";
import {
  AlertPlugin,
  BootstrapVue,
  CollapsePlugin,
  DropdownPlugin,
  IconsPlugin,
} from "bootstrap-vue";
import "bootstrap-vue/dist/bootstrap-vue.css";
import "bootstrap/dist/css/bootstrap.css";
// import {
//   BAlert,
//   BootstrapVueNext,
//   BCollapse,
//   BDropdown,
// } from "bootstrap-vue-next";
// import "bootstrap-vue-next/dist/bootstrap-vue-next.css";
import "core-js";
import "regenerator-runtime/runtime";
import {createApp} from "vue";
import VueAxios from "vue-axios";
import Notifications from "@kyvg/vue3-notification";
import VueSidebarMenu from "vue-sidebar-menu";
import "vue-sidebar-menu/dist/vue-sidebar-menu.css";
import "./app.scss";
import App from "./App.vue";
import {DateFilter, FormatDateFilter} from "./common/date.filter";
import {ErrorFilter} from "./common/error.filter";
import router from "./router";
import Vuex from "vuex";
import VueSlider from "vue-slider-component";
import {createVuetify} from "vuetify";
import Keycloak from "keycloak-js";
import mitt from "mitt";
import helpers from "@/services/helpers.js";


// Vue.use(VueSession, {
//   "persist": true,
// });


const VUEX_INIT_STATE = {
  account_settings: {
    enable_compute: false,
    enable_storage: false,
    enable_service_catalog: false,
    enable_templates: false,
    enable_kubernetes_dlcm: false,
    enable_kubernetes_k3s: false,
    enable_kubernetes_capi: false,
    enable_kubernetes_yaookcapi: false,
    advanced_cluster_configuration: false,
    enable_cluster_resize: false,

    providers_enable_aws: false,
    providers_enable_ali: false,
    providers_enable_azure: false,
    providers_enable_gcp: false,
    providers_enable_onprem: false,
    providers_enable_openstack: false,
    providers_enable_arm: false,
  },
  form: {
    alicloudSelected: false,
    awsSelected: false,
    googleSelected: false,
    openstackSelected: false,
    azureSelected: false,
    onpremiseSelected: false,
    iotarmSelected: false,
  },
  userInfo: {
    profile: {
      role: "",
    },
    image: null,
    username: null,
    news_subscribbed: false,
    id: null,
  },
  tenants: [],
  users: [],
  credentials: [],
  projects: [],
  buckets: [],
  create_cluster_settings: {
    show_advanced: false,
    cluster_name: "",
    cluster_description: "",
    selected_project: "",
    cluster_type: "",
    cluster_type_number: 0,
    installation_type: "",
    selected_template_id: "",
    projects: [],
    types: [],
    templates: [],
  },
  aws_bucket_locations: [{
    name: "us-east-2",
    description: "US East (Ohio)",
  },
  {
    name: "us-west-1",
    description: "US West (N. California)",
  },
  {
    name: "us-west-2",
    description: "US West (Oregon)",
  },
  {
    name: "us-gov-east-1",
    description: "AWS GovCloud (US-East)",
  },
  {
    name: "us-gov-west-1",
    description: "AWS GovCloud (US-West)",
  },
  {
    name: "ca-central-1",
    description: "Canada (Central)",
  },
  {
    name: "sa-east-1",
    description: "South America (São Paulo)",
  },
  {
    name: "eu-central-1",
    description: "Europe (Frankfurt)",
  },
  {
    name: "eu-west-1",
    description: "Europe (Ireland)",
  },
  {
    name: "eu-west-2",
    description: "Europe (London)",
  },
  {
    name: "eu-west-3",
    description: "Europe (Paris)",
  },
  {
    name: "eu-north-1",
    description: "Europe (Stockholm)",
  },
  {
    name: "eu-south-1",
    description: "Europe (Milan)",
  },
  {
    name: "ap-east-1",
    description: "Asia Pacific (Hong Kong)",
  },
  {
    name: "ap-south-1",
    description: "Asia Pacific (Mumbai)",
  },
  {
    name: "ap-northeast-1",
    description: "Asia Pacific (Tokyo)",
  },
  {
    name: "ap-northeast-2",
    description: "Asia Pacific (Seoul)",
  },
  {
    name: "ap-northeast-3",
    description: "Asia Pacific (Osaka)",
  },
  {
    name: "ap-southeast-1",
    description: "Asia Pacific (Singapore)",
  },
  {
    name: "ap-southeast-2",
    description: "Asia Pacific (Sydney)",
  },
  {
    name: "cn-northwest-1",
    description: "China (Ningxia)",
  },
  {
    name: "af-south-1",
    description: "Africa (Cape Town)",
  },
  {
    name: "me-south-1",
    description: "Middle East (Bahrain)",
  },
  ],
  google_bucket_locations: {
    multiRegion: [{
      name: "US",
      description: "US",
    },
    {
      name: "EU",
      description: "EU",
    },
    {
      name: "ASIA",
      description: "Asia",
    },
    ],
    dualRegion: [{
      name: "US-CENTRAL1",
      description: "North America (Iowa)",
      continent: "North America",
    },
    {
      name: "US-EAST1",
      description: "North America (South Carolina)",
      continent: "North America",
    },
    {
      name: "US-EAST4",
      description: "North America (Northern Virginia)",
      continent: "North America",
    },
    {
      name: "US-WEST1",
      description: "North America (Oregon)",
      continent: "North America",
    },
    {
      name: "EUROPE-NORTH1",
      description: "Europe (Finland)",
      continent: "Europe",
    },
    {
      name: "EUROPE-WEST1",
      description: "Europe (Belgium)",
      continent: "Europe",
    },
    {
      name: "EUROPE-WEST4",
      description: "Europe (Netherlands)",
      continent: "Europe",
    },
    {
      name: "ASIA-EAST1",
      description: "Asia (Taiwan)",
      continent: "Asia",
    },
    {
      name: "ASIA-SOUTHEAST1",
      description: "Asia (Singapore)",
      continent: "Asia",
    },
    ],
    region: [{
      name: "NORTHAMERICA-NORTHEAST1",
      description: "North America (Montréal)",
    },
    {
      name: "NORTHAMERICA-NORTHEAST2",
      description: "North America (Toronto)",
    },
    {
      name: "US-CENTRAL1",
      description: "North America (Iowa)",
    },
    {
      name: "US-EAST1",
      description: "North America (South Carolina)",
    },
    {
      name: "US-EAST4",
      description: "North America (Northern Virginia)",
    },
    {
      name: "US-EAST5",
      description: "North America (Columbus)",
    },
    {
      name: "US-WEST1",
      description: "North America (Oregon)",
    },
    {
      name: "US-WEST2",
      description: "North America (Los Angeles)",
    },
    {
      name: "US-WEST3",
      description: "North America (Salt Lake City)",
    },
    {
      name: "US-WEST4",
      description: "North America (Las Vegas)",
    },
    {
      name: "SOUTHAMERICA-EAST1",
      description: "South America (São Paulo)",
    },
    {
      name: "SOUTHAMERICA-WEST1",
      description: "South America (Santiago)",
    },
    {
      name: "EUROPE-CENTRAL2",
      description: "Europe (Warsaw)",
    },
    {
      name: "EUROPE-NORTH1",
      description: "Europe (Finland)",
    },
    {
      name: "EUROPE-SOUTHWEST1",
      description: "Europe (Madrid)",
    },
    {
      name: "EUROPE-WEST1",
      description: "Europe (Belgium)",
    },
    {
      name: "EUROPE-WEST2",
      description: "Europe (London)",
    },
    {
      name: "EUROPE-WEST3",
      description: "Europe (Frankfurt)",
    },
    {
      name: "EUROPE-WEST4",
      description: "Europe (Netherlands)",
    },
    {
      name: "EUROPE-WEST6",
      description: "Europe (Zürich)",
    },
    {
      name: "EUROPE-WEST8",
      description: "Europe (Milan)",
    },
    {
      name: "EUROPE-WEST9",
      description: "Europe (Paris)",
    },
    {
      name: "ASIA-EAST1",
      description: "Asia (Taiwan)",
    },
    {
      name: "ASIA-EAST2",
      description: "Asia (Hong Kong)",
    },
    {
      name: "ASIA-NORTHEAST1",
      description: "Asia (Tokyo)",
    },
    {
      name: "ASIA-NORTHEAST2",
      description: "Asia (Osaka)",
    },
    {
      name: "ASIA-NORTHEAST3",
      description: "Asia (Seoul)",
    },
    {
      name: "ASIA-SOUTH1",
      description: "Asia (Mumbai)",
    },
    {
      name: "ASIA-SOUTH2",
      description: "Asia (Delhi)",
    },
    {
      name: "ASIA-SOUTHEAST1",
      description: "Asia (Singapore)",
    },
    {
      name: "ASIA-SOUTHEAST2",
      description: "Indonesia (Jakarta)",
    },
    {
      name: "AUSTRALIA-SOUTHEAST1",
      description: "Australia (Sydney)",
    },
    {
      name: "AUSTRALIA-SOUTHEAST2",
      description: "Australia (Melbourne)",
    },
    ],
    continents: ["North America", "Europe", "Asia"],
  },
  account: {

  },
  canChangePassword: false,
  activeTenantId: "",
};
const store = new Vuex.Store({
  state: VUEX_INIT_STATE,
  mutations: {
    updateAccountSettings(state, accountSettings) {
      state.account_settings = accountSettings;
    },
    updateAccount(state, account) {
      state.account = account;
    },
    updateUserInfo(state, data) {
      state.userInfo.profile = data.profile;
      state.userInfo.username = data.username;
      state.userInfo.news_subscribbed = data.news_subscribbed;
      state.userInfo.id = data.id;
    },
    canChangePassword(state, data) {
      state.canChangePassword = data;
    },
    updateUserInfoProfile(state, data) {
      state.userInfo.profile = data;
    },
    updateUserProfileImageLocation(state, location) {
      state.userInfo.image = location;
    },
    updateTenants(state, tenants) {
      state.tenants = tenants;
    },
    updateUsers(state, users) {
      state.users = users;
    },
    updateCredentials(state, credentials) {
      state.credentials = credentials;
    },
    updateProjects(state, projects) {
      state.projects = projects;
    },
    updateBuckets(state, buckets) {
      state.buckets = buckets;
    },
    updateActiveTenant(state, tenantId) {
      state.activeTenantId = tenantId;
    },
    updateCreateClusterSettingsShowAdvanced(state, showAdvanced) {
      state.create_cluster_settings.show_advanced = showAdvanced;
    },
    updateCreateClusterSettingsClusterName(state, clusterName) {
      state.create_cluster_settings.cluster_name = clusterName;
    },
    updateCreateClusterSettingsClusterDescription(state, clusterDescription) {
      state.create_cluster_settings.cluster_description = clusterDescription;
    },
    updateCreateClusterSettingsSelectedProject(state, selectedProject) {
      state.create_cluster_settings.selected_project = selectedProject;
    },
    updateCreateClusterSettingsClusterType(state, clusterType) {
      state.create_cluster_settings.cluster_type = clusterType;
      if (clusterType == "Kubernetes Cluster (DLCM)") {
        state.create_cluster_settings.cluster_type_number = 1;
      } else if (clusterType == "Kubernetes Cluster (CAPI)") {
        state.create_cluster_settings.cluster_type_number = 5;
      } else if (clusterType == "K3S") {
        state.create_cluster_settings.cluster_type_number = 3;
      } else if (clusterType == "Kubernetes Cluster (DLCM v2)") {
        state.create_cluster_settings.cluster_type_number = 7;
      } else if (clusterType == "Kubernetes Cluster (YaookCAPI)") {
        state.create_cluster_settings.cluster_type_number = 8;
      } else if (clusterType == "Compute") {
        state.create_cluster_settings.cluster_type_number = 2;
      } else {
        state.create_cluster_settings.cluster_type_number = 6;
      }
    },
    updateCreateClusterSettingsInstallationType(state, installationType) {
      state.create_cluster_settings.installation_type = installationType;
    },
    updateCreateClusterSettingsSelectedTemplateID(state, selectedTemplateID) {
      state.create_cluster_settings.selected_template_id = selectedTemplateID;
    },
    updateCreateClusterSettingsProjects(state, projects) {
      state.create_cluster_settings.projects = projects;
    },
    updateCreateClusterSettingsTypes(state, types) {
      state.create_cluster_settings.types = types;
    },
    updateCreateClusterSettingsTemplates(state, templates) {
      state.create_cluster_settings.templates = templates;
    },
  },
});

let singleUserMode = false;

if (process.env.VUE_APP_SINGLE_USER_MODE == "False") {
  singleUserMode = false;
} else {
  singleUserMode = true;
}

if (singleUserMode) {
  const vuetify = createVuetify();
  const app = createApp(App)
    .component("VueSlider", VueSlider)
    .use(router)
    .use(store)
    .use(vuetify)
    .use(Vuex)
    .use(VueSidebarMenu)
    // .use(BootstrapVueNext)
    .use(BootstrapVue)
    // .use(BCollapse)
    // .use(BDropdown)
    // .use(BAlert)
    .use(BootstrapVue)
    .use(IconsPlugin)
    .use(CollapsePlugin)
    .use(DropdownPlugin)
    .use(AlertPlugin)
    .use(VueAxios, axios)
    .use(Notifications);

  app.config.globalProperties.$keycloak = keycloak;
  app.config.globalProperties.FormatDateFilter = FormatDateFilter;
  app.config.globalProperties.DateFilter = DateFilter;
  app.config.globalProperties.ErrorFilter = ErrorFilter;
  app.config.globalProperties.$finalModel = {};

  app.mixin({
    methods: {
      sleep(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
      },
      resetState() {
        this.$store.commit("updateUserInfo", {
          profile: {
            role: "",
          },
          image: null,
          username: null,
          id: null,
        });
      },
      boolToOnOff(bv) {
        if (bv) {
          return "On";
        } else {
          return "Off";
        }
      },
      get_axiosConfig() {
        let authorization = "";
        if (!this.computed_single_user_mode) {
          authorization = "JWT " + keycloak.token;
        }

        return {
          headers: {
            "Content-Type": "application/json;charset=UTF-8",
            "Authorization": authorization,
            "User-ID": this.computed_userInfo.id,
          },
        };
      },
      handleRequestError(error, message) {
        this.usingToken -= 1;
        console.log(error);
        if (error.response) {
          console.log(error.response.data);
        }
        if (error.response && error.response.status == "403") {
          this.$notify({
            group: "msg",
            type: "error",
            title: "Notification:",
            text: "Access Denied",
          });
        } else {
          this.$notify({
            group: "msg",
            type: "error",
            title: "Notification:",
            text: message,
          });
        }
      },
      changeColumnsVisibility(resourceType, lastIndex) {
        let offset =
          document.getElementById("custom-sidebar-menu").clientWidth +
          100;

        // Show columns
        for (let i = lastIndex; i >= 0; i--) {
          let columns = document.getElementsByName(
            resourceType + "HidePriority" + i,
          );
          if (
            document.getElementById(resourceType + "DataTable") &&
            document.getElementById(resourceType + "DataTable").clientWidth +
              offset <=
            window.innerWidth
          ) {
            for (let j = 0; j < columns.length; j++) {
              columns[j].style.display = "";
            }
          }
        }

        // Hide columns
        for (let i = 0; i <= lastIndex; i++) {
          let columns = document.getElementsByName(
            resourceType + "HidePriority" + i,
          );
          if (
            document.getElementById(resourceType + "DataTable") &&
            document.getElementById(resourceType + "DataTable").clientWidth +
              offset >
            window.innerWidth
          ) {
            for (let j = 0; j < columns.length; j++) {
              columns[j].style.display = "none";
            }
          }
        }
      },
      updateCreateClusterSetting(setting, value) {
        this.$store.commit(
          "updateCreateClusterSettings" + setting, value);
      },
      deleteClusterMain(cluster) {
        let endpoint;
        if (cluster.Type === 5) {
          endpoint =
            "/server/tenants/" +
            this.computed_active_tenant_id +
            "/clusters/" +
            cluster.ID +
            "/capi-delete";
        } else if (cluster.Type === 8) {
          endpoint =
            "/server/tenants/" +
            this.computed_active_tenant_id +
            "/clusters/" +
            cluster.ID +
            "/yaook-delete";
        } else {
          endpoint =
            "/server/tenants/" +
            this.computed_active_tenant_id +
            "/clusters/" +
            cluster.ID +
            "/delete";
        }

        const self = this;
        return this.axios
          .delete(endpoint, this.get_axiosConfig())
          .then(function() {
            self.$notify({
              group: "msg",
              type: "success",
              title: "Notification:",
              text:
                "You have successfully submitted deletion for \"" +
                cluster.Name +
                "\".",
            });

            self.showAlert = true;
            self.alertKey += 1;
          })
          .catch(function(error) {
            console.log(error);
            if (error.response) {
              error = error.response.data.error.message;
            }
            self.$notify({
              group: "msg",
              type: "error",
              title: "Notification:",
              text:
                "Error occured while you tried to submit deletion of \"" +
                cluster.Name +
                "\".",
            });
          });
      },
      getUsers() {
        const self = this;
        return new Promise((resolve) => {
          while (self.updatingToken) {
            self.sleep(200);
          }
          self.usingToken += 1;
          this.axios
            .get(
              "/server/tenants/" + this.computed_active_tenant_id + "/users",
              this.get_axiosConfig(),
            )
            .then(function(response) {
              self.usingToken -= 1;
              self.$store.commit("updateUsers", response.data.users_list);
              resolve(response.data.users_list);
            })
            .catch(function(error) {
              self.handleRequestError(
                error,
                "Error while getting users.");
            });
        });
      },
      getProjects() {
        const self = this;
        return new Promise((resolve) => {
          while (self.updatingToken) {
            self.sleep(200);
          }
          self.usingToken += 1;
          this.axios
            .get(
              "/server/tenants/" + this.computed_active_tenant_id + "/projects",
              this.get_axiosConfig(),
            )
            .then(function(response) {
              self.usingToken -= 1;
              self.$store.commit("updateProjects", response.data);
              resolve(response.data);
            })
            .catch(function(error) {
              self.handleRequestError(
                error,
                "Error while getting projects.");
            });
        });
      },
      getCredentials() {
        const self = this;
        return new Promise((resolve) => {
          while (self.updatingToken) {
            self.sleep(200);
          }
          self.usingToken += 1;
          this.axios
            .get(
              "/server/tenants/" +
                this.computed_active_tenant_id +
                "/cloud-credentials",
              this.get_axiosConfig(),
            )
            .then(function(response) {
              self.usingToken -= 1;
              self.$store.commit("updateCredentials", response.data);
              resolve(response.data);
            })
            .catch(function(error) {
              self.handleRequestError(
                error,
                "Error while getting cloud credentials.");
            });
        });
      },
      getCredentialDetails(credentialId) {
        const self = this;
        return new Promise((resolve) => {
          while (self.updatingToken) {
            self.sleep(200);
          }
          self.usingToken += 1;
          this.axios
            .get(
              "/server/tenants/" +
                this.computed_active_tenant_id +
                "/cloud-credentials/" +
                credentialId,
              this.get_axiosConfig(),
            )
            .then(function(response) {
              self.usingToken -= 1;
              resolve(response.data);
            })
            .catch(function(error) {
              self.handleRequestError(
                error,
                "Error while getting cloud credential details.");
            });
        });
      },
      getAllClusters() {
        const self = this;
        return new Promise((resolve) => {
          while (self.updatingToken) {
            self.sleep(200);
          }
          self.usingToken += 1;
          this.axios
            .get(
              "/server/tenants/" + this.computed_active_tenant_id + "/clusters",
              this.get_axiosConfig(),
            )
            .then(function(response) {
              self.usingToken -= 1;
              resolve(response.data);
            })
            .catch(function(error) {
              self.handleRequestError(
                error,
                "Error while getting clusters.");
            });
        });
      },
      getClusterDetailsMain(clusterID) {
        const self = this;
        return new Promise((resolve) => {
          while (self.updatingToken) {
            self.sleep(200);
          }
          self.usingToken += 1;
          this.axios
            .get(
              "/server/tenants/" +
                this.computed_active_tenant_id +
                "/clusters/" +
                clusterID,
              this.get_axiosConfig(),
            )
            .then(function(response) {
              self.usingToken -= 1;
              resolve(response.data);
            })
            .catch(function(error) {
              self.handleRequestError(
                error,
                "Error while getting cluster details.");
            });
        });
      },
      getTemplates() {
        const self = this;
        return new Promise((resolve) => {
          while (self.updatingToken) {
            self.sleep(200);
          }
          self.usingToken += 1;
          this.axios
            .get(
              "/server/tenants/" +
                this.computed_active_tenant_id +
                "/environment-templates",
              this.get_axiosConfig(),
            )
            .then(function(response) {
              self.usingToken -= 1;
              resolve(response.data);
            })
            .catch(function(error) {
              self.handleRequestError(
                error,
                "Error while getting templates.");
            });
        });
      },
      getBuckets() {
        const self = this;
        return new Promise((resolve) => {
          while (self.updatingToken) {
            self.sleep(200);
          }
          self.usingToken += 1;
          this.axios
            .get(
              "/server/tenants/" + this.computed_active_tenant_id + "/buckets",
              this.get_axiosConfig(),
            )
            .then(function(response) {
              self.usingToken -= 1;
              self.$store.commit("updateBuckets", response.data);
              resolve(response.data);
            })
            .catch(function(error) {
              self.handleRequestError(
                error,
                "Error while getting storage information.");
            });
        });
      },
      getBucketDetails(bucketID) {
        const self = this;
        return new Promise((resolve) => {
          while (self.updatingToken) {
            self.sleep(200);
          }
          self.usingToken += 1;
          this.axios
            .get(
              "/server/tenants/" +
                this.computed_active_tenant_id +
                "/buckets/" +
                bucketID,
              this.get_axiosConfig(),
            )
            .then(function(response) {
              self.usingToken -= 1;
              resolve(response.data.bucket_details[0]);
            })
            .catch(function(error) {
              self.handleRequestError(
                error,
                "Error while getting storage information.");
            });
        });
      },
      getAccountSettings() {
        const self = this;
        while (self.updatingToken) {
          self.sleep(200);
        }
        this.usingToken += 1;
        this.axios
          .get(
            "/server/tenants/" + this.computed_active_tenant_id + "/settings",
            this.get_axiosConfig(),
          )
          .then(function(response) {
            self.usingToken -= 1;
            if (response.status === 200) {
              self.$store.commit("updateAccountSettings", response.data);
              self.$store.commit("updateAccount", response.data.tenant);
              self.$root.$emit("accountSettingsChanged", undefined);
            }
          })
          .catch(function(error) {
            self.handleRequestError(
              error,
              "Error while getting workspace settings!");
          });
      },
      removeComputeNode(nodeID, clusterID) {
        const self = this;
        return this.axios
          .delete(
            "/server/tenants/" +
              this.computed_active_tenant_id +
              "/clusters/" +
              clusterID +
              "/nodes/" +
              nodeID,
            this.get_axiosConfig(),
          )
          .then(function() {
            self.$notify({
              group: "msg",
              type: "success",
              title: "Notification:",
              text: "Node deletion submitted successfully",
            });
            self.getClustersList();
          })
          .catch(function() {
            self.$notify({
              group: "msg",
              type: "error",
              title: "Notification:",
              text: "Error while removing node.",
            });
          });
      },
      getProfilePicture() {
        const self = this;
        while (self.updatingToken) {
          self.sleep(200);
        }
        this.usingToken += 1;
        this.axios
          .get("/server/user/profile/picture", this.get_axiosConfig())
          .then(function(response) {
            self.usingToken -= 1;
            self.$store.commit(
              "updateUserProfileImageLocation",
              response.data.location,
            );
          })
          .catch(function(error) {
            self.handleRequestError(
              error,
              "Error while getting user image!");
          });
      },
      getUserQuota() {
        const self = this;
        while (self.updatingToken) {
          self.sleep(200);
        }
        this.usingToken += 1;
        return this.axios
          .get(
            "/server/tenants/" + this.computed_active_tenant_id + "/quotas",
            this.get_axiosConfig(),
          )
          .then(function(response) {
            self.usingToken -= 1;
            let quota = response.data;

            quota["available_kubernetes_cluster_environments"] =
              (quota["limit_kubernetes_cluster_environments"] -
                quota["used_kubernetes_cluster_environments"]);
            quota["available_vms_environments"] =
              (quota["limit_compute_vms_environments"] -
                quota["used_compute_vms_environments"]);
            quota["available_nodes"] =
              quota["limit_nodes"] - quota["used_nodes"];
            quota["available_services"] =
              quota["limit_services"] - quota["used_services"];

            return quota;
          })
          .catch(function(error) {
            self.handleRequestError(error, "Error while getting quotas.");
          });
      },
      getUserInfo() {
        const self = this;
        while (self.updatingToken) {
          self.sleep(200);
        }
        let profile = {};
        let user = {};
        this.usingToken += 1;
        this.axios
          .get("/server/user/profile", this.get_axiosConfig())
          .then(function(response) {
            profile = response.data;

            self.axios.get("/server/user", self.get_axiosConfig())
              .then(function(response) {
                user = {};
                user.profile = profile;

                user.username = response.data.username;
                user.id = response.data.id;

                user.profile.first_name = response.data.first_name;
                user.profile.last_name = response.data.last_name;
                user.profile.email = response.data.email;

                user.profile = Object.assign(user.profile, response.data);

                self.usingToken -= 1;
                self.$store.commit("updateUserInfo", user);
                self.getAccountSettings();
              })
              .catch(function(error) {
                self.usingToken -= 1;
                console.log(error);
                self.$notify({
                  group: "msg",
                  type: "error",
                  title: "Notification:",
                  text: "Error while getting user information!",
                });
              });
          })
          .catch(function(error) {
            self.handleRequestError(
              error,
              "Error while getting user information!");
          });
      },
      checkCanChangePassword() {
        const self = this;
        while (self.updatingToken) {
          self.sleep(200);
        }
        this.usingToken += 1;
        this.axios
          .get("/server/user/password/can-update", this.get_axiosConfig())
          .then(function(response) {
            self.usingToken -= 1;
            self.$store.commit(
              "canChangePassword",
              response.data.canUpdateUserPassword);
          })
          .catch(function(error) {
            self.handleRequestError(
              error,
              "Error while checking if change password is permitted!");
          });
      },
      getActiveTenants() {
        const self = this;
        while (self.updatingToken) {
          self.sleep(200);
        }
        this.usingToken += 1;
        this.axios
          .get("/server/user/active-tenants", this.get_axiosConfig())
          .then(function(response) {
            self.usingToken -= 1;
            if (response.data.activeTenants.length < 2) {
              self.hasMultipleTenants = false;
            } else {
              self.hasMultipleTenants = true;
            }
            self.$store.commit(
              "updateActiveTenant",
              response.data.selectedTenant);
          })
          .catch(function(error) {
            self.handleRequestError(
              error,
              "Error while getting active tenants!");
          });
      },
      getSpecificUserInfo(tenantId, username) {
        const self = this;
        while (self.updatingToken) {
          self.sleep(200);
        }
        this.usingToken += 1;
        return this.axios
          .get(
            "/server/tenants/" + tenantId + "/users/" + username,
            this.get_axiosConfig(),
          )
          .then(function(response) {
            self.usingToken -= 1;
            return response.data;
          })
          .catch(function(error) {
            self.handleRequestError(
              error,
              "Error while getting specific user info!");
          });
      },
      hasMultipleTenants() {
        return this.hasMultipleTenants;
      },
      registerUser() {
        const self = this;
        while (self.updatingToken) {
          self.sleep(200);
        }
        this.usingToken += 1;
        this.axios
          .get("/server/is-registered", this.get_axiosConfig())
          .then(function(response) {
            self.usingToken -= 1;
            if (!response.data.isRegistered) {
              self.axios
                .post("/server/tenants", {}, self.get_axiosConfig())
                .then(function() {
                  self.getUserInfo();
                  self.checkCanChangePassword();
                  self.getProfilePicture();
                  self.getActiveTenants();
                  window.location.href = "#/app/platform/overview";
                })
                .catch(function(error) {
                  console.log(error);
                  self.$notify({
                    group: "msg",
                    type: "error",
                    title: "Notification:",
                    text: "Error while registering user!",
                  });
                })
                .catch(function(error) {
                  self.registrationOpen = false;
                  console.info(error);
                });
            } else {
              self.getUserInfo();
              self.checkCanChangePassword();
              self.getProfilePicture();
              self.getActiveTenants();
            }
          })
          .catch(function(error) {
            self.handleRequestError(
              error,
              "Error while getting user information!");
          });
      },
      endSession() {
        if (window.intervals) {
          for (let i = 0; i < window.intervals.length; i++) {
            clearInterval(window.intervals[i]);
          }
        }
        const self = this;
        if (keycloak.authenticated) {
          keycloak.logout();
        }
        self.resetState();

        sessionStorage.clear();
        self.$router.push("/app/login");
      },
      deleteUserProfilePicture() {
        const self = this;
        while (self.updatingToken) {
          self.sleep(200);
        }
        this.usingToken += 1;
        this.axios
          .delete(
            "/server/user/profile/picture",
            this.get_axiosConfig(),
          )
          .then(function() {
            self.usingToken -= 1;
            self.getProfilePicture();
          })
          .catch(function(error) {
            self.handleRequestError(
              error,
              "Error while deleting the user image.");
          });
      },
      updateUserProfilePicture(request) {
        const self = this;
        return new Promise((resolve) => {
          while (self.updatingToken) {
            self.sleep(200);
          }
          self.usingToken += 1;
          this.axios
            .put(
              "/server/user/profile/picture",
              request,
              this.get_axiosConfig(),
            )
            .then(function() {
              self.usingToken -= 1;
              self.getProfilePicture();
              resolve(true);
            })
            .catch(function(error) {
              self.handleRequestError(
                error,
                "Error while saving the user image.");
            });
        });
      },
      updateUserInfo(profile, user) {
        const self = this;
        while (self.updatingToken) {
          self.sleep(200);
        }
        this.usingToken += 1;
        this.axios
          .put("/server/user/profile", profile, this.get_axiosConfig())
          .then(function() {
            self.axios
              .put("/server/user", user, self.get_axiosConfig())
              .then(function() {
                self.$notify({
                  group: "msg",
                  type: "success",
                  title: "Notification:",
                  text: "Successfuly updated user information!",
                });
                self.getUserInfo();
              })
              .catch(function(error) {
                console.log(error);
                if (error.response) {
                  console.log(error.response.data);
                }
                self.usingToken -= 1;
                self.$notify({
                  group: "msg",
                  type: "error",
                  title: "Notification:",
                  text: "Error while saving the user information",
                });
              });
          })
          .catch(function(error) {
            self.handleRequestError(
              error,
              "Error while saving the user information.");
          });
      },
      editUserInfo(request) {
        const endpoint =
          "/server/tenants/" +
          this.computed_active_tenant_id +
          "/users/" +
          request.username;

        const self = this;
        while (self.updatingToken) {
          self.sleep(200);
        }
        this.usingToken += 1;
        this.axios
          .put(
            endpoint,
            request,
            this.get_axiosConfig(),
          )
          .then(function() {
            self.usingToken -= 1;
            self.$notify({
              group: "msg",
              type: "success",
              title: "Notification:",
              text: "Successfuly updated user!",
            });

            self.getUserInfo();
          })
          .catch(function(error) {
            self.handleRequestError(error, "Error while updating user.");
          });
      },
      emailUnsubscribe() {
        const self = this;
        while (self.updatingToken) {
          self.sleep(200);
        }
        this.usingToken += 1;
        this.axios
          .put(
            "/server/user/profile",
            {news_subscribbed: false},
            this.get_axiosConfig(),
          )
          .then(function() {
            self.usingToken -= 1;
            self.$notify({
              group: "msg",
              type: "success",
              title: "Notification:",
              text: "Unsubscribe Successful!",
            });
          })
          .catch(function(error) {
            self.handleRequestError(error, "Error while unsubscribing.");
          });
      },
      emailSubscribe() {
        const self = this;
        while (self.updatingToken) {
          self.sleep(200);
        }
        this.usingToken += 1;
        this.axios
          .put(
            "/server/user/profile",
            {news_subscribbed: true},
            this.get_axiosConfig(),
          )
          .then(function() {
            self.usingToken -= 1;
            self.$notify({
              group: "msg",
              type: "success",
              title: "Notification:",
              text: "Successfuly subscribed!",
            });
          })
          .catch(function(error) {
            self.handleRequestError(error, "Error while subscribing.");
          });
      },
    },
  });
  app.mixin({
    computed: {
      computed_account_settings() {
        if (!this.$store) {
          return null;
        }
        return this.$store.state.account_settings;
      },
      computed_active_tenant_id() {
        if (!this.$store) {
          return null;
        }
        return this.$store.state.activeTenantId;
      },
      computed_account() {
        if (!this.$store) {
          return null;
        }
        return this.$store.state.account;
      },
      computed_userInfo() {
        if (!this.$store) {
          return null;
        }
        return this.$store.state.userInfo;
      },
      computed_isAdmin() {
        if (!this.$store) {
          return false;
        }
        return (
          this.$store.state.userInfo.profile.role == helpers.USER_ROLES.ADMIN
        );
      },
      computed_isRegularUser() {
        if (!this.$store) {
          return false;
        }
        return (
          this.$store.state.userInfo.profile.role ==
          helpers.USER_ROLES.REGULAR_USER
        );
      },
      computed_isAccountOwner() {
        if (!this.$store) {
          return false;
        }
        return (
          this.$store.state.userInfo.profile.role ==
          helpers.USER_ROLES.ACCOUNT_OWNER
        );
      },
      computed_tenants() {
        if (!this.$store) {
          return null;
        }
        return this.$store.state.tenants;
      },
      computed_users() {
        if (!this.$store) {
          return null;
        }
        return this.$store.state.users;
      },
      computed_credentials() {
        if (!this.$store) {
          return null;
        }
        return this.$store.state.credentials;
      },
      computed_projects() {
        if (!this.$store) {
          return null;
        }
        return this.$store.state.projects;
      },
      computed_buckets() {
        if (!this.$store) {
          return null;
        }
        return this.$store.state.buckets;
      },
      computed_create_cluster_settings() {
        if (!this.$store) {
          return null;
        }
        return this.$store.state.create_cluster_settings;
      },
      computed_aws_bucket_locations() {
        if (!this.$store) {
          return null;
        }
        return this.$store.state.aws_bucket_locations;
      },
      computed_google_bucket_locations() {
        if (!this.$store) {
          return null;
        }
        return this.$store.state.google_bucket_locations;
      },
      computed_theme() {
        return process.env.VUE_APP_THEME;
      },
      computed_single_user_mode() {
        if (process.env.VUE_APP_SINGLE_USER_MODE === "False") {
          return false;
        } else {
          return true;
        }
      },
    },
  });

  app.mount("#app");
} else {
  const keycloak = new Keycloak("./keycloak.json");

  keycloak
    .init({
      onLoad: "login-required",
      enableLogging: true,
    })
    .then((auth) => {
      if (!auth) {
        window.location.reload();
      } else {
        console.log("Authenticated");

        const vuetify = createVuetify();
        const emitter = mitt();
        const app = createApp(App)
          .component("VueSlider", VueSlider)
          .use(router)
          .use(store)
          .use(vuetify)
          .use(Vuex)
          .use(VueSidebarMenu)
          // .use(BootstrapVueNext)
          .use(BootstrapVue)
          // .use(BCollapse)
          // .use(BDropdown)
          // .use(BAlert)
          .use(BootstrapVue)
          .use(IconsPlugin)
          .use(CollapsePlugin)
          .use(DropdownPlugin)
          .use(AlertPlugin)
          .use(VueAxios, axios)
          .use(Notifications);

        app.config.globalProperties.emitter = emitter;
        app.config.globalProperties.$keycloak = keycloak;
        app.config.globalProperties.FormatDateFilter = FormatDateFilter;
        app.config.globalProperties.DateFilter = DateFilter;
        app.config.globalProperties.ErrorFilter = ErrorFilter;
        app.config.globalProperties.$finalModel = {};

        app.mixin({
          methods: {
            sleep(ms) {
              return new Promise((resolve) => setTimeout(resolve, ms));
            },
            resetState() {
              this.$store.commit("updateUserInfo", {
                profile: {
                  role: "",
                },
                image: null,
                username: null,
                id: null,
              });
            },
            boolToOnOff(bv) {
              if (bv) {
                return "On";
              } else {
                return "Off";
              }
            },
            get_axiosConfig() {
              let authorization = "";
              if (!this.computed_single_user_mode) {
                authorization = "JWT " + keycloak.token;
              }

              return {
                headers: {
                  "Content-Type": "application/json;charset=UTF-8",
                  "Authorization": authorization,
                  "User-ID": this.computed_userInfo.id,
                },
              };
            },
            handleRequestError(error, message) {
              this.usingToken -= 1;
              console.log(error);
              if (error.response) {
                console.log(error.response.data);
              }
              if (error.response && error.response.status == "403") {
                this.$notify({
                  group: "msg",
                  type: "error",
                  title: "Notification:",
                  text: "Access Denied",
                });
              } else {
                this.$notify({
                  group: "msg",
                  type: "error",
                  title: "Notification:",
                  text: message,
                });
              }
            },
            changeColumnsVisibility(resourceType, lastIndex) {
              const offset =
                document.getElementById("custom-sidebar-menu").clientWidth +
                100;

              // Show columns
              for (let i = lastIndex; i >= 0; i--) {
                let columns = document.getElementsByName(
                  resourceType + "HidePriority" + i,
                );
                if (
                  document.getElementById(resourceType + "DataTable") &&
                  document.getElementById(resourceType + "DataTable")
                    .clientWidth + offset <=
                  window.innerWidth
                ) {
                  for (let j = 0; j < columns.length; j++) {
                    columns[j].style.display = "";
                  }
                }
              }

              // Hide columns
              for (let i = 0; i <= lastIndex; i++) {
                let columns = document.getElementsByName(
                  resourceType + "HidePriority" + i,
                );
                if (
                  document.getElementById(resourceType + "DataTable") &&
                  document.getElementById(resourceType + "DataTable")
                    .clientWidth + offset >
                  window.innerWidth
                ) {
                  for (let j = 0; j < columns.length; j++) {
                    columns[j].style.display = "none";
                  }
                }
              }
            },
            updateCreateClusterSetting(setting, value) {
              this.$store.commit(
                "updateCreateClusterSettings" + setting, value);
            },
            deleteClusterMain(cluster) {
              let endpoint;
              if (cluster.Type === 5) {
                endpoint =
                  "/server/tenants/" +
                  this.computed_active_tenant_id +
                  "/clusters/" +
                  cluster.ID +
                  "/capi-delete";
              } else if (cluster.Type === 8) {
                endpoint =
                  "/server/tenants/" +
                  this.computed_active_tenant_id +
                  "/clusters/" +
                  cluster.ID +
                  "/yaook-delete";
              } else {
                endpoint =
                  "/server/tenants/" +
                  this.computed_active_tenant_id +
                  "/clusters/" +
                  cluster.ID +
                  "/delete";
              }

              const self = this;
              return this.axios
                .delete(endpoint, this.get_axiosConfig())
                .then(function() {
                  self.$notify({
                    group: "msg",
                    type: "success",
                    title: "Notification:",
                    text:
                      "You have successfully submitted deletion for \"" +
                      cluster.Name +
                      "\".",
                  });

                  self.showAlert = true;
                  self.alertKey += 1;
                })
                .catch(function(error) {
                  console.log(error);
                  if (error.response) {
                    error = error.response.data.error.message;
                  }
                  self.$notify({
                    group: "msg",
                    type: "error",
                    title: "Notification:",
                    text:
                      "Error occured while you tried to submit deletion of \"" +
                      cluster.Name +
                      "\".",
                  });
                });
            },
            getUsers() {
              const self = this;
              return new Promise((resolve) => {
                while (self.updatingToken) {
                  self.sleep(200);
                }
                self.usingToken += 1;
                this.axios
                  .get(
                    "/server/tenants/" +
                    this.computed_active_tenant_id +
                    "/users",
                    this.get_axiosConfig(),
                  )
                  .then(function(response) {
                    self.usingToken -= 1;
                    self.$store.commit("updateUsers", response.data.users_list);
                    resolve(response.data.users_list);
                  })
                  .catch(function(error) {
                    self.handleRequestError(
                      error,
                      "Error while getting users.");
                  });
              });
            },
            getProjects() {
              const self = this;
              return new Promise((resolve) => {
                while (self.updatingToken) {
                  self.sleep(200);
                }
                self.usingToken += 1;
                this.axios
                  .get(
                    "/server/tenants/" +
                    this.computed_active_tenant_id +
                    "/projects",
                    this.get_axiosConfig(),
                  )
                  .then(function(response) {
                    self.usingToken -= 1;
                    self.$store.commit("updateProjects", response.data);
                    resolve(response.data);
                  })
                  .catch(function(error) {
                    self.handleRequestError(
                      error,
                      "Error while getting projects.");
                  });
              });
            },
            getCredentials() {
              const self = this;
              return new Promise((resolve) => {
                while (self.updatingToken) {
                  self.sleep(200);
                }
                self.usingToken += 1;
                this.axios
                  .get(
                    "/server/tenants/" +
                      this.computed_active_tenant_id +
                      "/cloud-credentials",
                    this.get_axiosConfig(),
                  )
                  .then(function(response) {
                    self.usingToken -= 1;
                    self.$store.commit("updateCredentials", response.data);
                    resolve(response.data);
                  })
                  .catch(function(error) {
                    self.handleRequestError(
                      error,
                      "Error while getting cloud credentials.");
                  });
              });
            },
            getCredentialDetails(credentialId) {
              const self = this;
              return new Promise((resolve) => {
                while (self.updatingToken) {
                  self.sleep(200);
                }
                self.usingToken += 1;
                this.axios
                  .get(
                    "/server/tenants/" +
                      this.computed_active_tenant_id +
                      "/cloud-credentials/" +
                      credentialId,
                    this.get_axiosConfig(),
                  )
                  .then(function(response) {
                    self.usingToken -= 1;
                    resolve(response.data);
                  })
                  .catch(function(error) {
                    self.handleRequestError(
                      error,
                      "Error while getting cloud credential details.");
                  });
              });
            },
            getAllClusters() {
              const self = this;
              return new Promise((resolve) => {
                while (self.updatingToken) {
                  self.sleep(200);
                }
                self.usingToken += 1;
                this.axios
                  .get(
                    "/server/tenants/" +
                    this.computed_active_tenant_id + "/clusters",
                    this.get_axiosConfig(),
                  )
                  .then(function(response) {
                    self.usingToken -= 1;
                    resolve(response.data);
                  })
                  .catch(function(error) {
                    self.handleRequestError(
                      error,
                      "Error while getting clusters.");
                  });
              });
            },
            getClusterDetailsMain(clusterID) {
              const self = this;
              return new Promise((resolve) => {
                while (self.updatingToken) {
                  self.sleep(200);
                }
                self.usingToken += 1;
                this.axios
                  .get(
                    "/server/tenants/" +
                      this.computed_active_tenant_id +
                      "/clusters/" +
                      clusterID,
                    this.get_axiosConfig(),
                  )
                  .then(function(response) {
                    self.usingToken -= 1;
                    resolve(response.data);
                  })
                  .catch(function(error) {
                    self.handleRequestError(
                      error,
                      "Error while getting cluster details.");
                  });
              });
            },
            getTemplates() {
              const self = this;
              return new Promise((resolve) => {
                while (self.updatingToken) {
                  self.sleep(200);
                }
                self.usingToken += 1;
                this.axios
                  .get(
                    "/server/tenants/" +
                      this.computed_active_tenant_id +
                      "/environment-templates",
                    this.get_axiosConfig(),
                  )
                  .then(function(response) {
                    self.usingToken -= 1;
                    resolve(response.data);
                  })
                  .catch(function(error) {
                    self.handleRequestError(
                      error,
                      "Error while getting templates.");
                  });
              });
            },
            getBuckets() {
              const self = this;
              return new Promise((resolve) => {
                while (self.updatingToken) {
                  self.sleep(200);
                }
                self.usingToken += 1;
                this.axios
                  .get(
                    "/server/tenants/" +
                    this.computed_active_tenant_id +
                    "/buckets",
                    this.get_axiosConfig(),
                  )
                  .then(function(response) {
                    self.usingToken -= 1;
                    self.$store.commit("updateBuckets", response.data);
                    resolve(response.data);
                  })
                  .catch(function(error) {
                    self.handleRequestError(
                      error,
                      "Error while getting storage information.");
                  });
              });
            },
            getBucketDetails(bucketID) {
              const self = this;
              return new Promise((resolve) => {
                while (self.updatingToken) {
                  self.sleep(200);
                }
                self.usingToken += 1;
                this.axios
                  .get(
                    "/server/tenants/" +
                      this.computed_active_tenant_id +
                      "/buckets/" +
                      bucketID,
                    this.get_axiosConfig(),
                  )
                  .then(function(response) {
                    self.usingToken -= 1;
                    resolve(response.data.bucket_details[0]);
                  })
                  .catch(function(error) {
                    self.handleRequestError(
                      error,
                      "Error while getting storage information.");
                  });
              });
            },
            getAccountSettings() {
              const self = this;
              while (self.updatingToken) {
                self.sleep(200);
              }
              this.usingToken += 1;
              this.axios
                .get(
                  "/server/tenants/" +
                  this.computed_active_tenant_id +
                  "/settings",
                  this.get_axiosConfig(),
                )
                .then(function(response) {
                  self.usingToken -= 1;
                  if (response.status === 200) {
                    self.$store.commit("updateAccountSettings", response.data);
                    self.$store.commit("updateAccount", response.data.tenant);
                    self.$root.$emit("accountSettingsChanged", undefined);
                  }
                })
                .catch(function(error) {
                  self.handleRequestError(
                    error,
                    "Error while getting workspace settings!");
                });
            },
            removeComputeNode(nodeID, clusterID) {
              const self = this;
              return this.axios
                .delete(
                  "/server/tenants/" +
                    this.computed_active_tenant_id +
                    "/clusters/" +
                    clusterID +
                    "/nodes/" +
                    nodeID,
                  this.get_axiosConfig(),
                )
                .then(function() {
                  self.$notify({
                    group: "msg",
                    type: "success",
                    title: "Notification:",
                    text: "Node deletion submitted successfully",
                  });
                  self.getClustersList();
                })
                .catch(function() {
                  self.$notify({
                    group: "msg",
                    type: "error",
                    title: "Notification:",
                    text: "Error while removing node.",
                  });
                });
            },
            getProfilePicture() {
              const self = this;
              while (self.updatingToken) {
                self.sleep(200);
              }
              this.usingToken += 1;
              this.axios
                .get("/server/user/profile/picture", this.get_axiosConfig())
                .then(function(response) {
                  self.usingToken -= 1;
                  self.$store.commit(
                    "updateUserProfileImageLocation",
                    response.data.location,
                  );
                })
                .catch(function(error) {
                  self.handleRequestError(
                    error,
                    "Error while getting user image!");
                });
            },
            getUserQuota() {
              const self = this;
              while (self.updatingToken) {
                self.sleep(200);
              }
              this.usingToken += 1;
              return this.axios
                .get(
                  "/server/tenants/" +
                  this.computed_active_tenant_id +
                  "/quotas",
                  this.get_axiosConfig(),
                )
                .then(function(response) {
                  self.usingToken -= 1;
                  let quota = response.data;

                  quota["available_kubernetes_cluster_environments"] =
                    (quota["limit_kubernetes_cluster_environments"] -
                      quota["used_kubernetes_cluster_environments"]);
                  quota["available_vms_environments"] =
                    (quota["limit_compute_vms_environments"] -
                      quota["used_compute_vms_environments"]);
                  quota["available_nodes"] =
                    quota["limit_nodes"] - quota["used_nodes"];
                  quota["available_services"] =
                    quota["limit_services"] - quota["used_services"];

                  return quota;
                })
                .catch(function(error) {
                  self.handleRequestError(error, "Error while getting quotas.");
                });
            },
            getUserInfo() {
              const self = this;
              while (self.updatingToken) {
                self.sleep(200);
              }
              let profile = {};
              let user = {};
              this.usingToken += 1;
              this.axios
                .get("/server/user/profile", this.get_axiosConfig())
                .then(function(response) {
                  profile = response.data;

                  self.axios.get("/server/user", self.get_axiosConfig())
                    .then(function(response) {
                      user = {};
                      user.profile = profile;

                      user.username = response.data.username;
                      user.id = response.data.id;

                      user.profile.first_name = response.data.first_name;
                      user.profile.last_name = response.data.last_name;
                      user.profile.email = response.data.email;

                      user.profile = Object.assign(user.profile, response.data);

                      self.usingToken -= 1;
                      self.$store.commit("updateUserInfo", user);
                      self.getAccountSettings();
                    })
                    .catch(function(error) {
                      self.usingToken -= 1;
                      console.log(error);
                      self.$notify({
                        group: "msg",
                        type: "error",
                        title: "Notification:",
                        text: "Error while getting user information!",
                      });
                    });
                })
                .catch(function(error) {
                  self.handleRequestError(
                    error,
                    "Error while getting user information!");
                });
            },
            checkCanChangePassword() {
              const self = this;
              while (self.updatingToken) {
                self.sleep(200);
              }
              this.usingToken += 1;
              this.axios
                .get("/server/user/password/can-update", this.get_axiosConfig())
                .then(function(response) {
                  self.usingToken -= 1;
                  self.$store.commit(
                    "canChangePassword",
                    response.data.canUpdateUserPassword);
                })
                .catch(function(error) {
                  self.handleRequestError(
                    error,
                    "Error while checking if change password is permitted!");
                });
            },
            getActiveTenants() {
              const self = this;
              while (self.updatingToken) {
                self.sleep(200);
              }
              this.usingToken += 1;
              this.axios
                .get("/server/user/active-tenants", this.get_axiosConfig())
                .then(function(response) {
                  self.usingToken -= 1;
                  if (response.data.activeTenants.length < 2) {
                    self.hasMultipleTenants = false;
                  } else {
                    self.hasMultipleTenants = true;
                  }
                  self.$store.commit(
                    "updateActiveTenant",
                    response.data.selectedTenant);
                })
                .catch(function(error) {
                  self.handleRequestError(
                    error,
                    "Error while getting active tenants!");
                });
            },
            getSpecificUserInfo(tenantId, username) {
              const self = this;
              while (self.updatingToken) {
                self.sleep(200);
              }
              this.usingToken += 1;
              return this.axios
                .get(
                  "/server/tenants/" + tenantId + "/users/" + username,
                  this.get_axiosConfig(),
                )
                .then(function(response) {
                  self.usingToken -= 1;
                  return response.data;
                })
                .catch(function(error) {
                  self.handleRequestError(
                    error,
                    "Error while getting specific user info!");
                });
            },
            hasMultipleTenants() {
              return this.hasMultipleTenants;
            },
            registerUser() {
              const self = this;
              while (self.updatingToken) {
                self.sleep(200);
              }
              this.usingToken += 1;
              this.axios
                .get("/server/is-registered", this.get_axiosConfig())
                .then(function(response) {
                  self.usingToken -= 1;
                  if (!response.data.isRegistered) {
                    self.axios
                      .post("/server/tenants", {}, self.get_axiosConfig())
                      .then(function() {
                        self.getUserInfo();
                        self.checkCanChangePassword();
                        self.getProfilePicture();
                        self.getActiveTenants();
                        window.location.href = "#/app/platform/overview";
                      })
                      .catch(function(error) {
                        console.log(error);
                        self.$notify({
                          group: "msg",
                          type: "error",
                          title: "Notification:",
                          text: "Error while registering user!",
                        });
                      })
                      .catch(function(error) {
                        self.registrationOpen = false;
                        console.info(error);
                      });
                  } else {
                    self.getUserInfo();
                    self.checkCanChangePassword();
                    self.getProfilePicture();
                    self.getActiveTenants();
                  }
                })
                .catch(function(error) {
                  self.handleRequestError(
                    error,
                    "Error while getting user information!");
                });
            },
            endSession() {
              if (window.intervals) {
                for (let i = 0; i < window.intervals.length; i++) {
                  clearInterval(window.intervals[i]);
                }
              }
              const self = this;
              if (keycloak.authenticated) {
                keycloak.logout();
              }
              self.resetState();

              sessionStorage.clear();
              self.$router.push("/app/login");
            },
            deleteUserProfilePicture() {
              const self = this;
              while (self.updatingToken) {
                self.sleep(200);
              }
              this.usingToken += 1;
              this.axios
                .delete(
                  "/server/user/profile/picture",
                  this.get_axiosConfig(),
                )
                .then(function() {
                  self.usingToken -= 1;
                  self.getProfilePicture();
                })
                .catch(function(error) {
                  self.handleRequestError(
                    error,
                    "Error while deleting the user image.");
                });
            },
            updateUserProfilePicture(request) {
              const self = this;
              return new Promise((resolve) => {
                while (self.updatingToken) {
                  self.sleep(200);
                }
                self.usingToken += 1;
                this.axios
                  .put(
                    "/server/user/profile/picture",
                    request,
                    this.get_axiosConfig(),
                  )
                  .then(function() {
                    self.usingToken -= 1;
                    self.getProfilePicture();
                    resolve(true);
                  })
                  .catch(function(error) {
                    self.handleRequestError(
                      error,
                      "Error while saving the user image.");
                  });
              });
            },
            updateUserInfo(profile, user) {
              const self = this;
              while (self.updatingToken) {
                self.sleep(200);
              }
              this.usingToken += 1;
              this.axios
                .put("/server/user/profile", profile, this.get_axiosConfig())
                .then(function() {
                  self.axios
                    .put("/server/user", user, self.get_axiosConfig())
                    .then(function() {
                      self.$notify({
                        group: "msg",
                        type: "success",
                        title: "Notification:",
                        text: "Successfuly updated user information!",
                      });
                      self.getUserInfo();
                    })
                    .catch(function(error) {
                      console.log(error);
                      if (error.response) {
                        console.log(error.response.data);
                      }
                      self.usingToken -= 1;
                      self.$notify({
                        group: "msg",
                        type: "error",
                        title: "Notification:",
                        text: "Error while saving the user information",
                      });
                    });
                })
                .catch(function(error) {
                  self.handleRequestError(
                    error,
                    "Error while saving the user information.");
                });
            },
            editUserInfo(request) {
              const endpoint =
                "/server/tenants/" +
                this.computed_active_tenant_id +
                "/users/" +
                request.username;

              const self = this;
              while (self.updatingToken) {
                self.sleep(200);
              }
              this.usingToken += 1;
              this.axios
                .put(
                  endpoint,
                  request,
                  this.get_axiosConfig(),
                )
                .then(function() {
                  self.usingToken -= 1;
                  self.$notify({
                    group: "msg",
                    type: "success",
                    title: "Notification:",
                    text: "Successfuly updated user!",
                  });

                  self.getUserInfo();
                })
                .catch(function(error) {
                  self.handleRequestError(error, "Error while updating user.");
                });
            },
            emailUnsubscribe() {
              const self = this;
              while (self.updatingToken) {
                self.sleep(200);
              }
              this.usingToken += 1;
              this.axios
                .put(
                  "/server/user/profile",
                  {news_subscribbed: false},
                  this.get_axiosConfig(),
                )
                .then(function() {
                  self.usingToken -= 1;
                  self.$notify({
                    group: "msg",
                    type: "success",
                    title: "Notification:",
                    text: "Unsubscribe Successful!",
                  });
                })
                .catch(function(error) {
                  self.handleRequestError(error, "Error while unsubscribing.");
                });
            },
            emailSubscribe() {
              const self = this;
              while (self.updatingToken) {
                self.sleep(200);
              }
              this.usingToken += 1;
              this.axios
                .put(
                  "/server/user/profile",
                  {news_subscribbed: true},
                  this.get_axiosConfig(),
                )
                .then(function() {
                  self.usingToken -= 1;
                  self.$notify({
                    group: "msg",
                    type: "success",
                    title: "Notification:",
                    text: "Successfuly subscribed!",
                  });
                })
                .catch(function(error) {
                  self.handleRequestError(error, "Error while subscribing.");
                });
            },
          },
        });
        app.mixin({
          computed: {
            computed_account_settings() {
              if (!this.$store) {
                return null;
              }
              return this.$store.state.account_settings;
            },
            computed_active_tenant_id() {
              if (!this.$store) {
                return null;
              }
              return this.$store.state.activeTenantId;
            },
            computed_account() {
              if (!this.$store) {
                return null;
              }
              return this.$store.state.account;
            },
            computed_userInfo() {
              if (!this.$store) {
                return null;
              }
              return this.$store.state.userInfo;
            },
            computed_isAdmin() {
              if (!this.$store) {
                return false;
              }
              return (
                (this.$store.state.userInfo.profile.role ==
                  helpers.USER_ROLES.ADMIN)
              );
            },
            computed_isRegularUser() {
              if (!this.$store) {
                return false;
              }
              return (
                this.$store.state.userInfo.profile.role ==
                helpers.USER_ROLES.REGULAR_USER
              );
            },
            computed_isAccountOwner() {
              if (!this.$store) {
                return false;
              }
              return (
                this.$store.state.userInfo.profile.role ==
                helpers.USER_ROLES.ACCOUNT_OWNER
              );
            },
            computed_tenants() {
              if (!this.$store) {
                return null;
              }
              return this.$store.state.tenants;
            },
            computed_users() {
              if (!this.$store) {
                return null;
              }
              return this.$store.state.users;
            },
            computed_credentials() {
              if (!this.$store) {
                return null;
              }
              return this.$store.state.credentials;
            },
            computed_projects() {
              if (!this.$store) {
                return null;
              }
              return this.$store.state.projects;
            },
            computed_buckets() {
              if (!this.$store) {
                return null;
              }
              return this.$store.state.buckets;
            },
            computed_create_cluster_settings() {
              if (!this.$store) {
                return null;
              }
              return this.$store.state.create_cluster_settings;
            },
            computed_aws_bucket_locations() {
              if (!this.$store) {
                return null;
              }
              return this.$store.state.aws_bucket_locations;
            },
            computed_google_bucket_locations() {
              if (!this.$store) {
                return null;
              }
              return this.$store.state.google_bucket_locations;
            },
            computed_theme() {
              return process.env.VUE_APP_THEME;
            },
            computed_single_user_mode() {
              if (process.env.VUE_APP_SINGLE_USER_MODE === "False") {
                return false;
              } else {
                return true;
              }
            },
          },
        });

        app.mount("#app");
      }

      // Token Refresh
      setInterval(() => {
        keycloak
          .updateToken(70)
          .then(() => { })
          .catch(() => {
            console.log("Failed to refresh token");
          });
      }, 6000);
    })
    .catch(() => {
      console.log("Authenticated Failed");
    });
}
