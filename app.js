const express = require("express")
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const app = express();
const PORT = process.env.PORT || 3000;

mongoose.connect("mongodb://localhost:27017/userRegistration")
var db=mongoose.connection
db.on('error', ()=> console.log("Error in Connecting to Database"))
db.once('open', ()=> console.log("Connected to Database"))

 const userSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: String,
    password: String,
    confirmPassword: String
});

const User = mongoose.model('User', userSchema);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get ("/", (req, res) => {
    res.sendFile(__dirname + "/views/index.html");
})

app.post("/register", async (req, res) => {
    try{
        const {firstName, lastName, email, password, confirmPassword} = req.body;

        const existingUser = await User.findOne({email : email});
        if (!existingUser){
            const newUser = new User({
                firstName,
                lastName,
                email,
                password,
                confirmPassword
            });
            await newUser.save();
            res.redirect("/success");
        }
        else{
            console.log("User already exist");
            res.redirect("/error");
        }
}
    catch (error) {
        console.log(error);
        res.redirect ("/error");
    }
})

app.get("/success", (req, res)=>{
    res.sendFile (__dirname + "/views/success.html") ;
})
   app.get("/error", (req, res)=>{
    res.sendFile (__dirname + "/views/error.html") ;
})

app.listen(PORT, ()=>{
    console.log(`server is running on port ${PORT}`);
})