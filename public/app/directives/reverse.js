angular.module('reverseDirective', [])

    .filter('reverse', function() {
        //items is array
        return function(items) {
            return items.slice().reverse();
        }
    });