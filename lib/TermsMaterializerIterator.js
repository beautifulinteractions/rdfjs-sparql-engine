
'use strict';

const _ = require('lodash');
const utils = require('./utils');
const TransformIterator = require('asynciterator').TransformIterator;

class TermsMaterializerIterator extends TransformIterator {

  constructor(source, opts) {
    super(source, opts);
  }

  _transform(terms, done) {
    this._push(_.mapValues(terms, term => utils.materializeTerm(term)));
    done();
  }

}

module.exports = TermsMaterializerIterator;
