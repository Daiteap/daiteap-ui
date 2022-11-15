<template>
  <b-modal centered id="bv-modal-renamecluster" hide-footer>
    <div v-on:click="closeModal()"></div>
    <div>
      <div class="box mb-3">
        <form class="form-horizontal" role="form">
          <div class="h4 text-center">Rename Environment</div>
          <hr />
          <br />

          <div class="form-group col-lg-8">
            <label>New name</label>
            <input
              class="form-control"
              :class="['input', ($v.newName.$invalid && $v.newName.$dirty) ? 'is-danger' : '']"
              type="text"
              placeholder
              v-model="newName"
              v-on:change="$v.newName.$touch;"
              @focus="nameFocus = true"
              @blur="nameFocus = false"
            />
            <p v-if="$v.newName.$invalid && $v.newName.$dirty && !nameFocus" class="help is-danger">Please enter cluster name</p>
            <br />
          </div>

          <br />
          <hr />
          <br />

          <div class="form-group col-lg-8">
            <div class="col-lg-16">
              <input
                id="submit-machines"
                v-on:click="submitEnvironmentRename"
                :disabled="$v.newName.$invalid"
                type="button"
                class="btn btn-primary col-lg-5 float-sm-right"
                value="Submit"
              />
              <span
                v-on:click="closeModal()"
                type="button"
                class="btn btn-outline-success col-lg-5"
                >Cancel</span
              >
            </div>
          </div>
        </form>
      </div>
    </div>
    
  </b-modal>
</template>

<script>
import { validationMixin } from "vuelidate";
import { maxLength, minLength } from "vuelidate/lib/validators";

export default {
  name: 'RenameCluster',
  mixins: [validationMixin],
  data() {
    return {
      newName: ""
    };
  },
  props: ["clusterID"],
  validations: {
    newName: {
      maxLength: maxLength(1024),
      minLength: minLength(1)
    }
  },
  methods: {
    closeModal() {
      this.$bvModal.hide("bv-modal-renamecluster");
      this.newName = "";
    },
    submitEnvironmentRename() {
      let self = this;
      let endpoint = "/server/tenants/" + self.computed_active_tenant_id + "/clusters/" + self.clusterID + "/rename";
      this.axios
        .post(
          endpoint,
          {
            clusterName: self.newName
          },
          this.get_axiosConfig()
        )
        .then(function () {
          self.$notify({
            group: "msg",
            type: "success",
            title: "Notification:",
            text: "Successfuly submitted environment rename!",
          });
          self.closeModal();
        })
        .catch(function (error) {
          console.log(error);
          if (error.response) {
            console.log(error.response.data);
          }
          self.$notify({
            group: "msg",
            type: "error",
            title: "Notification:",
            text: "Error while submitting environment rename",
          });
        });
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
.spinner-border{
  width: 2.125rem;
  height: 2.125rem;
}
</style>