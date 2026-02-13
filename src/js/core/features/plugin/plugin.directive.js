angular.module('archiveDashboard').directive('plugin', ['$rootScope', function($rootScope) {
  return {
    transclude: true,
    scope: {
      heading: '@',
      info: '@',
      lastUpdated: '=',
      onRefresh: '&',
      linkUrl: '@',
      moduleName: '@'
    },
    templateUrl: 'src/js/core/features/plugin/plugin.html',
    link: function (s, el, attr) {

      // Set up getData function from onRefresh
      if (s.onRefresh) {
        s.getData = function() {
          s.onRefresh();
        };
      }

      // Alias lastUpdated to lastGet for template compatibility
      s.$watch('lastUpdated', function(newVal) {
        s.lastGet = newVal;
      });

      if (attr.hasOwnProperty('chartPlugin'))
        s.isChartPlugin = true

      if (attr.hasOwnProperty('enlarged'))
        s.enlarged = true

      if ($rootScope.hiddenPlugins.indexOf(s.moduleName) > -1)
        s.isHidden = true

      s.toggleWidth = function () {
        el.find('div')[0].removeAttribute('style')
        s.enlarged = !s.enlarged
      }

      var setPluginVisibility = function (shouldShow) {
        s.isHidden = !shouldShow

        if (shouldShow) {
          $rootScope.$emit('show-plugin', s.moduleName)
          if (s.isChartPlugin) s.reInitializeChart()
        } else {
          $rootScope.$emit('hide-plugin', s.moduleName)
        }
      }

      s.toggleVisibility = function () {
        setPluginVisibility(s.isHidden)
      }


      s.$watch('emptyResult', function (n, o) {
        if (n) {
          setPluginVisibility(false)
        }
      })
    }
  }
}])
