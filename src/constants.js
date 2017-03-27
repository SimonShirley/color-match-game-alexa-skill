'use strict';

var appInfo = require("./appInfo");

var constants = Object.freeze({
    appId: appInfo.appId,
    dynamoDBTableName: appInfo.dynamoDBTableName,
    states: {
        START_MODE: "_START_MODE",
        GUESS_MODE: "_GUESS_MODE"
    }
});

module.exports = constants;