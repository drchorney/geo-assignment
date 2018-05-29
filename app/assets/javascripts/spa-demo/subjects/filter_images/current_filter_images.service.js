(function() {
  "use strict";

  angular
    .module("spa-demo.subjects")
    .service("spa-demo.subjects.CurrentFilterImages", CurrentFilterImages);

  CurrentFilterImages.$inject = ["$rootScope"];
  function CurrentFilterImages($rootScope) {
    var service = this;
    this.images = [];

    return;
    ////////////////
  }
  CurrentFilterImages.prototype.getFilterImages = function() {
    return this.images;
  }  
  CurrentFilterImages.prototype.clearFilterImages = function() {
    this.images=[];
  }  
  CurrentFilterImages.prototype.setFilterImages = function(images) {
    console.log("setFilterImages", images);
    this.images = images;
  }

})();