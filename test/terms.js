const { registries } = require("..")
const assert = require('assert');

describe("terms schema", async () => {
  before(async () => { ({ terms: { validate } } = await registries() ) })

  it("valid", async () => {
    await assert.doesNotReject(validate([
      {
        "definition": "A unit of measurement for the intensity of light reflected from a movie theater screen into the sensor of a measuring device.  Foot-lamberts is distinct from lumens in that it measures the light that reaches the human eye, not the light output from the projector.  The gain factor of the screen and ambient light in the auditorium can cause a significant difference between the two.  Per DCI requirements, a digital cinema system should be capable of lighting the screen to 14 fL.",
        "relatedTerms": [
          "Lumen",
          "Nit",
          "Photoradiometer"
        ],
        "symbols": [
          "fl",
          "fL",
          "ft-L"
        ],
        "term": "Foot-lambert"
      },
      {
        "term": "Gain"
      }
    ]))
  })


  it("not a valid URL", async () => {
    await assert.rejects(validate([
      {
        "definition": "A unit of measurement for the intensity of light reflected from a movie theater screen into the sensor of a measuring device.  Foot-lamberts is distinct from lumens in that it measures the light that reaches the human eye, not the light output from the projector.  The gain factor of the screen and ambient light in the auditorium can cause a significant difference between the two.  Per DCI requirements, a digital cinema system should be capable of lighting the screen to 14 fL.",
        "relatedTerms": [
          "Lumen",
          "Nit",
          "Photoradiometer"
        ],
        "sources": [
          "wikipedia.org/wiki/Foot-lambert"
        ],
        "symbols": [
          "fl",
          "fL",
          "ft-L"
        ],
        "term": "Foot-lambert"
      }
    ]), /fails schema/)
  })


  it("missing term", async () => {
    await assert.rejects(validate([
      {
        "termContext": "Audio"
      }
    ]), /fails schema/)
  })

})
