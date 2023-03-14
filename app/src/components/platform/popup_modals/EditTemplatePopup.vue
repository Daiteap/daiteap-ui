<template>
  <b-modal centered id="bv-modal-edittemplate" hide-footer>
    <div v-on:click="cancelBtn()"></div>
    <div>
      <div class="box mb-3">
        <form class="form-horizontal" role="form">
          <div class="h4 text-center">Edit Template</div>
          <hr />

          <div>
            <div>
              <label> Template Name: * </label>
              <div>
                <input
                  autocomplete="off"
                  v-model="currentTemplate.name"
                  class="form-control"
                  type="text"
                  id="name"
                />
              </div>

              <div>
                <p
                  v-if="!$v.currentTemplate.name.maxLength"
                  class="help text-danger" style="height: 1.2rem"
                >
                  Invalid Template Name
                </p>
                <p
                  v-else-if="nameResolved && !$v.currentTemplate.name.isNameFree && currentTemplate.name != ''"
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
                Template Description:
              </label>
              <div>
                <b-form-textarea
                  autocomplete="off"
                  v-model="currentTemplate.description"
                  class="form-control"
                  :class="['input']"
                  type="text"
                  id="description"
                ></b-form-textarea>
              </div>
              <div v-if="$v.currentTemplate.description.$invalid">
                <p class="help text-danger">
                  Invalid Template Description
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
                :class="[$v.currentTemplate.$invalid ? 'deactivated' : '']"
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
  name: 'EditTemplatePopup',
  mixins: [validationMixin],
  data() {
    return {
      template: {},
      nameResolved: true,
      nameTakenMsg: "This template name is taken",
    };
  },
  props: {
    currentTemplate: {},
    oldName: String,
  },
  validations: {
    currentTemplate: {
      name: {
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
                      "/environment-templates/name-available/" +
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
                      self.nameTakenMsg = "This template name is taken";
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
      description: {
        maxLength: maxLength(1024),
      },
    },
  },
  methods: {
    submitChanges() {
      this.template.name = document.getElementById("name").value;
      this.template.description = document.getElementById("description").value;
      this.template.id = this.currentTemplate.id;

      this.$emit("updateTemplate", this.template);

      this.cancelBtn();
    },
    cancelBtn() {
      this.$bvModal.hide("bv-modal-edittemplate");
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