
let express = require("express");

let app = express();

app.use(express.json());

app.use(function (req, res, next) {

res.header("Access-Control-Allow-Origin","*");

res.header(

"Access-Control-Allow-Methods",

"GET, POST, OPTIONS, PUT, PATCH, DELETE, HEAD"

);

res.header(

"Access-Control-Allow-Headers",

"Origin, X-Requested-With, Content-Type, Accept"

);

next();

});
var port=process.env.port || 2410;
app.listen(port, () => console.log(`Listening on port ${port}!`));

let {empsData}=require("./EmpsData.js");
const {Client} =require("pg");
const client =new Client({
    user:"postgres",
    password:"RaghavSatyam@123",
    database:"postgres",
    port:5432,
    host:"db.hlxpewgfafdenkpbknuf.supabase.co",
    ssl:{rejectUnauthorized:false},
});
    client.connect(function(res,error){
    console.log(`Connected!!!`);
});

app.get("/users",function(req,res,next){
    console.log("inside /users get api");
    const query =`SELECT * FROM users`;
    client.query(query,function(err,result){
        if(err){res.status(400).send(err);}
        res.send(result.rows);
        client.end();
    });
});
app.post("/user", function (req, res, next) {

console.log("Inside post of user");
 var values =Object.values(req.body);
console.log(values);

const query =`
INSERT INTO users (email, firstname, lastname, age)VALUES ($1,$2,$3,$4)`;

client.query(query, values, function (err, result) { if (err) {

res.status(400).send(err);

} //console.log(result);

res.send(`${result.rowCount} insertion successful`);

});

});
var format = require('pg-format');
app.get("/resetData",function(req,res,next){
    const query1="DELETE FROM employees";
    client.query(query1,function(err,result){
        if(err) {res.status(400).send(err);}
        else {
            console.log("Successfully daleted. Affected rows", result.rowCount);
            var values=empsData.map((k,index)=>[k.empCode,k.name,k.department,k.designation,k.salary,k.gender]);
            client.query(format("INSERT INTO employees(empCode,name,department,designation,salary,gender) VALUES %L",values),[],(err,result)=>{
             if(err)console.log(err)
             else{
                // console.log(result)
             res.send(result.rows);}
            });
        }
    });
});
app.get("/employees",function(req,res,next){
    let department=req.query.department;
    let designation=req.query.designation;
    let gender=req.query.gender;
    const query="SELECT * FROM employees";
    client.query(query,function(err,result){
         if(err){res.status(400).send(err)}
         else{
            
            if(department){
                result.rows=result.rows.filter(k=>k.department===department);
            }
            if(designation){
                result.rows=result.rows.filter(k=>k.designation===designation);
            }
            if(gender){
                result.rows=result.rows.filter(k=>k.gender===gender);
            }
            // console.log(result.rows);
            res.send(result.rows);
        }
    })
    // client.end();
});
app.get("/employees/dept/:department",function(req,res,next){
    let department=req.params.department;
    // console.log(department);
    const sql="SELECT * FROM employees WHERE department=($1)";
    client.query(sql,[department],function(err,result){
         if(err){res.status(400).send(err)}
         else{
            // console.log(result);
            res.send(result.rows);
         }
    })
});
app.get("/employees/gen/:gender",function(req,res,next){
    let gender=req.params.gender;
    const sql="SELECT * FROM employees WHERE gender=($1)";
    client.query(sql,[gender],function(err,result){
          if(err){res.status(400).send(err)}
         else{
            // console.log(result);
            res.send(result.rows);
         }
    })
});
app.get("/employees/desig/:designation",function(req,res,next){
    let designation=req.params.designation;
    const sql="SELECT * FROM employees WHERE designation=($1)";
    client.query(sql,[designation],function(err,result){
          if(err){res.status(400).send(err)}
         else{
            // console.log(result);
            res.send(result.rows);
         }
    });
});
app.get("/employees/:empCode",function(req,res,next){
    let empCode=req.params.empCode;
    const sql="SELECT * FROM employees WHERE empCode=($1)";
    client.query(sql,[empCode],function(err,result){
        if(err){res.status(400).send(err)}
        else{
            // console.log(result);
            res.send(result.rows);
        }
    });
});
app.post("/employees",function(req,res,next){
    var values =Object.values(req.body);
    console.log(values);
    const sql="INSERT INTO employees(empCode,name,department,designation,salary,gender) VALUES ($1,$2,$3,$4,$5,$6)";
    client.query(sql, values, function (err, result)
     {  if(err){res.status(400).send(err)}

     else{
        // console.log(result);
        res.send(` insertion successful`)};
      });
});
app.put("/employees/:empCode",function(req,res,next){
    let empCode=+req.params.empCode;
    let body=req.body;
    const sql=`UPDATE employees SET name=$1,department=$2,designation=$3,salary=$4,gender=$5 WHERE empCode=$6`;
    let values=[body.name,body.department,body.designation,body.salary,body.gender,empCode];
    client.query(sql,values,function(err,result){
       if(err){res.status(400).send(err)}
        else{
            // console.log(result);
            res.send("Updated Successfully");
        }
    });

});
app.delete("/employees/:empCode",function(req,res,next){
    let empCode=+req.params.empCode;
    const sql="DELETE FROM employees WHERE empCode=($1)";
    client.query(sql,[empCode],function(err,result){
         if(err){res.status(400).send(err)}
        else{
            // console.log(result);
            res.send("DELETED Successfully");
        }
    });

});
