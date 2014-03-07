BASEDIR=$(CURDIR)
BUILDDIR=$(BASEDIR)/build
NODE_LOCAL_BIN=./node_modules/.bin

.PHONY: venv
venv:
	virtualenv -p python2.7 `pwd`/.venv
	. .venv/bin/activate && pip install -r requirements.pip

.PHONY: install
install: venv
	@bower install
	@npm install

.PHONY: clean
clean:
	@rm -rf .venv node_modules build vendor

.PHONY: bclean
bclean:
	@rm -rf build

.PHONY: build
build: bclean
	@gulp build

.PHONY: build-github
build-github: bclean
	BASE_URL=/SLVM2014/ gulp build

.PHONY: runserver
runserver: build
	@gulp runserver

.PHONY: runserver-dev
runserver-dev:
	@gulp runserver-dev

.PHONY: doc
doc:
	@$(NODE_LOCAL_BIN)/jsdoc -t jaguarjs-jsdoc -c .jsdocrc README.md

.PHONY: publish
publish: build-github
	ghp-import $(BUILDDIR)
	git push origin gh-pages
