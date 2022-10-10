<template>
  <div class="row m-0 p-0">
    <DeleteManyDialog
      :deleteManyDialogParams="deleteManyDialogParams"
    ></DeleteManyDialog>
    <div class="col mt-5 w-100">
      <div class="container-fluid pr-0 mr-0">
        <ConfirmDialog
          v-show="showConfirmDialog"
          :confirmDialogParams="confirmDialogParams"
        ></ConfirmDialog>
        <DeleteDialog
          v-show="showDeleteDialog"
          :deleteDialogParams="deleteDialogParams"
        ></DeleteDialog>
        <QuotaExceededModal
          v-show="showQuotaExceeded"
          :exceededResources="exceededResources"
        ></QuotaExceededModal>

        <div
          v-if="
            $route.path ===
            '/app/platform/computedetails/' + clusterID + '/overview'
          "
          class=""
        >
          <h3>Cluster Details: {{ clusterName }}</h3>
          <h5>ID: {{ clusterID }}</h5>
          <!-- <h5>Description: {{ clusterDescription }}</h5> -->
          <br />
        </div>
        <br v-else />

        <br />

        <div
          v-if="
            $route.path ===
            '/app/platform/computedetails/' + clusterID + '/overview'
          "
          class="col w-100 m-0 p-0"
        >
          <div class="row">
            <div
              :class="[
                clusterType == 1 || clusterType == 3 || clusterType == 5
                  ? 'col-lg-12 col-md-12 col-s-12 m-0 p-0'
                  : 'col-lg-12 col-md-12 col-s-12 m-0 p-0',
              ]"
            >
              <div class="card mb-4" style="min-width: 15rem">
                <div class="card-header py-3 cardHeaderLight">
                  <h6 class="m-0 font-weight-bold">VMs:</h6>
                </div>
                <div class="card-body">
                  <div v-if="loading" class="d-flex justify-content-center">
                    <div class="spinner-border" role="status">
                      <span class="sr-only">Loading...</span>
                    </div>
                  </div>
                  <div v-else class="d-column align-self-center">
                    <h1 class="">
                      {{ cluster.machinesList.length }}
                    </h1>
                    <div>
                      <b-progress
                        class="mt-2"
                        :max="cluster.machinesList.length"
                        show-value
                      >
                        <b-progress-bar
                          :value="
                            cluster.machinesList.filter(
                              (el) => el.provider === 'alicloud'
                            ).length
                          "
                          :style="{ 'background-color': '#bcbcbc' }"
                          >Alicloud
                          {{
                            cluster.machinesList.filter(function (el) {
                              return el.provider === "alicloud";
                            }).length
                          }}</b-progress-bar
                        >
                        <b-progress-bar
                          :value="
                            cluster.machinesList.filter(function (el) {
                              return el.provider === 'aws';
                            }).length
                          "
                          :style="{ 'background-color': '#000000' }"
                          >AWS
                          {{
                            cluster.machinesList.filter(function (el) {
                              return el.provider === "aws";
                            }).length
                          }}</b-progress-bar
                        >
                        <b-progress-bar
                          :value="
                            cluster.machinesList.filter(function (el) {
                              return el.provider === 'azure';
                            }).length
                          "
                          :style="{ 'background-color': '#ea002f' }"
                          >Azure
                          {{
                            cluster.machinesList.filter(function (el) {
                              return el.provider === "azure";
                            }).length
                          }}</b-progress-bar
                        >
                        <b-progress-bar
                          :value="
                            cluster.machinesList.filter(function (el) {
                              return el.provider === 'google';
                            }).length
                          "
                          :style="{ 'background-color': '#a30082' }"
                          >Google
                          {{
                            cluster.machinesList.filter(function (el) {
                              return el.provider === "google";
                            }).length
                          }}</b-progress-bar
                        >
                        <b-progress-bar
                          :value="
                            cluster.machinesList.filter(function (el) {
                              return el.provider === 'onpremise';
                            }).length
                          "
                          variant="secondary"
                          >on-premise
                          {{
                            cluster.machinesList.filter(function (el) {
                              return el.provider === "onpremise";
                            }).length
                          }}</b-progress-bar
                        >
                        <b-progress-bar
                          :value="
                            cluster.machinesList.filter(function (el) {
                              return el.provider === 'iotarm';
                            }).length
                          "
                          :style="{ 'background-color': '#eaebed' }"
                          >IoT-ARM
                          {{
                            cluster.machinesList.filter(function (el) {
                              return el.provider === "iotarm";
                            }).length
                          }}</b-progress-bar
                        >
                      </b-progress>

                      <br />

                      <b-card-group deck>
                        <ProviderNodesCard
                          :providerLogo="
                            require('../../assets/img/aws_logo_small.png')
                          "
                          provider="aws"
                          :cluster="cluster"
                          :isCompute="true"
                        />
                        <ProviderNodesCard
                          :providerLogo="
                            require('../../assets/img/azure_logo_small.png')
                          "
                          provider="azure"
                          :cluster="cluster"
                          :isCompute="true"
                        />
                        <ProviderNodesCard
                          :providerLogo="
                            require('../../assets/img/googleCloud_logo_small.png')
                          "
                          provider="google"
                          :cluster="cluster"
                          :isCompute="true"
                        />
                        <ProviderNodesCard
                          v-if="computed_theme == 'daiteap'"
                          :providerLogo="
                            require('../../assets/img/openstack_logo_small.png')
                          "
                          provider="openstack"
                          :cluster="cluster"
                          :isCompute="true"
                        />
                        <ProviderNodesCard
                          :providerLogo="
                            require('../../assets/img/onpremise.svg')
                          "
                          provider="onpremise"
                          :cluster="cluster"
                          :isCompute="true"
                        />
                      </b-card-group>

                      <NodesTable
                        :machinesList="cluster.machinesList"
                        :isCompute="true"
                        :cluster="cluster"
                        :clusterID="clusterID"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <ClusterProviderAccounts
          v-if="
            $route.path ===
            '/app/platform/computedetails/' + clusterID + '/overview'
          "
          :accountsList="accountsList"
          :loading="loading"
        ></ClusterProviderAccounts>

        <OperationsTab v-if="!loading" :clusterID="clusterID" :cluster="cluster" />
        <br />
      </div>
    </div>
  </div>
</template>

<script>
import DeleteManyDialog from "@/components/platform/popup_modals/DeleteManyDialog";
import QuotaExceededModal from "@/components/platform/popup_modals/QuotaExceededModal";
import axios from "axios";
import ConfirmDialog from "./popup_modals/ConfirmDialog";
import DeleteDialog from "./popup_modals/DeleteDialog";
import ClusterProviderAccounts from "./clusterDetailsComponents/ClusterProviderAccounts";
import ProviderNodesCard from "./ProviderNodesCard";
import WarningAlert from "@/components/platform/WarningAlert";
import NodesTable from "@/components/platform/tables/NodesTable";
import OperationsTab from "@/components/platform/clusterDetailsComponents/OperationsTab";

export default {
  name: "ComputeDetails",
  data() {
    return {
      configurations: [],
      loadingServicesQuota: false,
      alert: {
        show: false,
        msg: "",
      },
      deleteManyDialogParams: {
        requestBody: {},
        text: "",
        endpoint: "",
      },
      kibanaPWCopied: false,
      grafanaPWCopied: false,
      loading: true,
      cluster: {},
      clusterType: 0,
      clusterName: "",
      clusterDescription: "",
      projectID: "",
      servicesListTable: [],
      loadingServices: true,
      clusterStatus: "",
      kubernetesVersion: "",
      kubernetesNetworkPlugin: "",
      kubernetesPodsSubnet: "",
      kubernetesServiceAddresses: "",
      upgradeAvailable: false,
      kubeUpgradeStatus: 0,
      errorMsg: undefined,
      loadBalancerIntegration: "",
      showClusterUserInfoModal: false,
      showAddClusterUser: false,
      showAddClusterMachines: false,
      showRenameCluster: false,
      showAddClusterAccount: false,
      showUpgradeKubernetesCluster: false,
      showUpgradeK3sCluster: false,
      showConfirmDialog: false,
      showQuotaExceeded: false,
      exceededResources: {},
      accountsList: [],
      providersWithoutAccounts: [],
      serviceStoreList: [],
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
      showDeleteDialog: false,
      deleteDialogParams: {
        requestBody: {},
        text: "",
        endpoint: "",
        successMessage: "",
        failureMessage: "",
        envName: "",
        envId: "",
      },
      clusterUserDetails: {
        username: "",
        first_name: "",
        last_name: "",
        type: "",
        status: "",
        public_ssh_key: "",
      },
    };
  },
  props: {
    clusterID: {
      type: String,
      required: true,
    },
  },
  components: {
    ProviderNodesCard,
    DeleteManyDialog,
    ConfirmDialog,
    DeleteDialog,
    QuotaExceededModal,
    ClusterProviderAccounts,
    WarningAlert,
    NodesTable,
    OperationsTab,
  },
  created() {
    if (this.clusterID == null) {
      this.$router.push({ name: "ProjectList" });
    }
    this.loading = true;

    this.getClusterDetails(this);
  },
  mounted() {
    let self = this;
    self.interval = setInterval(() => {
      self.getClusterDetails(self);
    }, 3000);

    window.intervals = [];
    window.intervals.push(self.interval);
  },
  methods: {
    async getUsersProjectsList(project_name) {
      let projects = await this.getProjects();

      this.projectsList = [];
      this.selectedProject = projects.filter(
        (el) => el.name === project_name
      )[0];
      this.projectID = this.selectedProject.id;
    },
    async getClusterDetails(currentObject) {
      let self = currentObject;
      let cluster = await this.getClusterDetailsMain(self.clusterID);
      self.cluster = cluster;

      self.getUsersProjectsList(self.cluster.project_name);

      let servicesList = [];

      for (let j = 0; j < self.cluster.serviceList.length; j++) {
        let connectionInfo = JSON.parse(
          self.cluster.serviceList[j].connection_info
        );

        if (!connectionInfo) {
          connectionInfo = {};
        }

        if (!connectionInfo.hasOwnProperty("addresses")) {
          connectionInfo["addresses"] = [];
        }

        servicesList.push({
          clusterId: self.clusterID,
          clusterName: self.cluster.title,
          projectID: self.projectID,
          name: self.cluster.serviceList[j].name,
          service__name: self.cluster.serviceList[j].service__name,
          service__accessible_from_browser:
            self.cluster.serviceList[j].service__accessible_from_browser,
          namespace: self.cluster.serviceList[j].namespace,
          providers: self.cluster.serviceList[j].providers,
          connectionInfo: connectionInfo,
          status: self.cluster.serviceList[j].status,
          service_type: self.cluster.serviceList[j].service_type,
        });
      }

      self.servicesListTable = servicesList.sort(function (a, b) {
        if (a.clusterName == b.clusterName) {
          if (a.name < b.name) {
            return -1;
          }
          if (a.name > b.name) {
            return 1;
          }
        }

        if (a.clusterName < b.clusterName) {
          return -1;
        }
        if (a.clusterName > b.clusterName) {
          return 1;
        }
      });

      self.loadingServices = false;

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
      self.clusterType = self.cluster.clusterType;
      self.providers = self.cluster.providers;
      self.clusterName = self.cluster.title;
      self.clusterDescription = self.cluster.description;
      self.clusterStatus = self.cluster.status;
      self.configurations = [];
      if (self.cluster.kubernetesConfiguration) {
        if (self.cluster.kubernetesConfiguration.version) {
          self.kubernetesVersion = self.cluster.kubernetesConfiguration.version;

          self.configurations.push({
            name: "Kubernetes Version",
            value: self.kubernetesVersion,
          });
        }
        if (self.cluster.kubernetesConfiguration.networkPlugin) {
          self.kubernetesNetworkPlugin =
            self.cluster.kubernetesConfiguration.networkPlugin;

          self.configurations.push({
            name: "Network Plugin",
            value: self.kubernetesNetworkPlugin,
          });
        }
        if (self.cluster.kubernetesConfiguration.podsSubnet) {
          self.kubernetesPodsSubnet =
            self.cluster.kubernetesConfiguration.podsSubnet;

          self.configurations.push({
            name: "Pod Network",
            value: self.kubernetesPodsSubnet,
          });
        }
        if (self.cluster.kubernetesConfiguration.serviceAddresses) {
          self.kubernetesServiceAddresses =
            self.cluster.kubernetesConfiguration.serviceAddresses;

          self.configurations.push({
            name: "Service Network",
            value: self.kubernetesServiceAddresses,
          });
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
        self.errorMsg = Buffer.from(cluster["errorMsg"], "base64").toString(
          "utf-8"
        );
      }
      if (self.accountsList.length == 0) {
        if (self.cluster.providers.alicloudSelected) {
          let account = self.cluster.providers.alicloud.account;
          let accountLabel = self.cluster.providers.alicloud.accountLabel;
          if (self.cluster.providers.alicloud.account.length < 1) {
            account = "---";
            self.providersWithoutAccounts.push("alicloud");
          }
          self.accountsList.push({
            provider: "alicloud",
            account: account,
            accountLabel: accountLabel,
          });
        }
        if (self.cluster.providers.openstackSelected) {
          let account = self.cluster.providers.openstack.account;
          let accountLabel = self.cluster.providers.openstack.accountLabel;
          if (self.cluster.providers.openstack.account.length < 1) {
            account = "---";
            self.providersWithoutAccounts.push("openstack");
          }
          self.accountsList.push({
            provider: "openstack",
            account: account,
            accountLabel: accountLabel,
          });
        }
        if (self.cluster.providers.awsSelected) {
          let account = self.cluster.providers.aws.account;
          let accountLabel = self.cluster.providers.aws.accountLabel;
          if (self.cluster.providers.aws.account.length < 1) {
            account = "---";
            self.providersWithoutAccounts.push("aws");
          }
          self.accountsList.push({
            provider: "aws",
            account: account,
            accountLabel: accountLabel,
          });
        }
        if (self.cluster.providers.azureSelected) {
          let account = self.cluster.providers.azure.account;
          let accountLabel = self.cluster.providers.azure.accountLabel;
          if (self.cluster.providers.azure.account.length < 1) {
            account = "---";
            self.providersWithoutAccounts.push("azure");
          }
          self.accountsList.push({
            provider: "azure",
            account: account,
            accountLabel: accountLabel,
          });
        }
        if (self.cluster.providers.googleSelected) {
          let account = self.cluster.providers.google.account;
          let accountLabel = self.cluster.providers.google.accountLabel;
          if (self.cluster.providers.google.account.length < 1) {
            account = "---";
            self.providersWithoutAccounts.push("google");
          }
          self.accountsList.push({
            provider: "google",
            account: account,
            accountLabel: accountLabel,
          });
        }
        if (self.cluster.providers.onpremiseSelected) {
          let account = self.cluster.providers.onpremise.account;
          let accountLabel = self.cluster.providers.onpremise.accountLabel;
          if (self.cluster.providers.onpremise.account.length < 1) {
            account = "---";
            self.providersWithoutAccounts.push("onpremise");
          }
          self.accountsList.push({
            provider: "On-premise network",
            account: account,
            accountLabel: accountLabel,
          });
        }
        if (self.cluster.providers.iotarmSelected) {
          let account = self.cluster.providers.iotarm.account;
          let accountLabel = self.cluster.providers.iotarm.accountLabel;
          if (self.cluster.providers.iotarm.account.length < 1) {
            account = "---";
            self.providersWithoutAccounts.push("iotarm");
          }
          self.accountsList.push({
            provider: "IoT-ARM",
            account: account,
            accountLabel: accountLabel,
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
    },
    addIntervalToWindowIntervals(interval) {
      window.intervals.push(interval);
    },
    setExceededResources(resources) {
      this.exceededResources = resources;
      this.showQuotaExceeded = true;
      this.$bvModal.show("bv-modal-quotaexceeded");
    },
  },
  destroyed() {
    for (let i = 0; i < window.intervals.length; i++) {
      clearInterval(window.intervals[i]);
    }
    clearInterval(this.interval);

    this.$root.$emit("updateClusterDetails", undefined);
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

.fa-user-plus {
  color: #000;
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
* {
  white-space: inherit;
}

.row {
  display: flex;
  width: 100%;
  align-items: stretch;
}
.sidebar {
  position: fixed;
  padding-left: 1rem;
  margin-left: 1rem;
  top: 5rem;
  z-index: 1;
}
.linkToMenu {
  cursor: pointer;
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
</style>
