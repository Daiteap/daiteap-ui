<template>
  <b-modal centered id="bv-modal-edituser" hide-footer>
    <div v-on:click="cancelBtn()"></div>
    <div>
      <div class="box mb-3">
        <form class="form-horizontal" role="form">
          <div class="h4 text-center">Edit User</div>
          <hr />

          <div v-if="showRole">
            <div>
              <label> User Role: * </label>
              <div>
                <select
                  class="custom-select"
                  v-model="currentUser.role"
                  id="userrole"
                >
                  <option value="Admin">Admin</option>
                  <option value="RegularUser">Regular User</option>
                </select>
              </div>
              <div style="height: 1rem"></div>
            </div>
          </div>

          <div>
            <div>
              <label> First Name: * </label>
              <div>
                <input
                  autocomplete="off"
                  v-model="currentUser.firstname"
                  class="form-control"
                  type="text"
                  id="firstname"
                />
              </div>
              <div
                class="help text-danger"
                v-if="currentUser.firstname != '' && v$.currentUser.firstname.$invalid"
              >
                Invalid Name
              </div>
              <div v-else style="height: 1rem"></div>
            </div>
          </div>

          <div>
            <div>
              <label> Last Name: * </label>
              <div>
                <input
                  autocomplete="off"
                  v-model="currentUser.lastname"
                  class="form-control"
                  type="text"
                  id="lastname"
                />
              </div>
              <div
                class="help text-danger"
                v-if="currentUser.lastname != '' && v$.currentUser.lastname.$invalid"
              >
                Invalid Name
              </div>
              <div v-else style="height: 1rem"></div>
            </div>
          </div>

          <div>
            <div>
              <label> Company: </label>
              <div>
                <input
                  autocomplete="off"
                  v-model="currentUser.company"
                  class="form-control"
                  type="text"
                  id="company"
                />
              </div>
              <div style="height: 1rem"></div>
            </div>
          </div>

          <div>
            <div>
              <label> Phone: </label>
              <div>
                <input
                  autocomplete="off"
                  v-model="currentUser.phone"
                  class="form-control"
                  type="text"
                  id="phone"
                />
              </div>
              <p
                class="help text-danger"
                v-if="v$.currentUser.phone.$invalid"
              >
                Invalid Phone
              </p>
              <div v-else style="height: 1rem"></div>
            </div>
          </div>

          <div>
            <div>
              <label> Password: </label>
              <div>
                <input
                  autocomplete="new-password"
                  v-model="password"
                  class="form-control"
                  type="password"
                  id="password"
                  @input="saveKey += 1"
                />
              </div>
              <p class="help text-danger" v-if="password != '' && v$.password.$invalid">
                Password must contain upper case letter, lower case letter, special character, number, and to be at least 8 characters
              </p>
              <div v-else style="height: 1rem"></div>
            </div>
          </div>

          <div>
            <div>
              <label> Confirm Password: </label>
              <div>
                <input
                  autocomplete="off"
                  v-model="confirmPassword"
                  class="form-control"
                  type="password"
                />
              </div>
              <p class="help text-danger" v-if="password != confirmPassword">
                Incorrect password
              </p>
              <div v-else style="height: 1rem"></div>
            </div>
          </div>

          <hr />
          <div>
            <div>
              <div
                v-if="password == ''"
                class="custom-button float-right"
                :class="[v$.currentUser.$invalid ? 'deactivated' : '']"
                @click="submitChanges()"
                :key="saveKey"
              >
                Save
              </div>
              <div
                v-else
                class="custom-button float-right"
                :class="[v$.currentUser.$invalid || v$.password.$invalid || password != confirmPassword ? 'deactivated' : '']"
                @click="submitChanges()"
                :key="saveKey"
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
import { minLength, maxLength, helpers, required, alpha } from "@vuelidate/validators";

const regPhone = helpers.regex("regPhone", /^[\s0-9-+()]*$/);
const valLastname = helpers.regex("valLastname", /^[a-zA-Z\s]*$/);

export default {
  name: "EditUserPopup",
  data() {
    return {
      v$: useVuelidate(),
      user: {},
      password: "",
      confirmPassword: "",
      saveKey: 0,
    };
  },
  props: {
    currentUser: {},
    oldName: String,
    showRole: {
      type: Boolean,
      default: false,
    },
  },
  validations: {
    currentUser: {
      firstname: {
        maxLength: maxLength(100),
        minLength: minLength(2),
        alpha,
        required,
      },
      lastname: {
        maxLength: maxLength(100),
        minLength: minLength(2),
        valLastname,
        required,
      },
      phone: {
        regPhone,
      },
    },
    password: {
      minLength: minLength(8),
      maxLength: maxLength(150),
      valid: function (value) {
        const containsUppercase = /[A-Z]/.test(value);
        const containsLowercase = /[a-z]/.test(value);
        const containsNumber = /[0-9]/.test(value);
        const containsSpecial = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(
          value
        );
        return (
          containsUppercase &&
          containsLowercase &&
          containsNumber &&
          containsSpecial
        );
      },
    },
  },
  methods: {
    submitChanges() {
      this.user.firstname = document.getElementById("firstname").value;
      this.user.lastname = document.getElementById("lastname").value;
      this.user.company = document.getElementById("company").value;
      this.user.phone = document.getElementById("phone").value;
      this.user.password = document.getElementById("password").value;
      this.user.id = this.currentUser.id;
      this.user.username = this.currentUser.username;

      this.$emit("updateUser", this.user);

      this.cancelBtn();
    },
    cancelBtn() {
      this.password = "";
      this.$bvModal.hide("bv-modal-edituser");
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