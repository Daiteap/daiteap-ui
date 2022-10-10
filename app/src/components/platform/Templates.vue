<template>
  <div>
    <div class="card daiteap-content-card">
      <div class="d-flex justify-content-between cardHeaderLight">
        <span class="fa-stack landing-page-icon">
          <i class="fas fa-square fa-stack-2x" style="line-height: 1.5;"></i>
          <i class="fas fa-save fas fa-stack-1x fa-inverse" style="line-height: 3;"></i>
        </span>
        <CardTitle title="Templates" style="line-height: 2;" />
        <span class="text-right h4 ml-auto"/>
      </div>
      <hr />

      <TemplatesTable />

      <br />
    </div>
  </div>
</template>

<script scoped>
import CardTitle from "@/components/platform/CardTitle";
import TemplatesTable from "@/components/platform/tables/TemplatesTable";

export default {
  name: 'Templates',
  data() {
    return {};
  },
  components: {
    CardTitle,
    TemplatesTable,
  },
};
</script>

<style scoped>

</style>