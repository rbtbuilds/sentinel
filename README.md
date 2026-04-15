# Shannon Pentest Skill

AI-powered penetration testing as a Claude Code slash command. Runs a full white-box security assessment with live exploitation — no Docker, no infrastructure, no API keys beyond your Claude Code session.

## Install

```bash
npx github:rbtbuilds/shannon-pentest-skill
```

This installs the `/pentest` command into your project's `.claude/commands/` directory.

Or manually:
```bash
git clone https://github.com/rbtbuilds/shannon-pentest-skill.git
cd shannon-pentest-skill
node install.mjs
```

## Usage

Open Claude Code in your project and run:

```
/pentest https://your-app.com /path/to/source-code
```

### Options

```
/pentest <url> <repo-path> [options]

Options:
  --skip-exploit    Analysis only, no live exploitation
  --focus <type>    Focus on one vulnerability type:
                    auth, xss, injection, ssrf, authz
  --config <path>   YAML config with auth credentials and rules
```

### Examples

```bash
# Full pentest (analysis + exploitation)
/pentest https://myapp.vercel.app ./

# Code analysis only (no live attacks)
/pentest https://myapp.vercel.app ./ --skip-exploit

# Focus on authorization bugs only
/pentest https://myapp.vercel.app ./ --focus authz
```

## What It Does

The skill runs a 4-phase security assessment:

### Phase 1: Pre-Recon
Three parallel agents map your codebase:
- **Architecture** — framework, routes, middleware, API schemas
- **Security patterns** — auth, authz, validation, crypto
- **Dangerous sinks** — SQL, shell, HTML rendering, outbound HTTP, file ops

### Phase 2: Vulnerability Analysis
Five parallel agents perform white-box analysis:
- **Injection** — SQLi, command injection, SSTI, path traversal, LFI
- **XSS** — reflected, stored, DOM-based with render context analysis
- **Auth** — session management, token security, PKCE, rate limiting
- **Authz** — horizontal/vertical privilege escalation, IDOR, workflow bypass
- **SSRF** — outbound request tracing, redirect abuse, webhook injection

Each agent uses **backward taint analysis**: starts at dangerous sinks, traces backward to user input, and checks if sanitization matches the sink context.

### Phase 3: Exploitation
Parallel agents attempt to exploit high/medium confidence findings against the live target using `curl`. Each finding is classified as:
- `EXPLOITED` — impact demonstrated
- `BLOCKED` — valid but mitigated by WAF/controls
- `FALSE_POSITIVE` — not vulnerable on live target
- `OUT_OF_SCOPE` — requires internal access

### Phase 4: Report
Generates a comprehensive security assessment report with:
- Executive summary with risk rating
- Vulnerability summary by type and severity
- Detailed findings with file:line references and exploitation evidence
- Prioritized remediation recommendations

## Output

All findings are saved to `<repo>/.shannon/deliverables/`:

```
.shannon/deliverables/
  pre_recon_deliverable.md
  auth_analysis_deliverable.md
  authz_analysis_deliverable.md
  injection_analysis_deliverable.md
  xss_analysis_deliverable.md
  ssrf_analysis_deliverable.md
  *_exploitation_queue.json
  *_exploitation_evidence.md
  comprehensive_security_assessment_report.md
```

## How It Works

Unlike traditional pentest tools that require Docker, Temporal, or separate API keys, this skill runs entirely inside your Claude Code session. It uses Claude Code's `Agent` tool to dispatch parallel subagents for each analysis phase — same parallelism as a full pipeline, fraction of the cost.

| | Traditional Tools | Shannon Skill |
|---|---|---|
| Infrastructure | Docker + orchestrator | None |
| Cost | $20-50+ per scan | Your CC session |
| Setup | API keys, builds, config | `npx` install |
| Parallelism | 5 concurrent agents | 5 concurrent agents |
| Methodology | Same | Same |

## Scope & Safety

- **External attacker perspective only** — no internal network access
- **No destructive actions** — no DoS, no data deletion, no data modification
- **Max 3-5 payloads per finding** during exploitation
- **curl-based testing** — no automated exploitation frameworks
- **Responsible use only** — test only systems you own or have explicit permission to test

## Requirements

- [Claude Code](https://claude.ai/code) CLI or IDE extension
- Source code access to the target application
- Target URL must be reachable from your network

## License

MIT
