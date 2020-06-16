<template>
	<view>
		<view class="allContent">
			<view class="total" v-for="(item,index) in myData" :key="index" @tap="gotoGoodsDetail(item)">
				<view class="name">
					<uni-icons type="shop" color="orange" size="15"></uni-icons>
					<span class="redCross">{{item.redCross.mname}}</span>
				</view>
				<uni-badge class="stat" type="error" :text="item.stat" :inverted="false"></uni-badge>

				<view class="left">
					<image :src="'http://image.nssnail.com/'+item.fileList[0].relativePath"></image>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {mapState,mapMutations} from 'vuex'
	import uniBadge from "@/components/uni-badge/uni-badge.vue"
	export default {
		data() {
			return {
				sessionId:'',
				myData:[]
			}
		},
		onLoad(option) {
			this.init()
		},
		computed: mapState(['hasLogin','uerInfo']),
		methods: {
			...mapMutations(['login']),
			init(){
				uni.getStorage({
					key: 'userInfo',
					success:(res) => {
						this.login(res.data);
						this.sessionId = res.data.sessionId
						uni.request({
							url:'https://www.nssnail.com/wx/getGoods',
							data:{
								sessionId:this.sessionId
							},
							success: (res) => {
								if(res.data.stat == 1){
									this.myData = res.data.data
									this.myData.forEach((item)=>{
										if(item.stat == '1'){
											item.stat = '上架'
										}else{
											item.stat = '下架'
										}
									})
								}else if(res.data.stat == 3 || res.data.stat == 4){
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
			
			// 跳转至详情页
			gotoGoodsDetail(item){
				var url = 'http://image.nssnail.com/'+item.fileList[0].relativePath
				var id = item.id
				uni.navigateTo({
					url:'../goodsDetail/goodsDetail?id='+id+'&sessionId='+this.sessionId+'&url='+url
				})
			}
		},
		components:{
			uniBadge
		}
	}
</script>

<style scoped>
.allContent{
	width: 92%;
	margin: 0 auto;
	border-radius: 10rpx;
}
.total{
	display: flex;
	flex-wrap: wrap;
	padding: 20rpx 0 10rpx 0;
	margin-top: 20rpx;
	background-color: white;
	border-radius: 10rpx;
	position: relative;
}
.left{
	width: 92%;
	margin: 0 auto;
}
.left image{
	width: 635rpx;
	height: 350rpx;
	border-radius: 15rpx;
}
.stat{
	left: 560rpx;
	font-size: 22rpx;
	position: absolute;
	top: 30rpx;
}
.name{
	width: 100%;
	margin-left: 20rpx;
}
.redCross{
	margin: 5rpx 10rpx;
	font-weight: 600;
}
</style>
