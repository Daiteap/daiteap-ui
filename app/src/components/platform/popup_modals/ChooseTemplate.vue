<template>
  <b-modal centered id="bv-modal-choosetemplate" hide-footer>
    <div v-on:click="closeModal()"></div>
    <div>
      <div>
        <h1 class="mt-3">Choose Template</h1>
        <div v-if="$parent.loadingTemplates" class="d-flex justify-content-center my-3">
          <div class="spinner-border" role="status"></div>
          <h5 class="ml-3 mt-2">Loading templates</h5>
        </div>
        <div
          v-else-if="$parent.templatesList.length > 0"
          class="table-responsive scroll"
        >
          <hr />
          <table
            class="table table-bordered"
            id="dataTable"
            width="100%"
            cellspacing="0"
          >
            <thead>
              <tr>
                <th>Name</th>
                <th>Type</th>
                <th>Provider</th>
                <th>Created at</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="item in $parent.templatesList"
                :key="item.ID"
                style="cursor:pointer"
                @click="
                  openModalCreateEnvironmentFromTemplate(item.name, item.id)
                "
              >
                <td>
                  {{ item.name }}
                </td>
                <td>
                  <div v-if="item.Type == 1">DLCM</div>
                  <div v-else-if="item.Type == 2">DMCV</div>
                  <div v-else-if="item.Type == 3">DK3S</div>
                  <div v-else-if="item.Type  == 5">CAPI</div>
                  <div v-else>---</div>
                </td>
                <td>
                  <img
                    v-if="item.providers.includes('Alibaba')"
                    title="Alibaba Cloud"
                    style="height: 20px; margin-right: 5px"
                    src="../../../assets/img/alicloud_logo_small.png"
                  />
                  <img
                    v-if="item.providers.includes('Azure')"
                    title="Azure"
                    style="height: 20px; margin-right: 5px"
                    src="../../../assets/img/azure_logo_small.png"
                  />
                  <img
                    v-if="item.providers.includes('Amazon')"
                    title="AWS"
                    style="height: 20px; margin-right: 5px"
                    src="../../../assets/img/aws_logo_small.png"
                  />
                  <img
                    v-if="item.providers.includes('Google')"
                    title="Google Cloud"
                    style="height: 20px; margin-right: 5px"
                    src="../../../assets/img/googleCloud_logo_small.png"
                  />
                  <img
                    v-if="item.providers.includes('Onpremise')"
                    title="Onpremise"
                    style="height: 20px; margin-right: 5px"
                    src="../../../assets/img/onpremise.svg"
                  />
                  <img
                    v-if="item.providers.includes('IotArm')"
                    title="IoT-ARM"
                    style="height: 20px; margin-right: 5px"
                    src="../../../assets/img/IoTArm_logo_small.svg"
                  />
                </td>
                <td>{{ item.created_at }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div v-else>
          <h4>
            Saved environment templates will be shown here
          </h4>
        </div>
      </div>
      <div>
        <button class="btn btn-outline-success col-3 m-3" @click="closeModal()">
          Cancel
        </button>
      </div>
    </div>
    
  </b-modal>
</template>

<script>
export default {
  name: 'ChooseTemplate',
  data() {
    return {};
  },
  methods: {
    closeModal() {
      this.$bvModal.hide("bv-modal-choosetemplate");
      this.$parent.showChooseTemplate = false;
      this.$bvModal.hide("bv-modal-choosetemplate");
    },
    openModalCreateEnvironmentFromTemplate(template, environmentTemplateId) {
      this.$parent.$refs.newEnvfromTemplate.initiateCreateEnvFromTemplate(
        template,
        this.$parent.environmentNamesList,
        environmentTemplateId
      );
      this.closeModal();
      this.$parent.showCreateEnvironmentFromTemplate = true;
      this.$bvModal.show("bv-modal-createenvironmentfromtemplate");
    },
  },
};
</script>


<style scoped>
.modal-content {
  width: 60%;
}

.form-group {
  margin: auto;
}

.btn-primary {
  width: 100%;
}

.scroll {
  max-height: 620px;
  overflow-y: auto;
}
</style>