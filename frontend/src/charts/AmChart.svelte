<script lang="ts">
  import {
    useTheme,
    create,
    percent,
    Container,
    color,
  } from "@amcharts/amcharts4/core";
  import {
    StepLineSeries,
    CategoryAxis,
    ValueAxis,
    ColumnSeries,
    XYCursor,
    XYChart,
  } from "@amcharts/amcharts4/charts";
  import am4themes_animated from "@amcharts/amcharts4/themes/animated";

  useTheme(am4themes_animated);

  var container = create("chartdiv", Container);
  container.width = percent(100);
  container.height = percent(100);
  container.layout = "vertical";

  createBulletChart(container, "solid");
  // createBulletChart(container, "gradient");

  /* Create ranges */
  function createRange(axis, from, to, color) {
    var range = axis.axisRanges.create();
    range.value = from;
    range.endValue = to;
    range.axisFill.fill = color;
    range.axisFill.fillOpacity = 0.8;
    range.label.disabled = true;
    range.grid.disabled = true;
  }

  var chart;

  /* Create bullet chart with specified color type for background */
  function createBulletChart(parent, colorType) {
    var lastMonthColor = "#00BFFF";
    var lastMonthValue = 70;
    var currentColor = "#1E90FF";
    var currentValue = 61;

    /* Create chart instance */
    chart = container.createChild(XYChart);
    chart.paddingRight = 25;

    /* Add data */
    chart.data = [
      {
        category: "Taxi",
        value: currentValue,
        target: 78,
      },
    ];

    /* Create axes */
    var categoryAxis = chart.yAxes.push(new CategoryAxis());
    categoryAxis.dataFields.category = "category";
    categoryAxis.renderer.minGridDistance = 30;
    categoryAxis.renderer.grid.template.disabled = true;

    var valueAxis = chart.xAxes.push(new ValueAxis());
    valueAxis.renderer.minGridDistance = 30;
    valueAxis.renderer.grid.template.disabled = true;
    valueAxis.min = 0;
    valueAxis.max = 100;
    valueAxis.strictMinMax = true;
    valueAxis.numberFormatter.numberFormat = "#' UAH'";
    valueAxis.renderer.baseGrid.disabled = true;

    createRange(valueAxis, 0, lastMonthValue, color(lastMonthColor));

    /*
            In order to create separate background colors for each range of values,
            you have to create multiple axisRange objects each with their own fill color
          */
    // if (colorType === "solid") {
    //   var start = 0, end = 20;
    //   for (var i = 0; i < 5; ++i) {
    //     createRange(valueAxis, start, end, am4core.color(colors[i]));
    //     start += 20;
    //     end += 20;
    //   }
    // }
    /*
            In order to create a gradient background, only one axisRange object is needed
            and a gradient object can be assigned to the axisRange's fill property.
          */
    // else if (colorType === "gradient") {
    //   var gradient = new am4core.LinearGradient();
    //   for (var i = 0; i < 5; ++i) {
    //     // add each color that makes up the gradient
    //     gradient.addColor(am4core.color(colors[i]));
    //   }
    //   createRange(valueAxis, 0, 100, gradient);
    // }

    /* Create series */
    var series = chart.series.push(new ColumnSeries());
    series.dataFields.valueX = "value";
    series.dataFields.categoryY = "category";
    series.columns.template.fill = color(currentColor);
    series.columns.template.stroke = color("#fff");
    series.columns.template.strokeWidth = 1;
    series.columns.template.strokeOpacity = 0.5;
    series.columns.template.height = percent(100);
    series.tooltipText = "{value}";

    chart.cursor = new XYCursor();
    chart.cursor.lineX.disabled = true;
    chart.cursor.lineY.disabled = true;

    valueAxis.cursorTooltipEnabled = false;
    chart.arrangeTooltips = false;
  }

  function btn() {
    chart.data[0].target = 15;

    var series2 = chart.series.push(new StepLineSeries());
    series2.dataFields.valueX = "target";
    series2.dataFields.categoryY = "category";
    series2.strokeWidth = 3;
    series2.noRisers = true;
    series2.startLocation = 0.15;
    series2.endLocation = 0.85;
    series2.tooltipText = "{valueX}";
    series2.stroke = color("#000");
  }
</script>

<div id="chartdiv" class="fonts" />
<button on:click={btn}>Button</button>

<style>
  .fonts {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
      Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji",
      "Segoe UI Symbol";
  }

  #chartdiv {
    width: 100%;
    height: 500px;
  }
</style>
