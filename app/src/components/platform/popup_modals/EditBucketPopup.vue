<template>
  <b-modal centered id="bv-modal-editbucket" hide-footer>
    <div v-on:click="cancelBtn()"></div>
    <div>
      <div class="box mb-3">
        <form class="form-horizontal" role="form">
          <div class="h4 text-center">Edit Bucket / Container</div>
          <hr />

          <div>
            <div>
              <label> Description: </label>
              <div>
                <b-form-textarea
                  autocomplete="off"
                  v-model="currentBucket.description"
                  class="form-control"
                  :class="['input']"
                  type="text"
                  id="description"
                ></b-form-textarea>
              </div>
              <div v-if="$v.currentBucket.description.$invalid">
                <p class="help text-danger">Invalid Description</p>
              </div>
              <div v-else style="height: 0rem"></div>
            </div>
          </div>

          <hr />
          <div>
            <div>
              <div
                class="custom-button float-right"
                :class="[$v.currentBucket.$invalid ? 'deactivated' : '']"
                @click="submitChanges()"
              >
                Save
              </div>
              <div class="custom-button" @click="cancelBtn()">Cancel</div>
            </div>
          </div>
        </form>
      </div>
    </div>
  </b-modal>
</template>

<script>
import { validationMixin } from "vuelidate";
import { maxLength } from "vuelidate/lib/validators";

export default {
  name: "EditBucketPopup",
  mixins: [validationMixin],
  data() {
    return {
      bucket: {},
    };
  },
  props: {
    currentBucket: {},
  },
  validations: {
    currentBucket: {
      description: {
        maxLength: maxLength(1024),
      },
    },
  },
  methods: {
    submitChanges() {
      this.bucket.description = document.getElementById("description").value;
      this.bucket.id = this.currentBucket.id;

      this.$emit("updateBucket", this.bucket);

      this.cancelBtn();
    },
    cancelBtn() {
      this.$bvModal.hide("bv-modal-editbucket");
    },
  },
};
</script>

<style scoped>
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