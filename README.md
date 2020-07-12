Security Tips
=============


## Compile

This repository use a Github Action to generate the website. The action is trigger
at each push to master. The compiles files are then pushed to the `gh-page` branch.
This branch is used by Github to expose the website on the Internet.


## Serve locally

To test the repository locally, use the `Makefile` commands:

```bash
make install # install the dependencies
make serve   # start the mkdocs server
```
