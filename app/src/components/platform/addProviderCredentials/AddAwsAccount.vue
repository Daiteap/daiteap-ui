<template>
  <div>
    <div @click="showHelp = false"></div>
    <div>
      <div v-if="showHelp === true">
        <h4>Manual Configuration</h4>
        <div class="text-right">
          <small class="showHelpLink" @click="showHelp = false">
            back to providing your credentials</small>
        </div>
        <hr />
        <br />
        <div class="col pl-4 pr-4">
          <p class="card-text"></p>
          <div class="p">
            Create a new user. Go to
            <b>Services -> IAM -> Users -> Add user</b>, input new name and
            select <b>Programmatic access</b>. <br /><br />
            For permissions, attach the following policies:<br />
            <ul>
              <li><b>AmazonEC2FullAccess</b></li>
              <li><b>AmazonS3FullAccess</b></li>
              <li><b>ResourceGroupsandTagEditorReadOnlyAccess</b></li>
              <li><b>AmazonRoute53FullAccess</b></li>
              <li><b>IAMReadOnlyAccess</b></li>
              <li><b>AWSOrganizationsReadOnlyAccess</b></li>
            </ul>
            Create the user. Copy and paste the <b>Access key ID</b> and
            <b>Secret access key</b> from AWS into the corresponding Daiteap
            fields. <br /><br />
            <a
              href="/documentation/cloud_credentials/#amazon-aws"
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
          <h4>Manual Configuration</h4>
          <div class="text-right">
            <small class="showHelpLink" @click="showHelp = true">Credentials configuration instructions
            </small>
          </div>
          <br />
          <div class="form-group">
            <label class="control-label"> Cloud Credentials Name: * </label>
            <div class="">
              <input required autocomplete="off" v-model="aws.label" class="form-control" :class="[
                'input',
                $v.aws.label.$invalid && !labelInFocus ? 'is-danger' : '',
              ]" type="text" id="awsLabel" @focus="labelInFocus = true" @blur="labelInFocus = false"
                data-test-id="input-label" />
            </div>
            <div class="">
              <p v-if="
                allCurrentLabels.includes(aws.label)
              " class="help text-danger">
                Cloud Credentials name already taken
              </p>
              <p v-if="aws.label != '' && !$v.aws.label.and" class="help text-danger">
                This Cloud Credentials name is not valid
              </p>
              <div v-else style="height: 1.375rem"></div>
            </div>
          </div>

          <div class="form-group">
            <label class="control-label"> Cloud Credentials Description: </label>
            <div class="">
              <input autocomplete="off" v-model="aws.description" class="form-control" :class="['input']" type="text"
                id="awsdescription" data-test-id="input-description" />
            </div>
            <div class="">
              <p v-if="$v.aws.description.$invalid" class="help text-danger">
                Invalid Cloud Credentials Description
              </p>
              <div v-else style="height: 1.375rem"></div>
            </div>
          </div>

          <div class="form-group">
            <label class="control-label"> AWS Access Key ID: * </label>
            <div class="">
              <input v-model="aws.aws_access_key_id" class="form-control" :class="[
                'input',
                $v.aws.aws_access_key_id.$invalid &&
                  aws.aws_access_key_id != '' &&
                  !accessKeyInFocus
                  ? 'is-danger'
                  : '',
              ]" type="text" id="awsAccessKey" data-test-id="input-id" />
            </div>
            <div class="">
              <p v-if="aws.aws_access_key_id != '' && $v.aws.aws_access_key_id.$invalid" class="help text-danger">
                Please provide a valid AWS Access Key
              </p>
              <div v-else style="height: 1.375rem"></div>
            </div>
          </div>
          <div class="form-group">
            <label class="control-label"> AWS Secret Access Key: * </label>
            <div class="">
              <input v-model="aws.aws_secret_access_key" class="form-control" :class="[
                'input',
                $v.aws.aws_secret_access_key.$invalid &&
                  aws.aws_secret_access_key != '' &&
                  !secretKeyInFocus
                  ? 'is-danger'
                  : '',
              ]" type="password" id="secretAccessKey" data-test-id="input-secret" />
            </div>
            <div class="">
              <p v-if="aws.aws_secret_access_key != '' && $v.aws.aws_secret_access_key.$invalid"
                class="help text-danger">
                Please provide a valid AWS Secret Key
              </p>
              <div v-else style="height: 1.375rem"></div>
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
              <div class="custom-button float-right ml-5" :class="[$v.aws.$invalid || loading ? 'deactivated' : '']"
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

let newLabelValidation = function (value) {
  if (this.allCurrentLabels.includes(value)) {
    return false;
  }
  return true;
};

export default {
  name: 'AddAwsAccount',
  props:
  {
    awsAccountFromParent: {},
    loading: Boolean,
    allCurrentLabels: Array,
  },
  mixins: [validationMixin],
  data() {
    return {
      labelInFocus: false,
      accessKeyInFocus: false,
      secretKeyInFocus: false,
      aws: {
        label: "",
        description: "",
        aws_access_key_id: "",
        aws_secret_access_key: "",
        deletable: true,
        statusOfValidation: false,
        provider: "aws",
      },
      newAws: {
        label: "",
        description: "",
        aws_access_key_id: "",
        aws_secret_access_key: "",
      },
      sharedCredentials: false,
      showHelp: false,
    };
  },
  validations: {
    aws: {
      label: {
        and: and(minLength(3), maxLength(30)),
        newLabelValidation,
        required,
      },
      description: {
        maxLength: maxLength(1024),
      },
      aws_access_key_id: {
        and: and(minLength(20), maxLength(20)),
        required,
      },
      aws_secret_access_key: {
        and: and(minLength(40), maxLength(40)),
        required,
      },
    },
  },
  mounted() {
    var rand = Math.random().toString(36).slice(5);
    this.aws.label = 'aws' + "-" + rand;
  },
  methods: {
    submitNewAccountDetails() {
      this.newAws.label = document.getElementById("awsLabel").value;
      this.newAws.description = document.getElementById("awsdescription").value;
      this.newAws.aws_access_key_id =
        document.getElementById("awsAccessKey").value;
      this.newAws.aws_secret_access_key =
        document.getElementById("secretAccessKey").value;

      this.$emit('saveNewAccount', "aws", this.newAws, this.sharedCredentials);
    },
    cancelBtn() {
      this.aws.label = "";
      this.aws.description = "";
      this.aws.aws_access_key_id = "";
      this.aws.aws_secret_access_key = "";
      this.$bvModal.hide("bv-modal-addawsaccount");
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

div>p {
  line-height: 24px;
  font-size: 16px;
  margin: 0 0 24px;
}
</style>