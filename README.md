# tie-api-example-bot-framework
This node.js example connector allows you to make your Teneo bot available using the Microsoft Bot Framework, allowing you to target channels like Skype, Microsoft Teams and Cortana. The connector acts as middleware between the Microsoft Bot Framework and Teneo. This guide will take you through the steps of registering a new Microsoft bot app and deploying the connector and make it available via Skype.

## Prerequisites
### Https
The Microsoft Bot Framework requires that the connector is available via https. On this page we will be using Heroku to host this connector, for which a (free) Heroku account is needed. You can however also manually install the connector on a location of your choice, see [Running the connector locally](#running-the-connector-locally).

### Teneo Engine
Your bot needs to be published and you need to know the engine url.

## Setup instructions
### Create an app in Microsoft's Application Registration Portal
Before we can deploy our connector, we need an 'Application Id' and 'Application password' from Microsoft. To obtain those, we need to create an app in Microsoft's Application Registration Portal.
1. Go to [https://apps.dev.microsoft.com/](https://apps.dev.microsoft.com/#/appList) and choose 'Add an app'
2. Provide an 'Application Name' (for example, your bot's name) and click 'Create'
3. Copy the 'Application Id' in the 'Properties' section, you will need it later.
4. Under 'Application Secrets' click 'Generate new password'. Copy the password that is shown in the popup, you will need it later. Store it securely. This is the only time when it will be displayed. 

### Deploy the bot connector
Click the button below to deploy the connector to Heroku:

[![Deploy](https://www.herokucdn.com/deploy/button.svg?classes=noborder)](https://heroku.com/deploy?template=https://github.com/artificialsolutions/tie-api-example-ms-bot-framework)


In the 'Config Vars' section, add the following:
* **MICROSOFT_APP_ID:** The 'Application Id' you copied earlier.
* **MICROSOFT_APP_PASSWORD:** The Application password you copied earlier.
* **TENEO_ENGINE_URL:** The engine url.

Click 'View app' and copy the url of your Heroku app, you will need it in the next step.

If you prefer to run your bot locally, see [Running the connector locally](#running-the-connector-locally).

### Register a bot with the Azure Bot Service
To register your bot with the Azure Bot Service, you will need to create a new 'Bot Channels Registration'.
1. Visit [https://portal.azure.com/#create/hub](https://portal.azure.com/#create/hub) and click 'Create'.
2. Give the bot a name, this name will be available in Skype etc.
3. Provide the details for the Subscription, Resource Group and Location.
4. For 'Pricing Tier' you can choose the free 'F0 (10K Premium Messages)' during development.
5. Enter the following URL in the Messaging Endpoint field: https://[yourherokuappname].herokuapp.com/api/messages (replace [yourherokuappname] with the name of your app on Heroku).
6. Click on 'Auto create App ID and password' and in the 'blade' that appears click 'Create new' and in the next blade that appears enter your Application Id and Application Password and click 'Ok'.
7. Click 'Create' in the first blade to create your bot. You will be notified when the bot is available.

That's it! You can now test your bot by opening your bot resource in the Azure portal and choosing 'Test in Web Chat'.

### Add a channel
You can make your bot available on various channels by opening your bot resource in the Azure portal and choosing 'Channels'. As you can see, your bot is already available via the web channel. From here you can choose to make your bot available on other channels like Microsoft Teams or Skype. 

For example, to make your bot available on Skype, follow these steps:
1. Click on the featured 'Skype' channel. This will make your bot accessible from Skype.
2. Go back to the 'Channels' list. Skype should now also be shown in the list of channels for your bot. Click on the link 'Skype'.
3. A new page will open. Click the 'Add to Contacts' and follow the instructions to add your bot to your Skype contacts

## Running the connector locally
If you prefer to manually install this connector or run it locally, proceed as follows:
1. Download or clone the connector source code from [Github](https://github.com/artificialsolutions/tie-api-example-slack-events-api).
2. Install dependencies by running `npm install` in the folder where you stored the source.
3. Make sure your connecter is available via https. When running locally you can for example use ngrok for this: [ngork.com](https://ngrok.com). The connector runs on port 3978 by default.
4. Start the connector with the following command (replacing the environment variables with the appropriate values):
    ```
    MICROSOFT_APP_ID=<your_microsoft_app_id> MICROSOFT_APP_PASSWORD=<your_microsoft_app_password> TENEO_ENGINE_URL=<your_engine_url> node index.js
    ```