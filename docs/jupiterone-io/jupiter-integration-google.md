# Google

## Overview

JupiterOne provides a managed integration with Google. The integration connects
directly to G Suite Admin SDK to obtain account metadata and analyze resource
relationships. Customers authorize read-only to access to JupiterOne Service Account.

## Integration Instance Configuration

The integration is triggered by an event containing the information for a specific integration instance.

The integration instance configuration requires the and Organization Account ID and administrator email. Also, you should add JupiterOne Service Account as an authorized API client with required permission scopes.

### Getting Organization Account ID

From your Google Admin console:

Click Security, then expand Setup single sign-on (SSO)

Copy the `idpid` property value from the SSO URL. For example, https://accounts.google.com/o/saml2/idp?idpid=C1111abcd provides the ID `C1111abcd`

Enter the value into the Account ID field in the JupiterOne integration configuration.

### Admin API Enablement

The Admin API is not accessible to the JupterOne Service Account until the API is enabled in your G Suite organization and permission is granted to the Service Account.

From your Google Admin console:

1. Click Security, then expand Advanced settings and click on Manage API client access
2. Enter the JupiterOne Service Account client ID 102174985137827290632 into Client Name
3. Add the following API scopes (comma separated):

```text
https://www.googleapis.com/auth/admin.directory.domain.readonly, https://www.googleapis.com/auth/admin.directory.user.readonly, https://www.googleapis.com/auth/admin.directory.group.readonly
```

4. Click Authorize
5. Return to the Admin console, click Security, then API reference
6. Check Enable API access

## Entities

The following entity resources are ingested when the integration runs:

| Google Entity Resource | \_type : \_class of the Entity |
| ---------------------- | ------------------------------ |
| Account                | `google_account` : `Account`   |
| Group                  | `google_group` : `UserGroup`   |
| User                   | `google_user` : `User`         |

## Relationships

The following relationships are created/mapped:

| From                   | Type    | To                     |
| ---------------------- | ------- | ---------------------- |
| `google_account`       | **HAS** | `google_account_group` |
| `google_account`       | **HAS** | `google_user`          |
| `google_account_group` | **HAS** | `google_user`          |
| `google_account_group` | **HAS** | `google_account_group` |

[1]: https://developer.okta.com/docs/api/getting_started/getting_a_token
