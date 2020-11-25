DROP DATABASE IF EXISTS employees_db;
CREATE DATABASE employees_db;
USE employees_db;
CREATE TABLE department (
  id INT NOT NULL AUTO_INCREMENT,
  department_name VARCHAR(30) NULL,
  PRIMARY KEY (id)
);
CREATE TABLE role (
  id INT NOT NULL AUTO_INCREMENT,
  title VARCHAR(30) NULL,
  salary INTEGER(10),
  department_id INT,
  PRIMARY KEY (id)
);
CREATE TABLE employee (
  id INT NOT NULL AUTO_INCREMENT,
  first_name VARCHAR(30),
  last_name VARCHAR(30),
  role_id INT,
  manager_id INT(10) NULL,
  PRIMARY KEY (id)
);

SELECT * FROM department;
SELECT * FROM role;
SELECT * FROM employee;

INSERT INTO department(department_name)
VALUES("sales"), ("finance"), ("engineering"), ("legal"), ("human resources"), ("customer service");
INSERT INTO role(title, salary, department_id)
VALUES("associate", "55000", 1), ("sales lead", "85000", 1), ("junior developer", "70000", 3), ("senior developer", "105000", 3), ("accountant", "106550", 2), ("general counsel", "135250", 4), ("lead counsel", "170000", 4), ("sales manager", "175000", 1), ("accounting manager", "185000", 2), ("project manager", "250000", 3), ("head of legal", "205000", 4);
INSERT INTO employee(first_name, last_name, role_id, manager_id)
VALUES("John", "Smith", 1, 10), ("Jane", "Doe", 2, 11), ("Michelle", "Fowler", 3, 12), ("Lauren", "Phillips", 4, 13), ("Adam", "Brown", 5, 11), ("Heather", "Baug", 6, 12), ("Rachel", "McMichael", 7, 13), ("Betsy", "Bulat", 3, 11), ("Dara", "Steele", 4, 12), ("Jennifer", "Aniston", 1, NULL), ("Lisa", "Kudrow", 2, NULL), ("Courtenay", "Cox", 3, NULL), ("Julia", "Dreyfus", 4, NULL);

-- view all employees
select employee.id, 
employee.first_name, 
employee.last_name,  
role.title, 
role.salary, 
department.department_name as 'department name', 
manager.first_name as manager from employee
join role ON employee.role_id = role.id
join department ON role.department_id = department.id
JOIN employee manager on manager.id = employee.manager_id
order by id;

-- view all employees by department
select employee.id, 
employee.first_name, 
employee.last_name,  
role.title, 
role.salary, 
department.department_name as 'department name', 
manager.first_name as manager from employee
join role ON employee.role_id = role.id
join department ON role.department_id = department.id
JOIN employee manager on manager.id = employee.manager_id
order by department.department_name;

-- view employees by manager
select employee.id, 
employee.first_name, 
employee.last_name,  
role.title, 
role.salary, 
department.department_name as 'department name', 
manager.first_name as manager from employee
join role ON employee.role_id = role.id
join department ON role.department_id = department.id
JOIN employee manager on manager.id = employee.manager_id
order by employee.manager_id;




-- add role / department choice
INSERT INTO role SET ?;

SELECT department_name FROM department;


-- add employee

INSERT INTO employees(first_name, last_name, role_id, salary, manager_id)
VALUES = (?, ?, ?, ?, ?)

-- add department
INSERT INTO department SET ?;

-- remove employee
DELETE FROM employee

-- select manager
SELECT * from employee first_name, last_name WHERE manager_id IS NULL
INNER JOIN on employee.manager_id = manager_id;

SELECT first_name, last_name
FROM employee
WHERE manager_id IS NULL;

SELECT * FROM department
INNER JOIN role on role.department_id = employee.id;


-- update employee info
SELECT employee.last_name, role.title FROM employee JOIN role ON employee.role_id = role.id;

-- update employee manager NOT FINISHED
SELECT employee.last_name, role.title FROM employee JOIN role ON employee.role_id = role.id;


-- delete
DELETE FROM employee WHERE last_name = "?";

