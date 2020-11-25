const mysql = require("mysql");
const inquirer = require("inquirer");
const cTable = require("console.table");

const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "GeorgiaTech$$117",
    database: "employees_db"
});

connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId + "\n");
});

let allEmployeesArray = [];

const promptUser = () => {
    return inquirer.prompt([

        {
            type: "list",
            name: "action",
            message: "What would you like to do?",
            choices: ["View all employees", "View all employees by department", "View all employees by manager", "Add employee", "Add role", "Add department", "Remove employee", "Update employee role", "Update employee manager", "Exit"]
        }
    ]).then((response) => {
        switch (response.action) {
            case "View all employees":
                allEmployees();
                break;
            case "View all employees by department":
                employeesByDepartment();
                break;
            case "View all employees by manager":
                employeesByManager();
                break;
            case "Add employee":
                addEmployee();
                break;
            case "Add department":
                addDepartment();
                break;
            case "Add role":
                addRole();
                break;
            case "Remove employee":
                removeEmployee();
                break;
            case "Update employee role":
                updateEmployee();
                break;
            case "Update employee manager":
                updateManager();
                break;
            case "Exit":
                exit();
                break;
        }
    })
};

allEmployees = () => {
    console.log("View all employees.")
    connection.query(`select employee.id, 
    employee.first_name, 
    employee.last_name,  
    role.title, 
    role.salary, 
    department.department_name as 'department name', 
    manager.first_name as manager from employee
    join role ON employee.role_id = role.id
    join department ON role.department_id = department.id
    JOIN employee manager on manager.id = employee.manager_id
    order by id;`, (err, res) => {
        if (err) throw err;
        console.table(res);
        promptUser();
    });
};

employeesByDepartment = (departmentId) => {
    connection.query("SELECT * FROM department;", (err, res) => {
        if (err) throw err;
        console.log(res);
        const choices = res.map((row) => ({
            value: row.id,
            name: row.name,
        }));
        inquirer
            .prompt({
                type: "list",
                message: "Which department do you want to look at?",
                name: "department",
                choices: choices,
            })
            .then((response) => {
                console.log(response);
                connection.query(`SELECT employee.id, employee.first_name, employee.last_name, role.title, role.salary 
                FROM employee
                LEFT JOIN role ON employee.role_id = role.id
                INNER JOIN department ON role.department_id = department.id
                WHERE department.id = ${response.department}`, (err, res) => {
                    if (err) throw err;
                    console.table(res);
                    promptUser();
                });
            });
    });
}

employeesByManager = () => {
    console.log("View all employees by manager.")
    connection.query(`select employee.id, 
    employee.first_name, 
    employee.last_name,  
    role.title, 
    role.salary, 
    department.department_name as 'department name', 
    manager.first_name as manager from employee
    join role ON employee.role_id = role.id
    join department ON role.department_id = department.id
    JOIN employee manager on manager.id = employee.manager_id
    order by employee.manager_id;`, (err, res) => {
        if (err) throw err;
        console.table(res);
        promptUser();
    });
};

const addEmployee = () => {
    console.log("Adding a new employee.")
    return inquirer.prompt([
        {
            type: "input",
            name: "first_name",
            message: "What is the employee's first name?",
        },
        {
            type: "input",
            name: "last_name",
            message: "What is the employee's last name?",
        },
        {
            type: "list",
            name: "role_id",
            message: "What is the employee's role?",
            choices: viewAllRoles(),
        },
        {
            type: "list",
            name: "manager_id",
            message: "Who is the employee's manager?",
            choices: ["Jennifer Aniston", "Lisa Kudrow", "Courtenay Cox", "Julia Louis-Dreyfus"]
        },
    ]).then((response) => {
        console.log(response);
        connection.query(`INSERT INTO employee SET ?`,
            {
                first_name: response.first_name,
                last_name: response.last_name,
                role_id: response.role_id,
                manager_id: response.manager_id
            }, function (err, res) {
                if (err) throw err;
                console.log("New employee added!")
            })
        promptUser();
    }).catch(err => { console.log(err) })
};

addDepartment = () => {
    console.log("Adding a department.");
    return inquirer.prompt([
        {
            type: "input",
            name: "department_name",
            message: "What is then name of the newly created department?"
        },
    ]).then((response) => {
        console.log(response);
        connection.query(
            `INSERT INTO department SET ?`, { department_name: response.department_name })
        console.log("New department added!");
        promptUser();
    }).catch(err => { console.log(err) })
}

addRole = () => {
    console.log("Adding a new role.");
    return inquirer.prompt([
        {
            type: "input",
            name: "newRole",
            message: "What is the name of the newly created role?"
        },
        {
            type: "input",
            name: "salary",
            message: "What is the salary for this position?"
        },
        {
            type: "input",
            name: "allDepartmentChoices",
            message: chooseDepartment()
        }
    ]).then((response) => {
        console.log(response);
        connection.query(
            `INSERT INTO role SET ?`, { title: response.newRole, salary: response.salary, department_id: response.allDepartmentChoices })
        console.log("New role added!");
        promptUser();
    }).catch(err => { console.log(err) })
}

function viewAllRoles() {
    let allRolesArray = ["engineer", "attorney", "accountant", "sales"];
    connection.query("SELECT title FROM role", (err, res) => {
        if (err) throw err;
        for (let i = 0; i < res.length; i++) {
            allRolesArray.push(res[i].title);
        }
    });
    return allRolesArray;
}


chooseDepartment = () => {
    let allDepartmentsArray = ["sales", "finance", "engineering", "legal"];
    connection.query("SELECT department_name FROM department", (err, res) => {
        if (err) throw err;
        for (let i = 0; i < res.length; i++) {
            allDepartmentsArray.push(res[i].name);
        }
    });
    return allDepartmentsArray;
}

removeEmployee = () => {
    console.log("Remove an employee.")
    return inquirer.prompt([
        {
            type: "input",
            name: "removeEmployee",
            message: "Which employee would you like to remove from the system?",
        }
    ]).then((response) => {
        if (response === allEmployeesArray) {
            connection.query = `DELETE`, (err, res) => {
                if (err) throw err;
            }
        }
        console.log(response);

    }).catch(err => { console.log(err) });
};



updateEmployee = () => {
    console.log("Update the employee information")
    return inquirer.prompt([
        {
            type: "list",
            name: "updateEmployeeRole",
            message: "Which employee do you want to update their role?",
            choices: ["", "", "", ""]
        },
        {
            type: "list",
            name: "role",
            message: "What is the employee's role?",
            choices: allRolesArray
        },
    ]).then(({ updateEmployeeRole, role }) => {
        console.log({ updateEmployeeRole, role });
        // update query

        promptUser();

    })
}

updateManager = () => {
    console.log("Update the employee's manager information.")
    return inquirer.prompt([
        {
            type: "list",
            name: "updateManager",
            message: "Which employee do you want to update manager information?",
            choices: allEmployeesArray
        },
        {
            type: "list",
            name: "newManager",
            message: "Who is the employee's manager?",
            choices: ["Jennifer Aniston", "Lisa Kudrow", "Courtenay Cox", "Julia Louis-Dreyfus"]
        },
    ]).then((response) => {
        console.log(response);
        promptUser();
    })
}

renderAllEmployeeNames = () => {
    `SELECT * CONCAT(first_name, ' ', last_name) FROM employee;
    `,
        function (err, res) {
            if (err) throw err;
            for (let i = 0; i < res.length; i++) {
                allEmployeesArray.push(res[i]["CONCAT(first_name, ' ', last_name)"]);
            }
            return allEmployeesArray;
        }
}

exit = () => {
    console.log("Exiting the application.")
    connection.end();
}


console.log(
    `
                                                                        
                                                                        
______   ______   ______   ______   ______   ______   ______   ______ 
/_____/  /_____/  /_____/  /_____/  /_____/  /_____/  /_____/  /_____/ 
                                                                       
                                                                       
      ___________              .__                                     
      \_   _____/ _____ ______ |  |   ____ ___.__. ____   ____         
       |    __)_ /     \\____ \|  |  /  _ <   |  |/ __ \_/ __ \        
       |        \  Y Y  \  |_> >  |_(  <_> )___  \  ___/\  ___/        
      /_______  /__|_|  /   __/|____/\____// ____|\___  >\___  >       
              \/      \/|__|               \/         \/     \/        
           _____                                                       
          /     \ _____    ____ _____     ____   ___________           
         /  \ /  \\__  \  /    \\__  \   / ___\_/ __ \_  __ \          
        /    Y    \/ __ \|   |  \/ __ \_/ /_/  >  ___/|  | \/          
        \____|__  (____  /___|  (____  /\___  / \___  >__|             
                \/     \/     \/     \//_____/      \/                 
                                                                       
                                                                       
 ______   ______   ______   ______   ______   ______   ______   ______ 
/_____/  /_____/  /_____/  /_____/  /_____/  /_____/  /_____/  /_____/ 
                                                                       
                                                                    
`
)

promptUser();