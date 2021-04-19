const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
  extended: false
}));

// parse application/json
app.use(bodyParser.json());

const cookieParser = require("cookie-parser");
app.use(cookieParser());

const cookieSession = require('cookie-session');
app.use(cookieSession({
    name: 'session',
    keys: ['secretValue'],
    cookie: {
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
}));

// connect to the database
mongoose.connect('mongodb://localhost:27017/chef-competition', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Configure multer so that it will upload to '../front-end/public/images'
const multer = require('multer')
const upload = multer({
  dest: '../front-end/chef-catalog/public/images/',
  limits: {
    fileSize: 10000000
  }
});
// Upload a photo. Uses the multer middleware for the upload and then returns
// the path where the photo is stored in the file system.
// the upload.   is what uses multer, sending it the photo
app.post('/api/photos', upload.single('photo'), async (req, res) => {
    // Just a safety check
    if (!req.file) {
      return res.sendStatus(400);
    }
    res.send({
      path: "/images/" + req.file.filename
    });
});

// Create a scheme for chefs
const chefSchema = new mongoose.Schema({
    name: String
});  
// Create a model for chefs
const Chef = mongoose.model('Chef', chefSchema);

// Schema for recipes
const recipeSchema = new mongoose.Schema({
    chef: {
        type: mongoose.Schema.ObjectId,
        ref: 'Chef'
    },
    name: String,
    link: String,
    photoURL: String,
    favorite: Boolean,
    description: String,
});
// Model for recipes
const Recipe = mongoose.model('Recipe',recipeSchema);

// Add a Chef
app.post('/api/chefs', async (req, res) => {
    const chef = new Chef({
      name: req.body.name
    });
    try {
      await chef.save();
      res.send(chef);
    } catch (error) {
      console.log(error);
      res.sendStatus(500);
    }
});

// Get a list of all chefs
app.get('/api/chefs', async (req, res) => {
    try {
      let chefs = await Chef.find();
      res.send(chefs);
    } catch (error) {
      console.log(error);
      res.sendStatus(500);
    }
});
// Get a specific chef
app.get('/api/chefs/:chefID', async (req, res) => {
    try {
      let chef = await Chef.findOne({_id:req.params.chefID});
      res.send(chef);
    } catch (error) {
      console.log(error);
      res.sendStatus(500);
    }
});
//Remove a specific chef (for internal use only)
app.delete('/api/chefs/:chefID', async (req, res) => {
    try {
        let chef = await Chef.findOne({_id:req.params.chefID});
        if (!chef) {
            res.send(404);
            return;
        }
        await chef.delete();
        res.sendStatus(200);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});
// Add a Recipe
app.post('/api/chefs/:chefID/recipes', async (req, res) => {
    try {
        let chef = await Chef.findOne({_id: req.params.chefID});
        if (!chef) {
            res.send(404);
            return;
        }
        let recipe = new Recipe({
            chef: chef,
            name: req.body.name,
            description: req.body.description,
            favorite: req.body.favorite,
            link: req.body.link,
            photoURL: req.body.photoURL,
        });
        await recipe.save();
        res.send(recipe);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});

// Get a list of all of a chefs recipes
app.get('/api/chefs/:chefID/recipes', async (req, res) => {
    try {
        let chef = await Chef.findOne({_id: req.params.chefID});
        if (!chef) {
            res.send(404);
            return;
        }
        let recipes = await Recipe.find({chef:chef});
        res.send(recipes);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});

// Get a specific recipe
app.get('/api/chefs/:chefID/recipes/:recipeID', async (req, res) => {
    try {
        let recipe = await Recipe.findOne({_id: req.params.recipeID, chef: req.params.chefID});
        if (!recipe) {
            res.send(404);
            return;
        }
        res.send(recipe);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});

// Update a specific recipe
app.put('/api/chefs/:chefID/recipes/:recipeID', async (req, res) => {
    try {
        let recipe = await Recipe.findOne({_id: req.params.recipeID, chef: req.params.chefID});
        if (!recipe) {
            res.send(404);
            return;
        }
        recipe.name = req.body.name;
        recipe.link = req.body.link;
        recipe.photoURL = req.body.photoURL;
        recipe.favorite = req.body.favorite;
        recipe.description = req.body.description;
        await recipe.save();
        res.send(recipe);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});

// Delete a specific recipe
app.delete('/api/chefs/:chefID/recipes/:recipeID', async (req, res) => {
    try {
        let recipe = await Recipe.findOne({_id: req.params.recipeID, chef: req.params.chefID});
        if (!recipe) {
            res.send(404);
            return;
        }
        await recipe.delete();
        res.send(recipe);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});

// import the users module and setup its API path
const users = require("./users.js");
app.use("/api/users", users.routes);

app.listen(3003, () => console.log('Server listening on port 3003!'));