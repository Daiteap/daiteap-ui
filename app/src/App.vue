<template>
  <div id="app">
    <router-view></router-view>
    <link href="https://fonts.googleapis.com/css?family=Roboto:100,300,400,500,700,900" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/@mdi/font@6.x/css/materialdesignicons.min.css" rel="stylesheet">
  </div>
</template>

<script>
import(/* webpackMode: "eager" */'./assets/css/apptheme_' + process.env.VUE_APP_THEME + '.css');
import Vue from "vue";
import helpers from "@/services/helpers.js";

export default {
  name: "App",
  components: {},
  data() {
    return {
      updatingToken: false,
      usingToken: 0,
    };
  },
  created() {
    if (!this.computed_single_user_mode){
      this.registerUser();
    } else {
      this.getActiveTenants();
      this.getUserInfo();
    }
  },
  mounted() {
    let self = this;

    this.interval = setInterval(() => {
      self.updatingToken = true;
      while (self.usingToken > 0) {
        self.sleep(50);
      }
    }, 5000);

    window.intervals = [];
    window.intervals.push(this.interval);
  },
  methods: {},
};

Vue.mixin({
  methods: {
    sleep(ms) {
      return new Promise((resolve) => setTimeout(resolve, ms));
    },
    resetState() {
      this.$store.commit("updateUserInfo", {
        profile: {
          role: "",
        },
        image: null,
        username: null,
        id: null,
      });
    },
    boolToOnOff(bv) {
      if (bv) {
        return "On";
      } else {
        return "Off";
      }
    },
    get_axiosConfig() {
      let authorization = "";
      if (!this.computed_single_user_mode){
        authorization = "JWT " + Vue.$keycloak.token;
      }

      return {
        headers: {
          "Content-Type": "application/json;charset=UTF-8",
          "Authorization": authorization,
          "User-ID": this.computed_userInfo.id,
        },
      };
    },
    handleRequestError(error, message) {
      this.usingToken -= 1;
      console.log(error);
      if (error.response) {
        console.log(error.response.data);
      }
      this.$notify({
        group: "msg",
        type: "error",
        title: "Notification:",
        text: message,
      });
    },
    deleteClusterMain(cluster) {
      let requestBody = { clusterID: cluster.ID };
      let endpoint;
      if (cluster.Type == 5) {
        endpoint = "/server/deleteCapiCluster";
      } else if (cluster.Type == 8) {
        endpoint = "/server/deleteYaookCluster";
      } else {
        endpoint = "/server/deleteCluster";
      }

      let self = this;
      return this.axios
        .post(endpoint, requestBody, this.get_axiosConfig())
        .then(function () {
          self.$notify({
            group: "msg",
            type: "success",
            title: "Notification:",
            text:
              'You have successfully submitted deletion for "' +
              cluster.Name +
              '".',
          });

          self.showAlert = true;
          self.alertKey += 1;
        })
        .catch(function (error) {
          console.log(error);
          if (error.response) {
            error = error.response.data.error.message;
          }
          self.$notify({
            group: "msg",
            type: "error",
            title: "Notification:",
            text:
              'Error occured while you tried to submit deletion of "' +
              cluster.Name +
              '".',
          });
        });
    },
    getUsers() {
      let self = this;
      return new Promise((resolve) => {
        while (self.updatingToken) {
          self.sleep(200);
        }
        self.usingToken += 1;
        this.axios
          .get("/server/getuserslist", this.get_axiosConfig())
          .then(function (response) {
            self.usingToken -= 1;
            self.$store.commit("updateUsers", response.data.users_list);
            resolve(response.data.users_list);
          })
          .catch(function (error) {
            self.handleRequestError(error, "Error while getting users.");
          });
      })
    },
    getProjects() {
      let self = this;
      return new Promise((resolve) => {
        while (self.updatingToken) {
          self.sleep(200);
        }
        self.usingToken += 1;
        this.axios
          .get("/server/projects", this.get_axiosConfig())
          .then(function (response) {
            self.usingToken -= 1;
            self.$store.commit("updateProjects", response.data);
            resolve(response.data);
          })
          .catch(function (error) {
            self.handleRequestError(error, "Error while getting projects.");
          });
      });
    },
    getCredentials() {
      let self = this;
      return new Promise((resolve) => {
        while (self.updatingToken) {
          self.sleep(200);
        }
        self.usingToken += 1;
        this.axios
          .get("/server/cloud-credentials", this.get_axiosConfig())
          .then(function (response) {
            self.usingToken -= 1;
            self.$store.commit("updateCredentials", response.data);
            resolve(response.data);
          })
          .catch(function (error) {
            self.handleRequestError(error, "Error while getting cloud credentials.");
          });
      });
    },
    getCredentialDetails(credentialId) {
      let self = this;
      return new Promise((resolve) => {
        while (self.updatingToken) {
          self.sleep(200);
        }
        self.usingToken += 1;
        this.axios
          .get("/server/cloud-credentials/" + credentialId, this.get_axiosConfig())
          .then(function (response) {
            self.usingToken -= 1;
            resolve(response.data);
          })
          .catch(function (error) {
            self.handleRequestError(error, "Error while getting cloud credential details.");
          });
      });
    },
    getAllClusters() {
      let self = this;
      return new Promise((resolve) => {
        while (self.updatingToken) {
          self.sleep(200);
        }
        self.usingToken += 1;
        this.axios
          .post("/server/getClusterList", {}, this.get_axiosConfig())
          .then(function (response) {
            self.usingToken -= 1;
            resolve(response.data);
          })
          .catch(function (error) {
            self.handleRequestError(error, "Error while getting clusters.");
          });
      });
    },
    getClusterDetailsMain(clusterID) {
      let self = this;
      return new Promise((resolve) => {
        while (self.updatingToken) {
          self.sleep(200);
        }
        self.usingToken += 1;
        this.axios
          .get(
            "/server/tenants/" +
              this.computed_active_tenant_id +
              "/clusters/" +
              clusterID +
              "/details",
            this.get_axiosConfig()
          )
          .then(function (response) {
            self.usingToken -= 1;
            resolve(response.data);
          })
          .catch(function (error) {
            self.handleRequestError(error, "Error while getting cluster details.");
          });
      });
    },
    getTemplates() {
      let self = this;
      return new Promise((resolve) => {
        while (self.updatingToken) {
          self.sleep(200);
        }
        self.usingToken += 1;
        this.axios
          .get("/server/environmenttemplates/list", this.get_axiosConfig())
          .then(function (response) {
            self.usingToken -= 1;
            resolve(response.data.environmentTemplates);
          })
          .catch(function (error) {
            self.handleRequestError(error, "Error while getting templates.");
          });
      });
    },
    getBuckets() {
      let self = this;
      return new Promise((resolve) => {
        while (self.updatingToken) {
          self.sleep(200);
        }
        self.usingToken += 1;
        this.axios
          .get(
            "/server/tenants/" + this.computed_active_tenant_id + "/buckets",
            this.get_axiosConfig()
          )
          .then(function (response) {
            self.usingToken -= 1;
            self.$store.commit("updateBuckets", response.data);
            resolve(response.data);
          })
          .catch(function (error) {
            self.handleRequestError(error, "Error while getting storage information.");
          });
      })
    },
    getBucketDetails(bucketID) {
      let self = this;
      return new Promise((resolve) => {
        while (self.updatingToken) {
          self.sleep(200);
        }
        self.usingToken += 1;
        this.axios
          .get(
            "/server/tenants/" +
              this.computed_active_tenant_id +
              "/buckets/" +
              bucketID,
            this.get_axiosConfig()
          )
          .then(function (response) {
            self.usingToken -= 1;
            resolve(response.data.bucket_details[0]);
          })
          .catch(function (error) {
            self.handleRequestError(error, "Error while getting storage information.");
          });
      })
    },
    getAccountSettings() {
      let self = this;
      while (self.updatingToken) {
        self.sleep(200);
      }
      this.usingToken += 1;
      this.axios
        .get("/server/account/get/settings", this.get_axiosConfig())
        .then(function (response) {
          self.usingToken -= 1;
          if (response.status == 200) {
            self.$store.commit(
              "updateAccountSettings",
              response.data.account_settings
            );
            self.$store.commit("updateAccount", response.data.account);
            self.$root.$emit("accountSettingsChanged", undefined);
          }
        })
        .catch(function (error) {
          self.handleRequestError(error, "Error while getting workspace settings!");
        });
    },
    removeComputeNode(nodeID) {
      let self = this;
      return this.axios
        .post(
          "/server/removeComputeNode",
          {
            nodeID: nodeID,
          },
          this.get_axiosConfig()
        )
        .then(function () {
          self.$notify({
            group: "msg",
            type: "success",
            title: "Notification:",
            text: "Node deletion submitted successfully",
          });
          self.getClustersList();
        })
        .catch(function () {
          self.$notify({
            group: "msg",
            type: "error",
            title: "Notification:",
            text: "Error while removing node.",
          });
        });
    },
    getProfilePicture() {
      let self = this;
      while (self.updatingToken) {
        self.sleep(200);
      }
      this.usingToken += 1;
      this.axios
        .get("/server/profilepicture", this.get_axiosConfig())
        .then(function (response) {
          self.usingToken -= 1;
          self.$store.commit(
            "updateUserProfileImageLocation",
            response.data.location
          );
        })
        .catch(function (error) {
          self.handleRequestError(error, "Error while getting user image!");
        });
    },
    getUserQuota() {
      let self = this
      while (self.updatingToken) {
        self.sleep(200);
      }
      this.usingToken += 1;
      return this.axios
        .get("/server/getusage", this.get_axiosConfig())
        .then(function (response) {
          self.usingToken -= 1;
          let quota = response.data;

          quota["available_kubernetes_cluster_environments"] =
            quota["limit_kubernetes_cluster_environments"] - quota["used_kubernetes_cluster_environments"];
          quota["available_vms_environments"] =
            quota["limit_compute_vms_environments"] - quota["used_compute_vms_environments"];
          quota["available_nodes"] =
            quota["limit_nodes"] - quota["used_nodes"];
          quota["available_services"] =
            quota["limit_services"] - quota["used_services"];

          return quota;
        })
        .catch(function (error) {
          self.handleRequestError(error, "Error while getting quotas.");
        });
    },
    getUserInfo() {
      let self = this;
      while (self.updatingToken) {
        self.sleep(200);
      }
      let profile = {}
      let user = {}
      this.usingToken += 1;
      this.axios
        .get("/server/profile", this.get_axiosConfig())
        .then(function (response) {
          profile = response.data;

          self.axios.get("/server/user", self.get_axiosConfig())
            .then(function (response) {
              user = {}
              user.profile = profile;

              user.username = response.data.username;
              user.id = response.data.id;

              user.profile.first_name = response.data.first_name;
              user.profile.last_name = response.data.last_name;
              user.profile.email = response.data.email;

              user.profile = Object.assign(user.profile, response.data);

              self.usingToken -= 1;
              self.$store.commit("updateUserInfo", user);
              self.getAccountSettings();
            })
            .catch(function (error) {
              self.usingToken -= 1;
              console.log(error);
              self.$notify({
                group: "msg",
                type: "error",
                title: "Notification:",
                text: "Error while getting user information!",
              });
            });
        })
        .catch(function (error) {
          self.handleRequestError(error, "Error while getting user information!");
        });
    },
    checkCanChangePassword() {
      let self = this;
      while (self.updatingToken) {
        self.sleep(200);
      }
      this.usingToken += 1;
      this.axios
        .get("/server/canUpdateUserPassword", this.get_axiosConfig())
        .then(function (response) {
          self.usingToken -= 1;
          self.$store.commit("canChangePassword", response.data.canUpdateUserPassword);
        })
        .catch(function (error) {
          self.handleRequestError(error, "Error while checking if change password is permitted!");
        });
    },
    getActiveTenants() {
      let self = this;
      while (self.updatingToken) {
        self.sleep(200);
      }
      this.usingToken += 1;
      this.axios
        .get("/server/getActiveTenants", this.get_axiosConfig())
        .then(function (response) {
          self.usingToken -= 1;
          if (response.data.activeTenants.length < 2) {
            self.hasMultipleTenants = false;
          } else {
            self.hasMultipleTenants = true;
          }
          self.$store.commit("updateActiveTenant", response.data.selectedTenant);
        })
        .catch(function (error) {
          self.handleRequestError(error, "Error while getting active tenants!");
        });
    },
    getSpecificUserInfo(tenantId, username) {
      let self = this;
      while (self.updatingToken) {
        self.sleep(200);
      }
      this.usingToken += 1;
      return this.axios
        .get("/server/getSpecificUserInfo/" + tenantId + "/" + username, this.get_axiosConfig())
        .then(function (response) {
          self.usingToken -= 1;
          return response.data;
        })
        .catch(function (error) {
          self.handleRequestError(error, "Error while getting specific user info!");
        });
    },
    hasMultipleTenants() {
      return this.hasMultipleTenants;
    },
    registerUser() {
      let self = this;
      while (self.updatingToken) {
        self.sleep(200);
      }
      this.usingToken += 1;
      this.axios
        .get("/server/isRegistered", this.get_axiosConfig())
        .then(function (response) {
          self.usingToken -= 1;
          if (!response.data.isRegistered) {
                  self.axios
                    .post("/server/registerTenantUser", {}, self.get_axiosConfig())
                    .then(function () {
                      self.getUserInfo();
                      self.checkCanChangePassword();
                      self.getProfilePicture();
                      self.getActiveTenants();
                      window.location.href = '#/app/platform/overview';
                    })
                    .catch(function (error) {
                      console.log(error);
                      self.$notify({
                        group: "msg",
                        type: "error",
                        title: "Notification:",
                        text: "Error while registering user!",
                      });
              })
              .catch(function (error) {
                self.registrationOpen = false;
                console.info(error);
              });
          } else {
            self.getUserInfo();
            self.checkCanChangePassword();
            self.getProfilePicture();
            self.getActiveTenants();
          }
        })
        .catch(function (error) {
          self.handleRequestError(error, "Error while getting user information!");
        });
    },
    endSession() {
      if (window.intervals) {
        for (let i = 0; i < window.intervals.length; i++) {
          clearInterval(window.intervals[i]);
        }
      }
      let self = this;
      if (Vue.$keycloak.authenticated) {
        Vue.$keycloak.logout()
      }
      self.resetState();

      self.$session.destroy(self.$router.push("/app/login"));
    },
    deleteUserProfilePicture() {
      let self = this;
      while (self.updatingToken) {
        self.sleep(200);
      }
      this.usingToken += 1;
      this.axios
        .delete(
          "/server/profilepicture",
          this.get_axiosConfig()
        )
        .then(function () {
          self.usingToken -= 1;
          self.getProfilePicture();
        })
        .catch(function (error) {
          self.handleRequestError(error, "Error while deleting the user image.");
        });
    },
    updateUserProfilePicture(request) {
      let self = this;
      return new Promise((resolve) => {
        while (self.updatingToken) {
          self.sleep(200);
        }
        self.usingToken += 1;
        this.axios
          .put(
            "/server/profilepicture",
            request,
            this.get_axiosConfig()
          )
          .then(function () {
            self.usingToken -= 1;
            self.getProfilePicture();
            resolve(true);
          })
          .catch(function (error) {
            self.handleRequestError(error, "Error while saving the user image.");
          });
      });
    },
    updateUserInfo(profile, user) {
      let self = this;
      while (self.updatingToken) {
        self.sleep(200);
      }
      this.usingToken += 1;
      this.axios
        .put("/server/profile", profile, this.get_axiosConfig())
        .then(function () {

          self.axios
            .put("/server/user", user, self.get_axiosConfig())
            .then(function () {
              self.$notify({
                group: "msg",
                type: "success",
                title: "Notification:",
                text: "Successfuly updated user information!",
              });
              self.getUserInfo();
            })
            .catch(function (error) {
              console.log(error);
              if (error.response) {
                console.log(error.response.data);
              }
              self.usingToken -= 1;
              self.$notify({
                group: "msg",
                type: "error",
                title: "Notification:",
                text: "Error while saving the user information",
              });
            });
        })
        .catch(function (error) {
          self.handleRequestError(error, "Error while saving the user information.");
        });
    },
    editUserInfo(request) {
      let endpoint;
      if (this.computed_isBusinessAccountOwner) {
        endpoint = "/server/businessaccountowner/updateUser";
      } else {
        endpoint = "/server/updateUser";
      }

      let self = this;
      while (self.updatingToken) {
        self.sleep(200);
      }
      this.usingToken += 1;
      this.axios
        .post(
          endpoint,
          request,
          this.get_axiosConfig()
        )
        .then(function () {
          self.usingToken -= 1;
          self.$notify({
            group: "msg",
            type: "success",
            title: "Notification:",
            text: "Successfuly updated user!",
          });

          self.getUserInfo();
        })
        .catch(function (error) {
          self.handleRequestError(error, "Error while updating user.");
        });
    },
    emailUnsubscribe() {
      let self = this;
      while (self.updatingToken) {
        self.sleep(200);
      }
      this.usingToken += 1;
      this.axios
        .put("/server/profile", { news_subscribbed: false }, this.get_axiosConfig())
        .then(function () {
          self.usingToken -= 1;
          self.$notify({
            group: "msg",
            type: "success",
            title: "Notification:",
            text: "Unsubscribe Successful!",
          });
        })
        .catch(function (error) {
          self.handleRequestError(error, "Error while unsubscribing.");
        });
    },
    emailSubscribe() {
      let self = this;
      while (self.updatingToken) {
        self.sleep(200);
      }
      this.usingToken += 1;
      this.axios
        .put("/server/profile", { news_subscribbed: true }, this.get_axiosConfig())
        .then(function () {
          self.usingToken -= 1;
          self.$notify({
            group: "msg",
            type: "success",
            title: "Notification:",
            text: "Successfuly subscribed!",
          });
        })
        .catch(function (error) {
          self.handleRequestError(error, "Error while subscribing.");
        });
    },
  },
  computed: {
    computed_account_settings() {
      if (!this.$store) {
        return null;
      }
      return this.$store.state.account_settings;
    },
    computed_active_tenant_id() {
      if (!this.$store) {
        return null;
      }
      return this.$store.state.activeTenantId;
    },
    computed_account() {
      if (!this.$store) {
        return null;
      }
      return this.$store.state.account;
    },
    computed_userInfo() {
      if (!this.$store) {
        return null;
      }
      return this.$store.state.userInfo;
    },
    computed_isAdmin() {
      if (!this.$store) {
        return false;
      }
      return (
        this.$store.state.userInfo.profile.role == helpers.USER_ROLES.ADMIN
      );
    },
    computed_isRegularUser() {
      if (!this.$store) {
        return false;
      }
      return (
        this.$store.state.userInfo.profile.role ==
        helpers.USER_ROLES.REGULAR_USER
      );
    },
    computed_isAccountOwner() {
      if (!this.$store) {
        return false;
      }
      return (
        this.$store.state.userInfo.profile.role ==
        helpers.USER_ROLES.ACCOUNT_OWNER
      );
    },
    computed_tenants() {
      if (!this.$store) {
        return null;
      }
      return this.$store.state.tenants;
    },
    computed_users() {
      if (!this.$store) {
        return null;
      }
      return this.$store.state.users;
    },
    computed_credentials() {
      if (!this.$store) {
        return null;
      }
      return this.$store.state.credentials;
    },
    computed_projects() {
      if (!this.$store) {
        return null;
      }
      return this.$store.state.projects;
    },
    computed_buckets() {
      if (!this.$store) {
        return null;
      }
      return this.$store.state.buckets;
    },
    computed_create_cluster_settings() {
      if (!this.$store) {
        return null;
      }
      return this.$store.state.create_cluster_settings;
    },
    computed_aws_bucket_locations() {
      if (!this.$store) {
        return null;
      }
      return this.$store.state.aws_bucket_locations;
    },
    computed_google_bucket_locations() {
      if (!this.$store) {
        return null;
      }
      return this.$store.state.google_bucket_locations;
    },
    computed_theme() {
      return process.env.VUE_APP_THEME;
    },
    computed_single_user_mode() {
      if (process.env.VUE_APP_SINGLE_USER_MODE === "False")
      {
        return false;
      }
      else {
        return true;
      }
    }
  },
});

</script>

<style src="@fortawesome/fontawesome-free/css/all.css">
</style>

<style >
.card-header {
  background-color: #fff;
}

.editIcon {
  cursor: pointer;
  align-content: center;
  font-size: 1.5rem;
  padding-top: 0.2rem;
  color: #000000;
}

.checkIcon {
  align-content: center;
  font-size: 1.5rem;
  padding-top: 0.2rem;
  color: green;
}

.deleteIcon {
  cursor: pointer;
  align-content: center;
  font-size: 1.5rem;
  padding-top: 0.2rem;
  color: #ea002f;
}

.custom-button {
  width: 12rem;
  padding: 0.5rem 1rem;
  cursor: pointer;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  justify-content: center;
  border: 0px solid #000;
  border-radius: 100rem;
  background-color: #fff;
  color: #000;
  -webkit-box-shadow: 0 1px 3px rgb(0 0 0 / 12%), 0 1px 2px rgb(0 0 0 / 24%);
  box-shadow: 0 1px 3px rgb(0 0 0 / 12%), 0 1px 2px rgb(0 0 0 / 24%);
}

.custom-button:hover {
  background-color: #000;
  color: #fff;
}

.custom-button.deactivated {
  background-color: #fff !important;
  border: 0px solid #000;
  color: #bcbcbc;
  cursor: not-allowed !important;
  pointer-events: none;
}

.customCheckbox {
  display: inline-block;
  text-align: center;
  cursor: pointer;
  width: 25px;
  height: 25px;
  border: 1px solid rgb(119, 118, 118);
  border-radius: 2.5px;
}

.customCheckbox.checked {
  background-color: blue;
  border: 1px solid blue;
}

.customCheckbox.disabled {
  pointer-events: none;
  background-color: rgb(171, 171, 171);
  border: 1px solid rgb(119, 118, 118);
}

.checkboxCheckmark {
  color: white;
  font-size: 1.2rem;
}

.customRadio {
  display: inline-block;
  text-align: center;
  cursor: pointer;
  width: 25px;
  height: 25px;
  border: 1px solid rgb(119, 118, 118);
  border-radius: 50%;
}

.customRadio.checked {
  background-color: blue;
  border: 1px solid blue;
  padding-top: 0.16rem;
}

.customRadio.disabled {
  pointer-events: none;
  background-color: rgb(171, 171, 171);
  border: 1px solid rgb(119, 118, 118);
}

.radioCheckmark {
  color: white;
  font-size: 1.2rem;
}
</style>
