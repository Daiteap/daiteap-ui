import axios from "axios";
import {
  AlertPlugin,
  BootstrapVue,
  CollapsePlugin,
  IconsPlugin,
} from "bootstrap-vue";
import "bootstrap-vue/dist/bootstrap-vue.css";
import "bootstrap/dist/css/bootstrap.css";
import "core-js";
import "regenerator-runtime/runtime";
import Vue from "vue";
import VueAxios from "vue-axios";
import Notifications from "vue-notification";
import VueSession from "vue-session";
import VueSidebarMenu from "vue-sidebar-menu";
import "vue-sidebar-menu/dist/vue-sidebar-menu.css";
import "./app.scss";
import App from "./App.vue";
import DateFilter from "./common/date.filter";
import ErrorFilter from "./common/error.filter";
import router from "./router";
import Vuex from "vuex";
import VueSlider from "vue-slider-component";
import moment from "moment";
import vuetify from "./vuetify";
import Keycloak from "keycloak-js";
import {ToggleButton} from "vue-js-toggle-button";

Vue.component("VueSlider", VueSlider);
Vue.component("ToggleButton", ToggleButton);

Vue.use(Vuex);
Vue.use(VueSidebarMenu);
Vue.use(BootstrapVue);
Vue.use(IconsPlugin);
Vue.use(CollapsePlugin);
Vue.use(AlertPlugin);
Vue.use(VueAxios, axios);
Vue.use(VueSession, {
  "persist": true,
});
Vue.use(Notifications);

Vue.prototype.$finalModel = {};

Vue.config.productionTip = false;
Vue.filter("date", DateFilter);
Vue.filter("error", ErrorFilter);

Vue.filter("formatDate", function(value) {
  if (value) {
    const date = moment(String(value)).format("DD MMM YYYY, HH:mm");
    if (date.startsWith("0")) {
      const newDate = date.substring(1);
      return newDate;
    }
    return date;
  }
});

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

Vue.config.productionTip = false;

let singleUserMode = false;

if (process.env.VUE_APP_SINGLE_USER_MODE == "False") {
  singleUserMode = false;
} else {
  singleUserMode = true;
}

if (singleUserMode) {
  new Vue({
    router,
    store,
    vuetify,
    render: (h) => h(App),
  }).$mount("#app");
} else {
  Vue.$keycloak = new Keycloak("./keycloak.json");

  Vue.$keycloak
    .init({onLoad: "login-required"})
    .then((auth) => {
      if (!auth) {
        window.location.reload();
      } else {
        console.log("Authenticated");

        new Vue({
          router,
          store,
          vuetify,
          el: "#app",
          render: (h) => h(App, {props: {keycloak: Vue.$keycloak}}),
        });
      }

      // Token Refresh
      setInterval(() => {
        Vue.$keycloak
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
