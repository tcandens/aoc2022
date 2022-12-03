use std::fs::File;
use std::io::{self, prelude::*, BufReader};
use std::collections::HashMap;
use itertools::Itertools;

#[derive(Eq, Hash, PartialEq, Debug)]
enum Shape {
    Rock,
    Paper,
    Scissors,
}

#[derive(Eq, Hash, PartialEq, Debug)]
enum MatchResult {
    Win,
    Draw,
    Lose
}


fn main() -> io::Result<()> {

    let mut match_result_values = HashMap::new();
    match_result_values.insert(MatchResult::Win, 1);
    match_result_values.insert(MatchResult::Draw, 0);
    match_result_values.insert(MatchResult::Lose, -1);

    let mut match_result_score = HashMap::new();
    match_result_score.insert(MatchResult::Win, 6);
    match_result_score.insert(MatchResult::Draw, 3);
    match_result_score.insert(MatchResult::Lose, 0);

    let mut shape_scores = HashMap::new();
    shape_scores.insert(Shape::Rock, 1);
    shape_scores.insert(Shape::Paper, 2);
    shape_scores.insert(Shape::Scissors, 3);

    let mut opponent_choices = HashMap::new();
    opponent_choices.insert(String::from("A"), Shape::Rock);
    opponent_choices.insert(String::from("B"), Shape::Paper);
    opponent_choices.insert(String::from("C"), Shape::Scissors);

    let mut choices = HashMap::new();
    choices.insert(String::from("X"), Shape::Rock);
    choices.insert(String::from("Y"), Shape::Paper);
    choices.insert(String::from("Z"), Shape::Scissors);

    let mut opponent_opposites = HashMap::new();
    opponent_opposites.insert(Shape::Rock, Shape::Paper);
    opponent_opposites.insert(Shape::Paper, Shape::Scissors);
    opponent_opposites.insert(Shape::Scissors, Shape::Rock);

    let file = File::open("input.txt")?;
    let reader = BufReader::new(file);

    let mut total: i32 = 0;

    for line in reader.lines() {
        let line = line.unwrap();
        let (raw_opponent_choice, raw_player_choice) = line.split_whitespace().collect_tuple().expect("line is parseable");

        let opponent_choice = opponent_choices.get(raw_opponent_choice).expect("opponent choice should be defined");
        let player_choice = choices.get(raw_player_choice).expect("player choice should be defined");
        let winning_choice = opponent_opposites.get(opponent_choice).expect("opposite of opponent choice should be defined");
        let win = winning_choice.eq(player_choice);
        let result = match win {
            true => MatchResult::Win,
            false => {
                if opponent_choice.eq(player_choice) {
                    MatchResult::Draw
                } else {
                    MatchResult::Lose
                }
            }
        };

        // let result_value = match_result_values.get(&result).expect("match result should have defined value");
        let shape_score = shape_scores.get(&player_choice).expect("player choice should have defined score");
        let result_score = match_result_score.get(&result).expect("match result should have defined score");
        let round_total_score = shape_score + result_score;
        total += round_total_score;

        println!("opponent: {:?}; you: {:?}; win: {}; score: {}", opponent_choice, player_choice, win, round_total_score);
    }

    println!("final score: {}", total);

    Ok(())
}