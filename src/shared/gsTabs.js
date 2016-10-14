;(function (angular, undefined) {
    'use strict';

    var jqLite = angular.element,
        extend = angular.extend,
        forEach = angular.forEach,
        isDefined = angular.isDefined,
        isNumber = angular.isNumber,
        isString = angular.isString,
        noop = angular.noop;

    angular.module('gs.ionic', ['ionic'])
        .controller('gsTab', [
            '$scope',
            '$ionicHistory',
            '$attrs',
            '$location',
            '$state',
            function ($scope, $ionicHistory, $attrs, $location, $state) {
                this.$scope = $scope;

                //All of these exposed for testing
                this.hrefMatchesState = function () {
                    return $attrs.href && $location.path().indexOf(
                            $attrs.href.replace(/^#/, '').replace(/\/$/, '')
                        ) === 0;
                };
                this.srefMatchesState = function () {
                    return $attrs.uiSref && $state.includes($attrs.uiSref.split('(')[0]);
                };
                this.navNameMatchesState = function () {
                    return this.navViewName && $ionicHistory.isCurrentStateNavView(this.navViewName);
                };

                this.tabMatchesState = function () {
                    return this.hrefMatchesState() || this.srefMatchesState() || this.navNameMatchesState();
                };
            }])
        .controller('gsTabs', [
            '$scope',
            '$element',
            '$ionicHistory',
            function ($scope, $element, $ionicHistory) {
                var self = this;
                var selectedTab = null;
                var previousSelectedTab = null;
                var selectedTabIndex;
                var isVisible = true;
                self.tabs = [];

                self.selectedIndex = function () {
                    return self.tabs.indexOf(selectedTab);
                };
                self.selectedTab = function () {
                    return selectedTab;
                };
                self.previousSelectedTab = function () {
                    return previousSelectedTab;
                };

                self.add = function (tab) {
                    $ionicHistory.registerHistory(tab);
                    self.tabs.push(tab);
                };

                self.remove = function (tab) {
                    var tabIndex = self.tabs.indexOf(tab);
                    if (tabIndex === -1) {
                        return;
                    }
                    //Use a field like '$tabSelected' so developers won't accidentally set it in controllers etc
                    if (tab.$tabSelected) {
                        self.deselect(tab);
                        //Try to select a new tab if we're removing a tab
                        if (self.tabs.length === 1) {
                            //Do nothing if there are no other tabs to select
                        } else {
                            //Select previous tab if it's the last tab, else select next tab
                            var newTabIndex = tabIndex === self.tabs.length - 1 ? tabIndex - 1 : tabIndex + 1;
                            self.select(self.tabs[newTabIndex]);
                        }
                    }
                    self.tabs.splice(tabIndex, 1);
                };

                self.deselect = function (tab) {
                    if (tab.$tabSelected) {
                        previousSelectedTab = selectedTab;
                        selectedTab = selectedTabIndex = null;
                        tab.$tabSelected = false;
                        (tab.onDeselect || noop)();
                        tab.$broadcast && tab.$broadcast('$ionicHistory.deselect');
                    }
                };

                self.select = function (tab, shouldEmitEvent) {
                    var tabIndex;
                    if (isNumber(tab)) {
                        tabIndex = tab;
                        if (tabIndex >= self.tabs.length) return;
                        tab = self.tabs[tabIndex];
                    } else {
                        tabIndex = self.tabs.indexOf(tab);
                    }

                    if (arguments.length === 1) {
                        shouldEmitEvent = !!(tab.navViewName || tab.uiSref);
                    }

                    if (selectedTab && selectedTab.$historyId == tab.$historyId) {
                        if (shouldEmitEvent) {
                            $ionicHistory.goToHistoryRoot(tab.$historyId);
                        }

                    } else if (selectedTabIndex !== tabIndex) {
                        forEach(self.tabs, function (tab) {
                            self.deselect(tab);
                        });

                        selectedTab = tab;
                        selectedTabIndex = tabIndex;

                        if (self.$scope && self.$scope.$parent) {
                            self.$scope.$parent.$activeHistoryId = tab.$historyId;
                        }

                        //Use a funny name like $tabSelected so the developer doesn't overwrite the var in a child scope
                        tab.$tabSelected = true;
                        (tab.onSelect || noop)();

                        if (shouldEmitEvent) {
                            $scope.$emit('$ionicHistory.change', {
                                type: 'tab',
                                tabIndex: tabIndex,
                                historyId: tab.$historyId,
                                navViewName: tab.navViewName,
                                hasNavView: !!tab.navViewName,
                                title: tab.title,
                                url: tab.href,
                                uiSref: tab.uiSref
                            });
                        }

                        $scope.$broadcast("tabSelected", {selectedTab: tab, selectedTabIndex: tabIndex});
                    }
                };

                self.hasActiveScope = function () {
                    for (var x = 0; x < self.tabs.length; x++) {
                        if ($ionicHistory.isActiveScope(self.tabs[x])) {
                            return true;
                        }
                    }
                    return false;
                };

                self.showBar = function (show) {
                    if (arguments.length) {
                        if (show) {
                            $element.removeClass('tabs-item-hide');
                        } else {
                            $element.addClass('tabs-item-hide');
                        }
                        isVisible = !!show;
                    }
                    return isVisible;
                };
            }])
        .directive('gsTabs', [
            '$ionicTabsDelegate',
            '$ionicConfig',
            function ($ionicTabsDelegate, $ionicConfig) {
                return {
                    restrict: 'E',
                    scope: true,
                    controller: 'gsTabs',
                    compile: function (tElement) {
                        //We cannot use regular transclude here because it breaks element.data()
                        //inheritance on compile
                        var innerElement = jqLite('<div class="tab-nav tabs">');
                        innerElement.append(tElement.contents());

                        tElement.append(innerElement)
                            .addClass('tabs-' + $ionicConfig.tabs.position() + ' tabs-' + $ionicConfig.tabs.style());

                        return {pre: prelink, post: postLink};
                        function prelink($scope, $element, $attr, tabsCtrl) {
                            var deregisterInstance = $ionicTabsDelegate._registerInstance(
                                tabsCtrl, $attr.delegateHandle, tabsCtrl.hasActiveScope
                            );

                            tabsCtrl.$scope = $scope;
                            tabsCtrl.$element = $element;
                            tabsCtrl.$tabsElement = jqLite($element[0].querySelector('.tabs'));

                            $scope.$watch(function () {
                                return $element[0].className;
                            }, function (value) {
                                var isTabsTop = value.indexOf('tabs-top') !== -1;
                                var isHidden = value.indexOf('tabs-item-hide') !== -1;
                                $scope.$hasTabs = !isTabsTop && !isHidden;
                                $scope.$hasTabsTop = isTabsTop && !isHidden;
                                $scope.$emit('$ionicTabs.top', $scope.$hasTabsTop);
                            });

                            function emitLifecycleEvent(ev, data) {
                                ev.stopPropagation();
                                var previousSelectedTab = tabsCtrl.previousSelectedTab();
                                if (previousSelectedTab) {
                                    previousSelectedTab.$broadcast(ev.name.replace('NavView', 'Tabs'), data);
                                }
                            }

                            $scope.$on('$ionicNavView.beforeLeave', emitLifecycleEvent);
                            $scope.$on('$ionicNavView.afterLeave', emitLifecycleEvent);
                            $scope.$on('$ionicNavView.leave', emitLifecycleEvent);

                            $scope.$on('$destroy', function () {
                                // variable to inform child tabs that they're all being blown away
                                // used so that while destorying an individual tab, each one
                                // doesn't select the next tab as the active one, which causes unnecessary
                                // loading of tab views when each will eventually all go away anyway
                                $scope.$tabsDestroy = true;
                                deregisterInstance();
                                tabsCtrl.$tabsElement = tabsCtrl.$element = tabsCtrl.$scope = innerElement = null;
                                delete $scope.$hasTabs;
                                delete $scope.$hasTabsTop;
                            });
                        }

                        function postLink($scope, $element, $attr, tabsCtrl) {
                            if (!tabsCtrl.selectedTab()) {
                                // all the tabs have been added
                                // but one hasn't been selected yet
                                tabsCtrl.select(0);
                            }
                        }
                    }
                };
            }])
        .directive('gsTab', [
            '$compile',
            '$ionicConfig',
            '$ionicBind',
            '$ionicViewSwitcher',
            function ($compile, $ionicConfig, $ionicBind, $ionicViewSwitcher) {

                //Returns ' key="value"' if value exists
                function attrStr(k, v) {
                    return isDefined(v) ? ' ' + k + '="' + v + '"' : '';
                }

                return {
                    restrict: 'E',
                    require: ['^gsTabs', 'gsTab'],
                    controller: 'gsTab',
                    scope: true,
                    compile: function (element, attr) {

                        //We create the tabNavTemplate in the compile phase so that the
                        //attributes we pass down won't be interpolated yet - we want
                        //to pass down the 'raw' versions of the attributes
                        var tabNavTemplate = '<gs-tab-nav' +
                            attrStr('ng-click', attr.ngClick) +
                            attrStr('title', attr.title) +
                            attrStr('icon', attr.icon) +
                            attrStr('icon-on', attr.iconOn) +
                            attrStr('icon-off', attr.iconOff) +
                            attrStr('badge', attr.badge) +
                            attrStr('badge-style', attr.badgeStyle) +
                            attrStr('hidden', attr.hidden) +
                            attrStr('disabled', attr.disabled) +
                            attrStr('class', attr['class']) +
                            '></gs-tab-nav>';

                        //Remove the contents of the element so we can compile them later, if tab is selected
                        var tabContentEle = document.createElement('div');
                        for (var x = 0; x < element[0].children.length; x++) {
                            tabContentEle.appendChild(element[0].children[x].cloneNode(true));
                        }
                        var childElementCount = tabContentEle.childElementCount;
                        element.empty();

                        var navViewName, isNavView;
                        if (childElementCount) {
                            if (tabContentEle.children[0].tagName === 'ION-NAV-VIEW') {
                                // get the name if it's a nav-view
                                navViewName = tabContentEle.children[0].getAttribute('name');
                                tabContentEle.children[0].classList.add('view-container');
                                isNavView = true;
                            }
                            if (childElementCount === 1) {
                                // make the 1 child element the primary tab content container
                                tabContentEle = tabContentEle.children[0];
                            }
                            if (!isNavView) tabContentEle.classList.add('pane');
                            tabContentEle.classList.add('tab-content');
                        }

                        return function link($scope, $element, $attr, ctrls) {
                            var childScope;
                            var childElement;
                            var tabsCtrl = ctrls[0];
                            var tabCtrl = ctrls[1];
                            var isTabContentAttached = false;
                            $scope.$tabSelected = false;

                            $ionicBind($scope, $attr, {
                                onSelect: '&',
                                onDeselect: '&',
                                title: '@',
                                uiSref: '@',
                                href: '@'
                            });

                            tabsCtrl.add($scope);
                            $scope.$on('$destroy', function () {
                                if (!$scope.$tabsDestroy) {
                                    // if the containing ionTabs directive is being destroyed
                                    // then don't bother going through the controllers remove
                                    // method, since remove will reset the active tab as each tab
                                    // is being destroyed, causing unnecessary view loads and transitions
                                    tabsCtrl.remove($scope);
                                }
                                tabNavElement.isolateScope().$destroy();
                                tabNavElement.remove();
                                tabNavElement = tabContentEle = childElement = null;
                            });

                            //Remove title attribute so browser-tooltip does not apear
                            $element[0].removeAttribute('title');

                            if (navViewName) {
                                tabCtrl.navViewName = $scope.navViewName = navViewName;
                            }
                            $scope.$on('$stateChangeSuccess', selectIfMatchesState);
                            selectIfMatchesState();
                            function selectIfMatchesState() {
                                if (tabCtrl.tabMatchesState()) {
                                    tabsCtrl.select($scope, false);
                                }
                            }

                            var tabNavElement = jqLite(tabNavTemplate);
                            tabNavElement.data('$gsTabsController', tabsCtrl);
                            tabNavElement.data('$gsTabController', tabCtrl);
                            tabsCtrl.$tabsElement.append($compile(tabNavElement)($scope));


                            function tabSelected(isSelected) {
                                if (isSelected && childElementCount) {
                                    // this tab is being selected

                                    // check if the tab is already in the DOM
                                    // only do this if the tab has child elements
                                    if (!isTabContentAttached) {
                                        // tab should be selected and is NOT in the DOM
                                        // create a new scope and append it
                                        childScope = $scope.$new();
                                        childElement = jqLite(tabContentEle);
                                        $ionicViewSwitcher.viewEleIsActive(childElement, true);
                                        tabsCtrl.$element.append(childElement);
                                        $compile(childElement)(childScope);
                                        isTabContentAttached = true;
                                    }

                                    // remove the hide class so the tabs content shows up
                                    $ionicViewSwitcher.viewEleIsActive(childElement, true);

                                } else if (isTabContentAttached && childElement) {
                                    // this tab should NOT be selected, and it is already in the DOM

                                    if ($ionicConfig.views.maxCache() > 0) {
                                        // keep the tabs in the DOM, only css hide it
                                        $ionicViewSwitcher.viewEleIsActive(childElement, false);

                                    } else {
                                        // do not keep tabs in the DOM
                                        destroyTab();
                                    }

                                }
                            }

                            function destroyTab() {
                                childScope && childScope.$destroy();
                                isTabContentAttached && childElement && childElement.remove();
                                tabContentEle.innerHTML = '';
                                isTabContentAttached = childScope = childElement = null;
                            }

                            $scope.$watch('$tabSelected', tabSelected);

                            $scope.$on('$ionicView.afterEnter', function () {
                                $ionicViewSwitcher.viewEleIsActive(childElement, $scope.$tabSelected);
                            });

                            $scope.$on('$ionicView.clearCache', function () {
                                if (!$scope.$tabSelected) {
                                    destroyTab();
                                }
                            });

                        };
                    }
                };
            }])
        .directive('gsTabNav', [function () {
            return {
                restrict: 'E',
                replace: true,
                require: ['^gsTabs', '^gsTab'],
                template: '<a ng-class="{\'has-badge\':badge, \'tab-hidden\':isHidden(), \'tab-item-active\': isTabActive()}" ' +
                ' ng-disabled="disabled()" class="tab-item">' +
                '<span class="badge {{badgeStyle}}" ng-if="badge">{{badge}}</span>' +
                '<i class="icon {{getIcon()}}" ng-if="getIcon()"></i>' +
                '<span class="tab-title" ng-bind-html="title"></span>' +
                '</a>',
                scope: {
                    title: '@',
                    icon: '@',
                    iconOn: '@',
                    iconOff: '@',
                    badge: '=',
                    hidden: '@',
                    disabled: '&',
                    badgeStyle: '@',
                    'class': '@'
                },
                link: function ($scope, $element, $attrs, ctrls) {
                    var tabsCtrl = ctrls[0],
                        tabCtrl = ctrls[1];

                    //Remove title attribute so browser-tooltip does not apear
                    $element[0].removeAttribute('title');

                    $scope.selectTab = function (e) {
                        e.preventDefault();
                        tabsCtrl.select(tabCtrl.$scope, true);
                    };
                    if (!$attrs.ngClick) {
                        $element.on('click', function (event) {
                            $scope.$apply(function () {
                                $scope.selectTab(event);
                            });
                        });
                    }

                    $scope.isHidden = function () {
                        if ($attrs.hidden === 'true' || $attrs.hidden === true) return true;
                        return false;
                    };

                    $scope.getIconOn = function () {
                        return $scope.iconOn || $scope.icon;
                    };
                    $scope.getIconOff = function () {
                        return $scope.iconOff || $scope.icon;
                    };

                    $scope.isTabActive = function () {
                        return tabsCtrl.selectedTab() === tabCtrl.$scope;
                    };

                    $scope.getIcon = function () {
                        if (tabsCtrl.selectedTab() === tabCtrl.$scope) {
                            // active
                            return $scope.iconOn || $scope.icon;
                        }
                        else {
                            // inactive
                            return $scope.iconOff || $scope.icon;
                        }
                    };
                }
            };
        }]);

})(angular);