const Fetch = require("node-fetch");
const Fs = require("fs-extra");
let halfLevels_array = [];
let halfLevels_object = {};
let wholeLevels_array = []
let wholeLevels_object = {};

function Fetch_Json(url) {
    return new Promise(resolve => {
        Fetch(url)
            .then(res => res.json())
            .then(json => {
                return resolve(json);
            });
    });
}

let getHalfLevels = (MasterArray) => {
    return new Promise(async resolve => {
        for (let i = 0; i <MasterArray.length; i++) {
            let object = MasterArray[i];
            try {
                if (object.data.playerLevel) {
                    let levels = object.data.playerLevel.cpMultiplier;
                    for (let j = 0; j < levels.length; j++) {
                        let halfLevelCpm = Math.sqrt(levels[j] * levels[j] - levels[j] * levels[j] / 2 + levels[j + 1] * levels[j + 1] / 2);
                        halfLevels_array.push(levels[j]);
                        halfLevels_object[j+1 + '.0'] = levels[j];
                        wholeLevels_array.push(levels[j]);
                        wholeLevels_object[j+1] = levels[j];
                        if (j < 54) {
                            halfLevels_array.push(halfLevelCpm);
                            halfLevels_object[j+1 + '.5'] = halfLevelCpm;
                        }
                    }
                }
            } catch (e) {
                console.error(e);
            }
        }
        return resolve;
    });
}

(async function () {
    let MasterArray = await Fetch_Json("https://raw.githubusercontent.com/PokeMiners/game_masters/master/level_50_game_master/game_master.json");
    getHalfLevels(MasterArray);
    Fs.writeJSONSync("./CPM_values/halfLevels_array.json", halfLevels_array, {
        spaces: "\t",
        EOL: "\n"
    });
    Fs.writeJSONSync("./CPM_values/halfLevels_object.json", halfLevels_object, {
        spaces: "\t",
        EOL: "\n"
    });
    Fs.writeJSONSync("./CPM_values/wholeLevels_array.json", wholeLevels_array, {
        spaces: "\t",
        EOL: "\n"
    });
    Fs.writeJSONSync("./CPM_values/wholeLevels_object.json", wholeLevels_object, {
        spaces: "\t",
        EOL: "\n"
    });
})();
