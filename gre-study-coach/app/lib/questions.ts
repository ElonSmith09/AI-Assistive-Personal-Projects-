export type Domain = "Quant" | "Verbal";

export type Question = {
  id: string;
  domain: Domain;
  skill: string;
  difficulty: 1 | 2 | 3 | 4 | 5;
  type: "single" | "multiple";
  prompt: string;
  passage?: string;
  choices: string[];
  correct: number[];
  explanation: string;
  trap: string;
  takeaway: string;
  variantKey?: string;
  concept?: string;
  prerequisite?: string;
  steps?: string[];
  alternate?: string;
  check?: string;
  hints?: string[];
};

export const questions: Question[] = [
  {
    id: "q-algebra-01",
    domain: "Quant",
    skill: "Algebra",
    difficulty: 2,
    type: "single",
    prompt:
      "If 3(x − 2) + 5 = 2x + 11, what is the value of x?",
    choices: ["8", "10", "12", "14", "16"],
    correct: [2],
    explanation:
      "Expand first: 3x − 6 + 5 = 2x + 11, so 3x − 1 = 2x + 11. Subtract 2x and add 1 to get x = 12.",
    trap:
      "Distributing the 3 to x but not to −2 changes the equation.",
    takeaway: "Distribute completely before combining like terms.",
  },
  {
    id: "q-algebra-02",
    domain: "Quant",
    skill: "Algebra",
    difficulty: 4,
    type: "single",
    prompt:
      "For how many integer values of x is |2x − 3| < 7?",
    choices: ["5", "6", "7", "8", "9"],
    correct: [1],
    explanation:
      "Rewrite as −7 < 2x − 3 < 7. Add 3: −4 < 2x < 10. Divide by 2: −2 < x < 5. The integers are −1, 0, 1, 2, 3, and 4: six values.",
    trap:
      "The strict inequalities exclude −2 and 5; counting them creates two extra values.",
    takeaway: "Translate absolute-value inequalities into a compound inequality.",
  },
  {
    id: "q-ratio-01",
    domain: "Quant",
    skill: "Ratios & Rates",
    difficulty: 3,
    type: "single",
    prompt:
      "A solution contains acid and water in the ratio 3:7. After 8 liters of water are added, the ratio becomes 1:3. How many liters of acid were in the original solution?",
    choices: ["4", "6", "8", "9", "12"],
    correct: [4],
    explanation:
      "Let acid = 3k and water = 7k. Then 3k/(7k + 8) = 1/3. Cross-multiply: 9k = 7k + 8, so k = 4 and acid = 12 liters.",
    trap:
      "The ratio multiplier k is not the amount of acid; acid equals 3k.",
    takeaway: "Represent ratio parts with one shared multiplier.",
  },
  {
    id: "q-rate-02",
    domain: "Quant",
    skill: "Ratios & Rates",
    difficulty: 5,
    type: "single",
    prompt:
      "Machine A completes a job in 6 hours and machine B completes it in 4 hours. They work together for 90 minutes, after which B stops. How many additional hours does A need to finish the job?",
    choices: ["1.75", "2.00", "2.25", "2.50", "3.00"],
    correct: [2],
    explanation:
      "Their combined rate is 1/6 + 1/4 = 5/12 job per hour. In 1.5 hours they finish 5/8 of the job, leaving 3/8. At A’s rate of 1/6, the remaining time is (3/8)/(1/6) = 18/8 = 2.25 hours.",
    trap:
      "Adding completion times instead of rates ignores that both machines work simultaneously.",
    takeaway: "For work problems, add rates—not times.",
  },
  {
    id: "q-number-01",
    domain: "Quant",
    skill: "Number Properties",
    difficulty: 4,
    type: "single",
    prompt:
      "When positive integer n is divided by 7, the remainder is 4. What is the remainder when 3n + 5 is divided by 7?",
    choices: ["0", "1", "2", "3", "4"],
    correct: [3],
    explanation:
      "Because n ≡ 4 (mod 7), 3n + 5 ≡ 3(4) + 5 = 17 ≡ 3 (mod 7).",
    trap:
      "Multiplying the remainder by 3 is only an intermediate step; you must also add 5 and reduce again.",
    takeaway: "Replace a number with its remainder, then reduce the final expression.",
  },
  {
    id: "q-percent-01",
    domain: "Quant",
    skill: "Percents",
    difficulty: 3,
    type: "single",
    prompt:
      "A price is increased by 20 percent and then reduced by 20 percent. The final price is what percent of the original price?",
    choices: ["80%", "96%", "100%", "104%", "120%"],
    correct: [1],
    explanation:
      "Use multipliers: 1.20 × 0.80 = 0.96. The final price is 96 percent of the original.",
    trap:
      "The two 20 percent changes use different bases, so they do not cancel.",
    takeaway: "Chain percent changes with multiplication factors.",
  },
  {
    id: "q-geometry-01",
    domain: "Quant",
    skill: "Geometry",
    difficulty: 3,
    type: "single",
    prompt:
      "A circle has circumference 12π. What is the area of the circle?",
    choices: ["12π", "24π", "30π", "36π", "72π"],
    correct: [3],
    explanation:
      "From 2πr = 12π, r = 6. Area = πr² = 36π.",
    trap:
      "Using the diameter 12 as the radius quadruples the correct area.",
    takeaway: "Extract the radius before switching from circumference to area.",
  },
  {
    id: "q-geometry-02",
    domain: "Quant",
    skill: "Geometry",
    difficulty: 5,
    type: "single",
    prompt:
      "A right triangle has integer side lengths and one leg has length 12. If its perimeter is 30, what is its area?",
    choices: ["24", "30", "36", "42", "60"],
    correct: [1],
    explanation:
      "The familiar 5–12–13 right triangle has perimeter 30. Its area is (1/2)(5)(12) = 30.",
    trap:
      "Multiplying the two legs without the factor of 1/2 gives 60.",
    takeaway: "Recognize common Pythagorean triples, then apply the triangle-area formula.",
  },
  {
    id: "q-stats-01",
    domain: "Quant",
    skill: "Statistics",
    difficulty: 4,
    type: "single",
    prompt:
      "The mean of 8 numbers is 15. After one number is removed, the mean of the remaining 7 numbers is 13. What number was removed?",
    choices: ["2", "15", "22", "28", "29"],
    correct: [4],
    explanation:
      "The original sum is 8 × 15 = 120. The remaining sum is 7 × 13 = 91. The removed number is 120 − 91 = 29.",
    trap:
      "Subtracting the two means ignores that the groups contain different numbers of values.",
    takeaway: "Convert means to sums before comparing groups.",
  },
  {
    id: "q-probability-01",
    domain: "Quant",
    skill: "Probability",
    difficulty: 4,
    type: "single",
    prompt:
      "A fair six-sided die is rolled twice. What is the probability that the sum is greater than 9?",
    choices: ["1/12", "1/9", "1/6", "5/18", "1/3"],
    correct: [2],
    explanation:
      "Sums greater than 9 are 10, 11, and 12, with 3, 2, and 1 ordered outcomes respectively. That is 6 of 36 outcomes, or 1/6.",
    trap:
      "Counting the three possible sums as equally likely overlooks that sums have different numbers of outcomes.",
    takeaway: "Count equally likely ordered outcomes, not just possible totals.",
  },
  {
    id: "v-tc-01",
    domain: "Verbal",
    skill: "Text Completion",
    difficulty: 2,
    type: "single",
    prompt:
      "Although the critic was known for caustic reviews, her assessment of the debut novel was unexpectedly ____.",
    choices: ["acerbic", "equivocal", "laudatory", "perfunctory", "derivative"],
    correct: [2],
    explanation:
      "“Although” signals a contrast. Caustic means harsh, so the missing word should mean positive or praising: laudatory.",
    trap:
      "Acerbic matches the critic’s usual behavior, but the contrast word requires the opposite.",
    takeaway: "Honor the sentence’s logic before evaluating vocabulary.",
  },
  {
    id: "v-tc-02",
    domain: "Verbal",
    skill: "Text Completion",
    difficulty: 4,
    type: "single",
    prompt:
      "The committee’s report was so ____ that both supporters and opponents cited it as evidence for their mutually incompatible positions.",
    choices: ["unequivocal", "partisan", "ambiguous", "meticulous", "prescriptive"],
    correct: [2],
    explanation:
      "If opposing groups can use the same report to support incompatible positions, the report must permit multiple interpretations: ambiguous.",
    trap:
      "Meticulous sounds complimentary, but detail alone does not explain contradictory interpretations.",
    takeaway: "Predict the missing idea from the consequence in the sentence.",
  },
  {
    id: "v-se-01",
    domain: "Verbal",
    skill: "Sentence Equivalence",
    difficulty: 3,
    type: "multiple",
    prompt:
      "Far from being spontaneous, the apparently casual remark was carefully ____.",
    choices: ["improvised", "contrived", "premeditated", "inadvertent", "tangential", "obscured"],
    correct: [1, 2],
    explanation:
      "“Far from spontaneous” means planned. Contrived and premeditated both produce that meaning and create equivalent sentences.",
    trap:
      "Choose a pair that gives the sentence the same meaning; two individually plausible words are not enough.",
    takeaway: "Predict first, then find the synonym pair that matches the prediction.",
  },
  {
    id: "v-se-02",
    domain: "Verbal",
    skill: "Sentence Equivalence",
    difficulty: 5,
    type: "multiple",
    prompt:
      "The historian’s prose is never ____; even her footnotes display a lively wit.",
    choices: ["pedantic", "lucid", "ponderous", "incisive", "animated", "judicious"],
    correct: [0, 2],
    explanation:
      "The semicolon supplies evidence: lively wit means the prose is not dull or heavy. Pedantic and ponderous create equivalent meanings in context.",
    trap:
      "Animated is supported by “lively,” but the sentence says “never,” so the blank needs the rejected quality.",
    takeaway: "Track negation carefully before matching the synonym pair.",
  },
  {
    id: "v-rc-01",
    domain: "Verbal",
    skill: "Reading Comprehension",
    difficulty: 3,
    type: "single",
    passage:
      "Early studies of urban trees emphasized their aesthetic value. More recent research, however, measures their capacity to reduce surface temperatures and absorb stormwater. These findings do not diminish the trees’ visual appeal; rather, they broaden the grounds on which cities can justify investment in them.",
    prompt: "The primary purpose of the passage is to",
    choices: [
      "reject an earlier account of urban trees",
      "describe an expansion in how urban trees are valued",
      "argue that aesthetic considerations are irrelevant",
      "question the reliability of recent environmental research",
      "compare the costs of two urban policies",
    ],
    correct: [1],
    explanation:
      "The passage moves from aesthetic value to additional environmental benefits and says the newer findings broaden—not replace—the justification.",
    trap:
      "“More recent research” marks an expansion, not a rejection of the earlier view.",
    takeaway: "For main-purpose questions, summarize the passage’s movement and conclusion.",
  },
  {
    id: "v-rc-02",
    domain: "Verbal",
    skill: "Reading Comprehension",
    difficulty: 4,
    type: "single",
    passage:
      "Some biographers treat gaps in the historical record as invitations to reconstruct a subject’s motives. Yet a plausible reconstruction is not thereby a documented one. Responsible biography may propose interpretations, but it should mark clearly where evidence ends and conjecture begins.",
    prompt: "The author would most likely agree that biographers should",
    choices: [
      "avoid discussing motives unless every detail is documented",
      "use plausibility as the principal test of historical truth",
      "distinguish evidence-based claims from informed speculation",
      "fill gaps in the record only with a subject’s own testimony",
      "write exclusively for specialists familiar with the evidence",
    ],
    correct: [2],
    explanation:
      "The final sentence states the author’s standard directly: interpretations are allowed, but their evidentiary status must be clear.",
    trap:
      "The author does not ban interpretation; choice A is too absolute.",
    takeaway: "Prefer the choice that matches the author’s qualified position, not an extreme version.",
  },
  {
    id: "v-logic-01",
    domain: "Verbal",
    skill: "Argument Logic",
    difficulty: 4,
    type: "single",
    prompt:
      "A café owner concludes that extending closing time by two hours will increase profit because nearby cafés that stay open later report higher revenue. Which fact most weakens the conclusion?",
    choices: [
      "Some customers prefer cafés with outdoor seating.",
      "The nearby cafés are located beside a theater whose performances end late.",
      "The café recently changed its coffee supplier.",
      "Revenue does not include gratuities paid to staff.",
      "The owner surveyed customers on a weekday.",
    ],
    correct: [1],
    explanation:
      "The theater supplies a location-specific reason the comparison cafés earn late-night revenue. The owner’s café may not receive the same demand.",
    trap:
      "A relevant-sounding fact weakens only if it attacks the causal comparison or its assumptions.",
    takeaway: "When an argument copies another group’s result, look for a key difference between the groups.",
  },
  {
    id: "v-logic-02",
    domain: "Verbal",
    skill: "Argument Logic",
    difficulty: 5,
    type: "single",
    prompt:
      "After a company introduced optional productivity workshops, employees who attended completed more projects than employees who did not. The company concludes that the workshops increased productivity. Which assumption is required?",
    choices: [
      "Every employee had enough time to attend a workshop.",
      "Project quality matters less than project quantity.",
      "Employees who attended were not already more productive than nonattendees.",
      "The workshops were inexpensive to conduct.",
      "Most employees enjoyed the workshop instructors.",
    ],
    correct: [2],
    explanation:
      "Because attendance was optional, self-selection could explain the result. The conclusion requires ruling out the possibility that attendees began as stronger workers.",
    trap:
      "A required assumption must connect the evidence to the conclusion; cost and enjoyment do not do that.",
    takeaway: "For causal claims from self-selected groups, test for preexisting differences.",
  },
];

export const skillOrder = [
  "Algebra",
  "Ratios & Rates",
  "Number Properties",
  "Percents",
  "Geometry",
  "Statistics",
  "Probability",
  "Text Completion",
  "Sentence Equivalence",
  "Reading Comprehension",
  "Argument Logic",
];
