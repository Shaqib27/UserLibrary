const express = require("express");
const Path = require("path");
const app = express();
const mongoose = require("mongoose");
const userModel = require("./model/user");
const user = require("./model/user");

app.set('view engine', "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(Path.resolve('public')))

mongoose.connect('mongodb://127.0.0.1:27017/UserLibrary')
    .then(() => console.log('Connected!'))
    .catch(() => console.log("Failed to connect !"));

app.get('/', (req, res) => {
    res.render('home')
})
app.get('/user', async (req, res) => {
    const alluser = await userModel.find();
    res.render('user', { user: alluser });
})
app.get('/edit/:userid', async (req, res) => {
    let user = await userModel.findOne({ _id: req.params.userid })
    res.render("edit", { user })
})

app.post("/create", async (req, res) => {
    let { name, email, image } = req.body;

    const createUser = await userModel.create({
        name,
        email,
        ImageURl: image
    });
    res.redirect('/user');
});
app.post('/edit/:userid', async (req, res) => {
    let { name, email, image } = req.body;
    let user = await userModel.findOneAndUpdate({ _id: req.params.userid }, { name, email, image }, { new: true });
    res.redirect('/user');
})
app.get('/delete/:id', async (req, res) => {
    await userModel.findByIdAndDelete(req.params.id);
    res.redirect('/user');
});

app.listen(7000, () => console.log(`server is running on 7000`));
