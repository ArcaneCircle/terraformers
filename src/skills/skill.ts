import { Upgradable } from "src/upgrade"

export interface Skill extends Upgradable {
    load: () => void
    unload: () => void
}

export interface PositionOwner {
    x: number
    y: number
}

export interface ProjectileOwner {
    x: number
    y: number
    nearestEnemy: () => { x: number; y: number } | undefined
}
