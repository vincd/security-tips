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


## Make GET requests

By default most GraphQL client will make `POST` requests with a JSON payload. On
some servers it's still possible to make a `GET` request and pass the payload
as an argument. The [Apollo documentation](https://www.apollographql.com/docs/apollo-server/requests/#get-requests)
describes this feature:

    Apollo Server also accepts GET requests. A GET request must pass query and
    optionally variables and operationName in the URL.
    ...
    caveat: Mutations cannot be executed via GET requests.

Therefore a request will be:

```http
https://{HOST}/graphql?
query=query%20aTest(%24arg1%3A%20String!)%20%7B%20test(who%3A%20%24arg1)%20%7D
&operationName=aTest
&variables=me
```

As mention in the documentation, it's not possible to perform a `mutation` on
**Apollo Server**. However it's might be possible there is a query call changing
the application state.

Moreover, on some servers this will bypass the `CSRF` protections and you can
include the URL as an external (script to bypass `CORS`).


More information here: [https://blog.doyensec.com/2021/05/20/graphql-csrf.html](https://blog.doyensec.com/2021/05/20/graphql-csrf.html).


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
