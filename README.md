# Todo App 開発環境

開発の順番と進捗は[開発ロードマップ](./ROADMAP.md)で管理します。

WSL2のUbuntuでNode.jsを動かし、PostgreSQLはDocker Desktopで動かします。
以下のコマンドはプロジェクトのルートで実行します。

## 初回セットアップ

```bash
nvm install
nvm use
npm --prefix frontend ci
npm --prefix backend ci
cp -n .env.example .env
docker compose up -d --wait
```

`.env`にはローカル開発用のDB設定を保存します。Gitには含めません。
PostgreSQL 18のデータは名前付きvolumeに保存します。
初期ユーザー・パスワード・DB名はvolumeの初回作成時に設定されます。

## DBの確認

```bash
docker compose ps
docker compose exec db sh -c 'psql -U "$POSTGRES_USER" -d "$POSTGRES_DB" -c "SELECT 1 AS connection_ok;"'
```

`db`が`healthy`になり、`connection_ok`が`1`ならDBが稼働しています。
バックエンドのNode.jsからの接続も確認します。

```bash
npm --prefix backend run db:check
```

`PostgreSQL connection OK (SELECT 1 = 1)`と表示されれば成功です。
バックエンドの起動・接続確認コマンドは、ルートの`.env`を読み込みます。

## アプリの起動

別々のUbuntuターミナルで実行します。

```bash
npm --prefix frontend run dev
```

```bash
npm --prefix backend run dev
```

フロントはViteが表示するURL、APIは http://localhost:3000 で確認します。

## 停止・再開

```bash
docker compose stop
docker compose up -d --wait
```

アプリはそれぞれのターミナルでCtrl+Cを押して停止します。
`docker compose down`でもDBのvolumeは残りますが、`down -v`はDBデータも削除します。

## 検証

```bash
npm --prefix frontend run build
npm --prefix backend run typecheck
```
