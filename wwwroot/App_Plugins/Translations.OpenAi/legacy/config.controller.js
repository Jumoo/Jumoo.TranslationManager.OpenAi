(function () {

    'use strict';

    function configController($scope, translationOpenAiService) {

        var pvm = this;


        pvm.$onInit = function () {

            loadServices();

            if ($scope.vm != undefined && $scope.vm.settings != undefined) {
                prepSettings($scope.vm.settings);
            }


            $scope.$watch('vm.settings', function (newValue) {

                if (_.isEmpty(newValue)) { return; }

                prepSettings(newValue);
            });

            $scope.$watch('vm.settings.prompt', function (prompt) {
                if (_.isEmpty(prompt)) { return; }

                pvm.samplePrompt =
                    prompt.replace('{sourceLang}', 'English')
                        .replace('{targetLang}', 'French')
                        .replace('{textType}', 'html')
                        .replace('{text}', 'Hello world, <strong>you rock</strong>');

            });
        }

        function loadServices() {
            translationOpenAiService.getServices()
                .then(function (result) {
                    pvm.services = result.data;
                });
        }

        function prepSettings(newValue) {

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

            if (newValue.service === undefined) {
                newValue.service = 'BetalgoOpenAiService';
            }


            if (newValue.prompt === undefined || newValue.prompt.length == 0) {
                console.log('empty prompt');
                newValue.prompt = `Translate this {sourceLang} text into {targetLang}\r\n\r\n{text} `;
            }

            if (newValue.systemPrompt == undefined || newValue.systemPrompt.length == 0) {
                newValue.systemPrompt = "You will be provided with sentences in {sourceLang}, and your task is to translate it into {targetLang}";
            }

        }

    }

    angular.module('umbraco')
        .controller('translate.openAiConfigController', configController);

})();