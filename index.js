const express = require('express')
const cors = require("cors")
const fs = require("fs");
const bodyparser = require("body-parser");
const data = require('./data');
const port = process.env.PORT || 2000;


const app = express();
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended:true}));
app.use(bodyparser.json())
app.use(bodyparser.urlencoded({extended:true}))


// GET API 
app.get("/",(req, res)=>{
    res.send(`server is ready on the port ${port}`)
})


// Read file 
let currentData = [];
try {
    currentData = require("./data")
    
} catch (error) {
    console.log("error reading data.js", error)
}


// Student Data Post API 
app.post("/studentdata",(req, res)=>{
const {
    studentName,
    fatherName,
    enrollmentNumber,
    course,
    grade,
    date
} = req.body;

if (enrollmentNumber==="") {
    return res.status(400).send("Fill in all the fields");   
}


const isenrollmentNumDuplicate = currentData.some(data=>data.enrollmentNumber===enrollmentNumber);
if (isenrollmentNumDuplicate) {
    return res.status(400).send("Enrollment Already exists");   
}


// Generate index number 
const index = currentData.length;

const newData = {
    index,
    studentName,
    fatherName,
    enrollmentNumber,
    course,
    grade,
    date
};
console.log("Recieved form data",newData)
currentData.push(newData);

fs.writeFile("data.js",`module.exports = ${JSON.stringify(currentData, null, 2)}`, (err)=>{
    if (err) {
        console.log("error writing data.js", err);
        res.status(500).send("error saving data")
    }else{
        res.send("data saved success")
    }
})
})


// Student Data Search API
app.get("/search",(req, res)=>{ 
    const {enrollmentNumber} = req.query;
const newdata = {enrollmentNumber}
    console.log("new data is"+newdata)

    // Find Data 
    const searchData = currentData.find(data=>data.enrollmentNumber === enrollmentNumber);
    if (searchData) {
        res.json(searchData)
    }else{
        res.status(404).send("Data not found")
    }
})



app.listen(port,()=>{
    console.log(`server is ready on the port ${port}`)
})