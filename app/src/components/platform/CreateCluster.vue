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
        v-if="computed_create_cluster_settings.installation_type == 'manually'"
        class="column is-11 is-offset-0"
      >
        <K3sClusterStepper
          v-if="computed_create_cluster_settings.cluster_type == 'K3S'"
          @installation-type-change="onChangeInstallationType()"
          @template-change="openModalCreateEnvironmentFromTemplate()"
          @set-show-cluster-details="setShowClusterDetails()"
        />
        <KubernetesClusterStepper
          v-else-if="
            computed_create_cluster_settings.cluster_type ==
            'Kubernetes Cluster (DLCM)'
          "
          @installation-type-change="onChangeInstallationType()"
          @template-change="openModalCreateEnvironmentFromTemplate()"
          @set-show-cluster-details="setShowClusterDetails()"
        ></KubernetesClusterStepper>
        <DLCMV2ClusterStepper
          v-else-if="
            computed_create_cluster_settings.cluster_type ==
            'Kubernetes Cluster (DLCM v2)'
          "
          @installation-type-change="onChangeInstallationType()"
          @template-change="openModalCreateEnvironmentFromTemplate()"
          @set-show-cluster-details="setShowClusterDetails()"
        />
        <CAPIStepper
          v-else-if="
            computed_create_cluster_settings.cluster_type ==
            'Kubernetes Cluster (CAPI)'
          "
          @installation-type-change="onChangeInstallationType()"
          @template-change="openModalCreateEnvironmentFromTemplate()"
          @set-show-cluster-details="setShowClusterDetails()"
        />
        <YaookStepper
          v-else-if="
            computed_create_cluster_settings.cluster_type ==
            'Kubernetes Cluster (YaookCAPI)'
          "
          @installation-type-change="onChangeInstallationType()"
          @template-change="openModalCreateEnvironmentFromTemplate()"
          @set-show-cluster-details="setShowClusterDetails()"
        />
      </div>
      <div
        v-else-if="computed_create_cluster_settings.installation_type == 'from template'"
        class="column is-11 is-offset-0"
      >
        <div v-if="showClusterDetails">
          <div class="columns">
            <div>
              <label for="selectProject">Select Project</label>
            </div>
            <select
              class="custom-select d-block w-100"
              v-model="computed_create_cluster_settings.selected_project"
              id="selectProject"
              @change="updateCreateClusterSetting('SelectedProject', $event.target.value)"
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
              v-model="computed_create_cluster_settings.installation_type"
              id="selectType"
              @change="onChangeInstallationType()"
            >
              <option>manually</option>
              <option v-if="templateNamesList.length > 0">from template</option>
            </select>
          </div>
          <div
            v-if="computed_create_cluster_settings.installation_type == 'manually'"
            class="control my-3"
            id="clusterType"
          >
            <div>
              <label>Type</label>
            </div>
            <select
              class="custom-select d-block w-100"
              v-model="computed_create_cluster_settings.cluster_type"
              id="selectType"
              @change="
                updateCreateClusterSetting('ClusterType', $event.target.value);
              "
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
              v-model="computed_create_cluster_settings.selected_template_id"
              id="selectTemplate"
              @change="
                updateCreateClusterSetting('SelectedTemplateID', $event.target.value);
                openModalCreateEnvironmentFromTemplate();
              "
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
          ref="newEnvfromTemplate" :projectId="computed_create_cluster_settings.selected_project"
        ></CreateEnvironmentFromTemplate>
      </div>
    </div>
  </div>
</template>

<script>
import CreateEnvironmentFromTemplate from "./CreateEnvironmentFromTemplate";
import {useVuelidate} from "@vuelidate/core";
import { maxLength, required } from "@vuelidate/validators";
import QuotaExceededModal from "@/components/platform/popup_modals/QuotaExceededModal";
import K3sClusterStepper from "@/components/platform/K3sClusterStepper";
import CAPIStepper from "@/components/platform/CAPIStepper";
import YaookStepper from "@/components/platform/YaookStepper";
import KubernetesClusterStepper from "@/components/platform/KubernetesClusterStepper";
import DLCMV2ClusterStepper from "@/components/platform/DLCMV2ClusterStepper";
import Vue from "vue";

export default {
  name: "CreateCluster",
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
      v$: useVuelidate(),
      templateNamesList: [],
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
    };
  },
  props: {
    projectID: String,
  },
  created() {
    this.$store.commit("updateCreateClusterSettingsShowAdvanced", false);
    this.$store.commit("updateCreateClusterSettingsClusterName", "");
    this.$store.commit("updateCreateClusterSettingsClusterDescription", "");
    this.updateCreateClusterSetting("ClusterType", "Kubernetes Cluster (DLCM v2)");
    this.updateCreateClusterSetting("InstallationType", "manually");
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
          this.updateCreateClusterSetting("ClusterType", "Kubernetes Cluster (YaookCAPI)");
        }
      }

      this.updateCreateClusterSetting("Types", this.kubernetesClusterType);
    }, 100);
    
    let self = this;
    this.$bvModal.show("bv-modal-createenvironmentfromtemplate");
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
                  .get(
                    "/server/tenants/" +
                      this.computed_active_tenant_id +
                      "/clusters/cluster-name-available/" +
                      value,
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
      description: {
        maxLength: maxLength(1024),
      },
      contact: {
        maxLength: maxLength(1024),
      },
    },
  },
  methods: {
    setShowClusterDetails(value) {
      this.showClusterDetails = value;
    },
    arrContains(arr, el) {
      for (var i=0;i<arr.length;i++) {
        if (arr[i] == el) {
          return true;
        }
      }
      return false;
    },
    openModalCreateEnvironmentFromTemplate() {
      let self = this;
      let selectedTemplate = self.templateNamesList.filter(
        (el) => el.id == self.computed_create_cluster_settings.selected_template_id
      )[0];
      this.$refs.newEnvfromTemplate.initiateCreateEnvFromTemplate(
        selectedTemplate.name,
        self.computed_create_cluster_settings.selected_project,
        selectedTemplate.id
      );
    },
    onChangeInstallationType() {
      if (this.computed_create_cluster_settings.installation_type == "from template") {
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
        self.updateCreateClusterSetting("SelectedTemplateID", self.templateNamesList[0].id);
        if (openModal) {
          self.openModalCreateEnvironmentFromTemplate();
        }
      }
      self.updateCreateClusterSetting("Templates", self.templateNamesList);
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
        self.updateCreateClusterSetting("SelectedProject", self.projectID);
      } else {
        self.updateCreateClusterSetting("SelectedProject", self.projectsList[0].ID);
      }

      self.updateCreateClusterSetting("Projects", self.projectsList);
    },
  },
};
</script>