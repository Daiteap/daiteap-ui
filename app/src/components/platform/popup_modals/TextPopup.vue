<template>
  <b-modal centered id="bv-modal-textpopup" hide-footer>
    <div v-on:click="closeModal()"></div>
    <div id="textPopupContent">
      <div class="box mb-3">
        <div class="h4 text-center">{{ textPopupParams.heading }}</div>
        <br/>
        <pre>{{ textPopupParams.text }}</pre>
        <div>
          <span
            v-on:click="closeModal"
            type="button"
            class="btn btn-outline-success col-sm-16 float-sm-right"
          >Close</span>
        </div>
      </div>
    </div>
    
  </b-modal>
</template>

<script>
export default {
  name: 'TextPopup',
  props: {
    textPopupParams: Object,
  },
  mounted() {},
  methods: {
    closeModal() {
      this.$bvModal.hide("bv-modal-textpopup");
    }
  }
};
</script>

<style scoped>
</style>
<style scoped>
.modal-content {
  max-width: 750px;
}

#textPopupContent {
  width: 750px;
}
</style>