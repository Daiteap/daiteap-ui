<template>
  <b-modal centered id="bv-modal-deleteerror" hide-footer>
    <div v-on:click="closeModal()"></div>
    <div>
      <div class="box mb-3">
        <div class="h4 text-center">
          Failed to delete environment "{{ deleteItem.name }}"
        </div>
        <hr />
        <br />
        <div>Error:</div>
        <pre id="errorMsg">{{ errorMsgDelete }}</pre>
        <div class="d-flex">
          <div
            class="custom-button col-lg-4"
            @click="closeModal()"
          >
            Cancel
          </div>
          <div
            class="custom-button col-lg-4 ml-auto"
            @click="deleteCluster()"
          >
            Retry
          </div>
        </div>
      </div>
    </div>
  </b-modal>
</template>

<script>
export default {
  name: 'DeleteError',
  data() {
    return {};
  },
  props: {
    deleteItem: Object,
    errorMsgDelete: String,
  },
  methods: {
    deleteCluster() {
      this.$emit('confirmDelete', this.deleteItem);
      this.closeModal();
    },
    closeModal() {
      this.$bvModal.hide("bv-modal-deleteerror");
    },
  },
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