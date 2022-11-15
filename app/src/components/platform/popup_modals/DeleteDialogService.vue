<template>
  <b-modal centered id="bv-modal-servicedeletedialog" hide-footer>
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
                Delete
              </div>
              <div class="custom-button col-lg-4" @click="closeModal()">
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
  name: "DeleteDialogService",
  props: ["deleteDialogParams"],
  methods: {
    closeModal() {
      this.$bvModal.hide("bv-modal-servicedeletedialog");
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
          self.closeModal()
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