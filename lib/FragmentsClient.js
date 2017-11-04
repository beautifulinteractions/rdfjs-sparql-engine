
'use strict';

const utils = require('./utils');
const rdfUtil = require('ldf-client/lib/util/RdfUtil');
const TransformIterator = require('asynciterator').TransformIterator;

class FragmentsClient {

  constructor(source, options) {
    this._source = source;
  }

  getFragmentByPattern(pattern) {
    const subject = rdfUtil.isVariableOrBlank(pattern.subject) ? null : utils.materializeTerm(pattern.subject);
    const predicate = rdfUtil.isVariableOrBlank(pattern.predicate) ? null : utils.materializeTerm(pattern.predicate);
    const object = rdfUtil.isVariableOrBlank(pattern.object) ? null : utils.materializeTerm(pattern.object);
    const graph = rdfUtil.isVariableOrBlank(pattern.graph) ? null : utils.materializeTerm(pattern.graph);
    return new Fragment(this._source.match(subject, predicate, object, graph));
  }

  abortAll() {}

}

class Fragment extends TransformIterator {

  constructor(source) {
    super();
    this.source = source;
  }

  _transform(quad, done) {
    this._push(utils.serializeQuad(quad));
    done();
  }

}

module.exports = FragmentsClient;
