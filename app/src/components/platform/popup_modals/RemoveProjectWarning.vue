<template>
  <b-modal centered id="bv-modal-removeprojectwarning" hide-footer>
    <div v-on:click="cancelBtn()"></div>
    <div>
      <div class="box mb-3">
        <form class="form-horizontal" role="form">
          <div class="h4 text-center">
            <i class="fas fa-exclamation-triangle waring-modal-icon"></i>
            Are you sure you want to delete "{{ projectToRemove.Name }}"?
          </div>

          <hr />
          <br />

          <div class="form-group col-lg-12">
            <div class="col-lg-12">
              <div
                class="custom-button float-right"
                @click="submitDetailsToRemoveProject()"
              >
                Delete
              </div>
              <div
                class="custom-button"
                @click="cancelBtn()"
              >
                Cancel
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  </b-modal>
</template>

<script>
export default {
  name: 'RemoveProjectWarning',
  props: ["projectToRemove"],
  methods: {
    submitDetailsToRemoveProject() {
      this.$emit('confirmDelete', this.projectToRemove);
      this.$bvModal.hide("bv-modal-removeprojectwarning");
    },
    cancelBtn() {
      this.$bvModal.hide("bv-modal-removeprojectwarning");
    },
  },
};
</script>


<style scoped>
.modal-content {
  max-width: 650pix;
}
.form-group {
  margin: auto;
}
.btn {
  width: 33.33%;
}
.btn-primary {
  width: 100%;
}
.logoImage {
  max-height: 50pix;
}
</style>