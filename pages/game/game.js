// pages/game/game.js
const { gameData, gameEvents } = require('../../utils/gameData.js')

Page({
  data: {
    character: {},
    currentScene: {},
    messages: []
  },

  onLoad() {
    this.initGame()
  },

  onShow() {
    this.updateGameData()
  },

  // 初始化游戏
  initGame() {
    const app = getApp()
    const gameData = app.globalData.gameData
    
    // 设置初始场景
    let currentSceneId = gameData.currentScene || 'village'
    let currentScene = gameData.scenes[currentSceneId]
    
    if (!currentScene) {
      currentScene = gameData.scenes.village
      currentSceneId = 'village'
    }

    this.setData({
      character: gameData.character,
      currentScene: currentScene
    })

    // 添加欢迎消息
    this.addMessage('欢迎来到修仙世界！')
  },

  // 更新游戏数据
  updateGameData() {
    const app = getApp()
    const gameData = app.globalData.gameData
    
    this.setData({
      character: gameData.character,
      currentScene: gameData.scenes[gameData.currentScene]
    })
  },

  // 选择游戏选项
  selectOption(e) {
    const action = e.currentTarget.dataset.action
    const app = getApp()
    
    // 处理场景转换
    const newScene = gameEvents.handleSceneTransition(this.data.currentScene.id, action)
    
    if (newScene && newScene.id !== this.data.currentScene.id) {
      // 更新场景
      app.updateScene(newScene.id)
      this.setData({
        currentScene: newScene
      })
      
      // 添加场景转换消息
      this.addMessage(`你来到了${newScene.name}`)
      
      // 检查任务进度
      this.checkQuestProgress(action)
    } else {
      // 处理特殊效果
      this.handleSpecialAction(action)
    }
  },

  // 处理特殊动作
  handleSpecialAction(action) {
    const app = getApp()
    const character = app.globalData.gameData.character
    
    switch (action) {
      case 'drink_water':
        character.health = Math.min(character.maxHealth, character.health + 20)
        this.addMessage('你饮用了古井水，感觉精神焕发！')
        break
      case 'cultivate':
        character.experience += 10
        character.mana = Math.min(character.maxMana, character.mana + 5)
        this.addMessage('你开始修炼，获得了些许经验。')
        break
      case 'rest':
        character.health = character.maxHealth
        character.mana = character.maxMana
        this.addMessage('你休息了一会儿，恢复了所有状态。')
        break
    }
    
    app.saveGameData()
    this.updateGameData()
  },

  // 检查任务进度
  checkQuestProgress(action) {
    const app = getApp()
    const gameData = app.globalData.gameData
    
    // 检查活跃任务
    gameData.activeQuests.forEach(quest => {
      quest.objectives.forEach(objective => {
        if (objective.id === action && !objective.completed) {
          objective.completed = true
          this.addMessage(`任务进度：${objective.description} 完成！`)
          
          // 检查任务是否完成
          if (quest.objectives.every(obj => obj.completed)) {
            this.completeQuest(quest)
          }
        }
      })
    })
  },

  // 完成任务
  completeQuest(quest) {
    const app = getApp()
    const character = app.globalData.gameData.character
    
    // 给予奖励
    if (quest.rewards.experience) {
      character.experience += quest.rewards.experience
    }
    
    if (quest.rewards.items) {
      quest.rewards.items.forEach(itemId => {
        app.addToInventory(gameData.items[itemId])
      })
    }
    
    // 移动任务到已完成列表
    const activeIndex = app.globalData.gameData.activeQuests.findIndex(q => q.id === quest.id)
    if (activeIndex > -1) {
      app.globalData.gameData.activeQuests.splice(activeIndex, 1)
      app.globalData.gameData.completedQuests.push(quest)
    }
    
    this.addMessage(`任务完成：${quest.name}！`)
    app.saveGameData()
    this.updateGameData()
  },

  // 添加消息
  addMessage(message) {
    const messages = this.data.messages
    messages.push(message)
    
    // 限制消息数量
    if (messages.length > 5) {
      messages.shift()
    }
    
    this.setData({ messages })
    
    // 3秒后清除消息
    setTimeout(() => {
      const currentMessages = this.data.messages
      const index = currentMessages.indexOf(message)
      if (index > -1) {
        currentMessages.splice(index, 1)
        this.setData({ messages: currentMessages })
      }
    }, 3000)
  },

  // 显示背包
  showInventory() {
    wx.navigateTo({
      url: '/pages/inventory/inventory'
    })
  },

  // 显示角色信息
  showCharacter() {
    wx.navigateTo({
      url: '/pages/character/character'
    })
  },

  // 显示技能
  showSkills() {
    wx.showModal({
      title: '技能列表',
      content: '技能系统正在开发中...',
      showCancel: false
    })
  },

  // 显示任务
  showQuests() {
    const app = getApp()
    const activeQuests = app.globalData.gameData.activeQuests
    
    if (activeQuests.length === 0) {
      wx.showToast({
        title: '暂无活跃任务',
        icon: 'none'
      })
    } else {
      let content = '当前任务：\n'
      activeQuests.forEach(quest => {
        content += `\n${quest.name}：\n`
        quest.objectives.forEach(obj => {
          content += `${obj.completed ? '✓' : '○'} ${obj.description}\n`
        })
      })
      
      wx.showModal({
        title: '任务列表',
        content: content,
        showCancel: false
      })
    }
  }
})