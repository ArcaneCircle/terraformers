import { Assets } from "src/asset"
import { CTX } from "src/core/canvas"
import { Upgrade } from "src/upgrade"
import { Skill, ProjectileOwner } from "./skill"

import { cam } from "../cam"
import { addPhysicsComp } from "../components/physics"
import { addRenderComp } from "../components/render"
import { ticker } from "../core/interpolation"
import { angleToVec } from "../core/math"
import { playShoot } from "../sound"
import { attackMob, isHittingMob, iterMobs } from "../mob"

const INIT_BULLET_FIRE_RATE = 2500
const BULLET_FIRE_RATE_DEC = 600
const MIN_BULLET_FIRE_RATE = 100

const INIT_BULLET_DMG = 10
const BULLET_DMG_INC = 20
const MAX_BULLET_DMG = 90

const BULLET_SPEED = 0.2
const BULLET_AGE = 3e3
const SIZE = 8

export class LaserGun implements Skill {
    enabled = false
    dmg = INIT_BULLET_DMG
    fireRate = INIT_BULLET_FIRE_RATE
    fireRateTicker = ticker(INIT_BULLET_FIRE_RATE)
    bulletFreePool: number[] = []
    bullets = {
        x: [] as number[],
        y: [] as number[],
        // direction vector(angle)
        dirx: [] as number[],
        diry: [] as number[],
        age: [] as number[],
        active: [] as boolean[],
    }

    unloadPhysics: () => void
    unloadRender: () => void

    owner: ProjectileOwner

    constructor(owner: ProjectileOwner) {
        this.owner = owner
    }

    upgradeFireRate() {
        this.fireRate -= BULLET_FIRE_RATE_DEC
        this.fireRateTicker.interval(this.fireRate)
    }

    getUpgrades(): Upgrade[] {
        const sprite = "eBullet"
        const upgrades = []

        if (this.fireRate > MIN_BULLET_FIRE_RATE) {
            const apply = () => {
                if (this.enabled) {
                    this.upgradeFireRate()
                }
                this.enabled = true
            }
            const label = this.enabled ? "SHOOT FASTER" : "LASER GUN"
            upgrades.push({ label, sprite, apply })
        }

        if (this.enabled && this.dmg < MAX_BULLET_DMG) {
            const apply = () => (this.dmg += BULLET_DMG_INC)
            upgrades.push({ label: "++BULLET DMG", sprite, apply })
        }

        return upgrades
    }

    load() {
        this.unloadPhysics = addPhysicsComp((dt: number) => {
            if (this.enabled) {
                // fire bullets
                if (this.fireRateTicker.tick(dt)) {
                    const enemy = this.owner.nearestEnemy()
                    if (enemy) {
                        // translate mob pos to owner pos
                        const xpos = enemy.x - this.owner.x
                        const ypos = enemy.y - this.owner.y
                        const angle = Math.atan2(xpos, ypos)
                        this.fireBullet(this.owner.x, this.owner.y, angle)
                        playShoot()
                    }
                }

                this.iterBullets((_x, _y, dirx, diry, id) => {
                    // update existing bullets
                    this.bullets.x[id] += dirx * BULLET_SPEED * dt
                    this.bullets.y[id] += diry * BULLET_SPEED * dt
                    this.bullets.age[id] += dt

                    if (this.bullets.age[id] > BULLET_AGE) {
                        this.removeBullet(id)
                        return
                    }

                    // check for impact
                    iterMobs((_mobx, _moby, mobid) => {
                        if (
                            isHittingMob(
                                mobid,
                                this.bullets.x[id],
                                this.bullets.y[id],
                                SIZE,
                                SIZE,
                            )
                        ) {
                            attackMob(mobid, this.dmg)
                            this.removeBullet(id)
                            return true
                        }
                    })
                })
            }
        })

        this.unloadRender = addRenderComp((ctx: CTX, assets: Assets) => {
            if (this.enabled) {
                // render bullets
                this.iterBullets((x, y, _dirx, _diry, _id) => {
                    ctx.drawImage(
                        assets.bullet,
                        ~~(x - cam.x),
                        ~~(y - cam.y),
                        SIZE,
                        SIZE,
                    )
                })
            }
        })
    }

    unload() {
        this.unloadPhysics()
        this.unloadRender()
    }

    iterBullets(
        fn: (
            x: number,
            y: number,
            dirx: number,
            diry: number,
            id: number,
        ) => boolean | void,
    ) {
        for (let i = 0; i < this.bullets.x.length; i++) {
            if (this.bullets.active[i]) {
                const end = fn(
                    this.bullets.x[i],
                    this.bullets.y[i],
                    this.bullets.dirx[i],
                    this.bullets.diry[i],
                    i,
                )
                if (end) {
                    break
                }
            }
        }
    }

    fireBullet(x: number, y: number, dir: number) {
        const angle = angleToVec(dir)
        if (this.bulletFreePool.length > 0) {
            const i = this.bulletFreePool.pop()!
            this.bullets.x[i] = x
            this.bullets.y[i] = y
            this.bullets.dirx[i] = angle.x
            this.bullets.diry[i] = angle.y
            this.bullets.age[i] = 0
            this.bullets.active[i] = true
        } else {
            this.bullets.x.push(x)
            this.bullets.y.push(y)
            this.bullets.dirx.push(angle.x)
            this.bullets.diry.push(angle.y)
            this.bullets.age.push(0)
            this.bullets.active.push(true)
        }
    }

    removeBullet(i: number) {
        this.bullets.active[i] = false
        this.bulletFreePool.push(i)
    }
}
