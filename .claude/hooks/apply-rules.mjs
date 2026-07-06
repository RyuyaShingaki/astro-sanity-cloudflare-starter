#!/usr/bin/env node
// PreToolUse フック: Edit / Write / MultiEdit の対象ファイルパスを見て、
// .claude/rules/*.md の frontmatter `paths:` にマッチするルールを
// additionalContext として Claude に注入する。
//
// これにより「編集対象に応じてルールを自動適用する」を実現する。
// Claude Code はネイティブでは rules の paths を解釈しないため、このフックが担う。
//
// 登録は .claude/settings.json の hooks.PreToolUse。stdin から
// フックイベント JSON を受け取り、stdout に hookSpecificOutput を返す。

import { readFileSync, readdirSync } from "node:fs";
import { join, relative, isAbsolute } from "node:path";

function readStdin() {
  try {
    return readFileSync(0, "utf8");
  } catch {
    return "";
  }
}

// glob を正規表現に変換する。対応記法は **/ (0 個以上のディレクトリ)、
// ** (任意)、* (スラッシュを跨がない任意)、? (1 文字)。
function globToRegExp(glob) {
  let re = "^";
  for (let i = 0; i < glob.length; i++) {
    const c = glob[i];
    if (c === "*") {
      if (glob[i + 1] === "*") {
        i++;
        if (glob[i + 1] === "/") {
          i++;
          re += "(?:.*/)?";
        } else {
          re += ".*";
        }
      } else {
        re += "[^/]*";
      }
    } else if (c === "?") {
      re += "[^/]";
    } else if ("+.()|[]{}^$\\".includes(c)) {
      re += "\\" + c;
    } else {
      re += c;
    }
  }
  return new RegExp(re + "$");
}

function extractFrontmatter(content) {
  const m = content.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  if (!m) return { paths: [], body: content };
  const fmBlock = m[1];
  const body = content.slice(m[0].length).trim();
  // `paths: [...]` の中身を取り出す。prettier が複数行・トレイリングカンマ付きに
  // 整形しても壊れないよう、JSON.parse ではなくクォート文字列を直接抽出する。
  const arrayMatch = fmBlock.match(/paths:\s*\[([\s\S]*?)\]/);
  const paths = arrayMatch ? [...arrayMatch[1].matchAll(/["']([^"']+)["']/g)].map((q) => q[1]) : [];
  return { paths, body };
}

function main() {
  const raw = readStdin();
  if (!raw) process.exit(0);

  let event;
  try {
    event = JSON.parse(raw);
  } catch {
    process.exit(0);
  }

  const filePath = event?.tool_input?.file_path;
  if (!filePath) process.exit(0);

  const root = event.cwd || process.env.CLAUDE_PROJECT_DIR || process.cwd();
  const rel = (isAbsolute(filePath) ? relative(root, filePath) : filePath).split("\\").join("/");
  // リポジトリ外への編集はルール対象外
  if (rel.startsWith("..")) process.exit(0);

  const rulesDir = join(root, ".claude", "rules");
  let files;
  try {
    files = readdirSync(rulesDir).filter((f) => f.endsWith(".md"));
  } catch {
    process.exit(0);
  }

  const matched = [];
  for (const file of files.sort()) {
    let content;
    try {
      content = readFileSync(join(rulesDir, file), "utf8");
    } catch {
      continue;
    }
    const { paths, body } = extractFrontmatter(content);
    if (!paths.length) continue;
    const hit = paths.some((p) => globToRegExp(p).test(rel));
    if (hit) matched.push({ name: file, body });
  }

  if (!matched.length) process.exit(0);

  const context =
    `編集対象 \`${rel}\` に適用されるプロジェクト規約 (.claude/rules/) です。従ってください。\n\n` +
    matched.map((m) => `<rule file=".claude/rules/${m.name}">\n${m.body}\n</rule>`).join("\n\n");

  process.stdout.write(
    JSON.stringify({
      hookSpecificOutput: {
        hookEventName: "PreToolUse",
        additionalContext: context,
      },
    }),
  );
  process.exit(0);
}

main();
