import AnimationController from './animation_controller.js';

async function getFourierDataFromBackend(file, n_circles = 100) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('n_circles', n_circles);

    const response = await fetch('http://localhost:8000/api/fourier-data', {
        method: 'POST',
        body: formData
    });
    const result = await response.json();
    if (result.success) {
        return result.circles;
    } else {
        throw new Error(result.error);
    }
}

let animationController = null;

document.getElementById('processBtn').addEventListener('click', async () => {
    const fileInput = document.getElementById('fileInput');
    const selectedFile = fileInput.files[0];
    
    if (!selectedFile) {
        alert('Please select an image file first!');
        return;
    }
    
    try {
        let circlesData = await getFourierDataFromBackend(selectedFile, 100);

        console.log('=== RECEIVED DATA ===');
        console.log('Total circles:', circlesData.length);
        console.log('First 5 circles:', circlesData.slice(0, 5));
        console.log('Amplitude range:', 
            Math.min(...circlesData.map(c => c[0])), 
            'to', 
            Math.max(...circlesData.map(c => c[0]))
        );

        // ✅ SCALE UP the amplitudes if they're too small
        const maxAmp = Math.max(...circlesData.map(c => c[0]));
        if (maxAmp < 1) {
            const scaleFactor = 1000 / maxAmp;
            circlesData = circlesData.map(([amp, freq, phase]) => [
                amp * scaleFactor,
                freq,
                phase
            ]);
            console.log('Scaled amplitudes by:', scaleFactor);
        }

        // ✅ Pass circlesData as second parameter
        animationController = new AnimationController('epicycleCanvas', circlesData);
        animationController.start();
        
        document.getElementById('circleCount').textContent = 
            animationController.epicycleSystem.circles.length;
    } catch (error) {
        console.error('Error processing image:', error);
        alert('Error processing image: ' + error.message);
    }
});

document.getElementById('pauseBtn').addEventListener('click', () => {
    if (animationController) {
        animationController.pause();
        document.getElementById('pauseBtn').textContent = 
            animationController.isRunning ? 'Pause' : 'Resume';
    }
});

document.getElementById('resetBtn').addEventListener('click', () => {
    if (animationController) {
        animationController.reset();
    }
});

document.getElementById('clearPathBtn').addEventListener('click', () => {
    if (animationController) {
        animationController.clearPath();
    }
});