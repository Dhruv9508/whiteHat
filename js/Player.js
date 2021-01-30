class Player {
  constructor() {
    this.index = null;
    this.distance = 0;
    this.x=this.index*200+175
    this.name = null;
    this.rank = 0;
    this.gameEnd=false
  }

  getCount() {
    var playerCountRef = database.ref('playerCount');
    playerCountRef.on("value", (data) => {
      playerCount = data.val();
    })
  }

  updateCount(count) {
    database.ref('/').update({
      playerCount: count
    });
  }

  update() {
    var playerIndex = "players/player" + this.index;
    database.ref(playerIndex).set({
      name: this.name,
      distance: this.distance,
      x:this.x,
      rank: this.rank,
      index:this.index,
      gameEnd:this.gameEnd
    });
  }

  static getPlayerInfo() {
    var playerInfoRef = database.ref('players');
    playerInfoRef.on("value", (data) => {
      allPlayers = data.val();
    })
  }

  getCarsAtEnd() {
    database.ref("carsAtEnd").on("value", (data) => {
      globalRank = data.val();
    })
  }
  static updateCarsAtEnd(rank) {
    database.ref("/").update({
      carsAtEnd: rank
    })
  }
}
