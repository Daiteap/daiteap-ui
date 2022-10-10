<template>
  <b-modal centered id="bv-modal-resizeerror" hide-footer>
    <div v-on:click="closeModal()"></div>
    <div>
      <div class="box mb-3">
        <div class="h4 text-center">Failed to resize environment</div>
        <div class="h6 text-center">{{ resizeErrorItem.Name }} failed resize at step {{ resizeErrorItem.resizeStep }}</div>
        <hr />
        <br />
        <div>Error:</div>
        <pre id="errorMsg">{{ errorMsgResize }}</pre>
        <div>
          <div
            class="custom-button col-sm-16 float-sm-right"
            @click="closeModal()"
          >
            Close
          </div>
        </div>
      </div>
    </div>
    
  </b-modal>
</template>

<script>
export default {
  name: 'ResizeError',
  props: ["resizeErrorItem", "errorMsgResize"],
  methods: {
    closeModal() {
      this.$bvModal.hide("bv-modal-resizeerror");
    },
  }
};
</script>


<style scoped>


.form-group {
  margin: auto;
}

.btn-primary {
  width: 100%;
}
</style>