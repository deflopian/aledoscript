﻿(function ($) {
    function PartnerController($scope, $http) {
        $scope.formData = {};

        $scope.validityOnChange = function(field) {
            //console.log($scope.partnerRegistration[field]);
            if ($scope.partnerRegistration[field].$invalid) {
                $scope.partnerRegistration[field].$invalid = false;
                $scope.partnerRegistration[field].$valid = true;
                $scope.partnerRegistration[field].$error = [];
            }

            for (var f in $scope.formData) {

                if ($scope.partnerRegistration[f] && (($scope.partnerRegistration[f].$pristine && $scope.partnerRegistration[f].$validators['required']) || $scope.partnerRegistration[f].$invalid)) {
                    console.log($scope.partnerRegistration[f]);
                    return false;
                }
            }

            $scope.partnerRegistration.$invalid = false;
            $scope.partnerRegistration.$valid = true;
        };

        $scope.str_replace = function  ( search, replace, subject ) {	// Replace all occurrences of the search string with the replacement string
            //
            // +   original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
            // +   improved by: Gabriel Paderni

            if(!(replace instanceof Array)){
                replace=new Array(replace);
                if(search instanceof Array){//If search	is an array and replace	is a string, then this replacement string is used for every value of search
                    while(search.length>replace.length){
                        replace[replace.length]=replace[0];
                    }
                }
            }

            if(!(search instanceof Array))search=new Array(search);
            while(search.length>replace.length){//If replace	has fewer values than search , then an empty string is used for the rest of replacement values
                replace[replace.length]='';
            }

            if(subject instanceof Array){//If subject is an array, then the search and replace is performed with every entry of subject , and the return value is an array as well.
                for(k in subject){
                    subject[k]=str_replace(search,replace,subject[k]);
                }
                return subject;
            }

            for(var k=0; k<search.length; k++){
                var i = subject.indexOf(search[k]);
                while(i>-1){
                    subject = subject.replace(search[k], replace[k]);
                    i = subject.indexOf(search[k],i);
                }
            }

            return subject;

        };


        $scope.submit = function () {
            $http({
                method  : 'POST',
                url     : '/request/registerPartner/',
                data    : $.param($scope.formData),
                headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
            })
                .success(function(data) {
                    console.log(data);

                    if (!data.success) {
                        for (var field in data.errors) {
                            for (var errNum in data.errors[field]) {
                                var newField = $scope.str_replace("user", "partner", field);
								newField = $scope.str_replace("partner_cur_password", "partner_password", newField);
								newField = $scope.str_replace("partner_is_spamed", "user_is_spamed", newField);
                                console.log(newField);
                                $scope.partnerRegistration[newField].$setValidity(errNum, false);
                            }
                        }
                    } else {
                        $scope.getPopup($scope.ALEDO_POPUP_PARTNER_CARD_SUCCESS, {name: $scope.formData.partner_name});
                    }
                });
        };
    }
    angular.module('aledo.controllers').controller("PartnerController", ["$scope", "$http", PartnerController]);
})(jQuery)