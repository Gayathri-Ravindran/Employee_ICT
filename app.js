// Task1: initiate app and run server at 3000
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const PORT = 3000;

const path=require('path');
app.use(express.static(path.join(__dirname+'/dist/FrontEnd')));



// Task2: create mongoDB connection 

mongoose.connect('mongodb+srv://gayathri:Gayathri@cluster0.txyrzxg.mongodb.net/employee?retryWrites=true&w=majority')




const employeeSchema = new mongoose.Schema({
    name:String,
    location:String,
    position:String,
    salary:Number,
    eid:Number
});
// model
const Employee = mongoose.model('Employee',employeeSchema);
// module.exports = emplData;
app.use(express.json());
//Task 2 : write api with error handling and appropriate api mentioned in the TODO below

//TODO: get data from db  using api '/api/employeelist'

app.get('/api/employeelist',async (req,res)=>{
   try {
    const employees= await Employee.find();
    res.status(200).send(employees);

   } catch (error) {
    // res.send(error);
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
   }
       
})



//TODO: get single data from db  using api '/api/employeelist/:id'

app.get('/api/employeelist/:id', async(req,res)=>{
    try {
        const employee = await Employee.findOne({ eid: req.params.id });
        if(!employee){
            return res.status(404).json({ message: 'Employee not found' });
        }
        res.status(200).send(employee);
    } catch (error) {
        res.status(500).send('Error');
        console.log(error)
    }
});



//TODO: send data from db using api '/api/employeelist'
//Request body format:{name:'',location:'',position:'',salary:''}

app.post('/api/employeelist', async (req, res) => {
    try {
        const addData = req.body;
        const newEmployee = new Employee(addData);
        await newEmployee.save();
        res.status(201).send(newEmployee);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Error');
    }
});




//TODO: delete a employee data from db by using api '/api/employeelist/:id'
app.delete('/api/employeelist/:id', async (req, res) => {
    try {
        const deletedEmployee = await Employee.findOneAndDelete({ eid: req.params.id });
        if (!deletedEmployee) {
            res.status(404).send('Employee not found');
            return;
        }
        res.status(204).end();
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Error');
    }
});




//TODO: Update  a employee data from db by using api '/api/employeelist'
//Request body format:{name:'',location:'',position:'',salary:''}

app.put('/api/employeelist/:id', async (req, res) => {
    const { name, location, position, salary } = req.body;
    const employeeId = req.params.id;

    try {
        const updatedEmployee = await Employee.findOneAndUpdate(
            { eid: employeeId },
            { name, location, position, salary },
            { new: true }
        );

        if (!updatedEmployee) {
            return res.status(404).json({ error: 'Employee not found' });
        }

        res.status(200).json(updatedEmployee);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

//! dont delete this code. it connects the front end file.
app.get('/*', function (req, res) {
    res.sendFile(path.join(__dirname + '/dist/Frontend/index.html'));
});

app.listen(PORT,(req,res)=>{
    console.log(`server run on ${PORT}`);
})

