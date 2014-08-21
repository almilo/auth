angular.module('app', ['ngRoute', 'ngResource'])
    .factory('UserService', function ($resource) {
        var devHttpHeaders = {
            REMOTE_USER: 'tkbcf', APPL_ROLE: 'wes'
        };

        return $resource('/rest/', {}, {
            query: {
                method: 'GET',
                isArray: false,
                headers: devHttpHeaders
            }
        });
    })
    .factory('UserServiceMock', function ($q) {
        return {
            query: returnUser('user') // <- change returned value to 'admin' to invert auth behavior
        };

        function returnUser(value) {
            return function () {
                return {
                    $promise: $q.when({name: value, role: value})
                };
            }
        }
    })
    .config(function ($routeProvider) {
        $routeProvider
            .when('/home', {
                template: '<div>Home (not restricted)</div>'
            })
            .when('/error', {
                template: '<div>Error: not authorized!!</div>'
            })
            .when('/admin', {
                template: '<div>Administrator restricted functionality</div>',
                controller: loggingController,
                resolve: {
                    user: checkRole('admin')
                }
            })
            .when('/user', {
                template: '<div>User restricted functionality</div>',
                controller: loggingController,
                resolve: {
                    user: checkRole('user')
                }
            })
            .otherwise({
                redirectTo: '/home'
            });

        function loggingController(user) {
            console.log('User:', user);
        }

        function checkRole(requiredRole) {
            return function (UserService, UserServiceMock, $q) {
                //var promise = UserService.query().$promise; // <- Uncomment this line to use real HTTP service
                var promise = UserServiceMock.query().$promise; // <- Uncomment this line to use Mock service

                return promise.then(checkUserRole);

                function checkUserRole(user) {
                    if (requiredRole == user.role) {
                        return user;
                    } else {
                        return $q.reject('Wrong role: "' + user.role + '", required: "' + requiredRole + '".');
                    }
                }
            };
        }
    })
    .run(function ($rootScope, $location) {
        $rootScope.$on('$routeChangeError', function (event, currentRoute, previousRoute, rejection) {
            console.log('Rejection: "' + rejection + '", Current path: "' + currentRoute.originalPath + '", Previous path: "' + (previousRoute ? previousRoute.originalPath : undefined) + '".');

            $location.path('/error');
        });
    });
