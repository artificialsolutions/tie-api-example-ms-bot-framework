# v1.3.2
## 14-10-2020
* Updated dependencies

# v1.3.1
## 30-06-2020
* Support for splitting outputs into multiple speech bubbles
* Updated dependencies

# v1.2.0
## 21-08-2019
1. Improved
    * Send request to engine on ConversationUpdate > membersAdded to allow Greeting message to be shown
    * Send attachment details to Teneo Engine (input parameter botframeworkAttachments)

2. Fixed
    * Don't throw error when empty message text is received

# v1.1.0
## 21-08-2019
1. Improved
    * Added support for suggested actions
    * Added support for .env file
    * Include parameter 'channel' in requests to Teneo Engine
