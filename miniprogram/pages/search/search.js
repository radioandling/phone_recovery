const db = wx.cloud.database()
Page({
  data: {
    hide_result: true,
    search_input: '',
    models_list: [],
    result_list: [],
    hot_list: ['iPhone 6S', 'iPhone 8', 'iPhone 8S Plus', 'iPhone X', 'iPhone XR','iPhone 11', 'iPhone 11 Pro Max', '华为 P40', '华为 Mate20', '华为 Mate30 Pro', '小米 8', '小米 10 Pro']
  },
  on_search_models({detail: {value}}){
    var _this = this
    var searchModel = function (value) { // 根据输入值进行搜索的函数
      const resultAry = _this.data.models_list.filter(function (item) {
        return item.indexOf(value) >= 0
      })
      return resultAry
    }
    setTimeout(function () { // 200毫秒执行一次，节省性能
      _this.setData({
        result_list: searchModel(value),
        search_input: value
      })
    }, 200)
  },
  on_clear_input(){
    this.setData({
      search_input: '',
      result_list: []
    })
  },
  on_to_choices({currentTarget:{dataset:{model}}}){
    console.log(model)
    wx.navigateTo({
      url: `../choices/choices?model_name=${model}`
    })
  },
  onLoad: function (options) {
    // 把所有的model从数据库中拿到, 并设置models_list
    const _this = this
    db.collection('pr_models2').get({
      success(res){
        const models_list = res.data.map(function (item) {
          return item.model_name
        })
        _this.setData({
          models_list: models_list
        })
      }
    })
  }
  
})