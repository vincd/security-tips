---
title: "GrahQL"
description: "GraphQL queries to enumerates structures, types and fields."
date: 30/11/2020
categories:
 - Web
tags:
 - graphql
 - api
---


## Request useful informations

Introspection is explained [here](https://graphql.org/learn/introspection/).
First we need to collect all available types then recursively enumerate all
individual types.

[`inql`](https://github.com/doyensec/inql) can be use to fetch graphql metadata
on an endpoint.

```bash
inql -t https://<host>/graphql
```


### Querying All Available Types in a Schema

```graphql
query allSchemaTypes {
    __schema {
        types {
            name
            kind
            description
        }
    }
}
```

```graphql
query availableTypes {
  __schema {
    types {
      name, fields {name,description}
    }
  }
}
```

### All Available Queries

```graphql
query availableQueries {
  __schema {
    queryType {
      fields {
        name
        description
      }
    }
  }
}
```

### Enumerate type definition

```graphql
{
  __type (name: \"User\") {
    name fields {
      name type {
        name kind ofType{name kind}
      }
    }
  }
}
```

### Details about an Individual Type

```graphql
query liftType {
  __type(name: "<TYPE>") {
    fields {
      name
      description
    }
  }
}
```
