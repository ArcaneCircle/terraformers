import { Assets } from "src/asset"
import { Upgrade } from "src/upgrade"
import { Skill } from "./skill"

const INC_HEALTH_CAP = 25
const MAX_HEALTH_CAP = 200

interface MaxHealthOwner {
    maxHealth: number
}

export class MaxHealth implements Skill {
    constructor(private owner: MaxHealthOwner) {
        this.owner = owner
    }

    getUpgrades(): Upgrade[] {
        const sprite = "eHeart" as keyof Assets
        const upgrades = []

        if (this.owner.maxHealth < MAX_HEALTH_CAP) {
            const apply = () => (this.owner.maxHealth += INC_HEALTH_CAP)
            upgrades.push({ label: "++MAX HEALTH", sprite, apply })
        }

        return upgrades
    }

    load() {}
    unload() {}
}
