# JupiterOne Managed Integration for Google

A JupiterOne integration ingests information such as configurations and other
metadata about digital and physical assets belonging to an organization. The
integration is responsible for connecting to data provider APIs and determining
changes to make to the JupiterOne graph database to reflect the current state of
assets. Managed integrations execute within the JupiterOne infrastructure and
are deployed by the JupiterOne engineering team.

## Integration Instance Configuration

JupiterOne accounts may configure a number of instances of an integration, each
containing credentials and other information necessary for the integration to
connect to provider APIs. An integration is triggered by an event containing the
instance configuration. `IntegrationInstance.config` is encrypted at rest and
decrypted before it is delivered to the integration execution handler.

Local execution of the integration is started through `execute.ts` (`yarn start`), which may be changed to load development credentials into the
`IntegrationInstance.config`. Use environment variables to avoid publishing
sensitive information to GitHub!

## Development Environment

Integrations mutate the graph to reflect configurations and metadata from the
provider. Developing an integration involves:

1.  Establishing a secure connection to a provider API
2.  Fetching provider data and converting it to entities and relationships
3.  Collecting the existing set of entities and relationships already in the graph
4.  Performing a diff to determine which entites/relationships to create/update/delete
5.  Delivering create/update/delete operations to the persister to update the graph

Run the integration to see what happens:

1.  Install Docker
2.  `yarn install`
3.  `yarn start:graph`
4.  `yarn start`

Activity is logged to the console indicating the operations produced and
processed. View raw data in the graph database using
[Graphexp](https://github.com/bricaud/graphexp).

Execute the integration again to see that there are no change operations
produced.

Restart the graph server to clear the data when you want to run the integration
with no existing data:

1.  `yarn stop:graph`
2.  `yarn start:graph`

### Environment Variables

- `GRAPH_DB_ENDPOINT` - `"localhost"`

### Running tests

All tests must be written using Jest. Focus on testing provider API interactions
and conversion from provider data to entities and relationships.

To run tests locally:

```shell
yarn test
```

### Deployment

Managed integrations are deployed into the JupiterOne infrastructure by staff
engineers using internal projects that declare a dependency on the open source
integration NPM package. The package will be published by the JupiterOne team.

```shell
yarn build:publish
```
