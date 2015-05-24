angular.module('myApp')
  .controller('chartsDashboardCtrl', function($scope, $http, config) {
    $scope.exist = true;
    //request for hits and errors data
    $http.post(config.serverAddress + '/hits')
      .success(function(data, status, headers, config) {
        console.log('Check hits!');
        console.log(data);
        if (!data.hits) {
          console.log('EMPTY!');
          $scope.exist = false;
        }
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
        console.log(data);
      });

    //request for errors timestamps
    $http.post(config.serverAddress + '/timeline')
      .success(function(object, status, headers, config) {
        console.log('TIMELINE DATA!');
        console.log(object);
        console.log(object.errors);
        for (i = 0, j = object.errors.length - 1; i < object.errors.length; ++i, --j) {
          $scope.chartAreaConfig.options.xAxis.categories[i] = new Date(object.errors[j].error_date).toLocaleDateString("ru");
          $scope.chartAreaConfig.series[0].data[i] = {
            y: object.errors[j].count
              // color: 'red'
          };
          $scope.chartAreaConfig.series[1].data[i] = object.hits[j].count;
          console.log($scope.chartAreaConfig.options.xAxis.categories[i]);
        }
      })
      .error(function(data, status, headers, config) {});

      //request for top browsers/errors
      $http.post(config.serverAddress + '/browsers')
        .success(function(data, status, headers, config) {
          console.log('BROWSERS');
          console.log(data);
          $scope.topBrowsers = data;
        })
        .error(function(data, status, headers, config) {});

      //request for top urls/errors
      $http.post(config.serverAddress + '/urls')
        .success(function(data, status, headers, config) {
          console.log('URLS');
          console.log(data);
          $scope.topUrls = data;
        })
        .error(function(data, status, headers, config) {});

        //request for top messages/errors
        $http.post(config.serverAddress + '/msgs')
          .success(function(data, status, headers, config) {
            console.log('MSGS');
            console.log(data);
            $scope.topMsgs = data;
          })
          .error(function(data, status, headers, config) {});

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
        height: 350
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
        xAxis: {
          categories: []
        },
        yAxis: {
          title: {
            text: 'Amount'
          }
        },
        tooltip: {
          shared: true
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
        data: []
      }],
      size: {
        width: 600,
        height: 350
      }
    };
  });
