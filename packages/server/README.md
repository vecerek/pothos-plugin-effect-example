# server

To run the server:

```sh
yarn workspace server dev
```

To visit the GraphQL Playground:

```sh
open http://localhost:4000/graphql
```

Example mutation:

```gql
mutation CreateResource($input: ResourceCreateInput!) {
  resourceCreate(input: $input) {
    __typename
    ...on ResourceCreatePayload {
    	resource {
        id
      } 
    }
    ...on InvalidInputError {
      message
    }
  }
}
```

To make it succeed provide the following variables:

```json
{
  "input": {
    "id": "12345"
  }
}
```

To make it fail provide the following variables:

```json
{
  "input": {
    "id": "-1"
  }
}
```

To re-generate the [src/schema.graphql](./src/schema.graphql) file, run:

```sh
yarn workspace server schema:write
```
