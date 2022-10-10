<template>
<div>
  <b-alert show :variant="color" style="color: black; white-space: pre-wrap" :dismissible="closeOption" >
    {{ msg }}
    <slot></slot>
    <a v-if="link != ''" style="color:blue" @click="goToDocumentation()">Guide</a>
  </b-alert>
</div>
</template>

<script>
export default {
  name: 'WarningAlert',
  props: {
    msg: String,
    color: String,
    /* 
     "info" = blue
     "warning" = yellow
     "success" = green
     "danger" = red
    */ 
    closeOption: {
      default: true,
      type: Boolean
    },
    link: {
      default: "",
      type: String
    },
  },
  methods: {
    goToDocumentation() {
      window.open(
        this.link,
        "_blank"
      );
    },
  },
}
</script>

<style scope>
a {
  color: #4e73df;
  text-decoration: none;
  cursor: pointer;
}
</style>