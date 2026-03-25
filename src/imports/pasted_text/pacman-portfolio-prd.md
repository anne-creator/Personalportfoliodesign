




$ cat ./prd/dark-mode-redesign.md
Dark Mode: Pac-ManPortfolio Redesign
Product Requirements Document



Author
Anne Liu
Date
March 24, 2026
Version
1.0
Status
Draft
Target
anne.dev Dark Mode Hero Section


1. Overview
This PRD defines the complete redesign of the portfolio dark mode hero section. The current static terminal aesthetic will be replaced by a fully playable Pac-Man game that functions as an interactive project showcase. Visitors navigate a simplified maze to discover featured projects, turning the portfolio landing into a memorable, gamified experience.

2. Problem Statement
The current dark mode hero section is a static terminal style layout displaying a name, tagline, bio paragraph, and project list. While clean and well branded, it offers no interactivity or differentiation from hundreds of similar developer portfolios. The goal is to create something visitors will remember and talk about, while still clearly communicating technical depth.

3. Scope
3.1 In Scope
Fully playable Pac-Man game embedded in the hero section
Simplified maze layout (easier than classic Pac-Man)
2 boss entities representing featured projects
Project reveal popup with clickable external link on boss collision
Rewritten bio text focused on technical depth
Score, high score, lives, and project counter HUD
Preserved header elements ($ WHOAMI, name, subtitle, tagline)
Keyboard and touch/swipe controls

3.2 Out of Scope
Light mode changes
Below the fold content (projects section, footer, contact)
Mobile native app version
Backend or database changes

4. Game Design Requirements
4.1 Maze Layout
The maze must be substantially simpler than the reference UI or classic Pac-Man. The guiding principle is: visitors should be able to reach at least one boss within 15 to 30 seconds of playing, even on their first attempt.

Property
Specification
Grid Size
Approximately 21 columns x 15 rows (smaller than classic 28x31)
Wall Density
Low. Wide corridors (2+ cells), few dead ends, multiple open paths
Dot Count
Reduced dot density. Dots exist for scoring but are not required to win.
Boss Count
Exactly 2 bosses. Placed at distinct but accessible positions in the maze.
Boss Placement
Boss 1 (primary): reachable via a short, nearly straight path. Boss 2 (secondary): requires slightly more navigation.


4.2 Difficulty Tuning
The game must be forgiving. It exists to delight, not to frustrate. Visitors who have never played Pac-Man should still find and interact with a boss.
Ghost count: 2 to 3 ghosts maximum (fewer than classic 4)
Ghost AI: Roaming/random movement, not aggressive pursuit. Ghosts should occasionally wander away from the player.
Ghost speed: Slightly slower than the player
Lives: 3 lives. On death, player respawns at starting position.
Power pellets: 1 to 2 available. When consumed, player can pass through ghosts safely for a limited time.
No timer or level progression. The game runs until the player has interacted with both bosses or chooses to stop.

4.3 Boss (Project) Interaction
Each boss is a special entity in the maze, visually distinct from ghosts and dots. When the player (Pac-Man) collides with a boss:

The game pauses.
A styled popup appears overlaying the game area.
The popup displays: ">> PROJECT EATEN: [PROJECT NAME]" in terminal style.
Below that, a clickable link styled as: Open Link: [ $ ./projects/[slug] ]
The link opens the project walkthrough/explanation page in a new tab.
The player can dismiss the popup and resume the game.
The HUD counter "AI PRODUCTS: X/2" increments.

4.4 Boss Definitions (Placeholder)
The following are placeholder values. Anne will assign the final project names and URLs.

Boss #
Project Name
Link Slug
Placement
1
[Primary Project]
./projects/[slug-1]
Easy access, near start
2
[Secondary Project]
./projects/[slug-2]
Moderate navigation


4.5 Visual Design
Color palette: Dark background (#0a0a1a or similar), blue maze walls (#2244aa), green accent for terminal text (#00d97e), orange dots, colorful ghosts
Boss entities: Visually larger or have a pulsing glow/icon to differentiate from regular ghosts
Pac-Man: Classic yellow circle with mouth animation
Maze walls: Styled with double line borders matching reference aesthetic (blue on dark)
CRT scanline overlay: Optional subtle scanline effect across the game area for retro feel

4.6 HUD (Heads Up Display)
Positioned to the right of the game area (desktop) or below (mobile):
SCORE: [number] (increments when eating dots)
HIGH SCORE: [number] (persisted in localStorage)
AI PRODUCTS: X/2 (tracks how many bosses the player has found)
LIVES: displayed as Pac-Man icons (e.g., 3 small yellow circles)

5. Controls
Input Method
Mapping
Keyboard (Desktop)
Arrow keys or WASD for directional movement
Touch (Mobile)
Swipe gestures for directional movement
Game Start
Automatic on page load, or "Press any key / Tap to start" prompt
Pause
Spacebar or tap pause icon. Auto-pauses on boss collision.



6. Page Layout Specification
The full hero section layout from top to bottom:

6.1 Header Zone (Preserved)
$ WHOAMI (green monospace, top)
"anne" (large bold heading)
> developer · systems thinker (monospace subtitle)
"i build 0→10 ai products with taste" (tagline)

6.2 Game Zone (New)
Pac-Man game canvas occupying the central hero area
HUD panel to the right (desktop) or below (mobile)
CRT monitor frame/bezel effect around the game (optional, from reference)

6.3 Bio Zone (Rewritten)
The bio text below the game area must be rewritten to emphasize technical depth. Here is the proposed new copy:

i'm anne — i architect multi-agent systems, train models with reinforcement learning, and ship full-stack AI products end to end. my work spans LangGraph orchestration pipelines, GRPO-based reward modeling, and production APIs serving real users at scale. i think in systems, build with python and typescript, and optimize until it works in the wild.

6.4 Footer Elements (Preserved)
right now: [current projects list]
$ deploy --platform=vercel --db=postgres --status=shipping
cd ./projects ↓

7. Rewritten Bio Copy (Final)
Below is the full replacement for the current bio paragraph. This version centers the message on engineering depth and applied ML experience.

7.1 Current Copy
i'm anne – a full-stack developer with a design eye, a psychology background, and 7 years of illustration. i've shipped production-ready apis, python backends, and typescript frontends – i'm not just drawing the boxes, i'm wiring them up.

7.2 New Copy
i'm anne — i architect multi-agent systems, train models with reinforcement learning, and ship full-stack AI products end to end. my work spans LangGraph orchestration pipelines, GRPO-based reward modeling, and production APIs serving real users at scale. i think in systems, build with python and typescript, and optimize until it works in the wild.

7.3 "right now" Line Update
Current:  right now: virtual illustrator · next.js design system · ai writing pipeline
Proposed: right now: [ multi-agent orchestration ] agentic RL · production ML pipelines


8. Technical Specifications
8.1 Rendering Approach
HTML5 Canvas for the game rendering (performant, pixel-level control)
React component wrapping the canvas for state management
requestAnimationFrame loop for smooth 60fps gameplay

8.2 Maze Data Structure
2D array (grid) where each cell is: 0 = path, 1 = wall, 2 = dot, 3 = power pellet, 4 = boss-1, 5 = boss-2, 6 = empty path (no dot)
Maze defined as a constant for easy iteration

8.3 Game State
Player position (x, y), direction, next queued direction
Ghost positions, directions, current AI mode (roam/scatter)
Score, lives, bosses found (0/2, 1/2, 2/2)
Game phase: start screen, playing, paused, boss popup, game over
High score (persisted via localStorage)

8.4 Responsive Behavior
Breakpoint
Game Area
HUD
Desktop (>1024px)
Full maze, HUD on right
Vertical panel, right side
Tablet (768-1024px)
Scaled down maze
Below game area
Mobile (<768px)
Compact maze, touch controls
Compact below game


8.5 Performance Targets
60fps gameplay on modern browsers
Game canvas loads within 1 second of page render
No impact on page Lighthouse score below the game section
Lazy load game assets if below the viewport fold

9. Acceptance Criteria
Player can navigate Pac-Man through the maze using keyboard (desktop) and swipe (mobile)
Player can reach Boss 1 within 15 to 30 seconds of starting
Colliding with a boss pauses the game and shows a styled popup with project name and clickable link
Clicking the link opens the project page in a new tab
Dismissing the popup resumes gameplay
HUD accurately displays score, high score, lives, and boss progress (X/2)
2 to 3 ghosts roam with non-aggressive AI; player dies on ghost contact and respawns
Bio text below the game reflects the new technically focused copy
Header elements ($ WHOAMI, name, subtitle, tagline) are unchanged
Game is playable on Chrome, Firefox, Safari, and Edge

10. Wireframe Reference
A separate interactive wireframe artifact accompanies this PRD. It illustrates the full page layout including the header zone, game zone with maze, HUD panel, boss popup overlay, and the rewritten bio zone. Refer to the wireframe for spatial relationships and proportional sizing.

11. Open Questions
#
Question
Owner
1
Which 2 projects should be assigned as Boss 1 and Boss 2?
Anne
2
What are the destination URLs for each project walkthrough?
Anne
3
Should the CRT bezel/monitor frame from the reference UI be included?
Anne
4
Should the game auto-start or require a "Press Start" interaction?
Anne
5
Update the "right now" project list to reflect current work?
Anne



// end of document
