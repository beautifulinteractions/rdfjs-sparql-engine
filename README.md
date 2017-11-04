
# RDF/JS SPARQL QUERY ENGINE

A `SPARQL` query engine that runs on instances of the [RDF/JS][0] Source 
interface.

# Acknowledgments

This is, for the time being, a simple wrapper around the wonderful work done by 
the amazing [Ruben Verborgh][2] and [Ruben Taelman][3] on the 
[Linked Data Fragments Client][4].

# Usage

    const engine = new SparqlEngine(source);
    const iterator = engine.query(query);
    
The `.query()` method returns an [iterator][1] that passes dictionaries of 
[RDF/JS][0] Term instances to its consumers.

[0]: https://github.com/rdfjs/representation-task-force/blob/master/interface-spec.md
[1]: https://github.com/RubenVerborgh/AsyncIterator
[2]: https://ruben.verborgh.org
[3]: https://github.com/rubensworks
[4]: https://github.com/LinkedDataFragments/Client.js
