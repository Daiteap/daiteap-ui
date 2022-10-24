<template>
  <div class="container">
    <br>
    <br>
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
        <h4>Compute (VM) creation successful</h4>
      </div>
      <hr class="mb-4" />
    </div>
    <div v-if="status<0">
      <div>
        <h4>Compute (VM) creation unsuccessful</h4>
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
            <h5 class="text-dark mt-2">
              Allocating resources in the cloud.
            </h5>
          </div>
        </div>
        <br>
        <div class="d-flex mb-1">
          <div class="d-flex flex-column pr-4 align-items-center">
            <div
              v-bind:class="{'bg-secondary':state[1]==0, 'bg-current':state[1]==1, 'bg-success':state[1]==2,'bg-danger':state[1]==-1}"
              class="rounded-circle py-2 px-3 text-white mb-1"
            >2</div>
            <div class="line h-100 d-none"></div>
          </div>
          <div>
            <h5 class="text-dark mt-2">Configuring VMs</h5>
          </div>
        </div>
        <br>
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
    <div v-if="status==0" class="text-center">
        <button class="btn btn-outline-success" @click="goToCompute()">Go to Compute (VM)</button>
    </div>
      <h2 v-if="status < 0 && errorMsg != undefined && errorMsg != '' && (errorMsg.includes('Quota') || errorMsg.includes('exceeded') || errorMsg.includes('Exceeded') || errorMsg.includes('quota'))" id="errorMsg">Cloud quota exceeded</h2>
      <pre v-if="status < 0 && errorMsg != undefined && errorMsg != ''" id="errorMsg">{{ errorMsg }}</pre>
    </div>

    <hr class="py-3 mb-1" />
    <div class="d-flex">
      <button
        v-if="Number(status) < 0"
        class="btn btn-outline-success ml-auto mr-5 btn-daiteap"
        v-on:click="retryCluster(ID, clusterName)"
      >Retry</button>
      <button
        v-if="Number(status) > 1"
        class="btn btn-outline-success btn-daiteap"
        v-on:click="cancelInstallation(ID, clusterName)"
      >Cancel</button>
      <button
        v-if="Number(status) < 0"
        class="btn btn-outline-success ml-5 btn-daiteap"
        v-on:click="deleteCluster(ID, clusterName)"
      >Delete</button>
    </div>
    <br />
  </div>
</template>

<script>
import axios from "axios";
import DeleteDialog from "./popup_modals/DeleteDialog";
import RetryDialog from "./popup_modals/RetryDialog";

export default {
  name: 'SubmitVMs',
  data() {
    return {
      showDeleteDialog: false,
      showRetryDialog: false,
      clusterName: "",
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
      errorMsg: undefined,
      loading: true,
      details: "",
      counter: 0,
      status: null,
      state: [0, 0, 0],
      progressBar: {
        width: "0%",
        display: "none"
      }
    };
  },
  components: {
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
    let interval = setInterval(() => {
      self.getInstallationStatus(self);
    }, 5000);

    window.intervals = [];
    window.intervals.push(interval);
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
        .post(
          "/server/getInstallationStatus",
          {
            ID: self.ID,
            details: self.timestamp
          },
          this.get_axiosConfig()
        )
        .then(function(response) {
          self.status = response.data["installStep"];

            if (response.data["errorMsg"]) {
              // eslint-disable-next-line no-undef
              self.errorMsg = Buffer.from(
                response.data["errorMsg"],
                "base64"
              ).toString("utf-8");
            }

          self.changeInstallationStatus();
          self.timestamp = response.data["detailsStatus"];
          if (response.data["details"] != null) {
            for (let i = 0; i < response.data["details"].length; i++) {
              self.details += response.data["details"][i] + "\n";
              self.counter += 1;
            }
          }
        })
        .catch(function(error) {
          console.error(error);
        });
    },
    changeInstallationStatus() {
      let self = this;
      let status = this.status;
      this.removeLoading();
      if (status >= 1 && status <= 6) {
        this.updatePercentage(2);
        this.state = [1, 0, 0];
      } else if (status >= 7 && status <= 10) {
        this.updatePercentage(35 + this.calcDynamicPercent(this.counter));
        this.state = [2, 1, 0];
      } else if (status >= 11  && status <= 14) {
        this.updatePercentage(70 + this.calcDynamicPercent(this.counter));
        this.state = [2, 2, 1];
      } else if (status == 0) {
        this.updatePercentage(100);
        for (let i = 0; i < window.intervals.length; i++) {
          clearInterval(window.intervals[i]);
        }
        this.state = [2, 2, 2];
      } else if (status <= -1 && status >= -6) {
        this.errorMsg = self.errorMsg;
        this.updatePercentage(100);
        for (let i = 0; i < window.intervals.length; i++) {
          clearInterval(window.intervals[i]);
        }
        this.state = [-1, 0, 0];
      } else if (status <= -7 && status >= -10) {
        this.updatePercentage(100);
        for (let i = 0; i < window.intervals.length; i++) {
          clearInterval(window.intervals[i]);
        }
        this.state = [2, -1, 0];
      } else if (status <= -11  && status >= -14) {
        this.updatePercentage(100);
        for (let i = 0; i < window.intervals.length; i++) {
          clearInterval(window.intervals[i]);
        }
        this.state = [2, 2, -1];
      }
    },
    updatePercentage(number) {
      this.progressBar.display = "flex";
      let perc = "";
      perc += number + "%";
      this.progressBar.width = perc;
    },
    calcDynamicPercent(count) {
      return (count / 25) * 50;
    },
    deleteCluster(id, name) {
      this.deleteDialogParams.requestBody = { clusterID: id };
      this.deleteDialogParams.text =
        'Are you sure you want to delete:';
      this.deleteDialogParams.envName = name
      this.deleteDialogParams.endpoint = "/server/deleteCluster";
      this.deleteDialogParams.successMessage =
        'You have successfully submitted deletion for "' + name + '".';
      this.deleteDialogParams.failureMessage =
        'Error occured while you tried to submit deletion of "' + name + '".';
      this.showDeleteDialog = true;
      this.$bvModal.show("bv-modal-deletedialog");
    },
    cancelInstallation(id, name) {
      this.deleteDialogParams.requestBody = { clusterID: id };
      this.deleteDialogParams.text =
        'Are you sure you want to cancel the installation:';
      this.deleteDialogParams.envName = name
      this.deleteDialogParams.endpoint = "/server/cancelClusterCreation";
      this.deleteDialogParams.successMessage =
        'You have successfully submitted deletion for "' + name + '".';
      this.deleteDialogParams.failureMessage =
        'Error occured while you tried to submit deletion of "' + name + '".';
      this.showDeleteDialog = true;
    },
    retryCluster(id, name) {
      this.retryDialogParams.requestBody = { clusterID: id };
      this.retryDialogParams.text =
        'Are you sure you want to retry "' + name + '"?';
      this.retryDialogParams.endpoint = "/server/retryCreateComputeVMs";
      this.retryDialogParams.successMessage =
        'You have successfully submitted retry for "' + name + '".';
      this.retryDialogParams.failureMessage =
        'Error occured while you tried to submit retry of "' + name + '".';
      this.showRetryDialog = true;
      this.$bvModal.show("bv-modal-retrydialog");
    },
    async getClusterDetails(currentObject) {
      let self = currentObject;
      let cluster = await this.getClusterDetailsMain(self.ID);
      self.clusterName = cluster.title;
    },
    removeLoading() {
      this.loading = false;
    },
    goToCompute() {
      for (let i = 0; i < window.intervals.length; i++) {
        clearInterval(window.intervals[i]);
      }
      this.$router.push({
        name: "ComputeOverviewAll",
        params: {}
      });
    }
  },
  destroyed() {
    if(window.intervals){
      for (let i = 0; i < window.intervals.length; i++) {
        clearInterval(window.intervals[i]);
        }
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
