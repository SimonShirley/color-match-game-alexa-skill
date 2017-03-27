'use strict';

var Alexa = require("alexa-sdk");
var constants = require("./constants");
var stateHandlers = require("./stateHandlers");

exports.handler = function(event, context, callback) {
    var alexaApp = Alexa.handler(event, context);
    alexaApp.appId = constants.appId;
    alexaApp.dynamoDBTableName = constants.dynamoDBTableName;
    alexaApp.registerHandlers(stateHandlers.startModeStateHandlers, stateHandlers.guessModeStateHandlers);
    alexaApp.execute();
};