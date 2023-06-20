<template>
  <b-modal centered id="bv-modal-editcluster" hide-footer>
    <div v-on:click="cancelBtn()"></div>
    <div>
      <div class="box mb-3">
        <form class="form-horizontal" role="form">
          <div class="h4 text-center">Edit Cluster</div>
          <hr />

          <div>
            <div>
              <label> Cluster Name: * </label>
              <div>
                <input
                  autocomplete="off"
                  v-model="currentCluster.Name"
                  class="form-control"
                  type="text"
                  id="name"
                />
              </div>

              <div>
                <p
                  v-if="!v$.currentCluster.Name.maxLength"
                  class="help text-danger" style="height: 1.2rem"
                >
                  Invalid Cluster Name
                </p>
                <p
                  v-else-if="nameResolved && !v$.currentCluster.Name.isNameFree && currentCluster.Name != ''"
                  class="help text-danger" style="height: 1.2rem"
                >
                  {{ nameTakenMsg }}
                </p>
                <div v-else style="height: 1.2rem"></div>
              </div>
            </div>
          </div>

          <div>
            <div>
              <label>
                Cluster Description:
              </label>
              <div>
                <b-form-textarea
                  autocomplete="off"
                  v-model="currentCluster.Description"
                  class="form-control"
                  :class="['input']"
                  type="text"
                  id="description"
                ></b-form-textarea>
              </div>
              <div v-if="v$.currentCluster.Description.$invalid">
                <p class="help text-danger">
                  Invalid Cluster Description
                </p>
              </div>
              <div v-else style="height: 0rem"></div>
            </div>
          </div>

          <hr />
          <div>
            <div>
              <div
                class="custom-button float-right"
                :class="[v$.currentCluster.$invalid ? 'deactivated' : '']"
                @click="submitChanges()"
              >
                Save
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
import { maxLength, required } from "@vuelidate/validators";

export default {
  name: 'EditClusterPopup',
  data() {
    return {
      v$: useVuelidate(),
      cluster: {},
      nameResolved: true,
      nameTakenMsg: "This cluster name is taken",
    };
  },
  props: {
    currentCluster: {},
    oldName: String,
  },
  validations: {
    currentCluster: {
      Name: {
        required,
        maxLength: maxLength(1024),
        isNameFree(Name) {
          if (Name.length > 0) {
            if (Name == this.oldName) {
              return true;
            }
            return new Promise((resolve) => {
              let self = this;
              self.nameResolved = false;
              self.nameTakenMsg = "";
              setTimeout(() => {
                let self = this;
                this.axios
                  .get(
                    "/server/tenants/" +
                      this.computed_active_tenant_id +
                      "/clusters/dlcmv2-name-available/" +
                      Name,
                    this.get_axiosConfig()
                  )
                  .then(function (response) {
                    if (response.data.free == true) {
                      self.nameResolved = true;
                      self.nameTakenMsg = "";
                      resolve(true);
                    } else {
                      self.nameResolved = true;
                      self.nameTakenMsg = "This cluster name is taken";
                      resolve(false);
                    }
                  })
                  .catch(function (error) {
                    console.log(error);
                    if (error.response && error.response.status == "403") {
                      self.$notify({
                        group: "msg",
                        type: "error",
                        title: "Notification:",
                        text: "Access Denied",
                      });
                    }
                    resolve(false);
                  });
              }, 0);
            });
          } else {
            return false;
          }
        },
      },
      Description: {
        maxLength: maxLength(1024),
      },
    },
  },
  methods: {
    submitChanges() {
      this.cluster.Name = document.getElementById("name").value;
      this.cluster.Description = document.getElementById("description").value;
      this.cluster.id = this.currentCluster.ID;
      this.cluster.type = this.currentCluster.Type;

      this.$emit("updateCluster", this.cluster);

      this.cancelBtn();
    },
    cancelBtn() {
      this.$bvModal.hide("bv-modal-editcluster");
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