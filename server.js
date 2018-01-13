var express = require("express");
var bodyParser= require("body-parser");
var path= require("path");
var app=express();

// app.use("*/css",express.static('css'));
// app.use("*/js",express.static('js'));

app.use(express.static(__dirname+ '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

/*app.get('/',function(req,res){
   
});*/
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

const MongoClient= require('mongodb').MongoClient;
const mongoURL='mongodb://localhost:27017/techstitution';
const objectId= require('mongodb').ObjectId;

MongoClient.connect(mongoURL, function(err, database){
    
    if(err){
        console.log(err);
    }else{
        console.log('MongoDB Connected!');

    }
    qkmk=database.collection('qkmk');

});

app.get('/edit/:id',function(req,res){
    var title="Edito të dhënat";
    var id=req.params.id;
    qkmk.findOne({_id: objectId(id)},function(err,result){
        if(err)
        {
            console.log(err);
        }
        res.render('edit',{title:title, doc:result})
    });

});

app.post('/update/:id', function(req,res){
    var data= req.body;
    var id = objectId(req.params.id);
    qkmk.updateOne({ _id:id}, {$set:data}, 
        function(err,result){
            if(err){
                console.log(err);
            }
            res.redirect('/show');
        });
});

app.get("/delete/:id",function(req,res){
    var data=req.body;
    var id = objectId(req.params.id);
    qkmk.deleteOne({_id:id}, function(err,result)
    {
        if (err){
            console.log(err);
        }
        res.redirect('/show');
    });
});

app.get('/',function(req,res) {
 var title='Forma e regjistrimit të pikave kufitare';
           res.render('index', {title: title});

});

app.get('/show',function(req,res){
var title="Lista me të dhëna";
qkmk.find({}).toArray(function(err,docs){
if (err)
{
console.log(err);
}
res.render('show',{title:title, docs:docs});

});
});


app.get('/chart/:id',function(req,res) {
    var title = 'Vizualizimet';
    var id = req.params.id;
    qkmk.findOne({_id: objectId(id)},function(err,docs){
        if(err) {
            console.log(err);
            throw err;
        }
        console.log(docs);
        res.render('chart', {title: title, docs:docs});    
    });
});


app.post('/add',function(req,res){
var data=req.body;
qkmk.insert(data,function(err,result){
    if(err){
        console.log(err);
    }
    res.redirect('/');
});
});


app.get('/exercise',function(req,res){
    var projects=[{id:1, name:"vesa"},
                    {id:2, name:"erza"},
                    {id:3, name:"eriona"},
                    ];
                    
                    var projects1=[{nr:1,emri:"vesa"},
                                    {nr:2,emri:"diellza"},];
                    res.render('exercise',{projects:projects},{projects1:projects1}); 
});


app.get('*',function(req,res){
    res.send('Not Found!');
});


app.listen(3001,function(){
   console.log('Navigate to http://localhost:3001')
});