<template>
  <div 
    class="click-spark-container"
    @click="handleClick"
  >
    <canvas 
      ref="canvas"
      class="click-spark-canvas"
    ></canvas>
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'ClickSpark',
  props: {
    sparkColor: {
      type: String,
      default: '#fff'
    },
    sparkSize: {
      type: Number,
      default: 10
    },
    sparkRadius: {
      type: Number,
      default: 15
    },
    sparkCount: {
      type: Number,
      default: 8
    },
    duration: {
      type: Number,
      default: 400
    },
    easing: {
      type: String,
      default: 'ease-out'
    },
    extraScale: {
      type: Number,
      default: 1.0
    }
  },
  data() {
    return {
      sparks: [],
      startTime: null,
      animationId: null,
      resizeTimeout: null
    }
  },
  mounted() {
    this.resizeCanvas();
    this.startAnimation();
    this.setupResizeObserver();
  },
  beforeUnmount() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
    if (this.resizeTimeout) {
      clearTimeout(this.resizeTimeout);
    }
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
  },
  methods: {
    setupResizeObserver() {
      const parent = this.$refs.canvas.parentElement;
      this.resizeObserver = new ResizeObserver(() => {
        if (this.resizeTimeout) {
          clearTimeout(this.resizeTimeout);
        }
        this.resizeTimeout = setTimeout(() => {
          this.resizeCanvas();
        }, 100);
      });
      this.resizeObserver.observe(parent);
    },
    resizeCanvas() {
      const canvas = this.$refs.canvas;
      const parent = canvas.parentElement;
      const { width, height } = parent.getBoundingClientRect();
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }
    },
    easeFunc(t) {
      switch (this.easing) {
        case 'linear':
          return t;
        case 'ease-in':
          return t * t;
        case 'ease-in-out':
          return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
        default:
          return t * (2 - t);
      }
    },
    draw(timestamp) {
      if (!this.startTime) {
        this.startTime = timestamp;
      }
      const canvas = this.$refs.canvas;
      const ctx = canvas.getContext('2d');
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      this.sparks = this.sparks.filter(spark => {
        const elapsed = timestamp - spark.startTime;
        if (elapsed >= this.duration) {
          return false;
        }

        const progress = elapsed / this.duration;
        const eased = this.easeFunc(progress);

        const distance = eased * this.sparkRadius * this.extraScale;
        const lineLength = this.sparkSize * (1 - eased);

        const x1 = spark.x + distance * Math.cos(spark.angle);
        const y1 = spark.y + distance * Math.sin(spark.angle);
        const x2 = spark.x + (distance + lineLength) * Math.cos(spark.angle);
        const y2 = spark.y + (distance + lineLength) * Math.sin(spark.angle);

        ctx.strokeStyle = this.sparkColor;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();

        return true;
      });

      this.animationId = requestAnimationFrame(this.draw);
    },
    startAnimation() {
      this.animationId = requestAnimationFrame(this.draw);
    },
    handleClick(e) {
      const canvas = this.$refs.canvas;
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const now = performance.now();
      const newSparks = Array.from({ length: this.sparkCount }, (_, i) => ({
        x,
        y,
        angle: (2 * Math.PI * i) / this.sparkCount,
        startTime: now
      }));

      this.sparks.push(...newSparks);
    }
  }
}
</script>

<style scoped>
.click-spark-container {
  position: relative;
  width: 100%;
  height: 100%;
  cursor: pointer;
}

.click-spark-canvas {
  width: 100%;
  height: 100%;
  display: block;
  user-select: none;
  position: absolute;
  top: 0;
  left: 0;
  pointer-events: none;
}
</style>