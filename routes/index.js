var express = require('express');
var router = express.Router();
var userModule =require('../modules/meds');
var medModule =require('../modules/med_external');
var jwt = require('jsonwebtoken');
var meddata=medModule.find({});
if (typeof localStorage === "undefined" || localStorage === null) {
  var LocalStorage = require('node-localstorage').LocalStorage;
  localStorage = new LocalStorage('./scratch');
}


/* GET home page. */
router.get('/Home', checklogin,function(req, res, next) {
 
  var admin=localStorage.getItem('loginName');
  meddata.exec(function(err,data){
    if(err) throw err;
    res.render('index', { title: 'Records',records:data ,admin:admin});
  });
 
});
router.post('/Home', function(req, res, next) {
  var admin=localStorage.getItem('loginName');
  var dmonth=req.body.expirymonth;
  var dyear=req.body.expiryyear;
  if(dmonth!='' && dyear!='')
  {
    var filterpara={
      $and:[{expirymonth:dmonth},{expiryyear:dyear}]
 }
}
 else if( dyear!='' && dmonth=='')
 {
   var filterpara={}

   
 }
 else if(dmonth!='' && dyear!='')
 {
   var filterpara={}

   
 }
 else if(dmonth=='' && dyear=='')
 {
   var filterpara={}

 }
 else
 {
   var filterpara={}
 }
 
  var search_result=medModule.find(filterpara);

  search_result.exec(function(err,data){
    if(err) throw err;
    res.render('index', { title: 'Dashboard',records:data ,admin:admin});
  });
 
});
//-------------------search post method---------------------------//
router.post('/search-medicine', function(req, res, next) 
{
 
  var filtername=req.body.medicine;
  var filterbatch=req.body.bnumber;
  
 if(filtername!='' && filterbatch!='')
 {
   var filterpara={
     $and:[{medicine:filtername},{batchnumber:filterbatch}]
    }
 }else if(  filterbatch=='' && filtername!='' )
 {

   var filterpara={medicine:filtername}
 }
 else if(filtername=='' && filterbatch!='')
 {

   var filterpara={batchnumber:filterbatch}
 } 
 else if(filtername=='' && filterbatch=='')
 {
  var filterpara={};
 }
 else
 {
   var filterpara={};
 }
 var search_result=medModule .find(filterpara);

 search_result.exec(function(err,data){
   if(err) throw err;
   res.render('searchmed', { title: 'Records',records:data,success:'' });
 });

});
router.get('/delete-medicine', checklogin,function(req, res, next) {
  meddata.exec(function(err,data){
    if(err) throw err;
    res.render('deletemonth', { title: 'Delete',records:data,success:'' });
  });
 
});
router.post('/delete-medicine', function(req, res, next) {
   var dmonth=req.body.expirymonth;
   var dyear=req.body.expiryyear;
   if(dmonth!='' && dyear!='')
   {
     var filterpara={
       $and:[{expirymonth:dmonth},{expiryyear:dyear}]
  }
}
  else if(dmonth=='' && dyear!='')
  {
    var filterpara={}

    
  }
  else if(dmonth!='' && dyear!='')
  {
    var filterpara={}

    
  }
  else if(dmonth=='' && dyear=='')
  {
    var filterpara={}

  }
  else
  {
    var filterpara={}
  }
  
  var search_result=medModule .find(filterpara);

 search_result.exec(function(err,data){
   if(err) throw err;
   res.render('deletemonth', { title: 'Delete',records:data,success:'' });
 });
});



router.get('/search-medicine',checklogin, function(req, res, next) {
  meddata.exec(function(err,data){
    if(err) throw err;
    res.render('searchmed', { title: 'Search',records:data,success:''});
   });
});

router.get('/addmed',checklogin, function(req, res, next) {
  meddata.exec(function(err,data){
       if(err) throw err;
        res.render('Addmed', { title: 'Save medicine',records:data,success:''});
       });
});
router.post('/addmed', function(req, res, next) {
  
    var medicine=req.body.medicine;
    var sellername=req.body.sellername;
    var batchnumber=req.body.batchnumber;
    var expirymonth=req.body.expirymonth;
    var expiryyear=req.body.expiryyear;

  var medDetails= new medModule({
    medicine:medicine,
    sellername:sellername,
    batchnumber:batchnumber,
    expirymonth:expirymonth,
    expiryyear:expiryyear,
    
  });
  medDetails.save(function(err,data){
    if(err) throw err;
    meddata.exec(function(err,data){
      if(err) throw err;
       res.render('Addmed', { title: 'Save medicine',records:data,success:'Save'});
      });

  })
});
//-------login middleware------
function checklogin(req,res,next){
  var checklog=localStorage.getItem('loginId');
  try {
    var decoded = jwt.verify(checklog, 'idtoken');
  } catch(err) {
    res.redirect('/');
  }
   next();
}



router.post('/',checkuserlogin,function(req, res, next) {
  var name=req.body.username;
  var password=req.body.password;
 
  var checkidentity=userModule.findOne({username:name});
  checkidentity.exec((err,data)=>{
    if(err) throw err
    var getpass=data.password;
    if(getpass==password)
    { var user_id=data._id;
      var token = jwt.sign({ get_id: user_id}, 'idtoken');
      localStorage.setItem('loginId', token);
      localStorage.setItem('loginName', name);
      meddata.exec(function(err,data1){
      
        if(err) throw err;
        res.redirect('/Home')
       });
      
    }
    else{
      res.render('Signin', { title: 'signin',msg:'Invalid  password'});
    }
  });
    


  
});
function checkuserlogin(req,res,next){
  var username=req.body.username;
  var checkuser=userModule.findOne({username:username});
  checkuser.exec((err,data)=>{
    if(err) throw err
    if(!data)
    {
      return res.render('Signin',{ title: 'signin',msg:'username not exists'});
    }
    next();
  });
};
router.get('/',function(req, res, next) {
 
  res.render('Signin', { title: 'Login',msg:'' });
  
});
router.get('/logout',checklogin,function(req, res, next) {
    localStorage.removeItem('loginId');
    localStorage.removeItem('loginName');
    res.redirect('/');
});

//---------------signup middleware-----------
function checkEmail(req,res,next){
  var email=req.body.email;
  var checkemail=userModule.findOne({email:email});
  checkemail.exec((err,data)=>{
    if(err) throw err
    if(data)
    {
      return res.render('signup',{ title: 'signup',msg:'email already exists'});
    }
    next();
  });

};
function checkusername(req,res,next){
  var username=req.body.username;
  var checkuser=userModule.findOne({username:username});
  checkuser.exec((err,data)=>{
    if(err) throw err
    if(data)
    {
      return res.render('signup',{ title: 'signup',msg:'username already exists'});
    }
    next();
  });
};
router.get('/signup',checkusername,function(req, res, next) {
  res.render('Signup', { title: 'Express',msg:'' });
});

router.post('/signup',checkusername,checkEmail,function(req, res, next) {
  var username=req.body.username;
  var email=req.body.email;
  var password=req.body.password;
  var confirmpassword =req.body.confirmpassword;
  if(password!=confirmpassword)
  {
    res.render('signup', { title: 'signup',msg:'password not matched'});
  }
  else
  {
  var userDetails= new userModule({
    username:username,
    email:email,
    password:password,
    
  });
  userDetails.save((err,data)=>
  {
    if (err) throw err
    res.render('signup', { title: 'signup',msg:'Account Created'});
  })
  }
});
router.get('/edit/:id',checklogin,function(req,res,next)
{
  var id=req.params.id;
  var edit = medModule.findById(id)
  edit.exec(function(err,data){
    if(err) throw err;
    res.render('edit', { title: ' Edit Records',records:data ,success:''});
  }); 
  
});
router.post('/update',function(req,res,next)
{
  var updatedata = medModule.findByIdAndUpdate(req.body.id,{
    medicine:req.body.medicine,
    sellername:req.body.sellername,
    expirymonth:req.body.expirymonth,
    batchnumber:req.body.batchnumber,
    expiryyear:req.body.expiryyear,
  });
  updatedata.exec(function(err,data){
    if(err) throw err;
    var edit = medModule.findById(req.body.id)
    edit.exec(function(err,data){
      if(err) throw err;
      meddata.exec(function(err,data){
        if(err) throw err;
        res.render('Addmed', { title: 'Save Medicine',records:data ,success:'updated'});
       });
      //res.render('Addmed', { title: 'Save Medicine',records:data ,success:'updated'});
    }); 
  
  });
  
});
//----------delete-------------------//
router.get('/delete/:id',checklogin,function(req,res,next){
  var id=req.params.id;
  var del = medModule.findByIdAndDelete(id)
  del.exec(function(err){
    if(err) throw err;
    meddata.exec(function(err,data){
      if(err) throw err;
      res.render('deletemonth', { title: 'Delete',records:data ,success:'Deleted' });
     });
    
  });

});
router.get('/search-delete/:id',checklogin,function(req,res,next){
  var id=req.params.id;
  var del = medModule.findByIdAndDelete(id)
  del.exec(function(err){
    if(err) throw err;
    meddata.exec(function(err,data){
      if(err) throw err;
      res.render('searchmed', { title: 'Search Medicine',records:data,success:'Deleted'  });
     });
    
  });

});
router.get('/Add-delete/:id',checklogin,function(req,res,next){
  var id=req.params.id;
  var del = medModule.findByIdAndDelete(id)
  del.exec(function(err){
    if(err) throw err;
    meddata.exec(function(err,data){
      if(err) throw err;
      res.render('Addmed', { title: 'Save Medicine',records:data,success:'Deleted' });
     });
    
  });

});
//////////////////////////////////////
//router.get('/test',checklogin, function(req, res, next) {
//  meddata.exec(function(err,data){
//    if(err) throw err;
//    res.render('test', { title: 'relax',records:data,success:''});
//   });
//});

module.exports = router;
