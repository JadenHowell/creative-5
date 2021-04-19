<template>
  <div class="home">
    <h1 class="pagename">Explore other chefs recipes!</h1>
    <div class="all-chefs">
      <div class="celeb-chef" v-for="chef in chefs" :key="chef._id">
        <h2 class="chefName">{{chef.name}}:</h2>
        <div class="recipe-list">
          <div class="rec" v-for="recipe in recipes[chef.name]" :key="recipe._id">
            <h4>{{recipe.name}}</h4>
            <button class="selectButton" @click="selectRecipe(recipe)">See details</button>
          </div>
        </div>
      </div>
    </div>
    <div class='personal-recs'>
      <div v-if="user">
      </div>
      <div v-else>
        <h2>Sign in to compare your own recipes!</h2>
      </div>
    </div>
    <div class="selection">
      <div v-if="isSelected">
        <div class="top-half">
          <h1 class="recName">{{this.selectedRecipe.name}}</h1>
          <input id="toggle-heart" type="checkbox" v-model="this.selectedRecipe.favorite" @change="changeFav()"/>
          <label for="toggle-heart">❤</label>
        </div>
        <div class="info">
          <img :src=selectedRecipe.photoURL>
          <div class="words">
            <p>{{selectedRecipe.description}}</p>
            <p><a :href=selectedRecipe.link>See whole recipe</a></p>
          </div>
        </div>
      </div>
      <div v-else>
        <h3>Select a recipe to see more info!</h3>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
export default {
  name: 'Home',
  data() {
    return {
      chefs: [],
      recipes: {},
      selectedRecipe: {},
      isSelected: false,
    }
  },
  created() {
    this.loadAll();
  },
  computed: {
    user() {
      return this.$root.$data.user;
    }
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
      
      await this.loadChefs();
      for( let i = 0; i < this.chefs.length; i ++){
        this.loadRecipes(this.chefs[i]);
      }
    },
    async loadChefs(){
      try{
        let response = await axios.get("/api/chefs");
        this.chefs = response.data;
        //console.log("in loadChefs, this,chefs: ", this.chefs);
        return true;
      } catch (error) {
        //console.log(error);
      }
    },
    async loadRecipes(chef){
      try{
        let response = await axios.get("/api/chefs/"+chef._id+"/recipes");
        //console.log(response.data);
        //this.$set triggers updates on the page whenever this deeper layer is created
        this.$set(this.recipes, chef.name, response.data);
        return true;
      } catch (error) {
        //console.log(error);
      }
    },
    selectRecipe(recipe){
      this.isSelected = true;
      this.selectedRecipe = recipe;
    },
    changeFav(){
      this.selectedRecipe.favorite = !this.selectedRecipe.favorite;
      this.putFavorite();
      //console.log(this.selectedRecipe.favorite);
    },
    async putFavorite(){
      try{
        await axios.put("/api/chefs/"+this.selectedRecipe.chef+"/recipes/"+this.selectedRecipe._id,{
            name: this.selectedRecipe.name,
            link: this.selectedRecipe.link,
            photoURL: this.selectedRecipe.photoURL,
            favorite: this.selectedRecipe.favorite,
            description: this.selectedRecipe.description,
        });
        //console.log(response);
      } catch (error){
        //console.log(error)
      }
    }
  }
}
</script>

<style scoped>
.pagename{
  color: #000000;
}

.all-chefs{
  text-align: center;
}

.chefName{
  margin-top: 25px;
}

.recipe-list{
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-around;
}

.rec{
  display: flex;
  flex-direction: column;
  width: 200px;
  text-align: center;
}

.selectButton{
  width: 100px;
  margin: 5px auto;
}

.selection{
  background-color:#f7af94;
  padding: 15px;
  max-width: 550px;
  margin: 0 auto;
}

.top-half{
  display: flex;
  flex-direction: row;
  text-align: center;
}
.recName{
  padding-right: 15px;
  margin: 0 auto;
}
.info{
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
.info img{
  width: auto;
  max-width: 30%;
  height: auto;
  max-height: 100px;
}
.words{
  max-width: 50%;
}

[id='toggle-heart'] {
  position: absolute;
  left: -100vw;
}
[for='toggle-heart'] {
  color: #aab8c2;
  font-size: 2em;
  cursor: pointer;
  align-self: center; 
}
[id='toggle-heart']:checked + label {
  color: #e2264d;
}
</style>