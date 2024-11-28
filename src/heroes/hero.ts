import { Skill } from "src/skills/skill"
import { Upgrade } from "src/upgrade"
import { Assets } from "src/asset"

import { cam } from "../cam"
import { addPhysicsComp } from "../components/physics"
import { addRenderComp } from "../components/render"
import {
    HEIGHT,
    HERO_MOB_COLLISION_PROXIMITY,
    VULNERABILITY_MS,
    SPRITE_ANIM_RATE_MS,
    WIDTH,
    WHITE,
    RED,
    BLACK0,
    DEBUG,
} from "../const"
import { aabb } from "../core/math"
import { endGame, prepareDeathScene } from "../scene"
import { playHit, playHurt } from "../sound"
import { stats } from "../stat"
import { ticker } from "../core/interpolation"
import { powerupMenu } from "../scene"
import { playPowerup } from "../sound"
import { nearestMobPos } from "../mob"

const INIT_HEALTH_CAP = 100
const INIT_HERO_SPEED = 0.04
const INIT_PICKUP_RADIUS = 15
const INIT_LIGHT_RADIUS = 50
const INIT_LEVEL_XP = 50
const LEVEL_XP_CAP_INC = 70

const COLLISION_BOX_SIZE = 8
const COLLISION_RADIUS = COLLISION_BOX_SIZE / 2

export const enum State {
    idle,
    moving,
    dead,
}

export abstract class Hero {
    x = WIDTH / 2
    y = HEIGHT / 2
    state = State.idle
    pendingDamage = 0
    flipped = false
    invulnerable = false

    currentFrame = 0
    maxFrames: number

    vulnerability = ticker(VULNERABILITY_MS)
    frameChange = ticker(SPRITE_ANIM_RATE_MS)
    deathAnim = ticker(5e3)
    ms200 = ticker(200)
    s3000 = ticker(3e3)

    skills = [] as Skill[]
    unloadPhysics = () => {}
    unloadRender = () => {}

    constructor(
        private sprite: keyof Assets,
        private frames: { [key in State]: number[] },
        public health = INIT_HEALTH_CAP,
        public maxHealth = INIT_HEALTH_CAP,
        public xp = 0,
        public levelXp = INIT_LEVEL_XP,
        public speed = INIT_HERO_SPEED,
        public lightRadius = INIT_LIGHT_RADIUS,
        public pickupRadius = INIT_PICKUP_RADIUS,
    ) {
        this.health = health
        this.maxHealth = maxHealth
        this.xp = xp
        this.levelXp = levelXp
        this.speed = speed
        this.lightRadius = lightRadius
        this.pickupRadius = pickupRadius
        this.sprite = sprite
        this.frames = frames
        this.maxFrames = frames[State.idle].length
    }

    increaseXp(xp: number): boolean {
        this.xp += xp
        if (this.xp >= this.levelXp) {
            this.xp -= this.levelXp
            this.levelXp += LEVEL_XP_CAP_INC
            powerupMenu()
            playPowerup()
        }
        return false
    }

    makeInvulnerable() {
        this.invulnerable = true
        this.vulnerability.reset()
    }

    hitHero(amt: number) {
        if (!this.invulnerable) {
            this.pendingDamage += amt
            this.makeInvulnerable()
            playHurt()
        }
    }

    nearestEnemy() {
        return nearestMobPos(
            this.x,
            this.y,
            Math.max(this.lightRadius, stats.lightRadius),
        )
    }

    isHittingHero(x: number, y: number, w: number, h: number) {
        return aabb(
            this.x - COLLISION_RADIUS,
            this.y - COLLISION_RADIUS,
            COLLISION_BOX_SIZE,
            COLLISION_BOX_SIZE,
            x,
            y,
            w,
            h,
        )
    }

    isNearHero(x: number, y: number, w: number, h: number) {
        return aabb(
            this.x - HERO_MOB_COLLISION_PROXIMITY / 2,
            this.y - HERO_MOB_COLLISION_PROXIMITY / 2,
            HERO_MOB_COLLISION_PROXIMITY,
            HERO_MOB_COLLISION_PROXIMITY,
            x,
            y,
            w,
            h,
        )
    }

    unloadSkills() {
        this.skills.forEach((skill) => skill.unload())
    }

    load() {
        this.skills.forEach((skill) => skill.load())

        this.unloadPhysics = addPhysicsComp((dt, keys) => {
            if (this.state === State.dead) {
                if (this.deathAnim.tick(dt)) {
                    endGame()
                }
                this.ms200.tick(dt)
                this.s3000.tick(dt)
                return
            }
            // movement
            this.x += keys.dir.x * this.speed * dt
            this.y += keys.dir.y * this.speed * dt
            if (keys.dir.x === 0 && keys.dir.y === 0) {
                this.state = State.idle
            } else {
                this.state = State.moving
                if (keys.dir.x !== 0) {
                    this.flipped = keys.dir.x < 0
                }
            }

            // vulnerability
            if (this.invulnerable) {
                this.invulnerable = !this.vulnerability.tick(dt)
            }
            // reduce health and check if dead
            if (this.pendingDamage > 0) {
                this.health -= 1
                this.pendingDamage -= 1
                if (this.health <= 0) {
                    prepareDeathScene()
                    this.state = State.dead
                }
            }

            // animation frame
            if (this.frameChange.tick(dt)) {
                this.currentFrame = (this.currentFrame + 1) % this.maxFrames
            }
        })

        this.unloadRender = addRenderComp((ctx, assets) => {
            // blink if invulnerable
            if (
                this.invulnerable &&
                this.vulnerability.ticks % 10 === 0 &&
                this.state !== State.dead
            ) {
                return
            }
            const dirOffset = this.flipped ? 5 : 0
            const frame = (assets[this.sprite] as HTMLCanvasElement[])[
                this.frames[this.state][this.currentFrame] + dirOffset
            ]
            if (this.state !== State.dead) {
                ctx.drawImage(
                    frame,
                    ~~(this.x - COLLISION_BOX_SIZE - cam.x),
                    ~~(this.y - COLLISION_BOX_SIZE - cam.y),
                )
            } else {
                const time = this.deathAnim.ticks
                // do nothing
                if (time < 1e3) {
                    ctx.drawImage(
                        frame,
                        ~~(this.x - COLLISION_BOX_SIZE - cam.x),
                        ~~(this.y - COLLISION_BOX_SIZE - cam.y),
                    )
                    // death anim
                } else if (time < 3e3) {
                    ctx.drawImage(
                        frame,
                        ~~(this.x - COLLISION_BOX_SIZE - cam.x),
                        ~~(this.y - COLLISION_BOX_SIZE - cam.y),
                    )
                    const lerp = this.ms200.ticks / 200
                    ctx.strokeStyle = WHITE
                    ctx.beginPath()
                    ctx.arc(
                        this.x - cam.x,
                        this.y - cam.y,
                        lerp * 20,
                        0,
                        Math.PI * 2,
                    )
                    if (lerp === 0) {
                        playHit()
                    }
                    ctx.stroke()
                    // do nothing
                } else {
                    if (this.s3000.ticks === 0) {
                        playHurt()
                    }
                }
            }

            /*
            if (DEBUG) {
                // center
                ctx.strokeStyle = RED
                ctx.strokeRect(this.x - cam.x, this.y - cam.y, 1, 1)
                // collision radius
                ctx.strokeStyle = BLACK0
                ctx.strokeRect(
                    this.x - COLLISION_RADIUS - cam.x,
                    this.y - COLLISION_RADIUS - cam.y,
                    COLLISION_BOX_SIZE,
                    COLLISION_BOX_SIZE,
                )
                // rect used for checking hero proximity(for collisions)
                ctx.strokeRect(
                    this.x - HERO_MOB_COLLISION_PROXIMITY / 2 - cam.x,
                    this.y - HERO_MOB_COLLISION_PROXIMITY / 2 - cam.y,
                    HERO_MOB_COLLISION_PROXIMITY,
                    HERO_MOB_COLLISION_PROXIMITY,
                )
                // pickup radius
                ctx.beginPath()
                ctx.arc(
                    this.x - cam.x,
                    this.y - cam.y,
                    this.pickupRadius,
                    0,
                    Math.PI * 2,
                )
                ctx.stroke()
            }
            */
        })
    }

    unload() {
        this.unloadSkills()
        this.unloadPhysics()
        this.unloadRender()
    }

    abstract getUpgrades(): Upgrade[]
}
