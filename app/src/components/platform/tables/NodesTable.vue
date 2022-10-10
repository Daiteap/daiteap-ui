<template>
  <div>
    <ConfirmDialog
      modalId="bv-modal-confirmdialogstart"
      :confirmDialogParams="confirmDialogParams"
    ></ConfirmDialog>
    <ConfirmDialog
      modalId="bv-modal-confirmdialogstop"
      :confirmDialogParams="confirmDialogParams"
    ></ConfirmDialog>
    <ConfirmDialog
      modalId="bv-modal-confirmdialogrestart"
      :confirmDialogParams="confirmDialogParams"
    ></ConfirmDialog>
    <GenericPopupWarning
      :modalId="'bv-modal-deletenodewarning'"
      :message="`Confirm deleting node: ${nodeForDeletion.name}`"
      @confirm="onNodeDeleteConfirmed"
    />
    <div>
      <b-form-group class="my-4 ml-3">
        <b-form-checkbox-group v-model="selectedeColums" class="row mt-1">
          <div
            class="col-12"
            style="display: flex; justify-content: left; flex-wrap: wrap"
          >
            <b-form-checkbox class="spacing" value="name">Name</b-form-checkbox>
            <b-form-checkbox class="spacing" value="statusText"
              >Status</b-form-checkbox
            >
            <b-form-checkbox class="spacing" value="type"
              >Instance Type</b-form-checkbox
            >
            <b-form-checkbox class="spacing" value="operating_system"
              >OS</b-form-checkbox
            >
            <b-form-checkbox class="spacing" value="provider"
              >Provider</b-form-checkbox
            >
            <b-form-checkbox
              class="spacing"
              v-if="!isCompute"
              value="kube_master"
              >Node Type</b-form-checkbox
            >
            <b-form-checkbox class="spacing" value="publicIP"
              >Public IP</b-form-checkbox
            >
          </div>
          <div
            class="col-12"
            style="display: flex; justify-content: left; flex-wrap: wrap"
          >
            <b-form-checkbox class="spacing" value="privateIP"
              >Private IP</b-form-checkbox
            >
            <b-form-checkbox class="spacing" value="network"
              >Network</b-form-checkbox
            >
            <b-form-checkbox class="spacing" value="region"
              >Region</b-form-checkbox
            >
            <b-form-checkbox class="spacing" value="zone">Zone</b-form-checkbox>
            <b-form-checkbox class="spacing" value="cpu">CPU</b-form-checkbox>
            <b-form-checkbox class="spacing" value="ram">RAM</b-form-checkbox>
            <b-form-checkbox class="spacing" value="hdd">HDD</b-form-checkbox>
          </div>
        </b-form-checkbox-group>
      </b-form-group>
    </div>
    <b-table
      ref="table"
      small
      responsive
      bordered
      hover
      sort-icon-left
      :items="machinesList"
      :fields="fields"
      v-model="shownItems"
    >
      <template slot="actions" slot-scope="data">
        <b-btn size="sm" @click="log(data.item)">Details</b-btn>
      </template>
      <template #cell(provider)="data">
        <img
          v-if="data.item.provider === 'alicloud'"
          title="Alibaba Cloud"
          margin-top="auto"
          margin-bottom="auto"
          class="pr-2"
          height="20pix"
          width="auto"
          src="../../../assets/img/alicloud_logo_small.png"
          alt=""
        />
        <img
          v-if="data.item.provider === 'aws'"
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
          v-if="data.item.provider === 'azure'"
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
          v-if="data.item.provider === 'google'"
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
          v-if="data.item.provider === 'onpremise'"
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
          v-if="data.item.provider === 'iotarm'"
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
          v-if="
            data.item.provider === 'openstack' && computed_theme == 'daiteap'
          "
          title="OpenStack"
          margin-top="auto"
          margin-bottom="auto"
          class="pr-2"
          height="20pix"
          width="auto"
          src="../../../assets/img/openstack_logo_small.png"
          alt=""
        />
      </template>
      <template v-if="!isCompute" #cell(kube_master)="data">
        <span>{{
          data.item.kube_master ? "Control Plane" : "Worker Node"
        }}</span>
      </template>
      <template #cell(cpu)="data">
        <span
          >{{ data.item.cpu ? data.item.cpu : "--" }}<small> vCPU</small></span
        >
      </template>
      <template #cell(statusText)="data">
        <span>
          <b-spinner
            v-if="data.item.status == 100"
            style="width: 1rem; height: 1rem"
            variant="danger"
            class="mr-2"
          ></b-spinner>
          <b-spinner
            v-else-if="data.item.status > 0 && data.item.status != 10"
            style="width: 1rem; height: 1rem"
            variant="info"
            class="mr-2"
          ></b-spinner>
          <span>{{ data.item.statusText }}</span>
        </span>
      </template>
      <template #cell(ram)="data">
        <span
          >{{ data.item.ram ? data.item.ram : "--" }}<small> GB</small></span
        >
      </template>
      <template #cell(hdd)="data">
        <span
          >{{ data.item.hdd ? data.item.hdd : "--" }}<small> GB</small></span
        >
      </template>
      <template v-if="isCompute" #cell(manage)="data">
        <div>
          <b-dropdown
            right
            size="sm"
            boundary="window"
            class="dropDownMenuButton"
            no-caret
          >
            <template #button-content>
              <i
                class="fa fa-ellipsis-v machineoperationsbutton"
                aria-hidden="true"
              ></i>
            </template>
            <b-dropdown-item
              v-if="!computed_isBusinessAccountOwner"
              :disabled="data.item.status != 10 || cluster.resizestep > 0"
              v-on:click="
                startMachine(clusterID, data.item.name, data.item.provider)
              "
            >
              <span>
                <i class="fas fa-play"></i>
                Start machine
              </span>
            </b-dropdown-item>

            <b-dropdown-item
              v-if="!computed_isBusinessAccountOwner"
              :disabled="data.item.status != 0 || cluster.resizestep > 0"
              v-on:click="
                stopMachine(clusterID, data.item.name, data.item.provider)
              "
            >
              <span
                ><i class="fas fa-stop"></i>
                Stop machine
              </span>
            </b-dropdown-item>

            <b-dropdown-item
              v-if="!computed_isBusinessAccountOwner"
              :disabled="data.item.status != 0 || cluster.resizestep > 0"
              v-on:click="
                restartMachine(
                  clusterID,
                  data.item.name,
                  data.item.provider,
                  data.item
                )
              "
            >
              <span>
                <i class="fas fa-sync-alt"></i>
                Restart machine
              </span>
            </b-dropdown-item>

            <b-dropdown-item
              :disabled="
                cluster.installstep > 0 ||
                cluster.resizestep > 0 ||
                data.item.status != 0 ||
                machinesList.length <= 1
              "
              v-on:click="deletePopup(data.item)"
            >
              <span>
                <i class="fas fa-minus"></i>
                Delete machine
              </span>
            </b-dropdown-item>
          </b-dropdown>
        </div>
      </template>
    </b-table>
  </div>
</template>

<script>
import ConfirmDialog from "@/components/platform/popup_modals/ConfirmDialog";
import GenericPopupWarning from "@/components/platform/popup_modals/GenericPopupWarning";

export default {
  name: "NodesTable",
  components: {
    ConfirmDialog,
    GenericPopupWarning,
  },
  props: {
    machinesList: Array,
    isCompute: Boolean,
    cluster: Object,
    clusterID: String,
  },
  data() {
    return {
      shownItems: [],
      selectedeColums: [
        "name",
        "statusText",
        "type",
        "provider",
        "operating_system",
      ],
      fields: [],
      showConfirmDialog: false,
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
      nodeForDeletion: {},
    };
  },
  mounted() {
    if (window.localStorage.getItem("selectedeColums")) {
      this.selectedeColums = window.localStorage
        .getItem("selectedeColums")
        .split(",");
    }
    this.updateColumns();
  },
  watch: {
    selectedeColums() {
      this.updateColumns();
    },
  },
  methods: {
    updateColumns() {
      this.fields = [];
      if (this.selectedeColums.includes("name")) {
        this.fields.push({ key: "name", sortable: true });
      }
      if (this.selectedeColums.includes("statusText")) {
        this.fields.push({
          key: "statusText",
          sortable: true,
          label: "Status",
        });
      }
      if (this.selectedeColums.includes("type")) {
        this.fields.push({
          key: "type",
          sortable: true,
          label: "Instance Type",
        });
      }
      if (this.selectedeColums.includes("operating_system")) {
        this.fields.push({ key: "operating_system", sortable: true });
      }
      if (this.selectedeColums.includes("provider")) {
        this.fields.push({ key: "provider", sortable: true });
      }
      if (!this.isCompute) {
        if (this.selectedeColums.includes("kube_master")) {
          this.fields.push({
            key: "kube_master",
            sortable: true,
            label: "Node Type",
          });
        }
      }
      if (this.selectedeColums.includes("publicIP")) {
        this.fields.push({ key: "publicIP", sortable: true });
      }
      if (this.selectedeColums.includes("privateIP")) {
        this.fields.push({ key: "privateIP", sortable: true });
      }
      if (this.selectedeColums.includes("network")) {
        this.fields.push({ key: "network", sortable: true });
      }
      if (this.selectedeColums.includes("region")) {
        this.fields.push({ key: "region", sortable: true });
      }
      if (this.selectedeColums.includes("zone")) {
        this.fields.push({ key: "zone", sortable: true });
      }
      if (this.selectedeColums.includes("cpu")) {
        this.fields.push({ key: "cpu", sortable: true, label: "CPU" });
      }
      if (this.selectedeColums.includes("ram")) {
        this.fields.push({ key: "ram", sortable: true, label: "RAM" });
      }
      if (this.selectedeColums.includes("hdd")) {
        this.fields.push({ key: "hdd", sortable: true, label: "HDD" });
      }
      if (this.isCompute) {
        this.fields.push({
          key: "manage",
          sortable: false,
          label: "Operations",
        });
      }
      if (this.$refs.table) {
        this.$refs.table.refresh();
      }
      window.localStorage.setItem("selectedeColums", this.selectedeColums);
    },
    stopMachine(id, name, provider) {
      this.confirmDialogParams.requestBody = {
        clusterID: id,
        machineName: name,
        machineProvider: provider,
      };
      this.confirmDialogParams.text = "Are you sure you want to stop machine:";
      this.confirmDialogParams.endpoint = "/server/stopMachine";
      this.confirmDialogParams.action = "Stop";
      this.confirmDialogParams.envName = name;
      this.confirmDialogParams.envId = id;
      this.confirmDialogParams.successMessage =
        'You have successfully submitted stop for "' + name + '".';
      this.confirmDialogParams.failureMessage =
        'Error occured while you tried to submit stop of "' + name + '".';
      this.showConfirmDialog = true;
      this.$bvModal.show("bv-modal-confirmdialogstop");
    },
    startMachine(id, name, provider) {
      this.confirmDialogParams.requestBody = {
        clusterID: id,
        machineName: name,
        machineProvider: provider,
      };
      this.confirmDialogParams.text = "Are you sure you want to start machine:";
      this.confirmDialogParams.action = "Start";
      this.confirmDialogParams.envId = id;
      this.confirmDialogParams.envName = name;
      this.confirmDialogParams.endpoint = "/server/startMachine";
      this.confirmDialogParams.successMessage =
        'You have successfully submitted start for "' + name + '".';
      this.confirmDialogParams.failureMessage =
        'Error occured while you tried to submit start of "' + name + '".';
      this.showConfirmDialog = true;
      this.$bvModal.show("bv-modal-confirmdialogstart");
    },
    restartMachine(id, name, provider) {
      this.confirmDialogParams.requestBody = {
        clusterID: id,
        machineName: name,
        machineProvider: provider,
      };
      this.confirmDialogParams.text =
        "Are you sure you want to restart machine:";
      this.confirmDialogParams.action = "Restart";
      this.confirmDialogParams.envId = id;
      this.confirmDialogParams.envName = name;
      this.confirmDialogParams.endpoint = "/server/restartMachine";
      this.confirmDialogParams.successMessage =
        'You have successfully submitted stop for "' + name + '".';
      this.confirmDialogParams.failureMessage =
        'Error occured while you tried to submit stop of "' + name + '".';
      this.showConfirmDialog = true;
      this.$bvModal.show("bv-modal-confirmdialogrestart");
    },
    deletePopup(nodeForDeletion) {
      this.nodeForDeletion = nodeForDeletion;
      this.$bvModal.show("bv-modal-deletenodewarning");
    },
    async onNodeDeleteConfirmed() {
      this.$bvModal.hide("bv-modal-deletenodewarning");

      let nodeID = this.nodeForDeletion.id;

      await this.removeComputeNode(nodeID);
    },
  },
};
</script>

<style scoped>
.spacing {
  margin-right: 40px;
  margin-top: 5px;
}
</style>