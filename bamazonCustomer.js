// npm packages 
var mysql = require("mysql");
var inquirer = require("inquirer");

// acces js classes
var CustomerView = require("./customerView");
var customerView1 = new CustomerView();

var ManagerView = require("./managerView");
var managerView1 = new ManagerView();

var SupervisorView = require("./supervisorView");
var supervisorView1 = new SupervisorView();

// function which prompts the user for the action they should take
var start = function() {
  console.log("runnning start");
  inquirer.prompt({
    type: "list",
    name: "startViews",
    message: "Which view would you like?",
    choices: ["Customer View", "Manager View", "Super View"]
  }).then(function(answer) {
    // based on their answer
    if (answer.startViews === "Customer View") { // run customer view file
      // since using require("./customerView"); can't require this file in ./customerView; thus use callbacks
      customerView1.showItems(function () { // callback for showItems is customerView1
        customerView1.updateQuantity(start); // callback for customerView1 is start
      });
    }
    else if (answer.startViews === "Manager View") { // run manager view file
      managerView1.startManager(start);
    }
    else if (answer.startViews === "Super View") { // run supervisor view file
      supervisorView1.startSupervisor(start);
    }
  });
};

start();