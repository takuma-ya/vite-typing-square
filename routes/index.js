import express from 'express'
import fs from 'node:fs'
import knex from '../db/knex.js'
import auth_status from './auth_status.js'
import credit from './credit.js'
import credit_en from './credit_en.js'
import logout from './logout.js'
import logout_en from './logout_en.js'
import save_score from './save_score.js'
import signin from './signin.js'
import signin_en from './signin_en.js'
import signup from './signup.js'
import signup_en from './signup_en.js'
import user_data from './user_data.js'
const router = express.Router();

router.get('/', function (req, res, next) {
  const isProduction = process.env.NODE_ENV === 'production';
  const url = req.originalUrl
  try {
    // 1. index.html を読み込む
    let template = fs.readFileSync(
      path.resolve(__dirname, 'index.html'),
      'utf-8',
    )

    // 2. Vite の HTML の変換を適用します。これにより Vite の HMR クライアントが定義され
    //    Vite プラグインからの HTML 変換も適用します。 e.g. global preambles
    //    from @vitejs/plugin-react
    template = await vite.transformIndexHtml(url, template)

    // 3. サーバーサイドのエントリーポイントを読み込みます。 ssrLoadModule は自動的に
    //    ESM を Node.js で使用できるコードに変換します! ここではバンドルは必要ありません
    //    さらに HMR と同様な効率的な無効化を提供します。
    const { render } = await vite.ssrLoadModule('/src/main_ssr.jsx')

    // 4. アプリケーションの HTML をレンダリングします。これは entry-server.js から
    //    エクスポートされた `render` 関数が、ReactDOMServer.renderToString() などの
    //    適切なフレームワークの SSR API を呼び出すことを想定しています。
    const appHtml = await render(url)

    // 5. アプリケーションのレンダリングされた HTML をテンプレートに挿入します。
    const html = template.replace(`<!--ssr-outlet-->`, appHtml)

    // 6. レンダリングされた HTML をクライアントに送ります。
    res.status(200).set({ 'Content-Type': 'text/html' }).end(html)
  } catch (e) {
    // エラーが検出された場合は、Vite にスタックトレースを修正させ、実際のソースコードに
    // マップし直します。
    vite.ssrFixStacktrace(e)
    next(e)
  }
  res.render('index.html', {
    isProduction
  });
});

router.get('/en/', function (req, res, next) {
  const isProduction = process.env.NODE_ENV === 'production';
  
  res.render('index_en.html', {
    isProduction
  });
});

router.use('/auth_status', auth_status);
router.use('/credit', credit);
router.use('/en/credit', credit_en);
router.use('/logout', logout);
router.use('/en/logout', logout_en);
router.use('/save_score', save_score);
router.use('/signin', signin);
router.use('/en/signin', signin_en);
router.use('/signup', signup);
router.use('/en/signup', signup_en);
router.use('/user_data', user_data);

export default router;
