class Game {
  constructor() {

  }

  getState() {
    var gameStateRef = database.ref('gameState');
    gameStateRef.on("value", function (data) {
      gameState = data.val();
    })

  }

  update(state) {
    database.ref('/').update({
      gameState: state
    });
  }

  async start() {
    if (gameState === 0) {
      player = new Player();
      var playerCountRef = await database.ref('playerCount').once("value");
      if (playerCountRef.exists()) {
        playerCount = playerCountRef.val();
        player.getCount();
      }
      form = new Form()
      form.display();
    }

    car1 = createSprite(100, 200);
    car1.addImage("car1", car1_img);
    car2 = createSprite(300, 200);
    car2.addImage("car2", car2_img);
    car3 = createSprite(500, 200);
    car3.addImage("car3", car3_img);
    car4 = createSprite(700, 200);
    car4.addImage("car4", car4_img);
    cars = [car1, car2, car3, car4];
    temp_display = [createElement("h4"), createElement("h4"), createElement("h4"), createElement("h4")]
    if (player.index != null) {
      player.x = player.index * 200 + 175
      player.update();
      console.log(player.x)
    }
  }

  play() {
    form.hide();


    Player.getPlayerInfo();
    player.getCarsAtEnd();
    if (temp_rank.length === 4) {
      for (var i = 0; i < temp_rank.length; i++) {
        temp_rank.sort((a, b) => {
          return b.distance - a.distance
        })
        temp_display[i].html(temp_rank[i].name + ": " + temp_rank[i].distance)
        temp_display[i].position(displayWidth - 200, i * 20)
        if (temp_rank[i].index === player.index) {
          temp_display[i].style("color", "red")
        }
        else {
          temp_display[i].style("color", "black")
        }
      }
    }
    if (allPlayers !== undefined) {
      background(rgb(0, 255, 0));
      image(track, 0, -displayHeight * 4, displayWidth, displayHeight * 5);
      temp_rank = []
      fill(255);
      //s text(mouseX + "," + mouseY, mouseX, mouseY)

      var index = 0;

      x = 175;
      var y;

      for (var plr in allPlayers) {

        index = index + 1;
        temp_rank[index - 1] = allPlayers[plr]
        x = allPlayers[plr].x

        y = displayHeight - allPlayers[plr].distance;
        cars[index - 1].x = allPlayers[plr].x;
        cars[index - 1].y = y;

        if (index === player.index) {
          cars[index - 1].shapeColor = "red";
          camera.position.x = displayWidth / 2;
          camera.position.y = cars[index - 1].y;
          stroke(10);
          fill("red");
          ellipse(x, y, 60, 60);
          for (var i = 0; i < 4; i++) {
            cars[index - 1].bounceOff(cars[i])
          }
        }

        //textSize(15);
        //text(allPlayers[plr].name + ": " + allPlayers[plr].distance, 120,display_position)
      }

    }
    if (keyIsDown(83) && player.index != null) {
          speed=15
          counter=frameCount
          state="boost"
    }
    counter=counter+1
    if(counter===150){
      state="normal"
      counter=0
      speed=10
    }
    if (keyIsDown(UP_ARROW) && player.index !== null) {
      player.distance += speed
      player.update();
      if (engine.isPlaying() != true) {
        engine.play();
      }
    }
    if (keyIsDown(LEFT_ARROW) && player.index !== null) {
      //player.x=x

      if (player.index === 1) {
        player.x = constrain(player.x -= 2, 277, 473)
      }
      if (player.index === 2) {
        player.x = constrain(player.x -= 2, 473, 683)
      }
      if (player.index === 3) {
        player.x = constrain(player.x -= 2, 683, 897)
      } if (player.index === 4) {
        player.x = constrain(player.x -= 2, 897, 1095)
      }
      player.update();
    } if (keyIsDown(RIGHT_ARROW) && player.index !== null) {
      //player.x=x

      if (player.index === 1) {
        player.x = constrain(player.x += 2, 277, 473)
      }
      if (player.index === 2) {
        player.x = constrain(player.x += 2, 473, 683)
      }
      if (player.index === 3) {
        player.x = constrain(player.x += 2, 683, 897)
      } if (player.index === 4) {
        player.x = constrain(player.x += 2, 897, 1095)
      }
      player.update();
    }
    if (player.distance > 3760) {
      gameState = 2;
      player.rank = globalRank + 1
      Player.updateCarsAtEnd(player.rank)
      player.gameEnd=true
      player.update()
      
    }

    drawSprites();
  }

  end() {
    console.log("Game got End");
    console.log(player.rank)
    Player.getPlayerInfo();
    if (engine.isPlaying()) {
      engine.stop();
    }
    background(rgb(0, 255, 0));
    image(track, 0, -displayHeight * 4, displayWidth, displayHeight * 5);
    var index = 0;
    var y = 0;
    var x = 175;
    for (var plr in allPlayers) {
      //add 1 to the index for every loop
      index = index + 1;
temp_display[index-1].html("")
      //position the cars a little away from each other in x direction
      x = x + 200;
      //use data form the database to display the cars in y direction
      y = displayHeight - allPlayers[plr].distance;
      cars[index - 1].x = x;
      cars[index - 1].y = y;
      if (allPlayers[plr].rank != 0) {
        var rank = createElement("h4")
        rank.position(displayWidth / 2, allPlayers[plr].rank * 20)
        rank.html(allPlayers[plr].name + ": " + allPlayers[plr].rank)
         

        if (index === player.index) {
          cars[index - 1].shapeColor = "red";
          camera.position.x = displayWidth / 2;
          camera.position.y = cars[index - 1].y;
          stroke(10);
          fill("red");
          rank.style("color", "gold")
        }
        else {
          rank.style("color", "white")
        }
      }
      if(globalRank===4){
        var newButton =createButton("New Game")
        newButton.position(displayWidth/2,200)
        newButton.mousePressed(()=>{
          player.updateCount(0);
          game.update(0);
          Player.updateCarsAtEnd(0);
          location.reload();
      })
      }
      //textSize(15);
      //text(allPlayers[plr].name + ": " + allPlayers[plr].distance, 120,display_position)
    }
    drawSprites();
  }

}
