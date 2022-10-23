let mana = new Decimal(1);
let manaRegen = new Decimal(0.5);

let orbs = new Decimal(0);
let orbCost = new Decimal(1);
let orbCostAdd = new Decimal(0.1);

let tier = new Decimal(1);
let tierCost = new Decimal(10);
let tierCostScale = new Decimal(10);

let stars = new Decimal(0);
let starReq = new Decimal(4);
let starReqIncrement = new Decimal(2);

let light = new Decimal(0);
let lightGain = new Decimal(0);

let supernovae = new Decimal(0);
let supernovaReq = new Decimal(100);
let supernovaReqIncrement = new Decimal(3);

let manaSoftcapped = false;
let manaSoftcapStart = new Decimal(1e250).pow(1);
let manaSoftcapPower = new Decimal(0.9);

let upgrades = defaultOrbUpgrades();

function defaultOrbUpgrades() {
    return {
        upg1: {
            id: "upg1",
            name: "2x Mana",
            level: new Decimal(0),
            maxLevel: new Decimal(-1),
            baseCost: new Decimal(2),
            cost: new Decimal(2),
            costScale: new Decimal(3),
            currency: "Orbs",
        },
        upg2: {
            id: "upg2",
            name: "Auto Orb",
            level: new Decimal(0),
            maxLevel: new Decimal(1),
            baseCost: new Decimal(5),
            cost: new Decimal(5),
            costScale: new Decimal(1),
            currency: "Orbs",
        },
        upg3: {
            id: "upg3",
            name: "2x Light",
            level: new Decimal(0),
            maxLevel: new Decimal(-1),
            baseCost: new Decimal(1000),
            cost: new Decimal(1000),
            costScale: new Decimal(10),
            currency: "Orbs",
        },
        upg8: {
            id: "upg8",
            name: "Mana boosts itself",
            level: new Decimal(0),
            maxLevel: new Decimal(1),
            baseCost: new Decimal(1000000000),
            cost: new Decimal(1000000000),
            costScale: new Decimal(1),
            currency: "Orbs",
        },
    };
}

let lightUpgrades = defaultLightUpgrades();

function defaultLightUpgrades() {
    return {
        upg4: {
            id: "upg4",
            name: "+1 Orb",
            level: new Decimal(0),
            maxLevel: new Decimal(-1),
            baseCost: new Decimal(1),
            cost: new Decimal(1),
            costScale: new Decimal(10),
            currency: "Light",
        },
        upg5: {
            id: "upg5",
            name: "Light boosts itself",
            level: new Decimal(0),
            maxLevel: new Decimal(1),
            baseCost: new Decimal(1000000),
            cost: new Decimal(1000000),
            costScale: new Decimal(1),
            currency: "Light",
        },
        upg6: {
            id: "upg6",
            name: "Auto Orb Upg",
            level: new Decimal(0),
            maxLevel: new Decimal(1),
            baseCost: new Decimal(1000000000000),
            cost: new Decimal(1000000000000),
            costScale: new Decimal(1),
            currency: "Light",
        },
        upg7: {
            id: "upg7",
            name: "Auto Tier",
            level: new Decimal(0),
            maxLevel: new Decimal(1),
            baseCost: new Decimal(1000000000000000000000000),
            cost: new Decimal(1000000000000000000000000),
            costScale: new Decimal(1),
            currency: "Light",
        },
        upg9: {
            id: "upg9",
            name: "2x Mana",
            level: new Decimal(0),
            maxLevel: new Decimal(-1),
            baseCost: new Decimal(1000),
            cost: new Decimal(1000),
            costScale: new Decimal(1000),
            currency: "Light",
        },
        upg10: {
            id: "upg10",
            name: "No reset on tier",
            level: new Decimal(0),
            maxLevel: new Decimal(1),
            baseCost: new Decimal(1e48),
            cost: new Decimal(1e48),
            costScale: new Decimal(1),
            currency: "Light",
        },
        upg11: {
            id: "upg11",
            name: "No reset on star",
            level: new Decimal(0),
            maxLevel: new Decimal(1),
            baseCost: new Decimal(1e96),
            cost: new Decimal(1e96),
            costScale: new Decimal(1),
            currency: "Light",
        },
    };
}

function update() {
    //visibility
    if (stars.greaterThanOrEqualTo(1) || supernovae.greaterThanOrEqualTo(1)) {
        document.getElementById("light").classList.remove("invisible");
    }
    else {
        document.getElementById("light").classList.add("invisible");
    }
    //labels
    document.getElementById("manaAmount").innerHTML = format(mana) + " Mana";
    document.getElementById("lightAmount").innerHTML = format(light) + " Light";
    document.getElementById("manaRate").innerHTML = format(manaRegen) + " Mana/sec";
    document.getElementById("lightRate").innerHTML = format(lightGain) + " Light/sec";
    document.getElementById("orbCount").innerHTML = "You have " + format(orbs) + " Mana Orbs";
    document.getElementById("tier").innerHTML = "Tier " + format(tier);
    document.getElementById("starCount").innerHTML = "You have " + format(stars) + " Mana Stars";
    document.getElementById("supernovaCount").innerHTML = "You have " + format(supernovae) + " Supernova(s)";
    //multis
    document.getElementById("orbMulti").innerHTML = "Your Mana Orbs multiply mana regeneration by " + format(getOrbMulti()) + "x.";
    document.getElementById("tierMulti").innerHTML = "Your Tiers multiply mana regen by " + format(getTierMulti()) + "x.";
    document.getElementById("starPower").innerHTML = "Your Mana Stars raise orb effectiveness ^" + formatToN(getStarPower(), 5) + ".";
    document.getElementById("supernovaMulti").innerHTML = "Your supernova(s) multiply light gain by " + format(getSupernovaMulti()) + ".";
    //buttons
    document.getElementById("condenseOrb").innerHTML = "Condense " + format(getOrbGainMulti()) + " Orb(s) (" + format(orbCost) + " Mana)";
    document.getElementById("manaTier").innerHTML = "Tier Up (" + format(tierCost) + " Orbs)";
    document.getElementById("summonStar").innerHTML = "Summon Mana Star (Req Tier " + format(starReq) + ")";
    document.getElementById("supernova").innerHTML = "Supernova (" + format(supernovaReq) + " Stars)";
    //orb upg
    for (const [key, upgrade] of Object.entries(upgrades)) {
        document.getElementById(upgrade.id).innerHTML = upgrade.name + " (" + upgrade.level + ") (" + format(upgrade.cost) + " " + upgrade.currency + ")";
        if (isMaxed(upgrade)) {
            document.getElementById(upgrade.id).innerHTML = upgrade.name + " (Maxed)";
            document.getElementById(upgrade.id).classList.add("disabled");
        }
        else {
            document.getElementById(upgrade.id).classList.remove("disabled");
        }
    }
    //light upg
    for (const [key, upgrade] of Object.entries(lightUpgrades)) {
        document.getElementById(upgrade.id).innerHTML = upgrade.name + " (" + upgrade.level + ") (" + format(upgrade.cost) + " " + upgrade.currency + ")";
        if (isMaxed(upgrade)) {
            document.getElementById(upgrade.id).innerHTML = upgrade.name + " (Maxed)";
            document.getElementById(upgrade.id).classList.add("disabled");
        }
        else {
            document.getElementById(upgrade.id).classList.remove("disabled");
        }
    }
}


function gameTick(dt) {
    mana = mana.add(manaRegen.times(dt));
    light = light.add(lightGain.times(dt));

    if (upgrades.upg2.level.greaterThan(0)) {
        maxCondense();
    }
    if (lightUpgrades.upg6.level.greaterThan(0)) {
        maxOrbUpgrades();
    }
    if (lightUpgrades.upg7.level.greaterThan(0)) {
        tierUp();
    }

    calcLightGain();
    calcManaRegen();
    updateOrbCost();
    mana = Decimal.max(mana, 0);
    update();
}

function maxOrbUpgrades() {
    for (const [key, upgrade] of Object.entries(upgrades)) {
        if (!isMaxed(upgrade)) {
            let levelsBuyable = Decimal.affordGeometricSeries(orbs, upgrade.baseCost, upgrade.costScale, upgrade.level);
            if (upgrade.costScale.equals(1)) {
                levelsBuyable = Decimal.floor(orbs.div(upgrade.baseCost));
            }
            let maxLevelsBuyable = upgrade.maxLevel.equals(-1) ? new Decimal(Number.POSITIVE_INFINITY) : upgrade.maxLevel.minus(upgrade.level);
            let levelsToBuy = Decimal.min(levelsBuyable, maxLevelsBuyable);
            orbs = orbs.minus(geoSumCost(upgrade.level, upgrade.level.plus(levelsToBuy), upgrade.baseCost, upgrade.costScale));
            upgrade.level = upgrade.level.plus(levelsToBuy);
            upgrade.cost = upgrade.cost.times(upgrade.costScale.pow(levelsToBuy));
        }
    }
}

function maxCondense() {
    updateOrbCost();
    if (mana.greaterThanOrEqualTo(orbCost)) {
        let maxOrbsBuy = Decimal.affordArithmeticSeries(mana.minus(manaRegen.times(0.01)), new Decimal(1), orbCostAdd, orbs);
        mana = mana.minus(arithSumCost(orbs, orbs.plus(maxOrbsBuy), new Decimal(1), orbCostAdd));
        orbs = orbs.plus(maxOrbsBuy.times(getOrbGainMulti()));
    }

}

function arithSumCost(beforeAmt, afterAmt, base, increment) {
    return arithSum(afterAmt, increment, base).minus(arithSum(beforeAmt, increment, base));
}

function arithSum(n, d, a1) {
    return n.div(2).mul(
        a1.times(2).plus(
            n.minus(1).times(d)
        )
    );
}

function geoSumCost(beforeAmt, afterAmt, base, factor) {
    return geoSum(afterAmt, factor, base).minus(geoSum(beforeAmt, factor, base));
}

function geoSum(n, r, a1) {
    return a1.times(new Decimal(1).minus(r.pow(n))).div(new Decimal(1).minus(r));
}

function getOrbGainMulti() {
    return lightUpgrades.upg4.level.plus(1);
}

function condenseOrb() {
    updateOrbCost();
    if (mana.greaterThanOrEqualTo(orbCost)) {
        mana = mana.minus(orbCost);
        orbs = orbs.plus(getOrbGainMulti());
    }
}

function updateOrbCost() {
    orbCost = new Decimal(1).plus(orbCostAdd.times(orbs));
}

let lastTime = Date.now();
setInterval(function () {
    let currentTime = Date.now();
    let dt = (currentTime - lastTime) / 1000;
    lastTime = currentTime;
    gameTick(dt);
}, 50);

function tierUp() {
    if (orbs.greaterThanOrEqualTo(tierCost)) {
        let tierTimes = new Decimal(1);
        if (!lightUpgrades.upg10.level.equals(1)) {
            orbs = orbs.minus(tierCost);
            let ac = upgrades.upg2;
            let lightBoost = upgrades.upg3;
            let manaBoost = upgrades.upg8;
            tierReset();
            upgrades.upg2 = ac;
            upgrades.upg3 = lightBoost;
            upgrades.upg8 = manaBoost;
        }
        else {
            tierTimes = tierTimes.plus(new Decimal(orbs.exponent).minus(new Decimal(tierCost.exponent)));
        }
        tierCost = tierCost.times(tierCostScale.pow(tierTimes));
        tier = tier.plus(tierTimes);
    }
}

function summonStar() {
    if (tier.greaterThanOrEqualTo(starReq)) {
        let starTimes = new Decimal(1);
        if (!lightUpgrades.upg11.level.equals(1)) {
            let ac = upgrades.upg2;
            starReset();
            upgrades.upg2 = ac;
        }
        else {
            starTimes = starTimes.plus(Decimal.floor(tier.minus(starReq).div(2)));
        }
        stars = stars.plus(starTimes);
        starReq = starReq.plus(starReqIncrement.times(starTimes));
    }
}

function supernova() {
    if (stars.greaterThanOrEqualTo(supernovaReq)) {
        supernovaReset();
        supernovae = supernovae.plus(1);
        supernovaReq = supernovaReq.plus(supernovaReqIncrement);
    }
}

function supernovaReset() {
    stars = new Decimal(0);
    starReq = new Decimal(4);
    starReqIncrement = new Decimal(2);

    light = new Decimal(0);
    lightGain = new Decimal(0);

    lightUpgrades = defaultLightUpgrades();
    starReset();
}

function starReset() {
    tier = new Decimal(1);
    tierCost = new Decimal(10);
    tierCostScale = new Decimal(10);
    tierReset();
}

function tierReset() {
    mana = new Decimal(1);
    manaRegen = new Decimal(0.5);
    orbs = new Decimal(0);
    orbCost = new Decimal(1);
    orbCostAdd = new Decimal(0.1);

    upgrades = defaultOrbUpgrades();
}

function buyUpgrade(upgName) {
    let upgrade = upgrades[upgName] || lightUpgrades[upgName];
    if (upgrade.currency == "Orbs") {
        if (!isMaxed(upgrade)) {
            let levelsBuyable = Decimal.affordGeometricSeries(orbs, upgrade.baseCost, upgrade.costScale, upgrade.level);
            if (upgrade.costScale.equals(1)) {
                levelsBuyable = Decimal.floor(orbs.div(upgrade.baseCost));
            }
            let maxLevelsBuyable = upgrade.maxLevel.equals(-1) ? new Decimal(Number.POSITIVE_INFINITY) : upgrade.maxLevel.minus(upgrade.level);
            let levelsToBuy = Decimal.min(levelsBuyable, maxLevelsBuyable);
            orbs = orbs.minus(geoSumCost(upgrade.level, upgrade.level.plus(levelsToBuy), upgrade.baseCost, upgrade.costScale));
            upgrade.level = upgrade.level.plus(levelsToBuy);
            upgrade.cost = upgrade.cost.times(upgrade.costScale.pow(levelsToBuy));
        }
    }
    if (upgrade.currency == "Light") {
        if (!isMaxed(upgrade)) {
            let levelsBuyable = Decimal.affordGeometricSeries(light, upgrade.baseCost, upgrade.costScale, upgrade.level);
            if (upgrade.costScale.equals(1)) {
                levelsBuyable = Decimal.floor(light.div(upgrade.baseCost));
            }
            let maxLevelsBuyable = upgrade.maxLevel.equals(-1) ? new Decimal(Number.POSITIVE_INFINITY) : upgrade.maxLevel.minus(upgrade.level);
            let levelsToBuy = Decimal.min(levelsBuyable, maxLevelsBuyable);
            light = light.minus(geoSumCost(upgrade.level, upgrade.level.plus(levelsToBuy), upgrade.baseCost, upgrade.costScale));
            upgrade.level = upgrade.level.plus(levelsToBuy);
            upgrade.cost = upgrade.cost.times(upgrade.costScale.pow(levelsToBuy));
        }
    }
}

function isMaxed(upgrade) {
    return (upgrade.maxLevel.greaterThanOrEqualTo(0) && upgrade.level.greaterThanOrEqualTo(upgrade.maxLevel));
}

function calcLightGain() {
    if (stars.greaterThanOrEqualTo(1) || supernovae.greaterThanOrEqualTo(1)) {
        lightGain = new Decimal(4).pow(stars);
    }
    else {
        lightGain = new Decimal(0);
    }
    lightGain = lightGain
        .times(getUpg3Multi())
        .times(getUpg5Multi())
        .times(getSupernovaMulti());
}

function getSupernovaMulti() {
    return new Decimal(1e6).pow(supernovae);
}

function getUpg5Multi() {
    if (lightUpgrades.upg5.level.greaterThanOrEqualTo(1)) {
        return light.plus(1).pow(0.5);
    }
    return 1;
}

function getUpg3Multi() {
    return new Decimal(2).pow(upgrades.upg3.level);
}

function calcManaRegen() {
    manaRegen = new Decimal(0.5)
        .times(getOrbMulti())
        .times(getUpg1Multi())
        .times(getTierMulti())
        .times(getUpg8Multi())
        .times(getUpg9Multi());
    if (manaRegen.greaterThan(manaSoftcapStart)) {
        manaSoftcapped = true;
        let remainder = manaRegen.div(manaSoftcapStart);
        manaRegen = remainder.pow(manaSoftcapPower).times(manaSoftcapStart);
    }
}

function getUpg9Multi() {
    return new Decimal(2).pow(lightUpgrades.upg9.level);
}

function getUpg8Multi() {
    return new Decimal(1 + mana.exponent).pow(upgrades.upg8.level);
}

function getStarPower() {
    let starsOver3 = Decimal.max(0, stars.minus(3));
    let power = new Decimal(1).plus(new Decimal(0.2).times(Decimal.min(3,stars)));
    power = power.plus(geoSum(starsOver3, new Decimal(0.9), new Decimal(0.04)));
    return power;
}

function getTierMulti() {
    return new Decimal(2).pow(tier.minus(1));
}

function getOrbMulti() {
    return orbs.add(1).pow(0.5).pow(getStarPower());
}

function getUpg1Multi() {
    return new Decimal(2).pow(upgrades.upg1.level);
}

function format(decimalToFormat) {
    if (decimalToFormat.greaterThanOrEqualTo(1000)) {
        if (decimalToFormat.exponent >= 1000) {
            let formatted =
                Math.round(decimalToFormat.mantissa * 100) / 100 +
                "ee" +
                Math.round(Math.log10(decimalToFormat.exponent) * 100) / 100;
            return formatted;
        }
        let formatted =
            Math.round(decimalToFormat.mantissa * 100) / 100 +
            "e" +
            decimalToFormat.exponent;
        return formatted;
    } else if (decimalToFormat.lessThan(1)) {
        return decimalToFormat.times(10).floor().div(10).toString().substring(0, 3);
    }
    else {
        return decimalToFormat.times(10).floor().div(10).toString().substring(0, Decimal.log10(decimalToFormat) + 3);
    }
}

function formatToN(decimalToFormat, n) {
    if (decimalToFormat.greaterThanOrEqualTo(1000)) {
        if (decimalToFormat.exponent >= 1000) {
            let formatted =
                Math.round(decimalToFormat.mantissa * 100) / 100 +
                "ee" +
                Math.round(Math.log10(decimalToFormat.exponent) * 100) / 100;
            return formatted;
        }
        let formatted =
            Math.round(decimalToFormat.mantissa * 100) / 100 +
            "e" +
            decimalToFormat.exponent;
        return formatted;
    } else if (decimalToFormat.lessThan(1)) {
        return decimalToFormat.times(Math.pow(10,n)).floor().div(Math.pow(10,n)).toString().substring(0, 3);
    }
    else {
        return decimalToFormat.times(Math.pow(10,n)).floor().div(Math.pow(10,n)).toString().substring(0, n + 3);
    }
}

document.getElementById("supernova").addEventListener('click', supernova);
document.getElementById("summonStar").addEventListener('click', summonStar);
document.getElementById("condenseOrb").addEventListener('click', condenseOrb);
document.getElementById("manaTier").addEventListener('click', tierUp);
for (let upgradeButton of document.getElementsByClassName("upgrade")) {
    upgradeButton.addEventListener('click', function () {
        buyUpgrade(upgradeButton.id);
    })
}