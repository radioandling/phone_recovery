const db = wx.cloud.database()
Page({
  data: {
    states: [],
    is_all_choosed: true, // 用来判定是否可以改变按钮状态
    model_name: '',
    original_price: '',
    img_url: ''
  },
  on_choose_state_item(e){
    // 做第一件事件，将下面一项显示出来；思路：找到现在点击的这一项，把下一项的isShow改成true
    let setter = `states[${e.currentTarget.dataset.index + 1}].isShow`
    this.setData({
      [setter]: true
    })
    // 第二件事情，将屏幕焦点放置屏幕中心位置; 点击第一个和第二个的时候不聚焦
    if (e.currentTarget.dataset.index > 0) {
      wx.pageScrollTo({
        selector: `.item-${e.currentTarget.dataset.index}`,
        complete: (res) => {
          console.log('跳转完成')
        },
      }) 
    }
    // 第三件事情， 判断是不是全部选完了，如果全部选完了，那就将按钮回复成可点击的状态
    //   思路：把多选找出来，只要多选的第一项的isShow是true就说明单选已经选完了，就可以打开按钮了
    var multipleArray = this.data.states.filter((item) => {
      return item.type === 'multiple'
    })
    if (multipleArray[0].isShow) {
      this.setData({
        is_all_choosed: false
      })
    } 
  },

  // 做三件事情： 1. 定义切数组函数 ---> 2. 求总分  ---> 3. 判断是否能回收
  on_submit({detail: {value}}){
    var _this = this
      // 做第一件事： 切数组函数，思路： 如果数组中的项是字符串，直接用字符串切割的方法；如果是数组（多选），那就再循环一次，再用字符串切割, 最后用concat将数组进行拼接
      let spiltString = function(string){
        var newGradeItem = Number(string.split(':')[1])
        var newChoicesItem = string.split(':')[0]
        return {
          newChoicesItem: newChoicesItem,
          newGradeItem: newGradeItem
        }
      }
      let doWithArray = function(array){
        var newGradeArray = array.map((item) => {
          return Number(item.split(':')[1])
        })
        var newChoicesArray = array.map((item) => {
          return item.split(':')[0]
        })
        return {
          newGradeArray: newGradeArray,
          newChoicesArray: newChoicesArray
        }
      }
      // 第二件事情：求总分列表和选项列表；gradeArray总分列表，choicesArray选项列表
      var gradeArray = []
      var choicesArray = []
      for (const k in value) {
        if (value.hasOwnProperty(k)) {
          // 如果字符串就切割字符串，如果是数组就再次循环数组
          if (typeof value[k] === 'string') {
            let result = spiltString(value[k])
            gradeArray.push(result.newGradeItem)
            choicesArray.push(result.newChoicesItem)
          } else {
            gradeArray = gradeArray.concat(doWithArray(value[k]).newGradeArray)
            choicesArray = choicesArray.concat(doWithArray(value[k]).newChoicesArray)
          }
        }
      }
      var grade_total = gradeArray.reduce(function(prev, cur){return prev + cur})
      // 第三件事情：判断是否能回收，大于-30分就回收，小于提示不能回收
      grade_total > -30 ? 
      (wx.navigateTo({
        url: `../bookOrder/bookOrder`,
        success(res){
          res.eventChannel.emit('acceptDataFromChoicesPage', { // 发送数据到下一个页面
            data: {
              model_name: _this.data.model_name,
              grade_total: grade_total,
              choicesArray: choicesArray
            }
          })
        }
      }))
      :
      (wx.showToast({
        title: '评分太低，无法回收',
        icon: 'none',
        duration: 2000
      }))

  },
  onLoad: function (options) {
    console.log(options)
    const _this = this
    db.collection('pr_states').get({
      success(res){
        _this.setData({
          states: res.data,
          model_name: options.model_name
        })
      }
    })
  },
  onReady: function () {}
})