<script lang="ts">
	import 'carbon-components-svelte/css/all.css';
	import { Slider } from 'carbon-components-svelte';

	import { onMount } from 'svelte';

	let canvasEl: HTMLCanvasElement;
	let gridSize = 10;
	let maxHeight = 100;

	onMount(() => {
		draw({ gridSize, maxHeight });
	});

	$: if(canvasEl) draw({ gridSize, maxHeight });

	function draw({ gridSize = 10, maxHeight = 100 }: { gridSize: number, maxHeight: number}) {
		const step = Math.PI / gridSize; // Step size in radians, for a full sine wave cycle
		const ctx = canvasEl.getContext('2d');
		const width = canvasEl.width;
		const height = canvasEl.height;

		if (ctx) {
			ctx.clearRect(0, 0, width, height);
			drawNet({ ctx, width, height, gridSize, step, maxHeight});
		} else console.error('Canvas context not found');
	}

	// Simple 3D to 2D projection
	function project({
		x,
		y,
		z,
		height,
		width
	}: {
		x: number;
		y: number;
		z: number;
		height: number;
		width: number;
	}) {
		const scale = 500 / (500 + z);
		const x2D = x * scale + width / 2;
		const y2D = y * scale + height / 2;
		return { x: x2D, y: y2D };
	}

	function getLoadedProjectFn({ height, width }: { height: number; width: number }) {
		return function (x: number, y: number, z: number) {
			return project({ x, y, z, height, width });
		};
	}

	function contextualizeDrawLine(ctx: CanvasRenderingContext2D) {
		return function (x1: number, y1: number, x2: number, y2: number) {
			ctx.beginPath();
			ctx.moveTo(x1, y1);
			ctx.lineTo(x2, y2);
			ctx.stroke();
		};
	}

	// Generate and draw the net
	function drawNet({
		ctx,
		width,
		height,
		gridSize,
		step,
		maxHeight
	}: {
		ctx: CanvasRenderingContext2D;
		width: number;
		height: number;
		gridSize: number;
		step: number;
		maxHeight: number;
	}) {
		const projectFn = getLoadedProjectFn({ height, width });
		const drawLine = contextualizeDrawLine(ctx);
		for (let i = -gridSize; i <= gridSize; i++) {
			for (let j = -gridSize; j <= gridSize; j++) {
				const x = i * gridSize; // Scale for visibility
				const y = j * gridSize;
				const z = Math.sin(i * step) * Math.cos(j * step) * maxHeight; // Scale Z for better visibility

				// Project 3D point to 2D
				const p = projectFn(x, y, z);

				// Draw points and lines
				if (i > -gridSize) {
					// Connect horizontally
					const prevX = (i - 1) * gridSize;
					const prevZ = Math.sin((i - 1) * step) * Math.cos(j * step) * maxHeight;
					const prevP = projectFn(prevX, y, prevZ);
					drawLine(prevP.x, prevP.y, p.x, p.y);
				}
				if (j > -gridSize) {
					// Connect vertically
					const prevY = (j - 1) * gridSize;
					const prevZ = Math.sin(i * step) * Math.cos((j - 1) * step) * maxHeight;
					const prevP = projectFn(x, prevY, prevZ);
					drawLine(prevP.x, prevP.y, p.x, p.y);
				}
			}
		}
	}
</script>

<head>
	<title>3D Fishing Net on Canvas</title>
</head>

<h1>3D Fishing Net on Canvas</h1>
<div class="layout">
	<canvas bind:this={canvasEl} id="canvas3D" width="600" height="600"></canvas>
	<div class="controls">
		<Slider labelText="Grid Size" fullWidth bind:value={gridSize} min={10} max={100} />
		<Slider labelText="Max Height" fullWidth bind:value={maxHeight} min={100} max={1000} />
	</div>
</div>

<style>
	.layout {
		display: flex;
		flex-direction: column;
		justify-content: center;
		margin-top: 50px;
	}

	.controls {
		display: flex;
		flex-direction: column;
		padding: 0 10%;
	}

	canvas {
		margin: 0 auto;
		display: block;
	}
</style>
