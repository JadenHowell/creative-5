<template>
  <div class="Profile">
    <h1>Upload some more recipes!</h1>
    <h3>Selected chef: {{this.chef.name}}</h3>
    <div id="chefs">
      <button class="chefButton" v-for="chef in chefs" :key=chef._id @click=selectChef(chef)>{{chef.name}}</button>
    </div>
    <div class="adding">
      <div class="addRec">
        <div class="form">
          <input v-model="title" placeholder="Recipe Name">
          <p></p>
          <textarea v-model="description" placeholder="Description">Description</textarea>
          <p></p>
          <input type="file" name="photo" @change="fileChanged">
          <p></p>
          <input v-model="url" placeholder="Recipe URL">
          <p></p>
          <button @click="upload">Upload</button>
        </div>
        <div class="upload" v-if="addRec">
          <h2>{{addRec.name}}</h2>
          <img :src="addRec.photoURL" />
          <p class="describe">{{addRec.description}}</p>
        </div>
      </div>
      <div class="addChef">
        <div class="form">
          <button @click="deleteChef">Delete selected chef</button>
          <p></p>
          <input v-model="chefName" placeholder="Chef Name">
          <p></p>
          <button @click="newChef">Add chef</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.image h2 {
  font-style: italic;
  font-size: 1em;
}

.heading {
  display: flex;
  margin-bottom: 20px;
  margin-top: 20px;
}

.heading h2 {
  margin-top: 8px;
  margin-left: 10px;
}

.adding{
  display: flex;
  margin: 25px auto;
  flex-direction: row;
  justify-content: space-around;
}

.addRec
.addChef {
  display: flex;
  witdth: 400px;
}

.describe{
  font-size: 12px;
}

/* Form */
input,
textarea,
select,
button {
  font-family: 'Montserrat', sans-serif;
  font-size: 1em;
}

.form {
  margin-right: 50px;
}

/* Uploaded images */
.upload h2 {
  margin: 0px;
}

.upload img {
  max-width: 300px;
}

.chefButton{
  border: none;
}

button.selected {
  background-color: #00ff00;
}
</style>

<script>
import axios from 'axios';
export default {
  name: 'Profile',
  data() {
    return {
      title: "",
      url: "",
      description: "",
      file: null,
      addRec: null,
      chefs: [],
      chef: {},
      chefName: "",
    }
  },
  created() {
    this.setup();
  },
  methods: {
    async setup(){
      await this.getChefs();
      if(this.chefs.length > 0){
        this.chef = this.chefs[0];
      } else {
        this.chef = {name: "None"};
      }
    },
    fileChanged(event) {
      this.file = event.target.files[0]
    },
    async upload() {
      try {
        const formData = new FormData();
        formData.append('photo', this.file, this.file.name)
        let r1 = await axios.post('/api/photos', formData);
        let r2 = await axios.post('/api/chefs/'+this.chef._id+'/recipes', {
          name: this.title,
          description: this.description,
          photoURL: r1.data.path,
          favorite: false,
          link: this.url,
        });
        this.addRec = r2.data;
      } catch (error) {
        //console.log(error);
      }
    },
    async getChefs() {
      try {
        const response = await axios.get("/api/chefs");
        this.chefs = response.data;
      } catch (error) {
        //console.log(error);
      }
    },
    async newChef() {
      try {
        await axios.post("/api/chefs", {
          name: this.chefName,
        });
        this.getChefs();
      } catch (error) {
        //console.log(error);
      }
    },
    async deleteChef() {
      try {
        await axios.delete("/api/chefs/"+this.chef._id);
        this.getChefs();
      } catch (error) {
        //console.log(error);
      }
    },
    selectChef(chef) {
      this.chef = chef;
    },
  }
}
</script>