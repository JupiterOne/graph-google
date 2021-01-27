# Development

## Authentication

The integration executes as a Google Service Account granted access to Google
Workspace domains by super administrators. The JupiterOne managed deployment of
the integration utilizes a single Service Account maintained by JupiterOne, who
is also responsible for protecting the credentials of the Service Account.
Domain super administrators will perform steps in their Google Workspace Admin
Console to grant the JupiterOne Service Account access to their data.

It is important to understand that
[Google Workspace Domain-wide Delegation](https://developers.google.com/admin-sdk/directory/v1/guides/delegation)
allows an authenticated Service Account to act as any user in the authorized
domain. The integration will "impersonate" a user granted permission to utilize
**Admin APIs**. The Service Account may only utilize **API scopes** specified by
the domain super administrator, and the Service Account is further restricted to
the capabilities of the user it impersonates.
