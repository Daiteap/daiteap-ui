<template>
  <div>
    <div class="card daiteap-content-card">
      <div>
        <div>
          <CardTitle title="Add User" />
          <hr />
        </div>
        <div>
          <SelectInput
            id="inputUserRole"
            inputLabel="User Role:"
            inputId="project-role"
            inputType="text"
            inputplaceholder="Select Project Role"
            errorMsg="Invalid Role"
            :options="optionsUserRoles"
            default="Admin"
            v-model="form.userRole"
          />
          <ValidationInputUsername
            id="inputUser"
            inputLabel="User:"
            inputId="username"
            inputType="text"
            inputplaceholder="Username"
            errorMsg="Required 3 to 150 chars, only alphanumerics"
            v-model="form.username"
            disabled=true
          />

          <VerticalInputFirstname
            inputLabel="First Name:"
            inputId="inputFirstName"
            inputType="text"
            inputplaceholder="Name"
            errorMsg="Invalid Name"
            v-model="form.firstname"
            :validation="v$.form.firstname"
            @change="v$.form.firstname.$touch"
          />

          <VerticalInputLastname
            inputLabel="Last name:"
            inputId="last-name"
            inputType="text"
            inputplaceholder="Last name"
            errorMsg="Invalid last name"
            v-model="form.lastname"
            :validation="v$.form.lastname"
            @change="v$.form.lastname.$touch"
          />

          <VerticalInput
            inputLabel="Company:"
            inputId="company"
            inputType="text"
            inputplaceholder="Company"
            errorMsg="Invalid Company"
            v-model="form.company"
          />

          <VerticalInputPhone
            inputLabel="Phone:"
            inputId="phone"
            inputType="text"
            inputplaceholder="Phone"
            errorMsg="Invalid Phone"
            v-model="form.phone"
          />

          <div class="form-group">
            <label class="control-label"></label>
            <div class="d-flex justify-content-end">
              <div
                class="custom-button mr-5"
                @click="onCancel()"
              >
                Cancel
              </div>
              <div
                class="custom-button ml-5 mr-3"
                :class="[v$.form.$invalid ? 'deactivated' : '']"
                @click="onSave()"
              >
                Save
              </div>
            </div>
          </div>
        </div>
        <br />
      </div>
    </div>
  </div>
</template>

<script>
import CardTitle from "@/components/platform/CardTitle";
import VerticalInput from "@/components/platform/input/VerticalInput";
import ValidationInputUsername from "@/components/platform/input/ValidationInputUsername";
import VerticalInputFirstname from "@/components/platform/input/VerticalInputFirstname";
import VerticalInputLastname from "@/components/platform/input/VerticalInputLastname";
import VerticalInputPhone from "@/components/platform/input/VerticalInputPhone";
import SelectInput from "@/components/platform/input/SelectInput";
import {useVuelidate} from "@vuelidate/core";
import { maxLength, minLength, helpers, required } from "@vuelidate/validators";

const regPhone = helpers.regex('regPhone',/^[\s0-9-+()]*$/);

export default {
  name: 'AddNewUser',
  props: [
    "tenant",
    "username",
    "email",
    "firstName",
    "lastName"
  ],
  components: {
    CardTitle,
    VerticalInput,
    SelectInput,
    ValidationInputUsername,
    VerticalInputFirstname,
    VerticalInputLastname,
    VerticalInputPhone,
  },
  validations: {
    form: {
      firstname: {
        maxLength: maxLength(100),
        minLength: minLength(2),
        required,
      },
      lastname: {
        maxLength: maxLength(100),
        minLength: minLength(2),
        required,
      },
      company: {
      },
      phone: {
        regPhone
      },
    },
  },
  data() {
    return {
      v$: useVuelidate(),
      optionsUserRoles: [
        {
          name: "Admin",
          key: "1",
          value: "Admin",
        },
        {
          name: "RegularUser",
          key: "2",
          value: "RegularUser",
        },
      ],
      form: {
        userRole: "Admin",
        username: "",
        sshpubkey: "",
        firstname: "",
        lastname: "",
        company: "",
        email: "",
        phone: "",
      },
      errorMsg: undefined,
    };
  },
  created() {
    this.form.username = this.username;
    this.form.email = this.email;
    this.form.firstname = this.firstName;
    this.form.lastname = this.lastName;
  },
  beforeMount() {
    this.setCompany();
  },
  methods: {
    setCompany() {
      this.axios
        .get(
          "/server/tenants/" + this.computed_active_tenant_id,
          this.get_axiosConfig()
        )
        .then((response) => {
          this.form.company = response.data.company;
        });
    },
    onCancel() {
      this.$router.push("UsersList");
    },
    onSave() {
      // add user to the current tenant
      let self = this;
      let request = this.form;
      this.axios
        .post(
          "/server/tenants/" + this.computed_active_tenant_id + "/users",
          request,
          this.get_axiosConfig()
        )
        .then(function (response) {
          if (response.data.user_created == false) {
            self.showAlert("Cannot create user");
          }
          self.$router.push("UsersList");
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
    showAlert(msg) {
      console.info(msg);
      this.$notify({
        group: "msg",
        type: "error",
        title: "Notification:",
        text: msg,
      });
    },
  },
};
</script>

<style scoped>
.btn {
  width: 10rem;
}
</style>
