const db = wx.cloud.database()
Page({
  data: {
    current: 'phone',
    models: [],
    choosed_type: [],
    choosed_brand: []
  },
  on_choose_type({detail}){
    const type = detail.key
    let choosedType = this.data.models.filter((item) => {
      return item.type === type
    })
    let choosedBrand = choosedType[0].brands[0]
    this.setData({
      current: type,
      choosed_type: choosedType[0],
      choosed_brand: choosedBrand
    });
  },
  on_choose_brand(e){
    // 选品牌的时候改变颜色和字体
    var _this = this
    var i = e.currentTarget.dataset.leftindex
    // i是点击之后拿到的品牌的序列号，根据改变选中的品牌
    _this.data.choosed_type.brands.forEach((item, index) => {
      //先将所有的项目的isActive都设为false
      this.setData({
        [`choosed_type.brands[${index}].isActive`]: false
      })
      if (i === index) {
        _this.setData({
          // 选中品牌时，动态改变isActive为true
          choosed_brand: _this.data.choosed_type.brands[i],
          [`choosed_type.brands[${i}].isActive`]: true
        })
      }
    })
  },
  on_to_choices({currentTarget: {dataset: {model}}}){
    wx.navigateTo({
      url: `../choices/choices?model_name=${model}`,
    })
  },
  onLoad: function (options) {
    // onload时，将model表中的数据拿到页面上来
    let _this = this
    db.collection('pr_models').get({
      success(res){
        let initChoosedType = res.data.filter((item) => {
          return item.type === options.type
        })
        let initChoosedBrand = initChoosedType[0].brands[0]
        _this.setData({
          models: res.data,
          choosed_type: initChoosedType[0],
          choosed_brand: initChoosedBrand,
          current: options.type //将选中的项目进行css切换
        })
      }
    })
  }
})