(function () {

    'use strict';

    function configController($scope) {

        var pvm = this;

        $scope.$watch('vm.settings', function (newValue) {

            if (_.isEmpty(newValue)) { return; }

            if (newValue.model === undefined) {
                newValue.model = 'text-davinci-003';
            }

            if (newValue.maxTokens === undefined) {
                newValue.maxTokens = 1024;
            }

            if (newValue.temperature === undefined) {
                newValue.temperature = 0;
            }

            if (newValue.frequencyPenalty === undefined) {
                newValue.frequencyPenalty = 0.0;
            }

            if (newValue.presencePenalty === undefined) {
                newValue.presencePenalty = 0.0;
            }

            if (newValue.nucleusSamplingFactor === undefined) {
                newValue.nucleusSamplingFactor = 1;
            }


        })

    }

    angular.module('umbraco')
        .controller('translate.openAiConfigController', configController);

})();