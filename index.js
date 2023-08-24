const mysql = require('mysql2');
require('dotenv').config();
const inquirer = require('inquirer');

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

function start(){
  inquirer.prompt([
    {
      type: 'list',
      name: 'choices',
      message: 'What action would you like to take?',
      choices: ['View all Departments', 'View all Roles', 'View all Employees', 'View Employees by Manager', 'View Employees by Department', 'View the combined salaries of a Department', 'Add Department', 'Add Role', 'Add Employee', 'Update Employee Role', "Update an Employee's Manager", 'Delete a Department', 'Delete a Role', 'Delete an Employee', 'Quit']
    }
  ]).then((res) => {
    switch (res.choices) {
      case 'View all Departments':
        viewDepartments()
        break;
      case 'View all Roles':
        viewRoles()
        break;
      case 'View all Employees':
        viewEmployees()
        break;
      case 'View Employees by Manager':
        viewEmployeesByManager()
        break;
      case 'View Employees by Department':
        viewEmployeesByDepartment()
        break;
      case 'View the combined salaries of a Department':
        viewCombinedSalaries()
        break;
      case 'Add Department':
        addDepartment()
        break;
      case 'Add Role':
        addRole()
        break;
      case 'Add Employee':
        addEmployee()
        break;
      case 'Update Employee Role':
        updateEmployeeRole()
        break;
      case "Update an Employee's Manager":
        updateEmployeeManager()
        break;
      case 'Delete a Department':
        deleteDepartment()
        break;
      case 'Delete a Role':
        deleteRole()
        break;
      case 'Delete an Employee':
        deleteEmployee()
        break;
      default: 
        db.end()
        break;
    }
  })
}
//"GET" Routes used:
//This will let the user view all departments with their id.
function viewDepartments(){ 
  const sql = 'SELECT * from department;';
    
    db.query(sql, (err, data) => {
      if(err) {
        console.err(err);
        return;
      }
      console.table(data);
      start();
    });
};

// //This will view the job title, role id, the department that the role belongs to, and the salary for that role from the "Role Table"
function viewRoles(){
  const sql = 'SELECT roles.id as id, title as job_title, salary, department_name FROM roles LEFT JOIN department ON roles.department_id = department.id;';

  db.query(sql, (err, data) => {
    if(err) throw err
    console.table(data);
    start();
  });
  
};

//This will view Employee ids, First Name, Last Name, Job Titles, Departments, Salaries, and Managers that the employees report to from the "Employee Table"
function viewEmployees(){
  const sql ='SELECT emp.id AS id, concat(emp.first_name," ", emp.last_name) AS employee_name, title AS job_title, salary, department_name, concat(mngr.first_name," ", mngr.last_name) AS manager_name FROM employee AS emp LEFT JOIN employee AS mngr ON emp.manager_id = mngr.id LEFT JOIN roles ON emp.role_id = roles.id LEFT JOIN department on roles.department_id = department.id;'

  db.query(sql, (err, data) => {
    if(err) throw err
    console.table(data);
    start();
  });
};

//View Employees by Manager
async function viewEmployeesByManager(){
  const employeeInfo = await db.promise().query('SELECT emp.id AS id, concat(emp.first_name," ", emp.last_name) AS employee_name, title AS job_title, salary, department_name, concat(mngr.first_name," ", mngr.last_name) AS manager_name FROM employee AS emp LEFT JOIN employee AS mngr ON emp.manager_id = mngr.id LEFT JOIN roles ON emp.role_id = roles.id LEFT JOIN department on roles.department_id = department.id ORDER BY mngr.id DESC;')
  console.table(employeeInfo[0]);
  start();
}
//View Employees by Department
async function viewEmployeesByDepartment(){
  const employeeInfoDept = await db.promise().query('SELECT emp.id AS id, concat(emp.first_name," ", emp.last_name) AS employee_name, title AS job_title, salary, department_name, concat(mngr.first_name," ", mngr.last_name) AS manager_name FROM employee AS emp LEFT JOIN employee AS mngr ON emp.manager_id = mngr.id LEFT JOIN roles ON emp.role_id = roles.id LEFT JOIN department on roles.department_id = department.id ORDER BY department.id DESC;')
  console.table(employeeInfoDept[0])
  start();
}
//View combined salaries of a deparartment's employees
async function viewCombinedSalaries(){
  const combinedSalary = await db.promise().query('SELECT department_name, SUM(salary) FROM roles LEFT JOIN department ON department_id = department.id GROUP BY department_id;');
  console.table(combinedSalary[0]);
  start();
}

//"POST" Routes
//This will allow the user to create a department
function addDepartment(){
  inquirer.prompt([
      {
        type: 'input',
        name: 'Department',
        message: 'What Department would you like to add?',
      }
    ]).then((res) => {
      const sql = `INSERT INTO department (department_name) VALUES (?);`
      db.query(sql, res.Department, (err, data) => {
        if(err) throw err
        console.log(`Added ${res.Department} to database`)
        start()
      })
    })
};

//This will allow for the user to create a role
function addRole(){
  db.query('SELECT * FROM department', (err, data) => {
    let departments = data.map((department)=> ({
      name: department.department_name,
      value: department.id
    }))
    inquirer.prompt([
      {
        type: 'input',
        name: 'roleTitle',
        message: 'What is the Role Title?'
      },
      {
        type: 'input',
        name: 'roleSalary',
        message: 'What is the Salary of the Role?'
      },
      {
        type: 'list',
        name: 'departmentID',
        message: 'What department does this Role belong to?',
        choices: departments
      }
    ]).then((res) =>{
      const sql = 'INSERT INTO roles SET ?'
      db.query(sql, {
        title: res.roleTitle,
        salary: res.roleSalary,
        department_id: res.departmentID
      }, (err, data) =>{
        if(err) throw err
        console.log(`Added ${res.roleTitle} to database`)
        start();
      })
    })
  })
}

//This will allow for the user to create an employee
async function addEmployee(){
  try {
    let rolesData = await db.promise().query('SELECT * FROM roles;')
    let managerData = await db.promise().query('SELECT concat(first_name, " ", last_name) AS name, role_id FROM employee WHERE role_id = 3 OR role_id = 5 OR role_id = 7 OR role_id = 10 OR role_id = 13;')
    let roles = rolesData[0].map((data) => ({
      name: data.title,
      value: data.id
    }))

    let managers = managerData[0].map((data) => ({
      name: data.name,
      value: data.role_id
    }))
    //Null is an issue right now
    managers.push({name: 'None', value: null})
   
    let userInput = await inquirer.prompt([
      {
        type: 'input',
        name: 'firstName',
        message: "What is the employee's first name?"
      },
      {
        type: 'input',
        name: 'lastName',
        message: "What is the employee's last name?"
      },
      {
        type: 'list',
        name: 'roleID',
        message: "What is the employee's job tite?",
        choices: roles
      },
      {
        type: 'list',
        name: 'managerID',
        message: "Who is this employee's manager?",
        choices: managers
      }
    ])
   
    const sql = 'INSERT INTO employee SET ?'
    await db.promise().query(sql, {
        first_name: userInput.firstName,
        last_name: userInput.lastName,
        role_id: userInput.roleID,
        manager_id: userInput.managerID
      });

    console.log(`Added ${userInput.firstName} to database`)
    start();
      
  } catch(err) {
    console.error(err)
  };
};

//"PUT" Routes
//Update an employee role
async function updateEmployeeRole() {
  try{
    let employeesData = await db.promise().query('SELECT id, concat(first_name, " ", last_name) AS name FROM employee;');
    let rolesData = await db.promise().query('SELECT id, title FROM roles;')
    let employees = employeesData[0].map((employee) => ({
      name: employee.name,
      value: employee.id
    }))
    let roles = rolesData[0].map((role) => ({
      name: role.title,
      value: role.id
    }))
    let userInput = await inquirer.prompt([
      {
        type: 'list',
        name: 'employeeName',
        message: "Which employee's role do you want to update?",
        choices: employees
      },
      {
        type: 'list',
        name: 'updatedRole',
        message: "What is the employee's new role?",
        choices: roles
      }
    ])
    await db.promise().query('UPDATE employee SET role_id = ? WHERE id = ?;', [userInput.updatedRole, userInput.employeeName])
    console.log(`Updated employee's role`)
    start();
  } catch(err) {
    console.error(err)
  };
};
//***Bonus***
//Update Employee Managers
async function updateEmployeeManager(){

}

//***Bonus***
//"DELETE" ROUTES
//Delete Departments
async function deleteDepartment(){

}
//Delete Roles
async function deleteRole(){

}
//Delete Employees
async function deleteEmployee(){

}

start();