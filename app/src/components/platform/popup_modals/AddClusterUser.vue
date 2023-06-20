<template>
  <b-modal centered id="bv-modal-addclusteruser" hide-footer>
    <div
      v-on:click="
        closeModal();
        clearForm();
      "
    ></div>
    <div>
      <div class="box mb-3">
        <form class="form-horizontal" role="form" id="addUserForm">
          <div v-if="submitting" class="d-flex justify-content-center">
            <div class="spinner-border float-right" role="status"></div>

            <div class="h4 text-center">Adding new user</div>
          </div>
          <div v-else class="h4 text-center">Add new user</div>
          <div style="width: 2rem"></div>
          <hr />

          <br />

          <div class="form-group col-lg-8">
            <div class="d-flex justify-content-between">
              <label class="col-lg-8 control-label">Username:</label>
              <div class="text-right" style="padding-right: 0.5rem">
                <i class="far fa-question-circle" id="infoUsername"></i>
                <b-tooltip
                  target="infoUsername"
                  triggers="hover"
                  variant="secondary"
                  placement="left"
                  container="null"
                >
                  The username must be <b>unique</b> and between 3 and 20
                  characters long. The allowed characters <br />are a-z 0-9 _
                </b-tooltip>
              </div>
            </div>
            <div class="col-lg-16">
              <input
                required
                v-model.trim="user.username"
                class="form-control"
                :class="[
                  'input',
                  v$.user.username.$invalid &&
                  v$.user.username.$dirty &&
                  !usernameFocus
                    ? 'is-danger'
                    : '',
                ]"
                @focus="usernameFocus = true"
                @blur="usernameFocus = false"
                type="text"
                value
                v-on:click="v$.user.username.$touch"
                placeholder="*Username"
              />
            </div>
            <div v-if="!user.username" style="height: 2.25rem">
              <p class="help is-danger col-lg">* Username is a required</p>
            </div>
            <p v-else-if="v$.user.username.$invalid" class="help">
              Must be unique and between 3 and 20 characters long.
              <br />
              Allowed characters: a-z 0-9 _
            </p>
            <p v-else-if="backendValidationError" class="help is-danger">
              Must be unique and between 3 and 20 characters long.
              <br />
              Allowed characters: a-z 0-9 _
            </p>
            <p v-else-if="usernameIsTaken" class="help is-danger help">
              This Username is already taken.
              <br />
              Username needs to be unique
            </p>

            <div v-else style="height: 2.5rem"></div>
          </div>

          <div class="form-group col-lg-8">
            <label class="col-lg-8 control-label">Public SSH Key:</label>
            <div class="d-flex justify-content-between">
              <input
                type="file"
                id="publicsshkey"
                ref="publicsshkey"
                v-on:change="selectedPublicSSHKey"
              />
              <div class="text-right" style="padding-right: 0.5rem">
                <i class="far fa-question-circle" id="infoSSHKey"></i>
                <b-tooltip
                  target="infoSSHKey"
                  triggers="hover"
                  variant="secondary"
                  placement="left"
                  container="null"
                >
                  The public SSH key must be a <b>valid SSH-RSA Key</b>
                </b-tooltip>
              </div>
            </div>

            <div class="col-lg-16">
              <textarea
                placeholder="*Public SSH Key"
                v-on:change="v$.user.public_ssh_key.$touch"
                class="form-control"
                :class="[
                  v$.user.public_ssh_key.$invalid &&
                  v$.user.public_ssh_key.$dirty &&
                  !sshFocus
                    ? 'is-danger'
                    : '',
                ]"
                rows="5"
                @focus="sshFocus = true"
                @blur="sshFocus = false"
                v-model="user.public_ssh_key"
              ></textarea>
            </div>

            <div v-if="!user.public_ssh_key">
              <p class="help col-lg is-danger">* Public SSH Key is required</p>
            </div>
            <p
              v-else-if="
                v$.user.public_ssh_key.$invalid &&
                v$.user.public_ssh_key.$dirty &&
                !sshFocus
              "
              class="help is-danger col-lg-4"
            >
              Invalid public SSH key
            </p>
            <div v-else style="height: 1.375rem"></div>
          </div>

          <br />

          <div
            v-if="clusterType == 1 || clusterType == 3"
            class="form-group col-lg-8"
            id="k8s_out"
          >
            <label class="form-control" for="kubernetes_user">
              Kubernetes user
              <input
                class=""
                v-model.trim="user.kubernetes_user"
                type="checkbox"
                id="kubernetes_user"
              />
            </label>
          </div>

          <div>
            <div class="row justify-content-center">
              <b-button
                v-b-toggle.collapse-1
                variant="muted"
                id="addUserDetailsBtn"
                >Add user contact details... (optional)</b-button
              >
              <b-tooltip
                target="addUserDetailsBtn"
                triggers="hover"
                variant="secondary"
                placement="top"
                container="null"
              >
                If needed you could add:<br />first and last names<br />and/or<br />email
                of the new user
              </b-tooltip>
            </div>
            <b-collapse id="collapse-1" class="mt-2">
              <b-card>
                <div class="form-group col-lg-8">
                  <label class="col-lg-8 control-label">First name:</label>
                  <div class="col-lg-16">
                    <input
                      v-model.trim="user.first_name"
                      class="form-control"
                      :class="[
                        'input',
                        v$.user.first_name.$invalid &&
                        v$.user.first_name.$dirty &&
                        !firstnameFocus
                          ? 'is-danger'
                          : '',
                      ]"
                      type="text"
                      value
                      @focus="firstnameFocus = true"
                      @blur="firstnameFocus = false"
                      v-on:change="v$.user.first_name.$touch"
                      placeholder="First Name"
                    />
                  </div>
                  <p
                    v-if="
                      v$.user.first_name.$invalid &&
                      v$.user.first_name.$dirty &&
                      !firstnameFocus
                    "
                    class="help is-danger col-lg-4"
                  >
                    Invalid name
                  </p>
                  <div v-else style="height: 1.375rem"></div>
                </div>

                <div class="form-group col-lg-8">
                  <label class="col-lg-8 control-label">Last name:</label>
                  <div class="col-lg-16">
                    <input
                      v-model="user.last_name"
                      class="form-control"
                      :class="[
                        'input',
                        v$.user.last_name.$invalid &&
                        v$.user.last_name.$dirty &&
                        !lastnameFocus
                          ? 'is-danger'
                          : '',
                      ]"
                      type="text"
                      value
                      @focus="lastnameFocus = true"
                      @blur="lastnameFocus = false"
                      v-on:change="v$.user.last_name.$touch"
                      placeholder="Last Name"
                    />
                  </div>
                  <p
                    v-if="
                      v$.user.last_name.$invalid &&
                      v$.user.last_name.$dirty &&
                      !lastnameFocus
                    "
                    class="help is-danger col-lg-4"
                  >
                    Invalid name
                  </p>
                  <div v-else style="height: 1.375rem"></div>
                </div>

                <div class="form-group col-lg-8">
                  <label class="col-lg-8 control-label">Email:</label>
                  <div class="col-lg-16">
                    <input
                      v-model="user.email"
                      class="form-control"
                      :class="[
                        'input',
                        v$.user.email.$invalid &&
                        v$.user.email.$dirty &&
                        !emailFocus
                          ? 'is-danger'
                          : '',
                      ]"
                      type="email"
                      value
                      v-on:change="v$.user.email.$touch"
                      @focus="emailFocus = true"
                      @blur="emailFocus = false"
                      placeholder="Email"
                    />
                  </div>
                  <p
                    v-if="
                      v$.user.email.$invalid &&
                      v$.user.email.$dirty &&
                      !emailFocus
                    "
                    class="help is-danger col-lg-4"
                  >
                    Invalid email
                  </p>
                  <div v-else style="height: 1.375rem"></div>
                </div>
              </b-card>
            </b-collapse>
          </div>
          <hr />

          <br />

          <div class="form-group col-lg-8">
            <div class="col-lg-16">
              <input
                v-on:click="submitAndValidateInBackend"
                type="button"
                :disabled="v$.user.$invalid || submitting"
                class="btn btn-outline-success col-lg-5 float-sm-right"
                value="Submit"
              />
              <span
                v-on:click="
                  closeModal();
                  clearForm();
                "
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
import {useVuelidate} from "@vuelidate/core";
import { or, minLength, maxLength, email, required, alpha } from "@vuelidate/validators";

const isSSHKey = (value) => /AAAAB3NzaC1yc2E/.test(value);
const isEmpty = (value) => value == "";

export default {
  name: 'AddClusterUser',
  data() {
    return {
      v$: useVuelidate(),
      usernameIsTaken: false,
      usernameFocus: false,
      firstnameFocus: false,
      lastnameFocus: false,
      sshFocus: false,
      emailFocus: false,
      submitting: false,
      user: {
        username: "",
        first_name: "",
        kubernetes_user: false,
        last_name: "",
        email: "",
        public_ssh_key: "",
      },
      backendValidationError: false,
    };
  },
  props: ["clusterType", "clusterID"],
  validations: {
    user: {
      username: {
        minLength: minLength(3),
        maxLength: maxLength(20),
        required,
      },
      first_name: {
        minLength: minLength(2),
        maxLength: maxLength(23),
        alpha,
      },
      last_name: {
        minLength: minLength(2),
        maxLength: maxLength(23),
        alpha,
      },
      email: {
        email,
        minLength: minLength(6),
        maxLength: maxLength(150),
      },
      public_ssh_key: {
        minLength: minLength(20),
        maxLength: maxLength(10000),
        or: or(isSSHKey, isEmpty),
        required,
      },
    },
  },
  methods: {
    closeModal() {
      this.$bvModal.hide("bv-modal-addclusteruser");
    },
    clearForm() {
      this.user.username = "";
      this.user.last_name = "";
      this.user.first_name = "";
      this.user.email = "";
      this.user.public_ssh_key = "";
      this.backendValidationError = false;
      document.getElementById("addUserForm").reset();
      this.$nextTick(() => {
        this.v$.$reset();
      });
    },
    submitNewUser() {
      let self = this;

      let user_type = "";
      let is_kubernetes_user = self.user.kubernetes_user;

      if (is_kubernetes_user) {
        user_type = "user, kubernetes user";
      } else {
        user_type = "user";
      }
      this.axios
        .post(
          "/server/tenants/" +
            self.computed_active_tenant_id +
            "/clusters/" +
            self.clusterID +
            "/users",
          {
            kubernetesUser: is_kubernetes_user,
            username: self.user.username,
            firstName: self.user.first_name,
            lastName: self.user.last_name,
            type: user_type,
            email: self.user.email,
            publicSSHKey: self.user.public_ssh_key,
            clusterID: self.clusterID,
          },
          this.get_axiosConfig()
        )
        .then(function () {
          self.$notify({
            group: "msg",
            type: "success",
            title: "Notification:",
            text: "Successfuly submitted user creation!",
          });
          self.clearForm();
          self.closeModal();
        })
        .catch(function (error) {
          if (error.response.data.authorized == false) {
            self.$emit('exceededResources', error.response.data.exceededResources);
          } else if (error.response.data.error.code === 1000) {
            self.backendValidationError = true;
            self.$notify({
              group: "msg",
              type: "error",
              title: "Notification:",
              text: error.response.data.error.message,
            });
          } else if (error.response.data.error.code === 1002) {
            self.usernameIsTaken = true;
            self.$notify({
              group: "msg",
              type: "error",
              title: "Notification:",
              text: error.response.data.error.message,
            });
          } else {
            console.log(error);
            if (error.response) {
              console.log(error.response.data);
            }
            self.$notify({
              group: "msg",
              type: "error",
              title: "Notification:",
              text: "Error while submitting the user creation",
            });
          }
        });
    },
    selectedPublicSSHKey() {
      let file = this.$refs.publicsshkey.files[0];
      let reader = new FileReader();
      reader.readAsText(file, "UTF-8");
      reader.onload = (evt) => {
        this.user.public_ssh_key = evt.target.result;
      };
      reader.onerror = (evt) => {
        console.error(evt);
      };
    },


    // ################### checkUsername is now redundant ##################################

    checkUsername(value) {
      if (value.length < 3 || value.length > 20) {
        return false;
      }

      let self = this;
      if (value.length > 0) {
        return new Promise((resolve) => {
          setTimeout(() => {
            self.axios
              .get(
                "/server/clusters/username-valid/" + value,
                self.get_axiosConfig()
              )
              .then(function (response) {
                if (response.data.valid === true) {
                  self.axios
                    .get(
                      "/server/tenants/" +
                        self.computed_active_tenant_id +
                        "/clusters/" +
                        self.clusterID +
                        "/username-available/" +
                        value,
                      self.get_axiosConfig()
                    )
                    .then(function (response) {
                      if (response.data.free === true) {
                        resolve(true);
                      } else {
                        this.usernameIsTaken = true;
                        resolve(false);
                      }
                    })
                    .catch(function (error) {
                      console.log(error);
                      resolve(false);
                    });
                } else {
                  this.backendValidationError = true;
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

    submitAndValidateInBackend() {
      this.usernameIsTaken = false;
      this.backendValidationError = false;
      this.submitting = true;
      this.submitNewUser(this.user);
      this.submitting = false;
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

#kubernetes_user {
  float: right;
  margin: 5px 0px 0px 0px;
}
.btn-muted.btn-muted.btn-muted {
  color: rgb(94, 94, 94) !important;
}
</style>
