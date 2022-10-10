<template>
  <div>
    <div class="card mb-4 w-100">
      <div class="card-header py-3 cardHeaderLight">
        <h6 class="m-0 font-weight-bold">{{ title }}:</h6>
      </div>
      <div class="card-body">
        <div v-if="loading" class="d-flex justify-content-center">
          <div class="spinner-border" role="status"></div>
        </div>
        <div v-else class="table-responsive">
          <table
            class="table table-bordered"
            id="dataTable"
            width="100%"
            cellspacing="0"
          >
            <thead>
              <tr>
                <th>Username</th>
                <th>Password</th>
                <th>Address</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{{ username }}</td>
                <td>
                  <div class="d-flex" id="pwd">
                    <div>
                      {{ "*".repeat(password.length >= 50 ? 50 : password.length) }}
                    </div>
                    <div
                      type="button"
                      id="copy"
                      class="child far fa-copy m-1 ml-auto"
                      alt="copy"
                      title="Double click to copy password"
                      @click="copyPassword()"
                    ></div>
                    <span v-if="PWCopied">Copied</span>
                  </div>
                </td>
                <td>
                  <div v-for="address in addresses" :key="address">
                    <a v-if="accessibleFromBrowser" :href="'http://' + address" target="_blank" rel="noopener noreferrer">{{ address }}</a>
                    <span v-else >{{ address }}</span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    <br />
  </div>
</template>

<script>

export default {
  name: 'ClusterServiceAccess',
  data() {
    return {
      PWCopied: false,
    };
  },
  props: {
    title: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    addresses: {
      type: Array,
      required: true,
    },
    accessibleFromBrowser: {
      type: Boolean,
      default: true,
    },
    loading: Boolean,
  },

  created() {},
  mounted() {},
  methods: {
    copyPassword() {
      var dummyEl = document.createElement("textarea");
      document.body.appendChild(dummyEl);
      dummyEl.value = this.password;
      dummyEl.select();
      document.execCommand("copy");
      document.body.removeChild(dummyEl);
      this.PWCopied = true;
      setTimeout(() => {
        this.PWCopied = false;
      }, 2000);
    },
  },
  destroyed() {},
};
</script>
