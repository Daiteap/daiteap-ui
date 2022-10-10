<template>
  <div class="table-responsive">
    <table
      class="table table-bordered"
      id="dataTable"
      width="100%"
      cellspacing="0"
    >
      <thead>
        <tr>
          <th>Name</th>
          <th>Service Name</th>
          <th>Namespace</th>
          <th>Providers</th>
          <th>Address</th>
          <th>Status</th>
          <th>Service Type</th>
          <th>Delete</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in servicesList" :key="item.clusterName + item.name">
          <td
            v-if="item.status == 0"
            :class="'clickForDetails'"
            @click="goToServiceDetails(item)"
          >
            {{ item.name }}
          </td>
          <td v-else>
            {{ item.name }}
          </td>
          <td>
            {{ item.service__name }}
          </td>
          <td>
            {{ item.namespace }}
          </td>
          <td>
            <img
              v-if="item.providers.indexOf('Amazon Web Services') >= 0"
              title="AWS"
              margin-top="auto"
              margin-bottom="auto"
              class="pr-2"
              height="20pix"
              width="auto"
              src="../../../assets/img/aws_logo_small.png"
              alt=""
            />
            <img
              v-if="item.providers.indexOf('Azure') >= 0"
              title="Azure"
              margin-top="auto"
              margin-bottom="auto"
              class="pr-2"
              height="20pix"
              width="auto"
              src="../../../assets/img/azure_logo_small.png"
              alt=""
            />
            <img
              v-if="item.providers.indexOf('Google') >= 0"
              title="Google Cloud"
              margin-top="auto"
              margin-bottom="auto"
              class="pr-2"
              height="20pix"
              width="auto"
              src="../../../assets/img/googleCloud_logo_small.png"
              alt=""
            />
            <img
              v-if="item.providers.indexOf('OnPremise') >= 0"
              title="on-premise"
              margin-top="auto"
              margin-bottom="auto"
              class="pr-2"
              height="20pix"
              width="auto"
              src="../../../assets/img/onpremise.svg"
              alt=""
            />
            <img
              v-if="item.providers.indexOf('IotArm') >= 0"
              title="IoT-ARM"
              margin-top="auto"
              margin-bottom="auto"
              class="pr-2"
              height="20pix"
              width="auto"
              src="../../../assets/img/IoTArm_logo_small.svg"
              alt=""
            />
            <img
              v-if="item.providers.indexOf('Openstack') >= 0 && computed_theme == 'daiteap'"
              title="OpenStack"
              margin-top="auto"
              margin-bottom="auto"
              class="pr-2"
              height="20pix"
              width="auto"
              src="../../../assets/img/openstack_logo_small.png"
              alt=""
            />
          </td>
          <td>
            <div
              v-for="address in item.connectionInfo.addresses"
              :key="address"
            >
              <a v-if="item.service__accessible_from_browser" :href="'http://' + address" target="_blank" rel="noopener noreferrer">{{ address }}</a>
              <span v-else >{{ address }}</span>
            </div>
          </td>
          <td>
            <span v-if="item.status == 1"
              ><b-spinner
                style="width: 1rem; height: 1rem"
                variant="success"
                class="mr-2"
              ></b-spinner
              >{{ serviceStatus(item.status) }}</span
            >
            <span v-else-if="item.status == 10"
              ><b-spinner
                style="width: 1rem; height: 1rem"
                variant="danger"
                class="mr-2"
              ></b-spinner
              >{{ serviceStatus(item.status) }}</span
            >
            <span v-else>{{ serviceStatus(item.status) }}</span>
          </td>
          <td>
            {{ item.service_type }}
          </td>
          <td>
            <div class="pl-2">
              <div
                title="Delete service"
                class="far fa-trash-alt removeAccountIcon"
                @click="deleteService(item)"
              ></div>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
    <DeleteDialogService :deleteDialogParams="deleteDialogParams" />
  </div>
</template>

<script>
import DeleteDialogService from "@/components/platform/popup_modals/DeleteDialogService";

export default {
  name: 'ServicesTable',
  props: {
    servicesList: Array,
  },
  data() {
    return {
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
  created() {
  },
  components: { DeleteDialogService },
  methods: {
    deleteService(service) {
      this.deleteDialogParams.requestBody = {
        clusterID: service.clusterId,
        name: service.name,
        namespace: service.namespace,
      };
      this.deleteDialogParams.text = "Are you sure you want to delete:";
      this.deleteDialogParams.envName = service.name;
      this.deleteDialogParams.endpoint = "/server/deleteService";
      this.deleteDialogParams.successMessage =
        'You have successfully submitted deletion for "' + service.name + '".';
      this.deleteDialogParams.failureMessage =
        'Error occured while you tried to submit deletion of "' +
        this.name +
        '".';
      this.showDeleteDialog = true;
      this.$bvModal.show("bv-modal-servicedeletedialog");
    },
    goToServiceDetails(service) {
      for (let i = 0; i < window.intervals.length; i++) {
        clearInterval(window.intervals[i]);
      }
      this.$router.push({
        name: "ServiceDetails",
        params: {
          clusterID: service.clusterId,
          clusterName: service.clusterName,
          projectID: service.projectID,
          serviceName: service.name,
          serviceServiceName: service.service__name,
          serviceAccessibleFromBrowser: service.service__accessible_from_browser,
          serviceNamespace: service.namespace,
          service_type: service.service_type,
          providers: service.providers,
        },
      });
    },
    serviceStatus(status) {
      let statusDescription = "";
      if (status == 1) {
        statusDescription = "Deploying";
      } else if (status == -1) {
        statusDescription = "Error Deploying";
      } else if (status == 10) {
        statusDescription = "Deleting";
      } else if (status == -10) {
        statusDescription = "Error Deleting";
      } else if (status == 0) {
        statusDescription = "Installed";
      }
      return statusDescription;
    },
  },
};
</script>

<style scoped>
.removeAccountIcon {
  cursor: pointer;
  align-content: center;
  font-size: 1.5rem;
  padding-top: 0.2rem;
  color: #ea002f;
}
</style>
