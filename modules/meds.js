var mongoose = require('mongoose');

uri='mongodb+srv://sagar:sagar2697@cluster0-sjxye.mongodb.net/test?retryWrites=true&w=majority';
mongoose.connect(uri, {useNewUrlParser: true ,useUnifiedTopology: false }, () => { }).catch(err => console.log(err));
var conn=mongoose.connection;
var userSchema = new mongoose.Schema({
    username:
    {
        type:String,
        required:true,
        index:
        {
            unique:true,
        }
    },
    email:
    {
        type:String,
        required:true,
        index:
        {
            unique:true,
        }
    },
    password:
    {
        type:String,
        required:true,
        
    },
    date:
    {
        type:Date,
        default:Date.now
    },
    
  });

var userModel = mongoose.model('users', userSchema);
module.exports=userModel;
