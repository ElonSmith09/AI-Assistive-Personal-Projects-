"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Domain,
  Question,
  questions,
  skillOrder,
} from "./lib/questions";
import { lessons } from "./lib/lessons";
import { materializeQuestion } from "./lib/questionEngine";

type Mastery = {
  skill: string;
  domain: Domain;
  attempts: number;
  correct: number;
  rating: number;
  last_seen: string | null;
};

type Profile = {
  id: string;
  target_score: number;
  baseline_quant: number | null;
  baseline_verbal: number | null;
  weekly_hours: number;
  streak: number;
  xp: number;
  last_active: string | null;
};

type History = {
  question_id: string;
  domain: Domain;
  skill: string;
  correct: number;
  seconds: number;
  confidence: number;
  created_at: string;
};

type Progress = {
  profile: Profile;
  mastery: Mastery[];
  history: History[];
  lessons: {
    skill: string;
    views: number;
    completed: number;
    last_reviewed: string | null;
  }[];
  studyTime: {
    skill: string;
    seconds: number;
    sessions: number;
    updated_at: string | null;
  }[];
};

type Feedback = {
  isCorrect: boolean;
  selected: number[];
  seconds: number;
};

type InstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

const fallbackProgress: Progress = {
  profile: {
    id: "primary",
    target_score: 335,
    baseline_quant: null,
    baseline_verbal: null,
    weekly_hours: 18,
    streak: 0,
    xp: 0,
    last_active: null,
  },
  mastery: skillOrder.map((skill) => ({
    skill,
    domain:
      questions.find((question) => question.skill === skill)?.domain ?? "Quant",
    attempts: 0,
    correct: 0,
    rating: 0.48,
    last_seen: null,
  })),
  history: [],
  lessons: skillOrder.map((skill) => ({
    skill,
    views: 0,
    completed: 0,
    last_reviewed: null,
  })),
  studyTime: skillOrder.map((skill) => ({
    skill,
    seconds: 0,
    sessions: 0,
    updated_at: null,
  })),
};

const roadmap = [
  {
    week: "Week 1",
    dates: "Jul 30–Aug 2",
    title: "Calibrate the engine",
    detail: "Official baseline + concept map",
  },
  {
    week: "Weeks 2–3",
    dates: "Aug 3–16",
    title: "Rebuild foundations",
    detail: "Accuracy before speed",
  },
  {
    week: "Weeks 4–5",
    dates: "Aug 17–30",
    title: "Raise the ceiling",
    detail: "Hard questions + vocabulary",
  },
  {
    week: "Weeks 6–7",
    dates: "Aug 31–Sep 13",
    title: "Adapt under pressure",
    detail: "Timed mixed sections",
  },
  {
    week: "Week 8",
    dates: "Sep 14–20",
    title: "Simulate test day",
    detail: "Full tests + precision repair",
  },
  {
    week: "Final week",
    dates: "Sep 21–30",
    title: "Peak, don’t cram",
    detail: "Polish + recovery",
  },
];

function sameAnswers(a: number[], b: number[]) {
  return (
    a.length === b.length &&
    [...a].sort().every((value, index) => value === [...b].sort()[index])
  );
}

function formatSkill(skill: string) {
  return skill.replace("Reading Comprehension", "Reading Comp.");
}

function formatStudyTime(seconds: number) {
  if (seconds < 60) return seconds ? `${seconds}s` : "0m";
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  return hours ? `${hours}h ${minutes}m` : `${minutes}m`;
}

function localDayKey(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function pickAdaptiveQuestion(
  progress: Progress,
  currentId?: string,
  sessionStep = 0,
  domain?: Domain,
) {
  const ranked = [...progress.mastery]
    .filter((item) => !domain || item.domain === domain)
    .sort((a, b) => a.rating - b.rating);
  const useStrength = sessionStep > 0 && sessionStep % 4 === 0;
  const targetSkills = useStrength ? [...ranked].reverse() : ranked;

  for (const mastery of targetSkills) {
    let candidates = questions
      .filter(
        (question) =>
          question.skill === mastery.skill &&
          question.id !== currentId,
      )
      .sort((a, b) => {
        const desiredDifficulty = Math.max(
          1,
          Math.min(5, Math.round(mastery.rating * 5.5)),
        );
        return (
          Math.abs(a.difficulty - desiredDifficulty) -
          Math.abs(b.difficulty - desiredDifficulty)
        );
      });
    if (!candidates.length) {
      candidates = questions.filter(
        (question) => question.skill === mastery.skill,
      );
    }
    if (candidates[0]) {
      return materializeQuestion(
        candidates[0],
        Date.now() + sessionStep * 997 + mastery.attempts * 131,
      );
    }
  }

  const fallback =
    questions.find((question) => question.id !== currentId) ?? questions[0];
  return materializeQuestion(fallback, Date.now() + sessionStep * 997);
}

export function GreCoach() {
  const [progress, setProgress] = useState<Progress>(fallbackProgress);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [syncError, setSyncError] = useState("");
  const [tab, setTab] = useState<
    "today" | "practice" | "lessons" | "review" | "plan" | "analytics"
  >("today");
  const [practiceDomain, setPracticeDomain] = useState<Domain>("Quant");
  const [question, setQuestion] = useState<Question>(() =>
    materializeQuestion(questions[0], 330),
  );
  const [selected, setSelected] = useState<number[]>([]);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [confidence, setConfidence] = useState(2);
  const [startedAt, setStartedAt] = useState(() => Date.now());
  const [elapsed, setElapsed] = useState(0);
  const [sessionStep, setSessionStep] = useState(0);
  const [sessionCorrect, setSessionCorrect] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  const [targetScore, setTargetScore] = useState(335);
  const [baselineQuant, setBaselineQuant] = useState("");
  const [baselineVerbal, setBaselineVerbal] = useState("");
  const [weeklyHours, setWeeklyHours] = useState(18);
  const [lessonSkill, setLessonSkill] = useState("Algebra");
  const [lessonSaving, setLessonSaving] = useState(false);
  const [hintLevel, setHintLevel] = useState(0);
  const [showFoundation, setShowFoundation] = useState(true);
  const [installPrompt, setInstallPrompt] = useState<InstallPromptEvent | null>(
    null,
  );
  const [showInstallHelp, setShowInstallHelp] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    let active = true;
    const cached = window.localStorage.getItem("gre-test-prep-progress");
    fetch("/api/progress")
      .then(async (response) => {
        if (!response.ok) throw new Error("Progress sync is temporarily unavailable.");
        return (await response.json()) as Progress;
      })
      .then((data) => {
        if (!active) return;
        setProgress(data);
        setQuestion(pickAdaptiveQuestion(data, undefined, 0, "Quant"));
        const weakestSkill = [...data.mastery].sort(
          (a, b) => a.rating - b.rating,
        )[0]?.skill;
        if (weakestSkill) setLessonSkill(weakestSkill);
        setTargetScore(data.profile.target_score);
        setBaselineQuant(
          data.profile.baseline_quant ? String(data.profile.baseline_quant) : "",
        );
        setBaselineVerbal(
          data.profile.baseline_verbal ? String(data.profile.baseline_verbal) : "",
        );
        setWeeklyHours(data.profile.weekly_hours);
      })
      .catch((error) => {
        if (!active) return;
        if (cached) {
          try {
            setProgress(JSON.parse(cached) as Progress);
          } catch {
            // Ignore a malformed local cache and use the safe defaults.
          }
        }
        setSyncError(error instanceof Error ? error.message : "Offline");
      })
      .finally(() => {
        if (active) {
          setLoading(false);
          setStartedAt(Date.now());
        }
      });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!loading) {
      window.localStorage.setItem(
        "gre-test-prep-progress",
        JSON.stringify(progress),
      );
    }
  }, [loading, progress]);

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => undefined);
    }

    const displayMode = window.matchMedia("(display-mode: standalone)");
    const updateStandalone = () =>
      setIsStandalone(
        displayMode.matches ||
          Boolean((navigator as Navigator & { standalone?: boolean }).standalone),
      );
    const updateConnection = () => setIsOnline(navigator.onLine);
    const captureInstall = (event: Event) => {
      event.preventDefault();
      setInstallPrompt(event as InstallPromptEvent);
    };

    updateStandalone();
    updateConnection();
    displayMode.addEventListener("change", updateStandalone);
    window.addEventListener("online", updateConnection);
    window.addEventListener("offline", updateConnection);
    window.addEventListener("beforeinstallprompt", captureInstall);
    return () => {
      displayMode.removeEventListener("change", updateStandalone);
      window.removeEventListener("online", updateConnection);
      window.removeEventListener("offline", updateConnection);
      window.removeEventListener("beforeinstallprompt", captureInstall);
    };
  }, []);

  useEffect(() => {
    if (feedback) return;
    const timer = window.setInterval(
      () => setElapsed(Math.floor((Date.now() - startedAt) / 1000)),
      1000,
    );
    return () => window.clearInterval(timer);
  }, [feedback, startedAt]);

  const activeStudySkill =
    tab === "practice"
      ? question.skill
      : tab === "lessons"
        ? lessonSkill
        : null;

  useEffect(() => {
    if (!activeStudySkill) return;
    let lastSaved = Date.now();

    const saveTime = (force = false) => {
      const now = Date.now();
      if (document.visibilityState === "hidden" && !force) return;
      const seconds = Math.floor((now - lastSaved) / 1000);
      if (seconds < 5) return;
      lastSaved = now;
      fetch("/api/progress", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ action: "time", skill: activeStudySkill, seconds }),
        keepalive: true,
      })
        .then((response) => (response.ok ? response.json() : null))
        .then((data: Progress | null) => {
          if (data) setProgress(data);
        })
        .catch(() => undefined);
    };

    const timer = window.setInterval(() => saveTime(), 30000);
    const onVisibility = () => {
      if (document.visibilityState === "hidden") saveTime(true);
      else lastSaved = Date.now();
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      window.clearInterval(timer);
      document.removeEventListener("visibilitychange", onVisibility);
      saveTime(true);
    };
  }, [activeStudySkill]);

  const selectChoice = useCallback(
    (index: number) => {
      if (feedback) return;
      if (question.type === "single") {
        setSelected([index]);
      } else {
        setSelected((current) =>
          current.includes(index)
            ? current.filter((choice) => choice !== index)
            : [...current, index],
        );
      }
    },
    [feedback, question.type],
  );

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key >= "1" && event.key <= String(question.choices.length)) {
        selectChoice(Number(event.key) - 1);
      }
      if (event.key === "Enter" && selected.length > 0 && !feedback) {
        document.getElementById("submit-answer")?.click();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [feedback, question.choices.length, selectChoice, selected.length]);

  const masteryByDomain = useMemo(() => {
    const quant = progress.mastery.filter((item) => item.domain === "Quant");
    const verbal = progress.mastery.filter((item) => item.domain === "Verbal");
    const average = (items: Mastery[]) =>
      items.reduce((sum, item) => sum + item.rating, 0) / Math.max(1, items.length);
    return { quant: average(quant), verbal: average(verbal) };
  }, [progress.mastery]);

  const projected = useMemo(() => {
    const baselineQ = progress.profile.baseline_quant;
    const baselineV = progress.profile.baseline_verbal;
    const quant = baselineQ
      ? Math.min(170, Math.round(baselineQ + (masteryByDomain.quant - 0.48) * 24))
      : Math.round(130 + masteryByDomain.quant * 40);
    const verbal = baselineV
      ? Math.min(170, Math.round(baselineV + (masteryByDomain.verbal - 0.48) * 24))
      : Math.round(130 + masteryByDomain.verbal * 40);
    return { quant, verbal, total: quant + verbal };
  }, [masteryByDomain, progress.profile]);

  const ranked = useMemo(
    () => [...progress.mastery].sort((a, b) => a.rating - b.rating),
    [progress.mastery],
  );
  const domainRanked = useMemo(
    () => ranked.filter((item) => item.domain === practiceDomain),
    [ranked, practiceDomain],
  );
  const weakest = ranked[0];
  const domainWeakest = domainRanked[0];
  const domainStrongest = domainRanked[domainRanked.length - 1];
  const answeredToday = progress.history.filter(
    (item) =>
      new Date(item.created_at).toDateString() === new Date().toDateString(),
  ).length;
  const dailyTarget = Math.max(8, Math.round(progress.profile.weekly_hours * 0.8));
  const calibrationNeeded =
    !progress.profile.baseline_quant || !progress.profile.baseline_verbal;
  const activeLesson =
    lessons.find((lesson) => lesson.skill === lessonSkill) ?? lessons[0];
  const lessonRecord = progress.lessons.find(
    (lesson) => lesson.skill === activeLesson.skill,
  );
  const lessonsCompleted = progress.lessons.filter(
    (lesson) => lesson.completed,
  ).length;
  const totalStudySeconds = progress.studyTime.reduce(
    (sum, item) => sum + item.seconds,
    0,
  );
  const recentMistakes = useMemo(() => {
    const seen = new Set<string>();
    return progress.history
      .filter((item) => {
        if (item.correct || seen.has(item.question_id)) return false;
        seen.add(item.question_id);
        return true;
      })
      .map((item) => {
        return {
          history: item,
          question: questions.find(
            (candidate) => candidate.id === item.question_id,
          ),
        };
      })
      .filter(
        (item): item is { history: History; question: Question } =>
          Boolean(item.question),
      );
  }, [progress.history]);
  const overallMastery = Math.round(
    (progress.mastery.reduce((sum, item) => sum + item.rating, 0) /
      Math.max(1, progress.mastery.length)) *
      100,
  );

  function submitAnswer() {
    if (!selected.length || feedback || saving) return;
    const seconds = Math.max(1, Math.floor((Date.now() - startedAt) / 1000));
    const isCorrect = sameAnswers(selected, question.correct);
    setFeedback({ isCorrect, selected, seconds });
    if (isCorrect) setSessionCorrect((value) => value + 1);
    setSaving(true);
    setSyncError("");

    fetch("/api/progress", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        action: "answer",
        questionId: question.id,
        correct: isCorrect,
        seconds,
        confidence,
        dayKey: localDayKey(),
      }),
    })
      .then(async (response) => {
        if (!response.ok) throw new Error("Your answer could not be synced.");
        return (await response.json()) as Progress;
      })
      .then(setProgress)
      .catch((error) =>
        setSyncError(error instanceof Error ? error.message : "Sync failed"),
      )
      .finally(() => setSaving(false));
  }

  function nextQuestion() {
    const nextStep = sessionStep + 1;
    const next = pickAdaptiveQuestion(
      progress,
      question.id,
      nextStep,
      practiceDomain,
    );
    setQuestion(next);
    setSessionStep(nextStep);
    setSelected([]);
    setFeedback(null);
    setHintLevel(0);
    setShowFoundation(true);
    setConfidence(2);
    setElapsed(0);
    setStartedAt(Date.now());
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function openDomain(domain: Domain) {
    setPracticeDomain(domain);
    setQuestion(pickAdaptiveQuestion(progress, undefined, sessionStep, domain));
    setSelected([]);
    setFeedback(null);
    setHintLevel(0);
    setShowFoundation(true);
    setElapsed(0);
    setStartedAt(Date.now());
    setTab("practice");
  }

  function startQuestionForSkill(skill: string) {
    const base =
      questions.find((candidate) => candidate.skill === skill) ?? questions[0];
    setQuestion(materializeQuestion(base, Date.now()));
    setPracticeDomain(base.domain);
    setSelected([]);
    setFeedback(null);
    setHintLevel(0);
    setShowFoundation(true);
    setConfidence(2);
    setElapsed(0);
    setStartedAt(Date.now());
    setTab("practice");
  }

  async function installApplication() {
    if (!installPrompt) {
      setShowInstallHelp(true);
      return;
    }
    await installPrompt.prompt();
    const choice = await installPrompt.userChoice;
    if (choice.outcome === "accepted") setInstallPrompt(null);
  }

  function retrySameConcept() {
    const base =
      questions.find(
        (candidate) =>
          candidate.skill === question.skill && candidate.id === question.id,
      ) ?? questions.find((candidate) => candidate.skill === question.skill) ?? questions[0];
    setQuestion(materializeQuestion(base, Date.now() + sessionStep * 7919));
    setSelected([]);
    setFeedback(null);
    setConfidence(2);
    setHintLevel(0);
    setShowFoundation(true);
    setElapsed(0);
    setStartedAt(Date.now());
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function saveProfile(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true);
    fetch("/api/progress", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        action: "profile",
        targetScore,
        baselineQuant: baselineQuant ? Number(baselineQuant) : null,
        baselineVerbal: baselineVerbal ? Number(baselineVerbal) : null,
        weeklyHours,
      }),
    })
      .then(async (response) => {
        if (!response.ok) throw new Error("Profile update failed.");
        return (await response.json()) as Progress;
      })
      .then((data) => {
        setProgress(data);
        setShowSettings(false);
      })
      .catch((error) =>
        setSyncError(error instanceof Error ? error.message : "Update failed"),
      )
      .finally(() => setSaving(false));
  }

  function completeLesson() {
    setLessonSaving(true);
    fetch("/api/progress", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        action: "lesson",
        skill: activeLesson.skill,
      }),
    })
      .then(async (response) => {
        if (!response.ok) throw new Error("Lesson progress could not be saved.");
        return (await response.json()) as Progress;
      })
      .then(setProgress)
      .catch((error) =>
        setSyncError(error instanceof Error ? error.message : "Sync failed"),
      )
      .finally(() => setLessonSaving(false));
  }

  function practiceLessonSkill() {
    const mastery = progress.mastery.find(
      (item) => item.skill === activeLesson.skill,
    );
    const targetDifficulty = Math.max(
      1,
      Math.min(5, Math.round((mastery?.rating ?? 0.48) * 5.5)),
    );
    const target =
      questions
        .filter((item) => item.skill === activeLesson.skill)
        .sort(
          (a, b) =>
            Math.abs(a.difficulty - targetDifficulty) -
            Math.abs(b.difficulty - targetDifficulty),
        )[0] ?? questions[0];
    setQuestion(materializeQuestion(target, Date.now()));
    setPracticeDomain(activeLesson.domain);
    setSelected([]);
    setFeedback(null);
    setHintLevel(0);
    setShowFoundation(true);
    setStartedAt(Date.now());
    setTab("practice");
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <button
          className="brand"
          aria-label="Open Today dashboard"
          onClick={() => setTab("today")}
        >
          <span className="brand-mark">TP</span>
          <span className="brand-copy">
            <strong>GRE TEST PREP</strong>
            <small>Adaptive 330+ coach</small>
          </span>
        </button>
        <nav className="main-nav" aria-label="Primary navigation">
          <button
            className={tab === "today" ? "active" : ""}
            onClick={() => setTab("today")}
          >
            <span aria-hidden="true">⌂</span>
            <span>Today</span>
          </button>
          <button
            className={`quant-nav ${tab === "practice" && practiceDomain === "Quant" ? "active" : ""}`}
            onClick={() => openDomain("Quant")}
          >
            <span aria-hidden="true">∑</span>
            <span>Quant</span>
          </button>
          <button
            className={`verbal-nav ${tab === "practice" && practiceDomain === "Verbal" ? "active" : ""}`}
            onClick={() => openDomain("Verbal")}
          >
            <span aria-hidden="true">Aa</span>
            <span>Verbal</span>
          </button>
          <button
            className={tab === "lessons" ? "active" : ""}
            onClick={() => setTab("lessons")}
          >
            <span aria-hidden="true">▤</span>
            <span>Lessons</span>
          </button>
          <button
            className={tab === "review" ? "active" : ""}
            onClick={() => setTab("review")}
          >
            <span aria-hidden="true">↺</span>
            <span>Review mistakes</span>
          </button>
          <button
            className={tab === "analytics" ? "active" : ""}
            onClick={() => setTab("analytics")}
          >
            <span aria-hidden="true">◫</span>
            <span>Progress</span>
          </button>
          <button
            className={tab === "plan" ? "active" : ""}
            onClick={() => setTab("plan")}
          >
            <span aria-hidden="true">◷</span>
            <span>Study plan</span>
          </button>
        </nav>
        <div className="header-actions">
          {!isStandalone && (
            <button
              className="install-app-button"
              aria-label="Install GRE Test Prep application"
              onClick={installApplication}
            >
              <span aria-hidden="true">⇩</span>
              <span>Install app</span>
            </button>
          )}
          <div className="streak-pill" title="Current study streak">
            <span>◆</span> {progress.profile.streak} day streak
          </div>
          <button
            className="avatar"
            aria-label="Open training settings"
            onClick={() => setShowSettings(true)}
          >
            ES
          </button>
        </div>
      </header>

      {(syncError || !isOnline) && (
        <div className="sync-banner" role="status">
          {!isOnline
            ? "You’re offline. Lessons and your last saved dashboard remain available."
            : `${syncError} Your current screen still works; try again in a moment.`}
        </div>
      )}

      {tab === "today" && (
        <section className="today-page">
          <div className="today-heading">
            <div>
              <p className="eyebrow">YOUR TRAINING DESK</p>
              <h1>Make today count.</h1>
              <p>
                One focused session, chosen from your actual performance—not a
                generic checklist.
              </p>
            </div>
            <div className="today-date">
              <span>DAILY TARGET</span>
              <strong>{answeredToday}/{dailyTarget}</strong>
              <small>questions</small>
            </div>
          </div>

          <div className="today-grid">
            <article className="continue-card">
              <div className="continue-copy">
                <span className={`domain-tag ${weakest?.domain.toLowerCase() ?? "quant"}`}>
                  Recommended next
                </span>
                <p className="eyebrow">ADAPTIVE REPAIR</p>
                <h2>{weakest?.skill ?? "Start your calibration"}</h2>
                <p>
                  {weakest?.attempts
                    ? `Your current mastery is ${Math.round(weakest.rating * 100)}%. We’ll begin carefully, then rotate the numbers and wording.`
                    : "Give the coach an initial signal so it can tune your next session."}
                </p>
                <button
                  className="continue-button"
                  onClick={() =>
                    weakest ? startQuestionForSkill(weakest.skill) : openDomain("Quant")
                  }
                >
                  Continue training <span>→</span>
                </button>
              </div>
              <div className="mastery-orbit" aria-label={`${overallMastery}% overall mastery`}>
                <svg viewBox="0 0 120 120" role="img">
                  <circle className="orbit-back" cx="60" cy="60" r="50" />
                  <circle
                    className="orbit-fill"
                    cx="60"
                    cy="60"
                    r="50"
                    pathLength="100"
                    strokeDasharray={`${overallMastery} 100`}
                  />
                </svg>
                <div>
                  <strong>{overallMastery}%</strong>
                  <span>mastery</span>
                </div>
              </div>
            </article>

            <article className="score-snapshot">
              <div className="snapshot-heading">
                <div>
                  <p className="eyebrow">SCORE DIRECTION</p>
                  <h2>{projected.total}</h2>
                </div>
                <span>Target {progress.profile.target_score}</span>
              </div>
              <div className="snapshot-domains">
                <button onClick={() => openDomain("Quant")}>
                  <span>Quant</span>
                  <strong>{projected.quant}</strong>
                  <small>{Math.round(masteryByDomain.quant * 100)}% mastery</small>
                </button>
                <button onClick={() => openDomain("Verbal")}>
                  <span>Verbal</span>
                  <strong>{projected.verbal}</strong>
                  <small>{Math.round(masteryByDomain.verbal * 100)}% mastery</small>
                </button>
              </div>
              <button className="snapshot-link" onClick={() => setTab("analytics")}>
                Open full progress report →
              </button>
            </article>
          </div>

          <div className="section-row-heading">
            <div>
              <p className="eyebrow">CHOOSE A SHORT SESSION</p>
              <h2>What do you have energy for?</h2>
            </div>
            <span>{formatStudyTime(totalStudySeconds)} studied total</span>
          </div>
          <div className="session-options">
            <button onClick={() => weakest && startQuestionForSkill(weakest.skill)}>
              <span className="session-icon repair">↗</span>
              <div>
                <small>10 MIN · RECOMMENDED</small>
                <strong>Repair a weak spot</strong>
                <p>{weakest?.skill ?? "Calibration"} with fresh variations</p>
              </div>
              <span className="session-arrow">→</span>
            </button>
            <button onClick={() => openDomain("Verbal")}>
              <span className="session-icon verbal">Aa</span>
              <div>
                <small>12 MIN · VERBAL</small>
                <strong>Read the logic</strong>
                <p>Sentence structure, vocabulary, and evidence</p>
              </div>
              <span className="session-arrow">→</span>
            </button>
            <button onClick={() => setTab("review")}>
              <span className="session-icon review">↺</span>
              <div>
                <small>5 MIN · RETRIEVAL</small>
                <strong>Review mistakes</strong>
                <p>{recentMistakes.length} recent patterns ready to revisit</p>
              </div>
              <span className="session-arrow">→</span>
            </button>
          </div>

          <div className="today-insights">
            <article>
              <p className="eyebrow">WEEKLY RHYTHM</p>
              <h3>{progress.profile.streak} day streak</h3>
              <div className="week-dots" aria-label="Seven-day study rhythm">
                {[0, 1, 2, 3, 4, 5, 6].map((day) => (
                  <span
                    key={day}
                    className={day < Math.min(7, progress.profile.streak) ? "done" : ""}
                  >
                    {"MTWTFSS"[day]}
                  </span>
                ))}
              </div>
            </article>
            <article>
              <p className="eyebrow">LESSON PROGRESS</p>
              <h3>{lessonsCompleted} of {lessons.length} refreshed</h3>
              <div className="progress-track"><div style={{ width: `${(lessonsCompleted / lessons.length) * 100}%` }} /></div>
              <button onClick={() => setTab("lessons")}>Browse lessons →</button>
            </article>
            <article>
              <p className="eyebrow">TRAINING TIME</p>
              <h3>{formatStudyTime(totalStudySeconds)}</h3>
              <p>Active learning time across lessons and questions.</p>
              <button onClick={() => setTab("analytics")}>See topic breakdown →</button>
            </article>
          </div>
        </section>
      )}

      {tab === "practice" && (
        <div className="page-grid">
          <section className="main-column">
            <div className={`mission-strip domain-hero ${practiceDomain.toLowerCase()}`}>
              <div>
                <p className="eyebrow">
                  {practiceDomain === "Quant"
                    ? "QUANTITATIVE REASONING LAB"
                    : "VERBAL REASONING LAB"}
                </p>
                <h1>
                  {practiceDomain === "Quant" ? "Build the math. " : "Read the logic. "}
                  <em>{domainWeakest?.skill ?? "Start with the fundamentals"}</em>
                </h1>
                <p>
                  Your adaptive set prioritizes {domainWeakest?.skill ?? "foundations"}
                  {" "}while rotating in {domainStrongest?.skill ?? "stronger topics"}
                  {" "}to prove you understand the method—not a memorized answer.
                </p>
              </div>
              <div className="mission-progress">
                <span>
                  {answeredToday}/{dailyTarget}
                </span>
                <small>questions today</small>
                <div className="progress-track">
                  <div
                    style={{
                      width: `${Math.min(100, (answeredToday / dailyTarget) * 100)}%`,
                    }}
                  />
                </div>
              </div>
            </div>

            <article
              className={`question-card ${practiceDomain.toLowerCase()}-practice`}
              aria-busy={loading}
            >
              <div className="question-meta">
                <div className="meta-tags">
                  <span className={`domain-tag ${question.domain.toLowerCase()}`}>
                    {question.domain}
                  </span>
                  <span>{question.skill}</span>
                  <span>Level {question.difficulty}/5</span>
                </div>
                <div className="timer" aria-label={`${elapsed} seconds elapsed`}>
                  <span className="timer-dot" /> {Math.floor(elapsed / 60)}:
                  {String(elapsed % 60).padStart(2, "0")}
                </div>
              </div>

              <div className="foundation-bar">
                <div>
                  <span>LEARNING MODE</span>
                  <strong>
                    {question.concept ??
                      "Use the refresher and hints while this skill is new."}
                  </strong>
                </div>
                <button onClick={() => setShowFoundation((value) => !value)}>
                  {showFoundation ? "Hide foundation" : "Teach me first"}
                </button>
              </div>
              {showFoundation && (
                <div className="foundation-note">
                  <strong>What you need before starting</strong>
                  <p>
                    {question.prerequisite ??
                      "Focus on the sentence or mathematical relationship before calculating."}
                  </p>
                  <button
                    onClick={() => {
                      setLessonSkill(question.skill);
                      setTab("lessons");
                    }}
                  >
                    Open the {question.skill} refresher →
                  </button>
                </div>
              )}

              {question.passage && (
                <blockquote className="passage">{question.passage}</blockquote>
              )}
              <h2>{question.prompt}</h2>
              {question.type === "multiple" && (
                <p className="select-note">Select exactly two answers.</p>
              )}

              <div className="choices" role="group" aria-label="Answer choices">
                {question.choices.map((choice, index) => {
                  const isSelected = selected.includes(index);
                  const isCorrectAnswer =
                    feedback && question.correct.includes(index);
                  const isWrongSelection =
                    feedback && isSelected && !question.correct.includes(index);
                  return (
                    <button
                      key={choice}
                      className={[
                        "choice",
                        isSelected ? "selected" : "",
                        isCorrectAnswer ? "correct-choice" : "",
                        isWrongSelection ? "wrong-choice" : "",
                      ]
                        .filter(Boolean)
                        .join(" ")}
                      onClick={() => selectChoice(index)}
                      aria-pressed={isSelected}
                      disabled={Boolean(feedback)}
                    >
                      <span className="choice-key">
                        {String.fromCharCode(65 + index)}
                      </span>
                      <span>{choice}</span>
                    </button>
                  );
                })}
              </div>

              {!feedback && (
                <div className="hint-zone">
                  {hintLevel > 0 && (
                    <div className="hint-card" aria-live="polite">
                      <span>HINT {hintLevel} OF {question.hints?.length ?? 1}</span>
                      <p>
                        {question.hints?.[hintLevel - 1] ??
                          "Identify what the question gives you and what it asks you to find."}
                      </p>
                    </div>
                  )}
                  <button
                    className="hint-button"
                    onClick={() =>
                      setHintLevel((level) =>
                        Math.min(question.hints?.length ?? 1, level + 1),
                      )
                    }
                    disabled={hintLevel >= (question.hints?.length ?? 1)}
                  >
                    {hintLevel === 0
                      ? "I’m stuck — give me a small hint"
                      : hintLevel < (question.hints?.length ?? 1)
                        ? "Give me the next hint"
                        : "All hints shown"}
                  </button>
                </div>
              )}

              {!feedback ? (
                <div className="answer-footer">
                  <div className="confidence">
                    <span>Confidence</span>
                    {[1, 2, 3].map((level) => (
                      <button
                        key={level}
                        className={confidence === level ? "active" : ""}
                        onClick={() => setConfidence(level)}
                        aria-label={
                          level === 1
                            ? "Low confidence"
                            : level === 2
                              ? "Medium confidence"
                              : "High confidence"
                        }
                      >
                        {level === 1 ? "Low" : level === 2 ? "Medium" : "High"}
                      </button>
                    ))}
                  </div>
                  <button
                    id="submit-answer"
                    className="primary-button"
                    onClick={submitAnswer}
                    disabled={
                      !selected.length ||
                      (question.type === "multiple" && selected.length !== 2)
                    }
                  >
                    Check answer <span>↵</span>
                  </button>
                </div>
              ) : (
                <div
                  className={`feedback ${feedback.isCorrect ? "success" : "repair"}`}
                  aria-live="polite"
                >
                  <div className="feedback-heading">
                    <span className="feedback-icon">
                      {feedback.isCorrect ? "✓" : "↗"}
                    </span>
                    <div>
                      <p className="eyebrow">
                        {feedback.isCorrect ? "CORRECT" : "REPAIR THIS PATTERN"}
                      </p>
                      <h3>
                        {feedback.isCorrect
                          ? `Clean solve in ${feedback.seconds} seconds.`
                          : question.trap}
                      </h3>
                    </div>
                  </div>
                  <div className="explanation-intro">
                    <strong>The big idea</strong>
                    <p>{question.explanation}</p>
                  </div>
                  {question.steps && (
                    <div className="solution-steps">
                      <p className="eyebrow">STEP-BY-STEP FROM SCRATCH</p>
                      <ol>
                        {question.steps.map((step) => (
                          <li key={step}>{step}</li>
                        ))}
                      </ol>
                    </div>
                  )}
                  <div className="explanation-grid">
                    <div>
                      <strong>Easier / alternate way</strong>
                      <p>{question.alternate ?? question.explanation}</p>
                    </div>
                    <div>
                      <strong>How to check yourself</strong>
                      <p>{question.check ?? question.takeaway}</p>
                    </div>
                  </div>
                  {!feedback.isCorrect && (
                    <div className="trap-explainer">
                      <strong>Why your path likely broke</strong>
                      <p>{question.trap}</p>
                    </div>
                  )}
                  <div className="takeaway">
                    <strong>Rule to remember</strong>
                    <span>{question.takeaway}</span>
                  </div>
                  <div className="feedback-actions">
                    <span>
                      {saving ? "Saving mastery…" : "Mastery profile updated"}
                    </span>
                    <div className="feedback-buttons">
                      <button className="secondary-button" onClick={retrySameConcept}>
                        Same concept, fresh variation
                      </button>
                      <button className="primary-button" onClick={nextQuestion}>
                        Next adaptive question →
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </article>

            <p className="original-note">
              Original GRE-style practice—not affiliated with or endorsed by ETS.
            </p>
          </section>

          <aside className="side-column">
            <div className="score-card">
              <div className="card-heading">
                <div>
                  <p className="eyebrow">TRAINING ESTIMATE</p>
                  <h2>{projected.total}</h2>
                </div>
                <div className="target-badge">Target {progress.profile.target_score}</div>
              </div>
              <div className="score-split">
                <div>
                  <span>Quant</span>
                  <strong>{projected.quant}</strong>
                </div>
                <div>
                  <span>Verbal</span>
                  <strong>{projected.verbal}</strong>
                </div>
              </div>
              <div className="score-scale">
                <div
                  className="score-fill"
                  style={{
                    width: `${Math.max(4, ((projected.total - 260) / 80) * 100)}%`,
                  }}
                />
                <span style={{ left: "87.5%" }}>330</span>
              </div>
              <p>
                {calibrationNeeded
                  ? "Add an official POWERPREP baseline to calibrate this estimate."
                  : `${Math.max(0, progress.profile.target_score - projected.total)} points to your target. Estimate updates with each answer.`}
              </p>
              {calibrationNeeded && (
                <button
                  className="text-button"
                  onClick={() => setShowSettings(true)}
                >
                  Add baseline scores →
                </button>
              )}
            </div>

            <div className="insight-card">
              <div className="card-heading compact">
                <div>
                  <p className="eyebrow">COACH’S READ</p>
                  <h3>What to fix next</h3>
                </div>
                <span className="pulse-dot" />
              </div>
              <div className="coach-insight">
                <span className="rank-number">01</span>
                <div>
                  <strong>{domainWeakest?.skill ?? "Calibration"}</strong>
                  <p>
                    {domainWeakest?.attempts
                      ? `${Math.round(domainWeakest.rating * 100)}% mastery after ${domainWeakest.attempts} attempts`
                      : "Needs an initial signal"}
                  </p>
                </div>
              </div>
              <div className="coach-insight">
                <span className="rank-number">02</span>
                <div>
                  <strong>{domainRanked[1]?.skill ?? "Pacing"}</strong>
                  <p>
                    {domainRanked[1]?.attempts
                      ? `${Math.round(domainRanked[1].rating * 100)}% mastery`
                      : "Queued for calibration"}
                  </p>
                </div>
              </div>
              <div className="strength-callout">
                <span>STRENGTH TO LEVERAGE</span>
                <strong>{domainStrongest?.skill ?? "Not enough data yet"}</strong>
              </div>
            </div>

            <div className="session-card">
              <div>
                <span className="session-kicker">THIS SESSION</span>
                <strong>
                  {sessionCorrect}/{sessionStep + (feedback ? 1 : 0)}
                </strong>
                <small>correct</small>
              </div>
              <div>
                <span className="session-kicker">TOTAL XP</span>
                <strong>{progress.profile.xp}</strong>
                <small>earned</small>
              </div>
            </div>
          </aside>
        </div>
      )}

      {tab === "lessons" && (
        <section className="wide-page lesson-page">
          <div className="section-intro lesson-intro">
            <div>
              <p className="eyebrow">LESSON LIBRARY</p>
              <h1>Learn it clearly. Then prove it.</h1>
              <p>
                Quant and Verbal lessons rebuild concepts from scratch, then hand
                you directly to a rotating adaptive drill. Study time is saved by topic.
              </p>
            </div>
            <div className="lesson-count">
              <strong>{lessonsCompleted}</strong>
              <span>of {lessons.length} refreshed</span>
            </div>
          </div>
          <div className="lesson-layout">
            <aside className="lesson-menu" aria-label="GRE refresher topics">
              <p>QUANT FOUNDATIONS</p>
              {lessons
                .filter((lesson) => lesson.domain === "Quant")
                .map((lesson) => {
                  const complete = progress.lessons.find(
                    (item) => item.skill === lesson.skill,
                  )?.completed;
                  const time = progress.studyTime.find(
                    (item) => item.skill === lesson.skill,
                  )?.seconds ?? 0;
                  return (
                    <button
                      key={lesson.skill}
                      className={lessonSkill === lesson.skill ? "active" : ""}
                      onClick={() => setLessonSkill(lesson.skill)}
                    >
                      <span>{complete ? "✓" : "○"}</span>
                      {lesson.skill}
                      <small>{formatStudyTime(time)}</small>
                    </button>
                  );
                })}
              <p>VERBAL FOUNDATIONS</p>
              {lessons
                .filter((lesson) => lesson.domain === "Verbal")
                .map((lesson) => {
                  const complete = progress.lessons.find(
                    (item) => item.skill === lesson.skill,
                  )?.completed;
                  const time = progress.studyTime.find(
                    (item) => item.skill === lesson.skill,
                  )?.seconds ?? 0;
                  return (
                    <button
                      key={lesson.skill}
                      className={lessonSkill === lesson.skill ? "active" : ""}
                      onClick={() => setLessonSkill(lesson.skill)}
                    >
                      <span>{complete ? "✓" : "○"}</span>
                      {lesson.skill}
                      <small>{formatStudyTime(time)}</small>
                    </button>
                  );
                })}
            </aside>

            <article className="lesson-content">
              <div className="lesson-heading">
                <div>
                  <span className={`domain-tag ${activeLesson.domain.toLowerCase()}`}>
                    {activeLesson.domain}
                  </span>
                  <p>
                    {activeLesson.minutes} MIN REFRESHER ·{" "}
                    {formatStudyTime(
                      progress.studyTime.find(
                        (item) => item.skill === activeLesson.skill,
                      )?.seconds ?? 0,
                    )}{" "}
                    STUDIED · {lessonRecord?.completed ? "REVIEWED" : "NOT YET REVIEWED"}
                  </p>
                  <h2>{activeLesson.title}</h2>
                </div>
                <span className="lesson-number">
                  {String(lessons.indexOf(activeLesson) + 1).padStart(2, "0")}
                </span>
              </div>
              <p className="lesson-summary">{activeLesson.summary}</p>

              <div className="lesson-section">
                <p className="eyebrow">RULES TO KNOW</p>
                <div className="rule-grid">
                  {activeLesson.rules.map((rule, index) => (
                    <div key={rule}>
                      <span>{index + 1}</span>
                      <p>{rule}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="lesson-section">
                <p className="eyebrow">THE METHOD</p>
                <ol className="method-list">
                  {activeLesson.method.map((step) => (
                    <li key={step}>{step}</li>
                  ))}
                </ol>
              </div>

              <div className="worked-example">
                <p className="eyebrow">WORKED EXAMPLE</p>
                <h3>{activeLesson.example.prompt}</h3>
                <code>{activeLesson.example.work}</code>
                <strong>{activeLesson.example.answer}</strong>
              </div>

              <div className="memory-line">
                <span>MEMORY HOOK</span>
                <strong>{activeLesson.memory}</strong>
              </div>

              <div className="lesson-actions">
                <button
                  className="secondary-button"
                  onClick={completeLesson}
                  disabled={lessonSaving}
                >
                  {lessonSaving
                    ? "Saving…"
                    : lessonRecord?.completed
                      ? "Review again +20 XP"
                      : "Mark refresher complete +20 XP"}
                </button>
                <button className="primary-button" onClick={practiceLessonSkill}>
                  Practice {activeLesson.skill} →
                </button>
              </div>
            </article>
          </div>
        </section>
      )}

      {tab === "review" && (
        <section className="wide-page review-page">
          <div className="section-intro review-intro">
            <div>
              <p className="eyebrow">MISTAKE REVIEW</p>
              <h1>Turn every miss into a future point.</h1>
              <p>
                You’ll never be shown the exact old answer. Each review launches a
                fresh variation of the same underlying concept.
              </p>
            </div>
            <div className="review-count">
              <strong>{recentMistakes.length}</strong>
              <span>patterns ready</span>
            </div>
          </div>

          {recentMistakes.length ? (
            <div className="review-list">
              {recentMistakes.map(({ history, question: missed }, index) => {
                const mastery = progress.mastery.find(
                  (item) => item.skill === history.skill,
                );
                return (
                  <article key={history.question_id}>
                    <span className="review-index">{String(index + 1).padStart(2, "0")}</span>
                    <div className="review-copy">
                      <div>
                        <span className={`domain-tag ${history.domain.toLowerCase()}`}>
                          {history.domain}
                        </span>
                        <span>{history.skill}</span>
                      </div>
                      <h2>{missed.concept ?? missed.prompt}</h2>
                      <p>{missed.takeaway}</p>
                    </div>
                    <div className="review-signal">
                      <strong>{Math.round((mastery?.rating ?? 0.48) * 100)}%</strong>
                      <span>current mastery</span>
                    </div>
                    <button onClick={() => startQuestionForSkill(history.skill)}>
                      Try a fresh version →
                    </button>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="empty-review">
              <span>✓</span>
              <h2>No recent mistakes waiting.</h2>
              <p>Complete a Quant or Verbal session and any misses will appear here.</p>
              <button className="primary-button" onClick={() => openDomain("Quant")}>
                Start a practice set →
              </button>
            </div>
          )}
        </section>
      )}

      {tab === "plan" && (
        <section className="wide-page">
          <div className="section-intro">
            <p className="eyebrow">YOUR NINE-WEEK SPRINT</p>
            <h1>A deliberate climb to 330–340.</h1>
            <p>
              The plan changes with your mastery data. Weak topics get more
              repetitions; strong topics become timed leverage.
            </p>
          </div>
          <div className="roadmap">
            {roadmap.map((phase, index) => (
              <article className="roadmap-item" key={phase.week}>
                <span className="roadmap-index">{String(index + 1).padStart(2, "0")}</span>
                <div className="roadmap-copy">
                  <p>
                    {phase.week} · {phase.dates}
                  </p>
                  <h2>{phase.title}</h2>
                  <span>{phase.detail}</span>
                </div>
                <div className={`phase-status ${index === 0 ? "current" : ""}`}>
                  {index === 0 ? "In progress" : "Upcoming"}
                </div>
              </article>
            ))}
          </div>
          <div className="weekly-system">
            <article>
              <span>MON–THU</span>
              <h3>Learn + repair</h3>
              <p>Concept lesson, adaptive drill, then error-log retrieval.</p>
            </article>
            <article>
              <span>FRIDAY</span>
              <h3>Timed section</h3>
              <p>Build pacing while preserving the accuracy floor.</p>
            </article>
            <article>
              <span>WEEKEND</span>
              <h3>Test + review</h3>
              <p>One simulation block and a forensic review of every miss.</p>
            </article>
          </div>
        </section>
      )}

      {tab === "analytics" && (
        <section className="wide-page analytics-page">
          <div className="section-intro">
            <p className="eyebrow">TIME + MASTERY TRACKER</p>
            <h1>See the work turn into mastery.</h1>
            <p>
              Every topic shows your active study time, question volume, accuracy,
              and mastery change. Mastery is a training signal—not an official score.
            </p>
          </div>
          <div className="analytics-grid">
            <article className="mastery-panel">
              <div className="panel-title">
                <h2>Topic progress</h2>
                <span>{formatStudyTime(totalStudySeconds)} total study time</span>
              </div>
              <div className="mastery-list">
                {[...progress.mastery]
                  .sort(
                    (a, b) =>
                      a.domain.localeCompare(b.domain) || b.rating - a.rating,
                  )
                  .map((item) => {
                    const time = progress.studyTime.find(
                      (record) => record.skill === item.skill,
                    );
                    const accuracy = item.attempts
                      ? Math.round((item.correct / item.attempts) * 100)
                      : 0;
                    const gain = Math.round((item.rating - 0.48) * 100);
                    return (
                    <div className="mastery-row" key={item.skill}>
                      <div className="topic-identity">
                        <strong>{formatSkill(item.skill)}</strong>
                        <span>{item.domain}</span>
                      </div>
                      <div className="topic-metrics">
                        <span><strong>{formatStudyTime(time?.seconds ?? 0)}</strong> studied</span>
                        <span><strong>{item.attempts}</strong> questions</span>
                        <span><strong>{accuracy}%</strong> accuracy</span>
                      </div>
                      <div className="mastery-track">
                        <div
                          className={item.domain.toLowerCase()}
                          style={{ width: `${item.rating * 100}%` }}
                        />
                      </div>
                      <div className="mastery-score">
                        <strong>{Math.round(item.rating * 100)}%</strong>
                        <span className={gain >= 0 ? "positive" : "negative"}>
                          {gain >= 0 ? "+" : ""}{gain} pts
                        </span>
                      </div>
                    </div>
                    );
                  })}
              </div>
            </article>
            <div className="analytics-stack">
              <article className="stat-panel">
                <p className="eyebrow">ACCURACY</p>
                <h2>
                  {progress.history.length
                    ? Math.round(
                        (progress.history.reduce(
                          (sum, item) => sum + item.correct,
                          0,
                        ) /
                          progress.history.length) *
                          100,
                      )
                    : 0}
                  %
                </h2>
                <p>Across your latest {progress.history.length} answers.</p>
              </article>
              <article className="stat-panel">
                <p className="eyebrow">TOTAL STUDY TIME</p>
                <h2>{formatStudyTime(totalStudySeconds)}</h2>
                <p>Active time in lessons and practice, grouped by topic below.</p>
              </article>
              <article className="stat-panel accent">
                <p className="eyebrow">NEXT BEST ACTION</p>
                <h3>{weakest?.skill}</h3>
                <p>Complete three careful problems, then one timed problem.</p>
                <button
                  className="text-button"
                  onClick={() => {
                    const weakQuestion =
                      questions.find((item) => item.skill === weakest?.skill) ??
                      questions[0];
                    setQuestion(materializeQuestion(weakQuestion, Date.now()));
                    setPracticeDomain(weakQuestion.domain);
                    setSelected([]);
                    setFeedback(null);
                    setStartedAt(Date.now());
                    setTab("practice");
                  }}
                >
                  Start repair set →
                </button>
              </article>
            </div>
          </div>
        </section>
      )}

      {showInstallHelp && (
        <div
          className="modal-backdrop"
          role="presentation"
          onMouseDown={(event) => {
            if (event.currentTarget === event.target) setShowInstallHelp(false);
          }}
        >
          <section className="settings-modal install-modal" role="dialog" aria-modal="true">
            <button
              type="button"
              className="modal-close"
              aria-label="Close installation instructions"
              onClick={() => setShowInstallHelp(false)}
            >
              ×
            </button>
            <div className="install-logo">TP</div>
            <p className="eyebrow">INSTALL GRE TEST PREP</p>
            <h2>Put your coach in the Dock.</h2>
            <p>
              In Safari, choose <strong>File → Add to Dock</strong>. In Chrome or
              Edge, use the install icon in the address bar or choose
              <strong> Install app</strong> from the browser menu.
            </p>
            <div className="install-benefits">
              <span>✓ Opens in its own application window</span>
              <span>✓ Keeps your private cloud progress</span>
              <span>✓ Updates automatically</span>
              <span>✓ Keeps your last dashboard available offline</span>
            </div>
            <button
              className="primary-button full-width"
              onClick={() => setShowInstallHelp(false)}
            >
              Got it
            </button>
          </section>
        </div>
      )}

      {showSettings && (
        <div
          className="modal-backdrop"
          role="presentation"
          onMouseDown={(event) => {
            if (event.currentTarget === event.target) setShowSettings(false);
          }}
        >
          <form className="settings-modal" onSubmit={saveProfile}>
            <button
              type="button"
              className="modal-close"
              aria-label="Close settings"
              onClick={() => setShowSettings(false)}
            >
              ×
            </button>
            <p className="eyebrow">CALIBRATE YOUR COACH</p>
            <h2>Set the finish line.</h2>
            <p>
              Enter official POWERPREP scores when you have them. The engine will
              use them as the anchor for your training estimate.
            </p>
            <label>
              Target total score
              <input
                type="number"
                min="260"
                max="340"
                value={targetScore}
                onChange={(event) => setTargetScore(Number(event.target.value))}
              />
            </label>
            <div className="field-row">
              <label>
                Baseline Quant
                <input
                  type="number"
                  min="130"
                  max="170"
                  placeholder="e.g. 158"
                  value={baselineQuant}
                  onChange={(event) => setBaselineQuant(event.target.value)}
                />
              </label>
              <label>
                Baseline Verbal
                <input
                  type="number"
                  min="130"
                  max="170"
                  placeholder="e.g. 156"
                  value={baselineVerbal}
                  onChange={(event) => setBaselineVerbal(event.target.value)}
                />
              </label>
            </div>
            <label>
              Study hours per week
              <input
                type="number"
                min="4"
                max="40"
                value={weeklyHours}
                onChange={(event) => setWeeklyHours(Number(event.target.value))}
              />
            </label>
            <button className="primary-button full-width" disabled={saving}>
              {saving ? "Saving…" : "Update my training"}
            </button>
          </form>
        </div>
      )}
    </main>
  );
}
