/**
 * Created by home on 20/12/17.
 */
const express= require('express');
const bodyParser= require('body-parser');
const path= require('path');
const mysql= require('mysql');

const db= mysql. createConnection({
    host:'localhost',
    database:'myequiteeDatabase',
    user:'myequitee',
    password:'myequitee'
})
db.connect((err) => {
    if(err){
        throw err;
    }
    console.log('MySql Connected...');
});

const app=express();
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

app.use(function(req, res, next){
    res.locals.answer=[] ;
    next();
})
app.use('/myequitee', express.static(path.join(__dirname, 'public_static')));

app.get('/myequitee/about', function (req, res) {
    res.render('about')
})

app.get('/myequitee/services', function(req, res){
    res.render('services')
   })



var ans=[];
app.post('/myequitee/services', function(req, res){
    console.log(" form submitted");

        risk = req.body.risk;
        stocksreq = req.body.stocksreq;


   console.log(risk);
   console.log(stocksreq);

    db.query(`select * from RiskPrefGrowthRate where risk =${risk} ORDER BY rank  `, function(err, results, fields){
        if(err)
            throw err;
        trans= results;

       var i=0;

        while(i <stocksreq) {
            if(trans[i] !=undefined) {
                ans[i] = trans[i];
            }
        i++;
        }
         //console.log(ans);
       ans.forEach(function (answer) {
           console.log(answer.company + " " + answer.growthScore);
       })
    })
})

app.get('/myequitee/services/submit', function(req,res){

    res.render('result', {
       answer:ans
    })
})

app.listen(1234, function(){
    console.log("listening to requests on port number 1234")
})


