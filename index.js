var mysql = require("mysql");
var connection = mysql.createConnection({
    host: "localhost",

    port: 3306,

    user: "root",

    password: "password",
    database: "items_db"
})

let userName;

var inquirer = require("inquirer");

function inputUsername() {
    inquirer.prompt([
        {
            message: "What is your name?",
            name: "userName"
        }
    ]).then(res => {
        userName = res.userName;
        showCurBids();
    })
}

function showCurBids() {
    connection.query("SELECT * FROM items WHERE bidName=?", [userName], function (err, res) {
        if (err) throw err;
        if (res.length > 0) {
            res.forEach(item => console.log(`You have a high bid on ${item.itemName} of ${item.curBid}.`))
            home();
        } else {
            console.log("You don't have any high bids at the moment.")
            home();
        }
    });
}

function post() {
    inquirer.prompt([
        {
            message: "What is the item?",
            name: "itemName"
        },
        {
            message: "What is the item's starting value?",
            name: "price"
        }
    ]).then(res => {
        var query = connection.query("INSERT INTO items SET ?", {
            itemName: res.itemName,
            curBid: res.price
        }, (err, result) => {
            if (err) throw err;
            console.log("Item added.");
            home();
        });
    });
}

function checkBid(item, bidNum) {
    connection.query("SELECT * FROM items WHERE itemName=?", [item], function (err, res) {
        if (err) throw err;
        const oldName = res[0].bidName;
        if (bidNum > res[0].curBid) {
            var query = connection.query("UPDATE items SET ? WHERE ?", [
                {
                    curBid: bidNum
                },
                {
                    itemName: item
                }
            ], (err, res) => {
                if (err) throw err;
                console.log("Your bid is success. You have overtaken " + oldName + ".");
                var query2 = connection.query("UPDATE items SET ? WHERE ?",[
                    {
                        bidName: userName
                    },
                    {
                        itemName: item
                    }
                ], (err, res) => {
                    if (err) throw err;
                });
                home();
            });
        } else {
            console.log("Your bid is fail. " + oldName + " bid higher.");
            home();
        }
    });
}

function makeBid () {
    connection.query("SELECT * FROM items", function (err, res) {
        if (err) throw err;
        let choices = [];
        res.forEach(item => choices.push(item.itemName));
        inquirer.prompt([
            {
                type: "list",
                message: "Which item would you like to bid on?",
                choices: choices,
                name: "itemChoice"
            },
            {
                message: "What is your bid?",
                name: "bidNum"
            }
        ]).then(res => {
            checkBid(res.itemChoice, res.bidNum);
        })
    });
}

function home() {
    inquirer.prompt([
        {
            type: "list",
            message: "What would you like to do?",
            choices: ["Bid on an item", "Post an item"],
            name: "choice"
        }
    ]).then(res => {
        if (res.choice === "Post an item") {
            post();
        } else {
            makeBid();
        }
    })
}


connection.connect(err => {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
    afterConnection();
})

function afterConnection() {
    connection.query("SELECT * FROM items", function (err, res) {
        if (err) throw err;
        inputUsername();
        // connection.end();
    });
}