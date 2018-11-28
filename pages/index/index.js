/**常数变量 */
const weatherMap = {
  'sunny': '晴天',
  'cloudy': '多云',
  'overcast': '阴',
  'lightrain': '小雨',
  'heavyrain': '大雨',
  'snow': '雪'
}

const weatherColorMap = {
  'sunny': '#cbeefd',
  'cloudy': '#deeef6',
  'overcast': '#c6ced2',
  'lightrain': '#bdd5e1',
  'heavyrain': '#c5ccd0',
  'snow': '#aae1fc'
}

const QQMapWX = require('../../libs/qqmap-wx-jssdk.js');

Page({
  
  data:{
    nowTemp :'',
    nowWeather : '',
    nowWeatherBackground:'',
    hourlyWeather: [],
    todayTemp: '',
    todayDate: '',
  },

  onLoad() {
    this.qqmapsdk = new QQMapWX({
      key: 'EAXBZ-33R3X-AA64F-7FIPQ-BY27J-5UF5B'
    })
    this.getNow();
  }, 
  /**End onLoad */

  onPullDownRefresh() {
    this.getNow(() => {
      wx.stopPullDownRefresh();
    })
  },
  /**End onPullDownRefresh */

  getNow(callback){
     wx.request({
      url: 'https://test-miniprogram.com/api/weather/now', //仅为示例，并非真实的接口地址
      data: {
        city: '广州市',
      },
      
      /*success(res) {*/
      success: res =>{
        let result = res.data.result;
        console.log(result);
        this.setNow(result);
        this.setHourlyWeather(result);
        this.setToday(result);
        /*console.log(res.data.result.now.temp)
        console.log(res.data.result.now.weather)
        console.log(res.data)
        console.log(res.statusCode)
        console.log(res.header)*/
      }, 
      /**end success */

      /**start complete */
      complete: () => {
        callback && callback();
      }   /**end complete */
    })
   },
   /**end of getNow */

   setNow(result){
     let temp = result.now.temp;
     let weather = result.now.weather;
     /*let forecast = result.forecast*/
     /**console.log(forecast)*/
     /*console.log(temp,weather)*/
     this.setData({
       nowTemp: temp + '°c',
       nowWeather: weatherMap[weather],
       nowWeatherBackground: '/images/' + weather + '-bg.png',

     }),/**end setData */
       wx.setNavigationBarColor({
         frontColor: '#000000',
         backgroundColor: weatherColorMap[weather],

       })
   },
   /**End setNow */



  setHourlyWeather(result){
    //set forecast
    let forecast = result.forecast;
    let hourlyWeather = [];
    let nowHour = new Date().getHours();
    for (let i = 0; i < 8; i += 1) {
      hourlyWeather.push({
        time: (i * 3 + nowHour) % 24 + "时",
        iconPath: '/images/' + forecast[i].weather + '-icon.png',
        temp: forecast[i].temp + "°",
      })
    }
    hourlyWeather[0].time = '现在',
    this.setData({
      hourlyWeather: hourlyWeather,
    })
  },/**End setHourlyWeather */



  setToday(result){
    let date = new Date()
    let mintemp = result.today.minTemp;
    let maxtemp = result.today.maxTemp;
    console.log(maxtemp);
    console.log(date);
    this.setData(
      {
        todayDate:date.getFullYear()+"-"+date.getMonth()+"-"+date.getDate()+" 今天",
        todayTemp: mintemp + "°c ~ " + maxtemp +"°c",
        /*
         todayTemp: `${result.today.minTemp}° - ${result.today.maxTemp}°`,
      todayDate: `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()} 今天`，
        */
      }
    )
  },
  /**End setToday */



  onTapDayWeather() {
    wx.navigateTo({
      url: '/pages/list/list'
    });
  },
  /**End onTapDayWeather */


  onTapLocation() {
    wx.getLocation({
     /* type: 'wgs84',*/
      success: res => {
        this.qqmapsdk.reverseGeocoder({
          location: {
            latitude: res.latitude,
            longitude: res.longitude
          },
          success: res => {
            let city = res.result.address_component.city
            console.log(city)
          }
        })
      },
    });
  },
  /**End onTapLocation */




})