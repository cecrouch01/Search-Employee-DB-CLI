const express = require('express');
const mysql = require('mysql2');
require('dotenv').config();


const PORT = process.env.PORT || 3001;
const app = express();

//Middleware
app.use(express.json());
app.use(express.urlencoded({ extended:true }));

//Connects to the database
const db = mysql.createConnection(
  {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
  },
  console.log('Connected to the database')
);


//GET Routes used:
//This will let the user view all departments with their id.
app.get('/api/department', (req, res) => {
  const sql = 'SELECT * from department';
  
  db.query(sql, (err, data) => {
    if(err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({
      message:'success',
      result: data
    });
  });
});

//This will view the job title, role id, the department that the role belongs to, and the salary for that role from the "Role Table"
app.get('/api/role', (req, res) => {
  const sql = 'SELECT role.id as id, title as job_title, salary, department_name FROM role LEFT JOIN department ON role.department_id = department.id';

  db.query(sql, (err, data) => {
    if(err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({
      message:'success',
      result: data
    });
  });
});

//This will view Employee ids, First Name, Last Name, Job Titles, Departments, Salaries, and Managers that the employees report to from the "Employee Table"
app.get('/api/employee', (req, res) => {
  //right now this just gets id employe and manager
  const sql ='SELECT emp.id AS id, concat(emp.first_name," ", emp.last_name) AS employee_name, title AS job_title, salary, department_name, concat(mngr.first_name," ", mngr.last_name) AS manager_name FROM employee AS emp LEFT JOIN employee AS mngr ON emp.manager_id = mngr.id LEFT JOIN roles ON emp.role_id = roles.id LEFT JOIN department on roles.department_id = department.id;'

  db.query(sql, (err, data) => {
    if(err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({
      message:'success',
      result: data
    });
  });
});

//***Bonus***
//View Employees by Manager
//View Employees by Department
//View combined salaries of deparartmental employees

//POST Routes
//Create a Department
//Create a Role
//Create an employee

//Put Routes
//Update an employee role
//***Bonus***
//Update Employee Managers

//***Bonus***
//DELETE ROUTES
//Delete Departments
//Delete Roles
//Delete Employees



app.listen(PORT, () =>
  console.log(`server Running on ${PORT}`)
);
