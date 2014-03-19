BASE_DIR=$(CURDIR)
BUILD_DIR=$(BASE_DIR)/build
PUBLIC_DIR=$(BASE_DIR)/public
NODE_LOCAL_BIN=./node_modules/.bin

venv:
	virtualenv -p python2.7 `pwd`/.venv
	. .venv/bin/activate && pip install -r requirements.pip

install: venv
	@bower install
	@npm install

clean:
	@rm -rf .venv node_modules vendor build public

clean-build:
	@gulp clean

build:
	@gulp build

generate: clean-build
	@gulp generate

generate-github: clean-build
	BASE_URL=http://slv2014.fr/ gulp generate

publish: generate-github
	. .venv/bin/activate && ghp-import $(PUBLIC_DIR)
	git push origin gh-pages

serve: clean-build
	@gulp serve

serve-prod:
	@gulp serve:production

serve-test:
	@gulp serve:test

.PHONY: venv install clean clean-build build generate generate-github publish serve serve-prod serve-test
