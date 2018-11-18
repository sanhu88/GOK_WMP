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

Page({
  
  data:{
    nowTemp :'',
    nowWeather : '',
    nowWeatherBackground:'',
    hourlyWeather: []
  },
  onLoad() {
    this.getNow()
  }, 
  onPullDownRefresh() {
    this.getNow(() => {
      wx.stopPullDownRefresh()
    })
  },
  getNow(callback){
   
    wx.request({
      url: 'https://test-miniprogram.com/api/weather/now', //仅为示例，并非真实的接口地址
      data: {
        city: '广州市'
      },
      
      /*success(res) {*/
      success: res =>{
        let result = res.data.result
        console.log(result)
        let temp = result.now.temp
        let weather = result.now.weather
        /*let forecast = result.forecast*/
        /**console.log(forecast)*/
        /*console.log(temp,weather)*/
        this.setData({
          nowTemp : temp+'°c',
          nowWeather : weatherMap[weather],
          nowWeatherBackground: '/images/' + weather+'-bg.png'

        })/**end setData */

        wx.setNavigationBarColor({
          frontColor: '#000000',
          backgroundColor: weatherColorMap[weather],

        })
       
        //set forecast
        let forecast = result.forecast;
        let hourlyWeather = [];
        let nowHour = new Date().getHours();
        for (let i = 0; i < 8; i += 1) {
          hourlyWeather.push({
            time: (i*3 + nowHour) % 24 + "时",
            iconPath: '/images/' + forecast[i].weather+'-icon.png',
            temp: forecast[i].temp+"°",
          })
        }
        hourlyWeather[0].time = '现在'
        this.setData({
          hourlyWeather: hourlyWeather
        })



        /*console.log(res.data.result.now.temp)
        console.log(res.data.result.now.weather)
        console.log(res.data)
        console.log(res.statusCode)
        console.log(res.header)*/
      }, 
      /**end success */

      complete: () => {
        callback && callback()
      }   /**end complete */
    })
   }

})