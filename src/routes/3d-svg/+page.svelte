<script lang="ts">
	import { onMount } from 'svelte';

	let canvasEl: HTMLCanvasElement;
	const gridSize = 10;
	const step = Math.PI / gridSize; // Step size in radians, for a full sine wave cycle

	onMount(() => {
		const ctx = canvasEl.getContext('2d');
		const width = canvasEl.width;
		const height = canvasEl.height;

		if (ctx) drawNet({ ctx, width, height });
		else console.error('Canvas context not found');
	});

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
		height
	}: {
		ctx: CanvasRenderingContext2D;
		width: number;
		height: number;
	}) {
		const projectFn = getLoadedProjectFn({ height, width });
		const drawLine = contextualizeDrawLine(ctx);
		for (let i = -gridSize; i <= gridSize; i++) {
			for (let j = -gridSize; j <= gridSize; j++) {
				const x = i * 20; // Scale for visibility
				const y = j * 20;
				const z = Math.sin(i * step) * Math.cos(j * step) * 100; // Scale Z for better visibility

				// Project 3D point to 2D
				const p = projectFn(x, y, z);

				// Draw points and lines
				if (i > -gridSize) {
					// Connect horizontally
					const prevX = (i - 1) * 20;
					const prevZ = Math.sin((i - 1) * step) * Math.cos(j * step) * 100;
					const prevP = projectFn(prevX, y, prevZ);
					drawLine(prevP.x, prevP.y, p.x, p.y);
				}
				if (j > -gridSize) {
					// Connect vertically
					const prevY = (j - 1) * 20;
					const prevZ = Math.sin(i * step) * Math.cos((j - 1) * step) * 100;
					const prevP = projectFn(x, prevY, prevZ);
					drawLine(prevP.x, prevP.y, p.x, p.y);
				}
			}
		}
	}
</script>

<h1>Welcome to 3d-art</h1>

<head>
	<title>3D Fishing Net on Canvas</title>
	<style>
		body {
			display: flex;
			justify-content: center;
			margin-top: 50px;
		}
		canvas {
			border: 1px solid black;
		}
	</style>
</head>

<canvas bind:this={canvasEl} id="canvas3D" width="600" height="600"></canvas>
