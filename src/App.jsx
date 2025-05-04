import { useState, useEffect } from 'react'
import { register_music, PhaserGame } from './game.js'

import  musicListSource from './data/music_list.json'
import  musicListSourceEn from './data/music_list_en.json'

let phaserGame;
let game;
let closeBtn;
let closeBtnRecord;
let stored_data;
let music_id;
let musicListJson;
if (typeof window !== "undefined") {
  window.score = -1;
}

function App(props) {
  if(props.lang=="english") {
    musicListJson = musicListSourceEn; 
  } else {
    musicListJson = musicListSource; 
  }

  const [count, setCount] = useState(0)
  const [scores, setScores] = useState([])
  const [rates, setRates] = useState([])
  const [totalScore, setTotalScore] = useState(1)
  // 初期化を検知するフラグ
  const [loading, setLoading] = useState(true);
  const [musicList, setMusicList] = useState(musicListJson);
  const [sortBy, setSortBy] = useState('id'); // 初期値はIDが大きい順
  const [sortOrder, setSortOrder] = useState('desc'); // 初期値は降順
  const [filterLevel, setFilterLevel] = useState(''); // 初期値は全てのレベル
  const [filterCategory, setFilterCategory] = useState(''); // 初期値は全てのカテゴリ
  const [isAuth, setIsAuth] = useState(false);
  const [userName, setUserName] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const fetchUserData = async () => { 
    fetch('/user_data')
    .then(response => response.json())
    .then(data => {
        // 取得したデータをログに出力
        console.log('Received scores:', data.score);
        console.log('Received rates:', data.rate);

        // 取得したデータを適切な処理に渡す（例：グラフに表示するなど）
        stored_data = data
        setScores(stored_data.score);
        setRates(stored_data.rate);
        setIsAuth(data.isAuth);
        setUserName(data.userName);
        setTotalScore(data.totalScore);
        setErrorMessage(data.errorMessage);
    })
    .catch(error => {
        console.error('Error fetching data:', error);
    })
  };

  let sumScore = scores.reduce((acc, score) => acc + score, 0);
  let sumRate = Math.floor(sumScore / totalScore * 100);

/*
  const fetchMusicList = async () => {
    let musicListPath = '/jsons/music_data.json';
    if(props.lang=="english") {
        musicListPath = '/jsons/music_data_en.json';
    }
    fetch(musicListPath)
    .then(response => response.json())
    .then(data => {
        // 取得したデータをログに出力
        console.log('Music List:', data);

        // 取得したデータを適切な処理に渡す（例：グラフに表示するなど）
        setMusicList(data)
    })
    .catch(error => {
        console.error('Error fetching data:', error);
    })
  };
*/
/*
  const handleFormSubmit = (e, action) => {
    console.log("e",e);
    console.log("action",action);
    e.preventDefault();
    const formData = new FormData(e.target);

    fetch(action, {
      method: 'POST',
      body: formData
    })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          setIsAuth(true);
          setUserName(data.userName);
        } else {
          setErrorMessage(data.message);
        }
      })
      .catch(error => {
        console.error('Error submitting form:', error);
        setErrorMessage('An error occurred.');
      });
  };
*/

  // レベルフィルタリング用のハンドラ
  const handleLevelFilter = (level) => {
    setFilterLevel(level);
  };

  // カテゴリフィルタリング用のハンドラ
  const handleCategoryFilter = (category) => {
    setFilterCategory(category);
  };

  // ソート順を変更するハンドラ
  const handleSortChange = (e) => {
    const selectedSortOption = e.target.value;
    // ソートオプションに応じてsortByとsortOrderを設定
    if (selectedSortOption === 'id_desc') {
      setSortBy('id');
      setSortOrder('desc');
    } else if (selectedSortOption === 'id_asc') {
      setSortBy('id');
      setSortOrder('asc');
    } else if (selectedSortOption === 'rate_desc') {
      setSortBy('rate');
      setSortOrder('desc');
    } else if (selectedSortOption === 'rate_asc') {
      setSortBy('rate');
      setSortOrder('asc');
    } else if (selectedSortOption === 'level_desc') {
      setSortBy('level');
      setSortOrder('desc');
    } else if (selectedSortOption === 'level_asc') {
      setSortBy('level');
      setSortOrder('asc');
    }
  };

  // フィルタリングおよびソート適用後のデータを返す
  const filteredAndSortedData = () => {
    let filteredData = musicList;
    if (filterLevel) {
      filteredData = filteredData.filter((music) => music.level === filterLevel);
    }
    if (filterCategory) {
      filteredData = filteredData.filter((music) => music.category === filterCategory);
    }

    // ソート適用
    filteredData.sort((a, b) => {
      let comparison = 0;
      if (sortBy === 'id') {
        comparison = a.id - b.id;
      } else if (sortBy === 'score') {
        comparison = a.score - b.score;
      } else if (sortBy === 'rate') {
        comparison = a.rate - b.rate;
      } else if (sortBy === 'level') {
        comparison = a.level.localeCompare(b.level);
      }

      return sortOrder === 'desc' ? comparison * -1 : comparison;
    });

    return filteredData;
  };


  const startGame = (id, lang="ja") => {
    music_id = id;
    window.score = stored_data.score[music_id-1]
    window.rate = stored_data.rate[music_id-1]
    phaserGame = new PhaserGame();
    game = phaserGame.init(id, lang);
  }

  const recordGame = (id) => {
    music_id = id;
    phaserGame = new PhaserGame("record");
    game = phaserGame.init(id);
  }

  const tearDown = () => {
    game.destroy({ removeCanvas: true });
    stored_data.score[music_id-1] = window.score;
    stored_data.rate[music_id-1] = window.rate;
    setScores([...stored_data.score]); // スプレッド構文で新しい配列として設定
    setRates([...stored_data.rate]);   // スプレッド構文で新しい配列として設定
    console.log("stored_data",stored_data);
  }

  // コンポーネントがマウントされた後、データを取得するためにfetchData関数を呼び出す
  useEffect(() => {
    // すでに初期化されていたら処理を抜ける
    if (!loading) {
      console.log("loading",loading);
      return;
    }
    fetchUserData();
    //fetchMusicList();
    // 初期化済みのフラグを立てる
    setLoading(false);
    closeBtn = document.getElementById("btn-close");
    closeBtnRecord = document.getElementById("btn-close-record");
    closeBtn.addEventListener('click', tearDown);
    closeBtnRecord.addEventListener('click', tearDown);
    // クリーンアップ関数を返してイベントリスナーを削除
    return () => {
        if (closeBtn) {
            closeBtn.removeEventListener('click', tearDown);
        }
        if (closeBtnRecord) {
            closeBtnRecord.removeEventListener('click', tearDown);
        }
    };
  }, []);



  if(props.lang=="english") {
    return (
      <div className="row">
        <div className="col-sm-10">
          <div className="mx-1 p-3 bg-body">
        {/* ソートセレクトボックス */}
            <div className="mb-3">
              {/*<label htmlFor="sortSelect" className="form-label me-2">
                ソート:
              </label>*/}
              <select id="sortSelect" className="form-select form-select-sm me-2" onChange={handleSortChange}>
                <option value="id_desc">Newest First</option>
                <option value="id_asc">Oldest First</option>
                {/* <option value="rate_desc">Highest Score Percentage First</option>
                <option value="rate_asc">Lowest Score Percentage First</option> */}
                <option value="level_asc">Highest Level First</option>
                <option value="level_desc">Lowest Level First</option>
              </select>
            </div>

            <div className="mb-3">
              <button className="btn btn-sm btn-outline-dark me-2" onClick={() => handleLevelFilter('')}>
               All levels 
              </button>
              <button className="btn btn-sm btn-outline-dark me-2" onClick={() => handleLevelFilter('★☆☆☆☆')}>
                ★☆☆☆☆
              </button>
              <button className="btn btn-sm btn-outline-dark me-2" onClick={() => handleLevelFilter('★★☆☆☆')}>
                ★★☆☆☆
              </button>
              <button className="btn btn-sm btn-outline-dark me-2" onClick={() => handleLevelFilter('★★★☆☆')}>
                ★★★☆☆
              </button>
              <button className="btn btn-sm btn-outline-dark me-2" onClick={() => handleLevelFilter('★★★★☆')}>
                ★★★★☆
              </button>
              <button className="btn btn-sm btn-outline-dark me-2" onClick={() => handleLevelFilter('★★★★★')}>
                ★★★★★
              </button>
            </div>

            <div className="mb-3">
              <button className="btn btn-sm btn-outline-dark me-2" onClick={() => handleCategoryFilter('')}>
               All Categories 
              </button>
              <button className="btn btn-sm btn-outline-dark me-2" onClick={() => handleCategoryFilter('Classical')}>
               Classical 
              </button>
              <button className="btn btn-sm btn-outline-dark me-2" onClick={() => handleCategoryFilter('Jazz')}>
               Jazz 
              </button>
              <button className="btn btn-sm btn-outline-dark me-2" onClick={() => handleCategoryFilter('Hip Hop')}>
               Hip Hop 
              </button>
              <button className="btn btn-sm btn-outline-dark me-2" onClick={() => handleCategoryFilter('Rock')}>
               Rock 
              </button>
              <button className="btn btn-sm btn-outline-dark me-2" onClick={() => handleCategoryFilter('Touhou')}>
               Touhou 
              </button>
              <button className="btn btn-sm btn-outline-dark me-2" onClick={() => handleCategoryFilter('Vocaloid')}>
              Vocaloid 
              </button>
            </div>

            {/* 音楽カード表示 */}
            <div className="row">
                {filteredAndSortedData().map((music) => (
                  <div key={music.id} className="col-sm-3 my-2">
                    <div className="card" style={{ width: '100%' }}>
                      <img src={music.image} className="card-img-top" style={{ width: '100%', aspectRatio: '1.5' }} alt="..." />
                      <div className="card-body">
                        <h5 className="card-title">{music.title}</h5>
                        <p className="card-text">Level:&nbsp;
                          <button className="btn btn-sm btn-outline-dark me-2" onClick={() => handleLevelFilter(music.level)}> {music.level} </button>
                        </p>
                        <p className="card-text">Category:&nbsp;
                          <button className="btn btn-sm btn-outline-dark me-2" onClick={() => handleCategoryFilter(music.category)}> {music.category} </button>
                        </p>
                        {rates[music.id-1] === 100 ? (
                          <p>
                            Highest score：<strong id={`score-${music.id}`} className="text-success">{scores[music.id-1]}</strong>(
                            <strong id={`rate-${music.id}`} className="text-success">{rates[music.id-1]}</strong>%)
                          </p>
                        ) : (
                          <p>
                            Highest score：<strong id={`score-${music.id}`}>{scores[music.id-1]}</strong>(
                            <strong id={`rate-${music.id}`}>{rates[music.id-1]}</strong>%)
                          </p>
                        )}
                        <button type="button" className="btn btn-info btn-selector" data-bs-toggle="modal" data-bs-target="#game-modal" onClick={() => {startGame(music.id, "en")}}> 
                          Play Game!
                        </button>
                        {/*<button type="button" className="btn btn-info btn-selector" data-bs-toggle="modal" data-bs-target="#record-modal" onClick={() => {recordGame(music.id)}}> 
                          Record Game!
                        </button>*/}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>

        <div className="col-sm-2 bg-body">
          <div className="mx-1 p-3">
            {isAuth ? (
              <>
                <p>Welcome {userName} <br></br>Total Score： <br></br><strong>{sumScore} ({sumRate}%) </strong></p>
                <form action="/en/logout" method="get">
                  <div className="text-end">
                    <button type="submit" className="btn btn-secondary btn-sm mb-4">Sign out</button>
                  </div>
                </form>
              </>
            ) : (
              <p>Please sign in to save your score.</p>
            )}
            <form className="needs-validation" action="?" method="post">
  {/* onSubmit={(e) => handleFormSubmit(e, e.target.action)}> */}
              <label htmlFor="username" className="form-label">Name</label>
              <input type="text" className="form-control mb-sm-2" id="username" name="username" required />
              <label htmlFor="password" className="form-label">Password</label>
              <input type="text" className="form-control mb-sm-2" id="password" name="password" required />
              <div className="row">
                <div className="col-sm-6">
                  <button type="submit" className="btn btn-success btn-sm" formAction="/en/signup">Sign<br/>up</button>
                </div>
                <div className="col-sm-6">
                  <button type="submit" className="btn btn-primary btn-sm" formAction="/en/signin">Sign<br/>in</button>
                </div>
              </div>
            </form>
          </div>
          {errorMessage && (
            <div>
              <p>{errorMessage}</p>
            </div>
          )}
        </div>
      </div>
      );
  }
  else {
    return (
      <div className="row">
        <div className="col-sm-10">
          <div className="mx-1 p-3 bg-body">
        {/* ソートセレクトボックス */}
            <div className="mb-3">
              {/*<label htmlFor="sortSelect" className="form-label me-2">
                ソート:
              </label>*/}
              <select id="sortSelect" className="form-select form-select-sm me-2" onChange={handleSortChange}>
                <option value="id_desc">新しい順</option>
                <option value="id_asc">古い順</option>
                {/* <option value="rate_desc">スコア割合が高い順</option>
                <option value="rate_asc">スコア割合が低い順</option> */}
                <option value="level_asc">レベルが高い順</option>
                <option value="level_desc">レベルが低い順</option>
              </select>
            </div>

            <div className="mb-3">
              <button className="btn btn-sm btn-outline-dark me-2" onClick={() => handleLevelFilter('')}>
                全てのレベル
              </button>
              <button className="btn btn-sm btn-outline-dark me-2" onClick={() => handleLevelFilter('★☆☆☆☆')}>
                ★☆☆☆☆
              </button>
              <button className="btn btn-sm btn-outline-dark me-2" onClick={() => handleLevelFilter('★★☆☆☆')}>
                ★★☆☆☆
              </button>
              <button className="btn btn-sm btn-outline-dark me-2" onClick={() => handleLevelFilter('★★★☆☆')}>
                ★★★☆☆
              </button>
              <button className="btn btn-sm btn-outline-dark me-2" onClick={() => handleLevelFilter('★★★★☆')}>
                ★★★★☆
              </button>
              <button className="btn btn-sm btn-outline-dark me-2" onClick={() => handleLevelFilter('★★★★★')}>
                ★★★★★
              </button>
            </div>

            <div className="mb-3">
              <button className="btn btn-sm btn-outline-dark me-2" onClick={() => handleCategoryFilter('')}>
                全てのカテゴリ
              </button>
              <button className="btn btn-sm btn-outline-dark me-2" onClick={() => handleCategoryFilter('クラシック')}>
                クラシック
              </button>
              <button className="btn btn-sm btn-outline-dark me-2" onClick={() => handleCategoryFilter('ジャズ')}>
                ジャズ
              </button>
              <button className="btn btn-sm btn-outline-dark me-2" onClick={() => handleCategoryFilter('ヒップホップ')}>
                ヒップホップ
              </button>
              <button className="btn btn-sm btn-outline-dark me-2" onClick={() => handleCategoryFilter('ロック')}>
                ロック
              </button>
              <button className="btn btn-sm btn-outline-dark me-2" onClick={() => handleCategoryFilter('東方')}>
                東方 
              </button>
              <button className="btn btn-sm btn-outline-dark me-2" onClick={() => handleCategoryFilter('ボカロ')}>
                ボカロ 
              </button>
            </div>

            {/* 音楽カード表示 */}
            <div className="row">
                {filteredAndSortedData().map((music) => (
                  <div key={music.id} className="col-sm-3 my-2">
                    <div className="card" style={{ width: '100%' }}>
                      <img src={music.image} className="card-img-top" style={{ width: '100%', aspectRatio: '1.5' }} alt="..." />
                      <div className="card-body">
                        <h5 className="card-title">{music.title}</h5>
                        <p className="card-text">レベル：
                          <button className="btn btn-sm btn-outline-dark me-2" onClick={() => handleLevelFilter(music.level)}> {music.level} </button>
                        </p>
                        <p className="card-text">カテゴリ：
                          <button className="btn btn-sm btn-outline-dark me-2" onClick={() => handleCategoryFilter(music.category)}> {music.category} </button>
                        </p>
                        {rates[music.id-1] === 100 ? (
                          <p>
                            最高スコア：<strong id={`score-${music.id}`} className="text-success">{scores[music.id-1]}</strong>(
                            <strong id={`rate-${music.id}`} className="text-success">{rates[music.id-1]}</strong>%)
                          </p>
                        ) : (
                          <p>
                            最高スコア：<strong id={`score-${music.id}`}>{scores[music.id-1]}</strong>(
                            <strong id={`rate-${music.id}`}>{rates[music.id-1]}</strong>%)
                          </p>
                        )}
                        <button type="button" className="btn btn-info btn-selector" data-bs-toggle="modal" data-bs-target="#game-modal" onClick={() => {startGame(music.id)}}> 
                          Play Game!
                        </button>
                        {/*<button type="button" className="btn btn-info btn-selector" data-bs-toggle="modal" data-bs-target="#record-modal" onClick={() => {recordGame(music.id)}}> 
                          Record Game!
                        </button>*/}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
        <div className="col-sm-2 bg-body">
          <div className="mx-1 p-3">
            {isAuth ? (
              <>
                <p>{userName}さん <br></br>の合計スコア： <br></br><strong>{sumScore} ({sumRate}%) </strong></p>
                <form action="logout" method="get">
                  <div className="text-end">
                    <button type="submit" className="btn btn-secondary btn-sm mb-4">ログアウト</button>
                  </div>
                </form>
              </>
            ) : (
              <p>ログインしているとスコアを保存できるよ！</p>
            )}
            <form className="needs-validation" action="?" method="post">
  {/* onSubmit={(e) => handleFormSubmit(e, e.target.action)}> */}
              <label htmlFor="username" className="form-label">お名前</label>
              <input type="text" className="form-control mb-sm-2" id="username" name="username" required />
              <label htmlFor="password" className="form-label">合言葉</label>
              <input type="text" className="form-control mb-sm-2" id="password" name="password" required />
              <div className="row">
                <div className="col-sm-6">
                  <button type="submit" className="btn btn-success btn-sm" formAction="signup">新規登録</button>
                </div>
                <div className="col-sm-6">
                  <button type="submit" className="btn btn-primary btn-sm" formAction="signin">ログイン</button>
                </div>
              </div>
            </form>
          </div>
          {errorMessage && (
            <div>
              <p>{errorMessage}</p>
            </div>
          )}
        </div>
      </div>
      );
    }
}

export default App
