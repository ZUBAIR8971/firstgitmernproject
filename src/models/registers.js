const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
    firstName: {
       type: String,
       required: true,
    },
    lastName: {
       type: String,
       required: true,
    },
    phone: {
        type: Number,
        required: true,  
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    confirmPassword: {
        type: String,
        required: true,
    },
    tokens: [{
       token: {
         type: String,
         required: true,
       }
    }]
});


                //<<<<<<<<<<<<<<MiddleWare>>>>>>>>>>>>>>>>>

        // Generate Token, To use cookies and JsonWebToken
userSchema.methods.generateAuthToken = async function(){
   try {
       console.log(this._id);
       const token = jwt.sign({_id:this._id.toString()}, process.env.SECRET_KEY);
       this.tokens = this.tokens.concat({token:token});
       await this.save();
       return token;
   } catch (err) {
       res.send(err);
       console.log(err);
   }
}
 
        // To bcrypt the data
userSchema.pre("save", async function(next){
    if(this.isModified("password")){
        // const passwordHash = await bcrypt.hash(password, 10); 
        // console.log(`the current password is ${this.password}`);
        this.password = await bcrypt.hash(this.password, 10);
        // console.log(`the current password is ${this.password}`);

        // this.confirmPassword = undefined;  // to not show confirmPassword field in database
        this.confirmPassword = await bcrypt.hash(this.password, 10); 
    }

    next();
})

               //<<<<<<<<<<<<<<>>>>>>>>>>>>>>>>>

const Register = new mongoose.model("Register", userSchema);

module.exports = Register;