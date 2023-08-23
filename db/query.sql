SELECT emp.id AS id, 
       concat(emp.first_name,' ', emp.last_name) AS employee_name, 
       title AS job_title,
       salary, 
       department_name,
       concat(mngr.first_name,' ', mngr.last_name) AS manager_name 
       FROM employee AS emp 
       LEFT JOIN employee AS mngr ON emp.manager_id = mngr.id 
       LEFT JOIN roles ON emp.role_id = roles.id
       LEFT JOIN department on roles.department_id = department.id;