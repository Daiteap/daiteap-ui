<template>
  <b-modal centered id="bv-modal-confirmdialog" hide-footer>
    <div v-on:click="closeModal()"></div>
    <div>
      <div class="box mb-3">
        <div class="h4 text-center">
          <i class="fas fa-exclamation-triangle waring-modal-icon"></i>
          {{ confirmAndRedirectDialogParams.text }}
        </div>
        <div>
          <hr />
          <br />
          <div>
            <div>
              <h2 class="text-center">
                {{ confirmAndRedirectDialogParams.envName }}
              </h2>
              <h4 class="text-center">
                {{ confirmAndRedirectDialogParams.envId }}
              </h4>
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
                  {{ confirmAndRedirectDialogParams.action }}
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
    </div>
  </b-modal>
</template>

<script>
export default {
  name: 'ConfirmAndRedirectDialog',
  props: ["confirmAndRedirectDialogParams"],
  methods: {
    closeModal() {
      this.$bvModal.hide("bv-modal-confirmdialog");
    },
    confirmAction() {
      let self = this;
      this.axios
        .post(
          self.confirmAndRedirectDialogParams.endpoint,
          self.confirmAndRedirectDialogParams.requestBody,
          this.get_axiosConfig()
        )
        .then(function () {
          if (self.confirmAndRedirectDialogParams.successMessage) {
            self.$notify({
              group: "msg",
              type: "success",
              title: "Notification:",
              text: self.confirmAndRedirectDialogParams.successMessage,
            });
          }
          self.closeModal();
          self.$router.push({
            name: self.confirmAndRedirectDialogParams.redirect
          });
        })
        .catch(function (error) {
          console.log(error);
          if (error.response) {
            console.log(error.response.data);
          }
          if (self.confirmAndRedirectDialogParams.failureMessage) {
            self.$notify({
              group: "msg",
              type: "error",
              title: "Notification:",
              text: self.confirmAndRedirectDialogParams.failureMessage,
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