<template>
  <b-card
    :title="title"
    style="width: 18rem"
    class="mb-3 mr-3 text-center"
    :class="buttonEnabled ? 'baseBlock' : 'disabledOperation'"
  >
    <b-card-text
      ><i :class="favIcon" class="far largeIcon"></i><br /><br />
      {{ text }}<br />
      ID: {{ $parent.$parent.clusterID }}
    </b-card-text>

    <b-button
      v-if="buttonEnabled"
      v-on:click="
        $parent.$parent.startCluster(
          $parent.$parent.clusterID,
          $parent.$parent.clusterName
        )
      "
      class="btn btn-outline-success mx-4"
      >{{ title }}</b-button
    >
    <b-button v-else class="btn btn-outline-success mx-4 disabled">{{
      title
    }}</b-button>
  </b-card>
</template>

<script>
export default {
  name: 'ClusterOperationsCard',
  props: {
    title: String,
    text: String,
    buttonEnabled: Boolean,
    favIcon: String,
  },
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

.fa-user-plus {
  color: #000;
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
* {
  white-space: inherit;
}

.row {
  display: flex;
  width: 100%;
  align-items: stretch;
}
.sidebar {
  position: fixed;
  padding-left: 1rem;
  margin-left: 1rem;
  top: 5rem;
}
.largeIcon {
  font-size: 7rem;
}
.baseBlock {
  -moz-transition: all 0.3s cubic-bezier(0.165, 0.84, 0.44, 1);
  -o-transition: all 0.3s cubic-bezier(0.165, 0.84, 0.44, 1);
  transition: all 0.3s cubic-bezier(0.165, 0.84, 0.44, 1);
}

.baseBlock:hover {
  -webkit-transform: translate(0, 2px);
  -moz-transform: translate(0, 2px);
  -ms-transform: translate(0, 2px);
  -o-transform: translate(0, 2px);
  transform: translate(0, 2px);
  box-shadow: 0 10px 10px rgba(0, 0, 0, 0.2);
}
.disabledOperation {
  background-color: rgba(0, 0, 0, 0.015);
}
</style>
