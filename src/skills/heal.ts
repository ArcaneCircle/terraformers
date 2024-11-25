import { clamp } from "../core/math"
import { Skill } from "./skill"

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
        const apply = () => {
            const hp = ~~((this.owner.maxHealth * HEAL_AMT) / 100)
            this.owner.health = clamp(
                this.owner.health + hp,
                0,
                this.owner.maxHealth,
            )
        }
        return [{ label: "HEAL", sprite: "eHeart", apply }]
    }

    load() {}
    unload() {}
}
