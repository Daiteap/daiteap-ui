<template>
  <b-modal centered id="bv-modal-deletemanydialog" hide-footer>
    <div v-on:click="closeModal()"></div>
    <div>
      <div class="box mb-3">
        <div class="h4 text-center">
          
          <i class="fas fa-exclamation-triangle waring-modal-icon"></i> {{ deleteManyDialogParams.text }}
        </div>
        <hr />
        <br />
        <div>
          <div class="form-group col-lg-12 d-flex">
            <div class="col-lg-12">
              <div
                class="custom-button col-lg-4 float-right"
                @click="confirmAction()"
              >
                Delete
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
  name: 'DeleteManyDialog',
  props: ["deleteManyDialogParams"],
  methods: {
    closeModal() {
      this.$bvModal.hide("bv-modal-deletemanydialog");
    },
    confirmAction() {
      let self = this;

      for(let i=0; i < self.deleteManyDialogParams.endpoint.length; i++) {
        this.axios
          .delete(
            self.deleteManyDialogParams.endpoint[i],
            this.get_axiosConfig()
          )
      }

      self.closeModal();
    },
  },
};
</script>

<style scoped>


.btn-success {
  margin-right: 20px;
}
</style>