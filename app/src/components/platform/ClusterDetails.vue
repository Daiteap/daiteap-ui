<template>
  <div class="row m-0 p-0">
    <DeleteManyDialog :deleteManyDialogParams="deleteManyDialogParams"></DeleteManyDialog>
    <div class="col mt-5 w-100">
      <div class="container-fluid pr-0 mr-0">
        <AddClusterUser
          v-show="showAddClusterUser"
          @exceededResources="setExceededResources"
          :clusterType="clusterType"
          :clusterID="clusterID"
        ></AddClusterUser>
        <ClusterUserInfoModal
          v-show="showClusterUserInfoModal"
          :clusterUserDetails="clusterUserDetails"
        ></ClusterUserInfoModal>
        <AddClusterAccount
          v-show="showAddClusterAccount"
          :clusterID="clusterID"
          :providersWithoutAccounts="providersWithoutAccounts"
        ></AddClusterAccount>
        <UpgradeKubernetesCluster
          v-show="showUpgradeKubernetesCluster"
          v-if="clusterType == 1"
          :kubeUpgradeStatus="kubeUpgradeStatus"
          :errorMsg="errorMsg"
          :clusterID="clusterID"
          @upgradeAvailable="setUpgradeAvailable"
          @changeKubeUpgradeStatus="changeKubeUpgradeStatus"
        ></UpgradeKubernetesCluster>
        <UpgradeK3sCluster
          v-show="showUpgradeK3sCluster"
          v-if="clusterType == 3"
          :kubeUpgradeStatus="kubeUpgradeStatus"
          :errorMsg="errorMsg"
          :clusterID="clusterID"
          @upgradeAvailable="setUpgradeAvailable"
          @changeKubeUpgradeStatus="changeKubeUpgradeStatus"
        ></UpgradeK3sCluster>
        <AddClusterMachines
          ref="addMachineComponent"
          v-show="showAddClusterMachines"
          :cluster="cluster"
          :clusterType="clusterType"
          :clusterID="clusterID"
          @exceededResources="setExceededResources"
        ></AddClusterMachines>
        <RenameCluster
          ref="renameClusterComponent"
          v-show="showRenameCluster"
          :clusterID="clusterID"
        ></RenameCluster>
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
            '/app/platform/clusterdetails/' + clusterID + '/overview'
          "
          class=""
        >
          <h3>Cluster Details: {{ clusterName }}</h3>
          <h5>ID: {{ clusterID }}</h5>
          <h5>Description: {{ clusterDescription }}</h5>
          <br />
        </div>
        <br v-else />

        <br />

        <div
          v-if="
            clusterType != 5 &&
            $route.path ===
              '/app/platform/clusterdetails/' + clusterID + '/overview'
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
                  <h6 class="m-0 font-weight-bold">Nodes:</h6>
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
                        />
                        <ProviderNodesCard
                          :providerLogo="
                            require('../../assets/img/azure_logo_small.png')
                          "
                          provider="azure"
                          :cluster="cluster"
                        />
                        <ProviderNodesCard
                          :providerLogo="
                            require('../../assets/img/googleCloud_logo_small.png')
                          "
                          provider="google"
                          :cluster="cluster"
                        />
                        <ProviderNodesCard
                          v-if="computed_theme == 'daiteap'"
                          :providerLogo="
                            require('../../assets/img/openstack_logo_small.png')
                          "
                          provider="openstack"
                          :cluster="cluster"
                        />
                        <ProviderNodesCard
                          :providerLogo="
                            require('../../assets/img/onpremise.svg')
                          "
                          provider="onpremise"
                          :cluster="cluster"
                        />
                      </b-card-group>

                      <NodesTable :machinesList="cluster.machinesList" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="row">
          <div class="card mb-4 w-100">
            <div class="card-header py-3 cardHeaderLight">
              <h6 class="m-0 font-weight-bold">Configurations:</h6>
            </div>
            <div class="card-body">
              <div class="table-responsive">
                <table
                  class="table table-bordered"
                  id="dataTable"
                  width="100%"
                  cellspacing="0"
                >
                  <thead>
                    <tr>
                      <th>Configuration</th>
                      <th>Parameter Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(configuration, index) in configurations" :key="index">
                      <td class="node-name col-2">
                        {{ configuration.name }}
                      </td>
                      <td class="node-name col-2">
                        {{ configuration.value }}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <br />
        </div>

        <ClusterStorage
          :clusterID="clusterID"
          :cluster="cluster"
          v-if="
            !!clusterType && 
            clusterType != 8 && 
            $route.path ===
            '/app/platform/clusterdetails/' + clusterID + '/overview'
          "
        ></ClusterStorage>

        <div
          v-if="
            $route.path ===
            '/app/platform/clusterdetails/' + clusterID + '/overview'
          "
          class="col w-100 m-0 p-0"
        >
          <!-- <div class="row">
            <b-container fluid class="mx-0 px-0">
              <b-row>
                <b-col lg="8" md="6" sm="4" class="my-auto">
                  <h5 class="pl-3 my-auto daiteap-title-left-bar">Services</h5>
                </b-col> -->

          <div class="row">
            <WarningAlert
              class="w-100"
              color="warning"
              :closeOption="false"
              v-if="alert.show"
            >
              <div v-html="alert.msg"></div>
            </WarningAlert>
            <div class="card mb-4 w-100">
              <div class="card-header py-3 cardHeaderLight">
                <div class="d-flex">
                  <h6 class="m-0 font-weight-bold my-auto">Services</h6>
                  <div lg="2" md="3" sm="4" class="my-auto ml-auto text-right">
                    <div v-if="servicesListTable.length > 0">
                      Delete All
                      <span
                        v-on:click.stop="deleteAllServices()"
                        class="btn btn-sm"
                        data-toggle="tooltip"
                        data-placement="bottom"
                        title="Delete all Services"
                      >
                        <i
                          class="fas fa-minus-circle"
                          style="font-size: 1.8rem"
                        ></i>
                      </span>
                    </div>
                  </div>
                  <div lg="2" md="3" sm="4" class="my-auto text-right">
                    <AddButton text='Add Service' @onClickAddButton="loadingServicesQuota ? '' : goToAddService()" :class="{ disabled: loadingServicesQuota }" />
                  </div>
                </div>
              </div>

              <div class="card-body">
                <div
                  v-if="loadingServices"
                  class="d-flex justify-content-center"
                >
                  <div class="spinner-border" role="status"></div>
                </div>
                <div v-else-if="servicesListTable.length > 0">
                  <ServicesTable :servicesList="servicesListTable" />
                </div>
                <div v-else>
                  <h6 class="text-secondary">
                    <br />
                    <i class="fas fa-angle-double-right mr-2" />No installed
                    services
                  </h6>
                </div>
              </div>
            </div>
          </div>
        </div>

        <ClusterKubernetesIntegration
          v-if="
            $route.path ===
            '/app/platform/clusterdetails/' + clusterID + '/overview'
          "
          @upgradeKubernetesCluster="upgradeKubernetesCluster"
          @upgradeK3sCluster="upgradeK3sCluster"
          :loading="loading"
          :kubernetesVersion="kubernetesVersion"
          :upgradeAvailable="upgradeAvailable"
          :clusterType="clusterType"
          :kubeUpgradeStatus="kubeUpgradeStatus"
          :kubernetesNetworkPlugin="kubernetesNetworkPlugin"
          :kubernetesPodsSubnet="kubernetesPodsSubnet"
          :kubernetesServiceAddresses="kubernetesServiceAddresses"
          :loadBalancerIntegration="loadBalancerIntegration"
        ></ClusterKubernetesIntegration>

        <div v-if="clusterType != 5 && clusterType != 8">
          <!-- <ClusterKibana
            v-if="
              $route.path ===
              '/app/platform/clusterdetails/' + clusterID + '/overview'
            "
            :clusterType="clusterType"
            :cluster="cluster"
            :loading="loading"
            :kibanaPWCopied="kibanaPWCopied"
            @copyESPassword="copyESPassword"
          ></ClusterKibana> -->

          <ClusterGrafana
            v-if="
              $route.path ===
              '/app/platform/clusterdetails/' + clusterID + '/overview'
            "
            :cluster="cluster"
            :loading="loading"
            :grafanaPWCopied="grafanaPWCopied"
            @copyGrafanaPassword="copyGrafanaPassword"
          ></ClusterGrafana>
        </div>

        <ClusterProviderAccounts
          v-if="
            $route.path ===
            '/app/platform/clusterdetails/' + clusterID + '/overview'
          "
          :accountsList="accountsList"
          :loading="loading"
          @addAccountToCluster="addAccountToCluster"
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
import AddClusterUser from "./popup_modals/AddClusterUser";
import ClusterUserInfoModal from "./popup_modals/ClusterUserInfoModal";
import AddClusterAccount from "./popup_modals/AddClusterAccount";
import UpgradeKubernetesCluster from "./popup_modals/UpgradeKubernetesCluster";
import UpgradeK3sCluster from "./popup_modals/UpgradeK3sCluster";
import AddClusterMachines from "./popup_modals/AddMachinesToVMs";
import RenameCluster from "./popup_modals/RenameCluster";
import ConfirmDialog from "./popup_modals/ConfirmDialog";
import DeleteDialog from "./popup_modals/DeleteDialog";
import ClusterGrafana from "./clusterDetailsComponents/ClusterGrafana";
import ClusterKubernetesIntegration from "./clusterDetailsComponents/ClusterKubernetesIntegration";
import ServicesTable from "@/components/platform/tables/ServicesTable";
// import ClusterKibana from "./clusterDetailsComponents/ClusterKibana";
import ClusterProviderAccounts from "./clusterDetailsComponents/ClusterProviderAccounts";
import ClusterStorage from "./tables/ClusterStorage";
import ProviderNodesCard from "./ProviderNodesCard";
import WarningAlert from "@/components/platform/WarningAlert";
import AddButton from "@/components/platform/AddButton";
import NodesTable from "@/components/platform/tables/NodesTable";
import OperationsTab from "@/components/platform/clusterDetailsComponents/OperationsTab";

export default {
  name: "ClusterDetails",
  data() {
    return {
      configurations : [],
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
    AddClusterUser,
    DeleteManyDialog,
    AddClusterAccount,
    UpgradeKubernetesCluster,
    UpgradeK3sCluster,
    AddClusterMachines,
    RenameCluster,
    ClusterStorage,
    ConfirmDialog,
    DeleteDialog,
    QuotaExceededModal,
    ClusterUserInfoModal,
    ServicesTable,
    ClusterGrafana,
    ClusterKubernetesIntegration,
    // ClusterKibana,
    ClusterProviderAccounts,
    WarningAlert,
    AddButton,
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
    }, 5000);

    window.intervals = [];
    window.intervals.push(self.interval);
  },
  methods: {
    goToAddService() {
      let self = this;
      self.loadingServicesQuota = true;
      this.getUserQuota().then((quota) => {
        if (quota["available_services"] < 1) {
          self.alert = {
            show: true,
            msg: 'User quota exceeded. For more information, <a href="/documentation/users/#user-resource-quotas">check the documentation</a>.',
          };
        } else {
          this.$router.push({
            name: "ServiceCatalog",
            params: {
              loading: this.loading,
              clusterID: this.clusterID,
            },
          });
        }
        self.loadingServicesQuota = false;
      });
    },
    async getUsersProjectsList(project_name) {
      let projects = await this.getProjects();

      this.projectsList = [];
      this.selectedProject = projects.filter(
        (el) => el.name === project_name
      )[0];
      this.projectID = this.selectedProject.id;
    },
    copyGrafanaPassword() {
      var dummyGrafana = document.createElement("textarea");
      document.body.appendChild(dummyGrafana);
      dummyGrafana.value = this.cluster.grafana_admin_password;
      dummyGrafana.select();
      document.execCommand("copy");
      document.body.removeChild(dummyGrafana);
      this.grafanaPWCopied = true;
      setTimeout(() => {
        this.grafanaPWCopied = false;
      }, 2000);
    },
    copyESPassword() {
      var dummy = document.createElement("textarea");
      document.body.appendChild(dummy);
      dummy.value = this.cluster.es_admin_password;
      dummy.select();
      document.execCommand("copy");
      document.body.removeChild(dummy);
      this.kibanaPWCopied = true;
      setTimeout(() => {
        this.kibanaPWCopied = false;
      }, 2000);
    },
    addUserToCluster() {
      this.showAddClusterUser = true;
      this.$bvModal.show("bv-modal-addclusteruser");
    },
    goToClusterUserInfoModal(index) {
      this.showClusterUserInfoModal = true;
      this.$bvModal.show("bv-modal-clusteruserinfomodal");
      this.clusterUserIndex = index;
    },
    addAccountToCluster() {
      this.showAddClusterAccount = true;
      this.$bvModal.show("bv-modal-addclusteraccount");
    },
    upgradeKubernetesCluster() {
      this.showUpgradeKubernetesCluster = true;
      this.$bvModal.show("bv-modal-upgradekubernetescluster");
    },
    upgradeK3sCluster() {
      this.showUpgradeK3sCluster = true;
      this.$bvModal.show("bv-modal-upgradek3scluster");
    },
    addMachineToCluster() {
      this.showAddClusterMachines = true;
      this.$bvModal.show("bv-modal-addclustermachines");
    },
    renameCluster() {
      this.showRenameCluster = true;
      this.$bvModal.show("bv-modal-renamecluster");
    },
    deleteUserFromCluster(user) {
      this.confirmDialogParams.requestBody = {
        username: user.username,
        clusterID: this.clusterID,
      };
      let name = user.first_name + user.last_name;
      this.confirmDialogParams.text = "Are you sure you want to delete user:";
      this.confirmDialogParams.envName = name;
      this.confirmDialogParams.action = "Delete";
      this.confirmDialogParams.endpoint =
        "/server/tenants/" +
        this.computed_active_tenant_id +
        "/clusters/" +
        this.clusterID +
        "/users/" +
        user.username;
      this.confirmDialogParams.successMessage =
        'You have successfully submitted deletion for user "' + name + '".';
      this.confirmDialogParams.failureMessage =
        'Error occured while you tried to submit deletion of user "' +
        name +
        '".';
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
          self.$notify({
            group: "msg",
            type: "error",
            title: "Notification:",
            text: "Error while downloading Kubeconfig file! " + error,
          });
        });
    },
    downloadClusterUserKubeconfig(id, username) {
      let self = this;
      this.axios
        .get(
          "/server/tenants/" +
            this.computed_active_tenant_id +
            "/clusters/" +
            id +
            "/user/" +
            username +
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
          self.$notify({
            group: "msg",
            type: "error",
            title: "Notification:",
            text: "Error while downloading Kubeconfig file! " + error,
          });
        });
    },
    deleteCluster(id, name) {
      this.deleteDialogParams.requestBody = { clusterID: id };
      this.deleteDialogParams.text = "Are you sure you want to delete:";
      this.deleteDialogParams.envName = name;
      this.deleteDialogParams.envId = id;
      if (this.clusterType != 5 && this.clusterType != 8) {
        this.deleteDialogParams.endpoint =
          "/server/tenants/" +
          this.computed_active_tenant_id +
          "/clusters/" +
          id +
          "/delete";
      } else if (this.clusterType == 5) {
        this.deleteDialogParams.endpoint =
          "/server/tenants/" +
          this.computed_active_tenant_id +
          "/clusters/" +
          id +
          "/capi-delete";
      } else if (this.clusterType == 8) {
        this.deleteDialogParams.endpoint =
          "/server/tenants/" +
          this.computed_active_tenant_id +
          "/clusters/" +
          id +
          "/yaook-delete";
      }
      this.deleteDialogParams.successMessage =
        'You have successfully submitted deletion for "' + name + '".';
      this.deleteDialogParams.failureMessage =
        'Error occured while you tried to submit deletion of "' + name + '".';
      this.showDeleteDialog = true;
      this.$bvModal.show("bv-modal-deletedialog");
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
    deleteAllServices() {
      this.deleteManyDialogParams.requestBody = [];
      for (let i = 0; i < this.servicesListTable.length; i++) {
        this.deleteManyDialogParams.requestBody.push({
          clusterID: this.servicesListTable[i].clusterId,
          name: this.servicesListTable[i].name,
          namespace: this.servicesListTable[i].namespace,
          connectionInfo: this.servicesListTable[i].connection_info,
        });
      }
      this.deleteManyDialogParams.text =
        "Are you sure you want to delete all Services";
      this.deleteManyDialogParams.endpoint =
        "/server/tenants/" +
        this.computed_active_tenant_id +
        "/clusters/" +
        this.clusterID +
        "/services/" +
        this.serviceName +
        "/" +
        this.serviceNamespace;

      this.$bvModal.show("bv-modal-deletemanydialog");
    },
    goToServiceDetails(service) {
      for (let i = 0; i < window.intervals.length; i++) {
        clearInterval(window.intervals[i]);
      }
      this.$router.push({
        name: "ServiceDetails",
        params: {
          clusterID: this.clusterID,
          serviceName: service.name,
          serviceServiceName: service.service__name,
          serviceNamespace: service.namespace,
          service_type: service.service_type,
          providers: service.providers,
        },
      });
    },
    deleteServiceFromCluster(name, namespace) {
      this.deleteDialogParams.requestBody = {
        clusterID: this.clusterID,
        name: name,
        namespace: namespace,
      };
      this.deleteDialogParams.text =
        'Are you sure you want to delete "' + name + '"?';
      this.deleteDialogParams.endpoint =
        "/server/tenants/" +
        this.computed_active_tenant_id +
        "/clusters/" +
        this.clusterID +
        "/services/" +
        name +
        "/" +
        namespace;
      this.deleteDialogParams.successMessage =
        'You have successfully submitted deletion for "' + name + '".';
      this.deleteDialogParams.failureMessage =
        'Error occured while you tried to submit deletion of "' + name + '".';
      this.showDeleteDialog = true;
      this.$bvModal.show("bv-modal-deletedialog");
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
        self.errorMsg = Buffer.from(
          cluster["errorMsg"],
          "base64"
        ).toString("utf-8");
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
            accountLabel: accountLabel
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
            accountLabel: accountLabel
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
            accountLabel: accountLabel
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
            accountLabel: accountLabel
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
            accountLabel: accountLabel
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
            accountLabel: accountLabel
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
            accountLabel: accountLabel
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
    addIntervalToWindowIntervals(interval) {
      window.intervals.push(interval);
    },
    goToMenuItem(item) {
      this.$router.push({
        name: "ClusterDetails",
        params: {
          clusterID: this.clusterID,
          detailPage: item,
        },
      });
    },
    getServicesList(currentObject) {
      let self = currentObject;
      axios
        .get("/server/services", this.get_axiosConfig())
        .then(function (response) {
          self.serviceStoreList = [];
          for (let i = 0; i < response.data.serviceList.length; i++) {
            self.serviceStoreList.push({
              name: response.data.serviceList[i].name,
              description: response.data.serviceList[i].description,
              logo_url: response.data.serviceList[i].logo_url,
            });
          }
          self.loadingSrvices = false;
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    setExceededResources(resources) {
      this.exceededResources = resources;
      this.showQuotaExceeded = true;
      this.$bvModal.show("bv-modal-quotaexceeded");
    },
    setUpgradeAvailable(value) {
      this.upgradeAvailable = value;
    },
    changeKubeUpgradeStatus(value) {
      this.kubeUpgradeStatus = value;
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
