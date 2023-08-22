# Mail Client for the Backend

## Problem

We want to be able to send mails from the backend.

The typical communication when sending a mail is as follows:

1. Your email client communicates with your SMTP server.
2. Your SMTP server communicates with the recipient's domain's DNS server to find the address of their SMTP server.
3. Your SMTP server communicates with the recipient's SMTP server.
4. The recipient's SMTP server delivers the email to the recipient's mailbox.

### Example use case

A user enters a question into the contact form on the frontend.  
The frontend should now send a request to the backend.  
The backend then send a mail to somebody who can answer this question.

## Constraints

- Currently there doesn't seem to exist a crate to send emails without requiring a mail-server.
  We should therefore also use username and password as credentials in the backend.

## Solutions

### lettre

[lettre](https://crates.io/crates/lettre) is one of the biggest (if not the biggest) mail clients in Rust.

The crate can be used to send emails.
For that it requires a mail-server it can connect to and send mails from.

### mail_smtp

[mail_smtp](https://crates.io/crates/mail-smtp) can also be used to send emails (and also requires a mail-server).

## Decision

We should use the crate `lettre` for sending mails.

## Rationale

`lettre` is as of writing this the most widely used crate I have found with 1,343,736 total downloads.  
The usage also seems easier than with other mail clients.

`mail_smtp` has only 3,457 downloads which can't compare to `lettre`.

## Implications

- We have to create a user in our mail-server `lettre` can use to send emails.
- Our mail-server's configuration has to be provided to the backend (URI, username, password, ...)
