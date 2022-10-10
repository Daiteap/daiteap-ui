<template>
  <b-modal centered id="bv-modal-edittenant" hide-footer>
    <div v-on:click="cancelBtn()"></div>
    <div>
      <div class="box mb-3">
        <form class="form-horizontal" role="form">
          <div class="h4 text-center">Edit Workspace</div>
          <hr />

          <div>
            <div>
              <label> Workspace Name: </label>
              <div>
                <input
                  autocomplete="off"
                  v-model="currentTenant.name"
                  class="form-control"
                  type="text"
                  id="name"
                />
              </div>
              <div style="height: 1rem"></div>
            </div>
          </div>

          <div>
            <div>
              <label> Workspace Owner: </label>
              <div>
                <input
                  autocomplete="off"
                  v-model="currentTenant.owner"
                  class="form-control"
                  type="text"
                  id="owner"
                />
              </div>
              <div style="height: 1rem"></div>
            </div>
          </div>

          <div>
            <div>
              <label> Workspace Email: * </label>
              <div>
                <input
                  autocomplete="off"
                  v-model="currentTenant.email"
                  class="form-control"
                  :class="['input']"
                  type="text"
                  id="email"
                />
              </div>
              <div v-if="$v.currentTenant.email.$invalid && currentTenant.email != ''">
                <p class="help text-danger">Invalid Email</p>
              </div>
              <div v-else style="height: 1rem"></div>
            </div>
          </div>

          <div>
            <div>
              <label> Workspace Phone: </label>
              <div>
                <input
                  autocomplete="off"
                  v-model="currentTenant.phone"
                  class="form-control"
                  type="text"
                  id="phone"
                />
              </div>
              <p
                class="help text-danger"
                v-if="$v.currentTenant.phone.$invalid"
              >
                Invalid Phone
              </p>
              <div v-else style="height: 1rem"></div>
            </div>
          </div>

          <div>
            <div>
              <label> Workspace Company: </label>
              <div>
                <input
                  autocomplete="off"
                  v-model="currentTenant.company"
                  class="form-control"
                  type="text"
                  id="company"
                />
              </div>
              <div style="height: 1rem"></div>
            </div>
          </div>

          <hr />
          <div>
            <div
              class="custom-button float-right"
              :class="[$v.currentTenant.$invalid ? 'deactivated' : '']"
              @click="submitChanges()"
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
        </form>
      </div>
    </div>
  </b-modal>
</template>

<script>
import { validationMixin } from "vuelidate";
import { required, email, helpers } from "vuelidate/lib/validators";

const regPhone = helpers.regex("regPhone", /^[\s0-9-+()]*$/);

export default {
  name: 'EditTenantPopup',
  mixins: [validationMixin],
  data() {
    return {
      tenant: {},
    };
  },
  props: {
    currentTenant: {},
    oldName: String,
  },
  validations: {
    currentTenant: {
      email: {
        required,
        email,
      },
      phone: {
        regPhone,
      },
    },
  },
  methods: {
    submitChanges() {
      this.tenant.name = document.getElementById("name").value;
      this.tenant.owner = document.getElementById("owner").value;
      this.tenant.email = document.getElementById("email").value;
      this.tenant.phone = document.getElementById("phone").value;
      this.tenant.company = document.getElementById("company").value;
      this.tenant.id = this.currentTenant.id;

      this.$emit("updateTenant", this.tenant);

      this.cancelBtn();
    },
    cancelBtn() {
      this.$bvModal.hide("bv-modal-edittenant");
    },
  },
};
</script>

<style scoped>
.form-group {
  margin: auto;
}
.btn {
  width: 33.33%;
}
.btn-primary {
  width: 100%;
}
</style>