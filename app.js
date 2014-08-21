angular.module('app', ['ngRoute', 'ngResource'])
    .config(function ($routeProvider) {
        $routeProvider
            .when('/home', {
                template: '<div>Home (not restricted)</div>'
            })
            .when('/admin', {
                template: '<div>Administrator restricted functionality</div>'
            })
            .when('/user', {
                template: '<div>User restricted functionality</div>'
            })
            .otherwise({
                redirectTo: '/home'
            });
    });
