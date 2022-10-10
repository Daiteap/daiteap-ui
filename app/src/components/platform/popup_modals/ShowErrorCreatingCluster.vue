<template>
  <b-modal centered id="bv-modal-showerrorcreatingcluster" hide-footer>
    <div v-on:click="closeModal()"></div>
    <div>
            <h1 class="pt-3">There was a problem</h1>
      <div class="box mb-3">
        <div class="col">

            <div>
                <h4>Error message:</h4>
                <p>
                   {{ errorMessage }}
                </p>
                <br>
            </div>
        </div>
        <div class="row d-flex align-content-center">
            <div class="col" align="center">
                <button class="btn btn-outline-success col-lg-12" @click="closeModal()">Close</button>
            </div>
        </div>
      </div>
    </div>
    
  </b-modal>
</template>

<script>

export default {
  name: 'ShowErrorCreatingCluster',
  props: ["errorMessage", "modalName"],
  data() {
    return {};
  },
  mounted() {
  },
  methods: {
    closeModal() {
      this.$bvModal.hide("bv-modal-modalshowerrorcreatingcluster");
      if (!this.modalName == 'createEnvironmentFromTemplate'){
        this.$emit('backStep');
      }
    },
    cancelBtn() {
      this.$bvModal.hide("bv-modal-modalshowerrorcreatingcluster");
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
</style>