export interface Upgradable {
    getUpgrades(): Upgrade[]
}

export interface Upgrade {
    label: string
    sprite: string
    apply(): void
}
