<template>
  <div class="col-md-4 ml-auto mr-auto">
    <notifications></notifications>
    <form @submit.prevent="login()" @keyup.enter="login()">
      <card class="card-login card-plain">

        <div slot="header">
          <div class="logo-container">
            <img src="@/assets/img/now-logo.png" alt="">
          </div>
        </div>

        <div>
          <fg-input class="no-border"
                    type="email"
                    placeholder="Email..."
                    addon-left-icon="fas fa-at"
                    v-model="username">
          </fg-input>

          <fg-input class="no-border"
                    type="password"
                    placeholder="Password..."
                    addon-left-icon="fas fa-key"
                    v-model="password">
          </fg-input>
          <n-button type="primary" round block>
            Log In
          </n-button>
          <div class="pull-left">
            <h6>
              <router-link class="link footer-link" to="/register">
                Create Account
              </router-link>
            </h6>
          </div>
          <div class="pull-right">
            <h6><a href="#pablo" class="link footer-link">Need Help?</a></h6>
          </div>
        </div>
      </card>
    </form>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        username: '',
        password: '',
        authenticated: auth.check(),
        user: auth.user,
      }
    },
    methods: {
      login() {
        let data = {
          username: this.username,
          password: this.password
        };

        axios.post('login', data)
                .then((response) => {
                  auth.login(response.data.token, response.data.user)

                  // Set default path for users
                  let roles = {
                    'guest': () => {
                      location.href = '/'
                    },
                    'admin': () => {
                      this.$router.push('/dashboard')
                    },
                    'super': () => {
                      this.$router.push('/dashboard')
                    },
                  };
                  roles[auth.role()]();
                })
                .catch((response) => {
                  this.$notify({
                    message: response.data.message,
                    icon: 'fas fa-exclamation-triangle',
                    type: 'warning',
                    horizontalAlign: 'center'
                  })
                });
      },
    },
    mounted() {
      Event.$on('userLoggedIn', () => {
        this.authenticated = true;
        this.user = auth.user;
      });
      Event.$on('userLoggedOut', () => {
        this.authenticated = false;
        this.user = null;
      });
    }
  }
</script>
<style>
  .navbar-nav .nav-item p {
    line-height: inherit;
    margin-left: 5px;
  }
</style>
