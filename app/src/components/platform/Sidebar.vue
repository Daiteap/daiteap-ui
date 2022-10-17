<template>
  <div
    :class="[
      { 'custom-sidebar': $route.path != '/app/platform/overview' },
      { collapsed: collapsed },
      { onmobile: isOnMobile },
    ]"
  >
    <div>
      <div class="m-1 m-xs-2 m-sm-3 m-md-4 m-lg-5">
        <div class="m-1" :class="[{'container-daiteap': $route.path != '/app/platform/overview'}]">
          <router-view @avatarChanged="$emit('avatarChanged')" />
        </div>
      </div>
      <sidebar-menu
        v-if="$route.path != '/app/platform/overview'"
        width="250px"
        :menu="baseMenuItems"
        :collapsed="collapsed"
        :show-one-child="true"
        @toggle-collapse="onToggleCollapse"
        id="custom-sidebar-menu"
      />
      <div
        v-if="isOnMobile && !collapsed"
        class="sidebar-overlay"
        @click="collapsed = true"
      />
    </div>
  </div>
</template>

<script>
import Separator from "@/components/platform/Separator";

export default {
  name: "Sidebar",
  computed: {
    baseMenuItems() {
      return [
        {
          href: "/app/platform/overview",
          title: "Home",
          icon: "fas fa-home",
          hidden: false,
        },
        {
          href: "/app/platform/ProjectList",
          title: "Projects",
          icon: "fas fa-project-diagram",
          hidden: false
        },
        {
          href: "/app/platform/KubernetesClusterList",
          title: "Kubernetes Clusters",
          icon: "fas fa-server",
          hidden: false
        },
        {
          href: "/app/platform/computeoverviewall",
          title: "Compute (VMs)",
          icon: "fas fa-laptop-code",
          hidden: !this.computed_account_settings.enable_compute
        },
        {
          href: "/app/platform/storageoverall",
          title: "Storage",
          icon: "fas fa-database",
          hidden: !this.computed_account_settings.enable_storage
        },
        {
          href: "/app/platform/ServiceCatalog",
          title: "Service Catalog",
          icon: "fas fa-shopping-basket",
          hidden: !this.computed_account_settings.enable_service_catalog
        },
        {
          href: "/app/platform/UsersList",
          title: "Users",
          icon: "far fa-user",
          hidden: !this.computed_isAdmin
        },
        {
          href: "/app/platform/CloudProfile",
          title: "Cloud Credentials",
          icon: "fas fa-key",
          hidden: false
        },
        {
          href: "/app/platform/templates",
          title: "Templates",
          icon: "fas fa-save",
          hidden: !this.computed_account_settings.enable_templates
        },
      ]
    }
  },
  data() {
    return {
      isAdmin: false,
      components: {
        Separator,
      },
      collapsed: false,
      themes: [
        {
          name: "Default theme",
          input: "",
        },
        {
          name: "White theme",
          input: "white-theme",
        },
      ],
      selectedTheme: "white-theme",
      isOnMobile: false,
    };
  },
  mounted() {
    this.$emit("collapsed", this.collapsed)
    this.onResize();
  },
  methods: {
    onToggleCollapse(collapsed) {
      this.collapsed = collapsed;
      this.$emit("collapsed", this.collapsed)
    },
    onResize() {
      if (window.innerWidth <= 767) {
        this.isOnMobile = true;
        this.collapsed = true;
        this.$emit("collapsed", this.collapsed)
      } else {
        this.isOnMobile = false;
        this.collapsed = false;
        this.$emit("collapsed", this.collapsed)
      }
    },
  },
};
</script>
