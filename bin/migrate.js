const mongoose = require('mongoose');
const Contest = require('../models/Contest');
const Submission = require('../models/Submission');
const Battle = require('../models/Battle');
const {stripIndent} = require('common-tags');

mongoose.Promise = global.Promise;

(async () => {
	await mongoose.connect('mongodb://localhost:27017/tsg-ai-arena');

	const battles = await Battle.find({});

	for (const battle of battles) {
		battle.scores = Array(battle.players.length).fill(0);
		await battle.save();
	}

	const contests = await Contest.find({});

	for (const contest of contests) {
		contest.type = 'battle';
		await contest.save();
	}

	await Contest.deleteMany({id: 'rotating-drops'});

	await Contest.updateOne({id: 'dragon-puzzles'}, {
		name: 'Dragon Puzzles',
		id: 'dragon-puzzles',
		start: new Date('1970-01-01T00:00:00.000Z'),
		end: new Date('2038-01-19T12:14:07.000+0900'),
		type: 'score',
		description: {
			ja: stripIndent`
				# ドラゴンのパズル

				* H×Wマスのフィールド上に、1マスにつき1個のドロップが配置されている。
				  * 座標は左上が (1, 1)、右下が (H, W)。
				* ドロップの色は5種類あり、それぞれ1から5までの番号がついている。
				* プレイヤーは「操作Aを1回行ったあと、操作BをM回以下行う」操作セットをN回以下行うことができる。
				  * 操作A: フィールド上のドロップを1つ選択する。 (**注意: マスではない**)
					* 操作B: 操作Aで選択したドロップを、上下左右いずれかに移動する。移動した先のマス上のドロップは、移動元のマスと交換され移動する。
				* フィールドの外にドロップを移動させることはでき内容を。
				* 最終的になるべく同じ色のドロップが隣り合うように並び替えよ。

				## 入力

				\`\`\`
				H W N M
				d11 d12 d13 ...
				d21 d22 d23 ...
				d31 d32 d33 ...
				...
				\`\`\`

				* 1行目に、H, W, N, M が空白区切りで与えられる。
				* y + 1 (1 <= y <= H) 行目に、マス (x, y) 上のドロップの色 dix (1 <= dyx <= 5) が与えられる。
				* フィールド上のドロップの5つの色はすべて同数含まれることが保証される。

				## 出力

				\`\`\`
				x1 x2
				d11 d12 d13 d14 ...
				x2 y2
				d21 d22 d23 d24 ...
				...
				\`\`\`

				* i * 2 - 1 (1 <= i <= N) 行目に、i回目の操作セットの操作Aで選択するドロップが存在するマスの座標 (xi, yi) を空白区切りで出力せよ。
				* i * 2 (1 <= i <= N) 行目に、i回目の操作セットのj回目の操作Bでドロップを移動させる方向dijを空白区切りで出力せよ。
					* 上 (-y方向) に移動: 1
					* 右 (+x方向) に移動: 2
					* 下 (+y方向) に移動: 3
					* 左 (-x方向) に移動: 4

				## スコア

				* **最終的なフィールド上の、同じ色のドロップが隣接する領域全てについての、領域の大きさの二乗平均平方根 (RMS) がスコアとなる。**

				## テストケース

				* H = 5, W = 5, N = 3, M = 5 5ケース
				* H = 10, W = 10, N = 10, M = 10 5ケース
				* H = 20, W = 20, N = 30, M = 15 5ケース

				## サンプルコード

				以下は、この問題に対して不正でない出力を行うC++のサンプルコードである。

				\`\`\`
				#include <bits/stdc++.h>
				using namespace std;

				int **drops;

				int main() {
					cin.tie(0);
					ios::sync_with_stdio(false);

					int H, W, N, M;
					cin >> H >> W >> N >> M;

					drops = (int **)malloc(sizeof(int *) * H);
					for (int y = 0; y < H; y++) {
						drops[y] = (int *)malloc(sizeof(int) * W);
						for (int x = 0; x < W; x++) {
							cin >> drops[y][x];
						}
					}

					for (int i = 0; i < N; i++) {
						cout << 2 << " " << 2 << endl;

						for (int j = 0; j < M; j++) {
							cout << (j % 4) + 1;
							if (j == M - 1) {
								cout << endl;
							} else {
								cout << " ";
							}
						}
					}

					return 0;
				}
				\`\`\`

				## 入力例

				\`\`\`
				5 5 1 3
				1 2 3 4 5
				1 2 3 4 5
				1 2 3 3 4
				1 2 5 4 5
				1 2 3 4 5
				\`\`\`

				## 出力例

				\`\`\`
				3 4
				1 2 2
				\`\`\`
			`,
			en: stripIndent`
			`,
		},
	}, {upsert: true});

	await Contest.updateOne({id: 'komabasai2018-procon'}, {
		name: '駒場祭2018 Live Programming Contest',
		id: 'komabasai2018-procon',
		start: new Date('2018-11-24T16:03:00+0900'),
		end: new Date('2018-11-24T17:18:00+0900'),
		type: 'score',
		description: {
			ja: stripIndent`
				# iwashiの収穫祭

				### 問題
				
				これは何年前か、誰かがちょんぎった1日のお話。

				明日は謎の生物iwashiがつちからはえてきます。iwashiはTSG国にのみ生息する生き物で、天敵はつばめです。その味からTSG国の特産物になってます。
				TSG国のfiord君はiwashiの収穫をしたいと思っています。ただ、iwashiは凶暴な生き物で、群れをなして囲まれてしまうととても危険です。
				今回、TSG国屈指の大企業hakata社が事前にiwashiのはえてくる場所を正確に予測してくれています。<br>
				安全にfiord君がiwashiの収穫を行えるよう、ナビゲートしてあげてください。

				### ルール
				
				* TSG国はH×Wのマス目で表現されています。北西が(1,1)、南東が(H,W)で表現されます。各マスは「通路」か「壁」のどちらかです。各マスは東西南北の隣接したマスとつながっており、斜めへの移動は出来ません。fiord君やiwashiは通路上を移動し、壁のマスへ行くことは出来ません。
				* この日はTターンからなります。fiord君は各ターン東西南北のどちらかの方向を選び、1マス進めます（進まなくてもいいです）。進んだ先にiwashiがいるなら収穫を試みます。
				* iwashiは毎ターン、fiord君か他のiwashiの群れか、近い方へ向けて毎ターンfiord君と同じ速度で移動します。
				* fiord君が同時に収穫できるiwashiは5匹までです。6匹以上iwashiがいるマスへfiord君が行くと、逆に襲われてケガをしてしまいます。ケガをすると、5ターン治療に費やしてしまうので、気を付けましょう。なお、何故か治療中のfiord君をiwashiは認識できません。
				* Tターンで収穫するiwashiが最大になるようfiord君の行動を教えてあげて下さい。
				
				#### iwashiの行動について
				
				具体的には、以下のアルゴリズムで動作します。
				1. fiord君(治療中でない)とiwashiがいるマスをソースとして、BFSを行い「最短距離」のマップを生成します。
				2. (0,0)→(0,1)→…→(0,W)→(1,0)→…→(1,W)→(2,0)→…→(H,W)の順に、以下のことを行います。
					1. iwashiがいないなら次へ行きます。
					2. 既にそのマスへ外からiwashiがやってくることが分かっているなら元々そのマスにいたiwashiは動きません。そうでなければ、北→東→南→西の順に、現在位置よりも1のマップ上で距離が短いマスを探し、見つけたらそちらへ移動します。
				
				また、各ターンは、
				1. fiord君移動
				2. iwashi移動（運悪くiwashiがケガをしているfiord君のマスへ突っ込むときがあります。その際は、治療期間が5ターン増えます）
				3. iwashiがつちからはえてくる(fiord君がいるマスへはえてくる可能性もあります)
				4. fiord君収穫に挑戦（fiord君がケガをしている間は収穫できません。iwashiが素通りすることもあります）
				の順になります。

				### 入力
				
				標準入力を用い、以下の形式で与えられます。
				\`\`\`
				H W T N
				Px Py
				S1
				S2
				...
				SH
				x1 y1 t1
				x2 y2 t2
				...
				xN yN tN
				\`\`\`
				* TSG国の区画はH×Wです。その区画は\{Si | 1≦i≦H\}になっています。1≦i≦Hで|Si|=Wが成立し、Sij="#"でそのマスが壁、Sij="."で通路であることを示します。外周は"#"で囲まれていることが保証されています。
				* 現在のfiord君の位置は(Px, Py)です。周囲が壁て囲まれていて動けない可能性があります。
				* また、この日にfiord君はTターン行動可能です。hakata社のエスパーによると今日はN匹のiwashiがつちからはえてくるらしいです。
				* i匹目(1≦i≦N)のiwashiは位置(xi, yi)に現在からtiターン後につちからはえてきます。ti=0は既にはえているiwashiです。

				### 出力
				
				\`\`\`
				S
				\`\`\`
				* 標準出力で、fiord君の移動方法を1行の文字列Sとして出力してください。
				* Siが"N"、"E"、"W"、"S"のどれかの時、それぞれの方角に応じた方向へfiord君は動こうとします。
				* それ以外の文字だった場合や、|S|>Tの時のSi(i>T)、|S|<Tの時の|S|ターン以降の動作は「移動を試みない」という扱いをします。

				### スコア、テストケース、勝敗の決定方法
				
				テストケースは以下のものを使用します。
				* 共通のもの
					* H=22
					* W=22
					* T=1000
				* little(6ケース)
					* N=250
					* 壁と通路の比率: 外周を除いて壁は25%で無作為に生成
				* much(6ケース)
					* N=3000
					* 壁と通路の比率: 外周を除いて壁は25%で無作為に生成
				* challenge(3ケース)
					* N=1000
					* 壁と通路の比率: 外周を除いて壁は47.5%で作為的に生成

				スコアは各テストケースで{iwashiの収穫数}/Nで求めます。勝敗は各テストケースのスコアの総和で求めます。

				今回の五月祭では全体を通して赤vs青の形式を取っています。この大戦では、ceil(勝者のスコアの総和 - 敗者のスコアの総和)ptが勝利したチームに加算されます。

				#### サンプルコード

				以下は、この問題に対して不正でない出力を行うC++のサンプルコードである。

				\`\`\`
				#include <bits/stdc++.h>
				using namespace std;

				int **drops;

				int main() {
					cin.tie(0);
					ios::sync_with_stdio(false);

					int H, W, N, M;
					cin >> H >> W >> N >> M;

					drops = (int **)malloc(sizeof(int *) * H);
					for (int y = 0; y < H; y++) {
						drops[y] = (int *)malloc(sizeof(int) * W);
						for (int x = 0; x < W; x++) {
							cin >> drops[y][x];
						}
					}

					for (int i = 0; i < N; i++) {
						cout << 2 << " " << 2 << endl;

						for (int j = 0; j < M; j++) {
							cout << (j % 4) + 1;
							if (j == M - 1) {
								cout << endl;
							} else {
								cout << " ";
							}
						}
					}

					return 0;
				}
				\`\`\`

				### 入力例

				\`\`\`
				5 5 1 3
				1 2 3 4 5
				1 2 3 4 5
				1 2 3 3 4
				1 2 5 4 5
				1 2 3 4 5
				\`\`\`

				### 出力例

				\`\`\`
				3 4
				1 2 2
				\`\`\`
			`,
			en: stripIndent`
			`,
		},
	}, {upsert: true});

	await Contest.updateOne({id: 'komabasai2018-ai'}, {
		name: '駒場祭2018 Live AI Contest',
		id: 'komabasai2018-ai',
		start: new Date('2018-11-25T12:03:00+0900'),
		end: new Date('2018-11-25T13:18:00+0900'),
		type: 'battle',
		description: {
			ja: stripIndent`
				# 問題文

				## 背景（プレイヤーは読まなくていい）

				## ゲームの概要

				* ゲームは、ターン制かつ攻撃側と防御側が存在する。
				* 各プレイヤーは同じ盤面から始めてそれぞれ攻撃側と防御側を一度ずつ行う。
				* 盤面の外周は壁で囲われているものとする。
				* 初期盤面では、大きさW x Hの盤面の上にはロボットといくつかの壁が配置されている。
				  * ロボットの種類は、Beam, Pawn, Targetであり、BeamとPawnが攻撃側、Targetが防御側に属する。
				* 各ターンごとに、プレイヤーは自分のロボットを選んで、四方の好きな方向を選び動かすことができる。
				  * ロボットは、他のロボットか、壁に衝突するまで止まらずに真っ直ぐ進む。
				  * ただし、Beamのロボットだけは、**移動前に選んだ方向にビームを打ってから**、移動をする。
					* このとき、ビームの先にTargetロボットが存在すればそのロボットは消滅する。
					* またこのビームの軌跡は盤面上に残りTargetロボットはこのBeamを超えることはできない。すなわち、**Targetロボットにとっては、ビームの軌跡も壁になる**。
					* また、ビーム自体は壁を突き破ることはない。
				* このビームによりすべてのTargetロボットが消滅したときに、ゲーム終了となり、攻守交代をして再び対戦をする。

				## 勝利条件

				上で説明したゲーム終了までにかかったターン数の合計がより少ないほうが勝ちであり、その差をスコアとする。

				## 入力

				### 初期入力

				\`\`\`
				W H
				T
				c11 c12 c13 ... c1W
				c21 c22 c23 ... c2W
				.
				.
				.
				cH1 cH2 cH3 ... cHW
				\`\`\`

				* W(10 <= W <= 1000)は盤面の横幅、H(10 <= W <= 1000)は盤面の縦幅である。
				* TはAまたはDのが入っており、攻撃側か防御側かをそれぞれA,Dで表す。
				* 以降のc11からcHWは各行スペース区切りでそれぞれcijが地点(i, j)における初期盤面の状態である。以下にそれぞれの表示方法を提示する
				* ロボットの表示は、最初にprefixとして1文字で、ロボットの種類を表す。bがBeam, pがpawn, tがtargetである。その後に続く数字がロボットのIDとなる。例えば、BeamのID10のロボットはb10と表現する。
				* また、blockを*で表し、何も無い場合は.と書く。

				### 中間の入力

				* 攻撃側であれば1ターン目が自分のターンであるから、上で提示した初期入力後には中間の入力は発生しない。
				* 中間の入力では、一つ前のターンでの相手の行動を提示する

				\`\`\`
				r
				\`\`\`
			`,
			en: stripIndent`
			`,
		},
	}, {upsert: true});

	const contestAi = await Contest.findOne({id: 'komabasai2018-ai'});

	for (const presetName of ['random']) {
		await Submission.updateOne({
			name: presetName,
			contest: contestAi,
		}, {
			isPreset: true,
			name: presetName,
			user: null,
			contest: contestAi,
			language: null,
			code: null,
			size: null,
		}, {upsert: true});
	}

	mongoose.connection.close();
})();
