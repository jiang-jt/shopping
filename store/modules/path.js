export default{
	state:{
		list:[
			// {
			// 	name:"张三",
			// 	tel:"12345678911",
			// 	city:"江西赣州会昌",
			// 	details:"大街44号",
			// 	postcode:"",
			// 	isdefault:false
			// },
			// {
			// 	name:"李四",
			// 	tel:"12345678911",
			// 	city:"江西赣州会昌",
			// 	details:"大街44号",
			// 	postcode:"",
			// 	isdefault:false
			// }
		]
	},
	getters:{
		defaultPath(state){
			return state.list.filter(item=>item.isdefault == 1)
		}
	},
	mutations:{
		// 初始化收货地址
		initAddress(state,list){
			state.list = list;
		},
		// 新增地址
		addAddr(state,obj){
			state.list.unshift(obj);
		},
		// 修改地址
		updateAddr(state,{index,item}){
			// 接收一个item对象对应下标,还有item对象
			for (let key in item) {
				state.list[index][key] = item[key];
			}
		},
		// 处理默认地址（唯一的）将之前所有的设为false
		updateDefault(state){
			state.list.forEach(item=>{
				if(item.isdefault){
					item.isdefault = false;
				}
			})
		}
	},
	actions:{
		addAddrFn({commit},obj){
			if(obj.isdefault){   // 始终只有一个默认地址
				commit("updateDefault");
			}
			commit("addAddr",obj);
		},
		updateAddrFn({commit},obj){
			if(obj.item.isdefault){   // 始终只有一个默认地址
				commit("updateDefault");
			}
			commit("updateAddr",obj);
		}
	}
}