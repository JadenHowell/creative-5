<template>
<div class="hero">
  <div class="heroBox">
    <div v-if="!this.$root.$data.user">
        <h1>Sign in in order to compare your own recipes to chefs!</h1>
        <form class="pure-form">
        <fieldset>
            <legend>Register for an account</legend>
            <input placeholder="first name" v-model="firstName">
            <input placeholder="last name" v-model="lastName">
        </fieldset>
        <fieldset>
            <input placeholder="username" v-model="username">
            <input type="password" placeholder="password" v-model="password">
        </fieldset>
        <fieldset>
            <button type="submit" class="pure-button pure-button-primary" @click.prevent="register">Register</button>
        </fieldset>
        </form>
        <p v-if="error" class="error">{{error}}</p>
        <form class="pure-form">
        <fieldset>
            <legend>Login</legend>
            <input placeholder="username" v-model="usernameLogin">
            <input type="password" placeholder="password" v-model="passwordLogin">
        </fieldset>
        <fieldset>
            <button type="submit" class="pure-button pure-button-primary" @click.prevent="login">Login</button>
        </fieldset>
        </form>
        <p v-if="errorLogin" class="error">{{errorLogin}}</p>
    </div>
    <div v-else>
        <h1>Currently signed in as:</h1>
        <h2>{{this.$root.$data.user.username}}</h2>
        <button class="signout" @click.prevent="logout">Sign out</button>
    </div>
  </div>
</div>
</template>

<script>
import axios from 'axios';
export default {
  name: 'Profile',
  data() {
    return {
      firstName: '',
      lastName: '',
      username: '',
      password: '',
      usernameLogin: '',
      passwordLogin: '',
      error: '',
      errorLogin: '',
    }
  },
  created() {
    this.loadAll();
  },
  methods: {
    async loadAll(){
      //This uses axios to access this new endpoint at GET /api/users to get the currently logged in user, 
      //  and if found, set the user state in the global data storage so all components can use it.
      try {
        let response = await axios.get('/api/users');
        this.$root.$data.user = response.data.user;
      } catch (error) {
        this.$root.$data.user = null;
      }
    },
    async logout() {
      try {
        await axios.delete("/api/users");
        this.$root.$data.user = null;
      } catch (error) {
        this.$root.$data.user = null;
      }
    },
    async register() {
      this.error = '';
      this.errorLogin = '';
      if (!this.firstName || !this.lastName || !this.username || !this.password)
        return;
      try {
        let response = await axios.post('/api/users', {
          firstName: this.firstName,
          lastName: this.lastName,
          username: this.username,
          password: this.password,
        });
        this.$root.$data.user = response.data.user;
      } catch (error) {
        this.error = error.response.data.message;
        this.$root.$data.user = null;
      }
    },
    async login() {
      this.error = '';
      this.errorLogin = '';
      if (!this.usernameLogin || !this.passwordLogin)
        return;
      try {
        let response = await axios.post('/api/users/login', {
          username: this.usernameLogin,
          password: this.passwordLogin,
        });
        this.$root.$data.user = response.data.user;
      } catch (error) {
        this.errorLogin = "Error: " + error.response.data.message;
        this.$root.$data.user = null;
      }
    },
  }
}
</script>

<style scoped>
h1 {
  font-size: 28px;
  font-variant: capitalize;
}

.hero {
  padding: 30px;
  display: flex;
  justify-content: center;
}

.heroBox {
  background: white;
  opacity: 0.95;
  display: inline;
  padding: 20px;
  font-size: 20px;
  text-align: center;
  border-radius: 30px;
}

.hero::after {
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  position: absolute;
  z-index: -1;
}

.hero form {
  font-size: 16px;
}

.hero form legend {
  font-size: 24px;
}

input {
  margin-right: 10px;
}

.error {
  margin-top: 20px;
  display: inline;
  padding: 5px 20px;
  border-radius: 30px;
  font-size: 10px;
  background-color: #d9534f;
  color: #fff;
}
.signout {
  margin-top: 20px;
  display: inline;
  padding: 5px 20px;
  border-radius: 30px;
  font-size: 10px;
  background-color: #d9534f;
  color: #fff;
}
</style>
