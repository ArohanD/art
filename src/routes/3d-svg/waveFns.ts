// return Math.sin(x) * Math.sin(y);

// return Math.cos(x + y);

// return Math.sin(x) * Math.sin(y) + Math.cos(x + y);

// return x * x - y * y;

// let r = Math.sqrt(x * x + y * y);
// return Math.sin(r);

// return Math.exp(-0.1 * (x * x + y * y));

// return Math.exp(-(x * x + y * y));

// const R = 2; // Major radius
// const r = 1; // Minor radius
// let d = Math.sqrt(x * x + y * y) - R;
// return r * r - d * d;

// // Coefficients for customization
// const a = 0.5; // Amplitude for the sine component
// const b = 0.3; // Amplitude for the cosine component
// const c = 0.05; // Slope for the polynomial component
// const d = 5; // Frequency for the sine component
// const e = 3; // Frequency for the cosine component
// const f = 0.1; // Factor for randomness

// // Polynomial term (simple parabola) to create a slope
// const poly = c * (x * x + y * y);

// // Sine and cosine components for undulating terrain
// const sine = a * Math.sin(d * Math.PI * x);
// const cosine = b * Math.cos(e * Math.PI * y);

// // Randomness to simulate natural irregularity
// const random = f * (Math.random() - 0.5);

// return poly + sine + cosine + random;

function mountainRange({
	baseHeight = 0.2,
	mountainAmplitude = 0.3,
	asymmetryX = 0.9,
	asymmetryY = 1.3,
	detailAmplitude = 0.1,
	detailFrequency = 3,
	nonlinearCombination = 0.1,
	maxHeight = 10
}) {
	return function ({ x, y }: { x: number; y: number }) {
		// Asymmetrical components
		const asymmetryXMod = asymmetryX * Math.sin(x * 0.7); // Asymmetrical factor for X
		const asymmetryYMod = asymmetryY * Math.cos(y * 0.5 + 0.3); // Asymmetrical factor for Y

		// Main mountain shape with added asymmetry
		const mountain =
			baseHeight +
			mountainAmplitude * Math.sin(x * 0.3 + asymmetryXMod) +
			mountainAmplitude * Math.cos(y * 0.3 + asymmetryYMod);

		// Adding detailed features with asymmetry
		const detail = detailAmplitude * Math.sin(x * detailFrequency + y * detailFrequency);

		// Non-linear combination for more complexity
		const nonlinearCombinationMod = nonlinearCombination * Math.sin(x * 0.5) * Math.cos(y * 0.5);

		// Combine all features
		const z = mountain + detail + nonlinearCombinationMod;

		return z * maxHeight; // Ensure maxHeight is applied correctly
	};
}

export type ZFnLibParam = {
	paramName: string;
	displayName: string;
	type: 'number';
	defaultVal: number;
};

export type ZFnLibEntry = {
	params: ZFnLibParam[];
	zFnCreator: (...args: any[]) => ({ x, y }: { x: number; y: number }) => number;
};

export const zFnLib: {
	[key: string]: ZFnLibEntry;
} = {
	mountains: {
		params: [
			{ paramName: 'baseHeight', displayName: 'Base Height', type: 'number', defaultVal: 0.2 },
			{
				paramName: 'mountainAmplitude',
				displayName: 'Mountain Amplitude',
				type: 'number',
				defaultVal: 0.3
			},
			{ paramName: 'asymmetryX', displayName: 'Asymmetry X', type: 'number', defaultVal: 0.9 },
			{ paramName: 'asymmetryY', displayName: 'Asymmetry Y', type: 'number', defaultVal: 1.3 },
			{
				paramName: 'detailAmplitude',
				displayName: 'Detail Amplitude',
				type: 'number',
				defaultVal: 0.1
			},
			{
				paramName: 'detailFrequency',
				displayName: 'Detail Frequency',
				type: 'number',
				defaultVal: 3
			},
			{
				paramName: 'nonlinearCombination',
				displayName: 'Nonlinear Combination',
				type: 'number',
				defaultVal: 0.1
			}
		],
		zFnCreator: function mountainRange({
			baseHeight = 0.2,
			mountainAmplitude = 0.3,
			asymmetryX = 0.9,
			asymmetryY = 1.3,
			detailAmplitude = 0.1,
			detailFrequency = 3,
			nonlinearCombination = 0.1,
			maxHeight = 10
		}) {
			return function ({ x, y }: { x: number; y: number }) {
				// Asymmetrical components
				const asymmetryXMod = asymmetryX * Math.sin(x * 0.7); // Asymmetrical factor for X
				const asymmetryYMod = asymmetryY * Math.cos(y * 0.5 + 0.3); // Asymmetrical factor for Y

				// Main mountain shape with added asymmetry
				const mountain =
					baseHeight +
					mountainAmplitude * Math.sin(x * 0.3 + asymmetryXMod) +
					mountainAmplitude * Math.cos(y * 0.3 + asymmetryYMod);

				// Adding detailed features with asymmetry
				const detail = detailAmplitude * Math.sin(x * detailFrequency + y * detailFrequency);

				// Non-linear combination for more complexity
				const nonlinearCombinationMod =
					nonlinearCombination * Math.sin(x * 0.5) * Math.cos(y * 0.5);

				// Combine all features
				const z = mountain + detail + nonlinearCombinationMod;

				return z * maxHeight; // Ensure maxHeight is applied correctly
			};
		}
	},
	sinCosSumWave: {
		params: [
			{ paramName: 'amplitude', displayName: 'Amplitude', type: 'number', defaultVal: 1 },
			{ paramName: 'frequency', displayName: 'Frequency', type: 'number', defaultVal: 1 },
			{ paramName: 'phase', displayName: 'Phase', type: 'number', defaultVal: 0 }
		],
		zFnCreator: function sinCosSumWave({ amplitude = 1, frequency = 1, phase = 0 }) {
			return function ({ x, y }: { x: number; y: number }) {
				return amplitude * (Math.sin(frequency * x + phase) + Math.cos(frequency * y + phase));
			};
		}
	},
	sinCosProductWave: {
		params: [
			{ paramName: 'amplitude', displayName: 'Amplitude', type: 'number', defaultVal: 1 },
			{ paramName: 'frequency', displayName: 'Frequency', type: 'number', defaultVal: 1 },
			{ paramName: 'phase', displayName: 'Phase', type: 'number', defaultVal: 0 }
		],
		zFnCreator: function sinCosProductWave({ amplitude = 1, frequency = 1, phase = 0 }) {
			return function ({ x, y }: { x: number; y: number }) {
				return amplitude * (Math.sin(frequency * x + phase) * Math.cos(frequency * y + phase));
			};
		}
	},
	sinProductWave: {
		params: [
			{ paramName: 'amplitude', displayName: 'Amplitude', type: 'number', defaultVal: 1 },
			{ paramName: 'frequency', displayName: 'Frequency', type: 'number', defaultVal: 1 },
			{ paramName: 'phase', displayName: 'Phase', type: 'number', defaultVal: 0 }
		],
		zFnCreator: function sinProductWave({ amplitude = 1, frequency = 1, phase = 0 }) {
			return function ({ x, y }: { x: number; y: number }) {
				return amplitude * Math.sin(frequency * x * y + phase);
			};
		}
	},
    saddle: {
        params: [],
        zFnCreator: function saddle({}) {
            return function ({ x, y }: { x: number; y: number }) {
                return x * x - y * y;
            };
        }
    },
    sphere: {
        params: [],
        zFnCreator: function sphere({}) {
            return function ({ x, y }: { x: number; y: number }) {
                let r = Math.sqrt(x * x + y * y);
                return Math.sin(r);
            };
        }
    },
    torus: {
        params: [
            { paramName: 'R', displayName: 'Major Radius', type: 'number', defaultVal: 2 },
            { paramName: 'r', displayName: 'Minor Radius', type: 'number', defaultVal: 1 }
        ],
        zFnCreator: function torus({
            R = 2, // Major radius
            r = 1 // Minor radius
        }) {
            return function ({ x, y }: { x: number; y: number }) {
                let d = Math.sqrt(x * x + y * y) - R;
                return r * r - d * d;
            };
        }
    },
    wave: {
        params: [],
        zFnCreator: function wave({}) {
            return function ({ x, y }: { x: number; y: number }) {
                return Math.sin(x) * Math.sin(y);
            };
        }
    },
};
