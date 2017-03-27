'use strict';

var Alexa = require("alexa-sdk");
var constants = require("./constants");
var strings = require("./strings");

var colors = ["red", "green", "yellow", "blue"];

var stateHandlers = {
    startModeStateHandlers: Alexa.CreateStateHandler(constants.states.START_MODE, {
        'LaunchRequest': function() {
            this.handler.state = constants.states.START_MODE;
            this.response.listen(strings.launch_message);
            this.emit(":responseReady");
        },
        'ColorMatchGame': function() {
            this.handler.state = constants.states.GUESS_MODE;
            this.emitWithState('ColorMatchGameStart');
        },
        'AMAZON.YesIntent': function() {
            this.handler.state = constants.states.GUESS_MODE;
            this.emitWithState('ColorMatchGameStart');
        },
        'AMAZON.NoIntent': function() {
            this.handler.state = constants.states.START_MODE;
            this.response.speak(strings.exit_message);
            this.emit(":responseReady");
        }
    }),
    guessModeStateHandlers: Alexa.CreateStateHandler(constants.states.GUESS_MODE, {
        'LaunchRequest': function() {
            this.handler.state = constants.states.START_MODE;
            this.emitWithState('LaunchRequest');
        },
        'ColorMatchGameStart': function() {
            // initialize attributes
            helpers.reset.call(this);

            // generate a random number between 0 and 3
            var randomColorIndex = Math.floor(Math.random() * 3);
            this.attributes["computedPattern"] = this.attributes["computedPattern"].push(colors[randomColorIndex]);

            this.response.listen(this.attributes["computedPattern"].join(','));
            this.emit(":responseReady");
        }
    })
};

module.exports = stateHandlers;

var helpers = function() {
    return {
        reset: function() {
            this.attributes["computedPattern"] = [];
            this.attributes["guessPattern"] = [];
            this.attributes["currentScore"] = 0;
            this.attributes["winScore"] = 10;
        }
    }
}