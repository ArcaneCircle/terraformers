import { Assets } from "src/asset"
import { CTX } from "src/core/canvas"
import { Upgrade } from "src/upgrade"
import { Skill, ProjectileOwner } from "./skill"

import { cam } from "../cam"
import { addPhysicsComp } from "../components/physics"
import { addRenderComp } from "../components/render"
import { WIDTH, HEIGHT } from "../const"
import { ticker } from "../core/interpolation"
import { aabb, angleToVec } from "../core/math"
import { playShoot } from "../sound"
import { stats } from "../stat"
import { attackMob, isHittingMob, iterMobs } from "../mob"

const SABER_SPEED = 0.09
const SABER_AGE = 3e3
const SABER_CHARGE_TIME = 200

const INIT_SABER_DMG = 20
const SABER_DMG_INC = 10
const SABER_MAX_DMG = 60

const INIT_SABER_FIRE_RATE = 2500
const DEC_SABER_FIRE_RATE = 525
const MIN_SABER_FIRE_RATE = 400

export class ThrowingLightsaber implements Skill {
    enabled = false
    dmg = INIT_SABER_DMG
    fireRate = INIT_SABER_FIRE_RATE
    fireRateTicker = ticker(INIT_SABER_FIRE_RATE)
    sabers = {
        x: [] as number[],
        y: [] as number[],
        // direction vector(angle)
        dirx: [] as number[],
        diry: [] as number[],
        age: [] as number[],
        charge: [] as number[],
        active: [] as boolean[],
    }
    saberFreePool: number[] = []

    unloadPhysics = () => {}
    unloadRender = () => {}

    constructor(private owner: ProjectileOwner) {
        this.owner = owner
    }

    getUpgrades(): Upgrade[] {
        const sprite = "eSaber" as keyof Assets
        const upgrades = []

        if (this.fireRate > MIN_SABER_FIRE_RATE) {
            const apply = () => {
                if (this.enabled) {
                    this.fireRate -= DEC_SABER_FIRE_RATE
                    this.fireRateTicker.interval(this.fireRate)
                }
                this.enabled = true
            }
            const label = this.enabled ? "FASTER THROWS" : "LIGHTSABER"
            upgrades.push({ label, sprite, apply })
        }

        if (this.enabled && this.dmg < SABER_MAX_DMG) {
            const apply = () => (this.dmg += SABER_DMG_INC)
            upgrades.push({ label: "++DMG", sprite, apply })
        }

        return upgrades
    }

    load() {
        this.unloadPhysics = addPhysicsComp((dt: number) => {
            if (this.enabled) {
                // fire saber
                if (this.fireRateTicker.tick(dt)) {
                    const enemy = this.owner.nearestEnemy()
                    if (enemy) {
                        // translate mob pos to owner pos
                        const xpos = enemy.x - this.owner.x
                        const ypos = enemy.y - this.owner.y
                        const dir = Math.atan2(xpos, ypos)
                        const angle = angleToVec(dir)
                        if (this.saberFreePool.length > 0) {
                            const i = this.saberFreePool.pop()!
                            this.sabers.x[i] = this.owner.x
                            this.sabers.y[i] = this.owner.y
                            this.sabers.dirx[i] = angle.x
                            this.sabers.diry[i] = angle.y
                            this.sabers.age[i] = 0
                            this.sabers.charge[i] = 0
                            this.sabers.active[i] = true
                        } else {
                            this.sabers.x.push(this.owner.x)
                            this.sabers.y.push(this.owner.y)
                            this.sabers.dirx.push(angle.x)
                            this.sabers.diry.push(angle.y)
                            this.sabers.age.push(0)
                            this.sabers.charge.push(0)
                            this.sabers.active.push(true)
                        }
                        playShoot()
                    }
                }
                for (let i = 0; i < this.sabers.x.length; i++) {
                    if (this.sabers.active[i]) {
                        this.sabers.x[i] +=
                            this.sabers.dirx[i] * SABER_SPEED * dt
                        this.sabers.y[i] +=
                            this.sabers.diry[i] * SABER_SPEED * dt
                        this.sabers.age[i] += dt
                        this.sabers.charge[i] += dt

                        if (this.sabers.age[i] > SABER_AGE) {
                            this.sabers.active[i] = false
                            this.saberFreePool.push(i)
                        } else if (this.sabers.charge[i] >= SABER_CHARGE_TIME) {
                            this.sabers.charge[i] = 0
                            iterMobs((_mobx, _moby, mobid) => {
                                if (
                                    isHittingMob(
                                        mobid,
                                        this.sabers.x[i],
                                        this.sabers.y[i],
                                        16,
                                        16,
                                    )
                                ) {
                                    attackMob(mobid, this.dmg)
                                    return true
                                }
                            })
                        }
                    }
                }
            }
        })

        this.unloadRender = addRenderComp((ctx: CTX, assets: Assets) => {
            if (this.enabled) {
                // render sabers
                for (let i = 0; i < this.sabers.x.length; i++) {
                    if (this.sabers.active[i]) {
                        const x = this.sabers.x[i] - cam.x
                        const y = this.sabers.y[i] - cam.y
                        // only render if in screen
                        if (aabb(x, y, 16, 16, 0, 0, WIDTH, HEIGHT)) {
                            ctx.save()
                            ctx.translate(x + 8, y + 8)
                            ctx.rotate(stats.time * 20)
                            ctx.translate(-(x + 8), -(y + 8))
                            ctx.drawImage(assets.saber, ~~x, ~~y)
                            ctx.restore()
                        }
                    }
                }
            }
        })
    }

    unload() {
        this.unloadPhysics()
        this.unloadRender()
    }
}
