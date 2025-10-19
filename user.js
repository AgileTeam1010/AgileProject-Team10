class user {
  constructor(id, name, email) {
    this.id = id;                         // user's unique ID
    this.name = name;                     // user's name
    this.email = email;                   // user's email
    this.level = 1;                       // current level
    this.score = 0;                       // total score
    this.completedQuestions = {           // track completed questions per level
        1: [],                     // level 1   
        2: [],                     // level 2
        3: [],                     // level 3
        4: [],                     // level 4
        5: []                      // level 5
    };
  }
}