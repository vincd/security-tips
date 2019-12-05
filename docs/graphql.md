GraphQL
=======

## Request useful informations
Introspection is explained [here](https://graphql.org/learn/introspection/). First we need to collect all available
types then recursively enumerate all individual types.

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
