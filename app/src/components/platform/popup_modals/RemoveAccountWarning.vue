<template>
  <b-modal centered id="bv-modal-removeaccountwarning" hide-footer :static="true">
    <div v-on:click="cancelBtn()"></div>
    <div>
      <div class="box mb-3">
        <form class="form-horizontal" role="form">
          <div v-if="accountToRemoveFromParent.has_associated_environments" class="h4 text-center text-danger">
            <i class="fas fa-exclamation-triangle waring-modal-icon"></i>
            These cloud credentials are currently being used
          </div>
          <div v-else class="h4 text-center">
            <i class="fas fa-exclamation-triangle waring-modal-icon"></i>
            Are you sure you want to delete these cloud credentials:
          </div>

          <div class="text-center">
            <div>
              <div class="mb-4 logoImage">
                 <img
                  v-if="accountToRemoveFromParent.type === 'ALICLOUD'"
                  width="250pix"
                  src="../../../assets/img/alicloud_logo.png"
                />
                <img
                  v-else-if="accountToRemoveFromParent.type === 'AWS'"
                  width="250pix"
                  src="../../../assets/img/aws_logo.png"
                />
                <img
                  v-else-if="accountToRemoveFromParent.type === 'AZURE'"
                  width="250pix"
                  src="../../../assets/img/azure_logo.png"
                />
                <img
                  v-else-if="accountToRemoveFromParent.type === 'GCP'"
                  width="250pix"
                  src="../../../assets/img/googleCloud_logo.svg"
                />
                <img
                  v-else-if="accountToRemoveFromParent.type === 'ONPREM'"
                  width="250pix"
                  src="../../../assets/img/onpremise_large.svg"
                />
                <img
                  v-else-if="accountToRemoveFromParent.type === 'IOTARM'"
                  width="250pix"
                  src="../../../assets/img/IoTArm_logo.png"
                />
              </div>
            </div>
            <hr />
            <br />

            <div data-test-id="label-to-remove">
              <div class="mb-4">
                <h4>{{ accountToRemoveFromParent.label }}</h4>
              </div>
            </div>
          </div>

          <br />
          <hr />

          <div class="form-group">
            <div>
              <div
                class="custom-button float-right"
                :class="[accountToRemoveFromParent.has_associated_environments ? 'deactivated' : '']"
                @click="submitDetailsToRemoveAccount()"
                data-test-id="confirm-remove"
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
import {useVuelidate} from "@vuelidate/core";

export default {
  name: 'RemoveAccountWarning',
  props: ["accountToRemoveFromParent"],
  data() {
    return {
      v$: useVuelidate(),
      accountToRemove: {
        label: "",
        id: "",
        type: "",
      },
    };
  },
  methods: {
    submitDetailsToRemoveAccount() {
      this.accountToRemove.label = this.accountToRemoveFromParent.label;
      this.accountToRemove.type = this.accountToRemoveFromParent.type;
      this.accountToRemove.id = this.accountToRemoveFromParent.id;

      this.$emit('confirmDelete', this.accountToRemove);
      this.$bvModal.hide("bv-modal-removeaccountwarning");
    },
    cancelBtn() {
      this.$bvModal.hide("bv-modal-removeaccountwarning");
      this.accountToRemove = {};
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