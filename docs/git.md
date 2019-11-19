Git
===

Some website exposes `.git` to the internet. To check if the website is vulnerable, then check for
the following path:

```
https://<domain>/some/path/.git/HEAD
```

If the server return a status 200, then it might be possible to clone the repository. For that, you
can use (`GitTools`)[https://github.com/internetwache/GitTools):

```
Dumper/gitdumper.sh http://<domain>/some/path/.git/ ~/<domain>
Extractor/extractor.sh ~/<domain> ~/<domain>_dump
```

If the script is not dumping the `.git` folder, then you can modify it.

Example: https://www.root-me.org/fr/Challenges/Web-Serveur/Insecure-Code-Management
