# Chibi Chef Project

Chibi Chef Projectは、子供向けのレシピアプリケーションとそのバックエンドAPIを提供するプロジェクトです。フロントエンドは子供たちが楽しくレシピを管理できるように設計されており、バックエンドはレシピと冷蔵庫の内容を管理するためのAPIを提供します。

## Table of Contents

- [Frontend](#frontend)
- [Backend](#backend)

## Frontend

Chibi Chefは、子供たちとその親がレシピを見つけ、作成し、管理するのを助ける楽しくインタラクティブなレシピアプリケーションです。

### Features

- **レシピ管理**: レシピの追加、編集、削除が可能です。
- **冷蔵庫管理**: 冷蔵庫の中の食材を管理できます。
- **パントリー管理**: パントリーアイテムを管理できます。
- **画像認識**: 画像から食材を認識します。
- **おすすめレシピ**: 利用可能な食材に基づいてレシピを推薦します。
- **キッズモード**: 簡略化された指示を持つ特別なキッズモード。

### Installation

1. リポジトリをクローンします:
    ```sh
    git clone https://github.com/ichiharad/chibi-chef.git
    cd chibi-chef
    ```

2. 依存関係をインストールします:
    ```sh
    npm install
    ```

3. 開発サーバーを起動します:
    ```sh
    npm run dev
    ```

### Usage

開発サーバーが起動したら、`http://localhost:8080`でアプリケーションにアクセスできます。

## Backend

このプロジェクトのバックエンドは、FlaskベースのAPIで、レシピと冷蔵庫の内容を管理します。ユーザーはレシピと食材を作成、読み取り、更新、削除でき、URLからレシピをインポートしたり、画像から食材を認識したりできます。

### Installation

1. リポジトリをクローンします:
    ```sh
    git clone https://github.com/ichiharad/recipe-refrigerator-api.git
    cd recipe-refrigerator-api
    ```

2. 仮想環境を作成してアクティブにします:
    ```sh
    python3 -m venv venv
    source venv/bin/activate  # Windowsでは `venv\Scripts\activate` を使用
    ```

3. 必要なパッケージをインストールします:
    ```sh
    pip install -r requirements.txt
    ```

4. Google Cloudの認証情報を設定します:
    - FirestoreとVertex AIが有効なGoogle Cloudプロジェクトを持っていることを確認します。
    - `GOOGLE_APPLICATION_CREDENTIALS`環境変数をサービスアカウントキーのファイルパスに設定します。

### Usage

1. Flaskアプリを実行します:
    ```sh
    python backend/main.py
    ```

2. APIは`http://0.0.0.0:8080`で利用可能になります。

3. `curl`、`Postman`、または任意のHTTPクライアントを使用してエンドポイントと対話します。