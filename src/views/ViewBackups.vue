<template>
  <div class="row mt-3">
    <div class="col">
      <div class="myCard">
        <div class="card-header py-3 d-flex flex-row align-items-center justify-content-between">
          <h6 class="m-0 font-weight-bold">Backups for device <b>{{mac}}</b> </h6>
        </div>

        <div class="body">
          <div class="m-0 p-0">
              <table class="table">
                <thead>
                <tr>
                  <th scope="col">Date</th>
                  <th scope="col">File size</th>
                  <th scope="col" class="text-end"></th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="el in files">
                  <td>
                    <font-awesome-icon style="font-size:12px;color:gray" :icon="['fas', 'clock']" v-tippy="getTooltipClock(el)" />&nbsp;
                    {{ el['parsed_backup_time'] }}
                  </td>
                  <td>{{el['parsed_bytes']}}</td>
                  <td class="text-end">
                    <a :href="downloadFile(el)" class="ms-2" v-tippy="'Download'" target="_blank">
                      <font-awesome-icon :icon="['fas', 'download']" />
                    </a>
                    <a href="#" class="ms-2" v-tippy="'Delete file'" v-on:click.prevent="deleteFile(el)">
                      <font-awesome-icon :icon="['fas', 'trash']" />
                    </a>
                  </td>
                </tr>
              </tbody>
              </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
var _ = require("lodash");
import { createToast } from 'mosha-vue-toastify';
import BTH from '../helpers/bytes_to_human'
import * as timeago from 'timeago.js';

export default defineComponent({
  name: "ViewBackups",
  props: ['mac'],
  methods: {
    downloadFile: function(el:any) {
      return "/api/backup/download/"+this.mac+"/"+el["file_name"]
    },
    deleteFile: function(el:any){
      if(confirm("Are you sure?")) {
        fetch("/api/backup/delete/"+this.mac+"/"+el["file_name"],{
          method: "POST"
        }).then(()=>{
          this.getData()
        })
      }
    },
    getTooltipClock(el:any) {
      let d = new Date(0)
      d.setUTCSeconds(parseInt(el['backup_time']))
      return timeago.format(d);
    },
    getData: function(){
      fetch('/api/backup/get_backups/'+this.mac)
        .then((response) => response.json())
        .then((res)=>{
          _.each(res['files'],function(el:any,i:number){
            res['files'][i]['parsed_bytes'] = BTH(el['file_size'])
            let d = new Date(0)
            d.setUTCSeconds(parseInt(el['backup_time']))
            res['files'][i]['parsed_backup_time'] = d.toLocaleString()
          })
          // order by time desc
          res['files'] = _.orderBy(res['files'],['backup_time'],['desc'])
          this.files = res['files']
        })
    }
  },
  watch: {
  },
  created: function(){
    this.getData()
  },
  data() {
    return {
      files: []
    };
  },
});
</script>
