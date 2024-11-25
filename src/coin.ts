import { cam } from "./cam"
import { addPhysicsComp } from "./components/physics"
import { addRenderComp } from "./components/render"
import { COIN_PICKUP_SPEED, COIN_XP } from "./const"
import { distance, limitMagnitude } from "./core/math"
import { playPickup } from "./sound"
import { stats } from "./stat"

const E = {
    x: [] as number[],
    y: [] as number[],
    active: [] as boolean[],
}

let freePool: number[] = []

const SIZE = 8
const center = SIZE / 2

let playPickupSound = false

// throwaway temporary variable for optimization
const _vec = { x: 0, y: 0 }

let unloadPhysics: () => void
let unloadRender: () => void

export const unloadCoin = () => {
    unloadPhysics()
    unloadRender()
}

export const loadCoin = () => {
    E.x = []
    E.y = []
    E.active = []
    freePool = []

    unloadPhysics = addPhysicsComp((dt) => {
        iterCoins((x, y, id) => {
            // move to hero if near
            const dist = distance(x, y, stats.hero.x, stats.hero.y)
            if (dist < stats.hero.pickupRadius) {
                _vec.x = stats.hero.x - x
                _vec.y = stats.hero.y - y
                limitMagnitude(_vec)
                E.x[id] += _vec.x * dt * COIN_PICKUP_SPEED
                E.y[id] += _vec.y * dt * COIN_PICKUP_SPEED
            }

            // check if picked
            if (
                stats.hero.isHittingHero(
                    E.x[id] - center,
                    E.y[id] - center,
                    SIZE,
                    SIZE,
                )
            ) {
                stats.hero.increaseXp(COIN_XP)
                playPickupSound = true
                E.active[id] = false
                freePool.push(id)
            }
        })
        if (playPickupSound) {
            playPickup()
            playPickupSound = false
        }
    })

    unloadRender = addRenderComp((ctx, assets) => {
        iterCoins((x, y) => {
            ctx.drawImage(
                assets.coin,
                ~~(x - center - cam.x),
                ~~(y - center - cam.y),
            )
            //if (DEBUG) {
            //    ctx.strokeStyle = BLACK0
            //    ctx.strokeRect(
            //        x - center - cam.x,
            //        y - center - cam.y,
            //        SIZE,
            //        SIZE,
            //    )
            //}
        })
    })
}

const iterCoins = (
    fn: (x: number, y: number, id: number) => boolean | void,
) => {
    for (let i = 0; i < E.x.length; i++) {
        if (E.active[i]) {
            const end = fn(E.x[i], E.y[i], i)
            if (end) {
                break
            }
        }
    }
}

export const dropCoin = (x: number, y: number) => {
    if (freePool.length > 0) {
        const i = freePool.pop()!
        E.x[i] = x
        E.y[i] = y
        E.active[i] = true
        return i
    }
    E.x.push(x)
    E.y.push(y)
    return E.active.push(true)
}
