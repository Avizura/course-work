angular.module('myApp')
  .controller('chartsDashboardCtrl', function($scope, $http) {
    //request for hits and errors data
    $http.post('http://192.168.0.168:5000/hits')
      .success(function(data, status, headers, config) {
        console.log('Check hits!');
        console.log(data);
        console.log($scope.chartPieConfig.series[0].data[0]);
        $scope.chartPieConfig.series[0].data[0] = {
          name: 'Hits',
          y: data.hits,
          color: '#1C75EA'
        };
        $scope.chartPieConfig.series[0].data[1] = {
          name: 'Errors',
          y: data.errors,
          color: 'red'
        };
      })
      .error(function(data, status, headers, config) {
      });

      //request for errors timestamps
      $http.post('http://192.168.0.168:5000/timeline')
      .success(function(object, status, headers, config) {
        console.log('TIMELINE DATA!');
        console.log(object);
        console.log(object.data);
        for(i=0; i<object.data.length; ++i){
          $scope.chartAreaConfig.options.xAxis.categories[i] = new Date(object.data[i].error_date).toLocaleDateString();
          $scope.chartAreaConfig.series[0].data[i] = {
            y: object.data[i].count
            // color: 'red'
          }
          console.log($scope.chartAreaConfig.options.xAxis.categories[i]);
        }
      })
      .error(function(data, status, headers, config) {
      });

    //This is not a highcharts object. It just looks a little like one!
    $scope.chartPieConfig = {
      options: {
        //This is the Main Highcharts chart config. Any Highchart options are valid here.
        //will be overriden by values specified below.
        chart: {
          plotBackgroundColor: null,
          plotBorderWidth: null,
          plotShadow: false
        },
        title: {
          text: 'Hits and Errors'
        },
        tooltip: {
          pointFormat: '{series.name}:<b>{point.y}</b>  ({point.percentage:.1f}%)'
        },
        plotOptions: {
          pie: {
            allowPointSelect: true,
            cursor: 'pointer',
            dataLabels: {
              enabled: true,
              format: '<b>{point.name}</b>: {point.percentage:.1f} %',
              style: {
                color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
              }
            }
          }
        },
      },
      //The below properties are watched separately for changes.
      //Series object (optional) - a list of series using normal highcharts series options.
      series: [{
        type: 'pie',
        name: "Share",
        data: []
      }],
      size: {
        width: 400,
        height: 300
      }
    };

    $scope.chartAreaConfig = {
      options: {
        //This is the Main Highcharts chart config. Any Highchart options are valid here.
        //will be overriden by values specified below.
        chart: {
          type: 'areaspline',
          plotBackgroundColor: null,
          plotBorderWidth: null,
          plotShadow: false
        },
        title: {
          text: 'Hits and Errors Timeline'
        },
        legend: {
            layout: 'vertical',
            align: 'left',
            verticalAlign: 'top',
            x: 150,
            y: 100,
            floating: true,
            borderWidth: 1,
            backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'
        },
        xAxis: {
            categories: []
            // plotBands: [{ // visualize the weekend
            //     from: 4.5,
            //     to: 6.5,
            //     color: 'rgba(68, 170, 213, .2)'
            // }]
        },
        yAxis: {
            title: {
                text: 'Amount'
            }
        },
        tooltip: {
          shared:  true
          // pointFormat: '{series.name}:<b>{point.y}</b>  ({point.percentage:.1f}%)'
        },
        plotOptions: {
          areaspline: {
                 fillOpacity: 0.5
             }
        },
      },
      //The below properties are watched separately for changes.
      //Series object (optional) - a list of series using normal highcharts series options.
      series: [{
           name: 'Errors Count',
           data: [],
           color: 'red'
       }, {
           name: 'Hits Count',
           data: [20, 30, 25, 44, 15, 50]
       }],
      size: {
        width: 600,
        height: 300
      }
    };
  });































//     //Title configuration (optional)
//     title: {
//       text: 'Hello'
//     },
//     //Boolean to control showng loading status on chart (optional)
//     //Could be a string if you want to show specific loading text.
//     loading: false,
//     //Configuration for the xAxis (optional). Currently only one x axis can be dynamically controlled.
//     //properties currentMin and currentMax provied 2-way binding to the chart's maximimum and minimum
//     xAxis: {
//       currentMin: 0,
//       currentMax: 20,
//       title: {
//         text: 'values'
//       }
//     },
//     //Whether to use HighStocks instead of HighCharts (optional). Defaults to false.
//     useHighStocks: false,
//     //size (optional) if left out the chart will default to size of the div or something sensible.
//     size: {
//       width: 400,
//       height: 300
//     },
//     //function (optional)
//     func: function(chart) {
//       //setup some logic for the chart
//     }
//   };
// });





// Make monochrome colors and set them as default for all pies
// Highcharts.getOptions().plotOptions.pie.colors = (function() {
//   var colors = [],
//     base = Highcharts.getOptions().colors[0],
//     i;
//
//   for (i = 0; i < 10; i += 1) {
//     // Start out with a darkened base color (negative brighten), and end
//     // up with a much brighter color
//     colors.push(Highcharts.Color(base).brighten((i - 3) / 7).get());
//   }
//   return colors;
// }());
