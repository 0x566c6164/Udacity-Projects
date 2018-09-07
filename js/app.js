/*
* GLOBALS
*/
let allEnemies = [];
let gameStarted = false;
let selectorPos = 200;

let gamesPlayed = 0;
let gamesWon = 0;
let score = 0;
let highestScore = 0;

// Enemies our player must avoid
var Enemy = function(y) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
    this.y = y;
    this.speed;
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.

    this.x = this.x + ((this.speed * 25) * dt);

    if(isNaN(this.x) || this.x >= 525) {
      this.x = -100;
      this.speed = Math.floor((Math.random() * 8) + 3); // Returns a random number between 3 & 10
    }
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.

class Player {

  constructor(sprite) {
    this.sprite = sprite;
    this.x = 200;
    this.y = 383;
    this.isMoving = false;
    this.speed = 2;
  }

  update() {
    // Check collisions here
    for(let enemy of allEnemies) {
      if((enemy.y + 42) > this.y
        && (enemy.y < (this.y + 42))
        && (enemy.x + 60) > this.x
        && enemy.x < (this.x + 60)) {
        gamesPlayed++;
        $('#games')[0].innerHTML = `Games played: ${gamesPlayed} | Games won: ${gamesWon}`
        // Resets game settings...
        gameStarted = false;
        player = new Player();
        player.x = 0;
        allEnemies = [];
        selectorPos = 0;
      }
    }

    // Gem collision detection
    if((gem.y + 42) > this.y
      && (gem.y < (this.y + 42))
      && (gem.x + 60) > this.x
      && gem.x < (this.x + 60)) {
        score += gem.value;
        spawnGem();
        $('#score')[0].innerHTML = `Score: ${score} | High Score: ${highestScore}`
      }

    // Win condition
    if(this.y < 0) {
      player.x = 200;
      player.y = 383;
      gamesPlayed++;
      gamesWon++;
      $('#games')[0].innerHTML = `Games played: ${gamesPlayed} | Games won: ${gamesWon}`
      score += 2500;
      $('#score')[0].innerHTML = `Score: ${score} | High Score: ${highestScore}`
    }
  }


  render() {
    if(this.sprite != null) {
      ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }
    if(!gameStarted) {
      charSelector(selectorPos, false);
    }
  }


  handleInput(key) {
    if(!player.isMoving) {
      console.log('Incoming key: ' + key);
      if (key == 'left' && this.x > 0) {
        animateMovement(key, -this.speed, 50); // Block width 101
        player.isMoving = true;
        if(selectorPos > 0) {
          selectorPos -= 100;
        }
      } else if (key == 'right' && this.x < 400) {
        animateMovement(key, this.speed, 50);
        player.isMoving = true;
        if(selectorPos < 400) {
          selectorPos += 100;
        }
      } else if (key == 'up' && this.y > 0) {
        animateMovement(key, -this.speed * 0.83, 50); // Block height 83
        player.isMoving = true;
      } else if (key == 'down' && this.y < 332) {
        animateMovement(key, this.speed * 0.83, 50);
        player.isMoving = true;
      } else if (key == 'enter') {
        charSelector(selectorPos, true);
      }
    }
  }
}


//////////////////////////////////////
//////    MOVEMENT ANIMATION    //////
/////////////////////////////////////

async function animateMovement (key, axis, steps) {
  if (key == 'left' || key == 'right') {
    for(var i = 0; i < steps; i++) {
      await wait(5);
      player.x += axis;
    }
    player.isMoving = false;
  } else if (key == 'up' || key == 'down') {
    for(var i = 0; i < steps; i++) {
      await wait(5);
      player.y += axis;
    }
    player.isMoving = false;
  }
}

async function wait(ms) {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player


////////////////////////////////////
//////    CHARACTER SELECT    //////
////////////////////////////////////

function charSelector(selectorPos, selected) {
  const charSprites = [
    'images/char-boy.png',
    'images/char-cat-girl.png',
    'images/char-horn-girl.png',
    'images/char-pink-girl.png',
    'images/char-princess-girl.png'
  ];

  let posX = 0;
  const posY = 383;
  for(let char in charSprites) {
    ctx.drawImage(Resources.get(charSprites[char]), posX, posY);
    posX+= 100;
  }

  const selector = 'images/Selector.png';
  ctx.drawImage(Resources.get(selector), selectorPos, posY+42);

  // Sprite was selected
  if(selected) {
    switch(selectorPos) {
    case 0:
        startGame(charSprites[0]);
        break;
    case 100:
        startGame(charSprites[1]);
        break;
    case 200:
        startGame(charSprites[2]);
        break;
    case 300:
        startGame(charSprites[3]);
        break;
    case 400:
        startGame(charSprites[4]);
        break;
      }
   }
}


//////////////////////////////////
//////    GAME INITIATION   //////
//////////////////////////////////

var player = new Player();
player.x = 200;
player.y = 999;


function startGame(incomingSprite) {

  player = new Player(incomingSprite);
  player.x = 200;

  allEnemies = [];
    for (var i = 0; i < 3; i++) {
        allEnemies.push(new Enemy(50 + (83 * i)));
    }

    spawnGem();

    gameStarted = true;
    $('h3').remove();
    $('#games')[0].innerHTML = `Games played: ${gamesPlayed} | Games won: ${gamesWon}`
    if(score > highestScore) {
      highestScore = score;
    }
    score = 0;
    $('#score')[0].innerHTML = `Score: ${score} | High Score: ${highestScore}`
}


////////////////////////
//////    GEM    //////
//////////////////////
class Gem {
  constructor(sprite, value) {
    this.sprite = sprite;
    this.value = value;

    // grid system width 5 - height 3
    this.x = (100 * Math.floor(Math.random() * 5)); // Returns a random number between 3 & 10
    this.y = (83 * Math.floor((Math.random() * 3) + 1) - 40); // Returns a random number between 3 & 10
  }

  render() {
      ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
  }
}

var gem = new Gem('images/Gem Blue.png', 100);
gem.x = 999;

function spawnGem() {
  let rand = Math.floor((Math.random() * 8) + 3); // Returns a random number between 3 & 10
  if(rand >= 3 && rand < 6) {
    gem = new Gem('images/Gem Blue.png', 100);
  } else if (rand >= 6 && rand <= 9) {
    gem = new Gem('images/Gem Green.png', 250);
  } else {
    gem = new Gem('images/Gem Orange.png', 500);
  }
}


/////////////////////////
//////    INPUT    //////
////////////////////////

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down',
        13: 'enter'
    };
    console.log(allowedKeys[e.keyCode]);
    player.handleInput(allowedKeys[e.keyCode]);
});
