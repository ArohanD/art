<script lang="ts">
	import 'carbon-components-svelte/css/all.css';
	import { Dropdown, Slider } from 'carbon-components-svelte';
	import { onMount } from 'svelte';
	import { zFnLib, type ZFnLibEntry, type ZFnLibParam } from './waveFns';
	
	const PROJECTION_PLANE = 500;

	let canvasEl: HTMLCanvasElement;
	let gridSize = 15;
	let maxHeight = 15;

	let zFnConfig: ZFnLibEntry;
	let additionalConfigs: ZFnLibParam[] = [];

	onMount(() => {
		setZFnEntry('mountains');
	});

	$: if (additionalConfigs && canvasEl) draw({ gridSize, maxHeight });

	function draw({ gridSize = 10, maxHeight = 100 }: { gridSize: number; maxHeight: number }) {
		const ctx = canvasEl.getContext('2d');
		const width = canvasEl.width;
		const height = canvasEl.height;
		const step = width / gridSize; 

		if (ctx) {
			ctx.clearRect(0, 0, width, height);
			drawNet({ ctx, width, height, gridSize, step, maxHeight });
		} else console.error('Canvas context not found');
	}

	// 3D to 2D projection
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
		const scale = PROJECTION_PLANE / (PROJECTION_PLANE + z);
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
		const zFn = zFnConfig.zFnCreator(reduceParamsToObj(additionalConfigs));
		for (let i = -gridSize; i <= gridSize; i++) {
			for (let j = -gridSize; j <= gridSize; j++) {
				const x = i * gridSize; // Scale for visibility
				const y = j * gridSize;
				const z = zFn({ x: i * step, y: j * step }) * maxHeight; // Scale Z for better visibility

				// Project 3D point to 2D
				const p = projectFn(x, y, z);

				// Draw points and lines
				if (i > -gridSize) {
					// Connect horizontally
					const prevX = (i - 1) * gridSize;
					const prevZ = zFn({ x: (i - 1) * step, y: j * step }) * maxHeight;
					const prevP = projectFn(prevX, y, prevZ);
					drawLine(prevP.x, prevP.y, p.x, p.y);
				}
				if (j > -gridSize) {
					// Connect vertically
					const prevY = (j - 1) * gridSize;
					const prevZ = zFn({ x: i * step, y: (j - 1) * step }) * maxHeight;
					const prevP = projectFn(x, prevY, prevZ);
					drawLine(prevP.x, prevP.y, p.x, p.y);
				}
			}
		}
	}

	function setZFnEntry(selectedFnName: string) {
		const libEntry = zFnLib[selectedFnName];
		if (!libEntry) throw new Error('No lib entry found');
		zFnConfig = libEntry;
		additionalConfigs = libEntry.params;
	}

	const reduceParamsToObj = (params: ZFnLibParam[]) =>
		params.reduce((acc: Record<string, any>, { paramName, defaultVal }) => {
			acc[paramName] = defaultVal;
			return acc;
		}, {});
</script>

<head>
	<title>3D Fishing Net on Canvas</title>
</head>

<h1>3D Fishing Net on Canvas</h1>
<div class="layout">
	<canvas bind:this={canvasEl} id="canvas3D" width="600" height="600"></canvas>

	<div class="controls">
		<Slider labelText="Grid Size" fullWidth bind:value={gridSize} min={0} max={100} />
		<Slider labelText="Max Height" fullWidth bind:value={maxHeight} min={0} max={1000} />
		<Dropdown
			titleText="Z Function"
			selectedId="0"
			on:select={(e) => setZFnEntry(e.detail.selectedItem.text)}
			items={Object.keys(zFnLib).map((key, i) => ({
				id: i.toString(),
				text: key,
				item: zFnLib[key]
			}))}
		/>
		<h4 class="additionalConfigText">Additional Configuration</h4>
		{#each additionalConfigs as { paramName, defaultVal, displayName }, i}
			<Slider
				labelText={displayName}
				fullWidth
				bind:value={defaultVal}
				min={0}
				max={5}
				step={0.1}
				on:change={(e) => {
					const val = +e.detail.toFixed(2);
					const newAdditionalConfigs = [...additionalConfigs];
					newAdditionalConfigs[i].defaultVal = val;
					additionalConfigs = newAdditionalConfigs;
				}}
			/>
		{/each}
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
	.additionalConfigText {
		margin-top: 20px;
	}
	canvas {
		margin: 0 auto;
		display: block;
	}
</style>
