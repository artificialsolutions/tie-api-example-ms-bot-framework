/**
 * Copyright 2018 Artificial Solutions. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *    http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ 

const { ActivityTypes } = require('botbuilder');
const TIE = require('@artificialsolutions/tie-api-client');
const dotenv = require('dotenv');
dotenv.config();

// Teneo engine url
const teneoEngineUrl = process.env.TENEO_ENGINE_URL;

// property to store sessionId in conversation state object
const SESSION_ID_PROPERTY = 'sessionId';

const WELCOMED_USER = 'welcomedUserProperty';

// initialize a Teneo client for interacting with TeneoEengine
const teneoApi = TIE.init(teneoEngineUrl);

class MyBot {
    /**
   *
   * @param {ConversationState} conversation state object
   */
  constructor(conversationState) {
    // Creates a new state accessor property.
    // See https://aka.ms/about-bot-state-accessors to learn more about the bot state and state accessors.
    this.sessionIdProperty = conversationState.createProperty(SESSION_ID_PROPERTY);
    this.welcomedUserProperty = conversationState.createProperty(WELCOMED_USER);

    this.conversationState = conversationState;
  }
  /**
   *
   * @param {TurnContext} on turn context object.
   */
  async onTurn(turnContext) {
    // See https://aka.ms/about-bot-activity-message to learn more about the message and other activity types.
    
    if (turnContext.activity.type === ActivityTypes.Message) {

      // send user input to engine and store sessionId in state in case not stored yet
      await this.handleMessage(turnContext);

    } else if (turnContext.activity.type === ActivityTypes.ConversationUpdate) {
      // Conversation update activities describe a change in a conversation's members, description, existence, or otherwise.
      // We want to send a welcome message to conversation members when they join the conversation
      
      console.log(turnContext.activity.membersAdded)
      // Iterate over all new members added to the conversation
      for (const idx in turnContext.activity.membersAdded) {

        // Only sent message to conversation members who aren't the bot
        if (turnContext.activity.membersAdded[idx].id !== turnContext.activity.recipient.id) {
          
          // send empty input to engine to receive Teneo greeting message and store sessionId in state
          await this.handleMessage(turnContext);
        }

      }
      
    } else {
      console.log(`[${turnContext.activity.type} event detected]`);
    }
    // Save state changes
    await this.conversationState.saveChanges(turnContext);
  }

  /**
   *
   * @param {TurnContext} on turn context object.
   */
  async handleMessage(turnContext) {

    const message = turnContext.activity;
    // console.log(message);
    try {

      let messageText = ""
      if (message.text) {
        messageText = message.text;
      }
      
      console.log(`Got message '${messageText}' from channel ${message.channelId}`);
  
      // find engine session id
      const sessionId = await this.sessionIdProperty.get(turnContext);

      let inputDetails = {
        text: messageText,
        channel: 'botframework-' + message.channelId
      }

      if (message.attachments) {
        inputDetails["botframeworkAttachments"] = JSON.stringify(message.attachments);
      }
  
      // send message to engine using sessionId
      const teneoResponse = await teneoApi.sendInput(sessionId, inputDetails);
  
      console.log(`Got Teneo Engine response '${teneoResponse.output.text}' for session ${teneoResponse.sessionId}`);

      // store egnine sessionId in conversation state
      await this.sessionIdProperty.set(turnContext, teneoResponse.sessionId);
    
      const reply = [];

      // set reply text to answer text from engine
      reply.text = teneoResponse.output.text;

      // check if an output parameter 'msbotframework' exists in engine response
      // if so, check if it should be added as attachment/card or suggestion action
      if (teneoResponse.output.parameters.msbotframework) {
        try {
          const extension = JSON.parse(teneoResponse.output.parameters.msbotframework);

          // suggested actions have an 'actions' key
          if (extension.actions) {
            reply.suggestedActions = extension
          } else {
            // we assume the extension code matches that of an attachment or rich card
            reply.attachments = [extension];
          }
        } catch (error_attach) {
          console.error(`Failed when parsing attachment JSON`, error_attach);
        }
      }

      // send response to bot framework.
      await turnContext.sendActivity(reply);

  
    } catch (error) {
      console.error(`Failed when sending input to Teneo Engine @ ${teneoEngineUrl}`, error);
    }
  
  }
}

module.exports.MyBot = MyBot;