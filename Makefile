BASE_DIR=$(CURDIR)
BUILD_DIR=$(BASE_DIR)/build
PUBLIC_DIR=$(BASE_DIR)/public
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
	@rm -rf .venv node_modules vendor build public

.PHONY: clean-build
clean-build:
	@gulp clean

.PHONY: build
build:
	@gulp build

.PHONY: generate
generate: clean-build
	@gulp generate

.PHONY: generate-github
generate-github: clean-build
	BASE_URL=http://slv2014.fr/ gulp generate

.PHONY: publish
publish: generate-github
	. .venv/bin/activate && ghp-import $(PUBLIC_DIR)
	git push origin gh-pages

.PHONY: clean-build
serve: clean-build
	@gulp serve

.PHONY: serve-prod
serve-prod: clean-build
	@gulp serve:production

.PHONY: serve-test
serve-test: clean-build
	@gulp serve:test
