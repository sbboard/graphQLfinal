const { GraphQLClient } = require('graphql-request')
const http = require("http");
const API_URL = "http://beta-api-kuroganehammer.azurewebsites.net/api/characters/"

const client = new GraphQLClient('http://192.168.99.100:4499/')

const characterMutation = `mutation createCharacter(
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
      name
    }
  }
`

const moveMutation = `mutation createMoves(
  $name: String!,
  $user: String!
  $hitBoxActive: String,
  $firstActionableFrame: Int,
  $baseDmg: Int,
  $angle: Int,
  $baseKnockBackSetKnockback: Int,
  $landingLag: Int,
  $autoCancel: String,
  $knockbackGrowth: Int,
  $moveType: String,
  $isWeightDependent: Boolean,
) {
  createMoves(data: {
    name: $name
    user: {
      connect: {name:$user}
    }
    hitBoxActive: $hitBoxActive
    firstActionableFrame: $firstActionableFrame
    baseDmg: $baseDmg
    angle: $angle
    baseKnockBackSetKnockback: $baseKnockBackSetKnockback
    landingLag: $landingLag
    autoCancel: $autoCancel
    knockbackGrowth: $knockbackGrowth
    moveType: $moveType
    isWeightDependent: $isWeightDependent
  })
  {
    id
  }
}
`

const movementMutation = `mutation createMovements(
  $user: String!,
  $weight: String,
  $maxJumps: String,
  $wallJump: String,
  $wallCling: String,
  $airSpeed: String,
  $crawl: String
) {
  createMovements(data: {  
    user: {
      connect: {name:$user}
    }
    weight: $weight
    maxJumps: $maxJumps
    wallJump: $wallJump
    wallCling: $wallCling
    airSpeed: $airSpeed
    crawl: $crawl
  })
  {
    id
  }
}
`

async function main() {
  http.get(API_URL, function (response) {  
        let buffer = "", 
            data;
        response.on("data", function (chunk) {
            buffer += chunk;
        }); 
        response.on("end", async function (err) {
          const characterVariables = {
              name: "",
              displayName: "",
              mainImgUrl: "",
              thumbnailImg: "",
              colorTheme: ""
            }
          data = JSON.parse(buffer);
          for(let key in data) {
            characterVariables.name = data[key].Name
            characterVariables.displayName = data[key].DisplayName
            characterVariables.mainImgUrl = imgFix(data[key].MainImageUrl)
            characterVariables.thumbnailImg = imgFix(data[key].ThumbnailUrl)
            characterVariables.colorTheme = data[key].ColorTheme
            await client.request(characterMutation, characterVariables).then(data => console.log(data)).catch(err => console.log(`${err}`))
            //get moves
            await getMoves(data[key].Name)
            //get movements
            await getMovements(data[key].Name)
          }
        }); 
  })
}

async function getMoves(characterName){
  http.get(`${API_URL}name/${characterName}/moves`, function(response){
    let buffer = "", 
        data;
    response.on("data", function (chunk) {
        buffer += chunk;
    }); 
    response.on("end", async function (err) {
      const moveVariables = {
          name: "",
          user: "",
          hitBoxActive: "",
          firstActionableFrame: "",
          baseDmg: "",
          angle: "",
          baseKnockBackSetKnockback: "",
          landingLag: "",
          autoCancel: "",
          knockbackGrowth: "",
          moveType: "",
          isWeightDependent: ""
        }
      data = JSON.parse(buffer);
      for(let key in data) {
        moveVariables.name = data[key].Name
        moveVariables.user = data[key].Owner
        moveVariables.hitBoxActive = data[key].HitboxActive
        moveVariables.firstActionableFrame = parseInt(data[key].FirstActionableFrame)
        moveVariables.baseDmg = parseInt(data[key].BaseDamage)
        moveVariables.angle = parseInt(data[key].Angle)
        moveVariables.baseKnockBackSetKnockback = parseInt(data[key].BaseKnockBackSetKnockback)
        moveVariables.landingLag = parseInt(data[key].LandingLag)
        moveVariables.autoCancel = data[key].AutoCancel
        moveVariables.knockbackGrowth = parseInt(data[key].KnockbackGrowth)
        moveVariables.moveType = data[key].MoveType
        moveVariables.isWeightDependent = data[key].IsWeightDependent
        await client.request(moveMutation, moveVariables).then(data => console.log(data)).catch(err => console.log(`${err}`))
      }
    }); 
  })
}

async function getMovements(characterName){
  await http.get(`${API_URL}name/${characterName}/movements`, function(response){
    let buffer = "", 
        data;
    response.on("data", function (chunk) {
        buffer += chunk;
    }); 
    response.on("end", async function (err) {
      const movementVariables = {
        user: characterName,
        weight: "",
        maxJumps: "",
        runSpeed: "",
        wallJump: "",
        walkSpeed: "",
        wallCling: "",
        airSpeed: "",
        crawl: "",
        fallSpeed: "",
        tether: "",
        fastFallSpeed: "",
        jumpSquat: "",
        airAcceleration: "",
        softLandingLag: "",
        gravity: "",
        hardLandingLag: "",
        shAirTime: "",
        fhAirTime: ""
        }
      data = JSON.parse(buffer);
      for(let key in data) {
        const traitName = data[key].Name
        switch(traitName){
          case "Weight":
            movementVariables.weight = data[key].Value
            break;
          case "Max Jumps":
            movementVariables.maxJumps = data[key].Value
            break;
          case "Wall Jump":
            movementVariables.wallJump = data[key].Value
            break;
          case "Wall Cling":
            movementVariables.wallCling = data[key].Value
            break;
          case "Air Speed":
            movementVariables.airSpeed = data[key].Value
            break;
          case "Crawl":
            movementVariables.crawl = data[key].Value
            break;
        }
      }
      await client.request(movementMutation, movementVariables).then(data => console.log(data)).catch(err => console.log(`${err}`))
    }); 
  })
}

function imgFix(img){
  const splitString = img.split("http://kuroganehammer.com/")
  return `http://kuroganehammer.com/images/${splitString[1]}`
}

main().catch(e => console.error(e))