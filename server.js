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
    // connection.query("SELECT * FROM employees", (err, res) => {
    //     if (err) throw err;
    //     cTable(res);

});

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
        // connection.end();
        promptUser();
    });
};

employeesByDepartment = () => {
    console.log("View all employees by department.")
    connection.query("SELECT * FROM department", (err, res) => {
        if (err) throw err;
        cTable(res);
        // connection.end();
        promptUser();
    });
};
employeesByManager = () => {
    console.log("View all employees by manager.")
    connection.query("SELECT * FROM manager", (err, res) => {
        if (err) throw err;
        cTable(res);
        // connection.end();
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
            type: "input",
            name: "last_name",
            message: "What is the employee's last name?",
        },
        {
            type: "list",
            name: "role",
            message: "What is the employee's role?",
            choices: ["Sales Lead", "Salesperson", "Lead Engineer", "Software Engineer", "Account Manager", "Accountant", "Legal Team Lead"]
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
        // connection.query("INSERT INTO employees SET ?", response, function (err, res) {
        //     if (err) throw err;
        //     console.log(res.affectedRows + " as a new employee!\n")
        // })
        promptUser();
    });
};

addDepartment() => {
    console.log("Adding a department.")

    promptUser();
}

addRole() => {
    console.log("Adding a role.")

    promptUser();
}

removeEmployee = () => {
    console.log("Remove an employee.")
    return inquirer.prompt([
        {
            type: "list",
            name: "removeEmployee",
            message: "Which employee would you like to remove?",
            choices: ["", "", "", ""]
        },
    ]).then((response) => {
        console.log(response);
    });
};
// write prompt to delete employee


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
            choices: ["Sales Lead", "Salesperson", "Lead Engineer", "Software Engineer", "Account Manager", "Accountant", "Legal Team Lead"]
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
            choices: ["", "", "", ""]
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