# SLV2014.fr

Code source de l'application [SLV2014.fr](http://slv2014.fr).

Cette application permet d'accéder rapidement aux résultats, ainsi qu'aux profils
et programmes des différents candidats aux élections municipales 2014
de [Saint-Laurent-du-Var](https://goo.gl/maps/dk7RO) (Alpes-Maritimes, France).

Les données sont formatées au format [YAML](http://www.yaml.org/) et accessibles
dans le dossier `data`. Ces données ont été récupérées depuis les programmes
officiels, sans aucune modification.

L'application statique est propulsée par :

* [Backbone](http://backbonejs.org)
* [Handlebars](http://handlebarsjs.com)
* [Foundation](http://foundation.zurb.com)
* [SASS](http://sass-lang.com/)
* [Compass](http://compass-style.org/)
* [markdown-js](https://github.com/evilstreak/markdown-js)
* [countdown.js](https://bitbucket.org/mckamey/countdown.js)

La génération du site statique est propulsée par :

* [Node](http://nodejs.org)
* [gulp](http://gulpjs.com)
* [Swig](http://paularmstrong.github.io/swig/)
* [yaml.js](https://github.com/jeremyfa/yaml.js)

Les icônes proviennent du projet [Font Awesome](http://fontawesome.io/) et
le serveur local est propulsé par [Express](http://expressjs.com).

### Installation

*Vous devez disposer d'un environnement de développement [Node.js](http://nodejs.org),
ainsi que du logiciel de gestion de versions décentralisé [Git](http://git-scm.com/)
sur votre ordinateur pour pouvoir installer et utiliser cette application.*

Cloner le dépôt et lancer la commande `make install` :

```
git clone https://github.com/gillesfabio/SLV2014.git
cd SLV2014
make install
```

Puis, lancer le serveur local :

```
make serve
```

Aller à l'adresse : http://localhost:3000.

### Makefile : tâches disponibles

* `make venv` : crée un environnement virtuel pour les utilitaires Python
* `make install` : installe les dépendances du projet
* `make clean` : supprime tous les dossiers non-versionnés (type `vendor`)
* `make clean-buid` : supprime les dossiers `build` et `public`
* `make build` : compile les fichiers nécessitant une compilation dans le dossier `build`
* `make generate` : génère le site statique dans le dossier `public`
* `make generate-github` : génère le site statique pour GitHub Pages
* `make publish` : publie le site statique sur GitHub Pages
* `make serve` : lance le serveur en mode développement
* `make serve-prod` : lance le serveur en mode production
* `make serve-test` : lance le serveur en mode test
