import scaleLinear from "ag-grid-enterprise/src/charts/scale/linearScale";
import {BandScale} from "ag-grid-enterprise/src/charts/scale/bandScale";
import {Scene} from "ag-grid-enterprise/src/charts/scene/scene";
import {Group} from "ag-grid-enterprise/src/charts/scene/group";
import {Text} from "ag-grid-enterprise/src/charts/scene/shape/text";
import {Rect} from "ag-grid-enterprise/src/charts/scene/shape/rect";
import {DropShadow, Offset} from "ag-grid-enterprise/src/charts/scene/dropShadow";
import {Axis} from "ag-grid-enterprise/src/charts/axis";

const gradientTheme = [
    ['#69C5EC', '#53AFD6'],
    ['#FDED7C', '#FDE95C'],
    ['#B6D471', '#A4CA4E'],
    ['#EC866B', '#E76846'],
    ['#FB9D5D', '#FA8535'],
];

function renderChart() {
    const data = [
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

    const yFields = ['q1Actual', 'q2Actual', 'q3Actual', 'q4Actual'];
    const yFieldNames = ['Q1', 'Q2', 'Q3', 'Q4'];
    const colors = gradientTheme;

    const padding = {
        top: 20,
        right: 40,
        bottom: 40,
        left: 60
    };
    const n = data.length;
    const xData = data.map(d => d.category);
    // For each category returns an array of values representing the height
    // of each bar in the group.
    const yData = data.map(datum => {
        const values: number[] = [];
        yFields.forEach(field => values.push((datum as any)[field]));
        return values;
    });

    const chartWidth = document.body.getBoundingClientRect().width;
    const chartHeight = 480;
    const seriesWidth = chartWidth - padding.left - padding.right;
    const seriesHeight = chartHeight - padding.top - padding.bottom;

    const yScale = scaleLinear();
    // Find the tallest bar in each group, then the tallest bar overall.
    yScale.domain = [0, Math.max(...yData.map(values => Math.max(...values)))];
    yScale.range = [seriesHeight, 0];

    const xGroupScale = new BandScale<string>();
    xGroupScale.domain = xData;
    xGroupScale.range = [0, seriesWidth];
    xGroupScale.paddingInner = 0.1;
    xGroupScale.paddingOuter = 0.3;
    const groupWidth = xGroupScale.bandwidth;

    const xBarScale = new BandScale<string>();
    xBarScale.domain = yFields;
    xBarScale.range = [0, groupWidth];
    xBarScale.padding = 0.1;
    xBarScale.round = true;
    const barWidth = xBarScale.bandwidth;

    const scene = new Scene(chartWidth, chartHeight);
    scene.parent = document.body;
    const rootGroup = new Group();

    // bars
    const barGroup = new Group();
    barGroup.translationX = padding.left;
    barGroup.translationY = padding.top;
    for (let i = 0; i < n; i++) {
        const category = xData[i];
        const values = yData[i];
        const groupX = xGroupScale.convert(category); // x-coordinate of the group
        values.forEach((value, j) => {
            const barX = xBarScale.convert(yFields[j]); // x-coordinate of the bar within a group
            const x = groupX + barX;
            const y = yScale.convert(value);

            const color = colors[j % colors.length];
            const rect = Rect.create(x, y, barWidth, seriesHeight - y);
            rect.fill = color[0];
            rect.stroke = 'black';
            rect.fillShadow = new DropShadow('rgba(0,0,0,0.2)', new Offset(0, 0), 15);
            rect.opacity = 0.9;

            const labelText = yFieldNames[j];
            const label = new Text();
            label.text = labelText;
            label.textAlign = 'center';
            label.x = x + barWidth / 2;
            label.y = y + 20;
            label.fill = 'black';
            label.font = '14px Verdana';
            barGroup.append([rect, label]);
        });
    }

    // y-axis
    const yAxis = new Axis<number>(yScale);
    yAxis.translationX = padding.left;
    yAxis.translationY = padding.top;
    yAxis.gridLength = seriesWidth;
    yAxis.gridStyle = [{
        stroke: undefined,
        lineDash: undefined
    }, {
        stroke: 'rgba(0, 0, 0, 0.3)',
        lineDash: [5, 5]
    }];
    yAxis.update();

    // x-axis
    const xAxis = new Axis<string>(xGroupScale);
    xAxis.rotation = -90;
    xAxis.translationX = padding.left;
    xAxis.translationY = padding.top + seriesHeight + 1;
    xAxis.parallelLabels = true;
    xAxis.update();

    rootGroup.append([xAxis.group, yAxis.group, barGroup]);
    scene.root = rootGroup;
}

document.addEventListener('DOMContentLoaded', () => {
    renderChart();
});
