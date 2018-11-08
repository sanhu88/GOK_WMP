Page({
  data:{
    nowTemp :14,
    nowWeather : 'sunny'
  },
  onLoad() {
    wx.request({
      url: 'https://test-miniprogram.com/api/weather/now', //仅为示例，并非真实的接口地址
      data: {
        city: '广州市'
      },
      
      /*success(res) {*/
      success: res =>{
        let result = res.data.result
        let temp = result.now.temp
        let weather = result.now.weather
        console.log(temp,weather)
        /*console.log(res.data.result.now.temp)
        console.log(res.data.result.now.weather)
        console.log(res.data)
        console.log(res.statusCode)
        console.log(res.header)*/
      }
    })
   }

})