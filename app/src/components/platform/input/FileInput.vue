<template>

</template>

<script>
import Label from "@/components/platform/input/Label";
export default {
  name: 'FileInput',
  components: {
    Label,
  },
  props: {
    inputLabel: String,
    inputId: String,
    inputType: String,
    inputplaceholder: String,
    validation: Object,
    errorMsg: String,
    value: String,
    disabled: Boolean,
  },
};
</script>