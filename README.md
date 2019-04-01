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
```
mutation createCharacter{
  createCharacter(data:{
    name: "Muddy Mole"
  })
  {
    id
    name
  }
}
```
Running this mutation creates the character Muddy Mole.
## Update Move Damage
```
mutation nerfDashAttack{
  updateMoves(where:{
    id:"cjtytgwum00ap07764m5zztzn"
  }
  data:{
    baseDmg:2
  })
  {
    name
    baseDmg
  }
}
```
Finds a move by id, then sets its base damage to 2. Returns the name of the move and the new damage.
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