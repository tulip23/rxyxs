import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({  
    state: {  
        userInfo: {},  
        hasLogin: false  
    },
    mutations: {
        login(state, provider) {//改变登录状态  
            state.hasLogin = true
            state.userInfo.avatarUrl = provider.avatarUrl  
            state.userInfo.gender = provider.gender
			state.userInfo.nickName = provider.nickName
			state.userInfo.sessionId = provider.sessionId
            uni.setStorage({//将用户信息保存在本地  
                key: 'userInfo',  
                data: provider
            })
        },  
        logout(state) {//退出登录  
            state.hasLogin = false  
            state.uerInfo = {}  
            uni.removeStorage({
                key: 'userInfo'  
            })  
        }  
    }  
});

export default store