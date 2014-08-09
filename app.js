(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"./src/javascript/app.js":[function(require,module,exports){
'use strict';

require("./../../bower_components/angular-route/angular-route.js");

angular.module('flickrDupFinder', ['ngRoute', require('./controllers').name])
  .config(['$routeProvider', function($routeProvider) {
    // the oauth redirect callback page must be matched with .otherwise
    $routeProvider
      .otherwise({
        templateUrl: 'partials/photos.html',
        controller: 'photoCtrl',
        resolve: { 'Flickr': 'Flickr' }
      });
  }]);

},{"./../../bower_components/angular-route/angular-route.js":"/Users/fabian/git/lefant/ng-flickrdupfinder/bower_components/angular-route/angular-route.js","./controllers":"/Users/fabian/git/lefant/ng-flickrdupfinder/src/javascript/controllers.js"}],"/Users/fabian/git/lefant/ng-flickrdupfinder/bower_components/angular-resource/angular-resource.js":[function(require,module,exports){
/**
 * @license AngularJS v1.2.21
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
 *   If the parameter value is prefixed with `@` then the value of that parameter will be taken
 *   from the corresponding key on the data object (useful for non-GET operations).
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

},{}],"/Users/fabian/git/lefant/ng-flickrdupfinder/bower_components/angular-route/angular-route.js":[function(require,module,exports){
/**
 * @license AngularJS v1.2.21
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

},{}],"/Users/fabian/git/lefant/ng-flickrdupfinder/bower_components/oauth-js/dist/oauth.min.js":[function(require,module,exports){
!function a(b,c,d){function e(g,h){if(!c[g]){if(!b[g]){var i="function"==typeof require&&require;if(!h&&i)return i(g,!0);if(f)return f(g,!0);throw new Error("Cannot find module '"+g+"'")}var j=c[g]={exports:{}};b[g][0].call(j.exports,function(a){var c=b[g][1][a];return e(c?c:a)},j,j.exports,a,b,c,d)}return c[g].exports}for(var f="function"==typeof require&&require,g=0;g<d.length;g++)e(d[g]);return e}({1:[function(a,b){b.exports={oauthd_url:"https://oauth.io",oauthd_api:"https://oauth.io/api",version:"web-0.2.1",options:{}}},{}],2:[function(a,b){"use strict";var c,d,e,f,g;e=a("../config"),f=a("../tools/cookies"),d=a("../tools/cache"),c=a("../tools/url"),g=a("../tools/sha1"),b.exports=function(b,h,i,j){var k,l,m,n,o,p,q,r;return k=i,c=c(h),f.init(e,h),d.init(f,e),n={request:{}},r={},q={},p={execProvidersCb:function(a,b,c){var d,e;if(q[a]){d=q[a],delete q[a];for(e in d)d[e](b,c)}},getDescription:function(a,b,c){return b=b||{},"object"==typeof r[a]?c(null,r[a]):(r[a]||p.fetchDescription(a),b.wait?(q[a]=q[a]||[],void q[a].push(c)):c(null,{}))}},e.oauthd_base=c.getAbsUrl(e.oauthd_url).match(/^.{2,5}:\/\/[^/]+/)[0],l=[],m=void 0,(o=function(){var a,b;b=/[\\#&]oauthio=([^&]*)/.exec(h.location.hash),b&&(h.location.hash=h.location.hash.replace(/&?oauthio=[^&]*/,""),m=decodeURIComponent(b[1].replace(/\+/g," ")),a=f.readCookie("oauthio_state"),a&&(l.push(a),f.eraseCookie("oauthio_state")))})(),b.location_operations={reload:function(){return h.location.reload()},getHash:function(){return h.location.hash},setHash:function(a){return h.location.hash=a},changeHref:function(a){return h.location.href=a}},function(i){var k,o,q,s;k=function(b){n.request=a("./oauthio_requests")(b,e,l,d,p),p.fetchDescription=function(a){r[a]||(r[a]=!0,b.ajax({url:e.oauthd_api+"/providers/"+a,data:{extend:!0},dataType:"json"}).done(function(b){r[a]=b.data,p.execProvidersCb(a,null,b.data)}).always(function(){"object"!=typeof r[a]&&(delete r[a],p.execProvidersCb(a,new Error("Unable to fetch request description")))}))}},null==i.OAuth&&(i.OAuth={initialize:function(a,b){var c;if(e.key=a,b)for(c in b)e.options[c]=b[c]},setOAuthdURL:function(a){e.oauthd_url=a,e.oauthd_base=c.getAbsUrl(e.oauthd_url).match(/^.{2,5}:\/\/[^/]+/)[0]},getVersion:function(){return e.version},create:function(a,b,c){var e,f,g,h;if(!b)return d.tryCache(i.OAuth,a,!0);"object"!=typeof c&&p.fetchDescription(a),f=function(d){return n.request.mkHttp(a,b,c,d)},g=function(d,e){return n.request.mkHttpEndpoint(a,b,c,d,e)},h={};for(e in b)h[e]=b[e];return h.get=f("GET"),h.post=f("POST"),h.put=f("PUT"),h.patch=f("PATCH"),h.del=f("DELETE"),h.me=n.request.mkHttpMe(a,b,c,"GET"),h},popup:function(a,f,k){var m,o,p,q,r,s,t,u,v,w;return p=function(a){if(a.origin===e.oauthd_base){try{s.close()}catch(b){}return f.data=a.data,n.request.sendCallback(f,m)}},s=void 0,o=void 0,t=void 0,m=null!=(w=b.jQuery)?w.Deferred():void 0,f=f||{},e.key?(2===arguments.length&&"function"==typeof f&&(k=f,f={}),d.cacheEnabled(f.cache)&&(q=d.tryCache(i.OAuth,a,f.cache))?(null!=m&&m.resolve(q),k?k(null,q):m.promise()):(f.state||(f.state=g.create_hash(),f.state_type="client"),l.push(f.state),r=e.oauthd_url+"/auth/"+a+"?k="+e.key,r+="&d="+encodeURIComponent(c.getAbsUrl("/")),f&&(r+="&opts="+encodeURIComponent(JSON.stringify(f))),f.wnd_settings?(v=f.wnd_settings,delete f.wnd_settings):v={width:Math.floor(.8*b.outerWidth),height:Math.floor(.5*b.outerHeight)},null==v.height&&(v.height=v.height<350?350:void 0),null==v.width&&(v.width=v.width<800?800:void 0),null==v.left&&(v.left=b.screenX+(b.outerWidth-v.width)/2),null==v.top&&(v.top=b.screenY+(b.outerHeight-v.height)/8),u="width="+v.width+",height="+v.height,u+=",toolbar=0,scrollbars=1,status=1,resizable=1,location=1,menuBar=0",u+=",left="+v.left+",top="+v.top,f={provider:a,cache:f.cache},f.callback=function(a,c){return b.removeEventListener?b.removeEventListener("message",p,!1):b.detachEvent?b.detachEvent("onmessage",p):h.detachEvent&&h.detachEvent("onmessage",p),f.callback=function(){},t&&(clearTimeout(t),t=void 0),k?k(a,c):void 0},b.attachEvent?b.attachEvent("onmessage",p):h.attachEvent?h.attachEvent("onmessage",p):b.addEventListener&&b.addEventListener("message",p,!1),"undefined"!=typeof chrome&&chrome.runtime&&chrome.runtime.onMessageExternal&&chrome.runtime.onMessageExternal.addListener(function(a,b){return a.origin=b.url.match(/^.{2,5}:\/\/[^/]+/)[0],null!=m&&m.resolve(),p(a)}),!o&&(-1!==j.userAgent.indexOf("MSIE")||j.appVersion.indexOf("Trident/")>0)&&(o=h.createElement("iframe"),o.src=e.oauthd_url+"/auth/iframe?d="+encodeURIComponent(c.getAbsUrl("/")),o.width=0,o.height=0,o.frameBorder=0,o.style.visibility="hidden",h.body.appendChild(o)),t=setTimeout(function(){null!=m&&m.reject(new Error("Authorization timed out")),f.callback&&"function"==typeof f.callback&&f.callback(new Error("Authorization timed out"));try{s.close()}catch(a){}},12e5),s=b.open(r,"Authorization",u),s?s.focus():(null!=m&&m.reject(new Error("Could not open a popup")),f.callback&&"function"==typeof f.callback&&f.callback(new Error("Could not open a popup"))),null!=m?m.promise():void 0)):(null!=m&&m.reject(new Error("OAuth object must be initialized")),null==k?m.promise():k(new Error("OAuth object must be initialized")))},redirect:function(a,h,j){var k,l;return 2===arguments.length&&(j=h,h={}),d.cacheEnabled(h.cache)&&(l=d.tryCache(i.OAuth,a,h.cache))?(j=c.getAbsUrl(j)+(-1===j.indexOf("#")?"#":"&")+"oauthio=cache",b.location_operations.changeHref(j),void b.location_operations.reload()):(h.state||(h.state=g.create_hash(),h.state_type="client"),f.createCookie("oauthio_state",h.state),k=encodeURIComponent(c.getAbsUrl(j)),j=e.oauthd_url+"/auth/"+a+"?k="+e.key,j+="&redirect_uri="+k,h&&(j+="&opts="+encodeURIComponent(JSON.stringify(h))),void b.location_operations.changeHref(j))},callback:function(a,c,e){var f,g,h;if(f=null!=(h=b.jQuery)?h.Deferred():void 0,1===arguments.length&&"function"==typeof a&&(e=a,a=void 0,c={}),1===arguments.length&&"string"==typeof a&&(c={}),2===arguments.length&&"function"==typeof c&&(e=c,c={}),d.cacheEnabled(c.cache)||"cache"===m){if(g=d.tryCache(i.OAuth,a,c.cache),"cache"===m&&("string"!=typeof a||!a))return null!=f&&f.reject(new Error("You must set a provider when using the cache")),e?e(new Error("You must set a provider when using the cache")):null!=f?f.promise():void 0;if(g){if(!e)return null!=f&&f.resolve(g),null!=f?f.promise():void 0;if(g)return e(null,g)}}return m?(n.request.sendCallback({data:m,provider:a,cache:c.cache,callback:e},f),null!=f?f.promise():void 0):void 0},clearCache:function(a){f.eraseCookie("oauthio_provider_"+a)},http_me:function(a){n.request.http_me&&n.request.http_me(a)},http:function(a){n.request.http&&n.request.http(a)}},"undefined"==typeof b.jQuery?(s=[],o=void 0,"undefined"!=typeof chrome&&chrome.extension?o=function(){return function(){throw new Error("Please include jQuery before oauth.js")}}:(q=h.createElement("script"),q.src="//code.jquery.com/jquery.min.js",q.type="text/javascript",q.onload=function(){var a;k(b.jQuery);for(a in s)s[a].fn.apply(null,s[a].args)},h.getElementsByTagName("head")[0].appendChild(q),o=function(a){return function(){var b,c;c=[];for(b in arguments)c[b]=arguments[b];s.push({fn:a,args:c})}}),n.request.http=o(function(){n.request.http.apply(i.OAuth,arguments)}),p.fetchDescription=o(function(){p.fetchDescription.apply(p,arguments)}),n.request=a("./oauthio_requests")(b.jQuery,e,l,d,p)):k(b.jQuery))}}},{"../config":1,"../tools/cache":5,"../tools/cookies":6,"../tools/sha1":7,"../tools/url":8,"./oauthio_requests":3}],3:[function(a,b){var c,d=[].indexOf||function(a){for(var b=0,c=this.length;c>b;b++)if(b in this&&this[b]===a)return b;return-1};c=a("../tools/url")(),b.exports=function(a,b,e,f,g){return{http:function(e){var f,h,i,j,k;i=function(){var e,f,g,h;if(h=k.oauthio.request||{},!h.cors){k.url=encodeURIComponent(k.url),"/"!==k.url[0]&&(k.url="/"+k.url),k.url=b.oauthd_url+"/request/"+k.oauthio.provider+k.url,k.headers=k.headers||{},k.headers.oauthio="k="+b.key,k.oauthio.tokens.oauth_token&&k.oauthio.tokens.oauth_token_secret&&(k.headers.oauthio+="&oauthv=1");for(f in k.oauthio.tokens)k.headers.oauthio+="&"+encodeURIComponent(f)+"="+encodeURIComponent(k.oauthio.tokens[f]);return delete k.oauthio,a.ajax(k)}if(k.oauthio.tokens){if(k.oauthio.tokens.access_token&&(k.oauthio.tokens.token=k.oauthio.tokens.access_token),k.url.match(/^[a-z]{2,16}:\/\//)||("/"!==k.url[0]&&(k.url="/"+k.url),k.url=h.url+k.url),k.url=c.replaceParam(k.url,k.oauthio.tokens,h.parameters),h.query){g=[];for(e in h.query)g.push(encodeURIComponent(e)+"="+encodeURIComponent(c.replaceParam(h.query[e],k.oauthio.tokens,h.parameters)));k.url+=d.call(k.url,"?")>=0?"&"+g:"?"+g}if(h.headers){k.headers=k.headers||{};for(e in h.headers)k.headers[e]=c.replaceParam(h.headers[e],k.oauthio.tokens,h.parameters)}return delete k.oauthio,a.ajax(k)}},k={},j=void 0;for(j in e)k[j]=e[j];return k.oauthio.request&&k.oauthio.request!==!0?i():(h={wait:!!k.oauthio.request},f=null!=a?a.Deferred():void 0,g.getDescription(k.oauthio.provider,h,function(a,b){return a?null!=f?f.reject(a):void 0:(k.oauthio.request=k.oauthio.tokens.oauth_token&&k.oauthio.tokens.oauth_token_secret?b.oauth1&&b.oauth1.request:b.oauth2&&b.oauth2.request,void(null!=f&&f.resolve()))}),null!=f?f.then(i):void 0)},http_me:function(c){var d,e,f,h,i;f=function(){var c,d,e,f;c=null!=a?a.Deferred():void 0,f=i.oauthio.request||{},i.url=b.oauthd_url+"/auth/"+i.oauthio.provider+"/me",i.headers=i.headers||{},i.headers.oauthio="k="+b.key,i.oauthio.tokens.oauth_token&&i.oauthio.tokens.oauth_token_secret&&(i.headers.oauthio+="&oauthv=1");for(d in i.oauthio.tokens)i.headers.oauthio+="&"+encodeURIComponent(d)+"="+encodeURIComponent(i.oauthio.tokens[d]);return delete i.oauthio,e=a.ajax(i),a.when(e).done(function(a){null!=c&&c.resolve(a.data)}).fail(function(a){a.responseJSON?null!=c&&c.reject(a.responseJSON.data):null!=c&&c.reject(new Error("An error occured while trying to access the resource"))}),null!=c?c.promise():void 0},i={};for(h in c)i[h]=c[h];return i.oauthio.request&&i.oauthio.request!==!0?f():(e={wait:!!i.oauthio.request},d=null!=a?a.Deferred():void 0,g.getDescription(i.oauthio.provider,e,function(a,b){return a?null!=d?d.reject(a):void 0:(i.oauthio.request=i.oauthio.tokens.oauth_token&&i.oauthio.tokens.oauth_token_secret?b.oauth1&&b.oauth1.request:b.oauth2&&b.oauth2.request,void(null!=d&&d.resolve()))}),null!=d?d.then(f):void 0)},mkHttp:function(a,b,c,d){var e;return e=this,function(f,g){var h,i;if(i={},"string"==typeof f){if("object"==typeof g)for(h in g)i[h]=g[h];i.url=f}else if("object"==typeof f)for(h in f)i[h]=f[h];return i.type=i.type||d,i.oauthio={provider:a,tokens:b,request:c},e.http(i)}},mkHttpMe:function(a,b,c,d){var e;return e=this,function(f){var g;return g={},g.type=g.type||d,g.oauthio={provider:a,tokens:b,request:c},g.data=g.data||{},g.data.filter=f?f.join(","):void 0,e.http_me(g)}},sendCallback:function(a,b){var c,d,g,h,i,j,k,l,m;c=this,d=void 0,h=void 0;try{d=JSON.parse(a.data)}catch(n){return g=n,null!=b&&b.reject(new Error("Error while parsing result")),a.callback(new Error("Error while parsing result"))}if(d&&d.provider){if(a.provider&&d.provider.toLowerCase()!==a.provider.toLowerCase())return h=new Error("Returned provider name does not match asked provider"),null!=b&&b.reject(h),a.callback&&"function"==typeof a.callback?a.callback(h):void 0;if("error"===d.status||"fail"===d.status)return h=new Error(d.message),h.body=d.data,null!=b&&b.reject(h),a.callback&&"function"==typeof a.callback?a.callback(h):void 0;if("success"!==d.status||!d.data)return h=new Error,h.body=d.data,null!=b&&b.reject(h),a.callback&&"function"==typeof a.callback?a.callback(h):void 0;if(!d.state||-1===e.indexOf(d.state))return null!=b&&b.reject(new Error("State is not matching")),a.callback&&"function"==typeof a.callback?a.callback(new Error("State is not matching")):void 0;if(a.provider||(d.data.provider=d.provider),l=d.data,f.cacheEnabled(a.cache)&&l&&f.storeCache(d.provider,l),k=l.request,delete l.request,m=void 0,l.access_token?m={access_token:l.access_token}:l.oauth_token&&l.oauth_token_secret&&(m={oauth_token:l.oauth_token,oauth_token_secret:l.oauth_token_secret}),!k)return null!=b&&b.resolve(l),a.callback&&"function"==typeof a.callback?a.callback(null,l):void 0;if(k.required)for(i in k.required)m[k.required[i]]=l[k.required[i]];return j=function(a){return c.mkHttp(d.provider,m,k,a)},l.get=j("GET"),l.post=j("POST"),l.put=j("PUT"),l.patch=j("PATCH"),l.del=j("DELETE"),l.me=c.mkHttpMe(d.provider,m,k,"GET"),null!=b&&b.resolve(l),a.callback&&"function"==typeof a.callback?a.callback(null,l):void 0}}}}},{"../tools/url":8}],4:[function(a){var b,c;c="undefined"!=typeof jQuery&&null!==jQuery?jQuery:void 0,(b=a("./lib/oauth")(window,document,c,navigator))(window||this)},{"./lib/oauth":2}],5:[function(a,b){b.exports={init:function(a,b){return this.config=b,this.cookies=a},tryCache:function(a,b,c){var d,e,f;if(this.cacheEnabled(c)){if(c=this.cookies.readCookie("oauthio_provider_"+b),!c)return!1;c=decodeURIComponent(c)}if("string"==typeof c)try{c=JSON.parse(c)}catch(g){return d=g,!1}if("object"==typeof c){f={};for(e in c)"request"!==e&&"function"!=typeof c[e]&&(f[e]=c[e]);return a.create(b,f,c.request)}return!1},storeCache:function(a,b){this.cookies.createCookie("oauthio_provider_"+a,encodeURIComponent(JSON.stringify(b)),b.expires_in-10||3600)},cacheEnabled:function(a){return"undefined"==typeof a?this.config.options.cache:a}}},{}],6:[function(a,b){b.exports={init:function(a,b){return this.config=a,this.document=b},createCookie:function(a,b,c){var d;this.eraseCookie(a),d=new Date,d.setTime(d.getTime()+1e3*(c||1200)),c="; expires="+d.toGMTString(),this.document.cookie=a+"="+b+c+"; path=/"},readCookie:function(a){var b,c,d,e;for(e=a+"=",c=this.document.cookie.split(";"),d=0;d<c.length;){for(b=c[d];" "===b.charAt(0);)b=b.substring(1,b.length);if(0===b.indexOf(e))return b.substring(e.length,b.length);d++}return null},eraseCookie:function(a){var b;b=new Date,b.setTime(b.getTime()-864e5),this.document.cookie=a+"=; expires="+b.toGMTString()+"; path=/"}}},{}],7:[function(a,b){var c,d;d=0,c="",b.exports={hex_sha1:function(a){return this.rstr2hex(this.rstr_sha1(this.str2rstr_utf8(a)))},b64_sha1:function(a){return this.rstr2b64(this.rstr_sha1(this.str2rstr_utf8(a)))},any_sha1:function(a,b){return this.rstr2any(this.rstr_sha1(this.str2rstr_utf8(a)),b)},hex_hmac_sha1:function(a,b){return this.rstr2hex(this.rstr_hmac_sha1(this.str2rstr_utf8(a),this.str2rstr_utf8(b)))},b64_hmac_sha1:function(a,b){return this.rstr2b64(this.rstr_hmac_sha1(this.str2rstr_utf8(a),this.str2rstr_utf8(b)))},any_hmac_sha1:function(a,b,c){return this.rstr2any(this.rstr_hmac_sha1(this.str2rstr_utf8(a),this.str2rstr_utf8(b)),c)},sha1_vm_test:function(){return"a9993e364706816aba3e25717850c26c9cd0d89d"===thishex_sha1("abc").toLowerCase()},rstr_sha1:function(a){return this.binb2rstr(this.binb_sha1(this.rstr2binb(a),8*a.length))},rstr_hmac_sha1:function(a,b){var c,d,e,f,g;for(c=this.rstr2binb(a),c.length>16&&(c=this.binb_sha1(c,8*a.length)),f=Array(16),g=Array(16),e=0;16>e;)f[e]=909522486^c[e],g[e]=1549556828^c[e],e++;return d=this.binb_sha1(f.concat(this.rstr2binb(b)),512+8*b.length),this.binb2rstr(this.binb_sha1(g.concat(d),672))},rstr2hex:function(a){var b,c,e,f,g;try{}catch(h){b=h,d=0}for(c=d?"0123456789ABCDEF":"0123456789abcdef",f="",g=void 0,e=0;e<a.length;)g=a.charCodeAt(e),f+=c.charAt(g>>>4&15)+c.charAt(15&g),e++;return f},rstr2b64:function(a){var b,d,e,f,g,h,i;try{}catch(j){b=j,c=""}for(h="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",g="",f=a.length,d=0;f>d;){for(i=a.charCodeAt(d)<<16|(f>d+1?a.charCodeAt(d+1)<<8:0)|(f>d+2?a.charCodeAt(d+2):0),e=0;4>e;)g+=8*d+6*e>8*a.length?c:h.charAt(i>>>6*(3-e)&63),e++;d+=3}return g},rstr2any:function(a,b){var c,d,e,f,g,h,i,j,k;for(d=b.length,j=Array(),f=void 0,h=void 0,k=void 0,i=void 0,c=Array(Math.ceil(a.length/2)),f=0;f<c.length;)c[f]=a.charCodeAt(2*f)<<8|a.charCodeAt(2*f+1),f++;for(;c.length>0;){for(i=Array(),k=0,f=0;f<c.length;)k=(k<<16)+c[f],h=Math.floor(k/d),k-=h*d,(i.length>0||h>0)&&(i[i.length]=h),f++;j[j.length]=k,c=i}for(g="",f=j.length-1;f>=0;)g+=b.charAt(j[f]),f--;for(e=Math.ceil(8*a.length/(Math.log(b.length)/Math.log(2))),f=g.length;e>f;)g=b[0]+g,f++;return g},str2rstr_utf8:function(a){var b,c,d,e;for(c="",b=-1,d=void 0,e=void 0;++b<a.length;)d=a.charCodeAt(b),e=b+1<a.length?a.charCodeAt(b+1):0,d>=55296&&56319>=d&&e>=56320&&57343>=e&&(d=65536+((1023&d)<<10)+(1023&e),b++),127>=d?c+=String.fromCharCode(d):2047>=d?c+=String.fromCharCode(192|d>>>6&31,128|63&d):65535>=d?c+=String.fromCharCode(224|d>>>12&15,128|d>>>6&63,128|63&d):2097151>=d&&(c+=String.fromCharCode(240|d>>>18&7,128|d>>>12&63,128|d>>>6&63,128|63&d));return c},str2rstr_utf16le:function(a){var b,c;for(c="",b=0;b<a.length;)c+=String.fromCharCode(255&a.charCodeAt(b),a.charCodeAt(b)>>>8&255),b++;return c},str2rstr_utf16be:function(a){var b,c;for(c="",b=0;b<a.length;)c+=String.fromCharCode(a.charCodeAt(b)>>>8&255,255&a.charCodeAt(b)),b++;return c},rstr2binb:function(a){var b,c;for(c=Array(a.length>>2),b=0;b<c.length;)c[b]=0,b++;for(b=0;b<8*a.length;)c[b>>5]|=(255&a.charCodeAt(b/8))<<24-b%32,b+=8;return c},binb2rstr:function(a){var b,c;for(c="",b=0;b<32*a.length;)c+=String.fromCharCode(a[b>>5]>>>24-b%32&255),b+=8;return c},binb_sha1:function(a,b){var c,d,e,f,g,h,i,j,k,l,m,n,o,p;for(a[b>>5]|=128<<24-b%32,a[(b+64>>9<<4)+15]=b,p=Array(80),c=1732584193,d=-271733879,e=-1732584194,f=271733878,g=-1009589776,h=0;h<a.length;){for(j=c,k=d,l=e,m=f,n=g,i=0;80>i;)p[i]=16>i?a[h+i]:this.bit_rol(p[i-3]^p[i-8]^p[i-14]^p[i-16],1),o=this.safe_add(this.safe_add(this.bit_rol(c,5),this.sha1_ft(i,d,e,f)),this.safe_add(this.safe_add(g,p[i]),this.sha1_kt(i))),g=f,f=e,e=this.bit_rol(d,30),d=c,c=o,i++;c=this.safe_add(c,j),d=this.safe_add(d,k),e=this.safe_add(e,l),f=this.safe_add(f,m),g=this.safe_add(g,n),h+=16}return Array(c,d,e,f,g)},sha1_ft:function(a,b,c,d){return 20>a?b&c|~b&d:40>a?b^c^d:60>a?b&c|b&d|c&d:b^c^d},sha1_kt:function(a){return 20>a?1518500249:40>a?1859775393:60>a?-1894007588:-899497514},safe_add:function(a,b){var c,d;return c=(65535&a)+(65535&b),d=(a>>16)+(b>>16)+(c>>16),d<<16|65535&c},bit_rol:function(a,b){return a<<b|a>>>32-b},create_hash:function(){var a;return a=this.b64_sha1((new Date).getTime()+":"+Math.floor(9999999*Math.random())),a.replace(/\+/g,"-").replace(/\//g,"_").replace(/\=+$/,"")}}},{}],8:[function(a,b){b.exports=function(a){return{getAbsUrl:function(b){var c;return b.match(/^.{2,5}:\/\//)?b:"/"===b[0]?a.location.protocol+"//"+a.location.host+b:(c=a.location.protocol+"//"+a.location.host+a.location.pathname,"/"!==c[c.length-1]&&"#"!==b[0]?c+"/"+b:c+b)},replaceParam:function(a,b,c){return a=a.replace(/\{\{(.*?)\}\}/g,function(a,c){return b[c]||""}),c&&(a=a.replace(/\{(.*?)\}/g,function(a,b){return c[b]||""})),a}}}},{}]},{},[4]);
},{}],"/Users/fabian/git/lefant/ng-flickrdupfinder/bower_components/ui.bootstrap/src/pagination/pagination.js":[function(require,module,exports){
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

},{}],"/Users/fabian/git/lefant/ng-flickrdupfinder/bower_components/underscore/underscore.js":[function(require,module,exports){
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

},{}],"/Users/fabian/git/lefant/ng-flickrdupfinder/src/javascript/config.js":[function(require,module,exports){
'use strict';

module.exports = angular.module('flickrDupFinderConfig', [])
  .constant('OAUTHD_URL', 'http://nisse.lefant.net:6284')
  .constant('APP_PUBLIC_KEY', 'foRRKXfQipy7kziBuWDhh1Ibs_k') //nisse
  //.constant('APP_PUBLIC_KEY', 'cF4gOblEUpueTtsL44_k') //oauth.io

},{}],"/Users/fabian/git/lefant/ng-flickrdupfinder/src/javascript/controllers.js":[function(require,module,exports){
'use strict';

require('./../../bower_components/ui.bootstrap/src/pagination/pagination');

module.exports = angular.module(
  'flickrDupFinderControllers',
  ['ui.bootstrap.pagination', require('./services').name])
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
        $log.debug('updateVisibleGroups totalItems: ', $scope.totalItems);
        $log.debug('updateVisibleGroups currentPage: ', $scope.currentPage);
        $log.debug('updateVisibleGroups itemsPerPage: ', $scope.itemsPerPage);
        $log.debug('updateVisibleGroups first: ', first);
        $log.debug('updateVisibleGroups last: ', last);
      }

      $scope.pageChanged = function() {
        console.log('Page changed to: ' + $scope.currentPage);
        updateVisibleGroups()
      };

      $scope.totalItems = 0;
      $scope.currentPage = 1;
      $scope.initialDownload = true;
      getPage(1, []);
    }]);

},{"./../../bower_components/ui.bootstrap/src/pagination/pagination":"/Users/fabian/git/lefant/ng-flickrdupfinder/bower_components/ui.bootstrap/src/pagination/pagination.js","./../../bower_components/underscore/underscore.js":"/Users/fabian/git/lefant/ng-flickrdupfinder/bower_components/underscore/underscore.js","./services":"/Users/fabian/git/lefant/ng-flickrdupfinder/src/javascript/services.js"}],"/Users/fabian/git/lefant/ng-flickrdupfinder/src/javascript/oauth-shim.js":[function(require,module,exports){
'use strict';

module.exports = angular.module('OAuth', [])
  .factory('OAuth', ['$window', '$log', function($window, $log) {
  // jquery from cdn via index.html for now
  // var jQuery = require('jquery');
  // global.jQuery = jQuery;
  require("./../../bower_components/oauth-js/dist/oauth.min.js");
  return $window.OAuth;
}]);

},{"./../../bower_components/oauth-js/dist/oauth.min.js":"/Users/fabian/git/lefant/ng-flickrdupfinder/bower_components/oauth-js/dist/oauth.min.js"}],"/Users/fabian/git/lefant/ng-flickrdupfinder/src/javascript/services.js":[function(require,module,exports){
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

},{"./../../bower_components/angular-resource/angular-resource.js":"/Users/fabian/git/lefant/ng-flickrdupfinder/bower_components/angular-resource/angular-resource.js","./config":"/Users/fabian/git/lefant/ng-flickrdupfinder/src/javascript/config.js","./oauth-shim":"/Users/fabian/git/lefant/ng-flickrdupfinder/src/javascript/oauth-shim.js"}]},{},["./src/javascript/app.js"])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9mYWJpYW4vZ2l0L2xlZmFudC9uZy1mbGlja3JkdXBmaW5kZXIvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsIi4vc3JjL2phdmFzY3JpcHQvYXBwLmpzIiwiL1VzZXJzL2ZhYmlhbi9naXQvbGVmYW50L25nLWZsaWNrcmR1cGZpbmRlci9ib3dlcl9jb21wb25lbnRzL2FuZ3VsYXItcmVzb3VyY2UvYW5ndWxhci1yZXNvdXJjZS5qcyIsIi9Vc2Vycy9mYWJpYW4vZ2l0L2xlZmFudC9uZy1mbGlja3JkdXBmaW5kZXIvYm93ZXJfY29tcG9uZW50cy9hbmd1bGFyLXJvdXRlL2FuZ3VsYXItcm91dGUuanMiLCIvVXNlcnMvZmFiaWFuL2dpdC9sZWZhbnQvbmctZmxpY2tyZHVwZmluZGVyL2Jvd2VyX2NvbXBvbmVudHMvb2F1dGgtanMvZGlzdC9vYXV0aC5taW4uanMiLCIvVXNlcnMvZmFiaWFuL2dpdC9sZWZhbnQvbmctZmxpY2tyZHVwZmluZGVyL2Jvd2VyX2NvbXBvbmVudHMvdWkuYm9vdHN0cmFwL3NyYy9wYWdpbmF0aW9uL3BhZ2luYXRpb24uanMiLCIvVXNlcnMvZmFiaWFuL2dpdC9sZWZhbnQvbmctZmxpY2tyZHVwZmluZGVyL2Jvd2VyX2NvbXBvbmVudHMvdW5kZXJzY29yZS91bmRlcnNjb3JlLmpzIiwiL1VzZXJzL2ZhYmlhbi9naXQvbGVmYW50L25nLWZsaWNrcmR1cGZpbmRlci9zcmMvamF2YXNjcmlwdC9jb25maWcuanMiLCIvVXNlcnMvZmFiaWFuL2dpdC9sZWZhbnQvbmctZmxpY2tyZHVwZmluZGVyL3NyYy9qYXZhc2NyaXB0L2NvbnRyb2xsZXJzLmpzIiwiL1VzZXJzL2ZhYmlhbi9naXQvbGVmYW50L25nLWZsaWNrcmR1cGZpbmRlci9zcmMvamF2YXNjcmlwdC9vYXV0aC1zaGltLmpzIiwiL1VzZXJzL2ZhYmlhbi9naXQvbGVmYW50L25nLWZsaWNrcmR1cGZpbmRlci9zcmMvamF2YXNjcmlwdC9zZXJ2aWNlcy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNtQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3NUJBOztBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdE5BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvekNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3SEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNWQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIndXNlIHN0cmljdCc7XG5cbnJlcXVpcmUoXCIuLy4uLy4uL2Jvd2VyX2NvbXBvbmVudHMvYW5ndWxhci1yb3V0ZS9hbmd1bGFyLXJvdXRlLmpzXCIpO1xuXG5hbmd1bGFyLm1vZHVsZSgnZmxpY2tyRHVwRmluZGVyJywgWyduZ1JvdXRlJywgcmVxdWlyZSgnLi9jb250cm9sbGVycycpLm5hbWVdKVxuICAuY29uZmlnKFsnJHJvdXRlUHJvdmlkZXInLCBmdW5jdGlvbigkcm91dGVQcm92aWRlcikge1xuICAgIC8vIHRoZSBvYXV0aCByZWRpcmVjdCBjYWxsYmFjayBwYWdlIG11c3QgYmUgbWF0Y2hlZCB3aXRoIC5vdGhlcndpc2VcbiAgICAkcm91dGVQcm92aWRlclxuICAgICAgLm90aGVyd2lzZSh7XG4gICAgICAgIHRlbXBsYXRlVXJsOiAncGFydGlhbHMvcGhvdG9zLmh0bWwnLFxuICAgICAgICBjb250cm9sbGVyOiAncGhvdG9DdHJsJyxcbiAgICAgICAgcmVzb2x2ZTogeyAnRmxpY2tyJzogJ0ZsaWNrcicgfVxuICAgICAgfSk7XG4gIH1dKTtcbiIsIi8qKlxuICogQGxpY2Vuc2UgQW5ndWxhckpTIHYxLjIuMjFcbiAqIChjKSAyMDEwLTIwMTQgR29vZ2xlLCBJbmMuIGh0dHA6Ly9hbmd1bGFyanMub3JnXG4gKiBMaWNlbnNlOiBNSVRcbiAqL1xuKGZ1bmN0aW9uKHdpbmRvdywgYW5ndWxhciwgdW5kZWZpbmVkKSB7J3VzZSBzdHJpY3QnO1xuXG52YXIgJHJlc291cmNlTWluRXJyID0gYW5ndWxhci4kJG1pbkVycignJHJlc291cmNlJyk7XG5cbi8vIEhlbHBlciBmdW5jdGlvbnMgYW5kIHJlZ2V4IHRvIGxvb2t1cCBhIGRvdHRlZCBwYXRoIG9uIGFuIG9iamVjdFxuLy8gc3RvcHBpbmcgYXQgdW5kZWZpbmVkL251bGwuICBUaGUgcGF0aCBtdXN0IGJlIGNvbXBvc2VkIG9mIEFTQ0lJXG4vLyBpZGVudGlmaWVycyAoanVzdCBsaWtlICRwYXJzZSlcbnZhciBNRU1CRVJfTkFNRV9SRUdFWCA9IC9eKFxcLlthLXpBLVpfJF1bMC05YS16QS1aXyRdKikrJC87XG5cbmZ1bmN0aW9uIGlzVmFsaWREb3R0ZWRQYXRoKHBhdGgpIHtcbiAgcmV0dXJuIChwYXRoICE9IG51bGwgJiYgcGF0aCAhPT0gJycgJiYgcGF0aCAhPT0gJ2hhc093blByb3BlcnR5JyAmJlxuICAgICAgTUVNQkVSX05BTUVfUkVHRVgudGVzdCgnLicgKyBwYXRoKSk7XG59XG5cbmZ1bmN0aW9uIGxvb2t1cERvdHRlZFBhdGgob2JqLCBwYXRoKSB7XG4gIGlmICghaXNWYWxpZERvdHRlZFBhdGgocGF0aCkpIHtcbiAgICB0aHJvdyAkcmVzb3VyY2VNaW5FcnIoJ2JhZG1lbWJlcicsICdEb3R0ZWQgbWVtYmVyIHBhdGggXCJAezB9XCIgaXMgaW52YWxpZC4nLCBwYXRoKTtcbiAgfVxuICB2YXIga2V5cyA9IHBhdGguc3BsaXQoJy4nKTtcbiAgZm9yICh2YXIgaSA9IDAsIGlpID0ga2V5cy5sZW5ndGg7IGkgPCBpaSAmJiBvYmogIT09IHVuZGVmaW5lZDsgaSsrKSB7XG4gICAgdmFyIGtleSA9IGtleXNbaV07XG4gICAgb2JqID0gKG9iaiAhPT0gbnVsbCkgPyBvYmpba2V5XSA6IHVuZGVmaW5lZDtcbiAgfVxuICByZXR1cm4gb2JqO1xufVxuXG4vKipcbiAqIENyZWF0ZSBhIHNoYWxsb3cgY29weSBvZiBhbiBvYmplY3QgYW5kIGNsZWFyIG90aGVyIGZpZWxkcyBmcm9tIHRoZSBkZXN0aW5hdGlvblxuICovXG5mdW5jdGlvbiBzaGFsbG93Q2xlYXJBbmRDb3B5KHNyYywgZHN0KSB7XG4gIGRzdCA9IGRzdCB8fCB7fTtcblxuICBhbmd1bGFyLmZvckVhY2goZHN0LCBmdW5jdGlvbih2YWx1ZSwga2V5KXtcbiAgICBkZWxldGUgZHN0W2tleV07XG4gIH0pO1xuXG4gIGZvciAodmFyIGtleSBpbiBzcmMpIHtcbiAgICBpZiAoc3JjLmhhc093blByb3BlcnR5KGtleSkgJiYgIShrZXkuY2hhckF0KDApID09PSAnJCcgJiYga2V5LmNoYXJBdCgxKSA9PT0gJyQnKSkge1xuICAgICAgZHN0W2tleV0gPSBzcmNba2V5XTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gZHN0O1xufVxuXG4vKipcbiAqIEBuZ2RvYyBtb2R1bGVcbiAqIEBuYW1lIG5nUmVzb3VyY2VcbiAqIEBkZXNjcmlwdGlvblxuICpcbiAqICMgbmdSZXNvdXJjZVxuICpcbiAqIFRoZSBgbmdSZXNvdXJjZWAgbW9kdWxlIHByb3ZpZGVzIGludGVyYWN0aW9uIHN1cHBvcnQgd2l0aCBSRVNUZnVsIHNlcnZpY2VzXG4gKiB2aWEgdGhlICRyZXNvdXJjZSBzZXJ2aWNlLlxuICpcbiAqXG4gKiA8ZGl2IGRvYy1tb2R1bGUtY29tcG9uZW50cz1cIm5nUmVzb3VyY2VcIj48L2Rpdj5cbiAqXG4gKiBTZWUge0BsaW5rIG5nUmVzb3VyY2UuJHJlc291cmNlIGAkcmVzb3VyY2VgfSBmb3IgdXNhZ2UuXG4gKi9cblxuLyoqXG4gKiBAbmdkb2Mgc2VydmljZVxuICogQG5hbWUgJHJlc291cmNlXG4gKiBAcmVxdWlyZXMgJGh0dHBcbiAqXG4gKiBAZGVzY3JpcHRpb25cbiAqIEEgZmFjdG9yeSB3aGljaCBjcmVhdGVzIGEgcmVzb3VyY2Ugb2JqZWN0IHRoYXQgbGV0cyB5b3UgaW50ZXJhY3Qgd2l0aFxuICogW1JFU1RmdWxdKGh0dHA6Ly9lbi53aWtpcGVkaWEub3JnL3dpa2kvUmVwcmVzZW50YXRpb25hbF9TdGF0ZV9UcmFuc2Zlcikgc2VydmVyLXNpZGUgZGF0YSBzb3VyY2VzLlxuICpcbiAqIFRoZSByZXR1cm5lZCByZXNvdXJjZSBvYmplY3QgaGFzIGFjdGlvbiBtZXRob2RzIHdoaWNoIHByb3ZpZGUgaGlnaC1sZXZlbCBiZWhhdmlvcnMgd2l0aG91dFxuICogdGhlIG5lZWQgdG8gaW50ZXJhY3Qgd2l0aCB0aGUgbG93IGxldmVsIHtAbGluayBuZy4kaHR0cCAkaHR0cH0gc2VydmljZS5cbiAqXG4gKiBSZXF1aXJlcyB0aGUge0BsaW5rIG5nUmVzb3VyY2UgYG5nUmVzb3VyY2VgfSBtb2R1bGUgdG8gYmUgaW5zdGFsbGVkLlxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSB1cmwgQSBwYXJhbWV0cml6ZWQgVVJMIHRlbXBsYXRlIHdpdGggcGFyYW1ldGVycyBwcmVmaXhlZCBieSBgOmAgYXMgaW5cbiAqICAgYC91c2VyLzp1c2VybmFtZWAuIElmIHlvdSBhcmUgdXNpbmcgYSBVUkwgd2l0aCBhIHBvcnQgbnVtYmVyIChlLmcuXG4gKiAgIGBodHRwOi8vZXhhbXBsZS5jb206ODA4MC9hcGlgKSwgaXQgd2lsbCBiZSByZXNwZWN0ZWQuXG4gKlxuICogICBJZiB5b3UgYXJlIHVzaW5nIGEgdXJsIHdpdGggYSBzdWZmaXgsIGp1c3QgYWRkIHRoZSBzdWZmaXgsIGxpa2UgdGhpczpcbiAqICAgYCRyZXNvdXJjZSgnaHR0cDovL2V4YW1wbGUuY29tL3Jlc291cmNlLmpzb24nKWAgb3IgYCRyZXNvdXJjZSgnaHR0cDovL2V4YW1wbGUuY29tLzppZC5qc29uJylgXG4gKiAgIG9yIGV2ZW4gYCRyZXNvdXJjZSgnaHR0cDovL2V4YW1wbGUuY29tL3Jlc291cmNlLzpyZXNvdXJjZV9pZC46Zm9ybWF0JylgXG4gKiAgIElmIHRoZSBwYXJhbWV0ZXIgYmVmb3JlIHRoZSBzdWZmaXggaXMgZW1wdHksIDpyZXNvdXJjZV9pZCBpbiB0aGlzIGNhc2UsIHRoZW4gdGhlIGAvLmAgd2lsbCBiZVxuICogICBjb2xsYXBzZWQgZG93biB0byBhIHNpbmdsZSBgLmAuICBJZiB5b3UgbmVlZCB0aGlzIHNlcXVlbmNlIHRvIGFwcGVhciBhbmQgbm90IGNvbGxhcHNlIHRoZW4geW91XG4gKiAgIGNhbiBlc2NhcGUgaXQgd2l0aCBgL1xcLmAuXG4gKlxuICogQHBhcmFtIHtPYmplY3Q9fSBwYXJhbURlZmF1bHRzIERlZmF1bHQgdmFsdWVzIGZvciBgdXJsYCBwYXJhbWV0ZXJzLiBUaGVzZSBjYW4gYmUgb3ZlcnJpZGRlbiBpblxuICogICBgYWN0aW9uc2AgbWV0aG9kcy4gSWYgYW55IG9mIHRoZSBwYXJhbWV0ZXIgdmFsdWUgaXMgYSBmdW5jdGlvbiwgaXQgd2lsbCBiZSBleGVjdXRlZCBldmVyeSB0aW1lXG4gKiAgIHdoZW4gYSBwYXJhbSB2YWx1ZSBuZWVkcyB0byBiZSBvYnRhaW5lZCBmb3IgYSByZXF1ZXN0ICh1bmxlc3MgdGhlIHBhcmFtIHdhcyBvdmVycmlkZGVuKS5cbiAqXG4gKiAgIEVhY2gga2V5IHZhbHVlIGluIHRoZSBwYXJhbWV0ZXIgb2JqZWN0IGlzIGZpcnN0IGJvdW5kIHRvIHVybCB0ZW1wbGF0ZSBpZiBwcmVzZW50IGFuZCB0aGVuIGFueVxuICogICBleGNlc3Mga2V5cyBhcmUgYXBwZW5kZWQgdG8gdGhlIHVybCBzZWFyY2ggcXVlcnkgYWZ0ZXIgdGhlIGA/YC5cbiAqXG4gKiAgIEdpdmVuIGEgdGVtcGxhdGUgYC9wYXRoLzp2ZXJiYCBhbmQgcGFyYW1ldGVyIGB7dmVyYjonZ3JlZXQnLCBzYWx1dGF0aW9uOidIZWxsbyd9YCByZXN1bHRzIGluXG4gKiAgIFVSTCBgL3BhdGgvZ3JlZXQ/c2FsdXRhdGlvbj1IZWxsb2AuXG4gKlxuICogICBJZiB0aGUgcGFyYW1ldGVyIHZhbHVlIGlzIHByZWZpeGVkIHdpdGggYEBgIHRoZW4gdGhlIHZhbHVlIG9mIHRoYXQgcGFyYW1ldGVyIHdpbGwgYmUgdGFrZW5cbiAqICAgZnJvbSB0aGUgY29ycmVzcG9uZGluZyBrZXkgb24gdGhlIGRhdGEgb2JqZWN0ICh1c2VmdWwgZm9yIG5vbi1HRVQgb3BlcmF0aW9ucykuXG4gKlxuICogQHBhcmFtIHtPYmplY3QuPE9iamVjdD49fSBhY3Rpb25zIEhhc2ggd2l0aCBkZWNsYXJhdGlvbiBvZiBjdXN0b20gYWN0aW9uIHRoYXQgc2hvdWxkIGV4dGVuZFxuICogICB0aGUgZGVmYXVsdCBzZXQgb2YgcmVzb3VyY2UgYWN0aW9ucy4gVGhlIGRlY2xhcmF0aW9uIHNob3VsZCBiZSBjcmVhdGVkIGluIHRoZSBmb3JtYXQgb2Yge0BsaW5rXG4gKiAgIG5nLiRodHRwI3VzYWdlX3BhcmFtZXRlcnMgJGh0dHAuY29uZmlnfTpcbiAqXG4gKiAgICAgICB7YWN0aW9uMToge21ldGhvZDo/LCBwYXJhbXM6PywgaXNBcnJheTo/LCBoZWFkZXJzOj8sIC4uLn0sXG4gKiAgICAgICAgYWN0aW9uMjoge21ldGhvZDo/LCBwYXJhbXM6PywgaXNBcnJheTo/LCBoZWFkZXJzOj8sIC4uLn0sXG4gKiAgICAgICAgLi4ufVxuICpcbiAqICAgV2hlcmU6XG4gKlxuICogICAtICoqYGFjdGlvbmAqKiDigJMge3N0cmluZ30g4oCTIFRoZSBuYW1lIG9mIGFjdGlvbi4gVGhpcyBuYW1lIGJlY29tZXMgdGhlIG5hbWUgb2YgdGhlIG1ldGhvZCBvblxuICogICAgIHlvdXIgcmVzb3VyY2Ugb2JqZWN0LlxuICogICAtICoqYG1ldGhvZGAqKiDigJMge3N0cmluZ30g4oCTIENhc2UgaW5zZW5zaXRpdmUgSFRUUCBtZXRob2QgKGUuZy4gYEdFVGAsIGBQT1NUYCwgYFBVVGAsXG4gKiAgICAgYERFTEVURWAsIGBKU09OUGAsIGV0YykuXG4gKiAgIC0gKipgcGFyYW1zYCoqIOKAkyB7T2JqZWN0PX0g4oCTIE9wdGlvbmFsIHNldCBvZiBwcmUtYm91bmQgcGFyYW1ldGVycyBmb3IgdGhpcyBhY3Rpb24uIElmIGFueSBvZlxuICogICAgIHRoZSBwYXJhbWV0ZXIgdmFsdWUgaXMgYSBmdW5jdGlvbiwgaXQgd2lsbCBiZSBleGVjdXRlZCBldmVyeSB0aW1lIHdoZW4gYSBwYXJhbSB2YWx1ZSBuZWVkcyB0b1xuICogICAgIGJlIG9idGFpbmVkIGZvciBhIHJlcXVlc3QgKHVubGVzcyB0aGUgcGFyYW0gd2FzIG92ZXJyaWRkZW4pLlxuICogICAtICoqYHVybGAqKiDigJMge3N0cmluZ30g4oCTIGFjdGlvbiBzcGVjaWZpYyBgdXJsYCBvdmVycmlkZS4gVGhlIHVybCB0ZW1wbGF0aW5nIGlzIHN1cHBvcnRlZCBqdXN0XG4gKiAgICAgbGlrZSBmb3IgdGhlIHJlc291cmNlLWxldmVsIHVybHMuXG4gKiAgIC0gKipgaXNBcnJheWAqKiDigJMge2Jvb2xlYW49fSDigJMgSWYgdHJ1ZSB0aGVuIHRoZSByZXR1cm5lZCBvYmplY3QgZm9yIHRoaXMgYWN0aW9uIGlzIGFuIGFycmF5LFxuICogICAgIHNlZSBgcmV0dXJuc2Agc2VjdGlvbi5cbiAqICAgLSAqKmB0cmFuc2Zvcm1SZXF1ZXN0YCoqIOKAk1xuICogICAgIGB7ZnVuY3Rpb24oZGF0YSwgaGVhZGVyc0dldHRlcil8QXJyYXkuPGZ1bmN0aW9uKGRhdGEsIGhlYWRlcnNHZXR0ZXIpPn1gIOKAk1xuICogICAgIHRyYW5zZm9ybSBmdW5jdGlvbiBvciBhbiBhcnJheSBvZiBzdWNoIGZ1bmN0aW9ucy4gVGhlIHRyYW5zZm9ybSBmdW5jdGlvbiB0YWtlcyB0aGUgaHR0cFxuICogICAgIHJlcXVlc3QgYm9keSBhbmQgaGVhZGVycyBhbmQgcmV0dXJucyBpdHMgdHJhbnNmb3JtZWQgKHR5cGljYWxseSBzZXJpYWxpemVkKSB2ZXJzaW9uLlxuICogICAtICoqYHRyYW5zZm9ybVJlc3BvbnNlYCoqIOKAk1xuICogICAgIGB7ZnVuY3Rpb24oZGF0YSwgaGVhZGVyc0dldHRlcil8QXJyYXkuPGZ1bmN0aW9uKGRhdGEsIGhlYWRlcnNHZXR0ZXIpPn1gIOKAk1xuICogICAgIHRyYW5zZm9ybSBmdW5jdGlvbiBvciBhbiBhcnJheSBvZiBzdWNoIGZ1bmN0aW9ucy4gVGhlIHRyYW5zZm9ybSBmdW5jdGlvbiB0YWtlcyB0aGUgaHR0cFxuICogICAgIHJlc3BvbnNlIGJvZHkgYW5kIGhlYWRlcnMgYW5kIHJldHVybnMgaXRzIHRyYW5zZm9ybWVkICh0eXBpY2FsbHkgZGVzZXJpYWxpemVkKSB2ZXJzaW9uLlxuICogICAtICoqYGNhY2hlYCoqIOKAkyBge2Jvb2xlYW58Q2FjaGV9YCDigJMgSWYgdHJ1ZSwgYSBkZWZhdWx0ICRodHRwIGNhY2hlIHdpbGwgYmUgdXNlZCB0byBjYWNoZSB0aGVcbiAqICAgICBHRVQgcmVxdWVzdCwgb3RoZXJ3aXNlIGlmIGEgY2FjaGUgaW5zdGFuY2UgYnVpbHQgd2l0aFxuICogICAgIHtAbGluayBuZy4kY2FjaGVGYWN0b3J5ICRjYWNoZUZhY3Rvcnl9LCB0aGlzIGNhY2hlIHdpbGwgYmUgdXNlZCBmb3JcbiAqICAgICBjYWNoaW5nLlxuICogICAtICoqYHRpbWVvdXRgKiog4oCTIGB7bnVtYmVyfFByb21pc2V9YCDigJMgdGltZW91dCBpbiBtaWxsaXNlY29uZHMsIG9yIHtAbGluayBuZy4kcSBwcm9taXNlfSB0aGF0XG4gKiAgICAgc2hvdWxkIGFib3J0IHRoZSByZXF1ZXN0IHdoZW4gcmVzb2x2ZWQuXG4gKiAgIC0gKipgd2l0aENyZWRlbnRpYWxzYCoqIC0gYHtib29sZWFufWAgLSB3aGV0aGVyIHRvIHNldCB0aGUgYHdpdGhDcmVkZW50aWFsc2AgZmxhZyBvbiB0aGVcbiAqICAgICBYSFIgb2JqZWN0LiBTZWVcbiAqICAgICBbcmVxdWVzdHMgd2l0aCBjcmVkZW50aWFsc10oaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4vaHR0cF9hY2Nlc3NfY29udHJvbCNzZWN0aW9uXzUpXG4gKiAgICAgZm9yIG1vcmUgaW5mb3JtYXRpb24uXG4gKiAgIC0gKipgcmVzcG9uc2VUeXBlYCoqIC0gYHtzdHJpbmd9YCAtIHNlZVxuICogICAgIFtyZXF1ZXN0VHlwZV0oaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9ET00vWE1MSHR0cFJlcXVlc3QjcmVzcG9uc2VUeXBlKS5cbiAqICAgLSAqKmBpbnRlcmNlcHRvcmAqKiAtIGB7T2JqZWN0PX1gIC0gVGhlIGludGVyY2VwdG9yIG9iamVjdCBoYXMgdHdvIG9wdGlvbmFsIG1ldGhvZHMgLVxuICogICAgIGByZXNwb25zZWAgYW5kIGByZXNwb25zZUVycm9yYC4gQm90aCBgcmVzcG9uc2VgIGFuZCBgcmVzcG9uc2VFcnJvcmAgaW50ZXJjZXB0b3JzIGdldCBjYWxsZWRcbiAqICAgICB3aXRoIGBodHRwIHJlc3BvbnNlYCBvYmplY3QuIFNlZSB7QGxpbmsgbmcuJGh0dHAgJGh0dHAgaW50ZXJjZXB0b3JzfS5cbiAqXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBBIHJlc291cmNlIFwiY2xhc3NcIiBvYmplY3Qgd2l0aCBtZXRob2RzIGZvciB0aGUgZGVmYXVsdCBzZXQgb2YgcmVzb3VyY2UgYWN0aW9uc1xuICogICBvcHRpb25hbGx5IGV4dGVuZGVkIHdpdGggY3VzdG9tIGBhY3Rpb25zYC4gVGhlIGRlZmF1bHQgc2V0IGNvbnRhaW5zIHRoZXNlIGFjdGlvbnM6XG4gKiAgIGBgYGpzXG4gKiAgIHsgJ2dldCc6ICAgIHttZXRob2Q6J0dFVCd9LFxuICogICAgICdzYXZlJzogICB7bWV0aG9kOidQT1NUJ30sXG4gKiAgICAgJ3F1ZXJ5JzogIHttZXRob2Q6J0dFVCcsIGlzQXJyYXk6dHJ1ZX0sXG4gKiAgICAgJ3JlbW92ZSc6IHttZXRob2Q6J0RFTEVURSd9LFxuICogICAgICdkZWxldGUnOiB7bWV0aG9kOidERUxFVEUnfSB9O1xuICogICBgYGBcbiAqXG4gKiAgIENhbGxpbmcgdGhlc2UgbWV0aG9kcyBpbnZva2UgYW4ge0BsaW5rIG5nLiRodHRwfSB3aXRoIHRoZSBzcGVjaWZpZWQgaHR0cCBtZXRob2QsXG4gKiAgIGRlc3RpbmF0aW9uIGFuZCBwYXJhbWV0ZXJzLiBXaGVuIHRoZSBkYXRhIGlzIHJldHVybmVkIGZyb20gdGhlIHNlcnZlciB0aGVuIHRoZSBvYmplY3QgaXMgYW5cbiAqICAgaW5zdGFuY2Ugb2YgdGhlIHJlc291cmNlIGNsYXNzLiBUaGUgYWN0aW9ucyBgc2F2ZWAsIGByZW1vdmVgIGFuZCBgZGVsZXRlYCBhcmUgYXZhaWxhYmxlIG9uIGl0XG4gKiAgIGFzICBtZXRob2RzIHdpdGggdGhlIGAkYCBwcmVmaXguIFRoaXMgYWxsb3dzIHlvdSB0byBlYXNpbHkgcGVyZm9ybSBDUlVEIG9wZXJhdGlvbnMgKGNyZWF0ZSxcbiAqICAgcmVhZCwgdXBkYXRlLCBkZWxldGUpIG9uIHNlcnZlci1zaWRlIGRhdGEgbGlrZSB0aGlzOlxuICogICBgYGBqc1xuICogICB2YXIgVXNlciA9ICRyZXNvdXJjZSgnL3VzZXIvOnVzZXJJZCcsIHt1c2VySWQ6J0BpZCd9KTtcbiAqICAgdmFyIHVzZXIgPSBVc2VyLmdldCh7dXNlcklkOjEyM30sIGZ1bmN0aW9uKCkge1xuICogICAgIHVzZXIuYWJjID0gdHJ1ZTtcbiAqICAgICB1c2VyLiRzYXZlKCk7XG4gKiAgIH0pO1xuICogICBgYGBcbiAqXG4gKiAgIEl0IGlzIGltcG9ydGFudCB0byByZWFsaXplIHRoYXQgaW52b2tpbmcgYSAkcmVzb3VyY2Ugb2JqZWN0IG1ldGhvZCBpbW1lZGlhdGVseSByZXR1cm5zIGFuXG4gKiAgIGVtcHR5IHJlZmVyZW5jZSAob2JqZWN0IG9yIGFycmF5IGRlcGVuZGluZyBvbiBgaXNBcnJheWApLiBPbmNlIHRoZSBkYXRhIGlzIHJldHVybmVkIGZyb20gdGhlXG4gKiAgIHNlcnZlciB0aGUgZXhpc3RpbmcgcmVmZXJlbmNlIGlzIHBvcHVsYXRlZCB3aXRoIHRoZSBhY3R1YWwgZGF0YS4gVGhpcyBpcyBhIHVzZWZ1bCB0cmljayBzaW5jZVxuICogICB1c3VhbGx5IHRoZSByZXNvdXJjZSBpcyBhc3NpZ25lZCB0byBhIG1vZGVsIHdoaWNoIGlzIHRoZW4gcmVuZGVyZWQgYnkgdGhlIHZpZXcuIEhhdmluZyBhbiBlbXB0eVxuICogICBvYmplY3QgcmVzdWx0cyBpbiBubyByZW5kZXJpbmcsIG9uY2UgdGhlIGRhdGEgYXJyaXZlcyBmcm9tIHRoZSBzZXJ2ZXIgdGhlbiB0aGUgb2JqZWN0IGlzXG4gKiAgIHBvcHVsYXRlZCB3aXRoIHRoZSBkYXRhIGFuZCB0aGUgdmlldyBhdXRvbWF0aWNhbGx5IHJlLXJlbmRlcnMgaXRzZWxmIHNob3dpbmcgdGhlIG5ldyBkYXRhLiBUaGlzXG4gKiAgIG1lYW5zIHRoYXQgaW4gbW9zdCBjYXNlcyBvbmUgbmV2ZXIgaGFzIHRvIHdyaXRlIGEgY2FsbGJhY2sgZnVuY3Rpb24gZm9yIHRoZSBhY3Rpb24gbWV0aG9kcy5cbiAqXG4gKiAgIFRoZSBhY3Rpb24gbWV0aG9kcyBvbiB0aGUgY2xhc3Mgb2JqZWN0IG9yIGluc3RhbmNlIG9iamVjdCBjYW4gYmUgaW52b2tlZCB3aXRoIHRoZSBmb2xsb3dpbmdcbiAqICAgcGFyYW1ldGVyczpcbiAqXG4gKiAgIC0gSFRUUCBHRVQgXCJjbGFzc1wiIGFjdGlvbnM6IGBSZXNvdXJjZS5hY3Rpb24oW3BhcmFtZXRlcnNdLCBbc3VjY2Vzc10sIFtlcnJvcl0pYFxuICogICAtIG5vbi1HRVQgXCJjbGFzc1wiIGFjdGlvbnM6IGBSZXNvdXJjZS5hY3Rpb24oW3BhcmFtZXRlcnNdLCBwb3N0RGF0YSwgW3N1Y2Nlc3NdLCBbZXJyb3JdKWBcbiAqICAgLSBub24tR0VUIGluc3RhbmNlIGFjdGlvbnM6ICBgaW5zdGFuY2UuJGFjdGlvbihbcGFyYW1ldGVyc10sIFtzdWNjZXNzXSwgW2Vycm9yXSlgXG4gKlxuICogICBTdWNjZXNzIGNhbGxiYWNrIGlzIGNhbGxlZCB3aXRoICh2YWx1ZSwgcmVzcG9uc2VIZWFkZXJzKSBhcmd1bWVudHMuIEVycm9yIGNhbGxiYWNrIGlzIGNhbGxlZFxuICogICB3aXRoIChodHRwUmVzcG9uc2UpIGFyZ3VtZW50LlxuICpcbiAqICAgQ2xhc3MgYWN0aW9ucyByZXR1cm4gZW1wdHkgaW5zdGFuY2UgKHdpdGggYWRkaXRpb25hbCBwcm9wZXJ0aWVzIGJlbG93KS5cbiAqICAgSW5zdGFuY2UgYWN0aW9ucyByZXR1cm4gcHJvbWlzZSBvZiB0aGUgYWN0aW9uLlxuICpcbiAqICAgVGhlIFJlc291cmNlIGluc3RhbmNlcyBhbmQgY29sbGVjdGlvbiBoYXZlIHRoZXNlIGFkZGl0aW9uYWwgcHJvcGVydGllczpcbiAqXG4gKiAgIC0gYCRwcm9taXNlYDogdGhlIHtAbGluayBuZy4kcSBwcm9taXNlfSBvZiB0aGUgb3JpZ2luYWwgc2VydmVyIGludGVyYWN0aW9uIHRoYXQgY3JlYXRlZCB0aGlzXG4gKiAgICAgaW5zdGFuY2Ugb3IgY29sbGVjdGlvbi5cbiAqXG4gKiAgICAgT24gc3VjY2VzcywgdGhlIHByb21pc2UgaXMgcmVzb2x2ZWQgd2l0aCB0aGUgc2FtZSByZXNvdXJjZSBpbnN0YW5jZSBvciBjb2xsZWN0aW9uIG9iamVjdCxcbiAqICAgICB1cGRhdGVkIHdpdGggZGF0YSBmcm9tIHNlcnZlci4gVGhpcyBtYWtlcyBpdCBlYXN5IHRvIHVzZSBpblxuICogICAgIHtAbGluayBuZ1JvdXRlLiRyb3V0ZVByb3ZpZGVyIHJlc29sdmUgc2VjdGlvbiBvZiAkcm91dGVQcm92aWRlci53aGVuKCl9IHRvIGRlZmVyIHZpZXdcbiAqICAgICByZW5kZXJpbmcgdW50aWwgdGhlIHJlc291cmNlKHMpIGFyZSBsb2FkZWQuXG4gKlxuICogICAgIE9uIGZhaWx1cmUsIHRoZSBwcm9taXNlIGlzIHJlc29sdmVkIHdpdGggdGhlIHtAbGluayBuZy4kaHR0cCBodHRwIHJlc3BvbnNlfSBvYmplY3QsIHdpdGhvdXRcbiAqICAgICB0aGUgYHJlc291cmNlYCBwcm9wZXJ0eS5cbiAqXG4gKiAgICAgSWYgYW4gaW50ZXJjZXB0b3Igb2JqZWN0IHdhcyBwcm92aWRlZCwgdGhlIHByb21pc2Ugd2lsbCBpbnN0ZWFkIGJlIHJlc29sdmVkIHdpdGggdGhlIHZhbHVlXG4gKiAgICAgcmV0dXJuZWQgYnkgdGhlIGludGVyY2VwdG9yLlxuICpcbiAqICAgLSBgJHJlc29sdmVkYDogYHRydWVgIGFmdGVyIGZpcnN0IHNlcnZlciBpbnRlcmFjdGlvbiBpcyBjb21wbGV0ZWQgKGVpdGhlciB3aXRoIHN1Y2Nlc3Mgb3JcbiAqICAgICAgcmVqZWN0aW9uKSwgYGZhbHNlYCBiZWZvcmUgdGhhdC4gS25vd2luZyBpZiB0aGUgUmVzb3VyY2UgaGFzIGJlZW4gcmVzb2x2ZWQgaXMgdXNlZnVsIGluXG4gKiAgICAgIGRhdGEtYmluZGluZy5cbiAqXG4gKiBAZXhhbXBsZVxuICpcbiAqICMgQ3JlZGl0IGNhcmQgcmVzb3VyY2VcbiAqXG4gKiBgYGBqc1xuICAgICAvLyBEZWZpbmUgQ3JlZGl0Q2FyZCBjbGFzc1xuICAgICB2YXIgQ3JlZGl0Q2FyZCA9ICRyZXNvdXJjZSgnL3VzZXIvOnVzZXJJZC9jYXJkLzpjYXJkSWQnLFxuICAgICAge3VzZXJJZDoxMjMsIGNhcmRJZDonQGlkJ30sIHtcbiAgICAgICBjaGFyZ2U6IHttZXRob2Q6J1BPU1QnLCBwYXJhbXM6e2NoYXJnZTp0cnVlfX1cbiAgICAgIH0pO1xuXG4gICAgIC8vIFdlIGNhbiByZXRyaWV2ZSBhIGNvbGxlY3Rpb24gZnJvbSB0aGUgc2VydmVyXG4gICAgIHZhciBjYXJkcyA9IENyZWRpdENhcmQucXVlcnkoZnVuY3Rpb24oKSB7XG4gICAgICAgLy8gR0VUOiAvdXNlci8xMjMvY2FyZFxuICAgICAgIC8vIHNlcnZlciByZXR1cm5zOiBbIHtpZDo0NTYsIG51bWJlcjonMTIzNCcsIG5hbWU6J1NtaXRoJ30gXTtcblxuICAgICAgIHZhciBjYXJkID0gY2FyZHNbMF07XG4gICAgICAgLy8gZWFjaCBpdGVtIGlzIGFuIGluc3RhbmNlIG9mIENyZWRpdENhcmRcbiAgICAgICBleHBlY3QoY2FyZCBpbnN0YW5jZW9mIENyZWRpdENhcmQpLnRvRXF1YWwodHJ1ZSk7XG4gICAgICAgY2FyZC5uYW1lID0gXCJKLiBTbWl0aFwiO1xuICAgICAgIC8vIG5vbiBHRVQgbWV0aG9kcyBhcmUgbWFwcGVkIG9udG8gdGhlIGluc3RhbmNlc1xuICAgICAgIGNhcmQuJHNhdmUoKTtcbiAgICAgICAvLyBQT1NUOiAvdXNlci8xMjMvY2FyZC80NTYge2lkOjQ1NiwgbnVtYmVyOicxMjM0JywgbmFtZTonSi4gU21pdGgnfVxuICAgICAgIC8vIHNlcnZlciByZXR1cm5zOiB7aWQ6NDU2LCBudW1iZXI6JzEyMzQnLCBuYW1lOiAnSi4gU21pdGgnfTtcblxuICAgICAgIC8vIG91ciBjdXN0b20gbWV0aG9kIGlzIG1hcHBlZCBhcyB3ZWxsLlxuICAgICAgIGNhcmQuJGNoYXJnZSh7YW1vdW50OjkuOTl9KTtcbiAgICAgICAvLyBQT1NUOiAvdXNlci8xMjMvY2FyZC80NTY/YW1vdW50PTkuOTkmY2hhcmdlPXRydWUge2lkOjQ1NiwgbnVtYmVyOicxMjM0JywgbmFtZTonSi4gU21pdGgnfVxuICAgICB9KTtcblxuICAgICAvLyB3ZSBjYW4gY3JlYXRlIGFuIGluc3RhbmNlIGFzIHdlbGxcbiAgICAgdmFyIG5ld0NhcmQgPSBuZXcgQ3JlZGl0Q2FyZCh7bnVtYmVyOicwMTIzJ30pO1xuICAgICBuZXdDYXJkLm5hbWUgPSBcIk1pa2UgU21pdGhcIjtcbiAgICAgbmV3Q2FyZC4kc2F2ZSgpO1xuICAgICAvLyBQT1NUOiAvdXNlci8xMjMvY2FyZCB7bnVtYmVyOicwMTIzJywgbmFtZTonTWlrZSBTbWl0aCd9XG4gICAgIC8vIHNlcnZlciByZXR1cm5zOiB7aWQ6Nzg5LCBudW1iZXI6JzAxMjMnLCBuYW1lOiAnTWlrZSBTbWl0aCd9O1xuICAgICBleHBlY3QobmV3Q2FyZC5pZCkudG9FcXVhbCg3ODkpO1xuICogYGBgXG4gKlxuICogVGhlIG9iamVjdCByZXR1cm5lZCBmcm9tIHRoaXMgZnVuY3Rpb24gZXhlY3V0aW9uIGlzIGEgcmVzb3VyY2UgXCJjbGFzc1wiIHdoaWNoIGhhcyBcInN0YXRpY1wiIG1ldGhvZFxuICogZm9yIGVhY2ggYWN0aW9uIGluIHRoZSBkZWZpbml0aW9uLlxuICpcbiAqIENhbGxpbmcgdGhlc2UgbWV0aG9kcyBpbnZva2UgYCRodHRwYCBvbiB0aGUgYHVybGAgdGVtcGxhdGUgd2l0aCB0aGUgZ2l2ZW4gYG1ldGhvZGAsIGBwYXJhbXNgIGFuZFxuICogYGhlYWRlcnNgLlxuICogV2hlbiB0aGUgZGF0YSBpcyByZXR1cm5lZCBmcm9tIHRoZSBzZXJ2ZXIgdGhlbiB0aGUgb2JqZWN0IGlzIGFuIGluc3RhbmNlIG9mIHRoZSByZXNvdXJjZSB0eXBlIGFuZFxuICogYWxsIG9mIHRoZSBub24tR0VUIG1ldGhvZHMgYXJlIGF2YWlsYWJsZSB3aXRoIGAkYCBwcmVmaXguIFRoaXMgYWxsb3dzIHlvdSB0byBlYXNpbHkgc3VwcG9ydCBDUlVEXG4gKiBvcGVyYXRpb25zIChjcmVhdGUsIHJlYWQsIHVwZGF0ZSwgZGVsZXRlKSBvbiBzZXJ2ZXItc2lkZSBkYXRhLlxuXG4gICBgYGBqc1xuICAgICB2YXIgVXNlciA9ICRyZXNvdXJjZSgnL3VzZXIvOnVzZXJJZCcsIHt1c2VySWQ6J0BpZCd9KTtcbiAgICAgVXNlci5nZXQoe3VzZXJJZDoxMjN9LCBmdW5jdGlvbih1c2VyKSB7XG4gICAgICAgdXNlci5hYmMgPSB0cnVlO1xuICAgICAgIHVzZXIuJHNhdmUoKTtcbiAgICAgfSk7XG4gICBgYGBcbiAqXG4gKiBJdCdzIHdvcnRoIG5vdGluZyB0aGF0IHRoZSBzdWNjZXNzIGNhbGxiYWNrIGZvciBgZ2V0YCwgYHF1ZXJ5YCBhbmQgb3RoZXIgbWV0aG9kcyBnZXRzIHBhc3NlZFxuICogaW4gdGhlIHJlc3BvbnNlIHRoYXQgY2FtZSBmcm9tIHRoZSBzZXJ2ZXIgYXMgd2VsbCBhcyAkaHR0cCBoZWFkZXIgZ2V0dGVyIGZ1bmN0aW9uLCBzbyBvbmVcbiAqIGNvdWxkIHJld3JpdGUgdGhlIGFib3ZlIGV4YW1wbGUgYW5kIGdldCBhY2Nlc3MgdG8gaHR0cCBoZWFkZXJzIGFzOlxuICpcbiAgIGBgYGpzXG4gICAgIHZhciBVc2VyID0gJHJlc291cmNlKCcvdXNlci86dXNlcklkJywge3VzZXJJZDonQGlkJ30pO1xuICAgICBVc2VyLmdldCh7dXNlcklkOjEyM30sIGZ1bmN0aW9uKHUsIGdldFJlc3BvbnNlSGVhZGVycyl7XG4gICAgICAgdS5hYmMgPSB0cnVlO1xuICAgICAgIHUuJHNhdmUoZnVuY3Rpb24odSwgcHV0UmVzcG9uc2VIZWFkZXJzKSB7XG4gICAgICAgICAvL3UgPT4gc2F2ZWQgdXNlciBvYmplY3RcbiAgICAgICAgIC8vcHV0UmVzcG9uc2VIZWFkZXJzID0+ICRodHRwIGhlYWRlciBnZXR0ZXJcbiAgICAgICB9KTtcbiAgICAgfSk7XG4gICBgYGBcbiAqXG4gKiBZb3UgY2FuIGFsc28gYWNjZXNzIHRoZSByYXcgYCRodHRwYCBwcm9taXNlIHZpYSB0aGUgYCRwcm9taXNlYCBwcm9wZXJ0eSBvbiB0aGUgb2JqZWN0IHJldHVybmVkXG4gKlxuICAgYGBgXG4gICAgIHZhciBVc2VyID0gJHJlc291cmNlKCcvdXNlci86dXNlcklkJywge3VzZXJJZDonQGlkJ30pO1xuICAgICBVc2VyLmdldCh7dXNlcklkOjEyM30pXG4gICAgICAgICAuJHByb21pc2UudGhlbihmdW5jdGlvbih1c2VyKSB7XG4gICAgICAgICAgICRzY29wZS51c2VyID0gdXNlcjtcbiAgICAgICAgIH0pO1xuICAgYGBgXG5cbiAqICMgQ3JlYXRpbmcgYSBjdXN0b20gJ1BVVCcgcmVxdWVzdFxuICogSW4gdGhpcyBleGFtcGxlIHdlIGNyZWF0ZSBhIGN1c3RvbSBtZXRob2Qgb24gb3VyIHJlc291cmNlIHRvIG1ha2UgYSBQVVQgcmVxdWVzdFxuICogYGBganNcbiAqICAgIHZhciBhcHAgPSBhbmd1bGFyLm1vZHVsZSgnYXBwJywgWyduZ1Jlc291cmNlJywgJ25nUm91dGUnXSk7XG4gKlxuICogICAgLy8gU29tZSBBUElzIGV4cGVjdCBhIFBVVCByZXF1ZXN0IGluIHRoZSBmb3JtYXQgVVJML29iamVjdC9JRFxuICogICAgLy8gSGVyZSB3ZSBhcmUgY3JlYXRpbmcgYW4gJ3VwZGF0ZScgbWV0aG9kXG4gKiAgICBhcHAuZmFjdG9yeSgnTm90ZXMnLCBbJyRyZXNvdXJjZScsIGZ1bmN0aW9uKCRyZXNvdXJjZSkge1xuICogICAgcmV0dXJuICRyZXNvdXJjZSgnL25vdGVzLzppZCcsIG51bGwsXG4gKiAgICAgICAge1xuICogICAgICAgICAgICAndXBkYXRlJzogeyBtZXRob2Q6J1BVVCcgfVxuICogICAgICAgIH0pO1xuICogICAgfV0pO1xuICpcbiAqICAgIC8vIEluIG91ciBjb250cm9sbGVyIHdlIGdldCB0aGUgSUQgZnJvbSB0aGUgVVJMIHVzaW5nIG5nUm91dGUgYW5kICRyb3V0ZVBhcmFtc1xuICogICAgLy8gV2UgcGFzcyBpbiAkcm91dGVQYXJhbXMgYW5kIG91ciBOb3RlcyBmYWN0b3J5IGFsb25nIHdpdGggJHNjb3BlXG4gKiAgICBhcHAuY29udHJvbGxlcignTm90ZXNDdHJsJywgWyckc2NvcGUnLCAnJHJvdXRlUGFyYW1zJywgJ05vdGVzJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24oJHNjb3BlLCAkcm91dGVQYXJhbXMsIE5vdGVzKSB7XG4gKiAgICAvLyBGaXJzdCBnZXQgYSBub3RlIG9iamVjdCBmcm9tIHRoZSBmYWN0b3J5XG4gKiAgICB2YXIgbm90ZSA9IE5vdGVzLmdldCh7IGlkOiRyb3V0ZVBhcmFtcy5pZCB9KTtcbiAqICAgICRpZCA9IG5vdGUuaWQ7XG4gKlxuICogICAgLy8gTm93IGNhbGwgdXBkYXRlIHBhc3NpbmcgaW4gdGhlIElEIGZpcnN0IHRoZW4gdGhlIG9iamVjdCB5b3UgYXJlIHVwZGF0aW5nXG4gKiAgICBOb3Rlcy51cGRhdGUoeyBpZDokaWQgfSwgbm90ZSk7XG4gKlxuICogICAgLy8gVGhpcyB3aWxsIFBVVCAvbm90ZXMvSUQgd2l0aCB0aGUgbm90ZSBvYmplY3QgaW4gdGhlIHJlcXVlc3QgcGF5bG9hZFxuICogICAgfV0pO1xuICogYGBgXG4gKi9cbmFuZ3VsYXIubW9kdWxlKCduZ1Jlc291cmNlJywgWyduZyddKS5cbiAgZmFjdG9yeSgnJHJlc291cmNlJywgWyckaHR0cCcsICckcScsIGZ1bmN0aW9uKCRodHRwLCAkcSkge1xuXG4gICAgdmFyIERFRkFVTFRfQUNUSU9OUyA9IHtcbiAgICAgICdnZXQnOiAgICB7bWV0aG9kOidHRVQnfSxcbiAgICAgICdzYXZlJzogICB7bWV0aG9kOidQT1NUJ30sXG4gICAgICAncXVlcnknOiAge21ldGhvZDonR0VUJywgaXNBcnJheTp0cnVlfSxcbiAgICAgICdyZW1vdmUnOiB7bWV0aG9kOidERUxFVEUnfSxcbiAgICAgICdkZWxldGUnOiB7bWV0aG9kOidERUxFVEUnfVxuICAgIH07XG4gICAgdmFyIG5vb3AgPSBhbmd1bGFyLm5vb3AsXG4gICAgICAgIGZvckVhY2ggPSBhbmd1bGFyLmZvckVhY2gsXG4gICAgICAgIGV4dGVuZCA9IGFuZ3VsYXIuZXh0ZW5kLFxuICAgICAgICBjb3B5ID0gYW5ndWxhci5jb3B5LFxuICAgICAgICBpc0Z1bmN0aW9uID0gYW5ndWxhci5pc0Z1bmN0aW9uO1xuXG4gICAgLyoqXG4gICAgICogV2UgbmVlZCBvdXIgY3VzdG9tIG1ldGhvZCBiZWNhdXNlIGVuY29kZVVSSUNvbXBvbmVudCBpcyB0b28gYWdncmVzc2l2ZSBhbmQgZG9lc24ndCBmb2xsb3dcbiAgICAgKiBodHRwOi8vd3d3LmlldGYub3JnL3JmYy9yZmMzOTg2LnR4dCB3aXRoIHJlZ2FyZHMgdG8gdGhlIGNoYXJhY3RlciBzZXQgKHBjaGFyKSBhbGxvd2VkIGluIHBhdGhcbiAgICAgKiBzZWdtZW50czpcbiAgICAgKiAgICBzZWdtZW50ICAgICAgID0gKnBjaGFyXG4gICAgICogICAgcGNoYXIgICAgICAgICA9IHVucmVzZXJ2ZWQgLyBwY3QtZW5jb2RlZCAvIHN1Yi1kZWxpbXMgLyBcIjpcIiAvIFwiQFwiXG4gICAgICogICAgcGN0LWVuY29kZWQgICA9IFwiJVwiIEhFWERJRyBIRVhESUdcbiAgICAgKiAgICB1bnJlc2VydmVkICAgID0gQUxQSEEgLyBESUdJVCAvIFwiLVwiIC8gXCIuXCIgLyBcIl9cIiAvIFwiflwiXG4gICAgICogICAgc3ViLWRlbGltcyAgICA9IFwiIVwiIC8gXCIkXCIgLyBcIiZcIiAvIFwiJ1wiIC8gXCIoXCIgLyBcIilcIlxuICAgICAqICAgICAgICAgICAgICAgICAgICAgLyBcIipcIiAvIFwiK1wiIC8gXCIsXCIgLyBcIjtcIiAvIFwiPVwiXG4gICAgICovXG4gICAgZnVuY3Rpb24gZW5jb2RlVXJpU2VnbWVudCh2YWwpIHtcbiAgICAgIHJldHVybiBlbmNvZGVVcmlRdWVyeSh2YWwsIHRydWUpLlxuICAgICAgICByZXBsYWNlKC8lMjYvZ2ksICcmJykuXG4gICAgICAgIHJlcGxhY2UoLyUzRC9naSwgJz0nKS5cbiAgICAgICAgcmVwbGFjZSgvJTJCL2dpLCAnKycpO1xuICAgIH1cblxuXG4gICAgLyoqXG4gICAgICogVGhpcyBtZXRob2QgaXMgaW50ZW5kZWQgZm9yIGVuY29kaW5nICprZXkqIG9yICp2YWx1ZSogcGFydHMgb2YgcXVlcnkgY29tcG9uZW50LiBXZSBuZWVkIGFcbiAgICAgKiBjdXN0b20gbWV0aG9kIGJlY2F1c2UgZW5jb2RlVVJJQ29tcG9uZW50IGlzIHRvbyBhZ2dyZXNzaXZlIGFuZCBlbmNvZGVzIHN0dWZmIHRoYXQgZG9lc24ndFxuICAgICAqIGhhdmUgdG8gYmUgZW5jb2RlZCBwZXIgaHR0cDovL3Rvb2xzLmlldGYub3JnL2h0bWwvcmZjMzk4NjpcbiAgICAgKiAgICBxdWVyeSAgICAgICA9ICooIHBjaGFyIC8gXCIvXCIgLyBcIj9cIiApXG4gICAgICogICAgcGNoYXIgICAgICAgICA9IHVucmVzZXJ2ZWQgLyBwY3QtZW5jb2RlZCAvIHN1Yi1kZWxpbXMgLyBcIjpcIiAvIFwiQFwiXG4gICAgICogICAgdW5yZXNlcnZlZCAgICA9IEFMUEhBIC8gRElHSVQgLyBcIi1cIiAvIFwiLlwiIC8gXCJfXCIgLyBcIn5cIlxuICAgICAqICAgIHBjdC1lbmNvZGVkICAgPSBcIiVcIiBIRVhESUcgSEVYRElHXG4gICAgICogICAgc3ViLWRlbGltcyAgICA9IFwiIVwiIC8gXCIkXCIgLyBcIiZcIiAvIFwiJ1wiIC8gXCIoXCIgLyBcIilcIlxuICAgICAqICAgICAgICAgICAgICAgICAgICAgLyBcIipcIiAvIFwiK1wiIC8gXCIsXCIgLyBcIjtcIiAvIFwiPVwiXG4gICAgICovXG4gICAgZnVuY3Rpb24gZW5jb2RlVXJpUXVlcnkodmFsLCBwY3RFbmNvZGVTcGFjZXMpIHtcbiAgICAgIHJldHVybiBlbmNvZGVVUklDb21wb25lbnQodmFsKS5cbiAgICAgICAgcmVwbGFjZSgvJTQwL2dpLCAnQCcpLlxuICAgICAgICByZXBsYWNlKC8lM0EvZ2ksICc6JykuXG4gICAgICAgIHJlcGxhY2UoLyUyNC9nLCAnJCcpLlxuICAgICAgICByZXBsYWNlKC8lMkMvZ2ksICcsJykuXG4gICAgICAgIHJlcGxhY2UoLyUyMC9nLCAocGN0RW5jb2RlU3BhY2VzID8gJyUyMCcgOiAnKycpKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBSb3V0ZSh0ZW1wbGF0ZSwgZGVmYXVsdHMpIHtcbiAgICAgIHRoaXMudGVtcGxhdGUgPSB0ZW1wbGF0ZTtcbiAgICAgIHRoaXMuZGVmYXVsdHMgPSBkZWZhdWx0cyB8fCB7fTtcbiAgICAgIHRoaXMudXJsUGFyYW1zID0ge307XG4gICAgfVxuXG4gICAgUm91dGUucHJvdG90eXBlID0ge1xuICAgICAgc2V0VXJsUGFyYW1zOiBmdW5jdGlvbihjb25maWcsIHBhcmFtcywgYWN0aW9uVXJsKSB7XG4gICAgICAgIHZhciBzZWxmID0gdGhpcyxcbiAgICAgICAgICAgIHVybCA9IGFjdGlvblVybCB8fCBzZWxmLnRlbXBsYXRlLFxuICAgICAgICAgICAgdmFsLFxuICAgICAgICAgICAgZW5jb2RlZFZhbDtcblxuICAgICAgICB2YXIgdXJsUGFyYW1zID0gc2VsZi51cmxQYXJhbXMgPSB7fTtcbiAgICAgICAgZm9yRWFjaCh1cmwuc3BsaXQoL1xcVy8pLCBmdW5jdGlvbihwYXJhbSl7XG4gICAgICAgICAgaWYgKHBhcmFtID09PSAnaGFzT3duUHJvcGVydHknKSB7XG4gICAgICAgICAgICB0aHJvdyAkcmVzb3VyY2VNaW5FcnIoJ2JhZG5hbWUnLCBcImhhc093blByb3BlcnR5IGlzIG5vdCBhIHZhbGlkIHBhcmFtZXRlciBuYW1lLlwiKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKCEobmV3IFJlZ0V4cChcIl5cXFxcZCskXCIpLnRlc3QocGFyYW0pKSAmJiBwYXJhbSAmJlxuICAgICAgICAgICAgICAgKG5ldyBSZWdFeHAoXCIoXnxbXlxcXFxcXFxcXSk6XCIgKyBwYXJhbSArIFwiKFxcXFxXfCQpXCIpLnRlc3QodXJsKSkpIHtcbiAgICAgICAgICAgIHVybFBhcmFtc1twYXJhbV0gPSB0cnVlO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHVybCA9IHVybC5yZXBsYWNlKC9cXFxcOi9nLCAnOicpO1xuXG4gICAgICAgIHBhcmFtcyA9IHBhcmFtcyB8fCB7fTtcbiAgICAgICAgZm9yRWFjaChzZWxmLnVybFBhcmFtcywgZnVuY3Rpb24oXywgdXJsUGFyYW0pe1xuICAgICAgICAgIHZhbCA9IHBhcmFtcy5oYXNPd25Qcm9wZXJ0eSh1cmxQYXJhbSkgPyBwYXJhbXNbdXJsUGFyYW1dIDogc2VsZi5kZWZhdWx0c1t1cmxQYXJhbV07XG4gICAgICAgICAgaWYgKGFuZ3VsYXIuaXNEZWZpbmVkKHZhbCkgJiYgdmFsICE9PSBudWxsKSB7XG4gICAgICAgICAgICBlbmNvZGVkVmFsID0gZW5jb2RlVXJpU2VnbWVudCh2YWwpO1xuICAgICAgICAgICAgdXJsID0gdXJsLnJlcGxhY2UobmV3IFJlZ0V4cChcIjpcIiArIHVybFBhcmFtICsgXCIoXFxcXFd8JClcIiwgXCJnXCIpLCBmdW5jdGlvbihtYXRjaCwgcDEpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGVuY29kZWRWYWwgKyBwMTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB1cmwgPSB1cmwucmVwbGFjZShuZXcgUmVnRXhwKFwiKFxcLz8pOlwiICsgdXJsUGFyYW0gKyBcIihcXFxcV3wkKVwiLCBcImdcIiksIGZ1bmN0aW9uKG1hdGNoLFxuICAgICAgICAgICAgICAgIGxlYWRpbmdTbGFzaGVzLCB0YWlsKSB7XG4gICAgICAgICAgICAgIGlmICh0YWlsLmNoYXJBdCgwKSA9PSAnLycpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGFpbDtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbGVhZGluZ1NsYXNoZXMgKyB0YWlsO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIHN0cmlwIHRyYWlsaW5nIHNsYXNoZXMgYW5kIHNldCB0aGUgdXJsXG4gICAgICAgIHVybCA9IHVybC5yZXBsYWNlKC9cXC8rJC8sICcnKSB8fCAnLyc7XG4gICAgICAgIC8vIHRoZW4gcmVwbGFjZSBjb2xsYXBzZSBgLy5gIGlmIGZvdW5kIGluIHRoZSBsYXN0IFVSTCBwYXRoIHNlZ21lbnQgYmVmb3JlIHRoZSBxdWVyeVxuICAgICAgICAvLyBFLmcuIGBodHRwOi8vdXJsLmNvbS9pZC4vZm9ybWF0P3E9eGAgYmVjb21lcyBgaHR0cDovL3VybC5jb20vaWQuZm9ybWF0P3E9eGBcbiAgICAgICAgdXJsID0gdXJsLnJlcGxhY2UoL1xcL1xcLig/PVxcdysoJHxcXD8pKS8sICcuJyk7XG4gICAgICAgIC8vIHJlcGxhY2UgZXNjYXBlZCBgL1xcLmAgd2l0aCBgLy5gXG4gICAgICAgIGNvbmZpZy51cmwgPSB1cmwucmVwbGFjZSgvXFwvXFxcXFxcLi8sICcvLicpO1xuXG5cbiAgICAgICAgLy8gc2V0IHBhcmFtcyAtIGRlbGVnYXRlIHBhcmFtIGVuY29kaW5nIHRvICRodHRwXG4gICAgICAgIGZvckVhY2gocGFyYW1zLCBmdW5jdGlvbih2YWx1ZSwga2V5KXtcbiAgICAgICAgICBpZiAoIXNlbGYudXJsUGFyYW1zW2tleV0pIHtcbiAgICAgICAgICAgIGNvbmZpZy5wYXJhbXMgPSBjb25maWcucGFyYW1zIHx8IHt9O1xuICAgICAgICAgICAgY29uZmlnLnBhcmFtc1trZXldID0gdmFsdWU7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9O1xuXG5cbiAgICBmdW5jdGlvbiByZXNvdXJjZUZhY3RvcnkodXJsLCBwYXJhbURlZmF1bHRzLCBhY3Rpb25zKSB7XG4gICAgICB2YXIgcm91dGUgPSBuZXcgUm91dGUodXJsKTtcblxuICAgICAgYWN0aW9ucyA9IGV4dGVuZCh7fSwgREVGQVVMVF9BQ1RJT05TLCBhY3Rpb25zKTtcblxuICAgICAgZnVuY3Rpb24gZXh0cmFjdFBhcmFtcyhkYXRhLCBhY3Rpb25QYXJhbXMpe1xuICAgICAgICB2YXIgaWRzID0ge307XG4gICAgICAgIGFjdGlvblBhcmFtcyA9IGV4dGVuZCh7fSwgcGFyYW1EZWZhdWx0cywgYWN0aW9uUGFyYW1zKTtcbiAgICAgICAgZm9yRWFjaChhY3Rpb25QYXJhbXMsIGZ1bmN0aW9uKHZhbHVlLCBrZXkpe1xuICAgICAgICAgIGlmIChpc0Z1bmN0aW9uKHZhbHVlKSkgeyB2YWx1ZSA9IHZhbHVlKCk7IH1cbiAgICAgICAgICBpZHNba2V5XSA9IHZhbHVlICYmIHZhbHVlLmNoYXJBdCAmJiB2YWx1ZS5jaGFyQXQoMCkgPT0gJ0AnID9cbiAgICAgICAgICAgIGxvb2t1cERvdHRlZFBhdGgoZGF0YSwgdmFsdWUuc3Vic3RyKDEpKSA6IHZhbHVlO1xuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIGlkcztcbiAgICAgIH1cblxuICAgICAgZnVuY3Rpb24gZGVmYXVsdFJlc3BvbnNlSW50ZXJjZXB0b3IocmVzcG9uc2UpIHtcbiAgICAgICAgcmV0dXJuIHJlc3BvbnNlLnJlc291cmNlO1xuICAgICAgfVxuXG4gICAgICBmdW5jdGlvbiBSZXNvdXJjZSh2YWx1ZSl7XG4gICAgICAgIHNoYWxsb3dDbGVhckFuZENvcHkodmFsdWUgfHwge30sIHRoaXMpO1xuICAgICAgfVxuXG4gICAgICBmb3JFYWNoKGFjdGlvbnMsIGZ1bmN0aW9uKGFjdGlvbiwgbmFtZSkge1xuICAgICAgICB2YXIgaGFzQm9keSA9IC9eKFBPU1R8UFVUfFBBVENIKSQvaS50ZXN0KGFjdGlvbi5tZXRob2QpO1xuXG4gICAgICAgIFJlc291cmNlW25hbWVdID0gZnVuY3Rpb24oYTEsIGEyLCBhMywgYTQpIHtcbiAgICAgICAgICB2YXIgcGFyYW1zID0ge30sIGRhdGEsIHN1Y2Nlc3MsIGVycm9yO1xuXG4gICAgICAgICAgLyoganNoaW50IC1XMDg2ICovIC8qIChwdXJwb3NlZnVsbHkgZmFsbCB0aHJvdWdoIGNhc2Ugc3RhdGVtZW50cykgKi9cbiAgICAgICAgICBzd2l0Y2goYXJndW1lbnRzLmxlbmd0aCkge1xuICAgICAgICAgIGNhc2UgNDpcbiAgICAgICAgICAgIGVycm9yID0gYTQ7XG4gICAgICAgICAgICBzdWNjZXNzID0gYTM7XG4gICAgICAgICAgICAvL2ZhbGx0aHJvdWdoXG4gICAgICAgICAgY2FzZSAzOlxuICAgICAgICAgIGNhc2UgMjpcbiAgICAgICAgICAgIGlmIChpc0Z1bmN0aW9uKGEyKSkge1xuICAgICAgICAgICAgICBpZiAoaXNGdW5jdGlvbihhMSkpIHtcbiAgICAgICAgICAgICAgICBzdWNjZXNzID0gYTE7XG4gICAgICAgICAgICAgICAgZXJyb3IgPSBhMjtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgIHN1Y2Nlc3MgPSBhMjtcbiAgICAgICAgICAgICAgZXJyb3IgPSBhMztcbiAgICAgICAgICAgICAgLy9mYWxsdGhyb3VnaFxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgcGFyYW1zID0gYTE7XG4gICAgICAgICAgICAgIGRhdGEgPSBhMjtcbiAgICAgICAgICAgICAgc3VjY2VzcyA9IGEzO1xuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICBjYXNlIDE6XG4gICAgICAgICAgICBpZiAoaXNGdW5jdGlvbihhMSkpIHN1Y2Nlc3MgPSBhMTtcbiAgICAgICAgICAgIGVsc2UgaWYgKGhhc0JvZHkpIGRhdGEgPSBhMTtcbiAgICAgICAgICAgIGVsc2UgcGFyYW1zID0gYTE7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICBjYXNlIDA6IGJyZWFrO1xuICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICB0aHJvdyAkcmVzb3VyY2VNaW5FcnIoJ2JhZGFyZ3MnLFxuICAgICAgICAgICAgICBcIkV4cGVjdGVkIHVwIHRvIDQgYXJndW1lbnRzIFtwYXJhbXMsIGRhdGEsIHN1Y2Nlc3MsIGVycm9yXSwgZ290IHswfSBhcmd1bWVudHNcIixcbiAgICAgICAgICAgICAgYXJndW1lbnRzLmxlbmd0aCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIC8qIGpzaGludCArVzA4NiAqLyAvKiAocHVycG9zZWZ1bGx5IGZhbGwgdGhyb3VnaCBjYXNlIHN0YXRlbWVudHMpICovXG5cbiAgICAgICAgICB2YXIgaXNJbnN0YW5jZUNhbGwgPSB0aGlzIGluc3RhbmNlb2YgUmVzb3VyY2U7XG4gICAgICAgICAgdmFyIHZhbHVlID0gaXNJbnN0YW5jZUNhbGwgPyBkYXRhIDogKGFjdGlvbi5pc0FycmF5ID8gW10gOiBuZXcgUmVzb3VyY2UoZGF0YSkpO1xuICAgICAgICAgIHZhciBodHRwQ29uZmlnID0ge307XG4gICAgICAgICAgdmFyIHJlc3BvbnNlSW50ZXJjZXB0b3IgPSBhY3Rpb24uaW50ZXJjZXB0b3IgJiYgYWN0aW9uLmludGVyY2VwdG9yLnJlc3BvbnNlIHx8XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWZhdWx0UmVzcG9uc2VJbnRlcmNlcHRvcjtcbiAgICAgICAgICB2YXIgcmVzcG9uc2VFcnJvckludGVyY2VwdG9yID0gYWN0aW9uLmludGVyY2VwdG9yICYmIGFjdGlvbi5pbnRlcmNlcHRvci5yZXNwb25zZUVycm9yIHx8XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB1bmRlZmluZWQ7XG5cbiAgICAgICAgICBmb3JFYWNoKGFjdGlvbiwgZnVuY3Rpb24odmFsdWUsIGtleSkge1xuICAgICAgICAgICAgaWYgKGtleSAhPSAncGFyYW1zJyAmJiBrZXkgIT0gJ2lzQXJyYXknICYmIGtleSAhPSAnaW50ZXJjZXB0b3InKSB7XG4gICAgICAgICAgICAgIGh0dHBDb25maWdba2V5XSA9IGNvcHkodmFsdWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgaWYgKGhhc0JvZHkpIGh0dHBDb25maWcuZGF0YSA9IGRhdGE7XG4gICAgICAgICAgcm91dGUuc2V0VXJsUGFyYW1zKGh0dHBDb25maWcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIGV4dGVuZCh7fSwgZXh0cmFjdFBhcmFtcyhkYXRhLCBhY3Rpb24ucGFyYW1zIHx8IHt9KSwgcGFyYW1zKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYWN0aW9uLnVybCk7XG5cbiAgICAgICAgICB2YXIgcHJvbWlzZSA9ICRodHRwKGh0dHBDb25maWcpLnRoZW4oZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICB2YXIgZGF0YSA9IHJlc3BvbnNlLmRhdGEsXG4gICAgICAgICAgICAgIHByb21pc2UgPSB2YWx1ZS4kcHJvbWlzZTtcblxuICAgICAgICAgICAgaWYgKGRhdGEpIHtcbiAgICAgICAgICAgICAgLy8gTmVlZCB0byBjb252ZXJ0IGFjdGlvbi5pc0FycmF5IHRvIGJvb2xlYW4gaW4gY2FzZSBpdCBpcyB1bmRlZmluZWRcbiAgICAgICAgICAgICAgLy8ganNoaW50IC1XMDE4XG4gICAgICAgICAgICAgIGlmIChhbmd1bGFyLmlzQXJyYXkoZGF0YSkgIT09ICghIWFjdGlvbi5pc0FycmF5KSkge1xuICAgICAgICAgICAgICAgIHRocm93ICRyZXNvdXJjZU1pbkVycignYmFkY2ZnJyxcbiAgICAgICAgICAgICAgICAgICAgJ0Vycm9yIGluIHJlc291cmNlIGNvbmZpZ3VyYXRpb24uIEV4cGVjdGVkICcgK1xuICAgICAgICAgICAgICAgICAgICAncmVzcG9uc2UgdG8gY29udGFpbiBhbiB7MH0gYnV0IGdvdCBhbiB7MX0nLFxuICAgICAgICAgICAgICAgICAgYWN0aW9uLmlzQXJyYXkgPyAnYXJyYXknIDogJ29iamVjdCcsXG4gICAgICAgICAgICAgICAgICBhbmd1bGFyLmlzQXJyYXkoZGF0YSkgPyAnYXJyYXknIDogJ29iamVjdCcpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIC8vIGpzaGludCArVzAxOFxuICAgICAgICAgICAgICBpZiAoYWN0aW9uLmlzQXJyYXkpIHtcbiAgICAgICAgICAgICAgICB2YWx1ZS5sZW5ndGggPSAwO1xuICAgICAgICAgICAgICAgIGZvckVhY2goZGF0YSwgZnVuY3Rpb24gKGl0ZW0pIHtcbiAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgaXRlbSA9PT0gXCJvYmplY3RcIikge1xuICAgICAgICAgICAgICAgICAgICB2YWx1ZS5wdXNoKG5ldyBSZXNvdXJjZShpdGVtKSk7XG4gICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAvLyBWYWxpZCBKU09OIHZhbHVlcyBtYXkgYmUgc3RyaW5nIGxpdGVyYWxzLCBhbmQgdGhlc2Ugc2hvdWxkIG5vdCBiZSBjb252ZXJ0ZWRcbiAgICAgICAgICAgICAgICAgICAgLy8gaW50byBvYmplY3RzLiBUaGVzZSBpdGVtcyB3aWxsIG5vdCBoYXZlIGFjY2VzcyB0byB0aGUgUmVzb3VyY2UgcHJvdG90eXBlXG4gICAgICAgICAgICAgICAgICAgIC8vIG1ldGhvZHMsIGJ1dCB1bmZvcnR1bmF0ZWx5IHRoZXJlXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlLnB1c2goaXRlbSk7XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgc2hhbGxvd0NsZWFyQW5kQ29weShkYXRhLCB2YWx1ZSk7XG4gICAgICAgICAgICAgICAgdmFsdWUuJHByb21pc2UgPSBwcm9taXNlO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhbHVlLiRyZXNvbHZlZCA9IHRydWU7XG5cbiAgICAgICAgICAgIHJlc3BvbnNlLnJlc291cmNlID0gdmFsdWU7XG5cbiAgICAgICAgICAgIHJldHVybiByZXNwb25zZTtcbiAgICAgICAgICB9LCBmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICAgICAgICAgdmFsdWUuJHJlc29sdmVkID0gdHJ1ZTtcblxuICAgICAgICAgICAgKGVycm9yfHxub29wKShyZXNwb25zZSk7XG5cbiAgICAgICAgICAgIHJldHVybiAkcS5yZWplY3QocmVzcG9uc2UpO1xuICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgcHJvbWlzZSA9IHByb21pc2UudGhlbihcbiAgICAgICAgICAgICAgZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAgICAgICAgICAgICB2YXIgdmFsdWUgPSByZXNwb25zZUludGVyY2VwdG9yKHJlc3BvbnNlKTtcbiAgICAgICAgICAgICAgICAoc3VjY2Vzc3x8bm9vcCkodmFsdWUsIHJlc3BvbnNlLmhlYWRlcnMpO1xuICAgICAgICAgICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgcmVzcG9uc2VFcnJvckludGVyY2VwdG9yKTtcblxuICAgICAgICAgIGlmICghaXNJbnN0YW5jZUNhbGwpIHtcbiAgICAgICAgICAgIC8vIHdlIGFyZSBjcmVhdGluZyBpbnN0YW5jZSAvIGNvbGxlY3Rpb25cbiAgICAgICAgICAgIC8vIC0gc2V0IHRoZSBpbml0aWFsIHByb21pc2VcbiAgICAgICAgICAgIC8vIC0gcmV0dXJuIHRoZSBpbnN0YW5jZSAvIGNvbGxlY3Rpb25cbiAgICAgICAgICAgIHZhbHVlLiRwcm9taXNlID0gcHJvbWlzZTtcbiAgICAgICAgICAgIHZhbHVlLiRyZXNvbHZlZCA9IGZhbHNlO1xuXG4gICAgICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgLy8gaW5zdGFuY2UgY2FsbFxuICAgICAgICAgIHJldHVybiBwcm9taXNlO1xuICAgICAgICB9O1xuXG5cbiAgICAgICAgUmVzb3VyY2UucHJvdG90eXBlWyckJyArIG5hbWVdID0gZnVuY3Rpb24ocGFyYW1zLCBzdWNjZXNzLCBlcnJvcikge1xuICAgICAgICAgIGlmIChpc0Z1bmN0aW9uKHBhcmFtcykpIHtcbiAgICAgICAgICAgIGVycm9yID0gc3VjY2Vzczsgc3VjY2VzcyA9IHBhcmFtczsgcGFyYW1zID0ge307XG4gICAgICAgICAgfVxuICAgICAgICAgIHZhciByZXN1bHQgPSBSZXNvdXJjZVtuYW1lXS5jYWxsKHRoaXMsIHBhcmFtcywgdGhpcywgc3VjY2VzcywgZXJyb3IpO1xuICAgICAgICAgIHJldHVybiByZXN1bHQuJHByb21pc2UgfHwgcmVzdWx0O1xuICAgICAgICB9O1xuICAgICAgfSk7XG5cbiAgICAgIFJlc291cmNlLmJpbmQgPSBmdW5jdGlvbihhZGRpdGlvbmFsUGFyYW1EZWZhdWx0cyl7XG4gICAgICAgIHJldHVybiByZXNvdXJjZUZhY3RvcnkodXJsLCBleHRlbmQoe30sIHBhcmFtRGVmYXVsdHMsIGFkZGl0aW9uYWxQYXJhbURlZmF1bHRzKSwgYWN0aW9ucyk7XG4gICAgICB9O1xuXG4gICAgICByZXR1cm4gUmVzb3VyY2U7XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlc291cmNlRmFjdG9yeTtcbiAgfV0pO1xuXG5cbn0pKHdpbmRvdywgd2luZG93LmFuZ3VsYXIpO1xuIiwiLyoqXG4gKiBAbGljZW5zZSBBbmd1bGFySlMgdjEuMi4yMVxuICogKGMpIDIwMTAtMjAxNCBHb29nbGUsIEluYy4gaHR0cDovL2FuZ3VsYXJqcy5vcmdcbiAqIExpY2Vuc2U6IE1JVFxuICovXG4oZnVuY3Rpb24od2luZG93LCBhbmd1bGFyLCB1bmRlZmluZWQpIHsndXNlIHN0cmljdCc7XG5cbi8qKlxuICogQG5nZG9jIG1vZHVsZVxuICogQG5hbWUgbmdSb3V0ZVxuICogQGRlc2NyaXB0aW9uXG4gKlxuICogIyBuZ1JvdXRlXG4gKlxuICogVGhlIGBuZ1JvdXRlYCBtb2R1bGUgcHJvdmlkZXMgcm91dGluZyBhbmQgZGVlcGxpbmtpbmcgc2VydmljZXMgYW5kIGRpcmVjdGl2ZXMgZm9yIGFuZ3VsYXIgYXBwcy5cbiAqXG4gKiAjIyBFeGFtcGxlXG4gKiBTZWUge0BsaW5rIG5nUm91dGUuJHJvdXRlI2V4YW1wbGUgJHJvdXRlfSBmb3IgYW4gZXhhbXBsZSBvZiBjb25maWd1cmluZyBhbmQgdXNpbmcgYG5nUm91dGVgLlxuICpcbiAqXG4gKiA8ZGl2IGRvYy1tb2R1bGUtY29tcG9uZW50cz1cIm5nUm91dGVcIj48L2Rpdj5cbiAqL1xuIC8qIGdsb2JhbCAtbmdSb3V0ZU1vZHVsZSAqL1xudmFyIG5nUm91dGVNb2R1bGUgPSBhbmd1bGFyLm1vZHVsZSgnbmdSb3V0ZScsIFsnbmcnXSkuXG4gICAgICAgICAgICAgICAgICAgICAgICBwcm92aWRlcignJHJvdXRlJywgJFJvdXRlUHJvdmlkZXIpO1xuXG4vKipcbiAqIEBuZ2RvYyBwcm92aWRlclxuICogQG5hbWUgJHJvdXRlUHJvdmlkZXJcbiAqIEBraW5kIGZ1bmN0aW9uXG4gKlxuICogQGRlc2NyaXB0aW9uXG4gKlxuICogVXNlZCBmb3IgY29uZmlndXJpbmcgcm91dGVzLlxuICpcbiAqICMjIEV4YW1wbGVcbiAqIFNlZSB7QGxpbmsgbmdSb3V0ZS4kcm91dGUjZXhhbXBsZSAkcm91dGV9IGZvciBhbiBleGFtcGxlIG9mIGNvbmZpZ3VyaW5nIGFuZCB1c2luZyBgbmdSb3V0ZWAuXG4gKlxuICogIyMgRGVwZW5kZW5jaWVzXG4gKiBSZXF1aXJlcyB0aGUge0BsaW5rIG5nUm91dGUgYG5nUm91dGVgfSBtb2R1bGUgdG8gYmUgaW5zdGFsbGVkLlxuICovXG5mdW5jdGlvbiAkUm91dGVQcm92aWRlcigpe1xuICBmdW5jdGlvbiBpbmhlcml0KHBhcmVudCwgZXh0cmEpIHtcbiAgICByZXR1cm4gYW5ndWxhci5leHRlbmQobmV3IChhbmd1bGFyLmV4dGVuZChmdW5jdGlvbigpIHt9LCB7cHJvdG90eXBlOnBhcmVudH0pKSgpLCBleHRyYSk7XG4gIH1cblxuICB2YXIgcm91dGVzID0ge307XG5cbiAgLyoqXG4gICAqIEBuZ2RvYyBtZXRob2RcbiAgICogQG5hbWUgJHJvdXRlUHJvdmlkZXIjd2hlblxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gcGF0aCBSb3V0ZSBwYXRoIChtYXRjaGVkIGFnYWluc3QgYCRsb2NhdGlvbi5wYXRoYCkuIElmIGAkbG9jYXRpb24ucGF0aGBcbiAgICogICAgY29udGFpbnMgcmVkdW5kYW50IHRyYWlsaW5nIHNsYXNoIG9yIGlzIG1pc3Npbmcgb25lLCB0aGUgcm91dGUgd2lsbCBzdGlsbCBtYXRjaCBhbmQgdGhlXG4gICAqICAgIGAkbG9jYXRpb24ucGF0aGAgd2lsbCBiZSB1cGRhdGVkIHRvIGFkZCBvciBkcm9wIHRoZSB0cmFpbGluZyBzbGFzaCB0byBleGFjdGx5IG1hdGNoIHRoZVxuICAgKiAgICByb3V0ZSBkZWZpbml0aW9uLlxuICAgKlxuICAgKiAgICAqIGBwYXRoYCBjYW4gY29udGFpbiBuYW1lZCBncm91cHMgc3RhcnRpbmcgd2l0aCBhIGNvbG9uOiBlLmcuIGA6bmFtZWAuIEFsbCBjaGFyYWN0ZXJzIHVwXG4gICAqICAgICAgICB0byB0aGUgbmV4dCBzbGFzaCBhcmUgbWF0Y2hlZCBhbmQgc3RvcmVkIGluIGAkcm91dGVQYXJhbXNgIHVuZGVyIHRoZSBnaXZlbiBgbmFtZWBcbiAgICogICAgICAgIHdoZW4gdGhlIHJvdXRlIG1hdGNoZXMuXG4gICAqICAgICogYHBhdGhgIGNhbiBjb250YWluIG5hbWVkIGdyb3VwcyBzdGFydGluZyB3aXRoIGEgY29sb24gYW5kIGVuZGluZyB3aXRoIGEgc3RhcjpcbiAgICogICAgICAgIGUuZy5gOm5hbWUqYC4gQWxsIGNoYXJhY3RlcnMgYXJlIGVhZ2VybHkgc3RvcmVkIGluIGAkcm91dGVQYXJhbXNgIHVuZGVyIHRoZSBnaXZlbiBgbmFtZWBcbiAgICogICAgICAgIHdoZW4gdGhlIHJvdXRlIG1hdGNoZXMuXG4gICAqICAgICogYHBhdGhgIGNhbiBjb250YWluIG9wdGlvbmFsIG5hbWVkIGdyb3VwcyB3aXRoIGEgcXVlc3Rpb24gbWFyazogZS5nLmA6bmFtZT9gLlxuICAgKlxuICAgKiAgICBGb3IgZXhhbXBsZSwgcm91dGVzIGxpa2UgYC9jb2xvci86Y29sb3IvbGFyZ2Vjb2RlLzpsYXJnZWNvZGUqXFwvZWRpdGAgd2lsbCBtYXRjaFxuICAgKiAgICBgL2NvbG9yL2Jyb3duL2xhcmdlY29kZS9jb2RlL3dpdGgvc2xhc2hlcy9lZGl0YCBhbmQgZXh0cmFjdDpcbiAgICpcbiAgICogICAgKiBgY29sb3I6IGJyb3duYFxuICAgKiAgICAqIGBsYXJnZWNvZGU6IGNvZGUvd2l0aC9zbGFzaGVzYC5cbiAgICpcbiAgICpcbiAgICogQHBhcmFtIHtPYmplY3R9IHJvdXRlIE1hcHBpbmcgaW5mb3JtYXRpb24gdG8gYmUgYXNzaWduZWQgdG8gYCRyb3V0ZS5jdXJyZW50YCBvbiByb3V0ZVxuICAgKiAgICBtYXRjaC5cbiAgICpcbiAgICogICAgT2JqZWN0IHByb3BlcnRpZXM6XG4gICAqXG4gICAqICAgIC0gYGNvbnRyb2xsZXJgIOKAkyBgeyhzdHJpbmd8ZnVuY3Rpb24oKT19YCDigJMgQ29udHJvbGxlciBmbiB0aGF0IHNob3VsZCBiZSBhc3NvY2lhdGVkIHdpdGhcbiAgICogICAgICBuZXdseSBjcmVhdGVkIHNjb3BlIG9yIHRoZSBuYW1lIG9mIGEge0BsaW5rIGFuZ3VsYXIuTW9kdWxlI2NvbnRyb2xsZXIgcmVnaXN0ZXJlZFxuICAgKiAgICAgIGNvbnRyb2xsZXJ9IGlmIHBhc3NlZCBhcyBhIHN0cmluZy5cbiAgICogICAgLSBgY29udHJvbGxlckFzYCDigJMgYHtzdHJpbmc9fWAg4oCTIEEgY29udHJvbGxlciBhbGlhcyBuYW1lLiBJZiBwcmVzZW50IHRoZSBjb250cm9sbGVyIHdpbGwgYmVcbiAgICogICAgICBwdWJsaXNoZWQgdG8gc2NvcGUgdW5kZXIgdGhlIGBjb250cm9sbGVyQXNgIG5hbWUuXG4gICAqICAgIC0gYHRlbXBsYXRlYCDigJMgYHtzdHJpbmc9fGZ1bmN0aW9uKCk9fWAg4oCTIGh0bWwgdGVtcGxhdGUgYXMgYSBzdHJpbmcgb3IgYSBmdW5jdGlvbiB0aGF0XG4gICAqICAgICAgcmV0dXJucyBhbiBodG1sIHRlbXBsYXRlIGFzIGEgc3RyaW5nIHdoaWNoIHNob3VsZCBiZSB1c2VkIGJ5IHtAbGlua1xuICAgKiAgICAgIG5nUm91dGUuZGlyZWN0aXZlOm5nVmlldyBuZ1ZpZXd9IG9yIHtAbGluayBuZy5kaXJlY3RpdmU6bmdJbmNsdWRlIG5nSW5jbHVkZX0gZGlyZWN0aXZlcy5cbiAgICogICAgICBUaGlzIHByb3BlcnR5IHRha2VzIHByZWNlZGVuY2Ugb3ZlciBgdGVtcGxhdGVVcmxgLlxuICAgKlxuICAgKiAgICAgIElmIGB0ZW1wbGF0ZWAgaXMgYSBmdW5jdGlvbiwgaXQgd2lsbCBiZSBjYWxsZWQgd2l0aCB0aGUgZm9sbG93aW5nIHBhcmFtZXRlcnM6XG4gICAqXG4gICAqICAgICAgLSBge0FycmF5LjxPYmplY3Q+fWAgLSByb3V0ZSBwYXJhbWV0ZXJzIGV4dHJhY3RlZCBmcm9tIHRoZSBjdXJyZW50XG4gICAqICAgICAgICBgJGxvY2F0aW9uLnBhdGgoKWAgYnkgYXBwbHlpbmcgdGhlIGN1cnJlbnQgcm91dGVcbiAgICpcbiAgICogICAgLSBgdGVtcGxhdGVVcmxgIOKAkyBge3N0cmluZz18ZnVuY3Rpb24oKT19YCDigJMgcGF0aCBvciBmdW5jdGlvbiB0aGF0IHJldHVybnMgYSBwYXRoIHRvIGFuIGh0bWxcbiAgICogICAgICB0ZW1wbGF0ZSB0aGF0IHNob3VsZCBiZSB1c2VkIGJ5IHtAbGluayBuZ1JvdXRlLmRpcmVjdGl2ZTpuZ1ZpZXcgbmdWaWV3fS5cbiAgICpcbiAgICogICAgICBJZiBgdGVtcGxhdGVVcmxgIGlzIGEgZnVuY3Rpb24sIGl0IHdpbGwgYmUgY2FsbGVkIHdpdGggdGhlIGZvbGxvd2luZyBwYXJhbWV0ZXJzOlxuICAgKlxuICAgKiAgICAgIC0gYHtBcnJheS48T2JqZWN0Pn1gIC0gcm91dGUgcGFyYW1ldGVycyBleHRyYWN0ZWQgZnJvbSB0aGUgY3VycmVudFxuICAgKiAgICAgICAgYCRsb2NhdGlvbi5wYXRoKClgIGJ5IGFwcGx5aW5nIHRoZSBjdXJyZW50IHJvdXRlXG4gICAqXG4gICAqICAgIC0gYHJlc29sdmVgIC0gYHtPYmplY3QuPHN0cmluZywgZnVuY3Rpb24+PX1gIC0gQW4gb3B0aW9uYWwgbWFwIG9mIGRlcGVuZGVuY2llcyB3aGljaCBzaG91bGRcbiAgICogICAgICBiZSBpbmplY3RlZCBpbnRvIHRoZSBjb250cm9sbGVyLiBJZiBhbnkgb2YgdGhlc2UgZGVwZW5kZW5jaWVzIGFyZSBwcm9taXNlcywgdGhlIHJvdXRlclxuICAgKiAgICAgIHdpbGwgd2FpdCBmb3IgdGhlbSBhbGwgdG8gYmUgcmVzb2x2ZWQgb3Igb25lIHRvIGJlIHJlamVjdGVkIGJlZm9yZSB0aGUgY29udHJvbGxlciBpc1xuICAgKiAgICAgIGluc3RhbnRpYXRlZC5cbiAgICogICAgICBJZiBhbGwgdGhlIHByb21pc2VzIGFyZSByZXNvbHZlZCBzdWNjZXNzZnVsbHksIHRoZSB2YWx1ZXMgb2YgdGhlIHJlc29sdmVkIHByb21pc2VzIGFyZVxuICAgKiAgICAgIGluamVjdGVkIGFuZCB7QGxpbmsgbmdSb3V0ZS4kcm91dGUjJHJvdXRlQ2hhbmdlU3VjY2VzcyAkcm91dGVDaGFuZ2VTdWNjZXNzfSBldmVudCBpc1xuICAgKiAgICAgIGZpcmVkLiBJZiBhbnkgb2YgdGhlIHByb21pc2VzIGFyZSByZWplY3RlZCB0aGVcbiAgICogICAgICB7QGxpbmsgbmdSb3V0ZS4kcm91dGUjJHJvdXRlQ2hhbmdlRXJyb3IgJHJvdXRlQ2hhbmdlRXJyb3J9IGV2ZW50IGlzIGZpcmVkLiBUaGUgbWFwIG9iamVjdFxuICAgKiAgICAgIGlzOlxuICAgKlxuICAgKiAgICAgIC0gYGtleWAg4oCTIGB7c3RyaW5nfWA6IGEgbmFtZSBvZiBhIGRlcGVuZGVuY3kgdG8gYmUgaW5qZWN0ZWQgaW50byB0aGUgY29udHJvbGxlci5cbiAgICogICAgICAtIGBmYWN0b3J5YCAtIGB7c3RyaW5nfGZ1bmN0aW9ufWA6IElmIGBzdHJpbmdgIHRoZW4gaXQgaXMgYW4gYWxpYXMgZm9yIGEgc2VydmljZS5cbiAgICogICAgICAgIE90aGVyd2lzZSBpZiBmdW5jdGlvbiwgdGhlbiBpdCBpcyB7QGxpbmsgYXV0by4kaW5qZWN0b3IjaW52b2tlIGluamVjdGVkfVxuICAgKiAgICAgICAgYW5kIHRoZSByZXR1cm4gdmFsdWUgaXMgdHJlYXRlZCBhcyB0aGUgZGVwZW5kZW5jeS4gSWYgdGhlIHJlc3VsdCBpcyBhIHByb21pc2UsIGl0IGlzXG4gICAqICAgICAgICByZXNvbHZlZCBiZWZvcmUgaXRzIHZhbHVlIGlzIGluamVjdGVkIGludG8gdGhlIGNvbnRyb2xsZXIuIEJlIGF3YXJlIHRoYXRcbiAgICogICAgICAgIGBuZ1JvdXRlLiRyb3V0ZVBhcmFtc2Agd2lsbCBzdGlsbCByZWZlciB0byB0aGUgcHJldmlvdXMgcm91dGUgd2l0aGluIHRoZXNlIHJlc29sdmVcbiAgICogICAgICAgIGZ1bmN0aW9ucy4gIFVzZSBgJHJvdXRlLmN1cnJlbnQucGFyYW1zYCB0byBhY2Nlc3MgdGhlIG5ldyByb3V0ZSBwYXJhbWV0ZXJzLCBpbnN0ZWFkLlxuICAgKlxuICAgKiAgICAtIGByZWRpcmVjdFRvYCDigJMgeyhzdHJpbmd8ZnVuY3Rpb24oKSk9fSDigJMgdmFsdWUgdG8gdXBkYXRlXG4gICAqICAgICAge0BsaW5rIG5nLiRsb2NhdGlvbiAkbG9jYXRpb259IHBhdGggd2l0aCBhbmQgdHJpZ2dlciByb3V0ZSByZWRpcmVjdGlvbi5cbiAgICpcbiAgICogICAgICBJZiBgcmVkaXJlY3RUb2AgaXMgYSBmdW5jdGlvbiwgaXQgd2lsbCBiZSBjYWxsZWQgd2l0aCB0aGUgZm9sbG93aW5nIHBhcmFtZXRlcnM6XG4gICAqXG4gICAqICAgICAgLSBge09iamVjdC48c3RyaW5nPn1gIC0gcm91dGUgcGFyYW1ldGVycyBleHRyYWN0ZWQgZnJvbSB0aGUgY3VycmVudFxuICAgKiAgICAgICAgYCRsb2NhdGlvbi5wYXRoKClgIGJ5IGFwcGx5aW5nIHRoZSBjdXJyZW50IHJvdXRlIHRlbXBsYXRlVXJsLlxuICAgKiAgICAgIC0gYHtzdHJpbmd9YCAtIGN1cnJlbnQgYCRsb2NhdGlvbi5wYXRoKClgXG4gICAqICAgICAgLSBge09iamVjdH1gIC0gY3VycmVudCBgJGxvY2F0aW9uLnNlYXJjaCgpYFxuICAgKlxuICAgKiAgICAgIFRoZSBjdXN0b20gYHJlZGlyZWN0VG9gIGZ1bmN0aW9uIGlzIGV4cGVjdGVkIHRvIHJldHVybiBhIHN0cmluZyB3aGljaCB3aWxsIGJlIHVzZWRcbiAgICogICAgICB0byB1cGRhdGUgYCRsb2NhdGlvbi5wYXRoKClgIGFuZCBgJGxvY2F0aW9uLnNlYXJjaCgpYC5cbiAgICpcbiAgICogICAgLSBgW3JlbG9hZE9uU2VhcmNoPXRydWVdYCAtIHtib29sZWFuPX0gLSByZWxvYWQgcm91dGUgd2hlbiBvbmx5IGAkbG9jYXRpb24uc2VhcmNoKClgXG4gICAqICAgICAgb3IgYCRsb2NhdGlvbi5oYXNoKClgIGNoYW5nZXMuXG4gICAqXG4gICAqICAgICAgSWYgdGhlIG9wdGlvbiBpcyBzZXQgdG8gYGZhbHNlYCBhbmQgdXJsIGluIHRoZSBicm93c2VyIGNoYW5nZXMsIHRoZW5cbiAgICogICAgICBgJHJvdXRlVXBkYXRlYCBldmVudCBpcyBicm9hZGNhc3RlZCBvbiB0aGUgcm9vdCBzY29wZS5cbiAgICpcbiAgICogICAgLSBgW2Nhc2VJbnNlbnNpdGl2ZU1hdGNoPWZhbHNlXWAgLSB7Ym9vbGVhbj19IC0gbWF0Y2ggcm91dGVzIHdpdGhvdXQgYmVpbmcgY2FzZSBzZW5zaXRpdmVcbiAgICpcbiAgICogICAgICBJZiB0aGUgb3B0aW9uIGlzIHNldCB0byBgdHJ1ZWAsIHRoZW4gdGhlIHBhcnRpY3VsYXIgcm91dGUgY2FuIGJlIG1hdGNoZWQgd2l0aG91dCBiZWluZ1xuICAgKiAgICAgIGNhc2Ugc2Vuc2l0aXZlXG4gICAqXG4gICAqIEByZXR1cm5zIHtPYmplY3R9IHNlbGZcbiAgICpcbiAgICogQGRlc2NyaXB0aW9uXG4gICAqIEFkZHMgYSBuZXcgcm91dGUgZGVmaW5pdGlvbiB0byB0aGUgYCRyb3V0ZWAgc2VydmljZS5cbiAgICovXG4gIHRoaXMud2hlbiA9IGZ1bmN0aW9uKHBhdGgsIHJvdXRlKSB7XG4gICAgcm91dGVzW3BhdGhdID0gYW5ndWxhci5leHRlbmQoXG4gICAgICB7cmVsb2FkT25TZWFyY2g6IHRydWV9LFxuICAgICAgcm91dGUsXG4gICAgICBwYXRoICYmIHBhdGhSZWdFeHAocGF0aCwgcm91dGUpXG4gICAgKTtcblxuICAgIC8vIGNyZWF0ZSByZWRpcmVjdGlvbiBmb3IgdHJhaWxpbmcgc2xhc2hlc1xuICAgIGlmIChwYXRoKSB7XG4gICAgICB2YXIgcmVkaXJlY3RQYXRoID0gKHBhdGhbcGF0aC5sZW5ndGgtMV0gPT0gJy8nKVxuICAgICAgICAgICAgPyBwYXRoLnN1YnN0cigwLCBwYXRoLmxlbmd0aC0xKVxuICAgICAgICAgICAgOiBwYXRoICsnLyc7XG5cbiAgICAgIHJvdXRlc1tyZWRpcmVjdFBhdGhdID0gYW5ndWxhci5leHRlbmQoXG4gICAgICAgIHtyZWRpcmVjdFRvOiBwYXRofSxcbiAgICAgICAgcGF0aFJlZ0V4cChyZWRpcmVjdFBhdGgsIHJvdXRlKVxuICAgICAgKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfTtcblxuICAgLyoqXG4gICAgKiBAcGFyYW0gcGF0aCB7c3RyaW5nfSBwYXRoXG4gICAgKiBAcGFyYW0gb3B0cyB7T2JqZWN0fSBvcHRpb25zXG4gICAgKiBAcmV0dXJuIHs/T2JqZWN0fVxuICAgICpcbiAgICAqIEBkZXNjcmlwdGlvblxuICAgICogTm9ybWFsaXplcyB0aGUgZ2l2ZW4gcGF0aCwgcmV0dXJuaW5nIGEgcmVndWxhciBleHByZXNzaW9uXG4gICAgKiBhbmQgdGhlIG9yaWdpbmFsIHBhdGguXG4gICAgKlxuICAgICogSW5zcGlyZWQgYnkgcGF0aFJleHAgaW4gdmlzaW9ubWVkaWEvZXhwcmVzcy9saWIvdXRpbHMuanMuXG4gICAgKi9cbiAgZnVuY3Rpb24gcGF0aFJlZ0V4cChwYXRoLCBvcHRzKSB7XG4gICAgdmFyIGluc2Vuc2l0aXZlID0gb3B0cy5jYXNlSW5zZW5zaXRpdmVNYXRjaCxcbiAgICAgICAgcmV0ID0ge1xuICAgICAgICAgIG9yaWdpbmFsUGF0aDogcGF0aCxcbiAgICAgICAgICByZWdleHA6IHBhdGhcbiAgICAgICAgfSxcbiAgICAgICAga2V5cyA9IHJldC5rZXlzID0gW107XG5cbiAgICBwYXRoID0gcGF0aFxuICAgICAgLnJlcGxhY2UoLyhbKCkuXSkvZywgJ1xcXFwkMScpXG4gICAgICAucmVwbGFjZSgvKFxcLyk/OihcXHcrKShbXFw/XFwqXSk/L2csIGZ1bmN0aW9uKF8sIHNsYXNoLCBrZXksIG9wdGlvbil7XG4gICAgICAgIHZhciBvcHRpb25hbCA9IG9wdGlvbiA9PT0gJz8nID8gb3B0aW9uIDogbnVsbDtcbiAgICAgICAgdmFyIHN0YXIgPSBvcHRpb24gPT09ICcqJyA/IG9wdGlvbiA6IG51bGw7XG4gICAgICAgIGtleXMucHVzaCh7IG5hbWU6IGtleSwgb3B0aW9uYWw6ICEhb3B0aW9uYWwgfSk7XG4gICAgICAgIHNsYXNoID0gc2xhc2ggfHwgJyc7XG4gICAgICAgIHJldHVybiAnJ1xuICAgICAgICAgICsgKG9wdGlvbmFsID8gJycgOiBzbGFzaClcbiAgICAgICAgICArICcoPzonXG4gICAgICAgICAgKyAob3B0aW9uYWwgPyBzbGFzaCA6ICcnKVxuICAgICAgICAgICsgKHN0YXIgJiYgJyguKz8pJyB8fCAnKFteL10rKScpXG4gICAgICAgICAgKyAob3B0aW9uYWwgfHwgJycpXG4gICAgICAgICAgKyAnKSdcbiAgICAgICAgICArIChvcHRpb25hbCB8fCAnJyk7XG4gICAgICB9KVxuICAgICAgLnJlcGxhY2UoLyhbXFwvJFxcKl0pL2csICdcXFxcJDEnKTtcblxuICAgIHJldC5yZWdleHAgPSBuZXcgUmVnRXhwKCdeJyArIHBhdGggKyAnJCcsIGluc2Vuc2l0aXZlID8gJ2knIDogJycpO1xuICAgIHJldHVybiByZXQ7XG4gIH1cblxuICAvKipcbiAgICogQG5nZG9jIG1ldGhvZFxuICAgKiBAbmFtZSAkcm91dGVQcm92aWRlciNvdGhlcndpc2VcbiAgICpcbiAgICogQGRlc2NyaXB0aW9uXG4gICAqIFNldHMgcm91dGUgZGVmaW5pdGlvbiB0aGF0IHdpbGwgYmUgdXNlZCBvbiByb3V0ZSBjaGFuZ2Ugd2hlbiBubyBvdGhlciByb3V0ZSBkZWZpbml0aW9uXG4gICAqIGlzIG1hdGNoZWQuXG4gICAqXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBwYXJhbXMgTWFwcGluZyBpbmZvcm1hdGlvbiB0byBiZSBhc3NpZ25lZCB0byBgJHJvdXRlLmN1cnJlbnRgLlxuICAgKiBAcmV0dXJucyB7T2JqZWN0fSBzZWxmXG4gICAqL1xuICB0aGlzLm90aGVyd2lzZSA9IGZ1bmN0aW9uKHBhcmFtcykge1xuICAgIHRoaXMud2hlbihudWxsLCBwYXJhbXMpO1xuICAgIHJldHVybiB0aGlzO1xuICB9O1xuXG5cbiAgdGhpcy4kZ2V0ID0gWyckcm9vdFNjb3BlJyxcbiAgICAgICAgICAgICAgICckbG9jYXRpb24nLFxuICAgICAgICAgICAgICAgJyRyb3V0ZVBhcmFtcycsXG4gICAgICAgICAgICAgICAnJHEnLFxuICAgICAgICAgICAgICAgJyRpbmplY3RvcicsXG4gICAgICAgICAgICAgICAnJGh0dHAnLFxuICAgICAgICAgICAgICAgJyR0ZW1wbGF0ZUNhY2hlJyxcbiAgICAgICAgICAgICAgICckc2NlJyxcbiAgICAgIGZ1bmN0aW9uKCRyb290U2NvcGUsICRsb2NhdGlvbiwgJHJvdXRlUGFyYW1zLCAkcSwgJGluamVjdG9yLCAkaHR0cCwgJHRlbXBsYXRlQ2FjaGUsICRzY2UpIHtcblxuICAgIC8qKlxuICAgICAqIEBuZ2RvYyBzZXJ2aWNlXG4gICAgICogQG5hbWUgJHJvdXRlXG4gICAgICogQHJlcXVpcmVzICRsb2NhdGlvblxuICAgICAqIEByZXF1aXJlcyAkcm91dGVQYXJhbXNcbiAgICAgKlxuICAgICAqIEBwcm9wZXJ0eSB7T2JqZWN0fSBjdXJyZW50IFJlZmVyZW5jZSB0byB0aGUgY3VycmVudCByb3V0ZSBkZWZpbml0aW9uLlxuICAgICAqIFRoZSByb3V0ZSBkZWZpbml0aW9uIGNvbnRhaW5zOlxuICAgICAqXG4gICAgICogICAtIGBjb250cm9sbGVyYDogVGhlIGNvbnRyb2xsZXIgY29uc3RydWN0b3IgYXMgZGVmaW5lIGluIHJvdXRlIGRlZmluaXRpb24uXG4gICAgICogICAtIGBsb2NhbHNgOiBBIG1hcCBvZiBsb2NhbHMgd2hpY2ggaXMgdXNlZCBieSB7QGxpbmsgbmcuJGNvbnRyb2xsZXIgJGNvbnRyb2xsZXJ9IHNlcnZpY2UgZm9yXG4gICAgICogICAgIGNvbnRyb2xsZXIgaW5zdGFudGlhdGlvbi4gVGhlIGBsb2NhbHNgIGNvbnRhaW5cbiAgICAgKiAgICAgdGhlIHJlc29sdmVkIHZhbHVlcyBvZiB0aGUgYHJlc29sdmVgIG1hcC4gQWRkaXRpb25hbGx5IHRoZSBgbG9jYWxzYCBhbHNvIGNvbnRhaW46XG4gICAgICpcbiAgICAgKiAgICAgLSBgJHNjb3BlYCAtIFRoZSBjdXJyZW50IHJvdXRlIHNjb3BlLlxuICAgICAqICAgICAtIGAkdGVtcGxhdGVgIC0gVGhlIGN1cnJlbnQgcm91dGUgdGVtcGxhdGUgSFRNTC5cbiAgICAgKlxuICAgICAqIEBwcm9wZXJ0eSB7T2JqZWN0fSByb3V0ZXMgT2JqZWN0IHdpdGggYWxsIHJvdXRlIGNvbmZpZ3VyYXRpb24gT2JqZWN0cyBhcyBpdHMgcHJvcGVydGllcy5cbiAgICAgKlxuICAgICAqIEBkZXNjcmlwdGlvblxuICAgICAqIGAkcm91dGVgIGlzIHVzZWQgZm9yIGRlZXAtbGlua2luZyBVUkxzIHRvIGNvbnRyb2xsZXJzIGFuZCB2aWV3cyAoSFRNTCBwYXJ0aWFscykuXG4gICAgICogSXQgd2F0Y2hlcyBgJGxvY2F0aW9uLnVybCgpYCBhbmQgdHJpZXMgdG8gbWFwIHRoZSBwYXRoIHRvIGFuIGV4aXN0aW5nIHJvdXRlIGRlZmluaXRpb24uXG4gICAgICpcbiAgICAgKiBSZXF1aXJlcyB0aGUge0BsaW5rIG5nUm91dGUgYG5nUm91dGVgfSBtb2R1bGUgdG8gYmUgaW5zdGFsbGVkLlxuICAgICAqXG4gICAgICogWW91IGNhbiBkZWZpbmUgcm91dGVzIHRocm91Z2gge0BsaW5rIG5nUm91dGUuJHJvdXRlUHJvdmlkZXIgJHJvdXRlUHJvdmlkZXJ9J3MgQVBJLlxuICAgICAqXG4gICAgICogVGhlIGAkcm91dGVgIHNlcnZpY2UgaXMgdHlwaWNhbGx5IHVzZWQgaW4gY29uanVuY3Rpb24gd2l0aCB0aGVcbiAgICAgKiB7QGxpbmsgbmdSb3V0ZS5kaXJlY3RpdmU6bmdWaWV3IGBuZ1ZpZXdgfSBkaXJlY3RpdmUgYW5kIHRoZVxuICAgICAqIHtAbGluayBuZ1JvdXRlLiRyb3V0ZVBhcmFtcyBgJHJvdXRlUGFyYW1zYH0gc2VydmljZS5cbiAgICAgKlxuICAgICAqIEBleGFtcGxlXG4gICAgICogVGhpcyBleGFtcGxlIHNob3dzIGhvdyBjaGFuZ2luZyB0aGUgVVJMIGhhc2ggY2F1c2VzIHRoZSBgJHJvdXRlYCB0byBtYXRjaCBhIHJvdXRlIGFnYWluc3QgdGhlXG4gICAgICogVVJMLCBhbmQgdGhlIGBuZ1ZpZXdgIHB1bGxzIGluIHRoZSBwYXJ0aWFsLlxuICAgICAqXG4gICAgICogTm90ZSB0aGF0IHRoaXMgZXhhbXBsZSBpcyB1c2luZyB7QGxpbmsgbmcuZGlyZWN0aXZlOnNjcmlwdCBpbmxpbmVkIHRlbXBsYXRlc31cbiAgICAgKiB0byBnZXQgaXQgd29ya2luZyBvbiBqc2ZpZGRsZSBhcyB3ZWxsLlxuICAgICAqXG4gICAgICogPGV4YW1wbGUgbmFtZT1cIiRyb3V0ZS1zZXJ2aWNlXCIgbW9kdWxlPVwibmdSb3V0ZUV4YW1wbGVcIlxuICAgICAqICAgICAgICAgIGRlcHM9XCJhbmd1bGFyLXJvdXRlLmpzXCIgZml4QmFzZT1cInRydWVcIj5cbiAgICAgKiAgIDxmaWxlIG5hbWU9XCJpbmRleC5odG1sXCI+XG4gICAgICogICAgIDxkaXYgbmctY29udHJvbGxlcj1cIk1haW5Db250cm9sbGVyXCI+XG4gICAgICogICAgICAgQ2hvb3NlOlxuICAgICAqICAgICAgIDxhIGhyZWY9XCJCb29rL01vYnlcIj5Nb2J5PC9hPiB8XG4gICAgICogICAgICAgPGEgaHJlZj1cIkJvb2svTW9ieS9jaC8xXCI+TW9ieTogQ2gxPC9hPiB8XG4gICAgICogICAgICAgPGEgaHJlZj1cIkJvb2svR2F0c2J5XCI+R2F0c2J5PC9hPiB8XG4gICAgICogICAgICAgPGEgaHJlZj1cIkJvb2svR2F0c2J5L2NoLzQ/a2V5PXZhbHVlXCI+R2F0c2J5OiBDaDQ8L2E+IHxcbiAgICAgKiAgICAgICA8YSBocmVmPVwiQm9vay9TY2FybGV0XCI+U2NhcmxldCBMZXR0ZXI8L2E+PGJyLz5cbiAgICAgKlxuICAgICAqICAgICAgIDxkaXYgbmctdmlldz48L2Rpdj5cbiAgICAgKlxuICAgICAqICAgICAgIDxociAvPlxuICAgICAqXG4gICAgICogICAgICAgPHByZT4kbG9jYXRpb24ucGF0aCgpID0ge3skbG9jYXRpb24ucGF0aCgpfX08L3ByZT5cbiAgICAgKiAgICAgICA8cHJlPiRyb3V0ZS5jdXJyZW50LnRlbXBsYXRlVXJsID0ge3skcm91dGUuY3VycmVudC50ZW1wbGF0ZVVybH19PC9wcmU+XG4gICAgICogICAgICAgPHByZT4kcm91dGUuY3VycmVudC5wYXJhbXMgPSB7eyRyb3V0ZS5jdXJyZW50LnBhcmFtc319PC9wcmU+XG4gICAgICogICAgICAgPHByZT4kcm91dGUuY3VycmVudC5zY29wZS5uYW1lID0ge3skcm91dGUuY3VycmVudC5zY29wZS5uYW1lfX08L3ByZT5cbiAgICAgKiAgICAgICA8cHJlPiRyb3V0ZVBhcmFtcyA9IHt7JHJvdXRlUGFyYW1zfX08L3ByZT5cbiAgICAgKiAgICAgPC9kaXY+XG4gICAgICogICA8L2ZpbGU+XG4gICAgICpcbiAgICAgKiAgIDxmaWxlIG5hbWU9XCJib29rLmh0bWxcIj5cbiAgICAgKiAgICAgY29udHJvbGxlcjoge3tuYW1lfX08YnIgLz5cbiAgICAgKiAgICAgQm9vayBJZDoge3twYXJhbXMuYm9va0lkfX08YnIgLz5cbiAgICAgKiAgIDwvZmlsZT5cbiAgICAgKlxuICAgICAqICAgPGZpbGUgbmFtZT1cImNoYXB0ZXIuaHRtbFwiPlxuICAgICAqICAgICBjb250cm9sbGVyOiB7e25hbWV9fTxiciAvPlxuICAgICAqICAgICBCb29rIElkOiB7e3BhcmFtcy5ib29rSWR9fTxiciAvPlxuICAgICAqICAgICBDaGFwdGVyIElkOiB7e3BhcmFtcy5jaGFwdGVySWR9fVxuICAgICAqICAgPC9maWxlPlxuICAgICAqXG4gICAgICogICA8ZmlsZSBuYW1lPVwic2NyaXB0LmpzXCI+XG4gICAgICogICAgIGFuZ3VsYXIubW9kdWxlKCduZ1JvdXRlRXhhbXBsZScsIFsnbmdSb3V0ZSddKVxuICAgICAqXG4gICAgICogICAgICAuY29udHJvbGxlcignTWFpbkNvbnRyb2xsZXInLCBmdW5jdGlvbigkc2NvcGUsICRyb3V0ZSwgJHJvdXRlUGFyYW1zLCAkbG9jYXRpb24pIHtcbiAgICAgKiAgICAgICAgICAkc2NvcGUuJHJvdXRlID0gJHJvdXRlO1xuICAgICAqICAgICAgICAgICRzY29wZS4kbG9jYXRpb24gPSAkbG9jYXRpb247XG4gICAgICogICAgICAgICAgJHNjb3BlLiRyb3V0ZVBhcmFtcyA9ICRyb3V0ZVBhcmFtcztcbiAgICAgKiAgICAgIH0pXG4gICAgICpcbiAgICAgKiAgICAgIC5jb250cm9sbGVyKCdCb29rQ29udHJvbGxlcicsIGZ1bmN0aW9uKCRzY29wZSwgJHJvdXRlUGFyYW1zKSB7XG4gICAgICogICAgICAgICAgJHNjb3BlLm5hbWUgPSBcIkJvb2tDb250cm9sbGVyXCI7XG4gICAgICogICAgICAgICAgJHNjb3BlLnBhcmFtcyA9ICRyb3V0ZVBhcmFtcztcbiAgICAgKiAgICAgIH0pXG4gICAgICpcbiAgICAgKiAgICAgIC5jb250cm9sbGVyKCdDaGFwdGVyQ29udHJvbGxlcicsIGZ1bmN0aW9uKCRzY29wZSwgJHJvdXRlUGFyYW1zKSB7XG4gICAgICogICAgICAgICAgJHNjb3BlLm5hbWUgPSBcIkNoYXB0ZXJDb250cm9sbGVyXCI7XG4gICAgICogICAgICAgICAgJHNjb3BlLnBhcmFtcyA9ICRyb3V0ZVBhcmFtcztcbiAgICAgKiAgICAgIH0pXG4gICAgICpcbiAgICAgKiAgICAgLmNvbmZpZyhmdW5jdGlvbigkcm91dGVQcm92aWRlciwgJGxvY2F0aW9uUHJvdmlkZXIpIHtcbiAgICAgKiAgICAgICAkcm91dGVQcm92aWRlclxuICAgICAqICAgICAgICAud2hlbignL0Jvb2svOmJvb2tJZCcsIHtcbiAgICAgKiAgICAgICAgIHRlbXBsYXRlVXJsOiAnYm9vay5odG1sJyxcbiAgICAgKiAgICAgICAgIGNvbnRyb2xsZXI6ICdCb29rQ29udHJvbGxlcicsXG4gICAgICogICAgICAgICByZXNvbHZlOiB7XG4gICAgICogICAgICAgICAgIC8vIEkgd2lsbCBjYXVzZSBhIDEgc2Vjb25kIGRlbGF5XG4gICAgICogICAgICAgICAgIGRlbGF5OiBmdW5jdGlvbigkcSwgJHRpbWVvdXQpIHtcbiAgICAgKiAgICAgICAgICAgICB2YXIgZGVsYXkgPSAkcS5kZWZlcigpO1xuICAgICAqICAgICAgICAgICAgICR0aW1lb3V0KGRlbGF5LnJlc29sdmUsIDEwMDApO1xuICAgICAqICAgICAgICAgICAgIHJldHVybiBkZWxheS5wcm9taXNlO1xuICAgICAqICAgICAgICAgICB9XG4gICAgICogICAgICAgICB9XG4gICAgICogICAgICAgfSlcbiAgICAgKiAgICAgICAud2hlbignL0Jvb2svOmJvb2tJZC9jaC86Y2hhcHRlcklkJywge1xuICAgICAqICAgICAgICAgdGVtcGxhdGVVcmw6ICdjaGFwdGVyLmh0bWwnLFxuICAgICAqICAgICAgICAgY29udHJvbGxlcjogJ0NoYXB0ZXJDb250cm9sbGVyJ1xuICAgICAqICAgICAgIH0pO1xuICAgICAqXG4gICAgICogICAgICAgLy8gY29uZmlndXJlIGh0bWw1IHRvIGdldCBsaW5rcyB3b3JraW5nIG9uIGpzZmlkZGxlXG4gICAgICogICAgICAgJGxvY2F0aW9uUHJvdmlkZXIuaHRtbDVNb2RlKHRydWUpO1xuICAgICAqICAgICB9KTtcbiAgICAgKlxuICAgICAqICAgPC9maWxlPlxuICAgICAqXG4gICAgICogICA8ZmlsZSBuYW1lPVwicHJvdHJhY3Rvci5qc1wiIHR5cGU9XCJwcm90cmFjdG9yXCI+XG4gICAgICogICAgIGl0KCdzaG91bGQgbG9hZCBhbmQgY29tcGlsZSBjb3JyZWN0IHRlbXBsYXRlJywgZnVuY3Rpb24oKSB7XG4gICAgICogICAgICAgZWxlbWVudChieS5saW5rVGV4dCgnTW9ieTogQ2gxJykpLmNsaWNrKCk7XG4gICAgICogICAgICAgdmFyIGNvbnRlbnQgPSBlbGVtZW50KGJ5LmNzcygnW25nLXZpZXddJykpLmdldFRleHQoKTtcbiAgICAgKiAgICAgICBleHBlY3QoY29udGVudCkudG9NYXRjaCgvY29udHJvbGxlclxcOiBDaGFwdGVyQ29udHJvbGxlci8pO1xuICAgICAqICAgICAgIGV4cGVjdChjb250ZW50KS50b01hdGNoKC9Cb29rIElkXFw6IE1vYnkvKTtcbiAgICAgKiAgICAgICBleHBlY3QoY29udGVudCkudG9NYXRjaCgvQ2hhcHRlciBJZFxcOiAxLyk7XG4gICAgICpcbiAgICAgKiAgICAgICBlbGVtZW50KGJ5LnBhcnRpYWxMaW5rVGV4dCgnU2NhcmxldCcpKS5jbGljaygpO1xuICAgICAqXG4gICAgICogICAgICAgY29udGVudCA9IGVsZW1lbnQoYnkuY3NzKCdbbmctdmlld10nKSkuZ2V0VGV4dCgpO1xuICAgICAqICAgICAgIGV4cGVjdChjb250ZW50KS50b01hdGNoKC9jb250cm9sbGVyXFw6IEJvb2tDb250cm9sbGVyLyk7XG4gICAgICogICAgICAgZXhwZWN0KGNvbnRlbnQpLnRvTWF0Y2goL0Jvb2sgSWRcXDogU2NhcmxldC8pO1xuICAgICAqICAgICB9KTtcbiAgICAgKiAgIDwvZmlsZT5cbiAgICAgKiA8L2V4YW1wbGU+XG4gICAgICovXG5cbiAgICAvKipcbiAgICAgKiBAbmdkb2MgZXZlbnRcbiAgICAgKiBAbmFtZSAkcm91dGUjJHJvdXRlQ2hhbmdlU3RhcnRcbiAgICAgKiBAZXZlbnRUeXBlIGJyb2FkY2FzdCBvbiByb290IHNjb3BlXG4gICAgICogQGRlc2NyaXB0aW9uXG4gICAgICogQnJvYWRjYXN0ZWQgYmVmb3JlIGEgcm91dGUgY2hhbmdlLiBBdCB0aGlzICBwb2ludCB0aGUgcm91dGUgc2VydmljZXMgc3RhcnRzXG4gICAgICogcmVzb2x2aW5nIGFsbCBvZiB0aGUgZGVwZW5kZW5jaWVzIG5lZWRlZCBmb3IgdGhlIHJvdXRlIGNoYW5nZSB0byBvY2N1ci5cbiAgICAgKiBUeXBpY2FsbHkgdGhpcyBpbnZvbHZlcyBmZXRjaGluZyB0aGUgdmlldyB0ZW1wbGF0ZSBhcyB3ZWxsIGFzIGFueSBkZXBlbmRlbmNpZXNcbiAgICAgKiBkZWZpbmVkIGluIGByZXNvbHZlYCByb3V0ZSBwcm9wZXJ0eS4gT25jZSAgYWxsIG9mIHRoZSBkZXBlbmRlbmNpZXMgYXJlIHJlc29sdmVkXG4gICAgICogYCRyb3V0ZUNoYW5nZVN1Y2Nlc3NgIGlzIGZpcmVkLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtPYmplY3R9IGFuZ3VsYXJFdmVudCBTeW50aGV0aWMgZXZlbnQgb2JqZWN0LlxuICAgICAqIEBwYXJhbSB7Um91dGV9IG5leHQgRnV0dXJlIHJvdXRlIGluZm9ybWF0aW9uLlxuICAgICAqIEBwYXJhbSB7Um91dGV9IGN1cnJlbnQgQ3VycmVudCByb3V0ZSBpbmZvcm1hdGlvbi5cbiAgICAgKi9cblxuICAgIC8qKlxuICAgICAqIEBuZ2RvYyBldmVudFxuICAgICAqIEBuYW1lICRyb3V0ZSMkcm91dGVDaGFuZ2VTdWNjZXNzXG4gICAgICogQGV2ZW50VHlwZSBicm9hZGNhc3Qgb24gcm9vdCBzY29wZVxuICAgICAqIEBkZXNjcmlwdGlvblxuICAgICAqIEJyb2FkY2FzdGVkIGFmdGVyIGEgcm91dGUgZGVwZW5kZW5jaWVzIGFyZSByZXNvbHZlZC5cbiAgICAgKiB7QGxpbmsgbmdSb3V0ZS5kaXJlY3RpdmU6bmdWaWV3IG5nVmlld30gbGlzdGVucyBmb3IgdGhlIGRpcmVjdGl2ZVxuICAgICAqIHRvIGluc3RhbnRpYXRlIHRoZSBjb250cm9sbGVyIGFuZCByZW5kZXIgdGhlIHZpZXcuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gYW5ndWxhckV2ZW50IFN5bnRoZXRpYyBldmVudCBvYmplY3QuXG4gICAgICogQHBhcmFtIHtSb3V0ZX0gY3VycmVudCBDdXJyZW50IHJvdXRlIGluZm9ybWF0aW9uLlxuICAgICAqIEBwYXJhbSB7Um91dGV8VW5kZWZpbmVkfSBwcmV2aW91cyBQcmV2aW91cyByb3V0ZSBpbmZvcm1hdGlvbiwgb3IgdW5kZWZpbmVkIGlmIGN1cnJlbnQgaXNcbiAgICAgKiBmaXJzdCByb3V0ZSBlbnRlcmVkLlxuICAgICAqL1xuXG4gICAgLyoqXG4gICAgICogQG5nZG9jIGV2ZW50XG4gICAgICogQG5hbWUgJHJvdXRlIyRyb3V0ZUNoYW5nZUVycm9yXG4gICAgICogQGV2ZW50VHlwZSBicm9hZGNhc3Qgb24gcm9vdCBzY29wZVxuICAgICAqIEBkZXNjcmlwdGlvblxuICAgICAqIEJyb2FkY2FzdGVkIGlmIGFueSBvZiB0aGUgcmVzb2x2ZSBwcm9taXNlcyBhcmUgcmVqZWN0ZWQuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gYW5ndWxhckV2ZW50IFN5bnRoZXRpYyBldmVudCBvYmplY3RcbiAgICAgKiBAcGFyYW0ge1JvdXRlfSBjdXJyZW50IEN1cnJlbnQgcm91dGUgaW5mb3JtYXRpb24uXG4gICAgICogQHBhcmFtIHtSb3V0ZX0gcHJldmlvdXMgUHJldmlvdXMgcm91dGUgaW5mb3JtYXRpb24uXG4gICAgICogQHBhcmFtIHtSb3V0ZX0gcmVqZWN0aW9uIFJlamVjdGlvbiBvZiB0aGUgcHJvbWlzZS4gVXN1YWxseSB0aGUgZXJyb3Igb2YgdGhlIGZhaWxlZCBwcm9taXNlLlxuICAgICAqL1xuXG4gICAgLyoqXG4gICAgICogQG5nZG9jIGV2ZW50XG4gICAgICogQG5hbWUgJHJvdXRlIyRyb3V0ZVVwZGF0ZVxuICAgICAqIEBldmVudFR5cGUgYnJvYWRjYXN0IG9uIHJvb3Qgc2NvcGVcbiAgICAgKiBAZGVzY3JpcHRpb25cbiAgICAgKlxuICAgICAqIFRoZSBgcmVsb2FkT25TZWFyY2hgIHByb3BlcnR5IGhhcyBiZWVuIHNldCB0byBmYWxzZSwgYW5kIHdlIGFyZSByZXVzaW5nIHRoZSBzYW1lXG4gICAgICogaW5zdGFuY2Ugb2YgdGhlIENvbnRyb2xsZXIuXG4gICAgICovXG5cbiAgICB2YXIgZm9yY2VSZWxvYWQgPSBmYWxzZSxcbiAgICAgICAgJHJvdXRlID0ge1xuICAgICAgICAgIHJvdXRlczogcm91dGVzLFxuXG4gICAgICAgICAgLyoqXG4gICAgICAgICAgICogQG5nZG9jIG1ldGhvZFxuICAgICAgICAgICAqIEBuYW1lICRyb3V0ZSNyZWxvYWRcbiAgICAgICAgICAgKlxuICAgICAgICAgICAqIEBkZXNjcmlwdGlvblxuICAgICAgICAgICAqIENhdXNlcyBgJHJvdXRlYCBzZXJ2aWNlIHRvIHJlbG9hZCB0aGUgY3VycmVudCByb3V0ZSBldmVuIGlmXG4gICAgICAgICAgICoge0BsaW5rIG5nLiRsb2NhdGlvbiAkbG9jYXRpb259IGhhc24ndCBjaGFuZ2VkLlxuICAgICAgICAgICAqXG4gICAgICAgICAgICogQXMgYSByZXN1bHQgb2YgdGhhdCwge0BsaW5rIG5nUm91dGUuZGlyZWN0aXZlOm5nVmlldyBuZ1ZpZXd9XG4gICAgICAgICAgICogY3JlYXRlcyBuZXcgc2NvcGUsIHJlaW5zdGFudGlhdGVzIHRoZSBjb250cm9sbGVyLlxuICAgICAgICAgICAqL1xuICAgICAgICAgIHJlbG9hZDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBmb3JjZVJlbG9hZCA9IHRydWU7XG4gICAgICAgICAgICAkcm9vdFNjb3BlLiRldmFsQXN5bmModXBkYXRlUm91dGUpO1xuICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICRyb290U2NvcGUuJG9uKCckbG9jYXRpb25DaGFuZ2VTdWNjZXNzJywgdXBkYXRlUm91dGUpO1xuXG4gICAgcmV0dXJuICRyb3V0ZTtcblxuICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5cbiAgICAvKipcbiAgICAgKiBAcGFyYW0gb24ge3N0cmluZ30gY3VycmVudCB1cmxcbiAgICAgKiBAcGFyYW0gcm91dGUge09iamVjdH0gcm91dGUgcmVnZXhwIHRvIG1hdGNoIHRoZSB1cmwgYWdhaW5zdFxuICAgICAqIEByZXR1cm4gez9PYmplY3R9XG4gICAgICpcbiAgICAgKiBAZGVzY3JpcHRpb25cbiAgICAgKiBDaGVjayBpZiB0aGUgcm91dGUgbWF0Y2hlcyB0aGUgY3VycmVudCB1cmwuXG4gICAgICpcbiAgICAgKiBJbnNwaXJlZCBieSBtYXRjaCBpblxuICAgICAqIHZpc2lvbm1lZGlhL2V4cHJlc3MvbGliL3JvdXRlci9yb3V0ZXIuanMuXG4gICAgICovXG4gICAgZnVuY3Rpb24gc3dpdGNoUm91dGVNYXRjaGVyKG9uLCByb3V0ZSkge1xuICAgICAgdmFyIGtleXMgPSByb3V0ZS5rZXlzLFxuICAgICAgICAgIHBhcmFtcyA9IHt9O1xuXG4gICAgICBpZiAoIXJvdXRlLnJlZ2V4cCkgcmV0dXJuIG51bGw7XG5cbiAgICAgIHZhciBtID0gcm91dGUucmVnZXhwLmV4ZWMob24pO1xuICAgICAgaWYgKCFtKSByZXR1cm4gbnVsbDtcblxuICAgICAgZm9yICh2YXIgaSA9IDEsIGxlbiA9IG0ubGVuZ3RoOyBpIDwgbGVuOyArK2kpIHtcbiAgICAgICAgdmFyIGtleSA9IGtleXNbaSAtIDFdO1xuXG4gICAgICAgIHZhciB2YWwgPSBtW2ldO1xuXG4gICAgICAgIGlmIChrZXkgJiYgdmFsKSB7XG4gICAgICAgICAgcGFyYW1zW2tleS5uYW1lXSA9IHZhbDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIHBhcmFtcztcbiAgICB9XG5cbiAgICBmdW5jdGlvbiB1cGRhdGVSb3V0ZSgpIHtcbiAgICAgIHZhciBuZXh0ID0gcGFyc2VSb3V0ZSgpLFxuICAgICAgICAgIGxhc3QgPSAkcm91dGUuY3VycmVudDtcblxuICAgICAgaWYgKG5leHQgJiYgbGFzdCAmJiBuZXh0LiQkcm91dGUgPT09IGxhc3QuJCRyb3V0ZVxuICAgICAgICAgICYmIGFuZ3VsYXIuZXF1YWxzKG5leHQucGF0aFBhcmFtcywgbGFzdC5wYXRoUGFyYW1zKVxuICAgICAgICAgICYmICFuZXh0LnJlbG9hZE9uU2VhcmNoICYmICFmb3JjZVJlbG9hZCkge1xuICAgICAgICBsYXN0LnBhcmFtcyA9IG5leHQucGFyYW1zO1xuICAgICAgICBhbmd1bGFyLmNvcHkobGFzdC5wYXJhbXMsICRyb3V0ZVBhcmFtcyk7XG4gICAgICAgICRyb290U2NvcGUuJGJyb2FkY2FzdCgnJHJvdXRlVXBkYXRlJywgbGFzdCk7XG4gICAgICB9IGVsc2UgaWYgKG5leHQgfHwgbGFzdCkge1xuICAgICAgICBmb3JjZVJlbG9hZCA9IGZhbHNlO1xuICAgICAgICAkcm9vdFNjb3BlLiRicm9hZGNhc3QoJyRyb3V0ZUNoYW5nZVN0YXJ0JywgbmV4dCwgbGFzdCk7XG4gICAgICAgICRyb3V0ZS5jdXJyZW50ID0gbmV4dDtcbiAgICAgICAgaWYgKG5leHQpIHtcbiAgICAgICAgICBpZiAobmV4dC5yZWRpcmVjdFRvKSB7XG4gICAgICAgICAgICBpZiAoYW5ndWxhci5pc1N0cmluZyhuZXh0LnJlZGlyZWN0VG8pKSB7XG4gICAgICAgICAgICAgICRsb2NhdGlvbi5wYXRoKGludGVycG9sYXRlKG5leHQucmVkaXJlY3RUbywgbmV4dC5wYXJhbXMpKS5zZWFyY2gobmV4dC5wYXJhbXMpXG4gICAgICAgICAgICAgICAgICAgICAgIC5yZXBsYWNlKCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAkbG9jYXRpb24udXJsKG5leHQucmVkaXJlY3RUbyhuZXh0LnBhdGhQYXJhbXMsICRsb2NhdGlvbi5wYXRoKCksICRsb2NhdGlvbi5zZWFyY2goKSkpXG4gICAgICAgICAgICAgICAgICAgICAgIC5yZXBsYWNlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgJHEud2hlbihuZXh0KS5cbiAgICAgICAgICB0aGVuKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgaWYgKG5leHQpIHtcbiAgICAgICAgICAgICAgdmFyIGxvY2FscyA9IGFuZ3VsYXIuZXh0ZW5kKHt9LCBuZXh0LnJlc29sdmUpLFxuICAgICAgICAgICAgICAgICAgdGVtcGxhdGUsIHRlbXBsYXRlVXJsO1xuXG4gICAgICAgICAgICAgIGFuZ3VsYXIuZm9yRWFjaChsb2NhbHMsIGZ1bmN0aW9uKHZhbHVlLCBrZXkpIHtcbiAgICAgICAgICAgICAgICBsb2NhbHNba2V5XSA9IGFuZ3VsYXIuaXNTdHJpbmcodmFsdWUpID9cbiAgICAgICAgICAgICAgICAgICAgJGluamVjdG9yLmdldCh2YWx1ZSkgOiAkaW5qZWN0b3IuaW52b2tlKHZhbHVlKTtcbiAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgaWYgKGFuZ3VsYXIuaXNEZWZpbmVkKHRlbXBsYXRlID0gbmV4dC50ZW1wbGF0ZSkpIHtcbiAgICAgICAgICAgICAgICBpZiAoYW5ndWxhci5pc0Z1bmN0aW9uKHRlbXBsYXRlKSkge1xuICAgICAgICAgICAgICAgICAgdGVtcGxhdGUgPSB0ZW1wbGF0ZShuZXh0LnBhcmFtcyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9IGVsc2UgaWYgKGFuZ3VsYXIuaXNEZWZpbmVkKHRlbXBsYXRlVXJsID0gbmV4dC50ZW1wbGF0ZVVybCkpIHtcbiAgICAgICAgICAgICAgICBpZiAoYW5ndWxhci5pc0Z1bmN0aW9uKHRlbXBsYXRlVXJsKSkge1xuICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmwgPSB0ZW1wbGF0ZVVybChuZXh0LnBhcmFtcyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsID0gJHNjZS5nZXRUcnVzdGVkUmVzb3VyY2VVcmwodGVtcGxhdGVVcmwpO1xuICAgICAgICAgICAgICAgIGlmIChhbmd1bGFyLmlzRGVmaW5lZCh0ZW1wbGF0ZVVybCkpIHtcbiAgICAgICAgICAgICAgICAgIG5leHQubG9hZGVkVGVtcGxhdGVVcmwgPSB0ZW1wbGF0ZVVybDtcbiAgICAgICAgICAgICAgICAgIHRlbXBsYXRlID0gJGh0dHAuZ2V0KHRlbXBsYXRlVXJsLCB7Y2FjaGU6ICR0ZW1wbGF0ZUNhY2hlfSkuXG4gICAgICAgICAgICAgICAgICAgICAgdGhlbihmdW5jdGlvbihyZXNwb25zZSkgeyByZXR1cm4gcmVzcG9uc2UuZGF0YTsgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIGlmIChhbmd1bGFyLmlzRGVmaW5lZCh0ZW1wbGF0ZSkpIHtcbiAgICAgICAgICAgICAgICBsb2NhbHNbJyR0ZW1wbGF0ZSddID0gdGVtcGxhdGU7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgcmV0dXJuICRxLmFsbChsb2NhbHMpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pLlxuICAgICAgICAgIC8vIGFmdGVyIHJvdXRlIGNoYW5nZVxuICAgICAgICAgIHRoZW4oZnVuY3Rpb24obG9jYWxzKSB7XG4gICAgICAgICAgICBpZiAobmV4dCA9PSAkcm91dGUuY3VycmVudCkge1xuICAgICAgICAgICAgICBpZiAobmV4dCkge1xuICAgICAgICAgICAgICAgIG5leHQubG9jYWxzID0gbG9jYWxzO1xuICAgICAgICAgICAgICAgIGFuZ3VsYXIuY29weShuZXh0LnBhcmFtcywgJHJvdXRlUGFyYW1zKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAkcm9vdFNjb3BlLiRicm9hZGNhc3QoJyRyb3V0ZUNoYW5nZVN1Y2Nlc3MnLCBuZXh0LCBsYXN0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LCBmdW5jdGlvbihlcnJvcikge1xuICAgICAgICAgICAgaWYgKG5leHQgPT0gJHJvdXRlLmN1cnJlbnQpIHtcbiAgICAgICAgICAgICAgJHJvb3RTY29wZS4kYnJvYWRjYXN0KCckcm91dGVDaGFuZ2VFcnJvcicsIG5leHQsIGxhc3QsIGVycm9yKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG5cblxuICAgIC8qKlxuICAgICAqIEByZXR1cm5zIHtPYmplY3R9IHRoZSBjdXJyZW50IGFjdGl2ZSByb3V0ZSwgYnkgbWF0Y2hpbmcgaXQgYWdhaW5zdCB0aGUgVVJMXG4gICAgICovXG4gICAgZnVuY3Rpb24gcGFyc2VSb3V0ZSgpIHtcbiAgICAgIC8vIE1hdGNoIGEgcm91dGVcbiAgICAgIHZhciBwYXJhbXMsIG1hdGNoO1xuICAgICAgYW5ndWxhci5mb3JFYWNoKHJvdXRlcywgZnVuY3Rpb24ocm91dGUsIHBhdGgpIHtcbiAgICAgICAgaWYgKCFtYXRjaCAmJiAocGFyYW1zID0gc3dpdGNoUm91dGVNYXRjaGVyKCRsb2NhdGlvbi5wYXRoKCksIHJvdXRlKSkpIHtcbiAgICAgICAgICBtYXRjaCA9IGluaGVyaXQocm91dGUsIHtcbiAgICAgICAgICAgIHBhcmFtczogYW5ndWxhci5leHRlbmQoe30sICRsb2NhdGlvbi5zZWFyY2goKSwgcGFyYW1zKSxcbiAgICAgICAgICAgIHBhdGhQYXJhbXM6IHBhcmFtc30pO1xuICAgICAgICAgIG1hdGNoLiQkcm91dGUgPSByb3V0ZTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICAvLyBObyByb3V0ZSBtYXRjaGVkOyBmYWxsYmFjayB0byBcIm90aGVyd2lzZVwiIHJvdXRlXG4gICAgICByZXR1cm4gbWF0Y2ggfHwgcm91dGVzW251bGxdICYmIGluaGVyaXQocm91dGVzW251bGxdLCB7cGFyYW1zOiB7fSwgcGF0aFBhcmFtczp7fX0pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEByZXR1cm5zIHtzdHJpbmd9IGludGVycG9sYXRpb24gb2YgdGhlIHJlZGlyZWN0IHBhdGggd2l0aCB0aGUgcGFyYW1ldGVyc1xuICAgICAqL1xuICAgIGZ1bmN0aW9uIGludGVycG9sYXRlKHN0cmluZywgcGFyYW1zKSB7XG4gICAgICB2YXIgcmVzdWx0ID0gW107XG4gICAgICBhbmd1bGFyLmZvckVhY2goKHN0cmluZ3x8JycpLnNwbGl0KCc6JyksIGZ1bmN0aW9uKHNlZ21lbnQsIGkpIHtcbiAgICAgICAgaWYgKGkgPT09IDApIHtcbiAgICAgICAgICByZXN1bHQucHVzaChzZWdtZW50KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB2YXIgc2VnbWVudE1hdGNoID0gc2VnbWVudC5tYXRjaCgvKFxcdyspKC4qKS8pO1xuICAgICAgICAgIHZhciBrZXkgPSBzZWdtZW50TWF0Y2hbMV07XG4gICAgICAgICAgcmVzdWx0LnB1c2gocGFyYW1zW2tleV0pO1xuICAgICAgICAgIHJlc3VsdC5wdXNoKHNlZ21lbnRNYXRjaFsyXSB8fCAnJyk7XG4gICAgICAgICAgZGVsZXRlIHBhcmFtc1trZXldO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIHJldHVybiByZXN1bHQuam9pbignJyk7XG4gICAgfVxuICB9XTtcbn1cblxubmdSb3V0ZU1vZHVsZS5wcm92aWRlcignJHJvdXRlUGFyYW1zJywgJFJvdXRlUGFyYW1zUHJvdmlkZXIpO1xuXG5cbi8qKlxuICogQG5nZG9jIHNlcnZpY2VcbiAqIEBuYW1lICRyb3V0ZVBhcmFtc1xuICogQHJlcXVpcmVzICRyb3V0ZVxuICpcbiAqIEBkZXNjcmlwdGlvblxuICogVGhlIGAkcm91dGVQYXJhbXNgIHNlcnZpY2UgYWxsb3dzIHlvdSB0byByZXRyaWV2ZSB0aGUgY3VycmVudCBzZXQgb2Ygcm91dGUgcGFyYW1ldGVycy5cbiAqXG4gKiBSZXF1aXJlcyB0aGUge0BsaW5rIG5nUm91dGUgYG5nUm91dGVgfSBtb2R1bGUgdG8gYmUgaW5zdGFsbGVkLlxuICpcbiAqIFRoZSByb3V0ZSBwYXJhbWV0ZXJzIGFyZSBhIGNvbWJpbmF0aW9uIG9mIHtAbGluayBuZy4kbG9jYXRpb24gYCRsb2NhdGlvbmB9J3NcbiAqIHtAbGluayBuZy4kbG9jYXRpb24jc2VhcmNoIGBzZWFyY2goKWB9IGFuZCB7QGxpbmsgbmcuJGxvY2F0aW9uI3BhdGggYHBhdGgoKWB9LlxuICogVGhlIGBwYXRoYCBwYXJhbWV0ZXJzIGFyZSBleHRyYWN0ZWQgd2hlbiB0aGUge0BsaW5rIG5nUm91dGUuJHJvdXRlIGAkcm91dGVgfSBwYXRoIGlzIG1hdGNoZWQuXG4gKlxuICogSW4gY2FzZSBvZiBwYXJhbWV0ZXIgbmFtZSBjb2xsaXNpb24sIGBwYXRoYCBwYXJhbXMgdGFrZSBwcmVjZWRlbmNlIG92ZXIgYHNlYXJjaGAgcGFyYW1zLlxuICpcbiAqIFRoZSBzZXJ2aWNlIGd1YXJhbnRlZXMgdGhhdCB0aGUgaWRlbnRpdHkgb2YgdGhlIGAkcm91dGVQYXJhbXNgIG9iamVjdCB3aWxsIHJlbWFpbiB1bmNoYW5nZWRcbiAqIChidXQgaXRzIHByb3BlcnRpZXMgd2lsbCBsaWtlbHkgY2hhbmdlKSBldmVuIHdoZW4gYSByb3V0ZSBjaGFuZ2Ugb2NjdXJzLlxuICpcbiAqIE5vdGUgdGhhdCB0aGUgYCRyb3V0ZVBhcmFtc2AgYXJlIG9ubHkgdXBkYXRlZCAqYWZ0ZXIqIGEgcm91dGUgY2hhbmdlIGNvbXBsZXRlcyBzdWNjZXNzZnVsbHkuXG4gKiBUaGlzIG1lYW5zIHRoYXQgeW91IGNhbm5vdCByZWx5IG9uIGAkcm91dGVQYXJhbXNgIGJlaW5nIGNvcnJlY3QgaW4gcm91dGUgcmVzb2x2ZSBmdW5jdGlvbnMuXG4gKiBJbnN0ZWFkIHlvdSBjYW4gdXNlIGAkcm91dGUuY3VycmVudC5wYXJhbXNgIHRvIGFjY2VzcyB0aGUgbmV3IHJvdXRlJ3MgcGFyYW1ldGVycy5cbiAqXG4gKiBAZXhhbXBsZVxuICogYGBganNcbiAqICAvLyBHaXZlbjpcbiAqICAvLyBVUkw6IGh0dHA6Ly9zZXJ2ZXIuY29tL2luZGV4Lmh0bWwjL0NoYXB0ZXIvMS9TZWN0aW9uLzI/c2VhcmNoPW1vYnlcbiAqICAvLyBSb3V0ZTogL0NoYXB0ZXIvOmNoYXB0ZXJJZC9TZWN0aW9uLzpzZWN0aW9uSWRcbiAqICAvL1xuICogIC8vIFRoZW5cbiAqICAkcm91dGVQYXJhbXMgPT0+IHtjaGFwdGVySWQ6JzEnLCBzZWN0aW9uSWQ6JzInLCBzZWFyY2g6J21vYnknfVxuICogYGBgXG4gKi9cbmZ1bmN0aW9uICRSb3V0ZVBhcmFtc1Byb3ZpZGVyKCkge1xuICB0aGlzLiRnZXQgPSBmdW5jdGlvbigpIHsgcmV0dXJuIHt9OyB9O1xufVxuXG5uZ1JvdXRlTW9kdWxlLmRpcmVjdGl2ZSgnbmdWaWV3JywgbmdWaWV3RmFjdG9yeSk7XG5uZ1JvdXRlTW9kdWxlLmRpcmVjdGl2ZSgnbmdWaWV3JywgbmdWaWV3RmlsbENvbnRlbnRGYWN0b3J5KTtcblxuXG4vKipcbiAqIEBuZ2RvYyBkaXJlY3RpdmVcbiAqIEBuYW1lIG5nVmlld1xuICogQHJlc3RyaWN0IEVDQVxuICpcbiAqIEBkZXNjcmlwdGlvblxuICogIyBPdmVydmlld1xuICogYG5nVmlld2AgaXMgYSBkaXJlY3RpdmUgdGhhdCBjb21wbGVtZW50cyB0aGUge0BsaW5rIG5nUm91dGUuJHJvdXRlICRyb3V0ZX0gc2VydmljZSBieVxuICogaW5jbHVkaW5nIHRoZSByZW5kZXJlZCB0ZW1wbGF0ZSBvZiB0aGUgY3VycmVudCByb3V0ZSBpbnRvIHRoZSBtYWluIGxheW91dCAoYGluZGV4Lmh0bWxgKSBmaWxlLlxuICogRXZlcnkgdGltZSB0aGUgY3VycmVudCByb3V0ZSBjaGFuZ2VzLCB0aGUgaW5jbHVkZWQgdmlldyBjaGFuZ2VzIHdpdGggaXQgYWNjb3JkaW5nIHRvIHRoZVxuICogY29uZmlndXJhdGlvbiBvZiB0aGUgYCRyb3V0ZWAgc2VydmljZS5cbiAqXG4gKiBSZXF1aXJlcyB0aGUge0BsaW5rIG5nUm91dGUgYG5nUm91dGVgfSBtb2R1bGUgdG8gYmUgaW5zdGFsbGVkLlxuICpcbiAqIEBhbmltYXRpb25zXG4gKiBlbnRlciAtIGFuaW1hdGlvbiBpcyB1c2VkIHRvIGJyaW5nIG5ldyBjb250ZW50IGludG8gdGhlIGJyb3dzZXIuXG4gKiBsZWF2ZSAtIGFuaW1hdGlvbiBpcyB1c2VkIHRvIGFuaW1hdGUgZXhpc3RpbmcgY29udGVudCBhd2F5LlxuICpcbiAqIFRoZSBlbnRlciBhbmQgbGVhdmUgYW5pbWF0aW9uIG9jY3VyIGNvbmN1cnJlbnRseS5cbiAqXG4gKiBAc2NvcGVcbiAqIEBwcmlvcml0eSA0MDBcbiAqIEBwYXJhbSB7c3RyaW5nPX0gb25sb2FkIEV4cHJlc3Npb24gdG8gZXZhbHVhdGUgd2hlbmV2ZXIgdGhlIHZpZXcgdXBkYXRlcy5cbiAqXG4gKiBAcGFyYW0ge3N0cmluZz19IGF1dG9zY3JvbGwgV2hldGhlciBgbmdWaWV3YCBzaG91bGQgY2FsbCB7QGxpbmsgbmcuJGFuY2hvclNjcm9sbFxuICogICAgICAgICAgICAgICAgICAkYW5jaG9yU2Nyb2xsfSB0byBzY3JvbGwgdGhlIHZpZXdwb3J0IGFmdGVyIHRoZSB2aWV3IGlzIHVwZGF0ZWQuXG4gKlxuICogICAgICAgICAgICAgICAgICAtIElmIHRoZSBhdHRyaWJ1dGUgaXMgbm90IHNldCwgZGlzYWJsZSBzY3JvbGxpbmcuXG4gKiAgICAgICAgICAgICAgICAgIC0gSWYgdGhlIGF0dHJpYnV0ZSBpcyBzZXQgd2l0aG91dCB2YWx1ZSwgZW5hYmxlIHNjcm9sbGluZy5cbiAqICAgICAgICAgICAgICAgICAgLSBPdGhlcndpc2UgZW5hYmxlIHNjcm9sbGluZyBvbmx5IGlmIHRoZSBgYXV0b3Njcm9sbGAgYXR0cmlidXRlIHZhbHVlIGV2YWx1YXRlZFxuICogICAgICAgICAgICAgICAgICAgIGFzIGFuIGV4cHJlc3Npb24geWllbGRzIGEgdHJ1dGh5IHZhbHVlLlxuICogQGV4YW1wbGVcbiAgICA8ZXhhbXBsZSBuYW1lPVwibmdWaWV3LWRpcmVjdGl2ZVwiIG1vZHVsZT1cIm5nVmlld0V4YW1wbGVcIlxuICAgICAgICAgICAgIGRlcHM9XCJhbmd1bGFyLXJvdXRlLmpzO2FuZ3VsYXItYW5pbWF0ZS5qc1wiXG4gICAgICAgICAgICAgYW5pbWF0aW9ucz1cInRydWVcIiBmaXhCYXNlPVwidHJ1ZVwiPlxuICAgICAgPGZpbGUgbmFtZT1cImluZGV4Lmh0bWxcIj5cbiAgICAgICAgPGRpdiBuZy1jb250cm9sbGVyPVwiTWFpbkN0cmwgYXMgbWFpblwiPlxuICAgICAgICAgIENob29zZTpcbiAgICAgICAgICA8YSBocmVmPVwiQm9vay9Nb2J5XCI+TW9ieTwvYT4gfFxuICAgICAgICAgIDxhIGhyZWY9XCJCb29rL01vYnkvY2gvMVwiPk1vYnk6IENoMTwvYT4gfFxuICAgICAgICAgIDxhIGhyZWY9XCJCb29rL0dhdHNieVwiPkdhdHNieTwvYT4gfFxuICAgICAgICAgIDxhIGhyZWY9XCJCb29rL0dhdHNieS9jaC80P2tleT12YWx1ZVwiPkdhdHNieTogQ2g0PC9hPiB8XG4gICAgICAgICAgPGEgaHJlZj1cIkJvb2svU2NhcmxldFwiPlNjYXJsZXQgTGV0dGVyPC9hPjxici8+XG5cbiAgICAgICAgICA8ZGl2IGNsYXNzPVwidmlldy1hbmltYXRlLWNvbnRhaW5lclwiPlxuICAgICAgICAgICAgPGRpdiBuZy12aWV3IGNsYXNzPVwidmlldy1hbmltYXRlXCI+PC9kaXY+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPGhyIC8+XG5cbiAgICAgICAgICA8cHJlPiRsb2NhdGlvbi5wYXRoKCkgPSB7e21haW4uJGxvY2F0aW9uLnBhdGgoKX19PC9wcmU+XG4gICAgICAgICAgPHByZT4kcm91dGUuY3VycmVudC50ZW1wbGF0ZVVybCA9IHt7bWFpbi4kcm91dGUuY3VycmVudC50ZW1wbGF0ZVVybH19PC9wcmU+XG4gICAgICAgICAgPHByZT4kcm91dGUuY3VycmVudC5wYXJhbXMgPSB7e21haW4uJHJvdXRlLmN1cnJlbnQucGFyYW1zfX08L3ByZT5cbiAgICAgICAgICA8cHJlPiRyb3V0ZS5jdXJyZW50LnNjb3BlLm5hbWUgPSB7e21haW4uJHJvdXRlLmN1cnJlbnQuc2NvcGUubmFtZX19PC9wcmU+XG4gICAgICAgICAgPHByZT4kcm91dGVQYXJhbXMgPSB7e21haW4uJHJvdXRlUGFyYW1zfX08L3ByZT5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2ZpbGU+XG5cbiAgICAgIDxmaWxlIG5hbWU9XCJib29rLmh0bWxcIj5cbiAgICAgICAgPGRpdj5cbiAgICAgICAgICBjb250cm9sbGVyOiB7e2Jvb2submFtZX19PGJyIC8+XG4gICAgICAgICAgQm9vayBJZDoge3tib29rLnBhcmFtcy5ib29rSWR9fTxiciAvPlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZmlsZT5cblxuICAgICAgPGZpbGUgbmFtZT1cImNoYXB0ZXIuaHRtbFwiPlxuICAgICAgICA8ZGl2PlxuICAgICAgICAgIGNvbnRyb2xsZXI6IHt7Y2hhcHRlci5uYW1lfX08YnIgLz5cbiAgICAgICAgICBCb29rIElkOiB7e2NoYXB0ZXIucGFyYW1zLmJvb2tJZH19PGJyIC8+XG4gICAgICAgICAgQ2hhcHRlciBJZDoge3tjaGFwdGVyLnBhcmFtcy5jaGFwdGVySWR9fVxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZmlsZT5cblxuICAgICAgPGZpbGUgbmFtZT1cImFuaW1hdGlvbnMuY3NzXCI+XG4gICAgICAgIC52aWV3LWFuaW1hdGUtY29udGFpbmVyIHtcbiAgICAgICAgICBwb3NpdGlvbjpyZWxhdGl2ZTtcbiAgICAgICAgICBoZWlnaHQ6MTAwcHghaW1wb3J0YW50O1xuICAgICAgICAgIHBvc2l0aW9uOnJlbGF0aXZlO1xuICAgICAgICAgIGJhY2tncm91bmQ6d2hpdGU7XG4gICAgICAgICAgYm9yZGVyOjFweCBzb2xpZCBibGFjaztcbiAgICAgICAgICBoZWlnaHQ6NDBweDtcbiAgICAgICAgICBvdmVyZmxvdzpoaWRkZW47XG4gICAgICAgIH1cblxuICAgICAgICAudmlldy1hbmltYXRlIHtcbiAgICAgICAgICBwYWRkaW5nOjEwcHg7XG4gICAgICAgIH1cblxuICAgICAgICAudmlldy1hbmltYXRlLm5nLWVudGVyLCAudmlldy1hbmltYXRlLm5nLWxlYXZlIHtcbiAgICAgICAgICAtd2Via2l0LXRyYW5zaXRpb246YWxsIGN1YmljLWJlemllcigwLjI1MCwgMC40NjAsIDAuNDUwLCAwLjk0MCkgMS41cztcbiAgICAgICAgICB0cmFuc2l0aW9uOmFsbCBjdWJpYy1iZXppZXIoMC4yNTAsIDAuNDYwLCAwLjQ1MCwgMC45NDApIDEuNXM7XG5cbiAgICAgICAgICBkaXNwbGF5OmJsb2NrO1xuICAgICAgICAgIHdpZHRoOjEwMCU7XG4gICAgICAgICAgYm9yZGVyLWxlZnQ6MXB4IHNvbGlkIGJsYWNrO1xuXG4gICAgICAgICAgcG9zaXRpb246YWJzb2x1dGU7XG4gICAgICAgICAgdG9wOjA7XG4gICAgICAgICAgbGVmdDowO1xuICAgICAgICAgIHJpZ2h0OjA7XG4gICAgICAgICAgYm90dG9tOjA7XG4gICAgICAgICAgcGFkZGluZzoxMHB4O1xuICAgICAgICB9XG5cbiAgICAgICAgLnZpZXctYW5pbWF0ZS5uZy1lbnRlciB7XG4gICAgICAgICAgbGVmdDoxMDAlO1xuICAgICAgICB9XG4gICAgICAgIC52aWV3LWFuaW1hdGUubmctZW50ZXIubmctZW50ZXItYWN0aXZlIHtcbiAgICAgICAgICBsZWZ0OjA7XG4gICAgICAgIH1cbiAgICAgICAgLnZpZXctYW5pbWF0ZS5uZy1sZWF2ZS5uZy1sZWF2ZS1hY3RpdmUge1xuICAgICAgICAgIGxlZnQ6LTEwMCU7XG4gICAgICAgIH1cbiAgICAgIDwvZmlsZT5cblxuICAgICAgPGZpbGUgbmFtZT1cInNjcmlwdC5qc1wiPlxuICAgICAgICBhbmd1bGFyLm1vZHVsZSgnbmdWaWV3RXhhbXBsZScsIFsnbmdSb3V0ZScsICduZ0FuaW1hdGUnXSlcbiAgICAgICAgICAuY29uZmlnKFsnJHJvdXRlUHJvdmlkZXInLCAnJGxvY2F0aW9uUHJvdmlkZXInLFxuICAgICAgICAgICAgZnVuY3Rpb24oJHJvdXRlUHJvdmlkZXIsICRsb2NhdGlvblByb3ZpZGVyKSB7XG4gICAgICAgICAgICAgICRyb3V0ZVByb3ZpZGVyXG4gICAgICAgICAgICAgICAgLndoZW4oJy9Cb29rLzpib29rSWQnLCB7XG4gICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ2Jvb2suaHRtbCcsXG4gICAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnQm9va0N0cmwnLFxuICAgICAgICAgICAgICAgICAgY29udHJvbGxlckFzOiAnYm9vaydcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC53aGVuKCcvQm9vay86Ym9va0lkL2NoLzpjaGFwdGVySWQnLCB7XG4gICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ2NoYXB0ZXIuaHRtbCcsXG4gICAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnQ2hhcHRlckN0cmwnLFxuICAgICAgICAgICAgICAgICAgY29udHJvbGxlckFzOiAnY2hhcHRlcidcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAvLyBjb25maWd1cmUgaHRtbDUgdG8gZ2V0IGxpbmtzIHdvcmtpbmcgb24ganNmaWRkbGVcbiAgICAgICAgICAgICAgJGxvY2F0aW9uUHJvdmlkZXIuaHRtbDVNb2RlKHRydWUpO1xuICAgICAgICAgIH1dKVxuICAgICAgICAgIC5jb250cm9sbGVyKCdNYWluQ3RybCcsIFsnJHJvdXRlJywgJyRyb3V0ZVBhcmFtcycsICckbG9jYXRpb24nLFxuICAgICAgICAgICAgZnVuY3Rpb24oJHJvdXRlLCAkcm91dGVQYXJhbXMsICRsb2NhdGlvbikge1xuICAgICAgICAgICAgICB0aGlzLiRyb3V0ZSA9ICRyb3V0ZTtcbiAgICAgICAgICAgICAgdGhpcy4kbG9jYXRpb24gPSAkbG9jYXRpb247XG4gICAgICAgICAgICAgIHRoaXMuJHJvdXRlUGFyYW1zID0gJHJvdXRlUGFyYW1zO1xuICAgICAgICAgIH1dKVxuICAgICAgICAgIC5jb250cm9sbGVyKCdCb29rQ3RybCcsIFsnJHJvdXRlUGFyYW1zJywgZnVuY3Rpb24oJHJvdXRlUGFyYW1zKSB7XG4gICAgICAgICAgICB0aGlzLm5hbWUgPSBcIkJvb2tDdHJsXCI7XG4gICAgICAgICAgICB0aGlzLnBhcmFtcyA9ICRyb3V0ZVBhcmFtcztcbiAgICAgICAgICB9XSlcbiAgICAgICAgICAuY29udHJvbGxlcignQ2hhcHRlckN0cmwnLCBbJyRyb3V0ZVBhcmFtcycsIGZ1bmN0aW9uKCRyb3V0ZVBhcmFtcykge1xuICAgICAgICAgICAgdGhpcy5uYW1lID0gXCJDaGFwdGVyQ3RybFwiO1xuICAgICAgICAgICAgdGhpcy5wYXJhbXMgPSAkcm91dGVQYXJhbXM7XG4gICAgICAgICAgfV0pO1xuXG4gICAgICA8L2ZpbGU+XG5cbiAgICAgIDxmaWxlIG5hbWU9XCJwcm90cmFjdG9yLmpzXCIgdHlwZT1cInByb3RyYWN0b3JcIj5cbiAgICAgICAgaXQoJ3Nob3VsZCBsb2FkIGFuZCBjb21waWxlIGNvcnJlY3QgdGVtcGxhdGUnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICBlbGVtZW50KGJ5LmxpbmtUZXh0KCdNb2J5OiBDaDEnKSkuY2xpY2soKTtcbiAgICAgICAgICB2YXIgY29udGVudCA9IGVsZW1lbnQoYnkuY3NzKCdbbmctdmlld10nKSkuZ2V0VGV4dCgpO1xuICAgICAgICAgIGV4cGVjdChjb250ZW50KS50b01hdGNoKC9jb250cm9sbGVyXFw6IENoYXB0ZXJDdHJsLyk7XG4gICAgICAgICAgZXhwZWN0KGNvbnRlbnQpLnRvTWF0Y2goL0Jvb2sgSWRcXDogTW9ieS8pO1xuICAgICAgICAgIGV4cGVjdChjb250ZW50KS50b01hdGNoKC9DaGFwdGVyIElkXFw6IDEvKTtcblxuICAgICAgICAgIGVsZW1lbnQoYnkucGFydGlhbExpbmtUZXh0KCdTY2FybGV0JykpLmNsaWNrKCk7XG5cbiAgICAgICAgICBjb250ZW50ID0gZWxlbWVudChieS5jc3MoJ1tuZy12aWV3XScpKS5nZXRUZXh0KCk7XG4gICAgICAgICAgZXhwZWN0KGNvbnRlbnQpLnRvTWF0Y2goL2NvbnRyb2xsZXJcXDogQm9va0N0cmwvKTtcbiAgICAgICAgICBleHBlY3QoY29udGVudCkudG9NYXRjaCgvQm9vayBJZFxcOiBTY2FybGV0Lyk7XG4gICAgICAgIH0pO1xuICAgICAgPC9maWxlPlxuICAgIDwvZXhhbXBsZT5cbiAqL1xuXG5cbi8qKlxuICogQG5nZG9jIGV2ZW50XG4gKiBAbmFtZSBuZ1ZpZXcjJHZpZXdDb250ZW50TG9hZGVkXG4gKiBAZXZlbnRUeXBlIGVtaXQgb24gdGhlIGN1cnJlbnQgbmdWaWV3IHNjb3BlXG4gKiBAZGVzY3JpcHRpb25cbiAqIEVtaXR0ZWQgZXZlcnkgdGltZSB0aGUgbmdWaWV3IGNvbnRlbnQgaXMgcmVsb2FkZWQuXG4gKi9cbm5nVmlld0ZhY3RvcnkuJGluamVjdCA9IFsnJHJvdXRlJywgJyRhbmNob3JTY3JvbGwnLCAnJGFuaW1hdGUnXTtcbmZ1bmN0aW9uIG5nVmlld0ZhY3RvcnkoICAgJHJvdXRlLCAgICRhbmNob3JTY3JvbGwsICAgJGFuaW1hdGUpIHtcbiAgcmV0dXJuIHtcbiAgICByZXN0cmljdDogJ0VDQScsXG4gICAgdGVybWluYWw6IHRydWUsXG4gICAgcHJpb3JpdHk6IDQwMCxcbiAgICB0cmFuc2NsdWRlOiAnZWxlbWVudCcsXG4gICAgbGluazogZnVuY3Rpb24oc2NvcGUsICRlbGVtZW50LCBhdHRyLCBjdHJsLCAkdHJhbnNjbHVkZSkge1xuICAgICAgICB2YXIgY3VycmVudFNjb3BlLFxuICAgICAgICAgICAgY3VycmVudEVsZW1lbnQsXG4gICAgICAgICAgICBwcmV2aW91c0VsZW1lbnQsXG4gICAgICAgICAgICBhdXRvU2Nyb2xsRXhwID0gYXR0ci5hdXRvc2Nyb2xsLFxuICAgICAgICAgICAgb25sb2FkRXhwID0gYXR0ci5vbmxvYWQgfHwgJyc7XG5cbiAgICAgICAgc2NvcGUuJG9uKCckcm91dGVDaGFuZ2VTdWNjZXNzJywgdXBkYXRlKTtcbiAgICAgICAgdXBkYXRlKCk7XG5cbiAgICAgICAgZnVuY3Rpb24gY2xlYW51cExhc3RWaWV3KCkge1xuICAgICAgICAgIGlmKHByZXZpb3VzRWxlbWVudCkge1xuICAgICAgICAgICAgcHJldmlvdXNFbGVtZW50LnJlbW92ZSgpO1xuICAgICAgICAgICAgcHJldmlvdXNFbGVtZW50ID0gbnVsbDtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYoY3VycmVudFNjb3BlKSB7XG4gICAgICAgICAgICBjdXJyZW50U2NvcGUuJGRlc3Ryb3koKTtcbiAgICAgICAgICAgIGN1cnJlbnRTY29wZSA9IG51bGw7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmKGN1cnJlbnRFbGVtZW50KSB7XG4gICAgICAgICAgICAkYW5pbWF0ZS5sZWF2ZShjdXJyZW50RWxlbWVudCwgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgIHByZXZpb3VzRWxlbWVudCA9IG51bGw7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHByZXZpb3VzRWxlbWVudCA9IGN1cnJlbnRFbGVtZW50O1xuICAgICAgICAgICAgY3VycmVudEVsZW1lbnQgPSBudWxsO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIHVwZGF0ZSgpIHtcbiAgICAgICAgICB2YXIgbG9jYWxzID0gJHJvdXRlLmN1cnJlbnQgJiYgJHJvdXRlLmN1cnJlbnQubG9jYWxzLFxuICAgICAgICAgICAgICB0ZW1wbGF0ZSA9IGxvY2FscyAmJiBsb2NhbHMuJHRlbXBsYXRlO1xuXG4gICAgICAgICAgaWYgKGFuZ3VsYXIuaXNEZWZpbmVkKHRlbXBsYXRlKSkge1xuICAgICAgICAgICAgdmFyIG5ld1Njb3BlID0gc2NvcGUuJG5ldygpO1xuICAgICAgICAgICAgdmFyIGN1cnJlbnQgPSAkcm91dGUuY3VycmVudDtcblxuICAgICAgICAgICAgLy8gTm90ZTogVGhpcyB3aWxsIGFsc28gbGluayBhbGwgY2hpbGRyZW4gb2YgbmctdmlldyB0aGF0IHdlcmUgY29udGFpbmVkIGluIHRoZSBvcmlnaW5hbFxuICAgICAgICAgICAgLy8gaHRtbC4gSWYgdGhhdCBjb250ZW50IGNvbnRhaW5zIGNvbnRyb2xsZXJzLCAuLi4gdGhleSBjb3VsZCBwb2xsdXRlL2NoYW5nZSB0aGUgc2NvcGUuXG4gICAgICAgICAgICAvLyBIb3dldmVyLCB1c2luZyBuZy12aWV3IG9uIGFuIGVsZW1lbnQgd2l0aCBhZGRpdGlvbmFsIGNvbnRlbnQgZG9lcyBub3QgbWFrZSBzZW5zZS4uLlxuICAgICAgICAgICAgLy8gTm90ZTogV2UgY2FuJ3QgcmVtb3ZlIHRoZW0gaW4gdGhlIGNsb25lQXR0Y2hGbiBvZiAkdHJhbnNjbHVkZSBhcyB0aGF0XG4gICAgICAgICAgICAvLyBmdW5jdGlvbiBpcyBjYWxsZWQgYmVmb3JlIGxpbmtpbmcgdGhlIGNvbnRlbnQsIHdoaWNoIHdvdWxkIGFwcGx5IGNoaWxkXG4gICAgICAgICAgICAvLyBkaXJlY3RpdmVzIHRvIG5vbiBleGlzdGluZyBlbGVtZW50cy5cbiAgICAgICAgICAgIHZhciBjbG9uZSA9ICR0cmFuc2NsdWRlKG5ld1Njb3BlLCBmdW5jdGlvbihjbG9uZSkge1xuICAgICAgICAgICAgICAkYW5pbWF0ZS5lbnRlcihjbG9uZSwgbnVsbCwgY3VycmVudEVsZW1lbnQgfHwgJGVsZW1lbnQsIGZ1bmN0aW9uIG9uTmdWaWV3RW50ZXIgKCkge1xuICAgICAgICAgICAgICAgIGlmIChhbmd1bGFyLmlzRGVmaW5lZChhdXRvU2Nyb2xsRXhwKVxuICAgICAgICAgICAgICAgICAgJiYgKCFhdXRvU2Nyb2xsRXhwIHx8IHNjb3BlLiRldmFsKGF1dG9TY3JvbGxFeHApKSkge1xuICAgICAgICAgICAgICAgICAgJGFuY2hvclNjcm9sbCgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgIGNsZWFudXBMYXN0VmlldygpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGN1cnJlbnRFbGVtZW50ID0gY2xvbmU7XG4gICAgICAgICAgICBjdXJyZW50U2NvcGUgPSBjdXJyZW50LnNjb3BlID0gbmV3U2NvcGU7XG4gICAgICAgICAgICBjdXJyZW50U2NvcGUuJGVtaXQoJyR2aWV3Q29udGVudExvYWRlZCcpO1xuICAgICAgICAgICAgY3VycmVudFNjb3BlLiRldmFsKG9ubG9hZEV4cCk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNsZWFudXBMYXN0VmlldygpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgfTtcbn1cblxuLy8gVGhpcyBkaXJlY3RpdmUgaXMgY2FsbGVkIGR1cmluZyB0aGUgJHRyYW5zY2x1ZGUgY2FsbCBvZiB0aGUgZmlyc3QgYG5nVmlld2AgZGlyZWN0aXZlLlxuLy8gSXQgd2lsbCByZXBsYWNlIGFuZCBjb21waWxlIHRoZSBjb250ZW50IG9mIHRoZSBlbGVtZW50IHdpdGggdGhlIGxvYWRlZCB0ZW1wbGF0ZS5cbi8vIFdlIG5lZWQgdGhpcyBkaXJlY3RpdmUgc28gdGhhdCB0aGUgZWxlbWVudCBjb250ZW50IGlzIGFscmVhZHkgZmlsbGVkIHdoZW5cbi8vIHRoZSBsaW5rIGZ1bmN0aW9uIG9mIGFub3RoZXIgZGlyZWN0aXZlIG9uIHRoZSBzYW1lIGVsZW1lbnQgYXMgbmdWaWV3XG4vLyBpcyBjYWxsZWQuXG5uZ1ZpZXdGaWxsQ29udGVudEZhY3RvcnkuJGluamVjdCA9IFsnJGNvbXBpbGUnLCAnJGNvbnRyb2xsZXInLCAnJHJvdXRlJ107XG5mdW5jdGlvbiBuZ1ZpZXdGaWxsQ29udGVudEZhY3RvcnkoJGNvbXBpbGUsICRjb250cm9sbGVyLCAkcm91dGUpIHtcbiAgcmV0dXJuIHtcbiAgICByZXN0cmljdDogJ0VDQScsXG4gICAgcHJpb3JpdHk6IC00MDAsXG4gICAgbGluazogZnVuY3Rpb24oc2NvcGUsICRlbGVtZW50KSB7XG4gICAgICB2YXIgY3VycmVudCA9ICRyb3V0ZS5jdXJyZW50LFxuICAgICAgICAgIGxvY2FscyA9IGN1cnJlbnQubG9jYWxzO1xuXG4gICAgICAkZWxlbWVudC5odG1sKGxvY2Fscy4kdGVtcGxhdGUpO1xuXG4gICAgICB2YXIgbGluayA9ICRjb21waWxlKCRlbGVtZW50LmNvbnRlbnRzKCkpO1xuXG4gICAgICBpZiAoY3VycmVudC5jb250cm9sbGVyKSB7XG4gICAgICAgIGxvY2Fscy4kc2NvcGUgPSBzY29wZTtcbiAgICAgICAgdmFyIGNvbnRyb2xsZXIgPSAkY29udHJvbGxlcihjdXJyZW50LmNvbnRyb2xsZXIsIGxvY2Fscyk7XG4gICAgICAgIGlmIChjdXJyZW50LmNvbnRyb2xsZXJBcykge1xuICAgICAgICAgIHNjb3BlW2N1cnJlbnQuY29udHJvbGxlckFzXSA9IGNvbnRyb2xsZXI7XG4gICAgICAgIH1cbiAgICAgICAgJGVsZW1lbnQuZGF0YSgnJG5nQ29udHJvbGxlckNvbnRyb2xsZXInLCBjb250cm9sbGVyKTtcbiAgICAgICAgJGVsZW1lbnQuY2hpbGRyZW4oKS5kYXRhKCckbmdDb250cm9sbGVyQ29udHJvbGxlcicsIGNvbnRyb2xsZXIpO1xuICAgICAgfVxuXG4gICAgICBsaW5rKHNjb3BlKTtcbiAgICB9XG4gIH07XG59XG5cblxufSkod2luZG93LCB3aW5kb3cuYW5ndWxhcik7XG4iLCIhZnVuY3Rpb24gYShiLGMsZCl7ZnVuY3Rpb24gZShnLGgpe2lmKCFjW2ddKXtpZighYltnXSl7dmFyIGk9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighaCYmaSlyZXR1cm4gaShnLCEwKTtpZihmKXJldHVybiBmKGcsITApO3Rocm93IG5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrZytcIidcIil9dmFyIGo9Y1tnXT17ZXhwb3J0czp7fX07YltnXVswXS5jYWxsKGouZXhwb3J0cyxmdW5jdGlvbihhKXt2YXIgYz1iW2ddWzFdW2FdO3JldHVybiBlKGM/YzphKX0saixqLmV4cG9ydHMsYSxiLGMsZCl9cmV0dXJuIGNbZ10uZXhwb3J0c31mb3IodmFyIGY9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxnPTA7ZzxkLmxlbmd0aDtnKyspZShkW2ddKTtyZXR1cm4gZX0oezE6W2Z1bmN0aW9uKGEsYil7Yi5leHBvcnRzPXtvYXV0aGRfdXJsOlwiaHR0cHM6Ly9vYXV0aC5pb1wiLG9hdXRoZF9hcGk6XCJodHRwczovL29hdXRoLmlvL2FwaVwiLHZlcnNpb246XCJ3ZWItMC4yLjFcIixvcHRpb25zOnt9fX0se31dLDI6W2Z1bmN0aW9uKGEsYil7XCJ1c2Ugc3RyaWN0XCI7dmFyIGMsZCxlLGYsZztlPWEoXCIuLi9jb25maWdcIiksZj1hKFwiLi4vdG9vbHMvY29va2llc1wiKSxkPWEoXCIuLi90b29scy9jYWNoZVwiKSxjPWEoXCIuLi90b29scy91cmxcIiksZz1hKFwiLi4vdG9vbHMvc2hhMVwiKSxiLmV4cG9ydHM9ZnVuY3Rpb24oYixoLGksail7dmFyIGssbCxtLG4sbyxwLHEscjtyZXR1cm4gaz1pLGM9YyhoKSxmLmluaXQoZSxoKSxkLmluaXQoZixlKSxuPXtyZXF1ZXN0Ont9fSxyPXt9LHE9e30scD17ZXhlY1Byb3ZpZGVyc0NiOmZ1bmN0aW9uKGEsYixjKXt2YXIgZCxlO2lmKHFbYV0pe2Q9cVthXSxkZWxldGUgcVthXTtmb3IoZSBpbiBkKWRbZV0oYixjKX19LGdldERlc2NyaXB0aW9uOmZ1bmN0aW9uKGEsYixjKXtyZXR1cm4gYj1ifHx7fSxcIm9iamVjdFwiPT10eXBlb2YgclthXT9jKG51bGwsclthXSk6KHJbYV18fHAuZmV0Y2hEZXNjcmlwdGlvbihhKSxiLndhaXQ/KHFbYV09cVthXXx8W10sdm9pZCBxW2FdLnB1c2goYykpOmMobnVsbCx7fSkpfX0sZS5vYXV0aGRfYmFzZT1jLmdldEFic1VybChlLm9hdXRoZF91cmwpLm1hdGNoKC9eLnsyLDV9OlxcL1xcL1teL10rLylbMF0sbD1bXSxtPXZvaWQgMCwobz1mdW5jdGlvbigpe3ZhciBhLGI7Yj0vW1xcXFwjJl1vYXV0aGlvPShbXiZdKikvLmV4ZWMoaC5sb2NhdGlvbi5oYXNoKSxiJiYoaC5sb2NhdGlvbi5oYXNoPWgubG9jYXRpb24uaGFzaC5yZXBsYWNlKC8mP29hdXRoaW89W14mXSovLFwiXCIpLG09ZGVjb2RlVVJJQ29tcG9uZW50KGJbMV0ucmVwbGFjZSgvXFwrL2csXCIgXCIpKSxhPWYucmVhZENvb2tpZShcIm9hdXRoaW9fc3RhdGVcIiksYSYmKGwucHVzaChhKSxmLmVyYXNlQ29va2llKFwib2F1dGhpb19zdGF0ZVwiKSkpfSkoKSxiLmxvY2F0aW9uX29wZXJhdGlvbnM9e3JlbG9hZDpmdW5jdGlvbigpe3JldHVybiBoLmxvY2F0aW9uLnJlbG9hZCgpfSxnZXRIYXNoOmZ1bmN0aW9uKCl7cmV0dXJuIGgubG9jYXRpb24uaGFzaH0sc2V0SGFzaDpmdW5jdGlvbihhKXtyZXR1cm4gaC5sb2NhdGlvbi5oYXNoPWF9LGNoYW5nZUhyZWY6ZnVuY3Rpb24oYSl7cmV0dXJuIGgubG9jYXRpb24uaHJlZj1hfX0sZnVuY3Rpb24oaSl7dmFyIGssbyxxLHM7az1mdW5jdGlvbihiKXtuLnJlcXVlc3Q9YShcIi4vb2F1dGhpb19yZXF1ZXN0c1wiKShiLGUsbCxkLHApLHAuZmV0Y2hEZXNjcmlwdGlvbj1mdW5jdGlvbihhKXtyW2FdfHwoclthXT0hMCxiLmFqYXgoe3VybDplLm9hdXRoZF9hcGkrXCIvcHJvdmlkZXJzL1wiK2EsZGF0YTp7ZXh0ZW5kOiEwfSxkYXRhVHlwZTpcImpzb25cIn0pLmRvbmUoZnVuY3Rpb24oYil7clthXT1iLmRhdGEscC5leGVjUHJvdmlkZXJzQ2IoYSxudWxsLGIuZGF0YSl9KS5hbHdheXMoZnVuY3Rpb24oKXtcIm9iamVjdFwiIT10eXBlb2YgclthXSYmKGRlbGV0ZSByW2FdLHAuZXhlY1Byb3ZpZGVyc0NiKGEsbmV3IEVycm9yKFwiVW5hYmxlIHRvIGZldGNoIHJlcXVlc3QgZGVzY3JpcHRpb25cIikpKX0pKX19LG51bGw9PWkuT0F1dGgmJihpLk9BdXRoPXtpbml0aWFsaXplOmZ1bmN0aW9uKGEsYil7dmFyIGM7aWYoZS5rZXk9YSxiKWZvcihjIGluIGIpZS5vcHRpb25zW2NdPWJbY119LHNldE9BdXRoZFVSTDpmdW5jdGlvbihhKXtlLm9hdXRoZF91cmw9YSxlLm9hdXRoZF9iYXNlPWMuZ2V0QWJzVXJsKGUub2F1dGhkX3VybCkubWF0Y2goL14uezIsNX06XFwvXFwvW14vXSsvKVswXX0sZ2V0VmVyc2lvbjpmdW5jdGlvbigpe3JldHVybiBlLnZlcnNpb259LGNyZWF0ZTpmdW5jdGlvbihhLGIsYyl7dmFyIGUsZixnLGg7aWYoIWIpcmV0dXJuIGQudHJ5Q2FjaGUoaS5PQXV0aCxhLCEwKTtcIm9iamVjdFwiIT10eXBlb2YgYyYmcC5mZXRjaERlc2NyaXB0aW9uKGEpLGY9ZnVuY3Rpb24oZCl7cmV0dXJuIG4ucmVxdWVzdC5ta0h0dHAoYSxiLGMsZCl9LGc9ZnVuY3Rpb24oZCxlKXtyZXR1cm4gbi5yZXF1ZXN0Lm1rSHR0cEVuZHBvaW50KGEsYixjLGQsZSl9LGg9e307Zm9yKGUgaW4gYiloW2VdPWJbZV07cmV0dXJuIGguZ2V0PWYoXCJHRVRcIiksaC5wb3N0PWYoXCJQT1NUXCIpLGgucHV0PWYoXCJQVVRcIiksaC5wYXRjaD1mKFwiUEFUQ0hcIiksaC5kZWw9ZihcIkRFTEVURVwiKSxoLm1lPW4ucmVxdWVzdC5ta0h0dHBNZShhLGIsYyxcIkdFVFwiKSxofSxwb3B1cDpmdW5jdGlvbihhLGYsayl7dmFyIG0sbyxwLHEscixzLHQsdSx2LHc7cmV0dXJuIHA9ZnVuY3Rpb24oYSl7aWYoYS5vcmlnaW49PT1lLm9hdXRoZF9iYXNlKXt0cnl7cy5jbG9zZSgpfWNhdGNoKGIpe31yZXR1cm4gZi5kYXRhPWEuZGF0YSxuLnJlcXVlc3Quc2VuZENhbGxiYWNrKGYsbSl9fSxzPXZvaWQgMCxvPXZvaWQgMCx0PXZvaWQgMCxtPW51bGwhPSh3PWIualF1ZXJ5KT93LkRlZmVycmVkKCk6dm9pZCAwLGY9Znx8e30sZS5rZXk/KDI9PT1hcmd1bWVudHMubGVuZ3RoJiZcImZ1bmN0aW9uXCI9PXR5cGVvZiBmJiYoaz1mLGY9e30pLGQuY2FjaGVFbmFibGVkKGYuY2FjaGUpJiYocT1kLnRyeUNhY2hlKGkuT0F1dGgsYSxmLmNhY2hlKSk/KG51bGwhPW0mJm0ucmVzb2x2ZShxKSxrP2sobnVsbCxxKTptLnByb21pc2UoKSk6KGYuc3RhdGV8fChmLnN0YXRlPWcuY3JlYXRlX2hhc2goKSxmLnN0YXRlX3R5cGU9XCJjbGllbnRcIiksbC5wdXNoKGYuc3RhdGUpLHI9ZS5vYXV0aGRfdXJsK1wiL2F1dGgvXCIrYStcIj9rPVwiK2Uua2V5LHIrPVwiJmQ9XCIrZW5jb2RlVVJJQ29tcG9uZW50KGMuZ2V0QWJzVXJsKFwiL1wiKSksZiYmKHIrPVwiJm9wdHM9XCIrZW5jb2RlVVJJQ29tcG9uZW50KEpTT04uc3RyaW5naWZ5KGYpKSksZi53bmRfc2V0dGluZ3M/KHY9Zi53bmRfc2V0dGluZ3MsZGVsZXRlIGYud25kX3NldHRpbmdzKTp2PXt3aWR0aDpNYXRoLmZsb29yKC44KmIub3V0ZXJXaWR0aCksaGVpZ2h0Ok1hdGguZmxvb3IoLjUqYi5vdXRlckhlaWdodCl9LG51bGw9PXYuaGVpZ2h0JiYodi5oZWlnaHQ9di5oZWlnaHQ8MzUwPzM1MDp2b2lkIDApLG51bGw9PXYud2lkdGgmJih2LndpZHRoPXYud2lkdGg8ODAwPzgwMDp2b2lkIDApLG51bGw9PXYubGVmdCYmKHYubGVmdD1iLnNjcmVlblgrKGIub3V0ZXJXaWR0aC12LndpZHRoKS8yKSxudWxsPT12LnRvcCYmKHYudG9wPWIuc2NyZWVuWSsoYi5vdXRlckhlaWdodC12LmhlaWdodCkvOCksdT1cIndpZHRoPVwiK3Yud2lkdGgrXCIsaGVpZ2h0PVwiK3YuaGVpZ2h0LHUrPVwiLHRvb2xiYXI9MCxzY3JvbGxiYXJzPTEsc3RhdHVzPTEscmVzaXphYmxlPTEsbG9jYXRpb249MSxtZW51QmFyPTBcIix1Kz1cIixsZWZ0PVwiK3YubGVmdCtcIix0b3A9XCIrdi50b3AsZj17cHJvdmlkZXI6YSxjYWNoZTpmLmNhY2hlfSxmLmNhbGxiYWNrPWZ1bmN0aW9uKGEsYyl7cmV0dXJuIGIucmVtb3ZlRXZlbnRMaXN0ZW5lcj9iLnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJtZXNzYWdlXCIscCwhMSk6Yi5kZXRhY2hFdmVudD9iLmRldGFjaEV2ZW50KFwib25tZXNzYWdlXCIscCk6aC5kZXRhY2hFdmVudCYmaC5kZXRhY2hFdmVudChcIm9ubWVzc2FnZVwiLHApLGYuY2FsbGJhY2s9ZnVuY3Rpb24oKXt9LHQmJihjbGVhclRpbWVvdXQodCksdD12b2lkIDApLGs/ayhhLGMpOnZvaWQgMH0sYi5hdHRhY2hFdmVudD9iLmF0dGFjaEV2ZW50KFwib25tZXNzYWdlXCIscCk6aC5hdHRhY2hFdmVudD9oLmF0dGFjaEV2ZW50KFwib25tZXNzYWdlXCIscCk6Yi5hZGRFdmVudExpc3RlbmVyJiZiLmFkZEV2ZW50TGlzdGVuZXIoXCJtZXNzYWdlXCIscCwhMSksXCJ1bmRlZmluZWRcIiE9dHlwZW9mIGNocm9tZSYmY2hyb21lLnJ1bnRpbWUmJmNocm9tZS5ydW50aW1lLm9uTWVzc2FnZUV4dGVybmFsJiZjaHJvbWUucnVudGltZS5vbk1lc3NhZ2VFeHRlcm5hbC5hZGRMaXN0ZW5lcihmdW5jdGlvbihhLGIpe3JldHVybiBhLm9yaWdpbj1iLnVybC5tYXRjaCgvXi57Miw1fTpcXC9cXC9bXi9dKy8pWzBdLG51bGwhPW0mJm0ucmVzb2x2ZSgpLHAoYSl9KSwhbyYmKC0xIT09ai51c2VyQWdlbnQuaW5kZXhPZihcIk1TSUVcIil8fGouYXBwVmVyc2lvbi5pbmRleE9mKFwiVHJpZGVudC9cIik+MCkmJihvPWguY3JlYXRlRWxlbWVudChcImlmcmFtZVwiKSxvLnNyYz1lLm9hdXRoZF91cmwrXCIvYXV0aC9pZnJhbWU/ZD1cIitlbmNvZGVVUklDb21wb25lbnQoYy5nZXRBYnNVcmwoXCIvXCIpKSxvLndpZHRoPTAsby5oZWlnaHQ9MCxvLmZyYW1lQm9yZGVyPTAsby5zdHlsZS52aXNpYmlsaXR5PVwiaGlkZGVuXCIsaC5ib2R5LmFwcGVuZENoaWxkKG8pKSx0PXNldFRpbWVvdXQoZnVuY3Rpb24oKXtudWxsIT1tJiZtLnJlamVjdChuZXcgRXJyb3IoXCJBdXRob3JpemF0aW9uIHRpbWVkIG91dFwiKSksZi5jYWxsYmFjayYmXCJmdW5jdGlvblwiPT10eXBlb2YgZi5jYWxsYmFjayYmZi5jYWxsYmFjayhuZXcgRXJyb3IoXCJBdXRob3JpemF0aW9uIHRpbWVkIG91dFwiKSk7dHJ5e3MuY2xvc2UoKX1jYXRjaChhKXt9fSwxMmU1KSxzPWIub3BlbihyLFwiQXV0aG9yaXphdGlvblwiLHUpLHM/cy5mb2N1cygpOihudWxsIT1tJiZtLnJlamVjdChuZXcgRXJyb3IoXCJDb3VsZCBub3Qgb3BlbiBhIHBvcHVwXCIpKSxmLmNhbGxiYWNrJiZcImZ1bmN0aW9uXCI9PXR5cGVvZiBmLmNhbGxiYWNrJiZmLmNhbGxiYWNrKG5ldyBFcnJvcihcIkNvdWxkIG5vdCBvcGVuIGEgcG9wdXBcIikpKSxudWxsIT1tP20ucHJvbWlzZSgpOnZvaWQgMCkpOihudWxsIT1tJiZtLnJlamVjdChuZXcgRXJyb3IoXCJPQXV0aCBvYmplY3QgbXVzdCBiZSBpbml0aWFsaXplZFwiKSksbnVsbD09az9tLnByb21pc2UoKTprKG5ldyBFcnJvcihcIk9BdXRoIG9iamVjdCBtdXN0IGJlIGluaXRpYWxpemVkXCIpKSl9LHJlZGlyZWN0OmZ1bmN0aW9uKGEsaCxqKXt2YXIgayxsO3JldHVybiAyPT09YXJndW1lbnRzLmxlbmd0aCYmKGo9aCxoPXt9KSxkLmNhY2hlRW5hYmxlZChoLmNhY2hlKSYmKGw9ZC50cnlDYWNoZShpLk9BdXRoLGEsaC5jYWNoZSkpPyhqPWMuZ2V0QWJzVXJsKGopKygtMT09PWouaW5kZXhPZihcIiNcIik/XCIjXCI6XCImXCIpK1wib2F1dGhpbz1jYWNoZVwiLGIubG9jYXRpb25fb3BlcmF0aW9ucy5jaGFuZ2VIcmVmKGopLHZvaWQgYi5sb2NhdGlvbl9vcGVyYXRpb25zLnJlbG9hZCgpKTooaC5zdGF0ZXx8KGguc3RhdGU9Zy5jcmVhdGVfaGFzaCgpLGguc3RhdGVfdHlwZT1cImNsaWVudFwiKSxmLmNyZWF0ZUNvb2tpZShcIm9hdXRoaW9fc3RhdGVcIixoLnN0YXRlKSxrPWVuY29kZVVSSUNvbXBvbmVudChjLmdldEFic1VybChqKSksaj1lLm9hdXRoZF91cmwrXCIvYXV0aC9cIithK1wiP2s9XCIrZS5rZXksais9XCImcmVkaXJlY3RfdXJpPVwiK2ssaCYmKGorPVwiJm9wdHM9XCIrZW5jb2RlVVJJQ29tcG9uZW50KEpTT04uc3RyaW5naWZ5KGgpKSksdm9pZCBiLmxvY2F0aW9uX29wZXJhdGlvbnMuY2hhbmdlSHJlZihqKSl9LGNhbGxiYWNrOmZ1bmN0aW9uKGEsYyxlKXt2YXIgZixnLGg7aWYoZj1udWxsIT0oaD1iLmpRdWVyeSk/aC5EZWZlcnJlZCgpOnZvaWQgMCwxPT09YXJndW1lbnRzLmxlbmd0aCYmXCJmdW5jdGlvblwiPT10eXBlb2YgYSYmKGU9YSxhPXZvaWQgMCxjPXt9KSwxPT09YXJndW1lbnRzLmxlbmd0aCYmXCJzdHJpbmdcIj09dHlwZW9mIGEmJihjPXt9KSwyPT09YXJndW1lbnRzLmxlbmd0aCYmXCJmdW5jdGlvblwiPT10eXBlb2YgYyYmKGU9YyxjPXt9KSxkLmNhY2hlRW5hYmxlZChjLmNhY2hlKXx8XCJjYWNoZVwiPT09bSl7aWYoZz1kLnRyeUNhY2hlKGkuT0F1dGgsYSxjLmNhY2hlKSxcImNhY2hlXCI9PT1tJiYoXCJzdHJpbmdcIiE9dHlwZW9mIGF8fCFhKSlyZXR1cm4gbnVsbCE9ZiYmZi5yZWplY3QobmV3IEVycm9yKFwiWW91IG11c3Qgc2V0IGEgcHJvdmlkZXIgd2hlbiB1c2luZyB0aGUgY2FjaGVcIikpLGU/ZShuZXcgRXJyb3IoXCJZb3UgbXVzdCBzZXQgYSBwcm92aWRlciB3aGVuIHVzaW5nIHRoZSBjYWNoZVwiKSk6bnVsbCE9Zj9mLnByb21pc2UoKTp2b2lkIDA7aWYoZyl7aWYoIWUpcmV0dXJuIG51bGwhPWYmJmYucmVzb2x2ZShnKSxudWxsIT1mP2YucHJvbWlzZSgpOnZvaWQgMDtpZihnKXJldHVybiBlKG51bGwsZyl9fXJldHVybiBtPyhuLnJlcXVlc3Quc2VuZENhbGxiYWNrKHtkYXRhOm0scHJvdmlkZXI6YSxjYWNoZTpjLmNhY2hlLGNhbGxiYWNrOmV9LGYpLG51bGwhPWY/Zi5wcm9taXNlKCk6dm9pZCAwKTp2b2lkIDB9LGNsZWFyQ2FjaGU6ZnVuY3Rpb24oYSl7Zi5lcmFzZUNvb2tpZShcIm9hdXRoaW9fcHJvdmlkZXJfXCIrYSl9LGh0dHBfbWU6ZnVuY3Rpb24oYSl7bi5yZXF1ZXN0Lmh0dHBfbWUmJm4ucmVxdWVzdC5odHRwX21lKGEpfSxodHRwOmZ1bmN0aW9uKGEpe24ucmVxdWVzdC5odHRwJiZuLnJlcXVlc3QuaHR0cChhKX19LFwidW5kZWZpbmVkXCI9PXR5cGVvZiBiLmpRdWVyeT8ocz1bXSxvPXZvaWQgMCxcInVuZGVmaW5lZFwiIT10eXBlb2YgY2hyb21lJiZjaHJvbWUuZXh0ZW5zaW9uP289ZnVuY3Rpb24oKXtyZXR1cm4gZnVuY3Rpb24oKXt0aHJvdyBuZXcgRXJyb3IoXCJQbGVhc2UgaW5jbHVkZSBqUXVlcnkgYmVmb3JlIG9hdXRoLmpzXCIpfX06KHE9aC5jcmVhdGVFbGVtZW50KFwic2NyaXB0XCIpLHEuc3JjPVwiLy9jb2RlLmpxdWVyeS5jb20vanF1ZXJ5Lm1pbi5qc1wiLHEudHlwZT1cInRleHQvamF2YXNjcmlwdFwiLHEub25sb2FkPWZ1bmN0aW9uKCl7dmFyIGE7ayhiLmpRdWVyeSk7Zm9yKGEgaW4gcylzW2FdLmZuLmFwcGx5KG51bGwsc1thXS5hcmdzKX0saC5nZXRFbGVtZW50c0J5VGFnTmFtZShcImhlYWRcIilbMF0uYXBwZW5kQ2hpbGQocSksbz1mdW5jdGlvbihhKXtyZXR1cm4gZnVuY3Rpb24oKXt2YXIgYixjO2M9W107Zm9yKGIgaW4gYXJndW1lbnRzKWNbYl09YXJndW1lbnRzW2JdO3MucHVzaCh7Zm46YSxhcmdzOmN9KX19KSxuLnJlcXVlc3QuaHR0cD1vKGZ1bmN0aW9uKCl7bi5yZXF1ZXN0Lmh0dHAuYXBwbHkoaS5PQXV0aCxhcmd1bWVudHMpfSkscC5mZXRjaERlc2NyaXB0aW9uPW8oZnVuY3Rpb24oKXtwLmZldGNoRGVzY3JpcHRpb24uYXBwbHkocCxhcmd1bWVudHMpfSksbi5yZXF1ZXN0PWEoXCIuL29hdXRoaW9fcmVxdWVzdHNcIikoYi5qUXVlcnksZSxsLGQscCkpOmsoYi5qUXVlcnkpKX19fSx7XCIuLi9jb25maWdcIjoxLFwiLi4vdG9vbHMvY2FjaGVcIjo1LFwiLi4vdG9vbHMvY29va2llc1wiOjYsXCIuLi90b29scy9zaGExXCI6NyxcIi4uL3Rvb2xzL3VybFwiOjgsXCIuL29hdXRoaW9fcmVxdWVzdHNcIjozfV0sMzpbZnVuY3Rpb24oYSxiKXt2YXIgYyxkPVtdLmluZGV4T2Z8fGZ1bmN0aW9uKGEpe2Zvcih2YXIgYj0wLGM9dGhpcy5sZW5ndGg7Yz5iO2IrKylpZihiIGluIHRoaXMmJnRoaXNbYl09PT1hKXJldHVybiBiO3JldHVybi0xfTtjPWEoXCIuLi90b29scy91cmxcIikoKSxiLmV4cG9ydHM9ZnVuY3Rpb24oYSxiLGUsZixnKXtyZXR1cm57aHR0cDpmdW5jdGlvbihlKXt2YXIgZixoLGksaixrO2k9ZnVuY3Rpb24oKXt2YXIgZSxmLGcsaDtpZihoPWsub2F1dGhpby5yZXF1ZXN0fHx7fSwhaC5jb3JzKXtrLnVybD1lbmNvZGVVUklDb21wb25lbnQoay51cmwpLFwiL1wiIT09ay51cmxbMF0mJihrLnVybD1cIi9cIitrLnVybCksay51cmw9Yi5vYXV0aGRfdXJsK1wiL3JlcXVlc3QvXCIray5vYXV0aGlvLnByb3ZpZGVyK2sudXJsLGsuaGVhZGVycz1rLmhlYWRlcnN8fHt9LGsuaGVhZGVycy5vYXV0aGlvPVwiaz1cIitiLmtleSxrLm9hdXRoaW8udG9rZW5zLm9hdXRoX3Rva2VuJiZrLm9hdXRoaW8udG9rZW5zLm9hdXRoX3Rva2VuX3NlY3JldCYmKGsuaGVhZGVycy5vYXV0aGlvKz1cIiZvYXV0aHY9MVwiKTtmb3IoZiBpbiBrLm9hdXRoaW8udG9rZW5zKWsuaGVhZGVycy5vYXV0aGlvKz1cIiZcIitlbmNvZGVVUklDb21wb25lbnQoZikrXCI9XCIrZW5jb2RlVVJJQ29tcG9uZW50KGsub2F1dGhpby50b2tlbnNbZl0pO3JldHVybiBkZWxldGUgay5vYXV0aGlvLGEuYWpheChrKX1pZihrLm9hdXRoaW8udG9rZW5zKXtpZihrLm9hdXRoaW8udG9rZW5zLmFjY2Vzc190b2tlbiYmKGsub2F1dGhpby50b2tlbnMudG9rZW49ay5vYXV0aGlvLnRva2Vucy5hY2Nlc3NfdG9rZW4pLGsudXJsLm1hdGNoKC9eW2Etel17MiwxNn06XFwvXFwvLyl8fChcIi9cIiE9PWsudXJsWzBdJiYoay51cmw9XCIvXCIray51cmwpLGsudXJsPWgudXJsK2sudXJsKSxrLnVybD1jLnJlcGxhY2VQYXJhbShrLnVybCxrLm9hdXRoaW8udG9rZW5zLGgucGFyYW1ldGVycyksaC5xdWVyeSl7Zz1bXTtmb3IoZSBpbiBoLnF1ZXJ5KWcucHVzaChlbmNvZGVVUklDb21wb25lbnQoZSkrXCI9XCIrZW5jb2RlVVJJQ29tcG9uZW50KGMucmVwbGFjZVBhcmFtKGgucXVlcnlbZV0say5vYXV0aGlvLnRva2VucyxoLnBhcmFtZXRlcnMpKSk7ay51cmwrPWQuY2FsbChrLnVybCxcIj9cIik+PTA/XCImXCIrZzpcIj9cIitnfWlmKGguaGVhZGVycyl7ay5oZWFkZXJzPWsuaGVhZGVyc3x8e307Zm9yKGUgaW4gaC5oZWFkZXJzKWsuaGVhZGVyc1tlXT1jLnJlcGxhY2VQYXJhbShoLmhlYWRlcnNbZV0say5vYXV0aGlvLnRva2VucyxoLnBhcmFtZXRlcnMpfXJldHVybiBkZWxldGUgay5vYXV0aGlvLGEuYWpheChrKX19LGs9e30saj12b2lkIDA7Zm9yKGogaW4gZSlrW2pdPWVbal07cmV0dXJuIGsub2F1dGhpby5yZXF1ZXN0JiZrLm9hdXRoaW8ucmVxdWVzdCE9PSEwP2koKTooaD17d2FpdDohIWsub2F1dGhpby5yZXF1ZXN0fSxmPW51bGwhPWE/YS5EZWZlcnJlZCgpOnZvaWQgMCxnLmdldERlc2NyaXB0aW9uKGsub2F1dGhpby5wcm92aWRlcixoLGZ1bmN0aW9uKGEsYil7cmV0dXJuIGE/bnVsbCE9Zj9mLnJlamVjdChhKTp2b2lkIDA6KGsub2F1dGhpby5yZXF1ZXN0PWsub2F1dGhpby50b2tlbnMub2F1dGhfdG9rZW4mJmsub2F1dGhpby50b2tlbnMub2F1dGhfdG9rZW5fc2VjcmV0P2Iub2F1dGgxJiZiLm9hdXRoMS5yZXF1ZXN0OmIub2F1dGgyJiZiLm9hdXRoMi5yZXF1ZXN0LHZvaWQobnVsbCE9ZiYmZi5yZXNvbHZlKCkpKX0pLG51bGwhPWY/Zi50aGVuKGkpOnZvaWQgMCl9LGh0dHBfbWU6ZnVuY3Rpb24oYyl7dmFyIGQsZSxmLGgsaTtmPWZ1bmN0aW9uKCl7dmFyIGMsZCxlLGY7Yz1udWxsIT1hP2EuRGVmZXJyZWQoKTp2b2lkIDAsZj1pLm9hdXRoaW8ucmVxdWVzdHx8e30saS51cmw9Yi5vYXV0aGRfdXJsK1wiL2F1dGgvXCIraS5vYXV0aGlvLnByb3ZpZGVyK1wiL21lXCIsaS5oZWFkZXJzPWkuaGVhZGVyc3x8e30saS5oZWFkZXJzLm9hdXRoaW89XCJrPVwiK2Iua2V5LGkub2F1dGhpby50b2tlbnMub2F1dGhfdG9rZW4mJmkub2F1dGhpby50b2tlbnMub2F1dGhfdG9rZW5fc2VjcmV0JiYoaS5oZWFkZXJzLm9hdXRoaW8rPVwiJm9hdXRodj0xXCIpO2ZvcihkIGluIGkub2F1dGhpby50b2tlbnMpaS5oZWFkZXJzLm9hdXRoaW8rPVwiJlwiK2VuY29kZVVSSUNvbXBvbmVudChkKStcIj1cIitlbmNvZGVVUklDb21wb25lbnQoaS5vYXV0aGlvLnRva2Vuc1tkXSk7cmV0dXJuIGRlbGV0ZSBpLm9hdXRoaW8sZT1hLmFqYXgoaSksYS53aGVuKGUpLmRvbmUoZnVuY3Rpb24oYSl7bnVsbCE9YyYmYy5yZXNvbHZlKGEuZGF0YSl9KS5mYWlsKGZ1bmN0aW9uKGEpe2EucmVzcG9uc2VKU09OP251bGwhPWMmJmMucmVqZWN0KGEucmVzcG9uc2VKU09OLmRhdGEpOm51bGwhPWMmJmMucmVqZWN0KG5ldyBFcnJvcihcIkFuIGVycm9yIG9jY3VyZWQgd2hpbGUgdHJ5aW5nIHRvIGFjY2VzcyB0aGUgcmVzb3VyY2VcIikpfSksbnVsbCE9Yz9jLnByb21pc2UoKTp2b2lkIDB9LGk9e307Zm9yKGggaW4gYylpW2hdPWNbaF07cmV0dXJuIGkub2F1dGhpby5yZXF1ZXN0JiZpLm9hdXRoaW8ucmVxdWVzdCE9PSEwP2YoKTooZT17d2FpdDohIWkub2F1dGhpby5yZXF1ZXN0fSxkPW51bGwhPWE/YS5EZWZlcnJlZCgpOnZvaWQgMCxnLmdldERlc2NyaXB0aW9uKGkub2F1dGhpby5wcm92aWRlcixlLGZ1bmN0aW9uKGEsYil7cmV0dXJuIGE/bnVsbCE9ZD9kLnJlamVjdChhKTp2b2lkIDA6KGkub2F1dGhpby5yZXF1ZXN0PWkub2F1dGhpby50b2tlbnMub2F1dGhfdG9rZW4mJmkub2F1dGhpby50b2tlbnMub2F1dGhfdG9rZW5fc2VjcmV0P2Iub2F1dGgxJiZiLm9hdXRoMS5yZXF1ZXN0OmIub2F1dGgyJiZiLm9hdXRoMi5yZXF1ZXN0LHZvaWQobnVsbCE9ZCYmZC5yZXNvbHZlKCkpKX0pLG51bGwhPWQ/ZC50aGVuKGYpOnZvaWQgMCl9LG1rSHR0cDpmdW5jdGlvbihhLGIsYyxkKXt2YXIgZTtyZXR1cm4gZT10aGlzLGZ1bmN0aW9uKGYsZyl7dmFyIGgsaTtpZihpPXt9LFwic3RyaW5nXCI9PXR5cGVvZiBmKXtpZihcIm9iamVjdFwiPT10eXBlb2YgZylmb3IoaCBpbiBnKWlbaF09Z1toXTtpLnVybD1mfWVsc2UgaWYoXCJvYmplY3RcIj09dHlwZW9mIGYpZm9yKGggaW4gZilpW2hdPWZbaF07cmV0dXJuIGkudHlwZT1pLnR5cGV8fGQsaS5vYXV0aGlvPXtwcm92aWRlcjphLHRva2VuczpiLHJlcXVlc3Q6Y30sZS5odHRwKGkpfX0sbWtIdHRwTWU6ZnVuY3Rpb24oYSxiLGMsZCl7dmFyIGU7cmV0dXJuIGU9dGhpcyxmdW5jdGlvbihmKXt2YXIgZztyZXR1cm4gZz17fSxnLnR5cGU9Zy50eXBlfHxkLGcub2F1dGhpbz17cHJvdmlkZXI6YSx0b2tlbnM6YixyZXF1ZXN0OmN9LGcuZGF0YT1nLmRhdGF8fHt9LGcuZGF0YS5maWx0ZXI9Zj9mLmpvaW4oXCIsXCIpOnZvaWQgMCxlLmh0dHBfbWUoZyl9fSxzZW5kQ2FsbGJhY2s6ZnVuY3Rpb24oYSxiKXt2YXIgYyxkLGcsaCxpLGosayxsLG07Yz10aGlzLGQ9dm9pZCAwLGg9dm9pZCAwO3RyeXtkPUpTT04ucGFyc2UoYS5kYXRhKX1jYXRjaChuKXtyZXR1cm4gZz1uLG51bGwhPWImJmIucmVqZWN0KG5ldyBFcnJvcihcIkVycm9yIHdoaWxlIHBhcnNpbmcgcmVzdWx0XCIpKSxhLmNhbGxiYWNrKG5ldyBFcnJvcihcIkVycm9yIHdoaWxlIHBhcnNpbmcgcmVzdWx0XCIpKX1pZihkJiZkLnByb3ZpZGVyKXtpZihhLnByb3ZpZGVyJiZkLnByb3ZpZGVyLnRvTG93ZXJDYXNlKCkhPT1hLnByb3ZpZGVyLnRvTG93ZXJDYXNlKCkpcmV0dXJuIGg9bmV3IEVycm9yKFwiUmV0dXJuZWQgcHJvdmlkZXIgbmFtZSBkb2VzIG5vdCBtYXRjaCBhc2tlZCBwcm92aWRlclwiKSxudWxsIT1iJiZiLnJlamVjdChoKSxhLmNhbGxiYWNrJiZcImZ1bmN0aW9uXCI9PXR5cGVvZiBhLmNhbGxiYWNrP2EuY2FsbGJhY2soaCk6dm9pZCAwO2lmKFwiZXJyb3JcIj09PWQuc3RhdHVzfHxcImZhaWxcIj09PWQuc3RhdHVzKXJldHVybiBoPW5ldyBFcnJvcihkLm1lc3NhZ2UpLGguYm9keT1kLmRhdGEsbnVsbCE9YiYmYi5yZWplY3QoaCksYS5jYWxsYmFjayYmXCJmdW5jdGlvblwiPT10eXBlb2YgYS5jYWxsYmFjaz9hLmNhbGxiYWNrKGgpOnZvaWQgMDtpZihcInN1Y2Nlc3NcIiE9PWQuc3RhdHVzfHwhZC5kYXRhKXJldHVybiBoPW5ldyBFcnJvcixoLmJvZHk9ZC5kYXRhLG51bGwhPWImJmIucmVqZWN0KGgpLGEuY2FsbGJhY2smJlwiZnVuY3Rpb25cIj09dHlwZW9mIGEuY2FsbGJhY2s/YS5jYWxsYmFjayhoKTp2b2lkIDA7aWYoIWQuc3RhdGV8fC0xPT09ZS5pbmRleE9mKGQuc3RhdGUpKXJldHVybiBudWxsIT1iJiZiLnJlamVjdChuZXcgRXJyb3IoXCJTdGF0ZSBpcyBub3QgbWF0Y2hpbmdcIikpLGEuY2FsbGJhY2smJlwiZnVuY3Rpb25cIj09dHlwZW9mIGEuY2FsbGJhY2s/YS5jYWxsYmFjayhuZXcgRXJyb3IoXCJTdGF0ZSBpcyBub3QgbWF0Y2hpbmdcIikpOnZvaWQgMDtpZihhLnByb3ZpZGVyfHwoZC5kYXRhLnByb3ZpZGVyPWQucHJvdmlkZXIpLGw9ZC5kYXRhLGYuY2FjaGVFbmFibGVkKGEuY2FjaGUpJiZsJiZmLnN0b3JlQ2FjaGUoZC5wcm92aWRlcixsKSxrPWwucmVxdWVzdCxkZWxldGUgbC5yZXF1ZXN0LG09dm9pZCAwLGwuYWNjZXNzX3Rva2VuP209e2FjY2Vzc190b2tlbjpsLmFjY2Vzc190b2tlbn06bC5vYXV0aF90b2tlbiYmbC5vYXV0aF90b2tlbl9zZWNyZXQmJihtPXtvYXV0aF90b2tlbjpsLm9hdXRoX3Rva2VuLG9hdXRoX3Rva2VuX3NlY3JldDpsLm9hdXRoX3Rva2VuX3NlY3JldH0pLCFrKXJldHVybiBudWxsIT1iJiZiLnJlc29sdmUobCksYS5jYWxsYmFjayYmXCJmdW5jdGlvblwiPT10eXBlb2YgYS5jYWxsYmFjaz9hLmNhbGxiYWNrKG51bGwsbCk6dm9pZCAwO2lmKGsucmVxdWlyZWQpZm9yKGkgaW4gay5yZXF1aXJlZCltW2sucmVxdWlyZWRbaV1dPWxbay5yZXF1aXJlZFtpXV07cmV0dXJuIGo9ZnVuY3Rpb24oYSl7cmV0dXJuIGMubWtIdHRwKGQucHJvdmlkZXIsbSxrLGEpfSxsLmdldD1qKFwiR0VUXCIpLGwucG9zdD1qKFwiUE9TVFwiKSxsLnB1dD1qKFwiUFVUXCIpLGwucGF0Y2g9aihcIlBBVENIXCIpLGwuZGVsPWooXCJERUxFVEVcIiksbC5tZT1jLm1rSHR0cE1lKGQucHJvdmlkZXIsbSxrLFwiR0VUXCIpLG51bGwhPWImJmIucmVzb2x2ZShsKSxhLmNhbGxiYWNrJiZcImZ1bmN0aW9uXCI9PXR5cGVvZiBhLmNhbGxiYWNrP2EuY2FsbGJhY2sobnVsbCxsKTp2b2lkIDB9fX19fSx7XCIuLi90b29scy91cmxcIjo4fV0sNDpbZnVuY3Rpb24oYSl7dmFyIGIsYztjPVwidW5kZWZpbmVkXCIhPXR5cGVvZiBqUXVlcnkmJm51bGwhPT1qUXVlcnk/alF1ZXJ5OnZvaWQgMCwoYj1hKFwiLi9saWIvb2F1dGhcIikod2luZG93LGRvY3VtZW50LGMsbmF2aWdhdG9yKSkod2luZG93fHx0aGlzKX0se1wiLi9saWIvb2F1dGhcIjoyfV0sNTpbZnVuY3Rpb24oYSxiKXtiLmV4cG9ydHM9e2luaXQ6ZnVuY3Rpb24oYSxiKXtyZXR1cm4gdGhpcy5jb25maWc9Yix0aGlzLmNvb2tpZXM9YX0sdHJ5Q2FjaGU6ZnVuY3Rpb24oYSxiLGMpe3ZhciBkLGUsZjtpZih0aGlzLmNhY2hlRW5hYmxlZChjKSl7aWYoYz10aGlzLmNvb2tpZXMucmVhZENvb2tpZShcIm9hdXRoaW9fcHJvdmlkZXJfXCIrYiksIWMpcmV0dXJuITE7Yz1kZWNvZGVVUklDb21wb25lbnQoYyl9aWYoXCJzdHJpbmdcIj09dHlwZW9mIGMpdHJ5e2M9SlNPTi5wYXJzZShjKX1jYXRjaChnKXtyZXR1cm4gZD1nLCExfWlmKFwib2JqZWN0XCI9PXR5cGVvZiBjKXtmPXt9O2ZvcihlIGluIGMpXCJyZXF1ZXN0XCIhPT1lJiZcImZ1bmN0aW9uXCIhPXR5cGVvZiBjW2VdJiYoZltlXT1jW2VdKTtyZXR1cm4gYS5jcmVhdGUoYixmLGMucmVxdWVzdCl9cmV0dXJuITF9LHN0b3JlQ2FjaGU6ZnVuY3Rpb24oYSxiKXt0aGlzLmNvb2tpZXMuY3JlYXRlQ29va2llKFwib2F1dGhpb19wcm92aWRlcl9cIithLGVuY29kZVVSSUNvbXBvbmVudChKU09OLnN0cmluZ2lmeShiKSksYi5leHBpcmVzX2luLTEwfHwzNjAwKX0sY2FjaGVFbmFibGVkOmZ1bmN0aW9uKGEpe3JldHVyblwidW5kZWZpbmVkXCI9PXR5cGVvZiBhP3RoaXMuY29uZmlnLm9wdGlvbnMuY2FjaGU6YX19fSx7fV0sNjpbZnVuY3Rpb24oYSxiKXtiLmV4cG9ydHM9e2luaXQ6ZnVuY3Rpb24oYSxiKXtyZXR1cm4gdGhpcy5jb25maWc9YSx0aGlzLmRvY3VtZW50PWJ9LGNyZWF0ZUNvb2tpZTpmdW5jdGlvbihhLGIsYyl7dmFyIGQ7dGhpcy5lcmFzZUNvb2tpZShhKSxkPW5ldyBEYXRlLGQuc2V0VGltZShkLmdldFRpbWUoKSsxZTMqKGN8fDEyMDApKSxjPVwiOyBleHBpcmVzPVwiK2QudG9HTVRTdHJpbmcoKSx0aGlzLmRvY3VtZW50LmNvb2tpZT1hK1wiPVwiK2IrYytcIjsgcGF0aD0vXCJ9LHJlYWRDb29raWU6ZnVuY3Rpb24oYSl7dmFyIGIsYyxkLGU7Zm9yKGU9YStcIj1cIixjPXRoaXMuZG9jdW1lbnQuY29va2llLnNwbGl0KFwiO1wiKSxkPTA7ZDxjLmxlbmd0aDspe2ZvcihiPWNbZF07XCIgXCI9PT1iLmNoYXJBdCgwKTspYj1iLnN1YnN0cmluZygxLGIubGVuZ3RoKTtpZigwPT09Yi5pbmRleE9mKGUpKXJldHVybiBiLnN1YnN0cmluZyhlLmxlbmd0aCxiLmxlbmd0aCk7ZCsrfXJldHVybiBudWxsfSxlcmFzZUNvb2tpZTpmdW5jdGlvbihhKXt2YXIgYjtiPW5ldyBEYXRlLGIuc2V0VGltZShiLmdldFRpbWUoKS04NjRlNSksdGhpcy5kb2N1bWVudC5jb29raWU9YStcIj07IGV4cGlyZXM9XCIrYi50b0dNVFN0cmluZygpK1wiOyBwYXRoPS9cIn19fSx7fV0sNzpbZnVuY3Rpb24oYSxiKXt2YXIgYyxkO2Q9MCxjPVwiXCIsYi5leHBvcnRzPXtoZXhfc2hhMTpmdW5jdGlvbihhKXtyZXR1cm4gdGhpcy5yc3RyMmhleCh0aGlzLnJzdHJfc2hhMSh0aGlzLnN0cjJyc3RyX3V0ZjgoYSkpKX0sYjY0X3NoYTE6ZnVuY3Rpb24oYSl7cmV0dXJuIHRoaXMucnN0cjJiNjQodGhpcy5yc3RyX3NoYTEodGhpcy5zdHIycnN0cl91dGY4KGEpKSl9LGFueV9zaGExOmZ1bmN0aW9uKGEsYil7cmV0dXJuIHRoaXMucnN0cjJhbnkodGhpcy5yc3RyX3NoYTEodGhpcy5zdHIycnN0cl91dGY4KGEpKSxiKX0saGV4X2htYWNfc2hhMTpmdW5jdGlvbihhLGIpe3JldHVybiB0aGlzLnJzdHIyaGV4KHRoaXMucnN0cl9obWFjX3NoYTEodGhpcy5zdHIycnN0cl91dGY4KGEpLHRoaXMuc3RyMnJzdHJfdXRmOChiKSkpfSxiNjRfaG1hY19zaGExOmZ1bmN0aW9uKGEsYil7cmV0dXJuIHRoaXMucnN0cjJiNjQodGhpcy5yc3RyX2htYWNfc2hhMSh0aGlzLnN0cjJyc3RyX3V0ZjgoYSksdGhpcy5zdHIycnN0cl91dGY4KGIpKSl9LGFueV9obWFjX3NoYTE6ZnVuY3Rpb24oYSxiLGMpe3JldHVybiB0aGlzLnJzdHIyYW55KHRoaXMucnN0cl9obWFjX3NoYTEodGhpcy5zdHIycnN0cl91dGY4KGEpLHRoaXMuc3RyMnJzdHJfdXRmOChiKSksYyl9LHNoYTFfdm1fdGVzdDpmdW5jdGlvbigpe3JldHVyblwiYTk5OTNlMzY0NzA2ODE2YWJhM2UyNTcxNzg1MGMyNmM5Y2QwZDg5ZFwiPT09dGhpc2hleF9zaGExKFwiYWJjXCIpLnRvTG93ZXJDYXNlKCl9LHJzdHJfc2hhMTpmdW5jdGlvbihhKXtyZXR1cm4gdGhpcy5iaW5iMnJzdHIodGhpcy5iaW5iX3NoYTEodGhpcy5yc3RyMmJpbmIoYSksOCphLmxlbmd0aCkpfSxyc3RyX2htYWNfc2hhMTpmdW5jdGlvbihhLGIpe3ZhciBjLGQsZSxmLGc7Zm9yKGM9dGhpcy5yc3RyMmJpbmIoYSksYy5sZW5ndGg+MTYmJihjPXRoaXMuYmluYl9zaGExKGMsOCphLmxlbmd0aCkpLGY9QXJyYXkoMTYpLGc9QXJyYXkoMTYpLGU9MDsxNj5lOylmW2VdPTkwOTUyMjQ4Nl5jW2VdLGdbZV09MTU0OTU1NjgyOF5jW2VdLGUrKztyZXR1cm4gZD10aGlzLmJpbmJfc2hhMShmLmNvbmNhdCh0aGlzLnJzdHIyYmluYihiKSksNTEyKzgqYi5sZW5ndGgpLHRoaXMuYmluYjJyc3RyKHRoaXMuYmluYl9zaGExKGcuY29uY2F0KGQpLDY3MikpfSxyc3RyMmhleDpmdW5jdGlvbihhKXt2YXIgYixjLGUsZixnO3RyeXt9Y2F0Y2goaCl7Yj1oLGQ9MH1mb3IoYz1kP1wiMDEyMzQ1Njc4OUFCQ0RFRlwiOlwiMDEyMzQ1Njc4OWFiY2RlZlwiLGY9XCJcIixnPXZvaWQgMCxlPTA7ZTxhLmxlbmd0aDspZz1hLmNoYXJDb2RlQXQoZSksZis9Yy5jaGFyQXQoZz4+PjQmMTUpK2MuY2hhckF0KDE1JmcpLGUrKztyZXR1cm4gZn0scnN0cjJiNjQ6ZnVuY3Rpb24oYSl7dmFyIGIsZCxlLGYsZyxoLGk7dHJ5e31jYXRjaChqKXtiPWosYz1cIlwifWZvcihoPVwiQUJDREVGR0hJSktMTU5PUFFSU1RVVldYWVphYmNkZWZnaGlqa2xtbm9wcXJzdHV2d3h5ejAxMjM0NTY3ODkrL1wiLGc9XCJcIixmPWEubGVuZ3RoLGQ9MDtmPmQ7KXtmb3IoaT1hLmNoYXJDb2RlQXQoZCk8PDE2fChmPmQrMT9hLmNoYXJDb2RlQXQoZCsxKTw8ODowKXwoZj5kKzI/YS5jaGFyQ29kZUF0KGQrMik6MCksZT0wOzQ+ZTspZys9OCpkKzYqZT44KmEubGVuZ3RoP2M6aC5jaGFyQXQoaT4+PjYqKDMtZSkmNjMpLGUrKztkKz0zfXJldHVybiBnfSxyc3RyMmFueTpmdW5jdGlvbihhLGIpe3ZhciBjLGQsZSxmLGcsaCxpLGosaztmb3IoZD1iLmxlbmd0aCxqPUFycmF5KCksZj12b2lkIDAsaD12b2lkIDAsaz12b2lkIDAsaT12b2lkIDAsYz1BcnJheShNYXRoLmNlaWwoYS5sZW5ndGgvMikpLGY9MDtmPGMubGVuZ3RoOyljW2ZdPWEuY2hhckNvZGVBdCgyKmYpPDw4fGEuY2hhckNvZGVBdCgyKmYrMSksZisrO2Zvcig7Yy5sZW5ndGg+MDspe2ZvcihpPUFycmF5KCksaz0wLGY9MDtmPGMubGVuZ3RoOylrPShrPDwxNikrY1tmXSxoPU1hdGguZmxvb3Ioay9kKSxrLT1oKmQsKGkubGVuZ3RoPjB8fGg+MCkmJihpW2kubGVuZ3RoXT1oKSxmKys7altqLmxlbmd0aF09ayxjPWl9Zm9yKGc9XCJcIixmPWoubGVuZ3RoLTE7Zj49MDspZys9Yi5jaGFyQXQoaltmXSksZi0tO2ZvcihlPU1hdGguY2VpbCg4KmEubGVuZ3RoLyhNYXRoLmxvZyhiLmxlbmd0aCkvTWF0aC5sb2coMikpKSxmPWcubGVuZ3RoO2U+ZjspZz1iWzBdK2csZisrO3JldHVybiBnfSxzdHIycnN0cl91dGY4OmZ1bmN0aW9uKGEpe3ZhciBiLGMsZCxlO2ZvcihjPVwiXCIsYj0tMSxkPXZvaWQgMCxlPXZvaWQgMDsrK2I8YS5sZW5ndGg7KWQ9YS5jaGFyQ29kZUF0KGIpLGU9YisxPGEubGVuZ3RoP2EuY2hhckNvZGVBdChiKzEpOjAsZD49NTUyOTYmJjU2MzE5Pj1kJiZlPj01NjMyMCYmNTczNDM+PWUmJihkPTY1NTM2KygoMTAyMyZkKTw8MTApKygxMDIzJmUpLGIrKyksMTI3Pj1kP2MrPVN0cmluZy5mcm9tQ2hhckNvZGUoZCk6MjA0Nz49ZD9jKz1TdHJpbmcuZnJvbUNoYXJDb2RlKDE5MnxkPj4+NiYzMSwxMjh8NjMmZCk6NjU1MzU+PWQ/Yys9U3RyaW5nLmZyb21DaGFyQ29kZSgyMjR8ZD4+PjEyJjE1LDEyOHxkPj4+NiY2MywxMjh8NjMmZCk6MjA5NzE1MT49ZCYmKGMrPVN0cmluZy5mcm9tQ2hhckNvZGUoMjQwfGQ+Pj4xOCY3LDEyOHxkPj4+MTImNjMsMTI4fGQ+Pj42JjYzLDEyOHw2MyZkKSk7cmV0dXJuIGN9LHN0cjJyc3RyX3V0ZjE2bGU6ZnVuY3Rpb24oYSl7dmFyIGIsYztmb3IoYz1cIlwiLGI9MDtiPGEubGVuZ3RoOyljKz1TdHJpbmcuZnJvbUNoYXJDb2RlKDI1NSZhLmNoYXJDb2RlQXQoYiksYS5jaGFyQ29kZUF0KGIpPj4+OCYyNTUpLGIrKztyZXR1cm4gY30sc3RyMnJzdHJfdXRmMTZiZTpmdW5jdGlvbihhKXt2YXIgYixjO2ZvcihjPVwiXCIsYj0wO2I8YS5sZW5ndGg7KWMrPVN0cmluZy5mcm9tQ2hhckNvZGUoYS5jaGFyQ29kZUF0KGIpPj4+OCYyNTUsMjU1JmEuY2hhckNvZGVBdChiKSksYisrO3JldHVybiBjfSxyc3RyMmJpbmI6ZnVuY3Rpb24oYSl7dmFyIGIsYztmb3IoYz1BcnJheShhLmxlbmd0aD4+MiksYj0wO2I8Yy5sZW5ndGg7KWNbYl09MCxiKys7Zm9yKGI9MDtiPDgqYS5sZW5ndGg7KWNbYj4+NV18PSgyNTUmYS5jaGFyQ29kZUF0KGIvOCkpPDwyNC1iJTMyLGIrPTg7cmV0dXJuIGN9LGJpbmIycnN0cjpmdW5jdGlvbihhKXt2YXIgYixjO2ZvcihjPVwiXCIsYj0wO2I8MzIqYS5sZW5ndGg7KWMrPVN0cmluZy5mcm9tQ2hhckNvZGUoYVtiPj41XT4+PjI0LWIlMzImMjU1KSxiKz04O3JldHVybiBjfSxiaW5iX3NoYTE6ZnVuY3Rpb24oYSxiKXt2YXIgYyxkLGUsZixnLGgsaSxqLGssbCxtLG4sbyxwO2ZvcihhW2I+PjVdfD0xMjg8PDI0LWIlMzIsYVsoYis2ND4+OTw8NCkrMTVdPWIscD1BcnJheSg4MCksYz0xNzMyNTg0MTkzLGQ9LTI3MTczMzg3OSxlPS0xNzMyNTg0MTk0LGY9MjcxNzMzODc4LGc9LTEwMDk1ODk3NzYsaD0wO2g8YS5sZW5ndGg7KXtmb3Ioaj1jLGs9ZCxsPWUsbT1mLG49ZyxpPTA7ODA+aTspcFtpXT0xNj5pP2FbaCtpXTp0aGlzLmJpdF9yb2wocFtpLTNdXnBbaS04XV5wW2ktMTRdXnBbaS0xNl0sMSksbz10aGlzLnNhZmVfYWRkKHRoaXMuc2FmZV9hZGQodGhpcy5iaXRfcm9sKGMsNSksdGhpcy5zaGExX2Z0KGksZCxlLGYpKSx0aGlzLnNhZmVfYWRkKHRoaXMuc2FmZV9hZGQoZyxwW2ldKSx0aGlzLnNoYTFfa3QoaSkpKSxnPWYsZj1lLGU9dGhpcy5iaXRfcm9sKGQsMzApLGQ9YyxjPW8saSsrO2M9dGhpcy5zYWZlX2FkZChjLGopLGQ9dGhpcy5zYWZlX2FkZChkLGspLGU9dGhpcy5zYWZlX2FkZChlLGwpLGY9dGhpcy5zYWZlX2FkZChmLG0pLGc9dGhpcy5zYWZlX2FkZChnLG4pLGgrPTE2fXJldHVybiBBcnJheShjLGQsZSxmLGcpfSxzaGExX2Z0OmZ1bmN0aW9uKGEsYixjLGQpe3JldHVybiAyMD5hP2ImY3x+YiZkOjQwPmE/Yl5jXmQ6NjA+YT9iJmN8YiZkfGMmZDpiXmNeZH0sc2hhMV9rdDpmdW5jdGlvbihhKXtyZXR1cm4gMjA+YT8xNTE4NTAwMjQ5OjQwPmE/MTg1OTc3NTM5Mzo2MD5hPy0xODk0MDA3NTg4Oi04OTk0OTc1MTR9LHNhZmVfYWRkOmZ1bmN0aW9uKGEsYil7dmFyIGMsZDtyZXR1cm4gYz0oNjU1MzUmYSkrKDY1NTM1JmIpLGQ9KGE+PjE2KSsoYj4+MTYpKyhjPj4xNiksZDw8MTZ8NjU1MzUmY30sYml0X3JvbDpmdW5jdGlvbihhLGIpe3JldHVybiBhPDxifGE+Pj4zMi1ifSxjcmVhdGVfaGFzaDpmdW5jdGlvbigpe3ZhciBhO3JldHVybiBhPXRoaXMuYjY0X3NoYTEoKG5ldyBEYXRlKS5nZXRUaW1lKCkrXCI6XCIrTWF0aC5mbG9vcig5OTk5OTk5Kk1hdGgucmFuZG9tKCkpKSxhLnJlcGxhY2UoL1xcKy9nLFwiLVwiKS5yZXBsYWNlKC9cXC8vZyxcIl9cIikucmVwbGFjZSgvXFw9KyQvLFwiXCIpfX19LHt9XSw4OltmdW5jdGlvbihhLGIpe2IuZXhwb3J0cz1mdW5jdGlvbihhKXtyZXR1cm57Z2V0QWJzVXJsOmZ1bmN0aW9uKGIpe3ZhciBjO3JldHVybiBiLm1hdGNoKC9eLnsyLDV9OlxcL1xcLy8pP2I6XCIvXCI9PT1iWzBdP2EubG9jYXRpb24ucHJvdG9jb2wrXCIvL1wiK2EubG9jYXRpb24uaG9zdCtiOihjPWEubG9jYXRpb24ucHJvdG9jb2wrXCIvL1wiK2EubG9jYXRpb24uaG9zdCthLmxvY2F0aW9uLnBhdGhuYW1lLFwiL1wiIT09Y1tjLmxlbmd0aC0xXSYmXCIjXCIhPT1iWzBdP2MrXCIvXCIrYjpjK2IpfSxyZXBsYWNlUGFyYW06ZnVuY3Rpb24oYSxiLGMpe3JldHVybiBhPWEucmVwbGFjZSgvXFx7XFx7KC4qPylcXH1cXH0vZyxmdW5jdGlvbihhLGMpe3JldHVybiBiW2NdfHxcIlwifSksYyYmKGE9YS5yZXBsYWNlKC9cXHsoLio/KVxcfS9nLGZ1bmN0aW9uKGEsYil7cmV0dXJuIGNbYl18fFwiXCJ9KSksYX19fX0se31dfSx7fSxbNF0pOyIsImFuZ3VsYXIubW9kdWxlKCd1aS5ib290c3RyYXAucGFnaW5hdGlvbicsIFtdKVxuXG4uY29udHJvbGxlcignUGFnaW5hdGlvbkNvbnRyb2xsZXInLCBbJyRzY29wZScsICckYXR0cnMnLCAnJHBhcnNlJywgZnVuY3Rpb24gKCRzY29wZSwgJGF0dHJzLCAkcGFyc2UpIHtcbiAgdmFyIHNlbGYgPSB0aGlzLFxuICAgICAgbmdNb2RlbEN0cmwgPSB7ICRzZXRWaWV3VmFsdWU6IGFuZ3VsYXIubm9vcCB9LCAvLyBudWxsTW9kZWxDdHJsXG4gICAgICBzZXROdW1QYWdlcyA9ICRhdHRycy5udW1QYWdlcyA/ICRwYXJzZSgkYXR0cnMubnVtUGFnZXMpLmFzc2lnbiA6IGFuZ3VsYXIubm9vcDtcblxuICB0aGlzLmluaXQgPSBmdW5jdGlvbihuZ01vZGVsQ3RybF8sIGNvbmZpZykge1xuICAgIG5nTW9kZWxDdHJsID0gbmdNb2RlbEN0cmxfO1xuICAgIHRoaXMuY29uZmlnID0gY29uZmlnO1xuXG4gICAgbmdNb2RlbEN0cmwuJHJlbmRlciA9IGZ1bmN0aW9uKCkge1xuICAgICAgc2VsZi5yZW5kZXIoKTtcbiAgICB9O1xuXG4gICAgaWYgKCRhdHRycy5pdGVtc1BlclBhZ2UpIHtcbiAgICAgICRzY29wZS4kcGFyZW50LiR3YXRjaCgkcGFyc2UoJGF0dHJzLml0ZW1zUGVyUGFnZSksIGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgIHNlbGYuaXRlbXNQZXJQYWdlID0gcGFyc2VJbnQodmFsdWUsIDEwKTtcbiAgICAgICAgJHNjb3BlLnRvdGFsUGFnZXMgPSBzZWxmLmNhbGN1bGF0ZVRvdGFsUGFnZXMoKTtcbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLml0ZW1zUGVyUGFnZSA9IGNvbmZpZy5pdGVtc1BlclBhZ2U7XG4gICAgfVxuICB9O1xuXG4gIHRoaXMuY2FsY3VsYXRlVG90YWxQYWdlcyA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciB0b3RhbFBhZ2VzID0gdGhpcy5pdGVtc1BlclBhZ2UgPCAxID8gMSA6IE1hdGguY2VpbCgkc2NvcGUudG90YWxJdGVtcyAvIHRoaXMuaXRlbXNQZXJQYWdlKTtcbiAgICByZXR1cm4gTWF0aC5tYXgodG90YWxQYWdlcyB8fCAwLCAxKTtcbiAgfTtcblxuICB0aGlzLnJlbmRlciA9IGZ1bmN0aW9uKCkge1xuICAgICRzY29wZS5wYWdlID0gcGFyc2VJbnQobmdNb2RlbEN0cmwuJHZpZXdWYWx1ZSwgMTApIHx8IDE7XG4gIH07XG5cbiAgJHNjb3BlLnNlbGVjdFBhZ2UgPSBmdW5jdGlvbihwYWdlKSB7XG4gICAgaWYgKCAkc2NvcGUucGFnZSAhPT0gcGFnZSAmJiBwYWdlID4gMCAmJiBwYWdlIDw9ICRzY29wZS50b3RhbFBhZ2VzKSB7XG4gICAgICBuZ01vZGVsQ3RybC4kc2V0Vmlld1ZhbHVlKHBhZ2UpO1xuICAgICAgbmdNb2RlbEN0cmwuJHJlbmRlcigpO1xuICAgIH1cbiAgfTtcblxuICAkc2NvcGUuZ2V0VGV4dCA9IGZ1bmN0aW9uKCBrZXkgKSB7XG4gICAgcmV0dXJuICRzY29wZVtrZXkgKyAnVGV4dCddIHx8IHNlbGYuY29uZmlnW2tleSArICdUZXh0J107XG4gIH07XG4gICRzY29wZS5ub1ByZXZpb3VzID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuICRzY29wZS5wYWdlID09PSAxO1xuICB9O1xuICAkc2NvcGUubm9OZXh0ID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuICRzY29wZS5wYWdlID09PSAkc2NvcGUudG90YWxQYWdlcztcbiAgfTtcblxuICAkc2NvcGUuJHdhdGNoKCd0b3RhbEl0ZW1zJywgZnVuY3Rpb24oKSB7XG4gICAgJHNjb3BlLnRvdGFsUGFnZXMgPSBzZWxmLmNhbGN1bGF0ZVRvdGFsUGFnZXMoKTtcbiAgfSk7XG5cbiAgJHNjb3BlLiR3YXRjaCgndG90YWxQYWdlcycsIGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgc2V0TnVtUGFnZXMoJHNjb3BlLiRwYXJlbnQsIHZhbHVlKTsgLy8gUmVhZG9ubHkgdmFyaWFibGVcblxuICAgIGlmICggJHNjb3BlLnBhZ2UgPiB2YWx1ZSApIHtcbiAgICAgICRzY29wZS5zZWxlY3RQYWdlKHZhbHVlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgbmdNb2RlbEN0cmwuJHJlbmRlcigpO1xuICAgIH1cbiAgfSk7XG59XSlcblxuLmNvbnN0YW50KCdwYWdpbmF0aW9uQ29uZmlnJywge1xuICBpdGVtc1BlclBhZ2U6IDEwLFxuICBib3VuZGFyeUxpbmtzOiBmYWxzZSxcbiAgZGlyZWN0aW9uTGlua3M6IHRydWUsXG4gIGZpcnN0VGV4dDogJ0ZpcnN0JyxcbiAgcHJldmlvdXNUZXh0OiAnUHJldmlvdXMnLFxuICBuZXh0VGV4dDogJ05leHQnLFxuICBsYXN0VGV4dDogJ0xhc3QnLFxuICByb3RhdGU6IHRydWVcbn0pXG5cbi5kaXJlY3RpdmUoJ3BhZ2luYXRpb24nLCBbJyRwYXJzZScsICdwYWdpbmF0aW9uQ29uZmlnJywgZnVuY3Rpb24oJHBhcnNlLCBwYWdpbmF0aW9uQ29uZmlnKSB7XG4gIHJldHVybiB7XG4gICAgcmVzdHJpY3Q6ICdFQScsXG4gICAgc2NvcGU6IHtcbiAgICAgIHRvdGFsSXRlbXM6ICc9JyxcbiAgICAgIGZpcnN0VGV4dDogJ0AnLFxuICAgICAgcHJldmlvdXNUZXh0OiAnQCcsXG4gICAgICBuZXh0VGV4dDogJ0AnLFxuICAgICAgbGFzdFRleHQ6ICdAJ1xuICAgIH0sXG4gICAgcmVxdWlyZTogWydwYWdpbmF0aW9uJywgJz9uZ01vZGVsJ10sXG4gICAgY29udHJvbGxlcjogJ1BhZ2luYXRpb25Db250cm9sbGVyJyxcbiAgICB0ZW1wbGF0ZVVybDogJ3RlbXBsYXRlL3BhZ2luYXRpb24vcGFnaW5hdGlvbi5odG1sJyxcbiAgICByZXBsYWNlOiB0cnVlLFxuICAgIGxpbms6IGZ1bmN0aW9uKHNjb3BlLCBlbGVtZW50LCBhdHRycywgY3RybHMpIHtcbiAgICAgIHZhciBwYWdpbmF0aW9uQ3RybCA9IGN0cmxzWzBdLCBuZ01vZGVsQ3RybCA9IGN0cmxzWzFdO1xuXG4gICAgICBpZiAoIW5nTW9kZWxDdHJsKSB7XG4gICAgICAgICByZXR1cm47IC8vIGRvIG5vdGhpbmcgaWYgbm8gbmctbW9kZWxcbiAgICAgIH1cblxuICAgICAgLy8gU2V0dXAgY29uZmlndXJhdGlvbiBwYXJhbWV0ZXJzXG4gICAgICB2YXIgbWF4U2l6ZSA9IGFuZ3VsYXIuaXNEZWZpbmVkKGF0dHJzLm1heFNpemUpID8gc2NvcGUuJHBhcmVudC4kZXZhbChhdHRycy5tYXhTaXplKSA6IHBhZ2luYXRpb25Db25maWcubWF4U2l6ZSxcbiAgICAgICAgICByb3RhdGUgPSBhbmd1bGFyLmlzRGVmaW5lZChhdHRycy5yb3RhdGUpID8gc2NvcGUuJHBhcmVudC4kZXZhbChhdHRycy5yb3RhdGUpIDogcGFnaW5hdGlvbkNvbmZpZy5yb3RhdGU7XG4gICAgICBzY29wZS5ib3VuZGFyeUxpbmtzID0gYW5ndWxhci5pc0RlZmluZWQoYXR0cnMuYm91bmRhcnlMaW5rcykgPyBzY29wZS4kcGFyZW50LiRldmFsKGF0dHJzLmJvdW5kYXJ5TGlua3MpIDogcGFnaW5hdGlvbkNvbmZpZy5ib3VuZGFyeUxpbmtzO1xuICAgICAgc2NvcGUuZGlyZWN0aW9uTGlua3MgPSBhbmd1bGFyLmlzRGVmaW5lZChhdHRycy5kaXJlY3Rpb25MaW5rcykgPyBzY29wZS4kcGFyZW50LiRldmFsKGF0dHJzLmRpcmVjdGlvbkxpbmtzKSA6IHBhZ2luYXRpb25Db25maWcuZGlyZWN0aW9uTGlua3M7XG5cbiAgICAgIHBhZ2luYXRpb25DdHJsLmluaXQobmdNb2RlbEN0cmwsIHBhZ2luYXRpb25Db25maWcpO1xuXG4gICAgICBpZiAoYXR0cnMubWF4U2l6ZSkge1xuICAgICAgICBzY29wZS4kcGFyZW50LiR3YXRjaCgkcGFyc2UoYXR0cnMubWF4U2l6ZSksIGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgICAgbWF4U2l6ZSA9IHBhcnNlSW50KHZhbHVlLCAxMCk7XG4gICAgICAgICAgcGFnaW5hdGlvbkN0cmwucmVuZGVyKCk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgICAvLyBDcmVhdGUgcGFnZSBvYmplY3QgdXNlZCBpbiB0ZW1wbGF0ZVxuICAgICAgZnVuY3Rpb24gbWFrZVBhZ2UobnVtYmVyLCB0ZXh0LCBpc0FjdGl2ZSkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIG51bWJlcjogbnVtYmVyLFxuICAgICAgICAgIHRleHQ6IHRleHQsXG4gICAgICAgICAgYWN0aXZlOiBpc0FjdGl2ZVxuICAgICAgICB9O1xuICAgICAgfVxuXG4gICAgICBmdW5jdGlvbiBnZXRQYWdlcyhjdXJyZW50UGFnZSwgdG90YWxQYWdlcykge1xuICAgICAgICB2YXIgcGFnZXMgPSBbXTtcblxuICAgICAgICAvLyBEZWZhdWx0IHBhZ2UgbGltaXRzXG4gICAgICAgIHZhciBzdGFydFBhZ2UgPSAxLCBlbmRQYWdlID0gdG90YWxQYWdlcztcbiAgICAgICAgdmFyIGlzTWF4U2l6ZWQgPSAoIGFuZ3VsYXIuaXNEZWZpbmVkKG1heFNpemUpICYmIG1heFNpemUgPCB0b3RhbFBhZ2VzICk7XG5cbiAgICAgICAgLy8gcmVjb21wdXRlIGlmIG1heFNpemVcbiAgICAgICAgaWYgKCBpc01heFNpemVkICkge1xuICAgICAgICAgIGlmICggcm90YXRlICkge1xuICAgICAgICAgICAgLy8gQ3VycmVudCBwYWdlIGlzIGRpc3BsYXllZCBpbiB0aGUgbWlkZGxlIG9mIHRoZSB2aXNpYmxlIG9uZXNcbiAgICAgICAgICAgIHN0YXJ0UGFnZSA9IE1hdGgubWF4KGN1cnJlbnRQYWdlIC0gTWF0aC5mbG9vcihtYXhTaXplLzIpLCAxKTtcbiAgICAgICAgICAgIGVuZFBhZ2UgICA9IHN0YXJ0UGFnZSArIG1heFNpemUgLSAxO1xuXG4gICAgICAgICAgICAvLyBBZGp1c3QgaWYgbGltaXQgaXMgZXhjZWVkZWRcbiAgICAgICAgICAgIGlmIChlbmRQYWdlID4gdG90YWxQYWdlcykge1xuICAgICAgICAgICAgICBlbmRQYWdlICAgPSB0b3RhbFBhZ2VzO1xuICAgICAgICAgICAgICBzdGFydFBhZ2UgPSBlbmRQYWdlIC0gbWF4U2l6ZSArIDE7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIFZpc2libGUgcGFnZXMgYXJlIHBhZ2luYXRlZCB3aXRoIG1heFNpemVcbiAgICAgICAgICAgIHN0YXJ0UGFnZSA9ICgoTWF0aC5jZWlsKGN1cnJlbnRQYWdlIC8gbWF4U2l6ZSkgLSAxKSAqIG1heFNpemUpICsgMTtcblxuICAgICAgICAgICAgLy8gQWRqdXN0IGxhc3QgcGFnZSBpZiBsaW1pdCBpcyBleGNlZWRlZFxuICAgICAgICAgICAgZW5kUGFnZSA9IE1hdGgubWluKHN0YXJ0UGFnZSArIG1heFNpemUgLSAxLCB0b3RhbFBhZ2VzKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyBBZGQgcGFnZSBudW1iZXIgbGlua3NcbiAgICAgICAgZm9yICh2YXIgbnVtYmVyID0gc3RhcnRQYWdlOyBudW1iZXIgPD0gZW5kUGFnZTsgbnVtYmVyKyspIHtcbiAgICAgICAgICB2YXIgcGFnZSA9IG1ha2VQYWdlKG51bWJlciwgbnVtYmVyLCBudW1iZXIgPT09IGN1cnJlbnRQYWdlKTtcbiAgICAgICAgICBwYWdlcy5wdXNoKHBhZ2UpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gQWRkIGxpbmtzIHRvIG1vdmUgYmV0d2VlbiBwYWdlIHNldHNcbiAgICAgICAgaWYgKCBpc01heFNpemVkICYmICEgcm90YXRlICkge1xuICAgICAgICAgIGlmICggc3RhcnRQYWdlID4gMSApIHtcbiAgICAgICAgICAgIHZhciBwcmV2aW91c1BhZ2VTZXQgPSBtYWtlUGFnZShzdGFydFBhZ2UgLSAxLCAnLi4uJywgZmFsc2UpO1xuICAgICAgICAgICAgcGFnZXMudW5zaGlmdChwcmV2aW91c1BhZ2VTZXQpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmICggZW5kUGFnZSA8IHRvdGFsUGFnZXMgKSB7XG4gICAgICAgICAgICB2YXIgbmV4dFBhZ2VTZXQgPSBtYWtlUGFnZShlbmRQYWdlICsgMSwgJy4uLicsIGZhbHNlKTtcbiAgICAgICAgICAgIHBhZ2VzLnB1c2gobmV4dFBhZ2VTZXQpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBwYWdlcztcbiAgICAgIH1cblxuICAgICAgdmFyIG9yaWdpbmFsUmVuZGVyID0gcGFnaW5hdGlvbkN0cmwucmVuZGVyO1xuICAgICAgcGFnaW5hdGlvbkN0cmwucmVuZGVyID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIG9yaWdpbmFsUmVuZGVyKCk7XG4gICAgICAgIGlmIChzY29wZS5wYWdlID4gMCAmJiBzY29wZS5wYWdlIDw9IHNjb3BlLnRvdGFsUGFnZXMpIHtcbiAgICAgICAgICBzY29wZS5wYWdlcyA9IGdldFBhZ2VzKHNjb3BlLnBhZ2UsIHNjb3BlLnRvdGFsUGFnZXMpO1xuICAgICAgICB9XG4gICAgICB9O1xuICAgIH1cbiAgfTtcbn1dKVxuXG4uY29uc3RhbnQoJ3BhZ2VyQ29uZmlnJywge1xuICBpdGVtc1BlclBhZ2U6IDEwLFxuICBwcmV2aW91c1RleHQ6ICfCqyBQcmV2aW91cycsXG4gIG5leHRUZXh0OiAnTmV4dCDCuycsXG4gIGFsaWduOiB0cnVlXG59KVxuXG4uZGlyZWN0aXZlKCdwYWdlcicsIFsncGFnZXJDb25maWcnLCBmdW5jdGlvbihwYWdlckNvbmZpZykge1xuICByZXR1cm4ge1xuICAgIHJlc3RyaWN0OiAnRUEnLFxuICAgIHNjb3BlOiB7XG4gICAgICB0b3RhbEl0ZW1zOiAnPScsXG4gICAgICBwcmV2aW91c1RleHQ6ICdAJyxcbiAgICAgIG5leHRUZXh0OiAnQCdcbiAgICB9LFxuICAgIHJlcXVpcmU6IFsncGFnZXInLCAnP25nTW9kZWwnXSxcbiAgICBjb250cm9sbGVyOiAnUGFnaW5hdGlvbkNvbnRyb2xsZXInLFxuICAgIHRlbXBsYXRlVXJsOiAndGVtcGxhdGUvcGFnaW5hdGlvbi9wYWdlci5odG1sJyxcbiAgICByZXBsYWNlOiB0cnVlLFxuICAgIGxpbms6IGZ1bmN0aW9uKHNjb3BlLCBlbGVtZW50LCBhdHRycywgY3RybHMpIHtcbiAgICAgIHZhciBwYWdpbmF0aW9uQ3RybCA9IGN0cmxzWzBdLCBuZ01vZGVsQ3RybCA9IGN0cmxzWzFdO1xuXG4gICAgICBpZiAoIW5nTW9kZWxDdHJsKSB7XG4gICAgICAgICByZXR1cm47IC8vIGRvIG5vdGhpbmcgaWYgbm8gbmctbW9kZWxcbiAgICAgIH1cblxuICAgICAgc2NvcGUuYWxpZ24gPSBhbmd1bGFyLmlzRGVmaW5lZChhdHRycy5hbGlnbikgPyBzY29wZS4kcGFyZW50LiRldmFsKGF0dHJzLmFsaWduKSA6IHBhZ2VyQ29uZmlnLmFsaWduO1xuICAgICAgcGFnaW5hdGlvbkN0cmwuaW5pdChuZ01vZGVsQ3RybCwgcGFnZXJDb25maWcpO1xuICAgIH1cbiAgfTtcbn1dKTtcbiIsIi8vICAgICBVbmRlcnNjb3JlLmpzIDEuNi4wXG4vLyAgICAgaHR0cDovL3VuZGVyc2NvcmVqcy5vcmdcbi8vICAgICAoYykgMjAwOS0yMDE0IEplcmVteSBBc2hrZW5hcywgRG9jdW1lbnRDbG91ZCBhbmQgSW52ZXN0aWdhdGl2ZSBSZXBvcnRlcnMgJiBFZGl0b3JzXG4vLyAgICAgVW5kZXJzY29yZSBtYXkgYmUgZnJlZWx5IGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBNSVQgbGljZW5zZS5cblxuKGZ1bmN0aW9uKCkge1xuXG4gIC8vIEJhc2VsaW5lIHNldHVwXG4gIC8vIC0tLS0tLS0tLS0tLS0tXG5cbiAgLy8gRXN0YWJsaXNoIHRoZSByb290IG9iamVjdCwgYHdpbmRvd2AgaW4gdGhlIGJyb3dzZXIsIG9yIGBleHBvcnRzYCBvbiB0aGUgc2VydmVyLlxuICB2YXIgcm9vdCA9IHRoaXM7XG5cbiAgLy8gU2F2ZSB0aGUgcHJldmlvdXMgdmFsdWUgb2YgdGhlIGBfYCB2YXJpYWJsZS5cbiAgdmFyIHByZXZpb3VzVW5kZXJzY29yZSA9IHJvb3QuXztcblxuICAvLyBFc3RhYmxpc2ggdGhlIG9iamVjdCB0aGF0IGdldHMgcmV0dXJuZWQgdG8gYnJlYWsgb3V0IG9mIGEgbG9vcCBpdGVyYXRpb24uXG4gIHZhciBicmVha2VyID0ge307XG5cbiAgLy8gU2F2ZSBieXRlcyBpbiB0aGUgbWluaWZpZWQgKGJ1dCBub3QgZ3ppcHBlZCkgdmVyc2lvbjpcbiAgdmFyIEFycmF5UHJvdG8gPSBBcnJheS5wcm90b3R5cGUsIE9ialByb3RvID0gT2JqZWN0LnByb3RvdHlwZSwgRnVuY1Byb3RvID0gRnVuY3Rpb24ucHJvdG90eXBlO1xuXG4gIC8vIENyZWF0ZSBxdWljayByZWZlcmVuY2UgdmFyaWFibGVzIGZvciBzcGVlZCBhY2Nlc3MgdG8gY29yZSBwcm90b3R5cGVzLlxuICB2YXJcbiAgICBwdXNoICAgICAgICAgICAgID0gQXJyYXlQcm90by5wdXNoLFxuICAgIHNsaWNlICAgICAgICAgICAgPSBBcnJheVByb3RvLnNsaWNlLFxuICAgIGNvbmNhdCAgICAgICAgICAgPSBBcnJheVByb3RvLmNvbmNhdCxcbiAgICB0b1N0cmluZyAgICAgICAgID0gT2JqUHJvdG8udG9TdHJpbmcsXG4gICAgaGFzT3duUHJvcGVydHkgICA9IE9ialByb3RvLmhhc093blByb3BlcnR5O1xuXG4gIC8vIEFsbCAqKkVDTUFTY3JpcHQgNSoqIG5hdGl2ZSBmdW5jdGlvbiBpbXBsZW1lbnRhdGlvbnMgdGhhdCB3ZSBob3BlIHRvIHVzZVxuICAvLyBhcmUgZGVjbGFyZWQgaGVyZS5cbiAgdmFyXG4gICAgbmF0aXZlRm9yRWFjaCAgICAgID0gQXJyYXlQcm90by5mb3JFYWNoLFxuICAgIG5hdGl2ZU1hcCAgICAgICAgICA9IEFycmF5UHJvdG8ubWFwLFxuICAgIG5hdGl2ZVJlZHVjZSAgICAgICA9IEFycmF5UHJvdG8ucmVkdWNlLFxuICAgIG5hdGl2ZVJlZHVjZVJpZ2h0ICA9IEFycmF5UHJvdG8ucmVkdWNlUmlnaHQsXG4gICAgbmF0aXZlRmlsdGVyICAgICAgID0gQXJyYXlQcm90by5maWx0ZXIsXG4gICAgbmF0aXZlRXZlcnkgICAgICAgID0gQXJyYXlQcm90by5ldmVyeSxcbiAgICBuYXRpdmVTb21lICAgICAgICAgPSBBcnJheVByb3RvLnNvbWUsXG4gICAgbmF0aXZlSW5kZXhPZiAgICAgID0gQXJyYXlQcm90by5pbmRleE9mLFxuICAgIG5hdGl2ZUxhc3RJbmRleE9mICA9IEFycmF5UHJvdG8ubGFzdEluZGV4T2YsXG4gICAgbmF0aXZlSXNBcnJheSAgICAgID0gQXJyYXkuaXNBcnJheSxcbiAgICBuYXRpdmVLZXlzICAgICAgICAgPSBPYmplY3Qua2V5cyxcbiAgICBuYXRpdmVCaW5kICAgICAgICAgPSBGdW5jUHJvdG8uYmluZDtcblxuICAvLyBDcmVhdGUgYSBzYWZlIHJlZmVyZW5jZSB0byB0aGUgVW5kZXJzY29yZSBvYmplY3QgZm9yIHVzZSBiZWxvdy5cbiAgdmFyIF8gPSBmdW5jdGlvbihvYmopIHtcbiAgICBpZiAob2JqIGluc3RhbmNlb2YgXykgcmV0dXJuIG9iajtcbiAgICBpZiAoISh0aGlzIGluc3RhbmNlb2YgXykpIHJldHVybiBuZXcgXyhvYmopO1xuICAgIHRoaXMuX3dyYXBwZWQgPSBvYmo7XG4gIH07XG5cbiAgLy8gRXhwb3J0IHRoZSBVbmRlcnNjb3JlIG9iamVjdCBmb3IgKipOb2RlLmpzKiosIHdpdGhcbiAgLy8gYmFja3dhcmRzLWNvbXBhdGliaWxpdHkgZm9yIHRoZSBvbGQgYHJlcXVpcmUoKWAgQVBJLiBJZiB3ZSdyZSBpblxuICAvLyB0aGUgYnJvd3NlciwgYWRkIGBfYCBhcyBhIGdsb2JhbCBvYmplY3QgdmlhIGEgc3RyaW5nIGlkZW50aWZpZXIsXG4gIC8vIGZvciBDbG9zdXJlIENvbXBpbGVyIFwiYWR2YW5jZWRcIiBtb2RlLlxuICBpZiAodHlwZW9mIGV4cG9ydHMgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgaWYgKHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnICYmIG1vZHVsZS5leHBvcnRzKSB7XG4gICAgICBleHBvcnRzID0gbW9kdWxlLmV4cG9ydHMgPSBfO1xuICAgIH1cbiAgICBleHBvcnRzLl8gPSBfO1xuICB9IGVsc2Uge1xuICAgIHJvb3QuXyA9IF87XG4gIH1cblxuICAvLyBDdXJyZW50IHZlcnNpb24uXG4gIF8uVkVSU0lPTiA9ICcxLjYuMCc7XG5cbiAgLy8gQ29sbGVjdGlvbiBGdW5jdGlvbnNcbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAvLyBUaGUgY29ybmVyc3RvbmUsIGFuIGBlYWNoYCBpbXBsZW1lbnRhdGlvbiwgYWthIGBmb3JFYWNoYC5cbiAgLy8gSGFuZGxlcyBvYmplY3RzIHdpdGggdGhlIGJ1aWx0LWluIGBmb3JFYWNoYCwgYXJyYXlzLCBhbmQgcmF3IG9iamVjdHMuXG4gIC8vIERlbGVnYXRlcyB0byAqKkVDTUFTY3JpcHQgNSoqJ3MgbmF0aXZlIGBmb3JFYWNoYCBpZiBhdmFpbGFibGUuXG4gIHZhciBlYWNoID0gXy5lYWNoID0gXy5mb3JFYWNoID0gZnVuY3Rpb24ob2JqLCBpdGVyYXRvciwgY29udGV4dCkge1xuICAgIGlmIChvYmogPT0gbnVsbCkgcmV0dXJuIG9iajtcbiAgICBpZiAobmF0aXZlRm9yRWFjaCAmJiBvYmouZm9yRWFjaCA9PT0gbmF0aXZlRm9yRWFjaCkge1xuICAgICAgb2JqLmZvckVhY2goaXRlcmF0b3IsIGNvbnRleHQpO1xuICAgIH0gZWxzZSBpZiAob2JqLmxlbmd0aCA9PT0gK29iai5sZW5ndGgpIHtcbiAgICAgIGZvciAodmFyIGkgPSAwLCBsZW5ndGggPSBvYmoubGVuZ3RoOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgICAgaWYgKGl0ZXJhdG9yLmNhbGwoY29udGV4dCwgb2JqW2ldLCBpLCBvYmopID09PSBicmVha2VyKSByZXR1cm47XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHZhciBrZXlzID0gXy5rZXlzKG9iaik7XG4gICAgICBmb3IgKHZhciBpID0gMCwgbGVuZ3RoID0ga2V5cy5sZW5ndGg7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgICBpZiAoaXRlcmF0b3IuY2FsbChjb250ZXh0LCBvYmpba2V5c1tpXV0sIGtleXNbaV0sIG9iaikgPT09IGJyZWFrZXIpIHJldHVybjtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG9iajtcbiAgfTtcblxuICAvLyBSZXR1cm4gdGhlIHJlc3VsdHMgb2YgYXBwbHlpbmcgdGhlIGl0ZXJhdG9yIHRvIGVhY2ggZWxlbWVudC5cbiAgLy8gRGVsZWdhdGVzIHRvICoqRUNNQVNjcmlwdCA1KioncyBuYXRpdmUgYG1hcGAgaWYgYXZhaWxhYmxlLlxuICBfLm1hcCA9IF8uY29sbGVjdCA9IGZ1bmN0aW9uKG9iaiwgaXRlcmF0b3IsIGNvbnRleHQpIHtcbiAgICB2YXIgcmVzdWx0cyA9IFtdO1xuICAgIGlmIChvYmogPT0gbnVsbCkgcmV0dXJuIHJlc3VsdHM7XG4gICAgaWYgKG5hdGl2ZU1hcCAmJiBvYmoubWFwID09PSBuYXRpdmVNYXApIHJldHVybiBvYmoubWFwKGl0ZXJhdG9yLCBjb250ZXh0KTtcbiAgICBlYWNoKG9iaiwgZnVuY3Rpb24odmFsdWUsIGluZGV4LCBsaXN0KSB7XG4gICAgICByZXN1bHRzLnB1c2goaXRlcmF0b3IuY2FsbChjb250ZXh0LCB2YWx1ZSwgaW5kZXgsIGxpc3QpKTtcbiAgICB9KTtcbiAgICByZXR1cm4gcmVzdWx0cztcbiAgfTtcblxuICB2YXIgcmVkdWNlRXJyb3IgPSAnUmVkdWNlIG9mIGVtcHR5IGFycmF5IHdpdGggbm8gaW5pdGlhbCB2YWx1ZSc7XG5cbiAgLy8gKipSZWR1Y2UqKiBidWlsZHMgdXAgYSBzaW5nbGUgcmVzdWx0IGZyb20gYSBsaXN0IG9mIHZhbHVlcywgYWthIGBpbmplY3RgLFxuICAvLyBvciBgZm9sZGxgLiBEZWxlZ2F0ZXMgdG8gKipFQ01BU2NyaXB0IDUqKidzIG5hdGl2ZSBgcmVkdWNlYCBpZiBhdmFpbGFibGUuXG4gIF8ucmVkdWNlID0gXy5mb2xkbCA9IF8uaW5qZWN0ID0gZnVuY3Rpb24ob2JqLCBpdGVyYXRvciwgbWVtbywgY29udGV4dCkge1xuICAgIHZhciBpbml0aWFsID0gYXJndW1lbnRzLmxlbmd0aCA+IDI7XG4gICAgaWYgKG9iaiA9PSBudWxsKSBvYmogPSBbXTtcbiAgICBpZiAobmF0aXZlUmVkdWNlICYmIG9iai5yZWR1Y2UgPT09IG5hdGl2ZVJlZHVjZSkge1xuICAgICAgaWYgKGNvbnRleHQpIGl0ZXJhdG9yID0gXy5iaW5kKGl0ZXJhdG9yLCBjb250ZXh0KTtcbiAgICAgIHJldHVybiBpbml0aWFsID8gb2JqLnJlZHVjZShpdGVyYXRvciwgbWVtbykgOiBvYmoucmVkdWNlKGl0ZXJhdG9yKTtcbiAgICB9XG4gICAgZWFjaChvYmosIGZ1bmN0aW9uKHZhbHVlLCBpbmRleCwgbGlzdCkge1xuICAgICAgaWYgKCFpbml0aWFsKSB7XG4gICAgICAgIG1lbW8gPSB2YWx1ZTtcbiAgICAgICAgaW5pdGlhbCA9IHRydWU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBtZW1vID0gaXRlcmF0b3IuY2FsbChjb250ZXh0LCBtZW1vLCB2YWx1ZSwgaW5kZXgsIGxpc3QpO1xuICAgICAgfVxuICAgIH0pO1xuICAgIGlmICghaW5pdGlhbCkgdGhyb3cgbmV3IFR5cGVFcnJvcihyZWR1Y2VFcnJvcik7XG4gICAgcmV0dXJuIG1lbW87XG4gIH07XG5cbiAgLy8gVGhlIHJpZ2h0LWFzc29jaWF0aXZlIHZlcnNpb24gb2YgcmVkdWNlLCBhbHNvIGtub3duIGFzIGBmb2xkcmAuXG4gIC8vIERlbGVnYXRlcyB0byAqKkVDTUFTY3JpcHQgNSoqJ3MgbmF0aXZlIGByZWR1Y2VSaWdodGAgaWYgYXZhaWxhYmxlLlxuICBfLnJlZHVjZVJpZ2h0ID0gXy5mb2xkciA9IGZ1bmN0aW9uKG9iaiwgaXRlcmF0b3IsIG1lbW8sIGNvbnRleHQpIHtcbiAgICB2YXIgaW5pdGlhbCA9IGFyZ3VtZW50cy5sZW5ndGggPiAyO1xuICAgIGlmIChvYmogPT0gbnVsbCkgb2JqID0gW107XG4gICAgaWYgKG5hdGl2ZVJlZHVjZVJpZ2h0ICYmIG9iai5yZWR1Y2VSaWdodCA9PT0gbmF0aXZlUmVkdWNlUmlnaHQpIHtcbiAgICAgIGlmIChjb250ZXh0KSBpdGVyYXRvciA9IF8uYmluZChpdGVyYXRvciwgY29udGV4dCk7XG4gICAgICByZXR1cm4gaW5pdGlhbCA/IG9iai5yZWR1Y2VSaWdodChpdGVyYXRvciwgbWVtbykgOiBvYmoucmVkdWNlUmlnaHQoaXRlcmF0b3IpO1xuICAgIH1cbiAgICB2YXIgbGVuZ3RoID0gb2JqLmxlbmd0aDtcbiAgICBpZiAobGVuZ3RoICE9PSArbGVuZ3RoKSB7XG4gICAgICB2YXIga2V5cyA9IF8ua2V5cyhvYmopO1xuICAgICAgbGVuZ3RoID0ga2V5cy5sZW5ndGg7XG4gICAgfVxuICAgIGVhY2gob2JqLCBmdW5jdGlvbih2YWx1ZSwgaW5kZXgsIGxpc3QpIHtcbiAgICAgIGluZGV4ID0ga2V5cyA/IGtleXNbLS1sZW5ndGhdIDogLS1sZW5ndGg7XG4gICAgICBpZiAoIWluaXRpYWwpIHtcbiAgICAgICAgbWVtbyA9IG9ialtpbmRleF07XG4gICAgICAgIGluaXRpYWwgPSB0cnVlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbWVtbyA9IGl0ZXJhdG9yLmNhbGwoY29udGV4dCwgbWVtbywgb2JqW2luZGV4XSwgaW5kZXgsIGxpc3QpO1xuICAgICAgfVxuICAgIH0pO1xuICAgIGlmICghaW5pdGlhbCkgdGhyb3cgbmV3IFR5cGVFcnJvcihyZWR1Y2VFcnJvcik7XG4gICAgcmV0dXJuIG1lbW87XG4gIH07XG5cbiAgLy8gUmV0dXJuIHRoZSBmaXJzdCB2YWx1ZSB3aGljaCBwYXNzZXMgYSB0cnV0aCB0ZXN0LiBBbGlhc2VkIGFzIGBkZXRlY3RgLlxuICBfLmZpbmQgPSBfLmRldGVjdCA9IGZ1bmN0aW9uKG9iaiwgcHJlZGljYXRlLCBjb250ZXh0KSB7XG4gICAgdmFyIHJlc3VsdDtcbiAgICBhbnkob2JqLCBmdW5jdGlvbih2YWx1ZSwgaW5kZXgsIGxpc3QpIHtcbiAgICAgIGlmIChwcmVkaWNhdGUuY2FsbChjb250ZXh0LCB2YWx1ZSwgaW5kZXgsIGxpc3QpKSB7XG4gICAgICAgIHJlc3VsdCA9IHZhbHVlO1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9O1xuXG4gIC8vIFJldHVybiBhbGwgdGhlIGVsZW1lbnRzIHRoYXQgcGFzcyBhIHRydXRoIHRlc3QuXG4gIC8vIERlbGVnYXRlcyB0byAqKkVDTUFTY3JpcHQgNSoqJ3MgbmF0aXZlIGBmaWx0ZXJgIGlmIGF2YWlsYWJsZS5cbiAgLy8gQWxpYXNlZCBhcyBgc2VsZWN0YC5cbiAgXy5maWx0ZXIgPSBfLnNlbGVjdCA9IGZ1bmN0aW9uKG9iaiwgcHJlZGljYXRlLCBjb250ZXh0KSB7XG4gICAgdmFyIHJlc3VsdHMgPSBbXTtcbiAgICBpZiAob2JqID09IG51bGwpIHJldHVybiByZXN1bHRzO1xuICAgIGlmIChuYXRpdmVGaWx0ZXIgJiYgb2JqLmZpbHRlciA9PT0gbmF0aXZlRmlsdGVyKSByZXR1cm4gb2JqLmZpbHRlcihwcmVkaWNhdGUsIGNvbnRleHQpO1xuICAgIGVhY2gob2JqLCBmdW5jdGlvbih2YWx1ZSwgaW5kZXgsIGxpc3QpIHtcbiAgICAgIGlmIChwcmVkaWNhdGUuY2FsbChjb250ZXh0LCB2YWx1ZSwgaW5kZXgsIGxpc3QpKSByZXN1bHRzLnB1c2godmFsdWUpO1xuICAgIH0pO1xuICAgIHJldHVybiByZXN1bHRzO1xuICB9O1xuXG4gIC8vIFJldHVybiBhbGwgdGhlIGVsZW1lbnRzIGZvciB3aGljaCBhIHRydXRoIHRlc3QgZmFpbHMuXG4gIF8ucmVqZWN0ID0gZnVuY3Rpb24ob2JqLCBwcmVkaWNhdGUsIGNvbnRleHQpIHtcbiAgICByZXR1cm4gXy5maWx0ZXIob2JqLCBmdW5jdGlvbih2YWx1ZSwgaW5kZXgsIGxpc3QpIHtcbiAgICAgIHJldHVybiAhcHJlZGljYXRlLmNhbGwoY29udGV4dCwgdmFsdWUsIGluZGV4LCBsaXN0KTtcbiAgICB9LCBjb250ZXh0KTtcbiAgfTtcblxuICAvLyBEZXRlcm1pbmUgd2hldGhlciBhbGwgb2YgdGhlIGVsZW1lbnRzIG1hdGNoIGEgdHJ1dGggdGVzdC5cbiAgLy8gRGVsZWdhdGVzIHRvICoqRUNNQVNjcmlwdCA1KioncyBuYXRpdmUgYGV2ZXJ5YCBpZiBhdmFpbGFibGUuXG4gIC8vIEFsaWFzZWQgYXMgYGFsbGAuXG4gIF8uZXZlcnkgPSBfLmFsbCA9IGZ1bmN0aW9uKG9iaiwgcHJlZGljYXRlLCBjb250ZXh0KSB7XG4gICAgcHJlZGljYXRlIHx8IChwcmVkaWNhdGUgPSBfLmlkZW50aXR5KTtcbiAgICB2YXIgcmVzdWx0ID0gdHJ1ZTtcbiAgICBpZiAob2JqID09IG51bGwpIHJldHVybiByZXN1bHQ7XG4gICAgaWYgKG5hdGl2ZUV2ZXJ5ICYmIG9iai5ldmVyeSA9PT0gbmF0aXZlRXZlcnkpIHJldHVybiBvYmouZXZlcnkocHJlZGljYXRlLCBjb250ZXh0KTtcbiAgICBlYWNoKG9iaiwgZnVuY3Rpb24odmFsdWUsIGluZGV4LCBsaXN0KSB7XG4gICAgICBpZiAoIShyZXN1bHQgPSByZXN1bHQgJiYgcHJlZGljYXRlLmNhbGwoY29udGV4dCwgdmFsdWUsIGluZGV4LCBsaXN0KSkpIHJldHVybiBicmVha2VyO1xuICAgIH0pO1xuICAgIHJldHVybiAhIXJlc3VsdDtcbiAgfTtcblxuICAvLyBEZXRlcm1pbmUgaWYgYXQgbGVhc3Qgb25lIGVsZW1lbnQgaW4gdGhlIG9iamVjdCBtYXRjaGVzIGEgdHJ1dGggdGVzdC5cbiAgLy8gRGVsZWdhdGVzIHRvICoqRUNNQVNjcmlwdCA1KioncyBuYXRpdmUgYHNvbWVgIGlmIGF2YWlsYWJsZS5cbiAgLy8gQWxpYXNlZCBhcyBgYW55YC5cbiAgdmFyIGFueSA9IF8uc29tZSA9IF8uYW55ID0gZnVuY3Rpb24ob2JqLCBwcmVkaWNhdGUsIGNvbnRleHQpIHtcbiAgICBwcmVkaWNhdGUgfHwgKHByZWRpY2F0ZSA9IF8uaWRlbnRpdHkpO1xuICAgIHZhciByZXN1bHQgPSBmYWxzZTtcbiAgICBpZiAob2JqID09IG51bGwpIHJldHVybiByZXN1bHQ7XG4gICAgaWYgKG5hdGl2ZVNvbWUgJiYgb2JqLnNvbWUgPT09IG5hdGl2ZVNvbWUpIHJldHVybiBvYmouc29tZShwcmVkaWNhdGUsIGNvbnRleHQpO1xuICAgIGVhY2gob2JqLCBmdW5jdGlvbih2YWx1ZSwgaW5kZXgsIGxpc3QpIHtcbiAgICAgIGlmIChyZXN1bHQgfHwgKHJlc3VsdCA9IHByZWRpY2F0ZS5jYWxsKGNvbnRleHQsIHZhbHVlLCBpbmRleCwgbGlzdCkpKSByZXR1cm4gYnJlYWtlcjtcbiAgICB9KTtcbiAgICByZXR1cm4gISFyZXN1bHQ7XG4gIH07XG5cbiAgLy8gRGV0ZXJtaW5lIGlmIHRoZSBhcnJheSBvciBvYmplY3QgY29udGFpbnMgYSBnaXZlbiB2YWx1ZSAodXNpbmcgYD09PWApLlxuICAvLyBBbGlhc2VkIGFzIGBpbmNsdWRlYC5cbiAgXy5jb250YWlucyA9IF8uaW5jbHVkZSA9IGZ1bmN0aW9uKG9iaiwgdGFyZ2V0KSB7XG4gICAgaWYgKG9iaiA9PSBudWxsKSByZXR1cm4gZmFsc2U7XG4gICAgaWYgKG5hdGl2ZUluZGV4T2YgJiYgb2JqLmluZGV4T2YgPT09IG5hdGl2ZUluZGV4T2YpIHJldHVybiBvYmouaW5kZXhPZih0YXJnZXQpICE9IC0xO1xuICAgIHJldHVybiBhbnkob2JqLCBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgcmV0dXJuIHZhbHVlID09PSB0YXJnZXQ7XG4gICAgfSk7XG4gIH07XG5cbiAgLy8gSW52b2tlIGEgbWV0aG9kICh3aXRoIGFyZ3VtZW50cykgb24gZXZlcnkgaXRlbSBpbiBhIGNvbGxlY3Rpb24uXG4gIF8uaW52b2tlID0gZnVuY3Rpb24ob2JqLCBtZXRob2QpIHtcbiAgICB2YXIgYXJncyA9IHNsaWNlLmNhbGwoYXJndW1lbnRzLCAyKTtcbiAgICB2YXIgaXNGdW5jID0gXy5pc0Z1bmN0aW9uKG1ldGhvZCk7XG4gICAgcmV0dXJuIF8ubWFwKG9iaiwgZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgIHJldHVybiAoaXNGdW5jID8gbWV0aG9kIDogdmFsdWVbbWV0aG9kXSkuYXBwbHkodmFsdWUsIGFyZ3MpO1xuICAgIH0pO1xuICB9O1xuXG4gIC8vIENvbnZlbmllbmNlIHZlcnNpb24gb2YgYSBjb21tb24gdXNlIGNhc2Ugb2YgYG1hcGA6IGZldGNoaW5nIGEgcHJvcGVydHkuXG4gIF8ucGx1Y2sgPSBmdW5jdGlvbihvYmosIGtleSkge1xuICAgIHJldHVybiBfLm1hcChvYmosIF8ucHJvcGVydHkoa2V5KSk7XG4gIH07XG5cbiAgLy8gQ29udmVuaWVuY2UgdmVyc2lvbiBvZiBhIGNvbW1vbiB1c2UgY2FzZSBvZiBgZmlsdGVyYDogc2VsZWN0aW5nIG9ubHkgb2JqZWN0c1xuICAvLyBjb250YWluaW5nIHNwZWNpZmljIGBrZXk6dmFsdWVgIHBhaXJzLlxuICBfLndoZXJlID0gZnVuY3Rpb24ob2JqLCBhdHRycykge1xuICAgIHJldHVybiBfLmZpbHRlcihvYmosIF8ubWF0Y2hlcyhhdHRycykpO1xuICB9O1xuXG4gIC8vIENvbnZlbmllbmNlIHZlcnNpb24gb2YgYSBjb21tb24gdXNlIGNhc2Ugb2YgYGZpbmRgOiBnZXR0aW5nIHRoZSBmaXJzdCBvYmplY3RcbiAgLy8gY29udGFpbmluZyBzcGVjaWZpYyBga2V5OnZhbHVlYCBwYWlycy5cbiAgXy5maW5kV2hlcmUgPSBmdW5jdGlvbihvYmosIGF0dHJzKSB7XG4gICAgcmV0dXJuIF8uZmluZChvYmosIF8ubWF0Y2hlcyhhdHRycykpO1xuICB9O1xuXG4gIC8vIFJldHVybiB0aGUgbWF4aW11bSBlbGVtZW50IG9yIChlbGVtZW50LWJhc2VkIGNvbXB1dGF0aW9uKS5cbiAgLy8gQ2FuJ3Qgb3B0aW1pemUgYXJyYXlzIG9mIGludGVnZXJzIGxvbmdlciB0aGFuIDY1LDUzNSBlbGVtZW50cy5cbiAgLy8gU2VlIFtXZWJLaXQgQnVnIDgwNzk3XShodHRwczovL2J1Z3Mud2Via2l0Lm9yZy9zaG93X2J1Zy5jZ2k/aWQ9ODA3OTcpXG4gIF8ubWF4ID0gZnVuY3Rpb24ob2JqLCBpdGVyYXRvciwgY29udGV4dCkge1xuICAgIGlmICghaXRlcmF0b3IgJiYgXy5pc0FycmF5KG9iaikgJiYgb2JqWzBdID09PSArb2JqWzBdICYmIG9iai5sZW5ndGggPCA2NTUzNSkge1xuICAgICAgcmV0dXJuIE1hdGgubWF4LmFwcGx5KE1hdGgsIG9iaik7XG4gICAgfVxuICAgIHZhciByZXN1bHQgPSAtSW5maW5pdHksIGxhc3RDb21wdXRlZCA9IC1JbmZpbml0eTtcbiAgICBlYWNoKG9iaiwgZnVuY3Rpb24odmFsdWUsIGluZGV4LCBsaXN0KSB7XG4gICAgICB2YXIgY29tcHV0ZWQgPSBpdGVyYXRvciA/IGl0ZXJhdG9yLmNhbGwoY29udGV4dCwgdmFsdWUsIGluZGV4LCBsaXN0KSA6IHZhbHVlO1xuICAgICAgaWYgKGNvbXB1dGVkID4gbGFzdENvbXB1dGVkKSB7XG4gICAgICAgIHJlc3VsdCA9IHZhbHVlO1xuICAgICAgICBsYXN0Q29tcHV0ZWQgPSBjb21wdXRlZDtcbiAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9O1xuXG4gIC8vIFJldHVybiB0aGUgbWluaW11bSBlbGVtZW50IChvciBlbGVtZW50LWJhc2VkIGNvbXB1dGF0aW9uKS5cbiAgXy5taW4gPSBmdW5jdGlvbihvYmosIGl0ZXJhdG9yLCBjb250ZXh0KSB7XG4gICAgaWYgKCFpdGVyYXRvciAmJiBfLmlzQXJyYXkob2JqKSAmJiBvYmpbMF0gPT09ICtvYmpbMF0gJiYgb2JqLmxlbmd0aCA8IDY1NTM1KSB7XG4gICAgICByZXR1cm4gTWF0aC5taW4uYXBwbHkoTWF0aCwgb2JqKTtcbiAgICB9XG4gICAgdmFyIHJlc3VsdCA9IEluZmluaXR5LCBsYXN0Q29tcHV0ZWQgPSBJbmZpbml0eTtcbiAgICBlYWNoKG9iaiwgZnVuY3Rpb24odmFsdWUsIGluZGV4LCBsaXN0KSB7XG4gICAgICB2YXIgY29tcHV0ZWQgPSBpdGVyYXRvciA/IGl0ZXJhdG9yLmNhbGwoY29udGV4dCwgdmFsdWUsIGluZGV4LCBsaXN0KSA6IHZhbHVlO1xuICAgICAgaWYgKGNvbXB1dGVkIDwgbGFzdENvbXB1dGVkKSB7XG4gICAgICAgIHJlc3VsdCA9IHZhbHVlO1xuICAgICAgICBsYXN0Q29tcHV0ZWQgPSBjb21wdXRlZDtcbiAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9O1xuXG4gIC8vIFNodWZmbGUgYW4gYXJyYXksIHVzaW5nIHRoZSBtb2Rlcm4gdmVyc2lvbiBvZiB0aGVcbiAgLy8gW0Zpc2hlci1ZYXRlcyBzaHVmZmxlXShodHRwOi8vZW4ud2lraXBlZGlhLm9yZy93aWtpL0Zpc2hlcuKAk1lhdGVzX3NodWZmbGUpLlxuICBfLnNodWZmbGUgPSBmdW5jdGlvbihvYmopIHtcbiAgICB2YXIgcmFuZDtcbiAgICB2YXIgaW5kZXggPSAwO1xuICAgIHZhciBzaHVmZmxlZCA9IFtdO1xuICAgIGVhY2gob2JqLCBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgcmFuZCA9IF8ucmFuZG9tKGluZGV4KyspO1xuICAgICAgc2h1ZmZsZWRbaW5kZXggLSAxXSA9IHNodWZmbGVkW3JhbmRdO1xuICAgICAgc2h1ZmZsZWRbcmFuZF0gPSB2YWx1ZTtcbiAgICB9KTtcbiAgICByZXR1cm4gc2h1ZmZsZWQ7XG4gIH07XG5cbiAgLy8gU2FtcGxlICoqbioqIHJhbmRvbSB2YWx1ZXMgZnJvbSBhIGNvbGxlY3Rpb24uXG4gIC8vIElmICoqbioqIGlzIG5vdCBzcGVjaWZpZWQsIHJldHVybnMgYSBzaW5nbGUgcmFuZG9tIGVsZW1lbnQuXG4gIC8vIFRoZSBpbnRlcm5hbCBgZ3VhcmRgIGFyZ3VtZW50IGFsbG93cyBpdCB0byB3b3JrIHdpdGggYG1hcGAuXG4gIF8uc2FtcGxlID0gZnVuY3Rpb24ob2JqLCBuLCBndWFyZCkge1xuICAgIGlmIChuID09IG51bGwgfHwgZ3VhcmQpIHtcbiAgICAgIGlmIChvYmoubGVuZ3RoICE9PSArb2JqLmxlbmd0aCkgb2JqID0gXy52YWx1ZXMob2JqKTtcbiAgICAgIHJldHVybiBvYmpbXy5yYW5kb20ob2JqLmxlbmd0aCAtIDEpXTtcbiAgICB9XG4gICAgcmV0dXJuIF8uc2h1ZmZsZShvYmopLnNsaWNlKDAsIE1hdGgubWF4KDAsIG4pKTtcbiAgfTtcblxuICAvLyBBbiBpbnRlcm5hbCBmdW5jdGlvbiB0byBnZW5lcmF0ZSBsb29rdXAgaXRlcmF0b3JzLlxuICB2YXIgbG9va3VwSXRlcmF0b3IgPSBmdW5jdGlvbih2YWx1ZSkge1xuICAgIGlmICh2YWx1ZSA9PSBudWxsKSByZXR1cm4gXy5pZGVudGl0eTtcbiAgICBpZiAoXy5pc0Z1bmN0aW9uKHZhbHVlKSkgcmV0dXJuIHZhbHVlO1xuICAgIHJldHVybiBfLnByb3BlcnR5KHZhbHVlKTtcbiAgfTtcblxuICAvLyBTb3J0IHRoZSBvYmplY3QncyB2YWx1ZXMgYnkgYSBjcml0ZXJpb24gcHJvZHVjZWQgYnkgYW4gaXRlcmF0b3IuXG4gIF8uc29ydEJ5ID0gZnVuY3Rpb24ob2JqLCBpdGVyYXRvciwgY29udGV4dCkge1xuICAgIGl0ZXJhdG9yID0gbG9va3VwSXRlcmF0b3IoaXRlcmF0b3IpO1xuICAgIHJldHVybiBfLnBsdWNrKF8ubWFwKG9iaiwgZnVuY3Rpb24odmFsdWUsIGluZGV4LCBsaXN0KSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICB2YWx1ZTogdmFsdWUsXG4gICAgICAgIGluZGV4OiBpbmRleCxcbiAgICAgICAgY3JpdGVyaWE6IGl0ZXJhdG9yLmNhbGwoY29udGV4dCwgdmFsdWUsIGluZGV4LCBsaXN0KVxuICAgICAgfTtcbiAgICB9KS5zb3J0KGZ1bmN0aW9uKGxlZnQsIHJpZ2h0KSB7XG4gICAgICB2YXIgYSA9IGxlZnQuY3JpdGVyaWE7XG4gICAgICB2YXIgYiA9IHJpZ2h0LmNyaXRlcmlhO1xuICAgICAgaWYgKGEgIT09IGIpIHtcbiAgICAgICAgaWYgKGEgPiBiIHx8IGEgPT09IHZvaWQgMCkgcmV0dXJuIDE7XG4gICAgICAgIGlmIChhIDwgYiB8fCBiID09PSB2b2lkIDApIHJldHVybiAtMTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBsZWZ0LmluZGV4IC0gcmlnaHQuaW5kZXg7XG4gICAgfSksICd2YWx1ZScpO1xuICB9O1xuXG4gIC8vIEFuIGludGVybmFsIGZ1bmN0aW9uIHVzZWQgZm9yIGFnZ3JlZ2F0ZSBcImdyb3VwIGJ5XCIgb3BlcmF0aW9ucy5cbiAgdmFyIGdyb3VwID0gZnVuY3Rpb24oYmVoYXZpb3IpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24ob2JqLCBpdGVyYXRvciwgY29udGV4dCkge1xuICAgICAgdmFyIHJlc3VsdCA9IHt9O1xuICAgICAgaXRlcmF0b3IgPSBsb29rdXBJdGVyYXRvcihpdGVyYXRvcik7XG4gICAgICBlYWNoKG9iaiwgZnVuY3Rpb24odmFsdWUsIGluZGV4KSB7XG4gICAgICAgIHZhciBrZXkgPSBpdGVyYXRvci5jYWxsKGNvbnRleHQsIHZhbHVlLCBpbmRleCwgb2JqKTtcbiAgICAgICAgYmVoYXZpb3IocmVzdWx0LCBrZXksIHZhbHVlKTtcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9O1xuICB9O1xuXG4gIC8vIEdyb3VwcyB0aGUgb2JqZWN0J3MgdmFsdWVzIGJ5IGEgY3JpdGVyaW9uLiBQYXNzIGVpdGhlciBhIHN0cmluZyBhdHRyaWJ1dGVcbiAgLy8gdG8gZ3JvdXAgYnksIG9yIGEgZnVuY3Rpb24gdGhhdCByZXR1cm5zIHRoZSBjcml0ZXJpb24uXG4gIF8uZ3JvdXBCeSA9IGdyb3VwKGZ1bmN0aW9uKHJlc3VsdCwga2V5LCB2YWx1ZSkge1xuICAgIF8uaGFzKHJlc3VsdCwga2V5KSA/IHJlc3VsdFtrZXldLnB1c2godmFsdWUpIDogcmVzdWx0W2tleV0gPSBbdmFsdWVdO1xuICB9KTtcblxuICAvLyBJbmRleGVzIHRoZSBvYmplY3QncyB2YWx1ZXMgYnkgYSBjcml0ZXJpb24sIHNpbWlsYXIgdG8gYGdyb3VwQnlgLCBidXQgZm9yXG4gIC8vIHdoZW4geW91IGtub3cgdGhhdCB5b3VyIGluZGV4IHZhbHVlcyB3aWxsIGJlIHVuaXF1ZS5cbiAgXy5pbmRleEJ5ID0gZ3JvdXAoZnVuY3Rpb24ocmVzdWx0LCBrZXksIHZhbHVlKSB7XG4gICAgcmVzdWx0W2tleV0gPSB2YWx1ZTtcbiAgfSk7XG5cbiAgLy8gQ291bnRzIGluc3RhbmNlcyBvZiBhbiBvYmplY3QgdGhhdCBncm91cCBieSBhIGNlcnRhaW4gY3JpdGVyaW9uLiBQYXNzXG4gIC8vIGVpdGhlciBhIHN0cmluZyBhdHRyaWJ1dGUgdG8gY291bnQgYnksIG9yIGEgZnVuY3Rpb24gdGhhdCByZXR1cm5zIHRoZVxuICAvLyBjcml0ZXJpb24uXG4gIF8uY291bnRCeSA9IGdyb3VwKGZ1bmN0aW9uKHJlc3VsdCwga2V5KSB7XG4gICAgXy5oYXMocmVzdWx0LCBrZXkpID8gcmVzdWx0W2tleV0rKyA6IHJlc3VsdFtrZXldID0gMTtcbiAgfSk7XG5cbiAgLy8gVXNlIGEgY29tcGFyYXRvciBmdW5jdGlvbiB0byBmaWd1cmUgb3V0IHRoZSBzbWFsbGVzdCBpbmRleCBhdCB3aGljaFxuICAvLyBhbiBvYmplY3Qgc2hvdWxkIGJlIGluc2VydGVkIHNvIGFzIHRvIG1haW50YWluIG9yZGVyLiBVc2VzIGJpbmFyeSBzZWFyY2guXG4gIF8uc29ydGVkSW5kZXggPSBmdW5jdGlvbihhcnJheSwgb2JqLCBpdGVyYXRvciwgY29udGV4dCkge1xuICAgIGl0ZXJhdG9yID0gbG9va3VwSXRlcmF0b3IoaXRlcmF0b3IpO1xuICAgIHZhciB2YWx1ZSA9IGl0ZXJhdG9yLmNhbGwoY29udGV4dCwgb2JqKTtcbiAgICB2YXIgbG93ID0gMCwgaGlnaCA9IGFycmF5Lmxlbmd0aDtcbiAgICB3aGlsZSAobG93IDwgaGlnaCkge1xuICAgICAgdmFyIG1pZCA9IChsb3cgKyBoaWdoKSA+Pj4gMTtcbiAgICAgIGl0ZXJhdG9yLmNhbGwoY29udGV4dCwgYXJyYXlbbWlkXSkgPCB2YWx1ZSA/IGxvdyA9IG1pZCArIDEgOiBoaWdoID0gbWlkO1xuICAgIH1cbiAgICByZXR1cm4gbG93O1xuICB9O1xuXG4gIC8vIFNhZmVseSBjcmVhdGUgYSByZWFsLCBsaXZlIGFycmF5IGZyb20gYW55dGhpbmcgaXRlcmFibGUuXG4gIF8udG9BcnJheSA9IGZ1bmN0aW9uKG9iaikge1xuICAgIGlmICghb2JqKSByZXR1cm4gW107XG4gICAgaWYgKF8uaXNBcnJheShvYmopKSByZXR1cm4gc2xpY2UuY2FsbChvYmopO1xuICAgIGlmIChvYmoubGVuZ3RoID09PSArb2JqLmxlbmd0aCkgcmV0dXJuIF8ubWFwKG9iaiwgXy5pZGVudGl0eSk7XG4gICAgcmV0dXJuIF8udmFsdWVzKG9iaik7XG4gIH07XG5cbiAgLy8gUmV0dXJuIHRoZSBudW1iZXIgb2YgZWxlbWVudHMgaW4gYW4gb2JqZWN0LlxuICBfLnNpemUgPSBmdW5jdGlvbihvYmopIHtcbiAgICBpZiAob2JqID09IG51bGwpIHJldHVybiAwO1xuICAgIHJldHVybiAob2JqLmxlbmd0aCA9PT0gK29iai5sZW5ndGgpID8gb2JqLmxlbmd0aCA6IF8ua2V5cyhvYmopLmxlbmd0aDtcbiAgfTtcblxuICAvLyBBcnJheSBGdW5jdGlvbnNcbiAgLy8gLS0tLS0tLS0tLS0tLS0tXG5cbiAgLy8gR2V0IHRoZSBmaXJzdCBlbGVtZW50IG9mIGFuIGFycmF5LiBQYXNzaW5nICoqbioqIHdpbGwgcmV0dXJuIHRoZSBmaXJzdCBOXG4gIC8vIHZhbHVlcyBpbiB0aGUgYXJyYXkuIEFsaWFzZWQgYXMgYGhlYWRgIGFuZCBgdGFrZWAuIFRoZSAqKmd1YXJkKiogY2hlY2tcbiAgLy8gYWxsb3dzIGl0IHRvIHdvcmsgd2l0aCBgXy5tYXBgLlxuICBfLmZpcnN0ID0gXy5oZWFkID0gXy50YWtlID0gZnVuY3Rpb24oYXJyYXksIG4sIGd1YXJkKSB7XG4gICAgaWYgKGFycmF5ID09IG51bGwpIHJldHVybiB2b2lkIDA7XG4gICAgaWYgKChuID09IG51bGwpIHx8IGd1YXJkKSByZXR1cm4gYXJyYXlbMF07XG4gICAgaWYgKG4gPCAwKSByZXR1cm4gW107XG4gICAgcmV0dXJuIHNsaWNlLmNhbGwoYXJyYXksIDAsIG4pO1xuICB9O1xuXG4gIC8vIFJldHVybnMgZXZlcnl0aGluZyBidXQgdGhlIGxhc3QgZW50cnkgb2YgdGhlIGFycmF5LiBFc3BlY2lhbGx5IHVzZWZ1bCBvblxuICAvLyB0aGUgYXJndW1lbnRzIG9iamVjdC4gUGFzc2luZyAqKm4qKiB3aWxsIHJldHVybiBhbGwgdGhlIHZhbHVlcyBpblxuICAvLyB0aGUgYXJyYXksIGV4Y2x1ZGluZyB0aGUgbGFzdCBOLiBUaGUgKipndWFyZCoqIGNoZWNrIGFsbG93cyBpdCB0byB3b3JrIHdpdGhcbiAgLy8gYF8ubWFwYC5cbiAgXy5pbml0aWFsID0gZnVuY3Rpb24oYXJyYXksIG4sIGd1YXJkKSB7XG4gICAgcmV0dXJuIHNsaWNlLmNhbGwoYXJyYXksIDAsIGFycmF5Lmxlbmd0aCAtICgobiA9PSBudWxsKSB8fCBndWFyZCA/IDEgOiBuKSk7XG4gIH07XG5cbiAgLy8gR2V0IHRoZSBsYXN0IGVsZW1lbnQgb2YgYW4gYXJyYXkuIFBhc3NpbmcgKipuKiogd2lsbCByZXR1cm4gdGhlIGxhc3QgTlxuICAvLyB2YWx1ZXMgaW4gdGhlIGFycmF5LiBUaGUgKipndWFyZCoqIGNoZWNrIGFsbG93cyBpdCB0byB3b3JrIHdpdGggYF8ubWFwYC5cbiAgXy5sYXN0ID0gZnVuY3Rpb24oYXJyYXksIG4sIGd1YXJkKSB7XG4gICAgaWYgKGFycmF5ID09IG51bGwpIHJldHVybiB2b2lkIDA7XG4gICAgaWYgKChuID09IG51bGwpIHx8IGd1YXJkKSByZXR1cm4gYXJyYXlbYXJyYXkubGVuZ3RoIC0gMV07XG4gICAgcmV0dXJuIHNsaWNlLmNhbGwoYXJyYXksIE1hdGgubWF4KGFycmF5Lmxlbmd0aCAtIG4sIDApKTtcbiAgfTtcblxuICAvLyBSZXR1cm5zIGV2ZXJ5dGhpbmcgYnV0IHRoZSBmaXJzdCBlbnRyeSBvZiB0aGUgYXJyYXkuIEFsaWFzZWQgYXMgYHRhaWxgIGFuZCBgZHJvcGAuXG4gIC8vIEVzcGVjaWFsbHkgdXNlZnVsIG9uIHRoZSBhcmd1bWVudHMgb2JqZWN0LiBQYXNzaW5nIGFuICoqbioqIHdpbGwgcmV0dXJuXG4gIC8vIHRoZSByZXN0IE4gdmFsdWVzIGluIHRoZSBhcnJheS4gVGhlICoqZ3VhcmQqKlxuICAvLyBjaGVjayBhbGxvd3MgaXQgdG8gd29yayB3aXRoIGBfLm1hcGAuXG4gIF8ucmVzdCA9IF8udGFpbCA9IF8uZHJvcCA9IGZ1bmN0aW9uKGFycmF5LCBuLCBndWFyZCkge1xuICAgIHJldHVybiBzbGljZS5jYWxsKGFycmF5LCAobiA9PSBudWxsKSB8fCBndWFyZCA/IDEgOiBuKTtcbiAgfTtcblxuICAvLyBUcmltIG91dCBhbGwgZmFsc3kgdmFsdWVzIGZyb20gYW4gYXJyYXkuXG4gIF8uY29tcGFjdCA9IGZ1bmN0aW9uKGFycmF5KSB7XG4gICAgcmV0dXJuIF8uZmlsdGVyKGFycmF5LCBfLmlkZW50aXR5KTtcbiAgfTtcblxuICAvLyBJbnRlcm5hbCBpbXBsZW1lbnRhdGlvbiBvZiBhIHJlY3Vyc2l2ZSBgZmxhdHRlbmAgZnVuY3Rpb24uXG4gIHZhciBmbGF0dGVuID0gZnVuY3Rpb24oaW5wdXQsIHNoYWxsb3csIG91dHB1dCkge1xuICAgIGlmIChzaGFsbG93ICYmIF8uZXZlcnkoaW5wdXQsIF8uaXNBcnJheSkpIHtcbiAgICAgIHJldHVybiBjb25jYXQuYXBwbHkob3V0cHV0LCBpbnB1dCk7XG4gICAgfVxuICAgIGVhY2goaW5wdXQsIGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICBpZiAoXy5pc0FycmF5KHZhbHVlKSB8fCBfLmlzQXJndW1lbnRzKHZhbHVlKSkge1xuICAgICAgICBzaGFsbG93ID8gcHVzaC5hcHBseShvdXRwdXQsIHZhbHVlKSA6IGZsYXR0ZW4odmFsdWUsIHNoYWxsb3csIG91dHB1dCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBvdXRwdXQucHVzaCh2YWx1ZSk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIG91dHB1dDtcbiAgfTtcblxuICAvLyBGbGF0dGVuIG91dCBhbiBhcnJheSwgZWl0aGVyIHJlY3Vyc2l2ZWx5IChieSBkZWZhdWx0KSwgb3IganVzdCBvbmUgbGV2ZWwuXG4gIF8uZmxhdHRlbiA9IGZ1bmN0aW9uKGFycmF5LCBzaGFsbG93KSB7XG4gICAgcmV0dXJuIGZsYXR0ZW4oYXJyYXksIHNoYWxsb3csIFtdKTtcbiAgfTtcblxuICAvLyBSZXR1cm4gYSB2ZXJzaW9uIG9mIHRoZSBhcnJheSB0aGF0IGRvZXMgbm90IGNvbnRhaW4gdGhlIHNwZWNpZmllZCB2YWx1ZShzKS5cbiAgXy53aXRob3V0ID0gZnVuY3Rpb24oYXJyYXkpIHtcbiAgICByZXR1cm4gXy5kaWZmZXJlbmNlKGFycmF5LCBzbGljZS5jYWxsKGFyZ3VtZW50cywgMSkpO1xuICB9O1xuXG4gIC8vIFNwbGl0IGFuIGFycmF5IGludG8gdHdvIGFycmF5czogb25lIHdob3NlIGVsZW1lbnRzIGFsbCBzYXRpc2Z5IHRoZSBnaXZlblxuICAvLyBwcmVkaWNhdGUsIGFuZCBvbmUgd2hvc2UgZWxlbWVudHMgYWxsIGRvIG5vdCBzYXRpc2Z5IHRoZSBwcmVkaWNhdGUuXG4gIF8ucGFydGl0aW9uID0gZnVuY3Rpb24oYXJyYXksIHByZWRpY2F0ZSkge1xuICAgIHZhciBwYXNzID0gW10sIGZhaWwgPSBbXTtcbiAgICBlYWNoKGFycmF5LCBmdW5jdGlvbihlbGVtKSB7XG4gICAgICAocHJlZGljYXRlKGVsZW0pID8gcGFzcyA6IGZhaWwpLnB1c2goZWxlbSk7XG4gICAgfSk7XG4gICAgcmV0dXJuIFtwYXNzLCBmYWlsXTtcbiAgfTtcblxuICAvLyBQcm9kdWNlIGEgZHVwbGljYXRlLWZyZWUgdmVyc2lvbiBvZiB0aGUgYXJyYXkuIElmIHRoZSBhcnJheSBoYXMgYWxyZWFkeVxuICAvLyBiZWVuIHNvcnRlZCwgeW91IGhhdmUgdGhlIG9wdGlvbiBvZiB1c2luZyBhIGZhc3RlciBhbGdvcml0aG0uXG4gIC8vIEFsaWFzZWQgYXMgYHVuaXF1ZWAuXG4gIF8udW5pcSA9IF8udW5pcXVlID0gZnVuY3Rpb24oYXJyYXksIGlzU29ydGVkLCBpdGVyYXRvciwgY29udGV4dCkge1xuICAgIGlmIChfLmlzRnVuY3Rpb24oaXNTb3J0ZWQpKSB7XG4gICAgICBjb250ZXh0ID0gaXRlcmF0b3I7XG4gICAgICBpdGVyYXRvciA9IGlzU29ydGVkO1xuICAgICAgaXNTb3J0ZWQgPSBmYWxzZTtcbiAgICB9XG4gICAgdmFyIGluaXRpYWwgPSBpdGVyYXRvciA/IF8ubWFwKGFycmF5LCBpdGVyYXRvciwgY29udGV4dCkgOiBhcnJheTtcbiAgICB2YXIgcmVzdWx0cyA9IFtdO1xuICAgIHZhciBzZWVuID0gW107XG4gICAgZWFjaChpbml0aWFsLCBmdW5jdGlvbih2YWx1ZSwgaW5kZXgpIHtcbiAgICAgIGlmIChpc1NvcnRlZCA/ICghaW5kZXggfHwgc2VlbltzZWVuLmxlbmd0aCAtIDFdICE9PSB2YWx1ZSkgOiAhXy5jb250YWlucyhzZWVuLCB2YWx1ZSkpIHtcbiAgICAgICAgc2Vlbi5wdXNoKHZhbHVlKTtcbiAgICAgICAgcmVzdWx0cy5wdXNoKGFycmF5W2luZGV4XSk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIHJlc3VsdHM7XG4gIH07XG5cbiAgLy8gUHJvZHVjZSBhbiBhcnJheSB0aGF0IGNvbnRhaW5zIHRoZSB1bmlvbjogZWFjaCBkaXN0aW5jdCBlbGVtZW50IGZyb20gYWxsIG9mXG4gIC8vIHRoZSBwYXNzZWQtaW4gYXJyYXlzLlxuICBfLnVuaW9uID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIF8udW5pcShfLmZsYXR0ZW4oYXJndW1lbnRzLCB0cnVlKSk7XG4gIH07XG5cbiAgLy8gUHJvZHVjZSBhbiBhcnJheSB0aGF0IGNvbnRhaW5zIGV2ZXJ5IGl0ZW0gc2hhcmVkIGJldHdlZW4gYWxsIHRoZVxuICAvLyBwYXNzZWQtaW4gYXJyYXlzLlxuICBfLmludGVyc2VjdGlvbiA9IGZ1bmN0aW9uKGFycmF5KSB7XG4gICAgdmFyIHJlc3QgPSBzbGljZS5jYWxsKGFyZ3VtZW50cywgMSk7XG4gICAgcmV0dXJuIF8uZmlsdGVyKF8udW5pcShhcnJheSksIGZ1bmN0aW9uKGl0ZW0pIHtcbiAgICAgIHJldHVybiBfLmV2ZXJ5KHJlc3QsIGZ1bmN0aW9uKG90aGVyKSB7XG4gICAgICAgIHJldHVybiBfLmNvbnRhaW5zKG90aGVyLCBpdGVtKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9O1xuXG4gIC8vIFRha2UgdGhlIGRpZmZlcmVuY2UgYmV0d2VlbiBvbmUgYXJyYXkgYW5kIGEgbnVtYmVyIG9mIG90aGVyIGFycmF5cy5cbiAgLy8gT25seSB0aGUgZWxlbWVudHMgcHJlc2VudCBpbiBqdXN0IHRoZSBmaXJzdCBhcnJheSB3aWxsIHJlbWFpbi5cbiAgXy5kaWZmZXJlbmNlID0gZnVuY3Rpb24oYXJyYXkpIHtcbiAgICB2YXIgcmVzdCA9IGNvbmNhdC5hcHBseShBcnJheVByb3RvLCBzbGljZS5jYWxsKGFyZ3VtZW50cywgMSkpO1xuICAgIHJldHVybiBfLmZpbHRlcihhcnJheSwgZnVuY3Rpb24odmFsdWUpeyByZXR1cm4gIV8uY29udGFpbnMocmVzdCwgdmFsdWUpOyB9KTtcbiAgfTtcblxuICAvLyBaaXAgdG9nZXRoZXIgbXVsdGlwbGUgbGlzdHMgaW50byBhIHNpbmdsZSBhcnJheSAtLSBlbGVtZW50cyB0aGF0IHNoYXJlXG4gIC8vIGFuIGluZGV4IGdvIHRvZ2V0aGVyLlxuICBfLnppcCA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBsZW5ndGggPSBfLm1heChfLnBsdWNrKGFyZ3VtZW50cywgJ2xlbmd0aCcpLmNvbmNhdCgwKSk7XG4gICAgdmFyIHJlc3VsdHMgPSBuZXcgQXJyYXkobGVuZ3RoKTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICByZXN1bHRzW2ldID0gXy5wbHVjayhhcmd1bWVudHMsICcnICsgaSk7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHRzO1xuICB9O1xuXG4gIC8vIENvbnZlcnRzIGxpc3RzIGludG8gb2JqZWN0cy4gUGFzcyBlaXRoZXIgYSBzaW5nbGUgYXJyYXkgb2YgYFtrZXksIHZhbHVlXWBcbiAgLy8gcGFpcnMsIG9yIHR3byBwYXJhbGxlbCBhcnJheXMgb2YgdGhlIHNhbWUgbGVuZ3RoIC0tIG9uZSBvZiBrZXlzLCBhbmQgb25lIG9mXG4gIC8vIHRoZSBjb3JyZXNwb25kaW5nIHZhbHVlcy5cbiAgXy5vYmplY3QgPSBmdW5jdGlvbihsaXN0LCB2YWx1ZXMpIHtcbiAgICBpZiAobGlzdCA9PSBudWxsKSByZXR1cm4ge307XG4gICAgdmFyIHJlc3VsdCA9IHt9O1xuICAgIGZvciAodmFyIGkgPSAwLCBsZW5ndGggPSBsaXN0Lmxlbmd0aDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICBpZiAodmFsdWVzKSB7XG4gICAgICAgIHJlc3VsdFtsaXN0W2ldXSA9IHZhbHVlc1tpXTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJlc3VsdFtsaXN0W2ldWzBdXSA9IGxpc3RbaV1bMV07XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH07XG5cbiAgLy8gSWYgdGhlIGJyb3dzZXIgZG9lc24ndCBzdXBwbHkgdXMgd2l0aCBpbmRleE9mIChJJ20gbG9va2luZyBhdCB5b3UsICoqTVNJRSoqKSxcbiAgLy8gd2UgbmVlZCB0aGlzIGZ1bmN0aW9uLiBSZXR1cm4gdGhlIHBvc2l0aW9uIG9mIHRoZSBmaXJzdCBvY2N1cnJlbmNlIG9mIGFuXG4gIC8vIGl0ZW0gaW4gYW4gYXJyYXksIG9yIC0xIGlmIHRoZSBpdGVtIGlzIG5vdCBpbmNsdWRlZCBpbiB0aGUgYXJyYXkuXG4gIC8vIERlbGVnYXRlcyB0byAqKkVDTUFTY3JpcHQgNSoqJ3MgbmF0aXZlIGBpbmRleE9mYCBpZiBhdmFpbGFibGUuXG4gIC8vIElmIHRoZSBhcnJheSBpcyBsYXJnZSBhbmQgYWxyZWFkeSBpbiBzb3J0IG9yZGVyLCBwYXNzIGB0cnVlYFxuICAvLyBmb3IgKippc1NvcnRlZCoqIHRvIHVzZSBiaW5hcnkgc2VhcmNoLlxuICBfLmluZGV4T2YgPSBmdW5jdGlvbihhcnJheSwgaXRlbSwgaXNTb3J0ZWQpIHtcbiAgICBpZiAoYXJyYXkgPT0gbnVsbCkgcmV0dXJuIC0xO1xuICAgIHZhciBpID0gMCwgbGVuZ3RoID0gYXJyYXkubGVuZ3RoO1xuICAgIGlmIChpc1NvcnRlZCkge1xuICAgICAgaWYgKHR5cGVvZiBpc1NvcnRlZCA9PSAnbnVtYmVyJykge1xuICAgICAgICBpID0gKGlzU29ydGVkIDwgMCA/IE1hdGgubWF4KDAsIGxlbmd0aCArIGlzU29ydGVkKSA6IGlzU29ydGVkKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGkgPSBfLnNvcnRlZEluZGV4KGFycmF5LCBpdGVtKTtcbiAgICAgICAgcmV0dXJuIGFycmF5W2ldID09PSBpdGVtID8gaSA6IC0xO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAobmF0aXZlSW5kZXhPZiAmJiBhcnJheS5pbmRleE9mID09PSBuYXRpdmVJbmRleE9mKSByZXR1cm4gYXJyYXkuaW5kZXhPZihpdGVtLCBpc1NvcnRlZCk7XG4gICAgZm9yICg7IGkgPCBsZW5ndGg7IGkrKykgaWYgKGFycmF5W2ldID09PSBpdGVtKSByZXR1cm4gaTtcbiAgICByZXR1cm4gLTE7XG4gIH07XG5cbiAgLy8gRGVsZWdhdGVzIHRvICoqRUNNQVNjcmlwdCA1KioncyBuYXRpdmUgYGxhc3RJbmRleE9mYCBpZiBhdmFpbGFibGUuXG4gIF8ubGFzdEluZGV4T2YgPSBmdW5jdGlvbihhcnJheSwgaXRlbSwgZnJvbSkge1xuICAgIGlmIChhcnJheSA9PSBudWxsKSByZXR1cm4gLTE7XG4gICAgdmFyIGhhc0luZGV4ID0gZnJvbSAhPSBudWxsO1xuICAgIGlmIChuYXRpdmVMYXN0SW5kZXhPZiAmJiBhcnJheS5sYXN0SW5kZXhPZiA9PT0gbmF0aXZlTGFzdEluZGV4T2YpIHtcbiAgICAgIHJldHVybiBoYXNJbmRleCA/IGFycmF5Lmxhc3RJbmRleE9mKGl0ZW0sIGZyb20pIDogYXJyYXkubGFzdEluZGV4T2YoaXRlbSk7XG4gICAgfVxuICAgIHZhciBpID0gKGhhc0luZGV4ID8gZnJvbSA6IGFycmF5Lmxlbmd0aCk7XG4gICAgd2hpbGUgKGktLSkgaWYgKGFycmF5W2ldID09PSBpdGVtKSByZXR1cm4gaTtcbiAgICByZXR1cm4gLTE7XG4gIH07XG5cbiAgLy8gR2VuZXJhdGUgYW4gaW50ZWdlciBBcnJheSBjb250YWluaW5nIGFuIGFyaXRobWV0aWMgcHJvZ3Jlc3Npb24uIEEgcG9ydCBvZlxuICAvLyB0aGUgbmF0aXZlIFB5dGhvbiBgcmFuZ2UoKWAgZnVuY3Rpb24uIFNlZVxuICAvLyBbdGhlIFB5dGhvbiBkb2N1bWVudGF0aW9uXShodHRwOi8vZG9jcy5weXRob24ub3JnL2xpYnJhcnkvZnVuY3Rpb25zLmh0bWwjcmFuZ2UpLlxuICBfLnJhbmdlID0gZnVuY3Rpb24oc3RhcnQsIHN0b3AsIHN0ZXApIHtcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA8PSAxKSB7XG4gICAgICBzdG9wID0gc3RhcnQgfHwgMDtcbiAgICAgIHN0YXJ0ID0gMDtcbiAgICB9XG4gICAgc3RlcCA9IGFyZ3VtZW50c1syXSB8fCAxO1xuXG4gICAgdmFyIGxlbmd0aCA9IE1hdGgubWF4KE1hdGguY2VpbCgoc3RvcCAtIHN0YXJ0KSAvIHN0ZXApLCAwKTtcbiAgICB2YXIgaWR4ID0gMDtcbiAgICB2YXIgcmFuZ2UgPSBuZXcgQXJyYXkobGVuZ3RoKTtcblxuICAgIHdoaWxlKGlkeCA8IGxlbmd0aCkge1xuICAgICAgcmFuZ2VbaWR4KytdID0gc3RhcnQ7XG4gICAgICBzdGFydCArPSBzdGVwO1xuICAgIH1cblxuICAgIHJldHVybiByYW5nZTtcbiAgfTtcblxuICAvLyBGdW5jdGlvbiAoYWhlbSkgRnVuY3Rpb25zXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gIC8vIFJldXNhYmxlIGNvbnN0cnVjdG9yIGZ1bmN0aW9uIGZvciBwcm90b3R5cGUgc2V0dGluZy5cbiAgdmFyIGN0b3IgPSBmdW5jdGlvbigpe307XG5cbiAgLy8gQ3JlYXRlIGEgZnVuY3Rpb24gYm91bmQgdG8gYSBnaXZlbiBvYmplY3QgKGFzc2lnbmluZyBgdGhpc2AsIGFuZCBhcmd1bWVudHMsXG4gIC8vIG9wdGlvbmFsbHkpLiBEZWxlZ2F0ZXMgdG8gKipFQ01BU2NyaXB0IDUqKidzIG5hdGl2ZSBgRnVuY3Rpb24uYmluZGAgaWZcbiAgLy8gYXZhaWxhYmxlLlxuICBfLmJpbmQgPSBmdW5jdGlvbihmdW5jLCBjb250ZXh0KSB7XG4gICAgdmFyIGFyZ3MsIGJvdW5kO1xuICAgIGlmIChuYXRpdmVCaW5kICYmIGZ1bmMuYmluZCA9PT0gbmF0aXZlQmluZCkgcmV0dXJuIG5hdGl2ZUJpbmQuYXBwbHkoZnVuYywgc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpKTtcbiAgICBpZiAoIV8uaXNGdW5jdGlvbihmdW5jKSkgdGhyb3cgbmV3IFR5cGVFcnJvcjtcbiAgICBhcmdzID0gc2xpY2UuY2FsbChhcmd1bWVudHMsIDIpO1xuICAgIHJldHVybiBib3VuZCA9IGZ1bmN0aW9uKCkge1xuICAgICAgaWYgKCEodGhpcyBpbnN0YW5jZW9mIGJvdW5kKSkgcmV0dXJuIGZ1bmMuYXBwbHkoY29udGV4dCwgYXJncy5jb25jYXQoc2xpY2UuY2FsbChhcmd1bWVudHMpKSk7XG4gICAgICBjdG9yLnByb3RvdHlwZSA9IGZ1bmMucHJvdG90eXBlO1xuICAgICAgdmFyIHNlbGYgPSBuZXcgY3RvcjtcbiAgICAgIGN0b3IucHJvdG90eXBlID0gbnVsbDtcbiAgICAgIHZhciByZXN1bHQgPSBmdW5jLmFwcGx5KHNlbGYsIGFyZ3MuY29uY2F0KHNsaWNlLmNhbGwoYXJndW1lbnRzKSkpO1xuICAgICAgaWYgKE9iamVjdChyZXN1bHQpID09PSByZXN1bHQpIHJldHVybiByZXN1bHQ7XG4gICAgICByZXR1cm4gc2VsZjtcbiAgICB9O1xuICB9O1xuXG4gIC8vIFBhcnRpYWxseSBhcHBseSBhIGZ1bmN0aW9uIGJ5IGNyZWF0aW5nIGEgdmVyc2lvbiB0aGF0IGhhcyBoYWQgc29tZSBvZiBpdHNcbiAgLy8gYXJndW1lbnRzIHByZS1maWxsZWQsIHdpdGhvdXQgY2hhbmdpbmcgaXRzIGR5bmFtaWMgYHRoaXNgIGNvbnRleHQuIF8gYWN0c1xuICAvLyBhcyBhIHBsYWNlaG9sZGVyLCBhbGxvd2luZyBhbnkgY29tYmluYXRpb24gb2YgYXJndW1lbnRzIHRvIGJlIHByZS1maWxsZWQuXG4gIF8ucGFydGlhbCA9IGZ1bmN0aW9uKGZ1bmMpIHtcbiAgICB2YXIgYm91bmRBcmdzID0gc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpO1xuICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBwb3NpdGlvbiA9IDA7XG4gICAgICB2YXIgYXJncyA9IGJvdW5kQXJncy5zbGljZSgpO1xuICAgICAgZm9yICh2YXIgaSA9IDAsIGxlbmd0aCA9IGFyZ3MubGVuZ3RoOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgICAgaWYgKGFyZ3NbaV0gPT09IF8pIGFyZ3NbaV0gPSBhcmd1bWVudHNbcG9zaXRpb24rK107XG4gICAgICB9XG4gICAgICB3aGlsZSAocG9zaXRpb24gPCBhcmd1bWVudHMubGVuZ3RoKSBhcmdzLnB1c2goYXJndW1lbnRzW3Bvc2l0aW9uKytdKTtcbiAgICAgIHJldHVybiBmdW5jLmFwcGx5KHRoaXMsIGFyZ3MpO1xuICAgIH07XG4gIH07XG5cbiAgLy8gQmluZCBhIG51bWJlciBvZiBhbiBvYmplY3QncyBtZXRob2RzIHRvIHRoYXQgb2JqZWN0LiBSZW1haW5pbmcgYXJndW1lbnRzXG4gIC8vIGFyZSB0aGUgbWV0aG9kIG5hbWVzIHRvIGJlIGJvdW5kLiBVc2VmdWwgZm9yIGVuc3VyaW5nIHRoYXQgYWxsIGNhbGxiYWNrc1xuICAvLyBkZWZpbmVkIG9uIGFuIG9iamVjdCBiZWxvbmcgdG8gaXQuXG4gIF8uYmluZEFsbCA9IGZ1bmN0aW9uKG9iaikge1xuICAgIHZhciBmdW5jcyA9IHNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKTtcbiAgICBpZiAoZnVuY3MubGVuZ3RoID09PSAwKSB0aHJvdyBuZXcgRXJyb3IoJ2JpbmRBbGwgbXVzdCBiZSBwYXNzZWQgZnVuY3Rpb24gbmFtZXMnKTtcbiAgICBlYWNoKGZ1bmNzLCBmdW5jdGlvbihmKSB7IG9ialtmXSA9IF8uYmluZChvYmpbZl0sIG9iaik7IH0pO1xuICAgIHJldHVybiBvYmo7XG4gIH07XG5cbiAgLy8gTWVtb2l6ZSBhbiBleHBlbnNpdmUgZnVuY3Rpb24gYnkgc3RvcmluZyBpdHMgcmVzdWx0cy5cbiAgXy5tZW1vaXplID0gZnVuY3Rpb24oZnVuYywgaGFzaGVyKSB7XG4gICAgdmFyIG1lbW8gPSB7fTtcbiAgICBoYXNoZXIgfHwgKGhhc2hlciA9IF8uaWRlbnRpdHkpO1xuICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBrZXkgPSBoYXNoZXIuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgIHJldHVybiBfLmhhcyhtZW1vLCBrZXkpID8gbWVtb1trZXldIDogKG1lbW9ba2V5XSA9IGZ1bmMuYXBwbHkodGhpcywgYXJndW1lbnRzKSk7XG4gICAgfTtcbiAgfTtcblxuICAvLyBEZWxheXMgYSBmdW5jdGlvbiBmb3IgdGhlIGdpdmVuIG51bWJlciBvZiBtaWxsaXNlY29uZHMsIGFuZCB0aGVuIGNhbGxzXG4gIC8vIGl0IHdpdGggdGhlIGFyZ3VtZW50cyBzdXBwbGllZC5cbiAgXy5kZWxheSA9IGZ1bmN0aW9uKGZ1bmMsIHdhaXQpIHtcbiAgICB2YXIgYXJncyA9IHNsaWNlLmNhbGwoYXJndW1lbnRzLCAyKTtcbiAgICByZXR1cm4gc2V0VGltZW91dChmdW5jdGlvbigpeyByZXR1cm4gZnVuYy5hcHBseShudWxsLCBhcmdzKTsgfSwgd2FpdCk7XG4gIH07XG5cbiAgLy8gRGVmZXJzIGEgZnVuY3Rpb24sIHNjaGVkdWxpbmcgaXQgdG8gcnVuIGFmdGVyIHRoZSBjdXJyZW50IGNhbGwgc3RhY2sgaGFzXG4gIC8vIGNsZWFyZWQuXG4gIF8uZGVmZXIgPSBmdW5jdGlvbihmdW5jKSB7XG4gICAgcmV0dXJuIF8uZGVsYXkuYXBwbHkoXywgW2Z1bmMsIDFdLmNvbmNhdChzbGljZS5jYWxsKGFyZ3VtZW50cywgMSkpKTtcbiAgfTtcblxuICAvLyBSZXR1cm5zIGEgZnVuY3Rpb24sIHRoYXQsIHdoZW4gaW52b2tlZCwgd2lsbCBvbmx5IGJlIHRyaWdnZXJlZCBhdCBtb3N0IG9uY2VcbiAgLy8gZHVyaW5nIGEgZ2l2ZW4gd2luZG93IG9mIHRpbWUuIE5vcm1hbGx5LCB0aGUgdGhyb3R0bGVkIGZ1bmN0aW9uIHdpbGwgcnVuXG4gIC8vIGFzIG11Y2ggYXMgaXQgY2FuLCB3aXRob3V0IGV2ZXIgZ29pbmcgbW9yZSB0aGFuIG9uY2UgcGVyIGB3YWl0YCBkdXJhdGlvbjtcbiAgLy8gYnV0IGlmIHlvdSdkIGxpa2UgdG8gZGlzYWJsZSB0aGUgZXhlY3V0aW9uIG9uIHRoZSBsZWFkaW5nIGVkZ2UsIHBhc3NcbiAgLy8gYHtsZWFkaW5nOiBmYWxzZX1gLiBUbyBkaXNhYmxlIGV4ZWN1dGlvbiBvbiB0aGUgdHJhaWxpbmcgZWRnZSwgZGl0dG8uXG4gIF8udGhyb3R0bGUgPSBmdW5jdGlvbihmdW5jLCB3YWl0LCBvcHRpb25zKSB7XG4gICAgdmFyIGNvbnRleHQsIGFyZ3MsIHJlc3VsdDtcbiAgICB2YXIgdGltZW91dCA9IG51bGw7XG4gICAgdmFyIHByZXZpb3VzID0gMDtcbiAgICBvcHRpb25zIHx8IChvcHRpb25zID0ge30pO1xuICAgIHZhciBsYXRlciA9IGZ1bmN0aW9uKCkge1xuICAgICAgcHJldmlvdXMgPSBvcHRpb25zLmxlYWRpbmcgPT09IGZhbHNlID8gMCA6IF8ubm93KCk7XG4gICAgICB0aW1lb3V0ID0gbnVsbDtcbiAgICAgIHJlc3VsdCA9IGZ1bmMuYXBwbHkoY29udGV4dCwgYXJncyk7XG4gICAgICBjb250ZXh0ID0gYXJncyA9IG51bGw7XG4gICAgfTtcbiAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgbm93ID0gXy5ub3coKTtcbiAgICAgIGlmICghcHJldmlvdXMgJiYgb3B0aW9ucy5sZWFkaW5nID09PSBmYWxzZSkgcHJldmlvdXMgPSBub3c7XG4gICAgICB2YXIgcmVtYWluaW5nID0gd2FpdCAtIChub3cgLSBwcmV2aW91cyk7XG4gICAgICBjb250ZXh0ID0gdGhpcztcbiAgICAgIGFyZ3MgPSBhcmd1bWVudHM7XG4gICAgICBpZiAocmVtYWluaW5nIDw9IDApIHtcbiAgICAgICAgY2xlYXJUaW1lb3V0KHRpbWVvdXQpO1xuICAgICAgICB0aW1lb3V0ID0gbnVsbDtcbiAgICAgICAgcHJldmlvdXMgPSBub3c7XG4gICAgICAgIHJlc3VsdCA9IGZ1bmMuYXBwbHkoY29udGV4dCwgYXJncyk7XG4gICAgICAgIGNvbnRleHQgPSBhcmdzID0gbnVsbDtcbiAgICAgIH0gZWxzZSBpZiAoIXRpbWVvdXQgJiYgb3B0aW9ucy50cmFpbGluZyAhPT0gZmFsc2UpIHtcbiAgICAgICAgdGltZW91dCA9IHNldFRpbWVvdXQobGF0ZXIsIHJlbWFpbmluZyk7XG4gICAgICB9XG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH07XG4gIH07XG5cbiAgLy8gUmV0dXJucyBhIGZ1bmN0aW9uLCB0aGF0LCBhcyBsb25nIGFzIGl0IGNvbnRpbnVlcyB0byBiZSBpbnZva2VkLCB3aWxsIG5vdFxuICAvLyBiZSB0cmlnZ2VyZWQuIFRoZSBmdW5jdGlvbiB3aWxsIGJlIGNhbGxlZCBhZnRlciBpdCBzdG9wcyBiZWluZyBjYWxsZWQgZm9yXG4gIC8vIE4gbWlsbGlzZWNvbmRzLiBJZiBgaW1tZWRpYXRlYCBpcyBwYXNzZWQsIHRyaWdnZXIgdGhlIGZ1bmN0aW9uIG9uIHRoZVxuICAvLyBsZWFkaW5nIGVkZ2UsIGluc3RlYWQgb2YgdGhlIHRyYWlsaW5nLlxuICBfLmRlYm91bmNlID0gZnVuY3Rpb24oZnVuYywgd2FpdCwgaW1tZWRpYXRlKSB7XG4gICAgdmFyIHRpbWVvdXQsIGFyZ3MsIGNvbnRleHQsIHRpbWVzdGFtcCwgcmVzdWx0O1xuXG4gICAgdmFyIGxhdGVyID0gZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgbGFzdCA9IF8ubm93KCkgLSB0aW1lc3RhbXA7XG4gICAgICBpZiAobGFzdCA8IHdhaXQpIHtcbiAgICAgICAgdGltZW91dCA9IHNldFRpbWVvdXQobGF0ZXIsIHdhaXQgLSBsYXN0KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRpbWVvdXQgPSBudWxsO1xuICAgICAgICBpZiAoIWltbWVkaWF0ZSkge1xuICAgICAgICAgIHJlc3VsdCA9IGZ1bmMuYXBwbHkoY29udGV4dCwgYXJncyk7XG4gICAgICAgICAgY29udGV4dCA9IGFyZ3MgPSBudWxsO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfTtcblxuICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgIGNvbnRleHQgPSB0aGlzO1xuICAgICAgYXJncyA9IGFyZ3VtZW50cztcbiAgICAgIHRpbWVzdGFtcCA9IF8ubm93KCk7XG4gICAgICB2YXIgY2FsbE5vdyA9IGltbWVkaWF0ZSAmJiAhdGltZW91dDtcbiAgICAgIGlmICghdGltZW91dCkge1xuICAgICAgICB0aW1lb3V0ID0gc2V0VGltZW91dChsYXRlciwgd2FpdCk7XG4gICAgICB9XG4gICAgICBpZiAoY2FsbE5vdykge1xuICAgICAgICByZXN1bHQgPSBmdW5jLmFwcGx5KGNvbnRleHQsIGFyZ3MpO1xuICAgICAgICBjb250ZXh0ID0gYXJncyA9IG51bGw7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfTtcbiAgfTtcblxuICAvLyBSZXR1cm5zIGEgZnVuY3Rpb24gdGhhdCB3aWxsIGJlIGV4ZWN1dGVkIGF0IG1vc3Qgb25lIHRpbWUsIG5vIG1hdHRlciBob3dcbiAgLy8gb2Z0ZW4geW91IGNhbGwgaXQuIFVzZWZ1bCBmb3IgbGF6eSBpbml0aWFsaXphdGlvbi5cbiAgXy5vbmNlID0gZnVuY3Rpb24oZnVuYykge1xuICAgIHZhciByYW4gPSBmYWxzZSwgbWVtbztcbiAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICBpZiAocmFuKSByZXR1cm4gbWVtbztcbiAgICAgIHJhbiA9IHRydWU7XG4gICAgICBtZW1vID0gZnVuYy5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgZnVuYyA9IG51bGw7XG4gICAgICByZXR1cm4gbWVtbztcbiAgICB9O1xuICB9O1xuXG4gIC8vIFJldHVybnMgdGhlIGZpcnN0IGZ1bmN0aW9uIHBhc3NlZCBhcyBhbiBhcmd1bWVudCB0byB0aGUgc2Vjb25kLFxuICAvLyBhbGxvd2luZyB5b3UgdG8gYWRqdXN0IGFyZ3VtZW50cywgcnVuIGNvZGUgYmVmb3JlIGFuZCBhZnRlciwgYW5kXG4gIC8vIGNvbmRpdGlvbmFsbHkgZXhlY3V0ZSB0aGUgb3JpZ2luYWwgZnVuY3Rpb24uXG4gIF8ud3JhcCA9IGZ1bmN0aW9uKGZ1bmMsIHdyYXBwZXIpIHtcbiAgICByZXR1cm4gXy5wYXJ0aWFsKHdyYXBwZXIsIGZ1bmMpO1xuICB9O1xuXG4gIC8vIFJldHVybnMgYSBmdW5jdGlvbiB0aGF0IGlzIHRoZSBjb21wb3NpdGlvbiBvZiBhIGxpc3Qgb2YgZnVuY3Rpb25zLCBlYWNoXG4gIC8vIGNvbnN1bWluZyB0aGUgcmV0dXJuIHZhbHVlIG9mIHRoZSBmdW5jdGlvbiB0aGF0IGZvbGxvd3MuXG4gIF8uY29tcG9zZSA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBmdW5jcyA9IGFyZ3VtZW50cztcbiAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgYXJncyA9IGFyZ3VtZW50cztcbiAgICAgIGZvciAodmFyIGkgPSBmdW5jcy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgICBhcmdzID0gW2Z1bmNzW2ldLmFwcGx5KHRoaXMsIGFyZ3MpXTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBhcmdzWzBdO1xuICAgIH07XG4gIH07XG5cbiAgLy8gUmV0dXJucyBhIGZ1bmN0aW9uIHRoYXQgd2lsbCBvbmx5IGJlIGV4ZWN1dGVkIGFmdGVyIGJlaW5nIGNhbGxlZCBOIHRpbWVzLlxuICBfLmFmdGVyID0gZnVuY3Rpb24odGltZXMsIGZ1bmMpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICBpZiAoLS10aW1lcyA8IDEpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmMuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgIH1cbiAgICB9O1xuICB9O1xuXG4gIC8vIE9iamVjdCBGdW5jdGlvbnNcbiAgLy8gLS0tLS0tLS0tLS0tLS0tLVxuXG4gIC8vIFJldHJpZXZlIHRoZSBuYW1lcyBvZiBhbiBvYmplY3QncyBwcm9wZXJ0aWVzLlxuICAvLyBEZWxlZ2F0ZXMgdG8gKipFQ01BU2NyaXB0IDUqKidzIG5hdGl2ZSBgT2JqZWN0LmtleXNgXG4gIF8ua2V5cyA9IGZ1bmN0aW9uKG9iaikge1xuICAgIGlmICghXy5pc09iamVjdChvYmopKSByZXR1cm4gW107XG4gICAgaWYgKG5hdGl2ZUtleXMpIHJldHVybiBuYXRpdmVLZXlzKG9iaik7XG4gICAgdmFyIGtleXMgPSBbXTtcbiAgICBmb3IgKHZhciBrZXkgaW4gb2JqKSBpZiAoXy5oYXMob2JqLCBrZXkpKSBrZXlzLnB1c2goa2V5KTtcbiAgICByZXR1cm4ga2V5cztcbiAgfTtcblxuICAvLyBSZXRyaWV2ZSB0aGUgdmFsdWVzIG9mIGFuIG9iamVjdCdzIHByb3BlcnRpZXMuXG4gIF8udmFsdWVzID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgdmFyIGtleXMgPSBfLmtleXMob2JqKTtcbiAgICB2YXIgbGVuZ3RoID0ga2V5cy5sZW5ndGg7XG4gICAgdmFyIHZhbHVlcyA9IG5ldyBBcnJheShsZW5ndGgpO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhbHVlc1tpXSA9IG9ialtrZXlzW2ldXTtcbiAgICB9XG4gICAgcmV0dXJuIHZhbHVlcztcbiAgfTtcblxuICAvLyBDb252ZXJ0IGFuIG9iamVjdCBpbnRvIGEgbGlzdCBvZiBgW2tleSwgdmFsdWVdYCBwYWlycy5cbiAgXy5wYWlycyA9IGZ1bmN0aW9uKG9iaikge1xuICAgIHZhciBrZXlzID0gXy5rZXlzKG9iaik7XG4gICAgdmFyIGxlbmd0aCA9IGtleXMubGVuZ3RoO1xuICAgIHZhciBwYWlycyA9IG5ldyBBcnJheShsZW5ndGgpO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgIHBhaXJzW2ldID0gW2tleXNbaV0sIG9ialtrZXlzW2ldXV07XG4gICAgfVxuICAgIHJldHVybiBwYWlycztcbiAgfTtcblxuICAvLyBJbnZlcnQgdGhlIGtleXMgYW5kIHZhbHVlcyBvZiBhbiBvYmplY3QuIFRoZSB2YWx1ZXMgbXVzdCBiZSBzZXJpYWxpemFibGUuXG4gIF8uaW52ZXJ0ID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgdmFyIHJlc3VsdCA9IHt9O1xuICAgIHZhciBrZXlzID0gXy5rZXlzKG9iaik7XG4gICAgZm9yICh2YXIgaSA9IDAsIGxlbmd0aCA9IGtleXMubGVuZ3RoOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgIHJlc3VsdFtvYmpba2V5c1tpXV1dID0ga2V5c1tpXTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfTtcblxuICAvLyBSZXR1cm4gYSBzb3J0ZWQgbGlzdCBvZiB0aGUgZnVuY3Rpb24gbmFtZXMgYXZhaWxhYmxlIG9uIHRoZSBvYmplY3QuXG4gIC8vIEFsaWFzZWQgYXMgYG1ldGhvZHNgXG4gIF8uZnVuY3Rpb25zID0gXy5tZXRob2RzID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgdmFyIG5hbWVzID0gW107XG4gICAgZm9yICh2YXIga2V5IGluIG9iaikge1xuICAgICAgaWYgKF8uaXNGdW5jdGlvbihvYmpba2V5XSkpIG5hbWVzLnB1c2goa2V5KTtcbiAgICB9XG4gICAgcmV0dXJuIG5hbWVzLnNvcnQoKTtcbiAgfTtcblxuICAvLyBFeHRlbmQgYSBnaXZlbiBvYmplY3Qgd2l0aCBhbGwgdGhlIHByb3BlcnRpZXMgaW4gcGFzc2VkLWluIG9iamVjdChzKS5cbiAgXy5leHRlbmQgPSBmdW5jdGlvbihvYmopIHtcbiAgICBlYWNoKHNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKSwgZnVuY3Rpb24oc291cmNlKSB7XG4gICAgICBpZiAoc291cmNlKSB7XG4gICAgICAgIGZvciAodmFyIHByb3AgaW4gc291cmNlKSB7XG4gICAgICAgICAgb2JqW3Byb3BdID0gc291cmNlW3Byb3BdO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIG9iajtcbiAgfTtcblxuICAvLyBSZXR1cm4gYSBjb3B5IG9mIHRoZSBvYmplY3Qgb25seSBjb250YWluaW5nIHRoZSB3aGl0ZWxpc3RlZCBwcm9wZXJ0aWVzLlxuICBfLnBpY2sgPSBmdW5jdGlvbihvYmopIHtcbiAgICB2YXIgY29weSA9IHt9O1xuICAgIHZhciBrZXlzID0gY29uY2F0LmFwcGx5KEFycmF5UHJvdG8sIHNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKSk7XG4gICAgZWFjaChrZXlzLCBmdW5jdGlvbihrZXkpIHtcbiAgICAgIGlmIChrZXkgaW4gb2JqKSBjb3B5W2tleV0gPSBvYmpba2V5XTtcbiAgICB9KTtcbiAgICByZXR1cm4gY29weTtcbiAgfTtcblxuICAgLy8gUmV0dXJuIGEgY29weSBvZiB0aGUgb2JqZWN0IHdpdGhvdXQgdGhlIGJsYWNrbGlzdGVkIHByb3BlcnRpZXMuXG4gIF8ub21pdCA9IGZ1bmN0aW9uKG9iaikge1xuICAgIHZhciBjb3B5ID0ge307XG4gICAgdmFyIGtleXMgPSBjb25jYXQuYXBwbHkoQXJyYXlQcm90bywgc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpKTtcbiAgICBmb3IgKHZhciBrZXkgaW4gb2JqKSB7XG4gICAgICBpZiAoIV8uY29udGFpbnMoa2V5cywga2V5KSkgY29weVtrZXldID0gb2JqW2tleV07XG4gICAgfVxuICAgIHJldHVybiBjb3B5O1xuICB9O1xuXG4gIC8vIEZpbGwgaW4gYSBnaXZlbiBvYmplY3Qgd2l0aCBkZWZhdWx0IHByb3BlcnRpZXMuXG4gIF8uZGVmYXVsdHMgPSBmdW5jdGlvbihvYmopIHtcbiAgICBlYWNoKHNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKSwgZnVuY3Rpb24oc291cmNlKSB7XG4gICAgICBpZiAoc291cmNlKSB7XG4gICAgICAgIGZvciAodmFyIHByb3AgaW4gc291cmNlKSB7XG4gICAgICAgICAgaWYgKG9ialtwcm9wXSA9PT0gdm9pZCAwKSBvYmpbcHJvcF0gPSBzb3VyY2VbcHJvcF07XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gb2JqO1xuICB9O1xuXG4gIC8vIENyZWF0ZSBhIChzaGFsbG93LWNsb25lZCkgZHVwbGljYXRlIG9mIGFuIG9iamVjdC5cbiAgXy5jbG9uZSA9IGZ1bmN0aW9uKG9iaikge1xuICAgIGlmICghXy5pc09iamVjdChvYmopKSByZXR1cm4gb2JqO1xuICAgIHJldHVybiBfLmlzQXJyYXkob2JqKSA/IG9iai5zbGljZSgpIDogXy5leHRlbmQoe30sIG9iaik7XG4gIH07XG5cbiAgLy8gSW52b2tlcyBpbnRlcmNlcHRvciB3aXRoIHRoZSBvYmosIGFuZCB0aGVuIHJldHVybnMgb2JqLlxuICAvLyBUaGUgcHJpbWFyeSBwdXJwb3NlIG9mIHRoaXMgbWV0aG9kIGlzIHRvIFwidGFwIGludG9cIiBhIG1ldGhvZCBjaGFpbiwgaW5cbiAgLy8gb3JkZXIgdG8gcGVyZm9ybSBvcGVyYXRpb25zIG9uIGludGVybWVkaWF0ZSByZXN1bHRzIHdpdGhpbiB0aGUgY2hhaW4uXG4gIF8udGFwID0gZnVuY3Rpb24ob2JqLCBpbnRlcmNlcHRvcikge1xuICAgIGludGVyY2VwdG9yKG9iaik7XG4gICAgcmV0dXJuIG9iajtcbiAgfTtcblxuICAvLyBJbnRlcm5hbCByZWN1cnNpdmUgY29tcGFyaXNvbiBmdW5jdGlvbiBmb3IgYGlzRXF1YWxgLlxuICB2YXIgZXEgPSBmdW5jdGlvbihhLCBiLCBhU3RhY2ssIGJTdGFjaykge1xuICAgIC8vIElkZW50aWNhbCBvYmplY3RzIGFyZSBlcXVhbC4gYDAgPT09IC0wYCwgYnV0IHRoZXkgYXJlbid0IGlkZW50aWNhbC5cbiAgICAvLyBTZWUgdGhlIFtIYXJtb255IGBlZ2FsYCBwcm9wb3NhbF0oaHR0cDovL3dpa2kuZWNtYXNjcmlwdC5vcmcvZG9rdS5waHA/aWQ9aGFybW9ueTplZ2FsKS5cbiAgICBpZiAoYSA9PT0gYikgcmV0dXJuIGEgIT09IDAgfHwgMSAvIGEgPT0gMSAvIGI7XG4gICAgLy8gQSBzdHJpY3QgY29tcGFyaXNvbiBpcyBuZWNlc3NhcnkgYmVjYXVzZSBgbnVsbCA9PSB1bmRlZmluZWRgLlxuICAgIGlmIChhID09IG51bGwgfHwgYiA9PSBudWxsKSByZXR1cm4gYSA9PT0gYjtcbiAgICAvLyBVbndyYXAgYW55IHdyYXBwZWQgb2JqZWN0cy5cbiAgICBpZiAoYSBpbnN0YW5jZW9mIF8pIGEgPSBhLl93cmFwcGVkO1xuICAgIGlmIChiIGluc3RhbmNlb2YgXykgYiA9IGIuX3dyYXBwZWQ7XG4gICAgLy8gQ29tcGFyZSBgW1tDbGFzc11dYCBuYW1lcy5cbiAgICB2YXIgY2xhc3NOYW1lID0gdG9TdHJpbmcuY2FsbChhKTtcbiAgICBpZiAoY2xhc3NOYW1lICE9IHRvU3RyaW5nLmNhbGwoYikpIHJldHVybiBmYWxzZTtcbiAgICBzd2l0Y2ggKGNsYXNzTmFtZSkge1xuICAgICAgLy8gU3RyaW5ncywgbnVtYmVycywgZGF0ZXMsIGFuZCBib29sZWFucyBhcmUgY29tcGFyZWQgYnkgdmFsdWUuXG4gICAgICBjYXNlICdbb2JqZWN0IFN0cmluZ10nOlxuICAgICAgICAvLyBQcmltaXRpdmVzIGFuZCB0aGVpciBjb3JyZXNwb25kaW5nIG9iamVjdCB3cmFwcGVycyBhcmUgZXF1aXZhbGVudDsgdGh1cywgYFwiNVwiYCBpc1xuICAgICAgICAvLyBlcXVpdmFsZW50IHRvIGBuZXcgU3RyaW5nKFwiNVwiKWAuXG4gICAgICAgIHJldHVybiBhID09IFN0cmluZyhiKTtcbiAgICAgIGNhc2UgJ1tvYmplY3QgTnVtYmVyXSc6XG4gICAgICAgIC8vIGBOYU5gcyBhcmUgZXF1aXZhbGVudCwgYnV0IG5vbi1yZWZsZXhpdmUuIEFuIGBlZ2FsYCBjb21wYXJpc29uIGlzIHBlcmZvcm1lZCBmb3JcbiAgICAgICAgLy8gb3RoZXIgbnVtZXJpYyB2YWx1ZXMuXG4gICAgICAgIHJldHVybiBhICE9ICthID8gYiAhPSArYiA6IChhID09IDAgPyAxIC8gYSA9PSAxIC8gYiA6IGEgPT0gK2IpO1xuICAgICAgY2FzZSAnW29iamVjdCBEYXRlXSc6XG4gICAgICBjYXNlICdbb2JqZWN0IEJvb2xlYW5dJzpcbiAgICAgICAgLy8gQ29lcmNlIGRhdGVzIGFuZCBib29sZWFucyB0byBudW1lcmljIHByaW1pdGl2ZSB2YWx1ZXMuIERhdGVzIGFyZSBjb21wYXJlZCBieSB0aGVpclxuICAgICAgICAvLyBtaWxsaXNlY29uZCByZXByZXNlbnRhdGlvbnMuIE5vdGUgdGhhdCBpbnZhbGlkIGRhdGVzIHdpdGggbWlsbGlzZWNvbmQgcmVwcmVzZW50YXRpb25zXG4gICAgICAgIC8vIG9mIGBOYU5gIGFyZSBub3QgZXF1aXZhbGVudC5cbiAgICAgICAgcmV0dXJuICthID09ICtiO1xuICAgICAgLy8gUmVnRXhwcyBhcmUgY29tcGFyZWQgYnkgdGhlaXIgc291cmNlIHBhdHRlcm5zIGFuZCBmbGFncy5cbiAgICAgIGNhc2UgJ1tvYmplY3QgUmVnRXhwXSc6XG4gICAgICAgIHJldHVybiBhLnNvdXJjZSA9PSBiLnNvdXJjZSAmJlxuICAgICAgICAgICAgICAgYS5nbG9iYWwgPT0gYi5nbG9iYWwgJiZcbiAgICAgICAgICAgICAgIGEubXVsdGlsaW5lID09IGIubXVsdGlsaW5lICYmXG4gICAgICAgICAgICAgICBhLmlnbm9yZUNhc2UgPT0gYi5pZ25vcmVDYXNlO1xuICAgIH1cbiAgICBpZiAodHlwZW9mIGEgIT0gJ29iamVjdCcgfHwgdHlwZW9mIGIgIT0gJ29iamVjdCcpIHJldHVybiBmYWxzZTtcbiAgICAvLyBBc3N1bWUgZXF1YWxpdHkgZm9yIGN5Y2xpYyBzdHJ1Y3R1cmVzLiBUaGUgYWxnb3JpdGhtIGZvciBkZXRlY3RpbmcgY3ljbGljXG4gICAgLy8gc3RydWN0dXJlcyBpcyBhZGFwdGVkIGZyb20gRVMgNS4xIHNlY3Rpb24gMTUuMTIuMywgYWJzdHJhY3Qgb3BlcmF0aW9uIGBKT2AuXG4gICAgdmFyIGxlbmd0aCA9IGFTdGFjay5sZW5ndGg7XG4gICAgd2hpbGUgKGxlbmd0aC0tKSB7XG4gICAgICAvLyBMaW5lYXIgc2VhcmNoLiBQZXJmb3JtYW5jZSBpcyBpbnZlcnNlbHkgcHJvcG9ydGlvbmFsIHRvIHRoZSBudW1iZXIgb2ZcbiAgICAgIC8vIHVuaXF1ZSBuZXN0ZWQgc3RydWN0dXJlcy5cbiAgICAgIGlmIChhU3RhY2tbbGVuZ3RoXSA9PSBhKSByZXR1cm4gYlN0YWNrW2xlbmd0aF0gPT0gYjtcbiAgICB9XG4gICAgLy8gT2JqZWN0cyB3aXRoIGRpZmZlcmVudCBjb25zdHJ1Y3RvcnMgYXJlIG5vdCBlcXVpdmFsZW50LCBidXQgYE9iamVjdGBzXG4gICAgLy8gZnJvbSBkaWZmZXJlbnQgZnJhbWVzIGFyZS5cbiAgICB2YXIgYUN0b3IgPSBhLmNvbnN0cnVjdG9yLCBiQ3RvciA9IGIuY29uc3RydWN0b3I7XG4gICAgaWYgKGFDdG9yICE9PSBiQ3RvciAmJiAhKF8uaXNGdW5jdGlvbihhQ3RvcikgJiYgKGFDdG9yIGluc3RhbmNlb2YgYUN0b3IpICYmXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIF8uaXNGdW5jdGlvbihiQ3RvcikgJiYgKGJDdG9yIGluc3RhbmNlb2YgYkN0b3IpKVxuICAgICAgICAgICAgICAgICAgICAgICAgJiYgKCdjb25zdHJ1Y3RvcicgaW4gYSAmJiAnY29uc3RydWN0b3InIGluIGIpKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIC8vIEFkZCB0aGUgZmlyc3Qgb2JqZWN0IHRvIHRoZSBzdGFjayBvZiB0cmF2ZXJzZWQgb2JqZWN0cy5cbiAgICBhU3RhY2sucHVzaChhKTtcbiAgICBiU3RhY2sucHVzaChiKTtcbiAgICB2YXIgc2l6ZSA9IDAsIHJlc3VsdCA9IHRydWU7XG4gICAgLy8gUmVjdXJzaXZlbHkgY29tcGFyZSBvYmplY3RzIGFuZCBhcnJheXMuXG4gICAgaWYgKGNsYXNzTmFtZSA9PSAnW29iamVjdCBBcnJheV0nKSB7XG4gICAgICAvLyBDb21wYXJlIGFycmF5IGxlbmd0aHMgdG8gZGV0ZXJtaW5lIGlmIGEgZGVlcCBjb21wYXJpc29uIGlzIG5lY2Vzc2FyeS5cbiAgICAgIHNpemUgPSBhLmxlbmd0aDtcbiAgICAgIHJlc3VsdCA9IHNpemUgPT0gYi5sZW5ndGg7XG4gICAgICBpZiAocmVzdWx0KSB7XG4gICAgICAgIC8vIERlZXAgY29tcGFyZSB0aGUgY29udGVudHMsIGlnbm9yaW5nIG5vbi1udW1lcmljIHByb3BlcnRpZXMuXG4gICAgICAgIHdoaWxlIChzaXplLS0pIHtcbiAgICAgICAgICBpZiAoIShyZXN1bHQgPSBlcShhW3NpemVdLCBiW3NpemVdLCBhU3RhY2ssIGJTdGFjaykpKSBicmVhaztcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICAvLyBEZWVwIGNvbXBhcmUgb2JqZWN0cy5cbiAgICAgIGZvciAodmFyIGtleSBpbiBhKSB7XG4gICAgICAgIGlmIChfLmhhcyhhLCBrZXkpKSB7XG4gICAgICAgICAgLy8gQ291bnQgdGhlIGV4cGVjdGVkIG51bWJlciBvZiBwcm9wZXJ0aWVzLlxuICAgICAgICAgIHNpemUrKztcbiAgICAgICAgICAvLyBEZWVwIGNvbXBhcmUgZWFjaCBtZW1iZXIuXG4gICAgICAgICAgaWYgKCEocmVzdWx0ID0gXy5oYXMoYiwga2V5KSAmJiBlcShhW2tleV0sIGJba2V5XSwgYVN0YWNrLCBiU3RhY2spKSkgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIC8vIEVuc3VyZSB0aGF0IGJvdGggb2JqZWN0cyBjb250YWluIHRoZSBzYW1lIG51bWJlciBvZiBwcm9wZXJ0aWVzLlxuICAgICAgaWYgKHJlc3VsdCkge1xuICAgICAgICBmb3IgKGtleSBpbiBiKSB7XG4gICAgICAgICAgaWYgKF8uaGFzKGIsIGtleSkgJiYgIShzaXplLS0pKSBicmVhaztcbiAgICAgICAgfVxuICAgICAgICByZXN1bHQgPSAhc2l6ZTtcbiAgICAgIH1cbiAgICB9XG4gICAgLy8gUmVtb3ZlIHRoZSBmaXJzdCBvYmplY3QgZnJvbSB0aGUgc3RhY2sgb2YgdHJhdmVyc2VkIG9iamVjdHMuXG4gICAgYVN0YWNrLnBvcCgpO1xuICAgIGJTdGFjay5wb3AoKTtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9O1xuXG4gIC8vIFBlcmZvcm0gYSBkZWVwIGNvbXBhcmlzb24gdG8gY2hlY2sgaWYgdHdvIG9iamVjdHMgYXJlIGVxdWFsLlxuICBfLmlzRXF1YWwgPSBmdW5jdGlvbihhLCBiKSB7XG4gICAgcmV0dXJuIGVxKGEsIGIsIFtdLCBbXSk7XG4gIH07XG5cbiAgLy8gSXMgYSBnaXZlbiBhcnJheSwgc3RyaW5nLCBvciBvYmplY3QgZW1wdHk/XG4gIC8vIEFuIFwiZW1wdHlcIiBvYmplY3QgaGFzIG5vIGVudW1lcmFibGUgb3duLXByb3BlcnRpZXMuXG4gIF8uaXNFbXB0eSA9IGZ1bmN0aW9uKG9iaikge1xuICAgIGlmIChvYmogPT0gbnVsbCkgcmV0dXJuIHRydWU7XG4gICAgaWYgKF8uaXNBcnJheShvYmopIHx8IF8uaXNTdHJpbmcob2JqKSkgcmV0dXJuIG9iai5sZW5ndGggPT09IDA7XG4gICAgZm9yICh2YXIga2V5IGluIG9iaikgaWYgKF8uaGFzKG9iaiwga2V5KSkgcmV0dXJuIGZhbHNlO1xuICAgIHJldHVybiB0cnVlO1xuICB9O1xuXG4gIC8vIElzIGEgZ2l2ZW4gdmFsdWUgYSBET00gZWxlbWVudD9cbiAgXy5pc0VsZW1lbnQgPSBmdW5jdGlvbihvYmopIHtcbiAgICByZXR1cm4gISEob2JqICYmIG9iai5ub2RlVHlwZSA9PT0gMSk7XG4gIH07XG5cbiAgLy8gSXMgYSBnaXZlbiB2YWx1ZSBhbiBhcnJheT9cbiAgLy8gRGVsZWdhdGVzIHRvIEVDTUE1J3MgbmF0aXZlIEFycmF5LmlzQXJyYXlcbiAgXy5pc0FycmF5ID0gbmF0aXZlSXNBcnJheSB8fCBmdW5jdGlvbihvYmopIHtcbiAgICByZXR1cm4gdG9TdHJpbmcuY2FsbChvYmopID09ICdbb2JqZWN0IEFycmF5XSc7XG4gIH07XG5cbiAgLy8gSXMgYSBnaXZlbiB2YXJpYWJsZSBhbiBvYmplY3Q/XG4gIF8uaXNPYmplY3QgPSBmdW5jdGlvbihvYmopIHtcbiAgICByZXR1cm4gb2JqID09PSBPYmplY3Qob2JqKTtcbiAgfTtcblxuICAvLyBBZGQgc29tZSBpc1R5cGUgbWV0aG9kczogaXNBcmd1bWVudHMsIGlzRnVuY3Rpb24sIGlzU3RyaW5nLCBpc051bWJlciwgaXNEYXRlLCBpc1JlZ0V4cC5cbiAgZWFjaChbJ0FyZ3VtZW50cycsICdGdW5jdGlvbicsICdTdHJpbmcnLCAnTnVtYmVyJywgJ0RhdGUnLCAnUmVnRXhwJ10sIGZ1bmN0aW9uKG5hbWUpIHtcbiAgICBfWydpcycgKyBuYW1lXSA9IGZ1bmN0aW9uKG9iaikge1xuICAgICAgcmV0dXJuIHRvU3RyaW5nLmNhbGwob2JqKSA9PSAnW29iamVjdCAnICsgbmFtZSArICddJztcbiAgICB9O1xuICB9KTtcblxuICAvLyBEZWZpbmUgYSBmYWxsYmFjayB2ZXJzaW9uIG9mIHRoZSBtZXRob2QgaW4gYnJvd3NlcnMgKGFoZW0sIElFKSwgd2hlcmVcbiAgLy8gdGhlcmUgaXNuJ3QgYW55IGluc3BlY3RhYmxlIFwiQXJndW1lbnRzXCIgdHlwZS5cbiAgaWYgKCFfLmlzQXJndW1lbnRzKGFyZ3VtZW50cykpIHtcbiAgICBfLmlzQXJndW1lbnRzID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgICByZXR1cm4gISEob2JqICYmIF8uaGFzKG9iaiwgJ2NhbGxlZScpKTtcbiAgICB9O1xuICB9XG5cbiAgLy8gT3B0aW1pemUgYGlzRnVuY3Rpb25gIGlmIGFwcHJvcHJpYXRlLlxuICBpZiAodHlwZW9mICgvLi8pICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgXy5pc0Z1bmN0aW9uID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgICByZXR1cm4gdHlwZW9mIG9iaiA9PT0gJ2Z1bmN0aW9uJztcbiAgICB9O1xuICB9XG5cbiAgLy8gSXMgYSBnaXZlbiBvYmplY3QgYSBmaW5pdGUgbnVtYmVyP1xuICBfLmlzRmluaXRlID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgcmV0dXJuIGlzRmluaXRlKG9iaikgJiYgIWlzTmFOKHBhcnNlRmxvYXQob2JqKSk7XG4gIH07XG5cbiAgLy8gSXMgdGhlIGdpdmVuIHZhbHVlIGBOYU5gPyAoTmFOIGlzIHRoZSBvbmx5IG51bWJlciB3aGljaCBkb2VzIG5vdCBlcXVhbCBpdHNlbGYpLlxuICBfLmlzTmFOID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgcmV0dXJuIF8uaXNOdW1iZXIob2JqKSAmJiBvYmogIT0gK29iajtcbiAgfTtcblxuICAvLyBJcyBhIGdpdmVuIHZhbHVlIGEgYm9vbGVhbj9cbiAgXy5pc0Jvb2xlYW4gPSBmdW5jdGlvbihvYmopIHtcbiAgICByZXR1cm4gb2JqID09PSB0cnVlIHx8IG9iaiA9PT0gZmFsc2UgfHwgdG9TdHJpbmcuY2FsbChvYmopID09ICdbb2JqZWN0IEJvb2xlYW5dJztcbiAgfTtcblxuICAvLyBJcyBhIGdpdmVuIHZhbHVlIGVxdWFsIHRvIG51bGw/XG4gIF8uaXNOdWxsID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgcmV0dXJuIG9iaiA9PT0gbnVsbDtcbiAgfTtcblxuICAvLyBJcyBhIGdpdmVuIHZhcmlhYmxlIHVuZGVmaW5lZD9cbiAgXy5pc1VuZGVmaW5lZCA9IGZ1bmN0aW9uKG9iaikge1xuICAgIHJldHVybiBvYmogPT09IHZvaWQgMDtcbiAgfTtcblxuICAvLyBTaG9ydGN1dCBmdW5jdGlvbiBmb3IgY2hlY2tpbmcgaWYgYW4gb2JqZWN0IGhhcyBhIGdpdmVuIHByb3BlcnR5IGRpcmVjdGx5XG4gIC8vIG9uIGl0c2VsZiAoaW4gb3RoZXIgd29yZHMsIG5vdCBvbiBhIHByb3RvdHlwZSkuXG4gIF8uaGFzID0gZnVuY3Rpb24ob2JqLCBrZXkpIHtcbiAgICByZXR1cm4gaGFzT3duUHJvcGVydHkuY2FsbChvYmosIGtleSk7XG4gIH07XG5cbiAgLy8gVXRpbGl0eSBGdW5jdGlvbnNcbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS1cblxuICAvLyBSdW4gVW5kZXJzY29yZS5qcyBpbiAqbm9Db25mbGljdCogbW9kZSwgcmV0dXJuaW5nIHRoZSBgX2AgdmFyaWFibGUgdG8gaXRzXG4gIC8vIHByZXZpb3VzIG93bmVyLiBSZXR1cm5zIGEgcmVmZXJlbmNlIHRvIHRoZSBVbmRlcnNjb3JlIG9iamVjdC5cbiAgXy5ub0NvbmZsaWN0ID0gZnVuY3Rpb24oKSB7XG4gICAgcm9vdC5fID0gcHJldmlvdXNVbmRlcnNjb3JlO1xuICAgIHJldHVybiB0aGlzO1xuICB9O1xuXG4gIC8vIEtlZXAgdGhlIGlkZW50aXR5IGZ1bmN0aW9uIGFyb3VuZCBmb3IgZGVmYXVsdCBpdGVyYXRvcnMuXG4gIF8uaWRlbnRpdHkgPSBmdW5jdGlvbih2YWx1ZSkge1xuICAgIHJldHVybiB2YWx1ZTtcbiAgfTtcblxuICBfLmNvbnN0YW50ID0gZnVuY3Rpb24odmFsdWUpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIH07XG4gIH07XG5cbiAgXy5wcm9wZXJ0eSA9IGZ1bmN0aW9uKGtleSkge1xuICAgIHJldHVybiBmdW5jdGlvbihvYmopIHtcbiAgICAgIHJldHVybiBvYmpba2V5XTtcbiAgICB9O1xuICB9O1xuXG4gIC8vIFJldHVybnMgYSBwcmVkaWNhdGUgZm9yIGNoZWNraW5nIHdoZXRoZXIgYW4gb2JqZWN0IGhhcyBhIGdpdmVuIHNldCBvZiBga2V5OnZhbHVlYCBwYWlycy5cbiAgXy5tYXRjaGVzID0gZnVuY3Rpb24oYXR0cnMpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24ob2JqKSB7XG4gICAgICBpZiAob2JqID09PSBhdHRycykgcmV0dXJuIHRydWU7IC8vYXZvaWQgY29tcGFyaW5nIGFuIG9iamVjdCB0byBpdHNlbGYuXG4gICAgICBmb3IgKHZhciBrZXkgaW4gYXR0cnMpIHtcbiAgICAgICAgaWYgKGF0dHJzW2tleV0gIT09IG9ialtrZXldKVxuICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgfTtcblxuICAvLyBSdW4gYSBmdW5jdGlvbiAqKm4qKiB0aW1lcy5cbiAgXy50aW1lcyA9IGZ1bmN0aW9uKG4sIGl0ZXJhdG9yLCBjb250ZXh0KSB7XG4gICAgdmFyIGFjY3VtID0gQXJyYXkoTWF0aC5tYXgoMCwgbikpO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbjsgaSsrKSBhY2N1bVtpXSA9IGl0ZXJhdG9yLmNhbGwoY29udGV4dCwgaSk7XG4gICAgcmV0dXJuIGFjY3VtO1xuICB9O1xuXG4gIC8vIFJldHVybiBhIHJhbmRvbSBpbnRlZ2VyIGJldHdlZW4gbWluIGFuZCBtYXggKGluY2x1c2l2ZSkuXG4gIF8ucmFuZG9tID0gZnVuY3Rpb24obWluLCBtYXgpIHtcbiAgICBpZiAobWF4ID09IG51bGwpIHtcbiAgICAgIG1heCA9IG1pbjtcbiAgICAgIG1pbiA9IDA7XG4gICAgfVxuICAgIHJldHVybiBtaW4gKyBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAobWF4IC0gbWluICsgMSkpO1xuICB9O1xuXG4gIC8vIEEgKHBvc3NpYmx5IGZhc3Rlcikgd2F5IHRvIGdldCB0aGUgY3VycmVudCB0aW1lc3RhbXAgYXMgYW4gaW50ZWdlci5cbiAgXy5ub3cgPSBEYXRlLm5vdyB8fCBmdW5jdGlvbigpIHsgcmV0dXJuIG5ldyBEYXRlKCkuZ2V0VGltZSgpOyB9O1xuXG4gIC8vIExpc3Qgb2YgSFRNTCBlbnRpdGllcyBmb3IgZXNjYXBpbmcuXG4gIHZhciBlbnRpdHlNYXAgPSB7XG4gICAgZXNjYXBlOiB7XG4gICAgICAnJic6ICcmYW1wOycsXG4gICAgICAnPCc6ICcmbHQ7JyxcbiAgICAgICc+JzogJyZndDsnLFxuICAgICAgJ1wiJzogJyZxdW90OycsXG4gICAgICBcIidcIjogJyYjeDI3OydcbiAgICB9XG4gIH07XG4gIGVudGl0eU1hcC51bmVzY2FwZSA9IF8uaW52ZXJ0KGVudGl0eU1hcC5lc2NhcGUpO1xuXG4gIC8vIFJlZ2V4ZXMgY29udGFpbmluZyB0aGUga2V5cyBhbmQgdmFsdWVzIGxpc3RlZCBpbW1lZGlhdGVseSBhYm92ZS5cbiAgdmFyIGVudGl0eVJlZ2V4ZXMgPSB7XG4gICAgZXNjYXBlOiAgIG5ldyBSZWdFeHAoJ1snICsgXy5rZXlzKGVudGl0eU1hcC5lc2NhcGUpLmpvaW4oJycpICsgJ10nLCAnZycpLFxuICAgIHVuZXNjYXBlOiBuZXcgUmVnRXhwKCcoJyArIF8ua2V5cyhlbnRpdHlNYXAudW5lc2NhcGUpLmpvaW4oJ3wnKSArICcpJywgJ2cnKVxuICB9O1xuXG4gIC8vIEZ1bmN0aW9ucyBmb3IgZXNjYXBpbmcgYW5kIHVuZXNjYXBpbmcgc3RyaW5ncyB0by9mcm9tIEhUTUwgaW50ZXJwb2xhdGlvbi5cbiAgXy5lYWNoKFsnZXNjYXBlJywgJ3VuZXNjYXBlJ10sIGZ1bmN0aW9uKG1ldGhvZCkge1xuICAgIF9bbWV0aG9kXSA9IGZ1bmN0aW9uKHN0cmluZykge1xuICAgICAgaWYgKHN0cmluZyA9PSBudWxsKSByZXR1cm4gJyc7XG4gICAgICByZXR1cm4gKCcnICsgc3RyaW5nKS5yZXBsYWNlKGVudGl0eVJlZ2V4ZXNbbWV0aG9kXSwgZnVuY3Rpb24obWF0Y2gpIHtcbiAgICAgICAgcmV0dXJuIGVudGl0eU1hcFttZXRob2RdW21hdGNoXTtcbiAgICAgIH0pO1xuICAgIH07XG4gIH0pO1xuXG4gIC8vIElmIHRoZSB2YWx1ZSBvZiB0aGUgbmFtZWQgYHByb3BlcnR5YCBpcyBhIGZ1bmN0aW9uIHRoZW4gaW52b2tlIGl0IHdpdGggdGhlXG4gIC8vIGBvYmplY3RgIGFzIGNvbnRleHQ7IG90aGVyd2lzZSwgcmV0dXJuIGl0LlxuICBfLnJlc3VsdCA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHtcbiAgICBpZiAob2JqZWN0ID09IG51bGwpIHJldHVybiB2b2lkIDA7XG4gICAgdmFyIHZhbHVlID0gb2JqZWN0W3Byb3BlcnR5XTtcbiAgICByZXR1cm4gXy5pc0Z1bmN0aW9uKHZhbHVlKSA/IHZhbHVlLmNhbGwob2JqZWN0KSA6IHZhbHVlO1xuICB9O1xuXG4gIC8vIEFkZCB5b3VyIG93biBjdXN0b20gZnVuY3Rpb25zIHRvIHRoZSBVbmRlcnNjb3JlIG9iamVjdC5cbiAgXy5taXhpbiA9IGZ1bmN0aW9uKG9iaikge1xuICAgIGVhY2goXy5mdW5jdGlvbnMob2JqKSwgZnVuY3Rpb24obmFtZSkge1xuICAgICAgdmFyIGZ1bmMgPSBfW25hbWVdID0gb2JqW25hbWVdO1xuICAgICAgXy5wcm90b3R5cGVbbmFtZV0gPSBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGFyZ3MgPSBbdGhpcy5fd3JhcHBlZF07XG4gICAgICAgIHB1c2guYXBwbHkoYXJncywgYXJndW1lbnRzKTtcbiAgICAgICAgcmV0dXJuIHJlc3VsdC5jYWxsKHRoaXMsIGZ1bmMuYXBwbHkoXywgYXJncykpO1xuICAgICAgfTtcbiAgICB9KTtcbiAgfTtcblxuICAvLyBHZW5lcmF0ZSBhIHVuaXF1ZSBpbnRlZ2VyIGlkICh1bmlxdWUgd2l0aGluIHRoZSBlbnRpcmUgY2xpZW50IHNlc3Npb24pLlxuICAvLyBVc2VmdWwgZm9yIHRlbXBvcmFyeSBET00gaWRzLlxuICB2YXIgaWRDb3VudGVyID0gMDtcbiAgXy51bmlxdWVJZCA9IGZ1bmN0aW9uKHByZWZpeCkge1xuICAgIHZhciBpZCA9ICsraWRDb3VudGVyICsgJyc7XG4gICAgcmV0dXJuIHByZWZpeCA/IHByZWZpeCArIGlkIDogaWQ7XG4gIH07XG5cbiAgLy8gQnkgZGVmYXVsdCwgVW5kZXJzY29yZSB1c2VzIEVSQi1zdHlsZSB0ZW1wbGF0ZSBkZWxpbWl0ZXJzLCBjaGFuZ2UgdGhlXG4gIC8vIGZvbGxvd2luZyB0ZW1wbGF0ZSBzZXR0aW5ncyB0byB1c2UgYWx0ZXJuYXRpdmUgZGVsaW1pdGVycy5cbiAgXy50ZW1wbGF0ZVNldHRpbmdzID0ge1xuICAgIGV2YWx1YXRlICAgIDogLzwlKFtcXHNcXFNdKz8pJT4vZyxcbiAgICBpbnRlcnBvbGF0ZSA6IC88JT0oW1xcc1xcU10rPyklPi9nLFxuICAgIGVzY2FwZSAgICAgIDogLzwlLShbXFxzXFxTXSs/KSU+L2dcbiAgfTtcblxuICAvLyBXaGVuIGN1c3RvbWl6aW5nIGB0ZW1wbGF0ZVNldHRpbmdzYCwgaWYgeW91IGRvbid0IHdhbnQgdG8gZGVmaW5lIGFuXG4gIC8vIGludGVycG9sYXRpb24sIGV2YWx1YXRpb24gb3IgZXNjYXBpbmcgcmVnZXgsIHdlIG5lZWQgb25lIHRoYXQgaXNcbiAgLy8gZ3VhcmFudGVlZCBub3QgdG8gbWF0Y2guXG4gIHZhciBub01hdGNoID0gLyguKV4vO1xuXG4gIC8vIENlcnRhaW4gY2hhcmFjdGVycyBuZWVkIHRvIGJlIGVzY2FwZWQgc28gdGhhdCB0aGV5IGNhbiBiZSBwdXQgaW50byBhXG4gIC8vIHN0cmluZyBsaXRlcmFsLlxuICB2YXIgZXNjYXBlcyA9IHtcbiAgICBcIidcIjogICAgICBcIidcIixcbiAgICAnXFxcXCc6ICAgICAnXFxcXCcsXG4gICAgJ1xccic6ICAgICAncicsXG4gICAgJ1xcbic6ICAgICAnbicsXG4gICAgJ1xcdCc6ICAgICAndCcsXG4gICAgJ1xcdTIwMjgnOiAndTIwMjgnLFxuICAgICdcXHUyMDI5JzogJ3UyMDI5J1xuICB9O1xuXG4gIHZhciBlc2NhcGVyID0gL1xcXFx8J3xcXHJ8XFxufFxcdHxcXHUyMDI4fFxcdTIwMjkvZztcblxuICAvLyBKYXZhU2NyaXB0IG1pY3JvLXRlbXBsYXRpbmcsIHNpbWlsYXIgdG8gSm9obiBSZXNpZydzIGltcGxlbWVudGF0aW9uLlxuICAvLyBVbmRlcnNjb3JlIHRlbXBsYXRpbmcgaGFuZGxlcyBhcmJpdHJhcnkgZGVsaW1pdGVycywgcHJlc2VydmVzIHdoaXRlc3BhY2UsXG4gIC8vIGFuZCBjb3JyZWN0bHkgZXNjYXBlcyBxdW90ZXMgd2l0aGluIGludGVycG9sYXRlZCBjb2RlLlxuICBfLnRlbXBsYXRlID0gZnVuY3Rpb24odGV4dCwgZGF0YSwgc2V0dGluZ3MpIHtcbiAgICB2YXIgcmVuZGVyO1xuICAgIHNldHRpbmdzID0gXy5kZWZhdWx0cyh7fSwgc2V0dGluZ3MsIF8udGVtcGxhdGVTZXR0aW5ncyk7XG5cbiAgICAvLyBDb21iaW5lIGRlbGltaXRlcnMgaW50byBvbmUgcmVndWxhciBleHByZXNzaW9uIHZpYSBhbHRlcm5hdGlvbi5cbiAgICB2YXIgbWF0Y2hlciA9IG5ldyBSZWdFeHAoW1xuICAgICAgKHNldHRpbmdzLmVzY2FwZSB8fCBub01hdGNoKS5zb3VyY2UsXG4gICAgICAoc2V0dGluZ3MuaW50ZXJwb2xhdGUgfHwgbm9NYXRjaCkuc291cmNlLFxuICAgICAgKHNldHRpbmdzLmV2YWx1YXRlIHx8IG5vTWF0Y2gpLnNvdXJjZVxuICAgIF0uam9pbignfCcpICsgJ3wkJywgJ2cnKTtcblxuICAgIC8vIENvbXBpbGUgdGhlIHRlbXBsYXRlIHNvdXJjZSwgZXNjYXBpbmcgc3RyaW5nIGxpdGVyYWxzIGFwcHJvcHJpYXRlbHkuXG4gICAgdmFyIGluZGV4ID0gMDtcbiAgICB2YXIgc291cmNlID0gXCJfX3ArPSdcIjtcbiAgICB0ZXh0LnJlcGxhY2UobWF0Y2hlciwgZnVuY3Rpb24obWF0Y2gsIGVzY2FwZSwgaW50ZXJwb2xhdGUsIGV2YWx1YXRlLCBvZmZzZXQpIHtcbiAgICAgIHNvdXJjZSArPSB0ZXh0LnNsaWNlKGluZGV4LCBvZmZzZXQpXG4gICAgICAgIC5yZXBsYWNlKGVzY2FwZXIsIGZ1bmN0aW9uKG1hdGNoKSB7IHJldHVybiAnXFxcXCcgKyBlc2NhcGVzW21hdGNoXTsgfSk7XG5cbiAgICAgIGlmIChlc2NhcGUpIHtcbiAgICAgICAgc291cmNlICs9IFwiJytcXG4oKF9fdD0oXCIgKyBlc2NhcGUgKyBcIikpPT1udWxsPycnOl8uZXNjYXBlKF9fdCkpK1xcbidcIjtcbiAgICAgIH1cbiAgICAgIGlmIChpbnRlcnBvbGF0ZSkge1xuICAgICAgICBzb3VyY2UgKz0gXCInK1xcbigoX190PShcIiArIGludGVycG9sYXRlICsgXCIpKT09bnVsbD8nJzpfX3QpK1xcbidcIjtcbiAgICAgIH1cbiAgICAgIGlmIChldmFsdWF0ZSkge1xuICAgICAgICBzb3VyY2UgKz0gXCInO1xcblwiICsgZXZhbHVhdGUgKyBcIlxcbl9fcCs9J1wiO1xuICAgICAgfVxuICAgICAgaW5kZXggPSBvZmZzZXQgKyBtYXRjaC5sZW5ndGg7XG4gICAgICByZXR1cm4gbWF0Y2g7XG4gICAgfSk7XG4gICAgc291cmNlICs9IFwiJztcXG5cIjtcblxuICAgIC8vIElmIGEgdmFyaWFibGUgaXMgbm90IHNwZWNpZmllZCwgcGxhY2UgZGF0YSB2YWx1ZXMgaW4gbG9jYWwgc2NvcGUuXG4gICAgaWYgKCFzZXR0aW5ncy52YXJpYWJsZSkgc291cmNlID0gJ3dpdGgob2JqfHx7fSl7XFxuJyArIHNvdXJjZSArICd9XFxuJztcblxuICAgIHNvdXJjZSA9IFwidmFyIF9fdCxfX3A9JycsX19qPUFycmF5LnByb3RvdHlwZS5qb2luLFwiICtcbiAgICAgIFwicHJpbnQ9ZnVuY3Rpb24oKXtfX3ArPV9fai5jYWxsKGFyZ3VtZW50cywnJyk7fTtcXG5cIiArXG4gICAgICBzb3VyY2UgKyBcInJldHVybiBfX3A7XFxuXCI7XG5cbiAgICB0cnkge1xuICAgICAgcmVuZGVyID0gbmV3IEZ1bmN0aW9uKHNldHRpbmdzLnZhcmlhYmxlIHx8ICdvYmonLCAnXycsIHNvdXJjZSk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgZS5zb3VyY2UgPSBzb3VyY2U7XG4gICAgICB0aHJvdyBlO1xuICAgIH1cblxuICAgIGlmIChkYXRhKSByZXR1cm4gcmVuZGVyKGRhdGEsIF8pO1xuICAgIHZhciB0ZW1wbGF0ZSA9IGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgIHJldHVybiByZW5kZXIuY2FsbCh0aGlzLCBkYXRhLCBfKTtcbiAgICB9O1xuXG4gICAgLy8gUHJvdmlkZSB0aGUgY29tcGlsZWQgZnVuY3Rpb24gc291cmNlIGFzIGEgY29udmVuaWVuY2UgZm9yIHByZWNvbXBpbGF0aW9uLlxuICAgIHRlbXBsYXRlLnNvdXJjZSA9ICdmdW5jdGlvbignICsgKHNldHRpbmdzLnZhcmlhYmxlIHx8ICdvYmonKSArICcpe1xcbicgKyBzb3VyY2UgKyAnfSc7XG5cbiAgICByZXR1cm4gdGVtcGxhdGU7XG4gIH07XG5cbiAgLy8gQWRkIGEgXCJjaGFpblwiIGZ1bmN0aW9uLCB3aGljaCB3aWxsIGRlbGVnYXRlIHRvIHRoZSB3cmFwcGVyLlxuICBfLmNoYWluID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgcmV0dXJuIF8ob2JqKS5jaGFpbigpO1xuICB9O1xuXG4gIC8vIE9PUFxuICAvLyAtLS0tLS0tLS0tLS0tLS1cbiAgLy8gSWYgVW5kZXJzY29yZSBpcyBjYWxsZWQgYXMgYSBmdW5jdGlvbiwgaXQgcmV0dXJucyBhIHdyYXBwZWQgb2JqZWN0IHRoYXRcbiAgLy8gY2FuIGJlIHVzZWQgT08tc3R5bGUuIFRoaXMgd3JhcHBlciBob2xkcyBhbHRlcmVkIHZlcnNpb25zIG9mIGFsbCB0aGVcbiAgLy8gdW5kZXJzY29yZSBmdW5jdGlvbnMuIFdyYXBwZWQgb2JqZWN0cyBtYXkgYmUgY2hhaW5lZC5cblxuICAvLyBIZWxwZXIgZnVuY3Rpb24gdG8gY29udGludWUgY2hhaW5pbmcgaW50ZXJtZWRpYXRlIHJlc3VsdHMuXG4gIHZhciByZXN1bHQgPSBmdW5jdGlvbihvYmopIHtcbiAgICByZXR1cm4gdGhpcy5fY2hhaW4gPyBfKG9iaikuY2hhaW4oKSA6IG9iajtcbiAgfTtcblxuICAvLyBBZGQgYWxsIG9mIHRoZSBVbmRlcnNjb3JlIGZ1bmN0aW9ucyB0byB0aGUgd3JhcHBlciBvYmplY3QuXG4gIF8ubWl4aW4oXyk7XG5cbiAgLy8gQWRkIGFsbCBtdXRhdG9yIEFycmF5IGZ1bmN0aW9ucyB0byB0aGUgd3JhcHBlci5cbiAgZWFjaChbJ3BvcCcsICdwdXNoJywgJ3JldmVyc2UnLCAnc2hpZnQnLCAnc29ydCcsICdzcGxpY2UnLCAndW5zaGlmdCddLCBmdW5jdGlvbihuYW1lKSB7XG4gICAgdmFyIG1ldGhvZCA9IEFycmF5UHJvdG9bbmFtZV07XG4gICAgXy5wcm90b3R5cGVbbmFtZV0gPSBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBvYmogPSB0aGlzLl93cmFwcGVkO1xuICAgICAgbWV0aG9kLmFwcGx5KG9iaiwgYXJndW1lbnRzKTtcbiAgICAgIGlmICgobmFtZSA9PSAnc2hpZnQnIHx8IG5hbWUgPT0gJ3NwbGljZScpICYmIG9iai5sZW5ndGggPT09IDApIGRlbGV0ZSBvYmpbMF07XG4gICAgICByZXR1cm4gcmVzdWx0LmNhbGwodGhpcywgb2JqKTtcbiAgICB9O1xuICB9KTtcblxuICAvLyBBZGQgYWxsIGFjY2Vzc29yIEFycmF5IGZ1bmN0aW9ucyB0byB0aGUgd3JhcHBlci5cbiAgZWFjaChbJ2NvbmNhdCcsICdqb2luJywgJ3NsaWNlJ10sIGZ1bmN0aW9uKG5hbWUpIHtcbiAgICB2YXIgbWV0aG9kID0gQXJyYXlQcm90b1tuYW1lXTtcbiAgICBfLnByb3RvdHlwZVtuYW1lXSA9IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHJlc3VsdC5jYWxsKHRoaXMsIG1ldGhvZC5hcHBseSh0aGlzLl93cmFwcGVkLCBhcmd1bWVudHMpKTtcbiAgICB9O1xuICB9KTtcblxuICBfLmV4dGVuZChfLnByb3RvdHlwZSwge1xuXG4gICAgLy8gU3RhcnQgY2hhaW5pbmcgYSB3cmFwcGVkIFVuZGVyc2NvcmUgb2JqZWN0LlxuICAgIGNoYWluOiBmdW5jdGlvbigpIHtcbiAgICAgIHRoaXMuX2NoYWluID0gdHJ1ZTtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG5cbiAgICAvLyBFeHRyYWN0cyB0aGUgcmVzdWx0IGZyb20gYSB3cmFwcGVkIGFuZCBjaGFpbmVkIG9iamVjdC5cbiAgICB2YWx1ZTogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gdGhpcy5fd3JhcHBlZDtcbiAgICB9XG5cbiAgfSk7XG5cbiAgLy8gQU1EIHJlZ2lzdHJhdGlvbiBoYXBwZW5zIGF0IHRoZSBlbmQgZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBBTUQgbG9hZGVyc1xuICAvLyB0aGF0IG1heSBub3QgZW5mb3JjZSBuZXh0LXR1cm4gc2VtYW50aWNzIG9uIG1vZHVsZXMuIEV2ZW4gdGhvdWdoIGdlbmVyYWxcbiAgLy8gcHJhY3RpY2UgZm9yIEFNRCByZWdpc3RyYXRpb24gaXMgdG8gYmUgYW5vbnltb3VzLCB1bmRlcnNjb3JlIHJlZ2lzdGVyc1xuICAvLyBhcyBhIG5hbWVkIG1vZHVsZSBiZWNhdXNlLCBsaWtlIGpRdWVyeSwgaXQgaXMgYSBiYXNlIGxpYnJhcnkgdGhhdCBpc1xuICAvLyBwb3B1bGFyIGVub3VnaCB0byBiZSBidW5kbGVkIGluIGEgdGhpcmQgcGFydHkgbGliLCBidXQgbm90IGJlIHBhcnQgb2ZcbiAgLy8gYW4gQU1EIGxvYWQgcmVxdWVzdC4gVGhvc2UgY2FzZXMgY291bGQgZ2VuZXJhdGUgYW4gZXJyb3Igd2hlbiBhblxuICAvLyBhbm9ueW1vdXMgZGVmaW5lKCkgaXMgY2FsbGVkIG91dHNpZGUgb2YgYSBsb2FkZXIgcmVxdWVzdC5cbiAgaWYgKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCkge1xuICAgIGRlZmluZSgndW5kZXJzY29yZScsIFtdLCBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBfO1xuICAgIH0pO1xuICB9XG59KS5jYWxsKHRoaXMpO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGFuZ3VsYXIubW9kdWxlKCdmbGlja3JEdXBGaW5kZXJDb25maWcnLCBbXSlcbiAgLmNvbnN0YW50KCdPQVVUSERfVVJMJywgJ2h0dHA6Ly9uaXNzZS5sZWZhbnQubmV0OjYyODQnKVxuICAuY29uc3RhbnQoJ0FQUF9QVUJMSUNfS0VZJywgJ2ZvUlJLWGZRaXB5N2t6aUJ1V0RoaDFJYnNfaycpIC8vbmlzc2VcbiAgLy8uY29uc3RhbnQoJ0FQUF9QVUJMSUNfS0VZJywgJ2NGNGdPYmxFVXB1ZVR0c0w0NF9rJykgLy9vYXV0aC5pb1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5yZXF1aXJlKCcuLy4uLy4uL2Jvd2VyX2NvbXBvbmVudHMvdWkuYm9vdHN0cmFwL3NyYy9wYWdpbmF0aW9uL3BhZ2luYXRpb24nKTtcblxubW9kdWxlLmV4cG9ydHMgPSBhbmd1bGFyLm1vZHVsZShcbiAgJ2ZsaWNrckR1cEZpbmRlckNvbnRyb2xsZXJzJyxcbiAgWyd1aS5ib290c3RyYXAucGFnaW5hdGlvbicsIHJlcXVpcmUoJy4vc2VydmljZXMnKS5uYW1lXSlcbiAgLmNvbnRyb2xsZXIoXG4gICAgJ3Bob3RvQ3RybCcsXG4gICAgWyckc2NvcGUnLCAnJGxvZycsICdGbGlja3InLCBmdW5jdGlvbigkc2NvcGUsICRsb2csIEZsaWNrcikge1xuICAgICAgdmFyIF8gPSByZXF1aXJlKFwiLi8uLi8uLi9ib3dlcl9jb21wb25lbnRzL3VuZGVyc2NvcmUvdW5kZXJzY29yZS5qc1wiKTtcbiAgICAgIHZhciBzcGVjaWFsVGFnID0gJ2ZsaWNrcmR1cGZpbmRlcic7XG4gICAgICAkc2NvcGUuaXRlbXNQZXJQYWdlID0gMTA7XG4gICAgICAkc2NvcGUubWF4U2l6ZSA9IDEwO1xuXG4gICAgICAkc2NvcGUudG9nZ2xlVGFnID0gZnVuY3Rpb24ocGhvdG8pIHtcbiAgICAgICAgaWYgKHBob3RvLmR1cGxpY2F0ZSkge1xuICAgICAgICAgIHJlbW92ZVRhZyhwaG90byk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgYWRkVGFnKHBob3RvKTtcbiAgICAgICAgfVxuICAgICAgfTtcblxuICAgICAgZnVuY3Rpb24gYWRkVGFnKHBob3RvKSB7XG4gICAgICAgIEZsaWNrci5nZXQoe1xuICAgICAgICAgIHBob3RvX2lkOiBwaG90by5pZCxcbiAgICAgICAgICBtZXRob2Q6ICdmbGlja3IucGhvdG9zLmFkZFRhZ3MnLFxuICAgICAgICAgIHRhZ3M6IHNwZWNpYWxUYWdcbiAgICAgICAgfSwgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgcGhvdG8uZHVwbGljYXRlID0gdHJ1ZTtcbiAgICAgICAgICAkc2NvcGUudGFnZ2VkRHVwbGljYXRlW3Bob3RvLmlkXSA9IHBob3RvO1xuICAgICAgICB9KTtcbiAgICAgIH07XG5cbiAgICAgIGZ1bmN0aW9uIHJlbW92ZVRhZyhwaG90bykge1xuICAgICAgICBGbGlja3IuZ2V0KHtcbiAgICAgICAgICBtZXRob2Q6ICdmbGlja3IucGhvdG9zLmdldEluZm8nLFxuICAgICAgICAgIHBob3RvX2lkOiBwaG90by5pZFxuICAgICAgICB9LCBmdW5jdGlvbihpbmZvKSB7XG4gICAgICAgICAgdmFyIHRhZyA9IF8uZmluZChpbmZvLnBob3RvLnRhZ3MudGFnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24odGFnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0YWcucmF3ID09PSBzcGVjaWFsVGFnO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgaWYgKHRhZykge1xuICAgICAgICAgICAgRmxpY2tyLmdldCh7XG4gICAgICAgICAgICAgIG1ldGhvZDogJ2ZsaWNrci5waG90b3MucmVtb3ZlVGFnJyxcbiAgICAgICAgICAgICAgcGhvdG9faWQ6IHBob3RvLmlkLFxuICAgICAgICAgICAgICB0YWdfaWQ6IHRhZy5pZFxuICAgICAgICAgICAgfSwgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgIHBob3RvLmR1cGxpY2F0ZSA9IGZhbHNlO1xuICAgICAgICAgICAgICAkc2NvcGUuZ3JvdXBzW2ZpbmdlcnByaW50KHBob3RvKV1bcGhvdG8uaWRdID0gcGhvdG87XG4gICAgICAgICAgICAgIGRlbGV0ZSAkc2NvcGUudGFnZ2VkRHVwbGljYXRlW3Bob3RvLmlkXTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9O1xuXG4gICAgICBmdW5jdGlvbiBjaGVja1RhZyhwaG90bykge1xuICAgICAgICBwaG90b1snZHVwbGljYXRlJ10gPSBfLmNvbnRhaW5zKHBob3RvLnRhZ3Muc3BsaXQoLyAvKSwgc3BlY2lhbFRhZyk7XG4gICAgICAgIHJldHVybiBwaG90bztcbiAgICAgIH1cblxuICAgICAgZnVuY3Rpb24gZmluZ2VycHJpbnQocGhvdG8pIHtcbiAgICAgICAgcmV0dXJuIHBob3RvLnRpdGxlLnJlcGxhY2UoLy1bMC05XSQvLCAnJykgKyAnIyMnICsgcGhvdG8uZGF0ZXRha2VuO1xuICAgICAgfVxuXG4gICAgICBmdW5jdGlvbiBhdExlYXN0VHdvKGdyb3VwKSB7XG4gICAgICAgIHJldHVybiBncm91cFsxXS5sZW5ndGggPiAxO1xuICAgICAgfVxuXG4gICAgICBmdW5jdGlvbiBkYXRlVGFrZW5Jc01vc3RHcmFudWxhcihwaG90bykge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgLy9yZXR1cm4gcGhvdG8uZGF0ZXRha2VuZ3JhbnVsYXJpdHkgPT0gXCIwXCI7XG4gICAgICB9XG5cbiAgICAgIEZsaWNrci5nZXQoe3RhZ3M6IHNwZWNpYWxUYWd9LCBmdW5jdGlvbihyZXN1bHQpIHtcbiAgICAgICAgdmFyIGNoZWNrZWRSZXN1bHRzID0gXy5tYXAocmVzdWx0LnBob3Rvcy5waG90bywgY2hlY2tUYWcpO1xuICAgICAgICAkc2NvcGUudGFnZ2VkRHVwbGljYXRlID0gXy5pbmRleEJ5KGNoZWNrZWRSZXN1bHRzLCAnaWQnKTtcbiAgICAgIH0pO1xuXG4gICAgICBmdW5jdGlvbiBncm91cER1cGxpY2F0ZXMocmVzdWx0cykge1xuICAgICAgICB2YXIgcmVzdWx0czIgPSBfLmZpbHRlcihyZXN1bHRzLCBkYXRlVGFrZW5Jc01vc3RHcmFudWxhcik7XG4gICAgICAgIHZhciByZXN1bHRzMyA9IF8ubWFwKHJlc3VsdHMyLCBjaGVja1RhZyk7XG4gICAgICAgIHZhciBncm91cHMgPSBfLmdyb3VwQnkocmVzdWx0czMsIGZpbmdlcnByaW50KTtcbiAgICAgICAgdmFyIGdyb3VwczIgPSBfLm9iamVjdChfLmZpbHRlcihfLnBhaXJzKGdyb3VwcyksIGF0TGVhc3RUd28pKTtcbiAgICAgICAgJHNjb3BlLmdyb3VwcyA9IGdyb3VwczI7XG4gICAgICAgIHVwZGF0ZVZpc2libGVHcm91cHMoKVxuICAgICAgfVxuXG4gICAgICBmdW5jdGlvbiBnZXRQYWdlKHBhZ2UsIHBob3Rvc0FjYykge1xuICAgICAgICAkc2NvcGUucGFnZSA9IHBhZ2U7XG4gICAgICAgIEZsaWNrci5nZXQoe3BhZ2U6IHBhZ2UsIHBlcl9wYWdlOiA1MDB9LCBmdW5jdGlvbihyZXN1bHQpIHtcbiAgICAgICAgICAkc2NvcGUudG90YWxQYWdlcyA9IHJlc3VsdC5waG90b3MucGFnZXM7XG4gICAgICAgICAgdmFyIHBob3Rvc0FjYzIgPSBwaG90b3NBY2MuY29uY2F0KHJlc3VsdC5waG90b3MucGhvdG8pO1xuICAgICAgICAgIGlmIChwYWdlIDwgcmVzdWx0LnBob3Rvcy5wYWdlcykge1xuICAgICAgICAgICAgZ2V0UGFnZShwYWdlICsgMSwgcGhvdG9zQWNjMik7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICRzY29wZS5pbml0aWFsRG93bmxvYWQgPSBmYWxzZTtcbiAgICAgICAgICB9XG4gICAgICAgICAgZ3JvdXBEdXBsaWNhdGVzKHBob3Rvc0FjYzIpO1xuICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgICAgZnVuY3Rpb24gdXBkYXRlVmlzaWJsZUdyb3VwcygpIHtcbiAgICAgICAgJHNjb3BlLnRvdGFsSXRlbXMgPSBfLnNpemUoJHNjb3BlLmdyb3Vwcyk7XG4gICAgICAgIHZhciBmaXJzdCA9ICgoJHNjb3BlLmN1cnJlbnRQYWdlIC0gMSkgKiAkc2NvcGUuaXRlbXNQZXJQYWdlKTtcbiAgICAgICAgdmFyIGxhc3QgPSAkc2NvcGUuY3VycmVudFBhZ2UgKiAkc2NvcGUuaXRlbXNQZXJQYWdlO1xuICAgICAgICAkc2NvcGUudmlzaWJsZUdyb3VwcyA9IF8ucGljaygkc2NvcGUuZ3JvdXBzLCBfLmtleXMoJHNjb3BlLmdyb3Vwcykuc2xpY2UoZmlyc3QsIGxhc3QpKTtcbiAgICAgICAgJGxvZy5kZWJ1ZygndXBkYXRlVmlzaWJsZUdyb3VwcyB0b3RhbEl0ZW1zOiAnLCAkc2NvcGUudG90YWxJdGVtcyk7XG4gICAgICAgICRsb2cuZGVidWcoJ3VwZGF0ZVZpc2libGVHcm91cHMgY3VycmVudFBhZ2U6ICcsICRzY29wZS5jdXJyZW50UGFnZSk7XG4gICAgICAgICRsb2cuZGVidWcoJ3VwZGF0ZVZpc2libGVHcm91cHMgaXRlbXNQZXJQYWdlOiAnLCAkc2NvcGUuaXRlbXNQZXJQYWdlKTtcbiAgICAgICAgJGxvZy5kZWJ1ZygndXBkYXRlVmlzaWJsZUdyb3VwcyBmaXJzdDogJywgZmlyc3QpO1xuICAgICAgICAkbG9nLmRlYnVnKCd1cGRhdGVWaXNpYmxlR3JvdXBzIGxhc3Q6ICcsIGxhc3QpO1xuICAgICAgfVxuXG4gICAgICAkc2NvcGUucGFnZUNoYW5nZWQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgY29uc29sZS5sb2coJ1BhZ2UgY2hhbmdlZCB0bzogJyArICRzY29wZS5jdXJyZW50UGFnZSk7XG4gICAgICAgIHVwZGF0ZVZpc2libGVHcm91cHMoKVxuICAgICAgfTtcblxuICAgICAgJHNjb3BlLnRvdGFsSXRlbXMgPSAwO1xuICAgICAgJHNjb3BlLmN1cnJlbnRQYWdlID0gMTtcbiAgICAgICRzY29wZS5pbml0aWFsRG93bmxvYWQgPSB0cnVlO1xuICAgICAgZ2V0UGFnZSgxLCBbXSk7XG4gICAgfV0pO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGFuZ3VsYXIubW9kdWxlKCdPQXV0aCcsIFtdKVxuICAuZmFjdG9yeSgnT0F1dGgnLCBbJyR3aW5kb3cnLCAnJGxvZycsIGZ1bmN0aW9uKCR3aW5kb3csICRsb2cpIHtcbiAgLy8ganF1ZXJ5IGZyb20gY2RuIHZpYSBpbmRleC5odG1sIGZvciBub3dcbiAgLy8gdmFyIGpRdWVyeSA9IHJlcXVpcmUoJ2pxdWVyeScpO1xuICAvLyBnbG9iYWwualF1ZXJ5ID0galF1ZXJ5O1xuICByZXF1aXJlKFwiLi8uLi8uLi9ib3dlcl9jb21wb25lbnRzL29hdXRoLWpzL2Rpc3Qvb2F1dGgubWluLmpzXCIpO1xuICByZXR1cm4gJHdpbmRvdy5PQXV0aDtcbn1dKTtcbiIsIid1c2Ugc3RyaWN0JztcblxucmVxdWlyZShcIi4vLi4vLi4vYm93ZXJfY29tcG9uZW50cy9hbmd1bGFyLXJlc291cmNlL2FuZ3VsYXItcmVzb3VyY2UuanNcIik7XG5cbm1vZHVsZS5leHBvcnRzID0gYW5ndWxhci5tb2R1bGUoXG4gICdmbGlja3JEdXBGaW5kZXJTZXJ2aWNlcycsXG4gIFsnbmdSZXNvdXJjZScsIHJlcXVpcmUoJy4vY29uZmlnJykubmFtZSwgcmVxdWlyZSgnLi9vYXV0aC1zaGltJykubmFtZV0pXG4gIC5zZXJ2aWNlKFxuICAgICdGbGlja3InLFxuICAgIFsnJGxvZycsICckcmVzb3VyY2UnLCAnJGh0dHAnLCAnJHEnLCAnJGxvY2F0aW9uJywgJ09BdXRoJywgJ09BVVRIRF9VUkwnLCAnQVBQX1BVQkxJQ19LRVknLFxuICAgICBmdW5jdGlvbihcbiAgICAgICAkbG9nLCAkcmVzb3VyY2UsICRodHRwLCAkcSwgJGxvY2F0aW9uLCBPQXV0aCwgT0FVVEhEX1VSTCwgQVBQX1BVQkxJQ19LRVkpIHtcbiAgICAgICBpZiAoJGxvY2F0aW9uLmhhc2goKSA9PT0gJycpIHsgJGxvY2F0aW9uLnBhdGgoJy8nKTsgfSAvL3NvIHJlZGlyZWN0IHRvIGFic1VybCgpIHdvcmtzXG4gICAgICAgT0F1dGguaW5pdGlhbGl6ZShBUFBfUFVCTElDX0tFWSwge2NhY2hlOiB0cnVlfSk7XG4gICAgICAgT0F1dGguc2V0T0F1dGhkVVJMKE9BVVRIRF9VUkwpO1xuICAgICAgIHZhciByZXNvdXJjZSA9ICRxLmRlZmVyKCk7XG4gICAgICAgZnVuY3Rpb24gZG9uZUhhbmRsZXIocmVzdWx0KSB7XG4gICAgICAgICB2YXIga2V5ID0gQVBQX1BVQkxJQ19LRVk7XG4gICAgICAgICB2YXIgb2F1dGhpbyA9ICdrPScgKyBrZXk7XG4gICAgICAgICBvYXV0aGlvICs9ICcmb2F1dGh2PTEnO1xuICAgICAgICAgZnVuY3Rpb24ga3ZfcmVzdWx0KGtleSkge1xuICAgICAgICAgICByZXR1cm4gJyYnK2tleSsnPScrZW5jb2RlVVJJQ29tcG9uZW50KHJlc3VsdFtrZXldKTtcbiAgICAgICAgIH1cbiAgICAgICAgIG9hdXRoaW8gKz0ga3ZfcmVzdWx0KCdvYXV0aF90b2tlbicpO1xuICAgICAgICAgb2F1dGhpbyArPSBrdl9yZXN1bHQoJ29hdXRoX3Rva2VuX3NlY3JldCcpO1xuICAgICAgICAgb2F1dGhpbyArPSBrdl9yZXN1bHQoJ2NvZGUnKTtcbiAgICAgICAgICRodHRwLmRlZmF1bHRzLmhlYWRlcnMuY29tbW9uID0ge29hdXRoaW86IG9hdXRoaW99O1xuICAgICAgICAgcmVzb3VyY2UucmVzb2x2ZShcbiAgICAgICAgICAgJHJlc291cmNlKFxuICAgICAgICAgICAgIE9BVVRIRF9VUkwgKyAnL3JlcXVlc3QvZmxpY2tyL3NlcnZpY2VzL3Jlc3QvJyxcbiAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICBtZXRob2Q6IFwiZmxpY2tyLnBob3Rvcy5zZWFyY2hcIixcbiAgICAgICAgICAgICAgIGZvcm1hdDogXCJqc29uXCIsXG4gICAgICAgICAgICAgICB1c2VyX2lkOiBcIm1lXCIsXG4gICAgICAgICAgICAgICBwZXJfcGFnZTogMTAsXG4gICAgICAgICAgICAgICAvL3RleHQ6IFwidmlzaW9uOm91dGRvb3JcIixcbiAgICAgICAgICAgICAgIC8vdGFnczogXCJ2aXNpb246b3V0ZG9vcix2aXNpb246b3V0ZG9vcj0wOTlcIixcbiAgICAgICAgICAgICAgIC8vbWFjaGluZV90YWdzOiBcIm91dGRvb3JcIixcbiAgICAgICAgICAgICAgIGV4dHJhczogXCJkYXRlX3VwbG9hZCxkYXRlX3Rha2VuLHRhZ3NcIixcbiAgICAgICAgICAgICAgIG5vanNvbmNhbGxiYWNrOiAxXG4gICAgICAgICAgICAgfSkpO1xuICAgICAgIH1cblxuICAgICAgIHZhciBvYXV0aENhbGxiYWNrID0gT0F1dGguY2FsbGJhY2soJ2ZsaWNrcicpO1xuICAgICAgIGlmIChvYXV0aENhbGxiYWNrKSB7XG4gICAgICAgICBvYXV0aENhbGxiYWNrLmRvbmUoZG9uZUhhbmRsZXIpLmZhaWwoZnVuY3Rpb24oY2FsbGJhY2tFcnJvcikge1xuICAgICAgICAgICAkbG9nLmRlYnVnKCdPQXV0aC5jYWxsYmFjayBlcnJvcjogJywgY2FsbGJhY2tFcnJvcik7XG4gICAgICAgICB9KTtcbiAgICAgICB9IGVsc2Uge1xuICAgICAgICAgLy8gdGhlIGNhbGxiYWNrIHVybCBtdXN0IGJlIHJvdXRlZCB0aHJvdWdoIC5vdGhlcndpc2UgaW4gdGhlIGFwcCByb3V0ZXJcbiAgICAgICAgIE9BdXRoLnJlZGlyZWN0KCdmbGlja3InLCAkbG9jYXRpb24uYWJzVXJsKCkpO1xuICAgICAgIH1cbiAgICAgICByZXR1cm4gcmVzb3VyY2UucHJvbWlzZTtcbiAgICAgfV0pO1xuIl19
