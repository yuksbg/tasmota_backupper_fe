<template>
  <div class="row mt-3">
    <div class="col">
      <div class="myCard">
        <div class="card-header py-3 d-flex flex-row align-items-center justify-content-between">
        <h6 class="m-0 font-weight-bold"><font-awesome-icon :icon="['fas', 'screwdriver-wrench']" />&nbsp;Settings</h6></div>
        <div class="body">
          <div class="m-0 p-0">
            <div>
              <button class="btn btn-danger" v-on:click.prevent="clearDevices()">
                Delete devices
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
var _ = require("lodash/core");
const isCidr = require("is-cidr");

export default defineComponent({
  name: "HomeView",
  methods: {
    clearDevices() {
      if(confirm(`Are you sure?`)) {
        fetch('/api/devices/clear_all',{
          'method': 'POST'
        }).then(()=>{
          //@ts-ignore
          this.$moshaToast("Device table was cleared!");
        })
      }
    }
  }
})
</script>