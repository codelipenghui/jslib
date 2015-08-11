var gridbordercolor = "#eee";

var InitiateFlotBarChart = function () {
    return {
        init: function () {
            var data2 = [{
                color: themesecondary,
                label: "Direct Visits",
                data: [[3, 2], [4, 5], [5, 4], [6, 11], [7, 12], [8, 11], [9, 8], [10, 14], [11, 12], [12, 16], [13, 9],
                [14, 10], [15, 14], [16, 15], [17, 9]],

                lines: {
                    show: true,
                    fill: true,
                    lineWidth: .1,
                    fillColor: {
                        colors: [{
                            opacity: 0
                        }, {
                            opacity: 0.4
                        }]
                    }
                },
                points: {
                    show: false
                },
                shadowSize: 0
            },
                {
                    color: themeprimary,
                    label: "Referral Visits",
                    data: [[3, 10], [4, 13], [5, 12], [6, 16], [7, 19], [8, 19], [9, 24], [10, 19], [11, 18], [12, 21], [13, 17],
                    [14, 14], [15, 12], [16, 14], [17, 15]],
                    bars: {
                        order: 1,
                        show: true,
                        borderWidth: 0,
                        barWidth: 0.4,
                        lineWidth: .5,
                        fillColor: {
                            colors: [{
                                opacity: 0.4
                            }, {
                                opacity: 1
                            }]
                        }
                    }
                },
                {
                    color: themethirdcolor,
                    label: "Search Engines",
                    data: [[3, 14], [4, 11], [5, 10], [6, 9], [7, 5], [8, 8], [9, 5], [10, 6], [11, 4], [12, 7], [13, 4],
                    [14, 3], [15, 4], [16, 6], [17, 4]],
                    lines: {
                        show: true,
                        fill: false,
                        fillColor: {
                            colors: [{
                                opacity: 0.3
                            }, {
                                opacity: 0
                            }]
                        }
                    },
                    points: {
                        show: true
                    }
                }
            ];
            var options = {
                legend: {
                    show: false
                },
                xaxis: {
                    tickDecimals: 0,
                    color: '#f3f3f3'
                },
                yaxis: {
                    min: 0,
                    color: '#f3f3f3',
                    tickFormatter: function (val, axis) {
                        return "";
                    },
                },
                grid: {
                    hoverable: true,
                    clickable: false,
                    borderWidth: 0,
                    aboveData: false,
                    color: '#fbfbfb'

                },
                tooltip: true,
                tooltipOpts: {
                    defaultTheme: false,
                    content: " <b>%x May</b> , <b>%s</b> : <span>%y</span>",
                }
            };
            var placeholder = $("#bar-chart");
            var plot = $.plot(placeholder, data2, options);
        }
    };

}();

var InitiateFlotSelectableChart = function () {
    return {
        init: function () {

            var data = [{
                color: themeprimary,
                label: "cpu",
                data: [["08:00", 18.9], ["08:05", 18.7], ["08:10", 18.4], ["08:15", 19.3], ["08:20", 19.5], ["08:25", 19.3], ["08:30", 19.4], ["08:35", 20.2], ["08:40", 19.8], ["08:45", 19.9], ["08:50", 20.4], ["08:55", 20.1], ["09:00", 20.0], ["09:05", 19.8], ["09:10", 20.4]]
            }, {
                color: themethirdcolor,
                label: "内存",
                data: [["08:00", 10.0], ["08:05", 11.3], ["08:10", 9.9], ["08:15", 9.6], ["08:20", 9.5], ["08:25", 9.5], ["08:30", 9.9], ["08:35", 9.3], ["08:40", 9.2], ["08:45", 9.2], ["08:50", 9.5], ["08:55", 9.6], ["09:00", 9.3], ["09:05", 9.4], ["09:10", 9.79]]
            }, {
                color: themesecondary,
                label: "网络",
                data: [["08:00", 5.8], ["08:05", 6.0], ["08:10", 5.9], ["08:15", 5.5], ["08:20", 5.7], ["08:25", 5.3], ["08:30", 6.1], ["08:35", 5.4], ["08:40", 5.4], ["08:45", 5.1], ["08:50", 5.2], ["08:55", 5.4], ["09:00", 6.2], ["09:05", 5.9], ["09:10", 5.89]]
            }, {
                color: themefourthcolor,
                label: "硬盘",
                data: [["08:00", 8.3], ["08:05", 8.3], ["08:10", 7.8], ["08:15", 8.3], ["08:20", 8.4], ["08:25", 5.9], ["08:30", 6.4], ["08:35", 6.7], ["08:40", 6.9], ["08:45", 7.6], ["08:50", 7.4], ["08:55", 8.1], ["09:00", 12.5], ["09:05", 9.9], ["09:10", 19.0]]
            }];

            var options = {
                series: {
                    lines: {
                        show: true
                    },
                    points: {
                        show: true
                    }
                },
                legend: {
                    noColumns: 4
                },
                xaxis: {
                    tickDecimals: 0,
                    color: gridbordercolor
                },
                yaxis: {
                    min: 0,
                    color: gridbordercolor
                },
                selection: {
                    mode: "x"
                },
                grid: {
                    hoverable: true,
                    clickable: false,
                    borderWidth: 0,
                    aboveData: false
                },
                tooltip: true,
                tooltipOpts: {
                    defaultTheme: false,
                    content: "<b>%s</b> : <span>%x</span> : <span>%y</span>",
                },
                crosshair: {
                    mode: "x"
                }
            };

            var placeholder = $("#selectable-chart");

            placeholder.bind("plotselected", function (event, ranges) {

                var zoom = $("#zoom").is(":checked");

                if (zoom) {
                    plot = $.plot(placeholder, data, $.extend(true, {}, options, {
                        xaxis: {
                            min: ranges.xaxis.from,
                            max: ranges.xaxis.to
                        }
                    }));
                }
            });

            placeholder.bind("plotunselected", function (event) {
                // Do Some Work
            });

            var plot = $.plot(placeholder, data, options);

            $("#clearSelection").click(function () {
                plot.clearSelection();
            });

            $("#setSelection").click(function () {
                plot.setSelection({
                    xaxis: {
                        from: 1994,
                        to: 1995
                    }
                });
            });
        }
    };
}();

var InitiateRealTimeChart = function () {
    return {
        init: function () {
            // We use an inline data source in the example, usually data would
            // be fetched from a server

            var data = [],
                totalPoints = 300;

            function getRandomData() {

                if (data.length > 0)
                    data = data.slice(1);

                // Do a random walk

                while (data.length < totalPoints) {

                    var prev = data.length > 0 ? data[data.length - 1] : 50,
                        y = prev + Math.random() * 10 - 5;

                    if (y < 0) {
                        y = 0;
                    } else if (y > 100) {
                        y = 100;
                    }

                    data.push(y);
                }

                // Zip the generated y values with the x values

                var res = [];
                for (var i = 0; i < data.length; ++i) {
                    res.push([i, data[i]])
                }

                return res;
            }

            // Set up the control widget

            var updateInterval = 70;

            var plot = $.plot("#realtime-chart", [getRandomData()], {
                yaxis: {
                    color: gridbordercolor,
                    min: 0,
                    max: 100
                },
                xaxis: {
                    color: gridbordercolor,
                    min: 0,
                    max: 100
                },
                colors: [themeprimary],
                series: {
                    lines: {
                        lineWidth: 0,
                        fill: true,
                        fillColor: {
                            colors: [{
                                opacity: 0.4
                            }, {
                                opacity: 0
                            }]
                        },
                        steps: false
                    },
                    shadowSize: 0
                },
                grid: {
                    hoverable: true,
                    clickable: false,
                    borderWidth: 0,
                    aboveData: false
                }
            });

            function update() {

                plot.setData([getRandomData()]);

                // Since the axes don't change, we don't need to call plot.setupGrid()

                plot.draw();
                setTimeout(update, updateInterval);
            }
            update();
        }
    };
}();

var InitiateStackedChart = function () {
    return {
        init: function () {
            var d1 = [];
            for (var i = 0; i <= 10; i += 1)
                d1.push([i, parseInt(Math.random() * 30)]);

            var d2 = [];
            for (var i = 0; i <= 10; i += 1)
                d2.push([i, parseInt(Math.random() * 30)]);

            var d3 = [];
            for (var i = 0; i <= 10; i += 1)
                d3.push([i, parseInt(Math.random() * 30)]);

            var data1 = [
                {
                    label: "Windows Phone",
                    data: d1,
                    color: themethirdcolor
                },
                {
                    label: "Android",
                    data: d2,
                    color: themesecondary
                },
                {
                    label: "IOS",
                    data: d3,
                    color: themeprimary
                }
            ];

            var stack = 0,
                bars = false,
                lines = true,
                steps = false;

            function plotWithOptions() {
                $.plot($("#stacked-chart"), data1, {
                    series: {
                        stack: stack,
                        lines: {
                            lineWidth: 1,
                            show: lines,
                            fill: true,
                            steps: steps
                        },
                        bars: {
                            show: bars,
                            barWidth: 0.4
                        }
                    }
                    ,
                    xaxis: {
                        color: gridbordercolor
                    },
                    yaxis: {
                        color: gridbordercolor
                    },
                    grid: {
                        hoverable: true,
                        clickable: false,
                        borderWidth: 0,
                        aboveData: false
                    },
                    legend: {
                        noColumns: 3
                    },
                });
            }

            $(".stackControls input").click(function (e) {
                e.preventDefault();
                stack = $(this).val() == "With stacking" ? true : null;
                plotWithOptions();
            });
            $(".graphControls input").click(function (e) {
                e.preventDefault();
                bars = $(this).val().indexOf("Bars") != -1;
                lines = $(this).val().indexOf("Lines") != -1;
                steps = $(this).val().indexOf("steps") != -1;
                plotWithOptions();
            });

            plotWithOptions();
        }
    };
}();

var InitiateVisitorChart = function () {
    return {
        init: function () {
            var d = [[1196463600000, 0], [1196550000000, 0], [1196636400000, 0], [1196722800000, 77], [1196809200000, 3636], [1196895600000, 3575], [1196982000000, 2736], [1197068400000, 1086], [1197154800000, 676], [1197241200000, 1205], [1197327600000, 906], [1197414000000, 710], [1197500400000, 639], [1197586800000, 540], [1197673200000, 435], [1197759600000, 301], [1197846000000, 575], [1197932400000, 481], [1198018800000, 591], [1198105200000, 608], [1198191600000, 459], [1198278000000, 234], [1198364400000, 1352], [1198450800000, 686], [1198537200000, 279], [1198623600000, 449], [1198710000000, 468], [1198796400000, 392], [1198882800000, 282], [1198969200000, 208], [1199055600000, 229], [1199142000000, 177], [1199228400000, 374], [1199314800000, 436], [1199401200000, 404], [1199487600000, 253], [1199574000000, 218], [1199660400000, 476], [1199746800000, 462], [1199833200000, 448], [1199919600000, 442], [1200006000000, 403], [1200092400000, 204], [1200178800000, 194], [1200265200000, 327], [1200351600000, 374], [1200438000000, 507], [1200524400000, 546], [1200610800000, 482], [1200697200000, 283], [1200783600000, 221], [1200870000000, 483], [1200956400000, 523], [1201042800000, 528], [1201129200000, 483], [1201215600000, 452], [1201302000000, 270], [1201388400000, 222], [1201474800000, 439], [1201561200000, 559], [1201647600000, 521], [1201734000000, 477], [1201820400000, 442], [1201906800000, 252], [1201993200000, 236], [1202079600000, 525], [1202166000000, 477], [1202252400000, 386], [1202338800000, 409], [1202425200000, 408], [1202511600000, 237], [1202598000000, 193], [1202684400000, 357], [1202770800000, 414], [1202857200000, 393], [1202943600000, 353], [1203030000000, 364], [1203116400000, 215], [1203202800000, 214], [1203289200000, 356], [1203375600000, 399], [1203462000000, 334], [1203548400000, 348], [1203634800000, 243], [1203721200000, 126], [1203807600000, 157], [1203894000000, 288]];

            // first correct the timestamps - they are recorded as the daily
            // midnights in UTC+0100, but Flot always displays dates in UTC
            // so we have to add one hour to hit the midnights in the plot

            for (var i = 0; i < d.length; ++i) {
                d[i][0] += 60 * 60 * 1000;
            }

            // helper for returning the weekends in a period

            function weekendAreas(axes) {

                var markings = [],
                    d = new Date(axes.xaxis.min);

                // go to the first Saturday

                d.setUTCDate(d.getUTCDate() - ((d.getUTCDay() + 1) % 7))
                d.setUTCSeconds(0);
                d.setUTCMinutes(0);
                d.setUTCHours(0);

                var i = d.getTime();

                // when we don't set yaxis, the rectangle automatically
                // extends to infinity upwards and downwards

                do {
                    markings.push({ xaxis: { from: i, to: i + 2 * 24 * 60 * 60 * 1000 } });
                    i += 7 * 24 * 60 * 60 * 1000;
                } while (i < axes.xaxis.max);

                return markings;
            }

            var options = {
                xaxis: {
                    mode: "time",
                    tickLength: 5,
                    color: gridbordercolor
                },
                selection: {
                    mode: "x"
                },
                yaxis: {
                    color: gridbordercolor
                },
                grid: {
                    borderWidth: 0,
                    aboveData: false
                },
                series: {
                    lines: {
                        show: true,
                        lineWidth: 1,
                        fill: true,
                        fillColor: {
                            colors: [{
                                opacity: 0.1
                            }, {
                                opacity: 0.15
                            }]
                        }
                    },
                    shadowSize: 0
                }
            };

            var plot = $.plot("#visitors-chart", [{ data: d, color: themefourthcolor }], options);

            var overview = $.plot("#visitors-chart-overview", [{ data: d, color: themefourthcolor }], {
                series: {
                    lines: {
                        show: true,
                        lineWidth: 1
                    },
                    shadowSize: 0
                },
                xaxis: {
                    ticks: [],
                    mode: "time"
                },
                yaxis: {
                    ticks: [],
                    min: 0,
                    autoscaleMargin: 0.1
                },
                selection: {
                    mode: "x"
                },
                grid: {
                    borderWidth: 0,
                    aboveData: false
                }
            });

            // now connect the two

            $("#visitors-chart").bind("plotselected", function (event, ranges) {

                // do the zooming

                plot = $.plot("#visitors-chart", [{ data: d, color: themeprimary }], $.extend(true, {}, options, {
                    xaxis: {
                        min: ranges.xaxis.from,
                        max: ranges.xaxis.to
                    }
                }));

                // don't fire event on the overview to prevent eternal loop

                overview.setSelection(ranges, true);
            });

            $("#visitors-chart-overview").bind("plotselected", function (event, ranges) {
                plot.setSelection(ranges);
            });
        }
    };
}();

var InitiateAnnotationChart = function () {
    return {
        init: function () {
            var d1 = [];
            for (var i = 0; i < 30; ++i) {
                d1.push([i, Math.sin(i)]);
            }

            var data = [{
                data: d1, bars: {
                    show: true,
                    order: 1,
                    fillColor: { colors: [{ color: themeprimary }, { color: themeprimary }] }
                },
                color: themeprimary
            }];

            var markings = [
                { color: "#f5f5f5", yaxis: { from: 1 } },
                { color: "#f5f5f5", yaxis: { to: -1 } },
                { color: themethirdcolor, lineWidth: 1, xaxis: { from: 2, to: 2 } },
                { color: themefourthcolor, lineWidth: 1, xaxis: { from: 8, to: 8 } }
            ];

            var placeholder = $("#annotation-chart");

            var plot = $.plot(placeholder, data, {
                bars: { show: true, barWidth: 0.5, fillColor: { colors: [{ opacity: 0.7 }, { opacity: 1 }] } },
                xaxis: { ticks: [], autoscaleMargin: 0.02, color: gridbordercolor },
                yaxis: { min: -1.5, max: 1.5, color: gridbordercolor },
                grid: { markings: markings, borderWidth: 0, aboveData: false }
            });

            var o = plot.pointOffset({ x: 2, y: -1.2 });

            // Append it to the placeholder that Flot already uses for positioning

            placeholder.append("<div style='position:absolute;left:" + (o.left + 4) + "px;top:" + o.top + "px;color:" + themethirdcolor + ";font-size:smaller'>Warming up</div>");

            o = plot.pointOffset({ x: 8, y: -1.2 });
            placeholder.append("<div style='position:absolute;left:" + (o.left + 4) + "px;top:" + o.top + "px;color:" + themefourthcolor + ";font-size:smaller'>Actual measurements</div>");

            // Draw a little arrow on top of the last label to demonstrate canvas
            // drawing

            var ctx = plot.getCanvas().getContext("2d");
            ctx.beginPath();
            o.left += 4;
            ctx.moveTo(o.left, o.top);
            ctx.lineTo(o.left, o.top - 10);
            ctx.lineTo(o.left + 10, o.top - 5);
            ctx.lineTo(o.left, o.top);
            ctx.fillStyle = themefourthcolor;
            ctx.fill();

            // Add the Flot version string to the footer
        }
    };
}();

var InitiatePieChart = function () {
    return {
        init: function () {
            // Example Data

            //var data = [
            //	{ label: "Series1",  data: 10},
            //	{ label: "Series2",  data: 30},
            //	{ label: "Series3",  data: 90},
            //	{ label: "Series4",  data: 70},
            //	{ label: "Series5",  data: 80},
            //	{ label: "Series6",  data: 110}
            //];

            var data = [
            	{ label: "Windows", data: [[1, 10]], color: themefifthcolor },
            	{ label: "Linux", data: [[1, 30]], color: themesecondary },
            	{ label: "Mac OS X", data: [[1, 90]], color: themethirdcolor },
            	{ label: "Android", data: [[1, 70]], color: themefourthcolor },
            	{ label: "Unix", data: [[1, 80]], color: themeprimary }
            ];

            //var data = [
            //	{ label: "Series A",  data: 0.2063},
            //	{ label: "Series B",  data: 38888}
            //];

            // Randomly Generated Data

            //var data = [],
            //    series = Math.floor(Math.random() * 6) + 3;

            //for (var i = 0; i < series; i++) {
            //    data[i] = {
            //        label: "Series" + (i + 1),
            //        data: Math.floor(Math.random() * 100) + 1
            //    }
            //}

            var placeholder = $("#pie-chart");

            $("#example-1").click(function () {

                placeholder.unbind();

                $("#title").text("Default pie chart");
                $.plot(placeholder, data, {
                    series: {
                        pie: {
                            show: true,
                            gradient: {
                                radial: true,
                                colors: [
                                  { opacity: 0.5 },
                                  { opacity: 1.0 }
                                ]
                            }
                        }
                    }
                });
            });

            $("#example-2").click(function () {

                placeholder.unbind();

                $("#title").text("Default without legend");
                $.plot(placeholder, data, {
                    series: {
                        pie: {
                            show: true
                        }
                    },
                    legend: {
                        show: false
                    }
                });
            });

            $("#example-3").click(function () {

                placeholder.unbind();

                $("#title").text("Custom Label Formatter");

                $.plot(placeholder, data, {
                    series: {
                        pie: {
                            show: true,
                            radius: 1,
                            label: {
                                show: true,
                                radius: 1,
                                formatter: labelFormatter,
                                background: {
                                    opacity: 0.8
                                }
                            }
                        }
                    },
                    legend: {
                        show: false
                    }
                });
            });

            $("#example-4").click(function () {

                placeholder.unbind();

                $("#title").text("Label Radius");
                $.plot(placeholder, data, {
                    series: {
                        pie: {
                            show: true,
                            radius: 1,
                            label: {
                                show: true,
                                radius: 3 / 4,
                                formatter: labelFormatter,
                                background: {
                                    opacity: 0.5
                                }
                            }
                        }
                    },
                    legend: {
                        show: false
                    }
                });
            });

            $("#example-5").click(function () {

                placeholder.unbind();

                $("#title").text("Label Styles #1");

                $.plot(placeholder, data, {
                    series: {
                        pie: {
                            show: true,
                            radius: 1,
                            label: {
                                show: true,
                                radius: 3 / 4,
                                formatter: labelFormatter,
                                background: {
                                    opacity: 0.5,
                                    color: "#000"
                                }
                            }
                        }
                    },
                    legend: {
                        show: false
                    }
                });
            });

            $("#example-6").click(function () {

                placeholder.unbind();

                $("#title").text("Label Styles #2");

                $.plot(placeholder, data, {
                    series: {
                        pie: {
                            show: true,
                            radius: 3 / 4,
                            label: {
                                show: true,
                                radius: 3 / 4,
                                formatter: labelFormatter,
                                background: {
                                    opacity: 0.5,
                                    color: "#000"
                                }
                            }
                        }
                    },
                    legend: {
                        show: false
                    }
                });
            });

            $("#example-7").click(function () {

                placeholder.unbind();

                $("#title").text("Hidden Labels");

                $.plot(placeholder, data, {
                    series: {
                        pie: {
                            show: true,
                            radius: 1,
                            label: {
                                show: true,
                                radius: 2 / 3,
                                formatter: labelFormatter,
                                threshold: 0.1
                            }
                        }
                    },
                    legend: {
                        show: false
                    }
                });
            });

            $("#example-8").click(function () {

                placeholder.unbind();

                $("#title").text("Combined Slice");

                $.plot(placeholder, data, {
                    series: {
                        pie: {
                            show: true,
                            combine: {
                                color: "#999",
                                threshold: 0.05
                            }
                        }
                    },
                    legend: {
                        show: false
                    }
                });
            });

            $("#example-9").click(function () {

                placeholder.unbind();

                $("#title").text("Rectangular Pie");

                $.plot(placeholder, data, {
                    series: {
                        pie: {
                            show: true,
                            radius: 500,
                            label: {
                                show: true,
                                formatter: labelFormatter,
                                threshold: 0.1
                            }
                        }
                    },
                    legend: {
                        show: false
                    }
                });
            });

            $("#example-10").click(function () {

                placeholder.unbind();

                $("#title").text("Tilted Pie");

                $.plot(placeholder, data, {
                    series: {
                        pie: {
                            show: true,
                            radius: 1,
                            tilt: 0.5,
                            label: {
                                show: true,
                                radius: 1,
                                formatter: labelFormatter,
                                background: {
                                    opacity: 0.8
                                }
                            },
                            combine: {
                                color: "#999",
                                threshold: 0.1
                            }
                        }
                    },
                    legend: {
                        show: false
                    }
                });
            });

            $("#example-11").click(function () {

                placeholder.unbind();

                $("#title").text("Donut Hole");

                $.plot(placeholder, data, {
                    series: {
                        pie: {
                            innerRadius: 0.5,
                            show: true,
                            gradient: {
                                radial: true,
                                colors: [
                                  { opacity: 1.0 },
                                  { opacity: 1.0 },
                                  { opacity: 1.0 },
                                  { opacity: 0.5 },
                                  { opacity: 1.0 }
                                ]
                            }
                        }
                    }
                });
            });

            $("#example-12").click(function () {

                placeholder.unbind();

                $("#title").text("Interactivity");

                $.plot(placeholder, data, {
                    series: {
                        pie: {
                            show: true
                        }
                    },
                    grid: {
                        hoverable: true,
                        clickable: true
                    }
                });

                placeholder.bind("plothover", function (event, pos, obj) {

                    if (!obj) {
                        return;
                    }

                    var percent = parseFloat(obj.series.percent).toFixed(2);
                    $("#hover").html("<span style='font-weight:bold; color:" + obj.series.color + "'>" + obj.series.label + " (" + percent + "%)</span>");
                });

                placeholder.bind("plotclick", function (event, pos, obj) {

                    if (!obj) {
                        return;
                    }

                    percent = parseFloat(obj.series.percent).toFixed(2);
                    alert("" + obj.series.label + ": " + percent + "%");
                });
            });

            // Show the initial default chart

            $("#example-1").click();


            // A custom label formatter used by several of the plots

            function labelFormatter(label, series) {
                return "<div style='font-size:8pt; text-align:center; padding:2px; color:white;'>" + label + "<br/>" + Math.round(series.percent) + "%</div>";
            }

            //

        }
    };
}();

var InitiateHorizonalChart = function () {
    return {
        init: function () {

            // Set up our data array  
            var my_data = [[3, 0], [6, 1], [5, 2], [2, 3], [8, 4]];

            // Setup labels for use on the Y-axis  
            var tickLabels = [[0, 'Yes'], [1, 'No'], [2, 'Maybe'], [3, 'Sometimes'], [4, 'Never']];

            $.plot($("#horizonal-chart"), [
            {
                data: my_data,
                bars: {
                    show: true,
                    horizontal: true
                }
            }
            ],
            {
                bars: {
                    fillColor: { colors: [{ opacity: 0.8 }, { opacity: 1 }] },
                    barWidth: 0.5,
                    lineWidth: 1,
                    borderWidth: 0
                },
                colors: [themeprimary],
                yaxis: {
                    ticks: tickLabels
                },
                grid: {
                    show: true,
                    hoverable: true,
                    clickable: true,
                    tickColor: gridbordercolor,
                    borderWidth: 0,
                    borderColor: gridbordercolor,
                },
            }
            );
        }
    };
}();