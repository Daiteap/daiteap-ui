<template>
  <div class="container">
    <br />
    <br />
    <DeleteDialog
      v-show="showDeleteDialog"
      :deleteDialogParams="deleteDialogParams"
    ></DeleteDialog>
    <div v-if="loading" class="d-flex">
      <div class="spinner-border spinner-border-lg text-primary" role="status">
        <span class="sr-only">Loading...</span>
      </div>
    </div>
    <h4 class="d-flex">{{ clusterName }} ( {{ ID }} )</h4>
    <br />
    <div v-if="status == 0">
      <div>
        <h4>Cluster creation successful</h4>
      </div>
      <hr class="mb-4" />
    </div>
    <div v-if="status < 0">
      <div>
        <h4>Cluster creation unsuccessful</h4>
      </div>
      <hr class="mb-4" />
    </div>
    <div v-if="!loading">
      <h4 v-if="status > 0">Progress</h4>

      <div class="stepper d-flex flex-column mt-5 ml-2">
        <div class="d-flex mb-1">
          <div class="d-flex flex-column pr-4 align-items-center">
            <div
              v-bind:class="{
                'bg-secondary': state[0] == 0,
                'bg-current': state[0] == 1,
                'bg-success': state[0] == 2,
                'bg-danger': state[0] == -1,
              }"
              class="rounded-circle py-2 px-3 text-white mb-1"
            >
              1
            </div>
            <div class="line h-100"></div>
          </div>
          <div>
            <h5 class="text-dark">Environment creation</h5>
            <p class="lead text-muted pb-3">
              Allocating resources for the cluster in the cloud.
            </p>
          </div>
        </div>
        <div class="d-flex mb-1">
          <div class="d-flex flex-column pr-4 align-items-center">
            <div
              v-bind:class="{
                'bg-secondary': state[1] == 0,
                'bg-current': state[1] == 1,
                'bg-success': state[1] == 2,
                'bg-danger': state[1] == -1,
              }"
              class="rounded-circle py-2 px-3 text-white mb-1"
            >
              2
            </div>
            <div class="line h-100 d-none"></div>
          </div>
          <div>
            <h5 class="text-dark">Installing CNI plugin</h5>
            <p class="lead text-muted pb-3">Installing CNI network plugin.</p>
          </div>
        </div>
      </div>
      <div class="progress">
        <div
          id="progress-bar"
          v-if="status < 0"
          class="progress-bar bg-danger"
          role="progressbar"
          aria-valuenow="75"
          aria-valuemin="0"
          aria-valuemax="100"
          style="width: 100%"
        ></div>
        <div
          id="progress-bar"
          v-else-if="status == 0"
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
      <pre
        v-if="status < 0 && errorMsg != undefined && errorMsg != ''"
        id="errorMsg"
        >{{ errorMsg }}</pre
      >
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
    <div class="d-flex">
      <div
        v-if="Number(status) < 0"
        class="custom-button ml-auto mr-5"
        @click="deleteCluster(ID, clusterName)"
      >
        Delete
      </div>
    </div>
    <br />
  </div>
</template>

<script>
import axios from "axios";
import DeleteDialog from "./popup_modals/DeleteDialog";

export default {
  name: 'SubmitYaookCluster',
  data() {
    return {
      showDeleteDialog: false,
      clusterName: "",
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
      state: [0, 0],
      progressBar: {
        width: "0%",
        display: "none",
      },
    };
  },
  components: {
    DeleteDialog,
  },
  created() {
    if (this.ID == null) {
      this.$router.push({ name: "ClusterList" });
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
      required: true,
    },
  },
  methods: {
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
        .then(function (response) {
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
        .catch(function (error) {
          console.error(error);
        });
    },
    changeInstallationStatus() {
      let self = this;
      let status = this.status;
      this.removeLoading();
      if (status >= 1 && status < 3) {
        this.updatePercentage(2);
        this.state = [1, 0];
      } else if (status >= 3 && status <= 8) {
        this.updatePercentage(50);
        this.state = [2, 1];
      } else if (status == 0) {
        this.updatePercentage(100);
        for (let i = 0; i < window.intervals.length; i++) {
          clearInterval(window.intervals[i]);
        }
        this.state = [2, 2];
      } else if (status <= -1 && status > -2) {
        this.errorMsg = self.errorMsg;
        this.updatePercentage(100);
        for (let i = 0; i < window.intervals.length; i++) {
          clearInterval(window.intervals[i]);
        }
        this.state = [-1, 0];
      } else if (status <= -2 && status >= -8) {
        this.updatePercentage(100);
        for (let i = 0; i < window.intervals.length; i++) {
          clearInterval(window.intervals[i]);
        }
        this.state = [2, -1];
      }
    },
    deleteCluster(id, name) {
      this.deleteDialogParams.requestBody = { clusterID: id };
      this.deleteDialogParams.text = "Are you sure you want to delete:";
      this.deleteDialogParams.envName = name;
      this.deleteDialogParams.endpoint =
          "/server/tenants/" +
          this.computed_active_tenant_id +
          "/clusters/" +
          id +
          "/yaook-delete";
      this.deleteDialogParams.successMessage =
        'You have successfully submitted deletion for "' + name + '".';
      this.deleteDialogParams.failureMessage =
        'Error occured while you tried to submit deletion of "' + name + '".';
      this.showDeleteDialog = true;
      this.$bvModal.show("bv-modal-deletedialog");
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
      let cluster = await this.getClusterDetailsMain(self.ID);
      self.clusterName = cluster.title;
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
