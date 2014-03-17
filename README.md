# SLV Municipales 2014

Code source de l'application accessible à l'adresse : http://gillesfabio.github.io/SLVM2014.

Cette application permet d'accéder rapidement aux résultats, ainsi qu'aux profils
et programmes des différents candidats aux élections municipales 2014
de Saint-Laurent-du-Var (Alpes-Maritimes, France).

Les données sont formatées au format [YAML](http://www.yaml.org/) et accessibles
dans le dossier `data`. Ces données ont été récupérées depuis les programmes
officiels, sans aucune modification.

L'application statique est propulsée par :

* [Backbone](http://backbonejs.org)
* [Handlebars](http://handlebarsjs.com)
* [Foundation](foundation.zurb.com)
* [markdown-js](https://github.com/evilstreak/markdown-js)
* [countdown.js](https://bitbucket.org/mckamey/countdown.js)

La génération du site statique est propulsée par :

* [Node](http://nodejs.org)
* [gulp](http://gulpjs.com)
* [Swig](http://paularmstrong.github.io/swig/)
* [yaml.js](https://github.com/jeremyfa/yaml.js)

Les icônes proviennent du projet [Font Awesome](http://fontawesome.io/) et
le serveur local est propulsé par [Express](http://expressj.com).

## Installation

*Vous devez disposer d'un environnement de développement [Node.js](http://nodejs.org),
ainsi que du logiciel de gestion de versions décentralisé [Git](http://git-scm.com/)
sur votre ordinateur pour pouvoir installer et utiliser cette application.*

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
