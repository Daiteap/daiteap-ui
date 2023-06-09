<template>
  <div class="container">
    <br>
    <br>
    <ConfirmDialog
      v-show="showConfirmDialog"
      :confirmDialogParams="confirmDialogParams"
      @confirm-action="cancelInstallation()"
    ></ConfirmDialog>
    <DeleteDialog
      v-show="showDeleteDialog"
      :deleteDialogParams="deleteDialogParams"
    ></DeleteDialog>
    <RetryDialog
      v-show="showRetryDialog"
      :retryDialogParams="retryDialogParams"
      :status="status"
      @getInstallationStatus="getInstallationStatusInterval"
    ></RetryDialog>
    <div v-if="loading" class="d-flex">
      <div class="spinner-border spinner-border-lg text-primary" role="status">
        <span class="sr-only">Loading...</span>
      </div>
    </div>
    <h4 class="d-flex">{{ clusterName }} ( {{ ID }} ) </h4>
    <br />
    <div v-if="status==0">
      <div>
        <h4>Cluster creation successful</h4>
      </div>
      <hr class="mb-4" />
    </div>
    <div v-if="status<0">
      <div>
        <h4>Cluster creation unsuccessful</h4>
      </div>
      <hr class="mb-4" />
    </div>
    <div v-if="!loading">
      <h4 v-if="status>0" >Progress</h4>

      <div class="stepper d-flex flex-column mt-5 ml-2">
        <div class="d-flex mb-1">
          <div class="d-flex flex-column pr-4 align-items-center">
            <div
              v-bind:class="{'bg-secondary':state[0]==0, 'bg-current':state[0]==1, 'bg-success':state[0]==2,'bg-danger':state[0]==-1}"
              class="rounded-circle py-2 px-3 text-white mb-1"
            >1</div>
            <div class="line h-100"></div>
          </div>
          <div>
            <h5 class="text-dark">
              Environment creation
            </h5>
            <p class="lead text-muted pb-3">Allocating resources for the cluster in the cloud.</p>
          </div>
        </div>
        <div class="d-flex mb-1">
          <div class="d-flex flex-column pr-4 align-items-center">
            <div
              v-bind:class="{'bg-secondary':state[1]==0, 'bg-current':state[1]==1, 'bg-success':state[1]==2,'bg-danger':state[1]==-1}"
              class="rounded-circle py-2 px-3 text-white mb-1"
            >2</div>
            <div class="line h-100"></div>
          </div>
          <div>
            <h5 class="text-dark">Preparing for Kubernetes installation</h5>
            <p
              class="lead text-muted pb-3"
            >Making all the necessary preparations for Kubernetes cluster installation.</p>
          </div>
        </div>
        <div class="d-flex mb-1">
          <div class="d-flex flex-column pr-4 align-items-center">
            <div
              v-bind:class="{'bg-secondary':state[2]==0, 'bg-current':state[2]==1, 'bg-success':state[2]==2,'bg-danger':state[2]==-1}"
              class="rounded-circle py-2 px-3 text-white mb-1"
            >3</div>
            <div class="line h-100"></div>
          </div>
          <div>
            <h5 class="text-dark">Configuring machines</h5>
            <p class="lead text-muted pb-3">Installing needed software and configuring machines.</p>
          </div>
        </div>
        <div class="d-flex mb-1">
          <div class="d-flex flex-column pr-4 align-items-center">
            <div
              v-bind:class="{'bg-secondary':state[3]==0, 'bg-current':state[3]==1, 'bg-success':state[3]==2,'bg-danger':state[3]==-1}"
              class="rounded-circle py-2 px-3 text-white mb-1"
            >4</div>
            <div class="line h-100"></div>
          </div>
          <div>
            <h5 class="text-dark">Installing Kubernetes</h5>
            <p class="lead text-muted pb-3">Installing Kubernetes cluster in the cloud.</p>
          </div>
        </div>
        <div class="d-flex mb-1">
          <div class="d-flex flex-column pr-4 align-items-center">
            <div
              v-bind:class="{'bg-secondary':state[4]==0, 'bg-current':state[4]==1, 'bg-success':state[4]==2,'bg-danger':state[4]==-1}"
              class="rounded-circle py-2 px-3 text-white mb-1"
            >5</div>
            <div class="line h-100 d-none"></div>
          </div>
          <div>
            <h5 class="text-dark">Downloading Kubernetes config file</h5>
            <p class="lead text-muted pb-3">Downloading kubectl YAML file.</p>
          </div>
        </div>
      </div>
      <div class="progress">
        <div
          id="progress-bar"
          v-if="status<0"
          class="progress-bar bg-danger"
          role="progressbar"
          aria-valuenow="75"
          aria-valuemin="0"
          aria-valuemax="100"
          style="width: 100%"
        ></div>
        <div
          id="progress-bar"
          v-else-if="status==0"
          class="progress-bar bg-success"
          role="progressbar"
          aria-valuenow="75"
          aria-valuemin="0"
          aria-valuemax="100"
          style="width: 100%"
        ></div>
        <div
          id="progress-bar"
          v-else
          v-bind:style="progressBar"
          class="progress-bar progress-bar-striped progress-bar-animated"
          role="progressbar"
          aria-valuenow="75"
          aria-valuemin="0"
          aria-valuemax="100"
        ></div>
      </div>
      <h2 v-if="status < 0 && errorMsg != undefined && errorMsg != '' && (errorMsg.includes('Quota') || errorMsg.includes('exceeded') || errorMsg.includes('Exceeded') || errorMsg.includes('quota') || errorMsg.includes('not have enough resources available'))" id="errorMsg">Cloud quota exceeded</h2>
      <pre v-if="status < 0 && errorMsg != undefined && errorMsg != ''" id="errorMsg">{{ errorMsg }}</pre>
    </div>

    <div v-if="status == 0" style="display: flex; justify-content: center;">
      <div
        class="custom-button mr-5 float-right"
        @click="goToClusterDetails()"
        style="width: 20rem;"
      >
        Go To Environment's Details
      </div>
    </div>

    <hr class="py-3 mb-1" />
    <div>
      <div
        v-if="Number(status) > 0"
        class="custom-button float-right ml-5"
        @click="showCancelInstallationDialog(ID, clusterName)"
      >
        Cancel
      </div>
      <div
        v-if="Number(status) < 0"
        class="custom-button ml-5 float-right"
        @click="retryCluster(ID, clusterName)"
      >
        Retry
      </div>
      <div
        v-if="Number(status) < 0"
        class="custom-button mr-5 float-right"
        @click="deleteCluster(ID, clusterName)"
      >
        Delete
      </div>
      <div
        v-if="retryInstanceType"
        class="custom-button ml-5"
        @click="retryClusterInstanceType(ID, clusterName)"
        style="width: 20rem;"
      >
        Retry with different instance type
      </div>
    </div>
    <br />
  </div>
</template>

<script>
import axios from "axios";
import ConfirmDialog from "./popup_modals/ConfirmDialog";
import DeleteDialog from "./popup_modals/DeleteDialog";
import RetryDialog from "./popup_modals/RetryDialog";

export default {
  name: 'SubmitKubernetesCluster',
  data() {
    return {
      showConfirmDialog: false,
      showDeleteDialog: false,
      showRetryDialog: false,
      clusterName: "",
      cluster: "",
      retryDialogParams: {
        requestBody: {},
        text: "",
        endpoint: "",
        successMessage: "",
        failureMessage: ""
      },
      deleteDialogParams: {
        requestBody: {},
        text: "",
        endpoint: "",
        successMessage: "",
        failureMessage: "",
        envName: "",
      },
      confirmDialogParams: {
        text: "",
        envName: "",
        envId: "",
        action: "",
        payload: {},
      },
      errorMsg: undefined,
      loading: true,
      details: "",
      counter: 0,
      status: null,
      retryInstanceType: false,
      errorInstanceType: "",
      suggestedInstanceType: "",
      state: [0, 0, 0, 0, 0],
      progressBar: {
        width: "0%",
        display: "none"
      }
    };
  },
  components: {
    ConfirmDialog,
    DeleteDialog,
    RetryDialog
  },
  created() {
    if (this.ID == null) {
      this.$router.push({ name: "ProjectList" });
    }
    this.loading = true;
    this.timestamp = "0";

    this.getClusterDetails(this);
    this.getInstallationStatus(this);
  },
  mounted() {
    let self = this;
    self.interval = setInterval(() => {
      self.getInstallationStatus(self);
    }, 5000);

    window.intervals = [];
    window.intervals.push(self.interval);
  },
  props: {
    ID: {
      type: String,
      required: true
    }
  },
  methods: {
    getInstallationStatusInterval() {
      let self = this;
      self.interval = setInterval(() => {
        self.getInstallationStatus(self);
      }, 5000);

      window.intervals = [];
      window.intervals.push(self.interval);
    },
    getInstallationStatus(currentObject) {
      let self = currentObject;

      axios
        .get(
          "/server/tenants/" +
            self.computed_active_tenant_id +
            "/clusters/" +
            self.ID +
            "/installation-status",
          this.get_axiosConfig()
        )
        .then(function(response) {
          self.status = response.data["installStep"];
          self.retryInstanceType = false;

          if (response.data["errorMsg"]) {
            // eslint-disable-next-line no-undef
            self.errorMsg = Buffer.from(
              response.data["errorMsg"],
              "base64"
            ).toString("utf-8");

            if (response.data["installStep"] == -1 &&
                "error_instance_type" in response.data &&
                "suggested_instance_type" in response.data) {
              self.retryInstanceType = true;
              self.errorInstanceType = response.data["error_instance_type"];
              self.suggestedInstanceType = response.data["suggested_instance_type"];
            }
          }

          self.changeInstallationStatus();
          self.timestamp = response.data["detailsStatus"];
        })
        .catch(function(error) {
          console.error(error);
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
    changeInstallationStatus() {
      let self = this;
      let status = this.status;
      this.removeLoading();
      if (status >= 1 && status <= 6) {
        this.updatePercentage(2);
        this.state = [1, 0, 0, 0, 0];
      } else if (status == 7 || status == 8) {
        this.updatePercentage(25 + this.calcDynamicPercent(this.counter));
        this.state = [2, 1, 0, 0, 0];
      } else if (status >= 9 && status <= 12) {
        this.updatePercentage(50 + this.calcDynamicPercent(this.counter));
        this.state = [2, 2, 1, 0, 0];
      } else if (status >= 13 && status <= 24) {
        this.updatePercentage(75 + this.calcDynamicPercent(this.counter));
        this.state = [2, 2, 2, 1, 0];
      } else if (status >= 25 && status <= 30) {
        this.updatePercentage(95);
        this.state = [2, 2, 2, 2, 1];
      } else if (status == 0) {
        this.updatePercentage(100);
        for (let i = 0; i < window.intervals.length; i++) {
          clearInterval(window.intervals[i]);
        }
        this.state = [2, 2, 2, 2, 2];
      } else if (status <= -1 && status >= -6) {
        this.errorMsg = self.errorMsg;
        this.updatePercentage(100);
        for (let i = 0; i < window.intervals.length; i++) {
          clearInterval(window.intervals[i]);
        }
        this.state = [-1, 0, 0, 0, 0];
      } else if (status == -7 || status == -8) {
        this.updatePercentage(100);
        for (let i = 0; i < window.intervals.length; i++) {
          clearInterval(window.intervals[i]);
        }
        this.state = [2, -1, 0, 0, 0];
      } else if (status <= -9 && status >= -12) {
        this.updatePercentage(100);
        for (let i = 0; i < window.intervals.length; i++) {
          clearInterval(window.intervals[i]);
        }
        this.state = [2, 2, -1, 0, 0];
      } else if (status <= -13 && status >= -22) {
        this.updatePercentage(100);
        for (let i = 0; i < window.intervals.length; i++) {
          clearInterval(window.intervals[i]);
        }
        this.state = [2, 2, 2, -1, 0];
      } else if (status <= -23 && status >= -29) {
        this.updatePercentage(100);
        for (let i = 0; i < window.intervals.length; i++) {
          clearInterval(window.intervals[i]);
        }
        this.state = [2, 2, 2, 2, -1];
      }
    },
    deleteCluster(id, name) {
      this.deleteDialogParams.text =
        'Are you sure you want to delete:';
      this.deleteDialogParams.envName = name
      this.deleteDialogParams.endpoint =
        "/server/tenants/" +
        this.computed_active_tenant_id +
        "/clusters/" +
        id +
        "/delete";
      this.deleteDialogParams.successMessage =
        'You have successfully submitted deletion for "' + name + '".';
      this.deleteDialogParams.failureMessage =
        'Error occured while you tried to submit deletion of "' + name + '".';
      this.showDeleteDialog = true;
      this.$bvModal.show("bv-modal-deletedialog");
    },
    showCancelInstallationDialog(id, name) {
      this.confirmDialogParams.text =
        'Are you sure you want to cancel the installation and delete the existing resources:';
      this.confirmDialogParams.envName = name;
      this.confirmDialogParams.action = 'Delete';
      this.confirmDialogParams.payload = {
        "id": id,
        "name": name,
      };
      this.showConfirmDialog = true;
      this.$bvModal.show("bv-modal-confirmdialog");
    },
    cancelInstallation(payload) {
      let self = this;
      let endpoint = 
        "/server/tenants/" +
        this.computed_active_tenant_id +
        "/clusters/" +
        payload.id +
        "/cancel-creation";
      let requestBody = {}
      let successMessage = 'You have successfully submitted deletion for "' + payload.name + '".';
      let failureMessage = 'Error occured while you tried to submit deletion of "' + payload.name + '".';

      this.axios
        .post(
          endpoint,
          requestBody,
          this.get_axiosConfig()
        )
        .then(function () {
          if (successMessage) {
            self.$notify({
              group: "msg",
              type: "success",
              title: "Notification:",
              text: self.confirmDialogParams.successMessage,
            });
          }
          self.showConfirmDialog = false;
          self.$bvModal.hide("bv-modal-confirmdialog");
          self.$router.push({
            name: "KubernetesClusterList"
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
            if (failureMessage) {
              self.$notify({
                group: "msg",
                type: "error",
                title: "Notification:",
                text: failureMessage,
              });
            }
          }
          self.showConfirmDialog = false;
          self.$bvModal.hide("bv-modal-confirmdialog");
        });
    },
    retryCluster(id, name) {
      this.retryDialogParams.requestBody = { clusterID: id };
      this.retryDialogParams.text =
        'Are you sure you want to retry "' + name + '"?';
      this.retryDialogParams.endpoint =
        "/server/tenants/" +
        this.computed_active_tenant_id +
        "/clusters/" +
        id +
        "/dlcm-retry-create";
      this.retryDialogParams.successMessage =
        'You have successfully submitted retry for "' + name + '".';
      this.retryDialogParams.failureMessage =
        'Error occured while you tried to submit retry of "' + name + '".';
      this.showRetryDialog = true;
      this.$bvModal.show("bv-modal-retrydialog");
    },
    retryClusterInstanceType(id, name) {
      let self = this;
      axios
        .get(
          "/server/tenants/" +
            self.computed_active_tenant_id +
            "/clusters/" +
            self.ID +
            "/config",
          this.get_axiosConfig()
        )
        .then(function (response) {
          let config = response.data;
          let providers = [
            "google",
            "aws",
            "azure",
            "openstack"
          ];
          for (let i = 0; i < providers.length; i++){
            if (providers[i] in config){
              for (let j = 0; j < config[providers[i]]["nodes"].length; j++){
                if (config[providers[i]]["nodes"][j]["instanceType"] == self.errorInstanceType){
                  config[providers[i]]["nodes"][j]["instanceType"] = self.suggestedInstanceType;
                }
              }
            }
          }

          this.retryDialogParams.requestBody = { clusterID: id, config: config };
          this.retryDialogParams.text =
            'Are you sure you want to retry "' + name + '"?';
          this.retryDialogParams.endpoint =
            "/server/tenants/" +
            this.computed_active_tenant_id +
            "/clusters/" +
            id +
            "/dlcm-retry-create";
          this.retryDialogParams.successMessage =
            'You have successfully submitted retry for "' + name + '".';
          this.retryDialogParams.failureMessage =
            'Error occured while you tried to submit retry of "' + name + '".';
          this.showRetryDialog = true;
          this.$bvModal.show("bv-modal-retrydialog");
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
        });
    },
    updatePercentage(number) {
      this.progressBar.display = "flex";
      let perc = "";
      perc += number + "%";
      this.progressBar.width = perc;
    },
    calcDynamicPercent(count) {
      return (count / 1527) * 85;
    },
    removeLoading() {
      this.loading = false;
    },
    async getClusterDetails(currentObject) {
      let self = currentObject;
      self.cluster = await this.getClusterDetailsMain(self.ID);
      self.clusterName = self.cluster.title;
    },
    goToClusterDetails() {
      for (let i = 0; i < window.intervals.length; i++) {
        clearInterval(window.intervals[i]);
      }
      this.$router.push({
        name: "ClusterDetails",
        params: {
          clusterID: this.ID,
          detailPage: "overview",
        }
      });
    }
  },
  destroyed(){
    for (let i = 0; i < window.intervals.length; i++) {
      clearInterval(window.intervals[i]);
      }
    clearInterval(this.interval);
  }
};
</script>

<style scoped>
.stepper .line {
  width: 2px;
  background-color: lightgrey !important;
}
.stepper .lead {
  font-size: 1.1rem;
}

.scrollbar {
  /* margin-left: 30px; */
  float: left;
  height: 300px;
  width: auto;
  background: #f5f5f5;
  overflow-y: scroll;
  margin-bottom: 25px;
}
.force-overflow {
  min-height: 300px;
}
#style-2::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  border-radius: 10px;
  background-color: #f5f5f5;
}
#style-2::-webkit-scrollbar {
  width: 12px;
  background-color: #f5f5f5;
}
#style-2::-webkit-scrollbar-thumb {
  border-radius: 10px;
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  background-color: #eaebed;
}
#detailsView {
  display: block;
}
#details {
  white-space: pre-wrap;
}
.progress {
  margin-bottom: 20px;
}
#detailsView {
  display: none;
}
#errorMsg {
  max-height: 15rem;
}
.progress-bar {
  background-color:#000000;
}
.btn-daiteap {
  width: 10rem;
}
</style>
