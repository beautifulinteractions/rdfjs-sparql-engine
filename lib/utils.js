
'use strict';

const _ = require('lodash');
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
