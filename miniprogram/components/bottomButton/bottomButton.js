// components/bottomButton/bottomButton.js
Component({
  properties: {
    btnText: {
      type: String,
      value: '立即提订单'
    },
    isDisabled: {
      type: Boolean,
      value: false
    },
    btnType: {
      type: String
    }
  },
  data: {
  },
  methods: {
    on_tap: function(e){
      console.log('eeeee', e)
      this.triggerEvent('Tap')
    }
  },
  ready(){
    console.log(this.properties.btnType)
  }
})
