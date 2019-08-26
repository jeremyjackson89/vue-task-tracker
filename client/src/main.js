import Vue from 'vue'

import Login from './components/Login'
import Dashboard from './components/Dashboard'

Vue.config.productionTip = false

const routes = {
  '/': Login,
  '/login': Login,
  '/dashboard': Dashboard
}

const app = new Vue({
  el: '#app',
  data: {
    currentRoute: window.location.pathname
  },
  computed: {
    viewComponent() {
      const matchingRoute = routes[this.currentRoute]
      return matchingRoute ? routes[this.currentRoute] : Login
    }
  },
  render (h) {
    return h(this.viewComponent)
  },
})


window.addEventListener('popstate', () => {
  app.currentRoute = window.location.pathname
})
