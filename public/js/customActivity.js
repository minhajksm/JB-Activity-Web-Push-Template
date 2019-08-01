connection = {};
var activity = function (
    Postmonger
) {
    'use strict';

    connection = new Postmonger.Session();
    // console.log(JSON.stringify(connection));
    var authTokens = {};
    var payload = {};
    var steps = [ // initialize to the same value as what's set in config.json for consistency
        { "label": "Web Push Notification Form", "key": "step1" },
        { "label": "Step 2", "key": "step2" }
    ];
    var currentStep = steps[0].key;

    document.addEventListener('DOMContentLoaded', function () {
        onRender();
    });
    // $(window).ready(onRender);

    connection.on('ready', initialize);
    connection.on('initActivity', initialize);
    connection.on('requestedTokens', onGetTokens);
    connection.on('requestedEndpoints', onGetEndpoints);
    connection.on('clickedNext', onClickedNext);

    function onRender() {
        // JB will respond the first time 'ready' is called with 'initActivity'
        connection.trigger('ready');
        console.log(connection);
        connection.trigger('requestTokens');
        connection.trigger('requestEndpoints');

    }

    function initialize(data) {
        // console.log(data);debugger;
        if (data) {
            payload = data;
        }

        var hasInArguments = Boolean(
            payload['arguments'] &&
            payload['arguments'].execute &&
            payload['arguments'].execute.inArguments &&
            payload['arguments'].execute.inArguments.length > 0
        );

        var inArguments = hasInArguments ? payload['arguments'].execute.inArguments : {};

        console.log(inArguments);

        /* $.each(inArguments, function (index, inArgument) {
             $.each(inArgument, function (key, val) {
                 
               
             });
         }); */

        connection.trigger('updateButton', {
            button: 'next',
            text: 'done',
            visible: true
        });
    }

    function onGetTokens(tokens) {
        console.log(tokens); debugger;
        authTokens = tokens;
    }

    function onGetEndpoints(endpoints) {
        console.log(endpoints); debugger;
    }

    function onClickedNext() {
        //steps[1].active = true;
        var steps2 = [ // initialize to the same value as what's set in config.json for consistency
            { "label": "Step 2", "key": "step2" }
        ];
        connection.trigger('nextStep');
        console.log('inside next');
        connection.trigger('updateSteps', steps2);
        /*  if (
              (currentStep.key === 'step3' && steps[3].active === false) ||
              currentStep.key === 'step4'
          ) {
              save();
          } else {
              connection.trigger('nextStep');
          }*/
    }

    function save() {
        debugger;
        payload['arguments'].execute.inArguments = [{
            "tokens": authTokens,
            "emailAddress": "{{Contact.Attribute.PostcardJourney.EmailAddress}}"
        }];

        payload['metaData'].isConfigured = true;

        console.log(payload);
        connection.trigger('updateActivity', payload);
    }

}

module.exports = activity;
console.log(connection);