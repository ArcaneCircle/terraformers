import { Assets } from "src/asset"
import { CTX } from "src/core/canvas"
import { Upgrade } from "src/upgrade"
import { Skill, PositionOwner } from "./skill"

import { cam } from "../cam"
import { addPhysicsComp } from "../components/physics"
import { addRenderComp } from "../components/render"
import { stats } from "../stat"
import { attackMob, isHittingMob, iterMobs } from "../mob"

const SIZE = 8
const MAX_ORBS_NUM = 7
const ORB_CHARGE_TIME = 200
const ORB_SPIN_SPEED = 4

const INIT_ORBS_RADIUS = 20
const INC_ORBS_RADIUS = 5
const MAX_ORBS_RADIUS = 40

const INIT_ORBS_DMG = 10
const INC_ORBS_DMG = 10
const MAX_ORBS_DMG = 50

interface OrbsOwner extends PositionOwner {
    lightRadius: number
}

export class PlasmaOrbs implements Skill {
    count = 0
    radius = INIT_ORBS_RADIUS
    orbsDmg = INIT_ORBS_DMG
    orbs = {
        x: Array(MAX_ORBS_NUM).fill(0),
        y: Array(MAX_ORBS_NUM).fill(0),
        charge: Array(MAX_ORBS_NUM).fill(0),
    }

    unloadPhysics: () => void
    unloadRender: () => void

    owner: PositionOwner

    constructor(owner: PositionOwner) {
        this.owner = owner
    }

    getUpgrades(): Upgrade[] {
        const sprite = "eOrbs"
        const upgrades = []
        if (this.count < MAX_ORBS_NUM) {
            const apply = () => {
                this.count += 1
                this.owner.lightRadius += 3
            }
            const label = this.count > 0 ? "+1 ORB" : "LASER ORB"
            upgrades.push({ label, sprite, apply })
        }

        if (this.count <= 0) return upgrades

        if (this.radius < MAX_ORBS_RADIUS) {
            const apply = () => {
                this.radius += INC_ORBS_RADIUS
                this.owner.lightRadius += 5
            }
            upgrades.push({ label: "LARGER SIZE", sprite, apply })
        }
        if (this.orbsDmg < MAX_ORBS_DMG) {
            const apply = () => (this.orbsDmg += INC_ORBS_DMG)
            upgrades.push({ label: "ORB ++DMG", sprite, apply })
        }

        return upgrades
    }

    load() {
        this.unloadPhysics = addPhysicsComp((dt: number) => {
            for (let i = 0; i < this.count; i++) {
                const angle =
                    (i / this.count) * 2 * Math.PI - stats.time * ORB_SPIN_SPEED
                this.orbs.x[i] =
                    this.owner.x + 4 + Math.sin(angle) * this.radius
                this.orbs.y[i] =
                    this.owner.y + 4 + Math.cos(angle) * this.radius
                this.orbs.charge[i] += dt
                if (this.orbs.charge[i] >= ORB_CHARGE_TIME) {
                    this.orbs.charge[i] = 0
                    iterMobs((_mobx, _moby, mobid) => {
                        if (
                            isHittingMob(
                                mobid,
                                this.orbs.x[i] - 4,
                                this.orbs.y[i] - 4,
                                SIZE,
                                SIZE,
                            )
                        ) {
                            attackMob(mobid, this.orbsDmg)
                        }
                    })
                }
            }
        })

        this.unloadRender = addRenderComp((ctx: CTX, assets: Assets) => {
            for (let i = 0; i < this.count; i++) {
                ctx.drawImage(
                    assets.orb,
                    ~~(this.orbs.x[i] - 4 - cam.x),
                    ~~(this.orbs.y[i] - 4 - cam.y),
                )
            }
        })
    }

    unload() {
        this.unloadPhysics()
        this.unloadRender()
    }
}
