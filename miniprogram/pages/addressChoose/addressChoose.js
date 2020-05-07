const db = wx.cloud.database()
const app = getApp()
const openid = app.globalData.openid
Page({
  data: {
    address_exsit: false,
    address_list:[],
  },
  on_show_hidden_number({currentTarget:{dataset}}){
    var setter = `address_list[${dataset.index}].user_show_phone`
    this.setData({
      [setter]: !dataset.usershowphone
    })
  },
  back_to_bookOrder({currentTarget:{dataset:{tag}}}){
    var pages = getCurrentPages();
    // var currPage = pages[pages.length - 1];   //当前页面
    var prevPage = pages[pages.length - 2];  //上一个页面
    //直接调用上一个页面的setData()方法，把数据存到上一个页面中去，存好数据后跳回订单页面
    prevPage.setData({
      user_tag: tag
    })
    wx.navigateBack({
      url: "../bookOrder/bookOrder"
    })
  },
  on_to_addAddress({currentTarget:{dataset}}){
    dataset.showdelete ?
    wx.navigateTo({
      url: `../addAddress/addAddress?showDelete=${dataset.showdelete}&tag=${dataset.tag}`
    }) :
    wx.navigateTo({
      url: `../addAddress/addAddress`
    })
  },
  onLoad: function () {
    const _this = this
    // 根据openID从地址数据库中取数据，取到之后然后渲染到页面
    db.collection('pr_userInfo').where({_openid: openid}).get({
      success({data}){
        // console.log('地址库中拿到的数据为：', data, data.length)
        if (data.length > 0) {
          _this.setData({
            address_list: data,
            address_exsit: true
          })
        }
      }
    })
  }
})