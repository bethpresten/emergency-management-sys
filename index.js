const mysql = require("mysql");
const inquirer = require("inquirer");
const consoleTable = require("console.table");

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
    //     console.table(res);
    // connection.end();
});

const promptUser = () => {
    return inquirer.prompt([
        {
            type: "list",
            name: "action",
            message: "What would you like to do?",
            choices: ["View all employees", "View all employees by department", "View all employees by manager", "Add employee", "Remove employee", "Update employee role", "Update employee manager", "Exit"]
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
        // if (response.action === "View all employees") {
        //     allEmployees();
        // } else if (response.action === "View all employees by department") {
        //     employeesByDepartment();
        // } else if (response.action === "View all employees by manager") {
        //     employeesByManager();
        // } else if (response.action === "Add employee") {
        //     addEmployee();
        // } else if (response.action === "Remove employee") {
        //     removeEmployee();
        // } else if (response.action === "Update employee role") {
        //     updateEmployee();
        // } else if (response.action === "Update employee manager") {
        //     updateManager();
        // } else if (response.action === "Exit") {
        //     exit();
        // }
    })

};

allEmployees = () => {
    console.log("View all employees.")
    connection.query("SELECT * FROM employee", (err, res) => {
        if (err) throw err;
        console.table(res);
        // connection.end();
    });
};

employeesByDepartment = () => {
    console.log("View all employees by department.")
    connection.query("SELECT * FROM department", (err, res) => {
        if (err) throw err;
        console.table(res);
        // connection.end();
    });
}
employeesByManager = () => {
    console.log("View all employees by manager.")
    connection.query("SELECT * FROM manager", (err, res) => {
        if (err) throw err;
        console.table(res);
        // connection.end();
    });
}

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
            choices: ["Sales Lead", "Salesperson", "Lead Engineer", "Software Engineer", "Account Manager", "Accountant", "Legal Team Lead",]
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
        console.log(response)
        // connection.query("INSERT INTO employees SET ?", response, function (err, res) {
        //     if (err) throw err;
        //     console.log(res.affectedRows + " as a new employee!\n")
        // })
        connection.end();
    });
};

removeEmployee = () => {
    console.log("Remove an employee.")
    return inquirer.prompt([
        {
            type: "list",
            name: "removeEmployee",
            message: "Which employee would you like to remove?",
            choices: ["", "", "", ""]
        },
    ]).then
    // write prompt to delete employee
}

updateEmployee = () => {
    console.log("Update the employee information")
    // update query
}
updateManager = () => {
    console.log("Update the employee's manager information.")
    //update query
}
exit = () => {
    console.log("Exiting the application.")
    connection.end();
}

const art = () => {
    `___________.__
\_   _____ / _____ ______ |  | ____ ___.__.____   ____
    | __) _ /     \\____ \|  | /  _ <   |  |/ __ \_ / __ \ 
     |        \  Y Y  \  | _ > >  | _(<_> )___  \  ___/\  ___/ 
    /_______  /__|_|  /   __/|____/\____// ____|\___  >\___  >
    \/      \/|__|               \/         \/     \/ 
    _____                                                  
    /     \ _____    ____ _____     ____   ___________      
    /  \ /  \\__  \  /    \\__  \   / ___\_/ __ \_  __ \     
    /    Y    \/ __ \|   |  \/ __ \_/ /_/  >  ___/|  | \/     
    \____|__  (____  /___|  (____  /\___  / \___  >__|        
    \/     \/     \/     \//_____/      \/            `
}

art();
promptUser();