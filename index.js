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
        //         {
        //             type: "input",
        //             name: "email",
        //             message: "What is your email address?",
        //         },
        //         {
        //             type: "input",
        //             name: "officeNumber",
        //             message: "What is your office number?",
        //         },
        //         {
        //             type: "validate",
        //             name: "addEmployee",
        //             message: "Would you like to add another employee??",
        //         },
        //         // pushing all the information to the constructor
    ]).then(response => {
        if (response.action === "View all employees") {
            allEmployees();
        } else (response.action === "View all employees by department"){
            employeesByDepartment();
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

}

promptUser();