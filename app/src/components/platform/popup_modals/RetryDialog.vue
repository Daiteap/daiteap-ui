<template>
  <b-modal centered id="bv-modal-retrydialog" hide-footer>
    <div v-on:click="closeModal()"></div>
    <div>
      <div class="box mb-3">
        <div class="h4 text-center">{{ retryDialogParams.text }}</div>
        <br />
        <div>
          <div class="custom-button float-sm-left" @click="closeModal()">
            Cancel
          </div>
          <div class="custom-button float-sm-right" @click="confirmAction()">
            Agree
          </div>
        </div>
      </div>
    </div>
  </b-modal>
</template>

<script>
export default {
  name: "RetryDialog",
  data() {
    return {
      interval: null,
    };
  },
  props: ["retryDialogParams", "status"],
  methods: {
    sleep(ms) {
      return new Promise((resolve) => setTimeout(resolve, ms));
    },
    closeModal() {
      this.$bvModal.hide("bv-modal-retrydialog");
    },
    confirmAction() {
      let self = this;
      this.axios
        .post(
          self.retryDialogParams.endpoint,
          self.retryDialogParams.requestBody,
          this.get_axiosConfig()
        )
        .then(function () {
          if (self.retryDialogParams.successMessage) {
            self.sleep(2000);
            self.status = 1;

            self.$emit('getInstallationStatus');

            self.$notify({
              group: "msg",
              type: "success",
              title: "Notification:",
              text: self.retryDialogParams.successMessage,
            });
          }
          self.closeModal();
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
            if (self.retryDialogParams.failureMessage) {
              self.$notify({
                group: "msg",
                type: "error",
                title: "Notification:",
                text: self.retryDialogParams.failureMessage,
              });
            }
          }
          self.closeModal();
        });
    },
  },
};
</script>


<style scoped>
.btn {
  width: 10rem;
}
</style>