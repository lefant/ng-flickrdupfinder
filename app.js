(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"./src/javascript/app.js":[function(require,module,exports){
'use strict';

require("./../../bower_components/angular-route/angular-route.js");

angular.module('flickrDupFinder', ['ngRoute', require('./controllers').name])
  .config(
    ['$locationProvider', '$routeProvider',
     function($locationProvider, $routeProvider) {
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
 * @license AngularJS v1.2.24
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

  angular.forEach(dst, function(value, key){
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
 * @param {Object.<Object>=} actions Hash with declaration of custom action that should extend
 *   the default set of resource actions. The declaration should be created in the format of {@link
 *   ng.$http#usage_parameters $http.config}:
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
 *   - **`transformResponse`** –
 *     `{function(data, headersGetter)|Array.<function(data, headersGetter)>}` –
 *     transform function or an array of such functions. The transform function takes the http
 *     response body and headers and returns its transformed (typically deserialized) version.
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
  factory('$resource', ['$http', '$q', function($http, $q) {

    var DEFAULT_ACTIONS = {
      'get':    {method:'GET'},
      'save':   {method:'POST'},
      'query':  {method:'GET', isArray:true},
      'remove': {method:'DELETE'},
      'delete': {method:'DELETE'}
    };
    var noop = angular.noop,
        forEach = angular.forEach,
        extend = angular.extend,
        copy = angular.copy,
        isFunction = angular.isFunction;

    /**
     * We need our custom method because encodeURIComponent is too aggressive and doesn't follow
     * http://www.ietf.org/rfc/rfc3986.txt with regards to the character set (pchar) allowed in path
     * segments:
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
      this.defaults = defaults || {};
      this.urlParams = {};
    }

    Route.prototype = {
      setUrlParams: function(config, params, actionUrl) {
        var self = this,
            url = actionUrl || self.template,
            val,
            encodedVal;

        var urlParams = self.urlParams = {};
        forEach(url.split(/\W/), function(param){
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
        forEach(self.urlParams, function(_, urlParam){
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

        // strip trailing slashes and set the url
        url = url.replace(/\/+$/, '') || '/';
        // then replace collapse `/.` if found in the last URL path segment before the query
        // E.g. `http://url.com/id./format?q=x` becomes `http://url.com/id.format?q=x`
        url = url.replace(/\/\.(?=\w+($|\?))/, '.');
        // replace escaped `/\.` with `/.`
        config.url = url.replace(/\/\\\./, '/.');


        // set params - delegate param encoding to $http
        forEach(params, function(value, key){
          if (!self.urlParams[key]) {
            config.params = config.params || {};
            config.params[key] = value;
          }
        });
      }
    };


    function resourceFactory(url, paramDefaults, actions) {
      var route = new Route(url);

      actions = extend({}, DEFAULT_ACTIONS, actions);

      function extractParams(data, actionParams){
        var ids = {};
        actionParams = extend({}, paramDefaults, actionParams);
        forEach(actionParams, function(value, key){
          if (isFunction(value)) { value = value(); }
          ids[key] = value && value.charAt && value.charAt(0) == '@' ?
            lookupDottedPath(data, value.substr(1)) : value;
        });
        return ids;
      }

      function defaultResponseInterceptor(response) {
        return response.resource;
      }

      function Resource(value){
        shallowClearAndCopy(value || {}, this);
      }

      forEach(actions, function(action, name) {
        var hasBody = /^(POST|PUT|PATCH)$/i.test(action.method);

        Resource[name] = function(a1, a2, a3, a4) {
          var params = {}, data, success, error;

          /* jshint -W086 */ /* (purposefully fall through case statements) */
          switch(arguments.length) {
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

          var promise = $http(httpConfig).then(function (response) {
            var data = response.data,
              promise = value.$promise;

            if (data) {
              // Need to convert action.isArray to boolean in case it is undefined
              // jshint -W018
              if (angular.isArray(data) !== (!!action.isArray)) {
                throw $resourceMinErr('badcfg',
                    'Error in resource configuration. Expected ' +
                    'response to contain an {0} but got an {1}',
                  action.isArray ? 'array' : 'object',
                  angular.isArray(data) ? 'array' : 'object');
              }
              // jshint +W018
              if (action.isArray) {
                value.length = 0;
                forEach(data, function (item) {
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

            (error||noop)(response);

            return $q.reject(response);
          });

          promise = promise.then(
              function(response) {
                var value = responseInterceptor(response);
                (success||noop)(value, response.headers);
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

      Resource.bind = function(additionalParamDefaults){
        return resourceFactory(url, extend({}, paramDefaults, additionalParamDefaults), actions);
      };

      return Resource;
    }

    return resourceFactory;
  }]);


})(window, window.angular);

},{}],"/home/travis/build/lefant/ng-flickrdupfinder/bower_components/angular-route/angular-route.js":[function(require,module,exports){
/**
 * @license AngularJS v1.2.24
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
                        provider('$route', $RouteProvider);

/**
 * @ngdoc provider
 * @name $routeProvider
 * @kind function
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
function $RouteProvider(){
  function inherit(parent, extra) {
    return angular.extend(new (angular.extend(function() {}, {prototype:parent}))(), extra);
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
    routes[path] = angular.extend(
      {reloadOnSearch: true},
      route,
      path && pathRegExp(path, route)
    );

    // create redirection for trailing slashes
    if (path) {
      var redirectPath = (path[path.length-1] == '/')
            ? path.substr(0, path.length-1)
            : path +'/';

      routes[redirectPath] = angular.extend(
        {redirectTo: path},
        pathRegExp(redirectPath, route)
      );
    }

    return this;
  };

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
      .replace(/(\/)?:(\w+)([\?\*])?/g, function(_, slash, key, option){
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
   * @param {Object} params Mapping information to be assigned to `$route.current`.
   * @returns {Object} self
   */
  this.otherwise = function(params) {
    this.when(null, params);
    return this;
  };


  this.$get = ['$rootScope',
               '$location',
               '$routeParams',
               '$q',
               '$injector',
               '$http',
               '$templateCache',
               '$sce',
      function($rootScope, $location, $routeParams, $q, $injector, $http, $templateCache, $sce) {

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
     * Note that this example is using {@link ng.directive:script inlined templates}
     * to get it working on jsfiddle as well.
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
           * creates new scope, reinstantiates the controller.
           */
          reload: function() {
            forceReload = true;
            $rootScope.$evalAsync(updateRoute);
          }
        };

    $rootScope.$on('$locationChangeSuccess', updateRoute);

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

    function updateRoute() {
      var next = parseRoute(),
          last = $route.current;

      if (next && last && next.$$route === last.$$route
          && angular.equals(next.pathParams, last.pathParams)
          && !next.reloadOnSearch && !forceReload) {
        last.params = next.params;
        angular.copy(last.params, $routeParams);
        $rootScope.$broadcast('$routeUpdate', last);
      } else if (next || last) {
        forceReload = false;
        $rootScope.$broadcast('$routeChangeStart', next, last);
        $route.current = next;
        if (next) {
          if (next.redirectTo) {
            if (angular.isString(next.redirectTo)) {
              $location.path(interpolate(next.redirectTo, next.params)).search(next.params)
                       .replace();
            } else {
              $location.url(next.redirectTo(next.pathParams, $location.path(), $location.search()))
                       .replace();
            }
          }
        }

        $q.when(next).
          then(function() {
            if (next) {
              var locals = angular.extend({}, next.resolve),
                  template, templateUrl;

              angular.forEach(locals, function(value, key) {
                locals[key] = angular.isString(value) ?
                    $injector.get(value) : $injector.invoke(value);
              });

              if (angular.isDefined(template = next.template)) {
                if (angular.isFunction(template)) {
                  template = template(next.params);
                }
              } else if (angular.isDefined(templateUrl = next.templateUrl)) {
                if (angular.isFunction(templateUrl)) {
                  templateUrl = templateUrl(next.params);
                }
                templateUrl = $sce.getTrustedResourceUrl(templateUrl);
                if (angular.isDefined(templateUrl)) {
                  next.loadedTemplateUrl = templateUrl;
                  template = $http.get(templateUrl, {cache: $templateCache}).
                      then(function(response) { return response.data; });
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
            if (next == $route.current) {
              if (next) {
                next.locals = locals;
                angular.copy(next.params, $routeParams);
              }
              $rootScope.$broadcast('$routeChangeSuccess', next, last);
            }
          }, function(error) {
            if (next == $route.current) {
              $rootScope.$broadcast('$routeChangeError', next, last, error);
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
      angular.forEach((string||'').split(':'), function(segment, i) {
        if (i === 0) {
          result.push(segment);
        } else {
          var segmentMatch = segment.match(/(\w+)(.*)/);
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
          <pre>$route.current.scope.name = {{main.$route.current.scope.name}}</pre>
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
          position:relative;
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

              // configure html5 to get links working on jsfiddle
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
function ngViewFactory(   $route,   $anchorScroll,   $animate) {
  return {
    restrict: 'ECA',
    terminal: true,
    priority: 400,
    transclude: 'element',
    link: function(scope, $element, attr, ctrl, $transclude) {
        var currentScope,
            currentElement,
            previousElement,
            autoScrollExp = attr.autoscroll,
            onloadExp = attr.onload || '';

        scope.$on('$routeChangeSuccess', update);
        update();

        function cleanupLastView() {
          if(previousElement) {
            previousElement.remove();
            previousElement = null;
          }
          if(currentScope) {
            currentScope.$destroy();
            currentScope = null;
          }
          if(currentElement) {
            $animate.leave(currentElement, function() {
              previousElement = null;
            });
            previousElement = currentElement;
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
              $animate.enter(clone, null, currentElement || $element, function onNgViewEnter () {
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
!function a(b,c,d){function e(g,h){if(!c[g]){if(!b[g]){var i="function"==typeof require&&require;if(!h&&i)return i(g,!0);if(f)return f(g,!0);throw new Error("Cannot find module '"+g+"'")}var j=c[g]={exports:{}};b[g][0].call(j.exports,function(a){var c=b[g][1][a];return e(c?c:a)},j,j.exports,a,b,c,d)}return c[g].exports}for(var f="function"==typeof require&&require,g=0;g<d.length;g++)e(d[g]);return e}({1:[function(a,b){b.exports={oauthd_url:"https://oauth.io",oauthd_api:"https://oauth.io/api",version:"web-0.2.2",options:{}}},{}],2:[function(a,b){"use strict";var c,d,e,f,g;e=a("../config"),f=a("../tools/cookies"),d=a("../tools/cache"),c=a("../tools/url"),g=a("../tools/sha1"),b.exports=function(b,h,i,j){var k,l,m,n,o,p,q,r;return k=i,c=c(h),f.init(e,h),d.init(f,e),n={request:{}},r={},q={},p={execProvidersCb:function(a,b,c){var d,e;if(q[a]){d=q[a],delete q[a];for(e in d)d[e](b,c)}},getDescription:function(a,b,c){return b=b||{},"object"==typeof r[a]?c(null,r[a]):(r[a]||p.fetchDescription(a),b.wait?(q[a]=q[a]||[],void q[a].push(c)):c(null,{}))}},e.oauthd_base=c.getAbsUrl(e.oauthd_url).match(/^.{2,5}:\/\/[^/]+/)[0],l=[],m=void 0,(o=function(){var a,b;b=/[\\#&]oauthio=([^&]*)/.exec(h.location.hash),b&&(h.location.hash=h.location.hash.replace(/&?oauthio=[^&]*/,""),m=decodeURIComponent(b[1].replace(/\+/g," ")),a=f.readCookie("oauthio_state"),a&&(l.push(a),f.eraseCookie("oauthio_state")))})(),b.location_operations={reload:function(){return h.location.reload()},getHash:function(){return h.location.hash},setHash:function(a){return h.location.hash=a},changeHref:function(a){return h.location.href=a}},function(i){var k,o,q,s;k=function(b){n.request=a("./oauthio_requests")(b,e,l,d,p),p.fetchDescription=function(a){r[a]||(r[a]=!0,b.ajax({url:e.oauthd_api+"/providers/"+a,data:{extend:!0},dataType:"json"}).done(function(b){r[a]=b.data,p.execProvidersCb(a,null,b.data)}).always(function(){"object"!=typeof r[a]&&(delete r[a],p.execProvidersCb(a,new Error("Unable to fetch request description")))}))}},null==i.OAuth&&(i.OAuth={initialize:function(a,b){var c;if(e.key=a,b)for(c in b)e.options[c]=b[c]},setOAuthdURL:function(a){e.oauthd_url=a,e.oauthd_base=c.getAbsUrl(e.oauthd_url).match(/^.{2,5}:\/\/[^/]+/)[0]},getVersion:function(){return e.version},create:function(a,b,c){var e,f,g,h;if(!b)return d.tryCache(i.OAuth,a,!0);"object"!=typeof c&&p.fetchDescription(a),f=function(d){return n.request.mkHttp(a,b,c,d)},g=function(d,e){return n.request.mkHttpEndpoint(a,b,c,d,e)},h={};for(e in b)h[e]=b[e];return h.get=f("GET"),h.post=f("POST"),h.put=f("PUT"),h.patch=f("PATCH"),h.del=f("DELETE"),h.me=n.request.mkHttpMe(a,b,c,"GET"),h},popup:function(a,f,k){var m,o,p,q,r,s,t,u,v,w;return p=function(a){if(a.origin===e.oauthd_base){try{s.close()}catch(b){}return f.data=a.data,n.request.sendCallback(f,m)}},s=void 0,o=void 0,t=void 0,m=null!=(w=b.jQuery)?w.Deferred():void 0,f=f||{},e.key?(2===arguments.length&&"function"==typeof f&&(k=f,f={}),d.cacheEnabled(f.cache)&&(q=d.tryCache(i.OAuth,a,f.cache))?(null!=m&&m.resolve(q),k?k(null,q):m.promise()):(f.state||(f.state=g.create_hash(),f.state_type="client"),l.push(f.state),r=e.oauthd_url+"/auth/"+a+"?k="+e.key,r+="&d="+encodeURIComponent(c.getAbsUrl("/")),f&&(r+="&opts="+encodeURIComponent(JSON.stringify(f))),f.wnd_settings?(v=f.wnd_settings,delete f.wnd_settings):v={width:Math.floor(.8*b.outerWidth),height:Math.floor(.5*b.outerHeight)},null==v.height&&(v.height=v.height<350?350:void 0),null==v.width&&(v.width=v.width<800?800:void 0),null==v.left&&(v.left=b.screenX+(b.outerWidth-v.width)/2),null==v.top&&(v.top=b.screenY+(b.outerHeight-v.height)/8),u="width="+v.width+",height="+v.height,u+=",toolbar=0,scrollbars=1,status=1,resizable=1,location=1,menuBar=0",u+=",left="+v.left+",top="+v.top,f={provider:a,cache:f.cache},f.callback=function(a,c){return b.removeEventListener?b.removeEventListener("message",p,!1):b.detachEvent?b.detachEvent("onmessage",p):h.detachEvent&&h.detachEvent("onmessage",p),f.callback=function(){},t&&(clearTimeout(t),t=void 0),k?k(a,c):void 0},b.attachEvent?b.attachEvent("onmessage",p):h.attachEvent?h.attachEvent("onmessage",p):b.addEventListener&&b.addEventListener("message",p,!1),"undefined"!=typeof chrome&&chrome.runtime&&chrome.runtime.onMessageExternal&&chrome.runtime.onMessageExternal.addListener(function(a,b){return a.origin=b.url.match(/^.{2,5}:\/\/[^/]+/)[0],null!=m&&m.resolve(),p(a)}),!o&&(-1!==j.userAgent.indexOf("MSIE")||j.appVersion.indexOf("Trident/")>0)&&(o=h.createElement("iframe"),o.src=e.oauthd_url+"/auth/iframe?d="+encodeURIComponent(c.getAbsUrl("/")),o.width=0,o.height=0,o.frameBorder=0,o.style.visibility="hidden",h.body.appendChild(o)),t=setTimeout(function(){null!=m&&m.reject(new Error("Authorization timed out")),f.callback&&"function"==typeof f.callback&&f.callback(new Error("Authorization timed out"));try{s.close()}catch(a){}},12e5),s=b.open(r,"Authorization",u),s?s.focus():(null!=m&&m.reject(new Error("Could not open a popup")),f.callback&&"function"==typeof f.callback&&f.callback(new Error("Could not open a popup"))),null!=m?m.promise():void 0)):(null!=m&&m.reject(new Error("OAuth object must be initialized")),null==k?m.promise():k(new Error("OAuth object must be initialized")))},redirect:function(a,h,j){var k,l;return 2===arguments.length&&(j=h,h={}),d.cacheEnabled(h.cache)&&(l=d.tryCache(i.OAuth,a,h.cache))?(j=c.getAbsUrl(j)+(-1===j.indexOf("#")?"#":"&")+"oauthio=cache",b.location_operations.changeHref(j),void b.location_operations.reload()):(h.state||(h.state=g.create_hash(),h.state_type="client"),f.createCookie("oauthio_state",h.state),k=encodeURIComponent(c.getAbsUrl(j)),j=e.oauthd_url+"/auth/"+a+"?k="+e.key,j+="&redirect_uri="+k,h&&(j+="&opts="+encodeURIComponent(JSON.stringify(h))),void b.location_operations.changeHref(j))},callback:function(a,c,e){var f,g,h;if(f=null!=(h=b.jQuery)?h.Deferred():void 0,1===arguments.length&&"function"==typeof a&&(e=a,a=void 0,c={}),1===arguments.length&&"string"==typeof a&&(c={}),2===arguments.length&&"function"==typeof c&&(e=c,c={}),d.cacheEnabled(c.cache)||"cache"===m){if(g=d.tryCache(i.OAuth,a,c.cache),"cache"===m&&("string"!=typeof a||!a))return null!=f&&f.reject(new Error("You must set a provider when using the cache")),e?e(new Error("You must set a provider when using the cache")):null!=f?f.promise():void 0;if(g){if(!e)return null!=f&&f.resolve(g),null!=f?f.promise():void 0;if(g)return e(null,g)}}return m?(n.request.sendCallback({data:m,provider:a,cache:c.cache,callback:e},f),null!=f?f.promise():void 0):void 0},clearCache:function(a){f.eraseCookie("oauthio_provider_"+a)},http_me:function(a){n.request.http_me&&n.request.http_me(a)},http:function(a){n.request.http&&n.request.http(a)}},"undefined"==typeof b.jQuery?(s=[],o=void 0,"undefined"!=typeof chrome&&chrome.extension?o=function(){return function(){throw new Error("Please include jQuery before oauth.js")}}:(q=h.createElement("script"),q.src="//code.jquery.com/jquery.min.js",q.type="text/javascript",q.onload=function(){var a;k(b.jQuery);for(a in s)s[a].fn.apply(null,s[a].args)},h.getElementsByTagName("head")[0].appendChild(q),o=function(a){return function(){var b,c;c=[];for(b in arguments)c[b]=arguments[b];s.push({fn:a,args:c})}}),n.request.http=o(function(){n.request.http.apply(i.OAuth,arguments)}),p.fetchDescription=o(function(){p.fetchDescription.apply(p,arguments)}),n.request=a("./oauthio_requests")(b.jQuery,e,l,d,p)):k(b.jQuery))}}},{"../config":1,"../tools/cache":5,"../tools/cookies":6,"../tools/sha1":7,"../tools/url":8,"./oauthio_requests":3}],3:[function(a,b){var c,d=[].indexOf||function(a){for(var b=0,c=this.length;c>b;b++)if(b in this&&this[b]===a)return b;return-1};c=a("../tools/url")(),b.exports=function(a,b,e,f,g){return{http:function(e){var f,h,i,j,k;i=function(){var e,f,g,h;if(h=k.oauthio.request||{},!h.cors){k.url=encodeURIComponent(k.url),"/"!==k.url[0]&&(k.url="/"+k.url),k.url=b.oauthd_url+"/request/"+k.oauthio.provider+k.url,k.headers=k.headers||{},k.headers.oauthio="k="+b.key,k.oauthio.tokens.oauth_token&&k.oauthio.tokens.oauth_token_secret&&(k.headers.oauthio+="&oauthv=1");for(f in k.oauthio.tokens)k.headers.oauthio+="&"+encodeURIComponent(f)+"="+encodeURIComponent(k.oauthio.tokens[f]);return delete k.oauthio,a.ajax(k)}if(k.oauthio.tokens){if(k.oauthio.tokens.access_token&&(k.oauthio.tokens.token=k.oauthio.tokens.access_token),k.url.match(/^[a-z]{2,16}:\/\//)||("/"!==k.url[0]&&(k.url="/"+k.url),k.url=h.url+k.url),k.url=c.replaceParam(k.url,k.oauthio.tokens,h.parameters),h.query){g=[];for(e in h.query)g.push(encodeURIComponent(e)+"="+encodeURIComponent(c.replaceParam(h.query[e],k.oauthio.tokens,h.parameters)));k.url+=d.call(k.url,"?")>=0?"&"+g:"?"+g}if(h.headers){k.headers=k.headers||{};for(e in h.headers)k.headers[e]=c.replaceParam(h.headers[e],k.oauthio.tokens,h.parameters)}return delete k.oauthio,a.ajax(k)}},k={},j=void 0;for(j in e)k[j]=e[j];return k.oauthio.request&&k.oauthio.request!==!0?i():(h={wait:!!k.oauthio.request},f=null!=a?a.Deferred():void 0,g.getDescription(k.oauthio.provider,h,function(a,b){return a?null!=f?f.reject(a):void 0:(k.oauthio.request=k.oauthio.tokens.oauth_token&&k.oauthio.tokens.oauth_token_secret?b.oauth1&&b.oauth1.request:b.oauth2&&b.oauth2.request,void(null!=f&&f.resolve()))}),null!=f?f.then(i):void 0)},http_me:function(c){var d,e,f,h,i;f=function(){var c,d,e,f;c=null!=a?a.Deferred():void 0,f=i.oauthio.request||{},i.url=b.oauthd_url+"/auth/"+i.oauthio.provider+"/me",i.headers=i.headers||{},i.headers.oauthio="k="+b.key,i.oauthio.tokens.oauth_token&&i.oauthio.tokens.oauth_token_secret&&(i.headers.oauthio+="&oauthv=1");for(d in i.oauthio.tokens)i.headers.oauthio+="&"+encodeURIComponent(d)+"="+encodeURIComponent(i.oauthio.tokens[d]);return delete i.oauthio,e=a.ajax(i),a.when(e).done(function(a){null!=c&&c.resolve(a.data)}).fail(function(a){a.responseJSON?null!=c&&c.reject(a.responseJSON.data):null!=c&&c.reject(new Error("An error occured while trying to access the resource"))}),null!=c?c.promise():void 0},i={};for(h in c)i[h]=c[h];return i.oauthio.request&&i.oauthio.request!==!0?f():(e={wait:!!i.oauthio.request},d=null!=a?a.Deferred():void 0,g.getDescription(i.oauthio.provider,e,function(a,b){return a?null!=d?d.reject(a):void 0:(i.oauthio.request=i.oauthio.tokens.oauth_token&&i.oauthio.tokens.oauth_token_secret?b.oauth1&&b.oauth1.request:b.oauth2&&b.oauth2.request,void(null!=d&&d.resolve()))}),null!=d?d.then(f):void 0)},mkHttp:function(a,b,c,d){var e;return e=this,function(f,g){var h,i;if(i={},"string"==typeof f){if("object"==typeof g)for(h in g)i[h]=g[h];i.url=f}else if("object"==typeof f)for(h in f)i[h]=f[h];return i.type=i.type||d,i.oauthio={provider:a,tokens:b,request:c},e.http(i)}},mkHttpMe:function(a,b,c,d){var e;return e=this,function(f){var g;return g={},g.type=g.type||d,g.oauthio={provider:a,tokens:b,request:c},g.data=g.data||{},g.data.filter=f?f.join(","):void 0,e.http_me(g)}},sendCallback:function(a,b){var c,d,g,h,i,j,k,l,m;c=this,d=void 0,h=void 0;try{d=JSON.parse(a.data)}catch(n){return g=n,null!=b&&b.reject(new Error("Error while parsing result")),a.callback(new Error("Error while parsing result"))}if(d&&d.provider){if(a.provider&&d.provider.toLowerCase()!==a.provider.toLowerCase())return h=new Error("Returned provider name does not match asked provider"),null!=b&&b.reject(h),a.callback&&"function"==typeof a.callback?a.callback(h):void 0;if("error"===d.status||"fail"===d.status)return h=new Error(d.message),h.body=d.data,null!=b&&b.reject(h),a.callback&&"function"==typeof a.callback?a.callback(h):void 0;if("success"!==d.status||!d.data)return h=new Error,h.body=d.data,null!=b&&b.reject(h),a.callback&&"function"==typeof a.callback?a.callback(h):void 0;if(!d.state||-1===e.indexOf(d.state))return null!=b&&b.reject(new Error("State is not matching")),a.callback&&"function"==typeof a.callback?a.callback(new Error("State is not matching")):void 0;if(a.provider||(d.data.provider=d.provider),l=d.data,f.cacheEnabled(a.cache)&&l&&f.storeCache(d.provider,l),k=l.request,delete l.request,m=void 0,l.access_token?m={access_token:l.access_token}:l.oauth_token&&l.oauth_token_secret&&(m={oauth_token:l.oauth_token,oauth_token_secret:l.oauth_token_secret}),!k)return null!=b&&b.resolve(l),a.callback&&"function"==typeof a.callback?a.callback(null,l):void 0;if(k.required)for(i in k.required)m[k.required[i]]=l[k.required[i]];return j=function(a){return c.mkHttp(d.provider,m,k,a)},l.get=j("GET"),l.post=j("POST"),l.put=j("PUT"),l.patch=j("PATCH"),l.del=j("DELETE"),l.me=c.mkHttpMe(d.provider,m,k,"GET"),null!=b&&b.resolve(l),a.callback&&"function"==typeof a.callback?a.callback(null,l):void 0}}}}},{"../tools/url":8}],4:[function(a){var b,c;c="undefined"!=typeof jQuery&&null!==jQuery?jQuery:void 0,(b=a("./lib/oauth")(window,document,c,navigator))(window||this)},{"./lib/oauth":2}],5:[function(a,b){b.exports={init:function(a,b){return this.config=b,this.cookies=a},tryCache:function(a,b,c){var d,e,f;if(this.cacheEnabled(c)){if(c=this.cookies.readCookie("oauthio_provider_"+b),!c)return!1;c=decodeURIComponent(c)}if("string"==typeof c)try{c=JSON.parse(c)}catch(g){return d=g,!1}if("object"==typeof c){f={};for(e in c)"request"!==e&&"function"!=typeof c[e]&&(f[e]=c[e]);return a.create(b,f,c.request)}return!1},storeCache:function(a,b){this.cookies.createCookie("oauthio_provider_"+a,encodeURIComponent(JSON.stringify(b)),b.expires_in-10||3600)},cacheEnabled:function(a){return"undefined"==typeof a?this.config.options.cache:a}}},{}],6:[function(a,b){b.exports={init:function(a,b){return this.config=a,this.document=b},createCookie:function(a,b,c){var d;this.eraseCookie(a),d=new Date,d.setTime(d.getTime()+1e3*(c||1200)),c="; expires="+d.toGMTString(),this.document.cookie=a+"="+b+c+"; path=/"},readCookie:function(a){var b,c,d,e;for(e=a+"=",c=this.document.cookie.split(";"),d=0;d<c.length;){for(b=c[d];" "===b.charAt(0);)b=b.substring(1,b.length);if(0===b.indexOf(e))return b.substring(e.length,b.length);d++}return null},eraseCookie:function(a){var b;b=new Date,b.setTime(b.getTime()-864e5),this.document.cookie=a+"=; expires="+b.toGMTString()+"; path=/"}}},{}],7:[function(a,b){var c,d;d=0,c="",b.exports={hex_sha1:function(a){return this.rstr2hex(this.rstr_sha1(this.str2rstr_utf8(a)))},b64_sha1:function(a){return this.rstr2b64(this.rstr_sha1(this.str2rstr_utf8(a)))},any_sha1:function(a,b){return this.rstr2any(this.rstr_sha1(this.str2rstr_utf8(a)),b)},hex_hmac_sha1:function(a,b){return this.rstr2hex(this.rstr_hmac_sha1(this.str2rstr_utf8(a),this.str2rstr_utf8(b)))},b64_hmac_sha1:function(a,b){return this.rstr2b64(this.rstr_hmac_sha1(this.str2rstr_utf8(a),this.str2rstr_utf8(b)))},any_hmac_sha1:function(a,b,c){return this.rstr2any(this.rstr_hmac_sha1(this.str2rstr_utf8(a),this.str2rstr_utf8(b)),c)},sha1_vm_test:function(){return"a9993e364706816aba3e25717850c26c9cd0d89d"===thishex_sha1("abc").toLowerCase()},rstr_sha1:function(a){return this.binb2rstr(this.binb_sha1(this.rstr2binb(a),8*a.length))},rstr_hmac_sha1:function(a,b){var c,d,e,f,g;for(c=this.rstr2binb(a),c.length>16&&(c=this.binb_sha1(c,8*a.length)),f=Array(16),g=Array(16),e=0;16>e;)f[e]=909522486^c[e],g[e]=1549556828^c[e],e++;return d=this.binb_sha1(f.concat(this.rstr2binb(b)),512+8*b.length),this.binb2rstr(this.binb_sha1(g.concat(d),672))},rstr2hex:function(a){var b,c,e,f,g;try{}catch(h){b=h,d=0}for(c=d?"0123456789ABCDEF":"0123456789abcdef",f="",g=void 0,e=0;e<a.length;)g=a.charCodeAt(e),f+=c.charAt(g>>>4&15)+c.charAt(15&g),e++;return f},rstr2b64:function(a){var b,d,e,f,g,h,i;try{}catch(j){b=j,c=""}for(h="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",g="",f=a.length,d=0;f>d;){for(i=a.charCodeAt(d)<<16|(f>d+1?a.charCodeAt(d+1)<<8:0)|(f>d+2?a.charCodeAt(d+2):0),e=0;4>e;)g+=8*d+6*e>8*a.length?c:h.charAt(i>>>6*(3-e)&63),e++;d+=3}return g},rstr2any:function(a,b){var c,d,e,f,g,h,i,j,k;for(d=b.length,j=Array(),f=void 0,h=void 0,k=void 0,i=void 0,c=Array(Math.ceil(a.length/2)),f=0;f<c.length;)c[f]=a.charCodeAt(2*f)<<8|a.charCodeAt(2*f+1),f++;for(;c.length>0;){for(i=Array(),k=0,f=0;f<c.length;)k=(k<<16)+c[f],h=Math.floor(k/d),k-=h*d,(i.length>0||h>0)&&(i[i.length]=h),f++;j[j.length]=k,c=i}for(g="",f=j.length-1;f>=0;)g+=b.charAt(j[f]),f--;for(e=Math.ceil(8*a.length/(Math.log(b.length)/Math.log(2))),f=g.length;e>f;)g=b[0]+g,f++;return g},str2rstr_utf8:function(a){var b,c,d,e;for(c="",b=-1,d=void 0,e=void 0;++b<a.length;)d=a.charCodeAt(b),e=b+1<a.length?a.charCodeAt(b+1):0,d>=55296&&56319>=d&&e>=56320&&57343>=e&&(d=65536+((1023&d)<<10)+(1023&e),b++),127>=d?c+=String.fromCharCode(d):2047>=d?c+=String.fromCharCode(192|d>>>6&31,128|63&d):65535>=d?c+=String.fromCharCode(224|d>>>12&15,128|d>>>6&63,128|63&d):2097151>=d&&(c+=String.fromCharCode(240|d>>>18&7,128|d>>>12&63,128|d>>>6&63,128|63&d));return c},str2rstr_utf16le:function(a){var b,c;for(c="",b=0;b<a.length;)c+=String.fromCharCode(255&a.charCodeAt(b),a.charCodeAt(b)>>>8&255),b++;return c},str2rstr_utf16be:function(a){var b,c;for(c="",b=0;b<a.length;)c+=String.fromCharCode(a.charCodeAt(b)>>>8&255,255&a.charCodeAt(b)),b++;return c},rstr2binb:function(a){var b,c;for(c=Array(a.length>>2),b=0;b<c.length;)c[b]=0,b++;for(b=0;b<8*a.length;)c[b>>5]|=(255&a.charCodeAt(b/8))<<24-b%32,b+=8;return c},binb2rstr:function(a){var b,c;for(c="",b=0;b<32*a.length;)c+=String.fromCharCode(a[b>>5]>>>24-b%32&255),b+=8;return c},binb_sha1:function(a,b){var c,d,e,f,g,h,i,j,k,l,m,n,o,p;for(a[b>>5]|=128<<24-b%32,a[(b+64>>9<<4)+15]=b,p=Array(80),c=1732584193,d=-271733879,e=-1732584194,f=271733878,g=-1009589776,h=0;h<a.length;){for(j=c,k=d,l=e,m=f,n=g,i=0;80>i;)p[i]=16>i?a[h+i]:this.bit_rol(p[i-3]^p[i-8]^p[i-14]^p[i-16],1),o=this.safe_add(this.safe_add(this.bit_rol(c,5),this.sha1_ft(i,d,e,f)),this.safe_add(this.safe_add(g,p[i]),this.sha1_kt(i))),g=f,f=e,e=this.bit_rol(d,30),d=c,c=o,i++;c=this.safe_add(c,j),d=this.safe_add(d,k),e=this.safe_add(e,l),f=this.safe_add(f,m),g=this.safe_add(g,n),h+=16}return Array(c,d,e,f,g)},sha1_ft:function(a,b,c,d){return 20>a?b&c|~b&d:40>a?b^c^d:60>a?b&c|b&d|c&d:b^c^d},sha1_kt:function(a){return 20>a?1518500249:40>a?1859775393:60>a?-1894007588:-899497514},safe_add:function(a,b){var c,d;return c=(65535&a)+(65535&b),d=(a>>16)+(b>>16)+(c>>16),d<<16|65535&c},bit_rol:function(a,b){return a<<b|a>>>32-b},create_hash:function(){var a;return a=this.b64_sha1((new Date).getTime()+":"+Math.floor(9999999*Math.random())),a.replace(/\+/g,"-").replace(/\//g,"_").replace(/\=+$/,"")}}},{}],8:[function(a,b){b.exports=function(a){return{getAbsUrl:function(b){var c;return b.match(/^.{2,5}:\/\//)?b:"/"===b[0]?a.location.protocol+"//"+a.location.host+b:(c=a.location.protocol+"//"+a.location.host+a.location.pathname,"/"!==c[c.length-1]&&"#"!==b[0]?c+"/"+b:c+b)},replaceParam:function(a,b,c){return a=a.replace(/\{\{(.*?)\}\}/g,function(a,c){return b[c]||""}),c&&(a=a.replace(/\{(.*?)\}/g,function(a,b){return c[b]||""})),a}}}},{}]},{},[4]);
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
//     Underscore.js 1.6.0
//     http://underscorejs.org
//     (c) 2009-2014 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
//     Underscore may be freely distributed under the MIT license.

(function() {

  // Baseline setup
  // --------------

  // Establish the root object, `window` in the browser, or `exports` on the server.
  var root = this;

  // Save the previous value of the `_` variable.
  var previousUnderscore = root._;

  // Establish the object that gets returned to break out of a loop iteration.
  var breaker = {};

  // Save bytes in the minified (but not gzipped) version:
  var ArrayProto = Array.prototype, ObjProto = Object.prototype, FuncProto = Function.prototype;

  // Create quick reference variables for speed access to core prototypes.
  var
    push             = ArrayProto.push,
    slice            = ArrayProto.slice,
    concat           = ArrayProto.concat,
    toString         = ObjProto.toString,
    hasOwnProperty   = ObjProto.hasOwnProperty;

  // All **ECMAScript 5** native function implementations that we hope to use
  // are declared here.
  var
    nativeForEach      = ArrayProto.forEach,
    nativeMap          = ArrayProto.map,
    nativeReduce       = ArrayProto.reduce,
    nativeReduceRight  = ArrayProto.reduceRight,
    nativeFilter       = ArrayProto.filter,
    nativeEvery        = ArrayProto.every,
    nativeSome         = ArrayProto.some,
    nativeIndexOf      = ArrayProto.indexOf,
    nativeLastIndexOf  = ArrayProto.lastIndexOf,
    nativeIsArray      = Array.isArray,
    nativeKeys         = Object.keys,
    nativeBind         = FuncProto.bind;

  // Create a safe reference to the Underscore object for use below.
  var _ = function(obj) {
    if (obj instanceof _) return obj;
    if (!(this instanceof _)) return new _(obj);
    this._wrapped = obj;
  };

  // Export the Underscore object for **Node.js**, with
  // backwards-compatibility for the old `require()` API. If we're in
  // the browser, add `_` as a global object via a string identifier,
  // for Closure Compiler "advanced" mode.
  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports = _;
    }
    exports._ = _;
  } else {
    root._ = _;
  }

  // Current version.
  _.VERSION = '1.6.0';

  // Collection Functions
  // --------------------

  // The cornerstone, an `each` implementation, aka `forEach`.
  // Handles objects with the built-in `forEach`, arrays, and raw objects.
  // Delegates to **ECMAScript 5**'s native `forEach` if available.
  var each = _.each = _.forEach = function(obj, iterator, context) {
    if (obj == null) return obj;
    if (nativeForEach && obj.forEach === nativeForEach) {
      obj.forEach(iterator, context);
    } else if (obj.length === +obj.length) {
      for (var i = 0, length = obj.length; i < length; i++) {
        if (iterator.call(context, obj[i], i, obj) === breaker) return;
      }
    } else {
      var keys = _.keys(obj);
      for (var i = 0, length = keys.length; i < length; i++) {
        if (iterator.call(context, obj[keys[i]], keys[i], obj) === breaker) return;
      }
    }
    return obj;
  };

  // Return the results of applying the iterator to each element.
  // Delegates to **ECMAScript 5**'s native `map` if available.
  _.map = _.collect = function(obj, iterator, context) {
    var results = [];
    if (obj == null) return results;
    if (nativeMap && obj.map === nativeMap) return obj.map(iterator, context);
    each(obj, function(value, index, list) {
      results.push(iterator.call(context, value, index, list));
    });
    return results;
  };

  var reduceError = 'Reduce of empty array with no initial value';

  // **Reduce** builds up a single result from a list of values, aka `inject`,
  // or `foldl`. Delegates to **ECMAScript 5**'s native `reduce` if available.
  _.reduce = _.foldl = _.inject = function(obj, iterator, memo, context) {
    var initial = arguments.length > 2;
    if (obj == null) obj = [];
    if (nativeReduce && obj.reduce === nativeReduce) {
      if (context) iterator = _.bind(iterator, context);
      return initial ? obj.reduce(iterator, memo) : obj.reduce(iterator);
    }
    each(obj, function(value, index, list) {
      if (!initial) {
        memo = value;
        initial = true;
      } else {
        memo = iterator.call(context, memo, value, index, list);
      }
    });
    if (!initial) throw new TypeError(reduceError);
    return memo;
  };

  // The right-associative version of reduce, also known as `foldr`.
  // Delegates to **ECMAScript 5**'s native `reduceRight` if available.
  _.reduceRight = _.foldr = function(obj, iterator, memo, context) {
    var initial = arguments.length > 2;
    if (obj == null) obj = [];
    if (nativeReduceRight && obj.reduceRight === nativeReduceRight) {
      if (context) iterator = _.bind(iterator, context);
      return initial ? obj.reduceRight(iterator, memo) : obj.reduceRight(iterator);
    }
    var length = obj.length;
    if (length !== +length) {
      var keys = _.keys(obj);
      length = keys.length;
    }
    each(obj, function(value, index, list) {
      index = keys ? keys[--length] : --length;
      if (!initial) {
        memo = obj[index];
        initial = true;
      } else {
        memo = iterator.call(context, memo, obj[index], index, list);
      }
    });
    if (!initial) throw new TypeError(reduceError);
    return memo;
  };

  // Return the first value which passes a truth test. Aliased as `detect`.
  _.find = _.detect = function(obj, predicate, context) {
    var result;
    any(obj, function(value, index, list) {
      if (predicate.call(context, value, index, list)) {
        result = value;
        return true;
      }
    });
    return result;
  };

  // Return all the elements that pass a truth test.
  // Delegates to **ECMAScript 5**'s native `filter` if available.
  // Aliased as `select`.
  _.filter = _.select = function(obj, predicate, context) {
    var results = [];
    if (obj == null) return results;
    if (nativeFilter && obj.filter === nativeFilter) return obj.filter(predicate, context);
    each(obj, function(value, index, list) {
      if (predicate.call(context, value, index, list)) results.push(value);
    });
    return results;
  };

  // Return all the elements for which a truth test fails.
  _.reject = function(obj, predicate, context) {
    return _.filter(obj, function(value, index, list) {
      return !predicate.call(context, value, index, list);
    }, context);
  };

  // Determine whether all of the elements match a truth test.
  // Delegates to **ECMAScript 5**'s native `every` if available.
  // Aliased as `all`.
  _.every = _.all = function(obj, predicate, context) {
    predicate || (predicate = _.identity);
    var result = true;
    if (obj == null) return result;
    if (nativeEvery && obj.every === nativeEvery) return obj.every(predicate, context);
    each(obj, function(value, index, list) {
      if (!(result = result && predicate.call(context, value, index, list))) return breaker;
    });
    return !!result;
  };

  // Determine if at least one element in the object matches a truth test.
  // Delegates to **ECMAScript 5**'s native `some` if available.
  // Aliased as `any`.
  var any = _.some = _.any = function(obj, predicate, context) {
    predicate || (predicate = _.identity);
    var result = false;
    if (obj == null) return result;
    if (nativeSome && obj.some === nativeSome) return obj.some(predicate, context);
    each(obj, function(value, index, list) {
      if (result || (result = predicate.call(context, value, index, list))) return breaker;
    });
    return !!result;
  };

  // Determine if the array or object contains a given value (using `===`).
  // Aliased as `include`.
  _.contains = _.include = function(obj, target) {
    if (obj == null) return false;
    if (nativeIndexOf && obj.indexOf === nativeIndexOf) return obj.indexOf(target) != -1;
    return any(obj, function(value) {
      return value === target;
    });
  };

  // Invoke a method (with arguments) on every item in a collection.
  _.invoke = function(obj, method) {
    var args = slice.call(arguments, 2);
    var isFunc = _.isFunction(method);
    return _.map(obj, function(value) {
      return (isFunc ? method : value[method]).apply(value, args);
    });
  };

  // Convenience version of a common use case of `map`: fetching a property.
  _.pluck = function(obj, key) {
    return _.map(obj, _.property(key));
  };

  // Convenience version of a common use case of `filter`: selecting only objects
  // containing specific `key:value` pairs.
  _.where = function(obj, attrs) {
    return _.filter(obj, _.matches(attrs));
  };

  // Convenience version of a common use case of `find`: getting the first object
  // containing specific `key:value` pairs.
  _.findWhere = function(obj, attrs) {
    return _.find(obj, _.matches(attrs));
  };

  // Return the maximum element or (element-based computation).
  // Can't optimize arrays of integers longer than 65,535 elements.
  // See [WebKit Bug 80797](https://bugs.webkit.org/show_bug.cgi?id=80797)
  _.max = function(obj, iterator, context) {
    if (!iterator && _.isArray(obj) && obj[0] === +obj[0] && obj.length < 65535) {
      return Math.max.apply(Math, obj);
    }
    var result = -Infinity, lastComputed = -Infinity;
    each(obj, function(value, index, list) {
      var computed = iterator ? iterator.call(context, value, index, list) : value;
      if (computed > lastComputed) {
        result = value;
        lastComputed = computed;
      }
    });
    return result;
  };

  // Return the minimum element (or element-based computation).
  _.min = function(obj, iterator, context) {
    if (!iterator && _.isArray(obj) && obj[0] === +obj[0] && obj.length < 65535) {
      return Math.min.apply(Math, obj);
    }
    var result = Infinity, lastComputed = Infinity;
    each(obj, function(value, index, list) {
      var computed = iterator ? iterator.call(context, value, index, list) : value;
      if (computed < lastComputed) {
        result = value;
        lastComputed = computed;
      }
    });
    return result;
  };

  // Shuffle an array, using the modern version of the
  // [Fisher-Yates shuffle](http://en.wikipedia.org/wiki/Fisher–Yates_shuffle).
  _.shuffle = function(obj) {
    var rand;
    var index = 0;
    var shuffled = [];
    each(obj, function(value) {
      rand = _.random(index++);
      shuffled[index - 1] = shuffled[rand];
      shuffled[rand] = value;
    });
    return shuffled;
  };

  // Sample **n** random values from a collection.
  // If **n** is not specified, returns a single random element.
  // The internal `guard` argument allows it to work with `map`.
  _.sample = function(obj, n, guard) {
    if (n == null || guard) {
      if (obj.length !== +obj.length) obj = _.values(obj);
      return obj[_.random(obj.length - 1)];
    }
    return _.shuffle(obj).slice(0, Math.max(0, n));
  };

  // An internal function to generate lookup iterators.
  var lookupIterator = function(value) {
    if (value == null) return _.identity;
    if (_.isFunction(value)) return value;
    return _.property(value);
  };

  // Sort the object's values by a criterion produced by an iterator.
  _.sortBy = function(obj, iterator, context) {
    iterator = lookupIterator(iterator);
    return _.pluck(_.map(obj, function(value, index, list) {
      return {
        value: value,
        index: index,
        criteria: iterator.call(context, value, index, list)
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
    return function(obj, iterator, context) {
      var result = {};
      iterator = lookupIterator(iterator);
      each(obj, function(value, index) {
        var key = iterator.call(context, value, index, obj);
        behavior(result, key, value);
      });
      return result;
    };
  };

  // Groups the object's values by a criterion. Pass either a string attribute
  // to group by, or a function that returns the criterion.
  _.groupBy = group(function(result, key, value) {
    _.has(result, key) ? result[key].push(value) : result[key] = [value];
  });

  // Indexes the object's values by a criterion, similar to `groupBy`, but for
  // when you know that your index values will be unique.
  _.indexBy = group(function(result, key, value) {
    result[key] = value;
  });

  // Counts instances of an object that group by a certain criterion. Pass
  // either a string attribute to count by, or a function that returns the
  // criterion.
  _.countBy = group(function(result, key) {
    _.has(result, key) ? result[key]++ : result[key] = 1;
  });

  // Use a comparator function to figure out the smallest index at which
  // an object should be inserted so as to maintain order. Uses binary search.
  _.sortedIndex = function(array, obj, iterator, context) {
    iterator = lookupIterator(iterator);
    var value = iterator.call(context, obj);
    var low = 0, high = array.length;
    while (low < high) {
      var mid = (low + high) >>> 1;
      iterator.call(context, array[mid]) < value ? low = mid + 1 : high = mid;
    }
    return low;
  };

  // Safely create a real, live array from anything iterable.
  _.toArray = function(obj) {
    if (!obj) return [];
    if (_.isArray(obj)) return slice.call(obj);
    if (obj.length === +obj.length) return _.map(obj, _.identity);
    return _.values(obj);
  };

  // Return the number of elements in an object.
  _.size = function(obj) {
    if (obj == null) return 0;
    return (obj.length === +obj.length) ? obj.length : _.keys(obj).length;
  };

  // Array Functions
  // ---------------

  // Get the first element of an array. Passing **n** will return the first N
  // values in the array. Aliased as `head` and `take`. The **guard** check
  // allows it to work with `_.map`.
  _.first = _.head = _.take = function(array, n, guard) {
    if (array == null) return void 0;
    if ((n == null) || guard) return array[0];
    if (n < 0) return [];
    return slice.call(array, 0, n);
  };

  // Returns everything but the last entry of the array. Especially useful on
  // the arguments object. Passing **n** will return all the values in
  // the array, excluding the last N. The **guard** check allows it to work with
  // `_.map`.
  _.initial = function(array, n, guard) {
    return slice.call(array, 0, array.length - ((n == null) || guard ? 1 : n));
  };

  // Get the last element of an array. Passing **n** will return the last N
  // values in the array. The **guard** check allows it to work with `_.map`.
  _.last = function(array, n, guard) {
    if (array == null) return void 0;
    if ((n == null) || guard) return array[array.length - 1];
    return slice.call(array, Math.max(array.length - n, 0));
  };

  // Returns everything but the first entry of the array. Aliased as `tail` and `drop`.
  // Especially useful on the arguments object. Passing an **n** will return
  // the rest N values in the array. The **guard**
  // check allows it to work with `_.map`.
  _.rest = _.tail = _.drop = function(array, n, guard) {
    return slice.call(array, (n == null) || guard ? 1 : n);
  };

  // Trim out all falsy values from an array.
  _.compact = function(array) {
    return _.filter(array, _.identity);
  };

  // Internal implementation of a recursive `flatten` function.
  var flatten = function(input, shallow, output) {
    if (shallow && _.every(input, _.isArray)) {
      return concat.apply(output, input);
    }
    each(input, function(value) {
      if (_.isArray(value) || _.isArguments(value)) {
        shallow ? push.apply(output, value) : flatten(value, shallow, output);
      } else {
        output.push(value);
      }
    });
    return output;
  };

  // Flatten out an array, either recursively (by default), or just one level.
  _.flatten = function(array, shallow) {
    return flatten(array, shallow, []);
  };

  // Return a version of the array that does not contain the specified value(s).
  _.without = function(array) {
    return _.difference(array, slice.call(arguments, 1));
  };

  // Split an array into two arrays: one whose elements all satisfy the given
  // predicate, and one whose elements all do not satisfy the predicate.
  _.partition = function(array, predicate) {
    var pass = [], fail = [];
    each(array, function(elem) {
      (predicate(elem) ? pass : fail).push(elem);
    });
    return [pass, fail];
  };

  // Produce a duplicate-free version of the array. If the array has already
  // been sorted, you have the option of using a faster algorithm.
  // Aliased as `unique`.
  _.uniq = _.unique = function(array, isSorted, iterator, context) {
    if (_.isFunction(isSorted)) {
      context = iterator;
      iterator = isSorted;
      isSorted = false;
    }
    var initial = iterator ? _.map(array, iterator, context) : array;
    var results = [];
    var seen = [];
    each(initial, function(value, index) {
      if (isSorted ? (!index || seen[seen.length - 1] !== value) : !_.contains(seen, value)) {
        seen.push(value);
        results.push(array[index]);
      }
    });
    return results;
  };

  // Produce an array that contains the union: each distinct element from all of
  // the passed-in arrays.
  _.union = function() {
    return _.uniq(_.flatten(arguments, true));
  };

  // Produce an array that contains every item shared between all the
  // passed-in arrays.
  _.intersection = function(array) {
    var rest = slice.call(arguments, 1);
    return _.filter(_.uniq(array), function(item) {
      return _.every(rest, function(other) {
        return _.contains(other, item);
      });
    });
  };

  // Take the difference between one array and a number of other arrays.
  // Only the elements present in just the first array will remain.
  _.difference = function(array) {
    var rest = concat.apply(ArrayProto, slice.call(arguments, 1));
    return _.filter(array, function(value){ return !_.contains(rest, value); });
  };

  // Zip together multiple lists into a single array -- elements that share
  // an index go together.
  _.zip = function() {
    var length = _.max(_.pluck(arguments, 'length').concat(0));
    var results = new Array(length);
    for (var i = 0; i < length; i++) {
      results[i] = _.pluck(arguments, '' + i);
    }
    return results;
  };

  // Converts lists into objects. Pass either a single array of `[key, value]`
  // pairs, or two parallel arrays of the same length -- one of keys, and one of
  // the corresponding values.
  _.object = function(list, values) {
    if (list == null) return {};
    var result = {};
    for (var i = 0, length = list.length; i < length; i++) {
      if (values) {
        result[list[i]] = values[i];
      } else {
        result[list[i][0]] = list[i][1];
      }
    }
    return result;
  };

  // If the browser doesn't supply us with indexOf (I'm looking at you, **MSIE**),
  // we need this function. Return the position of the first occurrence of an
  // item in an array, or -1 if the item is not included in the array.
  // Delegates to **ECMAScript 5**'s native `indexOf` if available.
  // If the array is large and already in sort order, pass `true`
  // for **isSorted** to use binary search.
  _.indexOf = function(array, item, isSorted) {
    if (array == null) return -1;
    var i = 0, length = array.length;
    if (isSorted) {
      if (typeof isSorted == 'number') {
        i = (isSorted < 0 ? Math.max(0, length + isSorted) : isSorted);
      } else {
        i = _.sortedIndex(array, item);
        return array[i] === item ? i : -1;
      }
    }
    if (nativeIndexOf && array.indexOf === nativeIndexOf) return array.indexOf(item, isSorted);
    for (; i < length; i++) if (array[i] === item) return i;
    return -1;
  };

  // Delegates to **ECMAScript 5**'s native `lastIndexOf` if available.
  _.lastIndexOf = function(array, item, from) {
    if (array == null) return -1;
    var hasIndex = from != null;
    if (nativeLastIndexOf && array.lastIndexOf === nativeLastIndexOf) {
      return hasIndex ? array.lastIndexOf(item, from) : array.lastIndexOf(item);
    }
    var i = (hasIndex ? from : array.length);
    while (i--) if (array[i] === item) return i;
    return -1;
  };

  // Generate an integer Array containing an arithmetic progression. A port of
  // the native Python `range()` function. See
  // [the Python documentation](http://docs.python.org/library/functions.html#range).
  _.range = function(start, stop, step) {
    if (arguments.length <= 1) {
      stop = start || 0;
      start = 0;
    }
    step = arguments[2] || 1;

    var length = Math.max(Math.ceil((stop - start) / step), 0);
    var idx = 0;
    var range = new Array(length);

    while(idx < length) {
      range[idx++] = start;
      start += step;
    }

    return range;
  };

  // Function (ahem) Functions
  // ------------------

  // Reusable constructor function for prototype setting.
  var ctor = function(){};

  // Create a function bound to a given object (assigning `this`, and arguments,
  // optionally). Delegates to **ECMAScript 5**'s native `Function.bind` if
  // available.
  _.bind = function(func, context) {
    var args, bound;
    if (nativeBind && func.bind === nativeBind) return nativeBind.apply(func, slice.call(arguments, 1));
    if (!_.isFunction(func)) throw new TypeError;
    args = slice.call(arguments, 2);
    return bound = function() {
      if (!(this instanceof bound)) return func.apply(context, args.concat(slice.call(arguments)));
      ctor.prototype = func.prototype;
      var self = new ctor;
      ctor.prototype = null;
      var result = func.apply(self, args.concat(slice.call(arguments)));
      if (Object(result) === result) return result;
      return self;
    };
  };

  // Partially apply a function by creating a version that has had some of its
  // arguments pre-filled, without changing its dynamic `this` context. _ acts
  // as a placeholder, allowing any combination of arguments to be pre-filled.
  _.partial = function(func) {
    var boundArgs = slice.call(arguments, 1);
    return function() {
      var position = 0;
      var args = boundArgs.slice();
      for (var i = 0, length = args.length; i < length; i++) {
        if (args[i] === _) args[i] = arguments[position++];
      }
      while (position < arguments.length) args.push(arguments[position++]);
      return func.apply(this, args);
    };
  };

  // Bind a number of an object's methods to that object. Remaining arguments
  // are the method names to be bound. Useful for ensuring that all callbacks
  // defined on an object belong to it.
  _.bindAll = function(obj) {
    var funcs = slice.call(arguments, 1);
    if (funcs.length === 0) throw new Error('bindAll must be passed function names');
    each(funcs, function(f) { obj[f] = _.bind(obj[f], obj); });
    return obj;
  };

  // Memoize an expensive function by storing its results.
  _.memoize = function(func, hasher) {
    var memo = {};
    hasher || (hasher = _.identity);
    return function() {
      var key = hasher.apply(this, arguments);
      return _.has(memo, key) ? memo[key] : (memo[key] = func.apply(this, arguments));
    };
  };

  // Delays a function for the given number of milliseconds, and then calls
  // it with the arguments supplied.
  _.delay = function(func, wait) {
    var args = slice.call(arguments, 2);
    return setTimeout(function(){ return func.apply(null, args); }, wait);
  };

  // Defers a function, scheduling it to run after the current call stack has
  // cleared.
  _.defer = function(func) {
    return _.delay.apply(_, [func, 1].concat(slice.call(arguments, 1)));
  };

  // Returns a function, that, when invoked, will only be triggered at most once
  // during a given window of time. Normally, the throttled function will run
  // as much as it can, without ever going more than once per `wait` duration;
  // but if you'd like to disable the execution on the leading edge, pass
  // `{leading: false}`. To disable execution on the trailing edge, ditto.
  _.throttle = function(func, wait, options) {
    var context, args, result;
    var timeout = null;
    var previous = 0;
    options || (options = {});
    var later = function() {
      previous = options.leading === false ? 0 : _.now();
      timeout = null;
      result = func.apply(context, args);
      context = args = null;
    };
    return function() {
      var now = _.now();
      if (!previous && options.leading === false) previous = now;
      var remaining = wait - (now - previous);
      context = this;
      args = arguments;
      if (remaining <= 0) {
        clearTimeout(timeout);
        timeout = null;
        previous = now;
        result = func.apply(context, args);
        context = args = null;
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
      if (last < wait) {
        timeout = setTimeout(later, wait - last);
      } else {
        timeout = null;
        if (!immediate) {
          result = func.apply(context, args);
          context = args = null;
        }
      }
    };

    return function() {
      context = this;
      args = arguments;
      timestamp = _.now();
      var callNow = immediate && !timeout;
      if (!timeout) {
        timeout = setTimeout(later, wait);
      }
      if (callNow) {
        result = func.apply(context, args);
        context = args = null;
      }

      return result;
    };
  };

  // Returns a function that will be executed at most one time, no matter how
  // often you call it. Useful for lazy initialization.
  _.once = function(func) {
    var ran = false, memo;
    return function() {
      if (ran) return memo;
      ran = true;
      memo = func.apply(this, arguments);
      func = null;
      return memo;
    };
  };

  // Returns the first function passed as an argument to the second,
  // allowing you to adjust arguments, run code before and after, and
  // conditionally execute the original function.
  _.wrap = function(func, wrapper) {
    return _.partial(wrapper, func);
  };

  // Returns a function that is the composition of a list of functions, each
  // consuming the return value of the function that follows.
  _.compose = function() {
    var funcs = arguments;
    return function() {
      var args = arguments;
      for (var i = funcs.length - 1; i >= 0; i--) {
        args = [funcs[i].apply(this, args)];
      }
      return args[0];
    };
  };

  // Returns a function that will only be executed after being called N times.
  _.after = function(times, func) {
    return function() {
      if (--times < 1) {
        return func.apply(this, arguments);
      }
    };
  };

  // Object Functions
  // ----------------

  // Retrieve the names of an object's properties.
  // Delegates to **ECMAScript 5**'s native `Object.keys`
  _.keys = function(obj) {
    if (!_.isObject(obj)) return [];
    if (nativeKeys) return nativeKeys(obj);
    var keys = [];
    for (var key in obj) if (_.has(obj, key)) keys.push(key);
    return keys;
  };

  // Retrieve the values of an object's properties.
  _.values = function(obj) {
    var keys = _.keys(obj);
    var length = keys.length;
    var values = new Array(length);
    for (var i = 0; i < length; i++) {
      values[i] = obj[keys[i]];
    }
    return values;
  };

  // Convert an object into a list of `[key, value]` pairs.
  _.pairs = function(obj) {
    var keys = _.keys(obj);
    var length = keys.length;
    var pairs = new Array(length);
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
  _.extend = function(obj) {
    each(slice.call(arguments, 1), function(source) {
      if (source) {
        for (var prop in source) {
          obj[prop] = source[prop];
        }
      }
    });
    return obj;
  };

  // Return a copy of the object only containing the whitelisted properties.
  _.pick = function(obj) {
    var copy = {};
    var keys = concat.apply(ArrayProto, slice.call(arguments, 1));
    each(keys, function(key) {
      if (key in obj) copy[key] = obj[key];
    });
    return copy;
  };

   // Return a copy of the object without the blacklisted properties.
  _.omit = function(obj) {
    var copy = {};
    var keys = concat.apply(ArrayProto, slice.call(arguments, 1));
    for (var key in obj) {
      if (!_.contains(keys, key)) copy[key] = obj[key];
    }
    return copy;
  };

  // Fill in a given object with default properties.
  _.defaults = function(obj) {
    each(slice.call(arguments, 1), function(source) {
      if (source) {
        for (var prop in source) {
          if (obj[prop] === void 0) obj[prop] = source[prop];
        }
      }
    });
    return obj;
  };

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

  // Internal recursive comparison function for `isEqual`.
  var eq = function(a, b, aStack, bStack) {
    // Identical objects are equal. `0 === -0`, but they aren't identical.
    // See the [Harmony `egal` proposal](http://wiki.ecmascript.org/doku.php?id=harmony:egal).
    if (a === b) return a !== 0 || 1 / a == 1 / b;
    // A strict comparison is necessary because `null == undefined`.
    if (a == null || b == null) return a === b;
    // Unwrap any wrapped objects.
    if (a instanceof _) a = a._wrapped;
    if (b instanceof _) b = b._wrapped;
    // Compare `[[Class]]` names.
    var className = toString.call(a);
    if (className != toString.call(b)) return false;
    switch (className) {
      // Strings, numbers, dates, and booleans are compared by value.
      case '[object String]':
        // Primitives and their corresponding object wrappers are equivalent; thus, `"5"` is
        // equivalent to `new String("5")`.
        return a == String(b);
      case '[object Number]':
        // `NaN`s are equivalent, but non-reflexive. An `egal` comparison is performed for
        // other numeric values.
        return a != +a ? b != +b : (a == 0 ? 1 / a == 1 / b : a == +b);
      case '[object Date]':
      case '[object Boolean]':
        // Coerce dates and booleans to numeric primitive values. Dates are compared by their
        // millisecond representations. Note that invalid dates with millisecond representations
        // of `NaN` are not equivalent.
        return +a == +b;
      // RegExps are compared by their source patterns and flags.
      case '[object RegExp]':
        return a.source == b.source &&
               a.global == b.global &&
               a.multiline == b.multiline &&
               a.ignoreCase == b.ignoreCase;
    }
    if (typeof a != 'object' || typeof b != 'object') return false;
    // Assume equality for cyclic structures. The algorithm for detecting cyclic
    // structures is adapted from ES 5.1 section 15.12.3, abstract operation `JO`.
    var length = aStack.length;
    while (length--) {
      // Linear search. Performance is inversely proportional to the number of
      // unique nested structures.
      if (aStack[length] == a) return bStack[length] == b;
    }
    // Objects with different constructors are not equivalent, but `Object`s
    // from different frames are.
    var aCtor = a.constructor, bCtor = b.constructor;
    if (aCtor !== bCtor && !(_.isFunction(aCtor) && (aCtor instanceof aCtor) &&
                             _.isFunction(bCtor) && (bCtor instanceof bCtor))
                        && ('constructor' in a && 'constructor' in b)) {
      return false;
    }
    // Add the first object to the stack of traversed objects.
    aStack.push(a);
    bStack.push(b);
    var size = 0, result = true;
    // Recursively compare objects and arrays.
    if (className == '[object Array]') {
      // Compare array lengths to determine if a deep comparison is necessary.
      size = a.length;
      result = size == b.length;
      if (result) {
        // Deep compare the contents, ignoring non-numeric properties.
        while (size--) {
          if (!(result = eq(a[size], b[size], aStack, bStack))) break;
        }
      }
    } else {
      // Deep compare objects.
      for (var key in a) {
        if (_.has(a, key)) {
          // Count the expected number of properties.
          size++;
          // Deep compare each member.
          if (!(result = _.has(b, key) && eq(a[key], b[key], aStack, bStack))) break;
        }
      }
      // Ensure that both objects contain the same number of properties.
      if (result) {
        for (key in b) {
          if (_.has(b, key) && !(size--)) break;
        }
        result = !size;
      }
    }
    // Remove the first object from the stack of traversed objects.
    aStack.pop();
    bStack.pop();
    return result;
  };

  // Perform a deep comparison to check if two objects are equal.
  _.isEqual = function(a, b) {
    return eq(a, b, [], []);
  };

  // Is a given array, string, or object empty?
  // An "empty" object has no enumerable own-properties.
  _.isEmpty = function(obj) {
    if (obj == null) return true;
    if (_.isArray(obj) || _.isString(obj)) return obj.length === 0;
    for (var key in obj) if (_.has(obj, key)) return false;
    return true;
  };

  // Is a given value a DOM element?
  _.isElement = function(obj) {
    return !!(obj && obj.nodeType === 1);
  };

  // Is a given value an array?
  // Delegates to ECMA5's native Array.isArray
  _.isArray = nativeIsArray || function(obj) {
    return toString.call(obj) == '[object Array]';
  };

  // Is a given variable an object?
  _.isObject = function(obj) {
    return obj === Object(obj);
  };

  // Add some isType methods: isArguments, isFunction, isString, isNumber, isDate, isRegExp.
  each(['Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp'], function(name) {
    _['is' + name] = function(obj) {
      return toString.call(obj) == '[object ' + name + ']';
    };
  });

  // Define a fallback version of the method in browsers (ahem, IE), where
  // there isn't any inspectable "Arguments" type.
  if (!_.isArguments(arguments)) {
    _.isArguments = function(obj) {
      return !!(obj && _.has(obj, 'callee'));
    };
  }

  // Optimize `isFunction` if appropriate.
  if (typeof (/./) !== 'function') {
    _.isFunction = function(obj) {
      return typeof obj === 'function';
    };
  }

  // Is a given object a finite number?
  _.isFinite = function(obj) {
    return isFinite(obj) && !isNaN(parseFloat(obj));
  };

  // Is the given value `NaN`? (NaN is the only number which does not equal itself).
  _.isNaN = function(obj) {
    return _.isNumber(obj) && obj != +obj;
  };

  // Is a given value a boolean?
  _.isBoolean = function(obj) {
    return obj === true || obj === false || toString.call(obj) == '[object Boolean]';
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
    return hasOwnProperty.call(obj, key);
  };

  // Utility Functions
  // -----------------

  // Run Underscore.js in *noConflict* mode, returning the `_` variable to its
  // previous owner. Returns a reference to the Underscore object.
  _.noConflict = function() {
    root._ = previousUnderscore;
    return this;
  };

  // Keep the identity function around for default iterators.
  _.identity = function(value) {
    return value;
  };

  _.constant = function(value) {
    return function () {
      return value;
    };
  };

  _.property = function(key) {
    return function(obj) {
      return obj[key];
    };
  };

  // Returns a predicate for checking whether an object has a given set of `key:value` pairs.
  _.matches = function(attrs) {
    return function(obj) {
      if (obj === attrs) return true; //avoid comparing an object to itself.
      for (var key in attrs) {
        if (attrs[key] !== obj[key])
          return false;
      }
      return true;
    }
  };

  // Run a function **n** times.
  _.times = function(n, iterator, context) {
    var accum = Array(Math.max(0, n));
    for (var i = 0; i < n; i++) accum[i] = iterator.call(context, i);
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
  _.now = Date.now || function() { return new Date().getTime(); };

  // List of HTML entities for escaping.
  var entityMap = {
    escape: {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#x27;'
    }
  };
  entityMap.unescape = _.invert(entityMap.escape);

  // Regexes containing the keys and values listed immediately above.
  var entityRegexes = {
    escape:   new RegExp('[' + _.keys(entityMap.escape).join('') + ']', 'g'),
    unescape: new RegExp('(' + _.keys(entityMap.unescape).join('|') + ')', 'g')
  };

  // Functions for escaping and unescaping strings to/from HTML interpolation.
  _.each(['escape', 'unescape'], function(method) {
    _[method] = function(string) {
      if (string == null) return '';
      return ('' + string).replace(entityRegexes[method], function(match) {
        return entityMap[method][match];
      });
    };
  });

  // If the value of the named `property` is a function then invoke it with the
  // `object` as context; otherwise, return it.
  _.result = function(object, property) {
    if (object == null) return void 0;
    var value = object[property];
    return _.isFunction(value) ? value.call(object) : value;
  };

  // Add your own custom functions to the Underscore object.
  _.mixin = function(obj) {
    each(_.functions(obj), function(name) {
      var func = _[name] = obj[name];
      _.prototype[name] = function() {
        var args = [this._wrapped];
        push.apply(args, arguments);
        return result.call(this, func.apply(_, args));
      };
    });
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
    '\t':     't',
    '\u2028': 'u2028',
    '\u2029': 'u2029'
  };

  var escaper = /\\|'|\r|\n|\t|\u2028|\u2029/g;

  // JavaScript micro-templating, similar to John Resig's implementation.
  // Underscore templating handles arbitrary delimiters, preserves whitespace,
  // and correctly escapes quotes within interpolated code.
  _.template = function(text, data, settings) {
    var render;
    settings = _.defaults({}, settings, _.templateSettings);

    // Combine delimiters into one regular expression via alternation.
    var matcher = new RegExp([
      (settings.escape || noMatch).source,
      (settings.interpolate || noMatch).source,
      (settings.evaluate || noMatch).source
    ].join('|') + '|$', 'g');

    // Compile the template source, escaping string literals appropriately.
    var index = 0;
    var source = "__p+='";
    text.replace(matcher, function(match, escape, interpolate, evaluate, offset) {
      source += text.slice(index, offset)
        .replace(escaper, function(match) { return '\\' + escapes[match]; });

      if (escape) {
        source += "'+\n((__t=(" + escape + "))==null?'':_.escape(__t))+\n'";
      }
      if (interpolate) {
        source += "'+\n((__t=(" + interpolate + "))==null?'':__t)+\n'";
      }
      if (evaluate) {
        source += "';\n" + evaluate + "\n__p+='";
      }
      index = offset + match.length;
      return match;
    });
    source += "';\n";

    // If a variable is not specified, place data values in local scope.
    if (!settings.variable) source = 'with(obj||{}){\n' + source + '}\n';

    source = "var __t,__p='',__j=Array.prototype.join," +
      "print=function(){__p+=__j.call(arguments,'');};\n" +
      source + "return __p;\n";

    try {
      render = new Function(settings.variable || 'obj', '_', source);
    } catch (e) {
      e.source = source;
      throw e;
    }

    if (data) return render(data, _);
    var template = function(data) {
      return render.call(this, data, _);
    };

    // Provide the compiled function source as a convenience for precompilation.
    template.source = 'function(' + (settings.variable || 'obj') + '){\n' + source + '}';

    return template;
  };

  // Add a "chain" function, which will delegate to the wrapper.
  _.chain = function(obj) {
    return _(obj).chain();
  };

  // OOP
  // ---------------
  // If Underscore is called as a function, it returns a wrapped object that
  // can be used OO-style. This wrapper holds altered versions of all the
  // underscore functions. Wrapped objects may be chained.

  // Helper function to continue chaining intermediate results.
  var result = function(obj) {
    return this._chain ? _(obj).chain() : obj;
  };

  // Add all of the Underscore functions to the wrapper object.
  _.mixin(_);

  // Add all mutator Array functions to the wrapper.
  each(['pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift'], function(name) {
    var method = ArrayProto[name];
    _.prototype[name] = function() {
      var obj = this._wrapped;
      method.apply(obj, arguments);
      if ((name == 'shift' || name == 'splice') && obj.length === 0) delete obj[0];
      return result.call(this, obj);
    };
  });

  // Add all accessor Array functions to the wrapper.
  each(['concat', 'join', 'slice'], function(name) {
    var method = ArrayProto[name];
    _.prototype[name] = function() {
      return result.call(this, method.apply(this._wrapped, arguments));
    };
  });

  _.extend(_.prototype, {

    // Start chaining a wrapped Underscore object.
    chain: function() {
      this._chain = true;
      return this;
    },

    // Extracts the result from a wrapped and chained object.
    value: function() {
      return this._wrapped;
    }

  });

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
}).call(this);

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
    ['$http', 'OAUTHD_URL', function($http, OAUTHD_URL, $log) {
      $http.get(OAUTHD_URL);
    }])
  .controller(
    'photoCtrl',
    ['$scope', '$log', 'Flickr', function($scope, $log, Flickr) {
      var _ = require("./../../bower_components/underscore/underscore.js");
      var specialTag = 'flickrdupfinder';
      $scope.itemsPerPage = 10;
      $scope.maxSize = 10;

      $scope.toggleTag = function(photo) {
        if (photo.duplicate) {
          removeTag(photo);
        } else {
          addTag(photo);
        }
      };

      function addTag(photo) {
        Flickr.get({
          photo_id: photo.id,
          method: 'flickr.photos.addTags',
          tags: specialTag
        }, function() {
          photo.duplicate = true;
          $scope.taggedDuplicate[photo.id] = photo;
        });
      };

      function removeTag(photo) {
        Flickr.get({
          method: 'flickr.photos.getInfo',
          photo_id: photo.id
        }, function(info) {
          var tag = _.find(info.photo.tags.tag,
                           function(tag) {
                             return tag.raw === specialTag;
                           });
          if (tag) {
            Flickr.get({
              method: 'flickr.photos.removeTag',
              photo_id: photo.id,
              tag_id: tag.id
            }, function() {
              photo.duplicate = false;
              $scope.groups[fingerprint(photo)][photo.id] = photo;
              delete $scope.taggedDuplicate[photo.id];
            });
          }
        });
      };

      function checkTag(photo) {
        photo['duplicate'] = _.contains(photo.tags.split(/ /), specialTag);
        return photo;
      }

      function fingerprint(photo) {
        return photo.title.replace(/-[0-9]$/, '') + '##' + photo.datetaken;
      }

      function atLeastTwo(group) {
        return group[1].length > 1;
      }

      function dateTakenIsMostGranular(photo) {
        return true;
        //return photo.datetakengranularity == "0";
      }

      Flickr.get({tags: specialTag}, function(result) {
        var checkedResults = _.map(result.photos.photo, checkTag);
        $scope.taggedDuplicate = _.indexBy(checkedResults, 'id');
      });

      function groupDuplicates(results) {
        var results2 = _.filter(results, dateTakenIsMostGranular);
        var results3 = _.map(results2, checkTag);
        var groups = _.groupBy(results3, fingerprint);
        var groups2 = _.object(_.filter(_.pairs(groups), atLeastTwo));
        $scope.groups = groups2;
        updateVisibleGroups()
      }

      function getPage(page, photosAcc) {
        $scope.page = page;
        Flickr.get({page: page, per_page: 500}, function(result) {
          $scope.totalPages = result.photos.pages;
          var photosAcc2 = photosAcc.concat(result.photos.photo);
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
        $scope.visibleGroups = _.pick($scope.groups, _.keys($scope.groups).slice(first, last));
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
  // jquery from cdn via index.html for now
  // var jQuery = require('jquery');
  // global.jQuery = jQuery;
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
       if ($location.hash() === '') { $location.path('/'); } //so redirect to absUrl() works
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL3RyYXZpcy9idWlsZC9sZWZhbnQvbmctZmxpY2tyZHVwZmluZGVyL25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIuL3NyYy9qYXZhc2NyaXB0L2FwcC5qcyIsIi9ob21lL3RyYXZpcy9idWlsZC9sZWZhbnQvbmctZmxpY2tyZHVwZmluZGVyL2Jvd2VyX2NvbXBvbmVudHMvYW5ndWxhci1yZXNvdXJjZS9hbmd1bGFyLXJlc291cmNlLmpzIiwiL2hvbWUvdHJhdmlzL2J1aWxkL2xlZmFudC9uZy1mbGlja3JkdXBmaW5kZXIvYm93ZXJfY29tcG9uZW50cy9hbmd1bGFyLXJvdXRlL2FuZ3VsYXItcm91dGUuanMiLCIvaG9tZS90cmF2aXMvYnVpbGQvbGVmYW50L25nLWZsaWNrcmR1cGZpbmRlci9ib3dlcl9jb21wb25lbnRzL29hdXRoLWpzL2Rpc3Qvb2F1dGgubWluLmpzIiwiL2hvbWUvdHJhdmlzL2J1aWxkL2xlZmFudC9uZy1mbGlja3JkdXBmaW5kZXIvYm93ZXJfY29tcG9uZW50cy91aS5ib290c3RyYXAvc3JjL3BhZ2luYXRpb24vcGFnaW5hdGlvbi5qcyIsIi9ob21lL3RyYXZpcy9idWlsZC9sZWZhbnQvbmctZmxpY2tyZHVwZmluZGVyL2Jvd2VyX2NvbXBvbmVudHMvdW5kZXJzY29yZS91bmRlcnNjb3JlLmpzIiwiL2hvbWUvdHJhdmlzL2J1aWxkL2xlZmFudC9uZy1mbGlja3JkdXBmaW5kZXIvc3JjL2phdmFzY3JpcHQvY29uZmlnLmpzIiwiL2hvbWUvdHJhdmlzL2J1aWxkL2xlZmFudC9uZy1mbGlja3JkdXBmaW5kZXIvc3JjL2phdmFzY3JpcHQvY29udHJvbGxlcnMuanMiLCIvaG9tZS90cmF2aXMvYnVpbGQvbGVmYW50L25nLWZsaWNrcmR1cGZpbmRlci9zcmMvamF2YXNjcmlwdC9vYXV0aC1zaGltLmpzIiwiL2hvbWUvdHJhdmlzL2J1aWxkL2xlZmFudC9uZy1mbGlja3JkdXBmaW5kZXIvc3JjL2phdmFzY3JpcHQvc2VydmljZXMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3bUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNzVCQTs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ROQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL3pDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIid1c2Ugc3RyaWN0JztcblxucmVxdWlyZShcIi4vLi4vLi4vYm93ZXJfY29tcG9uZW50cy9hbmd1bGFyLXJvdXRlL2FuZ3VsYXItcm91dGUuanNcIik7XG5cbmFuZ3VsYXIubW9kdWxlKCdmbGlja3JEdXBGaW5kZXInLCBbJ25nUm91dGUnLCByZXF1aXJlKCcuL2NvbnRyb2xsZXJzJykubmFtZV0pXG4gIC5jb25maWcoXG4gICAgWyckbG9jYXRpb25Qcm92aWRlcicsICckcm91dGVQcm92aWRlcicsXG4gICAgIGZ1bmN0aW9uKCRsb2NhdGlvblByb3ZpZGVyLCAkcm91dGVQcm92aWRlcikge1xuICAgICAgIC8vJGxvY2F0aW9uUHJvdmlkZXIuaHRtbDVNb2RlKHRydWUpO1xuXG4gICAgICAgLy8gdGhlIG9hdXRoIHJlZGlyZWN0IGNhbGxiYWNrIHBhZ2UgbXVzdCBiZSBtYXRjaGVkIHdpdGggLm90aGVyd2lzZVxuICAgICAgICRyb3V0ZVByb3ZpZGVyXG4gICAgICAgICAud2hlbignLycsIHtcbiAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdwYXJ0aWFscy9zdGFydC5odG1sJyxcbiAgICAgICAgICAgY29udHJvbGxlcjogJ3N0YXJ0Q3RybCdcbiAgICAgICAgIH0pXG4gICAgICAgICAub3RoZXJ3aXNlKHtcbiAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdwYXJ0aWFscy9waG90b3MuaHRtbCcsXG4gICAgICAgICAgIGNvbnRyb2xsZXI6ICdwaG90b0N0cmwnLFxuICAgICAgICAgICByZXNvbHZlOiB7ICdGbGlja3InOiAnRmxpY2tyJyB9XG4gICAgICAgICB9KTtcbiAgICAgfV0pO1xuIiwiLyoqXG4gKiBAbGljZW5zZSBBbmd1bGFySlMgdjEuMi4yNFxuICogKGMpIDIwMTAtMjAxNCBHb29nbGUsIEluYy4gaHR0cDovL2FuZ3VsYXJqcy5vcmdcbiAqIExpY2Vuc2U6IE1JVFxuICovXG4oZnVuY3Rpb24od2luZG93LCBhbmd1bGFyLCB1bmRlZmluZWQpIHsndXNlIHN0cmljdCc7XG5cbnZhciAkcmVzb3VyY2VNaW5FcnIgPSBhbmd1bGFyLiQkbWluRXJyKCckcmVzb3VyY2UnKTtcblxuLy8gSGVscGVyIGZ1bmN0aW9ucyBhbmQgcmVnZXggdG8gbG9va3VwIGEgZG90dGVkIHBhdGggb24gYW4gb2JqZWN0XG4vLyBzdG9wcGluZyBhdCB1bmRlZmluZWQvbnVsbC4gIFRoZSBwYXRoIG11c3QgYmUgY29tcG9zZWQgb2YgQVNDSUlcbi8vIGlkZW50aWZpZXJzIChqdXN0IGxpa2UgJHBhcnNlKVxudmFyIE1FTUJFUl9OQU1FX1JFR0VYID0gL14oXFwuW2EtekEtWl8kXVswLTlhLXpBLVpfJF0qKSskLztcblxuZnVuY3Rpb24gaXNWYWxpZERvdHRlZFBhdGgocGF0aCkge1xuICByZXR1cm4gKHBhdGggIT0gbnVsbCAmJiBwYXRoICE9PSAnJyAmJiBwYXRoICE9PSAnaGFzT3duUHJvcGVydHknICYmXG4gICAgICBNRU1CRVJfTkFNRV9SRUdFWC50ZXN0KCcuJyArIHBhdGgpKTtcbn1cblxuZnVuY3Rpb24gbG9va3VwRG90dGVkUGF0aChvYmosIHBhdGgpIHtcbiAgaWYgKCFpc1ZhbGlkRG90dGVkUGF0aChwYXRoKSkge1xuICAgIHRocm93ICRyZXNvdXJjZU1pbkVycignYmFkbWVtYmVyJywgJ0RvdHRlZCBtZW1iZXIgcGF0aCBcIkB7MH1cIiBpcyBpbnZhbGlkLicsIHBhdGgpO1xuICB9XG4gIHZhciBrZXlzID0gcGF0aC5zcGxpdCgnLicpO1xuICBmb3IgKHZhciBpID0gMCwgaWkgPSBrZXlzLmxlbmd0aDsgaSA8IGlpICYmIG9iaiAhPT0gdW5kZWZpbmVkOyBpKyspIHtcbiAgICB2YXIga2V5ID0ga2V5c1tpXTtcbiAgICBvYmogPSAob2JqICE9PSBudWxsKSA/IG9ialtrZXldIDogdW5kZWZpbmVkO1xuICB9XG4gIHJldHVybiBvYmo7XG59XG5cbi8qKlxuICogQ3JlYXRlIGEgc2hhbGxvdyBjb3B5IG9mIGFuIG9iamVjdCBhbmQgY2xlYXIgb3RoZXIgZmllbGRzIGZyb20gdGhlIGRlc3RpbmF0aW9uXG4gKi9cbmZ1bmN0aW9uIHNoYWxsb3dDbGVhckFuZENvcHkoc3JjLCBkc3QpIHtcbiAgZHN0ID0gZHN0IHx8IHt9O1xuXG4gIGFuZ3VsYXIuZm9yRWFjaChkc3QsIGZ1bmN0aW9uKHZhbHVlLCBrZXkpe1xuICAgIGRlbGV0ZSBkc3Rba2V5XTtcbiAgfSk7XG5cbiAgZm9yICh2YXIga2V5IGluIHNyYykge1xuICAgIGlmIChzcmMuaGFzT3duUHJvcGVydHkoa2V5KSAmJiAhKGtleS5jaGFyQXQoMCkgPT09ICckJyAmJiBrZXkuY2hhckF0KDEpID09PSAnJCcpKSB7XG4gICAgICBkc3Rba2V5XSA9IHNyY1trZXldO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBkc3Q7XG59XG5cbi8qKlxuICogQG5nZG9jIG1vZHVsZVxuICogQG5hbWUgbmdSZXNvdXJjZVxuICogQGRlc2NyaXB0aW9uXG4gKlxuICogIyBuZ1Jlc291cmNlXG4gKlxuICogVGhlIGBuZ1Jlc291cmNlYCBtb2R1bGUgcHJvdmlkZXMgaW50ZXJhY3Rpb24gc3VwcG9ydCB3aXRoIFJFU1RmdWwgc2VydmljZXNcbiAqIHZpYSB0aGUgJHJlc291cmNlIHNlcnZpY2UuXG4gKlxuICpcbiAqIDxkaXYgZG9jLW1vZHVsZS1jb21wb25lbnRzPVwibmdSZXNvdXJjZVwiPjwvZGl2PlxuICpcbiAqIFNlZSB7QGxpbmsgbmdSZXNvdXJjZS4kcmVzb3VyY2UgYCRyZXNvdXJjZWB9IGZvciB1c2FnZS5cbiAqL1xuXG4vKipcbiAqIEBuZ2RvYyBzZXJ2aWNlXG4gKiBAbmFtZSAkcmVzb3VyY2VcbiAqIEByZXF1aXJlcyAkaHR0cFxuICpcbiAqIEBkZXNjcmlwdGlvblxuICogQSBmYWN0b3J5IHdoaWNoIGNyZWF0ZXMgYSByZXNvdXJjZSBvYmplY3QgdGhhdCBsZXRzIHlvdSBpbnRlcmFjdCB3aXRoXG4gKiBbUkVTVGZ1bF0oaHR0cDovL2VuLndpa2lwZWRpYS5vcmcvd2lraS9SZXByZXNlbnRhdGlvbmFsX1N0YXRlX1RyYW5zZmVyKSBzZXJ2ZXItc2lkZSBkYXRhIHNvdXJjZXMuXG4gKlxuICogVGhlIHJldHVybmVkIHJlc291cmNlIG9iamVjdCBoYXMgYWN0aW9uIG1ldGhvZHMgd2hpY2ggcHJvdmlkZSBoaWdoLWxldmVsIGJlaGF2aW9ycyB3aXRob3V0XG4gKiB0aGUgbmVlZCB0byBpbnRlcmFjdCB3aXRoIHRoZSBsb3cgbGV2ZWwge0BsaW5rIG5nLiRodHRwICRodHRwfSBzZXJ2aWNlLlxuICpcbiAqIFJlcXVpcmVzIHRoZSB7QGxpbmsgbmdSZXNvdXJjZSBgbmdSZXNvdXJjZWB9IG1vZHVsZSB0byBiZSBpbnN0YWxsZWQuXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IHVybCBBIHBhcmFtZXRyaXplZCBVUkwgdGVtcGxhdGUgd2l0aCBwYXJhbWV0ZXJzIHByZWZpeGVkIGJ5IGA6YCBhcyBpblxuICogICBgL3VzZXIvOnVzZXJuYW1lYC4gSWYgeW91IGFyZSB1c2luZyBhIFVSTCB3aXRoIGEgcG9ydCBudW1iZXIgKGUuZy5cbiAqICAgYGh0dHA6Ly9leGFtcGxlLmNvbTo4MDgwL2FwaWApLCBpdCB3aWxsIGJlIHJlc3BlY3RlZC5cbiAqXG4gKiAgIElmIHlvdSBhcmUgdXNpbmcgYSB1cmwgd2l0aCBhIHN1ZmZpeCwganVzdCBhZGQgdGhlIHN1ZmZpeCwgbGlrZSB0aGlzOlxuICogICBgJHJlc291cmNlKCdodHRwOi8vZXhhbXBsZS5jb20vcmVzb3VyY2UuanNvbicpYCBvciBgJHJlc291cmNlKCdodHRwOi8vZXhhbXBsZS5jb20vOmlkLmpzb24nKWBcbiAqICAgb3IgZXZlbiBgJHJlc291cmNlKCdodHRwOi8vZXhhbXBsZS5jb20vcmVzb3VyY2UvOnJlc291cmNlX2lkLjpmb3JtYXQnKWBcbiAqICAgSWYgdGhlIHBhcmFtZXRlciBiZWZvcmUgdGhlIHN1ZmZpeCBpcyBlbXB0eSwgOnJlc291cmNlX2lkIGluIHRoaXMgY2FzZSwgdGhlbiB0aGUgYC8uYCB3aWxsIGJlXG4gKiAgIGNvbGxhcHNlZCBkb3duIHRvIGEgc2luZ2xlIGAuYC4gIElmIHlvdSBuZWVkIHRoaXMgc2VxdWVuY2UgdG8gYXBwZWFyIGFuZCBub3QgY29sbGFwc2UgdGhlbiB5b3VcbiAqICAgY2FuIGVzY2FwZSBpdCB3aXRoIGAvXFwuYC5cbiAqXG4gKiBAcGFyYW0ge09iamVjdD19IHBhcmFtRGVmYXVsdHMgRGVmYXVsdCB2YWx1ZXMgZm9yIGB1cmxgIHBhcmFtZXRlcnMuIFRoZXNlIGNhbiBiZSBvdmVycmlkZGVuIGluXG4gKiAgIGBhY3Rpb25zYCBtZXRob2RzLiBJZiBhbnkgb2YgdGhlIHBhcmFtZXRlciB2YWx1ZSBpcyBhIGZ1bmN0aW9uLCBpdCB3aWxsIGJlIGV4ZWN1dGVkIGV2ZXJ5IHRpbWVcbiAqICAgd2hlbiBhIHBhcmFtIHZhbHVlIG5lZWRzIHRvIGJlIG9idGFpbmVkIGZvciBhIHJlcXVlc3QgKHVubGVzcyB0aGUgcGFyYW0gd2FzIG92ZXJyaWRkZW4pLlxuICpcbiAqICAgRWFjaCBrZXkgdmFsdWUgaW4gdGhlIHBhcmFtZXRlciBvYmplY3QgaXMgZmlyc3QgYm91bmQgdG8gdXJsIHRlbXBsYXRlIGlmIHByZXNlbnQgYW5kIHRoZW4gYW55XG4gKiAgIGV4Y2VzcyBrZXlzIGFyZSBhcHBlbmRlZCB0byB0aGUgdXJsIHNlYXJjaCBxdWVyeSBhZnRlciB0aGUgYD9gLlxuICpcbiAqICAgR2l2ZW4gYSB0ZW1wbGF0ZSBgL3BhdGgvOnZlcmJgIGFuZCBwYXJhbWV0ZXIgYHt2ZXJiOidncmVldCcsIHNhbHV0YXRpb246J0hlbGxvJ31gIHJlc3VsdHMgaW5cbiAqICAgVVJMIGAvcGF0aC9ncmVldD9zYWx1dGF0aW9uPUhlbGxvYC5cbiAqXG4gKiAgIElmIHRoZSBwYXJhbWV0ZXIgdmFsdWUgaXMgcHJlZml4ZWQgd2l0aCBgQGAgdGhlbiB0aGUgdmFsdWUgZm9yIHRoYXQgcGFyYW1ldGVyIHdpbGwgYmUgZXh0cmFjdGVkXG4gKiAgIGZyb20gdGhlIGNvcnJlc3BvbmRpbmcgcHJvcGVydHkgb24gdGhlIGBkYXRhYCBvYmplY3QgKHByb3ZpZGVkIHdoZW4gY2FsbGluZyBhbiBhY3Rpb24gbWV0aG9kKS4gIEZvclxuICogICBleGFtcGxlLCBpZiB0aGUgYGRlZmF1bHRQYXJhbWAgb2JqZWN0IGlzIGB7c29tZVBhcmFtOiAnQHNvbWVQcm9wJ31gIHRoZW4gdGhlIHZhbHVlIG9mIGBzb21lUGFyYW1gXG4gKiAgIHdpbGwgYmUgYGRhdGEuc29tZVByb3BgLlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0LjxPYmplY3Q+PX0gYWN0aW9ucyBIYXNoIHdpdGggZGVjbGFyYXRpb24gb2YgY3VzdG9tIGFjdGlvbiB0aGF0IHNob3VsZCBleHRlbmRcbiAqICAgdGhlIGRlZmF1bHQgc2V0IG9mIHJlc291cmNlIGFjdGlvbnMuIFRoZSBkZWNsYXJhdGlvbiBzaG91bGQgYmUgY3JlYXRlZCBpbiB0aGUgZm9ybWF0IG9mIHtAbGlua1xuICogICBuZy4kaHR0cCN1c2FnZV9wYXJhbWV0ZXJzICRodHRwLmNvbmZpZ306XG4gKlxuICogICAgICAge2FjdGlvbjE6IHttZXRob2Q6PywgcGFyYW1zOj8sIGlzQXJyYXk6PywgaGVhZGVyczo/LCAuLi59LFxuICogICAgICAgIGFjdGlvbjI6IHttZXRob2Q6PywgcGFyYW1zOj8sIGlzQXJyYXk6PywgaGVhZGVyczo/LCAuLi59LFxuICogICAgICAgIC4uLn1cbiAqXG4gKiAgIFdoZXJlOlxuICpcbiAqICAgLSAqKmBhY3Rpb25gKiog4oCTIHtzdHJpbmd9IOKAkyBUaGUgbmFtZSBvZiBhY3Rpb24uIFRoaXMgbmFtZSBiZWNvbWVzIHRoZSBuYW1lIG9mIHRoZSBtZXRob2Qgb25cbiAqICAgICB5b3VyIHJlc291cmNlIG9iamVjdC5cbiAqICAgLSAqKmBtZXRob2RgKiog4oCTIHtzdHJpbmd9IOKAkyBDYXNlIGluc2Vuc2l0aXZlIEhUVFAgbWV0aG9kIChlLmcuIGBHRVRgLCBgUE9TVGAsIGBQVVRgLFxuICogICAgIGBERUxFVEVgLCBgSlNPTlBgLCBldGMpLlxuICogICAtICoqYHBhcmFtc2AqKiDigJMge09iamVjdD19IOKAkyBPcHRpb25hbCBzZXQgb2YgcHJlLWJvdW5kIHBhcmFtZXRlcnMgZm9yIHRoaXMgYWN0aW9uLiBJZiBhbnkgb2ZcbiAqICAgICB0aGUgcGFyYW1ldGVyIHZhbHVlIGlzIGEgZnVuY3Rpb24sIGl0IHdpbGwgYmUgZXhlY3V0ZWQgZXZlcnkgdGltZSB3aGVuIGEgcGFyYW0gdmFsdWUgbmVlZHMgdG9cbiAqICAgICBiZSBvYnRhaW5lZCBmb3IgYSByZXF1ZXN0ICh1bmxlc3MgdGhlIHBhcmFtIHdhcyBvdmVycmlkZGVuKS5cbiAqICAgLSAqKmB1cmxgKiog4oCTIHtzdHJpbmd9IOKAkyBhY3Rpb24gc3BlY2lmaWMgYHVybGAgb3ZlcnJpZGUuIFRoZSB1cmwgdGVtcGxhdGluZyBpcyBzdXBwb3J0ZWQganVzdFxuICogICAgIGxpa2UgZm9yIHRoZSByZXNvdXJjZS1sZXZlbCB1cmxzLlxuICogICAtICoqYGlzQXJyYXlgKiog4oCTIHtib29sZWFuPX0g4oCTIElmIHRydWUgdGhlbiB0aGUgcmV0dXJuZWQgb2JqZWN0IGZvciB0aGlzIGFjdGlvbiBpcyBhbiBhcnJheSxcbiAqICAgICBzZWUgYHJldHVybnNgIHNlY3Rpb24uXG4gKiAgIC0gKipgdHJhbnNmb3JtUmVxdWVzdGAqKiDigJNcbiAqICAgICBge2Z1bmN0aW9uKGRhdGEsIGhlYWRlcnNHZXR0ZXIpfEFycmF5LjxmdW5jdGlvbihkYXRhLCBoZWFkZXJzR2V0dGVyKT59YCDigJNcbiAqICAgICB0cmFuc2Zvcm0gZnVuY3Rpb24gb3IgYW4gYXJyYXkgb2Ygc3VjaCBmdW5jdGlvbnMuIFRoZSB0cmFuc2Zvcm0gZnVuY3Rpb24gdGFrZXMgdGhlIGh0dHBcbiAqICAgICByZXF1ZXN0IGJvZHkgYW5kIGhlYWRlcnMgYW5kIHJldHVybnMgaXRzIHRyYW5zZm9ybWVkICh0eXBpY2FsbHkgc2VyaWFsaXplZCkgdmVyc2lvbi5cbiAqICAgLSAqKmB0cmFuc2Zvcm1SZXNwb25zZWAqKiDigJNcbiAqICAgICBge2Z1bmN0aW9uKGRhdGEsIGhlYWRlcnNHZXR0ZXIpfEFycmF5LjxmdW5jdGlvbihkYXRhLCBoZWFkZXJzR2V0dGVyKT59YCDigJNcbiAqICAgICB0cmFuc2Zvcm0gZnVuY3Rpb24gb3IgYW4gYXJyYXkgb2Ygc3VjaCBmdW5jdGlvbnMuIFRoZSB0cmFuc2Zvcm0gZnVuY3Rpb24gdGFrZXMgdGhlIGh0dHBcbiAqICAgICByZXNwb25zZSBib2R5IGFuZCBoZWFkZXJzIGFuZCByZXR1cm5zIGl0cyB0cmFuc2Zvcm1lZCAodHlwaWNhbGx5IGRlc2VyaWFsaXplZCkgdmVyc2lvbi5cbiAqICAgLSAqKmBjYWNoZWAqKiDigJMgYHtib29sZWFufENhY2hlfWAg4oCTIElmIHRydWUsIGEgZGVmYXVsdCAkaHR0cCBjYWNoZSB3aWxsIGJlIHVzZWQgdG8gY2FjaGUgdGhlXG4gKiAgICAgR0VUIHJlcXVlc3QsIG90aGVyd2lzZSBpZiBhIGNhY2hlIGluc3RhbmNlIGJ1aWx0IHdpdGhcbiAqICAgICB7QGxpbmsgbmcuJGNhY2hlRmFjdG9yeSAkY2FjaGVGYWN0b3J5fSwgdGhpcyBjYWNoZSB3aWxsIGJlIHVzZWQgZm9yXG4gKiAgICAgY2FjaGluZy5cbiAqICAgLSAqKmB0aW1lb3V0YCoqIOKAkyBge251bWJlcnxQcm9taXNlfWAg4oCTIHRpbWVvdXQgaW4gbWlsbGlzZWNvbmRzLCBvciB7QGxpbmsgbmcuJHEgcHJvbWlzZX0gdGhhdFxuICogICAgIHNob3VsZCBhYm9ydCB0aGUgcmVxdWVzdCB3aGVuIHJlc29sdmVkLlxuICogICAtICoqYHdpdGhDcmVkZW50aWFsc2AqKiAtIGB7Ym9vbGVhbn1gIC0gd2hldGhlciB0byBzZXQgdGhlIGB3aXRoQ3JlZGVudGlhbHNgIGZsYWcgb24gdGhlXG4gKiAgICAgWEhSIG9iamVjdC4gU2VlXG4gKiAgICAgW3JlcXVlc3RzIHdpdGggY3JlZGVudGlhbHNdKGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuL2h0dHBfYWNjZXNzX2NvbnRyb2wjc2VjdGlvbl81KVxuICogICAgIGZvciBtb3JlIGluZm9ybWF0aW9uLlxuICogICAtICoqYHJlc3BvbnNlVHlwZWAqKiAtIGB7c3RyaW5nfWAgLSBzZWVcbiAqICAgICBbcmVxdWVzdFR5cGVdKGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvRE9NL1hNTEh0dHBSZXF1ZXN0I3Jlc3BvbnNlVHlwZSkuXG4gKiAgIC0gKipgaW50ZXJjZXB0b3JgKiogLSBge09iamVjdD19YCAtIFRoZSBpbnRlcmNlcHRvciBvYmplY3QgaGFzIHR3byBvcHRpb25hbCBtZXRob2RzIC1cbiAqICAgICBgcmVzcG9uc2VgIGFuZCBgcmVzcG9uc2VFcnJvcmAuIEJvdGggYHJlc3BvbnNlYCBhbmQgYHJlc3BvbnNlRXJyb3JgIGludGVyY2VwdG9ycyBnZXQgY2FsbGVkXG4gKiAgICAgd2l0aCBgaHR0cCByZXNwb25zZWAgb2JqZWN0LiBTZWUge0BsaW5rIG5nLiRodHRwICRodHRwIGludGVyY2VwdG9yc30uXG4gKlxuICogQHJldHVybnMge09iamVjdH0gQSByZXNvdXJjZSBcImNsYXNzXCIgb2JqZWN0IHdpdGggbWV0aG9kcyBmb3IgdGhlIGRlZmF1bHQgc2V0IG9mIHJlc291cmNlIGFjdGlvbnNcbiAqICAgb3B0aW9uYWxseSBleHRlbmRlZCB3aXRoIGN1c3RvbSBgYWN0aW9uc2AuIFRoZSBkZWZhdWx0IHNldCBjb250YWlucyB0aGVzZSBhY3Rpb25zOlxuICogICBgYGBqc1xuICogICB7ICdnZXQnOiAgICB7bWV0aG9kOidHRVQnfSxcbiAqICAgICAnc2F2ZSc6ICAge21ldGhvZDonUE9TVCd9LFxuICogICAgICdxdWVyeSc6ICB7bWV0aG9kOidHRVQnLCBpc0FycmF5OnRydWV9LFxuICogICAgICdyZW1vdmUnOiB7bWV0aG9kOidERUxFVEUnfSxcbiAqICAgICAnZGVsZXRlJzoge21ldGhvZDonREVMRVRFJ30gfTtcbiAqICAgYGBgXG4gKlxuICogICBDYWxsaW5nIHRoZXNlIG1ldGhvZHMgaW52b2tlIGFuIHtAbGluayBuZy4kaHR0cH0gd2l0aCB0aGUgc3BlY2lmaWVkIGh0dHAgbWV0aG9kLFxuICogICBkZXN0aW5hdGlvbiBhbmQgcGFyYW1ldGVycy4gV2hlbiB0aGUgZGF0YSBpcyByZXR1cm5lZCBmcm9tIHRoZSBzZXJ2ZXIgdGhlbiB0aGUgb2JqZWN0IGlzIGFuXG4gKiAgIGluc3RhbmNlIG9mIHRoZSByZXNvdXJjZSBjbGFzcy4gVGhlIGFjdGlvbnMgYHNhdmVgLCBgcmVtb3ZlYCBhbmQgYGRlbGV0ZWAgYXJlIGF2YWlsYWJsZSBvbiBpdFxuICogICBhcyAgbWV0aG9kcyB3aXRoIHRoZSBgJGAgcHJlZml4LiBUaGlzIGFsbG93cyB5b3UgdG8gZWFzaWx5IHBlcmZvcm0gQ1JVRCBvcGVyYXRpb25zIChjcmVhdGUsXG4gKiAgIHJlYWQsIHVwZGF0ZSwgZGVsZXRlKSBvbiBzZXJ2ZXItc2lkZSBkYXRhIGxpa2UgdGhpczpcbiAqICAgYGBganNcbiAqICAgdmFyIFVzZXIgPSAkcmVzb3VyY2UoJy91c2VyLzp1c2VySWQnLCB7dXNlcklkOidAaWQnfSk7XG4gKiAgIHZhciB1c2VyID0gVXNlci5nZXQoe3VzZXJJZDoxMjN9LCBmdW5jdGlvbigpIHtcbiAqICAgICB1c2VyLmFiYyA9IHRydWU7XG4gKiAgICAgdXNlci4kc2F2ZSgpO1xuICogICB9KTtcbiAqICAgYGBgXG4gKlxuICogICBJdCBpcyBpbXBvcnRhbnQgdG8gcmVhbGl6ZSB0aGF0IGludm9raW5nIGEgJHJlc291cmNlIG9iamVjdCBtZXRob2QgaW1tZWRpYXRlbHkgcmV0dXJucyBhblxuICogICBlbXB0eSByZWZlcmVuY2UgKG9iamVjdCBvciBhcnJheSBkZXBlbmRpbmcgb24gYGlzQXJyYXlgKS4gT25jZSB0aGUgZGF0YSBpcyByZXR1cm5lZCBmcm9tIHRoZVxuICogICBzZXJ2ZXIgdGhlIGV4aXN0aW5nIHJlZmVyZW5jZSBpcyBwb3B1bGF0ZWQgd2l0aCB0aGUgYWN0dWFsIGRhdGEuIFRoaXMgaXMgYSB1c2VmdWwgdHJpY2sgc2luY2VcbiAqICAgdXN1YWxseSB0aGUgcmVzb3VyY2UgaXMgYXNzaWduZWQgdG8gYSBtb2RlbCB3aGljaCBpcyB0aGVuIHJlbmRlcmVkIGJ5IHRoZSB2aWV3LiBIYXZpbmcgYW4gZW1wdHlcbiAqICAgb2JqZWN0IHJlc3VsdHMgaW4gbm8gcmVuZGVyaW5nLCBvbmNlIHRoZSBkYXRhIGFycml2ZXMgZnJvbSB0aGUgc2VydmVyIHRoZW4gdGhlIG9iamVjdCBpc1xuICogICBwb3B1bGF0ZWQgd2l0aCB0aGUgZGF0YSBhbmQgdGhlIHZpZXcgYXV0b21hdGljYWxseSByZS1yZW5kZXJzIGl0c2VsZiBzaG93aW5nIHRoZSBuZXcgZGF0YS4gVGhpc1xuICogICBtZWFucyB0aGF0IGluIG1vc3QgY2FzZXMgb25lIG5ldmVyIGhhcyB0byB3cml0ZSBhIGNhbGxiYWNrIGZ1bmN0aW9uIGZvciB0aGUgYWN0aW9uIG1ldGhvZHMuXG4gKlxuICogICBUaGUgYWN0aW9uIG1ldGhvZHMgb24gdGhlIGNsYXNzIG9iamVjdCBvciBpbnN0YW5jZSBvYmplY3QgY2FuIGJlIGludm9rZWQgd2l0aCB0aGUgZm9sbG93aW5nXG4gKiAgIHBhcmFtZXRlcnM6XG4gKlxuICogICAtIEhUVFAgR0VUIFwiY2xhc3NcIiBhY3Rpb25zOiBgUmVzb3VyY2UuYWN0aW9uKFtwYXJhbWV0ZXJzXSwgW3N1Y2Nlc3NdLCBbZXJyb3JdKWBcbiAqICAgLSBub24tR0VUIFwiY2xhc3NcIiBhY3Rpb25zOiBgUmVzb3VyY2UuYWN0aW9uKFtwYXJhbWV0ZXJzXSwgcG9zdERhdGEsIFtzdWNjZXNzXSwgW2Vycm9yXSlgXG4gKiAgIC0gbm9uLUdFVCBpbnN0YW5jZSBhY3Rpb25zOiAgYGluc3RhbmNlLiRhY3Rpb24oW3BhcmFtZXRlcnNdLCBbc3VjY2Vzc10sIFtlcnJvcl0pYFxuICpcbiAqICAgU3VjY2VzcyBjYWxsYmFjayBpcyBjYWxsZWQgd2l0aCAodmFsdWUsIHJlc3BvbnNlSGVhZGVycykgYXJndW1lbnRzLiBFcnJvciBjYWxsYmFjayBpcyBjYWxsZWRcbiAqICAgd2l0aCAoaHR0cFJlc3BvbnNlKSBhcmd1bWVudC5cbiAqXG4gKiAgIENsYXNzIGFjdGlvbnMgcmV0dXJuIGVtcHR5IGluc3RhbmNlICh3aXRoIGFkZGl0aW9uYWwgcHJvcGVydGllcyBiZWxvdykuXG4gKiAgIEluc3RhbmNlIGFjdGlvbnMgcmV0dXJuIHByb21pc2Ugb2YgdGhlIGFjdGlvbi5cbiAqXG4gKiAgIFRoZSBSZXNvdXJjZSBpbnN0YW5jZXMgYW5kIGNvbGxlY3Rpb24gaGF2ZSB0aGVzZSBhZGRpdGlvbmFsIHByb3BlcnRpZXM6XG4gKlxuICogICAtIGAkcHJvbWlzZWA6IHRoZSB7QGxpbmsgbmcuJHEgcHJvbWlzZX0gb2YgdGhlIG9yaWdpbmFsIHNlcnZlciBpbnRlcmFjdGlvbiB0aGF0IGNyZWF0ZWQgdGhpc1xuICogICAgIGluc3RhbmNlIG9yIGNvbGxlY3Rpb24uXG4gKlxuICogICAgIE9uIHN1Y2Nlc3MsIHRoZSBwcm9taXNlIGlzIHJlc29sdmVkIHdpdGggdGhlIHNhbWUgcmVzb3VyY2UgaW5zdGFuY2Ugb3IgY29sbGVjdGlvbiBvYmplY3QsXG4gKiAgICAgdXBkYXRlZCB3aXRoIGRhdGEgZnJvbSBzZXJ2ZXIuIFRoaXMgbWFrZXMgaXQgZWFzeSB0byB1c2UgaW5cbiAqICAgICB7QGxpbmsgbmdSb3V0ZS4kcm91dGVQcm92aWRlciByZXNvbHZlIHNlY3Rpb24gb2YgJHJvdXRlUHJvdmlkZXIud2hlbigpfSB0byBkZWZlciB2aWV3XG4gKiAgICAgcmVuZGVyaW5nIHVudGlsIHRoZSByZXNvdXJjZShzKSBhcmUgbG9hZGVkLlxuICpcbiAqICAgICBPbiBmYWlsdXJlLCB0aGUgcHJvbWlzZSBpcyByZXNvbHZlZCB3aXRoIHRoZSB7QGxpbmsgbmcuJGh0dHAgaHR0cCByZXNwb25zZX0gb2JqZWN0LCB3aXRob3V0XG4gKiAgICAgdGhlIGByZXNvdXJjZWAgcHJvcGVydHkuXG4gKlxuICogICAgIElmIGFuIGludGVyY2VwdG9yIG9iamVjdCB3YXMgcHJvdmlkZWQsIHRoZSBwcm9taXNlIHdpbGwgaW5zdGVhZCBiZSByZXNvbHZlZCB3aXRoIHRoZSB2YWx1ZVxuICogICAgIHJldHVybmVkIGJ5IHRoZSBpbnRlcmNlcHRvci5cbiAqXG4gKiAgIC0gYCRyZXNvbHZlZGA6IGB0cnVlYCBhZnRlciBmaXJzdCBzZXJ2ZXIgaW50ZXJhY3Rpb24gaXMgY29tcGxldGVkIChlaXRoZXIgd2l0aCBzdWNjZXNzIG9yXG4gKiAgICAgIHJlamVjdGlvbiksIGBmYWxzZWAgYmVmb3JlIHRoYXQuIEtub3dpbmcgaWYgdGhlIFJlc291cmNlIGhhcyBiZWVuIHJlc29sdmVkIGlzIHVzZWZ1bCBpblxuICogICAgICBkYXRhLWJpbmRpbmcuXG4gKlxuICogQGV4YW1wbGVcbiAqXG4gKiAjIENyZWRpdCBjYXJkIHJlc291cmNlXG4gKlxuICogYGBganNcbiAgICAgLy8gRGVmaW5lIENyZWRpdENhcmQgY2xhc3NcbiAgICAgdmFyIENyZWRpdENhcmQgPSAkcmVzb3VyY2UoJy91c2VyLzp1c2VySWQvY2FyZC86Y2FyZElkJyxcbiAgICAgIHt1c2VySWQ6MTIzLCBjYXJkSWQ6J0BpZCd9LCB7XG4gICAgICAgY2hhcmdlOiB7bWV0aG9kOidQT1NUJywgcGFyYW1zOntjaGFyZ2U6dHJ1ZX19XG4gICAgICB9KTtcblxuICAgICAvLyBXZSBjYW4gcmV0cmlldmUgYSBjb2xsZWN0aW9uIGZyb20gdGhlIHNlcnZlclxuICAgICB2YXIgY2FyZHMgPSBDcmVkaXRDYXJkLnF1ZXJ5KGZ1bmN0aW9uKCkge1xuICAgICAgIC8vIEdFVDogL3VzZXIvMTIzL2NhcmRcbiAgICAgICAvLyBzZXJ2ZXIgcmV0dXJuczogWyB7aWQ6NDU2LCBudW1iZXI6JzEyMzQnLCBuYW1lOidTbWl0aCd9IF07XG5cbiAgICAgICB2YXIgY2FyZCA9IGNhcmRzWzBdO1xuICAgICAgIC8vIGVhY2ggaXRlbSBpcyBhbiBpbnN0YW5jZSBvZiBDcmVkaXRDYXJkXG4gICAgICAgZXhwZWN0KGNhcmQgaW5zdGFuY2VvZiBDcmVkaXRDYXJkKS50b0VxdWFsKHRydWUpO1xuICAgICAgIGNhcmQubmFtZSA9IFwiSi4gU21pdGhcIjtcbiAgICAgICAvLyBub24gR0VUIG1ldGhvZHMgYXJlIG1hcHBlZCBvbnRvIHRoZSBpbnN0YW5jZXNcbiAgICAgICBjYXJkLiRzYXZlKCk7XG4gICAgICAgLy8gUE9TVDogL3VzZXIvMTIzL2NhcmQvNDU2IHtpZDo0NTYsIG51bWJlcjonMTIzNCcsIG5hbWU6J0ouIFNtaXRoJ31cbiAgICAgICAvLyBzZXJ2ZXIgcmV0dXJuczoge2lkOjQ1NiwgbnVtYmVyOicxMjM0JywgbmFtZTogJ0ouIFNtaXRoJ307XG5cbiAgICAgICAvLyBvdXIgY3VzdG9tIG1ldGhvZCBpcyBtYXBwZWQgYXMgd2VsbC5cbiAgICAgICBjYXJkLiRjaGFyZ2Uoe2Ftb3VudDo5Ljk5fSk7XG4gICAgICAgLy8gUE9TVDogL3VzZXIvMTIzL2NhcmQvNDU2P2Ftb3VudD05Ljk5JmNoYXJnZT10cnVlIHtpZDo0NTYsIG51bWJlcjonMTIzNCcsIG5hbWU6J0ouIFNtaXRoJ31cbiAgICAgfSk7XG5cbiAgICAgLy8gd2UgY2FuIGNyZWF0ZSBhbiBpbnN0YW5jZSBhcyB3ZWxsXG4gICAgIHZhciBuZXdDYXJkID0gbmV3IENyZWRpdENhcmQoe251bWJlcjonMDEyMyd9KTtcbiAgICAgbmV3Q2FyZC5uYW1lID0gXCJNaWtlIFNtaXRoXCI7XG4gICAgIG5ld0NhcmQuJHNhdmUoKTtcbiAgICAgLy8gUE9TVDogL3VzZXIvMTIzL2NhcmQge251bWJlcjonMDEyMycsIG5hbWU6J01pa2UgU21pdGgnfVxuICAgICAvLyBzZXJ2ZXIgcmV0dXJuczoge2lkOjc4OSwgbnVtYmVyOicwMTIzJywgbmFtZTogJ01pa2UgU21pdGgnfTtcbiAgICAgZXhwZWN0KG5ld0NhcmQuaWQpLnRvRXF1YWwoNzg5KTtcbiAqIGBgYFxuICpcbiAqIFRoZSBvYmplY3QgcmV0dXJuZWQgZnJvbSB0aGlzIGZ1bmN0aW9uIGV4ZWN1dGlvbiBpcyBhIHJlc291cmNlIFwiY2xhc3NcIiB3aGljaCBoYXMgXCJzdGF0aWNcIiBtZXRob2RcbiAqIGZvciBlYWNoIGFjdGlvbiBpbiB0aGUgZGVmaW5pdGlvbi5cbiAqXG4gKiBDYWxsaW5nIHRoZXNlIG1ldGhvZHMgaW52b2tlIGAkaHR0cGAgb24gdGhlIGB1cmxgIHRlbXBsYXRlIHdpdGggdGhlIGdpdmVuIGBtZXRob2RgLCBgcGFyYW1zYCBhbmRcbiAqIGBoZWFkZXJzYC5cbiAqIFdoZW4gdGhlIGRhdGEgaXMgcmV0dXJuZWQgZnJvbSB0aGUgc2VydmVyIHRoZW4gdGhlIG9iamVjdCBpcyBhbiBpbnN0YW5jZSBvZiB0aGUgcmVzb3VyY2UgdHlwZSBhbmRcbiAqIGFsbCBvZiB0aGUgbm9uLUdFVCBtZXRob2RzIGFyZSBhdmFpbGFibGUgd2l0aCBgJGAgcHJlZml4LiBUaGlzIGFsbG93cyB5b3UgdG8gZWFzaWx5IHN1cHBvcnQgQ1JVRFxuICogb3BlcmF0aW9ucyAoY3JlYXRlLCByZWFkLCB1cGRhdGUsIGRlbGV0ZSkgb24gc2VydmVyLXNpZGUgZGF0YS5cblxuICAgYGBganNcbiAgICAgdmFyIFVzZXIgPSAkcmVzb3VyY2UoJy91c2VyLzp1c2VySWQnLCB7dXNlcklkOidAaWQnfSk7XG4gICAgIFVzZXIuZ2V0KHt1c2VySWQ6MTIzfSwgZnVuY3Rpb24odXNlcikge1xuICAgICAgIHVzZXIuYWJjID0gdHJ1ZTtcbiAgICAgICB1c2VyLiRzYXZlKCk7XG4gICAgIH0pO1xuICAgYGBgXG4gKlxuICogSXQncyB3b3J0aCBub3RpbmcgdGhhdCB0aGUgc3VjY2VzcyBjYWxsYmFjayBmb3IgYGdldGAsIGBxdWVyeWAgYW5kIG90aGVyIG1ldGhvZHMgZ2V0cyBwYXNzZWRcbiAqIGluIHRoZSByZXNwb25zZSB0aGF0IGNhbWUgZnJvbSB0aGUgc2VydmVyIGFzIHdlbGwgYXMgJGh0dHAgaGVhZGVyIGdldHRlciBmdW5jdGlvbiwgc28gb25lXG4gKiBjb3VsZCByZXdyaXRlIHRoZSBhYm92ZSBleGFtcGxlIGFuZCBnZXQgYWNjZXNzIHRvIGh0dHAgaGVhZGVycyBhczpcbiAqXG4gICBgYGBqc1xuICAgICB2YXIgVXNlciA9ICRyZXNvdXJjZSgnL3VzZXIvOnVzZXJJZCcsIHt1c2VySWQ6J0BpZCd9KTtcbiAgICAgVXNlci5nZXQoe3VzZXJJZDoxMjN9LCBmdW5jdGlvbih1LCBnZXRSZXNwb25zZUhlYWRlcnMpe1xuICAgICAgIHUuYWJjID0gdHJ1ZTtcbiAgICAgICB1LiRzYXZlKGZ1bmN0aW9uKHUsIHB1dFJlc3BvbnNlSGVhZGVycykge1xuICAgICAgICAgLy91ID0+IHNhdmVkIHVzZXIgb2JqZWN0XG4gICAgICAgICAvL3B1dFJlc3BvbnNlSGVhZGVycyA9PiAkaHR0cCBoZWFkZXIgZ2V0dGVyXG4gICAgICAgfSk7XG4gICAgIH0pO1xuICAgYGBgXG4gKlxuICogWW91IGNhbiBhbHNvIGFjY2VzcyB0aGUgcmF3IGAkaHR0cGAgcHJvbWlzZSB2aWEgdGhlIGAkcHJvbWlzZWAgcHJvcGVydHkgb24gdGhlIG9iamVjdCByZXR1cm5lZFxuICpcbiAgIGBgYFxuICAgICB2YXIgVXNlciA9ICRyZXNvdXJjZSgnL3VzZXIvOnVzZXJJZCcsIHt1c2VySWQ6J0BpZCd9KTtcbiAgICAgVXNlci5nZXQoe3VzZXJJZDoxMjN9KVxuICAgICAgICAgLiRwcm9taXNlLnRoZW4oZnVuY3Rpb24odXNlcikge1xuICAgICAgICAgICAkc2NvcGUudXNlciA9IHVzZXI7XG4gICAgICAgICB9KTtcbiAgIGBgYFxuXG4gKiAjIENyZWF0aW5nIGEgY3VzdG9tICdQVVQnIHJlcXVlc3RcbiAqIEluIHRoaXMgZXhhbXBsZSB3ZSBjcmVhdGUgYSBjdXN0b20gbWV0aG9kIG9uIG91ciByZXNvdXJjZSB0byBtYWtlIGEgUFVUIHJlcXVlc3RcbiAqIGBgYGpzXG4gKiAgICB2YXIgYXBwID0gYW5ndWxhci5tb2R1bGUoJ2FwcCcsIFsnbmdSZXNvdXJjZScsICduZ1JvdXRlJ10pO1xuICpcbiAqICAgIC8vIFNvbWUgQVBJcyBleHBlY3QgYSBQVVQgcmVxdWVzdCBpbiB0aGUgZm9ybWF0IFVSTC9vYmplY3QvSURcbiAqICAgIC8vIEhlcmUgd2UgYXJlIGNyZWF0aW5nIGFuICd1cGRhdGUnIG1ldGhvZFxuICogICAgYXBwLmZhY3RvcnkoJ05vdGVzJywgWyckcmVzb3VyY2UnLCBmdW5jdGlvbigkcmVzb3VyY2UpIHtcbiAqICAgIHJldHVybiAkcmVzb3VyY2UoJy9ub3Rlcy86aWQnLCBudWxsLFxuICogICAgICAgIHtcbiAqICAgICAgICAgICAgJ3VwZGF0ZSc6IHsgbWV0aG9kOidQVVQnIH1cbiAqICAgICAgICB9KTtcbiAqICAgIH1dKTtcbiAqXG4gKiAgICAvLyBJbiBvdXIgY29udHJvbGxlciB3ZSBnZXQgdGhlIElEIGZyb20gdGhlIFVSTCB1c2luZyBuZ1JvdXRlIGFuZCAkcm91dGVQYXJhbXNcbiAqICAgIC8vIFdlIHBhc3MgaW4gJHJvdXRlUGFyYW1zIGFuZCBvdXIgTm90ZXMgZmFjdG9yeSBhbG9uZyB3aXRoICRzY29wZVxuICogICAgYXBwLmNvbnRyb2xsZXIoJ05vdGVzQ3RybCcsIFsnJHNjb3BlJywgJyRyb3V0ZVBhcmFtcycsICdOb3RlcycsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uKCRzY29wZSwgJHJvdXRlUGFyYW1zLCBOb3Rlcykge1xuICogICAgLy8gRmlyc3QgZ2V0IGEgbm90ZSBvYmplY3QgZnJvbSB0aGUgZmFjdG9yeVxuICogICAgdmFyIG5vdGUgPSBOb3Rlcy5nZXQoeyBpZDokcm91dGVQYXJhbXMuaWQgfSk7XG4gKiAgICAkaWQgPSBub3RlLmlkO1xuICpcbiAqICAgIC8vIE5vdyBjYWxsIHVwZGF0ZSBwYXNzaW5nIGluIHRoZSBJRCBmaXJzdCB0aGVuIHRoZSBvYmplY3QgeW91IGFyZSB1cGRhdGluZ1xuICogICAgTm90ZXMudXBkYXRlKHsgaWQ6JGlkIH0sIG5vdGUpO1xuICpcbiAqICAgIC8vIFRoaXMgd2lsbCBQVVQgL25vdGVzL0lEIHdpdGggdGhlIG5vdGUgb2JqZWN0IGluIHRoZSByZXF1ZXN0IHBheWxvYWRcbiAqICAgIH1dKTtcbiAqIGBgYFxuICovXG5hbmd1bGFyLm1vZHVsZSgnbmdSZXNvdXJjZScsIFsnbmcnXSkuXG4gIGZhY3RvcnkoJyRyZXNvdXJjZScsIFsnJGh0dHAnLCAnJHEnLCBmdW5jdGlvbigkaHR0cCwgJHEpIHtcblxuICAgIHZhciBERUZBVUxUX0FDVElPTlMgPSB7XG4gICAgICAnZ2V0JzogICAge21ldGhvZDonR0VUJ30sXG4gICAgICAnc2F2ZSc6ICAge21ldGhvZDonUE9TVCd9LFxuICAgICAgJ3F1ZXJ5JzogIHttZXRob2Q6J0dFVCcsIGlzQXJyYXk6dHJ1ZX0sXG4gICAgICAncmVtb3ZlJzoge21ldGhvZDonREVMRVRFJ30sXG4gICAgICAnZGVsZXRlJzoge21ldGhvZDonREVMRVRFJ31cbiAgICB9O1xuICAgIHZhciBub29wID0gYW5ndWxhci5ub29wLFxuICAgICAgICBmb3JFYWNoID0gYW5ndWxhci5mb3JFYWNoLFxuICAgICAgICBleHRlbmQgPSBhbmd1bGFyLmV4dGVuZCxcbiAgICAgICAgY29weSA9IGFuZ3VsYXIuY29weSxcbiAgICAgICAgaXNGdW5jdGlvbiA9IGFuZ3VsYXIuaXNGdW5jdGlvbjtcblxuICAgIC8qKlxuICAgICAqIFdlIG5lZWQgb3VyIGN1c3RvbSBtZXRob2QgYmVjYXVzZSBlbmNvZGVVUklDb21wb25lbnQgaXMgdG9vIGFnZ3Jlc3NpdmUgYW5kIGRvZXNuJ3QgZm9sbG93XG4gICAgICogaHR0cDovL3d3dy5pZXRmLm9yZy9yZmMvcmZjMzk4Ni50eHQgd2l0aCByZWdhcmRzIHRvIHRoZSBjaGFyYWN0ZXIgc2V0IChwY2hhcikgYWxsb3dlZCBpbiBwYXRoXG4gICAgICogc2VnbWVudHM6XG4gICAgICogICAgc2VnbWVudCAgICAgICA9ICpwY2hhclxuICAgICAqICAgIHBjaGFyICAgICAgICAgPSB1bnJlc2VydmVkIC8gcGN0LWVuY29kZWQgLyBzdWItZGVsaW1zIC8gXCI6XCIgLyBcIkBcIlxuICAgICAqICAgIHBjdC1lbmNvZGVkICAgPSBcIiVcIiBIRVhESUcgSEVYRElHXG4gICAgICogICAgdW5yZXNlcnZlZCAgICA9IEFMUEhBIC8gRElHSVQgLyBcIi1cIiAvIFwiLlwiIC8gXCJfXCIgLyBcIn5cIlxuICAgICAqICAgIHN1Yi1kZWxpbXMgICAgPSBcIiFcIiAvIFwiJFwiIC8gXCImXCIgLyBcIidcIiAvIFwiKFwiIC8gXCIpXCJcbiAgICAgKiAgICAgICAgICAgICAgICAgICAgIC8gXCIqXCIgLyBcIitcIiAvIFwiLFwiIC8gXCI7XCIgLyBcIj1cIlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGVuY29kZVVyaVNlZ21lbnQodmFsKSB7XG4gICAgICByZXR1cm4gZW5jb2RlVXJpUXVlcnkodmFsLCB0cnVlKS5cbiAgICAgICAgcmVwbGFjZSgvJTI2L2dpLCAnJicpLlxuICAgICAgICByZXBsYWNlKC8lM0QvZ2ksICc9JykuXG4gICAgICAgIHJlcGxhY2UoLyUyQi9naSwgJysnKTtcbiAgICB9XG5cblxuICAgIC8qKlxuICAgICAqIFRoaXMgbWV0aG9kIGlzIGludGVuZGVkIGZvciBlbmNvZGluZyAqa2V5KiBvciAqdmFsdWUqIHBhcnRzIG9mIHF1ZXJ5IGNvbXBvbmVudC4gV2UgbmVlZCBhXG4gICAgICogY3VzdG9tIG1ldGhvZCBiZWNhdXNlIGVuY29kZVVSSUNvbXBvbmVudCBpcyB0b28gYWdncmVzc2l2ZSBhbmQgZW5jb2RlcyBzdHVmZiB0aGF0IGRvZXNuJ3RcbiAgICAgKiBoYXZlIHRvIGJlIGVuY29kZWQgcGVyIGh0dHA6Ly90b29scy5pZXRmLm9yZy9odG1sL3JmYzM5ODY6XG4gICAgICogICAgcXVlcnkgICAgICAgPSAqKCBwY2hhciAvIFwiL1wiIC8gXCI/XCIgKVxuICAgICAqICAgIHBjaGFyICAgICAgICAgPSB1bnJlc2VydmVkIC8gcGN0LWVuY29kZWQgLyBzdWItZGVsaW1zIC8gXCI6XCIgLyBcIkBcIlxuICAgICAqICAgIHVucmVzZXJ2ZWQgICAgPSBBTFBIQSAvIERJR0lUIC8gXCItXCIgLyBcIi5cIiAvIFwiX1wiIC8gXCJ+XCJcbiAgICAgKiAgICBwY3QtZW5jb2RlZCAgID0gXCIlXCIgSEVYRElHIEhFWERJR1xuICAgICAqICAgIHN1Yi1kZWxpbXMgICAgPSBcIiFcIiAvIFwiJFwiIC8gXCImXCIgLyBcIidcIiAvIFwiKFwiIC8gXCIpXCJcbiAgICAgKiAgICAgICAgICAgICAgICAgICAgIC8gXCIqXCIgLyBcIitcIiAvIFwiLFwiIC8gXCI7XCIgLyBcIj1cIlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGVuY29kZVVyaVF1ZXJ5KHZhbCwgcGN0RW5jb2RlU3BhY2VzKSB7XG4gICAgICByZXR1cm4gZW5jb2RlVVJJQ29tcG9uZW50KHZhbCkuXG4gICAgICAgIHJlcGxhY2UoLyU0MC9naSwgJ0AnKS5cbiAgICAgICAgcmVwbGFjZSgvJTNBL2dpLCAnOicpLlxuICAgICAgICByZXBsYWNlKC8lMjQvZywgJyQnKS5cbiAgICAgICAgcmVwbGFjZSgvJTJDL2dpLCAnLCcpLlxuICAgICAgICByZXBsYWNlKC8lMjAvZywgKHBjdEVuY29kZVNwYWNlcyA/ICclMjAnIDogJysnKSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gUm91dGUodGVtcGxhdGUsIGRlZmF1bHRzKSB7XG4gICAgICB0aGlzLnRlbXBsYXRlID0gdGVtcGxhdGU7XG4gICAgICB0aGlzLmRlZmF1bHRzID0gZGVmYXVsdHMgfHwge307XG4gICAgICB0aGlzLnVybFBhcmFtcyA9IHt9O1xuICAgIH1cblxuICAgIFJvdXRlLnByb3RvdHlwZSA9IHtcbiAgICAgIHNldFVybFBhcmFtczogZnVuY3Rpb24oY29uZmlnLCBwYXJhbXMsIGFjdGlvblVybCkge1xuICAgICAgICB2YXIgc2VsZiA9IHRoaXMsXG4gICAgICAgICAgICB1cmwgPSBhY3Rpb25VcmwgfHwgc2VsZi50ZW1wbGF0ZSxcbiAgICAgICAgICAgIHZhbCxcbiAgICAgICAgICAgIGVuY29kZWRWYWw7XG5cbiAgICAgICAgdmFyIHVybFBhcmFtcyA9IHNlbGYudXJsUGFyYW1zID0ge307XG4gICAgICAgIGZvckVhY2godXJsLnNwbGl0KC9cXFcvKSwgZnVuY3Rpb24ocGFyYW0pe1xuICAgICAgICAgIGlmIChwYXJhbSA9PT0gJ2hhc093blByb3BlcnR5Jykge1xuICAgICAgICAgICAgdGhyb3cgJHJlc291cmNlTWluRXJyKCdiYWRuYW1lJywgXCJoYXNPd25Qcm9wZXJ0eSBpcyBub3QgYSB2YWxpZCBwYXJhbWV0ZXIgbmFtZS5cIik7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmICghKG5ldyBSZWdFeHAoXCJeXFxcXGQrJFwiKS50ZXN0KHBhcmFtKSkgJiYgcGFyYW0gJiZcbiAgICAgICAgICAgICAgIChuZXcgUmVnRXhwKFwiKF58W15cXFxcXFxcXF0pOlwiICsgcGFyYW0gKyBcIihcXFxcV3wkKVwiKS50ZXN0KHVybCkpKSB7XG4gICAgICAgICAgICB1cmxQYXJhbXNbcGFyYW1dID0gdHJ1ZTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICB1cmwgPSB1cmwucmVwbGFjZSgvXFxcXDovZywgJzonKTtcblxuICAgICAgICBwYXJhbXMgPSBwYXJhbXMgfHwge307XG4gICAgICAgIGZvckVhY2goc2VsZi51cmxQYXJhbXMsIGZ1bmN0aW9uKF8sIHVybFBhcmFtKXtcbiAgICAgICAgICB2YWwgPSBwYXJhbXMuaGFzT3duUHJvcGVydHkodXJsUGFyYW0pID8gcGFyYW1zW3VybFBhcmFtXSA6IHNlbGYuZGVmYXVsdHNbdXJsUGFyYW1dO1xuICAgICAgICAgIGlmIChhbmd1bGFyLmlzRGVmaW5lZCh2YWwpICYmIHZhbCAhPT0gbnVsbCkge1xuICAgICAgICAgICAgZW5jb2RlZFZhbCA9IGVuY29kZVVyaVNlZ21lbnQodmFsKTtcbiAgICAgICAgICAgIHVybCA9IHVybC5yZXBsYWNlKG5ldyBSZWdFeHAoXCI6XCIgKyB1cmxQYXJhbSArIFwiKFxcXFxXfCQpXCIsIFwiZ1wiKSwgZnVuY3Rpb24obWF0Y2gsIHAxKSB7XG4gICAgICAgICAgICAgIHJldHVybiBlbmNvZGVkVmFsICsgcDE7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdXJsID0gdXJsLnJlcGxhY2UobmV3IFJlZ0V4cChcIihcXC8/KTpcIiArIHVybFBhcmFtICsgXCIoXFxcXFd8JClcIiwgXCJnXCIpLCBmdW5jdGlvbihtYXRjaCxcbiAgICAgICAgICAgICAgICBsZWFkaW5nU2xhc2hlcywgdGFpbCkge1xuICAgICAgICAgICAgICBpZiAodGFpbC5jaGFyQXQoMCkgPT0gJy8nKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRhaWw7XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGxlYWRpbmdTbGFzaGVzICsgdGFpbDtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICAvLyBzdHJpcCB0cmFpbGluZyBzbGFzaGVzIGFuZCBzZXQgdGhlIHVybFxuICAgICAgICB1cmwgPSB1cmwucmVwbGFjZSgvXFwvKyQvLCAnJykgfHwgJy8nO1xuICAgICAgICAvLyB0aGVuIHJlcGxhY2UgY29sbGFwc2UgYC8uYCBpZiBmb3VuZCBpbiB0aGUgbGFzdCBVUkwgcGF0aCBzZWdtZW50IGJlZm9yZSB0aGUgcXVlcnlcbiAgICAgICAgLy8gRS5nLiBgaHR0cDovL3VybC5jb20vaWQuL2Zvcm1hdD9xPXhgIGJlY29tZXMgYGh0dHA6Ly91cmwuY29tL2lkLmZvcm1hdD9xPXhgXG4gICAgICAgIHVybCA9IHVybC5yZXBsYWNlKC9cXC9cXC4oPz1cXHcrKCR8XFw/KSkvLCAnLicpO1xuICAgICAgICAvLyByZXBsYWNlIGVzY2FwZWQgYC9cXC5gIHdpdGggYC8uYFxuICAgICAgICBjb25maWcudXJsID0gdXJsLnJlcGxhY2UoL1xcL1xcXFxcXC4vLCAnLy4nKTtcblxuXG4gICAgICAgIC8vIHNldCBwYXJhbXMgLSBkZWxlZ2F0ZSBwYXJhbSBlbmNvZGluZyB0byAkaHR0cFxuICAgICAgICBmb3JFYWNoKHBhcmFtcywgZnVuY3Rpb24odmFsdWUsIGtleSl7XG4gICAgICAgICAgaWYgKCFzZWxmLnVybFBhcmFtc1trZXldKSB7XG4gICAgICAgICAgICBjb25maWcucGFyYW1zID0gY29uZmlnLnBhcmFtcyB8fCB7fTtcbiAgICAgICAgICAgIGNvbmZpZy5wYXJhbXNba2V5XSA9IHZhbHVlO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfTtcblxuXG4gICAgZnVuY3Rpb24gcmVzb3VyY2VGYWN0b3J5KHVybCwgcGFyYW1EZWZhdWx0cywgYWN0aW9ucykge1xuICAgICAgdmFyIHJvdXRlID0gbmV3IFJvdXRlKHVybCk7XG5cbiAgICAgIGFjdGlvbnMgPSBleHRlbmQoe30sIERFRkFVTFRfQUNUSU9OUywgYWN0aW9ucyk7XG5cbiAgICAgIGZ1bmN0aW9uIGV4dHJhY3RQYXJhbXMoZGF0YSwgYWN0aW9uUGFyYW1zKXtcbiAgICAgICAgdmFyIGlkcyA9IHt9O1xuICAgICAgICBhY3Rpb25QYXJhbXMgPSBleHRlbmQoe30sIHBhcmFtRGVmYXVsdHMsIGFjdGlvblBhcmFtcyk7XG4gICAgICAgIGZvckVhY2goYWN0aW9uUGFyYW1zLCBmdW5jdGlvbih2YWx1ZSwga2V5KXtcbiAgICAgICAgICBpZiAoaXNGdW5jdGlvbih2YWx1ZSkpIHsgdmFsdWUgPSB2YWx1ZSgpOyB9XG4gICAgICAgICAgaWRzW2tleV0gPSB2YWx1ZSAmJiB2YWx1ZS5jaGFyQXQgJiYgdmFsdWUuY2hhckF0KDApID09ICdAJyA/XG4gICAgICAgICAgICBsb29rdXBEb3R0ZWRQYXRoKGRhdGEsIHZhbHVlLnN1YnN0cigxKSkgOiB2YWx1ZTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBpZHM7XG4gICAgICB9XG5cbiAgICAgIGZ1bmN0aW9uIGRlZmF1bHRSZXNwb25zZUludGVyY2VwdG9yKHJlc3BvbnNlKSB7XG4gICAgICAgIHJldHVybiByZXNwb25zZS5yZXNvdXJjZTtcbiAgICAgIH1cblxuICAgICAgZnVuY3Rpb24gUmVzb3VyY2UodmFsdWUpe1xuICAgICAgICBzaGFsbG93Q2xlYXJBbmRDb3B5KHZhbHVlIHx8IHt9LCB0aGlzKTtcbiAgICAgIH1cblxuICAgICAgZm9yRWFjaChhY3Rpb25zLCBmdW5jdGlvbihhY3Rpb24sIG5hbWUpIHtcbiAgICAgICAgdmFyIGhhc0JvZHkgPSAvXihQT1NUfFBVVHxQQVRDSCkkL2kudGVzdChhY3Rpb24ubWV0aG9kKTtcblxuICAgICAgICBSZXNvdXJjZVtuYW1lXSA9IGZ1bmN0aW9uKGExLCBhMiwgYTMsIGE0KSB7XG4gICAgICAgICAgdmFyIHBhcmFtcyA9IHt9LCBkYXRhLCBzdWNjZXNzLCBlcnJvcjtcblxuICAgICAgICAgIC8qIGpzaGludCAtVzA4NiAqLyAvKiAocHVycG9zZWZ1bGx5IGZhbGwgdGhyb3VnaCBjYXNlIHN0YXRlbWVudHMpICovXG4gICAgICAgICAgc3dpdGNoKGFyZ3VtZW50cy5sZW5ndGgpIHtcbiAgICAgICAgICBjYXNlIDQ6XG4gICAgICAgICAgICBlcnJvciA9IGE0O1xuICAgICAgICAgICAgc3VjY2VzcyA9IGEzO1xuICAgICAgICAgICAgLy9mYWxsdGhyb3VnaFxuICAgICAgICAgIGNhc2UgMzpcbiAgICAgICAgICBjYXNlIDI6XG4gICAgICAgICAgICBpZiAoaXNGdW5jdGlvbihhMikpIHtcbiAgICAgICAgICAgICAgaWYgKGlzRnVuY3Rpb24oYTEpKSB7XG4gICAgICAgICAgICAgICAgc3VjY2VzcyA9IGExO1xuICAgICAgICAgICAgICAgIGVycm9yID0gYTI7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICBzdWNjZXNzID0gYTI7XG4gICAgICAgICAgICAgIGVycm9yID0gYTM7XG4gICAgICAgICAgICAgIC8vZmFsbHRocm91Z2hcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHBhcmFtcyA9IGExO1xuICAgICAgICAgICAgICBkYXRhID0gYTI7XG4gICAgICAgICAgICAgIHN1Y2Nlc3MgPSBhMztcbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgY2FzZSAxOlxuICAgICAgICAgICAgaWYgKGlzRnVuY3Rpb24oYTEpKSBzdWNjZXNzID0gYTE7XG4gICAgICAgICAgICBlbHNlIGlmIChoYXNCb2R5KSBkYXRhID0gYTE7XG4gICAgICAgICAgICBlbHNlIHBhcmFtcyA9IGExO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgY2FzZSAwOiBicmVhaztcbiAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgdGhyb3cgJHJlc291cmNlTWluRXJyKCdiYWRhcmdzJyxcbiAgICAgICAgICAgICAgXCJFeHBlY3RlZCB1cCB0byA0IGFyZ3VtZW50cyBbcGFyYW1zLCBkYXRhLCBzdWNjZXNzLCBlcnJvcl0sIGdvdCB7MH0gYXJndW1lbnRzXCIsXG4gICAgICAgICAgICAgIGFyZ3VtZW50cy5sZW5ndGgpO1xuICAgICAgICAgIH1cbiAgICAgICAgICAvKiBqc2hpbnQgK1cwODYgKi8gLyogKHB1cnBvc2VmdWxseSBmYWxsIHRocm91Z2ggY2FzZSBzdGF0ZW1lbnRzKSAqL1xuXG4gICAgICAgICAgdmFyIGlzSW5zdGFuY2VDYWxsID0gdGhpcyBpbnN0YW5jZW9mIFJlc291cmNlO1xuICAgICAgICAgIHZhciB2YWx1ZSA9IGlzSW5zdGFuY2VDYWxsID8gZGF0YSA6IChhY3Rpb24uaXNBcnJheSA/IFtdIDogbmV3IFJlc291cmNlKGRhdGEpKTtcbiAgICAgICAgICB2YXIgaHR0cENvbmZpZyA9IHt9O1xuICAgICAgICAgIHZhciByZXNwb25zZUludGVyY2VwdG9yID0gYWN0aW9uLmludGVyY2VwdG9yICYmIGFjdGlvbi5pbnRlcmNlcHRvci5yZXNwb25zZSB8fFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVmYXVsdFJlc3BvbnNlSW50ZXJjZXB0b3I7XG4gICAgICAgICAgdmFyIHJlc3BvbnNlRXJyb3JJbnRlcmNlcHRvciA9IGFjdGlvbi5pbnRlcmNlcHRvciAmJiBhY3Rpb24uaW50ZXJjZXB0b3IucmVzcG9uc2VFcnJvciB8fFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdW5kZWZpbmVkO1xuXG4gICAgICAgICAgZm9yRWFjaChhY3Rpb24sIGZ1bmN0aW9uKHZhbHVlLCBrZXkpIHtcbiAgICAgICAgICAgIGlmIChrZXkgIT0gJ3BhcmFtcycgJiYga2V5ICE9ICdpc0FycmF5JyAmJiBrZXkgIT0gJ2ludGVyY2VwdG9yJykge1xuICAgICAgICAgICAgICBodHRwQ29uZmlnW2tleV0gPSBjb3B5KHZhbHVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcblxuICAgICAgICAgIGlmIChoYXNCb2R5KSBodHRwQ29uZmlnLmRhdGEgPSBkYXRhO1xuICAgICAgICAgIHJvdXRlLnNldFVybFBhcmFtcyhodHRwQ29uZmlnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICBleHRlbmQoe30sIGV4dHJhY3RQYXJhbXMoZGF0YSwgYWN0aW9uLnBhcmFtcyB8fCB7fSksIHBhcmFtcyksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFjdGlvbi51cmwpO1xuXG4gICAgICAgICAgdmFyIHByb21pc2UgPSAkaHR0cChodHRwQ29uZmlnKS50aGVuKGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgICAgICAgICAgdmFyIGRhdGEgPSByZXNwb25zZS5kYXRhLFxuICAgICAgICAgICAgICBwcm9taXNlID0gdmFsdWUuJHByb21pc2U7XG5cbiAgICAgICAgICAgIGlmIChkYXRhKSB7XG4gICAgICAgICAgICAgIC8vIE5lZWQgdG8gY29udmVydCBhY3Rpb24uaXNBcnJheSB0byBib29sZWFuIGluIGNhc2UgaXQgaXMgdW5kZWZpbmVkXG4gICAgICAgICAgICAgIC8vIGpzaGludCAtVzAxOFxuICAgICAgICAgICAgICBpZiAoYW5ndWxhci5pc0FycmF5KGRhdGEpICE9PSAoISFhY3Rpb24uaXNBcnJheSkpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyAkcmVzb3VyY2VNaW5FcnIoJ2JhZGNmZycsXG4gICAgICAgICAgICAgICAgICAgICdFcnJvciBpbiByZXNvdXJjZSBjb25maWd1cmF0aW9uLiBFeHBlY3RlZCAnICtcbiAgICAgICAgICAgICAgICAgICAgJ3Jlc3BvbnNlIHRvIGNvbnRhaW4gYW4gezB9IGJ1dCBnb3QgYW4gezF9JyxcbiAgICAgICAgICAgICAgICAgIGFjdGlvbi5pc0FycmF5ID8gJ2FycmF5JyA6ICdvYmplY3QnLFxuICAgICAgICAgICAgICAgICAgYW5ndWxhci5pc0FycmF5KGRhdGEpID8gJ2FycmF5JyA6ICdvYmplY3QnKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAvLyBqc2hpbnQgK1cwMThcbiAgICAgICAgICAgICAgaWYgKGFjdGlvbi5pc0FycmF5KSB7XG4gICAgICAgICAgICAgICAgdmFsdWUubGVuZ3RoID0gMDtcbiAgICAgICAgICAgICAgICBmb3JFYWNoKGRhdGEsIGZ1bmN0aW9uIChpdGVtKSB7XG4gICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIGl0ZW0gPT09IFwib2JqZWN0XCIpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFsdWUucHVzaChuZXcgUmVzb3VyY2UoaXRlbSkpO1xuICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gVmFsaWQgSlNPTiB2YWx1ZXMgbWF5IGJlIHN0cmluZyBsaXRlcmFscywgYW5kIHRoZXNlIHNob3VsZCBub3QgYmUgY29udmVydGVkXG4gICAgICAgICAgICAgICAgICAgIC8vIGludG8gb2JqZWN0cy4gVGhlc2UgaXRlbXMgd2lsbCBub3QgaGF2ZSBhY2Nlc3MgdG8gdGhlIFJlc291cmNlIHByb3RvdHlwZVxuICAgICAgICAgICAgICAgICAgICAvLyBtZXRob2RzLCBidXQgdW5mb3J0dW5hdGVseSB0aGVyZVxuICAgICAgICAgICAgICAgICAgICB2YWx1ZS5wdXNoKGl0ZW0pO1xuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHNoYWxsb3dDbGVhckFuZENvcHkoZGF0YSwgdmFsdWUpO1xuICAgICAgICAgICAgICAgIHZhbHVlLiRwcm9taXNlID0gcHJvbWlzZTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YWx1ZS4kcmVzb2x2ZWQgPSB0cnVlO1xuXG4gICAgICAgICAgICByZXNwb25zZS5yZXNvdXJjZSA9IHZhbHVlO1xuXG4gICAgICAgICAgICByZXR1cm4gcmVzcG9uc2U7XG4gICAgICAgICAgfSwgZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAgICAgICAgIHZhbHVlLiRyZXNvbHZlZCA9IHRydWU7XG5cbiAgICAgICAgICAgIChlcnJvcnx8bm9vcCkocmVzcG9uc2UpO1xuXG4gICAgICAgICAgICByZXR1cm4gJHEucmVqZWN0KHJlc3BvbnNlKTtcbiAgICAgICAgICB9KTtcblxuICAgICAgICAgIHByb21pc2UgPSBwcm9taXNlLnRoZW4oXG4gICAgICAgICAgICAgIGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICAgICAgdmFyIHZhbHVlID0gcmVzcG9uc2VJbnRlcmNlcHRvcihyZXNwb25zZSk7XG4gICAgICAgICAgICAgICAgKHN1Y2Nlc3N8fG5vb3ApKHZhbHVlLCByZXNwb25zZS5oZWFkZXJzKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIHJlc3BvbnNlRXJyb3JJbnRlcmNlcHRvcik7XG5cbiAgICAgICAgICBpZiAoIWlzSW5zdGFuY2VDYWxsKSB7XG4gICAgICAgICAgICAvLyB3ZSBhcmUgY3JlYXRpbmcgaW5zdGFuY2UgLyBjb2xsZWN0aW9uXG4gICAgICAgICAgICAvLyAtIHNldCB0aGUgaW5pdGlhbCBwcm9taXNlXG4gICAgICAgICAgICAvLyAtIHJldHVybiB0aGUgaW5zdGFuY2UgLyBjb2xsZWN0aW9uXG4gICAgICAgICAgICB2YWx1ZS4kcHJvbWlzZSA9IHByb21pc2U7XG4gICAgICAgICAgICB2YWx1ZS4kcmVzb2x2ZWQgPSBmYWxzZTtcblxuICAgICAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIC8vIGluc3RhbmNlIGNhbGxcbiAgICAgICAgICByZXR1cm4gcHJvbWlzZTtcbiAgICAgICAgfTtcblxuXG4gICAgICAgIFJlc291cmNlLnByb3RvdHlwZVsnJCcgKyBuYW1lXSA9IGZ1bmN0aW9uKHBhcmFtcywgc3VjY2VzcywgZXJyb3IpIHtcbiAgICAgICAgICBpZiAoaXNGdW5jdGlvbihwYXJhbXMpKSB7XG4gICAgICAgICAgICBlcnJvciA9IHN1Y2Nlc3M7IHN1Y2Nlc3MgPSBwYXJhbXM7IHBhcmFtcyA9IHt9O1xuICAgICAgICAgIH1cbiAgICAgICAgICB2YXIgcmVzdWx0ID0gUmVzb3VyY2VbbmFtZV0uY2FsbCh0aGlzLCBwYXJhbXMsIHRoaXMsIHN1Y2Nlc3MsIGVycm9yKTtcbiAgICAgICAgICByZXR1cm4gcmVzdWx0LiRwcm9taXNlIHx8IHJlc3VsdDtcbiAgICAgICAgfTtcbiAgICAgIH0pO1xuXG4gICAgICBSZXNvdXJjZS5iaW5kID0gZnVuY3Rpb24oYWRkaXRpb25hbFBhcmFtRGVmYXVsdHMpe1xuICAgICAgICByZXR1cm4gcmVzb3VyY2VGYWN0b3J5KHVybCwgZXh0ZW5kKHt9LCBwYXJhbURlZmF1bHRzLCBhZGRpdGlvbmFsUGFyYW1EZWZhdWx0cyksIGFjdGlvbnMpO1xuICAgICAgfTtcblxuICAgICAgcmV0dXJuIFJlc291cmNlO1xuICAgIH1cblxuICAgIHJldHVybiByZXNvdXJjZUZhY3Rvcnk7XG4gIH1dKTtcblxuXG59KSh3aW5kb3csIHdpbmRvdy5hbmd1bGFyKTtcbiIsIi8qKlxuICogQGxpY2Vuc2UgQW5ndWxhckpTIHYxLjIuMjRcbiAqIChjKSAyMDEwLTIwMTQgR29vZ2xlLCBJbmMuIGh0dHA6Ly9hbmd1bGFyanMub3JnXG4gKiBMaWNlbnNlOiBNSVRcbiAqL1xuKGZ1bmN0aW9uKHdpbmRvdywgYW5ndWxhciwgdW5kZWZpbmVkKSB7J3VzZSBzdHJpY3QnO1xuXG4vKipcbiAqIEBuZ2RvYyBtb2R1bGVcbiAqIEBuYW1lIG5nUm91dGVcbiAqIEBkZXNjcmlwdGlvblxuICpcbiAqICMgbmdSb3V0ZVxuICpcbiAqIFRoZSBgbmdSb3V0ZWAgbW9kdWxlIHByb3ZpZGVzIHJvdXRpbmcgYW5kIGRlZXBsaW5raW5nIHNlcnZpY2VzIGFuZCBkaXJlY3RpdmVzIGZvciBhbmd1bGFyIGFwcHMuXG4gKlxuICogIyMgRXhhbXBsZVxuICogU2VlIHtAbGluayBuZ1JvdXRlLiRyb3V0ZSNleGFtcGxlICRyb3V0ZX0gZm9yIGFuIGV4YW1wbGUgb2YgY29uZmlndXJpbmcgYW5kIHVzaW5nIGBuZ1JvdXRlYC5cbiAqXG4gKlxuICogPGRpdiBkb2MtbW9kdWxlLWNvbXBvbmVudHM9XCJuZ1JvdXRlXCI+PC9kaXY+XG4gKi9cbiAvKiBnbG9iYWwgLW5nUm91dGVNb2R1bGUgKi9cbnZhciBuZ1JvdXRlTW9kdWxlID0gYW5ndWxhci5tb2R1bGUoJ25nUm91dGUnLCBbJ25nJ10pLlxuICAgICAgICAgICAgICAgICAgICAgICAgcHJvdmlkZXIoJyRyb3V0ZScsICRSb3V0ZVByb3ZpZGVyKTtcblxuLyoqXG4gKiBAbmdkb2MgcHJvdmlkZXJcbiAqIEBuYW1lICRyb3V0ZVByb3ZpZGVyXG4gKiBAa2luZCBmdW5jdGlvblxuICpcbiAqIEBkZXNjcmlwdGlvblxuICpcbiAqIFVzZWQgZm9yIGNvbmZpZ3VyaW5nIHJvdXRlcy5cbiAqXG4gKiAjIyBFeGFtcGxlXG4gKiBTZWUge0BsaW5rIG5nUm91dGUuJHJvdXRlI2V4YW1wbGUgJHJvdXRlfSBmb3IgYW4gZXhhbXBsZSBvZiBjb25maWd1cmluZyBhbmQgdXNpbmcgYG5nUm91dGVgLlxuICpcbiAqICMjIERlcGVuZGVuY2llc1xuICogUmVxdWlyZXMgdGhlIHtAbGluayBuZ1JvdXRlIGBuZ1JvdXRlYH0gbW9kdWxlIHRvIGJlIGluc3RhbGxlZC5cbiAqL1xuZnVuY3Rpb24gJFJvdXRlUHJvdmlkZXIoKXtcbiAgZnVuY3Rpb24gaW5oZXJpdChwYXJlbnQsIGV4dHJhKSB7XG4gICAgcmV0dXJuIGFuZ3VsYXIuZXh0ZW5kKG5ldyAoYW5ndWxhci5leHRlbmQoZnVuY3Rpb24oKSB7fSwge3Byb3RvdHlwZTpwYXJlbnR9KSkoKSwgZXh0cmEpO1xuICB9XG5cbiAgdmFyIHJvdXRlcyA9IHt9O1xuXG4gIC8qKlxuICAgKiBAbmdkb2MgbWV0aG9kXG4gICAqIEBuYW1lICRyb3V0ZVByb3ZpZGVyI3doZW5cbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IHBhdGggUm91dGUgcGF0aCAobWF0Y2hlZCBhZ2FpbnN0IGAkbG9jYXRpb24ucGF0aGApLiBJZiBgJGxvY2F0aW9uLnBhdGhgXG4gICAqICAgIGNvbnRhaW5zIHJlZHVuZGFudCB0cmFpbGluZyBzbGFzaCBvciBpcyBtaXNzaW5nIG9uZSwgdGhlIHJvdXRlIHdpbGwgc3RpbGwgbWF0Y2ggYW5kIHRoZVxuICAgKiAgICBgJGxvY2F0aW9uLnBhdGhgIHdpbGwgYmUgdXBkYXRlZCB0byBhZGQgb3IgZHJvcCB0aGUgdHJhaWxpbmcgc2xhc2ggdG8gZXhhY3RseSBtYXRjaCB0aGVcbiAgICogICAgcm91dGUgZGVmaW5pdGlvbi5cbiAgICpcbiAgICogICAgKiBgcGF0aGAgY2FuIGNvbnRhaW4gbmFtZWQgZ3JvdXBzIHN0YXJ0aW5nIHdpdGggYSBjb2xvbjogZS5nLiBgOm5hbWVgLiBBbGwgY2hhcmFjdGVycyB1cFxuICAgKiAgICAgICAgdG8gdGhlIG5leHQgc2xhc2ggYXJlIG1hdGNoZWQgYW5kIHN0b3JlZCBpbiBgJHJvdXRlUGFyYW1zYCB1bmRlciB0aGUgZ2l2ZW4gYG5hbWVgXG4gICAqICAgICAgICB3aGVuIHRoZSByb3V0ZSBtYXRjaGVzLlxuICAgKiAgICAqIGBwYXRoYCBjYW4gY29udGFpbiBuYW1lZCBncm91cHMgc3RhcnRpbmcgd2l0aCBhIGNvbG9uIGFuZCBlbmRpbmcgd2l0aCBhIHN0YXI6XG4gICAqICAgICAgICBlLmcuYDpuYW1lKmAuIEFsbCBjaGFyYWN0ZXJzIGFyZSBlYWdlcmx5IHN0b3JlZCBpbiBgJHJvdXRlUGFyYW1zYCB1bmRlciB0aGUgZ2l2ZW4gYG5hbWVgXG4gICAqICAgICAgICB3aGVuIHRoZSByb3V0ZSBtYXRjaGVzLlxuICAgKiAgICAqIGBwYXRoYCBjYW4gY29udGFpbiBvcHRpb25hbCBuYW1lZCBncm91cHMgd2l0aCBhIHF1ZXN0aW9uIG1hcms6IGUuZy5gOm5hbWU/YC5cbiAgICpcbiAgICogICAgRm9yIGV4YW1wbGUsIHJvdXRlcyBsaWtlIGAvY29sb3IvOmNvbG9yL2xhcmdlY29kZS86bGFyZ2Vjb2RlKlxcL2VkaXRgIHdpbGwgbWF0Y2hcbiAgICogICAgYC9jb2xvci9icm93bi9sYXJnZWNvZGUvY29kZS93aXRoL3NsYXNoZXMvZWRpdGAgYW5kIGV4dHJhY3Q6XG4gICAqXG4gICAqICAgICogYGNvbG9yOiBicm93bmBcbiAgICogICAgKiBgbGFyZ2Vjb2RlOiBjb2RlL3dpdGgvc2xhc2hlc2AuXG4gICAqXG4gICAqXG4gICAqIEBwYXJhbSB7T2JqZWN0fSByb3V0ZSBNYXBwaW5nIGluZm9ybWF0aW9uIHRvIGJlIGFzc2lnbmVkIHRvIGAkcm91dGUuY3VycmVudGAgb24gcm91dGVcbiAgICogICAgbWF0Y2guXG4gICAqXG4gICAqICAgIE9iamVjdCBwcm9wZXJ0aWVzOlxuICAgKlxuICAgKiAgICAtIGBjb250cm9sbGVyYCDigJMgYHsoc3RyaW5nfGZ1bmN0aW9uKCk9fWAg4oCTIENvbnRyb2xsZXIgZm4gdGhhdCBzaG91bGQgYmUgYXNzb2NpYXRlZCB3aXRoXG4gICAqICAgICAgbmV3bHkgY3JlYXRlZCBzY29wZSBvciB0aGUgbmFtZSBvZiBhIHtAbGluayBhbmd1bGFyLk1vZHVsZSNjb250cm9sbGVyIHJlZ2lzdGVyZWRcbiAgICogICAgICBjb250cm9sbGVyfSBpZiBwYXNzZWQgYXMgYSBzdHJpbmcuXG4gICAqICAgIC0gYGNvbnRyb2xsZXJBc2Ag4oCTIGB7c3RyaW5nPX1gIOKAkyBBIGNvbnRyb2xsZXIgYWxpYXMgbmFtZS4gSWYgcHJlc2VudCB0aGUgY29udHJvbGxlciB3aWxsIGJlXG4gICAqICAgICAgcHVibGlzaGVkIHRvIHNjb3BlIHVuZGVyIHRoZSBgY29udHJvbGxlckFzYCBuYW1lLlxuICAgKiAgICAtIGB0ZW1wbGF0ZWAg4oCTIGB7c3RyaW5nPXxmdW5jdGlvbigpPX1gIOKAkyBodG1sIHRlbXBsYXRlIGFzIGEgc3RyaW5nIG9yIGEgZnVuY3Rpb24gdGhhdFxuICAgKiAgICAgIHJldHVybnMgYW4gaHRtbCB0ZW1wbGF0ZSBhcyBhIHN0cmluZyB3aGljaCBzaG91bGQgYmUgdXNlZCBieSB7QGxpbmtcbiAgICogICAgICBuZ1JvdXRlLmRpcmVjdGl2ZTpuZ1ZpZXcgbmdWaWV3fSBvciB7QGxpbmsgbmcuZGlyZWN0aXZlOm5nSW5jbHVkZSBuZ0luY2x1ZGV9IGRpcmVjdGl2ZXMuXG4gICAqICAgICAgVGhpcyBwcm9wZXJ0eSB0YWtlcyBwcmVjZWRlbmNlIG92ZXIgYHRlbXBsYXRlVXJsYC5cbiAgICpcbiAgICogICAgICBJZiBgdGVtcGxhdGVgIGlzIGEgZnVuY3Rpb24sIGl0IHdpbGwgYmUgY2FsbGVkIHdpdGggdGhlIGZvbGxvd2luZyBwYXJhbWV0ZXJzOlxuICAgKlxuICAgKiAgICAgIC0gYHtBcnJheS48T2JqZWN0Pn1gIC0gcm91dGUgcGFyYW1ldGVycyBleHRyYWN0ZWQgZnJvbSB0aGUgY3VycmVudFxuICAgKiAgICAgICAgYCRsb2NhdGlvbi5wYXRoKClgIGJ5IGFwcGx5aW5nIHRoZSBjdXJyZW50IHJvdXRlXG4gICAqXG4gICAqICAgIC0gYHRlbXBsYXRlVXJsYCDigJMgYHtzdHJpbmc9fGZ1bmN0aW9uKCk9fWAg4oCTIHBhdGggb3IgZnVuY3Rpb24gdGhhdCByZXR1cm5zIGEgcGF0aCB0byBhbiBodG1sXG4gICAqICAgICAgdGVtcGxhdGUgdGhhdCBzaG91bGQgYmUgdXNlZCBieSB7QGxpbmsgbmdSb3V0ZS5kaXJlY3RpdmU6bmdWaWV3IG5nVmlld30uXG4gICAqXG4gICAqICAgICAgSWYgYHRlbXBsYXRlVXJsYCBpcyBhIGZ1bmN0aW9uLCBpdCB3aWxsIGJlIGNhbGxlZCB3aXRoIHRoZSBmb2xsb3dpbmcgcGFyYW1ldGVyczpcbiAgICpcbiAgICogICAgICAtIGB7QXJyYXkuPE9iamVjdD59YCAtIHJvdXRlIHBhcmFtZXRlcnMgZXh0cmFjdGVkIGZyb20gdGhlIGN1cnJlbnRcbiAgICogICAgICAgIGAkbG9jYXRpb24ucGF0aCgpYCBieSBhcHBseWluZyB0aGUgY3VycmVudCByb3V0ZVxuICAgKlxuICAgKiAgICAtIGByZXNvbHZlYCAtIGB7T2JqZWN0LjxzdHJpbmcsIGZ1bmN0aW9uPj19YCAtIEFuIG9wdGlvbmFsIG1hcCBvZiBkZXBlbmRlbmNpZXMgd2hpY2ggc2hvdWxkXG4gICAqICAgICAgYmUgaW5qZWN0ZWQgaW50byB0aGUgY29udHJvbGxlci4gSWYgYW55IG9mIHRoZXNlIGRlcGVuZGVuY2llcyBhcmUgcHJvbWlzZXMsIHRoZSByb3V0ZXJcbiAgICogICAgICB3aWxsIHdhaXQgZm9yIHRoZW0gYWxsIHRvIGJlIHJlc29sdmVkIG9yIG9uZSB0byBiZSByZWplY3RlZCBiZWZvcmUgdGhlIGNvbnRyb2xsZXIgaXNcbiAgICogICAgICBpbnN0YW50aWF0ZWQuXG4gICAqICAgICAgSWYgYWxsIHRoZSBwcm9taXNlcyBhcmUgcmVzb2x2ZWQgc3VjY2Vzc2Z1bGx5LCB0aGUgdmFsdWVzIG9mIHRoZSByZXNvbHZlZCBwcm9taXNlcyBhcmVcbiAgICogICAgICBpbmplY3RlZCBhbmQge0BsaW5rIG5nUm91dGUuJHJvdXRlIyRyb3V0ZUNoYW5nZVN1Y2Nlc3MgJHJvdXRlQ2hhbmdlU3VjY2Vzc30gZXZlbnQgaXNcbiAgICogICAgICBmaXJlZC4gSWYgYW55IG9mIHRoZSBwcm9taXNlcyBhcmUgcmVqZWN0ZWQgdGhlXG4gICAqICAgICAge0BsaW5rIG5nUm91dGUuJHJvdXRlIyRyb3V0ZUNoYW5nZUVycm9yICRyb3V0ZUNoYW5nZUVycm9yfSBldmVudCBpcyBmaXJlZC4gVGhlIG1hcCBvYmplY3RcbiAgICogICAgICBpczpcbiAgICpcbiAgICogICAgICAtIGBrZXlgIOKAkyBge3N0cmluZ31gOiBhIG5hbWUgb2YgYSBkZXBlbmRlbmN5IHRvIGJlIGluamVjdGVkIGludG8gdGhlIGNvbnRyb2xsZXIuXG4gICAqICAgICAgLSBgZmFjdG9yeWAgLSBge3N0cmluZ3xmdW5jdGlvbn1gOiBJZiBgc3RyaW5nYCB0aGVuIGl0IGlzIGFuIGFsaWFzIGZvciBhIHNlcnZpY2UuXG4gICAqICAgICAgICBPdGhlcndpc2UgaWYgZnVuY3Rpb24sIHRoZW4gaXQgaXMge0BsaW5rIGF1dG8uJGluamVjdG9yI2ludm9rZSBpbmplY3RlZH1cbiAgICogICAgICAgIGFuZCB0aGUgcmV0dXJuIHZhbHVlIGlzIHRyZWF0ZWQgYXMgdGhlIGRlcGVuZGVuY3kuIElmIHRoZSByZXN1bHQgaXMgYSBwcm9taXNlLCBpdCBpc1xuICAgKiAgICAgICAgcmVzb2x2ZWQgYmVmb3JlIGl0cyB2YWx1ZSBpcyBpbmplY3RlZCBpbnRvIHRoZSBjb250cm9sbGVyLiBCZSBhd2FyZSB0aGF0XG4gICAqICAgICAgICBgbmdSb3V0ZS4kcm91dGVQYXJhbXNgIHdpbGwgc3RpbGwgcmVmZXIgdG8gdGhlIHByZXZpb3VzIHJvdXRlIHdpdGhpbiB0aGVzZSByZXNvbHZlXG4gICAqICAgICAgICBmdW5jdGlvbnMuICBVc2UgYCRyb3V0ZS5jdXJyZW50LnBhcmFtc2AgdG8gYWNjZXNzIHRoZSBuZXcgcm91dGUgcGFyYW1ldGVycywgaW5zdGVhZC5cbiAgICpcbiAgICogICAgLSBgcmVkaXJlY3RUb2Ag4oCTIHsoc3RyaW5nfGZ1bmN0aW9uKCkpPX0g4oCTIHZhbHVlIHRvIHVwZGF0ZVxuICAgKiAgICAgIHtAbGluayBuZy4kbG9jYXRpb24gJGxvY2F0aW9ufSBwYXRoIHdpdGggYW5kIHRyaWdnZXIgcm91dGUgcmVkaXJlY3Rpb24uXG4gICAqXG4gICAqICAgICAgSWYgYHJlZGlyZWN0VG9gIGlzIGEgZnVuY3Rpb24sIGl0IHdpbGwgYmUgY2FsbGVkIHdpdGggdGhlIGZvbGxvd2luZyBwYXJhbWV0ZXJzOlxuICAgKlxuICAgKiAgICAgIC0gYHtPYmplY3QuPHN0cmluZz59YCAtIHJvdXRlIHBhcmFtZXRlcnMgZXh0cmFjdGVkIGZyb20gdGhlIGN1cnJlbnRcbiAgICogICAgICAgIGAkbG9jYXRpb24ucGF0aCgpYCBieSBhcHBseWluZyB0aGUgY3VycmVudCByb3V0ZSB0ZW1wbGF0ZVVybC5cbiAgICogICAgICAtIGB7c3RyaW5nfWAgLSBjdXJyZW50IGAkbG9jYXRpb24ucGF0aCgpYFxuICAgKiAgICAgIC0gYHtPYmplY3R9YCAtIGN1cnJlbnQgYCRsb2NhdGlvbi5zZWFyY2goKWBcbiAgICpcbiAgICogICAgICBUaGUgY3VzdG9tIGByZWRpcmVjdFRvYCBmdW5jdGlvbiBpcyBleHBlY3RlZCB0byByZXR1cm4gYSBzdHJpbmcgd2hpY2ggd2lsbCBiZSB1c2VkXG4gICAqICAgICAgdG8gdXBkYXRlIGAkbG9jYXRpb24ucGF0aCgpYCBhbmQgYCRsb2NhdGlvbi5zZWFyY2goKWAuXG4gICAqXG4gICAqICAgIC0gYFtyZWxvYWRPblNlYXJjaD10cnVlXWAgLSB7Ym9vbGVhbj19IC0gcmVsb2FkIHJvdXRlIHdoZW4gb25seSBgJGxvY2F0aW9uLnNlYXJjaCgpYFxuICAgKiAgICAgIG9yIGAkbG9jYXRpb24uaGFzaCgpYCBjaGFuZ2VzLlxuICAgKlxuICAgKiAgICAgIElmIHRoZSBvcHRpb24gaXMgc2V0IHRvIGBmYWxzZWAgYW5kIHVybCBpbiB0aGUgYnJvd3NlciBjaGFuZ2VzLCB0aGVuXG4gICAqICAgICAgYCRyb3V0ZVVwZGF0ZWAgZXZlbnQgaXMgYnJvYWRjYXN0ZWQgb24gdGhlIHJvb3Qgc2NvcGUuXG4gICAqXG4gICAqICAgIC0gYFtjYXNlSW5zZW5zaXRpdmVNYXRjaD1mYWxzZV1gIC0ge2Jvb2xlYW49fSAtIG1hdGNoIHJvdXRlcyB3aXRob3V0IGJlaW5nIGNhc2Ugc2Vuc2l0aXZlXG4gICAqXG4gICAqICAgICAgSWYgdGhlIG9wdGlvbiBpcyBzZXQgdG8gYHRydWVgLCB0aGVuIHRoZSBwYXJ0aWN1bGFyIHJvdXRlIGNhbiBiZSBtYXRjaGVkIHdpdGhvdXQgYmVpbmdcbiAgICogICAgICBjYXNlIHNlbnNpdGl2ZVxuICAgKlxuICAgKiBAcmV0dXJucyB7T2JqZWN0fSBzZWxmXG4gICAqXG4gICAqIEBkZXNjcmlwdGlvblxuICAgKiBBZGRzIGEgbmV3IHJvdXRlIGRlZmluaXRpb24gdG8gdGhlIGAkcm91dGVgIHNlcnZpY2UuXG4gICAqL1xuICB0aGlzLndoZW4gPSBmdW5jdGlvbihwYXRoLCByb3V0ZSkge1xuICAgIHJvdXRlc1twYXRoXSA9IGFuZ3VsYXIuZXh0ZW5kKFxuICAgICAge3JlbG9hZE9uU2VhcmNoOiB0cnVlfSxcbiAgICAgIHJvdXRlLFxuICAgICAgcGF0aCAmJiBwYXRoUmVnRXhwKHBhdGgsIHJvdXRlKVxuICAgICk7XG5cbiAgICAvLyBjcmVhdGUgcmVkaXJlY3Rpb24gZm9yIHRyYWlsaW5nIHNsYXNoZXNcbiAgICBpZiAocGF0aCkge1xuICAgICAgdmFyIHJlZGlyZWN0UGF0aCA9IChwYXRoW3BhdGgubGVuZ3RoLTFdID09ICcvJylcbiAgICAgICAgICAgID8gcGF0aC5zdWJzdHIoMCwgcGF0aC5sZW5ndGgtMSlcbiAgICAgICAgICAgIDogcGF0aCArJy8nO1xuXG4gICAgICByb3V0ZXNbcmVkaXJlY3RQYXRoXSA9IGFuZ3VsYXIuZXh0ZW5kKFxuICAgICAgICB7cmVkaXJlY3RUbzogcGF0aH0sXG4gICAgICAgIHBhdGhSZWdFeHAocmVkaXJlY3RQYXRoLCByb3V0ZSlcbiAgICAgICk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG5cbiAgIC8qKlxuICAgICogQHBhcmFtIHBhdGgge3N0cmluZ30gcGF0aFxuICAgICogQHBhcmFtIG9wdHMge09iamVjdH0gb3B0aW9uc1xuICAgICogQHJldHVybiB7P09iamVjdH1cbiAgICAqXG4gICAgKiBAZGVzY3JpcHRpb25cbiAgICAqIE5vcm1hbGl6ZXMgdGhlIGdpdmVuIHBhdGgsIHJldHVybmluZyBhIHJlZ3VsYXIgZXhwcmVzc2lvblxuICAgICogYW5kIHRoZSBvcmlnaW5hbCBwYXRoLlxuICAgICpcbiAgICAqIEluc3BpcmVkIGJ5IHBhdGhSZXhwIGluIHZpc2lvbm1lZGlhL2V4cHJlc3MvbGliL3V0aWxzLmpzLlxuICAgICovXG4gIGZ1bmN0aW9uIHBhdGhSZWdFeHAocGF0aCwgb3B0cykge1xuICAgIHZhciBpbnNlbnNpdGl2ZSA9IG9wdHMuY2FzZUluc2Vuc2l0aXZlTWF0Y2gsXG4gICAgICAgIHJldCA9IHtcbiAgICAgICAgICBvcmlnaW5hbFBhdGg6IHBhdGgsXG4gICAgICAgICAgcmVnZXhwOiBwYXRoXG4gICAgICAgIH0sXG4gICAgICAgIGtleXMgPSByZXQua2V5cyA9IFtdO1xuXG4gICAgcGF0aCA9IHBhdGhcbiAgICAgIC5yZXBsYWNlKC8oWygpLl0pL2csICdcXFxcJDEnKVxuICAgICAgLnJlcGxhY2UoLyhcXC8pPzooXFx3KykoW1xcP1xcKl0pPy9nLCBmdW5jdGlvbihfLCBzbGFzaCwga2V5LCBvcHRpb24pe1xuICAgICAgICB2YXIgb3B0aW9uYWwgPSBvcHRpb24gPT09ICc/JyA/IG9wdGlvbiA6IG51bGw7XG4gICAgICAgIHZhciBzdGFyID0gb3B0aW9uID09PSAnKicgPyBvcHRpb24gOiBudWxsO1xuICAgICAgICBrZXlzLnB1c2goeyBuYW1lOiBrZXksIG9wdGlvbmFsOiAhIW9wdGlvbmFsIH0pO1xuICAgICAgICBzbGFzaCA9IHNsYXNoIHx8ICcnO1xuICAgICAgICByZXR1cm4gJydcbiAgICAgICAgICArIChvcHRpb25hbCA/ICcnIDogc2xhc2gpXG4gICAgICAgICAgKyAnKD86J1xuICAgICAgICAgICsgKG9wdGlvbmFsID8gc2xhc2ggOiAnJylcbiAgICAgICAgICArIChzdGFyICYmICcoLis/KScgfHwgJyhbXi9dKyknKVxuICAgICAgICAgICsgKG9wdGlvbmFsIHx8ICcnKVxuICAgICAgICAgICsgJyknXG4gICAgICAgICAgKyAob3B0aW9uYWwgfHwgJycpO1xuICAgICAgfSlcbiAgICAgIC5yZXBsYWNlKC8oW1xcLyRcXCpdKS9nLCAnXFxcXCQxJyk7XG5cbiAgICByZXQucmVnZXhwID0gbmV3IFJlZ0V4cCgnXicgKyBwYXRoICsgJyQnLCBpbnNlbnNpdGl2ZSA/ICdpJyA6ICcnKTtcbiAgICByZXR1cm4gcmV0O1xuICB9XG5cbiAgLyoqXG4gICAqIEBuZ2RvYyBtZXRob2RcbiAgICogQG5hbWUgJHJvdXRlUHJvdmlkZXIjb3RoZXJ3aXNlXG4gICAqXG4gICAqIEBkZXNjcmlwdGlvblxuICAgKiBTZXRzIHJvdXRlIGRlZmluaXRpb24gdGhhdCB3aWxsIGJlIHVzZWQgb24gcm91dGUgY2hhbmdlIHdoZW4gbm8gb3RoZXIgcm91dGUgZGVmaW5pdGlvblxuICAgKiBpcyBtYXRjaGVkLlxuICAgKlxuICAgKiBAcGFyYW0ge09iamVjdH0gcGFyYW1zIE1hcHBpbmcgaW5mb3JtYXRpb24gdG8gYmUgYXNzaWduZWQgdG8gYCRyb3V0ZS5jdXJyZW50YC5cbiAgICogQHJldHVybnMge09iamVjdH0gc2VsZlxuICAgKi9cbiAgdGhpcy5vdGhlcndpc2UgPSBmdW5jdGlvbihwYXJhbXMpIHtcbiAgICB0aGlzLndoZW4obnVsbCwgcGFyYW1zKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfTtcblxuXG4gIHRoaXMuJGdldCA9IFsnJHJvb3RTY29wZScsXG4gICAgICAgICAgICAgICAnJGxvY2F0aW9uJyxcbiAgICAgICAgICAgICAgICckcm91dGVQYXJhbXMnLFxuICAgICAgICAgICAgICAgJyRxJyxcbiAgICAgICAgICAgICAgICckaW5qZWN0b3InLFxuICAgICAgICAgICAgICAgJyRodHRwJyxcbiAgICAgICAgICAgICAgICckdGVtcGxhdGVDYWNoZScsXG4gICAgICAgICAgICAgICAnJHNjZScsXG4gICAgICBmdW5jdGlvbigkcm9vdFNjb3BlLCAkbG9jYXRpb24sICRyb3V0ZVBhcmFtcywgJHEsICRpbmplY3RvciwgJGh0dHAsICR0ZW1wbGF0ZUNhY2hlLCAkc2NlKSB7XG5cbiAgICAvKipcbiAgICAgKiBAbmdkb2Mgc2VydmljZVxuICAgICAqIEBuYW1lICRyb3V0ZVxuICAgICAqIEByZXF1aXJlcyAkbG9jYXRpb25cbiAgICAgKiBAcmVxdWlyZXMgJHJvdXRlUGFyYW1zXG4gICAgICpcbiAgICAgKiBAcHJvcGVydHkge09iamVjdH0gY3VycmVudCBSZWZlcmVuY2UgdG8gdGhlIGN1cnJlbnQgcm91dGUgZGVmaW5pdGlvbi5cbiAgICAgKiBUaGUgcm91dGUgZGVmaW5pdGlvbiBjb250YWluczpcbiAgICAgKlxuICAgICAqICAgLSBgY29udHJvbGxlcmA6IFRoZSBjb250cm9sbGVyIGNvbnN0cnVjdG9yIGFzIGRlZmluZSBpbiByb3V0ZSBkZWZpbml0aW9uLlxuICAgICAqICAgLSBgbG9jYWxzYDogQSBtYXAgb2YgbG9jYWxzIHdoaWNoIGlzIHVzZWQgYnkge0BsaW5rIG5nLiRjb250cm9sbGVyICRjb250cm9sbGVyfSBzZXJ2aWNlIGZvclxuICAgICAqICAgICBjb250cm9sbGVyIGluc3RhbnRpYXRpb24uIFRoZSBgbG9jYWxzYCBjb250YWluXG4gICAgICogICAgIHRoZSByZXNvbHZlZCB2YWx1ZXMgb2YgdGhlIGByZXNvbHZlYCBtYXAuIEFkZGl0aW9uYWxseSB0aGUgYGxvY2Fsc2AgYWxzbyBjb250YWluOlxuICAgICAqXG4gICAgICogICAgIC0gYCRzY29wZWAgLSBUaGUgY3VycmVudCByb3V0ZSBzY29wZS5cbiAgICAgKiAgICAgLSBgJHRlbXBsYXRlYCAtIFRoZSBjdXJyZW50IHJvdXRlIHRlbXBsYXRlIEhUTUwuXG4gICAgICpcbiAgICAgKiBAcHJvcGVydHkge09iamVjdH0gcm91dGVzIE9iamVjdCB3aXRoIGFsbCByb3V0ZSBjb25maWd1cmF0aW9uIE9iamVjdHMgYXMgaXRzIHByb3BlcnRpZXMuXG4gICAgICpcbiAgICAgKiBAZGVzY3JpcHRpb25cbiAgICAgKiBgJHJvdXRlYCBpcyB1c2VkIGZvciBkZWVwLWxpbmtpbmcgVVJMcyB0byBjb250cm9sbGVycyBhbmQgdmlld3MgKEhUTUwgcGFydGlhbHMpLlxuICAgICAqIEl0IHdhdGNoZXMgYCRsb2NhdGlvbi51cmwoKWAgYW5kIHRyaWVzIHRvIG1hcCB0aGUgcGF0aCB0byBhbiBleGlzdGluZyByb3V0ZSBkZWZpbml0aW9uLlxuICAgICAqXG4gICAgICogUmVxdWlyZXMgdGhlIHtAbGluayBuZ1JvdXRlIGBuZ1JvdXRlYH0gbW9kdWxlIHRvIGJlIGluc3RhbGxlZC5cbiAgICAgKlxuICAgICAqIFlvdSBjYW4gZGVmaW5lIHJvdXRlcyB0aHJvdWdoIHtAbGluayBuZ1JvdXRlLiRyb3V0ZVByb3ZpZGVyICRyb3V0ZVByb3ZpZGVyfSdzIEFQSS5cbiAgICAgKlxuICAgICAqIFRoZSBgJHJvdXRlYCBzZXJ2aWNlIGlzIHR5cGljYWxseSB1c2VkIGluIGNvbmp1bmN0aW9uIHdpdGggdGhlXG4gICAgICoge0BsaW5rIG5nUm91dGUuZGlyZWN0aXZlOm5nVmlldyBgbmdWaWV3YH0gZGlyZWN0aXZlIGFuZCB0aGVcbiAgICAgKiB7QGxpbmsgbmdSb3V0ZS4kcm91dGVQYXJhbXMgYCRyb3V0ZVBhcmFtc2B9IHNlcnZpY2UuXG4gICAgICpcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIFRoaXMgZXhhbXBsZSBzaG93cyBob3cgY2hhbmdpbmcgdGhlIFVSTCBoYXNoIGNhdXNlcyB0aGUgYCRyb3V0ZWAgdG8gbWF0Y2ggYSByb3V0ZSBhZ2FpbnN0IHRoZVxuICAgICAqIFVSTCwgYW5kIHRoZSBgbmdWaWV3YCBwdWxscyBpbiB0aGUgcGFydGlhbC5cbiAgICAgKlxuICAgICAqIE5vdGUgdGhhdCB0aGlzIGV4YW1wbGUgaXMgdXNpbmcge0BsaW5rIG5nLmRpcmVjdGl2ZTpzY3JpcHQgaW5saW5lZCB0ZW1wbGF0ZXN9XG4gICAgICogdG8gZ2V0IGl0IHdvcmtpbmcgb24ganNmaWRkbGUgYXMgd2VsbC5cbiAgICAgKlxuICAgICAqIDxleGFtcGxlIG5hbWU9XCIkcm91dGUtc2VydmljZVwiIG1vZHVsZT1cIm5nUm91dGVFeGFtcGxlXCJcbiAgICAgKiAgICAgICAgICBkZXBzPVwiYW5ndWxhci1yb3V0ZS5qc1wiIGZpeEJhc2U9XCJ0cnVlXCI+XG4gICAgICogICA8ZmlsZSBuYW1lPVwiaW5kZXguaHRtbFwiPlxuICAgICAqICAgICA8ZGl2IG5nLWNvbnRyb2xsZXI9XCJNYWluQ29udHJvbGxlclwiPlxuICAgICAqICAgICAgIENob29zZTpcbiAgICAgKiAgICAgICA8YSBocmVmPVwiQm9vay9Nb2J5XCI+TW9ieTwvYT4gfFxuICAgICAqICAgICAgIDxhIGhyZWY9XCJCb29rL01vYnkvY2gvMVwiPk1vYnk6IENoMTwvYT4gfFxuICAgICAqICAgICAgIDxhIGhyZWY9XCJCb29rL0dhdHNieVwiPkdhdHNieTwvYT4gfFxuICAgICAqICAgICAgIDxhIGhyZWY9XCJCb29rL0dhdHNieS9jaC80P2tleT12YWx1ZVwiPkdhdHNieTogQ2g0PC9hPiB8XG4gICAgICogICAgICAgPGEgaHJlZj1cIkJvb2svU2NhcmxldFwiPlNjYXJsZXQgTGV0dGVyPC9hPjxici8+XG4gICAgICpcbiAgICAgKiAgICAgICA8ZGl2IG5nLXZpZXc+PC9kaXY+XG4gICAgICpcbiAgICAgKiAgICAgICA8aHIgLz5cbiAgICAgKlxuICAgICAqICAgICAgIDxwcmU+JGxvY2F0aW9uLnBhdGgoKSA9IHt7JGxvY2F0aW9uLnBhdGgoKX19PC9wcmU+XG4gICAgICogICAgICAgPHByZT4kcm91dGUuY3VycmVudC50ZW1wbGF0ZVVybCA9IHt7JHJvdXRlLmN1cnJlbnQudGVtcGxhdGVVcmx9fTwvcHJlPlxuICAgICAqICAgICAgIDxwcmU+JHJvdXRlLmN1cnJlbnQucGFyYW1zID0ge3skcm91dGUuY3VycmVudC5wYXJhbXN9fTwvcHJlPlxuICAgICAqICAgICAgIDxwcmU+JHJvdXRlLmN1cnJlbnQuc2NvcGUubmFtZSA9IHt7JHJvdXRlLmN1cnJlbnQuc2NvcGUubmFtZX19PC9wcmU+XG4gICAgICogICAgICAgPHByZT4kcm91dGVQYXJhbXMgPSB7eyRyb3V0ZVBhcmFtc319PC9wcmU+XG4gICAgICogICAgIDwvZGl2PlxuICAgICAqICAgPC9maWxlPlxuICAgICAqXG4gICAgICogICA8ZmlsZSBuYW1lPVwiYm9vay5odG1sXCI+XG4gICAgICogICAgIGNvbnRyb2xsZXI6IHt7bmFtZX19PGJyIC8+XG4gICAgICogICAgIEJvb2sgSWQ6IHt7cGFyYW1zLmJvb2tJZH19PGJyIC8+XG4gICAgICogICA8L2ZpbGU+XG4gICAgICpcbiAgICAgKiAgIDxmaWxlIG5hbWU9XCJjaGFwdGVyLmh0bWxcIj5cbiAgICAgKiAgICAgY29udHJvbGxlcjoge3tuYW1lfX08YnIgLz5cbiAgICAgKiAgICAgQm9vayBJZDoge3twYXJhbXMuYm9va0lkfX08YnIgLz5cbiAgICAgKiAgICAgQ2hhcHRlciBJZDoge3twYXJhbXMuY2hhcHRlcklkfX1cbiAgICAgKiAgIDwvZmlsZT5cbiAgICAgKlxuICAgICAqICAgPGZpbGUgbmFtZT1cInNjcmlwdC5qc1wiPlxuICAgICAqICAgICBhbmd1bGFyLm1vZHVsZSgnbmdSb3V0ZUV4YW1wbGUnLCBbJ25nUm91dGUnXSlcbiAgICAgKlxuICAgICAqICAgICAgLmNvbnRyb2xsZXIoJ01haW5Db250cm9sbGVyJywgZnVuY3Rpb24oJHNjb3BlLCAkcm91dGUsICRyb3V0ZVBhcmFtcywgJGxvY2F0aW9uKSB7XG4gICAgICogICAgICAgICAgJHNjb3BlLiRyb3V0ZSA9ICRyb3V0ZTtcbiAgICAgKiAgICAgICAgICAkc2NvcGUuJGxvY2F0aW9uID0gJGxvY2F0aW9uO1xuICAgICAqICAgICAgICAgICRzY29wZS4kcm91dGVQYXJhbXMgPSAkcm91dGVQYXJhbXM7XG4gICAgICogICAgICB9KVxuICAgICAqXG4gICAgICogICAgICAuY29udHJvbGxlcignQm9va0NvbnRyb2xsZXInLCBmdW5jdGlvbigkc2NvcGUsICRyb3V0ZVBhcmFtcykge1xuICAgICAqICAgICAgICAgICRzY29wZS5uYW1lID0gXCJCb29rQ29udHJvbGxlclwiO1xuICAgICAqICAgICAgICAgICRzY29wZS5wYXJhbXMgPSAkcm91dGVQYXJhbXM7XG4gICAgICogICAgICB9KVxuICAgICAqXG4gICAgICogICAgICAuY29udHJvbGxlcignQ2hhcHRlckNvbnRyb2xsZXInLCBmdW5jdGlvbigkc2NvcGUsICRyb3V0ZVBhcmFtcykge1xuICAgICAqICAgICAgICAgICRzY29wZS5uYW1lID0gXCJDaGFwdGVyQ29udHJvbGxlclwiO1xuICAgICAqICAgICAgICAgICRzY29wZS5wYXJhbXMgPSAkcm91dGVQYXJhbXM7XG4gICAgICogICAgICB9KVxuICAgICAqXG4gICAgICogICAgIC5jb25maWcoZnVuY3Rpb24oJHJvdXRlUHJvdmlkZXIsICRsb2NhdGlvblByb3ZpZGVyKSB7XG4gICAgICogICAgICAgJHJvdXRlUHJvdmlkZXJcbiAgICAgKiAgICAgICAgLndoZW4oJy9Cb29rLzpib29rSWQnLCB7XG4gICAgICogICAgICAgICB0ZW1wbGF0ZVVybDogJ2Jvb2suaHRtbCcsXG4gICAgICogICAgICAgICBjb250cm9sbGVyOiAnQm9va0NvbnRyb2xsZXInLFxuICAgICAqICAgICAgICAgcmVzb2x2ZToge1xuICAgICAqICAgICAgICAgICAvLyBJIHdpbGwgY2F1c2UgYSAxIHNlY29uZCBkZWxheVxuICAgICAqICAgICAgICAgICBkZWxheTogZnVuY3Rpb24oJHEsICR0aW1lb3V0KSB7XG4gICAgICogICAgICAgICAgICAgdmFyIGRlbGF5ID0gJHEuZGVmZXIoKTtcbiAgICAgKiAgICAgICAgICAgICAkdGltZW91dChkZWxheS5yZXNvbHZlLCAxMDAwKTtcbiAgICAgKiAgICAgICAgICAgICByZXR1cm4gZGVsYXkucHJvbWlzZTtcbiAgICAgKiAgICAgICAgICAgfVxuICAgICAqICAgICAgICAgfVxuICAgICAqICAgICAgIH0pXG4gICAgICogICAgICAgLndoZW4oJy9Cb29rLzpib29rSWQvY2gvOmNoYXB0ZXJJZCcsIHtcbiAgICAgKiAgICAgICAgIHRlbXBsYXRlVXJsOiAnY2hhcHRlci5odG1sJyxcbiAgICAgKiAgICAgICAgIGNvbnRyb2xsZXI6ICdDaGFwdGVyQ29udHJvbGxlcidcbiAgICAgKiAgICAgICB9KTtcbiAgICAgKlxuICAgICAqICAgICAgIC8vIGNvbmZpZ3VyZSBodG1sNSB0byBnZXQgbGlua3Mgd29ya2luZyBvbiBqc2ZpZGRsZVxuICAgICAqICAgICAgICRsb2NhdGlvblByb3ZpZGVyLmh0bWw1TW9kZSh0cnVlKTtcbiAgICAgKiAgICAgfSk7XG4gICAgICpcbiAgICAgKiAgIDwvZmlsZT5cbiAgICAgKlxuICAgICAqICAgPGZpbGUgbmFtZT1cInByb3RyYWN0b3IuanNcIiB0eXBlPVwicHJvdHJhY3RvclwiPlxuICAgICAqICAgICBpdCgnc2hvdWxkIGxvYWQgYW5kIGNvbXBpbGUgY29ycmVjdCB0ZW1wbGF0ZScsIGZ1bmN0aW9uKCkge1xuICAgICAqICAgICAgIGVsZW1lbnQoYnkubGlua1RleHQoJ01vYnk6IENoMScpKS5jbGljaygpO1xuICAgICAqICAgICAgIHZhciBjb250ZW50ID0gZWxlbWVudChieS5jc3MoJ1tuZy12aWV3XScpKS5nZXRUZXh0KCk7XG4gICAgICogICAgICAgZXhwZWN0KGNvbnRlbnQpLnRvTWF0Y2goL2NvbnRyb2xsZXJcXDogQ2hhcHRlckNvbnRyb2xsZXIvKTtcbiAgICAgKiAgICAgICBleHBlY3QoY29udGVudCkudG9NYXRjaCgvQm9vayBJZFxcOiBNb2J5Lyk7XG4gICAgICogICAgICAgZXhwZWN0KGNvbnRlbnQpLnRvTWF0Y2goL0NoYXB0ZXIgSWRcXDogMS8pO1xuICAgICAqXG4gICAgICogICAgICAgZWxlbWVudChieS5wYXJ0aWFsTGlua1RleHQoJ1NjYXJsZXQnKSkuY2xpY2soKTtcbiAgICAgKlxuICAgICAqICAgICAgIGNvbnRlbnQgPSBlbGVtZW50KGJ5LmNzcygnW25nLXZpZXddJykpLmdldFRleHQoKTtcbiAgICAgKiAgICAgICBleHBlY3QoY29udGVudCkudG9NYXRjaCgvY29udHJvbGxlclxcOiBCb29rQ29udHJvbGxlci8pO1xuICAgICAqICAgICAgIGV4cGVjdChjb250ZW50KS50b01hdGNoKC9Cb29rIElkXFw6IFNjYXJsZXQvKTtcbiAgICAgKiAgICAgfSk7XG4gICAgICogICA8L2ZpbGU+XG4gICAgICogPC9leGFtcGxlPlxuICAgICAqL1xuXG4gICAgLyoqXG4gICAgICogQG5nZG9jIGV2ZW50XG4gICAgICogQG5hbWUgJHJvdXRlIyRyb3V0ZUNoYW5nZVN0YXJ0XG4gICAgICogQGV2ZW50VHlwZSBicm9hZGNhc3Qgb24gcm9vdCBzY29wZVxuICAgICAqIEBkZXNjcmlwdGlvblxuICAgICAqIEJyb2FkY2FzdGVkIGJlZm9yZSBhIHJvdXRlIGNoYW5nZS4gQXQgdGhpcyAgcG9pbnQgdGhlIHJvdXRlIHNlcnZpY2VzIHN0YXJ0c1xuICAgICAqIHJlc29sdmluZyBhbGwgb2YgdGhlIGRlcGVuZGVuY2llcyBuZWVkZWQgZm9yIHRoZSByb3V0ZSBjaGFuZ2UgdG8gb2NjdXIuXG4gICAgICogVHlwaWNhbGx5IHRoaXMgaW52b2x2ZXMgZmV0Y2hpbmcgdGhlIHZpZXcgdGVtcGxhdGUgYXMgd2VsbCBhcyBhbnkgZGVwZW5kZW5jaWVzXG4gICAgICogZGVmaW5lZCBpbiBgcmVzb2x2ZWAgcm91dGUgcHJvcGVydHkuIE9uY2UgIGFsbCBvZiB0aGUgZGVwZW5kZW5jaWVzIGFyZSByZXNvbHZlZFxuICAgICAqIGAkcm91dGVDaGFuZ2VTdWNjZXNzYCBpcyBmaXJlZC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBhbmd1bGFyRXZlbnQgU3ludGhldGljIGV2ZW50IG9iamVjdC5cbiAgICAgKiBAcGFyYW0ge1JvdXRlfSBuZXh0IEZ1dHVyZSByb3V0ZSBpbmZvcm1hdGlvbi5cbiAgICAgKiBAcGFyYW0ge1JvdXRlfSBjdXJyZW50IEN1cnJlbnQgcm91dGUgaW5mb3JtYXRpb24uXG4gICAgICovXG5cbiAgICAvKipcbiAgICAgKiBAbmdkb2MgZXZlbnRcbiAgICAgKiBAbmFtZSAkcm91dGUjJHJvdXRlQ2hhbmdlU3VjY2Vzc1xuICAgICAqIEBldmVudFR5cGUgYnJvYWRjYXN0IG9uIHJvb3Qgc2NvcGVcbiAgICAgKiBAZGVzY3JpcHRpb25cbiAgICAgKiBCcm9hZGNhc3RlZCBhZnRlciBhIHJvdXRlIGRlcGVuZGVuY2llcyBhcmUgcmVzb2x2ZWQuXG4gICAgICoge0BsaW5rIG5nUm91dGUuZGlyZWN0aXZlOm5nVmlldyBuZ1ZpZXd9IGxpc3RlbnMgZm9yIHRoZSBkaXJlY3RpdmVcbiAgICAgKiB0byBpbnN0YW50aWF0ZSB0aGUgY29udHJvbGxlciBhbmQgcmVuZGVyIHRoZSB2aWV3LlxuICAgICAqXG4gICAgICogQHBhcmFtIHtPYmplY3R9IGFuZ3VsYXJFdmVudCBTeW50aGV0aWMgZXZlbnQgb2JqZWN0LlxuICAgICAqIEBwYXJhbSB7Um91dGV9IGN1cnJlbnQgQ3VycmVudCByb3V0ZSBpbmZvcm1hdGlvbi5cbiAgICAgKiBAcGFyYW0ge1JvdXRlfFVuZGVmaW5lZH0gcHJldmlvdXMgUHJldmlvdXMgcm91dGUgaW5mb3JtYXRpb24sIG9yIHVuZGVmaW5lZCBpZiBjdXJyZW50IGlzXG4gICAgICogZmlyc3Qgcm91dGUgZW50ZXJlZC5cbiAgICAgKi9cblxuICAgIC8qKlxuICAgICAqIEBuZ2RvYyBldmVudFxuICAgICAqIEBuYW1lICRyb3V0ZSMkcm91dGVDaGFuZ2VFcnJvclxuICAgICAqIEBldmVudFR5cGUgYnJvYWRjYXN0IG9uIHJvb3Qgc2NvcGVcbiAgICAgKiBAZGVzY3JpcHRpb25cbiAgICAgKiBCcm9hZGNhc3RlZCBpZiBhbnkgb2YgdGhlIHJlc29sdmUgcHJvbWlzZXMgYXJlIHJlamVjdGVkLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtPYmplY3R9IGFuZ3VsYXJFdmVudCBTeW50aGV0aWMgZXZlbnQgb2JqZWN0XG4gICAgICogQHBhcmFtIHtSb3V0ZX0gY3VycmVudCBDdXJyZW50IHJvdXRlIGluZm9ybWF0aW9uLlxuICAgICAqIEBwYXJhbSB7Um91dGV9IHByZXZpb3VzIFByZXZpb3VzIHJvdXRlIGluZm9ybWF0aW9uLlxuICAgICAqIEBwYXJhbSB7Um91dGV9IHJlamVjdGlvbiBSZWplY3Rpb24gb2YgdGhlIHByb21pc2UuIFVzdWFsbHkgdGhlIGVycm9yIG9mIHRoZSBmYWlsZWQgcHJvbWlzZS5cbiAgICAgKi9cblxuICAgIC8qKlxuICAgICAqIEBuZ2RvYyBldmVudFxuICAgICAqIEBuYW1lICRyb3V0ZSMkcm91dGVVcGRhdGVcbiAgICAgKiBAZXZlbnRUeXBlIGJyb2FkY2FzdCBvbiByb290IHNjb3BlXG4gICAgICogQGRlc2NyaXB0aW9uXG4gICAgICpcbiAgICAgKiBUaGUgYHJlbG9hZE9uU2VhcmNoYCBwcm9wZXJ0eSBoYXMgYmVlbiBzZXQgdG8gZmFsc2UsIGFuZCB3ZSBhcmUgcmV1c2luZyB0aGUgc2FtZVxuICAgICAqIGluc3RhbmNlIG9mIHRoZSBDb250cm9sbGVyLlxuICAgICAqL1xuXG4gICAgdmFyIGZvcmNlUmVsb2FkID0gZmFsc2UsXG4gICAgICAgICRyb3V0ZSA9IHtcbiAgICAgICAgICByb3V0ZXM6IHJvdXRlcyxcblxuICAgICAgICAgIC8qKlxuICAgICAgICAgICAqIEBuZ2RvYyBtZXRob2RcbiAgICAgICAgICAgKiBAbmFtZSAkcm91dGUjcmVsb2FkXG4gICAgICAgICAgICpcbiAgICAgICAgICAgKiBAZGVzY3JpcHRpb25cbiAgICAgICAgICAgKiBDYXVzZXMgYCRyb3V0ZWAgc2VydmljZSB0byByZWxvYWQgdGhlIGN1cnJlbnQgcm91dGUgZXZlbiBpZlxuICAgICAgICAgICAqIHtAbGluayBuZy4kbG9jYXRpb24gJGxvY2F0aW9ufSBoYXNuJ3QgY2hhbmdlZC5cbiAgICAgICAgICAgKlxuICAgICAgICAgICAqIEFzIGEgcmVzdWx0IG9mIHRoYXQsIHtAbGluayBuZ1JvdXRlLmRpcmVjdGl2ZTpuZ1ZpZXcgbmdWaWV3fVxuICAgICAgICAgICAqIGNyZWF0ZXMgbmV3IHNjb3BlLCByZWluc3RhbnRpYXRlcyB0aGUgY29udHJvbGxlci5cbiAgICAgICAgICAgKi9cbiAgICAgICAgICByZWxvYWQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgZm9yY2VSZWxvYWQgPSB0cnVlO1xuICAgICAgICAgICAgJHJvb3RTY29wZS4kZXZhbEFzeW5jKHVwZGF0ZVJvdXRlKTtcbiAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAkcm9vdFNjb3BlLiRvbignJGxvY2F0aW9uQ2hhbmdlU3VjY2VzcycsIHVwZGF0ZVJvdXRlKTtcblxuICAgIHJldHVybiAkcm91dGU7XG5cbiAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuXG4gICAgLyoqXG4gICAgICogQHBhcmFtIG9uIHtzdHJpbmd9IGN1cnJlbnQgdXJsXG4gICAgICogQHBhcmFtIHJvdXRlIHtPYmplY3R9IHJvdXRlIHJlZ2V4cCB0byBtYXRjaCB0aGUgdXJsIGFnYWluc3RcbiAgICAgKiBAcmV0dXJuIHs/T2JqZWN0fVxuICAgICAqXG4gICAgICogQGRlc2NyaXB0aW9uXG4gICAgICogQ2hlY2sgaWYgdGhlIHJvdXRlIG1hdGNoZXMgdGhlIGN1cnJlbnQgdXJsLlxuICAgICAqXG4gICAgICogSW5zcGlyZWQgYnkgbWF0Y2ggaW5cbiAgICAgKiB2aXNpb25tZWRpYS9leHByZXNzL2xpYi9yb3V0ZXIvcm91dGVyLmpzLlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIHN3aXRjaFJvdXRlTWF0Y2hlcihvbiwgcm91dGUpIHtcbiAgICAgIHZhciBrZXlzID0gcm91dGUua2V5cyxcbiAgICAgICAgICBwYXJhbXMgPSB7fTtcblxuICAgICAgaWYgKCFyb3V0ZS5yZWdleHApIHJldHVybiBudWxsO1xuXG4gICAgICB2YXIgbSA9IHJvdXRlLnJlZ2V4cC5leGVjKG9uKTtcbiAgICAgIGlmICghbSkgcmV0dXJuIG51bGw7XG5cbiAgICAgIGZvciAodmFyIGkgPSAxLCBsZW4gPSBtLmxlbmd0aDsgaSA8IGxlbjsgKytpKSB7XG4gICAgICAgIHZhciBrZXkgPSBrZXlzW2kgLSAxXTtcblxuICAgICAgICB2YXIgdmFsID0gbVtpXTtcblxuICAgICAgICBpZiAoa2V5ICYmIHZhbCkge1xuICAgICAgICAgIHBhcmFtc1trZXkubmFtZV0gPSB2YWw7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBwYXJhbXM7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gdXBkYXRlUm91dGUoKSB7XG4gICAgICB2YXIgbmV4dCA9IHBhcnNlUm91dGUoKSxcbiAgICAgICAgICBsYXN0ID0gJHJvdXRlLmN1cnJlbnQ7XG5cbiAgICAgIGlmIChuZXh0ICYmIGxhc3QgJiYgbmV4dC4kJHJvdXRlID09PSBsYXN0LiQkcm91dGVcbiAgICAgICAgICAmJiBhbmd1bGFyLmVxdWFscyhuZXh0LnBhdGhQYXJhbXMsIGxhc3QucGF0aFBhcmFtcylcbiAgICAgICAgICAmJiAhbmV4dC5yZWxvYWRPblNlYXJjaCAmJiAhZm9yY2VSZWxvYWQpIHtcbiAgICAgICAgbGFzdC5wYXJhbXMgPSBuZXh0LnBhcmFtcztcbiAgICAgICAgYW5ndWxhci5jb3B5KGxhc3QucGFyYW1zLCAkcm91dGVQYXJhbXMpO1xuICAgICAgICAkcm9vdFNjb3BlLiRicm9hZGNhc3QoJyRyb3V0ZVVwZGF0ZScsIGxhc3QpO1xuICAgICAgfSBlbHNlIGlmIChuZXh0IHx8IGxhc3QpIHtcbiAgICAgICAgZm9yY2VSZWxvYWQgPSBmYWxzZTtcbiAgICAgICAgJHJvb3RTY29wZS4kYnJvYWRjYXN0KCckcm91dGVDaGFuZ2VTdGFydCcsIG5leHQsIGxhc3QpO1xuICAgICAgICAkcm91dGUuY3VycmVudCA9IG5leHQ7XG4gICAgICAgIGlmIChuZXh0KSB7XG4gICAgICAgICAgaWYgKG5leHQucmVkaXJlY3RUbykge1xuICAgICAgICAgICAgaWYgKGFuZ3VsYXIuaXNTdHJpbmcobmV4dC5yZWRpcmVjdFRvKSkge1xuICAgICAgICAgICAgICAkbG9jYXRpb24ucGF0aChpbnRlcnBvbGF0ZShuZXh0LnJlZGlyZWN0VG8sIG5leHQucGFyYW1zKSkuc2VhcmNoKG5leHQucGFyYW1zKVxuICAgICAgICAgICAgICAgICAgICAgICAucmVwbGFjZSgpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgJGxvY2F0aW9uLnVybChuZXh0LnJlZGlyZWN0VG8obmV4dC5wYXRoUGFyYW1zLCAkbG9jYXRpb24ucGF0aCgpLCAkbG9jYXRpb24uc2VhcmNoKCkpKVxuICAgICAgICAgICAgICAgICAgICAgICAucmVwbGFjZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgICRxLndoZW4obmV4dCkuXG4gICAgICAgICAgdGhlbihmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGlmIChuZXh0KSB7XG4gICAgICAgICAgICAgIHZhciBsb2NhbHMgPSBhbmd1bGFyLmV4dGVuZCh7fSwgbmV4dC5yZXNvbHZlKSxcbiAgICAgICAgICAgICAgICAgIHRlbXBsYXRlLCB0ZW1wbGF0ZVVybDtcblxuICAgICAgICAgICAgICBhbmd1bGFyLmZvckVhY2gobG9jYWxzLCBmdW5jdGlvbih2YWx1ZSwga2V5KSB7XG4gICAgICAgICAgICAgICAgbG9jYWxzW2tleV0gPSBhbmd1bGFyLmlzU3RyaW5nKHZhbHVlKSA/XG4gICAgICAgICAgICAgICAgICAgICRpbmplY3Rvci5nZXQodmFsdWUpIDogJGluamVjdG9yLmludm9rZSh2YWx1ZSk7XG4gICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgIGlmIChhbmd1bGFyLmlzRGVmaW5lZCh0ZW1wbGF0ZSA9IG5leHQudGVtcGxhdGUpKSB7XG4gICAgICAgICAgICAgICAgaWYgKGFuZ3VsYXIuaXNGdW5jdGlvbih0ZW1wbGF0ZSkpIHtcbiAgICAgICAgICAgICAgICAgIHRlbXBsYXRlID0gdGVtcGxhdGUobmV4dC5wYXJhbXMpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfSBlbHNlIGlmIChhbmd1bGFyLmlzRGVmaW5lZCh0ZW1wbGF0ZVVybCA9IG5leHQudGVtcGxhdGVVcmwpKSB7XG4gICAgICAgICAgICAgICAgaWYgKGFuZ3VsYXIuaXNGdW5jdGlvbih0ZW1wbGF0ZVVybCkpIHtcbiAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsID0gdGVtcGxhdGVVcmwobmV4dC5wYXJhbXMpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybCA9ICRzY2UuZ2V0VHJ1c3RlZFJlc291cmNlVXJsKHRlbXBsYXRlVXJsKTtcbiAgICAgICAgICAgICAgICBpZiAoYW5ndWxhci5pc0RlZmluZWQodGVtcGxhdGVVcmwpKSB7XG4gICAgICAgICAgICAgICAgICBuZXh0LmxvYWRlZFRlbXBsYXRlVXJsID0gdGVtcGxhdGVVcmw7XG4gICAgICAgICAgICAgICAgICB0ZW1wbGF0ZSA9ICRodHRwLmdldCh0ZW1wbGF0ZVVybCwge2NhY2hlOiAkdGVtcGxhdGVDYWNoZX0pLlxuICAgICAgICAgICAgICAgICAgICAgIHRoZW4oZnVuY3Rpb24ocmVzcG9uc2UpIHsgcmV0dXJuIHJlc3BvbnNlLmRhdGE7IH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBpZiAoYW5ndWxhci5pc0RlZmluZWQodGVtcGxhdGUpKSB7XG4gICAgICAgICAgICAgICAgbG9jYWxzWyckdGVtcGxhdGUnXSA9IHRlbXBsYXRlO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIHJldHVybiAkcS5hbGwobG9jYWxzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KS5cbiAgICAgICAgICAvLyBhZnRlciByb3V0ZSBjaGFuZ2VcbiAgICAgICAgICB0aGVuKGZ1bmN0aW9uKGxvY2Fscykge1xuICAgICAgICAgICAgaWYgKG5leHQgPT0gJHJvdXRlLmN1cnJlbnQpIHtcbiAgICAgICAgICAgICAgaWYgKG5leHQpIHtcbiAgICAgICAgICAgICAgICBuZXh0LmxvY2FscyA9IGxvY2FscztcbiAgICAgICAgICAgICAgICBhbmd1bGFyLmNvcHkobmV4dC5wYXJhbXMsICRyb3V0ZVBhcmFtcyk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgJHJvb3RTY29wZS4kYnJvYWRjYXN0KCckcm91dGVDaGFuZ2VTdWNjZXNzJywgbmV4dCwgbGFzdCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSwgZnVuY3Rpb24oZXJyb3IpIHtcbiAgICAgICAgICAgIGlmIChuZXh0ID09ICRyb3V0ZS5jdXJyZW50KSB7XG4gICAgICAgICAgICAgICRyb290U2NvcGUuJGJyb2FkY2FzdCgnJHJvdXRlQ2hhbmdlRXJyb3InLCBuZXh0LCBsYXN0LCBlcnJvcik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuXG5cbiAgICAvKipcbiAgICAgKiBAcmV0dXJucyB7T2JqZWN0fSB0aGUgY3VycmVudCBhY3RpdmUgcm91dGUsIGJ5IG1hdGNoaW5nIGl0IGFnYWluc3QgdGhlIFVSTFxuICAgICAqL1xuICAgIGZ1bmN0aW9uIHBhcnNlUm91dGUoKSB7XG4gICAgICAvLyBNYXRjaCBhIHJvdXRlXG4gICAgICB2YXIgcGFyYW1zLCBtYXRjaDtcbiAgICAgIGFuZ3VsYXIuZm9yRWFjaChyb3V0ZXMsIGZ1bmN0aW9uKHJvdXRlLCBwYXRoKSB7XG4gICAgICAgIGlmICghbWF0Y2ggJiYgKHBhcmFtcyA9IHN3aXRjaFJvdXRlTWF0Y2hlcigkbG9jYXRpb24ucGF0aCgpLCByb3V0ZSkpKSB7XG4gICAgICAgICAgbWF0Y2ggPSBpbmhlcml0KHJvdXRlLCB7XG4gICAgICAgICAgICBwYXJhbXM6IGFuZ3VsYXIuZXh0ZW5kKHt9LCAkbG9jYXRpb24uc2VhcmNoKCksIHBhcmFtcyksXG4gICAgICAgICAgICBwYXRoUGFyYW1zOiBwYXJhbXN9KTtcbiAgICAgICAgICBtYXRjaC4kJHJvdXRlID0gcm91dGU7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgLy8gTm8gcm91dGUgbWF0Y2hlZDsgZmFsbGJhY2sgdG8gXCJvdGhlcndpc2VcIiByb3V0ZVxuICAgICAgcmV0dXJuIG1hdGNoIHx8IHJvdXRlc1tudWxsXSAmJiBpbmhlcml0KHJvdXRlc1tudWxsXSwge3BhcmFtczoge30sIHBhdGhQYXJhbXM6e319KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAcmV0dXJucyB7c3RyaW5nfSBpbnRlcnBvbGF0aW9uIG9mIHRoZSByZWRpcmVjdCBwYXRoIHdpdGggdGhlIHBhcmFtZXRlcnNcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBpbnRlcnBvbGF0ZShzdHJpbmcsIHBhcmFtcykge1xuICAgICAgdmFyIHJlc3VsdCA9IFtdO1xuICAgICAgYW5ndWxhci5mb3JFYWNoKChzdHJpbmd8fCcnKS5zcGxpdCgnOicpLCBmdW5jdGlvbihzZWdtZW50LCBpKSB7XG4gICAgICAgIGlmIChpID09PSAwKSB7XG4gICAgICAgICAgcmVzdWx0LnB1c2goc2VnbWVudCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdmFyIHNlZ21lbnRNYXRjaCA9IHNlZ21lbnQubWF0Y2goLyhcXHcrKSguKikvKTtcbiAgICAgICAgICB2YXIga2V5ID0gc2VnbWVudE1hdGNoWzFdO1xuICAgICAgICAgIHJlc3VsdC5wdXNoKHBhcmFtc1trZXldKTtcbiAgICAgICAgICByZXN1bHQucHVzaChzZWdtZW50TWF0Y2hbMl0gfHwgJycpO1xuICAgICAgICAgIGRlbGV0ZSBwYXJhbXNba2V5XTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICByZXR1cm4gcmVzdWx0LmpvaW4oJycpO1xuICAgIH1cbiAgfV07XG59XG5cbm5nUm91dGVNb2R1bGUucHJvdmlkZXIoJyRyb3V0ZVBhcmFtcycsICRSb3V0ZVBhcmFtc1Byb3ZpZGVyKTtcblxuXG4vKipcbiAqIEBuZ2RvYyBzZXJ2aWNlXG4gKiBAbmFtZSAkcm91dGVQYXJhbXNcbiAqIEByZXF1aXJlcyAkcm91dGVcbiAqXG4gKiBAZGVzY3JpcHRpb25cbiAqIFRoZSBgJHJvdXRlUGFyYW1zYCBzZXJ2aWNlIGFsbG93cyB5b3UgdG8gcmV0cmlldmUgdGhlIGN1cnJlbnQgc2V0IG9mIHJvdXRlIHBhcmFtZXRlcnMuXG4gKlxuICogUmVxdWlyZXMgdGhlIHtAbGluayBuZ1JvdXRlIGBuZ1JvdXRlYH0gbW9kdWxlIHRvIGJlIGluc3RhbGxlZC5cbiAqXG4gKiBUaGUgcm91dGUgcGFyYW1ldGVycyBhcmUgYSBjb21iaW5hdGlvbiBvZiB7QGxpbmsgbmcuJGxvY2F0aW9uIGAkbG9jYXRpb25gfSdzXG4gKiB7QGxpbmsgbmcuJGxvY2F0aW9uI3NlYXJjaCBgc2VhcmNoKClgfSBhbmQge0BsaW5rIG5nLiRsb2NhdGlvbiNwYXRoIGBwYXRoKClgfS5cbiAqIFRoZSBgcGF0aGAgcGFyYW1ldGVycyBhcmUgZXh0cmFjdGVkIHdoZW4gdGhlIHtAbGluayBuZ1JvdXRlLiRyb3V0ZSBgJHJvdXRlYH0gcGF0aCBpcyBtYXRjaGVkLlxuICpcbiAqIEluIGNhc2Ugb2YgcGFyYW1ldGVyIG5hbWUgY29sbGlzaW9uLCBgcGF0aGAgcGFyYW1zIHRha2UgcHJlY2VkZW5jZSBvdmVyIGBzZWFyY2hgIHBhcmFtcy5cbiAqXG4gKiBUaGUgc2VydmljZSBndWFyYW50ZWVzIHRoYXQgdGhlIGlkZW50aXR5IG9mIHRoZSBgJHJvdXRlUGFyYW1zYCBvYmplY3Qgd2lsbCByZW1haW4gdW5jaGFuZ2VkXG4gKiAoYnV0IGl0cyBwcm9wZXJ0aWVzIHdpbGwgbGlrZWx5IGNoYW5nZSkgZXZlbiB3aGVuIGEgcm91dGUgY2hhbmdlIG9jY3Vycy5cbiAqXG4gKiBOb3RlIHRoYXQgdGhlIGAkcm91dGVQYXJhbXNgIGFyZSBvbmx5IHVwZGF0ZWQgKmFmdGVyKiBhIHJvdXRlIGNoYW5nZSBjb21wbGV0ZXMgc3VjY2Vzc2Z1bGx5LlxuICogVGhpcyBtZWFucyB0aGF0IHlvdSBjYW5ub3QgcmVseSBvbiBgJHJvdXRlUGFyYW1zYCBiZWluZyBjb3JyZWN0IGluIHJvdXRlIHJlc29sdmUgZnVuY3Rpb25zLlxuICogSW5zdGVhZCB5b3UgY2FuIHVzZSBgJHJvdXRlLmN1cnJlbnQucGFyYW1zYCB0byBhY2Nlc3MgdGhlIG5ldyByb3V0ZSdzIHBhcmFtZXRlcnMuXG4gKlxuICogQGV4YW1wbGVcbiAqIGBgYGpzXG4gKiAgLy8gR2l2ZW46XG4gKiAgLy8gVVJMOiBodHRwOi8vc2VydmVyLmNvbS9pbmRleC5odG1sIy9DaGFwdGVyLzEvU2VjdGlvbi8yP3NlYXJjaD1tb2J5XG4gKiAgLy8gUm91dGU6IC9DaGFwdGVyLzpjaGFwdGVySWQvU2VjdGlvbi86c2VjdGlvbklkXG4gKiAgLy9cbiAqICAvLyBUaGVuXG4gKiAgJHJvdXRlUGFyYW1zID09PiB7Y2hhcHRlcklkOicxJywgc2VjdGlvbklkOicyJywgc2VhcmNoOidtb2J5J31cbiAqIGBgYFxuICovXG5mdW5jdGlvbiAkUm91dGVQYXJhbXNQcm92aWRlcigpIHtcbiAgdGhpcy4kZ2V0ID0gZnVuY3Rpb24oKSB7IHJldHVybiB7fTsgfTtcbn1cblxubmdSb3V0ZU1vZHVsZS5kaXJlY3RpdmUoJ25nVmlldycsIG5nVmlld0ZhY3RvcnkpO1xubmdSb3V0ZU1vZHVsZS5kaXJlY3RpdmUoJ25nVmlldycsIG5nVmlld0ZpbGxDb250ZW50RmFjdG9yeSk7XG5cblxuLyoqXG4gKiBAbmdkb2MgZGlyZWN0aXZlXG4gKiBAbmFtZSBuZ1ZpZXdcbiAqIEByZXN0cmljdCBFQ0FcbiAqXG4gKiBAZGVzY3JpcHRpb25cbiAqICMgT3ZlcnZpZXdcbiAqIGBuZ1ZpZXdgIGlzIGEgZGlyZWN0aXZlIHRoYXQgY29tcGxlbWVudHMgdGhlIHtAbGluayBuZ1JvdXRlLiRyb3V0ZSAkcm91dGV9IHNlcnZpY2UgYnlcbiAqIGluY2x1ZGluZyB0aGUgcmVuZGVyZWQgdGVtcGxhdGUgb2YgdGhlIGN1cnJlbnQgcm91dGUgaW50byB0aGUgbWFpbiBsYXlvdXQgKGBpbmRleC5odG1sYCkgZmlsZS5cbiAqIEV2ZXJ5IHRpbWUgdGhlIGN1cnJlbnQgcm91dGUgY2hhbmdlcywgdGhlIGluY2x1ZGVkIHZpZXcgY2hhbmdlcyB3aXRoIGl0IGFjY29yZGluZyB0byB0aGVcbiAqIGNvbmZpZ3VyYXRpb24gb2YgdGhlIGAkcm91dGVgIHNlcnZpY2UuXG4gKlxuICogUmVxdWlyZXMgdGhlIHtAbGluayBuZ1JvdXRlIGBuZ1JvdXRlYH0gbW9kdWxlIHRvIGJlIGluc3RhbGxlZC5cbiAqXG4gKiBAYW5pbWF0aW9uc1xuICogZW50ZXIgLSBhbmltYXRpb24gaXMgdXNlZCB0byBicmluZyBuZXcgY29udGVudCBpbnRvIHRoZSBicm93c2VyLlxuICogbGVhdmUgLSBhbmltYXRpb24gaXMgdXNlZCB0byBhbmltYXRlIGV4aXN0aW5nIGNvbnRlbnQgYXdheS5cbiAqXG4gKiBUaGUgZW50ZXIgYW5kIGxlYXZlIGFuaW1hdGlvbiBvY2N1ciBjb25jdXJyZW50bHkuXG4gKlxuICogQHNjb3BlXG4gKiBAcHJpb3JpdHkgNDAwXG4gKiBAcGFyYW0ge3N0cmluZz19IG9ubG9hZCBFeHByZXNzaW9uIHRvIGV2YWx1YXRlIHdoZW5ldmVyIHRoZSB2aWV3IHVwZGF0ZXMuXG4gKlxuICogQHBhcmFtIHtzdHJpbmc9fSBhdXRvc2Nyb2xsIFdoZXRoZXIgYG5nVmlld2Agc2hvdWxkIGNhbGwge0BsaW5rIG5nLiRhbmNob3JTY3JvbGxcbiAqICAgICAgICAgICAgICAgICAgJGFuY2hvclNjcm9sbH0gdG8gc2Nyb2xsIHRoZSB2aWV3cG9ydCBhZnRlciB0aGUgdmlldyBpcyB1cGRhdGVkLlxuICpcbiAqICAgICAgICAgICAgICAgICAgLSBJZiB0aGUgYXR0cmlidXRlIGlzIG5vdCBzZXQsIGRpc2FibGUgc2Nyb2xsaW5nLlxuICogICAgICAgICAgICAgICAgICAtIElmIHRoZSBhdHRyaWJ1dGUgaXMgc2V0IHdpdGhvdXQgdmFsdWUsIGVuYWJsZSBzY3JvbGxpbmcuXG4gKiAgICAgICAgICAgICAgICAgIC0gT3RoZXJ3aXNlIGVuYWJsZSBzY3JvbGxpbmcgb25seSBpZiB0aGUgYGF1dG9zY3JvbGxgIGF0dHJpYnV0ZSB2YWx1ZSBldmFsdWF0ZWRcbiAqICAgICAgICAgICAgICAgICAgICBhcyBhbiBleHByZXNzaW9uIHlpZWxkcyBhIHRydXRoeSB2YWx1ZS5cbiAqIEBleGFtcGxlXG4gICAgPGV4YW1wbGUgbmFtZT1cIm5nVmlldy1kaXJlY3RpdmVcIiBtb2R1bGU9XCJuZ1ZpZXdFeGFtcGxlXCJcbiAgICAgICAgICAgICBkZXBzPVwiYW5ndWxhci1yb3V0ZS5qczthbmd1bGFyLWFuaW1hdGUuanNcIlxuICAgICAgICAgICAgIGFuaW1hdGlvbnM9XCJ0cnVlXCIgZml4QmFzZT1cInRydWVcIj5cbiAgICAgIDxmaWxlIG5hbWU9XCJpbmRleC5odG1sXCI+XG4gICAgICAgIDxkaXYgbmctY29udHJvbGxlcj1cIk1haW5DdHJsIGFzIG1haW5cIj5cbiAgICAgICAgICBDaG9vc2U6XG4gICAgICAgICAgPGEgaHJlZj1cIkJvb2svTW9ieVwiPk1vYnk8L2E+IHxcbiAgICAgICAgICA8YSBocmVmPVwiQm9vay9Nb2J5L2NoLzFcIj5Nb2J5OiBDaDE8L2E+IHxcbiAgICAgICAgICA8YSBocmVmPVwiQm9vay9HYXRzYnlcIj5HYXRzYnk8L2E+IHxcbiAgICAgICAgICA8YSBocmVmPVwiQm9vay9HYXRzYnkvY2gvND9rZXk9dmFsdWVcIj5HYXRzYnk6IENoNDwvYT4gfFxuICAgICAgICAgIDxhIGhyZWY9XCJCb29rL1NjYXJsZXRcIj5TY2FybGV0IExldHRlcjwvYT48YnIvPlxuXG4gICAgICAgICAgPGRpdiBjbGFzcz1cInZpZXctYW5pbWF0ZS1jb250YWluZXJcIj5cbiAgICAgICAgICAgIDxkaXYgbmctdmlldyBjbGFzcz1cInZpZXctYW5pbWF0ZVwiPjwvZGl2PlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDxociAvPlxuXG4gICAgICAgICAgPHByZT4kbG9jYXRpb24ucGF0aCgpID0ge3ttYWluLiRsb2NhdGlvbi5wYXRoKCl9fTwvcHJlPlxuICAgICAgICAgIDxwcmU+JHJvdXRlLmN1cnJlbnQudGVtcGxhdGVVcmwgPSB7e21haW4uJHJvdXRlLmN1cnJlbnQudGVtcGxhdGVVcmx9fTwvcHJlPlxuICAgICAgICAgIDxwcmU+JHJvdXRlLmN1cnJlbnQucGFyYW1zID0ge3ttYWluLiRyb3V0ZS5jdXJyZW50LnBhcmFtc319PC9wcmU+XG4gICAgICAgICAgPHByZT4kcm91dGUuY3VycmVudC5zY29wZS5uYW1lID0ge3ttYWluLiRyb3V0ZS5jdXJyZW50LnNjb3BlLm5hbWV9fTwvcHJlPlxuICAgICAgICAgIDxwcmU+JHJvdXRlUGFyYW1zID0ge3ttYWluLiRyb3V0ZVBhcmFtc319PC9wcmU+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9maWxlPlxuXG4gICAgICA8ZmlsZSBuYW1lPVwiYm9vay5odG1sXCI+XG4gICAgICAgIDxkaXY+XG4gICAgICAgICAgY29udHJvbGxlcjoge3tib29rLm5hbWV9fTxiciAvPlxuICAgICAgICAgIEJvb2sgSWQ6IHt7Ym9vay5wYXJhbXMuYm9va0lkfX08YnIgLz5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2ZpbGU+XG5cbiAgICAgIDxmaWxlIG5hbWU9XCJjaGFwdGVyLmh0bWxcIj5cbiAgICAgICAgPGRpdj5cbiAgICAgICAgICBjb250cm9sbGVyOiB7e2NoYXB0ZXIubmFtZX19PGJyIC8+XG4gICAgICAgICAgQm9vayBJZDoge3tjaGFwdGVyLnBhcmFtcy5ib29rSWR9fTxiciAvPlxuICAgICAgICAgIENoYXB0ZXIgSWQ6IHt7Y2hhcHRlci5wYXJhbXMuY2hhcHRlcklkfX1cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2ZpbGU+XG5cbiAgICAgIDxmaWxlIG5hbWU9XCJhbmltYXRpb25zLmNzc1wiPlxuICAgICAgICAudmlldy1hbmltYXRlLWNvbnRhaW5lciB7XG4gICAgICAgICAgcG9zaXRpb246cmVsYXRpdmU7XG4gICAgICAgICAgaGVpZ2h0OjEwMHB4IWltcG9ydGFudDtcbiAgICAgICAgICBwb3NpdGlvbjpyZWxhdGl2ZTtcbiAgICAgICAgICBiYWNrZ3JvdW5kOndoaXRlO1xuICAgICAgICAgIGJvcmRlcjoxcHggc29saWQgYmxhY2s7XG4gICAgICAgICAgaGVpZ2h0OjQwcHg7XG4gICAgICAgICAgb3ZlcmZsb3c6aGlkZGVuO1xuICAgICAgICB9XG5cbiAgICAgICAgLnZpZXctYW5pbWF0ZSB7XG4gICAgICAgICAgcGFkZGluZzoxMHB4O1xuICAgICAgICB9XG5cbiAgICAgICAgLnZpZXctYW5pbWF0ZS5uZy1lbnRlciwgLnZpZXctYW5pbWF0ZS5uZy1sZWF2ZSB7XG4gICAgICAgICAgLXdlYmtpdC10cmFuc2l0aW9uOmFsbCBjdWJpYy1iZXppZXIoMC4yNTAsIDAuNDYwLCAwLjQ1MCwgMC45NDApIDEuNXM7XG4gICAgICAgICAgdHJhbnNpdGlvbjphbGwgY3ViaWMtYmV6aWVyKDAuMjUwLCAwLjQ2MCwgMC40NTAsIDAuOTQwKSAxLjVzO1xuXG4gICAgICAgICAgZGlzcGxheTpibG9jaztcbiAgICAgICAgICB3aWR0aDoxMDAlO1xuICAgICAgICAgIGJvcmRlci1sZWZ0OjFweCBzb2xpZCBibGFjaztcblxuICAgICAgICAgIHBvc2l0aW9uOmFic29sdXRlO1xuICAgICAgICAgIHRvcDowO1xuICAgICAgICAgIGxlZnQ6MDtcbiAgICAgICAgICByaWdodDowO1xuICAgICAgICAgIGJvdHRvbTowO1xuICAgICAgICAgIHBhZGRpbmc6MTBweDtcbiAgICAgICAgfVxuXG4gICAgICAgIC52aWV3LWFuaW1hdGUubmctZW50ZXIge1xuICAgICAgICAgIGxlZnQ6MTAwJTtcbiAgICAgICAgfVxuICAgICAgICAudmlldy1hbmltYXRlLm5nLWVudGVyLm5nLWVudGVyLWFjdGl2ZSB7XG4gICAgICAgICAgbGVmdDowO1xuICAgICAgICB9XG4gICAgICAgIC52aWV3LWFuaW1hdGUubmctbGVhdmUubmctbGVhdmUtYWN0aXZlIHtcbiAgICAgICAgICBsZWZ0Oi0xMDAlO1xuICAgICAgICB9XG4gICAgICA8L2ZpbGU+XG5cbiAgICAgIDxmaWxlIG5hbWU9XCJzY3JpcHQuanNcIj5cbiAgICAgICAgYW5ndWxhci5tb2R1bGUoJ25nVmlld0V4YW1wbGUnLCBbJ25nUm91dGUnLCAnbmdBbmltYXRlJ10pXG4gICAgICAgICAgLmNvbmZpZyhbJyRyb3V0ZVByb3ZpZGVyJywgJyRsb2NhdGlvblByb3ZpZGVyJyxcbiAgICAgICAgICAgIGZ1bmN0aW9uKCRyb3V0ZVByb3ZpZGVyLCAkbG9jYXRpb25Qcm92aWRlcikge1xuICAgICAgICAgICAgICAkcm91dGVQcm92aWRlclxuICAgICAgICAgICAgICAgIC53aGVuKCcvQm9vay86Ym9va0lkJywge1xuICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdib29rLmh0bWwnLFxuICAgICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ0Jvb2tDdHJsJyxcbiAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXJBczogJ2Jvb2snXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAud2hlbignL0Jvb2svOmJvb2tJZC9jaC86Y2hhcHRlcklkJywge1xuICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdjaGFwdGVyLmh0bWwnLFxuICAgICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ0NoYXB0ZXJDdHJsJyxcbiAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXJBczogJ2NoYXB0ZXInXG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgLy8gY29uZmlndXJlIGh0bWw1IHRvIGdldCBsaW5rcyB3b3JraW5nIG9uIGpzZmlkZGxlXG4gICAgICAgICAgICAgICRsb2NhdGlvblByb3ZpZGVyLmh0bWw1TW9kZSh0cnVlKTtcbiAgICAgICAgICB9XSlcbiAgICAgICAgICAuY29udHJvbGxlcignTWFpbkN0cmwnLCBbJyRyb3V0ZScsICckcm91dGVQYXJhbXMnLCAnJGxvY2F0aW9uJyxcbiAgICAgICAgICAgIGZ1bmN0aW9uKCRyb3V0ZSwgJHJvdXRlUGFyYW1zLCAkbG9jYXRpb24pIHtcbiAgICAgICAgICAgICAgdGhpcy4kcm91dGUgPSAkcm91dGU7XG4gICAgICAgICAgICAgIHRoaXMuJGxvY2F0aW9uID0gJGxvY2F0aW9uO1xuICAgICAgICAgICAgICB0aGlzLiRyb3V0ZVBhcmFtcyA9ICRyb3V0ZVBhcmFtcztcbiAgICAgICAgICB9XSlcbiAgICAgICAgICAuY29udHJvbGxlcignQm9va0N0cmwnLCBbJyRyb3V0ZVBhcmFtcycsIGZ1bmN0aW9uKCRyb3V0ZVBhcmFtcykge1xuICAgICAgICAgICAgdGhpcy5uYW1lID0gXCJCb29rQ3RybFwiO1xuICAgICAgICAgICAgdGhpcy5wYXJhbXMgPSAkcm91dGVQYXJhbXM7XG4gICAgICAgICAgfV0pXG4gICAgICAgICAgLmNvbnRyb2xsZXIoJ0NoYXB0ZXJDdHJsJywgWyckcm91dGVQYXJhbXMnLCBmdW5jdGlvbigkcm91dGVQYXJhbXMpIHtcbiAgICAgICAgICAgIHRoaXMubmFtZSA9IFwiQ2hhcHRlckN0cmxcIjtcbiAgICAgICAgICAgIHRoaXMucGFyYW1zID0gJHJvdXRlUGFyYW1zO1xuICAgICAgICAgIH1dKTtcblxuICAgICAgPC9maWxlPlxuXG4gICAgICA8ZmlsZSBuYW1lPVwicHJvdHJhY3Rvci5qc1wiIHR5cGU9XCJwcm90cmFjdG9yXCI+XG4gICAgICAgIGl0KCdzaG91bGQgbG9hZCBhbmQgY29tcGlsZSBjb3JyZWN0IHRlbXBsYXRlJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgZWxlbWVudChieS5saW5rVGV4dCgnTW9ieTogQ2gxJykpLmNsaWNrKCk7XG4gICAgICAgICAgdmFyIGNvbnRlbnQgPSBlbGVtZW50KGJ5LmNzcygnW25nLXZpZXddJykpLmdldFRleHQoKTtcbiAgICAgICAgICBleHBlY3QoY29udGVudCkudG9NYXRjaCgvY29udHJvbGxlclxcOiBDaGFwdGVyQ3RybC8pO1xuICAgICAgICAgIGV4cGVjdChjb250ZW50KS50b01hdGNoKC9Cb29rIElkXFw6IE1vYnkvKTtcbiAgICAgICAgICBleHBlY3QoY29udGVudCkudG9NYXRjaCgvQ2hhcHRlciBJZFxcOiAxLyk7XG5cbiAgICAgICAgICBlbGVtZW50KGJ5LnBhcnRpYWxMaW5rVGV4dCgnU2NhcmxldCcpKS5jbGljaygpO1xuXG4gICAgICAgICAgY29udGVudCA9IGVsZW1lbnQoYnkuY3NzKCdbbmctdmlld10nKSkuZ2V0VGV4dCgpO1xuICAgICAgICAgIGV4cGVjdChjb250ZW50KS50b01hdGNoKC9jb250cm9sbGVyXFw6IEJvb2tDdHJsLyk7XG4gICAgICAgICAgZXhwZWN0KGNvbnRlbnQpLnRvTWF0Y2goL0Jvb2sgSWRcXDogU2NhcmxldC8pO1xuICAgICAgICB9KTtcbiAgICAgIDwvZmlsZT5cbiAgICA8L2V4YW1wbGU+XG4gKi9cblxuXG4vKipcbiAqIEBuZ2RvYyBldmVudFxuICogQG5hbWUgbmdWaWV3IyR2aWV3Q29udGVudExvYWRlZFxuICogQGV2ZW50VHlwZSBlbWl0IG9uIHRoZSBjdXJyZW50IG5nVmlldyBzY29wZVxuICogQGRlc2NyaXB0aW9uXG4gKiBFbWl0dGVkIGV2ZXJ5IHRpbWUgdGhlIG5nVmlldyBjb250ZW50IGlzIHJlbG9hZGVkLlxuICovXG5uZ1ZpZXdGYWN0b3J5LiRpbmplY3QgPSBbJyRyb3V0ZScsICckYW5jaG9yU2Nyb2xsJywgJyRhbmltYXRlJ107XG5mdW5jdGlvbiBuZ1ZpZXdGYWN0b3J5KCAgICRyb3V0ZSwgICAkYW5jaG9yU2Nyb2xsLCAgICRhbmltYXRlKSB7XG4gIHJldHVybiB7XG4gICAgcmVzdHJpY3Q6ICdFQ0EnLFxuICAgIHRlcm1pbmFsOiB0cnVlLFxuICAgIHByaW9yaXR5OiA0MDAsXG4gICAgdHJhbnNjbHVkZTogJ2VsZW1lbnQnLFxuICAgIGxpbms6IGZ1bmN0aW9uKHNjb3BlLCAkZWxlbWVudCwgYXR0ciwgY3RybCwgJHRyYW5zY2x1ZGUpIHtcbiAgICAgICAgdmFyIGN1cnJlbnRTY29wZSxcbiAgICAgICAgICAgIGN1cnJlbnRFbGVtZW50LFxuICAgICAgICAgICAgcHJldmlvdXNFbGVtZW50LFxuICAgICAgICAgICAgYXV0b1Njcm9sbEV4cCA9IGF0dHIuYXV0b3Njcm9sbCxcbiAgICAgICAgICAgIG9ubG9hZEV4cCA9IGF0dHIub25sb2FkIHx8ICcnO1xuXG4gICAgICAgIHNjb3BlLiRvbignJHJvdXRlQ2hhbmdlU3VjY2VzcycsIHVwZGF0ZSk7XG4gICAgICAgIHVwZGF0ZSgpO1xuXG4gICAgICAgIGZ1bmN0aW9uIGNsZWFudXBMYXN0VmlldygpIHtcbiAgICAgICAgICBpZihwcmV2aW91c0VsZW1lbnQpIHtcbiAgICAgICAgICAgIHByZXZpb3VzRWxlbWVudC5yZW1vdmUoKTtcbiAgICAgICAgICAgIHByZXZpb3VzRWxlbWVudCA9IG51bGw7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmKGN1cnJlbnRTY29wZSkge1xuICAgICAgICAgICAgY3VycmVudFNjb3BlLiRkZXN0cm95KCk7XG4gICAgICAgICAgICBjdXJyZW50U2NvcGUgPSBudWxsO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZihjdXJyZW50RWxlbWVudCkge1xuICAgICAgICAgICAgJGFuaW1hdGUubGVhdmUoY3VycmVudEVsZW1lbnQsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICBwcmV2aW91c0VsZW1lbnQgPSBudWxsO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBwcmV2aW91c0VsZW1lbnQgPSBjdXJyZW50RWxlbWVudDtcbiAgICAgICAgICAgIGN1cnJlbnRFbGVtZW50ID0gbnVsbDtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiB1cGRhdGUoKSB7XG4gICAgICAgICAgdmFyIGxvY2FscyA9ICRyb3V0ZS5jdXJyZW50ICYmICRyb3V0ZS5jdXJyZW50LmxvY2FscyxcbiAgICAgICAgICAgICAgdGVtcGxhdGUgPSBsb2NhbHMgJiYgbG9jYWxzLiR0ZW1wbGF0ZTtcblxuICAgICAgICAgIGlmIChhbmd1bGFyLmlzRGVmaW5lZCh0ZW1wbGF0ZSkpIHtcbiAgICAgICAgICAgIHZhciBuZXdTY29wZSA9IHNjb3BlLiRuZXcoKTtcbiAgICAgICAgICAgIHZhciBjdXJyZW50ID0gJHJvdXRlLmN1cnJlbnQ7XG5cbiAgICAgICAgICAgIC8vIE5vdGU6IFRoaXMgd2lsbCBhbHNvIGxpbmsgYWxsIGNoaWxkcmVuIG9mIG5nLXZpZXcgdGhhdCB3ZXJlIGNvbnRhaW5lZCBpbiB0aGUgb3JpZ2luYWxcbiAgICAgICAgICAgIC8vIGh0bWwuIElmIHRoYXQgY29udGVudCBjb250YWlucyBjb250cm9sbGVycywgLi4uIHRoZXkgY291bGQgcG9sbHV0ZS9jaGFuZ2UgdGhlIHNjb3BlLlxuICAgICAgICAgICAgLy8gSG93ZXZlciwgdXNpbmcgbmctdmlldyBvbiBhbiBlbGVtZW50IHdpdGggYWRkaXRpb25hbCBjb250ZW50IGRvZXMgbm90IG1ha2Ugc2Vuc2UuLi5cbiAgICAgICAgICAgIC8vIE5vdGU6IFdlIGNhbid0IHJlbW92ZSB0aGVtIGluIHRoZSBjbG9uZUF0dGNoRm4gb2YgJHRyYW5zY2x1ZGUgYXMgdGhhdFxuICAgICAgICAgICAgLy8gZnVuY3Rpb24gaXMgY2FsbGVkIGJlZm9yZSBsaW5raW5nIHRoZSBjb250ZW50LCB3aGljaCB3b3VsZCBhcHBseSBjaGlsZFxuICAgICAgICAgICAgLy8gZGlyZWN0aXZlcyB0byBub24gZXhpc3RpbmcgZWxlbWVudHMuXG4gICAgICAgICAgICB2YXIgY2xvbmUgPSAkdHJhbnNjbHVkZShuZXdTY29wZSwgZnVuY3Rpb24oY2xvbmUpIHtcbiAgICAgICAgICAgICAgJGFuaW1hdGUuZW50ZXIoY2xvbmUsIG51bGwsIGN1cnJlbnRFbGVtZW50IHx8ICRlbGVtZW50LCBmdW5jdGlvbiBvbk5nVmlld0VudGVyICgpIHtcbiAgICAgICAgICAgICAgICBpZiAoYW5ndWxhci5pc0RlZmluZWQoYXV0b1Njcm9sbEV4cClcbiAgICAgICAgICAgICAgICAgICYmICghYXV0b1Njcm9sbEV4cCB8fCBzY29wZS4kZXZhbChhdXRvU2Nyb2xsRXhwKSkpIHtcbiAgICAgICAgICAgICAgICAgICRhbmNob3JTY3JvbGwoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICBjbGVhbnVwTGFzdFZpZXcoKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBjdXJyZW50RWxlbWVudCA9IGNsb25lO1xuICAgICAgICAgICAgY3VycmVudFNjb3BlID0gY3VycmVudC5zY29wZSA9IG5ld1Njb3BlO1xuICAgICAgICAgICAgY3VycmVudFNjb3BlLiRlbWl0KCckdmlld0NvbnRlbnRMb2FkZWQnKTtcbiAgICAgICAgICAgIGN1cnJlbnRTY29wZS4kZXZhbChvbmxvYWRFeHApO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjbGVhbnVwTGFzdFZpZXcoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gIH07XG59XG5cbi8vIFRoaXMgZGlyZWN0aXZlIGlzIGNhbGxlZCBkdXJpbmcgdGhlICR0cmFuc2NsdWRlIGNhbGwgb2YgdGhlIGZpcnN0IGBuZ1ZpZXdgIGRpcmVjdGl2ZS5cbi8vIEl0IHdpbGwgcmVwbGFjZSBhbmQgY29tcGlsZSB0aGUgY29udGVudCBvZiB0aGUgZWxlbWVudCB3aXRoIHRoZSBsb2FkZWQgdGVtcGxhdGUuXG4vLyBXZSBuZWVkIHRoaXMgZGlyZWN0aXZlIHNvIHRoYXQgdGhlIGVsZW1lbnQgY29udGVudCBpcyBhbHJlYWR5IGZpbGxlZCB3aGVuXG4vLyB0aGUgbGluayBmdW5jdGlvbiBvZiBhbm90aGVyIGRpcmVjdGl2ZSBvbiB0aGUgc2FtZSBlbGVtZW50IGFzIG5nVmlld1xuLy8gaXMgY2FsbGVkLlxubmdWaWV3RmlsbENvbnRlbnRGYWN0b3J5LiRpbmplY3QgPSBbJyRjb21waWxlJywgJyRjb250cm9sbGVyJywgJyRyb3V0ZSddO1xuZnVuY3Rpb24gbmdWaWV3RmlsbENvbnRlbnRGYWN0b3J5KCRjb21waWxlLCAkY29udHJvbGxlciwgJHJvdXRlKSB7XG4gIHJldHVybiB7XG4gICAgcmVzdHJpY3Q6ICdFQ0EnLFxuICAgIHByaW9yaXR5OiAtNDAwLFxuICAgIGxpbms6IGZ1bmN0aW9uKHNjb3BlLCAkZWxlbWVudCkge1xuICAgICAgdmFyIGN1cnJlbnQgPSAkcm91dGUuY3VycmVudCxcbiAgICAgICAgICBsb2NhbHMgPSBjdXJyZW50LmxvY2FscztcblxuICAgICAgJGVsZW1lbnQuaHRtbChsb2NhbHMuJHRlbXBsYXRlKTtcblxuICAgICAgdmFyIGxpbmsgPSAkY29tcGlsZSgkZWxlbWVudC5jb250ZW50cygpKTtcblxuICAgICAgaWYgKGN1cnJlbnQuY29udHJvbGxlcikge1xuICAgICAgICBsb2NhbHMuJHNjb3BlID0gc2NvcGU7XG4gICAgICAgIHZhciBjb250cm9sbGVyID0gJGNvbnRyb2xsZXIoY3VycmVudC5jb250cm9sbGVyLCBsb2NhbHMpO1xuICAgICAgICBpZiAoY3VycmVudC5jb250cm9sbGVyQXMpIHtcbiAgICAgICAgICBzY29wZVtjdXJyZW50LmNvbnRyb2xsZXJBc10gPSBjb250cm9sbGVyO1xuICAgICAgICB9XG4gICAgICAgICRlbGVtZW50LmRhdGEoJyRuZ0NvbnRyb2xsZXJDb250cm9sbGVyJywgY29udHJvbGxlcik7XG4gICAgICAgICRlbGVtZW50LmNoaWxkcmVuKCkuZGF0YSgnJG5nQ29udHJvbGxlckNvbnRyb2xsZXInLCBjb250cm9sbGVyKTtcbiAgICAgIH1cblxuICAgICAgbGluayhzY29wZSk7XG4gICAgfVxuICB9O1xufVxuXG5cbn0pKHdpbmRvdywgd2luZG93LmFuZ3VsYXIpO1xuIiwiIWZ1bmN0aW9uIGEoYixjLGQpe2Z1bmN0aW9uIGUoZyxoKXtpZighY1tnXSl7aWYoIWJbZ10pe3ZhciBpPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWgmJmkpcmV0dXJuIGkoZywhMCk7aWYoZilyZXR1cm4gZihnLCEwKTt0aHJvdyBuZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2crXCInXCIpfXZhciBqPWNbZ109e2V4cG9ydHM6e319O2JbZ11bMF0uY2FsbChqLmV4cG9ydHMsZnVuY3Rpb24oYSl7dmFyIGM9YltnXVsxXVthXTtyZXR1cm4gZShjP2M6YSl9LGosai5leHBvcnRzLGEsYixjLGQpfXJldHVybiBjW2ddLmV4cG9ydHN9Zm9yKHZhciBmPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsZz0wO2c8ZC5sZW5ndGg7ZysrKWUoZFtnXSk7cmV0dXJuIGV9KHsxOltmdW5jdGlvbihhLGIpe2IuZXhwb3J0cz17b2F1dGhkX3VybDpcImh0dHBzOi8vb2F1dGguaW9cIixvYXV0aGRfYXBpOlwiaHR0cHM6Ly9vYXV0aC5pby9hcGlcIix2ZXJzaW9uOlwid2ViLTAuMi4yXCIsb3B0aW9uczp7fX19LHt9XSwyOltmdW5jdGlvbihhLGIpe1widXNlIHN0cmljdFwiO3ZhciBjLGQsZSxmLGc7ZT1hKFwiLi4vY29uZmlnXCIpLGY9YShcIi4uL3Rvb2xzL2Nvb2tpZXNcIiksZD1hKFwiLi4vdG9vbHMvY2FjaGVcIiksYz1hKFwiLi4vdG9vbHMvdXJsXCIpLGc9YShcIi4uL3Rvb2xzL3NoYTFcIiksYi5leHBvcnRzPWZ1bmN0aW9uKGIsaCxpLGope3ZhciBrLGwsbSxuLG8scCxxLHI7cmV0dXJuIGs9aSxjPWMoaCksZi5pbml0KGUsaCksZC5pbml0KGYsZSksbj17cmVxdWVzdDp7fX0scj17fSxxPXt9LHA9e2V4ZWNQcm92aWRlcnNDYjpmdW5jdGlvbihhLGIsYyl7dmFyIGQsZTtpZihxW2FdKXtkPXFbYV0sZGVsZXRlIHFbYV07Zm9yKGUgaW4gZClkW2VdKGIsYyl9fSxnZXREZXNjcmlwdGlvbjpmdW5jdGlvbihhLGIsYyl7cmV0dXJuIGI9Ynx8e30sXCJvYmplY3RcIj09dHlwZW9mIHJbYV0/YyhudWxsLHJbYV0pOihyW2FdfHxwLmZldGNoRGVzY3JpcHRpb24oYSksYi53YWl0PyhxW2FdPXFbYV18fFtdLHZvaWQgcVthXS5wdXNoKGMpKTpjKG51bGwse30pKX19LGUub2F1dGhkX2Jhc2U9Yy5nZXRBYnNVcmwoZS5vYXV0aGRfdXJsKS5tYXRjaCgvXi57Miw1fTpcXC9cXC9bXi9dKy8pWzBdLGw9W10sbT12b2lkIDAsKG89ZnVuY3Rpb24oKXt2YXIgYSxiO2I9L1tcXFxcIyZdb2F1dGhpbz0oW14mXSopLy5leGVjKGgubG9jYXRpb24uaGFzaCksYiYmKGgubG9jYXRpb24uaGFzaD1oLmxvY2F0aW9uLmhhc2gucmVwbGFjZSgvJj9vYXV0aGlvPVteJl0qLyxcIlwiKSxtPWRlY29kZVVSSUNvbXBvbmVudChiWzFdLnJlcGxhY2UoL1xcKy9nLFwiIFwiKSksYT1mLnJlYWRDb29raWUoXCJvYXV0aGlvX3N0YXRlXCIpLGEmJihsLnB1c2goYSksZi5lcmFzZUNvb2tpZShcIm9hdXRoaW9fc3RhdGVcIikpKX0pKCksYi5sb2NhdGlvbl9vcGVyYXRpb25zPXtyZWxvYWQ6ZnVuY3Rpb24oKXtyZXR1cm4gaC5sb2NhdGlvbi5yZWxvYWQoKX0sZ2V0SGFzaDpmdW5jdGlvbigpe3JldHVybiBoLmxvY2F0aW9uLmhhc2h9LHNldEhhc2g6ZnVuY3Rpb24oYSl7cmV0dXJuIGgubG9jYXRpb24uaGFzaD1hfSxjaGFuZ2VIcmVmOmZ1bmN0aW9uKGEpe3JldHVybiBoLmxvY2F0aW9uLmhyZWY9YX19LGZ1bmN0aW9uKGkpe3ZhciBrLG8scSxzO2s9ZnVuY3Rpb24oYil7bi5yZXF1ZXN0PWEoXCIuL29hdXRoaW9fcmVxdWVzdHNcIikoYixlLGwsZCxwKSxwLmZldGNoRGVzY3JpcHRpb249ZnVuY3Rpb24oYSl7clthXXx8KHJbYV09ITAsYi5hamF4KHt1cmw6ZS5vYXV0aGRfYXBpK1wiL3Byb3ZpZGVycy9cIithLGRhdGE6e2V4dGVuZDohMH0sZGF0YVR5cGU6XCJqc29uXCJ9KS5kb25lKGZ1bmN0aW9uKGIpe3JbYV09Yi5kYXRhLHAuZXhlY1Byb3ZpZGVyc0NiKGEsbnVsbCxiLmRhdGEpfSkuYWx3YXlzKGZ1bmN0aW9uKCl7XCJvYmplY3RcIiE9dHlwZW9mIHJbYV0mJihkZWxldGUgclthXSxwLmV4ZWNQcm92aWRlcnNDYihhLG5ldyBFcnJvcihcIlVuYWJsZSB0byBmZXRjaCByZXF1ZXN0IGRlc2NyaXB0aW9uXCIpKSl9KSl9fSxudWxsPT1pLk9BdXRoJiYoaS5PQXV0aD17aW5pdGlhbGl6ZTpmdW5jdGlvbihhLGIpe3ZhciBjO2lmKGUua2V5PWEsYilmb3IoYyBpbiBiKWUub3B0aW9uc1tjXT1iW2NdfSxzZXRPQXV0aGRVUkw6ZnVuY3Rpb24oYSl7ZS5vYXV0aGRfdXJsPWEsZS5vYXV0aGRfYmFzZT1jLmdldEFic1VybChlLm9hdXRoZF91cmwpLm1hdGNoKC9eLnsyLDV9OlxcL1xcL1teL10rLylbMF19LGdldFZlcnNpb246ZnVuY3Rpb24oKXtyZXR1cm4gZS52ZXJzaW9ufSxjcmVhdGU6ZnVuY3Rpb24oYSxiLGMpe3ZhciBlLGYsZyxoO2lmKCFiKXJldHVybiBkLnRyeUNhY2hlKGkuT0F1dGgsYSwhMCk7XCJvYmplY3RcIiE9dHlwZW9mIGMmJnAuZmV0Y2hEZXNjcmlwdGlvbihhKSxmPWZ1bmN0aW9uKGQpe3JldHVybiBuLnJlcXVlc3QubWtIdHRwKGEsYixjLGQpfSxnPWZ1bmN0aW9uKGQsZSl7cmV0dXJuIG4ucmVxdWVzdC5ta0h0dHBFbmRwb2ludChhLGIsYyxkLGUpfSxoPXt9O2ZvcihlIGluIGIpaFtlXT1iW2VdO3JldHVybiBoLmdldD1mKFwiR0VUXCIpLGgucG9zdD1mKFwiUE9TVFwiKSxoLnB1dD1mKFwiUFVUXCIpLGgucGF0Y2g9ZihcIlBBVENIXCIpLGguZGVsPWYoXCJERUxFVEVcIiksaC5tZT1uLnJlcXVlc3QubWtIdHRwTWUoYSxiLGMsXCJHRVRcIiksaH0scG9wdXA6ZnVuY3Rpb24oYSxmLGspe3ZhciBtLG8scCxxLHIscyx0LHUsdix3O3JldHVybiBwPWZ1bmN0aW9uKGEpe2lmKGEub3JpZ2luPT09ZS5vYXV0aGRfYmFzZSl7dHJ5e3MuY2xvc2UoKX1jYXRjaChiKXt9cmV0dXJuIGYuZGF0YT1hLmRhdGEsbi5yZXF1ZXN0LnNlbmRDYWxsYmFjayhmLG0pfX0scz12b2lkIDAsbz12b2lkIDAsdD12b2lkIDAsbT1udWxsIT0odz1iLmpRdWVyeSk/dy5EZWZlcnJlZCgpOnZvaWQgMCxmPWZ8fHt9LGUua2V5PygyPT09YXJndW1lbnRzLmxlbmd0aCYmXCJmdW5jdGlvblwiPT10eXBlb2YgZiYmKGs9ZixmPXt9KSxkLmNhY2hlRW5hYmxlZChmLmNhY2hlKSYmKHE9ZC50cnlDYWNoZShpLk9BdXRoLGEsZi5jYWNoZSkpPyhudWxsIT1tJiZtLnJlc29sdmUocSksaz9rKG51bGwscSk6bS5wcm9taXNlKCkpOihmLnN0YXRlfHwoZi5zdGF0ZT1nLmNyZWF0ZV9oYXNoKCksZi5zdGF0ZV90eXBlPVwiY2xpZW50XCIpLGwucHVzaChmLnN0YXRlKSxyPWUub2F1dGhkX3VybCtcIi9hdXRoL1wiK2ErXCI/az1cIitlLmtleSxyKz1cIiZkPVwiK2VuY29kZVVSSUNvbXBvbmVudChjLmdldEFic1VybChcIi9cIikpLGYmJihyKz1cIiZvcHRzPVwiK2VuY29kZVVSSUNvbXBvbmVudChKU09OLnN0cmluZ2lmeShmKSkpLGYud25kX3NldHRpbmdzPyh2PWYud25kX3NldHRpbmdzLGRlbGV0ZSBmLnduZF9zZXR0aW5ncyk6dj17d2lkdGg6TWF0aC5mbG9vciguOCpiLm91dGVyV2lkdGgpLGhlaWdodDpNYXRoLmZsb29yKC41KmIub3V0ZXJIZWlnaHQpfSxudWxsPT12LmhlaWdodCYmKHYuaGVpZ2h0PXYuaGVpZ2h0PDM1MD8zNTA6dm9pZCAwKSxudWxsPT12LndpZHRoJiYodi53aWR0aD12LndpZHRoPDgwMD84MDA6dm9pZCAwKSxudWxsPT12LmxlZnQmJih2LmxlZnQ9Yi5zY3JlZW5YKyhiLm91dGVyV2lkdGgtdi53aWR0aCkvMiksbnVsbD09di50b3AmJih2LnRvcD1iLnNjcmVlblkrKGIub3V0ZXJIZWlnaHQtdi5oZWlnaHQpLzgpLHU9XCJ3aWR0aD1cIit2LndpZHRoK1wiLGhlaWdodD1cIit2LmhlaWdodCx1Kz1cIix0b29sYmFyPTAsc2Nyb2xsYmFycz0xLHN0YXR1cz0xLHJlc2l6YWJsZT0xLGxvY2F0aW9uPTEsbWVudUJhcj0wXCIsdSs9XCIsbGVmdD1cIit2LmxlZnQrXCIsdG9wPVwiK3YudG9wLGY9e3Byb3ZpZGVyOmEsY2FjaGU6Zi5jYWNoZX0sZi5jYWxsYmFjaz1mdW5jdGlvbihhLGMpe3JldHVybiBiLnJlbW92ZUV2ZW50TGlzdGVuZXI/Yi5yZW1vdmVFdmVudExpc3RlbmVyKFwibWVzc2FnZVwiLHAsITEpOmIuZGV0YWNoRXZlbnQ/Yi5kZXRhY2hFdmVudChcIm9ubWVzc2FnZVwiLHApOmguZGV0YWNoRXZlbnQmJmguZGV0YWNoRXZlbnQoXCJvbm1lc3NhZ2VcIixwKSxmLmNhbGxiYWNrPWZ1bmN0aW9uKCl7fSx0JiYoY2xlYXJUaW1lb3V0KHQpLHQ9dm9pZCAwKSxrP2soYSxjKTp2b2lkIDB9LGIuYXR0YWNoRXZlbnQ/Yi5hdHRhY2hFdmVudChcIm9ubWVzc2FnZVwiLHApOmguYXR0YWNoRXZlbnQ/aC5hdHRhY2hFdmVudChcIm9ubWVzc2FnZVwiLHApOmIuYWRkRXZlbnRMaXN0ZW5lciYmYi5hZGRFdmVudExpc3RlbmVyKFwibWVzc2FnZVwiLHAsITEpLFwidW5kZWZpbmVkXCIhPXR5cGVvZiBjaHJvbWUmJmNocm9tZS5ydW50aW1lJiZjaHJvbWUucnVudGltZS5vbk1lc3NhZ2VFeHRlcm5hbCYmY2hyb21lLnJ1bnRpbWUub25NZXNzYWdlRXh0ZXJuYWwuYWRkTGlzdGVuZXIoZnVuY3Rpb24oYSxiKXtyZXR1cm4gYS5vcmlnaW49Yi51cmwubWF0Y2goL14uezIsNX06XFwvXFwvW14vXSsvKVswXSxudWxsIT1tJiZtLnJlc29sdmUoKSxwKGEpfSksIW8mJigtMSE9PWoudXNlckFnZW50LmluZGV4T2YoXCJNU0lFXCIpfHxqLmFwcFZlcnNpb24uaW5kZXhPZihcIlRyaWRlbnQvXCIpPjApJiYobz1oLmNyZWF0ZUVsZW1lbnQoXCJpZnJhbWVcIiksby5zcmM9ZS5vYXV0aGRfdXJsK1wiL2F1dGgvaWZyYW1lP2Q9XCIrZW5jb2RlVVJJQ29tcG9uZW50KGMuZ2V0QWJzVXJsKFwiL1wiKSksby53aWR0aD0wLG8uaGVpZ2h0PTAsby5mcmFtZUJvcmRlcj0wLG8uc3R5bGUudmlzaWJpbGl0eT1cImhpZGRlblwiLGguYm9keS5hcHBlbmRDaGlsZChvKSksdD1zZXRUaW1lb3V0KGZ1bmN0aW9uKCl7bnVsbCE9bSYmbS5yZWplY3QobmV3IEVycm9yKFwiQXV0aG9yaXphdGlvbiB0aW1lZCBvdXRcIikpLGYuY2FsbGJhY2smJlwiZnVuY3Rpb25cIj09dHlwZW9mIGYuY2FsbGJhY2smJmYuY2FsbGJhY2sobmV3IEVycm9yKFwiQXV0aG9yaXphdGlvbiB0aW1lZCBvdXRcIikpO3RyeXtzLmNsb3NlKCl9Y2F0Y2goYSl7fX0sMTJlNSkscz1iLm9wZW4ocixcIkF1dGhvcml6YXRpb25cIix1KSxzP3MuZm9jdXMoKToobnVsbCE9bSYmbS5yZWplY3QobmV3IEVycm9yKFwiQ291bGQgbm90IG9wZW4gYSBwb3B1cFwiKSksZi5jYWxsYmFjayYmXCJmdW5jdGlvblwiPT10eXBlb2YgZi5jYWxsYmFjayYmZi5jYWxsYmFjayhuZXcgRXJyb3IoXCJDb3VsZCBub3Qgb3BlbiBhIHBvcHVwXCIpKSksbnVsbCE9bT9tLnByb21pc2UoKTp2b2lkIDApKToobnVsbCE9bSYmbS5yZWplY3QobmV3IEVycm9yKFwiT0F1dGggb2JqZWN0IG11c3QgYmUgaW5pdGlhbGl6ZWRcIikpLG51bGw9PWs/bS5wcm9taXNlKCk6ayhuZXcgRXJyb3IoXCJPQXV0aCBvYmplY3QgbXVzdCBiZSBpbml0aWFsaXplZFwiKSkpfSxyZWRpcmVjdDpmdW5jdGlvbihhLGgsail7dmFyIGssbDtyZXR1cm4gMj09PWFyZ3VtZW50cy5sZW5ndGgmJihqPWgsaD17fSksZC5jYWNoZUVuYWJsZWQoaC5jYWNoZSkmJihsPWQudHJ5Q2FjaGUoaS5PQXV0aCxhLGguY2FjaGUpKT8oaj1jLmdldEFic1VybChqKSsoLTE9PT1qLmluZGV4T2YoXCIjXCIpP1wiI1wiOlwiJlwiKStcIm9hdXRoaW89Y2FjaGVcIixiLmxvY2F0aW9uX29wZXJhdGlvbnMuY2hhbmdlSHJlZihqKSx2b2lkIGIubG9jYXRpb25fb3BlcmF0aW9ucy5yZWxvYWQoKSk6KGguc3RhdGV8fChoLnN0YXRlPWcuY3JlYXRlX2hhc2goKSxoLnN0YXRlX3R5cGU9XCJjbGllbnRcIiksZi5jcmVhdGVDb29raWUoXCJvYXV0aGlvX3N0YXRlXCIsaC5zdGF0ZSksaz1lbmNvZGVVUklDb21wb25lbnQoYy5nZXRBYnNVcmwoaikpLGo9ZS5vYXV0aGRfdXJsK1wiL2F1dGgvXCIrYStcIj9rPVwiK2Uua2V5LGorPVwiJnJlZGlyZWN0X3VyaT1cIitrLGgmJihqKz1cIiZvcHRzPVwiK2VuY29kZVVSSUNvbXBvbmVudChKU09OLnN0cmluZ2lmeShoKSkpLHZvaWQgYi5sb2NhdGlvbl9vcGVyYXRpb25zLmNoYW5nZUhyZWYoaikpfSxjYWxsYmFjazpmdW5jdGlvbihhLGMsZSl7dmFyIGYsZyxoO2lmKGY9bnVsbCE9KGg9Yi5qUXVlcnkpP2guRGVmZXJyZWQoKTp2b2lkIDAsMT09PWFyZ3VtZW50cy5sZW5ndGgmJlwiZnVuY3Rpb25cIj09dHlwZW9mIGEmJihlPWEsYT12b2lkIDAsYz17fSksMT09PWFyZ3VtZW50cy5sZW5ndGgmJlwic3RyaW5nXCI9PXR5cGVvZiBhJiYoYz17fSksMj09PWFyZ3VtZW50cy5sZW5ndGgmJlwiZnVuY3Rpb25cIj09dHlwZW9mIGMmJihlPWMsYz17fSksZC5jYWNoZUVuYWJsZWQoYy5jYWNoZSl8fFwiY2FjaGVcIj09PW0pe2lmKGc9ZC50cnlDYWNoZShpLk9BdXRoLGEsYy5jYWNoZSksXCJjYWNoZVwiPT09bSYmKFwic3RyaW5nXCIhPXR5cGVvZiBhfHwhYSkpcmV0dXJuIG51bGwhPWYmJmYucmVqZWN0KG5ldyBFcnJvcihcIllvdSBtdXN0IHNldCBhIHByb3ZpZGVyIHdoZW4gdXNpbmcgdGhlIGNhY2hlXCIpKSxlP2UobmV3IEVycm9yKFwiWW91IG11c3Qgc2V0IGEgcHJvdmlkZXIgd2hlbiB1c2luZyB0aGUgY2FjaGVcIikpOm51bGwhPWY/Zi5wcm9taXNlKCk6dm9pZCAwO2lmKGcpe2lmKCFlKXJldHVybiBudWxsIT1mJiZmLnJlc29sdmUoZyksbnVsbCE9Zj9mLnByb21pc2UoKTp2b2lkIDA7aWYoZylyZXR1cm4gZShudWxsLGcpfX1yZXR1cm4gbT8obi5yZXF1ZXN0LnNlbmRDYWxsYmFjayh7ZGF0YTptLHByb3ZpZGVyOmEsY2FjaGU6Yy5jYWNoZSxjYWxsYmFjazplfSxmKSxudWxsIT1mP2YucHJvbWlzZSgpOnZvaWQgMCk6dm9pZCAwfSxjbGVhckNhY2hlOmZ1bmN0aW9uKGEpe2YuZXJhc2VDb29raWUoXCJvYXV0aGlvX3Byb3ZpZGVyX1wiK2EpfSxodHRwX21lOmZ1bmN0aW9uKGEpe24ucmVxdWVzdC5odHRwX21lJiZuLnJlcXVlc3QuaHR0cF9tZShhKX0saHR0cDpmdW5jdGlvbihhKXtuLnJlcXVlc3QuaHR0cCYmbi5yZXF1ZXN0Lmh0dHAoYSl9fSxcInVuZGVmaW5lZFwiPT10eXBlb2YgYi5qUXVlcnk/KHM9W10sbz12b2lkIDAsXCJ1bmRlZmluZWRcIiE9dHlwZW9mIGNocm9tZSYmY2hyb21lLmV4dGVuc2lvbj9vPWZ1bmN0aW9uKCl7cmV0dXJuIGZ1bmN0aW9uKCl7dGhyb3cgbmV3IEVycm9yKFwiUGxlYXNlIGluY2x1ZGUgalF1ZXJ5IGJlZm9yZSBvYXV0aC5qc1wiKX19OihxPWguY3JlYXRlRWxlbWVudChcInNjcmlwdFwiKSxxLnNyYz1cIi8vY29kZS5qcXVlcnkuY29tL2pxdWVyeS5taW4uanNcIixxLnR5cGU9XCJ0ZXh0L2phdmFzY3JpcHRcIixxLm9ubG9hZD1mdW5jdGlvbigpe3ZhciBhO2soYi5qUXVlcnkpO2ZvcihhIGluIHMpc1thXS5mbi5hcHBseShudWxsLHNbYV0uYXJncyl9LGguZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJoZWFkXCIpWzBdLmFwcGVuZENoaWxkKHEpLG89ZnVuY3Rpb24oYSl7cmV0dXJuIGZ1bmN0aW9uKCl7dmFyIGIsYztjPVtdO2ZvcihiIGluIGFyZ3VtZW50cyljW2JdPWFyZ3VtZW50c1tiXTtzLnB1c2goe2ZuOmEsYXJnczpjfSl9fSksbi5yZXF1ZXN0Lmh0dHA9byhmdW5jdGlvbigpe24ucmVxdWVzdC5odHRwLmFwcGx5KGkuT0F1dGgsYXJndW1lbnRzKX0pLHAuZmV0Y2hEZXNjcmlwdGlvbj1vKGZ1bmN0aW9uKCl7cC5mZXRjaERlc2NyaXB0aW9uLmFwcGx5KHAsYXJndW1lbnRzKX0pLG4ucmVxdWVzdD1hKFwiLi9vYXV0aGlvX3JlcXVlc3RzXCIpKGIualF1ZXJ5LGUsbCxkLHApKTprKGIualF1ZXJ5KSl9fX0se1wiLi4vY29uZmlnXCI6MSxcIi4uL3Rvb2xzL2NhY2hlXCI6NSxcIi4uL3Rvb2xzL2Nvb2tpZXNcIjo2LFwiLi4vdG9vbHMvc2hhMVwiOjcsXCIuLi90b29scy91cmxcIjo4LFwiLi9vYXV0aGlvX3JlcXVlc3RzXCI6M31dLDM6W2Z1bmN0aW9uKGEsYil7dmFyIGMsZD1bXS5pbmRleE9mfHxmdW5jdGlvbihhKXtmb3IodmFyIGI9MCxjPXRoaXMubGVuZ3RoO2M+YjtiKyspaWYoYiBpbiB0aGlzJiZ0aGlzW2JdPT09YSlyZXR1cm4gYjtyZXR1cm4tMX07Yz1hKFwiLi4vdG9vbHMvdXJsXCIpKCksYi5leHBvcnRzPWZ1bmN0aW9uKGEsYixlLGYsZyl7cmV0dXJue2h0dHA6ZnVuY3Rpb24oZSl7dmFyIGYsaCxpLGosaztpPWZ1bmN0aW9uKCl7dmFyIGUsZixnLGg7aWYoaD1rLm9hdXRoaW8ucmVxdWVzdHx8e30sIWguY29ycyl7ay51cmw9ZW5jb2RlVVJJQ29tcG9uZW50KGsudXJsKSxcIi9cIiE9PWsudXJsWzBdJiYoay51cmw9XCIvXCIray51cmwpLGsudXJsPWIub2F1dGhkX3VybCtcIi9yZXF1ZXN0L1wiK2sub2F1dGhpby5wcm92aWRlcitrLnVybCxrLmhlYWRlcnM9ay5oZWFkZXJzfHx7fSxrLmhlYWRlcnMub2F1dGhpbz1cIms9XCIrYi5rZXksay5vYXV0aGlvLnRva2Vucy5vYXV0aF90b2tlbiYmay5vYXV0aGlvLnRva2Vucy5vYXV0aF90b2tlbl9zZWNyZXQmJihrLmhlYWRlcnMub2F1dGhpbys9XCImb2F1dGh2PTFcIik7Zm9yKGYgaW4gay5vYXV0aGlvLnRva2VucylrLmhlYWRlcnMub2F1dGhpbys9XCImXCIrZW5jb2RlVVJJQ29tcG9uZW50KGYpK1wiPVwiK2VuY29kZVVSSUNvbXBvbmVudChrLm9hdXRoaW8udG9rZW5zW2ZdKTtyZXR1cm4gZGVsZXRlIGsub2F1dGhpbyxhLmFqYXgoayl9aWYoay5vYXV0aGlvLnRva2Vucyl7aWYoay5vYXV0aGlvLnRva2Vucy5hY2Nlc3NfdG9rZW4mJihrLm9hdXRoaW8udG9rZW5zLnRva2VuPWsub2F1dGhpby50b2tlbnMuYWNjZXNzX3Rva2VuKSxrLnVybC5tYXRjaCgvXlthLXpdezIsMTZ9OlxcL1xcLy8pfHwoXCIvXCIhPT1rLnVybFswXSYmKGsudXJsPVwiL1wiK2sudXJsKSxrLnVybD1oLnVybCtrLnVybCksay51cmw9Yy5yZXBsYWNlUGFyYW0oay51cmwsay5vYXV0aGlvLnRva2VucyxoLnBhcmFtZXRlcnMpLGgucXVlcnkpe2c9W107Zm9yKGUgaW4gaC5xdWVyeSlnLnB1c2goZW5jb2RlVVJJQ29tcG9uZW50KGUpK1wiPVwiK2VuY29kZVVSSUNvbXBvbmVudChjLnJlcGxhY2VQYXJhbShoLnF1ZXJ5W2VdLGsub2F1dGhpby50b2tlbnMsaC5wYXJhbWV0ZXJzKSkpO2sudXJsKz1kLmNhbGwoay51cmwsXCI/XCIpPj0wP1wiJlwiK2c6XCI/XCIrZ31pZihoLmhlYWRlcnMpe2suaGVhZGVycz1rLmhlYWRlcnN8fHt9O2ZvcihlIGluIGguaGVhZGVycylrLmhlYWRlcnNbZV09Yy5yZXBsYWNlUGFyYW0oaC5oZWFkZXJzW2VdLGsub2F1dGhpby50b2tlbnMsaC5wYXJhbWV0ZXJzKX1yZXR1cm4gZGVsZXRlIGsub2F1dGhpbyxhLmFqYXgoayl9fSxrPXt9LGo9dm9pZCAwO2ZvcihqIGluIGUpa1tqXT1lW2pdO3JldHVybiBrLm9hdXRoaW8ucmVxdWVzdCYmay5vYXV0aGlvLnJlcXVlc3QhPT0hMD9pKCk6KGg9e3dhaXQ6ISFrLm9hdXRoaW8ucmVxdWVzdH0sZj1udWxsIT1hP2EuRGVmZXJyZWQoKTp2b2lkIDAsZy5nZXREZXNjcmlwdGlvbihrLm9hdXRoaW8ucHJvdmlkZXIsaCxmdW5jdGlvbihhLGIpe3JldHVybiBhP251bGwhPWY/Zi5yZWplY3QoYSk6dm9pZCAwOihrLm9hdXRoaW8ucmVxdWVzdD1rLm9hdXRoaW8udG9rZW5zLm9hdXRoX3Rva2VuJiZrLm9hdXRoaW8udG9rZW5zLm9hdXRoX3Rva2VuX3NlY3JldD9iLm9hdXRoMSYmYi5vYXV0aDEucmVxdWVzdDpiLm9hdXRoMiYmYi5vYXV0aDIucmVxdWVzdCx2b2lkKG51bGwhPWYmJmYucmVzb2x2ZSgpKSl9KSxudWxsIT1mP2YudGhlbihpKTp2b2lkIDApfSxodHRwX21lOmZ1bmN0aW9uKGMpe3ZhciBkLGUsZixoLGk7Zj1mdW5jdGlvbigpe3ZhciBjLGQsZSxmO2M9bnVsbCE9YT9hLkRlZmVycmVkKCk6dm9pZCAwLGY9aS5vYXV0aGlvLnJlcXVlc3R8fHt9LGkudXJsPWIub2F1dGhkX3VybCtcIi9hdXRoL1wiK2kub2F1dGhpby5wcm92aWRlcitcIi9tZVwiLGkuaGVhZGVycz1pLmhlYWRlcnN8fHt9LGkuaGVhZGVycy5vYXV0aGlvPVwiaz1cIitiLmtleSxpLm9hdXRoaW8udG9rZW5zLm9hdXRoX3Rva2VuJiZpLm9hdXRoaW8udG9rZW5zLm9hdXRoX3Rva2VuX3NlY3JldCYmKGkuaGVhZGVycy5vYXV0aGlvKz1cIiZvYXV0aHY9MVwiKTtmb3IoZCBpbiBpLm9hdXRoaW8udG9rZW5zKWkuaGVhZGVycy5vYXV0aGlvKz1cIiZcIitlbmNvZGVVUklDb21wb25lbnQoZCkrXCI9XCIrZW5jb2RlVVJJQ29tcG9uZW50KGkub2F1dGhpby50b2tlbnNbZF0pO3JldHVybiBkZWxldGUgaS5vYXV0aGlvLGU9YS5hamF4KGkpLGEud2hlbihlKS5kb25lKGZ1bmN0aW9uKGEpe251bGwhPWMmJmMucmVzb2x2ZShhLmRhdGEpfSkuZmFpbChmdW5jdGlvbihhKXthLnJlc3BvbnNlSlNPTj9udWxsIT1jJiZjLnJlamVjdChhLnJlc3BvbnNlSlNPTi5kYXRhKTpudWxsIT1jJiZjLnJlamVjdChuZXcgRXJyb3IoXCJBbiBlcnJvciBvY2N1cmVkIHdoaWxlIHRyeWluZyB0byBhY2Nlc3MgdGhlIHJlc291cmNlXCIpKX0pLG51bGwhPWM/Yy5wcm9taXNlKCk6dm9pZCAwfSxpPXt9O2ZvcihoIGluIGMpaVtoXT1jW2hdO3JldHVybiBpLm9hdXRoaW8ucmVxdWVzdCYmaS5vYXV0aGlvLnJlcXVlc3QhPT0hMD9mKCk6KGU9e3dhaXQ6ISFpLm9hdXRoaW8ucmVxdWVzdH0sZD1udWxsIT1hP2EuRGVmZXJyZWQoKTp2b2lkIDAsZy5nZXREZXNjcmlwdGlvbihpLm9hdXRoaW8ucHJvdmlkZXIsZSxmdW5jdGlvbihhLGIpe3JldHVybiBhP251bGwhPWQ/ZC5yZWplY3QoYSk6dm9pZCAwOihpLm9hdXRoaW8ucmVxdWVzdD1pLm9hdXRoaW8udG9rZW5zLm9hdXRoX3Rva2VuJiZpLm9hdXRoaW8udG9rZW5zLm9hdXRoX3Rva2VuX3NlY3JldD9iLm9hdXRoMSYmYi5vYXV0aDEucmVxdWVzdDpiLm9hdXRoMiYmYi5vYXV0aDIucmVxdWVzdCx2b2lkKG51bGwhPWQmJmQucmVzb2x2ZSgpKSl9KSxudWxsIT1kP2QudGhlbihmKTp2b2lkIDApfSxta0h0dHA6ZnVuY3Rpb24oYSxiLGMsZCl7dmFyIGU7cmV0dXJuIGU9dGhpcyxmdW5jdGlvbihmLGcpe3ZhciBoLGk7aWYoaT17fSxcInN0cmluZ1wiPT10eXBlb2YgZil7aWYoXCJvYmplY3RcIj09dHlwZW9mIGcpZm9yKGggaW4gZylpW2hdPWdbaF07aS51cmw9Zn1lbHNlIGlmKFwib2JqZWN0XCI9PXR5cGVvZiBmKWZvcihoIGluIGYpaVtoXT1mW2hdO3JldHVybiBpLnR5cGU9aS50eXBlfHxkLGkub2F1dGhpbz17cHJvdmlkZXI6YSx0b2tlbnM6YixyZXF1ZXN0OmN9LGUuaHR0cChpKX19LG1rSHR0cE1lOmZ1bmN0aW9uKGEsYixjLGQpe3ZhciBlO3JldHVybiBlPXRoaXMsZnVuY3Rpb24oZil7dmFyIGc7cmV0dXJuIGc9e30sZy50eXBlPWcudHlwZXx8ZCxnLm9hdXRoaW89e3Byb3ZpZGVyOmEsdG9rZW5zOmIscmVxdWVzdDpjfSxnLmRhdGE9Zy5kYXRhfHx7fSxnLmRhdGEuZmlsdGVyPWY/Zi5qb2luKFwiLFwiKTp2b2lkIDAsZS5odHRwX21lKGcpfX0sc2VuZENhbGxiYWNrOmZ1bmN0aW9uKGEsYil7dmFyIGMsZCxnLGgsaSxqLGssbCxtO2M9dGhpcyxkPXZvaWQgMCxoPXZvaWQgMDt0cnl7ZD1KU09OLnBhcnNlKGEuZGF0YSl9Y2F0Y2gobil7cmV0dXJuIGc9bixudWxsIT1iJiZiLnJlamVjdChuZXcgRXJyb3IoXCJFcnJvciB3aGlsZSBwYXJzaW5nIHJlc3VsdFwiKSksYS5jYWxsYmFjayhuZXcgRXJyb3IoXCJFcnJvciB3aGlsZSBwYXJzaW5nIHJlc3VsdFwiKSl9aWYoZCYmZC5wcm92aWRlcil7aWYoYS5wcm92aWRlciYmZC5wcm92aWRlci50b0xvd2VyQ2FzZSgpIT09YS5wcm92aWRlci50b0xvd2VyQ2FzZSgpKXJldHVybiBoPW5ldyBFcnJvcihcIlJldHVybmVkIHByb3ZpZGVyIG5hbWUgZG9lcyBub3QgbWF0Y2ggYXNrZWQgcHJvdmlkZXJcIiksbnVsbCE9YiYmYi5yZWplY3QoaCksYS5jYWxsYmFjayYmXCJmdW5jdGlvblwiPT10eXBlb2YgYS5jYWxsYmFjaz9hLmNhbGxiYWNrKGgpOnZvaWQgMDtpZihcImVycm9yXCI9PT1kLnN0YXR1c3x8XCJmYWlsXCI9PT1kLnN0YXR1cylyZXR1cm4gaD1uZXcgRXJyb3IoZC5tZXNzYWdlKSxoLmJvZHk9ZC5kYXRhLG51bGwhPWImJmIucmVqZWN0KGgpLGEuY2FsbGJhY2smJlwiZnVuY3Rpb25cIj09dHlwZW9mIGEuY2FsbGJhY2s/YS5jYWxsYmFjayhoKTp2b2lkIDA7aWYoXCJzdWNjZXNzXCIhPT1kLnN0YXR1c3x8IWQuZGF0YSlyZXR1cm4gaD1uZXcgRXJyb3IsaC5ib2R5PWQuZGF0YSxudWxsIT1iJiZiLnJlamVjdChoKSxhLmNhbGxiYWNrJiZcImZ1bmN0aW9uXCI9PXR5cGVvZiBhLmNhbGxiYWNrP2EuY2FsbGJhY2soaCk6dm9pZCAwO2lmKCFkLnN0YXRlfHwtMT09PWUuaW5kZXhPZihkLnN0YXRlKSlyZXR1cm4gbnVsbCE9YiYmYi5yZWplY3QobmV3IEVycm9yKFwiU3RhdGUgaXMgbm90IG1hdGNoaW5nXCIpKSxhLmNhbGxiYWNrJiZcImZ1bmN0aW9uXCI9PXR5cGVvZiBhLmNhbGxiYWNrP2EuY2FsbGJhY2sobmV3IEVycm9yKFwiU3RhdGUgaXMgbm90IG1hdGNoaW5nXCIpKTp2b2lkIDA7aWYoYS5wcm92aWRlcnx8KGQuZGF0YS5wcm92aWRlcj1kLnByb3ZpZGVyKSxsPWQuZGF0YSxmLmNhY2hlRW5hYmxlZChhLmNhY2hlKSYmbCYmZi5zdG9yZUNhY2hlKGQucHJvdmlkZXIsbCksaz1sLnJlcXVlc3QsZGVsZXRlIGwucmVxdWVzdCxtPXZvaWQgMCxsLmFjY2Vzc190b2tlbj9tPXthY2Nlc3NfdG9rZW46bC5hY2Nlc3NfdG9rZW59Omwub2F1dGhfdG9rZW4mJmwub2F1dGhfdG9rZW5fc2VjcmV0JiYobT17b2F1dGhfdG9rZW46bC5vYXV0aF90b2tlbixvYXV0aF90b2tlbl9zZWNyZXQ6bC5vYXV0aF90b2tlbl9zZWNyZXR9KSwhaylyZXR1cm4gbnVsbCE9YiYmYi5yZXNvbHZlKGwpLGEuY2FsbGJhY2smJlwiZnVuY3Rpb25cIj09dHlwZW9mIGEuY2FsbGJhY2s/YS5jYWxsYmFjayhudWxsLGwpOnZvaWQgMDtpZihrLnJlcXVpcmVkKWZvcihpIGluIGsucmVxdWlyZWQpbVtrLnJlcXVpcmVkW2ldXT1sW2sucmVxdWlyZWRbaV1dO3JldHVybiBqPWZ1bmN0aW9uKGEpe3JldHVybiBjLm1rSHR0cChkLnByb3ZpZGVyLG0sayxhKX0sbC5nZXQ9aihcIkdFVFwiKSxsLnBvc3Q9aihcIlBPU1RcIiksbC5wdXQ9aihcIlBVVFwiKSxsLnBhdGNoPWooXCJQQVRDSFwiKSxsLmRlbD1qKFwiREVMRVRFXCIpLGwubWU9Yy5ta0h0dHBNZShkLnByb3ZpZGVyLG0sayxcIkdFVFwiKSxudWxsIT1iJiZiLnJlc29sdmUobCksYS5jYWxsYmFjayYmXCJmdW5jdGlvblwiPT10eXBlb2YgYS5jYWxsYmFjaz9hLmNhbGxiYWNrKG51bGwsbCk6dm9pZCAwfX19fX0se1wiLi4vdG9vbHMvdXJsXCI6OH1dLDQ6W2Z1bmN0aW9uKGEpe3ZhciBiLGM7Yz1cInVuZGVmaW5lZFwiIT10eXBlb2YgalF1ZXJ5JiZudWxsIT09alF1ZXJ5P2pRdWVyeTp2b2lkIDAsKGI9YShcIi4vbGliL29hdXRoXCIpKHdpbmRvdyxkb2N1bWVudCxjLG5hdmlnYXRvcikpKHdpbmRvd3x8dGhpcyl9LHtcIi4vbGliL29hdXRoXCI6Mn1dLDU6W2Z1bmN0aW9uKGEsYil7Yi5leHBvcnRzPXtpbml0OmZ1bmN0aW9uKGEsYil7cmV0dXJuIHRoaXMuY29uZmlnPWIsdGhpcy5jb29raWVzPWF9LHRyeUNhY2hlOmZ1bmN0aW9uKGEsYixjKXt2YXIgZCxlLGY7aWYodGhpcy5jYWNoZUVuYWJsZWQoYykpe2lmKGM9dGhpcy5jb29raWVzLnJlYWRDb29raWUoXCJvYXV0aGlvX3Byb3ZpZGVyX1wiK2IpLCFjKXJldHVybiExO2M9ZGVjb2RlVVJJQ29tcG9uZW50KGMpfWlmKFwic3RyaW5nXCI9PXR5cGVvZiBjKXRyeXtjPUpTT04ucGFyc2UoYyl9Y2F0Y2goZyl7cmV0dXJuIGQ9ZywhMX1pZihcIm9iamVjdFwiPT10eXBlb2YgYyl7Zj17fTtmb3IoZSBpbiBjKVwicmVxdWVzdFwiIT09ZSYmXCJmdW5jdGlvblwiIT10eXBlb2YgY1tlXSYmKGZbZV09Y1tlXSk7cmV0dXJuIGEuY3JlYXRlKGIsZixjLnJlcXVlc3QpfXJldHVybiExfSxzdG9yZUNhY2hlOmZ1bmN0aW9uKGEsYil7dGhpcy5jb29raWVzLmNyZWF0ZUNvb2tpZShcIm9hdXRoaW9fcHJvdmlkZXJfXCIrYSxlbmNvZGVVUklDb21wb25lbnQoSlNPTi5zdHJpbmdpZnkoYikpLGIuZXhwaXJlc19pbi0xMHx8MzYwMCl9LGNhY2hlRW5hYmxlZDpmdW5jdGlvbihhKXtyZXR1cm5cInVuZGVmaW5lZFwiPT10eXBlb2YgYT90aGlzLmNvbmZpZy5vcHRpb25zLmNhY2hlOmF9fX0se31dLDY6W2Z1bmN0aW9uKGEsYil7Yi5leHBvcnRzPXtpbml0OmZ1bmN0aW9uKGEsYil7cmV0dXJuIHRoaXMuY29uZmlnPWEsdGhpcy5kb2N1bWVudD1ifSxjcmVhdGVDb29raWU6ZnVuY3Rpb24oYSxiLGMpe3ZhciBkO3RoaXMuZXJhc2VDb29raWUoYSksZD1uZXcgRGF0ZSxkLnNldFRpbWUoZC5nZXRUaW1lKCkrMWUzKihjfHwxMjAwKSksYz1cIjsgZXhwaXJlcz1cIitkLnRvR01UU3RyaW5nKCksdGhpcy5kb2N1bWVudC5jb29raWU9YStcIj1cIitiK2MrXCI7IHBhdGg9L1wifSxyZWFkQ29va2llOmZ1bmN0aW9uKGEpe3ZhciBiLGMsZCxlO2ZvcihlPWErXCI9XCIsYz10aGlzLmRvY3VtZW50LmNvb2tpZS5zcGxpdChcIjtcIiksZD0wO2Q8Yy5sZW5ndGg7KXtmb3IoYj1jW2RdO1wiIFwiPT09Yi5jaGFyQXQoMCk7KWI9Yi5zdWJzdHJpbmcoMSxiLmxlbmd0aCk7aWYoMD09PWIuaW5kZXhPZihlKSlyZXR1cm4gYi5zdWJzdHJpbmcoZS5sZW5ndGgsYi5sZW5ndGgpO2QrK31yZXR1cm4gbnVsbH0sZXJhc2VDb29raWU6ZnVuY3Rpb24oYSl7dmFyIGI7Yj1uZXcgRGF0ZSxiLnNldFRpbWUoYi5nZXRUaW1lKCktODY0ZTUpLHRoaXMuZG9jdW1lbnQuY29va2llPWErXCI9OyBleHBpcmVzPVwiK2IudG9HTVRTdHJpbmcoKStcIjsgcGF0aD0vXCJ9fX0se31dLDc6W2Z1bmN0aW9uKGEsYil7dmFyIGMsZDtkPTAsYz1cIlwiLGIuZXhwb3J0cz17aGV4X3NoYTE6ZnVuY3Rpb24oYSl7cmV0dXJuIHRoaXMucnN0cjJoZXgodGhpcy5yc3RyX3NoYTEodGhpcy5zdHIycnN0cl91dGY4KGEpKSl9LGI2NF9zaGExOmZ1bmN0aW9uKGEpe3JldHVybiB0aGlzLnJzdHIyYjY0KHRoaXMucnN0cl9zaGExKHRoaXMuc3RyMnJzdHJfdXRmOChhKSkpfSxhbnlfc2hhMTpmdW5jdGlvbihhLGIpe3JldHVybiB0aGlzLnJzdHIyYW55KHRoaXMucnN0cl9zaGExKHRoaXMuc3RyMnJzdHJfdXRmOChhKSksYil9LGhleF9obWFjX3NoYTE6ZnVuY3Rpb24oYSxiKXtyZXR1cm4gdGhpcy5yc3RyMmhleCh0aGlzLnJzdHJfaG1hY19zaGExKHRoaXMuc3RyMnJzdHJfdXRmOChhKSx0aGlzLnN0cjJyc3RyX3V0ZjgoYikpKX0sYjY0X2htYWNfc2hhMTpmdW5jdGlvbihhLGIpe3JldHVybiB0aGlzLnJzdHIyYjY0KHRoaXMucnN0cl9obWFjX3NoYTEodGhpcy5zdHIycnN0cl91dGY4KGEpLHRoaXMuc3RyMnJzdHJfdXRmOChiKSkpfSxhbnlfaG1hY19zaGExOmZ1bmN0aW9uKGEsYixjKXtyZXR1cm4gdGhpcy5yc3RyMmFueSh0aGlzLnJzdHJfaG1hY19zaGExKHRoaXMuc3RyMnJzdHJfdXRmOChhKSx0aGlzLnN0cjJyc3RyX3V0ZjgoYikpLGMpfSxzaGExX3ZtX3Rlc3Q6ZnVuY3Rpb24oKXtyZXR1cm5cImE5OTkzZTM2NDcwNjgxNmFiYTNlMjU3MTc4NTBjMjZjOWNkMGQ4OWRcIj09PXRoaXNoZXhfc2hhMShcImFiY1wiKS50b0xvd2VyQ2FzZSgpfSxyc3RyX3NoYTE6ZnVuY3Rpb24oYSl7cmV0dXJuIHRoaXMuYmluYjJyc3RyKHRoaXMuYmluYl9zaGExKHRoaXMucnN0cjJiaW5iKGEpLDgqYS5sZW5ndGgpKX0scnN0cl9obWFjX3NoYTE6ZnVuY3Rpb24oYSxiKXt2YXIgYyxkLGUsZixnO2ZvcihjPXRoaXMucnN0cjJiaW5iKGEpLGMubGVuZ3RoPjE2JiYoYz10aGlzLmJpbmJfc2hhMShjLDgqYS5sZW5ndGgpKSxmPUFycmF5KDE2KSxnPUFycmF5KDE2KSxlPTA7MTY+ZTspZltlXT05MDk1MjI0ODZeY1tlXSxnW2VdPTE1NDk1NTY4MjheY1tlXSxlKys7cmV0dXJuIGQ9dGhpcy5iaW5iX3NoYTEoZi5jb25jYXQodGhpcy5yc3RyMmJpbmIoYikpLDUxMis4KmIubGVuZ3RoKSx0aGlzLmJpbmIycnN0cih0aGlzLmJpbmJfc2hhMShnLmNvbmNhdChkKSw2NzIpKX0scnN0cjJoZXg6ZnVuY3Rpb24oYSl7dmFyIGIsYyxlLGYsZzt0cnl7fWNhdGNoKGgpe2I9aCxkPTB9Zm9yKGM9ZD9cIjAxMjM0NTY3ODlBQkNERUZcIjpcIjAxMjM0NTY3ODlhYmNkZWZcIixmPVwiXCIsZz12b2lkIDAsZT0wO2U8YS5sZW5ndGg7KWc9YS5jaGFyQ29kZUF0KGUpLGYrPWMuY2hhckF0KGc+Pj40JjE1KStjLmNoYXJBdCgxNSZnKSxlKys7cmV0dXJuIGZ9LHJzdHIyYjY0OmZ1bmN0aW9uKGEpe3ZhciBiLGQsZSxmLGcsaCxpO3RyeXt9Y2F0Y2goail7Yj1qLGM9XCJcIn1mb3IoaD1cIkFCQ0RFRkdISUpLTE1OT1BRUlNUVVZXWFlaYWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXowMTIzNDU2Nzg5Ky9cIixnPVwiXCIsZj1hLmxlbmd0aCxkPTA7Zj5kOyl7Zm9yKGk9YS5jaGFyQ29kZUF0KGQpPDwxNnwoZj5kKzE/YS5jaGFyQ29kZUF0KGQrMSk8PDg6MCl8KGY+ZCsyP2EuY2hhckNvZGVBdChkKzIpOjApLGU9MDs0PmU7KWcrPTgqZCs2KmU+OCphLmxlbmd0aD9jOmguY2hhckF0KGk+Pj42KigzLWUpJjYzKSxlKys7ZCs9M31yZXR1cm4gZ30scnN0cjJhbnk6ZnVuY3Rpb24oYSxiKXt2YXIgYyxkLGUsZixnLGgsaSxqLGs7Zm9yKGQ9Yi5sZW5ndGgsaj1BcnJheSgpLGY9dm9pZCAwLGg9dm9pZCAwLGs9dm9pZCAwLGk9dm9pZCAwLGM9QXJyYXkoTWF0aC5jZWlsKGEubGVuZ3RoLzIpKSxmPTA7ZjxjLmxlbmd0aDspY1tmXT1hLmNoYXJDb2RlQXQoMipmKTw8OHxhLmNoYXJDb2RlQXQoMipmKzEpLGYrKztmb3IoO2MubGVuZ3RoPjA7KXtmb3IoaT1BcnJheSgpLGs9MCxmPTA7ZjxjLmxlbmd0aDspaz0oazw8MTYpK2NbZl0saD1NYXRoLmZsb29yKGsvZCksay09aCpkLChpLmxlbmd0aD4wfHxoPjApJiYoaVtpLmxlbmd0aF09aCksZisrO2pbai5sZW5ndGhdPWssYz1pfWZvcihnPVwiXCIsZj1qLmxlbmd0aC0xO2Y+PTA7KWcrPWIuY2hhckF0KGpbZl0pLGYtLTtmb3IoZT1NYXRoLmNlaWwoOCphLmxlbmd0aC8oTWF0aC5sb2coYi5sZW5ndGgpL01hdGgubG9nKDIpKSksZj1nLmxlbmd0aDtlPmY7KWc9YlswXStnLGYrKztyZXR1cm4gZ30sc3RyMnJzdHJfdXRmODpmdW5jdGlvbihhKXt2YXIgYixjLGQsZTtmb3IoYz1cIlwiLGI9LTEsZD12b2lkIDAsZT12b2lkIDA7KytiPGEubGVuZ3RoOylkPWEuY2hhckNvZGVBdChiKSxlPWIrMTxhLmxlbmd0aD9hLmNoYXJDb2RlQXQoYisxKTowLGQ+PTU1Mjk2JiY1NjMxOT49ZCYmZT49NTYzMjAmJjU3MzQzPj1lJiYoZD02NTUzNisoKDEwMjMmZCk8PDEwKSsoMTAyMyZlKSxiKyspLDEyNz49ZD9jKz1TdHJpbmcuZnJvbUNoYXJDb2RlKGQpOjIwNDc+PWQ/Yys9U3RyaW5nLmZyb21DaGFyQ29kZSgxOTJ8ZD4+PjYmMzEsMTI4fDYzJmQpOjY1NTM1Pj1kP2MrPVN0cmluZy5mcm9tQ2hhckNvZGUoMjI0fGQ+Pj4xMiYxNSwxMjh8ZD4+PjYmNjMsMTI4fDYzJmQpOjIwOTcxNTE+PWQmJihjKz1TdHJpbmcuZnJvbUNoYXJDb2RlKDI0MHxkPj4+MTgmNywxMjh8ZD4+PjEyJjYzLDEyOHxkPj4+NiY2MywxMjh8NjMmZCkpO3JldHVybiBjfSxzdHIycnN0cl91dGYxNmxlOmZ1bmN0aW9uKGEpe3ZhciBiLGM7Zm9yKGM9XCJcIixiPTA7YjxhLmxlbmd0aDspYys9U3RyaW5nLmZyb21DaGFyQ29kZSgyNTUmYS5jaGFyQ29kZUF0KGIpLGEuY2hhckNvZGVBdChiKT4+PjgmMjU1KSxiKys7cmV0dXJuIGN9LHN0cjJyc3RyX3V0ZjE2YmU6ZnVuY3Rpb24oYSl7dmFyIGIsYztmb3IoYz1cIlwiLGI9MDtiPGEubGVuZ3RoOyljKz1TdHJpbmcuZnJvbUNoYXJDb2RlKGEuY2hhckNvZGVBdChiKT4+PjgmMjU1LDI1NSZhLmNoYXJDb2RlQXQoYikpLGIrKztyZXR1cm4gY30scnN0cjJiaW5iOmZ1bmN0aW9uKGEpe3ZhciBiLGM7Zm9yKGM9QXJyYXkoYS5sZW5ndGg+PjIpLGI9MDtiPGMubGVuZ3RoOyljW2JdPTAsYisrO2ZvcihiPTA7Yjw4KmEubGVuZ3RoOyljW2I+PjVdfD0oMjU1JmEuY2hhckNvZGVBdChiLzgpKTw8MjQtYiUzMixiKz04O3JldHVybiBjfSxiaW5iMnJzdHI6ZnVuY3Rpb24oYSl7dmFyIGIsYztmb3IoYz1cIlwiLGI9MDtiPDMyKmEubGVuZ3RoOyljKz1TdHJpbmcuZnJvbUNoYXJDb2RlKGFbYj4+NV0+Pj4yNC1iJTMyJjI1NSksYis9ODtyZXR1cm4gY30sYmluYl9zaGExOmZ1bmN0aW9uKGEsYil7dmFyIGMsZCxlLGYsZyxoLGksaixrLGwsbSxuLG8scDtmb3IoYVtiPj41XXw9MTI4PDwyNC1iJTMyLGFbKGIrNjQ+Pjk8PDQpKzE1XT1iLHA9QXJyYXkoODApLGM9MTczMjU4NDE5MyxkPS0yNzE3MzM4NzksZT0tMTczMjU4NDE5NCxmPTI3MTczMzg3OCxnPS0xMDA5NTg5Nzc2LGg9MDtoPGEubGVuZ3RoOyl7Zm9yKGo9YyxrPWQsbD1lLG09ZixuPWcsaT0wOzgwPmk7KXBbaV09MTY+aT9hW2graV06dGhpcy5iaXRfcm9sKHBbaS0zXV5wW2ktOF1ecFtpLTE0XV5wW2ktMTZdLDEpLG89dGhpcy5zYWZlX2FkZCh0aGlzLnNhZmVfYWRkKHRoaXMuYml0X3JvbChjLDUpLHRoaXMuc2hhMV9mdChpLGQsZSxmKSksdGhpcy5zYWZlX2FkZCh0aGlzLnNhZmVfYWRkKGcscFtpXSksdGhpcy5zaGExX2t0KGkpKSksZz1mLGY9ZSxlPXRoaXMuYml0X3JvbChkLDMwKSxkPWMsYz1vLGkrKztjPXRoaXMuc2FmZV9hZGQoYyxqKSxkPXRoaXMuc2FmZV9hZGQoZCxrKSxlPXRoaXMuc2FmZV9hZGQoZSxsKSxmPXRoaXMuc2FmZV9hZGQoZixtKSxnPXRoaXMuc2FmZV9hZGQoZyxuKSxoKz0xNn1yZXR1cm4gQXJyYXkoYyxkLGUsZixnKX0sc2hhMV9mdDpmdW5jdGlvbihhLGIsYyxkKXtyZXR1cm4gMjA+YT9iJmN8fmImZDo0MD5hP2JeY15kOjYwPmE/YiZjfGImZHxjJmQ6Yl5jXmR9LHNoYTFfa3Q6ZnVuY3Rpb24oYSl7cmV0dXJuIDIwPmE/MTUxODUwMDI0OTo0MD5hPzE4NTk3NzUzOTM6NjA+YT8tMTg5NDAwNzU4ODotODk5NDk3NTE0fSxzYWZlX2FkZDpmdW5jdGlvbihhLGIpe3ZhciBjLGQ7cmV0dXJuIGM9KDY1NTM1JmEpKyg2NTUzNSZiKSxkPShhPj4xNikrKGI+PjE2KSsoYz4+MTYpLGQ8PDE2fDY1NTM1JmN9LGJpdF9yb2w6ZnVuY3Rpb24oYSxiKXtyZXR1cm4gYTw8YnxhPj4+MzItYn0sY3JlYXRlX2hhc2g6ZnVuY3Rpb24oKXt2YXIgYTtyZXR1cm4gYT10aGlzLmI2NF9zaGExKChuZXcgRGF0ZSkuZ2V0VGltZSgpK1wiOlwiK01hdGguZmxvb3IoOTk5OTk5OSpNYXRoLnJhbmRvbSgpKSksYS5yZXBsYWNlKC9cXCsvZyxcIi1cIikucmVwbGFjZSgvXFwvL2csXCJfXCIpLnJlcGxhY2UoL1xcPSskLyxcIlwiKX19fSx7fV0sODpbZnVuY3Rpb24oYSxiKXtiLmV4cG9ydHM9ZnVuY3Rpb24oYSl7cmV0dXJue2dldEFic1VybDpmdW5jdGlvbihiKXt2YXIgYztyZXR1cm4gYi5tYXRjaCgvXi57Miw1fTpcXC9cXC8vKT9iOlwiL1wiPT09YlswXT9hLmxvY2F0aW9uLnByb3RvY29sK1wiLy9cIithLmxvY2F0aW9uLmhvc3QrYjooYz1hLmxvY2F0aW9uLnByb3RvY29sK1wiLy9cIithLmxvY2F0aW9uLmhvc3QrYS5sb2NhdGlvbi5wYXRobmFtZSxcIi9cIiE9PWNbYy5sZW5ndGgtMV0mJlwiI1wiIT09YlswXT9jK1wiL1wiK2I6YytiKX0scmVwbGFjZVBhcmFtOmZ1bmN0aW9uKGEsYixjKXtyZXR1cm4gYT1hLnJlcGxhY2UoL1xce1xceyguKj8pXFx9XFx9L2csZnVuY3Rpb24oYSxjKXtyZXR1cm4gYltjXXx8XCJcIn0pLGMmJihhPWEucmVwbGFjZSgvXFx7KC4qPylcXH0vZyxmdW5jdGlvbihhLGIpe3JldHVybiBjW2JdfHxcIlwifSkpLGF9fX19LHt9XX0se30sWzRdKTsiLCJhbmd1bGFyLm1vZHVsZSgndWkuYm9vdHN0cmFwLnBhZ2luYXRpb24nLCBbXSlcblxuLmNvbnRyb2xsZXIoJ1BhZ2luYXRpb25Db250cm9sbGVyJywgWyckc2NvcGUnLCAnJGF0dHJzJywgJyRwYXJzZScsIGZ1bmN0aW9uICgkc2NvcGUsICRhdHRycywgJHBhcnNlKSB7XG4gIHZhciBzZWxmID0gdGhpcyxcbiAgICAgIG5nTW9kZWxDdHJsID0geyAkc2V0Vmlld1ZhbHVlOiBhbmd1bGFyLm5vb3AgfSwgLy8gbnVsbE1vZGVsQ3RybFxuICAgICAgc2V0TnVtUGFnZXMgPSAkYXR0cnMubnVtUGFnZXMgPyAkcGFyc2UoJGF0dHJzLm51bVBhZ2VzKS5hc3NpZ24gOiBhbmd1bGFyLm5vb3A7XG5cbiAgdGhpcy5pbml0ID0gZnVuY3Rpb24obmdNb2RlbEN0cmxfLCBjb25maWcpIHtcbiAgICBuZ01vZGVsQ3RybCA9IG5nTW9kZWxDdHJsXztcbiAgICB0aGlzLmNvbmZpZyA9IGNvbmZpZztcblxuICAgIG5nTW9kZWxDdHJsLiRyZW5kZXIgPSBmdW5jdGlvbigpIHtcbiAgICAgIHNlbGYucmVuZGVyKCk7XG4gICAgfTtcblxuICAgIGlmICgkYXR0cnMuaXRlbXNQZXJQYWdlKSB7XG4gICAgICAkc2NvcGUuJHBhcmVudC4kd2F0Y2goJHBhcnNlKCRhdHRycy5pdGVtc1BlclBhZ2UpLCBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICBzZWxmLml0ZW1zUGVyUGFnZSA9IHBhcnNlSW50KHZhbHVlLCAxMCk7XG4gICAgICAgICRzY29wZS50b3RhbFBhZ2VzID0gc2VsZi5jYWxjdWxhdGVUb3RhbFBhZ2VzKCk7XG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5pdGVtc1BlclBhZ2UgPSBjb25maWcuaXRlbXNQZXJQYWdlO1xuICAgIH1cbiAgfTtcblxuICB0aGlzLmNhbGN1bGF0ZVRvdGFsUGFnZXMgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgdG90YWxQYWdlcyA9IHRoaXMuaXRlbXNQZXJQYWdlIDwgMSA/IDEgOiBNYXRoLmNlaWwoJHNjb3BlLnRvdGFsSXRlbXMgLyB0aGlzLml0ZW1zUGVyUGFnZSk7XG4gICAgcmV0dXJuIE1hdGgubWF4KHRvdGFsUGFnZXMgfHwgMCwgMSk7XG4gIH07XG5cbiAgdGhpcy5yZW5kZXIgPSBmdW5jdGlvbigpIHtcbiAgICAkc2NvcGUucGFnZSA9IHBhcnNlSW50KG5nTW9kZWxDdHJsLiR2aWV3VmFsdWUsIDEwKSB8fCAxO1xuICB9O1xuXG4gICRzY29wZS5zZWxlY3RQYWdlID0gZnVuY3Rpb24ocGFnZSkge1xuICAgIGlmICggJHNjb3BlLnBhZ2UgIT09IHBhZ2UgJiYgcGFnZSA+IDAgJiYgcGFnZSA8PSAkc2NvcGUudG90YWxQYWdlcykge1xuICAgICAgbmdNb2RlbEN0cmwuJHNldFZpZXdWYWx1ZShwYWdlKTtcbiAgICAgIG5nTW9kZWxDdHJsLiRyZW5kZXIoKTtcbiAgICB9XG4gIH07XG5cbiAgJHNjb3BlLmdldFRleHQgPSBmdW5jdGlvbigga2V5ICkge1xuICAgIHJldHVybiAkc2NvcGVba2V5ICsgJ1RleHQnXSB8fCBzZWxmLmNvbmZpZ1trZXkgKyAnVGV4dCddO1xuICB9O1xuICAkc2NvcGUubm9QcmV2aW91cyA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiAkc2NvcGUucGFnZSA9PT0gMTtcbiAgfTtcbiAgJHNjb3BlLm5vTmV4dCA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiAkc2NvcGUucGFnZSA9PT0gJHNjb3BlLnRvdGFsUGFnZXM7XG4gIH07XG5cbiAgJHNjb3BlLiR3YXRjaCgndG90YWxJdGVtcycsIGZ1bmN0aW9uKCkge1xuICAgICRzY29wZS50b3RhbFBhZ2VzID0gc2VsZi5jYWxjdWxhdGVUb3RhbFBhZ2VzKCk7XG4gIH0pO1xuXG4gICRzY29wZS4kd2F0Y2goJ3RvdGFsUGFnZXMnLCBmdW5jdGlvbih2YWx1ZSkge1xuICAgIHNldE51bVBhZ2VzKCRzY29wZS4kcGFyZW50LCB2YWx1ZSk7IC8vIFJlYWRvbmx5IHZhcmlhYmxlXG5cbiAgICBpZiAoICRzY29wZS5wYWdlID4gdmFsdWUgKSB7XG4gICAgICAkc2NvcGUuc2VsZWN0UGFnZSh2YWx1ZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIG5nTW9kZWxDdHJsLiRyZW5kZXIoKTtcbiAgICB9XG4gIH0pO1xufV0pXG5cbi5jb25zdGFudCgncGFnaW5hdGlvbkNvbmZpZycsIHtcbiAgaXRlbXNQZXJQYWdlOiAxMCxcbiAgYm91bmRhcnlMaW5rczogZmFsc2UsXG4gIGRpcmVjdGlvbkxpbmtzOiB0cnVlLFxuICBmaXJzdFRleHQ6ICdGaXJzdCcsXG4gIHByZXZpb3VzVGV4dDogJ1ByZXZpb3VzJyxcbiAgbmV4dFRleHQ6ICdOZXh0JyxcbiAgbGFzdFRleHQ6ICdMYXN0JyxcbiAgcm90YXRlOiB0cnVlXG59KVxuXG4uZGlyZWN0aXZlKCdwYWdpbmF0aW9uJywgWyckcGFyc2UnLCAncGFnaW5hdGlvbkNvbmZpZycsIGZ1bmN0aW9uKCRwYXJzZSwgcGFnaW5hdGlvbkNvbmZpZykge1xuICByZXR1cm4ge1xuICAgIHJlc3RyaWN0OiAnRUEnLFxuICAgIHNjb3BlOiB7XG4gICAgICB0b3RhbEl0ZW1zOiAnPScsXG4gICAgICBmaXJzdFRleHQ6ICdAJyxcbiAgICAgIHByZXZpb3VzVGV4dDogJ0AnLFxuICAgICAgbmV4dFRleHQ6ICdAJyxcbiAgICAgIGxhc3RUZXh0OiAnQCdcbiAgICB9LFxuICAgIHJlcXVpcmU6IFsncGFnaW5hdGlvbicsICc/bmdNb2RlbCddLFxuICAgIGNvbnRyb2xsZXI6ICdQYWdpbmF0aW9uQ29udHJvbGxlcicsXG4gICAgdGVtcGxhdGVVcmw6ICd0ZW1wbGF0ZS9wYWdpbmF0aW9uL3BhZ2luYXRpb24uaHRtbCcsXG4gICAgcmVwbGFjZTogdHJ1ZSxcbiAgICBsaW5rOiBmdW5jdGlvbihzY29wZSwgZWxlbWVudCwgYXR0cnMsIGN0cmxzKSB7XG4gICAgICB2YXIgcGFnaW5hdGlvbkN0cmwgPSBjdHJsc1swXSwgbmdNb2RlbEN0cmwgPSBjdHJsc1sxXTtcblxuICAgICAgaWYgKCFuZ01vZGVsQ3RybCkge1xuICAgICAgICAgcmV0dXJuOyAvLyBkbyBub3RoaW5nIGlmIG5vIG5nLW1vZGVsXG4gICAgICB9XG5cbiAgICAgIC8vIFNldHVwIGNvbmZpZ3VyYXRpb24gcGFyYW1ldGVyc1xuICAgICAgdmFyIG1heFNpemUgPSBhbmd1bGFyLmlzRGVmaW5lZChhdHRycy5tYXhTaXplKSA/IHNjb3BlLiRwYXJlbnQuJGV2YWwoYXR0cnMubWF4U2l6ZSkgOiBwYWdpbmF0aW9uQ29uZmlnLm1heFNpemUsXG4gICAgICAgICAgcm90YXRlID0gYW5ndWxhci5pc0RlZmluZWQoYXR0cnMucm90YXRlKSA/IHNjb3BlLiRwYXJlbnQuJGV2YWwoYXR0cnMucm90YXRlKSA6IHBhZ2luYXRpb25Db25maWcucm90YXRlO1xuICAgICAgc2NvcGUuYm91bmRhcnlMaW5rcyA9IGFuZ3VsYXIuaXNEZWZpbmVkKGF0dHJzLmJvdW5kYXJ5TGlua3MpID8gc2NvcGUuJHBhcmVudC4kZXZhbChhdHRycy5ib3VuZGFyeUxpbmtzKSA6IHBhZ2luYXRpb25Db25maWcuYm91bmRhcnlMaW5rcztcbiAgICAgIHNjb3BlLmRpcmVjdGlvbkxpbmtzID0gYW5ndWxhci5pc0RlZmluZWQoYXR0cnMuZGlyZWN0aW9uTGlua3MpID8gc2NvcGUuJHBhcmVudC4kZXZhbChhdHRycy5kaXJlY3Rpb25MaW5rcykgOiBwYWdpbmF0aW9uQ29uZmlnLmRpcmVjdGlvbkxpbmtzO1xuXG4gICAgICBwYWdpbmF0aW9uQ3RybC5pbml0KG5nTW9kZWxDdHJsLCBwYWdpbmF0aW9uQ29uZmlnKTtcblxuICAgICAgaWYgKGF0dHJzLm1heFNpemUpIHtcbiAgICAgICAgc2NvcGUuJHBhcmVudC4kd2F0Y2goJHBhcnNlKGF0dHJzLm1heFNpemUpLCBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICAgIG1heFNpemUgPSBwYXJzZUludCh2YWx1ZSwgMTApO1xuICAgICAgICAgIHBhZ2luYXRpb25DdHJsLnJlbmRlcigpO1xuICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgICAgLy8gQ3JlYXRlIHBhZ2Ugb2JqZWN0IHVzZWQgaW4gdGVtcGxhdGVcbiAgICAgIGZ1bmN0aW9uIG1ha2VQYWdlKG51bWJlciwgdGV4dCwgaXNBY3RpdmUpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBudW1iZXI6IG51bWJlcixcbiAgICAgICAgICB0ZXh0OiB0ZXh0LFxuICAgICAgICAgIGFjdGl2ZTogaXNBY3RpdmVcbiAgICAgICAgfTtcbiAgICAgIH1cblxuICAgICAgZnVuY3Rpb24gZ2V0UGFnZXMoY3VycmVudFBhZ2UsIHRvdGFsUGFnZXMpIHtcbiAgICAgICAgdmFyIHBhZ2VzID0gW107XG5cbiAgICAgICAgLy8gRGVmYXVsdCBwYWdlIGxpbWl0c1xuICAgICAgICB2YXIgc3RhcnRQYWdlID0gMSwgZW5kUGFnZSA9IHRvdGFsUGFnZXM7XG4gICAgICAgIHZhciBpc01heFNpemVkID0gKCBhbmd1bGFyLmlzRGVmaW5lZChtYXhTaXplKSAmJiBtYXhTaXplIDwgdG90YWxQYWdlcyApO1xuXG4gICAgICAgIC8vIHJlY29tcHV0ZSBpZiBtYXhTaXplXG4gICAgICAgIGlmICggaXNNYXhTaXplZCApIHtcbiAgICAgICAgICBpZiAoIHJvdGF0ZSApIHtcbiAgICAgICAgICAgIC8vIEN1cnJlbnQgcGFnZSBpcyBkaXNwbGF5ZWQgaW4gdGhlIG1pZGRsZSBvZiB0aGUgdmlzaWJsZSBvbmVzXG4gICAgICAgICAgICBzdGFydFBhZ2UgPSBNYXRoLm1heChjdXJyZW50UGFnZSAtIE1hdGguZmxvb3IobWF4U2l6ZS8yKSwgMSk7XG4gICAgICAgICAgICBlbmRQYWdlICAgPSBzdGFydFBhZ2UgKyBtYXhTaXplIC0gMTtcblxuICAgICAgICAgICAgLy8gQWRqdXN0IGlmIGxpbWl0IGlzIGV4Y2VlZGVkXG4gICAgICAgICAgICBpZiAoZW5kUGFnZSA+IHRvdGFsUGFnZXMpIHtcbiAgICAgICAgICAgICAgZW5kUGFnZSAgID0gdG90YWxQYWdlcztcbiAgICAgICAgICAgICAgc3RhcnRQYWdlID0gZW5kUGFnZSAtIG1heFNpemUgKyAxO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyBWaXNpYmxlIHBhZ2VzIGFyZSBwYWdpbmF0ZWQgd2l0aCBtYXhTaXplXG4gICAgICAgICAgICBzdGFydFBhZ2UgPSAoKE1hdGguY2VpbChjdXJyZW50UGFnZSAvIG1heFNpemUpIC0gMSkgKiBtYXhTaXplKSArIDE7XG5cbiAgICAgICAgICAgIC8vIEFkanVzdCBsYXN0IHBhZ2UgaWYgbGltaXQgaXMgZXhjZWVkZWRcbiAgICAgICAgICAgIGVuZFBhZ2UgPSBNYXRoLm1pbihzdGFydFBhZ2UgKyBtYXhTaXplIC0gMSwgdG90YWxQYWdlcyk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gQWRkIHBhZ2UgbnVtYmVyIGxpbmtzXG4gICAgICAgIGZvciAodmFyIG51bWJlciA9IHN0YXJ0UGFnZTsgbnVtYmVyIDw9IGVuZFBhZ2U7IG51bWJlcisrKSB7XG4gICAgICAgICAgdmFyIHBhZ2UgPSBtYWtlUGFnZShudW1iZXIsIG51bWJlciwgbnVtYmVyID09PSBjdXJyZW50UGFnZSk7XG4gICAgICAgICAgcGFnZXMucHVzaChwYWdlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIEFkZCBsaW5rcyB0byBtb3ZlIGJldHdlZW4gcGFnZSBzZXRzXG4gICAgICAgIGlmICggaXNNYXhTaXplZCAmJiAhIHJvdGF0ZSApIHtcbiAgICAgICAgICBpZiAoIHN0YXJ0UGFnZSA+IDEgKSB7XG4gICAgICAgICAgICB2YXIgcHJldmlvdXNQYWdlU2V0ID0gbWFrZVBhZ2Uoc3RhcnRQYWdlIC0gMSwgJy4uLicsIGZhbHNlKTtcbiAgICAgICAgICAgIHBhZ2VzLnVuc2hpZnQocHJldmlvdXNQYWdlU2V0KTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAoIGVuZFBhZ2UgPCB0b3RhbFBhZ2VzICkge1xuICAgICAgICAgICAgdmFyIG5leHRQYWdlU2V0ID0gbWFrZVBhZ2UoZW5kUGFnZSArIDEsICcuLi4nLCBmYWxzZSk7XG4gICAgICAgICAgICBwYWdlcy5wdXNoKG5leHRQYWdlU2V0KTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcGFnZXM7XG4gICAgICB9XG5cbiAgICAgIHZhciBvcmlnaW5hbFJlbmRlciA9IHBhZ2luYXRpb25DdHJsLnJlbmRlcjtcbiAgICAgIHBhZ2luYXRpb25DdHJsLnJlbmRlciA9IGZ1bmN0aW9uKCkge1xuICAgICAgICBvcmlnaW5hbFJlbmRlcigpO1xuICAgICAgICBpZiAoc2NvcGUucGFnZSA+IDAgJiYgc2NvcGUucGFnZSA8PSBzY29wZS50b3RhbFBhZ2VzKSB7XG4gICAgICAgICAgc2NvcGUucGFnZXMgPSBnZXRQYWdlcyhzY29wZS5wYWdlLCBzY29wZS50b3RhbFBhZ2VzKTtcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICB9XG4gIH07XG59XSlcblxuLmNvbnN0YW50KCdwYWdlckNvbmZpZycsIHtcbiAgaXRlbXNQZXJQYWdlOiAxMCxcbiAgcHJldmlvdXNUZXh0OiAnwqsgUHJldmlvdXMnLFxuICBuZXh0VGV4dDogJ05leHQgwrsnLFxuICBhbGlnbjogdHJ1ZVxufSlcblxuLmRpcmVjdGl2ZSgncGFnZXInLCBbJ3BhZ2VyQ29uZmlnJywgZnVuY3Rpb24ocGFnZXJDb25maWcpIHtcbiAgcmV0dXJuIHtcbiAgICByZXN0cmljdDogJ0VBJyxcbiAgICBzY29wZToge1xuICAgICAgdG90YWxJdGVtczogJz0nLFxuICAgICAgcHJldmlvdXNUZXh0OiAnQCcsXG4gICAgICBuZXh0VGV4dDogJ0AnXG4gICAgfSxcbiAgICByZXF1aXJlOiBbJ3BhZ2VyJywgJz9uZ01vZGVsJ10sXG4gICAgY29udHJvbGxlcjogJ1BhZ2luYXRpb25Db250cm9sbGVyJyxcbiAgICB0ZW1wbGF0ZVVybDogJ3RlbXBsYXRlL3BhZ2luYXRpb24vcGFnZXIuaHRtbCcsXG4gICAgcmVwbGFjZTogdHJ1ZSxcbiAgICBsaW5rOiBmdW5jdGlvbihzY29wZSwgZWxlbWVudCwgYXR0cnMsIGN0cmxzKSB7XG4gICAgICB2YXIgcGFnaW5hdGlvbkN0cmwgPSBjdHJsc1swXSwgbmdNb2RlbEN0cmwgPSBjdHJsc1sxXTtcblxuICAgICAgaWYgKCFuZ01vZGVsQ3RybCkge1xuICAgICAgICAgcmV0dXJuOyAvLyBkbyBub3RoaW5nIGlmIG5vIG5nLW1vZGVsXG4gICAgICB9XG5cbiAgICAgIHNjb3BlLmFsaWduID0gYW5ndWxhci5pc0RlZmluZWQoYXR0cnMuYWxpZ24pID8gc2NvcGUuJHBhcmVudC4kZXZhbChhdHRycy5hbGlnbikgOiBwYWdlckNvbmZpZy5hbGlnbjtcbiAgICAgIHBhZ2luYXRpb25DdHJsLmluaXQobmdNb2RlbEN0cmwsIHBhZ2VyQ29uZmlnKTtcbiAgICB9XG4gIH07XG59XSk7XG4iLCIvLyAgICAgVW5kZXJzY29yZS5qcyAxLjYuMFxuLy8gICAgIGh0dHA6Ly91bmRlcnNjb3JlanMub3JnXG4vLyAgICAgKGMpIDIwMDktMjAxNCBKZXJlbXkgQXNoa2VuYXMsIERvY3VtZW50Q2xvdWQgYW5kIEludmVzdGlnYXRpdmUgUmVwb3J0ZXJzICYgRWRpdG9yc1xuLy8gICAgIFVuZGVyc2NvcmUgbWF5IGJlIGZyZWVseSBkaXN0cmlidXRlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UuXG5cbihmdW5jdGlvbigpIHtcblxuICAvLyBCYXNlbGluZSBzZXR1cFxuICAvLyAtLS0tLS0tLS0tLS0tLVxuXG4gIC8vIEVzdGFibGlzaCB0aGUgcm9vdCBvYmplY3QsIGB3aW5kb3dgIGluIHRoZSBicm93c2VyLCBvciBgZXhwb3J0c2Agb24gdGhlIHNlcnZlci5cbiAgdmFyIHJvb3QgPSB0aGlzO1xuXG4gIC8vIFNhdmUgdGhlIHByZXZpb3VzIHZhbHVlIG9mIHRoZSBgX2AgdmFyaWFibGUuXG4gIHZhciBwcmV2aW91c1VuZGVyc2NvcmUgPSByb290Ll87XG5cbiAgLy8gRXN0YWJsaXNoIHRoZSBvYmplY3QgdGhhdCBnZXRzIHJldHVybmVkIHRvIGJyZWFrIG91dCBvZiBhIGxvb3AgaXRlcmF0aW9uLlxuICB2YXIgYnJlYWtlciA9IHt9O1xuXG4gIC8vIFNhdmUgYnl0ZXMgaW4gdGhlIG1pbmlmaWVkIChidXQgbm90IGd6aXBwZWQpIHZlcnNpb246XG4gIHZhciBBcnJheVByb3RvID0gQXJyYXkucHJvdG90eXBlLCBPYmpQcm90byA9IE9iamVjdC5wcm90b3R5cGUsIEZ1bmNQcm90byA9IEZ1bmN0aW9uLnByb3RvdHlwZTtcblxuICAvLyBDcmVhdGUgcXVpY2sgcmVmZXJlbmNlIHZhcmlhYmxlcyBmb3Igc3BlZWQgYWNjZXNzIHRvIGNvcmUgcHJvdG90eXBlcy5cbiAgdmFyXG4gICAgcHVzaCAgICAgICAgICAgICA9IEFycmF5UHJvdG8ucHVzaCxcbiAgICBzbGljZSAgICAgICAgICAgID0gQXJyYXlQcm90by5zbGljZSxcbiAgICBjb25jYXQgICAgICAgICAgID0gQXJyYXlQcm90by5jb25jYXQsXG4gICAgdG9TdHJpbmcgICAgICAgICA9IE9ialByb3RvLnRvU3RyaW5nLFxuICAgIGhhc093blByb3BlcnR5ICAgPSBPYmpQcm90by5oYXNPd25Qcm9wZXJ0eTtcblxuICAvLyBBbGwgKipFQ01BU2NyaXB0IDUqKiBuYXRpdmUgZnVuY3Rpb24gaW1wbGVtZW50YXRpb25zIHRoYXQgd2UgaG9wZSB0byB1c2VcbiAgLy8gYXJlIGRlY2xhcmVkIGhlcmUuXG4gIHZhclxuICAgIG5hdGl2ZUZvckVhY2ggICAgICA9IEFycmF5UHJvdG8uZm9yRWFjaCxcbiAgICBuYXRpdmVNYXAgICAgICAgICAgPSBBcnJheVByb3RvLm1hcCxcbiAgICBuYXRpdmVSZWR1Y2UgICAgICAgPSBBcnJheVByb3RvLnJlZHVjZSxcbiAgICBuYXRpdmVSZWR1Y2VSaWdodCAgPSBBcnJheVByb3RvLnJlZHVjZVJpZ2h0LFxuICAgIG5hdGl2ZUZpbHRlciAgICAgICA9IEFycmF5UHJvdG8uZmlsdGVyLFxuICAgIG5hdGl2ZUV2ZXJ5ICAgICAgICA9IEFycmF5UHJvdG8uZXZlcnksXG4gICAgbmF0aXZlU29tZSAgICAgICAgID0gQXJyYXlQcm90by5zb21lLFxuICAgIG5hdGl2ZUluZGV4T2YgICAgICA9IEFycmF5UHJvdG8uaW5kZXhPZixcbiAgICBuYXRpdmVMYXN0SW5kZXhPZiAgPSBBcnJheVByb3RvLmxhc3RJbmRleE9mLFxuICAgIG5hdGl2ZUlzQXJyYXkgICAgICA9IEFycmF5LmlzQXJyYXksXG4gICAgbmF0aXZlS2V5cyAgICAgICAgID0gT2JqZWN0LmtleXMsXG4gICAgbmF0aXZlQmluZCAgICAgICAgID0gRnVuY1Byb3RvLmJpbmQ7XG5cbiAgLy8gQ3JlYXRlIGEgc2FmZSByZWZlcmVuY2UgdG8gdGhlIFVuZGVyc2NvcmUgb2JqZWN0IGZvciB1c2UgYmVsb3cuXG4gIHZhciBfID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgaWYgKG9iaiBpbnN0YW5jZW9mIF8pIHJldHVybiBvYmo7XG4gICAgaWYgKCEodGhpcyBpbnN0YW5jZW9mIF8pKSByZXR1cm4gbmV3IF8ob2JqKTtcbiAgICB0aGlzLl93cmFwcGVkID0gb2JqO1xuICB9O1xuXG4gIC8vIEV4cG9ydCB0aGUgVW5kZXJzY29yZSBvYmplY3QgZm9yICoqTm9kZS5qcyoqLCB3aXRoXG4gIC8vIGJhY2t3YXJkcy1jb21wYXRpYmlsaXR5IGZvciB0aGUgb2xkIGByZXF1aXJlKClgIEFQSS4gSWYgd2UncmUgaW5cbiAgLy8gdGhlIGJyb3dzZXIsIGFkZCBgX2AgYXMgYSBnbG9iYWwgb2JqZWN0IHZpYSBhIHN0cmluZyBpZGVudGlmaWVyLFxuICAvLyBmb3IgQ2xvc3VyZSBDb21waWxlciBcImFkdmFuY2VkXCIgbW9kZS5cbiAgaWYgKHR5cGVvZiBleHBvcnRzICE9PSAndW5kZWZpbmVkJykge1xuICAgIGlmICh0eXBlb2YgbW9kdWxlICE9PSAndW5kZWZpbmVkJyAmJiBtb2R1bGUuZXhwb3J0cykge1xuICAgICAgZXhwb3J0cyA9IG1vZHVsZS5leHBvcnRzID0gXztcbiAgICB9XG4gICAgZXhwb3J0cy5fID0gXztcbiAgfSBlbHNlIHtcbiAgICByb290Ll8gPSBfO1xuICB9XG5cbiAgLy8gQ3VycmVudCB2ZXJzaW9uLlxuICBfLlZFUlNJT04gPSAnMS42LjAnO1xuXG4gIC8vIENvbGxlY3Rpb24gRnVuY3Rpb25zXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgLy8gVGhlIGNvcm5lcnN0b25lLCBhbiBgZWFjaGAgaW1wbGVtZW50YXRpb24sIGFrYSBgZm9yRWFjaGAuXG4gIC8vIEhhbmRsZXMgb2JqZWN0cyB3aXRoIHRoZSBidWlsdC1pbiBgZm9yRWFjaGAsIGFycmF5cywgYW5kIHJhdyBvYmplY3RzLlxuICAvLyBEZWxlZ2F0ZXMgdG8gKipFQ01BU2NyaXB0IDUqKidzIG5hdGl2ZSBgZm9yRWFjaGAgaWYgYXZhaWxhYmxlLlxuICB2YXIgZWFjaCA9IF8uZWFjaCA9IF8uZm9yRWFjaCA9IGZ1bmN0aW9uKG9iaiwgaXRlcmF0b3IsIGNvbnRleHQpIHtcbiAgICBpZiAob2JqID09IG51bGwpIHJldHVybiBvYmo7XG4gICAgaWYgKG5hdGl2ZUZvckVhY2ggJiYgb2JqLmZvckVhY2ggPT09IG5hdGl2ZUZvckVhY2gpIHtcbiAgICAgIG9iai5mb3JFYWNoKGl0ZXJhdG9yLCBjb250ZXh0KTtcbiAgICB9IGVsc2UgaWYgKG9iai5sZW5ndGggPT09ICtvYmoubGVuZ3RoKSB7XG4gICAgICBmb3IgKHZhciBpID0gMCwgbGVuZ3RoID0gb2JqLmxlbmd0aDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGlmIChpdGVyYXRvci5jYWxsKGNvbnRleHQsIG9ialtpXSwgaSwgb2JqKSA9PT0gYnJlYWtlcikgcmV0dXJuO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICB2YXIga2V5cyA9IF8ua2V5cyhvYmopO1xuICAgICAgZm9yICh2YXIgaSA9IDAsIGxlbmd0aCA9IGtleXMubGVuZ3RoOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgICAgaWYgKGl0ZXJhdG9yLmNhbGwoY29udGV4dCwgb2JqW2tleXNbaV1dLCBrZXlzW2ldLCBvYmopID09PSBicmVha2VyKSByZXR1cm47XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBvYmo7XG4gIH07XG5cbiAgLy8gUmV0dXJuIHRoZSByZXN1bHRzIG9mIGFwcGx5aW5nIHRoZSBpdGVyYXRvciB0byBlYWNoIGVsZW1lbnQuXG4gIC8vIERlbGVnYXRlcyB0byAqKkVDTUFTY3JpcHQgNSoqJ3MgbmF0aXZlIGBtYXBgIGlmIGF2YWlsYWJsZS5cbiAgXy5tYXAgPSBfLmNvbGxlY3QgPSBmdW5jdGlvbihvYmosIGl0ZXJhdG9yLCBjb250ZXh0KSB7XG4gICAgdmFyIHJlc3VsdHMgPSBbXTtcbiAgICBpZiAob2JqID09IG51bGwpIHJldHVybiByZXN1bHRzO1xuICAgIGlmIChuYXRpdmVNYXAgJiYgb2JqLm1hcCA9PT0gbmF0aXZlTWFwKSByZXR1cm4gb2JqLm1hcChpdGVyYXRvciwgY29udGV4dCk7XG4gICAgZWFjaChvYmosIGZ1bmN0aW9uKHZhbHVlLCBpbmRleCwgbGlzdCkge1xuICAgICAgcmVzdWx0cy5wdXNoKGl0ZXJhdG9yLmNhbGwoY29udGV4dCwgdmFsdWUsIGluZGV4LCBsaXN0KSk7XG4gICAgfSk7XG4gICAgcmV0dXJuIHJlc3VsdHM7XG4gIH07XG5cbiAgdmFyIHJlZHVjZUVycm9yID0gJ1JlZHVjZSBvZiBlbXB0eSBhcnJheSB3aXRoIG5vIGluaXRpYWwgdmFsdWUnO1xuXG4gIC8vICoqUmVkdWNlKiogYnVpbGRzIHVwIGEgc2luZ2xlIHJlc3VsdCBmcm9tIGEgbGlzdCBvZiB2YWx1ZXMsIGFrYSBgaW5qZWN0YCxcbiAgLy8gb3IgYGZvbGRsYC4gRGVsZWdhdGVzIHRvICoqRUNNQVNjcmlwdCA1KioncyBuYXRpdmUgYHJlZHVjZWAgaWYgYXZhaWxhYmxlLlxuICBfLnJlZHVjZSA9IF8uZm9sZGwgPSBfLmluamVjdCA9IGZ1bmN0aW9uKG9iaiwgaXRlcmF0b3IsIG1lbW8sIGNvbnRleHQpIHtcbiAgICB2YXIgaW5pdGlhbCA9IGFyZ3VtZW50cy5sZW5ndGggPiAyO1xuICAgIGlmIChvYmogPT0gbnVsbCkgb2JqID0gW107XG4gICAgaWYgKG5hdGl2ZVJlZHVjZSAmJiBvYmoucmVkdWNlID09PSBuYXRpdmVSZWR1Y2UpIHtcbiAgICAgIGlmIChjb250ZXh0KSBpdGVyYXRvciA9IF8uYmluZChpdGVyYXRvciwgY29udGV4dCk7XG4gICAgICByZXR1cm4gaW5pdGlhbCA/IG9iai5yZWR1Y2UoaXRlcmF0b3IsIG1lbW8pIDogb2JqLnJlZHVjZShpdGVyYXRvcik7XG4gICAgfVxuICAgIGVhY2gob2JqLCBmdW5jdGlvbih2YWx1ZSwgaW5kZXgsIGxpc3QpIHtcbiAgICAgIGlmICghaW5pdGlhbCkge1xuICAgICAgICBtZW1vID0gdmFsdWU7XG4gICAgICAgIGluaXRpYWwgPSB0cnVlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbWVtbyA9IGl0ZXJhdG9yLmNhbGwoY29udGV4dCwgbWVtbywgdmFsdWUsIGluZGV4LCBsaXN0KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICBpZiAoIWluaXRpYWwpIHRocm93IG5ldyBUeXBlRXJyb3IocmVkdWNlRXJyb3IpO1xuICAgIHJldHVybiBtZW1vO1xuICB9O1xuXG4gIC8vIFRoZSByaWdodC1hc3NvY2lhdGl2ZSB2ZXJzaW9uIG9mIHJlZHVjZSwgYWxzbyBrbm93biBhcyBgZm9sZHJgLlxuICAvLyBEZWxlZ2F0ZXMgdG8gKipFQ01BU2NyaXB0IDUqKidzIG5hdGl2ZSBgcmVkdWNlUmlnaHRgIGlmIGF2YWlsYWJsZS5cbiAgXy5yZWR1Y2VSaWdodCA9IF8uZm9sZHIgPSBmdW5jdGlvbihvYmosIGl0ZXJhdG9yLCBtZW1vLCBjb250ZXh0KSB7XG4gICAgdmFyIGluaXRpYWwgPSBhcmd1bWVudHMubGVuZ3RoID4gMjtcbiAgICBpZiAob2JqID09IG51bGwpIG9iaiA9IFtdO1xuICAgIGlmIChuYXRpdmVSZWR1Y2VSaWdodCAmJiBvYmoucmVkdWNlUmlnaHQgPT09IG5hdGl2ZVJlZHVjZVJpZ2h0KSB7XG4gICAgICBpZiAoY29udGV4dCkgaXRlcmF0b3IgPSBfLmJpbmQoaXRlcmF0b3IsIGNvbnRleHQpO1xuICAgICAgcmV0dXJuIGluaXRpYWwgPyBvYmoucmVkdWNlUmlnaHQoaXRlcmF0b3IsIG1lbW8pIDogb2JqLnJlZHVjZVJpZ2h0KGl0ZXJhdG9yKTtcbiAgICB9XG4gICAgdmFyIGxlbmd0aCA9IG9iai5sZW5ndGg7XG4gICAgaWYgKGxlbmd0aCAhPT0gK2xlbmd0aCkge1xuICAgICAgdmFyIGtleXMgPSBfLmtleXMob2JqKTtcbiAgICAgIGxlbmd0aCA9IGtleXMubGVuZ3RoO1xuICAgIH1cbiAgICBlYWNoKG9iaiwgZnVuY3Rpb24odmFsdWUsIGluZGV4LCBsaXN0KSB7XG4gICAgICBpbmRleCA9IGtleXMgPyBrZXlzWy0tbGVuZ3RoXSA6IC0tbGVuZ3RoO1xuICAgICAgaWYgKCFpbml0aWFsKSB7XG4gICAgICAgIG1lbW8gPSBvYmpbaW5kZXhdO1xuICAgICAgICBpbml0aWFsID0gdHJ1ZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG1lbW8gPSBpdGVyYXRvci5jYWxsKGNvbnRleHQsIG1lbW8sIG9ialtpbmRleF0sIGluZGV4LCBsaXN0KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICBpZiAoIWluaXRpYWwpIHRocm93IG5ldyBUeXBlRXJyb3IocmVkdWNlRXJyb3IpO1xuICAgIHJldHVybiBtZW1vO1xuICB9O1xuXG4gIC8vIFJldHVybiB0aGUgZmlyc3QgdmFsdWUgd2hpY2ggcGFzc2VzIGEgdHJ1dGggdGVzdC4gQWxpYXNlZCBhcyBgZGV0ZWN0YC5cbiAgXy5maW5kID0gXy5kZXRlY3QgPSBmdW5jdGlvbihvYmosIHByZWRpY2F0ZSwgY29udGV4dCkge1xuICAgIHZhciByZXN1bHQ7XG4gICAgYW55KG9iaiwgZnVuY3Rpb24odmFsdWUsIGluZGV4LCBsaXN0KSB7XG4gICAgICBpZiAocHJlZGljYXRlLmNhbGwoY29udGV4dCwgdmFsdWUsIGluZGV4LCBsaXN0KSkge1xuICAgICAgICByZXN1bHQgPSB2YWx1ZTtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfTtcblxuICAvLyBSZXR1cm4gYWxsIHRoZSBlbGVtZW50cyB0aGF0IHBhc3MgYSB0cnV0aCB0ZXN0LlxuICAvLyBEZWxlZ2F0ZXMgdG8gKipFQ01BU2NyaXB0IDUqKidzIG5hdGl2ZSBgZmlsdGVyYCBpZiBhdmFpbGFibGUuXG4gIC8vIEFsaWFzZWQgYXMgYHNlbGVjdGAuXG4gIF8uZmlsdGVyID0gXy5zZWxlY3QgPSBmdW5jdGlvbihvYmosIHByZWRpY2F0ZSwgY29udGV4dCkge1xuICAgIHZhciByZXN1bHRzID0gW107XG4gICAgaWYgKG9iaiA9PSBudWxsKSByZXR1cm4gcmVzdWx0cztcbiAgICBpZiAobmF0aXZlRmlsdGVyICYmIG9iai5maWx0ZXIgPT09IG5hdGl2ZUZpbHRlcikgcmV0dXJuIG9iai5maWx0ZXIocHJlZGljYXRlLCBjb250ZXh0KTtcbiAgICBlYWNoKG9iaiwgZnVuY3Rpb24odmFsdWUsIGluZGV4LCBsaXN0KSB7XG4gICAgICBpZiAocHJlZGljYXRlLmNhbGwoY29udGV4dCwgdmFsdWUsIGluZGV4LCBsaXN0KSkgcmVzdWx0cy5wdXNoKHZhbHVlKTtcbiAgICB9KTtcbiAgICByZXR1cm4gcmVzdWx0cztcbiAgfTtcblxuICAvLyBSZXR1cm4gYWxsIHRoZSBlbGVtZW50cyBmb3Igd2hpY2ggYSB0cnV0aCB0ZXN0IGZhaWxzLlxuICBfLnJlamVjdCA9IGZ1bmN0aW9uKG9iaiwgcHJlZGljYXRlLCBjb250ZXh0KSB7XG4gICAgcmV0dXJuIF8uZmlsdGVyKG9iaiwgZnVuY3Rpb24odmFsdWUsIGluZGV4LCBsaXN0KSB7XG4gICAgICByZXR1cm4gIXByZWRpY2F0ZS5jYWxsKGNvbnRleHQsIHZhbHVlLCBpbmRleCwgbGlzdCk7XG4gICAgfSwgY29udGV4dCk7XG4gIH07XG5cbiAgLy8gRGV0ZXJtaW5lIHdoZXRoZXIgYWxsIG9mIHRoZSBlbGVtZW50cyBtYXRjaCBhIHRydXRoIHRlc3QuXG4gIC8vIERlbGVnYXRlcyB0byAqKkVDTUFTY3JpcHQgNSoqJ3MgbmF0aXZlIGBldmVyeWAgaWYgYXZhaWxhYmxlLlxuICAvLyBBbGlhc2VkIGFzIGBhbGxgLlxuICBfLmV2ZXJ5ID0gXy5hbGwgPSBmdW5jdGlvbihvYmosIHByZWRpY2F0ZSwgY29udGV4dCkge1xuICAgIHByZWRpY2F0ZSB8fCAocHJlZGljYXRlID0gXy5pZGVudGl0eSk7XG4gICAgdmFyIHJlc3VsdCA9IHRydWU7XG4gICAgaWYgKG9iaiA9PSBudWxsKSByZXR1cm4gcmVzdWx0O1xuICAgIGlmIChuYXRpdmVFdmVyeSAmJiBvYmouZXZlcnkgPT09IG5hdGl2ZUV2ZXJ5KSByZXR1cm4gb2JqLmV2ZXJ5KHByZWRpY2F0ZSwgY29udGV4dCk7XG4gICAgZWFjaChvYmosIGZ1bmN0aW9uKHZhbHVlLCBpbmRleCwgbGlzdCkge1xuICAgICAgaWYgKCEocmVzdWx0ID0gcmVzdWx0ICYmIHByZWRpY2F0ZS5jYWxsKGNvbnRleHQsIHZhbHVlLCBpbmRleCwgbGlzdCkpKSByZXR1cm4gYnJlYWtlcjtcbiAgICB9KTtcbiAgICByZXR1cm4gISFyZXN1bHQ7XG4gIH07XG5cbiAgLy8gRGV0ZXJtaW5lIGlmIGF0IGxlYXN0IG9uZSBlbGVtZW50IGluIHRoZSBvYmplY3QgbWF0Y2hlcyBhIHRydXRoIHRlc3QuXG4gIC8vIERlbGVnYXRlcyB0byAqKkVDTUFTY3JpcHQgNSoqJ3MgbmF0aXZlIGBzb21lYCBpZiBhdmFpbGFibGUuXG4gIC8vIEFsaWFzZWQgYXMgYGFueWAuXG4gIHZhciBhbnkgPSBfLnNvbWUgPSBfLmFueSA9IGZ1bmN0aW9uKG9iaiwgcHJlZGljYXRlLCBjb250ZXh0KSB7XG4gICAgcHJlZGljYXRlIHx8IChwcmVkaWNhdGUgPSBfLmlkZW50aXR5KTtcbiAgICB2YXIgcmVzdWx0ID0gZmFsc2U7XG4gICAgaWYgKG9iaiA9PSBudWxsKSByZXR1cm4gcmVzdWx0O1xuICAgIGlmIChuYXRpdmVTb21lICYmIG9iai5zb21lID09PSBuYXRpdmVTb21lKSByZXR1cm4gb2JqLnNvbWUocHJlZGljYXRlLCBjb250ZXh0KTtcbiAgICBlYWNoKG9iaiwgZnVuY3Rpb24odmFsdWUsIGluZGV4LCBsaXN0KSB7XG4gICAgICBpZiAocmVzdWx0IHx8IChyZXN1bHQgPSBwcmVkaWNhdGUuY2FsbChjb250ZXh0LCB2YWx1ZSwgaW5kZXgsIGxpc3QpKSkgcmV0dXJuIGJyZWFrZXI7XG4gICAgfSk7XG4gICAgcmV0dXJuICEhcmVzdWx0O1xuICB9O1xuXG4gIC8vIERldGVybWluZSBpZiB0aGUgYXJyYXkgb3Igb2JqZWN0IGNvbnRhaW5zIGEgZ2l2ZW4gdmFsdWUgKHVzaW5nIGA9PT1gKS5cbiAgLy8gQWxpYXNlZCBhcyBgaW5jbHVkZWAuXG4gIF8uY29udGFpbnMgPSBfLmluY2x1ZGUgPSBmdW5jdGlvbihvYmosIHRhcmdldCkge1xuICAgIGlmIChvYmogPT0gbnVsbCkgcmV0dXJuIGZhbHNlO1xuICAgIGlmIChuYXRpdmVJbmRleE9mICYmIG9iai5pbmRleE9mID09PSBuYXRpdmVJbmRleE9mKSByZXR1cm4gb2JqLmluZGV4T2YodGFyZ2V0KSAhPSAtMTtcbiAgICByZXR1cm4gYW55KG9iaiwgZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgIHJldHVybiB2YWx1ZSA9PT0gdGFyZ2V0O1xuICAgIH0pO1xuICB9O1xuXG4gIC8vIEludm9rZSBhIG1ldGhvZCAod2l0aCBhcmd1bWVudHMpIG9uIGV2ZXJ5IGl0ZW0gaW4gYSBjb2xsZWN0aW9uLlxuICBfLmludm9rZSA9IGZ1bmN0aW9uKG9iaiwgbWV0aG9kKSB7XG4gICAgdmFyIGFyZ3MgPSBzbGljZS5jYWxsKGFyZ3VtZW50cywgMik7XG4gICAgdmFyIGlzRnVuYyA9IF8uaXNGdW5jdGlvbihtZXRob2QpO1xuICAgIHJldHVybiBfLm1hcChvYmosIGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICByZXR1cm4gKGlzRnVuYyA/IG1ldGhvZCA6IHZhbHVlW21ldGhvZF0pLmFwcGx5KHZhbHVlLCBhcmdzKTtcbiAgICB9KTtcbiAgfTtcblxuICAvLyBDb252ZW5pZW5jZSB2ZXJzaW9uIG9mIGEgY29tbW9uIHVzZSBjYXNlIG9mIGBtYXBgOiBmZXRjaGluZyBhIHByb3BlcnR5LlxuICBfLnBsdWNrID0gZnVuY3Rpb24ob2JqLCBrZXkpIHtcbiAgICByZXR1cm4gXy5tYXAob2JqLCBfLnByb3BlcnR5KGtleSkpO1xuICB9O1xuXG4gIC8vIENvbnZlbmllbmNlIHZlcnNpb24gb2YgYSBjb21tb24gdXNlIGNhc2Ugb2YgYGZpbHRlcmA6IHNlbGVjdGluZyBvbmx5IG9iamVjdHNcbiAgLy8gY29udGFpbmluZyBzcGVjaWZpYyBga2V5OnZhbHVlYCBwYWlycy5cbiAgXy53aGVyZSA9IGZ1bmN0aW9uKG9iaiwgYXR0cnMpIHtcbiAgICByZXR1cm4gXy5maWx0ZXIob2JqLCBfLm1hdGNoZXMoYXR0cnMpKTtcbiAgfTtcblxuICAvLyBDb252ZW5pZW5jZSB2ZXJzaW9uIG9mIGEgY29tbW9uIHVzZSBjYXNlIG9mIGBmaW5kYDogZ2V0dGluZyB0aGUgZmlyc3Qgb2JqZWN0XG4gIC8vIGNvbnRhaW5pbmcgc3BlY2lmaWMgYGtleTp2YWx1ZWAgcGFpcnMuXG4gIF8uZmluZFdoZXJlID0gZnVuY3Rpb24ob2JqLCBhdHRycykge1xuICAgIHJldHVybiBfLmZpbmQob2JqLCBfLm1hdGNoZXMoYXR0cnMpKTtcbiAgfTtcblxuICAvLyBSZXR1cm4gdGhlIG1heGltdW0gZWxlbWVudCBvciAoZWxlbWVudC1iYXNlZCBjb21wdXRhdGlvbikuXG4gIC8vIENhbid0IG9wdGltaXplIGFycmF5cyBvZiBpbnRlZ2VycyBsb25nZXIgdGhhbiA2NSw1MzUgZWxlbWVudHMuXG4gIC8vIFNlZSBbV2ViS2l0IEJ1ZyA4MDc5N10oaHR0cHM6Ly9idWdzLndlYmtpdC5vcmcvc2hvd19idWcuY2dpP2lkPTgwNzk3KVxuICBfLm1heCA9IGZ1bmN0aW9uKG9iaiwgaXRlcmF0b3IsIGNvbnRleHQpIHtcbiAgICBpZiAoIWl0ZXJhdG9yICYmIF8uaXNBcnJheShvYmopICYmIG9ialswXSA9PT0gK29ialswXSAmJiBvYmoubGVuZ3RoIDwgNjU1MzUpIHtcbiAgICAgIHJldHVybiBNYXRoLm1heC5hcHBseShNYXRoLCBvYmopO1xuICAgIH1cbiAgICB2YXIgcmVzdWx0ID0gLUluZmluaXR5LCBsYXN0Q29tcHV0ZWQgPSAtSW5maW5pdHk7XG4gICAgZWFjaChvYmosIGZ1bmN0aW9uKHZhbHVlLCBpbmRleCwgbGlzdCkge1xuICAgICAgdmFyIGNvbXB1dGVkID0gaXRlcmF0b3IgPyBpdGVyYXRvci5jYWxsKGNvbnRleHQsIHZhbHVlLCBpbmRleCwgbGlzdCkgOiB2YWx1ZTtcbiAgICAgIGlmIChjb21wdXRlZCA+IGxhc3RDb21wdXRlZCkge1xuICAgICAgICByZXN1bHQgPSB2YWx1ZTtcbiAgICAgICAgbGFzdENvbXB1dGVkID0gY29tcHV0ZWQ7XG4gICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfTtcblxuICAvLyBSZXR1cm4gdGhlIG1pbmltdW0gZWxlbWVudCAob3IgZWxlbWVudC1iYXNlZCBjb21wdXRhdGlvbikuXG4gIF8ubWluID0gZnVuY3Rpb24ob2JqLCBpdGVyYXRvciwgY29udGV4dCkge1xuICAgIGlmICghaXRlcmF0b3IgJiYgXy5pc0FycmF5KG9iaikgJiYgb2JqWzBdID09PSArb2JqWzBdICYmIG9iai5sZW5ndGggPCA2NTUzNSkge1xuICAgICAgcmV0dXJuIE1hdGgubWluLmFwcGx5KE1hdGgsIG9iaik7XG4gICAgfVxuICAgIHZhciByZXN1bHQgPSBJbmZpbml0eSwgbGFzdENvbXB1dGVkID0gSW5maW5pdHk7XG4gICAgZWFjaChvYmosIGZ1bmN0aW9uKHZhbHVlLCBpbmRleCwgbGlzdCkge1xuICAgICAgdmFyIGNvbXB1dGVkID0gaXRlcmF0b3IgPyBpdGVyYXRvci5jYWxsKGNvbnRleHQsIHZhbHVlLCBpbmRleCwgbGlzdCkgOiB2YWx1ZTtcbiAgICAgIGlmIChjb21wdXRlZCA8IGxhc3RDb21wdXRlZCkge1xuICAgICAgICByZXN1bHQgPSB2YWx1ZTtcbiAgICAgICAgbGFzdENvbXB1dGVkID0gY29tcHV0ZWQ7XG4gICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfTtcblxuICAvLyBTaHVmZmxlIGFuIGFycmF5LCB1c2luZyB0aGUgbW9kZXJuIHZlcnNpb24gb2YgdGhlXG4gIC8vIFtGaXNoZXItWWF0ZXMgc2h1ZmZsZV0oaHR0cDovL2VuLndpa2lwZWRpYS5vcmcvd2lraS9GaXNoZXLigJNZYXRlc19zaHVmZmxlKS5cbiAgXy5zaHVmZmxlID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgdmFyIHJhbmQ7XG4gICAgdmFyIGluZGV4ID0gMDtcbiAgICB2YXIgc2h1ZmZsZWQgPSBbXTtcbiAgICBlYWNoKG9iaiwgZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgIHJhbmQgPSBfLnJhbmRvbShpbmRleCsrKTtcbiAgICAgIHNodWZmbGVkW2luZGV4IC0gMV0gPSBzaHVmZmxlZFtyYW5kXTtcbiAgICAgIHNodWZmbGVkW3JhbmRdID0gdmFsdWU7XG4gICAgfSk7XG4gICAgcmV0dXJuIHNodWZmbGVkO1xuICB9O1xuXG4gIC8vIFNhbXBsZSAqKm4qKiByYW5kb20gdmFsdWVzIGZyb20gYSBjb2xsZWN0aW9uLlxuICAvLyBJZiAqKm4qKiBpcyBub3Qgc3BlY2lmaWVkLCByZXR1cm5zIGEgc2luZ2xlIHJhbmRvbSBlbGVtZW50LlxuICAvLyBUaGUgaW50ZXJuYWwgYGd1YXJkYCBhcmd1bWVudCBhbGxvd3MgaXQgdG8gd29yayB3aXRoIGBtYXBgLlxuICBfLnNhbXBsZSA9IGZ1bmN0aW9uKG9iaiwgbiwgZ3VhcmQpIHtcbiAgICBpZiAobiA9PSBudWxsIHx8IGd1YXJkKSB7XG4gICAgICBpZiAob2JqLmxlbmd0aCAhPT0gK29iai5sZW5ndGgpIG9iaiA9IF8udmFsdWVzKG9iaik7XG4gICAgICByZXR1cm4gb2JqW18ucmFuZG9tKG9iai5sZW5ndGggLSAxKV07XG4gICAgfVxuICAgIHJldHVybiBfLnNodWZmbGUob2JqKS5zbGljZSgwLCBNYXRoLm1heCgwLCBuKSk7XG4gIH07XG5cbiAgLy8gQW4gaW50ZXJuYWwgZnVuY3Rpb24gdG8gZ2VuZXJhdGUgbG9va3VwIGl0ZXJhdG9ycy5cbiAgdmFyIGxvb2t1cEl0ZXJhdG9yID0gZnVuY3Rpb24odmFsdWUpIHtcbiAgICBpZiAodmFsdWUgPT0gbnVsbCkgcmV0dXJuIF8uaWRlbnRpdHk7XG4gICAgaWYgKF8uaXNGdW5jdGlvbih2YWx1ZSkpIHJldHVybiB2YWx1ZTtcbiAgICByZXR1cm4gXy5wcm9wZXJ0eSh2YWx1ZSk7XG4gIH07XG5cbiAgLy8gU29ydCB0aGUgb2JqZWN0J3MgdmFsdWVzIGJ5IGEgY3JpdGVyaW9uIHByb2R1Y2VkIGJ5IGFuIGl0ZXJhdG9yLlxuICBfLnNvcnRCeSA9IGZ1bmN0aW9uKG9iaiwgaXRlcmF0b3IsIGNvbnRleHQpIHtcbiAgICBpdGVyYXRvciA9IGxvb2t1cEl0ZXJhdG9yKGl0ZXJhdG9yKTtcbiAgICByZXR1cm4gXy5wbHVjayhfLm1hcChvYmosIGZ1bmN0aW9uKHZhbHVlLCBpbmRleCwgbGlzdCkge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgdmFsdWU6IHZhbHVlLFxuICAgICAgICBpbmRleDogaW5kZXgsXG4gICAgICAgIGNyaXRlcmlhOiBpdGVyYXRvci5jYWxsKGNvbnRleHQsIHZhbHVlLCBpbmRleCwgbGlzdClcbiAgICAgIH07XG4gICAgfSkuc29ydChmdW5jdGlvbihsZWZ0LCByaWdodCkge1xuICAgICAgdmFyIGEgPSBsZWZ0LmNyaXRlcmlhO1xuICAgICAgdmFyIGIgPSByaWdodC5jcml0ZXJpYTtcbiAgICAgIGlmIChhICE9PSBiKSB7XG4gICAgICAgIGlmIChhID4gYiB8fCBhID09PSB2b2lkIDApIHJldHVybiAxO1xuICAgICAgICBpZiAoYSA8IGIgfHwgYiA9PT0gdm9pZCAwKSByZXR1cm4gLTE7XG4gICAgICB9XG4gICAgICByZXR1cm4gbGVmdC5pbmRleCAtIHJpZ2h0LmluZGV4O1xuICAgIH0pLCAndmFsdWUnKTtcbiAgfTtcblxuICAvLyBBbiBpbnRlcm5hbCBmdW5jdGlvbiB1c2VkIGZvciBhZ2dyZWdhdGUgXCJncm91cCBieVwiIG9wZXJhdGlvbnMuXG4gIHZhciBncm91cCA9IGZ1bmN0aW9uKGJlaGF2aW9yKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKG9iaiwgaXRlcmF0b3IsIGNvbnRleHQpIHtcbiAgICAgIHZhciByZXN1bHQgPSB7fTtcbiAgICAgIGl0ZXJhdG9yID0gbG9va3VwSXRlcmF0b3IoaXRlcmF0b3IpO1xuICAgICAgZWFjaChvYmosIGZ1bmN0aW9uKHZhbHVlLCBpbmRleCkge1xuICAgICAgICB2YXIga2V5ID0gaXRlcmF0b3IuY2FsbChjb250ZXh0LCB2YWx1ZSwgaW5kZXgsIG9iaik7XG4gICAgICAgIGJlaGF2aW9yKHJlc3VsdCwga2V5LCB2YWx1ZSk7XG4gICAgICB9KTtcbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfTtcbiAgfTtcblxuICAvLyBHcm91cHMgdGhlIG9iamVjdCdzIHZhbHVlcyBieSBhIGNyaXRlcmlvbi4gUGFzcyBlaXRoZXIgYSBzdHJpbmcgYXR0cmlidXRlXG4gIC8vIHRvIGdyb3VwIGJ5LCBvciBhIGZ1bmN0aW9uIHRoYXQgcmV0dXJucyB0aGUgY3JpdGVyaW9uLlxuICBfLmdyb3VwQnkgPSBncm91cChmdW5jdGlvbihyZXN1bHQsIGtleSwgdmFsdWUpIHtcbiAgICBfLmhhcyhyZXN1bHQsIGtleSkgPyByZXN1bHRba2V5XS5wdXNoKHZhbHVlKSA6IHJlc3VsdFtrZXldID0gW3ZhbHVlXTtcbiAgfSk7XG5cbiAgLy8gSW5kZXhlcyB0aGUgb2JqZWN0J3MgdmFsdWVzIGJ5IGEgY3JpdGVyaW9uLCBzaW1pbGFyIHRvIGBncm91cEJ5YCwgYnV0IGZvclxuICAvLyB3aGVuIHlvdSBrbm93IHRoYXQgeW91ciBpbmRleCB2YWx1ZXMgd2lsbCBiZSB1bmlxdWUuXG4gIF8uaW5kZXhCeSA9IGdyb3VwKGZ1bmN0aW9uKHJlc3VsdCwga2V5LCB2YWx1ZSkge1xuICAgIHJlc3VsdFtrZXldID0gdmFsdWU7XG4gIH0pO1xuXG4gIC8vIENvdW50cyBpbnN0YW5jZXMgb2YgYW4gb2JqZWN0IHRoYXQgZ3JvdXAgYnkgYSBjZXJ0YWluIGNyaXRlcmlvbi4gUGFzc1xuICAvLyBlaXRoZXIgYSBzdHJpbmcgYXR0cmlidXRlIHRvIGNvdW50IGJ5LCBvciBhIGZ1bmN0aW9uIHRoYXQgcmV0dXJucyB0aGVcbiAgLy8gY3JpdGVyaW9uLlxuICBfLmNvdW50QnkgPSBncm91cChmdW5jdGlvbihyZXN1bHQsIGtleSkge1xuICAgIF8uaGFzKHJlc3VsdCwga2V5KSA/IHJlc3VsdFtrZXldKysgOiByZXN1bHRba2V5XSA9IDE7XG4gIH0pO1xuXG4gIC8vIFVzZSBhIGNvbXBhcmF0b3IgZnVuY3Rpb24gdG8gZmlndXJlIG91dCB0aGUgc21hbGxlc3QgaW5kZXggYXQgd2hpY2hcbiAgLy8gYW4gb2JqZWN0IHNob3VsZCBiZSBpbnNlcnRlZCBzbyBhcyB0byBtYWludGFpbiBvcmRlci4gVXNlcyBiaW5hcnkgc2VhcmNoLlxuICBfLnNvcnRlZEluZGV4ID0gZnVuY3Rpb24oYXJyYXksIG9iaiwgaXRlcmF0b3IsIGNvbnRleHQpIHtcbiAgICBpdGVyYXRvciA9IGxvb2t1cEl0ZXJhdG9yKGl0ZXJhdG9yKTtcbiAgICB2YXIgdmFsdWUgPSBpdGVyYXRvci5jYWxsKGNvbnRleHQsIG9iaik7XG4gICAgdmFyIGxvdyA9IDAsIGhpZ2ggPSBhcnJheS5sZW5ndGg7XG4gICAgd2hpbGUgKGxvdyA8IGhpZ2gpIHtcbiAgICAgIHZhciBtaWQgPSAobG93ICsgaGlnaCkgPj4+IDE7XG4gICAgICBpdGVyYXRvci5jYWxsKGNvbnRleHQsIGFycmF5W21pZF0pIDwgdmFsdWUgPyBsb3cgPSBtaWQgKyAxIDogaGlnaCA9IG1pZDtcbiAgICB9XG4gICAgcmV0dXJuIGxvdztcbiAgfTtcblxuICAvLyBTYWZlbHkgY3JlYXRlIGEgcmVhbCwgbGl2ZSBhcnJheSBmcm9tIGFueXRoaW5nIGl0ZXJhYmxlLlxuICBfLnRvQXJyYXkgPSBmdW5jdGlvbihvYmopIHtcbiAgICBpZiAoIW9iaikgcmV0dXJuIFtdO1xuICAgIGlmIChfLmlzQXJyYXkob2JqKSkgcmV0dXJuIHNsaWNlLmNhbGwob2JqKTtcbiAgICBpZiAob2JqLmxlbmd0aCA9PT0gK29iai5sZW5ndGgpIHJldHVybiBfLm1hcChvYmosIF8uaWRlbnRpdHkpO1xuICAgIHJldHVybiBfLnZhbHVlcyhvYmopO1xuICB9O1xuXG4gIC8vIFJldHVybiB0aGUgbnVtYmVyIG9mIGVsZW1lbnRzIGluIGFuIG9iamVjdC5cbiAgXy5zaXplID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgaWYgKG9iaiA9PSBudWxsKSByZXR1cm4gMDtcbiAgICByZXR1cm4gKG9iai5sZW5ndGggPT09ICtvYmoubGVuZ3RoKSA/IG9iai5sZW5ndGggOiBfLmtleXMob2JqKS5sZW5ndGg7XG4gIH07XG5cbiAgLy8gQXJyYXkgRnVuY3Rpb25zXG4gIC8vIC0tLS0tLS0tLS0tLS0tLVxuXG4gIC8vIEdldCB0aGUgZmlyc3QgZWxlbWVudCBvZiBhbiBhcnJheS4gUGFzc2luZyAqKm4qKiB3aWxsIHJldHVybiB0aGUgZmlyc3QgTlxuICAvLyB2YWx1ZXMgaW4gdGhlIGFycmF5LiBBbGlhc2VkIGFzIGBoZWFkYCBhbmQgYHRha2VgLiBUaGUgKipndWFyZCoqIGNoZWNrXG4gIC8vIGFsbG93cyBpdCB0byB3b3JrIHdpdGggYF8ubWFwYC5cbiAgXy5maXJzdCA9IF8uaGVhZCA9IF8udGFrZSA9IGZ1bmN0aW9uKGFycmF5LCBuLCBndWFyZCkge1xuICAgIGlmIChhcnJheSA9PSBudWxsKSByZXR1cm4gdm9pZCAwO1xuICAgIGlmICgobiA9PSBudWxsKSB8fCBndWFyZCkgcmV0dXJuIGFycmF5WzBdO1xuICAgIGlmIChuIDwgMCkgcmV0dXJuIFtdO1xuICAgIHJldHVybiBzbGljZS5jYWxsKGFycmF5LCAwLCBuKTtcbiAgfTtcblxuICAvLyBSZXR1cm5zIGV2ZXJ5dGhpbmcgYnV0IHRoZSBsYXN0IGVudHJ5IG9mIHRoZSBhcnJheS4gRXNwZWNpYWxseSB1c2VmdWwgb25cbiAgLy8gdGhlIGFyZ3VtZW50cyBvYmplY3QuIFBhc3NpbmcgKipuKiogd2lsbCByZXR1cm4gYWxsIHRoZSB2YWx1ZXMgaW5cbiAgLy8gdGhlIGFycmF5LCBleGNsdWRpbmcgdGhlIGxhc3QgTi4gVGhlICoqZ3VhcmQqKiBjaGVjayBhbGxvd3MgaXQgdG8gd29yayB3aXRoXG4gIC8vIGBfLm1hcGAuXG4gIF8uaW5pdGlhbCA9IGZ1bmN0aW9uKGFycmF5LCBuLCBndWFyZCkge1xuICAgIHJldHVybiBzbGljZS5jYWxsKGFycmF5LCAwLCBhcnJheS5sZW5ndGggLSAoKG4gPT0gbnVsbCkgfHwgZ3VhcmQgPyAxIDogbikpO1xuICB9O1xuXG4gIC8vIEdldCB0aGUgbGFzdCBlbGVtZW50IG9mIGFuIGFycmF5LiBQYXNzaW5nICoqbioqIHdpbGwgcmV0dXJuIHRoZSBsYXN0IE5cbiAgLy8gdmFsdWVzIGluIHRoZSBhcnJheS4gVGhlICoqZ3VhcmQqKiBjaGVjayBhbGxvd3MgaXQgdG8gd29yayB3aXRoIGBfLm1hcGAuXG4gIF8ubGFzdCA9IGZ1bmN0aW9uKGFycmF5LCBuLCBndWFyZCkge1xuICAgIGlmIChhcnJheSA9PSBudWxsKSByZXR1cm4gdm9pZCAwO1xuICAgIGlmICgobiA9PSBudWxsKSB8fCBndWFyZCkgcmV0dXJuIGFycmF5W2FycmF5Lmxlbmd0aCAtIDFdO1xuICAgIHJldHVybiBzbGljZS5jYWxsKGFycmF5LCBNYXRoLm1heChhcnJheS5sZW5ndGggLSBuLCAwKSk7XG4gIH07XG5cbiAgLy8gUmV0dXJucyBldmVyeXRoaW5nIGJ1dCB0aGUgZmlyc3QgZW50cnkgb2YgdGhlIGFycmF5LiBBbGlhc2VkIGFzIGB0YWlsYCBhbmQgYGRyb3BgLlxuICAvLyBFc3BlY2lhbGx5IHVzZWZ1bCBvbiB0aGUgYXJndW1lbnRzIG9iamVjdC4gUGFzc2luZyBhbiAqKm4qKiB3aWxsIHJldHVyblxuICAvLyB0aGUgcmVzdCBOIHZhbHVlcyBpbiB0aGUgYXJyYXkuIFRoZSAqKmd1YXJkKipcbiAgLy8gY2hlY2sgYWxsb3dzIGl0IHRvIHdvcmsgd2l0aCBgXy5tYXBgLlxuICBfLnJlc3QgPSBfLnRhaWwgPSBfLmRyb3AgPSBmdW5jdGlvbihhcnJheSwgbiwgZ3VhcmQpIHtcbiAgICByZXR1cm4gc2xpY2UuY2FsbChhcnJheSwgKG4gPT0gbnVsbCkgfHwgZ3VhcmQgPyAxIDogbik7XG4gIH07XG5cbiAgLy8gVHJpbSBvdXQgYWxsIGZhbHN5IHZhbHVlcyBmcm9tIGFuIGFycmF5LlxuICBfLmNvbXBhY3QgPSBmdW5jdGlvbihhcnJheSkge1xuICAgIHJldHVybiBfLmZpbHRlcihhcnJheSwgXy5pZGVudGl0eSk7XG4gIH07XG5cbiAgLy8gSW50ZXJuYWwgaW1wbGVtZW50YXRpb24gb2YgYSByZWN1cnNpdmUgYGZsYXR0ZW5gIGZ1bmN0aW9uLlxuICB2YXIgZmxhdHRlbiA9IGZ1bmN0aW9uKGlucHV0LCBzaGFsbG93LCBvdXRwdXQpIHtcbiAgICBpZiAoc2hhbGxvdyAmJiBfLmV2ZXJ5KGlucHV0LCBfLmlzQXJyYXkpKSB7XG4gICAgICByZXR1cm4gY29uY2F0LmFwcGx5KG91dHB1dCwgaW5wdXQpO1xuICAgIH1cbiAgICBlYWNoKGlucHV0LCBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgaWYgKF8uaXNBcnJheSh2YWx1ZSkgfHwgXy5pc0FyZ3VtZW50cyh2YWx1ZSkpIHtcbiAgICAgICAgc2hhbGxvdyA/IHB1c2guYXBwbHkob3V0cHV0LCB2YWx1ZSkgOiBmbGF0dGVuKHZhbHVlLCBzaGFsbG93LCBvdXRwdXQpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgb3V0cHV0LnB1c2godmFsdWUpO1xuICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiBvdXRwdXQ7XG4gIH07XG5cbiAgLy8gRmxhdHRlbiBvdXQgYW4gYXJyYXksIGVpdGhlciByZWN1cnNpdmVseSAoYnkgZGVmYXVsdCksIG9yIGp1c3Qgb25lIGxldmVsLlxuICBfLmZsYXR0ZW4gPSBmdW5jdGlvbihhcnJheSwgc2hhbGxvdykge1xuICAgIHJldHVybiBmbGF0dGVuKGFycmF5LCBzaGFsbG93LCBbXSk7XG4gIH07XG5cbiAgLy8gUmV0dXJuIGEgdmVyc2lvbiBvZiB0aGUgYXJyYXkgdGhhdCBkb2VzIG5vdCBjb250YWluIHRoZSBzcGVjaWZpZWQgdmFsdWUocykuXG4gIF8ud2l0aG91dCA9IGZ1bmN0aW9uKGFycmF5KSB7XG4gICAgcmV0dXJuIF8uZGlmZmVyZW5jZShhcnJheSwgc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpKTtcbiAgfTtcblxuICAvLyBTcGxpdCBhbiBhcnJheSBpbnRvIHR3byBhcnJheXM6IG9uZSB3aG9zZSBlbGVtZW50cyBhbGwgc2F0aXNmeSB0aGUgZ2l2ZW5cbiAgLy8gcHJlZGljYXRlLCBhbmQgb25lIHdob3NlIGVsZW1lbnRzIGFsbCBkbyBub3Qgc2F0aXNmeSB0aGUgcHJlZGljYXRlLlxuICBfLnBhcnRpdGlvbiA9IGZ1bmN0aW9uKGFycmF5LCBwcmVkaWNhdGUpIHtcbiAgICB2YXIgcGFzcyA9IFtdLCBmYWlsID0gW107XG4gICAgZWFjaChhcnJheSwgZnVuY3Rpb24oZWxlbSkge1xuICAgICAgKHByZWRpY2F0ZShlbGVtKSA/IHBhc3MgOiBmYWlsKS5wdXNoKGVsZW0pO1xuICAgIH0pO1xuICAgIHJldHVybiBbcGFzcywgZmFpbF07XG4gIH07XG5cbiAgLy8gUHJvZHVjZSBhIGR1cGxpY2F0ZS1mcmVlIHZlcnNpb24gb2YgdGhlIGFycmF5LiBJZiB0aGUgYXJyYXkgaGFzIGFscmVhZHlcbiAgLy8gYmVlbiBzb3J0ZWQsIHlvdSBoYXZlIHRoZSBvcHRpb24gb2YgdXNpbmcgYSBmYXN0ZXIgYWxnb3JpdGhtLlxuICAvLyBBbGlhc2VkIGFzIGB1bmlxdWVgLlxuICBfLnVuaXEgPSBfLnVuaXF1ZSA9IGZ1bmN0aW9uKGFycmF5LCBpc1NvcnRlZCwgaXRlcmF0b3IsIGNvbnRleHQpIHtcbiAgICBpZiAoXy5pc0Z1bmN0aW9uKGlzU29ydGVkKSkge1xuICAgICAgY29udGV4dCA9IGl0ZXJhdG9yO1xuICAgICAgaXRlcmF0b3IgPSBpc1NvcnRlZDtcbiAgICAgIGlzU29ydGVkID0gZmFsc2U7XG4gICAgfVxuICAgIHZhciBpbml0aWFsID0gaXRlcmF0b3IgPyBfLm1hcChhcnJheSwgaXRlcmF0b3IsIGNvbnRleHQpIDogYXJyYXk7XG4gICAgdmFyIHJlc3VsdHMgPSBbXTtcbiAgICB2YXIgc2VlbiA9IFtdO1xuICAgIGVhY2goaW5pdGlhbCwgZnVuY3Rpb24odmFsdWUsIGluZGV4KSB7XG4gICAgICBpZiAoaXNTb3J0ZWQgPyAoIWluZGV4IHx8IHNlZW5bc2Vlbi5sZW5ndGggLSAxXSAhPT0gdmFsdWUpIDogIV8uY29udGFpbnMoc2VlbiwgdmFsdWUpKSB7XG4gICAgICAgIHNlZW4ucHVzaCh2YWx1ZSk7XG4gICAgICAgIHJlc3VsdHMucHVzaChhcnJheVtpbmRleF0pO1xuICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiByZXN1bHRzO1xuICB9O1xuXG4gIC8vIFByb2R1Y2UgYW4gYXJyYXkgdGhhdCBjb250YWlucyB0aGUgdW5pb246IGVhY2ggZGlzdGluY3QgZWxlbWVudCBmcm9tIGFsbCBvZlxuICAvLyB0aGUgcGFzc2VkLWluIGFycmF5cy5cbiAgXy51bmlvbiA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBfLnVuaXEoXy5mbGF0dGVuKGFyZ3VtZW50cywgdHJ1ZSkpO1xuICB9O1xuXG4gIC8vIFByb2R1Y2UgYW4gYXJyYXkgdGhhdCBjb250YWlucyBldmVyeSBpdGVtIHNoYXJlZCBiZXR3ZWVuIGFsbCB0aGVcbiAgLy8gcGFzc2VkLWluIGFycmF5cy5cbiAgXy5pbnRlcnNlY3Rpb24gPSBmdW5jdGlvbihhcnJheSkge1xuICAgIHZhciByZXN0ID0gc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpO1xuICAgIHJldHVybiBfLmZpbHRlcihfLnVuaXEoYXJyYXkpLCBmdW5jdGlvbihpdGVtKSB7XG4gICAgICByZXR1cm4gXy5ldmVyeShyZXN0LCBmdW5jdGlvbihvdGhlcikge1xuICAgICAgICByZXR1cm4gXy5jb250YWlucyhvdGhlciwgaXRlbSk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfTtcblxuICAvLyBUYWtlIHRoZSBkaWZmZXJlbmNlIGJldHdlZW4gb25lIGFycmF5IGFuZCBhIG51bWJlciBvZiBvdGhlciBhcnJheXMuXG4gIC8vIE9ubHkgdGhlIGVsZW1lbnRzIHByZXNlbnQgaW4ganVzdCB0aGUgZmlyc3QgYXJyYXkgd2lsbCByZW1haW4uXG4gIF8uZGlmZmVyZW5jZSA9IGZ1bmN0aW9uKGFycmF5KSB7XG4gICAgdmFyIHJlc3QgPSBjb25jYXQuYXBwbHkoQXJyYXlQcm90bywgc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpKTtcbiAgICByZXR1cm4gXy5maWx0ZXIoYXJyYXksIGZ1bmN0aW9uKHZhbHVlKXsgcmV0dXJuICFfLmNvbnRhaW5zKHJlc3QsIHZhbHVlKTsgfSk7XG4gIH07XG5cbiAgLy8gWmlwIHRvZ2V0aGVyIG11bHRpcGxlIGxpc3RzIGludG8gYSBzaW5nbGUgYXJyYXkgLS0gZWxlbWVudHMgdGhhdCBzaGFyZVxuICAvLyBhbiBpbmRleCBnbyB0b2dldGhlci5cbiAgXy56aXAgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgbGVuZ3RoID0gXy5tYXgoXy5wbHVjayhhcmd1bWVudHMsICdsZW5ndGgnKS5jb25jYXQoMCkpO1xuICAgIHZhciByZXN1bHRzID0gbmV3IEFycmF5KGxlbmd0aCk7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgcmVzdWx0c1tpXSA9IF8ucGx1Y2soYXJndW1lbnRzLCAnJyArIGkpO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0cztcbiAgfTtcblxuICAvLyBDb252ZXJ0cyBsaXN0cyBpbnRvIG9iamVjdHMuIFBhc3MgZWl0aGVyIGEgc2luZ2xlIGFycmF5IG9mIGBba2V5LCB2YWx1ZV1gXG4gIC8vIHBhaXJzLCBvciB0d28gcGFyYWxsZWwgYXJyYXlzIG9mIHRoZSBzYW1lIGxlbmd0aCAtLSBvbmUgb2Yga2V5cywgYW5kIG9uZSBvZlxuICAvLyB0aGUgY29ycmVzcG9uZGluZyB2YWx1ZXMuXG4gIF8ub2JqZWN0ID0gZnVuY3Rpb24obGlzdCwgdmFsdWVzKSB7XG4gICAgaWYgKGxpc3QgPT0gbnVsbCkgcmV0dXJuIHt9O1xuICAgIHZhciByZXN1bHQgPSB7fTtcbiAgICBmb3IgKHZhciBpID0gMCwgbGVuZ3RoID0gbGlzdC5sZW5ndGg7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgaWYgKHZhbHVlcykge1xuICAgICAgICByZXN1bHRbbGlzdFtpXV0gPSB2YWx1ZXNbaV07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXN1bHRbbGlzdFtpXVswXV0gPSBsaXN0W2ldWzFdO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9O1xuXG4gIC8vIElmIHRoZSBicm93c2VyIGRvZXNuJ3Qgc3VwcGx5IHVzIHdpdGggaW5kZXhPZiAoSSdtIGxvb2tpbmcgYXQgeW91LCAqKk1TSUUqKiksXG4gIC8vIHdlIG5lZWQgdGhpcyBmdW5jdGlvbi4gUmV0dXJuIHRoZSBwb3NpdGlvbiBvZiB0aGUgZmlyc3Qgb2NjdXJyZW5jZSBvZiBhblxuICAvLyBpdGVtIGluIGFuIGFycmF5LCBvciAtMSBpZiB0aGUgaXRlbSBpcyBub3QgaW5jbHVkZWQgaW4gdGhlIGFycmF5LlxuICAvLyBEZWxlZ2F0ZXMgdG8gKipFQ01BU2NyaXB0IDUqKidzIG5hdGl2ZSBgaW5kZXhPZmAgaWYgYXZhaWxhYmxlLlxuICAvLyBJZiB0aGUgYXJyYXkgaXMgbGFyZ2UgYW5kIGFscmVhZHkgaW4gc29ydCBvcmRlciwgcGFzcyBgdHJ1ZWBcbiAgLy8gZm9yICoqaXNTb3J0ZWQqKiB0byB1c2UgYmluYXJ5IHNlYXJjaC5cbiAgXy5pbmRleE9mID0gZnVuY3Rpb24oYXJyYXksIGl0ZW0sIGlzU29ydGVkKSB7XG4gICAgaWYgKGFycmF5ID09IG51bGwpIHJldHVybiAtMTtcbiAgICB2YXIgaSA9IDAsIGxlbmd0aCA9IGFycmF5Lmxlbmd0aDtcbiAgICBpZiAoaXNTb3J0ZWQpIHtcbiAgICAgIGlmICh0eXBlb2YgaXNTb3J0ZWQgPT0gJ251bWJlcicpIHtcbiAgICAgICAgaSA9IChpc1NvcnRlZCA8IDAgPyBNYXRoLm1heCgwLCBsZW5ndGggKyBpc1NvcnRlZCkgOiBpc1NvcnRlZCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpID0gXy5zb3J0ZWRJbmRleChhcnJheSwgaXRlbSk7XG4gICAgICAgIHJldHVybiBhcnJheVtpXSA9PT0gaXRlbSA/IGkgOiAtMTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKG5hdGl2ZUluZGV4T2YgJiYgYXJyYXkuaW5kZXhPZiA9PT0gbmF0aXZlSW5kZXhPZikgcmV0dXJuIGFycmF5LmluZGV4T2YoaXRlbSwgaXNTb3J0ZWQpO1xuICAgIGZvciAoOyBpIDwgbGVuZ3RoOyBpKyspIGlmIChhcnJheVtpXSA9PT0gaXRlbSkgcmV0dXJuIGk7XG4gICAgcmV0dXJuIC0xO1xuICB9O1xuXG4gIC8vIERlbGVnYXRlcyB0byAqKkVDTUFTY3JpcHQgNSoqJ3MgbmF0aXZlIGBsYXN0SW5kZXhPZmAgaWYgYXZhaWxhYmxlLlxuICBfLmxhc3RJbmRleE9mID0gZnVuY3Rpb24oYXJyYXksIGl0ZW0sIGZyb20pIHtcbiAgICBpZiAoYXJyYXkgPT0gbnVsbCkgcmV0dXJuIC0xO1xuICAgIHZhciBoYXNJbmRleCA9IGZyb20gIT0gbnVsbDtcbiAgICBpZiAobmF0aXZlTGFzdEluZGV4T2YgJiYgYXJyYXkubGFzdEluZGV4T2YgPT09IG5hdGl2ZUxhc3RJbmRleE9mKSB7XG4gICAgICByZXR1cm4gaGFzSW5kZXggPyBhcnJheS5sYXN0SW5kZXhPZihpdGVtLCBmcm9tKSA6IGFycmF5Lmxhc3RJbmRleE9mKGl0ZW0pO1xuICAgIH1cbiAgICB2YXIgaSA9IChoYXNJbmRleCA/IGZyb20gOiBhcnJheS5sZW5ndGgpO1xuICAgIHdoaWxlIChpLS0pIGlmIChhcnJheVtpXSA9PT0gaXRlbSkgcmV0dXJuIGk7XG4gICAgcmV0dXJuIC0xO1xuICB9O1xuXG4gIC8vIEdlbmVyYXRlIGFuIGludGVnZXIgQXJyYXkgY29udGFpbmluZyBhbiBhcml0aG1ldGljIHByb2dyZXNzaW9uLiBBIHBvcnQgb2ZcbiAgLy8gdGhlIG5hdGl2ZSBQeXRob24gYHJhbmdlKClgIGZ1bmN0aW9uLiBTZWVcbiAgLy8gW3RoZSBQeXRob24gZG9jdW1lbnRhdGlvbl0oaHR0cDovL2RvY3MucHl0aG9uLm9yZy9saWJyYXJ5L2Z1bmN0aW9ucy5odG1sI3JhbmdlKS5cbiAgXy5yYW5nZSA9IGZ1bmN0aW9uKHN0YXJ0LCBzdG9wLCBzdGVwKSB7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPD0gMSkge1xuICAgICAgc3RvcCA9IHN0YXJ0IHx8IDA7XG4gICAgICBzdGFydCA9IDA7XG4gICAgfVxuICAgIHN0ZXAgPSBhcmd1bWVudHNbMl0gfHwgMTtcblxuICAgIHZhciBsZW5ndGggPSBNYXRoLm1heChNYXRoLmNlaWwoKHN0b3AgLSBzdGFydCkgLyBzdGVwKSwgMCk7XG4gICAgdmFyIGlkeCA9IDA7XG4gICAgdmFyIHJhbmdlID0gbmV3IEFycmF5KGxlbmd0aCk7XG5cbiAgICB3aGlsZShpZHggPCBsZW5ndGgpIHtcbiAgICAgIHJhbmdlW2lkeCsrXSA9IHN0YXJ0O1xuICAgICAgc3RhcnQgKz0gc3RlcDtcbiAgICB9XG5cbiAgICByZXR1cm4gcmFuZ2U7XG4gIH07XG5cbiAgLy8gRnVuY3Rpb24gKGFoZW0pIEZ1bmN0aW9uc1xuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS1cblxuICAvLyBSZXVzYWJsZSBjb25zdHJ1Y3RvciBmdW5jdGlvbiBmb3IgcHJvdG90eXBlIHNldHRpbmcuXG4gIHZhciBjdG9yID0gZnVuY3Rpb24oKXt9O1xuXG4gIC8vIENyZWF0ZSBhIGZ1bmN0aW9uIGJvdW5kIHRvIGEgZ2l2ZW4gb2JqZWN0IChhc3NpZ25pbmcgYHRoaXNgLCBhbmQgYXJndW1lbnRzLFxuICAvLyBvcHRpb25hbGx5KS4gRGVsZWdhdGVzIHRvICoqRUNNQVNjcmlwdCA1KioncyBuYXRpdmUgYEZ1bmN0aW9uLmJpbmRgIGlmXG4gIC8vIGF2YWlsYWJsZS5cbiAgXy5iaW5kID0gZnVuY3Rpb24oZnVuYywgY29udGV4dCkge1xuICAgIHZhciBhcmdzLCBib3VuZDtcbiAgICBpZiAobmF0aXZlQmluZCAmJiBmdW5jLmJpbmQgPT09IG5hdGl2ZUJpbmQpIHJldHVybiBuYXRpdmVCaW5kLmFwcGx5KGZ1bmMsIHNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKSk7XG4gICAgaWYgKCFfLmlzRnVuY3Rpb24oZnVuYykpIHRocm93IG5ldyBUeXBlRXJyb3I7XG4gICAgYXJncyA9IHNsaWNlLmNhbGwoYXJndW1lbnRzLCAyKTtcbiAgICByZXR1cm4gYm91bmQgPSBmdW5jdGlvbigpIHtcbiAgICAgIGlmICghKHRoaXMgaW5zdGFuY2VvZiBib3VuZCkpIHJldHVybiBmdW5jLmFwcGx5KGNvbnRleHQsIGFyZ3MuY29uY2F0KHNsaWNlLmNhbGwoYXJndW1lbnRzKSkpO1xuICAgICAgY3Rvci5wcm90b3R5cGUgPSBmdW5jLnByb3RvdHlwZTtcbiAgICAgIHZhciBzZWxmID0gbmV3IGN0b3I7XG4gICAgICBjdG9yLnByb3RvdHlwZSA9IG51bGw7XG4gICAgICB2YXIgcmVzdWx0ID0gZnVuYy5hcHBseShzZWxmLCBhcmdzLmNvbmNhdChzbGljZS5jYWxsKGFyZ3VtZW50cykpKTtcbiAgICAgIGlmIChPYmplY3QocmVzdWx0KSA9PT0gcmVzdWx0KSByZXR1cm4gcmVzdWx0O1xuICAgICAgcmV0dXJuIHNlbGY7XG4gICAgfTtcbiAgfTtcblxuICAvLyBQYXJ0aWFsbHkgYXBwbHkgYSBmdW5jdGlvbiBieSBjcmVhdGluZyBhIHZlcnNpb24gdGhhdCBoYXMgaGFkIHNvbWUgb2YgaXRzXG4gIC8vIGFyZ3VtZW50cyBwcmUtZmlsbGVkLCB3aXRob3V0IGNoYW5naW5nIGl0cyBkeW5hbWljIGB0aGlzYCBjb250ZXh0LiBfIGFjdHNcbiAgLy8gYXMgYSBwbGFjZWhvbGRlciwgYWxsb3dpbmcgYW55IGNvbWJpbmF0aW9uIG9mIGFyZ3VtZW50cyB0byBiZSBwcmUtZmlsbGVkLlxuICBfLnBhcnRpYWwgPSBmdW5jdGlvbihmdW5jKSB7XG4gICAgdmFyIGJvdW5kQXJncyA9IHNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKTtcbiAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgcG9zaXRpb24gPSAwO1xuICAgICAgdmFyIGFyZ3MgPSBib3VuZEFyZ3Muc2xpY2UoKTtcbiAgICAgIGZvciAodmFyIGkgPSAwLCBsZW5ndGggPSBhcmdzLmxlbmd0aDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGlmIChhcmdzW2ldID09PSBfKSBhcmdzW2ldID0gYXJndW1lbnRzW3Bvc2l0aW9uKytdO1xuICAgICAgfVxuICAgICAgd2hpbGUgKHBvc2l0aW9uIDwgYXJndW1lbnRzLmxlbmd0aCkgYXJncy5wdXNoKGFyZ3VtZW50c1twb3NpdGlvbisrXSk7XG4gICAgICByZXR1cm4gZnVuYy5hcHBseSh0aGlzLCBhcmdzKTtcbiAgICB9O1xuICB9O1xuXG4gIC8vIEJpbmQgYSBudW1iZXIgb2YgYW4gb2JqZWN0J3MgbWV0aG9kcyB0byB0aGF0IG9iamVjdC4gUmVtYWluaW5nIGFyZ3VtZW50c1xuICAvLyBhcmUgdGhlIG1ldGhvZCBuYW1lcyB0byBiZSBib3VuZC4gVXNlZnVsIGZvciBlbnN1cmluZyB0aGF0IGFsbCBjYWxsYmFja3NcbiAgLy8gZGVmaW5lZCBvbiBhbiBvYmplY3QgYmVsb25nIHRvIGl0LlxuICBfLmJpbmRBbGwgPSBmdW5jdGlvbihvYmopIHtcbiAgICB2YXIgZnVuY3MgPSBzbGljZS5jYWxsKGFyZ3VtZW50cywgMSk7XG4gICAgaWYgKGZ1bmNzLmxlbmd0aCA9PT0gMCkgdGhyb3cgbmV3IEVycm9yKCdiaW5kQWxsIG11c3QgYmUgcGFzc2VkIGZ1bmN0aW9uIG5hbWVzJyk7XG4gICAgZWFjaChmdW5jcywgZnVuY3Rpb24oZikgeyBvYmpbZl0gPSBfLmJpbmQob2JqW2ZdLCBvYmopOyB9KTtcbiAgICByZXR1cm4gb2JqO1xuICB9O1xuXG4gIC8vIE1lbW9pemUgYW4gZXhwZW5zaXZlIGZ1bmN0aW9uIGJ5IHN0b3JpbmcgaXRzIHJlc3VsdHMuXG4gIF8ubWVtb2l6ZSA9IGZ1bmN0aW9uKGZ1bmMsIGhhc2hlcikge1xuICAgIHZhciBtZW1vID0ge307XG4gICAgaGFzaGVyIHx8IChoYXNoZXIgPSBfLmlkZW50aXR5KTtcbiAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICB2YXIga2V5ID0gaGFzaGVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICByZXR1cm4gXy5oYXMobWVtbywga2V5KSA/IG1lbW9ba2V5XSA6IChtZW1vW2tleV0gPSBmdW5jLmFwcGx5KHRoaXMsIGFyZ3VtZW50cykpO1xuICAgIH07XG4gIH07XG5cbiAgLy8gRGVsYXlzIGEgZnVuY3Rpb24gZm9yIHRoZSBnaXZlbiBudW1iZXIgb2YgbWlsbGlzZWNvbmRzLCBhbmQgdGhlbiBjYWxsc1xuICAvLyBpdCB3aXRoIHRoZSBhcmd1bWVudHMgc3VwcGxpZWQuXG4gIF8uZGVsYXkgPSBmdW5jdGlvbihmdW5jLCB3YWl0KSB7XG4gICAgdmFyIGFyZ3MgPSBzbGljZS5jYWxsKGFyZ3VtZW50cywgMik7XG4gICAgcmV0dXJuIHNldFRpbWVvdXQoZnVuY3Rpb24oKXsgcmV0dXJuIGZ1bmMuYXBwbHkobnVsbCwgYXJncyk7IH0sIHdhaXQpO1xuICB9O1xuXG4gIC8vIERlZmVycyBhIGZ1bmN0aW9uLCBzY2hlZHVsaW5nIGl0IHRvIHJ1biBhZnRlciB0aGUgY3VycmVudCBjYWxsIHN0YWNrIGhhc1xuICAvLyBjbGVhcmVkLlxuICBfLmRlZmVyID0gZnVuY3Rpb24oZnVuYykge1xuICAgIHJldHVybiBfLmRlbGF5LmFwcGx5KF8sIFtmdW5jLCAxXS5jb25jYXQoc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpKSk7XG4gIH07XG5cbiAgLy8gUmV0dXJucyBhIGZ1bmN0aW9uLCB0aGF0LCB3aGVuIGludm9rZWQsIHdpbGwgb25seSBiZSB0cmlnZ2VyZWQgYXQgbW9zdCBvbmNlXG4gIC8vIGR1cmluZyBhIGdpdmVuIHdpbmRvdyBvZiB0aW1lLiBOb3JtYWxseSwgdGhlIHRocm90dGxlZCBmdW5jdGlvbiB3aWxsIHJ1blxuICAvLyBhcyBtdWNoIGFzIGl0IGNhbiwgd2l0aG91dCBldmVyIGdvaW5nIG1vcmUgdGhhbiBvbmNlIHBlciBgd2FpdGAgZHVyYXRpb247XG4gIC8vIGJ1dCBpZiB5b3UnZCBsaWtlIHRvIGRpc2FibGUgdGhlIGV4ZWN1dGlvbiBvbiB0aGUgbGVhZGluZyBlZGdlLCBwYXNzXG4gIC8vIGB7bGVhZGluZzogZmFsc2V9YC4gVG8gZGlzYWJsZSBleGVjdXRpb24gb24gdGhlIHRyYWlsaW5nIGVkZ2UsIGRpdHRvLlxuICBfLnRocm90dGxlID0gZnVuY3Rpb24oZnVuYywgd2FpdCwgb3B0aW9ucykge1xuICAgIHZhciBjb250ZXh0LCBhcmdzLCByZXN1bHQ7XG4gICAgdmFyIHRpbWVvdXQgPSBudWxsO1xuICAgIHZhciBwcmV2aW91cyA9IDA7XG4gICAgb3B0aW9ucyB8fCAob3B0aW9ucyA9IHt9KTtcbiAgICB2YXIgbGF0ZXIgPSBmdW5jdGlvbigpIHtcbiAgICAgIHByZXZpb3VzID0gb3B0aW9ucy5sZWFkaW5nID09PSBmYWxzZSA/IDAgOiBfLm5vdygpO1xuICAgICAgdGltZW91dCA9IG51bGw7XG4gICAgICByZXN1bHQgPSBmdW5jLmFwcGx5KGNvbnRleHQsIGFyZ3MpO1xuICAgICAgY29udGV4dCA9IGFyZ3MgPSBudWxsO1xuICAgIH07XG4gICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIG5vdyA9IF8ubm93KCk7XG4gICAgICBpZiAoIXByZXZpb3VzICYmIG9wdGlvbnMubGVhZGluZyA9PT0gZmFsc2UpIHByZXZpb3VzID0gbm93O1xuICAgICAgdmFyIHJlbWFpbmluZyA9IHdhaXQgLSAobm93IC0gcHJldmlvdXMpO1xuICAgICAgY29udGV4dCA9IHRoaXM7XG4gICAgICBhcmdzID0gYXJndW1lbnRzO1xuICAgICAgaWYgKHJlbWFpbmluZyA8PSAwKSB7XG4gICAgICAgIGNsZWFyVGltZW91dCh0aW1lb3V0KTtcbiAgICAgICAgdGltZW91dCA9IG51bGw7XG4gICAgICAgIHByZXZpb3VzID0gbm93O1xuICAgICAgICByZXN1bHQgPSBmdW5jLmFwcGx5KGNvbnRleHQsIGFyZ3MpO1xuICAgICAgICBjb250ZXh0ID0gYXJncyA9IG51bGw7XG4gICAgICB9IGVsc2UgaWYgKCF0aW1lb3V0ICYmIG9wdGlvbnMudHJhaWxpbmcgIT09IGZhbHNlKSB7XG4gICAgICAgIHRpbWVvdXQgPSBzZXRUaW1lb3V0KGxhdGVyLCByZW1haW5pbmcpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9O1xuICB9O1xuXG4gIC8vIFJldHVybnMgYSBmdW5jdGlvbiwgdGhhdCwgYXMgbG9uZyBhcyBpdCBjb250aW51ZXMgdG8gYmUgaW52b2tlZCwgd2lsbCBub3RcbiAgLy8gYmUgdHJpZ2dlcmVkLiBUaGUgZnVuY3Rpb24gd2lsbCBiZSBjYWxsZWQgYWZ0ZXIgaXQgc3RvcHMgYmVpbmcgY2FsbGVkIGZvclxuICAvLyBOIG1pbGxpc2Vjb25kcy4gSWYgYGltbWVkaWF0ZWAgaXMgcGFzc2VkLCB0cmlnZ2VyIHRoZSBmdW5jdGlvbiBvbiB0aGVcbiAgLy8gbGVhZGluZyBlZGdlLCBpbnN0ZWFkIG9mIHRoZSB0cmFpbGluZy5cbiAgXy5kZWJvdW5jZSA9IGZ1bmN0aW9uKGZ1bmMsIHdhaXQsIGltbWVkaWF0ZSkge1xuICAgIHZhciB0aW1lb3V0LCBhcmdzLCBjb250ZXh0LCB0aW1lc3RhbXAsIHJlc3VsdDtcblxuICAgIHZhciBsYXRlciA9IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIGxhc3QgPSBfLm5vdygpIC0gdGltZXN0YW1wO1xuICAgICAgaWYgKGxhc3QgPCB3YWl0KSB7XG4gICAgICAgIHRpbWVvdXQgPSBzZXRUaW1lb3V0KGxhdGVyLCB3YWl0IC0gbGFzdCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aW1lb3V0ID0gbnVsbDtcbiAgICAgICAgaWYgKCFpbW1lZGlhdGUpIHtcbiAgICAgICAgICByZXN1bHQgPSBmdW5jLmFwcGx5KGNvbnRleHQsIGFyZ3MpO1xuICAgICAgICAgIGNvbnRleHQgPSBhcmdzID0gbnVsbDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH07XG5cbiAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICBjb250ZXh0ID0gdGhpcztcbiAgICAgIGFyZ3MgPSBhcmd1bWVudHM7XG4gICAgICB0aW1lc3RhbXAgPSBfLm5vdygpO1xuICAgICAgdmFyIGNhbGxOb3cgPSBpbW1lZGlhdGUgJiYgIXRpbWVvdXQ7XG4gICAgICBpZiAoIXRpbWVvdXQpIHtcbiAgICAgICAgdGltZW91dCA9IHNldFRpbWVvdXQobGF0ZXIsIHdhaXQpO1xuICAgICAgfVxuICAgICAgaWYgKGNhbGxOb3cpIHtcbiAgICAgICAgcmVzdWx0ID0gZnVuYy5hcHBseShjb250ZXh0LCBhcmdzKTtcbiAgICAgICAgY29udGV4dCA9IGFyZ3MgPSBudWxsO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH07XG4gIH07XG5cbiAgLy8gUmV0dXJucyBhIGZ1bmN0aW9uIHRoYXQgd2lsbCBiZSBleGVjdXRlZCBhdCBtb3N0IG9uZSB0aW1lLCBubyBtYXR0ZXIgaG93XG4gIC8vIG9mdGVuIHlvdSBjYWxsIGl0LiBVc2VmdWwgZm9yIGxhenkgaW5pdGlhbGl6YXRpb24uXG4gIF8ub25jZSA9IGZ1bmN0aW9uKGZ1bmMpIHtcbiAgICB2YXIgcmFuID0gZmFsc2UsIG1lbW87XG4gICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgaWYgKHJhbikgcmV0dXJuIG1lbW87XG4gICAgICByYW4gPSB0cnVlO1xuICAgICAgbWVtbyA9IGZ1bmMuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgIGZ1bmMgPSBudWxsO1xuICAgICAgcmV0dXJuIG1lbW87XG4gICAgfTtcbiAgfTtcblxuICAvLyBSZXR1cm5zIHRoZSBmaXJzdCBmdW5jdGlvbiBwYXNzZWQgYXMgYW4gYXJndW1lbnQgdG8gdGhlIHNlY29uZCxcbiAgLy8gYWxsb3dpbmcgeW91IHRvIGFkanVzdCBhcmd1bWVudHMsIHJ1biBjb2RlIGJlZm9yZSBhbmQgYWZ0ZXIsIGFuZFxuICAvLyBjb25kaXRpb25hbGx5IGV4ZWN1dGUgdGhlIG9yaWdpbmFsIGZ1bmN0aW9uLlxuICBfLndyYXAgPSBmdW5jdGlvbihmdW5jLCB3cmFwcGVyKSB7XG4gICAgcmV0dXJuIF8ucGFydGlhbCh3cmFwcGVyLCBmdW5jKTtcbiAgfTtcblxuICAvLyBSZXR1cm5zIGEgZnVuY3Rpb24gdGhhdCBpcyB0aGUgY29tcG9zaXRpb24gb2YgYSBsaXN0IG9mIGZ1bmN0aW9ucywgZWFjaFxuICAvLyBjb25zdW1pbmcgdGhlIHJldHVybiB2YWx1ZSBvZiB0aGUgZnVuY3Rpb24gdGhhdCBmb2xsb3dzLlxuICBfLmNvbXBvc2UgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgZnVuY3MgPSBhcmd1bWVudHM7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIGFyZ3MgPSBhcmd1bWVudHM7XG4gICAgICBmb3IgKHZhciBpID0gZnVuY3MubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICAgICAgYXJncyA9IFtmdW5jc1tpXS5hcHBseSh0aGlzLCBhcmdzKV07XG4gICAgICB9XG4gICAgICByZXR1cm4gYXJnc1swXTtcbiAgICB9O1xuICB9O1xuXG4gIC8vIFJldHVybnMgYSBmdW5jdGlvbiB0aGF0IHdpbGwgb25seSBiZSBleGVjdXRlZCBhZnRlciBiZWluZyBjYWxsZWQgTiB0aW1lcy5cbiAgXy5hZnRlciA9IGZ1bmN0aW9uKHRpbWVzLCBmdW5jKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgaWYgKC0tdGltZXMgPCAxKSB7XG4gICAgICAgIHJldHVybiBmdW5jLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICB9XG4gICAgfTtcbiAgfTtcblxuICAvLyBPYmplY3QgRnVuY3Rpb25zXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS1cblxuICAvLyBSZXRyaWV2ZSB0aGUgbmFtZXMgb2YgYW4gb2JqZWN0J3MgcHJvcGVydGllcy5cbiAgLy8gRGVsZWdhdGVzIHRvICoqRUNNQVNjcmlwdCA1KioncyBuYXRpdmUgYE9iamVjdC5rZXlzYFxuICBfLmtleXMgPSBmdW5jdGlvbihvYmopIHtcbiAgICBpZiAoIV8uaXNPYmplY3Qob2JqKSkgcmV0dXJuIFtdO1xuICAgIGlmIChuYXRpdmVLZXlzKSByZXR1cm4gbmF0aXZlS2V5cyhvYmopO1xuICAgIHZhciBrZXlzID0gW107XG4gICAgZm9yICh2YXIga2V5IGluIG9iaikgaWYgKF8uaGFzKG9iaiwga2V5KSkga2V5cy5wdXNoKGtleSk7XG4gICAgcmV0dXJuIGtleXM7XG4gIH07XG5cbiAgLy8gUmV0cmlldmUgdGhlIHZhbHVlcyBvZiBhbiBvYmplY3QncyBwcm9wZXJ0aWVzLlxuICBfLnZhbHVlcyA9IGZ1bmN0aW9uKG9iaikge1xuICAgIHZhciBrZXlzID0gXy5rZXlzKG9iaik7XG4gICAgdmFyIGxlbmd0aCA9IGtleXMubGVuZ3RoO1xuICAgIHZhciB2YWx1ZXMgPSBuZXcgQXJyYXkobGVuZ3RoKTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICB2YWx1ZXNbaV0gPSBvYmpba2V5c1tpXV07XG4gICAgfVxuICAgIHJldHVybiB2YWx1ZXM7XG4gIH07XG5cbiAgLy8gQ29udmVydCBhbiBvYmplY3QgaW50byBhIGxpc3Qgb2YgYFtrZXksIHZhbHVlXWAgcGFpcnMuXG4gIF8ucGFpcnMgPSBmdW5jdGlvbihvYmopIHtcbiAgICB2YXIga2V5cyA9IF8ua2V5cyhvYmopO1xuICAgIHZhciBsZW5ndGggPSBrZXlzLmxlbmd0aDtcbiAgICB2YXIgcGFpcnMgPSBuZXcgQXJyYXkobGVuZ3RoKTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICBwYWlyc1tpXSA9IFtrZXlzW2ldLCBvYmpba2V5c1tpXV1dO1xuICAgIH1cbiAgICByZXR1cm4gcGFpcnM7XG4gIH07XG5cbiAgLy8gSW52ZXJ0IHRoZSBrZXlzIGFuZCB2YWx1ZXMgb2YgYW4gb2JqZWN0LiBUaGUgdmFsdWVzIG11c3QgYmUgc2VyaWFsaXphYmxlLlxuICBfLmludmVydCA9IGZ1bmN0aW9uKG9iaikge1xuICAgIHZhciByZXN1bHQgPSB7fTtcbiAgICB2YXIga2V5cyA9IF8ua2V5cyhvYmopO1xuICAgIGZvciAodmFyIGkgPSAwLCBsZW5ndGggPSBrZXlzLmxlbmd0aDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICByZXN1bHRbb2JqW2tleXNbaV1dXSA9IGtleXNbaV07XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH07XG5cbiAgLy8gUmV0dXJuIGEgc29ydGVkIGxpc3Qgb2YgdGhlIGZ1bmN0aW9uIG5hbWVzIGF2YWlsYWJsZSBvbiB0aGUgb2JqZWN0LlxuICAvLyBBbGlhc2VkIGFzIGBtZXRob2RzYFxuICBfLmZ1bmN0aW9ucyA9IF8ubWV0aG9kcyA9IGZ1bmN0aW9uKG9iaikge1xuICAgIHZhciBuYW1lcyA9IFtdO1xuICAgIGZvciAodmFyIGtleSBpbiBvYmopIHtcbiAgICAgIGlmIChfLmlzRnVuY3Rpb24ob2JqW2tleV0pKSBuYW1lcy5wdXNoKGtleSk7XG4gICAgfVxuICAgIHJldHVybiBuYW1lcy5zb3J0KCk7XG4gIH07XG5cbiAgLy8gRXh0ZW5kIGEgZ2l2ZW4gb2JqZWN0IHdpdGggYWxsIHRoZSBwcm9wZXJ0aWVzIGluIHBhc3NlZC1pbiBvYmplY3QocykuXG4gIF8uZXh0ZW5kID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgZWFjaChzbGljZS5jYWxsKGFyZ3VtZW50cywgMSksIGZ1bmN0aW9uKHNvdXJjZSkge1xuICAgICAgaWYgKHNvdXJjZSkge1xuICAgICAgICBmb3IgKHZhciBwcm9wIGluIHNvdXJjZSkge1xuICAgICAgICAgIG9ialtwcm9wXSA9IHNvdXJjZVtwcm9wXTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiBvYmo7XG4gIH07XG5cbiAgLy8gUmV0dXJuIGEgY29weSBvZiB0aGUgb2JqZWN0IG9ubHkgY29udGFpbmluZyB0aGUgd2hpdGVsaXN0ZWQgcHJvcGVydGllcy5cbiAgXy5waWNrID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgdmFyIGNvcHkgPSB7fTtcbiAgICB2YXIga2V5cyA9IGNvbmNhdC5hcHBseShBcnJheVByb3RvLCBzbGljZS5jYWxsKGFyZ3VtZW50cywgMSkpO1xuICAgIGVhY2goa2V5cywgZnVuY3Rpb24oa2V5KSB7XG4gICAgICBpZiAoa2V5IGluIG9iaikgY29weVtrZXldID0gb2JqW2tleV07XG4gICAgfSk7XG4gICAgcmV0dXJuIGNvcHk7XG4gIH07XG5cbiAgIC8vIFJldHVybiBhIGNvcHkgb2YgdGhlIG9iamVjdCB3aXRob3V0IHRoZSBibGFja2xpc3RlZCBwcm9wZXJ0aWVzLlxuICBfLm9taXQgPSBmdW5jdGlvbihvYmopIHtcbiAgICB2YXIgY29weSA9IHt9O1xuICAgIHZhciBrZXlzID0gY29uY2F0LmFwcGx5KEFycmF5UHJvdG8sIHNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKSk7XG4gICAgZm9yICh2YXIga2V5IGluIG9iaikge1xuICAgICAgaWYgKCFfLmNvbnRhaW5zKGtleXMsIGtleSkpIGNvcHlba2V5XSA9IG9ialtrZXldO1xuICAgIH1cbiAgICByZXR1cm4gY29weTtcbiAgfTtcblxuICAvLyBGaWxsIGluIGEgZ2l2ZW4gb2JqZWN0IHdpdGggZGVmYXVsdCBwcm9wZXJ0aWVzLlxuICBfLmRlZmF1bHRzID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgZWFjaChzbGljZS5jYWxsKGFyZ3VtZW50cywgMSksIGZ1bmN0aW9uKHNvdXJjZSkge1xuICAgICAgaWYgKHNvdXJjZSkge1xuICAgICAgICBmb3IgKHZhciBwcm9wIGluIHNvdXJjZSkge1xuICAgICAgICAgIGlmIChvYmpbcHJvcF0gPT09IHZvaWQgMCkgb2JqW3Byb3BdID0gc291cmNlW3Byb3BdO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIG9iajtcbiAgfTtcblxuICAvLyBDcmVhdGUgYSAoc2hhbGxvdy1jbG9uZWQpIGR1cGxpY2F0ZSBvZiBhbiBvYmplY3QuXG4gIF8uY2xvbmUgPSBmdW5jdGlvbihvYmopIHtcbiAgICBpZiAoIV8uaXNPYmplY3Qob2JqKSkgcmV0dXJuIG9iajtcbiAgICByZXR1cm4gXy5pc0FycmF5KG9iaikgPyBvYmouc2xpY2UoKSA6IF8uZXh0ZW5kKHt9LCBvYmopO1xuICB9O1xuXG4gIC8vIEludm9rZXMgaW50ZXJjZXB0b3Igd2l0aCB0aGUgb2JqLCBhbmQgdGhlbiByZXR1cm5zIG9iai5cbiAgLy8gVGhlIHByaW1hcnkgcHVycG9zZSBvZiB0aGlzIG1ldGhvZCBpcyB0byBcInRhcCBpbnRvXCIgYSBtZXRob2QgY2hhaW4sIGluXG4gIC8vIG9yZGVyIHRvIHBlcmZvcm0gb3BlcmF0aW9ucyBvbiBpbnRlcm1lZGlhdGUgcmVzdWx0cyB3aXRoaW4gdGhlIGNoYWluLlxuICBfLnRhcCA9IGZ1bmN0aW9uKG9iaiwgaW50ZXJjZXB0b3IpIHtcbiAgICBpbnRlcmNlcHRvcihvYmopO1xuICAgIHJldHVybiBvYmo7XG4gIH07XG5cbiAgLy8gSW50ZXJuYWwgcmVjdXJzaXZlIGNvbXBhcmlzb24gZnVuY3Rpb24gZm9yIGBpc0VxdWFsYC5cbiAgdmFyIGVxID0gZnVuY3Rpb24oYSwgYiwgYVN0YWNrLCBiU3RhY2spIHtcbiAgICAvLyBJZGVudGljYWwgb2JqZWN0cyBhcmUgZXF1YWwuIGAwID09PSAtMGAsIGJ1dCB0aGV5IGFyZW4ndCBpZGVudGljYWwuXG4gICAgLy8gU2VlIHRoZSBbSGFybW9ueSBgZWdhbGAgcHJvcG9zYWxdKGh0dHA6Ly93aWtpLmVjbWFzY3JpcHQub3JnL2Rva3UucGhwP2lkPWhhcm1vbnk6ZWdhbCkuXG4gICAgaWYgKGEgPT09IGIpIHJldHVybiBhICE9PSAwIHx8IDEgLyBhID09IDEgLyBiO1xuICAgIC8vIEEgc3RyaWN0IGNvbXBhcmlzb24gaXMgbmVjZXNzYXJ5IGJlY2F1c2UgYG51bGwgPT0gdW5kZWZpbmVkYC5cbiAgICBpZiAoYSA9PSBudWxsIHx8IGIgPT0gbnVsbCkgcmV0dXJuIGEgPT09IGI7XG4gICAgLy8gVW53cmFwIGFueSB3cmFwcGVkIG9iamVjdHMuXG4gICAgaWYgKGEgaW5zdGFuY2VvZiBfKSBhID0gYS5fd3JhcHBlZDtcbiAgICBpZiAoYiBpbnN0YW5jZW9mIF8pIGIgPSBiLl93cmFwcGVkO1xuICAgIC8vIENvbXBhcmUgYFtbQ2xhc3NdXWAgbmFtZXMuXG4gICAgdmFyIGNsYXNzTmFtZSA9IHRvU3RyaW5nLmNhbGwoYSk7XG4gICAgaWYgKGNsYXNzTmFtZSAhPSB0b1N0cmluZy5jYWxsKGIpKSByZXR1cm4gZmFsc2U7XG4gICAgc3dpdGNoIChjbGFzc05hbWUpIHtcbiAgICAgIC8vIFN0cmluZ3MsIG51bWJlcnMsIGRhdGVzLCBhbmQgYm9vbGVhbnMgYXJlIGNvbXBhcmVkIGJ5IHZhbHVlLlxuICAgICAgY2FzZSAnW29iamVjdCBTdHJpbmddJzpcbiAgICAgICAgLy8gUHJpbWl0aXZlcyBhbmQgdGhlaXIgY29ycmVzcG9uZGluZyBvYmplY3Qgd3JhcHBlcnMgYXJlIGVxdWl2YWxlbnQ7IHRodXMsIGBcIjVcImAgaXNcbiAgICAgICAgLy8gZXF1aXZhbGVudCB0byBgbmV3IFN0cmluZyhcIjVcIilgLlxuICAgICAgICByZXR1cm4gYSA9PSBTdHJpbmcoYik7XG4gICAgICBjYXNlICdbb2JqZWN0IE51bWJlcl0nOlxuICAgICAgICAvLyBgTmFOYHMgYXJlIGVxdWl2YWxlbnQsIGJ1dCBub24tcmVmbGV4aXZlLiBBbiBgZWdhbGAgY29tcGFyaXNvbiBpcyBwZXJmb3JtZWQgZm9yXG4gICAgICAgIC8vIG90aGVyIG51bWVyaWMgdmFsdWVzLlxuICAgICAgICByZXR1cm4gYSAhPSArYSA/IGIgIT0gK2IgOiAoYSA9PSAwID8gMSAvIGEgPT0gMSAvIGIgOiBhID09ICtiKTtcbiAgICAgIGNhc2UgJ1tvYmplY3QgRGF0ZV0nOlxuICAgICAgY2FzZSAnW29iamVjdCBCb29sZWFuXSc6XG4gICAgICAgIC8vIENvZXJjZSBkYXRlcyBhbmQgYm9vbGVhbnMgdG8gbnVtZXJpYyBwcmltaXRpdmUgdmFsdWVzLiBEYXRlcyBhcmUgY29tcGFyZWQgYnkgdGhlaXJcbiAgICAgICAgLy8gbWlsbGlzZWNvbmQgcmVwcmVzZW50YXRpb25zLiBOb3RlIHRoYXQgaW52YWxpZCBkYXRlcyB3aXRoIG1pbGxpc2Vjb25kIHJlcHJlc2VudGF0aW9uc1xuICAgICAgICAvLyBvZiBgTmFOYCBhcmUgbm90IGVxdWl2YWxlbnQuXG4gICAgICAgIHJldHVybiArYSA9PSArYjtcbiAgICAgIC8vIFJlZ0V4cHMgYXJlIGNvbXBhcmVkIGJ5IHRoZWlyIHNvdXJjZSBwYXR0ZXJucyBhbmQgZmxhZ3MuXG4gICAgICBjYXNlICdbb2JqZWN0IFJlZ0V4cF0nOlxuICAgICAgICByZXR1cm4gYS5zb3VyY2UgPT0gYi5zb3VyY2UgJiZcbiAgICAgICAgICAgICAgIGEuZ2xvYmFsID09IGIuZ2xvYmFsICYmXG4gICAgICAgICAgICAgICBhLm11bHRpbGluZSA9PSBiLm11bHRpbGluZSAmJlxuICAgICAgICAgICAgICAgYS5pZ25vcmVDYXNlID09IGIuaWdub3JlQ2FzZTtcbiAgICB9XG4gICAgaWYgKHR5cGVvZiBhICE9ICdvYmplY3QnIHx8IHR5cGVvZiBiICE9ICdvYmplY3QnKSByZXR1cm4gZmFsc2U7XG4gICAgLy8gQXNzdW1lIGVxdWFsaXR5IGZvciBjeWNsaWMgc3RydWN0dXJlcy4gVGhlIGFsZ29yaXRobSBmb3IgZGV0ZWN0aW5nIGN5Y2xpY1xuICAgIC8vIHN0cnVjdHVyZXMgaXMgYWRhcHRlZCBmcm9tIEVTIDUuMSBzZWN0aW9uIDE1LjEyLjMsIGFic3RyYWN0IG9wZXJhdGlvbiBgSk9gLlxuICAgIHZhciBsZW5ndGggPSBhU3RhY2subGVuZ3RoO1xuICAgIHdoaWxlIChsZW5ndGgtLSkge1xuICAgICAgLy8gTGluZWFyIHNlYXJjaC4gUGVyZm9ybWFuY2UgaXMgaW52ZXJzZWx5IHByb3BvcnRpb25hbCB0byB0aGUgbnVtYmVyIG9mXG4gICAgICAvLyB1bmlxdWUgbmVzdGVkIHN0cnVjdHVyZXMuXG4gICAgICBpZiAoYVN0YWNrW2xlbmd0aF0gPT0gYSkgcmV0dXJuIGJTdGFja1tsZW5ndGhdID09IGI7XG4gICAgfVxuICAgIC8vIE9iamVjdHMgd2l0aCBkaWZmZXJlbnQgY29uc3RydWN0b3JzIGFyZSBub3QgZXF1aXZhbGVudCwgYnV0IGBPYmplY3Rgc1xuICAgIC8vIGZyb20gZGlmZmVyZW50IGZyYW1lcyBhcmUuXG4gICAgdmFyIGFDdG9yID0gYS5jb25zdHJ1Y3RvciwgYkN0b3IgPSBiLmNvbnN0cnVjdG9yO1xuICAgIGlmIChhQ3RvciAhPT0gYkN0b3IgJiYgIShfLmlzRnVuY3Rpb24oYUN0b3IpICYmIChhQ3RvciBpbnN0YW5jZW9mIGFDdG9yKSAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICBfLmlzRnVuY3Rpb24oYkN0b3IpICYmIChiQ3RvciBpbnN0YW5jZW9mIGJDdG9yKSlcbiAgICAgICAgICAgICAgICAgICAgICAgICYmICgnY29uc3RydWN0b3InIGluIGEgJiYgJ2NvbnN0cnVjdG9yJyBpbiBiKSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICAvLyBBZGQgdGhlIGZpcnN0IG9iamVjdCB0byB0aGUgc3RhY2sgb2YgdHJhdmVyc2VkIG9iamVjdHMuXG4gICAgYVN0YWNrLnB1c2goYSk7XG4gICAgYlN0YWNrLnB1c2goYik7XG4gICAgdmFyIHNpemUgPSAwLCByZXN1bHQgPSB0cnVlO1xuICAgIC8vIFJlY3Vyc2l2ZWx5IGNvbXBhcmUgb2JqZWN0cyBhbmQgYXJyYXlzLlxuICAgIGlmIChjbGFzc05hbWUgPT0gJ1tvYmplY3QgQXJyYXldJykge1xuICAgICAgLy8gQ29tcGFyZSBhcnJheSBsZW5ndGhzIHRvIGRldGVybWluZSBpZiBhIGRlZXAgY29tcGFyaXNvbiBpcyBuZWNlc3NhcnkuXG4gICAgICBzaXplID0gYS5sZW5ndGg7XG4gICAgICByZXN1bHQgPSBzaXplID09IGIubGVuZ3RoO1xuICAgICAgaWYgKHJlc3VsdCkge1xuICAgICAgICAvLyBEZWVwIGNvbXBhcmUgdGhlIGNvbnRlbnRzLCBpZ25vcmluZyBub24tbnVtZXJpYyBwcm9wZXJ0aWVzLlxuICAgICAgICB3aGlsZSAoc2l6ZS0tKSB7XG4gICAgICAgICAgaWYgKCEocmVzdWx0ID0gZXEoYVtzaXplXSwgYltzaXplXSwgYVN0YWNrLCBiU3RhY2spKSkgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgLy8gRGVlcCBjb21wYXJlIG9iamVjdHMuXG4gICAgICBmb3IgKHZhciBrZXkgaW4gYSkge1xuICAgICAgICBpZiAoXy5oYXMoYSwga2V5KSkge1xuICAgICAgICAgIC8vIENvdW50IHRoZSBleHBlY3RlZCBudW1iZXIgb2YgcHJvcGVydGllcy5cbiAgICAgICAgICBzaXplKys7XG4gICAgICAgICAgLy8gRGVlcCBjb21wYXJlIGVhY2ggbWVtYmVyLlxuICAgICAgICAgIGlmICghKHJlc3VsdCA9IF8uaGFzKGIsIGtleSkgJiYgZXEoYVtrZXldLCBiW2tleV0sIGFTdGFjaywgYlN0YWNrKSkpIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICAvLyBFbnN1cmUgdGhhdCBib3RoIG9iamVjdHMgY29udGFpbiB0aGUgc2FtZSBudW1iZXIgb2YgcHJvcGVydGllcy5cbiAgICAgIGlmIChyZXN1bHQpIHtcbiAgICAgICAgZm9yIChrZXkgaW4gYikge1xuICAgICAgICAgIGlmIChfLmhhcyhiLCBrZXkpICYmICEoc2l6ZS0tKSkgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgcmVzdWx0ID0gIXNpemU7XG4gICAgICB9XG4gICAgfVxuICAgIC8vIFJlbW92ZSB0aGUgZmlyc3Qgb2JqZWN0IGZyb20gdGhlIHN0YWNrIG9mIHRyYXZlcnNlZCBvYmplY3RzLlxuICAgIGFTdGFjay5wb3AoKTtcbiAgICBiU3RhY2sucG9wKCk7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfTtcblxuICAvLyBQZXJmb3JtIGEgZGVlcCBjb21wYXJpc29uIHRvIGNoZWNrIGlmIHR3byBvYmplY3RzIGFyZSBlcXVhbC5cbiAgXy5pc0VxdWFsID0gZnVuY3Rpb24oYSwgYikge1xuICAgIHJldHVybiBlcShhLCBiLCBbXSwgW10pO1xuICB9O1xuXG4gIC8vIElzIGEgZ2l2ZW4gYXJyYXksIHN0cmluZywgb3Igb2JqZWN0IGVtcHR5P1xuICAvLyBBbiBcImVtcHR5XCIgb2JqZWN0IGhhcyBubyBlbnVtZXJhYmxlIG93bi1wcm9wZXJ0aWVzLlxuICBfLmlzRW1wdHkgPSBmdW5jdGlvbihvYmopIHtcbiAgICBpZiAob2JqID09IG51bGwpIHJldHVybiB0cnVlO1xuICAgIGlmIChfLmlzQXJyYXkob2JqKSB8fCBfLmlzU3RyaW5nKG9iaikpIHJldHVybiBvYmoubGVuZ3RoID09PSAwO1xuICAgIGZvciAodmFyIGtleSBpbiBvYmopIGlmIChfLmhhcyhvYmosIGtleSkpIHJldHVybiBmYWxzZTtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfTtcblxuICAvLyBJcyBhIGdpdmVuIHZhbHVlIGEgRE9NIGVsZW1lbnQ/XG4gIF8uaXNFbGVtZW50ID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgcmV0dXJuICEhKG9iaiAmJiBvYmoubm9kZVR5cGUgPT09IDEpO1xuICB9O1xuXG4gIC8vIElzIGEgZ2l2ZW4gdmFsdWUgYW4gYXJyYXk/XG4gIC8vIERlbGVnYXRlcyB0byBFQ01BNSdzIG5hdGl2ZSBBcnJheS5pc0FycmF5XG4gIF8uaXNBcnJheSA9IG5hdGl2ZUlzQXJyYXkgfHwgZnVuY3Rpb24ob2JqKSB7XG4gICAgcmV0dXJuIHRvU3RyaW5nLmNhbGwob2JqKSA9PSAnW29iamVjdCBBcnJheV0nO1xuICB9O1xuXG4gIC8vIElzIGEgZ2l2ZW4gdmFyaWFibGUgYW4gb2JqZWN0P1xuICBfLmlzT2JqZWN0ID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgcmV0dXJuIG9iaiA9PT0gT2JqZWN0KG9iaik7XG4gIH07XG5cbiAgLy8gQWRkIHNvbWUgaXNUeXBlIG1ldGhvZHM6IGlzQXJndW1lbnRzLCBpc0Z1bmN0aW9uLCBpc1N0cmluZywgaXNOdW1iZXIsIGlzRGF0ZSwgaXNSZWdFeHAuXG4gIGVhY2goWydBcmd1bWVudHMnLCAnRnVuY3Rpb24nLCAnU3RyaW5nJywgJ051bWJlcicsICdEYXRlJywgJ1JlZ0V4cCddLCBmdW5jdGlvbihuYW1lKSB7XG4gICAgX1snaXMnICsgbmFtZV0gPSBmdW5jdGlvbihvYmopIHtcbiAgICAgIHJldHVybiB0b1N0cmluZy5jYWxsKG9iaikgPT0gJ1tvYmplY3QgJyArIG5hbWUgKyAnXSc7XG4gICAgfTtcbiAgfSk7XG5cbiAgLy8gRGVmaW5lIGEgZmFsbGJhY2sgdmVyc2lvbiBvZiB0aGUgbWV0aG9kIGluIGJyb3dzZXJzIChhaGVtLCBJRSksIHdoZXJlXG4gIC8vIHRoZXJlIGlzbid0IGFueSBpbnNwZWN0YWJsZSBcIkFyZ3VtZW50c1wiIHR5cGUuXG4gIGlmICghXy5pc0FyZ3VtZW50cyhhcmd1bWVudHMpKSB7XG4gICAgXy5pc0FyZ3VtZW50cyA9IGZ1bmN0aW9uKG9iaikge1xuICAgICAgcmV0dXJuICEhKG9iaiAmJiBfLmhhcyhvYmosICdjYWxsZWUnKSk7XG4gICAgfTtcbiAgfVxuXG4gIC8vIE9wdGltaXplIGBpc0Z1bmN0aW9uYCBpZiBhcHByb3ByaWF0ZS5cbiAgaWYgKHR5cGVvZiAoLy4vKSAhPT0gJ2Z1bmN0aW9uJykge1xuICAgIF8uaXNGdW5jdGlvbiA9IGZ1bmN0aW9uKG9iaikge1xuICAgICAgcmV0dXJuIHR5cGVvZiBvYmogPT09ICdmdW5jdGlvbic7XG4gICAgfTtcbiAgfVxuXG4gIC8vIElzIGEgZ2l2ZW4gb2JqZWN0IGEgZmluaXRlIG51bWJlcj9cbiAgXy5pc0Zpbml0ZSA9IGZ1bmN0aW9uKG9iaikge1xuICAgIHJldHVybiBpc0Zpbml0ZShvYmopICYmICFpc05hTihwYXJzZUZsb2F0KG9iaikpO1xuICB9O1xuXG4gIC8vIElzIHRoZSBnaXZlbiB2YWx1ZSBgTmFOYD8gKE5hTiBpcyB0aGUgb25seSBudW1iZXIgd2hpY2ggZG9lcyBub3QgZXF1YWwgaXRzZWxmKS5cbiAgXy5pc05hTiA9IGZ1bmN0aW9uKG9iaikge1xuICAgIHJldHVybiBfLmlzTnVtYmVyKG9iaikgJiYgb2JqICE9ICtvYmo7XG4gIH07XG5cbiAgLy8gSXMgYSBnaXZlbiB2YWx1ZSBhIGJvb2xlYW4/XG4gIF8uaXNCb29sZWFuID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgcmV0dXJuIG9iaiA9PT0gdHJ1ZSB8fCBvYmogPT09IGZhbHNlIHx8IHRvU3RyaW5nLmNhbGwob2JqKSA9PSAnW29iamVjdCBCb29sZWFuXSc7XG4gIH07XG5cbiAgLy8gSXMgYSBnaXZlbiB2YWx1ZSBlcXVhbCB0byBudWxsP1xuICBfLmlzTnVsbCA9IGZ1bmN0aW9uKG9iaikge1xuICAgIHJldHVybiBvYmogPT09IG51bGw7XG4gIH07XG5cbiAgLy8gSXMgYSBnaXZlbiB2YXJpYWJsZSB1bmRlZmluZWQ/XG4gIF8uaXNVbmRlZmluZWQgPSBmdW5jdGlvbihvYmopIHtcbiAgICByZXR1cm4gb2JqID09PSB2b2lkIDA7XG4gIH07XG5cbiAgLy8gU2hvcnRjdXQgZnVuY3Rpb24gZm9yIGNoZWNraW5nIGlmIGFuIG9iamVjdCBoYXMgYSBnaXZlbiBwcm9wZXJ0eSBkaXJlY3RseVxuICAvLyBvbiBpdHNlbGYgKGluIG90aGVyIHdvcmRzLCBub3Qgb24gYSBwcm90b3R5cGUpLlxuICBfLmhhcyA9IGZ1bmN0aW9uKG9iaiwga2V5KSB7XG4gICAgcmV0dXJuIGhhc093blByb3BlcnR5LmNhbGwob2JqLCBrZXkpO1xuICB9O1xuXG4gIC8vIFV0aWxpdHkgRnVuY3Rpb25zXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgLy8gUnVuIFVuZGVyc2NvcmUuanMgaW4gKm5vQ29uZmxpY3QqIG1vZGUsIHJldHVybmluZyB0aGUgYF9gIHZhcmlhYmxlIHRvIGl0c1xuICAvLyBwcmV2aW91cyBvd25lci4gUmV0dXJucyBhIHJlZmVyZW5jZSB0byB0aGUgVW5kZXJzY29yZSBvYmplY3QuXG4gIF8ubm9Db25mbGljdCA9IGZ1bmN0aW9uKCkge1xuICAgIHJvb3QuXyA9IHByZXZpb3VzVW5kZXJzY29yZTtcbiAgICByZXR1cm4gdGhpcztcbiAgfTtcblxuICAvLyBLZWVwIHRoZSBpZGVudGl0eSBmdW5jdGlvbiBhcm91bmQgZm9yIGRlZmF1bHQgaXRlcmF0b3JzLlxuICBfLmlkZW50aXR5ID0gZnVuY3Rpb24odmFsdWUpIHtcbiAgICByZXR1cm4gdmFsdWU7XG4gIH07XG5cbiAgXy5jb25zdGFudCA9IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB9O1xuICB9O1xuXG4gIF8ucHJvcGVydHkgPSBmdW5jdGlvbihrZXkpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24ob2JqKSB7XG4gICAgICByZXR1cm4gb2JqW2tleV07XG4gICAgfTtcbiAgfTtcblxuICAvLyBSZXR1cm5zIGEgcHJlZGljYXRlIGZvciBjaGVja2luZyB3aGV0aGVyIGFuIG9iamVjdCBoYXMgYSBnaXZlbiBzZXQgb2YgYGtleTp2YWx1ZWAgcGFpcnMuXG4gIF8ubWF0Y2hlcyA9IGZ1bmN0aW9uKGF0dHJzKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKG9iaikge1xuICAgICAgaWYgKG9iaiA9PT0gYXR0cnMpIHJldHVybiB0cnVlOyAvL2F2b2lkIGNvbXBhcmluZyBhbiBvYmplY3QgdG8gaXRzZWxmLlxuICAgICAgZm9yICh2YXIga2V5IGluIGF0dHJzKSB7XG4gICAgICAgIGlmIChhdHRyc1trZXldICE9PSBvYmpba2V5XSlcbiAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gIH07XG5cbiAgLy8gUnVuIGEgZnVuY3Rpb24gKipuKiogdGltZXMuXG4gIF8udGltZXMgPSBmdW5jdGlvbihuLCBpdGVyYXRvciwgY29udGV4dCkge1xuICAgIHZhciBhY2N1bSA9IEFycmF5KE1hdGgubWF4KDAsIG4pKTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IG47IGkrKykgYWNjdW1baV0gPSBpdGVyYXRvci5jYWxsKGNvbnRleHQsIGkpO1xuICAgIHJldHVybiBhY2N1bTtcbiAgfTtcblxuICAvLyBSZXR1cm4gYSByYW5kb20gaW50ZWdlciBiZXR3ZWVuIG1pbiBhbmQgbWF4IChpbmNsdXNpdmUpLlxuICBfLnJhbmRvbSA9IGZ1bmN0aW9uKG1pbiwgbWF4KSB7XG4gICAgaWYgKG1heCA9PSBudWxsKSB7XG4gICAgICBtYXggPSBtaW47XG4gICAgICBtaW4gPSAwO1xuICAgIH1cbiAgICByZXR1cm4gbWluICsgTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogKG1heCAtIG1pbiArIDEpKTtcbiAgfTtcblxuICAvLyBBIChwb3NzaWJseSBmYXN0ZXIpIHdheSB0byBnZXQgdGhlIGN1cnJlbnQgdGltZXN0YW1wIGFzIGFuIGludGVnZXIuXG4gIF8ubm93ID0gRGF0ZS5ub3cgfHwgZnVuY3Rpb24oKSB7IHJldHVybiBuZXcgRGF0ZSgpLmdldFRpbWUoKTsgfTtcblxuICAvLyBMaXN0IG9mIEhUTUwgZW50aXRpZXMgZm9yIGVzY2FwaW5nLlxuICB2YXIgZW50aXR5TWFwID0ge1xuICAgIGVzY2FwZToge1xuICAgICAgJyYnOiAnJmFtcDsnLFxuICAgICAgJzwnOiAnJmx0OycsXG4gICAgICAnPic6ICcmZ3Q7JyxcbiAgICAgICdcIic6ICcmcXVvdDsnLFxuICAgICAgXCInXCI6ICcmI3gyNzsnXG4gICAgfVxuICB9O1xuICBlbnRpdHlNYXAudW5lc2NhcGUgPSBfLmludmVydChlbnRpdHlNYXAuZXNjYXBlKTtcblxuICAvLyBSZWdleGVzIGNvbnRhaW5pbmcgdGhlIGtleXMgYW5kIHZhbHVlcyBsaXN0ZWQgaW1tZWRpYXRlbHkgYWJvdmUuXG4gIHZhciBlbnRpdHlSZWdleGVzID0ge1xuICAgIGVzY2FwZTogICBuZXcgUmVnRXhwKCdbJyArIF8ua2V5cyhlbnRpdHlNYXAuZXNjYXBlKS5qb2luKCcnKSArICddJywgJ2cnKSxcbiAgICB1bmVzY2FwZTogbmV3IFJlZ0V4cCgnKCcgKyBfLmtleXMoZW50aXR5TWFwLnVuZXNjYXBlKS5qb2luKCd8JykgKyAnKScsICdnJylcbiAgfTtcblxuICAvLyBGdW5jdGlvbnMgZm9yIGVzY2FwaW5nIGFuZCB1bmVzY2FwaW5nIHN0cmluZ3MgdG8vZnJvbSBIVE1MIGludGVycG9sYXRpb24uXG4gIF8uZWFjaChbJ2VzY2FwZScsICd1bmVzY2FwZSddLCBmdW5jdGlvbihtZXRob2QpIHtcbiAgICBfW21ldGhvZF0gPSBmdW5jdGlvbihzdHJpbmcpIHtcbiAgICAgIGlmIChzdHJpbmcgPT0gbnVsbCkgcmV0dXJuICcnO1xuICAgICAgcmV0dXJuICgnJyArIHN0cmluZykucmVwbGFjZShlbnRpdHlSZWdleGVzW21ldGhvZF0sIGZ1bmN0aW9uKG1hdGNoKSB7XG4gICAgICAgIHJldHVybiBlbnRpdHlNYXBbbWV0aG9kXVttYXRjaF07XG4gICAgICB9KTtcbiAgICB9O1xuICB9KTtcblxuICAvLyBJZiB0aGUgdmFsdWUgb2YgdGhlIG5hbWVkIGBwcm9wZXJ0eWAgaXMgYSBmdW5jdGlvbiB0aGVuIGludm9rZSBpdCB3aXRoIHRoZVxuICAvLyBgb2JqZWN0YCBhcyBjb250ZXh0OyBvdGhlcndpc2UsIHJldHVybiBpdC5cbiAgXy5yZXN1bHQgPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7XG4gICAgaWYgKG9iamVjdCA9PSBudWxsKSByZXR1cm4gdm9pZCAwO1xuICAgIHZhciB2YWx1ZSA9IG9iamVjdFtwcm9wZXJ0eV07XG4gICAgcmV0dXJuIF8uaXNGdW5jdGlvbih2YWx1ZSkgPyB2YWx1ZS5jYWxsKG9iamVjdCkgOiB2YWx1ZTtcbiAgfTtcblxuICAvLyBBZGQgeW91ciBvd24gY3VzdG9tIGZ1bmN0aW9ucyB0byB0aGUgVW5kZXJzY29yZSBvYmplY3QuXG4gIF8ubWl4aW4gPSBmdW5jdGlvbihvYmopIHtcbiAgICBlYWNoKF8uZnVuY3Rpb25zKG9iaiksIGZ1bmN0aW9uKG5hbWUpIHtcbiAgICAgIHZhciBmdW5jID0gX1tuYW1lXSA9IG9ialtuYW1lXTtcbiAgICAgIF8ucHJvdG90eXBlW25hbWVdID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBhcmdzID0gW3RoaXMuX3dyYXBwZWRdO1xuICAgICAgICBwdXNoLmFwcGx5KGFyZ3MsIGFyZ3VtZW50cyk7XG4gICAgICAgIHJldHVybiByZXN1bHQuY2FsbCh0aGlzLCBmdW5jLmFwcGx5KF8sIGFyZ3MpKTtcbiAgICAgIH07XG4gICAgfSk7XG4gIH07XG5cbiAgLy8gR2VuZXJhdGUgYSB1bmlxdWUgaW50ZWdlciBpZCAodW5pcXVlIHdpdGhpbiB0aGUgZW50aXJlIGNsaWVudCBzZXNzaW9uKS5cbiAgLy8gVXNlZnVsIGZvciB0ZW1wb3JhcnkgRE9NIGlkcy5cbiAgdmFyIGlkQ291bnRlciA9IDA7XG4gIF8udW5pcXVlSWQgPSBmdW5jdGlvbihwcmVmaXgpIHtcbiAgICB2YXIgaWQgPSArK2lkQ291bnRlciArICcnO1xuICAgIHJldHVybiBwcmVmaXggPyBwcmVmaXggKyBpZCA6IGlkO1xuICB9O1xuXG4gIC8vIEJ5IGRlZmF1bHQsIFVuZGVyc2NvcmUgdXNlcyBFUkItc3R5bGUgdGVtcGxhdGUgZGVsaW1pdGVycywgY2hhbmdlIHRoZVxuICAvLyBmb2xsb3dpbmcgdGVtcGxhdGUgc2V0dGluZ3MgdG8gdXNlIGFsdGVybmF0aXZlIGRlbGltaXRlcnMuXG4gIF8udGVtcGxhdGVTZXR0aW5ncyA9IHtcbiAgICBldmFsdWF0ZSAgICA6IC88JShbXFxzXFxTXSs/KSU+L2csXG4gICAgaW50ZXJwb2xhdGUgOiAvPCU9KFtcXHNcXFNdKz8pJT4vZyxcbiAgICBlc2NhcGUgICAgICA6IC88JS0oW1xcc1xcU10rPyklPi9nXG4gIH07XG5cbiAgLy8gV2hlbiBjdXN0b21pemluZyBgdGVtcGxhdGVTZXR0aW5nc2AsIGlmIHlvdSBkb24ndCB3YW50IHRvIGRlZmluZSBhblxuICAvLyBpbnRlcnBvbGF0aW9uLCBldmFsdWF0aW9uIG9yIGVzY2FwaW5nIHJlZ2V4LCB3ZSBuZWVkIG9uZSB0aGF0IGlzXG4gIC8vIGd1YXJhbnRlZWQgbm90IHRvIG1hdGNoLlxuICB2YXIgbm9NYXRjaCA9IC8oLileLztcblxuICAvLyBDZXJ0YWluIGNoYXJhY3RlcnMgbmVlZCB0byBiZSBlc2NhcGVkIHNvIHRoYXQgdGhleSBjYW4gYmUgcHV0IGludG8gYVxuICAvLyBzdHJpbmcgbGl0ZXJhbC5cbiAgdmFyIGVzY2FwZXMgPSB7XG4gICAgXCInXCI6ICAgICAgXCInXCIsXG4gICAgJ1xcXFwnOiAgICAgJ1xcXFwnLFxuICAgICdcXHInOiAgICAgJ3InLFxuICAgICdcXG4nOiAgICAgJ24nLFxuICAgICdcXHQnOiAgICAgJ3QnLFxuICAgICdcXHUyMDI4JzogJ3UyMDI4JyxcbiAgICAnXFx1MjAyOSc6ICd1MjAyOSdcbiAgfTtcblxuICB2YXIgZXNjYXBlciA9IC9cXFxcfCd8XFxyfFxcbnxcXHR8XFx1MjAyOHxcXHUyMDI5L2c7XG5cbiAgLy8gSmF2YVNjcmlwdCBtaWNyby10ZW1wbGF0aW5nLCBzaW1pbGFyIHRvIEpvaG4gUmVzaWcncyBpbXBsZW1lbnRhdGlvbi5cbiAgLy8gVW5kZXJzY29yZSB0ZW1wbGF0aW5nIGhhbmRsZXMgYXJiaXRyYXJ5IGRlbGltaXRlcnMsIHByZXNlcnZlcyB3aGl0ZXNwYWNlLFxuICAvLyBhbmQgY29ycmVjdGx5IGVzY2FwZXMgcXVvdGVzIHdpdGhpbiBpbnRlcnBvbGF0ZWQgY29kZS5cbiAgXy50ZW1wbGF0ZSA9IGZ1bmN0aW9uKHRleHQsIGRhdGEsIHNldHRpbmdzKSB7XG4gICAgdmFyIHJlbmRlcjtcbiAgICBzZXR0aW5ncyA9IF8uZGVmYXVsdHMoe30sIHNldHRpbmdzLCBfLnRlbXBsYXRlU2V0dGluZ3MpO1xuXG4gICAgLy8gQ29tYmluZSBkZWxpbWl0ZXJzIGludG8gb25lIHJlZ3VsYXIgZXhwcmVzc2lvbiB2aWEgYWx0ZXJuYXRpb24uXG4gICAgdmFyIG1hdGNoZXIgPSBuZXcgUmVnRXhwKFtcbiAgICAgIChzZXR0aW5ncy5lc2NhcGUgfHwgbm9NYXRjaCkuc291cmNlLFxuICAgICAgKHNldHRpbmdzLmludGVycG9sYXRlIHx8IG5vTWF0Y2gpLnNvdXJjZSxcbiAgICAgIChzZXR0aW5ncy5ldmFsdWF0ZSB8fCBub01hdGNoKS5zb3VyY2VcbiAgICBdLmpvaW4oJ3wnKSArICd8JCcsICdnJyk7XG5cbiAgICAvLyBDb21waWxlIHRoZSB0ZW1wbGF0ZSBzb3VyY2UsIGVzY2FwaW5nIHN0cmluZyBsaXRlcmFscyBhcHByb3ByaWF0ZWx5LlxuICAgIHZhciBpbmRleCA9IDA7XG4gICAgdmFyIHNvdXJjZSA9IFwiX19wKz0nXCI7XG4gICAgdGV4dC5yZXBsYWNlKG1hdGNoZXIsIGZ1bmN0aW9uKG1hdGNoLCBlc2NhcGUsIGludGVycG9sYXRlLCBldmFsdWF0ZSwgb2Zmc2V0KSB7XG4gICAgICBzb3VyY2UgKz0gdGV4dC5zbGljZShpbmRleCwgb2Zmc2V0KVxuICAgICAgICAucmVwbGFjZShlc2NhcGVyLCBmdW5jdGlvbihtYXRjaCkgeyByZXR1cm4gJ1xcXFwnICsgZXNjYXBlc1ttYXRjaF07IH0pO1xuXG4gICAgICBpZiAoZXNjYXBlKSB7XG4gICAgICAgIHNvdXJjZSArPSBcIicrXFxuKChfX3Q9KFwiICsgZXNjYXBlICsgXCIpKT09bnVsbD8nJzpfLmVzY2FwZShfX3QpKStcXG4nXCI7XG4gICAgICB9XG4gICAgICBpZiAoaW50ZXJwb2xhdGUpIHtcbiAgICAgICAgc291cmNlICs9IFwiJytcXG4oKF9fdD0oXCIgKyBpbnRlcnBvbGF0ZSArIFwiKSk9PW51bGw/Jyc6X190KStcXG4nXCI7XG4gICAgICB9XG4gICAgICBpZiAoZXZhbHVhdGUpIHtcbiAgICAgICAgc291cmNlICs9IFwiJztcXG5cIiArIGV2YWx1YXRlICsgXCJcXG5fX3ArPSdcIjtcbiAgICAgIH1cbiAgICAgIGluZGV4ID0gb2Zmc2V0ICsgbWF0Y2gubGVuZ3RoO1xuICAgICAgcmV0dXJuIG1hdGNoO1xuICAgIH0pO1xuICAgIHNvdXJjZSArPSBcIic7XFxuXCI7XG5cbiAgICAvLyBJZiBhIHZhcmlhYmxlIGlzIG5vdCBzcGVjaWZpZWQsIHBsYWNlIGRhdGEgdmFsdWVzIGluIGxvY2FsIHNjb3BlLlxuICAgIGlmICghc2V0dGluZ3MudmFyaWFibGUpIHNvdXJjZSA9ICd3aXRoKG9ianx8e30pe1xcbicgKyBzb3VyY2UgKyAnfVxcbic7XG5cbiAgICBzb3VyY2UgPSBcInZhciBfX3QsX19wPScnLF9faj1BcnJheS5wcm90b3R5cGUuam9pbixcIiArXG4gICAgICBcInByaW50PWZ1bmN0aW9uKCl7X19wKz1fX2ouY2FsbChhcmd1bWVudHMsJycpO307XFxuXCIgK1xuICAgICAgc291cmNlICsgXCJyZXR1cm4gX19wO1xcblwiO1xuXG4gICAgdHJ5IHtcbiAgICAgIHJlbmRlciA9IG5ldyBGdW5jdGlvbihzZXR0aW5ncy52YXJpYWJsZSB8fCAnb2JqJywgJ18nLCBzb3VyY2UpO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIGUuc291cmNlID0gc291cmNlO1xuICAgICAgdGhyb3cgZTtcbiAgICB9XG5cbiAgICBpZiAoZGF0YSkgcmV0dXJuIHJlbmRlcihkYXRhLCBfKTtcbiAgICB2YXIgdGVtcGxhdGUgPSBmdW5jdGlvbihkYXRhKSB7XG4gICAgICByZXR1cm4gcmVuZGVyLmNhbGwodGhpcywgZGF0YSwgXyk7XG4gICAgfTtcblxuICAgIC8vIFByb3ZpZGUgdGhlIGNvbXBpbGVkIGZ1bmN0aW9uIHNvdXJjZSBhcyBhIGNvbnZlbmllbmNlIGZvciBwcmVjb21waWxhdGlvbi5cbiAgICB0ZW1wbGF0ZS5zb3VyY2UgPSAnZnVuY3Rpb24oJyArIChzZXR0aW5ncy52YXJpYWJsZSB8fCAnb2JqJykgKyAnKXtcXG4nICsgc291cmNlICsgJ30nO1xuXG4gICAgcmV0dXJuIHRlbXBsYXRlO1xuICB9O1xuXG4gIC8vIEFkZCBhIFwiY2hhaW5cIiBmdW5jdGlvbiwgd2hpY2ggd2lsbCBkZWxlZ2F0ZSB0byB0aGUgd3JhcHBlci5cbiAgXy5jaGFpbiA9IGZ1bmN0aW9uKG9iaikge1xuICAgIHJldHVybiBfKG9iaikuY2hhaW4oKTtcbiAgfTtcblxuICAvLyBPT1BcbiAgLy8gLS0tLS0tLS0tLS0tLS0tXG4gIC8vIElmIFVuZGVyc2NvcmUgaXMgY2FsbGVkIGFzIGEgZnVuY3Rpb24sIGl0IHJldHVybnMgYSB3cmFwcGVkIG9iamVjdCB0aGF0XG4gIC8vIGNhbiBiZSB1c2VkIE9PLXN0eWxlLiBUaGlzIHdyYXBwZXIgaG9sZHMgYWx0ZXJlZCB2ZXJzaW9ucyBvZiBhbGwgdGhlXG4gIC8vIHVuZGVyc2NvcmUgZnVuY3Rpb25zLiBXcmFwcGVkIG9iamVjdHMgbWF5IGJlIGNoYWluZWQuXG5cbiAgLy8gSGVscGVyIGZ1bmN0aW9uIHRvIGNvbnRpbnVlIGNoYWluaW5nIGludGVybWVkaWF0ZSByZXN1bHRzLlxuICB2YXIgcmVzdWx0ID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgcmV0dXJuIHRoaXMuX2NoYWluID8gXyhvYmopLmNoYWluKCkgOiBvYmo7XG4gIH07XG5cbiAgLy8gQWRkIGFsbCBvZiB0aGUgVW5kZXJzY29yZSBmdW5jdGlvbnMgdG8gdGhlIHdyYXBwZXIgb2JqZWN0LlxuICBfLm1peGluKF8pO1xuXG4gIC8vIEFkZCBhbGwgbXV0YXRvciBBcnJheSBmdW5jdGlvbnMgdG8gdGhlIHdyYXBwZXIuXG4gIGVhY2goWydwb3AnLCAncHVzaCcsICdyZXZlcnNlJywgJ3NoaWZ0JywgJ3NvcnQnLCAnc3BsaWNlJywgJ3Vuc2hpZnQnXSwgZnVuY3Rpb24obmFtZSkge1xuICAgIHZhciBtZXRob2QgPSBBcnJheVByb3RvW25hbWVdO1xuICAgIF8ucHJvdG90eXBlW25hbWVdID0gZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgb2JqID0gdGhpcy5fd3JhcHBlZDtcbiAgICAgIG1ldGhvZC5hcHBseShvYmosIGFyZ3VtZW50cyk7XG4gICAgICBpZiAoKG5hbWUgPT0gJ3NoaWZ0JyB8fCBuYW1lID09ICdzcGxpY2UnKSAmJiBvYmoubGVuZ3RoID09PSAwKSBkZWxldGUgb2JqWzBdO1xuICAgICAgcmV0dXJuIHJlc3VsdC5jYWxsKHRoaXMsIG9iaik7XG4gICAgfTtcbiAgfSk7XG5cbiAgLy8gQWRkIGFsbCBhY2Nlc3NvciBBcnJheSBmdW5jdGlvbnMgdG8gdGhlIHdyYXBwZXIuXG4gIGVhY2goWydjb25jYXQnLCAnam9pbicsICdzbGljZSddLCBmdW5jdGlvbihuYW1lKSB7XG4gICAgdmFyIG1ldGhvZCA9IEFycmF5UHJvdG9bbmFtZV07XG4gICAgXy5wcm90b3R5cGVbbmFtZV0gPSBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiByZXN1bHQuY2FsbCh0aGlzLCBtZXRob2QuYXBwbHkodGhpcy5fd3JhcHBlZCwgYXJndW1lbnRzKSk7XG4gICAgfTtcbiAgfSk7XG5cbiAgXy5leHRlbmQoXy5wcm90b3R5cGUsIHtcblxuICAgIC8vIFN0YXJ0IGNoYWluaW5nIGEgd3JhcHBlZCBVbmRlcnNjb3JlIG9iamVjdC5cbiAgICBjaGFpbjogZnVuY3Rpb24oKSB7XG4gICAgICB0aGlzLl9jaGFpbiA9IHRydWU7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuXG4gICAgLy8gRXh0cmFjdHMgdGhlIHJlc3VsdCBmcm9tIGEgd3JhcHBlZCBhbmQgY2hhaW5lZCBvYmplY3QuXG4gICAgdmFsdWU6IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHRoaXMuX3dyYXBwZWQ7XG4gICAgfVxuXG4gIH0pO1xuXG4gIC8vIEFNRCByZWdpc3RyYXRpb24gaGFwcGVucyBhdCB0aGUgZW5kIGZvciBjb21wYXRpYmlsaXR5IHdpdGggQU1EIGxvYWRlcnNcbiAgLy8gdGhhdCBtYXkgbm90IGVuZm9yY2UgbmV4dC10dXJuIHNlbWFudGljcyBvbiBtb2R1bGVzLiBFdmVuIHRob3VnaCBnZW5lcmFsXG4gIC8vIHByYWN0aWNlIGZvciBBTUQgcmVnaXN0cmF0aW9uIGlzIHRvIGJlIGFub255bW91cywgdW5kZXJzY29yZSByZWdpc3RlcnNcbiAgLy8gYXMgYSBuYW1lZCBtb2R1bGUgYmVjYXVzZSwgbGlrZSBqUXVlcnksIGl0IGlzIGEgYmFzZSBsaWJyYXJ5IHRoYXQgaXNcbiAgLy8gcG9wdWxhciBlbm91Z2ggdG8gYmUgYnVuZGxlZCBpbiBhIHRoaXJkIHBhcnR5IGxpYiwgYnV0IG5vdCBiZSBwYXJ0IG9mXG4gIC8vIGFuIEFNRCBsb2FkIHJlcXVlc3QuIFRob3NlIGNhc2VzIGNvdWxkIGdlbmVyYXRlIGFuIGVycm9yIHdoZW4gYW5cbiAgLy8gYW5vbnltb3VzIGRlZmluZSgpIGlzIGNhbGxlZCBvdXRzaWRlIG9mIGEgbG9hZGVyIHJlcXVlc3QuXG4gIGlmICh0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpIHtcbiAgICBkZWZpbmUoJ3VuZGVyc2NvcmUnLCBbXSwgZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gXztcbiAgICB9KTtcbiAgfVxufSkuY2FsbCh0aGlzKTtcbiIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSBhbmd1bGFyLm1vZHVsZSgnZmxpY2tyRHVwRmluZGVyQ29uZmlnJywgW10pXG4gIC5jb25zdGFudCgnT0FVVEhEX1VSTCcsICdodHRwczovL29hdXRoZC1sZWZhbnQuaGVyb2t1YXBwLmNvbScpXG4gIC5jb25zdGFudCgnQVBQX1BVQkxJQ19LRVknLCAnUXFTeEM5RnBYNVFzZlJoR1BwZjY4dzJnTFJFJykgLy9vYXV0aGQtbGVmYW50XG4gIC8vLmNvbnN0YW50KCdPQVVUSERfVVJMJywgJ2h0dHA6Ly9vYXV0aC5pbycpXG4gIC8vLmNvbnN0YW50KCdBUFBfUFVCTElDX0tFWScsICdjRjRnT2JsRVVwdWVUdHNMNDQtZ1ZqWmVlWE0nKSAvL29hdXRoLmlvXG4iLCIndXNlIHN0cmljdCc7XG5cbnJlcXVpcmUoJy4vLi4vLi4vYm93ZXJfY29tcG9uZW50cy91aS5ib290c3RyYXAvc3JjL3BhZ2luYXRpb24vcGFnaW5hdGlvbicpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGFuZ3VsYXIubW9kdWxlKFxuICAnZmxpY2tyRHVwRmluZGVyQ29udHJvbGxlcnMnLFxuICBbJ3VpLmJvb3RzdHJhcC5wYWdpbmF0aW9uJyxcbiAgIHJlcXVpcmUoJy4vY29uZmlnJykubmFtZSxcbiAgIHJlcXVpcmUoJy4vc2VydmljZXMnKS5uYW1lXSlcbiAgLmNvbnRyb2xsZXIoXG4gICAgJ3N0YXJ0Q3RybCcsXG4gICAgWyckaHR0cCcsICdPQVVUSERfVVJMJywgZnVuY3Rpb24oJGh0dHAsIE9BVVRIRF9VUkwsICRsb2cpIHtcbiAgICAgICRodHRwLmdldChPQVVUSERfVVJMKTtcbiAgICB9XSlcbiAgLmNvbnRyb2xsZXIoXG4gICAgJ3Bob3RvQ3RybCcsXG4gICAgWyckc2NvcGUnLCAnJGxvZycsICdGbGlja3InLCBmdW5jdGlvbigkc2NvcGUsICRsb2csIEZsaWNrcikge1xuICAgICAgdmFyIF8gPSByZXF1aXJlKFwiLi8uLi8uLi9ib3dlcl9jb21wb25lbnRzL3VuZGVyc2NvcmUvdW5kZXJzY29yZS5qc1wiKTtcbiAgICAgIHZhciBzcGVjaWFsVGFnID0gJ2ZsaWNrcmR1cGZpbmRlcic7XG4gICAgICAkc2NvcGUuaXRlbXNQZXJQYWdlID0gMTA7XG4gICAgICAkc2NvcGUubWF4U2l6ZSA9IDEwO1xuXG4gICAgICAkc2NvcGUudG9nZ2xlVGFnID0gZnVuY3Rpb24ocGhvdG8pIHtcbiAgICAgICAgaWYgKHBob3RvLmR1cGxpY2F0ZSkge1xuICAgICAgICAgIHJlbW92ZVRhZyhwaG90byk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgYWRkVGFnKHBob3RvKTtcbiAgICAgICAgfVxuICAgICAgfTtcblxuICAgICAgZnVuY3Rpb24gYWRkVGFnKHBob3RvKSB7XG4gICAgICAgIEZsaWNrci5nZXQoe1xuICAgICAgICAgIHBob3RvX2lkOiBwaG90by5pZCxcbiAgICAgICAgICBtZXRob2Q6ICdmbGlja3IucGhvdG9zLmFkZFRhZ3MnLFxuICAgICAgICAgIHRhZ3M6IHNwZWNpYWxUYWdcbiAgICAgICAgfSwgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgcGhvdG8uZHVwbGljYXRlID0gdHJ1ZTtcbiAgICAgICAgICAkc2NvcGUudGFnZ2VkRHVwbGljYXRlW3Bob3RvLmlkXSA9IHBob3RvO1xuICAgICAgICB9KTtcbiAgICAgIH07XG5cbiAgICAgIGZ1bmN0aW9uIHJlbW92ZVRhZyhwaG90bykge1xuICAgICAgICBGbGlja3IuZ2V0KHtcbiAgICAgICAgICBtZXRob2Q6ICdmbGlja3IucGhvdG9zLmdldEluZm8nLFxuICAgICAgICAgIHBob3RvX2lkOiBwaG90by5pZFxuICAgICAgICB9LCBmdW5jdGlvbihpbmZvKSB7XG4gICAgICAgICAgdmFyIHRhZyA9IF8uZmluZChpbmZvLnBob3RvLnRhZ3MudGFnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24odGFnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0YWcucmF3ID09PSBzcGVjaWFsVGFnO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgaWYgKHRhZykge1xuICAgICAgICAgICAgRmxpY2tyLmdldCh7XG4gICAgICAgICAgICAgIG1ldGhvZDogJ2ZsaWNrci5waG90b3MucmVtb3ZlVGFnJyxcbiAgICAgICAgICAgICAgcGhvdG9faWQ6IHBob3RvLmlkLFxuICAgICAgICAgICAgICB0YWdfaWQ6IHRhZy5pZFxuICAgICAgICAgICAgfSwgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgIHBob3RvLmR1cGxpY2F0ZSA9IGZhbHNlO1xuICAgICAgICAgICAgICAkc2NvcGUuZ3JvdXBzW2ZpbmdlcnByaW50KHBob3RvKV1bcGhvdG8uaWRdID0gcGhvdG87XG4gICAgICAgICAgICAgIGRlbGV0ZSAkc2NvcGUudGFnZ2VkRHVwbGljYXRlW3Bob3RvLmlkXTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9O1xuXG4gICAgICBmdW5jdGlvbiBjaGVja1RhZyhwaG90bykge1xuICAgICAgICBwaG90b1snZHVwbGljYXRlJ10gPSBfLmNvbnRhaW5zKHBob3RvLnRhZ3Muc3BsaXQoLyAvKSwgc3BlY2lhbFRhZyk7XG4gICAgICAgIHJldHVybiBwaG90bztcbiAgICAgIH1cblxuICAgICAgZnVuY3Rpb24gZmluZ2VycHJpbnQocGhvdG8pIHtcbiAgICAgICAgcmV0dXJuIHBob3RvLnRpdGxlLnJlcGxhY2UoLy1bMC05XSQvLCAnJykgKyAnIyMnICsgcGhvdG8uZGF0ZXRha2VuO1xuICAgICAgfVxuXG4gICAgICBmdW5jdGlvbiBhdExlYXN0VHdvKGdyb3VwKSB7XG4gICAgICAgIHJldHVybiBncm91cFsxXS5sZW5ndGggPiAxO1xuICAgICAgfVxuXG4gICAgICBmdW5jdGlvbiBkYXRlVGFrZW5Jc01vc3RHcmFudWxhcihwaG90bykge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgLy9yZXR1cm4gcGhvdG8uZGF0ZXRha2VuZ3JhbnVsYXJpdHkgPT0gXCIwXCI7XG4gICAgICB9XG5cbiAgICAgIEZsaWNrci5nZXQoe3RhZ3M6IHNwZWNpYWxUYWd9LCBmdW5jdGlvbihyZXN1bHQpIHtcbiAgICAgICAgdmFyIGNoZWNrZWRSZXN1bHRzID0gXy5tYXAocmVzdWx0LnBob3Rvcy5waG90bywgY2hlY2tUYWcpO1xuICAgICAgICAkc2NvcGUudGFnZ2VkRHVwbGljYXRlID0gXy5pbmRleEJ5KGNoZWNrZWRSZXN1bHRzLCAnaWQnKTtcbiAgICAgIH0pO1xuXG4gICAgICBmdW5jdGlvbiBncm91cER1cGxpY2F0ZXMocmVzdWx0cykge1xuICAgICAgICB2YXIgcmVzdWx0czIgPSBfLmZpbHRlcihyZXN1bHRzLCBkYXRlVGFrZW5Jc01vc3RHcmFudWxhcik7XG4gICAgICAgIHZhciByZXN1bHRzMyA9IF8ubWFwKHJlc3VsdHMyLCBjaGVja1RhZyk7XG4gICAgICAgIHZhciBncm91cHMgPSBfLmdyb3VwQnkocmVzdWx0czMsIGZpbmdlcnByaW50KTtcbiAgICAgICAgdmFyIGdyb3VwczIgPSBfLm9iamVjdChfLmZpbHRlcihfLnBhaXJzKGdyb3VwcyksIGF0TGVhc3RUd28pKTtcbiAgICAgICAgJHNjb3BlLmdyb3VwcyA9IGdyb3VwczI7XG4gICAgICAgIHVwZGF0ZVZpc2libGVHcm91cHMoKVxuICAgICAgfVxuXG4gICAgICBmdW5jdGlvbiBnZXRQYWdlKHBhZ2UsIHBob3Rvc0FjYykge1xuICAgICAgICAkc2NvcGUucGFnZSA9IHBhZ2U7XG4gICAgICAgIEZsaWNrci5nZXQoe3BhZ2U6IHBhZ2UsIHBlcl9wYWdlOiA1MDB9LCBmdW5jdGlvbihyZXN1bHQpIHtcbiAgICAgICAgICAkc2NvcGUudG90YWxQYWdlcyA9IHJlc3VsdC5waG90b3MucGFnZXM7XG4gICAgICAgICAgdmFyIHBob3Rvc0FjYzIgPSBwaG90b3NBY2MuY29uY2F0KHJlc3VsdC5waG90b3MucGhvdG8pO1xuICAgICAgICAgIGlmIChwYWdlIDwgcmVzdWx0LnBob3Rvcy5wYWdlcykge1xuICAgICAgICAgICAgZ2V0UGFnZShwYWdlICsgMSwgcGhvdG9zQWNjMik7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICRzY29wZS5pbml0aWFsRG93bmxvYWQgPSBmYWxzZTtcbiAgICAgICAgICB9XG4gICAgICAgICAgZ3JvdXBEdXBsaWNhdGVzKHBob3Rvc0FjYzIpO1xuICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgICAgZnVuY3Rpb24gdXBkYXRlVmlzaWJsZUdyb3VwcygpIHtcbiAgICAgICAgJHNjb3BlLnRvdGFsSXRlbXMgPSBfLnNpemUoJHNjb3BlLmdyb3Vwcyk7XG4gICAgICAgIHZhciBmaXJzdCA9ICgoJHNjb3BlLmN1cnJlbnRQYWdlIC0gMSkgKiAkc2NvcGUuaXRlbXNQZXJQYWdlKTtcbiAgICAgICAgdmFyIGxhc3QgPSAkc2NvcGUuY3VycmVudFBhZ2UgKiAkc2NvcGUuaXRlbXNQZXJQYWdlO1xuICAgICAgICAkc2NvcGUudmlzaWJsZUdyb3VwcyA9IF8ucGljaygkc2NvcGUuZ3JvdXBzLCBfLmtleXMoJHNjb3BlLmdyb3Vwcykuc2xpY2UoZmlyc3QsIGxhc3QpKTtcbiAgICAgIH1cblxuICAgICAgJHNjb3BlLnBhZ2VDaGFuZ2VkID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHVwZGF0ZVZpc2libGVHcm91cHMoKVxuICAgICAgfTtcblxuICAgICAgJHNjb3BlLnRvdGFsSXRlbXMgPSAwO1xuICAgICAgJHNjb3BlLmN1cnJlbnRQYWdlID0gMTtcbiAgICAgICRzY29wZS5pbml0aWFsRG93bmxvYWQgPSB0cnVlO1xuICAgICAgZ2V0UGFnZSgxLCBbXSk7XG4gICAgfV0pO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGFuZ3VsYXIubW9kdWxlKCdPQXV0aCcsIFtdKVxuICAuZmFjdG9yeSgnT0F1dGgnLCBbJyR3aW5kb3cnLCAnJGxvZycsIGZ1bmN0aW9uKCR3aW5kb3csICRsb2cpIHtcbiAgLy8ganF1ZXJ5IGZyb20gY2RuIHZpYSBpbmRleC5odG1sIGZvciBub3dcbiAgLy8gdmFyIGpRdWVyeSA9IHJlcXVpcmUoJ2pxdWVyeScpO1xuICAvLyBnbG9iYWwualF1ZXJ5ID0galF1ZXJ5O1xuICByZXF1aXJlKFwiLi8uLi8uLi9ib3dlcl9jb21wb25lbnRzL29hdXRoLWpzL2Rpc3Qvb2F1dGgubWluLmpzXCIpO1xuICByZXR1cm4gJHdpbmRvdy5PQXV0aDtcbn1dKTtcbiIsIid1c2Ugc3RyaWN0JztcblxucmVxdWlyZShcIi4vLi4vLi4vYm93ZXJfY29tcG9uZW50cy9hbmd1bGFyLXJlc291cmNlL2FuZ3VsYXItcmVzb3VyY2UuanNcIik7XG5cbm1vZHVsZS5leHBvcnRzID0gYW5ndWxhci5tb2R1bGUoXG4gICdmbGlja3JEdXBGaW5kZXJTZXJ2aWNlcycsXG4gIFsnbmdSZXNvdXJjZScsIHJlcXVpcmUoJy4vY29uZmlnJykubmFtZSwgcmVxdWlyZSgnLi9vYXV0aC1zaGltJykubmFtZV0pXG4gIC5zZXJ2aWNlKFxuICAgICdGbGlja3InLFxuICAgIFsnJGxvZycsICckcmVzb3VyY2UnLCAnJGh0dHAnLCAnJHEnLCAnJGxvY2F0aW9uJywgJ09BdXRoJywgJ09BVVRIRF9VUkwnLCAnQVBQX1BVQkxJQ19LRVknLFxuICAgICBmdW5jdGlvbihcbiAgICAgICAkbG9nLCAkcmVzb3VyY2UsICRodHRwLCAkcSwgJGxvY2F0aW9uLCBPQXV0aCwgT0FVVEhEX1VSTCwgQVBQX1BVQkxJQ19LRVkpIHtcbiAgICAgICBpZiAoJGxvY2F0aW9uLmhhc2goKSA9PT0gJycpIHsgJGxvY2F0aW9uLnBhdGgoJy8nKTsgfSAvL3NvIHJlZGlyZWN0IHRvIGFic1VybCgpIHdvcmtzXG4gICAgICAgT0F1dGguaW5pdGlhbGl6ZShBUFBfUFVCTElDX0tFWSwge2NhY2hlOiB0cnVlfSk7XG4gICAgICAgT0F1dGguc2V0T0F1dGhkVVJMKE9BVVRIRF9VUkwpO1xuICAgICAgIHZhciByZXNvdXJjZSA9ICRxLmRlZmVyKCk7XG4gICAgICAgZnVuY3Rpb24gZG9uZUhhbmRsZXIocmVzdWx0KSB7XG4gICAgICAgICB2YXIga2V5ID0gQVBQX1BVQkxJQ19LRVk7XG4gICAgICAgICB2YXIgb2F1dGhpbyA9ICdrPScgKyBrZXk7XG4gICAgICAgICBvYXV0aGlvICs9ICcmb2F1dGh2PTEnO1xuICAgICAgICAgZnVuY3Rpb24ga3ZfcmVzdWx0KGtleSkge1xuICAgICAgICAgICByZXR1cm4gJyYnK2tleSsnPScrZW5jb2RlVVJJQ29tcG9uZW50KHJlc3VsdFtrZXldKTtcbiAgICAgICAgIH1cbiAgICAgICAgIG9hdXRoaW8gKz0ga3ZfcmVzdWx0KCdvYXV0aF90b2tlbicpO1xuICAgICAgICAgb2F1dGhpbyArPSBrdl9yZXN1bHQoJ29hdXRoX3Rva2VuX3NlY3JldCcpO1xuICAgICAgICAgb2F1dGhpbyArPSBrdl9yZXN1bHQoJ2NvZGUnKTtcbiAgICAgICAgICRodHRwLmRlZmF1bHRzLmhlYWRlcnMuY29tbW9uID0ge29hdXRoaW86IG9hdXRoaW99O1xuICAgICAgICAgcmVzb3VyY2UucmVzb2x2ZShcbiAgICAgICAgICAgJHJlc291cmNlKFxuICAgICAgICAgICAgIE9BVVRIRF9VUkwgKyAnL3JlcXVlc3QvZmxpY2tyL3NlcnZpY2VzL3Jlc3QvJyxcbiAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICBtZXRob2Q6IFwiZmxpY2tyLnBob3Rvcy5zZWFyY2hcIixcbiAgICAgICAgICAgICAgIGZvcm1hdDogXCJqc29uXCIsXG4gICAgICAgICAgICAgICB1c2VyX2lkOiBcIm1lXCIsXG4gICAgICAgICAgICAgICBwZXJfcGFnZTogMTAsXG4gICAgICAgICAgICAgICAvL3RleHQ6IFwidmlzaW9uOm91dGRvb3JcIixcbiAgICAgICAgICAgICAgIC8vdGFnczogXCJ2aXNpb246b3V0ZG9vcix2aXNpb246b3V0ZG9vcj0wOTlcIixcbiAgICAgICAgICAgICAgIC8vbWFjaGluZV90YWdzOiBcIm91dGRvb3JcIixcbiAgICAgICAgICAgICAgIGV4dHJhczogXCJkYXRlX3VwbG9hZCxkYXRlX3Rha2VuLHRhZ3NcIixcbiAgICAgICAgICAgICAgIG5vanNvbmNhbGxiYWNrOiAxXG4gICAgICAgICAgICAgfSkpO1xuICAgICAgIH1cblxuICAgICAgIHZhciBvYXV0aENhbGxiYWNrID0gT0F1dGguY2FsbGJhY2soJ2ZsaWNrcicpO1xuICAgICAgIGlmIChvYXV0aENhbGxiYWNrKSB7XG4gICAgICAgICBvYXV0aENhbGxiYWNrLmRvbmUoZG9uZUhhbmRsZXIpLmZhaWwoZnVuY3Rpb24oY2FsbGJhY2tFcnJvcikge1xuICAgICAgICAgICAkbG9nLmRlYnVnKCdPQXV0aC5jYWxsYmFjayBlcnJvcjogJywgY2FsbGJhY2tFcnJvcik7XG4gICAgICAgICB9KTtcbiAgICAgICB9IGVsc2Uge1xuICAgICAgICAgLy8gdGhlIGNhbGxiYWNrIHVybCBtdXN0IGJlIHJvdXRlZCB0aHJvdWdoIC5vdGhlcndpc2UgaW4gdGhlIGFwcCByb3V0ZXJcbiAgICAgICAgIE9BdXRoLnJlZGlyZWN0KCdmbGlja3InLCAkbG9jYXRpb24uYWJzVXJsKCkpO1xuICAgICAgIH1cbiAgICAgICByZXR1cm4gcmVzb3VyY2UucHJvbWlzZTtcbiAgICAgfV0pO1xuIl19
