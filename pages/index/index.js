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

const UNPROMPTED = 0
const UNAUTHORIZED = 1
const AUTHORIZED = 2


Page({
  
  data:{
    nowTemp :'',
    nowWeather : '',
    nowWeatherBackground:'',
    hourlyWeather: [],
    todayTemp: '',
    todayDate: '',
    city: '北京市',
   
    locationAuthType: UNPROMPTED,
  },
  /**所有动态变量 */

  onLoad() {
    this.qqmapsdk = new QQMapWX({
      key: 'WTNBZ-P2EKV-KB3PP-UNL24-UBCT3-RJFDO',
    })
    wx.getSetting({
      success: res => {
        let auth = res.authSetting['scope.userLocation'];
        /*console.log(auth);*/
        let locationAuthType = auth ? AUTHORIZED
          : (auth === false) ? UNAUTHORIZED : UNPROMPTED;
          //三元表达式
       
        this.setData({
          locationAuthType: locationAuthType,
          
        });
        if (auth)
          this.getCityAndWeather();
        else
          this.getNow(); //使用默认城市
      },
      fail: () => {
        this.getNow(); //使用默认城市
      },
    })
  }, 
  /**一开始就调用的生命周期函数 */
  /**End onLoad */

  onPullDownRefresh() {
    this.getNow(() => {
      wx.stopPullDownRefresh();
    })
  },
  /**下拉刷新所用函数 */
  /**End onPullDownRefresh */

  getNow(callback){
     wx.request({
      url: 'https://test-miniprogram.com/api/weather/now', //仅为示例，并非真实的接口地址
      data: {
        /*city: '广州市',*/
        city : this.data.city,
      },
      
      /*success(res) {*/
      success: res =>{
        let result = res.data.result;
        /*console.log(result);*/
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
   /**获取天气的核心代码 */
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
    /*console.log(maxtemp);*/
    /*console.log(date);*/
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
      url: '/pages/list/list?city='+this.data.city,
    });
  },
  /**点击跳入第二页，传递city参数 */
  /**End onTapDayWeather */


  onTapLocation() {
   this.getCityAndWeather()
  },
  /**点击定位服务 */
  /**End onTapLocation */
  getCityAndWeather() {
    wx.getLocation({
      success: res => {
        this.setData({
          locationAuthType: AUTHORIZED,
          
        });
        this.qqmapsdk.reverseGeocoder({
          location: {
            latitude: res.latitude,
            longitude: res.longitude,
          },
          success: res => {
            let city = res.result.address_component.city;
            /*console.log(city); */
            this.setData({
              city: city,
            });
            this.getNow();
          },
          /**End qqmapsdk.reverseGeocoder success */
        });
        /**End qqmapsdk.reverseGeocoder  */
      },
      /**End  wx.getLocation success*/

      
      fail: () => {
        this.setData({
          locationAuthType: UNAUTHORIZED,
         
        })
      },
      /** End qqmapsdk.reverseGeocoder fail  */
    });
    /**End wx.getLocation */
  },
  /**返回城市和天气，在 onTapLocation和onLoad被调用*/
});
