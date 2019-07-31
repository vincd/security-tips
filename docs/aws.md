AWS
===

# Check if domain is on a bucket
```
$ dig +nocmd flaws.cloud any +multiline +noall +answer
```

# List a bucket
```
$ aws s3 ls  s3://flaws.cloud/ --no-sign-request --region us-west-2
```

# Ressources
http://flaws.cloud/
