<template>
  <div class="row mt-3">
    <div class="col">
      <div class="myCard">
        <div class="card-header py-3 d-flex flex-row align-items-center justify-content-between">
          <h6 class="m-0 font-weight-bold"><font-awesome-icon :icon="['fas', 'satellite-dish']" /> Scan for new devices</h6>
        </div>

        <div class="body">
          <div class="m-0 p-0">
            <form action="" v-if="!form.loading" v-on:submit.prevent="submit()">
              <div class="row">
                <div class="col">
                  <label for="">Network cidr</label>
                  <input type="text" v-model="form.cidr" class="form-control" placeholder="192.168.1.0/24"  />
                  <small v-if="form['is_valid']" class="text-danger">CIDR is not valid</small>
                </div>
                <div class="col text-end">
                  <br />
                  <a class="btn btn-success" v-on:click.prevent="submit()" ><font-awesome-icon :icon="['fas', 'magnifying-glass']" /> Start scan</a>
                </div>
              </div>
            </form>
            <div v-else>
              <div class="p-5 text-center">
                Loading ...
                <br> <br/>
                <div class="progress">
                  <div class="progress-bar" role="progressbar" :style="{ width: loadingWidth + '%' }" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100">{{showPercentage(loadingWidth)}}%</div>
                </div>
              </div>
            </div>

            <div v-if="nothingFound" class="p-5 text-center">
              Nothing was found for {{form.cidr}}
            </div>

            <div v-if="devices.length !== 0" class="mt-5">
              <table class="table table-hover">
                <thead>
                  <tr>
                    <th scope="col">Name</th>
                    <th scope="col">MAC</th>
                    <th scope="col">IP</th>
                    <th scope="col">Firmware Version</th>
                    <th scope="col">Firmware type</th>
                    <th scope="col" class="text-end"></th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="el in devices">
                    <td>{{ el["name"] }}</td>
                    <td>{{ el["mac"] }}</td>
                    <td>
                      <a :href="getExternalLink(el['ip'])" target="_blank" style="text-decoration: none"><font-awesome-icon :icon="['fas', 'arrow-up-right-from-square']" />&nbsp;{{ el["ip"] }}</a>
                    </td>
                    <td>{{ el["firmware_version"] }}</td>
                    <td>{{ el["firmware_type"] }}</td>
                    <td class="text-end">
                      <a href="#" v-if="!el['is_existing']"  v-on:click.prevent="addDevice(el['ip'])" >
                        <font-awesome-icon :icon="['fas', 'plus']" />
                      </a>
                      <div v-else>
                        <span class="text-muted">added</span>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
var _ = require("lodash");
const isCidr = require("is-cidr");
import { createToast } from 'mosha-vue-toastify';

export default defineComponent({
  name: "HomeView",
  methods: {
    getExternalLink(ip: string) {
      return "http://" + ip;
    },
    addDevice(ip:string) {
      fetch('/api/devices/add/by_ip/'+ip,{
        method:"POST"
      })
        .then((response) => response.json())
        .then((res)=>{
          if(res.result === false) {
            if(res.error === "UNIQUE constraint failed: tasmota_devices.mac_address") {
              createToast("Device is already added",{"type":"danger"})
            }
          } else {
            createToast("Device was added")
          }
        })
    },
    showPercentage(perc:any) {
      return parseInt(perc)
    },
    submit() {
      if (!this.check_cidr()) {
        alert("Not Valid CIDR!");
        return;
      }
      this.form.loading = true;
      this.loadingWidth = 0;
      this.loadingTimeout = setInterval(()=>{
          let max = 1.5;
          let min = 0.2;
          let rnd = Math.random() * (max - min) + min;
          this.loadingWidth = this.loadingWidth + rnd;
      },80)
      this.devices = [];
      this.nothingFound = false;
      fetch("/api/discover_devices/?cidr="+this.form.cidr)
        .then((response) => response.json())
        .then((data) => {
          this.form.loading = false;
          if(data['devices'] == null) {
              this.nothingFound = true;
          } else {
            _.each(data['devices'],(el:any,id:number)=>{
              let ex = _.findIndex(data['existing'], ['mac',el['mac']])
              data['devices'][id]['is_existing'] = ex != -1 ? true : false;
            })

            this.devices = data["devices"];
          }          
          clearInterval(this.loadingTimeout)
        });
    },
    check_cidr() {
      if (this.form.cidr == "") {
        this.form.is_valid = true;
        return false;
      }
      let valid = isCidr(this.form.cidr);
      if (valid) {
        this.form.is_valid = false;
      } else {
        this.form.is_valid = true;
      }
      return valid;
    },
  },
  watch: {
    "form.cidr"() {
      this.check_cidr();
      this.nothingFound = false;
    },
  },
  data() {
    return {
      loadingWidth: 0,
      loadingTimeout: 0,
      devices: [],
      nothingFound: false,
      form: {
        loading: false,
        is_valid: false,
        cidr: "192.168.88.0/24",
      },
    };
  },
});
</script>
