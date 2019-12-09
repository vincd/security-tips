Android
=======


## Installation
Download [GenyMotion](https://www.genymotion.com/) and install it. It's free for
a personal use.
Create a new VM, I personally use a Custom Tablet 8.0 with API 26. It's about
300Mo to download.
Then, you need to install the GApps. Click on the top right button "Open Gapps".


## Connect with ADB
GenyMotion has it's own `adb`, but you can still use your own version. On Windows,
it's located here: `C:\Program Files\Genymobile\Genymotion\tools`.

```bash
$ cd "C:\Program Files\Genymobile\Genymotion\tools"
$ adb.exe devices
$ adb.exe connect <device ip>
$ adb.exe shell
vbox86p:/ #
```


## Certificate Pinning
On Android 7+, you need to install the burp AC on the system store. Technical details
are explain [here](https://blog.jeroenhd.nl/article/android-7-nougat-and-certificate-authorities).

Then, on the application you may need to patch some instructions. You will need
some Android tools and patch the `smali` code. One again, technical details are
explained [here](https://medium.com/@felipecsl/bypassing-certificate-pinning-on-android-for-fun-and-profit-1b0d14beab2b).
