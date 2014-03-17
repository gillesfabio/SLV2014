# SLV Municipales 2014

Code source de l'application accessible à l'adresse : http://gillesfabio.github.io/SLVM2014.

Cette application permet d'accéder rapidement aux résultats, ainsi qu'aux profils
et programmes des différents candidats aux élections municipales 2014
de Saint-Laurent-du-Var (Alpes-Maritimes, France).

Les données sont formatées au format YAML et accessibles dans le dossier `data`.
Ces données ont été récupérées depuis les programmes officiels, sans aucune modification.

L'application statique est propulsée par les technologies suivantes :

* [Backbone](http://backbonejs.org)
* [Handlebars](http://handlebarsjs.com)
* [Foundation](foundation.zurb.com)

[Node](http://nodejs.org), [gulp](http://gulpjs.org), [Swig](http://paularmstrong.github.io/swig/)
et [yaml.js](https://github.com/jeremyfa/yaml.js) sont utilisés pour la
conversion des données au format JSON et la génération du site statique.

## Installation

Cloner le dépôt et lancer la commande `make install` :

```
git clone https://github.com/gillesfabio/SLVM2014.git
cd SLVM2014
make install
```

Puis, lancer le serveur local :

```
make serve
```

Aller à l'adresse : http://localhost:3000.
