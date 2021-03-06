---
title: "Citrix"
description: "Tips to check Citrix security"
date: 23/11/2020
categories:
 - Misc
tags:
 - citrix
 - remote-access
---

# Citrix

## Citrix NetScaler Gateway

### Fingerprint NetScaler Gateway

Download the following installer:

```
https://{HOST}/epa/scripts/win/nsepa_setup.exe
```

Extract the binary `nsepa_setup.exe\nsepa.msi\nsepa.cab\nsepa.exe` and read the
properties:

![Citrix NetScaller nsepa.exe version](/assets/citrix_netscaler_nsepa.exe_version.png)


## Execute commands

### Execute Powershell from rundll32

Copy the `powershdll.dll` file from the host to the target then execute the
command:

```bash
rundll32 powershdll.dll, main -w
```
