import { Skill } from "src/skills/skill"
import { Hero } from "src/heroes/hero"
import { WavesKey } from "src/mob"

import { addPhysicsComp } from "./components/physics"
import { Hero1 } from "./heroes/hero1"

class Stats {
    won = false
    score = 0
    /** Time passed since game session start, in seconds */
    time = 0
    hour = 0
    darkness = 0
    lightRadius = 0
    waveStartTime = 0
    wave: WavesKey = 1
    hero!: Hero

    unloadPhysics = () => {}

    reset() {
        this.won = false
        this.wave = 1
        this.waveStartTime = this.time = 0
        this.score = 0
        this.hero = new Hero1()
    }

    load() {
        this.unloadPhysics = addPhysicsComp((dt) => {
            this.time += dt / 1e3
            this.hour = ((this.time / 60 + 1.46) % 5) * 4.8

            let radius = 90 // day
            let transparency = 0x44 // day
            if (this.hour >= 19) {
                // night
                radius = 0
                transparency = 0xee
            } else if (this.hour >= 18) {
                // day -> night
                radius = Math.min(90, Math.floor(90 * (19 - this.hour)))
                transparency = Math.min(
                    0xee,
                    0x44 + Math.floor(0xee * (this.hour - 17.85)),
                )
            } else if (this.hour <= 6) {
                // night
                radius = 0
                transparency = 0xee
            } else if (this.hour <= 7) {
                // night -> day
                radius = Math.min(90, Math.floor(90 * (this.hour - 6)))
                transparency = Math.min(
                    0xee,
                    0x44 + Math.floor(0xee * (7 - this.hour)),
                )
            }
            this.lightRadius = Math.max(radius, 0)
            this.darkness = Math.max(0x44, transparency)
        })
    }

    unload() {
        this.unloadPhysics()
    }
}

export const stats = new Stats()
