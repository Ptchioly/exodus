/// <reference types="cypress" />

import { deleteItem, getItem, putItem } from '../../../backend/src/dynamoAPI';
import { configs } from '../../../backend/src/config';
import { generateAccessToken } from '../../../backend/src/routes/auth/validate';
import { encrypt } from '../../../backend/src/routes/auth/utils';
import { nanoid } from 'nanoid';

// import dotenv from "dotenv";

// dotenv.config();


export default (on: Cypress.PluginEvents, config: Cypress.PluginConfigOptions) => {

  // config.env.xToken = process.env.SEED_DEFAULT_XTOKEN;

  on("task", {

    async "db:deleteUser"(user) {
      return await deleteItem(configs.USER_TABLE, {
        username: user,
      })
    },

    async "db:getUser"(user) {
      return await getItem(configs.USER_TABLE, {
        user,
      })
    },

    async "db:createUser"(user = Cypress.env('user')) {
      const id = nanoid(7); // magic id
      const key = nanoid(21); // magic key
      const encryptedPassword = encrypt(user.password, key);
      return await putItem(configs.USER_TABLE, {
        id,
        key,
        ...user.username,
        encryptedPassword,
        ...Cypress.env("xToken")
      })
    },

    "user:setJWT"(username) {
      const token = generateAccessToken(username);
      cy.setCookie('jwt', token, { expiry: configs.MAX_AGE });
    }



  });
  return config;
}

