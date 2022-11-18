<template>
  <b-modal centered id="bv-modal-saveenvironmenttemplate" hide-footer>
    <div v-on:click="closeModal()"></div>
    <div>
      <div class="box mb-3">
        <div class="h4 text-center">
          Save {{ clusterName }} configuration as a template
        </div>
        <div>
          <hr />
          <br />
          <div>
            <div>
              <label> Template name: * </label>
              <div>
                <input
                  v-model="form.name"
                  v-on:input="$v.form.name.$touch"
                  class="form-control"
                  :class="['input']"
                  placeholder="Template Name"
                  autocomplete="off"
                  type="text"
                  id="templateNameField"
                />
              </div>
              <div>
                <p
                  v-if="
                    form.name != '' &&
                    !$v.form.name.maxLength &&
                    $v.form.name.$dirty
                  "
                  class="help text-danger"
                  style="height: 1.2rem"
                >
                  Invalid template name
                </p>
                <p
                  v-else-if="
                    form.name != '' &&
                    templateNameResolved &&
                    !$v.form.name.isNameFree
                  "
                  class="help text-danger"
                  style="height: 1.2rem"
                >
                  {{ templateNameTakenMsg }}
                </p>
                <div v-else style="height: 1.2rem"></div>
              </div>
            </div>
            <div>
              <label> Description: </label>
              <div>
                <input
                  v-model="form.description"
                  v-on:input="$v.form.description.$touch"
                  class="form-control"
                  :class="['input']"
                  placeholder="Description"
                  autocomplete="off"
                  type="text"
                  id="form.descriptionField"
                />
              </div>
              <div>
                <p
                  v-if="
                    $v.form.description.$invalid && $v.form.description.$dirty
                  "
                  class="help text-danger"
                >
                  Please provide a valid template description
                </p>
                <div v-else style="height: 1.375rem"></div>
              </div>
            </div>
            <hr />
            <div class="form-group col-lg-12 d-flex">
              <div class="col-lg-12">
                <div
                  class="custom-button col-lg-5 float-right"
                  :class="[$v.form.$invalid ? 'deactivated' : '']"
                  @click="saveTemplate()"
                >
                  Save Template
                </div>
                <div
                  class="custom-button col-lg-5"
                  @click="closeModal()"
                >
                  Cancel
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </b-modal>
</template>

<script>
import { validationMixin } from "vuelidate";
import { required, maxLength } from "vuelidate/lib/validators";

export default {
  name: "SaveEnvironmentTemplate",
  mixins: [validationMixin],
  props: {
    clusterName: String,
    templateClusterId: String,
  },
  data() {
    return {
      form: {
        name: "",
        description: "",
        contact: "",
      },
      templateNamesList: [],
      loaded: false,
      submitting: false,
      templateNameResolved: true,
      templateNameTakenMsg: "This template name is taken",
    };
  },
  validations: {
    form: {
      name: {
        required,
        maxLength: maxLength(1024),
        isNameFree(value) {
          if (value.length > 0) {
            if (this.projectParams) {
              if (value == this.projectParams.Name) {
                return true;
              }
            }
            return new Promise((resolve) => {
              let self = this;
              self.templateNameResolved = false;
              self.templateNameTakenMsg = "";
              setTimeout(() => {
                let self = this;
                this.axios
                  .get(
                    "/server/tenants/" +
                      this.computed_active_tenant_id +
                      "/environment-templates/name-available/" +
                      value,
                    this.get_axiosConfig()
                  )
                  .then(function (response) {
                    if (response.data.free == true) {
                      self.templateNameResolved = true;
                      self.templateNameTakenMsg = "";
                      resolve(true);
                    } else {
                      self.templateNameResolved = true;
                      self.templateNameTakenMsg = "This template name is taken";
                      resolve(false);
                    }
                  })
                  .catch(function (error) {
                    console.log(error);
                    resolve(false);
                  });
              }, 350);
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
    closeModal() {
      this.$bvModal.hide("bv-modal-saveenvironmenttemplate");
      this.submitting = false;
      this.loaded = false;
    },
    saveTemplate() {
      let request = this.form;
      request.environmentId = this.templateClusterId;
      this.$emit('saveEnvironmentAsTemplate', this.form);
      this.closeModal();
    },
  },
};
</script>
