serve:
	./venv/bin/python -m mkdocs serve

install:
	python3 -m venv venv; \
	./venv/bin/python -m pip install --upgrade pip; \
	./venv/bin/python -m pip install -r ./requirements.txt; \
	echo "Install done."

build:
	./venv/bin/python -m mkdocs build && \
	echo "Build done."
