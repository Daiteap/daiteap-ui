<template>
  <div>
    <DeleteManyDialog :deleteManyDialogParams="deleteManyDialogParams"></DeleteManyDialog>
    <SpecificUserInfo 
      v-if="showSpecificUserInfo"
      :username="specificUserUsername"
      @hideUserDetails="hideUserDetails"
    />
    <div
      v-if="!selectedProject.name"
      style="margin-top: 6rem"
      class="d-flex justify-content-center"
    >
      <div class="spinner-border" role="status">
        <span class="sr-only">Loading...</span>
      </div>
    </div>
    <div v-else class="card daiteap-content-card">
      <div>
        <CardTitle :title="`Project Overview - ${selectedProject.name}`" />
      </div>
      <div>
        <hr />
        <WarningAlert
          v-for="alertMessage in alertMessages"
          :key="alertMessage"
          color="warning"
          :closeOption="false"
        >
          <div v-html="alertMessage"></div>
        </WarningAlert>
        <br />
        <b-container fluid class="mx-0 px-0">
          <b-row>
            <b-col lg="8" md="6" sm="4" class="my-auto">
              <h5 class="pl-3 my-auto daiteap-title-left-bar">
                Kubernetes Clusters
              </h5>
            </b-col>
            <b-col lg="2" md="3" sm="4" class="my-auto text-right">
              <div v-if="clustersList.length > 0">
                Delete All
                <span
                  v-on:click.stop="deleteAllKubernetesClusters()"
                  class="btn btn-sm"
                  data-toggle="tooltip"
                  data-placement="bottom"
                  title="Delete all Kubernetes Clusters"
                >
                  <i class="fas fa-minus-circle" style="font-size: 1.8rem"></i>
                </span>
              </div>
            </b-col>
            <b-col lg="2" md="3" sm="4" class="my-auto text-right">
              <AddButton text='Add Cluster' @onClickAddButton="loadingAddCluster ? '' : goToCreateCluster()" :class="{ disabled: allAccounts == 'loading' || loadingAddCluster }" />
            </b-col>
          </b-row>
        </b-container>

        <br />

        <br />
        <br />
        <div>
          <div v-if="loadingClusters" class="d-flex justify-content-center">
            <div class="spinner-border" role="status">
              <span class="sr-only">Loading...</span>
            </div>
          </div>
          <div v-else-if="clustersList.length > 0">
            <KubernetesClustersTable
              :clustersList="clustersList"
              :projectsList="projectsList"
              @showUserDetails="showUserDetails"
              :showProject="false"
            />
          </div>
          <div v-else>
            <h6 class="text-secondary">
              <i class="fas fa-angle-double-right mr-2" />No Kubernetes Clusters
              assigned
            </h6>
          </div>
        </div>
        <br />

        <div v-if="computed_account_settings.enable_compute">
          <hr />
          <br />
          <div>
            <b-container fluid class="mx-0 px-0">
              <b-row>
                <b-col lg="8" md="6" sm="4" class="my-auto">
                  <h5 class="pl-3 my-auto daiteap-title-left-bar">
                    Compute (VMs)
                  </h5>
                </b-col>
                <b-col lg="2" md="3" sm="4" class="my-auto text-right">
                  <div v-if="vmsClusters.length > 0">
                    Delete All
                    <span
                      v-on:click.stop="deleteAllVms()"
                      class="btn btn-sm"
                      data-toggle="tooltip"
                      data-placement="bottom"
                      title="Delete all Compute (VM)"
                    >
                      <i
                        class="fas fa-minus-circle"
                        style="font-size: 1.8rem"
                      ></i>
                    </span>
                  </div>
                </b-col>
                <b-col lg="2" md="3" sm="4" class="my-auto text-right">
                  <AddButton text='Add Compute (VM)' @onClickAddButton="
                      $router.push({
                        name: 'CreateVMs',
                        params: {
                          projectID: projectID,
                        },
                      })
                    " />
                </b-col>
              </b-row>
            </b-container>
          </div>
          <br />
          <br />
          <div>
            <div v-if="loadingClusters" class="d-flex justify-content-center">
              <div class="spinner-border" role="status">
                <span class="sr-only">Loading...</span>
              </div>
            </div>
            <div v-else>
              <ComputeOverviewTable :projectName="selectedProject.name" />
            </div>
          </div>
          <br />
        </div>

        <br />
        <hr />
        <br />

        <StorageOverall :projectID="projectID" />

        <br />
        <hr />

        <br />
        <br />
        <b-container fluid class="mx-0 px-0">
          <b-row>
            <b-col lg="8" md="6" sm="4" class="my-auto">
              <h5 class="pl-3 my-auto daiteap-title-left-bar">Users</h5>
            </b-col>
            <b-col lg="2" md="3" sm="4" class="my-auto text-right">
              <div v-if="users.length > 1">
                Remove All
                <span
                  v-on:click.stop="deleteAllUsers()"
                  class="btn btn-sm"
                  data-toggle="tooltip"
                  data-placement="bottom"
                  title="Remove all users"
                >
                  <i class="fas fa-minus-circle" style="font-size: 1.8rem"></i>
                </span>
              </div>
            </b-col>
            <b-col lg="2" md="3" sm="4" class="my-auto text-right">
              <AddButton text='Add User' @onClickAddButton="addUserToProject()" />
            </b-col>
          </b-row>
        </b-container>
        <br />
        <br />

        <UsersListTable
          class="mt-4"
          :users="users"
          @removeUser="removeUser"
          :showdelete="true"
          :showEdit="false"
          @showUserDetails="showUserDetails"
        />
        <GenericPopupWarning
          :modalId="'deleteUserWarning'"
          :message="`Confirm removing ${removeUsername}`"
          @confirm="onUserDeleteConfirmed"
        />
      </div>
    </div>
  </div>
</template>

<script>
import CardTitle from "@/components/platform/CardTitle";
import KubernetesClustersTable from "@/components/platform/tables/KubernetesClustersTable";
import ComputeOverviewTable from "@/components/platform/tables/ComputeOverviewTable";
import DeleteManyDialog from "@/components/platform/popup_modals/DeleteManyDialog";
import SpecificUserInfo from "./popup_modals/SpecificUserInfo";
import axios from "axios";
import UsersListTable from "@/components/platform/tables/UsersListTable";
import GenericPopupWarning from "@/components/platform/popup_modals/GenericPopupWarning";
import WarningAlert from "@/components/platform/WarningAlert";
import AddButton from "@/components/platform/AddButton";
import StorageOverall from "@/components/platform/StorageOverall";

export default {
  name: "ProjectDetails",
  components: {
    CardTitle,
    KubernetesClustersTable,
    ComputeOverviewTable,
    UsersListTable,
    GenericPopupWarning,
    DeleteManyDialog,
    WarningAlert,
    AddButton,
    SpecificUserInfo,
    StorageOverall,
  },
  data() {
    return {
      loadingAddCluster: false,
      vmsClusters: [],
      loadingClusters: true,
      loadingUsers: true,
      loadingProject: true,
      clustersList: [],
      environmentNamesList: [],
      selectedProject: { name: "" },
      clusterFailureStatus: `error`,
      clusterLoadingStatus: `installing...`,
      clusterDeletingStatus: `deleting...`,
      users: [],
      removeUsername: "",
      deleteManyDialogParams: {
        requestBody: {},
        text: "",
        endpoint: "",
      },
      alertMessages: [],
      allAccounts: "loading",
      projectsList: [],
      specificUserUsername: "",
      showSpecificUserInfo: false
    };
  },
  methods: {
    showUserDetails(username) {
      this.specificUserUsername = username;
      this.showSpecificUserInfo = true;
    },
    hideUserDetails() {
      this.showSpecificUserInfo = false;
    },
    goToCreateCluster() {
      this.alertMessages = [];
      let self = this;

      self.loadingAddCluster = true;

      this.getUserQuota().then((quota) => {
        if (
          quota["available_kubernetes_cluster_environments"] < 1 ||
          quota["available_nodes"] < 1
        ) {
          self.alertMessages.push(
            'User quota exceeded. For more information, <a href="/documentation/users/#user-resource-quotas">check the documentation</a>.'
          );
        }

        if (this.allAccounts != "loading" && this.allAccounts.length == 0) {
          this.alertMessages.push(
            'No valid cloud credentials provided. To create a Kubernetes Cluster you need to provide valid cloud credentials from <a href="/#/app/platform/CloudProfile">here</a>.'
          );
        }
        if (this.alertMessages.length == 0 && this.allAccounts != "loading") {
          this.$router.push({
            name: "CreateCluster",
            params: {
              projectID: this.projectID,
            },
          });
        }
        self.loadingAddCluster = false;
      });
    },
    async getCloudCredentials() {
      let credentials = await this.getCredentials();

      this.allAccounts = credentials.filter(
        (account) => account.valid == true
      );
    },
    addUserToProject() {
      this.$router.push({
        name: "AddNewProjectUser",
        params: {
          projectID: this.projectID,
        },
      });
    },
    onUserDeleteConfirmed() {
      this.$bvModal.hide("deleteUserWarning");
      let self = this;
      axios
        .delete(
          "/server/tenants/" +
            self.computed_active_tenant_id +
            "/projects/" +
            self.projectID +
            "/users/" +
            self.removeUsername,
          this.get_axiosConfig()
        )
        .then(function () {
          self.getUsersList();
        })
        .catch(function (error) {
          console.error("Error on get_project_userlist occurred.");
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
    removeUser(user) {
      this.$bvModal.show("deleteUserWarning");
      this.removeUsername = user.username;
    },
    deleteAllKubernetesClusters() {
      this.deleteManyDialogParams.endpoint = [];
      for (let i = 0; i < this.clustersList.length; i++) {
        this.deleteManyDialogParams.endpoint.push(
          "/server/tenants/" +
          this.computed_active_tenant_id +
          "/clusters/" +
          this.clustersList[i].ID +
          "/delete"
        );
      }
      this.deleteManyDialogParams.text =
        "Are you sure you want to delete all Kubernetes Clusters";

      this.$bvModal.show("bv-modal-deletemanydialog");
    },
    deleteAllUsers() {
      this.deleteManyDialogParams.endpoint = [];
      for (let i = 0; i < this.users.length; i++) {
        if (this.users[i].role != "Owner") {
          this.deleteManyDialogParams.endpoint.push(
            "/server/tenants/" +
              this.computed_active_tenant_id +
              "/projects/" +
              this.projectID +
              "/users/" +
              this.users[i].username
          );
        }
      }
      this.deleteManyDialogParams.text = "Are you sure you want to remove all users";

      this.$bvModal.show("bv-modal-deletemanydialog");
    },
    deleteAllVms() {
      let self = this;
      this.deleteManyDialogParams.endpoint = [];
      for (let i = 0; i < self.vmsClusters.length; i++) {
        if (self.vmsClusters[i].type == 2 || self.vmsClusters[i].type == 6) {
          this.deleteManyDialogParams.endpoint.push(
            "/server/tenants/" +
            this.computed_active_tenant_id +
            "/clusters/" +
            self.vmsClusters[i].id +
            "/delete"
          );
        }
      }

      this.deleteManyDialogParams.text =
        "Are you sure you want to delete all Compute (VMs)";

      this.$bvModal.show("bv-modal-deletemanydialog");
    },
    getUsersList() {
      let self = this;
      axios
        .get(
          "/server/tenants/" +
            self.computed_active_tenant_id +
            "/projects/" +
            self.projectID +
            "/users",
          this.get_axiosConfig()
        )
        .then(function (response) {
          self.users = response.data.users_list;
          self.loadingUsers = false;
        })
        .catch(function (error) {
          self.loadingUsers = false;
          console.error("Error on get_project_userlist occurred.");
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
    goToAddNewProject(item) {
      for (let i = 0; i < window.intervals.length; i++) {
        clearInterval(window.intervals[i]);
      }
      this.$router.push({
        name: "AddNewProject",
        params: {
          clusterParams: item,
        },
      });
    },
    async getUsersProjectsList(currentObject) {
      let self = currentObject;

      let projects;
      projects = await self.getProjects();

      self.projectsList = [];
      self.selectedProject = projects.filter(
        (el) => el.id === self.projectID
      )[0];
      self.loadingProject = false;
      self.getUsersClustersList(self);
    },
    async getUsersClustersList(currentObject) {
      let self = currentObject;
      let clusters = await this.getAllClusters();

      self.clustersList = [];

      if (self.selectedProject.name) {
        let kubernetesClusters = clusters.filter(
          (el) =>
            (el.type == 1 || el.type == 3 || el.type == 5 || el.type == 7) &&
            el.project_name == self.selectedProject.name
        );

        self.vmsClusters = clusters.filter(
          (el) =>
            (el.type == 2 || el.type == 6) &&
            el.project_name == self.selectedProject.name
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
          if (
            kubernetesClusters[i].installstep >= 0 &&
            kubernetesClusters[i].canceled == true
          ) {
            self.clustersList[i].InstallStep = 100;
          }
          self.clustersList[i].ResizeStep = kubernetesClusters[i].resizestep;
          self.clustersList[i].Type = kubernetesClusters[i].type;
          self.clustersList[i].Status = kubernetesClusters[i].status;
          self.clustersList[i].Credentials = kubernetesClusters[i].credentials;
          self.clustersList[i].CreatedAt = new Date(
            kubernetesClusters[i].created_at
          );
          self.clustersList[i].ErrorMsgDelete =
            kubernetesClusters[i].error_msg_delete;
          self.clustersList[i].Providers = "";
          if (kubernetesClusters[i].providers != null) {
            try {
              let clusterProviders = JSON.parse(
                kubernetesClusters[i].providers
              );
              for (let y = 0; y < clusterProviders.length; y++) {
                self.clustersList[i].Providers += clusterProviders[y] + ", ";
              }
              self.clustersList[i].Providers = self.clustersList[
                i
              ].Providers.substring(
                0,
                self.clustersList[i].Providers.length - 2
              );
            } catch (error) {
              console.log(error);
            }
          }
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
            self.clustersList[i].Status = self.clusterDeletingStatus;
          } else if (self.clustersList[i].InstallStep < 0) {
            self.clustersList[i].Status = self.clusterFailureStatus;
          } else {
            self.clustersList[i].Status = self.clusterLoadingStatus;
          }
          self.environmentNamesList[i] = kubernetesClusters[i].name;
        }

        self.clustersList.sort(function (a, b) {
          return a.CreatedAt - b.CreatedAt;
        });

        let options = {
          year: "numeric",
          month: "numeric",
          day: "numeric",
          hour: "numeric",
          minute: "numeric",
        };
        for (let i = 0; i < self.clustersList.length; i++) {
          self.clustersList[i].CreatedAt = self.clustersList[
            i
          ].CreatedAt.toLocaleString("en-US", options);
        }

        self.loadingClusters = false;
      }
    },
  },
  created() {
    this.getUsersProjectsList(this);
    this.getUsersList();
  },
  mounted() {
    let self = this;
    self.getCloudCredentials();

    self.interval = setInterval(() => {
      self.getUsersProjectsList(this);
    }, 20000);

    self.interval = setInterval(() => {
      self.getUsersList();
    }, 5000);

    window.intervals = [];
    window.intervals.push(self.interval);
  },
  destroyed() {
    for (let i = 0; i < window.intervals.length; i++) {
      clearInterval(window.intervals[i]);
    }
    clearInterval(this.interval);
  },
  props: {
    projectID: {
      type: String,
      required: true,
    },
    tenantID: String,
  },
};
</script>