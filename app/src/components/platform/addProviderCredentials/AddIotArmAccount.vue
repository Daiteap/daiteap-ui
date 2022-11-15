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
                Create new user on all IoT-ARM hosts and then use it <br />for
                <strong>Admin username</strong> field
                <br />
                <code
                  >sudo adduser --disabled-password --gecos ""
                  &#60;username&#62;</code
                >
              </li>
              <li class="li">
                Add user to sudo group on all IoT-ARM hosts
                <br />
                <code>sudo usermod -aG sudo &#60;username&#62;</code>
              </li>
              <li class="li">
                Make user passwordless on all IoT-ARM hosts
                <br />
                <code
                  >sudo echo "&#60;username&#62; ALL=(ALL) NOPASSWD: ALL" >>
                  /etc/sudoers</code
                >
                <br />
                in case there is a file in /etc/sudoers.d directory, change him
                instead of /etc/sudoers
              </li>
              <li class="li">
                Create .ssh directory on all IoT-ARM hosts
                <br />
                <code
                  >sudo -u &#60;username&#62; -- mkdir -p
                  /home/&#60;username&#62;/.ssh</code
                >
              </li>
              <li class="li">
                Create authorized_keys on all IoT-ARM hosts
                <br />
                <code
                  >sudo -u &#60;username&#62; -- touch
                  /home/&#60;username&#62;/.ssh/authorized_keys</code
                >
              </li>
              <li class="li">
                Add public key from step 4 to authorized_keys of the user on all
                IoT-ARM hosts
                <br />
                <code>vim /home/&#60;username&#62;/.ssh/authorized_keys</code>
              </li>
            </ol>
            <br />
          </div>
        </div>
      </div>

      <div v-else class="box">
        <form class="form-horizontal" role="form" id="addNewAccountIotArmeForm">
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
                v-model="iotarm.label"
                class="form-control"
                :class="[
                  'input',
                  $v.iotarm.label.$invalid && !labelInFocus ? 'is-danger' : '',
                ]"
                type="text"
                id="iotarmlabel"
                @focus="labelInFocus = true"
                @blur="labelInFocus = false"
                data-test-id="input-label"
              />
            </div>
            <div class="">
              <p
                v-if="
                  allCurrentLabels.includes(iotarm.label)
                "
                class="help text-danger"
              >
                Cloud Credentials name already taken
              </p>
              <p v-else-if="iotarm.label != '' && !$v.iotarm.label.and" class="help text-danger">
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
                v-model="iotarm.description"
                class="form-control"
                :class="['input']"
                type="text"
                id="iotarmdescription"
                data-test-id="input-description"
              />
            </div>
            <div class="">
              <p v-if="$v.iotarm.description.$invalid" class="help text-danger">
                Invalid Cloud Credentials Description
              </p>
              <div v-else style="height: 1.375rem"></div>
            </div>
          </div>

          <div class="form-group">
            <label class="control-label"> Network CIDR: * </label>
            <div class="">
              <input
                v-model="iotarm.vpcCidr"
                class="form-control"
                :class="[
                  'input',
                  $v.iotarm.vpcCidr.$invalid &&
                  iotarm.vpcCidr != '' &&
                  !gwPublicIpInFocus
                    ? 'is-danger'
                    : '',
                ]"
                type="text"
                id="vpcCidr"
                @focus="gwPublicIpInFocus = true"
                @blur="gwPublicIpInFocus = false"
                data-test-id="input-vpc"
              />
            </div>
            <div class="">
              <p
                v-if="iotarm.vpcCidr != '' && $v.iotarm.vpcCidr.$invalid"
                class="help text-danger"
              >
                Please provide a valid IP
              </p>
              <div v-else style="height: 1.375rem"></div>
            </div>
          </div>

          <div class="form-group">
            <label class="control-label"> Gateway Public IP: * </label>
            <div class="">
              <input
                v-model="iotarm.gw_public_ip"
                class="form-control"
                :class="[
                  'input',
                  $v.iotarm.gw_public_ip.$invalid &&
                  iotarm.gw_public_ip != '' &&
                  !gwPublicIpInFocus
                    ? 'is-danger'
                    : '',
                ]"
                type="text"
                id="iotGwPublicIP"
                @focus="gwPublicIpInFocus = true"
                @blur="gwPublicIpInFocus = false"
                data-test-id="input-public"
              />
            </div>
            <div class="">
              <p
                v-if="iotarm.gw_public_ip != '' && $v.iotarm.gw_public_ip.$invalid"
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
                :disabled="$v.iotarm.vpcCidr.$invalid"
                v-model="iotarm.gw_private_ip"
                class="form-control"
                :class="[
                  'input',
                  $v.iotarm.gw_private_ip.$invalid &&
                  iotarm.gw_private_ip != '' &&
                  !gwPrivateIpInFocus
                    ? 'is-danger'
                    : '',
                ]"
                type="text"
                id="iotGwPrivateIP"
                @focus="gwPrivateIpInFocus = true"
                @blur="gwPrivateIpInFocus = false"
                data-test-id="input-private"
              />
            </div>
            <div class="">
              <p
                v-if="iotarm.gw_private_ip != '' && $v.iotarm.gw_private_ip.$invalid"
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
                v-model="iotarm.admin_username"
                class="form-control"
                :class="[
                  'input',
                  $v.iotarm.admin_username.$invalid &&
                  iotarm.admin_username != '' &&
                  !iotAdminUsernameInFocus
                    ? 'is-danger'
                    : '',
                ]"
                type="text"
                id="iotAdminUsername"
                @focus="iotAdminUsernameInFocus = true"
                @blur="iotAdminUsernameInFocus = false"
                data-test-id="input-username"
              />
            </div>

            <div class="">
              <p
                v-if="iotarm.admin_username != '' && $v.iotarm.admin_username.$invalid"
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
                id="iotAdminPrivateKeyForm"
                type="file"
                class="ml-3"
                @change="selectedIotArmeKey($event)"
                data-test-id="input-key"
              />
            </div>
            <div class="">
              <p
                v-if="iotarm.admin_private_key != '' && $v.iotarm.admin_private_key.$invalid"
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
                v-model="iotarm.admin_private_key_password"
                class="form-control"
                :class="[
                  'input',
                  $v.iotarm.admin_private_key_password.$invalid &&
                  iotarm.admin_private_key_password != '' &&
                  !iotAdminPrivateKeyPasswordInFocus
                    ? 'is-danger'
                    : '',
                ]"
                type="password"
                id="iotAdminPrivateKeyPassword"
                @focus="iotAdminPrivateKeyPasswordInFocus = true"
                @blur="iotAdminPrivateKeyPasswordInFocus = false"
                data-test-id="input-password"
              />
            </div>

            <div class="">
              <p
                v-if="iotarm.admin_private_key_password === ''"
                class="help text-secondary"
              >
                Optional field (needed only if your Admin private key is
                password protected)
              </p>
              <p
                v-else-if="$v.iotarm.admin_private_key_password.$invalid"
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
                :class="[$v.iotarm.$invalid || loading ? 'deactivated' : '']"
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
  name: 'AddIotArmAccount',
  props:
  {
    iotarmAccountFromParent: {}, 
    loading: Boolean,
    allCurrentLabels: Array,
  },
  mixins: [validationMixin],
  data() {
    return {
      labelInFocus: false,
      gwPublicIpInFocus: false,
      gwPrivateIpInFocus: false,
      iotAdminUsernameInFocus: false,
      adminPrivateKeyInFocus: false,
      iotAdminPrivateKeyPasswordInFocus: false,
      showHelp: false,
      iotarm: {
        label: "",
        description: "",
        vpcCidr: "",
        gw_public_ip: "",
        gw_private_ip: "",
        admin_username: "",
        admin_private_key: "",
        admin_private_key_password: "",
        statusOfValidation: false,
        provider: "iotarm",
      },
      newIotArme: {
        label: "",
        description: "",
        vpcCidr: "",
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
    iotarm: {
      label: {
        and: and(minLength(3), maxLength(30)),
        newLabelValidation,
        required,
      },
      description: {
        maxLength: maxLength(1024),
      },
      vpcCidr: {
        and: and(minLength(7), maxLength(15)),
        required,
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
    this.iotarm.label = 'iotarm' + "-" + rand;
  },
  watch: {
    "iotarm.vpcCidr": function () {
      this.checkIpAddress();
    },
    "iotarm.gw_private_ip": function () {
      this.checkIpAddress();
    },
  },
  methods: {
    submitNewAccountDetails() {
      this.newIotArme.label = document.getElementById("iotarmlabel").value;
      this.newIotArme.description =
        document.getElementById("iotarmdescription").value;
      this.newIotArme.vpcCidr = document.getElementById("vpcCidr").value;
      this.newIotArme.gw_public_ip =
        document.getElementById("iotGwPublicIP").value;
      this.newIotArme.gw_private_ip =
        document.getElementById("iotGwPrivateIP").value;
      this.newIotArme.admin_username =
        document.getElementById("iotAdminUsername").value;
      if (document.getElementById("iotAdminPrivateKeyPassword").value === "") {
        delete this.newIotArme.admin_private_key_password;
      } else {
        this.newIotArme.admin_private_key_password = document.getElementById(
          "iotAdminPrivateKeyPassword"
        ).value;
      }
      
      this.$emit('saveNewAccount', "iotarm", this.newIotArme, this.sharedCredentials);
    },
    cancelBtn() {
      this.iotarm.label = "";
      this.iotarm.description = "";
      this.iotarm.vpcCidr = "";
      this.iotarm.gw_public_ip = "";
      this.iotarm.gw_private_ip = "";
      this.iotarm.admin_username = "";
      this.iotarm.admin_private_key = "";
      this.iotarm.admin_private_key_password = "";
      this.iotarm.v = "";
      this.$bvModal.hide("bv-modal-addiotarmaccount");
      document.getElementById("addNewAccountIotArmeForm").reset();
      this.$nextTick(() => {
        this.$v.$reset();
      });
      this.$router.push({ name: "CloudProfile" });
    },
    selectedIotArmeKey(event) {
      let file = event.target.files[0];
      let reader = new FileReader();
      reader.readAsText(file, "UTF-8");
      reader.onload = (evt) => {
        this.iotarm.admin_private_key = evt.target.result;
        this.newIotArme.admin_private_key = evt.target.result;
      };
      reader.onerror = (evt) => {
        console.error(evt);
      };
    },
    checkIpAddress() {
      let self = this;
      let network = self.iotarm.vpcCidr;
      let value = self.iotarm.gw_private_ip;

      if (
        value.length > 7 &&
        value.length < 15 &&
        network.length > 7 &&
        network.length < 15
      ) {
        return new Promise((resolve) => {
          self.axios
            .get(
              "/server/check-ip-address/" + network + "/" + value,
              self.get_axiosConfig()
            )
            .then(function (response) {
              if (response.data.error == true) {
                resolve(false);
              } else {
                resolve(true);
              }
            })
            .catch(function (error) {
              console.log(error);
              self.$notify({
                group: "msg",
                type: "error",
                title: "Notification:",
                text: "Error while checking IP address! " + error,
              });
            });
        });
      }
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