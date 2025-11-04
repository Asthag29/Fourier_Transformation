export default class Circle {
    constructor(radius, frequency, phase, parent = null) {
        this.radius = radius;
        this.frequency = frequency;     // frequency here is treated as a number of rotations per period
        this.phase = phase;             // initial phase at the start
        this.parent = parent;
        this.rotation = phase;          // current rotation angle
        this.x = 0;
        this.y = 0;
        
        // Position at parent's endpoint if parent exists
        if (this.parent !== null) {
            this.moveToParent();
        }
    }
    
    reset() {
        this.rotation = this.phase;
        if (this.parent !== null) {
            this.moveToParent();
        }
    }
    
    moveToParent() {
        this.x = this.parent.endX;
        this.y = this.parent.endY;
    }
    
    // Update using time increment (legacy method - still works)
    update(deltaT) {
        this.rotation += 2 * Math.PI * this.frequency * deltaT;
        this.rotation = this.rotation % (2 * Math.PI);
        if (this.parent !== null) {
            this.moveToParent();
        }
    }
    
    // NEW: Set rotation based on normalized time t ∈ [0, 1]
    setRotationFromTime(t) {
        this.rotation = this.phase + 2 * Math.PI * this.frequency * t;
        if (this.parent !== null) {
            this.moveToParent();
        }
    }
    
    get endX() {
        return this.x + this.radius * Math.cos(this.rotation);
    }
    
    get endY() {
        return this.y + this.radius * Math.sin(this.rotation);
    }
    
    render(context, xOffset, yOffset) {
        context.strokeStyle = 'rgba(100, 150, 255, 0.4)';
        context.lineWidth = 1;
        // Draw circle
        context.beginPath();
        context.arc(this.x + xOffset, this.y + yOffset, this.radius, 0, 2 * Math.PI);
        context.stroke();
        // Draw radius line
        context.strokeStyle = 'rgba(255, 100, 100, 0.6)';
        context.lineWidth = 2;
        context.beginPath();
        context.moveTo(this.x + xOffset, this.y + yOffset);
        context.lineTo(this.endX + xOffset, this.endY + yOffset);
        context.stroke();
    }
}