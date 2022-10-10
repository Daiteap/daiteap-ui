<template>
  <b-modal centered id="bv-modal-editaccountnamemodal" hide-footer>
    <div v-on:click="cancelBtn()"></div>
    <div>
      <div class="box mb-3">
        <form class="form-horizontal" role="form">
          <div class="h4 text-center">Edit Cloud Credentials</div>
          <hr />

          <div>
            <div>
              <label> Cloud Credentials Name: * </label>
            <div>
              <input
                autocomplete="off"
                v-model="accountToEdit.label"
                class="form-control"
                type="text"
                id="label"
              />
            </div>
            <div v-if="accountToEdit.label != '' && $v.accountToEdit.label.$invalid">
            <p class="help text-danger">
              Invalid Cloud Credentials Name
            </p>
            </div>
            <div v-else style="height: 1.375rem"></div>
          </div>

          <div>
            <label> Cloud Credentials Description: </label>
            <div>
              <input
                autocomplete="off"
                v-model="accountToEdit.description"
                class="form-control"
                :class="['input']"
                type="text"
                id="description"
              />
            </div>
            <div>
            <p v-if="$v.accountToEdit.description.$invalid" class="help text-danger">
              Invalid Cloud Credentials Description
            </p>
            <div v-else style="height: 1.375rem"></div>
            </div>
          </div>

          <div>
            <label> Contact: </label>
            <div>
              <input
                readonly
                autocomplete="off"
                v-model="accountToEdit.contact"
                class="form-control"
                :class="['input']"
                type="text"
                id="contact"
              />
            </div>
            <div>
            <div style="height: 1.375rem"></div>
            </div>
          </div>
          
          <div>
            <label
            v-if="this.accountToEdit.provider==='alicloud'">
              Alibaba Cloud Access Key:
            </label>
            <label
            v-if="this.accountToEdit.provider==='aws'">
              AWS Access Key Id:
            </label>
            <label
            v-if="this.accountToEdit.provider==='azure'">
              Azure Directory (tenant) ID:
            </label>
            <label
            v-if="this.accountToEdit.provider==='google'">
              Account type:
            </label>
            <label
            v-if="this.accountToEdit.provider==='openstack'">
              Region Name:
            </label>
            <label
            v-if="this.accountToEdit.provider==='onpremise' || this.accountToEdit.provider==='iotarm'">
              Gateway Public IP:
            </label>
            <div>
              <input
                readonly
                :value="this.accountToEdit.idKey1"
                class="form-control"
                type="text"
              />
            </div>
            <div style="height: 1.375rem"></div>
          </div>

          <div 
          v-if="this.accountToEdit.provider!='alicloud' && this.accountToEdit.provider!='aws'">
            <label
            v-if="this.accountToEdit.provider==='azure'">
              Azure Subscription ID:
            </label>
            <label
            v-if="this.accountToEdit.provider==='google'">
              Project ID:
            </label>
            <label
            v-if="this.accountToEdit.provider==='openstack'">
              Authentication URL:
            </label>
            <label
            v-if="this.accountToEdit.provider==='onpremise' || this.accountToEdit.provider==='iotarm'">
              Gateway Private IP:
            </label>
            <div>
              <input
                readonly
                :value="this.accountToEdit.idKey2"
                class="form-control"
                type="text"
              />
            </div>
            <div style="height: 1.375rem"></div>
          </div>
          
          <div 
          v-if="this.accountToEdit.provider!='alicloud' && this.accountToEdit.provider!='aws'">
            <label
            v-if="this.accountToEdit.provider==='azure'">
              Azure Application (client) ID:
            </label>
            <label
            v-if="this.accountToEdit.provider==='google'">
              Private key ID:
            </label>
            <label
            v-if="this.accountToEdit.provider==='openstack'">
              Application Credential ID:
            </label>
            <label
            v-if="this.accountToEdit.provider==='onpremise' || this.accountToEdit.provider==='iotarm'">
              Admin username:
            </label>
            <div>
              <input
                readonly
                :value="this.accountToEdit.idKey3"
                class="form-control"
                type="text"
              />
            </div>
            <div style="height: 1.375rem"></div>
          </div>
          <div>
            <label
            v-if="this.accountToEdit.provider==='alicloud'">
              Alibaba Cloud Secret Key:
            </label>
            <label
            v-if="this.accountToEdit.provider==='aws'">
              AWS Secret Access Key:
            </label>
            <label
            v-if="this.accountToEdit.provider==='azure'">
              Azure Client Secret:
            </label>
            <label
            v-if="this.accountToEdit.provider==='google'">
              Google service account key:
            </label>
            <label
            v-if="this.accountToEdit.provider==='openstack'">
              Application Credential secret:
            </label>
            <label
            v-if="this.accountToEdit.provider==='onpremise' || this.accountToEdit.provider==='iotarm'">
              Admin private key:
            </label>
            <div>
              <input
                readonly
                autocomplete="off"
                value="************************************"
                class="form-control"
                type="password"
              />
            </div>
            <div style="height: 1.375rem"></div>
            </div>
          </div>

          <div>
            <span style="vertical-align: middle;"> 
              Shared Credentials: 
            </span>
            <div
              class="my-3 ml-3 customCheckbox"
              :class="{ checked: accountToEdit.shared, disabled: disabledCheckbox() }"
              style="vertical-align: middle"
              @click="checkSharedBox()"
              id="shared"
            >
              <span
                class="fas fa-check checkboxCheckmark"
              ></span>
            </div>
          </div>

          <hr />
          <div>
            <div>
              <div
                class="custom-button float-right"
                :class="[$v.accountToEdit.$invalid ? 'deactivated' : '']"
                @click="submitChangesOfAccountName()"
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
import { validationMixin } from "vuelidate";
import {
  and,
  minLength,
  maxLength,
  required,
} from "vuelidate/lib/validators";

export default {
  name: 'EditAccountName',
  props: ["accountToEdit"],
  mixins: [validationMixin],
  validations: {
    accountToEdit: {
      label: {
        and: and(minLength(3), maxLength(30)),
        required,
      },
      description: {
        maxLength: maxLength(1024)
      },
    },
  },
  methods: {
    submitChangesOfAccountName() {
      this.$emit('updateCredential', this.accountToEdit,  this.accountToEdit.id, this.accountToEdit.provider);
      this.cancelBtn();
    },
    cancelBtn() {
      this.$bvModal.hide("bv-modal-editaccountnamemodal");
    },
    disabledCheckbox() {
      if (this.computed_isAdmin) {
        return false;
      }
      if (this.accountToEdit.owner == this.computed_userInfo.id) {
        return false;
      }
      return true;
    },
    checkSharedBox() {
      this.accountToEdit.shared = !this.accountToEdit.shared;
      
      if (this.accountToEdit.shared) {
        document.getElementById('shared').classList.add("checked");
      } else {
        document.getElementById('shared').classList.remove("checked");
      }
    }
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
  width: 33.33%;
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
</style>