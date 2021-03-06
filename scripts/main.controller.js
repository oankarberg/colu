var coluApp = angular.module('coluApp');
/**
 * @ngdoc service
 * @name coluApp.sharedProperties
 * @description
 * # sharedProperties
 * Service to share properties on the current active voyage on frontend.
 */

coluApp.service('sharedProperties', function() {


    var activeVoyage = "Default";
    return {
        /**
       * @ngdoc method
       * @name coluApp.sharedProperties#getActive
       * @methodOf  coluApp.sharedProperties
       *
       * @description
       * Method to get active voyage on scope
       * @example
       * sharedProperties.getActive();
       * @returns {Voyage Object} returns the active voyage for the frontend representation
       */
        getActive: function() {
            return activeVoyage;
        },

        /**
       * @ngdoc method
       * @name coluApp.sharedProperties#setActive
       * @methodOf coluApp.sharedProperties
       *
       * @description
       * Method to set active voyage on scope
      * @param {Voyage Object} Voyage object representing a voyage
       * @example
       * sharedProperties.setActive(Voyage);
       * @returns {none} returns nothing
       */
        setActive: function(voyage) {
            activeVoyage = voyage;
        }
    }
});


coluApp.controller('mainController', function($scope, $http, sharedProperties ){


  function checkTimeStatus(){

    var HOURS_TO_MILLISEC = 3600000;


    var required = Date.parse($scope.activeVoyage.rangeParameters.time.initial);
    var estimated = Date.parse($scope.activeVoyage.rangeParameters.time.current);


    var lower = required + $scope.activeVoyage.rangeParameters.time.lowerLimit*HOURS_TO_MILLISEC;
    var higher = required + $scope.activeVoyage.rangeParameters.time.upperLimit*HOURS_TO_MILLISEC;


    $scope.lowerRequiredDate = new Date(lower).toISOString().slice(0,10).replace(/-/g,"-") + " " + new Date(lower).toLocaleTimeString('en-GB');
    $scope.upperRequiredDate = new Date(higher).toISOString().slice(0,10).replace(/-/g,"-") + " " + new Date(higher).toLocaleTimeString('en-GB');
    if( estimated < higher && estimated > lower){
      $scope.activeVoyage.rangeParameters.time.status = 'GOOD';
    }
    else {
      $scope.activeVoyage.rangeParameters.time.status = 'BAD';
    }
  }

  function checkVelocityStatus(){
    var withinLowerLimit = $scope.activeVoyage.rangeParameters.velocity.current >= $scope.activeVoyage.rangeParameters.velocity.lowerLimit; 
    var withinUpperLimit = $scope.activeVoyage.rangeParameters.velocity.current <= $scope.activeVoyage.rangeParameters.velocity.upperLimit; 

    if(withinLowerLimit && withinUpperLimit){
      $scope.activeVoyage.rangeParameters.velocity.status = 'GOOD';
    }
    else {
      $scope.activeVoyage.rangeParameters.velocity.status = 'BAD';
    }
  }

  function checkWindStatus()
  {
      var lowerLimit = 180;
      var upperLimit = 360;
      if ($scope.activeVoyage.singleParameters.wind.direction > lowerLimit && $scope.activeVoyage.singleParameters.wind.direction < upperLimit)
      {
          if ($scope.activeVoyage.singleParameters.wind.current <= $scope.activeVoyage.singleParameters.wind.upperLimit)
          {
              console.log("TJO");
              $scope.activeVoyage.singleParameters.wind.status = "GOOD"; // its ok with some motvind
          }
          else
          {
            console.log("TJOHEJ");
              $scope.activeVoyage.singleParameters.wind.status = "BAD"; // too much motvind
          }
      }
      //jävla pissjavascript
      else
      {
          console.log("TJUUU");
          $scope.activeVoyage.singleParameters.wind.status = "GOOD";  // medvind is always ok
      }

  }
  function checkCurrentStatus() // current==ström
  {
      var lowerLimit = 180;
      var upperLimit = 360;
      if ($scope.activeVoyage.singleParameters.current.direction > lowerLimit && $scope.activeVoyage.singleParameters.current.direction < upperLimit)
      {
          if ($scope.activeVoyage.singleParameters.current.current <= $scope.activeVoyage.singleParameters.current.upperLimit)
          {
              $scope.activeVoyage.singleParameters.current.status = "GOOD"; // its ok with some motström
          }
          else
          {
              $scope.activeVoyage.singleParameters.current.status = "BAD"; // too much motström
          }
          

      }
      
      else
      {
          $scope.activeVoyage.singleParameters.current.status = "GOOD";  // medström is always ok
          $scope.activeVoyage.singleParameters.current.currentCurDir = "medström";
      }

  }

  var milliToHours = function(milli){
    var seconds = Math.floor(milli / 1000);
    var minutes = Math.floor(seconds / 60);
    var hours = Math.floor(minutes / 60);
    return hours;
  }
  $http.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";

  //Gets the Voyage-data
  $http.get('http://localhost:8090/voyages').success(function(data,status,headers,config)
    {

      //Delete some broken data, Einar Sanberg will solve it, sometime.
      data.splice(9, 1);
      data.splice(27,1);
      data.splice(14,1);

      //Position 27 is broken, and I can´t manage to delete it, hehe.

      $scope.voyages = data; //data.slice(1, 26);

      $scope.voyagesBad = [];
      $scope.voyagesGood = [];
      $scope.voyagesHandled = [];

      //Sets some hardcoded parameters
      for(var i = 0; i < $scope.voyages.length; i++)
      { 
        //For the presentation, the locations of departure and destination are invalid, therefore the map pin will show wrong 
        if($scope.voyages[i].ship.shipId == 1126 || $scope.voyages[i].ship.shipId == 3104 || $scope.voyages[i].ship.shipId == 1723 
          || $scope.voyages[i].ship.shipId == 1409 || $scope.voyages[i].ship.shipId == 1459 || $scope.voyages[i].ship.shipId == 1251
          ||  $scope.voyages[i].ship.shipId == 5161 || $scope.voyages[i].ship.shipId == 906)
        {
          $scope.voyages.splice(i, 1);
          if(i != 0)
            i--;

          
        }else{
          var upperEta =  new Date($scope.voyages[i].requiredMaxETA) - new Date($scope.voyages[i].requiredETA);
          var lowerEta =  new Date($scope.voyages[i].requiredMinETA) - new Date($scope.voyages[i].requiredETA);
          var lowerEtaHours = milliToHours(lowerEta);
          var upperEtaHours = milliToHours(upperEta);
          if(upperEtaHours < 0)
            upperEtaHours = 0;
          if(lowerEtaHours > 0)
            lowerEtaHours = 0;
          $scope.voyages[i].rangeParameters = {
            time: { label: "Ankomsttid", lowerLimit: lowerEtaHours , upperLimit: upperEtaHours, current: $scope.voyages[i].latestShipReport.ovaCTA, initial: $scope.voyages[i].requiredETA, status: $scope.voyages[i].latestShipReport.requiredETAStatus, unit: "h", number: 0 },
            velocity: {label: "Hastighet", lowerLimit: $scope.voyages[i].requiredAvgSpeedMin, upperLimit: $scope.voyages[i].requiredAvgSpeedMax, current: $scope.voyages[i].latestShipReport.speedAvg, status: $scope.voyages[i].latestShipReport.avgSpeedStatus, unit: "knop", number: 1}
          }

          $scope.voyages[i].rangeParameters.time.status = 'BAD';

          // console.log("status", $scope.voyages[0].rangeParameters.time.status);

          $scope.activeVoyage = $scope.voyages[i];
          checkTimeStatus();
         

          $scope.voyages[i].singleParameters = {
            fuel: {name: "fuel", label: "Bränsle", upperLimit: '250', current: '200', status: "GOOD", unit: "m3/dygn",},
            combinedWave : {name: "combinedWave", label: "Våghöjd", upperLimit: $scope.voyages[i].requiredMaxSignWaveHeight, current: $scope.voyages[i].currentWeatherWaypoint.signWaveHeight, status: $scope.voyages[i].currentWeatherWaypoint.signWaveHeightStatus, unit: "m"},
            current : {name: "current", label: "Ström", upperLimit: $scope.voyages[i].requiredMaxCurrentSpeed, currentCurDir:"motström", current: $scope.voyages[i].currentWeatherWaypoint.currentSpeed, direction:$scope.voyages[i].currentWeatherWaypoint.currentDir, status: $scope.voyages[i].currentWeatherWaypoint.currentSpeedStatus, unit: "m/s"},
            wind : {name: "wind", label: "Vind", upperLimit: $scope.voyages[i].requiredMaxWindSpeed, current: $scope.voyages[i].currentWeatherWaypoint.windSpeed, status: $scope.voyages[i].currentWeatherWaypoint.windSpeedStatus, unit: "m/s"}
          }
           checkCurrentStatus();
          flagVoyage($scope.voyages[i]);
        }
      } 

      $scope.activeVoyage = $scope.voyages[1];
      $scope.searchDestLocation = $scope.activeVoyage.destination;
      $scope.searchDepLocation = $scope.activeVoyage.departure;
      //Where all the functionality is
      main();

      }).error(function(data,status,headers,config){
        console.log('ERROR getting from backend' , status);

      });

    $scope.findDestLocation = function(destLocation){
      //updates the value in mapdirective and searches
      $scope.searchDestLocation = destLocation;
    }
    $scope.findDepLocation = function(depLocation){
      //updates the value in mapdirective and searches
      $scope.searchDepLocation = depLocation;
    }

    $scope.updateMap = function(location){

      $scope.locationFocus = location;
    }
      
    $scope.putData = function(){
        parameters = {
          requiredCurrentSpeed: $scope.activeVoyage.singleParameters.current.upperLimit,
          requiredWindSpeed: $scope.activeVoyage.singleParameters.wind.upperLimit,

          requiredSignWaveHeight: $scope.activeVoyage.singleParameters.combinedWave.upperLimit,
          requiredCurrentDir: 12,
          requiredMinETA: $scope.lowerRequiredDate,
          requiredMaxETA: $scope.upperRequiredDate,
          requiredAvgSpeedMin: $scope.activeVoyage.rangeParameters.velocity.lowerLimit,
          requiredAvgSpeedMax: $scope.activeVoyage.rangeParameters.velocity.upperLimit
          //requiredFuelConsumption:
        }

       //var vID = $scope.activeVoyage.voyageId;
      $http.put('http://localhost:8090/voyages/'+ $scope.activeVoyage.voyageId + '/updatelimits', parameters).success(function(data,status,headers,config)
      {
        //Succes getting from backend
        //Init scope data
        //console.log ('data ', data);


        //drawLines(data);
      }).error(function(data,status,headers,config){
          console.log('ERROR getting from backend' , status);
      });
    }

  function main (){

    //How the form works
    formFunctionality();

    //Shows the active Voyage in the detailed view
    $scope.showActive = function(s){
      sharedProperties.setActive(s);

      $scope.activeVoyage = sharedProperties.getActive();
      $scope.showActive.shipTrue = true;
      $scope.searchDestLocation = $scope.activeVoyage.destination;
      $scope.searchDepLocation = $scope.activeVoyage.departure;
      checkTimeStatus();
    }

    $scope.goBack = function(){
      $scope.showActive.shipTrue = false;
    }

    $scope.smallScreenSize = function(){
      var screenSize = screen.width;

      if(screenSize >= 1000){
        //console.log('Big screen');
        return false;
      }
      if(screenSize < 1000){
        //console.log('Small screen');
        return true;
      }

    }

    //Used to only show handle-button on Bad-voyages
    $scope.isBad = function(s){
      return ($scope.voyagesBad.indexOf(s) != -1)
    }

    //To "handle" voyages, and then put them in the handled-list
    $scope.handle = function(s){
      if(!isInArray(s,$scope.voyagesHandled))
        $scope.voyagesHandled.push(s);

      var index = $scope.voyagesBad.indexOf(s);


      if (index > -1) {
        $scope.voyagesBad.splice(index, 1);
      }

    }

    //Functionality of the form
    function formFunctionality(){

      $scope.editorEnabled = [false, false, false, false, false, false];

      $scope.enableEditor = function(id) {
        $scope.editorEnabled[id] = true;

      };

      $scope.disableEditor = function(id) {
        $scope.editorEnabled[id] = false;
      };

      $scope.save = function(paramId, paramName) {
        $scope.disableEditor(paramId);

        switch(paramId){
          case 0:
            checkTimeStatus();
            break;
          case 1:
            checkVelocityStatus();
            break;
          case 3:
            checkCurrentStatus();
            console.log("updated", $scope.voyages[1].currentWeatherWaypoint);
            break;
          case 5:
            checkWindStatus();
            break;

          default:

            if($scope.activeVoyage.singleParameters[paramName].current < $scope.activeVoyage.singleParameters[paramName].upperLimit)
            {
              $scope.activeVoyage.singleParameters[paramName].status = "GOOD";
            }
            else
              $scope.activeVoyage.singleParameters[paramName].status = "BAD";
        }

        flagVoyage($scope.activeVoyage);
        $scope.putData();
      };
    }

    function isInArray(value, array) {
      return array.indexOf(value) > -1;
    }
  }
 
  //Add voyages to right array, if any status is BAD, place in voyagesBad.
  function flagVoyage(voyage){

    if($scope.voyagesGood.indexOf(voyage) > -1) return;

    if(voyage.rangeParameters.time.status == "BAD" || voyage.rangeParameters.velocity.status == "BAD" || voyage.singleParameters.fuel.status == "BAD" || voyage.singleParameters.combinedWave.status == "BAD" || voyage.singleParameters.current.status == "BAD"  || voyage.singleParameters.wind.status == "BAD")
    {

      var index = $scope.voyagesBad.indexOf(voyage);
        if (index == -1)
          $scope.voyagesBad.push(voyage);

    }
    else
    {
      $scope.voyagesGood.push(voyage)
      var index = $scope.voyagesBad.indexOf(voyage);
        if (index > -1)
          $scope.voyagesBad.splice(index, 1);
    }
  }

  $scope.icons = ['glyphicon glyphicon-tint', 'glyphicon glyphicon-refresh', 'glyphicon glyphicon-scale', 'glyphicon glyphicon-cloud'];
 
});