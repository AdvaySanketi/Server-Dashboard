angular.module('archiveDashboard').directive('navBar', ['$location', '$interval', function($location, $interval) {
  return {
    template: '\
      \
      <span class="title">the-archive</span>\
      \
      <ul> \
        <li ng-class="{active: isActive(navItem) }" ng-repeat="navItem in items"> \
          <a href="#/{{navItem}}" ng-bind="getNavItemName(navItem)"></a> \
        </li> \
      </ul> \
      <span class="right-content" style="font-family: monospace; font-size: 14px;">\
        {{ currentTime }}\
      </span>\
    ',
    link: function(scope) {
      scope.items = [
        'system-status',
        'basic-info',
        'network',
        'accounts',
        'services'
      ]

      scope.getNavItemName = function(url) {
        return url.replace('-', ' ')
      }

      scope.isActive = function(route) {
        return '/' + route === $location.path()
      }

      // Update current time every second
      var updateTime = function() {
        var now = new Date()
        scope.currentTime = now.toLocaleTimeString('en-US', { hour12: false })
      }
      
      updateTime()
      $interval(updateTime, 1000)
    }
  }
}])
