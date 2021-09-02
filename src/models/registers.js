const mongoose=require('mongoose');

const employeeSchema=new mongoose.Schema({
    name: {
        type:String,
        required: true
    },
    email:{
        type:String,
        required: true,
        unique: true
    },
    username:{
        type:String,
        required: true,
        unique: true
    },
    password:{
        type:String,
        required: true
    }
})

const Register=new mongoose.model("Register",employeeSchema);  //name of model should always be singular and starting capital

module.exports = Register;