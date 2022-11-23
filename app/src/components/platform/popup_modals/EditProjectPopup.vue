<template>
  <b-modal centered id="bv-modal-editproject" hide-footer>
    <div v-on:click="cancelBtn()"></div>
    <div>
      <div class="box mb-3">
        <form class="form-horizontal" role="form">
          <div class="h4 text-center">Edit Project</div>
          <hr />

          <div>
            <div>
              <label> Project Name: * </label>
              <div>
                <input
                  autocomplete="off"
                  v-model="currentProject.Name"
                  class="form-control"
                  type="text"
                  id="name"
                />
              </div>

              <div>
                <p
                  v-if="!$v.currentProject.Name.maxLength"
                  class="help text-danger" style="height: 1.2rem"
                >
                  Invalid Project Name
                </p>
                <p
                  v-else-if="nameResolved && !$v.currentProject.Name.isNameFree && currentProject.Name != ''"
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
                Project Description:
              </label>
              <div>
                <input
                  autocomplete="off"
                  v-model="currentProject.Description"
                  class="form-control"
                  :class="['input']"
                  type="text"
                  id="description"
                />
              </div>
              <div v-if="$v.currentProject.Description.$invalid">
                <p class="help text-danger">
                  Invalid Project Description
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
                :class="[$v.currentProject.$invalid ? 'deactivated' : '']"
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
import { validationMixin } from "vuelidate";
import { required, maxLength } from "vuelidate/lib/validators";

export default {
  name: 'EditProjectPopup',
  mixins: [validationMixin],
  data() {
    return {
      project: {},
      nameResolved: true,
      nameTakenMsg: "This project name is taken",
    };
  },
  props: {
    currentProject: {},
    oldName: String,
  },
  validations: {
    currentProject: {
      Name: {
        required,
        maxLength: maxLength(128),
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
                      "/projects/name-available/" +
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
                      self.nameTakenMsg = "This project name is taken";
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
      this.project.Name = document.getElementById("name").value;
      this.project.Description = document.getElementById("description").value;
      this.project.id = this.currentProject.ID;

      this.$emit("updateProject", this.project);

      this.cancelBtn();
    },
    cancelBtn() {
      this.$bvModal.hide("bv-modal-editproject");
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