(function () {
    'use static';

    function openAiService($http) {

        var serviceroot = Umbraco.Sys.ServerVariables.openAiTranslations.service;

        return {
            getModels: getModels,
            getServices: getServices
        };

        /////

        function getModels() {
            return $http.get(serviceroot + 'models');
        }

        function getServices() {
            return $http.get(serviceroot + 'services');
        }

    }

    angular.module('umbraco')
        .factory('translationOpenAiService', openAiService);
})();
