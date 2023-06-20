<template>
  <div
    v-if="loadingTable"
    style="margin-top: 6rem"
    class="d-flex justify-content-center"
  >
    <div class="spinner-border" role="status">
      <span class="sr-only">Loading...</span>
    </div>
  </div>

  <div v-else-if="allTemplates.length < 1 && !loadingTable">
    <div>No templates saved.</div>
  </div>

  <div v-else class="mt-2">
    <div>
      <SpecificUserInfo
        v-if="showSpecificUserInfo"
        :username="specificUserUsername"
        @hideUserDetails="hideUserDetails"
      />
      <EditTemplatePopup
        v-if="showEditTemplatePopup"
        :currentTemplate="templateToEdit"
        :oldName="templateToEditName"
        @updateTemplate="updateTemplate"
      />

      <table
        class="table table-bordered"
        id="templatesDataTable"
        width="100%"
        cellspacing="0"
      >
        <thead>
          <tr>
            <th>Name</th>
            <th name="templatesHidePriority2">Description</th>
            <th name="templatesHidePriority5">Provider</th>
            <th name="templatesHidePriority4">Type</th>
            <th name="templatesHidePriority0">Created at</th>
            <th name="templatesHidePriority1">Created by</th>
            <th name="templatesHidePriority3">Edit</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(template, index) in allTemplates" :key="index">
            <td
              class="clickForDetails"
              @click="
                $router.push({
                  name: 'TemplateDetails',
                  params: { templateID: template.id },
                })
              "
              :title="template.name"
            >
              <strong> {{ template.name }} </strong>
            </td>
            <td name="templatesHidePriority2" :title="template.description">
              {{ template.description }}
            </td>
            <td name="templatesHidePriority5">
              <img
                v-if="template.providers.includes('Azure')"
                title="Azure"
                style="height: 20px; margin-right: 5px"
                src="../../../assets/img/azure_logo_small.png"
              />
              <img
                v-if="template.providers.includes('Amazon')"
                title="AWS"
                style="height: 20px; margin-right: 5px"
                src="../../../assets/img/aws_logo_small.png"
              />
              <img
                v-if="template.providers.includes('Google')"
                title="Google Cloud"
                style="height: 20px; margin-right: 5px"
                src="../../../assets/img/googleCloud_logo_small.png"
              />
              <img
                v-if="template.providers.includes('Onpremise')"
                title="Onpremise"
                style="height: 20px; margin-right: 5px"
                src="../../../assets/img/onpremise.svg"
              />
              <img
                v-if="template.providers.includes('IotArm')"
                title="IoT-ARM"
                style="height: 20px; margin-right: 5px"
                src="../../../assets/img/IoTArm_logo_small.svg"
              />
              <img
                v-if="
                  template.providers.includes('Openstack') &&
                  computed_theme == 'daiteap'
                "
                title="OpenStack"
                style="height: 20px; margin-right: 5px"
                src="../../../assets/img/openstack_logo_small.png"
              />
            </td>
            <td name="templatesHidePriority4">
              <div v-if="template.type == 1">DLCM</div>
              <div v-else-if="template.type == 3">DK3S</div>
              <div v-else-if="template.type == 5">CAPI</div>
              <div v-else-if="template.type == 7">DLCMv2</div>
              <div v-else>Compute (VM)</div>
            </td>
            <td name="templatesHidePriority0">
              {{ FormatDateFilter(template.created_at) }}
            </td>
            <td
              name="templatesHidePriority1"
              class="clickForDetails"
              v-on:click="showUserDetails(template.contact)"
              :title="template.contact"
            >
              {{ template.contact }}
            </td>
            <td name="templatesHidePriority3">
              <div class="pl-2">
                <div
                  title="Edit"
                  @click="openEditPopup(template)"
                  class="fas fa-edit editIcon"
                ></div>
              </div>
            </td>
            <td>
              <div class="pl-2">
                <div
                  title="Delete"
                  class="far fa-trash-alt removeAccountIcon"
                  @click="removeTemplate(template)"
                ></div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <GenericPopupWarning
      :message="`Confirm deleting ${templateToRemove.name}`"
      @confirm="onTemplateDeleteConfirmed"
    />
  </div>
</template>

<script>
import axios from "axios";
import GenericPopupWarning from "@/components/platform/popup_modals/GenericPopupWarning";
import SpecificUserInfo from "@/components/platform/popup_modals/SpecificUserInfo";
import EditTemplatePopup from "@/components/platform/popup_modals/EditTemplatePopup";

export default {
  name: "TemplatesTable",
  mounted() {
    setTimeout(() => {
      this.changeColumnsVisibility("templates", 5);
      this.columnsEvent = this.changeColumnsVisibility.bind(
        null,
        "templates",
        5
      );
      window.addEventListener("resize", this.columnsEvent);
    }, 300);

    let self = this;
    this.getTemplatesList();

    this.interval = setInterval(() => {
      self.getTemplatesList();
    }, 5000);
  },
  props: {},
  data() {
    return {
      loadingTable: true,
      interval: "",
      allTemplates: [],
      templateToRemove: "",
      showSpecificUserInfo: false,
      specificUserUsername: "",
      templateToEdit: {},
      templateToEditName: "",
      showEditTemplatePopup: false,
      columnsEvent: "",
    };
  },
  created() {
    this.getTemplatesList();
  },
  methods: {
    onTemplatesChanged() {
      setTimeout(() => this.getTemplatesList(), 500);
    },
    removeTemplate(template) {
      this.templateToRemove = template;
      this.$bvModal.show("bv-modal-removeuserwarning");
    },
    onTemplateDeleteConfirmed() {
      this.$bvModal.hide("bv-modal-removeuserwarning");
      let templateToRemove = this.templateToRemove;

      let self = this;
      axios
        .delete(
          "/server/tenants/" +
            this.computed_active_tenant_id +
            "/environment-templates/" +
            templateToRemove.id,
          this.get_axiosConfig()
        )
        .then(function () {})
        .catch(function (error) {
          console.log(error);
          if (error.response && error.response.status == "403") {
            self.$notify({
              group: "msg",
              type: "error",
              title: "Notification:",
              text: "Access Denied",
            });
          } else {
            self.$notify({
              group: "msg",
              type: "error",
              title: "Notification:",
              text: "Error while deleting template!",
            });
          }
        });

      this.onTemplatesChanged();
    },
    async getTemplatesList() {
      let self = this;

      let templates;
      templates = await this.getTemplates();

      self.allTemplates = templates;

      self.loadingTable = false;
    },
    goToRemoveAccountWarning(accountToRemove) {
      this.$emit("removeAccount", accountToRemove);
    },
    showUserDetails(username) {
      this.specificUserUsername = username;
      this.showSpecificUserInfo = true;
    },
    hideUserDetails() {
      this.showSpecificUserInfo = false;
    },
    openEditPopup(template) {
      this.templateToEdit = template;
      this.templateToEditName = template.name;
      this.showEditTemplatePopup = true;
      this.$nextTick(function () {
        this.$bvModal.show("bv-modal-edittemplate");
      });
    },
    updateTemplate(template) {
      let self = this;
      this.axios
        .put(
          "/server/tenants/" +
            this.computed_active_tenant_id +
            "/environment-templates/" +
            template.id,
          {
            name: template.name,
            description: template.description,
          },
          this.get_axiosConfig()
        )
        .then(function () {
          self.$notify({
            group: "msg",
            type: "success",
            title: "Notification:",
            text: "Successfuly updated template!",
          });
        })
        .catch(function (error) {
          console.log(error);
          if (error.response) {
            console.log(error.response.data);
          }
          if (error.response && error.response.status == "403") {
            self.$notify({
              group: "msg",
              type: "error",
              title: "Notification:",
              text: "Access Denied",
            });
          } else {
            self.$notify({
              group: "msg",
              type: "error",
              title: "Notification:",
              text: "Error while updating template.",
            });
          }
        });
    },
  },
  components: {
    GenericPopupWarning,
    SpecificUserInfo,
    EditTemplatePopup,
  },
  destroyed() {
    if (window.intervals) {
      for (let i = 0; i < window.intervals.length; i++) {
        clearInterval(window.intervals[i]);
      }
    }
    clearInterval(this.interval);

    window.removeEventListener("resize", this.columnsEvent);
  },
};
</script>

<style scoped>
#providerSettings {
  max-width: 45rem;
  margin: 0 auto;
}
.collapsed > .when-opened,
:not(.collapsed) > .when-closed {
  display: none;
}
.disabledCursor:disabled {
  cursor: not-allowed;
  pointer-events: all !important;
}
.editAccount {
  cursor: pointer;
  font-weight: bold;
  font-size: 1.2rem;
  color: #1d1e22;
}
.cellAsALink {
  cursor: pointer;
  color: #1d1e22;
}

td {
  max-width: 17rem;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}

.removeAccountIcon {
  cursor: pointer;
  align-content: center;
  font-size: 1.5rem;
  padding-top: 0.2rem;
  color: #ea002f;
}
</style>