'use strict';

(function() {
  /* @ngInject */
  class SidebarJSCtrl {
    /* @ngInject */
    constructor($transclude, $element, SidebarJS) {
      this.elem = $element[0];
      this.transclude = $transclude;
      this.SidebarJS = SidebarJS;
      this.transcludedContent;
      this.transcludedScope;
    }
    $onInit() {
      this.elem.setAttribute('sidebarjs', '');
      this.SidebarJS.init();
    }
    $postLink() {
      this.transclude((clone, scope) => {
        for(let i = 0; i < clone.length; i++) {
          this.elem.children[0].appendChild(clone[i]);
        }
        this.transcludedContent = clone;
        this.transcludedScope = scope;
      });
    }
    $onDestroy() {
      this.transcludedScope.$destroy();
      this.transcludedScope = this.transcludedContent = null;
    }
  }

  /* @ngInject */
  function SidebarJSFactory() {
    let SidebarJS = window.SidebarJS || require('./../node_modules/sidebarjs/dist/sidebarjs.js');
    let instance;
    return Object.create({
      init: () => instance = new SidebarJS()
    }, {
      open: {writable: false, configurable: false, enumerable: false, value: () => instance.open()},
      close: {writable: false, configurable: false, enumerable: false, value: () => instance.close()},
      toggle: {writable: false, configurable: false, enumerable: false, value: () => instance.toggle()},
      elemHasListener: {writable: false, configurable: false, enumerable: false, value: SidebarJS.elemHasListener}
    });
  }

  /* @ngInject */
  function SidebarJSDirective(action) {
    return {
      /* @ngInject */
      controller: function ctrl(SidebarJS) {
        this.SidebarJS = SidebarJS;
      },
      link: function link(scope, elem, attrs, ctrl) {
        if(!ctrl.SidebarJS.elemHasListener(elem[0])) {
          elem[0].addEventListener('click', ctrl.SidebarJS[action]);
          ctrl.SidebarJS.elemHasListener(elem[0], true);
        }
      }
    };
  }

  angular
    .module('ngSidebarJS', [])
    .factory('SidebarJS', SidebarJSFactory)
    .component('sidebarjs', {transclude: true,controller: SidebarJSCtrl})
    .directive('sidebarjsOpen', SidebarJSDirective.bind(null, 'open'))
    .directive('sidebarjsClose', SidebarJSDirective.bind(null, 'close'))
    .directive('sidebarjsToggle', SidebarJSDirective.bind(null, 'toggle'));
})();
