var mongoose = require('mongoose');
uri='mongodb+srv://sagar:sagar2697@cluster0-sjxye.mongodb.net/test?retryWrites=true&w=majority';
mongoose.connect(uri, {useNewUrlParser: true ,useUnifiedTopology: false }, () => { }).catch(err => console.log(err));


var conn=mongoose.connection;
var medicineSchema = new mongoose.Schema({
    medicine:String,
    sellername:String,
    batchnumber:String,
    expirymonth:String,
    expiryyear:String,
    date:
    {
        type:Date,
        default:Date.now(),
        format:"%Y-%m-%d",
    }
  
  });



  var medModel = mongoose.model('meds', medicineSchema);
  module.exports=medModel;