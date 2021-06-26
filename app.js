const express = require('express')
const app = express()
const port = 3000

const MongoClient = require('mongodb').MongoClient;
const objectId = require('mongodb').ObjectID;

const assert = require('assert');

const url = 'mongodb://localhost:27017';
const dbName='mydb';
const client= new MongoClient(url);

app.set('view engine','ejs')

app.get('/devices',(req,res)=>{ 
    var db =client.db(dbName);
    var collection = db.collection('Energy');

    var city=req.query.user_input;

    if(city=="")
    {
        collection.find({}).toArray(function (err,devicelist)
        {
            assert.equal(err,null);
            res.render('devices',{'devices':devicelist})
        });  
    }
    else
    {
        collection.find({city:city}).toArray(function (err,devicelist)
        {
            assert.equal(err,null);
            res.render('devices',{'devices':devicelist})
        }); 
    }      
})

app.get('/unique',(req,res)=>{    

    var db =client.db(dbName);
    var collection = db.collection('Energy');

    collection.distinct("type_of_food").then((ans) => {
        //res.render('unique',{'unique':ans})
        res.write("<html>");
        var t=`<head>
        <style>
          table {
            font-family: arial, sans-serif;
            border-collapse: collapse;
            width: 100%;
          }
          
          td, th {
            border: 2px solid #dddddd;
            text-align: left;
            padding: 8px;
          }
          
          tr:nth-child(odd) {
            background-color: #85c6c7;
          }
          th{
            background-color: #FFED86;
          }
          body{
            background-color: #9BC86A;
          }
          button
          {
            margin: 5px;
            padding: 6px;
            border-radius: 3px;
          }
          h2
          {
              font-family:cursive;
          }
          
          </style>  
      </head>
      <body>
      <h2>LIST OF UNIQUE CUISINES!</h2>
      <form action="/index" method="POST"><button>HOME</button></form>
      <table>
          <tr>     
            <th>CUISINES!</th> 
          </tr>  `;
          res.write(t);
        ans.forEach(x => {
            res.write("<tr>")
            res.write("<td>"+x+"</td>");
            res.write("</tr>")
        });
        res.write(`
        </table>
        </body>`);
        res.end();
    }).catch((err) => {
        console.log(err.Message);
    }) 
})

app.get('/unique2',(req,res)=>{    

    var db =client.db(dbName);
    var collection = db.collection('Energy');

    collection.distinct("city").then((ans) => {
        //res.render('unique',{'unique':ans})
        res.write("<html>");
        var t=`<head>
        <style>
          table {
            font-family: arial, sans-serif;
            border-collapse: collapse;
            width: 100%;
          }
          
          td, th {
            border: 2px solid #dddddd;
            text-align: left;
            padding: 8px;
          }
          
          tr:nth-child(odd) {
            background-color: #85c6c7;
          }
          th{
            background-color: #FFED86;
          }
          body{
            background-color: #9BC86A;
          }
          button
          {
            margin: 5px;
            padding: 6px;
            border-radius: 3px;
          }
          h2
          {
              font-family:cursive;
          }
          
          </style>  
      </head>
      <body>
      <h2>LIST OF UNIQUE CITIES!</h2>
      <form action="/index" method="POST"><button>HOME</button></form>
      <table>
          <tr>     
            <th>CITIES!</th> 
          </tr>  `;
          res.write(t);
        ans.forEach(x => {
            res.write("<tr>")
            res.write("<td>"+x+"</td>");
            res.write("</tr>")
        });
        res.write(`
        </table>
        </body>`);
        res.end();
    }).catch((err) => {
        console.log(err.Message);
    }) 
})

app.get('/filter2',(req,res)=>{
    var db =client.db(dbName);
    var collection = db.collection('Energy'); 

    var food2=parseInt(req.query.food2)

    collection.find({"rating":{$gte:food2}}).toArray(function (err,devicelist)
        {
            assert.equal(err,null);
            res.render('filter2',{'filter':devicelist})
            console.log("(Rating) Filter count: "+devicelist.length)       
        }); 

})

app.get('/filter',(req,res)=>{
    var db =client.db(dbName);
    var collection = db.collection('Energy');

    var food=req.query.food    
    
    collection.find({"type_of_food":food}).toArray(function (err,devicelist)
    {
        assert.equal(err,null);
        res.render('filter',{'filter':devicelist})
        console.log("(Type_of_food) Filter count: "+devicelist.length)
       
    });    
})

app.get('/filter4',(req,res)=>{
    var db =client.db(dbName);
    var collection = db.collection('Energy');

    var city=req.query.city    
    
    collection.find({"city":city}).toArray(function (err,devicelist)
    {
        assert.equal(err,null);
        res.render('filter',{'filter':devicelist})
        console.log("(City) Filter count: "+devicelist.length)
       
    });    
})

app.get('/filter3',(req,res)=>{
    var db =client.db(dbName);
    var collection = db.collection('Energy');

    var outcode=req.query.outcode;
    var postcode=req.query.postcode;    

    if(postcode=="")
    {   
        collection.find({$or: [ {"outcode":outcode}, {'postcode':postcode} ]}).toArray(function (err,devicelist)
        {
            assert.equal(err,null);
            res.render('filter3',{'filter':devicelist})
            console.log("(Outcode) Filter count: "+devicelist.length)
        
        }); 
    }
    else
    {
        collection.find({$and: [ {"outcode":outcode}, {'postcode':postcode} ]}).toArray(function (err,devicelist)
        {
            assert.equal(err,null);
            res.render('filter3',{'filter':devicelist})
            console.log("(Incode) Filter count: "+devicelist.length)
        
        }); 
    }   
  
})

app.get('/filter_all',(req,res)=>{
    var db =client.db(dbName);
    var collection = db.collection('Energy');

    var food=req.query.food;
    var city=req.query.city; 
    var rating=parseInt(req.query.rating);    

      collection.find({$and: [ {"type_of_food":food}, {"city":city} , {"rating":{$gte:rating}}]}).toArray(function (err,devicelist)
        {
            assert.equal(err,null);
            res.render('filter_all',{'filter':devicelist})
            console.log("(Multi) Filter count: "+devicelist.length)
        });  
})


app.post('/index',(req,res)=>{
    res.sendFile(__dirname + "/views/index.html");
})

app.get('/index',(req,res)=>{
    res.sendFile(__dirname + "/views/index.html");
})

app.post('/admin',(req,res)=>{
    res.sendFile(__dirname + "/views/admin.html");
})
app.get('/admin',(req,res)=>{
    res.sendFile(__dirname + "/views/admin.html");
})

app.get('/devices',(req,res)=>{
    res.sendFile(__dirname + "/views/devices.ejs");
})

app.get('/filter',(req,res)=>{
    res.sendFile(__dirname + "/views/filter.ejs");
})

app.get('/filter_all',(req,res)=>{
    res.sendFile(__dirname + "/views/filter_all.ejs");
})

app.get('/deletes',(req,res)=>{
    res.sendFile(__dirname + "/views/delete_req.html");
})

app.get('/adds',(req,res)=>{
    res.sendFile(__dirname + "/views/add.html");
})

app.get('/updates',(req,res)=>{
    res.sendFile(__dirname + "/views/update.html");
})


app.get('/add', function(req,res){    
    console.log(req.query.url);
    res.sendFile(__dirname + "/views/add.html");
    var item = {
        URL:req.query.url,
        address:req.query.address,
        city:req.query.city,
        name:req.query.name,
        outcode:req.query.outcode,
        postcode:req.query.postcode,
        rating:req.query.rating,
        type_of_food:req.query.type
    };

   console.log(item);

    var db =client.db(dbName);
    var collection = db.collection('Energy');    
        collection.insertOne(item ,function(err,result){
            assert.equal(null,err);
            console.log("Item inserted"); 
                       
        });        
    });

app.get('/update',function(req,res,next){
    res.sendFile(__dirname + "/views/update.html"); 
    
    var db =client.db(dbName);
    var collection = db.collection('Energy');

    var _id = req.query.id;      

    // var item = {
    //     URL:req.query.url,
    //     name: req.query.name,
    //     address: req.query.address,
    //     city:req.query.city,
    //     outcode:req.query.outcode,
    //     postcode:req.query.postcode,
    //     rating: req.query.rating,
    //     type_of_food:req.query.type
    // };      

    var name=req.query.name
    var address=req.query.address
    var city=req.query.city
    var outcode=req.query.outcode
    var postcode=req.query.postcode
    var rating=parseInt(req.query.rating)
    var type_of_food=req.query.type

    if(name!="")
    {
       collection.updateOne({"_id":objectId(_id)},{$set:{name:name}},function(err,result){
        assert.equal(null,err);
        console.log("Name Updated");    
        });
    }
    
    if(address!="")
    {
       collection.updateOne({"_id":objectId(_id)},{$set:{address:address}},function(err,result){
        assert.equal(null,err);
        console.log("Address Updated");  
        });
    }

    if(city!="")
    {
       collection.updateOne({"_id":objectId(_id)},{$set:{city:city}},function(err,result){
        assert.equal(null,err);
        console.log("City Updated");  
        });
    }  

    if(outcode!="")
    {
       collection.updateOne({"_id":objectId(_id)},{$set:{outcode:outcode}},function(err,result){
        assert.equal(null,err);
        console.log("Outcode Updated");  
        });
    }  

    if(postcode!="")
    {
       collection.updateOne({"_id":objectId(_id)},{$set:{postcode:postcode}},function(err,result){
        assert.equal(null,err);
        console.log("Postcode Updated");  
        });
    }  

    if(rating!="")
    {
       var result = collection.findOne({"_id":objectId(_id)}, function(err, result) {
        if (err) throw err;
        var avg=(rating+(result.rating))/2;        
        
        collection.updateOne({"_id":objectId(_id)},{$set:{rating:avg}},function(err,result){
        assert.equal(null,err);
        console.log("Rating Updated");  
            });
      });              
    }  

    if(type_of_food!="")
    {
       collection.updateOne({"_id":objectId(_id)},{$set:{type_of_food:type_of_food}},function(err,result){
        assert.equal(null,err);
        console.log("Food type Updated");  
        });
    }  


    //     if(_id!=null)
    //     {
    //    collection.updateOne({"_id":objectId(_id)},{$set:item},function(err,result){
    //         assert.equal(null,err);
    //         console.log("Updated");
            
    //     });
    //     }        
        
    });

app.get('/delete', function(req,res,next){
    res.sendFile(__dirname + "/views/delete.html");

    var db =client.db(dbName);
    var collection = db.collection('Energy');

    var _id = req.query.id;
    
        if(_id!=null)
        {
        collection.deleteOne({"_id":objectId(_id)},function(err,result){
            assert.equal(null,err);
            console.log("Document successfully deleted");           
        });
}
});

app.get('/del_review',(req,res)=>{ 
    var db =client.db(dbName);
    var collection = db.collection('Energy');
    collection.find({},{"_id":1,"review":1}).toArray(function (err,devicelist)
    {
        assert.equal(err,null);
        res.render('devices2',{'devices':devicelist})
    });    
    
})

app.get('/delete_req', function(req,res,next){
    res.sendFile(__dirname + "/views/delete_req.html");

    var db =client.db(dbName);
    var collection = db.collection('Energy');

    var _id = req.query.id;
    var why=req.query.why;
    
    if(_id!=null)
    {
        collection.update({ _id: objectId(_id) },{ $push: { review: why } },function(err,result){
        assert.equal(null,err);
        console.log("APPEAL REGISTERED!"); 
    });   
    }
});

app.get('/feedback', function(req,res,next){
    res.sendFile(__dirname + "/views/feedback.html");

    var _id = req.query.id;
    var feedback = req.query.feedback;

    var db =client.db(dbName);
    var collection = db.collection('Energy');

        if(_id!=null)
        {
        collection.update({ _id: objectId(_id) },{ $push: { feedback: feedback } },function(err,result){
            assert.equal(null,err);
            console.log("REVIEW COMPLETE SUCCESS!"); 
        });   
        }
});

client.connect(function(err) {
    assert.equal(null, err);
    console.log("Connection success - Mongo");

    app.listen(port,()=> console.log("App listening to post"))
})