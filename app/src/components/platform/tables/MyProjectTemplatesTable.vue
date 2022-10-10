<template>
  <table
    class="table table-bordered"
    id="dataTable"
    width="100%"
    cellspacing="0"
  >
    <thead>
      <tr>
        <th>Name</th>
        <th>Description</th>
        <th>Type</th>
        <th>Provider</th>
        <th>Created at</th>
        <th>Created by</th>
        <th>Delete</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="item in templatesList" :key="item.ID">
        <td
          @click="
            $parent.openModalCreateEnvironmentFromTemplate(item.name, item.id)
          "
          style="cursor: pointer"
          class="clickForDetails template"
        >
          {{ item.name }}
        </td>
        <td>
          {{ item.Description }}
        </td>
        <td>
          <div v-if="item.type == 1">DLCM</div>
          <div v-else-if="item.type == 2">DMCV</div>
          <div v-else-if="item.type == 3">DK3S</div>
          <div v-else-if="item.type  == 5">CAPI</div>
          <div v-else>---</div>
        </td>
        <td>
          <img
            v-if="item.providers.includes('Alibaba')"
            title="Alibaba Cloud"
            margin-top="auto"
            margin-bottom="auto"
            class="pr-2"
            height="20pix"
            width="auto"
            src="../../../assets/img/alicloud_logo_small.png"
          />
          <img
            v-if="item.providers.includes('Azure')"
            title="Azure"
            margin-top="auto"
            margin-bottom="auto"
            class="pr-2"
            height="20pix"
            width="auto"
            src="../../../assets/img/azure_logo_small.png"
          />
          <img
            v-if="item.providers.includes('Amazon')"
            title="AWS"
            margin-top="auto"
            margin-bottom="auto"
            class="pr-2"
            height="20pix"
            width="auto"
            src="../../../assets/img/aws_logo_small.png"
          />
          <img
            v-if="item.providers.includes('Openstack') && computed_theme == 'daiteap'"
            title="OpenStack"
            margin-top="auto"
            margin-bottom="auto"
            class="pr-2"
            height="20pix"
            width="auto"
            src="../../../assets/img/openstack_logo_small.png"
          />
          <img
            v-if="item.providers.includes('Google')"
            title="Google Cloud"
            margin-top="auto"
            margin-bottom="auto"
            class="pr-2"
            height="20pix"
            width="auto"
            src="../../../assets/img/googleCloud_logo_small.png"
          />
          <img
            v-if="item.providers.includes('Onpremise')"
            title="Onpremise"
            margin-top="auto"
            margin-bottom="auto"
            class="pr-2"
            height="20pix"
            width="auto"
            src="../../../assets/img/onpremise.svg"
          />
          <img
            v-if="item.providers.includes('IotArm')"
            title="IoT-ARM"
            margin-top="auto"
            margin-bottom="auto"
            class="pr-2"
            height="20pix"
            width="auto"
            src="../../../assets/img/IoTArm_logo_small.svg"
          />
        </td>
        <td>{{ item.created_at }}</td>
        <td>
          {{ item.Contact }}
        </td>
        <td
          v-if="$parent.templatesInDeletion.includes(item.id)"
          width="120px"
          class="text-danger"
          :title="'Deleting template ' + item.name"
        >
          <b-spinner
            style="width: 1rem; height: 1rem"
            variant="danger"
          ></b-spinner>
          Deleting
        </td>
        <td
          v-else
          width="120px"
          @click="$parent.goToRemoveTemplate(item)"
          class="removeAccountIcon"
          :title="'Delete template ' + item.name"
        >
          <div class="pl-2">
            <div class="far fa-trash-alt"></div>
          </div>
        </td>
      </tr>
    </tbody>
  </table>
</template>


<script>
export default {
  name: 'MyProjectTemplatesTable',
  props: {
    templatesList: Array,
  },
  data() {
    return {};
  },
  created() {
    this.loadingTable = true;
  },
  methods: {},
};
</script>

<style scoped>
a:not([href]):not([tabindex]) {
  color: #4e73df;
  text-decoration: none;
  cursor: pointer;
}

a:not([href]):not([tabindex]):hover {
  color: #224abe;
  text-decoration: underline;
  cursor: pointer;
}

.fa-plus {
  color: white;
}

.fa-server {
  color: #000;
}

.card-header {
  display: block;
}

.card-header > h6 {
  display: inline-block;
}

input {
  width: 20rem !important;
}
.cardHeaderLight {
  background-color: #fff;
  color: #1d1e22;
  border-bottom: #1d1e22 2px solid;
  border: #d1d1d1 1px solid;
}
.card-body {
  border: #00708c10 1px solid;
}
::v-deep .dropDownMenuButton .btn-secondary {
  color: #1d1e22 !important;
  font-weight: bold;
  background-color: #fff !important;
  border: none;
  box-shadow: none;
  outline: none;
}
::v-deep .dropDownMenuButton .btn-secondary:hover {
  color: #034758 !important;
  background-color: #fff !important;
  border: none;
}
::v-deep .dropDownMenuButton .btn-secondary:focus {
  color: #1d1e22 !important;
  background-color: #fff !important;
  border: none;
  box-shadow: none;
}
::v-deep .dropDownMenuButton .btn-secondary.focus {
  color: #1d1e22 !important;
  background-color: #fff !important;
  border: none;
  box-shadow: none;
}
::v-deep .dropDownMenuButton #createDropdown:active {
  border: none;
  box-shadow: none;
}
::v-deep
  .dropDownMenuButton
  .btn-secondary:not(:disabled):not(.disabled):active:focus,
.btn-secondary:not(:disabled):not(.disabled).active:focus,
.show > .btn-secondary.dropdown-toggle:focus {
  box-shadow: none;
}
::v-deep .dropDownMenuButton .dropdown-menu {
  background-color: #fff;
  background-clip: padding-box;
  border: 2px solid #5f737950;
  border-radius: 0.35rem;
}
kbd {
  background-color: #1d1e22;
  cursor: pointer;
}
kbd:hover {
  background-color: #00708caf;
}
.removeAccountIcon {
  cursor: pointer;
  align-content: center;
  font-size: 1.5rem;
  padding-top: 0.2rem;
  color: #ea002f;
}
.clickForDetails.stillCreating {
  color: #000;
}
.clickForDetails.template {
  color: #1d1e22;
}
.providerLogoDiv {
  height: 100%;
  width: 100%;
}
.providerLogo {
  object-fit: cover;
  position: relative;
  top: 50%;
  -webkit-transform: translateY(-50%);
  -ms-transform: translateY(-50%);
  transform: translateY(-50%);
  display: block;
  margin-left: auto;
  margin-right: auto;
  width: 50%;
}
.baseBlock {
  width: 22rem;
  height: 8rem;
  box-shadow: 0 2px 2px rgba(0, 0, 0, 0.2);
  -moz-transition: all 0.3s cubic-bezier(0.165, 0.84, 0.44, 1);
  -o-transition: all 0.3s cubic-bezier(0.165, 0.84, 0.44, 1);
  transition: all 0.3s cubic-bezier(0.165, 0.84, 0.44, 1);
}

.baseBlock:hover {
  cursor: pointer;
  -webkit-transform: translate(0, -4px);
  -moz-transform: translate(0, -4px);
  -ms-transform: translate(0, -4px);
  -o-transform: translate(0, -4px);
  transform: translate(0, -4px);
  box-shadow: 0 10px 10px rgba(0, 0, 0, 0.2);
}
.baseBlock.dmcv:hover {
  box-shadow: 0 10px 10px#bcbcbc;
}
.baseBlock.dke:hover {
  box-shadow: 0 10px 10px#bcbcbc;
}
.baseBlock.k3s:hover {
  box-shadow: 0 10px 10px#bcbcbc;
}
</style>