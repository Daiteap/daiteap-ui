<template>
  <b-modal centered :id="modalId" hide-footer>
    <div v-on:click="closeModal()"></div>
    <div>
      <div class="box mb-3">
        <div class="h4 text-center">
          <i class="fas fa-exclamation-triangle waring-modal-icon"></i>
          {{ confirmDialogParams.text }}
        </div>
        <div>
          <hr />
          <br />
          <div>
            <div>
              <h2 class="text-center">
                {{ confirmDialogParams.envName }}
              </h2>
              <h4 class="text-center">
                {{ confirmDialogParams.envId }}
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
                  {{ confirmDialogParams.action }}
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
  name: 'ConfirmDialog',
  props: {
    confirmDialogParams: Object,
    modalId: {
      type: String,
      default: "bv-modal-confirmdialog"
    },
  },
  methods: {
    closeModal() {
      this.$bvModal.hide(this.modalId);
    },
    confirmAction() {
      this.$emit("confirm-action", this.confirmDialogParams.payload);
    },
  },
};
</script>

<style scoped>
.btn-success {
  margin-right: 20px;
}
</style>