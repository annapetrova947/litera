const { assert } = require("chai")
const app = require("./mongo_server")

describe("App", () => {
  before(async () => {
    await app.connectWithDB()
  })
  after(() => {
    app.deleteUser("testID3")
  })
  it("app should add user", async () => {
    // console.log(abba);
    const testID = "testID3"
    const uid = await app.newUser(
      testID,
      {},
      "Oleg",
      "test@test.com",
      "fsjkf.html"
    )
    const existingResult = await app.checkById(testID)
    assert.equal(existingResult, testID)
  })
  it("app should return user information", async () => {
    // console.log(abba);
    const testID = "testID3"
    const existingResult = await app.getUserInfo(testID)
    const equalResult = {
      username: "testID3",
      name: "Oleg",
      email: "test@test.com",
      imageUrl: "fsjkf.html",
    }
    assert.equal(existingResult.toString(), equalResult.toString())
  })
  it("app should return some nouns by userID", async () => {
    // console.log(abba);
    const testID = "12055025"
    const option = "noun"
    const amount = 5
    const address = "https://courseproject.pythonanywhere.com/getwords"
    const existingResult = await app.getWords(address, testID, option, amount)
    assert.equal(
      JSON.stringify(existingResult),
      '{"words":{"mouse":"мышь","table":"стол","wife":"жена","raticate":"крыса","rat":"крыса"}}'
    )
  })
})
