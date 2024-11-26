import { Assets } from "src/asset"
import { Upgrade } from "src/upgrade"
import { Skill } from "./skill"

import { clamp } from "../core/math"

interface HealOwner {
    health: number
    maxHealth: number
}

export class Heal implements Skill {
    constructor(
        private owner: HealOwner,
        private healAmount: number = 10,
    ) {
        this.owner = owner
        this.healAmount = healAmount
    }

    getUpgrades(): Upgrade[] {
        const sprite = "eHeart" as keyof Assets
        const apply = () => {
            const hp = ~~((this.owner.maxHealth * this.healAmount) / 100)
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
