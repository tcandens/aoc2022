import fs from "node:fs/promises";
import path from "node:path";

const ROCK = "rock";
const PAPER = "paper";
const SCISSORS = "scissors";
type Shape = typeof ROCK | typeof PAPER | typeof SCISSORS;

const shapes: Record<string, Shape> = {
  A: ROCK,
  B: PAPER,
  C: SCISSORS,
};

type ShapeKey = keyof typeof shapes;

const shapeLosers: Record<ShapeKey, Shape> = {
  [shapes.B]: shapes.A,
  [shapes.C]: shapes.B,
  [shapes.A]: shapes.C,
};

const shapeWinners = {
  [shapes.A]: shapes.B,
  [shapes.B]: shapes.C,
  [shapes.C]: shapes.A,
};

const scoreMap = {
  [shapes.A]: 1,
  [shapes.B]: 2,
  [shapes.C]: 3,
};

const WIN = "Z";
const DRAW = "Y";
const LOSE = "X";
type Result = typeof WIN | typeof DRAW | typeof LOSE;

const results = {
  [WIN]: "win",
  [DRAW]: "draw",
  [LOSE]: "lose",
};

const resultScore = {
  [WIN]: 6,
  [LOSE]: 0,
  [DRAW]: 3,
};

type ResultKey = keyof typeof results;

function calculateRound(
  opponentShapeKey: ShapeKey,
  desiredResultKey: ResultKey
): [score: number] {
  let opponentShape = shapes[opponentShapeKey];
  let playerShape: Shape;
  switch (desiredResultKey) {
    case WIN: {
      playerShape = shapeWinners[opponentShape];
      break;
    }
    case DRAW: {
      playerShape = shapes[opponentShapeKey];
      break;
    }
    case LOSE: {
      playerShape = shapeLosers[opponentShape];
      break;
    }
    default: {
      throw new Error("desired result not defined");
    }
  }
  const roundResultScore = resultScore[desiredResultKey];
  const roundShapeScore = scoreMap[playerShape];
  let score = roundResultScore + roundShapeScore;
  // console.log(
  //   `op: ${opponentShape}; r: ${desiredResultKey}; score: ${score}; ress: ${roundResultScore}; shapes: ${roundShapeScore}`
  // );
  return [score];
}

async function main() {
  const datapath = path.resolve(__dirname, "input.txt");
  const file = await fs.open(datapath);

  let pointTotal = 0;

  for await (const line of file.readLines()) {
    const [opponentShape, desiredResultKey] = line.split(" ") as [
      ShapeKey,
      Result
    ];
    const [score] = calculateRound(opponentShape, desiredResultKey);
    pointTotal += score;
  }

  return pointTotal;
}

main().then((total) => console.log(`Point total: ${total}`));
