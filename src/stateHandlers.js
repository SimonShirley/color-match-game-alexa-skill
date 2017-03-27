'use strict';

var Alexa = require("alexa-sdk");
var constants = require("./constants");

var stateHandlers = {
    startModeStateHandlers: Alexa.CreateStateHandler(constants.states.START_MODE, {

    }),
    guessModeStateHandlers: Alexa.CreateStateHandler(constants.states.GUESS_MODE, {

    })
};

module.exports = stateHandlers;