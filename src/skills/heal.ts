import { Assets } from "src/asset"
import { Upgrade } from "src/upgrade"
import { Skill } from "./skill"

import { clamp } from "../core/math"

const HEAL_AMT = 10

interface HealOwner {
    health: number
    maxHealth: number
}

export class Heal implements Skill {
    owner: HealOwner

    constructor(owner: HealOwner) {
        this.owner = owner
    }

    getUpgrades(): Upgrade[] {
        const sprite = "eHeart" as keyof Assets
        const apply = () => {
            const hp = ~~((this.owner.maxHealth * HEAL_AMT) / 100)
            this.owner.health = clamp(
                this.owner.health + hp,
                0,
                this.owner.maxHealth,
            )
        }
        return [{ label: "HEAL", sprite, apply }]
    }

    load() {}
    unload() {}
}
