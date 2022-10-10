<template>
  <b-modal centered :id="modalId" hide-footer>
    <div v-on:click="cancelBtn()"></div>
    <div>
      <div class="box mb-3">
        <form class="form-horizontal" role="form">
          <h4 class="text-center"><i class="fas fa-exclamation-triangle waring-modal-icon"></i> {{ message }}</h4>
          <hr />
          <br />

          <div class="form-group col-lg-12">
            <div class="col-lg-12">
              <div
                class="custom-button float-right"
                @click="$emit('confirm',true)"
              >
                Confirm
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
import { validationMixin } from "vuelidate";

export default {
  name: 'GenericPopupWarning',
  props: {
    message: String,
    modalId: {
      type: String,
      default: "bv-modal-removeuserwarning"
    }
  },
  mixins: [validationMixin],
  data() {
    return {
    };
  },
  mounted() {

  },
  methods: {
    cancelBtn() {
      this.$bvModal.hide(this.modalId);
      this.accountToRemove = {};
    },
    onConfirm() {
      this.closeModal();
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