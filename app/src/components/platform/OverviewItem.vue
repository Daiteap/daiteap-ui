<template>
    <div @click="$router.push('ProjectList')" class="col overview-btn m-1">
      <div class="row">
        <div class="col-sm-2">
          <span class="fa-stack fa-lg">
            <i class="fas fa-circle fa-stack-2x"></i>
            <i :class="faIcon" class="fas fa-stack-1x fa-inverse"></i>
          </span>
        </div>
        <div class="col-sm-9">
          <span class="projects-text overview-btn-text">{{ title }}</span>
        </div>
        <div class="col-sm-1">
          <span
            class="float-sm-right overview-btn-text"
          >
            {{ count }}
          </span>
        </div>
      </div>
    </div>
</template>

<script>

export default {
  name: 'OverviewItem',
  props: {
    title: String,
    count: Number,
    faIcon: String,
  },
};
</script>

<style scoped>
.overview-btn-text {
  font-size: 1.7rem;
}
.overview-btn {
  cursor: pointer;
  border-radius: 10px;
  background-color: #fff;
}
</style>