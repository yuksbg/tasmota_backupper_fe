<template>
  <div class="row mt-3">
    <div class="col">
      <div class="myCard">
        <div class="card-header py-3 d-flex flex-row align-items-center justify-content-between">
          <h6 class="m-0 font-weight-bold">
          <font-awesome-icon :icon="['fas', 'microchip']" /> My Devices</h6>
          <div class="dropdown">
            <div class="dropdown-toggle" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false"></div>
            <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
              <li>
                <a class="dropdown-item" v-on:click.prevent="getData()" href="#"><font-awesome-icon :icon="['fas', 'rotate']" /> Reload data</a>
              </li>
              <li><router-link class="dropdown-item" :to='{name:"findNew"}'>Find new devices</router-link></li>
            </ul>
          </div>
        </div>

        <div class="body">
          <div class="m-0 p-0">
            <table class="table table-hover" v-if="!showEmpty">
              <thead>
                <tr>
                  <th scope="col">Name</th>
                  <th scope="col">MAC</th>
                  <th scope="col">IP</th>
                  <th scope="col">Last Backup</th>
                  <th scope="col" class="text-end"></th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(el, index) in devices">
                  <td>{{ el['name'] }}</td>
                  <td>{{ el['mac'] }}</td>
                  <td>
                      <a :href="getExternalLink(el['ip'])" target="_blank" style="text-decoration: none"><font-awesome-icon :icon="['fas', 'arrow-up-right-from-square']" />&nbsp;{{ el["ip"] }}</a>
                  </td>
                  <td>{{ el['last_update'] }}</td>
                  <td class="text-end micons">
                    <router-link :to='{name:"ViewBackups",params:{"mac":el["mac"]} }' class="ms-2" v-tippy="'View backups'">
                      <font-awesome-icon :icon="['fas', 'folder']" />
                    </router-link>
                    <router-link to="/" v-on:click.prevent="runBackup(index)" class="ms-2" v-tippy="'Backup now'">
                      <font-awesome-icon :icon="['fas', 'play']" />
                    </router-link>
                    <router-link to="/" class="ms-2">
                      <font-awesome-icon :icon="['fas', 'pen']" />
                    </router-link>
                    <router-link to="/" class="ms-2" v-on:click.prevent="deleteDevice(el)">
                      <font-awesome-icon :icon="['fas', 'trash']" />
                    </router-link>
                  </td>
                </tr>
              </tbody>
            </table>
            <div v-else class="p-3 text-center">
              No devices
              <br> <br>
              <router-link class="btn btn-primary" :to='{name:"findNew"}'>
                <font-awesome-icon :icon="['fas', 'plus']" /> Scan for new devices
              </router-link>
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
import { createToast } from 'mosha-vue-toastify';
import * as timeago from 'timeago.js';

export default defineComponent({
  name: "HomeView",
  methods: {
    getExternalLink:(ip:string) => {
      return "http://"+ip
    },
    deleteDevice: function(el: any) {
      if (confirm(`Confirm deletion of ${el['name']} `)) {
        fetch("/api/devices/delete/"+el['mac'],{
          method:"POST"
        })
        .then((response) => response.json())
        .then((res)=>{
          if(res.result === true) {
            createToast(`Device ${el['name']} was removed`)
            this.getData()
          }
        })
      }
    },
    getStatusIcon: (el: any) => {
      if (el["mac"] == "9C:9C:1F:47:96:87") {
        return ["fas", "power-off"];
      }
      return ["fas", "circle-exclamation"];
    },
    runBackup: function (el_id: number) {
      if (this.backupIsRunning) {
        createToast("Another backup is running, please try again later!");
        return false;
      }
      //@ts-ignore
      this.devices[el_id]["last_update"] = "running";
      let mac = this.devices[el_id]['mac']

      this.backupIsRunning = true;

      fetch("/api/backup/manual/"+mac,{
        method: "POST"
      })
      .then((response) => response.json())
      .then((res)=>{
        this.backupIsRunning = false;
        //@ts-ignore
        this.devices[el_id]["last_update"] = "just now"
      })

      

    },
    getData: function () {
      this.devices = [];
      fetch("/api/get_devices")
        .then((response) => response.json())
        .then((res) => {
          _.forEach(res.devices, function (el: any, id: number) {
            let bck = res['backups'][el['mac']] 
            if (bck && bck['file_count'] !== 0 ) { // hacky :) 
              let d = new Date(0)
              d.setUTCSeconds(parseInt(bck['last_backup']))
              res.devices[id]["last_update"] = timeago.format(d);
            } else {
              res.devices[id]["last_update"] = "";
            }
            res.devices[id]["status"] = "online";
          });
          this.devices = res.devices;
          if(_.size(this.devices) == 0 ) {
            this.showEmpty = true;
          }
        });
    },
  },
  created: function () {
    this.getData();
  },
  data() {
    return {
      backupIsRunning: false,
      showEmpty:false,
      devices: [],
    };
  },
});
</script>
