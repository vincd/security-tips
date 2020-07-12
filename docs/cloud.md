---
title: "Cloud"
date: 2019-03-26T08:47:11+01:00
tags:
 - cloud
 - AWS
 - GCP
 - Azure
 - DigitalOcean
 - SSRF
---

# Cloud


## Get Cloud Metadata

When you have access to the internal network (SSRF, RCE, ...) you can read
metadata of the server instance. All cloud providers use the same endpoint:
`169.254.169.254`.

On GCP and Azure you need to add some custom header, so a simple SSRF may not be
enough.

- GCP: `Metadata-Flavor: Google` (or the previous header `X-Google-Metadata-Request: True`)
- Azure: `Metadata: true`

Here the documentation for various cloud providers:

- [AWS](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/instancedata-data-retrieval.html) (and [AWS tips](aws.md))
- [Azure](https://docs.microsoft.com/en-us/azure/virtual-machines/windows/instance-metadata-service)
- [GCP](https://cloud.google.com/compute/docs/storing-retrieving-metadata)
- [DigitalOcean](https://developers.digitalocean.com/documentation/metadata/)
