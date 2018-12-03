// pages/list/list.js
const dayMap = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
Page({

  data: {
    nowTemp: '',
    nowWeather: '',
    nowWeatherBackground: '',
    weekWeather:[1,2,3,4,5,6,7],
    city:'北京市',
   
  },
  onLoad(options) {
    console.log(options.city);
    this.setData({
      city: options.city,
    })
    this.getWeekWeather();
  },
  onPullDownRefresh() {
    this.getWeekWeather(() => {
      wx.stopPullDownRefresh();
    })
  },
  getWeekWeather(callback) {

    wx.request({
      url: 'https://test-miniprogram.com/api/weather/future', //仅为示例，并非真实的接口地址
      data: {
        /*city: '广州市',*/
        city:this.data.city,
        
        time:new Date().getTime(),
      },

      /*success(res) {*/
      success: res => {
        let result = res.data.result;
        this.setWeekWeather(result);

        console.log(result);
        /*console.log(forecastweekweather);*/
        /*this.setNow(result);*/
        
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
  setWeekWeather(result) {
    let weekWeather = []
    for (let i = 0; i < 7; i++) {
      let date = new Date()
      date.setDate(date.getDate() + i)
      weekWeather.push({
        day: dayMap[date.getDay()],
        date: `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`,
        temp: `${result[i].minTemp}° - ${result[i].maxTemp}°`,
        iconPath: '/images/' + result[i].weather + '-icon.png'
      })
    };
    weekWeather[0].day = '今天'
    this.setData({
      weekWeather: weekWeather
    })
  }
})