import { Question } from "./questions";

function rng(seed: number) {
  let value = seed >>> 0;
  return () => {
    value = (value * 1664525 + 1013904223) >>> 0;
    return value / 4294967296;
  };
}

function whole(random: () => number, min: number, max: number) {
  return Math.floor(random() * (max - min + 1)) + min;
}

function gcd(a: number, b: number): number {
  return b === 0 ? Math.abs(a) : gcd(b, a % b);
}

function fraction(numerator: number, denominator: number) {
  const divisor = gcd(numerator, denominator);
  return `${numerator / divisor}/${denominator / divisor}`;
}

function uniqueNumberChoices(answer: number, offsets = [-2, -1, 0, 1, 2]) {
  return offsets.map((offset) => String(answer + offset));
}

function shuffle(question: Question, random: () => number): Question {
  const indexed = question.choices.map((choice, index) => ({ choice, index }));
  for (let index = indexed.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(random() * (index + 1));
    [indexed[index], indexed[swap]] = [indexed[swap], indexed[index]];
  }
  return {
    ...question,
    choices: indexed.map((item) => item.choice),
    correct: indexed
      .map((item, index) => (question.correct.includes(item.index) ? index : -1))
      .filter((index) => index >= 0),
  };
}

function algebra(base: Question, random: () => number, seed: number): Question {
  const answer = whole(random, 4, 18);
  const a = whole(random, 2, 6);
  const b = whole(random, 1, 6);
  let d = whole(random, 1, a - 1);
  if (d === a) d -= 1;
  const c = whole(random, 1, 9);
  const right = a * (answer - b) + c - d * answer;
  const choices = uniqueNumberChoices(answer, [-3, -1, 0, 2, 4]);
  return shuffle({
    ...base,
    variantKey: `${base.id}-${seed}`,
    prompt: `If ${a}(x − ${b}) + ${c} = ${d}x + ${right}, what is the value of x?`,
    choices,
    correct: [2],
    concept: "An equation is a balance. Your job is to undo operations without changing that balance.",
    prerequisite: "You only need distribution, combining like terms, and inverse operations.",
    hints: [
      `Distribute ${a} to both x and −${b}.`,
      `After distribution, put every x-term on one side and every number on the other.`,
      `The equation becomes ${(a - d)}x = ${(a - d) * answer}.`,
    ],
    steps: [
      `Distribute: ${a}x − ${a * b} + ${c} = ${d}x + ${right}.`,
      `Combine the constants on the left: ${a}x ${c - a * b >= 0 ? "+" : "−"} ${Math.abs(c - a * b)} = ${d}x + ${right}.`,
      `Subtract ${d}x from both sides: ${a - d}x ${c - a * b >= 0 ? "+" : "−"} ${Math.abs(c - a * b)} = ${right}.`,
      `Move the constant, then divide by ${a - d}: x = ${answer}.`,
    ],
    explanation: `The legal moves are distribution, collecting like terms, and doing the same thing to both sides. Those steps isolate x and give x = ${answer}.`,
    alternate: `Backsolve from the choices: substitute ${answer}. Both sides equal ${d * answer + right}, so it works. On multiple-choice algebra, backsolving can be faster than formal solving.`,
    check: `Substitute x = ${answer}: left side = ${a}(${answer - b}) + ${c} = ${a * (answer - b) + c}; right side = ${d}(${answer}) + ${right} = ${d * answer + right}. They match.`,
    trap: `A common mistake is distributing ${a} to x but not to −${b}. The multiplier applies to everything inside the parentheses.`,
    takeaway: "Treat an equation like a balanced scale: whatever you do to one side, do to the other.",
  }, random);
}

function ratio(base: Question, random: () => number, seed: number): Question {
  const first = whole(random, 2, 6);
  const second = whole(random, first + 2, first + 8);
  const k = whole(random, 3, 11);
  const total = (first + second) * k;
  const answer = first * k;
  const choices = [answer - k, answer, second * k, k, total].map(String);
  return shuffle({
    ...base,
    variantKey: `${base.id}-${seed}`,
    difficulty: 2,
    prompt: `The ratio of blue tiles to gold tiles is ${first}:${second}. If there are ${total} tiles altogether, how many are blue?`,
    choices,
    correct: [1],
    concept: `The ratio ${first}:${second} describes ${first + second} equal-size parts—not ${first + second} actual tiles.`,
    prerequisite: "You need multiplication, division, and the idea that ratio parts share one multiplier.",
    hints: [
      `Add the ratio parts: ${first} + ${second} = ${first + second}.`,
      `Find one part: ${total} ÷ ${first + second}.`,
      `Blue uses ${first} parts, so multiply one part by ${first}.`,
    ],
    steps: [
      `Write blue = ${first}k and gold = ${second}k. The same k is used because every ratio part has the same size.`,
      `Use the total: ${first}k + ${second}k = ${total}, so ${first + second}k = ${total}.`,
      `Divide: k = ${total} ÷ ${first + second} = ${k}.`,
      `Blue = ${first}k = ${first} × ${k} = ${answer}.`,
    ],
    explanation: `There are ${first + second} ratio parts altogether. Each part represents ${k} tiles, and ${first} of those parts are blue.`,
    alternate: `Use the fraction method: blue is ${first}/${first + second} of the total, so (${first}/${first + second}) × ${total} = ${answer}.`,
    check: `${answer}:${second * k} simplifies to ${first}:${second}, and ${answer} + ${second * k} = ${total}.`,
    trap: `The number ${first} is a ratio part, not the number of blue tiles. You must first discover what one part is worth.`,
    takeaway: "Add the parts, find one part, then build the requested amount.",
  }, random);
}

function numberProperties(base: Question, random: () => number, seed: number): Question {
  const divisor = whole(random, 5, 11);
  const remainder = whole(random, 1, divisor - 1);
  const multiplier = whole(random, 2, 5);
  const add = whole(random, 2, 12);
  const answer = (multiplier * remainder + add) % divisor;
  const choices = Array.from({ length: 5 }, (_, index) => String((answer + index) % divisor));
  return shuffle({
    ...base,
    variantKey: `${base.id}-${seed}`,
    prompt: `When positive integer n is divided by ${divisor}, the remainder is ${remainder}. What is the remainder when ${multiplier}n + ${add} is divided by ${divisor}?`,
    choices,
    correct: [0],
    concept: `A remainder tells you that n can be replaced by ${remainder} when you only care about division by ${divisor}.`,
    prerequisite: "You need division with remainders and basic substitution.",
    hints: [
      `For remainder work, replace n with ${remainder}.`,
      `Compute ${multiplier}(${remainder}) + ${add}.`,
      `Divide that result by ${divisor} and keep only the remainder.`,
    ],
    steps: [
      `Translate the condition: n = ${divisor}q + ${remainder} for some integer q.`,
      `Substitute: ${multiplier}n + ${add} = ${multiplier}(${divisor}q + ${remainder}) + ${add}.`,
      `The ${divisor * multiplier}q portion is divisible by ${divisor}, so it contributes no remainder.`,
      `${multiplier}(${remainder}) + ${add} = ${multiplier * remainder + add}; dividing by ${divisor} leaves remainder ${answer}.`,
    ],
    explanation: `For modular questions, discard complete groups of ${divisor}. Only ${multiplier} × ${remainder} + ${add} matters.`,
    alternate: `Pick a legal example: use n = ${divisor + remainder}. Then calculate ${multiplier}n + ${add} and divide by ${divisor}; the same remainder ${answer} appears.`,
    check: `The final remainder ${answer} is between 0 and ${divisor - 1}, as every valid remainder must be.`,
    trap: "Stopping after multiplying the original remainder ignores the added constant and the need to reduce again.",
    takeaway: "Replace with the remainder, perform the operations, then reduce once more.",
  }, random);
}

function percents(base: Question, random: () => number, seed: number): Question {
  const original = whole(random, 4, 18) * 20;
  const rate = [10, 20, 25, 30, 40][whole(random, 0, 4)];
  const increase = random() > 0.5;
  const answer = increase ? original * (1 + rate / 100) : original * (1 - rate / 100);
  const choices = [answer, original + rate, original - rate, original * rate / 100, original].map((n) => String(n));
  return shuffle({
    ...base,
    variantKey: `${base.id}-${seed}`,
    difficulty: 2,
    prompt: `A value of ${original} is ${increase ? "increased" : "decreased"} by ${rate}%. What is the new value?`,
    choices,
    correct: [0],
    concept: `A percent is a fraction out of 100. A ${rate}% change means a change of ${rate / 100} times the original.`,
    prerequisite: "You need decimal multiplication and the distinction between the change and the new total.",
    hints: [
      `Find ${rate}% of ${original}.`,
      `${rate}% = ${rate / 100}, so compute ${original} × ${rate / 100}.`,
      `${increase ? "Add" : "Subtract"} that change from ${original}.`,
    ],
    steps: [
      `Convert the percent: ${rate}% = ${rate / 100}.`,
      `Find the change: ${original} × ${rate / 100} = ${original * rate / 100}.`,
      `${increase ? "Add" : "Subtract"} the change: ${original} ${increase ? "+" : "−"} ${original * rate / 100} = ${answer}.`,
    ],
    explanation: `The percentage is based on the original ${original}. First find the size of the change, then apply it in the stated direction.`,
    alternate: `Use one multiplier: ${increase ? 1 + rate / 100 : 1 - rate / 100}. Then ${original} × ${increase ? 1 + rate / 100 : 1 - rate / 100} = ${answer}.`,
    check: `A ${increase ? "higher" : "lower"} result must be ${increase ? "greater" : "less"} than ${original}; ${answer} passes that reasonableness check.`,
    trap: `The change is ${original * rate / 100}, but the question asks for the new value, not merely the amount of change.`,
    takeaway: "Percent of the original gives the change; then add or subtract it.",
  }, random);
}

function geometry(base: Question, random: () => number, seed: number): Question {
  const radius = whole(random, 3, 12);
  const circumferenceFactor = 2 * radius;
  const areaFactor = radius * radius;
  const choices = [`${areaFactor}π`, `${circumferenceFactor}π`, `${radius}π`, `${areaFactor * 2}π`, `${radius * 4}π`];
  return shuffle({
    ...base,
    variantKey: `${base.id}-${seed}`,
    difficulty: 3,
    prompt: `A circle has circumference ${circumferenceFactor}π. What is its area?`,
    choices,
    correct: [0],
    concept: "Circumference measures distance around a circle; area measures the space inside it. Radius connects the two formulas.",
    prerequisite: "Know C = 2πr and A = πr². The symbol π can stay symbolic.",
    hints: [
      `Start with circumference: 2πr = ${circumferenceFactor}π.`,
      "Cancel π from both sides, then solve for r.",
      `Once r = ${radius}, substitute it into A = πr².`,
    ],
    steps: [
      `Use C = 2πr: 2πr = ${circumferenceFactor}π.`,
      `Divide by 2π: r = ${circumferenceFactor}π ÷ 2π = ${radius}.`,
      `Use A = πr²: A = π(${radius})².`,
      `Square the radius: A = ${areaFactor}π.`,
    ],
    explanation: `The circumference reveals the radius. After finding r = ${radius}, switch formulas and square the radius for area.`,
    alternate: `Because C = 2πr, the number multiplying π in the circumference is the diameter. Half of ${circumferenceFactor} is ${radius}, the radius.`,
    check: `A radius of ${radius} gives circumference 2π(${radius}) = ${circumferenceFactor}π, matching the prompt.`,
    trap: `Using ${circumferenceFactor} as the radius confuses diameter with radius and makes the area four times too large.`,
    takeaway: "Circumference coefficient → halve for radius → square for area.",
  }, random);
}

function statistics(base: Question, random: () => number, seed: number): Question {
  const count = whole(random, 6, 12);
  const mean = whole(random, 12, 28);
  const newMean = whole(random, Math.max(5, mean - 7), mean - 1);
  const answer = count * mean - (count - 1) * newMean;
  const choices = [answer, mean - newMean, mean, count * mean, answer - 1].map(String);
  return shuffle({
    ...base,
    variantKey: `${base.id}-${seed}`,
    prompt: `The mean of ${count} numbers is ${mean}. After one number is removed, the mean of the remaining ${count - 1} numbers is ${newMean}. What number was removed?`,
    choices,
    correct: [0],
    concept: "A mean is a disguised total: total = mean × number of values.",
    prerequisite: "You need multiplication and subtraction; you do not need to know the individual data values.",
    hints: [
      `Find the original sum: ${count} × ${mean}.`,
      `Find the remaining sum: ${count - 1} × ${newMean}.`,
      "Original sum − remaining sum = removed value.",
    ],
    steps: [
      `Original total = ${count} × ${mean} = ${count * mean}.`,
      `Remaining total = ${count - 1} × ${newMean} = ${(count - 1) * newMean}.`,
      `Removed value = ${count * mean} − ${(count - 1) * newMean} = ${answer}.`,
    ],
    explanation: "The mean itself cannot be subtracted directly because the two groups have different sizes. Convert both means to sums first.",
    alternate: `Think of ${count} boxes each averaging ${mean}. Their combined content is ${count * mean}; the ${count - 1} remaining boxes contain ${(count - 1) * newMean}.`,
    check: `Put ${answer} back: (${(count - 1) * newMean} + ${answer}) ÷ ${count} = ${mean}.`,
    trap: `Subtracting the means gives ${mean - newMean}, but that is not a data value; means summarize groups of different sizes.`,
    takeaway: "Whenever a mean changes, convert every mean into a sum first.",
  }, random);
}

function probability(base: Question, random: () => number, seed: number): Question {
  const red = whole(random, 2, 7);
  const blue = whole(random, 2, 7);
  const green = whole(random, 1, 5);
  const total = red + blue + green;
  const correctFraction = fraction(red, total);
  const choices = [correctFraction, fraction(red, blue + green), fraction(blue, total), fraction(red + blue, total), fraction(1, total)];
  return shuffle({
    ...base,
    variantKey: `${base.id}-${seed}`,
    difficulty: 2,
    prompt: `A bag contains ${red} red, ${blue} blue, and ${green} green marbles. One marble is selected at random. What is the probability that it is red?`,
    choices,
    correct: [0],
    concept: "Probability is the share of all equally likely outcomes that count as success.",
    prerequisite: "You need addition and fractions.",
    hints: [
      `Count favorable outcomes: there are ${red} red marbles.`,
      `Count all outcomes: ${red} + ${blue} + ${green}.`,
      "Probability = favorable ÷ total.",
    ],
    steps: [
      `Favorable outcomes = ${red} red marbles.`,
      `Total outcomes = ${red} + ${blue} + ${green} = ${total} marbles.`,
      `Probability = ${red}/${total}${correctFraction !== `${red}/${total}` ? ` = ${correctFraction}` : ""}.`,
    ],
    explanation: `Every marble is equally likely. ${red} of the ${total} possible marbles produce the event “red.”`,
    alternate: `Imagine labeling all ${total} marbles. Exactly ${red} labels are winners, so the winning fraction is ${correctFraction}.`,
    check: `The probability is between 0 and 1, and because red is ${red} of ${total} marbles, ${correctFraction} is reasonable.`,
    trap: "The denominator includes every marble, not only the non-red marbles.",
    takeaway: "Probability = wanted outcomes ÷ all equally likely outcomes.",
  }, random);
}

const textCompletion = [
  {
    prompt: "Although the scientist was usually cautious, her latest claim was surprisingly ____.",
    choices: ["tentative", "audacious", "methodical", "derivative", "obscure"], correct: 1,
    clue: "Although creates a contrast with cautious; the blank must mean bold.", word: "audacious means bold or daring",
  },
  {
    prompt: "Because the instructions were deliberately ____, even experienced users interpreted them in conflicting ways.",
    choices: ["lucid", "ambiguous", "exhaustive", "concise", "mandatory"], correct: 1,
    clue: "Because introduces a cause; conflicting interpretations require unclear wording.", word: "ambiguous means open to more than one interpretation",
  },
  {
    prompt: "The mayor's apology sounded sincere rather than ____, and it therefore quieted much of the criticism.",
    choices: ["contrite", "perfunctory", "candid", "gracious", "explicit"], correct: 1,
    clue: "Rather than creates an opposition; sincere contrasts with merely routine.", word: "perfunctory means done with minimal effort or sincerity",
  },
  {
    prompt: "Far from being ____, the new evidence settled a debate that had persisted for decades.",
    choices: ["conclusive", "decisive", "equivocal", "rigorous", "novel"], correct: 2,
    clue: "Far from reverses direction; evidence that settled a debate was not uncertain.", word: "equivocal means ambiguous or uncertain",
  },
];

const sentenceEquivalence = [
  { prompt: "The professor's explanation was so ____ that even novices understood the difficult theory.", choices: ["lucid", "opaque", "pellucid", "ornate", "terse", "speculative"], correct: [0, 2], clue: "The result—novices understood—requires clear.", pair: "lucid and pellucid both mean very clear" },
  { prompt: "The witness remained ____ despite repeated attempts to provoke an emotional response.", choices: ["agitated", "impassive", "animated", "unflappable", "verbose", "candid"], correct: [1, 3], clue: "Despite signals that provocation failed; the witness stayed calm.", pair: "impassive and unflappable both convey calm composure" },
  { prompt: "The critic found the sequel utterly ____, offering nothing that the original had not already done.", choices: ["innovative", "derivative", "imaginative", "imitative", "subtle", "coherent"], correct: [1, 3], clue: "Offering nothing new means copied.", pair: "derivative and imitative both mean unoriginal" },
];

const reading = [
  { passage: "For decades, historians described the city's public parks primarily as decorative projects. Recent archival work shows, however, that planners also designed them to improve drainage and public health. The newer account does not reject the parks' aesthetic role; it reveals that their purposes were multiple.", prompt: "The primary purpose of the passage is to", choices: ["argue that beauty was irrelevant to park design", "replace one exclusive explanation with a broader account", "criticize historians for ignoring archival evidence", "prove that drainage was the parks' main purpose", "compare parks in several cities"], correct: 1, clue: "Track the movement: old single emphasis → new additional purposes → both can coexist." },
  { passage: "Some researchers infer animal intelligence from performance on puzzle tasks. Yet success may depend as much on an animal's familiarity with human-made objects as on its reasoning ability. Cross-species comparisons should therefore use tasks adapted to each species' ordinary environment.", prompt: "The author is primarily concerned that", choices: ["animals cannot solve human-made puzzles", "intelligence cannot be studied experimentally", "standard tasks may measure familiarity as well as reasoning", "species differ too much for any comparison", "researchers prefer complex tasks"], correct: 2, clue: "The warning is about a confounding factor: familiarity may masquerade as intelligence." },
  { passage: "A small study found that employees who took walking meetings generated more ideas than those who sat. The result is suggestive, but participants chose their own meeting format. More creative employees may simply have been more willing to walk, so a randomized trial is needed.", prompt: "Why does the author call for a randomized trial?", choices: ["to increase the number of ideas in every meeting", "to separate the effect of walking from self-selection", "to prove that sitting prevents creativity", "to measure employee fitness", "to make meetings longer"], correct: 1, clue: "The final sentence identifies self-selection as the alternative explanation." },
];

const argumentLogic = [
  { prompt: "A bookstore began hosting weekly readings, and sales rose the following month. The owner concludes that the readings caused the increase. Which fact most weakens the conclusion?", choices: ["Some readings featured poetry.", "A popular film adaptation of the store's bestselling novel opened that month.", "The store has comfortable chairs.", "Several employees enjoy public speaking.", "Readings are held on Thursdays."], correct: 1, clue: "Find another cause that could explain the same rise in sales." },
  { prompt: "Students who use the optional tutoring center earn higher grades than students who do not. The school concludes that tutoring improves grades. Which assumption is required?", choices: ["Tutoring is offered every weekday.", "Tutors enjoy their work.", "Students who seek tutoring were not already systematically stronger students.", "All courses use the same grading scale.", "The center is inexpensive to operate."], correct: 2, clue: "Optional participation creates self-selection; the groups may have differed before tutoring." },
  { prompt: "A town plans to copy a neighboring town's bike-share program because that program reduced car traffic. Which fact most weakens the plan?", choices: ["The neighboring town's bicycles are blue.", "The neighboring town has a dense subway network linking every bike station.", "Some residents own bicycles.", "The program uses a phone app.", "Car traffic varies by season."], correct: 1, clue: "Attack the comparison by finding a relevant difference between the towns." },
];

function verbal(base: Question, random: () => number, seed: number): Question {
  if (base.skill === "Text Completion") {
    const item = textCompletion[seed % textCompletion.length];
    return shuffle({ ...base, variantKey: `${base.id}-${seed}`, prompt: item.prompt, choices: item.choices, correct: [item.correct], concept: "The sentence gives logical instructions. Vocabulary comes after you determine the required direction.", prerequisite: "Learn contrast words (although, rather than, far from) and cause words (because, therefore).", hints: ["Ignore the choices and identify the logic word.", item.clue, `Now choose the word that completes that predicted meaning.`], steps: ["Locate the logic signal and decide whether ideas support or oppose each other.", item.clue, `Test the options against that prediction. ${item.word}.`], explanation: `${item.clue} The correct word is the only option that satisfies the sentence's logic and tone.`, alternate: "Replace the blank with a simple word first—such as bold, unclear, or routine—then find its closest option.", check: "Read the completed sentence aloud. Both halves should form one clear logical relationship.", trap: "Choosing a word because it sounds sophisticated is not enough; it must obey the sentence's structure.", takeaway: "Do not ask which word sounds good. Ask what the sentence requires." }, random);
  }
  if (base.skill === "Sentence Equivalence") {
    const item = sentenceEquivalence[seed % sentenceEquivalence.length];
    return shuffle({ ...base, variantKey: `${base.id}-${seed}`, type: "multiple", prompt: item.prompt, choices: item.choices, correct: item.correct, concept: "You are building two completed sentences that must mean the same thing.", prerequisite: "Predict the blank and recognize synonym pairs in context.", hints: ["Cover the options and predict a plain word.", item.clue, `Look for two options that express the same predicted idea.`], steps: ["Use the sentence evidence to predict the blank.", item.clue, `Group likely synonyms; ${item.pair}.`, "Insert each word and verify that both completed sentences have the same meaning."], explanation: `${item.clue} ${item.pair}.`, alternate: "Scan for synonym pairs first, but eliminate any pair that does not fit the sentence evidence.", check: "Read the sentence twice, once with each answer. The overall message should remain equivalent.", trap: "Two words can each fit grammatically but still create different meanings; that pair is wrong.", takeaway: "One prediction, two context-matched synonyms." }, random);
  }
  if (base.skill === "Reading Comprehension") {
    const item = reading[seed % reading.length];
    return shuffle({ ...base, variantKey: `${base.id}-${seed}`, passage: item.passage, prompt: item.prompt, choices: item.choices, correct: [item.correct], concept: "Reading Comprehension rewards a map of the author's argument, not memorization of every sentence.", prerequisite: "Identify contrast words, conclusions, and the difference between evidence and opinion.", hints: ["State what each sentence does in two or three words.", item.clue, "Reject answers that are too extreme, outside the passage, or reverse the author's point."], steps: ["Map the passage's structure instead of rereading every word.", item.clue, "Predict the answer in your own words.", "Choose the option that matches the prediction without adding a new claim."], explanation: item.clue, alternate: "For a detail question, return to the exact lines and use them as evidence; do not answer from memory.", check: "Point to the sentence or structural move that proves your choice. If you cannot, reconsider it.", trap: "A choice may repeat passage vocabulary yet distort the author's relationship between ideas.", takeaway: "Map first, predict second, prove from the passage third." }, random);
  }
  const item = argumentLogic[seed % argumentLogic.length];
  return shuffle({ ...base, variantKey: `${base.id}-${seed}`, prompt: item.prompt, choices: item.choices, correct: [item.correct], concept: "An argument contains evidence, a conclusion, and an unstated bridge connecting them.", prerequisite: "Separate what the author observed from what the author claims that observation proves.", hints: ["Underline the conclusion.", item.clue, "Pick the choice that attacks or supplies the bridge—not merely one that mentions the topic."], steps: ["Identify the evidence and conclusion separately.", "State the missing bridge between them.", item.clue, "Test each option only against that logical gap."], explanation: item.clue, alternate: "For assumption questions, negate a choice. If the argument collapses, that choice was required.", check: "After applying the correct choice, explain exactly why the conclusion becomes less secure or more dependent.", trap: "Relevant-sounding background information does not matter unless it changes the evidence-to-conclusion link.", takeaway: "Attack the gap, not the topic." }, random);
}

export function materializeQuestion(base: Question, seed = Date.now()): Question {
  const random = rng(seed);
  switch (base.skill) {
    case "Algebra": return algebra(base, random, seed);
    case "Ratios & Rates": return ratio(base, random, seed);
    case "Number Properties": return numberProperties(base, random, seed);
    case "Percents": return percents(base, random, seed);
    case "Geometry": return geometry(base, random, seed);
    case "Statistics": return statistics(base, random, seed);
    case "Probability": return probability(base, random, seed);
    default: return verbal(base, random, seed);
  }
}
