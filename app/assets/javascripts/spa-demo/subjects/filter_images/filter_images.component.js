(function() {
  "use strict";

  angular
    .module("spa-demo.subjects")
    .component("sdFilterImageEditor", {
      templateUrl: filterImageEditorTemplateUrl,
      controller: FilterImageEditorController,
      bindings: {
        authz: "<"
      },
      require: {
        imagesAuthz: "^sdImagesAuthz"
      }
    });
   
  filterImageEditorTemplateUrl.$inject = ["spa-demo.config.APP_CONFIG"];
  function filterImageEditorTemplateUrl(APP_CONFIG) {
    return APP_CONFIG.filter_image_editor_html;
  }    

  FilterImageEditorController.$inject = ["$scope","$q",
                                   "$state", "$stateParams",
                                   "spa-demo.authz.Authz",
                                   "spa-demo.layout.DataUtils",
                                   "spa-demo.geoloc.geocoder",
                                   "spa-demo.geoloc.myLocation",
                                   "spa-demo.subjects.Image"
                                   ];
  function FilterImageEditorController($scope, $q, $state, $stateParams, 
                                 Authz, DataUtils,
                                 geocoder, myLocation, Image) {
    var vm=this;
    vm.submit = submit;
    vm.locationByAddress = locationByAddress;
    vm.lookupAddress = lookupAddress;
    vm.location = null;
    vm.getFormattedAddress = getFormattedAddress;
    vm.getLongitude = getLongitude;
    vm.getLatitude = getLatitude;
    vm.images = null;
    vm.remove_from_list = remove_from_list;
    vm.ids_not_to_include = [];
    vm.refresh = refresh;
    vm.stuff_deleted = false;

    vm.isCurrentLocationSupported = myLocation.isCurrentLocationSupported;
 
    return;
    //////////////

    function lookupAddress() {
      console.log("lookupAddress for", vm.address);
      geocoder.getLocationByAddress(vm.address).$promise.then(
        function(location){
          vm.location = angular.copy(location);
          console.log("location", location);
        });
    }

    function getFormattedAddress() {
      return this.location ? this.location.formatted_address : null;
    }

    function getLongitude() {
      return this.location ? this.location.position.lng : null;
    }

    function getLatitude() {
      return this.location ? this.location.position.lat : null;
    }

    function refresh() {
      vm.ids_not_to_include = [];
      vm.stuff_deleted = false;
    }

    function submit() {
      var id_string = vm.ids_not_to_include.join(",")
      console.log(id_string);
      if (vm.ids_not_to_include.length > 0) {
        vm.stuff_deleted = true;
      }
      var images = Image.query({distance: vm.distance, lng: vm.location.position.lng, lat: vm.location.position.lat, ids: id_string });

      images.$promise.then(function(images_) {
        vm.images = images_;
      })
    }

    function remove_from_list(id) {
      if (vm.ids_not_to_include.includes(id)) {
        var index = vm.ids_not_to_include.indexOf(id);
        vm.ids_not_to_include.splice(index, 1);
      } else {
        vm.ids_not_to_include.push(id);
      }
      console.log(vm.ids_not_to_include);
    }

    function locationByAddress(address) {
      console.log("locationByAddress for", address);
      geocoder.getLocationByAddress(address).$promise.then(
        function(location){
          vm.location = location;
          vm.item.position = location.position;
          console.log("location", vm.location);
        });
    }

    function handleError(response) {
      console.log("error", response);
      if (response.data) {
        vm.item["errors"]=response.data.errors;          
      } 
      if (!vm.item.errors) {
        vm.item["errors"]={}
        vm.item["errors"]["full_messages"]=[response]; 
      }      
      $scope.imageform.$setPristine();
    }    
  }

})();
