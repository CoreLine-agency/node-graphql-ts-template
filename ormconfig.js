/* eslint-disable */
require("ts-node").register({
    typeCheck: true,
});
require("dotenv").config();
require("reflect-metadata");

module.exports = require("./ormconfig/ormconfig.ts").connectionOptions;
