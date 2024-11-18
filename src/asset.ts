import { CTX, texture } from "./core/canvas"

const img = async (url: string) => {
    const img = new Image()
    img.src = url
    await img.decode()
    return img
}

export type Assets = Awaited<ReturnType<typeof loadAssets>>

export const loadAssets = async () => {
    const urls = [
        "./assets/hero.png",

        "./assets/mob0.png",
        "./assets/mob1.png",
        "./assets/mob2.png",
        "./assets/mob3.png",
        "./assets/mob0boss.png",
        "./assets/mob1boss.png",
        "./assets/mob2boss.png",
        "./assets/mob3boss.png",

        "./assets/coin.png",
        "./assets/bullet.png",
        "./assets/elements.png",
        "./assets/rocks.png",
        "./assets/saber.png",
        "./assets/orb.png",
    ]
    const assetsLoaded = urls.map(img)

    const [
        hero,

        mob0,
        mob1,
        mob2,
        mob3,
        mob0boss,
        mob1boss,
        mob2boss,
        mob3boss,

        coin,
        bullet,
        elements,
        rocks,
        saber,
        orb,
    ] = await Promise.all(assetsLoaded)

    // included normal and flipped versions for asymmetric sprites
    // note: make sure spritesheet frames are always in 1 row
    return {
        coin,
        hero: [
            // normal
            texture((ctx) => frame(ctx, hero, 0, 0, 16, 0), 16, 16),
            texture((ctx) => frame(ctx, hero, 0, 0, 16, 0), 16, 16),
            texture((ctx) => frame(ctx, hero, 0, 0, 16, 0), 16, 16),
            texture((ctx) => frame(ctx, hero, 0, 0, 16, 1), 16, 16),
            texture((ctx) => frame(ctx, hero, 0, 0, 16, 2), 16, 16),
            // flipped
            texture((ctx) => flipFrame(ctx, hero, 0, 0, 16, 0), 16, 16),
            texture((ctx) => flipFrame(ctx, hero, 0, 0, 16, 0), 16, 16),
            texture((ctx) => flipFrame(ctx, hero, 0, 0, 16, 0), 16, 16),
            texture((ctx) => flipFrame(ctx, hero, 0, 0, 16, 1), 16, 16),
            texture((ctx) => flipFrame(ctx, hero, 0, 0, 16, 2), 16, 16),
        ],
        mob0: [
            // normal
            texture((ctx) => frame(ctx, mob0, 0, 0, 16, 0), 16, 16),
            texture((ctx) => frame(ctx, mob0, 0, 0, 16, 1), 16, 16),
            texture((ctx) => frame(ctx, mob0, 0, 0, 16, 2), 16, 16),
            //flipped
            texture((ctx) => flipFrame(ctx, mob0, 0, 0, 16, 0), 16, 16),
            texture((ctx) => flipFrame(ctx, mob0, 0, 0, 16, 1), 16, 16),
            texture((ctx) => flipFrame(ctx, mob0, 0, 0, 16, 2), 16, 16),
        ],
        mob1: [
            // normal
            texture((ctx) => frame(ctx, mob1, 0, 0, 16, 0), 16, 16),
            texture((ctx) => frame(ctx, mob1, 0, 0, 16, 1), 16, 16),
            texture((ctx) => frame(ctx, mob1, 0, 0, 16, 2), 16, 16),
            //flipped
            texture((ctx) => flipFrame(ctx, mob1, 0, 0, 16, 0), 16, 16),
            texture((ctx) => flipFrame(ctx, mob1, 0, 0, 16, 1), 16, 16),
            texture((ctx) => flipFrame(ctx, mob1, 0, 0, 16, 2), 16, 16),
        ],
        mob2: [
            // normal
            texture((ctx) => frame(ctx, mob2, 0, 0, 16, 0), 16, 16),
            texture((ctx) => frame(ctx, mob2, 0, 0, 16, 1), 16, 16),
            texture((ctx) => frame(ctx, mob2, 0, 0, 16, 2), 16, 16),
            //flipped
            texture((ctx) => flipFrame(ctx, mob2, 0, 0, 16, 0), 16, 16),
            texture((ctx) => flipFrame(ctx, mob2, 0, 0, 16, 1), 16, 16),
            texture((ctx) => flipFrame(ctx, mob2, 0, 0, 16, 2), 16, 16),
        ],
        mob3: [
            // normal
            texture((ctx) => frame(ctx, mob3, 0, 0, 16, 0), 16, 16),
            texture((ctx) => frame(ctx, mob3, 0, 0, 16, 1), 16, 16),
            texture((ctx) => frame(ctx, mob3, 0, 0, 16, 2), 16, 16),
            //flipped
            texture((ctx) => flipFrame(ctx, mob3, 0, 0, 16, 0), 16, 16),
            texture((ctx) => flipFrame(ctx, mob3, 0, 0, 16, 1), 16, 16),
            texture((ctx) => flipFrame(ctx, mob3, 0, 0, 16, 2), 16, 16),
        ],
        mob0boss: [
            // normal
            texture((ctx) => frame(ctx, mob0boss, 0, 0, 16, 0), 16, 16),
            texture((ctx) => frame(ctx, mob0boss, 0, 0, 16, 1), 16, 16),
            texture((ctx) => frame(ctx, mob0boss, 0, 0, 16, 2), 16, 16),
            //flipped
            texture((ctx) => flipFrame(ctx, mob0boss, 0, 0, 16, 0), 16, 16),
            texture((ctx) => flipFrame(ctx, mob0boss, 0, 0, 16, 1), 16, 16),
            texture((ctx) => flipFrame(ctx, mob0boss, 0, 0, 16, 2), 16, 16),
        ],
        mob1boss: [
            // normal
            texture((ctx) => frame(ctx, mob1boss, 0, 0, 16, 0), 16, 16),
            texture((ctx) => frame(ctx, mob1boss, 0, 0, 16, 1), 16, 16),
            texture((ctx) => frame(ctx, mob1boss, 0, 0, 16, 2), 16, 16),
            //flipped
            texture((ctx) => flipFrame(ctx, mob1boss, 0, 0, 16, 0), 16, 16),
            texture((ctx) => flipFrame(ctx, mob1boss, 0, 0, 16, 1), 16, 16),
            texture((ctx) => flipFrame(ctx, mob1boss, 0, 0, 16, 2), 16, 16),
        ],
        mob2boss: [
            // normal
            texture((ctx) => frame(ctx, mob2boss, 0, 0, 16, 0), 16, 16),
            texture((ctx) => frame(ctx, mob2boss, 0, 0, 16, 1), 16, 16),
            texture((ctx) => frame(ctx, mob2boss, 0, 0, 16, 2), 16, 16),
            //flipped
            texture((ctx) => flipFrame(ctx, mob2boss, 0, 0, 16, 0), 16, 16),
            texture((ctx) => flipFrame(ctx, mob2boss, 0, 0, 16, 1), 16, 16),
            texture((ctx) => flipFrame(ctx, mob2boss, 0, 0, 16, 2), 16, 16),
        ],
        mob3boss: [
            // normal
            texture((ctx) => frame(ctx, mob3boss, 0, 0, 16, 0), 16, 16),
            texture((ctx) => frame(ctx, mob3boss, 0, 0, 16, 1), 16, 16),
            texture((ctx) => frame(ctx, mob3boss, 0, 0, 16, 2), 16, 16),
            //flipped
            texture((ctx) => flipFrame(ctx, mob3boss, 0, 0, 16, 0), 16, 16),
            texture((ctx) => flipFrame(ctx, mob3boss, 0, 0, 16, 1), 16, 16),
            texture((ctx) => flipFrame(ctx, mob3boss, 0, 0, 16, 2), 16, 16),
        ],
        bullet,
        saber,
        orb,
        eHeart: texture((ctx) => frame(ctx, elements, 0, 0, 8, 0), 8, 8),
        eBullet: texture((ctx) => frame(ctx, elements, 0, 0, 8, 1), 8, 8),
        eArrow: texture((ctx) => frame(ctx, elements, 0, 0, 8, 2), 8, 8),
        eBg: texture((ctx) => frame(ctx, elements, 0, 0, 8, 3), 8, 8),
        eSaber: texture((ctx) => frame(ctx, elements, 0, 0, 8, 4), 8, 8),
        ePlasma: texture((ctx) => frame(ctx, elements, 0, 0, 8, 5), 8, 8),
        eOrbs: texture((ctx) => frame(ctx, elements, 0, 0, 8, 6), 8, 8),
        eMagnet: texture((ctx) => frame(ctx, elements, 0, 0, 8, 7), 8, 8),
        eShoes: texture((ctx) => frame(ctx, elements, 0, 0, 8, 8), 8, 8),
        eXp: coin,
        rocks: [
            texture((ctx) => frame(ctx, rocks, 0, 0, 8, 0), 8, 8),
            texture((ctx) => frame(ctx, rocks, 0, 0, 8, 1), 8, 8),
        ],
    }
}

const frame = (
    ctx: CTX,
    img: CanvasImageSource,
    x: number,
    y: number,
    size: number,
    idx: number,
) => {
    ctx.drawImage(img, size * idx, 0, size, size, ~~x, ~~y, size, size)
}

const flipFrame = (
    ctx: CTX,
    img: CanvasImageSource,
    x: number,
    y: number,
    size: number,
    idx: number,
) => {
    ctx.save()
    ctx.translate(x, y)
    ctx.scale(-1, 1)
    frame(ctx, img, -size, 0, size, idx)
    ctx.restore()
}
