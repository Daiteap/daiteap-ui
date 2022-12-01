<template>
  <div>
    <div @click="showHelp = false"></div>
    <div>
      <div v-if="showHelp === true">
        <h4>Manual Configuration</h4>
        <div class="text-right">
          <small class="showHelpLink" @click="showHelp = false">
            back to providing your credentials</small
          >
        </div>
        <hr />
        <div class="col pl-4 pr-4">
          <p class="card-text"></p>
          <div class="p">
            <p>
              <strong>
                <i class="fa fa-info-circle"></i>
                &nbsp; You can get your credentials from your <span class="openstack-text"/>
                dashboard.
              </strong>
            </p>
            <hr />
            <br />

            <p>
              <strong>
                <i class=""></i>
                Cloud Credentials Name ( <span class="text-danger"> required </span> )
              </strong>
            </p>
            <p class="ml-3">A name for your Cloud Credentials.</p>

            <p>
              <strong>
                <i class=""></i>
                Cloud Credentials Description (<span>optional</span>)
              </strong>
            </p>
            <p class="ml-3">The description of the Cloud Credentials.</p>

            <p>
              <strong>
                <i class=""></i>
                Application Credential ID (
                <span class="text-danger"> required </span> )
              </strong>
            </p>
            <p class="ml-3">
              The ID of the application credential from your <span class="openstack-text"/> account.
            </p>

            <p>
              <strong>
                <i class=""></i>
                Application Credential Secret (
                <span class="text-danger"> required </span> )
              </strong>
            </p>
            <p class="ml-3">
              The secret of the application credential from your <span class="openstack-text"/>
              account.
            </p>

            <p>
              <strong>
                <i class=""></i>
                Region Name ( <span class="text-danger"> required </span> )
              </strong>
            </p>
            <p class="ml-3">
              The name of the <span class="openstack-text"/> region you want to use.
            </p>

            <p>
              <strong>
                <i class=""></i>
                Auth URL ( <span class="text-danger"> required </span> )
              </strong>
            </p>

            <p class="ml-3">
              The URL of the <span class="openstack-text"/> authentication endpoint.
            </p>

            <p>
              <strong>
                <i class=""></i>
                External Network ID (
                <span class="text-danger"> required </span> )
              </strong>
            </p>
            <p class="ml-3">The ID of the <span class="openstack-text"/> external network.</p>

            <br />

            <hr />

            <p>
              If you have any questions, please contact your account
              administrator.
            </p>
          </div>
        </div>
      </div>

      <div v-else class="box">
        <form class="form-horizontal" role="form">
          <h4>Manual Configuration</h4>
          <div class="text-right">
            <small class="showHelpLink" @click="goToDocumentation()">
              Credentials configuration instructions
            </small>
          </div>
          <br />
          <div class="form-group">
            <label class="control-label"> Cloud Credentials Name: * </label>
            <div class="">
              <input
                required
                autocomplete="off"
                v-model="openstack.label"
                class="form-control"
                :class="[
                  'input',
                  $v.openstack.label.$invalid && !labelInFocus
                    ? 'is-danger'
                    : '',
                ]"
                type="text"
                id="openstackLabel"
                @focus="labelInFocus = true"
                @blur="labelInFocus = false"
                data-test-id="input-label"
              />
            </div>
            <div class="">
              <p
                v-if="
                  allCurrentLabels.includes(openstack.label)
                "
                class="help text-danger"
              >
                Cloud Credentials name already taken
              </p>
              <p
                v-if="openstack.label != '' && !$v.openstack.label.and"
                class="help text-danger"
              >
                This Cloud Credentials name is not valid
              </p>
              <div v-else style="height: 1.375rem"></div>
            </div>
          </div>

          <div class="form-group">
            <label class="control-label"> Cloud Credentials Description: </label>
            <div class="">
              <input
                autocomplete="off"
                v-model="openstack.description"
                class="form-control"
                :class="['input']"
                type="text"
                id="openstackdescription"
                data-test-id="input-description"
              />
            </div>
            <div class="">
              <p
                v-if="$v.openstack.description.$invalid"
                class="help text-danger"
              >
                Invalid Cloud Credentials Description
              </p>
              <div v-else style="height: 1.375rem"></div>
            </div>
          </div>

          <div class="form-group">
            <label class="control-label"> Application Credential ID: * </label>
            <div class="">
              <input
                v-model="openstack.application_credential_id"
                class="form-control"
                :class="[
                  'input',
                  $v.openstack.application_credential_id.$invalid &&
                  openstack.application_credential_id != '' &&
                  !accessKeyInFocus
                    ? 'is-danger'
                    : '',
                ]"
                type="text"
                id="applicationCredentialId"
                data-test-id="input-id"
              />
            </div>
            <div class="">
              <p
                v-if="openstack.application_credential_id != '' && $v.openstack.application_credential_id.$invalid"
                class="help text-danger"
              >
                Please provide a valid <span class="openstack-text"/> application credential id
              </p>
              <div v-else style="height: 1.375rem"></div>
            </div>
          </div>
          <div class="form-group">
            <label class="control-label">
              Application Credential Secret: *
            </label>
            <div class="">
              <input
                v-model="openstack.application_credential_secret"
                class="form-control"
                :class="[
                  'input',
                  $v.openstack.application_credential_secret.$invalid &&
                  openstack.application_credential_secret != '' &&
                  !secretKeyInFocus
                    ? 'is-danger'
                    : '',
                ]"
                type="password"
                id="applicationCredentialSecret"
                data-test-id="input-secret"
              />
            </div>
            <div class="">
              <p
                v-if="openstack.application_credential_secret != '' && $v.openstack.application_credential_secret.$invalid"
                class="help text-danger"
              >
                Please provide a valid <span class="openstack-text"/> application credential secret
              </p>
              <div v-else style="height: 1.375rem"></div>
            </div>
          </div>
          <div class="form-group">
            <label class="control-label"> Region Name: * </label>
            <div class="">
              <input
                v-model="openstack.region_name"
                class="form-control"
                :class="[
                  'input',
                  $v.openstack.region_name.$invalid &&
                  openstack.region_name != '' &&
                  !accessKeyInFocus
                    ? 'is-danger'
                    : '',
                ]"
                type="text"
                id="regionName"
                data-test-id="input-region"
              />
            </div>
            <div class="">
              <p
                v-if="openstack.region_name != '' && $v.openstack.region_name.$invalid"
                class="help text-danger"
              >
                Please provide a valid <span class="openstack-text"/> region name
              </p>
              <div v-else style="height: 1.375rem"></div>
            </div>
          </div>
          <div class="form-group">
            <label class="control-label"> Auth URL: * </label>
            <div class="">
              <input
                v-model="openstack.auth_url"
                class="form-control"
                :class="[
                  'input',
                  $v.openstack.auth_url.$invalid &&
                  openstack.auth_url != '' &&
                  !accessKeyInFocus
                    ? 'is-danger'
                    : '',
                ]"
                type="text"
                id="authUrl"
                data-test-id="input-url"
              />
            </div>
            <div class="">
              <p
                v-if="openstack.auth_url != '' && $v.openstack.auth_url.$invalid"
                class="help text-danger"
              >
                Please provide a valid <span class="openstack-text"/> auth url
              </p>
              <div v-else style="height: 1.375rem"></div>
            </div>
          </div>

          <div class="form-group">
            <label class="control-label"> External Network ID: * </label>
            <div class="">
              <input
                v-model="openstack.external_network_id"
                class="form-control"
                :class="[
                  'input',
                  $v.openstack.external_network_id.$invalid &&
                  openstack.external_network_id != '' &&
                  !accessKeyInFocus
                    ? 'is-danger'
                    : '',
                ]"
                type="text"
                id="externalNetworkId"
                data-test-id="input-network"
              />
            </div>
            <div class="">
              <p
                v-if="openstack.external_network_id != '' && $v.openstack.external_network_id.$invalid"
                class="help text-danger"
              >
                Please provide a valid <span class="openstack-text"/> external network ID
              </p>
              <div v-else style="height: 1.375rem"></div>
            </div>
          </div>

          <div>
            <span style="vertical-align: middle;"> Shared Credentials: </span>
            <div
              class="my-3 ml-3 customCheckbox"
              :class="{ checked: sharedCredentials }"
              style="vertical-align: middle"
              @click="sharedCredentials = !sharedCredentials"
              data-test-id="shared-credential"
            >
              <span
                v-if="sharedCredentials"
                class="fas fa-check checkboxCheckmark"
              ></span>
            </div>
          </div>

          <br />
          <br />

          <div class="form-group">
            <div class="">
              <div
                class="custom-button float-right ml-5"
                :class="[$v.openstack.$invalid || loading ? 'deactivated' : '']"
                @click="submitNewAccountDetails()"
                data-test-id="input-save"
              >
                Save
              </div>
              <div
                class="custom-button float-right mr-5"
                @click="cancelBtn()"
              >
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

let newLabelValidation = function (value) {
  if (this.allCurrentLabels.includes(value)) {
    return false;
  }
  return true;
};

export default {
  name: 'AddOpenstackAccount',
  props:
  {
    openstackAccountFromParent: {},
    loading: Boolean,
    allCurrentLabels: Array,
  },
  mixins: [validationMixin],
  data() {
    return {
      labelInFocus: false,
      accessKeyInFocus: false,
      secretKeyInFocus: false,
      openstack: {
        label: "",
        description: "",
        application_credential_id: "",
        application_credential_secret: "",
        region_name: "",
        auth_url: "",
        external_network_id: "",
        deletable: true,
        statusOfValidation: false,
        provider: "openstack",
      },
      newOpenstack: {
        label: "",
        description: "",
        application_credential_id: "",
        application_credential_secret: "",
        region_name: "",
        auth_url: "",
        external_network_id: "",
      },
      sharedCredentials: false,
      showHelp: false,
    };
  },
  validations: {
    openstack: {
      label: {
        and: and(minLength(3), maxLength(30)),
        newLabelValidation,
        required,
      },
      description: {
        maxLength: maxLength(1024),
      },
      application_credential_id: {
        and: and(minLength(32), maxLength(32)),
        required,
      },
      application_credential_secret: {
        and: and(minLength(6), maxLength(100)),
        required,
      },
      region_name: {
        and: and(minLength(2), maxLength(20)),
        required,
      },
      auth_url: {
        and: and(minLength(6), maxLength(200)),
        required,
      },
      external_network_id: {
        and: and(minLength(36), maxLength(36)),
        required,
      },
    },
  },
  mounted() {
    var rand = Math.random().toString(36).slice(5);
    if (this.computed_theme == 'daiteap') {
      this.openstack.label = 'openstack' + "-" + rand;
    }
  },
  created() {
    this.suggestParams();
  },
  methods: {
    suggestParams() {
      this.axios.get("/server/cloud-credentials/providers/openstack/account-params", this.get_axiosConfig()).then((response) => {
        for (let key in response.data) {
          this.openstack[key] = response.data[key];
        }
      });
    },
    goToDocumentation() {
      window.open(
        "/documentation/cloud_credentials/#secustack",
        "_blank"
      );
    },
    submitNewAccountDetails() {
      this.newOpenstack.label = document.getElementById("openstackLabel").value;
      this.newOpenstack.description = document.getElementById(
        "openstackdescription"
      ).value;
      this.newOpenstack.application_credential_id = document.getElementById(
        "applicationCredentialId"
      ).value;
      this.newOpenstack.application_credential_secret = document.getElementById(
        "applicationCredentialSecret"
      ).value;
      this.newOpenstack.region_name =
        document.getElementById("regionName").value;
      this.newOpenstack.auth_url = document.getElementById("authUrl").value;
      this.newOpenstack.external_network_id =
        document.getElementById("externalNetworkId").value;

      this.$emit('saveNewAccount', "openstack", this.newOpenstack, this.sharedCredentials);
    },
    cancelBtn() {
      this.openstack.label = "";
      this.openstack.description = "";
      this.openstack.application_credential_id = "";
      this.openstack.application_credential_secret = "";
      this.openstack.region_name = "";
      this.openstack.auth_url = "";
      this.openstack.external_network_id = "";
      this.$bvModal.hide("bv-modal-addopenstackaccount");
      this.showHelp = false;
      this.$router.push({ name: "CloudProfile" });
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
.btn-daiteap {
  width: 10rem;
}
.btn-primary {
  width: 100%;
}
.showHelpLink {
  cursor: pointer;
  font-weight: bold;
  text-decoration-line: underline;
}
.showHelpLink:hover {
  color: #1d1e22;
}
code {
  color: #000000ce;
  font-size: 0.9rem;
  font-weight: 500;
  padding: 0.6em 0.5em 0.6em;
  border: black solid 1px;
}
</style>