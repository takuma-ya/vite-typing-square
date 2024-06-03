import config from "../knexfile.js"
import knex from "knex"
const environment = "production";
//const environment = "development";

export default knex(config[environment]);
