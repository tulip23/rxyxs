<template>
	<view>
		<view class="all">
			<view class="none"></view>
			<uni-list>
				<uni-list-item title="支付密码设置" @tap="setPassword"></uni-list-item>
				<uni-list-item title="修改邮箱" @tap="updateMail"></uni-list-item>
				<uni-list-item title="修改手机号" @tap="updatePhone"></uni-list-item>
			</uni-list>
			<view class="none"></view>
		</view>
	</view>
</template>

<script>
import {mapState,mapMutations} from 'vuex'
import uniBadge from "@/components/uni-badge/uni-badge.vue"
import uniList from "@/components/uni-list/uni-list.vue"
import uniListItem from "@/components/uni-list-item/uni-list-item.vue"
import uniPopup from '@/components/uni-popup/uni-popup.vue'	
export default{
	data(){
		return{
			password:'',
			sessionId:'',
			payStat:''
		}
	},
	onLoad(){
		this.init()
	},
	computed: mapState(['hasLogin','uerInfo']), 
	
	methods:{
		...mapMutations(['login']),
		init(){
			uni.getStorage({
				key: 'userInfo',
				success:(res) => {
					this.login(res.data);
					this.sessionId = res.data.sessionId
					uni.request({
						url:'https://www.nssnail.com/wx/checkPayPwd',
						data:{
							sessionId:this.sessionId
						},
						success:(res)=>{
							if(res.data.stat == 1){
								this.payStat = res.data.stat
							}else if(res.data.stat == 3){
								uni.showModal({
								    title: '提示',
								    content: '登录过期，请重新登录',
								    success: function (res) {
								        if (res.confirm) {
								            uni.navigateTo({
								            	url:'../myInit/myInit'
								            })
								        }
								    }
								});
							}
							
						}
					})
				} 
			})
		},
		
		// 判断用户是否设置过密码
		setPassword(){
			if(this.payStat == 1){
				uni.navigateTo({
					// url:'../checkNumber/checkNumber?sessionId='+this.sessionId
					url:'../personInfo/updatePass?sessionId='+this.sessionId
				})
			}else{
				uni.navigateTo({
					url:'../personInfo/setPassword'
				})
			}
		},
		
		// 修改邮箱
		updateMail(){
			uni.navigateTo({
				url:'../personInfo/updateMail?sessionId='+this.sessionId
			})
		},
		
		// 修改手机号
		updatePhone(){
			var flags = 2
			var check = 1
			uni.navigateTo({
				url:'../checkNumber/checkNumber?flags='+flags+'&check='+check
			})
		}
	},
	components:{
		uniBadge,
		uniList,
		uniListItem,
	}
}
</script>

<style scoped>
.none{
	width: 92%;
	height: 5rpx;
}
.all{
	width: 92%;
	margin: 30rpx auto;
	border-radius: 10rpx;
	background-color: white;
}
</style>
