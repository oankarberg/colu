var coluApp = angular.module('coluApp');

coluApp.service('sharedProperties', function() {
    
    var activeVoyage = "Default";
    return {
        getActive: function() {
            return activeVoyage;
        },
        setActive: function(s) {
            activeVoyage = s;
        }
    }
});

coluApp.controller('mainController', function($scope, $http, sharedProperties ){

  function checkTimeStatus(){
    var MINUTES_TO_MILLISEC = 60000;

    var required = Date.parse($scope.activeVoyage.rangeParameters.time.required);
    var estimated = Date.parse($scope.activeVoyage.rangeParameters.time.current);

    var lower = required + $scope.activeVoyage.rangeParameters.time.lowerLimit*MINUTES_TO_MILLISEC;
    var higher = required + $scope.activeVoyage.rangeParameters.time.upperLimit*MINUTES_TO_MILLISEC;

    if( estimated < higher && estimated > lower){
      $scope.activeVoyage.rangeParameters.time.status = 'GOOD';
    }
    else {
      $scope.activeVoyage.rangeParameters.time.status = 'BAD';
    }
  }

  function checkVelocityStatus(){
    var withinLowerLimit = $scope.activeVoyage.rangeParameters.velocity.current > $scope.activeVoyage.rangeParameters.velocity.lowerLimit; 
    var withinUpperLimit = $scope.activeVoyage.rangeParameters.velocity.current < $scope.activeVoyage.rangeParameters.velocity.upperLimit; 

    if(withinLowerLimit && withinUpperLimit){
      $scope.activeVoyage.rangeParameters.velocity.status = 'GOOD';
    }
    else {
      $scope.activeVoyage.rangeParameters.velocity.status = 'BAD';
    }
  }

  //Gets the Voyage-data
  $http.get('http://localhost:8090/voyages').success(function(data,status,headers,config)
    {
    
      //Delete some broken data, Einar Sanberg will solve it, sometime.
      data.splice(9, 1);  
    
      //Position 27 is broken, and I can´t manage to delete it, hehe.   
      $scope.voyages = data.slice(1, 26);
      $scope.activeVoyage = $scope.voyages[0];
      $scope.voyagesBad = [];
      $scope.voyagesGood = [];    
      $scope.voyagesHandled = [];

      //Sets some hardcoded parameters
      for(var i = 0; i < $scope.voyages.length; i++)
      {
        $scope.voyages[i].rangeParameters = {
          time: { label: "Tid", lowerLimit: '-30', upperLimit: '30', current: $scope.voyages[i].eta, required: $scope.voyages[i].requiredMaxETA, status: $scope.voyages[i].latestShipReport.requiredETAStatus, unit: "minuter", number: 0 },
          velocity: {label: "Hastighet", lowerLimit: $scope.voyages[i].requiredAvgSpeedMin, upperLimit: $scope.voyages[i].requiredAvgSpeedMax, current: $scope.voyages[i].latestShipReport.speedAvg, status: $scope.voyages[i].latestShipReport.avgSpeedStatus, unit: "knop", number: 1}
        }


        $scope.voyages[i].rangeParameters.time.status = 'BAD';

        // console.log("status", $scope.voyages[0].rangeParameters.time.status);

        checkTimeStatus(i);

        $scope.voyages[i].singleParameters = {

          fuel: {name: "fuel", label: "Bränsle", upperLimit: '250', current: '200', status: "GOOD", unit: "L/mil",},
          combinedWave : {name: "combinedWave", label: "Våghöjd", upperLimit: $scope.voyages[i].requiredMaxSignWaveHeight, current: $scope.voyages[i].currentWeatherWaypoint.signWaveHeight, status: $scope.voyages[i].currentWeatherWaypoint.signWaveHeightStatus, unit: "m"},
          current : {name: "current", label: "Ström", upperLimit: $scope.voyages[i].requiredMaxCurrentSpeed, current: $scope.voyages[i].currentWeatherWaypoint.currentSpeed, status: $scope.voyages[i].currentWeatherWaypoint.currentSpeedStatus, unit: "m/s"},
          wind : {name: "wind", label: "Vind", upperLimit: $scope.voyages[i].requiredMaxWindSpeed, current: $scope.voyages[i].currentWeatherWaypoint.windSpeed, status: $scope.voyages[i].currentWeatherWaypoint.windSpeedStatus, unit: "m/s"}

        }

        flagVoyage($scope.voyages[i]);
      } 



      //Where all the functionality is
      main();   
      
      }).error(function(data,status,headers,config){
        console.log('ERROR getting from backend' , status);

      });
      
    $scope.putData = function(){
        //console.log('hejje');
        parameters = {
          requiredCurrentSpeed: $scope.activeVoyage.singleParameters.current.upperLimit,
          requiredWindSpeed: $scope.activeVoyage.singleParameters.wind.upperLimit,
          requiredWindDir: 125,
          requiredSignWaveHeight: $scope.activeVoyage.singleParameters.combinedWave.upperLimit,
          requiredCurrentDir: 12,
          requiredMinETA: "2015-05-20 00:00",
          requiredMaxETA: "2015-05-21 02:00",
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
    $scope.handel = function(s){
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
          default:
            if($scope.activeVoyage.singleParameters[paramName].current < $scope.activeVoyage.singleParameters[paramName].upperLimit)
              $scope.activeVoyage.singleParameters[paramName].status = "GOOD";
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
});