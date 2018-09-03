
'use strict';

const utils = require('../lib/utils');
const nanoid = require('nanoid');
const memdown = require('memdown');
const dataFactory = require('rdf-data-model');
const RdfStore = require('quadstore').RdfStore;

const SparqlEngine = require('..');

describe('Main', () => {

  beforeEach(async () => {
    this.store = new RdfStore(nanoid(), { dataFactory, db: memdown });
    await utils.waitForEvent(this.store, 'ready');
  });

  afterEach(async () => {
    await this.store.close();
  });

  it('Should work', async () => {
    const quads = [];
    for (let i = 0; i < 20; i++) {
      quads.push(dataFactory.quad(
        dataFactory.namedNode('http://ex.com/s' + i),
        dataFactory.namedNode('http://ex.com/p' + i),
        dataFactory.literal('pollo' + i),
        dataFactory.namedNode('http://ex.com/g' + i)
      ));
    }
    await this.store.put(quads);
    const query = 'SELECT *  WHERE { GRAPH ?g { <http://ex.com/s1> ?p ?o } }';
    const engine = new SparqlEngine(this.store);
    const sparqlIterator = engine.query(query);
    const queryStream = utils.createIteratorStream(sparqlIterator);
    const results = await utils.streamToArray(queryStream);
    console.log(results);    
  });

});


