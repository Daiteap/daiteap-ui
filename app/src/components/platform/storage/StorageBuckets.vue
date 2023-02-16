<template>
  <div>
    <WarningAlert
      v-if="showAlert"
      msg="Bucket is not empty."
      color="warning"
      :key="alertKey"
    />
    <SpecificUserInfo
      v-if="showSpecificUserInfo"
      :username="specificUserUsername"
      @hideUserDetails="hideUserDetails"
    />
    <EditBucketPopup
      v-if="showEditBucketPopup"
      :currentBucket="bucketToEdit"
      @updateBucket="updateBucket"
    />

    <table
      class="table table-bordered"
      width="100%"
      cellspacing="0"
      v-if="buckets.length > 0"
    >
      <GenericPopupWarning
        v-if="bucketToDelete.provider == 'azure'"
        :message="`Confirm deleting ${bucketToDelete.name} Warning: This will delete all files in the container.`"
        @confirm="deleteBucket"
        :modalId="popupId"
      />
      <GenericPopupWarning
        v-else
        :message="`Confirm deleting ${bucketToDelete.name}`"
        @confirm="deleteBucket"
        :modalId="popupId"
      />
      <thead>
        <tr>
          <th>Name</th>
          <th>Description</th>
          <th v-if="!projectID && !showTenant">Project</th>
          <th>Provider</th>
          <th>Created at</th>
          <th>Created by</th>
          <th>Edit</th>
          <th>Delete</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in buckets" :key="item.name">
          <td
            class="clickForDetails"
            v-on:click="
              $router.push({
                name: 'BucketDetails',
                params: {
                  bucket: item,
                },
              })
            "
            :title="item.name"
          >
            {{ item.name }}
          </td>
          <td :title="item.description">
            {{ item.description }}
          </td>
          <td
            class="clickForDetails"
            @click="
              $router.push({
                name: 'ProjectDetails',
                params: {
                  projectID: item.project.id,
                },
              })
            "
            v-if="!projectID && !showTenant"
            :title="item.project.name"
          >
            {{ item.project.name }}
          </td>
          <td>
            <img
              v-if="item.provider == 'aws'"
              :title="item.credential.label"
              height="25pix"
              width="auto"
              :src="require('../../../assets/img/aws_logo_small.png')"
            />
            <img
              v-if="item.provider == 'azure'"
              :title="item.credential.label"
              height="25pix"
              width="auto"
              :src="require('../../../assets/img/azure_logo_small.png')"
            />
            <img
              v-if="item.provider == 'google'"
              :title="item.credential.label"
              height="25pix"
              width="auto"
              :src="require('../../../assets/img/googleCloud_logo_small.png')"
            />
          </td>
          <td>{{ item.created_at | formatDate }}</td>
          <td
            class="clickForDetails"
            v-on:click="showUserDetails(item.contact)"
            :title="item.contact"
          >
            {{ item.contact }}
          </td>
          <td>
            <div class="pl-2">
              <div
                title="Edit"
                @click="openEditPopup(item)"
                class="fas fa-edit editIcon"
              ></div>
            </div>
          </td>
          <td>
            <div class="pl-2">
              <div
                title="Delete"
                @click="deleteBucketPopup(item)"
                class="far fa-trash-alt deleteIcon"
              ></div>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import GenericPopupWarning from "../popup_modals/GenericPopupWarning";
import WarningAlert from "@/components/platform/WarningAlert";
import SpecificUserInfo from "@/components/platform/popup_modals/SpecificUserInfo";
import EditBucketPopup from "@/components/platform/popup_modals/EditBucketPopup";

export default {
  name: "StorageBuckets",
  components: {
    GenericPopupWarning,
    WarningAlert,
    SpecificUserInfo,
    EditBucketPopup,
  },
  props: {
    buckets: Array,
    projectID: String,
    showTenant: Boolean,
  },
  data() {
    return {
      bucketToDelete: "",
      showAlert: false,
      alertKey: 0,
      popupId: "bucketdeletewarning",
      showSpecificUserInfo: false,
      specificUserUsername: "",
      bucketToEdit: {},
      showEditBucketPopup: false,
    };
  },
  methods: {
    deleteBucketPopup(bucket) {
      this.bucketToDelete = bucket;
      this.$bvModal.show(this.popupId);
    },
    deleteBucket() {
      this.$bvModal.hide(this.popupId);
      let self = this;

      this.axios
        .delete(
          "/server/tenants/" +
            this.computed_active_tenant_id +
            "/buckets/" +
            this.bucketToDelete.id,
          this.get_axiosConfig()
        )
        .then(function () {
          self.$notify({
            group: "msg",
            type: "success",
            title: "Message:",
            text: "Successfully deleted bucket!",
          });
        })
        .catch(function (error) {
          if (error.response.data.error == "Bucket is not empty.") {
            self.showAlert = true;
            self.alertKey += 1;
          } else {
            self.showAlert = false;
            self.alertKey += 1;
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
                text: "Error while deleting bucket.",
              });
            }
          }
        });
    },
    showUserDetails(username) {
      this.specificUserUsername = username;
      this.showSpecificUserInfo = true;
    },
    hideUserDetails() {
      this.showSpecificUserInfo = false;
    },
    openEditPopup(bucket) {
      this.bucketToEdit = bucket;
      this.showEditBucketPopup = true;
      this.$nextTick(function () {
        this.$bvModal.show("bv-modal-editbucket");
      });
    },
    updateBucket(bucket) {
      let self = this;
      this.axios
        .put(
          "/server/tenants/" +
            this.computed_active_tenant_id +
            "/buckets/" +
            bucket.id,
          {
            description: bucket.description,
          },
          this.get_axiosConfig()
        )
        .then(function () {
          self.$notify({
            group: "msg",
            type: "success",
            title: "Notification:",
            text: "Successfuly updated bucket / container!",
          });
        })
        .catch(function (error) {
          console.log(error);
          if (error.response) {
            console.log(error.response.data);
          }
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
              title: "Notification:",
              text: "Error while updating bucket / container.",
            });
          }
        });
    },
  },
};
</script>

<style scoped>
td {
  max-width: 17rem;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}
</style>