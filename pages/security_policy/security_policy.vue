<template>
	<view class="security-box">
		<u-navbar :placeholder="true" title="免责声明" leftIconColor="white"
			:titleStyle="{color:'white',fontSize:'1.3rem',fontWeight:'600'}" bgColor="#080d16" :autoBack="true">
		</u-navbar>
		
		<view v-for="item,index in titles">
			<uni-title style="margin-left: 1rem;" color="#88888a" type="h1" :title="item"></uni-title>
			<text class="sec_content">{{contents[index]}}</text>
		</view>

		<view class="footer">
			<text>最终解释权由软件作者所有</text>
		</view>
	</view>
</template>

<script>
	import { hideSystemNavigation } from '@/utils/page.js' 
	export default {
		created() {
			hideSystemNavigation()
		},
		data() {
			return {
				titles: ['1.信息准确性', '2.第三方链接', '3.服务中断', '4.用户行为', '5.免责条款的适用范围', '6.法律适用和争议解决'],
				contents: ['本应用致力于提供准确、完整的电视节目信息，但不保证信息的准确性、及时性和完整性。用户在使用本应用提供的信息时，应自行判断其适用性，并承担由此产生的所有风险和责任。',
					'本应用可能包含指向第三方网站或资源的链接，这些链接仅供用户方便参考。对于任何第三方网站或资源的内容、准确性以及使用造成的损失，本应用不承担任何责任。',
					`本应用将尽力保证服务的正常运行，但不对服务的稳定性、及时性、安全性和无中断等方面提供任何明示或暗示的保证。由于不可抗力、计算机病毒、黑客攻击、系统故障、网络问题等因素可能导致服务中断或受限，用户须自行承担由此引起的风险和损失。`,
					`用户须自行承担使用本应用的所有责任和风险。在使用过程中，用户不得利用本应用从事任何违法、违规、侵犯他人权益等非法活动，如有违反，用户将承担相应的法律责任。`,
					`上述免责声明适用于本应用的所有内容、服务和交易。本应用有权在任何时候对免责声明进行修改和更新，并通过适当方式通知用户。`,
					`本免责声明的解释、适用及争议解决均适用中华人民共和国法律。如用户因使用本应用而产生争议，双方应友好协商解决；协商不成的，用户同意将争议提交至本应用所在地有管辖权的人民法院解决。`
				]
			};
		},
	}
</script>

<style lang="less">
	.security-box {
		width: 100%;
		background-color: #080d16;
		color: #88888a;
	}

	.sec_content {
		padding-left: 2rem;
		line-height: 2rem;
	}

	.footer {
		width: 100%;
		height: 8rem;
		display: flex;
		align-items: center;
		justify-content: center;
		color: rgba(93, 104, 182, 1.0);
	}
</style>