<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/profile">Add more</router-link>
    </div>
    <div class="content">
      <router-view/>
    </div>
    <div class="footer">
      <div class="githublink">Follow to my Github repo <a href="https://github.com/JadenHowell/creative-4">here</a></div>
    </div>
  </div>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  background-color:#fceae3;
}

#nav {
  padding: 10px;
  background-color:#fcd6c7;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #0A9478;
}

.content {
  padding: 10px 100px;
  min-height: 500px;
}

/* Footer */
.footer {
  height: 50px;
  background-color:#fcd6c7;
  padding-top: 30px;
  margin: 0 auto;
  font-size: 16px;
  width: 80%;
}

.githublink{
  text-align: center;
  margin: 0 auto;
}
</style>
