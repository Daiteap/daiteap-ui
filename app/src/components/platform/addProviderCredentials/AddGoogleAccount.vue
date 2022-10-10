<template>
  <div>
    <div v-if="howToProvideConfiguration === 'choose'" v-on:click="cancelBtn()"></div>
    <div v-else @click="showHelp = false"></div>
    <div>
      <div v-if="showHelp === true">
        <div @click="$emit('auth')" class="h4 provideConfigurationIcon">
          Use OAuth:
          <i class="far fa-address-book" id="googleOAuthIcon"></i>
        </div>
        <br />
        <hr />
        <br />
        <div class="h4">Manual Configuration</div>
        <div class="text-right">
          <small class="showHelpLink" @click="showHelp = false">
            back to providing your credentials</small>
        </div>
        <hr />
        <br />
        <div class="col pl-4 pr-4">
          <p class="card-text"></p>
          <div class="p">
            <p>Requirements:</p>
            <ul>
              <li>
                <p>working GCP cloud account</p>
              </li>
              <li>
                <p><strong>Compute API</strong> enabled in GCP APIs</p>
              </li>
              <li>
                <p><strong>Cloud DNS API</strong> enabled in GCP APIs</p>
              </li>
              <li>
                <p><strong>Cloud Asset API</strong> enabled in GCP APIs</p>
              </li>
              <li>
                <p><strong>Cloud Resource Manager API</strong> enabled in GCP APIs</p>
              </li>
            </ul>
            <p>You can find the APIs <a href="https://console.cloud.google.com/apis/" target="_blank">here</a>.</p>
            <p>
              To configure the GCP cloud credential, one must create a service
              account in GCP under
              <strong
                >APIs &amp; Services -&gt; Credentials -&gt; Create credentials
                -&gt; Service account</strong
              >. Fill in a unique <strong>Service account ID</strong>, detailed
              <strong>Name</strong>
              <i>(ex. NAME-daiteap-cloudcredential)</i> and
              <strong>Description</strong>
              <i>(with workspace and other platform information)</i> and finish
              by clicking DONE. Then click on the created service account,
              select <strong>KEYS</strong> tab and create new JSON key type. The
              create key function will generate and download a JSON file, which
              must be uploaded to the Daiteap platform when creating the cloud
              credential.
            </p>
            <p>Then we must grant permissions for this service account. Go to <strong>IAM &amp; Admin -&gt; IAM -&gt;
                Add</strong> and select the just created service account under <strong>New principals</strong>. Then add
              the following roles:
            </p>
            <ul>
              <li><strong>Compute Admin</strong></li>
              <li><strong>Storage Admin</strong></li>
              <li><strong>DNS Administrator</strong></li>
              <li><strong>Service Account User</strong></li>
              <li><strong>Cloud Asset Viewer</strong></li>
              <li><strong>Security Reviewer</strong></li>
              <li><strong>Compute Image User</strong></li>
            </ul>
            <p>After uploading the JSON file and clicking Save, the cloud credential will be ready for use.</p>
            <a
              href="/documentation/cloud_credentials/#google-cloud"
              target="_blank"
            >
              Full Guide
            </a>
            <br />
          </div>
        </div>
      </div>

      <div v-else class="box">
        <form class="form-horizontal" role="form">
          <d-row>
            <div @click="$emit('auth')" class="h4 provideConfigurationIcon">
              Use OAuth:
              <i class="far fa-address-book" id="googleOAuthIcon"></i>
            </div>
          </d-row>
          <br />
          <hr />
          <br />
          <h4>Manual Configuration</h4>
          <div class="text-right">
            <small class="showHelpLink" @click="showHelp = true">Credentials configuration instructions
            </small>
          </div>
          <br />
          <div class="form-group">
            <label class="control-label"> Cloud Credentials Name: * </label>
            <div class="">
              <input required autocomplete="off" v-model="google.label" class="form-control" :class="[
                'input',
                $v.google.label.$invalid && !labelInFocus ? 'is-danger' : '',
              ]" type="text" id="googleLabel" @focus="labelInFocus = true" @blur="labelInFocus = false"
                data-test-id="input-label" />
            </div>
            <div class="">
              <p v-if="
                allCurrentLabels.includes(google.label)
              " class="help text-danger">
                Cloud Credentials name already taken
              </p>
              <p v-else-if="google.label != '' && !$v.google.label.and" class="help text-danger">
                This Cloud Credentials name is not valid
              </p>
              <div v-else style="height: 1.375rem"></div>
            </div>
          </div>

          <div class="form-group">
            <label class="control-label"> Cloud Credentials Description: </label>
            <div class="">
              <input autocomplete="off" v-model="google.description" class="form-control" :class="['input']" type="text"
                id="googledescription" data-test-id="input-description" />
            </div>
            <div class="">
              <p v-if="$v.google.description.$invalid" class="help text-danger">
                Invalid Cloud Credentials Description
              </p>
              <div v-else style="height: 1.375rem"></div>
            </div>
          </div>

          <div class="form-group">
            <div class="justify-content">
              <label class="control-label">
                Google service account key: * &nbsp;&nbsp;
              </label>
              <input type="file" class="ml-3" @change="selectedGoogleKey($event)" data-test-id="input-key" />
            </div>
            <div>
              <div class="">
                <p v-if="google.google_key != '' && $v.google.google_key.$invalid" class="help text-danger">
                  Please provide a valid Secret Key
                </p>
                <div v-else style="height: 1.375rem"></div>
              </div>
            </div>
          </div>

          <div>
            <span style="vertical-align: middle;"> Shared Credentials: </span>
            <div class="my-3 ml-3 customCheckbox" :class="{ checked: sharedCredentials }" style="vertical-align: middle"
              @click="sharedCredentials = !sharedCredentials" data-test-id="shared-credential">
              <span v-if="sharedCredentials" class="fas fa-check checkboxCheckmark"></span>
            </div>
          </div>

          <hr />
          <br />

          <div class="form-group">
            <div class="">
              <div class="custom-button float-right ml-5" :class="[$v.google.$invalid || loading ? 'deactivated' : '']"
                @click="submitNewAccountDetails()" data-test-id="input-save">
                Save
              </div>
              <div class="custom-button float-right mr-5" @click="cancelBtn()">
                Cancel
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { validationMixin } from "vuelidate";
import { required, and, minLength, maxLength } from "vuelidate/lib/validators";

function isValidGoogleKey(str) {
  if (!str) {
    return true;
  }
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }

  if (JSON.parse(str).hasOwnProperty("project_id")) {
    return true;
  } else {
    return false;
  }
}
let newLabelValidation = function (value) {
  if (this.allCurrentLabels.includes(value)) {
    return false;
  }
  return true;
};

export default {
  name: 'AddGoogleAccount',
  props:
  {
    googleAccountFromParent: {},
    loading: Boolean,
    allCurrentLabels: Array,
  },
  mixins: [validationMixin],
  data() {
    return {
      labelInFocus: false,
      serviceAccounttKeyInFocus: false,
      google: {
        label: "",
        description: "",
        google_key: "",
        statusOfValidation: false,
        provider: "google",
      },
      newGoogle: {
        label: "",
        description: "",
        google_key: "",
      },
      sharedCredentials: false,
      howToProvideConfiguration: "Manually",
      showHelp: false,
    };
  },
  validations: {
    google: {
      label: {
        and: and(minLength(3), maxLength(30)),
        newLabelValidation,
        required,
      },
      description: {
        maxLength: maxLength(1024),
      },
      google_key: {
        and: and(minLength(10), maxLength(5000), isValidGoogleKey),
        required,
      },
    },
  },
  mounted() {
    var rand = Math.random().toString(36).slice(5);
    this.google.label = 'google' + "-" + rand;
  },
  methods: {
    submitNewAccountDetails() {
      this.newGoogle.label = document.getElementById("googleLabel").value;
      this.newGoogle.description =
        document.getElementById("googledescription").value;

      this.$emit('saveNewAccount', "google", this.newGoogle, this.sharedCredentials);
    },
    cancelBtn() {
      this.google.label = "";
      this.google.description = "";
      this.google.google_key = "";
      this.howToProvideConfiguration = "choose";
      this.$bvModal.hide("bv-modal-addgoogleaccount");
      this.showHelp = false;
      this.$nextTick(() => {
        this.$v.$reset();
      });
      this.$router.push({ name: "CloudProfile" });
    },
    selectedGoogleKey(event) {
      let file = event.target.files[0];
      let reader = new FileReader();
      reader.readAsText(file, "UTF-8");
      reader.onload = (evt) => {
        this.google.google_key = evt.target.result;
        this.newGoogle.google_key = evt.target.result;
      };
      reader.onerror = (evt) => {
        console.error(evt);
      };
    },
  },
};
</script>


<style scoped>
.modal-content {
  max-width: 650pix;
}

.form-group {
  margin: auto;
}

.btn {
  width: 10rem;
}

.btn-primary {
  width: 100%;
}

.provideConfigurationIcon {
  cursor: pointer;
  color: #1d1e22;
}

.showHelpLink {
  cursor: pointer;
  font-weight: bold;
  text-decoration-line: underline;
}

.showHelpLink:hover {
  color: #1d1e22;
}

div>p {
  line-height: 24px;
  font-size: 16px;
  margin: 0 0 24px;
}
</style>