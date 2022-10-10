<template>
  <b-modal centered id="bv-modal-servicedetailsmodal" hide-footer>
    <DeleteDialog
      v-show="showDeleteDialog"
      :deleteDialogParams="deleteDialogParams"
      @closeModal="closeModal"
    ></DeleteDialog>
    <div v-on:click="closeModal()"></div>
    <div>
      <div class="container w-100">
        <div class="row">
          <div class="col mt-3">
            <h1>Service Details</h1>
          </div>
        </div>
        <div class="row">
          <div class="w-100 scroll">
            <div class="card mb-4 w-100">
              <div class="card-body">
                <div v-if="loading" class="d-flex justify-content-center">
                  <div class="spinner-border text-primary" role="status">
                    <span class="sr-only">Loading...</span>
                  </div>
                </div>
                <div v-else class="table-responsive">
                  <table
                    class="table table-bordered"
                    id="dataTable"
                    width="100%"
                    cellspacing="0"
                  >
                    <tbody>
                      <tr v-for="item in releaseInfo" :key="item.key">
                        <td>{{ item.key }}</td>
                        <td>{{ item.value }}</td>
                      </tr>
                    </tbody>
                  </table>
                  <br />
                  <div>
                    <hr class="mb-3">
                    <h4 class="text-center">Instructions how to connect to Service:</h4>
                      <pre>
                        {{ connectionInfo }}
                      </pre>
                  </div>
                  <br />
                </div>
              </div>
            </div>
          </div>
          <div
            class="col-xl-12 p-2 d-flex align-items-end justify-content-around"
            style="border-top: black solid 1 pix"
          >
            <input
              type="button"
              class="btn btn-outline-success col-xl-6 mx-1 px-0"
              value="Cancel"
              @click="closeModal()"
            />
            <input
              type="button"
              class="btn btn-outline-success col-md-6 mx-1 px-0"
              value="Delete Service"
              @click="deleteService()"
            />
          </div>
        </div>
      </div>
    </div>
    
  </b-modal>
</template>

<script>
import axios from "axios";
import DeleteDialog from "./DeleteDialog";

export default {
  name: 'ServiceDetailsModal',
  data() {
    return {
      loading: false,
      cluster: {},
      releaseInfo: [],
      connectionInfo: "",
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
    };
  },

  props: {
    clusterID: {
      type: String,
      required: true,
    },
    serviceName: {
      type: String,
      required: true,
    },
    serviceServiceName: {
      type: String,
      required: true,
    },
    serviceNamespace: {
      type: String,
      required: true,
    },
    service_type: {
      type: String,
    },
    providers: {
      type: String,
      required: true,
    },
  },
  components: {
    DeleteDialog,
  },

  created() {
    this.loading = true;

    if(this.serviceServiceName){
      this.releaseInfo.push({
        key: "Service",
        value: this.serviceServiceName,
      });
    }
    if(this.serviceNamespace){
      this.releaseInfo.push({
        key: "Namespace",
        value: this.serviceNamespace,
      });
    }
    if (this.service_type) {
      this.releaseInfo.push({
        key: "Service Type",
        value: this.service_type,
      });
    }
    if (this.providers){
      let providers = this.providers.replace(/'/g, '"');
      providers = JSON.parse(providers);
      let providersString = "";
      for (let i = 0; i < providers.length; i++) {
        providersString += providers[i];
        if (i < providers.length - 1) {
          providersString += ", ";
        }
      }
      this.releaseInfo.push({
        key: "Providers",
        value: providersString,
      });
    }
    this.releaseInfo.push({
      key: "Cluster ID",
      value: this.clusterID,
    });
    this.getConnectionInfo(this);
  },
  methods: {
    closeModal() {
      this.$bvModal.hide("bv-modal-servicedetailsmodal");
    },
    deleteService() {
      if(this.clusterID){
        this.deleteDialogParams.requestBody.clusterID = this.clusterID
      }
      if(this.serviceName){
        this.deleteDialogParams.requestBody.name = this.serviceName
      }
      if(this.serviceNamespace){
        this.deleteDialogParams.requestBody.namespace = this.serviceNamespace
      }
      this.deleteDialogParams.text = "Are you sure you want to delete:";
      this.deleteDialogParams.envName = this.serviceName;
      this.deleteDialogParams.endpoint = "/server/deleteService";
      this.deleteDialogParams.successMessage =
        'You have successfully submitted deletion for "' +
        this.serviceName +
        '".';
      this.deleteDialogParams.failureMessage =
        'Error occured while you tried to submit deletion of "' +
        this.serviceName +
        '".';
      this.showDeleteDialog = true;
      this.$bvModal.show("bv-modal-deletedialog");
    },
    getConnectionInfo(currentObject) {
      let self = currentObject;
      let request = {
            clusterID: self.clusterID,
            name: self.serviceName,
          }
      if (self.serviceNamespace != null) {
        request.namespace = self.serviceNamespace
      }
      axios
        .post(
          "/server/getServiceConnectionInfo",
          request,
          this.get_axiosConfig()
        )
        .then(function (response) {
          self.connectionInfo = response.data.connection_info;
          self.loading = false;
        })
        .catch(function (error) {
          console.log(error);
        });
    },
  },
};
</script>

<style scoped>
.modal-content {
  max-width: 650px;
  max-height: 350px;
}

.btn-success {
  margin-right: 20px;
}
</style>
<style scoped>
.collapsed > .when-opened,
:not(.collapsed) > .when-closed {
  display: none;
}
.disabledCursor:disabled {
  cursor: not-allowed;
  pointer-events: all !important;
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

pre {
  white-space: pre-line;
}

.scroll {
  max-height: 680px;
  overflow-y: auto;
}

</style>