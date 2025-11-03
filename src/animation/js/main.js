import AnimationController from './animation-controller.js';

const controller = new AnimationController('epicycleCanvas');
controller.start();

// Update UI
document.getElementById('circleCount').textContent = 
    controller.epicycleSystem.circles.length;

// Controls
document.getElementById('pauseBtn').addEventListener('click', () => {
    controller.pause();
    document.getElementById('pauseBtn').textContent = 
        controller.isRunning ? 'Pause' : 'Resume';
});

document.getElementById('resetBtn').addEventListener('click', () => {
    controller.reset();
});

document.getElementById('clearPathBtn').addEventListener('click', () => {
    controller.clearPath();
});

// Optional: Load data from Python backend
document.getElementById('loadDataBtn').addEventListener('click', async () => {
    try {
        const response = await fetch('/api/fourier-data');
        const data = await response.json();
        // Reload with new data
        location.reload();
    } catch (error) {
        console.error('Failed to load data:', error);
    }
});