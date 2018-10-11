// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

const { ActivityTypes } = require('botbuilder');
const TIE = require('@artificialsolutions/tie-api-client');

// Teneo engine url
const teneoEngineUrl = process.env.TENEO_ENGINE_URL || "https://developerarea-dev.teneocloud.com/tiesdktest/";

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

      console.log(turnContext.activity);

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
  
      console.log(sessionId);
  
      // send message to engine using sessionId
      const teneoResponse = await teneoApi.sendInput(sessionId, {
        text: message.text
      });
  
      console.log(`Got Teneo Engine response '${teneoResponse.output.text}' for session ${teneoResponse.sessionId}`);
  
      // store egnine sessionId in conversation state
      await this.sessionIdProperty.set(turnContext, teneoResponse.sessionId);

      console.log(this.sessionIdProperty);
    
      // send engine output text to bot framework
      await turnContext.sendActivity(teneoResponse.output.text);
  
    } catch (error) {
      console.error(`Failed when sending input to Teneo Engine @ ${teneoEngineUrl}`, error);
    }
  
  }
}

module.exports.MyBot = MyBot;