// config
export const DEBUG = false
export const WIDTH = 320
export const HEIGHT = 180
export const JOYSTICK_SIZE = 30
export const JOYSTICK_THUMB_SIZE = 10

// ui
export const APPNAME = "TERRAFORMERS"
export const FONT_SIZE = 1
export const MENU_FONT_SIZE = 3
export const UI_BAR_WIDTH = WIDTH / 4
export const UI_BAR_HEIGHT = 8
export const UI_TEXT_DURATION = 300
export const UI_BAR_X = ~~((WIDTH - UI_BAR_WIDTH) / 10)
export const UI_BAR_Y = 10
export const UI_TRANSITION_DURATION = 900
export const BLACK0 = "#212123"
export const BLACK1 = "#352b42"
export const GREY = "#868188"
export const WHITE = "#f2f0e5"
export const RED = "#b45252"
export const BLUE = "#4b80ca"
export const BROWN = "#7b7243"
export const DGREEN = "#567b79"
export const DDGREEN = "#4e584a"

// general
export const SPRITE_ANIM_RATE_MS = 200
export const SPAWN_RADIUS = WIDTH / 2
export const COIN_XP = 10
export const COIN_PICKUP_SPEED = 0.16
export const VULNERABILITY_MS = 700

// size of rect inside which mobs are collision tested
export const HERO_MOB_COLLISION_PROXIMITY = WIDTH
// max distance to push away 2 mobs if colliding with each other
export const MOB_MAX_COLLISION_SNAP_DIST = 1

export const MOB0_SPEED = 0.02
export const MOB0_HEALTH = 10
export const MOB0_ATTACK = 10
export const MOB1_SPEED = 0.03
export const MOB1_HEALTH = 30
export const MOB1_ATTACK = 12
export const MOB2_SPEED = 0.04
export const MOB2_HEALTH = 55
export const MOB2_ATTACK = 20
export const MOB3_SPEED = 0.05
export const MOB3_HEALTH = 70
export const MOB3_ATTACK = 30

export const MOB0BOSS_SPEED = 0.03
export const MOB0BOSS_HEALTH = 100
export const MOB0BOSS_ATTACK = MOB0_ATTACK * 2
export const MOB1BOSS_SPEED = 0.04
export const MOB1BOSS_HEALTH = 200
export const MOB1BOSS_ATTACK = MOB1_ATTACK * 2
export const MOB2BOSS_SPEED = 0.05
export const MOB2BOSS_HEALTH = 550
export const MOB2BOSS_ATTACK = MOB2_ATTACK * 2
export const MOB3BOSS_SPEED = 0.07
export const MOB3BOSS_HEALTH = 700
export const MOB3BOSS_ATTACK = MOB3_ATTACK * 2
