// requiring mysql to pull queries
const mysql = require("mysql");
const inquirer = require("inquirer");
const cTable = require("console.table");

// requiring the mysql connection
const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "GeorgiaTech$$117",
    database: "employees_db"
});

// establishing the connection
connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId + "\n");
});

let allEmployeesArray = [];
// basic function for the main menu
const promptUser = () => {
    return inquirer.prompt([

        {
            type: "list",
            name: "action",
            message: "What would you like to do?",
            choices: ["View all employees", "View all roles", "View all departments", "View all employees by department", "View all employees by manager", "Add employee", "Add role", "Add department", "Remove employee", "Update employee role", "Update employee manager", "Exit"]
        }
    ])
        // offering conditionals for each choice
        .then((response) => {
            switch (response.action) {
                case "View all employees":
                    allEmployees();
                    break;
                case "View all roles":
                    viewRoles();
                    break;
                case "View all departments":
                    viewDepartments();
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
//viewing all employees with a triple join of 3 tables
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
// viewing all roles just from the role table
viewRoles = () => {
    console.log("View all roles.")
    connection.query(`SELECT * FROM role`, (err, res) => {
        if (err) throw err;
        console.table(res);
        promptUser();
    });
};

// viewing all departments with a basic table query
viewDepartments = () => {
    console.log("View all departments.")
    connection.query(`SELECT * FROM department`, (err, res) => {
        if (err) throw err;
        console.table(res);
        promptUser();
    });
};

// viewing all employees by department// having the functionality to choose based on a menu
employeesByDepartment = (departmentId) => {
    connection.query("SELECT * FROM department;", (err, res) => {
        if (err) throw err;
        console.log(res);
        const departmentChoices = res.map((row) => ({
            value: row.id,
            name: row.name,
        }));
        inquirer
            .prompt({
                type: "list",
                message: "Which department do you want to look at?",
                name: "department",
                choices: departmentChoices,
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

// viewing all employees and sorted by their manager
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
// adding employee functionality
const addEmployee = () => {
    console.log("Adding a new employee.")
    // empty object for the employee to get pushed into
    let addNewEmployee = {};
    connection.query("SELECT * FROM role", (err, res) => {
        if (err) throw err;
        console.log(res);
        // defining the choices for ease of picking
        const departmentChoices = res.map((row) => ({
            value: row.id,
            name: row.name,
        }));

        // questions for adding a new employee
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
                name: "allRoles",
                message: "What is the employee's role?",
                choices: function () {
                    let rolesArray = [];
                    for (let i = 0; i < res.length; i++) {
                        rolesArray.push(res[i].title)
                    }
                    return rolesArray;
                },
            },
            {
                type: "list",
                name: "whichDepartment",
                message: "What department is the employee in?",
                choices: departmentChoices,
            },
        ]).then((response) => {
            {
                addNewEmployee.first_name = response.first_name;
                addNewEmployee.last_name = response.last_name;
                connection.query(`SELECT * FROM role WHERE title = ?`, response.allRoles, (err, res) => {
                    if (err) throw err;
                    addNewEmployee.role_id = res[0].id
                })

                // get the manager name for this employee
                connection.query("SELECT * FROM employee", (err, res) => {
                    if (err) throw err;
                    inquirer
                        .prompt([
                            {
                                type: "list",
                                name: "manager_name",
                                message: "Who is the employee's manager?",
                                choices: function () {
                                    let managerArray = [];
                                    for (let i = 0; i < res.length; i++) {
                                        managerArray.push(res[i].first_name);
                                    }
                                    return managerArray;
                                },
                            },
                        ])
                        .then((response) => {
                            connection.query(
                                "SELECT id FROM employee WHERE first_name = ?",
                                response.manager_name,
                                (err, res) => {
                                    if (err) throw err;
                                    addNewEmployee.manager_id = res[0].id;

                                    connection.query(
                                        "INSERT INTO employee SET ?",
                                        addNewEmployee,
                                        (err, res) => {
                                            if (err) throw err;
                                            promptUser();
                                        }
                                    );
                                });
                        }, function (err, res) {
                            if (err) throw err;
                            console.log("New employee added!")
                        })
                    promptUser();
                })
            };
        }).catch(err => { console.log(err) })
    });
};
// adding new departments
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
// adding new roles
addRole = () => {
    console.log("Adding a new role.");
    connection.query("SELECT * FROM department;", (err, res) => {
        if (err) throw err;
        console.log(res);
        const departmentChoices = res.map((row) => ({
            value: row.id,
            name: row.name,
        }));
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
                type: "list",
                name: "allDepartmentChoices",
                message: "What department will the employee work in?",
                choices: departmentChoices
            }
        ]).then((response) => {
            console.log(response);
            connection.query(
                `INSERT INTO role SET ?`, { title: response.newRole, salary: response.salary, department_id: response.allDepartmentChoices })
            console.log("New role added!");
            promptUser();
        }).catch(err => { console.log(err) })
    })
}

// functionality that I couldn't get to work
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


// functionality that I couldn't get to work
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
// functionality that I couldn't get to work
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

// ending the connection to exit the application
exit = () => {
    console.log("Exiting the application.")
    connection.end();
}

// ascii art courtesy of my cited source 
console.log(
    `
                                                                                
                                                                                 
    ______   ______   ______   ______   ______   ______   ______   ______   ______ 
    /_____/  /_____/  /_____/  /_____/  /_____/  /_____/  /_____/  /_____/  /_____/ 
                                                                                    
                                                                                    
       ___________                    .__                                           
       \_   _____/   _____   ______   |  |     ____    ___.__.   ____     ____      
        |    __)_   /     \  \____ \  |  |    /  _ \  <   |  | _/ __ \  _/ __ \     
        |        \ |  Y Y  \ |  |_> > |  |__ (  <_> )  \___  | \  ___/  \  ___/     
       /_______  / |__|_|  / |   __/  |____/  \____/   / ____|  \___  >  \___  >    
               \/        \/  |__|                      \/           \/       \/     
             _____                                                                  
            /     \   _____      ____   _____       ____     ____   _______         
           /  \ /  \  \__  \    /    \  \__  \     / ___\  _/ __ \  \_  __ \        
          /    Y    \  / __ \_ |   |  \  / __ \_  / /_/  > \  ___/   |  | \/        
          \____|__  / (____  / |___|  / (____  /  \___  /   \___  >  |__|           
                  \/       \/       \/       \/  /_____/        \/                  
                                                                                    
                                                                                    
     ______   ______   ______   ______   ______   ______   ______   ______   ______ 
    /_____/  /_____/  /_____/  /_____/  /_____/  /_____/  /_____/  /_____/  /_____/ 
                                                                                    
                                                                                                                                                     
`
)

promptUser();