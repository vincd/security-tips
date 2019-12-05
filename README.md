Security Tips
=============


## Complile
This repository use a Gihub Action to generate the website. The action is trigger
at each push to master. The compiles files are then pushed to the `gh-page` branch.
This branch is used by Github to expose the website on the Internet.


## Serve localy
To test the repository localy, use the `Makefile` command:
```bash
make serve
```

The command `mkdocs serve` should fail because we use a custom makrdown extension
(`makrdown_new_tab.py`).
