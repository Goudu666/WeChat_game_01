// pages/settings/settings.js
Page({
  data: {
    soundEnabled: true,
    musicEnabled: true,
    autoSave: true,
    textSpeed: 1.0
  },

  onLoad() {
    this.loadSettings()
  },

  // 加载设置
  loadSettings() {
    const settings = wx.getStorageSync('gameSettings') || {}
    
    this.setData({
      soundEnabled: settings.soundEnabled !== undefined ? settings.soundEnabled : true,
      musicEnabled: settings.musicEnabled !== undefined ? settings.musicEnabled : true,
      autoSave: settings.autoSave !== undefined ? settings.autoSave : true,
      textSpeed: settings.textSpeed || 1.0
    })
  },

  // 保存设置
  saveSettings() {
    const settings = {
      soundEnabled: this.data.soundEnabled,
      musicEnabled: this.data.musicEnabled,
      autoSave: this.data.autoSave,
      textSpeed: this.data.textSpeed
    }
    
    wx.setStorageSync('gameSettings', settings)
  },

  // 切换音效
  toggleSound(e) {
    this.setData({
      soundEnabled: e.detail.value
    })
    this.saveSettings()
  },

  // 切换音乐
  toggleMusic(e) {
    this.setData({
      musicEnabled: e.detail.value
    })
    this.saveSettings()
  },

  // 切换自动保存
  toggleAutoSave(e) {
    this.setData({
      autoSave: e.detail.value
    })
    this.saveSettings()
  },

  // 改变文字速度
  changeTextSpeed(e) {
    this.setData({
      textSpeed: e.detail.value
    })
    this.saveSettings()
  },

  // 备份游戏数据
  backupGameData() {
    const app = getApp()
    const gameData = app.globalData.gameData
    
    wx.setStorageSync('gameDataBackup', gameData)
    
    wx.showToast({
      title: '游戏数据已备份',
      icon: 'success'
    })
  },

  // 恢复游戏数据
  restoreGameData() {
    wx.showModal({
      title: '确认恢复',
      content: '确定要恢复备份的游戏数据吗？当前数据将被覆盖。',
      success: (res) => {
        if (res.confirm) {
          const backupData = wx.getStorageSync('gameDataBackup')
          
          if (backupData) {
            const app = getApp()
            app.globalData.gameData = backupData
            app.saveGameData()
            
            wx.showToast({
              title: '游戏数据已恢复',
              icon: 'success'
            })
          } else {
            wx.showToast({
              title: '没有找到备份数据',
              icon: 'error'
            })
          }
        }
      }
    })
  },

  // 重置游戏数据
  resetGameData() {
    wx.showModal({
      title: '确认重置',
      content: '确定要重置所有游戏数据吗？此操作不可撤销！',
      success: (res) => {
        if (res.confirm) {
          const app = getApp()
          
          // 清除所有游戏数据
          wx.removeStorageSync('gameData')
          wx.removeStorageSync('gameDataBackup')
          
          // 重新初始化游戏数据
          app.initGameData()
          
          wx.showToast({
            title: '游戏数据已重置',
            icon: 'success'
          })
        }
      }
    })
  }
})