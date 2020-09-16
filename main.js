const SCREEN_WIDTH = 400;
const SCREEN_HEIGHT = 600;
const PIPE_VELOCITY = -200;
const BIRD_JUMP_VELOCITY = -350;
const GRAVITY = 1000;
const PIPES_TIME_INTERVAL = 1500;
const PIPE_HEIGHT = 500;
const GAP = 110;

const mainState = {
  preload: function () {
    // Загрузка изображений
    game.load.image("bird", "assets/bird.png");
    game.load.image("pipe", "assets/pipe.png");
  },
  create: function () {
    // Добавляем физику в игру
    game.physics.startSystem(Phaser.Physics.Arcade);

    // Цвет фона
    game.stage.backgroundColor = "#3AA6D0";

    // Создание "птички". Добавление ей физики
    this.bird = game.add.sprite(50, 150, "bird");
    game.physics.arcade.enable(this.bird);
    this.bird.body.gravity.y = GRAVITY;

    // Группа барьеров
    this.pipes = game.add.group();

    // Обработка нажатий клавиш
    const upKey = game.input.keyboard.addKey(Phaser.Keyboard.UP);
    upKey.onDown.add(this.jump, this);

    const spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACE);
    spaceKey.onDown.add(this.jump, this);

    // Цикл создания барьеров
    this.timer = game.time.events.loop(
      PIPES_TIME_INTERVAL,
      this.generatePipes,
      this
    );

    // Счёт
    this.score = -1;
    this.scoreLabel = game.add.text(25, 25, "0", {
      font: "22px Tahoma",
      fill: "#fff",
    });
  },
  update: function () {
    // Начинать заново, если птичка вышла за границы экрана
    if (this.bird.y < 0 || this.bird.y > SCREEN_HEIGHT) this.restart();

    // Коллизии для птички и барьеров
    game.physics.arcade.overlap(
      this.bird,
      this.pipes,
      this.restart,
      null,
      this
    );
  },

  restart: function () {
    game.state.start("main");
  },

  jump: function () {
    this.bird.body.velocity.y = BIRD_JUMP_VELOCITY;
  },

  addPipe: function (x, y) {
    // Создаётся барьер и добавляется к группе барьеров
    const pipe = game.add.sprite(x, y, "pipe");
    this.pipes.add(pipe);

    // Добавляется физика
    game.physics.arcade.enable(pipe);
    pipe.body.velocity.x = PIPE_VELOCITY;

    pipe.checkWorldBounds = true;
    pipe.outOfBoundsKill = true;
  },

  generatePipes: function () {
    // Случайная Y-координата для барьера
    const randomY = getRandomInRange(200, 500);
    this.addPipe(SCREEN_WIDTH, Math.floor(randomY));
    this.addPipe(SCREEN_WIDTH, Math.floor(randomY) - (PIPE_HEIGHT + GAP));

    // Увеличивать счёт на 1
    this.score += 1;
    this.scoreLabel.text = this.score;
  },
};

const game = new Phaser.Game(SCREEN_WIDTH, SCREEN_HEIGHT);
game.state.add("main", mainState);
game.state.start("main");

function getRandomInRange(min, max) {
  return Math.random() * (max - min) + min;
}
