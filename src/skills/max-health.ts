import { Skill } from "./skill"

const INC_HEALTH_CAP = 25
const MAX_HEALTH_CAP = 200

interface MaxHealthOwner {
    maxHealth: number
}

export class MaxHealth implements Skill {
    owner: MaxHealthOwner

    constructor(owner: MaxHealthOwner) {
        this.owner = owner
    }

    getUpgrades(): Upgrade[] {
        const sprite = "eHeart"
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
