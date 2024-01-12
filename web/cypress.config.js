const { defineConfig } = require('cypress')
 
module.exports = defineConfig({
  e2e: {
    supportFile: false,
    setupNodeEvents(on, config) {},
  },
})