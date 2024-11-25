import { Hero, HeroAttrs, State } from "./hero"

import { extractRandom } from "../core/math"
import { PlasmaOrbs } from "../skills/plasma-orbs"
import { PlasmaField } from "../skills/plasma-field"
import { ThrowingLightsaber } from "../skills/throwing-lightsaber"
import { Blaster } from "../skills/blaster"
import { Magnet } from "../skills/magnet"
import { MovementSpeed } from "../skills/movement-speed"
import { MaxHealth } from "../skills/max-health"
import { Heal } from "../skills/heal"

export class Hero1 extends Hero {
    healSkill: Skill

    constructor() {
        const frames = {
            [State.idle]: [0, 1, 2, 0],
            [State.moving]: [3, 0, 4, 0],
            [State.dead]: [0, 0, 0, 0],
        }
        super({ sprite: "hero1", frames })

        this.healSkill = new Heal(this)
        const blaster = new Blaster(this)
        blaster.enabled = true
        blaster.upgradeFireRate()

        this.skills = [
            this.healSkill,
            new MaxHealth(this),
            new MovementSpeed(this),
            new Magnet(this),

            blaster,
            new ThrowingLightsaber(this),
            new PlasmaOrbs(this),
            new PlasmaField(this),
        ]
    }

    getUpgrades(): Upgrade[] {
        const upgrades = []
        this.skills.forEach((skill) => {
            skill.getUpgrades().forEach((upgrade) => upgrades.push(upgrade))
        })

        while (upgrades.length < 3) {
            upgrades.push(this.healSkill.getUpgrades()[0])
        }

        return [
            extractRandom(upgrades),
            extractRandom(upgrades),
            extractRandom(upgrades),
        ]
    }
}
