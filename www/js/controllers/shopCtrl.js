function shopCtrl($scope, $state, $window, $stateParams, $ionicModal, $ionicSlideBoxDelegate, $cordovaSocialSharing, dealsFactory) {

  // Get shop nom

  if ($stateParams.shopName) {
    $scope.shopName = $stateParams.shopName;
  }

  // Favorites

  $scope.favory = false;

  $scope.isFavorite = function(deal) {
    if (dealsFactory.favorites.indexOf(deal) > -1)
      return true;
  };

  $scope.toggleFavorite = function(deal) {
    if ($scope.isFavorite(deal)) {
      dealsFactory.favorites.splice(dealsFactory.favorites.indexOf(deal), 1);
      $window.localStorage.setItem("favories", JSON.stringify(dealsFactory.favorites));
    } else {
      if (dealsFactory.favorites.indexOf(deal._id) < 0) {
        dealsFactory.favorites.push(deal);
        $window.localStorage.setItem("favories", JSON.stringify(dealsFactory.favorites));
      }
    }
  };

  $scope.removeFavorite = function(deal) {
    dealsFactory.favorites.splice(dealsFactory.favorites.indexOf(deal), 1);
    $window.localStorage.setItem("favories", JSON.stringify(dealsFactory.favorites));
  };

  // Favorites deal

  $scope.toggleFavoriteInDeal = function() {
    if ($scope.favory) {
      dealsFactory.favorites.splice(dealsFactory.favorites.indexOf($scope.dealsInShop1[$scope.activeIndex]), 1);
      $window.localStorage.setItem("favories", JSON.stringify(dealsFactory.favorites));
      $scope.favory = false;
    } else {
      if (dealsFactory.favorites.indexOf($scope.dealsInShop1[$scope.activeIndex]._id) < 0) {
        dealsFactory.favorites.push($scope.dealsInShop1[$scope.activeIndex]);
        $window.localStorage.setItem("favories", JSON.stringify(dealsFactory.favorites));
        $scope.favory = true;
      }
    }
  };

  $scope.isFavoriteInDeal = function() {
    if ($scope.dealsInShop1 && dealsFactory.favorites.indexOf($scope.dealsInShop1[$scope.activeIndex]) > -1) {
      $scope.favory = true;
    }
  };

  // Share functions

  $scope.shareAnywhere = function() {
    $cordovaSocialSharing.share("Description de l'offre " + $scope.shop.deals[0].name + ":" + $scope.shop.deals[0].description, "Partage de l'offre: " + $scope.shop.deals[0].name, 'http://goodil.ibangf.ovh/' + $scope.shop.deals[0].image, "Offre partagée via l'application GOODIL.Téléchargez l'application sur: http://www.goodil.fr");
  };

  // Slider

  $scope.$on("$ionicSlides.sliderInitialized", function(event, data) {
    // data.slider is the instance of Swiper
    $scope.slider = data.slider;
  });

  $scope.$on("$ionicSlides.slideChangeEnd", function(event, data) {
    $scope.activeIndex = data.activeIndex;
    $scope.isFavoriteInDeal();
  });

  // Get deals in Shop
  if ($stateParams.shopID) {
    $scope.dealsInShop1 = [];
    for (var i = 0; i < dealsFactory.deals.length; i++) {
      if (dealsFactory.deals[i].shop._id == $stateParams.shopID) {
        $scope.dealsInShop1.push(dealsFactory.deals[i]);
      }
    }
    console.log($scope.dealsInShop1);
  }

  // Display selected view

  if ($stateParams.dealID) {
    for (var j = 0; j < $scope.dealsInShop1.length; j++) {
      if ($scope.dealsInShop1[j]._id == $stateParams.dealID) {
        $scope.activeIndex = j;
        $scope.isFavoriteInDeal();
        break;
      }
    }
    setTimeout(function() {
      $ionicSlideBoxDelegate.slide(j);
      $ionicSlideBoxDelegate.update();
      $scope.$apply();
    });
  }

  // Go to selected deal view

  $scope.goToDeal = function(deal) {
    $state.go('tab.shopDeal', {
      shopID: $stateParams.shopID,
      dealID: deal._id,
      shopName: $stateParams.shopName
    });
  };

  // Go to map view

  $scope.goToMap = function(deal) {
    console.log(deal);
    $state.go('tab.mapShops', {
      lat: deal.shop.point.coordinates[0],
      lng: deal.shop.point.coordinates[1]
    }, {
      reload: true
    });
  };

  // Deal modal

  $ionicModal.fromTemplateUrl('templates/modal-deal.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    return $scope.modal = modal;
  });

  $scope.openModal = function(deal) {
    $scope.deal = deal;
    return $scope.modal.show();
  };

  $scope.closeModal = function() {
    return $scope.modal.hide();
  };

}
