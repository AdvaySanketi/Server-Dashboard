angular.module('archiveDashboard').directive('topBar', ['$rootScope', function($rootScope) {
  return {
    scope: {
      heading: '=',
      refresh: '&',
      lastUpdated: '=',
      toggleVisibility: '&',
      isHidden: '=',
      toggleWidth: '&',
      isChart: '=',
      info: '=', // not being used; needs a good ui solution
      linkUrl: '=', // URL for service link button
    },
    template: '\
      <div class="top-bar"> \
        <span class="heading"> &#9776; {{ heading }}</span> \
        \
        <button \
          class="ld-top-bar-btn minimize-btn" \
          ng-click="toggleVisibility()" \
          ng-class="{ active: isHidden }">-</button> \
        \
        \
        <button class="ld-top-bar-btn width-toggle-btn" ng-if="toggleWidth && !isChart" ng-click="toggleWidth()">&harr;</button> \
        <a ng-if="linkUrl && !isHidden" href="{{ linkUrl }}" target="_blank" class="ld-top-bar-btn link-btn" title="Open {{ heading }}">🔗</a> \
        <button ng-if="!isChart && !isHidden" class="ld-top-bar-btn refresh-btn" ng-click="refresh()">↺</button> \
      </div> \
    ',
  }
}])
