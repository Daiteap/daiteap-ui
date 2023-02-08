<template>
  <div>
    <TextPopup :textPopupParams="textPopupParams"></TextPopup>
    <ConfirmDialog
      v-show="showConfirmDialog"
      :confirmDialogParams="confirmDialogParams"
      :modalId="confirmDialogModalId"
    ></ConfirmDialog>
    <DetailsVirtualMachine
      v-show="showDetailsVirtualMachine"
      :machineDetails="machineDetails"
    ></DetailsVirtualMachine>
    <SaveEnvironmentTemplate
      v-show="showSaveEnvironmentTemplate"
      :templateClusterId="templateClusterId"
      @saveEnvironmentAsTemplate="saveEnvironmentAsTemplate"
    ></SaveEnvironmentTemplate>
    <SpecificUserInfo
      v-if="showSpecificUserInfo"
      :username="specificUserUsername"
      @hideUserDetails="hideUserDetails"
    />
    <EditClusterPopup
      v-if="showEditClusterPopup"
      :currentCluster="clusterToEdit"
      :oldName="clusterToEditName"
      @updateCluster="updateCluster"
      :isCompute="true"
    />
    <div v-if="loading" class="d-flex justify-content-center">
      <div class="spinner-border" role="status">
        <span class="sr-only">Loading...</span>
      </div>
    </div>
    <div v-else-if="clustersList.length == 0">No Compute (VMs) currently.</div>
    <div v-else>
      <table
        class="table table-bordered"
        id="dataTable"
        width="100%"
        cellspacing="0"
      >
        <thead>
          <tr>
            <th>Name</th>
            <th v-if="!projectName && !showTenant">Project</th>
            <th v-if="showTenant">Workspace</th>
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
            <td v-else>
              {{ item.Name }}
            </td>
            <td
              v-if="
                !projectName && computed_isBusinessAccountOwner && !showTenant
              "
              v-show="projectsList != 'loading'"
              :title="item.ProjectName"
            >
              {{ item.ProjectName }}
            </td>
            <td
              v-else-if="!projectName && !showTenant"
              v-show="projectsList != 'loading'"
              class="clickForDetails"
              v-on:click="
                $router.push({
                  name: 'ProjectDetails',
                  params: {
                    projectID: projectsList.filter(
                      (project) => project.name == item.ProjectName
                    )[0].id,
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
            >
              {{ item.Tenant.name }}
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
                v-if="
                  item.Providers.includes('Openstack') &&
                  computed_theme == 'daiteap'
                "
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
            <td>{{ item.CreatedAt | formatDate }}</td>
            <td v-if="computed_isBusinessAccountOwner" :title="item.Contact">
              {{ item.Contact }}
            </td>
            <td
              v-else
              :title="item.Contact"
              class="clickForDetails"
              v-on:click="showUserDetails(item.Contact)"
            >
              {{ item.Contact }}
            </td>
            <td style="max-width: none">
              <b-spinner
                v-if="item.Status == 'starting'"
                style="width: 1rem; height: 1rem"
                variant="success"
                class="mr-2"
              ></b-spinner
              ><b-spinner
                v-else-if="
                  item.Status == 'stopping' || item.Status == 'restarting'
                "
                style="width: 1rem; height: 1rem"
                variant="warning"
                class="mr-2"
              ></b-spinner
              ><b-spinner
                v-else-if="item.InstallStep == 100"
                style="width: 1rem; height: 1rem"
                variant="danger"
                class="mr-2"
              ></b-spinner
              ><b-spinner
                v-else-if="item.ResizeStep > 0 || item.InstallStep > 0"
                style="width: 1rem; height: 1rem"
                variant="info"
                class="mr-2"
              ></b-spinner>
              <i
                class="fas fa-exclamation-triangle waring-modal-icon"
                v-else-if="item.InstallStep == -100"
                style="cursor: pointer"
              ></i>
              {{ item.Status }}
            </td>
            <td>
              <div>
                <b-dropdown
                  right
                  size="sm"
                  class="dropDownMenuButton"
                  boundary="window"
                  no-caret
                >
                  <template #button-content>
                    <i
                      class="fa fa-ellipsis-v machineoperationsbutton"
                      aria-hidden="true"
                    ></i>
                  </template>

                  <b-dropdown-item @click="openEditPopup(item)">
                    <span>
                      <i class="fas fa-edit"></i>
                      Edit
                    </span>
                  </b-dropdown-item>

                  <b-dropdown-item
                    :disabled="
                      item.InstallStep > 0 ||
                      item.ResizeStep > 0 ||
                      item.status > 0
                    "
                    v-on:click="deleteClusterPopup(item)"
                  >
                    <span>
                      <i class="far fa-trash-alt"></i>
                      Delete
                    </span>
                  </b-dropdown-item>

                  <b-dropdown-item
                    v-if="computed_account_settings.enable_templates"
                    :disabled="item.InstallStep == 1 || item.ResizeStep > 0"
                    v-on:click="templateCluster(item.ID)"
                  >
                    <span>
                      <i class="fas fa-save"></i>
                      Template
                    </span>
                  </b-dropdown-item>
                </b-dropdown>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <GenericPopupWarning
      :modalId="'bv-modal-deletenodewarning'"
      :message="`Confirm deleting node: ${nodeForDeletion.name}`"
      @confirm="onNodeDeleteConfirmed"
    />
    <GenericPopupWarning
      :modalId="'bv-modal-deletecomputecluster'"
      :message="`Confirm deleting cluster: ${clusterToRemove.Name}`"
      @confirm="deleteCluster(clusterToRemove)"
    />
  </div>
</template>

<script>
import DetailsVirtualMachine from "@/components/platform/popup_modals/DetailsVirtualMachine";
import ConfirmDialog from "./../popup_modals/ConfirmDialog";
import GenericPopupWarning from "@/components/platform/popup_modals/GenericPopupWarning";
import SaveEnvironmentTemplate from "@/components/platform/popup_modals/SaveEnvironmentTemplate";
import TextPopup from "../popup_modals/TextPopup";
import SpecificUserInfo from "@/components/platform/popup_modals/SpecificUserInfo";
import EditClusterPopup from "@/components/platform/popup_modals/EditClusterPopup";

export default {
  name: "ComputeOverviewTable",
  components: {
    TextPopup,
    DetailsVirtualMachine,
    ConfirmDialog,
    GenericPopupWarning,
    SaveEnvironmentTemplate,
    SpecificUserInfo,
    EditClusterPopup,
  },
  props: {
    projectName: String,
    tenantID: String,
    showTenant: Boolean,
  },
  data() {
    return {
      loading: true,
      showConfirmDialog: false,
      textPopupParams: {
        heading: "Error",
        text: ""
      },
      confirmDialogParams: {
        requestBody: {},
        text: "",
        endpoint: "",
        successMessage: "",
        failureMessage: "",
        envName: "",
        envId: "",
        action: "",
      },
      confirmDialogModalId: "bv-modal-confirmdialogcompute",
      nodeForDeletion: {},
      machinesList: [],
      clustersList: [],
      shownItems: [],
      clusterToRemove: {},
      showDetailsVirtualMachine: false,
      selectedeColums: [
        "name",
        "project",
        "statusText",
        "type",
        "provider",
        "operating_system",
      ],
      fields: [],
      machineDetails: {},
      templateClusterId: "",
      showSaveEnvironmentTemplate: false,
      projectsList: [],
      showSpecificUserInfo: false,
      specificUserUsername: "",
      clusterToEdit: {},
      clusterToEditName: "",
      showEditClusterPopup: false,
    };
  },
  mounted() {
    this.getClustersList();

    this.interval = setInterval(() => {
      this.getClustersList();
      this.getProjectsList();
    }, 5000);

    window.intervals = [];
    window.intervals.push(this.interval);
  },
  methods: {
    async getProjectsList() {
      let projects;
      if (this.computed_isBusinessAccountOwner && this.tenantID) {
        projects = await this.getTenantProjects(this.tenantID);
      } else if (this.computed_isBusinessAccountOwner) {
        projects = await this.getAllPlatformProjects();
      } else {
        projects = await this.getProjects();
      }
      this.projectsList = projects;
    },
    showUserDetails(username) {
      this.specificUserUsername = username;
      this.showSpecificUserInfo = true;
    },
    hideUserDetails() {
      this.showSpecificUserInfo = false;
    },
    goToClusterDetails(item) {
      for (let i = 0; i < window.intervals.length; i++) {
        clearInterval(window.intervals[i]);
      }
      this.$router.push({
        name: "ComputeDetails",
        params: {
          clusterID: item.ID,
          detailPage: "overview",
        },
      });
    },
    openEditPopup(cluster) {
      this.clusterToEdit = cluster;
      this.clusterToEditName = cluster.Name;
      this.showEditClusterPopup = true;
      this.$nextTick(function () {
        this.$bvModal.show("bv-modal-editcluster");
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
    showModal(node){
      this.textPopupParams.heading = node.statusText.charAt(0).toUpperCase() + node.statusText.slice(1);
      this.textPopupParams.text = node.error_msg.replace(/(^[ \t]*\n)/gm, "");
      this.$bvModal.show("bv-modal-textpopup");
    },
    getClusterNodes(clusterId) {
      return this.machinesList.filter(
        (machine) => machine.clusterID === clusterId
      );
    },
    getCluster(clusterId) {
      return this.clustersList.find((cluster) => cluster.ID === clusterId);
    },
    deleteClusterPopup(item) {
      this.clusterToRemove = item;
      this.$bvModal.show("bv-modal-deletecomputecluster");
    },
    async deleteCluster() {
      this.$bvModal.hide("bv-modal-deletecomputecluster");

      await this.deleteClusterMain(this.clusterToRemove)
    },
    async onNodeDeleteConfirmed() {
      this.$bvModal.hide("bv-modal-deletenodewarning");

      let nodeID = this.nodeForDeletion.id;

      await this.removeComputeNode(nodeID)
    },
    deleteNodePopup(nodeForDeletion) {
      this.nodeForDeletion = nodeForDeletion;
      this.$bvModal.show("bv-modal-deletenodewarning");
    },
    async getClusterDetails(clusterID) {
      let cluster = await this.getClusterDetailsMain(clusterID);

      for (let i = 0; i < cluster.usersList.length; i++) {
        if (cluster.usersList[i].status == 0) {
          cluster.usersList[i].status = "active";
        } else if (cluster.usersList[i].status == 1) {
          cluster.usersList[i].status = "creating";
        } else if (
          cluster.usersList[i].status == -1 ||
          cluster.usersList[i].status == -2 ||
          cluster.usersList[i].status == -3
        ) {
          cluster.usersList[i].status = "error creating";
        } else if (cluster.usersList[i].status == 10) {
          cluster.usersList[i].status = "deleting";
        } else if (cluster.usersList[i].status == -10) {
          cluster.usersList[i].status = "error deleting";
        }
      }
      for (let i = 0; i < cluster.machinesList.length; i++) {
        cluster.machinesList[i].clusterID = clusterID;
        if (cluster.machinesList[i].operating_system != null) {
          cluster.machinesList[i].operating_system =
            cluster.machinesList[i].operating_system.split("/")[
              cluster.machinesList[i].operating_system.split("/").length - 1
            ];
        }

        cluster.machinesList[i].project = cluster.project_name;

        if (cluster.machinesList[i].status == 0) {
          cluster.machinesList[i].statusText = "running";
        } else if (cluster.machinesList[i].status == 1) {
          cluster.machinesList[i].statusText = "starting";
        } else if (cluster.machinesList[i].status == -1) {
          cluster.machinesList[i].statusText = "error starting";
        } else if (cluster.machinesList[i].status == 2) {
          cluster.machinesList[i].statusText = "stopping";
        } else if (cluster.machinesList[i].status == -2) {
          cluster.machinesList[i].statusText = "error stopping";
        } else if (cluster.machinesList[i].status == 3) {
          cluster.machinesList[i].statusText = "restarting";
        } else if (cluster.machinesList[i].status == -3) {
          cluster.machinesList[i].statusText = "error restarting";
        } else if (cluster.machinesList[i].status == 10) {
          cluster.machinesList[i].statusText = "stopped";
        } else if (cluster.machinesList[i].status == 4) {
          cluster.machinesList[i].statusText = "creating";
        } else if (cluster.machinesList[i].status == -4) {
          cluster.machinesList[i].statusText = "error creating";
        } else if (cluster.machinesList[i].status == 100) {
          cluster.machinesList[i].statusText = "Deleting...";
        } else if (cluster.machinesList[i].status == -100) {
          cluster.machinesList[i].statusText = "error deleting";
        }
      }

      return cluster.machinesList;
    },
    async getClustersList() {
      let self = this;

      let clusters;
        clusters = await this.getAllClusters();

      let allMachines = [];
      self.clustersList = [];

      clusters = clusters.filter(
        (cluster) => cluster.type == 2 || cluster.type == 6
      );

      if (this.projectName) {
        clusters = clusters.filter(
          (cluster) => cluster.project_name == this.projectName
        );
      }

      for (let i = 0; i < clusters.length; i++) {
        self.clustersList[i] = {
          Name: "",
          Status: "",
          ID: "",
        };
        self.clustersList[i].Name = clusters[i].name;
        self.clustersList[i].ID = clusters[i].id;
        self.clustersList[i].InstallStep = clusters[i].installstep;
        self.clustersList[i].Type = clusters[i].type;
        self.clustersList[i].Status = clusters[i].status;
        self.clustersList[i].Credentials = clusters[i].credentials;
        self.clustersList[i].CreatedAt = new Date(clusters[i].created_at);
        self.clustersList[i].Contact = clusters[i].contact;
        self.clustersList[i].ErrorMsgDelete = clusters[i].error_msg_delete;
        self.clustersList[i].ErrorMsg = clusters[i].error_msg;
        self.clustersList[i].ResizeStep = clusters[i].resizestep;
        self.clustersList[i].Providers = clusters[i].providers;
        self.clustersList[i].MachinesCount = clusters[i].machines_count;
        self.clustersList[i].ServicesCount = clusters[i].services_count;
        self.clustersList[i].UsersCount = clusters[i].users_count;
        self.clustersList[i].ProjectName = clusters[i].project_name;

        if (
          self.clustersList[i].InstallStep == 0 ||
          self.clustersList[i].InstallStep == undefined
        ) {
          if (
            self.clustersList[i].Status == 0 &&
            self.clustersList[i].InstallStep == undefined
          ) {
            self.clustersList[i].Status = "not created";
          } else if (self.clustersList[i].Status == 0) {
            self.clustersList[i].Status = "running";
          } else if (self.clustersList[i].Status == 1) {
            self.clustersList[i].Status = "starting";
          } else if (self.clustersList[i].Status == -1) {
            self.clustersList[i].Status = "error starting";
          } else if (self.clustersList[i].Status == 2) {
            self.clustersList[i].Status = "stopping";
          } else if (self.clustersList[i].Status == -2) {
            self.clustersList[i].Status = "error stopping";
          } else if (self.clustersList[i].Status == 3) {
            self.clustersList[i].Status = "restarting";
          } else if (self.clustersList[i].Status == -3) {
            self.clustersList[i].Status = "error restarting";
          } else if (self.clustersList[i].Status == 10) {
            self.clustersList[i].Status = "stopped";
          }
        } else if (self.clustersList[i].InstallStep == 100) {
          self.clustersList[i].Status = "Deleting...";
        } else if (self.clustersList[i].InstallStep < 0) {
          self.clustersList[i].Status = "error";
        } else {
          self.clustersList[i].Status = "loading";
        }
      }

      for (let i = 0; i < self.clustersList.length; i++) {
        if (self.projectName) {
          if (self.projectName != self.clustersList[i].ProjectName) {
            continue;
          }
        }

        let cluster_machines = await self.getClusterDetails(
          self.clustersList[i].ID
        );
        cluster_machines.forEach(addTenant);
        function addTenant(item) {
          item.tenant = self.clustersList[i].Tenant;
          let errorMsg = self.clustersList[i].ErrorMsg;

          try {
            item.error_msg = Buffer.from(
              JSON.parse(errorMsg).message,
              "base64"
            ).toString();
          } catch (e) {
            item.error_msg = errorMsg;
          }
        }

        allMachines = allMachines.concat(cluster_machines);
      }

      self.machinesList = allMachines;

      self.loading = false;
    },
    updateSelectedMachineDetails(machine) {
      this.machineDetails = machine;
      this.showDetailsVirtualMachine = true;
      this.$bvModal.show("bv-modal-detailsvirtualmachine");
    },
    resizeStatus(resizeStep, type) {
      let currentStatus = "";
      if (type == 1) {
        if (resizeStep >= 1 && resizeStep <= 3) {
          currentStatus = "Creating machines";
        }
        if (resizeStep >= 4 && resizeStep <= 10) {
          currentStatus = "Configuring machines";
        }
        if (resizeStep >= 11 && resizeStep <= 14) {
          currentStatus = "Adding machines to Kubernetes";
        }
        if (resizeStep == 0) {
          currentStatus = "";
        }
        if (resizeStep <= -1 && resizeStep >= -3) {
          currentStatus = "Creating machines error";
        }
        if (resizeStep <= -4 && resizeStep >= -10) {
          currentStatus = "Error configuring machines";
        }
        if (resizeStep <= -11 && resizeStep >= -14) {
          currentStatus = "Error adding machines to Kubernetes";
        }
      }
      if (type == 2 || type == 6) {
        if (resizeStep >= 1 && resizeStep <= 3) {
          currentStatus = "Creating machines";
        }
        if (resizeStep >= 4 && resizeStep <= 10) {
          currentStatus = "Configuring machines";
        }
        if (resizeStep == 0) {
          currentStatus = "";
        }
        if (resizeStep <= -1 && resizeStep >= -3) {
          currentStatus = "Creating machines error";
        }
        if (resizeStep <= -4 && resizeStep >= -10) {
          currentStatus = "Error configuring machines";
        }
      }
      return currentStatus;
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
            text: "Successfully submitted template creation request!",
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
              text: "Error while saving Template. " + error,
            });
          }
        });
    },
  },
  destroyed() {
    for (let i = 0; i < window.intervals.length; i++) {
      clearInterval(window.intervals[i]);
    }
    clearInterval(this.interval);
  },
};
</script>


<style scoped>
.fa-trash-alt, .fa-minus {
  color: red;
}
</style>