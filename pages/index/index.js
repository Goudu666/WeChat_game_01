// pages/index/index.js
Page({
  data: {
    hasSaveData: false
  },

  onLoad() {
    this.checkSaveData()
  },

  onShow() {
    this.checkSaveData()
  },

  // 检查是否有存档数据
  checkSaveData() {
    const gameData = wx.getStorageSync('gameData')
    this.setData({
      hasSaveData: !!gameData
    })
  },

  // 开始新游戏
  startGame() {
    wx.showModal({
      title: '开始新游戏',
      content: '确定要开始新游戏吗？这将清除当前存档。',
      success: (res) => {
        if (res.confirm) {
          // 清除现有存档
          wx.removeStorageSync('gameData')
          
          // 跳转到游戏页面
          wx.switchTab({
            url: '/pages/game/game'
          })
        }
      }
    })
  },

  // 继续游戏
  continueGame() {
    wx.switchTab({
      url: '/pages/game/game'
    })
  },

  // 打开设置
  openSettings() {
    wx.switchTab({
      url: '/pages/settings/settings'
    })
  }
})