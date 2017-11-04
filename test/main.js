
'use strict';

const utils = require('quadstore/lib/utils');
const nanoid = require('nanoid');
const memdown = require('memdown');
const dataFactory = require('rdf-data-model');
const RdfStore = require('quadstore').RdfStore;
const asynctools = require('asynctools');

const SparqlEngine = require('..');

describe('Main', () => {

  it('Should work', async () => {
    const store = new RdfStore(nanoid(), { dataFactory, db: memdown });
    await asynctools.onEvent(store, 'ready');
    const quads = [];
    for (let i = 0; i < 20; i++) {
      quads.push(dataFactory.quad(
        dataFactory.namedNode('http://ex.com/s' + i),
        dataFactory.namedNode('http://ex.com/p' + i),
        dataFactory.literal('pollo' + i),
        dataFactory.namedNode('http://ex.com/g' + i)
      ));
    }
    await store.put(quads);
    const query = 'SELECT *  WHERE { GRAPH ?g { <http://ex.com/s1> ?p ?o } }';
    const engine = new SparqlEngine(store);
    const sparqlIterator = engine.query(query);
    const queryStream = utils.createIteratorStream(sparqlIterator);
    const results = await utils.streamToArray(queryStream);
    console.log(results);
    await store.close();
  });

});


