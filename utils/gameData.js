// 游戏数据管理
const gameData = {
  // 场景数据
  scenes: {
    village: {
      id: 'village',
      name: '青云村',
      description: '一个宁静的小村庄，村民们过着简单的生活。村中有一口古井，传说井水有神奇的功效。',
      background: '/images/scenes/village.jpg',
      options: [
        { text: '探索村庄', action: 'explore_village', nextScene: 'village_explore' },
        { text: '拜访村长', action: 'visit_elder', nextScene: 'elder_house' },
        { text: '查看古井', action: 'check_well', nextScene: 'ancient_well' },
        { text: '离开村庄', action: 'leave_village', nextScene: 'forest_path' }
      ]
    },
    village_explore: {
      id: 'village_explore',
      name: '村庄探索',
      description: '你在村庄中漫步，发现了一些有趣的地方。',
      background: '/images/scenes/village_explore.jpg',
      options: [
        { text: '查看铁匠铺', action: 'visit_blacksmith', nextScene: 'blacksmith' },
        { text: '拜访药铺', action: 'visit_apothecary', nextScene: 'apothecary' },
        { text: '回到村口', action: 'return_village', nextScene: 'village' }
      ]
    },
    ancient_well: {
      id: 'ancient_well',
      name: '古井',
      description: '一口古老的井，井水清澈见底。传说这口井有千年历史，井水中蕴含着微弱的灵气。',
      background: '/images/scenes/well.jpg',
      options: [
        { text: '饮用井水', action: 'drink_water', effect: 'restore_health' },
        { text: '仔细观察', action: 'examine_well', nextScene: 'well_examination' },
        { text: '返回村庄', action: 'return_village', nextScene: 'village' }
      ]
    },
    forest_path: {
      id: 'forest_path',
      name: '林间小径',
      description: '一条通往深山的小径，两旁古木参天，空气中弥漫着淡淡的灵气。',
      background: '/images/scenes/forest.jpg',
      options: [
        { text: '继续前进', action: 'continue_path', nextScene: 'mountain_foot' },
        { text: '探索周围', action: 'explore_forest', nextScene: 'forest_explore' },
        { text: '返回村庄', action: 'return_village', nextScene: 'village' }
      ]
    }
  },

  // 物品数据
  items: {
    wooden_sword: {
      id: 'wooden_sword',
      name: '木剑',
      type: 'weapon',
      description: '一把普通的木剑，虽然简陋但也能防身。',
      attack: 5,
      durability: 100,
      rarity: 'common'
    },
    healing_potion: {
      id: 'healing_potion',
      name: '疗伤药',
      type: 'consumable',
      description: '能够恢复少量生命值的药水。',
      effect: { health: 20 },
      rarity: 'common'
    },
    mana_potion: {
      id: 'mana_potion',
      name: '回灵丹',
      type: 'consumable',
      description: '能够恢复少量灵力的丹药。',
      effect: { mana: 15 },
      rarity: 'common'
    },
    spirit_stone: {
      id: 'spirit_stone',
      name: '灵石',
      type: 'material',
      description: '蕴含着微弱灵气的石头，是修仙者常用的修炼资源。',
      value: 10,
      rarity: 'common'
    }
  },

  // 技能数据
  skills: {
    basic_sword: {
      id: 'basic_sword',
      name: '基础剑法',
      description: '最基础的剑法招式，虽然简单但实用。',
      type: 'combat',
      damage: 10,
      manaCost: 5,
      level: 1
    },
    qi_gathering: {
      id: 'qi_gathering',
      name: '聚气术',
      description: '修炼者基础功法，能够吸收天地灵气。',
      type: 'cultivation',
      effect: { experience: 5 },
      manaCost: 10,
      level: 1
    },
    healing_touch: {
      id: 'healing_touch',
      name: '治愈之手',
      description: '运用灵力治疗伤势的基础法术。',
      type: 'healing',
      effect: { health: 15 },
      manaCost: 8,
      level: 1
    }
  },

  // 任务数据
  quests: {
    first_steps: {
      id: 'first_steps',
      name: '初入修仙',
      description: '作为初入修仙界的修士，你需要了解基本的知识。',
      objectives: [
        { id: 'explore_village', description: '探索村庄', completed: false },
        { id: 'drink_well_water', description: '饮用古井水', completed: false }
      ],
      rewards: {
        experience: 50,
        items: ['healing_potion']
      },
      status: 'active'
    }
  },

  // 修炼境界
  cultivation_levels: [
    '练气期',
    '筑基期',
    '金丹期',
    '元婴期',
    '化神期',
    '炼虚期',
    '合体期',
    '大乘期'
  ]
}

// 游戏事件处理器
const gameEvents = {
  // 处理场景转换
  handleSceneTransition(sceneId, action) {
    const scene = gameData.scenes[sceneId]
    if (!scene) return null

    const option = scene.options.find(opt => opt.action === action)
    if (!option) return scene

    // 处理特殊效果
    if (option.effect) {
      this.handleEffect(option.effect)
    }

    // 返回下一个场景
    if (option.nextScene) {
      return gameData.scenes[option.nextScene]
    }

    return scene
  },

  // 处理效果
  handleEffect(effectType) {
    const app = getApp()
    const character = app.globalData.gameData.character

    switch (effectType) {
      case 'restore_health':
        character.health = Math.min(character.maxHealth, character.health + 20)
        break
      case 'gain_experience':
        character.experience += 10
        this.checkLevelUp(character)
        break
    }

    app.saveGameData()
  },

  // 检查升级
  checkLevelUp(character) {
    if (character.experience >= character.maxExperience) {
      character.level++
      character.experience -= character.maxExperience
      character.maxExperience = Math.floor(character.maxExperience * 1.2)
      character.maxHealth += 10
      character.maxMana += 5
      character.health = character.maxHealth
      character.mana = character.maxMana
      
      // 升级提示
      wx.showToast({
        title: `恭喜升级！当前等级：${character.level}`,
        icon: 'success',
        duration: 2000
      })
    }
  },

  // 战斗系统
  handleCombat(enemy) {
    const app = getApp()
    const character = app.globalData.gameData.character
    
    // 简单的战斗逻辑
    const playerDamage = character.strength + (character.equipment.weapon ? character.equipment.weapon.attack : 0)
    const enemyDamage = enemy.attack
    
    enemy.health -= playerDamage
    character.health -= enemyDamage
    
    if (character.health <= 0) {
      // 玩家死亡
      character.health = 1
      wx.showToast({
        title: '你被打败了！',
        icon: 'error',
        duration: 2000
      })
    }
    
    if (enemy.health <= 0) {
      // 敌人死亡
      character.experience += enemy.experience
      this.checkLevelUp(character)
      
      // 掉落物品
      if (enemy.drops) {
        enemy.drops.forEach(itemId => {
          app.addToInventory(gameData.items[itemId])
        })
      }
      
      wx.showToast({
        title: '战斗胜利！',
        icon: 'success',
        duration: 2000
      })
    }
    
    app.saveGameData()
  }
}

module.exports = {
  gameData,
  gameEvents
}