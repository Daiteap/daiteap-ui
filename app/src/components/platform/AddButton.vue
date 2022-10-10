<template>
  <div>
    {{ text }}
    <a><img id="addButtonImg" src="../../assets/img/add_button.png" width="50px" height="50px" 
        @mouseover="hoverOn"
        @mouseleave="hoverOut"
        @click="$emit('onClickAddButton')"
        ref="image"
    /></a>
  </div>
</template>

$router.push('addnewproject');
<script>
export default {
  name: 'AddButton',
  props: {
    text: String,
    link: String,
    disabled: Boolean,
  },
  data() {
      return {
        hovered: null,
        srcNormal: require("../../assets/img/add_button.png"),
        srcHovered: require("../../assets/img/add_button_inverted.png"),
      }
  },
  methods: {
      hoverOn() {
        this.$refs.image.src = this.srcHovered;
      },
      hoverOut() {
        this.$refs.image.src = this.srcNormal;
      },
  }
}

</script>