# Microsft Bot Framework connector for Teneo
This node.js example connector allows you to make your Teneo bot available using the Microsoft Bot Framework, allowing you to target channels like Skype, Microsoft Teams and Cortana. The connector acts as middleware between the Microsoft Bot Framework and Teneo. This guide will take you through the steps of registering a new Microsoft bot app and deploying the connector and make it available via Skype.

## Prerequisites
### Https
The Microsoft Bot Framework requires that the connector is available via https. On this page we will be using Heroku to host this connector, for which a (free) Heroku account is needed. You can however also manually install the connector on a location of your choice, see [Running the connector locally](#running-the-connector-locally).

### Teneo Engine
Your bot needs to be published and you need to know the engine url.

## Setup instructions
### Create an App Registration in Microsoft's Azure Portal
Before we can deploy our connector, we need an 'Application Id' and 'Application password' from Microsoft. To obtain those, we need to create an 'App Registration' in Microsoft's Azure Portal.
1. Go to [https://portal.azure.com/#home](https://portal.azure.com/#home) and in the search bar, find 'App Registrations' and select it from the list of suggested results.
2. On the page that appears, choose 'New registration'
3. Enter an 'Application Name' (for example, your bot's name)
    - give the app registration a name 
    - in the Supported account types, select the 'Accounts in any organizational directory and personal Microsoft accounts (e.g. Skype, Xbox, Outlook.com)' radio button. If any of the other options are selected, bot creation will fail.
    - Next click the 'Register' button.
4. An new page will be opened with the details of your app registration. Copy the 'Application (client) ID' and store it somewhere. You will need it in the next steps. 
5. Click on the 'Certificates & Secrets' menu section. Click the 'New Client Secret' button, leave the description empty and click the 'Add' button. 
6. Copy the generated secret, you will need it in the next step. Store it securely. This is the only time when it will be displayed. 

### Deploy the bot connector
We now have the details the connector needs to be able to run. Click the button below to deploy the connector to Heroku:

[![Deploy](https://www.herokucdn.com/deploy/button.svg?classes=noborder)](https://heroku.com/deploy?template=https://github.com/artificialsolutions/tie-api-example-ms-bot-framework)


In the 'Config Vars' section, add the following:
* **MICROSOFT_APP_ID:** The 'Application (Client) ID' you copied earlier.
* **MICROSOFT_APP_PASSWORD:** The 'Client Secret' you copied earlier.
* **TENEO_ENGINE_URL:** The engine url.

Click 'View app' and copy the url of your Heroku app, you will need it in the next step.

If you prefer to run your bot locally, see [Running the connector locally](#running-the-connector-locally).

### Register a bot with the Azure Bot Service
To register your bot with the Azure Bot Service, you will need to create a new 'Bot Channels Registration'.
1. Go back to [https://portal.azure.com/#home](https://portal.azure.com/#home) and in the search bar, find 'Bot Channels Registration' and select if from the suggested results (it will show up on the right, in the 'Marketplace' section).
2. Give the bot a name, this is the name that will be available in Skype etc.
3. Provide the details for the Subscription, Resource Group and Location.
4. For 'Pricing Tier' you can choose the free 'F0 (10K Premium Messages)' during development.
5. Enter the following URL in the Messaging Endpoint field: https://[yourherokuappname].herokuapp.com/api/messages (replace [yourherokuappname] with the name of your app on Heroku).
    - If you are running the connector locally, use the ngrok url which will look something like https://6ed67af7.ngrok.io/api/message
6. Click on 'Auto create App ID and password' and in the 'blade' that appears click 'Create new' and in the next blade that appears enter the 'Application (client) ID' and 'Client Secret' that you copied earlier and click 'Ok'.
7. Click 'Create' in the first blade to create your bot. You will be notified when the bot is available.

That's it! You can now test your bot by opening your bot resource in the Azure portal and choosing 'Test in Web Chat'.

### Add a channel
You can make your bot available on various channels by opening your bot resource in the Azure portal and choosing 'Channels'. As you can see, your bot is already available via the web channel. From here you can choose to make your bot available on other channels like Microsoft Teams or Skype. 

For example, to make your bot available on Skype, follow these steps:
1. Click on the featured 'Skype' channel. This will make your bot accessible from Skype.
2. Go back to the 'Channels' list. Skype should now also be shown in the list of channels for your bot. Click on the link 'Skype'.
3. A new page will open. Click the 'Add to Contacts' and follow the instructions to add your bot to your Skype contacts.

## Adding media to messages from your bot
To add [media or cards](https://docs.microsoft.com/en-us/azure/bot-service/bot-builder-howto-add-media-attachments?view=azure-bot-service-4.0&tabs=javascript), this connector looks for an output parameter `msbotframework` in the engine response. The value of that parameter is assumed to contain the media or card JSON as defined by Microsoft.

If we look at Microsoft's specification of an [image attachment](https://docs.microsoft.com/en-us/azure/bot-service/bot-builder-howto-add-media-attachments?view=azure-bot-service-4.0&tabs=javascript#send-attachments), the value of the `msbotframework` output parameter to attach an image would need to look like this: 
```
{
    "name": "image.png",
    "contentType": "image/png",
    "contentUrl": "https://url.to/an/image.png"
}
```

## Engine input parameters
### channel
The input parameter `channel` allows you to add channel specfic optimisations to your bot. The value start with `botframework-` and the botframework channel is appended. For example, the value for requests from users that use Teams is `botframework-msteams`.

### botframeworkAttachments
Users can send attachment to the bot (for example GIF's from Teams). The attachement details are included in an input parameter `botframeworkAttachements`. The value is a string that looks something like this:

```
[
    {
        "contentType": "image/*",
        "contentUrl": "https://media3.giphy.com/media/B0vFTrb0ZGDf2/giphy.gif"
    },
    {
        "contentType": "text/html",
        "content": "<div><div>\n<div><img alt=\"happy toddlers and tiaras GIF (GIF Image)\" height=\"242\" src=\"https://media3.giphy.com/media/B0vFTrb0ZGDf2/giphy.gif\" width=\"460\" style=\"max-height:250px; width:460px; height:242px\"></div>\n\n\n</div>\n</div>"
    }
]
```


## Running the connector locally
If you prefer to manually install this connector or run it locally, proceed as follows:
1. Download or clone the connector source code
    ```
    git clone https://github.com/artificialsolutions/tie-api-example-ms-bot-framework.git && cd tie-api-example-ms-bot-framework
    ```
2. Install dependencies by running the following command in the folder where you stored the source:
    ```
    npm install
    ```
3. Make sure your connector is available via https. When running locally you can for example use ngrok for this: [ngrok.com](https://ngrok.com). The connector runs on port 3978 by default:
    ```
    ngrok http 3978
    ```
4. Create a `.env` file in the folder where you stored the source and the following parameters:
    ```
    MICROSOFT_APP_ID=<your_microsoft_app_id>
    MICROSOFT_APP_PASSWORD=<your_microsoft_app_password>
    TENEO_ENGINE_URL=<your_engine_url>
    ```
5. Start the connector with the following command:
    ```
    node server.js
    ```
