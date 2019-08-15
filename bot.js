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
    this.conversationState = conversationState;
  }
  /**
   *
   * @param {TurnContext} on turn context object.
   */
  async onTurn(turnContext) {
    // See https://aka.ms/about-bot-activity-message to learn more about the message and other activity types.
    if (turnContext.activity.type === ActivityTypes.Message) {

      // send user input to engine and store sessionId in state
      await this.handleMessage(turnContext);

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
  
    try {
      console.log(`Got message '${message.text}' from channel ${message.channelId}`);
  
      // find engine session id
      const sessionId = await this.sessionIdProperty.get(turnContext);
  
      // send message to engine using sessionId
      const teneoResponse = await teneoApi.sendInput(sessionId, {
        text: message.text
      });
  
      console.log(`Got Teneo Engine response '${teneoResponse.output.text}' for session ${teneoResponse.sessionId}`);

      console.log(teneoResponse.output)
      // store egnine sessionId in conversation state
      await this.sessionIdProperty.set(turnContext, teneoResponse.sessionId);
    
      const reply = [];

      // set reply text to answer text from engine
      reply.text = teneoResponse.output.text;

      // check if an output parameter 'msbotframework' exists in engine response
      // if so, use it as attachment
      if (teneoResponse.output.parameters.msbotframework) {
        try {
          console.log(teneoResponse.output.parameters.msbotframework)
          const attachment = JSON.parse(teneoResponse.output.parameters.msbotframework);
          if (attachment) {
            reply.attachments = [attachment];
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