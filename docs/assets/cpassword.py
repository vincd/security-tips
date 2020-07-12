#!/usr/bin/python3

import base64
import binascii

from Crypto.Cipher import AES

unpad = lambda s: s[:-1 * s[-1]]

def decrypt_cpassword(cpassword):
    """
    Decode cpassword with a static key from msdn
    http://msdn.microsoft.com/en-us/library/2c15cbf0-f086-4c74-8b70-1f2fa45dd4be%28v=PROT.13%29#endNote2
    """

    key = b'\x4e\x99\x06\xe8\xfc\xb6\x6c\xc9\xfa\xf4\x93\x10\x62\x0f\xfe\xe8\xf4\x96\xe8\x06\xcc\x05\x79\x90\x20\x9b\x09\xa4\x33\xb6\x6c\x1b'
    iv = b'\x00' * 16
    cpassword += "=" * ((4 - len(cpassword) % 4) % 4)
    password = base64.b64decode(cpassword)
    o = AES.new(key, AES.MODE_CBC, iv).decrypt(password)

    return unpad(o).decode("utf-16")

if __name__ == "__main__":
    import sys

    if len(sys.argv) != 2:
        print("Usage: cpassword.py <cpassword>")
        sys.exit(0)

    print(decrypt_cpassword(sys.argv[1]))
