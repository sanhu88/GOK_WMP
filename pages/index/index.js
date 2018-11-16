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
    forecast: [1, 2, 3, 4, 5, 6, 7, 8, 9]
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
        console.log(temp,weather)
        this.setData({
          nowTemp : temp+'°c',
          nowWeather : weatherMap[weather],
          nowWeatherBackground: '/images/' + weather+'-bg.png'

        })/**end setData */

        wx.setNavigationBarColor({
          frontColor: '#000000',
          backgroundColor: weatherColorMap[weather],

        })
       
        /*console.log(res.data.result.now.temp)
        console.log(res.data.result.now.weather)
        console.log(res.data)
        console.log(res.statusCode)
        console.log(res.header)*/
      }, /**end success */
      complete: () => {
        callback && callback()
      }   /**end complete */
    })
   }

})