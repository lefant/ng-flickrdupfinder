(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"./src/javascript/app.js":[function(require,module,exports){
'use strict';

require("./../../bower_components/angular-route/angular-route.js");

angular.module('flickrDupFinder', ['ngRoute', require('./controllers').name])
  .config(
    ['$locationProvider', '$routeProvider',
     function($locationProvider, $routeProvider) {
       //probably breaks things due to oauth redirect landing page hack below
       //$locationProvider.html5Mode(true);

       // the oauth redirect callback page must be matched with .otherwise
       $routeProvider
         .when('/', {
           templateUrl: 'partials/start.html',
           controller: 'startCtrl'
         })
         .otherwise({
           templateUrl: 'partials/photos.html',
           controller: 'photoCtrl',
           resolve: { 'Flickr': 'Flickr' }
         });
     }]);

},{"./../../bower_components/angular-route/angular-route.js":"/home/travis/build/lefant/ng-flickrdupfinder/bower_components/angular-route/angular-route.js","./controllers":"/home/travis/build/lefant/ng-flickrdupfinder/src/javascript/controllers.js"}],"/home/travis/build/lefant/ng-flickrdupfinder/bower_components/angular-resource/angular-resource.js":[function(require,module,exports){
/**
 * @license AngularJS v1.3.14
 * (c) 2010-2014 Google, Inc. http://angularjs.org
 * License: MIT
 */
(function(window, angular, undefined) {'use strict';

var $resourceMinErr = angular.$$minErr('$resource');

// Helper functions and regex to lookup a dotted path on an object
// stopping at undefined/null.  The path must be composed of ASCII
// identifiers (just like $parse)
var MEMBER_NAME_REGEX = /^(\.[a-zA-Z_$][0-9a-zA-Z_$]*)+$/;

function isValidDottedPath(path) {
  return (path != null && path !== '' && path !== 'hasOwnProperty' &&
      MEMBER_NAME_REGEX.test('.' + path));
}

function lookupDottedPath(obj, path) {
  if (!isValidDottedPath(path)) {
    throw $resourceMinErr('badmember', 'Dotted member path "@{0}" is invalid.', path);
  }
  var keys = path.split('.');
  for (var i = 0, ii = keys.length; i < ii && obj !== undefined; i++) {
    var key = keys[i];
    obj = (obj !== null) ? obj[key] : undefined;
  }
  return obj;
}

/**
 * Create a shallow copy of an object and clear other fields from the destination
 */
function shallowClearAndCopy(src, dst) {
  dst = dst || {};

  angular.forEach(dst, function(value, key) {
    delete dst[key];
  });

  for (var key in src) {
    if (src.hasOwnProperty(key) && !(key.charAt(0) === '$' && key.charAt(1) === '$')) {
      dst[key] = src[key];
    }
  }

  return dst;
}

/**
 * @ngdoc module
 * @name ngResource
 * @description
 *
 * # ngResource
 *
 * The `ngResource` module provides interaction support with RESTful services
 * via the $resource service.
 *
 *
 * <div doc-module-components="ngResource"></div>
 *
 * See {@link ngResource.$resource `$resource`} for usage.
 */

/**
 * @ngdoc service
 * @name $resource
 * @requires $http
 *
 * @description
 * A factory which creates a resource object that lets you interact with
 * [RESTful](http://en.wikipedia.org/wiki/Representational_State_Transfer) server-side data sources.
 *
 * The returned resource object has action methods which provide high-level behaviors without
 * the need to interact with the low level {@link ng.$http $http} service.
 *
 * Requires the {@link ngResource `ngResource`} module to be installed.
 *
 * By default, trailing slashes will be stripped from the calculated URLs,
 * which can pose problems with server backends that do not expect that
 * behavior.  This can be disabled by configuring the `$resourceProvider` like
 * this:
 *
 * ```js
     app.config(['$resourceProvider', function($resourceProvider) {
       // Don't strip trailing slashes from calculated URLs
       $resourceProvider.defaults.stripTrailingSlashes = false;
     }]);
 * ```
 *
 * @param {string} url A parametrized URL template with parameters prefixed by `:` as in
 *   `/user/:username`. If you are using a URL with a port number (e.g.
 *   `http://example.com:8080/api`), it will be respected.
 *
 *   If you are using a url with a suffix, just add the suffix, like this:
 *   `$resource('http://example.com/resource.json')` or `$resource('http://example.com/:id.json')`
 *   or even `$resource('http://example.com/resource/:resource_id.:format')`
 *   If the parameter before the suffix is empty, :resource_id in this case, then the `/.` will be
 *   collapsed down to a single `.`.  If you need this sequence to appear and not collapse then you
 *   can escape it with `/\.`.
 *
 * @param {Object=} paramDefaults Default values for `url` parameters. These can be overridden in
 *   `actions` methods. If any of the parameter value is a function, it will be executed every time
 *   when a param value needs to be obtained for a request (unless the param was overridden).
 *
 *   Each key value in the parameter object is first bound to url template if present and then any
 *   excess keys are appended to the url search query after the `?`.
 *
 *   Given a template `/path/:verb` and parameter `{verb:'greet', salutation:'Hello'}` results in
 *   URL `/path/greet?salutation=Hello`.
 *
 *   If the parameter value is prefixed with `@` then the value for that parameter will be extracted
 *   from the corresponding property on the `data` object (provided when calling an action method).  For
 *   example, if the `defaultParam` object is `{someParam: '@someProp'}` then the value of `someParam`
 *   will be `data.someProp`.
 *
 * @param {Object.<Object>=} actions Hash with declaration of custom actions that should extend
 *   the default set of resource actions. The declaration should be created in the format of {@link
 *   ng.$http#usage $http.config}:
 *
 *       {action1: {method:?, params:?, isArray:?, headers:?, ...},
 *        action2: {method:?, params:?, isArray:?, headers:?, ...},
 *        ...}
 *
 *   Where:
 *
 *   - **`action`** – {string} – The name of action. This name becomes the name of the method on
 *     your resource object.
 *   - **`method`** – {string} – Case insensitive HTTP method (e.g. `GET`, `POST`, `PUT`,
 *     `DELETE`, `JSONP`, etc).
 *   - **`params`** – {Object=} – Optional set of pre-bound parameters for this action. If any of
 *     the parameter value is a function, it will be executed every time when a param value needs to
 *     be obtained for a request (unless the param was overridden).
 *   - **`url`** – {string} – action specific `url` override. The url templating is supported just
 *     like for the resource-level urls.
 *   - **`isArray`** – {boolean=} – If true then the returned object for this action is an array,
 *     see `returns` section.
 *   - **`transformRequest`** –
 *     `{function(data, headersGetter)|Array.<function(data, headersGetter)>}` –
 *     transform function or an array of such functions. The transform function takes the http
 *     request body and headers and returns its transformed (typically serialized) version.
 *     By default, transformRequest will contain one function that checks if the request data is
 *     an object and serializes to using `angular.toJson`. To prevent this behavior, set
 *     `transformRequest` to an empty array: `transformRequest: []`
 *   - **`transformResponse`** –
 *     `{function(data, headersGetter)|Array.<function(data, headersGetter)>}` –
 *     transform function or an array of such functions. The transform function takes the http
 *     response body and headers and returns its transformed (typically deserialized) version.
 *     By default, transformResponse will contain one function that checks if the response looks like
 *     a JSON string and deserializes it using `angular.fromJson`. To prevent this behavior, set
 *     `transformResponse` to an empty array: `transformResponse: []`
 *   - **`cache`** – `{boolean|Cache}` – If true, a default $http cache will be used to cache the
 *     GET request, otherwise if a cache instance built with
 *     {@link ng.$cacheFactory $cacheFactory}, this cache will be used for
 *     caching.
 *   - **`timeout`** – `{number|Promise}` – timeout in milliseconds, or {@link ng.$q promise} that
 *     should abort the request when resolved.
 *   - **`withCredentials`** - `{boolean}` - whether to set the `withCredentials` flag on the
 *     XHR object. See
 *     [requests with credentials](https://developer.mozilla.org/en/http_access_control#section_5)
 *     for more information.
 *   - **`responseType`** - `{string}` - see
 *     [requestType](https://developer.mozilla.org/en-US/docs/DOM/XMLHttpRequest#responseType).
 *   - **`interceptor`** - `{Object=}` - The interceptor object has two optional methods -
 *     `response` and `responseError`. Both `response` and `responseError` interceptors get called
 *     with `http response` object. See {@link ng.$http $http interceptors}.
 *
 * @param {Object} options Hash with custom settings that should extend the
 *   default `$resourceProvider` behavior.  The only supported option is
 *
 *   Where:
 *
 *   - **`stripTrailingSlashes`** – {boolean} – If true then the trailing
 *   slashes from any calculated URL will be stripped. (Defaults to true.)
 *
 * @returns {Object} A resource "class" object with methods for the default set of resource actions
 *   optionally extended with custom `actions`. The default set contains these actions:
 *   ```js
 *   { 'get':    {method:'GET'},
 *     'save':   {method:'POST'},
 *     'query':  {method:'GET', isArray:true},
 *     'remove': {method:'DELETE'},
 *     'delete': {method:'DELETE'} };
 *   ```
 *
 *   Calling these methods invoke an {@link ng.$http} with the specified http method,
 *   destination and parameters. When the data is returned from the server then the object is an
 *   instance of the resource class. The actions `save`, `remove` and `delete` are available on it
 *   as  methods with the `$` prefix. This allows you to easily perform CRUD operations (create,
 *   read, update, delete) on server-side data like this:
 *   ```js
 *   var User = $resource('/user/:userId', {userId:'@id'});
 *   var user = User.get({userId:123}, function() {
 *     user.abc = true;
 *     user.$save();
 *   });
 *   ```
 *
 *   It is important to realize that invoking a $resource object method immediately returns an
 *   empty reference (object or array depending on `isArray`). Once the data is returned from the
 *   server the existing reference is populated with the actual data. This is a useful trick since
 *   usually the resource is assigned to a model which is then rendered by the view. Having an empty
 *   object results in no rendering, once the data arrives from the server then the object is
 *   populated with the data and the view automatically re-renders itself showing the new data. This
 *   means that in most cases one never has to write a callback function for the action methods.
 *
 *   The action methods on the class object or instance object can be invoked with the following
 *   parameters:
 *
 *   - HTTP GET "class" actions: `Resource.action([parameters], [success], [error])`
 *   - non-GET "class" actions: `Resource.action([parameters], postData, [success], [error])`
 *   - non-GET instance actions:  `instance.$action([parameters], [success], [error])`
 *
 *
 *   Success callback is called with (value, responseHeaders) arguments. Error callback is called
 *   with (httpResponse) argument.
 *
 *   Class actions return empty instance (with additional properties below).
 *   Instance actions return promise of the action.
 *
 *   The Resource instances and collection have these additional properties:
 *
 *   - `$promise`: the {@link ng.$q promise} of the original server interaction that created this
 *     instance or collection.
 *
 *     On success, the promise is resolved with the same resource instance or collection object,
 *     updated with data from server. This makes it easy to use in
 *     {@link ngRoute.$routeProvider resolve section of $routeProvider.when()} to defer view
 *     rendering until the resource(s) are loaded.
 *
 *     On failure, the promise is resolved with the {@link ng.$http http response} object, without
 *     the `resource` property.
 *
 *     If an interceptor object was provided, the promise will instead be resolved with the value
 *     returned by the interceptor.
 *
 *   - `$resolved`: `true` after first server interaction is completed (either with success or
 *      rejection), `false` before that. Knowing if the Resource has been resolved is useful in
 *      data-binding.
 *
 * @example
 *
 * # Credit card resource
 *
 * ```js
     // Define CreditCard class
     var CreditCard = $resource('/user/:userId/card/:cardId',
      {userId:123, cardId:'@id'}, {
       charge: {method:'POST', params:{charge:true}}
      });

     // We can retrieve a collection from the server
     var cards = CreditCard.query(function() {
       // GET: /user/123/card
       // server returns: [ {id:456, number:'1234', name:'Smith'} ];

       var card = cards[0];
       // each item is an instance of CreditCard
       expect(card instanceof CreditCard).toEqual(true);
       card.name = "J. Smith";
       // non GET methods are mapped onto the instances
       card.$save();
       // POST: /user/123/card/456 {id:456, number:'1234', name:'J. Smith'}
       // server returns: {id:456, number:'1234', name: 'J. Smith'};

       // our custom method is mapped as well.
       card.$charge({amount:9.99});
       // POST: /user/123/card/456?amount=9.99&charge=true {id:456, number:'1234', name:'J. Smith'}
     });

     // we can create an instance as well
     var newCard = new CreditCard({number:'0123'});
     newCard.name = "Mike Smith";
     newCard.$save();
     // POST: /user/123/card {number:'0123', name:'Mike Smith'}
     // server returns: {id:789, number:'0123', name: 'Mike Smith'};
     expect(newCard.id).toEqual(789);
 * ```
 *
 * The object returned from this function execution is a resource "class" which has "static" method
 * for each action in the definition.
 *
 * Calling these methods invoke `$http` on the `url` template with the given `method`, `params` and
 * `headers`.
 * When the data is returned from the server then the object is an instance of the resource type and
 * all of the non-GET methods are available with `$` prefix. This allows you to easily support CRUD
 * operations (create, read, update, delete) on server-side data.

   ```js
     var User = $resource('/user/:userId', {userId:'@id'});
     User.get({userId:123}, function(user) {
       user.abc = true;
       user.$save();
     });
   ```
 *
 * It's worth noting that the success callback for `get`, `query` and other methods gets passed
 * in the response that came from the server as well as $http header getter function, so one
 * could rewrite the above example and get access to http headers as:
 *
   ```js
     var User = $resource('/user/:userId', {userId:'@id'});
     User.get({userId:123}, function(u, getResponseHeaders){
       u.abc = true;
       u.$save(function(u, putResponseHeaders) {
         //u => saved user object
         //putResponseHeaders => $http header getter
       });
     });
   ```
 *
 * You can also access the raw `$http` promise via the `$promise` property on the object returned
 *
   ```
     var User = $resource('/user/:userId', {userId:'@id'});
     User.get({userId:123})
         .$promise.then(function(user) {
           $scope.user = user;
         });
   ```

 * # Creating a custom 'PUT' request
 * In this example we create a custom method on our resource to make a PUT request
 * ```js
 *    var app = angular.module('app', ['ngResource', 'ngRoute']);
 *
 *    // Some APIs expect a PUT request in the format URL/object/ID
 *    // Here we are creating an 'update' method
 *    app.factory('Notes', ['$resource', function($resource) {
 *    return $resource('/notes/:id', null,
 *        {
 *            'update': { method:'PUT' }
 *        });
 *    }]);
 *
 *    // In our controller we get the ID from the URL using ngRoute and $routeParams
 *    // We pass in $routeParams and our Notes factory along with $scope
 *    app.controller('NotesCtrl', ['$scope', '$routeParams', 'Notes',
                                      function($scope, $routeParams, Notes) {
 *    // First get a note object from the factory
 *    var note = Notes.get({ id:$routeParams.id });
 *    $id = note.id;
 *
 *    // Now call update passing in the ID first then the object you are updating
 *    Notes.update({ id:$id }, note);
 *
 *    // This will PUT /notes/ID with the note object in the request payload
 *    }]);
 * ```
 */
angular.module('ngResource', ['ng']).
  provider('$resource', function() {
    var provider = this;

    this.defaults = {
      // Strip slashes by default
      stripTrailingSlashes: true,

      // Default actions configuration
      actions: {
        'get': {method: 'GET'},
        'save': {method: 'POST'},
        'query': {method: 'GET', isArray: true},
        'remove': {method: 'DELETE'},
        'delete': {method: 'DELETE'}
      }
    };

    this.$get = ['$http', '$q', function($http, $q) {

      var noop = angular.noop,
        forEach = angular.forEach,
        extend = angular.extend,
        copy = angular.copy,
        isFunction = angular.isFunction;

      /**
       * We need our custom method because encodeURIComponent is too aggressive and doesn't follow
       * http://www.ietf.org/rfc/rfc3986.txt with regards to the character set
       * (pchar) allowed in path segments:
       *    segment       = *pchar
       *    pchar         = unreserved / pct-encoded / sub-delims / ":" / "@"
       *    pct-encoded   = "%" HEXDIG HEXDIG
       *    unreserved    = ALPHA / DIGIT / "-" / "." / "_" / "~"
       *    sub-delims    = "!" / "$" / "&" / "'" / "(" / ")"
       *                     / "*" / "+" / "," / ";" / "="
       */
      function encodeUriSegment(val) {
        return encodeUriQuery(val, true).
          replace(/%26/gi, '&').
          replace(/%3D/gi, '=').
          replace(/%2B/gi, '+');
      }


      /**
       * This method is intended for encoding *key* or *value* parts of query component. We need a
       * custom method because encodeURIComponent is too aggressive and encodes stuff that doesn't
       * have to be encoded per http://tools.ietf.org/html/rfc3986:
       *    query       = *( pchar / "/" / "?" )
       *    pchar         = unreserved / pct-encoded / sub-delims / ":" / "@"
       *    unreserved    = ALPHA / DIGIT / "-" / "." / "_" / "~"
       *    pct-encoded   = "%" HEXDIG HEXDIG
       *    sub-delims    = "!" / "$" / "&" / "'" / "(" / ")"
       *                     / "*" / "+" / "," / ";" / "="
       */
      function encodeUriQuery(val, pctEncodeSpaces) {
        return encodeURIComponent(val).
          replace(/%40/gi, '@').
          replace(/%3A/gi, ':').
          replace(/%24/g, '$').
          replace(/%2C/gi, ',').
          replace(/%20/g, (pctEncodeSpaces ? '%20' : '+'));
      }

      function Route(template, defaults) {
        this.template = template;
        this.defaults = extend({}, provider.defaults, defaults);
        this.urlParams = {};
      }

      Route.prototype = {
        setUrlParams: function(config, params, actionUrl) {
          var self = this,
            url = actionUrl || self.template,
            val,
            encodedVal;

          var urlParams = self.urlParams = {};
          forEach(url.split(/\W/), function(param) {
            if (param === 'hasOwnProperty') {
              throw $resourceMinErr('badname', "hasOwnProperty is not a valid parameter name.");
            }
            if (!(new RegExp("^\\d+$").test(param)) && param &&
              (new RegExp("(^|[^\\\\]):" + param + "(\\W|$)").test(url))) {
              urlParams[param] = true;
            }
          });
          url = url.replace(/\\:/g, ':');

          params = params || {};
          forEach(self.urlParams, function(_, urlParam) {
            val = params.hasOwnProperty(urlParam) ? params[urlParam] : self.defaults[urlParam];
            if (angular.isDefined(val) && val !== null) {
              encodedVal = encodeUriSegment(val);
              url = url.replace(new RegExp(":" + urlParam + "(\\W|$)", "g"), function(match, p1) {
                return encodedVal + p1;
              });
            } else {
              url = url.replace(new RegExp("(\/?):" + urlParam + "(\\W|$)", "g"), function(match,
                  leadingSlashes, tail) {
                if (tail.charAt(0) == '/') {
                  return tail;
                } else {
                  return leadingSlashes + tail;
                }
              });
            }
          });

          // strip trailing slashes and set the url (unless this behavior is specifically disabled)
          if (self.defaults.stripTrailingSlashes) {
            url = url.replace(/\/+$/, '') || '/';
          }

          // then replace collapse `/.` if found in the last URL path segment before the query
          // E.g. `http://url.com/id./format?q=x` becomes `http://url.com/id.format?q=x`
          url = url.replace(/\/\.(?=\w+($|\?))/, '.');
          // replace escaped `/\.` with `/.`
          config.url = url.replace(/\/\\\./, '/.');


          // set params - delegate param encoding to $http
          forEach(params, function(value, key) {
            if (!self.urlParams[key]) {
              config.params = config.params || {};
              config.params[key] = value;
            }
          });
        }
      };


      function resourceFactory(url, paramDefaults, actions, options) {
        var route = new Route(url, options);

        actions = extend({}, provider.defaults.actions, actions);

        function extractParams(data, actionParams) {
          var ids = {};
          actionParams = extend({}, paramDefaults, actionParams);
          forEach(actionParams, function(value, key) {
            if (isFunction(value)) { value = value(); }
            ids[key] = value && value.charAt && value.charAt(0) == '@' ?
              lookupDottedPath(data, value.substr(1)) : value;
          });
          return ids;
        }

        function defaultResponseInterceptor(response) {
          return response.resource;
        }

        function Resource(value) {
          shallowClearAndCopy(value || {}, this);
        }

        Resource.prototype.toJSON = function() {
          var data = extend({}, this);
          delete data.$promise;
          delete data.$resolved;
          return data;
        };

        forEach(actions, function(action, name) {
          var hasBody = /^(POST|PUT|PATCH)$/i.test(action.method);

          Resource[name] = function(a1, a2, a3, a4) {
            var params = {}, data, success, error;

            /* jshint -W086 */ /* (purposefully fall through case statements) */
            switch (arguments.length) {
              case 4:
                error = a4;
                success = a3;
              //fallthrough
              case 3:
              case 2:
                if (isFunction(a2)) {
                  if (isFunction(a1)) {
                    success = a1;
                    error = a2;
                    break;
                  }

                  success = a2;
                  error = a3;
                  //fallthrough
                } else {
                  params = a1;
                  data = a2;
                  success = a3;
                  break;
                }
              case 1:
                if (isFunction(a1)) success = a1;
                else if (hasBody) data = a1;
                else params = a1;
                break;
              case 0: break;
              default:
                throw $resourceMinErr('badargs',
                  "Expected up to 4 arguments [params, data, success, error], got {0} arguments",
                  arguments.length);
            }
            /* jshint +W086 */ /* (purposefully fall through case statements) */

            var isInstanceCall = this instanceof Resource;
            var value = isInstanceCall ? data : (action.isArray ? [] : new Resource(data));
            var httpConfig = {};
            var responseInterceptor = action.interceptor && action.interceptor.response ||
              defaultResponseInterceptor;
            var responseErrorInterceptor = action.interceptor && action.interceptor.responseError ||
              undefined;

            forEach(action, function(value, key) {
              if (key != 'params' && key != 'isArray' && key != 'interceptor') {
                httpConfig[key] = copy(value);
              }
            });

            if (hasBody) httpConfig.data = data;
            route.setUrlParams(httpConfig,
              extend({}, extractParams(data, action.params || {}), params),
              action.url);

            var promise = $http(httpConfig).then(function(response) {
              var data = response.data,
                promise = value.$promise;

              if (data) {
                // Need to convert action.isArray to boolean in case it is undefined
                // jshint -W018
                if (angular.isArray(data) !== (!!action.isArray)) {
                  throw $resourceMinErr('badcfg',
                      'Error in resource configuration for action `{0}`. Expected response to ' +
                      'contain an {1} but got an {2}', name, action.isArray ? 'array' : 'object',
                    angular.isArray(data) ? 'array' : 'object');
                }
                // jshint +W018
                if (action.isArray) {
                  value.length = 0;
                  forEach(data, function(item) {
                    if (typeof item === "object") {
                      value.push(new Resource(item));
                    } else {
                      // Valid JSON values may be string literals, and these should not be converted
                      // into objects. These items will not have access to the Resource prototype
                      // methods, but unfortunately there
                      value.push(item);
                    }
                  });
                } else {
                  shallowClearAndCopy(data, value);
                  value.$promise = promise;
                }
              }

              value.$resolved = true;

              response.resource = value;

              return response;
            }, function(response) {
              value.$resolved = true;

              (error || noop)(response);

              return $q.reject(response);
            });

            promise = promise.then(
              function(response) {
                var value = responseInterceptor(response);
                (success || noop)(value, response.headers);
                return value;
              },
              responseErrorInterceptor);

            if (!isInstanceCall) {
              // we are creating instance / collection
              // - set the initial promise
              // - return the instance / collection
              value.$promise = promise;
              value.$resolved = false;

              return value;
            }

            // instance call
            return promise;
          };


          Resource.prototype['$' + name] = function(params, success, error) {
            if (isFunction(params)) {
              error = success; success = params; params = {};
            }
            var result = Resource[name].call(this, params, this, success, error);
            return result.$promise || result;
          };
        });

        Resource.bind = function(additionalParamDefaults) {
          return resourceFactory(url, extend({}, paramDefaults, additionalParamDefaults), actions);
        };

        return Resource;
      }

      return resourceFactory;
    }];
  });


})(window, window.angular);

},{}],"/home/travis/build/lefant/ng-flickrdupfinder/bower_components/angular-route/angular-route.js":[function(require,module,exports){
/**
 * @license AngularJS v1.3.14
 * (c) 2010-2014 Google, Inc. http://angularjs.org
 * License: MIT
 */
(function(window, angular, undefined) {'use strict';

/**
 * @ngdoc module
 * @name ngRoute
 * @description
 *
 * # ngRoute
 *
 * The `ngRoute` module provides routing and deeplinking services and directives for angular apps.
 *
 * ## Example
 * See {@link ngRoute.$route#example $route} for an example of configuring and using `ngRoute`.
 *
 *
 * <div doc-module-components="ngRoute"></div>
 */
 /* global -ngRouteModule */
var ngRouteModule = angular.module('ngRoute', ['ng']).
                        provider('$route', $RouteProvider),
    $routeMinErr = angular.$$minErr('ngRoute');

/**
 * @ngdoc provider
 * @name $routeProvider
 *
 * @description
 *
 * Used for configuring routes.
 *
 * ## Example
 * See {@link ngRoute.$route#example $route} for an example of configuring and using `ngRoute`.
 *
 * ## Dependencies
 * Requires the {@link ngRoute `ngRoute`} module to be installed.
 */
function $RouteProvider() {
  function inherit(parent, extra) {
    return angular.extend(Object.create(parent), extra);
  }

  var routes = {};

  /**
   * @ngdoc method
   * @name $routeProvider#when
   *
   * @param {string} path Route path (matched against `$location.path`). If `$location.path`
   *    contains redundant trailing slash or is missing one, the route will still match and the
   *    `$location.path` will be updated to add or drop the trailing slash to exactly match the
   *    route definition.
   *
   *    * `path` can contain named groups starting with a colon: e.g. `:name`. All characters up
   *        to the next slash are matched and stored in `$routeParams` under the given `name`
   *        when the route matches.
   *    * `path` can contain named groups starting with a colon and ending with a star:
   *        e.g.`:name*`. All characters are eagerly stored in `$routeParams` under the given `name`
   *        when the route matches.
   *    * `path` can contain optional named groups with a question mark: e.g.`:name?`.
   *
   *    For example, routes like `/color/:color/largecode/:largecode*\/edit` will match
   *    `/color/brown/largecode/code/with/slashes/edit` and extract:
   *
   *    * `color: brown`
   *    * `largecode: code/with/slashes`.
   *
   *
   * @param {Object} route Mapping information to be assigned to `$route.current` on route
   *    match.
   *
   *    Object properties:
   *
   *    - `controller` – `{(string|function()=}` – Controller fn that should be associated with
   *      newly created scope or the name of a {@link angular.Module#controller registered
   *      controller} if passed as a string.
   *    - `controllerAs` – `{string=}` – A controller alias name. If present the controller will be
   *      published to scope under the `controllerAs` name.
   *    - `template` – `{string=|function()=}` – html template as a string or a function that
   *      returns an html template as a string which should be used by {@link
   *      ngRoute.directive:ngView ngView} or {@link ng.directive:ngInclude ngInclude} directives.
   *      This property takes precedence over `templateUrl`.
   *
   *      If `template` is a function, it will be called with the following parameters:
   *
   *      - `{Array.<Object>}` - route parameters extracted from the current
   *        `$location.path()` by applying the current route
   *
   *    - `templateUrl` – `{string=|function()=}` – path or function that returns a path to an html
   *      template that should be used by {@link ngRoute.directive:ngView ngView}.
   *
   *      If `templateUrl` is a function, it will be called with the following parameters:
   *
   *      - `{Array.<Object>}` - route parameters extracted from the current
   *        `$location.path()` by applying the current route
   *
   *    - `resolve` - `{Object.<string, function>=}` - An optional map of dependencies which should
   *      be injected into the controller. If any of these dependencies are promises, the router
   *      will wait for them all to be resolved or one to be rejected before the controller is
   *      instantiated.
   *      If all the promises are resolved successfully, the values of the resolved promises are
   *      injected and {@link ngRoute.$route#$routeChangeSuccess $routeChangeSuccess} event is
   *      fired. If any of the promises are rejected the
   *      {@link ngRoute.$route#$routeChangeError $routeChangeError} event is fired. The map object
   *      is:
   *
   *      - `key` – `{string}`: a name of a dependency to be injected into the controller.
   *      - `factory` - `{string|function}`: If `string` then it is an alias for a service.
   *        Otherwise if function, then it is {@link auto.$injector#invoke injected}
   *        and the return value is treated as the dependency. If the result is a promise, it is
   *        resolved before its value is injected into the controller. Be aware that
   *        `ngRoute.$routeParams` will still refer to the previous route within these resolve
   *        functions.  Use `$route.current.params` to access the new route parameters, instead.
   *
   *    - `redirectTo` – {(string|function())=} – value to update
   *      {@link ng.$location $location} path with and trigger route redirection.
   *
   *      If `redirectTo` is a function, it will be called with the following parameters:
   *
   *      - `{Object.<string>}` - route parameters extracted from the current
   *        `$location.path()` by applying the current route templateUrl.
   *      - `{string}` - current `$location.path()`
   *      - `{Object}` - current `$location.search()`
   *
   *      The custom `redirectTo` function is expected to return a string which will be used
   *      to update `$location.path()` and `$location.search()`.
   *
   *    - `[reloadOnSearch=true]` - {boolean=} - reload route when only `$location.search()`
   *      or `$location.hash()` changes.
   *
   *      If the option is set to `false` and url in the browser changes, then
   *      `$routeUpdate` event is broadcasted on the root scope.
   *
   *    - `[caseInsensitiveMatch=false]` - {boolean=} - match routes without being case sensitive
   *
   *      If the option is set to `true`, then the particular route can be matched without being
   *      case sensitive
   *
   * @returns {Object} self
   *
   * @description
   * Adds a new route definition to the `$route` service.
   */
  this.when = function(path, route) {
    //copy original route object to preserve params inherited from proto chain
    var routeCopy = angular.copy(route);
    if (angular.isUndefined(routeCopy.reloadOnSearch)) {
      routeCopy.reloadOnSearch = true;
    }
    if (angular.isUndefined(routeCopy.caseInsensitiveMatch)) {
      routeCopy.caseInsensitiveMatch = this.caseInsensitiveMatch;
    }
    routes[path] = angular.extend(
      routeCopy,
      path && pathRegExp(path, routeCopy)
    );

    // create redirection for trailing slashes
    if (path) {
      var redirectPath = (path[path.length - 1] == '/')
            ? path.substr(0, path.length - 1)
            : path + '/';

      routes[redirectPath] = angular.extend(
        {redirectTo: path},
        pathRegExp(redirectPath, routeCopy)
      );
    }

    return this;
  };

  /**
   * @ngdoc property
   * @name $routeProvider#caseInsensitiveMatch
   * @description
   *
   * A boolean property indicating if routes defined
   * using this provider should be matched using a case insensitive
   * algorithm. Defaults to `false`.
   */
  this.caseInsensitiveMatch = false;

   /**
    * @param path {string} path
    * @param opts {Object} options
    * @return {?Object}
    *
    * @description
    * Normalizes the given path, returning a regular expression
    * and the original path.
    *
    * Inspired by pathRexp in visionmedia/express/lib/utils.js.
    */
  function pathRegExp(path, opts) {
    var insensitive = opts.caseInsensitiveMatch,
        ret = {
          originalPath: path,
          regexp: path
        },
        keys = ret.keys = [];

    path = path
      .replace(/([().])/g, '\\$1')
      .replace(/(\/)?:(\w+)([\?\*])?/g, function(_, slash, key, option) {
        var optional = option === '?' ? option : null;
        var star = option === '*' ? option : null;
        keys.push({ name: key, optional: !!optional });
        slash = slash || '';
        return ''
          + (optional ? '' : slash)
          + '(?:'
          + (optional ? slash : '')
          + (star && '(.+?)' || '([^/]+)')
          + (optional || '')
          + ')'
          + (optional || '');
      })
      .replace(/([\/$\*])/g, '\\$1');

    ret.regexp = new RegExp('^' + path + '$', insensitive ? 'i' : '');
    return ret;
  }

  /**
   * @ngdoc method
   * @name $routeProvider#otherwise
   *
   * @description
   * Sets route definition that will be used on route change when no other route definition
   * is matched.
   *
   * @param {Object|string} params Mapping information to be assigned to `$route.current`.
   * If called with a string, the value maps to `redirectTo`.
   * @returns {Object} self
   */
  this.otherwise = function(params) {
    if (typeof params === 'string') {
      params = {redirectTo: params};
    }
    this.when(null, params);
    return this;
  };


  this.$get = ['$rootScope',
               '$location',
               '$routeParams',
               '$q',
               '$injector',
               '$templateRequest',
               '$sce',
      function($rootScope, $location, $routeParams, $q, $injector, $templateRequest, $sce) {

    /**
     * @ngdoc service
     * @name $route
     * @requires $location
     * @requires $routeParams
     *
     * @property {Object} current Reference to the current route definition.
     * The route definition contains:
     *
     *   - `controller`: The controller constructor as define in route definition.
     *   - `locals`: A map of locals which is used by {@link ng.$controller $controller} service for
     *     controller instantiation. The `locals` contain
     *     the resolved values of the `resolve` map. Additionally the `locals` also contain:
     *
     *     - `$scope` - The current route scope.
     *     - `$template` - The current route template HTML.
     *
     * @property {Object} routes Object with all route configuration Objects as its properties.
     *
     * @description
     * `$route` is used for deep-linking URLs to controllers and views (HTML partials).
     * It watches `$location.url()` and tries to map the path to an existing route definition.
     *
     * Requires the {@link ngRoute `ngRoute`} module to be installed.
     *
     * You can define routes through {@link ngRoute.$routeProvider $routeProvider}'s API.
     *
     * The `$route` service is typically used in conjunction with the
     * {@link ngRoute.directive:ngView `ngView`} directive and the
     * {@link ngRoute.$routeParams `$routeParams`} service.
     *
     * @example
     * This example shows how changing the URL hash causes the `$route` to match a route against the
     * URL, and the `ngView` pulls in the partial.
     *
     * <example name="$route-service" module="ngRouteExample"
     *          deps="angular-route.js" fixBase="true">
     *   <file name="index.html">
     *     <div ng-controller="MainController">
     *       Choose:
     *       <a href="Book/Moby">Moby</a> |
     *       <a href="Book/Moby/ch/1">Moby: Ch1</a> |
     *       <a href="Book/Gatsby">Gatsby</a> |
     *       <a href="Book/Gatsby/ch/4?key=value">Gatsby: Ch4</a> |
     *       <a href="Book/Scarlet">Scarlet Letter</a><br/>
     *
     *       <div ng-view></div>
     *
     *       <hr />
     *
     *       <pre>$location.path() = {{$location.path()}}</pre>
     *       <pre>$route.current.templateUrl = {{$route.current.templateUrl}}</pre>
     *       <pre>$route.current.params = {{$route.current.params}}</pre>
     *       <pre>$route.current.scope.name = {{$route.current.scope.name}}</pre>
     *       <pre>$routeParams = {{$routeParams}}</pre>
     *     </div>
     *   </file>
     *
     *   <file name="book.html">
     *     controller: {{name}}<br />
     *     Book Id: {{params.bookId}}<br />
     *   </file>
     *
     *   <file name="chapter.html">
     *     controller: {{name}}<br />
     *     Book Id: {{params.bookId}}<br />
     *     Chapter Id: {{params.chapterId}}
     *   </file>
     *
     *   <file name="script.js">
     *     angular.module('ngRouteExample', ['ngRoute'])
     *
     *      .controller('MainController', function($scope, $route, $routeParams, $location) {
     *          $scope.$route = $route;
     *          $scope.$location = $location;
     *          $scope.$routeParams = $routeParams;
     *      })
     *
     *      .controller('BookController', function($scope, $routeParams) {
     *          $scope.name = "BookController";
     *          $scope.params = $routeParams;
     *      })
     *
     *      .controller('ChapterController', function($scope, $routeParams) {
     *          $scope.name = "ChapterController";
     *          $scope.params = $routeParams;
     *      })
     *
     *     .config(function($routeProvider, $locationProvider) {
     *       $routeProvider
     *        .when('/Book/:bookId', {
     *         templateUrl: 'book.html',
     *         controller: 'BookController',
     *         resolve: {
     *           // I will cause a 1 second delay
     *           delay: function($q, $timeout) {
     *             var delay = $q.defer();
     *             $timeout(delay.resolve, 1000);
     *             return delay.promise;
     *           }
     *         }
     *       })
     *       .when('/Book/:bookId/ch/:chapterId', {
     *         templateUrl: 'chapter.html',
     *         controller: 'ChapterController'
     *       });
     *
     *       // configure html5 to get links working on jsfiddle
     *       $locationProvider.html5Mode(true);
     *     });
     *
     *   </file>
     *
     *   <file name="protractor.js" type="protractor">
     *     it('should load and compile correct template', function() {
     *       element(by.linkText('Moby: Ch1')).click();
     *       var content = element(by.css('[ng-view]')).getText();
     *       expect(content).toMatch(/controller\: ChapterController/);
     *       expect(content).toMatch(/Book Id\: Moby/);
     *       expect(content).toMatch(/Chapter Id\: 1/);
     *
     *       element(by.partialLinkText('Scarlet')).click();
     *
     *       content = element(by.css('[ng-view]')).getText();
     *       expect(content).toMatch(/controller\: BookController/);
     *       expect(content).toMatch(/Book Id\: Scarlet/);
     *     });
     *   </file>
     * </example>
     */

    /**
     * @ngdoc event
     * @name $route#$routeChangeStart
     * @eventType broadcast on root scope
     * @description
     * Broadcasted before a route change. At this  point the route services starts
     * resolving all of the dependencies needed for the route change to occur.
     * Typically this involves fetching the view template as well as any dependencies
     * defined in `resolve` route property. Once  all of the dependencies are resolved
     * `$routeChangeSuccess` is fired.
     *
     * The route change (and the `$location` change that triggered it) can be prevented
     * by calling `preventDefault` method of the event. See {@link ng.$rootScope.Scope#$on}
     * for more details about event object.
     *
     * @param {Object} angularEvent Synthetic event object.
     * @param {Route} next Future route information.
     * @param {Route} current Current route information.
     */

    /**
     * @ngdoc event
     * @name $route#$routeChangeSuccess
     * @eventType broadcast on root scope
     * @description
     * Broadcasted after a route dependencies are resolved.
     * {@link ngRoute.directive:ngView ngView} listens for the directive
     * to instantiate the controller and render the view.
     *
     * @param {Object} angularEvent Synthetic event object.
     * @param {Route} current Current route information.
     * @param {Route|Undefined} previous Previous route information, or undefined if current is
     * first route entered.
     */

    /**
     * @ngdoc event
     * @name $route#$routeChangeError
     * @eventType broadcast on root scope
     * @description
     * Broadcasted if any of the resolve promises are rejected.
     *
     * @param {Object} angularEvent Synthetic event object
     * @param {Route} current Current route information.
     * @param {Route} previous Previous route information.
     * @param {Route} rejection Rejection of the promise. Usually the error of the failed promise.
     */

    /**
     * @ngdoc event
     * @name $route#$routeUpdate
     * @eventType broadcast on root scope
     * @description
     *
     * The `reloadOnSearch` property has been set to false, and we are reusing the same
     * instance of the Controller.
     */

    var forceReload = false,
        preparedRoute,
        preparedRouteIsUpdateOnly,
        $route = {
          routes: routes,

          /**
           * @ngdoc method
           * @name $route#reload
           *
           * @description
           * Causes `$route` service to reload the current route even if
           * {@link ng.$location $location} hasn't changed.
           *
           * As a result of that, {@link ngRoute.directive:ngView ngView}
           * creates new scope and reinstantiates the controller.
           */
          reload: function() {
            forceReload = true;
            $rootScope.$evalAsync(function() {
              // Don't support cancellation of a reload for now...
              prepareRoute();
              commitRoute();
            });
          },

          /**
           * @ngdoc method
           * @name $route#updateParams
           *
           * @description
           * Causes `$route` service to update the current URL, replacing
           * current route parameters with those specified in `newParams`.
           * Provided property names that match the route's path segment
           * definitions will be interpolated into the location's path, while
           * remaining properties will be treated as query params.
           *
           * @param {!Object<string, string>} newParams mapping of URL parameter names to values
           */
          updateParams: function(newParams) {
            if (this.current && this.current.$$route) {
              newParams = angular.extend({}, this.current.params, newParams);
              $location.path(interpolate(this.current.$$route.originalPath, newParams));
              // interpolate modifies newParams, only query params are left
              $location.search(newParams);
            } else {
              throw $routeMinErr('norout', 'Tried updating route when with no current route');
            }
          }
        };

    $rootScope.$on('$locationChangeStart', prepareRoute);
    $rootScope.$on('$locationChangeSuccess', commitRoute);

    return $route;

    /////////////////////////////////////////////////////

    /**
     * @param on {string} current url
     * @param route {Object} route regexp to match the url against
     * @return {?Object}
     *
     * @description
     * Check if the route matches the current url.
     *
     * Inspired by match in
     * visionmedia/express/lib/router/router.js.
     */
    function switchRouteMatcher(on, route) {
      var keys = route.keys,
          params = {};

      if (!route.regexp) return null;

      var m = route.regexp.exec(on);
      if (!m) return null;

      for (var i = 1, len = m.length; i < len; ++i) {
        var key = keys[i - 1];

        var val = m[i];

        if (key && val) {
          params[key.name] = val;
        }
      }
      return params;
    }

    function prepareRoute($locationEvent) {
      var lastRoute = $route.current;

      preparedRoute = parseRoute();
      preparedRouteIsUpdateOnly = preparedRoute && lastRoute && preparedRoute.$$route === lastRoute.$$route
          && angular.equals(preparedRoute.pathParams, lastRoute.pathParams)
          && !preparedRoute.reloadOnSearch && !forceReload;

      if (!preparedRouteIsUpdateOnly && (lastRoute || preparedRoute)) {
        if ($rootScope.$broadcast('$routeChangeStart', preparedRoute, lastRoute).defaultPrevented) {
          if ($locationEvent) {
            $locationEvent.preventDefault();
          }
        }
      }
    }

    function commitRoute() {
      var lastRoute = $route.current;
      var nextRoute = preparedRoute;

      if (preparedRouteIsUpdateOnly) {
        lastRoute.params = nextRoute.params;
        angular.copy(lastRoute.params, $routeParams);
        $rootScope.$broadcast('$routeUpdate', lastRoute);
      } else if (nextRoute || lastRoute) {
        forceReload = false;
        $route.current = nextRoute;
        if (nextRoute) {
          if (nextRoute.redirectTo) {
            if (angular.isString(nextRoute.redirectTo)) {
              $location.path(interpolate(nextRoute.redirectTo, nextRoute.params)).search(nextRoute.params)
                       .replace();
            } else {
              $location.url(nextRoute.redirectTo(nextRoute.pathParams, $location.path(), $location.search()))
                       .replace();
            }
          }
        }

        $q.when(nextRoute).
          then(function() {
            if (nextRoute) {
              var locals = angular.extend({}, nextRoute.resolve),
                  template, templateUrl;

              angular.forEach(locals, function(value, key) {
                locals[key] = angular.isString(value) ?
                    $injector.get(value) : $injector.invoke(value, null, null, key);
              });

              if (angular.isDefined(template = nextRoute.template)) {
                if (angular.isFunction(template)) {
                  template = template(nextRoute.params);
                }
              } else if (angular.isDefined(templateUrl = nextRoute.templateUrl)) {
                if (angular.isFunction(templateUrl)) {
                  templateUrl = templateUrl(nextRoute.params);
                }
                templateUrl = $sce.getTrustedResourceUrl(templateUrl);
                if (angular.isDefined(templateUrl)) {
                  nextRoute.loadedTemplateUrl = templateUrl;
                  template = $templateRequest(templateUrl);
                }
              }
              if (angular.isDefined(template)) {
                locals['$template'] = template;
              }
              return $q.all(locals);
            }
          }).
          // after route change
          then(function(locals) {
            if (nextRoute == $route.current) {
              if (nextRoute) {
                nextRoute.locals = locals;
                angular.copy(nextRoute.params, $routeParams);
              }
              $rootScope.$broadcast('$routeChangeSuccess', nextRoute, lastRoute);
            }
          }, function(error) {
            if (nextRoute == $route.current) {
              $rootScope.$broadcast('$routeChangeError', nextRoute, lastRoute, error);
            }
          });
      }
    }


    /**
     * @returns {Object} the current active route, by matching it against the URL
     */
    function parseRoute() {
      // Match a route
      var params, match;
      angular.forEach(routes, function(route, path) {
        if (!match && (params = switchRouteMatcher($location.path(), route))) {
          match = inherit(route, {
            params: angular.extend({}, $location.search(), params),
            pathParams: params});
          match.$$route = route;
        }
      });
      // No route matched; fallback to "otherwise" route
      return match || routes[null] && inherit(routes[null], {params: {}, pathParams:{}});
    }

    /**
     * @returns {string} interpolation of the redirect path with the parameters
     */
    function interpolate(string, params) {
      var result = [];
      angular.forEach((string || '').split(':'), function(segment, i) {
        if (i === 0) {
          result.push(segment);
        } else {
          var segmentMatch = segment.match(/(\w+)(?:[?*])?(.*)/);
          var key = segmentMatch[1];
          result.push(params[key]);
          result.push(segmentMatch[2] || '');
          delete params[key];
        }
      });
      return result.join('');
    }
  }];
}

ngRouteModule.provider('$routeParams', $RouteParamsProvider);


/**
 * @ngdoc service
 * @name $routeParams
 * @requires $route
 *
 * @description
 * The `$routeParams` service allows you to retrieve the current set of route parameters.
 *
 * Requires the {@link ngRoute `ngRoute`} module to be installed.
 *
 * The route parameters are a combination of {@link ng.$location `$location`}'s
 * {@link ng.$location#search `search()`} and {@link ng.$location#path `path()`}.
 * The `path` parameters are extracted when the {@link ngRoute.$route `$route`} path is matched.
 *
 * In case of parameter name collision, `path` params take precedence over `search` params.
 *
 * The service guarantees that the identity of the `$routeParams` object will remain unchanged
 * (but its properties will likely change) even when a route change occurs.
 *
 * Note that the `$routeParams` are only updated *after* a route change completes successfully.
 * This means that you cannot rely on `$routeParams` being correct in route resolve functions.
 * Instead you can use `$route.current.params` to access the new route's parameters.
 *
 * @example
 * ```js
 *  // Given:
 *  // URL: http://server.com/index.html#/Chapter/1/Section/2?search=moby
 *  // Route: /Chapter/:chapterId/Section/:sectionId
 *  //
 *  // Then
 *  $routeParams ==> {chapterId:'1', sectionId:'2', search:'moby'}
 * ```
 */
function $RouteParamsProvider() {
  this.$get = function() { return {}; };
}

ngRouteModule.directive('ngView', ngViewFactory);
ngRouteModule.directive('ngView', ngViewFillContentFactory);


/**
 * @ngdoc directive
 * @name ngView
 * @restrict ECA
 *
 * @description
 * # Overview
 * `ngView` is a directive that complements the {@link ngRoute.$route $route} service by
 * including the rendered template of the current route into the main layout (`index.html`) file.
 * Every time the current route changes, the included view changes with it according to the
 * configuration of the `$route` service.
 *
 * Requires the {@link ngRoute `ngRoute`} module to be installed.
 *
 * @animations
 * enter - animation is used to bring new content into the browser.
 * leave - animation is used to animate existing content away.
 *
 * The enter and leave animation occur concurrently.
 *
 * @scope
 * @priority 400
 * @param {string=} onload Expression to evaluate whenever the view updates.
 *
 * @param {string=} autoscroll Whether `ngView` should call {@link ng.$anchorScroll
 *                  $anchorScroll} to scroll the viewport after the view is updated.
 *
 *                  - If the attribute is not set, disable scrolling.
 *                  - If the attribute is set without value, enable scrolling.
 *                  - Otherwise enable scrolling only if the `autoscroll` attribute value evaluated
 *                    as an expression yields a truthy value.
 * @example
    <example name="ngView-directive" module="ngViewExample"
             deps="angular-route.js;angular-animate.js"
             animations="true" fixBase="true">
      <file name="index.html">
        <div ng-controller="MainCtrl as main">
          Choose:
          <a href="Book/Moby">Moby</a> |
          <a href="Book/Moby/ch/1">Moby: Ch1</a> |
          <a href="Book/Gatsby">Gatsby</a> |
          <a href="Book/Gatsby/ch/4?key=value">Gatsby: Ch4</a> |
          <a href="Book/Scarlet">Scarlet Letter</a><br/>

          <div class="view-animate-container">
            <div ng-view class="view-animate"></div>
          </div>
          <hr />

          <pre>$location.path() = {{main.$location.path()}}</pre>
          <pre>$route.current.templateUrl = {{main.$route.current.templateUrl}}</pre>
          <pre>$route.current.params = {{main.$route.current.params}}</pre>
          <pre>$routeParams = {{main.$routeParams}}</pre>
        </div>
      </file>

      <file name="book.html">
        <div>
          controller: {{book.name}}<br />
          Book Id: {{book.params.bookId}}<br />
        </div>
      </file>

      <file name="chapter.html">
        <div>
          controller: {{chapter.name}}<br />
          Book Id: {{chapter.params.bookId}}<br />
          Chapter Id: {{chapter.params.chapterId}}
        </div>
      </file>

      <file name="animations.css">
        .view-animate-container {
          position:relative;
          height:100px!important;
          background:white;
          border:1px solid black;
          height:40px;
          overflow:hidden;
        }

        .view-animate {
          padding:10px;
        }

        .view-animate.ng-enter, .view-animate.ng-leave {
          -webkit-transition:all cubic-bezier(0.250, 0.460, 0.450, 0.940) 1.5s;
          transition:all cubic-bezier(0.250, 0.460, 0.450, 0.940) 1.5s;

          display:block;
          width:100%;
          border-left:1px solid black;

          position:absolute;
          top:0;
          left:0;
          right:0;
          bottom:0;
          padding:10px;
        }

        .view-animate.ng-enter {
          left:100%;
        }
        .view-animate.ng-enter.ng-enter-active {
          left:0;
        }
        .view-animate.ng-leave.ng-leave-active {
          left:-100%;
        }
      </file>

      <file name="script.js">
        angular.module('ngViewExample', ['ngRoute', 'ngAnimate'])
          .config(['$routeProvider', '$locationProvider',
            function($routeProvider, $locationProvider) {
              $routeProvider
                .when('/Book/:bookId', {
                  templateUrl: 'book.html',
                  controller: 'BookCtrl',
                  controllerAs: 'book'
                })
                .when('/Book/:bookId/ch/:chapterId', {
                  templateUrl: 'chapter.html',
                  controller: 'ChapterCtrl',
                  controllerAs: 'chapter'
                });

              $locationProvider.html5Mode(true);
          }])
          .controller('MainCtrl', ['$route', '$routeParams', '$location',
            function($route, $routeParams, $location) {
              this.$route = $route;
              this.$location = $location;
              this.$routeParams = $routeParams;
          }])
          .controller('BookCtrl', ['$routeParams', function($routeParams) {
            this.name = "BookCtrl";
            this.params = $routeParams;
          }])
          .controller('ChapterCtrl', ['$routeParams', function($routeParams) {
            this.name = "ChapterCtrl";
            this.params = $routeParams;
          }]);

      </file>

      <file name="protractor.js" type="protractor">
        it('should load and compile correct template', function() {
          element(by.linkText('Moby: Ch1')).click();
          var content = element(by.css('[ng-view]')).getText();
          expect(content).toMatch(/controller\: ChapterCtrl/);
          expect(content).toMatch(/Book Id\: Moby/);
          expect(content).toMatch(/Chapter Id\: 1/);

          element(by.partialLinkText('Scarlet')).click();

          content = element(by.css('[ng-view]')).getText();
          expect(content).toMatch(/controller\: BookCtrl/);
          expect(content).toMatch(/Book Id\: Scarlet/);
        });
      </file>
    </example>
 */


/**
 * @ngdoc event
 * @name ngView#$viewContentLoaded
 * @eventType emit on the current ngView scope
 * @description
 * Emitted every time the ngView content is reloaded.
 */
ngViewFactory.$inject = ['$route', '$anchorScroll', '$animate'];
function ngViewFactory($route, $anchorScroll, $animate) {
  return {
    restrict: 'ECA',
    terminal: true,
    priority: 400,
    transclude: 'element',
    link: function(scope, $element, attr, ctrl, $transclude) {
        var currentScope,
            currentElement,
            previousLeaveAnimation,
            autoScrollExp = attr.autoscroll,
            onloadExp = attr.onload || '';

        scope.$on('$routeChangeSuccess', update);
        update();

        function cleanupLastView() {
          if (previousLeaveAnimation) {
            $animate.cancel(previousLeaveAnimation);
            previousLeaveAnimation = null;
          }

          if (currentScope) {
            currentScope.$destroy();
            currentScope = null;
          }
          if (currentElement) {
            previousLeaveAnimation = $animate.leave(currentElement);
            previousLeaveAnimation.then(function() {
              previousLeaveAnimation = null;
            });
            currentElement = null;
          }
        }

        function update() {
          var locals = $route.current && $route.current.locals,
              template = locals && locals.$template;

          if (angular.isDefined(template)) {
            var newScope = scope.$new();
            var current = $route.current;

            // Note: This will also link all children of ng-view that were contained in the original
            // html. If that content contains controllers, ... they could pollute/change the scope.
            // However, using ng-view on an element with additional content does not make sense...
            // Note: We can't remove them in the cloneAttchFn of $transclude as that
            // function is called before linking the content, which would apply child
            // directives to non existing elements.
            var clone = $transclude(newScope, function(clone) {
              $animate.enter(clone, null, currentElement || $element).then(function onNgViewEnter() {
                if (angular.isDefined(autoScrollExp)
                  && (!autoScrollExp || scope.$eval(autoScrollExp))) {
                  $anchorScroll();
                }
              });
              cleanupLastView();
            });

            currentElement = clone;
            currentScope = current.scope = newScope;
            currentScope.$emit('$viewContentLoaded');
            currentScope.$eval(onloadExp);
          } else {
            cleanupLastView();
          }
        }
    }
  };
}

// This directive is called during the $transclude call of the first `ngView` directive.
// It will replace and compile the content of the element with the loaded template.
// We need this directive so that the element content is already filled when
// the link function of another directive on the same element as ngView
// is called.
ngViewFillContentFactory.$inject = ['$compile', '$controller', '$route'];
function ngViewFillContentFactory($compile, $controller, $route) {
  return {
    restrict: 'ECA',
    priority: -400,
    link: function(scope, $element) {
      var current = $route.current,
          locals = current.locals;

      $element.html(locals.$template);

      var link = $compile($element.contents());

      if (current.controller) {
        locals.$scope = scope;
        var controller = $controller(current.controller, locals);
        if (current.controllerAs) {
          scope[current.controllerAs] = controller;
        }
        $element.data('$ngControllerController', controller);
        $element.children().data('$ngControllerController', controller);
      }

      link(scope);
    }
  };
}


})(window, window.angular);

},{}],"/home/travis/build/lefant/ng-flickrdupfinder/bower_components/oauth-js/dist/oauth.min.js":[function(require,module,exports){
!function a(b,c,d){function e(g,h){if(!c[g]){if(!b[g]){var i="function"==typeof require&&require;if(!h&&i)return i(g,!0);if(f)return f(g,!0);throw new Error("Cannot find module '"+g+"'")}var j=c[g]={exports:{}};b[g][0].call(j.exports,function(a){var c=b[g][1][a];return e(c?c:a)},j,j.exports,a,b,c,d)}return c[g].exports}for(var f="function"==typeof require&&require,g=0;g<d.length;g++)e(d[g]);return e}({1:[function(a,b){b.exports={oauthd_url:"https://oauth.io",oauthd_api:"https://oauth.io/api",version:"web-0.4.0",options:{}}},{}],2:[function(a,b){"use strict";b.exports=function(a){var b;return b=a.getJquery(),{get:function(){return function(c,d){var e;return e=a.getOAuthdURL(),b.ajax({url:e+c,type:"get",data:d})}}(this),post:function(){return function(c,d){var e;return e=a.getOAuthdURL(),b.ajax({url:e+c,type:"post",data:d})}}(this),put:function(){return function(c,d){var e;return e=a.getOAuthdURL(),b.ajax({url:e+c,type:"put",data:d})}}(this),del:function(){return function(c,d){var e;return e=a.getOAuthdURL(),b.ajax({url:e+c,type:"delete",data:d})}}(this)}}},{}],3:[function(a,b){"use strict";var c,d,e,f,g;f=a("../config"),d=a("../tools/url"),c=a("../tools/location_operations"),g=a("../tools/cookies"),e=a("../tools/cache"),b.exports=function(a,b,h,i){var j,k;return d=d(b),g.init(f,b),k=c(b),e.init(g,f),j={initialize:function(a,b){var c;if(f.key=a,b)for(c in b)f.options[c]=b[c]},setOAuthdURL:function(a){f.oauthd_url=a,f.oauthd_base=d.getAbsUrl(f.oauthd_url).match(/^.{2,5}:\/\/[^/]+/)[0]},getOAuthdURL:function(){return f.oauthd_url},getVersion:function(){return f.version},extend:function(a,b){return this[a]=b(this)},getConfig:function(){return f},getWindow:function(){return a},getDocument:function(){return b},getNavigator:function(){return i},getJquery:function(){return h},getUrl:function(){return d},getCache:function(){return e},getCookies:function(){return g},getLocationOperations:function(){return k}}}},{"../config":1,"../tools/cache":9,"../tools/cookies":10,"../tools/location_operations":12,"../tools/url":14}],4:[function(a,b){"use strict";var c,d,e;c=a("../tools/cookies"),d=a("./request"),e=a("../tools/sha1"),b.exports=function(b){var f,g,h,i,j,k,l,m,n,o,p,q,r;return g=b.getUrl(),j=b.getConfig(),k=b.getDocument(),r=b.getWindow(),f=b.getJquery(),h=b.getCache(),q=a("./providers")(b),j.oauthd_base=g.getAbsUrl(j.oauthd_url).match(/^.{2,5}:\/\/[^/]+/)[0],i=[],n=void 0,(p=function(){var a,b;b=/[\\#&]oauthio=([^&]*)/.exec(k.location.hash),b&&(k.location.hash=k.location.hash.replace(/&?oauthio=[^&]*/,""),n=decodeURIComponent(b[1].replace(/\+/g," ")),a=c.readCookie("oauthio_state"),a&&(i.push(a),c.eraseCookie("oauthio_state")))})(),l=b.getLocationOperations(),o={request:d(b,i,q)},m={initialize:function(a,c){return b.initialize(a,c)},setOAuthdURL:function(a){j.oauthd_url=a,j.oauthd_base=g.getAbsUrl(j.oauthd_url).match(/^.{2,5}:\/\/[^/]+/)[0]},create:function(a,b,c){var d,e,f,g;if(!b)return h.tryCache(m,a,!0);"object"!=typeof c&&q.fetchDescription(a),e=function(d){return o.request.mkHttp(a,b,c,d)},f=function(d,e){return o.request.mkHttpEndpoint(a,b,c,d,e)},g={};for(d in b)g[d]=b[d];return g.get=e("GET"),g.post=e("POST"),g.put=e("PUT"),g.patch=e("PATCH"),g.del=e("DELETE"),g.me=o.request.mkHttpMe(a,b,c,"GET"),g},popup:function(a,b,c){var d,l,n,p,q,s,t,u,v,w,x;return p=!1,n=function(a){if(!p){if(a.origin!==j.oauthd_base)return;try{u.close()}catch(c){}return b.data=a.data,o.request.sendCallback(b,d),p=!0}},u=void 0,l=void 0,v=void 0,d=f.Deferred(),b=b||{},j.key?(2===arguments.length&&"function"==typeof b&&(c=b,b={}),h.cacheEnabled(b.cache)&&(s=h.tryCache(m,a,b.cache))?(null!=d&&d.resolve(s),c?c(null,s):d.promise()):(b.state||(b.state=e.create_hash(),b.state_type="client"),i.push(b.state),t=j.oauthd_url+"/auth/"+a+"?k="+j.key,t+="&d="+encodeURIComponent(g.getAbsUrl("/")),b&&(t+="&opts="+encodeURIComponent(JSON.stringify(b))),b.wnd_settings?(x=b.wnd_settings,delete b.wnd_settings):x={width:Math.floor(.8*r.outerWidth),height:Math.floor(.5*r.outerHeight)},null==x.height&&(x.height=x.height<350?350:void 0),null==x.width&&(x.width=x.width<800?800:void 0),null==x.left&&(x.left=r.screenX+(r.outerWidth-x.width)/2),null==x.top&&(x.top=r.screenY+(r.outerHeight-x.height)/8),w="width="+x.width+",height="+x.height,w+=",toolbar=0,scrollbars=1,status=1,resizable=1,location=1,menuBar=0",w+=",left="+x.left+",top="+x.top,b={provider:a,cache:b.cache},b.callback=function(a,d){return r.removeEventListener?r.removeEventListener("message",n,!1):r.detachEvent?r.detachEvent("onmessage",n):k.detachEvent&&k.detachEvent("onmessage",n),b.callback=function(){},v&&(clearTimeout(v),v=void 0),c?c(a,d):void 0},r.attachEvent?r.attachEvent("onmessage",n):k.attachEvent?k.attachEvent("onmessage",n):r.addEventListener&&r.addEventListener("message",n,!1),"undefined"!=typeof chrome&&chrome.runtime&&chrome.runtime.onMessageExternal&&chrome.runtime.onMessageExternal.addListener(function(a,b){return a.origin=b.url.match(/^.{2,5}:\/\/[^/]+/)[0],null!=d&&d.resolve(),n(a)}),!l&&(-1!==navigator.userAgent.indexOf("MSIE")||navigator.appVersion.indexOf("Trident/")>0)&&(l=k.createElement("iframe"),l.src=j.oauthd_url+"/auth/iframe?d="+encodeURIComponent(g.getAbsUrl("/")),l.width=0,l.height=0,l.frameBorder=0,l.style.visibility="hidden",k.body.appendChild(l)),v=setTimeout(function(){null!=d&&d.reject(new Error("Authorization timed out")),b.callback&&"function"==typeof b.callback&&b.callback(new Error("Authorization timed out"));try{u.close()}catch(a){}},12e5),u=r.open(t,"Authorization",w),u?(u.focus(),q=r.setInterval(function(){return null!==u&&!u.closed||(r.clearInterval(q),p||(null!=d&&d.reject(new Error("The popup was closed")),!b.callback||"function"!=typeof b.callback))?void 0:b.callback(new Error("The popup was closed"))},500)):(null!=d&&d.reject(new Error("Could not open a popup")),b.callback&&"function"==typeof b.callback&&b.callback(new Error("Could not open a popup"))),null!=d?d.promise():void 0)):(null!=d&&d.reject(new Error("OAuth object must be initialized")),null==c?d.promise():c(new Error("OAuth object must be initialized")))},redirect:function(a,b,d){var f,i;return 2===arguments.length&&(d=b,b={}),h.cacheEnabled(b.cache)&&(i=h.tryCache(m,a,b.cache))?(d=g.getAbsUrl(d)+(-1===d.indexOf("#")?"#":"&")+"oauthio=cache",l.changeHref(d),void l.reload()):(b.state||(b.state=e.create_hash(),b.state_type="client"),c.createCookie("oauthio_state",b.state),f=encodeURIComponent(g.getAbsUrl(d)),d=j.oauthd_url+"/auth/"+a+"?k="+j.key,d+="&redirect_uri="+f,b&&(d+="&opts="+encodeURIComponent(JSON.stringify(b))),void l.changeHref(d))},callback:function(a,b,c){var d,e;if(d=f.Deferred(),1===arguments.length&&"function"==typeof a&&(c=a,a=void 0,b={}),1===arguments.length&&"string"==typeof a&&(b={}),2===arguments.length&&"function"==typeof b&&(c=b,b={}),h.cacheEnabled(b.cache)||"cache"===n){if(e=h.tryCache(m,a,b.cache),"cache"===n&&("string"!=typeof a||!a))return null!=d&&d.reject(new Error("You must set a provider when using the cache")),c?c(new Error("You must set a provider when using the cache")):null!=d?d.promise():void 0;if(e){if(!c)return null!=d&&d.resolve(e),null!=d?d.promise():void 0;if(e)return c(null,e)}}return n?(o.request.sendCallback({data:n,provider:a,cache:b.cache,callback:c},d),null!=d?d.promise():void 0):void 0},clearCache:function(a){c.eraseCookie("oauthio_provider_"+a)},http_me:function(a){o.request.http_me&&o.request.http_me(a)},http:function(a){o.request.http&&o.request.http(a)},getVersion:function(){return b.getVersion.apply(this)}}}},{"../tools/cookies":10,"../tools/sha1":13,"./providers":5,"./request":6}],5:[function(a,b){"use strict";var c;c=a("../config"),b.exports=function(a){var b,d,e,f;return b=a.getJquery(),f={},e={},d={execProvidersCb:function(a,b,c){var d,f;if(e[a]){d=e[a],delete e[a];for(f in d)d[f](b,c)}},fetchDescription:function(a){f[a]||(f[a]=!0,b.ajax({url:c.oauthd_api+"/providers/"+a,data:{extend:!0},dataType:"json"}).done(function(b){f[a]=b.data,d.execProvidersCb(a,null,b.data)}).always(function(){"object"!=typeof f[a]&&(delete f[a],d.execProvidersCb(a,new Error("Unable to fetch request description")))}))},getDescription:function(a,b,c){return b=b||{},"object"==typeof f[a]?c(null,f[a]):(f[a]||d.fetchDescription(a),b.wait?(e[a]=e[a]||[],void e[a].push(c)):c(null,{}))}}}},{"../config":1}],6:[function(a,b){"use strict";var c,d,e=[].indexOf||function(a){for(var b=0,c=this.length;c>b;b++)if(b in this&&this[b]===a)return b;return-1};d=a("../tools/url")(),c=a("q"),b.exports=function(a,b,f){var g,h,i,j,k;return g=a.getJquery(),i=a.getConfig(),h=a.getCache(),j=[],k=!1,{retrieveMethods:function(){var a;return a=c.defer(),k?a.resolve(j):g.ajax(i.oauthd_url+"/api/extended-endpoints").then(function(b){return j=b.data,k=!0,a.resolve()}).fail(function(b){return k=!0,a.reject(b)}),a.promise},generateMethods:function(a,b,c){var d,e,f,g,h,i,k;if(null!=j){k=[];for(d in j)h=j[d],f=h.name.split("."),g=a,k.push(function(){var a;a=[];for(e in f)i=f[e],e<f.length-1?(null==g[i]&&(g[i]={}),a.push(g=g[i])):a.push(g[i]=this.mkHttpAll(c,b,h,arguments));return a}.apply(this,arguments));return k}},http:function(a){var b,c,h,j,k;h=function(){var a,b,c,f;if(f=k.oauthio.request||{},!f.cors){k.url=encodeURIComponent(k.url),"/"!==k.url[0]&&(k.url="/"+k.url),k.url=i.oauthd_url+"/request/"+k.oauthio.provider+k.url,k.headers=k.headers||{},k.headers.oauthio="k="+i.key,k.oauthio.tokens.oauth_token&&k.oauthio.tokens.oauth_token_secret&&(k.headers.oauthio+="&oauthv=1");for(b in k.oauthio.tokens)k.headers.oauthio+="&"+encodeURIComponent(b)+"="+encodeURIComponent(k.oauthio.tokens[b]);return delete k.oauthio,g.ajax(k)}if(k.oauthio.tokens){if(k.oauthio.tokens.access_token&&(k.oauthio.tokens.token=k.oauthio.tokens.access_token),k.url.match(/^[a-z]{2,16}:\/\//)||("/"!==k.url[0]&&(k.url="/"+k.url),k.url=f.url+k.url),k.url=d.replaceParam(k.url,k.oauthio.tokens,f.parameters),f.query){c=[];for(a in f.query)c.push(encodeURIComponent(a)+"="+encodeURIComponent(d.replaceParam(f.query[a],k.oauthio.tokens,f.parameters)));k.url+=e.call(k.url,"?")>=0?"&"+c:"?"+c}if(f.headers){k.headers=k.headers||{};for(a in f.headers)k.headers[a]=d.replaceParam(f.headers[a],k.oauthio.tokens,f.parameters)}return delete k.oauthio,g.ajax(k)}},k={},j=void 0;for(j in a)k[j]=a[j];return k.oauthio.request&&k.oauthio.request!==!0?h():(c={wait:!!k.oauthio.request},b=g.Deferred(),f.getDescription(k.oauthio.provider,c,function(a,c){return a?b.reject(a):(k.oauthio.request=k.oauthio.tokens.oauth_token&&k.oauthio.tokens.oauth_token_secret?c.oauth1&&c.oauth1.request:c.oauth2&&c.oauth2.request,void b.resolve())}),b.then(h))},http_me:function(a){var b,c,d,e,h;d=function(){var a,b,c,d;a=g.Deferred(),d=h.oauthio.request||{},h.url=i.oauthd_url+"/auth/"+h.oauthio.provider+"/me",h.headers=h.headers||{},h.headers.oauthio="k="+i.key,h.oauthio.tokens.oauth_token&&h.oauthio.tokens.oauth_token_secret&&(h.headers.oauthio+="&oauthv=1");for(b in h.oauthio.tokens)h.headers.oauthio+="&"+encodeURIComponent(b)+"="+encodeURIComponent(h.oauthio.tokens[b]);return delete h.oauthio,c=g.ajax(h),g.when(c).done(function(b){a.resolve(b.data)}).fail(function(b){a.reject(b.responseJSON?b.responseJSON.data:new Error("An error occured while trying to access the resource"))}),a.promise()},h={};for(e in a)h[e]=a[e];return h.oauthio.request&&h.oauthio.request!==!0?d():(c={wait:!!h.oauthio.request},b=g.Deferred(),f.getDescription(h.oauthio.provider,c,function(a,c){return a?b.reject(a):(h.oauthio.request=h.oauthio.tokens.oauth_token&&h.oauthio.tokens.oauth_token_secret?c.oauth1&&c.oauth1.request:c.oauth2&&c.oauth2.request,void b.resolve())}),b.then(d))},http_all:function(a){var b;return(b=function(){var b,c,d,e;b=g.Deferred(),e=a.oauthio.request||{},a.headers=a.headers||{},a.headers.oauthio="k="+i.key,a.oauthio.tokens.oauth_token&&a.oauthio.tokens.oauth_token_secret&&(a.headers.oauthio+="&oauthv=1");for(c in a.oauthio.tokens)a.headers.oauthio+="&"+encodeURIComponent(c)+"="+encodeURIComponent(a.oauthio.tokens[c]);return delete a.oauthio,d=g.ajax(a),g.when(d).done(function(a){var c;if("string"==typeof a.data)try{a.data=JSON.parse(a.data)}catch(d){c=d,a.data=a.data}finally{b.resolve(a.data)}}).fail(function(a){b.reject(a.responseJSON?a.responseJSON.data:new Error("An error occured while trying to access the resource"))}),b.promise()})()},mkHttp:function(a,b,c,d){var e;return e=this,function(f,g){var h,i;if(i={},"string"==typeof f){if("object"==typeof g)for(h in g)i[h]=g[h];i.url=f}else if("object"==typeof f)for(h in f)i[h]=f[h];return i.type=i.type||d,i.oauthio={provider:a,tokens:b,request:c},e.http(i)}},mkHttpMe:function(a,b,c,d){var e;return e=this,function(f){var g;return g={},g.type=g.type||d,g.oauthio={provider:a,tokens:b,request:c},g.data=g.data||{},g.data.filter=f?f.join(","):void 0,e.http_me(g)}},mkHttpAll:function(a,b,c){var d;return d=this,function(){var e,f,g,h;f={},f.type=c.method,f.url=i.oauthd_url+c.endpoint.replace(":provider",a),f.oauthio={provider:a,tokens:b},f.data={};for(e in arguments)h=arguments[e],g=c.params[e],null!=g&&(f.data[g.name]=h);return f.data=f.data||{},d.http_all(f,c,arguments)}},sendCallback:function(a,c){var d,e,f,g,i,j,k,l,m,n,o;d=this,e=void 0,g=void 0;try{e=JSON.parse(a.data)}catch(p){return f=p,c.reject(new Error("Error while parsing result")),a.callback(new Error("Error while parsing result"))}if(e&&e.provider){if(a.provider&&e.provider.toLowerCase()!==a.provider.toLowerCase())return g=new Error("Returned provider name does not match asked provider"),c.reject(g),a.callback&&"function"==typeof a.callback?a.callback(g):void 0;if("error"===e.status||"fail"===e.status)return g=new Error(e.message),g.body=e.data,c.reject(g),a.callback&&"function"==typeof a.callback?a.callback(g):void 0;if("success"!==e.status||!e.data)return g=new Error,g.body=e.data,c.reject(g),a.callback&&"function"==typeof a.callback?a.callback(g):void 0;e.state=e.state.replace(/\s+/g,"");for(j in b)o=b[j],b[j]=o.replace(/\s+/g,"");if(!e.state||-1===b.indexOf(e.state))return c.reject(new Error("State is not matching")),a.callback&&"function"==typeof a.callback?a.callback(new Error("State is not matching")):void 0;if(a.provider||(e.data.provider=e.provider),m=e.data,m.provider=e.provider.toLowerCase(),h.cacheEnabled(a.cache)&&m&&h.storeCache(e.provider,m),l=m.request,delete m.request,n=void 0,m.access_token?n={access_token:m.access_token}:m.oauth_token&&m.oauth_token_secret&&(n={oauth_token:m.oauth_token,oauth_token_secret:m.oauth_token_secret}),!l)return c.resolve(m),a.callback&&"function"==typeof a.callback?a.callback(null,m):void 0;if(l.required)for(i in l.required)n[l.required[i]]=m[l.required[i]];return k=function(a){return d.mkHttp(e.provider,n,l,a)},m.toJson=function(){var a;return a={},null!=m.access_token&&(a.access_token=m.access_token),null!=m.oauth_token&&(a.oauth_token=m.oauth_token),null!=m.oauth_token_secret&&(a.oauth_token_secret=m.oauth_token_secret),null!=m.expires_in&&(a.expires_in=m.expires_in),null!=m.token_type&&(a.token_type=m.token_type),null!=m.id_token&&(a.id_token=m.id_token),null!=m.provider&&(a.provider=m.provider),null!=m.email&&(a.email=m.email),a},m.get=k("GET"),m.post=k("POST"),m.put=k("PUT"),m.patch=k("PATCH"),m.del=k("DELETE"),m.me=d.mkHttpMe(e.provider,n,l,"GET"),this.retrieveMethods().then(function(b){return function(){return b.generateMethods(m,n,e.provider),c.resolve(m),a.callback&&"function"==typeof a.callback?a.callback(null,m):void 0}}(this)).fail(function(){return function(b){return console.log("Could not retrieve methods",b),c.resolve(m),a.callback&&"function"==typeof a.callback?a.callback(null,m):void 0}}(this))}}}}},{"../tools/url":14,q:16}],7:[function(a,b){"use strict";b.exports=function(a){var b,c,d,e,f;return b=a.getJquery(),d=a.getConfig(),e=a.getCookies(),f=null,c=function(){function c(a){this.token=a.token,this.data=a.user,this.providers=a.providers,f=this.getEditableData()}return c.prototype.getEditableData=function(){var a,b;a=[];for(b in this.data)-1===["id","email"].indexOf(b)&&a.push({key:b,value:this.data[b]});return a},c.prototype.save=function(){var b,c,e,g,h,i,j,k;for(c={},g=0,i=f.length;i>g;g++)b=f[g],this.data[b.key]!==b.value&&(c[b.key]=this.data[b.key]),null===this.data[b.key]&&delete this.data[b.key];for(e=function(a){var b,c,d;for(c=0,d=f.length;d>c;c++)if(b=f[c],b.key===a)return!0;return!1},k=this.getEditableData(),h=0,j=k.length;j>h;h++)b=k[h],e(b.key)||(c[b.key]=this.data[b.key]);return this.saveLocal(),a.API.put("/api/usermanagement/user?k="+d.key+"&token="+this.token,c)},c.prototype.select=function(){var a;return a=null},c.prototype.saveLocal=function(){var a;return a={token:this.token,user:this.data,providers:this.providers},e.eraseCookie("oio_auth"),e.createCookie("oio_auth",JSON.stringify(a),21600)},c.prototype.hasProvider=function(a){var b;return-1!==(null!=(b=this.providers)?b.indexOf(a):void 0)},c.prototype.getProviders=function(){var c;return c=b.Deferred(),a.API.get("/api/usermanagement/user/providers?k="+d.key+"&token="+this.token).done(function(a){return function(b){return a.providers=b.data,a.saveLocal(),c.resolve(a.providers)}}(this)).fail(function(a){return c.reject(a)}),c.promise()},c.prototype.addProvider=function(c){var e;return e=b.Deferred(),"function"==typeof c.toJson&&(c=c.toJson()),c.email=this.data.email,this.providers.push(c.provider),a.API.post("/api/usermanagement/user/providers?k="+d.key+"&token="+this.token,c).done(function(a){return function(b){return a.data=b.data,a.saveLocal(),e.resolve()}}(this)).fail(function(a){return function(b){return a.providers.splice(a.providers.indexOf(c.provider),1),e.reject(b)}}(this)),e.promise()},c.prototype.removeProvider=function(c){var e;return e=b.Deferred(),this.providers.splice(this.providers.indexOf(c),1),a.API.del("/api/usermanagement/user/providers/"+c+"?k="+d.key+"&token="+this.token).done(function(a){return function(b){return a.saveLocal(),e.resolve(b)}}(this)).fail(function(a){return function(b){return a.providers.push(c),e.reject(b)}}(this)),e.promise()},c.prototype.changePassword=function(b,c){return a.API.post("/api/usermanagement/user/password?k="+d.key+"&token="+this.token,{password:c})},c.prototype.isLoggued=function(){return a.User.isLogged()},c.prototype.logout=function(){var c;return c=b.Deferred(),e.eraseCookie("oio_auth"),a.API.post("/api/usermanagement/user/logout?k="+d.key+"&token="+this.token).done(function(){return c.resolve()}).fail(function(a){return c.reject(a)}),c.promise()},c}(),{initialize:function(b,c){return a.initialize(b,c)},setOAuthdURL:function(b){return a.setOAuthdURL(b)},signup:function(f){var g;return g=b.Deferred(),"function"==typeof f.toJson&&(f=f.toJson()),a.API.post("/api/usermanagement/signup?k="+d.key,f).done(function(a){return e.createCookie("oio_auth",JSON.stringify(a.data),a.data.expires_in||21600),g.resolve(new c(a.data))}).fail(function(a){return g.reject(a)}),g.promise()},signin:function(f,g){var h,i;return h=b.Deferred(),"string"==typeof f||g?a.API.post("/api/usermanagement/signin?k="+d.key,{email:f,password:g}).done(function(a){return e.createCookie("oio_auth",JSON.stringify(a.data),a.data.expires_in||21600),h.resolve(new c(a.data))}).fail(function(a){return h.reject(a)}):(i=f,"function"==typeof i.toJson&&(i=i.toJson()),a.API.post("/api/usermanagement/signin?k="+d.key,i).done(function(a){return e.createCookie("oio_auth",JSON.stringify(a.data),a.data.expires_in||21600),h.resolve(new c(a.data))}).fail(function(a){return h.reject(a)})),h.promise()},confirmResetPassword:function(b,c){return a.API.post("/api/usermanagement/user/password?k="+d.key+"&token="+this.token,{password:b,passwordKey:c})},resetPassword:function(b){return a.API.post("/api/usermanagement/password/reset?k="+d.key,{email:b})},refreshIdentity:function(){var f;return f=b.Deferred(),a.API.get("/api/usermanagement/user?k="+d.key+"&token="+e.readCookie("oio_auth")).done(function(a){return f.resolve(new c(a.data))}).fail(function(a){return f.reject(a)}),f.promise()},getIdentity:function(){return new c(JSON.parse(e.readCookie("oio_auth")))},isLogged:function(){var a;return a=e.readCookie("oio_auth"),a?!0:!1}}}},{}],8:[function(a){!function(){var b,c;return c=a("./tools/jquery-lite.js"),b=a("./lib/core")(window,document,c,navigator),b.extend("OAuth",a("./lib/oauth")),b.extend("API",a("./lib/api")),b.extend("User",a("./lib/user")),"undefined"!=typeof angular&&null!==angular&&angular.module("oauthio",[]).factory("Materia",[function(){return b}]).factory("OAuth",[function(){return b.OAuth}]).factory("User",[function(){return b.User}]),window.Materia=b,window.User=window.Materia.User,window.OAuth=window.Materia.OAuth}()},{"./lib/api":2,"./lib/core":3,"./lib/oauth":4,"./lib/user":7,"./tools/jquery-lite.js":11}],9:[function(a,b){"use strict";b.exports={init:function(a,b){return this.config=b,this.cookies=a},tryCache:function(a,b,c){var d,e,f;if(this.cacheEnabled(c)){if(c=this.cookies.readCookie("oauthio_provider_"+b),!c)return!1;c=decodeURIComponent(c)}if("string"==typeof c)try{c=JSON.parse(c)}catch(g){return d=g,!1}if("object"==typeof c){f={};for(e in c)"request"!==e&&"function"!=typeof c[e]&&(f[e]=c[e]);return a.create(b,f,c.request)}return!1},storeCache:function(a,b){this.cookies.createCookie("oauthio_provider_"+a,encodeURIComponent(JSON.stringify(b)),b.expires_in-10||3600)},cacheEnabled:function(a){return"undefined"==typeof a?this.config.options.cache:a}}},{}],10:[function(a,b){"use strict";b.exports={init:function(a,b){return this.config=a,this.document=b},createCookie:function(a,b,c){var d;this.eraseCookie(a),d=new Date,d.setTime(d.getTime()+1e3*(c||1200)),c="; expires="+d.toGMTString(),this.document.cookie=a+"="+b+c+"; path=/"},readCookie:function(a){var b,c,d,e;for(e=a+"=",c=this.document.cookie.split(";"),d=0;d<c.length;){for(b=c[d];" "===b.charAt(0);)b=b.substring(1,b.length);if(0===b.indexOf(e))return b.substring(e.length,b.length);d++}return null},eraseCookie:function(a){var b;b=new Date,b.setTime(b.getTime()-864e5),this.document.cookie=a+"=; expires="+b.toGMTString()+"; path=/"}}},{}],11:[function(a,b){!function(a,c){"object"==typeof b&&"object"==typeof b.exports?b.exports=a.document?c(a,!0):function(a){if(!a.document)throw new Error("jQuery requires a window with a document");return c(a)}:c(a)}("undefined"!=typeof window?window:this,function(a){function b(a){var b=a.length,c=A.type(a);return"function"===c||A.isWindow(a)?!1:1===a.nodeType&&b?!0:"array"===c||0===b||"number"==typeof b&&b>0&&b-1 in a}function c(a){var b=K[a]={};return A.each(a.match(J)||[],function(a,c){b[c]=!0}),b}function d(){y.removeEventListener("DOMContentLoaded",d,!1),a.removeEventListener("load",d,!1),A.ready()}function e(){Object.defineProperty(this.cache={},0,{get:function(){return{}}}),this.expando=A.expando+Math.random()}function f(a,b,c){var d;if(void 0===c&&1===a.nodeType)if(d="data-"+b.replace(P,"-$1").toLowerCase(),c=a.getAttribute(d),"string"==typeof c){try{c="true"===c?!0:"false"===c?!1:"null"===c?null:+c+""===c?+c:O.test(c)?A.parseJSON(c):c}catch(e){}data_user.set(a,b,c)}else c=void 0;return c}function g(){return!0}function h(){return!1}function i(){try{return y.activeElement}catch(a){}}function j(a){return function(b,c){"string"!=typeof b&&(c=b,b="*");var d,e=0,f=b.toLowerCase().match(J)||[];if(A.isFunction(c))for(;d=f[e++];)"+"===d[0]?(d=d.slice(1)||"*",(a[d]=a[d]||[]).unshift(c)):(a[d]=a[d]||[]).push(c)}}function k(a,b,c,d){function e(h){var i;return f[h]=!0,A.each(a[h]||[],function(a,h){var j=h(b,c,d);return"string"!=typeof j||g||f[j]?g?!(i=j):void 0:(b.dataTypes.unshift(j),e(j),!1)}),i}var f={},g=a===fb;return e(b.dataTypes[0])||!f["*"]&&e("*")}function l(a,b){var c,d,e=A.ajaxSettings.flatOptions||{};for(c in b)void 0!==b[c]&&((e[c]?a:d||(d={}))[c]=b[c]);return d&&A.extend(!0,a,d),a}function m(a,b,c){for(var d,e,f,g,h=a.contents,i=a.dataTypes;"*"===i[0];)i.shift(),void 0===d&&(d=a.mimeType||b.getResponseHeader("Content-Type"));if(d)for(e in h)if(h[e]&&h[e].test(d)){i.unshift(e);break}if(i[0]in c)f=i[0];else{for(e in c){if(!i[0]||a.converters[e+" "+i[0]]){f=e;break}g||(g=e)}f=f||g}return f?(f!==i[0]&&i.unshift(f),c[f]):void 0}function n(a,b,c,d){var e,f,g,h,i,j={},k=a.dataTypes.slice();if(k[1])for(g in a.converters)j[g.toLowerCase()]=a.converters[g];for(f=k.shift();f;)if(a.responseFields[f]&&(c[a.responseFields[f]]=b),!i&&d&&a.dataFilter&&(b=a.dataFilter(b,a.dataType)),i=f,f=k.shift())if("*"===f)f=i;else if("*"!==i&&i!==f){if(g=j[i+" "+f]||j["* "+f],!g)for(e in j)if(h=e.split(" "),h[1]===f&&(g=j[i+" "+h[0]]||j["* "+h[0]])){g===!0?g=j[e]:j[e]!==!0&&(f=h[0],k.unshift(h[1]));break}if(g!==!0)if(g&&a["throws"])b=g(b);else try{b=g(b)}catch(l){return{state:"parsererror",error:g?l:"No conversion from "+i+" to "+f}}}return{state:"success",data:b}}function o(a,b,c,d){var e;if(A.isArray(b))A.each(b,function(b,e){c||jb.test(a)?d(a,e):o(a+"["+("object"==typeof e?b:"")+"]",e,c,d)});else if(c||"object"!==A.type(b))d(a,b);else for(e in b)o(a+"["+e+"]",b[e],c,d)}var p=[],q=p.slice,r=p.concat,s=p.push,t=p.indexOf,u={},v=u.toString,w=u.hasOwnProperty,x={},y=a.document,z="2.1.1 -attributes,-attributes/attr,-attributes/classes,-attributes/prop,-attributes/support,-attributes/val,-css/addGetHookIf,-css/curCSS,-css/defaultDisplay,-css/hiddenVisibleSelectors,-css/support,-css/swap,-css/var,-css/var/cssExpand,-css/var/getStyles,-css/var/isHidden,-css/var/rmargin,-css/var/rnumnonpx,-css,-effects,-effects/Tween,-effects/animatedSelector,-dimensions,-offset,-data/var/data_user,-deprecated,-event/alias,-event/support,-intro,-manipulation/_evalUrl,-manipulation/support,-manipulation/var,-manipulation/var/rcheckableType,-manipulation,-outro,-queue,-queue/delay,-selector-native,-selector-sizzle,-sizzle/dist,-sizzle/dist/sizzle,-sizzle/dist/min,-sizzle/test,-sizzle/test/jquery,-traversing,-traversing/findFilter,-traversing/var/rneedsContext,-traversing/var,-wrap,-exports,-exports/amd",A=function(a,b){return new A.fn.init(a,b)},B=/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,C=/^-ms-/,D=/-([\da-z])/gi,E=function(a,b){return b.toUpperCase()};A.fn=A.prototype={jquery:z,constructor:A,selector:"",length:0,toArray:function(){return q.call(this)},get:function(a){return null!=a?0>a?this[a+this.length]:this[a]:q.call(this)},pushStack:function(a){var b=A.merge(this.constructor(),a);return b.prevObject=this,b.context=this.context,b},each:function(a,b){return A.each(this,a,b)},map:function(a){return this.pushStack(A.map(this,function(b,c){return a.call(b,c,b)}))},slice:function(){return this.pushStack(q.apply(this,arguments))},first:function(){return this.eq(0)},last:function(){return this.eq(-1)},eq:function(a){var b=this.length,c=+a+(0>a?b:0);return this.pushStack(c>=0&&b>c?[this[c]]:[])},end:function(){return this.prevObject||this.constructor(null)},push:s,sort:p.sort,splice:p.splice},A.extend=A.fn.extend=function(){var a,b,c,d,e,f,g=arguments[0]||{},h=1,i=arguments.length,j=!1;for("boolean"==typeof g&&(j=g,g=arguments[h]||{},h++),"object"==typeof g||A.isFunction(g)||(g={}),h===i&&(g=this,h--);i>h;h++)if(null!=(a=arguments[h]))for(b in a)c=g[b],d=a[b],g!==d&&(j&&d&&(A.isPlainObject(d)||(e=A.isArray(d)))?(e?(e=!1,f=c&&A.isArray(c)?c:[]):f=c&&A.isPlainObject(c)?c:{},g[b]=A.extend(j,f,d)):void 0!==d&&(g[b]=d));return g},A.extend({expando:"jQuery"+(z+Math.random()).replace(/\D/g,""),isReady:!0,error:function(a){throw new Error(a)},noop:function(){},isFunction:function(a){return"function"===A.type(a)},isArray:Array.isArray,isWindow:function(a){return null!=a&&a===a.window},isNumeric:function(a){return!A.isArray(a)&&a-parseFloat(a)>=0},isPlainObject:function(a){return"object"!==A.type(a)||a.nodeType||A.isWindow(a)?!1:a.constructor&&!w.call(a.constructor.prototype,"isPrototypeOf")?!1:!0},isEmptyObject:function(a){var b;for(b in a)return!1;return!0},type:function(a){return null==a?a+"":"object"==typeof a||"function"==typeof a?u[v.call(a)]||"object":typeof a},globalEval:function(a){var b,c=eval;a=A.trim(a),a&&(1===a.indexOf("use strict")?(b=y.createElement("script"),b.text=a,y.head.appendChild(b).parentNode.removeChild(b)):c(a))},camelCase:function(a){return a.replace(C,"ms-").replace(D,E)},nodeName:function(a,b){return a.nodeName&&a.nodeName.toLowerCase()===b.toLowerCase()},each:function(a,c,d){var e,f=0,g=a.length,h=b(a);if(d){if(h)for(;g>f&&(e=c.apply(a[f],d),e!==!1);f++);else for(f in a)if(e=c.apply(a[f],d),e===!1)break}else if(h)for(;g>f&&(e=c.call(a[f],f,a[f]),e!==!1);f++);else for(f in a)if(e=c.call(a[f],f,a[f]),e===!1)break;return a},trim:function(a){return null==a?"":(a+"").replace(B,"")},makeArray:function(a,c){var d=c||[];return null!=a&&(b(Object(a))?A.merge(d,"string"==typeof a?[a]:a):s.call(d,a)),d},inArray:function(a,b,c){return null==b?-1:t.call(b,a,c)},merge:function(a,b){for(var c=+b.length,d=0,e=a.length;c>d;d++)a[e++]=b[d];return a.length=e,a},grep:function(a,b,c){for(var d,e=[],f=0,g=a.length,h=!c;g>f;f++)d=!b(a[f],f),d!==h&&e.push(a[f]);return e},map:function(a,c,d){var e,f=0,g=a.length,h=b(a),i=[];if(h)for(;g>f;f++)e=c(a[f],f,d),null!=e&&i.push(e);else for(f in a)e=c(a[f],f,d),null!=e&&i.push(e);return r.apply([],i)},guid:1,proxy:function(a,b){var c,d,e;return"string"==typeof b&&(c=a[b],b=a,a=c),A.isFunction(a)?(d=q.call(arguments,2),e=function(){return a.apply(b||this,d.concat(q.call(arguments)))},e.guid=a.guid=a.guid||A.guid++,e):void 0},now:Date.now,support:x}),A.each("Boolean Number String Function Array Date RegExp Object Error".split(" "),function(a,b){u["[object "+b+"]"]=b.toLowerCase()});var F,G=/^<(\w+)\s*\/?>(?:<\/\1>|)$/,H=/^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/,I=A.fn.init=function(a,b){var c,d;if(!a)return this;if("string"==typeof a){if(c="<"===a[0]&&">"===a[a.length-1]&&a.length>=3?[null,a,null]:H.exec(a),!c||!c[1]&&b)return!b||b.jquery?(b||F).find(a):this.constructor(b).find(a);if(c[1]){if(b=b instanceof A?b[0]:b,A.merge(this,A.parseHTML(c[1],b&&b.nodeType?b.ownerDocument||b:y,!0)),G.test(c[1])&&A.isPlainObject(b))for(c in b)A.isFunction(this[c])?this[c](b[c]):this.attr(c,b[c]);return this}return d=y.getElementById(c[2]),d&&d.parentNode&&(this.length=1,this[0]=d),this.context=y,this.selector=a,this}return a.nodeType?(this.context=this[0]=a,this.length=1,this):A.isFunction(a)?"undefined"!=typeof F.ready?F.ready(a):a(A):(void 0!==a.selector&&(this.selector=a.selector,this.context=a.context),A.makeArray(a,this))};I.prototype=A.fn,F=A(y);var J=/\S+/g,K={};A.Callbacks=function(a){a="string"==typeof a?K[a]||c(a):A.extend({},a);var b,d,e,f,g,h,i=[],j=!a.once&&[],k=function(c){for(b=a.memory&&c,d=!0,h=f||0,f=0,g=i.length,e=!0;i&&g>h;h++)if(i[h].apply(c[0],c[1])===!1&&a.stopOnFalse){b=!1;break}e=!1,i&&(j?j.length&&k(j.shift()):b?i=[]:l.disable())},l={add:function(){if(i){var c=i.length;!function d(b){A.each(b,function(b,c){var e=A.type(c);"function"===e?a.unique&&l.has(c)||i.push(c):c&&c.length&&"string"!==e&&d(c)})}(arguments),e?g=i.length:b&&(f=c,k(b))}return this},remove:function(){return i&&A.each(arguments,function(a,b){for(var c;(c=A.inArray(b,i,c))>-1;)i.splice(c,1),e&&(g>=c&&g--,h>=c&&h--)}),this},has:function(a){return a?A.inArray(a,i)>-1:!(!i||!i.length)},empty:function(){return i=[],g=0,this},disable:function(){return i=j=b=void 0,this},disabled:function(){return!i},lock:function(){return j=void 0,b||l.disable(),this},locked:function(){return!j},fireWith:function(a,b){return!i||d&&!j||(b=b||[],b=[a,b.slice?b.slice():b],e?j.push(b):k(b)),this},fire:function(){return l.fireWith(this,arguments),this},fired:function(){return!!d}};return l},A.extend({Deferred:function(a){var b=[["resolve","done",A.Callbacks("once memory"),"resolved"],["reject","fail",A.Callbacks("once memory"),"rejected"],["notify","progress",A.Callbacks("memory")]],c="pending",d={state:function(){return c},always:function(){return e.done(arguments).fail(arguments),this},then:function(){var a=arguments;return A.Deferred(function(c){A.each(b,function(b,f){var g=A.isFunction(a[b])&&a[b];e[f[1]](function(){var a=g&&g.apply(this,arguments);a&&A.isFunction(a.promise)?a.promise().done(c.resolve).fail(c.reject).progress(c.notify):c[f[0]+"With"](this===d?c.promise():this,g?[a]:arguments)
})}),a=null}).promise()},promise:function(a){return null!=a?A.extend(a,d):d}},e={};return d.pipe=d.then,A.each(b,function(a,f){var g=f[2],h=f[3];d[f[1]]=g.add,h&&g.add(function(){c=h},b[1^a][2].disable,b[2][2].lock),e[f[0]]=function(){return e[f[0]+"With"](this===e?d:this,arguments),this},e[f[0]+"With"]=g.fireWith}),d.promise(e),a&&a.call(e,e),e},when:function(a){var b,c,d,e=0,f=q.call(arguments),g=f.length,h=1!==g||a&&A.isFunction(a.promise)?g:0,i=1===h?a:A.Deferred(),j=function(a,c,d){return function(e){c[a]=this,d[a]=arguments.length>1?q.call(arguments):e,d===b?i.notifyWith(c,d):--h||i.resolveWith(c,d)}};if(g>1)for(b=new Array(g),c=new Array(g),d=new Array(g);g>e;e++)f[e]&&A.isFunction(f[e].promise)?f[e].promise().done(j(e,d,f)).fail(i.reject).progress(j(e,c,b)):--h;return h||i.resolveWith(d,f),i.promise()}});var L;A.fn.ready=function(a){return A.ready.promise().done(a),this},A.extend({isReady:!1,readyWait:1,holdReady:function(a){a?A.readyWait++:A.ready(!0)},ready:function(a){(a===!0?--A.readyWait:A.isReady)||(A.isReady=!0,a!==!0&&--A.readyWait>0||(L.resolveWith(y,[A]),A.fn.triggerHandler&&(A(y).triggerHandler("ready"),A(y).off("ready"))))}}),A.ready.promise=function(b){return L||(L=A.Deferred(),"complete"===y.readyState?setTimeout(A.ready):(y.addEventListener("DOMContentLoaded",d,!1),a.addEventListener("load",d,!1))),L.promise(b)},A.ready.promise();var M=A.access=function(a,b,c,d,e,f,g){var h=0,i=a.length,j=null==c;if("object"===A.type(c)){e=!0;for(h in c)A.access(a,b,h,c[h],!0,f,g)}else if(void 0!==d&&(e=!0,A.isFunction(d)||(g=!0),j&&(g?(b.call(a,d),b=null):(j=b,b=function(a,b,c){return j.call(A(a),c)})),b))for(;i>h;h++)b(a[h],c,g?d:d.call(a[h],h,b(a[h],c)));return e?a:j?b.call(a):i?b(a[0],c):f};A.acceptData=function(a){return 1===a.nodeType||9===a.nodeType||!+a.nodeType},e.uid=1,e.accepts=A.acceptData,e.prototype={key:function(a){if(!e.accepts(a))return 0;var b={},c=a[this.expando];if(!c){c=e.uid++;try{b[this.expando]={value:c},Object.defineProperties(a,b)}catch(d){b[this.expando]=c,A.extend(a,b)}}return this.cache[c]||(this.cache[c]={}),c},set:function(a,b,c){var d,e=this.key(a),f=this.cache[e];if("string"==typeof b)f[b]=c;else if(A.isEmptyObject(f))A.extend(this.cache[e],b);else for(d in b)f[d]=b[d];return f},get:function(a,b){var c=this.cache[this.key(a)];return void 0===b?c:c[b]},access:function(a,b,c){var d;return void 0===b||b&&"string"==typeof b&&void 0===c?(d=this.get(a,b),void 0!==d?d:this.get(a,A.camelCase(b))):(this.set(a,b,c),void 0!==c?c:b)},remove:function(a,b){var c,d,e,f=this.key(a),g=this.cache[f];if(void 0===b)this.cache[f]={};else{A.isArray(b)?d=b.concat(b.map(A.camelCase)):(e=A.camelCase(b),b in g?d=[b,e]:(d=e,d=d in g?[d]:d.match(J)||[])),c=d.length;for(;c--;)delete g[d[c]]}},hasData:function(a){return!A.isEmptyObject(this.cache[a[this.expando]]||{})},discard:function(a){a[this.expando]&&delete this.cache[a[this.expando]]}};var N=new e,O=/^(?:\{[\w\W]*\}|\[[\w\W]*\])$/,P=/([A-Z])/g;A.extend({hasData:function(a){return data_user.hasData(a)||N.hasData(a)},data:function(a,b,c){return data_user.access(a,b,c)},removeData:function(a,b){data_user.remove(a,b)},_data:function(a,b,c){return N.access(a,b,c)},_removeData:function(a,b){N.remove(a,b)}}),A.fn.extend({data:function(a,b){var c,d,e,g=this[0],h=g&&g.attributes;if(void 0===a){if(this.length&&(e=data_user.get(g),1===g.nodeType&&!N.get(g,"hasDataAttrs"))){for(c=h.length;c--;)h[c]&&(d=h[c].name,0===d.indexOf("data-")&&(d=A.camelCase(d.slice(5)),f(g,d,e[d])));N.set(g,"hasDataAttrs",!0)}return e}return"object"==typeof a?this.each(function(){data_user.set(this,a)}):M(this,function(b){var c,d=A.camelCase(a);if(g&&void 0===b){if(c=data_user.get(g,a),void 0!==c)return c;if(c=data_user.get(g,d),void 0!==c)return c;if(c=f(g,d,void 0),void 0!==c)return c}else this.each(function(){var c=data_user.get(this,d);data_user.set(this,d,b),-1!==a.indexOf("-")&&void 0!==c&&data_user.set(this,a,b)})},null,b,arguments.length>1,null,!0)},removeData:function(a){return this.each(function(){data_user.remove(this,a)})}});var Q=(/[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source,"undefined"),R=/^key/,S=/^(?:mouse|pointer|contextmenu)|click/,T=/^(?:focusinfocus|focusoutblur)$/,U=/^([^.]*)(?:\.(.+)|)$/;A.event={global:{},add:function(a,b,c,d,e){var f,g,h,i,j,k,l,m,n,o,p,q=N.get(a);if(q)for(c.handler&&(f=c,c=f.handler,e=f.selector),c.guid||(c.guid=A.guid++),(i=q.events)||(i=q.events={}),(g=q.handle)||(g=q.handle=function(b){return typeof A!==Q&&A.event.triggered!==b.type?A.event.dispatch.apply(a,arguments):void 0}),b=(b||"").match(J)||[""],j=b.length;j--;)h=U.exec(b[j])||[],n=p=h[1],o=(h[2]||"").split(".").sort(),n&&(l=A.event.special[n]||{},n=(e?l.delegateType:l.bindType)||n,l=A.event.special[n]||{},k=A.extend({type:n,origType:p,data:d,handler:c,guid:c.guid,selector:e,needsContext:e&&A.expr.match.needsContext.test(e),namespace:o.join(".")},f),(m=i[n])||(m=i[n]=[],m.delegateCount=0,l.setup&&l.setup.call(a,d,o,g)!==!1||a.addEventListener&&a.addEventListener(n,g,!1)),l.add&&(l.add.call(a,k),k.handler.guid||(k.handler.guid=c.guid)),e?m.splice(m.delegateCount++,0,k):m.push(k),A.event.global[n]=!0)},remove:function(a,b,c,d,e){var f,g,h,i,j,k,l,m,n,o,p,q=N.hasData(a)&&N.get(a);if(q&&(i=q.events)){for(b=(b||"").match(J)||[""],j=b.length;j--;)if(h=U.exec(b[j])||[],n=p=h[1],o=(h[2]||"").split(".").sort(),n){for(l=A.event.special[n]||{},n=(d?l.delegateType:l.bindType)||n,m=i[n]||[],h=h[2]&&new RegExp("(^|\\.)"+o.join("\\.(?:.*\\.|)")+"(\\.|$)"),g=f=m.length;f--;)k=m[f],!e&&p!==k.origType||c&&c.guid!==k.guid||h&&!h.test(k.namespace)||d&&d!==k.selector&&("**"!==d||!k.selector)||(m.splice(f,1),k.selector&&m.delegateCount--,l.remove&&l.remove.call(a,k));g&&!m.length&&(l.teardown&&l.teardown.call(a,o,q.handle)!==!1||A.removeEvent(a,n,q.handle),delete i[n])}else for(n in i)A.event.remove(a,n+b[j],c,d,!0);A.isEmptyObject(i)&&(delete q.handle,N.remove(a,"events"))}},trigger:function(b,c,d,e){var f,g,h,i,j,k,l,m=[d||y],n=w.call(b,"type")?b.type:b,o=w.call(b,"namespace")?b.namespace.split("."):[];if(g=h=d=d||y,3!==d.nodeType&&8!==d.nodeType&&!T.test(n+A.event.triggered)&&(n.indexOf(".")>=0&&(o=n.split("."),n=o.shift(),o.sort()),j=n.indexOf(":")<0&&"on"+n,b=b[A.expando]?b:new A.Event(n,"object"==typeof b&&b),b.isTrigger=e?2:3,b.namespace=o.join("."),b.namespace_re=b.namespace?new RegExp("(^|\\.)"+o.join("\\.(?:.*\\.|)")+"(\\.|$)"):null,b.result=void 0,b.target||(b.target=d),c=null==c?[b]:A.makeArray(c,[b]),l=A.event.special[n]||{},e||!l.trigger||l.trigger.apply(d,c)!==!1)){if(!e&&!l.noBubble&&!A.isWindow(d)){for(i=l.delegateType||n,T.test(i+n)||(g=g.parentNode);g;g=g.parentNode)m.push(g),h=g;h===(d.ownerDocument||y)&&m.push(h.defaultView||h.parentWindow||a)}for(f=0;(g=m[f++])&&!b.isPropagationStopped();)b.type=f>1?i:l.bindType||n,k=(N.get(g,"events")||{})[b.type]&&N.get(g,"handle"),k&&k.apply(g,c),k=j&&g[j],k&&k.apply&&A.acceptData(g)&&(b.result=k.apply(g,c),b.result===!1&&b.preventDefault());return b.type=n,e||b.isDefaultPrevented()||l._default&&l._default.apply(m.pop(),c)!==!1||!A.acceptData(d)||j&&A.isFunction(d[n])&&!A.isWindow(d)&&(h=d[j],h&&(d[j]=null),A.event.triggered=n,d[n](),A.event.triggered=void 0,h&&(d[j]=h)),b.result}},dispatch:function(a){a=A.event.fix(a);var b,c,d,e,f,g=[],h=q.call(arguments),i=(N.get(this,"events")||{})[a.type]||[],j=A.event.special[a.type]||{};if(h[0]=a,a.delegateTarget=this,!j.preDispatch||j.preDispatch.call(this,a)!==!1){for(g=A.event.handlers.call(this,a,i),b=0;(e=g[b++])&&!a.isPropagationStopped();)for(a.currentTarget=e.elem,c=0;(f=e.handlers[c++])&&!a.isImmediatePropagationStopped();)(!a.namespace_re||a.namespace_re.test(f.namespace))&&(a.handleObj=f,a.data=f.data,d=((A.event.special[f.origType]||{}).handle||f.handler).apply(e.elem,h),void 0!==d&&(a.result=d)===!1&&(a.preventDefault(),a.stopPropagation()));return j.postDispatch&&j.postDispatch.call(this,a),a.result}},handlers:function(a,b){var c,d,e,f,g=[],h=b.delegateCount,i=a.target;if(h&&i.nodeType&&(!a.button||"click"!==a.type))for(;i!==this;i=i.parentNode||this)if(i.disabled!==!0||"click"!==a.type){for(d=[],c=0;h>c;c++)f=b[c],e=f.selector+" ",void 0===d[e]&&(d[e]=f.needsContext?A(e,this).index(i)>=0:A.find(e,this,null,[i]).length),d[e]&&d.push(f);d.length&&g.push({elem:i,handlers:d})}return h<b.length&&g.push({elem:this,handlers:b.slice(h)}),g},props:"altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),fixHooks:{},keyHooks:{props:"char charCode key keyCode".split(" "),filter:function(a,b){return null==a.which&&(a.which=null!=b.charCode?b.charCode:b.keyCode),a}},mouseHooks:{props:"button buttons clientX clientY offsetX offsetY pageX pageY screenX screenY toElement".split(" "),filter:function(a,b){var c,d,e,f=b.button;return null==a.pageX&&null!=b.clientX&&(c=a.target.ownerDocument||y,d=c.documentElement,e=c.body,a.pageX=b.clientX+(d&&d.scrollLeft||e&&e.scrollLeft||0)-(d&&d.clientLeft||e&&e.clientLeft||0),a.pageY=b.clientY+(d&&d.scrollTop||e&&e.scrollTop||0)-(d&&d.clientTop||e&&e.clientTop||0)),a.which||void 0===f||(a.which=1&f?1:2&f?3:4&f?2:0),a}},fix:function(a){if(a[A.expando])return a;var b,c,d,e=a.type,f=a,g=this.fixHooks[e];for(g||(this.fixHooks[e]=g=S.test(e)?this.mouseHooks:R.test(e)?this.keyHooks:{}),d=g.props?this.props.concat(g.props):this.props,a=new A.Event(f),b=d.length;b--;)c=d[b],a[c]=f[c];return a.target||(a.target=y),3===a.target.nodeType&&(a.target=a.target.parentNode),g.filter?g.filter(a,f):a},special:{load:{noBubble:!0},focus:{trigger:function(){return this!==i()&&this.focus?(this.focus(),!1):void 0},delegateType:"focusin"},blur:{trigger:function(){return this===i()&&this.blur?(this.blur(),!1):void 0},delegateType:"focusout"},click:{trigger:function(){return"checkbox"===this.type&&this.click&&A.nodeName(this,"input")?(this.click(),!1):void 0},_default:function(a){return A.nodeName(a.target,"a")}},beforeunload:{postDispatch:function(a){void 0!==a.result&&a.originalEvent&&(a.originalEvent.returnValue=a.result)}}},simulate:function(a,b,c,d){var e=A.extend(new A.Event,c,{type:a,isSimulated:!0,originalEvent:{}});d?A.event.trigger(e,null,b):A.event.dispatch.call(b,e),e.isDefaultPrevented()&&c.preventDefault()}},A.removeEvent=function(a,b,c){a.removeEventListener&&a.removeEventListener(b,c,!1)},A.Event=function(a,b){return this instanceof A.Event?(a&&a.type?(this.originalEvent=a,this.type=a.type,this.isDefaultPrevented=a.defaultPrevented||void 0===a.defaultPrevented&&a.returnValue===!1?g:h):this.type=a,b&&A.extend(this,b),this.timeStamp=a&&a.timeStamp||A.now(),void(this[A.expando]=!0)):new A.Event(a,b)},A.Event.prototype={isDefaultPrevented:h,isPropagationStopped:h,isImmediatePropagationStopped:h,preventDefault:function(){var a=this.originalEvent;this.isDefaultPrevented=g,a&&a.preventDefault&&a.preventDefault()},stopPropagation:function(){var a=this.originalEvent;this.isPropagationStopped=g,a&&a.stopPropagation&&a.stopPropagation()},stopImmediatePropagation:function(){var a=this.originalEvent;this.isImmediatePropagationStopped=g,a&&a.stopImmediatePropagation&&a.stopImmediatePropagation(),this.stopPropagation()}},A.each({mouseenter:"mouseover",mouseleave:"mouseout",pointerenter:"pointerover",pointerleave:"pointerout"},function(a,b){A.event.special[a]={delegateType:b,bindType:b,handle:function(a){var c,d=this,e=a.relatedTarget,f=a.handleObj;return(!e||e!==d&&!A.contains(d,e))&&(a.type=f.origType,c=f.handler.apply(this,arguments),a.type=b),c}}}),x.focusinBubbles||A.each({focus:"focusin",blur:"focusout"},function(a,b){var c=function(a){A.event.simulate(b,a.target,A.event.fix(a),!0)};A.event.special[b]={setup:function(){var d=this.ownerDocument||this,e=N.access(d,b);e||d.addEventListener(a,c,!0),N.access(d,b,(e||0)+1)},teardown:function(){var d=this.ownerDocument||this,e=N.access(d,b)-1;e?N.access(d,b,e):(d.removeEventListener(a,c,!0),N.remove(d,b))}}}),A.fn.extend({on:function(a,b,c,d,e){var f,g;if("object"==typeof a){"string"!=typeof b&&(c=c||b,b=void 0);for(g in a)this.on(g,b,c,a[g],e);return this}if(null==c&&null==d?(d=b,c=b=void 0):null==d&&("string"==typeof b?(d=c,c=void 0):(d=c,c=b,b=void 0)),d===!1)d=h;else if(!d)return this;return 1===e&&(f=d,d=function(a){return A().off(a),f.apply(this,arguments)},d.guid=f.guid||(f.guid=A.guid++)),this.each(function(){A.event.add(this,a,d,c,b)})},one:function(a,b,c,d){return this.on(a,b,c,d,1)},off:function(a,b,c){var d,e;if(a&&a.preventDefault&&a.handleObj)return d=a.handleObj,A(a.delegateTarget).off(d.namespace?d.origType+"."+d.namespace:d.origType,d.selector,d.handler),this;if("object"==typeof a){for(e in a)this.off(e,b,a[e]);return this}return(b===!1||"function"==typeof b)&&(c=b,b=void 0),c===!1&&(c=h),this.each(function(){A.event.remove(this,a,c,b)})},trigger:function(a,b){return this.each(function(){A.event.trigger(a,b,this)})},triggerHandler:function(a,b){var c=this[0];return c?A.event.trigger(a,b,c,!0):void 0}});var V=A.now(),W=/\?/;A.parseJSON=function(a){return JSON.parse(a+"")},A.parseXML=function(a){var b,c;if(!a||"string"!=typeof a)return null;try{c=new DOMParser,b=c.parseFromString(a,"text/xml")}catch(d){b=void 0}return(!b||b.getElementsByTagName("parsererror").length)&&A.error("Invalid XML: "+a),b};var X,Y,Z=/#.*$/,$=/([?&])_=[^&]*/,_=/^(.*?):[ \t]*([^\r\n]*)$/gm,ab=/^(?:about|app|app-storage|.+-extension|file|res|widget):$/,bb=/^(?:GET|HEAD)$/,cb=/^\/\//,db=/^([\w.+-]+:)(?:\/\/(?:[^\/?#]*@|)([^\/?#:]*)(?::(\d+)|)|)/,eb={},fb={},gb="*/".concat("*");try{Y=location.href}catch(hb){Y=y.createElement("a"),Y.href="",Y=Y.href}X=db.exec(Y.toLowerCase())||[],A.extend({active:0,lastModified:{},etag:{},ajaxSettings:{url:Y,type:"GET",isLocal:ab.test(X[1]),global:!0,processData:!0,async:!0,contentType:"application/x-www-form-urlencoded; charset=UTF-8",accepts:{"*":gb,text:"text/plain",html:"text/html",xml:"application/xml, text/xml",json:"application/json, text/javascript"},contents:{xml:/xml/,html:/html/,json:/json/},responseFields:{xml:"responseXML",text:"responseText",json:"responseJSON"},converters:{"* text":String,"text html":!0,"text json":A.parseJSON,"text xml":A.parseXML},flatOptions:{url:!0,context:!0}},ajaxSetup:function(a,b){return b?l(l(a,A.ajaxSettings),b):l(A.ajaxSettings,a)},ajaxPrefilter:j(eb),ajaxTransport:j(fb),ajax:function(a,b){function c(a,b,c,g){var i,k,l,u,v,x=b;2!==w&&(w=2,h&&clearTimeout(h),d=void 0,f=g||"",y.readyState=a>0?4:0,i=a>=200&&300>a||304===a,c&&(u=m(o,y,c)),u=n(o,u,y,i),i?(o.ifModified&&(v=y.getResponseHeader("Last-Modified"),v&&(A.lastModified[e]=v),v=y.getResponseHeader("etag"),v&&(A.etag[e]=v)),204===a||"HEAD"===o.type?x="nocontent":304===a?x="notmodified":(x=u.state,k=u.data,l=u.error,i=!l)):(l=x,(a||!x)&&(x="error",0>a&&(a=0))),y.status=a,y.statusText=(b||x)+"",i?r.resolveWith(p,[k,x,y]):r.rejectWith(p,[y,x,l]),y.statusCode(t),t=void 0,j&&q.trigger(i?"ajaxSuccess":"ajaxError",[y,o,i?k:l]),s.fireWith(p,[y,x]),j&&(q.trigger("ajaxComplete",[y,o]),--A.active||A.event.trigger("ajaxStop")))}"object"==typeof a&&(b=a,a=void 0),b=b||{};var d,e,f,g,h,i,j,l,o=A.ajaxSetup({},b),p=o.context||o,q=o.context&&(p.nodeType||p.jquery)?A(p):A.event,r=A.Deferred(),s=A.Callbacks("once memory"),t=o.statusCode||{},u={},v={},w=0,x="canceled",y={readyState:0,getResponseHeader:function(a){var b;if(2===w){if(!g)for(g={};b=_.exec(f);)g[b[1].toLowerCase()]=b[2];b=g[a.toLowerCase()]}return null==b?null:b},getAllResponseHeaders:function(){return 2===w?f:null},setRequestHeader:function(a,b){var c=a.toLowerCase();return w||(a=v[c]=v[c]||a,u[a]=b),this},overrideMimeType:function(a){return w||(o.mimeType=a),this},statusCode:function(a){var b;if(a)if(2>w)for(b in a)t[b]=[t[b],a[b]];else y.always(a[y.status]);return this},abort:function(a){var b=a||x;return d&&d.abort(b),c(0,b),this}};if(r.promise(y).complete=s.add,y.success=y.done,y.error=y.fail,o.url=((a||o.url||Y)+"").replace(Z,"").replace(cb,X[1]+"//"),o.type=b.method||b.type||o.method||o.type,o.dataTypes=A.trim(o.dataType||"*").toLowerCase().match(J)||[""],null==o.crossDomain&&(i=db.exec(o.url.toLowerCase()),o.crossDomain=!(!i||i[1]===X[1]&&i[2]===X[2]&&(i[3]||("http:"===i[1]?"80":"443"))===(X[3]||("http:"===X[1]?"80":"443")))),o.data&&o.processData&&"string"!=typeof o.data&&(o.data=A.param(o.data,o.traditional)),k(eb,o,b,y),2===w)return y;j=o.global,j&&0===A.active++&&A.event.trigger("ajaxStart"),o.type=o.type.toUpperCase(),o.hasContent=!bb.test(o.type),e=o.url,o.hasContent||(o.data&&(e=o.url+=(W.test(e)?"&":"?")+o.data,delete o.data),o.cache===!1&&(o.url=$.test(e)?e.replace($,"$1_="+V++):e+(W.test(e)?"&":"?")+"_="+V++)),o.ifModified&&(A.lastModified[e]&&y.setRequestHeader("If-Modified-Since",A.lastModified[e]),A.etag[e]&&y.setRequestHeader("If-None-Match",A.etag[e])),(o.data&&o.hasContent&&o.contentType!==!1||b.contentType)&&y.setRequestHeader("Content-Type",o.contentType),y.setRequestHeader("Accept",o.dataTypes[0]&&o.accepts[o.dataTypes[0]]?o.accepts[o.dataTypes[0]]+("*"!==o.dataTypes[0]?", "+gb+"; q=0.01":""):o.accepts["*"]);for(l in o.headers)y.setRequestHeader(l,o.headers[l]);if(o.beforeSend&&(o.beforeSend.call(p,y,o)===!1||2===w))return y.abort();x="abort";for(l in{success:1,error:1,complete:1})y[l](o[l]);if(d=k(fb,o,b,y)){y.readyState=1,j&&q.trigger("ajaxSend",[y,o]),o.async&&o.timeout>0&&(h=setTimeout(function(){y.abort("timeout")},o.timeout));try{w=1,d.send(u,c)}catch(z){if(!(2>w))throw z;c(-1,z)}}else c(-1,"No Transport");return y},getJSON:function(a,b,c){return A.get(a,b,c,"json")},getScript:function(a,b){return A.get(a,void 0,b,"script")}}),A.each(["get","post"],function(a,b){A[b]=function(a,c,d,e){return A.isFunction(c)&&(e=e||d,d=c,c=void 0),A.ajax({url:a,type:b,dataType:e,data:c,success:d})}}),A.each(["ajaxStart","ajaxStop","ajaxComplete","ajaxError","ajaxSuccess","ajaxSend"],function(a,b){A.fn[b]=function(a){return this.on(b,a)}});var ib=/%20/g,jb=/\[\]$/,kb=/\r?\n/g,lb=/^(?:submit|button|image|reset|file)$/i,mb=/^(?:input|select|textarea|keygen)/i;A.param=function(a,b){var c,d=[],e=function(a,b){b=A.isFunction(b)?b():null==b?"":b,d[d.length]=encodeURIComponent(a)+"="+encodeURIComponent(b)};if(void 0===b&&(b=A.ajaxSettings&&A.ajaxSettings.traditional),A.isArray(a)||a.jquery&&!A.isPlainObject(a))A.each(a,function(){e(this.name,this.value)});else for(c in a)o(c,a[c],b,e);return d.join("&").replace(ib,"+")},A.fn.extend({serialize:function(){return A.param(this.serializeArray())},serializeArray:function(){return this.map(function(){var a=A.prop(this,"elements");return a?A.makeArray(a):this}).filter(function(){var a=this.type;return this.name&&!A(this).is(":disabled")&&mb.test(this.nodeName)&&!lb.test(a)&&(this.checked||!rcheckableType.test(a))}).map(function(a,b){var c=A(this).val();return null==c?null:A.isArray(c)?A.map(c,function(a){return{name:b.name,value:a.replace(kb,"\r\n")}}):{name:b.name,value:c.replace(kb,"\r\n")}}).get()}}),A.ajaxSettings.xhr=function(){try{return new XMLHttpRequest}catch(a){}};var nb=0,ob={},pb={0:200,1223:204},qb=A.ajaxSettings.xhr();a.ActiveXObject&&A(a).on("unload",function(){for(var a in ob)ob[a]()}),x.cors=!!qb&&"withCredentials"in qb,x.ajax=qb=!!qb,A.ajaxTransport(function(a){var b;return x.cors||qb&&!a.crossDomain?{send:function(c,d){var e,f=a.xhr(),g=++nb;if(f.open(a.type,a.url,a.async,a.username,a.password),a.xhrFields)for(e in a.xhrFields)f[e]=a.xhrFields[e];a.mimeType&&f.overrideMimeType&&f.overrideMimeType(a.mimeType),a.crossDomain||c["X-Requested-With"]||(c["X-Requested-With"]="XMLHttpRequest");for(e in c)f.setRequestHeader(e,c[e]);b=function(a){return function(){b&&(delete ob[g],b=f.onload=f.onerror=null,"abort"===a?f.abort():"error"===a?d(f.status,f.statusText):d(pb[f.status]||f.status,f.statusText,"string"==typeof f.responseText?{text:f.responseText}:void 0,f.getAllResponseHeaders()))}},f.onload=b(),f.onerror=b("error"),b=ob[g]=b("abort");try{f.send(a.hasContent&&a.data||null)}catch(h){if(b)throw h}},abort:function(){b&&b()}}:void 0}),A.ajaxSetup({accepts:{script:"text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"},contents:{script:/(?:java|ecma)script/},converters:{"text script":function(a){return A.globalEval(a),a}}}),A.ajaxPrefilter("script",function(a){void 0===a.cache&&(a.cache=!1),a.crossDomain&&(a.type="GET")}),A.ajaxTransport("script",function(a){if(a.crossDomain){var b,c;return{send:function(d,e){b=A("<script>").prop({async:!0,charset:a.scriptCharset,src:a.url}).on("load error",c=function(a){b.remove(),c=null,a&&e("error"===a.type?404:200,a.type)}),y.head.appendChild(b[0])},abort:function(){c&&c()}}}});var rb=[],sb=/(=)\?(?=&|$)|\?\?/;A.ajaxSetup({jsonp:"callback",jsonpCallback:function(){var a=rb.pop()||A.expando+"_"+V++;return this[a]=!0,a}}),A.ajaxPrefilter("json jsonp",function(b,c,d){var e,f,g,h=b.jsonp!==!1&&(sb.test(b.url)?"url":"string"==typeof b.data&&!(b.contentType||"").indexOf("application/x-www-form-urlencoded")&&sb.test(b.data)&&"data");return h||"jsonp"===b.dataTypes[0]?(e=b.jsonpCallback=A.isFunction(b.jsonpCallback)?b.jsonpCallback():b.jsonpCallback,h?b[h]=b[h].replace(sb,"$1"+e):b.jsonp!==!1&&(b.url+=(W.test(b.url)?"&":"?")+b.jsonp+"="+e),b.converters["script json"]=function(){return g||A.error(e+" was not called"),g[0]},b.dataTypes[0]="json",f=a[e],a[e]=function(){g=arguments},d.always(function(){a[e]=f,b[e]&&(b.jsonpCallback=c.jsonpCallback,rb.push(e)),g&&A.isFunction(f)&&f(g[0]),g=f=void 0}),"script"):void 0}),A.parseHTML=function(a,b,c){if(!a||"string"!=typeof a)return null;"boolean"==typeof b&&(c=b,b=!1),b=b||y;var d=G.exec(a),e=!c&&[];return d?[b.createElement(d[1])]:(d=A.buildFragment([a],b,e),e&&e.length&&A(e).remove(),A.merge([],d.childNodes))};var tb=A.fn.load;return A.fn.load=function(a,b,c){if("string"!=typeof a&&tb)return tb.apply(this,arguments);var d,e,f,g=this,h=a.indexOf(" ");return h>=0&&(d=A.trim(a.slice(h)),a=a.slice(0,h)),A.isFunction(b)?(c=b,b=void 0):b&&"object"==typeof b&&(e="POST"),g.length>0&&A.ajax({url:a,type:e,dataType:"html",data:b}).done(function(a){f=arguments,g.html(d?A("<div>").append(A.parseHTML(a)).find(d):a)}).complete(c&&function(a,b){g.each(c,f||[a.responseText,b,a])}),this},A.noConflict=function(){},A})},{}],12:[function(a,b){"use strict";b.exports=function(a){return{reload:function(){return a.location.reload()},getHash:function(){return a.location.hash},setHash:function(b){return a.location.hash=b},changeHref:function(b){return a.location.href=b}}}},{}],13:[function(a,b){var c,d;d=0,c="",b.exports={hex_sha1:function(a){return this.rstr2hex(this.rstr_sha1(this.str2rstr_utf8(a)))},b64_sha1:function(a){return this.rstr2b64(this.rstr_sha1(this.str2rstr_utf8(a)))},any_sha1:function(a,b){return this.rstr2any(this.rstr_sha1(this.str2rstr_utf8(a)),b)},hex_hmac_sha1:function(a,b){return this.rstr2hex(this.rstr_hmac_sha1(this.str2rstr_utf8(a),this.str2rstr_utf8(b)))},b64_hmac_sha1:function(a,b){return this.rstr2b64(this.rstr_hmac_sha1(this.str2rstr_utf8(a),this.str2rstr_utf8(b)))},any_hmac_sha1:function(a,b,c){return this.rstr2any(this.rstr_hmac_sha1(this.str2rstr_utf8(a),this.str2rstr_utf8(b)),c)},sha1_vm_test:function(){return"a9993e364706816aba3e25717850c26c9cd0d89d"===thishex_sha1("abc").toLowerCase()},rstr_sha1:function(a){return this.binb2rstr(this.binb_sha1(this.rstr2binb(a),8*a.length))},rstr_hmac_sha1:function(a,b){var c,d,e,f,g;for(c=this.rstr2binb(a),c.length>16&&(c=this.binb_sha1(c,8*a.length)),f=Array(16),g=Array(16),e=0;16>e;)f[e]=909522486^c[e],g[e]=1549556828^c[e],e++;return d=this.binb_sha1(f.concat(this.rstr2binb(b)),512+8*b.length),this.binb2rstr(this.binb_sha1(g.concat(d),672))},rstr2hex:function(a){var b,c,e,f,g;try{}catch(h){b=h,d=0}for(c=d?"0123456789ABCDEF":"0123456789abcdef",f="",g=void 0,e=0;e<a.length;)g=a.charCodeAt(e),f+=c.charAt(g>>>4&15)+c.charAt(15&g),e++;return f},rstr2b64:function(a){var b,d,e,f,g,h,i;try{}catch(j){b=j,c=""}for(h="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",g="",f=a.length,d=0;f>d;){for(i=a.charCodeAt(d)<<16|(f>d+1?a.charCodeAt(d+1)<<8:0)|(f>d+2?a.charCodeAt(d+2):0),e=0;4>e;)g+=8*d+6*e>8*a.length?c:h.charAt(i>>>6*(3-e)&63),e++;d+=3}return g},rstr2any:function(a,b){var c,d,e,f,g,h,i,j,k;for(d=b.length,j=Array(),f=void 0,h=void 0,k=void 0,i=void 0,c=Array(Math.ceil(a.length/2)),f=0;f<c.length;)c[f]=a.charCodeAt(2*f)<<8|a.charCodeAt(2*f+1),f++;for(;c.length>0;){for(i=Array(),k=0,f=0;f<c.length;)k=(k<<16)+c[f],h=Math.floor(k/d),k-=h*d,(i.length>0||h>0)&&(i[i.length]=h),f++;j[j.length]=k,c=i}for(g="",f=j.length-1;f>=0;)g+=b.charAt(j[f]),f--;for(e=Math.ceil(8*a.length/(Math.log(b.length)/Math.log(2))),f=g.length;e>f;)g=b[0]+g,f++;return g},str2rstr_utf8:function(a){var b,c,d,e;for(c="",b=-1,d=void 0,e=void 0;++b<a.length;)d=a.charCodeAt(b),e=b+1<a.length?a.charCodeAt(b+1):0,d>=55296&&56319>=d&&e>=56320&&57343>=e&&(d=65536+((1023&d)<<10)+(1023&e),b++),127>=d?c+=String.fromCharCode(d):2047>=d?c+=String.fromCharCode(192|d>>>6&31,128|63&d):65535>=d?c+=String.fromCharCode(224|d>>>12&15,128|d>>>6&63,128|63&d):2097151>=d&&(c+=String.fromCharCode(240|d>>>18&7,128|d>>>12&63,128|d>>>6&63,128|63&d));return c},str2rstr_utf16le:function(a){var b,c;for(c="",b=0;b<a.length;)c+=String.fromCharCode(255&a.charCodeAt(b),a.charCodeAt(b)>>>8&255),b++;return c},str2rstr_utf16be:function(a){var b,c;for(c="",b=0;b<a.length;)c+=String.fromCharCode(a.charCodeAt(b)>>>8&255,255&a.charCodeAt(b)),b++;return c},rstr2binb:function(a){var b,c;for(c=Array(a.length>>2),b=0;b<c.length;)c[b]=0,b++;for(b=0;b<8*a.length;)c[b>>5]|=(255&a.charCodeAt(b/8))<<24-b%32,b+=8;return c},binb2rstr:function(a){var b,c;for(c="",b=0;b<32*a.length;)c+=String.fromCharCode(a[b>>5]>>>24-b%32&255),b+=8;return c},binb_sha1:function(a,b){var c,d,e,f,g,h,i,j,k,l,m,n,o,p;for(a[b>>5]|=128<<24-b%32,a[(b+64>>9<<4)+15]=b,p=Array(80),c=1732584193,d=-271733879,e=-1732584194,f=271733878,g=-1009589776,h=0;h<a.length;){for(j=c,k=d,l=e,m=f,n=g,i=0;80>i;)p[i]=16>i?a[h+i]:this.bit_rol(p[i-3]^p[i-8]^p[i-14]^p[i-16],1),o=this.safe_add(this.safe_add(this.bit_rol(c,5),this.sha1_ft(i,d,e,f)),this.safe_add(this.safe_add(g,p[i]),this.sha1_kt(i))),g=f,f=e,e=this.bit_rol(d,30),d=c,c=o,i++;c=this.safe_add(c,j),d=this.safe_add(d,k),e=this.safe_add(e,l),f=this.safe_add(f,m),g=this.safe_add(g,n),h+=16}return Array(c,d,e,f,g)},sha1_ft:function(a,b,c,d){return 20>a?b&c|~b&d:40>a?b^c^d:60>a?b&c|b&d|c&d:b^c^d},sha1_kt:function(a){return 20>a?1518500249:40>a?1859775393:60>a?-1894007588:-899497514},safe_add:function(a,b){var c,d;return c=(65535&a)+(65535&b),d=(a>>16)+(b>>16)+(c>>16),d<<16|65535&c},bit_rol:function(a,b){return a<<b|a>>>32-b},create_hash:function(){var a;return a=this.b64_sha1((new Date).getTime()+":"+Math.floor(9999999*Math.random())),a.replace(/\+/g,"-").replace(/\//g,"_").replace(/\=+$/,"")}}},{}],14:[function(a,b){b.exports=function(a){return{getAbsUrl:function(b){var c;return b.match(/^.{2,5}:\/\//)?b:"/"===b[0]?a.location.protocol+"//"+a.location.host+b:(c=a.location.protocol+"//"+a.location.host+a.location.pathname,"/"!==c[c.length-1]&&"#"!==b[0]?c+"/"+b:c+b)},replaceParam:function(a,b,c){return a=a.replace(/\{\{(.*?)\}\}/g,function(a,c){return b[c]||""}),c&&(a=a.replace(/\{(.*?)\}/g,function(a,b){return c[b]||""})),a}}}},{}],15:[function(a,b){var c=b.exports={};c.nextTick=function(){var a="undefined"!=typeof window&&window.setImmediate,b="undefined"!=typeof window&&window.postMessage&&window.addEventListener;if(a)return function(a){return window.setImmediate(a)};if(b){var c=[];return window.addEventListener("message",function(a){var b=a.source;if((b===window||null===b)&&"process-tick"===a.data&&(a.stopPropagation(),c.length>0)){var d=c.shift();d()}},!0),function(a){c.push(a),window.postMessage("process-tick","*")}}return function(a){setTimeout(a,0)}}(),c.title="browser",c.browser=!0,c.env={},c.argv=[],c.binding=function(){throw new Error("process.binding is not supported")},c.cwd=function(){return"/"},c.chdir=function(){throw new Error("process.chdir is not supported")}},{}],16:[function(a,b,c){(function(a){!function(a){"use strict";if("function"==typeof bootstrap)bootstrap("promise",a);else if("object"==typeof c&&"object"==typeof b)b.exports=a();else if("function"==typeof define&&define.amd)define(a);else if("undefined"!=typeof ses){if(!ses.ok())return;ses.makeQ=a}else{if("undefined"==typeof self)throw new Error("This environment was not anticiapted by Q. Please file a bug.");self.Q=a()}}(function(){"use strict";function b(a){return function(){return W.apply(a,arguments)}}function c(a){return a===Object(a)}function d(a){return"[object StopIteration]"===cb(a)||a instanceof S}function e(a,b){if(P&&b.stack&&"object"==typeof a&&null!==a&&a.stack&&-1===a.stack.indexOf(db)){for(var c=[],d=b;d;d=d.source)d.stack&&c.unshift(d.stack);c.unshift(a.stack);var e=c.join("\n"+db+"\n");a.stack=f(e)}}function f(a){for(var b=a.split("\n"),c=[],d=0;d<b.length;++d){var e=b[d];i(e)||g(e)||!e||c.push(e)}return c.join("\n")}function g(a){return-1!==a.indexOf("(module.js:")||-1!==a.indexOf("(node.js:")}function h(a){var b=/at .+ \((.+):(\d+):(?:\d+)\)$/.exec(a);if(b)return[b[1],Number(b[2])];var c=/at ([^ ]+):(\d+):(?:\d+)$/.exec(a);if(c)return[c[1],Number(c[2])];var d=/.*@(.+):(\d+)$/.exec(a);return d?[d[1],Number(d[2])]:void 0}function i(a){var b=h(a);if(!b)return!1;var c=b[0],d=b[1];return c===R&&d>=T&&hb>=d}function j(){if(P)try{throw new Error}catch(a){var b=a.stack.split("\n"),c=b[0].indexOf("@")>0?b[1]:b[2],d=h(c);if(!d)return;return R=d[0],d[1]}}function k(a,b,c){return function(){return"undefined"!=typeof console&&"function"==typeof console.warn&&console.warn(b+" is deprecated, use "+c+" instead.",new Error("").stack),a.apply(a,arguments)}}function l(a){return a instanceof p?a:t(a)?C(a):B(a)}function m(){function a(a){b=a,f.source=a,Y(c,function(b,c){l.nextTick(function(){a.promiseDispatch.apply(a,c)})},void 0),c=void 0,d=void 0}var b,c=[],d=[],e=_(m.prototype),f=_(p.prototype);if(f.promiseDispatch=function(a,e,f){var g=X(arguments);c?(c.push(g),"when"===e&&f[1]&&d.push(f[1])):l.nextTick(function(){b.promiseDispatch.apply(b,g)})},f.valueOf=function(){if(c)return f;var a=r(b);return s(a)&&(b=a),a},f.inspect=function(){return b?b.inspect():{state:"pending"}},l.longStackSupport&&P)try{throw new Error}catch(g){f.stack=g.stack.substring(g.stack.indexOf("\n")+1)}return e.promise=f,e.resolve=function(c){b||a(l(c))},e.fulfill=function(c){b||a(B(c))},e.reject=function(c){b||a(A(c))},e.notify=function(a){b||Y(d,function(b,c){l.nextTick(function(){c(a)})},void 0)},e}function n(a){if("function"!=typeof a)throw new TypeError("resolver must be a function.");var b=m();try{a(b.resolve,b.reject,b.notify)}catch(c){b.reject(c)}return b.promise}function o(a){return n(function(b,c){for(var d=0,e=a.length;e>d;d++)l(a[d]).then(b,c)})}function p(a,b,c){void 0===b&&(b=function(a){return A(new Error("Promise does not support operation: "+a))}),void 0===c&&(c=function(){return{state:"unknown"}});var d=_(p.prototype);if(d.promiseDispatch=function(c,e,f){var g;try{g=a[e]?a[e].apply(d,f):b.call(d,e,f)}catch(h){g=A(h)}c&&c(g)},d.inspect=c,c){var e=c();"rejected"===e.state&&(d.exception=e.reason),d.valueOf=function(){var a=c();return"pending"===a.state||"rejected"===a.state?d:a.value}}return d}function q(a,b,c,d){return l(a).then(b,c,d)}function r(a){if(s(a)){var b=a.inspect();if("fulfilled"===b.state)return b.value}return a}function s(a){return a instanceof p}function t(a){return c(a)&&"function"==typeof a.then}function u(a){return s(a)&&"pending"===a.inspect().state}function v(a){return!s(a)||"fulfilled"===a.inspect().state}function w(a){return s(a)&&"rejected"===a.inspect().state}function x(){eb.length=0,fb.length=0,gb||(gb=!0)}function y(a,b){gb&&(fb.push(a),eb.push(b&&"undefined"!=typeof b.stack?b.stack:"(no stack) "+b))}function z(a){if(gb){var b=Z(fb,a);-1!==b&&(fb.splice(b,1),eb.splice(b,1))}}function A(a){var b=p({when:function(b){return b&&z(this),b?b(a):this}},function(){return this},function(){return{state:"rejected",reason:a}});return y(b,a),b}function B(a){return p({when:function(){return a},get:function(b){return a[b]},set:function(b,c){a[b]=c},"delete":function(b){delete a[b]
},post:function(b,c){return null===b||void 0===b?a.apply(void 0,c):a[b].apply(a,c)},apply:function(b,c){return a.apply(b,c)},keys:function(){return bb(a)}},void 0,function(){return{state:"fulfilled",value:a}})}function C(a){var b=m();return l.nextTick(function(){try{a.then(b.resolve,b.reject,b.notify)}catch(c){b.reject(c)}}),b.promise}function D(a){return p({isDef:function(){}},function(b,c){return J(a,b,c)},function(){return l(a).inspect()})}function E(a,b,c){return l(a).spread(b,c)}function F(a){return function(){function b(a,b){var g;if("undefined"==typeof StopIteration){try{g=c[a](b)}catch(h){return A(h)}return g.done?l(g.value):q(g.value,e,f)}try{g=c[a](b)}catch(h){return d(h)?l(h.value):A(h)}return q(g,e,f)}var c=a.apply(this,arguments),e=b.bind(b,"next"),f=b.bind(b,"throw");return e()}}function G(a){l.done(l.async(a)())}function H(a){throw new S(a)}function I(a){return function(){return E([this,K(arguments)],function(b,c){return a.apply(b,c)})}}function J(a,b,c){return l(a).dispatch(b,c)}function K(a){return q(a,function(a){var b=0,c=m();return Y(a,function(d,e,f){var g;s(e)&&"fulfilled"===(g=e.inspect()).state?a[f]=g.value:(++b,q(e,function(d){a[f]=d,0===--b&&c.resolve(a)},c.reject,function(a){c.notify({index:f,value:a})}))},void 0),0===b&&c.resolve(a),c.promise})}function L(a){return q(a,function(a){return a=$(a,l),q(K($(a,function(a){return q(a,U,U)})),function(){return a})})}function M(a){return l(a).allSettled()}function N(a,b){return l(a).then(void 0,void 0,b)}function O(a,b){return l(a).nodeify(b)}var P=!1;try{throw new Error}catch(Q){P=!!Q.stack}var R,S,T=j(),U=function(){},V=function(){function b(){for(;c.next;){c=c.next;var a=c.task;c.task=void 0;var d=c.domain;d&&(c.domain=void 0,d.enter());try{a()}catch(f){if(g)throw d&&d.exit(),setTimeout(b,0),d&&d.enter(),f;setTimeout(function(){throw f},0)}d&&d.exit()}e=!1}var c={task:void 0,next:null},d=c,e=!1,f=void 0,g=!1;if(V=function(b){d=d.next={task:b,domain:g&&a.domain,next:null},e||(e=!0,f())},"undefined"!=typeof a&&a.nextTick)g=!0,f=function(){a.nextTick(b)};else if("function"==typeof setImmediate)f="undefined"!=typeof window?setImmediate.bind(window,b):function(){setImmediate(b)};else if("undefined"!=typeof MessageChannel){var h=new MessageChannel;h.port1.onmessage=function(){f=i,h.port1.onmessage=b,b()};var i=function(){h.port2.postMessage(0)};f=function(){setTimeout(b,0),i()}}else f=function(){setTimeout(b,0)};return V}(),W=Function.call,X=b(Array.prototype.slice),Y=b(Array.prototype.reduce||function(a,b){var c=0,d=this.length;if(1===arguments.length)for(;;){if(c in this){b=this[c++];break}if(++c>=d)throw new TypeError}for(;d>c;c++)c in this&&(b=a(b,this[c],c));return b}),Z=b(Array.prototype.indexOf||function(a){for(var b=0;b<this.length;b++)if(this[b]===a)return b;return-1}),$=b(Array.prototype.map||function(a,b){var c=this,d=[];return Y(c,function(e,f,g){d.push(a.call(b,f,g,c))},void 0),d}),_=Object.create||function(a){function b(){}return b.prototype=a,new b},ab=b(Object.prototype.hasOwnProperty),bb=Object.keys||function(a){var b=[];for(var c in a)ab(a,c)&&b.push(c);return b},cb=b(Object.prototype.toString);S="undefined"!=typeof ReturnValue?ReturnValue:function(a){this.value=a};var db="From previous event:";l.resolve=l,l.nextTick=V,l.longStackSupport=!1,"object"==typeof a&&a&&a.env&&a.env.Q_DEBUG&&(l.longStackSupport=!0),l.defer=m,m.prototype.makeNodeResolver=function(){var a=this;return function(b,c){b?a.reject(b):a.resolve(arguments.length>2?X(arguments,1):c)}},l.Promise=n,l.promise=n,n.race=o,n.all=K,n.reject=A,n.resolve=l,l.passByCopy=function(a){return a},p.prototype.passByCopy=function(){return this},l.join=function(a,b){return l(a).join(b)},p.prototype.join=function(a){return l([this,a]).spread(function(a,b){if(a===b)return a;throw new Error("Can't join: not the same: "+a+" "+b)})},l.race=o,p.prototype.race=function(){return this.then(l.race)},l.makePromise=p,p.prototype.toString=function(){return"[object Promise]"},p.prototype.then=function(a,b,c){function d(b){try{return"function"==typeof a?a(b):b}catch(c){return A(c)}}function f(a){if("function"==typeof b){e(a,h);try{return b(a)}catch(c){return A(c)}}return A(a)}function g(a){return"function"==typeof c?c(a):a}var h=this,i=m(),j=!1;return l.nextTick(function(){h.promiseDispatch(function(a){j||(j=!0,i.resolve(d(a)))},"when",[function(a){j||(j=!0,i.resolve(f(a)))}])}),h.promiseDispatch(void 0,"when",[void 0,function(a){var b,c=!1;try{b=g(a)}catch(d){if(c=!0,!l.onerror)throw d;l.onerror(d)}c||i.notify(b)}]),i.promise},l.tap=function(a,b){return l(a).tap(b)},p.prototype.tap=function(a){return a=l(a),this.then(function(b){return a.fcall(b).thenResolve(b)})},l.when=q,p.prototype.thenResolve=function(a){return this.then(function(){return a})},l.thenResolve=function(a,b){return l(a).thenResolve(b)},p.prototype.thenReject=function(a){return this.then(function(){throw a})},l.thenReject=function(a,b){return l(a).thenReject(b)},l.nearer=r,l.isPromise=s,l.isPromiseAlike=t,l.isPending=u,p.prototype.isPending=function(){return"pending"===this.inspect().state},l.isFulfilled=v,p.prototype.isFulfilled=function(){return"fulfilled"===this.inspect().state},l.isRejected=w,p.prototype.isRejected=function(){return"rejected"===this.inspect().state};var eb=[],fb=[],gb=!0;l.resetUnhandledRejections=x,l.getUnhandledReasons=function(){return eb.slice()},l.stopUnhandledRejectionTracking=function(){x(),gb=!1},x(),l.reject=A,l.fulfill=B,l.master=D,l.spread=E,p.prototype.spread=function(a,b){return this.all().then(function(b){return a.apply(void 0,b)},b)},l.async=F,l.spawn=G,l["return"]=H,l.promised=I,l.dispatch=J,p.prototype.dispatch=function(a,b){var c=this,d=m();return l.nextTick(function(){c.promiseDispatch(d.resolve,a,b)}),d.promise},l.get=function(a,b){return l(a).dispatch("get",[b])},p.prototype.get=function(a){return this.dispatch("get",[a])},l.set=function(a,b,c){return l(a).dispatch("set",[b,c])},p.prototype.set=function(a,b){return this.dispatch("set",[a,b])},l.del=l["delete"]=function(a,b){return l(a).dispatch("delete",[b])},p.prototype.del=p.prototype["delete"]=function(a){return this.dispatch("delete",[a])},l.mapply=l.post=function(a,b,c){return l(a).dispatch("post",[b,c])},p.prototype.mapply=p.prototype.post=function(a,b){return this.dispatch("post",[a,b])},l.send=l.mcall=l.invoke=function(a,b){return l(a).dispatch("post",[b,X(arguments,2)])},p.prototype.send=p.prototype.mcall=p.prototype.invoke=function(a){return this.dispatch("post",[a,X(arguments,1)])},l.fapply=function(a,b){return l(a).dispatch("apply",[void 0,b])},p.prototype.fapply=function(a){return this.dispatch("apply",[void 0,a])},l["try"]=l.fcall=function(a){return l(a).dispatch("apply",[void 0,X(arguments,1)])},p.prototype.fcall=function(){return this.dispatch("apply",[void 0,X(arguments)])},l.fbind=function(a){var b=l(a),c=X(arguments,1);return function(){return b.dispatch("apply",[this,c.concat(X(arguments))])}},p.prototype.fbind=function(){var a=this,b=X(arguments);return function(){return a.dispatch("apply",[this,b.concat(X(arguments))])}},l.keys=function(a){return l(a).dispatch("keys",[])},p.prototype.keys=function(){return this.dispatch("keys",[])},l.all=K,p.prototype.all=function(){return K(this)},l.allResolved=k(L,"allResolved","allSettled"),p.prototype.allResolved=function(){return L(this)},l.allSettled=M,p.prototype.allSettled=function(){return this.then(function(a){return K($(a,function(a){function b(){return a.inspect()}return a=l(a),a.then(b,b)}))})},l.fail=l["catch"]=function(a,b){return l(a).then(void 0,b)},p.prototype.fail=p.prototype["catch"]=function(a){return this.then(void 0,a)},l.progress=N,p.prototype.progress=function(a){return this.then(void 0,void 0,a)},l.fin=l["finally"]=function(a,b){return l(a)["finally"](b)},p.prototype.fin=p.prototype["finally"]=function(a){return a=l(a),this.then(function(b){return a.fcall().then(function(){return b})},function(b){return a.fcall().then(function(){throw b})})},l.done=function(a,b,c,d){return l(a).done(b,c,d)},p.prototype.done=function(b,c,d){var f=function(a){l.nextTick(function(){if(e(a,g),!l.onerror)throw a;l.onerror(a)})},g=b||c||d?this.then(b,c,d):this;"object"==typeof a&&a&&a.domain&&(f=a.domain.bind(f)),g.then(void 0,f)},l.timeout=function(a,b,c){return l(a).timeout(b,c)},p.prototype.timeout=function(a,b){var c=m(),d=setTimeout(function(){b&&"string"!=typeof b||(b=new Error(b||"Timed out after "+a+" ms"),b.code="ETIMEDOUT"),c.reject(b)},a);return this.then(function(a){clearTimeout(d),c.resolve(a)},function(a){clearTimeout(d),c.reject(a)},c.notify),c.promise},l.delay=function(a,b){return void 0===b&&(b=a,a=void 0),l(a).delay(b)},p.prototype.delay=function(a){return this.then(function(b){var c=m();return setTimeout(function(){c.resolve(b)},a),c.promise})},l.nfapply=function(a,b){return l(a).nfapply(b)},p.prototype.nfapply=function(a){var b=m(),c=X(a);return c.push(b.makeNodeResolver()),this.fapply(c).fail(b.reject),b.promise},l.nfcall=function(a){var b=X(arguments,1);return l(a).nfapply(b)},p.prototype.nfcall=function(){var a=X(arguments),b=m();return a.push(b.makeNodeResolver()),this.fapply(a).fail(b.reject),b.promise},l.nfbind=l.denodeify=function(a){var b=X(arguments,1);return function(){var c=b.concat(X(arguments)),d=m();return c.push(d.makeNodeResolver()),l(a).fapply(c).fail(d.reject),d.promise}},p.prototype.nfbind=p.prototype.denodeify=function(){var a=X(arguments);return a.unshift(this),l.denodeify.apply(void 0,a)},l.nbind=function(a,b){var c=X(arguments,2);return function(){function d(){return a.apply(b,arguments)}var e=c.concat(X(arguments)),f=m();return e.push(f.makeNodeResolver()),l(d).fapply(e).fail(f.reject),f.promise}},p.prototype.nbind=function(){var a=X(arguments,0);return a.unshift(this),l.nbind.apply(void 0,a)},l.nmapply=l.npost=function(a,b,c){return l(a).npost(b,c)},p.prototype.nmapply=p.prototype.npost=function(a,b){var c=X(b||[]),d=m();return c.push(d.makeNodeResolver()),this.dispatch("post",[a,c]).fail(d.reject),d.promise},l.nsend=l.nmcall=l.ninvoke=function(a,b){var c=X(arguments,2),d=m();return c.push(d.makeNodeResolver()),l(a).dispatch("post",[b,c]).fail(d.reject),d.promise},p.prototype.nsend=p.prototype.nmcall=p.prototype.ninvoke=function(a){var b=X(arguments,1),c=m();return b.push(c.makeNodeResolver()),this.dispatch("post",[a,b]).fail(c.reject),c.promise},l.nodeify=O,p.prototype.nodeify=function(a){return a?void this.then(function(b){l.nextTick(function(){a(null,b)})},function(b){l.nextTick(function(){a(b)})}):this};var hb=j();return l})}).call(this,a("/Users/antoine/projects/oauth-js/node_modules/browserify/node_modules/insert-module-globals/node_modules/process/browser.js"))},{"/Users/antoine/projects/oauth-js/node_modules/browserify/node_modules/insert-module-globals/node_modules/process/browser.js":15}]},{},[8]);
},{}],"/home/travis/build/lefant/ng-flickrdupfinder/bower_components/ui.bootstrap/src/pagination/pagination.js":[function(require,module,exports){
angular.module('ui.bootstrap.pagination', [])

.controller('PaginationController', ['$scope', '$attrs', '$parse', function ($scope, $attrs, $parse) {
  var self = this,
      ngModelCtrl = { $setViewValue: angular.noop }, // nullModelCtrl
      setNumPages = $attrs.numPages ? $parse($attrs.numPages).assign : angular.noop;

  this.init = function(ngModelCtrl_, config) {
    ngModelCtrl = ngModelCtrl_;
    this.config = config;

    ngModelCtrl.$render = function() {
      self.render();
    };

    if ($attrs.itemsPerPage) {
      $scope.$parent.$watch($parse($attrs.itemsPerPage), function(value) {
        self.itemsPerPage = parseInt(value, 10);
        $scope.totalPages = self.calculateTotalPages();
      });
    } else {
      this.itemsPerPage = config.itemsPerPage;
    }
  };

  this.calculateTotalPages = function() {
    var totalPages = this.itemsPerPage < 1 ? 1 : Math.ceil($scope.totalItems / this.itemsPerPage);
    return Math.max(totalPages || 0, 1);
  };

  this.render = function() {
    $scope.page = parseInt(ngModelCtrl.$viewValue, 10) || 1;
  };

  $scope.selectPage = function(page) {
    if ( $scope.page !== page && page > 0 && page <= $scope.totalPages) {
      ngModelCtrl.$setViewValue(page);
      ngModelCtrl.$render();
    }
  };

  $scope.getText = function( key ) {
    return $scope[key + 'Text'] || self.config[key + 'Text'];
  };
  $scope.noPrevious = function() {
    return $scope.page === 1;
  };
  $scope.noNext = function() {
    return $scope.page === $scope.totalPages;
  };

  $scope.$watch('totalItems', function() {
    $scope.totalPages = self.calculateTotalPages();
  });

  $scope.$watch('totalPages', function(value) {
    setNumPages($scope.$parent, value); // Readonly variable

    if ( $scope.page > value ) {
      $scope.selectPage(value);
    } else {
      ngModelCtrl.$render();
    }
  });
}])

.constant('paginationConfig', {
  itemsPerPage: 10,
  boundaryLinks: false,
  directionLinks: true,
  firstText: 'First',
  previousText: 'Previous',
  nextText: 'Next',
  lastText: 'Last',
  rotate: true
})

.directive('pagination', ['$parse', 'paginationConfig', function($parse, paginationConfig) {
  return {
    restrict: 'EA',
    scope: {
      totalItems: '=',
      firstText: '@',
      previousText: '@',
      nextText: '@',
      lastText: '@'
    },
    require: ['pagination', '?ngModel'],
    controller: 'PaginationController',
    templateUrl: 'template/pagination/pagination.html',
    replace: true,
    link: function(scope, element, attrs, ctrls) {
      var paginationCtrl = ctrls[0], ngModelCtrl = ctrls[1];

      if (!ngModelCtrl) {
         return; // do nothing if no ng-model
      }

      // Setup configuration parameters
      var maxSize = angular.isDefined(attrs.maxSize) ? scope.$parent.$eval(attrs.maxSize) : paginationConfig.maxSize,
          rotate = angular.isDefined(attrs.rotate) ? scope.$parent.$eval(attrs.rotate) : paginationConfig.rotate;
      scope.boundaryLinks = angular.isDefined(attrs.boundaryLinks) ? scope.$parent.$eval(attrs.boundaryLinks) : paginationConfig.boundaryLinks;
      scope.directionLinks = angular.isDefined(attrs.directionLinks) ? scope.$parent.$eval(attrs.directionLinks) : paginationConfig.directionLinks;

      paginationCtrl.init(ngModelCtrl, paginationConfig);

      if (attrs.maxSize) {
        scope.$parent.$watch($parse(attrs.maxSize), function(value) {
          maxSize = parseInt(value, 10);
          paginationCtrl.render();
        });
      }

      // Create page object used in template
      function makePage(number, text, isActive) {
        return {
          number: number,
          text: text,
          active: isActive
        };
      }

      function getPages(currentPage, totalPages) {
        var pages = [];

        // Default page limits
        var startPage = 1, endPage = totalPages;
        var isMaxSized = ( angular.isDefined(maxSize) && maxSize < totalPages );

        // recompute if maxSize
        if ( isMaxSized ) {
          if ( rotate ) {
            // Current page is displayed in the middle of the visible ones
            startPage = Math.max(currentPage - Math.floor(maxSize/2), 1);
            endPage   = startPage + maxSize - 1;

            // Adjust if limit is exceeded
            if (endPage > totalPages) {
              endPage   = totalPages;
              startPage = endPage - maxSize + 1;
            }
          } else {
            // Visible pages are paginated with maxSize
            startPage = ((Math.ceil(currentPage / maxSize) - 1) * maxSize) + 1;

            // Adjust last page if limit is exceeded
            endPage = Math.min(startPage + maxSize - 1, totalPages);
          }
        }

        // Add page number links
        for (var number = startPage; number <= endPage; number++) {
          var page = makePage(number, number, number === currentPage);
          pages.push(page);
        }

        // Add links to move between page sets
        if ( isMaxSized && ! rotate ) {
          if ( startPage > 1 ) {
            var previousPageSet = makePage(startPage - 1, '...', false);
            pages.unshift(previousPageSet);
          }

          if ( endPage < totalPages ) {
            var nextPageSet = makePage(endPage + 1, '...', false);
            pages.push(nextPageSet);
          }
        }

        return pages;
      }

      var originalRender = paginationCtrl.render;
      paginationCtrl.render = function() {
        originalRender();
        if (scope.page > 0 && scope.page <= scope.totalPages) {
          scope.pages = getPages(scope.page, scope.totalPages);
        }
      };
    }
  };
}])

.constant('pagerConfig', {
  itemsPerPage: 10,
  previousText: '« Previous',
  nextText: 'Next »',
  align: true
})

.directive('pager', ['pagerConfig', function(pagerConfig) {
  return {
    restrict: 'EA',
    scope: {
      totalItems: '=',
      previousText: '@',
      nextText: '@'
    },
    require: ['pager', '?ngModel'],
    controller: 'PaginationController',
    templateUrl: 'template/pagination/pager.html',
    replace: true,
    link: function(scope, element, attrs, ctrls) {
      var paginationCtrl = ctrls[0], ngModelCtrl = ctrls[1];

      if (!ngModelCtrl) {
         return; // do nothing if no ng-model
      }

      scope.align = angular.isDefined(attrs.align) ? scope.$parent.$eval(attrs.align) : pagerConfig.align;
      paginationCtrl.init(ngModelCtrl, pagerConfig);
    }
  };
}]);

},{}],"/home/travis/build/lefant/ng-flickrdupfinder/bower_components/underscore/underscore.js":[function(require,module,exports){
//     Underscore.js 1.8.2
//     http://underscorejs.org
//     (c) 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
//     Underscore may be freely distributed under the MIT license.

(function() {

  // Baseline setup
  // --------------

  // Establish the root object, `window` in the browser, or `exports` on the server.
  var root = this;

  // Save the previous value of the `_` variable.
  var previousUnderscore = root._;

  // Save bytes in the minified (but not gzipped) version:
  var ArrayProto = Array.prototype, ObjProto = Object.prototype, FuncProto = Function.prototype;

  // Create quick reference variables for speed access to core prototypes.
  var
    push             = ArrayProto.push,
    slice            = ArrayProto.slice,
    toString         = ObjProto.toString,
    hasOwnProperty   = ObjProto.hasOwnProperty;

  // All **ECMAScript 5** native function implementations that we hope to use
  // are declared here.
  var
    nativeIsArray      = Array.isArray,
    nativeKeys         = Object.keys,
    nativeBind         = FuncProto.bind,
    nativeCreate       = Object.create;

  // Naked function reference for surrogate-prototype-swapping.
  var Ctor = function(){};

  // Create a safe reference to the Underscore object for use below.
  var _ = function(obj) {
    if (obj instanceof _) return obj;
    if (!(this instanceof _)) return new _(obj);
    this._wrapped = obj;
  };

  // Export the Underscore object for **Node.js**, with
  // backwards-compatibility for the old `require()` API. If we're in
  // the browser, add `_` as a global object.
  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports = _;
    }
    exports._ = _;
  } else {
    root._ = _;
  }

  // Current version.
  _.VERSION = '1.8.2';

  // Internal function that returns an efficient (for current engines) version
  // of the passed-in callback, to be repeatedly applied in other Underscore
  // functions.
  var optimizeCb = function(func, context, argCount) {
    if (context === void 0) return func;
    switch (argCount == null ? 3 : argCount) {
      case 1: return function(value) {
        return func.call(context, value);
      };
      case 2: return function(value, other) {
        return func.call(context, value, other);
      };
      case 3: return function(value, index, collection) {
        return func.call(context, value, index, collection);
      };
      case 4: return function(accumulator, value, index, collection) {
        return func.call(context, accumulator, value, index, collection);
      };
    }
    return function() {
      return func.apply(context, arguments);
    };
  };

  // A mostly-internal function to generate callbacks that can be applied
  // to each element in a collection, returning the desired result — either
  // identity, an arbitrary callback, a property matcher, or a property accessor.
  var cb = function(value, context, argCount) {
    if (value == null) return _.identity;
    if (_.isFunction(value)) return optimizeCb(value, context, argCount);
    if (_.isObject(value)) return _.matcher(value);
    return _.property(value);
  };
  _.iteratee = function(value, context) {
    return cb(value, context, Infinity);
  };

  // An internal function for creating assigner functions.
  var createAssigner = function(keysFunc, undefinedOnly) {
    return function(obj) {
      var length = arguments.length;
      if (length < 2 || obj == null) return obj;
      for (var index = 1; index < length; index++) {
        var source = arguments[index],
            keys = keysFunc(source),
            l = keys.length;
        for (var i = 0; i < l; i++) {
          var key = keys[i];
          if (!undefinedOnly || obj[key] === void 0) obj[key] = source[key];
        }
      }
      return obj;
    };
  };

  // An internal function for creating a new object that inherits from another.
  var baseCreate = function(prototype) {
    if (!_.isObject(prototype)) return {};
    if (nativeCreate) return nativeCreate(prototype);
    Ctor.prototype = prototype;
    var result = new Ctor;
    Ctor.prototype = null;
    return result;
  };

  // Helper for collection methods to determine whether a collection
  // should be iterated as an array or as an object
  // Related: http://people.mozilla.org/~jorendorff/es6-draft.html#sec-tolength
  var MAX_ARRAY_INDEX = Math.pow(2, 53) - 1;
  var isArrayLike = function(collection) {
    var length = collection && collection.length;
    return typeof length == 'number' && length >= 0 && length <= MAX_ARRAY_INDEX;
  };

  // Collection Functions
  // --------------------

  // The cornerstone, an `each` implementation, aka `forEach`.
  // Handles raw objects in addition to array-likes. Treats all
  // sparse array-likes as if they were dense.
  _.each = _.forEach = function(obj, iteratee, context) {
    iteratee = optimizeCb(iteratee, context);
    var i, length;
    if (isArrayLike(obj)) {
      for (i = 0, length = obj.length; i < length; i++) {
        iteratee(obj[i], i, obj);
      }
    } else {
      var keys = _.keys(obj);
      for (i = 0, length = keys.length; i < length; i++) {
        iteratee(obj[keys[i]], keys[i], obj);
      }
    }
    return obj;
  };

  // Return the results of applying the iteratee to each element.
  _.map = _.collect = function(obj, iteratee, context) {
    iteratee = cb(iteratee, context);
    var keys = !isArrayLike(obj) && _.keys(obj),
        length = (keys || obj).length,
        results = Array(length);
    for (var index = 0; index < length; index++) {
      var currentKey = keys ? keys[index] : index;
      results[index] = iteratee(obj[currentKey], currentKey, obj);
    }
    return results;
  };

  // Create a reducing function iterating left or right.
  function createReduce(dir) {
    // Optimized iterator function as using arguments.length
    // in the main function will deoptimize the, see #1991.
    function iterator(obj, iteratee, memo, keys, index, length) {
      for (; index >= 0 && index < length; index += dir) {
        var currentKey = keys ? keys[index] : index;
        memo = iteratee(memo, obj[currentKey], currentKey, obj);
      }
      return memo;
    }

    return function(obj, iteratee, memo, context) {
      iteratee = optimizeCb(iteratee, context, 4);
      var keys = !isArrayLike(obj) && _.keys(obj),
          length = (keys || obj).length,
          index = dir > 0 ? 0 : length - 1;
      // Determine the initial value if none is provided.
      if (arguments.length < 3) {
        memo = obj[keys ? keys[index] : index];
        index += dir;
      }
      return iterator(obj, iteratee, memo, keys, index, length);
    };
  }

  // **Reduce** builds up a single result from a list of values, aka `inject`,
  // or `foldl`.
  _.reduce = _.foldl = _.inject = createReduce(1);

  // The right-associative version of reduce, also known as `foldr`.
  _.reduceRight = _.foldr = createReduce(-1);

  // Return the first value which passes a truth test. Aliased as `detect`.
  _.find = _.detect = function(obj, predicate, context) {
    var key;
    if (isArrayLike(obj)) {
      key = _.findIndex(obj, predicate, context);
    } else {
      key = _.findKey(obj, predicate, context);
    }
    if (key !== void 0 && key !== -1) return obj[key];
  };

  // Return all the elements that pass a truth test.
  // Aliased as `select`.
  _.filter = _.select = function(obj, predicate, context) {
    var results = [];
    predicate = cb(predicate, context);
    _.each(obj, function(value, index, list) {
      if (predicate(value, index, list)) results.push(value);
    });
    return results;
  };

  // Return all the elements for which a truth test fails.
  _.reject = function(obj, predicate, context) {
    return _.filter(obj, _.negate(cb(predicate)), context);
  };

  // Determine whether all of the elements match a truth test.
  // Aliased as `all`.
  _.every = _.all = function(obj, predicate, context) {
    predicate = cb(predicate, context);
    var keys = !isArrayLike(obj) && _.keys(obj),
        length = (keys || obj).length;
    for (var index = 0; index < length; index++) {
      var currentKey = keys ? keys[index] : index;
      if (!predicate(obj[currentKey], currentKey, obj)) return false;
    }
    return true;
  };

  // Determine if at least one element in the object matches a truth test.
  // Aliased as `any`.
  _.some = _.any = function(obj, predicate, context) {
    predicate = cb(predicate, context);
    var keys = !isArrayLike(obj) && _.keys(obj),
        length = (keys || obj).length;
    for (var index = 0; index < length; index++) {
      var currentKey = keys ? keys[index] : index;
      if (predicate(obj[currentKey], currentKey, obj)) return true;
    }
    return false;
  };

  // Determine if the array or object contains a given value (using `===`).
  // Aliased as `includes` and `include`.
  _.contains = _.includes = _.include = function(obj, target, fromIndex) {
    if (!isArrayLike(obj)) obj = _.values(obj);
    return _.indexOf(obj, target, typeof fromIndex == 'number' && fromIndex) >= 0;
  };

  // Invoke a method (with arguments) on every item in a collection.
  _.invoke = function(obj, method) {
    var args = slice.call(arguments, 2);
    var isFunc = _.isFunction(method);
    return _.map(obj, function(value) {
      var func = isFunc ? method : value[method];
      return func == null ? func : func.apply(value, args);
    });
  };

  // Convenience version of a common use case of `map`: fetching a property.
  _.pluck = function(obj, key) {
    return _.map(obj, _.property(key));
  };

  // Convenience version of a common use case of `filter`: selecting only objects
  // containing specific `key:value` pairs.
  _.where = function(obj, attrs) {
    return _.filter(obj, _.matcher(attrs));
  };

  // Convenience version of a common use case of `find`: getting the first object
  // containing specific `key:value` pairs.
  _.findWhere = function(obj, attrs) {
    return _.find(obj, _.matcher(attrs));
  };

  // Return the maximum element (or element-based computation).
  _.max = function(obj, iteratee, context) {
    var result = -Infinity, lastComputed = -Infinity,
        value, computed;
    if (iteratee == null && obj != null) {
      obj = isArrayLike(obj) ? obj : _.values(obj);
      for (var i = 0, length = obj.length; i < length; i++) {
        value = obj[i];
        if (value > result) {
          result = value;
        }
      }
    } else {
      iteratee = cb(iteratee, context);
      _.each(obj, function(value, index, list) {
        computed = iteratee(value, index, list);
        if (computed > lastComputed || computed === -Infinity && result === -Infinity) {
          result = value;
          lastComputed = computed;
        }
      });
    }
    return result;
  };

  // Return the minimum element (or element-based computation).
  _.min = function(obj, iteratee, context) {
    var result = Infinity, lastComputed = Infinity,
        value, computed;
    if (iteratee == null && obj != null) {
      obj = isArrayLike(obj) ? obj : _.values(obj);
      for (var i = 0, length = obj.length; i < length; i++) {
        value = obj[i];
        if (value < result) {
          result = value;
        }
      }
    } else {
      iteratee = cb(iteratee, context);
      _.each(obj, function(value, index, list) {
        computed = iteratee(value, index, list);
        if (computed < lastComputed || computed === Infinity && result === Infinity) {
          result = value;
          lastComputed = computed;
        }
      });
    }
    return result;
  };

  // Shuffle a collection, using the modern version of the
  // [Fisher-Yates shuffle](http://en.wikipedia.org/wiki/Fisher–Yates_shuffle).
  _.shuffle = function(obj) {
    var set = isArrayLike(obj) ? obj : _.values(obj);
    var length = set.length;
    var shuffled = Array(length);
    for (var index = 0, rand; index < length; index++) {
      rand = _.random(0, index);
      if (rand !== index) shuffled[index] = shuffled[rand];
      shuffled[rand] = set[index];
    }
    return shuffled;
  };

  // Sample **n** random values from a collection.
  // If **n** is not specified, returns a single random element.
  // The internal `guard` argument allows it to work with `map`.
  _.sample = function(obj, n, guard) {
    if (n == null || guard) {
      if (!isArrayLike(obj)) obj = _.values(obj);
      return obj[_.random(obj.length - 1)];
    }
    return _.shuffle(obj).slice(0, Math.max(0, n));
  };

  // Sort the object's values by a criterion produced by an iteratee.
  _.sortBy = function(obj, iteratee, context) {
    iteratee = cb(iteratee, context);
    return _.pluck(_.map(obj, function(value, index, list) {
      return {
        value: value,
        index: index,
        criteria: iteratee(value, index, list)
      };
    }).sort(function(left, right) {
      var a = left.criteria;
      var b = right.criteria;
      if (a !== b) {
        if (a > b || a === void 0) return 1;
        if (a < b || b === void 0) return -1;
      }
      return left.index - right.index;
    }), 'value');
  };

  // An internal function used for aggregate "group by" operations.
  var group = function(behavior) {
    return function(obj, iteratee, context) {
      var result = {};
      iteratee = cb(iteratee, context);
      _.each(obj, function(value, index) {
        var key = iteratee(value, index, obj);
        behavior(result, value, key);
      });
      return result;
    };
  };

  // Groups the object's values by a criterion. Pass either a string attribute
  // to group by, or a function that returns the criterion.
  _.groupBy = group(function(result, value, key) {
    if (_.has(result, key)) result[key].push(value); else result[key] = [value];
  });

  // Indexes the object's values by a criterion, similar to `groupBy`, but for
  // when you know that your index values will be unique.
  _.indexBy = group(function(result, value, key) {
    result[key] = value;
  });

  // Counts instances of an object that group by a certain criterion. Pass
  // either a string attribute to count by, or a function that returns the
  // criterion.
  _.countBy = group(function(result, value, key) {
    if (_.has(result, key)) result[key]++; else result[key] = 1;
  });

  // Safely create a real, live array from anything iterable.
  _.toArray = function(obj) {
    if (!obj) return [];
    if (_.isArray(obj)) return slice.call(obj);
    if (isArrayLike(obj)) return _.map(obj, _.identity);
    return _.values(obj);
  };

  // Return the number of elements in an object.
  _.size = function(obj) {
    if (obj == null) return 0;
    return isArrayLike(obj) ? obj.length : _.keys(obj).length;
  };

  // Split a collection into two arrays: one whose elements all satisfy the given
  // predicate, and one whose elements all do not satisfy the predicate.
  _.partition = function(obj, predicate, context) {
    predicate = cb(predicate, context);
    var pass = [], fail = [];
    _.each(obj, function(value, key, obj) {
      (predicate(value, key, obj) ? pass : fail).push(value);
    });
    return [pass, fail];
  };

  // Array Functions
  // ---------------

  // Get the first element of an array. Passing **n** will return the first N
  // values in the array. Aliased as `head` and `take`. The **guard** check
  // allows it to work with `_.map`.
  _.first = _.head = _.take = function(array, n, guard) {
    if (array == null) return void 0;
    if (n == null || guard) return array[0];
    return _.initial(array, array.length - n);
  };

  // Returns everything but the last entry of the array. Especially useful on
  // the arguments object. Passing **n** will return all the values in
  // the array, excluding the last N.
  _.initial = function(array, n, guard) {
    return slice.call(array, 0, Math.max(0, array.length - (n == null || guard ? 1 : n)));
  };

  // Get the last element of an array. Passing **n** will return the last N
  // values in the array.
  _.last = function(array, n, guard) {
    if (array == null) return void 0;
    if (n == null || guard) return array[array.length - 1];
    return _.rest(array, Math.max(0, array.length - n));
  };

  // Returns everything but the first entry of the array. Aliased as `tail` and `drop`.
  // Especially useful on the arguments object. Passing an **n** will return
  // the rest N values in the array.
  _.rest = _.tail = _.drop = function(array, n, guard) {
    return slice.call(array, n == null || guard ? 1 : n);
  };

  // Trim out all falsy values from an array.
  _.compact = function(array) {
    return _.filter(array, _.identity);
  };

  // Internal implementation of a recursive `flatten` function.
  var flatten = function(input, shallow, strict, startIndex) {
    var output = [], idx = 0;
    for (var i = startIndex || 0, length = input && input.length; i < length; i++) {
      var value = input[i];
      if (isArrayLike(value) && (_.isArray(value) || _.isArguments(value))) {
        //flatten current level of array or arguments object
        if (!shallow) value = flatten(value, shallow, strict);
        var j = 0, len = value.length;
        output.length += len;
        while (j < len) {
          output[idx++] = value[j++];
        }
      } else if (!strict) {
        output[idx++] = value;
      }
    }
    return output;
  };

  // Flatten out an array, either recursively (by default), or just one level.
  _.flatten = function(array, shallow) {
    return flatten(array, shallow, false);
  };

  // Return a version of the array that does not contain the specified value(s).
  _.without = function(array) {
    return _.difference(array, slice.call(arguments, 1));
  };

  // Produce a duplicate-free version of the array. If the array has already
  // been sorted, you have the option of using a faster algorithm.
  // Aliased as `unique`.
  _.uniq = _.unique = function(array, isSorted, iteratee, context) {
    if (array == null) return [];
    if (!_.isBoolean(isSorted)) {
      context = iteratee;
      iteratee = isSorted;
      isSorted = false;
    }
    if (iteratee != null) iteratee = cb(iteratee, context);
    var result = [];
    var seen = [];
    for (var i = 0, length = array.length; i < length; i++) {
      var value = array[i],
          computed = iteratee ? iteratee(value, i, array) : value;
      if (isSorted) {
        if (!i || seen !== computed) result.push(value);
        seen = computed;
      } else if (iteratee) {
        if (!_.contains(seen, computed)) {
          seen.push(computed);
          result.push(value);
        }
      } else if (!_.contains(result, value)) {
        result.push(value);
      }
    }
    return result;
  };

  // Produce an array that contains the union: each distinct element from all of
  // the passed-in arrays.
  _.union = function() {
    return _.uniq(flatten(arguments, true, true));
  };

  // Produce an array that contains every item shared between all the
  // passed-in arrays.
  _.intersection = function(array) {
    if (array == null) return [];
    var result = [];
    var argsLength = arguments.length;
    for (var i = 0, length = array.length; i < length; i++) {
      var item = array[i];
      if (_.contains(result, item)) continue;
      for (var j = 1; j < argsLength; j++) {
        if (!_.contains(arguments[j], item)) break;
      }
      if (j === argsLength) result.push(item);
    }
    return result;
  };

  // Take the difference between one array and a number of other arrays.
  // Only the elements present in just the first array will remain.
  _.difference = function(array) {
    var rest = flatten(arguments, true, true, 1);
    return _.filter(array, function(value){
      return !_.contains(rest, value);
    });
  };

  // Zip together multiple lists into a single array -- elements that share
  // an index go together.
  _.zip = function() {
    return _.unzip(arguments);
  };

  // Complement of _.zip. Unzip accepts an array of arrays and groups
  // each array's elements on shared indices
  _.unzip = function(array) {
    var length = array && _.max(array, 'length').length || 0;
    var result = Array(length);

    for (var index = 0; index < length; index++) {
      result[index] = _.pluck(array, index);
    }
    return result;
  };

  // Converts lists into objects. Pass either a single array of `[key, value]`
  // pairs, or two parallel arrays of the same length -- one of keys, and one of
  // the corresponding values.
  _.object = function(list, values) {
    var result = {};
    for (var i = 0, length = list && list.length; i < length; i++) {
      if (values) {
        result[list[i]] = values[i];
      } else {
        result[list[i][0]] = list[i][1];
      }
    }
    return result;
  };

  // Return the position of the first occurrence of an item in an array,
  // or -1 if the item is not included in the array.
  // If the array is large and already in sort order, pass `true`
  // for **isSorted** to use binary search.
  _.indexOf = function(array, item, isSorted) {
    var i = 0, length = array && array.length;
    if (typeof isSorted == 'number') {
      i = isSorted < 0 ? Math.max(0, length + isSorted) : isSorted;
    } else if (isSorted && length) {
      i = _.sortedIndex(array, item);
      return array[i] === item ? i : -1;
    }
    if (item !== item) {
      return _.findIndex(slice.call(array, i), _.isNaN);
    }
    for (; i < length; i++) if (array[i] === item) return i;
    return -1;
  };

  _.lastIndexOf = function(array, item, from) {
    var idx = array ? array.length : 0;
    if (typeof from == 'number') {
      idx = from < 0 ? idx + from + 1 : Math.min(idx, from + 1);
    }
    if (item !== item) {
      return _.findLastIndex(slice.call(array, 0, idx), _.isNaN);
    }
    while (--idx >= 0) if (array[idx] === item) return idx;
    return -1;
  };

  // Generator function to create the findIndex and findLastIndex functions
  function createIndexFinder(dir) {
    return function(array, predicate, context) {
      predicate = cb(predicate, context);
      var length = array != null && array.length;
      var index = dir > 0 ? 0 : length - 1;
      for (; index >= 0 && index < length; index += dir) {
        if (predicate(array[index], index, array)) return index;
      }
      return -1;
    };
  }

  // Returns the first index on an array-like that passes a predicate test
  _.findIndex = createIndexFinder(1);

  _.findLastIndex = createIndexFinder(-1);

  // Use a comparator function to figure out the smallest index at which
  // an object should be inserted so as to maintain order. Uses binary search.
  _.sortedIndex = function(array, obj, iteratee, context) {
    iteratee = cb(iteratee, context, 1);
    var value = iteratee(obj);
    var low = 0, high = array.length;
    while (low < high) {
      var mid = Math.floor((low + high) / 2);
      if (iteratee(array[mid]) < value) low = mid + 1; else high = mid;
    }
    return low;
  };

  // Generate an integer Array containing an arithmetic progression. A port of
  // the native Python `range()` function. See
  // [the Python documentation](http://docs.python.org/library/functions.html#range).
  _.range = function(start, stop, step) {
    if (arguments.length <= 1) {
      stop = start || 0;
      start = 0;
    }
    step = step || 1;

    var length = Math.max(Math.ceil((stop - start) / step), 0);
    var range = Array(length);

    for (var idx = 0; idx < length; idx++, start += step) {
      range[idx] = start;
    }

    return range;
  };

  // Function (ahem) Functions
  // ------------------

  // Determines whether to execute a function as a constructor
  // or a normal function with the provided arguments
  var executeBound = function(sourceFunc, boundFunc, context, callingContext, args) {
    if (!(callingContext instanceof boundFunc)) return sourceFunc.apply(context, args);
    var self = baseCreate(sourceFunc.prototype);
    var result = sourceFunc.apply(self, args);
    if (_.isObject(result)) return result;
    return self;
  };

  // Create a function bound to a given object (assigning `this`, and arguments,
  // optionally). Delegates to **ECMAScript 5**'s native `Function.bind` if
  // available.
  _.bind = function(func, context) {
    if (nativeBind && func.bind === nativeBind) return nativeBind.apply(func, slice.call(arguments, 1));
    if (!_.isFunction(func)) throw new TypeError('Bind must be called on a function');
    var args = slice.call(arguments, 2);
    var bound = function() {
      return executeBound(func, bound, context, this, args.concat(slice.call(arguments)));
    };
    return bound;
  };

  // Partially apply a function by creating a version that has had some of its
  // arguments pre-filled, without changing its dynamic `this` context. _ acts
  // as a placeholder, allowing any combination of arguments to be pre-filled.
  _.partial = function(func) {
    var boundArgs = slice.call(arguments, 1);
    var bound = function() {
      var position = 0, length = boundArgs.length;
      var args = Array(length);
      for (var i = 0; i < length; i++) {
        args[i] = boundArgs[i] === _ ? arguments[position++] : boundArgs[i];
      }
      while (position < arguments.length) args.push(arguments[position++]);
      return executeBound(func, bound, this, this, args);
    };
    return bound;
  };

  // Bind a number of an object's methods to that object. Remaining arguments
  // are the method names to be bound. Useful for ensuring that all callbacks
  // defined on an object belong to it.
  _.bindAll = function(obj) {
    var i, length = arguments.length, key;
    if (length <= 1) throw new Error('bindAll must be passed function names');
    for (i = 1; i < length; i++) {
      key = arguments[i];
      obj[key] = _.bind(obj[key], obj);
    }
    return obj;
  };

  // Memoize an expensive function by storing its results.
  _.memoize = function(func, hasher) {
    var memoize = function(key) {
      var cache = memoize.cache;
      var address = '' + (hasher ? hasher.apply(this, arguments) : key);
      if (!_.has(cache, address)) cache[address] = func.apply(this, arguments);
      return cache[address];
    };
    memoize.cache = {};
    return memoize;
  };

  // Delays a function for the given number of milliseconds, and then calls
  // it with the arguments supplied.
  _.delay = function(func, wait) {
    var args = slice.call(arguments, 2);
    return setTimeout(function(){
      return func.apply(null, args);
    }, wait);
  };

  // Defers a function, scheduling it to run after the current call stack has
  // cleared.
  _.defer = _.partial(_.delay, _, 1);

  // Returns a function, that, when invoked, will only be triggered at most once
  // during a given window of time. Normally, the throttled function will run
  // as much as it can, without ever going more than once per `wait` duration;
  // but if you'd like to disable the execution on the leading edge, pass
  // `{leading: false}`. To disable execution on the trailing edge, ditto.
  _.throttle = function(func, wait, options) {
    var context, args, result;
    var timeout = null;
    var previous = 0;
    if (!options) options = {};
    var later = function() {
      previous = options.leading === false ? 0 : _.now();
      timeout = null;
      result = func.apply(context, args);
      if (!timeout) context = args = null;
    };
    return function() {
      var now = _.now();
      if (!previous && options.leading === false) previous = now;
      var remaining = wait - (now - previous);
      context = this;
      args = arguments;
      if (remaining <= 0 || remaining > wait) {
        if (timeout) {
          clearTimeout(timeout);
          timeout = null;
        }
        previous = now;
        result = func.apply(context, args);
        if (!timeout) context = args = null;
      } else if (!timeout && options.trailing !== false) {
        timeout = setTimeout(later, remaining);
      }
      return result;
    };
  };

  // Returns a function, that, as long as it continues to be invoked, will not
  // be triggered. The function will be called after it stops being called for
  // N milliseconds. If `immediate` is passed, trigger the function on the
  // leading edge, instead of the trailing.
  _.debounce = function(func, wait, immediate) {
    var timeout, args, context, timestamp, result;

    var later = function() {
      var last = _.now() - timestamp;

      if (last < wait && last >= 0) {
        timeout = setTimeout(later, wait - last);
      } else {
        timeout = null;
        if (!immediate) {
          result = func.apply(context, args);
          if (!timeout) context = args = null;
        }
      }
    };

    return function() {
      context = this;
      args = arguments;
      timestamp = _.now();
      var callNow = immediate && !timeout;
      if (!timeout) timeout = setTimeout(later, wait);
      if (callNow) {
        result = func.apply(context, args);
        context = args = null;
      }

      return result;
    };
  };

  // Returns the first function passed as an argument to the second,
  // allowing you to adjust arguments, run code before and after, and
  // conditionally execute the original function.
  _.wrap = function(func, wrapper) {
    return _.partial(wrapper, func);
  };

  // Returns a negated version of the passed-in predicate.
  _.negate = function(predicate) {
    return function() {
      return !predicate.apply(this, arguments);
    };
  };

  // Returns a function that is the composition of a list of functions, each
  // consuming the return value of the function that follows.
  _.compose = function() {
    var args = arguments;
    var start = args.length - 1;
    return function() {
      var i = start;
      var result = args[start].apply(this, arguments);
      while (i--) result = args[i].call(this, result);
      return result;
    };
  };

  // Returns a function that will only be executed on and after the Nth call.
  _.after = function(times, func) {
    return function() {
      if (--times < 1) {
        return func.apply(this, arguments);
      }
    };
  };

  // Returns a function that will only be executed up to (but not including) the Nth call.
  _.before = function(times, func) {
    var memo;
    return function() {
      if (--times > 0) {
        memo = func.apply(this, arguments);
      }
      if (times <= 1) func = null;
      return memo;
    };
  };

  // Returns a function that will be executed at most one time, no matter how
  // often you call it. Useful for lazy initialization.
  _.once = _.partial(_.before, 2);

  // Object Functions
  // ----------------

  // Keys in IE < 9 that won't be iterated by `for key in ...` and thus missed.
  var hasEnumBug = !{toString: null}.propertyIsEnumerable('toString');
  var nonEnumerableProps = ['valueOf', 'isPrototypeOf', 'toString',
                      'propertyIsEnumerable', 'hasOwnProperty', 'toLocaleString'];

  function collectNonEnumProps(obj, keys) {
    var nonEnumIdx = nonEnumerableProps.length;
    var constructor = obj.constructor;
    var proto = (_.isFunction(constructor) && constructor.prototype) || ObjProto;

    // Constructor is a special case.
    var prop = 'constructor';
    if (_.has(obj, prop) && !_.contains(keys, prop)) keys.push(prop);

    while (nonEnumIdx--) {
      prop = nonEnumerableProps[nonEnumIdx];
      if (prop in obj && obj[prop] !== proto[prop] && !_.contains(keys, prop)) {
        keys.push(prop);
      }
    }
  }

  // Retrieve the names of an object's own properties.
  // Delegates to **ECMAScript 5**'s native `Object.keys`
  _.keys = function(obj) {
    if (!_.isObject(obj)) return [];
    if (nativeKeys) return nativeKeys(obj);
    var keys = [];
    for (var key in obj) if (_.has(obj, key)) keys.push(key);
    // Ahem, IE < 9.
    if (hasEnumBug) collectNonEnumProps(obj, keys);
    return keys;
  };

  // Retrieve all the property names of an object.
  _.allKeys = function(obj) {
    if (!_.isObject(obj)) return [];
    var keys = [];
    for (var key in obj) keys.push(key);
    // Ahem, IE < 9.
    if (hasEnumBug) collectNonEnumProps(obj, keys);
    return keys;
  };

  // Retrieve the values of an object's properties.
  _.values = function(obj) {
    var keys = _.keys(obj);
    var length = keys.length;
    var values = Array(length);
    for (var i = 0; i < length; i++) {
      values[i] = obj[keys[i]];
    }
    return values;
  };

  // Returns the results of applying the iteratee to each element of the object
  // In contrast to _.map it returns an object
  _.mapObject = function(obj, iteratee, context) {
    iteratee = cb(iteratee, context);
    var keys =  _.keys(obj),
          length = keys.length,
          results = {},
          currentKey;
      for (var index = 0; index < length; index++) {
        currentKey = keys[index];
        results[currentKey] = iteratee(obj[currentKey], currentKey, obj);
      }
      return results;
  };

  // Convert an object into a list of `[key, value]` pairs.
  _.pairs = function(obj) {
    var keys = _.keys(obj);
    var length = keys.length;
    var pairs = Array(length);
    for (var i = 0; i < length; i++) {
      pairs[i] = [keys[i], obj[keys[i]]];
    }
    return pairs;
  };

  // Invert the keys and values of an object. The values must be serializable.
  _.invert = function(obj) {
    var result = {};
    var keys = _.keys(obj);
    for (var i = 0, length = keys.length; i < length; i++) {
      result[obj[keys[i]]] = keys[i];
    }
    return result;
  };

  // Return a sorted list of the function names available on the object.
  // Aliased as `methods`
  _.functions = _.methods = function(obj) {
    var names = [];
    for (var key in obj) {
      if (_.isFunction(obj[key])) names.push(key);
    }
    return names.sort();
  };

  // Extend a given object with all the properties in passed-in object(s).
  _.extend = createAssigner(_.allKeys);

  // Assigns a given object with all the own properties in the passed-in object(s)
  // (https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object/assign)
  _.extendOwn = _.assign = createAssigner(_.keys);

  // Returns the first key on an object that passes a predicate test
  _.findKey = function(obj, predicate, context) {
    predicate = cb(predicate, context);
    var keys = _.keys(obj), key;
    for (var i = 0, length = keys.length; i < length; i++) {
      key = keys[i];
      if (predicate(obj[key], key, obj)) return key;
    }
  };

  // Return a copy of the object only containing the whitelisted properties.
  _.pick = function(object, oiteratee, context) {
    var result = {}, obj = object, iteratee, keys;
    if (obj == null) return result;
    if (_.isFunction(oiteratee)) {
      keys = _.allKeys(obj);
      iteratee = optimizeCb(oiteratee, context);
    } else {
      keys = flatten(arguments, false, false, 1);
      iteratee = function(value, key, obj) { return key in obj; };
      obj = Object(obj);
    }
    for (var i = 0, length = keys.length; i < length; i++) {
      var key = keys[i];
      var value = obj[key];
      if (iteratee(value, key, obj)) result[key] = value;
    }
    return result;
  };

   // Return a copy of the object without the blacklisted properties.
  _.omit = function(obj, iteratee, context) {
    if (_.isFunction(iteratee)) {
      iteratee = _.negate(iteratee);
    } else {
      var keys = _.map(flatten(arguments, false, false, 1), String);
      iteratee = function(value, key) {
        return !_.contains(keys, key);
      };
    }
    return _.pick(obj, iteratee, context);
  };

  // Fill in a given object with default properties.
  _.defaults = createAssigner(_.allKeys, true);

  // Create a (shallow-cloned) duplicate of an object.
  _.clone = function(obj) {
    if (!_.isObject(obj)) return obj;
    return _.isArray(obj) ? obj.slice() : _.extend({}, obj);
  };

  // Invokes interceptor with the obj, and then returns obj.
  // The primary purpose of this method is to "tap into" a method chain, in
  // order to perform operations on intermediate results within the chain.
  _.tap = function(obj, interceptor) {
    interceptor(obj);
    return obj;
  };

  // Returns whether an object has a given set of `key:value` pairs.
  _.isMatch = function(object, attrs) {
    var keys = _.keys(attrs), length = keys.length;
    if (object == null) return !length;
    var obj = Object(object);
    for (var i = 0; i < length; i++) {
      var key = keys[i];
      if (attrs[key] !== obj[key] || !(key in obj)) return false;
    }
    return true;
  };


  // Internal recursive comparison function for `isEqual`.
  var eq = function(a, b, aStack, bStack) {
    // Identical objects are equal. `0 === -0`, but they aren't identical.
    // See the [Harmony `egal` proposal](http://wiki.ecmascript.org/doku.php?id=harmony:egal).
    if (a === b) return a !== 0 || 1 / a === 1 / b;
    // A strict comparison is necessary because `null == undefined`.
    if (a == null || b == null) return a === b;
    // Unwrap any wrapped objects.
    if (a instanceof _) a = a._wrapped;
    if (b instanceof _) b = b._wrapped;
    // Compare `[[Class]]` names.
    var className = toString.call(a);
    if (className !== toString.call(b)) return false;
    switch (className) {
      // Strings, numbers, regular expressions, dates, and booleans are compared by value.
      case '[object RegExp]':
      // RegExps are coerced to strings for comparison (Note: '' + /a/i === '/a/i')
      case '[object String]':
        // Primitives and their corresponding object wrappers are equivalent; thus, `"5"` is
        // equivalent to `new String("5")`.
        return '' + a === '' + b;
      case '[object Number]':
        // `NaN`s are equivalent, but non-reflexive.
        // Object(NaN) is equivalent to NaN
        if (+a !== +a) return +b !== +b;
        // An `egal` comparison is performed for other numeric values.
        return +a === 0 ? 1 / +a === 1 / b : +a === +b;
      case '[object Date]':
      case '[object Boolean]':
        // Coerce dates and booleans to numeric primitive values. Dates are compared by their
        // millisecond representations. Note that invalid dates with millisecond representations
        // of `NaN` are not equivalent.
        return +a === +b;
    }

    var areArrays = className === '[object Array]';
    if (!areArrays) {
      if (typeof a != 'object' || typeof b != 'object') return false;

      // Objects with different constructors are not equivalent, but `Object`s or `Array`s
      // from different frames are.
      var aCtor = a.constructor, bCtor = b.constructor;
      if (aCtor !== bCtor && !(_.isFunction(aCtor) && aCtor instanceof aCtor &&
                               _.isFunction(bCtor) && bCtor instanceof bCtor)
                          && ('constructor' in a && 'constructor' in b)) {
        return false;
      }
    }
    // Assume equality for cyclic structures. The algorithm for detecting cyclic
    // structures is adapted from ES 5.1 section 15.12.3, abstract operation `JO`.
    
    // Initializing stack of traversed objects.
    // It's done here since we only need them for objects and arrays comparison.
    aStack = aStack || [];
    bStack = bStack || [];
    var length = aStack.length;
    while (length--) {
      // Linear search. Performance is inversely proportional to the number of
      // unique nested structures.
      if (aStack[length] === a) return bStack[length] === b;
    }

    // Add the first object to the stack of traversed objects.
    aStack.push(a);
    bStack.push(b);

    // Recursively compare objects and arrays.
    if (areArrays) {
      // Compare array lengths to determine if a deep comparison is necessary.
      length = a.length;
      if (length !== b.length) return false;
      // Deep compare the contents, ignoring non-numeric properties.
      while (length--) {
        if (!eq(a[length], b[length], aStack, bStack)) return false;
      }
    } else {
      // Deep compare objects.
      var keys = _.keys(a), key;
      length = keys.length;
      // Ensure that both objects contain the same number of properties before comparing deep equality.
      if (_.keys(b).length !== length) return false;
      while (length--) {
        // Deep compare each member
        key = keys[length];
        if (!(_.has(b, key) && eq(a[key], b[key], aStack, bStack))) return false;
      }
    }
    // Remove the first object from the stack of traversed objects.
    aStack.pop();
    bStack.pop();
    return true;
  };

  // Perform a deep comparison to check if two objects are equal.
  _.isEqual = function(a, b) {
    return eq(a, b);
  };

  // Is a given array, string, or object empty?
  // An "empty" object has no enumerable own-properties.
  _.isEmpty = function(obj) {
    if (obj == null) return true;
    if (isArrayLike(obj) && (_.isArray(obj) || _.isString(obj) || _.isArguments(obj))) return obj.length === 0;
    return _.keys(obj).length === 0;
  };

  // Is a given value a DOM element?
  _.isElement = function(obj) {
    return !!(obj && obj.nodeType === 1);
  };

  // Is a given value an array?
  // Delegates to ECMA5's native Array.isArray
  _.isArray = nativeIsArray || function(obj) {
    return toString.call(obj) === '[object Array]';
  };

  // Is a given variable an object?
  _.isObject = function(obj) {
    var type = typeof obj;
    return type === 'function' || type === 'object' && !!obj;
  };

  // Add some isType methods: isArguments, isFunction, isString, isNumber, isDate, isRegExp, isError.
  _.each(['Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp', 'Error'], function(name) {
    _['is' + name] = function(obj) {
      return toString.call(obj) === '[object ' + name + ']';
    };
  });

  // Define a fallback version of the method in browsers (ahem, IE < 9), where
  // there isn't any inspectable "Arguments" type.
  if (!_.isArguments(arguments)) {
    _.isArguments = function(obj) {
      return _.has(obj, 'callee');
    };
  }

  // Optimize `isFunction` if appropriate. Work around some typeof bugs in old v8,
  // IE 11 (#1621), and in Safari 8 (#1929).
  if (typeof /./ != 'function' && typeof Int8Array != 'object') {
    _.isFunction = function(obj) {
      return typeof obj == 'function' || false;
    };
  }

  // Is a given object a finite number?
  _.isFinite = function(obj) {
    return isFinite(obj) && !isNaN(parseFloat(obj));
  };

  // Is the given value `NaN`? (NaN is the only number which does not equal itself).
  _.isNaN = function(obj) {
    return _.isNumber(obj) && obj !== +obj;
  };

  // Is a given value a boolean?
  _.isBoolean = function(obj) {
    return obj === true || obj === false || toString.call(obj) === '[object Boolean]';
  };

  // Is a given value equal to null?
  _.isNull = function(obj) {
    return obj === null;
  };

  // Is a given variable undefined?
  _.isUndefined = function(obj) {
    return obj === void 0;
  };

  // Shortcut function for checking if an object has a given property directly
  // on itself (in other words, not on a prototype).
  _.has = function(obj, key) {
    return obj != null && hasOwnProperty.call(obj, key);
  };

  // Utility Functions
  // -----------------

  // Run Underscore.js in *noConflict* mode, returning the `_` variable to its
  // previous owner. Returns a reference to the Underscore object.
  _.noConflict = function() {
    root._ = previousUnderscore;
    return this;
  };

  // Keep the identity function around for default iteratees.
  _.identity = function(value) {
    return value;
  };

  // Predicate-generating functions. Often useful outside of Underscore.
  _.constant = function(value) {
    return function() {
      return value;
    };
  };

  _.noop = function(){};

  _.property = function(key) {
    return function(obj) {
      return obj == null ? void 0 : obj[key];
    };
  };

  // Generates a function for a given object that returns a given property.
  _.propertyOf = function(obj) {
    return obj == null ? function(){} : function(key) {
      return obj[key];
    };
  };

  // Returns a predicate for checking whether an object has a given set of 
  // `key:value` pairs.
  _.matcher = _.matches = function(attrs) {
    attrs = _.extendOwn({}, attrs);
    return function(obj) {
      return _.isMatch(obj, attrs);
    };
  };

  // Run a function **n** times.
  _.times = function(n, iteratee, context) {
    var accum = Array(Math.max(0, n));
    iteratee = optimizeCb(iteratee, context, 1);
    for (var i = 0; i < n; i++) accum[i] = iteratee(i);
    return accum;
  };

  // Return a random integer between min and max (inclusive).
  _.random = function(min, max) {
    if (max == null) {
      max = min;
      min = 0;
    }
    return min + Math.floor(Math.random() * (max - min + 1));
  };

  // A (possibly faster) way to get the current timestamp as an integer.
  _.now = Date.now || function() {
    return new Date().getTime();
  };

   // List of HTML entities for escaping.
  var escapeMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '`': '&#x60;'
  };
  var unescapeMap = _.invert(escapeMap);

  // Functions for escaping and unescaping strings to/from HTML interpolation.
  var createEscaper = function(map) {
    var escaper = function(match) {
      return map[match];
    };
    // Regexes for identifying a key that needs to be escaped
    var source = '(?:' + _.keys(map).join('|') + ')';
    var testRegexp = RegExp(source);
    var replaceRegexp = RegExp(source, 'g');
    return function(string) {
      string = string == null ? '' : '' + string;
      return testRegexp.test(string) ? string.replace(replaceRegexp, escaper) : string;
    };
  };
  _.escape = createEscaper(escapeMap);
  _.unescape = createEscaper(unescapeMap);

  // If the value of the named `property` is a function then invoke it with the
  // `object` as context; otherwise, return it.
  _.result = function(object, property, fallback) {
    var value = object == null ? void 0 : object[property];
    if (value === void 0) {
      value = fallback;
    }
    return _.isFunction(value) ? value.call(object) : value;
  };

  // Generate a unique integer id (unique within the entire client session).
  // Useful for temporary DOM ids.
  var idCounter = 0;
  _.uniqueId = function(prefix) {
    var id = ++idCounter + '';
    return prefix ? prefix + id : id;
  };

  // By default, Underscore uses ERB-style template delimiters, change the
  // following template settings to use alternative delimiters.
  _.templateSettings = {
    evaluate    : /<%([\s\S]+?)%>/g,
    interpolate : /<%=([\s\S]+?)%>/g,
    escape      : /<%-([\s\S]+?)%>/g
  };

  // When customizing `templateSettings`, if you don't want to define an
  // interpolation, evaluation or escaping regex, we need one that is
  // guaranteed not to match.
  var noMatch = /(.)^/;

  // Certain characters need to be escaped so that they can be put into a
  // string literal.
  var escapes = {
    "'":      "'",
    '\\':     '\\',
    '\r':     'r',
    '\n':     'n',
    '\u2028': 'u2028',
    '\u2029': 'u2029'
  };

  var escaper = /\\|'|\r|\n|\u2028|\u2029/g;

  var escapeChar = function(match) {
    return '\\' + escapes[match];
  };

  // JavaScript micro-templating, similar to John Resig's implementation.
  // Underscore templating handles arbitrary delimiters, preserves whitespace,
  // and correctly escapes quotes within interpolated code.
  // NB: `oldSettings` only exists for backwards compatibility.
  _.template = function(text, settings, oldSettings) {
    if (!settings && oldSettings) settings = oldSettings;
    settings = _.defaults({}, settings, _.templateSettings);

    // Combine delimiters into one regular expression via alternation.
    var matcher = RegExp([
      (settings.escape || noMatch).source,
      (settings.interpolate || noMatch).source,
      (settings.evaluate || noMatch).source
    ].join('|') + '|$', 'g');

    // Compile the template source, escaping string literals appropriately.
    var index = 0;
    var source = "__p+='";
    text.replace(matcher, function(match, escape, interpolate, evaluate, offset) {
      source += text.slice(index, offset).replace(escaper, escapeChar);
      index = offset + match.length;

      if (escape) {
        source += "'+\n((__t=(" + escape + "))==null?'':_.escape(__t))+\n'";
      } else if (interpolate) {
        source += "'+\n((__t=(" + interpolate + "))==null?'':__t)+\n'";
      } else if (evaluate) {
        source += "';\n" + evaluate + "\n__p+='";
      }

      // Adobe VMs need the match returned to produce the correct offest.
      return match;
    });
    source += "';\n";

    // If a variable is not specified, place data values in local scope.
    if (!settings.variable) source = 'with(obj||{}){\n' + source + '}\n';

    source = "var __t,__p='',__j=Array.prototype.join," +
      "print=function(){__p+=__j.call(arguments,'');};\n" +
      source + 'return __p;\n';

    try {
      var render = new Function(settings.variable || 'obj', '_', source);
    } catch (e) {
      e.source = source;
      throw e;
    }

    var template = function(data) {
      return render.call(this, data, _);
    };

    // Provide the compiled source as a convenience for precompilation.
    var argument = settings.variable || 'obj';
    template.source = 'function(' + argument + '){\n' + source + '}';

    return template;
  };

  // Add a "chain" function. Start chaining a wrapped Underscore object.
  _.chain = function(obj) {
    var instance = _(obj);
    instance._chain = true;
    return instance;
  };

  // OOP
  // ---------------
  // If Underscore is called as a function, it returns a wrapped object that
  // can be used OO-style. This wrapper holds altered versions of all the
  // underscore functions. Wrapped objects may be chained.

  // Helper function to continue chaining intermediate results.
  var result = function(instance, obj) {
    return instance._chain ? _(obj).chain() : obj;
  };

  // Add your own custom functions to the Underscore object.
  _.mixin = function(obj) {
    _.each(_.functions(obj), function(name) {
      var func = _[name] = obj[name];
      _.prototype[name] = function() {
        var args = [this._wrapped];
        push.apply(args, arguments);
        return result(this, func.apply(_, args));
      };
    });
  };

  // Add all of the Underscore functions to the wrapper object.
  _.mixin(_);

  // Add all mutator Array functions to the wrapper.
  _.each(['pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift'], function(name) {
    var method = ArrayProto[name];
    _.prototype[name] = function() {
      var obj = this._wrapped;
      method.apply(obj, arguments);
      if ((name === 'shift' || name === 'splice') && obj.length === 0) delete obj[0];
      return result(this, obj);
    };
  });

  // Add all accessor Array functions to the wrapper.
  _.each(['concat', 'join', 'slice'], function(name) {
    var method = ArrayProto[name];
    _.prototype[name] = function() {
      return result(this, method.apply(this._wrapped, arguments));
    };
  });

  // Extracts the result from a wrapped and chained object.
  _.prototype.value = function() {
    return this._wrapped;
  };

  // Provide unwrapping proxy for some methods used in engine operations
  // such as arithmetic and JSON stringification.
  _.prototype.valueOf = _.prototype.toJSON = _.prototype.value;
  
  _.prototype.toString = function() {
    return '' + this._wrapped;
  };

  // AMD registration happens at the end for compatibility with AMD loaders
  // that may not enforce next-turn semantics on modules. Even though general
  // practice for AMD registration is to be anonymous, underscore registers
  // as a named module because, like jQuery, it is a base library that is
  // popular enough to be bundled in a third party lib, but not be part of
  // an AMD load request. Those cases could generate an error when an
  // anonymous define() is called outside of a loader request.
  if (typeof define === 'function' && define.amd) {
    define('underscore', [], function() {
      return _;
    });
  }
}.call(this));

},{}],"/home/travis/build/lefant/ng-flickrdupfinder/src/javascript/config.js":[function(require,module,exports){
'use strict';

module.exports = angular.module('flickrDupFinderConfig', [])
  .constant('OAUTHD_URL', 'https://oauthd-lefant.herokuapp.com')
  .constant('APP_PUBLIC_KEY', 'QqSxC9FpX5QsfRhGPpf68w2gLRE') //oauthd-lefant
  //.constant('OAUTHD_URL', 'http://oauth.io')
  //.constant('APP_PUBLIC_KEY', 'cF4gOblEUpueTtsL44-gVjZeeXM') //oauth.io

},{}],"/home/travis/build/lefant/ng-flickrdupfinder/src/javascript/controllers.js":[function(require,module,exports){
'use strict';

require('./../../bower_components/ui.bootstrap/src/pagination/pagination');

module.exports = angular.module(
  'flickrDupFinderControllers',
  ['ui.bootstrap.pagination',
   require('./config').name,
   require('./services').name])
  .controller(
    'startCtrl',
    ['$http', 'OAUTHD_URL', '$log', function($http, OAUTHD_URL, $log) {
      $http.get(OAUTHD_URL + '/auth/flickr').success(function(success) {
        $log.debug("oauthd ping successful:", success);
      });
    }])
  .controller(
    'photoCtrl',
    ['$scope', '$log', 'Flickr', function($scope, $log, Flickr) {
      var _ = require("./../../bower_components/underscore/underscore.js");
      var specialTag = 'flickrdupfinder';
      $scope.itemsPerPage = 16;
      $scope.maxSize = 10;

      $scope.toggleTag = function(photo) {
        if (photo.duplicate) {
          removeTag(photo);
        } else {
          addTag(photo);
        }
      };

      function addTag(photo) {
        photo.inFlight = true;
        Flickr.get({
          method: 'flickr.photos.addTags',
          photo_id: photo.id,
          tags: specialTag
        }, function() {
          photo.duplicate = true;
          photo.inFlight = false;
        });
      };

      function removeTag(photo) {
        photo.inFlight = true;
        Flickr.get({
          method: 'flickr.photos.getInfo',
          photo_id: photo.id
        }, function(info) {
          var tag =
            _.find(info.photo.tags.tag, function(tag) {
              return tag.raw === specialTag;
            });
          if (tag) {
            Flickr.get({
              method: 'flickr.photos.removeTag',
              photo_id: photo.id,
              tag_id: tag.id
            }, function() {
              photo.duplicate = false;
              photo.inFlight = false;
            });
          } else {
            photo.inFlight = false;
          }
        });
      };

      $scope.autoTag = function() {
        _.map($scope.visibleGroups, function(group) {
          _.map(_.rest(group), addTag);
        })
      };

      function hasMaxDateTakenGranularity(photo) {
        return true;
        //return photo.datetakengranularity == "0";
      }

      function updateDuplicateState(photo) {
        photo['duplicate'] = _.contains(photo.tags.split(/ /), specialTag);
        return photo;
      }

      function fingerprint(photo) {
        return photo.datetaken + '##' + photo.title.replace(/-[0-9]$/, '');
      }

      function atLeastTwo(group) {
        return group.length > 1;
      }

      function groupDuplicates(photos) {
        var groups = _.groupBy(photos, fingerprint);
        var groups2 = _.filter(groups, atLeastTwo);
        $scope.groups = groups2;
        updateVisibleGroups()
      }

      function getPage(page, photosAcc) {
        $scope.page = page;
        Flickr.get({
          method: "flickr.photos.search",
          page: page,
          per_page: 500,
          sort: 'date-taken-asc'}, function(result) {
            $scope.totalPages = result.photos.pages;
            var resultPhotos = result.photos.photo;
            var filteredResultPhotos =
              _.filter(resultPhotos, hasMaxDateTakenGranularity);
            var updatedResultPhotos =
              _.map(filteredResultPhotos, updateDuplicateState);
            var photosAcc2 = photosAcc.concat(updatedResultPhotos);
            if (page < result.photos.pages) {
              getPage(page + 1, photosAcc2);
            } else {
              $scope.initialDownload = false;
            }
            groupDuplicates(photosAcc2);
          });
      }

      function updateVisibleGroups() {
        $scope.totalItems = _.size($scope.groups);
        var first = (($scope.currentPage - 1) * $scope.itemsPerPage);
        var last = $scope.currentPage * $scope.itemsPerPage;
        $scope.visibleGroups =
          _.pick($scope.groups, _.keys($scope.groups).slice(first, last));
      }

      $scope.pageChanged = function() {
        updateVisibleGroups()
      };

      $scope.totalItems = 0;
      $scope.currentPage = 1;
      $scope.initialDownload = true;
      getPage(1, []);
    }]);

},{"./../../bower_components/ui.bootstrap/src/pagination/pagination":"/home/travis/build/lefant/ng-flickrdupfinder/bower_components/ui.bootstrap/src/pagination/pagination.js","./../../bower_components/underscore/underscore.js":"/home/travis/build/lefant/ng-flickrdupfinder/bower_components/underscore/underscore.js","./config":"/home/travis/build/lefant/ng-flickrdupfinder/src/javascript/config.js","./services":"/home/travis/build/lefant/ng-flickrdupfinder/src/javascript/services.js"}],"/home/travis/build/lefant/ng-flickrdupfinder/src/javascript/oauth-shim.js":[function(require,module,exports){
'use strict';

module.exports = angular.module('OAuth', [])
  .factory('OAuth', ['$window', '$log', function($window, $log) {
  require("./../../bower_components/oauth-js/dist/oauth.min.js");
  return $window.OAuth;
}]);

},{"./../../bower_components/oauth-js/dist/oauth.min.js":"/home/travis/build/lefant/ng-flickrdupfinder/bower_components/oauth-js/dist/oauth.min.js"}],"/home/travis/build/lefant/ng-flickrdupfinder/src/javascript/services.js":[function(require,module,exports){
'use strict';

require("./../../bower_components/angular-resource/angular-resource.js");

module.exports = angular.module(
  'flickrDupFinderServices',
  ['ngResource', require('./config').name, require('./oauth-shim').name])
  .service(
    'Flickr',
    ['$log', '$resource', '$http', '$q', '$location', 'OAuth', 'OAUTHD_URL', 'APP_PUBLIC_KEY',
     function(
       $log, $resource, $http, $q, $location, OAuth, OAUTHD_URL, APP_PUBLIC_KEY) {
       if ($location.hash() === '') { $location.path('/photos'); } //so redirect to absUrl() works
       OAuth.initialize(APP_PUBLIC_KEY, {cache: true});
       OAuth.setOAuthdURL(OAUTHD_URL);
       var resource = $q.defer();
       function doneHandler(result) {
         var key = APP_PUBLIC_KEY;
         var oauthio = 'k=' + key;
         oauthio += '&oauthv=1';
         function kv_result(key) {
           return '&'+key+'='+encodeURIComponent(result[key]);
         }
         oauthio += kv_result('oauth_token');
         oauthio += kv_result('oauth_token_secret');
         oauthio += kv_result('code');
         $http.defaults.headers.common = {oauthio: oauthio};
         resource.resolve(
           $resource(
             OAUTHD_URL + '/request/flickr/services/rest/',
             {
               method: "flickr.photos.search",
               format: "json",
               user_id: "me",
               per_page: 10,
               sort: 'date-taken-asc',
               //text: "vision:outdoor",
               //tags: "vision:outdoor,vision:outdoor=099",
               //machine_tags: "outdoor",
               extras: "date_upload,date_taken,tags",
               nojsoncallback: 1
             }));
       }

       var oauthCallback = OAuth.callback('flickr');
       if (oauthCallback) {
         oauthCallback.done(doneHandler).fail(function(callbackError) {
           $log.debug('OAuth.callback error: ', callbackError);
         });
       } else {
         // the callback url must be routed through .otherwise in the app router
         OAuth.redirect('flickr', $location.absUrl());
       }
       return resource.promise;
     }]);

},{"./../../bower_components/angular-resource/angular-resource.js":"/home/travis/build/lefant/ng-flickrdupfinder/bower_components/angular-resource/angular-resource.js","./config":"/home/travis/build/lefant/ng-flickrdupfinder/src/javascript/config.js","./oauth-shim":"/home/travis/build/lefant/ng-flickrdupfinder/src/javascript/oauth-shim.js"}]},{},["./src/javascript/app.js"])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvamF2YXNjcmlwdC9hcHAuanMiLCJib3dlcl9jb21wb25lbnRzL2FuZ3VsYXItcmVzb3VyY2UvYW5ndWxhci1yZXNvdXJjZS5qcyIsImJvd2VyX2NvbXBvbmVudHMvYW5ndWxhci1yb3V0ZS9hbmd1bGFyLXJvdXRlLmpzIiwiYm93ZXJfY29tcG9uZW50cy9vYXV0aC1qcy9kaXN0L29hdXRoLm1pbi5qcyIsImJvd2VyX2NvbXBvbmVudHMvdWkuYm9vdHN0cmFwL3NyYy9wYWdpbmF0aW9uL3BhZ2luYXRpb24uanMiLCJib3dlcl9jb21wb25lbnRzL3VuZGVyc2NvcmUvdW5kZXJzY29yZS5qcyIsInNyYy9qYXZhc2NyaXB0L2NvbmZpZy5qcyIsInNyYy9qYXZhc2NyaXB0L2NvbnRyb2xsZXJzLmpzIiwic3JjL2phdmFzY3JpcHQvb2F1dGgtc2hpbS5qcyIsInNyYy9qYXZhc2NyaXB0L3NlcnZpY2VzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNXBCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNzlCQTtBQUNBO0FBQ0E7O0FDRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0TkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaGdEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1SUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIid1c2Ugc3RyaWN0JztcblxucmVxdWlyZShcIi4vLi4vLi4vYm93ZXJfY29tcG9uZW50cy9hbmd1bGFyLXJvdXRlL2FuZ3VsYXItcm91dGUuanNcIik7XG5cbmFuZ3VsYXIubW9kdWxlKCdmbGlja3JEdXBGaW5kZXInLCBbJ25nUm91dGUnLCByZXF1aXJlKCcuL2NvbnRyb2xsZXJzJykubmFtZV0pXG4gIC5jb25maWcoXG4gICAgWyckbG9jYXRpb25Qcm92aWRlcicsICckcm91dGVQcm92aWRlcicsXG4gICAgIGZ1bmN0aW9uKCRsb2NhdGlvblByb3ZpZGVyLCAkcm91dGVQcm92aWRlcikge1xuICAgICAgIC8vcHJvYmFibHkgYnJlYWtzIHRoaW5ncyBkdWUgdG8gb2F1dGggcmVkaXJlY3QgbGFuZGluZyBwYWdlIGhhY2sgYmVsb3dcbiAgICAgICAvLyRsb2NhdGlvblByb3ZpZGVyLmh0bWw1TW9kZSh0cnVlKTtcblxuICAgICAgIC8vIHRoZSBvYXV0aCByZWRpcmVjdCBjYWxsYmFjayBwYWdlIG11c3QgYmUgbWF0Y2hlZCB3aXRoIC5vdGhlcndpc2VcbiAgICAgICAkcm91dGVQcm92aWRlclxuICAgICAgICAgLndoZW4oJy8nLCB7XG4gICAgICAgICAgIHRlbXBsYXRlVXJsOiAncGFydGlhbHMvc3RhcnQuaHRtbCcsXG4gICAgICAgICAgIGNvbnRyb2xsZXI6ICdzdGFydEN0cmwnXG4gICAgICAgICB9KVxuICAgICAgICAgLm90aGVyd2lzZSh7XG4gICAgICAgICAgIHRlbXBsYXRlVXJsOiAncGFydGlhbHMvcGhvdG9zLmh0bWwnLFxuICAgICAgICAgICBjb250cm9sbGVyOiAncGhvdG9DdHJsJyxcbiAgICAgICAgICAgcmVzb2x2ZTogeyAnRmxpY2tyJzogJ0ZsaWNrcicgfVxuICAgICAgICAgfSk7XG4gICAgIH1dKTtcbiIsIi8qKlxuICogQGxpY2Vuc2UgQW5ndWxhckpTIHYxLjMuMTRcbiAqIChjKSAyMDEwLTIwMTQgR29vZ2xlLCBJbmMuIGh0dHA6Ly9hbmd1bGFyanMub3JnXG4gKiBMaWNlbnNlOiBNSVRcbiAqL1xuKGZ1bmN0aW9uKHdpbmRvdywgYW5ndWxhciwgdW5kZWZpbmVkKSB7J3VzZSBzdHJpY3QnO1xuXG52YXIgJHJlc291cmNlTWluRXJyID0gYW5ndWxhci4kJG1pbkVycignJHJlc291cmNlJyk7XG5cbi8vIEhlbHBlciBmdW5jdGlvbnMgYW5kIHJlZ2V4IHRvIGxvb2t1cCBhIGRvdHRlZCBwYXRoIG9uIGFuIG9iamVjdFxuLy8gc3RvcHBpbmcgYXQgdW5kZWZpbmVkL251bGwuICBUaGUgcGF0aCBtdXN0IGJlIGNvbXBvc2VkIG9mIEFTQ0lJXG4vLyBpZGVudGlmaWVycyAoanVzdCBsaWtlICRwYXJzZSlcbnZhciBNRU1CRVJfTkFNRV9SRUdFWCA9IC9eKFxcLlthLXpBLVpfJF1bMC05YS16QS1aXyRdKikrJC87XG5cbmZ1bmN0aW9uIGlzVmFsaWREb3R0ZWRQYXRoKHBhdGgpIHtcbiAgcmV0dXJuIChwYXRoICE9IG51bGwgJiYgcGF0aCAhPT0gJycgJiYgcGF0aCAhPT0gJ2hhc093blByb3BlcnR5JyAmJlxuICAgICAgTUVNQkVSX05BTUVfUkVHRVgudGVzdCgnLicgKyBwYXRoKSk7XG59XG5cbmZ1bmN0aW9uIGxvb2t1cERvdHRlZFBhdGgob2JqLCBwYXRoKSB7XG4gIGlmICghaXNWYWxpZERvdHRlZFBhdGgocGF0aCkpIHtcbiAgICB0aHJvdyAkcmVzb3VyY2VNaW5FcnIoJ2JhZG1lbWJlcicsICdEb3R0ZWQgbWVtYmVyIHBhdGggXCJAezB9XCIgaXMgaW52YWxpZC4nLCBwYXRoKTtcbiAgfVxuICB2YXIga2V5cyA9IHBhdGguc3BsaXQoJy4nKTtcbiAgZm9yICh2YXIgaSA9IDAsIGlpID0ga2V5cy5sZW5ndGg7IGkgPCBpaSAmJiBvYmogIT09IHVuZGVmaW5lZDsgaSsrKSB7XG4gICAgdmFyIGtleSA9IGtleXNbaV07XG4gICAgb2JqID0gKG9iaiAhPT0gbnVsbCkgPyBvYmpba2V5XSA6IHVuZGVmaW5lZDtcbiAgfVxuICByZXR1cm4gb2JqO1xufVxuXG4vKipcbiAqIENyZWF0ZSBhIHNoYWxsb3cgY29weSBvZiBhbiBvYmplY3QgYW5kIGNsZWFyIG90aGVyIGZpZWxkcyBmcm9tIHRoZSBkZXN0aW5hdGlvblxuICovXG5mdW5jdGlvbiBzaGFsbG93Q2xlYXJBbmRDb3B5KHNyYywgZHN0KSB7XG4gIGRzdCA9IGRzdCB8fCB7fTtcblxuICBhbmd1bGFyLmZvckVhY2goZHN0LCBmdW5jdGlvbih2YWx1ZSwga2V5KSB7XG4gICAgZGVsZXRlIGRzdFtrZXldO1xuICB9KTtcblxuICBmb3IgKHZhciBrZXkgaW4gc3JjKSB7XG4gICAgaWYgKHNyYy5oYXNPd25Qcm9wZXJ0eShrZXkpICYmICEoa2V5LmNoYXJBdCgwKSA9PT0gJyQnICYmIGtleS5jaGFyQXQoMSkgPT09ICckJykpIHtcbiAgICAgIGRzdFtrZXldID0gc3JjW2tleV07XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGRzdDtcbn1cblxuLyoqXG4gKiBAbmdkb2MgbW9kdWxlXG4gKiBAbmFtZSBuZ1Jlc291cmNlXG4gKiBAZGVzY3JpcHRpb25cbiAqXG4gKiAjIG5nUmVzb3VyY2VcbiAqXG4gKiBUaGUgYG5nUmVzb3VyY2VgIG1vZHVsZSBwcm92aWRlcyBpbnRlcmFjdGlvbiBzdXBwb3J0IHdpdGggUkVTVGZ1bCBzZXJ2aWNlc1xuICogdmlhIHRoZSAkcmVzb3VyY2Ugc2VydmljZS5cbiAqXG4gKlxuICogPGRpdiBkb2MtbW9kdWxlLWNvbXBvbmVudHM9XCJuZ1Jlc291cmNlXCI+PC9kaXY+XG4gKlxuICogU2VlIHtAbGluayBuZ1Jlc291cmNlLiRyZXNvdXJjZSBgJHJlc291cmNlYH0gZm9yIHVzYWdlLlxuICovXG5cbi8qKlxuICogQG5nZG9jIHNlcnZpY2VcbiAqIEBuYW1lICRyZXNvdXJjZVxuICogQHJlcXVpcmVzICRodHRwXG4gKlxuICogQGRlc2NyaXB0aW9uXG4gKiBBIGZhY3Rvcnkgd2hpY2ggY3JlYXRlcyBhIHJlc291cmNlIG9iamVjdCB0aGF0IGxldHMgeW91IGludGVyYWN0IHdpdGhcbiAqIFtSRVNUZnVsXShodHRwOi8vZW4ud2lraXBlZGlhLm9yZy93aWtpL1JlcHJlc2VudGF0aW9uYWxfU3RhdGVfVHJhbnNmZXIpIHNlcnZlci1zaWRlIGRhdGEgc291cmNlcy5cbiAqXG4gKiBUaGUgcmV0dXJuZWQgcmVzb3VyY2Ugb2JqZWN0IGhhcyBhY3Rpb24gbWV0aG9kcyB3aGljaCBwcm92aWRlIGhpZ2gtbGV2ZWwgYmVoYXZpb3JzIHdpdGhvdXRcbiAqIHRoZSBuZWVkIHRvIGludGVyYWN0IHdpdGggdGhlIGxvdyBsZXZlbCB7QGxpbmsgbmcuJGh0dHAgJGh0dHB9IHNlcnZpY2UuXG4gKlxuICogUmVxdWlyZXMgdGhlIHtAbGluayBuZ1Jlc291cmNlIGBuZ1Jlc291cmNlYH0gbW9kdWxlIHRvIGJlIGluc3RhbGxlZC5cbiAqXG4gKiBCeSBkZWZhdWx0LCB0cmFpbGluZyBzbGFzaGVzIHdpbGwgYmUgc3RyaXBwZWQgZnJvbSB0aGUgY2FsY3VsYXRlZCBVUkxzLFxuICogd2hpY2ggY2FuIHBvc2UgcHJvYmxlbXMgd2l0aCBzZXJ2ZXIgYmFja2VuZHMgdGhhdCBkbyBub3QgZXhwZWN0IHRoYXRcbiAqIGJlaGF2aW9yLiAgVGhpcyBjYW4gYmUgZGlzYWJsZWQgYnkgY29uZmlndXJpbmcgdGhlIGAkcmVzb3VyY2VQcm92aWRlcmAgbGlrZVxuICogdGhpczpcbiAqXG4gKiBgYGBqc1xuICAgICBhcHAuY29uZmlnKFsnJHJlc291cmNlUHJvdmlkZXInLCBmdW5jdGlvbigkcmVzb3VyY2VQcm92aWRlcikge1xuICAgICAgIC8vIERvbid0IHN0cmlwIHRyYWlsaW5nIHNsYXNoZXMgZnJvbSBjYWxjdWxhdGVkIFVSTHNcbiAgICAgICAkcmVzb3VyY2VQcm92aWRlci5kZWZhdWx0cy5zdHJpcFRyYWlsaW5nU2xhc2hlcyA9IGZhbHNlO1xuICAgICB9XSk7XG4gKiBgYGBcbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gdXJsIEEgcGFyYW1ldHJpemVkIFVSTCB0ZW1wbGF0ZSB3aXRoIHBhcmFtZXRlcnMgcHJlZml4ZWQgYnkgYDpgIGFzIGluXG4gKiAgIGAvdXNlci86dXNlcm5hbWVgLiBJZiB5b3UgYXJlIHVzaW5nIGEgVVJMIHdpdGggYSBwb3J0IG51bWJlciAoZS5nLlxuICogICBgaHR0cDovL2V4YW1wbGUuY29tOjgwODAvYXBpYCksIGl0IHdpbGwgYmUgcmVzcGVjdGVkLlxuICpcbiAqICAgSWYgeW91IGFyZSB1c2luZyBhIHVybCB3aXRoIGEgc3VmZml4LCBqdXN0IGFkZCB0aGUgc3VmZml4LCBsaWtlIHRoaXM6XG4gKiAgIGAkcmVzb3VyY2UoJ2h0dHA6Ly9leGFtcGxlLmNvbS9yZXNvdXJjZS5qc29uJylgIG9yIGAkcmVzb3VyY2UoJ2h0dHA6Ly9leGFtcGxlLmNvbS86aWQuanNvbicpYFxuICogICBvciBldmVuIGAkcmVzb3VyY2UoJ2h0dHA6Ly9leGFtcGxlLmNvbS9yZXNvdXJjZS86cmVzb3VyY2VfaWQuOmZvcm1hdCcpYFxuICogICBJZiB0aGUgcGFyYW1ldGVyIGJlZm9yZSB0aGUgc3VmZml4IGlzIGVtcHR5LCA6cmVzb3VyY2VfaWQgaW4gdGhpcyBjYXNlLCB0aGVuIHRoZSBgLy5gIHdpbGwgYmVcbiAqICAgY29sbGFwc2VkIGRvd24gdG8gYSBzaW5nbGUgYC5gLiAgSWYgeW91IG5lZWQgdGhpcyBzZXF1ZW5jZSB0byBhcHBlYXIgYW5kIG5vdCBjb2xsYXBzZSB0aGVuIHlvdVxuICogICBjYW4gZXNjYXBlIGl0IHdpdGggYC9cXC5gLlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0PX0gcGFyYW1EZWZhdWx0cyBEZWZhdWx0IHZhbHVlcyBmb3IgYHVybGAgcGFyYW1ldGVycy4gVGhlc2UgY2FuIGJlIG92ZXJyaWRkZW4gaW5cbiAqICAgYGFjdGlvbnNgIG1ldGhvZHMuIElmIGFueSBvZiB0aGUgcGFyYW1ldGVyIHZhbHVlIGlzIGEgZnVuY3Rpb24sIGl0IHdpbGwgYmUgZXhlY3V0ZWQgZXZlcnkgdGltZVxuICogICB3aGVuIGEgcGFyYW0gdmFsdWUgbmVlZHMgdG8gYmUgb2J0YWluZWQgZm9yIGEgcmVxdWVzdCAodW5sZXNzIHRoZSBwYXJhbSB3YXMgb3ZlcnJpZGRlbikuXG4gKlxuICogICBFYWNoIGtleSB2YWx1ZSBpbiB0aGUgcGFyYW1ldGVyIG9iamVjdCBpcyBmaXJzdCBib3VuZCB0byB1cmwgdGVtcGxhdGUgaWYgcHJlc2VudCBhbmQgdGhlbiBhbnlcbiAqICAgZXhjZXNzIGtleXMgYXJlIGFwcGVuZGVkIHRvIHRoZSB1cmwgc2VhcmNoIHF1ZXJ5IGFmdGVyIHRoZSBgP2AuXG4gKlxuICogICBHaXZlbiBhIHRlbXBsYXRlIGAvcGF0aC86dmVyYmAgYW5kIHBhcmFtZXRlciBge3ZlcmI6J2dyZWV0Jywgc2FsdXRhdGlvbjonSGVsbG8nfWAgcmVzdWx0cyBpblxuICogICBVUkwgYC9wYXRoL2dyZWV0P3NhbHV0YXRpb249SGVsbG9gLlxuICpcbiAqICAgSWYgdGhlIHBhcmFtZXRlciB2YWx1ZSBpcyBwcmVmaXhlZCB3aXRoIGBAYCB0aGVuIHRoZSB2YWx1ZSBmb3IgdGhhdCBwYXJhbWV0ZXIgd2lsbCBiZSBleHRyYWN0ZWRcbiAqICAgZnJvbSB0aGUgY29ycmVzcG9uZGluZyBwcm9wZXJ0eSBvbiB0aGUgYGRhdGFgIG9iamVjdCAocHJvdmlkZWQgd2hlbiBjYWxsaW5nIGFuIGFjdGlvbiBtZXRob2QpLiAgRm9yXG4gKiAgIGV4YW1wbGUsIGlmIHRoZSBgZGVmYXVsdFBhcmFtYCBvYmplY3QgaXMgYHtzb21lUGFyYW06ICdAc29tZVByb3AnfWAgdGhlbiB0aGUgdmFsdWUgb2YgYHNvbWVQYXJhbWBcbiAqICAgd2lsbCBiZSBgZGF0YS5zb21lUHJvcGAuXG4gKlxuICogQHBhcmFtIHtPYmplY3QuPE9iamVjdD49fSBhY3Rpb25zIEhhc2ggd2l0aCBkZWNsYXJhdGlvbiBvZiBjdXN0b20gYWN0aW9ucyB0aGF0IHNob3VsZCBleHRlbmRcbiAqICAgdGhlIGRlZmF1bHQgc2V0IG9mIHJlc291cmNlIGFjdGlvbnMuIFRoZSBkZWNsYXJhdGlvbiBzaG91bGQgYmUgY3JlYXRlZCBpbiB0aGUgZm9ybWF0IG9mIHtAbGlua1xuICogICBuZy4kaHR0cCN1c2FnZSAkaHR0cC5jb25maWd9OlxuICpcbiAqICAgICAgIHthY3Rpb24xOiB7bWV0aG9kOj8sIHBhcmFtczo/LCBpc0FycmF5Oj8sIGhlYWRlcnM6PywgLi4ufSxcbiAqICAgICAgICBhY3Rpb24yOiB7bWV0aG9kOj8sIHBhcmFtczo/LCBpc0FycmF5Oj8sIGhlYWRlcnM6PywgLi4ufSxcbiAqICAgICAgICAuLi59XG4gKlxuICogICBXaGVyZTpcbiAqXG4gKiAgIC0gKipgYWN0aW9uYCoqIOKAkyB7c3RyaW5nfSDigJMgVGhlIG5hbWUgb2YgYWN0aW9uLiBUaGlzIG5hbWUgYmVjb21lcyB0aGUgbmFtZSBvZiB0aGUgbWV0aG9kIG9uXG4gKiAgICAgeW91ciByZXNvdXJjZSBvYmplY3QuXG4gKiAgIC0gKipgbWV0aG9kYCoqIOKAkyB7c3RyaW5nfSDigJMgQ2FzZSBpbnNlbnNpdGl2ZSBIVFRQIG1ldGhvZCAoZS5nLiBgR0VUYCwgYFBPU1RgLCBgUFVUYCxcbiAqICAgICBgREVMRVRFYCwgYEpTT05QYCwgZXRjKS5cbiAqICAgLSAqKmBwYXJhbXNgKiog4oCTIHtPYmplY3Q9fSDigJMgT3B0aW9uYWwgc2V0IG9mIHByZS1ib3VuZCBwYXJhbWV0ZXJzIGZvciB0aGlzIGFjdGlvbi4gSWYgYW55IG9mXG4gKiAgICAgdGhlIHBhcmFtZXRlciB2YWx1ZSBpcyBhIGZ1bmN0aW9uLCBpdCB3aWxsIGJlIGV4ZWN1dGVkIGV2ZXJ5IHRpbWUgd2hlbiBhIHBhcmFtIHZhbHVlIG5lZWRzIHRvXG4gKiAgICAgYmUgb2J0YWluZWQgZm9yIGEgcmVxdWVzdCAodW5sZXNzIHRoZSBwYXJhbSB3YXMgb3ZlcnJpZGRlbikuXG4gKiAgIC0gKipgdXJsYCoqIOKAkyB7c3RyaW5nfSDigJMgYWN0aW9uIHNwZWNpZmljIGB1cmxgIG92ZXJyaWRlLiBUaGUgdXJsIHRlbXBsYXRpbmcgaXMgc3VwcG9ydGVkIGp1c3RcbiAqICAgICBsaWtlIGZvciB0aGUgcmVzb3VyY2UtbGV2ZWwgdXJscy5cbiAqICAgLSAqKmBpc0FycmF5YCoqIOKAkyB7Ym9vbGVhbj19IOKAkyBJZiB0cnVlIHRoZW4gdGhlIHJldHVybmVkIG9iamVjdCBmb3IgdGhpcyBhY3Rpb24gaXMgYW4gYXJyYXksXG4gKiAgICAgc2VlIGByZXR1cm5zYCBzZWN0aW9uLlxuICogICAtICoqYHRyYW5zZm9ybVJlcXVlc3RgKiog4oCTXG4gKiAgICAgYHtmdW5jdGlvbihkYXRhLCBoZWFkZXJzR2V0dGVyKXxBcnJheS48ZnVuY3Rpb24oZGF0YSwgaGVhZGVyc0dldHRlcik+fWAg4oCTXG4gKiAgICAgdHJhbnNmb3JtIGZ1bmN0aW9uIG9yIGFuIGFycmF5IG9mIHN1Y2ggZnVuY3Rpb25zLiBUaGUgdHJhbnNmb3JtIGZ1bmN0aW9uIHRha2VzIHRoZSBodHRwXG4gKiAgICAgcmVxdWVzdCBib2R5IGFuZCBoZWFkZXJzIGFuZCByZXR1cm5zIGl0cyB0cmFuc2Zvcm1lZCAodHlwaWNhbGx5IHNlcmlhbGl6ZWQpIHZlcnNpb24uXG4gKiAgICAgQnkgZGVmYXVsdCwgdHJhbnNmb3JtUmVxdWVzdCB3aWxsIGNvbnRhaW4gb25lIGZ1bmN0aW9uIHRoYXQgY2hlY2tzIGlmIHRoZSByZXF1ZXN0IGRhdGEgaXNcbiAqICAgICBhbiBvYmplY3QgYW5kIHNlcmlhbGl6ZXMgdG8gdXNpbmcgYGFuZ3VsYXIudG9Kc29uYC4gVG8gcHJldmVudCB0aGlzIGJlaGF2aW9yLCBzZXRcbiAqICAgICBgdHJhbnNmb3JtUmVxdWVzdGAgdG8gYW4gZW1wdHkgYXJyYXk6IGB0cmFuc2Zvcm1SZXF1ZXN0OiBbXWBcbiAqICAgLSAqKmB0cmFuc2Zvcm1SZXNwb25zZWAqKiDigJNcbiAqICAgICBge2Z1bmN0aW9uKGRhdGEsIGhlYWRlcnNHZXR0ZXIpfEFycmF5LjxmdW5jdGlvbihkYXRhLCBoZWFkZXJzR2V0dGVyKT59YCDigJNcbiAqICAgICB0cmFuc2Zvcm0gZnVuY3Rpb24gb3IgYW4gYXJyYXkgb2Ygc3VjaCBmdW5jdGlvbnMuIFRoZSB0cmFuc2Zvcm0gZnVuY3Rpb24gdGFrZXMgdGhlIGh0dHBcbiAqICAgICByZXNwb25zZSBib2R5IGFuZCBoZWFkZXJzIGFuZCByZXR1cm5zIGl0cyB0cmFuc2Zvcm1lZCAodHlwaWNhbGx5IGRlc2VyaWFsaXplZCkgdmVyc2lvbi5cbiAqICAgICBCeSBkZWZhdWx0LCB0cmFuc2Zvcm1SZXNwb25zZSB3aWxsIGNvbnRhaW4gb25lIGZ1bmN0aW9uIHRoYXQgY2hlY2tzIGlmIHRoZSByZXNwb25zZSBsb29rcyBsaWtlXG4gKiAgICAgYSBKU09OIHN0cmluZyBhbmQgZGVzZXJpYWxpemVzIGl0IHVzaW5nIGBhbmd1bGFyLmZyb21Kc29uYC4gVG8gcHJldmVudCB0aGlzIGJlaGF2aW9yLCBzZXRcbiAqICAgICBgdHJhbnNmb3JtUmVzcG9uc2VgIHRvIGFuIGVtcHR5IGFycmF5OiBgdHJhbnNmb3JtUmVzcG9uc2U6IFtdYFxuICogICAtICoqYGNhY2hlYCoqIOKAkyBge2Jvb2xlYW58Q2FjaGV9YCDigJMgSWYgdHJ1ZSwgYSBkZWZhdWx0ICRodHRwIGNhY2hlIHdpbGwgYmUgdXNlZCB0byBjYWNoZSB0aGVcbiAqICAgICBHRVQgcmVxdWVzdCwgb3RoZXJ3aXNlIGlmIGEgY2FjaGUgaW5zdGFuY2UgYnVpbHQgd2l0aFxuICogICAgIHtAbGluayBuZy4kY2FjaGVGYWN0b3J5ICRjYWNoZUZhY3Rvcnl9LCB0aGlzIGNhY2hlIHdpbGwgYmUgdXNlZCBmb3JcbiAqICAgICBjYWNoaW5nLlxuICogICAtICoqYHRpbWVvdXRgKiog4oCTIGB7bnVtYmVyfFByb21pc2V9YCDigJMgdGltZW91dCBpbiBtaWxsaXNlY29uZHMsIG9yIHtAbGluayBuZy4kcSBwcm9taXNlfSB0aGF0XG4gKiAgICAgc2hvdWxkIGFib3J0IHRoZSByZXF1ZXN0IHdoZW4gcmVzb2x2ZWQuXG4gKiAgIC0gKipgd2l0aENyZWRlbnRpYWxzYCoqIC0gYHtib29sZWFufWAgLSB3aGV0aGVyIHRvIHNldCB0aGUgYHdpdGhDcmVkZW50aWFsc2AgZmxhZyBvbiB0aGVcbiAqICAgICBYSFIgb2JqZWN0LiBTZWVcbiAqICAgICBbcmVxdWVzdHMgd2l0aCBjcmVkZW50aWFsc10oaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4vaHR0cF9hY2Nlc3NfY29udHJvbCNzZWN0aW9uXzUpXG4gKiAgICAgZm9yIG1vcmUgaW5mb3JtYXRpb24uXG4gKiAgIC0gKipgcmVzcG9uc2VUeXBlYCoqIC0gYHtzdHJpbmd9YCAtIHNlZVxuICogICAgIFtyZXF1ZXN0VHlwZV0oaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9ET00vWE1MSHR0cFJlcXVlc3QjcmVzcG9uc2VUeXBlKS5cbiAqICAgLSAqKmBpbnRlcmNlcHRvcmAqKiAtIGB7T2JqZWN0PX1gIC0gVGhlIGludGVyY2VwdG9yIG9iamVjdCBoYXMgdHdvIG9wdGlvbmFsIG1ldGhvZHMgLVxuICogICAgIGByZXNwb25zZWAgYW5kIGByZXNwb25zZUVycm9yYC4gQm90aCBgcmVzcG9uc2VgIGFuZCBgcmVzcG9uc2VFcnJvcmAgaW50ZXJjZXB0b3JzIGdldCBjYWxsZWRcbiAqICAgICB3aXRoIGBodHRwIHJlc3BvbnNlYCBvYmplY3QuIFNlZSB7QGxpbmsgbmcuJGh0dHAgJGh0dHAgaW50ZXJjZXB0b3JzfS5cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyBIYXNoIHdpdGggY3VzdG9tIHNldHRpbmdzIHRoYXQgc2hvdWxkIGV4dGVuZCB0aGVcbiAqICAgZGVmYXVsdCBgJHJlc291cmNlUHJvdmlkZXJgIGJlaGF2aW9yLiAgVGhlIG9ubHkgc3VwcG9ydGVkIG9wdGlvbiBpc1xuICpcbiAqICAgV2hlcmU6XG4gKlxuICogICAtICoqYHN0cmlwVHJhaWxpbmdTbGFzaGVzYCoqIOKAkyB7Ym9vbGVhbn0g4oCTIElmIHRydWUgdGhlbiB0aGUgdHJhaWxpbmdcbiAqICAgc2xhc2hlcyBmcm9tIGFueSBjYWxjdWxhdGVkIFVSTCB3aWxsIGJlIHN0cmlwcGVkLiAoRGVmYXVsdHMgdG8gdHJ1ZS4pXG4gKlxuICogQHJldHVybnMge09iamVjdH0gQSByZXNvdXJjZSBcImNsYXNzXCIgb2JqZWN0IHdpdGggbWV0aG9kcyBmb3IgdGhlIGRlZmF1bHQgc2V0IG9mIHJlc291cmNlIGFjdGlvbnNcbiAqICAgb3B0aW9uYWxseSBleHRlbmRlZCB3aXRoIGN1c3RvbSBgYWN0aW9uc2AuIFRoZSBkZWZhdWx0IHNldCBjb250YWlucyB0aGVzZSBhY3Rpb25zOlxuICogICBgYGBqc1xuICogICB7ICdnZXQnOiAgICB7bWV0aG9kOidHRVQnfSxcbiAqICAgICAnc2F2ZSc6ICAge21ldGhvZDonUE9TVCd9LFxuICogICAgICdxdWVyeSc6ICB7bWV0aG9kOidHRVQnLCBpc0FycmF5OnRydWV9LFxuICogICAgICdyZW1vdmUnOiB7bWV0aG9kOidERUxFVEUnfSxcbiAqICAgICAnZGVsZXRlJzoge21ldGhvZDonREVMRVRFJ30gfTtcbiAqICAgYGBgXG4gKlxuICogICBDYWxsaW5nIHRoZXNlIG1ldGhvZHMgaW52b2tlIGFuIHtAbGluayBuZy4kaHR0cH0gd2l0aCB0aGUgc3BlY2lmaWVkIGh0dHAgbWV0aG9kLFxuICogICBkZXN0aW5hdGlvbiBhbmQgcGFyYW1ldGVycy4gV2hlbiB0aGUgZGF0YSBpcyByZXR1cm5lZCBmcm9tIHRoZSBzZXJ2ZXIgdGhlbiB0aGUgb2JqZWN0IGlzIGFuXG4gKiAgIGluc3RhbmNlIG9mIHRoZSByZXNvdXJjZSBjbGFzcy4gVGhlIGFjdGlvbnMgYHNhdmVgLCBgcmVtb3ZlYCBhbmQgYGRlbGV0ZWAgYXJlIGF2YWlsYWJsZSBvbiBpdFxuICogICBhcyAgbWV0aG9kcyB3aXRoIHRoZSBgJGAgcHJlZml4LiBUaGlzIGFsbG93cyB5b3UgdG8gZWFzaWx5IHBlcmZvcm0gQ1JVRCBvcGVyYXRpb25zIChjcmVhdGUsXG4gKiAgIHJlYWQsIHVwZGF0ZSwgZGVsZXRlKSBvbiBzZXJ2ZXItc2lkZSBkYXRhIGxpa2UgdGhpczpcbiAqICAgYGBganNcbiAqICAgdmFyIFVzZXIgPSAkcmVzb3VyY2UoJy91c2VyLzp1c2VySWQnLCB7dXNlcklkOidAaWQnfSk7XG4gKiAgIHZhciB1c2VyID0gVXNlci5nZXQoe3VzZXJJZDoxMjN9LCBmdW5jdGlvbigpIHtcbiAqICAgICB1c2VyLmFiYyA9IHRydWU7XG4gKiAgICAgdXNlci4kc2F2ZSgpO1xuICogICB9KTtcbiAqICAgYGBgXG4gKlxuICogICBJdCBpcyBpbXBvcnRhbnQgdG8gcmVhbGl6ZSB0aGF0IGludm9raW5nIGEgJHJlc291cmNlIG9iamVjdCBtZXRob2QgaW1tZWRpYXRlbHkgcmV0dXJucyBhblxuICogICBlbXB0eSByZWZlcmVuY2UgKG9iamVjdCBvciBhcnJheSBkZXBlbmRpbmcgb24gYGlzQXJyYXlgKS4gT25jZSB0aGUgZGF0YSBpcyByZXR1cm5lZCBmcm9tIHRoZVxuICogICBzZXJ2ZXIgdGhlIGV4aXN0aW5nIHJlZmVyZW5jZSBpcyBwb3B1bGF0ZWQgd2l0aCB0aGUgYWN0dWFsIGRhdGEuIFRoaXMgaXMgYSB1c2VmdWwgdHJpY2sgc2luY2VcbiAqICAgdXN1YWxseSB0aGUgcmVzb3VyY2UgaXMgYXNzaWduZWQgdG8gYSBtb2RlbCB3aGljaCBpcyB0aGVuIHJlbmRlcmVkIGJ5IHRoZSB2aWV3LiBIYXZpbmcgYW4gZW1wdHlcbiAqICAgb2JqZWN0IHJlc3VsdHMgaW4gbm8gcmVuZGVyaW5nLCBvbmNlIHRoZSBkYXRhIGFycml2ZXMgZnJvbSB0aGUgc2VydmVyIHRoZW4gdGhlIG9iamVjdCBpc1xuICogICBwb3B1bGF0ZWQgd2l0aCB0aGUgZGF0YSBhbmQgdGhlIHZpZXcgYXV0b21hdGljYWxseSByZS1yZW5kZXJzIGl0c2VsZiBzaG93aW5nIHRoZSBuZXcgZGF0YS4gVGhpc1xuICogICBtZWFucyB0aGF0IGluIG1vc3QgY2FzZXMgb25lIG5ldmVyIGhhcyB0byB3cml0ZSBhIGNhbGxiYWNrIGZ1bmN0aW9uIGZvciB0aGUgYWN0aW9uIG1ldGhvZHMuXG4gKlxuICogICBUaGUgYWN0aW9uIG1ldGhvZHMgb24gdGhlIGNsYXNzIG9iamVjdCBvciBpbnN0YW5jZSBvYmplY3QgY2FuIGJlIGludm9rZWQgd2l0aCB0aGUgZm9sbG93aW5nXG4gKiAgIHBhcmFtZXRlcnM6XG4gKlxuICogICAtIEhUVFAgR0VUIFwiY2xhc3NcIiBhY3Rpb25zOiBgUmVzb3VyY2UuYWN0aW9uKFtwYXJhbWV0ZXJzXSwgW3N1Y2Nlc3NdLCBbZXJyb3JdKWBcbiAqICAgLSBub24tR0VUIFwiY2xhc3NcIiBhY3Rpb25zOiBgUmVzb3VyY2UuYWN0aW9uKFtwYXJhbWV0ZXJzXSwgcG9zdERhdGEsIFtzdWNjZXNzXSwgW2Vycm9yXSlgXG4gKiAgIC0gbm9uLUdFVCBpbnN0YW5jZSBhY3Rpb25zOiAgYGluc3RhbmNlLiRhY3Rpb24oW3BhcmFtZXRlcnNdLCBbc3VjY2Vzc10sIFtlcnJvcl0pYFxuICpcbiAqXG4gKiAgIFN1Y2Nlc3MgY2FsbGJhY2sgaXMgY2FsbGVkIHdpdGggKHZhbHVlLCByZXNwb25zZUhlYWRlcnMpIGFyZ3VtZW50cy4gRXJyb3IgY2FsbGJhY2sgaXMgY2FsbGVkXG4gKiAgIHdpdGggKGh0dHBSZXNwb25zZSkgYXJndW1lbnQuXG4gKlxuICogICBDbGFzcyBhY3Rpb25zIHJldHVybiBlbXB0eSBpbnN0YW5jZSAod2l0aCBhZGRpdGlvbmFsIHByb3BlcnRpZXMgYmVsb3cpLlxuICogICBJbnN0YW5jZSBhY3Rpb25zIHJldHVybiBwcm9taXNlIG9mIHRoZSBhY3Rpb24uXG4gKlxuICogICBUaGUgUmVzb3VyY2UgaW5zdGFuY2VzIGFuZCBjb2xsZWN0aW9uIGhhdmUgdGhlc2UgYWRkaXRpb25hbCBwcm9wZXJ0aWVzOlxuICpcbiAqICAgLSBgJHByb21pc2VgOiB0aGUge0BsaW5rIG5nLiRxIHByb21pc2V9IG9mIHRoZSBvcmlnaW5hbCBzZXJ2ZXIgaW50ZXJhY3Rpb24gdGhhdCBjcmVhdGVkIHRoaXNcbiAqICAgICBpbnN0YW5jZSBvciBjb2xsZWN0aW9uLlxuICpcbiAqICAgICBPbiBzdWNjZXNzLCB0aGUgcHJvbWlzZSBpcyByZXNvbHZlZCB3aXRoIHRoZSBzYW1lIHJlc291cmNlIGluc3RhbmNlIG9yIGNvbGxlY3Rpb24gb2JqZWN0LFxuICogICAgIHVwZGF0ZWQgd2l0aCBkYXRhIGZyb20gc2VydmVyLiBUaGlzIG1ha2VzIGl0IGVhc3kgdG8gdXNlIGluXG4gKiAgICAge0BsaW5rIG5nUm91dGUuJHJvdXRlUHJvdmlkZXIgcmVzb2x2ZSBzZWN0aW9uIG9mICRyb3V0ZVByb3ZpZGVyLndoZW4oKX0gdG8gZGVmZXIgdmlld1xuICogICAgIHJlbmRlcmluZyB1bnRpbCB0aGUgcmVzb3VyY2UocykgYXJlIGxvYWRlZC5cbiAqXG4gKiAgICAgT24gZmFpbHVyZSwgdGhlIHByb21pc2UgaXMgcmVzb2x2ZWQgd2l0aCB0aGUge0BsaW5rIG5nLiRodHRwIGh0dHAgcmVzcG9uc2V9IG9iamVjdCwgd2l0aG91dFxuICogICAgIHRoZSBgcmVzb3VyY2VgIHByb3BlcnR5LlxuICpcbiAqICAgICBJZiBhbiBpbnRlcmNlcHRvciBvYmplY3Qgd2FzIHByb3ZpZGVkLCB0aGUgcHJvbWlzZSB3aWxsIGluc3RlYWQgYmUgcmVzb2x2ZWQgd2l0aCB0aGUgdmFsdWVcbiAqICAgICByZXR1cm5lZCBieSB0aGUgaW50ZXJjZXB0b3IuXG4gKlxuICogICAtIGAkcmVzb2x2ZWRgOiBgdHJ1ZWAgYWZ0ZXIgZmlyc3Qgc2VydmVyIGludGVyYWN0aW9uIGlzIGNvbXBsZXRlZCAoZWl0aGVyIHdpdGggc3VjY2VzcyBvclxuICogICAgICByZWplY3Rpb24pLCBgZmFsc2VgIGJlZm9yZSB0aGF0LiBLbm93aW5nIGlmIHRoZSBSZXNvdXJjZSBoYXMgYmVlbiByZXNvbHZlZCBpcyB1c2VmdWwgaW5cbiAqICAgICAgZGF0YS1iaW5kaW5nLlxuICpcbiAqIEBleGFtcGxlXG4gKlxuICogIyBDcmVkaXQgY2FyZCByZXNvdXJjZVxuICpcbiAqIGBgYGpzXG4gICAgIC8vIERlZmluZSBDcmVkaXRDYXJkIGNsYXNzXG4gICAgIHZhciBDcmVkaXRDYXJkID0gJHJlc291cmNlKCcvdXNlci86dXNlcklkL2NhcmQvOmNhcmRJZCcsXG4gICAgICB7dXNlcklkOjEyMywgY2FyZElkOidAaWQnfSwge1xuICAgICAgIGNoYXJnZToge21ldGhvZDonUE9TVCcsIHBhcmFtczp7Y2hhcmdlOnRydWV9fVxuICAgICAgfSk7XG5cbiAgICAgLy8gV2UgY2FuIHJldHJpZXZlIGEgY29sbGVjdGlvbiBmcm9tIHRoZSBzZXJ2ZXJcbiAgICAgdmFyIGNhcmRzID0gQ3JlZGl0Q2FyZC5xdWVyeShmdW5jdGlvbigpIHtcbiAgICAgICAvLyBHRVQ6IC91c2VyLzEyMy9jYXJkXG4gICAgICAgLy8gc2VydmVyIHJldHVybnM6IFsge2lkOjQ1NiwgbnVtYmVyOicxMjM0JywgbmFtZTonU21pdGgnfSBdO1xuXG4gICAgICAgdmFyIGNhcmQgPSBjYXJkc1swXTtcbiAgICAgICAvLyBlYWNoIGl0ZW0gaXMgYW4gaW5zdGFuY2Ugb2YgQ3JlZGl0Q2FyZFxuICAgICAgIGV4cGVjdChjYXJkIGluc3RhbmNlb2YgQ3JlZGl0Q2FyZCkudG9FcXVhbCh0cnVlKTtcbiAgICAgICBjYXJkLm5hbWUgPSBcIkouIFNtaXRoXCI7XG4gICAgICAgLy8gbm9uIEdFVCBtZXRob2RzIGFyZSBtYXBwZWQgb250byB0aGUgaW5zdGFuY2VzXG4gICAgICAgY2FyZC4kc2F2ZSgpO1xuICAgICAgIC8vIFBPU1Q6IC91c2VyLzEyMy9jYXJkLzQ1NiB7aWQ6NDU2LCBudW1iZXI6JzEyMzQnLCBuYW1lOidKLiBTbWl0aCd9XG4gICAgICAgLy8gc2VydmVyIHJldHVybnM6IHtpZDo0NTYsIG51bWJlcjonMTIzNCcsIG5hbWU6ICdKLiBTbWl0aCd9O1xuXG4gICAgICAgLy8gb3VyIGN1c3RvbSBtZXRob2QgaXMgbWFwcGVkIGFzIHdlbGwuXG4gICAgICAgY2FyZC4kY2hhcmdlKHthbW91bnQ6OS45OX0pO1xuICAgICAgIC8vIFBPU1Q6IC91c2VyLzEyMy9jYXJkLzQ1Nj9hbW91bnQ9OS45OSZjaGFyZ2U9dHJ1ZSB7aWQ6NDU2LCBudW1iZXI6JzEyMzQnLCBuYW1lOidKLiBTbWl0aCd9XG4gICAgIH0pO1xuXG4gICAgIC8vIHdlIGNhbiBjcmVhdGUgYW4gaW5zdGFuY2UgYXMgd2VsbFxuICAgICB2YXIgbmV3Q2FyZCA9IG5ldyBDcmVkaXRDYXJkKHtudW1iZXI6JzAxMjMnfSk7XG4gICAgIG5ld0NhcmQubmFtZSA9IFwiTWlrZSBTbWl0aFwiO1xuICAgICBuZXdDYXJkLiRzYXZlKCk7XG4gICAgIC8vIFBPU1Q6IC91c2VyLzEyMy9jYXJkIHtudW1iZXI6JzAxMjMnLCBuYW1lOidNaWtlIFNtaXRoJ31cbiAgICAgLy8gc2VydmVyIHJldHVybnM6IHtpZDo3ODksIG51bWJlcjonMDEyMycsIG5hbWU6ICdNaWtlIFNtaXRoJ307XG4gICAgIGV4cGVjdChuZXdDYXJkLmlkKS50b0VxdWFsKDc4OSk7XG4gKiBgYGBcbiAqXG4gKiBUaGUgb2JqZWN0IHJldHVybmVkIGZyb20gdGhpcyBmdW5jdGlvbiBleGVjdXRpb24gaXMgYSByZXNvdXJjZSBcImNsYXNzXCIgd2hpY2ggaGFzIFwic3RhdGljXCIgbWV0aG9kXG4gKiBmb3IgZWFjaCBhY3Rpb24gaW4gdGhlIGRlZmluaXRpb24uXG4gKlxuICogQ2FsbGluZyB0aGVzZSBtZXRob2RzIGludm9rZSBgJGh0dHBgIG9uIHRoZSBgdXJsYCB0ZW1wbGF0ZSB3aXRoIHRoZSBnaXZlbiBgbWV0aG9kYCwgYHBhcmFtc2AgYW5kXG4gKiBgaGVhZGVyc2AuXG4gKiBXaGVuIHRoZSBkYXRhIGlzIHJldHVybmVkIGZyb20gdGhlIHNlcnZlciB0aGVuIHRoZSBvYmplY3QgaXMgYW4gaW5zdGFuY2Ugb2YgdGhlIHJlc291cmNlIHR5cGUgYW5kXG4gKiBhbGwgb2YgdGhlIG5vbi1HRVQgbWV0aG9kcyBhcmUgYXZhaWxhYmxlIHdpdGggYCRgIHByZWZpeC4gVGhpcyBhbGxvd3MgeW91IHRvIGVhc2lseSBzdXBwb3J0IENSVURcbiAqIG9wZXJhdGlvbnMgKGNyZWF0ZSwgcmVhZCwgdXBkYXRlLCBkZWxldGUpIG9uIHNlcnZlci1zaWRlIGRhdGEuXG5cbiAgIGBgYGpzXG4gICAgIHZhciBVc2VyID0gJHJlc291cmNlKCcvdXNlci86dXNlcklkJywge3VzZXJJZDonQGlkJ30pO1xuICAgICBVc2VyLmdldCh7dXNlcklkOjEyM30sIGZ1bmN0aW9uKHVzZXIpIHtcbiAgICAgICB1c2VyLmFiYyA9IHRydWU7XG4gICAgICAgdXNlci4kc2F2ZSgpO1xuICAgICB9KTtcbiAgIGBgYFxuICpcbiAqIEl0J3Mgd29ydGggbm90aW5nIHRoYXQgdGhlIHN1Y2Nlc3MgY2FsbGJhY2sgZm9yIGBnZXRgLCBgcXVlcnlgIGFuZCBvdGhlciBtZXRob2RzIGdldHMgcGFzc2VkXG4gKiBpbiB0aGUgcmVzcG9uc2UgdGhhdCBjYW1lIGZyb20gdGhlIHNlcnZlciBhcyB3ZWxsIGFzICRodHRwIGhlYWRlciBnZXR0ZXIgZnVuY3Rpb24sIHNvIG9uZVxuICogY291bGQgcmV3cml0ZSB0aGUgYWJvdmUgZXhhbXBsZSBhbmQgZ2V0IGFjY2VzcyB0byBodHRwIGhlYWRlcnMgYXM6XG4gKlxuICAgYGBganNcbiAgICAgdmFyIFVzZXIgPSAkcmVzb3VyY2UoJy91c2VyLzp1c2VySWQnLCB7dXNlcklkOidAaWQnfSk7XG4gICAgIFVzZXIuZ2V0KHt1c2VySWQ6MTIzfSwgZnVuY3Rpb24odSwgZ2V0UmVzcG9uc2VIZWFkZXJzKXtcbiAgICAgICB1LmFiYyA9IHRydWU7XG4gICAgICAgdS4kc2F2ZShmdW5jdGlvbih1LCBwdXRSZXNwb25zZUhlYWRlcnMpIHtcbiAgICAgICAgIC8vdSA9PiBzYXZlZCB1c2VyIG9iamVjdFxuICAgICAgICAgLy9wdXRSZXNwb25zZUhlYWRlcnMgPT4gJGh0dHAgaGVhZGVyIGdldHRlclxuICAgICAgIH0pO1xuICAgICB9KTtcbiAgIGBgYFxuICpcbiAqIFlvdSBjYW4gYWxzbyBhY2Nlc3MgdGhlIHJhdyBgJGh0dHBgIHByb21pc2UgdmlhIHRoZSBgJHByb21pc2VgIHByb3BlcnR5IG9uIHRoZSBvYmplY3QgcmV0dXJuZWRcbiAqXG4gICBgYGBcbiAgICAgdmFyIFVzZXIgPSAkcmVzb3VyY2UoJy91c2VyLzp1c2VySWQnLCB7dXNlcklkOidAaWQnfSk7XG4gICAgIFVzZXIuZ2V0KHt1c2VySWQ6MTIzfSlcbiAgICAgICAgIC4kcHJvbWlzZS50aGVuKGZ1bmN0aW9uKHVzZXIpIHtcbiAgICAgICAgICAgJHNjb3BlLnVzZXIgPSB1c2VyO1xuICAgICAgICAgfSk7XG4gICBgYGBcblxuICogIyBDcmVhdGluZyBhIGN1c3RvbSAnUFVUJyByZXF1ZXN0XG4gKiBJbiB0aGlzIGV4YW1wbGUgd2UgY3JlYXRlIGEgY3VzdG9tIG1ldGhvZCBvbiBvdXIgcmVzb3VyY2UgdG8gbWFrZSBhIFBVVCByZXF1ZXN0XG4gKiBgYGBqc1xuICogICAgdmFyIGFwcCA9IGFuZ3VsYXIubW9kdWxlKCdhcHAnLCBbJ25nUmVzb3VyY2UnLCAnbmdSb3V0ZSddKTtcbiAqXG4gKiAgICAvLyBTb21lIEFQSXMgZXhwZWN0IGEgUFVUIHJlcXVlc3QgaW4gdGhlIGZvcm1hdCBVUkwvb2JqZWN0L0lEXG4gKiAgICAvLyBIZXJlIHdlIGFyZSBjcmVhdGluZyBhbiAndXBkYXRlJyBtZXRob2RcbiAqICAgIGFwcC5mYWN0b3J5KCdOb3RlcycsIFsnJHJlc291cmNlJywgZnVuY3Rpb24oJHJlc291cmNlKSB7XG4gKiAgICByZXR1cm4gJHJlc291cmNlKCcvbm90ZXMvOmlkJywgbnVsbCxcbiAqICAgICAgICB7XG4gKiAgICAgICAgICAgICd1cGRhdGUnOiB7IG1ldGhvZDonUFVUJyB9XG4gKiAgICAgICAgfSk7XG4gKiAgICB9XSk7XG4gKlxuICogICAgLy8gSW4gb3VyIGNvbnRyb2xsZXIgd2UgZ2V0IHRoZSBJRCBmcm9tIHRoZSBVUkwgdXNpbmcgbmdSb3V0ZSBhbmQgJHJvdXRlUGFyYW1zXG4gKiAgICAvLyBXZSBwYXNzIGluICRyb3V0ZVBhcmFtcyBhbmQgb3VyIE5vdGVzIGZhY3RvcnkgYWxvbmcgd2l0aCAkc2NvcGVcbiAqICAgIGFwcC5jb250cm9sbGVyKCdOb3Rlc0N0cmwnLCBbJyRzY29wZScsICckcm91dGVQYXJhbXMnLCAnTm90ZXMnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbigkc2NvcGUsICRyb3V0ZVBhcmFtcywgTm90ZXMpIHtcbiAqICAgIC8vIEZpcnN0IGdldCBhIG5vdGUgb2JqZWN0IGZyb20gdGhlIGZhY3RvcnlcbiAqICAgIHZhciBub3RlID0gTm90ZXMuZ2V0KHsgaWQ6JHJvdXRlUGFyYW1zLmlkIH0pO1xuICogICAgJGlkID0gbm90ZS5pZDtcbiAqXG4gKiAgICAvLyBOb3cgY2FsbCB1cGRhdGUgcGFzc2luZyBpbiB0aGUgSUQgZmlyc3QgdGhlbiB0aGUgb2JqZWN0IHlvdSBhcmUgdXBkYXRpbmdcbiAqICAgIE5vdGVzLnVwZGF0ZSh7IGlkOiRpZCB9LCBub3RlKTtcbiAqXG4gKiAgICAvLyBUaGlzIHdpbGwgUFVUIC9ub3Rlcy9JRCB3aXRoIHRoZSBub3RlIG9iamVjdCBpbiB0aGUgcmVxdWVzdCBwYXlsb2FkXG4gKiAgICB9XSk7XG4gKiBgYGBcbiAqL1xuYW5ndWxhci5tb2R1bGUoJ25nUmVzb3VyY2UnLCBbJ25nJ10pLlxuICBwcm92aWRlcignJHJlc291cmNlJywgZnVuY3Rpb24oKSB7XG4gICAgdmFyIHByb3ZpZGVyID0gdGhpcztcblxuICAgIHRoaXMuZGVmYXVsdHMgPSB7XG4gICAgICAvLyBTdHJpcCBzbGFzaGVzIGJ5IGRlZmF1bHRcbiAgICAgIHN0cmlwVHJhaWxpbmdTbGFzaGVzOiB0cnVlLFxuXG4gICAgICAvLyBEZWZhdWx0IGFjdGlvbnMgY29uZmlndXJhdGlvblxuICAgICAgYWN0aW9uczoge1xuICAgICAgICAnZ2V0Jzoge21ldGhvZDogJ0dFVCd9LFxuICAgICAgICAnc2F2ZSc6IHttZXRob2Q6ICdQT1NUJ30sXG4gICAgICAgICdxdWVyeSc6IHttZXRob2Q6ICdHRVQnLCBpc0FycmF5OiB0cnVlfSxcbiAgICAgICAgJ3JlbW92ZSc6IHttZXRob2Q6ICdERUxFVEUnfSxcbiAgICAgICAgJ2RlbGV0ZSc6IHttZXRob2Q6ICdERUxFVEUnfVxuICAgICAgfVxuICAgIH07XG5cbiAgICB0aGlzLiRnZXQgPSBbJyRodHRwJywgJyRxJywgZnVuY3Rpb24oJGh0dHAsICRxKSB7XG5cbiAgICAgIHZhciBub29wID0gYW5ndWxhci5ub29wLFxuICAgICAgICBmb3JFYWNoID0gYW5ndWxhci5mb3JFYWNoLFxuICAgICAgICBleHRlbmQgPSBhbmd1bGFyLmV4dGVuZCxcbiAgICAgICAgY29weSA9IGFuZ3VsYXIuY29weSxcbiAgICAgICAgaXNGdW5jdGlvbiA9IGFuZ3VsYXIuaXNGdW5jdGlvbjtcblxuICAgICAgLyoqXG4gICAgICAgKiBXZSBuZWVkIG91ciBjdXN0b20gbWV0aG9kIGJlY2F1c2UgZW5jb2RlVVJJQ29tcG9uZW50IGlzIHRvbyBhZ2dyZXNzaXZlIGFuZCBkb2Vzbid0IGZvbGxvd1xuICAgICAgICogaHR0cDovL3d3dy5pZXRmLm9yZy9yZmMvcmZjMzk4Ni50eHQgd2l0aCByZWdhcmRzIHRvIHRoZSBjaGFyYWN0ZXIgc2V0XG4gICAgICAgKiAocGNoYXIpIGFsbG93ZWQgaW4gcGF0aCBzZWdtZW50czpcbiAgICAgICAqICAgIHNlZ21lbnQgICAgICAgPSAqcGNoYXJcbiAgICAgICAqICAgIHBjaGFyICAgICAgICAgPSB1bnJlc2VydmVkIC8gcGN0LWVuY29kZWQgLyBzdWItZGVsaW1zIC8gXCI6XCIgLyBcIkBcIlxuICAgICAgICogICAgcGN0LWVuY29kZWQgICA9IFwiJVwiIEhFWERJRyBIRVhESUdcbiAgICAgICAqICAgIHVucmVzZXJ2ZWQgICAgPSBBTFBIQSAvIERJR0lUIC8gXCItXCIgLyBcIi5cIiAvIFwiX1wiIC8gXCJ+XCJcbiAgICAgICAqICAgIHN1Yi1kZWxpbXMgICAgPSBcIiFcIiAvIFwiJFwiIC8gXCImXCIgLyBcIidcIiAvIFwiKFwiIC8gXCIpXCJcbiAgICAgICAqICAgICAgICAgICAgICAgICAgICAgLyBcIipcIiAvIFwiK1wiIC8gXCIsXCIgLyBcIjtcIiAvIFwiPVwiXG4gICAgICAgKi9cbiAgICAgIGZ1bmN0aW9uIGVuY29kZVVyaVNlZ21lbnQodmFsKSB7XG4gICAgICAgIHJldHVybiBlbmNvZGVVcmlRdWVyeSh2YWwsIHRydWUpLlxuICAgICAgICAgIHJlcGxhY2UoLyUyNi9naSwgJyYnKS5cbiAgICAgICAgICByZXBsYWNlKC8lM0QvZ2ksICc9JykuXG4gICAgICAgICAgcmVwbGFjZSgvJTJCL2dpLCAnKycpO1xuICAgICAgfVxuXG5cbiAgICAgIC8qKlxuICAgICAgICogVGhpcyBtZXRob2QgaXMgaW50ZW5kZWQgZm9yIGVuY29kaW5nICprZXkqIG9yICp2YWx1ZSogcGFydHMgb2YgcXVlcnkgY29tcG9uZW50LiBXZSBuZWVkIGFcbiAgICAgICAqIGN1c3RvbSBtZXRob2QgYmVjYXVzZSBlbmNvZGVVUklDb21wb25lbnQgaXMgdG9vIGFnZ3Jlc3NpdmUgYW5kIGVuY29kZXMgc3R1ZmYgdGhhdCBkb2Vzbid0XG4gICAgICAgKiBoYXZlIHRvIGJlIGVuY29kZWQgcGVyIGh0dHA6Ly90b29scy5pZXRmLm9yZy9odG1sL3JmYzM5ODY6XG4gICAgICAgKiAgICBxdWVyeSAgICAgICA9ICooIHBjaGFyIC8gXCIvXCIgLyBcIj9cIiApXG4gICAgICAgKiAgICBwY2hhciAgICAgICAgID0gdW5yZXNlcnZlZCAvIHBjdC1lbmNvZGVkIC8gc3ViLWRlbGltcyAvIFwiOlwiIC8gXCJAXCJcbiAgICAgICAqICAgIHVucmVzZXJ2ZWQgICAgPSBBTFBIQSAvIERJR0lUIC8gXCItXCIgLyBcIi5cIiAvIFwiX1wiIC8gXCJ+XCJcbiAgICAgICAqICAgIHBjdC1lbmNvZGVkICAgPSBcIiVcIiBIRVhESUcgSEVYRElHXG4gICAgICAgKiAgICBzdWItZGVsaW1zICAgID0gXCIhXCIgLyBcIiRcIiAvIFwiJlwiIC8gXCInXCIgLyBcIihcIiAvIFwiKVwiXG4gICAgICAgKiAgICAgICAgICAgICAgICAgICAgIC8gXCIqXCIgLyBcIitcIiAvIFwiLFwiIC8gXCI7XCIgLyBcIj1cIlxuICAgICAgICovXG4gICAgICBmdW5jdGlvbiBlbmNvZGVVcmlRdWVyeSh2YWwsIHBjdEVuY29kZVNwYWNlcykge1xuICAgICAgICByZXR1cm4gZW5jb2RlVVJJQ29tcG9uZW50KHZhbCkuXG4gICAgICAgICAgcmVwbGFjZSgvJTQwL2dpLCAnQCcpLlxuICAgICAgICAgIHJlcGxhY2UoLyUzQS9naSwgJzonKS5cbiAgICAgICAgICByZXBsYWNlKC8lMjQvZywgJyQnKS5cbiAgICAgICAgICByZXBsYWNlKC8lMkMvZ2ksICcsJykuXG4gICAgICAgICAgcmVwbGFjZSgvJTIwL2csIChwY3RFbmNvZGVTcGFjZXMgPyAnJTIwJyA6ICcrJykpO1xuICAgICAgfVxuXG4gICAgICBmdW5jdGlvbiBSb3V0ZSh0ZW1wbGF0ZSwgZGVmYXVsdHMpIHtcbiAgICAgICAgdGhpcy50ZW1wbGF0ZSA9IHRlbXBsYXRlO1xuICAgICAgICB0aGlzLmRlZmF1bHRzID0gZXh0ZW5kKHt9LCBwcm92aWRlci5kZWZhdWx0cywgZGVmYXVsdHMpO1xuICAgICAgICB0aGlzLnVybFBhcmFtcyA9IHt9O1xuICAgICAgfVxuXG4gICAgICBSb3V0ZS5wcm90b3R5cGUgPSB7XG4gICAgICAgIHNldFVybFBhcmFtczogZnVuY3Rpb24oY29uZmlnLCBwYXJhbXMsIGFjdGlvblVybCkge1xuICAgICAgICAgIHZhciBzZWxmID0gdGhpcyxcbiAgICAgICAgICAgIHVybCA9IGFjdGlvblVybCB8fCBzZWxmLnRlbXBsYXRlLFxuICAgICAgICAgICAgdmFsLFxuICAgICAgICAgICAgZW5jb2RlZFZhbDtcblxuICAgICAgICAgIHZhciB1cmxQYXJhbXMgPSBzZWxmLnVybFBhcmFtcyA9IHt9O1xuICAgICAgICAgIGZvckVhY2godXJsLnNwbGl0KC9cXFcvKSwgZnVuY3Rpb24ocGFyYW0pIHtcbiAgICAgICAgICAgIGlmIChwYXJhbSA9PT0gJ2hhc093blByb3BlcnR5Jykge1xuICAgICAgICAgICAgICB0aHJvdyAkcmVzb3VyY2VNaW5FcnIoJ2JhZG5hbWUnLCBcImhhc093blByb3BlcnR5IGlzIG5vdCBhIHZhbGlkIHBhcmFtZXRlciBuYW1lLlwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICghKG5ldyBSZWdFeHAoXCJeXFxcXGQrJFwiKS50ZXN0KHBhcmFtKSkgJiYgcGFyYW0gJiZcbiAgICAgICAgICAgICAgKG5ldyBSZWdFeHAoXCIoXnxbXlxcXFxcXFxcXSk6XCIgKyBwYXJhbSArIFwiKFxcXFxXfCQpXCIpLnRlc3QodXJsKSkpIHtcbiAgICAgICAgICAgICAgdXJsUGFyYW1zW3BhcmFtXSA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgdXJsID0gdXJsLnJlcGxhY2UoL1xcXFw6L2csICc6Jyk7XG5cbiAgICAgICAgICBwYXJhbXMgPSBwYXJhbXMgfHwge307XG4gICAgICAgICAgZm9yRWFjaChzZWxmLnVybFBhcmFtcywgZnVuY3Rpb24oXywgdXJsUGFyYW0pIHtcbiAgICAgICAgICAgIHZhbCA9IHBhcmFtcy5oYXNPd25Qcm9wZXJ0eSh1cmxQYXJhbSkgPyBwYXJhbXNbdXJsUGFyYW1dIDogc2VsZi5kZWZhdWx0c1t1cmxQYXJhbV07XG4gICAgICAgICAgICBpZiAoYW5ndWxhci5pc0RlZmluZWQodmFsKSAmJiB2YWwgIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgZW5jb2RlZFZhbCA9IGVuY29kZVVyaVNlZ21lbnQodmFsKTtcbiAgICAgICAgICAgICAgdXJsID0gdXJsLnJlcGxhY2UobmV3IFJlZ0V4cChcIjpcIiArIHVybFBhcmFtICsgXCIoXFxcXFd8JClcIiwgXCJnXCIpLCBmdW5jdGlvbihtYXRjaCwgcDEpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZW5jb2RlZFZhbCArIHAxO1xuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHVybCA9IHVybC5yZXBsYWNlKG5ldyBSZWdFeHAoXCIoXFwvPyk6XCIgKyB1cmxQYXJhbSArIFwiKFxcXFxXfCQpXCIsIFwiZ1wiKSwgZnVuY3Rpb24obWF0Y2gsXG4gICAgICAgICAgICAgICAgICBsZWFkaW5nU2xhc2hlcywgdGFpbCkge1xuICAgICAgICAgICAgICAgIGlmICh0YWlsLmNoYXJBdCgwKSA9PSAnLycpIHtcbiAgICAgICAgICAgICAgICAgIHJldHVybiB0YWlsO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICByZXR1cm4gbGVhZGluZ1NsYXNoZXMgKyB0YWlsO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG5cbiAgICAgICAgICAvLyBzdHJpcCB0cmFpbGluZyBzbGFzaGVzIGFuZCBzZXQgdGhlIHVybCAodW5sZXNzIHRoaXMgYmVoYXZpb3IgaXMgc3BlY2lmaWNhbGx5IGRpc2FibGVkKVxuICAgICAgICAgIGlmIChzZWxmLmRlZmF1bHRzLnN0cmlwVHJhaWxpbmdTbGFzaGVzKSB7XG4gICAgICAgICAgICB1cmwgPSB1cmwucmVwbGFjZSgvXFwvKyQvLCAnJykgfHwgJy8nO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIC8vIHRoZW4gcmVwbGFjZSBjb2xsYXBzZSBgLy5gIGlmIGZvdW5kIGluIHRoZSBsYXN0IFVSTCBwYXRoIHNlZ21lbnQgYmVmb3JlIHRoZSBxdWVyeVxuICAgICAgICAgIC8vIEUuZy4gYGh0dHA6Ly91cmwuY29tL2lkLi9mb3JtYXQ/cT14YCBiZWNvbWVzIGBodHRwOi8vdXJsLmNvbS9pZC5mb3JtYXQ/cT14YFxuICAgICAgICAgIHVybCA9IHVybC5yZXBsYWNlKC9cXC9cXC4oPz1cXHcrKCR8XFw/KSkvLCAnLicpO1xuICAgICAgICAgIC8vIHJlcGxhY2UgZXNjYXBlZCBgL1xcLmAgd2l0aCBgLy5gXG4gICAgICAgICAgY29uZmlnLnVybCA9IHVybC5yZXBsYWNlKC9cXC9cXFxcXFwuLywgJy8uJyk7XG5cblxuICAgICAgICAgIC8vIHNldCBwYXJhbXMgLSBkZWxlZ2F0ZSBwYXJhbSBlbmNvZGluZyB0byAkaHR0cFxuICAgICAgICAgIGZvckVhY2gocGFyYW1zLCBmdW5jdGlvbih2YWx1ZSwga2V5KSB7XG4gICAgICAgICAgICBpZiAoIXNlbGYudXJsUGFyYW1zW2tleV0pIHtcbiAgICAgICAgICAgICAgY29uZmlnLnBhcmFtcyA9IGNvbmZpZy5wYXJhbXMgfHwge307XG4gICAgICAgICAgICAgIGNvbmZpZy5wYXJhbXNba2V5XSA9IHZhbHVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9O1xuXG5cbiAgICAgIGZ1bmN0aW9uIHJlc291cmNlRmFjdG9yeSh1cmwsIHBhcmFtRGVmYXVsdHMsIGFjdGlvbnMsIG9wdGlvbnMpIHtcbiAgICAgICAgdmFyIHJvdXRlID0gbmV3IFJvdXRlKHVybCwgb3B0aW9ucyk7XG5cbiAgICAgICAgYWN0aW9ucyA9IGV4dGVuZCh7fSwgcHJvdmlkZXIuZGVmYXVsdHMuYWN0aW9ucywgYWN0aW9ucyk7XG5cbiAgICAgICAgZnVuY3Rpb24gZXh0cmFjdFBhcmFtcyhkYXRhLCBhY3Rpb25QYXJhbXMpIHtcbiAgICAgICAgICB2YXIgaWRzID0ge307XG4gICAgICAgICAgYWN0aW9uUGFyYW1zID0gZXh0ZW5kKHt9LCBwYXJhbURlZmF1bHRzLCBhY3Rpb25QYXJhbXMpO1xuICAgICAgICAgIGZvckVhY2goYWN0aW9uUGFyYW1zLCBmdW5jdGlvbih2YWx1ZSwga2V5KSB7XG4gICAgICAgICAgICBpZiAoaXNGdW5jdGlvbih2YWx1ZSkpIHsgdmFsdWUgPSB2YWx1ZSgpOyB9XG4gICAgICAgICAgICBpZHNba2V5XSA9IHZhbHVlICYmIHZhbHVlLmNoYXJBdCAmJiB2YWx1ZS5jaGFyQXQoMCkgPT0gJ0AnID9cbiAgICAgICAgICAgICAgbG9va3VwRG90dGVkUGF0aChkYXRhLCB2YWx1ZS5zdWJzdHIoMSkpIDogdmFsdWU7XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgcmV0dXJuIGlkcztcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGRlZmF1bHRSZXNwb25zZUludGVyY2VwdG9yKHJlc3BvbnNlKSB7XG4gICAgICAgICAgcmV0dXJuIHJlc3BvbnNlLnJlc291cmNlO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gUmVzb3VyY2UodmFsdWUpIHtcbiAgICAgICAgICBzaGFsbG93Q2xlYXJBbmRDb3B5KHZhbHVlIHx8IHt9LCB0aGlzKTtcbiAgICAgICAgfVxuXG4gICAgICAgIFJlc291cmNlLnByb3RvdHlwZS50b0pTT04gPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICB2YXIgZGF0YSA9IGV4dGVuZCh7fSwgdGhpcyk7XG4gICAgICAgICAgZGVsZXRlIGRhdGEuJHByb21pc2U7XG4gICAgICAgICAgZGVsZXRlIGRhdGEuJHJlc29sdmVkO1xuICAgICAgICAgIHJldHVybiBkYXRhO1xuICAgICAgICB9O1xuXG4gICAgICAgIGZvckVhY2goYWN0aW9ucywgZnVuY3Rpb24oYWN0aW9uLCBuYW1lKSB7XG4gICAgICAgICAgdmFyIGhhc0JvZHkgPSAvXihQT1NUfFBVVHxQQVRDSCkkL2kudGVzdChhY3Rpb24ubWV0aG9kKTtcblxuICAgICAgICAgIFJlc291cmNlW25hbWVdID0gZnVuY3Rpb24oYTEsIGEyLCBhMywgYTQpIHtcbiAgICAgICAgICAgIHZhciBwYXJhbXMgPSB7fSwgZGF0YSwgc3VjY2VzcywgZXJyb3I7XG5cbiAgICAgICAgICAgIC8qIGpzaGludCAtVzA4NiAqLyAvKiAocHVycG9zZWZ1bGx5IGZhbGwgdGhyb3VnaCBjYXNlIHN0YXRlbWVudHMpICovXG4gICAgICAgICAgICBzd2l0Y2ggKGFyZ3VtZW50cy5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgY2FzZSA0OlxuICAgICAgICAgICAgICAgIGVycm9yID0gYTQ7XG4gICAgICAgICAgICAgICAgc3VjY2VzcyA9IGEzO1xuICAgICAgICAgICAgICAvL2ZhbGx0aHJvdWdoXG4gICAgICAgICAgICAgIGNhc2UgMzpcbiAgICAgICAgICAgICAgY2FzZSAyOlxuICAgICAgICAgICAgICAgIGlmIChpc0Z1bmN0aW9uKGEyKSkge1xuICAgICAgICAgICAgICAgICAgaWYgKGlzRnVuY3Rpb24oYTEpKSB7XG4gICAgICAgICAgICAgICAgICAgIHN1Y2Nlc3MgPSBhMTtcbiAgICAgICAgICAgICAgICAgICAgZXJyb3IgPSBhMjtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgIHN1Y2Nlc3MgPSBhMjtcbiAgICAgICAgICAgICAgICAgIGVycm9yID0gYTM7XG4gICAgICAgICAgICAgICAgICAvL2ZhbGx0aHJvdWdoXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgIHBhcmFtcyA9IGExO1xuICAgICAgICAgICAgICAgICAgZGF0YSA9IGEyO1xuICAgICAgICAgICAgICAgICAgc3VjY2VzcyA9IGEzO1xuICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBjYXNlIDE6XG4gICAgICAgICAgICAgICAgaWYgKGlzRnVuY3Rpb24oYTEpKSBzdWNjZXNzID0gYTE7XG4gICAgICAgICAgICAgICAgZWxzZSBpZiAoaGFzQm9keSkgZGF0YSA9IGExO1xuICAgICAgICAgICAgICAgIGVsc2UgcGFyYW1zID0gYTE7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgIGNhc2UgMDogYnJlYWs7XG4gICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgdGhyb3cgJHJlc291cmNlTWluRXJyKCdiYWRhcmdzJyxcbiAgICAgICAgICAgICAgICAgIFwiRXhwZWN0ZWQgdXAgdG8gNCBhcmd1bWVudHMgW3BhcmFtcywgZGF0YSwgc3VjY2VzcywgZXJyb3JdLCBnb3QgezB9IGFyZ3VtZW50c1wiLFxuICAgICAgICAgICAgICAgICAgYXJndW1lbnRzLmxlbmd0aCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvKiBqc2hpbnQgK1cwODYgKi8gLyogKHB1cnBvc2VmdWxseSBmYWxsIHRocm91Z2ggY2FzZSBzdGF0ZW1lbnRzKSAqL1xuXG4gICAgICAgICAgICB2YXIgaXNJbnN0YW5jZUNhbGwgPSB0aGlzIGluc3RhbmNlb2YgUmVzb3VyY2U7XG4gICAgICAgICAgICB2YXIgdmFsdWUgPSBpc0luc3RhbmNlQ2FsbCA/IGRhdGEgOiAoYWN0aW9uLmlzQXJyYXkgPyBbXSA6IG5ldyBSZXNvdXJjZShkYXRhKSk7XG4gICAgICAgICAgICB2YXIgaHR0cENvbmZpZyA9IHt9O1xuICAgICAgICAgICAgdmFyIHJlc3BvbnNlSW50ZXJjZXB0b3IgPSBhY3Rpb24uaW50ZXJjZXB0b3IgJiYgYWN0aW9uLmludGVyY2VwdG9yLnJlc3BvbnNlIHx8XG4gICAgICAgICAgICAgIGRlZmF1bHRSZXNwb25zZUludGVyY2VwdG9yO1xuICAgICAgICAgICAgdmFyIHJlc3BvbnNlRXJyb3JJbnRlcmNlcHRvciA9IGFjdGlvbi5pbnRlcmNlcHRvciAmJiBhY3Rpb24uaW50ZXJjZXB0b3IucmVzcG9uc2VFcnJvciB8fFxuICAgICAgICAgICAgICB1bmRlZmluZWQ7XG5cbiAgICAgICAgICAgIGZvckVhY2goYWN0aW9uLCBmdW5jdGlvbih2YWx1ZSwga2V5KSB7XG4gICAgICAgICAgICAgIGlmIChrZXkgIT0gJ3BhcmFtcycgJiYga2V5ICE9ICdpc0FycmF5JyAmJiBrZXkgIT0gJ2ludGVyY2VwdG9yJykge1xuICAgICAgICAgICAgICAgIGh0dHBDb25maWdba2V5XSA9IGNvcHkodmFsdWUpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgaWYgKGhhc0JvZHkpIGh0dHBDb25maWcuZGF0YSA9IGRhdGE7XG4gICAgICAgICAgICByb3V0ZS5zZXRVcmxQYXJhbXMoaHR0cENvbmZpZyxcbiAgICAgICAgICAgICAgZXh0ZW5kKHt9LCBleHRyYWN0UGFyYW1zKGRhdGEsIGFjdGlvbi5wYXJhbXMgfHwge30pLCBwYXJhbXMpLFxuICAgICAgICAgICAgICBhY3Rpb24udXJsKTtcblxuICAgICAgICAgICAgdmFyIHByb21pc2UgPSAkaHR0cChodHRwQ29uZmlnKS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICAgIHZhciBkYXRhID0gcmVzcG9uc2UuZGF0YSxcbiAgICAgICAgICAgICAgICBwcm9taXNlID0gdmFsdWUuJHByb21pc2U7XG5cbiAgICAgICAgICAgICAgaWYgKGRhdGEpIHtcbiAgICAgICAgICAgICAgICAvLyBOZWVkIHRvIGNvbnZlcnQgYWN0aW9uLmlzQXJyYXkgdG8gYm9vbGVhbiBpbiBjYXNlIGl0IGlzIHVuZGVmaW5lZFxuICAgICAgICAgICAgICAgIC8vIGpzaGludCAtVzAxOFxuICAgICAgICAgICAgICAgIGlmIChhbmd1bGFyLmlzQXJyYXkoZGF0YSkgIT09ICghIWFjdGlvbi5pc0FycmF5KSkge1xuICAgICAgICAgICAgICAgICAgdGhyb3cgJHJlc291cmNlTWluRXJyKCdiYWRjZmcnLFxuICAgICAgICAgICAgICAgICAgICAgICdFcnJvciBpbiByZXNvdXJjZSBjb25maWd1cmF0aW9uIGZvciBhY3Rpb24gYHswfWAuIEV4cGVjdGVkIHJlc3BvbnNlIHRvICcgK1xuICAgICAgICAgICAgICAgICAgICAgICdjb250YWluIGFuIHsxfSBidXQgZ290IGFuIHsyfScsIG5hbWUsIGFjdGlvbi5pc0FycmF5ID8gJ2FycmF5JyA6ICdvYmplY3QnLFxuICAgICAgICAgICAgICAgICAgICBhbmd1bGFyLmlzQXJyYXkoZGF0YSkgPyAnYXJyYXknIDogJ29iamVjdCcpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAvLyBqc2hpbnQgK1cwMThcbiAgICAgICAgICAgICAgICBpZiAoYWN0aW9uLmlzQXJyYXkpIHtcbiAgICAgICAgICAgICAgICAgIHZhbHVlLmxlbmd0aCA9IDA7XG4gICAgICAgICAgICAgICAgICBmb3JFYWNoKGRhdGEsIGZ1bmN0aW9uKGl0ZW0pIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBpdGVtID09PSBcIm9iamVjdFwiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgdmFsdWUucHVzaChuZXcgUmVzb3VyY2UoaXRlbSkpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgIC8vIFZhbGlkIEpTT04gdmFsdWVzIG1heSBiZSBzdHJpbmcgbGl0ZXJhbHMsIGFuZCB0aGVzZSBzaG91bGQgbm90IGJlIGNvbnZlcnRlZFxuICAgICAgICAgICAgICAgICAgICAgIC8vIGludG8gb2JqZWN0cy4gVGhlc2UgaXRlbXMgd2lsbCBub3QgaGF2ZSBhY2Nlc3MgdG8gdGhlIFJlc291cmNlIHByb3RvdHlwZVxuICAgICAgICAgICAgICAgICAgICAgIC8vIG1ldGhvZHMsIGJ1dCB1bmZvcnR1bmF0ZWx5IHRoZXJlXG4gICAgICAgICAgICAgICAgICAgICAgdmFsdWUucHVzaChpdGVtKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgIHNoYWxsb3dDbGVhckFuZENvcHkoZGF0YSwgdmFsdWUpO1xuICAgICAgICAgICAgICAgICAgdmFsdWUuJHByb21pc2UgPSBwcm9taXNlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgIHZhbHVlLiRyZXNvbHZlZCA9IHRydWU7XG5cbiAgICAgICAgICAgICAgcmVzcG9uc2UucmVzb3VyY2UgPSB2YWx1ZTtcblxuICAgICAgICAgICAgICByZXR1cm4gcmVzcG9uc2U7XG4gICAgICAgICAgICB9LCBmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICAgICAgICAgICB2YWx1ZS4kcmVzb2x2ZWQgPSB0cnVlO1xuXG4gICAgICAgICAgICAgIChlcnJvciB8fCBub29wKShyZXNwb25zZSk7XG5cbiAgICAgICAgICAgICAgcmV0dXJuICRxLnJlamVjdChyZXNwb25zZSk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgcHJvbWlzZSA9IHByb21pc2UudGhlbihcbiAgICAgICAgICAgICAgZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAgICAgICAgICAgICB2YXIgdmFsdWUgPSByZXNwb25zZUludGVyY2VwdG9yKHJlc3BvbnNlKTtcbiAgICAgICAgICAgICAgICAoc3VjY2VzcyB8fCBub29wKSh2YWx1ZSwgcmVzcG9uc2UuaGVhZGVycyk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICByZXNwb25zZUVycm9ySW50ZXJjZXB0b3IpO1xuXG4gICAgICAgICAgICBpZiAoIWlzSW5zdGFuY2VDYWxsKSB7XG4gICAgICAgICAgICAgIC8vIHdlIGFyZSBjcmVhdGluZyBpbnN0YW5jZSAvIGNvbGxlY3Rpb25cbiAgICAgICAgICAgICAgLy8gLSBzZXQgdGhlIGluaXRpYWwgcHJvbWlzZVxuICAgICAgICAgICAgICAvLyAtIHJldHVybiB0aGUgaW5zdGFuY2UgLyBjb2xsZWN0aW9uXG4gICAgICAgICAgICAgIHZhbHVlLiRwcm9taXNlID0gcHJvbWlzZTtcbiAgICAgICAgICAgICAgdmFsdWUuJHJlc29sdmVkID0gZmFsc2U7XG5cbiAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBpbnN0YW5jZSBjYWxsXG4gICAgICAgICAgICByZXR1cm4gcHJvbWlzZTtcbiAgICAgICAgICB9O1xuXG5cbiAgICAgICAgICBSZXNvdXJjZS5wcm90b3R5cGVbJyQnICsgbmFtZV0gPSBmdW5jdGlvbihwYXJhbXMsIHN1Y2Nlc3MsIGVycm9yKSB7XG4gICAgICAgICAgICBpZiAoaXNGdW5jdGlvbihwYXJhbXMpKSB7XG4gICAgICAgICAgICAgIGVycm9yID0gc3VjY2Vzczsgc3VjY2VzcyA9IHBhcmFtczsgcGFyYW1zID0ge307XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgcmVzdWx0ID0gUmVzb3VyY2VbbmFtZV0uY2FsbCh0aGlzLCBwYXJhbXMsIHRoaXMsIHN1Y2Nlc3MsIGVycm9yKTtcbiAgICAgICAgICAgIHJldHVybiByZXN1bHQuJHByb21pc2UgfHwgcmVzdWx0O1xuICAgICAgICAgIH07XG4gICAgICAgIH0pO1xuXG4gICAgICAgIFJlc291cmNlLmJpbmQgPSBmdW5jdGlvbihhZGRpdGlvbmFsUGFyYW1EZWZhdWx0cykge1xuICAgICAgICAgIHJldHVybiByZXNvdXJjZUZhY3RvcnkodXJsLCBleHRlbmQoe30sIHBhcmFtRGVmYXVsdHMsIGFkZGl0aW9uYWxQYXJhbURlZmF1bHRzKSwgYWN0aW9ucyk7XG4gICAgICAgIH07XG5cbiAgICAgICAgcmV0dXJuIFJlc291cmNlO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gcmVzb3VyY2VGYWN0b3J5O1xuICAgIH1dO1xuICB9KTtcblxuXG59KSh3aW5kb3csIHdpbmRvdy5hbmd1bGFyKTtcbiIsIi8qKlxuICogQGxpY2Vuc2UgQW5ndWxhckpTIHYxLjMuMTRcbiAqIChjKSAyMDEwLTIwMTQgR29vZ2xlLCBJbmMuIGh0dHA6Ly9hbmd1bGFyanMub3JnXG4gKiBMaWNlbnNlOiBNSVRcbiAqL1xuKGZ1bmN0aW9uKHdpbmRvdywgYW5ndWxhciwgdW5kZWZpbmVkKSB7J3VzZSBzdHJpY3QnO1xuXG4vKipcbiAqIEBuZ2RvYyBtb2R1bGVcbiAqIEBuYW1lIG5nUm91dGVcbiAqIEBkZXNjcmlwdGlvblxuICpcbiAqICMgbmdSb3V0ZVxuICpcbiAqIFRoZSBgbmdSb3V0ZWAgbW9kdWxlIHByb3ZpZGVzIHJvdXRpbmcgYW5kIGRlZXBsaW5raW5nIHNlcnZpY2VzIGFuZCBkaXJlY3RpdmVzIGZvciBhbmd1bGFyIGFwcHMuXG4gKlxuICogIyMgRXhhbXBsZVxuICogU2VlIHtAbGluayBuZ1JvdXRlLiRyb3V0ZSNleGFtcGxlICRyb3V0ZX0gZm9yIGFuIGV4YW1wbGUgb2YgY29uZmlndXJpbmcgYW5kIHVzaW5nIGBuZ1JvdXRlYC5cbiAqXG4gKlxuICogPGRpdiBkb2MtbW9kdWxlLWNvbXBvbmVudHM9XCJuZ1JvdXRlXCI+PC9kaXY+XG4gKi9cbiAvKiBnbG9iYWwgLW5nUm91dGVNb2R1bGUgKi9cbnZhciBuZ1JvdXRlTW9kdWxlID0gYW5ndWxhci5tb2R1bGUoJ25nUm91dGUnLCBbJ25nJ10pLlxuICAgICAgICAgICAgICAgICAgICAgICAgcHJvdmlkZXIoJyRyb3V0ZScsICRSb3V0ZVByb3ZpZGVyKSxcbiAgICAkcm91dGVNaW5FcnIgPSBhbmd1bGFyLiQkbWluRXJyKCduZ1JvdXRlJyk7XG5cbi8qKlxuICogQG5nZG9jIHByb3ZpZGVyXG4gKiBAbmFtZSAkcm91dGVQcm92aWRlclxuICpcbiAqIEBkZXNjcmlwdGlvblxuICpcbiAqIFVzZWQgZm9yIGNvbmZpZ3VyaW5nIHJvdXRlcy5cbiAqXG4gKiAjIyBFeGFtcGxlXG4gKiBTZWUge0BsaW5rIG5nUm91dGUuJHJvdXRlI2V4YW1wbGUgJHJvdXRlfSBmb3IgYW4gZXhhbXBsZSBvZiBjb25maWd1cmluZyBhbmQgdXNpbmcgYG5nUm91dGVgLlxuICpcbiAqICMjIERlcGVuZGVuY2llc1xuICogUmVxdWlyZXMgdGhlIHtAbGluayBuZ1JvdXRlIGBuZ1JvdXRlYH0gbW9kdWxlIHRvIGJlIGluc3RhbGxlZC5cbiAqL1xuZnVuY3Rpb24gJFJvdXRlUHJvdmlkZXIoKSB7XG4gIGZ1bmN0aW9uIGluaGVyaXQocGFyZW50LCBleHRyYSkge1xuICAgIHJldHVybiBhbmd1bGFyLmV4dGVuZChPYmplY3QuY3JlYXRlKHBhcmVudCksIGV4dHJhKTtcbiAgfVxuXG4gIHZhciByb3V0ZXMgPSB7fTtcblxuICAvKipcbiAgICogQG5nZG9jIG1ldGhvZFxuICAgKiBAbmFtZSAkcm91dGVQcm92aWRlciN3aGVuXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBwYXRoIFJvdXRlIHBhdGggKG1hdGNoZWQgYWdhaW5zdCBgJGxvY2F0aW9uLnBhdGhgKS4gSWYgYCRsb2NhdGlvbi5wYXRoYFxuICAgKiAgICBjb250YWlucyByZWR1bmRhbnQgdHJhaWxpbmcgc2xhc2ggb3IgaXMgbWlzc2luZyBvbmUsIHRoZSByb3V0ZSB3aWxsIHN0aWxsIG1hdGNoIGFuZCB0aGVcbiAgICogICAgYCRsb2NhdGlvbi5wYXRoYCB3aWxsIGJlIHVwZGF0ZWQgdG8gYWRkIG9yIGRyb3AgdGhlIHRyYWlsaW5nIHNsYXNoIHRvIGV4YWN0bHkgbWF0Y2ggdGhlXG4gICAqICAgIHJvdXRlIGRlZmluaXRpb24uXG4gICAqXG4gICAqICAgICogYHBhdGhgIGNhbiBjb250YWluIG5hbWVkIGdyb3VwcyBzdGFydGluZyB3aXRoIGEgY29sb246IGUuZy4gYDpuYW1lYC4gQWxsIGNoYXJhY3RlcnMgdXBcbiAgICogICAgICAgIHRvIHRoZSBuZXh0IHNsYXNoIGFyZSBtYXRjaGVkIGFuZCBzdG9yZWQgaW4gYCRyb3V0ZVBhcmFtc2AgdW5kZXIgdGhlIGdpdmVuIGBuYW1lYFxuICAgKiAgICAgICAgd2hlbiB0aGUgcm91dGUgbWF0Y2hlcy5cbiAgICogICAgKiBgcGF0aGAgY2FuIGNvbnRhaW4gbmFtZWQgZ3JvdXBzIHN0YXJ0aW5nIHdpdGggYSBjb2xvbiBhbmQgZW5kaW5nIHdpdGggYSBzdGFyOlxuICAgKiAgICAgICAgZS5nLmA6bmFtZSpgLiBBbGwgY2hhcmFjdGVycyBhcmUgZWFnZXJseSBzdG9yZWQgaW4gYCRyb3V0ZVBhcmFtc2AgdW5kZXIgdGhlIGdpdmVuIGBuYW1lYFxuICAgKiAgICAgICAgd2hlbiB0aGUgcm91dGUgbWF0Y2hlcy5cbiAgICogICAgKiBgcGF0aGAgY2FuIGNvbnRhaW4gb3B0aW9uYWwgbmFtZWQgZ3JvdXBzIHdpdGggYSBxdWVzdGlvbiBtYXJrOiBlLmcuYDpuYW1lP2AuXG4gICAqXG4gICAqICAgIEZvciBleGFtcGxlLCByb3V0ZXMgbGlrZSBgL2NvbG9yLzpjb2xvci9sYXJnZWNvZGUvOmxhcmdlY29kZSpcXC9lZGl0YCB3aWxsIG1hdGNoXG4gICAqICAgIGAvY29sb3IvYnJvd24vbGFyZ2Vjb2RlL2NvZGUvd2l0aC9zbGFzaGVzL2VkaXRgIGFuZCBleHRyYWN0OlxuICAgKlxuICAgKiAgICAqIGBjb2xvcjogYnJvd25gXG4gICAqICAgICogYGxhcmdlY29kZTogY29kZS93aXRoL3NsYXNoZXNgLlxuICAgKlxuICAgKlxuICAgKiBAcGFyYW0ge09iamVjdH0gcm91dGUgTWFwcGluZyBpbmZvcm1hdGlvbiB0byBiZSBhc3NpZ25lZCB0byBgJHJvdXRlLmN1cnJlbnRgIG9uIHJvdXRlXG4gICAqICAgIG1hdGNoLlxuICAgKlxuICAgKiAgICBPYmplY3QgcHJvcGVydGllczpcbiAgICpcbiAgICogICAgLSBgY29udHJvbGxlcmAg4oCTIGB7KHN0cmluZ3xmdW5jdGlvbigpPX1gIOKAkyBDb250cm9sbGVyIGZuIHRoYXQgc2hvdWxkIGJlIGFzc29jaWF0ZWQgd2l0aFxuICAgKiAgICAgIG5ld2x5IGNyZWF0ZWQgc2NvcGUgb3IgdGhlIG5hbWUgb2YgYSB7QGxpbmsgYW5ndWxhci5Nb2R1bGUjY29udHJvbGxlciByZWdpc3RlcmVkXG4gICAqICAgICAgY29udHJvbGxlcn0gaWYgcGFzc2VkIGFzIGEgc3RyaW5nLlxuICAgKiAgICAtIGBjb250cm9sbGVyQXNgIOKAkyBge3N0cmluZz19YCDigJMgQSBjb250cm9sbGVyIGFsaWFzIG5hbWUuIElmIHByZXNlbnQgdGhlIGNvbnRyb2xsZXIgd2lsbCBiZVxuICAgKiAgICAgIHB1Ymxpc2hlZCB0byBzY29wZSB1bmRlciB0aGUgYGNvbnRyb2xsZXJBc2AgbmFtZS5cbiAgICogICAgLSBgdGVtcGxhdGVgIOKAkyBge3N0cmluZz18ZnVuY3Rpb24oKT19YCDigJMgaHRtbCB0ZW1wbGF0ZSBhcyBhIHN0cmluZyBvciBhIGZ1bmN0aW9uIHRoYXRcbiAgICogICAgICByZXR1cm5zIGFuIGh0bWwgdGVtcGxhdGUgYXMgYSBzdHJpbmcgd2hpY2ggc2hvdWxkIGJlIHVzZWQgYnkge0BsaW5rXG4gICAqICAgICAgbmdSb3V0ZS5kaXJlY3RpdmU6bmdWaWV3IG5nVmlld30gb3Ige0BsaW5rIG5nLmRpcmVjdGl2ZTpuZ0luY2x1ZGUgbmdJbmNsdWRlfSBkaXJlY3RpdmVzLlxuICAgKiAgICAgIFRoaXMgcHJvcGVydHkgdGFrZXMgcHJlY2VkZW5jZSBvdmVyIGB0ZW1wbGF0ZVVybGAuXG4gICAqXG4gICAqICAgICAgSWYgYHRlbXBsYXRlYCBpcyBhIGZ1bmN0aW9uLCBpdCB3aWxsIGJlIGNhbGxlZCB3aXRoIHRoZSBmb2xsb3dpbmcgcGFyYW1ldGVyczpcbiAgICpcbiAgICogICAgICAtIGB7QXJyYXkuPE9iamVjdD59YCAtIHJvdXRlIHBhcmFtZXRlcnMgZXh0cmFjdGVkIGZyb20gdGhlIGN1cnJlbnRcbiAgICogICAgICAgIGAkbG9jYXRpb24ucGF0aCgpYCBieSBhcHBseWluZyB0aGUgY3VycmVudCByb3V0ZVxuICAgKlxuICAgKiAgICAtIGB0ZW1wbGF0ZVVybGAg4oCTIGB7c3RyaW5nPXxmdW5jdGlvbigpPX1gIOKAkyBwYXRoIG9yIGZ1bmN0aW9uIHRoYXQgcmV0dXJucyBhIHBhdGggdG8gYW4gaHRtbFxuICAgKiAgICAgIHRlbXBsYXRlIHRoYXQgc2hvdWxkIGJlIHVzZWQgYnkge0BsaW5rIG5nUm91dGUuZGlyZWN0aXZlOm5nVmlldyBuZ1ZpZXd9LlxuICAgKlxuICAgKiAgICAgIElmIGB0ZW1wbGF0ZVVybGAgaXMgYSBmdW5jdGlvbiwgaXQgd2lsbCBiZSBjYWxsZWQgd2l0aCB0aGUgZm9sbG93aW5nIHBhcmFtZXRlcnM6XG4gICAqXG4gICAqICAgICAgLSBge0FycmF5LjxPYmplY3Q+fWAgLSByb3V0ZSBwYXJhbWV0ZXJzIGV4dHJhY3RlZCBmcm9tIHRoZSBjdXJyZW50XG4gICAqICAgICAgICBgJGxvY2F0aW9uLnBhdGgoKWAgYnkgYXBwbHlpbmcgdGhlIGN1cnJlbnQgcm91dGVcbiAgICpcbiAgICogICAgLSBgcmVzb2x2ZWAgLSBge09iamVjdC48c3RyaW5nLCBmdW5jdGlvbj49fWAgLSBBbiBvcHRpb25hbCBtYXAgb2YgZGVwZW5kZW5jaWVzIHdoaWNoIHNob3VsZFxuICAgKiAgICAgIGJlIGluamVjdGVkIGludG8gdGhlIGNvbnRyb2xsZXIuIElmIGFueSBvZiB0aGVzZSBkZXBlbmRlbmNpZXMgYXJlIHByb21pc2VzLCB0aGUgcm91dGVyXG4gICAqICAgICAgd2lsbCB3YWl0IGZvciB0aGVtIGFsbCB0byBiZSByZXNvbHZlZCBvciBvbmUgdG8gYmUgcmVqZWN0ZWQgYmVmb3JlIHRoZSBjb250cm9sbGVyIGlzXG4gICAqICAgICAgaW5zdGFudGlhdGVkLlxuICAgKiAgICAgIElmIGFsbCB0aGUgcHJvbWlzZXMgYXJlIHJlc29sdmVkIHN1Y2Nlc3NmdWxseSwgdGhlIHZhbHVlcyBvZiB0aGUgcmVzb2x2ZWQgcHJvbWlzZXMgYXJlXG4gICAqICAgICAgaW5qZWN0ZWQgYW5kIHtAbGluayBuZ1JvdXRlLiRyb3V0ZSMkcm91dGVDaGFuZ2VTdWNjZXNzICRyb3V0ZUNoYW5nZVN1Y2Nlc3N9IGV2ZW50IGlzXG4gICAqICAgICAgZmlyZWQuIElmIGFueSBvZiB0aGUgcHJvbWlzZXMgYXJlIHJlamVjdGVkIHRoZVxuICAgKiAgICAgIHtAbGluayBuZ1JvdXRlLiRyb3V0ZSMkcm91dGVDaGFuZ2VFcnJvciAkcm91dGVDaGFuZ2VFcnJvcn0gZXZlbnQgaXMgZmlyZWQuIFRoZSBtYXAgb2JqZWN0XG4gICAqICAgICAgaXM6XG4gICAqXG4gICAqICAgICAgLSBga2V5YCDigJMgYHtzdHJpbmd9YDogYSBuYW1lIG9mIGEgZGVwZW5kZW5jeSB0byBiZSBpbmplY3RlZCBpbnRvIHRoZSBjb250cm9sbGVyLlxuICAgKiAgICAgIC0gYGZhY3RvcnlgIC0gYHtzdHJpbmd8ZnVuY3Rpb259YDogSWYgYHN0cmluZ2AgdGhlbiBpdCBpcyBhbiBhbGlhcyBmb3IgYSBzZXJ2aWNlLlxuICAgKiAgICAgICAgT3RoZXJ3aXNlIGlmIGZ1bmN0aW9uLCB0aGVuIGl0IGlzIHtAbGluayBhdXRvLiRpbmplY3RvciNpbnZva2UgaW5qZWN0ZWR9XG4gICAqICAgICAgICBhbmQgdGhlIHJldHVybiB2YWx1ZSBpcyB0cmVhdGVkIGFzIHRoZSBkZXBlbmRlbmN5LiBJZiB0aGUgcmVzdWx0IGlzIGEgcHJvbWlzZSwgaXQgaXNcbiAgICogICAgICAgIHJlc29sdmVkIGJlZm9yZSBpdHMgdmFsdWUgaXMgaW5qZWN0ZWQgaW50byB0aGUgY29udHJvbGxlci4gQmUgYXdhcmUgdGhhdFxuICAgKiAgICAgICAgYG5nUm91dGUuJHJvdXRlUGFyYW1zYCB3aWxsIHN0aWxsIHJlZmVyIHRvIHRoZSBwcmV2aW91cyByb3V0ZSB3aXRoaW4gdGhlc2UgcmVzb2x2ZVxuICAgKiAgICAgICAgZnVuY3Rpb25zLiAgVXNlIGAkcm91dGUuY3VycmVudC5wYXJhbXNgIHRvIGFjY2VzcyB0aGUgbmV3IHJvdXRlIHBhcmFtZXRlcnMsIGluc3RlYWQuXG4gICAqXG4gICAqICAgIC0gYHJlZGlyZWN0VG9gIOKAkyB7KHN0cmluZ3xmdW5jdGlvbigpKT19IOKAkyB2YWx1ZSB0byB1cGRhdGVcbiAgICogICAgICB7QGxpbmsgbmcuJGxvY2F0aW9uICRsb2NhdGlvbn0gcGF0aCB3aXRoIGFuZCB0cmlnZ2VyIHJvdXRlIHJlZGlyZWN0aW9uLlxuICAgKlxuICAgKiAgICAgIElmIGByZWRpcmVjdFRvYCBpcyBhIGZ1bmN0aW9uLCBpdCB3aWxsIGJlIGNhbGxlZCB3aXRoIHRoZSBmb2xsb3dpbmcgcGFyYW1ldGVyczpcbiAgICpcbiAgICogICAgICAtIGB7T2JqZWN0LjxzdHJpbmc+fWAgLSByb3V0ZSBwYXJhbWV0ZXJzIGV4dHJhY3RlZCBmcm9tIHRoZSBjdXJyZW50XG4gICAqICAgICAgICBgJGxvY2F0aW9uLnBhdGgoKWAgYnkgYXBwbHlpbmcgdGhlIGN1cnJlbnQgcm91dGUgdGVtcGxhdGVVcmwuXG4gICAqICAgICAgLSBge3N0cmluZ31gIC0gY3VycmVudCBgJGxvY2F0aW9uLnBhdGgoKWBcbiAgICogICAgICAtIGB7T2JqZWN0fWAgLSBjdXJyZW50IGAkbG9jYXRpb24uc2VhcmNoKClgXG4gICAqXG4gICAqICAgICAgVGhlIGN1c3RvbSBgcmVkaXJlY3RUb2AgZnVuY3Rpb24gaXMgZXhwZWN0ZWQgdG8gcmV0dXJuIGEgc3RyaW5nIHdoaWNoIHdpbGwgYmUgdXNlZFxuICAgKiAgICAgIHRvIHVwZGF0ZSBgJGxvY2F0aW9uLnBhdGgoKWAgYW5kIGAkbG9jYXRpb24uc2VhcmNoKClgLlxuICAgKlxuICAgKiAgICAtIGBbcmVsb2FkT25TZWFyY2g9dHJ1ZV1gIC0ge2Jvb2xlYW49fSAtIHJlbG9hZCByb3V0ZSB3aGVuIG9ubHkgYCRsb2NhdGlvbi5zZWFyY2goKWBcbiAgICogICAgICBvciBgJGxvY2F0aW9uLmhhc2goKWAgY2hhbmdlcy5cbiAgICpcbiAgICogICAgICBJZiB0aGUgb3B0aW9uIGlzIHNldCB0byBgZmFsc2VgIGFuZCB1cmwgaW4gdGhlIGJyb3dzZXIgY2hhbmdlcywgdGhlblxuICAgKiAgICAgIGAkcm91dGVVcGRhdGVgIGV2ZW50IGlzIGJyb2FkY2FzdGVkIG9uIHRoZSByb290IHNjb3BlLlxuICAgKlxuICAgKiAgICAtIGBbY2FzZUluc2Vuc2l0aXZlTWF0Y2g9ZmFsc2VdYCAtIHtib29sZWFuPX0gLSBtYXRjaCByb3V0ZXMgd2l0aG91dCBiZWluZyBjYXNlIHNlbnNpdGl2ZVxuICAgKlxuICAgKiAgICAgIElmIHRoZSBvcHRpb24gaXMgc2V0IHRvIGB0cnVlYCwgdGhlbiB0aGUgcGFydGljdWxhciByb3V0ZSBjYW4gYmUgbWF0Y2hlZCB3aXRob3V0IGJlaW5nXG4gICAqICAgICAgY2FzZSBzZW5zaXRpdmVcbiAgICpcbiAgICogQHJldHVybnMge09iamVjdH0gc2VsZlxuICAgKlxuICAgKiBAZGVzY3JpcHRpb25cbiAgICogQWRkcyBhIG5ldyByb3V0ZSBkZWZpbml0aW9uIHRvIHRoZSBgJHJvdXRlYCBzZXJ2aWNlLlxuICAgKi9cbiAgdGhpcy53aGVuID0gZnVuY3Rpb24ocGF0aCwgcm91dGUpIHtcbiAgICAvL2NvcHkgb3JpZ2luYWwgcm91dGUgb2JqZWN0IHRvIHByZXNlcnZlIHBhcmFtcyBpbmhlcml0ZWQgZnJvbSBwcm90byBjaGFpblxuICAgIHZhciByb3V0ZUNvcHkgPSBhbmd1bGFyLmNvcHkocm91dGUpO1xuICAgIGlmIChhbmd1bGFyLmlzVW5kZWZpbmVkKHJvdXRlQ29weS5yZWxvYWRPblNlYXJjaCkpIHtcbiAgICAgIHJvdXRlQ29weS5yZWxvYWRPblNlYXJjaCA9IHRydWU7XG4gICAgfVxuICAgIGlmIChhbmd1bGFyLmlzVW5kZWZpbmVkKHJvdXRlQ29weS5jYXNlSW5zZW5zaXRpdmVNYXRjaCkpIHtcbiAgICAgIHJvdXRlQ29weS5jYXNlSW5zZW5zaXRpdmVNYXRjaCA9IHRoaXMuY2FzZUluc2Vuc2l0aXZlTWF0Y2g7XG4gICAgfVxuICAgIHJvdXRlc1twYXRoXSA9IGFuZ3VsYXIuZXh0ZW5kKFxuICAgICAgcm91dGVDb3B5LFxuICAgICAgcGF0aCAmJiBwYXRoUmVnRXhwKHBhdGgsIHJvdXRlQ29weSlcbiAgICApO1xuXG4gICAgLy8gY3JlYXRlIHJlZGlyZWN0aW9uIGZvciB0cmFpbGluZyBzbGFzaGVzXG4gICAgaWYgKHBhdGgpIHtcbiAgICAgIHZhciByZWRpcmVjdFBhdGggPSAocGF0aFtwYXRoLmxlbmd0aCAtIDFdID09ICcvJylcbiAgICAgICAgICAgID8gcGF0aC5zdWJzdHIoMCwgcGF0aC5sZW5ndGggLSAxKVxuICAgICAgICAgICAgOiBwYXRoICsgJy8nO1xuXG4gICAgICByb3V0ZXNbcmVkaXJlY3RQYXRoXSA9IGFuZ3VsYXIuZXh0ZW5kKFxuICAgICAgICB7cmVkaXJlY3RUbzogcGF0aH0sXG4gICAgICAgIHBhdGhSZWdFeHAocmVkaXJlY3RQYXRoLCByb3V0ZUNvcHkpXG4gICAgICApO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzO1xuICB9O1xuXG4gIC8qKlxuICAgKiBAbmdkb2MgcHJvcGVydHlcbiAgICogQG5hbWUgJHJvdXRlUHJvdmlkZXIjY2FzZUluc2Vuc2l0aXZlTWF0Y2hcbiAgICogQGRlc2NyaXB0aW9uXG4gICAqXG4gICAqIEEgYm9vbGVhbiBwcm9wZXJ0eSBpbmRpY2F0aW5nIGlmIHJvdXRlcyBkZWZpbmVkXG4gICAqIHVzaW5nIHRoaXMgcHJvdmlkZXIgc2hvdWxkIGJlIG1hdGNoZWQgdXNpbmcgYSBjYXNlIGluc2Vuc2l0aXZlXG4gICAqIGFsZ29yaXRobS4gRGVmYXVsdHMgdG8gYGZhbHNlYC5cbiAgICovXG4gIHRoaXMuY2FzZUluc2Vuc2l0aXZlTWF0Y2ggPSBmYWxzZTtcblxuICAgLyoqXG4gICAgKiBAcGFyYW0gcGF0aCB7c3RyaW5nfSBwYXRoXG4gICAgKiBAcGFyYW0gb3B0cyB7T2JqZWN0fSBvcHRpb25zXG4gICAgKiBAcmV0dXJuIHs/T2JqZWN0fVxuICAgICpcbiAgICAqIEBkZXNjcmlwdGlvblxuICAgICogTm9ybWFsaXplcyB0aGUgZ2l2ZW4gcGF0aCwgcmV0dXJuaW5nIGEgcmVndWxhciBleHByZXNzaW9uXG4gICAgKiBhbmQgdGhlIG9yaWdpbmFsIHBhdGguXG4gICAgKlxuICAgICogSW5zcGlyZWQgYnkgcGF0aFJleHAgaW4gdmlzaW9ubWVkaWEvZXhwcmVzcy9saWIvdXRpbHMuanMuXG4gICAgKi9cbiAgZnVuY3Rpb24gcGF0aFJlZ0V4cChwYXRoLCBvcHRzKSB7XG4gICAgdmFyIGluc2Vuc2l0aXZlID0gb3B0cy5jYXNlSW5zZW5zaXRpdmVNYXRjaCxcbiAgICAgICAgcmV0ID0ge1xuICAgICAgICAgIG9yaWdpbmFsUGF0aDogcGF0aCxcbiAgICAgICAgICByZWdleHA6IHBhdGhcbiAgICAgICAgfSxcbiAgICAgICAga2V5cyA9IHJldC5rZXlzID0gW107XG5cbiAgICBwYXRoID0gcGF0aFxuICAgICAgLnJlcGxhY2UoLyhbKCkuXSkvZywgJ1xcXFwkMScpXG4gICAgICAucmVwbGFjZSgvKFxcLyk/OihcXHcrKShbXFw/XFwqXSk/L2csIGZ1bmN0aW9uKF8sIHNsYXNoLCBrZXksIG9wdGlvbikge1xuICAgICAgICB2YXIgb3B0aW9uYWwgPSBvcHRpb24gPT09ICc/JyA/IG9wdGlvbiA6IG51bGw7XG4gICAgICAgIHZhciBzdGFyID0gb3B0aW9uID09PSAnKicgPyBvcHRpb24gOiBudWxsO1xuICAgICAgICBrZXlzLnB1c2goeyBuYW1lOiBrZXksIG9wdGlvbmFsOiAhIW9wdGlvbmFsIH0pO1xuICAgICAgICBzbGFzaCA9IHNsYXNoIHx8ICcnO1xuICAgICAgICByZXR1cm4gJydcbiAgICAgICAgICArIChvcHRpb25hbCA/ICcnIDogc2xhc2gpXG4gICAgICAgICAgKyAnKD86J1xuICAgICAgICAgICsgKG9wdGlvbmFsID8gc2xhc2ggOiAnJylcbiAgICAgICAgICArIChzdGFyICYmICcoLis/KScgfHwgJyhbXi9dKyknKVxuICAgICAgICAgICsgKG9wdGlvbmFsIHx8ICcnKVxuICAgICAgICAgICsgJyknXG4gICAgICAgICAgKyAob3B0aW9uYWwgfHwgJycpO1xuICAgICAgfSlcbiAgICAgIC5yZXBsYWNlKC8oW1xcLyRcXCpdKS9nLCAnXFxcXCQxJyk7XG5cbiAgICByZXQucmVnZXhwID0gbmV3IFJlZ0V4cCgnXicgKyBwYXRoICsgJyQnLCBpbnNlbnNpdGl2ZSA/ICdpJyA6ICcnKTtcbiAgICByZXR1cm4gcmV0O1xuICB9XG5cbiAgLyoqXG4gICAqIEBuZ2RvYyBtZXRob2RcbiAgICogQG5hbWUgJHJvdXRlUHJvdmlkZXIjb3RoZXJ3aXNlXG4gICAqXG4gICAqIEBkZXNjcmlwdGlvblxuICAgKiBTZXRzIHJvdXRlIGRlZmluaXRpb24gdGhhdCB3aWxsIGJlIHVzZWQgb24gcm91dGUgY2hhbmdlIHdoZW4gbm8gb3RoZXIgcm91dGUgZGVmaW5pdGlvblxuICAgKiBpcyBtYXRjaGVkLlxuICAgKlxuICAgKiBAcGFyYW0ge09iamVjdHxzdHJpbmd9IHBhcmFtcyBNYXBwaW5nIGluZm9ybWF0aW9uIHRvIGJlIGFzc2lnbmVkIHRvIGAkcm91dGUuY3VycmVudGAuXG4gICAqIElmIGNhbGxlZCB3aXRoIGEgc3RyaW5nLCB0aGUgdmFsdWUgbWFwcyB0byBgcmVkaXJlY3RUb2AuXG4gICAqIEByZXR1cm5zIHtPYmplY3R9IHNlbGZcbiAgICovXG4gIHRoaXMub3RoZXJ3aXNlID0gZnVuY3Rpb24ocGFyYW1zKSB7XG4gICAgaWYgKHR5cGVvZiBwYXJhbXMgPT09ICdzdHJpbmcnKSB7XG4gICAgICBwYXJhbXMgPSB7cmVkaXJlY3RUbzogcGFyYW1zfTtcbiAgICB9XG4gICAgdGhpcy53aGVuKG51bGwsIHBhcmFtcyk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG5cblxuICB0aGlzLiRnZXQgPSBbJyRyb290U2NvcGUnLFxuICAgICAgICAgICAgICAgJyRsb2NhdGlvbicsXG4gICAgICAgICAgICAgICAnJHJvdXRlUGFyYW1zJyxcbiAgICAgICAgICAgICAgICckcScsXG4gICAgICAgICAgICAgICAnJGluamVjdG9yJyxcbiAgICAgICAgICAgICAgICckdGVtcGxhdGVSZXF1ZXN0JyxcbiAgICAgICAgICAgICAgICckc2NlJyxcbiAgICAgIGZ1bmN0aW9uKCRyb290U2NvcGUsICRsb2NhdGlvbiwgJHJvdXRlUGFyYW1zLCAkcSwgJGluamVjdG9yLCAkdGVtcGxhdGVSZXF1ZXN0LCAkc2NlKSB7XG5cbiAgICAvKipcbiAgICAgKiBAbmdkb2Mgc2VydmljZVxuICAgICAqIEBuYW1lICRyb3V0ZVxuICAgICAqIEByZXF1aXJlcyAkbG9jYXRpb25cbiAgICAgKiBAcmVxdWlyZXMgJHJvdXRlUGFyYW1zXG4gICAgICpcbiAgICAgKiBAcHJvcGVydHkge09iamVjdH0gY3VycmVudCBSZWZlcmVuY2UgdG8gdGhlIGN1cnJlbnQgcm91dGUgZGVmaW5pdGlvbi5cbiAgICAgKiBUaGUgcm91dGUgZGVmaW5pdGlvbiBjb250YWluczpcbiAgICAgKlxuICAgICAqICAgLSBgY29udHJvbGxlcmA6IFRoZSBjb250cm9sbGVyIGNvbnN0cnVjdG9yIGFzIGRlZmluZSBpbiByb3V0ZSBkZWZpbml0aW9uLlxuICAgICAqICAgLSBgbG9jYWxzYDogQSBtYXAgb2YgbG9jYWxzIHdoaWNoIGlzIHVzZWQgYnkge0BsaW5rIG5nLiRjb250cm9sbGVyICRjb250cm9sbGVyfSBzZXJ2aWNlIGZvclxuICAgICAqICAgICBjb250cm9sbGVyIGluc3RhbnRpYXRpb24uIFRoZSBgbG9jYWxzYCBjb250YWluXG4gICAgICogICAgIHRoZSByZXNvbHZlZCB2YWx1ZXMgb2YgdGhlIGByZXNvbHZlYCBtYXAuIEFkZGl0aW9uYWxseSB0aGUgYGxvY2Fsc2AgYWxzbyBjb250YWluOlxuICAgICAqXG4gICAgICogICAgIC0gYCRzY29wZWAgLSBUaGUgY3VycmVudCByb3V0ZSBzY29wZS5cbiAgICAgKiAgICAgLSBgJHRlbXBsYXRlYCAtIFRoZSBjdXJyZW50IHJvdXRlIHRlbXBsYXRlIEhUTUwuXG4gICAgICpcbiAgICAgKiBAcHJvcGVydHkge09iamVjdH0gcm91dGVzIE9iamVjdCB3aXRoIGFsbCByb3V0ZSBjb25maWd1cmF0aW9uIE9iamVjdHMgYXMgaXRzIHByb3BlcnRpZXMuXG4gICAgICpcbiAgICAgKiBAZGVzY3JpcHRpb25cbiAgICAgKiBgJHJvdXRlYCBpcyB1c2VkIGZvciBkZWVwLWxpbmtpbmcgVVJMcyB0byBjb250cm9sbGVycyBhbmQgdmlld3MgKEhUTUwgcGFydGlhbHMpLlxuICAgICAqIEl0IHdhdGNoZXMgYCRsb2NhdGlvbi51cmwoKWAgYW5kIHRyaWVzIHRvIG1hcCB0aGUgcGF0aCB0byBhbiBleGlzdGluZyByb3V0ZSBkZWZpbml0aW9uLlxuICAgICAqXG4gICAgICogUmVxdWlyZXMgdGhlIHtAbGluayBuZ1JvdXRlIGBuZ1JvdXRlYH0gbW9kdWxlIHRvIGJlIGluc3RhbGxlZC5cbiAgICAgKlxuICAgICAqIFlvdSBjYW4gZGVmaW5lIHJvdXRlcyB0aHJvdWdoIHtAbGluayBuZ1JvdXRlLiRyb3V0ZVByb3ZpZGVyICRyb3V0ZVByb3ZpZGVyfSdzIEFQSS5cbiAgICAgKlxuICAgICAqIFRoZSBgJHJvdXRlYCBzZXJ2aWNlIGlzIHR5cGljYWxseSB1c2VkIGluIGNvbmp1bmN0aW9uIHdpdGggdGhlXG4gICAgICoge0BsaW5rIG5nUm91dGUuZGlyZWN0aXZlOm5nVmlldyBgbmdWaWV3YH0gZGlyZWN0aXZlIGFuZCB0aGVcbiAgICAgKiB7QGxpbmsgbmdSb3V0ZS4kcm91dGVQYXJhbXMgYCRyb3V0ZVBhcmFtc2B9IHNlcnZpY2UuXG4gICAgICpcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIFRoaXMgZXhhbXBsZSBzaG93cyBob3cgY2hhbmdpbmcgdGhlIFVSTCBoYXNoIGNhdXNlcyB0aGUgYCRyb3V0ZWAgdG8gbWF0Y2ggYSByb3V0ZSBhZ2FpbnN0IHRoZVxuICAgICAqIFVSTCwgYW5kIHRoZSBgbmdWaWV3YCBwdWxscyBpbiB0aGUgcGFydGlhbC5cbiAgICAgKlxuICAgICAqIDxleGFtcGxlIG5hbWU9XCIkcm91dGUtc2VydmljZVwiIG1vZHVsZT1cIm5nUm91dGVFeGFtcGxlXCJcbiAgICAgKiAgICAgICAgICBkZXBzPVwiYW5ndWxhci1yb3V0ZS5qc1wiIGZpeEJhc2U9XCJ0cnVlXCI+XG4gICAgICogICA8ZmlsZSBuYW1lPVwiaW5kZXguaHRtbFwiPlxuICAgICAqICAgICA8ZGl2IG5nLWNvbnRyb2xsZXI9XCJNYWluQ29udHJvbGxlclwiPlxuICAgICAqICAgICAgIENob29zZTpcbiAgICAgKiAgICAgICA8YSBocmVmPVwiQm9vay9Nb2J5XCI+TW9ieTwvYT4gfFxuICAgICAqICAgICAgIDxhIGhyZWY9XCJCb29rL01vYnkvY2gvMVwiPk1vYnk6IENoMTwvYT4gfFxuICAgICAqICAgICAgIDxhIGhyZWY9XCJCb29rL0dhdHNieVwiPkdhdHNieTwvYT4gfFxuICAgICAqICAgICAgIDxhIGhyZWY9XCJCb29rL0dhdHNieS9jaC80P2tleT12YWx1ZVwiPkdhdHNieTogQ2g0PC9hPiB8XG4gICAgICogICAgICAgPGEgaHJlZj1cIkJvb2svU2NhcmxldFwiPlNjYXJsZXQgTGV0dGVyPC9hPjxici8+XG4gICAgICpcbiAgICAgKiAgICAgICA8ZGl2IG5nLXZpZXc+PC9kaXY+XG4gICAgICpcbiAgICAgKiAgICAgICA8aHIgLz5cbiAgICAgKlxuICAgICAqICAgICAgIDxwcmU+JGxvY2F0aW9uLnBhdGgoKSA9IHt7JGxvY2F0aW9uLnBhdGgoKX19PC9wcmU+XG4gICAgICogICAgICAgPHByZT4kcm91dGUuY3VycmVudC50ZW1wbGF0ZVVybCA9IHt7JHJvdXRlLmN1cnJlbnQudGVtcGxhdGVVcmx9fTwvcHJlPlxuICAgICAqICAgICAgIDxwcmU+JHJvdXRlLmN1cnJlbnQucGFyYW1zID0ge3skcm91dGUuY3VycmVudC5wYXJhbXN9fTwvcHJlPlxuICAgICAqICAgICAgIDxwcmU+JHJvdXRlLmN1cnJlbnQuc2NvcGUubmFtZSA9IHt7JHJvdXRlLmN1cnJlbnQuc2NvcGUubmFtZX19PC9wcmU+XG4gICAgICogICAgICAgPHByZT4kcm91dGVQYXJhbXMgPSB7eyRyb3V0ZVBhcmFtc319PC9wcmU+XG4gICAgICogICAgIDwvZGl2PlxuICAgICAqICAgPC9maWxlPlxuICAgICAqXG4gICAgICogICA8ZmlsZSBuYW1lPVwiYm9vay5odG1sXCI+XG4gICAgICogICAgIGNvbnRyb2xsZXI6IHt7bmFtZX19PGJyIC8+XG4gICAgICogICAgIEJvb2sgSWQ6IHt7cGFyYW1zLmJvb2tJZH19PGJyIC8+XG4gICAgICogICA8L2ZpbGU+XG4gICAgICpcbiAgICAgKiAgIDxmaWxlIG5hbWU9XCJjaGFwdGVyLmh0bWxcIj5cbiAgICAgKiAgICAgY29udHJvbGxlcjoge3tuYW1lfX08YnIgLz5cbiAgICAgKiAgICAgQm9vayBJZDoge3twYXJhbXMuYm9va0lkfX08YnIgLz5cbiAgICAgKiAgICAgQ2hhcHRlciBJZDoge3twYXJhbXMuY2hhcHRlcklkfX1cbiAgICAgKiAgIDwvZmlsZT5cbiAgICAgKlxuICAgICAqICAgPGZpbGUgbmFtZT1cInNjcmlwdC5qc1wiPlxuICAgICAqICAgICBhbmd1bGFyLm1vZHVsZSgnbmdSb3V0ZUV4YW1wbGUnLCBbJ25nUm91dGUnXSlcbiAgICAgKlxuICAgICAqICAgICAgLmNvbnRyb2xsZXIoJ01haW5Db250cm9sbGVyJywgZnVuY3Rpb24oJHNjb3BlLCAkcm91dGUsICRyb3V0ZVBhcmFtcywgJGxvY2F0aW9uKSB7XG4gICAgICogICAgICAgICAgJHNjb3BlLiRyb3V0ZSA9ICRyb3V0ZTtcbiAgICAgKiAgICAgICAgICAkc2NvcGUuJGxvY2F0aW9uID0gJGxvY2F0aW9uO1xuICAgICAqICAgICAgICAgICRzY29wZS4kcm91dGVQYXJhbXMgPSAkcm91dGVQYXJhbXM7XG4gICAgICogICAgICB9KVxuICAgICAqXG4gICAgICogICAgICAuY29udHJvbGxlcignQm9va0NvbnRyb2xsZXInLCBmdW5jdGlvbigkc2NvcGUsICRyb3V0ZVBhcmFtcykge1xuICAgICAqICAgICAgICAgICRzY29wZS5uYW1lID0gXCJCb29rQ29udHJvbGxlclwiO1xuICAgICAqICAgICAgICAgICRzY29wZS5wYXJhbXMgPSAkcm91dGVQYXJhbXM7XG4gICAgICogICAgICB9KVxuICAgICAqXG4gICAgICogICAgICAuY29udHJvbGxlcignQ2hhcHRlckNvbnRyb2xsZXInLCBmdW5jdGlvbigkc2NvcGUsICRyb3V0ZVBhcmFtcykge1xuICAgICAqICAgICAgICAgICRzY29wZS5uYW1lID0gXCJDaGFwdGVyQ29udHJvbGxlclwiO1xuICAgICAqICAgICAgICAgICRzY29wZS5wYXJhbXMgPSAkcm91dGVQYXJhbXM7XG4gICAgICogICAgICB9KVxuICAgICAqXG4gICAgICogICAgIC5jb25maWcoZnVuY3Rpb24oJHJvdXRlUHJvdmlkZXIsICRsb2NhdGlvblByb3ZpZGVyKSB7XG4gICAgICogICAgICAgJHJvdXRlUHJvdmlkZXJcbiAgICAgKiAgICAgICAgLndoZW4oJy9Cb29rLzpib29rSWQnLCB7XG4gICAgICogICAgICAgICB0ZW1wbGF0ZVVybDogJ2Jvb2suaHRtbCcsXG4gICAgICogICAgICAgICBjb250cm9sbGVyOiAnQm9va0NvbnRyb2xsZXInLFxuICAgICAqICAgICAgICAgcmVzb2x2ZToge1xuICAgICAqICAgICAgICAgICAvLyBJIHdpbGwgY2F1c2UgYSAxIHNlY29uZCBkZWxheVxuICAgICAqICAgICAgICAgICBkZWxheTogZnVuY3Rpb24oJHEsICR0aW1lb3V0KSB7XG4gICAgICogICAgICAgICAgICAgdmFyIGRlbGF5ID0gJHEuZGVmZXIoKTtcbiAgICAgKiAgICAgICAgICAgICAkdGltZW91dChkZWxheS5yZXNvbHZlLCAxMDAwKTtcbiAgICAgKiAgICAgICAgICAgICByZXR1cm4gZGVsYXkucHJvbWlzZTtcbiAgICAgKiAgICAgICAgICAgfVxuICAgICAqICAgICAgICAgfVxuICAgICAqICAgICAgIH0pXG4gICAgICogICAgICAgLndoZW4oJy9Cb29rLzpib29rSWQvY2gvOmNoYXB0ZXJJZCcsIHtcbiAgICAgKiAgICAgICAgIHRlbXBsYXRlVXJsOiAnY2hhcHRlci5odG1sJyxcbiAgICAgKiAgICAgICAgIGNvbnRyb2xsZXI6ICdDaGFwdGVyQ29udHJvbGxlcidcbiAgICAgKiAgICAgICB9KTtcbiAgICAgKlxuICAgICAqICAgICAgIC8vIGNvbmZpZ3VyZSBodG1sNSB0byBnZXQgbGlua3Mgd29ya2luZyBvbiBqc2ZpZGRsZVxuICAgICAqICAgICAgICRsb2NhdGlvblByb3ZpZGVyLmh0bWw1TW9kZSh0cnVlKTtcbiAgICAgKiAgICAgfSk7XG4gICAgICpcbiAgICAgKiAgIDwvZmlsZT5cbiAgICAgKlxuICAgICAqICAgPGZpbGUgbmFtZT1cInByb3RyYWN0b3IuanNcIiB0eXBlPVwicHJvdHJhY3RvclwiPlxuICAgICAqICAgICBpdCgnc2hvdWxkIGxvYWQgYW5kIGNvbXBpbGUgY29ycmVjdCB0ZW1wbGF0ZScsIGZ1bmN0aW9uKCkge1xuICAgICAqICAgICAgIGVsZW1lbnQoYnkubGlua1RleHQoJ01vYnk6IENoMScpKS5jbGljaygpO1xuICAgICAqICAgICAgIHZhciBjb250ZW50ID0gZWxlbWVudChieS5jc3MoJ1tuZy12aWV3XScpKS5nZXRUZXh0KCk7XG4gICAgICogICAgICAgZXhwZWN0KGNvbnRlbnQpLnRvTWF0Y2goL2NvbnRyb2xsZXJcXDogQ2hhcHRlckNvbnRyb2xsZXIvKTtcbiAgICAgKiAgICAgICBleHBlY3QoY29udGVudCkudG9NYXRjaCgvQm9vayBJZFxcOiBNb2J5Lyk7XG4gICAgICogICAgICAgZXhwZWN0KGNvbnRlbnQpLnRvTWF0Y2goL0NoYXB0ZXIgSWRcXDogMS8pO1xuICAgICAqXG4gICAgICogICAgICAgZWxlbWVudChieS5wYXJ0aWFsTGlua1RleHQoJ1NjYXJsZXQnKSkuY2xpY2soKTtcbiAgICAgKlxuICAgICAqICAgICAgIGNvbnRlbnQgPSBlbGVtZW50KGJ5LmNzcygnW25nLXZpZXddJykpLmdldFRleHQoKTtcbiAgICAgKiAgICAgICBleHBlY3QoY29udGVudCkudG9NYXRjaCgvY29udHJvbGxlclxcOiBCb29rQ29udHJvbGxlci8pO1xuICAgICAqICAgICAgIGV4cGVjdChjb250ZW50KS50b01hdGNoKC9Cb29rIElkXFw6IFNjYXJsZXQvKTtcbiAgICAgKiAgICAgfSk7XG4gICAgICogICA8L2ZpbGU+XG4gICAgICogPC9leGFtcGxlPlxuICAgICAqL1xuXG4gICAgLyoqXG4gICAgICogQG5nZG9jIGV2ZW50XG4gICAgICogQG5hbWUgJHJvdXRlIyRyb3V0ZUNoYW5nZVN0YXJ0XG4gICAgICogQGV2ZW50VHlwZSBicm9hZGNhc3Qgb24gcm9vdCBzY29wZVxuICAgICAqIEBkZXNjcmlwdGlvblxuICAgICAqIEJyb2FkY2FzdGVkIGJlZm9yZSBhIHJvdXRlIGNoYW5nZS4gQXQgdGhpcyAgcG9pbnQgdGhlIHJvdXRlIHNlcnZpY2VzIHN0YXJ0c1xuICAgICAqIHJlc29sdmluZyBhbGwgb2YgdGhlIGRlcGVuZGVuY2llcyBuZWVkZWQgZm9yIHRoZSByb3V0ZSBjaGFuZ2UgdG8gb2NjdXIuXG4gICAgICogVHlwaWNhbGx5IHRoaXMgaW52b2x2ZXMgZmV0Y2hpbmcgdGhlIHZpZXcgdGVtcGxhdGUgYXMgd2VsbCBhcyBhbnkgZGVwZW5kZW5jaWVzXG4gICAgICogZGVmaW5lZCBpbiBgcmVzb2x2ZWAgcm91dGUgcHJvcGVydHkuIE9uY2UgIGFsbCBvZiB0aGUgZGVwZW5kZW5jaWVzIGFyZSByZXNvbHZlZFxuICAgICAqIGAkcm91dGVDaGFuZ2VTdWNjZXNzYCBpcyBmaXJlZC5cbiAgICAgKlxuICAgICAqIFRoZSByb3V0ZSBjaGFuZ2UgKGFuZCB0aGUgYCRsb2NhdGlvbmAgY2hhbmdlIHRoYXQgdHJpZ2dlcmVkIGl0KSBjYW4gYmUgcHJldmVudGVkXG4gICAgICogYnkgY2FsbGluZyBgcHJldmVudERlZmF1bHRgIG1ldGhvZCBvZiB0aGUgZXZlbnQuIFNlZSB7QGxpbmsgbmcuJHJvb3RTY29wZS5TY29wZSMkb259XG4gICAgICogZm9yIG1vcmUgZGV0YWlscyBhYm91dCBldmVudCBvYmplY3QuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gYW5ndWxhckV2ZW50IFN5bnRoZXRpYyBldmVudCBvYmplY3QuXG4gICAgICogQHBhcmFtIHtSb3V0ZX0gbmV4dCBGdXR1cmUgcm91dGUgaW5mb3JtYXRpb24uXG4gICAgICogQHBhcmFtIHtSb3V0ZX0gY3VycmVudCBDdXJyZW50IHJvdXRlIGluZm9ybWF0aW9uLlxuICAgICAqL1xuXG4gICAgLyoqXG4gICAgICogQG5nZG9jIGV2ZW50XG4gICAgICogQG5hbWUgJHJvdXRlIyRyb3V0ZUNoYW5nZVN1Y2Nlc3NcbiAgICAgKiBAZXZlbnRUeXBlIGJyb2FkY2FzdCBvbiByb290IHNjb3BlXG4gICAgICogQGRlc2NyaXB0aW9uXG4gICAgICogQnJvYWRjYXN0ZWQgYWZ0ZXIgYSByb3V0ZSBkZXBlbmRlbmNpZXMgYXJlIHJlc29sdmVkLlxuICAgICAqIHtAbGluayBuZ1JvdXRlLmRpcmVjdGl2ZTpuZ1ZpZXcgbmdWaWV3fSBsaXN0ZW5zIGZvciB0aGUgZGlyZWN0aXZlXG4gICAgICogdG8gaW5zdGFudGlhdGUgdGhlIGNvbnRyb2xsZXIgYW5kIHJlbmRlciB0aGUgdmlldy5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBhbmd1bGFyRXZlbnQgU3ludGhldGljIGV2ZW50IG9iamVjdC5cbiAgICAgKiBAcGFyYW0ge1JvdXRlfSBjdXJyZW50IEN1cnJlbnQgcm91dGUgaW5mb3JtYXRpb24uXG4gICAgICogQHBhcmFtIHtSb3V0ZXxVbmRlZmluZWR9IHByZXZpb3VzIFByZXZpb3VzIHJvdXRlIGluZm9ybWF0aW9uLCBvciB1bmRlZmluZWQgaWYgY3VycmVudCBpc1xuICAgICAqIGZpcnN0IHJvdXRlIGVudGVyZWQuXG4gICAgICovXG5cbiAgICAvKipcbiAgICAgKiBAbmdkb2MgZXZlbnRcbiAgICAgKiBAbmFtZSAkcm91dGUjJHJvdXRlQ2hhbmdlRXJyb3JcbiAgICAgKiBAZXZlbnRUeXBlIGJyb2FkY2FzdCBvbiByb290IHNjb3BlXG4gICAgICogQGRlc2NyaXB0aW9uXG4gICAgICogQnJvYWRjYXN0ZWQgaWYgYW55IG9mIHRoZSByZXNvbHZlIHByb21pc2VzIGFyZSByZWplY3RlZC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBhbmd1bGFyRXZlbnQgU3ludGhldGljIGV2ZW50IG9iamVjdFxuICAgICAqIEBwYXJhbSB7Um91dGV9IGN1cnJlbnQgQ3VycmVudCByb3V0ZSBpbmZvcm1hdGlvbi5cbiAgICAgKiBAcGFyYW0ge1JvdXRlfSBwcmV2aW91cyBQcmV2aW91cyByb3V0ZSBpbmZvcm1hdGlvbi5cbiAgICAgKiBAcGFyYW0ge1JvdXRlfSByZWplY3Rpb24gUmVqZWN0aW9uIG9mIHRoZSBwcm9taXNlLiBVc3VhbGx5IHRoZSBlcnJvciBvZiB0aGUgZmFpbGVkIHByb21pc2UuXG4gICAgICovXG5cbiAgICAvKipcbiAgICAgKiBAbmdkb2MgZXZlbnRcbiAgICAgKiBAbmFtZSAkcm91dGUjJHJvdXRlVXBkYXRlXG4gICAgICogQGV2ZW50VHlwZSBicm9hZGNhc3Qgb24gcm9vdCBzY29wZVxuICAgICAqIEBkZXNjcmlwdGlvblxuICAgICAqXG4gICAgICogVGhlIGByZWxvYWRPblNlYXJjaGAgcHJvcGVydHkgaGFzIGJlZW4gc2V0IHRvIGZhbHNlLCBhbmQgd2UgYXJlIHJldXNpbmcgdGhlIHNhbWVcbiAgICAgKiBpbnN0YW5jZSBvZiB0aGUgQ29udHJvbGxlci5cbiAgICAgKi9cblxuICAgIHZhciBmb3JjZVJlbG9hZCA9IGZhbHNlLFxuICAgICAgICBwcmVwYXJlZFJvdXRlLFxuICAgICAgICBwcmVwYXJlZFJvdXRlSXNVcGRhdGVPbmx5LFxuICAgICAgICAkcm91dGUgPSB7XG4gICAgICAgICAgcm91dGVzOiByb3V0ZXMsXG5cbiAgICAgICAgICAvKipcbiAgICAgICAgICAgKiBAbmdkb2MgbWV0aG9kXG4gICAgICAgICAgICogQG5hbWUgJHJvdXRlI3JlbG9hZFxuICAgICAgICAgICAqXG4gICAgICAgICAgICogQGRlc2NyaXB0aW9uXG4gICAgICAgICAgICogQ2F1c2VzIGAkcm91dGVgIHNlcnZpY2UgdG8gcmVsb2FkIHRoZSBjdXJyZW50IHJvdXRlIGV2ZW4gaWZcbiAgICAgICAgICAgKiB7QGxpbmsgbmcuJGxvY2F0aW9uICRsb2NhdGlvbn0gaGFzbid0IGNoYW5nZWQuXG4gICAgICAgICAgICpcbiAgICAgICAgICAgKiBBcyBhIHJlc3VsdCBvZiB0aGF0LCB7QGxpbmsgbmdSb3V0ZS5kaXJlY3RpdmU6bmdWaWV3IG5nVmlld31cbiAgICAgICAgICAgKiBjcmVhdGVzIG5ldyBzY29wZSBhbmQgcmVpbnN0YW50aWF0ZXMgdGhlIGNvbnRyb2xsZXIuXG4gICAgICAgICAgICovXG4gICAgICAgICAgcmVsb2FkOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGZvcmNlUmVsb2FkID0gdHJ1ZTtcbiAgICAgICAgICAgICRyb290U2NvcGUuJGV2YWxBc3luYyhmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgLy8gRG9uJ3Qgc3VwcG9ydCBjYW5jZWxsYXRpb24gb2YgYSByZWxvYWQgZm9yIG5vdy4uLlxuICAgICAgICAgICAgICBwcmVwYXJlUm91dGUoKTtcbiAgICAgICAgICAgICAgY29tbWl0Um91dGUoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH0sXG5cbiAgICAgICAgICAvKipcbiAgICAgICAgICAgKiBAbmdkb2MgbWV0aG9kXG4gICAgICAgICAgICogQG5hbWUgJHJvdXRlI3VwZGF0ZVBhcmFtc1xuICAgICAgICAgICAqXG4gICAgICAgICAgICogQGRlc2NyaXB0aW9uXG4gICAgICAgICAgICogQ2F1c2VzIGAkcm91dGVgIHNlcnZpY2UgdG8gdXBkYXRlIHRoZSBjdXJyZW50IFVSTCwgcmVwbGFjaW5nXG4gICAgICAgICAgICogY3VycmVudCByb3V0ZSBwYXJhbWV0ZXJzIHdpdGggdGhvc2Ugc3BlY2lmaWVkIGluIGBuZXdQYXJhbXNgLlxuICAgICAgICAgICAqIFByb3ZpZGVkIHByb3BlcnR5IG5hbWVzIHRoYXQgbWF0Y2ggdGhlIHJvdXRlJ3MgcGF0aCBzZWdtZW50XG4gICAgICAgICAgICogZGVmaW5pdGlvbnMgd2lsbCBiZSBpbnRlcnBvbGF0ZWQgaW50byB0aGUgbG9jYXRpb24ncyBwYXRoLCB3aGlsZVxuICAgICAgICAgICAqIHJlbWFpbmluZyBwcm9wZXJ0aWVzIHdpbGwgYmUgdHJlYXRlZCBhcyBxdWVyeSBwYXJhbXMuXG4gICAgICAgICAgICpcbiAgICAgICAgICAgKiBAcGFyYW0geyFPYmplY3Q8c3RyaW5nLCBzdHJpbmc+fSBuZXdQYXJhbXMgbWFwcGluZyBvZiBVUkwgcGFyYW1ldGVyIG5hbWVzIHRvIHZhbHVlc1xuICAgICAgICAgICAqL1xuICAgICAgICAgIHVwZGF0ZVBhcmFtczogZnVuY3Rpb24obmV3UGFyYW1zKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5jdXJyZW50ICYmIHRoaXMuY3VycmVudC4kJHJvdXRlKSB7XG4gICAgICAgICAgICAgIG5ld1BhcmFtcyA9IGFuZ3VsYXIuZXh0ZW5kKHt9LCB0aGlzLmN1cnJlbnQucGFyYW1zLCBuZXdQYXJhbXMpO1xuICAgICAgICAgICAgICAkbG9jYXRpb24ucGF0aChpbnRlcnBvbGF0ZSh0aGlzLmN1cnJlbnQuJCRyb3V0ZS5vcmlnaW5hbFBhdGgsIG5ld1BhcmFtcykpO1xuICAgICAgICAgICAgICAvLyBpbnRlcnBvbGF0ZSBtb2RpZmllcyBuZXdQYXJhbXMsIG9ubHkgcXVlcnkgcGFyYW1zIGFyZSBsZWZ0XG4gICAgICAgICAgICAgICRsb2NhdGlvbi5zZWFyY2gobmV3UGFyYW1zKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHRocm93ICRyb3V0ZU1pbkVycignbm9yb3V0JywgJ1RyaWVkIHVwZGF0aW5nIHJvdXRlIHdoZW4gd2l0aCBubyBjdXJyZW50IHJvdXRlJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgJHJvb3RTY29wZS4kb24oJyRsb2NhdGlvbkNoYW5nZVN0YXJ0JywgcHJlcGFyZVJvdXRlKTtcbiAgICAkcm9vdFNjb3BlLiRvbignJGxvY2F0aW9uQ2hhbmdlU3VjY2VzcycsIGNvbW1pdFJvdXRlKTtcblxuICAgIHJldHVybiAkcm91dGU7XG5cbiAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuXG4gICAgLyoqXG4gICAgICogQHBhcmFtIG9uIHtzdHJpbmd9IGN1cnJlbnQgdXJsXG4gICAgICogQHBhcmFtIHJvdXRlIHtPYmplY3R9IHJvdXRlIHJlZ2V4cCB0byBtYXRjaCB0aGUgdXJsIGFnYWluc3RcbiAgICAgKiBAcmV0dXJuIHs/T2JqZWN0fVxuICAgICAqXG4gICAgICogQGRlc2NyaXB0aW9uXG4gICAgICogQ2hlY2sgaWYgdGhlIHJvdXRlIG1hdGNoZXMgdGhlIGN1cnJlbnQgdXJsLlxuICAgICAqXG4gICAgICogSW5zcGlyZWQgYnkgbWF0Y2ggaW5cbiAgICAgKiB2aXNpb25tZWRpYS9leHByZXNzL2xpYi9yb3V0ZXIvcm91dGVyLmpzLlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIHN3aXRjaFJvdXRlTWF0Y2hlcihvbiwgcm91dGUpIHtcbiAgICAgIHZhciBrZXlzID0gcm91dGUua2V5cyxcbiAgICAgICAgICBwYXJhbXMgPSB7fTtcblxuICAgICAgaWYgKCFyb3V0ZS5yZWdleHApIHJldHVybiBudWxsO1xuXG4gICAgICB2YXIgbSA9IHJvdXRlLnJlZ2V4cC5leGVjKG9uKTtcbiAgICAgIGlmICghbSkgcmV0dXJuIG51bGw7XG5cbiAgICAgIGZvciAodmFyIGkgPSAxLCBsZW4gPSBtLmxlbmd0aDsgaSA8IGxlbjsgKytpKSB7XG4gICAgICAgIHZhciBrZXkgPSBrZXlzW2kgLSAxXTtcblxuICAgICAgICB2YXIgdmFsID0gbVtpXTtcblxuICAgICAgICBpZiAoa2V5ICYmIHZhbCkge1xuICAgICAgICAgIHBhcmFtc1trZXkubmFtZV0gPSB2YWw7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBwYXJhbXM7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcHJlcGFyZVJvdXRlKCRsb2NhdGlvbkV2ZW50KSB7XG4gICAgICB2YXIgbGFzdFJvdXRlID0gJHJvdXRlLmN1cnJlbnQ7XG5cbiAgICAgIHByZXBhcmVkUm91dGUgPSBwYXJzZVJvdXRlKCk7XG4gICAgICBwcmVwYXJlZFJvdXRlSXNVcGRhdGVPbmx5ID0gcHJlcGFyZWRSb3V0ZSAmJiBsYXN0Um91dGUgJiYgcHJlcGFyZWRSb3V0ZS4kJHJvdXRlID09PSBsYXN0Um91dGUuJCRyb3V0ZVxuICAgICAgICAgICYmIGFuZ3VsYXIuZXF1YWxzKHByZXBhcmVkUm91dGUucGF0aFBhcmFtcywgbGFzdFJvdXRlLnBhdGhQYXJhbXMpXG4gICAgICAgICAgJiYgIXByZXBhcmVkUm91dGUucmVsb2FkT25TZWFyY2ggJiYgIWZvcmNlUmVsb2FkO1xuXG4gICAgICBpZiAoIXByZXBhcmVkUm91dGVJc1VwZGF0ZU9ubHkgJiYgKGxhc3RSb3V0ZSB8fCBwcmVwYXJlZFJvdXRlKSkge1xuICAgICAgICBpZiAoJHJvb3RTY29wZS4kYnJvYWRjYXN0KCckcm91dGVDaGFuZ2VTdGFydCcsIHByZXBhcmVkUm91dGUsIGxhc3RSb3V0ZSkuZGVmYXVsdFByZXZlbnRlZCkge1xuICAgICAgICAgIGlmICgkbG9jYXRpb25FdmVudCkge1xuICAgICAgICAgICAgJGxvY2F0aW9uRXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBjb21taXRSb3V0ZSgpIHtcbiAgICAgIHZhciBsYXN0Um91dGUgPSAkcm91dGUuY3VycmVudDtcbiAgICAgIHZhciBuZXh0Um91dGUgPSBwcmVwYXJlZFJvdXRlO1xuXG4gICAgICBpZiAocHJlcGFyZWRSb3V0ZUlzVXBkYXRlT25seSkge1xuICAgICAgICBsYXN0Um91dGUucGFyYW1zID0gbmV4dFJvdXRlLnBhcmFtcztcbiAgICAgICAgYW5ndWxhci5jb3B5KGxhc3RSb3V0ZS5wYXJhbXMsICRyb3V0ZVBhcmFtcyk7XG4gICAgICAgICRyb290U2NvcGUuJGJyb2FkY2FzdCgnJHJvdXRlVXBkYXRlJywgbGFzdFJvdXRlKTtcbiAgICAgIH0gZWxzZSBpZiAobmV4dFJvdXRlIHx8IGxhc3RSb3V0ZSkge1xuICAgICAgICBmb3JjZVJlbG9hZCA9IGZhbHNlO1xuICAgICAgICAkcm91dGUuY3VycmVudCA9IG5leHRSb3V0ZTtcbiAgICAgICAgaWYgKG5leHRSb3V0ZSkge1xuICAgICAgICAgIGlmIChuZXh0Um91dGUucmVkaXJlY3RUbykge1xuICAgICAgICAgICAgaWYgKGFuZ3VsYXIuaXNTdHJpbmcobmV4dFJvdXRlLnJlZGlyZWN0VG8pKSB7XG4gICAgICAgICAgICAgICRsb2NhdGlvbi5wYXRoKGludGVycG9sYXRlKG5leHRSb3V0ZS5yZWRpcmVjdFRvLCBuZXh0Um91dGUucGFyYW1zKSkuc2VhcmNoKG5leHRSb3V0ZS5wYXJhbXMpXG4gICAgICAgICAgICAgICAgICAgICAgIC5yZXBsYWNlKCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAkbG9jYXRpb24udXJsKG5leHRSb3V0ZS5yZWRpcmVjdFRvKG5leHRSb3V0ZS5wYXRoUGFyYW1zLCAkbG9jYXRpb24ucGF0aCgpLCAkbG9jYXRpb24uc2VhcmNoKCkpKVxuICAgICAgICAgICAgICAgICAgICAgICAucmVwbGFjZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgICRxLndoZW4obmV4dFJvdXRlKS5cbiAgICAgICAgICB0aGVuKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgaWYgKG5leHRSb3V0ZSkge1xuICAgICAgICAgICAgICB2YXIgbG9jYWxzID0gYW5ndWxhci5leHRlbmQoe30sIG5leHRSb3V0ZS5yZXNvbHZlKSxcbiAgICAgICAgICAgICAgICAgIHRlbXBsYXRlLCB0ZW1wbGF0ZVVybDtcblxuICAgICAgICAgICAgICBhbmd1bGFyLmZvckVhY2gobG9jYWxzLCBmdW5jdGlvbih2YWx1ZSwga2V5KSB7XG4gICAgICAgICAgICAgICAgbG9jYWxzW2tleV0gPSBhbmd1bGFyLmlzU3RyaW5nKHZhbHVlKSA/XG4gICAgICAgICAgICAgICAgICAgICRpbmplY3Rvci5nZXQodmFsdWUpIDogJGluamVjdG9yLmludm9rZSh2YWx1ZSwgbnVsbCwgbnVsbCwga2V5KTtcbiAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgaWYgKGFuZ3VsYXIuaXNEZWZpbmVkKHRlbXBsYXRlID0gbmV4dFJvdXRlLnRlbXBsYXRlKSkge1xuICAgICAgICAgICAgICAgIGlmIChhbmd1bGFyLmlzRnVuY3Rpb24odGVtcGxhdGUpKSB7XG4gICAgICAgICAgICAgICAgICB0ZW1wbGF0ZSA9IHRlbXBsYXRlKG5leHRSb3V0ZS5wYXJhbXMpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfSBlbHNlIGlmIChhbmd1bGFyLmlzRGVmaW5lZCh0ZW1wbGF0ZVVybCA9IG5leHRSb3V0ZS50ZW1wbGF0ZVVybCkpIHtcbiAgICAgICAgICAgICAgICBpZiAoYW5ndWxhci5pc0Z1bmN0aW9uKHRlbXBsYXRlVXJsKSkge1xuICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmwgPSB0ZW1wbGF0ZVVybChuZXh0Um91dGUucGFyYW1zKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmwgPSAkc2NlLmdldFRydXN0ZWRSZXNvdXJjZVVybCh0ZW1wbGF0ZVVybCk7XG4gICAgICAgICAgICAgICAgaWYgKGFuZ3VsYXIuaXNEZWZpbmVkKHRlbXBsYXRlVXJsKSkge1xuICAgICAgICAgICAgICAgICAgbmV4dFJvdXRlLmxvYWRlZFRlbXBsYXRlVXJsID0gdGVtcGxhdGVVcmw7XG4gICAgICAgICAgICAgICAgICB0ZW1wbGF0ZSA9ICR0ZW1wbGF0ZVJlcXVlc3QodGVtcGxhdGVVcmwpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBpZiAoYW5ndWxhci5pc0RlZmluZWQodGVtcGxhdGUpKSB7XG4gICAgICAgICAgICAgICAgbG9jYWxzWyckdGVtcGxhdGUnXSA9IHRlbXBsYXRlO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIHJldHVybiAkcS5hbGwobG9jYWxzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KS5cbiAgICAgICAgICAvLyBhZnRlciByb3V0ZSBjaGFuZ2VcbiAgICAgICAgICB0aGVuKGZ1bmN0aW9uKGxvY2Fscykge1xuICAgICAgICAgICAgaWYgKG5leHRSb3V0ZSA9PSAkcm91dGUuY3VycmVudCkge1xuICAgICAgICAgICAgICBpZiAobmV4dFJvdXRlKSB7XG4gICAgICAgICAgICAgICAgbmV4dFJvdXRlLmxvY2FscyA9IGxvY2FscztcbiAgICAgICAgICAgICAgICBhbmd1bGFyLmNvcHkobmV4dFJvdXRlLnBhcmFtcywgJHJvdXRlUGFyYW1zKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAkcm9vdFNjb3BlLiRicm9hZGNhc3QoJyRyb3V0ZUNoYW5nZVN1Y2Nlc3MnLCBuZXh0Um91dGUsIGxhc3RSb3V0ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSwgZnVuY3Rpb24oZXJyb3IpIHtcbiAgICAgICAgICAgIGlmIChuZXh0Um91dGUgPT0gJHJvdXRlLmN1cnJlbnQpIHtcbiAgICAgICAgICAgICAgJHJvb3RTY29wZS4kYnJvYWRjYXN0KCckcm91dGVDaGFuZ2VFcnJvcicsIG5leHRSb3V0ZSwgbGFzdFJvdXRlLCBlcnJvcik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuXG5cbiAgICAvKipcbiAgICAgKiBAcmV0dXJucyB7T2JqZWN0fSB0aGUgY3VycmVudCBhY3RpdmUgcm91dGUsIGJ5IG1hdGNoaW5nIGl0IGFnYWluc3QgdGhlIFVSTFxuICAgICAqL1xuICAgIGZ1bmN0aW9uIHBhcnNlUm91dGUoKSB7XG4gICAgICAvLyBNYXRjaCBhIHJvdXRlXG4gICAgICB2YXIgcGFyYW1zLCBtYXRjaDtcbiAgICAgIGFuZ3VsYXIuZm9yRWFjaChyb3V0ZXMsIGZ1bmN0aW9uKHJvdXRlLCBwYXRoKSB7XG4gICAgICAgIGlmICghbWF0Y2ggJiYgKHBhcmFtcyA9IHN3aXRjaFJvdXRlTWF0Y2hlcigkbG9jYXRpb24ucGF0aCgpLCByb3V0ZSkpKSB7XG4gICAgICAgICAgbWF0Y2ggPSBpbmhlcml0KHJvdXRlLCB7XG4gICAgICAgICAgICBwYXJhbXM6IGFuZ3VsYXIuZXh0ZW5kKHt9LCAkbG9jYXRpb24uc2VhcmNoKCksIHBhcmFtcyksXG4gICAgICAgICAgICBwYXRoUGFyYW1zOiBwYXJhbXN9KTtcbiAgICAgICAgICBtYXRjaC4kJHJvdXRlID0gcm91dGU7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgLy8gTm8gcm91dGUgbWF0Y2hlZDsgZmFsbGJhY2sgdG8gXCJvdGhlcndpc2VcIiByb3V0ZVxuICAgICAgcmV0dXJuIG1hdGNoIHx8IHJvdXRlc1tudWxsXSAmJiBpbmhlcml0KHJvdXRlc1tudWxsXSwge3BhcmFtczoge30sIHBhdGhQYXJhbXM6e319KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAcmV0dXJucyB7c3RyaW5nfSBpbnRlcnBvbGF0aW9uIG9mIHRoZSByZWRpcmVjdCBwYXRoIHdpdGggdGhlIHBhcmFtZXRlcnNcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBpbnRlcnBvbGF0ZShzdHJpbmcsIHBhcmFtcykge1xuICAgICAgdmFyIHJlc3VsdCA9IFtdO1xuICAgICAgYW5ndWxhci5mb3JFYWNoKChzdHJpbmcgfHwgJycpLnNwbGl0KCc6JyksIGZ1bmN0aW9uKHNlZ21lbnQsIGkpIHtcbiAgICAgICAgaWYgKGkgPT09IDApIHtcbiAgICAgICAgICByZXN1bHQucHVzaChzZWdtZW50KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB2YXIgc2VnbWVudE1hdGNoID0gc2VnbWVudC5tYXRjaCgvKFxcdyspKD86Wz8qXSk/KC4qKS8pO1xuICAgICAgICAgIHZhciBrZXkgPSBzZWdtZW50TWF0Y2hbMV07XG4gICAgICAgICAgcmVzdWx0LnB1c2gocGFyYW1zW2tleV0pO1xuICAgICAgICAgIHJlc3VsdC5wdXNoKHNlZ21lbnRNYXRjaFsyXSB8fCAnJyk7XG4gICAgICAgICAgZGVsZXRlIHBhcmFtc1trZXldO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIHJldHVybiByZXN1bHQuam9pbignJyk7XG4gICAgfVxuICB9XTtcbn1cblxubmdSb3V0ZU1vZHVsZS5wcm92aWRlcignJHJvdXRlUGFyYW1zJywgJFJvdXRlUGFyYW1zUHJvdmlkZXIpO1xuXG5cbi8qKlxuICogQG5nZG9jIHNlcnZpY2VcbiAqIEBuYW1lICRyb3V0ZVBhcmFtc1xuICogQHJlcXVpcmVzICRyb3V0ZVxuICpcbiAqIEBkZXNjcmlwdGlvblxuICogVGhlIGAkcm91dGVQYXJhbXNgIHNlcnZpY2UgYWxsb3dzIHlvdSB0byByZXRyaWV2ZSB0aGUgY3VycmVudCBzZXQgb2Ygcm91dGUgcGFyYW1ldGVycy5cbiAqXG4gKiBSZXF1aXJlcyB0aGUge0BsaW5rIG5nUm91dGUgYG5nUm91dGVgfSBtb2R1bGUgdG8gYmUgaW5zdGFsbGVkLlxuICpcbiAqIFRoZSByb3V0ZSBwYXJhbWV0ZXJzIGFyZSBhIGNvbWJpbmF0aW9uIG9mIHtAbGluayBuZy4kbG9jYXRpb24gYCRsb2NhdGlvbmB9J3NcbiAqIHtAbGluayBuZy4kbG9jYXRpb24jc2VhcmNoIGBzZWFyY2goKWB9IGFuZCB7QGxpbmsgbmcuJGxvY2F0aW9uI3BhdGggYHBhdGgoKWB9LlxuICogVGhlIGBwYXRoYCBwYXJhbWV0ZXJzIGFyZSBleHRyYWN0ZWQgd2hlbiB0aGUge0BsaW5rIG5nUm91dGUuJHJvdXRlIGAkcm91dGVgfSBwYXRoIGlzIG1hdGNoZWQuXG4gKlxuICogSW4gY2FzZSBvZiBwYXJhbWV0ZXIgbmFtZSBjb2xsaXNpb24sIGBwYXRoYCBwYXJhbXMgdGFrZSBwcmVjZWRlbmNlIG92ZXIgYHNlYXJjaGAgcGFyYW1zLlxuICpcbiAqIFRoZSBzZXJ2aWNlIGd1YXJhbnRlZXMgdGhhdCB0aGUgaWRlbnRpdHkgb2YgdGhlIGAkcm91dGVQYXJhbXNgIG9iamVjdCB3aWxsIHJlbWFpbiB1bmNoYW5nZWRcbiAqIChidXQgaXRzIHByb3BlcnRpZXMgd2lsbCBsaWtlbHkgY2hhbmdlKSBldmVuIHdoZW4gYSByb3V0ZSBjaGFuZ2Ugb2NjdXJzLlxuICpcbiAqIE5vdGUgdGhhdCB0aGUgYCRyb3V0ZVBhcmFtc2AgYXJlIG9ubHkgdXBkYXRlZCAqYWZ0ZXIqIGEgcm91dGUgY2hhbmdlIGNvbXBsZXRlcyBzdWNjZXNzZnVsbHkuXG4gKiBUaGlzIG1lYW5zIHRoYXQgeW91IGNhbm5vdCByZWx5IG9uIGAkcm91dGVQYXJhbXNgIGJlaW5nIGNvcnJlY3QgaW4gcm91dGUgcmVzb2x2ZSBmdW5jdGlvbnMuXG4gKiBJbnN0ZWFkIHlvdSBjYW4gdXNlIGAkcm91dGUuY3VycmVudC5wYXJhbXNgIHRvIGFjY2VzcyB0aGUgbmV3IHJvdXRlJ3MgcGFyYW1ldGVycy5cbiAqXG4gKiBAZXhhbXBsZVxuICogYGBganNcbiAqICAvLyBHaXZlbjpcbiAqICAvLyBVUkw6IGh0dHA6Ly9zZXJ2ZXIuY29tL2luZGV4Lmh0bWwjL0NoYXB0ZXIvMS9TZWN0aW9uLzI/c2VhcmNoPW1vYnlcbiAqICAvLyBSb3V0ZTogL0NoYXB0ZXIvOmNoYXB0ZXJJZC9TZWN0aW9uLzpzZWN0aW9uSWRcbiAqICAvL1xuICogIC8vIFRoZW5cbiAqICAkcm91dGVQYXJhbXMgPT0+IHtjaGFwdGVySWQ6JzEnLCBzZWN0aW9uSWQ6JzInLCBzZWFyY2g6J21vYnknfVxuICogYGBgXG4gKi9cbmZ1bmN0aW9uICRSb3V0ZVBhcmFtc1Byb3ZpZGVyKCkge1xuICB0aGlzLiRnZXQgPSBmdW5jdGlvbigpIHsgcmV0dXJuIHt9OyB9O1xufVxuXG5uZ1JvdXRlTW9kdWxlLmRpcmVjdGl2ZSgnbmdWaWV3JywgbmdWaWV3RmFjdG9yeSk7XG5uZ1JvdXRlTW9kdWxlLmRpcmVjdGl2ZSgnbmdWaWV3JywgbmdWaWV3RmlsbENvbnRlbnRGYWN0b3J5KTtcblxuXG4vKipcbiAqIEBuZ2RvYyBkaXJlY3RpdmVcbiAqIEBuYW1lIG5nVmlld1xuICogQHJlc3RyaWN0IEVDQVxuICpcbiAqIEBkZXNjcmlwdGlvblxuICogIyBPdmVydmlld1xuICogYG5nVmlld2AgaXMgYSBkaXJlY3RpdmUgdGhhdCBjb21wbGVtZW50cyB0aGUge0BsaW5rIG5nUm91dGUuJHJvdXRlICRyb3V0ZX0gc2VydmljZSBieVxuICogaW5jbHVkaW5nIHRoZSByZW5kZXJlZCB0ZW1wbGF0ZSBvZiB0aGUgY3VycmVudCByb3V0ZSBpbnRvIHRoZSBtYWluIGxheW91dCAoYGluZGV4Lmh0bWxgKSBmaWxlLlxuICogRXZlcnkgdGltZSB0aGUgY3VycmVudCByb3V0ZSBjaGFuZ2VzLCB0aGUgaW5jbHVkZWQgdmlldyBjaGFuZ2VzIHdpdGggaXQgYWNjb3JkaW5nIHRvIHRoZVxuICogY29uZmlndXJhdGlvbiBvZiB0aGUgYCRyb3V0ZWAgc2VydmljZS5cbiAqXG4gKiBSZXF1aXJlcyB0aGUge0BsaW5rIG5nUm91dGUgYG5nUm91dGVgfSBtb2R1bGUgdG8gYmUgaW5zdGFsbGVkLlxuICpcbiAqIEBhbmltYXRpb25zXG4gKiBlbnRlciAtIGFuaW1hdGlvbiBpcyB1c2VkIHRvIGJyaW5nIG5ldyBjb250ZW50IGludG8gdGhlIGJyb3dzZXIuXG4gKiBsZWF2ZSAtIGFuaW1hdGlvbiBpcyB1c2VkIHRvIGFuaW1hdGUgZXhpc3RpbmcgY29udGVudCBhd2F5LlxuICpcbiAqIFRoZSBlbnRlciBhbmQgbGVhdmUgYW5pbWF0aW9uIG9jY3VyIGNvbmN1cnJlbnRseS5cbiAqXG4gKiBAc2NvcGVcbiAqIEBwcmlvcml0eSA0MDBcbiAqIEBwYXJhbSB7c3RyaW5nPX0gb25sb2FkIEV4cHJlc3Npb24gdG8gZXZhbHVhdGUgd2hlbmV2ZXIgdGhlIHZpZXcgdXBkYXRlcy5cbiAqXG4gKiBAcGFyYW0ge3N0cmluZz19IGF1dG9zY3JvbGwgV2hldGhlciBgbmdWaWV3YCBzaG91bGQgY2FsbCB7QGxpbmsgbmcuJGFuY2hvclNjcm9sbFxuICogICAgICAgICAgICAgICAgICAkYW5jaG9yU2Nyb2xsfSB0byBzY3JvbGwgdGhlIHZpZXdwb3J0IGFmdGVyIHRoZSB2aWV3IGlzIHVwZGF0ZWQuXG4gKlxuICogICAgICAgICAgICAgICAgICAtIElmIHRoZSBhdHRyaWJ1dGUgaXMgbm90IHNldCwgZGlzYWJsZSBzY3JvbGxpbmcuXG4gKiAgICAgICAgICAgICAgICAgIC0gSWYgdGhlIGF0dHJpYnV0ZSBpcyBzZXQgd2l0aG91dCB2YWx1ZSwgZW5hYmxlIHNjcm9sbGluZy5cbiAqICAgICAgICAgICAgICAgICAgLSBPdGhlcndpc2UgZW5hYmxlIHNjcm9sbGluZyBvbmx5IGlmIHRoZSBgYXV0b3Njcm9sbGAgYXR0cmlidXRlIHZhbHVlIGV2YWx1YXRlZFxuICogICAgICAgICAgICAgICAgICAgIGFzIGFuIGV4cHJlc3Npb24geWllbGRzIGEgdHJ1dGh5IHZhbHVlLlxuICogQGV4YW1wbGVcbiAgICA8ZXhhbXBsZSBuYW1lPVwibmdWaWV3LWRpcmVjdGl2ZVwiIG1vZHVsZT1cIm5nVmlld0V4YW1wbGVcIlxuICAgICAgICAgICAgIGRlcHM9XCJhbmd1bGFyLXJvdXRlLmpzO2FuZ3VsYXItYW5pbWF0ZS5qc1wiXG4gICAgICAgICAgICAgYW5pbWF0aW9ucz1cInRydWVcIiBmaXhCYXNlPVwidHJ1ZVwiPlxuICAgICAgPGZpbGUgbmFtZT1cImluZGV4Lmh0bWxcIj5cbiAgICAgICAgPGRpdiBuZy1jb250cm9sbGVyPVwiTWFpbkN0cmwgYXMgbWFpblwiPlxuICAgICAgICAgIENob29zZTpcbiAgICAgICAgICA8YSBocmVmPVwiQm9vay9Nb2J5XCI+TW9ieTwvYT4gfFxuICAgICAgICAgIDxhIGhyZWY9XCJCb29rL01vYnkvY2gvMVwiPk1vYnk6IENoMTwvYT4gfFxuICAgICAgICAgIDxhIGhyZWY9XCJCb29rL0dhdHNieVwiPkdhdHNieTwvYT4gfFxuICAgICAgICAgIDxhIGhyZWY9XCJCb29rL0dhdHNieS9jaC80P2tleT12YWx1ZVwiPkdhdHNieTogQ2g0PC9hPiB8XG4gICAgICAgICAgPGEgaHJlZj1cIkJvb2svU2NhcmxldFwiPlNjYXJsZXQgTGV0dGVyPC9hPjxici8+XG5cbiAgICAgICAgICA8ZGl2IGNsYXNzPVwidmlldy1hbmltYXRlLWNvbnRhaW5lclwiPlxuICAgICAgICAgICAgPGRpdiBuZy12aWV3IGNsYXNzPVwidmlldy1hbmltYXRlXCI+PC9kaXY+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPGhyIC8+XG5cbiAgICAgICAgICA8cHJlPiRsb2NhdGlvbi5wYXRoKCkgPSB7e21haW4uJGxvY2F0aW9uLnBhdGgoKX19PC9wcmU+XG4gICAgICAgICAgPHByZT4kcm91dGUuY3VycmVudC50ZW1wbGF0ZVVybCA9IHt7bWFpbi4kcm91dGUuY3VycmVudC50ZW1wbGF0ZVVybH19PC9wcmU+XG4gICAgICAgICAgPHByZT4kcm91dGUuY3VycmVudC5wYXJhbXMgPSB7e21haW4uJHJvdXRlLmN1cnJlbnQucGFyYW1zfX08L3ByZT5cbiAgICAgICAgICA8cHJlPiRyb3V0ZVBhcmFtcyA9IHt7bWFpbi4kcm91dGVQYXJhbXN9fTwvcHJlPlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZmlsZT5cblxuICAgICAgPGZpbGUgbmFtZT1cImJvb2suaHRtbFwiPlxuICAgICAgICA8ZGl2PlxuICAgICAgICAgIGNvbnRyb2xsZXI6IHt7Ym9vay5uYW1lfX08YnIgLz5cbiAgICAgICAgICBCb29rIElkOiB7e2Jvb2sucGFyYW1zLmJvb2tJZH19PGJyIC8+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9maWxlPlxuXG4gICAgICA8ZmlsZSBuYW1lPVwiY2hhcHRlci5odG1sXCI+XG4gICAgICAgIDxkaXY+XG4gICAgICAgICAgY29udHJvbGxlcjoge3tjaGFwdGVyLm5hbWV9fTxiciAvPlxuICAgICAgICAgIEJvb2sgSWQ6IHt7Y2hhcHRlci5wYXJhbXMuYm9va0lkfX08YnIgLz5cbiAgICAgICAgICBDaGFwdGVyIElkOiB7e2NoYXB0ZXIucGFyYW1zLmNoYXB0ZXJJZH19XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9maWxlPlxuXG4gICAgICA8ZmlsZSBuYW1lPVwiYW5pbWF0aW9ucy5jc3NcIj5cbiAgICAgICAgLnZpZXctYW5pbWF0ZS1jb250YWluZXIge1xuICAgICAgICAgIHBvc2l0aW9uOnJlbGF0aXZlO1xuICAgICAgICAgIGhlaWdodDoxMDBweCFpbXBvcnRhbnQ7XG4gICAgICAgICAgYmFja2dyb3VuZDp3aGl0ZTtcbiAgICAgICAgICBib3JkZXI6MXB4IHNvbGlkIGJsYWNrO1xuICAgICAgICAgIGhlaWdodDo0MHB4O1xuICAgICAgICAgIG92ZXJmbG93OmhpZGRlbjtcbiAgICAgICAgfVxuXG4gICAgICAgIC52aWV3LWFuaW1hdGUge1xuICAgICAgICAgIHBhZGRpbmc6MTBweDtcbiAgICAgICAgfVxuXG4gICAgICAgIC52aWV3LWFuaW1hdGUubmctZW50ZXIsIC52aWV3LWFuaW1hdGUubmctbGVhdmUge1xuICAgICAgICAgIC13ZWJraXQtdHJhbnNpdGlvbjphbGwgY3ViaWMtYmV6aWVyKDAuMjUwLCAwLjQ2MCwgMC40NTAsIDAuOTQwKSAxLjVzO1xuICAgICAgICAgIHRyYW5zaXRpb246YWxsIGN1YmljLWJlemllcigwLjI1MCwgMC40NjAsIDAuNDUwLCAwLjk0MCkgMS41cztcblxuICAgICAgICAgIGRpc3BsYXk6YmxvY2s7XG4gICAgICAgICAgd2lkdGg6MTAwJTtcbiAgICAgICAgICBib3JkZXItbGVmdDoxcHggc29saWQgYmxhY2s7XG5cbiAgICAgICAgICBwb3NpdGlvbjphYnNvbHV0ZTtcbiAgICAgICAgICB0b3A6MDtcbiAgICAgICAgICBsZWZ0OjA7XG4gICAgICAgICAgcmlnaHQ6MDtcbiAgICAgICAgICBib3R0b206MDtcbiAgICAgICAgICBwYWRkaW5nOjEwcHg7XG4gICAgICAgIH1cblxuICAgICAgICAudmlldy1hbmltYXRlLm5nLWVudGVyIHtcbiAgICAgICAgICBsZWZ0OjEwMCU7XG4gICAgICAgIH1cbiAgICAgICAgLnZpZXctYW5pbWF0ZS5uZy1lbnRlci5uZy1lbnRlci1hY3RpdmUge1xuICAgICAgICAgIGxlZnQ6MDtcbiAgICAgICAgfVxuICAgICAgICAudmlldy1hbmltYXRlLm5nLWxlYXZlLm5nLWxlYXZlLWFjdGl2ZSB7XG4gICAgICAgICAgbGVmdDotMTAwJTtcbiAgICAgICAgfVxuICAgICAgPC9maWxlPlxuXG4gICAgICA8ZmlsZSBuYW1lPVwic2NyaXB0LmpzXCI+XG4gICAgICAgIGFuZ3VsYXIubW9kdWxlKCduZ1ZpZXdFeGFtcGxlJywgWyduZ1JvdXRlJywgJ25nQW5pbWF0ZSddKVxuICAgICAgICAgIC5jb25maWcoWyckcm91dGVQcm92aWRlcicsICckbG9jYXRpb25Qcm92aWRlcicsXG4gICAgICAgICAgICBmdW5jdGlvbigkcm91dGVQcm92aWRlciwgJGxvY2F0aW9uUHJvdmlkZXIpIHtcbiAgICAgICAgICAgICAgJHJvdXRlUHJvdmlkZXJcbiAgICAgICAgICAgICAgICAud2hlbignL0Jvb2svOmJvb2tJZCcsIHtcbiAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnYm9vay5odG1sJyxcbiAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdCb29rQ3RybCcsXG4gICAgICAgICAgICAgICAgICBjb250cm9sbGVyQXM6ICdib29rJ1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLndoZW4oJy9Cb29rLzpib29rSWQvY2gvOmNoYXB0ZXJJZCcsIHtcbiAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnY2hhcHRlci5odG1sJyxcbiAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdDaGFwdGVyQ3RybCcsXG4gICAgICAgICAgICAgICAgICBjb250cm9sbGVyQXM6ICdjaGFwdGVyJ1xuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICRsb2NhdGlvblByb3ZpZGVyLmh0bWw1TW9kZSh0cnVlKTtcbiAgICAgICAgICB9XSlcbiAgICAgICAgICAuY29udHJvbGxlcignTWFpbkN0cmwnLCBbJyRyb3V0ZScsICckcm91dGVQYXJhbXMnLCAnJGxvY2F0aW9uJyxcbiAgICAgICAgICAgIGZ1bmN0aW9uKCRyb3V0ZSwgJHJvdXRlUGFyYW1zLCAkbG9jYXRpb24pIHtcbiAgICAgICAgICAgICAgdGhpcy4kcm91dGUgPSAkcm91dGU7XG4gICAgICAgICAgICAgIHRoaXMuJGxvY2F0aW9uID0gJGxvY2F0aW9uO1xuICAgICAgICAgICAgICB0aGlzLiRyb3V0ZVBhcmFtcyA9ICRyb3V0ZVBhcmFtcztcbiAgICAgICAgICB9XSlcbiAgICAgICAgICAuY29udHJvbGxlcignQm9va0N0cmwnLCBbJyRyb3V0ZVBhcmFtcycsIGZ1bmN0aW9uKCRyb3V0ZVBhcmFtcykge1xuICAgICAgICAgICAgdGhpcy5uYW1lID0gXCJCb29rQ3RybFwiO1xuICAgICAgICAgICAgdGhpcy5wYXJhbXMgPSAkcm91dGVQYXJhbXM7XG4gICAgICAgICAgfV0pXG4gICAgICAgICAgLmNvbnRyb2xsZXIoJ0NoYXB0ZXJDdHJsJywgWyckcm91dGVQYXJhbXMnLCBmdW5jdGlvbigkcm91dGVQYXJhbXMpIHtcbiAgICAgICAgICAgIHRoaXMubmFtZSA9IFwiQ2hhcHRlckN0cmxcIjtcbiAgICAgICAgICAgIHRoaXMucGFyYW1zID0gJHJvdXRlUGFyYW1zO1xuICAgICAgICAgIH1dKTtcblxuICAgICAgPC9maWxlPlxuXG4gICAgICA8ZmlsZSBuYW1lPVwicHJvdHJhY3Rvci5qc1wiIHR5cGU9XCJwcm90cmFjdG9yXCI+XG4gICAgICAgIGl0KCdzaG91bGQgbG9hZCBhbmQgY29tcGlsZSBjb3JyZWN0IHRlbXBsYXRlJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgZWxlbWVudChieS5saW5rVGV4dCgnTW9ieTogQ2gxJykpLmNsaWNrKCk7XG4gICAgICAgICAgdmFyIGNvbnRlbnQgPSBlbGVtZW50KGJ5LmNzcygnW25nLXZpZXddJykpLmdldFRleHQoKTtcbiAgICAgICAgICBleHBlY3QoY29udGVudCkudG9NYXRjaCgvY29udHJvbGxlclxcOiBDaGFwdGVyQ3RybC8pO1xuICAgICAgICAgIGV4cGVjdChjb250ZW50KS50b01hdGNoKC9Cb29rIElkXFw6IE1vYnkvKTtcbiAgICAgICAgICBleHBlY3QoY29udGVudCkudG9NYXRjaCgvQ2hhcHRlciBJZFxcOiAxLyk7XG5cbiAgICAgICAgICBlbGVtZW50KGJ5LnBhcnRpYWxMaW5rVGV4dCgnU2NhcmxldCcpKS5jbGljaygpO1xuXG4gICAgICAgICAgY29udGVudCA9IGVsZW1lbnQoYnkuY3NzKCdbbmctdmlld10nKSkuZ2V0VGV4dCgpO1xuICAgICAgICAgIGV4cGVjdChjb250ZW50KS50b01hdGNoKC9jb250cm9sbGVyXFw6IEJvb2tDdHJsLyk7XG4gICAgICAgICAgZXhwZWN0KGNvbnRlbnQpLnRvTWF0Y2goL0Jvb2sgSWRcXDogU2NhcmxldC8pO1xuICAgICAgICB9KTtcbiAgICAgIDwvZmlsZT5cbiAgICA8L2V4YW1wbGU+XG4gKi9cblxuXG4vKipcbiAqIEBuZ2RvYyBldmVudFxuICogQG5hbWUgbmdWaWV3IyR2aWV3Q29udGVudExvYWRlZFxuICogQGV2ZW50VHlwZSBlbWl0IG9uIHRoZSBjdXJyZW50IG5nVmlldyBzY29wZVxuICogQGRlc2NyaXB0aW9uXG4gKiBFbWl0dGVkIGV2ZXJ5IHRpbWUgdGhlIG5nVmlldyBjb250ZW50IGlzIHJlbG9hZGVkLlxuICovXG5uZ1ZpZXdGYWN0b3J5LiRpbmplY3QgPSBbJyRyb3V0ZScsICckYW5jaG9yU2Nyb2xsJywgJyRhbmltYXRlJ107XG5mdW5jdGlvbiBuZ1ZpZXdGYWN0b3J5KCRyb3V0ZSwgJGFuY2hvclNjcm9sbCwgJGFuaW1hdGUpIHtcbiAgcmV0dXJuIHtcbiAgICByZXN0cmljdDogJ0VDQScsXG4gICAgdGVybWluYWw6IHRydWUsXG4gICAgcHJpb3JpdHk6IDQwMCxcbiAgICB0cmFuc2NsdWRlOiAnZWxlbWVudCcsXG4gICAgbGluazogZnVuY3Rpb24oc2NvcGUsICRlbGVtZW50LCBhdHRyLCBjdHJsLCAkdHJhbnNjbHVkZSkge1xuICAgICAgICB2YXIgY3VycmVudFNjb3BlLFxuICAgICAgICAgICAgY3VycmVudEVsZW1lbnQsXG4gICAgICAgICAgICBwcmV2aW91c0xlYXZlQW5pbWF0aW9uLFxuICAgICAgICAgICAgYXV0b1Njcm9sbEV4cCA9IGF0dHIuYXV0b3Njcm9sbCxcbiAgICAgICAgICAgIG9ubG9hZEV4cCA9IGF0dHIub25sb2FkIHx8ICcnO1xuXG4gICAgICAgIHNjb3BlLiRvbignJHJvdXRlQ2hhbmdlU3VjY2VzcycsIHVwZGF0ZSk7XG4gICAgICAgIHVwZGF0ZSgpO1xuXG4gICAgICAgIGZ1bmN0aW9uIGNsZWFudXBMYXN0VmlldygpIHtcbiAgICAgICAgICBpZiAocHJldmlvdXNMZWF2ZUFuaW1hdGlvbikge1xuICAgICAgICAgICAgJGFuaW1hdGUuY2FuY2VsKHByZXZpb3VzTGVhdmVBbmltYXRpb24pO1xuICAgICAgICAgICAgcHJldmlvdXNMZWF2ZUFuaW1hdGlvbiA9IG51bGw7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKGN1cnJlbnRTY29wZSkge1xuICAgICAgICAgICAgY3VycmVudFNjb3BlLiRkZXN0cm95KCk7XG4gICAgICAgICAgICBjdXJyZW50U2NvcGUgPSBudWxsO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoY3VycmVudEVsZW1lbnQpIHtcbiAgICAgICAgICAgIHByZXZpb3VzTGVhdmVBbmltYXRpb24gPSAkYW5pbWF0ZS5sZWF2ZShjdXJyZW50RWxlbWVudCk7XG4gICAgICAgICAgICBwcmV2aW91c0xlYXZlQW5pbWF0aW9uLnRoZW4oZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgIHByZXZpb3VzTGVhdmVBbmltYXRpb24gPSBudWxsO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBjdXJyZW50RWxlbWVudCA9IG51bGw7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gdXBkYXRlKCkge1xuICAgICAgICAgIHZhciBsb2NhbHMgPSAkcm91dGUuY3VycmVudCAmJiAkcm91dGUuY3VycmVudC5sb2NhbHMsXG4gICAgICAgICAgICAgIHRlbXBsYXRlID0gbG9jYWxzICYmIGxvY2Fscy4kdGVtcGxhdGU7XG5cbiAgICAgICAgICBpZiAoYW5ndWxhci5pc0RlZmluZWQodGVtcGxhdGUpKSB7XG4gICAgICAgICAgICB2YXIgbmV3U2NvcGUgPSBzY29wZS4kbmV3KCk7XG4gICAgICAgICAgICB2YXIgY3VycmVudCA9ICRyb3V0ZS5jdXJyZW50O1xuXG4gICAgICAgICAgICAvLyBOb3RlOiBUaGlzIHdpbGwgYWxzbyBsaW5rIGFsbCBjaGlsZHJlbiBvZiBuZy12aWV3IHRoYXQgd2VyZSBjb250YWluZWQgaW4gdGhlIG9yaWdpbmFsXG4gICAgICAgICAgICAvLyBodG1sLiBJZiB0aGF0IGNvbnRlbnQgY29udGFpbnMgY29udHJvbGxlcnMsIC4uLiB0aGV5IGNvdWxkIHBvbGx1dGUvY2hhbmdlIHRoZSBzY29wZS5cbiAgICAgICAgICAgIC8vIEhvd2V2ZXIsIHVzaW5nIG5nLXZpZXcgb24gYW4gZWxlbWVudCB3aXRoIGFkZGl0aW9uYWwgY29udGVudCBkb2VzIG5vdCBtYWtlIHNlbnNlLi4uXG4gICAgICAgICAgICAvLyBOb3RlOiBXZSBjYW4ndCByZW1vdmUgdGhlbSBpbiB0aGUgY2xvbmVBdHRjaEZuIG9mICR0cmFuc2NsdWRlIGFzIHRoYXRcbiAgICAgICAgICAgIC8vIGZ1bmN0aW9uIGlzIGNhbGxlZCBiZWZvcmUgbGlua2luZyB0aGUgY29udGVudCwgd2hpY2ggd291bGQgYXBwbHkgY2hpbGRcbiAgICAgICAgICAgIC8vIGRpcmVjdGl2ZXMgdG8gbm9uIGV4aXN0aW5nIGVsZW1lbnRzLlxuICAgICAgICAgICAgdmFyIGNsb25lID0gJHRyYW5zY2x1ZGUobmV3U2NvcGUsIGZ1bmN0aW9uKGNsb25lKSB7XG4gICAgICAgICAgICAgICRhbmltYXRlLmVudGVyKGNsb25lLCBudWxsLCBjdXJyZW50RWxlbWVudCB8fCAkZWxlbWVudCkudGhlbihmdW5jdGlvbiBvbk5nVmlld0VudGVyKCkge1xuICAgICAgICAgICAgICAgIGlmIChhbmd1bGFyLmlzRGVmaW5lZChhdXRvU2Nyb2xsRXhwKVxuICAgICAgICAgICAgICAgICAgJiYgKCFhdXRvU2Nyb2xsRXhwIHx8IHNjb3BlLiRldmFsKGF1dG9TY3JvbGxFeHApKSkge1xuICAgICAgICAgICAgICAgICAgJGFuY2hvclNjcm9sbCgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgIGNsZWFudXBMYXN0VmlldygpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGN1cnJlbnRFbGVtZW50ID0gY2xvbmU7XG4gICAgICAgICAgICBjdXJyZW50U2NvcGUgPSBjdXJyZW50LnNjb3BlID0gbmV3U2NvcGU7XG4gICAgICAgICAgICBjdXJyZW50U2NvcGUuJGVtaXQoJyR2aWV3Q29udGVudExvYWRlZCcpO1xuICAgICAgICAgICAgY3VycmVudFNjb3BlLiRldmFsKG9ubG9hZEV4cCk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNsZWFudXBMYXN0VmlldygpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgfTtcbn1cblxuLy8gVGhpcyBkaXJlY3RpdmUgaXMgY2FsbGVkIGR1cmluZyB0aGUgJHRyYW5zY2x1ZGUgY2FsbCBvZiB0aGUgZmlyc3QgYG5nVmlld2AgZGlyZWN0aXZlLlxuLy8gSXQgd2lsbCByZXBsYWNlIGFuZCBjb21waWxlIHRoZSBjb250ZW50IG9mIHRoZSBlbGVtZW50IHdpdGggdGhlIGxvYWRlZCB0ZW1wbGF0ZS5cbi8vIFdlIG5lZWQgdGhpcyBkaXJlY3RpdmUgc28gdGhhdCB0aGUgZWxlbWVudCBjb250ZW50IGlzIGFscmVhZHkgZmlsbGVkIHdoZW5cbi8vIHRoZSBsaW5rIGZ1bmN0aW9uIG9mIGFub3RoZXIgZGlyZWN0aXZlIG9uIHRoZSBzYW1lIGVsZW1lbnQgYXMgbmdWaWV3XG4vLyBpcyBjYWxsZWQuXG5uZ1ZpZXdGaWxsQ29udGVudEZhY3RvcnkuJGluamVjdCA9IFsnJGNvbXBpbGUnLCAnJGNvbnRyb2xsZXInLCAnJHJvdXRlJ107XG5mdW5jdGlvbiBuZ1ZpZXdGaWxsQ29udGVudEZhY3RvcnkoJGNvbXBpbGUsICRjb250cm9sbGVyLCAkcm91dGUpIHtcbiAgcmV0dXJuIHtcbiAgICByZXN0cmljdDogJ0VDQScsXG4gICAgcHJpb3JpdHk6IC00MDAsXG4gICAgbGluazogZnVuY3Rpb24oc2NvcGUsICRlbGVtZW50KSB7XG4gICAgICB2YXIgY3VycmVudCA9ICRyb3V0ZS5jdXJyZW50LFxuICAgICAgICAgIGxvY2FscyA9IGN1cnJlbnQubG9jYWxzO1xuXG4gICAgICAkZWxlbWVudC5odG1sKGxvY2Fscy4kdGVtcGxhdGUpO1xuXG4gICAgICB2YXIgbGluayA9ICRjb21waWxlKCRlbGVtZW50LmNvbnRlbnRzKCkpO1xuXG4gICAgICBpZiAoY3VycmVudC5jb250cm9sbGVyKSB7XG4gICAgICAgIGxvY2Fscy4kc2NvcGUgPSBzY29wZTtcbiAgICAgICAgdmFyIGNvbnRyb2xsZXIgPSAkY29udHJvbGxlcihjdXJyZW50LmNvbnRyb2xsZXIsIGxvY2Fscyk7XG4gICAgICAgIGlmIChjdXJyZW50LmNvbnRyb2xsZXJBcykge1xuICAgICAgICAgIHNjb3BlW2N1cnJlbnQuY29udHJvbGxlckFzXSA9IGNvbnRyb2xsZXI7XG4gICAgICAgIH1cbiAgICAgICAgJGVsZW1lbnQuZGF0YSgnJG5nQ29udHJvbGxlckNvbnRyb2xsZXInLCBjb250cm9sbGVyKTtcbiAgICAgICAgJGVsZW1lbnQuY2hpbGRyZW4oKS5kYXRhKCckbmdDb250cm9sbGVyQ29udHJvbGxlcicsIGNvbnRyb2xsZXIpO1xuICAgICAgfVxuXG4gICAgICBsaW5rKHNjb3BlKTtcbiAgICB9XG4gIH07XG59XG5cblxufSkod2luZG93LCB3aW5kb3cuYW5ndWxhcik7XG4iLCIhZnVuY3Rpb24gYShiLGMsZCl7ZnVuY3Rpb24gZShnLGgpe2lmKCFjW2ddKXtpZighYltnXSl7dmFyIGk9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighaCYmaSlyZXR1cm4gaShnLCEwKTtpZihmKXJldHVybiBmKGcsITApO3Rocm93IG5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrZytcIidcIil9dmFyIGo9Y1tnXT17ZXhwb3J0czp7fX07YltnXVswXS5jYWxsKGouZXhwb3J0cyxmdW5jdGlvbihhKXt2YXIgYz1iW2ddWzFdW2FdO3JldHVybiBlKGM/YzphKX0saixqLmV4cG9ydHMsYSxiLGMsZCl9cmV0dXJuIGNbZ10uZXhwb3J0c31mb3IodmFyIGY9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxnPTA7ZzxkLmxlbmd0aDtnKyspZShkW2ddKTtyZXR1cm4gZX0oezE6W2Z1bmN0aW9uKGEsYil7Yi5leHBvcnRzPXtvYXV0aGRfdXJsOlwiaHR0cHM6Ly9vYXV0aC5pb1wiLG9hdXRoZF9hcGk6XCJodHRwczovL29hdXRoLmlvL2FwaVwiLHZlcnNpb246XCJ3ZWItMC40LjBcIixvcHRpb25zOnt9fX0se31dLDI6W2Z1bmN0aW9uKGEsYil7XCJ1c2Ugc3RyaWN0XCI7Yi5leHBvcnRzPWZ1bmN0aW9uKGEpe3ZhciBiO3JldHVybiBiPWEuZ2V0SnF1ZXJ5KCkse2dldDpmdW5jdGlvbigpe3JldHVybiBmdW5jdGlvbihjLGQpe3ZhciBlO3JldHVybiBlPWEuZ2V0T0F1dGhkVVJMKCksYi5hamF4KHt1cmw6ZStjLHR5cGU6XCJnZXRcIixkYXRhOmR9KX19KHRoaXMpLHBvc3Q6ZnVuY3Rpb24oKXtyZXR1cm4gZnVuY3Rpb24oYyxkKXt2YXIgZTtyZXR1cm4gZT1hLmdldE9BdXRoZFVSTCgpLGIuYWpheCh7dXJsOmUrYyx0eXBlOlwicG9zdFwiLGRhdGE6ZH0pfX0odGhpcykscHV0OmZ1bmN0aW9uKCl7cmV0dXJuIGZ1bmN0aW9uKGMsZCl7dmFyIGU7cmV0dXJuIGU9YS5nZXRPQXV0aGRVUkwoKSxiLmFqYXgoe3VybDplK2MsdHlwZTpcInB1dFwiLGRhdGE6ZH0pfX0odGhpcyksZGVsOmZ1bmN0aW9uKCl7cmV0dXJuIGZ1bmN0aW9uKGMsZCl7dmFyIGU7cmV0dXJuIGU9YS5nZXRPQXV0aGRVUkwoKSxiLmFqYXgoe3VybDplK2MsdHlwZTpcImRlbGV0ZVwiLGRhdGE6ZH0pfX0odGhpcyl9fX0se31dLDM6W2Z1bmN0aW9uKGEsYil7XCJ1c2Ugc3RyaWN0XCI7dmFyIGMsZCxlLGYsZztmPWEoXCIuLi9jb25maWdcIiksZD1hKFwiLi4vdG9vbHMvdXJsXCIpLGM9YShcIi4uL3Rvb2xzL2xvY2F0aW9uX29wZXJhdGlvbnNcIiksZz1hKFwiLi4vdG9vbHMvY29va2llc1wiKSxlPWEoXCIuLi90b29scy9jYWNoZVwiKSxiLmV4cG9ydHM9ZnVuY3Rpb24oYSxiLGgsaSl7dmFyIGosaztyZXR1cm4gZD1kKGIpLGcuaW5pdChmLGIpLGs9YyhiKSxlLmluaXQoZyxmKSxqPXtpbml0aWFsaXplOmZ1bmN0aW9uKGEsYil7dmFyIGM7aWYoZi5rZXk9YSxiKWZvcihjIGluIGIpZi5vcHRpb25zW2NdPWJbY119LHNldE9BdXRoZFVSTDpmdW5jdGlvbihhKXtmLm9hdXRoZF91cmw9YSxmLm9hdXRoZF9iYXNlPWQuZ2V0QWJzVXJsKGYub2F1dGhkX3VybCkubWF0Y2goL14uezIsNX06XFwvXFwvW14vXSsvKVswXX0sZ2V0T0F1dGhkVVJMOmZ1bmN0aW9uKCl7cmV0dXJuIGYub2F1dGhkX3VybH0sZ2V0VmVyc2lvbjpmdW5jdGlvbigpe3JldHVybiBmLnZlcnNpb259LGV4dGVuZDpmdW5jdGlvbihhLGIpe3JldHVybiB0aGlzW2FdPWIodGhpcyl9LGdldENvbmZpZzpmdW5jdGlvbigpe3JldHVybiBmfSxnZXRXaW5kb3c6ZnVuY3Rpb24oKXtyZXR1cm4gYX0sZ2V0RG9jdW1lbnQ6ZnVuY3Rpb24oKXtyZXR1cm4gYn0sZ2V0TmF2aWdhdG9yOmZ1bmN0aW9uKCl7cmV0dXJuIGl9LGdldEpxdWVyeTpmdW5jdGlvbigpe3JldHVybiBofSxnZXRVcmw6ZnVuY3Rpb24oKXtyZXR1cm4gZH0sZ2V0Q2FjaGU6ZnVuY3Rpb24oKXtyZXR1cm4gZX0sZ2V0Q29va2llczpmdW5jdGlvbigpe3JldHVybiBnfSxnZXRMb2NhdGlvbk9wZXJhdGlvbnM6ZnVuY3Rpb24oKXtyZXR1cm4ga319fX0se1wiLi4vY29uZmlnXCI6MSxcIi4uL3Rvb2xzL2NhY2hlXCI6OSxcIi4uL3Rvb2xzL2Nvb2tpZXNcIjoxMCxcIi4uL3Rvb2xzL2xvY2F0aW9uX29wZXJhdGlvbnNcIjoxMixcIi4uL3Rvb2xzL3VybFwiOjE0fV0sNDpbZnVuY3Rpb24oYSxiKXtcInVzZSBzdHJpY3RcIjt2YXIgYyxkLGU7Yz1hKFwiLi4vdG9vbHMvY29va2llc1wiKSxkPWEoXCIuL3JlcXVlc3RcIiksZT1hKFwiLi4vdG9vbHMvc2hhMVwiKSxiLmV4cG9ydHM9ZnVuY3Rpb24oYil7dmFyIGYsZyxoLGksaixrLGwsbSxuLG8scCxxLHI7cmV0dXJuIGc9Yi5nZXRVcmwoKSxqPWIuZ2V0Q29uZmlnKCksaz1iLmdldERvY3VtZW50KCkscj1iLmdldFdpbmRvdygpLGY9Yi5nZXRKcXVlcnkoKSxoPWIuZ2V0Q2FjaGUoKSxxPWEoXCIuL3Byb3ZpZGVyc1wiKShiKSxqLm9hdXRoZF9iYXNlPWcuZ2V0QWJzVXJsKGoub2F1dGhkX3VybCkubWF0Y2goL14uezIsNX06XFwvXFwvW14vXSsvKVswXSxpPVtdLG49dm9pZCAwLChwPWZ1bmN0aW9uKCl7dmFyIGEsYjtiPS9bXFxcXCMmXW9hdXRoaW89KFteJl0qKS8uZXhlYyhrLmxvY2F0aW9uLmhhc2gpLGImJihrLmxvY2F0aW9uLmhhc2g9ay5sb2NhdGlvbi5oYXNoLnJlcGxhY2UoLyY/b2F1dGhpbz1bXiZdKi8sXCJcIiksbj1kZWNvZGVVUklDb21wb25lbnQoYlsxXS5yZXBsYWNlKC9cXCsvZyxcIiBcIikpLGE9Yy5yZWFkQ29va2llKFwib2F1dGhpb19zdGF0ZVwiKSxhJiYoaS5wdXNoKGEpLGMuZXJhc2VDb29raWUoXCJvYXV0aGlvX3N0YXRlXCIpKSl9KSgpLGw9Yi5nZXRMb2NhdGlvbk9wZXJhdGlvbnMoKSxvPXtyZXF1ZXN0OmQoYixpLHEpfSxtPXtpbml0aWFsaXplOmZ1bmN0aW9uKGEsYyl7cmV0dXJuIGIuaW5pdGlhbGl6ZShhLGMpfSxzZXRPQXV0aGRVUkw6ZnVuY3Rpb24oYSl7ai5vYXV0aGRfdXJsPWEsai5vYXV0aGRfYmFzZT1nLmdldEFic1VybChqLm9hdXRoZF91cmwpLm1hdGNoKC9eLnsyLDV9OlxcL1xcL1teL10rLylbMF19LGNyZWF0ZTpmdW5jdGlvbihhLGIsYyl7dmFyIGQsZSxmLGc7aWYoIWIpcmV0dXJuIGgudHJ5Q2FjaGUobSxhLCEwKTtcIm9iamVjdFwiIT10eXBlb2YgYyYmcS5mZXRjaERlc2NyaXB0aW9uKGEpLGU9ZnVuY3Rpb24oZCl7cmV0dXJuIG8ucmVxdWVzdC5ta0h0dHAoYSxiLGMsZCl9LGY9ZnVuY3Rpb24oZCxlKXtyZXR1cm4gby5yZXF1ZXN0Lm1rSHR0cEVuZHBvaW50KGEsYixjLGQsZSl9LGc9e307Zm9yKGQgaW4gYilnW2RdPWJbZF07cmV0dXJuIGcuZ2V0PWUoXCJHRVRcIiksZy5wb3N0PWUoXCJQT1NUXCIpLGcucHV0PWUoXCJQVVRcIiksZy5wYXRjaD1lKFwiUEFUQ0hcIiksZy5kZWw9ZShcIkRFTEVURVwiKSxnLm1lPW8ucmVxdWVzdC5ta0h0dHBNZShhLGIsYyxcIkdFVFwiKSxnfSxwb3B1cDpmdW5jdGlvbihhLGIsYyl7dmFyIGQsbCxuLHAscSxzLHQsdSx2LHcseDtyZXR1cm4gcD0hMSxuPWZ1bmN0aW9uKGEpe2lmKCFwKXtpZihhLm9yaWdpbiE9PWoub2F1dGhkX2Jhc2UpcmV0dXJuO3RyeXt1LmNsb3NlKCl9Y2F0Y2goYyl7fXJldHVybiBiLmRhdGE9YS5kYXRhLG8ucmVxdWVzdC5zZW5kQ2FsbGJhY2soYixkKSxwPSEwfX0sdT12b2lkIDAsbD12b2lkIDAsdj12b2lkIDAsZD1mLkRlZmVycmVkKCksYj1ifHx7fSxqLmtleT8oMj09PWFyZ3VtZW50cy5sZW5ndGgmJlwiZnVuY3Rpb25cIj09dHlwZW9mIGImJihjPWIsYj17fSksaC5jYWNoZUVuYWJsZWQoYi5jYWNoZSkmJihzPWgudHJ5Q2FjaGUobSxhLGIuY2FjaGUpKT8obnVsbCE9ZCYmZC5yZXNvbHZlKHMpLGM/YyhudWxsLHMpOmQucHJvbWlzZSgpKTooYi5zdGF0ZXx8KGIuc3RhdGU9ZS5jcmVhdGVfaGFzaCgpLGIuc3RhdGVfdHlwZT1cImNsaWVudFwiKSxpLnB1c2goYi5zdGF0ZSksdD1qLm9hdXRoZF91cmwrXCIvYXV0aC9cIithK1wiP2s9XCIrai5rZXksdCs9XCImZD1cIitlbmNvZGVVUklDb21wb25lbnQoZy5nZXRBYnNVcmwoXCIvXCIpKSxiJiYodCs9XCImb3B0cz1cIitlbmNvZGVVUklDb21wb25lbnQoSlNPTi5zdHJpbmdpZnkoYikpKSxiLnduZF9zZXR0aW5ncz8oeD1iLnduZF9zZXR0aW5ncyxkZWxldGUgYi53bmRfc2V0dGluZ3MpOng9e3dpZHRoOk1hdGguZmxvb3IoLjgqci5vdXRlcldpZHRoKSxoZWlnaHQ6TWF0aC5mbG9vciguNSpyLm91dGVySGVpZ2h0KX0sbnVsbD09eC5oZWlnaHQmJih4LmhlaWdodD14LmhlaWdodDwzNTA/MzUwOnZvaWQgMCksbnVsbD09eC53aWR0aCYmKHgud2lkdGg9eC53aWR0aDw4MDA/ODAwOnZvaWQgMCksbnVsbD09eC5sZWZ0JiYoeC5sZWZ0PXIuc2NyZWVuWCsoci5vdXRlcldpZHRoLXgud2lkdGgpLzIpLG51bGw9PXgudG9wJiYoeC50b3A9ci5zY3JlZW5ZKyhyLm91dGVySGVpZ2h0LXguaGVpZ2h0KS84KSx3PVwid2lkdGg9XCIreC53aWR0aCtcIixoZWlnaHQ9XCIreC5oZWlnaHQsdys9XCIsdG9vbGJhcj0wLHNjcm9sbGJhcnM9MSxzdGF0dXM9MSxyZXNpemFibGU9MSxsb2NhdGlvbj0xLG1lbnVCYXI9MFwiLHcrPVwiLGxlZnQ9XCIreC5sZWZ0K1wiLHRvcD1cIit4LnRvcCxiPXtwcm92aWRlcjphLGNhY2hlOmIuY2FjaGV9LGIuY2FsbGJhY2s9ZnVuY3Rpb24oYSxkKXtyZXR1cm4gci5yZW1vdmVFdmVudExpc3RlbmVyP3IucmVtb3ZlRXZlbnRMaXN0ZW5lcihcIm1lc3NhZ2VcIixuLCExKTpyLmRldGFjaEV2ZW50P3IuZGV0YWNoRXZlbnQoXCJvbm1lc3NhZ2VcIixuKTprLmRldGFjaEV2ZW50JiZrLmRldGFjaEV2ZW50KFwib25tZXNzYWdlXCIsbiksYi5jYWxsYmFjaz1mdW5jdGlvbigpe30sdiYmKGNsZWFyVGltZW91dCh2KSx2PXZvaWQgMCksYz9jKGEsZCk6dm9pZCAwfSxyLmF0dGFjaEV2ZW50P3IuYXR0YWNoRXZlbnQoXCJvbm1lc3NhZ2VcIixuKTprLmF0dGFjaEV2ZW50P2suYXR0YWNoRXZlbnQoXCJvbm1lc3NhZ2VcIixuKTpyLmFkZEV2ZW50TGlzdGVuZXImJnIuYWRkRXZlbnRMaXN0ZW5lcihcIm1lc3NhZ2VcIixuLCExKSxcInVuZGVmaW5lZFwiIT10eXBlb2YgY2hyb21lJiZjaHJvbWUucnVudGltZSYmY2hyb21lLnJ1bnRpbWUub25NZXNzYWdlRXh0ZXJuYWwmJmNocm9tZS5ydW50aW1lLm9uTWVzc2FnZUV4dGVybmFsLmFkZExpc3RlbmVyKGZ1bmN0aW9uKGEsYil7cmV0dXJuIGEub3JpZ2luPWIudXJsLm1hdGNoKC9eLnsyLDV9OlxcL1xcL1teL10rLylbMF0sbnVsbCE9ZCYmZC5yZXNvbHZlKCksbihhKX0pLCFsJiYoLTEhPT1uYXZpZ2F0b3IudXNlckFnZW50LmluZGV4T2YoXCJNU0lFXCIpfHxuYXZpZ2F0b3IuYXBwVmVyc2lvbi5pbmRleE9mKFwiVHJpZGVudC9cIik+MCkmJihsPWsuY3JlYXRlRWxlbWVudChcImlmcmFtZVwiKSxsLnNyYz1qLm9hdXRoZF91cmwrXCIvYXV0aC9pZnJhbWU/ZD1cIitlbmNvZGVVUklDb21wb25lbnQoZy5nZXRBYnNVcmwoXCIvXCIpKSxsLndpZHRoPTAsbC5oZWlnaHQ9MCxsLmZyYW1lQm9yZGVyPTAsbC5zdHlsZS52aXNpYmlsaXR5PVwiaGlkZGVuXCIsay5ib2R5LmFwcGVuZENoaWxkKGwpKSx2PXNldFRpbWVvdXQoZnVuY3Rpb24oKXtudWxsIT1kJiZkLnJlamVjdChuZXcgRXJyb3IoXCJBdXRob3JpemF0aW9uIHRpbWVkIG91dFwiKSksYi5jYWxsYmFjayYmXCJmdW5jdGlvblwiPT10eXBlb2YgYi5jYWxsYmFjayYmYi5jYWxsYmFjayhuZXcgRXJyb3IoXCJBdXRob3JpemF0aW9uIHRpbWVkIG91dFwiKSk7dHJ5e3UuY2xvc2UoKX1jYXRjaChhKXt9fSwxMmU1KSx1PXIub3Blbih0LFwiQXV0aG9yaXphdGlvblwiLHcpLHU/KHUuZm9jdXMoKSxxPXIuc2V0SW50ZXJ2YWwoZnVuY3Rpb24oKXtyZXR1cm4gbnVsbCE9PXUmJiF1LmNsb3NlZHx8KHIuY2xlYXJJbnRlcnZhbChxKSxwfHwobnVsbCE9ZCYmZC5yZWplY3QobmV3IEVycm9yKFwiVGhlIHBvcHVwIHdhcyBjbG9zZWRcIikpLCFiLmNhbGxiYWNrfHxcImZ1bmN0aW9uXCIhPXR5cGVvZiBiLmNhbGxiYWNrKSk/dm9pZCAwOmIuY2FsbGJhY2sobmV3IEVycm9yKFwiVGhlIHBvcHVwIHdhcyBjbG9zZWRcIikpfSw1MDApKToobnVsbCE9ZCYmZC5yZWplY3QobmV3IEVycm9yKFwiQ291bGQgbm90IG9wZW4gYSBwb3B1cFwiKSksYi5jYWxsYmFjayYmXCJmdW5jdGlvblwiPT10eXBlb2YgYi5jYWxsYmFjayYmYi5jYWxsYmFjayhuZXcgRXJyb3IoXCJDb3VsZCBub3Qgb3BlbiBhIHBvcHVwXCIpKSksbnVsbCE9ZD9kLnByb21pc2UoKTp2b2lkIDApKToobnVsbCE9ZCYmZC5yZWplY3QobmV3IEVycm9yKFwiT0F1dGggb2JqZWN0IG11c3QgYmUgaW5pdGlhbGl6ZWRcIikpLG51bGw9PWM/ZC5wcm9taXNlKCk6YyhuZXcgRXJyb3IoXCJPQXV0aCBvYmplY3QgbXVzdCBiZSBpbml0aWFsaXplZFwiKSkpfSxyZWRpcmVjdDpmdW5jdGlvbihhLGIsZCl7dmFyIGYsaTtyZXR1cm4gMj09PWFyZ3VtZW50cy5sZW5ndGgmJihkPWIsYj17fSksaC5jYWNoZUVuYWJsZWQoYi5jYWNoZSkmJihpPWgudHJ5Q2FjaGUobSxhLGIuY2FjaGUpKT8oZD1nLmdldEFic1VybChkKSsoLTE9PT1kLmluZGV4T2YoXCIjXCIpP1wiI1wiOlwiJlwiKStcIm9hdXRoaW89Y2FjaGVcIixsLmNoYW5nZUhyZWYoZCksdm9pZCBsLnJlbG9hZCgpKTooYi5zdGF0ZXx8KGIuc3RhdGU9ZS5jcmVhdGVfaGFzaCgpLGIuc3RhdGVfdHlwZT1cImNsaWVudFwiKSxjLmNyZWF0ZUNvb2tpZShcIm9hdXRoaW9fc3RhdGVcIixiLnN0YXRlKSxmPWVuY29kZVVSSUNvbXBvbmVudChnLmdldEFic1VybChkKSksZD1qLm9hdXRoZF91cmwrXCIvYXV0aC9cIithK1wiP2s9XCIrai5rZXksZCs9XCImcmVkaXJlY3RfdXJpPVwiK2YsYiYmKGQrPVwiJm9wdHM9XCIrZW5jb2RlVVJJQ29tcG9uZW50KEpTT04uc3RyaW5naWZ5KGIpKSksdm9pZCBsLmNoYW5nZUhyZWYoZCkpfSxjYWxsYmFjazpmdW5jdGlvbihhLGIsYyl7dmFyIGQsZTtpZihkPWYuRGVmZXJyZWQoKSwxPT09YXJndW1lbnRzLmxlbmd0aCYmXCJmdW5jdGlvblwiPT10eXBlb2YgYSYmKGM9YSxhPXZvaWQgMCxiPXt9KSwxPT09YXJndW1lbnRzLmxlbmd0aCYmXCJzdHJpbmdcIj09dHlwZW9mIGEmJihiPXt9KSwyPT09YXJndW1lbnRzLmxlbmd0aCYmXCJmdW5jdGlvblwiPT10eXBlb2YgYiYmKGM9YixiPXt9KSxoLmNhY2hlRW5hYmxlZChiLmNhY2hlKXx8XCJjYWNoZVwiPT09bil7aWYoZT1oLnRyeUNhY2hlKG0sYSxiLmNhY2hlKSxcImNhY2hlXCI9PT1uJiYoXCJzdHJpbmdcIiE9dHlwZW9mIGF8fCFhKSlyZXR1cm4gbnVsbCE9ZCYmZC5yZWplY3QobmV3IEVycm9yKFwiWW91IG11c3Qgc2V0IGEgcHJvdmlkZXIgd2hlbiB1c2luZyB0aGUgY2FjaGVcIikpLGM/YyhuZXcgRXJyb3IoXCJZb3UgbXVzdCBzZXQgYSBwcm92aWRlciB3aGVuIHVzaW5nIHRoZSBjYWNoZVwiKSk6bnVsbCE9ZD9kLnByb21pc2UoKTp2b2lkIDA7aWYoZSl7aWYoIWMpcmV0dXJuIG51bGwhPWQmJmQucmVzb2x2ZShlKSxudWxsIT1kP2QucHJvbWlzZSgpOnZvaWQgMDtpZihlKXJldHVybiBjKG51bGwsZSl9fXJldHVybiBuPyhvLnJlcXVlc3Quc2VuZENhbGxiYWNrKHtkYXRhOm4scHJvdmlkZXI6YSxjYWNoZTpiLmNhY2hlLGNhbGxiYWNrOmN9LGQpLG51bGwhPWQ/ZC5wcm9taXNlKCk6dm9pZCAwKTp2b2lkIDB9LGNsZWFyQ2FjaGU6ZnVuY3Rpb24oYSl7Yy5lcmFzZUNvb2tpZShcIm9hdXRoaW9fcHJvdmlkZXJfXCIrYSl9LGh0dHBfbWU6ZnVuY3Rpb24oYSl7by5yZXF1ZXN0Lmh0dHBfbWUmJm8ucmVxdWVzdC5odHRwX21lKGEpfSxodHRwOmZ1bmN0aW9uKGEpe28ucmVxdWVzdC5odHRwJiZvLnJlcXVlc3QuaHR0cChhKX0sZ2V0VmVyc2lvbjpmdW5jdGlvbigpe3JldHVybiBiLmdldFZlcnNpb24uYXBwbHkodGhpcyl9fX19LHtcIi4uL3Rvb2xzL2Nvb2tpZXNcIjoxMCxcIi4uL3Rvb2xzL3NoYTFcIjoxMyxcIi4vcHJvdmlkZXJzXCI6NSxcIi4vcmVxdWVzdFwiOjZ9XSw1OltmdW5jdGlvbihhLGIpe1widXNlIHN0cmljdFwiO3ZhciBjO2M9YShcIi4uL2NvbmZpZ1wiKSxiLmV4cG9ydHM9ZnVuY3Rpb24oYSl7dmFyIGIsZCxlLGY7cmV0dXJuIGI9YS5nZXRKcXVlcnkoKSxmPXt9LGU9e30sZD17ZXhlY1Byb3ZpZGVyc0NiOmZ1bmN0aW9uKGEsYixjKXt2YXIgZCxmO2lmKGVbYV0pe2Q9ZVthXSxkZWxldGUgZVthXTtmb3IoZiBpbiBkKWRbZl0oYixjKX19LGZldGNoRGVzY3JpcHRpb246ZnVuY3Rpb24oYSl7ZlthXXx8KGZbYV09ITAsYi5hamF4KHt1cmw6Yy5vYXV0aGRfYXBpK1wiL3Byb3ZpZGVycy9cIithLGRhdGE6e2V4dGVuZDohMH0sZGF0YVR5cGU6XCJqc29uXCJ9KS5kb25lKGZ1bmN0aW9uKGIpe2ZbYV09Yi5kYXRhLGQuZXhlY1Byb3ZpZGVyc0NiKGEsbnVsbCxiLmRhdGEpfSkuYWx3YXlzKGZ1bmN0aW9uKCl7XCJvYmplY3RcIiE9dHlwZW9mIGZbYV0mJihkZWxldGUgZlthXSxkLmV4ZWNQcm92aWRlcnNDYihhLG5ldyBFcnJvcihcIlVuYWJsZSB0byBmZXRjaCByZXF1ZXN0IGRlc2NyaXB0aW9uXCIpKSl9KSl9LGdldERlc2NyaXB0aW9uOmZ1bmN0aW9uKGEsYixjKXtyZXR1cm4gYj1ifHx7fSxcIm9iamVjdFwiPT10eXBlb2YgZlthXT9jKG51bGwsZlthXSk6KGZbYV18fGQuZmV0Y2hEZXNjcmlwdGlvbihhKSxiLndhaXQ/KGVbYV09ZVthXXx8W10sdm9pZCBlW2FdLnB1c2goYykpOmMobnVsbCx7fSkpfX19fSx7XCIuLi9jb25maWdcIjoxfV0sNjpbZnVuY3Rpb24oYSxiKXtcInVzZSBzdHJpY3RcIjt2YXIgYyxkLGU9W10uaW5kZXhPZnx8ZnVuY3Rpb24oYSl7Zm9yKHZhciBiPTAsYz10aGlzLmxlbmd0aDtjPmI7YisrKWlmKGIgaW4gdGhpcyYmdGhpc1tiXT09PWEpcmV0dXJuIGI7cmV0dXJuLTF9O2Q9YShcIi4uL3Rvb2xzL3VybFwiKSgpLGM9YShcInFcIiksYi5leHBvcnRzPWZ1bmN0aW9uKGEsYixmKXt2YXIgZyxoLGksaixrO3JldHVybiBnPWEuZ2V0SnF1ZXJ5KCksaT1hLmdldENvbmZpZygpLGg9YS5nZXRDYWNoZSgpLGo9W10saz0hMSx7cmV0cmlldmVNZXRob2RzOmZ1bmN0aW9uKCl7dmFyIGE7cmV0dXJuIGE9Yy5kZWZlcigpLGs/YS5yZXNvbHZlKGopOmcuYWpheChpLm9hdXRoZF91cmwrXCIvYXBpL2V4dGVuZGVkLWVuZHBvaW50c1wiKS50aGVuKGZ1bmN0aW9uKGIpe3JldHVybiBqPWIuZGF0YSxrPSEwLGEucmVzb2x2ZSgpfSkuZmFpbChmdW5jdGlvbihiKXtyZXR1cm4gaz0hMCxhLnJlamVjdChiKX0pLGEucHJvbWlzZX0sZ2VuZXJhdGVNZXRob2RzOmZ1bmN0aW9uKGEsYixjKXt2YXIgZCxlLGYsZyxoLGksaztpZihudWxsIT1qKXtrPVtdO2ZvcihkIGluIGopaD1qW2RdLGY9aC5uYW1lLnNwbGl0KFwiLlwiKSxnPWEsay5wdXNoKGZ1bmN0aW9uKCl7dmFyIGE7YT1bXTtmb3IoZSBpbiBmKWk9ZltlXSxlPGYubGVuZ3RoLTE/KG51bGw9PWdbaV0mJihnW2ldPXt9KSxhLnB1c2goZz1nW2ldKSk6YS5wdXNoKGdbaV09dGhpcy5ta0h0dHBBbGwoYyxiLGgsYXJndW1lbnRzKSk7cmV0dXJuIGF9LmFwcGx5KHRoaXMsYXJndW1lbnRzKSk7cmV0dXJuIGt9fSxodHRwOmZ1bmN0aW9uKGEpe3ZhciBiLGMsaCxqLGs7aD1mdW5jdGlvbigpe3ZhciBhLGIsYyxmO2lmKGY9ay5vYXV0aGlvLnJlcXVlc3R8fHt9LCFmLmNvcnMpe2sudXJsPWVuY29kZVVSSUNvbXBvbmVudChrLnVybCksXCIvXCIhPT1rLnVybFswXSYmKGsudXJsPVwiL1wiK2sudXJsKSxrLnVybD1pLm9hdXRoZF91cmwrXCIvcmVxdWVzdC9cIitrLm9hdXRoaW8ucHJvdmlkZXIray51cmwsay5oZWFkZXJzPWsuaGVhZGVyc3x8e30say5oZWFkZXJzLm9hdXRoaW89XCJrPVwiK2kua2V5LGsub2F1dGhpby50b2tlbnMub2F1dGhfdG9rZW4mJmsub2F1dGhpby50b2tlbnMub2F1dGhfdG9rZW5fc2VjcmV0JiYoay5oZWFkZXJzLm9hdXRoaW8rPVwiJm9hdXRodj0xXCIpO2ZvcihiIGluIGsub2F1dGhpby50b2tlbnMpay5oZWFkZXJzLm9hdXRoaW8rPVwiJlwiK2VuY29kZVVSSUNvbXBvbmVudChiKStcIj1cIitlbmNvZGVVUklDb21wb25lbnQoay5vYXV0aGlvLnRva2Vuc1tiXSk7cmV0dXJuIGRlbGV0ZSBrLm9hdXRoaW8sZy5hamF4KGspfWlmKGsub2F1dGhpby50b2tlbnMpe2lmKGsub2F1dGhpby50b2tlbnMuYWNjZXNzX3Rva2VuJiYoay5vYXV0aGlvLnRva2Vucy50b2tlbj1rLm9hdXRoaW8udG9rZW5zLmFjY2Vzc190b2tlbiksay51cmwubWF0Y2goL15bYS16XXsyLDE2fTpcXC9cXC8vKXx8KFwiL1wiIT09ay51cmxbMF0mJihrLnVybD1cIi9cIitrLnVybCksay51cmw9Zi51cmwray51cmwpLGsudXJsPWQucmVwbGFjZVBhcmFtKGsudXJsLGsub2F1dGhpby50b2tlbnMsZi5wYXJhbWV0ZXJzKSxmLnF1ZXJ5KXtjPVtdO2ZvcihhIGluIGYucXVlcnkpYy5wdXNoKGVuY29kZVVSSUNvbXBvbmVudChhKStcIj1cIitlbmNvZGVVUklDb21wb25lbnQoZC5yZXBsYWNlUGFyYW0oZi5xdWVyeVthXSxrLm9hdXRoaW8udG9rZW5zLGYucGFyYW1ldGVycykpKTtrLnVybCs9ZS5jYWxsKGsudXJsLFwiP1wiKT49MD9cIiZcIitjOlwiP1wiK2N9aWYoZi5oZWFkZXJzKXtrLmhlYWRlcnM9ay5oZWFkZXJzfHx7fTtmb3IoYSBpbiBmLmhlYWRlcnMpay5oZWFkZXJzW2FdPWQucmVwbGFjZVBhcmFtKGYuaGVhZGVyc1thXSxrLm9hdXRoaW8udG9rZW5zLGYucGFyYW1ldGVycyl9cmV0dXJuIGRlbGV0ZSBrLm9hdXRoaW8sZy5hamF4KGspfX0saz17fSxqPXZvaWQgMDtmb3IoaiBpbiBhKWtbal09YVtqXTtyZXR1cm4gay5vYXV0aGlvLnJlcXVlc3QmJmsub2F1dGhpby5yZXF1ZXN0IT09ITA/aCgpOihjPXt3YWl0OiEhay5vYXV0aGlvLnJlcXVlc3R9LGI9Zy5EZWZlcnJlZCgpLGYuZ2V0RGVzY3JpcHRpb24oay5vYXV0aGlvLnByb3ZpZGVyLGMsZnVuY3Rpb24oYSxjKXtyZXR1cm4gYT9iLnJlamVjdChhKTooay5vYXV0aGlvLnJlcXVlc3Q9ay5vYXV0aGlvLnRva2Vucy5vYXV0aF90b2tlbiYmay5vYXV0aGlvLnRva2Vucy5vYXV0aF90b2tlbl9zZWNyZXQ/Yy5vYXV0aDEmJmMub2F1dGgxLnJlcXVlc3Q6Yy5vYXV0aDImJmMub2F1dGgyLnJlcXVlc3Qsdm9pZCBiLnJlc29sdmUoKSl9KSxiLnRoZW4oaCkpfSxodHRwX21lOmZ1bmN0aW9uKGEpe3ZhciBiLGMsZCxlLGg7ZD1mdW5jdGlvbigpe3ZhciBhLGIsYyxkO2E9Zy5EZWZlcnJlZCgpLGQ9aC5vYXV0aGlvLnJlcXVlc3R8fHt9LGgudXJsPWkub2F1dGhkX3VybCtcIi9hdXRoL1wiK2gub2F1dGhpby5wcm92aWRlcitcIi9tZVwiLGguaGVhZGVycz1oLmhlYWRlcnN8fHt9LGguaGVhZGVycy5vYXV0aGlvPVwiaz1cIitpLmtleSxoLm9hdXRoaW8udG9rZW5zLm9hdXRoX3Rva2VuJiZoLm9hdXRoaW8udG9rZW5zLm9hdXRoX3Rva2VuX3NlY3JldCYmKGguaGVhZGVycy5vYXV0aGlvKz1cIiZvYXV0aHY9MVwiKTtmb3IoYiBpbiBoLm9hdXRoaW8udG9rZW5zKWguaGVhZGVycy5vYXV0aGlvKz1cIiZcIitlbmNvZGVVUklDb21wb25lbnQoYikrXCI9XCIrZW5jb2RlVVJJQ29tcG9uZW50KGgub2F1dGhpby50b2tlbnNbYl0pO3JldHVybiBkZWxldGUgaC5vYXV0aGlvLGM9Zy5hamF4KGgpLGcud2hlbihjKS5kb25lKGZ1bmN0aW9uKGIpe2EucmVzb2x2ZShiLmRhdGEpfSkuZmFpbChmdW5jdGlvbihiKXthLnJlamVjdChiLnJlc3BvbnNlSlNPTj9iLnJlc3BvbnNlSlNPTi5kYXRhOm5ldyBFcnJvcihcIkFuIGVycm9yIG9jY3VyZWQgd2hpbGUgdHJ5aW5nIHRvIGFjY2VzcyB0aGUgcmVzb3VyY2VcIikpfSksYS5wcm9taXNlKCl9LGg9e307Zm9yKGUgaW4gYSloW2VdPWFbZV07cmV0dXJuIGgub2F1dGhpby5yZXF1ZXN0JiZoLm9hdXRoaW8ucmVxdWVzdCE9PSEwP2QoKTooYz17d2FpdDohIWgub2F1dGhpby5yZXF1ZXN0fSxiPWcuRGVmZXJyZWQoKSxmLmdldERlc2NyaXB0aW9uKGgub2F1dGhpby5wcm92aWRlcixjLGZ1bmN0aW9uKGEsYyl7cmV0dXJuIGE/Yi5yZWplY3QoYSk6KGgub2F1dGhpby5yZXF1ZXN0PWgub2F1dGhpby50b2tlbnMub2F1dGhfdG9rZW4mJmgub2F1dGhpby50b2tlbnMub2F1dGhfdG9rZW5fc2VjcmV0P2Mub2F1dGgxJiZjLm9hdXRoMS5yZXF1ZXN0OmMub2F1dGgyJiZjLm9hdXRoMi5yZXF1ZXN0LHZvaWQgYi5yZXNvbHZlKCkpfSksYi50aGVuKGQpKX0saHR0cF9hbGw6ZnVuY3Rpb24oYSl7dmFyIGI7cmV0dXJuKGI9ZnVuY3Rpb24oKXt2YXIgYixjLGQsZTtiPWcuRGVmZXJyZWQoKSxlPWEub2F1dGhpby5yZXF1ZXN0fHx7fSxhLmhlYWRlcnM9YS5oZWFkZXJzfHx7fSxhLmhlYWRlcnMub2F1dGhpbz1cIms9XCIraS5rZXksYS5vYXV0aGlvLnRva2Vucy5vYXV0aF90b2tlbiYmYS5vYXV0aGlvLnRva2Vucy5vYXV0aF90b2tlbl9zZWNyZXQmJihhLmhlYWRlcnMub2F1dGhpbys9XCImb2F1dGh2PTFcIik7Zm9yKGMgaW4gYS5vYXV0aGlvLnRva2VucylhLmhlYWRlcnMub2F1dGhpbys9XCImXCIrZW5jb2RlVVJJQ29tcG9uZW50KGMpK1wiPVwiK2VuY29kZVVSSUNvbXBvbmVudChhLm9hdXRoaW8udG9rZW5zW2NdKTtyZXR1cm4gZGVsZXRlIGEub2F1dGhpbyxkPWcuYWpheChhKSxnLndoZW4oZCkuZG9uZShmdW5jdGlvbihhKXt2YXIgYztpZihcInN0cmluZ1wiPT10eXBlb2YgYS5kYXRhKXRyeXthLmRhdGE9SlNPTi5wYXJzZShhLmRhdGEpfWNhdGNoKGQpe2M9ZCxhLmRhdGE9YS5kYXRhfWZpbmFsbHl7Yi5yZXNvbHZlKGEuZGF0YSl9fSkuZmFpbChmdW5jdGlvbihhKXtiLnJlamVjdChhLnJlc3BvbnNlSlNPTj9hLnJlc3BvbnNlSlNPTi5kYXRhOm5ldyBFcnJvcihcIkFuIGVycm9yIG9jY3VyZWQgd2hpbGUgdHJ5aW5nIHRvIGFjY2VzcyB0aGUgcmVzb3VyY2VcIikpfSksYi5wcm9taXNlKCl9KSgpfSxta0h0dHA6ZnVuY3Rpb24oYSxiLGMsZCl7dmFyIGU7cmV0dXJuIGU9dGhpcyxmdW5jdGlvbihmLGcpe3ZhciBoLGk7aWYoaT17fSxcInN0cmluZ1wiPT10eXBlb2YgZil7aWYoXCJvYmplY3RcIj09dHlwZW9mIGcpZm9yKGggaW4gZylpW2hdPWdbaF07aS51cmw9Zn1lbHNlIGlmKFwib2JqZWN0XCI9PXR5cGVvZiBmKWZvcihoIGluIGYpaVtoXT1mW2hdO3JldHVybiBpLnR5cGU9aS50eXBlfHxkLGkub2F1dGhpbz17cHJvdmlkZXI6YSx0b2tlbnM6YixyZXF1ZXN0OmN9LGUuaHR0cChpKX19LG1rSHR0cE1lOmZ1bmN0aW9uKGEsYixjLGQpe3ZhciBlO3JldHVybiBlPXRoaXMsZnVuY3Rpb24oZil7dmFyIGc7cmV0dXJuIGc9e30sZy50eXBlPWcudHlwZXx8ZCxnLm9hdXRoaW89e3Byb3ZpZGVyOmEsdG9rZW5zOmIscmVxdWVzdDpjfSxnLmRhdGE9Zy5kYXRhfHx7fSxnLmRhdGEuZmlsdGVyPWY/Zi5qb2luKFwiLFwiKTp2b2lkIDAsZS5odHRwX21lKGcpfX0sbWtIdHRwQWxsOmZ1bmN0aW9uKGEsYixjKXt2YXIgZDtyZXR1cm4gZD10aGlzLGZ1bmN0aW9uKCl7dmFyIGUsZixnLGg7Zj17fSxmLnR5cGU9Yy5tZXRob2QsZi51cmw9aS5vYXV0aGRfdXJsK2MuZW5kcG9pbnQucmVwbGFjZShcIjpwcm92aWRlclwiLGEpLGYub2F1dGhpbz17cHJvdmlkZXI6YSx0b2tlbnM6Yn0sZi5kYXRhPXt9O2ZvcihlIGluIGFyZ3VtZW50cyloPWFyZ3VtZW50c1tlXSxnPWMucGFyYW1zW2VdLG51bGwhPWcmJihmLmRhdGFbZy5uYW1lXT1oKTtyZXR1cm4gZi5kYXRhPWYuZGF0YXx8e30sZC5odHRwX2FsbChmLGMsYXJndW1lbnRzKX19LHNlbmRDYWxsYmFjazpmdW5jdGlvbihhLGMpe3ZhciBkLGUsZixnLGksaixrLGwsbSxuLG87ZD10aGlzLGU9dm9pZCAwLGc9dm9pZCAwO3RyeXtlPUpTT04ucGFyc2UoYS5kYXRhKX1jYXRjaChwKXtyZXR1cm4gZj1wLGMucmVqZWN0KG5ldyBFcnJvcihcIkVycm9yIHdoaWxlIHBhcnNpbmcgcmVzdWx0XCIpKSxhLmNhbGxiYWNrKG5ldyBFcnJvcihcIkVycm9yIHdoaWxlIHBhcnNpbmcgcmVzdWx0XCIpKX1pZihlJiZlLnByb3ZpZGVyKXtpZihhLnByb3ZpZGVyJiZlLnByb3ZpZGVyLnRvTG93ZXJDYXNlKCkhPT1hLnByb3ZpZGVyLnRvTG93ZXJDYXNlKCkpcmV0dXJuIGc9bmV3IEVycm9yKFwiUmV0dXJuZWQgcHJvdmlkZXIgbmFtZSBkb2VzIG5vdCBtYXRjaCBhc2tlZCBwcm92aWRlclwiKSxjLnJlamVjdChnKSxhLmNhbGxiYWNrJiZcImZ1bmN0aW9uXCI9PXR5cGVvZiBhLmNhbGxiYWNrP2EuY2FsbGJhY2soZyk6dm9pZCAwO2lmKFwiZXJyb3JcIj09PWUuc3RhdHVzfHxcImZhaWxcIj09PWUuc3RhdHVzKXJldHVybiBnPW5ldyBFcnJvcihlLm1lc3NhZ2UpLGcuYm9keT1lLmRhdGEsYy5yZWplY3QoZyksYS5jYWxsYmFjayYmXCJmdW5jdGlvblwiPT10eXBlb2YgYS5jYWxsYmFjaz9hLmNhbGxiYWNrKGcpOnZvaWQgMDtpZihcInN1Y2Nlc3NcIiE9PWUuc3RhdHVzfHwhZS5kYXRhKXJldHVybiBnPW5ldyBFcnJvcixnLmJvZHk9ZS5kYXRhLGMucmVqZWN0KGcpLGEuY2FsbGJhY2smJlwiZnVuY3Rpb25cIj09dHlwZW9mIGEuY2FsbGJhY2s/YS5jYWxsYmFjayhnKTp2b2lkIDA7ZS5zdGF0ZT1lLnN0YXRlLnJlcGxhY2UoL1xccysvZyxcIlwiKTtmb3IoaiBpbiBiKW89YltqXSxiW2pdPW8ucmVwbGFjZSgvXFxzKy9nLFwiXCIpO2lmKCFlLnN0YXRlfHwtMT09PWIuaW5kZXhPZihlLnN0YXRlKSlyZXR1cm4gYy5yZWplY3QobmV3IEVycm9yKFwiU3RhdGUgaXMgbm90IG1hdGNoaW5nXCIpKSxhLmNhbGxiYWNrJiZcImZ1bmN0aW9uXCI9PXR5cGVvZiBhLmNhbGxiYWNrP2EuY2FsbGJhY2sobmV3IEVycm9yKFwiU3RhdGUgaXMgbm90IG1hdGNoaW5nXCIpKTp2b2lkIDA7aWYoYS5wcm92aWRlcnx8KGUuZGF0YS5wcm92aWRlcj1lLnByb3ZpZGVyKSxtPWUuZGF0YSxtLnByb3ZpZGVyPWUucHJvdmlkZXIudG9Mb3dlckNhc2UoKSxoLmNhY2hlRW5hYmxlZChhLmNhY2hlKSYmbSYmaC5zdG9yZUNhY2hlKGUucHJvdmlkZXIsbSksbD1tLnJlcXVlc3QsZGVsZXRlIG0ucmVxdWVzdCxuPXZvaWQgMCxtLmFjY2Vzc190b2tlbj9uPXthY2Nlc3NfdG9rZW46bS5hY2Nlc3NfdG9rZW59Om0ub2F1dGhfdG9rZW4mJm0ub2F1dGhfdG9rZW5fc2VjcmV0JiYobj17b2F1dGhfdG9rZW46bS5vYXV0aF90b2tlbixvYXV0aF90b2tlbl9zZWNyZXQ6bS5vYXV0aF90b2tlbl9zZWNyZXR9KSwhbClyZXR1cm4gYy5yZXNvbHZlKG0pLGEuY2FsbGJhY2smJlwiZnVuY3Rpb25cIj09dHlwZW9mIGEuY2FsbGJhY2s/YS5jYWxsYmFjayhudWxsLG0pOnZvaWQgMDtpZihsLnJlcXVpcmVkKWZvcihpIGluIGwucmVxdWlyZWQpbltsLnJlcXVpcmVkW2ldXT1tW2wucmVxdWlyZWRbaV1dO3JldHVybiBrPWZ1bmN0aW9uKGEpe3JldHVybiBkLm1rSHR0cChlLnByb3ZpZGVyLG4sbCxhKX0sbS50b0pzb249ZnVuY3Rpb24oKXt2YXIgYTtyZXR1cm4gYT17fSxudWxsIT1tLmFjY2Vzc190b2tlbiYmKGEuYWNjZXNzX3Rva2VuPW0uYWNjZXNzX3Rva2VuKSxudWxsIT1tLm9hdXRoX3Rva2VuJiYoYS5vYXV0aF90b2tlbj1tLm9hdXRoX3Rva2VuKSxudWxsIT1tLm9hdXRoX3Rva2VuX3NlY3JldCYmKGEub2F1dGhfdG9rZW5fc2VjcmV0PW0ub2F1dGhfdG9rZW5fc2VjcmV0KSxudWxsIT1tLmV4cGlyZXNfaW4mJihhLmV4cGlyZXNfaW49bS5leHBpcmVzX2luKSxudWxsIT1tLnRva2VuX3R5cGUmJihhLnRva2VuX3R5cGU9bS50b2tlbl90eXBlKSxudWxsIT1tLmlkX3Rva2VuJiYoYS5pZF90b2tlbj1tLmlkX3Rva2VuKSxudWxsIT1tLnByb3ZpZGVyJiYoYS5wcm92aWRlcj1tLnByb3ZpZGVyKSxudWxsIT1tLmVtYWlsJiYoYS5lbWFpbD1tLmVtYWlsKSxhfSxtLmdldD1rKFwiR0VUXCIpLG0ucG9zdD1rKFwiUE9TVFwiKSxtLnB1dD1rKFwiUFVUXCIpLG0ucGF0Y2g9ayhcIlBBVENIXCIpLG0uZGVsPWsoXCJERUxFVEVcIiksbS5tZT1kLm1rSHR0cE1lKGUucHJvdmlkZXIsbixsLFwiR0VUXCIpLHRoaXMucmV0cmlldmVNZXRob2RzKCkudGhlbihmdW5jdGlvbihiKXtyZXR1cm4gZnVuY3Rpb24oKXtyZXR1cm4gYi5nZW5lcmF0ZU1ldGhvZHMobSxuLGUucHJvdmlkZXIpLGMucmVzb2x2ZShtKSxhLmNhbGxiYWNrJiZcImZ1bmN0aW9uXCI9PXR5cGVvZiBhLmNhbGxiYWNrP2EuY2FsbGJhY2sobnVsbCxtKTp2b2lkIDB9fSh0aGlzKSkuZmFpbChmdW5jdGlvbigpe3JldHVybiBmdW5jdGlvbihiKXtyZXR1cm4gY29uc29sZS5sb2coXCJDb3VsZCBub3QgcmV0cmlldmUgbWV0aG9kc1wiLGIpLGMucmVzb2x2ZShtKSxhLmNhbGxiYWNrJiZcImZ1bmN0aW9uXCI9PXR5cGVvZiBhLmNhbGxiYWNrP2EuY2FsbGJhY2sobnVsbCxtKTp2b2lkIDB9fSh0aGlzKSl9fX19fSx7XCIuLi90b29scy91cmxcIjoxNCxxOjE2fV0sNzpbZnVuY3Rpb24oYSxiKXtcInVzZSBzdHJpY3RcIjtiLmV4cG9ydHM9ZnVuY3Rpb24oYSl7dmFyIGIsYyxkLGUsZjtyZXR1cm4gYj1hLmdldEpxdWVyeSgpLGQ9YS5nZXRDb25maWcoKSxlPWEuZ2V0Q29va2llcygpLGY9bnVsbCxjPWZ1bmN0aW9uKCl7ZnVuY3Rpb24gYyhhKXt0aGlzLnRva2VuPWEudG9rZW4sdGhpcy5kYXRhPWEudXNlcix0aGlzLnByb3ZpZGVycz1hLnByb3ZpZGVycyxmPXRoaXMuZ2V0RWRpdGFibGVEYXRhKCl9cmV0dXJuIGMucHJvdG90eXBlLmdldEVkaXRhYmxlRGF0YT1mdW5jdGlvbigpe3ZhciBhLGI7YT1bXTtmb3IoYiBpbiB0aGlzLmRhdGEpLTE9PT1bXCJpZFwiLFwiZW1haWxcIl0uaW5kZXhPZihiKSYmYS5wdXNoKHtrZXk6Yix2YWx1ZTp0aGlzLmRhdGFbYl19KTtyZXR1cm4gYX0sYy5wcm90b3R5cGUuc2F2ZT1mdW5jdGlvbigpe3ZhciBiLGMsZSxnLGgsaSxqLGs7Zm9yKGM9e30sZz0wLGk9Zi5sZW5ndGg7aT5nO2crKyliPWZbZ10sdGhpcy5kYXRhW2Iua2V5XSE9PWIudmFsdWUmJihjW2Iua2V5XT10aGlzLmRhdGFbYi5rZXldKSxudWxsPT09dGhpcy5kYXRhW2Iua2V5XSYmZGVsZXRlIHRoaXMuZGF0YVtiLmtleV07Zm9yKGU9ZnVuY3Rpb24oYSl7dmFyIGIsYyxkO2ZvcihjPTAsZD1mLmxlbmd0aDtkPmM7YysrKWlmKGI9ZltjXSxiLmtleT09PWEpcmV0dXJuITA7cmV0dXJuITF9LGs9dGhpcy5nZXRFZGl0YWJsZURhdGEoKSxoPTAsaj1rLmxlbmd0aDtqPmg7aCsrKWI9a1toXSxlKGIua2V5KXx8KGNbYi5rZXldPXRoaXMuZGF0YVtiLmtleV0pO3JldHVybiB0aGlzLnNhdmVMb2NhbCgpLGEuQVBJLnB1dChcIi9hcGkvdXNlcm1hbmFnZW1lbnQvdXNlcj9rPVwiK2Qua2V5K1wiJnRva2VuPVwiK3RoaXMudG9rZW4sYyl9LGMucHJvdG90eXBlLnNlbGVjdD1mdW5jdGlvbigpe3ZhciBhO3JldHVybiBhPW51bGx9LGMucHJvdG90eXBlLnNhdmVMb2NhbD1mdW5jdGlvbigpe3ZhciBhO3JldHVybiBhPXt0b2tlbjp0aGlzLnRva2VuLHVzZXI6dGhpcy5kYXRhLHByb3ZpZGVyczp0aGlzLnByb3ZpZGVyc30sZS5lcmFzZUNvb2tpZShcIm9pb19hdXRoXCIpLGUuY3JlYXRlQ29va2llKFwib2lvX2F1dGhcIixKU09OLnN0cmluZ2lmeShhKSwyMTYwMCl9LGMucHJvdG90eXBlLmhhc1Byb3ZpZGVyPWZ1bmN0aW9uKGEpe3ZhciBiO3JldHVybi0xIT09KG51bGwhPShiPXRoaXMucHJvdmlkZXJzKT9iLmluZGV4T2YoYSk6dm9pZCAwKX0sYy5wcm90b3R5cGUuZ2V0UHJvdmlkZXJzPWZ1bmN0aW9uKCl7dmFyIGM7cmV0dXJuIGM9Yi5EZWZlcnJlZCgpLGEuQVBJLmdldChcIi9hcGkvdXNlcm1hbmFnZW1lbnQvdXNlci9wcm92aWRlcnM/az1cIitkLmtleStcIiZ0b2tlbj1cIit0aGlzLnRva2VuKS5kb25lKGZ1bmN0aW9uKGEpe3JldHVybiBmdW5jdGlvbihiKXtyZXR1cm4gYS5wcm92aWRlcnM9Yi5kYXRhLGEuc2F2ZUxvY2FsKCksYy5yZXNvbHZlKGEucHJvdmlkZXJzKX19KHRoaXMpKS5mYWlsKGZ1bmN0aW9uKGEpe3JldHVybiBjLnJlamVjdChhKX0pLGMucHJvbWlzZSgpfSxjLnByb3RvdHlwZS5hZGRQcm92aWRlcj1mdW5jdGlvbihjKXt2YXIgZTtyZXR1cm4gZT1iLkRlZmVycmVkKCksXCJmdW5jdGlvblwiPT10eXBlb2YgYy50b0pzb24mJihjPWMudG9Kc29uKCkpLGMuZW1haWw9dGhpcy5kYXRhLmVtYWlsLHRoaXMucHJvdmlkZXJzLnB1c2goYy5wcm92aWRlciksYS5BUEkucG9zdChcIi9hcGkvdXNlcm1hbmFnZW1lbnQvdXNlci9wcm92aWRlcnM/az1cIitkLmtleStcIiZ0b2tlbj1cIit0aGlzLnRva2VuLGMpLmRvbmUoZnVuY3Rpb24oYSl7cmV0dXJuIGZ1bmN0aW9uKGIpe3JldHVybiBhLmRhdGE9Yi5kYXRhLGEuc2F2ZUxvY2FsKCksZS5yZXNvbHZlKCl9fSh0aGlzKSkuZmFpbChmdW5jdGlvbihhKXtyZXR1cm4gZnVuY3Rpb24oYil7cmV0dXJuIGEucHJvdmlkZXJzLnNwbGljZShhLnByb3ZpZGVycy5pbmRleE9mKGMucHJvdmlkZXIpLDEpLGUucmVqZWN0KGIpfX0odGhpcykpLGUucHJvbWlzZSgpfSxjLnByb3RvdHlwZS5yZW1vdmVQcm92aWRlcj1mdW5jdGlvbihjKXt2YXIgZTtyZXR1cm4gZT1iLkRlZmVycmVkKCksdGhpcy5wcm92aWRlcnMuc3BsaWNlKHRoaXMucHJvdmlkZXJzLmluZGV4T2YoYyksMSksYS5BUEkuZGVsKFwiL2FwaS91c2VybWFuYWdlbWVudC91c2VyL3Byb3ZpZGVycy9cIitjK1wiP2s9XCIrZC5rZXkrXCImdG9rZW49XCIrdGhpcy50b2tlbikuZG9uZShmdW5jdGlvbihhKXtyZXR1cm4gZnVuY3Rpb24oYil7cmV0dXJuIGEuc2F2ZUxvY2FsKCksZS5yZXNvbHZlKGIpfX0odGhpcykpLmZhaWwoZnVuY3Rpb24oYSl7cmV0dXJuIGZ1bmN0aW9uKGIpe3JldHVybiBhLnByb3ZpZGVycy5wdXNoKGMpLGUucmVqZWN0KGIpfX0odGhpcykpLGUucHJvbWlzZSgpfSxjLnByb3RvdHlwZS5jaGFuZ2VQYXNzd29yZD1mdW5jdGlvbihiLGMpe3JldHVybiBhLkFQSS5wb3N0KFwiL2FwaS91c2VybWFuYWdlbWVudC91c2VyL3Bhc3N3b3JkP2s9XCIrZC5rZXkrXCImdG9rZW49XCIrdGhpcy50b2tlbix7cGFzc3dvcmQ6Y30pfSxjLnByb3RvdHlwZS5pc0xvZ2d1ZWQ9ZnVuY3Rpb24oKXtyZXR1cm4gYS5Vc2VyLmlzTG9nZ2VkKCl9LGMucHJvdG90eXBlLmxvZ291dD1mdW5jdGlvbigpe3ZhciBjO3JldHVybiBjPWIuRGVmZXJyZWQoKSxlLmVyYXNlQ29va2llKFwib2lvX2F1dGhcIiksYS5BUEkucG9zdChcIi9hcGkvdXNlcm1hbmFnZW1lbnQvdXNlci9sb2dvdXQ/az1cIitkLmtleStcIiZ0b2tlbj1cIit0aGlzLnRva2VuKS5kb25lKGZ1bmN0aW9uKCl7cmV0dXJuIGMucmVzb2x2ZSgpfSkuZmFpbChmdW5jdGlvbihhKXtyZXR1cm4gYy5yZWplY3QoYSl9KSxjLnByb21pc2UoKX0sY30oKSx7aW5pdGlhbGl6ZTpmdW5jdGlvbihiLGMpe3JldHVybiBhLmluaXRpYWxpemUoYixjKX0sc2V0T0F1dGhkVVJMOmZ1bmN0aW9uKGIpe3JldHVybiBhLnNldE9BdXRoZFVSTChiKX0sc2lnbnVwOmZ1bmN0aW9uKGYpe3ZhciBnO3JldHVybiBnPWIuRGVmZXJyZWQoKSxcImZ1bmN0aW9uXCI9PXR5cGVvZiBmLnRvSnNvbiYmKGY9Zi50b0pzb24oKSksYS5BUEkucG9zdChcIi9hcGkvdXNlcm1hbmFnZW1lbnQvc2lnbnVwP2s9XCIrZC5rZXksZikuZG9uZShmdW5jdGlvbihhKXtyZXR1cm4gZS5jcmVhdGVDb29raWUoXCJvaW9fYXV0aFwiLEpTT04uc3RyaW5naWZ5KGEuZGF0YSksYS5kYXRhLmV4cGlyZXNfaW58fDIxNjAwKSxnLnJlc29sdmUobmV3IGMoYS5kYXRhKSl9KS5mYWlsKGZ1bmN0aW9uKGEpe3JldHVybiBnLnJlamVjdChhKX0pLGcucHJvbWlzZSgpfSxzaWduaW46ZnVuY3Rpb24oZixnKXt2YXIgaCxpO3JldHVybiBoPWIuRGVmZXJyZWQoKSxcInN0cmluZ1wiPT10eXBlb2YgZnx8Zz9hLkFQSS5wb3N0KFwiL2FwaS91c2VybWFuYWdlbWVudC9zaWduaW4/az1cIitkLmtleSx7ZW1haWw6ZixwYXNzd29yZDpnfSkuZG9uZShmdW5jdGlvbihhKXtyZXR1cm4gZS5jcmVhdGVDb29raWUoXCJvaW9fYXV0aFwiLEpTT04uc3RyaW5naWZ5KGEuZGF0YSksYS5kYXRhLmV4cGlyZXNfaW58fDIxNjAwKSxoLnJlc29sdmUobmV3IGMoYS5kYXRhKSl9KS5mYWlsKGZ1bmN0aW9uKGEpe3JldHVybiBoLnJlamVjdChhKX0pOihpPWYsXCJmdW5jdGlvblwiPT10eXBlb2YgaS50b0pzb24mJihpPWkudG9Kc29uKCkpLGEuQVBJLnBvc3QoXCIvYXBpL3VzZXJtYW5hZ2VtZW50L3NpZ25pbj9rPVwiK2Qua2V5LGkpLmRvbmUoZnVuY3Rpb24oYSl7cmV0dXJuIGUuY3JlYXRlQ29va2llKFwib2lvX2F1dGhcIixKU09OLnN0cmluZ2lmeShhLmRhdGEpLGEuZGF0YS5leHBpcmVzX2lufHwyMTYwMCksaC5yZXNvbHZlKG5ldyBjKGEuZGF0YSkpfSkuZmFpbChmdW5jdGlvbihhKXtyZXR1cm4gaC5yZWplY3QoYSl9KSksaC5wcm9taXNlKCl9LGNvbmZpcm1SZXNldFBhc3N3b3JkOmZ1bmN0aW9uKGIsYyl7cmV0dXJuIGEuQVBJLnBvc3QoXCIvYXBpL3VzZXJtYW5hZ2VtZW50L3VzZXIvcGFzc3dvcmQ/az1cIitkLmtleStcIiZ0b2tlbj1cIit0aGlzLnRva2VuLHtwYXNzd29yZDpiLHBhc3N3b3JkS2V5OmN9KX0scmVzZXRQYXNzd29yZDpmdW5jdGlvbihiKXtyZXR1cm4gYS5BUEkucG9zdChcIi9hcGkvdXNlcm1hbmFnZW1lbnQvcGFzc3dvcmQvcmVzZXQ/az1cIitkLmtleSx7ZW1haWw6Yn0pfSxyZWZyZXNoSWRlbnRpdHk6ZnVuY3Rpb24oKXt2YXIgZjtyZXR1cm4gZj1iLkRlZmVycmVkKCksYS5BUEkuZ2V0KFwiL2FwaS91c2VybWFuYWdlbWVudC91c2VyP2s9XCIrZC5rZXkrXCImdG9rZW49XCIrZS5yZWFkQ29va2llKFwib2lvX2F1dGhcIikpLmRvbmUoZnVuY3Rpb24oYSl7cmV0dXJuIGYucmVzb2x2ZShuZXcgYyhhLmRhdGEpKX0pLmZhaWwoZnVuY3Rpb24oYSl7cmV0dXJuIGYucmVqZWN0KGEpfSksZi5wcm9taXNlKCl9LGdldElkZW50aXR5OmZ1bmN0aW9uKCl7cmV0dXJuIG5ldyBjKEpTT04ucGFyc2UoZS5yZWFkQ29va2llKFwib2lvX2F1dGhcIikpKX0saXNMb2dnZWQ6ZnVuY3Rpb24oKXt2YXIgYTtyZXR1cm4gYT1lLnJlYWRDb29raWUoXCJvaW9fYXV0aFwiKSxhPyEwOiExfX19fSx7fV0sODpbZnVuY3Rpb24oYSl7IWZ1bmN0aW9uKCl7dmFyIGIsYztyZXR1cm4gYz1hKFwiLi90b29scy9qcXVlcnktbGl0ZS5qc1wiKSxiPWEoXCIuL2xpYi9jb3JlXCIpKHdpbmRvdyxkb2N1bWVudCxjLG5hdmlnYXRvciksYi5leHRlbmQoXCJPQXV0aFwiLGEoXCIuL2xpYi9vYXV0aFwiKSksYi5leHRlbmQoXCJBUElcIixhKFwiLi9saWIvYXBpXCIpKSxiLmV4dGVuZChcIlVzZXJcIixhKFwiLi9saWIvdXNlclwiKSksXCJ1bmRlZmluZWRcIiE9dHlwZW9mIGFuZ3VsYXImJm51bGwhPT1hbmd1bGFyJiZhbmd1bGFyLm1vZHVsZShcIm9hdXRoaW9cIixbXSkuZmFjdG9yeShcIk1hdGVyaWFcIixbZnVuY3Rpb24oKXtyZXR1cm4gYn1dKS5mYWN0b3J5KFwiT0F1dGhcIixbZnVuY3Rpb24oKXtyZXR1cm4gYi5PQXV0aH1dKS5mYWN0b3J5KFwiVXNlclwiLFtmdW5jdGlvbigpe3JldHVybiBiLlVzZXJ9XSksd2luZG93Lk1hdGVyaWE9Yix3aW5kb3cuVXNlcj13aW5kb3cuTWF0ZXJpYS5Vc2VyLHdpbmRvdy5PQXV0aD13aW5kb3cuTWF0ZXJpYS5PQXV0aH0oKX0se1wiLi9saWIvYXBpXCI6MixcIi4vbGliL2NvcmVcIjozLFwiLi9saWIvb2F1dGhcIjo0LFwiLi9saWIvdXNlclwiOjcsXCIuL3Rvb2xzL2pxdWVyeS1saXRlLmpzXCI6MTF9XSw5OltmdW5jdGlvbihhLGIpe1widXNlIHN0cmljdFwiO2IuZXhwb3J0cz17aW5pdDpmdW5jdGlvbihhLGIpe3JldHVybiB0aGlzLmNvbmZpZz1iLHRoaXMuY29va2llcz1hfSx0cnlDYWNoZTpmdW5jdGlvbihhLGIsYyl7dmFyIGQsZSxmO2lmKHRoaXMuY2FjaGVFbmFibGVkKGMpKXtpZihjPXRoaXMuY29va2llcy5yZWFkQ29va2llKFwib2F1dGhpb19wcm92aWRlcl9cIitiKSwhYylyZXR1cm4hMTtjPWRlY29kZVVSSUNvbXBvbmVudChjKX1pZihcInN0cmluZ1wiPT10eXBlb2YgYyl0cnl7Yz1KU09OLnBhcnNlKGMpfWNhdGNoKGcpe3JldHVybiBkPWcsITF9aWYoXCJvYmplY3RcIj09dHlwZW9mIGMpe2Y9e307Zm9yKGUgaW4gYylcInJlcXVlc3RcIiE9PWUmJlwiZnVuY3Rpb25cIiE9dHlwZW9mIGNbZV0mJihmW2VdPWNbZV0pO3JldHVybiBhLmNyZWF0ZShiLGYsYy5yZXF1ZXN0KX1yZXR1cm4hMX0sc3RvcmVDYWNoZTpmdW5jdGlvbihhLGIpe3RoaXMuY29va2llcy5jcmVhdGVDb29raWUoXCJvYXV0aGlvX3Byb3ZpZGVyX1wiK2EsZW5jb2RlVVJJQ29tcG9uZW50KEpTT04uc3RyaW5naWZ5KGIpKSxiLmV4cGlyZXNfaW4tMTB8fDM2MDApfSxjYWNoZUVuYWJsZWQ6ZnVuY3Rpb24oYSl7cmV0dXJuXCJ1bmRlZmluZWRcIj09dHlwZW9mIGE/dGhpcy5jb25maWcub3B0aW9ucy5jYWNoZTphfX19LHt9XSwxMDpbZnVuY3Rpb24oYSxiKXtcInVzZSBzdHJpY3RcIjtiLmV4cG9ydHM9e2luaXQ6ZnVuY3Rpb24oYSxiKXtyZXR1cm4gdGhpcy5jb25maWc9YSx0aGlzLmRvY3VtZW50PWJ9LGNyZWF0ZUNvb2tpZTpmdW5jdGlvbihhLGIsYyl7dmFyIGQ7dGhpcy5lcmFzZUNvb2tpZShhKSxkPW5ldyBEYXRlLGQuc2V0VGltZShkLmdldFRpbWUoKSsxZTMqKGN8fDEyMDApKSxjPVwiOyBleHBpcmVzPVwiK2QudG9HTVRTdHJpbmcoKSx0aGlzLmRvY3VtZW50LmNvb2tpZT1hK1wiPVwiK2IrYytcIjsgcGF0aD0vXCJ9LHJlYWRDb29raWU6ZnVuY3Rpb24oYSl7dmFyIGIsYyxkLGU7Zm9yKGU9YStcIj1cIixjPXRoaXMuZG9jdW1lbnQuY29va2llLnNwbGl0KFwiO1wiKSxkPTA7ZDxjLmxlbmd0aDspe2ZvcihiPWNbZF07XCIgXCI9PT1iLmNoYXJBdCgwKTspYj1iLnN1YnN0cmluZygxLGIubGVuZ3RoKTtpZigwPT09Yi5pbmRleE9mKGUpKXJldHVybiBiLnN1YnN0cmluZyhlLmxlbmd0aCxiLmxlbmd0aCk7ZCsrfXJldHVybiBudWxsfSxlcmFzZUNvb2tpZTpmdW5jdGlvbihhKXt2YXIgYjtiPW5ldyBEYXRlLGIuc2V0VGltZShiLmdldFRpbWUoKS04NjRlNSksdGhpcy5kb2N1bWVudC5jb29raWU9YStcIj07IGV4cGlyZXM9XCIrYi50b0dNVFN0cmluZygpK1wiOyBwYXRoPS9cIn19fSx7fV0sMTE6W2Z1bmN0aW9uKGEsYil7IWZ1bmN0aW9uKGEsYyl7XCJvYmplY3RcIj09dHlwZW9mIGImJlwib2JqZWN0XCI9PXR5cGVvZiBiLmV4cG9ydHM/Yi5leHBvcnRzPWEuZG9jdW1lbnQ/YyhhLCEwKTpmdW5jdGlvbihhKXtpZighYS5kb2N1bWVudCl0aHJvdyBuZXcgRXJyb3IoXCJqUXVlcnkgcmVxdWlyZXMgYSB3aW5kb3cgd2l0aCBhIGRvY3VtZW50XCIpO3JldHVybiBjKGEpfTpjKGEpfShcInVuZGVmaW5lZFwiIT10eXBlb2Ygd2luZG93P3dpbmRvdzp0aGlzLGZ1bmN0aW9uKGEpe2Z1bmN0aW9uIGIoYSl7dmFyIGI9YS5sZW5ndGgsYz1BLnR5cGUoYSk7cmV0dXJuXCJmdW5jdGlvblwiPT09Y3x8QS5pc1dpbmRvdyhhKT8hMToxPT09YS5ub2RlVHlwZSYmYj8hMDpcImFycmF5XCI9PT1jfHwwPT09Ynx8XCJudW1iZXJcIj09dHlwZW9mIGImJmI+MCYmYi0xIGluIGF9ZnVuY3Rpb24gYyhhKXt2YXIgYj1LW2FdPXt9O3JldHVybiBBLmVhY2goYS5tYXRjaChKKXx8W10sZnVuY3Rpb24oYSxjKXtiW2NdPSEwfSksYn1mdW5jdGlvbiBkKCl7eS5yZW1vdmVFdmVudExpc3RlbmVyKFwiRE9NQ29udGVudExvYWRlZFwiLGQsITEpLGEucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImxvYWRcIixkLCExKSxBLnJlYWR5KCl9ZnVuY3Rpb24gZSgpe09iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLmNhY2hlPXt9LDAse2dldDpmdW5jdGlvbigpe3JldHVybnt9fX0pLHRoaXMuZXhwYW5kbz1BLmV4cGFuZG8rTWF0aC5yYW5kb20oKX1mdW5jdGlvbiBmKGEsYixjKXt2YXIgZDtpZih2b2lkIDA9PT1jJiYxPT09YS5ub2RlVHlwZSlpZihkPVwiZGF0YS1cIitiLnJlcGxhY2UoUCxcIi0kMVwiKS50b0xvd2VyQ2FzZSgpLGM9YS5nZXRBdHRyaWJ1dGUoZCksXCJzdHJpbmdcIj09dHlwZW9mIGMpe3RyeXtjPVwidHJ1ZVwiPT09Yz8hMDpcImZhbHNlXCI9PT1jPyExOlwibnVsbFwiPT09Yz9udWxsOitjK1wiXCI9PT1jPytjOk8udGVzdChjKT9BLnBhcnNlSlNPTihjKTpjfWNhdGNoKGUpe31kYXRhX3VzZXIuc2V0KGEsYixjKX1lbHNlIGM9dm9pZCAwO3JldHVybiBjfWZ1bmN0aW9uIGcoKXtyZXR1cm4hMH1mdW5jdGlvbiBoKCl7cmV0dXJuITF9ZnVuY3Rpb24gaSgpe3RyeXtyZXR1cm4geS5hY3RpdmVFbGVtZW50fWNhdGNoKGEpe319ZnVuY3Rpb24gaihhKXtyZXR1cm4gZnVuY3Rpb24oYixjKXtcInN0cmluZ1wiIT10eXBlb2YgYiYmKGM9YixiPVwiKlwiKTt2YXIgZCxlPTAsZj1iLnRvTG93ZXJDYXNlKCkubWF0Y2goSil8fFtdO2lmKEEuaXNGdW5jdGlvbihjKSlmb3IoO2Q9ZltlKytdOylcIitcIj09PWRbMF0/KGQ9ZC5zbGljZSgxKXx8XCIqXCIsKGFbZF09YVtkXXx8W10pLnVuc2hpZnQoYykpOihhW2RdPWFbZF18fFtdKS5wdXNoKGMpfX1mdW5jdGlvbiBrKGEsYixjLGQpe2Z1bmN0aW9uIGUoaCl7dmFyIGk7cmV0dXJuIGZbaF09ITAsQS5lYWNoKGFbaF18fFtdLGZ1bmN0aW9uKGEsaCl7dmFyIGo9aChiLGMsZCk7cmV0dXJuXCJzdHJpbmdcIiE9dHlwZW9mIGp8fGd8fGZbal0/Zz8hKGk9aik6dm9pZCAwOihiLmRhdGFUeXBlcy51bnNoaWZ0KGopLGUoaiksITEpfSksaX12YXIgZj17fSxnPWE9PT1mYjtyZXR1cm4gZShiLmRhdGFUeXBlc1swXSl8fCFmW1wiKlwiXSYmZShcIipcIil9ZnVuY3Rpb24gbChhLGIpe3ZhciBjLGQsZT1BLmFqYXhTZXR0aW5ncy5mbGF0T3B0aW9uc3x8e307Zm9yKGMgaW4gYil2b2lkIDAhPT1iW2NdJiYoKGVbY10/YTpkfHwoZD17fSkpW2NdPWJbY10pO3JldHVybiBkJiZBLmV4dGVuZCghMCxhLGQpLGF9ZnVuY3Rpb24gbShhLGIsYyl7Zm9yKHZhciBkLGUsZixnLGg9YS5jb250ZW50cyxpPWEuZGF0YVR5cGVzO1wiKlwiPT09aVswXTspaS5zaGlmdCgpLHZvaWQgMD09PWQmJihkPWEubWltZVR5cGV8fGIuZ2V0UmVzcG9uc2VIZWFkZXIoXCJDb250ZW50LVR5cGVcIikpO2lmKGQpZm9yKGUgaW4gaClpZihoW2VdJiZoW2VdLnRlc3QoZCkpe2kudW5zaGlmdChlKTticmVha31pZihpWzBdaW4gYylmPWlbMF07ZWxzZXtmb3IoZSBpbiBjKXtpZighaVswXXx8YS5jb252ZXJ0ZXJzW2UrXCIgXCIraVswXV0pe2Y9ZTticmVha31nfHwoZz1lKX1mPWZ8fGd9cmV0dXJuIGY/KGYhPT1pWzBdJiZpLnVuc2hpZnQoZiksY1tmXSk6dm9pZCAwfWZ1bmN0aW9uIG4oYSxiLGMsZCl7dmFyIGUsZixnLGgsaSxqPXt9LGs9YS5kYXRhVHlwZXMuc2xpY2UoKTtpZihrWzFdKWZvcihnIGluIGEuY29udmVydGVycylqW2cudG9Mb3dlckNhc2UoKV09YS5jb252ZXJ0ZXJzW2ddO2ZvcihmPWsuc2hpZnQoKTtmOylpZihhLnJlc3BvbnNlRmllbGRzW2ZdJiYoY1thLnJlc3BvbnNlRmllbGRzW2ZdXT1iKSwhaSYmZCYmYS5kYXRhRmlsdGVyJiYoYj1hLmRhdGFGaWx0ZXIoYixhLmRhdGFUeXBlKSksaT1mLGY9ay5zaGlmdCgpKWlmKFwiKlwiPT09ZilmPWk7ZWxzZSBpZihcIipcIiE9PWkmJmkhPT1mKXtpZihnPWpbaStcIiBcIitmXXx8altcIiogXCIrZl0sIWcpZm9yKGUgaW4gailpZihoPWUuc3BsaXQoXCIgXCIpLGhbMV09PT1mJiYoZz1qW2krXCIgXCIraFswXV18fGpbXCIqIFwiK2hbMF1dKSl7Zz09PSEwP2c9altlXTpqW2VdIT09ITAmJihmPWhbMF0say51bnNoaWZ0KGhbMV0pKTticmVha31pZihnIT09ITApaWYoZyYmYVtcInRocm93c1wiXSliPWcoYik7ZWxzZSB0cnl7Yj1nKGIpfWNhdGNoKGwpe3JldHVybntzdGF0ZTpcInBhcnNlcmVycm9yXCIsZXJyb3I6Zz9sOlwiTm8gY29udmVyc2lvbiBmcm9tIFwiK2krXCIgdG8gXCIrZn19fXJldHVybntzdGF0ZTpcInN1Y2Nlc3NcIixkYXRhOmJ9fWZ1bmN0aW9uIG8oYSxiLGMsZCl7dmFyIGU7aWYoQS5pc0FycmF5KGIpKUEuZWFjaChiLGZ1bmN0aW9uKGIsZSl7Y3x8amIudGVzdChhKT9kKGEsZSk6byhhK1wiW1wiKyhcIm9iamVjdFwiPT10eXBlb2YgZT9iOlwiXCIpK1wiXVwiLGUsYyxkKX0pO2Vsc2UgaWYoY3x8XCJvYmplY3RcIiE9PUEudHlwZShiKSlkKGEsYik7ZWxzZSBmb3IoZSBpbiBiKW8oYStcIltcIitlK1wiXVwiLGJbZV0sYyxkKX12YXIgcD1bXSxxPXAuc2xpY2Uscj1wLmNvbmNhdCxzPXAucHVzaCx0PXAuaW5kZXhPZix1PXt9LHY9dS50b1N0cmluZyx3PXUuaGFzT3duUHJvcGVydHkseD17fSx5PWEuZG9jdW1lbnQsej1cIjIuMS4xIC1hdHRyaWJ1dGVzLC1hdHRyaWJ1dGVzL2F0dHIsLWF0dHJpYnV0ZXMvY2xhc3NlcywtYXR0cmlidXRlcy9wcm9wLC1hdHRyaWJ1dGVzL3N1cHBvcnQsLWF0dHJpYnV0ZXMvdmFsLC1jc3MvYWRkR2V0SG9va0lmLC1jc3MvY3VyQ1NTLC1jc3MvZGVmYXVsdERpc3BsYXksLWNzcy9oaWRkZW5WaXNpYmxlU2VsZWN0b3JzLC1jc3Mvc3VwcG9ydCwtY3NzL3N3YXAsLWNzcy92YXIsLWNzcy92YXIvY3NzRXhwYW5kLC1jc3MvdmFyL2dldFN0eWxlcywtY3NzL3Zhci9pc0hpZGRlbiwtY3NzL3Zhci9ybWFyZ2luLC1jc3MvdmFyL3JudW1ub25weCwtY3NzLC1lZmZlY3RzLC1lZmZlY3RzL1R3ZWVuLC1lZmZlY3RzL2FuaW1hdGVkU2VsZWN0b3IsLWRpbWVuc2lvbnMsLW9mZnNldCwtZGF0YS92YXIvZGF0YV91c2VyLC1kZXByZWNhdGVkLC1ldmVudC9hbGlhcywtZXZlbnQvc3VwcG9ydCwtaW50cm8sLW1hbmlwdWxhdGlvbi9fZXZhbFVybCwtbWFuaXB1bGF0aW9uL3N1cHBvcnQsLW1hbmlwdWxhdGlvbi92YXIsLW1hbmlwdWxhdGlvbi92YXIvcmNoZWNrYWJsZVR5cGUsLW1hbmlwdWxhdGlvbiwtb3V0cm8sLXF1ZXVlLC1xdWV1ZS9kZWxheSwtc2VsZWN0b3ItbmF0aXZlLC1zZWxlY3Rvci1zaXp6bGUsLXNpenpsZS9kaXN0LC1zaXp6bGUvZGlzdC9zaXp6bGUsLXNpenpsZS9kaXN0L21pbiwtc2l6emxlL3Rlc3QsLXNpenpsZS90ZXN0L2pxdWVyeSwtdHJhdmVyc2luZywtdHJhdmVyc2luZy9maW5kRmlsdGVyLC10cmF2ZXJzaW5nL3Zhci9ybmVlZHNDb250ZXh0LC10cmF2ZXJzaW5nL3Zhciwtd3JhcCwtZXhwb3J0cywtZXhwb3J0cy9hbWRcIixBPWZ1bmN0aW9uKGEsYil7cmV0dXJuIG5ldyBBLmZuLmluaXQoYSxiKX0sQj0vXltcXHNcXHVGRUZGXFx4QTBdK3xbXFxzXFx1RkVGRlxceEEwXSskL2csQz0vXi1tcy0vLEQ9Ly0oW1xcZGEtel0pL2dpLEU9ZnVuY3Rpb24oYSxiKXtyZXR1cm4gYi50b1VwcGVyQ2FzZSgpfTtBLmZuPUEucHJvdG90eXBlPXtqcXVlcnk6eixjb25zdHJ1Y3RvcjpBLHNlbGVjdG9yOlwiXCIsbGVuZ3RoOjAsdG9BcnJheTpmdW5jdGlvbigpe3JldHVybiBxLmNhbGwodGhpcyl9LGdldDpmdW5jdGlvbihhKXtyZXR1cm4gbnVsbCE9YT8wPmE/dGhpc1thK3RoaXMubGVuZ3RoXTp0aGlzW2FdOnEuY2FsbCh0aGlzKX0scHVzaFN0YWNrOmZ1bmN0aW9uKGEpe3ZhciBiPUEubWVyZ2UodGhpcy5jb25zdHJ1Y3RvcigpLGEpO3JldHVybiBiLnByZXZPYmplY3Q9dGhpcyxiLmNvbnRleHQ9dGhpcy5jb250ZXh0LGJ9LGVhY2g6ZnVuY3Rpb24oYSxiKXtyZXR1cm4gQS5lYWNoKHRoaXMsYSxiKX0sbWFwOmZ1bmN0aW9uKGEpe3JldHVybiB0aGlzLnB1c2hTdGFjayhBLm1hcCh0aGlzLGZ1bmN0aW9uKGIsYyl7cmV0dXJuIGEuY2FsbChiLGMsYil9KSl9LHNsaWNlOmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMucHVzaFN0YWNrKHEuYXBwbHkodGhpcyxhcmd1bWVudHMpKX0sZmlyc3Q6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5lcSgwKX0sbGFzdDpmdW5jdGlvbigpe3JldHVybiB0aGlzLmVxKC0xKX0sZXE6ZnVuY3Rpb24oYSl7dmFyIGI9dGhpcy5sZW5ndGgsYz0rYSsoMD5hP2I6MCk7cmV0dXJuIHRoaXMucHVzaFN0YWNrKGM+PTAmJmI+Yz9bdGhpc1tjXV06W10pfSxlbmQ6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5wcmV2T2JqZWN0fHx0aGlzLmNvbnN0cnVjdG9yKG51bGwpfSxwdXNoOnMsc29ydDpwLnNvcnQsc3BsaWNlOnAuc3BsaWNlfSxBLmV4dGVuZD1BLmZuLmV4dGVuZD1mdW5jdGlvbigpe3ZhciBhLGIsYyxkLGUsZixnPWFyZ3VtZW50c1swXXx8e30saD0xLGk9YXJndW1lbnRzLmxlbmd0aCxqPSExO2ZvcihcImJvb2xlYW5cIj09dHlwZW9mIGcmJihqPWcsZz1hcmd1bWVudHNbaF18fHt9LGgrKyksXCJvYmplY3RcIj09dHlwZW9mIGd8fEEuaXNGdW5jdGlvbihnKXx8KGc9e30pLGg9PT1pJiYoZz10aGlzLGgtLSk7aT5oO2grKylpZihudWxsIT0oYT1hcmd1bWVudHNbaF0pKWZvcihiIGluIGEpYz1nW2JdLGQ9YVtiXSxnIT09ZCYmKGomJmQmJihBLmlzUGxhaW5PYmplY3QoZCl8fChlPUEuaXNBcnJheShkKSkpPyhlPyhlPSExLGY9YyYmQS5pc0FycmF5KGMpP2M6W10pOmY9YyYmQS5pc1BsYWluT2JqZWN0KGMpP2M6e30sZ1tiXT1BLmV4dGVuZChqLGYsZCkpOnZvaWQgMCE9PWQmJihnW2JdPWQpKTtyZXR1cm4gZ30sQS5leHRlbmQoe2V4cGFuZG86XCJqUXVlcnlcIisoeitNYXRoLnJhbmRvbSgpKS5yZXBsYWNlKC9cXEQvZyxcIlwiKSxpc1JlYWR5OiEwLGVycm9yOmZ1bmN0aW9uKGEpe3Rocm93IG5ldyBFcnJvcihhKX0sbm9vcDpmdW5jdGlvbigpe30saXNGdW5jdGlvbjpmdW5jdGlvbihhKXtyZXR1cm5cImZ1bmN0aW9uXCI9PT1BLnR5cGUoYSl9LGlzQXJyYXk6QXJyYXkuaXNBcnJheSxpc1dpbmRvdzpmdW5jdGlvbihhKXtyZXR1cm4gbnVsbCE9YSYmYT09PWEud2luZG93fSxpc051bWVyaWM6ZnVuY3Rpb24oYSl7cmV0dXJuIUEuaXNBcnJheShhKSYmYS1wYXJzZUZsb2F0KGEpPj0wfSxpc1BsYWluT2JqZWN0OmZ1bmN0aW9uKGEpe3JldHVyblwib2JqZWN0XCIhPT1BLnR5cGUoYSl8fGEubm9kZVR5cGV8fEEuaXNXaW5kb3coYSk/ITE6YS5jb25zdHJ1Y3RvciYmIXcuY2FsbChhLmNvbnN0cnVjdG9yLnByb3RvdHlwZSxcImlzUHJvdG90eXBlT2ZcIik/ITE6ITB9LGlzRW1wdHlPYmplY3Q6ZnVuY3Rpb24oYSl7dmFyIGI7Zm9yKGIgaW4gYSlyZXR1cm4hMTtyZXR1cm4hMH0sdHlwZTpmdW5jdGlvbihhKXtyZXR1cm4gbnVsbD09YT9hK1wiXCI6XCJvYmplY3RcIj09dHlwZW9mIGF8fFwiZnVuY3Rpb25cIj09dHlwZW9mIGE/dVt2LmNhbGwoYSldfHxcIm9iamVjdFwiOnR5cGVvZiBhfSxnbG9iYWxFdmFsOmZ1bmN0aW9uKGEpe3ZhciBiLGM9ZXZhbDthPUEudHJpbShhKSxhJiYoMT09PWEuaW5kZXhPZihcInVzZSBzdHJpY3RcIik/KGI9eS5jcmVhdGVFbGVtZW50KFwic2NyaXB0XCIpLGIudGV4dD1hLHkuaGVhZC5hcHBlbmRDaGlsZChiKS5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKGIpKTpjKGEpKX0sY2FtZWxDYXNlOmZ1bmN0aW9uKGEpe3JldHVybiBhLnJlcGxhY2UoQyxcIm1zLVwiKS5yZXBsYWNlKEQsRSl9LG5vZGVOYW1lOmZ1bmN0aW9uKGEsYil7cmV0dXJuIGEubm9kZU5hbWUmJmEubm9kZU5hbWUudG9Mb3dlckNhc2UoKT09PWIudG9Mb3dlckNhc2UoKX0sZWFjaDpmdW5jdGlvbihhLGMsZCl7dmFyIGUsZj0wLGc9YS5sZW5ndGgsaD1iKGEpO2lmKGQpe2lmKGgpZm9yKDtnPmYmJihlPWMuYXBwbHkoYVtmXSxkKSxlIT09ITEpO2YrKyk7ZWxzZSBmb3IoZiBpbiBhKWlmKGU9Yy5hcHBseShhW2ZdLGQpLGU9PT0hMSlicmVha31lbHNlIGlmKGgpZm9yKDtnPmYmJihlPWMuY2FsbChhW2ZdLGYsYVtmXSksZSE9PSExKTtmKyspO2Vsc2UgZm9yKGYgaW4gYSlpZihlPWMuY2FsbChhW2ZdLGYsYVtmXSksZT09PSExKWJyZWFrO3JldHVybiBhfSx0cmltOmZ1bmN0aW9uKGEpe3JldHVybiBudWxsPT1hP1wiXCI6KGErXCJcIikucmVwbGFjZShCLFwiXCIpfSxtYWtlQXJyYXk6ZnVuY3Rpb24oYSxjKXt2YXIgZD1jfHxbXTtyZXR1cm4gbnVsbCE9YSYmKGIoT2JqZWN0KGEpKT9BLm1lcmdlKGQsXCJzdHJpbmdcIj09dHlwZW9mIGE/W2FdOmEpOnMuY2FsbChkLGEpKSxkfSxpbkFycmF5OmZ1bmN0aW9uKGEsYixjKXtyZXR1cm4gbnVsbD09Yj8tMTp0LmNhbGwoYixhLGMpfSxtZXJnZTpmdW5jdGlvbihhLGIpe2Zvcih2YXIgYz0rYi5sZW5ndGgsZD0wLGU9YS5sZW5ndGg7Yz5kO2QrKylhW2UrK109YltkXTtyZXR1cm4gYS5sZW5ndGg9ZSxhfSxncmVwOmZ1bmN0aW9uKGEsYixjKXtmb3IodmFyIGQsZT1bXSxmPTAsZz1hLmxlbmd0aCxoPSFjO2c+ZjtmKyspZD0hYihhW2ZdLGYpLGQhPT1oJiZlLnB1c2goYVtmXSk7cmV0dXJuIGV9LG1hcDpmdW5jdGlvbihhLGMsZCl7dmFyIGUsZj0wLGc9YS5sZW5ndGgsaD1iKGEpLGk9W107aWYoaClmb3IoO2c+ZjtmKyspZT1jKGFbZl0sZixkKSxudWxsIT1lJiZpLnB1c2goZSk7ZWxzZSBmb3IoZiBpbiBhKWU9YyhhW2ZdLGYsZCksbnVsbCE9ZSYmaS5wdXNoKGUpO3JldHVybiByLmFwcGx5KFtdLGkpfSxndWlkOjEscHJveHk6ZnVuY3Rpb24oYSxiKXt2YXIgYyxkLGU7cmV0dXJuXCJzdHJpbmdcIj09dHlwZW9mIGImJihjPWFbYl0sYj1hLGE9YyksQS5pc0Z1bmN0aW9uKGEpPyhkPXEuY2FsbChhcmd1bWVudHMsMiksZT1mdW5jdGlvbigpe3JldHVybiBhLmFwcGx5KGJ8fHRoaXMsZC5jb25jYXQocS5jYWxsKGFyZ3VtZW50cykpKX0sZS5ndWlkPWEuZ3VpZD1hLmd1aWR8fEEuZ3VpZCsrLGUpOnZvaWQgMH0sbm93OkRhdGUubm93LHN1cHBvcnQ6eH0pLEEuZWFjaChcIkJvb2xlYW4gTnVtYmVyIFN0cmluZyBGdW5jdGlvbiBBcnJheSBEYXRlIFJlZ0V4cCBPYmplY3QgRXJyb3JcIi5zcGxpdChcIiBcIiksZnVuY3Rpb24oYSxiKXt1W1wiW29iamVjdCBcIitiK1wiXVwiXT1iLnRvTG93ZXJDYXNlKCl9KTt2YXIgRixHPS9ePChcXHcrKVxccypcXC8/Pig/OjxcXC9cXDE+fCkkLyxIPS9eKD86XFxzKig8W1xcd1xcV10rPilbXj5dKnwjKFtcXHctXSopKSQvLEk9QS5mbi5pbml0PWZ1bmN0aW9uKGEsYil7dmFyIGMsZDtpZighYSlyZXR1cm4gdGhpcztpZihcInN0cmluZ1wiPT10eXBlb2YgYSl7aWYoYz1cIjxcIj09PWFbMF0mJlwiPlwiPT09YVthLmxlbmd0aC0xXSYmYS5sZW5ndGg+PTM/W251bGwsYSxudWxsXTpILmV4ZWMoYSksIWN8fCFjWzFdJiZiKXJldHVybiFifHxiLmpxdWVyeT8oYnx8RikuZmluZChhKTp0aGlzLmNvbnN0cnVjdG9yKGIpLmZpbmQoYSk7aWYoY1sxXSl7aWYoYj1iIGluc3RhbmNlb2YgQT9iWzBdOmIsQS5tZXJnZSh0aGlzLEEucGFyc2VIVE1MKGNbMV0sYiYmYi5ub2RlVHlwZT9iLm93bmVyRG9jdW1lbnR8fGI6eSwhMCkpLEcudGVzdChjWzFdKSYmQS5pc1BsYWluT2JqZWN0KGIpKWZvcihjIGluIGIpQS5pc0Z1bmN0aW9uKHRoaXNbY10pP3RoaXNbY10oYltjXSk6dGhpcy5hdHRyKGMsYltjXSk7cmV0dXJuIHRoaXN9cmV0dXJuIGQ9eS5nZXRFbGVtZW50QnlJZChjWzJdKSxkJiZkLnBhcmVudE5vZGUmJih0aGlzLmxlbmd0aD0xLHRoaXNbMF09ZCksdGhpcy5jb250ZXh0PXksdGhpcy5zZWxlY3Rvcj1hLHRoaXN9cmV0dXJuIGEubm9kZVR5cGU/KHRoaXMuY29udGV4dD10aGlzWzBdPWEsdGhpcy5sZW5ndGg9MSx0aGlzKTpBLmlzRnVuY3Rpb24oYSk/XCJ1bmRlZmluZWRcIiE9dHlwZW9mIEYucmVhZHk/Ri5yZWFkeShhKTphKEEpOih2b2lkIDAhPT1hLnNlbGVjdG9yJiYodGhpcy5zZWxlY3Rvcj1hLnNlbGVjdG9yLHRoaXMuY29udGV4dD1hLmNvbnRleHQpLEEubWFrZUFycmF5KGEsdGhpcykpfTtJLnByb3RvdHlwZT1BLmZuLEY9QSh5KTt2YXIgSj0vXFxTKy9nLEs9e307QS5DYWxsYmFja3M9ZnVuY3Rpb24oYSl7YT1cInN0cmluZ1wiPT10eXBlb2YgYT9LW2FdfHxjKGEpOkEuZXh0ZW5kKHt9LGEpO3ZhciBiLGQsZSxmLGcsaCxpPVtdLGo9IWEub25jZSYmW10saz1mdW5jdGlvbihjKXtmb3IoYj1hLm1lbW9yeSYmYyxkPSEwLGg9Znx8MCxmPTAsZz1pLmxlbmd0aCxlPSEwO2kmJmc+aDtoKyspaWYoaVtoXS5hcHBseShjWzBdLGNbMV0pPT09ITEmJmEuc3RvcE9uRmFsc2Upe2I9ITE7YnJlYWt9ZT0hMSxpJiYoaj9qLmxlbmd0aCYmayhqLnNoaWZ0KCkpOmI/aT1bXTpsLmRpc2FibGUoKSl9LGw9e2FkZDpmdW5jdGlvbigpe2lmKGkpe3ZhciBjPWkubGVuZ3RoOyFmdW5jdGlvbiBkKGIpe0EuZWFjaChiLGZ1bmN0aW9uKGIsYyl7dmFyIGU9QS50eXBlKGMpO1wiZnVuY3Rpb25cIj09PWU/YS51bmlxdWUmJmwuaGFzKGMpfHxpLnB1c2goYyk6YyYmYy5sZW5ndGgmJlwic3RyaW5nXCIhPT1lJiZkKGMpfSl9KGFyZ3VtZW50cyksZT9nPWkubGVuZ3RoOmImJihmPWMsayhiKSl9cmV0dXJuIHRoaXN9LHJlbW92ZTpmdW5jdGlvbigpe3JldHVybiBpJiZBLmVhY2goYXJndW1lbnRzLGZ1bmN0aW9uKGEsYil7Zm9yKHZhciBjOyhjPUEuaW5BcnJheShiLGksYykpPi0xOylpLnNwbGljZShjLDEpLGUmJihnPj1jJiZnLS0saD49YyYmaC0tKX0pLHRoaXN9LGhhczpmdW5jdGlvbihhKXtyZXR1cm4gYT9BLmluQXJyYXkoYSxpKT4tMTohKCFpfHwhaS5sZW5ndGgpfSxlbXB0eTpmdW5jdGlvbigpe3JldHVybiBpPVtdLGc9MCx0aGlzfSxkaXNhYmxlOmZ1bmN0aW9uKCl7cmV0dXJuIGk9aj1iPXZvaWQgMCx0aGlzfSxkaXNhYmxlZDpmdW5jdGlvbigpe3JldHVybiFpfSxsb2NrOmZ1bmN0aW9uKCl7cmV0dXJuIGo9dm9pZCAwLGJ8fGwuZGlzYWJsZSgpLHRoaXN9LGxvY2tlZDpmdW5jdGlvbigpe3JldHVybiFqfSxmaXJlV2l0aDpmdW5jdGlvbihhLGIpe3JldHVybiFpfHxkJiYhanx8KGI9Ynx8W10sYj1bYSxiLnNsaWNlP2Iuc2xpY2UoKTpiXSxlP2oucHVzaChiKTprKGIpKSx0aGlzfSxmaXJlOmZ1bmN0aW9uKCl7cmV0dXJuIGwuZmlyZVdpdGgodGhpcyxhcmd1bWVudHMpLHRoaXN9LGZpcmVkOmZ1bmN0aW9uKCl7cmV0dXJuISFkfX07cmV0dXJuIGx9LEEuZXh0ZW5kKHtEZWZlcnJlZDpmdW5jdGlvbihhKXt2YXIgYj1bW1wicmVzb2x2ZVwiLFwiZG9uZVwiLEEuQ2FsbGJhY2tzKFwib25jZSBtZW1vcnlcIiksXCJyZXNvbHZlZFwiXSxbXCJyZWplY3RcIixcImZhaWxcIixBLkNhbGxiYWNrcyhcIm9uY2UgbWVtb3J5XCIpLFwicmVqZWN0ZWRcIl0sW1wibm90aWZ5XCIsXCJwcm9ncmVzc1wiLEEuQ2FsbGJhY2tzKFwibWVtb3J5XCIpXV0sYz1cInBlbmRpbmdcIixkPXtzdGF0ZTpmdW5jdGlvbigpe3JldHVybiBjfSxhbHdheXM6ZnVuY3Rpb24oKXtyZXR1cm4gZS5kb25lKGFyZ3VtZW50cykuZmFpbChhcmd1bWVudHMpLHRoaXN9LHRoZW46ZnVuY3Rpb24oKXt2YXIgYT1hcmd1bWVudHM7cmV0dXJuIEEuRGVmZXJyZWQoZnVuY3Rpb24oYyl7QS5lYWNoKGIsZnVuY3Rpb24oYixmKXt2YXIgZz1BLmlzRnVuY3Rpb24oYVtiXSkmJmFbYl07ZVtmWzFdXShmdW5jdGlvbigpe3ZhciBhPWcmJmcuYXBwbHkodGhpcyxhcmd1bWVudHMpO2EmJkEuaXNGdW5jdGlvbihhLnByb21pc2UpP2EucHJvbWlzZSgpLmRvbmUoYy5yZXNvbHZlKS5mYWlsKGMucmVqZWN0KS5wcm9ncmVzcyhjLm5vdGlmeSk6Y1tmWzBdK1wiV2l0aFwiXSh0aGlzPT09ZD9jLnByb21pc2UoKTp0aGlzLGc/W2FdOmFyZ3VtZW50cylcbn0pfSksYT1udWxsfSkucHJvbWlzZSgpfSxwcm9taXNlOmZ1bmN0aW9uKGEpe3JldHVybiBudWxsIT1hP0EuZXh0ZW5kKGEsZCk6ZH19LGU9e307cmV0dXJuIGQucGlwZT1kLnRoZW4sQS5lYWNoKGIsZnVuY3Rpb24oYSxmKXt2YXIgZz1mWzJdLGg9ZlszXTtkW2ZbMV1dPWcuYWRkLGgmJmcuYWRkKGZ1bmN0aW9uKCl7Yz1ofSxiWzFeYV1bMl0uZGlzYWJsZSxiWzJdWzJdLmxvY2spLGVbZlswXV09ZnVuY3Rpb24oKXtyZXR1cm4gZVtmWzBdK1wiV2l0aFwiXSh0aGlzPT09ZT9kOnRoaXMsYXJndW1lbnRzKSx0aGlzfSxlW2ZbMF0rXCJXaXRoXCJdPWcuZmlyZVdpdGh9KSxkLnByb21pc2UoZSksYSYmYS5jYWxsKGUsZSksZX0sd2hlbjpmdW5jdGlvbihhKXt2YXIgYixjLGQsZT0wLGY9cS5jYWxsKGFyZ3VtZW50cyksZz1mLmxlbmd0aCxoPTEhPT1nfHxhJiZBLmlzRnVuY3Rpb24oYS5wcm9taXNlKT9nOjAsaT0xPT09aD9hOkEuRGVmZXJyZWQoKSxqPWZ1bmN0aW9uKGEsYyxkKXtyZXR1cm4gZnVuY3Rpb24oZSl7Y1thXT10aGlzLGRbYV09YXJndW1lbnRzLmxlbmd0aD4xP3EuY2FsbChhcmd1bWVudHMpOmUsZD09PWI/aS5ub3RpZnlXaXRoKGMsZCk6LS1ofHxpLnJlc29sdmVXaXRoKGMsZCl9fTtpZihnPjEpZm9yKGI9bmV3IEFycmF5KGcpLGM9bmV3IEFycmF5KGcpLGQ9bmV3IEFycmF5KGcpO2c+ZTtlKyspZltlXSYmQS5pc0Z1bmN0aW9uKGZbZV0ucHJvbWlzZSk/ZltlXS5wcm9taXNlKCkuZG9uZShqKGUsZCxmKSkuZmFpbChpLnJlamVjdCkucHJvZ3Jlc3MoaihlLGMsYikpOi0taDtyZXR1cm4gaHx8aS5yZXNvbHZlV2l0aChkLGYpLGkucHJvbWlzZSgpfX0pO3ZhciBMO0EuZm4ucmVhZHk9ZnVuY3Rpb24oYSl7cmV0dXJuIEEucmVhZHkucHJvbWlzZSgpLmRvbmUoYSksdGhpc30sQS5leHRlbmQoe2lzUmVhZHk6ITEscmVhZHlXYWl0OjEsaG9sZFJlYWR5OmZ1bmN0aW9uKGEpe2E/QS5yZWFkeVdhaXQrKzpBLnJlYWR5KCEwKX0scmVhZHk6ZnVuY3Rpb24oYSl7KGE9PT0hMD8tLUEucmVhZHlXYWl0OkEuaXNSZWFkeSl8fChBLmlzUmVhZHk9ITAsYSE9PSEwJiYtLUEucmVhZHlXYWl0PjB8fChMLnJlc29sdmVXaXRoKHksW0FdKSxBLmZuLnRyaWdnZXJIYW5kbGVyJiYoQSh5KS50cmlnZ2VySGFuZGxlcihcInJlYWR5XCIpLEEoeSkub2ZmKFwicmVhZHlcIikpKSl9fSksQS5yZWFkeS5wcm9taXNlPWZ1bmN0aW9uKGIpe3JldHVybiBMfHwoTD1BLkRlZmVycmVkKCksXCJjb21wbGV0ZVwiPT09eS5yZWFkeVN0YXRlP3NldFRpbWVvdXQoQS5yZWFkeSk6KHkuYWRkRXZlbnRMaXN0ZW5lcihcIkRPTUNvbnRlbnRMb2FkZWRcIixkLCExKSxhLmFkZEV2ZW50TGlzdGVuZXIoXCJsb2FkXCIsZCwhMSkpKSxMLnByb21pc2UoYil9LEEucmVhZHkucHJvbWlzZSgpO3ZhciBNPUEuYWNjZXNzPWZ1bmN0aW9uKGEsYixjLGQsZSxmLGcpe3ZhciBoPTAsaT1hLmxlbmd0aCxqPW51bGw9PWM7aWYoXCJvYmplY3RcIj09PUEudHlwZShjKSl7ZT0hMDtmb3IoaCBpbiBjKUEuYWNjZXNzKGEsYixoLGNbaF0sITAsZixnKX1lbHNlIGlmKHZvaWQgMCE9PWQmJihlPSEwLEEuaXNGdW5jdGlvbihkKXx8KGc9ITApLGomJihnPyhiLmNhbGwoYSxkKSxiPW51bGwpOihqPWIsYj1mdW5jdGlvbihhLGIsYyl7cmV0dXJuIGouY2FsbChBKGEpLGMpfSkpLGIpKWZvcig7aT5oO2grKyliKGFbaF0sYyxnP2Q6ZC5jYWxsKGFbaF0saCxiKGFbaF0sYykpKTtyZXR1cm4gZT9hOmo/Yi5jYWxsKGEpOmk/YihhWzBdLGMpOmZ9O0EuYWNjZXB0RGF0YT1mdW5jdGlvbihhKXtyZXR1cm4gMT09PWEubm9kZVR5cGV8fDk9PT1hLm5vZGVUeXBlfHwhK2Eubm9kZVR5cGV9LGUudWlkPTEsZS5hY2NlcHRzPUEuYWNjZXB0RGF0YSxlLnByb3RvdHlwZT17a2V5OmZ1bmN0aW9uKGEpe2lmKCFlLmFjY2VwdHMoYSkpcmV0dXJuIDA7dmFyIGI9e30sYz1hW3RoaXMuZXhwYW5kb107aWYoIWMpe2M9ZS51aWQrKzt0cnl7Ylt0aGlzLmV4cGFuZG9dPXt2YWx1ZTpjfSxPYmplY3QuZGVmaW5lUHJvcGVydGllcyhhLGIpfWNhdGNoKGQpe2JbdGhpcy5leHBhbmRvXT1jLEEuZXh0ZW5kKGEsYil9fXJldHVybiB0aGlzLmNhY2hlW2NdfHwodGhpcy5jYWNoZVtjXT17fSksY30sc2V0OmZ1bmN0aW9uKGEsYixjKXt2YXIgZCxlPXRoaXMua2V5KGEpLGY9dGhpcy5jYWNoZVtlXTtpZihcInN0cmluZ1wiPT10eXBlb2YgYilmW2JdPWM7ZWxzZSBpZihBLmlzRW1wdHlPYmplY3QoZikpQS5leHRlbmQodGhpcy5jYWNoZVtlXSxiKTtlbHNlIGZvcihkIGluIGIpZltkXT1iW2RdO3JldHVybiBmfSxnZXQ6ZnVuY3Rpb24oYSxiKXt2YXIgYz10aGlzLmNhY2hlW3RoaXMua2V5KGEpXTtyZXR1cm4gdm9pZCAwPT09Yj9jOmNbYl19LGFjY2VzczpmdW5jdGlvbihhLGIsYyl7dmFyIGQ7cmV0dXJuIHZvaWQgMD09PWJ8fGImJlwic3RyaW5nXCI9PXR5cGVvZiBiJiZ2b2lkIDA9PT1jPyhkPXRoaXMuZ2V0KGEsYiksdm9pZCAwIT09ZD9kOnRoaXMuZ2V0KGEsQS5jYW1lbENhc2UoYikpKToodGhpcy5zZXQoYSxiLGMpLHZvaWQgMCE9PWM/YzpiKX0scmVtb3ZlOmZ1bmN0aW9uKGEsYil7dmFyIGMsZCxlLGY9dGhpcy5rZXkoYSksZz10aGlzLmNhY2hlW2ZdO2lmKHZvaWQgMD09PWIpdGhpcy5jYWNoZVtmXT17fTtlbHNle0EuaXNBcnJheShiKT9kPWIuY29uY2F0KGIubWFwKEEuY2FtZWxDYXNlKSk6KGU9QS5jYW1lbENhc2UoYiksYiBpbiBnP2Q9W2IsZV06KGQ9ZSxkPWQgaW4gZz9bZF06ZC5tYXRjaChKKXx8W10pKSxjPWQubGVuZ3RoO2Zvcig7Yy0tOylkZWxldGUgZ1tkW2NdXX19LGhhc0RhdGE6ZnVuY3Rpb24oYSl7cmV0dXJuIUEuaXNFbXB0eU9iamVjdCh0aGlzLmNhY2hlW2FbdGhpcy5leHBhbmRvXV18fHt9KX0sZGlzY2FyZDpmdW5jdGlvbihhKXthW3RoaXMuZXhwYW5kb10mJmRlbGV0ZSB0aGlzLmNhY2hlW2FbdGhpcy5leHBhbmRvXV19fTt2YXIgTj1uZXcgZSxPPS9eKD86XFx7W1xcd1xcV10qXFx9fFxcW1tcXHdcXFddKlxcXSkkLyxQPS8oW0EtWl0pL2c7QS5leHRlbmQoe2hhc0RhdGE6ZnVuY3Rpb24oYSl7cmV0dXJuIGRhdGFfdXNlci5oYXNEYXRhKGEpfHxOLmhhc0RhdGEoYSl9LGRhdGE6ZnVuY3Rpb24oYSxiLGMpe3JldHVybiBkYXRhX3VzZXIuYWNjZXNzKGEsYixjKX0scmVtb3ZlRGF0YTpmdW5jdGlvbihhLGIpe2RhdGFfdXNlci5yZW1vdmUoYSxiKX0sX2RhdGE6ZnVuY3Rpb24oYSxiLGMpe3JldHVybiBOLmFjY2VzcyhhLGIsYyl9LF9yZW1vdmVEYXRhOmZ1bmN0aW9uKGEsYil7Ti5yZW1vdmUoYSxiKX19KSxBLmZuLmV4dGVuZCh7ZGF0YTpmdW5jdGlvbihhLGIpe3ZhciBjLGQsZSxnPXRoaXNbMF0saD1nJiZnLmF0dHJpYnV0ZXM7aWYodm9pZCAwPT09YSl7aWYodGhpcy5sZW5ndGgmJihlPWRhdGFfdXNlci5nZXQoZyksMT09PWcubm9kZVR5cGUmJiFOLmdldChnLFwiaGFzRGF0YUF0dHJzXCIpKSl7Zm9yKGM9aC5sZW5ndGg7Yy0tOyloW2NdJiYoZD1oW2NdLm5hbWUsMD09PWQuaW5kZXhPZihcImRhdGEtXCIpJiYoZD1BLmNhbWVsQ2FzZShkLnNsaWNlKDUpKSxmKGcsZCxlW2RdKSkpO04uc2V0KGcsXCJoYXNEYXRhQXR0cnNcIiwhMCl9cmV0dXJuIGV9cmV0dXJuXCJvYmplY3RcIj09dHlwZW9mIGE/dGhpcy5lYWNoKGZ1bmN0aW9uKCl7ZGF0YV91c2VyLnNldCh0aGlzLGEpfSk6TSh0aGlzLGZ1bmN0aW9uKGIpe3ZhciBjLGQ9QS5jYW1lbENhc2UoYSk7aWYoZyYmdm9pZCAwPT09Yil7aWYoYz1kYXRhX3VzZXIuZ2V0KGcsYSksdm9pZCAwIT09YylyZXR1cm4gYztpZihjPWRhdGFfdXNlci5nZXQoZyxkKSx2b2lkIDAhPT1jKXJldHVybiBjO2lmKGM9ZihnLGQsdm9pZCAwKSx2b2lkIDAhPT1jKXJldHVybiBjfWVsc2UgdGhpcy5lYWNoKGZ1bmN0aW9uKCl7dmFyIGM9ZGF0YV91c2VyLmdldCh0aGlzLGQpO2RhdGFfdXNlci5zZXQodGhpcyxkLGIpLC0xIT09YS5pbmRleE9mKFwiLVwiKSYmdm9pZCAwIT09YyYmZGF0YV91c2VyLnNldCh0aGlzLGEsYil9KX0sbnVsbCxiLGFyZ3VtZW50cy5sZW5ndGg+MSxudWxsLCEwKX0scmVtb3ZlRGF0YTpmdW5jdGlvbihhKXtyZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uKCl7ZGF0YV91c2VyLnJlbW92ZSh0aGlzLGEpfSl9fSk7dmFyIFE9KC9bKy1dPyg/OlxcZCpcXC58KVxcZCsoPzpbZUVdWystXT9cXGQrfCkvLnNvdXJjZSxcInVuZGVmaW5lZFwiKSxSPS9ea2V5LyxTPS9eKD86bW91c2V8cG9pbnRlcnxjb250ZXh0bWVudSl8Y2xpY2svLFQ9L14oPzpmb2N1c2luZm9jdXN8Zm9jdXNvdXRibHVyKSQvLFU9L14oW14uXSopKD86XFwuKC4rKXwpJC87QS5ldmVudD17Z2xvYmFsOnt9LGFkZDpmdW5jdGlvbihhLGIsYyxkLGUpe3ZhciBmLGcsaCxpLGosayxsLG0sbixvLHAscT1OLmdldChhKTtpZihxKWZvcihjLmhhbmRsZXImJihmPWMsYz1mLmhhbmRsZXIsZT1mLnNlbGVjdG9yKSxjLmd1aWR8fChjLmd1aWQ9QS5ndWlkKyspLChpPXEuZXZlbnRzKXx8KGk9cS5ldmVudHM9e30pLChnPXEuaGFuZGxlKXx8KGc9cS5oYW5kbGU9ZnVuY3Rpb24oYil7cmV0dXJuIHR5cGVvZiBBIT09USYmQS5ldmVudC50cmlnZ2VyZWQhPT1iLnR5cGU/QS5ldmVudC5kaXNwYXRjaC5hcHBseShhLGFyZ3VtZW50cyk6dm9pZCAwfSksYj0oYnx8XCJcIikubWF0Y2goSil8fFtcIlwiXSxqPWIubGVuZ3RoO2otLTspaD1VLmV4ZWMoYltqXSl8fFtdLG49cD1oWzFdLG89KGhbMl18fFwiXCIpLnNwbGl0KFwiLlwiKS5zb3J0KCksbiYmKGw9QS5ldmVudC5zcGVjaWFsW25dfHx7fSxuPShlP2wuZGVsZWdhdGVUeXBlOmwuYmluZFR5cGUpfHxuLGw9QS5ldmVudC5zcGVjaWFsW25dfHx7fSxrPUEuZXh0ZW5kKHt0eXBlOm4sb3JpZ1R5cGU6cCxkYXRhOmQsaGFuZGxlcjpjLGd1aWQ6Yy5ndWlkLHNlbGVjdG9yOmUsbmVlZHNDb250ZXh0OmUmJkEuZXhwci5tYXRjaC5uZWVkc0NvbnRleHQudGVzdChlKSxuYW1lc3BhY2U6by5qb2luKFwiLlwiKX0sZiksKG09aVtuXSl8fChtPWlbbl09W10sbS5kZWxlZ2F0ZUNvdW50PTAsbC5zZXR1cCYmbC5zZXR1cC5jYWxsKGEsZCxvLGcpIT09ITF8fGEuYWRkRXZlbnRMaXN0ZW5lciYmYS5hZGRFdmVudExpc3RlbmVyKG4sZywhMSkpLGwuYWRkJiYobC5hZGQuY2FsbChhLGspLGsuaGFuZGxlci5ndWlkfHwoay5oYW5kbGVyLmd1aWQ9Yy5ndWlkKSksZT9tLnNwbGljZShtLmRlbGVnYXRlQ291bnQrKywwLGspOm0ucHVzaChrKSxBLmV2ZW50Lmdsb2JhbFtuXT0hMCl9LHJlbW92ZTpmdW5jdGlvbihhLGIsYyxkLGUpe3ZhciBmLGcsaCxpLGosayxsLG0sbixvLHAscT1OLmhhc0RhdGEoYSkmJk4uZ2V0KGEpO2lmKHEmJihpPXEuZXZlbnRzKSl7Zm9yKGI9KGJ8fFwiXCIpLm1hdGNoKEopfHxbXCJcIl0saj1iLmxlbmd0aDtqLS07KWlmKGg9VS5leGVjKGJbal0pfHxbXSxuPXA9aFsxXSxvPShoWzJdfHxcIlwiKS5zcGxpdChcIi5cIikuc29ydCgpLG4pe2ZvcihsPUEuZXZlbnQuc3BlY2lhbFtuXXx8e30sbj0oZD9sLmRlbGVnYXRlVHlwZTpsLmJpbmRUeXBlKXx8bixtPWlbbl18fFtdLGg9aFsyXSYmbmV3IFJlZ0V4cChcIihefFxcXFwuKVwiK28uam9pbihcIlxcXFwuKD86LipcXFxcLnwpXCIpK1wiKFxcXFwufCQpXCIpLGc9Zj1tLmxlbmd0aDtmLS07KWs9bVtmXSwhZSYmcCE9PWsub3JpZ1R5cGV8fGMmJmMuZ3VpZCE9PWsuZ3VpZHx8aCYmIWgudGVzdChrLm5hbWVzcGFjZSl8fGQmJmQhPT1rLnNlbGVjdG9yJiYoXCIqKlwiIT09ZHx8IWsuc2VsZWN0b3IpfHwobS5zcGxpY2UoZiwxKSxrLnNlbGVjdG9yJiZtLmRlbGVnYXRlQ291bnQtLSxsLnJlbW92ZSYmbC5yZW1vdmUuY2FsbChhLGspKTtnJiYhbS5sZW5ndGgmJihsLnRlYXJkb3duJiZsLnRlYXJkb3duLmNhbGwoYSxvLHEuaGFuZGxlKSE9PSExfHxBLnJlbW92ZUV2ZW50KGEsbixxLmhhbmRsZSksZGVsZXRlIGlbbl0pfWVsc2UgZm9yKG4gaW4gaSlBLmV2ZW50LnJlbW92ZShhLG4rYltqXSxjLGQsITApO0EuaXNFbXB0eU9iamVjdChpKSYmKGRlbGV0ZSBxLmhhbmRsZSxOLnJlbW92ZShhLFwiZXZlbnRzXCIpKX19LHRyaWdnZXI6ZnVuY3Rpb24oYixjLGQsZSl7dmFyIGYsZyxoLGksaixrLGwsbT1bZHx8eV0sbj13LmNhbGwoYixcInR5cGVcIik/Yi50eXBlOmIsbz13LmNhbGwoYixcIm5hbWVzcGFjZVwiKT9iLm5hbWVzcGFjZS5zcGxpdChcIi5cIik6W107aWYoZz1oPWQ9ZHx8eSwzIT09ZC5ub2RlVHlwZSYmOCE9PWQubm9kZVR5cGUmJiFULnRlc3QobitBLmV2ZW50LnRyaWdnZXJlZCkmJihuLmluZGV4T2YoXCIuXCIpPj0wJiYobz1uLnNwbGl0KFwiLlwiKSxuPW8uc2hpZnQoKSxvLnNvcnQoKSksaj1uLmluZGV4T2YoXCI6XCIpPDAmJlwib25cIituLGI9YltBLmV4cGFuZG9dP2I6bmV3IEEuRXZlbnQobixcIm9iamVjdFwiPT10eXBlb2YgYiYmYiksYi5pc1RyaWdnZXI9ZT8yOjMsYi5uYW1lc3BhY2U9by5qb2luKFwiLlwiKSxiLm5hbWVzcGFjZV9yZT1iLm5hbWVzcGFjZT9uZXcgUmVnRXhwKFwiKF58XFxcXC4pXCIrby5qb2luKFwiXFxcXC4oPzouKlxcXFwufClcIikrXCIoXFxcXC58JClcIik6bnVsbCxiLnJlc3VsdD12b2lkIDAsYi50YXJnZXR8fChiLnRhcmdldD1kKSxjPW51bGw9PWM/W2JdOkEubWFrZUFycmF5KGMsW2JdKSxsPUEuZXZlbnQuc3BlY2lhbFtuXXx8e30sZXx8IWwudHJpZ2dlcnx8bC50cmlnZ2VyLmFwcGx5KGQsYykhPT0hMSkpe2lmKCFlJiYhbC5ub0J1YmJsZSYmIUEuaXNXaW5kb3coZCkpe2ZvcihpPWwuZGVsZWdhdGVUeXBlfHxuLFQudGVzdChpK24pfHwoZz1nLnBhcmVudE5vZGUpO2c7Zz1nLnBhcmVudE5vZGUpbS5wdXNoKGcpLGg9ZztoPT09KGQub3duZXJEb2N1bWVudHx8eSkmJm0ucHVzaChoLmRlZmF1bHRWaWV3fHxoLnBhcmVudFdpbmRvd3x8YSl9Zm9yKGY9MDsoZz1tW2YrK10pJiYhYi5pc1Byb3BhZ2F0aW9uU3RvcHBlZCgpOyliLnR5cGU9Zj4xP2k6bC5iaW5kVHlwZXx8bixrPShOLmdldChnLFwiZXZlbnRzXCIpfHx7fSlbYi50eXBlXSYmTi5nZXQoZyxcImhhbmRsZVwiKSxrJiZrLmFwcGx5KGcsYyksaz1qJiZnW2pdLGsmJmsuYXBwbHkmJkEuYWNjZXB0RGF0YShnKSYmKGIucmVzdWx0PWsuYXBwbHkoZyxjKSxiLnJlc3VsdD09PSExJiZiLnByZXZlbnREZWZhdWx0KCkpO3JldHVybiBiLnR5cGU9bixlfHxiLmlzRGVmYXVsdFByZXZlbnRlZCgpfHxsLl9kZWZhdWx0JiZsLl9kZWZhdWx0LmFwcGx5KG0ucG9wKCksYykhPT0hMXx8IUEuYWNjZXB0RGF0YShkKXx8aiYmQS5pc0Z1bmN0aW9uKGRbbl0pJiYhQS5pc1dpbmRvdyhkKSYmKGg9ZFtqXSxoJiYoZFtqXT1udWxsKSxBLmV2ZW50LnRyaWdnZXJlZD1uLGRbbl0oKSxBLmV2ZW50LnRyaWdnZXJlZD12b2lkIDAsaCYmKGRbal09aCkpLGIucmVzdWx0fX0sZGlzcGF0Y2g6ZnVuY3Rpb24oYSl7YT1BLmV2ZW50LmZpeChhKTt2YXIgYixjLGQsZSxmLGc9W10saD1xLmNhbGwoYXJndW1lbnRzKSxpPShOLmdldCh0aGlzLFwiZXZlbnRzXCIpfHx7fSlbYS50eXBlXXx8W10saj1BLmV2ZW50LnNwZWNpYWxbYS50eXBlXXx8e307aWYoaFswXT1hLGEuZGVsZWdhdGVUYXJnZXQ9dGhpcywhai5wcmVEaXNwYXRjaHx8ai5wcmVEaXNwYXRjaC5jYWxsKHRoaXMsYSkhPT0hMSl7Zm9yKGc9QS5ldmVudC5oYW5kbGVycy5jYWxsKHRoaXMsYSxpKSxiPTA7KGU9Z1tiKytdKSYmIWEuaXNQcm9wYWdhdGlvblN0b3BwZWQoKTspZm9yKGEuY3VycmVudFRhcmdldD1lLmVsZW0sYz0wOyhmPWUuaGFuZGxlcnNbYysrXSkmJiFhLmlzSW1tZWRpYXRlUHJvcGFnYXRpb25TdG9wcGVkKCk7KSghYS5uYW1lc3BhY2VfcmV8fGEubmFtZXNwYWNlX3JlLnRlc3QoZi5uYW1lc3BhY2UpKSYmKGEuaGFuZGxlT2JqPWYsYS5kYXRhPWYuZGF0YSxkPSgoQS5ldmVudC5zcGVjaWFsW2Yub3JpZ1R5cGVdfHx7fSkuaGFuZGxlfHxmLmhhbmRsZXIpLmFwcGx5KGUuZWxlbSxoKSx2b2lkIDAhPT1kJiYoYS5yZXN1bHQ9ZCk9PT0hMSYmKGEucHJldmVudERlZmF1bHQoKSxhLnN0b3BQcm9wYWdhdGlvbigpKSk7cmV0dXJuIGoucG9zdERpc3BhdGNoJiZqLnBvc3REaXNwYXRjaC5jYWxsKHRoaXMsYSksYS5yZXN1bHR9fSxoYW5kbGVyczpmdW5jdGlvbihhLGIpe3ZhciBjLGQsZSxmLGc9W10saD1iLmRlbGVnYXRlQ291bnQsaT1hLnRhcmdldDtpZihoJiZpLm5vZGVUeXBlJiYoIWEuYnV0dG9ufHxcImNsaWNrXCIhPT1hLnR5cGUpKWZvcig7aSE9PXRoaXM7aT1pLnBhcmVudE5vZGV8fHRoaXMpaWYoaS5kaXNhYmxlZCE9PSEwfHxcImNsaWNrXCIhPT1hLnR5cGUpe2ZvcihkPVtdLGM9MDtoPmM7YysrKWY9YltjXSxlPWYuc2VsZWN0b3IrXCIgXCIsdm9pZCAwPT09ZFtlXSYmKGRbZV09Zi5uZWVkc0NvbnRleHQ/QShlLHRoaXMpLmluZGV4KGkpPj0wOkEuZmluZChlLHRoaXMsbnVsbCxbaV0pLmxlbmd0aCksZFtlXSYmZC5wdXNoKGYpO2QubGVuZ3RoJiZnLnB1c2goe2VsZW06aSxoYW5kbGVyczpkfSl9cmV0dXJuIGg8Yi5sZW5ndGgmJmcucHVzaCh7ZWxlbTp0aGlzLGhhbmRsZXJzOmIuc2xpY2UoaCl9KSxnfSxwcm9wczpcImFsdEtleSBidWJibGVzIGNhbmNlbGFibGUgY3RybEtleSBjdXJyZW50VGFyZ2V0IGV2ZW50UGhhc2UgbWV0YUtleSByZWxhdGVkVGFyZ2V0IHNoaWZ0S2V5IHRhcmdldCB0aW1lU3RhbXAgdmlldyB3aGljaFwiLnNwbGl0KFwiIFwiKSxmaXhIb29rczp7fSxrZXlIb29rczp7cHJvcHM6XCJjaGFyIGNoYXJDb2RlIGtleSBrZXlDb2RlXCIuc3BsaXQoXCIgXCIpLGZpbHRlcjpmdW5jdGlvbihhLGIpe3JldHVybiBudWxsPT1hLndoaWNoJiYoYS53aGljaD1udWxsIT1iLmNoYXJDb2RlP2IuY2hhckNvZGU6Yi5rZXlDb2RlKSxhfX0sbW91c2VIb29rczp7cHJvcHM6XCJidXR0b24gYnV0dG9ucyBjbGllbnRYIGNsaWVudFkgb2Zmc2V0WCBvZmZzZXRZIHBhZ2VYIHBhZ2VZIHNjcmVlblggc2NyZWVuWSB0b0VsZW1lbnRcIi5zcGxpdChcIiBcIiksZmlsdGVyOmZ1bmN0aW9uKGEsYil7dmFyIGMsZCxlLGY9Yi5idXR0b247cmV0dXJuIG51bGw9PWEucGFnZVgmJm51bGwhPWIuY2xpZW50WCYmKGM9YS50YXJnZXQub3duZXJEb2N1bWVudHx8eSxkPWMuZG9jdW1lbnRFbGVtZW50LGU9Yy5ib2R5LGEucGFnZVg9Yi5jbGllbnRYKyhkJiZkLnNjcm9sbExlZnR8fGUmJmUuc2Nyb2xsTGVmdHx8MCktKGQmJmQuY2xpZW50TGVmdHx8ZSYmZS5jbGllbnRMZWZ0fHwwKSxhLnBhZ2VZPWIuY2xpZW50WSsoZCYmZC5zY3JvbGxUb3B8fGUmJmUuc2Nyb2xsVG9wfHwwKS0oZCYmZC5jbGllbnRUb3B8fGUmJmUuY2xpZW50VG9wfHwwKSksYS53aGljaHx8dm9pZCAwPT09Znx8KGEud2hpY2g9MSZmPzE6MiZmPzM6NCZmPzI6MCksYX19LGZpeDpmdW5jdGlvbihhKXtpZihhW0EuZXhwYW5kb10pcmV0dXJuIGE7dmFyIGIsYyxkLGU9YS50eXBlLGY9YSxnPXRoaXMuZml4SG9va3NbZV07Zm9yKGd8fCh0aGlzLmZpeEhvb2tzW2VdPWc9Uy50ZXN0KGUpP3RoaXMubW91c2VIb29rczpSLnRlc3QoZSk/dGhpcy5rZXlIb29rczp7fSksZD1nLnByb3BzP3RoaXMucHJvcHMuY29uY2F0KGcucHJvcHMpOnRoaXMucHJvcHMsYT1uZXcgQS5FdmVudChmKSxiPWQubGVuZ3RoO2ItLTspYz1kW2JdLGFbY109ZltjXTtyZXR1cm4gYS50YXJnZXR8fChhLnRhcmdldD15KSwzPT09YS50YXJnZXQubm9kZVR5cGUmJihhLnRhcmdldD1hLnRhcmdldC5wYXJlbnROb2RlKSxnLmZpbHRlcj9nLmZpbHRlcihhLGYpOmF9LHNwZWNpYWw6e2xvYWQ6e25vQnViYmxlOiEwfSxmb2N1czp7dHJpZ2dlcjpmdW5jdGlvbigpe3JldHVybiB0aGlzIT09aSgpJiZ0aGlzLmZvY3VzPyh0aGlzLmZvY3VzKCksITEpOnZvaWQgMH0sZGVsZWdhdGVUeXBlOlwiZm9jdXNpblwifSxibHVyOnt0cmlnZ2VyOmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXM9PT1pKCkmJnRoaXMuYmx1cj8odGhpcy5ibHVyKCksITEpOnZvaWQgMH0sZGVsZWdhdGVUeXBlOlwiZm9jdXNvdXRcIn0sY2xpY2s6e3RyaWdnZXI6ZnVuY3Rpb24oKXtyZXR1cm5cImNoZWNrYm94XCI9PT10aGlzLnR5cGUmJnRoaXMuY2xpY2smJkEubm9kZU5hbWUodGhpcyxcImlucHV0XCIpPyh0aGlzLmNsaWNrKCksITEpOnZvaWQgMH0sX2RlZmF1bHQ6ZnVuY3Rpb24oYSl7cmV0dXJuIEEubm9kZU5hbWUoYS50YXJnZXQsXCJhXCIpfX0sYmVmb3JldW5sb2FkOntwb3N0RGlzcGF0Y2g6ZnVuY3Rpb24oYSl7dm9pZCAwIT09YS5yZXN1bHQmJmEub3JpZ2luYWxFdmVudCYmKGEub3JpZ2luYWxFdmVudC5yZXR1cm5WYWx1ZT1hLnJlc3VsdCl9fX0sc2ltdWxhdGU6ZnVuY3Rpb24oYSxiLGMsZCl7dmFyIGU9QS5leHRlbmQobmV3IEEuRXZlbnQsYyx7dHlwZTphLGlzU2ltdWxhdGVkOiEwLG9yaWdpbmFsRXZlbnQ6e319KTtkP0EuZXZlbnQudHJpZ2dlcihlLG51bGwsYik6QS5ldmVudC5kaXNwYXRjaC5jYWxsKGIsZSksZS5pc0RlZmF1bHRQcmV2ZW50ZWQoKSYmYy5wcmV2ZW50RGVmYXVsdCgpfX0sQS5yZW1vdmVFdmVudD1mdW5jdGlvbihhLGIsYyl7YS5yZW1vdmVFdmVudExpc3RlbmVyJiZhLnJlbW92ZUV2ZW50TGlzdGVuZXIoYixjLCExKX0sQS5FdmVudD1mdW5jdGlvbihhLGIpe3JldHVybiB0aGlzIGluc3RhbmNlb2YgQS5FdmVudD8oYSYmYS50eXBlPyh0aGlzLm9yaWdpbmFsRXZlbnQ9YSx0aGlzLnR5cGU9YS50eXBlLHRoaXMuaXNEZWZhdWx0UHJldmVudGVkPWEuZGVmYXVsdFByZXZlbnRlZHx8dm9pZCAwPT09YS5kZWZhdWx0UHJldmVudGVkJiZhLnJldHVyblZhbHVlPT09ITE/ZzpoKTp0aGlzLnR5cGU9YSxiJiZBLmV4dGVuZCh0aGlzLGIpLHRoaXMudGltZVN0YW1wPWEmJmEudGltZVN0YW1wfHxBLm5vdygpLHZvaWQodGhpc1tBLmV4cGFuZG9dPSEwKSk6bmV3IEEuRXZlbnQoYSxiKX0sQS5FdmVudC5wcm90b3R5cGU9e2lzRGVmYXVsdFByZXZlbnRlZDpoLGlzUHJvcGFnYXRpb25TdG9wcGVkOmgsaXNJbW1lZGlhdGVQcm9wYWdhdGlvblN0b3BwZWQ6aCxwcmV2ZW50RGVmYXVsdDpmdW5jdGlvbigpe3ZhciBhPXRoaXMub3JpZ2luYWxFdmVudDt0aGlzLmlzRGVmYXVsdFByZXZlbnRlZD1nLGEmJmEucHJldmVudERlZmF1bHQmJmEucHJldmVudERlZmF1bHQoKX0sc3RvcFByb3BhZ2F0aW9uOmZ1bmN0aW9uKCl7dmFyIGE9dGhpcy5vcmlnaW5hbEV2ZW50O3RoaXMuaXNQcm9wYWdhdGlvblN0b3BwZWQ9ZyxhJiZhLnN0b3BQcm9wYWdhdGlvbiYmYS5zdG9wUHJvcGFnYXRpb24oKX0sc3RvcEltbWVkaWF0ZVByb3BhZ2F0aW9uOmZ1bmN0aW9uKCl7dmFyIGE9dGhpcy5vcmlnaW5hbEV2ZW50O3RoaXMuaXNJbW1lZGlhdGVQcm9wYWdhdGlvblN0b3BwZWQ9ZyxhJiZhLnN0b3BJbW1lZGlhdGVQcm9wYWdhdGlvbiYmYS5zdG9wSW1tZWRpYXRlUHJvcGFnYXRpb24oKSx0aGlzLnN0b3BQcm9wYWdhdGlvbigpfX0sQS5lYWNoKHttb3VzZWVudGVyOlwibW91c2VvdmVyXCIsbW91c2VsZWF2ZTpcIm1vdXNlb3V0XCIscG9pbnRlcmVudGVyOlwicG9pbnRlcm92ZXJcIixwb2ludGVybGVhdmU6XCJwb2ludGVyb3V0XCJ9LGZ1bmN0aW9uKGEsYil7QS5ldmVudC5zcGVjaWFsW2FdPXtkZWxlZ2F0ZVR5cGU6YixiaW5kVHlwZTpiLGhhbmRsZTpmdW5jdGlvbihhKXt2YXIgYyxkPXRoaXMsZT1hLnJlbGF0ZWRUYXJnZXQsZj1hLmhhbmRsZU9iajtyZXR1cm4oIWV8fGUhPT1kJiYhQS5jb250YWlucyhkLGUpKSYmKGEudHlwZT1mLm9yaWdUeXBlLGM9Zi5oYW5kbGVyLmFwcGx5KHRoaXMsYXJndW1lbnRzKSxhLnR5cGU9YiksY319fSkseC5mb2N1c2luQnViYmxlc3x8QS5lYWNoKHtmb2N1czpcImZvY3VzaW5cIixibHVyOlwiZm9jdXNvdXRcIn0sZnVuY3Rpb24oYSxiKXt2YXIgYz1mdW5jdGlvbihhKXtBLmV2ZW50LnNpbXVsYXRlKGIsYS50YXJnZXQsQS5ldmVudC5maXgoYSksITApfTtBLmV2ZW50LnNwZWNpYWxbYl09e3NldHVwOmZ1bmN0aW9uKCl7dmFyIGQ9dGhpcy5vd25lckRvY3VtZW50fHx0aGlzLGU9Ti5hY2Nlc3MoZCxiKTtlfHxkLmFkZEV2ZW50TGlzdGVuZXIoYSxjLCEwKSxOLmFjY2VzcyhkLGIsKGV8fDApKzEpfSx0ZWFyZG93bjpmdW5jdGlvbigpe3ZhciBkPXRoaXMub3duZXJEb2N1bWVudHx8dGhpcyxlPU4uYWNjZXNzKGQsYiktMTtlP04uYWNjZXNzKGQsYixlKTooZC5yZW1vdmVFdmVudExpc3RlbmVyKGEsYywhMCksTi5yZW1vdmUoZCxiKSl9fX0pLEEuZm4uZXh0ZW5kKHtvbjpmdW5jdGlvbihhLGIsYyxkLGUpe3ZhciBmLGc7aWYoXCJvYmplY3RcIj09dHlwZW9mIGEpe1wic3RyaW5nXCIhPXR5cGVvZiBiJiYoYz1jfHxiLGI9dm9pZCAwKTtmb3IoZyBpbiBhKXRoaXMub24oZyxiLGMsYVtnXSxlKTtyZXR1cm4gdGhpc31pZihudWxsPT1jJiZudWxsPT1kPyhkPWIsYz1iPXZvaWQgMCk6bnVsbD09ZCYmKFwic3RyaW5nXCI9PXR5cGVvZiBiPyhkPWMsYz12b2lkIDApOihkPWMsYz1iLGI9dm9pZCAwKSksZD09PSExKWQ9aDtlbHNlIGlmKCFkKXJldHVybiB0aGlzO3JldHVybiAxPT09ZSYmKGY9ZCxkPWZ1bmN0aW9uKGEpe3JldHVybiBBKCkub2ZmKGEpLGYuYXBwbHkodGhpcyxhcmd1bWVudHMpfSxkLmd1aWQ9Zi5ndWlkfHwoZi5ndWlkPUEuZ3VpZCsrKSksdGhpcy5lYWNoKGZ1bmN0aW9uKCl7QS5ldmVudC5hZGQodGhpcyxhLGQsYyxiKX0pfSxvbmU6ZnVuY3Rpb24oYSxiLGMsZCl7cmV0dXJuIHRoaXMub24oYSxiLGMsZCwxKX0sb2ZmOmZ1bmN0aW9uKGEsYixjKXt2YXIgZCxlO2lmKGEmJmEucHJldmVudERlZmF1bHQmJmEuaGFuZGxlT2JqKXJldHVybiBkPWEuaGFuZGxlT2JqLEEoYS5kZWxlZ2F0ZVRhcmdldCkub2ZmKGQubmFtZXNwYWNlP2Qub3JpZ1R5cGUrXCIuXCIrZC5uYW1lc3BhY2U6ZC5vcmlnVHlwZSxkLnNlbGVjdG9yLGQuaGFuZGxlciksdGhpcztpZihcIm9iamVjdFwiPT10eXBlb2YgYSl7Zm9yKGUgaW4gYSl0aGlzLm9mZihlLGIsYVtlXSk7cmV0dXJuIHRoaXN9cmV0dXJuKGI9PT0hMXx8XCJmdW5jdGlvblwiPT10eXBlb2YgYikmJihjPWIsYj12b2lkIDApLGM9PT0hMSYmKGM9aCksdGhpcy5lYWNoKGZ1bmN0aW9uKCl7QS5ldmVudC5yZW1vdmUodGhpcyxhLGMsYil9KX0sdHJpZ2dlcjpmdW5jdGlvbihhLGIpe3JldHVybiB0aGlzLmVhY2goZnVuY3Rpb24oKXtBLmV2ZW50LnRyaWdnZXIoYSxiLHRoaXMpfSl9LHRyaWdnZXJIYW5kbGVyOmZ1bmN0aW9uKGEsYil7dmFyIGM9dGhpc1swXTtyZXR1cm4gYz9BLmV2ZW50LnRyaWdnZXIoYSxiLGMsITApOnZvaWQgMH19KTt2YXIgVj1BLm5vdygpLFc9L1xcPy87QS5wYXJzZUpTT049ZnVuY3Rpb24oYSl7cmV0dXJuIEpTT04ucGFyc2UoYStcIlwiKX0sQS5wYXJzZVhNTD1mdW5jdGlvbihhKXt2YXIgYixjO2lmKCFhfHxcInN0cmluZ1wiIT10eXBlb2YgYSlyZXR1cm4gbnVsbDt0cnl7Yz1uZXcgRE9NUGFyc2VyLGI9Yy5wYXJzZUZyb21TdHJpbmcoYSxcInRleHQveG1sXCIpfWNhdGNoKGQpe2I9dm9pZCAwfXJldHVybighYnx8Yi5nZXRFbGVtZW50c0J5VGFnTmFtZShcInBhcnNlcmVycm9yXCIpLmxlbmd0aCkmJkEuZXJyb3IoXCJJbnZhbGlkIFhNTDogXCIrYSksYn07dmFyIFgsWSxaPS8jLiokLywkPS8oWz8mXSlfPVteJl0qLyxfPS9eKC4qPyk6WyBcXHRdKihbXlxcclxcbl0qKSQvZ20sYWI9L14oPzphYm91dHxhcHB8YXBwLXN0b3JhZ2V8ListZXh0ZW5zaW9ufGZpbGV8cmVzfHdpZGdldCk6JC8sYmI9L14oPzpHRVR8SEVBRCkkLyxjYj0vXlxcL1xcLy8sZGI9L14oW1xcdy4rLV0rOikoPzpcXC9cXC8oPzpbXlxcLz8jXSpAfCkoW15cXC8/IzpdKikoPzo6KFxcZCspfCl8KS8sZWI9e30sZmI9e30sZ2I9XCIqL1wiLmNvbmNhdChcIipcIik7dHJ5e1k9bG9jYXRpb24uaHJlZn1jYXRjaChoYil7WT15LmNyZWF0ZUVsZW1lbnQoXCJhXCIpLFkuaHJlZj1cIlwiLFk9WS5ocmVmfVg9ZGIuZXhlYyhZLnRvTG93ZXJDYXNlKCkpfHxbXSxBLmV4dGVuZCh7YWN0aXZlOjAsbGFzdE1vZGlmaWVkOnt9LGV0YWc6e30sYWpheFNldHRpbmdzOnt1cmw6WSx0eXBlOlwiR0VUXCIsaXNMb2NhbDphYi50ZXN0KFhbMV0pLGdsb2JhbDohMCxwcm9jZXNzRGF0YTohMCxhc3luYzohMCxjb250ZW50VHlwZTpcImFwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZDsgY2hhcnNldD1VVEYtOFwiLGFjY2VwdHM6e1wiKlwiOmdiLHRleHQ6XCJ0ZXh0L3BsYWluXCIsaHRtbDpcInRleHQvaHRtbFwiLHhtbDpcImFwcGxpY2F0aW9uL3htbCwgdGV4dC94bWxcIixqc29uOlwiYXBwbGljYXRpb24vanNvbiwgdGV4dC9qYXZhc2NyaXB0XCJ9LGNvbnRlbnRzOnt4bWw6L3htbC8saHRtbDovaHRtbC8sanNvbjovanNvbi99LHJlc3BvbnNlRmllbGRzOnt4bWw6XCJyZXNwb25zZVhNTFwiLHRleHQ6XCJyZXNwb25zZVRleHRcIixqc29uOlwicmVzcG9uc2VKU09OXCJ9LGNvbnZlcnRlcnM6e1wiKiB0ZXh0XCI6U3RyaW5nLFwidGV4dCBodG1sXCI6ITAsXCJ0ZXh0IGpzb25cIjpBLnBhcnNlSlNPTixcInRleHQgeG1sXCI6QS5wYXJzZVhNTH0sZmxhdE9wdGlvbnM6e3VybDohMCxjb250ZXh0OiEwfX0sYWpheFNldHVwOmZ1bmN0aW9uKGEsYil7cmV0dXJuIGI/bChsKGEsQS5hamF4U2V0dGluZ3MpLGIpOmwoQS5hamF4U2V0dGluZ3MsYSl9LGFqYXhQcmVmaWx0ZXI6aihlYiksYWpheFRyYW5zcG9ydDpqKGZiKSxhamF4OmZ1bmN0aW9uKGEsYil7ZnVuY3Rpb24gYyhhLGIsYyxnKXt2YXIgaSxrLGwsdSx2LHg9YjsyIT09dyYmKHc9MixoJiZjbGVhclRpbWVvdXQoaCksZD12b2lkIDAsZj1nfHxcIlwiLHkucmVhZHlTdGF0ZT1hPjA/NDowLGk9YT49MjAwJiYzMDA+YXx8MzA0PT09YSxjJiYodT1tKG8seSxjKSksdT1uKG8sdSx5LGkpLGk/KG8uaWZNb2RpZmllZCYmKHY9eS5nZXRSZXNwb25zZUhlYWRlcihcIkxhc3QtTW9kaWZpZWRcIiksdiYmKEEubGFzdE1vZGlmaWVkW2VdPXYpLHY9eS5nZXRSZXNwb25zZUhlYWRlcihcImV0YWdcIiksdiYmKEEuZXRhZ1tlXT12KSksMjA0PT09YXx8XCJIRUFEXCI9PT1vLnR5cGU/eD1cIm5vY29udGVudFwiOjMwND09PWE/eD1cIm5vdG1vZGlmaWVkXCI6KHg9dS5zdGF0ZSxrPXUuZGF0YSxsPXUuZXJyb3IsaT0hbCkpOihsPXgsKGF8fCF4KSYmKHg9XCJlcnJvclwiLDA+YSYmKGE9MCkpKSx5LnN0YXR1cz1hLHkuc3RhdHVzVGV4dD0oYnx8eCkrXCJcIixpP3IucmVzb2x2ZVdpdGgocCxbayx4LHldKTpyLnJlamVjdFdpdGgocCxbeSx4LGxdKSx5LnN0YXR1c0NvZGUodCksdD12b2lkIDAsaiYmcS50cmlnZ2VyKGk/XCJhamF4U3VjY2Vzc1wiOlwiYWpheEVycm9yXCIsW3ksbyxpP2s6bF0pLHMuZmlyZVdpdGgocCxbeSx4XSksaiYmKHEudHJpZ2dlcihcImFqYXhDb21wbGV0ZVwiLFt5LG9dKSwtLUEuYWN0aXZlfHxBLmV2ZW50LnRyaWdnZXIoXCJhamF4U3RvcFwiKSkpfVwib2JqZWN0XCI9PXR5cGVvZiBhJiYoYj1hLGE9dm9pZCAwKSxiPWJ8fHt9O3ZhciBkLGUsZixnLGgsaSxqLGwsbz1BLmFqYXhTZXR1cCh7fSxiKSxwPW8uY29udGV4dHx8byxxPW8uY29udGV4dCYmKHAubm9kZVR5cGV8fHAuanF1ZXJ5KT9BKHApOkEuZXZlbnQscj1BLkRlZmVycmVkKCkscz1BLkNhbGxiYWNrcyhcIm9uY2UgbWVtb3J5XCIpLHQ9by5zdGF0dXNDb2RlfHx7fSx1PXt9LHY9e30sdz0wLHg9XCJjYW5jZWxlZFwiLHk9e3JlYWR5U3RhdGU6MCxnZXRSZXNwb25zZUhlYWRlcjpmdW5jdGlvbihhKXt2YXIgYjtpZigyPT09dyl7aWYoIWcpZm9yKGc9e307Yj1fLmV4ZWMoZik7KWdbYlsxXS50b0xvd2VyQ2FzZSgpXT1iWzJdO2I9Z1thLnRvTG93ZXJDYXNlKCldfXJldHVybiBudWxsPT1iP251bGw6Yn0sZ2V0QWxsUmVzcG9uc2VIZWFkZXJzOmZ1bmN0aW9uKCl7cmV0dXJuIDI9PT13P2Y6bnVsbH0sc2V0UmVxdWVzdEhlYWRlcjpmdW5jdGlvbihhLGIpe3ZhciBjPWEudG9Mb3dlckNhc2UoKTtyZXR1cm4gd3x8KGE9dltjXT12W2NdfHxhLHVbYV09YiksdGhpc30sb3ZlcnJpZGVNaW1lVHlwZTpmdW5jdGlvbihhKXtyZXR1cm4gd3x8KG8ubWltZVR5cGU9YSksdGhpc30sc3RhdHVzQ29kZTpmdW5jdGlvbihhKXt2YXIgYjtpZihhKWlmKDI+dylmb3IoYiBpbiBhKXRbYl09W3RbYl0sYVtiXV07ZWxzZSB5LmFsd2F5cyhhW3kuc3RhdHVzXSk7cmV0dXJuIHRoaXN9LGFib3J0OmZ1bmN0aW9uKGEpe3ZhciBiPWF8fHg7cmV0dXJuIGQmJmQuYWJvcnQoYiksYygwLGIpLHRoaXN9fTtpZihyLnByb21pc2UoeSkuY29tcGxldGU9cy5hZGQseS5zdWNjZXNzPXkuZG9uZSx5LmVycm9yPXkuZmFpbCxvLnVybD0oKGF8fG8udXJsfHxZKStcIlwiKS5yZXBsYWNlKFosXCJcIikucmVwbGFjZShjYixYWzFdK1wiLy9cIiksby50eXBlPWIubWV0aG9kfHxiLnR5cGV8fG8ubWV0aG9kfHxvLnR5cGUsby5kYXRhVHlwZXM9QS50cmltKG8uZGF0YVR5cGV8fFwiKlwiKS50b0xvd2VyQ2FzZSgpLm1hdGNoKEopfHxbXCJcIl0sbnVsbD09by5jcm9zc0RvbWFpbiYmKGk9ZGIuZXhlYyhvLnVybC50b0xvd2VyQ2FzZSgpKSxvLmNyb3NzRG9tYWluPSEoIWl8fGlbMV09PT1YWzFdJiZpWzJdPT09WFsyXSYmKGlbM118fChcImh0dHA6XCI9PT1pWzFdP1wiODBcIjpcIjQ0M1wiKSk9PT0oWFszXXx8KFwiaHR0cDpcIj09PVhbMV0/XCI4MFwiOlwiNDQzXCIpKSkpLG8uZGF0YSYmby5wcm9jZXNzRGF0YSYmXCJzdHJpbmdcIiE9dHlwZW9mIG8uZGF0YSYmKG8uZGF0YT1BLnBhcmFtKG8uZGF0YSxvLnRyYWRpdGlvbmFsKSksayhlYixvLGIseSksMj09PXcpcmV0dXJuIHk7aj1vLmdsb2JhbCxqJiYwPT09QS5hY3RpdmUrKyYmQS5ldmVudC50cmlnZ2VyKFwiYWpheFN0YXJ0XCIpLG8udHlwZT1vLnR5cGUudG9VcHBlckNhc2UoKSxvLmhhc0NvbnRlbnQ9IWJiLnRlc3Qoby50eXBlKSxlPW8udXJsLG8uaGFzQ29udGVudHx8KG8uZGF0YSYmKGU9by51cmwrPShXLnRlc3QoZSk/XCImXCI6XCI/XCIpK28uZGF0YSxkZWxldGUgby5kYXRhKSxvLmNhY2hlPT09ITEmJihvLnVybD0kLnRlc3QoZSk/ZS5yZXBsYWNlKCQsXCIkMV89XCIrVisrKTplKyhXLnRlc3QoZSk/XCImXCI6XCI/XCIpK1wiXz1cIitWKyspKSxvLmlmTW9kaWZpZWQmJihBLmxhc3RNb2RpZmllZFtlXSYmeS5zZXRSZXF1ZXN0SGVhZGVyKFwiSWYtTW9kaWZpZWQtU2luY2VcIixBLmxhc3RNb2RpZmllZFtlXSksQS5ldGFnW2VdJiZ5LnNldFJlcXVlc3RIZWFkZXIoXCJJZi1Ob25lLU1hdGNoXCIsQS5ldGFnW2VdKSksKG8uZGF0YSYmby5oYXNDb250ZW50JiZvLmNvbnRlbnRUeXBlIT09ITF8fGIuY29udGVudFR5cGUpJiZ5LnNldFJlcXVlc3RIZWFkZXIoXCJDb250ZW50LVR5cGVcIixvLmNvbnRlbnRUeXBlKSx5LnNldFJlcXVlc3RIZWFkZXIoXCJBY2NlcHRcIixvLmRhdGFUeXBlc1swXSYmby5hY2NlcHRzW28uZGF0YVR5cGVzWzBdXT9vLmFjY2VwdHNbby5kYXRhVHlwZXNbMF1dKyhcIipcIiE9PW8uZGF0YVR5cGVzWzBdP1wiLCBcIitnYitcIjsgcT0wLjAxXCI6XCJcIik6by5hY2NlcHRzW1wiKlwiXSk7Zm9yKGwgaW4gby5oZWFkZXJzKXkuc2V0UmVxdWVzdEhlYWRlcihsLG8uaGVhZGVyc1tsXSk7aWYoby5iZWZvcmVTZW5kJiYoby5iZWZvcmVTZW5kLmNhbGwocCx5LG8pPT09ITF8fDI9PT13KSlyZXR1cm4geS5hYm9ydCgpO3g9XCJhYm9ydFwiO2ZvcihsIGlue3N1Y2Nlc3M6MSxlcnJvcjoxLGNvbXBsZXRlOjF9KXlbbF0ob1tsXSk7aWYoZD1rKGZiLG8sYix5KSl7eS5yZWFkeVN0YXRlPTEsaiYmcS50cmlnZ2VyKFwiYWpheFNlbmRcIixbeSxvXSksby5hc3luYyYmby50aW1lb3V0PjAmJihoPXNldFRpbWVvdXQoZnVuY3Rpb24oKXt5LmFib3J0KFwidGltZW91dFwiKX0sby50aW1lb3V0KSk7dHJ5e3c9MSxkLnNlbmQodSxjKX1jYXRjaCh6KXtpZighKDI+dykpdGhyb3cgejtjKC0xLHopfX1lbHNlIGMoLTEsXCJObyBUcmFuc3BvcnRcIik7cmV0dXJuIHl9LGdldEpTT046ZnVuY3Rpb24oYSxiLGMpe3JldHVybiBBLmdldChhLGIsYyxcImpzb25cIil9LGdldFNjcmlwdDpmdW5jdGlvbihhLGIpe3JldHVybiBBLmdldChhLHZvaWQgMCxiLFwic2NyaXB0XCIpfX0pLEEuZWFjaChbXCJnZXRcIixcInBvc3RcIl0sZnVuY3Rpb24oYSxiKXtBW2JdPWZ1bmN0aW9uKGEsYyxkLGUpe3JldHVybiBBLmlzRnVuY3Rpb24oYykmJihlPWV8fGQsZD1jLGM9dm9pZCAwKSxBLmFqYXgoe3VybDphLHR5cGU6YixkYXRhVHlwZTplLGRhdGE6YyxzdWNjZXNzOmR9KX19KSxBLmVhY2goW1wiYWpheFN0YXJ0XCIsXCJhamF4U3RvcFwiLFwiYWpheENvbXBsZXRlXCIsXCJhamF4RXJyb3JcIixcImFqYXhTdWNjZXNzXCIsXCJhamF4U2VuZFwiXSxmdW5jdGlvbihhLGIpe0EuZm5bYl09ZnVuY3Rpb24oYSl7cmV0dXJuIHRoaXMub24oYixhKX19KTt2YXIgaWI9LyUyMC9nLGpiPS9cXFtcXF0kLyxrYj0vXFxyP1xcbi9nLGxiPS9eKD86c3VibWl0fGJ1dHRvbnxpbWFnZXxyZXNldHxmaWxlKSQvaSxtYj0vXig/OmlucHV0fHNlbGVjdHx0ZXh0YXJlYXxrZXlnZW4pL2k7QS5wYXJhbT1mdW5jdGlvbihhLGIpe3ZhciBjLGQ9W10sZT1mdW5jdGlvbihhLGIpe2I9QS5pc0Z1bmN0aW9uKGIpP2IoKTpudWxsPT1iP1wiXCI6YixkW2QubGVuZ3RoXT1lbmNvZGVVUklDb21wb25lbnQoYSkrXCI9XCIrZW5jb2RlVVJJQ29tcG9uZW50KGIpfTtpZih2b2lkIDA9PT1iJiYoYj1BLmFqYXhTZXR0aW5ncyYmQS5hamF4U2V0dGluZ3MudHJhZGl0aW9uYWwpLEEuaXNBcnJheShhKXx8YS5qcXVlcnkmJiFBLmlzUGxhaW5PYmplY3QoYSkpQS5lYWNoKGEsZnVuY3Rpb24oKXtlKHRoaXMubmFtZSx0aGlzLnZhbHVlKX0pO2Vsc2UgZm9yKGMgaW4gYSlvKGMsYVtjXSxiLGUpO3JldHVybiBkLmpvaW4oXCImXCIpLnJlcGxhY2UoaWIsXCIrXCIpfSxBLmZuLmV4dGVuZCh7c2VyaWFsaXplOmZ1bmN0aW9uKCl7cmV0dXJuIEEucGFyYW0odGhpcy5zZXJpYWxpemVBcnJheSgpKX0sc2VyaWFsaXplQXJyYXk6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5tYXAoZnVuY3Rpb24oKXt2YXIgYT1BLnByb3AodGhpcyxcImVsZW1lbnRzXCIpO3JldHVybiBhP0EubWFrZUFycmF5KGEpOnRoaXN9KS5maWx0ZXIoZnVuY3Rpb24oKXt2YXIgYT10aGlzLnR5cGU7cmV0dXJuIHRoaXMubmFtZSYmIUEodGhpcykuaXMoXCI6ZGlzYWJsZWRcIikmJm1iLnRlc3QodGhpcy5ub2RlTmFtZSkmJiFsYi50ZXN0KGEpJiYodGhpcy5jaGVja2VkfHwhcmNoZWNrYWJsZVR5cGUudGVzdChhKSl9KS5tYXAoZnVuY3Rpb24oYSxiKXt2YXIgYz1BKHRoaXMpLnZhbCgpO3JldHVybiBudWxsPT1jP251bGw6QS5pc0FycmF5KGMpP0EubWFwKGMsZnVuY3Rpb24oYSl7cmV0dXJue25hbWU6Yi5uYW1lLHZhbHVlOmEucmVwbGFjZShrYixcIlxcclxcblwiKX19KTp7bmFtZTpiLm5hbWUsdmFsdWU6Yy5yZXBsYWNlKGtiLFwiXFxyXFxuXCIpfX0pLmdldCgpfX0pLEEuYWpheFNldHRpbmdzLnhocj1mdW5jdGlvbigpe3RyeXtyZXR1cm4gbmV3IFhNTEh0dHBSZXF1ZXN0fWNhdGNoKGEpe319O3ZhciBuYj0wLG9iPXt9LHBiPXswOjIwMCwxMjIzOjIwNH0scWI9QS5hamF4U2V0dGluZ3MueGhyKCk7YS5BY3RpdmVYT2JqZWN0JiZBKGEpLm9uKFwidW5sb2FkXCIsZnVuY3Rpb24oKXtmb3IodmFyIGEgaW4gb2Ipb2JbYV0oKX0pLHguY29ycz0hIXFiJiZcIndpdGhDcmVkZW50aWFsc1wiaW4gcWIseC5hamF4PXFiPSEhcWIsQS5hamF4VHJhbnNwb3J0KGZ1bmN0aW9uKGEpe3ZhciBiO3JldHVybiB4LmNvcnN8fHFiJiYhYS5jcm9zc0RvbWFpbj97c2VuZDpmdW5jdGlvbihjLGQpe3ZhciBlLGY9YS54aHIoKSxnPSsrbmI7aWYoZi5vcGVuKGEudHlwZSxhLnVybCxhLmFzeW5jLGEudXNlcm5hbWUsYS5wYXNzd29yZCksYS54aHJGaWVsZHMpZm9yKGUgaW4gYS54aHJGaWVsZHMpZltlXT1hLnhockZpZWxkc1tlXTthLm1pbWVUeXBlJiZmLm92ZXJyaWRlTWltZVR5cGUmJmYub3ZlcnJpZGVNaW1lVHlwZShhLm1pbWVUeXBlKSxhLmNyb3NzRG9tYWlufHxjW1wiWC1SZXF1ZXN0ZWQtV2l0aFwiXXx8KGNbXCJYLVJlcXVlc3RlZC1XaXRoXCJdPVwiWE1MSHR0cFJlcXVlc3RcIik7Zm9yKGUgaW4gYylmLnNldFJlcXVlc3RIZWFkZXIoZSxjW2VdKTtiPWZ1bmN0aW9uKGEpe3JldHVybiBmdW5jdGlvbigpe2ImJihkZWxldGUgb2JbZ10sYj1mLm9ubG9hZD1mLm9uZXJyb3I9bnVsbCxcImFib3J0XCI9PT1hP2YuYWJvcnQoKTpcImVycm9yXCI9PT1hP2QoZi5zdGF0dXMsZi5zdGF0dXNUZXh0KTpkKHBiW2Yuc3RhdHVzXXx8Zi5zdGF0dXMsZi5zdGF0dXNUZXh0LFwic3RyaW5nXCI9PXR5cGVvZiBmLnJlc3BvbnNlVGV4dD97dGV4dDpmLnJlc3BvbnNlVGV4dH06dm9pZCAwLGYuZ2V0QWxsUmVzcG9uc2VIZWFkZXJzKCkpKX19LGYub25sb2FkPWIoKSxmLm9uZXJyb3I9YihcImVycm9yXCIpLGI9b2JbZ109YihcImFib3J0XCIpO3RyeXtmLnNlbmQoYS5oYXNDb250ZW50JiZhLmRhdGF8fG51bGwpfWNhdGNoKGgpe2lmKGIpdGhyb3cgaH19LGFib3J0OmZ1bmN0aW9uKCl7YiYmYigpfX06dm9pZCAwfSksQS5hamF4U2V0dXAoe2FjY2VwdHM6e3NjcmlwdDpcInRleHQvamF2YXNjcmlwdCwgYXBwbGljYXRpb24vamF2YXNjcmlwdCwgYXBwbGljYXRpb24vZWNtYXNjcmlwdCwgYXBwbGljYXRpb24veC1lY21hc2NyaXB0XCJ9LGNvbnRlbnRzOntzY3JpcHQ6Lyg/OmphdmF8ZWNtYSlzY3JpcHQvfSxjb252ZXJ0ZXJzOntcInRleHQgc2NyaXB0XCI6ZnVuY3Rpb24oYSl7cmV0dXJuIEEuZ2xvYmFsRXZhbChhKSxhfX19KSxBLmFqYXhQcmVmaWx0ZXIoXCJzY3JpcHRcIixmdW5jdGlvbihhKXt2b2lkIDA9PT1hLmNhY2hlJiYoYS5jYWNoZT0hMSksYS5jcm9zc0RvbWFpbiYmKGEudHlwZT1cIkdFVFwiKX0pLEEuYWpheFRyYW5zcG9ydChcInNjcmlwdFwiLGZ1bmN0aW9uKGEpe2lmKGEuY3Jvc3NEb21haW4pe3ZhciBiLGM7cmV0dXJue3NlbmQ6ZnVuY3Rpb24oZCxlKXtiPUEoXCI8c2NyaXB0PlwiKS5wcm9wKHthc3luYzohMCxjaGFyc2V0OmEuc2NyaXB0Q2hhcnNldCxzcmM6YS51cmx9KS5vbihcImxvYWQgZXJyb3JcIixjPWZ1bmN0aW9uKGEpe2IucmVtb3ZlKCksYz1udWxsLGEmJmUoXCJlcnJvclwiPT09YS50eXBlPzQwNDoyMDAsYS50eXBlKX0pLHkuaGVhZC5hcHBlbmRDaGlsZChiWzBdKX0sYWJvcnQ6ZnVuY3Rpb24oKXtjJiZjKCl9fX19KTt2YXIgcmI9W10sc2I9Lyg9KVxcPyg/PSZ8JCl8XFw/XFw/LztBLmFqYXhTZXR1cCh7anNvbnA6XCJjYWxsYmFja1wiLGpzb25wQ2FsbGJhY2s6ZnVuY3Rpb24oKXt2YXIgYT1yYi5wb3AoKXx8QS5leHBhbmRvK1wiX1wiK1YrKztyZXR1cm4gdGhpc1thXT0hMCxhfX0pLEEuYWpheFByZWZpbHRlcihcImpzb24ganNvbnBcIixmdW5jdGlvbihiLGMsZCl7dmFyIGUsZixnLGg9Yi5qc29ucCE9PSExJiYoc2IudGVzdChiLnVybCk/XCJ1cmxcIjpcInN0cmluZ1wiPT10eXBlb2YgYi5kYXRhJiYhKGIuY29udGVudFR5cGV8fFwiXCIpLmluZGV4T2YoXCJhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWRcIikmJnNiLnRlc3QoYi5kYXRhKSYmXCJkYXRhXCIpO3JldHVybiBofHxcImpzb25wXCI9PT1iLmRhdGFUeXBlc1swXT8oZT1iLmpzb25wQ2FsbGJhY2s9QS5pc0Z1bmN0aW9uKGIuanNvbnBDYWxsYmFjayk/Yi5qc29ucENhbGxiYWNrKCk6Yi5qc29ucENhbGxiYWNrLGg/YltoXT1iW2hdLnJlcGxhY2Uoc2IsXCIkMVwiK2UpOmIuanNvbnAhPT0hMSYmKGIudXJsKz0oVy50ZXN0KGIudXJsKT9cIiZcIjpcIj9cIikrYi5qc29ucCtcIj1cIitlKSxiLmNvbnZlcnRlcnNbXCJzY3JpcHQganNvblwiXT1mdW5jdGlvbigpe3JldHVybiBnfHxBLmVycm9yKGUrXCIgd2FzIG5vdCBjYWxsZWRcIiksZ1swXX0sYi5kYXRhVHlwZXNbMF09XCJqc29uXCIsZj1hW2VdLGFbZV09ZnVuY3Rpb24oKXtnPWFyZ3VtZW50c30sZC5hbHdheXMoZnVuY3Rpb24oKXthW2VdPWYsYltlXSYmKGIuanNvbnBDYWxsYmFjaz1jLmpzb25wQ2FsbGJhY2sscmIucHVzaChlKSksZyYmQS5pc0Z1bmN0aW9uKGYpJiZmKGdbMF0pLGc9Zj12b2lkIDB9KSxcInNjcmlwdFwiKTp2b2lkIDB9KSxBLnBhcnNlSFRNTD1mdW5jdGlvbihhLGIsYyl7aWYoIWF8fFwic3RyaW5nXCIhPXR5cGVvZiBhKXJldHVybiBudWxsO1wiYm9vbGVhblwiPT10eXBlb2YgYiYmKGM9YixiPSExKSxiPWJ8fHk7dmFyIGQ9Ry5leGVjKGEpLGU9IWMmJltdO3JldHVybiBkP1tiLmNyZWF0ZUVsZW1lbnQoZFsxXSldOihkPUEuYnVpbGRGcmFnbWVudChbYV0sYixlKSxlJiZlLmxlbmd0aCYmQShlKS5yZW1vdmUoKSxBLm1lcmdlKFtdLGQuY2hpbGROb2RlcykpfTt2YXIgdGI9QS5mbi5sb2FkO3JldHVybiBBLmZuLmxvYWQ9ZnVuY3Rpb24oYSxiLGMpe2lmKFwic3RyaW5nXCIhPXR5cGVvZiBhJiZ0YilyZXR1cm4gdGIuYXBwbHkodGhpcyxhcmd1bWVudHMpO3ZhciBkLGUsZixnPXRoaXMsaD1hLmluZGV4T2YoXCIgXCIpO3JldHVybiBoPj0wJiYoZD1BLnRyaW0oYS5zbGljZShoKSksYT1hLnNsaWNlKDAsaCkpLEEuaXNGdW5jdGlvbihiKT8oYz1iLGI9dm9pZCAwKTpiJiZcIm9iamVjdFwiPT10eXBlb2YgYiYmKGU9XCJQT1NUXCIpLGcubGVuZ3RoPjAmJkEuYWpheCh7dXJsOmEsdHlwZTplLGRhdGFUeXBlOlwiaHRtbFwiLGRhdGE6Yn0pLmRvbmUoZnVuY3Rpb24oYSl7Zj1hcmd1bWVudHMsZy5odG1sKGQ/QShcIjxkaXY+XCIpLmFwcGVuZChBLnBhcnNlSFRNTChhKSkuZmluZChkKTphKX0pLmNvbXBsZXRlKGMmJmZ1bmN0aW9uKGEsYil7Zy5lYWNoKGMsZnx8W2EucmVzcG9uc2VUZXh0LGIsYV0pfSksdGhpc30sQS5ub0NvbmZsaWN0PWZ1bmN0aW9uKCl7fSxBfSl9LHt9XSwxMjpbZnVuY3Rpb24oYSxiKXtcInVzZSBzdHJpY3RcIjtiLmV4cG9ydHM9ZnVuY3Rpb24oYSl7cmV0dXJue3JlbG9hZDpmdW5jdGlvbigpe3JldHVybiBhLmxvY2F0aW9uLnJlbG9hZCgpfSxnZXRIYXNoOmZ1bmN0aW9uKCl7cmV0dXJuIGEubG9jYXRpb24uaGFzaH0sc2V0SGFzaDpmdW5jdGlvbihiKXtyZXR1cm4gYS5sb2NhdGlvbi5oYXNoPWJ9LGNoYW5nZUhyZWY6ZnVuY3Rpb24oYil7cmV0dXJuIGEubG9jYXRpb24uaHJlZj1ifX19fSx7fV0sMTM6W2Z1bmN0aW9uKGEsYil7dmFyIGMsZDtkPTAsYz1cIlwiLGIuZXhwb3J0cz17aGV4X3NoYTE6ZnVuY3Rpb24oYSl7cmV0dXJuIHRoaXMucnN0cjJoZXgodGhpcy5yc3RyX3NoYTEodGhpcy5zdHIycnN0cl91dGY4KGEpKSl9LGI2NF9zaGExOmZ1bmN0aW9uKGEpe3JldHVybiB0aGlzLnJzdHIyYjY0KHRoaXMucnN0cl9zaGExKHRoaXMuc3RyMnJzdHJfdXRmOChhKSkpfSxhbnlfc2hhMTpmdW5jdGlvbihhLGIpe3JldHVybiB0aGlzLnJzdHIyYW55KHRoaXMucnN0cl9zaGExKHRoaXMuc3RyMnJzdHJfdXRmOChhKSksYil9LGhleF9obWFjX3NoYTE6ZnVuY3Rpb24oYSxiKXtyZXR1cm4gdGhpcy5yc3RyMmhleCh0aGlzLnJzdHJfaG1hY19zaGExKHRoaXMuc3RyMnJzdHJfdXRmOChhKSx0aGlzLnN0cjJyc3RyX3V0ZjgoYikpKX0sYjY0X2htYWNfc2hhMTpmdW5jdGlvbihhLGIpe3JldHVybiB0aGlzLnJzdHIyYjY0KHRoaXMucnN0cl9obWFjX3NoYTEodGhpcy5zdHIycnN0cl91dGY4KGEpLHRoaXMuc3RyMnJzdHJfdXRmOChiKSkpfSxhbnlfaG1hY19zaGExOmZ1bmN0aW9uKGEsYixjKXtyZXR1cm4gdGhpcy5yc3RyMmFueSh0aGlzLnJzdHJfaG1hY19zaGExKHRoaXMuc3RyMnJzdHJfdXRmOChhKSx0aGlzLnN0cjJyc3RyX3V0ZjgoYikpLGMpfSxzaGExX3ZtX3Rlc3Q6ZnVuY3Rpb24oKXtyZXR1cm5cImE5OTkzZTM2NDcwNjgxNmFiYTNlMjU3MTc4NTBjMjZjOWNkMGQ4OWRcIj09PXRoaXNoZXhfc2hhMShcImFiY1wiKS50b0xvd2VyQ2FzZSgpfSxyc3RyX3NoYTE6ZnVuY3Rpb24oYSl7cmV0dXJuIHRoaXMuYmluYjJyc3RyKHRoaXMuYmluYl9zaGExKHRoaXMucnN0cjJiaW5iKGEpLDgqYS5sZW5ndGgpKX0scnN0cl9obWFjX3NoYTE6ZnVuY3Rpb24oYSxiKXt2YXIgYyxkLGUsZixnO2ZvcihjPXRoaXMucnN0cjJiaW5iKGEpLGMubGVuZ3RoPjE2JiYoYz10aGlzLmJpbmJfc2hhMShjLDgqYS5sZW5ndGgpKSxmPUFycmF5KDE2KSxnPUFycmF5KDE2KSxlPTA7MTY+ZTspZltlXT05MDk1MjI0ODZeY1tlXSxnW2VdPTE1NDk1NTY4MjheY1tlXSxlKys7cmV0dXJuIGQ9dGhpcy5iaW5iX3NoYTEoZi5jb25jYXQodGhpcy5yc3RyMmJpbmIoYikpLDUxMis4KmIubGVuZ3RoKSx0aGlzLmJpbmIycnN0cih0aGlzLmJpbmJfc2hhMShnLmNvbmNhdChkKSw2NzIpKX0scnN0cjJoZXg6ZnVuY3Rpb24oYSl7dmFyIGIsYyxlLGYsZzt0cnl7fWNhdGNoKGgpe2I9aCxkPTB9Zm9yKGM9ZD9cIjAxMjM0NTY3ODlBQkNERUZcIjpcIjAxMjM0NTY3ODlhYmNkZWZcIixmPVwiXCIsZz12b2lkIDAsZT0wO2U8YS5sZW5ndGg7KWc9YS5jaGFyQ29kZUF0KGUpLGYrPWMuY2hhckF0KGc+Pj40JjE1KStjLmNoYXJBdCgxNSZnKSxlKys7cmV0dXJuIGZ9LHJzdHIyYjY0OmZ1bmN0aW9uKGEpe3ZhciBiLGQsZSxmLGcsaCxpO3RyeXt9Y2F0Y2goail7Yj1qLGM9XCJcIn1mb3IoaD1cIkFCQ0RFRkdISUpLTE1OT1BRUlNUVVZXWFlaYWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXowMTIzNDU2Nzg5Ky9cIixnPVwiXCIsZj1hLmxlbmd0aCxkPTA7Zj5kOyl7Zm9yKGk9YS5jaGFyQ29kZUF0KGQpPDwxNnwoZj5kKzE/YS5jaGFyQ29kZUF0KGQrMSk8PDg6MCl8KGY+ZCsyP2EuY2hhckNvZGVBdChkKzIpOjApLGU9MDs0PmU7KWcrPTgqZCs2KmU+OCphLmxlbmd0aD9jOmguY2hhckF0KGk+Pj42KigzLWUpJjYzKSxlKys7ZCs9M31yZXR1cm4gZ30scnN0cjJhbnk6ZnVuY3Rpb24oYSxiKXt2YXIgYyxkLGUsZixnLGgsaSxqLGs7Zm9yKGQ9Yi5sZW5ndGgsaj1BcnJheSgpLGY9dm9pZCAwLGg9dm9pZCAwLGs9dm9pZCAwLGk9dm9pZCAwLGM9QXJyYXkoTWF0aC5jZWlsKGEubGVuZ3RoLzIpKSxmPTA7ZjxjLmxlbmd0aDspY1tmXT1hLmNoYXJDb2RlQXQoMipmKTw8OHxhLmNoYXJDb2RlQXQoMipmKzEpLGYrKztmb3IoO2MubGVuZ3RoPjA7KXtmb3IoaT1BcnJheSgpLGs9MCxmPTA7ZjxjLmxlbmd0aDspaz0oazw8MTYpK2NbZl0saD1NYXRoLmZsb29yKGsvZCksay09aCpkLChpLmxlbmd0aD4wfHxoPjApJiYoaVtpLmxlbmd0aF09aCksZisrO2pbai5sZW5ndGhdPWssYz1pfWZvcihnPVwiXCIsZj1qLmxlbmd0aC0xO2Y+PTA7KWcrPWIuY2hhckF0KGpbZl0pLGYtLTtmb3IoZT1NYXRoLmNlaWwoOCphLmxlbmd0aC8oTWF0aC5sb2coYi5sZW5ndGgpL01hdGgubG9nKDIpKSksZj1nLmxlbmd0aDtlPmY7KWc9YlswXStnLGYrKztyZXR1cm4gZ30sc3RyMnJzdHJfdXRmODpmdW5jdGlvbihhKXt2YXIgYixjLGQsZTtmb3IoYz1cIlwiLGI9LTEsZD12b2lkIDAsZT12b2lkIDA7KytiPGEubGVuZ3RoOylkPWEuY2hhckNvZGVBdChiKSxlPWIrMTxhLmxlbmd0aD9hLmNoYXJDb2RlQXQoYisxKTowLGQ+PTU1Mjk2JiY1NjMxOT49ZCYmZT49NTYzMjAmJjU3MzQzPj1lJiYoZD02NTUzNisoKDEwMjMmZCk8PDEwKSsoMTAyMyZlKSxiKyspLDEyNz49ZD9jKz1TdHJpbmcuZnJvbUNoYXJDb2RlKGQpOjIwNDc+PWQ/Yys9U3RyaW5nLmZyb21DaGFyQ29kZSgxOTJ8ZD4+PjYmMzEsMTI4fDYzJmQpOjY1NTM1Pj1kP2MrPVN0cmluZy5mcm9tQ2hhckNvZGUoMjI0fGQ+Pj4xMiYxNSwxMjh8ZD4+PjYmNjMsMTI4fDYzJmQpOjIwOTcxNTE+PWQmJihjKz1TdHJpbmcuZnJvbUNoYXJDb2RlKDI0MHxkPj4+MTgmNywxMjh8ZD4+PjEyJjYzLDEyOHxkPj4+NiY2MywxMjh8NjMmZCkpO3JldHVybiBjfSxzdHIycnN0cl91dGYxNmxlOmZ1bmN0aW9uKGEpe3ZhciBiLGM7Zm9yKGM9XCJcIixiPTA7YjxhLmxlbmd0aDspYys9U3RyaW5nLmZyb21DaGFyQ29kZSgyNTUmYS5jaGFyQ29kZUF0KGIpLGEuY2hhckNvZGVBdChiKT4+PjgmMjU1KSxiKys7cmV0dXJuIGN9LHN0cjJyc3RyX3V0ZjE2YmU6ZnVuY3Rpb24oYSl7dmFyIGIsYztmb3IoYz1cIlwiLGI9MDtiPGEubGVuZ3RoOyljKz1TdHJpbmcuZnJvbUNoYXJDb2RlKGEuY2hhckNvZGVBdChiKT4+PjgmMjU1LDI1NSZhLmNoYXJDb2RlQXQoYikpLGIrKztyZXR1cm4gY30scnN0cjJiaW5iOmZ1bmN0aW9uKGEpe3ZhciBiLGM7Zm9yKGM9QXJyYXkoYS5sZW5ndGg+PjIpLGI9MDtiPGMubGVuZ3RoOyljW2JdPTAsYisrO2ZvcihiPTA7Yjw4KmEubGVuZ3RoOyljW2I+PjVdfD0oMjU1JmEuY2hhckNvZGVBdChiLzgpKTw8MjQtYiUzMixiKz04O3JldHVybiBjfSxiaW5iMnJzdHI6ZnVuY3Rpb24oYSl7dmFyIGIsYztmb3IoYz1cIlwiLGI9MDtiPDMyKmEubGVuZ3RoOyljKz1TdHJpbmcuZnJvbUNoYXJDb2RlKGFbYj4+NV0+Pj4yNC1iJTMyJjI1NSksYis9ODtyZXR1cm4gY30sYmluYl9zaGExOmZ1bmN0aW9uKGEsYil7dmFyIGMsZCxlLGYsZyxoLGksaixrLGwsbSxuLG8scDtmb3IoYVtiPj41XXw9MTI4PDwyNC1iJTMyLGFbKGIrNjQ+Pjk8PDQpKzE1XT1iLHA9QXJyYXkoODApLGM9MTczMjU4NDE5MyxkPS0yNzE3MzM4NzksZT0tMTczMjU4NDE5NCxmPTI3MTczMzg3OCxnPS0xMDA5NTg5Nzc2LGg9MDtoPGEubGVuZ3RoOyl7Zm9yKGo9YyxrPWQsbD1lLG09ZixuPWcsaT0wOzgwPmk7KXBbaV09MTY+aT9hW2graV06dGhpcy5iaXRfcm9sKHBbaS0zXV5wW2ktOF1ecFtpLTE0XV5wW2ktMTZdLDEpLG89dGhpcy5zYWZlX2FkZCh0aGlzLnNhZmVfYWRkKHRoaXMuYml0X3JvbChjLDUpLHRoaXMuc2hhMV9mdChpLGQsZSxmKSksdGhpcy5zYWZlX2FkZCh0aGlzLnNhZmVfYWRkKGcscFtpXSksdGhpcy5zaGExX2t0KGkpKSksZz1mLGY9ZSxlPXRoaXMuYml0X3JvbChkLDMwKSxkPWMsYz1vLGkrKztjPXRoaXMuc2FmZV9hZGQoYyxqKSxkPXRoaXMuc2FmZV9hZGQoZCxrKSxlPXRoaXMuc2FmZV9hZGQoZSxsKSxmPXRoaXMuc2FmZV9hZGQoZixtKSxnPXRoaXMuc2FmZV9hZGQoZyxuKSxoKz0xNn1yZXR1cm4gQXJyYXkoYyxkLGUsZixnKX0sc2hhMV9mdDpmdW5jdGlvbihhLGIsYyxkKXtyZXR1cm4gMjA+YT9iJmN8fmImZDo0MD5hP2JeY15kOjYwPmE/YiZjfGImZHxjJmQ6Yl5jXmR9LHNoYTFfa3Q6ZnVuY3Rpb24oYSl7cmV0dXJuIDIwPmE/MTUxODUwMDI0OTo0MD5hPzE4NTk3NzUzOTM6NjA+YT8tMTg5NDAwNzU4ODotODk5NDk3NTE0fSxzYWZlX2FkZDpmdW5jdGlvbihhLGIpe3ZhciBjLGQ7cmV0dXJuIGM9KDY1NTM1JmEpKyg2NTUzNSZiKSxkPShhPj4xNikrKGI+PjE2KSsoYz4+MTYpLGQ8PDE2fDY1NTM1JmN9LGJpdF9yb2w6ZnVuY3Rpb24oYSxiKXtyZXR1cm4gYTw8YnxhPj4+MzItYn0sY3JlYXRlX2hhc2g6ZnVuY3Rpb24oKXt2YXIgYTtyZXR1cm4gYT10aGlzLmI2NF9zaGExKChuZXcgRGF0ZSkuZ2V0VGltZSgpK1wiOlwiK01hdGguZmxvb3IoOTk5OTk5OSpNYXRoLnJhbmRvbSgpKSksYS5yZXBsYWNlKC9cXCsvZyxcIi1cIikucmVwbGFjZSgvXFwvL2csXCJfXCIpLnJlcGxhY2UoL1xcPSskLyxcIlwiKX19fSx7fV0sMTQ6W2Z1bmN0aW9uKGEsYil7Yi5leHBvcnRzPWZ1bmN0aW9uKGEpe3JldHVybntnZXRBYnNVcmw6ZnVuY3Rpb24oYil7dmFyIGM7cmV0dXJuIGIubWF0Y2goL14uezIsNX06XFwvXFwvLyk/YjpcIi9cIj09PWJbMF0/YS5sb2NhdGlvbi5wcm90b2NvbCtcIi8vXCIrYS5sb2NhdGlvbi5ob3N0K2I6KGM9YS5sb2NhdGlvbi5wcm90b2NvbCtcIi8vXCIrYS5sb2NhdGlvbi5ob3N0K2EubG9jYXRpb24ucGF0aG5hbWUsXCIvXCIhPT1jW2MubGVuZ3RoLTFdJiZcIiNcIiE9PWJbMF0/YytcIi9cIitiOmMrYil9LHJlcGxhY2VQYXJhbTpmdW5jdGlvbihhLGIsYyl7cmV0dXJuIGE9YS5yZXBsYWNlKC9cXHtcXHsoLio/KVxcfVxcfS9nLGZ1bmN0aW9uKGEsYyl7cmV0dXJuIGJbY118fFwiXCJ9KSxjJiYoYT1hLnJlcGxhY2UoL1xceyguKj8pXFx9L2csZnVuY3Rpb24oYSxiKXtyZXR1cm4gY1tiXXx8XCJcIn0pKSxhfX19fSx7fV0sMTU6W2Z1bmN0aW9uKGEsYil7dmFyIGM9Yi5leHBvcnRzPXt9O2MubmV4dFRpY2s9ZnVuY3Rpb24oKXt2YXIgYT1cInVuZGVmaW5lZFwiIT10eXBlb2Ygd2luZG93JiZ3aW5kb3cuc2V0SW1tZWRpYXRlLGI9XCJ1bmRlZmluZWRcIiE9dHlwZW9mIHdpbmRvdyYmd2luZG93LnBvc3RNZXNzYWdlJiZ3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcjtpZihhKXJldHVybiBmdW5jdGlvbihhKXtyZXR1cm4gd2luZG93LnNldEltbWVkaWF0ZShhKX07aWYoYil7dmFyIGM9W107cmV0dXJuIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwibWVzc2FnZVwiLGZ1bmN0aW9uKGEpe3ZhciBiPWEuc291cmNlO2lmKChiPT09d2luZG93fHxudWxsPT09YikmJlwicHJvY2Vzcy10aWNrXCI9PT1hLmRhdGEmJihhLnN0b3BQcm9wYWdhdGlvbigpLGMubGVuZ3RoPjApKXt2YXIgZD1jLnNoaWZ0KCk7ZCgpfX0sITApLGZ1bmN0aW9uKGEpe2MucHVzaChhKSx3aW5kb3cucG9zdE1lc3NhZ2UoXCJwcm9jZXNzLXRpY2tcIixcIipcIil9fXJldHVybiBmdW5jdGlvbihhKXtzZXRUaW1lb3V0KGEsMCl9fSgpLGMudGl0bGU9XCJicm93c2VyXCIsYy5icm93c2VyPSEwLGMuZW52PXt9LGMuYXJndj1bXSxjLmJpbmRpbmc9ZnVuY3Rpb24oKXt0aHJvdyBuZXcgRXJyb3IoXCJwcm9jZXNzLmJpbmRpbmcgaXMgbm90IHN1cHBvcnRlZFwiKX0sYy5jd2Q9ZnVuY3Rpb24oKXtyZXR1cm5cIi9cIn0sYy5jaGRpcj1mdW5jdGlvbigpe3Rocm93IG5ldyBFcnJvcihcInByb2Nlc3MuY2hkaXIgaXMgbm90IHN1cHBvcnRlZFwiKX19LHt9XSwxNjpbZnVuY3Rpb24oYSxiLGMpeyhmdW5jdGlvbihhKXshZnVuY3Rpb24oYSl7XCJ1c2Ugc3RyaWN0XCI7aWYoXCJmdW5jdGlvblwiPT10eXBlb2YgYm9vdHN0cmFwKWJvb3RzdHJhcChcInByb21pc2VcIixhKTtlbHNlIGlmKFwib2JqZWN0XCI9PXR5cGVvZiBjJiZcIm9iamVjdFwiPT10eXBlb2YgYiliLmV4cG9ydHM9YSgpO2Vsc2UgaWYoXCJmdW5jdGlvblwiPT10eXBlb2YgZGVmaW5lJiZkZWZpbmUuYW1kKWRlZmluZShhKTtlbHNlIGlmKFwidW5kZWZpbmVkXCIhPXR5cGVvZiBzZXMpe2lmKCFzZXMub2soKSlyZXR1cm47c2VzLm1ha2VRPWF9ZWxzZXtpZihcInVuZGVmaW5lZFwiPT10eXBlb2Ygc2VsZil0aHJvdyBuZXcgRXJyb3IoXCJUaGlzIGVudmlyb25tZW50IHdhcyBub3QgYW50aWNpYXB0ZWQgYnkgUS4gUGxlYXNlIGZpbGUgYSBidWcuXCIpO3NlbGYuUT1hKCl9fShmdW5jdGlvbigpe1widXNlIHN0cmljdFwiO2Z1bmN0aW9uIGIoYSl7cmV0dXJuIGZ1bmN0aW9uKCl7cmV0dXJuIFcuYXBwbHkoYSxhcmd1bWVudHMpfX1mdW5jdGlvbiBjKGEpe3JldHVybiBhPT09T2JqZWN0KGEpfWZ1bmN0aW9uIGQoYSl7cmV0dXJuXCJbb2JqZWN0IFN0b3BJdGVyYXRpb25dXCI9PT1jYihhKXx8YSBpbnN0YW5jZW9mIFN9ZnVuY3Rpb24gZShhLGIpe2lmKFAmJmIuc3RhY2smJlwib2JqZWN0XCI9PXR5cGVvZiBhJiZudWxsIT09YSYmYS5zdGFjayYmLTE9PT1hLnN0YWNrLmluZGV4T2YoZGIpKXtmb3IodmFyIGM9W10sZD1iO2Q7ZD1kLnNvdXJjZSlkLnN0YWNrJiZjLnVuc2hpZnQoZC5zdGFjayk7Yy51bnNoaWZ0KGEuc3RhY2spO3ZhciBlPWMuam9pbihcIlxcblwiK2RiK1wiXFxuXCIpO2Euc3RhY2s9ZihlKX19ZnVuY3Rpb24gZihhKXtmb3IodmFyIGI9YS5zcGxpdChcIlxcblwiKSxjPVtdLGQ9MDtkPGIubGVuZ3RoOysrZCl7dmFyIGU9YltkXTtpKGUpfHxnKGUpfHwhZXx8Yy5wdXNoKGUpfXJldHVybiBjLmpvaW4oXCJcXG5cIil9ZnVuY3Rpb24gZyhhKXtyZXR1cm4tMSE9PWEuaW5kZXhPZihcIihtb2R1bGUuanM6XCIpfHwtMSE9PWEuaW5kZXhPZihcIihub2RlLmpzOlwiKX1mdW5jdGlvbiBoKGEpe3ZhciBiPS9hdCAuKyBcXCgoLispOihcXGQrKTooPzpcXGQrKVxcKSQvLmV4ZWMoYSk7aWYoYilyZXR1cm5bYlsxXSxOdW1iZXIoYlsyXSldO3ZhciBjPS9hdCAoW14gXSspOihcXGQrKTooPzpcXGQrKSQvLmV4ZWMoYSk7aWYoYylyZXR1cm5bY1sxXSxOdW1iZXIoY1syXSldO3ZhciBkPS8uKkAoLispOihcXGQrKSQvLmV4ZWMoYSk7cmV0dXJuIGQ/W2RbMV0sTnVtYmVyKGRbMl0pXTp2b2lkIDB9ZnVuY3Rpb24gaShhKXt2YXIgYj1oKGEpO2lmKCFiKXJldHVybiExO3ZhciBjPWJbMF0sZD1iWzFdO3JldHVybiBjPT09UiYmZD49VCYmaGI+PWR9ZnVuY3Rpb24gaigpe2lmKFApdHJ5e3Rocm93IG5ldyBFcnJvcn1jYXRjaChhKXt2YXIgYj1hLnN0YWNrLnNwbGl0KFwiXFxuXCIpLGM9YlswXS5pbmRleE9mKFwiQFwiKT4wP2JbMV06YlsyXSxkPWgoYyk7aWYoIWQpcmV0dXJuO3JldHVybiBSPWRbMF0sZFsxXX19ZnVuY3Rpb24gayhhLGIsYyl7cmV0dXJuIGZ1bmN0aW9uKCl7cmV0dXJuXCJ1bmRlZmluZWRcIiE9dHlwZW9mIGNvbnNvbGUmJlwiZnVuY3Rpb25cIj09dHlwZW9mIGNvbnNvbGUud2FybiYmY29uc29sZS53YXJuKGIrXCIgaXMgZGVwcmVjYXRlZCwgdXNlIFwiK2MrXCIgaW5zdGVhZC5cIixuZXcgRXJyb3IoXCJcIikuc3RhY2spLGEuYXBwbHkoYSxhcmd1bWVudHMpfX1mdW5jdGlvbiBsKGEpe3JldHVybiBhIGluc3RhbmNlb2YgcD9hOnQoYSk/QyhhKTpCKGEpfWZ1bmN0aW9uIG0oKXtmdW5jdGlvbiBhKGEpe2I9YSxmLnNvdXJjZT1hLFkoYyxmdW5jdGlvbihiLGMpe2wubmV4dFRpY2soZnVuY3Rpb24oKXthLnByb21pc2VEaXNwYXRjaC5hcHBseShhLGMpfSl9LHZvaWQgMCksYz12b2lkIDAsZD12b2lkIDB9dmFyIGIsYz1bXSxkPVtdLGU9XyhtLnByb3RvdHlwZSksZj1fKHAucHJvdG90eXBlKTtpZihmLnByb21pc2VEaXNwYXRjaD1mdW5jdGlvbihhLGUsZil7dmFyIGc9WChhcmd1bWVudHMpO2M/KGMucHVzaChnKSxcIndoZW5cIj09PWUmJmZbMV0mJmQucHVzaChmWzFdKSk6bC5uZXh0VGljayhmdW5jdGlvbigpe2IucHJvbWlzZURpc3BhdGNoLmFwcGx5KGIsZyl9KX0sZi52YWx1ZU9mPWZ1bmN0aW9uKCl7aWYoYylyZXR1cm4gZjt2YXIgYT1yKGIpO3JldHVybiBzKGEpJiYoYj1hKSxhfSxmLmluc3BlY3Q9ZnVuY3Rpb24oKXtyZXR1cm4gYj9iLmluc3BlY3QoKTp7c3RhdGU6XCJwZW5kaW5nXCJ9fSxsLmxvbmdTdGFja1N1cHBvcnQmJlApdHJ5e3Rocm93IG5ldyBFcnJvcn1jYXRjaChnKXtmLnN0YWNrPWcuc3RhY2suc3Vic3RyaW5nKGcuc3RhY2suaW5kZXhPZihcIlxcblwiKSsxKX1yZXR1cm4gZS5wcm9taXNlPWYsZS5yZXNvbHZlPWZ1bmN0aW9uKGMpe2J8fGEobChjKSl9LGUuZnVsZmlsbD1mdW5jdGlvbihjKXtifHxhKEIoYykpfSxlLnJlamVjdD1mdW5jdGlvbihjKXtifHxhKEEoYykpfSxlLm5vdGlmeT1mdW5jdGlvbihhKXtifHxZKGQsZnVuY3Rpb24oYixjKXtsLm5leHRUaWNrKGZ1bmN0aW9uKCl7YyhhKX0pfSx2b2lkIDApfSxlfWZ1bmN0aW9uIG4oYSl7aWYoXCJmdW5jdGlvblwiIT10eXBlb2YgYSl0aHJvdyBuZXcgVHlwZUVycm9yKFwicmVzb2x2ZXIgbXVzdCBiZSBhIGZ1bmN0aW9uLlwiKTt2YXIgYj1tKCk7dHJ5e2EoYi5yZXNvbHZlLGIucmVqZWN0LGIubm90aWZ5KX1jYXRjaChjKXtiLnJlamVjdChjKX1yZXR1cm4gYi5wcm9taXNlfWZ1bmN0aW9uIG8oYSl7cmV0dXJuIG4oZnVuY3Rpb24oYixjKXtmb3IodmFyIGQ9MCxlPWEubGVuZ3RoO2U+ZDtkKyspbChhW2RdKS50aGVuKGIsYyl9KX1mdW5jdGlvbiBwKGEsYixjKXt2b2lkIDA9PT1iJiYoYj1mdW5jdGlvbihhKXtyZXR1cm4gQShuZXcgRXJyb3IoXCJQcm9taXNlIGRvZXMgbm90IHN1cHBvcnQgb3BlcmF0aW9uOiBcIithKSl9KSx2b2lkIDA9PT1jJiYoYz1mdW5jdGlvbigpe3JldHVybntzdGF0ZTpcInVua25vd25cIn19KTt2YXIgZD1fKHAucHJvdG90eXBlKTtpZihkLnByb21pc2VEaXNwYXRjaD1mdW5jdGlvbihjLGUsZil7dmFyIGc7dHJ5e2c9YVtlXT9hW2VdLmFwcGx5KGQsZik6Yi5jYWxsKGQsZSxmKX1jYXRjaChoKXtnPUEoaCl9YyYmYyhnKX0sZC5pbnNwZWN0PWMsYyl7dmFyIGU9YygpO1wicmVqZWN0ZWRcIj09PWUuc3RhdGUmJihkLmV4Y2VwdGlvbj1lLnJlYXNvbiksZC52YWx1ZU9mPWZ1bmN0aW9uKCl7dmFyIGE9YygpO3JldHVyblwicGVuZGluZ1wiPT09YS5zdGF0ZXx8XCJyZWplY3RlZFwiPT09YS5zdGF0ZT9kOmEudmFsdWV9fXJldHVybiBkfWZ1bmN0aW9uIHEoYSxiLGMsZCl7cmV0dXJuIGwoYSkudGhlbihiLGMsZCl9ZnVuY3Rpb24gcihhKXtpZihzKGEpKXt2YXIgYj1hLmluc3BlY3QoKTtpZihcImZ1bGZpbGxlZFwiPT09Yi5zdGF0ZSlyZXR1cm4gYi52YWx1ZX1yZXR1cm4gYX1mdW5jdGlvbiBzKGEpe3JldHVybiBhIGluc3RhbmNlb2YgcH1mdW5jdGlvbiB0KGEpe3JldHVybiBjKGEpJiZcImZ1bmN0aW9uXCI9PXR5cGVvZiBhLnRoZW59ZnVuY3Rpb24gdShhKXtyZXR1cm4gcyhhKSYmXCJwZW5kaW5nXCI9PT1hLmluc3BlY3QoKS5zdGF0ZX1mdW5jdGlvbiB2KGEpe3JldHVybiFzKGEpfHxcImZ1bGZpbGxlZFwiPT09YS5pbnNwZWN0KCkuc3RhdGV9ZnVuY3Rpb24gdyhhKXtyZXR1cm4gcyhhKSYmXCJyZWplY3RlZFwiPT09YS5pbnNwZWN0KCkuc3RhdGV9ZnVuY3Rpb24geCgpe2ViLmxlbmd0aD0wLGZiLmxlbmd0aD0wLGdifHwoZ2I9ITApfWZ1bmN0aW9uIHkoYSxiKXtnYiYmKGZiLnB1c2goYSksZWIucHVzaChiJiZcInVuZGVmaW5lZFwiIT10eXBlb2YgYi5zdGFjaz9iLnN0YWNrOlwiKG5vIHN0YWNrKSBcIitiKSl9ZnVuY3Rpb24geihhKXtpZihnYil7dmFyIGI9WihmYixhKTstMSE9PWImJihmYi5zcGxpY2UoYiwxKSxlYi5zcGxpY2UoYiwxKSl9fWZ1bmN0aW9uIEEoYSl7dmFyIGI9cCh7d2hlbjpmdW5jdGlvbihiKXtyZXR1cm4gYiYmeih0aGlzKSxiP2IoYSk6dGhpc319LGZ1bmN0aW9uKCl7cmV0dXJuIHRoaXN9LGZ1bmN0aW9uKCl7cmV0dXJue3N0YXRlOlwicmVqZWN0ZWRcIixyZWFzb246YX19KTtyZXR1cm4geShiLGEpLGJ9ZnVuY3Rpb24gQihhKXtyZXR1cm4gcCh7d2hlbjpmdW5jdGlvbigpe3JldHVybiBhfSxnZXQ6ZnVuY3Rpb24oYil7cmV0dXJuIGFbYl19LHNldDpmdW5jdGlvbihiLGMpe2FbYl09Y30sXCJkZWxldGVcIjpmdW5jdGlvbihiKXtkZWxldGUgYVtiXVxufSxwb3N0OmZ1bmN0aW9uKGIsYyl7cmV0dXJuIG51bGw9PT1ifHx2b2lkIDA9PT1iP2EuYXBwbHkodm9pZCAwLGMpOmFbYl0uYXBwbHkoYSxjKX0sYXBwbHk6ZnVuY3Rpb24oYixjKXtyZXR1cm4gYS5hcHBseShiLGMpfSxrZXlzOmZ1bmN0aW9uKCl7cmV0dXJuIGJiKGEpfX0sdm9pZCAwLGZ1bmN0aW9uKCl7cmV0dXJue3N0YXRlOlwiZnVsZmlsbGVkXCIsdmFsdWU6YX19KX1mdW5jdGlvbiBDKGEpe3ZhciBiPW0oKTtyZXR1cm4gbC5uZXh0VGljayhmdW5jdGlvbigpe3RyeXthLnRoZW4oYi5yZXNvbHZlLGIucmVqZWN0LGIubm90aWZ5KX1jYXRjaChjKXtiLnJlamVjdChjKX19KSxiLnByb21pc2V9ZnVuY3Rpb24gRChhKXtyZXR1cm4gcCh7aXNEZWY6ZnVuY3Rpb24oKXt9fSxmdW5jdGlvbihiLGMpe3JldHVybiBKKGEsYixjKX0sZnVuY3Rpb24oKXtyZXR1cm4gbChhKS5pbnNwZWN0KCl9KX1mdW5jdGlvbiBFKGEsYixjKXtyZXR1cm4gbChhKS5zcHJlYWQoYixjKX1mdW5jdGlvbiBGKGEpe3JldHVybiBmdW5jdGlvbigpe2Z1bmN0aW9uIGIoYSxiKXt2YXIgZztpZihcInVuZGVmaW5lZFwiPT10eXBlb2YgU3RvcEl0ZXJhdGlvbil7dHJ5e2c9Y1thXShiKX1jYXRjaChoKXtyZXR1cm4gQShoKX1yZXR1cm4gZy5kb25lP2woZy52YWx1ZSk6cShnLnZhbHVlLGUsZil9dHJ5e2c9Y1thXShiKX1jYXRjaChoKXtyZXR1cm4gZChoKT9sKGgudmFsdWUpOkEoaCl9cmV0dXJuIHEoZyxlLGYpfXZhciBjPWEuYXBwbHkodGhpcyxhcmd1bWVudHMpLGU9Yi5iaW5kKGIsXCJuZXh0XCIpLGY9Yi5iaW5kKGIsXCJ0aHJvd1wiKTtyZXR1cm4gZSgpfX1mdW5jdGlvbiBHKGEpe2wuZG9uZShsLmFzeW5jKGEpKCkpfWZ1bmN0aW9uIEgoYSl7dGhyb3cgbmV3IFMoYSl9ZnVuY3Rpb24gSShhKXtyZXR1cm4gZnVuY3Rpb24oKXtyZXR1cm4gRShbdGhpcyxLKGFyZ3VtZW50cyldLGZ1bmN0aW9uKGIsYyl7cmV0dXJuIGEuYXBwbHkoYixjKX0pfX1mdW5jdGlvbiBKKGEsYixjKXtyZXR1cm4gbChhKS5kaXNwYXRjaChiLGMpfWZ1bmN0aW9uIEsoYSl7cmV0dXJuIHEoYSxmdW5jdGlvbihhKXt2YXIgYj0wLGM9bSgpO3JldHVybiBZKGEsZnVuY3Rpb24oZCxlLGYpe3ZhciBnO3MoZSkmJlwiZnVsZmlsbGVkXCI9PT0oZz1lLmluc3BlY3QoKSkuc3RhdGU/YVtmXT1nLnZhbHVlOigrK2IscShlLGZ1bmN0aW9uKGQpe2FbZl09ZCwwPT09LS1iJiZjLnJlc29sdmUoYSl9LGMucmVqZWN0LGZ1bmN0aW9uKGEpe2Mubm90aWZ5KHtpbmRleDpmLHZhbHVlOmF9KX0pKX0sdm9pZCAwKSwwPT09YiYmYy5yZXNvbHZlKGEpLGMucHJvbWlzZX0pfWZ1bmN0aW9uIEwoYSl7cmV0dXJuIHEoYSxmdW5jdGlvbihhKXtyZXR1cm4gYT0kKGEsbCkscShLKCQoYSxmdW5jdGlvbihhKXtyZXR1cm4gcShhLFUsVSl9KSksZnVuY3Rpb24oKXtyZXR1cm4gYX0pfSl9ZnVuY3Rpb24gTShhKXtyZXR1cm4gbChhKS5hbGxTZXR0bGVkKCl9ZnVuY3Rpb24gTihhLGIpe3JldHVybiBsKGEpLnRoZW4odm9pZCAwLHZvaWQgMCxiKX1mdW5jdGlvbiBPKGEsYil7cmV0dXJuIGwoYSkubm9kZWlmeShiKX12YXIgUD0hMTt0cnl7dGhyb3cgbmV3IEVycm9yfWNhdGNoKFEpe1A9ISFRLnN0YWNrfXZhciBSLFMsVD1qKCksVT1mdW5jdGlvbigpe30sVj1mdW5jdGlvbigpe2Z1bmN0aW9uIGIoKXtmb3IoO2MubmV4dDspe2M9Yy5uZXh0O3ZhciBhPWMudGFzaztjLnRhc2s9dm9pZCAwO3ZhciBkPWMuZG9tYWluO2QmJihjLmRvbWFpbj12b2lkIDAsZC5lbnRlcigpKTt0cnl7YSgpfWNhdGNoKGYpe2lmKGcpdGhyb3cgZCYmZC5leGl0KCksc2V0VGltZW91dChiLDApLGQmJmQuZW50ZXIoKSxmO3NldFRpbWVvdXQoZnVuY3Rpb24oKXt0aHJvdyBmfSwwKX1kJiZkLmV4aXQoKX1lPSExfXZhciBjPXt0YXNrOnZvaWQgMCxuZXh0Om51bGx9LGQ9YyxlPSExLGY9dm9pZCAwLGc9ITE7aWYoVj1mdW5jdGlvbihiKXtkPWQubmV4dD17dGFzazpiLGRvbWFpbjpnJiZhLmRvbWFpbixuZXh0Om51bGx9LGV8fChlPSEwLGYoKSl9LFwidW5kZWZpbmVkXCIhPXR5cGVvZiBhJiZhLm5leHRUaWNrKWc9ITAsZj1mdW5jdGlvbigpe2EubmV4dFRpY2soYil9O2Vsc2UgaWYoXCJmdW5jdGlvblwiPT10eXBlb2Ygc2V0SW1tZWRpYXRlKWY9XCJ1bmRlZmluZWRcIiE9dHlwZW9mIHdpbmRvdz9zZXRJbW1lZGlhdGUuYmluZCh3aW5kb3csYik6ZnVuY3Rpb24oKXtzZXRJbW1lZGlhdGUoYil9O2Vsc2UgaWYoXCJ1bmRlZmluZWRcIiE9dHlwZW9mIE1lc3NhZ2VDaGFubmVsKXt2YXIgaD1uZXcgTWVzc2FnZUNoYW5uZWw7aC5wb3J0MS5vbm1lc3NhZ2U9ZnVuY3Rpb24oKXtmPWksaC5wb3J0MS5vbm1lc3NhZ2U9YixiKCl9O3ZhciBpPWZ1bmN0aW9uKCl7aC5wb3J0Mi5wb3N0TWVzc2FnZSgwKX07Zj1mdW5jdGlvbigpe3NldFRpbWVvdXQoYiwwKSxpKCl9fWVsc2UgZj1mdW5jdGlvbigpe3NldFRpbWVvdXQoYiwwKX07cmV0dXJuIFZ9KCksVz1GdW5jdGlvbi5jYWxsLFg9YihBcnJheS5wcm90b3R5cGUuc2xpY2UpLFk9YihBcnJheS5wcm90b3R5cGUucmVkdWNlfHxmdW5jdGlvbihhLGIpe3ZhciBjPTAsZD10aGlzLmxlbmd0aDtpZigxPT09YXJndW1lbnRzLmxlbmd0aClmb3IoOzspe2lmKGMgaW4gdGhpcyl7Yj10aGlzW2MrK107YnJlYWt9aWYoKytjPj1kKXRocm93IG5ldyBUeXBlRXJyb3J9Zm9yKDtkPmM7YysrKWMgaW4gdGhpcyYmKGI9YShiLHRoaXNbY10sYykpO3JldHVybiBifSksWj1iKEFycmF5LnByb3RvdHlwZS5pbmRleE9mfHxmdW5jdGlvbihhKXtmb3IodmFyIGI9MDtiPHRoaXMubGVuZ3RoO2IrKylpZih0aGlzW2JdPT09YSlyZXR1cm4gYjtyZXR1cm4tMX0pLCQ9YihBcnJheS5wcm90b3R5cGUubWFwfHxmdW5jdGlvbihhLGIpe3ZhciBjPXRoaXMsZD1bXTtyZXR1cm4gWShjLGZ1bmN0aW9uKGUsZixnKXtkLnB1c2goYS5jYWxsKGIsZixnLGMpKX0sdm9pZCAwKSxkfSksXz1PYmplY3QuY3JlYXRlfHxmdW5jdGlvbihhKXtmdW5jdGlvbiBiKCl7fXJldHVybiBiLnByb3RvdHlwZT1hLG5ldyBifSxhYj1iKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkpLGJiPU9iamVjdC5rZXlzfHxmdW5jdGlvbihhKXt2YXIgYj1bXTtmb3IodmFyIGMgaW4gYSlhYihhLGMpJiZiLnB1c2goYyk7cmV0dXJuIGJ9LGNiPWIoT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZyk7Uz1cInVuZGVmaW5lZFwiIT10eXBlb2YgUmV0dXJuVmFsdWU/UmV0dXJuVmFsdWU6ZnVuY3Rpb24oYSl7dGhpcy52YWx1ZT1hfTt2YXIgZGI9XCJGcm9tIHByZXZpb3VzIGV2ZW50OlwiO2wucmVzb2x2ZT1sLGwubmV4dFRpY2s9VixsLmxvbmdTdGFja1N1cHBvcnQ9ITEsXCJvYmplY3RcIj09dHlwZW9mIGEmJmEmJmEuZW52JiZhLmVudi5RX0RFQlVHJiYobC5sb25nU3RhY2tTdXBwb3J0PSEwKSxsLmRlZmVyPW0sbS5wcm90b3R5cGUubWFrZU5vZGVSZXNvbHZlcj1mdW5jdGlvbigpe3ZhciBhPXRoaXM7cmV0dXJuIGZ1bmN0aW9uKGIsYyl7Yj9hLnJlamVjdChiKTphLnJlc29sdmUoYXJndW1lbnRzLmxlbmd0aD4yP1goYXJndW1lbnRzLDEpOmMpfX0sbC5Qcm9taXNlPW4sbC5wcm9taXNlPW4sbi5yYWNlPW8sbi5hbGw9SyxuLnJlamVjdD1BLG4ucmVzb2x2ZT1sLGwucGFzc0J5Q29weT1mdW5jdGlvbihhKXtyZXR1cm4gYX0scC5wcm90b3R5cGUucGFzc0J5Q29weT1mdW5jdGlvbigpe3JldHVybiB0aGlzfSxsLmpvaW49ZnVuY3Rpb24oYSxiKXtyZXR1cm4gbChhKS5qb2luKGIpfSxwLnByb3RvdHlwZS5qb2luPWZ1bmN0aW9uKGEpe3JldHVybiBsKFt0aGlzLGFdKS5zcHJlYWQoZnVuY3Rpb24oYSxiKXtpZihhPT09YilyZXR1cm4gYTt0aHJvdyBuZXcgRXJyb3IoXCJDYW4ndCBqb2luOiBub3QgdGhlIHNhbWU6IFwiK2ErXCIgXCIrYil9KX0sbC5yYWNlPW8scC5wcm90b3R5cGUucmFjZT1mdW5jdGlvbigpe3JldHVybiB0aGlzLnRoZW4obC5yYWNlKX0sbC5tYWtlUHJvbWlzZT1wLHAucHJvdG90eXBlLnRvU3RyaW5nPWZ1bmN0aW9uKCl7cmV0dXJuXCJbb2JqZWN0IFByb21pc2VdXCJ9LHAucHJvdG90eXBlLnRoZW49ZnVuY3Rpb24oYSxiLGMpe2Z1bmN0aW9uIGQoYil7dHJ5e3JldHVyblwiZnVuY3Rpb25cIj09dHlwZW9mIGE/YShiKTpifWNhdGNoKGMpe3JldHVybiBBKGMpfX1mdW5jdGlvbiBmKGEpe2lmKFwiZnVuY3Rpb25cIj09dHlwZW9mIGIpe2UoYSxoKTt0cnl7cmV0dXJuIGIoYSl9Y2F0Y2goYyl7cmV0dXJuIEEoYyl9fXJldHVybiBBKGEpfWZ1bmN0aW9uIGcoYSl7cmV0dXJuXCJmdW5jdGlvblwiPT10eXBlb2YgYz9jKGEpOmF9dmFyIGg9dGhpcyxpPW0oKSxqPSExO3JldHVybiBsLm5leHRUaWNrKGZ1bmN0aW9uKCl7aC5wcm9taXNlRGlzcGF0Y2goZnVuY3Rpb24oYSl7anx8KGo9ITAsaS5yZXNvbHZlKGQoYSkpKX0sXCJ3aGVuXCIsW2Z1bmN0aW9uKGEpe2p8fChqPSEwLGkucmVzb2x2ZShmKGEpKSl9XSl9KSxoLnByb21pc2VEaXNwYXRjaCh2b2lkIDAsXCJ3aGVuXCIsW3ZvaWQgMCxmdW5jdGlvbihhKXt2YXIgYixjPSExO3RyeXtiPWcoYSl9Y2F0Y2goZCl7aWYoYz0hMCwhbC5vbmVycm9yKXRocm93IGQ7bC5vbmVycm9yKGQpfWN8fGkubm90aWZ5KGIpfV0pLGkucHJvbWlzZX0sbC50YXA9ZnVuY3Rpb24oYSxiKXtyZXR1cm4gbChhKS50YXAoYil9LHAucHJvdG90eXBlLnRhcD1mdW5jdGlvbihhKXtyZXR1cm4gYT1sKGEpLHRoaXMudGhlbihmdW5jdGlvbihiKXtyZXR1cm4gYS5mY2FsbChiKS50aGVuUmVzb2x2ZShiKX0pfSxsLndoZW49cSxwLnByb3RvdHlwZS50aGVuUmVzb2x2ZT1mdW5jdGlvbihhKXtyZXR1cm4gdGhpcy50aGVuKGZ1bmN0aW9uKCl7cmV0dXJuIGF9KX0sbC50aGVuUmVzb2x2ZT1mdW5jdGlvbihhLGIpe3JldHVybiBsKGEpLnRoZW5SZXNvbHZlKGIpfSxwLnByb3RvdHlwZS50aGVuUmVqZWN0PWZ1bmN0aW9uKGEpe3JldHVybiB0aGlzLnRoZW4oZnVuY3Rpb24oKXt0aHJvdyBhfSl9LGwudGhlblJlamVjdD1mdW5jdGlvbihhLGIpe3JldHVybiBsKGEpLnRoZW5SZWplY3QoYil9LGwubmVhcmVyPXIsbC5pc1Byb21pc2U9cyxsLmlzUHJvbWlzZUFsaWtlPXQsbC5pc1BlbmRpbmc9dSxwLnByb3RvdHlwZS5pc1BlbmRpbmc9ZnVuY3Rpb24oKXtyZXR1cm5cInBlbmRpbmdcIj09PXRoaXMuaW5zcGVjdCgpLnN0YXRlfSxsLmlzRnVsZmlsbGVkPXYscC5wcm90b3R5cGUuaXNGdWxmaWxsZWQ9ZnVuY3Rpb24oKXtyZXR1cm5cImZ1bGZpbGxlZFwiPT09dGhpcy5pbnNwZWN0KCkuc3RhdGV9LGwuaXNSZWplY3RlZD13LHAucHJvdG90eXBlLmlzUmVqZWN0ZWQ9ZnVuY3Rpb24oKXtyZXR1cm5cInJlamVjdGVkXCI9PT10aGlzLmluc3BlY3QoKS5zdGF0ZX07dmFyIGViPVtdLGZiPVtdLGdiPSEwO2wucmVzZXRVbmhhbmRsZWRSZWplY3Rpb25zPXgsbC5nZXRVbmhhbmRsZWRSZWFzb25zPWZ1bmN0aW9uKCl7cmV0dXJuIGViLnNsaWNlKCl9LGwuc3RvcFVuaGFuZGxlZFJlamVjdGlvblRyYWNraW5nPWZ1bmN0aW9uKCl7eCgpLGdiPSExfSx4KCksbC5yZWplY3Q9QSxsLmZ1bGZpbGw9QixsLm1hc3Rlcj1ELGwuc3ByZWFkPUUscC5wcm90b3R5cGUuc3ByZWFkPWZ1bmN0aW9uKGEsYil7cmV0dXJuIHRoaXMuYWxsKCkudGhlbihmdW5jdGlvbihiKXtyZXR1cm4gYS5hcHBseSh2b2lkIDAsYil9LGIpfSxsLmFzeW5jPUYsbC5zcGF3bj1HLGxbXCJyZXR1cm5cIl09SCxsLnByb21pc2VkPUksbC5kaXNwYXRjaD1KLHAucHJvdG90eXBlLmRpc3BhdGNoPWZ1bmN0aW9uKGEsYil7dmFyIGM9dGhpcyxkPW0oKTtyZXR1cm4gbC5uZXh0VGljayhmdW5jdGlvbigpe2MucHJvbWlzZURpc3BhdGNoKGQucmVzb2x2ZSxhLGIpfSksZC5wcm9taXNlfSxsLmdldD1mdW5jdGlvbihhLGIpe3JldHVybiBsKGEpLmRpc3BhdGNoKFwiZ2V0XCIsW2JdKX0scC5wcm90b3R5cGUuZ2V0PWZ1bmN0aW9uKGEpe3JldHVybiB0aGlzLmRpc3BhdGNoKFwiZ2V0XCIsW2FdKX0sbC5zZXQ9ZnVuY3Rpb24oYSxiLGMpe3JldHVybiBsKGEpLmRpc3BhdGNoKFwic2V0XCIsW2IsY10pfSxwLnByb3RvdHlwZS5zZXQ9ZnVuY3Rpb24oYSxiKXtyZXR1cm4gdGhpcy5kaXNwYXRjaChcInNldFwiLFthLGJdKX0sbC5kZWw9bFtcImRlbGV0ZVwiXT1mdW5jdGlvbihhLGIpe3JldHVybiBsKGEpLmRpc3BhdGNoKFwiZGVsZXRlXCIsW2JdKX0scC5wcm90b3R5cGUuZGVsPXAucHJvdG90eXBlW1wiZGVsZXRlXCJdPWZ1bmN0aW9uKGEpe3JldHVybiB0aGlzLmRpc3BhdGNoKFwiZGVsZXRlXCIsW2FdKX0sbC5tYXBwbHk9bC5wb3N0PWZ1bmN0aW9uKGEsYixjKXtyZXR1cm4gbChhKS5kaXNwYXRjaChcInBvc3RcIixbYixjXSl9LHAucHJvdG90eXBlLm1hcHBseT1wLnByb3RvdHlwZS5wb3N0PWZ1bmN0aW9uKGEsYil7cmV0dXJuIHRoaXMuZGlzcGF0Y2goXCJwb3N0XCIsW2EsYl0pfSxsLnNlbmQ9bC5tY2FsbD1sLmludm9rZT1mdW5jdGlvbihhLGIpe3JldHVybiBsKGEpLmRpc3BhdGNoKFwicG9zdFwiLFtiLFgoYXJndW1lbnRzLDIpXSl9LHAucHJvdG90eXBlLnNlbmQ9cC5wcm90b3R5cGUubWNhbGw9cC5wcm90b3R5cGUuaW52b2tlPWZ1bmN0aW9uKGEpe3JldHVybiB0aGlzLmRpc3BhdGNoKFwicG9zdFwiLFthLFgoYXJndW1lbnRzLDEpXSl9LGwuZmFwcGx5PWZ1bmN0aW9uKGEsYil7cmV0dXJuIGwoYSkuZGlzcGF0Y2goXCJhcHBseVwiLFt2b2lkIDAsYl0pfSxwLnByb3RvdHlwZS5mYXBwbHk9ZnVuY3Rpb24oYSl7cmV0dXJuIHRoaXMuZGlzcGF0Y2goXCJhcHBseVwiLFt2b2lkIDAsYV0pfSxsW1widHJ5XCJdPWwuZmNhbGw9ZnVuY3Rpb24oYSl7cmV0dXJuIGwoYSkuZGlzcGF0Y2goXCJhcHBseVwiLFt2b2lkIDAsWChhcmd1bWVudHMsMSldKX0scC5wcm90b3R5cGUuZmNhbGw9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5kaXNwYXRjaChcImFwcGx5XCIsW3ZvaWQgMCxYKGFyZ3VtZW50cyldKX0sbC5mYmluZD1mdW5jdGlvbihhKXt2YXIgYj1sKGEpLGM9WChhcmd1bWVudHMsMSk7cmV0dXJuIGZ1bmN0aW9uKCl7cmV0dXJuIGIuZGlzcGF0Y2goXCJhcHBseVwiLFt0aGlzLGMuY29uY2F0KFgoYXJndW1lbnRzKSldKX19LHAucHJvdG90eXBlLmZiaW5kPWZ1bmN0aW9uKCl7dmFyIGE9dGhpcyxiPVgoYXJndW1lbnRzKTtyZXR1cm4gZnVuY3Rpb24oKXtyZXR1cm4gYS5kaXNwYXRjaChcImFwcGx5XCIsW3RoaXMsYi5jb25jYXQoWChhcmd1bWVudHMpKV0pfX0sbC5rZXlzPWZ1bmN0aW9uKGEpe3JldHVybiBsKGEpLmRpc3BhdGNoKFwia2V5c1wiLFtdKX0scC5wcm90b3R5cGUua2V5cz1mdW5jdGlvbigpe3JldHVybiB0aGlzLmRpc3BhdGNoKFwia2V5c1wiLFtdKX0sbC5hbGw9SyxwLnByb3RvdHlwZS5hbGw9ZnVuY3Rpb24oKXtyZXR1cm4gSyh0aGlzKX0sbC5hbGxSZXNvbHZlZD1rKEwsXCJhbGxSZXNvbHZlZFwiLFwiYWxsU2V0dGxlZFwiKSxwLnByb3RvdHlwZS5hbGxSZXNvbHZlZD1mdW5jdGlvbigpe3JldHVybiBMKHRoaXMpfSxsLmFsbFNldHRsZWQ9TSxwLnByb3RvdHlwZS5hbGxTZXR0bGVkPWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMudGhlbihmdW5jdGlvbihhKXtyZXR1cm4gSygkKGEsZnVuY3Rpb24oYSl7ZnVuY3Rpb24gYigpe3JldHVybiBhLmluc3BlY3QoKX1yZXR1cm4gYT1sKGEpLGEudGhlbihiLGIpfSkpfSl9LGwuZmFpbD1sW1wiY2F0Y2hcIl09ZnVuY3Rpb24oYSxiKXtyZXR1cm4gbChhKS50aGVuKHZvaWQgMCxiKX0scC5wcm90b3R5cGUuZmFpbD1wLnByb3RvdHlwZVtcImNhdGNoXCJdPWZ1bmN0aW9uKGEpe3JldHVybiB0aGlzLnRoZW4odm9pZCAwLGEpfSxsLnByb2dyZXNzPU4scC5wcm90b3R5cGUucHJvZ3Jlc3M9ZnVuY3Rpb24oYSl7cmV0dXJuIHRoaXMudGhlbih2b2lkIDAsdm9pZCAwLGEpfSxsLmZpbj1sW1wiZmluYWxseVwiXT1mdW5jdGlvbihhLGIpe3JldHVybiBsKGEpW1wiZmluYWxseVwiXShiKX0scC5wcm90b3R5cGUuZmluPXAucHJvdG90eXBlW1wiZmluYWxseVwiXT1mdW5jdGlvbihhKXtyZXR1cm4gYT1sKGEpLHRoaXMudGhlbihmdW5jdGlvbihiKXtyZXR1cm4gYS5mY2FsbCgpLnRoZW4oZnVuY3Rpb24oKXtyZXR1cm4gYn0pfSxmdW5jdGlvbihiKXtyZXR1cm4gYS5mY2FsbCgpLnRoZW4oZnVuY3Rpb24oKXt0aHJvdyBifSl9KX0sbC5kb25lPWZ1bmN0aW9uKGEsYixjLGQpe3JldHVybiBsKGEpLmRvbmUoYixjLGQpfSxwLnByb3RvdHlwZS5kb25lPWZ1bmN0aW9uKGIsYyxkKXt2YXIgZj1mdW5jdGlvbihhKXtsLm5leHRUaWNrKGZ1bmN0aW9uKCl7aWYoZShhLGcpLCFsLm9uZXJyb3IpdGhyb3cgYTtsLm9uZXJyb3IoYSl9KX0sZz1ifHxjfHxkP3RoaXMudGhlbihiLGMsZCk6dGhpcztcIm9iamVjdFwiPT10eXBlb2YgYSYmYSYmYS5kb21haW4mJihmPWEuZG9tYWluLmJpbmQoZikpLGcudGhlbih2b2lkIDAsZil9LGwudGltZW91dD1mdW5jdGlvbihhLGIsYyl7cmV0dXJuIGwoYSkudGltZW91dChiLGMpfSxwLnByb3RvdHlwZS50aW1lb3V0PWZ1bmN0aW9uKGEsYil7dmFyIGM9bSgpLGQ9c2V0VGltZW91dChmdW5jdGlvbigpe2ImJlwic3RyaW5nXCIhPXR5cGVvZiBifHwoYj1uZXcgRXJyb3IoYnx8XCJUaW1lZCBvdXQgYWZ0ZXIgXCIrYStcIiBtc1wiKSxiLmNvZGU9XCJFVElNRURPVVRcIiksYy5yZWplY3QoYil9LGEpO3JldHVybiB0aGlzLnRoZW4oZnVuY3Rpb24oYSl7Y2xlYXJUaW1lb3V0KGQpLGMucmVzb2x2ZShhKX0sZnVuY3Rpb24oYSl7Y2xlYXJUaW1lb3V0KGQpLGMucmVqZWN0KGEpfSxjLm5vdGlmeSksYy5wcm9taXNlfSxsLmRlbGF5PWZ1bmN0aW9uKGEsYil7cmV0dXJuIHZvaWQgMD09PWImJihiPWEsYT12b2lkIDApLGwoYSkuZGVsYXkoYil9LHAucHJvdG90eXBlLmRlbGF5PWZ1bmN0aW9uKGEpe3JldHVybiB0aGlzLnRoZW4oZnVuY3Rpb24oYil7dmFyIGM9bSgpO3JldHVybiBzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7Yy5yZXNvbHZlKGIpfSxhKSxjLnByb21pc2V9KX0sbC5uZmFwcGx5PWZ1bmN0aW9uKGEsYil7cmV0dXJuIGwoYSkubmZhcHBseShiKX0scC5wcm90b3R5cGUubmZhcHBseT1mdW5jdGlvbihhKXt2YXIgYj1tKCksYz1YKGEpO3JldHVybiBjLnB1c2goYi5tYWtlTm9kZVJlc29sdmVyKCkpLHRoaXMuZmFwcGx5KGMpLmZhaWwoYi5yZWplY3QpLGIucHJvbWlzZX0sbC5uZmNhbGw9ZnVuY3Rpb24oYSl7dmFyIGI9WChhcmd1bWVudHMsMSk7cmV0dXJuIGwoYSkubmZhcHBseShiKX0scC5wcm90b3R5cGUubmZjYWxsPWZ1bmN0aW9uKCl7dmFyIGE9WChhcmd1bWVudHMpLGI9bSgpO3JldHVybiBhLnB1c2goYi5tYWtlTm9kZVJlc29sdmVyKCkpLHRoaXMuZmFwcGx5KGEpLmZhaWwoYi5yZWplY3QpLGIucHJvbWlzZX0sbC5uZmJpbmQ9bC5kZW5vZGVpZnk9ZnVuY3Rpb24oYSl7dmFyIGI9WChhcmd1bWVudHMsMSk7cmV0dXJuIGZ1bmN0aW9uKCl7dmFyIGM9Yi5jb25jYXQoWChhcmd1bWVudHMpKSxkPW0oKTtyZXR1cm4gYy5wdXNoKGQubWFrZU5vZGVSZXNvbHZlcigpKSxsKGEpLmZhcHBseShjKS5mYWlsKGQucmVqZWN0KSxkLnByb21pc2V9fSxwLnByb3RvdHlwZS5uZmJpbmQ9cC5wcm90b3R5cGUuZGVub2RlaWZ5PWZ1bmN0aW9uKCl7dmFyIGE9WChhcmd1bWVudHMpO3JldHVybiBhLnVuc2hpZnQodGhpcyksbC5kZW5vZGVpZnkuYXBwbHkodm9pZCAwLGEpfSxsLm5iaW5kPWZ1bmN0aW9uKGEsYil7dmFyIGM9WChhcmd1bWVudHMsMik7cmV0dXJuIGZ1bmN0aW9uKCl7ZnVuY3Rpb24gZCgpe3JldHVybiBhLmFwcGx5KGIsYXJndW1lbnRzKX12YXIgZT1jLmNvbmNhdChYKGFyZ3VtZW50cykpLGY9bSgpO3JldHVybiBlLnB1c2goZi5tYWtlTm9kZVJlc29sdmVyKCkpLGwoZCkuZmFwcGx5KGUpLmZhaWwoZi5yZWplY3QpLGYucHJvbWlzZX19LHAucHJvdG90eXBlLm5iaW5kPWZ1bmN0aW9uKCl7dmFyIGE9WChhcmd1bWVudHMsMCk7cmV0dXJuIGEudW5zaGlmdCh0aGlzKSxsLm5iaW5kLmFwcGx5KHZvaWQgMCxhKX0sbC5ubWFwcGx5PWwubnBvc3Q9ZnVuY3Rpb24oYSxiLGMpe3JldHVybiBsKGEpLm5wb3N0KGIsYyl9LHAucHJvdG90eXBlLm5tYXBwbHk9cC5wcm90b3R5cGUubnBvc3Q9ZnVuY3Rpb24oYSxiKXt2YXIgYz1YKGJ8fFtdKSxkPW0oKTtyZXR1cm4gYy5wdXNoKGQubWFrZU5vZGVSZXNvbHZlcigpKSx0aGlzLmRpc3BhdGNoKFwicG9zdFwiLFthLGNdKS5mYWlsKGQucmVqZWN0KSxkLnByb21pc2V9LGwubnNlbmQ9bC5ubWNhbGw9bC5uaW52b2tlPWZ1bmN0aW9uKGEsYil7dmFyIGM9WChhcmd1bWVudHMsMiksZD1tKCk7cmV0dXJuIGMucHVzaChkLm1ha2VOb2RlUmVzb2x2ZXIoKSksbChhKS5kaXNwYXRjaChcInBvc3RcIixbYixjXSkuZmFpbChkLnJlamVjdCksZC5wcm9taXNlfSxwLnByb3RvdHlwZS5uc2VuZD1wLnByb3RvdHlwZS5ubWNhbGw9cC5wcm90b3R5cGUubmludm9rZT1mdW5jdGlvbihhKXt2YXIgYj1YKGFyZ3VtZW50cywxKSxjPW0oKTtyZXR1cm4gYi5wdXNoKGMubWFrZU5vZGVSZXNvbHZlcigpKSx0aGlzLmRpc3BhdGNoKFwicG9zdFwiLFthLGJdKS5mYWlsKGMucmVqZWN0KSxjLnByb21pc2V9LGwubm9kZWlmeT1PLHAucHJvdG90eXBlLm5vZGVpZnk9ZnVuY3Rpb24oYSl7cmV0dXJuIGE/dm9pZCB0aGlzLnRoZW4oZnVuY3Rpb24oYil7bC5uZXh0VGljayhmdW5jdGlvbigpe2EobnVsbCxiKX0pfSxmdW5jdGlvbihiKXtsLm5leHRUaWNrKGZ1bmN0aW9uKCl7YShiKX0pfSk6dGhpc307dmFyIGhiPWooKTtyZXR1cm4gbH0pfSkuY2FsbCh0aGlzLGEoXCIvVXNlcnMvYW50b2luZS9wcm9qZWN0cy9vYXV0aC1qcy9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvaW5zZXJ0LW1vZHVsZS1nbG9iYWxzL25vZGVfbW9kdWxlcy9wcm9jZXNzL2Jyb3dzZXIuanNcIikpfSx7XCIvVXNlcnMvYW50b2luZS9wcm9qZWN0cy9vYXV0aC1qcy9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvaW5zZXJ0LW1vZHVsZS1nbG9iYWxzL25vZGVfbW9kdWxlcy9wcm9jZXNzL2Jyb3dzZXIuanNcIjoxNX1dfSx7fSxbOF0pOyIsImFuZ3VsYXIubW9kdWxlKCd1aS5ib290c3RyYXAucGFnaW5hdGlvbicsIFtdKVxuXG4uY29udHJvbGxlcignUGFnaW5hdGlvbkNvbnRyb2xsZXInLCBbJyRzY29wZScsICckYXR0cnMnLCAnJHBhcnNlJywgZnVuY3Rpb24gKCRzY29wZSwgJGF0dHJzLCAkcGFyc2UpIHtcbiAgdmFyIHNlbGYgPSB0aGlzLFxuICAgICAgbmdNb2RlbEN0cmwgPSB7ICRzZXRWaWV3VmFsdWU6IGFuZ3VsYXIubm9vcCB9LCAvLyBudWxsTW9kZWxDdHJsXG4gICAgICBzZXROdW1QYWdlcyA9ICRhdHRycy5udW1QYWdlcyA/ICRwYXJzZSgkYXR0cnMubnVtUGFnZXMpLmFzc2lnbiA6IGFuZ3VsYXIubm9vcDtcblxuICB0aGlzLmluaXQgPSBmdW5jdGlvbihuZ01vZGVsQ3RybF8sIGNvbmZpZykge1xuICAgIG5nTW9kZWxDdHJsID0gbmdNb2RlbEN0cmxfO1xuICAgIHRoaXMuY29uZmlnID0gY29uZmlnO1xuXG4gICAgbmdNb2RlbEN0cmwuJHJlbmRlciA9IGZ1bmN0aW9uKCkge1xuICAgICAgc2VsZi5yZW5kZXIoKTtcbiAgICB9O1xuXG4gICAgaWYgKCRhdHRycy5pdGVtc1BlclBhZ2UpIHtcbiAgICAgICRzY29wZS4kcGFyZW50LiR3YXRjaCgkcGFyc2UoJGF0dHJzLml0ZW1zUGVyUGFnZSksIGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgIHNlbGYuaXRlbXNQZXJQYWdlID0gcGFyc2VJbnQodmFsdWUsIDEwKTtcbiAgICAgICAgJHNjb3BlLnRvdGFsUGFnZXMgPSBzZWxmLmNhbGN1bGF0ZVRvdGFsUGFnZXMoKTtcbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLml0ZW1zUGVyUGFnZSA9IGNvbmZpZy5pdGVtc1BlclBhZ2U7XG4gICAgfVxuICB9O1xuXG4gIHRoaXMuY2FsY3VsYXRlVG90YWxQYWdlcyA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciB0b3RhbFBhZ2VzID0gdGhpcy5pdGVtc1BlclBhZ2UgPCAxID8gMSA6IE1hdGguY2VpbCgkc2NvcGUudG90YWxJdGVtcyAvIHRoaXMuaXRlbXNQZXJQYWdlKTtcbiAgICByZXR1cm4gTWF0aC5tYXgodG90YWxQYWdlcyB8fCAwLCAxKTtcbiAgfTtcblxuICB0aGlzLnJlbmRlciA9IGZ1bmN0aW9uKCkge1xuICAgICRzY29wZS5wYWdlID0gcGFyc2VJbnQobmdNb2RlbEN0cmwuJHZpZXdWYWx1ZSwgMTApIHx8IDE7XG4gIH07XG5cbiAgJHNjb3BlLnNlbGVjdFBhZ2UgPSBmdW5jdGlvbihwYWdlKSB7XG4gICAgaWYgKCAkc2NvcGUucGFnZSAhPT0gcGFnZSAmJiBwYWdlID4gMCAmJiBwYWdlIDw9ICRzY29wZS50b3RhbFBhZ2VzKSB7XG4gICAgICBuZ01vZGVsQ3RybC4kc2V0Vmlld1ZhbHVlKHBhZ2UpO1xuICAgICAgbmdNb2RlbEN0cmwuJHJlbmRlcigpO1xuICAgIH1cbiAgfTtcblxuICAkc2NvcGUuZ2V0VGV4dCA9IGZ1bmN0aW9uKCBrZXkgKSB7XG4gICAgcmV0dXJuICRzY29wZVtrZXkgKyAnVGV4dCddIHx8IHNlbGYuY29uZmlnW2tleSArICdUZXh0J107XG4gIH07XG4gICRzY29wZS5ub1ByZXZpb3VzID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuICRzY29wZS5wYWdlID09PSAxO1xuICB9O1xuICAkc2NvcGUubm9OZXh0ID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuICRzY29wZS5wYWdlID09PSAkc2NvcGUudG90YWxQYWdlcztcbiAgfTtcblxuICAkc2NvcGUuJHdhdGNoKCd0b3RhbEl0ZW1zJywgZnVuY3Rpb24oKSB7XG4gICAgJHNjb3BlLnRvdGFsUGFnZXMgPSBzZWxmLmNhbGN1bGF0ZVRvdGFsUGFnZXMoKTtcbiAgfSk7XG5cbiAgJHNjb3BlLiR3YXRjaCgndG90YWxQYWdlcycsIGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgc2V0TnVtUGFnZXMoJHNjb3BlLiRwYXJlbnQsIHZhbHVlKTsgLy8gUmVhZG9ubHkgdmFyaWFibGVcblxuICAgIGlmICggJHNjb3BlLnBhZ2UgPiB2YWx1ZSApIHtcbiAgICAgICRzY29wZS5zZWxlY3RQYWdlKHZhbHVlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgbmdNb2RlbEN0cmwuJHJlbmRlcigpO1xuICAgIH1cbiAgfSk7XG59XSlcblxuLmNvbnN0YW50KCdwYWdpbmF0aW9uQ29uZmlnJywge1xuICBpdGVtc1BlclBhZ2U6IDEwLFxuICBib3VuZGFyeUxpbmtzOiBmYWxzZSxcbiAgZGlyZWN0aW9uTGlua3M6IHRydWUsXG4gIGZpcnN0VGV4dDogJ0ZpcnN0JyxcbiAgcHJldmlvdXNUZXh0OiAnUHJldmlvdXMnLFxuICBuZXh0VGV4dDogJ05leHQnLFxuICBsYXN0VGV4dDogJ0xhc3QnLFxuICByb3RhdGU6IHRydWVcbn0pXG5cbi5kaXJlY3RpdmUoJ3BhZ2luYXRpb24nLCBbJyRwYXJzZScsICdwYWdpbmF0aW9uQ29uZmlnJywgZnVuY3Rpb24oJHBhcnNlLCBwYWdpbmF0aW9uQ29uZmlnKSB7XG4gIHJldHVybiB7XG4gICAgcmVzdHJpY3Q6ICdFQScsXG4gICAgc2NvcGU6IHtcbiAgICAgIHRvdGFsSXRlbXM6ICc9JyxcbiAgICAgIGZpcnN0VGV4dDogJ0AnLFxuICAgICAgcHJldmlvdXNUZXh0OiAnQCcsXG4gICAgICBuZXh0VGV4dDogJ0AnLFxuICAgICAgbGFzdFRleHQ6ICdAJ1xuICAgIH0sXG4gICAgcmVxdWlyZTogWydwYWdpbmF0aW9uJywgJz9uZ01vZGVsJ10sXG4gICAgY29udHJvbGxlcjogJ1BhZ2luYXRpb25Db250cm9sbGVyJyxcbiAgICB0ZW1wbGF0ZVVybDogJ3RlbXBsYXRlL3BhZ2luYXRpb24vcGFnaW5hdGlvbi5odG1sJyxcbiAgICByZXBsYWNlOiB0cnVlLFxuICAgIGxpbms6IGZ1bmN0aW9uKHNjb3BlLCBlbGVtZW50LCBhdHRycywgY3RybHMpIHtcbiAgICAgIHZhciBwYWdpbmF0aW9uQ3RybCA9IGN0cmxzWzBdLCBuZ01vZGVsQ3RybCA9IGN0cmxzWzFdO1xuXG4gICAgICBpZiAoIW5nTW9kZWxDdHJsKSB7XG4gICAgICAgICByZXR1cm47IC8vIGRvIG5vdGhpbmcgaWYgbm8gbmctbW9kZWxcbiAgICAgIH1cblxuICAgICAgLy8gU2V0dXAgY29uZmlndXJhdGlvbiBwYXJhbWV0ZXJzXG4gICAgICB2YXIgbWF4U2l6ZSA9IGFuZ3VsYXIuaXNEZWZpbmVkKGF0dHJzLm1heFNpemUpID8gc2NvcGUuJHBhcmVudC4kZXZhbChhdHRycy5tYXhTaXplKSA6IHBhZ2luYXRpb25Db25maWcubWF4U2l6ZSxcbiAgICAgICAgICByb3RhdGUgPSBhbmd1bGFyLmlzRGVmaW5lZChhdHRycy5yb3RhdGUpID8gc2NvcGUuJHBhcmVudC4kZXZhbChhdHRycy5yb3RhdGUpIDogcGFnaW5hdGlvbkNvbmZpZy5yb3RhdGU7XG4gICAgICBzY29wZS5ib3VuZGFyeUxpbmtzID0gYW5ndWxhci5pc0RlZmluZWQoYXR0cnMuYm91bmRhcnlMaW5rcykgPyBzY29wZS4kcGFyZW50LiRldmFsKGF0dHJzLmJvdW5kYXJ5TGlua3MpIDogcGFnaW5hdGlvbkNvbmZpZy5ib3VuZGFyeUxpbmtzO1xuICAgICAgc2NvcGUuZGlyZWN0aW9uTGlua3MgPSBhbmd1bGFyLmlzRGVmaW5lZChhdHRycy5kaXJlY3Rpb25MaW5rcykgPyBzY29wZS4kcGFyZW50LiRldmFsKGF0dHJzLmRpcmVjdGlvbkxpbmtzKSA6IHBhZ2luYXRpb25Db25maWcuZGlyZWN0aW9uTGlua3M7XG5cbiAgICAgIHBhZ2luYXRpb25DdHJsLmluaXQobmdNb2RlbEN0cmwsIHBhZ2luYXRpb25Db25maWcpO1xuXG4gICAgICBpZiAoYXR0cnMubWF4U2l6ZSkge1xuICAgICAgICBzY29wZS4kcGFyZW50LiR3YXRjaCgkcGFyc2UoYXR0cnMubWF4U2l6ZSksIGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgICAgbWF4U2l6ZSA9IHBhcnNlSW50KHZhbHVlLCAxMCk7XG4gICAgICAgICAgcGFnaW5hdGlvbkN0cmwucmVuZGVyKCk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgICAvLyBDcmVhdGUgcGFnZSBvYmplY3QgdXNlZCBpbiB0ZW1wbGF0ZVxuICAgICAgZnVuY3Rpb24gbWFrZVBhZ2UobnVtYmVyLCB0ZXh0LCBpc0FjdGl2ZSkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIG51bWJlcjogbnVtYmVyLFxuICAgICAgICAgIHRleHQ6IHRleHQsXG4gICAgICAgICAgYWN0aXZlOiBpc0FjdGl2ZVxuICAgICAgICB9O1xuICAgICAgfVxuXG4gICAgICBmdW5jdGlvbiBnZXRQYWdlcyhjdXJyZW50UGFnZSwgdG90YWxQYWdlcykge1xuICAgICAgICB2YXIgcGFnZXMgPSBbXTtcblxuICAgICAgICAvLyBEZWZhdWx0IHBhZ2UgbGltaXRzXG4gICAgICAgIHZhciBzdGFydFBhZ2UgPSAxLCBlbmRQYWdlID0gdG90YWxQYWdlcztcbiAgICAgICAgdmFyIGlzTWF4U2l6ZWQgPSAoIGFuZ3VsYXIuaXNEZWZpbmVkKG1heFNpemUpICYmIG1heFNpemUgPCB0b3RhbFBhZ2VzICk7XG5cbiAgICAgICAgLy8gcmVjb21wdXRlIGlmIG1heFNpemVcbiAgICAgICAgaWYgKCBpc01heFNpemVkICkge1xuICAgICAgICAgIGlmICggcm90YXRlICkge1xuICAgICAgICAgICAgLy8gQ3VycmVudCBwYWdlIGlzIGRpc3BsYXllZCBpbiB0aGUgbWlkZGxlIG9mIHRoZSB2aXNpYmxlIG9uZXNcbiAgICAgICAgICAgIHN0YXJ0UGFnZSA9IE1hdGgubWF4KGN1cnJlbnRQYWdlIC0gTWF0aC5mbG9vcihtYXhTaXplLzIpLCAxKTtcbiAgICAgICAgICAgIGVuZFBhZ2UgICA9IHN0YXJ0UGFnZSArIG1heFNpemUgLSAxO1xuXG4gICAgICAgICAgICAvLyBBZGp1c3QgaWYgbGltaXQgaXMgZXhjZWVkZWRcbiAgICAgICAgICAgIGlmIChlbmRQYWdlID4gdG90YWxQYWdlcykge1xuICAgICAgICAgICAgICBlbmRQYWdlICAgPSB0b3RhbFBhZ2VzO1xuICAgICAgICAgICAgICBzdGFydFBhZ2UgPSBlbmRQYWdlIC0gbWF4U2l6ZSArIDE7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIFZpc2libGUgcGFnZXMgYXJlIHBhZ2luYXRlZCB3aXRoIG1heFNpemVcbiAgICAgICAgICAgIHN0YXJ0UGFnZSA9ICgoTWF0aC5jZWlsKGN1cnJlbnRQYWdlIC8gbWF4U2l6ZSkgLSAxKSAqIG1heFNpemUpICsgMTtcblxuICAgICAgICAgICAgLy8gQWRqdXN0IGxhc3QgcGFnZSBpZiBsaW1pdCBpcyBleGNlZWRlZFxuICAgICAgICAgICAgZW5kUGFnZSA9IE1hdGgubWluKHN0YXJ0UGFnZSArIG1heFNpemUgLSAxLCB0b3RhbFBhZ2VzKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyBBZGQgcGFnZSBudW1iZXIgbGlua3NcbiAgICAgICAgZm9yICh2YXIgbnVtYmVyID0gc3RhcnRQYWdlOyBudW1iZXIgPD0gZW5kUGFnZTsgbnVtYmVyKyspIHtcbiAgICAgICAgICB2YXIgcGFnZSA9IG1ha2VQYWdlKG51bWJlciwgbnVtYmVyLCBudW1iZXIgPT09IGN1cnJlbnRQYWdlKTtcbiAgICAgICAgICBwYWdlcy5wdXNoKHBhZ2UpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gQWRkIGxpbmtzIHRvIG1vdmUgYmV0d2VlbiBwYWdlIHNldHNcbiAgICAgICAgaWYgKCBpc01heFNpemVkICYmICEgcm90YXRlICkge1xuICAgICAgICAgIGlmICggc3RhcnRQYWdlID4gMSApIHtcbiAgICAgICAgICAgIHZhciBwcmV2aW91c1BhZ2VTZXQgPSBtYWtlUGFnZShzdGFydFBhZ2UgLSAxLCAnLi4uJywgZmFsc2UpO1xuICAgICAgICAgICAgcGFnZXMudW5zaGlmdChwcmV2aW91c1BhZ2VTZXQpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmICggZW5kUGFnZSA8IHRvdGFsUGFnZXMgKSB7XG4gICAgICAgICAgICB2YXIgbmV4dFBhZ2VTZXQgPSBtYWtlUGFnZShlbmRQYWdlICsgMSwgJy4uLicsIGZhbHNlKTtcbiAgICAgICAgICAgIHBhZ2VzLnB1c2gobmV4dFBhZ2VTZXQpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBwYWdlcztcbiAgICAgIH1cblxuICAgICAgdmFyIG9yaWdpbmFsUmVuZGVyID0gcGFnaW5hdGlvbkN0cmwucmVuZGVyO1xuICAgICAgcGFnaW5hdGlvbkN0cmwucmVuZGVyID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIG9yaWdpbmFsUmVuZGVyKCk7XG4gICAgICAgIGlmIChzY29wZS5wYWdlID4gMCAmJiBzY29wZS5wYWdlIDw9IHNjb3BlLnRvdGFsUGFnZXMpIHtcbiAgICAgICAgICBzY29wZS5wYWdlcyA9IGdldFBhZ2VzKHNjb3BlLnBhZ2UsIHNjb3BlLnRvdGFsUGFnZXMpO1xuICAgICAgICB9XG4gICAgICB9O1xuICAgIH1cbiAgfTtcbn1dKVxuXG4uY29uc3RhbnQoJ3BhZ2VyQ29uZmlnJywge1xuICBpdGVtc1BlclBhZ2U6IDEwLFxuICBwcmV2aW91c1RleHQ6ICfCqyBQcmV2aW91cycsXG4gIG5leHRUZXh0OiAnTmV4dCDCuycsXG4gIGFsaWduOiB0cnVlXG59KVxuXG4uZGlyZWN0aXZlKCdwYWdlcicsIFsncGFnZXJDb25maWcnLCBmdW5jdGlvbihwYWdlckNvbmZpZykge1xuICByZXR1cm4ge1xuICAgIHJlc3RyaWN0OiAnRUEnLFxuICAgIHNjb3BlOiB7XG4gICAgICB0b3RhbEl0ZW1zOiAnPScsXG4gICAgICBwcmV2aW91c1RleHQ6ICdAJyxcbiAgICAgIG5leHRUZXh0OiAnQCdcbiAgICB9LFxuICAgIHJlcXVpcmU6IFsncGFnZXInLCAnP25nTW9kZWwnXSxcbiAgICBjb250cm9sbGVyOiAnUGFnaW5hdGlvbkNvbnRyb2xsZXInLFxuICAgIHRlbXBsYXRlVXJsOiAndGVtcGxhdGUvcGFnaW5hdGlvbi9wYWdlci5odG1sJyxcbiAgICByZXBsYWNlOiB0cnVlLFxuICAgIGxpbms6IGZ1bmN0aW9uKHNjb3BlLCBlbGVtZW50LCBhdHRycywgY3RybHMpIHtcbiAgICAgIHZhciBwYWdpbmF0aW9uQ3RybCA9IGN0cmxzWzBdLCBuZ01vZGVsQ3RybCA9IGN0cmxzWzFdO1xuXG4gICAgICBpZiAoIW5nTW9kZWxDdHJsKSB7XG4gICAgICAgICByZXR1cm47IC8vIGRvIG5vdGhpbmcgaWYgbm8gbmctbW9kZWxcbiAgICAgIH1cblxuICAgICAgc2NvcGUuYWxpZ24gPSBhbmd1bGFyLmlzRGVmaW5lZChhdHRycy5hbGlnbikgPyBzY29wZS4kcGFyZW50LiRldmFsKGF0dHJzLmFsaWduKSA6IHBhZ2VyQ29uZmlnLmFsaWduO1xuICAgICAgcGFnaW5hdGlvbkN0cmwuaW5pdChuZ01vZGVsQ3RybCwgcGFnZXJDb25maWcpO1xuICAgIH1cbiAgfTtcbn1dKTtcbiIsIi8vICAgICBVbmRlcnNjb3JlLmpzIDEuOC4yXG4vLyAgICAgaHR0cDovL3VuZGVyc2NvcmVqcy5vcmdcbi8vICAgICAoYykgMjAwOS0yMDE1IEplcmVteSBBc2hrZW5hcywgRG9jdW1lbnRDbG91ZCBhbmQgSW52ZXN0aWdhdGl2ZSBSZXBvcnRlcnMgJiBFZGl0b3JzXG4vLyAgICAgVW5kZXJzY29yZSBtYXkgYmUgZnJlZWx5IGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBNSVQgbGljZW5zZS5cblxuKGZ1bmN0aW9uKCkge1xuXG4gIC8vIEJhc2VsaW5lIHNldHVwXG4gIC8vIC0tLS0tLS0tLS0tLS0tXG5cbiAgLy8gRXN0YWJsaXNoIHRoZSByb290IG9iamVjdCwgYHdpbmRvd2AgaW4gdGhlIGJyb3dzZXIsIG9yIGBleHBvcnRzYCBvbiB0aGUgc2VydmVyLlxuICB2YXIgcm9vdCA9IHRoaXM7XG5cbiAgLy8gU2F2ZSB0aGUgcHJldmlvdXMgdmFsdWUgb2YgdGhlIGBfYCB2YXJpYWJsZS5cbiAgdmFyIHByZXZpb3VzVW5kZXJzY29yZSA9IHJvb3QuXztcblxuICAvLyBTYXZlIGJ5dGVzIGluIHRoZSBtaW5pZmllZCAoYnV0IG5vdCBnemlwcGVkKSB2ZXJzaW9uOlxuICB2YXIgQXJyYXlQcm90byA9IEFycmF5LnByb3RvdHlwZSwgT2JqUHJvdG8gPSBPYmplY3QucHJvdG90eXBlLCBGdW5jUHJvdG8gPSBGdW5jdGlvbi5wcm90b3R5cGU7XG5cbiAgLy8gQ3JlYXRlIHF1aWNrIHJlZmVyZW5jZSB2YXJpYWJsZXMgZm9yIHNwZWVkIGFjY2VzcyB0byBjb3JlIHByb3RvdHlwZXMuXG4gIHZhclxuICAgIHB1c2ggICAgICAgICAgICAgPSBBcnJheVByb3RvLnB1c2gsXG4gICAgc2xpY2UgICAgICAgICAgICA9IEFycmF5UHJvdG8uc2xpY2UsXG4gICAgdG9TdHJpbmcgICAgICAgICA9IE9ialByb3RvLnRvU3RyaW5nLFxuICAgIGhhc093blByb3BlcnR5ICAgPSBPYmpQcm90by5oYXNPd25Qcm9wZXJ0eTtcblxuICAvLyBBbGwgKipFQ01BU2NyaXB0IDUqKiBuYXRpdmUgZnVuY3Rpb24gaW1wbGVtZW50YXRpb25zIHRoYXQgd2UgaG9wZSB0byB1c2VcbiAgLy8gYXJlIGRlY2xhcmVkIGhlcmUuXG4gIHZhclxuICAgIG5hdGl2ZUlzQXJyYXkgICAgICA9IEFycmF5LmlzQXJyYXksXG4gICAgbmF0aXZlS2V5cyAgICAgICAgID0gT2JqZWN0LmtleXMsXG4gICAgbmF0aXZlQmluZCAgICAgICAgID0gRnVuY1Byb3RvLmJpbmQsXG4gICAgbmF0aXZlQ3JlYXRlICAgICAgID0gT2JqZWN0LmNyZWF0ZTtcblxuICAvLyBOYWtlZCBmdW5jdGlvbiByZWZlcmVuY2UgZm9yIHN1cnJvZ2F0ZS1wcm90b3R5cGUtc3dhcHBpbmcuXG4gIHZhciBDdG9yID0gZnVuY3Rpb24oKXt9O1xuXG4gIC8vIENyZWF0ZSBhIHNhZmUgcmVmZXJlbmNlIHRvIHRoZSBVbmRlcnNjb3JlIG9iamVjdCBmb3IgdXNlIGJlbG93LlxuICB2YXIgXyA9IGZ1bmN0aW9uKG9iaikge1xuICAgIGlmIChvYmogaW5zdGFuY2VvZiBfKSByZXR1cm4gb2JqO1xuICAgIGlmICghKHRoaXMgaW5zdGFuY2VvZiBfKSkgcmV0dXJuIG5ldyBfKG9iaik7XG4gICAgdGhpcy5fd3JhcHBlZCA9IG9iajtcbiAgfTtcblxuICAvLyBFeHBvcnQgdGhlIFVuZGVyc2NvcmUgb2JqZWN0IGZvciAqKk5vZGUuanMqKiwgd2l0aFxuICAvLyBiYWNrd2FyZHMtY29tcGF0aWJpbGl0eSBmb3IgdGhlIG9sZCBgcmVxdWlyZSgpYCBBUEkuIElmIHdlJ3JlIGluXG4gIC8vIHRoZSBicm93c2VyLCBhZGQgYF9gIGFzIGEgZ2xvYmFsIG9iamVjdC5cbiAgaWYgKHR5cGVvZiBleHBvcnRzICE9PSAndW5kZWZpbmVkJykge1xuICAgIGlmICh0eXBlb2YgbW9kdWxlICE9PSAndW5kZWZpbmVkJyAmJiBtb2R1bGUuZXhwb3J0cykge1xuICAgICAgZXhwb3J0cyA9IG1vZHVsZS5leHBvcnRzID0gXztcbiAgICB9XG4gICAgZXhwb3J0cy5fID0gXztcbiAgfSBlbHNlIHtcbiAgICByb290Ll8gPSBfO1xuICB9XG5cbiAgLy8gQ3VycmVudCB2ZXJzaW9uLlxuICBfLlZFUlNJT04gPSAnMS44LjInO1xuXG4gIC8vIEludGVybmFsIGZ1bmN0aW9uIHRoYXQgcmV0dXJucyBhbiBlZmZpY2llbnQgKGZvciBjdXJyZW50IGVuZ2luZXMpIHZlcnNpb25cbiAgLy8gb2YgdGhlIHBhc3NlZC1pbiBjYWxsYmFjaywgdG8gYmUgcmVwZWF0ZWRseSBhcHBsaWVkIGluIG90aGVyIFVuZGVyc2NvcmVcbiAgLy8gZnVuY3Rpb25zLlxuICB2YXIgb3B0aW1pemVDYiA9IGZ1bmN0aW9uKGZ1bmMsIGNvbnRleHQsIGFyZ0NvdW50KSB7XG4gICAgaWYgKGNvbnRleHQgPT09IHZvaWQgMCkgcmV0dXJuIGZ1bmM7XG4gICAgc3dpdGNoIChhcmdDb3VudCA9PSBudWxsID8gMyA6IGFyZ0NvdW50KSB7XG4gICAgICBjYXNlIDE6IHJldHVybiBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICByZXR1cm4gZnVuYy5jYWxsKGNvbnRleHQsIHZhbHVlKTtcbiAgICAgIH07XG4gICAgICBjYXNlIDI6IHJldHVybiBmdW5jdGlvbih2YWx1ZSwgb3RoZXIpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmMuY2FsbChjb250ZXh0LCB2YWx1ZSwgb3RoZXIpO1xuICAgICAgfTtcbiAgICAgIGNhc2UgMzogcmV0dXJuIGZ1bmN0aW9uKHZhbHVlLCBpbmRleCwgY29sbGVjdGlvbikge1xuICAgICAgICByZXR1cm4gZnVuYy5jYWxsKGNvbnRleHQsIHZhbHVlLCBpbmRleCwgY29sbGVjdGlvbik7XG4gICAgICB9O1xuICAgICAgY2FzZSA0OiByZXR1cm4gZnVuY3Rpb24oYWNjdW11bGF0b3IsIHZhbHVlLCBpbmRleCwgY29sbGVjdGlvbikge1xuICAgICAgICByZXR1cm4gZnVuYy5jYWxsKGNvbnRleHQsIGFjY3VtdWxhdG9yLCB2YWx1ZSwgaW5kZXgsIGNvbGxlY3Rpb24pO1xuICAgICAgfTtcbiAgICB9XG4gICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIGZ1bmMuYXBwbHkoY29udGV4dCwgYXJndW1lbnRzKTtcbiAgICB9O1xuICB9O1xuXG4gIC8vIEEgbW9zdGx5LWludGVybmFsIGZ1bmN0aW9uIHRvIGdlbmVyYXRlIGNhbGxiYWNrcyB0aGF0IGNhbiBiZSBhcHBsaWVkXG4gIC8vIHRvIGVhY2ggZWxlbWVudCBpbiBhIGNvbGxlY3Rpb24sIHJldHVybmluZyB0aGUgZGVzaXJlZCByZXN1bHQg4oCUIGVpdGhlclxuICAvLyBpZGVudGl0eSwgYW4gYXJiaXRyYXJ5IGNhbGxiYWNrLCBhIHByb3BlcnR5IG1hdGNoZXIsIG9yIGEgcHJvcGVydHkgYWNjZXNzb3IuXG4gIHZhciBjYiA9IGZ1bmN0aW9uKHZhbHVlLCBjb250ZXh0LCBhcmdDb3VudCkge1xuICAgIGlmICh2YWx1ZSA9PSBudWxsKSByZXR1cm4gXy5pZGVudGl0eTtcbiAgICBpZiAoXy5pc0Z1bmN0aW9uKHZhbHVlKSkgcmV0dXJuIG9wdGltaXplQ2IodmFsdWUsIGNvbnRleHQsIGFyZ0NvdW50KTtcbiAgICBpZiAoXy5pc09iamVjdCh2YWx1ZSkpIHJldHVybiBfLm1hdGNoZXIodmFsdWUpO1xuICAgIHJldHVybiBfLnByb3BlcnR5KHZhbHVlKTtcbiAgfTtcbiAgXy5pdGVyYXRlZSA9IGZ1bmN0aW9uKHZhbHVlLCBjb250ZXh0KSB7XG4gICAgcmV0dXJuIGNiKHZhbHVlLCBjb250ZXh0LCBJbmZpbml0eSk7XG4gIH07XG5cbiAgLy8gQW4gaW50ZXJuYWwgZnVuY3Rpb24gZm9yIGNyZWF0aW5nIGFzc2lnbmVyIGZ1bmN0aW9ucy5cbiAgdmFyIGNyZWF0ZUFzc2lnbmVyID0gZnVuY3Rpb24oa2V5c0Z1bmMsIHVuZGVmaW5lZE9ubHkpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24ob2JqKSB7XG4gICAgICB2YXIgbGVuZ3RoID0gYXJndW1lbnRzLmxlbmd0aDtcbiAgICAgIGlmIChsZW5ndGggPCAyIHx8IG9iaiA9PSBudWxsKSByZXR1cm4gb2JqO1xuICAgICAgZm9yICh2YXIgaW5kZXggPSAxOyBpbmRleCA8IGxlbmd0aDsgaW5kZXgrKykge1xuICAgICAgICB2YXIgc291cmNlID0gYXJndW1lbnRzW2luZGV4XSxcbiAgICAgICAgICAgIGtleXMgPSBrZXlzRnVuYyhzb3VyY2UpLFxuICAgICAgICAgICAgbCA9IGtleXMubGVuZ3RoO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGw7IGkrKykge1xuICAgICAgICAgIHZhciBrZXkgPSBrZXlzW2ldO1xuICAgICAgICAgIGlmICghdW5kZWZpbmVkT25seSB8fCBvYmpba2V5XSA9PT0gdm9pZCAwKSBvYmpba2V5XSA9IHNvdXJjZVtrZXldO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gb2JqO1xuICAgIH07XG4gIH07XG5cbiAgLy8gQW4gaW50ZXJuYWwgZnVuY3Rpb24gZm9yIGNyZWF0aW5nIGEgbmV3IG9iamVjdCB0aGF0IGluaGVyaXRzIGZyb20gYW5vdGhlci5cbiAgdmFyIGJhc2VDcmVhdGUgPSBmdW5jdGlvbihwcm90b3R5cGUpIHtcbiAgICBpZiAoIV8uaXNPYmplY3QocHJvdG90eXBlKSkgcmV0dXJuIHt9O1xuICAgIGlmIChuYXRpdmVDcmVhdGUpIHJldHVybiBuYXRpdmVDcmVhdGUocHJvdG90eXBlKTtcbiAgICBDdG9yLnByb3RvdHlwZSA9IHByb3RvdHlwZTtcbiAgICB2YXIgcmVzdWx0ID0gbmV3IEN0b3I7XG4gICAgQ3Rvci5wcm90b3R5cGUgPSBudWxsO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH07XG5cbiAgLy8gSGVscGVyIGZvciBjb2xsZWN0aW9uIG1ldGhvZHMgdG8gZGV0ZXJtaW5lIHdoZXRoZXIgYSBjb2xsZWN0aW9uXG4gIC8vIHNob3VsZCBiZSBpdGVyYXRlZCBhcyBhbiBhcnJheSBvciBhcyBhbiBvYmplY3RcbiAgLy8gUmVsYXRlZDogaHR0cDovL3Blb3BsZS5tb3ppbGxhLm9yZy9+am9yZW5kb3JmZi9lczYtZHJhZnQuaHRtbCNzZWMtdG9sZW5ndGhcbiAgdmFyIE1BWF9BUlJBWV9JTkRFWCA9IE1hdGgucG93KDIsIDUzKSAtIDE7XG4gIHZhciBpc0FycmF5TGlrZSA9IGZ1bmN0aW9uKGNvbGxlY3Rpb24pIHtcbiAgICB2YXIgbGVuZ3RoID0gY29sbGVjdGlvbiAmJiBjb2xsZWN0aW9uLmxlbmd0aDtcbiAgICByZXR1cm4gdHlwZW9mIGxlbmd0aCA9PSAnbnVtYmVyJyAmJiBsZW5ndGggPj0gMCAmJiBsZW5ndGggPD0gTUFYX0FSUkFZX0lOREVYO1xuICB9O1xuXG4gIC8vIENvbGxlY3Rpb24gRnVuY3Rpb25zXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgLy8gVGhlIGNvcm5lcnN0b25lLCBhbiBgZWFjaGAgaW1wbGVtZW50YXRpb24sIGFrYSBgZm9yRWFjaGAuXG4gIC8vIEhhbmRsZXMgcmF3IG9iamVjdHMgaW4gYWRkaXRpb24gdG8gYXJyYXktbGlrZXMuIFRyZWF0cyBhbGxcbiAgLy8gc3BhcnNlIGFycmF5LWxpa2VzIGFzIGlmIHRoZXkgd2VyZSBkZW5zZS5cbiAgXy5lYWNoID0gXy5mb3JFYWNoID0gZnVuY3Rpb24ob2JqLCBpdGVyYXRlZSwgY29udGV4dCkge1xuICAgIGl0ZXJhdGVlID0gb3B0aW1pemVDYihpdGVyYXRlZSwgY29udGV4dCk7XG4gICAgdmFyIGksIGxlbmd0aDtcbiAgICBpZiAoaXNBcnJheUxpa2Uob2JqKSkge1xuICAgICAgZm9yIChpID0gMCwgbGVuZ3RoID0gb2JqLmxlbmd0aDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGl0ZXJhdGVlKG9ialtpXSwgaSwgb2JqKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgdmFyIGtleXMgPSBfLmtleXMob2JqKTtcbiAgICAgIGZvciAoaSA9IDAsIGxlbmd0aCA9IGtleXMubGVuZ3RoOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgICAgaXRlcmF0ZWUob2JqW2tleXNbaV1dLCBrZXlzW2ldLCBvYmopO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gb2JqO1xuICB9O1xuXG4gIC8vIFJldHVybiB0aGUgcmVzdWx0cyBvZiBhcHBseWluZyB0aGUgaXRlcmF0ZWUgdG8gZWFjaCBlbGVtZW50LlxuICBfLm1hcCA9IF8uY29sbGVjdCA9IGZ1bmN0aW9uKG9iaiwgaXRlcmF0ZWUsIGNvbnRleHQpIHtcbiAgICBpdGVyYXRlZSA9IGNiKGl0ZXJhdGVlLCBjb250ZXh0KTtcbiAgICB2YXIga2V5cyA9ICFpc0FycmF5TGlrZShvYmopICYmIF8ua2V5cyhvYmopLFxuICAgICAgICBsZW5ndGggPSAoa2V5cyB8fCBvYmopLmxlbmd0aCxcbiAgICAgICAgcmVzdWx0cyA9IEFycmF5KGxlbmd0aCk7XG4gICAgZm9yICh2YXIgaW5kZXggPSAwOyBpbmRleCA8IGxlbmd0aDsgaW5kZXgrKykge1xuICAgICAgdmFyIGN1cnJlbnRLZXkgPSBrZXlzID8ga2V5c1tpbmRleF0gOiBpbmRleDtcbiAgICAgIHJlc3VsdHNbaW5kZXhdID0gaXRlcmF0ZWUob2JqW2N1cnJlbnRLZXldLCBjdXJyZW50S2V5LCBvYmopO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0cztcbiAgfTtcblxuICAvLyBDcmVhdGUgYSByZWR1Y2luZyBmdW5jdGlvbiBpdGVyYXRpbmcgbGVmdCBvciByaWdodC5cbiAgZnVuY3Rpb24gY3JlYXRlUmVkdWNlKGRpcikge1xuICAgIC8vIE9wdGltaXplZCBpdGVyYXRvciBmdW5jdGlvbiBhcyB1c2luZyBhcmd1bWVudHMubGVuZ3RoXG4gICAgLy8gaW4gdGhlIG1haW4gZnVuY3Rpb24gd2lsbCBkZW9wdGltaXplIHRoZSwgc2VlICMxOTkxLlxuICAgIGZ1bmN0aW9uIGl0ZXJhdG9yKG9iaiwgaXRlcmF0ZWUsIG1lbW8sIGtleXMsIGluZGV4LCBsZW5ndGgpIHtcbiAgICAgIGZvciAoOyBpbmRleCA+PSAwICYmIGluZGV4IDwgbGVuZ3RoOyBpbmRleCArPSBkaXIpIHtcbiAgICAgICAgdmFyIGN1cnJlbnRLZXkgPSBrZXlzID8ga2V5c1tpbmRleF0gOiBpbmRleDtcbiAgICAgICAgbWVtbyA9IGl0ZXJhdGVlKG1lbW8sIG9ialtjdXJyZW50S2V5XSwgY3VycmVudEtleSwgb2JqKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBtZW1vO1xuICAgIH1cblxuICAgIHJldHVybiBmdW5jdGlvbihvYmosIGl0ZXJhdGVlLCBtZW1vLCBjb250ZXh0KSB7XG4gICAgICBpdGVyYXRlZSA9IG9wdGltaXplQ2IoaXRlcmF0ZWUsIGNvbnRleHQsIDQpO1xuICAgICAgdmFyIGtleXMgPSAhaXNBcnJheUxpa2Uob2JqKSAmJiBfLmtleXMob2JqKSxcbiAgICAgICAgICBsZW5ndGggPSAoa2V5cyB8fCBvYmopLmxlbmd0aCxcbiAgICAgICAgICBpbmRleCA9IGRpciA+IDAgPyAwIDogbGVuZ3RoIC0gMTtcbiAgICAgIC8vIERldGVybWluZSB0aGUgaW5pdGlhbCB2YWx1ZSBpZiBub25lIGlzIHByb3ZpZGVkLlxuICAgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPCAzKSB7XG4gICAgICAgIG1lbW8gPSBvYmpba2V5cyA/IGtleXNbaW5kZXhdIDogaW5kZXhdO1xuICAgICAgICBpbmRleCArPSBkaXI7XG4gICAgICB9XG4gICAgICByZXR1cm4gaXRlcmF0b3Iob2JqLCBpdGVyYXRlZSwgbWVtbywga2V5cywgaW5kZXgsIGxlbmd0aCk7XG4gICAgfTtcbiAgfVxuXG4gIC8vICoqUmVkdWNlKiogYnVpbGRzIHVwIGEgc2luZ2xlIHJlc3VsdCBmcm9tIGEgbGlzdCBvZiB2YWx1ZXMsIGFrYSBgaW5qZWN0YCxcbiAgLy8gb3IgYGZvbGRsYC5cbiAgXy5yZWR1Y2UgPSBfLmZvbGRsID0gXy5pbmplY3QgPSBjcmVhdGVSZWR1Y2UoMSk7XG5cbiAgLy8gVGhlIHJpZ2h0LWFzc29jaWF0aXZlIHZlcnNpb24gb2YgcmVkdWNlLCBhbHNvIGtub3duIGFzIGBmb2xkcmAuXG4gIF8ucmVkdWNlUmlnaHQgPSBfLmZvbGRyID0gY3JlYXRlUmVkdWNlKC0xKTtcblxuICAvLyBSZXR1cm4gdGhlIGZpcnN0IHZhbHVlIHdoaWNoIHBhc3NlcyBhIHRydXRoIHRlc3QuIEFsaWFzZWQgYXMgYGRldGVjdGAuXG4gIF8uZmluZCA9IF8uZGV0ZWN0ID0gZnVuY3Rpb24ob2JqLCBwcmVkaWNhdGUsIGNvbnRleHQpIHtcbiAgICB2YXIga2V5O1xuICAgIGlmIChpc0FycmF5TGlrZShvYmopKSB7XG4gICAgICBrZXkgPSBfLmZpbmRJbmRleChvYmosIHByZWRpY2F0ZSwgY29udGV4dCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGtleSA9IF8uZmluZEtleShvYmosIHByZWRpY2F0ZSwgY29udGV4dCk7XG4gICAgfVxuICAgIGlmIChrZXkgIT09IHZvaWQgMCAmJiBrZXkgIT09IC0xKSByZXR1cm4gb2JqW2tleV07XG4gIH07XG5cbiAgLy8gUmV0dXJuIGFsbCB0aGUgZWxlbWVudHMgdGhhdCBwYXNzIGEgdHJ1dGggdGVzdC5cbiAgLy8gQWxpYXNlZCBhcyBgc2VsZWN0YC5cbiAgXy5maWx0ZXIgPSBfLnNlbGVjdCA9IGZ1bmN0aW9uKG9iaiwgcHJlZGljYXRlLCBjb250ZXh0KSB7XG4gICAgdmFyIHJlc3VsdHMgPSBbXTtcbiAgICBwcmVkaWNhdGUgPSBjYihwcmVkaWNhdGUsIGNvbnRleHQpO1xuICAgIF8uZWFjaChvYmosIGZ1bmN0aW9uKHZhbHVlLCBpbmRleCwgbGlzdCkge1xuICAgICAgaWYgKHByZWRpY2F0ZSh2YWx1ZSwgaW5kZXgsIGxpc3QpKSByZXN1bHRzLnB1c2godmFsdWUpO1xuICAgIH0pO1xuICAgIHJldHVybiByZXN1bHRzO1xuICB9O1xuXG4gIC8vIFJldHVybiBhbGwgdGhlIGVsZW1lbnRzIGZvciB3aGljaCBhIHRydXRoIHRlc3QgZmFpbHMuXG4gIF8ucmVqZWN0ID0gZnVuY3Rpb24ob2JqLCBwcmVkaWNhdGUsIGNvbnRleHQpIHtcbiAgICByZXR1cm4gXy5maWx0ZXIob2JqLCBfLm5lZ2F0ZShjYihwcmVkaWNhdGUpKSwgY29udGV4dCk7XG4gIH07XG5cbiAgLy8gRGV0ZXJtaW5lIHdoZXRoZXIgYWxsIG9mIHRoZSBlbGVtZW50cyBtYXRjaCBhIHRydXRoIHRlc3QuXG4gIC8vIEFsaWFzZWQgYXMgYGFsbGAuXG4gIF8uZXZlcnkgPSBfLmFsbCA9IGZ1bmN0aW9uKG9iaiwgcHJlZGljYXRlLCBjb250ZXh0KSB7XG4gICAgcHJlZGljYXRlID0gY2IocHJlZGljYXRlLCBjb250ZXh0KTtcbiAgICB2YXIga2V5cyA9ICFpc0FycmF5TGlrZShvYmopICYmIF8ua2V5cyhvYmopLFxuICAgICAgICBsZW5ndGggPSAoa2V5cyB8fCBvYmopLmxlbmd0aDtcbiAgICBmb3IgKHZhciBpbmRleCA9IDA7IGluZGV4IDwgbGVuZ3RoOyBpbmRleCsrKSB7XG4gICAgICB2YXIgY3VycmVudEtleSA9IGtleXMgPyBrZXlzW2luZGV4XSA6IGluZGV4O1xuICAgICAgaWYgKCFwcmVkaWNhdGUob2JqW2N1cnJlbnRLZXldLCBjdXJyZW50S2V5LCBvYmopKSByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xuICB9O1xuXG4gIC8vIERldGVybWluZSBpZiBhdCBsZWFzdCBvbmUgZWxlbWVudCBpbiB0aGUgb2JqZWN0IG1hdGNoZXMgYSB0cnV0aCB0ZXN0LlxuICAvLyBBbGlhc2VkIGFzIGBhbnlgLlxuICBfLnNvbWUgPSBfLmFueSA9IGZ1bmN0aW9uKG9iaiwgcHJlZGljYXRlLCBjb250ZXh0KSB7XG4gICAgcHJlZGljYXRlID0gY2IocHJlZGljYXRlLCBjb250ZXh0KTtcbiAgICB2YXIga2V5cyA9ICFpc0FycmF5TGlrZShvYmopICYmIF8ua2V5cyhvYmopLFxuICAgICAgICBsZW5ndGggPSAoa2V5cyB8fCBvYmopLmxlbmd0aDtcbiAgICBmb3IgKHZhciBpbmRleCA9IDA7IGluZGV4IDwgbGVuZ3RoOyBpbmRleCsrKSB7XG4gICAgICB2YXIgY3VycmVudEtleSA9IGtleXMgPyBrZXlzW2luZGV4XSA6IGluZGV4O1xuICAgICAgaWYgKHByZWRpY2F0ZShvYmpbY3VycmVudEtleV0sIGN1cnJlbnRLZXksIG9iaikpIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH07XG5cbiAgLy8gRGV0ZXJtaW5lIGlmIHRoZSBhcnJheSBvciBvYmplY3QgY29udGFpbnMgYSBnaXZlbiB2YWx1ZSAodXNpbmcgYD09PWApLlxuICAvLyBBbGlhc2VkIGFzIGBpbmNsdWRlc2AgYW5kIGBpbmNsdWRlYC5cbiAgXy5jb250YWlucyA9IF8uaW5jbHVkZXMgPSBfLmluY2x1ZGUgPSBmdW5jdGlvbihvYmosIHRhcmdldCwgZnJvbUluZGV4KSB7XG4gICAgaWYgKCFpc0FycmF5TGlrZShvYmopKSBvYmogPSBfLnZhbHVlcyhvYmopO1xuICAgIHJldHVybiBfLmluZGV4T2Yob2JqLCB0YXJnZXQsIHR5cGVvZiBmcm9tSW5kZXggPT0gJ251bWJlcicgJiYgZnJvbUluZGV4KSA+PSAwO1xuICB9O1xuXG4gIC8vIEludm9rZSBhIG1ldGhvZCAod2l0aCBhcmd1bWVudHMpIG9uIGV2ZXJ5IGl0ZW0gaW4gYSBjb2xsZWN0aW9uLlxuICBfLmludm9rZSA9IGZ1bmN0aW9uKG9iaiwgbWV0aG9kKSB7XG4gICAgdmFyIGFyZ3MgPSBzbGljZS5jYWxsKGFyZ3VtZW50cywgMik7XG4gICAgdmFyIGlzRnVuYyA9IF8uaXNGdW5jdGlvbihtZXRob2QpO1xuICAgIHJldHVybiBfLm1hcChvYmosIGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICB2YXIgZnVuYyA9IGlzRnVuYyA/IG1ldGhvZCA6IHZhbHVlW21ldGhvZF07XG4gICAgICByZXR1cm4gZnVuYyA9PSBudWxsID8gZnVuYyA6IGZ1bmMuYXBwbHkodmFsdWUsIGFyZ3MpO1xuICAgIH0pO1xuICB9O1xuXG4gIC8vIENvbnZlbmllbmNlIHZlcnNpb24gb2YgYSBjb21tb24gdXNlIGNhc2Ugb2YgYG1hcGA6IGZldGNoaW5nIGEgcHJvcGVydHkuXG4gIF8ucGx1Y2sgPSBmdW5jdGlvbihvYmosIGtleSkge1xuICAgIHJldHVybiBfLm1hcChvYmosIF8ucHJvcGVydHkoa2V5KSk7XG4gIH07XG5cbiAgLy8gQ29udmVuaWVuY2UgdmVyc2lvbiBvZiBhIGNvbW1vbiB1c2UgY2FzZSBvZiBgZmlsdGVyYDogc2VsZWN0aW5nIG9ubHkgb2JqZWN0c1xuICAvLyBjb250YWluaW5nIHNwZWNpZmljIGBrZXk6dmFsdWVgIHBhaXJzLlxuICBfLndoZXJlID0gZnVuY3Rpb24ob2JqLCBhdHRycykge1xuICAgIHJldHVybiBfLmZpbHRlcihvYmosIF8ubWF0Y2hlcihhdHRycykpO1xuICB9O1xuXG4gIC8vIENvbnZlbmllbmNlIHZlcnNpb24gb2YgYSBjb21tb24gdXNlIGNhc2Ugb2YgYGZpbmRgOiBnZXR0aW5nIHRoZSBmaXJzdCBvYmplY3RcbiAgLy8gY29udGFpbmluZyBzcGVjaWZpYyBga2V5OnZhbHVlYCBwYWlycy5cbiAgXy5maW5kV2hlcmUgPSBmdW5jdGlvbihvYmosIGF0dHJzKSB7XG4gICAgcmV0dXJuIF8uZmluZChvYmosIF8ubWF0Y2hlcihhdHRycykpO1xuICB9O1xuXG4gIC8vIFJldHVybiB0aGUgbWF4aW11bSBlbGVtZW50IChvciBlbGVtZW50LWJhc2VkIGNvbXB1dGF0aW9uKS5cbiAgXy5tYXggPSBmdW5jdGlvbihvYmosIGl0ZXJhdGVlLCBjb250ZXh0KSB7XG4gICAgdmFyIHJlc3VsdCA9IC1JbmZpbml0eSwgbGFzdENvbXB1dGVkID0gLUluZmluaXR5LFxuICAgICAgICB2YWx1ZSwgY29tcHV0ZWQ7XG4gICAgaWYgKGl0ZXJhdGVlID09IG51bGwgJiYgb2JqICE9IG51bGwpIHtcbiAgICAgIG9iaiA9IGlzQXJyYXlMaWtlKG9iaikgPyBvYmogOiBfLnZhbHVlcyhvYmopO1xuICAgICAgZm9yICh2YXIgaSA9IDAsIGxlbmd0aCA9IG9iai5sZW5ndGg7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgICB2YWx1ZSA9IG9ialtpXTtcbiAgICAgICAgaWYgKHZhbHVlID4gcmVzdWx0KSB7XG4gICAgICAgICAgcmVzdWx0ID0gdmFsdWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgaXRlcmF0ZWUgPSBjYihpdGVyYXRlZSwgY29udGV4dCk7XG4gICAgICBfLmVhY2gob2JqLCBmdW5jdGlvbih2YWx1ZSwgaW5kZXgsIGxpc3QpIHtcbiAgICAgICAgY29tcHV0ZWQgPSBpdGVyYXRlZSh2YWx1ZSwgaW5kZXgsIGxpc3QpO1xuICAgICAgICBpZiAoY29tcHV0ZWQgPiBsYXN0Q29tcHV0ZWQgfHwgY29tcHV0ZWQgPT09IC1JbmZpbml0eSAmJiByZXN1bHQgPT09IC1JbmZpbml0eSkge1xuICAgICAgICAgIHJlc3VsdCA9IHZhbHVlO1xuICAgICAgICAgIGxhc3RDb21wdXRlZCA9IGNvbXB1dGVkO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfTtcblxuICAvLyBSZXR1cm4gdGhlIG1pbmltdW0gZWxlbWVudCAob3IgZWxlbWVudC1iYXNlZCBjb21wdXRhdGlvbikuXG4gIF8ubWluID0gZnVuY3Rpb24ob2JqLCBpdGVyYXRlZSwgY29udGV4dCkge1xuICAgIHZhciByZXN1bHQgPSBJbmZpbml0eSwgbGFzdENvbXB1dGVkID0gSW5maW5pdHksXG4gICAgICAgIHZhbHVlLCBjb21wdXRlZDtcbiAgICBpZiAoaXRlcmF0ZWUgPT0gbnVsbCAmJiBvYmogIT0gbnVsbCkge1xuICAgICAgb2JqID0gaXNBcnJheUxpa2Uob2JqKSA/IG9iaiA6IF8udmFsdWVzKG9iaik7XG4gICAgICBmb3IgKHZhciBpID0gMCwgbGVuZ3RoID0gb2JqLmxlbmd0aDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHZhbHVlID0gb2JqW2ldO1xuICAgICAgICBpZiAodmFsdWUgPCByZXN1bHQpIHtcbiAgICAgICAgICByZXN1bHQgPSB2YWx1ZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBpdGVyYXRlZSA9IGNiKGl0ZXJhdGVlLCBjb250ZXh0KTtcbiAgICAgIF8uZWFjaChvYmosIGZ1bmN0aW9uKHZhbHVlLCBpbmRleCwgbGlzdCkge1xuICAgICAgICBjb21wdXRlZCA9IGl0ZXJhdGVlKHZhbHVlLCBpbmRleCwgbGlzdCk7XG4gICAgICAgIGlmIChjb21wdXRlZCA8IGxhc3RDb21wdXRlZCB8fCBjb21wdXRlZCA9PT0gSW5maW5pdHkgJiYgcmVzdWx0ID09PSBJbmZpbml0eSkge1xuICAgICAgICAgIHJlc3VsdCA9IHZhbHVlO1xuICAgICAgICAgIGxhc3RDb21wdXRlZCA9IGNvbXB1dGVkO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfTtcblxuICAvLyBTaHVmZmxlIGEgY29sbGVjdGlvbiwgdXNpbmcgdGhlIG1vZGVybiB2ZXJzaW9uIG9mIHRoZVxuICAvLyBbRmlzaGVyLVlhdGVzIHNodWZmbGVdKGh0dHA6Ly9lbi53aWtpcGVkaWEub3JnL3dpa2kvRmlzaGVy4oCTWWF0ZXNfc2h1ZmZsZSkuXG4gIF8uc2h1ZmZsZSA9IGZ1bmN0aW9uKG9iaikge1xuICAgIHZhciBzZXQgPSBpc0FycmF5TGlrZShvYmopID8gb2JqIDogXy52YWx1ZXMob2JqKTtcbiAgICB2YXIgbGVuZ3RoID0gc2V0Lmxlbmd0aDtcbiAgICB2YXIgc2h1ZmZsZWQgPSBBcnJheShsZW5ndGgpO1xuICAgIGZvciAodmFyIGluZGV4ID0gMCwgcmFuZDsgaW5kZXggPCBsZW5ndGg7IGluZGV4KyspIHtcbiAgICAgIHJhbmQgPSBfLnJhbmRvbSgwLCBpbmRleCk7XG4gICAgICBpZiAocmFuZCAhPT0gaW5kZXgpIHNodWZmbGVkW2luZGV4XSA9IHNodWZmbGVkW3JhbmRdO1xuICAgICAgc2h1ZmZsZWRbcmFuZF0gPSBzZXRbaW5kZXhdO1xuICAgIH1cbiAgICByZXR1cm4gc2h1ZmZsZWQ7XG4gIH07XG5cbiAgLy8gU2FtcGxlICoqbioqIHJhbmRvbSB2YWx1ZXMgZnJvbSBhIGNvbGxlY3Rpb24uXG4gIC8vIElmICoqbioqIGlzIG5vdCBzcGVjaWZpZWQsIHJldHVybnMgYSBzaW5nbGUgcmFuZG9tIGVsZW1lbnQuXG4gIC8vIFRoZSBpbnRlcm5hbCBgZ3VhcmRgIGFyZ3VtZW50IGFsbG93cyBpdCB0byB3b3JrIHdpdGggYG1hcGAuXG4gIF8uc2FtcGxlID0gZnVuY3Rpb24ob2JqLCBuLCBndWFyZCkge1xuICAgIGlmIChuID09IG51bGwgfHwgZ3VhcmQpIHtcbiAgICAgIGlmICghaXNBcnJheUxpa2Uob2JqKSkgb2JqID0gXy52YWx1ZXMob2JqKTtcbiAgICAgIHJldHVybiBvYmpbXy5yYW5kb20ob2JqLmxlbmd0aCAtIDEpXTtcbiAgICB9XG4gICAgcmV0dXJuIF8uc2h1ZmZsZShvYmopLnNsaWNlKDAsIE1hdGgubWF4KDAsIG4pKTtcbiAgfTtcblxuICAvLyBTb3J0IHRoZSBvYmplY3QncyB2YWx1ZXMgYnkgYSBjcml0ZXJpb24gcHJvZHVjZWQgYnkgYW4gaXRlcmF0ZWUuXG4gIF8uc29ydEJ5ID0gZnVuY3Rpb24ob2JqLCBpdGVyYXRlZSwgY29udGV4dCkge1xuICAgIGl0ZXJhdGVlID0gY2IoaXRlcmF0ZWUsIGNvbnRleHQpO1xuICAgIHJldHVybiBfLnBsdWNrKF8ubWFwKG9iaiwgZnVuY3Rpb24odmFsdWUsIGluZGV4LCBsaXN0KSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICB2YWx1ZTogdmFsdWUsXG4gICAgICAgIGluZGV4OiBpbmRleCxcbiAgICAgICAgY3JpdGVyaWE6IGl0ZXJhdGVlKHZhbHVlLCBpbmRleCwgbGlzdClcbiAgICAgIH07XG4gICAgfSkuc29ydChmdW5jdGlvbihsZWZ0LCByaWdodCkge1xuICAgICAgdmFyIGEgPSBsZWZ0LmNyaXRlcmlhO1xuICAgICAgdmFyIGIgPSByaWdodC5jcml0ZXJpYTtcbiAgICAgIGlmIChhICE9PSBiKSB7XG4gICAgICAgIGlmIChhID4gYiB8fCBhID09PSB2b2lkIDApIHJldHVybiAxO1xuICAgICAgICBpZiAoYSA8IGIgfHwgYiA9PT0gdm9pZCAwKSByZXR1cm4gLTE7XG4gICAgICB9XG4gICAgICByZXR1cm4gbGVmdC5pbmRleCAtIHJpZ2h0LmluZGV4O1xuICAgIH0pLCAndmFsdWUnKTtcbiAgfTtcblxuICAvLyBBbiBpbnRlcm5hbCBmdW5jdGlvbiB1c2VkIGZvciBhZ2dyZWdhdGUgXCJncm91cCBieVwiIG9wZXJhdGlvbnMuXG4gIHZhciBncm91cCA9IGZ1bmN0aW9uKGJlaGF2aW9yKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKG9iaiwgaXRlcmF0ZWUsIGNvbnRleHQpIHtcbiAgICAgIHZhciByZXN1bHQgPSB7fTtcbiAgICAgIGl0ZXJhdGVlID0gY2IoaXRlcmF0ZWUsIGNvbnRleHQpO1xuICAgICAgXy5lYWNoKG9iaiwgZnVuY3Rpb24odmFsdWUsIGluZGV4KSB7XG4gICAgICAgIHZhciBrZXkgPSBpdGVyYXRlZSh2YWx1ZSwgaW5kZXgsIG9iaik7XG4gICAgICAgIGJlaGF2aW9yKHJlc3VsdCwgdmFsdWUsIGtleSk7XG4gICAgICB9KTtcbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfTtcbiAgfTtcblxuICAvLyBHcm91cHMgdGhlIG9iamVjdCdzIHZhbHVlcyBieSBhIGNyaXRlcmlvbi4gUGFzcyBlaXRoZXIgYSBzdHJpbmcgYXR0cmlidXRlXG4gIC8vIHRvIGdyb3VwIGJ5LCBvciBhIGZ1bmN0aW9uIHRoYXQgcmV0dXJucyB0aGUgY3JpdGVyaW9uLlxuICBfLmdyb3VwQnkgPSBncm91cChmdW5jdGlvbihyZXN1bHQsIHZhbHVlLCBrZXkpIHtcbiAgICBpZiAoXy5oYXMocmVzdWx0LCBrZXkpKSByZXN1bHRba2V5XS5wdXNoKHZhbHVlKTsgZWxzZSByZXN1bHRba2V5XSA9IFt2YWx1ZV07XG4gIH0pO1xuXG4gIC8vIEluZGV4ZXMgdGhlIG9iamVjdCdzIHZhbHVlcyBieSBhIGNyaXRlcmlvbiwgc2ltaWxhciB0byBgZ3JvdXBCeWAsIGJ1dCBmb3JcbiAgLy8gd2hlbiB5b3Uga25vdyB0aGF0IHlvdXIgaW5kZXggdmFsdWVzIHdpbGwgYmUgdW5pcXVlLlxuICBfLmluZGV4QnkgPSBncm91cChmdW5jdGlvbihyZXN1bHQsIHZhbHVlLCBrZXkpIHtcbiAgICByZXN1bHRba2V5XSA9IHZhbHVlO1xuICB9KTtcblxuICAvLyBDb3VudHMgaW5zdGFuY2VzIG9mIGFuIG9iamVjdCB0aGF0IGdyb3VwIGJ5IGEgY2VydGFpbiBjcml0ZXJpb24uIFBhc3NcbiAgLy8gZWl0aGVyIGEgc3RyaW5nIGF0dHJpYnV0ZSB0byBjb3VudCBieSwgb3IgYSBmdW5jdGlvbiB0aGF0IHJldHVybnMgdGhlXG4gIC8vIGNyaXRlcmlvbi5cbiAgXy5jb3VudEJ5ID0gZ3JvdXAoZnVuY3Rpb24ocmVzdWx0LCB2YWx1ZSwga2V5KSB7XG4gICAgaWYgKF8uaGFzKHJlc3VsdCwga2V5KSkgcmVzdWx0W2tleV0rKzsgZWxzZSByZXN1bHRba2V5XSA9IDE7XG4gIH0pO1xuXG4gIC8vIFNhZmVseSBjcmVhdGUgYSByZWFsLCBsaXZlIGFycmF5IGZyb20gYW55dGhpbmcgaXRlcmFibGUuXG4gIF8udG9BcnJheSA9IGZ1bmN0aW9uKG9iaikge1xuICAgIGlmICghb2JqKSByZXR1cm4gW107XG4gICAgaWYgKF8uaXNBcnJheShvYmopKSByZXR1cm4gc2xpY2UuY2FsbChvYmopO1xuICAgIGlmIChpc0FycmF5TGlrZShvYmopKSByZXR1cm4gXy5tYXAob2JqLCBfLmlkZW50aXR5KTtcbiAgICByZXR1cm4gXy52YWx1ZXMob2JqKTtcbiAgfTtcblxuICAvLyBSZXR1cm4gdGhlIG51bWJlciBvZiBlbGVtZW50cyBpbiBhbiBvYmplY3QuXG4gIF8uc2l6ZSA9IGZ1bmN0aW9uKG9iaikge1xuICAgIGlmIChvYmogPT0gbnVsbCkgcmV0dXJuIDA7XG4gICAgcmV0dXJuIGlzQXJyYXlMaWtlKG9iaikgPyBvYmoubGVuZ3RoIDogXy5rZXlzKG9iaikubGVuZ3RoO1xuICB9O1xuXG4gIC8vIFNwbGl0IGEgY29sbGVjdGlvbiBpbnRvIHR3byBhcnJheXM6IG9uZSB3aG9zZSBlbGVtZW50cyBhbGwgc2F0aXNmeSB0aGUgZ2l2ZW5cbiAgLy8gcHJlZGljYXRlLCBhbmQgb25lIHdob3NlIGVsZW1lbnRzIGFsbCBkbyBub3Qgc2F0aXNmeSB0aGUgcHJlZGljYXRlLlxuICBfLnBhcnRpdGlvbiA9IGZ1bmN0aW9uKG9iaiwgcHJlZGljYXRlLCBjb250ZXh0KSB7XG4gICAgcHJlZGljYXRlID0gY2IocHJlZGljYXRlLCBjb250ZXh0KTtcbiAgICB2YXIgcGFzcyA9IFtdLCBmYWlsID0gW107XG4gICAgXy5lYWNoKG9iaiwgZnVuY3Rpb24odmFsdWUsIGtleSwgb2JqKSB7XG4gICAgICAocHJlZGljYXRlKHZhbHVlLCBrZXksIG9iaikgPyBwYXNzIDogZmFpbCkucHVzaCh2YWx1ZSk7XG4gICAgfSk7XG4gICAgcmV0dXJuIFtwYXNzLCBmYWlsXTtcbiAgfTtcblxuICAvLyBBcnJheSBGdW5jdGlvbnNcbiAgLy8gLS0tLS0tLS0tLS0tLS0tXG5cbiAgLy8gR2V0IHRoZSBmaXJzdCBlbGVtZW50IG9mIGFuIGFycmF5LiBQYXNzaW5nICoqbioqIHdpbGwgcmV0dXJuIHRoZSBmaXJzdCBOXG4gIC8vIHZhbHVlcyBpbiB0aGUgYXJyYXkuIEFsaWFzZWQgYXMgYGhlYWRgIGFuZCBgdGFrZWAuIFRoZSAqKmd1YXJkKiogY2hlY2tcbiAgLy8gYWxsb3dzIGl0IHRvIHdvcmsgd2l0aCBgXy5tYXBgLlxuICBfLmZpcnN0ID0gXy5oZWFkID0gXy50YWtlID0gZnVuY3Rpb24oYXJyYXksIG4sIGd1YXJkKSB7XG4gICAgaWYgKGFycmF5ID09IG51bGwpIHJldHVybiB2b2lkIDA7XG4gICAgaWYgKG4gPT0gbnVsbCB8fCBndWFyZCkgcmV0dXJuIGFycmF5WzBdO1xuICAgIHJldHVybiBfLmluaXRpYWwoYXJyYXksIGFycmF5Lmxlbmd0aCAtIG4pO1xuICB9O1xuXG4gIC8vIFJldHVybnMgZXZlcnl0aGluZyBidXQgdGhlIGxhc3QgZW50cnkgb2YgdGhlIGFycmF5LiBFc3BlY2lhbGx5IHVzZWZ1bCBvblxuICAvLyB0aGUgYXJndW1lbnRzIG9iamVjdC4gUGFzc2luZyAqKm4qKiB3aWxsIHJldHVybiBhbGwgdGhlIHZhbHVlcyBpblxuICAvLyB0aGUgYXJyYXksIGV4Y2x1ZGluZyB0aGUgbGFzdCBOLlxuICBfLmluaXRpYWwgPSBmdW5jdGlvbihhcnJheSwgbiwgZ3VhcmQpIHtcbiAgICByZXR1cm4gc2xpY2UuY2FsbChhcnJheSwgMCwgTWF0aC5tYXgoMCwgYXJyYXkubGVuZ3RoIC0gKG4gPT0gbnVsbCB8fCBndWFyZCA/IDEgOiBuKSkpO1xuICB9O1xuXG4gIC8vIEdldCB0aGUgbGFzdCBlbGVtZW50IG9mIGFuIGFycmF5LiBQYXNzaW5nICoqbioqIHdpbGwgcmV0dXJuIHRoZSBsYXN0IE5cbiAgLy8gdmFsdWVzIGluIHRoZSBhcnJheS5cbiAgXy5sYXN0ID0gZnVuY3Rpb24oYXJyYXksIG4sIGd1YXJkKSB7XG4gICAgaWYgKGFycmF5ID09IG51bGwpIHJldHVybiB2b2lkIDA7XG4gICAgaWYgKG4gPT0gbnVsbCB8fCBndWFyZCkgcmV0dXJuIGFycmF5W2FycmF5Lmxlbmd0aCAtIDFdO1xuICAgIHJldHVybiBfLnJlc3QoYXJyYXksIE1hdGgubWF4KDAsIGFycmF5Lmxlbmd0aCAtIG4pKTtcbiAgfTtcblxuICAvLyBSZXR1cm5zIGV2ZXJ5dGhpbmcgYnV0IHRoZSBmaXJzdCBlbnRyeSBvZiB0aGUgYXJyYXkuIEFsaWFzZWQgYXMgYHRhaWxgIGFuZCBgZHJvcGAuXG4gIC8vIEVzcGVjaWFsbHkgdXNlZnVsIG9uIHRoZSBhcmd1bWVudHMgb2JqZWN0LiBQYXNzaW5nIGFuICoqbioqIHdpbGwgcmV0dXJuXG4gIC8vIHRoZSByZXN0IE4gdmFsdWVzIGluIHRoZSBhcnJheS5cbiAgXy5yZXN0ID0gXy50YWlsID0gXy5kcm9wID0gZnVuY3Rpb24oYXJyYXksIG4sIGd1YXJkKSB7XG4gICAgcmV0dXJuIHNsaWNlLmNhbGwoYXJyYXksIG4gPT0gbnVsbCB8fCBndWFyZCA/IDEgOiBuKTtcbiAgfTtcblxuICAvLyBUcmltIG91dCBhbGwgZmFsc3kgdmFsdWVzIGZyb20gYW4gYXJyYXkuXG4gIF8uY29tcGFjdCA9IGZ1bmN0aW9uKGFycmF5KSB7XG4gICAgcmV0dXJuIF8uZmlsdGVyKGFycmF5LCBfLmlkZW50aXR5KTtcbiAgfTtcblxuICAvLyBJbnRlcm5hbCBpbXBsZW1lbnRhdGlvbiBvZiBhIHJlY3Vyc2l2ZSBgZmxhdHRlbmAgZnVuY3Rpb24uXG4gIHZhciBmbGF0dGVuID0gZnVuY3Rpb24oaW5wdXQsIHNoYWxsb3csIHN0cmljdCwgc3RhcnRJbmRleCkge1xuICAgIHZhciBvdXRwdXQgPSBbXSwgaWR4ID0gMDtcbiAgICBmb3IgKHZhciBpID0gc3RhcnRJbmRleCB8fCAwLCBsZW5ndGggPSBpbnB1dCAmJiBpbnB1dC5sZW5ndGg7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgdmFyIHZhbHVlID0gaW5wdXRbaV07XG4gICAgICBpZiAoaXNBcnJheUxpa2UodmFsdWUpICYmIChfLmlzQXJyYXkodmFsdWUpIHx8IF8uaXNBcmd1bWVudHModmFsdWUpKSkge1xuICAgICAgICAvL2ZsYXR0ZW4gY3VycmVudCBsZXZlbCBvZiBhcnJheSBvciBhcmd1bWVudHMgb2JqZWN0XG4gICAgICAgIGlmICghc2hhbGxvdykgdmFsdWUgPSBmbGF0dGVuKHZhbHVlLCBzaGFsbG93LCBzdHJpY3QpO1xuICAgICAgICB2YXIgaiA9IDAsIGxlbiA9IHZhbHVlLmxlbmd0aDtcbiAgICAgICAgb3V0cHV0Lmxlbmd0aCArPSBsZW47XG4gICAgICAgIHdoaWxlIChqIDwgbGVuKSB7XG4gICAgICAgICAgb3V0cHV0W2lkeCsrXSA9IHZhbHVlW2orK107XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZiAoIXN0cmljdCkge1xuICAgICAgICBvdXRwdXRbaWR4KytdID0gdmFsdWU7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBvdXRwdXQ7XG4gIH07XG5cbiAgLy8gRmxhdHRlbiBvdXQgYW4gYXJyYXksIGVpdGhlciByZWN1cnNpdmVseSAoYnkgZGVmYXVsdCksIG9yIGp1c3Qgb25lIGxldmVsLlxuICBfLmZsYXR0ZW4gPSBmdW5jdGlvbihhcnJheSwgc2hhbGxvdykge1xuICAgIHJldHVybiBmbGF0dGVuKGFycmF5LCBzaGFsbG93LCBmYWxzZSk7XG4gIH07XG5cbiAgLy8gUmV0dXJuIGEgdmVyc2lvbiBvZiB0aGUgYXJyYXkgdGhhdCBkb2VzIG5vdCBjb250YWluIHRoZSBzcGVjaWZpZWQgdmFsdWUocykuXG4gIF8ud2l0aG91dCA9IGZ1bmN0aW9uKGFycmF5KSB7XG4gICAgcmV0dXJuIF8uZGlmZmVyZW5jZShhcnJheSwgc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpKTtcbiAgfTtcblxuICAvLyBQcm9kdWNlIGEgZHVwbGljYXRlLWZyZWUgdmVyc2lvbiBvZiB0aGUgYXJyYXkuIElmIHRoZSBhcnJheSBoYXMgYWxyZWFkeVxuICAvLyBiZWVuIHNvcnRlZCwgeW91IGhhdmUgdGhlIG9wdGlvbiBvZiB1c2luZyBhIGZhc3RlciBhbGdvcml0aG0uXG4gIC8vIEFsaWFzZWQgYXMgYHVuaXF1ZWAuXG4gIF8udW5pcSA9IF8udW5pcXVlID0gZnVuY3Rpb24oYXJyYXksIGlzU29ydGVkLCBpdGVyYXRlZSwgY29udGV4dCkge1xuICAgIGlmIChhcnJheSA9PSBudWxsKSByZXR1cm4gW107XG4gICAgaWYgKCFfLmlzQm9vbGVhbihpc1NvcnRlZCkpIHtcbiAgICAgIGNvbnRleHQgPSBpdGVyYXRlZTtcbiAgICAgIGl0ZXJhdGVlID0gaXNTb3J0ZWQ7XG4gICAgICBpc1NvcnRlZCA9IGZhbHNlO1xuICAgIH1cbiAgICBpZiAoaXRlcmF0ZWUgIT0gbnVsbCkgaXRlcmF0ZWUgPSBjYihpdGVyYXRlZSwgY29udGV4dCk7XG4gICAgdmFyIHJlc3VsdCA9IFtdO1xuICAgIHZhciBzZWVuID0gW107XG4gICAgZm9yICh2YXIgaSA9IDAsIGxlbmd0aCA9IGFycmF5Lmxlbmd0aDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgdmFsdWUgPSBhcnJheVtpXSxcbiAgICAgICAgICBjb21wdXRlZCA9IGl0ZXJhdGVlID8gaXRlcmF0ZWUodmFsdWUsIGksIGFycmF5KSA6IHZhbHVlO1xuICAgICAgaWYgKGlzU29ydGVkKSB7XG4gICAgICAgIGlmICghaSB8fCBzZWVuICE9PSBjb21wdXRlZCkgcmVzdWx0LnB1c2godmFsdWUpO1xuICAgICAgICBzZWVuID0gY29tcHV0ZWQ7XG4gICAgICB9IGVsc2UgaWYgKGl0ZXJhdGVlKSB7XG4gICAgICAgIGlmICghXy5jb250YWlucyhzZWVuLCBjb21wdXRlZCkpIHtcbiAgICAgICAgICBzZWVuLnB1c2goY29tcHV0ZWQpO1xuICAgICAgICAgIHJlc3VsdC5wdXNoKHZhbHVlKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmICghXy5jb250YWlucyhyZXN1bHQsIHZhbHVlKSkge1xuICAgICAgICByZXN1bHQucHVzaCh2YWx1ZSk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH07XG5cbiAgLy8gUHJvZHVjZSBhbiBhcnJheSB0aGF0IGNvbnRhaW5zIHRoZSB1bmlvbjogZWFjaCBkaXN0aW5jdCBlbGVtZW50IGZyb20gYWxsIG9mXG4gIC8vIHRoZSBwYXNzZWQtaW4gYXJyYXlzLlxuICBfLnVuaW9uID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIF8udW5pcShmbGF0dGVuKGFyZ3VtZW50cywgdHJ1ZSwgdHJ1ZSkpO1xuICB9O1xuXG4gIC8vIFByb2R1Y2UgYW4gYXJyYXkgdGhhdCBjb250YWlucyBldmVyeSBpdGVtIHNoYXJlZCBiZXR3ZWVuIGFsbCB0aGVcbiAgLy8gcGFzc2VkLWluIGFycmF5cy5cbiAgXy5pbnRlcnNlY3Rpb24gPSBmdW5jdGlvbihhcnJheSkge1xuICAgIGlmIChhcnJheSA9PSBudWxsKSByZXR1cm4gW107XG4gICAgdmFyIHJlc3VsdCA9IFtdO1xuICAgIHZhciBhcmdzTGVuZ3RoID0gYXJndW1lbnRzLmxlbmd0aDtcbiAgICBmb3IgKHZhciBpID0gMCwgbGVuZ3RoID0gYXJyYXkubGVuZ3RoOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBpdGVtID0gYXJyYXlbaV07XG4gICAgICBpZiAoXy5jb250YWlucyhyZXN1bHQsIGl0ZW0pKSBjb250aW51ZTtcbiAgICAgIGZvciAodmFyIGogPSAxOyBqIDwgYXJnc0xlbmd0aDsgaisrKSB7XG4gICAgICAgIGlmICghXy5jb250YWlucyhhcmd1bWVudHNbal0sIGl0ZW0pKSBicmVhaztcbiAgICAgIH1cbiAgICAgIGlmIChqID09PSBhcmdzTGVuZ3RoKSByZXN1bHQucHVzaChpdGVtKTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfTtcblxuICAvLyBUYWtlIHRoZSBkaWZmZXJlbmNlIGJldHdlZW4gb25lIGFycmF5IGFuZCBhIG51bWJlciBvZiBvdGhlciBhcnJheXMuXG4gIC8vIE9ubHkgdGhlIGVsZW1lbnRzIHByZXNlbnQgaW4ganVzdCB0aGUgZmlyc3QgYXJyYXkgd2lsbCByZW1haW4uXG4gIF8uZGlmZmVyZW5jZSA9IGZ1bmN0aW9uKGFycmF5KSB7XG4gICAgdmFyIHJlc3QgPSBmbGF0dGVuKGFyZ3VtZW50cywgdHJ1ZSwgdHJ1ZSwgMSk7XG4gICAgcmV0dXJuIF8uZmlsdGVyKGFycmF5LCBmdW5jdGlvbih2YWx1ZSl7XG4gICAgICByZXR1cm4gIV8uY29udGFpbnMocmVzdCwgdmFsdWUpO1xuICAgIH0pO1xuICB9O1xuXG4gIC8vIFppcCB0b2dldGhlciBtdWx0aXBsZSBsaXN0cyBpbnRvIGEgc2luZ2xlIGFycmF5IC0tIGVsZW1lbnRzIHRoYXQgc2hhcmVcbiAgLy8gYW4gaW5kZXggZ28gdG9nZXRoZXIuXG4gIF8uemlwID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIF8udW56aXAoYXJndW1lbnRzKTtcbiAgfTtcblxuICAvLyBDb21wbGVtZW50IG9mIF8uemlwLiBVbnppcCBhY2NlcHRzIGFuIGFycmF5IG9mIGFycmF5cyBhbmQgZ3JvdXBzXG4gIC8vIGVhY2ggYXJyYXkncyBlbGVtZW50cyBvbiBzaGFyZWQgaW5kaWNlc1xuICBfLnVuemlwID0gZnVuY3Rpb24oYXJyYXkpIHtcbiAgICB2YXIgbGVuZ3RoID0gYXJyYXkgJiYgXy5tYXgoYXJyYXksICdsZW5ndGgnKS5sZW5ndGggfHwgMDtcbiAgICB2YXIgcmVzdWx0ID0gQXJyYXkobGVuZ3RoKTtcblxuICAgIGZvciAodmFyIGluZGV4ID0gMDsgaW5kZXggPCBsZW5ndGg7IGluZGV4KyspIHtcbiAgICAgIHJlc3VsdFtpbmRleF0gPSBfLnBsdWNrKGFycmF5LCBpbmRleCk7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH07XG5cbiAgLy8gQ29udmVydHMgbGlzdHMgaW50byBvYmplY3RzLiBQYXNzIGVpdGhlciBhIHNpbmdsZSBhcnJheSBvZiBgW2tleSwgdmFsdWVdYFxuICAvLyBwYWlycywgb3IgdHdvIHBhcmFsbGVsIGFycmF5cyBvZiB0aGUgc2FtZSBsZW5ndGggLS0gb25lIG9mIGtleXMsIGFuZCBvbmUgb2ZcbiAgLy8gdGhlIGNvcnJlc3BvbmRpbmcgdmFsdWVzLlxuICBfLm9iamVjdCA9IGZ1bmN0aW9uKGxpc3QsIHZhbHVlcykge1xuICAgIHZhciByZXN1bHQgPSB7fTtcbiAgICBmb3IgKHZhciBpID0gMCwgbGVuZ3RoID0gbGlzdCAmJiBsaXN0Lmxlbmd0aDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICBpZiAodmFsdWVzKSB7XG4gICAgICAgIHJlc3VsdFtsaXN0W2ldXSA9IHZhbHVlc1tpXTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJlc3VsdFtsaXN0W2ldWzBdXSA9IGxpc3RbaV1bMV07XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH07XG5cbiAgLy8gUmV0dXJuIHRoZSBwb3NpdGlvbiBvZiB0aGUgZmlyc3Qgb2NjdXJyZW5jZSBvZiBhbiBpdGVtIGluIGFuIGFycmF5LFxuICAvLyBvciAtMSBpZiB0aGUgaXRlbSBpcyBub3QgaW5jbHVkZWQgaW4gdGhlIGFycmF5LlxuICAvLyBJZiB0aGUgYXJyYXkgaXMgbGFyZ2UgYW5kIGFscmVhZHkgaW4gc29ydCBvcmRlciwgcGFzcyBgdHJ1ZWBcbiAgLy8gZm9yICoqaXNTb3J0ZWQqKiB0byB1c2UgYmluYXJ5IHNlYXJjaC5cbiAgXy5pbmRleE9mID0gZnVuY3Rpb24oYXJyYXksIGl0ZW0sIGlzU29ydGVkKSB7XG4gICAgdmFyIGkgPSAwLCBsZW5ndGggPSBhcnJheSAmJiBhcnJheS5sZW5ndGg7XG4gICAgaWYgKHR5cGVvZiBpc1NvcnRlZCA9PSAnbnVtYmVyJykge1xuICAgICAgaSA9IGlzU29ydGVkIDwgMCA/IE1hdGgubWF4KDAsIGxlbmd0aCArIGlzU29ydGVkKSA6IGlzU29ydGVkO1xuICAgIH0gZWxzZSBpZiAoaXNTb3J0ZWQgJiYgbGVuZ3RoKSB7XG4gICAgICBpID0gXy5zb3J0ZWRJbmRleChhcnJheSwgaXRlbSk7XG4gICAgICByZXR1cm4gYXJyYXlbaV0gPT09IGl0ZW0gPyBpIDogLTE7XG4gICAgfVxuICAgIGlmIChpdGVtICE9PSBpdGVtKSB7XG4gICAgICByZXR1cm4gXy5maW5kSW5kZXgoc2xpY2UuY2FsbChhcnJheSwgaSksIF8uaXNOYU4pO1xuICAgIH1cbiAgICBmb3IgKDsgaSA8IGxlbmd0aDsgaSsrKSBpZiAoYXJyYXlbaV0gPT09IGl0ZW0pIHJldHVybiBpO1xuICAgIHJldHVybiAtMTtcbiAgfTtcblxuICBfLmxhc3RJbmRleE9mID0gZnVuY3Rpb24oYXJyYXksIGl0ZW0sIGZyb20pIHtcbiAgICB2YXIgaWR4ID0gYXJyYXkgPyBhcnJheS5sZW5ndGggOiAwO1xuICAgIGlmICh0eXBlb2YgZnJvbSA9PSAnbnVtYmVyJykge1xuICAgICAgaWR4ID0gZnJvbSA8IDAgPyBpZHggKyBmcm9tICsgMSA6IE1hdGgubWluKGlkeCwgZnJvbSArIDEpO1xuICAgIH1cbiAgICBpZiAoaXRlbSAhPT0gaXRlbSkge1xuICAgICAgcmV0dXJuIF8uZmluZExhc3RJbmRleChzbGljZS5jYWxsKGFycmF5LCAwLCBpZHgpLCBfLmlzTmFOKTtcbiAgICB9XG4gICAgd2hpbGUgKC0taWR4ID49IDApIGlmIChhcnJheVtpZHhdID09PSBpdGVtKSByZXR1cm4gaWR4O1xuICAgIHJldHVybiAtMTtcbiAgfTtcblxuICAvLyBHZW5lcmF0b3IgZnVuY3Rpb24gdG8gY3JlYXRlIHRoZSBmaW5kSW5kZXggYW5kIGZpbmRMYXN0SW5kZXggZnVuY3Rpb25zXG4gIGZ1bmN0aW9uIGNyZWF0ZUluZGV4RmluZGVyKGRpcikge1xuICAgIHJldHVybiBmdW5jdGlvbihhcnJheSwgcHJlZGljYXRlLCBjb250ZXh0KSB7XG4gICAgICBwcmVkaWNhdGUgPSBjYihwcmVkaWNhdGUsIGNvbnRleHQpO1xuICAgICAgdmFyIGxlbmd0aCA9IGFycmF5ICE9IG51bGwgJiYgYXJyYXkubGVuZ3RoO1xuICAgICAgdmFyIGluZGV4ID0gZGlyID4gMCA/IDAgOiBsZW5ndGggLSAxO1xuICAgICAgZm9yICg7IGluZGV4ID49IDAgJiYgaW5kZXggPCBsZW5ndGg7IGluZGV4ICs9IGRpcikge1xuICAgICAgICBpZiAocHJlZGljYXRlKGFycmF5W2luZGV4XSwgaW5kZXgsIGFycmF5KSkgcmV0dXJuIGluZGV4O1xuICAgICAgfVxuICAgICAgcmV0dXJuIC0xO1xuICAgIH07XG4gIH1cblxuICAvLyBSZXR1cm5zIHRoZSBmaXJzdCBpbmRleCBvbiBhbiBhcnJheS1saWtlIHRoYXQgcGFzc2VzIGEgcHJlZGljYXRlIHRlc3RcbiAgXy5maW5kSW5kZXggPSBjcmVhdGVJbmRleEZpbmRlcigxKTtcblxuICBfLmZpbmRMYXN0SW5kZXggPSBjcmVhdGVJbmRleEZpbmRlcigtMSk7XG5cbiAgLy8gVXNlIGEgY29tcGFyYXRvciBmdW5jdGlvbiB0byBmaWd1cmUgb3V0IHRoZSBzbWFsbGVzdCBpbmRleCBhdCB3aGljaFxuICAvLyBhbiBvYmplY3Qgc2hvdWxkIGJlIGluc2VydGVkIHNvIGFzIHRvIG1haW50YWluIG9yZGVyLiBVc2VzIGJpbmFyeSBzZWFyY2guXG4gIF8uc29ydGVkSW5kZXggPSBmdW5jdGlvbihhcnJheSwgb2JqLCBpdGVyYXRlZSwgY29udGV4dCkge1xuICAgIGl0ZXJhdGVlID0gY2IoaXRlcmF0ZWUsIGNvbnRleHQsIDEpO1xuICAgIHZhciB2YWx1ZSA9IGl0ZXJhdGVlKG9iaik7XG4gICAgdmFyIGxvdyA9IDAsIGhpZ2ggPSBhcnJheS5sZW5ndGg7XG4gICAgd2hpbGUgKGxvdyA8IGhpZ2gpIHtcbiAgICAgIHZhciBtaWQgPSBNYXRoLmZsb29yKChsb3cgKyBoaWdoKSAvIDIpO1xuICAgICAgaWYgKGl0ZXJhdGVlKGFycmF5W21pZF0pIDwgdmFsdWUpIGxvdyA9IG1pZCArIDE7IGVsc2UgaGlnaCA9IG1pZDtcbiAgICB9XG4gICAgcmV0dXJuIGxvdztcbiAgfTtcblxuICAvLyBHZW5lcmF0ZSBhbiBpbnRlZ2VyIEFycmF5IGNvbnRhaW5pbmcgYW4gYXJpdGhtZXRpYyBwcm9ncmVzc2lvbi4gQSBwb3J0IG9mXG4gIC8vIHRoZSBuYXRpdmUgUHl0aG9uIGByYW5nZSgpYCBmdW5jdGlvbi4gU2VlXG4gIC8vIFt0aGUgUHl0aG9uIGRvY3VtZW50YXRpb25dKGh0dHA6Ly9kb2NzLnB5dGhvbi5vcmcvbGlicmFyeS9mdW5jdGlvbnMuaHRtbCNyYW5nZSkuXG4gIF8ucmFuZ2UgPSBmdW5jdGlvbihzdGFydCwgc3RvcCwgc3RlcCkge1xuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoIDw9IDEpIHtcbiAgICAgIHN0b3AgPSBzdGFydCB8fCAwO1xuICAgICAgc3RhcnQgPSAwO1xuICAgIH1cbiAgICBzdGVwID0gc3RlcCB8fCAxO1xuXG4gICAgdmFyIGxlbmd0aCA9IE1hdGgubWF4KE1hdGguY2VpbCgoc3RvcCAtIHN0YXJ0KSAvIHN0ZXApLCAwKTtcbiAgICB2YXIgcmFuZ2UgPSBBcnJheShsZW5ndGgpO1xuXG4gICAgZm9yICh2YXIgaWR4ID0gMDsgaWR4IDwgbGVuZ3RoOyBpZHgrKywgc3RhcnQgKz0gc3RlcCkge1xuICAgICAgcmFuZ2VbaWR4XSA9IHN0YXJ0O1xuICAgIH1cblxuICAgIHJldHVybiByYW5nZTtcbiAgfTtcblxuICAvLyBGdW5jdGlvbiAoYWhlbSkgRnVuY3Rpb25zXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gIC8vIERldGVybWluZXMgd2hldGhlciB0byBleGVjdXRlIGEgZnVuY3Rpb24gYXMgYSBjb25zdHJ1Y3RvclxuICAvLyBvciBhIG5vcm1hbCBmdW5jdGlvbiB3aXRoIHRoZSBwcm92aWRlZCBhcmd1bWVudHNcbiAgdmFyIGV4ZWN1dGVCb3VuZCA9IGZ1bmN0aW9uKHNvdXJjZUZ1bmMsIGJvdW5kRnVuYywgY29udGV4dCwgY2FsbGluZ0NvbnRleHQsIGFyZ3MpIHtcbiAgICBpZiAoIShjYWxsaW5nQ29udGV4dCBpbnN0YW5jZW9mIGJvdW5kRnVuYykpIHJldHVybiBzb3VyY2VGdW5jLmFwcGx5KGNvbnRleHQsIGFyZ3MpO1xuICAgIHZhciBzZWxmID0gYmFzZUNyZWF0ZShzb3VyY2VGdW5jLnByb3RvdHlwZSk7XG4gICAgdmFyIHJlc3VsdCA9IHNvdXJjZUZ1bmMuYXBwbHkoc2VsZiwgYXJncyk7XG4gICAgaWYgKF8uaXNPYmplY3QocmVzdWx0KSkgcmV0dXJuIHJlc3VsdDtcbiAgICByZXR1cm4gc2VsZjtcbiAgfTtcblxuICAvLyBDcmVhdGUgYSBmdW5jdGlvbiBib3VuZCB0byBhIGdpdmVuIG9iamVjdCAoYXNzaWduaW5nIGB0aGlzYCwgYW5kIGFyZ3VtZW50cyxcbiAgLy8gb3B0aW9uYWxseSkuIERlbGVnYXRlcyB0byAqKkVDTUFTY3JpcHQgNSoqJ3MgbmF0aXZlIGBGdW5jdGlvbi5iaW5kYCBpZlxuICAvLyBhdmFpbGFibGUuXG4gIF8uYmluZCA9IGZ1bmN0aW9uKGZ1bmMsIGNvbnRleHQpIHtcbiAgICBpZiAobmF0aXZlQmluZCAmJiBmdW5jLmJpbmQgPT09IG5hdGl2ZUJpbmQpIHJldHVybiBuYXRpdmVCaW5kLmFwcGx5KGZ1bmMsIHNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKSk7XG4gICAgaWYgKCFfLmlzRnVuY3Rpb24oZnVuYykpIHRocm93IG5ldyBUeXBlRXJyb3IoJ0JpbmQgbXVzdCBiZSBjYWxsZWQgb24gYSBmdW5jdGlvbicpO1xuICAgIHZhciBhcmdzID0gc2xpY2UuY2FsbChhcmd1bWVudHMsIDIpO1xuICAgIHZhciBib3VuZCA9IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIGV4ZWN1dGVCb3VuZChmdW5jLCBib3VuZCwgY29udGV4dCwgdGhpcywgYXJncy5jb25jYXQoc2xpY2UuY2FsbChhcmd1bWVudHMpKSk7XG4gICAgfTtcbiAgICByZXR1cm4gYm91bmQ7XG4gIH07XG5cbiAgLy8gUGFydGlhbGx5IGFwcGx5IGEgZnVuY3Rpb24gYnkgY3JlYXRpbmcgYSB2ZXJzaW9uIHRoYXQgaGFzIGhhZCBzb21lIG9mIGl0c1xuICAvLyBhcmd1bWVudHMgcHJlLWZpbGxlZCwgd2l0aG91dCBjaGFuZ2luZyBpdHMgZHluYW1pYyBgdGhpc2AgY29udGV4dC4gXyBhY3RzXG4gIC8vIGFzIGEgcGxhY2Vob2xkZXIsIGFsbG93aW5nIGFueSBjb21iaW5hdGlvbiBvZiBhcmd1bWVudHMgdG8gYmUgcHJlLWZpbGxlZC5cbiAgXy5wYXJ0aWFsID0gZnVuY3Rpb24oZnVuYykge1xuICAgIHZhciBib3VuZEFyZ3MgPSBzbGljZS5jYWxsKGFyZ3VtZW50cywgMSk7XG4gICAgdmFyIGJvdW5kID0gZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgcG9zaXRpb24gPSAwLCBsZW5ndGggPSBib3VuZEFyZ3MubGVuZ3RoO1xuICAgICAgdmFyIGFyZ3MgPSBBcnJheShsZW5ndGgpO1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgICBhcmdzW2ldID0gYm91bmRBcmdzW2ldID09PSBfID8gYXJndW1lbnRzW3Bvc2l0aW9uKytdIDogYm91bmRBcmdzW2ldO1xuICAgICAgfVxuICAgICAgd2hpbGUgKHBvc2l0aW9uIDwgYXJndW1lbnRzLmxlbmd0aCkgYXJncy5wdXNoKGFyZ3VtZW50c1twb3NpdGlvbisrXSk7XG4gICAgICByZXR1cm4gZXhlY3V0ZUJvdW5kKGZ1bmMsIGJvdW5kLCB0aGlzLCB0aGlzLCBhcmdzKTtcbiAgICB9O1xuICAgIHJldHVybiBib3VuZDtcbiAgfTtcblxuICAvLyBCaW5kIGEgbnVtYmVyIG9mIGFuIG9iamVjdCdzIG1ldGhvZHMgdG8gdGhhdCBvYmplY3QuIFJlbWFpbmluZyBhcmd1bWVudHNcbiAgLy8gYXJlIHRoZSBtZXRob2QgbmFtZXMgdG8gYmUgYm91bmQuIFVzZWZ1bCBmb3IgZW5zdXJpbmcgdGhhdCBhbGwgY2FsbGJhY2tzXG4gIC8vIGRlZmluZWQgb24gYW4gb2JqZWN0IGJlbG9uZyB0byBpdC5cbiAgXy5iaW5kQWxsID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgdmFyIGksIGxlbmd0aCA9IGFyZ3VtZW50cy5sZW5ndGgsIGtleTtcbiAgICBpZiAobGVuZ3RoIDw9IDEpIHRocm93IG5ldyBFcnJvcignYmluZEFsbCBtdXN0IGJlIHBhc3NlZCBmdW5jdGlvbiBuYW1lcycpO1xuICAgIGZvciAoaSA9IDE7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAga2V5ID0gYXJndW1lbnRzW2ldO1xuICAgICAgb2JqW2tleV0gPSBfLmJpbmQob2JqW2tleV0sIG9iaik7XG4gICAgfVxuICAgIHJldHVybiBvYmo7XG4gIH07XG5cbiAgLy8gTWVtb2l6ZSBhbiBleHBlbnNpdmUgZnVuY3Rpb24gYnkgc3RvcmluZyBpdHMgcmVzdWx0cy5cbiAgXy5tZW1vaXplID0gZnVuY3Rpb24oZnVuYywgaGFzaGVyKSB7XG4gICAgdmFyIG1lbW9pemUgPSBmdW5jdGlvbihrZXkpIHtcbiAgICAgIHZhciBjYWNoZSA9IG1lbW9pemUuY2FjaGU7XG4gICAgICB2YXIgYWRkcmVzcyA9ICcnICsgKGhhc2hlciA/IGhhc2hlci5hcHBseSh0aGlzLCBhcmd1bWVudHMpIDoga2V5KTtcbiAgICAgIGlmICghXy5oYXMoY2FjaGUsIGFkZHJlc3MpKSBjYWNoZVthZGRyZXNzXSA9IGZ1bmMuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgIHJldHVybiBjYWNoZVthZGRyZXNzXTtcbiAgICB9O1xuICAgIG1lbW9pemUuY2FjaGUgPSB7fTtcbiAgICByZXR1cm4gbWVtb2l6ZTtcbiAgfTtcblxuICAvLyBEZWxheXMgYSBmdW5jdGlvbiBmb3IgdGhlIGdpdmVuIG51bWJlciBvZiBtaWxsaXNlY29uZHMsIGFuZCB0aGVuIGNhbGxzXG4gIC8vIGl0IHdpdGggdGhlIGFyZ3VtZW50cyBzdXBwbGllZC5cbiAgXy5kZWxheSA9IGZ1bmN0aW9uKGZ1bmMsIHdhaXQpIHtcbiAgICB2YXIgYXJncyA9IHNsaWNlLmNhbGwoYXJndW1lbnRzLCAyKTtcbiAgICByZXR1cm4gc2V0VGltZW91dChmdW5jdGlvbigpe1xuICAgICAgcmV0dXJuIGZ1bmMuYXBwbHkobnVsbCwgYXJncyk7XG4gICAgfSwgd2FpdCk7XG4gIH07XG5cbiAgLy8gRGVmZXJzIGEgZnVuY3Rpb24sIHNjaGVkdWxpbmcgaXQgdG8gcnVuIGFmdGVyIHRoZSBjdXJyZW50IGNhbGwgc3RhY2sgaGFzXG4gIC8vIGNsZWFyZWQuXG4gIF8uZGVmZXIgPSBfLnBhcnRpYWwoXy5kZWxheSwgXywgMSk7XG5cbiAgLy8gUmV0dXJucyBhIGZ1bmN0aW9uLCB0aGF0LCB3aGVuIGludm9rZWQsIHdpbGwgb25seSBiZSB0cmlnZ2VyZWQgYXQgbW9zdCBvbmNlXG4gIC8vIGR1cmluZyBhIGdpdmVuIHdpbmRvdyBvZiB0aW1lLiBOb3JtYWxseSwgdGhlIHRocm90dGxlZCBmdW5jdGlvbiB3aWxsIHJ1blxuICAvLyBhcyBtdWNoIGFzIGl0IGNhbiwgd2l0aG91dCBldmVyIGdvaW5nIG1vcmUgdGhhbiBvbmNlIHBlciBgd2FpdGAgZHVyYXRpb247XG4gIC8vIGJ1dCBpZiB5b3UnZCBsaWtlIHRvIGRpc2FibGUgdGhlIGV4ZWN1dGlvbiBvbiB0aGUgbGVhZGluZyBlZGdlLCBwYXNzXG4gIC8vIGB7bGVhZGluZzogZmFsc2V9YC4gVG8gZGlzYWJsZSBleGVjdXRpb24gb24gdGhlIHRyYWlsaW5nIGVkZ2UsIGRpdHRvLlxuICBfLnRocm90dGxlID0gZnVuY3Rpb24oZnVuYywgd2FpdCwgb3B0aW9ucykge1xuICAgIHZhciBjb250ZXh0LCBhcmdzLCByZXN1bHQ7XG4gICAgdmFyIHRpbWVvdXQgPSBudWxsO1xuICAgIHZhciBwcmV2aW91cyA9IDA7XG4gICAgaWYgKCFvcHRpb25zKSBvcHRpb25zID0ge307XG4gICAgdmFyIGxhdGVyID0gZnVuY3Rpb24oKSB7XG4gICAgICBwcmV2aW91cyA9IG9wdGlvbnMubGVhZGluZyA9PT0gZmFsc2UgPyAwIDogXy5ub3coKTtcbiAgICAgIHRpbWVvdXQgPSBudWxsO1xuICAgICAgcmVzdWx0ID0gZnVuYy5hcHBseShjb250ZXh0LCBhcmdzKTtcbiAgICAgIGlmICghdGltZW91dCkgY29udGV4dCA9IGFyZ3MgPSBudWxsO1xuICAgIH07XG4gICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIG5vdyA9IF8ubm93KCk7XG4gICAgICBpZiAoIXByZXZpb3VzICYmIG9wdGlvbnMubGVhZGluZyA9PT0gZmFsc2UpIHByZXZpb3VzID0gbm93O1xuICAgICAgdmFyIHJlbWFpbmluZyA9IHdhaXQgLSAobm93IC0gcHJldmlvdXMpO1xuICAgICAgY29udGV4dCA9IHRoaXM7XG4gICAgICBhcmdzID0gYXJndW1lbnRzO1xuICAgICAgaWYgKHJlbWFpbmluZyA8PSAwIHx8IHJlbWFpbmluZyA+IHdhaXQpIHtcbiAgICAgICAgaWYgKHRpbWVvdXQpIHtcbiAgICAgICAgICBjbGVhclRpbWVvdXQodGltZW91dCk7XG4gICAgICAgICAgdGltZW91dCA9IG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgcHJldmlvdXMgPSBub3c7XG4gICAgICAgIHJlc3VsdCA9IGZ1bmMuYXBwbHkoY29udGV4dCwgYXJncyk7XG4gICAgICAgIGlmICghdGltZW91dCkgY29udGV4dCA9IGFyZ3MgPSBudWxsO1xuICAgICAgfSBlbHNlIGlmICghdGltZW91dCAmJiBvcHRpb25zLnRyYWlsaW5nICE9PSBmYWxzZSkge1xuICAgICAgICB0aW1lb3V0ID0gc2V0VGltZW91dChsYXRlciwgcmVtYWluaW5nKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfTtcbiAgfTtcblxuICAvLyBSZXR1cm5zIGEgZnVuY3Rpb24sIHRoYXQsIGFzIGxvbmcgYXMgaXQgY29udGludWVzIHRvIGJlIGludm9rZWQsIHdpbGwgbm90XG4gIC8vIGJlIHRyaWdnZXJlZC4gVGhlIGZ1bmN0aW9uIHdpbGwgYmUgY2FsbGVkIGFmdGVyIGl0IHN0b3BzIGJlaW5nIGNhbGxlZCBmb3JcbiAgLy8gTiBtaWxsaXNlY29uZHMuIElmIGBpbW1lZGlhdGVgIGlzIHBhc3NlZCwgdHJpZ2dlciB0aGUgZnVuY3Rpb24gb24gdGhlXG4gIC8vIGxlYWRpbmcgZWRnZSwgaW5zdGVhZCBvZiB0aGUgdHJhaWxpbmcuXG4gIF8uZGVib3VuY2UgPSBmdW5jdGlvbihmdW5jLCB3YWl0LCBpbW1lZGlhdGUpIHtcbiAgICB2YXIgdGltZW91dCwgYXJncywgY29udGV4dCwgdGltZXN0YW1wLCByZXN1bHQ7XG5cbiAgICB2YXIgbGF0ZXIgPSBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBsYXN0ID0gXy5ub3coKSAtIHRpbWVzdGFtcDtcblxuICAgICAgaWYgKGxhc3QgPCB3YWl0ICYmIGxhc3QgPj0gMCkge1xuICAgICAgICB0aW1lb3V0ID0gc2V0VGltZW91dChsYXRlciwgd2FpdCAtIGxhc3QpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGltZW91dCA9IG51bGw7XG4gICAgICAgIGlmICghaW1tZWRpYXRlKSB7XG4gICAgICAgICAgcmVzdWx0ID0gZnVuYy5hcHBseShjb250ZXh0LCBhcmdzKTtcbiAgICAgICAgICBpZiAoIXRpbWVvdXQpIGNvbnRleHQgPSBhcmdzID0gbnVsbDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH07XG5cbiAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICBjb250ZXh0ID0gdGhpcztcbiAgICAgIGFyZ3MgPSBhcmd1bWVudHM7XG4gICAgICB0aW1lc3RhbXAgPSBfLm5vdygpO1xuICAgICAgdmFyIGNhbGxOb3cgPSBpbW1lZGlhdGUgJiYgIXRpbWVvdXQ7XG4gICAgICBpZiAoIXRpbWVvdXQpIHRpbWVvdXQgPSBzZXRUaW1lb3V0KGxhdGVyLCB3YWl0KTtcbiAgICAgIGlmIChjYWxsTm93KSB7XG4gICAgICAgIHJlc3VsdCA9IGZ1bmMuYXBwbHkoY29udGV4dCwgYXJncyk7XG4gICAgICAgIGNvbnRleHQgPSBhcmdzID0gbnVsbDtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9O1xuICB9O1xuXG4gIC8vIFJldHVybnMgdGhlIGZpcnN0IGZ1bmN0aW9uIHBhc3NlZCBhcyBhbiBhcmd1bWVudCB0byB0aGUgc2Vjb25kLFxuICAvLyBhbGxvd2luZyB5b3UgdG8gYWRqdXN0IGFyZ3VtZW50cywgcnVuIGNvZGUgYmVmb3JlIGFuZCBhZnRlciwgYW5kXG4gIC8vIGNvbmRpdGlvbmFsbHkgZXhlY3V0ZSB0aGUgb3JpZ2luYWwgZnVuY3Rpb24uXG4gIF8ud3JhcCA9IGZ1bmN0aW9uKGZ1bmMsIHdyYXBwZXIpIHtcbiAgICByZXR1cm4gXy5wYXJ0aWFsKHdyYXBwZXIsIGZ1bmMpO1xuICB9O1xuXG4gIC8vIFJldHVybnMgYSBuZWdhdGVkIHZlcnNpb24gb2YgdGhlIHBhc3NlZC1pbiBwcmVkaWNhdGUuXG4gIF8ubmVnYXRlID0gZnVuY3Rpb24ocHJlZGljYXRlKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuICFwcmVkaWNhdGUuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICB9O1xuICB9O1xuXG4gIC8vIFJldHVybnMgYSBmdW5jdGlvbiB0aGF0IGlzIHRoZSBjb21wb3NpdGlvbiBvZiBhIGxpc3Qgb2YgZnVuY3Rpb25zLCBlYWNoXG4gIC8vIGNvbnN1bWluZyB0aGUgcmV0dXJuIHZhbHVlIG9mIHRoZSBmdW5jdGlvbiB0aGF0IGZvbGxvd3MuXG4gIF8uY29tcG9zZSA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBhcmdzID0gYXJndW1lbnRzO1xuICAgIHZhciBzdGFydCA9IGFyZ3MubGVuZ3RoIC0gMTtcbiAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgaSA9IHN0YXJ0O1xuICAgICAgdmFyIHJlc3VsdCA9IGFyZ3Nbc3RhcnRdLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICB3aGlsZSAoaS0tKSByZXN1bHQgPSBhcmdzW2ldLmNhbGwodGhpcywgcmVzdWx0KTtcbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfTtcbiAgfTtcblxuICAvLyBSZXR1cm5zIGEgZnVuY3Rpb24gdGhhdCB3aWxsIG9ubHkgYmUgZXhlY3V0ZWQgb24gYW5kIGFmdGVyIHRoZSBOdGggY2FsbC5cbiAgXy5hZnRlciA9IGZ1bmN0aW9uKHRpbWVzLCBmdW5jKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgaWYgKC0tdGltZXMgPCAxKSB7XG4gICAgICAgIHJldHVybiBmdW5jLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICB9XG4gICAgfTtcbiAgfTtcblxuICAvLyBSZXR1cm5zIGEgZnVuY3Rpb24gdGhhdCB3aWxsIG9ubHkgYmUgZXhlY3V0ZWQgdXAgdG8gKGJ1dCBub3QgaW5jbHVkaW5nKSB0aGUgTnRoIGNhbGwuXG4gIF8uYmVmb3JlID0gZnVuY3Rpb24odGltZXMsIGZ1bmMpIHtcbiAgICB2YXIgbWVtbztcbiAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICBpZiAoLS10aW1lcyA+IDApIHtcbiAgICAgICAgbWVtbyA9IGZ1bmMuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgIH1cbiAgICAgIGlmICh0aW1lcyA8PSAxKSBmdW5jID0gbnVsbDtcbiAgICAgIHJldHVybiBtZW1vO1xuICAgIH07XG4gIH07XG5cbiAgLy8gUmV0dXJucyBhIGZ1bmN0aW9uIHRoYXQgd2lsbCBiZSBleGVjdXRlZCBhdCBtb3N0IG9uZSB0aW1lLCBubyBtYXR0ZXIgaG93XG4gIC8vIG9mdGVuIHlvdSBjYWxsIGl0LiBVc2VmdWwgZm9yIGxhenkgaW5pdGlhbGl6YXRpb24uXG4gIF8ub25jZSA9IF8ucGFydGlhbChfLmJlZm9yZSwgMik7XG5cbiAgLy8gT2JqZWN0IEZ1bmN0aW9uc1xuICAvLyAtLS0tLS0tLS0tLS0tLS0tXG5cbiAgLy8gS2V5cyBpbiBJRSA8IDkgdGhhdCB3b24ndCBiZSBpdGVyYXRlZCBieSBgZm9yIGtleSBpbiAuLi5gIGFuZCB0aHVzIG1pc3NlZC5cbiAgdmFyIGhhc0VudW1CdWcgPSAhe3RvU3RyaW5nOiBudWxsfS5wcm9wZXJ0eUlzRW51bWVyYWJsZSgndG9TdHJpbmcnKTtcbiAgdmFyIG5vbkVudW1lcmFibGVQcm9wcyA9IFsndmFsdWVPZicsICdpc1Byb3RvdHlwZU9mJywgJ3RvU3RyaW5nJyxcbiAgICAgICAgICAgICAgICAgICAgICAncHJvcGVydHlJc0VudW1lcmFibGUnLCAnaGFzT3duUHJvcGVydHknLCAndG9Mb2NhbGVTdHJpbmcnXTtcblxuICBmdW5jdGlvbiBjb2xsZWN0Tm9uRW51bVByb3BzKG9iaiwga2V5cykge1xuICAgIHZhciBub25FbnVtSWR4ID0gbm9uRW51bWVyYWJsZVByb3BzLmxlbmd0aDtcbiAgICB2YXIgY29uc3RydWN0b3IgPSBvYmouY29uc3RydWN0b3I7XG4gICAgdmFyIHByb3RvID0gKF8uaXNGdW5jdGlvbihjb25zdHJ1Y3RvcikgJiYgY29uc3RydWN0b3IucHJvdG90eXBlKSB8fCBPYmpQcm90bztcblxuICAgIC8vIENvbnN0cnVjdG9yIGlzIGEgc3BlY2lhbCBjYXNlLlxuICAgIHZhciBwcm9wID0gJ2NvbnN0cnVjdG9yJztcbiAgICBpZiAoXy5oYXMob2JqLCBwcm9wKSAmJiAhXy5jb250YWlucyhrZXlzLCBwcm9wKSkga2V5cy5wdXNoKHByb3ApO1xuXG4gICAgd2hpbGUgKG5vbkVudW1JZHgtLSkge1xuICAgICAgcHJvcCA9IG5vbkVudW1lcmFibGVQcm9wc1tub25FbnVtSWR4XTtcbiAgICAgIGlmIChwcm9wIGluIG9iaiAmJiBvYmpbcHJvcF0gIT09IHByb3RvW3Byb3BdICYmICFfLmNvbnRhaW5zKGtleXMsIHByb3ApKSB7XG4gICAgICAgIGtleXMucHVzaChwcm9wKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvLyBSZXRyaWV2ZSB0aGUgbmFtZXMgb2YgYW4gb2JqZWN0J3Mgb3duIHByb3BlcnRpZXMuXG4gIC8vIERlbGVnYXRlcyB0byAqKkVDTUFTY3JpcHQgNSoqJ3MgbmF0aXZlIGBPYmplY3Qua2V5c2BcbiAgXy5rZXlzID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgaWYgKCFfLmlzT2JqZWN0KG9iaikpIHJldHVybiBbXTtcbiAgICBpZiAobmF0aXZlS2V5cykgcmV0dXJuIG5hdGl2ZUtleXMob2JqKTtcbiAgICB2YXIga2V5cyA9IFtdO1xuICAgIGZvciAodmFyIGtleSBpbiBvYmopIGlmIChfLmhhcyhvYmosIGtleSkpIGtleXMucHVzaChrZXkpO1xuICAgIC8vIEFoZW0sIElFIDwgOS5cbiAgICBpZiAoaGFzRW51bUJ1ZykgY29sbGVjdE5vbkVudW1Qcm9wcyhvYmosIGtleXMpO1xuICAgIHJldHVybiBrZXlzO1xuICB9O1xuXG4gIC8vIFJldHJpZXZlIGFsbCB0aGUgcHJvcGVydHkgbmFtZXMgb2YgYW4gb2JqZWN0LlxuICBfLmFsbEtleXMgPSBmdW5jdGlvbihvYmopIHtcbiAgICBpZiAoIV8uaXNPYmplY3Qob2JqKSkgcmV0dXJuIFtdO1xuICAgIHZhciBrZXlzID0gW107XG4gICAgZm9yICh2YXIga2V5IGluIG9iaikga2V5cy5wdXNoKGtleSk7XG4gICAgLy8gQWhlbSwgSUUgPCA5LlxuICAgIGlmIChoYXNFbnVtQnVnKSBjb2xsZWN0Tm9uRW51bVByb3BzKG9iaiwga2V5cyk7XG4gICAgcmV0dXJuIGtleXM7XG4gIH07XG5cbiAgLy8gUmV0cmlldmUgdGhlIHZhbHVlcyBvZiBhbiBvYmplY3QncyBwcm9wZXJ0aWVzLlxuICBfLnZhbHVlcyA9IGZ1bmN0aW9uKG9iaikge1xuICAgIHZhciBrZXlzID0gXy5rZXlzKG9iaik7XG4gICAgdmFyIGxlbmd0aCA9IGtleXMubGVuZ3RoO1xuICAgIHZhciB2YWx1ZXMgPSBBcnJheShsZW5ndGgpO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhbHVlc1tpXSA9IG9ialtrZXlzW2ldXTtcbiAgICB9XG4gICAgcmV0dXJuIHZhbHVlcztcbiAgfTtcblxuICAvLyBSZXR1cm5zIHRoZSByZXN1bHRzIG9mIGFwcGx5aW5nIHRoZSBpdGVyYXRlZSB0byBlYWNoIGVsZW1lbnQgb2YgdGhlIG9iamVjdFxuICAvLyBJbiBjb250cmFzdCB0byBfLm1hcCBpdCByZXR1cm5zIGFuIG9iamVjdFxuICBfLm1hcE9iamVjdCA9IGZ1bmN0aW9uKG9iaiwgaXRlcmF0ZWUsIGNvbnRleHQpIHtcbiAgICBpdGVyYXRlZSA9IGNiKGl0ZXJhdGVlLCBjb250ZXh0KTtcbiAgICB2YXIga2V5cyA9ICBfLmtleXMob2JqKSxcbiAgICAgICAgICBsZW5ndGggPSBrZXlzLmxlbmd0aCxcbiAgICAgICAgICByZXN1bHRzID0ge30sXG4gICAgICAgICAgY3VycmVudEtleTtcbiAgICAgIGZvciAodmFyIGluZGV4ID0gMDsgaW5kZXggPCBsZW5ndGg7IGluZGV4KyspIHtcbiAgICAgICAgY3VycmVudEtleSA9IGtleXNbaW5kZXhdO1xuICAgICAgICByZXN1bHRzW2N1cnJlbnRLZXldID0gaXRlcmF0ZWUob2JqW2N1cnJlbnRLZXldLCBjdXJyZW50S2V5LCBvYmopO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHJlc3VsdHM7XG4gIH07XG5cbiAgLy8gQ29udmVydCBhbiBvYmplY3QgaW50byBhIGxpc3Qgb2YgYFtrZXksIHZhbHVlXWAgcGFpcnMuXG4gIF8ucGFpcnMgPSBmdW5jdGlvbihvYmopIHtcbiAgICB2YXIga2V5cyA9IF8ua2V5cyhvYmopO1xuICAgIHZhciBsZW5ndGggPSBrZXlzLmxlbmd0aDtcbiAgICB2YXIgcGFpcnMgPSBBcnJheShsZW5ndGgpO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgIHBhaXJzW2ldID0gW2tleXNbaV0sIG9ialtrZXlzW2ldXV07XG4gICAgfVxuICAgIHJldHVybiBwYWlycztcbiAgfTtcblxuICAvLyBJbnZlcnQgdGhlIGtleXMgYW5kIHZhbHVlcyBvZiBhbiBvYmplY3QuIFRoZSB2YWx1ZXMgbXVzdCBiZSBzZXJpYWxpemFibGUuXG4gIF8uaW52ZXJ0ID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgdmFyIHJlc3VsdCA9IHt9O1xuICAgIHZhciBrZXlzID0gXy5rZXlzKG9iaik7XG4gICAgZm9yICh2YXIgaSA9IDAsIGxlbmd0aCA9IGtleXMubGVuZ3RoOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgIHJlc3VsdFtvYmpba2V5c1tpXV1dID0ga2V5c1tpXTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfTtcblxuICAvLyBSZXR1cm4gYSBzb3J0ZWQgbGlzdCBvZiB0aGUgZnVuY3Rpb24gbmFtZXMgYXZhaWxhYmxlIG9uIHRoZSBvYmplY3QuXG4gIC8vIEFsaWFzZWQgYXMgYG1ldGhvZHNgXG4gIF8uZnVuY3Rpb25zID0gXy5tZXRob2RzID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgdmFyIG5hbWVzID0gW107XG4gICAgZm9yICh2YXIga2V5IGluIG9iaikge1xuICAgICAgaWYgKF8uaXNGdW5jdGlvbihvYmpba2V5XSkpIG5hbWVzLnB1c2goa2V5KTtcbiAgICB9XG4gICAgcmV0dXJuIG5hbWVzLnNvcnQoKTtcbiAgfTtcblxuICAvLyBFeHRlbmQgYSBnaXZlbiBvYmplY3Qgd2l0aCBhbGwgdGhlIHByb3BlcnRpZXMgaW4gcGFzc2VkLWluIG9iamVjdChzKS5cbiAgXy5leHRlbmQgPSBjcmVhdGVBc3NpZ25lcihfLmFsbEtleXMpO1xuXG4gIC8vIEFzc2lnbnMgYSBnaXZlbiBvYmplY3Qgd2l0aCBhbGwgdGhlIG93biBwcm9wZXJ0aWVzIGluIHRoZSBwYXNzZWQtaW4gb2JqZWN0KHMpXG4gIC8vIChodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9kb2NzL1dlYi9KYXZhU2NyaXB0L1JlZmVyZW5jZS9HbG9iYWxfT2JqZWN0cy9PYmplY3QvYXNzaWduKVxuICBfLmV4dGVuZE93biA9IF8uYXNzaWduID0gY3JlYXRlQXNzaWduZXIoXy5rZXlzKTtcblxuICAvLyBSZXR1cm5zIHRoZSBmaXJzdCBrZXkgb24gYW4gb2JqZWN0IHRoYXQgcGFzc2VzIGEgcHJlZGljYXRlIHRlc3RcbiAgXy5maW5kS2V5ID0gZnVuY3Rpb24ob2JqLCBwcmVkaWNhdGUsIGNvbnRleHQpIHtcbiAgICBwcmVkaWNhdGUgPSBjYihwcmVkaWNhdGUsIGNvbnRleHQpO1xuICAgIHZhciBrZXlzID0gXy5rZXlzKG9iaiksIGtleTtcbiAgICBmb3IgKHZhciBpID0gMCwgbGVuZ3RoID0ga2V5cy5sZW5ndGg7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAga2V5ID0ga2V5c1tpXTtcbiAgICAgIGlmIChwcmVkaWNhdGUob2JqW2tleV0sIGtleSwgb2JqKSkgcmV0dXJuIGtleTtcbiAgICB9XG4gIH07XG5cbiAgLy8gUmV0dXJuIGEgY29weSBvZiB0aGUgb2JqZWN0IG9ubHkgY29udGFpbmluZyB0aGUgd2hpdGVsaXN0ZWQgcHJvcGVydGllcy5cbiAgXy5waWNrID0gZnVuY3Rpb24ob2JqZWN0LCBvaXRlcmF0ZWUsIGNvbnRleHQpIHtcbiAgICB2YXIgcmVzdWx0ID0ge30sIG9iaiA9IG9iamVjdCwgaXRlcmF0ZWUsIGtleXM7XG4gICAgaWYgKG9iaiA9PSBudWxsKSByZXR1cm4gcmVzdWx0O1xuICAgIGlmIChfLmlzRnVuY3Rpb24ob2l0ZXJhdGVlKSkge1xuICAgICAga2V5cyA9IF8uYWxsS2V5cyhvYmopO1xuICAgICAgaXRlcmF0ZWUgPSBvcHRpbWl6ZUNiKG9pdGVyYXRlZSwgY29udGV4dCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGtleXMgPSBmbGF0dGVuKGFyZ3VtZW50cywgZmFsc2UsIGZhbHNlLCAxKTtcbiAgICAgIGl0ZXJhdGVlID0gZnVuY3Rpb24odmFsdWUsIGtleSwgb2JqKSB7IHJldHVybiBrZXkgaW4gb2JqOyB9O1xuICAgICAgb2JqID0gT2JqZWN0KG9iaik7XG4gICAgfVxuICAgIGZvciAodmFyIGkgPSAwLCBsZW5ndGggPSBrZXlzLmxlbmd0aDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIga2V5ID0ga2V5c1tpXTtcbiAgICAgIHZhciB2YWx1ZSA9IG9ialtrZXldO1xuICAgICAgaWYgKGl0ZXJhdGVlKHZhbHVlLCBrZXksIG9iaikpIHJlc3VsdFtrZXldID0gdmFsdWU7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH07XG5cbiAgIC8vIFJldHVybiBhIGNvcHkgb2YgdGhlIG9iamVjdCB3aXRob3V0IHRoZSBibGFja2xpc3RlZCBwcm9wZXJ0aWVzLlxuICBfLm9taXQgPSBmdW5jdGlvbihvYmosIGl0ZXJhdGVlLCBjb250ZXh0KSB7XG4gICAgaWYgKF8uaXNGdW5jdGlvbihpdGVyYXRlZSkpIHtcbiAgICAgIGl0ZXJhdGVlID0gXy5uZWdhdGUoaXRlcmF0ZWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICB2YXIga2V5cyA9IF8ubWFwKGZsYXR0ZW4oYXJndW1lbnRzLCBmYWxzZSwgZmFsc2UsIDEpLCBTdHJpbmcpO1xuICAgICAgaXRlcmF0ZWUgPSBmdW5jdGlvbih2YWx1ZSwga2V5KSB7XG4gICAgICAgIHJldHVybiAhXy5jb250YWlucyhrZXlzLCBrZXkpO1xuICAgICAgfTtcbiAgICB9XG4gICAgcmV0dXJuIF8ucGljayhvYmosIGl0ZXJhdGVlLCBjb250ZXh0KTtcbiAgfTtcblxuICAvLyBGaWxsIGluIGEgZ2l2ZW4gb2JqZWN0IHdpdGggZGVmYXVsdCBwcm9wZXJ0aWVzLlxuICBfLmRlZmF1bHRzID0gY3JlYXRlQXNzaWduZXIoXy5hbGxLZXlzLCB0cnVlKTtcblxuICAvLyBDcmVhdGUgYSAoc2hhbGxvdy1jbG9uZWQpIGR1cGxpY2F0ZSBvZiBhbiBvYmplY3QuXG4gIF8uY2xvbmUgPSBmdW5jdGlvbihvYmopIHtcbiAgICBpZiAoIV8uaXNPYmplY3Qob2JqKSkgcmV0dXJuIG9iajtcbiAgICByZXR1cm4gXy5pc0FycmF5KG9iaikgPyBvYmouc2xpY2UoKSA6IF8uZXh0ZW5kKHt9LCBvYmopO1xuICB9O1xuXG4gIC8vIEludm9rZXMgaW50ZXJjZXB0b3Igd2l0aCB0aGUgb2JqLCBhbmQgdGhlbiByZXR1cm5zIG9iai5cbiAgLy8gVGhlIHByaW1hcnkgcHVycG9zZSBvZiB0aGlzIG1ldGhvZCBpcyB0byBcInRhcCBpbnRvXCIgYSBtZXRob2QgY2hhaW4sIGluXG4gIC8vIG9yZGVyIHRvIHBlcmZvcm0gb3BlcmF0aW9ucyBvbiBpbnRlcm1lZGlhdGUgcmVzdWx0cyB3aXRoaW4gdGhlIGNoYWluLlxuICBfLnRhcCA9IGZ1bmN0aW9uKG9iaiwgaW50ZXJjZXB0b3IpIHtcbiAgICBpbnRlcmNlcHRvcihvYmopO1xuICAgIHJldHVybiBvYmo7XG4gIH07XG5cbiAgLy8gUmV0dXJucyB3aGV0aGVyIGFuIG9iamVjdCBoYXMgYSBnaXZlbiBzZXQgb2YgYGtleTp2YWx1ZWAgcGFpcnMuXG4gIF8uaXNNYXRjaCA9IGZ1bmN0aW9uKG9iamVjdCwgYXR0cnMpIHtcbiAgICB2YXIga2V5cyA9IF8ua2V5cyhhdHRycyksIGxlbmd0aCA9IGtleXMubGVuZ3RoO1xuICAgIGlmIChvYmplY3QgPT0gbnVsbCkgcmV0dXJuICFsZW5ndGg7XG4gICAgdmFyIG9iaiA9IE9iamVjdChvYmplY3QpO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBrZXkgPSBrZXlzW2ldO1xuICAgICAgaWYgKGF0dHJzW2tleV0gIT09IG9ialtrZXldIHx8ICEoa2V5IGluIG9iaikpIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgcmV0dXJuIHRydWU7XG4gIH07XG5cblxuICAvLyBJbnRlcm5hbCByZWN1cnNpdmUgY29tcGFyaXNvbiBmdW5jdGlvbiBmb3IgYGlzRXF1YWxgLlxuICB2YXIgZXEgPSBmdW5jdGlvbihhLCBiLCBhU3RhY2ssIGJTdGFjaykge1xuICAgIC8vIElkZW50aWNhbCBvYmplY3RzIGFyZSBlcXVhbC4gYDAgPT09IC0wYCwgYnV0IHRoZXkgYXJlbid0IGlkZW50aWNhbC5cbiAgICAvLyBTZWUgdGhlIFtIYXJtb255IGBlZ2FsYCBwcm9wb3NhbF0oaHR0cDovL3dpa2kuZWNtYXNjcmlwdC5vcmcvZG9rdS5waHA/aWQ9aGFybW9ueTplZ2FsKS5cbiAgICBpZiAoYSA9PT0gYikgcmV0dXJuIGEgIT09IDAgfHwgMSAvIGEgPT09IDEgLyBiO1xuICAgIC8vIEEgc3RyaWN0IGNvbXBhcmlzb24gaXMgbmVjZXNzYXJ5IGJlY2F1c2UgYG51bGwgPT0gdW5kZWZpbmVkYC5cbiAgICBpZiAoYSA9PSBudWxsIHx8IGIgPT0gbnVsbCkgcmV0dXJuIGEgPT09IGI7XG4gICAgLy8gVW53cmFwIGFueSB3cmFwcGVkIG9iamVjdHMuXG4gICAgaWYgKGEgaW5zdGFuY2VvZiBfKSBhID0gYS5fd3JhcHBlZDtcbiAgICBpZiAoYiBpbnN0YW5jZW9mIF8pIGIgPSBiLl93cmFwcGVkO1xuICAgIC8vIENvbXBhcmUgYFtbQ2xhc3NdXWAgbmFtZXMuXG4gICAgdmFyIGNsYXNzTmFtZSA9IHRvU3RyaW5nLmNhbGwoYSk7XG4gICAgaWYgKGNsYXNzTmFtZSAhPT0gdG9TdHJpbmcuY2FsbChiKSkgcmV0dXJuIGZhbHNlO1xuICAgIHN3aXRjaCAoY2xhc3NOYW1lKSB7XG4gICAgICAvLyBTdHJpbmdzLCBudW1iZXJzLCByZWd1bGFyIGV4cHJlc3Npb25zLCBkYXRlcywgYW5kIGJvb2xlYW5zIGFyZSBjb21wYXJlZCBieSB2YWx1ZS5cbiAgICAgIGNhc2UgJ1tvYmplY3QgUmVnRXhwXSc6XG4gICAgICAvLyBSZWdFeHBzIGFyZSBjb2VyY2VkIHRvIHN0cmluZ3MgZm9yIGNvbXBhcmlzb24gKE5vdGU6ICcnICsgL2EvaSA9PT0gJy9hL2knKVxuICAgICAgY2FzZSAnW29iamVjdCBTdHJpbmddJzpcbiAgICAgICAgLy8gUHJpbWl0aXZlcyBhbmQgdGhlaXIgY29ycmVzcG9uZGluZyBvYmplY3Qgd3JhcHBlcnMgYXJlIGVxdWl2YWxlbnQ7IHRodXMsIGBcIjVcImAgaXNcbiAgICAgICAgLy8gZXF1aXZhbGVudCB0byBgbmV3IFN0cmluZyhcIjVcIilgLlxuICAgICAgICByZXR1cm4gJycgKyBhID09PSAnJyArIGI7XG4gICAgICBjYXNlICdbb2JqZWN0IE51bWJlcl0nOlxuICAgICAgICAvLyBgTmFOYHMgYXJlIGVxdWl2YWxlbnQsIGJ1dCBub24tcmVmbGV4aXZlLlxuICAgICAgICAvLyBPYmplY3QoTmFOKSBpcyBlcXVpdmFsZW50IHRvIE5hTlxuICAgICAgICBpZiAoK2EgIT09ICthKSByZXR1cm4gK2IgIT09ICtiO1xuICAgICAgICAvLyBBbiBgZWdhbGAgY29tcGFyaXNvbiBpcyBwZXJmb3JtZWQgZm9yIG90aGVyIG51bWVyaWMgdmFsdWVzLlxuICAgICAgICByZXR1cm4gK2EgPT09IDAgPyAxIC8gK2EgPT09IDEgLyBiIDogK2EgPT09ICtiO1xuICAgICAgY2FzZSAnW29iamVjdCBEYXRlXSc6XG4gICAgICBjYXNlICdbb2JqZWN0IEJvb2xlYW5dJzpcbiAgICAgICAgLy8gQ29lcmNlIGRhdGVzIGFuZCBib29sZWFucyB0byBudW1lcmljIHByaW1pdGl2ZSB2YWx1ZXMuIERhdGVzIGFyZSBjb21wYXJlZCBieSB0aGVpclxuICAgICAgICAvLyBtaWxsaXNlY29uZCByZXByZXNlbnRhdGlvbnMuIE5vdGUgdGhhdCBpbnZhbGlkIGRhdGVzIHdpdGggbWlsbGlzZWNvbmQgcmVwcmVzZW50YXRpb25zXG4gICAgICAgIC8vIG9mIGBOYU5gIGFyZSBub3QgZXF1aXZhbGVudC5cbiAgICAgICAgcmV0dXJuICthID09PSArYjtcbiAgICB9XG5cbiAgICB2YXIgYXJlQXJyYXlzID0gY2xhc3NOYW1lID09PSAnW29iamVjdCBBcnJheV0nO1xuICAgIGlmICghYXJlQXJyYXlzKSB7XG4gICAgICBpZiAodHlwZW9mIGEgIT0gJ29iamVjdCcgfHwgdHlwZW9mIGIgIT0gJ29iamVjdCcpIHJldHVybiBmYWxzZTtcblxuICAgICAgLy8gT2JqZWN0cyB3aXRoIGRpZmZlcmVudCBjb25zdHJ1Y3RvcnMgYXJlIG5vdCBlcXVpdmFsZW50LCBidXQgYE9iamVjdGBzIG9yIGBBcnJheWBzXG4gICAgICAvLyBmcm9tIGRpZmZlcmVudCBmcmFtZXMgYXJlLlxuICAgICAgdmFyIGFDdG9yID0gYS5jb25zdHJ1Y3RvciwgYkN0b3IgPSBiLmNvbnN0cnVjdG9yO1xuICAgICAgaWYgKGFDdG9yICE9PSBiQ3RvciAmJiAhKF8uaXNGdW5jdGlvbihhQ3RvcikgJiYgYUN0b3IgaW5zdGFuY2VvZiBhQ3RvciAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIF8uaXNGdW5jdGlvbihiQ3RvcikgJiYgYkN0b3IgaW5zdGFuY2VvZiBiQ3RvcilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgJiYgKCdjb25zdHJ1Y3RvcicgaW4gYSAmJiAnY29uc3RydWN0b3InIGluIGIpKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICB9XG4gICAgLy8gQXNzdW1lIGVxdWFsaXR5IGZvciBjeWNsaWMgc3RydWN0dXJlcy4gVGhlIGFsZ29yaXRobSBmb3IgZGV0ZWN0aW5nIGN5Y2xpY1xuICAgIC8vIHN0cnVjdHVyZXMgaXMgYWRhcHRlZCBmcm9tIEVTIDUuMSBzZWN0aW9uIDE1LjEyLjMsIGFic3RyYWN0IG9wZXJhdGlvbiBgSk9gLlxuICAgIFxuICAgIC8vIEluaXRpYWxpemluZyBzdGFjayBvZiB0cmF2ZXJzZWQgb2JqZWN0cy5cbiAgICAvLyBJdCdzIGRvbmUgaGVyZSBzaW5jZSB3ZSBvbmx5IG5lZWQgdGhlbSBmb3Igb2JqZWN0cyBhbmQgYXJyYXlzIGNvbXBhcmlzb24uXG4gICAgYVN0YWNrID0gYVN0YWNrIHx8IFtdO1xuICAgIGJTdGFjayA9IGJTdGFjayB8fCBbXTtcbiAgICB2YXIgbGVuZ3RoID0gYVN0YWNrLmxlbmd0aDtcbiAgICB3aGlsZSAobGVuZ3RoLS0pIHtcbiAgICAgIC8vIExpbmVhciBzZWFyY2guIFBlcmZvcm1hbmNlIGlzIGludmVyc2VseSBwcm9wb3J0aW9uYWwgdG8gdGhlIG51bWJlciBvZlxuICAgICAgLy8gdW5pcXVlIG5lc3RlZCBzdHJ1Y3R1cmVzLlxuICAgICAgaWYgKGFTdGFja1tsZW5ndGhdID09PSBhKSByZXR1cm4gYlN0YWNrW2xlbmd0aF0gPT09IGI7XG4gICAgfVxuXG4gICAgLy8gQWRkIHRoZSBmaXJzdCBvYmplY3QgdG8gdGhlIHN0YWNrIG9mIHRyYXZlcnNlZCBvYmplY3RzLlxuICAgIGFTdGFjay5wdXNoKGEpO1xuICAgIGJTdGFjay5wdXNoKGIpO1xuXG4gICAgLy8gUmVjdXJzaXZlbHkgY29tcGFyZSBvYmplY3RzIGFuZCBhcnJheXMuXG4gICAgaWYgKGFyZUFycmF5cykge1xuICAgICAgLy8gQ29tcGFyZSBhcnJheSBsZW5ndGhzIHRvIGRldGVybWluZSBpZiBhIGRlZXAgY29tcGFyaXNvbiBpcyBuZWNlc3NhcnkuXG4gICAgICBsZW5ndGggPSBhLmxlbmd0aDtcbiAgICAgIGlmIChsZW5ndGggIT09IGIubGVuZ3RoKSByZXR1cm4gZmFsc2U7XG4gICAgICAvLyBEZWVwIGNvbXBhcmUgdGhlIGNvbnRlbnRzLCBpZ25vcmluZyBub24tbnVtZXJpYyBwcm9wZXJ0aWVzLlxuICAgICAgd2hpbGUgKGxlbmd0aC0tKSB7XG4gICAgICAgIGlmICghZXEoYVtsZW5ndGhdLCBiW2xlbmd0aF0sIGFTdGFjaywgYlN0YWNrKSkgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICAvLyBEZWVwIGNvbXBhcmUgb2JqZWN0cy5cbiAgICAgIHZhciBrZXlzID0gXy5rZXlzKGEpLCBrZXk7XG4gICAgICBsZW5ndGggPSBrZXlzLmxlbmd0aDtcbiAgICAgIC8vIEVuc3VyZSB0aGF0IGJvdGggb2JqZWN0cyBjb250YWluIHRoZSBzYW1lIG51bWJlciBvZiBwcm9wZXJ0aWVzIGJlZm9yZSBjb21wYXJpbmcgZGVlcCBlcXVhbGl0eS5cbiAgICAgIGlmIChfLmtleXMoYikubGVuZ3RoICE9PSBsZW5ndGgpIHJldHVybiBmYWxzZTtcbiAgICAgIHdoaWxlIChsZW5ndGgtLSkge1xuICAgICAgICAvLyBEZWVwIGNvbXBhcmUgZWFjaCBtZW1iZXJcbiAgICAgICAga2V5ID0ga2V5c1tsZW5ndGhdO1xuICAgICAgICBpZiAoIShfLmhhcyhiLCBrZXkpICYmIGVxKGFba2V5XSwgYltrZXldLCBhU3RhY2ssIGJTdGFjaykpKSByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgfVxuICAgIC8vIFJlbW92ZSB0aGUgZmlyc3Qgb2JqZWN0IGZyb20gdGhlIHN0YWNrIG9mIHRyYXZlcnNlZCBvYmplY3RzLlxuICAgIGFTdGFjay5wb3AoKTtcbiAgICBiU3RhY2sucG9wKCk7XG4gICAgcmV0dXJuIHRydWU7XG4gIH07XG5cbiAgLy8gUGVyZm9ybSBhIGRlZXAgY29tcGFyaXNvbiB0byBjaGVjayBpZiB0d28gb2JqZWN0cyBhcmUgZXF1YWwuXG4gIF8uaXNFcXVhbCA9IGZ1bmN0aW9uKGEsIGIpIHtcbiAgICByZXR1cm4gZXEoYSwgYik7XG4gIH07XG5cbiAgLy8gSXMgYSBnaXZlbiBhcnJheSwgc3RyaW5nLCBvciBvYmplY3QgZW1wdHk/XG4gIC8vIEFuIFwiZW1wdHlcIiBvYmplY3QgaGFzIG5vIGVudW1lcmFibGUgb3duLXByb3BlcnRpZXMuXG4gIF8uaXNFbXB0eSA9IGZ1bmN0aW9uKG9iaikge1xuICAgIGlmIChvYmogPT0gbnVsbCkgcmV0dXJuIHRydWU7XG4gICAgaWYgKGlzQXJyYXlMaWtlKG9iaikgJiYgKF8uaXNBcnJheShvYmopIHx8IF8uaXNTdHJpbmcob2JqKSB8fCBfLmlzQXJndW1lbnRzKG9iaikpKSByZXR1cm4gb2JqLmxlbmd0aCA9PT0gMDtcbiAgICByZXR1cm4gXy5rZXlzKG9iaikubGVuZ3RoID09PSAwO1xuICB9O1xuXG4gIC8vIElzIGEgZ2l2ZW4gdmFsdWUgYSBET00gZWxlbWVudD9cbiAgXy5pc0VsZW1lbnQgPSBmdW5jdGlvbihvYmopIHtcbiAgICByZXR1cm4gISEob2JqICYmIG9iai5ub2RlVHlwZSA9PT0gMSk7XG4gIH07XG5cbiAgLy8gSXMgYSBnaXZlbiB2YWx1ZSBhbiBhcnJheT9cbiAgLy8gRGVsZWdhdGVzIHRvIEVDTUE1J3MgbmF0aXZlIEFycmF5LmlzQXJyYXlcbiAgXy5pc0FycmF5ID0gbmF0aXZlSXNBcnJheSB8fCBmdW5jdGlvbihvYmopIHtcbiAgICByZXR1cm4gdG9TdHJpbmcuY2FsbChvYmopID09PSAnW29iamVjdCBBcnJheV0nO1xuICB9O1xuXG4gIC8vIElzIGEgZ2l2ZW4gdmFyaWFibGUgYW4gb2JqZWN0P1xuICBfLmlzT2JqZWN0ID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgdmFyIHR5cGUgPSB0eXBlb2Ygb2JqO1xuICAgIHJldHVybiB0eXBlID09PSAnZnVuY3Rpb24nIHx8IHR5cGUgPT09ICdvYmplY3QnICYmICEhb2JqO1xuICB9O1xuXG4gIC8vIEFkZCBzb21lIGlzVHlwZSBtZXRob2RzOiBpc0FyZ3VtZW50cywgaXNGdW5jdGlvbiwgaXNTdHJpbmcsIGlzTnVtYmVyLCBpc0RhdGUsIGlzUmVnRXhwLCBpc0Vycm9yLlxuICBfLmVhY2goWydBcmd1bWVudHMnLCAnRnVuY3Rpb24nLCAnU3RyaW5nJywgJ051bWJlcicsICdEYXRlJywgJ1JlZ0V4cCcsICdFcnJvciddLCBmdW5jdGlvbihuYW1lKSB7XG4gICAgX1snaXMnICsgbmFtZV0gPSBmdW5jdGlvbihvYmopIHtcbiAgICAgIHJldHVybiB0b1N0cmluZy5jYWxsKG9iaikgPT09ICdbb2JqZWN0ICcgKyBuYW1lICsgJ10nO1xuICAgIH07XG4gIH0pO1xuXG4gIC8vIERlZmluZSBhIGZhbGxiYWNrIHZlcnNpb24gb2YgdGhlIG1ldGhvZCBpbiBicm93c2VycyAoYWhlbSwgSUUgPCA5KSwgd2hlcmVcbiAgLy8gdGhlcmUgaXNuJ3QgYW55IGluc3BlY3RhYmxlIFwiQXJndW1lbnRzXCIgdHlwZS5cbiAgaWYgKCFfLmlzQXJndW1lbnRzKGFyZ3VtZW50cykpIHtcbiAgICBfLmlzQXJndW1lbnRzID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgICByZXR1cm4gXy5oYXMob2JqLCAnY2FsbGVlJyk7XG4gICAgfTtcbiAgfVxuXG4gIC8vIE9wdGltaXplIGBpc0Z1bmN0aW9uYCBpZiBhcHByb3ByaWF0ZS4gV29yayBhcm91bmQgc29tZSB0eXBlb2YgYnVncyBpbiBvbGQgdjgsXG4gIC8vIElFIDExICgjMTYyMSksIGFuZCBpbiBTYWZhcmkgOCAoIzE5MjkpLlxuICBpZiAodHlwZW9mIC8uLyAhPSAnZnVuY3Rpb24nICYmIHR5cGVvZiBJbnQ4QXJyYXkgIT0gJ29iamVjdCcpIHtcbiAgICBfLmlzRnVuY3Rpb24gPSBmdW5jdGlvbihvYmopIHtcbiAgICAgIHJldHVybiB0eXBlb2Ygb2JqID09ICdmdW5jdGlvbicgfHwgZmFsc2U7XG4gICAgfTtcbiAgfVxuXG4gIC8vIElzIGEgZ2l2ZW4gb2JqZWN0IGEgZmluaXRlIG51bWJlcj9cbiAgXy5pc0Zpbml0ZSA9IGZ1bmN0aW9uKG9iaikge1xuICAgIHJldHVybiBpc0Zpbml0ZShvYmopICYmICFpc05hTihwYXJzZUZsb2F0KG9iaikpO1xuICB9O1xuXG4gIC8vIElzIHRoZSBnaXZlbiB2YWx1ZSBgTmFOYD8gKE5hTiBpcyB0aGUgb25seSBudW1iZXIgd2hpY2ggZG9lcyBub3QgZXF1YWwgaXRzZWxmKS5cbiAgXy5pc05hTiA9IGZ1bmN0aW9uKG9iaikge1xuICAgIHJldHVybiBfLmlzTnVtYmVyKG9iaikgJiYgb2JqICE9PSArb2JqO1xuICB9O1xuXG4gIC8vIElzIGEgZ2l2ZW4gdmFsdWUgYSBib29sZWFuP1xuICBfLmlzQm9vbGVhbiA9IGZ1bmN0aW9uKG9iaikge1xuICAgIHJldHVybiBvYmogPT09IHRydWUgfHwgb2JqID09PSBmYWxzZSB8fCB0b1N0cmluZy5jYWxsKG9iaikgPT09ICdbb2JqZWN0IEJvb2xlYW5dJztcbiAgfTtcblxuICAvLyBJcyBhIGdpdmVuIHZhbHVlIGVxdWFsIHRvIG51bGw/XG4gIF8uaXNOdWxsID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgcmV0dXJuIG9iaiA9PT0gbnVsbDtcbiAgfTtcblxuICAvLyBJcyBhIGdpdmVuIHZhcmlhYmxlIHVuZGVmaW5lZD9cbiAgXy5pc1VuZGVmaW5lZCA9IGZ1bmN0aW9uKG9iaikge1xuICAgIHJldHVybiBvYmogPT09IHZvaWQgMDtcbiAgfTtcblxuICAvLyBTaG9ydGN1dCBmdW5jdGlvbiBmb3IgY2hlY2tpbmcgaWYgYW4gb2JqZWN0IGhhcyBhIGdpdmVuIHByb3BlcnR5IGRpcmVjdGx5XG4gIC8vIG9uIGl0c2VsZiAoaW4gb3RoZXIgd29yZHMsIG5vdCBvbiBhIHByb3RvdHlwZSkuXG4gIF8uaGFzID0gZnVuY3Rpb24ob2JqLCBrZXkpIHtcbiAgICByZXR1cm4gb2JqICE9IG51bGwgJiYgaGFzT3duUHJvcGVydHkuY2FsbChvYmosIGtleSk7XG4gIH07XG5cbiAgLy8gVXRpbGl0eSBGdW5jdGlvbnNcbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS1cblxuICAvLyBSdW4gVW5kZXJzY29yZS5qcyBpbiAqbm9Db25mbGljdCogbW9kZSwgcmV0dXJuaW5nIHRoZSBgX2AgdmFyaWFibGUgdG8gaXRzXG4gIC8vIHByZXZpb3VzIG93bmVyLiBSZXR1cm5zIGEgcmVmZXJlbmNlIHRvIHRoZSBVbmRlcnNjb3JlIG9iamVjdC5cbiAgXy5ub0NvbmZsaWN0ID0gZnVuY3Rpb24oKSB7XG4gICAgcm9vdC5fID0gcHJldmlvdXNVbmRlcnNjb3JlO1xuICAgIHJldHVybiB0aGlzO1xuICB9O1xuXG4gIC8vIEtlZXAgdGhlIGlkZW50aXR5IGZ1bmN0aW9uIGFyb3VuZCBmb3IgZGVmYXVsdCBpdGVyYXRlZXMuXG4gIF8uaWRlbnRpdHkgPSBmdW5jdGlvbih2YWx1ZSkge1xuICAgIHJldHVybiB2YWx1ZTtcbiAgfTtcblxuICAvLyBQcmVkaWNhdGUtZ2VuZXJhdGluZyBmdW5jdGlvbnMuIE9mdGVuIHVzZWZ1bCBvdXRzaWRlIG9mIFVuZGVyc2NvcmUuXG4gIF8uY29uc3RhbnQgPSBmdW5jdGlvbih2YWx1ZSkge1xuICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB9O1xuICB9O1xuXG4gIF8ubm9vcCA9IGZ1bmN0aW9uKCl7fTtcblxuICBfLnByb3BlcnR5ID0gZnVuY3Rpb24oa2V5KSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKG9iaikge1xuICAgICAgcmV0dXJuIG9iaiA9PSBudWxsID8gdm9pZCAwIDogb2JqW2tleV07XG4gICAgfTtcbiAgfTtcblxuICAvLyBHZW5lcmF0ZXMgYSBmdW5jdGlvbiBmb3IgYSBnaXZlbiBvYmplY3QgdGhhdCByZXR1cm5zIGEgZ2l2ZW4gcHJvcGVydHkuXG4gIF8ucHJvcGVydHlPZiA9IGZ1bmN0aW9uKG9iaikge1xuICAgIHJldHVybiBvYmogPT0gbnVsbCA/IGZ1bmN0aW9uKCl7fSA6IGZ1bmN0aW9uKGtleSkge1xuICAgICAgcmV0dXJuIG9ialtrZXldO1xuICAgIH07XG4gIH07XG5cbiAgLy8gUmV0dXJucyBhIHByZWRpY2F0ZSBmb3IgY2hlY2tpbmcgd2hldGhlciBhbiBvYmplY3QgaGFzIGEgZ2l2ZW4gc2V0IG9mIFxuICAvLyBga2V5OnZhbHVlYCBwYWlycy5cbiAgXy5tYXRjaGVyID0gXy5tYXRjaGVzID0gZnVuY3Rpb24oYXR0cnMpIHtcbiAgICBhdHRycyA9IF8uZXh0ZW5kT3duKHt9LCBhdHRycyk7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKG9iaikge1xuICAgICAgcmV0dXJuIF8uaXNNYXRjaChvYmosIGF0dHJzKTtcbiAgICB9O1xuICB9O1xuXG4gIC8vIFJ1biBhIGZ1bmN0aW9uICoqbioqIHRpbWVzLlxuICBfLnRpbWVzID0gZnVuY3Rpb24obiwgaXRlcmF0ZWUsIGNvbnRleHQpIHtcbiAgICB2YXIgYWNjdW0gPSBBcnJheShNYXRoLm1heCgwLCBuKSk7XG4gICAgaXRlcmF0ZWUgPSBvcHRpbWl6ZUNiKGl0ZXJhdGVlLCBjb250ZXh0LCAxKTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IG47IGkrKykgYWNjdW1baV0gPSBpdGVyYXRlZShpKTtcbiAgICByZXR1cm4gYWNjdW07XG4gIH07XG5cbiAgLy8gUmV0dXJuIGEgcmFuZG9tIGludGVnZXIgYmV0d2VlbiBtaW4gYW5kIG1heCAoaW5jbHVzaXZlKS5cbiAgXy5yYW5kb20gPSBmdW5jdGlvbihtaW4sIG1heCkge1xuICAgIGlmIChtYXggPT0gbnVsbCkge1xuICAgICAgbWF4ID0gbWluO1xuICAgICAgbWluID0gMDtcbiAgICB9XG4gICAgcmV0dXJuIG1pbiArIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIChtYXggLSBtaW4gKyAxKSk7XG4gIH07XG5cbiAgLy8gQSAocG9zc2libHkgZmFzdGVyKSB3YXkgdG8gZ2V0IHRoZSBjdXJyZW50IHRpbWVzdGFtcCBhcyBhbiBpbnRlZ2VyLlxuICBfLm5vdyA9IERhdGUubm93IHx8IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcbiAgfTtcblxuICAgLy8gTGlzdCBvZiBIVE1MIGVudGl0aWVzIGZvciBlc2NhcGluZy5cbiAgdmFyIGVzY2FwZU1hcCA9IHtcbiAgICAnJic6ICcmYW1wOycsXG4gICAgJzwnOiAnJmx0OycsXG4gICAgJz4nOiAnJmd0OycsXG4gICAgJ1wiJzogJyZxdW90OycsXG4gICAgXCInXCI6ICcmI3gyNzsnLFxuICAgICdgJzogJyYjeDYwOydcbiAgfTtcbiAgdmFyIHVuZXNjYXBlTWFwID0gXy5pbnZlcnQoZXNjYXBlTWFwKTtcblxuICAvLyBGdW5jdGlvbnMgZm9yIGVzY2FwaW5nIGFuZCB1bmVzY2FwaW5nIHN0cmluZ3MgdG8vZnJvbSBIVE1MIGludGVycG9sYXRpb24uXG4gIHZhciBjcmVhdGVFc2NhcGVyID0gZnVuY3Rpb24obWFwKSB7XG4gICAgdmFyIGVzY2FwZXIgPSBmdW5jdGlvbihtYXRjaCkge1xuICAgICAgcmV0dXJuIG1hcFttYXRjaF07XG4gICAgfTtcbiAgICAvLyBSZWdleGVzIGZvciBpZGVudGlmeWluZyBhIGtleSB0aGF0IG5lZWRzIHRvIGJlIGVzY2FwZWRcbiAgICB2YXIgc291cmNlID0gJyg/OicgKyBfLmtleXMobWFwKS5qb2luKCd8JykgKyAnKSc7XG4gICAgdmFyIHRlc3RSZWdleHAgPSBSZWdFeHAoc291cmNlKTtcbiAgICB2YXIgcmVwbGFjZVJlZ2V4cCA9IFJlZ0V4cChzb3VyY2UsICdnJyk7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKHN0cmluZykge1xuICAgICAgc3RyaW5nID0gc3RyaW5nID09IG51bGwgPyAnJyA6ICcnICsgc3RyaW5nO1xuICAgICAgcmV0dXJuIHRlc3RSZWdleHAudGVzdChzdHJpbmcpID8gc3RyaW5nLnJlcGxhY2UocmVwbGFjZVJlZ2V4cCwgZXNjYXBlcikgOiBzdHJpbmc7XG4gICAgfTtcbiAgfTtcbiAgXy5lc2NhcGUgPSBjcmVhdGVFc2NhcGVyKGVzY2FwZU1hcCk7XG4gIF8udW5lc2NhcGUgPSBjcmVhdGVFc2NhcGVyKHVuZXNjYXBlTWFwKTtcblxuICAvLyBJZiB0aGUgdmFsdWUgb2YgdGhlIG5hbWVkIGBwcm9wZXJ0eWAgaXMgYSBmdW5jdGlvbiB0aGVuIGludm9rZSBpdCB3aXRoIHRoZVxuICAvLyBgb2JqZWN0YCBhcyBjb250ZXh0OyBvdGhlcndpc2UsIHJldHVybiBpdC5cbiAgXy5yZXN1bHQgPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5LCBmYWxsYmFjaykge1xuICAgIHZhciB2YWx1ZSA9IG9iamVjdCA9PSBudWxsID8gdm9pZCAwIDogb2JqZWN0W3Byb3BlcnR5XTtcbiAgICBpZiAodmFsdWUgPT09IHZvaWQgMCkge1xuICAgICAgdmFsdWUgPSBmYWxsYmFjaztcbiAgICB9XG4gICAgcmV0dXJuIF8uaXNGdW5jdGlvbih2YWx1ZSkgPyB2YWx1ZS5jYWxsKG9iamVjdCkgOiB2YWx1ZTtcbiAgfTtcblxuICAvLyBHZW5lcmF0ZSBhIHVuaXF1ZSBpbnRlZ2VyIGlkICh1bmlxdWUgd2l0aGluIHRoZSBlbnRpcmUgY2xpZW50IHNlc3Npb24pLlxuICAvLyBVc2VmdWwgZm9yIHRlbXBvcmFyeSBET00gaWRzLlxuICB2YXIgaWRDb3VudGVyID0gMDtcbiAgXy51bmlxdWVJZCA9IGZ1bmN0aW9uKHByZWZpeCkge1xuICAgIHZhciBpZCA9ICsraWRDb3VudGVyICsgJyc7XG4gICAgcmV0dXJuIHByZWZpeCA/IHByZWZpeCArIGlkIDogaWQ7XG4gIH07XG5cbiAgLy8gQnkgZGVmYXVsdCwgVW5kZXJzY29yZSB1c2VzIEVSQi1zdHlsZSB0ZW1wbGF0ZSBkZWxpbWl0ZXJzLCBjaGFuZ2UgdGhlXG4gIC8vIGZvbGxvd2luZyB0ZW1wbGF0ZSBzZXR0aW5ncyB0byB1c2UgYWx0ZXJuYXRpdmUgZGVsaW1pdGVycy5cbiAgXy50ZW1wbGF0ZVNldHRpbmdzID0ge1xuICAgIGV2YWx1YXRlICAgIDogLzwlKFtcXHNcXFNdKz8pJT4vZyxcbiAgICBpbnRlcnBvbGF0ZSA6IC88JT0oW1xcc1xcU10rPyklPi9nLFxuICAgIGVzY2FwZSAgICAgIDogLzwlLShbXFxzXFxTXSs/KSU+L2dcbiAgfTtcblxuICAvLyBXaGVuIGN1c3RvbWl6aW5nIGB0ZW1wbGF0ZVNldHRpbmdzYCwgaWYgeW91IGRvbid0IHdhbnQgdG8gZGVmaW5lIGFuXG4gIC8vIGludGVycG9sYXRpb24sIGV2YWx1YXRpb24gb3IgZXNjYXBpbmcgcmVnZXgsIHdlIG5lZWQgb25lIHRoYXQgaXNcbiAgLy8gZ3VhcmFudGVlZCBub3QgdG8gbWF0Y2guXG4gIHZhciBub01hdGNoID0gLyguKV4vO1xuXG4gIC8vIENlcnRhaW4gY2hhcmFjdGVycyBuZWVkIHRvIGJlIGVzY2FwZWQgc28gdGhhdCB0aGV5IGNhbiBiZSBwdXQgaW50byBhXG4gIC8vIHN0cmluZyBsaXRlcmFsLlxuICB2YXIgZXNjYXBlcyA9IHtcbiAgICBcIidcIjogICAgICBcIidcIixcbiAgICAnXFxcXCc6ICAgICAnXFxcXCcsXG4gICAgJ1xccic6ICAgICAncicsXG4gICAgJ1xcbic6ICAgICAnbicsXG4gICAgJ1xcdTIwMjgnOiAndTIwMjgnLFxuICAgICdcXHUyMDI5JzogJ3UyMDI5J1xuICB9O1xuXG4gIHZhciBlc2NhcGVyID0gL1xcXFx8J3xcXHJ8XFxufFxcdTIwMjh8XFx1MjAyOS9nO1xuXG4gIHZhciBlc2NhcGVDaGFyID0gZnVuY3Rpb24obWF0Y2gpIHtcbiAgICByZXR1cm4gJ1xcXFwnICsgZXNjYXBlc1ttYXRjaF07XG4gIH07XG5cbiAgLy8gSmF2YVNjcmlwdCBtaWNyby10ZW1wbGF0aW5nLCBzaW1pbGFyIHRvIEpvaG4gUmVzaWcncyBpbXBsZW1lbnRhdGlvbi5cbiAgLy8gVW5kZXJzY29yZSB0ZW1wbGF0aW5nIGhhbmRsZXMgYXJiaXRyYXJ5IGRlbGltaXRlcnMsIHByZXNlcnZlcyB3aGl0ZXNwYWNlLFxuICAvLyBhbmQgY29ycmVjdGx5IGVzY2FwZXMgcXVvdGVzIHdpdGhpbiBpbnRlcnBvbGF0ZWQgY29kZS5cbiAgLy8gTkI6IGBvbGRTZXR0aW5nc2Agb25seSBleGlzdHMgZm9yIGJhY2t3YXJkcyBjb21wYXRpYmlsaXR5LlxuICBfLnRlbXBsYXRlID0gZnVuY3Rpb24odGV4dCwgc2V0dGluZ3MsIG9sZFNldHRpbmdzKSB7XG4gICAgaWYgKCFzZXR0aW5ncyAmJiBvbGRTZXR0aW5ncykgc2V0dGluZ3MgPSBvbGRTZXR0aW5ncztcbiAgICBzZXR0aW5ncyA9IF8uZGVmYXVsdHMoe30sIHNldHRpbmdzLCBfLnRlbXBsYXRlU2V0dGluZ3MpO1xuXG4gICAgLy8gQ29tYmluZSBkZWxpbWl0ZXJzIGludG8gb25lIHJlZ3VsYXIgZXhwcmVzc2lvbiB2aWEgYWx0ZXJuYXRpb24uXG4gICAgdmFyIG1hdGNoZXIgPSBSZWdFeHAoW1xuICAgICAgKHNldHRpbmdzLmVzY2FwZSB8fCBub01hdGNoKS5zb3VyY2UsXG4gICAgICAoc2V0dGluZ3MuaW50ZXJwb2xhdGUgfHwgbm9NYXRjaCkuc291cmNlLFxuICAgICAgKHNldHRpbmdzLmV2YWx1YXRlIHx8IG5vTWF0Y2gpLnNvdXJjZVxuICAgIF0uam9pbignfCcpICsgJ3wkJywgJ2cnKTtcblxuICAgIC8vIENvbXBpbGUgdGhlIHRlbXBsYXRlIHNvdXJjZSwgZXNjYXBpbmcgc3RyaW5nIGxpdGVyYWxzIGFwcHJvcHJpYXRlbHkuXG4gICAgdmFyIGluZGV4ID0gMDtcbiAgICB2YXIgc291cmNlID0gXCJfX3ArPSdcIjtcbiAgICB0ZXh0LnJlcGxhY2UobWF0Y2hlciwgZnVuY3Rpb24obWF0Y2gsIGVzY2FwZSwgaW50ZXJwb2xhdGUsIGV2YWx1YXRlLCBvZmZzZXQpIHtcbiAgICAgIHNvdXJjZSArPSB0ZXh0LnNsaWNlKGluZGV4LCBvZmZzZXQpLnJlcGxhY2UoZXNjYXBlciwgZXNjYXBlQ2hhcik7XG4gICAgICBpbmRleCA9IG9mZnNldCArIG1hdGNoLmxlbmd0aDtcblxuICAgICAgaWYgKGVzY2FwZSkge1xuICAgICAgICBzb3VyY2UgKz0gXCInK1xcbigoX190PShcIiArIGVzY2FwZSArIFwiKSk9PW51bGw/Jyc6Xy5lc2NhcGUoX190KSkrXFxuJ1wiO1xuICAgICAgfSBlbHNlIGlmIChpbnRlcnBvbGF0ZSkge1xuICAgICAgICBzb3VyY2UgKz0gXCInK1xcbigoX190PShcIiArIGludGVycG9sYXRlICsgXCIpKT09bnVsbD8nJzpfX3QpK1xcbidcIjtcbiAgICAgIH0gZWxzZSBpZiAoZXZhbHVhdGUpIHtcbiAgICAgICAgc291cmNlICs9IFwiJztcXG5cIiArIGV2YWx1YXRlICsgXCJcXG5fX3ArPSdcIjtcbiAgICAgIH1cblxuICAgICAgLy8gQWRvYmUgVk1zIG5lZWQgdGhlIG1hdGNoIHJldHVybmVkIHRvIHByb2R1Y2UgdGhlIGNvcnJlY3Qgb2ZmZXN0LlxuICAgICAgcmV0dXJuIG1hdGNoO1xuICAgIH0pO1xuICAgIHNvdXJjZSArPSBcIic7XFxuXCI7XG5cbiAgICAvLyBJZiBhIHZhcmlhYmxlIGlzIG5vdCBzcGVjaWZpZWQsIHBsYWNlIGRhdGEgdmFsdWVzIGluIGxvY2FsIHNjb3BlLlxuICAgIGlmICghc2V0dGluZ3MudmFyaWFibGUpIHNvdXJjZSA9ICd3aXRoKG9ianx8e30pe1xcbicgKyBzb3VyY2UgKyAnfVxcbic7XG5cbiAgICBzb3VyY2UgPSBcInZhciBfX3QsX19wPScnLF9faj1BcnJheS5wcm90b3R5cGUuam9pbixcIiArXG4gICAgICBcInByaW50PWZ1bmN0aW9uKCl7X19wKz1fX2ouY2FsbChhcmd1bWVudHMsJycpO307XFxuXCIgK1xuICAgICAgc291cmNlICsgJ3JldHVybiBfX3A7XFxuJztcblxuICAgIHRyeSB7XG4gICAgICB2YXIgcmVuZGVyID0gbmV3IEZ1bmN0aW9uKHNldHRpbmdzLnZhcmlhYmxlIHx8ICdvYmonLCAnXycsIHNvdXJjZSk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgZS5zb3VyY2UgPSBzb3VyY2U7XG4gICAgICB0aHJvdyBlO1xuICAgIH1cblxuICAgIHZhciB0ZW1wbGF0ZSA9IGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgIHJldHVybiByZW5kZXIuY2FsbCh0aGlzLCBkYXRhLCBfKTtcbiAgICB9O1xuXG4gICAgLy8gUHJvdmlkZSB0aGUgY29tcGlsZWQgc291cmNlIGFzIGEgY29udmVuaWVuY2UgZm9yIHByZWNvbXBpbGF0aW9uLlxuICAgIHZhciBhcmd1bWVudCA9IHNldHRpbmdzLnZhcmlhYmxlIHx8ICdvYmonO1xuICAgIHRlbXBsYXRlLnNvdXJjZSA9ICdmdW5jdGlvbignICsgYXJndW1lbnQgKyAnKXtcXG4nICsgc291cmNlICsgJ30nO1xuXG4gICAgcmV0dXJuIHRlbXBsYXRlO1xuICB9O1xuXG4gIC8vIEFkZCBhIFwiY2hhaW5cIiBmdW5jdGlvbi4gU3RhcnQgY2hhaW5pbmcgYSB3cmFwcGVkIFVuZGVyc2NvcmUgb2JqZWN0LlxuICBfLmNoYWluID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgdmFyIGluc3RhbmNlID0gXyhvYmopO1xuICAgIGluc3RhbmNlLl9jaGFpbiA9IHRydWU7XG4gICAgcmV0dXJuIGluc3RhbmNlO1xuICB9O1xuXG4gIC8vIE9PUFxuICAvLyAtLS0tLS0tLS0tLS0tLS1cbiAgLy8gSWYgVW5kZXJzY29yZSBpcyBjYWxsZWQgYXMgYSBmdW5jdGlvbiwgaXQgcmV0dXJucyBhIHdyYXBwZWQgb2JqZWN0IHRoYXRcbiAgLy8gY2FuIGJlIHVzZWQgT08tc3R5bGUuIFRoaXMgd3JhcHBlciBob2xkcyBhbHRlcmVkIHZlcnNpb25zIG9mIGFsbCB0aGVcbiAgLy8gdW5kZXJzY29yZSBmdW5jdGlvbnMuIFdyYXBwZWQgb2JqZWN0cyBtYXkgYmUgY2hhaW5lZC5cblxuICAvLyBIZWxwZXIgZnVuY3Rpb24gdG8gY29udGludWUgY2hhaW5pbmcgaW50ZXJtZWRpYXRlIHJlc3VsdHMuXG4gIHZhciByZXN1bHQgPSBmdW5jdGlvbihpbnN0YW5jZSwgb2JqKSB7XG4gICAgcmV0dXJuIGluc3RhbmNlLl9jaGFpbiA/IF8ob2JqKS5jaGFpbigpIDogb2JqO1xuICB9O1xuXG4gIC8vIEFkZCB5b3VyIG93biBjdXN0b20gZnVuY3Rpb25zIHRvIHRoZSBVbmRlcnNjb3JlIG9iamVjdC5cbiAgXy5taXhpbiA9IGZ1bmN0aW9uKG9iaikge1xuICAgIF8uZWFjaChfLmZ1bmN0aW9ucyhvYmopLCBmdW5jdGlvbihuYW1lKSB7XG4gICAgICB2YXIgZnVuYyA9IF9bbmFtZV0gPSBvYmpbbmFtZV07XG4gICAgICBfLnByb3RvdHlwZVtuYW1lXSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgYXJncyA9IFt0aGlzLl93cmFwcGVkXTtcbiAgICAgICAgcHVzaC5hcHBseShhcmdzLCBhcmd1bWVudHMpO1xuICAgICAgICByZXR1cm4gcmVzdWx0KHRoaXMsIGZ1bmMuYXBwbHkoXywgYXJncykpO1xuICAgICAgfTtcbiAgICB9KTtcbiAgfTtcblxuICAvLyBBZGQgYWxsIG9mIHRoZSBVbmRlcnNjb3JlIGZ1bmN0aW9ucyB0byB0aGUgd3JhcHBlciBvYmplY3QuXG4gIF8ubWl4aW4oXyk7XG5cbiAgLy8gQWRkIGFsbCBtdXRhdG9yIEFycmF5IGZ1bmN0aW9ucyB0byB0aGUgd3JhcHBlci5cbiAgXy5lYWNoKFsncG9wJywgJ3B1c2gnLCAncmV2ZXJzZScsICdzaGlmdCcsICdzb3J0JywgJ3NwbGljZScsICd1bnNoaWZ0J10sIGZ1bmN0aW9uKG5hbWUpIHtcbiAgICB2YXIgbWV0aG9kID0gQXJyYXlQcm90b1tuYW1lXTtcbiAgICBfLnByb3RvdHlwZVtuYW1lXSA9IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIG9iaiA9IHRoaXMuX3dyYXBwZWQ7XG4gICAgICBtZXRob2QuYXBwbHkob2JqLCBhcmd1bWVudHMpO1xuICAgICAgaWYgKChuYW1lID09PSAnc2hpZnQnIHx8IG5hbWUgPT09ICdzcGxpY2UnKSAmJiBvYmoubGVuZ3RoID09PSAwKSBkZWxldGUgb2JqWzBdO1xuICAgICAgcmV0dXJuIHJlc3VsdCh0aGlzLCBvYmopO1xuICAgIH07XG4gIH0pO1xuXG4gIC8vIEFkZCBhbGwgYWNjZXNzb3IgQXJyYXkgZnVuY3Rpb25zIHRvIHRoZSB3cmFwcGVyLlxuICBfLmVhY2goWydjb25jYXQnLCAnam9pbicsICdzbGljZSddLCBmdW5jdGlvbihuYW1lKSB7XG4gICAgdmFyIG1ldGhvZCA9IEFycmF5UHJvdG9bbmFtZV07XG4gICAgXy5wcm90b3R5cGVbbmFtZV0gPSBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiByZXN1bHQodGhpcywgbWV0aG9kLmFwcGx5KHRoaXMuX3dyYXBwZWQsIGFyZ3VtZW50cykpO1xuICAgIH07XG4gIH0pO1xuXG4gIC8vIEV4dHJhY3RzIHRoZSByZXN1bHQgZnJvbSBhIHdyYXBwZWQgYW5kIGNoYWluZWQgb2JqZWN0LlxuICBfLnByb3RvdHlwZS52YWx1ZSA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLl93cmFwcGVkO1xuICB9O1xuXG4gIC8vIFByb3ZpZGUgdW53cmFwcGluZyBwcm94eSBmb3Igc29tZSBtZXRob2RzIHVzZWQgaW4gZW5naW5lIG9wZXJhdGlvbnNcbiAgLy8gc3VjaCBhcyBhcml0aG1ldGljIGFuZCBKU09OIHN0cmluZ2lmaWNhdGlvbi5cbiAgXy5wcm90b3R5cGUudmFsdWVPZiA9IF8ucHJvdG90eXBlLnRvSlNPTiA9IF8ucHJvdG90eXBlLnZhbHVlO1xuICBcbiAgXy5wcm90b3R5cGUudG9TdHJpbmcgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gJycgKyB0aGlzLl93cmFwcGVkO1xuICB9O1xuXG4gIC8vIEFNRCByZWdpc3RyYXRpb24gaGFwcGVucyBhdCB0aGUgZW5kIGZvciBjb21wYXRpYmlsaXR5IHdpdGggQU1EIGxvYWRlcnNcbiAgLy8gdGhhdCBtYXkgbm90IGVuZm9yY2UgbmV4dC10dXJuIHNlbWFudGljcyBvbiBtb2R1bGVzLiBFdmVuIHRob3VnaCBnZW5lcmFsXG4gIC8vIHByYWN0aWNlIGZvciBBTUQgcmVnaXN0cmF0aW9uIGlzIHRvIGJlIGFub255bW91cywgdW5kZXJzY29yZSByZWdpc3RlcnNcbiAgLy8gYXMgYSBuYW1lZCBtb2R1bGUgYmVjYXVzZSwgbGlrZSBqUXVlcnksIGl0IGlzIGEgYmFzZSBsaWJyYXJ5IHRoYXQgaXNcbiAgLy8gcG9wdWxhciBlbm91Z2ggdG8gYmUgYnVuZGxlZCBpbiBhIHRoaXJkIHBhcnR5IGxpYiwgYnV0IG5vdCBiZSBwYXJ0IG9mXG4gIC8vIGFuIEFNRCBsb2FkIHJlcXVlc3QuIFRob3NlIGNhc2VzIGNvdWxkIGdlbmVyYXRlIGFuIGVycm9yIHdoZW4gYW5cbiAgLy8gYW5vbnltb3VzIGRlZmluZSgpIGlzIGNhbGxlZCBvdXRzaWRlIG9mIGEgbG9hZGVyIHJlcXVlc3QuXG4gIGlmICh0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpIHtcbiAgICBkZWZpbmUoJ3VuZGVyc2NvcmUnLCBbXSwgZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gXztcbiAgICB9KTtcbiAgfVxufS5jYWxsKHRoaXMpKTtcbiIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSBhbmd1bGFyLm1vZHVsZSgnZmxpY2tyRHVwRmluZGVyQ29uZmlnJywgW10pXG4gIC5jb25zdGFudCgnT0FVVEhEX1VSTCcsICdodHRwczovL29hdXRoZC1sZWZhbnQuaGVyb2t1YXBwLmNvbScpXG4gIC5jb25zdGFudCgnQVBQX1BVQkxJQ19LRVknLCAnUXFTeEM5RnBYNVFzZlJoR1BwZjY4dzJnTFJFJykgLy9vYXV0aGQtbGVmYW50XG4gIC8vLmNvbnN0YW50KCdPQVVUSERfVVJMJywgJ2h0dHA6Ly9vYXV0aC5pbycpXG4gIC8vLmNvbnN0YW50KCdBUFBfUFVCTElDX0tFWScsICdjRjRnT2JsRVVwdWVUdHNMNDQtZ1ZqWmVlWE0nKSAvL29hdXRoLmlvXG4iLCIndXNlIHN0cmljdCc7XG5cbnJlcXVpcmUoJy4vLi4vLi4vYm93ZXJfY29tcG9uZW50cy91aS5ib290c3RyYXAvc3JjL3BhZ2luYXRpb24vcGFnaW5hdGlvbicpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGFuZ3VsYXIubW9kdWxlKFxuICAnZmxpY2tyRHVwRmluZGVyQ29udHJvbGxlcnMnLFxuICBbJ3VpLmJvb3RzdHJhcC5wYWdpbmF0aW9uJyxcbiAgIHJlcXVpcmUoJy4vY29uZmlnJykubmFtZSxcbiAgIHJlcXVpcmUoJy4vc2VydmljZXMnKS5uYW1lXSlcbiAgLmNvbnRyb2xsZXIoXG4gICAgJ3N0YXJ0Q3RybCcsXG4gICAgWyckaHR0cCcsICdPQVVUSERfVVJMJywgJyRsb2cnLCBmdW5jdGlvbigkaHR0cCwgT0FVVEhEX1VSTCwgJGxvZykge1xuICAgICAgJGh0dHAuZ2V0KE9BVVRIRF9VUkwgKyAnL2F1dGgvZmxpY2tyJykuc3VjY2VzcyhmdW5jdGlvbihzdWNjZXNzKSB7XG4gICAgICAgICRsb2cuZGVidWcoXCJvYXV0aGQgcGluZyBzdWNjZXNzZnVsOlwiLCBzdWNjZXNzKTtcbiAgICAgIH0pO1xuICAgIH1dKVxuICAuY29udHJvbGxlcihcbiAgICAncGhvdG9DdHJsJyxcbiAgICBbJyRzY29wZScsICckbG9nJywgJ0ZsaWNrcicsIGZ1bmN0aW9uKCRzY29wZSwgJGxvZywgRmxpY2tyKSB7XG4gICAgICB2YXIgXyA9IHJlcXVpcmUoXCIuLy4uLy4uL2Jvd2VyX2NvbXBvbmVudHMvdW5kZXJzY29yZS91bmRlcnNjb3JlLmpzXCIpO1xuICAgICAgdmFyIHNwZWNpYWxUYWcgPSAnZmxpY2tyZHVwZmluZGVyJztcbiAgICAgICRzY29wZS5pdGVtc1BlclBhZ2UgPSAxNjtcbiAgICAgICRzY29wZS5tYXhTaXplID0gMTA7XG5cbiAgICAgICRzY29wZS50b2dnbGVUYWcgPSBmdW5jdGlvbihwaG90bykge1xuICAgICAgICBpZiAocGhvdG8uZHVwbGljYXRlKSB7XG4gICAgICAgICAgcmVtb3ZlVGFnKHBob3RvKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBhZGRUYWcocGhvdG8pO1xuICAgICAgICB9XG4gICAgICB9O1xuXG4gICAgICBmdW5jdGlvbiBhZGRUYWcocGhvdG8pIHtcbiAgICAgICAgcGhvdG8uaW5GbGlnaHQgPSB0cnVlO1xuICAgICAgICBGbGlja3IuZ2V0KHtcbiAgICAgICAgICBtZXRob2Q6ICdmbGlja3IucGhvdG9zLmFkZFRhZ3MnLFxuICAgICAgICAgIHBob3RvX2lkOiBwaG90by5pZCxcbiAgICAgICAgICB0YWdzOiBzcGVjaWFsVGFnXG4gICAgICAgIH0sIGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHBob3RvLmR1cGxpY2F0ZSA9IHRydWU7XG4gICAgICAgICAgcGhvdG8uaW5GbGlnaHQgPSBmYWxzZTtcbiAgICAgICAgfSk7XG4gICAgICB9O1xuXG4gICAgICBmdW5jdGlvbiByZW1vdmVUYWcocGhvdG8pIHtcbiAgICAgICAgcGhvdG8uaW5GbGlnaHQgPSB0cnVlO1xuICAgICAgICBGbGlja3IuZ2V0KHtcbiAgICAgICAgICBtZXRob2Q6ICdmbGlja3IucGhvdG9zLmdldEluZm8nLFxuICAgICAgICAgIHBob3RvX2lkOiBwaG90by5pZFxuICAgICAgICB9LCBmdW5jdGlvbihpbmZvKSB7XG4gICAgICAgICAgdmFyIHRhZyA9XG4gICAgICAgICAgICBfLmZpbmQoaW5mby5waG90by50YWdzLnRhZywgZnVuY3Rpb24odGFnKSB7XG4gICAgICAgICAgICAgIHJldHVybiB0YWcucmF3ID09PSBzcGVjaWFsVGFnO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgaWYgKHRhZykge1xuICAgICAgICAgICAgRmxpY2tyLmdldCh7XG4gICAgICAgICAgICAgIG1ldGhvZDogJ2ZsaWNrci5waG90b3MucmVtb3ZlVGFnJyxcbiAgICAgICAgICAgICAgcGhvdG9faWQ6IHBob3RvLmlkLFxuICAgICAgICAgICAgICB0YWdfaWQ6IHRhZy5pZFxuICAgICAgICAgICAgfSwgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgIHBob3RvLmR1cGxpY2F0ZSA9IGZhbHNlO1xuICAgICAgICAgICAgICBwaG90by5pbkZsaWdodCA9IGZhbHNlO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHBob3RvLmluRmxpZ2h0ID0gZmFsc2U7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH07XG5cbiAgICAgICRzY29wZS5hdXRvVGFnID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIF8ubWFwKCRzY29wZS52aXNpYmxlR3JvdXBzLCBmdW5jdGlvbihncm91cCkge1xuICAgICAgICAgIF8ubWFwKF8ucmVzdChncm91cCksIGFkZFRhZyk7XG4gICAgICAgIH0pXG4gICAgICB9O1xuXG4gICAgICBmdW5jdGlvbiBoYXNNYXhEYXRlVGFrZW5HcmFudWxhcml0eShwaG90bykge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgLy9yZXR1cm4gcGhvdG8uZGF0ZXRha2VuZ3JhbnVsYXJpdHkgPT0gXCIwXCI7XG4gICAgICB9XG5cbiAgICAgIGZ1bmN0aW9uIHVwZGF0ZUR1cGxpY2F0ZVN0YXRlKHBob3RvKSB7XG4gICAgICAgIHBob3RvWydkdXBsaWNhdGUnXSA9IF8uY29udGFpbnMocGhvdG8udGFncy5zcGxpdCgvIC8pLCBzcGVjaWFsVGFnKTtcbiAgICAgICAgcmV0dXJuIHBob3RvO1xuICAgICAgfVxuXG4gICAgICBmdW5jdGlvbiBmaW5nZXJwcmludChwaG90bykge1xuICAgICAgICByZXR1cm4gcGhvdG8uZGF0ZXRha2VuICsgJyMjJyArIHBob3RvLnRpdGxlLnJlcGxhY2UoLy1bMC05XSQvLCAnJyk7XG4gICAgICB9XG5cbiAgICAgIGZ1bmN0aW9uIGF0TGVhc3RUd28oZ3JvdXApIHtcbiAgICAgICAgcmV0dXJuIGdyb3VwLmxlbmd0aCA+IDE7XG4gICAgICB9XG5cbiAgICAgIGZ1bmN0aW9uIGdyb3VwRHVwbGljYXRlcyhwaG90b3MpIHtcbiAgICAgICAgdmFyIGdyb3VwcyA9IF8uZ3JvdXBCeShwaG90b3MsIGZpbmdlcnByaW50KTtcbiAgICAgICAgdmFyIGdyb3VwczIgPSBfLmZpbHRlcihncm91cHMsIGF0TGVhc3RUd28pO1xuICAgICAgICAkc2NvcGUuZ3JvdXBzID0gZ3JvdXBzMjtcbiAgICAgICAgdXBkYXRlVmlzaWJsZUdyb3VwcygpXG4gICAgICB9XG5cbiAgICAgIGZ1bmN0aW9uIGdldFBhZ2UocGFnZSwgcGhvdG9zQWNjKSB7XG4gICAgICAgICRzY29wZS5wYWdlID0gcGFnZTtcbiAgICAgICAgRmxpY2tyLmdldCh7XG4gICAgICAgICAgbWV0aG9kOiBcImZsaWNrci5waG90b3Muc2VhcmNoXCIsXG4gICAgICAgICAgcGFnZTogcGFnZSxcbiAgICAgICAgICBwZXJfcGFnZTogNTAwLFxuICAgICAgICAgIHNvcnQ6ICdkYXRlLXRha2VuLWFzYyd9LCBmdW5jdGlvbihyZXN1bHQpIHtcbiAgICAgICAgICAgICRzY29wZS50b3RhbFBhZ2VzID0gcmVzdWx0LnBob3Rvcy5wYWdlcztcbiAgICAgICAgICAgIHZhciByZXN1bHRQaG90b3MgPSByZXN1bHQucGhvdG9zLnBob3RvO1xuICAgICAgICAgICAgdmFyIGZpbHRlcmVkUmVzdWx0UGhvdG9zID1cbiAgICAgICAgICAgICAgXy5maWx0ZXIocmVzdWx0UGhvdG9zLCBoYXNNYXhEYXRlVGFrZW5HcmFudWxhcml0eSk7XG4gICAgICAgICAgICB2YXIgdXBkYXRlZFJlc3VsdFBob3RvcyA9XG4gICAgICAgICAgICAgIF8ubWFwKGZpbHRlcmVkUmVzdWx0UGhvdG9zLCB1cGRhdGVEdXBsaWNhdGVTdGF0ZSk7XG4gICAgICAgICAgICB2YXIgcGhvdG9zQWNjMiA9IHBob3Rvc0FjYy5jb25jYXQodXBkYXRlZFJlc3VsdFBob3Rvcyk7XG4gICAgICAgICAgICBpZiAocGFnZSA8IHJlc3VsdC5waG90b3MucGFnZXMpIHtcbiAgICAgICAgICAgICAgZ2V0UGFnZShwYWdlICsgMSwgcGhvdG9zQWNjMik7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAkc2NvcGUuaW5pdGlhbERvd25sb2FkID0gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBncm91cER1cGxpY2F0ZXMocGhvdG9zQWNjMik7XG4gICAgICAgICAgfSk7XG4gICAgICB9XG5cbiAgICAgIGZ1bmN0aW9uIHVwZGF0ZVZpc2libGVHcm91cHMoKSB7XG4gICAgICAgICRzY29wZS50b3RhbEl0ZW1zID0gXy5zaXplKCRzY29wZS5ncm91cHMpO1xuICAgICAgICB2YXIgZmlyc3QgPSAoKCRzY29wZS5jdXJyZW50UGFnZSAtIDEpICogJHNjb3BlLml0ZW1zUGVyUGFnZSk7XG4gICAgICAgIHZhciBsYXN0ID0gJHNjb3BlLmN1cnJlbnRQYWdlICogJHNjb3BlLml0ZW1zUGVyUGFnZTtcbiAgICAgICAgJHNjb3BlLnZpc2libGVHcm91cHMgPVxuICAgICAgICAgIF8ucGljaygkc2NvcGUuZ3JvdXBzLCBfLmtleXMoJHNjb3BlLmdyb3Vwcykuc2xpY2UoZmlyc3QsIGxhc3QpKTtcbiAgICAgIH1cblxuICAgICAgJHNjb3BlLnBhZ2VDaGFuZ2VkID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHVwZGF0ZVZpc2libGVHcm91cHMoKVxuICAgICAgfTtcblxuICAgICAgJHNjb3BlLnRvdGFsSXRlbXMgPSAwO1xuICAgICAgJHNjb3BlLmN1cnJlbnRQYWdlID0gMTtcbiAgICAgICRzY29wZS5pbml0aWFsRG93bmxvYWQgPSB0cnVlO1xuICAgICAgZ2V0UGFnZSgxLCBbXSk7XG4gICAgfV0pO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGFuZ3VsYXIubW9kdWxlKCdPQXV0aCcsIFtdKVxuICAuZmFjdG9yeSgnT0F1dGgnLCBbJyR3aW5kb3cnLCAnJGxvZycsIGZ1bmN0aW9uKCR3aW5kb3csICRsb2cpIHtcbiAgcmVxdWlyZShcIi4vLi4vLi4vYm93ZXJfY29tcG9uZW50cy9vYXV0aC1qcy9kaXN0L29hdXRoLm1pbi5qc1wiKTtcbiAgcmV0dXJuICR3aW5kb3cuT0F1dGg7XG59XSk7XG4iLCIndXNlIHN0cmljdCc7XG5cbnJlcXVpcmUoXCIuLy4uLy4uL2Jvd2VyX2NvbXBvbmVudHMvYW5ndWxhci1yZXNvdXJjZS9hbmd1bGFyLXJlc291cmNlLmpzXCIpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGFuZ3VsYXIubW9kdWxlKFxuICAnZmxpY2tyRHVwRmluZGVyU2VydmljZXMnLFxuICBbJ25nUmVzb3VyY2UnLCByZXF1aXJlKCcuL2NvbmZpZycpLm5hbWUsIHJlcXVpcmUoJy4vb2F1dGgtc2hpbScpLm5hbWVdKVxuICAuc2VydmljZShcbiAgICAnRmxpY2tyJyxcbiAgICBbJyRsb2cnLCAnJHJlc291cmNlJywgJyRodHRwJywgJyRxJywgJyRsb2NhdGlvbicsICdPQXV0aCcsICdPQVVUSERfVVJMJywgJ0FQUF9QVUJMSUNfS0VZJyxcbiAgICAgZnVuY3Rpb24oXG4gICAgICAgJGxvZywgJHJlc291cmNlLCAkaHR0cCwgJHEsICRsb2NhdGlvbiwgT0F1dGgsIE9BVVRIRF9VUkwsIEFQUF9QVUJMSUNfS0VZKSB7XG4gICAgICAgaWYgKCRsb2NhdGlvbi5oYXNoKCkgPT09ICcnKSB7ICRsb2NhdGlvbi5wYXRoKCcvcGhvdG9zJyk7IH0gLy9zbyByZWRpcmVjdCB0byBhYnNVcmwoKSB3b3Jrc1xuICAgICAgIE9BdXRoLmluaXRpYWxpemUoQVBQX1BVQkxJQ19LRVksIHtjYWNoZTogdHJ1ZX0pO1xuICAgICAgIE9BdXRoLnNldE9BdXRoZFVSTChPQVVUSERfVVJMKTtcbiAgICAgICB2YXIgcmVzb3VyY2UgPSAkcS5kZWZlcigpO1xuICAgICAgIGZ1bmN0aW9uIGRvbmVIYW5kbGVyKHJlc3VsdCkge1xuICAgICAgICAgdmFyIGtleSA9IEFQUF9QVUJMSUNfS0VZO1xuICAgICAgICAgdmFyIG9hdXRoaW8gPSAnaz0nICsga2V5O1xuICAgICAgICAgb2F1dGhpbyArPSAnJm9hdXRodj0xJztcbiAgICAgICAgIGZ1bmN0aW9uIGt2X3Jlc3VsdChrZXkpIHtcbiAgICAgICAgICAgcmV0dXJuICcmJytrZXkrJz0nK2VuY29kZVVSSUNvbXBvbmVudChyZXN1bHRba2V5XSk7XG4gICAgICAgICB9XG4gICAgICAgICBvYXV0aGlvICs9IGt2X3Jlc3VsdCgnb2F1dGhfdG9rZW4nKTtcbiAgICAgICAgIG9hdXRoaW8gKz0ga3ZfcmVzdWx0KCdvYXV0aF90b2tlbl9zZWNyZXQnKTtcbiAgICAgICAgIG9hdXRoaW8gKz0ga3ZfcmVzdWx0KCdjb2RlJyk7XG4gICAgICAgICAkaHR0cC5kZWZhdWx0cy5oZWFkZXJzLmNvbW1vbiA9IHtvYXV0aGlvOiBvYXV0aGlvfTtcbiAgICAgICAgIHJlc291cmNlLnJlc29sdmUoXG4gICAgICAgICAgICRyZXNvdXJjZShcbiAgICAgICAgICAgICBPQVVUSERfVVJMICsgJy9yZXF1ZXN0L2ZsaWNrci9zZXJ2aWNlcy9yZXN0LycsXG4gICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgbWV0aG9kOiBcImZsaWNrci5waG90b3Muc2VhcmNoXCIsXG4gICAgICAgICAgICAgICBmb3JtYXQ6IFwianNvblwiLFxuICAgICAgICAgICAgICAgdXNlcl9pZDogXCJtZVwiLFxuICAgICAgICAgICAgICAgcGVyX3BhZ2U6IDEwLFxuICAgICAgICAgICAgICAgc29ydDogJ2RhdGUtdGFrZW4tYXNjJyxcbiAgICAgICAgICAgICAgIC8vdGV4dDogXCJ2aXNpb246b3V0ZG9vclwiLFxuICAgICAgICAgICAgICAgLy90YWdzOiBcInZpc2lvbjpvdXRkb29yLHZpc2lvbjpvdXRkb29yPTA5OVwiLFxuICAgICAgICAgICAgICAgLy9tYWNoaW5lX3RhZ3M6IFwib3V0ZG9vclwiLFxuICAgICAgICAgICAgICAgZXh0cmFzOiBcImRhdGVfdXBsb2FkLGRhdGVfdGFrZW4sdGFnc1wiLFxuICAgICAgICAgICAgICAgbm9qc29uY2FsbGJhY2s6IDFcbiAgICAgICAgICAgICB9KSk7XG4gICAgICAgfVxuXG4gICAgICAgdmFyIG9hdXRoQ2FsbGJhY2sgPSBPQXV0aC5jYWxsYmFjaygnZmxpY2tyJyk7XG4gICAgICAgaWYgKG9hdXRoQ2FsbGJhY2spIHtcbiAgICAgICAgIG9hdXRoQ2FsbGJhY2suZG9uZShkb25lSGFuZGxlcikuZmFpbChmdW5jdGlvbihjYWxsYmFja0Vycm9yKSB7XG4gICAgICAgICAgICRsb2cuZGVidWcoJ09BdXRoLmNhbGxiYWNrIGVycm9yOiAnLCBjYWxsYmFja0Vycm9yKTtcbiAgICAgICAgIH0pO1xuICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAvLyB0aGUgY2FsbGJhY2sgdXJsIG11c3QgYmUgcm91dGVkIHRocm91Z2ggLm90aGVyd2lzZSBpbiB0aGUgYXBwIHJvdXRlclxuICAgICAgICAgT0F1dGgucmVkaXJlY3QoJ2ZsaWNrcicsICRsb2NhdGlvbi5hYnNVcmwoKSk7XG4gICAgICAgfVxuICAgICAgIHJldHVybiByZXNvdXJjZS5wcm9taXNlO1xuICAgICB9XSk7XG4iXX0=
