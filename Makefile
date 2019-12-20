serve:
	python3 -m mkdocs serve

install:
	python3 -m pip install --upgrade pip
	python3 -m pip install -r ./requirements.txt

build:
	python3 -m mkdocs build
