import { useState, useEffect } from 'react'
import { register_music, PhaserGame } from './game.js' 

let phaserGame;
let game;
let closeBtn;
let stored_data;
let music_id;
window.score = -1;

function App() {
  const [count, setCount] = useState(0)
  const [scores, setScores] = useState([])
  const [rates, setRates] = useState([])
  // 初期化を検知するフラグ
  const [loading, setLoading] = useState(true);
  const [musicData, setMusicData] = useState([]);
  const [sortBy, setSortBy] = useState('id'); // 初期値はIDが大きい順
  const [sortOrder, setSortOrder] = useState('desc'); // 初期値は降順
  const [filterLevel, setFilterLevel] = useState(''); // 初期値は全てのレベル
  const [filterCategory, setFilterCategory] = useState(''); // 初期値は全てのカテゴリ

  const fetchScore = async () => { 
    fetch('/score')
    .then(response => response.json())
    .then(data => {
        // 取得したデータをログに出力
        console.log('Received scores:', data.score);
        console.log('Received rates:', data.rate);

        // 取得したデータを適切な処理に渡す（例：グラフに表示するなど）
        stored_data = data
        setScores(stored_data.score);
        setRates(stored_data.rate);
        console.log("score", scores);
    })
    .catch(error => {
        console.error('Error fetching data:', error);
    })
  };

  const fetchData = async () => {
    fetch('jsons/music_data.json')
    .then(response => response.json())
    .then(data => {
        // 取得したデータをログに出力
        console.log('Music Data:', data);

        // 取得したデータを適切な処理に渡す（例：グラフに表示するなど）
        setMusicData(data)
    })
    .catch(error => {
        console.error('Error fetching data:', error);
    })
  };

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
    let filteredData = musicData;
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


  const startGame = (id) => {
    music_id = id;
    window.score = stored_data.score[music_id-1]
    window.rate = stored_data.rate[music_id-1]
    phaserGame = new PhaserGame();
    game = phaserGame.init(id);
    console.log("hello")
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
    fetchScore();
    fetchData();
    // 初期化済みのフラグを立てる
    setLoading(false);
    closeBtn = document.getElementById("btn-close");
    closeBtn.addEventListener('click', tearDown);
    // クリーンアップ関数を返してイベントリスナーを削除
    return () => {
        if (closeBtn) {
            closeBtn.removeEventListener('click', tearDown);
        }
    };
  }, []);


  return (
    <>
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
                </div>
              </div>
            </div>
          ))}
      </div>
      {/* モーダル */}
      {/*
      <div className="modal fade" id="game-modal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-fullscreen">
          <div className="modal-content">
            <div className="modal-header">
              <button type="button" className="btn-close" id="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={() => {tearDown()}}></button>
            </div>
            <div className="modal-body" id="modal-body">
            </div>
          </div>
        </div>
      </div>
      */}
    </>
    )
}

export default App
