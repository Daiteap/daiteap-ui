<template>
  <div class="col d-flex p-0 node-card">
    <div class="col-3 p-0 m-0">
      <div>
        <b>Region:</b>
        {{ region }}
      </div>
      <div v-if="Array.isArray(zone)">
        <b>Zone:</b>
        {{ zone[0] }}
      </div>
      <div v-else>
        <b>Zone:</b>
        {{ zone }}
      </div>
      <div v-if="vpcCidr">
        <b>vpcCidr:</b>
        {{ vpcCidr }}
      </div>
    </div>
    <div class="col-9 m-0">
      <div v-if="instanceTypeName">
        <b>Instance Type:</b>
        {{ instanceTypeName }}
      </div>
      <div v-else>
        <b>Instance Type:</b>
        {{ instanceType }}
      </div>
      <div v-if="operatingSystemName">
        <b>OS:</b>
        {{ operatingSystemName }}
      </div>
      <div v-else>
        <b>OS:</b>
        {{ operatingSystem }}
      </div>
      <div v-if="type">
        <b>Type:</b>
        {{ type }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CreateFromTemplateNode',
  props: {
    region: {
      type: String,
      required: true
    },
    zone: {
      type: [String, Array],
      required: true
    },
    vpcCidr: {
      type: String,
      required: false
    },
    instanceType: {
      type: String,
      required: true
    },
    instanceTypeName: {
      type: String,
      required: false
    },
    operatingSystem: {
      type: String,
      required: true
    },
    operatingSystemName: {
      type: String,
      required: false
    },
    type: {
      type: String,
      required: false
    }
  },
}
</script>

<style scoped>
.node-card {
  border: 1px solid #eee;
  padding: 10px;
  margin-bottom: 10px;
}
</style>