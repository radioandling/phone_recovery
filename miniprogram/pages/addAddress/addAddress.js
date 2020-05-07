const db = wx.cloud.database()
const app = getApp()
const openid = app.globalData.openid
Page({
  data: {
    show_region: false,
    show_delete_btn: false,
    user_region: ['广东省', '深圳市', '南山区'],
    user_detail_address: '',
    user_name: '',
    user_phone: '',
    user_default: false,
    user_tag: undefined // 如果有值，保存信息的时候说明是更新地址信息；没有值说明是新建地址信息
  },
  on_choose_region({detail: {value}}) {
    this.setData({
      show_region: true,
      user_region: value
    })
  },
  on_add_detail({detail: {value}}) {
    this.setData({
      user_detail_address: value
    })
  },
  on_add_name({ detail: { value } }) {
    this.setData({
      user_name: value
    })
  },
  on_test_phone({detail: {value}}) {
    // 正则判定电话格式是否合格
    var pubPhoneReg = /^0[1-9]\d{1,2}[\-\/\~]?[1-9]\d{6,7}$/ // 手机号码正则
    var priPhoneReg = /^1[345789]\d{9}/ // 座机正则
    var condition = priPhoneReg.test(value) || pubPhoneReg.test(value)
    condition ?
      this.setData({
        user_phone: value
      }) :
      wx.showToast({
        title: '请输入正确的电话号码',
        duration: 1000,
        icon: 'none'
      })
  },
  on_set_default({ detail: { value } }) {
    var _this = this
    // 如果现在的user_default是假值，要设置为真，那就要去数据库中找有没有默认的地址；有的话就要把那个默认地址取消
    if (!_this.data.user_default) {
      db.collection('pr_userInfo').where({
        _openid: openid
      }).get({
        success: function (res) {
          var findDefault = function(data){  // 获取user_default为真的user_tag用来更新
            let tag = undefined
            for(let i=0; i<data.length; i++){
              if (data[i].user_default) {
                tag = data[i].user_tag
              }
            }
            return tag
          }
          var default_tag = findDefault(res.data)
          db.collection('pr_userInfo').where({
            _openid: openid,
            user_tag: default_tag
          }).update({
            data:{
              user_default: false
            },
            success(res){
              _this.setData({
                user_default: true
              })
            }
          })
        }
      })
    } else {
      _this.setData({
        user_default: false
      })
    }
  },
  on_save_user_info({ detail: { value } }) {
    // 做两件事情，1.检查是否输入完整，2.上传信息到数据库
    const _this = this
    let condition = false
    for (const k in value) {
      condition = value[k].length > 0 ? true : false
    }
    if (condition) {
      // 资料填写完整，判断是新建地址还是更新地址
      if (_this.data.user_tag) { // 更新地址信息
        db.collection('pr_userInfo').where({
          _openid: openid,
          user_tag: _this.data.user_tag
        }).update({
          data: {
            user_name: _this.data.user_name,
            user_phone: _this.data.user_phone,
            user_region: _this.data.user_region,
            user_detail_address: _this.data.user_detail_address,
            user_default: _this.data.user_default
          },
          success(res) {
            console.log('地址信息更新完成', res)
            wx.navigateTo({
              url: '../addressChoose/addressChoose'
            })
          }
        })
      } else { // 新建地址信息
        var tag = Math.floor(Math.random() * 1000000)
        db.collection('pr_userInfo').add({
          data: {
            user_name: _this.data.user_name,
            user_phone: _this.data.user_phone,
            user_region: _this.data.user_region,
            user_detail_address: _this.data.user_detail_address,
            user_default: _this.data.user_default,
            user_tag: tag,
            user_show_phone: true
          },
          success(res) {
            console.log('地址信息新建完成', res)
            wx.navigateTo({
              url: '../addressChoose/addressChoose'
            })
          }
        })
      }

    } else {
      wx.showToast({
        title: '请完善地址信息',
        icon: 'none',
        duration: 1000
      })
    }
  },
  on_delete_address_item() {
    // 根据对应的tag和openid把对应的地址找出来并删除，然后跳转到addressChoose页面
    var _this = this
    wx.showModal({
      title: "确定删除该地址？",
      success(res){
        if (res.confirm) {
          db.collection('pr_userInfo').where({
            _openid: openid,
            user_tag: _this.data.user_tag
          }).remove({
            success: () => {
              wx.navigateTo({
                url: '../addressChoose/addressChoose'
              })
            }
          })
        } else if (res.cancle) {
          return
        }
      }
    })
    
  },
  onLoad: function (options) {
    console.log(options)
    const _this = this
    // options.showDelete判断是哪个按钮转到这个页面来的
    // 编辑按钮转过来的 ---> 做两件事，1.显示删除地址按钮 2.显示对应地址的信息
    if (options.showDelete) {
      // 根据openID和tag从数据库中取数据出来
      db.collection('pr_userInfo').where({
        _openid: openid,
        user_tag: Number(options.tag)
      }).get({
        success(res) {
          var data = res.data[0]
          _this.setData({
            user_name: data.user_name,
            user_region: data.user_region,
            user_detail_address: data.user_detail_address,
            user_phone: data.user_phone,
            user_default: data.user_default,
            user_tag: data.user_tag,
            show_region: true,
            show_delete_btn: true
          })
        }
      })
    }



  },
  onShow: function () { }
})