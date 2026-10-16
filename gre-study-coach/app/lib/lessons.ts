export type Lesson = {
  skill: string;
  domain: "Quant" | "Verbal";
  minutes: number;
  title: string;
  summary: string;
  rules: string[];
  method: string[];
  example: {
    prompt: string;
    work: string;
    answer: string;
  };
  memory: string;
};

export const lessons: Lesson[] = [
  {
    skill: "Algebra",
    domain: "Quant",
    minutes: 12,
    title: "Equations, inequalities, and translation",
    summary:
      "Most GRE algebra rewards clean translation and legal operations more than advanced mathematics.",
    rules: [
      "Do the same operation to both sides of an equation.",
      "Reverse an inequality only when multiplying or dividing by a negative.",
      "Translate “is” as equals, “of” as multiplication, and “per” as division.",
    ],
    method: [
      "Name the unknown with a variable.",
      "Translate one phrase at a time.",
      "Simplify before solving.",
      "Check the result in the original condition.",
    ],
    example: {
      prompt: "Three less than twice a number is 17.",
      work: "2x − 3 = 17 → 2x = 20 → x = 10",
      answer: "The number is 10.",
    },
    memory: "Translate slowly; solve quickly; check once.",
  },
  {
    skill: "Ratios & Rates",
    domain: "Quant",
    minutes: 14,
    title: "Ratios, proportions, work, and motion",
    summary:
      "Ratios compare parts; rates compare quantities with different units. Keeping the units visible prevents most traps.",
    rules: [
      "Write ratio parts as ak and bk.",
      "Distance = rate × time.",
      "For simultaneous work, add work rates such as 1/6 + 1/4.",
    ],
    method: [
      "Label every quantity and unit.",
      "Choose a ratio multiplier or rate equation.",
      "Make units cancel deliberately.",
      "Check whether the answer asks for a part, total, rate, or time.",
    ],
    example: {
      prompt: "A 2:5 ratio has a total of 42. Find the smaller part.",
      work: "2k + 5k = 42 → 7k = 42 → k = 6 → 2k = 12",
      answer: "The smaller part is 12.",
    },
    memory: "Ratios share k; rates carry units.",
  },
  {
    skill: "Number Properties",
    domain: "Quant",
    minutes: 13,
    title: "Integers, divisibility, remainders, and parity",
    summary:
      "GRE number-property questions are pattern questions disguised as arithmetic.",
    rules: [
      "Even ± even is even; odd ± odd is even; even × anything is even.",
      "For integer n divided by d: n = dq + r, where 0 ≤ r < d.",
      "A number is divisible by both a and b when it is divisible by their least common multiple.",
    ],
    method: [
      "Identify whether the question is about parity, factors, or remainders.",
      "Use a small legal example when variables are abstract.",
      "Reduce remainders after every operation.",
      "Test boundary cases such as zero and one.",
    ],
    example: {
      prompt: "If n leaves remainder 2 when divided by 5, what about n + 9?",
      work: "n ≡ 2 (mod 5); n + 9 ≡ 2 + 9 = 11 ≡ 1 (mod 5)",
      answer: "The remainder is 1.",
    },
    memory: "Replace the number with the remainder, then reduce again.",
  },
  {
    skill: "Percents",
    domain: "Quant",
    minutes: 10,
    title: "Percent change and comparison",
    summary:
      "The essential question is always: percent of what base?",
    rules: [
      "New value = original × (1 ± rate).",
      "Percent change = change ÷ original × 100.",
      "Successive percent changes multiply; they do not simply add.",
    ],
    method: [
      "Identify the original value.",
      "Convert the percent to a decimal multiplier.",
      "Apply increases and decreases in order.",
      "Translate back into the requested form.",
    ],
    example: {
      prompt: "Increase 80 by 25%.",
      work: "80 × 1.25 = 100",
      answer: "The new value is 100.",
    },
    memory: "The word “of” points to the base.",
  },
  {
    skill: "Geometry",
    domain: "Quant",
    minutes: 16,
    title: "Lines, triangles, circles, and coordinate geometry",
    summary:
      "A compact formula set plus careful diagrams covers nearly all GRE geometry.",
    rules: [
      "Triangle angles sum to 180°; a straight line is 180°.",
      "Right triangles obey a² + b² = c².",
      "Circle circumference = 2πr and area = πr².",
      "Slope = rise/run; distance comes from the Pythagorean theorem.",
    ],
    method: [
      "Redraw and label only known facts.",
      "Mark equal sides, right angles, and parallel lines.",
      "Choose a formula only after identifying the requested quantity.",
      "Estimate the scale of the answer before calculating.",
    ],
    example: {
      prompt: "A right triangle has legs 6 and 8. Find its hypotenuse.",
      work: "c² = 6² + 8² = 36 + 64 = 100 → c = 10",
      answer: "The hypotenuse is 10.",
    },
    memory: "Label first. Formula second. Compute last.",
  },
  {
    skill: "Statistics",
    domain: "Quant",
    minutes: 12,
    title: "Center, spread, and data interpretation",
    summary:
      "Statistics questions test what a measure means, not just how to calculate it.",
    rules: [
      "Mean = sum ÷ count, so sum = mean × count.",
      "Median is the middle after sorting.",
      "Range = maximum − minimum.",
      "Standard deviation measures spread, not center.",
    ],
    method: [
      "Write what the statistic represents.",
      "For changed means, convert means into sums.",
      "Sort before finding a median.",
      "Compare distributions by center and spread separately.",
    ],
    example: {
      prompt: "Five values have a mean of 12. What is their sum?",
      work: "Sum = mean × count = 12 × 5",
      answer: "The sum is 60.",
    },
    memory: "Means hide sums; recover the sum first.",
  },
  {
    skill: "Probability",
    domain: "Quant",
    minutes: 14,
    title: "Probability and counting",
    summary:
      "Count the favorable outcomes and total outcomes from the same universe.",
    rules: [
      "Probability = favorable outcomes ÷ total outcomes.",
      "For independent “and,” multiply probabilities.",
      "For mutually exclusive “or,” add probabilities.",
      "Use 1 − P(unwanted) for “at least one.”",
    ],
    method: [
      "Define one equally likely outcome.",
      "Decide whether order matters.",
      "Count the total and favorable sets consistently.",
      "Check that the probability is between 0 and 1.",
    ],
    example: {
      prompt: "A fair coin is flipped twice. Probability of exactly one head?",
      work: "Outcomes: HH, HT, TH, TT. Favorable: HT and TH.",
      answer: "2/4 = 1/2.",
    },
    memory: "Same-sized outcomes in the numerator and denominator.",
  },
  {
    skill: "Text Completion",
    domain: "Verbal",
    minutes: 11,
    title: "Sentence logic before vocabulary",
    summary:
      "The blank is constrained by logic words, tone, and evidence already in the sentence.",
    rules: [
      "Contrast signals include although, yet, despite, and however.",
      "Support signals include because, indeed, moreover, and colon.",
      "For multiple blanks, solve the most constrained blank first.",
    ],
    method: [
      "Cover the choices.",
      "Mark the logic signal.",
      "Predict a simple word or direction.",
      "Select the choice that matches both meaning and tone.",
    ],
    example: {
      prompt: "Although usually reserved, the speaker was surprisingly ____.",
      work: "“Although” requires the opposite of reserved: outgoing or expressive.",
      answer: "Choose the option closest to animated or effusive.",
    },
    memory: "Logic first. Prediction second. Vocabulary third.",
  },
  {
    skill: "Sentence Equivalence",
    domain: "Verbal",
    minutes: 12,
    title: "Build two sentences with one meaning",
    summary:
      "The correct pair must fit individually and produce equivalent completed sentences.",
    rules: [
      "The two answers are usually synonyms in context.",
      "Two words that merely fit are insufficient if they change the sentence’s meaning.",
      "Negation and contrast frequently reverse the expected direction.",
    ],
    method: [
      "Read without choices and predict.",
      "Group choices into possible synonym pairs.",
      "Test each member in the sentence.",
      "Compare the meanings of the two completed sentences.",
    ],
    example: {
      prompt: "The plan was not accidental but carefully ____.",
      work: "Prediction: planned. A valid pair could be contrived and premeditated.",
      answer: "Choose the two planned-like words.",
    },
    memory: "One prediction, two matching answers.",
  },
  {
    skill: "Reading Comprehension",
    domain: "Verbal",
    minutes: 16,
    title: "Structure, evidence, and author stance",
    summary:
      "You do not need to remember every detail; you need a map of what each sentence does.",
    rules: [
      "Main-idea answers cover the whole passage without becoming broader than it.",
      "Inference answers must be supported, not merely plausible.",
      "Extreme words such as always and completely require extreme evidence.",
    ],
    method: [
      "Read for purpose, shifts, and conclusion.",
      "State the passage’s job in one sentence.",
      "Return to the relevant lines for detail questions.",
      "Eliminate choices that are outside scope, reversed, or too strong.",
    ],
    example: {
      prompt: "A passage presents an old view, new evidence, then a qualified conclusion.",
      work: "Map: background → contrast → author’s synthesis.",
      answer: "The main idea should express the qualified synthesis.",
    },
    memory: "Map the argument; verify the answer in the text.",
  },
  {
    skill: "Argument Logic",
    domain: "Verbal",
    minutes: 13,
    title: "Assumptions, causation, and comparisons",
    summary:
      "Arguments move from evidence to a conclusion across an unstated bridge: the assumption.",
    rules: [
      "A required assumption must be true for the conclusion to follow.",
      "Correlation alone does not prove causation.",
      "Comparison arguments assume the compared groups are relevantly similar.",
    ],
    method: [
      "Separate evidence from conclusion.",
      "Name the gap between them.",
      "For assumptions, negate a choice and see whether the argument collapses.",
      "For weaken questions, attack the gap—not merely the topic.",
    ],
    example: {
      prompt: "Workshop attendees outperform nonattendees; therefore the workshop caused improvement.",
      work: "Gap: attendees may have been stronger before choosing the workshop.",
      answer: "The argument assumes no important preexisting difference.",
    },
    memory: "Evidence + assumption = conclusion.",
  },
];
