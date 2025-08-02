// pages/inventory/inventory.js
Page({
  data: {
    inventory: [],
    filteredInventory: [],
    currentCategory: 'all',
    selectedItem: null
  },

  onLoad() {
    this.loadInventory()
  },

  onShow() {
    this.loadInventory()
  },

  // 加载背包数据
  loadInventory() {
    const app = getApp()
    const inventory = app.globalData.gameData.inventory
    
    this.setData({
      inventory: inventory
    })
    
    this.filterInventory()
  },

  // 切换分类
  switchCategory(e) {
    const category = e.currentTarget.dataset.category
    this.setData({
      currentCategory: category
    })
    this.filterInventory()
  },

  // 过滤物品
  filterInventory() {
    const { inventory, currentCategory } = this.data
    
    if (currentCategory === 'all') {
      this.setData({
        filteredInventory: inventory
      })
    } else {
      const filtered = inventory.filter(item => item.type === currentCategory)
      this.setData({
        filteredInventory: filtered
      })
    }
  },

  // 选择物品
  selectItem(e) {
    const item = e.currentTarget.dataset.item
    this.setData({
      selectedItem: item
    })
  },

  // 关闭物品详情
  closeItemDetail() {
    this.setData({
      selectedItem: null
    })
  },

  // 阻止事件冒泡
  stopPropagation() {
    // 阻止事件冒泡
  },

  // 使用物品
  useItem(e) {
    const item = e.currentTarget.dataset.item
    const app = getApp()
    const character = app.globalData.gameData.character
    
    if (item.type === 'consumable') {
      // 使用消耗品
      if (item.effect) {
        if (item.effect.health) {
          character.health = Math.min(character.maxHealth, character.health + item.effect.health)
          wx.showToast({
            title: `恢复了 ${item.effect.health} 点生命值`,
            icon: 'success'
          })
        }
        
        if (item.effect.mana) {
          character.mana = Math.min(character.maxMana, character.mana + item.effect.mana)
          wx.showToast({
            title: `恢复了 ${item.effect.mana} 点灵力值`,
            icon: 'success'
          })
        }
      }
      
      // 从背包中移除物品
      app.removeFromInventory(item.id)
      this.loadInventory()
      this.closeItemDetail()
    }
  },

  // 装备物品
  equipItem(e) {
    const item = e.currentTarget.dataset.item
    const app = getApp()
    const character = app.globalData.gameData.character
    
    if (item.type === 'weapon') {
      // 卸下当前装备
      if (character.equipment.weapon) {
        app.addToInventory(character.equipment.weapon)
      }
      
      // 装备新武器
      character.equipment.weapon = item
      app.removeFromInventory(item.id)
      
      wx.showToast({
        title: `装备了 ${item.name}`,
        icon: 'success'
      })
      
      this.loadInventory()
      this.closeItemDetail()
    }
  },

  // 丢弃物品
  dropItem(e) {
    const item = e.currentTarget.dataset.item
    
    wx.showModal({
      title: '确认丢弃',
      content: `确定要丢弃 ${item.name} 吗？`,
      success: (res) => {
        if (res.confirm) {
          const app = getApp()
          app.removeFromInventory(item.id)
          this.loadInventory()
          this.closeItemDetail()
          
          wx.showToast({
            title: '物品已丢弃',
            icon: 'success'
          })
        }
      }
    })
  }
})