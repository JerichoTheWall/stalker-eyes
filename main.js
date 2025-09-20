import Stalker from './src/stalker.js';

const config = {
    type: Phaser.AUTO,
    width: 1080, // FHD target for Galaxy A15
    height: 2340,
    physics: {
        default: 'arcade',
        arcade: {
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

const game = new Phaser.Game(config);

let player, stalker;
let cursors;

function preload() {
    this.load.image('player', 'assets/player.png');
    this.load.image('stalker', 'assets/stalker.png');
    this.load.image('trap', 'assets/trap.png');
    this.load.image('tiles', 'assets/tileset.png');
    this.load.audio('footsteps', 'assets/sound/footsteps.mp3');
    this.load.audio('heartbeat', 'assets/sound/heartbeat.mp3');
    this.load.audio('ambient', 'assets/sound/ambient.mp3');
}

function create() {
    // simple background
    this.add.rectangle(540, 1170, 1080, 2340, 0x111111);

    // Player setup
    player = this.physics.add.sprite(540, 2000, 'player').setScale(1.5);
    cursors = this.input.keyboard.createCursorKeys();

    // Stalker AI
    stalker = new Stalker(this, 540, 300, 'stalker', player);

    // Sound loop
    const ambient = this.sound.add('ambient', { loop: true, volume: 0.2 });
    ambient.play();
}

function update(time, delta) {
    // Player movement
    let speed = 300;
    let vx = 0, vy = 0;

    if(cursors.left.isDown) vx = -speed;
    else if(cursors.right.isDown) vx = speed;

    if(cursors.up.isDown) vy = -speed;
    else if(cursors.down.isDown) vy = speed;

    player.setVelocity(vx, vy);

    // Update Stalker
    stalker.update(time, delta);
}
