angular.module('archiveDashboard').directive('lineChartPlugin', [
  '$interval', 'server', '$window',
  function ($interval, server, $window) {
    return {
      scope: {
        heading: '@',
        moduleName: '@',
        refreshRate: '=',
        maxValue: '=',
        minValue: '=',
        getDisplayValue: '=',
        metrics: '=',
        color: '@'
      },
      templateUrl: 'src/js/core/features/line-chart/line-chart-plugin.html',
      link: function(scope, element) {

        scope.initializing = true
        scope.refreshRate = scope.refreshRate || 2000

        var series = null
        var chart  = null
        var canvas = null
        var intervalRef = null
        var dataCallInProgress = false

        function startRendering() {

          if (!scope.color)
            scope.color = '0, 255, 0'

          chart = new SmoothieChart({
            borderVisible: false,
            sharpLines: true,
            grid: {
              fillStyle: '#ffffff',
              strokeStyle: 'rgba(232,230,230,0.93)',
              sharpLines: true,
              millisPerLine: 3000,
              borderVisible: false
            },
            labels: {
              fontSize: 11,
              precision: 0,
              fillStyle: '#0f0e0e'
            },
            maxValue: parseInt(scope.maxValue),
            minValue: parseInt(scope.minValue)
          })

          // Wait until canvas exists (DOM ready)
          var checkCanvas = $interval(function() {
            var foundCanvas = element.find('canvas')[0]

            if (foundCanvas) {

              canvas = foundCanvas
              series = new TimeSeries()

              chart.addTimeSeries(series, {
                strokeStyle: 'rgba(' + scope.color + ', 1)',
                fillStyle: 'rgba(' + scope.color + ', 0.2)',
                lineWidth: 2
              })

              chart.streamTo(canvas, 1000)

              $interval.cancel(checkCanvas)

              // Load first data immediately
              scope.getData()

              // Start polling
              intervalRef = $interval(scope.getData, scope.refreshRate)
            }

          }, 100)
        }

        scope.getData = function() {

          if (dataCallInProgress || !series)
            return

          dataCallInProgress = true

          server.get(scope.moduleName, function(serverResponseData) {

            dataCallInProgress = false

            if (!serverResponseData || serverResponseData.length < 1) {
              scope.emptyResult = true
              return
            }

            scope.lastGet = new Date().getTime()
            scope.newData = scope.getDisplayValue(serverResponseData)

            // Update chart
            series.append(scope.lastGet, scope.newData)

            // Dynamic color based on usage
            if (scope.maxValue) {
              if (scope.maxValue * 0.75 < scope.newData) {
                chart.seriesSet[0].options.strokeStyle = 'rgba(255, 89, 0, 1)'
                chart.seriesSet[0].options.fillStyle = 'rgba(255, 89, 0, 0.2)'
              } else if (scope.maxValue * 0.33 < scope.newData) {
                chart.seriesSet[0].options.strokeStyle = 'rgba(255, 238, 0, 1)'
                chart.seriesSet[0].options.fillStyle = 'rgba(255, 238, 0, 0.2)'
              } else {
                chart.seriesSet[0].options.strokeStyle = 'rgba(' + scope.color + ', 1)'
                chart.seriesSet[0].options.fillStyle = 'rgba(' + scope.color + ', 0.2)'
              }
            }

            // Update metrics
            if (scope.metrics && scope.metrics.forEach) {
              scope.metrics.forEach(function(metricObj) {
                metricObj.data = metricObj.generate(serverResponseData)
              })
            }

          })
        }

        // Start only when maxValue is available
        var stopWatching = scope.$watch('maxValue', function(n) {
          if (typeof n !== 'undefined') {
            stopWatching()
            startRendering()
          }
        })

        // Cleanup
        element.on("$destroy", function() {
          if (intervalRef)
            $interval.cancel(intervalRef)
        })

      }
    }
  }
])
