package ship;
import java.util.ArrayList;

/**
 * Class to represent the weather for each expected position of the ship
 */
public class WeatherWaypoint
{
	private double windSpeed; //A forecasted wind speed maxValue="60.0"minValue="0.0" 
	private double windDir; //A forecasted wind direction maxValue="360.0"  minValue="0.0" 
	private double swellHeight; //A forecasted swell height.Swell is waves generated by a previously wind... maxValue="12.0" minValue="0.0"
	private double swellDir;  //A forecasted swell direction, maxValue="360.0" minValue="0.0" 
	private double swellPeriod; //A forecasted swell period maxValue="100.0" minValue="0.0"  
	private double currentSpeed; //A forecasted current speed maxValue="5.0" minValue="0.0"
	private double currentDir; // A forecasted current direction maxValue="5.0" minValue="0.0" 
	private double airPressure; //A forecasted air airPressure maxValue="1030.0"  minValue="960.0" 
	private double signWaveHeight; //A forcasted significant wave height 
	private double windWaveHeight; //A forcasted wind wave height" maxValue="12.0" minValue="0.0" 	
	/*A forcasted wind wave period. Wind wave is the wave generated by the current wind, hard to predict...
	maxValue="100.0" minValue="0.0" */
	private double windWavePeriod; 
	private double calcShipSpeed; //Forcasted ship speed at weather waypoint maxValue="24.0" minValue="0.0"
	private double weatherFactor; //Weatherfactor , maxValue="10.0" minValue="0.0" 
	private double currentFactor; //Currentfactor , 'stream factor' maxValue="10.0" minValue="0.0" 
	private double calcDistance; //Calculated distance
	private String goodWeather; //If fullfills Good weather criteria
	private double lon;
	private String legType;
	private double lat;
	private String dateETP; // Estimated Time of Passage in UTC format="yyyy-M-dd HH:mm:ss"

	//våra variabler
	private String windSpeedStatus; 
	private String windDirStatus;
	private String signWaveHeightStatus;
	private String currentSpeedStatus;
	private String currentDirStatus;

	public WeatherWaypoint(){
		windSpeed = 0.0;
		windDir = 0.0;
		swellHeight = 0.0;
		swellDir = 0.0;
		swellPeriod = 0.0;
		currentSpeed = 0.0;
		currentDir = 0.0;
		airPressure = 0.0;
		signWaveHeight = 0.0;
		windWaveHeight = 0.0;
		windWavePeriod = 0.0;
		calcShipSpeed = 0.0;
		weatherFactor = 0.0;
		currentFactor = 0.0;
		calcDistance = 0.0;
		goodWeather = "undefined";
		lon = 0.0;
		legType = "undefined";
		lat = 0.0;
		dateETP = "2000-01-01 00:00";
		windSpeedStatus = "undefined";
		windDirStatus = "undefined";
		signWaveHeightStatus = "undefined";
		currentSpeedStatus = "undefined";
		currentDirStatus = "undefined";
	}
	

	public WeatherWaypoint (double theWindSpeed,
							double theWindDir,
							double theSwellHeight,
							double theSwellDir, 
							double theSwellPeriod,
							double theCurrentSpeed,
							double theCurrentDir,
							double thePressure,
							double theSignwaveh,
							double theWindwaveh,
							double theWindWavePeriod,
							double theCalcShipSpeed,
							double theWeatherFactor,
							double theCurrentFactor,
							double theCalcDistance,
							String theGoodWeather,
						 	double theLon,
							String theLegType,
							double theLat,
							String theDate)
	{
		windSpeed = theWindSpeed;
		windDir = theWindDir;
		swellHeight = theSwellHeight;
		swellDir = theSwellDir; 
		swellPeriod = theSwellPeriod;
		currentSpeed = theCurrentSpeed;
		currentDir = theCurrentDir;
		airPressure = thePressure;
		signWaveHeight = theSignwaveh;
		windWaveHeight = theWindwaveh;
		windWavePeriod = theWindWavePeriod;
		calcShipSpeed = theCalcShipSpeed;
		weatherFactor = theWeatherFactor;
		currentFactor = theCurrentFactor;
		calcDistance = theCalcDistance;
		goodWeather = theGoodWeather;
		lon = theLon;
		legType = theLegType;
		lat = theLat;
		dateETP = theDate;
		windSpeedStatus = "undefined";
		windDirStatus = "undefined";
		signWaveHeightStatus = "undefined";
		currentSpeedStatus = "undefined";
		currentDirStatus = "undefined";
	}

	public double getWindSpeed()
	{
		return windSpeed;
	}
	public double getWindDir()
	{
		return windDir;
	}
	public double getTheSwellh()
	{
		return swellHeight;
	}
	public double getLat()
	{
		return lat;
	}
	public double getLon()
	{
		return lon;
	}
	public double getSwellDir(){
		return swellDir;
	} 
	public double getSwellPeriod(){
		return swellPeriod;
	}
	public double getCurrentSpeed(){
		return currentSpeed;
	}
	public double getCurrentDir(){
		return currentDir;
	}
	public double getAirPressure(){
		return airPressure;
	}
	public double getSignWaveHeight(){
		return signWaveHeight;
	}
	public double getWindwaveh(){
		return windWaveHeight;
	}
	public double getWindWavePeriod(){
		return windWavePeriod;
	}
	public double getCalcShipSpeed(){
		return calcShipSpeed;
	}
	public double getWeatherFactor(){
		return weatherFactor;
	}
	public double getCurrentFactor(){
		return currentFactor;
	}
	public double getCalcDistance(){
		return calcDistance;
	}
	public String getGoodWeather(){
		return goodWeather;
	}
	public String getLegType(){
		return legType;
	}
	public String getETPDate(){
		return dateETP;
	}
	public String getWindSpeedStatus()
	{
		return windSpeedStatus;	
	}
	public String getWindDirStatus()
	{
		return windDirStatus;
	}
	public String getSignWaveHeightStatus()
	{
		return signWaveHeightStatus;
	}
	public String getCurrentDirStatus()
	{
		return currentDirStatus;
	}
	public String getCurrentSpeedStatus()
	{
		return currentSpeedStatus;
	}
	public void setWindSpeedStatus(String status)
	{
		windSpeedStatus = status;
	}
	public void setWindDirStatus(String status)
	{
		windDirStatus = status;
	}
	public void setSignWaveHeightStatus(String status)
	{
		signWaveHeightStatus = status;
	}
	public void setCurrentSpeedStatus(String status)
	{
		currentSpeedStatus = status;
	}
	public void setCurrentDirStatus(String status)
	{
		currentDirStatus = status;
	}

	public void updateWindSpeedStatus(double chosenWindSpeed)
	{
		if (windSpeed <= chosenWindSpeed)
		{
			setWindSpeedStatus("GOOD");
		}
		else  
		{	
			setWindSpeedStatus("BAD");
		}
		
	}

	public void updateWindDirStatus(double chosenWindDir){

		if (windDir < chosenWindDir)
		{
			setWindDirStatus("GOOD");
		}
		else 
		{		
			setWindDirStatus("BAD");
	}	}

	public void updateSignWaveHeightStatus(double chosenSignWaveHeight){
		if (signWaveHeight < chosenSignWaveHeight)
		{
			setSignWaveHeightStatus("GOOD");
		}
	
		else
		{
			setSignWaveHeightStatus("BAD");
		}
	}

	public void updateCurrentDirStatus(double chosenCurrentDir){
		if (currentDir < chosenCurrentDir)
			{
				setCurrentDirStatus("GOOD");
			}
			else
			{
				setCurrentDirStatus("BAD");
			}
	}
	public void updateCurrentSpeedStatus(double chosenCurrentSpeed){
		if (currentSpeed < chosenCurrentSpeed)
		{
				setCurrentSpeedStatus("GOOD");
		}

		else
		{
				setCurrentSpeedStatus("BAD");
		}
	}
}