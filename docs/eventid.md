---
title: "Windows Events to Monitor"
description: "A list of Windows EventID and rules to detect attacks on an Active Directory"
date: 22/09/2020
categories:
 - Windows
tags:
 - windows
 - soc
 - detection
---

# Windows Events to Monitor


## Event ID

The following table lists the event you should monitor on an Active Directory to
detect an attacks.

| Event ID | Summary
|:--------:|:------------------------------------------------------------------|
| 4618     | A monitored security event pattern has occurred.
| 4624     | An account was successfully logged on.                            |
| 4625     | An account failed to log on.                                      |
| 4648     | A logon was attempted using explicit credentials.                 |
| 4649     | A replay attack was detected. May be a harmless false positive due to misconfiguration error.
| 4662     | An operation was performed on an object.
| 4692     | Backup of data protection master key was attempted.
| 4706     | A new trust was created to a domain.
| 4707     | A trust to a domain was removed.
| 4716     | Trusted domain information was modified.
| 4719     | System audit policy was changed.
| 4738     | A user account was changed.
| 4765     | SID History was added to an account.
| 4766     | An attempt to add SID History to an account failed.
| 4768     | A Kerberos authentication ticket (TGT) was requested.
| 4769     | A Kerberos service ticket was requested.


## Detection Rules

### Brute force attack on one account

- Event ID: 4625
- Rule: `X` number of failed logins in `Y` minutes with the same username


### Non allowed accounts logon

- Event ID: 4624
- Rule: Check the [LogonType](http://techgenix.com/logon-types/) (`2` or `10`) and the username


### SID History modification

- Event ID: 4765, 4766
- ANSSI: [sidhistory_dangerous](https://www.cert.ssi.gouv.fr/uploads/guide-ad.html#sidhistory_dangerous)


### An account primaryGroupId was changed with value lower than 1000

- Event ID: 4738
- ANSSI: [primary_group_id_1000](https://www.cert.ssi.gouv.fr/uploads/guide-ad.html#primary_group_id_1000)


### Kerberoasting detection

- Event ID: 4769
- Rule:
    - [Filter out](https://adsecurity.org/?p=3458) `Ticket Options: 0x40810000` or `Ticket Encryption: 0x01`, `0x02`, `0x03` or `0x17`
    - `X` Kerberos service ticket requests withing `Y` minutes with the same username


### Logon on a Domain Controller

- Event ID: 4624
- Rule:
    - Check the [LogonType](http://techgenix.com/logon-types/) (`2`)
    - Check the LogonTarget
    - Check the username or user groups


### Domain structure modification

- Event ID:
    - 4706: Trust added
    - 4707: Trust removed
    - 4716: Trust modified


### DPAPI key

#### DPAPI backup key extraction

- Event ID: 4662
- Rule:
    - Check the ObjectType: `SecretObject`
    - Check AccessMask: `0x02`
    - Check ObjectName: `BCKUPKEY`
- ANSSI: [permissions_dpapi](https://www.cert.ssi.gouv.fr/uploads/guide-ad.html#permissions_dpapi)

#### DPAPI backup key backup

- Event ID: 4692
- ANSSI: [permissions_dpapi](https://www.cert.ssi.gouv.fr/uploads/guide-ad.html#permissions_dpapi)


## Source:

- [Microsoft Appendix L: Events to Monitor](https://docs.microsoft.com/en-us/windows-server/identity/ad-ds/plan/appendix-l--events-to-monitor)
- [ANSSI AD guide](https://www.cert.ssi.gouv.fr/uploads/guide-ad.html)
