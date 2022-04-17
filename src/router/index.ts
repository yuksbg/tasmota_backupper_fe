import { createRouter, createWebHistory, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ConfigView from '../views/AboutView.vue'
import FindNew from '../views/FindDevice.vue'
import ViewBackups from '../views/ViewBackups.vue'

import myConfig from '../config.json'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/config',
    name: 'config',
    component: ConfigView
  },
  {
    path: '/find-new',
    name: 'findNew',
    component: FindNew
  },
  {
    path: "/view-backups/:mac",
    name: "ViewBackups",
    component: ViewBackups,
    props: true,
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  }
]

let hmode = createWebHistory(process.env.BASE_URL)

//@ts-ignore
if(myConfig.ROUTER_MODE && myConfig.ROUTER_MODE == "embed") {
  hmode = createWebHashHistory(process.env.BASE_URL)
}

const router = createRouter({
  history: hmode,
  routes
})

export default router
