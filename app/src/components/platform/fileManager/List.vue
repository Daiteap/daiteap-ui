<template>
  <v-card flat tile min-height="380" class="d-flex flex-column">
    <confirm ref="confirm"></confirm>
    <GenericPopupWarning :message="deleteItemMsg" @confirm="deleteItem" />
    <v-card-text
      v-if="!path"
      class="grow d-flex justify-center align-center grey--text"
      >Select a folder</v-card-text
    >
    <v-card-text
      v-else-if="isFile"
      class="grow d-flex justify-center align-center"
      >File: {{ path }}</v-card-text
    >
    <v-card-text v-else-if="dirs.length || files.length" class="grow">
      <v-list subheader v-if="dirs.length">
        <v-subheader>Folders ({{ dirs.length }})</v-subheader>
        <v-list-item
          v-for="item in dirs"
          :key="item.basename"
          @click="changePath(item.path)"
          class="pl-0"
        >
          <v-list-item-avatar class="ma-0">
            <v-icon>mdi-folder-outline</v-icon>
          </v-list-item-avatar>
          <v-list-item-content class="py-2">
            <v-list-item-title v-text="item.basename"></v-list-item-title>
          </v-list-item-content>
          <v-list-item-action>
            <v-btn
              icon
              @click.stop="deleteItemPopup(item)"
              title="Delete Folder"
            >
              <v-icon color="grey lighten-1">mdi-delete-outline</v-icon>
            </v-btn>
            <v-btn icon v-if="false">
              <v-icon color="grey lighten-1">mdi-information</v-icon>
            </v-btn>
          </v-list-item-action>
        </v-list-item>
      </v-list>
      <v-divider v-if="dirs.length && files.length"></v-divider>
      <v-list subheader v-if="files.length">
        <v-subheader>Files ({{ files.length }})</v-subheader>
        <v-list-item
          v-for="item in files"
          :key="item.basename"
          @click="changePath(item.path)"
          class="pl-0"
        >
          <v-list-item-avatar class="ma-0">
            <v-icon>{{ icons["other"] }}</v-icon>
          </v-list-item-avatar>

          <v-list-item-content class="py-2">
            <v-list-item-title v-text="item.basename"></v-list-item-title>
            <v-list-item-subtitle
              >{{ formatBytes(item.size) }},
              {{ item.content_type }}</v-list-item-subtitle
            >
          </v-list-item-content>

          <v-list-item-action>
            <v-btn icon @click.stop="downloadItem(item)" title="Download File">
              <v-icon color="grey lighten-1"
                >mdi-format-vertical-align-bottom</v-icon
              >
            </v-btn>
            <v-btn icon @click.stop="deleteItemPopup(item)" title="Delete File">
              <v-icon color="grey lighten-1">mdi-delete-outline</v-icon>
            </v-btn>
            <v-btn icon v-if="false">
              <v-icon color="grey lighten-1">mdi-information</v-icon>
            </v-btn>
          </v-list-item-action>
        </v-list-item>
      </v-list>
    </v-card-text>
    <v-card-text
      v-else-if="filter"
      class="grow d-flex justify-center align-center grey--text py-5"
      >No files or folders found</v-card-text
    >
    <v-card-text
      v-else-if="loadingFiles"
      class="grow d-flex justify-center align-center grey--text py-5"
      ><div class="d-flex justify-content-center spinner-border" role="status">
        <span class="sr-only">Loading...</span>
      </div></v-card-text
    >
    <v-card-text
      v-else
      class="grow d-flex justify-center align-center grey--text py-5"
      >The folder is empty</v-card-text
    >
    <v-divider v-if="path"></v-divider>
    <v-toolbar v-if="false && path && isFile" dense flat class="shrink">
      <v-btn icon>
        <v-icon>mdi-download</v-icon>
      </v-btn>
    </v-toolbar>
    <v-toolbar v-if="path && isDir" dense flat class="shrink">
      <v-text-field
        solo
        flat
        hide-details
        label="Filter"
        v-model="filter"
        prepend-inner-icon="mdi-filter-outline"
        class="ml-n3"
      ></v-text-field>
      <v-btn icon v-if="false">
        <v-icon>mdi-eye-settings-outline</v-icon>
      </v-btn>
      <v-btn icon @click="load" title="Refresh">
        <v-icon>mdi-refresh</v-icon>
      </v-btn>
    </v-toolbar>
  </v-card>
</template>

<script>
import { formatBytes } from "./util";
import Confirm from "./Confirm.vue";
import GenericPopupWarning from "../popup_modals/GenericPopupWarning";

export default {
  name: "List",
  props: {
    icons: Object,
    storage: String,
    path: String,
    endpoints: Object,
    axios: Function,
    refreshPending: Boolean,
    bucket: Object,
  },
  components: {
    Confirm,
    GenericPopupWarning,
  },
  data() {
    return {
      items: [],
      filter: "",
      fileToDelete: "",
      deleteItemMsg: "",
      loadingFiles: false,
    };
  },
  computed: {
    dirs() {
      return this.items.filter(
        (item) => item.type === "dir" && item.basename.includes(this.filter)
      );
    },
    files() {
      return this.items.filter(
        (item) => item.type === "file" && item.basename.includes(this.filter)
      );
    },
    isDir() {
      return this.path[this.path.length - 1] === "/";
    },
    isFile() {
      return !this.isDir;
    },
  },
  methods: {
    formatBytes,
    changePath(path) {
      this.$emit("path-changed", path);
    },
    async load() {
      this.$emit("loading", true);
      if (this.isDir) {
        let self = this;
        this.loadingFiles = true;

        this.axios
          .get(
            "/server/tenants/" +
              this.computed_active_tenant_id +
              "/buckets/" +
              this.bucket.id +
              "/files/-" +
              this.path,
            this.get_axiosConfig()
          )
          .then(function (response) {
            self.items = response.data.files;
            self.loadingFiles = false;
          })
          .catch(function (error) {
            console.log(error);
            if (error.response && error.response.status == "403") {
              self.$notify({
                group: "msg",
                type: "error",
                title: "Notification:",
                text: "Access Denied",
              });
            } else {
              self.$notify({
                group: "msg",
                type: "error",
                title: "Message:",
                text: "Error while getting files.",
              });
            }
          });
      }
      this.$emit("loading", false);
    },
    deleteItemPopup(item) {
      this.fileToDelete = item;
      this.deleteItemMsg = "Confirm deleting " + this.fileToDelete.basename;
      if (this.fileToDelete.content_type == "folder") {
        this.deleteItemMsg += " and all of its contents";
      }
      this.$bvModal.show("bv-modal-removeuserwarning");
    },
    deleteItem() {
      this.$bvModal.hide("bv-modal-removeuserwarning");
      this.$emit("loading", true);

      let self = this;

      let successMsg, errorMsg;
      if (this.fileToDelete.content_type == "folder") {
        successMsg = "Successfully deleted folder!";
        errorMsg = "Error while deleting folder.";
      } else {
        successMsg = "Successfully deleted file!";
        errorMsg = "Error while deleting file.";
      }

      this.axios
        .delete(
          "/server/tenants/" +
            this.computed_active_tenant_id +
            "/buckets/" +
            this.bucket.id +
            "/files/-" +
            this.fileToDelete.path,
          this.get_axiosConfig()
        )
        .then(function () {
          self.$notify({
            group: "msg",
            type: "success",
            title: "Message:",
            text: successMsg,
          });

          self.$emit("file-deleted");
        })
        .catch(function (error) {
          console.log(error);
          if (error.response && error.response.status == "403") {
            self.$notify({
              group: "msg",
              type: "error",
              title: "Notification:",
              text: "Access Denied",
            });
          } else {
            self.$notify({
              group: "msg",
              type: "error",
              title: "Message:",
              text: errorMsg,
            });
          }
        });

      this.$emit("loading", false);
    },
    downloadItem(item) {
      let self = this;

      this.axios
        .get(
          "/server/tenants/" +
            this.computed_active_tenant_id +
            "/buckets/" +
            this.bucket.id +
            "/files/-" +
            item.path,
          this.get_axiosConfig()
        )
        .then(function (response) {
          let contents = response.data["contents"];
          let contentType = response.data["content_type"];
          let byteArray = new Uint8Array(contents);
          let blob = new Blob([byteArray], { type: contentType });
          
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", item.basename);
          document.body.appendChild(link);
          link.click();
        })
        .catch(function (error) {
          console.log(error);
          if (error.response && error.response.status == "403") {
            self.$notify({
              group: "msg",
              type: "error",
              title: "Notification:",
              text: "Access Denied",
            });
          } else {
            self.$notify({
              group: "msg",
              type: "error",
              title: "Message:",
              text: "Error while downloading file.",
            });
          }
        });
    },
  },
  watch: {
    async path() {
      this.items = [];
      await this.load();
    },
    async refreshPending() {
      if (this.refreshPending) {
        await this.load();
        this.$emit("refreshed");
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.v-card {
  height: 100%;
}
</style>