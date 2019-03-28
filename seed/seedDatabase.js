const { GraphQLClient } = require('graphql-request')
const characterList = require('./characterList.js')
const http = require("http");
const API_URL = "http://beta-api-kuroganehammer.azurewebsites.net/api/characters/name/"

const client = new GraphQLClient('http://192.168.99.100:4499/')

const mutation = `mutation createCharacter(
    $name: String!,
    $displayName: String,
    $mainImgUrl: String,
    $thumbnailImg: String,
    $colorTheme: String
) {
    createCharacter(data: {
      name: $name
      displayName: $displayName
      mainImgUrl: $mainImgUrl
      thumbnailImg: $thumbnailImg
      colorTheme: $colorTheme
    })
    {
      id
    }
  }
`

async function main(character) {
      http.get(`${API_URL}${character}`, function (response) {  
        var buffer = "", 
            data;
    
        response.on("data", function (chunk) {
            buffer += chunk;
        }); 
        response.on("end", async function (err) {
          const variables = {
              name: character,
              displayName: "",
              mainImgUrl: "",
              thumbnailImg: "",
              colorTheme: ""
            }
          data = JSON.parse(buffer);
          variables.displayName = data.DisplayName
          variables.mainImgUrl = imgFix(data.MainImageUrl)
          variables.thumbnailImg = imgFix(data.ThumbnailUrl)
          variables.colorTheme = data.ColorTheme
          await client
            .request(mutation, variables)
            .then(data => console.log(data))
            .catch(err => console.log(`${err}`))
        }); 
      })
}

function imgFix(img){
  const splitString = img.split("http://kuroganehammer.com/")
  return `http://kuroganehammer.com/images/${splitString[1]}`
}

for (let i=0;i<1;i++) {
    main(characterList[i]).catch(e => console.error(e))
}