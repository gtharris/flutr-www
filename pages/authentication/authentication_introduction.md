---
title: Introduction
sidebar: authentication_sidebar
permalink: authentication_introduction.html
folder: authentication
---

## Overview

On our server, we use authentification to grant permissions to view and edit butterfly data collected by the applications.  We have chosen to use the Users API provided by google. Using this API allows us to offload much of the authentication onto google, and allows anyone with a google account to login to our website. We can then associate these various accounts with data sets and organizations.  

The User API also handles generic functionality you would expect of login pages. It handles the creation of the login page, and provides links that prompt the user to create an accout if they do not have one. It also skips the login page if a user is already signed into a google account.

User API documentation:
(https://cloud.google.com/appengine/docs/go/users/reference)
(https://cloud.google.com/appengine/docs/go/users/)



