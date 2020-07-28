#!/usr/bin/env node

const { registries } = require("../../..")

void (async () => {
  Object.values(await registries()).map(({ name, validate }) => {
    console.log(`Checking ${name}`)
    validate()
  })
})().catch(console.error)
