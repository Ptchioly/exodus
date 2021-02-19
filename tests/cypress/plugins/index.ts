/// <reference types="cypress" />

export default (on: Cypress.PluginEvents, config: Cypress.PluginConfigOptions): Cypress.PluginConfigOptions => {
  const env = config.env.config || 'production'
  switch (env) {
    case 'development':
      config.baseUrl = 'http://localhost:5000'
      config.env.apiUrl = 'http://localhost:8080'
      break
    case 'staging':
      config.baseUrl = 'https://staging.beeeee.es'
      config.env.apiUrl = 'https://staging-api.beeeee.es'
      break
    case 'production':
      break
  }
  return config
}
