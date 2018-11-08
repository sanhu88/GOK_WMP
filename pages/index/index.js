Page({
  onLoad() {
    wx.request({
      url: 'https://test-miniprogram.com/api/weather/now', //仅为示例，并非真实的接口地址
      data: {
        city: '广州市'
      },
      
      /*success(res) {*/
      success: res =>{
        console.log(res.data)
        console.log(res.statusCode)
        console.log(res.header)
      }
    })
   }

})