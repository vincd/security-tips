---
title: "Android"
description: "Android tips"
date: 04/05/2021
categories:
 - Smartphone
tags:
 - android
---


## GenyMotion

### Installation
Download [GenyMotion](https://www.genymotion.com/) and install it. It's free for
a personal use.
Create a new VM, I personally use a Custom Tablet 8.0 with API 26. It's about
300Mo to download.
Then, you need to install the GApps. Click on the top right button "Open Gapps".


### Connect with ADB
GenyMotion has it's own `adb`, but you can still use your own version. On Windows,
it's located here: `C:\Program Files\Genymobile\Genymotion\tools`.

```bash
cd "C:\Program Files\Genymobile\Genymotion\tools"
adb.exe devices
adb.exe connect <device ip>
adb.exe shell
vbox86p:/ #
```


### Certificate Pinning
On Android 7+, you need to install the burp AC on the system store. Technical details
are explain [here](https://blog.jeroenhd.nl/article/android-7-nougat-and-certificate-authorities).

Then, on the application you may need to patch some instructions. You will need
some Android tools and patch the `smali` code. One again, technical details are
explained [here](https://medium.com/@felipecsl/bypassing-certificate-pinning-on-android-for-fun-and-profit-1b0d14beab2b).


## Bypass certificate pinning

### OkHTTP3

The framework allows the developers to set `SHA1` or `SHA256` certificate signature
to handle certificate pinning. Therefore, the easiest way to bypass the pinning
is to change the framework logic.
The logic is located inside the file `CertificatePinner.kt` (or `CertificatePinner.java`
for old versions).

```java
for (peerCertificate in peerCertificates) {
  // Lazily compute the hashes for each certificate.
  var sha1: ByteString? = null
  var sha256: ByteString? = null

  for (pin in pins) {
    when (pin.hashAlgorithm) {
      "sha256/" -> {
        if (sha256 == null) sha256 = peerCertificate.toSha256ByteString()
        if (pin.hash == sha256) return // Success!
      }
      "sha1/" -> {
        if (sha1 == null) sha1 = peerCertificate.toSha1ByteString()
        if (pin.hash == sha1) return // Success!
      }
      else -> throw AssertionError("unsupported hashAlgorithm: ${pin.hashAlgorithm}")
    }
  }
}
```

We should not throw an exception. This is straightforward, let's change the
conditions `pin.hash == sha256` and `pin.hash == sha1`. TO do this, we need to
edit the smali code. By the way, I find quite handy to use `jadx` to match smali
to Java code.

The smali code for the check is the following :

```smali
.line 180
:cond_2
iget-object v9, v9, Lokhttp3/CertificatePinner$Pin;->hash:Lokio/ByteString;

invoke-virtual {v9, v7}, Lokio/ByteString;->equals(Ljava/lang/Object;)Z

move-result v9

**if-eqz** v9, :cond_5
```

At the end, we need to inverse the condition from `if-eqz` (`if equal zero`) to
`if-nez` (`if non-zero`). There is a list of all `opcode` [here](http://pallergabor.uw.hu/androidblog/dalvik_opcodes.html).
Don't forget to check your code is correct to `jadx`:

```java
if (!pin.hash.equals(byteString)) {
  return;
}
```


### Add Burp AC

Export the certificate with DER format. Then use `openssl` to convert to PEM format
and get the hash:

```bash
openssl x509 -inform DER -in cacert.der -out cacert.pem
openssl x509 -inform PEM -subject_hash_old -in cacert.pem |head -1
mv cacert.pem <hash>.0
```

Once you have the file with the correct name, push it to the phone using `adb`:

```bash
adb root
adb remount
adb push <cert>.0 /sdcard/
adb shell
```


On the phone, move the file to the cert store and fix the permissions:

```bash
mv /sdcard/<cert>.0 /system/etc/security/cacerts/
chmod 644 /system/etc/security/cacerts/<cert>.0
```

Then you need to reboot the device (`adb reboot`). After the device reboots,
check if everything is fine in `Settings / Security / Trusted Credentials`. You
should show a new "Portswigger CA" as a system trusted CA.


## Edit Android APK

### Edit an APK file using apktool
```bash
apktool d example/ -o example.unaligned.apk
```

Then when you finished to edit the files (smali, AndroidManifest, ...) you can
recompile and sign the new apk file.

```bash
apktool b example/ -o example.unaligned.apk
jarsigner -verbose -sigalg MD5withRSA -digestalg SHA1 -keystore ~/.android/debug.keystore -storepass android example.unaligned.apk androiddebugkey
zipalign -v 4 example.unaligned.apk example.smali.apk
```


## ADB

### List packages
```bash
adb shell pm list packages
```

### Get APK from Android device
```bash
adb shell pm path com.example.someapp
adb pull <apk_path> <path_on_your_disk>
```

### Install application
```bash
adb shell settings put global verifier_verify_adb_installs 0
# adb shell settings put global package_verifier_enable 0
adb install <app.apk>
```
