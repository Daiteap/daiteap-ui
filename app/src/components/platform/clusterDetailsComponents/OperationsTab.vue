<template>
  <div class="row">
    <ConfirmDialog
      modalId="bv-modal-confirmdialogoperationsstart"
      v-show="showConfirmDialog"
      :confirmDialogParams="confirmDialogParams"
      @confirm-action="startCluster"
    ></ConfirmDialog>
    <ConfirmDialog
      modalId="bv-modal-confirmdialogoperationsstop"
      v-show="showConfirmDialog"
      :confirmDialogParams="confirmDialogParams"
      @confirm-action="stopCluster"
    ></ConfirmDialog>
    <ConfirmDialog
      modalId="bv-modal-confirmdialogoperationsrestart"
      v-show="showConfirmDialog"
      :confirmDialogParams="confirmDialogParams"
      @confirm-action="restartCluster"
    ></ConfirmDialog>
    <SaveEnvironmentTemplate
      ref="saveAsTemplate"
      v-show="showSaveEnvironmentTemplate"
      :clusterName="cluster.title"
      :templateClusterId="templateClusterId"
      @saveEnvironmentAsTemplate="saveEnvironmentAsTemplate"
    ></SaveEnvironmentTemplate>
    <GenericPopupWarning
      :message="`Confirm deleting cluster: ${clusterToRemove.name}`"
      @confirm="deleteCluster(clusterToRemove)"
      :modalId="popupId"
    />
    <EditClusterPopup
      v-if="showEditClusterPopup"
      :currentCluster="clusterToEdit"
      :oldName="clusterToEditName"
      @updateCluster="updateCluster"
      :isCompute="cluster.clusterType == 2 || cluster.clusterType == 6"
    />
    <div class="card mb-4 w-100">
      <div class="card-header py-3 cardHeaderLight">
        <h6 class="m-0 font-weight-bold">Operations:</h6>
      </div>
      <div class="card-body">
        <div style="display: flex; justify-content: space-between">
          <div class="custom-button" @click="openEditPopup(cluster)">
            <i class="fas fa-edit"></i>&nbsp; Edit
          </div>

          <div
            class="custom-button"
            :class="[
              cluster.installstep > 0 || cluster.resizestep > 0
                ? 'deactivated'
                : '',
            ]"
            @click="
              deleteClusterPopup(clusterID, cluster.title, cluster.clusterType)
            "
          >
            <i class="far fa-trash-alt" style="color: red"></i>&nbsp; Delete
          </div>

          <div
            class="custom-button"
            v-if="computed_account_settings.enable_templates"
            :class="[
              cluster.installstep == 1 || cluster.resizestep > 0
                ? 'deactivated'
                : '',
            ]"
            @click="templateCluster(clusterID)"
          >
            <i class="fas fa-save"></i>&nbsp; Template
          </div>

          <div
            class="custom-button"
            v-if="
              cluster.installstep == 0 &&
              cluster.clusterType != 2 &&
              cluster.clusterType != 6
            "
            @click="downloadKubeconfig(clusterID)"
          >
            Kubeconfig
          </div>
        </div>

        <br v-if="cluster.clusterType != 2 && cluster.clusterType != 6" />

        <div
          v-if="cluster.clusterType != 2 && cluster.clusterType != 6"
          style="display: flex; justify-content: space-between"
        >
          <div
            class="custom-button"
            v-if="cluster.clusterType != 5 && cluster.clusterType != 8"
            :class="[
              cluster.status != 10 || cluster.resizestep > 0
                ? 'deactivated'
                : '',
            ]"
            @click="showStartClusterDialog(clusterID, cluster.title)"
          >
            <i class="fas fa-play"></i>&nbsp; Start
          </div>

          <div
            class="custom-button"
            v-if="cluster.clusterType != 5 && cluster.clusterType != 8"
            :class="[
              cluster.status != 0 || cluster.resizestep > 0
                ? 'deactivated'
                : '',
            ]"
            @click="showStopClusterDialog(clusterID, cluster.title)"
          >
            <i class="fas fa-stop-circle"></i>&nbsp; Stop
          </div>

          <div
            class="custom-button"
            v-if="cluster.clusterType != 5 && cluster.clusterType != 8"
            :class="[
              cluster.status != 0 || cluster.resizestep > 0
                ? 'deactivated'
                : '',
            ]"
            @click="showRestartClusterDialog(clusterID, cluster.title)"
          >
            <i class="fas fa-sync-alt"></i>&nbsp; Restart
          </div>

          <div
            class="custom-button"
            v-if="
              cluster.clusterType != 5 &&
              cluster.clusterType != 8 &&
              computed_account_settings.enable_cluster_resize
            "
            :class="[
              cluster.status != 0 ||
              cluster.installstep != 0 ||
              cluster.resizestep > 0
                ? 'deactivated'
                : '',
            ]"
            @click="resizeDLCMCluster(clusterID)"
          >
            <i class="fas fa-plus-square"></i>&nbsp; Resize
          </div>

          <div
            class="custom-button"
            v-if="
              cluster.clusterType == 5 &&
              computed_account_settings.enable_cluster_resize
            "
            :class="[
              cluster.status != 0 ||
              cluster.installstep != 0 ||
              cluster.resizestep > 0
                ? 'deactivated'
                : '',
            ]"
            @click="resizeCapiCluster(clusterID)"
          >
            <i class="fas fa-plus-square"></i>&nbsp; Resize
          </div>

          <div
            class="custom-button"
            v-if="
              cluster.clusterType == 8 &&
              computed_account_settings.enable_cluster_resize
            "
            :class="[
              cluster.status != 0 ||
              cluster.installstep != 0 ||
              cluster.resizestep > 0
                ? 'deactivated'
                : '',
            ]"
            @click="resizeYaookCluster(clusterID)"
          >
            <i class="fas fa-plus-square"></i>&nbsp; Resize
          </div>

          <div
            class="custom-button"
            v-if="cluster.installstep == 0 && cluster.clusterType == 8"
            @click="downloadWireguardConfig(clusterID)"
          >
            Wireguard
          </div>
        </div>
      </div>
    </div>
    <br />
  </div>
</template>

<script>
import ConfirmDialog from "@/components/platform/popup_modals/ConfirmDialog";
import SaveEnvironmentTemplate from "@/components/platform/popup_modals/SaveEnvironmentTemplate";
import GenericPopupWarning from "@/components/platform/popup_modals/GenericPopupWarning";
import EditClusterPopup from "@/components/platform/popup_modals/EditClusterPopup";

export default {
  name: "OperationsTab",
  components: {
    ConfirmDialog,
    SaveEnvironmentTemplate,
    GenericPopupWarning,
    EditClusterPopup,
  },
  props: {
    cluster: Object,
    clusterID: String,
  },
  data() {
    return {
      showAlert: false,
      alertKey: 0,
      showSaveEnvironmentTemplate: false,
      templateClusterId: "",
      showConfirmDialog: false,
      confirmDialogParams: {
        text: "",
        envName: "",
        envId: "",
        action: "",
        payload: {},
      },
      clusterToRemove: {
        id: 0,
        name: "",
        type: 0,
      },
      popupId: "clusterdeletewarning",
      clusterToEdit: {},
      clusterToEditName: "",
      showEditClusterPopup: false,
    };
  },
  methods: {
    templateCluster(clusterID) {
      this.templateClusterId = clusterID;
      this.$bvModal.show("bv-modal-saveenvironmenttemplate");
    },
    saveEnvironmentAsTemplate(templateForm) {
      let self = this;

      this.axios
        .post(
          "/server/tenants/" +
            this.computed_active_tenant_id +
            "/clusters/" +
            templateForm.environmentId +
            "/template",
          templateForm,
          this.get_axiosConfig()
        )
        .then(
          self.$notify({
            group: "msg",
            type: "success",
            title: "Notification:",
            text: "Successfully submitted template creation request",
          })
        )
        .catch(function (error) {
          console.log(error);
          if (error.response && error.response.status == "403") {
            self.$notify({
              group: "msg",
              type: "error",
              title: "Notification:",
              text: "Access Denied",
            });
          } else {
            self.$notify({
              group: "msg",
              type: "error",
              title: "Notification:",
              text: "Error while saving Template! " + error,
            });
          }
        });
    },
    async deleteCluster(clusterToRemove) {
      this.$bvModal.hide(this.popupId);

      let request = {
        ID: clusterToRemove.id,
        Type: clusterToRemove.type,
        Name: clusterToRemove.name,
      };

      await this.deleteClusterMain(request);

      if (this.cluster.clusterType == 2 || this.cluster.clusterType == 6) {
        this.$router.push({
          name: "ComputeOverviewAll",
        });
      } else {
        this.$router.push({
          name: "KubernetesClusterList",
        });
      }
    },
    deleteClusterPopup(id, name, type) {
      this.clusterToRemove.id = id;
      this.clusterToRemove.name = name;
      this.clusterToRemove.type = type;
      this.$bvModal.show(this.popupId);
    },
    showStopClusterDialog(id, name) {
      this.confirmDialogParams.text = "Are you sure you want to stop";
      this.confirmDialogParams.envName = name;
      this.confirmDialogParams.envId = id;
      this.confirmDialogParams.action = "Stop";
      this.confirmDialogParams.payload = {
        "id": id,
        "name": name,
      };
      this.showConfirmDialog = true;
      this.$bvModal.show("bv-modal-confirmdialogoperationsstop");
    },
    stopCluster(cluster_id, cluster_name) {
      let self = this;
      const requestBody = {
        clusterID: cluster_id,
      };
      const endpoint =
        "/server/tenants/" +
        this.computed_active_tenant_id +
        "/clusters/" +
        cluster_id +
        "/stop";
      const successMessage =
        'You have successfully submitted stop for "' + cluster_name + '".';
      const failureMessage =
        'Error occured while you tried to submit stop of "' + 
        cluster_name + '".';

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
              text: successMessage,
            });
          }
          self.showConfirmDialog = false;
          self.$bvModal.hide("bv-modal-confirmdialogoperationsstop");
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
          self.$bvModal.hide("bv-modal-confirmdialogoperationsstop");
        });
    },
    showStartClusterDialog(id, name) {
      this.confirmDialogParams.text = "Are you sure you want to start";
      this.confirmDialogParams.envName = name;
      this.confirmDialogParams.envId = id;
      this.confirmDialogParams.action = "Start";
      this.confirmDialogParams.payload = {
        "id": id,
        "name": name,
      };
      this.showConfirmDialog = true;
      this.$bvModal.show("bv-modal-confirmdialogoperationsstart");
    },
    startCluster(cluster_id, cluster_name) {
      let self = this;
      const requestBody = {
        clusterID: cluster_id,
      };
      const endpoint =
        "/server/tenants/" +
        this.computed_active_tenant_id +
        "/clusters/" +
        cluster_id +
        "/start";
      const successMessage =
        'You have successfully submitted start for "' + cluster_name + '".';
      const failureMessage =
        'Error occured while you tried to submit start of "' + 
        cluster_name + '".';

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
              text: successMessage,
            });
          }
          self.showConfirmDialog = false;
          self.$bvModal.hide("bv-modal-confirmdialogoperationsstart");
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
          self.$bvModal.hide("bv-modal-confirmdialogoperationsstart");
        });
    },
    showRestartClusterDialog(id, name) {
      this.confirmDialogParams.text = "Are you sure you want to restart";
      this.confirmDialogParams.envName = name;
      this.confirmDialogParams.envId = id;
      this.confirmDialogParams.action = "Restart";
      this.confirmDialogParams.payload = {
        "id": id,
        "name": name,
      };
      this.showConfirmDialog = true;
      this.$bvModal.show("bv-modal-confirmdialogoperationsrestart");
    },
    restartCluster(cluster_id, cluster_name) {
      let self = this;
      let requestBody = {
        clusterID: cluster_id,
      };
      let endpoint =
        "/server/tenants/" +
        this.computed_active_tenant_id +
        "/clusters/" +
        cluster_id +
        "/restart";
      let successMessage =
        'You have successfully submitted restart for "' + cluster_name + '".';
      let failureMessage =
        'Error occured while you tried to submit restart of "' + 
        cluster_name + '".';

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
              text: successMessage,
            });
          }
          self.showConfirmDialog = false;
          self.$bvModal.hide("bv-modal-confirmdialogoperationsrestart");
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
          self.$bvModal.hide("bv-modal-confirmdialogoperationsrestart");
        });
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
          if (error.response && error.response.status == "403") {
            self.$notify({
              group: "msg",
              type: "error",
              title: "Notification:",
              text: "Access Denied",
            });
          } else {
            self.$notify({
              group: "msg",
              type: "error",
              title: "Notification:",
              text: "Error while downloading Kubeconfig file! " + error,
            });
          }
        });
    },
    downloadWireguardConfig(id) {
      let self = this;
      this.axios
        .get(
          "/server/tenants/" +
            this.computed_active_tenant_id +
            "/clusters/" +
            id +
            "/wireguard-config",
          this.get_axiosConfig()
        )
        .then(function (response) {
          const url = window.URL.createObjectURL(
            new Blob([response.data["wireguardconfig"]])
          );
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", "wg0.conf");
          document.body.appendChild(link);
          link.click();
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
          } else {
            self.$notify({
              group: "msg",
              type: "error",
              title: "Notification:",
              text: "Error while downloading Wireguard file! " + error,
            });
          }
        });
    },
    openEditPopup(cluster) {
      this.clusterToEdit = cluster;
      this.clusterToEdit.Name = cluster.title;
      this.clusterToEdit.Description = cluster.description;
      this.clusterToEdit.type = cluster.clusterType;
      this.clusterToEditName = cluster.title;
      this.showEditClusterPopup = true;
      this.$nextTick(function () {
        this.$bvModal.show("bv-modal-editcluster");
      });
    },
    updateCluster(cluster) {
      let self = this;
      this.axios
        .put(
          "/server/tenants/" +
            this.computed_active_tenant_id +
            "/clusters/" +
            this.clusterID,
          {
            name: cluster.Name,
            description: cluster.Description,
          },
          this.get_axiosConfig()
        )
        .then(function () {
          self.$notify({
            group: "msg",
            type: "success",
            title: "Notification:",
            text: "Successfuly updated cluster!",
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
            self.$notify({
              group: "msg",
              type: "error",
              title: "Notification:",
              text: "Error while updating cluster.",
            });
          }
        });
    },
    resizeCapiCluster(clusterID) {
      this.$router.push({
        name: "ResizeCapiCluster",
        params: {
          clusterID: clusterID,
        },
      });
    },
    resizeYaookCluster(clusterID) {
      this.$router.push({
        name: "ResizeYaookCluster",
        params: {
          clusterID: clusterID,
        },
      });
    },
    resizeDLCMCluster(clusterID) {
      this.$router.push({
        name: "ResizeDLCMCluster",
        params: {
          clusterID: clusterID,
        },
      });
    },
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