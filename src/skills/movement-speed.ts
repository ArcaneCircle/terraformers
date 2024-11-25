import { Assets } from "src/asset"
import { Upgrade } from "src/upgrade"
import { Skill } from "./skill"

const INC_OWNER_SPEED = 0.01
const MAX_OWNER_SPEED = 0.08

interface SpeedOwner {
    speed: number
}

export class MovementSpeed implements Skill {
    owner: SpeedOwner

    constructor(owner: SpeedOwner) {
        this.owner = owner
    }

    getUpgrades(): Upgrade[] {
        const sprite = "eShoes" as keyof Assets
        const upgrades = []

        if (this.owner.speed < MAX_OWNER_SPEED) {
            const apply = () => (this.owner.speed += INC_OWNER_SPEED)
            upgrades.push({ label: "MOVE FASTER", sprite, apply })
        }

        return upgrades
    }

    load() {}
    unload() {}
}
