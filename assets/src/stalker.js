export default class Stalker extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, player) {
        super(scene, x, y, texture);
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.player = player;
        this.speed = 100;
        this.sprintSpeed = 300;
        this.state = 'idle'; // idle, stalk, flee
        this.stareTimer = 0;
        this.stareThreshold = 300; // ms
    }

    update(time, dt) {
        const toPlayer = new Phaser.Math.Vector2(this.player.x - this.x, this.player.y - this.y);
        const dist = toPlayer.length();
        const dirToPlayer = toPlayer.normalize();

        // Field of View
        const playerForward = new Phaser.Math.Vector2(0, -1); // simple up direction
        const angle = Phaser.Math.RadToDeg(Phaser.Math.Angle.BetweenPoints(playerForward, dirToPlayer));

        const inFoV = Math.abs(angle) < 50;
        const nearCenter = Math.abs(angle) < 8;

        // Stare detection
        if (nearCenter) this.stareTimer += dt;
        else this.stareTimer = 0;

        if (this.stareTimer > this.stareThreshold) this.state = 'flee';
        else if (inFoV) this.state = 'idle';
        else if (dist < 400) this.state = 'stalk';
        else this.state = 'patrol';

        // Behavior
        switch(this.state) {
            case 'flee': this.fleeFromPlayer(dt); break;
            case 'stalk': this.stalkTowardsPlayer(dt); break;
            case 'idle': this.idleMotion(dt); break;
            case 'patrol': this.patrol(dt); break;
        }
    }

    fleeFromPlayer(dt) {
        const away = new Phaser.Math.Vector2(this.x - this.player.x, this.y - this.player.y).normalize();
        this.x += away.x * this.sprintSpeed * (dt/1000);
        this.y += away.y * this.sprintSpeed * (dt/1000);
    }

    stalkTowardsPlayer(dt) {
        const toward = new Phaser.Math.Vector2(this.player.x - this.x, this.player.y - this.y).normalize();
        this.x += toward.x * this.speed * (dt/1000);
        this.y += toward.y * this.speed * (dt/1000);
    }

    idleMotion(dt) {
        this.x += (Math.random()-0.5) * 0.5;
        this.y += (Math.random()-0.5) * 0.5;
    }

    patrol(dt) {
        // simple patrol (can be replaced by pathfinding)
        this.x += Math.sin(Date.now()/1000) * 0.5;
    }
}
