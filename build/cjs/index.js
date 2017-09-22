'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fetchMiddleware = undefined;

var _composeMiddleware = require('@m59/compose-middleware');

var _composeMiddleware2 = _interopRequireDefault(_composeMiddleware);

var _nodeFetch = require('node-fetch');

var _nodeFetch2 = _interopRequireDefault(_nodeFetch);

var _requestObjectToPlainObject = require('./lib/request-object-to-plain-object');

var _requestObjectToPlainObject2 = _interopRequireDefault(_requestObjectToPlainObject);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const fetchMiddleware = request => (0, _nodeFetch2.default)(request.url, request.init);

const Fetchware = (middleware = []) => {
  const fetchware = (input, init) => {
    /* normalize and clone by passing through Request constructor,
      then pull properties off of request instance because they are read-only
    */
    const request = (0, _requestObjectToPlainObject2.default)(new _nodeFetch2.default.Request(input, init));
    return (0, _composeMiddleware2.default)(middleware.concat(fetchMiddleware))(request);
  };
  fetchware.use = fnOrArray => Fetchware(middleware.concat(fnOrArray));
  return fetchware;
};

exports.default = Fetchware();
exports.fetchMiddleware = fetchMiddleware;