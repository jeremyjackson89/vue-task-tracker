<template>
  <app>
    <div class="row h-100 justify-content-center align-items-center">
      <div class="col-12 col-sm-8 col-sm-offset-2 col-md-6 col-md-offset-3">

        <div class="card">  
          <div class="card-header">
            <h4>Login</h4>
          </div>

          <div class="card-body">
            <form @submit.prevent="login">
              <small class="error" v-if="errors.login">{{ errors.login }}</small>
              <div class="form-group">
                <label for="username">Username</label>
                <input id="username" type="text" class="form-control" v-model="username">
                <small class="error" v-if="errors.username">{{ errors.username }}</small>
              </div>
              <div class="form-group">
                <label for="password">Password</label>
                <input id="password" type="password" class="form-control" v-model="password">
                <small class="error" v-if="errors.password">{{ errors.password }}</small>
              </div>
              <button type="submit" class="btn btn-primary btn-block">Login</button>
            </form>
          </div>
        </div>
      </div>

    </div>
  </app>
</template>

<script>
import App from '../App.vue'

export default {
  data() {
    return {
      username: '',
      password: '',
      errors: {
        username: '',
        password: '',
        login: ''
      }
    }
  },
  components: {
    App
  },
  methods: {
    async login() {
      this.errors = {}
      if (!this.username) {
        this.errors.username = 'Username is required'
      }

      if (!this.password) {
        this.errors.password = 'Password is required'
      }

      if (Object.keys(this.errors).length < 1) {
        const response = await fetch('http://localhost:4000/users/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            username: this.username,
            password: this.password
          })
        })
        
        const body = await response.json()

        if (body.error) {
          this.errors.login = body.error
        } else {
          localStorage.setItem('token', body.jwt)
          localStorage.setItem('user', JSON.stringify(body.user))

          window.location = '/dashboard'
        }

        this.$forceUpdate()
      }
    }
  },
  beforeCreate() {
    if (localStorage.getItem('token')) {
      window.location = '/dashboard'
    }
  }
}
</script>

<style>
</style>
