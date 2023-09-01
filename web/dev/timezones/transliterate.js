const fs = require('fs');

const inputLines = fs.readFileSync('transliterate_input.txt', 'utf8').split('\n');
const inputs = [];
for (const city_raw of inputLines) {
    inputs.push(city_raw);
};

const goalLines = fs.readFileSync('transliterate_goal.txt', 'utf8').split('\n');
const goals = [];
for (const city_goal of goalLines) {
    goals.push(city_goal);
};

const mines = [];
for (const input of inputs) {
    mines.push(getSearchableCityName(input));
}

const len = inputs.length;
for (let i = 0; i < len; i++) {
    const input = inputs[i];
    const goal = goals[i];
    const mine = mines[i];
    if (mine !== goal)
        console.log(`${input}\n${goal}\n${mine}\n-------`);
}

function getSearchableCityName(str) {
    return clean; // copy the code from timezones.ts
}
