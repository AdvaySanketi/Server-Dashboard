angular.module('archiveDashboard').directive('navBar', ['$location', function($location) {
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
      <span class="right-content">\
        Resources:\
        <a target="_blank" href="#">GitHub</a> \
      </span>\
    ',
    link: function(scope) {
      scope.items = [
        'system-status',
        'basic-info',
        'network',
        'accounts',
        'apps'
      ]

      scope.getNavItemName = function(url) {
        return url.replace('-', ' ')
      }

      scope.isActive = function(route) {
        return '/' + route === $location.path()
      }
    }
  }
}])
