const fs = require("fs")
const path = require("path")

const saveUserWords = function (words, userID) {
  const usersData = require("./users_data.json")
  let savedWords = {}
  if (userID in usersData) {
    if ("words" in usersData[userID]) {
      savedWords = usersData[userID].words
    }
  } else {
    usersData[userID] = {}
  }

  for (let i = 0; i < words.length; i++) {
    const elem = words[i]
    // console.log(elem);
    if (elem in usersData) {
      savedWords[elem] = savedWords[elem] + 1
    } else {
      savedWords[elem] = 1
    }
  }
  usersData[userID].words = savedWords
  fs.writeFile("users_data.json", JSON.stringify(usersData), (err) => {
    if (err) console.log("Error")
  })
}
module.exports.saveWords = saveUserWords

/*
fs.writeFile('data.txt', 'smth', (err) => {
  if (err) console.log('Error');
});

*/

// writing JSON
/*
var map = {
  name: 'Vasya',
  surname: "Pupkin",
  age: 22,
  sex: true
}
fs.writeFile('try.json', JSON.stringify(map), (err) => {
  if (err) console.log('Error');
});
*/

// reading JSON
/*
const tryData = require('./try.json');
console.log(tryData);

 */
