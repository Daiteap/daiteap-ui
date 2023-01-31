<template>
  <div>
    <div v-if="howToProvideConfiguration === 'choose'" v-on:click="cancelBtn()"></div>
    <div v-else @click="showHelp = false"></div>
    <div>
      <div v-if="showHelp === true">
        <div @click="$emit('auth')" class="h4 provideConfigurationIcon">
          Use OAuth:
              <img width="35pix" style="margin-bottom: 5px;" src="../../../assets/img/azure_logo_small.png" />
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
          <div class="">
            <p>To create cloud credential for <code>Microsoft Azure</code> you will need to know the following fields:
            </p>
            <ul>
              <li>
                <p><code>Tenant ID</code> - the tenant ID identifying the tenant for you Azure account.
                  Go to <strong>Tenant properties</strong> and copy the <code>Tenant ID</code></p>
              </li>
              <li>
                <p><code>Subscription ID</code> - the ID for the subscription you want to use in Azure.
                  Go to <strong>Subscriptions</strong>, select the subscription you want to use and copy the
                  <code>Subscription ID</code>.
                </p>
              </li>
              <li>
                <p><code>Client ID</code> - the application (Daiteap) that will access and manage Azure resources.
                  To create a new Client, go to <strong>Azure Active Directory -&gt; App registrations</strong> and
                  create
                  new <strong>New registration</strong> by clicking the ADD button.
                  Fill in the input fields:</p>
              </li>
            </ul>
            <p>Name: "Daiteap"<br>
              Supported account types: "Accounts in this organizational directory only (Default Directory only - Single
              tenant)" </p>
            <p>And click <strong>Register</strong>. Copy the <strong>Client ID</strong> of the newly created
              application.</p>
            <ul>
              <li><code>Client Secret</code> - the secret used to authenticate the client application in Azure
                While having selected the newly created client application, click on <strong>Certificates &amp; secrets
                  -&gt; New client secret</strong>. Add description and Expire time and click <strong>Add</strong>. Copy
                the <strong>Value</strong> field which must be entered in the Daiteap <strong>Azure Client
                  Secret</strong>
                box.</li>
            </ul>
            <p>At last, we need to grant permissions to the newly created client application which will defined which
              resources
              and action Daiteap can perform on the configured Azure cloud credential. For this, we will create a custom
              role
              in the Azure IAM service and will assign this role to the client application from the previous step.</p>
            <p>Go the the <strong>IAM</strong> tab and on Subscription you used. Click <strong>Add -&gt; Add custom
                role</strong>. The role name <code>DaiteapRole</code> will be automatically filled. For Baseline
              permissions
              select <strong>Start from JSON</strong>. The JSON file will the needed permissions can be downloaded <a
                href="/azure_custom_role.json" download="azure_role_daiteap.json">here</a>. Click <strong>Next</strong> and finally create the role.</p>
            <p>At last we create a RoleAssignment, which will map the role to the client application. Click on
              <strong>Role
                assignments -&gt; Add role assignment</strong>, select the custom role <strong>DaiteapRole</strong>,
              click
              <strong>Next -&gt; Members -&gt; Select members</strong> and search the created client application by
              name. The
              select it and click Select and finish the creation of the role assignment.
            </p>
            <p>
              There's one API permission that you need to give your application.
              Go to App registrations -> Select your client application ->
              API permissions -> Add a permission -> Microsoft Graph ->
              Application permissions -> Directory.Read.All, after that the
              permission needs to be granted by an admin.
            </p>
            <p>
              After granting the permission, press the checkbox `Grant admin consent for Default Directory` 
              and then make sure the Status fields shows that the access is granted.
            </p>
            <a
              href="/documentation/cloud_credentials/#microsoft-azure"
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
          <div @click="$emit('auth')" class="h4 provideConfigurationIcon">
            Use OAuth:
              <img width="35pix" style="margin-bottom: 5px;" src="../../../assets/img/azure_logo_small.png" />
          </div>
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
              <input required autocomplete="off" v-model="azure.label" class="form-control" :class="[
                'input',
                $v.azure.label.$invalid && !labelInFocus ? 'is-danger' : '',
              ]" type="text" id="azureLabel" @focus="labelInFocus = true" @blur="labelInFocus = false"
                data-test-id="input-label" />
            </div>
            <div class="">
              <p v-if="
                allCurrentLabels.includes(azure.label)
              " class="help text-danger">
                Cloud Credentials name already taken
              </p>
              <p v-else-if="azure.label != '' && !$v.azure.label.and" class="help text-danger">
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
                v-model="azure.description"
                class="form-control"
                :class="['input']"
                type="text"
                id="azuredescription"
                data-test-id="input-description"
              ></b-form-textarea>
            </div>
            <div class="">
              <p v-if="$v.azure.description.$invalid" class="help text-danger">
                Invalid Cloud Credentials Description
              </p>
              <div v-else style="height: 1.375rem"></div>
            </div>
          </div>

          <div class="form-group">
            <label class="control-label"> Azure Directory (tenant) ID: * </label>
            <div class="">
              <input v-model="azure.azure_tenant_id" class="form-control" :class="[
                'input',
                $v.azure.azure_tenant_id.$invalid &&
                  azure.azure_tenant_id != '' &&
                  !tenantIdInFocus
                  ? 'is-danger'
                  : '',
              ]" type="text" id="azureTenantID" @focus="tenantIdInFocus = true" @blur="tenantIdInFocus = false"
                data-test-id="input-directory" />
            </div>
            <div class="">
              <p v-if="azure.azure_tenant_id != '' && $v.azure.azure_tenant_id.$invalid" class="help text-danger">
                Please provide a valid Azure Tenant ID
              </p>
              <div v-else style="height: 1.375rem"></div>
            </div>
          </div>

          <div class="form-group">
            <label class="control-label"> Azure Subscription ID: * </label>
            <div class="">
              <input v-model="azure.azure_subscription_id" class="form-control" :class="[
                'input',
                $v.azure.azure_subscription_id.$invalid &&
                  azure.azure_subscription_id != '' &&
                  !subscriptionIdInFocus
                  ? 'is-danger'
                  : '',
              ]" type="text" id="azureSubscriptionID" @focus="subscriptionIdInFocus = true"
                @blur="subscriptionIdInFocus = false" data-test-id="input-subscription" />
            </div>
            <div class="">
              <p v-if="azure.azure_subscription_id != '' && $v.azure.azure_subscription_id.$invalid"
                class="help text-danger">
                Please provide a valid Azure Subscription ID
              </p>
              <div v-else style="height: 1.375rem"></div>
            </div>
          </div>

          <div class="form-group">
            <label class="control-label">
              Azure Application (client) ID: *
            </label>
            <div class="">
              <input v-model="azure.azure_client_id" class="form-control" :class="[
                'input',
                $v.azure.azure_client_id.$invalid &&
                  azure.azure_client_id != '' &&
                  !clientIdInFocus
                  ? 'is-danger'
                  : '',
              ]" type="text" id="azureClientID" @focus="clientIdInFocus = true" @blur="clientIdInFocus = false"
                data-test-id="input-id" />
            </div>
            <div class="">
              <p v-if="azure.azure_client_id != '' && $v.azure.azure_client_id.$invalid" class="help text-danger">
                Please provide a valid Azure Client ID
              </p>
              <div v-else style="height: 1.375rem"></div>
            </div>
          </div>

          <div class="form-group">
            <label class="control-label"> Azure Client Secret: * </label>
            <div class="">
              <input v-model="azure.azure_client_secret" class="form-control" :class="[
                'input',
                $v.azure.azure_client_secret.$invalid &&
                  azure.azure_client_secret != '' &&
                  !clientIdInFocus
                  ? 'is-danger'
                  : '',
              ]" type="password" id="azureClientSecret" @focus="clientSecretInFocus = true"
                @blur="clientSecretInFocus = false" data-test-id="input-secret" />
            </div>
            <div class="">
              <p v-if="azure.azure_client_secret != '' && $v.azure.azure_client_secret.$invalid"
                class="help text-danger">
                Please provide a valid Azure Client Secret
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
              <div class="custom-button float-right ml-5" :class="[$v.azure.$invalid || loading ? 'deactivated' : '']"
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
import {
  required,
  and,
  or,
  minLength,
  maxLength,
} from "vuelidate/lib/validators";

const isAdded = (value) => /^[*]{10,10}$/.test(value);
let newLabelValidation = function (value) {
  if (this.allCurrentLabels.includes(value)) {
    return false;
  }
  return true;
};

export default {
  name: 'AddAzureAccount',
  props:
  {
    azureAccountFromParent: {},
    loading: Boolean,
    allCurrentLabels: Array,
  },
  mixins: [validationMixin],
  data() {
    return {
      labelInFocus: false,
      tenantIdInFocus: false,
      subscriptionIdInFocus: false,
      clientIdInFocus: false,
      clientSecretInFocus: false,
      azure: {
        label: "",
        description: "",
        azure_tenant_id: "",
        azure_subscription_id: "",
        azure_client_id: "",
        azure_client_secret: "",
        statusOfValidation: false,
        provider: "azure",
      },
      newAzure: {
        label: "",
        description: "",
        azure_tenant_id: "",
        azure_subscription_id: "",
        azure_client_id: "",
        azure_client_secret: "",
      },
      sharedCredentials: false,
      howToProvideConfiguration: "Manually",
      showHelp: false,
    };
  },
  validations: {
    azure: {
      label: {
        and: and(minLength(3), maxLength(36)),
        newLabelValidation,
        required,
      },
      description: {
        maxLength: maxLength(1024),
      },
      azure_tenant_id: {
        or: or(and(minLength(36), maxLength(36)), isAdded),
        required,
      },
      azure_subscription_id: {
        or: or(and(minLength(36), maxLength(36)), isAdded),
        required,
      },
      azure_client_id: {
        or: or(and(minLength(36), maxLength(36)), isAdded),
        required,
      },
      azure_client_secret: {
        or: or(and(minLength(5), maxLength(100)), isAdded),
        required,
      },
    },
  },
  mounted() {
    var rand = Math.random().toString(36).slice(5);
    this.azure.label = 'azure' + "-" + rand;
  },
  methods: {
    submitNewAccountDetails() {
      this.newAzure.label = document.getElementById("azureLabel").value;
      this.newAzure.description =
        document.getElementById("azuredescription").value;
      this.newAzure.azure_tenant_id =
        document.getElementById("azureTenantID").value;
      this.newAzure.azure_subscription_id = document.getElementById(
        "azureSubscriptionID"
      ).value;
      this.newAzure.azure_client_id =
        document.getElementById("azureClientID").value;
      this.newAzure.azure_client_secret =
        document.getElementById("azureClientSecret").value;

      this.$emit('saveNewAccount', "azure", this.newAzure, this.sharedCredentials);
    },
    cancelBtn() {
      this.azure.label = "";
      this.azure.description = "";
      this.azure.azure_tenant_id = "";
      this.azure.azure_subscription_id = "";
      this.azure.azure_client_id = "";
      this.azure.azure_client_secret = "";
      this.showHelp = false;
      this.howToProvideConfiguration = "choose";
      this.$bvModal.hide("bv-modal-addazureaccount");
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

.scroll {
  max-height: 525px;
  overflow-y: auto;
}

div > p {
  line-height: 24px;
  font-size: 16px;
  margin: 0 0 24px;
}
</style>

