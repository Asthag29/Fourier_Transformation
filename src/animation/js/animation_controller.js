import EpicycleSystem from './epicycle-system.js';
import { epicycleData } from '../data/epicycle-data.js';

export default class AnimationController {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.context = this.canvas.getContext('2d');
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        
        this.epicycleSystem = new EpicycleSystem(epicycleData);
        
        this.isRunning = true;
        this.time = 0;
        this.fps = 60;
        this.speed = 0.002;
        
        this.xOffset = this.width * 0.25;
        this.yOffset = this.height * 0.5;
    }

    update() {
        if (this.isRunning) {
            this.epicycleSystem.update(this.speed);
            this.time += this.speed;
        }
    }

    render() {
        this.context.fillStyle = '#000';
        this.context.fillRect(0, 0, this.width, this.height);
        this.epicycleSystem.render(this.context, this.xOffset, this.yOffset);
    }

    loop() {
        this.update();
        this.render();s
        requestAnimationFrame(() => this.loop());
    }

    pause() {
        this.isRunning = !this.isRunning;
    }

    reset() {
        this.epicycleSystem.reset();
        this.time = 0;
    }

    clearPath() {
        this.epicycleSystem.clearPath();
    }

    start() {
        this.loop();
    }
}