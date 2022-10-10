<template>
  <b-modal centered id="bv-modal-deletedialog" hide-footer>
    <div v-on:click="closeModal()"></div>
    <div>
      <div class="box mb-3">
        <div class="h4 text-center">
          <i class="fas fa-exclamation-triangle waring-modal-icon"></i> {{ deleteDialogParams.text }}
        </div>
        <hr />
        <br />
        <div>
          <div>
            <h2 class="text-center">{{ deleteDialogParams.envName }}</h2>
            <h4 class="text-center">{{ deleteDialogParams.envId }}</h4>
          </div>
          <br />
          <hr />
          <br />
          <div class="form-group col-lg-12 d-flex">
            <div class="col-lg-12">
              <div
                class="custom-button col-lg-4 float-right"
                @click="confirmAction()"
              >
                {{ deleteDialogParams.text.includes('cancel') ? 'Confirm' : 'Delete' }}
              </div>
              <div
                class="custom-button col-lg-4"
                @click="closeModal()"
              >
                Cancel
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
  </b-modal>
</template>

<script>
export default {
  name: 'DeleteDialog',
  props: ["deleteDialogParams"],
  methods: {
    closeModal() {
      this.$bvModal.hide("bv-modal-deletedialog");
      this.$router.push({ name: "KubernetesClusterList" });
    },
    confirmAction() {
      let self = this;
      this.axios
        .post(
          self.deleteDialogParams.endpoint,
          self.deleteDialogParams.requestBody,
          this.get_axiosConfig()
        )
        .then(function () {
          if (self.deleteDialogParams.successMessage) {
            self.$notify({
              group: "msg",
              type: "success",
              title: "Notification:",
              text: self.deleteDialogParams.successMessage,
            });
          }
          if (self.deleteDialogParams.endpoint=="/server/deleteService"){
            self.$bvModal.hide("bv-modal-deletedialog");
            self.$emit('closeModal');
          } else if (self.deleteDialogParams.endpoint=="/server/environmenttemplates/delete"){
            self.closeModal();
          } else if (self.deleteDialogParams.endpoint=="/server/deleteCapiCluster" ||
                      self.deleteDialogParams.endpoint=="/server/deleteCluster"){
            self.closeModal();
          } else {
            if (self.deleteDialogParams.redirectPage){
              self.$router.push({ name: self.deleteDialogParams.redirectPage })
            } else {
              self.$router.push({ name: "ProjectList" });
            }
          }
        })
        .catch(function (error) {
          console.log(error);
          if (error.response) {
            error= error.response.data.error.message;
          }
          if (self.deleteDialogParams.failureMessage) {
            self.$notify({
              group: "msg",
              type: "error",
              title: "Notification:",
              text: self.deleteDialogParams.failureMessage,
            });
          } else {
            self.$notify({
              group: "msg",
              type: "error",
              title: "Notification:",
              text: "Error deleting template: " + error,
            });
          }
          self.closeModal();
        });
    },
  },
};
</script>

<style scoped>


.btn-success {
  margin-right: 20px;
}
</style>
