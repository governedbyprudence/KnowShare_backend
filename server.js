const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

let corsOptions = {
    origin: "http://localhost:8081"
};

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req,res) => {
    res.json({ message: "Welcome to KnowShare."});
});

// const db = require("./app/models");
// db.sequelize.sync();

const postgres = require('pg');
require('dotenv').config();

const { PGHOST, PGDATABASE, PGUSER, PGPASSWORD, ENDPOINT_ID } = process.env;
const URL = `postgres://${PGUSER}:${PGPASSWORD}@${PGHOST}/${PGDATABASE}?options=project%3D${ENDPOINT_ID}`;

const sql = postgres(URL, { ssl: 'require' });

async function getPgVersion() {
  const result = await sql`select version()`;
  console.log(result);
}

getPgVersion();

const db = require("./app/models");
const Role = db.role;

db.sequelize.sync({force: true}).then(() => {
  console.log('Drop and Resync Db');
  initial();
});


function initial() {
  Role.create({
    id: 1,
    name: "user"
  });
 
  Role.create({
    id: 2,
    name: "moderator"
  });
 
  Role.create({
    id: 3,
    name: "admin"
  });
}

// routes
require('./app/routes/auth.routes')(app);
require('./app/routes/user.routes')(app);

const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log((`Server is running on port ${port}`));
})