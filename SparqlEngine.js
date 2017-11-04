
'use strict';

const SparqlIterator = require('ldf-client/lib/sparql/SparqlIterator');
const FragmentsClient = require('./lib/FragmentsClient');
const TermsMaterializerIterator = require('./lib/TermsMaterializerIterator');

class SparqlEngine {

  /**
   *
   * @param sources array of RDF/JS Source instances
   */
  constructor(source) {
    this._fragmentsClient = new FragmentsClient(source);
  }

  /**
   *
   * @param query sparql query
   * @returns {}
   */
  query(query) {
    const termsMaterializerIterator = new TermsMaterializerIterator();
    termsMaterializerIterator.source = new SparqlIterator(query, { fragmentsClient: this._fragmentsClient });
    return termsMaterializerIterator;
  }

}

module.exports = SparqlEngine;
