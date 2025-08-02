// pages/character/character.js
Page({
  data: {
    character: {}
  },

  onLoad() {
    this.loadCharacterData()
  },

  onShow() {
    this.loadCharacterData()
  },

  // 加载角色数据
  loadCharacterData() {
    const app = getApp()
    const character = app.globalData.gameData.character
    
    this.setData({
      character: character
    })
  },

  // 修改姓名
  changeName() {
    wx.showModal({
      title: '修改姓名',
      content: '请输入新的角色姓名',
      editable: true,
      placeholderText: '请输入姓名',
      success: (res) => {
        if (res.confirm && res.content) {
          const app = getApp()
          app.updateCharacter({
            name: res.content
          })
          this.loadCharacterData()
          
          wx.showToast({
            title: '姓名修改成功',
            icon: 'success'
          })
        }
      }
    })
  },

  // 重置角色
  resetCharacter() {
    wx.showModal({
      title: '确认重置',
      content: '确定要重置角色数据吗？这将清除所有进度！',
      success: (res) => {
        if (res.confirm) {
          const app = getApp()
          
          // 重置角色数据
          app.globalData.gameData.character = {
            name: '无名修士',
            level: 1,
            experience: 0,
            maxExperience: 100,
            health: 100,
            maxHealth: 100,
            mana: 50,
            maxMana: 50,
            strength: 10,
            agility: 10,
            intelligence: 10,
            cultivation: '练气期',
            skills: [],
            equipment: {
              weapon: null,
              armor: null,
              accessory: null
            }
          }
          
          // 重置背包
          app.globalData.gameData.inventory = []
          
          // 重置场景
          app.globalData.gameData.currentScene = 'village'
          
          // 重置任务
          app.globalData.gameData.activeQuests = []
          app.globalData.gameData.completedQuests = []
          
          app.saveGameData()
          this.loadCharacterData()
          
          wx.showToast({
            title: '角色重置成功',
            icon: 'success'
          })
        }
      }
    })
  }
})