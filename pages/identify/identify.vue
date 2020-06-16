<template>
	<view>
		<template>
			<view class="bigBox">
				<view class="three">
					<view class="all">
						<view class="left">真实姓名</view>
						<input placeholder="请输入真实姓名" v-model="name" />
					</view>
					<view class="all">
						<view class="left">邮箱<span class="myspan">(非必须)</span></view>
						<input placeholder="请输入邮箱" v-model="email" />
					</view>
				</view>

				<!-- 上传身份证正反面照 -->
				<view class="popImage">
					<view class="uploadBox">上传身份证正/反面照</view>
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
										<view class="uni-uploader__input-box" v-if="imageList.length != 2">
											<view class="uni-uploader__input" @tap="chooseImage"></view>
										</view>
									</view>
								</view>
							</view>
						</view>
					</view>
					<button class="btn" @tap='save'>保存</button>
				</view>
			</view>
		</template>
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
				name:'',
				email:'',
				imageList: [],
				sourceTypeIndex: 2,
				sourceType: ['拍照', '相册', '拍照或相册'],
				sizeTypeIndex: 2,
				sizeType: ['压缩', '原图', '压缩或原图'],
				countIndex: 8,
				count: [1, 2],
				myData:{
					nickName:'',
					gender:'',
					code:'',
					avatarUrl:''
				},
				sessionId:'',
				uploadData:[]
			}
		},
		onLoad(option){
			this.sessionId = option.sessionId
		},
		methods: {
			// 选择图片
			chooseImage: async function() {
				if (this.imageList.length === 2) {
					return;	
				}
				uni.chooseImage({
					sourceType: sourceType[this.sourceTypeIndex],
					sizeType: sizeType[this.sizeTypeIndex],
					count: this.imageList.length + this.count[this.countIndex] > 2 ? 2 - this.imageList.length : this.count[this.countIndex],
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
				uni.uploadFile({
					url:'https://www.nssnail.com/file/uploadWxFile',
					filePath:url,
					name:'file',
					success: (res) => {
						var resdata = JSON.parse(res.data)
						this.uploadData.push(resdata.data)
						if(this.uploadData.length == this.imageList.length){
							uni.request({
								url:'https://www.nssnail.com/wx/saveIDImages',
								method:'POST',
								data:{
									fileList:this.uploadData,
									name:this.name,
									email:this.email,
									sessionId:this.sessionId
								},
								success: (res) => {
									if(res.data.stat == 1){
										uni.showToast({
											title:res.data.message,
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
			
			// 保存信息
			async save(){
				if(this.name=='' || this.imageList.length==0){
					uni.showToast({
						title:'请补全信息',
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
	margin: 30rpx;
	border-bottom: 2rpx solid #EEEEEE;
	display: flex;
	flex-wrap: nowrap;
}
.left{
	margin-bottom: 30rpx;
	margin-right: 100rpx;
	width: 200rpx;
}
.popImage{
	width:692rpx;
	height: 400rpx;
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
	width: 160rpx;
	height: 70rpx;
	line-height: 70rpx;
	margin-top: 40rpx;
	color: white;
	font-weight: 600;
}
.uploadBox{
	margin: 30rpx;
	font-size: 30rpx;
	font-weight: 500;
	background-color: white;
}
.three{
	background-color: white;
	width: 92%;
	border-radius: 10rpx;
	padding: 20rpx 0;
	margin: 20rpx auto;
}
.myspan{
	color: #BBBBBB;
	margin-left: 20rpx;
}
</style>
