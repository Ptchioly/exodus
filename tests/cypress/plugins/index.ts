/// <reference types="cypress" />

// import { DocumentClient } from 'aws-sdk/clients/dynamodb';
// import { configs } from '../../../backend/src/config';

export default (on: Cypress.PluginEvents, config: Cypress.PluginConfigOptions) => {

  // on("task", {

  //   async "db:deleteUser"({ username, accessKeyId, secretAccessKey, region }) {
  //     const params = {
  //       TableName: configs.USER_TABLE,
  //       Key: { username },
  //     };
  //     const documentClient = new DocumentClient({
  //       accessKeyId: accessKeyId,
  //       secretAccessKey: secretAccessKey,
  //       region: region
  //     });
  //     return await documentClient
  //       .delete(params)
  //       .promise()
  //       .catch((err) => err);
  //   },

  //   async "db:getUser"(
  //     { username,
  //       accessKeyId,
  //       secretAccessKey,
  //       region
  //     }
  //   ) {
  //     const params = {
  //       TableName: configs.USER_TABLE,
  //       Key: { username },
  //     };

  //     const documentClient = new DocumentClient({
  //       accessKeyId: accessKeyId,
  //       secretAccessKey: secretAccessKey,
  //       region: region
  //     });

  //     return await documentClient
  //       .get(params)
  //       .promise()
  //       .catch((err) => err);

  //   }

  // });
  return config;
}

