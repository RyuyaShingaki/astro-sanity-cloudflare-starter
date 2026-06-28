---
description: TypeScript コーディング規約
paths: ["**/*.ts", "**/*.tsx"]
---

# TypeScript コーディング規約

## 型定義

- `any` は使用禁止。代わりに `unknown` を使い、型ガードで絞り込む
- `as` によるキャストは最小限に。型ガード関数 (`is` プレフィックス) を優先する
- 関数の引数と戻り値には明示的な型注釈をつける
- `interface` より `type` を優先する (ただし拡張が必要な場合は `interface`)
- `enum` は使用禁止。`as const` オブジェクトか Union 型で代替する

## null / undefined

- `strictNullChecks` を有効にした上で、nullable な値は `T | null` または `T | undefined` で明示する
- Optional chaining (`?.`) と Nullish coalescing (`??`) を積極的に使う
- 非 null アサーション (`!`) は使用禁止。型ガードか早期 return で対処する

## 関数

- 関数は純粋関数を基本とし、副作用は明示的に分離する
- `async/await` を使用し、`.then().catch()` チェーンは避ける
- エラーハンドリングは `try/catch` で行い、エラー型を `unknown` で受ける

## モジュール

- インポートが型のみの場合は `import type` を使って明示する
- デフォルトエクスポートより名前付きエクスポートを優先する

## その他

- `const` を基本とし、再代入が必要な場合のみ `let` を使う。`var` は禁止
- マジックナンバーは定数として定義する
- 配列・オブジェクトの操作は破壊的メソッドより非破壊的メソッド (`map`, `filter`, spread) を優先する
