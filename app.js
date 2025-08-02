// app.js
App({
  onLaunch() {
    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 初始化游戏数据
    this.initGameData()
  },

  globalData: {
    userInfo: null,
    gameData: null,
    character: null,
    inventory: [],
    currentScene: null,
    gameProgress: 0
  },

  // 初始化游戏数据
  initGameData() {
    let gameData = wx.getStorageSync('gameData')
    if (!gameData) {
      gameData = {
        character: {
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
        },
        inventory: [],
        currentScene: 'village',
        gameProgress: 0,
        completedQuests: [],
        activeQuests: []
      }
      wx.setStorageSync('gameData', gameData)
    }
    this.globalData.gameData = gameData
  },

  // 保存游戏数据
  saveGameData() {
    wx.setStorageSync('gameData', this.globalData.gameData)
  },

  // 更新角色属性
  updateCharacter(updates) {
    Object.assign(this.globalData.gameData.character, updates)
    this.saveGameData()
  },

  // 添加物品到背包
  addToInventory(item) {
    this.globalData.gameData.inventory.push(item)
    this.saveGameData()
  },

  // 移除背包物品
  removeFromInventory(itemId) {
    const index = this.globalData.gameData.inventory.findIndex(item => item.id === itemId)
    if (index > -1) {
      this.globalData.gameData.inventory.splice(index, 1)
      this.saveGameData()
    }
  },

  // 更新场景
  updateScene(sceneId) {
    this.globalData.gameData.currentScene = sceneId
    this.saveGameData()
  }
})