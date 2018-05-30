var express = require('express');
var bodyParser = require('body-parser');
var PORT = 7000;
var MongoClient = require('mongodb').MongoClient;
var app = express();

app.use(bodyParser.urlencoded({
extended: true
}));

app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));

//Enabling CORS
app.use(function(req, res, next) {
res.header("Access-Control-Allow-Origin", "*");
res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
next();
});

//app.use(express.session());  

app.get('/', function(req, res) {
res.sendFile(__dirname + '/index.html');
});


MongoClient.connect("mongodb://lakshmi:lakshmi@ds157258.mlab.com:57258/lakshmidb", function(err, db) {
if(err) { 
return console.dir(err); 
}

else
{
console.log("DataBase Connected")

var coll=db.collection('assign');
var collection = db.collection('employedetails'); 
var collection2 = db.collection('ionic')


app.post('/adminlogin', function(req, res) 

{ 
var aname=req.body.aname;
var apwd=req.body.apwd;
console.log(aname);
console.log(apwd);
collection.find({ "username": aname,"password":apwd }).toArray(function(err, result) 
{
console.log(result);

if(result)
{
response={
"output":result
}
console.log(response)
res.json(response)
}
else
{
error={
"output":err
}
console.log(error)
res.json(error);
}
})

})

//dashboard

app.get('/retrieveById',function(req,res)
{
	var id=req.query.Project;
	console.log(id);
	collection2.find({"Project":id}).toArray(function(err, result) 
	{

	if(result)
	{
		response={
				"output":result
				 }
				console.log(response)
				res.json(response)
	}
	else
	{
		error={
				"output":err
			  }
				console.log(error)
				res.json(error);
	}
	})
})


//emp search

app.get('/employeesearch', function(req, res) {
var name =req.query.name

console.log("Name" +name);
collection2.find({'Name':new RegExp('^'+name)}).toArray(function(err, result) {
if(result)
{
response={
"output":result
}
console.log(response);
res.json(response);
}
else
{
error={"error":err}
console.log(error)
res.json(error)
}
})
})













app.post('/login', function(req, res) 

{ 
var uname=req.body.uname;
var pwd=req.body.pwd;
console.log(uname);
console.log(pwd);

collection.find({ "email": uname,"password":pwd }).toArray(function(err, result) 
{
console.log(result);

if(result)
{
response={
"output":result
}
console.log(response)
res.json(response)
}
else
{
error={
"output":err
}
console.log(error)
res.json(error);
}
})

})




//get profile

 
app.post('/getprofile', function(req, res) 

{ 
console.log('inside getprofile app')
var uname=req.body.mailid;
//var pwd=req.body.pwd;
console.log(uname);
//console.log(pwd);

collection.find({ "email": uname }).toArray(function(err, result) 
{
console.log(result);

if(result)
{
response={
"output":result
}
console.log(response)
res.json(response)
}
else
{
error={
"output":err
}
console.log(error)
res.json(error);
}
})

})










app.post('/reportsTo', function(req, res) 

{	
	var email=req.body.email;
	
console.log(email);

	collection.find({ "reportsTo": email }).toArray(function(err, result) 
	{
		console.log(result);

	if(result)
	{
		response={
				"output":result
				 }
				console.log(response)
				res.json(response)

	}
	else
	{
		error={
				"output":err
			  }
				console.log(error)
				res.json(error);
	}
	})
		
 })

 
 // assign task
 
 app.post('/AssignTask', function(req, res) 

{	
	var email=req.body.mail;
	var question=req.body.qsn;
	var leadid=req.body.leadid;
	var a="";
	var b="";
	
console.log(email+""+question+""+leadid);

coll.insert({"assignedto":email,"taskdetails":question,"assignedby":leadid,"comments":a,"status":b},function(err,mani){
	if(err)
	{
		error={"output":err}
		res.json(error)
	}
	else
	{
		response={"output":mani}
		res.json(response)
	}
})
		
 })
 
 // getting Task
app.post('/gettask', function(req, res) 

{	
	var email=req.body.mailid;
	
console.log(email);

coll.find({"assignedto":email}).toArray(function(err,mani){
	if(err)
	{
		error={"output":err}
		res.json(error)
		console.log(error)
	}
	else
	{
		response={"output":mani}
		res.json(response)
		console.log(response)
	}
})
		
 })

 
 

app.post('/gets',function(req,res){
	
	var email=req.body.rmail;
	console.log(email);
	
	coll.find({ "assignedby": email }).toArray(function(err, result) 
	{
		console.log(result);

	if(result)
	{
		response={
				"output":result
				 }
				console.log(response)
				res.json(response)

	}
	else
	{
		error={
				"output":err
			  }
				console.log(error)
				res.json(error);
	}
	})
	
	
})


 app.post('/updatetasks', function(req, res) 

{	
	var to=req.body.to;
	var by=req.body.by;
	var details=req.body.details;
	var comments=req.body.comments;
	var status=req.body.status;
	
console.log(to+""+by+""+details+""+comments+""+status);

coll.updateOne({"taskdetails":details},{$set:{"comments":comments,"status":status}},function(err,mani){
	if(err)
	{
		error={"output":err}
		res.json(error)
		console.log(error)
	}
	else
	{
		response={"output":mani}
		res.json(response)
		console.log("updated"+JSON.stringify(response))
	}
})
		
 })
 

}//closing else
}); //closing database

app.listen(PORT);
console.log('Server is running on port ' + PORT);