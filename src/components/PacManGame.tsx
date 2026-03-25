import { useRef, useEffect, useState, useCallback } from "react";
import anneHeadshot from "figma:asset/29f66bb6f3055105f6a8abe6087b6f77dbebc7be.png";

// ── Maze: 0=path, 1=wall, 2=dot, 3=power pellet, 4=boss1(star), 5=boss2(diamond), 7=boss3(about), 6=empty ──
const COLS = 21;
const ROWS = 15;

const MAZE_TEMPLATE: number[][] = [
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
  [1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
  [1,2,2,1,1,2,2,2,2,2,2,2,2,2,2,2,4,2,2,2,1],
  [1,2,2,1,1,2,2,2,2,2,2,2,2,2,1,2,2,2,2,2,1],
  [1,3,2,2,2,2,2,2,2,1,1,1,2,2,2,2,2,2,2,3,1],
  [1,2,2,2,2,2,2,2,2,1,6,1,2,2,2,2,2,2,2,2,1],
  [1,2,2,2,2,2,2,2,2,1,2,1,2,2,2,2,2,2,2,2,1],
  [1,2,2,2,2,2,1,2,2,2,2,2,2,2,1,2,2,2,2,2,1],
  [1,2,2,2,2,2,1,2,2,2,2,2,2,2,1,2,2,2,2,2,1],
  [1,2,5,2,2,2,2,2,2,2,2,2,2,2,2,2,2,7,2,2,1],
  [1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
  [1,2,2,1,1,2,2,2,2,2,2,2,2,2,2,2,1,1,2,2,1],
  [1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
];

type Dir = "up" | "down" | "left" | "right";
interface Pos { x: number; y: number }

interface Ghost {
  pos: Pos;
  dir: Dir;
  color: string;
  scared: boolean;
}

interface Boss {
  pos: Pos;
  id: number;
  name: string;
  slug: string;
  eaten: boolean;
  type: "star" | "diamond" | "about";
}

type GamePhase = "ready" | "playing" | "paused" | "boss-popup" | "gameover";

const DIRS: Record<Dir, Pos> = {
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
};
const ALL_DIRS: Dir[] = ["up", "down", "left", "right"];

function cloneMaze() {
  return MAZE_TEMPLATE.map((r) => [...r]);
}

function canMove(maze: number[][], x: number, y: number): boolean {
  if (x < 0 || x >= COLS || y < 0 || y >= ROWS) return false;
  return maze[y][x] !== 1;
}

function drawDiamond(ctx: CanvasRenderingContext2D, cx: number, cy: number, size: number) {
  ctx.beginPath();
  ctx.moveTo(cx, cy - size);
  ctx.lineTo(cx + size, cy);
  ctx.lineTo(cx, cy + size);
  ctx.lineTo(cx - size, cy);
  ctx.closePath();
}

function drawStar(ctx: CanvasRenderingContext2D, cx: number, cy: number, outerR: number, innerR: number, points: number) {
  ctx.beginPath();
  for (let i = 0; i < points * 2; i++) {
    const r = i % 2 === 0 ? outerR : innerR;
    const angle = (Math.PI * i) / points - Math.PI / 2;
    const x = cx + Math.cos(angle) * r;
    const y = cy + Math.sin(angle) * r;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
}

const HEADSHOT_URL = anneHeadshot;

interface ProjectInfo {
  title: string;
  bullets: string[];
  tags: string[];
  loomUrl?: string;
  caseStudyUrl?: string;
  siteUrl?: string;
  siteName?: string;
}

const projectData: Record<string, ProjectInfo> = {
  "nyle-ai": {
    title: "Nyle AI — B2B Amazon Seller Copilot",
    bullets: [
      "Led the AI agent layer for a B2B Amazon seller copilot serving 4 enterprise clients to drive store profitability, by integrating across 7+ independent ETL services via 80+ API endpoints with Python",
      "Reduced agent layer response latency from 7.8s to 2.35s via migrating backend platform from n8n pipeline to LangGraph based system, enhanced structured observability and faster debugging cycles across the agent pipeline",
      "Eliminated single point of failure bottlenecks by leveraging a two-stage hybrid date recognition system, reached accuracy from 78.9% to 99.8% across 1000+ LangSmith test cases",
      "Rearchitected agent system from routing multi-agent design to a unified orchestrator to automate cross-domain coherent intelligence through inventory, advertising, and goal tracking, backed by a Neo4j graph database",
    ],
    tags: ["LangGraph", "Multi-Agent", "GraphRAG", "Neo4j", "Redis", "Python", "n8n", "TypeScript", "Next.js"],
    loomUrl: "https://www.loom.com/share/f636a6fe462d4157874282c027bcb8b0",
    caseStudyUrl: "https://nyle.ai/case-study/inopro-ads",
    siteUrl: "https://nyle.ai/",
    siteName: "nyle.ai",
  },
  "agentic-rl": {
    title: "Agentic RL Pipeline — Reward-Driven Agent Training",
    bullets: [
      "Designed and implemented a GRPO-based reinforcement learning pipeline for training language model agents on multi-step reasoning tasks",
      "Built custom reward functions combining code execution feedback, format validation, and semantic correctness scoring across diverse task domains",
      "Achieved 34% improvement in agent task completion rate through iterative reward shaping and curriculum-based training schedules",
      "Integrated evaluation harness with LangSmith for systematic tracking of agent behavior regressions across training checkpoints",
    ],
    tags: ["GRPO", "Reinforcement Learning", "PyTorch", "vLLM", "LangSmith", "Python", "Weights & Biases"],
    loomUrl: undefined,
    caseStudyUrl: undefined,
    siteUrl: undefined,
    siteName: undefined,
  },
};

const defaultProject: ProjectInfo = {
  title: "Project",
  bullets: [],
  tags: [],
};

export function PacManGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const headshotRef = useRef<HTMLImageElement | null>(null);
  const headshotLoadedRef = useRef(false);

  const mazeRef = useRef(cloneMaze());
  const playerRef = useRef<Pos>({ x: 1, y: 13 });
  const playerDirRef = useRef<Dir>("right");
  const nextDirRef = useRef<Dir>("right");
  const ghostsRef = useRef<Ghost[]>([]);
  const bossesRef = useRef<Boss[]>([]);
  const scoreRef = useRef(0);
  const highScoreRef = useRef(0);
  const livesRef = useRef(3);
  const bossesEatenRef = useRef(0);
  const phaseRef = useRef<GamePhase>("ready");
  const powerTimerRef = useRef(0);
  const tickRef = useRef(0);
  const mouthOpenRef = useRef(true);
  const ghostMoveCounterRef = useRef(0);
  const keyHeldRef = useRef(false);
  const prevPosRef = useRef<Pos>({ x: 1, y: 13 });
  const lastMoveTickRef = useRef(0);

  const [phase, setPhase] = useState<GamePhase>("ready");
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [bossesEaten, setBossesEaten] = useState(0);
  const [popupBoss, setPopupBoss] = useState<Boss | null>(null);
  const [cellSize, setCellSize] = useState(28);

  const rafRef = useRef<number>(0);
  const lastTickRef = useRef(0);

  useEffect(() => { phaseRef.current = phase; }, [phase]);

  // Load headshot image
  useEffect(() => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => { headshotLoadedRef.current = true; };
    img.src = HEADSHOT_URL;
    headshotRef.current = img;
  }, []);

  useEffect(() => {
    const hs = parseInt(localStorage.getItem("pacman-hs") || "0", 10);
    highScoreRef.current = hs;
    setHighScore(hs);
  }, []);

  const initGame = useCallback(() => {
    mazeRef.current = cloneMaze();
    playerRef.current = { x: 1, y: 13 };
    playerDirRef.current = "right";
    nextDirRef.current = "right";
    scoreRef.current = 0;
    livesRef.current = 3;
    bossesEatenRef.current = 0;
    powerTimerRef.current = 0;
    tickRef.current = 0;
    ghostMoveCounterRef.current = 0;

    ghostsRef.current = [
      { pos: { x: 10, y: 6 }, dir: "left", color: "#ff69b4", scared: false },
      { pos: { x: 14, y: 8 }, dir: "up", color: "#ff6347", scared: false },
    ];

    bossesRef.current = [
      { pos: { x: 2, y: 10 }, id: 1, name: "Nyle AI", slug: "nyle-ai", eaten: false, type: "star" },
      { pos: { x: 16, y: 3 }, id: 2, name: "Agentic RL Pipeline", slug: "agentic-rl", eaten: false, type: "diamond" },
      { pos: { x: 17, y: 10 }, id: 3, name: "About Me", slug: "about", eaten: false, type: "about" },
    ];

    setScore(0);
    setLives(3);
    setBossesEaten(0);
    setPopupBoss(null);
  }, []);

  // Responsive cell size
  useEffect(() => {
    function resize() {
      if (!containerRef.current) return;
      const w = containerRef.current.clientWidth;
      // Reserve ~160px for HUD on the right
      const availW = Math.min(w - 160, w * 0.72);
      const maxCellW = Math.floor(availW / COLS);
      // Also limit by height: game should fit in roughly 60vh
      const availH = window.innerHeight * 0.55;
      const maxCellH = Math.floor(availH / ROWS);
      setCellSize(Math.min(maxCellW, maxCellH, 30));
    }
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  useEffect(() => { initGame(); }, [initGame]);

  // Keyboard controls
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      const p = phaseRef.current;

      if (p === "ready") {
        setPhase("playing");
        return;
      }

      if (p === "boss-popup") {
        if (e.key === "Escape" || e.key === " " || e.key === "Enter") {
          setPopupBoss(null);
          setPhase("playing");
        }
        return;
      }

      if (p === "gameover") {
        initGame();
        setPhase("playing");
        return;
      }

      if (p === "paused" && e.key === " ") { setPhase("playing"); return; }
      if (p === "playing" && e.key === " ") { setPhase("paused"); return; }
      if (p !== "playing") return;

      const keyMap: Record<string, Dir> = {
        ArrowUp: "up", ArrowDown: "down", ArrowLeft: "left", ArrowRight: "right",
        w: "up", s: "down", a: "left", d: "right",
        W: "up", S: "down", A: "left", D: "right",
      };
      if (keyMap[e.key]) {
        e.preventDefault();
        e.stopPropagation();
        const newDir = keyMap[e.key];
        nextDirRef.current = newDir;
        keyHeldRef.current = true;
        if (!e.repeat) {
          const maze = mazeRef.current;
          const np = { x: playerRef.current.x + DIRS[newDir].x, y: playerRef.current.y + DIRS[newDir].y };
          if (canMove(maze, np.x, np.y)) {
            playerDirRef.current = newDir;
            lastTickRef.current = performance.now();
          }
        }
      }
    }
    function handleKeyUp(e: KeyboardEvent) {
      const keyMap: Record<string, Dir> = {
        ArrowUp: "up", ArrowDown: "down", ArrowLeft: "left", ArrowRight: "right",
        w: "up", s: "down", a: "left", d: "right",
        W: "up", S: "down", A: "left", D: "right",
      };
      if (keyMap[e.key]) {
        keyHeldRef.current = false;
      }
    }
    window.addEventListener("keydown", handleKey);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKey);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [initGame]);

  // Touch controls
  useEffect(() => {
    let touchStart: Pos | null = null;
    function onStart(e: TouchEvent) {
      const t = e.touches[0];
      touchStart = { x: t.clientX, y: t.clientY };
      if (phaseRef.current === "ready") setPhase("playing");
    }
    function onEnd(e: TouchEvent) {
      if (!touchStart) return;
      const t = e.changedTouches[0];
      const dx = t.clientX - touchStart.x;
      const dy = t.clientY - touchStart.y;
      if (Math.abs(dx) < 20 && Math.abs(dy) < 20) return;
      if (Math.abs(dx) > Math.abs(dy)) {
        nextDirRef.current = dx > 0 ? "right" : "left";
      } else {
        nextDirRef.current = dy > 0 ? "down" : "up";
      }
      touchStart = null;
    }
    const el = containerRef.current;
    if (el) {
      el.addEventListener("touchstart", onStart, { passive: true });
      el.addEventListener("touchend", onEnd, { passive: true });
    }
    return () => {
      if (el) {
        el.removeEventListener("touchstart", onStart);
        el.removeEventListener("touchend", onEnd);
      }
    };
  }, []);

  // Game loop
  useEffect(() => {
    const TICK_MS = 120;
    const GHOST_TICK = 3;

    function moveGhosts() {
      const maze = mazeRef.current;
      ghostsRef.current.forEach((g) => {
        const possibleDirs = ALL_DIRS.filter((d) => {
          const np = { x: g.pos.x + DIRS[d].x, y: g.pos.y + DIRS[d].y };
          return canMove(maze, np.x, np.y);
        });
        const nonReverse = possibleDirs.filter((d) => {
          if (g.dir === "up" && d === "down") return false;
          if (g.dir === "down" && d === "up") return false;
          if (g.dir === "left" && d === "right") return false;
          if (g.dir === "right" && d === "left") return false;
          return true;
        });
        const choices = nonReverse.length > 0 ? nonReverse : possibleDirs;
        if (choices.length === 0) return;
        let newDir: Dir;
        if (choices.includes(g.dir) && Math.random() > 0.3) {
          newDir = g.dir;
        } else {
          newDir = choices[Math.floor(Math.random() * choices.length)];
        }
        g.dir = newDir;
        g.pos = { x: g.pos.x + DIRS[newDir].x, y: g.pos.y + DIRS[newDir].y };
      });
    }

    function checkGhostCollision(): boolean {
      const p = playerRef.current;
      for (const g of ghostsRef.current) {
        if (g.pos.x === p.x && g.pos.y === p.y) {
          if (powerTimerRef.current > 0 || g.scared) {
            g.pos = { x: 10, y: 6 };
            g.scared = false;
            scoreRef.current += 200;
            setScore(scoreRef.current);
          } else {
            return true;
          }
        }
      }
      return false;
    }

    function tick() {
      if (phaseRef.current !== "playing") return;
      tickRef.current++;
      mouthOpenRef.current = tickRef.current % 2 === 0;

      // Only move Pac-Man when a key is actively held
      if (keyHeldRef.current) {
        const maze = mazeRef.current;
        const next = nextDirRef.current;
        const np = { x: playerRef.current.x + DIRS[next].x, y: playerRef.current.y + DIRS[next].y };

        if (canMove(maze, np.x, np.y)) {
          playerDirRef.current = next;
          prevPosRef.current = { ...playerRef.current };
          lastMoveTickRef.current = performance.now();
          playerRef.current = np;
        } else {
          const cur = playerDirRef.current;
          const cp = { x: playerRef.current.x + DIRS[cur].x, y: playerRef.current.y + DIRS[cur].y };
          if (canMove(maze, cp.x, cp.y)) {
            prevPosRef.current = { ...playerRef.current };
            lastMoveTickRef.current = performance.now();
            playerRef.current = cp;
          }
        }
      }

      const maze = mazeRef.current;
      const px = playerRef.current.x;
      const py = playerRef.current.y;
      const cell = maze[py][px];

      if (cell === 2) {
        maze[py][px] = 6;
        scoreRef.current += 10;
        setScore(scoreRef.current);
      } else if (cell === 3) {
        maze[py][px] = 6;
        scoreRef.current += 50;
        powerTimerRef.current = 30;
        ghostsRef.current.forEach((g) => (g.scared = true));
        setScore(scoreRef.current);
      }

      for (const boss of bossesRef.current) {
        if (!boss.eaten && boss.pos.x === px && boss.pos.y === py) {
          boss.eaten = true;
          bossesEatenRef.current++;
          setBossesEaten(bossesEatenRef.current);
          scoreRef.current += 500;
          setScore(scoreRef.current);
          setPopupBoss(boss);
          setPhase("boss-popup");
          maze[boss.pos.y][boss.pos.x] = 6;
          return;
        }
      }

      if (powerTimerRef.current > 0) {
        powerTimerRef.current--;
        if (powerTimerRef.current <= 0) {
          ghostsRef.current.forEach((g) => (g.scared = false));
        }
      }

      ghostMoveCounterRef.current++;
      if (ghostMoveCounterRef.current >= GHOST_TICK) {
        ghostMoveCounterRef.current = 0;
        moveGhosts();
      }

      if (checkGhostCollision()) {
        livesRef.current--;
        setLives(livesRef.current);
        if (livesRef.current <= 0) {
          if (scoreRef.current > highScoreRef.current) {
            highScoreRef.current = scoreRef.current;
            localStorage.setItem("pacman-hs", String(scoreRef.current));
            setHighScore(scoreRef.current);
          }
          setPhase("gameover");
        } else {
          playerRef.current = { x: 1, y: 13 };
          playerDirRef.current = "right";
          nextDirRef.current = "right";
          powerTimerRef.current = 0;
          ghostsRef.current.forEach((g) => (g.scared = false));
        }
      }

      if (scoreRef.current > highScoreRef.current) {
        highScoreRef.current = scoreRef.current;
        localStorage.setItem("pacman-hs", String(scoreRef.current));
        setHighScore(scoreRef.current);
      }
    }

    function draw(now: number) {
      rafRef.current = requestAnimationFrame(draw);

      if (now - lastTickRef.current >= TICK_MS) {
        lastTickRef.current = now;
        tick();
      }

      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const cs = cellSize;
      if (cs <= 0) return;
      const w = COLS * cs;
      const h = ROWS * cs;
      canvas.width = w;
      canvas.height = h;

      ctx.fillStyle = "#000010";
      ctx.fillRect(0, 0, w, h);

      const maze = mazeRef.current;

      // Draw maze
      for (let y = 0; y < ROWS; y++) {
        for (let x = 0; x < COLS; x++) {
          const cell = maze[y][x];
          const cx = x * cs + cs / 2;
          const cy = y * cs + cs / 2;

          if (cell === 1) {
            ctx.fillStyle = "#0a0a2a";
            ctx.fillRect(x * cs + 1, y * cs + 1, cs - 2, cs - 2);
            ctx.strokeStyle = "#2244aa";
            ctx.lineWidth = 1.5;
            ctx.strokeRect(x * cs + 1.5, y * cs + 1.5, cs - 3, cs - 3);
          } else if (cell === 2) {
            ctx.fillStyle = "#ffaa33";
            ctx.beginPath();
            ctx.arc(cx, cy, Math.max(cs * 0.1, 1), 0, Math.PI * 2);
            ctx.fill();
          } else if (cell === 3) {
            const pr = Math.max(cs * 0.22, 2);
            ctx.fillStyle = "#ff5577";
            ctx.beginPath();
            ctx.arc(cx, cy, pr, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowColor = "#ff5577";
            ctx.shadowBlur = 8;
            ctx.beginPath();
            ctx.arc(cx, cy, Math.max(cs * 0.18, 1.5), 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;
          }
        }
      }

      // Draw bosses
      for (const boss of bossesRef.current) {
        if (boss.eaten) continue;
        const bx = boss.pos.x * cs + cs / 2;
        const by = boss.pos.y * cs + cs / 2;
        const pulse = 0.7 + 0.3 * Math.sin(now / 350);
        const iconSize = cs * 0.42;

        if (boss.type === "star") {
          // Gold pulsing star
          const col = "#ffaa33";
          ctx.shadowColor = col;
          ctx.shadowBlur = 16 * pulse;
          ctx.fillStyle = col;
          drawStar(ctx, bx, by, iconSize, iconSize * 0.4, 5);
          ctx.fill();
          ctx.fillStyle = "#000010";
          ctx.beginPath();
          ctx.arc(bx, by, iconSize * 0.25, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;
          // Label
          ctx.fillStyle = col;
          ctx.font = `bold ${Math.max(cs * 0.3, 8)}px 'JetBrains Mono', monospace`;
          ctx.textAlign = "center";
          ctx.textBaseline = "top";
          ctx.fillText("P1", bx, by + iconSize + 4);
        } else if (boss.type === "diamond") {
          // Green rotating diamond
          const col = "#00e89a";
          const rot = now / 1500;
          ctx.save();
          ctx.translate(bx, by);
          ctx.rotate(rot);
          ctx.shadowColor = col;
          ctx.shadowBlur = 16 * pulse;
          ctx.fillStyle = col;
          drawDiamond(ctx, 0, 0, iconSize);
          ctx.fill();
          ctx.fillStyle = "#000010";
          drawDiamond(ctx, 0, 0, iconSize * 0.45);
          ctx.fill();
          ctx.shadowBlur = 0;
          ctx.restore();
          // Label
          ctx.fillStyle = col;
          ctx.font = `bold ${Math.max(cs * 0.3, 8)}px 'JetBrains Mono', monospace`;
          ctx.textAlign = "center";
          ctx.textBaseline = "top";
          ctx.fillText("P2", bx, by + iconSize + 4);
        } else if (boss.type === "about") {
          // Circular headshot with cyan orbit ring
          const radius = cs * 0.4;
          // Draw animated dashed orbit ring
          ctx.save();
          ctx.strokeStyle = "#00e5ff";
          ctx.lineWidth = 1.5;
          ctx.setLineDash([4, 4]);
          ctx.lineDashOffset = -now / 100;
          ctx.shadowColor = "#00e5ff";
          ctx.shadowBlur = 8 * pulse;
          ctx.beginPath();
          ctx.arc(bx, by, radius + 4, 0, Math.PI * 2);
          ctx.stroke();
          ctx.setLineDash([]);
          ctx.shadowBlur = 0;
          ctx.restore();

          // Clip and draw headshot
          if (headshotLoadedRef.current && headshotRef.current) {
            ctx.save();
            ctx.beginPath();
            ctx.arc(bx, by, radius, 0, Math.PI * 2);
            ctx.clip();
            ctx.drawImage(headshotRef.current, bx - radius, by - radius, radius * 2, radius * 2);
            ctx.restore();
          } else {
            // Placeholder circle
            ctx.fillStyle = "#1a2a4a";
            ctx.beginPath();
            ctx.arc(bx, by, radius, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = "#00e5ff";
            ctx.font = `bold ${Math.max(cs * 0.3, 8)}px 'JetBrains Mono', monospace`;
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText("ANNE", bx, by);
          }
          // The "ABOUT ME" text is replaced by the photo as requested
        }
      }

      // Draw ghosts
      for (const ghost of ghostsRef.current) {
        const gx = ghost.pos.x * cs + cs / 2;
        const gy = ghost.pos.y * cs + cs / 2;
        const gr = Math.max(cs * 0.38, 2);
        ctx.fillStyle = ghost.scared || powerTimerRef.current > 0 ? "#4444ff" : ghost.color;
        ctx.beginPath();
        ctx.arc(gx, gy - gr * 0.15, gr, Math.PI, 0);
        ctx.lineTo(gx + gr, gy + gr * 0.6);
        const waves = 3;
        for (let i = 0; i < waves; i++) {
          const ww = (gr * 2) / waves;
          const wx = gx + gr - ww * i;
          ctx.quadraticCurveTo(wx - ww * 0.25, gy + gr * 0.2, wx - ww * 0.5, gy + gr * 0.6);
          ctx.quadraticCurveTo(wx - ww * 0.75, gy + gr, wx - ww, gy + gr * 0.6);
        }
        ctx.closePath();
        ctx.fill();
        // Eyes
        const eyeR = Math.max(gr * 0.25, 1);
        const pupilR = Math.max(gr * 0.12, 0.5);
        ctx.fillStyle = "#fff";
        ctx.beginPath();
        ctx.arc(gx - gr * 0.3, gy - gr * 0.25, eyeR, 0, Math.PI * 2);
        ctx.arc(gx + gr * 0.3, gy - gr * 0.25, eyeR, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#111";
        ctx.beginPath();
        ctx.arc(gx - gr * 0.22, gy - gr * 0.2, pupilR, 0, Math.PI * 2);
        ctx.arc(gx + gr * 0.38, gy - gr * 0.2, pupilR, 0, Math.PI * 2);
        ctx.fill();
      }

      // Draw Pac-Man with interpolation
      const lerpT = Math.min((now - lastMoveTickRef.current) / TICK_MS, 1);
      const prevX = prevPosRef.current.x;
      const prevY = prevPosRef.current.y;
      const curX = playerRef.current.x;
      const curY = playerRef.current.y;
      const interpX = (prevX + (curX - prevX) * lerpT) * cs + cs / 2;
      const interpY = (prevY + (curY - prevY) * lerpT) * cs + cs / 2;
      const pr = Math.max(cs * 0.4, 2);
      const mouthCycle = Math.sin(now / 60) * 0.5 + 0.5;
      const mouthAngle = 0.05 + mouthCycle * 0.2;
      const dirAngles: Record<Dir, number> = { right: 0, down: Math.PI / 2, left: Math.PI, up: -Math.PI / 2 };
      const angle = dirAngles[playerDirRef.current];
      ctx.fillStyle = "#ffcc00";
      ctx.beginPath();
      ctx.arc(interpX, interpY, pr, angle + Math.PI * mouthAngle, angle - Math.PI * mouthAngle + Math.PI * 2);
      ctx.lineTo(interpX, interpY);
      ctx.closePath();
      ctx.fill();

      // Overlays
      if (phaseRef.current === "ready") {
        ctx.fillStyle = "rgba(0,0,0,0.6)";
        ctx.fillRect(0, 0, w, h);
        ctx.fillStyle = "#00e89a";
        ctx.font = `bold ${cs * 0.8}px 'JetBrains Mono', monospace`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("PRESS ANY KEY TO START", w / 2, h / 2);
      }

      if (phaseRef.current === "paused") {
        ctx.fillStyle = "rgba(0,0,0,0.5)";
        ctx.fillRect(0, 0, w, h);
        ctx.fillStyle = "#00e89a";
        ctx.font = `bold ${cs * 0.8}px 'JetBrains Mono', monospace`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("PAUSED", w / 2, h / 2);
      }

      if (phaseRef.current === "gameover") {
        ctx.fillStyle = "rgba(0,0,0,0.7)";
        ctx.fillRect(0, 0, w, h);
        ctx.fillStyle = "#ff5577";
        ctx.font = `bold ${cs * 0.8}px 'JetBrains Mono', monospace`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("GAME OVER", w / 2, h / 2 - cs);
        ctx.fillStyle = "#8888a0";
        ctx.font = `${cs * 0.45}px 'JetBrains Mono', monospace`;
        ctx.fillText("press any key to restart", w / 2, h / 2 + cs * 0.5);
      }
    }

    rafRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(rafRef.current);
  }, [cellSize]);

  const canvasWidth = COLS * cellSize;
  const canvasHeight = ROWS * cellSize;

  // Popup color helper
  const popupColor = popupBoss?.type === "star" ? "#ffaa33" : popupBoss?.type === "diamond" ? "#00e89a" : "#00e5ff";

  return (
    <div ref={containerRef} className="w-full flex justify-center">
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-0">
        {/* Game canvas */}
        <div className="relative flex-shrink-0">
          <canvas
            ref={canvasRef}
            width={canvasWidth}
            height={canvasHeight}
            style={{ display: "block", width: canvasWidth, height: canvasHeight }}
          />

          {/* Boss popup overlay */}
          {phase === "boss-popup" && popupBoss && (
            <div
              className="absolute inset-0 flex items-center justify-center"
              style={{ background: "rgba(0,0,0,0.8)", zIndex: 10 }}
            >
              {popupBoss.type === "about" ? (
                /* About Me popup */
                <div
                  className="relative text-center p-6 mx-4"
                  style={{
                    background: "#0a0e1a",
                    border: "2px solid #00e5ff",
                    borderRadius: 12,
                    maxWidth: 380,
                    boxShadow: "0 0 40px rgba(0, 229, 255, 0.15)",
                  }}
                >
                  <button
                    onClick={() => { setPopupBoss(null); setPhase("playing"); }}
                    className="absolute"
                    style={{ top: 12, right: 14, color: "#5e5e78", fontSize: 20, background: "none", border: "none", cursor: "pointer", lineHeight: 1 }}
                  >
                    ✕
                  </button>
                  {/* Photo */}
                  <div className="flex justify-center mb-4">
                    <div
                      style={{
                        width: 72,
                        height: 72,
                        borderRadius: "50%",
                        border: "2px solid #00e5ff",
                        overflow: "hidden",
                        boxShadow: "0 0 16px rgba(0, 229, 255, 0.3)",
                      }}
                    >
                      <img
                        src={HEADSHOT_URL}
                        alt="Anne Liu"
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      />
                    </div>
                  </div>
                  <p style={{ fontFamily: "var(--font-mono)", fontSize: 14, color: "#00e5ff", marginBottom: 12 }}>
                    {">> ABOUT: ANNE LIU"}
                  </p>
                  <p style={{ fontSize: 13, color: "#c0c0d0", lineHeight: 1.6, marginBottom: 12 }}>
                    I architect multi-agent systems, train models with reinforcement learning, and ship full-stack AI products end to end. My work spans LangGraph orchestration pipelines, GRPO-based reward modeling, and production APIs serving real users at scale.
                  </p>
                  <p style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "#00e89a", marginBottom: 16 }}>
                    right now: [ multi-agent orchestration ] agentic RL
                  </p>
                  <div className="flex gap-3 justify-center mb-4">
                    <a
                      href="https://linkedin.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-1.5"
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: 12,
                        color: "#00e5ff",
                        border: "1px solid #00e5ff",
                        borderRadius: 4,
                        textDecoration: "none",
                      }}
                    >
                      $ ./linkedin
                    </a>
                    <a
                      href="https://github.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-1.5"
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: 12,
                        color: "#00e5ff",
                        border: "1px solid #00e5ff",
                        borderRadius: 4,
                        textDecoration: "none",
                      }}
                    >
                      $ ./github
                    </a>
                  </div>
                  <p style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "#5e5e78" }}>
                    press any key to continue
                  </p>
                </div>
              ) : (
                /* Project detail card */
                <div
                  className="text-left mx-4 overflow-y-auto"
                  style={{
                    background: "#0a0e1a",
                    border: `2px solid ${popupColor}`,
                    borderRadius: 12,
                    maxWidth: 480,
                    width: "100%",
                    maxHeight: "85vh",
                    boxShadow: `0 0 60px ${popupColor}20`,
                    padding: 0,
                  }}
                >
                  {/* Header */}
                  <div className="flex items-center justify-between px-5 pt-4 pb-2">
                    <p style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: popupColor }}>
                      {popupBoss.type === "star" ? "★" : "◆"} {">> PROJECT EATEN: " + popupBoss.name.toUpperCase()}
                    </p>
                    <button
                      onClick={() => { setPopupBoss(null); setPhase("playing"); }}
                      style={{ color: "#5e5e78", fontSize: 20, background: "none", border: "none", cursor: "pointer", lineHeight: 1 }}
                    >
                      ✕
                    </button>
                  </div>

                  <div className="px-5 pb-5">
                    {/* Project title */}
                    <h3 style={{ fontSize: 18, color: "#e8e8f0", marginBottom: 14 }}>
                      {(projectData[popupBoss.slug] ?? defaultProject).title}
                    </h3>

                    {/* Bullet points */}
                    <ul style={{ listStyle: "none", padding: 0, margin: "0 0 16px 0" }}>
                      {(projectData[popupBoss.slug] ?? defaultProject).bullets.map((b, i) => (
                        <li key={i} className="flex gap-2 mb-2" style={{ fontSize: 12, color: "#b0b0c0", lineHeight: 1.6 }}>
                          <span style={{ color: "#5e5e78", flexShrink: 0 }}>•</span>
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>

                    {/* Tech tags */}
                    <div className="flex flex-wrap gap-1.5 mb-5">
                      {(projectData[popupBoss.slug] ?? defaultProject).tags.map((tag) => (
                        <span
                          key={tag}
                          style={{
                            fontFamily: "var(--font-mono)",
                            fontSize: 11,
                            color: popupColor,
                            border: `1px solid ${popupColor}55`,
                            borderRadius: 4,
                            padding: "2px 8px",
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Demo video thumbnail */}
                    {(projectData[popupBoss.slug] ?? defaultProject).loomUrl && (
                      <a
                        href={(projectData[popupBoss.slug] ?? defaultProject).loomUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="block mb-4"
                        style={{
                          background: "#0d1220",
                          borderRadius: 8,
                          overflow: "hidden",
                          textDecoration: "none",
                          border: "1px solid #1a1f35",
                        }}
                      >
                        <div className="flex flex-col items-center justify-center" style={{ height: 120 }}>
                          <div
                            style={{
                              width: 48,
                              height: 48,
                              borderRadius: "50%",
                              background: popupColor,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              marginBottom: 8,
                            }}
                          >
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                              <path d="M6 4L16 10L6 16V4Z" fill="#0a0e1a" />
                            </svg>
                          </div>
                          <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "#8888a0" }}>
                            Watch demo walkthrough →
                          </span>
                        </div>
                      </a>
                    )}

                    {/* Action buttons */}
                    <div className="flex gap-3 mb-4">
                      {(projectData[popupBoss.slug] ?? defaultProject).caseStudyUrl && (
                        <a
                          href={(projectData[popupBoss.slug] ?? defaultProject).caseStudyUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="flex-1 text-center py-2.5"
                          style={{
                            fontFamily: "var(--font-mono)",
                            fontSize: 11,
                            color: popupColor,
                            border: `1px solid ${popupColor}`,
                            borderRadius: 6,
                            textDecoration: "none",
                            background: "transparent",
                          }}
                        >
                          <span style={{ fontSize: 9, color: "#5e5e78", display: "block", marginBottom: 2, letterSpacing: "0.15em" }}>CASE STUDY</span>
                          $ ./case-study ↗
                        </a>
                      )}
                      {(projectData[popupBoss.slug] ?? defaultProject).siteUrl && (
                        <a
                          href={(projectData[popupBoss.slug] ?? defaultProject).siteUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="flex-1 text-center py-2.5"
                          style={{
                            fontFamily: "var(--font-mono)",
                            fontSize: 11,
                            color: popupColor,
                            border: `1px solid ${popupColor}`,
                            borderRadius: 6,
                            textDecoration: "none",
                            background: "transparent",
                          }}
                        >
                          <span style={{ fontSize: 9, color: "#5e5e78", display: "block", marginBottom: 2, letterSpacing: "0.15em" }}>VISIT SITE</span>
                          $ ./{(projectData[popupBoss.slug] ?? defaultProject).siteName} ↗
                        </a>
                      )}
                    </div>

                    {/* Dismiss hint */}
                    <p className="text-center" style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "#3e3e54" }}>
                      press any key to continue
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* HUD - flush right of canvas */}
        <div
          className="flex flex-row sm:flex-col gap-4 sm:gap-5 flex-wrap sm:pl-5 sm:pt-2"
          style={{ fontFamily: "var(--font-mono)", minWidth: 130 }}
        >
          <div>
            <p style={{ fontSize: 10, color: "#5e5e78", letterSpacing: "0.15em", textTransform: "uppercase" }}>Score</p>
            <p style={{ fontSize: 22, color: "#e0e0ea" }}>{score}</p>
          </div>
          <div>
            <p style={{ fontSize: 10, color: "#5e5e78", letterSpacing: "0.15em", textTransform: "uppercase" }}>High Score</p>
            <p style={{ fontSize: 22, color: "#e0e0ea" }}>{highScore}</p>
          </div>
          <div>
            <p style={{ fontSize: 10, color: "#5e5e78", letterSpacing: "0.15em", textTransform: "uppercase" }}>AI Products</p>
            <p style={{ fontSize: 22, color: "#e0e0ea" }}>{bossesEaten}/2</p>
          </div>
          <div>
            <p style={{ fontSize: 10, color: "#5e5e78", letterSpacing: "0.15em", textTransform: "uppercase" }}>Lives</p>
            <div className="flex gap-1 mt-1">
              {Array.from({ length: lives }).map((_, i) => (
                <svg key={i} width={18} height={18} viewBox="0 0 20 20">
                  <path d="M10 2 A8 8 0 1 1 10 18 A8 8 0 1 1 10 2 Z" fill="#ffcc00" />
                  <path d="M10 10 L18 6 L18 14 Z" fill="#0a0a1a" />
                </svg>
              ))}
            </div>
          </div>
          <div className="mt-1">
            <p style={{ fontSize: 10, color: "#3e3e54", letterSpacing: "0.1em" }}>ARROWS or WASD</p>
            <p style={{ fontSize: 10, color: "#3e3e54" }}>to move</p>
          </div>
        </div>
      </div>
    </div>
  );
}