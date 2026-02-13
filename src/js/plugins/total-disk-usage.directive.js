angular.module('archiveDashboard').directive('totalDiskUsage', ['server', function(server) {
  return {
    restrict: 'E',
    scope: {},
    template: '\
      <plugin \
        heading="Total Disk Usage" \
        last-updated="lastGet" \
        on-refresh="getData()"> \
        <loader ng-if="!diskData"></loader> \
        <div ng-if="diskData" style="text-align: center; padding: 20px;"> \
          <div style="font-size: 48px; font-weight: bold; margin-bottom: 10px;">{{ diskData.usedGB }} GB</div> \
          <div style="font-size: 18px; color: #666; margin-bottom: 20px;">Used</div> \
          <progress-bar-plugin \
            width="100%" \
            value="{{ diskData.usedBytes }}" \
            max="{{ diskData.totalBytes }}"> \
          </progress-bar-plugin> \
          <div style="margin-top: 15px; font-size: 16px;"> \
            <span style="color: #4CAF50; font-weight: bold;">{{ diskData.freeGB }} GB Free</span> \
            <span style="margin: 0 10px;">|</span> \
            <span style="font-weight: bold;">{{ diskData.totalGB }} GB Total</span> \
          </div> \
          <div style="margin-top: 10px; font-size: 14px; color: #888;"> \
            {{ diskData.usedPercent }}% Used \
          </div> \
        </div> \
      </plugin> \
    ',
    link: function(scope) {
      scope.getData = function() {
        server.get('disk_partitions', function(partitions) {
          if (partitions && partitions.length > 0) {
            var totalBytes = 0;
            var usedBytes = 0;

            partitions.forEach(function(partition) {
              var size = parseSize(partition.size);
              var used = parseSize(partition.used);
              totalBytes += size;
              usedBytes += used;
            });

            var freeBytes = totalBytes - usedBytes;
            var usedPercent = totalBytes > 0 ? Math.round((usedBytes / totalBytes) * 100) : 0;

            scope.diskData = {
              totalBytes: totalBytes,
              usedBytes: usedBytes,
              freeBytes: freeBytes,
              totalGB: Math.round(totalBytes / (1024 * 1024 * 1024)),
              usedGB: Math.round(usedBytes / (1024 * 1024 * 1024)),
              freeGB: Math.round(freeBytes / (1024 * 1024 * 1024)),
              usedPercent: usedPercent
            };
          }

          scope.lastGet = new Date().getTime();
        });
      };

      function parseSize(sizeStr) {
        if (!sizeStr) return 0;
        
        var units = {
          'K': 1024,
          'M': 1024 * 1024,
          'G': 1024 * 1024 * 1024,
          'T': 1024 * 1024 * 1024 * 1024,
          'P': 1024 * 1024 * 1024 * 1024 * 1024
        };

        var match = sizeStr.match(/^([\d.,]+)([KMGTP]?)$/i);
        if (match) {
          var value = parseFloat(match[1].replace(',', '.'));
          var unit = match[2].toUpperCase();
          return value * (units[unit] || 1);
        }
        return 0;
      }

      scope.getData();
    }
  };
}]);
