
'use strict';

const _ = require('lodash');
const stream = require('stream');
const n3Utils = require('n3').Util;
const dataFactory = require('rdf-data-model');

function materializeTerm(term) {
  let materializedTerm;
  if (n3Utils.isLiteral(term)) {
    const value = n3Utils.getLiteralValue(term);
    const datatype = n3Utils.getLiteralType(term);
    const language = n3Utils.getLiteralLanguage(term);
    materializedTerm = dataFactory.literal(value, language || (datatype && dataFactory.namedNode(datatype)) || null);
  } else if (n3Utils.isBlank(term)) {
    materializedTerm = dataFactory.blankNode(term.slice(2));
  } else if (n3Utils.isIRI(term)) {
    materializedTerm = dataFactory.namedNode(term);
  } else {
    throw new Error(`Bad term "${term}", cannot export`);
  }
  return materializedTerm;
}

module.exports.materializeTerm = materializeTerm;

function serializeTerm(term) {
  let serializedTerm;
  switch (term.termType) {
    case 'Literal':
      if (term.language) serializedTerm = n3Utils.createLiteral(term.value, term.language);
      if (term.datatype) serializedTerm = n3Utils.createLiteral(term.value, serializeTerm(term.datatype));
      serializedTerm = n3Utils.createLiteral(term.value);
      break;
    case 'NamedNode':
      serializedTerm = term.value;
      break;
    case 'DefaultGraph':
      serializedTerm = null;
      break;
    case 'BlankNode':
      serializedTerm = '_:' + term.value;
      break;
    default:
      throw new Error(`Unsupported termType ${term.termType}`);
  }
  return serializedTerm;
}

module.exports.serializeTerm = serializeTerm;

function serializeQuad(quad) {
  const serializedQuad = {
    subject: serializeTerm(quad.subject),
    predicate: serializeTerm(quad.predicate),
    object: serializeTerm(quad.object),
    graph: serializeTerm(quad.graph)
  };
  return serializedQuad;
}

module.exports.serializeQuad = serializeQuad;

function resolveOnEvent(emitter, event, rejectOnError) {
  return new Promise((resolve, reject) => {
    emitter.on(event, resolve);
    if (rejectOnError) {
      emitter.on('error', reject);
    }
  });
}

module.exports.resolveOnEvent = resolveOnEvent;
module.exports.waitForEvent = resolveOnEvent;

function streamToArray(readStream) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    readStream
      .on('data', (chunk) => { chunks.push(chunk); })
      .on('end', () => { resolve(chunks); })
      .on('error', (err) => { reject(err); });
  });
}

module.exports.streamToArray = streamToArray;

class IteratorStream extends stream.Readable {
  constructor(iterator) {
    super({ objectMode: true });
    const is = this;
    this._reading = false;
    this._iterator = iterator;
    this._iterator.on('end', () => {
      is.push(null);
    });
  }
  _read() {
    const is = this;
    is._startReading();
  }
  _startReading() {
    const is = this;
    if (is._reading) return;
    is._reading = true;
    is._iterator.on('data', (quad) => {
      if (!is.push(quad)) {
        is._stopReading();
      }
    });
  }
  _stopReading() {
    const is = this;
    is._iterator.removeAllListeners('data');
    is._reading = false;
  }
}

function createIteratorStream(iterator) {
  return new IteratorStream(iterator);
}

module.exports.createIteratorStream = createIteratorStream;
