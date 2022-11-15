<template>
  <div>
    <DeleteDialog
      v-show="showDeleteDialog"
      :deleteDialogParams="deleteDialogParams"
      @closeModal="closeModal"
    ></DeleteDialog>
    <div class="card daiteap-content-card">
      <div>
        <CardTitle :title="`Service Details - ${serviceName}`" />
      </div>
      <hr />
      <br />
      <div class="card mb-4">
        <div class="card-header py-3">
          <h6 class="m-0 font-weight-bold text-primary">Release:</h6>
        </div>
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
                  <td v-if="computed_theme == 'daiteap'">{{ item.value }}</td>
                </tr>
              </tbody>
            </table>
            <br />
            <br />
          </div>
        </div>
      </div>

      <ClusterServiceAccess
        title="Connection info"
        :username="connectionInfo.username"
        :password="connectionInfo.password"
        :addresses="connectionInfo.addresses"
        :accessibleFromBrowser="serviceAccessibleFromBrowser"
        :loading="loading"
      />

      <br />
      <div v-if="!loading" class="d-flex">
        <div
          class="custom-button float-right ml-auto mr-5"
          @click="
            $router.push({
              name: 'ClusterDetails',
              params: {
                clusterID: clusterID,
                detailPage: 'overview',
              },
            })
          "
        >
          Back
        </div>
        <div
          class="custom-button float-right ml-5"
          @click="deleteService()"
        >
          Delete Service
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import CardTitle from "@/components/platform/CardTitle";
import axios from "axios";
import DeleteDialog from "./popup_modals/DeleteDialog";
import ClusterServiceAccess from "./ClusterServiceAccess";

export default {
  name: "ServiceDetails",
  data() {
    return {
      loading: false,
      cluster: {},
      releaseInfo: [],
      connectionInfo: {
        username: "",
        password: "",
        addresses: [],
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
    };
  },
  props: {
    clusterID: {
      type: String,
      required: true,
    },
    clusterName: {
      type: String,
      required: true,
    },
    projectID: {
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
    serviceAccessibleFromBrowser: {
      type: Boolean,
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
    CardTitle,
    ClusterServiceAccess,
  },
  created() {
    if (
      this.clusterID == null ||
      this.serviceName == null ||
      this.serviceServiceName == null ||
      this.serviceNamespace == null
    ) {
      this.$router.push({ name: "ProjectList" });
    }
    this.loading = true;

    this.releaseInfo.push({
      key: "Service",
      value: this.serviceServiceName,
    });
    this.releaseInfo.push({
      key: "Namespace",
      value: this.serviceNamespace,
    });
    if (this.service_type.length > 0) {
      this.releaseInfo.push({
        key: "Service Type",
        value: this.service_type,
      });
    }
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
    this.releaseInfo.push({
      key: "Cluster Name",
      value: this.clusterName,
    });

    this.getConnectionInfo(this);
  },
  methods: {
    closeModal() {
      this.$router.push({
        name: "ClusterDetails",
        params: {
          clusterID: this.clusterID,
          detailPage: "overview",
        },
      });
    },
    deleteService() {
      this.deleteDialogParams.requestBody = {
        clusterID: this.clusterID,
        name: this.serviceName,
        namespace: this.serviceNamespace,
      };
      this.deleteDialogParams.text = "Are you sure you want to delete:";
      this.deleteDialogParams.envName = this.serviceName;
      this.deleteDialogParams.endpoint =
        "/server/tenants/" +
        this.computed_active_tenant_id +
        "/clusters/" +
        this.clusterID +
        "/services/" +
        this.serviceName +
        "/" +
        this.serviceNamespace;
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
      axios
        .get(
          "/server/tenants/" +
            self.computed_active_tenant_id +
            "/clusters/" +
            self.clusterID +
            "/services/" +
            self.serviceName +
            "/" +
            self.serviceNamespace +
            "/connection-info",
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
  destroyed() {
    for (let i = 0; i < window.intervals.length; i++) {
      clearInterval(window.intervals[i]);
    }
  },
};
</script>

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
</style>
