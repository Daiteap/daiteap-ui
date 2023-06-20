<template>
  <div>
    <div class="card daiteap-content-card">
      <div>
        <CardTitle
          v-if="profile.first_name"
          :title="`Profile Setting of ${profile.first_name} ${profile.last_name}`"
        />

        <CardTitle v-else title="Profile Setting" />
      </div>
      <hr />
      <div class="card-body">
        <VerticalInput
          id="inputUserRole"
          inputLabel="User Role: *"
          inputId="project-role"
          inputType="text"
          inputplaceholder="Select Project Role"
          errorMsg="Invalid Role"
          default="Admin"
          v-model="computed_userInfo.profile.role"
          disabled
        />

        <VerticalInput
          id="inputUsername"
          inputLabel="User: *"
          inputId="username"
          inputType="text"
          inputplaceholder=""
          errorMsg="Invalid Username"
          default=""
          v-model="computed_userInfo.username"
          disabled
        />

        <VerticalInput
          inputLabel="First name: *"
          inputId="first-name"
          inputType="text"
          inputplaceholder="First name"
          errorMsg="Invalid first name"
          v-model.trim="profile.first_name"
          :validation="v$.profile.first_name"
          @change="v$.profile.first_name.$touch"
          default=""
        />

        <VerticalInput
          inputLabel="Last name: *"
          inputId="last-name"
          inputType="text"
          inputplaceholder="Last name"
          errorMsg="Invalid last name"
          v-model.trim="profile.last_name"
          :validation="v$.profile.last_name"
          @change="v$.profile.last_name.$touch"
          default=""
        />

        <VerticalInput
          inputLabel="Company:"
          inputId="company"
          inputType="text"
          inputplaceholder="Company"
          errorMsg="Invalid company"
          v-model.trim="profile.company"
          default=""
        />

        <VerticalInput
          inputLabel="Phone:"
          inputId="phone"
          inputType="text"
          inputplaceholder="Phone"
          errorMsg="Invalid Phone"
          v-model="profile.phone"
          default=""
        />

        <TextAreaInput
          inputLabel="Public SSH key:"
          inputId="ssh-key"
          inputType="text"
          inputplaceholder="Add public SSH key"
          errorMsg="Invalid public SSH key format"
          v-model="profile.sshpubkey"
          default=""
        />

        <TextAreaInput
          v-if="computed_account_settings.enable_kubernetes_yaookcapi"
          inputLabel="Wireguard public key:"
          inputId="wireguard-key"
          inputType="text"
          inputplaceholder="Add Wireguard public key"
          errorMsg="Invalid Wireguard public key"
          v-model="profile.wireguard_public_key"
          default=""
        />

        <b-container fluid>
          <b-row class="my-1 mb-4">
            <label>User image: (max file size 1MB)</label>
              <b-form-file
                v-model="imageFile"
                type="file"
                accept="image/*"
                id="file"
                ref="file"
                @change="onImageFileChanged()"
              />
          </b-row>
        </b-container>

        <div>
          <span style="vertical-align: middle;">&nbsp;Subscribed for email updates and news: </span>
          <div
            class="my-3 ml-3 customCheckbox"
            :class="{ checked: profile.news_subscribbed }"
            style="vertical-align: middle"
            @click="profile.news_subscribbed = !profile.news_subscribbed"
          >
            <span
              v-if="profile.news_subscribbed"
              class="fas fa-check checkboxCheckmark"
            ></span>
          </div>
        </div>

        <div class="form-group">
          <label class="control-label"></label>
          <div
            class="custom-button mr-3 ml-3 mt-5 float-left"
            @click="deleteProfileImage()"
          >
              Remove Image
          </div>
          <img
            v-if="computed_userInfo.image"
            class="rounded-circle"
            width="100"
            height="100"
            :src="computed_userInfo.image"
          />
          <img
            v-else
            class="rounded-circle daiteap-avatar-img"
            width="100"
            height="100"
            style="background-color: black;"
          />
          &nbsp;
          <span class="align-right">
            <div
              class="custom-button mr-3 mt-5 float-right"
              :class="[v$.profile.$invalid ? 'deactivated' : '']"
              @click="saveChangesProfile()"
            >
              Update Profile
            </div>
            <div
              class="custom-button mr-5 mt-5 float-right"
              @click="
                cancelChanges();
                $router.push({
                  name: 'DaiteapWebLandingPage',
                });
              "
            >
              Cancel Changes
            </div>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {useVuelidate} from "@vuelidate/core";
import { maxLength, minLength, alpha, required } from "@vuelidate/validators";
import CardTitle from "@/components/platform/CardTitle";
import VerticalInput from "@/components/platform/input/VerticalInput";
import TextAreaInput from "@/components/platform/input/TextAreaInput";

export default {
  name: "Profile",
  components: {
    CardTitle,
    VerticalInput,
    TextAreaInput,
  },
  data() {
    return {
      v$: useVuelidate(),
      profile: {
        role: "",
        first_name: "",
        last_name: "",
        company: "",
        email: "",
        phone: "",
        sshpubkey: "",
        timezone: "UTC",
        wireguard_public_key: "",
        news_subscribbed: false
      },
      imageFile: [],
      imageFileDirty: false,
    };
  },
  validations: {
    profile: {
      first_name: {
        required,
        maxLength: maxLength(100),
        minLength: minLength(2),
        alpha,
      },
      last_name: {
        required,
        maxLength: maxLength(100),
        minLength: minLength(2),
        alpha,
      },
      company: {},
      phone: {},
      sshpubkey: {
        isSSHFormatCorrect(value) {
          if (value && value.length > 0) {
            var sshpk = require("sshpk");
            try {
              // Try to parse in OpenSSH public key format
              sshpk.parseKey(value, "ssh");
              return true;
            } catch (error) {
              return false;
            }
          }
          return true;
        },
      },
    },
  },
  created() {
    this.profile = this.computed_userInfo.profile;
  },
  destroyed() {
    this.cancelChanges();
  },
  methods: {
    onImageFileChanged() {
      this.imageFileDirty = true;
    },
    saveChangesProfile() {
      let profileUpdate = {
        timezone: "UTC",
      };

      let userToUpdate = {
        first_name: "",
        last_name: "",
      };

      userToUpdate.first_name = this.profile.first_name;
      userToUpdate.last_name = this.profile.last_name;
      userToUpdate.email = this.profile.email;

      profileUpdate.company = this.profile.company;
      profileUpdate.phone = this.profile.phone;
      profileUpdate.sshpubkey = this.profile.sshpubkey;
      profileUpdate.wireguard_public_key = this.profile.wireguard_public_key;
      profileUpdate.timezone = this.profile.timezone;
      profileUpdate.news_subscribbed = this.profile.news_subscribbed;

      if (
        this.imageFileDirty == true &&
        this.imageFile != [] &&
        this.imageFile != null
      ) {
        this.submitProfileImage();
      }

      this.updateUserInfo(profileUpdate, userToUpdate);
    },
    async submitProfileImage() {
      let formData = new FormData();
      formData.append("picture", this.imageFile);

      this.imageFile = [];
      this.imageFileDirty = false;

      const result = await this.updateUserProfilePicture(formData);
      if (result) {
        setTimeout(() => {
          this.$emit("avatarChanged");
        }, 1500);
      }
    },
    deleteProfileImage() {
      this.imageFile = [];
      this.imageFileDirty = false;

      this.deleteUserProfilePicture();
    },
    cancelChanges() {
      this.getUserInfo();

      setTimeout(() => {
        this.profile = this.computed_userInfo.profile;
        this.imageFile = [];
        this.imageFileDirty = false;
      }, 200);
    },
  },
};
</script>

<style scoped>
.form-group {
  margin: auto;
}
.btn {
  width: 10rem;
}
</style>