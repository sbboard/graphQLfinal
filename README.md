# Install Project
```
npm install
```
# Starting Database
```
npm run dockerStart
npm run deploy
```
After deploying the GraphQL Playground can be accessed on http://192.168.99.100:4499/
# Seed
```
npm run load
```
Runs a script that loads data from [KuroganeHammer's Smash Bros 4 API](https://github.com/Frannsoft/FrannHammer/wiki)
# Reset Database
```
npm run reset
```
# Query Examples
## List of Characters
```
query getCharList{
  characters{
    name
  }
}
```
Returns a list of every character
## Get Character's Moveset
```
query getBowserMoves{
  character(where:{
    name: "Bowser"
  })
  {
    moveInfo{
      name
      baseDmg
    }
  }
}
```
Returns a list of moves and their respective base damages for characters named "Bowser"
## Get Character's Weight
```
query getPikachuWeight{
  character(where:{
    name: "Pikachu"
  })
  {
    movementsInfo{
      weight
    }
  }
}
```
Returns the weight of characters named "Pikachu"
# Mutation Examples
## Create Character

## Update Move Damage

## Delete Move
```
mutation deleteMove{
  deleteMoves(where:{
    id:"cjtyth3em01ew0776rjltt6j8"
  }){
    user{
      name
    }
    name
  }
}
```
Mutation uses an id to find and delete a specific move. Returns the name of the move and the name of the person who used the move.
# To-Do
- At least 2 Mutation resolvers allowing users to create, update, or upsert an item.