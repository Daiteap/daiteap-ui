<template>
  <div>
    <div class="card daiteap-content-card">
      <div class="d-flex justify-content-between cardHeaderLight">
        <span class="fa-stack landing-page-icon">
          <i class="fas fa-square fa-stack-2x" style="line-height: 1.5;"></i>
          <i class="fas fa-server fas fa-stack-1x fa-inverse" style="line-height: 3;"></i>
        </span>
        <CardTitle title="Kubernetes Clusters" style="line-height: 2;" />
        <span class="text-right h4 ml-auto">
          <span class="sr-only">Loading...</span>
          <AddButton text='Add Kubernetes Cluster' @onClickAddButton="loadingAddCluster ? '' : goToCreateCluster()" :class="{
              disabled: allAccounts == 'loading' || projectsList == 'loading' || loadingAddCluster,
            }"/>
        </span>
      </div>

      <WarningAlert
        v-for="alertMassage in alertMessages"
        :key="alertMassage"
        color="warning"
        :closeOption="false"
      >
        <div v-html="alertMassage"></div>
      </WarningAlert>

      <SpecificUserInfo 
        v-if="showSpecificUserInfo"
        :username="specificUserUsername"
        @hideUserDetails="hideUserDetails"
      />

      <div>
        <br />
        Below you find your list of currently deployed Kubernetes Clusters.
        Click on the Cluster name to get more details.
        <br />
      </div>
      <hr />
      <div class="my-3">
        <div v-if="loading" class="d-flex justify-content-center">
          <div class="spinner-border" role="status">
            <span class="sr-only">Loading...</span>
          </div>
        </div>
        <div v-else-if="clustersList.length > 0">
          <KubernetesClustersTable 
            :clustersList="clustersList" 
            :projectsList="projectsList" 
            @showUserDetails="showUserDetails"
            :showTenant="false"
          />
        </div>
        <div v-else>
          <div>
            No kubernetes clusters available - please add a Kubernetes Cluster.
          </div>
        </div>
      </div>
      <div v-if="!loading" class="d-flex justify-content-center"></div>
      <br />
    </div>
  </div>
</template>

<script>
import KubernetesClustersTable from "@/components/platform/tables/KubernetesClustersTable";
import CardTitle from "@/components/platform/CardTitle";
import WarningAlert from "@/components/platform/WarningAlert";
import SpecificUserInfo from "./popup_modals/SpecificUserInfo";
import AddButton from "@/components/platform/AddButton"

export default {
  name: "KubernetesClusterList",
  data() {
    return {
      exceededResources: {},
      alertMessages: [],
      loadingAddCluster: false,
      projectsList: "loading",
      allAccounts: "loading",
      interval: "",
      loading: false,
      clustersList: [],
      clusterFailureStatus: `error`,
      clusterLoadingStatus: `installing...`,
      clusterDeletingStatus: `deleting...`,
      specificUserUsername: "",
      showSpecificUserInfo: false
    };
  },
  components: {
    KubernetesClustersTable,
    CardTitle,
    WarningAlert,
    AddButton,
    SpecificUserInfo
  },
  props: {
    tenantID: String,
  },
  created() {
    this.loading = true;

    this.getUsersClustersList(this);
  },
  mounted() {
    let self = this;
    self.getUsersProjectsList();
    self.getCloudCredentials();

    self.interval = setInterval(() => {
      self.getUsersClustersList(self);
    }, 1000);

    window.intervals = [];
    window.intervals.push(self.interval);
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

        if (this.projectsList != "loading" && this.projectsList.length == 0) {
          this.alertMessages.push(
            `No projects defined. Before you can create a Kubernetes Cluster you need to create a project from <a href="/#/app/platform/ProjectList">here</a>.`
          );
        }

        if (
          this.alertMessages.length == 0 &&
          this.projectsList != "loading" &&
          this.allAccounts != "loading"
        ) {
          this.$router.push("createcluster");
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
    async getUsersProjectsList() {
      this.projectsList = await this.getProjects();
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
    async getUsersClustersList(currentObject) {
      let self = currentObject;
      let clusters;
        clusters = await this.getAllClusters();

      self.clustersList = [];
      let kubernetesClusters = clusters.filter(
        (el) =>
          el.type == 1 ||
          el.type == 3 ||
          el.type == 5 ||
          el.type == 7 ||
          el.type == 8
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
        self.clustersList[i].CreatedAt = new Date(
          kubernetesClusters[i].created_at
        );
        self.clustersList[i].ErrorMsgDelete =
          kubernetesClusters[i].error_msg_delete;
        self.clustersList[i].Providers = "";
        if (kubernetesClusters[i].providers != null) {
          try {
            self.clustersList[i].providersArray =
              kubernetesClusters[i].providers;
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

      self.loading = false;
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
  },
  destroyed() {
    for (let i = 0; i < window.intervals.length; i++) {
      clearInterval(window.intervals[i]);
    }
    clearInterval(this.interval);
  },
};
</script>
