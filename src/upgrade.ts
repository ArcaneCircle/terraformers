import { Assets } from "src/asset"

export interface Upgradable {
    getUpgrades(): Upgrade[]
}

export interface Upgrade {
    label: string
    sprite: keyof Assets
    apply(): void
}
