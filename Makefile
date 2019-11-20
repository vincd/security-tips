deploy:
	(rm -rf site)
	(mkdocs gh-deploy)

serve:
	mkdocs serve
