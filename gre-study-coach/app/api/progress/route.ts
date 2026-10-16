import { env } from "cloudflare:workers";
import { questions, skillOrder } from "../../lib/questions";

type MasteryRow = {
  skill: string;
  domain: string;
  attempts: number;
  correct: number;
  rating: number;
  last_seen: string | null;
};

type ProfileRow = {
  id: string;
  target_score: number;
  baseline_quant: number | null;
  baseline_verbal: number | null;
  weekly_hours: number;
  streak: number;
  xp: number;
  last_active: string | null;
};

async function initialize() {
  const db = env.DB;
  await db.batch([
    db.prepare(
      `CREATE TABLE IF NOT EXISTS profile (
        id TEXT PRIMARY KEY,
        target_score INTEGER NOT NULL DEFAULT 335,
        baseline_quant INTEGER,
        baseline_verbal INTEGER,
        weekly_hours INTEGER NOT NULL DEFAULT 18,
        streak INTEGER NOT NULL DEFAULT 0,
        xp INTEGER NOT NULL DEFAULT 0,
        last_active TEXT,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      )`,
    ),
    db.prepare(
      `CREATE TABLE IF NOT EXISTS mastery (
        skill TEXT PRIMARY KEY,
        domain TEXT NOT NULL,
        attempts INTEGER NOT NULL DEFAULT 0,
        correct INTEGER NOT NULL DEFAULT 0,
        rating REAL NOT NULL DEFAULT 0.48,
        last_seen TEXT
      )`,
    ),
    db.prepare(
      `CREATE TABLE IF NOT EXISTS answer_log (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        question_id TEXT NOT NULL,
        domain TEXT NOT NULL,
        skill TEXT NOT NULL,
        correct INTEGER NOT NULL,
        seconds INTEGER NOT NULL,
        confidence INTEGER NOT NULL,
        created_at TEXT NOT NULL
      )`,
    ),
    db.prepare(
      `CREATE TABLE IF NOT EXISTS lesson_progress (
        skill TEXT PRIMARY KEY,
        views INTEGER NOT NULL DEFAULT 0,
        completed INTEGER NOT NULL DEFAULT 0,
        last_reviewed TEXT
      )`,
    ),
    db.prepare(
      `CREATE TABLE IF NOT EXISTS study_time (
        skill TEXT PRIMARY KEY,
        seconds INTEGER NOT NULL DEFAULT 0,
        sessions INTEGER NOT NULL DEFAULT 0,
        updated_at TEXT
      )`,
    ),
    db.prepare(
      "CREATE INDEX IF NOT EXISTS idx_answer_log_created_at ON answer_log(created_at)",
    ),
    db.prepare(
      "CREATE INDEX IF NOT EXISTS idx_answer_log_skill_created ON answer_log(skill, created_at)",
    ),
  ]);

  const now = new Date().toISOString();
  await db
    .prepare(
      `INSERT OR IGNORE INTO profile
        (id, target_score, weekly_hours, streak, xp, created_at, updated_at)
       VALUES ('primary', 335, 18, 0, 0, ?, ?)`,
    )
    .bind(now, now)
    .run();

  const domainFor = new Map(
    questions.map((question) => [question.skill, question.domain]),
  );
  await db.batch(
    skillOrder.map((skill) =>
      db
        .prepare(
          `INSERT OR IGNORE INTO mastery
            (skill, domain, attempts, correct, rating)
           VALUES (?, ?, 0, 0, 0.48)`,
        )
        .bind(skill, domainFor.get(skill) ?? "Quant"),
    ),
  );
  await db.batch(
    skillOrder.map((skill) =>
      db
        .prepare(
          `INSERT OR IGNORE INTO lesson_progress
            (skill, views, completed) VALUES (?, 0, 0)`,
        )
        .bind(skill),
    ),
  );
  await db.batch(
    skillOrder.map((skill) =>
      db
        .prepare(
          `INSERT OR IGNORE INTO study_time
            (skill, seconds, sessions) VALUES (?, 0, 0)`,
        )
        .bind(skill),
    ),
  );
}

async function readProgress() {
  const [profileResult, masteryResult, historyResult, lessonsResult, timeResult] =
    await Promise.all([
    env.DB.prepare("SELECT * FROM profile WHERE id = 'primary'").all<ProfileRow>(),
    env.DB.prepare(
      "SELECT * FROM mastery ORDER BY rating ASC, attempts ASC",
    ).all<MasteryRow>(),
    env.DB.prepare(
      `SELECT question_id, domain, skill, correct, seconds, confidence, created_at
       FROM answer_log ORDER BY id DESC LIMIT 12`,
    ).all(),
      env.DB.prepare(
        "SELECT skill, views, completed, last_reviewed FROM lesson_progress ORDER BY skill",
      ).all(),
      env.DB.prepare(
        "SELECT skill, seconds, sessions, updated_at FROM study_time ORDER BY skill",
      ).all(),
    ]);

  return {
    profile: profileResult.results?.[0],
    mastery: masteryResult.results ?? [],
    history: historyResult.results ?? [],
    lessons: lessonsResult.results ?? [],
    studyTime: timeResult.results ?? [],
  };
}

export async function GET() {
  try {
    await initialize();
    return Response.json(await readProgress());
  } catch (error) {
    return Response.json(
      {
        error:
          error instanceof Error ? error.message : "Unable to load progress",
      },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    await initialize();
    const payload = (await request.json()) as
      | {
          action: "answer";
          questionId: string;
          correct: boolean;
          seconds: number;
          confidence: number;
          dayKey?: string;
        }
      | {
          action: "profile";
          targetScore: number;
          baselineQuant: number | null;
          baselineVerbal: number | null;
          weeklyHours: number;
        }
      | {
          action: "lesson";
          skill: string;
        }
      | {
          action: "time";
          skill: string;
          seconds: number;
        };

    const now = new Date();
    const nowIso = now.toISOString();

    if (payload.action === "profile") {
      const target = Math.min(340, Math.max(260, payload.targetScore || 335));
      const quant = payload.baselineQuant
        ? Math.min(170, Math.max(130, payload.baselineQuant))
        : null;
      const verbal = payload.baselineVerbal
        ? Math.min(170, Math.max(130, payload.baselineVerbal))
        : null;
      const hours = Math.min(40, Math.max(4, payload.weeklyHours || 18));

      await env.DB.prepare(
        `UPDATE profile SET target_score = ?, baseline_quant = ?,
         baseline_verbal = ?, weekly_hours = ?, updated_at = ?
         WHERE id = 'primary'`,
      )
        .bind(target, quant, verbal, hours, nowIso)
        .run();

      return Response.json(await readProgress());
    }

    if (payload.action === "lesson") {
      if (!skillOrder.includes(payload.skill)) {
        return Response.json({ error: "Unknown lesson" }, { status: 400 });
      }
      await env.DB.batch([
        env.DB.prepare(
          `UPDATE lesson_progress SET views = views + 1, completed = 1,
           last_reviewed = ? WHERE skill = ?`,
        ).bind(nowIso, payload.skill),
        env.DB.prepare(
          `UPDATE profile SET xp = xp + 20, updated_at = ?
           WHERE id = 'primary'`,
        ).bind(nowIso),
      ]);
      return Response.json(await readProgress());
    }

    if (payload.action === "time") {
      if (!skillOrder.includes(payload.skill)) {
        return Response.json({ error: "Unknown study topic" }, { status: 400 });
      }
      const seconds = Math.min(300, Math.max(1, Math.round(payload.seconds)));
      await env.DB.prepare(
        `UPDATE study_time SET seconds = seconds + ?, sessions = sessions + 1,
         updated_at = ? WHERE skill = ?`,
      )
        .bind(seconds, nowIso, payload.skill)
        .run();
      return Response.json(await readProgress());
    }

    const question = questions.find(
      (candidate) => candidate.id === payload.questionId,
    );
    if (!question) {
      return Response.json({ error: "Unknown question" }, { status: 400 });
    }

    const existing = await env.DB.prepare(
      "SELECT attempts, correct, rating FROM mastery WHERE skill = ?",
    )
      .bind(question.skill)
      .first<{ attempts: number; correct: number; rating: number }>();

    const attempts = existing?.attempts ?? 0;
    const rating = existing?.rating ?? 0.48;
    const difficultyTarget = 0.28 + question.difficulty * 0.115;
    const result = payload.correct ? 1 : 0;
    const learningRate = attempts < 4 ? 0.22 : 0.12;
    const speedTarget = question.domain === "Quant" ? 105 : 90;
    const speedBonus =
      payload.correct && payload.seconds <= speedTarget ? 0.025 : 0;
    const overconfidencePenalty =
      !payload.correct && payload.confidence === 3 ? 0.025 : 0;
    const newRating = Math.min(
      0.98,
      Math.max(
        0.18,
        rating +
          learningRate * (result - difficultyTarget) +
          speedBonus -
          overconfidencePenalty,
      ),
    );

    const today =
      payload.dayKey && /^\d{4}-\d{2}-\d{2}$/.test(payload.dayKey)
        ? payload.dayKey
        : nowIso.slice(0, 10);
    const profile = await env.DB.prepare(
      "SELECT last_active, streak FROM profile WHERE id = 'primary'",
    ).first<{ last_active: string | null; streak: number }>();
    const lastDay = profile?.last_active?.slice(0, 10) ?? null;
    const yesterday = new Date(`${today}T12:00:00.000Z`);
    yesterday.setUTCDate(yesterday.getUTCDate() - 1);
    const yesterdayKey = yesterday.toISOString().slice(0, 10);
    const streak =
      lastDay === today
        ? profile?.streak ?? 1
        : lastDay === yesterdayKey
          ? (profile?.streak ?? 0) + 1
          : 1;
    const xpGain = payload.correct ? 12 + question.difficulty * 3 : 5;

    await env.DB.batch([
      env.DB.prepare(
        `UPDATE mastery SET attempts = attempts + 1,
         correct = correct + ?, rating = ?, last_seen = ? WHERE skill = ?`,
      ).bind(result, newRating, nowIso, question.skill),
      env.DB.prepare(
        `INSERT INTO answer_log
          (question_id, domain, skill, correct, seconds, confidence, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
      ).bind(
        question.id,
        question.domain,
        question.skill,
        result,
        Math.min(999, Math.max(1, Math.round(payload.seconds))),
        Math.min(3, Math.max(1, payload.confidence)),
        nowIso,
      ),
      env.DB.prepare(
        `UPDATE profile SET streak = ?, xp = xp + ?, last_active = ?,
         updated_at = ? WHERE id = 'primary'`,
      ).bind(streak, xpGain, `${today}T12:00:00.000Z`, nowIso),
    ]);

    return Response.json(await readProgress());
  } catch (error) {
    return Response.json(
      {
        error:
          error instanceof Error ? error.message : "Unable to save progress",
      },
      { status: 500 },
    );
  }
}
