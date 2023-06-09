<template>
  <b-modal centered id="bv-modal-detailsvirtualmachine" hide-footer>
    <ConfirmDialog
      modalId="bv-modal-confirmdialogstart"
      v-show="showConfirmDialog"
      :confirmDialogParams="confirmDialogParams"
      @confirm-action="stopMachine()"
    ></ConfirmDialog>
    <ConfirmDialog
      modalId="bv-modal-confirmdialogstop"
      v-show="showConfirmDialog"
      :confirmDialogParams="confirmDialogParams"
      @confirm-action="startMachine()"
    ></ConfirmDialog>
    <ConfirmDialog
      modalId="bv-modal-confirmdialogrestart"
      v-show="showConfirmDialog"
      :confirmDialogParams="confirmDialogParams"
      @confirm-action="restartMachine()"
    ></ConfirmDialog>
    <div v-on:click="closeModal()"></div>
    <div id="textPopupContent">
      <div class="box mb-3">
        <div class="h4 text-center mb-0">{{ machineDetails.name }}</div>
        <br />
        <hr class="mb-4">
        <div class="row p-0 m-0">
          <div class="col-12 mb-4">
            <div><b>Current status: </b>{{ machineDetails.statusText }}</div>
            <div><b>Type: </b>{{ machineDetails.type }}</div>
            <div><b>OS: </b>{{ machineDetails.operating_system }}</div>
          </div>
          <div class="col-4 pr-4">
            <div class="d-flex justify-content-between">
              <div><b>Provider: </b></div>
              <div>{{ machineDetails.provider }}</div>
            </div>
            <div class="d-flex justify-content-between">
              <div><b>Region: </b></div>
              <div>{{ machineDetails.region }}</div>
            </div>
            <div class="d-flex justify-content-between">
              <div><b>Zone: </b></div>
              <div>{{ machineDetails.zone }}</div>
            </div>
          </div>
          <div class="col-4 px-4">
            <div class="d-flex justify-content-between">
              <div><b>Network: </b></div>
              <div>{{ machineDetails.network }}</div>
            </div>
            <div class="d-flex justify-content-between">
              <div><b>Public IP: </b></div>
              <div>{{ machineDetails.publicIP }}</div>
            </div>
            <div class="d-flex justify-content-between">
              <div><b>Private IP: </b></div>
              <div>{{ machineDetails.privateIP }}</div>
            </div>
          </div>
          <div class="col-4 pl-4">
            <div class="d-flex justify-content-between">
              <div><b>CPU: </b></div>
              <div>{{ machineDetails.cpu }} vCPU</div>
            </div>
            <div class="d-flex justify-content-between">
              <div><b>RAM: </b></div>
              <div>{{ machineDetails.ram }} GB</div>
            </div>
            <div class="d-flex justify-content-between">
              <div><b>HDD: </b></div>
              <div>{{ machineDetails.hdd }} GB</div>
            </div>
          </div>
          <div class="col-12 mt-5 d-flex">
            <div
              class="col-3 text-center"
            >
              <b-card-body
                style="border: solid 2px gray; border-radius: 5px;"
                class="p-0 m-0 start"
                :class="machineDetails.status == 10 ? 'baseBlock':'disabledOperation'"
                @click="showStartMachineDialog(machineDetails.id, machineDetails.name); "
              >
                <span style="font-size: 25px">
                  <i class="fas fa-play"></i>
                </span>
                <div>Start machine</div>
              </b-card-body>
            </div>
            <div
              class="col-3 text-center"
            >
              <b-card-body
                style="border: solid 2px gray; border-radius: 5px;"
                class="p-0 m-0 stop"
                :class="machineDetails.status == 0 ? 'baseBlock':'disabledOperation'"
                @click="showStopMachineDialog(machineDetails.id, machineDetails.name); "
              >
                <span style="font-size: 25px">
                  <i class="fas fa-stop"></i>
                </span>
                <div>Stop machine</div>
              </b-card-body>
            </div>
            <div
              class="col-3 text-center"
            >
              <b-card-body
                style="border: solid 2px gray; border-radius: 5px;"
                class="p-0 m-0 restart"
                :class="machineDetails.status == 0 ? 'baseBlock':'disabledOperation'"
                @click="showRestartMachineDialog(machineDetails.id, machineDetails.name); "
              >
                <span style="font-size: 25px">
                  <i class="fas fa-sync-alt"></i>
                </span>
                <div>Restart machine</div>
              </b-card-body>
            </div>
            <div
              class="col-3 text-center"
            >
              <b-card-body
                style="border: solid 2px gray; border-radius: 5px;"
                class="p-0 m-0 disabledOperation"
              >
                <span style="font-size: 25px">
                  <i class="fas fa-trash-alt"></i>
                </span>
                <div>Delete machine</div>
              </b-card-body>
            </div>
          </div>
        </div>
        <b-collapse :visible="showConfirmation" class="mt-3">
          <div class="h4 text-center">{{ confirmDialogParams.text }}</div>
        </b-collapse>

        <div class="text-center mt-4 ">
          <span
            v-if="!showConfirmation"
            v-on:click="closeModal"
            type="button"
            class="btn btn-outline-success col-sm-6 mt-2"
            >Close</span
          >
        </div>
          <b-collapse :visible="showConfirmation" class="form-group col-lg-12 d-flex mb-0">
            <div class="col-lg-12"
            v-if="showConfirmation">
              <input
                v-on:click="confirmAction"
                type="button"
                class="btn btn-outline-success col-lg-4 float-right"
                :value="confirmDialogParams.action"
              />
              <input
                v-on:click="cancelAction"
                type="button"
                class="btn btn-outline-success col-lg-4"
                value="Cancel"
              />
            </div>
          </b-collapse>
      </div>
    </div>
  </b-modal>
</template>

<script>
import ConfirmDialog from "./../popup_modals/ConfirmDialog";

export default {
  name: 'DetailsVirtualMachine',
  components: {
    ConfirmDialog,
  },
  data() {
    return {
      confirmDialogParams: {
        text: "",
        envName: "",
        envId: "",
        action:"",
        payload: {},
      },
      showConfirmDialog: false,
      showConfirmation:false
    };
  },
  props: ["machineDetails"],
  methods: {
    closeModal() {
      this.$bvModal.hide("bv-modal-detailsvirtualmachine");
      this.cancelAction()
    },
    cancelAction(){
      this.showConfirmation = false
      this.confirmDialogParams= {
        text: "",
        envName: "",
        envId: "",
        action: "",
        payload: {}
      }
    },
    confirmAction() {
      let self = this;
      this.axios
        .post(
          self.confirmDialogParams.endpoint,
          self.confirmDialogParams.requestBody,
          this.get_axiosConfig()
        )
        .then(function() {
          if (self.confirmDialogParams.successMessage) {
            self.$notify({
              group: "msg",
              type: "success",
              title: "Notification:",
              text: self.confirmDialogParams.successMessage
            });
          }
          self.closeModal();
        })
        .catch(function(error) {
          console.log(error);
          if (error.response) {
            console.log(error.response.data);
          }
          if (self.confirmDialogParams.failureMessage) {
            self.$notify({
              group: "msg",
              type: "error",
              title: "Notification:",
              text: self.confirmDialogParams.failureMessage
            });
          }
          self.closeModal();
        });
    },
    showStopMachineDialog(id, name) {
      if (this.machineDetails.status == 0){
        this.showConfirmation=true
        this.confirmDialogParams.text =
          'Are you sure you want to stop this machine?';
        this.confirmDialogParams.action = "Stop";
        this.confirmDialogParams.envName = name;
        this.confirmDialogParams.envId = id;
        this.showConfirmDialog = true;
        this.$bvModal.show("bv-modal-confirmdialogstop");
      }
    },
    stopMachine(payload) {
      let self = this;
      const requestBody = {
        clusterID: payload.id,
        machineName: payload.name,
        machineProvider: payload.provider,
      };
      const endpoint =
        "/server/tenants/" +
        this.computed_active_tenant_id +
        "/clusters/" +
        payload.id +
        "/machines/" +
        payload.name +
        "/stop";
      const successMessage =
        'You have successfully submitted stop for "' + payload.name + '".';
      const failureMessage =
        'Error occured while you tried to submit stop of "' + 
        payload.name + '".';

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
          self.$bvModal.hide("bv-modal-confirmdialogstop");
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
          self.$bvModal.hide("bv-modal-confirmdialogstop");
        });
    },
    showStartMachineDialog(id, name) {
      if (this.machineDetails.status == 1){
        this.showConfirmation=true
        this.confirmDialogParams.text =
          'Are you sure you want to start this machine?';
        this.confirmDialogParams.action = "Start";
        this.confirmDialogParams.envId = id;
        this.confirmDialogParams.envName = name;
        this.showConfirmDialog = true;
        this.$bvModal.show("bv-modal-confirmdialogstart");
      }
    },
    startMachine(payload) {
      let self = this;
      const requestBody = {
        clusterID: payload.id,
        machineName: payload.name,
        machineProvider: payload.provider,
      };
      const endpoint =
        "/server/tenants/" +
        this.computed_active_tenant_id +
        "/clusters/" +
        payload.id +
        "/machines/" +
        payload.name +
        "/start";
      const successMessage =
        'You have successfully submitted start for "' + payload.name + '".';
      const failureMessage =
        'Error occured while you tried to submit start of "' + 
        payload.name + '".';

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
          self.$bvModal.hide("bv-modal-confirmdialogstart");
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
          self.$bvModal.hide("bv-modal-confirmdialogstart");
        });
    },
    showRestartMachineDialog(id, name) {
      if (this.machineDetails.status == 0){
        this.showConfirmation=true
        this.confirmDialogParams.text =
          'Are you sure you want to restart this machine?';
        this.confirmDialogParams.action = "Restart";
        this.confirmDialogParams.envId = id;
        this.confirmDialogParams.envName = name;
        this.showConfirmDialog = true;
        this.$bvModal.show("bv-modal-confirmdialogrestart");
      }
    },
    restartMachine(payload) {
      let self = this;
      const requestBody = {
        clusterID: payload.id,
        machineName: payload.name,
        machineProvider: payload.provider,
      };
      const endpoint =
        "/server/tenants/" +
        this.computed_active_tenant_id +
        "/clusters/" +
        payload.id +
        "/machines/" +
        payload.name +
        "/restart";
      const successMessage =
        'You have successfully submitted restart for "' + payload.name + '".';
      const failureMessage =
        'Error occured while you tried to submit restart of "' + 
        payload.name + '".';

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
          self.$bvModal.hide("bv-modal-confirmdialogrestart");
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
          self.$bvModal.hide("bv-modal-confirmdialogrestart");
        });
    },
  },
};
</script>

<style scoped>
</style>
<style scoped>
.modal-content {
  max-width: 750px;
}

#textPopupContent {
  width: 750px;
}
.baseBlock {
  cursor: pointer;
	-moz-transition: all 0.3s cubic-bezier(0.165, 0.84, 0.44, 1);
	-o-transition: all 0.3s cubic-bezier(0.165, 0.84, 0.44, 1);
	transition: all 0.3s cubic-bezier(0.165, 0.84, 0.44, 1);
}

.baseBlock:hover {
	-webkit-transform: translate(0, 2px);
	-moz-transform: translate(0, 2px);
	-ms-transform: translate(0, 2px);
	-o-transform: translate(0, 2px);
	transform: translate(0, 2px);
	box-shadow: 0 10px 10px rgba(0, 0, 0, 0.2);
}
.disabledOperation{
  background-color: rgba(0, 0, 0, 0.08);
}
.baseBlock.stop:hover{
  color:  rgba(207, 29, 29, 0.897);
  box-shadow: 0 10px 10px rgba(207, 29, 29, 0.397);
}
.baseBlock.start:hover{
  color: rgba(50, 133, 34, 0.897);
  box-shadow: 0 10px 10px rgba(50, 133, 34, 0.497);
}
.baseBlock.restart:hover{
  color: rgb(214, 130, 3);
  box-shadow: 0 10px 10px rgba(214, 130, 3, 0.364);
}
</style>