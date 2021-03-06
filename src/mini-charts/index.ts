import { Scene } from "ag-grid-enterprise/src/charts/scene/scene";
import { Group } from "ag-grid-enterprise/src/charts/scene/group";
import { Sector } from "ag-grid-enterprise/src/charts/scene/shape/sector";
import { palettes } from "ag-grid-enterprise/src/charts/chart/palettes";
import { Color } from "ag-grid-enterprise/src/charts/util/color";
import { toRadians } from "ag-grid-enterprise/src/charts/util/angle";
import { Path } from "ag-grid-enterprise/src/charts/scene/shape/path";
import { Line } from "ag-grid-enterprise/src/charts/scene/shape/line";
import linearScale from "ag-grid-enterprise/src/charts/scale/linearScale";
import { BandScale } from "ag-grid-enterprise/src/charts/scale/bandScale";
import { Rect } from "ag-grid-enterprise/src/charts/scene/shape/rect";
import { ClipRect } from "ag-grid-enterprise/src/charts/scene/clipRect";

function createButton(text: string, action: EventListenerOrEventListenerObject): HTMLButtonElement {
    const button = document.createElement('button');
    button.textContent = text;
    document.body.appendChild(button);
    button.addEventListener('click', action);
    return button;
}

abstract class MiniChart {
    protected readonly size = 80;
    protected readonly padding = 5;
    protected readonly root = new Group();
    protected readonly scene: Scene = (() => {
        const scene = new Scene(this.size, this.size);
        scene.root = this.root;
        return scene;
    })();

    readonly element: HTMLElement = this.scene.hdpiCanvas.canvas;

    abstract updateColors(colors: string[]): void;
}

class MiniPie extends MiniChart {
    static readonly angles = [
        [toRadians(-90), toRadians(30)],
        [toRadians(30), toRadians(120)],
        [toRadians(120), toRadians(180)],
        [toRadians(180), toRadians(210)],
        [toRadians(210), toRadians(240)],
        [toRadians(240), toRadians(270)]
    ];

    private readonly radius = (this.size - this.padding * 2) / 2;
    private readonly center = this.radius + this.padding;

    private readonly sectors = MiniPie.angles.map(pair => {
        const sector = Sector.create(this.center, this.center, 0, this.radius, pair[0], pair[1]);
        sector.stroke = undefined;
        return sector;
    });

    constructor(parent: HTMLElement, colors: string[]) {
        super();

        this.scene.parent = parent;
        this.root.append(this.sectors);
        this.updateColors(colors);
    }

    updateColors(colors: string[]) {
        this.sectors.forEach((sector, i) => {
            const color = colors[i];
            sector.fill = color;
            sector.stroke = Color.fromString(color).darker().toHexString();
        });
    }
}

class MiniDonut extends MiniChart {
    private readonly radius = (this.size - this.padding * 2) / 2;
    private readonly center = this.radius + this.padding;

    private readonly sectors = MiniPie.angles.map(pair => {
        const sector = Sector.create(this.center, this.center, this.radius * 0.6, this.radius, pair[0], pair[1]);
        sector.stroke = undefined;
        return sector;
    });

    constructor(parent: HTMLElement, colors: string[]) {
        super();

        this.scene.parent = parent;
        this.root.append(this.sectors);
        this.updateColors(colors);
    }

    updateColors(colors: string[]) {
        this.sectors.forEach((sector, i) => {
            const color = colors[i];
            sector.fill = color;
            sector.stroke = Color.fromString(color).darker().toHexString();
        });
    }
}

class MiniLine extends MiniChart {
    private readonly lines: Path[];

    constructor(parent: HTMLElement, colors: string[]) {
        super();

        this.scene.parent = parent;

        const size = this.size;
        const padding = this.padding;

        const xScale = linearScale();
        xScale.domain = [0, 4];
        xScale.range = [padding, size - padding];

        const yScale = linearScale();
        yScale.domain = [0, 10];
        yScale.range = [size - padding, padding];

        const data = [
            [9, 7, 8, 5, 6],
            [5, 6, 3, 4, 1],
            [1, 3, 4, 8, 7]
        ];

        const leftAxis = Line.create(padding, padding, padding, size);
        leftAxis.stroke = 'gray';
        leftAxis.strokeWidth = 1;

        const bottomAxis = Line.create(0, size - padding, size - padding, size - padding);
        bottomAxis.stroke = 'gray';
        bottomAxis.strokeWidth = 1;

        this.lines = data.map(series => {
            const line = new Path();
            line.strokeWidth = 3;
            line.lineCap = 'round';
            line.fill = undefined;
            series.forEach((datum, i) => {
                line.path[i > 0 ? 'lineTo' : 'moveTo'](xScale.convert(i), yScale.convert(datum));
            });
            return line;
        });

        const clipRect = new ClipRect();
        clipRect.x = padding;
        clipRect.y = padding;
        clipRect.width = size - padding * 2;
        clipRect.height = size - padding * 2;

        clipRect.append(this.lines);
        const root = this.root;
        root.append(clipRect);
        root.append(leftAxis);
        root.append(bottomAxis);

        this.updateColors(colors);
    }

    updateColors(colors: string[]) {
        this.lines.forEach((line, i) => {
            const color = colors[i];
            line.stroke = Color.fromString(color).darker().toHexString();
        });
    }
}

class MiniBar extends MiniChart {
    private readonly bars: Rect[];

    constructor(parent: HTMLElement, colors: string[]) {
        super();

        this.scene.parent = parent;

        const size = this.size;
        const padding = this.padding;

        const data = [2, 3, 4];

        const xScale = new BandScale<number>();
        xScale.domain = [0, 1, 2];
        xScale.range = [padding, size - padding];
        xScale.paddingInner = 0.4;
        xScale.paddingOuter = 0.4;

        const yScale = linearScale();
        yScale.domain = [0, 4];
        yScale.range = [size - padding, padding];

        const leftAxis = Line.create(padding, padding, padding, size);
        leftAxis.stroke = 'gray';
        leftAxis.strokeWidth = 1;

        const bottomAxis = Line.create(0, size - padding, size - padding, size - padding);
        bottomAxis.stroke = 'gray';
        bottomAxis.strokeWidth = 1;
        (this as any).axes = [leftAxis, bottomAxis];

        const rectLineWidth = 1;
        const alignment = Math.floor(rectLineWidth) % 2 / 2;

        const bottom = yScale.convert(0);
        this.bars = data.map((datum, i) => {
            const top = yScale.convert(datum);
            const rect = new Rect();
            rect.strokeWidth = rectLineWidth;
            rect.x = Math.floor(xScale.convert(i)) + alignment;
            rect.y = Math.floor(top) + alignment;
            const width = xScale.bandwidth;
            const height = bottom - top;
            rect.width = Math.floor(width) + Math.floor(rect.x % 1 + width % 1);
            rect.height = Math.floor(height) + Math.floor(rect.y % 1 + height % 1);
            return rect;
        });

        const root = this.root;
        root.append(this.bars);
        root.append(leftAxis);
        root.append(bottomAxis);

        this.updateColors(colors);
    }

    updateColors(colors: string[]) {
        this.bars.forEach((bar, i) => {
            const color = colors[i];
            bar.fill = color;
            bar.stroke = Color.fromString(color).darker().toHexString();
        });
    }
}

class MiniStackedBar extends MiniChart {
    private readonly bars: Rect[][];

    constructor(parent: HTMLElement, colors: string[]) {
        super();

        this.scene.parent = parent;

        const size = this.size;
        const padding = this.padding;

        const data = [
            [8, 12, 16],
            [6, 9, 12],
            [2, 3, 4]
        ];

        const xScale = new BandScale<number>();
        xScale.domain = [0, 1, 2];
        xScale.range = [padding, size - padding];
        xScale.paddingInner = 0.4;
        xScale.paddingOuter = 0.4;

        const yScale = linearScale();
        yScale.domain = [0, 16];
        yScale.range = [size - padding, padding];

        const leftAxis = Line.create(padding, padding, padding, size);
        leftAxis.stroke = 'gray';
        leftAxis.strokeWidth = 1;

        const bottomAxis = Line.create(0, size - padding, size - padding, size - padding);
        bottomAxis.stroke = 'gray';
        bottomAxis.strokeWidth = 1;

        const rectLineWidth = 1;
        const alignment = Math.floor(rectLineWidth) % 2 / 2;

        const bottom = yScale.convert(0);
        this.bars = data.map(series => {
            return series.map((datum, i) => {
                const top = yScale.convert(datum);
                const rect = new Rect();
                rect.strokeWidth = rectLineWidth;
                rect.x = Math.floor(xScale.convert(i)) + alignment;
                rect.y = Math.floor(top) + alignment;
                const width = xScale.bandwidth;
                const height = bottom - top;
                rect.width = Math.floor(width) + Math.floor(rect.x % 1 + width % 1);
                rect.height = Math.floor(height) + Math.floor(rect.y % 1 + height % 1);
                return rect;
            });
        });

        const root = this.root;
        root.append(([] as Rect[]).concat.apply([], this.bars));
        root.append(leftAxis);
        root.append(bottomAxis);

        this.updateColors(colors);
    }

    updateColors(colors: string[]) {
        this.bars.forEach((series, i) => {
            series.forEach(bar => {
                const color = colors[i];
                bar.fill = color;
                bar.stroke = Color.fromString(color).darker().toHexString();
            })
        });
    }
}

const miniPie = new MiniPie(document.body, palettes[0].fills);
const miniDonut = new MiniDonut(document.body, palettes[0].fills);
const miniLine = new MiniLine(document.body, palettes[0].fills);
const miniBar = new MiniBar(document.body, palettes[0].fills);
const miniStackedBar = new MiniStackedBar(document.body, palettes[0].fills);

document.body.appendChild(document.createElement('br'));

let i = 0;
createButton('Next', () => {
    if (i < palettes.length - 2) {
        i++;
    }
    const fills = palettes[i].fills;
    miniPie.updateColors(fills);
    miniDonut.updateColors(fills);
    miniLine.updateColors(fills);
    miniBar.updateColors(fills);
    miniStackedBar.updateColors(fills);
});

function createSwatches() {
    return palettes.map(palette => {
        let divs = palette.fills.slice(0, 6).map(color => {
            return `<div style="width: 24px; height: 24px; background: ${color}; margin: 2px;"></div>`;
        }).join('');
        return `<div class="swatch" style="padding: 5px; border: 1px solid gray; border-radius: 4px; margin: 5px; display: inline-flex;">${divs}</div>`;
    }).join('');
}

const swatchesDiv = document.createElement('div');
swatchesDiv.innerHTML = createSwatches();
document.body.appendChild(swatchesDiv);
