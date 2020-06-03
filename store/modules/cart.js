export default {
	state: {
		list: [],
		checkedList: []
	},
	getters: {
		// 判断是否全选 
		checkedAll(state) {
			// 如果相同则表示已经全选了 :  判断是否全选
			return state.list.length === state.checkedList.length
		},
		// 合计和结算数量
		totalCount(state) {
			// 结算数量：通过判断checkedList存储的id数量去判断选中了几个
			// 合计:通过id去获取到list数据中的price然后相加
			let total = {
				pprice: 0.00,
				num: 0
			}
			state.list.forEach(item => {
				if (state.checkedList.indexOf(item.id) > -1) {
					total.pprice += item.pprice * item.num;
				}
				total.num = state.checkedList.length;
			})
			return total;

		}
	},
	mutations: {
		// 初始化购物车内容
		initCart(state, list) {
			state.list = list;
		},
		// 全选   ：改变list数据中的checked属性值为true
		checkAll(state) {
			state.checkedList = state.list.map(item => {
				item.checked = true;
				return item.id;
			})
		},
		// 取消全选
		unCheckAll(state) {
			state.list.forEach(item => {
				item.checked = false;
			})
			state.checkedList = [];
		},
		// 单选: 修改list内的checked
		checkedItem(state, index) {
			let id = state.list[index].id;
			let i = state.checkedList.indexOf(id);
			// 如果id在checkedList已经存在，这表示它之前是选中的，现在应该取消选中，并在checkedList中删除它
			if (i > -1) {
				state.list[index].checked = false;
				state.checkedList.splice(i, 1);
			} else {
				// 如果之前没有选中，则在checkedList中添加该id，并设置list[index].checked为true
				state.list[index].checked = true;
				state.checkedList.push(id);
			}
		},
		// 修改list中商品数量
		changeNumber(state, layload) {
			state.list[layload.index].num = layload.value;
		},
		// 删除商品
		delGoods(state) {
			state.list = state.list.filter(item => {
				return state.checkedList.indexOf(item.id);
			})
		},
		// 添加商品
		addShopCart(state, goods) {
			state.list.push(goods);
		}
	},
	actions: {
		// 全选或取消全选
		checkedAllFn({
			commit,
			getters
		}) {
			// 如果checkedAll返回的是true则表示全选了，再次触发则执行取消全选
			getters.checkedAll ? commit("unCheckAll") : commit("checkAll");
		},
		// 删除商品
		delGoodsFn({
			commit
		}) {
			commit("delGoods");
			commit("unCheckAll");
			uni.showToast({
				title: '删除成功',
				icon: 'none'
			})
		}
	}

}
