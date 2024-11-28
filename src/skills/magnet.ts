import { Assets } from "src/asset"
import { Upgrade } from "src/upgrade"
import { Skill } from "./skill"

export interface MagnetOwner {
    pickupRadius: number
}

export class Magnet implements Skill {
    constructor(
        private owner: MagnetOwner,
        private incRadius = 10,
        private maxRadius = 60,
    ) {
        this.owner = owner
        this.incRadius = incRadius
        this.maxRadius = maxRadius
    }

    getUpgrades(): Upgrade[] {
        const sprite = "eMagnet" as keyof Assets
        const upgrades = []

        if (this.owner.pickupRadius < this.maxRadius) {
            const apply = () => this.upgrade()
            upgrades.push({ label: "++PICKUP DIST", sprite, apply })
        }

        return upgrades
    }

    upgrade() {
        this.owner.pickupRadius += this.incRadius
    }

    load() {}
    unload() {}
}
