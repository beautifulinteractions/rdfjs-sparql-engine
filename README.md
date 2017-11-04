
# RDF/JS SPARQL QUERY ENGINE

A `SPARQL` query engine running on instances the [RDF/JS][0] Source interface.

# Usage

    const engine = new SparqlEngine(source);
    const iterator = engine.query(query);
    
The `.query()` method returns an [iterator][1] dictionaries of [RDF/JS][0] Term instances.

[0]: https://github.com/rdfjs/representation-task-force/blob/master/interface-spec.md
[1]: https://github.com/RubenVerborgh/AsyncIterator