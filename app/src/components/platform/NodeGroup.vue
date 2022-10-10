<template>
  <div class="instance-group daiteap-custom-border field col-12 mb-4 p-4">
    <div v-if="deleteButton" class="" style="text-align: right">
      <div
        title="Delete"
        @click="$emit('removeNodeGroup')"
        class="far fa-trash-alt removeNodeGroupIcon"
      ></div>
    </div>
    <div v-else class="" style="text-align: right">
      <div
        style="visibility: hidden"
        class="far fa-trash-alt removeNodeGroupIcon"
      ></div>
    </div>

    <div v-if="disable_nodetype_selection">
      <div>
        <label for="nodeType"
          >Node Type: <strong>{{ item.nodeType }}</strong></label
        >
      </div>
      <br />
    </div>

    <div v-else-if="!!$finalModel.kubernetesConfiguration">
      <div>
        <label for="nodeType">Node Type</label>
      </div>
      <select
        v-model="item.nodeType"
        class="custom-select d-block w-100"
        @change="
          $emit('updatedNodesParams');
          item.nodes = 1;
        "
        :disabled="region == '' || item.disabled"
      >
        <option v-for="item in nodeTypes" :key="item" :value="item">
          {{ item }}
        </option>
      </select>
      <br />
    </div>

    <label for="nodes" v-if="!!$finalModel.kubernetesConfiguration"
      >Number of Nodes: {{ item.nodes }}</label
    >
    <label for="nodes" v-else>Number of VMs: {{ item.nodes }}</label>
    <div>
      <vue-slider
        id="nodes"
        v-model="item.nodes"
        @change="$emit('updatedNodesParams')"
        :min="1"
        :disabled="region == '' || item.disabled"
        :max="item.nodeType == 'Control plane' ? 15 : 10"
      />
    </div>
    <br />

    <div v-if="item.hasOwnProperty('zone')">
      <div>
        <label for="zone">Zone</label>
      </div>
      <select
        v-model="item.zone"
        v-on:change="$emit('changedZone', item)"
        class="custom-select d-block w-100"
        :disabled="region == '' || item.disabled"
        v-if="!loadingZones"
      >
        <option v-for="item in zones" :key="item.value" :value="item.value">
          {{ item.name }}
        </option>
      </select>
      <div v-else class="text-center">
        <div
          class="spinner-border text-primary"
          style="color: #eaebed !important"
          role="status"
        >
          <span class="sr-only">Loading...</span>
        </div>
      </div>
      <br />
    </div>

    <div>
      <label for="instanceType"
        >Instance Type
        <a
          href="/documentation/kubernetes_clusters/#cloud-ressource-configuration"
          target="_blank"
          rel="noopener noreferrer"
          title="Click to open documentation"
          class="fas fa-info-circle"
        ></a>
      </label>
    </div>
    <select
      v-model="item.instanceType"
      class="custom-select d-block w-100"
      @change="$emit('updatedNodesParams')"
      :disabled="region == '' || (item.hasOwnProperty('zone') && item.zone == '') || item.disabled"
      v-if="!item.loadingInstanceTypes"
    >
      <option
        v-for="item in item.instanceTypes"
        :key="item.value"
        :value="item.value"
      >
        {{ item.name }}
      </option>
    </select>
    <div v-else class="text-center">
      <div
        class="spinner-border text-primary"
        style="color: #eaebed !important"
        role="status"
      >
        <span class="sr-only">Loading...</span>
      </div>
    </div>

    <br />
    <div>
      <label for="operatingSystem">Operating System</label>
    </div>
    <select
      v-model="item.operatingSystem"
      class="custom-select d-block w-100"
      @change="$emit('updatedNodesParams')"
      :disabled="
        region == '' ||
        (item.hasOwnProperty('zone') && item.zone == '') ||
        item.instanceType == '' ||
        loadingOperatingSystems ||
        item.disabled
      "
    >
      <option
        v-for="item in operatingSystems"
        :key="item.value"
        :value="item.value"
      >
        {{ item.name }}
      </option>
    </select>
  </div>
</template>

<script>

export default {
  name: 'NodeGroup',
  props: {
    disable_nodetype_selection: {
      type: Boolean,
      default: false,
    },
    index: {
      type: Number,
      required: true,
    },
    item: {
      type: Object,
      required: true,
    },
    region: {
      type: String,
      required: true,
    },
    zones: {
      type: Array,
      required: false,
    },
    nodeTypes: {
      type: Array,
      required: true,
    },
    loadingZones: {
      type: Boolean,
      required: false,
    },
    operatingSystems: {
      type: Array,
      required: true,
    },
    loadingOperatingSystems: {
      type: Boolean,
      required: true,
    },
    deleteButton: {
      type: Boolean,
      default: true,
    },
  },
};
</script>

<style scoped>
.spinner-border {
  width: 2.15rem;
  height: 2.15rem;
}
.removeNodeGroupIcon {
  cursor: pointer;
  align-content: center;
  font-size: 1.5rem;
  padding-top: 0.2rem;
  color: #ea002f;
}
.instance-group {
  border: solid 1px rgb(29, 30, 34);
  border-radius: 0.6rem;
}
</style>