// mbaasのAPIキーの文字列
var mbaas_api_key = "bdf0b1c113d9019ad02a5220b0c7fa796f1a84124fc039ba7e3b6cc4ac527e8e";
// mbaasのクライアントキーの文字列
var mbaas_cli_key = "431c0c7a6c7b2d82cb23394477fc2c318d92ab149d8380b689894f623339180e";

// APIキーの設定とSDK初期化
var ncmb = new NCMB(mbaas_api_key, mbaas_cli_key);



// 投稿時間とコメントのデータ挿入
function setInfo() {
  // 保存先クラスの作成
  var HighTouchClass = ncmb.DataStore("HighTouchClass");
  // 保存先クラスのインスタンスを生成
  var highTouchClass = new HighTouchClass();

  // コメント
  var set_word = document.getElementById("happyword").value;
  // 現時間
  var set_date = new Date();

  // 値を設定と保存
  highTouchClass
    .set("setWord", set_word)
    .set("setHour", set_date.getHours())
    .save()
    .then(function (results) {
      console.log("setWord:" + results.get("setWord") + " - " + "setHour:" + results.get("setHour"));
    })
    .catch(function (err) {
      // エラー処理
      console.log(err);
    });

    infoFetch();
}

// ユーザ数とコメントの取得
function infoFetch(){
  userHourCount();
  userAllCount();
  wordFetch();
}

// 5秒毎に情報取得
setInterval(infoFetch,5000);


//すべてのユーザーのカウント
function userAllCount() {
  // 保存先クラスの作成
  var HighTouchClass = ncmb.DataStore("HighTouchClass");

  HighTouchClass
    .count()
    .fetchAll()
    .then(function (results) {
      console.log(results.count);
      document.getElementById("countAll").innerHTML = results.count;
    })
    .catch(function (err) {
      // エラー処理
      console.log(err);
    });
}

//1時間ののユーザーのカウント
function userHourCount() {
  // 保存先クラスの作成
  var HighTouchClass = ncmb.DataStore("HighTouchClass");
  // 現時間
  var nowHour = new Date().getHours()

  HighTouchClass
    .equalTo("setHour",nowHour)
    .count()
    .fetchAll()
    .then(function (results) {
      console.log(results.count);
      document.getElementById("countHour").innerHTML = results.count;
    })
    .catch(function (err) {
      // エラー処理
      console.log(err);
    });
}



// ワードの検索
function wordFetch() {
  // 保存先クラスの作成
  var HighTouchClass = ncmb.DataStore("HighTouchClass");

  var word;
  var x;

  HighTouchClass
    .order("createDate", true)
    .limit(10)
    .fetchAll()
    .then(function (results) {
      for (var i = 0; i < results.length; i++) {
        word = results[i].get("setWord");
        // console.log("word:" + word);
        x="word"+i; 
        document.getElementById(x).innerHTML = word;
      }
    })
    .catch(function (err) {
      // エラー処理
      console.log(err);
    });

}

// ハイタッチの成功
function highTouchSuccess() {
  // playSound();
  window.navigator.vibrate(400);
}



/*-----------------------------------------------*/
/*--------------------touch--------------------*/
/*-----------------------------------------------*/
var el_hitarea = document.getElementById('hitarea');

// イベント設定 
el_hitarea.addEventListener('touchstart', function (event) {
  
  highTouchSuccess();
  setInfo();
}, false);



/*-----------------------------------------------*/
/*--------------------傾き--------------------*/
// /*-----------------------------------------------*/
const elDebug = document.querySelector('#debug');


/** デバイスが傾いたときのイベント。 */
function deviceOrientationHandler(event) {
  //ジャイロセンサー情報取得
  // Z軸
  var z = event.accelerationIncludingGravity.z;

  // function
  function obj2NumberFix(obj, fix_deg) {
    return Number(obj).toFixed(fix_deg);
  }

  if (5 <= z && 6 >= z || z <= -5 && z >= -6) {
    highTouchSuccess();
    
  }
}

window.addEventListener('devicemotion', deviceOrientationHandler, true);
