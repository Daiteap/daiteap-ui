<template>
  <div class="card daiteap-content-card">
    <QuotaExceededModal
      v-show="showQuotaExceeded"
      :exceededResources="exceededResources"
    ></QuotaExceededModal>
    <h3 class="d-flex">Create Kubernetes Cluster</h3>
    <hr />

    <div class="columns">
      <div
        v-if="installationType == 'manually'"
        class="column is-11 is-offset-0"
      >
        <K3sClusterStepper v-if="selectedType == 'K3S'" />
        <KubernetesClusterStepper
          v-else-if="selectedType == 'Kubernetes Cluster (DLCM)'"
          >test</KubernetesClusterStepper
        >
        <DLCMV2ClusterStepper
          v-else-if="selectedType == 'Kubernetes Cluster (DLCM v2)'"
        />
        <CAPIStepper v-else-if="selectedType == 'Kubernetes Cluster (CAPI)'" />
        <YaookStepper v-else-if="selectedType == 'Kubernetes Cluster (YaookCAPI)'" />
      </div>
      <div
        v-else-if="installationType == 'from template'"
        class="column is-11 is-offset-0"
      >
        <div v-if="showClusterDetails">
          <div class="columns">
            <div>
              <label for="selectProject">Select Project</label>
            </div>
            <select
              class="custom-select d-block w-100"
              v-model="selectedProject"
              id="selectProject"
            >
              <option
                v-for="item in projectsList"
                :key="item.ID"
                :value="item.ID"
              >
                {{ item.Name }}
              </option>
            </select>
          </div>
          <div v-if="computed_account_settings.enable_templates" class="control my-3" id="clusterType">
            <div>
              <label>Installation type:</label>
            </div>
            <select
              class="custom-select d-block w-100"
              v-model="installationType"
              id="selectType"
              @change="onChangeInstallationType()"
            >
              <option>manually</option>
              <option v-if="templateNamesList.length > 0">from template</option>
            </select>
          </div>
          <div
            v-if="installationType == 'manually'"
            class="control my-3"
            id="clusterType"
          >
            <div>
              <label>Type</label>
            </div>
            <select
              class="custom-select d-block w-100"
              v-model="selectedType"
              id="selectType"
              @change="onTypeChange()"
            >
              <option
                v-for="item in kubernetesClusterType"
                :key="item"
                :value="item"
              >
                {{ item }}
              </option>
            </select>
          </div>
          <div v-else class="control my-3" id="clusterType">
            <div>
              <label>Select Template</label>
            </div>
            <select
              class="custom-select d-block w-100"
              v-model="selectedTemplateId"
              id="selectTemplate"
              @change="openModalCreateEnvironmentFromTemplate()"
            >
              <option
                v-for="item in templateNamesList"
                :key="item.id"
                :value="item.id"
              >
                {{ item.name }}
              </option>
            </select>
          </div>
        </div>

        <CreateEnvironmentFromTemplate
          ref="newEnvfromTemplate" :projectId=selectedProject
        ></CreateEnvironmentFromTemplate>
      </div>
    </div>
  </div>
</template>

<script>
import CreateEnvironmentFromTemplate from "./CreateEnvironmentFromTemplate";
import { validationMixin } from "vuelidate";
import { required, maxLength } from "vuelidate/lib/validators";
import QuotaExceededModal from "@/components/platform/popup_modals/QuotaExceededModal";
import K3sClusterStepper from "@/components/platform/K3sClusterStepper";
import CAPIStepper from "@/components/platform/CAPIStepper";
import YaookStepper from "@/components/platform/YaookStepper";
import KubernetesClusterStepper from "@/components/platform/KubernetesClusterStepper";
import DLCMV2ClusterStepper from "@/components/platform/DLCMV2ClusterStepper";
import Vue from "vue";

export default {
  name: "CreateCluster",
  mixins: [validationMixin],
  components: {
    QuotaExceededModal,
    K3sClusterStepper,
    CAPIStepper,
    DLCMV2ClusterStepper,
    KubernetesClusterStepper,
    CreateEnvironmentFromTemplate,
    YaookStepper,
  },
  data() {
    return {
      templateNamesList: [],
      installationType: "manually",
      showClusterDetails: true,
      form: {
        name: "",
      },
      kubernetesClusterType: [
        "Kubernetes Cluster (DLCM v2)",
      ],
      projectsList: [],
      showQuotaExceeded: false,
      errorMsg: "",
      exceededResources: [],
      selectedTemplateId: "",
      selectedProject: {},
      selectedType: "Kubernetes Cluster (DLCM v2)",
    };
  },
  props: {
    projectID: String,
  },
  created() {
    this.$store.commit("updateCreateClusterSettingsShowAdvanced", false);
    this.$store.commit("updateCreateClusterSettingsClusterName", "");
    this.$store.commit("updateCreateClusterSettingsClusterDescription", "");
  },
  mounted() {
    Vue.prototype.$existingNodesCount = 0;

    setTimeout(() => {
      if (this.computed_account_settings.enable_kubernetes_k3s) {
        if (!this.arrContains(this.kubernetesClusterType, "K3S")) {
          this.kubernetesClusterType.push("K3S");
        }
      }
      if (this.computed_account_settings.enable_kubernetes_dlcm) {
        if (!this.arrContains(this.kubernetesClusterType, "Kubernetes Cluster (DLCM)")) {
          this.kubernetesClusterType.push("Kubernetes Cluster (DLCM)");
        }
      }
      if (this.computed_account_settings.enable_kubernetes_capi) {
        if (!this.arrContains(this.kubernetesClusterType, "Kubernetes Cluster (CAPI)")) {
          this.kubernetesClusterType.push("Kubernetes Cluster (CAPI)");
        }
      }
      if (this.computed_account_settings.enable_kubernetes_yaookcapi) {
        if (!this.arrContains(this.kubernetesClusterType, "Kubernetes Cluster (YaookCAPI)")) {
          this.kubernetesClusterType.push("Kubernetes Cluster (YaookCAPI)");
        }

        if (this.computed_account_settings.advanced_cluster_configuration) {
          this.selectedType = "Kubernetes Cluster (YaookCAPI)";
        }
      }
    }, 100);
    
    let self = this;
    this.$bvModal.show("bv-modal-createenvironmentfromtemplate");
    this.onTypeChange();
    this.getUsersProjectsList();
    this.getTemplatesList(false);

    this.axios
      .get(
        "/server/tenants/" +
          this.computed_active_tenant_id +
          "/cloud-credentials/check-provided-credentials",
        this.get_axiosConfig()
      )
      .then(function (response) {
        if (
          response.data.alicloud_key_provided == false &&
          response.data.aws_key_provided == false &&
          response.data.azure_key_provided == false &&
          response.data.google_key_provided == false &&
          response.data.openstack_key_provided == false
        ) {
          self.$notify({
            group: "msg",
            type: "error",
            title: "Notification:",
            text: "Please provide credentials for at least one cloud provider",
          });
          self.$router.push("/app/platform/ProjectList");
        }
      })
      .catch(function (error) {
        console.log(error);
        self.$notify({
          group: "msg",
          type: "error",
          title: "Notification:",
          text: "Error while getting user information!",
        });
      });
  },
  computed: {},
  validations: {
    form: {
      name: {
        required,
        maxLength: maxLength(1024),
        isNameFree(value) {
          if (value.length > 0) {
            if (this.clusterParams) {
              if (value == this.clusterParams.Name) {
                return true;
              }
            }
            return new Promise((resolve) => {
              setTimeout(() => {
                this.axios
                  .post(
                    "/server/isClusterNameFree",
                    {
                      clusterName: value,
                    },
                    this.get_axiosConfig()
                  )
                  .then(function (response) {
                    if (response.data.free == true) {
                      resolve(true);
                    } else {
                      resolve(false);
                    }
                  })
                  .catch(function (error) {
                    console.log(error);
                    resolve(false);
                  });
              }, 350);
            });
          } else {
            return false;
          }
        },
      },
      description: {
        maxLength: maxLength(1024),
      },
      contact: {
        maxLength: maxLength(1024),
      },
    },
  },
  methods: {
    arrContains(arr, el) {
      for (var i=0;i<arr.length;i++) {
        if (arr[i] == el) {
          return true;
        }
      }
      return false;
    },
    onTypeChange() {
      if (this.selectedType == "Kubernetes Cluster (DLCM)") {
        Vue.prototype.$selectedType = 1;
      } else if (this.selectedType == "Kubernetes Cluster (CAPI)") {
        Vue.prototype.$selectedType = 5;
      } else if (this.selectedType == "K3S") {
        Vue.prototype.$selectedType = 3;
      } else if (this.selectedType == "Kubernetes Cluster (DLCM v2)") {
        Vue.prototype.$selectedType = 7;
      } else if (this.selectedType == "Kubernetes Cluster (YaookCAPI)") {
        Vue.prototype.$selectedType = 8;
      } else {
        Vue.prototype.$selectedType = 6;
      }
    },
    openModalCreateEnvironmentFromTemplate() {
      let self = this;
      let selectedTemplate = self.templateNamesList.filter(
        (el) => el.id == self.selectedTemplateId
      )[0];
      this.$refs.newEnvfromTemplate.initiateCreateEnvFromTemplate(
        selectedTemplate.name,
        self.selectedProject,
        selectedTemplate.id
      );
    },
    onChangeInstallationType() {
      if (this.installationType == "from template") {
        this.getTemplatesList(true);
      }
      if (this.$refs.newEnvfromTemplate) {
        this.$refs.newEnvfromTemplate = undefined;
      }
    },
    async getTemplatesList(openModal) {
      let self = this;
      let templates = await this.getTemplates();

      self.templateNamesList = templates;
      if (self.templateNamesList.length > 0) {
        self.selectedTemplateId = self.templateNamesList[0].id;
        if (openModal) {
          self.openModalCreateEnvironmentFromTemplate();
        }
      }
    },
    async getUsersProjectsList() {
      let self = this;
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

      self.projectsList.sort(function (a, b) {
        return a.CreatedAt - b.CreatedAt;
      });

      let options = {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
      };
      for (let i = 0; i < self.projectsList.length; i++) {
        self.projectsList[i].CreatedAt = self.projectsList[
          i
        ].CreatedAt.toLocaleString("en-US", options);
      }
      self.loading = false;

      if (
        self.projectsList.filter((el) => el.ID == self.projectID).length > 0
      ) {
        self.selectedProject = self.projectID;
      } else {
        self.selectedProject = self.projectsList[0].ID;
      }
    },
  },
};
</script>