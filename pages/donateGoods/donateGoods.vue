<template>
	<view>
		<view class="all">
			<view class="pop">
				<image :src="url"></image>
			</view>
			<view class="myGoods">
				<view class="myname">捐赠物品：<span class="myspan">{{product}}</span></view>			
				<view class="myname">需求数量：<span class="myspan">{{qty}}</span></view>
			</view>
			
			<view class="mytwo">
				<view class="buy">捐赠数量</view>
				<view class="buybtn">
					<uni-icons type="minus" size="20" @tap="reduce"></uni-icons>
					<span class="myqtys">{{myqty}}</span>
					<uni-icons type="plus" size="20" @tap="add"></uni-icons>
				</view>
			</view>
			
			<!-- 上传捐赠物品的图片 -->
			<view class="popImage">
				<view class="uploadBox">上传捐赠物品图片</view>
				<view class="uni-list list-pd">
					<view class="uni-list-cell cell-pd">
						<view class="uni-uploader">
							<view class="uni-uploader-head">
							</view>
							<view class="uni-uploader-body">
								<view class="uni-uploader__files">
									<block v-for="(image,index) in imageList" :key="index">
										<view class="uni-uploader__file">
											<view class="icon iconfont icon-shanchu" @tap="del(index)"></view>
											<image class="uni-uploader__img" :src="image" :data-src="image" @tap="previewImage"></image>
										</view>
									</block>
									<view class="uni-uploader__input-box" v-if="imageList.length != 9">
										<view class="uni-uploader__input" @tap="chooseImage"></view>
									</view>
								</view>
							</view>
						</view>
					</view>
					<button class="btn" @tap='sure'>申请捐赠</button>
				</view>
				
			</view>
		</view>
	</view>
</template>

<script>
	var sourceType = [
		['camera'],
		['album'],
		['camera', 'album']
	]
	var sizeType = [
		['compressed'],
		['original'],
		['compressed', 'original']
	]
	export default {
		data() {
			return {
				url:'',
				product:'',
				qty:'',
				myqty:1,
				sessionId:'',
				imageList: [],
				sourceTypeIndex: 2,
				sourceType: ['拍照', '相册', '拍照或相册'],
				sizeTypeIndex: 2,
				sizeType: ['压缩', '原图', '压缩或原图'],
				countIndex: 8,
				count: [1, 2],
				uploadData:[]
			}
		},
		onLoad(option) {
			this.url = option.url
			this.qty = option.qty
			this.product = option.product
			this.sessionId = option.sessionId
		},
		methods: {
			// 数量
			reduce(){
				if(this.myqty > 1){
					this.myqty --
				}else{
					uni.showToast({
						title:'数量低于范围~',
						icon:'none'
					})
				}
			},
			
			// 增加
			add(){
				if(this.myqty < this.qty){
					this.myqty ++
				}else{
					uni.showToast({
						title:'供大于求了~',
						icon:'none'
					})
					return
				}
			},
			
			// 选择图片
			chooseImage: async function() {
				if (this.imageList.length === 9) {
					return;	
				}
				uni.chooseImage({
					sourceType: sourceType[this.sourceTypeIndex],
					sizeType: sizeType[this.sizeTypeIndex],
					count: this.imageList.length + this.count[this.countIndex] > 9 ? 9 - this.imageList.length : this.count[this.countIndex],
					success: (res) => {
						this.imageList = this.imageList.concat(res.tempFilePaths);
					},
				})
			},
			// 预览图片
			previewImage: function(e) {
				var current = e.target.dataset.src
				uni.previewImage({
					current: current,
					urls: this.imageList
				})
			},
			
			// 删除选中的图片
			del(index){
				uni.showModal({
				    title: '提示',
				    content: '是否要删除该图片',
				    success: (res)=> {
				        if (res.confirm) {
							this.imageList.splice(index,1)
				        }
				    }
				});
			},
			
			// 循环上图
			async uploadImages(url){
				uni.showLoading({
					title:'上传中'
				})
				uni.uploadFile({
					url:'https://www.nssnail.com/file/uploadWxFile',
					filePath:url,
					name:'file',
					success: (res) => {
						var resdata = JSON.parse(res.data)
						this.uploadData.push(resdata.data)
						if(this.uploadData.length == this.imageList.length){
							uni.request({
								url:'https://www.nssnail.com/wx/donateGoods',
								method:'POST',
								data:{
									fileList:this.uploadData,
									product:this.product,
									qty:this.myqty,
									sessionId:this.sessionId
								},
								success: (res) => {
									if(res.data.stat == 1){
										setTimeout(function () {
										    uni.hideLoading();
										}, 2000);
										uni.showToast({
											title:'申请成功',
											icon:'success',
											success:()=>{
												setTimeout(function(){
													uni.navigateBack({
														delta:1
													})
												},2000);
											}
										})
									}else{
										uni.showToast({
											title:res.data.message,
											icon:'none'
										})
									}
								}
							})
						}
						
					}
				})
			},
			
			// 上传图片
			async sure(){
				if(this.imageList.length==0){
					uni.showToast({
						title:'请上传物品图片',
						icon:'none'
					})
				}else{
					let arr = []
					for (let k in this.imageList) {
						arr[k] = this.uploadImages(this.imageList[k])
					}
					return arr;
				}
			},
		}
	}
</script>

<style scoped>
.all{
	height: 550rpx;
	background-color: white;
	display: flex;
	flex-wrap: wrap;
	position: relative;
	padding-bottom: 20rpx;
}
.pop{
	margin: 20rpx;
	padding-top: 20rpx;
}
.pop image{
	width: 350rpx;
	height: 250rpx;
	border-radius: 20rpx;
}
.mynav{
	position: absolute;
	bottom: 0;
	width: 90%;
	z-index: 10;
}
.myGoods{
	margin-top: 40rpx;
	margin-left: 50rpx;
	position: absolute;
	top: 40rpx;
	right: 40rpx;
}
.myname{
	font-weight: 600;
}
.myprice{
	margin-top: 10rpx;
	color: red;
}
.myspans{
	font-size: 35rpx;
	font-weight: 600;
	color: red;
}
.mytwo{
	width: 100%;
	border-bottom: 2rpx solid #F1F1F1;
	border-top: 2rpx solid #F1F1F1;
	margin-bottom: 10rpx;
	display: flex;
	flex-wrap: nowrap;
	justify-content: space-between;
	height: 110rpx;
}
.close{
	position: absolute;
	top: 10rpx;
	right: 20rpx;
}
.myqtys{
	margin: 0 30rpx;
	display: inline-block;
	transform: translateY(-5rpx);
	font-size: 30rpx;
}
.buy{
	margin: 35rpx 20rpx;
}
.buybtn{
	margin-top: 15rpx;
	margin-right: 40rpx;
}
.myspan{
	color: orange;
}
.popImage{
	width: 100%;
	margin: 20rpx auto;
	background-color: white;
	text-align: center;
	border-radius: 10rpx;
	padding-bottom: 10rpx;
}
.icon-shanchu{
	position: absolute;
	right: 0;
	top: -10;
	color: red;
}
.uni-uploader__file{
	position: relative;
}
.popImage{
	height: 400rpx;
	display: flex;
	flex-wrap: wrap;
}
.popImage input{
	width: 100%;
	border: #C0C0C0 1px solid;
	padding: 5rpx 0;
}
.cell-pd {
	padding: 22rpx 30rpx;
}
.btn{
	background-color: orange;
	font-size: 28rpx;
	width: 180rpx;
	height: 70rpx;
	line-height: 70rpx;
	margin: 40rpx auto;
	color: white;
	font-weight: 600;
}
.uploadBox{
	margin: 30rpx;
	font-size: 30rpx;
	font-weight: 600;
	background-color: white;
}
.three{
	background-color: white;
	width: 92%;
	border-radius: 10rpx;
	padding: 20rpx 0;
	margin: 20rpx auto;
}
</style>
