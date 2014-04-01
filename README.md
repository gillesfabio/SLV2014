# SLV2014.fr

Code source du site [SLV2014.fr](http://slv2014.fr).

SLV2014.fr permet d'accéder aux résultats, ainsi qu'aux profils
et programmes des différents candidats aux élections municipales 2014
de [Saint-Laurent-du-Var](https://goo.gl/maps/dk7RO) (Alpes-Maritimes, France).

### Installation

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

### Licence

* Le code de l'application est sous [licence MIT](http://fr.wikipedia.org/wiki/Licence_MIT).
* Les données du dossier `data` (images et textes) appartiennent à leurs auteurs respectifs.
