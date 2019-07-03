import { CartesianChart } from "ag-grid-enterprise/src/charts/chart/cartesianChart";
import { CategoryAxis } from "ag-grid-enterprise/src/charts/chart/axis/categoryAxis";
import { NumberAxis } from "ag-grid-enterprise/src/charts/chart/axis/numberAxis";
import { AreaSeries } from "ag-grid-enterprise/src/charts/chart/series/areaSeries";
import { Chart, LegendPosition } from "ag-grid-enterprise/src/charts/chart/chart";
import { Caption } from "ag-grid-enterprise/src/charts/chart/caption";
import { Path } from "ag-grid-enterprise/src/charts/scene/shape/path";
import { Group } from "ag-grid-enterprise/src/charts/scene/group";
import { DropShadow, Offset } from "ag-grid-enterprise/src/charts/scene/dropShadow";
import borneo, {
    bright,
    flat,
    material,
    pastel,
} from "ag-grid-enterprise/src/charts/chart/palettes";

import './app.css';
import { createButton, createSlider } from "../../lib/ui";

type Datum = {
    category: string,

    q1Budget: number,
    q2Budget: number,
    q3Budget: number,
    q4Budget: number,

    q1Actual: number,
    q2Actual: number,
    q3Actual: number,
    q4Actual: number
};

type Datum2 = {
    xField: string,
    yField1: number,
    yField2: number,
    yField3: number
};

const data: Datum[] = [
    {
        category: 'Coffee',

        q1Budget: 500,
        q2Budget: 500,
        q3Budget: 500,
        q4Budget: 500,

        q1Actual: 450,
        q2Actual: 560,
        q3Actual: 600,
        q4Actual: 700
    },
    {
        category: 'Tea',

        q1Budget: 350,
        q2Budget: 400,
        q3Budget: 450,
        q4Budget: 500,

        q1Actual: 270,
        q2Actual: 380,
        q3Actual: 450,
        q4Actual: 520
    },
    {
        category: 'Milk',

        q1Budget: 200,
        q2Budget: 180,
        q3Budget: 180,
        q4Budget: 180,

        q1Actual: 180,
        q2Actual: 170,
        q3Actual: 190,
        q4Actual: 200
    },
];

const data2: Datum[] = [
    {
        category: 'Coffee',

        q1Budget: 500,
        q2Budget: 500,
        q3Budget: 500,
        q4Budget: 500,

        q1Actual: 0,
        q2Actual: 0,
        q3Actual: 0,
        q4Actual: 0
    }
];

const data3: Datum2[] = [{
    xField: 'Jan',
    yField1: 5,
    yField2: 7,
    yField3: -9,
}, {
    xField: 'Feb',
    yField1: 10,
    yField2: -15,
    yField3: 20
}];

function generateData(n = 50, yFieldCount = 10) {
    const data: any[] = [];
    const yFields: string[] = [];
    for (let i = 0; i < yFieldCount; i++) {
        yFields[i] = 'Y' + (i + 1);
    }
    for (let i = 0; i < n; i++) {
        const datum: any = {
            category: 'A' + (i + 1)
        };
        yFields.forEach(field => {
            datum[field] = Math.random() * 10;
        });
        data.push(datum);
    }
    return {
        data,
        xField: 'category',
        yFields
    };
}

function makeChartResizeable(chart: Chart) {
    let startX = 0;
    let startY = 0;
    let isDragging = false;
    let chartSize: [number, number];
    const scene = chart.scene;

    scene.hdpiCanvas.canvas.addEventListener('mousedown', (e: MouseEvent) => {
        startX = e.offsetX;
        startY = e.offsetY;
        chartSize = chart.size;
        isDragging = true;
    });
    scene.hdpiCanvas.canvas.addEventListener('mousemove', (e: MouseEvent) => {
        if (isDragging) {
            const dx = e.offsetX - startX;
            const dy = e.offsetY - startY;
            chart.size = [chartSize[0] + dx, chartSize[1] + dy];
        }
    });
    scene.hdpiCanvas.canvas.addEventListener('mouseup', () => {
        isDragging = false;
    });
}

function makeNuclearChart() {
    document.body.appendChild(document.createElement('br'));

    const usaData = [
        null, null, null, null, null, 6, 11, 32, 110, 235,
        369, 640, 1005, 1436, 2063, 3057, 4618, 6444, 9822, 15468,
        20434, 24126, 27387, 29459, 31056, 31982, 32040, 31233, 29224, 27342,
        26662, 26956, 27912, 28999, 28965, 27826, 25579, 25722, 24826, 24605,
        24304, 23464, 23708, 24099, 24357, 24237, 24401, 24344, 23586, 22380,
        21004, 17287, 14747, 13076, 12555, 12144, 11009, 10950, 10871, 10824,
        10577, 10527, 10475, 10421, 10358, 10295, 10104, 9914, 9620, 9326,
        5113, 5113, 4954, 4804, 4761, 4717, 4368, 4018
    ];
    const ussrData = [null, null, null, null, null, null, null, null, null, null,
        5, 25, 50, 120, 150, 200, 426, 660, 869, 1060,
        1605, 2471, 3322, 4238, 5221, 6129, 7089, 8339, 9399, 10538,
        11643, 13092, 14478, 15915, 17385, 19055, 21205, 23044, 25393, 27935,
        30062, 32049, 33952, 35804, 37431, 39197, 45000, 43000, 41000, 39000,
        37000, 35000, 33000, 31000, 29000, 27000, 25000, 24000, 23000, 22000,
        21000, 20000, 19000, 18000, 18000, 17000, 16000, 15537, 14162, 12787,
        12600, 11400, 5500, 4512, 4502, 4502, 4500, 4500
    ];
    const startX = 1940;

    const data: {year: string, usa: number, ussr: number}[] = [];
    const n = Math.min(usaData.length, ussrData.length);
    for (let i = 0; i < n; i++) {
        data.push({
            year: String(startX + i),
            usa: usaData[i]!,
            ussr: ussrData[i]!
        });
    }

    const xAxis = new CategoryAxis();
    xAxis.scale.paddingInner = 1;
    xAxis.scale.paddingOuter = 0;
    xAxis.labelRotation = 45;
    xAxis.labelFontSize = 10;
    const yAxis = new NumberAxis();
    const chart = new CartesianChart(xAxis, yAxis);
    chart.parent = document.body;
    chart.width = 1200;
    chart.height = 400;
    chart.title = Caption.create({
        text: 'US and USSR nuclear stockpiles',
        fontWeight: 'bold',
        fontSize: 20,
        fontFamily: 'Verdana, sans-serif'
    });
    chart.subtitle = Caption.create({
        text: 'Sources: thebulletin.org & armscontrol.org',
        fontSize: 12,
        fontFamily: 'Verdana, sans-serif',
        color: 'rgba(0, 0, 0, 0.6)'
    });
    chart.scene.hdpiCanvas.canvas.style.border = '1px solid black';

    const usaArea = new AreaSeries();
    usaArea.yFieldNames = ['USA'];
    usaArea.xField = 'year';
    usaArea.yFields = ['usa'];
    usaArea.data = data;
    usaArea.fills = ['rgba(255, 0, 0, 0.7)'];
    usaArea.stroke = 'maroon';
    usaArea.tooltipEnabled = true;

    const ussrArea = new AreaSeries();
    ussrArea.yFieldNames = ['USSR/Russia'];
    ussrArea.xField = 'year';
    ussrArea.yFields = ['ussr'];
    ussrArea.data = data;
    ussrArea.fills = ['rgba(0, 0, 255, 0.7)'];
    ussrArea.stroke = 'darkblue';
    ussrArea.tooltipEnabled = true;

    chart.addSeries(usaArea);
    chart.addSeries(ussrArea);

    createSlider('skip labels', [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], v => {
        chart.xAxis.labelFormatter = params => {
            return params.index % v === 0 ? params.value : '';
        };
        chart.performLayout();
    });
}

function makeNuclearChartWithNumericX() {
    document.body.appendChild(document.createElement('br'));

    const usaData = [
        null, null, null, null, null, 6, 11, 32, 110, 235,
        369, 640, 1005, 1436, 2063, 3057, 4618, 6444, 9822, 15468,
        20434, 24126, 27387, 29459, 31056, 31982, 32040, 31233, 29224, 27342,
        26662, 26956, 27912, 28999, 28965, 27826, 25579, 25722, 24826, 24605,
        24304, 23464, 23708, 24099, 24357, 24237, 24401, 24344, 23586, 22380,
        21004, 17287, 14747, 13076, 12555, 12144, 11009, 10950, 10871, 10824,
        10577, 10527, 10475, 10421, 10358, 10295, 10104, 9914, 9620, 9326,
        5113, 5113, 4954, 4804, 4761, 4717, 4368, 4018
    ];
    const ussrData = [null, null, null, null, null, null, null, null, null, null,
        5, 25, 50, 120, 150, 200, 426, 660, 869, 1060,
        1605, 2471, 3322, 4238, 5221, 6129, 7089, 8339, 9399, 10538,
        11643, 13092, 14478, 15915, 17385, 19055, 21205, 23044, 25393, 27935,
        30062, 32049, 33952, 35804, 37431, 39197, 45000, 43000, 41000, 39000,
        37000, 35000, 33000, 31000, 29000, 27000, 25000, 24000, 23000, 22000,
        21000, 20000, 19000, 18000, 18000, 17000, 16000, 15537, 14162, 12787,
        12600, 11400, 5500, 4512, 4502, 4502, 4500, 4500
    ];
    const startX = 1940;

    const data: {year: number, usa: number, ussr: number}[] = [];
    const n = Math.min(usaData.length, ussrData.length);
    for (let i = 0; i < n; i++) {
        data.push({
            year: startX + i,
            usa: usaData[i]!,
            ussr: ussrData[i]!
        });
    }

    const xAxis = new NumberAxis();
    xAxis.nice = false;
    const yAxis = new NumberAxis();
    const chart = new CartesianChart(xAxis, yAxis);
    chart.parent = document.body;
    chart.width = 1200;
    chart.height = 400;
    chart.title = Caption.create({
        text: 'US and USSR nuclear stockpiles',
        fontWeight: 'bold',
        fontSize: 20,
        fontFamily: 'Verdana, sans-serif'
    });
    chart.subtitle = Caption.create({
        text: 'Sources: thebulletin.org & armscontrol.org',
        fontSize: 12,
        fontFamily: 'Verdana, sans-serif',
        color: 'rgba(0, 0, 0, 0.6)'
    });
    chart.scene.hdpiCanvas.canvas.style.border = '1px solid black';

    const usaArea = new AreaSeries();
    usaArea.yFieldNames = ['USA'];
    usaArea.xField = 'year';
    usaArea.yFields = ['usa'];
    usaArea.data = data;
    usaArea.fills = ['rgba(255, 0, 0, 0.7)'];
    usaArea.stroke = 'maroon';
    usaArea.tooltipEnabled = true;

    const ussrArea = new AreaSeries();
    ussrArea.yFieldNames = ['USSR/Russia'];
    ussrArea.xField = 'year';
    ussrArea.yFields = ['ussr'];
    ussrArea.data = data;
    ussrArea.fills = ['rgba(0, 0, 255, 0.7)'];
    ussrArea.stroke = 'darkblue';
    ussrArea.tooltipEnabled = true;

    chart.addSeries(usaArea);
    chart.addSeries(ussrArea);
}

document.addEventListener('DOMContentLoaded', () => {
    const xAxis = new CategoryAxis();
    xAxis.scale.paddingInner = 1;
    xAxis.scale.paddingOuter = 0;
    const yAxis = new NumberAxis();
    const chart = new CartesianChart(xAxis, yAxis);
    chart.parent = document.body;
    chart.width = 800;
    chart.height = 500;
    chart.title = Caption.create({
        text: 'Area 51 Charts',
        fontWeight: 'bold',
        fontSize: 16,
        fontFamily: 'Verdana, sans-serif'
    });
    chart.subtitle = Caption.create({
        text: 'and flying saucers',
        fontSize: 12,
        fontFamily: 'Verdana, sans-serif',
        color: 'rgba(0, 0, 0, 0.6)'
    });
    chart.scene.hdpiCanvas.canvas.style.border = '1px solid black';

    const saucer = new Path();
    saucer.fillShadow = new DropShadow('rgba(0,0,0,0.5)', new Offset(5, 5), 10);
    saucer.svgPath = 'M90,31.5c0,-8.7 -12.4,-16 -29.8,-18.8c-1.3,-7.2 -7.6,-12.7 -15.2,-12.7c-7.6,0 -13.9,5.5 -15.2,12.7c-17.4,2.8 -29.8,10.1 -29.8,18.8c0,6.2 6.3,11.7 16.3,15.4l-4,6.6c-0.3,0.8 0.1,1.6 1.1,1.9c1,0.3 2,-0.1 2.3,-0.9l4,-6.5c6.8,2.1 14.8,3.3 23.6,3.5l0,9.5c0,0.8 0.7,1.5 1.5,1.5l0.6,0c0.8,0 1.5,-0.7 1.5,-1.5l0,-9.5c8.7,-0.2 16.8,-1.4 23.6,-3.5l4,6.5c0.3,0.8 1.4,1.2 2.3,0.9c0.9,-0.3 1.4,-1.2 1.1,-1.9l-4.1,-6.6c9.9,-3.7 16.2,-9.2 16.2,-15.4Zm-65,5c-2.8,0 -5,-2.2 -5,-5c0,-2.8 2.2,-5 5,-5c2.8,0 5,2.2 5,5c0,2.8 -2.2,5 -5,5Zm20,0c-2.8,0 -5,-2.2 -5,-5c0,-2.8 2.2,-5 5,-5c2.8,0 5,2.2 5,5c0,2.8 -2.2,5 -5,5Zm0,-15.3c-7.2,0 -14.5,-2 -14.5,-5.7c0,-8 6.5,-14.5 14.5,-14.5c8,0 14.5,6.5 14.5,14.5c0,3.8 -7.3,5.7 -14.5,5.7Zm15,10.3c0,-2.8 2.2,-5 5,-5c2.8,0 5,2.2 5,5c0,2.8 -2.2,5 -5,5c-2.8,0 -5,-2.2 -5,-5Z';

    let flying = true;
    chart.scene.hdpiCanvas.canvas.addEventListener('click', (e: MouseEvent) => {
        const node = chart.scene.root!.pickNode(e.offsetX, e.offsetY);
        if (node === saucer) {
            const acceleration = 0.01;
            let speed = 1;
            function flyDownStep() {
                saucer.translationY += speed;
                speed += acceleration;
                if (saucer.translationY > 1000) {
                    flying = false;
                }
                if (flying) {
                    requestAnimationFrame(flyDownStep);
                }
            }
            flyDownStep();
        }
    });

    (chart.scene.root as Group)!.appendChild(saucer);

    let flyRight = true;
    function step() {
        if (flyRight) {
            saucer.translationX += 1;
            if (saucer.translationX === 700) {
                flyRight = false;
            }
        } else {
            saucer.translationX -= 1;
            if (saucer.translationX === 0) {
                flyRight = true;
            }
        }
        if (flying) {
            requestAnimationFrame(step);
        }
    }
    step();

    function addSeriesIf() {
        if (!chart.series.length) {
            chart.addSeries(areaSeries);
        }
    }

    let backgroundColor = 'white';

    const areaSeries = new AreaSeries();
    addSeriesIf();
    areaSeries.yFieldNames = ['Q1', 'Q2', 'Q3', 'Q4'];
    areaSeries.xField = 'category';
    areaSeries.yFields = ['q1Actual'];
    areaSeries.data = data;
    areaSeries.fills = material.fills;
    areaSeries.tooltipEnabled = true;

    document.body.appendChild(document.createElement('br'));

    createButton('Save Chart Image', () => {
        chart.scene.download({ fileName: 'area-chart', background: backgroundColor });
    });

    createButton('1 y-field', () => {
        addSeriesIf();
        areaSeries.xField = 'category';
        areaSeries.yFields = ['q1Actual'];
        areaSeries.data = data;
    });
    createButton('2 y-fields', () => {
        addSeriesIf();
        areaSeries.xField = 'category';
        areaSeries.yFields = ['q1Actual', 'q2Actual'];
        areaSeries.data = data;
    });
    createButton('3 y-fields', () => {
        addSeriesIf();
        areaSeries.xField = 'category';
        areaSeries.yFields = ['q1Actual', 'q2Actual', 'q3Actual'];
        areaSeries.data = data;
    });
    createButton('4 y-fields', () => {
        addSeriesIf();
        areaSeries.xField = 'category';
        areaSeries.yFields = ['q1Actual', 'q2Actual', 'q3Actual', 'q4Actual'];
        areaSeries.data = data;
    });

    createButton('Generate 10 points', () => {
        addSeriesIf();
        const config = generateData(10, 13);
        areaSeries.yFieldNames = [
            'Roswell',
            'New Mexico',
            'Mantell',
            'Abduction',
            'Kecksburg',
            'Fire in the Sky',
            'Phoenix Lights',
            'Bob Lazar',
            'Fata Morgana',
            'Disclosure Project',
            'Steven M. Greer',
            'Conspiracy',
            'Men in Black'
        ];
        areaSeries.xField = config.xField;
        areaSeries.yFields = config.yFields;
        areaSeries.data = config.data;
        chart.xAxis.labelRotation = 0;
        chart.xAxis.update();
    });

    createButton('No data', () => {
        areaSeries.data = [];
    });
    createButton('Data set #3', () => {
        areaSeries.data = data3;
        areaSeries.xField = 'xField';
        areaSeries.yFields = ['yField1', 'yField2', 'yField3'];
    });

    createButton('Show tooltips', () => {
        areaSeries.tooltipEnabled = true;
    });
    createButton('Hide tooltips', () => {
        areaSeries.tooltipEnabled = false;
    });
    createButton('Custom tooltip class', () => {
        chart.tooltipClass = 'my-tooltip';
    });
    createButton('Use tooltip renderer', () => {
        areaSeries.tooltipRenderer = params => {
            return `<div style="background-color: #d4d1d6; padding: 5px;">
                X: ${params.datum[params.xField]}<br>Y: ${params.datum[params.yField]}
            </div>`;
        };
    });
    createButton('Remove tooltip renderer', () => {
        areaSeries.tooltipRenderer = undefined;
    });
    createButton('Remove all series', () => {
        chart.removeAllSeries();
    });
    createButton('Borneo colors', () => {
        areaSeries.fills = borneo.fills;
    });
    createButton('Material colors', () => {
        areaSeries.fills = material.fills;
    });
    createButton('Pastel colors', () => {
        areaSeries.fills = pastel.fills;
    });
    createButton('Bright colors', () => {
        areaSeries.fills = bright.fills;
    });
    createButton('Flat colors', () => {
        areaSeries.fills = flat.fills;
    });
    createButton('Light theme', () => {
        const labelColor = 'black';

        chart.xAxis.labelColor = labelColor;
        chart.xAxis.gridStyle = [{
            stroke: 'rgb(219, 219, 219)',
            lineDash: [4, 2]
        }];
        chart.xAxis.update();

        chart.yAxis.labelColor = labelColor;
        chart.yAxis.gridStyle = [{
            stroke: 'rgb(219, 219, 219)',
            lineDash: [4, 2]
        }];
        chart.yAxis.update();

        chart.legend.labelColor = labelColor;

        if (chart.title) {
            chart.title.color = labelColor;
        }
        if (chart.subtitle) {
            chart.subtitle.color = labelColor;
        }

        saucer.fill = labelColor;
        document.body.style.backgroundColor = backgroundColor = 'white';
    });
    createButton('Dark theme', () => {
        const labelColor = 'rgb(221, 221, 221)';

        chart.xAxis.labelColor = labelColor;
        chart.xAxis.gridStyle = [{
            stroke: 'rgb(100, 100, 100)',
            lineDash: [4, 2]
        }];
        chart.xAxis.update();

        chart.yAxis.labelColor = labelColor;
        chart.yAxis.gridStyle = [{
            stroke: 'rgb(100, 100, 100)',
            lineDash: [4, 2]
        }];
        chart.yAxis.update();

        chart.legend.labelColor = labelColor;

        if (chart.title) {
            chart.title.color = labelColor;
        }
        if (chart.subtitle) {
            chart.subtitle.color = labelColor;
        }

        saucer.fill = labelColor;
        document.body.style.backgroundColor = backgroundColor = '#1e1e1e';
    });
    createButton('No y-fields', () => {
        areaSeries.yFields = [];
    });
    createButton('Show Legend', () => chart.legend.enabled = true);
    createButton('Hide Legend', () => chart.legend.enabled = false);

    createSlider('lineWidth', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15], v => {
        areaSeries.strokeWidth = v;
    });
    createSlider('line color', ['white', 'yellow', '#1e1e1e'], v => {
        areaSeries.stroke = v;
    });
    createSlider('legendPosition', ['right', 'bottom', 'left', 'top'] as LegendPosition[], v => {
        chart.legendPosition = v;
    });
    createSlider('legend font family', ['sans-serif', 'serif', 'Snell Roundhand'], v => {
        chart.legend.labelFontFamily = v;
    });
    createSlider('normalizeTo', [NaN, 100, 500, 1], v => {
        if (v && chart.title) {
            chart.title.text = 'Normalize to WTFYW';
            chart.subtitle = undefined;
        }
        areaSeries.normalizedTo = v;
    });
    createSlider('marker size', [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26], v => {
        areaSeries.markerSize = v;
    });

    makeChartResizeable(chart);

    makeNuclearChart();
    makeNuclearChartWithNumericX();
});