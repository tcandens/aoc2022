import fs from "node:fs/promises";
import path from "node:path";

const ROCK = "rock";
const PAPER = "paper";
const SCISSORS = "scissors";

const shapes = {
  A: ROCK,
  B: PAPER,
  C: SCISSORS,
};

const choices = {
  X: ROCK,
  Y: PAPER,
  Z: SCISSORS,
};

const shapeAntagonist = {
  [shapes.A]: [choices.Y],
  [shapes.B]: [choices.Z],
  [shapes.C]: [choices.X],
};

const scoreMap = {
  [choices.X]: 1,
  [choices.Y]: 2,
  [choices.Z]: 3,
};

const WIN = 1;
const LOSE = -1;
const DRAW = 0;
type Result = typeof WIN | typeof LOSE | typeof DRAW;

const resultScore = {
  [WIN]: 6,
  [LOSE]: 0,
  [DRAW]: 3,
};

type OppShape = keyof typeof shapes;
type ChoiceShape = keyof typeof choices;

function calculateRound(
  oppShape: OppShape,
  choice: ChoiceShape
): [win: Result, score: number] {
  const opposites = shapeAntagonist[shapes[oppShape]];
  const win = opposites.includes(choices[choice]);
  const result = win ? 1 : choices[choice] == shapes[oppShape] ? 0 : -1;
  const value = scoreMap[choices[choice]] + resultScore[result];
  return [result, value];
}

async function main() {
  const datapath = path.resolve(__dirname, "input.txt");
  const file = await fs.open(datapath);

  let pointTotal = 0;
  const record = [] as Result[];

  for await (const line of file.readLines()) {
    const [opponentShape, choice] = line.split(" ") as [OppShape, ChoiceShape];
    const [win, score] = calculateRound(opponentShape, choice);
    record.push(win);
    pointTotal += score;
  }

  return pointTotal;
}

main().then((total) => console.log(`Point total: ${total}`));
