import { Assets } from "src/asset"
import { Upgrade } from "src/upgrade"
import { Skill } from "./skill"

interface SpeedOwner {
    speed: number
}

export class MovementSpeed implements Skill {
    constructor(
        private owner: SpeedOwner,
        private incSpeed = 0.01,
        private maxSpeed = 0.08,
    ) {
        this.owner = owner
        this.incSpeed = incSpeed
        this.maxSpeed = maxSpeed
    }

    getUpgrades(): Upgrade[] {
        const sprite = "eShoes" as keyof Assets
        const upgrades = []

        if (this.owner.speed < this.maxSpeed) {
            const apply = () => (this.owner.speed += this.incSpeed)
            upgrades.push({ label: "MOVE FASTER", sprite, apply })
        }

        return upgrades
    }

    load() {}
    unload() {}
}
