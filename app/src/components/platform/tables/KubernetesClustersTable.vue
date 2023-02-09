<template>
  <div class="table-responsive">
    <WarningAlert v-if="showAlert" color="warning" :key="alertKey">
      <i class="fas fa-exclamation-circle" style="font-size: 1.5rem; color: red;"></i>
      Deleting resources can take some time according to the underlying infrastructure provider.
    </WarningAlert>

    <QuotaExceededModal
      v-show="showQuotaExceeded"
      :exceededResources="exceededResources"
    ></QuotaExceededModal>

    <table
      class="table table-bordered"
      id="dataTable"
      width="100%"
      cellspacing="0"
    >
      <ConfirmDialog
        v-show="showConfirmDialog"
        :confirmDialogParams="confirmDialogParams"
      ></ConfirmDialog>
      <ResizeError
        v-show="showResizeError"
        :resizeErrorItem="resizeErrorItem"
        :errorMsgResize="errorMsgResize"
      ></ResizeError>
      <DeleteError
        v-show="showDeleteError"
        :deleteItem="deleteItem"
        :errorMsgDelete="errorMsgDelete"
        @confirmDelete="deleteCluster"
      ></DeleteError>
      <SaveEnvironmentTemplate
        ref="saveAsTemplate"
        v-show="showSaveEnvironmentTemplate"
        :clusterName="clusterName"
        :templateClusterId="templateClusterId"
        @saveEnvironmentAsTemplate="saveEnvironmentAsTemplate"
      ></SaveEnvironmentTemplate>
      <GenericPopupWarning
        :message="`Confirm deleting cluster: ${clusterToRemove.name}`"
        @confirm="deleteCluster(clusterToRemove)"
        :modalId="popupId"
      />
      <AddClusterMachines
        ref="addMachineComponent"
        v-show="showAddClusterMachines"
        :cluster="cluster"
        :clusterType="clusterType"
        :clusterID="clusterID"
        @exceededResources="setExceededResources"
      ></AddClusterMachines>
      <ResizeCapiCluster
        :clusterID="resizeClusterId"
        ref="resizeCapiCluster"
        @exceededResources="exceededResources"
      ></ResizeCapiCluster>
      <ResizeYaookCluster
        :clusterID="resizeClusterId"
        ref="resizeYaookCluster"
      ></ResizeYaookCluster>
      <EditClusterPopup
        v-if="showEditClusterPopup"
        :currentCluster="clusterToEdit"
        :oldName="clusterToEditName"
        @updateCluster="updateCluster"
      />
      <thead>
        <tr>
          <th>Name</th>
          <th v-if="showProject && !showTenant">Project</th>
          <th v-if="showTenant">Workspace</th>
          <th>Description</th>
          <th>Type</th>
          <th>Provider</th>
          <th>Created at</th>
          <th>Created by</th>
          <th>Status</th>
          <th>Operations</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in clustersList" :key="item.ID">
          <td
            :title="item.ID"
            v-if="
              item.InstallStep == 0 ||
              item.InstallStep == undefined ||
              item.InstallStep == -100
            "
            class="clickForDetails"
            v-on:click="goToClusterDetails(item)"
          >
            {{ item.Name }}
          </td>
          <td :title="item.ID" v-else-if="item.InstallStep == 100">
            {{ item.Name }}
          </td>
          <td
            :title="item.ID"
            v-else
            v-on:click="goToProgress(item)"
            class="clickForDetails"
          >
            {{ item.Name }}
          </td>
          <td
            v-if="showProject && !showTenant"
            v-show="projectsList != 'loading'"
            class="clickForDetails"
            v-on:click="
              $router.push({
                name: 'ProjectDetails',
                params: {
                  projectID: projectsList.filter(project => project.name == item.ProjectName)[0].id,
                },
              })
            "
            :title="item.ProjectName"
          >
            {{ item.ProjectName }}
          </td>
          <td 
            v-if="showTenant"
            class="clickForDetails"
              @click="
                $router.push({
                  name: 'WorkspaceDetails',
                  params: {
                    tenant: item.Tenant,
                  },
                })
              "
          >{{ item.Tenant.name }}</td>
          <td :title="item.Description">{{ item.Description }}</td>
          <td>
            <div v-if="item.Type == 1">DLCM</div>
            <div v-else-if="item.Type == 2">DMCV</div>
            <div v-else-if="item.Type == 3">DK3S</div>
            <div v-else-if="item.Type == 5">CAPI</div>
            <div v-else-if="item.Type == 7">DLCMv2</div>
            <div v-else-if="item.Type == 8">YaookCAPI</div>
            <div v-else>---</div>
          </td>
          <td>
            <img
              v-if="item.Providers.includes('Azure')"
              :title="item.Credentials.azure"
              margin-top="auto"
              margin-bottom="auto"
              class="pr-2"
              height="20pix"
              width="auto"
              src="../../../assets/img/azure_logo_small.png"
            />
            <img
              v-if="item.Providers.includes('Amazon')"
              :title="item.Credentials.aws"
              margin-top="auto"
              margin-bottom="auto"
              class="pr-2"
              height="20pix"
              width="auto"
              src="../../../assets/img/aws_logo_small.png"
            />
            <img
              v-if="item.Providers.includes('Openstack') && computed_theme == 'daiteap'"
              :title="item.Credentials.openstack"
              margin-top="auto"
              margin-bottom="auto"
              class="pr-2"
              height="20pix"
              width="auto"
              src="../../../assets/img/openstack_logo_small.png"
            />
            <img
              v-if="item.Providers.includes('Google')"
              :title="item.Credentials.google"
              margin-top="auto"
              margin-bottom="auto"
              class="pr-2"
              height="20pix"
              width="auto"
              src="../../../assets/img/googleCloud_logo_small.png"
            />
            <img
              v-if="item.Providers.includes('Onpremise')"
              :title="item.Credentials.onpremise"
              margin-top="auto"
              margin-bottom="auto"
              class="pr-2"
              height="20pix"
              width="auto"
              src="../../../assets/img/onpremise.svg"
            />
            <img
              v-if="item.Providers.includes('IotArm')"
              :title="item.Credentials.iotarm"
              margin-top="auto"
              margin-bottom="auto"
              class="pr-2"
              height="20pix"
              width="auto"
              src="../../../assets/img/IoTArm_logo_small.svg"
            />
          </td>
          <td>{{ item.CreatedAt }}</td>
          <td
            :title="item.Contact"
            class="clickForDetails"
            v-on:click="showUserDetails(item.Contact)"
          >
            {{ item.Contact }}
          </td>
          <td style="max-width: none;">
            <span v-if="item.ResizeStep > 0"
              ><b-spinner
                style="width: 1rem; height: 1rem"
                variant="info"
                class="mr-2"
              ></b-spinner
              >Resizing{{ resizeStatus(item.ResizeStep, item.Type) }}</span
            >
            <span v-else-if="item.ResizeStep < 0 && item.InstallStep != 100"
              >Resizing{{ resizeStatus(item.ResizeStep, item.Type) }}</span
            >
            <span v-else-if="item.Status == 'stopping'"
              ><b-spinner
                style="width: 1rem; height: 1rem"
                variant="warning"
                class="mr-2"
              ></b-spinner
              >{{ item.Status }}</span
            >
            <span v-else-if="item.Status == 'starting'"
              ><b-spinner
                style="width: 1rem; height: 1rem"
                variant="success"
                class="mr-2"
              ></b-spinner
              >{{ item.Status }}</span
            >
            <span v-else-if="item.Status == 'restarting'"
              ><b-spinner
                style="width: 1rem; height: 1rem"
                variant="warning"
                class="mr-2"
              ></b-spinner
              >{{ item.Status }}</span
            >
            <span
              v-else-if="
                item.Status != 'installing...' &&
                item.InstallStep >= 0 &&
                item.InstallStep < 31
              "
              :class="item.Status.includes('error') ? 'text-danger' : ''"
              >{{ item.Status }}</span
            >
            <span v-else-if="item.InstallStep < 0" class="text-danger"
              >{{ detailedStatus(item.InstallStep, item.Type) }}
            </span>
            <span v-else-if="item.InstallStep == 100"
              ><b-spinner
                style="width: 1rem; height: 1rem"
                variant="danger"
                class="mr-2"
              ></b-spinner
              >{{ detailedStatus(item.InstallStep, item.Type) }}</span
            >
            <span v-else
              ><b-spinner
                style="width: 1rem; height: 1rem"
                variant="info"
                class="mr-2"
              ></b-spinner
              >{{ detailedStatus(item.InstallStep, item.Type) }}</span
            >
            <i
              class="fas fa-exclamation-triangle waring-modal-icon"
              v-if="item.InstallStep == -100" 
              @click="deleteError(item)"
              style="cursor: pointer;"
            ></i>
            <span
              v-if="item.ResizeStep < 0 && item.InstallStep != 100"
              v-on:click="resizeError(item)"
              class="btn btn-outline-success btn-circle btn-sm ml-1"
              title="Detailed information"
            >
              <i class="fas fa-exclamation-triangle waring-modal-icon"></i>
            </span>
          </td>
          <td>
            <div>
              <b-dropdown right size="sm" class="dropDownMenuButton" boundary="window" no-caret>
                <template #button-content>
                  <i
                    class="fa fa-ellipsis-v machineoperationsbutton"
                    aria-hidden="true"
                  ></i>
                </template>

                <b-dropdown-item
                  @click="openEditPopup(item)"
                >
                  <span>
                    <i class="fas fa-edit"></i>
                    Edit
                  </span>
                </b-dropdown-item>

                <b-dropdown-item
                  :disabled="item.InstallStep > 0 || item.ResizeStep > 0"
                  v-on:click="deleteClusterPopup(item.ID, item.Name, item.Type)"
                >
                  <span>
                    <i class="far fa-trash-alt"></i>
                    Delete
                  </span>
                </b-dropdown-item>

                <b-dropdown-item
                  v-if="item.Type != 5 && item.Type != 8"
                  :disabled="item.Status != 'stopped' || item.ResizeStep > 0"
                  v-on:click="startCluster(item.ID, item.Name)"
                >
                  <span>
                    <i class="fas fa-play"></i>
                    Start
                  </span>
                </b-dropdown-item>

                <b-dropdown-item
                  v-if="item.Type != 5 && item.Type != 8"
                  :disabled="item.Status != 'running' || item.ResizeStep > 0"
                  v-on:click="stopCluster(item.ID, item.Name)"
                >
                  <span>
                    <i class="fas fa-stop-circle"></i>
                    Stop
                  </span>
                </b-dropdown-item>

                <b-dropdown-item
                  v-if="item.Type != 5 && item.Type != 8"
                  :disabled="item.Status != 'running' || item.ResizeStep > 0"
                  v-on:click="restartCluster(item.ID, item.Name)"
                >
                  <span>
                    <i class="fas fa-sync-alt"></i>
                    Restart
                  </span>
                </b-dropdown-item>

                <b-dropdown-item
                  :disabled="item.Status != 'running' || item.InstallStep != 0  || item.ResizeStep > 0"
                  v-if="item.Type != 5 && item.Type != 8 && computed_account_settings.enable_cluster_resize"
                  v-on:click="resizeDLCMCluster(item.ID)"
                >
                  <span>
                    <i class="fas fa-plus-square"></i>
                    Resize
                  </span>
                </b-dropdown-item>

                <b-dropdown-item
                  :disabled="item.Status != 'running' || item.InstallStep != 0 || item.ResizeStep > 0"
                  v-if="item.Type == 5 && computed_account_settings.enable_cluster_resize"
                  v-on:click="resizeCapiCluster(item.ID)"
                >
                  <span>
                    <i class="fas fa-plus-square"></i>
                    Resize
                  </span>
                </b-dropdown-item>

                <b-dropdown-item
                  :disabled="item.Status != 'running' || item.InstallStep != 0 || item.ResizeStep > 0"
                  v-if="item.Type == 8 && computed_account_settings.enable_cluster_resize"
                  v-on:click="resizeYaookCluster(item.ID)"
                >
                  <span>
                    <i class="fas fa-plus-square"></i>
                    Resize
                  </span>
                </b-dropdown-item>

                <b-dropdown-item v-if="computed_account_settings.enable_templates" :disabled="item.InstallStep == 1 || item.ResizeStep > 0" v-on:click="templateCluster(item.ID)">
                  <span>
                    <i class="fas fa-save"></i>
                    Template
                  </span>
                </b-dropdown-item>

                <b-dropdown-item
                  v-if="item.InstallStep == 0" v-on:click="downloadKubeconfig(item.ID)"
                >
                  <span>
                    Kubeconfig
                  </span>
                </b-dropdown-item>

                <b-dropdown-item
                  v-if="item.InstallStep == 0 && item.Type == 8" v-on:click="downloadWireguardConfig(item.ID)"
                >
                  <span>
                    Wireguard
                  </span>
                </b-dropdown-item>

              </b-dropdown>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import SaveEnvironmentTemplate from "@/components/platform/popup_modals/SaveEnvironmentTemplate";
import DeleteError from "@/components/platform/popup_modals/DeleteError";
import ResizeError from "@/components/platform/popup_modals/ResizeError";
import AddClusterMachines from "@/components/platform/popup_modals/AddMachinesToVMs";
import ResizeCapiCluster from "@/components/platform/popup_modals/ResizeCapiCluster";
import ResizeYaookCluster from "@/components/platform/popup_modals/ResizeYaookCluster";
import ConfirmDialog from "@/components/platform/popup_modals/ConfirmDialog";
import WarningAlert from "@/components/platform/WarningAlert";
import GenericPopupWarning from "@/components/platform/popup_modals/GenericPopupWarning";
import EditClusterPopup from "@/components/platform/popup_modals/EditClusterPopup";
import QuotaExceededModal from "@/components/platform/popup_modals/QuotaExceededModal";

export default {
  name: "KubernetesClustersTable",
  props: {
    clustersList: Array,
    projectsList: [Array, String],
    showProject: {
      type: Boolean,
      default: true
    },
    showTenant: {
      type: Boolean,
      default: false
    },
  },
  data() {
    return {
      showQuotaExceeded: false,
      providers: [],
      clusterType: "",
      clusterName: "",
      clusterStatus: "",
      cluster: {},
      clusterID: "",
      showSaveEnvironmentTemplate: false,
      interval: "",
      loading: false,
      templatesList: [],
      templatesInDeletion: [],
      environmentNamesList: [],
      exceededResources: {},
      clusterFailureStatus: `error`,
      clusterLoadingStatus: `installing...`,
      clusterDeletingStatus: `deleting...`,
      showConfirmDialog: false,
      showDeleteError: false,
      showAddClusterMachines: false,
      showResizeError: false,
      showCreateEnvironmentFromTemplate: false,
      errorMsgDelete: "",
      errorMsgResize: "",
      deleteItem: {},
      accountsList: [],
      resizeErrorItem: "",
      resizeClusterId: "",
      confirmDialogParams: {
        requestBody: {},
        text: "",
        endpoint: "",
        envName: "",
        envId: "",
        action: "",
        successMessage: "",
        failureMessage: "",
      },
      deleteDialogParams: {
        requestBody: {},
        text: "",
        endpoint: "",
        successMessage: "",
        failureMessage: "",
        envName: "",
        envId: "",
      },
      showAlert: false,
      alertKey: 0,
      clusterToRemove: {
        id: 0,
        name: "",
        type: 0,
      },
      clusterToEdit: {},
      clusterToEditName: "",
      showEditClusterPopup: false,
      templateClusterId: "",
      popupId: "clusterdeletewarning",
    };
  },
  created() {
    this.loadingTable = true;

  },
  components: {
    SaveEnvironmentTemplate,
    DeleteError,
    ResizeError,
    AddClusterMachines,
    ConfirmDialog,
    ResizeCapiCluster,
    ResizeYaookCluster,
    WarningAlert,
    GenericPopupWarning,
    EditClusterPopup,
    QuotaExceededModal,
  },
  methods: {
    showUserDetails(username) {
      this.$emit("showUserDetails", username);
    },
    goToProgress(item) {
      for (let i = 0; i < window.intervals.length; i++) {
        clearInterval(window.intervals[i]);
      }
      if (item.Type == 1) {
        this.$router.push({
          name: "SubmitKubernetesCluster",
          params: { ID: item.ID, clusterName: item.Name },
        });
      } else if (item.Type == 2) {
        this.$router.push({
          name: "SubmitVMs",
          params: { ID: item.ID, clusterName: item.Name },
        });
      } else if (item.Type == 3) {
        this.$router.push({
          name: "SubmitK3sCluster",
          params: { ID: item.ID, clusterName: item.Name },
        });
      } else if (item.Type == 5) {
        this.$router.push({
          name: "SubmitCAPICluster",
          params: { ID: item.ID, clusterName: item.Name },
        });
      } else if (item.Type == 7) {
        this.$router.push({
          name: "SubmitKubernetesCluster",
          params: { ID: item.ID, clusterName: item.Name },
        });
      } else if (item.Type == 8) {
        this.$router.push({
          name: "SubmitYaookCluster",
          params: { ID: item.ID, clusterName: item.Name },
        });
      }
    },
    goToClusterDetails(item) {
      for (let i = 0; i < window.intervals.length; i++) {
        clearInterval(window.intervals[i]);
      }
      this.$router.push({
        name: "ClusterDetails",
        params: {
          clusterID: item.ID,
          detailPage: "overview",
        },
      });
    },
    detailedStatus(installStep, type) {
      let currentStatus = "";
      if (type == 1) {
        if (installStep >= 1 && installStep <= 6) {
          currentStatus = "Allocating resources";
        }
        if (installStep >= 7 && installStep <= 8) {
          currentStatus = "Preparing for Kubernetes installation";
        }
        if (installStep >= 9 && installStep <= 12) {
          currentStatus = "Configuring machines";
        }
        if (installStep >= 13 && installStep <= 24) {
          currentStatus = "Installing Kubernetes";
        }
        if (installStep >= 25 && installStep <= 30) {
          currentStatus = "Finishing installation";
        }
        if (installStep == 0) {
          currentStatus = "";
        }
        if (installStep <= -1 && installStep >= -6) {
          currentStatus = "Error in allocating resources";
        }
        if (installStep <= -7 && installStep >= -8) {
          currentStatus = "Error preparing for Kubernetes installation";
        }
        if (installStep <= -9 && installStep >= -12) {
          currentStatus = "Error configuring machines";
        }
        if (installStep <= -13 && installStep >= -24) {
          currentStatus = "Error installing Kubernetes";
        }
        if (installStep <= -25 && installStep >= -30) {
          currentStatus = "Error finishing installation";
        }
        if (installStep == 100) {
          currentStatus = "Deleting...";
        }
        if (installStep == -100) {
          currentStatus = "Error deleting";
        }
      } else if (type == 2) {
        if (installStep >= 1 && installStep <= 6) {
          currentStatus = "Allocating resources";
        }
        if (installStep >= 7 && installStep <= 10) {
          currentStatus = "Configuring machines";
        }
        if (installStep >= 11 && installStep <= 14) {
          currentStatus = "Installing security services";
        }
        if (installStep == 0) {
          currentStatus = "";
        }
        if (installStep <= -1 && installStep >= -6) {
          currentStatus = "Error allocating resources";
        }
        if (installStep <= -7 && installStep >= -10) {
          currentStatus = "Error configuring machines";
        }
        if (installStep <= -11 && installStep >= -14) {
          currentStatus = "Error installing security services";
        }
        if (installStep == 100) {
          currentStatus = "Deleting...";
        }
        if (installStep == -100) {
          currentStatus = "Error deleting";
        }
      } else if (type == 3) {
        if (installStep >= 1 && installStep <= 6) {
          currentStatus = "Allocating resources";
        }
        if (installStep >= 7 && installStep <= 8) {
          currentStatus = "Preparing for K3S installation";
        }
        if (installStep >= 9 && installStep <= 12) {
          currentStatus = "Configuring machines";
        }
        if (installStep >= 13 && installStep <= 24) {
          currentStatus = "Installing K3S";
        }
        if (installStep >= 25 && installStep <= 30) {
          currentStatus = "Finishing installation";
        }
        if (installStep == 0) {
          currentStatus = "";
        }
        if (installStep <= -1 && installStep >= -6) {
          currentStatus = "Error in allocating resources";
        }
        if (installStep <= -7 && installStep >= -8) {
          currentStatus = "Error preparing for K3S installation";
        }
        if (installStep <= -9 && installStep >= -12) {
          currentStatus = "Error configuring machines";
        }
        if (installStep <= -13 && installStep >= -24) {
          currentStatus = "Error installing K3S";
        }
        if (installStep <= -25 && installStep >= -30) {
          currentStatus = "Error finishing installation";
        }
        if (installStep == 100) {
          currentStatus = "Deleting...";
        }
        if (installStep == -100) {
          currentStatus = "Error deleting";
        }
      } else if (type == 5) {
        console.info("CAPI Status");
        if (installStep < 0) {
          currentStatus = "Error in CAPI cluster";
        }
        if (installStep == 1) {
          currentStatus = "Provisioning nodes";
        }
        if (installStep == 2) {
          currentStatus = "Downloading kubeconfig";
        }
        if (installStep == 3) {
          currentStatus = "Installing CNI plugin";
        }
        if (installStep == 4) {
          if(this.computed_theme == "daiteap") {
            currentStatus = "Installing OpenStack CCM";
          }
        }
        if (installStep == 5) {
          currentStatus = "Installing CSI";
        }
        if (installStep == 6) {
          currentStatus = "Installing Longhorn storage";
        }
        if (installStep == 7) {
          currentStatus = "Adding node labels";
        }
        if (installStep == 8) {
          currentStatus = "Adding node taints";
        }
        if (installStep == 9) {
          currentStatus = "Finishing install";
        }
        if (installStep == 100) {
          currentStatus = "Deleting...";
        }
      } else if (type == 7) {
        if (installStep >= 1 && installStep <= 6) {
          currentStatus = "Allocating resources";
        }
        if (installStep >= 7 && installStep <= 8) {
          currentStatus = "Preparing for Kubernetes installation";
        }
        if (installStep >= 9 && installStep <= 12) {
          currentStatus = "Configuring machines";
        }
        if (installStep >= 13 && installStep <= 24) {
          currentStatus = "Installing Kubernetes";
        }
        if (installStep >= 25 && installStep <= 30) {
          currentStatus = "Finishing installation";
        }
        if (installStep == 0) {
          currentStatus = "";
        }
        if (installStep <= -1 && installStep >= -6) {
          currentStatus = "Error in allocating resources";
        }
        if (installStep <= -7 && installStep >= -8) {
          currentStatus = "Error preparing for Kubernetes installation";
        }
        if (installStep <= -9 && installStep >= -12) {
          currentStatus = "Error configuring machines";
        }
        if (installStep <= -13 && installStep >= -24) {
          currentStatus = "Error installing Kubernetes";
        }
        if (installStep <= -25 && installStep >= -30) {
          currentStatus = "Error finishing installation";
        }
        if (installStep == 100) {
          currentStatus = "Deleting...";
        }
        if (installStep == -100) {
          currentStatus = "Error deleting";
        }
      } else if (type == 8) {
        if (installStep < 0) {
          currentStatus = "Error in YaookCAPI cluster";
        }
        if (installStep == 1) {
          currentStatus = "Provisioning nodes";
        }
        if (installStep == 2) {
          currentStatus = "Downloading kubeconfig";
        }
        if (installStep == 3) {
          currentStatus = "Downloading Wireguard config";
        }
        if (installStep == 7) {
          currentStatus = "Adding node labels";
        }
        if (installStep == 8) {
          currentStatus = "Adding node taints";
        }
        if (installStep == 9) {
          currentStatus = "Finishing install";
        }
        if (installStep == 100) {
          currentStatus = "Deleting...";
        }
      }
      return currentStatus;
    },
    getResizeStatus(environment) {
      let self = this;
      this.axios
        .get(
          "/server/tenants/" +
            this.computed_active_tenant_id +
            "/clusters/" +
            environment.ID +
            "/resize-status",
          this.get_axiosConfig()
        )
        .then(function (response) {
          environment.resizeStep = response.data["resizeStep"];
          if (response.data["errorMsg"]) {
            // eslint-disable-next-line no-undef
            self.errorMsgResize = Buffer.from(
              response.data["errorMsg"],
              "base64"
            ).toString("utf-8");
          }
        })
        .catch(function (error) {
          console.error(error);
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
              text: "Error while getting resize status!",
            });
          }
        });
    },
    resizeStatus(resizeStep, type) {
      let currentStatus = "...";
      if (type == 1) {
        if (resizeStep >= 1 && resizeStep <= 3) {
          currentStatus = ": Creating machines";
        }
        if (resizeStep >= 4 && resizeStep <= 10) {
          currentStatus = ": Configuring machines";
        }
        if (resizeStep >= 11 && resizeStep <= 14) {
          currentStatus = ": Adding machines to Kubernetes";
        }
        if (resizeStep == 0) {
          currentStatus = "...";
        }
        if (resizeStep <= -1 && resizeStep >= -3) {
          currentStatus = ": Creating machines error";
        }
        if (resizeStep <= -4 && resizeStep >= -10) {
          currentStatus = ": Error configuring machines";
        }
        if (resizeStep <= -11 && resizeStep >= -14) {
          currentStatus = ": Error adding machines to Kubernetes";
        }
      }
      if (type == 2) {
        if (resizeStep >= 1 && resizeStep <= 3) {
          currentStatus = ": Creating machines";
        }
        if (resizeStep >= 4 && resizeStep <= 10) {
          currentStatus = ": Configuring machines";
        }
        if (resizeStep == 0) {
          currentStatus = "...";
        }
        if (resizeStep <= -1 && resizeStep >= -3) {
          currentStatus = ": Creating machines error";
        }
        if (resizeStep <= -4 && resizeStep >= -10) {
          currentStatus = ": Error configuring machines";
        }
      }
      if (type == 5) {
        if (resizeStep < 0) {
          currentStatus = ": Error in CAPI cluster";
        }
      }
      if (type == 8) {
        if (resizeStep < 0) {
          currentStatus = ": Error in YaookCAPI cluster";
        }
      }
      return currentStatus;
    },
    addMachineToCluster(item) {
      this.clusterID = item.ID;
      this.getClusterDetails();
      this.$bvModal.show("bv-modal-addclustermachines");
    },
    async getClusterDetails() {
      let self = this;
      let cluster = await this.getClusterDetailsMain(self.clusterID);
      self.cluster = cluster;

      for (let i = 0; i < self.cluster.usersList.length; i++) {
        if (self.cluster.usersList[i].status == 0) {
          self.cluster.usersList[i].status = "active";
        } else if (self.cluster.usersList[i].status == 1) {
          self.cluster.usersList[i].status = "creating";
        } else if (
          self.cluster.usersList[i].status == -1 ||
          self.cluster.usersList[i].status == -2 ||
          self.cluster.usersList[i].status == -3
        ) {
          self.cluster.usersList[i].status = "error creating";
        } else if (self.cluster.usersList[i].status == 10) {
          self.cluster.usersList[i].status = "deleting";
        } else if (self.cluster.usersList[i].status == -10) {
          self.cluster.usersList[i].status = "error deleting";
        }
      }
      for (let i = 0; i < self.cluster.machinesList.length; i++) {
        if (self.cluster.machinesList[i].operating_system != null) {
          self.cluster.machinesList[i].operating_system =
            self.cluster.machinesList[i].operating_system.split("/")[
              self.cluster.machinesList[i].operating_system.split("/").length -
                1
            ];
        }

        if (self.cluster.machinesList[i].status == 0) {
          self.cluster.machinesList[i].statusText = "running";
        } else if (self.cluster.machinesList[i].status == 1) {
          self.cluster.machinesList[i].statusText = "starting";
        } else if (self.cluster.machinesList[i].status == -1) {
          self.cluster.machinesList[i].statusText = "error starting";
        } else if (self.cluster.machinesList[i].status == 2) {
          self.cluster.machinesList[i].statusText = "stopping";
        } else if (self.cluster.machinesList[i].status == -2) {
          self.cluster.machinesList[i].statusText = "error stopping";
        } else if (self.cluster.machinesList[i].status == 3) {
          self.cluster.machinesList[i].statusText = "restarting";
        } else if (self.cluster.machinesList[i].status == -3) {
          self.cluster.machinesList[i].statusText = "error restarting";
        } else if (self.cluster.machinesList[i].status == 10) {
          self.cluster.machinesList[i].statusText = "stopped";
        }
      }
      self.clusterType = self.cluster.clusterType;
      self.clusterName = self.cluster.title;
      self.clusterStatus = self.cluster.status;
      if (self.cluster.kubernetesConfiguration) {
        if (self.cluster.kubernetesConfiguration.version) {
          self.kubernetesVersion = self.cluster.kubernetesConfiguration.version;
        }
        if (self.cluster.kubernetesConfiguration.networkPlugin) {
          self.kubernetesNetworkPlugin =
            self.cluster.kubernetesConfiguration.networkPlugin;
        }
        if (self.cluster.kubernetesConfiguration.podsSubnet) {
          self.kubernetesPodsSubnet =
            self.cluster.kubernetesConfiguration.podsSubnet;
        }
        if (self.cluster.kubernetesConfiguration.serviceAddresses) {
          self.kubernetesServiceAddresses =
            self.cluster.kubernetesConfiguration.serviceAddresses;
        }
      }
      if (self.cluster.loadBalancerIntegration) {
        self.loadBalancerIntegration = self.cluster.loadBalancerIntegration;
      }
      if (cluster["kubeUpgradeStatus"] != undefined) {
        self.kubeUpgradeStatus = self.cluster.kubeUpgradeStatus;
      }
      if (cluster["errorMsg"]) {
        // eslint-disable-next-line no-undef
        self.errorMsg = Buffer.from(
          cluster["errorMsg"],
          "base64"
        ).toString("utf-8");
      }
      if (self.accountsList.length == 0) {
        if (self.cluster.providers.alicloudSelected) {
          let account = self.cluster.providers.alicloud.account;
          if (self.cluster.providers.alicloud.account.length < 1) {
            account = "---";
            self.providersWithoutAccounts.push("alicloud");
          }
          self.accountsList.push({
            provider: "alicloud",
            account: account,
          });
        }
        if (self.cluster.providers.openstackSelected) {
          let account = self.cluster.providers.openstack.account;
          if (self.cluster.providers.openstack.account.length < 1) {
            account = "---";
            self.providersWithoutAccounts.push("openstack");
          }
          self.accountsList.push({
            provider: "openstack",
            account: account,
          });
        }
        if (self.cluster.providers.awsSelected) {
          let account = self.cluster.providers.aws.account;
          if (self.cluster.providers.aws.account.length < 1) {
            account = "---";
            self.providersWithoutAccounts.push("aws");
          }
          self.accountsList.push({
            provider: "aws",
            account: account,
          });
        }
        if (self.cluster.providers.azureSelected) {
          let account = self.cluster.providers.azure.account;
          if (self.cluster.providers.azure.account.length < 1) {
            account = "---";
            self.providersWithoutAccounts.push("azure");
          }
          self.accountsList.push({
            provider: "azure",
            account: account,
          });
        }
        if (self.cluster.providers.googleSelected) {
          let account = self.cluster.providers.google.account;
          if (self.cluster.providers.google.account.length < 1) {
            account = "---";
            self.providersWithoutAccounts.push("google");
          }
          self.accountsList.push({
            provider: "google",
            account: account,
          });
        }
        if (self.cluster.providers.onpremiseSelected) {
          let account = self.cluster.providers.onpremise.account;
          if (self.cluster.providers.onpremise.account.length < 1) {
            account = "---";
            self.providersWithoutAccounts.push("onpremise");
          }
          self.accountsList.push({
            provider: "On-premise network",
            account: account,
          });
        }
        if (self.cluster.providers.iotarmSelected) {
          let account = self.cluster.providers.iotarm.account;
          if (self.cluster.providers.iotarm.account.length < 1) {
            account = "---";
            self.providersWithoutAccounts.push("iotarm");
          }
          self.accountsList.push({
            provider: "IoT-ARM",
            account: account,
          });
        }
      }

      self.$root.$emit("updateClusterDetails", {
        clusterName: self.clusterName,
        clusterID: self.clusterID,
        clusterType: self.clusterType,
        loadBalancerIntegration: self.loadBalancerIntegration,
        kubernetesVersion: self.kubernetesVersion,
        kubernetesNetworkPlugin: self.kubernetesNetworkPlugin,
        kubernetesPodsSubnet: self.kubernetesPodsSubnet,
        kubernetesServiceAddresses: self.kubernetesServiceAddresses,
      });

      self.loading = false;
      if (self.$refs.addMachineComponent.providers.length == 0) {
        self.$refs.addMachineComponent.updateProvidersList(
          self.cluster.providers
        );
      }
    },
    resizeCapiCluster(clusterID) {
      this.$router.push({
        name: "ResizeCapiCluster",
        params: {
          clusterID: clusterID,
        },
      });
    },
    resizeYaookCluster(clusterID) {
      this.$router.push({
        name: "ResizeYaookCluster",
        params: {
          clusterID: clusterID,
        },
      });
    },
    resizeDLCMCluster(clusterID) {
      this.$router.push({
        name: "ResizeDLCMCluster",
        params: {
          clusterID: clusterID,
        },
      });
    },
    templateCluster(clusterID) {
      this.templateClusterId = clusterID;
      this.$bvModal.show("bv-modal-saveenvironmenttemplate");
    },
    saveEnvironmentAsTemplate(templateForm) {
      let self = this;

      this.axios
        .post(
          "/server/tenants/" +
            this.computed_active_tenant_id +
            "/clusters/" +
            templateForm.environmentId +
            "/template",
          templateForm,
          this.get_axiosConfig()
        )
        .then(
          self.$notify({
            group: "msg",
            type: "success",
            title: "Notification:",
            text: "Successfully submitted template creation request",
          })
        )
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
              text: "Error while saving Template! " + error,
            });
          }
        });
    },
    deleteError(deleteItem) {
      this.deleteItem = {
        name: deleteItem.Name,
        id: deleteItem.ID,
        type: deleteItem.Type
      }
      try {
        // eslint-disable-next-line no-undef
        this.errorMsgDelete = Buffer.from(
          deleteItem.ErrorMsgDelete,
          "base64"
        ).toString("utf-8");
      } catch (error) {
        this.errorMsgDelete = "";
        console.log(error);
      }

      this.showDeleteError = true;
      this.$bvModal.show("bv-modal-deleteerror");
    },
    resizeError(resizeErrorItem) {
      this.resizeErrorItem = resizeErrorItem;
      this.getResizeStatus(resizeErrorItem);
      this.showResizeError = true;
      this.$bvModal.show("bv-modal-resizeerror");
    },
    deleteCluster(clusterToRemove) {
      this.$bvModal.hide(this.popupId);

      let endpoint;
      if (clusterToRemove.type == 5) {
        endpoint =
          "/server/tenants/" +
          this.computed_active_tenant_id +
          "/clusters/" +
          clusterToRemove.id +
          "/capi-delete";
      } else if (clusterToRemove.type == 8) {
        endpoint =
          "/server/tenants/" +
          this.computed_active_tenant_id +
          "/clusters/" +
          clusterToRemove.id +
          "/yaook-delete";
      } else {
        endpoint =
          "/server/tenants/" +
          this.computed_active_tenant_id +
          "/clusters/" +
          clusterToRemove.id +
          "/delete";
      }

      let self = this;
      this.axios
        .delete(
          endpoint,
          this.get_axiosConfig()
        )
        .then(function () {
          self.$notify({
            group: "msg",
            type: "success",
            title: "Notification:",
            text: 'You have successfully submitted deletion for "' + clusterToRemove.name + '".',
          });

          self.showAlert = true;
          self.alertKey += 1;
        })
        .catch(function (error) {
          console.log(error);
          if (error.response) {
            error= error.response.data.error.message;
          }
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
              text: 'Error occured while you tried to submit deletion of "' + clusterToRemove.name + '".',
            });
          }
        });
    },
    deleteClusterPopup(id, name, type) {
      this.clusterToRemove.id = id;
      this.clusterToRemove.name = name;
      this.clusterToRemove.type = type;
      this.$bvModal.show(this.popupId);
    },
    stopCluster(id, name) {
      this.confirmDialogParams.requestBody = { clusterID: id };
      this.confirmDialogParams.text = "Are you sure you want to stop";
      this.confirmDialogParams.envName = name;
      this.confirmDialogParams.envId = id;
      this.confirmDialogParams.action = "Stop";
      this.confirmDialogParams.endpoint =
        "/server/tenants/" +
        this.computed_active_tenant_id +
        "/clusters/" +
        id +
        "/stop";
      this.confirmDialogParams.successMessage =
        'You have successfully submitted stop for "' + name + '".';
      this.confirmDialogParams.failureMessage =
        'Error occured while you tried to submit stop of "' + name + '".';
      this.showConfirmDialog = true;
      this.$bvModal.show("bv-modal-confirmdialog");
    },
    startCluster(id, name) {
      this.confirmDialogParams.requestBody = { clusterID: id };
      this.confirmDialogParams.text = "Are you sure you want to start";
      this.confirmDialogParams.envName = name;
      this.confirmDialogParams.envId = id;
      this.confirmDialogParams.action = "Start";
      this.confirmDialogParams.endpoint =
        "/server/tenants/" +
        this.computed_active_tenant_id +
        "/clusters/" +
        id +
        "/start";
      this.confirmDialogParams.successMessage =
        'You have successfully submitted start for "' + name + '".';
      this.confirmDialogParams.failureMessage =
        'Error occured while you tried to submit start of "' + name + '".';
      this.showConfirmDialog = true;
      this.$bvModal.show("bv-modal-confirmdialog");
    },
    restartCluster(id, name) {
      this.confirmDialogParams.requestBody = { clusterID: id };
      this.confirmDialogParams.text = "Are you sure you want to restart";
      this.confirmDialogParams.envName = name;
      this.confirmDialogParams.envId = id;
      this.confirmDialogParams.action = "Restart";
      this.confirmDialogParams.endpoint =
        "/server/tenants/" +
        this.computed_active_tenant_id +
        "/clusters/" +
        id +
        "/restart";
      this.confirmDialogParams.successMessage =
        'You have successfully submitted stop for "' + name + '".';
      this.confirmDialogParams.failureMessage =
        'Error occured while you tried to submit stop of "' + name + '".';
      this.showConfirmDialog = true;
      this.$bvModal.show("bv-modal-confirmdialog");
    },
    downloadKubeconfig(id) {
      let self = this;
      this.axios
        .get(
          "/server/tenants/" +
            this.computed_active_tenant_id +
            "/clusters/" +
            id +
            "/kubeconfig",
          this.get_axiosConfig()
        )
        .then(function (response) {
          const url = window.URL.createObjectURL(
            new Blob([response.data["kubeconfig"]])
          );
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", "kubeconfig");
          document.body.appendChild(link);
          link.click();
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
              text: "Error while downloading Kubeconfig file! " + error,
            });
          }
        });
    },
    downloadWireguardConfig(id) {
      let self = this;
      this.axios
        .get(
          "/server/tenants/" +
            this.computed_active_tenant_id +
            "/clusters/" +
            id +
            "/wireguard-config",
          this.get_axiosConfig()
        )
        .then(function (response) {
          const url = window.URL.createObjectURL(
            new Blob([response.data["wireguardconfig"]])
          );
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", "wg0.conf");
          document.body.appendChild(link);
          link.click();
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
              text: "Error while downloading Wireguard file! " + error,
            });
          }
        });
    },
    openEditPopup(cluster) {
      this.clusterToEdit = cluster;
      this.clusterToEditName = cluster.Name;
      this.showEditClusterPopup = true;
      this.$nextTick(function () {
          this.$bvModal.show('bv-modal-editcluster');
      });
    },
    updateCluster(cluster) {
      let self = this;
      this.axios
        .put(
          "/server/tenants/" +
            this.computed_active_tenant_id +
            "/clusters/" +
            cluster.id,
          {
            name: cluster.Name,
            description: cluster.Description,
          },
          this.get_axiosConfig()
        )
        .then(function () {
          self.$notify({
            group: "msg",
            type: "success",
            title: "Notification:",
            text: "Successfuly updated cluster!",
          });
        })
        .catch(function (error) {
          console.log(error);
          if (error.response) {
            console.log(error.response.data);
          }
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
              text: "Error while updating cluster.",
            });
          }
        });
    },
    setExceededResources(resources) {
      this.exceededResources = resources;
      this.showQuotaExceeded = true;
      this.$bvModal.show("bv-modal-quotaexceeded");
    },
  },
};
</script>

<style scoped>
a:not([href]):not([tabindex]) {
  color: #4e73df;
  text-decoration: none;
  cursor: pointer;
}

a:not([href]):not([tabindex]):hover {
  color: #224abe;
  text-decoration: underline;
  cursor: pointer;
}

.fa-plus {
  color: white;
}

.fa-trash-alt {
  color: red;
}

.fa-server {
  color: #000;
}

.card-header {
  display: block;
}

.card-header > h6 {
  display: inline-block;
}

input {
  width: 20rem !important;
}
.cardHeaderLight {
  background-color: #fff;
  color: #1d1e22;
  border-bottom: #1d1e22 2px solid;
  border: #d1d1d1 1px solid;
}
.card-body {
  border: #00708c10 1px solid;
}
kbd {
  background-color: #1d1e22;
  cursor: pointer;
}
kbd:hover {
  background-color: #00708caf;
}
.removeAccountIcon {
  color: red;
  cursor: pointer;
}

.clickForDetails.template {
  color: #1d1e22;
}
.providerLogoDiv {
  height: 100%;
  width: 100%;
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
  width: 50%;
}
.baseBlock {
  width: 22rem;
  height: 8rem;
  box-shadow: 0 2px 2px rgba(0, 0, 0, 0.2);
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
.baseBlock.dmcv:hover {
  box-shadow: 0 10px 10px#bcbcbc;
}
.baseBlock.dke:hover {
  box-shadow: 0 10px 10px#bcbcbc;
}
.baseBlock.k3s:hover {
  box-shadow: 0 10px 10px#bcbcbc;
}
.btn-circle {
  background-color: #fff !important;
  color: #fff;
  border: 1px solid #bcbcbc !important;
}
td {
  max-width: 17rem;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}
</style>