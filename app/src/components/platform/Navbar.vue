<template>
  <b-navbar
    :style="`transition: all 0.3s; margin-left: ${navbarLeftMargin}px;`"
    toggleable="sm"
    type="light"
    variant="light"
    :sticky="true"
    id="daiteap-top-navbar"
    style="background-image: linear-gradient(to right, #1d1e22, #45344f, #894065, #ca5159, #ed7d31);"
  >
    <b-navbar-toggle target="nav-collapse" class="ml-auto"></b-navbar-toggle>

    <div style="width: 400rem; margin-right: 1%">
      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav class="ml-auto">

          <div v-if="computed_account.name" style="color:#fff;height: 38px;line-height: 38px; padding-top: 3px;" class="mr-4 h5">Workspace: {{ computed_account.name }}</div>

          <b-nav-item-dropdown right>
            <template #button-content>
              <img
                v-if="computed_userInfo.image"
                class="rounded-circle"
                width="30"
                height="30"
                :src="computed_userInfo.image"
                :key="avatarKey"
              />
              <img
                v-else
                class="rounded-circle daiteap-avatar-img"
                width="30"
                height="30"
              />
            </template>

            <b-dropdown-item class="mx-1" to="/app/platform/profile">
              <router-link class="dropdown-item" to="/app/platform/profile">
                <img
                  class="rounded-circle mb-1 daiteap-avatar-img-dropdown"
                  width="20"
                  height="20"
                  alt=""
                />

                <span>
                  Profile {{ computed_userInfo.username }}
                </span>
              </router-link>
            </b-dropdown-item>

            <b-dropdown-item v-if="hasMultipleTenants()" class="mx-1"  to="/app/platform/changetenant">
              <router-link class="dropdown-item" to="/app/platform/changetenant">
                <i class="fas fa-fw fa-list"></i>
                <span> Show Workspace</span>
              </router-link>
            </b-dropdown-item>

            <b-dropdown-item class="mx-1"  to="/app/platform/resourcequotas">
              <router-link class="dropdown-item" to="/app/platform/resourcequotas">
                <i class="fas fa-fw fa-align-left"></i>
                <span> Resource Quotas</span>
              </router-link>
            </b-dropdown-item>

            <b-dropdown-item v-if="$store.state.canChangePassword" class="mx-1">
              <router-link
                class="dropdown-item"
                to="/app/platform/profile/changepassword"
              >
                <i class="fas fa-fw fa-key"></i>
                <span> Change Password</span>
              </router-link>
            </b-dropdown-item>

            <b-dropdown-item class="mx-1">
              <div class="dropdown-item" v-on:click="logout()">
                <i class="fas fa-fw fa-sign-out-alt"></i>
                <span> Logout</span>
              </div>
            </b-dropdown-item>
          </b-nav-item-dropdown>

          &nbsp;

          <div
            right
            style="cursor: pointer; display: table; margin-right: 100rm"
            @click="goToDocumentation"
          >
            <i
              class="fa fa-question-circle"
              style="
                font-size: 29px;
                color: white;
                display: table-cell;
                vertical-align: middle;
              "
            ></i>
          </div>
        </b-navbar-nav>
      </b-collapse>
    </div>
  </b-navbar>
</template>

<script>
export default {
  name: 'Navbar',
  data() {
    return {
      avatarKey: 0
    };
  },
  mounted() {
    setTimeout(() => {
      this.avatarKey += 1;
    }, 300);
  },
  props: {
    navbarLeftMargin: String,
  },
  methods: {
    logout() {
      this.endSession();
    },
    clusterDetailsIsActivePage() {
      var path = this.$route.path.split("/")[3];
      if (
        path == "clusterdetails" ||
        path == "submitvms" ||
        path == "submitkubernetescluster"
      ) {
        return true;
      }
      return false;
    },
    goToDocumentation() {
      window.open("/documentation/", "_blank");
    },
  },
};
</script>
