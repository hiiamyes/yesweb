// Generated by CoffeeScript 1.9.2
(function() {
  var app;

  app = angular.module('hutCrawler', ['ngRoute']);

  app.config([
    '$routeProvider', function($routeProvider) {
      return $routeProvider.when('/huts', {
        templateUrl: 'views/huts'
      }).when('/changelog', {
        templateUrl: 'views/changelog'
      }).when('/about', {
        templateUrl: 'views/about'
      }).when('/question', {
        templateUrl: 'views/question'
      }).when('/contact', {
        templateUrl: 'views/contact'
      }).otherwise({
        redirectTo: '/huts'
      });
    }
  ]);

  app.controller('hutCrawlerCtrl', [
    '$scope', '$http', function($scope, $http) {
      $scope.toggle = true;
      $scope.capacity = '';
      $scope.urlApply = '';
      $scope.dataAfterDraw = [];
      $scope.dataBeforeDraw = [];
      $scope.isLoading = true;
      $scope.updateDate = '';
      $scope.hutGroups = [];
      $scope.topBarHutNames = [];
      $scope.hutNameZhSelected = '';
      $scope.titleBarNameSelected = '山屋餘額';
      $scope.calendarTitles = [];
      $scope.titleBar = [
        {
          url: '#/huts',
          name: '山屋餘額'
        }, {
          url: '#/changelog',
          name: '更新日誌'
        }, {
          url: '#/about',
          name: '關於'
        }, {
          url: '#/question',
          name: '常見問題'
        }, {
          url: '#/contact',
          name: '聯絡我'
        }
      ];
      $http.get('/api/hut').success(function(result, statusCode) {
        $scope.isLoading = false;
        $scope.hutGroups = result.hutGroups;
        return $scope.huts = result.huts;
      }).error(function(e) {
        return console.log(e);
      });
      $scope.toggleClicked = function() {
        return $scope.toggle = !$scope.toggle;
      };
      $scope.hutNameClicked = function(hutNameZh) {
        var hut, istatus, j, k, len, len1, ref, ref1, results, status;
        $scope.toggle = false;
        $scope.dataAfterDraw = [];
        $scope.dataBeforeDraw = [];
        $scope.calendarTitles = ['日', '一', '二', '三', '四', '五', '六'];
        $scope.hutNameZhSelected = hutNameZh;
        ref = $scope.huts;
        results = [];
        for (j = 0, len = ref.length; j < len; j++) {
          hut = ref[j];
          if (hut.nameZh === hutNameZh) {
            $scope.urlApply = hut.urlApply;
            $scope.capacity = hut.capacity;
            $scope.updateDate = moment(hut.capacityStatuses.dateCrawl).format('M月D日 H:mm');
            ref1 = hut.capacityStatuses.status;
            for (istatus = k = 0, len1 = ref1.length; k < len1; istatus = ++k) {
              status = ref1[istatus];
              if (status.isDrawn) {
                $scope.dataAfterDraw.push({
                  date: status.date,
                  remaining: parseInt(status.remaining),
                  applying: parseInt(status.applying)
                });
              } else {
                $scope.dataBeforeDraw.push({
                  date: status.date,
                  remaining: parseInt(status.remaining),
                  applying: parseInt(status.applying)
                });
              }
            }
            break;
          } else {
            results.push(void 0);
          }
        }
        return results;
      };
      return $scope.titleBarNameClicked = function(titleBarName) {
        return $scope.titleBarNameSelected = titleBarName;
      };
    }
  ]);

  app.directive('barChartAfterDraw', function() {
    return {
      restrict: 'E',
      scope: {
        data: '=data'
      },
      link: function(scope, element, attrs) {

        /*
        			Structure
        				svg
        					groupChart
        						groupBarRemaining
        						groupBarApplying
        						groupLabelRemaing
        						groupLabelApplying
        						groupXAxis
         */
        var barInterval, barWidth, groupChartHeight, groupChartPadding;
        groupChartHeight = 150;
        groupChartPadding = 20;
        barWidth = 14;
        barInterval = 24;
        return scope.$watch('data', function(g) {
          var applyingMax, groupChart, groupChartWidth, j, remainingMax, results, sizeData, svg, xAxis, yScale;
          sizeData = scope.data.length;
          if (sizeData !== 0) {
            d3.select(element[0]).selectAll('*').remove();
            groupChartWidth = (barWidth * 2 + barInterval) * sizeData;
            svg = d3.select(element[0]).append('svg').attr('width', groupChartWidth + groupChartPadding * 2).attr('height', groupChartHeight + groupChartPadding * 2);
            groupChart = svg.append('g').attr('width', groupChartWidth).attr('height', groupChartHeight).attr('transform', 'translate(' + groupChartPadding + ',' + groupChartPadding + ')');
            remainingMax = d3.max(scope.data, function(d) {
              return d.remaining;
            });
            applyingMax = d3.max(scope.data, function(d) {
              return d.applying;
            });
            yScale = d3.scale.linear().range([groupChartHeight, 0]).domain([0, d3.max([remainingMax, applyingMax])]);
            groupChart.append('g').selectAll('rect').data(scope.data).enter().append('rect').attr('x', function(d, i) {
              return barInterval / 2 + i * (barWidth * 2 + barInterval);
            }).attr('y', function(d) {
              return yScale(d.remaining);
            }).attr('width', barWidth).attr('height', function(d) {
              return groupChartHeight - yScale(d.remaining);
            }).attr('class', 'bar remaining');
            groupChart.append('g').selectAll('rect').data(scope.data).enter().append('rect').attr('x', function(d, i) {
              return barInterval / 2 + barWidth + i * (barWidth * 2 + barInterval);
            }).attr('y', function(d) {
              return yScale(d.applying);
            }).attr('width', barWidth).attr('height', function(d) {
              return groupChartHeight - yScale(d.applying);
            }).attr('class', 'bar applying');
            xAxis = groupChart.append('g');
            xAxis.append('line').attr('x1', 0).attr('y1', groupChartHeight).attr('x2', groupChartWidth).attr('y2', groupChartHeight).attr('class', 'xaxis');
            xAxis.append('g').selectAll('line').data((function() {
              results = [];
              for (var j = 0; 0 <= sizeData ? j <= sizeData : j >= sizeData; 0 <= sizeData ? j++ : j--){ results.push(j); }
              return results;
            }).apply(this)).enter().append('line').attr('x1', function(d, i) {
              return i * (barWidth * 2 + barInterval);
            }).attr('y1', groupChartHeight).attr('x2', function(d, i) {
              return i * (barWidth * 2 + barInterval);
            }).attr('y2', groupChartHeight + 5).attr('class', 'xaxis');
            xAxis.append('g').selectAll('text').data(scope.data).enter().append('text').text(function(d) {
              return moment(d.date).utc().format('M/D');
            }).attr('x', function(d, i) {
              return barInterval / 2 + barWidth + i * (barWidth * 2 + barInterval);
            }).attr('y', function(d) {
              return groupChartHeight + 20;
            }).attr('class', function(d) {
              switch (new Date(d.date).getDay()) {
                case 0:
                case 6:
                  return 'label date weekend';
                default:
                  return 'label date weekday';
              }
            });
            groupChart.append('g').selectAll('text').data(scope.data).enter().append('text').text(function(d) {
              if (d.remaining !== 0) {
                return d.remaining;
              } else {
                return '';
              }
            }).attr('x', function(d, i) {
              return barInterval / 2 + barWidth * 0.6 + i * (barWidth * 2 + barInterval);
            }).attr('y', function(d) {
              return yScale(d.remaining) - 5;
            }).attr('class', 'label remaining');
            return groupChart.append('g').selectAll('text').data(scope.data).enter().append('text').text(function(d) {
              if (d.applying !== 0) {
                return d.applying;
              } else {
                return '';
              }
            }).attr('x', function(d, i) {
              return barInterval / 2 + barWidth * 1.4 + i * (barWidth * 2 + barInterval);
            }).attr('y', function(d) {
              return yScale(d.applying) - 5;
            }).attr('class', 'label applying');
          }
        }, true);
      }
    };
  });

  app.directive('barChartBeforeDraw', function() {
    return {
      restrict: 'E',
      scope: {
        data: '=data'
      },
      link: function(scope, element, attrs) {

        /*
        			Structure
        				svg
        					groupChart
        						groupBarRemaining
        						groupBarApplying
        						groupLabelRemaing
        						groupLabelApplying
        						groupXAxis
         */
        var barInterval, barWidth, groupChartHeight, groupChartPadding;
        groupChartHeight = 150;
        groupChartPadding = 20;
        barWidth = 14;
        barInterval = 24;
        return scope.$watch('data', function(g) {
          var groupChart, groupChartWidth, j, results, sizeData, svg, xAxis, yScale;
          sizeData = scope.data.length;
          if (sizeData !== 0) {
            d3.select(element[0]).selectAll('*').remove();
            groupChartWidth = (barWidth * 2 + barInterval) * sizeData;
            svg = d3.select(element[0]).append('svg').attr('width', groupChartWidth + groupChartPadding * 2).attr('height', groupChartHeight + groupChartPadding * 2);
            groupChart = svg.append('g').attr('width', groupChartWidth).attr('height', groupChartHeight).attr('transform', 'translate(' + groupChartPadding + ',' + groupChartPadding + ')');
            yScale = d3.scale.linear().range([groupChartHeight, 0]).domain([
              0, d3.max(scope.data, function(d) {
                return d.applying;
              })
            ]);
            groupChart.append('g').selectAll('rect').data(scope.data).enter().append('rect').attr('x', function(d, i) {
              return barInterval / 2 + barWidth / 2 + i * (barWidth * 2 + barInterval);
            }).attr('y', function(d) {
              return yScale(d.applying);
            }).attr('width', barWidth).attr('height', function(d) {
              return groupChartHeight - yScale(d.applying);
            }).attr('class', 'bar draw-list');
            xAxis = groupChart.append('g');
            xAxis.append('line').attr('x1', 0).attr('y1', groupChartHeight).attr('x2', groupChartWidth).attr('y2', groupChartHeight).attr('class', 'xaxis draw-list');
            xAxis.append('g').selectAll('line').data((function() {
              results = [];
              for (var j = 0; 0 <= sizeData ? j <= sizeData : j >= sizeData; 0 <= sizeData ? j++ : j--){ results.push(j); }
              return results;
            }).apply(this)).enter().append('line').attr('x1', function(d, i) {
              return i * (barWidth * 2 + barInterval);
            }).attr('y1', groupChartHeight).attr('x2', function(d, i) {
              return i * (barWidth * 2 + barInterval);
            }).attr('y2', groupChartHeight + 5).attr('class', 'xaxis draw-list');
            xAxis.append('g').selectAll('text').data(scope.data).enter().append('text').text(function(d) {
              return moment(d.date).utc().format('M/D');
            }).attr('x', function(d, i) {
              return barInterval / 2 + barWidth + i * (barWidth * 2 + barInterval);
            }).attr('y', function(d) {
              return groupChartHeight + 20;
            }).attr('class', function(d) {
              switch (new Date(d.date).getDay()) {
                case 0:
                case 6:
                  return 'label date weekend';
                default:
                  return 'label date weekday draw-list';
              }
            });
            return groupChart.append('g').selectAll('text').data(scope.data).enter().append('text').text(function(d) {
              if (d.applying !== 0) {
                return d.applying;
              } else {
                return '';
              }
            }).attr('x', function(d, i) {
              return barInterval / 2 + barWidth + i * (barWidth * 2 + barInterval);
            }).attr('y', function(d) {
              return yScale(d.applying) - 5;
            }).attr('class', 'label draw-list');
          }
        }, true);
      }
    };
  });

}).call(this);
