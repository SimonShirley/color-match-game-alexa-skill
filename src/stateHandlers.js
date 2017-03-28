'use strict';

var Alexa = require("alexa-sdk");
var constants = require("./constants");
var strings = require("./strings");
var _ = require("lodash");

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
        },
        'ColorMatchGameWin': function() {
            this.response.speak(strings.congratulations_message).listen(strings.congratulations_message);
            this.emit(":responseReady");
        },
        'ColorMatchGameLose': function() {
            this.response.speak(strings.lose_message + this.attributes["computedPattern"].join(",")).listen(strings.play_again);
            this.emit(":responseReady");
        },
        'SessionEndRequest': function() {

        },
        'Unhandled': function() {
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

            this.emitWithState('ColorMatchGameNewColor');
        },
        'ColorMatchGameNewColor': function() {
            // generate a random number between 0 and 3
            var randomColorIndex = Math.floor(Math.random() * 3);

            console.log(this.attributes["computedPattern"]);
            console.log(colors);
            console.log(colors[randomColorIndex]);

            Array.prototype.push(this.attributes["computedPattern"], colors[randomColorIndex]);

            console.log(this.attributes["computedPattern"]);

            var responseMessage = strings.game_start_message + this.attributes["computedPattern"].join(',');
            this.response.listen(responseMessage);
            this.emit(":responseReady");
        },
        'ColorMatchGameGuess': function() {
            var colorGuessed = this.event.request.intent.slots.color.value;
            var currentScore = this.attributes["currentScore"];
            var currentGuessAttempts = this.attributes["guessAttempts"];

            // if colorGuessed is valid
            if (_.isString(colorGuessed) && (colors.indexOf(_.lowerCase(colorGuessed)) >= 0)) {
                
                // check colour matches the pattern 
                if (colorGuessed == this.attributes["computedPattern"][currentGuessAttempts]) {

                    // check to see if all colours guessed correctly
                    if (currentGuessAttempts == this.attributes["computedPattern"].length) {
                        this.attributes["currentScore"] = ++currentScore;

                        // continue or win?
                        if (this.attributes["computedPattern"].length < this.attributes["winScore"]) {
                            
                            // continue
                            this.attributes["guessAttempts"] = 0;
                            this.emitWithState("ColorMatchGameNewColor");
                        } else {

                            // win
                            this.handler.state = constants.states.START_MODE;
                            this.emitWithState("ColorMatchGameWin");
                        }
                    } else {

                        // increment guess counter
                        this.attributes["guessAttempts"] = ++currentGuessAttempts;

                        // wait for next guess
                        this.listen(strings.correct_guess);
                        this.emit(":responseReady");
                    }
                } else {

                    // Incorrect colour guessed. Game over.
                    this.handler.state = constants.states.START_MODE;
                    this.emitWithState("ColorMatchGameLose");
                }
            } else {

                // colour not a valid colour.
                this.response.listen(strings.invalid_guess);
                this.emit(":responseReady");
            }
        },
        'SessionEndRequest': function() {

        },
        'Unhandled': function() {
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
            this.attributes["guessAttempts"] = 0;
        }
    }
}();