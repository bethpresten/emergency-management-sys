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
            choices: ["View all employees", "View all employees by department", "View all employees by manager", "Add employee", "Remove employee", "Update employee role", "Update employee manager"]
        }
        //         {
        //             type: "number",
        //             name: "id",
        //             message: "What is your employee ID number?",
        //         },
        //        
    ]).then(response => {
        if (response.action === "View all employees") {
            allEmployees();
        } else if (response.action === "View all employees by department") {
            employeesByDepartment();
        } else if (response.action === "View all employees by manager") {
            employeesByManager();
        } else if (response.action === "View all employees by manager") {
            employeesByManager();
        } else if (response.action === "Add employee") {
            addEmployee();
        } else if (response.action === "Remove employee") {
            removeEmployee();
        } else if (response.action === "Update employee role") {
            updateEmployee();
        } else if (response.action === "Update employee manager") {
            updateManager();
        }
    })
};

allEmployees = () => {
    connection.query("SELECT * FROM employee", (err, res) => {
        if (err) throw err;
        console.table(res);
        connection.end();
    });
};
employeesByDepartment = () => {
    connection.query("SELECT * FROM department", (err, res) => {
        if (err) throw err;
        console.table(res);
        connection.end();
    });
}
employeesByManager = () => {
    connection.query("SELECT * FROM manager", (err, res) => {
        if (err) throw err;
        console.table(res);
        connection.end();
    });
}

promptUser();