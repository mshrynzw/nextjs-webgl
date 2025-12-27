# Next.js WebGL デモプロジェクト

Three.jsとカスタムシェーダーを使用したWebGLデモのコレクションです。Next.js 14で構築されています。

## 概要

このプロジェクトは、WebGLとGLSLシェーダーを使った様々なビジュアルエフェクトのデモを提供します。各デモは独立したページとして実装されており、カスタムシェーダーを使用した高度なグラフィック表現を体験できます。

## デモ一覧

- **ホームページ** (`/`) - パーリンノイズを使用した虹色の波線アニメーション
- **Cube** (`/cube`) - カスタムシェーダーを使用したキューブのトンネルエフェクト
- **Snow** (`/snow`) - パーティクルシステムを使用した雪の降るアニメーション
- **Wave** (`/wave`) - カスタムシェーダーを使用した波のアニメーション
- **Tunnel** (`/tunnel`) - トンネルエフェクト

## 技術スタック

- **フレームワーク**: Next.js 14
- **3Dライブラリ**: Three.js
- **言語**: TypeScript
- **スタイリング**: Tailwind CSS
- **シェーダー**: GLSL（カスタムシェーダー）
- **デバッグツール**: lil-gui
- **その他**: 
  - @react-three/fiber
  - @react-three/drei
  - perlin.js（ノイズ生成）

## セットアップ

### 必要な環境

- Node.js 18以上
- npm、yarn、pnpm、またはbun

### インストール

```bash
npm install
# または
yarn install
# または
pnpm install
# または
bun install
```

### 開発サーバーの起動

```bash
npm run dev
# または
yarn dev
# または
pnpm dev
# または
bun dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開いて結果を確認してください。

## プロジェクト構造

```
nextjs-webgl/
├── app/
│   ├── cube/          # キューブデモ
│   │   ├── page.tsx
│   │   └── shaders/   # GLSLシェーダーファイル
│   ├── snow/          # 雪デモ
│   │   ├── page.tsx
│   │   └── shaders/
│   ├── wave/          # 波デモ
│   │   ├── page.tsx
│   │   └── shaders/
│   ├── tunnel/        # トンネルデモ
│   │   └── page.tsx
│   ├── shaders/       # 共通シェーダー
│   └── page.tsx       # ホームページ（Rainbowデモ）
├── components/         # Reactコンポーネント
│   ├── Header.tsx
│   └── Main.tsx
├── public/
│   ├── images/        # 画像リソース
│   └── textures/      # テクスチャファイル
└── package.json
```

## 機能

- **カスタムシェーダー**: GLSLを使用した高度なビジュアルエフェクト
- **パーティクルシステム**: 大量のパーティクルを使用したエフェクト（雪など）
- **インタラクティブなデバッグ**: lil-guiを使用したリアルタイムパラメータ調整
- **レスポンシブデザイン**: ウィンドウリサイズに対応
- **パフォーマンス最適化**: デバイスピクセル比の最適化

## ビルド

本番環境用のビルド:

```bash
npm run build
```

ビルド後の起動:

```bash
npm start
```

## ライセンス

このプロジェクトは個人の学習・研究目的で作成されています。
