ons.ready(function() {
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
	  el: '#app',
	  // 初期データの設定
	  data: {
	  	user: {
	  		isLoggedIn: false,
	  		mailAddress: "",
	  		password: ""
	  	},
	  	times: []
	  },
	  // デプロイ完了時のイベント
	  created: function() {
	  	// ユーザのステータスが変わったら通知
	  	var me = this;
	  	firebase.auth().onAuthStateChanged(function(user) {
	  		me.user.isLoggedIn = (user !== null);
	  	});
	  	
	  	var data = firebase.database().ref('times/');
	  	data.on('value', function(times) {
	  		me.times = [];
	  		times.forEach(function(time) {
	  			me.times.push({
	  				key: time.key,
	  				time: time.val().time
	  			})
	  		});
	  	});
	  	data.on('child_added', function(time) {
	  		var result = me.times.filter(function(item) {
	  			return item.key == time.key;
	  		})
	  		if (result) {
	  			return;
	  		}
  			me.times.push({
  				key: time.key,
  				time: time.val().time
  			})
	  	});
	  },
	  
	  // テンプレート
	  template: `
	  <v-ons-page>
	    <v-ons-toolbar>
	      <div class="center"> Firebase認証 </div>
	    </v-ons-toolbar>
	    <section style="margin: 10px;" v-if="user.isLoggedIn">
	    	<p>{{ user.mailAddress }}</p>
		    <section style="margin: 10px;">
		    	<ons-button @click="add">データ追加</ons-button>
		      <ons-button @click="logout">ログアウト</ons-button>
		    </section>
		    <section style="margin: 10px;">
		    	<ons-list>
		    		<ons-list-header>リスト</ons-list-header>
		    		<ons-list-item v-for="item in times">
		    			<div class="center">{{ item.time }}</div>
		    		</ons-list-item>
		    	</ons-list>
		    </section>
	    </section>
			<section v-else style="margin: 10px;">
	      <p>メールアドレス</p>
	      <p>
	        <v-ons-input v-ons-model="user.mailAddress" placeholder="メールアドレス"></v-ons-input>
	      </p>
	      <p>パスワード</p>
	      <p>
	        <v-ons-input v-ons-model="user.password" placeholder="パスワード" type="password"></v-ons-input>
	      </p>
	      <ons-button @click="register">新規登録</ons-button>
	      <ons-button @click="login">ログイン</ons-button>
	    </section>
	  </v-ons-page>`,
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
	  	// データの追加
	  	add: function() {
	  		var d = new Date;
	  		var message = `${d.getFullYear()}/${d.getMonth() + 1}/${d.getDate()} ${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`
	  		firebase.database().ref('times/').push({
	  			time: message
	  		})
	  		.catch(function(error) {
	  			alert(error.message)
	  		})
	  	}
	  }
	});
});
