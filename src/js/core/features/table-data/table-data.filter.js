angular.module('archiveDashboard').filter('tableDataFilter', function() {
  return function(tableRows, keyword) {
    if (!keyword || !tableRows) {
      return tableRows;
    }

    var filtered = [];
    var lowerKeyword = keyword.toLowerCase();

    for (var i = 0; i < tableRows.length; i++) {
      var row = tableRows[i];
      var found = false;

      // Check each value in the row
      for (var key in row) {
        if (row.hasOwnProperty(key)) {
          var value = row[key];
          if (value && value.toString().toLowerCase().indexOf(lowerKeyword) !== -1) {
            found = true;
            break;
          }
        }
      }

      if (found) {
        filtered.push(row);
      }
    }

    return filtered;
  };
});
