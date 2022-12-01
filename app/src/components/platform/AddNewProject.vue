<template>
  <div>
    <div class="card daiteap-content-card">
      <div>
        <CardTitle title="Add New Project" />
      </div>
      <br />
      <div>
        Define your project below and save it. After the project is set up you
        can assign Compute (VM) resources and Kubernetes Cluster resources to
        it.
        <strong
          >You can navigate to the respective page or add them from the home
          dashboard.</strong
        >
      </div>
      <br />
      <div>
        <hr />
        <div>
            <label for="project-name">Project Name: *</label>
            <b-form-input
              id="project-name"
              v-model="form.name"
              placeholder="Project Name"
              v-on:change="$v.form.name.$touch && onProjectNameChange()"
              v-on:input="$v.form.name.$touch"
              :change="onProjectNameChange()"
            ></b-form-input>
            <p v-if="form.name != '' && $v.form.name.$invalid" class="help text-danger">
              Invalid project name
            </p>
            <p v-if="nameTaken" class="help text-danger">
              Project name is already used.
            </p>
            <div v-else style="height: 1.375rem"></div>
        </div>

        <div>
            <label for="project-description">Project Description:</label>
            <b-form-input
              v-model="form.description"
              id="project-description"
              placeholder="Project Description"
              v-on:change="$v.form.description.$touch"
            ></b-form-input>
            <p
              v-if="$v.form.description.$invalid"
              class="help text-danger"
            >
              Invalid project description
            </p>
            <div v-else style="height: 1.375rem"></div>
        </div>

        <br/>

        <b-row class="my-1">
          <b-col class="text-right">
            <div
              class="custom-button float-right ml-5"
              :class="[$v.form.$invalid || nameTaken ? 'deactivated' : '']"
              @click="onSave()"
            >
              Save
            </div>
            <div
              class="custom-button float-right mr-5"
              @click="$router.push('ProjectList')"
            >
              Cancel
            </div>
          </b-col>
        </b-row>
        <br />
      </div>
    </div>
  </div>
</template>

<script>
import { validationMixin } from "vuelidate";
import { required, maxLength } from "vuelidate/lib/validators";
import CardTitle from "@/components/platform/CardTitle";

export default {
  name: 'AddNewProject',
  mixins: [validationMixin],
  props: {
    projectParams: Object,
  },
  data() {
    return {
      created: false,
      form: {
        name: "",
        description: "",
        isNameFree(value) {
          this.isNameFree(value);
        }
      },
      nameTaken: false,
    };
  },
  components: {
    CardTitle,
  },
  created() {
    if (this.projectParams) {
      this.form.name = this.projectParams.Name;
      this.form.description = this.projectParams.Description;

      this.created = true;
    }
  },
  methods: {
    onProjectNameChange() {
      this.isNameFree(this.form.name);
    },
    isNameFree(value) {
      var self = this;
      console.info("isNameFree(value)");
      if (value.length > 0) {
        if (this.projectParams) {
          if (value == this.projectParams.Name) {
            return true;
          }
        }

        this.axios
          .get(
            "/server/tenants/" +
              this.computed_active_tenant_id +
              "/projects/name-available/" +
              value,
            this.get_axiosConfig()
          )
          .then(function (response) {
            if (response.data.free == true) {
              self.nameTaken = false;
            } else {
              self.nameTaken = true;
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
          });

      } else {
        return false;
      }
    },
    onSave() {
      let self = this;
      var request = this.form;

      this.axios
        .post(
          "/server/tenants/" + this.computed_active_tenant_id + "/projects",
          request,
          this.get_axiosConfig()
        )
        .then(function () {
          self.$router.push({
            name: "ProjectList",
          });
        })
        .catch(function (error) {
          // eslint-disable-next-line no-console
          console.log(error);
          self.errorMsg = error;
          if (error.response && error.response.status == "403") {
            self.$notify({
              group: "msg",
              type: "error",
              title: "Notification:",
              text: "Access Denied",
            });
          } else {
            self.showAlert(error);
          }
        });
    },
    showAlert(error) {
      this.msg = error;
      this.dismissCountDown = this.dismissSecs;
    },
  },
  validations: {
    form: {
      name: {
        required,
        maxLength: maxLength(1024),
      },
      description: {
        maxLength: maxLength(1024),
      },
    },
  },
};
</script>

<style scoped>
.providerLogoDiv {
  height: 100%;
  width: 100%;
}
.providerLogo {
  object-fit: cover;
  position: relative;
  top: 50%;
  -webkit-transform: translateY(-50%);
  -ms-transform: translateY(-50%);
  transform: translateY(-50%);
  display: block;
  margin-left: auto;
  margin-right: auto;
  width: 50%;
}
.btn-daiteap {
  width: 10rem;
}
</style>
