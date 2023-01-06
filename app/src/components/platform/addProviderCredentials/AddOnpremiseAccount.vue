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
        <br />
        <div class="col pl-4 pr-4 scroll">
          <div class="p">
            <b>Fields:</b>
            <ul class="ul">
              <li class="li">
                <strong>Gateway Public IP</strong> - Gateway host public ip, the
                following ports needs to be open:
                <ul>
                  <li>22 - SSH</li>
                  <li>50 - VPN</li>
                  <li>500 - VPN</li>
                  <li>4500 - VPN</li>
                  <li>6443 - Kubernetes API</li>
                  <li>31000 - Grafana</li>
                  <li>31001 - Kibana</li>
                </ul>
              </li>
              <li class="li">
                <strong>Gateway Private IP</strong> - Private IP of the gateway
                host
              </li>
              <li class="li">
                <strong>Admin Username</strong> - Username of the ssh user
              </li>
              <li class="li">
                <strong>Admin private key</strong> - Private ssh key for the
                user
              </li>
            </ul>
            <br />
            <b>Instructions:</b>

            <ol>
              <li class="li">
                Create directory to store ssh keys
                <br />
                <code>mkdir -p ssh/</code>
              </li>
              <li class="li">
                Generate ssh key pair
                <br />
                <code>ssh-keygen -t rsa -b 4096 -f ssh/id_rsa -N ''</code>
              </li>
              <li class="li">
                From <strong>Admin private key</strong> field use the
                <mark>Choose File</mark> button to select the file with the
                private key
              </li>
              <li class="li">
                Get content of public key
                <br />
                <code>cat ssh/id_rsa.pub</code>
              </li>
              <li class="li">
                Create new user on all on-premise hosts and then use it
                <br />for <strong>Admin username</strong> field
                <br />
                <code
                  >sudo adduser --disabled-password --gecos ""
                  &#60;username&#62;</code
                >
              </li>
              <li class="li">
                Add user to sudo group on all on-premise hosts
                <br />
                <code>sudo usermod -aG sudo &#60;username&#62;</code>
              </li>
              <li class="li">
                Make user passwordless on all on-premise hosts
                <br />
                <code
                  >sudo echo "&#60;username&#62; ALL=(ALL) NOPASSWD: ALL" >>
                  /etc/sudoers</code
                >
              </li>
              <li class="li">
                Create .ssh directory on all on-premise hosts
                <br />
                <code
                  >sudo -u &#60;username&#62; -- mkdir -p
                  /home/&#60;username&#62;/.ssh</code
                >
              </li>
              <li class="li">
                Create authorized_keys on all on-premise hosts
                <br />
                <code
                  >sudo -u &#60;username&#62; -- touch
                  /home/&#60;username&#62;/.ssh/authorized_keys</code
                >
              </li>
              <li class="li">
                Add public key from step 4 to authorized_keys of the user on all
                onpremise hosts
                <br />
                <code>vim /home/&#60;username&#62;/.ssh/authorized_keys</code>
              </li>
            </ol>
            <br />
          </div>
        </div>
      </div>

      <div v-else class="box">
        <form
          class="form-horizontal"
          role="form"
          id="addNewAccountOnpremiseForm"
        >
          <h4>Manual Configuration</h4>
          <div class="text-right">
            <small class="showHelpLink" @click="showHelp = true"
              >Credentials configuration instructions
            </small>
          </div>
          <br />
          <div class="form-group">
            <label class="control-label"> Cloud Credentials Name: * </label>
            <div class="">
              <input
                required
                autocomplete="off"
                v-model="onpremise.label"
                class="form-control"
                :class="[
                  'input',
                  $v.onpremise.label.$invalid && !labelInFocus
                    ? 'is-danger'
                    : '',
                ]"
                type="text"
                id="onPremislabel"
                @focus="labelInFocus = true"
                @blur="labelInFocus = false"
                data-test-id="input-label"
              />
            </div>
            <div class="">
              <p
                v-if="
                  allCurrentLabels.includes(onpremise.label)
                "
                class="help text-danger"
              >
                Cloud Credentials name already taken
              </p>
              <p
                v-else-if="onpremise.label != '' && !$v.onpremise.label.and"
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
              <b-form-textarea
                autocomplete="off"
                v-model="onpremise.description"
                class="form-control"
                :class="['input']"
                type="text"
                id="onpremisedescription"
                data-test-id="input-description"
              ></b-form-textarea>
            </div>
            <div class="">
              <p
                v-if="$v.onpremise.description.$invalid"
                class="help text-danger"
              >
                Invalid Cloud Credentials Description
              </p>
              <div v-else style="height: 1.375rem"></div>
            </div>
          </div>

          <div class="form-group">
            <label class="control-label"> Gateway Public IP: * </label>
            <div class="">
              <input
                v-model="onpremise.gw_public_ip"
                class="form-control"
                :class="[
                  'input',
                  $v.onpremise.gw_public_ip.$invalid &&
                  onpremise.gw_public_ip != '' &&
                  !gwPublicIpInFocus
                    ? 'is-danger'
                    : '',
                ]"
                type="text"
                id="gwPublicIP"
                @focus="gwPublicIpInFocus = true"
                @blur="gwPublicIpInFocus = false"
                data-test-id="input-public"
              />
            </div>
            <div class="">
              <p
                v-if="onpremise.gw_public_ip != '' && $v.onpremise.gw_public_ip.$invalid"
                class="help text-danger"
              >
                Please provide a valid IP
              </p>
              <div v-else style="height: 1.375rem"></div>
            </div>
          </div>
          <div class="form-group">
            <label class="control-label"> Gateway Private IP: * </label>
            <div class="">
              <input
                v-model="onpremise.gw_private_ip"
                class="form-control"
                :class="[
                  'input',
                  $v.onpremise.gw_private_ip.$invalid &&
                  onpremise.gw_private_ip != '' &&
                  !gwPrivateIpInFocus
                    ? 'is-danger'
                    : '',
                ]"
                type="text"
                id="gwPrivateIP"
                @focus="gwPrivateIpInFocus = true"
                @blur="gwPrivateIpInFocus = false"
                data-test-id="input-private"
              />
            </div>
            <div class="">
              <p
                v-if="onpremise.gw_private_ip != '' && $v.onpremise.gw_private_ip.$invalid"
                class="help text-danger"
              >
                Please provide a valid IP
              </p>
              <div v-else style="height: 1.375rem"></div>
            </div>
          </div>

          <div class="form-group">
            <label class="control-label"> Admin username: * </label>
            <div class="">
              <input
                v-model="onpremise.admin_username"
                class="form-control"
                :class="[
                  'input',
                  $v.onpremise.admin_username.$invalid &&
                  onpremise.admin_username != '' &&
                  !adminUsernameInFocus
                    ? 'is-danger'
                    : '',
                ]"
                type="text"
                id="adminUsername"
                @focus="adminUsernameInFocus = true"
                @blur="adminUsernameInFocus = false"
                data-test-id="input-username"
              />
            </div>

            <div class="">
              <p
                v-if="onpremise.admin_username != '' && $v.onpremise.admin_username.$invalid"
                class="help text-danger"
              >
                Please provide a valid username
              </p>
              <div v-else style="height: 1.375rem"></div>
            </div>
          </div>

          <div class="form-group">
            <div class="justify-content">
              <label class="control-label">
                Admin private key: * &nbsp;&nbsp;
              </label>
              <input
                id="adminPrivateKeyForm"
                type="file"
                class="ml-3"
                @change="selectedOnpremiseKey($event)"
                data-test-id="input-key"
              />
            </div>
            <div class="">
              <p
                v-if="onpremise.admin_private_key != '' && $v.onpremise.admin_private_key.$invalid"
                class="help text-danger"
              >
                Please provide a private key.
              </p>
              <div v-else style="height: 1.375rem"></div>
            </div>
          </div>

          <div class="form-group">
            <label class="control-label"> Private Key Password: </label>
            <div class="">
              <input
                v-model="onpremise.admin_private_key_password"
                class="form-control"
                :class="[
                  'input',
                  $v.onpremise.admin_private_key_password.$invalid &&
                  onpremise.admin_private_key_password != '' &&
                  !adminPrivateKeyPasswordInFocus
                    ? 'is-danger'
                    : '',
                ]"
                type="password"
                id="adminPrivateKeyPassword"
                @focus="adminPrivateKeyPasswordInFocus = true"
                @blur="adminPrivateKeyPasswordInFocus = false"
                data-test-id="input-password"
              />
            </div>

            <div class="">
              <p
                v-if="onpremise.admin_private_key_password === ''"
                class="help text-secondary"
              >
                Optional field (needed only if your Admin private key is
                password protected)
              </p>
              <p
                v-else-if="$v.onpremise.admin_private_key_password.$invalid"
                class="help text-danger"
              >
                Please provide a password for the private key
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

          <hr />
          <br />

          <div class="form-group">
            <div class="">
              <div
                class="custom-button float-right ml-5"
                :class="[$v.onpremise.$invalid || loading ? 'deactivated' : '']"
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
import { and, required, minLength, maxLength } from "vuelidate/lib/validators";

let newLabelValidation = function (value) {
  if (this.allCurrentLabels.includes(value)) {
    return false;
  }
  return true;
};

export default {
  name: 'AddOnpremiseAccount',
  props:
  {
    onpremiseAccountFromParent: {}, 
    loading: Boolean,
    allCurrentLabels: Array,
  },
  mixins: [validationMixin],
  data() {
    return {
      labelInFocus: false,
      gwPublicIpInFocus: false,
      gwPrivateIpInFocus: false,
      adminUsernameInFocus: false,
      adminPrivateKeyInFocus: false,
      adminPrivateKeyPasswordInFocus: false,
      showHelp: false,
      onpremise: {
        label: "",
        description: "",
        gw_public_ip: "",
        gw_private_ip: "",
        admin_username: "",
        admin_private_key: "",
        admin_private_key_password: "",
        statusOfValidation: false,
        provider: "onpremise",
      },
      newOnpremise: {
        label: "",
        description: "",
        gw_public_ip: "",
        gw_private_ip: "",
        admin_username: "",
        admin_private_key: "",
        admin_private_key_password: "",
      },
      sharedCredentials: false,
    };
  },
  validations: {
    onpremise: {
      label: {
        and: and(minLength(3), maxLength(30)),
        newLabelValidation,
        required,
      },
      description: {
        maxLength: maxLength(1024),
      },
      gw_public_ip: {
        and: and(minLength(7), maxLength(15)),
        required,
      },
      gw_private_ip: {
        and: and(minLength(7), maxLength(15)),
        required,
      },
      admin_username: {
        and: and(minLength(3), maxLength(30)),
        required,
      },
      admin_private_key: {
        and: and(minLength(10), maxLength(50000)),
        required,
      },
      admin_private_key_password: {
        minLength: minLength(3),
        maxLength: maxLength(50),
      },
    },
  },
  mounted() {
    var rand = Math.random().toString(36).slice(5);
    this.onpremise.label = 'onpremise' + "-" + rand;
  },
  methods: {
    submitNewAccountDetails() {
      this.newOnpremise.label = document.getElementById("onPremislabel").value;
      this.newOnpremise.description = document.getElementById(
        "onpremisedescription"
      ).value;
      this.newOnpremise.gw_public_ip =
        document.getElementById("gwPublicIP").value;
      this.newOnpremise.gw_private_ip =
        document.getElementById("gwPrivateIP").value;
      this.newOnpremise.admin_username =
        document.getElementById("adminUsername").value;
      if (document.getElementById("adminPrivateKeyPassword").value === "") {
        delete this.newOnpremise.admin_private_key_password;
      } else {
        this.newOnpremise.admin_private_key_password = document.getElementById(
          "adminPrivateKeyPassword"
        ).value;
      }

      this.$emit('saveNewAccount', "onpremise", this.newOnpremise, this.sharedCredentials);
    },
    cancelBtn() {
      this.onpremise.label = "";
      this.onpremise.description = "";
      this.onpremise.gw_public_ip = "";
      this.onpremise.gw_private_ip = "";
      this.onpremise.admin_username = "";
      this.onpremise.admin_private_key = "";
      this.onpremise.admin_private_key_password = "";
      this.onpremise.v = "";
      this.$bvModal.hide("bv-modal-addonpremiseaccount");
      document.getElementById("addNewAccountOnpremiseForm").reset();
      this.$nextTick(() => {
        this.$v.$reset();
      });
      this.$router.push({ name: "CloudProfile" });
    },
    selectedOnpremiseKey(event) {
      let file = event.target.files[0];
      let reader = new FileReader();
      reader.readAsText(file, "UTF-8");
      reader.onload = (evt) => {
        this.onpremise.admin_private_key = evt.target.result;
        this.newOnpremise.admin_private_key = evt.target.result;
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
.showHelpLink {
  cursor: pointer;
  font-weight: bold;
  text-decoration-line: underline;
}
.showHelpLink:hover {
  color: #1d1e22;
}
.scroll {
  max-height: 600px;
  overflow-y: auto;
}
code {
  color: #000000ce;
  font-size: 0.9rem;
  font-weight: 500;
  padding: 0.6em 0.5em 0.6em;
  border: black solid 1px;
}
mark {
  background-color: rgba(0, 0, 0, 0.15);
  border: black solid 1px;
}
li {
  padding-bottom: 0.2rem;
}
</style>