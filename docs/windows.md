Windows
=======


## KerberosUnConstrainedDelegation
More information here: https://adsecurity.org/?p=1667
```Powershell
$ Import-Module ActiveDirectory
$ Get-ADComputer -Filter {(TrustedForDelegation -eq $True) -AND (PrimaryGroupID -eq 515)} -Properties 'TrustedForDelegation,TrustedToAuthForDelegation,servicePrincipalName,Description'

# UserAccountControl & 0x80000 (TRUSTED_FOR_DELEGATION)
# UserAccountControl & 0x100000 (TRUSTED_TO_AUTHENTICATE_FOR_DELEGATION)
$ $computers = (New-Object System.DirectoryServices.DirectorySearcher("(&(objectCategory=Computer)(primaryGroupID=515)(useraccountcontrol:1.2.840.113556.1.4.804:=524288))")).FindAll().Properties
$ foreach($c in $computers) { echo "$($c.name) ($($c.useraccountcontrol))" }
```
https://adsecurity.org/wp-content/uploads/2015/08/KerberosUnConstrainedDelegation-PowerShell-DiscoverServers2.png

## Collect AD users information
```Powershell
# Helping functions
function Get-ADUserDirectoryEntry($user) {
    return (New-Object System.DirectoryServices.DirectorySearcher("(&(objectCategory=User)(samAccountName=$user))")).FindOne().GetDirectoryEntry()
}

function Get-ADUserGroups($user) {
    $userDirectoryEntry = Get-ADUserDirectoryEntry($user)
    $groups = $userDirectoryEntry.memberOf

    return $groups
}

function Get-ADGroupMembers($GroupName) {
    if ($GroupName -like "CN=*") {
        $GroupDistinguishedName = $GroupName
    } else {
        # find the distinguished name from the group name
        $GroupDistinguishedName = (New-Object System.DirectoryServices.DirectorySearcher("(&(objectCategory=Group)(cn=$GroupName))")).FindOne().GetDirectoryEntry().distinguishedName
    }

    # limited to the first 10k entries
    $GroupMembers = (New-Object System.DirectoryServices.DirectorySearcher("(&(objectCategory=User)(memberOf=$GroupDistinguishedName ))")).FindAll()

    return $GroupMembers.properties
}

# Get "Domain admins" users, be carefull the name may change depending on the DC lang
$DomainAdmins = Get-ADGroupMembers("Domain Admins")
foreach($user in $DomainAdmins) { echo "$($user.displayname) ($($user.samaccountname))" }

#
(New-Object System.DirectoryServices.DirectorySearcher("(&(objectCategory=Computer)(cn=SCU44625))")).FindAll()
```

### LDAP Query structure
The website [LdapWiki](https://ldapwiki.com/wiki/) explains how to write a LDAP query. For instance,
if we want to use bitwise in ldap queries, we need to use some splecial arguments.
There are two Bitwise operation Extensible Match Rules.
```
1.2.840.113556.1.4.803 which is also referred to as LDAP_MATCHING_RULE_BIT_AND (Bitwise AND)
1.2.840.113556.1.4.804 which is also referred to as LDAP_MATCHING_RULE_BIT_OR (Bitwise OR)
```

## Decrypt GPO with cpassword
```python
#!/usr/bin/python

import sys
import binascii

from Crypto.Cipher import AES
from base64 import b64decode

unpad = lambda s: s[:-1 * ord(s[-1])]

def decrypt(cpassword):
    # Init the key
    # From MSDN: http://msdn.microsoft.com/en-us/library/2c15cbf0-f086-4c74-8b70-1f2fa45dd4be%28v=PROT.13%29#endNote2
    key = binascii.unhexlify("4e9906e8fcb66cc9faf49310620ffee8f496e806cc057990209b09a433b66c1b")

    # Add padding to the base64 string and decode it
    cpassword += "=" * ((4 - len(cpassword) % 4) % 4)
    password = b64decode(cpassword)
    o = AES.new(key, AES.MODE_CBC, "\x00" * 16).decrypt(password)

    return unpad(o).decode("utf16")

def main():
    if len(sys.argv) != 2:
        print("Usage: gpprefdecrypt.py <cpassword>")
        sys.exit(0)

    cpassword = sys.argv[1]
    o = decrypt(cpassword)

    print o

if __name__ == "__main__":
    main()
```

## Use Win32 API in Python
Download then install the pip package pywin32 here: https://www.lfd.uci.edu/~gohlke/pythonlibs/#pywin32

## Get NTP configuration server
```bash
$ w32tm /query /status
```

## Windows 10 versions
[Release Informations](https://docs.microsoft.com/fr-fr/windows/release-information/)

## SAM and SYSTEM backup
```
reg save HKLM\SYSTEM SystemBkup.hiv
reg save HKLM\SAM SamBkup.hiv
```

## List Email aliases
```
$ (Get-ADUser -Identity <user_ad_id> -Properties proxyAddresses).proxyAddresses
```
