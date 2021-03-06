const mongoose = require('mongoose');
const {stripIndent} = require('common-tags');
const Contest = require('../models/Contest');
const User = require('../models/User');
const Battle = require('../models/Battle');
const Match = require('../models/Match');
const Submission = require('../models/Submission');
const Turn = require('../models/Turn');

mongoose.Promise = global.Promise;

(async () => {
	await mongoose.connect('mongodb://localhost:27017/tsg-ai-arena');

	await User.updateMany({}, {$set: {admin: false}});
	for (const id of ['hakatashi', 'naan112358', 'kcz146', 'kuromunori', '__dAi00', 'n4o847']) {
		const user = await User.findOne({email: `${id}@twitter.com`});
		if (user) {
			user.admin = true;
			await user.save();
		}
	}

	const contest = await Contest.findOne({id: 'komabasai2019-marathon'});
	if (contest) {
		const battles = await Battle.find({contest});
		for (const battle of battles) {
			await Turn.deleteMany({battle});
		}
		await Battle.deleteMany({contest});
		await Match.deleteMany({contest});
		await Submission.deleteMany({contest});
	}

	await Contest.updateOne({id: 'komabasai2019-marathon'}, {
		name: '駒場祭2019 Live Programming Contest Marathon Match',
		id: 'komabasai2019-marathon',
		start: new Date('2019-11-22T16:03:00+0900'),
		end: new Date('2019-11-22T17:18:00+0900'),
		type: 'score',
		description: {
			ja: stripIndent`
				# ほぼ小町算(Almost-Komachi)
				## 背景
				TSG LIVE!も今回で4回目。4といえば平方数、平方数といえば100ですが（ほんまか？）、100といえば小町算です。
				4回目にちなんだ100ちょうどになる数式を来場者の皆さんにお届けしましょう！
				あれ？使う数字がいつもと違うような… でも、きっとプレイヤーの皆さんならうまくやってくれるはずです！
				## 問題
				* $N$ 個の正の整数があります。全ての整数は互いに異なります。
				* これらの数字を過不足なく使って（並べ替えても構いません）、連結・四則演算・かっこのみからなる式を作ってください(除算を行う際に小数点以下の切り捨てはされず、有理数として計算が行われます)。
				* 出来上がった式の値を $100$ にしてください。
				* $100$ ちょうどでなくても構いませんが、差をなるべく小さくしてください。
				
				* 誤差は($100$ からの絶対誤差 $+1$)の常用対数で評価します。10個のテストケースについて、対数を取ったスコアを$10^8$倍し、$10^{12}$から減算したものの合計が最終的なスコアになります。
				* 2つの提出を比べた時、スコアが違うならスコアが大きい提出が勝ちです。スコアが同じなら先に提出された提出が勝ちです。
				## 入出力
				### 入力
				以下のフォーマットに従って与えられます。
				\`\`\`
				N
				a1 a2 ... aN
				\`\`\`
				* 1行目に与えられる正の整数の和 $N$ ($5\\leqq N\\leqq1000$) が与えられる。
				* 続く2行目に $N$ 個の数字が空白区切りで与えられる。$a_i$ は使うことができる $i$ 番目の正の整数($1\\leqq a_i\\leqq99999999$)である。
				### 出力
				\`\`\`
				s
				\`\`\`
				* 1行にわたって、与えられた整数をすべて1度ずつ使った数式を表す文字列 $s$ を出力してください。
				* 演算子や括弧と数字の間には空白があってもなくても構いませんが、数字を連結する際は間に1つ以上の空白を入れてください。また、それ以外の場所に空白を入れないでください。
				### 入出力例
				#### 入力例1
				\`\`\`
				9
				1 2 3 4 5 6 7 8 9
				\`\`\`
				いつもの小町算ですね。これはtinyのテストケースに含まれます。
				#### 出力例1
				\`\`\`
				1 2 3 + 4 5 - 6 7 + 8 - 9
				\`\`\`
				$123+45-67+8-9=100$ です。誤差が$0$で、理論値です。この時のスコアは$1000000000000$点です。
				#### 出力例2
				\`\`\`
				1 2 * 7 + 4 * 5 - ( 9 - 8 ) * 6 / 3
				\`\`\`
				$12\\times7+4\\times5-(9-8)\\times6/3=102$ です。順番を変えても、$100$ ちょうどでなくても構いませんが、誤差によって点数が決まるので注意してください。
				この場合、スコアは $10^{12}-10^8\\times\\log_{10}(2+1)=999952287874$です。
				#### 出力例3
				\`\`\`
				1 2 3 4 5 6 7 8 9
				\`\`\`
				$123456789=123456789$ です。有効な式ならすべて正答と判定されますが、誤差によって点数が決まるので注意してください。
				この場合、スコアは $10^{12}-10^8\\times\\log_{10}(123456689+1)=999190848537$です。
				## テストケース・スコア評価について
				* $N=9$, $a_i\\leqq9$ (tiny)…1ケース
				* $N=5$, $a_i\\leqq9$ (small)…3ケース
				* $N=20$, $a_i\\leqq99$ (middle)…3ケース
				* $N=1000$, $a_i\\leqq99999999$ (large)…3ケース
				を使用し、各ケースにおける「式の値と $100$ との差の絶対値+1の対数」の合計を競います。各テストケースにおいて正整数はランダムに生成されるため、ちょうど $100$ になるような式が存在する保証はありません。
				式として有効でない、あるいは0除算などが式中に出現する場合、そのテストケースのスコアは$1000000000000$点となります。
				より小さいスコアを目指してください。
			`,
			en: '',
		},
	}, {upsert: true}, (err) => {
		if (err) {
			throw err;
		}
		console.log('inserting succeeded');
	});

	mongoose.connection.close();
})();
