<template>
  <div>
    <!-- Navigation-->
    <nav class="navbar navbar-expand-lg navbar-light fixed-top shadow-sm" id="mainNav">
      <div class="container">
        <router-link class="navbar-brand fw-bold" to="/">
        <font-awesome-icon :icon="['fas', 'cloud']" />&nbsp;Tasmota Backupper</router-link>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarResponsive" aria-controls="navbarResponsive" aria-expanded="false" aria-label="Toggle navigation">
          Menu
          <i class="bi-list"></i>
        </button>
        <div class="collapse navbar-collapse" id="navbarResponsive">
          <ul class="navbar-nav ms-auto me-4 my-3 my-lg-0">
            <li class="nav-item">
              <router-link class="nav-link me-lg-3" :to="{name:'config'}">Settings</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link me-lg-3" :to="{name:'findNew'}">Find new device</router-link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
    <!-- EndNavigation -->

    <div>
      <div class="masthead">
        <div class="container">
          <router-view />
        </div>
      </div>
    </div>

    <div>
      <footer class="text-end text-muted" style="font-size: 0.6rem;">
        <div class="container">
          <a target="_blank" href="https://yuks.me/" style="text-decoration: none;color:rgba(0,0,0,.55);" >Tasmota Backupper v.{{version}}</a>
        </div>
      </footer>
    </div>

  </div>
</template>


<script lang="ts">
import { defineComponent } from "vue";
import mConfig from './config.json'

export default defineComponent({
  name: "HomeView",
  data() {
    return {
      version: mConfig.VERSION
    }
  },
})
</script>