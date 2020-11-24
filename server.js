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
let allDepartmentsArray = ["Sales", "Finance", "Legal", "Engineering", "Human Resources", "Customer Service"];
let allRolesArray = ["Sales Lead", "Salesperson", "Lead Engineer", "Software Engineer", "Account Manager", "Accountant", "Legal Team Lead"];

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
    connection.query("SELECT * FROM employee", (err, res) => {
        if (err) throw err;
        console.table(res);
        promptUser();
    });
};

employeesByDepartment = () => {
    console.log("View all employees by department.")
    connection.query("SELECT * FROM department", (err, res) => {
        if (err) throw err;
        cTable(res);
        promptUser();
    });
};
employeesByManager = () => {
    console.log("View all employees by manager.")
    connection.query("SELECT * FROM manager", (err, res) => {
        if (err) throw err;
        cTable(res);
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
            name: "role",
            message: "What is the employee's role?",
            choices: allRolesArray
        },
        {
            type: "list",
            name: "manager",
            message: "Who is the employee's manager?",
            choices: ["Jennifer Aniston", "Lisa Kudrow", "Courtenay Cox", "Julia Louis-Dreyfus"]
        },
        {
            type: "number",
            name: "salary",
            message: "What is the employee's salary?",
        }
    ]).then((response) => {
        console.log(response);
        connection.query(`INSERT INTO employees (first_name, last_name, role_id, manager_id, salary) VALUES (${response.first_name}, ${response.last_name}, ${response.role}, ${response.manager}, ${response.salary});`, function (err, res) {
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
        }
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
            message: "What is then name of the newly created role?"
        }
    ]).then((response) => {
        console.log(response);
        connection.query(
            `INSERT INTO role SET ?`, { title: response.newRole })
        console.log("New role added!");
        promptUser();
    }).catch(err => { console.log(err) })
}

removeEmployee = () => {
    console.log("Remove an employee.")
    return inquirer.prompt([
        {
            type: "list",
            name: "removeEmployee",
            message: "Which employee would you like to remove from the system?",
            choices: allEmployeesArray
        }
    ]).then((response) => {
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