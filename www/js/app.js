var onDeviceReady = function() {
   // Firebaseの初期化
   var config = {
       apiKey: "API_KEY",
       authDomain: "AUTH_DOMAIN",
       databaseURL: "DATABASE_URL",
       storageBucket: "STORAGE_BUCKET",
       messagingSenderId: "MESSAGING_SENDER_ID"
    };
	firebase.initializeApp(config);

	// Vueの処理
	var vm = new Vue({
	  el: '#app',  // マウントするDOM
	  // 初期データの設定
		data: {
		  user: {
		    isLoggedIn: false,
		    mailAddress: "",
		    password: ""
		  },
		  times: []  // 追加
		},

	  // デプロイ完了時のイベント
		created: function() {
		  // ユーザのステータスが変わったら通知
		  var me = this;
		  var data = firebase.database().ref('times/');
		  
		  firebase.auth().onAuthStateChanged(function(user) {
		    me.user.isLoggedIn = (user !== null);
		  	if (user !== null) {
					data.on('value', function(times) {
						me.times = [];
						times.forEach(function(time) {
							me.times.push({
								key: time.key,
								time: time.val().time
							})
						});
					});
		  	}else{
		  		data.off('value');
		  	}
		  });
		  
			
		},

	    
	  // テンプレート
		template: `
		<div>
	    <div class="center"> Firebase認証 </div>
		  <section style="margin: 10px;" v-if="user.isLoggedIn">
		    <p>{{ user.mailAddress }}</p>
		    <section style="margin: 10px;">
		    	<button @click="add">データ追加</button>
		      <button @click="logout">ログアウト</button>
		    </section>
		    <!-- データを表示するリストを追加 -->
				<section style="margin: 10px;">
					<div>リスト</div>
					<ul v-for="item in times">
						<li>{{ item.time }}</li>
					</ul>
				</section>
		  </section>
		  <section v-else style="margin: 10px;">
		    <p>メールアドレス</p>
		    <p>
		      <input v-model="user.mailAddress" placeholder="メールアドレス" />
		    </p>
		    <p>パスワード</p>
		    <p>
		      <input v-model="user.password" placeholder="パスワード" type="password" />
		    </p>
		    <button @click="register">新規登録</button>
		    <button @click="login">ログイン</button>
		  </section>
		</div>`,

	  // イベント処理
	  methods: {
			// 登録処理
			register: function() {
			  firebase.auth().createUserWithEmailAndPassword(this.user.mailAddress, this.user.password)
			    .catch(function(error) {
			      alert(error.message);
			    });
			},
			// ログイン処理
			login: function() {
			  firebase.auth().signInWithEmailAndPassword(this.user.mailAddress, this.user.password)
			    .catch(function(error) {
			      alert(error.message);
			    });
			},
			// ログアウト処理
			logout: function() {
			  firebase.auth().signOut();
			},
			add: function() {
				// 登録するメッセージを作成
				var d = new Date;
				var message = `${d.getFullYear()}/${d.getMonth() + 1}/${d.getDate()} ${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`
				
				firebase.database().ref('times/').push({
					time: message
				})
				.catch(function(error) {
					alert(error.message)
				})
			},
	  }
	});

};
document.addEventListener(window.cordova ?"deviceready" : "DOMContentLoaded", onDeviceReady, false);
