import { Assets } from "src/asset"
import { Upgrade } from "src/upgrade"
import { Skill } from "./skill"

const INC_PICKUP_RADIUS = 10
const MAX_PICKUP_RADIUS = 60

export interface MagnetOwner {
    pickupRadius: number
}

export class Magnet implements Skill {
    owner: MagnetOwner

    constructor(owner: MagnetOwner) {
        this.owner = owner
    }

    getUpgrades(): Upgrade[] {
        const sprite = "eMagnet" as keyof Assets
        const upgrades = []

        if (this.owner.pickupRadius < MAX_PICKUP_RADIUS) {
            const apply = () => (this.owner.pickupRadius += INC_PICKUP_RADIUS)
            upgrades.push({ label: "++PICKUP DIST", sprite, apply })
        }

        return upgrades
    }

    load() {}
    unload() {}
}
