var app = getApp()
const db = wx.cloud.database()
Page({
  data: {
    top_icons: [
      {
        url: 'cloud://wx-cloud-2zjv7.7778-wx-cloud-2zjv7-1259562575/pr_photos/icon1.png',
        text: '手机回收',
        type: 'phone'
      },
      {
        url: 'cloud://wx-cloud-2zjv7.7778-wx-cloud-2zjv7-1259562575/pr_photos/icon2.png',
        text: '平板回收',
        type: 'pad'
      },
      {
        url: 'cloud://wx-cloud-2zjv7.7778-wx-cloud-2zjv7-1259562575/pr_photos/icon3.png',
        text: '笔记本回收',
        type: 'book'
      },
      {
        url: 'cloud://wx-cloud-2zjv7.7778-wx-cloud-2zjv7-1259562575/pr_photos/icon4.png',
        text: '批量回收',
        type: 'amount'
      } 
    ],
    bottom_icons: [
      {
        url: 'cloud://wx-cloud-2zjv7.7778-wx-cloud-2zjv7-1259562575/pr_photos/icon1.png',
        text: '急速响应'
      },
      {
        url: 'cloud://wx-cloud-2zjv7.7778-wx-cloud-2zjv7-1259562575/pr_photos/icon2.png',
        text: '专业认证'
      },
      {
        url: 'cloud://wx-cloud-2zjv7.7778-wx-cloud-2zjv7-1259562575/pr_photos/icon3.png',
        text: '隐私保障'
      },
      {
        url: 'cloud://wx-cloud-2zjv7.7778-wx-cloud-2zjv7-1259562575/pr_photos/icon4.png',
        text: '绿色环保'
      } 
    ],
    swiper_data: []
  },
  on_to_phoneModels(e){
    console.log(e)
    wx.navigateTo({
      url: `../phoneModels/phoneModels?type=${e.currentTarget.dataset.type}`
    })
  },
  on_to_choices(){
    wx.navigateTo({
      url: "../choices/choices"
    })
  },
  on_to_search(){
    wx.navigateTo({
      url: '../search/search'
    })
  },
  onLoad: function (options) {
    const _this = this
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        console.log('[云函数] [login] user openid: ', res.result.openid)
        app.globalData.openid = res.result.openid
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
      }
    })
    db.collection('pr_models2').where({brand: '苹果'}).get({
      success(res){
        console.log(res.data)
        _this.setData({
          swiper_data: res.data
        })
      }
    })
    
  }
})