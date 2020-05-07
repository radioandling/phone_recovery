const app = getApp()
const db = wx.cloud.database()
const openid = app.globalData.openid
Page({
  data: {
    btn_is_disabled: true,
    show_choices: true,
    show_detail_address: false,
    model_name: '',
    img_url: '',
    final_price: '',
    idcard_number: '',
    decrease_price: '',
    choices_array: [],
    agreed: false,
    user_info: null,
    user_tag: undefined
  },
  on_show_icon() {
    this.setData({
      show_choices: !this.data.show_choices
    })
  },
  on_to_add_address() {
    var _this = this
    // 进入地址选择页面
    wx.navigateTo({
      url: '../addressChoose/addressChoose'
    })
  },
  on_test_idcard({detail: {value}}) {
    // 正则验证身份证号码是否正确, 不正确提示客户
    const idCardNumberReg = /^[1-9]\d{5}(18|19|20|(3\d))\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/
    idCardNumberReg.test(value) ?
    this.setData({
      idcard_number: value
    })
    :
    wx.showToast({
      title: '身份证格式不对',
      duration: 1000,
      icon: "none"
    })
  },
  on_agreed_protocol(e) {
    this.setData({
      agreed: e.detail.value,
      btn_is_disabled: !e.detail.value
    })
  },

  // 做2件事情： 1. 判定信息是否填写完整 --- 2. 将订单信息添加到数据库中
  on_submit_user_info() {
    var _this = this
    // 第一件事件：判定信息是否填写完整
    var condition = (_this.data.model_name.length > 0) && (_this.data.final_price !== undefined) && (_this.data.user_info !== null) && (_this.data.idcard_number.length >= 15) 
    if (condition) {
      // 第二件事情：将信息上传到数据库中
      const address = _this.data.user_info.user_region[0] + _this.data.user_info.user_region[1] + _this.data.user_info.user_region[2] + _this.data.user_info.user_detail_address
      db.collection('pr_orderInfo').add({
        data: {
          order_model: _this.data.model_name,
          order_idcard: _this.data.idcard_number,
          order_price: _this.data.final_price,
          order_state: '已下单',
          order_time: new Date(),
          order_user_name: _this.data.user_info.user_name,
          order_user_phone: _this.data.user_info.user_phone,
          order_user_address: address
        },
        success(res) {
          wx.redirectTo({
            url: '../bookSucceed/bookSucceed'
          })
        }
      })
    } else {
      wx.showToast({
        title: '请完善信息',
        duration: 1000,
        icon: "none"
      })
    }
  },

  onLoad: function () {
    // 根据接收到的信息，从数据库中取图片，价格；将取到的数据经过计算，显示出来
    const _this = this
    const eventChannel = this.getOpenerEventChannel()
    eventChannel.on('acceptDataFromChoicesPage', function (data) {
      console.log('onloadData', data.data)
      const modelName = data.data.model_name
      db.collection('pr_models2').where({ model_name: modelName }).get({
        success(res) {
          console.log('根据型号拿数据', res.data)
          const final_price = res.data[0].original_price * (100 + Number(data.data.grade_total)) / 100 // 计算最终价格
          const decrease_price = Number(res.data[0].original_price) * 0.05 // 计算下降趋势数据
          _this.setData({
            model_name: res.data[0].model_name,
            final_price: final_price,
            decrease_price: decrease_price,
            img_url: res.data[0].img_url,
            choices_array: data.data.choicesArray
          })
        }
      })
    })
  },
  onShow: function () {
    // 做2件事情，1. 接收来自上一页的数据；2.显示图片并根据接到的数据算出价格和下降趋势
    var _this = this
    if (_this.data.user_tag) { 
      // _this.data.user_tag用来判定是从choices页转过来的，还是从addAddress页转过来的
      db.collection('pr_userInfo').where({
        _openid: openid,
        user_tag: this.data.user_tag
      }).get({
        success(res) {
          _this.setData({
            user_info: res.data[0],
            show_detail_address: true
          })
        }
      })
    }
  },
  onHide() {
  }
})