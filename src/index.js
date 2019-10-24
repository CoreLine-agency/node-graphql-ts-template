/* eslint-disable */
require("ts-node").register({
  typeCheck: true,
});
require("dotenv").config();
require("reflect-metadata");

require("./server/app");
