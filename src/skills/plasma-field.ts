import { Assets } from "src/asset"
import { CTX } from "src/core/canvas"
import { Upgrade } from "src/upgrade"
import { Skill, PositionOwner } from "./skill"

import { cam } from "../cam"
import { addPhysicsComp } from "../components/physics"
import { addRenderComp } from "../components/render"
import { distance, rand, randInt } from "../core/math"
import { ticker } from "../core/interpolation"
import { attackMob, iterMobs, MOB_SIZE } from "../mob"

const INIT_AURA_RADIUS = 30
const INC_AURA_RADIUS = 5
const MAX_AURA_RADIUS = 50

const INIT_AURA_DAMAGE = 10
const INC_AURA_DAMAGE = 5
const MAX_AURA_DAMAGE = 30

const INIT_AURA_DAMAGE_RATE = 900
const DEC_AURA_DAMAGE_RATE = 100
const MIN_AURA_DAMAGE_RATE = 500

const AURA_PARTICLES_AGE = 500
const LGREEN = "#a2dcc7"

export class PlasmaField implements Skill {
    radius = 0
    dmgRateTicker: ReturnType<typeof ticker>
    particles = {
        x: Array(~~MAX_AURA_RADIUS).fill(0),
        y: Array(~~MAX_AURA_RADIUS).fill(0),
        age: Array(~~MAX_AURA_RADIUS).fill(0),
    }
    unloadPhysics = () => {}
    unloadRender = () => {}

    constructor(
        private owner: PositionOwner,
        private dmg = INIT_AURA_DAMAGE,
        private dmgRate = INIT_AURA_DAMAGE_RATE,
    ) {
        this.owner = owner
        this.dmg = dmg
        this.dmgRate = dmgRate
        this.dmgRateTicker = ticker(dmgRate)
    }

    getUpgrades(): Upgrade[] {
        const sprite = "ePlasma" as keyof Assets
        const upgrades = []

        if (this.radius < MAX_AURA_RADIUS) {
            const apply = () => {
                if (this.radius === 0) {
                    this.radius = INIT_AURA_RADIUS
                } else {
                    this.radius += INC_AURA_RADIUS
                }
            }
            const label = this.radius > 0 ? "++PLASMA SIZE" : "PLASMA FIELD"
            upgrades.push({ label, sprite, apply })
        }

        if (this.radius <= 0) return upgrades

        if (this.dmg < MAX_AURA_DAMAGE) {
            const apply = () => {
                this.dmg += INC_AURA_DAMAGE
            }
            upgrades.push({ label: "++PLASMA DMG", sprite, apply })
        }
        if (this.dmgRate > MIN_AURA_DAMAGE_RATE) {
            const apply = () => {
                this.dmgRate -= DEC_AURA_DAMAGE_RATE
                this.dmgRateTicker.interval(this.dmgRate)
            }
            upgrades.push({ label: "++PLASMA PWR", sprite, apply })
        }

        return upgrades
    }

    load() {
        this.unloadPhysics = addPhysicsComp((dt: number) => {
            // aura particles
            for (let i = 0; i < ~~(this.radius / 2); i++) {
                const age = (this.particles.age[i] += dt)
                if (age >= AURA_PARTICLES_AGE) {
                    this.particles.age[i] = randInt(0, AURA_PARTICLES_AGE / 2)
                    const angle = rand(0, 2 * Math.PI)
                    const dist = rand(0, this.radius)
                    this.particles.x[i] = this.owner.x + Math.sin(angle) * dist
                    this.particles.y[i] = this.owner.y + Math.cos(angle) * dist
                }
            }

            // aura damage
            if (this.dmgRateTicker.tick(dt)) {
                iterMobs((mobx, moby, mobid) => {
                    if (
                        distance(
                            this.owner.x,
                            this.owner.y,
                            mobx + MOB_SIZE / 2,
                            moby + MOB_SIZE / 2,
                        ) < this.radius
                    ) {
                        attackMob(mobid, this.dmg)
                    }
                })
            }
        })

        this.unloadRender = addRenderComp((ctx: CTX, assets: Assets) => {
            if (this.radius > 0) {
                ctx.fillStyle = LGREEN + "33"
                ctx.beginPath()
                ctx.arc(
                    this.owner.x + 4 - cam.x,
                    this.owner.y + 4 - cam.y,
                    this.radius,
                    0,
                    Math.PI * 2,
                )
                ctx.fill()

                // particles
                ctx.fillStyle = LGREEN
                for (let i = 0; i < ~~(this.radius / 2); i++) {
                    ctx.fillRect(
                        ~~(this.particles.x[i] - cam.x),
                        ~~(this.particles.y[i] - cam.y),
                        //- (this.particles.age[i] * 0.002),
                        1,
                        1,
                    )
                }
            }
        })
    }

    unload() {
        this.unloadPhysics()
        this.unloadRender()
    }
}
