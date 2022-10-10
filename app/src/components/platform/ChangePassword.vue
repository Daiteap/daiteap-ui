<template>
  <div>
    <div class="card daiteap-content-card">
      <div>
        <CardTitle title="Change password" />
      <hr />
      </div>
      <div>
        <VerticalInput
          inputLabel="Current password: *"
          inputId="current-password"
          inputType="password"
          inputplaceholder="Current password"
          errorMsg="Invalid password"
          v-model="form.current_password"
          :validation="$v.form.current_password"
          @change="$v.form.current_password.$touch"
        />

        <VerticalInput
          inputLabel="New password: *"
          inputId="new-password"
          inputType="password"
          inputplaceholder="New password"
          errorMsg="Password must contain upper case, lower case, special character, number, and at least 8 characters"
          v-model="form.new_password"
          :validation="$v.form.new_password"
          @change="$v.form.new_password.$touch"
        />

        <VerticalInput
          inputLabel="Confirm password: *"
          inputId="save-password"
          inputType="password"
          inputplaceholder="Confirm password"
          errorMsg="Password must contain upper case, lower case, special character, number, and at least 8 characters"
          v-model="form.new_password_confirmation"
          :validation="$v.form.new_password_confirmation"
          @change="$v.form.new_password_confirmation.$touch"
        />

        <div class="form-group">
          <label class="control-label"></label>
          <div class="d-flex justify-content-end">
            <div
              class="custom-button"
              :class="[$v.form.$invalid || loading ? 'deactivated' : '']"
              @click="savePassword()"
            >
              Save Password
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { validationMixin } from "vuelidate";
import { required, minLength, maxLength } from "vuelidate/lib/validators";
import CardTitle from "@/components/platform/CardTitle";
import VerticalInput from "@/components/platform/input/VerticalInput";

export default {
  name: 'ChangePassword',
  mixins: [validationMixin],
  components: {
    CardTitle,
    VerticalInput,
  },
  data() {
    return {
      form: {
        current_password: "",
        new_password: "",
        new_password_confirmation: "",
      },
      loading: false,
      dismissSecs: 30,
      dismissCountDown: 0,
      msg: "",
    };
  },
  validations: {
    form: {
      current_password: {
        required,
        minLength: minLength(3),
        maxLength: maxLength(150),
      },
      new_password: {
        required,
        minLength: minLength(8),
        maxLength: maxLength(150),
        valid: function(value) {
          const containsUppercase = /[A-Z]/.test(value)
          const containsLowercase = /[a-z]/.test(value)
          const containsNumber = /[0-9]/.test(value)
          const containsSpecial = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(value)
          return containsUppercase && containsLowercase && containsNumber && containsSpecial
        }
      },
      new_password_confirmation: {
        required,
        minLength: minLength(8),
        maxLength: maxLength(150),
        valid: function(value) {
          const containsUppercase = /[A-Z]/.test(value)
          const containsLowercase = /[a-z]/.test(value)
          const containsNumber = /[0-9]/.test(value)
          const containsSpecial = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(value)
          return containsUppercase && containsLowercase && containsNumber && containsSpecial
        }
      },
    },
  },
  methods: {
    countDownChanged(dismissCountDown) {
      this.dismissCountDown = dismissCountDown;
    },
    showAlert(error) {
      this.msg = error;
      this.dismissCountDown = this.dismissSecs;
    },
    makeToast(title, message, append = false) {
        this.toastCount++
        this.$bvToast.toast(message, {
          title: title,
          autoHideDelay: 5000000,
          appendToast: append,
          toaster: "b-toaster-bottom-full",
          variant: "danger",
          solid: true
        })
      },
    savePassword() {
      let self = this;
      self.loading = true;

      var request = this.form;

      if (request.new_password != request.new_password_confirmation) {
          self.$notify({
            group: "msg",
            type: "error",
            title: "Notification:",
            text: "Password confirmation doesn't match Password",
          });
        self.loading = false;
        return;
      }
      this.axios
        .post("/server/updateuserpassword", request, this.get_axiosConfig())
        .then(function () {
          self.$notify({
            group: "msg",
            type: "success",
            title: "Notification:",
            text: "Successfuly changed password!",
          });
          self.$router.push("/app/platform/ProjectList");
        })
        .catch(function (error) {
          self.loading = false;
          console.log(error);
          let msg = error.message;
          if (msg.includes("400")) {
            self.showAlert("Invalid request");
          } else if (msg.includes("401")) {
            self.showAlert("Invalid password");
          }
        });
    },
  },
};
</script>