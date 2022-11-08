<template>
  <div class="row">
    <div class="card mb-4 w-100">
      <div class="card-header py-3 cardHeaderLight">
        <h6 class="m-0 font-weight-bold">Longhorn Storage:</h6>
      </div>
      <div class="card-body">
        <div v-if="loadingTable" class="d-flex justify-content-center">
          <div class="spinner-border" role="status">
            <span class="sr-only">Loading...</span>
          </div>
        </div>

        <div
          v-else-if="showStorage == false"
          class="d-flex justify-content-center"
        >
          Storage information not available
        </div>

        <div v-else class="table-responsive">
          <table
            class="table table-bordered"
            id="dataTable"
            width="100%"
            cellspacing="0"
          >
            <thead>
              <tr>
                <th>Node</th>
                <th>Type</th>
                <th>Storage</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(node, index) in allNodes" :key="index">
                <td class="node-name col-2">
                  {{ node.name }}
                </td>
                <td class="col-2">
                  <span
                    v-if="
                      (!!cluster.machinesList &&
                        !!cluster.machinesList.length > 0 &&
                        cluster.machinesList.filter(
                          (el) => el.kube_name === node.name
                        )[0].kube_master) ||
                      node.name.includes('-control-plane-')
                    "
                    >Control plane</span
                  >
                  <span v-else>Worker</span>
                </td>

                <td>
                  <b-progress
                    :max="(node.storageMaximum / 1024 / 1024 / 1024).toFixed(2)"
                    height="1rem"
                    class="daiteap-progress"
                  >
                    <b-progress-bar
                      class="daiteap-progress-bar"
                      :value="
                        (node.storageMaximum - node.storageAvailable) /
                        1024 /
                        1024 /
                        1024
                      "
                    >
                    </b-progress-bar>
                  </b-progress>
                  <span
                    >Used:
                    <strong
                      >{{
                        (
                          (node.storageMaximum - node.storageAvailable) /
                          1024 /
                          1024 /
                          1024
                        ).toFixed(2)
                      }}
                      GB /
                      {{
                        (node.storageMaximum / 1024 / 1024 / 1024).toFixed(2)
                      }}
                      GB</strong
                    ></span
                  >
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    <br />
  </div>
</template>

<script>

export default {
  name: 'ClusterStorage',
  mounted() {
    this.getClusterStorage();
  },
  props: {
    cluster: {
      type: Object,
      required: true,
    },
    clusterID: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      showStorage: true,
      loadingTable: true,
      interval: "",
      allNodes: [],
    };
  },
  created() {},
  methods: {
    gettaskmessage(taskId) {
      let self = this;
      self.axios
        .post("/server/gettaskmessage", { taskId: taskId }, this.get_axiosConfig())
        .then(function (response) {
          if (response.data.status !== "PENDING") {
            clearInterval(self.intervalGetTaskMessage);
            if (response.data.error) {
              self.showStorage = false;
              console.log(response.data.errorMessage);
            }
            self.allNodes = response.data.lcmStatuses[0].nodes;
            self.loadingTable = false;
          }
        })
        .catch(function (error) {
          clearInterval(self.intervalGetTaskMessage);
          self.loadingTable = false;
          self.showStorage = false;
          console.log(error);
        });
    },
    getClusterStorage() {
      let self = this;
      this.axios
        .post(
          "/server/getClusterStorage",
          {
            clusterID: self.clusterID,
          },
          this.get_axiosConfig()
        )
        .then(function (response) {
          let taskId = response.data.taskId;

          self.intervalGetTaskMessage = setInterval(() => {
            self.gettaskmessage(taskId);
          }, 1000);
        })
        .catch(function (error) {
          self.loadingTable = false;
          self.showStorage = false;
          console.log(error);
        });
    },
  },
  components: {},
  destroyed() {
    if (window.intervals) {
      for (let i = 0; i < window.intervals.length; i++) {
        clearInterval(window.intervals[i]);
      }
    }
    clearInterval(this.interval);
    clearInterval(this.intervalGetTaskMessage);
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
