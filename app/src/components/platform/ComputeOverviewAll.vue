<template>
  <div>
    <DetailsVirtualMachine
      v-show="showDetailsVirtualMachine"
      :machineDetails="machineDetails"
    ></DetailsVirtualMachine>
    <div class="card daiteap-content-card">
      <div class="d-flex justify-content-between cardHeaderLight">
        <span class="fa-stack landing-page-icon">
          <i class="fas fa-square fa-stack-2x" style="line-height: 1.5;"></i>
          <i class="fas fa-laptop-code fas fa-stack-1x fa-inverse" style="line-height: 3;"></i>
        </span>
        <CardTitle title="Compute (VMs)" style="line-height: 2;" />
        <span class="text-right h4 ml-auto">
          <AddButton text='Add Compute (VM)' @onClickAddButton="$router.push('createvms')" />
        </span>
      </div>
      <div>
        <br />
        Find all your Compute Engines below. Filter according your information
        requirement.
      </div>
      <div>
        Click on the button in operations column to manage your Compute Engines.
        <br />
      </div>
      <hr />
      <div>
        <div v-if="loading" class="d-flex justify-content-center">
          <div class="spinner-border" role="status"></div>
        </div>
        <div v-else>
          <ComputeOverviewTable :tenantID="tenantID" />
        </div>
      </div>
    </div>
    <br />
  </div>
</template>

<script>
import CardTitle from "@/components/platform/CardTitle";
import ComputeOverviewTable from "@/components/platform/tables/ComputeOverviewTable";
import AddButton from "@/components/platform/AddButton";
import DetailsVirtualMachine from "@/components/platform/popup_modals/DetailsVirtualMachine";

export default {
  name: "ComputeOverviewAll",
  components: {
    CardTitle,
    ComputeOverviewTable,
    AddButton,
    DetailsVirtualMachine,
  },
  data() {
    return {
      machinesList: [],
      clusterID: "",
      cluster: {},
      clustersList: [],
      shownItems: [],
      showDetailsVirtualMachine: false,
      selectedeColums: [
        "name",
        "project",
        "statusText",
        "type",
        "provider",
        "operating_system",
      ],
      fields: [],
      machineDetails: {},
      loading: false,
    };
  },
  props: {
    tenantID: String,
  },
  mounted() {
    this.getClustersList();

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
    async getClusterDetails(currentObject) {
      let self = currentObject;
      self.cluster = await this.getClusterDetailsMain(self.clusterID);

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

        self.cluster.machinesList[i].project = self.cluster.project_name;

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

      self.machinesList.push(...self.cluster.machinesList);

      self.loading = false;
    },
    async getClustersList() {
      let self = this;

      let clusters;
        clusters = await this.getAllClusters();

      self.clustersList = [];
      for (let i = 0; i < clusters.length; i++) {
        self.clustersList[i] = {
          Name: "",
          Status: "",
          ID: "",
        };
        self.clustersList[i].Name = clusters[i].name;
        self.clustersList[i].ID = clusters[i].id;
        self.clustersList[i].InstallStep = clusters[i].installstep;
        self.clustersList[i].Type = clusters[i].type;
        self.clustersList[i].Status = clusters[i].status;
        self.clustersList[i].CreatedAt = new Date(clusters[i].created_at);
        self.clustersList[i].ErrorMsgDelete = clusters[i].error_msg_delete;
        self.clustersList[i].Providers = "";
        self.clustersList[i].MachinesCount = clusters[i].machines_count;
        self.clustersList[i].ServicesCount = clusters[i].services_count;
        self.clustersList[i].UsersCount = clusters[i].users_count;

        if (
          self.clustersList[i].InstallStep == 0 ||
          self.clustersList[i].InstallStep == undefined
        ) {
          if (
            self.clustersList[i].Status == 0 &&
            self.clustersList[i].InstallStep == undefined
          ) {
            self.clustersList[i].Status = "not created";
          } else if (self.clustersList[i].Status == 0) {
            self.clustersList[i].Status = "running";
          } else if (self.clustersList[i].Status == 1) {
            self.clustersList[i].Status = "starting";
          } else if (self.clustersList[i].Status == -1) {
            self.clustersList[i].Status = "error starting";
          } else if (self.clustersList[i].Status == 2) {
            self.clustersList[i].Status = "stopping";
          } else if (self.clustersList[i].Status == -2) {
            self.clustersList[i].Status = "error stopping";
          } else if (self.clustersList[i].Status == 3) {
            self.clustersList[i].Status = "restarting";
          } else if (self.clustersList[i].Status == -3) {
            self.clustersList[i].Status = "error restarting";
          } else if (self.clustersList[i].Status == 10) {
            self.clustersList[i].Status = "stopped";
          }
        } else if (self.clustersList[i].InstallStep == 100) {
          self.clustersList[i].Status = self.clusterDeletingStatus;
        } else if (self.clustersList[i].InstallStep < 0) {
          self.clustersList[i].Status = "error";
        } else {
          self.clustersList[i].Status = "loading";
        }
      }

      self.loadingStatusesInfo = false;

      for (let i = 0; i < self.clustersList.length; i++) {
        if (self.clustersList[i].Type == 2 || self.clustersList[i].Type == 6) {
          self.cluster = self.clustersList[i];
          self.clusterID = self.cluster.ID;
          self.getClusterDetails(self);
        }
      }
    },
    updateColumns() {
      this.fields = [];
      if (this.selectedeColums.includes("name")) {
        this.fields.push({ key: "name", sortable: true });
      }
      if (this.selectedeColums.includes("project")) {
        this.fields.push({ key: "project", sortable: true });
      }
      if (this.selectedeColums.includes("statusText")) {
        this.fields.push({
          key: "statusText",
          sortable: true,
          label: "Status",
        });
      }
      if (this.selectedeColums.includes("type")) {
        this.fields.push({ key: "type", sortable: true });
      }
      if (this.selectedeColums.includes("operating_system")) {
        this.fields.push({ key: "operating_system", sortable: true });
      }
      if (this.selectedeColums.includes("provider")) {
        this.fields.push({ key: "provider", sortable: true });
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
      if (this.selectedeColums.includes("manage")) {
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
    updateSelectedMachineDetails(machine) {
      this.machineDetails = machine;
      this.showDetailsVirtualMachine = true;
      this.$bvModal.show("bv-modal-detailsvirtualmachine");
    },
    resizeStatus(reiszeStep, type) {
      let currentStatus = "";
      if (type == 1) {
        if (reiszeStep >= 1 && reiszeStep <= 3) {
          currentStatus = "Creating machines";
        }
        if (reiszeStep >= 4 && reiszeStep <= 10) {
          currentStatus = "Configuring machines";
        }
        if (reiszeStep >= 11 && reiszeStep <= 14) {
          currentStatus = "Adding machines to Kubernetes";
        }
        if (reiszeStep == 0) {
          currentStatus = "";
        }
        if (reiszeStep <= -1 && reiszeStep >= -3) {
          currentStatus = "Creating machines error";
        }
        if (reiszeStep <= -4 && reiszeStep >= -10) {
          currentStatus = "Error configuring machines";
        }
        if (reiszeStep <= -11 && reiszeStep >= -14) {
          currentStatus = "Error adding machines to Kubernetes";
        }
      }
      if (type == 2) {
        if (reiszeStep >= 1 && reiszeStep <= 3) {
          currentStatus = "Creating machines";
        }
        if (reiszeStep >= 4 && reiszeStep <= 10) {
          currentStatus = "Configuring machines";
        }
        if (reiszeStep == 0) {
          currentStatus = "";
        }
        if (reiszeStep <= -1 && reiszeStep >= -3) {
          currentStatus = "Creating machines error";
        }
        if (reiszeStep <= -4 && reiszeStep >= -10) {
          currentStatus = "Error configuring machines";
        }
      }
      return currentStatus;
    },
  },
};
</script>

