var express = require('express');
var router = express.Router();
var connection = require('../db/sql.js');
var user = require('../db/UserSql.js');
let jwt = require('jsonwebtoken');

router.all('*', function(req, res, next) {
	//设为指定的域
	res.header('Access-Control-Allow-Origin', "*");
	res.header("Access-Control-Allow-Headers", "X-Requested-With");
	res.header('Access-Control-Allow-Headers', 'Content-Type');
	res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
	res.header('Access-Control-Allow-Credentials', true);
	res.header("X-Powered-By", ' 3.2.1');
	next();
});

/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('index', {
		title: 'Express'
	});
});
// 支付成功调用
router.post('/api/payment', function(req, res, next) {
	let token = req.headers.token;
	let openid = jwt.decode(token).user;
	let listId = JSON.parse(req.body.listId); // 商品id

	// 验证token
	connection.query(`select * from user where openid='${openid}' OR userName='${openid}' OR phone='${openid}'`,
		function(error, results, fields) {
			if (results.length > 0) {
				for (var i = 0; i < listId.length; i++) {
					connection.query(`delete FROM goods_cart WHERE id=${listId[i]}`, function(er, ret) {

					})
				}
				res.send({
					data: {
						success: true,
						msg: '支付成功'
					}
				})
			} else {
				res.send({
					data: {
						success: false,
						msg: '还没登录'
					}
				})
			}
		})



})
// 添加购物车
router.post('/api/addCart', function(req, res, next) {
	let token = req.headers.token;
	let openid = jwt.decode(token).user;
	let id = req.body.id; // 商品id
	let num = req.body.num; // 商品数量
	// 验证token
	connection.query(`select * from user where openid='${openid}' OR userName='${openid}' OR phone='${openid}'`,
		function(error, results, fields) {
			if (results.length > 0) {
				let userId = results[0].id; // userId
				// 查询商品的详细信息
				connection.query(`select * from commoditylist where id='${id}'`, function(er, ret) {
					let name = ret[0].name;
					let imgUrl = ret[0].imgUrl;
					let pprice = ret[0].pprice;
					let goodsId = ret[0].id;
					// 然后根据商品id和用户id去查询购物车表
					connection.query(`select * from goods_cart where uid='${userId}' and goodsId='${goodsId}'`, function(e, r) {
						if (r.length > 0) { // 如果购物车有，则添加商品数量
							let val = parseInt(num) + parseInt(r[0].num); // 商品数量
							let cartId = r[0].id; // 购物车记录id
							connection.query(`update goods_cart set num='${val}' where id='${cartId}'`, function(err, re) {
								res.send({
									data: {
										success: true,
										msg: '添加成功'
									}
								})
							})
						} else { // 如果购物车没有，则添加一条购物车记录
							let sql =
								`insert into goods_cart (uid,goodsId,name,imgUrl,pprice,num) values (${userId},${goodsId},'${name}','${imgUrl}','${pprice}','${num}')`;
							connection.query(sql, function(err, re) {
								res.send({
									data: {
										success: true,
										msg: '添加成功'
									}
								})
							})
						}
					})
				})
			} else {
				res.send({
					data: {
						success: false,
						msg: '还没登录'
					}
				})
			}
		})
})
// 修改购物车数量
router.post('/api/updateNumCart', function(req, res, next) {
	let token = req.headers.token;
	let openid = jwt.decode(token).user;
	let id = req.body.id;
	let num = req.body.num;
	// 验证token
	connection.query(`select * from user where openid='${openid}' OR userName='${openid}' OR phone='${openid}'`,
		function(error, results, fields) {
			if (results.length > 0) {
				let userId = results[0].id; // userId
				connection.query(`update goods_cart set num='${num}' where id=${id} and uid='${userId}'`, function(error,
					results, fields) {
					res.send({
						data: {
							success: true,
							msg: '修改成功'
						}
					})
				})
			} else {
				res.send({
					data: {
						success: false,
						msg: '还没登录'
					}
				})
			}
		})
})
// 获取购物车数据
router.post('/api/getCart', function(req, res, next) {
	let token = req.headers.token;
	let openid = jwt.decode(token).user;
	// 根据传入的token解码出来的openid去查询userId
	connection.query(`select * from user where openid='${openid}' OR userName='${openid}' OR phone='${openid}'`,
		function(error, results, fields) {
			if (results.length > 0) {
				let userId = results[0].id; // userId
				// 查询userId对应的购物车数据
				connection.query(`select * from goods_cart where uid='${userId}'`, function(e, r) {
					res.send({
						data: {
							success: true,
							data: r
						}
					})
				})
			} else {
				res.send({
					data: {
						success: false,
						msg: '还没登录'
					}
				})
			}
		})
})
// 修改收货地址
router.post('/api/updateAddress', function(req, res, next) {
	let token = req.headers.token;
	let openid = jwt.decode(token).user;
	let name = req.body.name; // 收货人
	let tel = req.body.tel; // 号码
	let province = req.body.province; // 省 
	let city = req.body.city; // 市
	let district = req.body.district; //区
	let address = req.body.address; //详细地址
	let postcode = req.body.postcode; // 邮编
	let isdefault = req.body.isdefault;
	let id = req.body.id; // 收货地址id
	// 根据传入的token解码出来的openid去查询userId
	connection.query(`select * from user where openid='${openid}' OR userName='${openid}' OR phone='${openid}'`,
		function(error, results, fields) {
			if (results.length > 0) {
				let userId = results[0].id; // userId
				if (isdefault == 1) {
					// 在插入收货地址前
					let selectSql = `select * from address where userId='${userId}' and isdefault=${isdefault}`;
					connection.query(selectSql, function(e, r) {
						if (r.length > 0) {
							let addrId = r[0].id;
							// 将之前的默认地址归0
							connection.query(`update address set isdefault=0 where id=${addrId}`, function(error, results, fields) {

							})
						}
					})
				}

				let updateSql =
					`update address set name='${name}',tel='${tel}',province='${province}',city='${city}',district='${district}',address='${address}',isdefault='${isdefault}',postcode='${postcode}' where id='${id}'`;
				connection.query(updateSql, function(err, r, f) {
					res.send({
						data: {
							success: true,
							msg: '修改成功'
						}
					})
				})
			} else {
				res.send({
					data: {
						success: false,
						msg: '还没登录'
					}
				})
			}
		})
})
// 新增收货地址
router.post('/api/addAddress', function(req, res, next) {
	let token = req.headers.token;
	let userId = jwt.decode(token).user;
	let name = req.body.name; // 收货人
	let tel = req.body.tel; // 号码
	let province = req.body.province; // 省 
	let city = req.body.city; // 市
	let district = req.body.district; //区
	let address = req.body.address; //详细地址
	let postcode = req.body.postcode; // 邮编
	let isdefault = req.body.isdefault;
	connection.query(`select * from user where openid='${userId}' OR userName='${userId}' OR phone='${userId}'`,
		function(error, results, fields) {
			if (results.length > 0) {
				let id = results[0].id; //userId
				if (isdefault == 1) {
					// 在插入收货地址前
					let selectSql = `select * from address where userId='${id}' and isdefault=${isdefault}`;
					connection.query(selectSql, function(e, r) {
						if (r.length > 0) {
							let addrId = r[0].id;
							// 将之前的默认地址归0
							connection.query(`update address set isdefault=0 where id=${addrId}`, function(error, results, fields) {

							})
						}
					})
				}
				// 开始新增收货地址
				let insertSql =
					`insert into address (name,tel,province,city,district,address,userId,isdefault,postcode) values ('${name}','${tel}','${province}','${city}','${district}','${address}','${id}',${isdefault},'${postcode}')`
				console.log(insertSql);
				connection.query(insertSql, function(err, r, f) {
					res.send({
						data: {
							success: true,
							msg: '添加成功'
						}
					})
				})
			} else {
				res.send({
					data: {
						success: false,
						msg: '还未登录'
					}
				})
			}
		})
})

// 查询收货地址
router.post('/api/selectAddress', function(req, res, next) {
	let token = req.headers.token;

	let userId = jwt.decode(token).user
	connection.query(`select * from user where openid='${userId}' OR userName='${userId}' OR phone='${userId}'`,
		function(error, results, fields) {
			if (results.length > 0) {
				let id = results[0].id;
				connection.query(`select * from address where userId=${id}`, function(err, r, f) {
					if (r.length > 0) {
						res.send({
							data: {
								success: true,
								data: r
							}
						})
					} else {
						res.send({
							data: {
								success: false,
								msg: "暂无收货地址"
							}
						})
					}
				})
			} else {
				res.send({
					data: {
						success: false,
						msg: token
					}
				})
			}
		})
})


// 第三方登陆
router.post('/api/loginother', function(req, res, next) {
	let param = {
		provider: req.body.provider,
		openid: req.body.openid,
		nickName: req.body.nickName,
		avatarUrl: req.body.avatarUrl
	}
	// 判断数据库中是否存在该用户
	console.log(user.queryUserName(param));

	connection.query(user.queryUserName(param), function(error, results, fields) {
		console.log(results);
		if (results.length > 0) {
			// 存在， 读取
			res.send({
				data: {
					success: true,
					data: results[0]
				}
			})
		} else {
			// 不存在，存储，读取
			connection.query(user.insertData(param), function(eor, rlt, fi) {
				connection.query(user.queryUserName(param), function(e, r, f) {
					if (r.length > 0) {
						res.send({
							data: {
								success: true,
								data: r[0]
							}
						})
					}
				})
			})
		}
	})

})

// 增加用户
router.post('/api/addUser', function(req, res, next) {
	let param = {
		userName: req.body.userName, // 手机号
		userCode: req.body.code
	}
	if (param.userCode == '1234') {
		connection.query(user.insertData(param), function(error, results, fields) {
			// 增加成功之后去数据库中查询，然后返回给前端，前端调用一个mutations方法给vuex中增加用户信息，表示用户已经登录
			connection.query(user.queryUserName(param), function(error, results, fields) {
				if (results.length > 0) {
					res.send({
						data: {
							success: true,
							msg: '注册成功',
							data: results
						}
					})
				}
			})
		})
	}
})


// 发送验证码
router.post('/api/code', function(req, res, next) {
	// 前端给后端的数据
	let param = {
		userName: req.body.phone
	}
	// 未能接入短信SDK，这里使用统一验证码1234
	res.send({
		data: {
			success: true,
			code: '1234'
		}
	})
})

// 验证手机号是否存在
router.post('/api/regist', function(req, res, next) {
	// 前端给后端的数据
	let param = {
		userName: req.body.phone
	}
	connection.query(user.queryUserName(param), function(error, results, fields) {
		if (results.length > 0) {
			res.send({
				data: {
					success: false,
					msg: "该手机号已注册"
				}
			})
		} else {
			res.send({
				data: {
					success: true
				}
			})
		}
	})
})

// 用户登录
router.post('/api/login', function(req, res, next) {
	// 前端给后端的数据
	let param = {
		userName: req.body.userName,
		userPwd: req.body.userPwd
	}
	connection.query(user.queryUserName(param), function(error, results, fields) {
		if (results.length > 0) { //如果存在用户名,则去验证密码
			connection.query(user.queryUserPwd(param), function(error, results, fields) {

				if (results.length > 0) {
					res.send({
						data: {
							success: true,
							msg: "登录成功",
							data: results[0]
						}
					})
				} else {
					res.send({
						data: {
							success: false,
							msg: "密码不正确"
						}
					})
				}
			})
		} else {
			res.send({
				data: {
					success: false,
					msg: "用户名或手机号不存在"
				}
			})
		}
	});
});

// 根据商品id查询商品详情
router.get('/api/goods/id', function(req, res, next) {
	let id = req.query.id;

	let sql = `select * from commodityList where id=${id}`;
	connection.query(sql, function(error, results, fields) {
		if (error) throw error;
		res.json({
			code: "0",
			data: results
		})
	});

});
// 商品列表查询
router.get('/api/goods/list', function(req, res, next) {
	res.json({
		code: '0',
		data: [{
				id: 1,
				name: '家居家纺',
				data: [{
						name: '家纺',
						list: [{
								id: 1,
								name: '毛巾/浴巾',
								imgUrl: '../../static/img/hot2.jpg'
							},
							{
								id: 2,
								name: '被子',
								imgUrl: '../../static/img/hot2.jpg'
							},
							{
								id: 1,
								name: '被套',
								imgUrl: '../../static/img/hot2.jpg'
							}
						]
					},
					{
						name: '生活用品',
						list: [{
								id: 1,
								name: '浴室用品',
								imgUrl: '../../static/img/hot2.jpg'
							},
							{
								id: 2,
								name: '洗晒/熨烫',
								imgUrl: '../../static/img/hot2.jpg'
							},
							{
								id: 1,
								name: '净化除味',
								imgUrl: '../../static/img/hot2.jpg'
							}
						]
					}
				]
			},
			{
				id: 2,
				name: '女装',
				data: [{
						name: '裙装/套装',
						list: [{
								id: 1,
								name: '半身裙',
								imgUrl: '../../static/img/hot2.jpg'
							},
							{
								id: 2,
								name: '连衣裙',
								imgUrl: '../../static/img/hot2.jpg'
							},
							{
								id: 3,
								name: '吊带',
								imgUrl: '../../static/img/hot2.jpg'
							}
						]
					},
					{
						name: '上衣',
						list: [{
								id: 1,
								name: 'T恤/打底衬',
								imgUrl: '../../static/img/hot2.jpg'
							},
							{
								id: 2,
								name: '衬衫',
								imgUrl: '../../static/img/hot2.jpg'
							},
							{
								id: 3,
								name: '针织衫',
								imgUrl: '../../static/img/hot2.jpg'
							}
						]
					}
				]
			}
		]
	})
});

// 商品关键字查询
router.get('/api/goods/search', function(req, res, next) {

	// req.query ：获取前端GET请求传参
	// desc : 降序     asc：升序

	// 结构赋值  ,获取对象的key
	let [goodsName, orderName] = Object.keys(req.query);
	// name 参数的值
	let name = req.query.name;
	// orderName的key的值
	let order = req.query[orderName];

	let sql = `select * from commodityList where name like '%${name}%' order by ${orderName} ${order}`;

	connection.query(sql, function(error, results, fields) {
		if (error) throw error;
		res.json({
			code: "0",
			data: results
		})
	});
});

// 运动户外第二次触底的数据
router.get('/api/index_list/2/data/3', function(req, res, next) {
	res.json({
		code: 0,
		data: [{
			type: "commodityList", // 商品列表   
			data: [{
					id: 1,
					imgUrl: "https://gw.alicdn.com/bao/uploaded/TB16P5YoaQoBKNjSZJnSuuw9VXa.jpg",
					name: "凯赛尔秋冬时尚男运动长裤大码宽松舒适直筒裤休闲裤加绒保暖裤",
					pprice: "69.00",
					oprice: "399",
					discount: "7"
				},
				{
					id: 2,
					imgUrl: "https://gw.alicdn.com/bao/uploaded/i4/744406455/TB2wHDGnpXXXXcdXXXXXXXXXXXX-744406455.jpg",
					name: "正品阿迪达斯男鞋新款防滑游泳沙滩鞋一字型凉拖鞋AQ4935 G14309",
					pprice: "119.46",
					oprice: "399",
					discount: "7"
				},
				{
					id: 3,
					imgUrl: "https://gw.alicdn.com/bao/uploaded/TB15XJdbXmWBuNjSspdSuvugXXa.jpg",
					name: "李宁羽毛球服男女款运动短裤夏休闲短裤速干抽绳松紧带 正品特价",
					pprice: "78.00",
					oprice: "199",
					discount: "7"
				},
				{
					id: 4,
					imgUrl: "https://gw.alicdn.com/tfscom/https://img.alicdn.com/imgextra/i2/2642412269/O1CN014XAiW21SdFBUPXG9g_!!2642412269-0-beehive-scenes.jpg",
					name: "19SS Adidas Y-3 Kaiwa 全皮 薄荷绿 F97414 F97424 复古运动鞋",
					pprice: "2299.00",
					oprice: "3399",
					discount: "7"
				}
			]
		}]
	})
})
// 运动户外第一次触底的数据
router.get('/api/index_list/2/data/2', function(req, res, next) {
	res.json({
		code: 0,
		data: [{
			type: "commodityList", // 商品列表   
			data: [{
					id: 1,
					imgUrl: "../../static/img/commodity1.jpg",
					name: "稻草人（MEXICAN）工装裤男 潮牌百搭休闲裤男士宽松显瘦束脚长裤子男 9F121190145 深灰 31/XL",
					pprice: "299",
					oprice: "399",
					discount: "7"
				},
				{
					id: 2,
					imgUrl: "../../static/img/commodity2.jpg",
					name: "稻草人（MEXICAN）工装裤男 潮牌百搭休闲裤男士宽松显瘦束脚长裤子男 9F121190145 深灰 31/XL",
					pprice: "299",
					oprice: "399",
					discount: "7"
				},
				{
					id: 3,
					imgUrl: "../../static/img/commodity3.jpg",
					name: "稻草人（MEXICAN）工装裤男 潮牌百搭休闲裤男士宽松显瘦束脚长裤子男 9F121190145 深灰 31/XL",
					pprice: "299",
					oprice: "399",
					discount: "7"
				},
				{
					id: 4,
					imgUrl: "../../static/img/commodity4.jpg",
					name: "稻草人（MEXICAN）工装裤男 潮牌百搭休闲裤男士宽松显瘦束脚长裤子男 9F121190145 深灰 31/XL",
					pprice: "299",
					oprice: "399",
					discount: "7"
				}
			]
		}]
	})
})

// 运动户外第一次加载的数据
router.get('/api/index_list/2/data/1', function(req, res, next) {
	res.json({
		code: 0,
		data: [{
				type: 'bannerList',
				data: "../../static/img/banner1.jpg"
			},
			{
				type: 'iconList',
				data: [{
						imgUrl: "https://gw.alicdn.com/tfscom/img.alicdn.com/imgextra/i1/1022433859/O1CN01H5FIY21eNSxGgthLj_!!1022433859-0-beehive-scenes.jpg",
						name: "跑步鞋"
					},
					{
						imgUrl: "https://gw.alicdn.com/tfscom/https://img.alicdn.com/imgextra/i4/2689779491/O1CN01eCUUdR2JyvbHi2lKz_!!2689779491-0-daren.jpg",
						name: "篮球鞋"
					},
					{
						imgUrl: "https://gw.alicdn.com/tfscom/https://img.alicdn.com/imgextra/i1/371832545/O1CN01UKYoRa1UfeUeQNSqc_!!371832545-0-beehive-scenes.jpg",
						name: "运动休闲鞋"
					},
					{
						imgUrl: "https://g-search1.alicdn.com/img/bao/uploaded/i4/i1/2128794607/O1CN01MRrMEH1ju3Gwgm8Ks_!!2128794607-0-lubanu-s.jpg_580x580Q90.jpg_.webp",
						name: "户外鞋"
					},
					{
						imgUrl: "https://g-search1.alicdn.com/img/bao/uploaded/i4/imgextra/i2/130992440/O1CN01uOMjV91TtZ0BFA1By_!!0-saturn_solar.jpg_580x580Q90.jpg_.webp",
						name: "运动T恤"
					},
					{
						imgUrl: "https://g-search2.alicdn.com/img/bao/uploaded/i4/i1/2047509713/O1CN01ROm7Uf2LcbZQqwW2R_!!0-item_pic.jpg_580x580Q90.jpg_.webp",
						name: "夹克/连帽衫"
					},
					{
						imgUrl: "https://g-search3.alicdn.com/img/bao/uploaded/i4/i1/290233363/O1CN01g9QQ9T1aiIZUIIbLv_!!290233363.jpg_580x580Q90.jpg_.webp",
						name: "运动裤"
					},
					{
						imgUrl: "https://g-search1.alicdn.com/img/bao/uploaded/i4/i1/867798359/TB1ilgMyhGYBuNjy0FnXXX5lpXa_!!0-item_pic.jpg_580x580Q90.jpg_.webp",
						name: "冲锋衣裤"
					},
				]
			},
			{
				type: 'superStarList',
				data: [{
						imgUrl: "https://g-search1.alicdn.com/img/bao/uploaded/i4/i1/72866060/O1CN01pERrT31udWf9mnm8h_!!72866060.jpg_580x580Q90.jpg_.webp"
					},
					{
						imgUrl: "https://g-search3.alicdn.com/img/bao/uploaded/i4/i1/890482188/O1CN01fWRn9A1S29C4W5wSc_!!890482188.jpg_580x580Q90.jpg_.webp"
					},
					{
						imgUrl: "https://img.adidas.com.cn/resources/2020/5/21/15900332642156326.jpg?x-oss-process=image/resize,m_pad,w_230,h_230,limit_0,color_ffffff"
					},
					{
						imgUrl: "https://uxresources.baozun.com/prod/88000060/20200311/8C9D3A2E3879E75227D5919DAC142332.jpg?x-oss-process=image/resize,m_fill,h_240,w_240"
					},
					{
						imgUrl: "https://img3.vans.com.cn/public/images/bc/36/a9/e4842e6ca33ccdbe810196f3e9061aa821ab2cb4.jpg?1584349882#h"
					},
					{
						imgUrl: "https://img11.360buyimg.com/n5/jfs/t1/56386/40/12200/94600/5d919142E6340b649/78b283cf0aad5609.jpg"
					},
					{
						imgUrl: "https://img.adidas.com.cn/resources/2017/9/15/15054454278346786_230X230.jpg"
					},
					{
						imgUrl: "https://uxresources.baozun.com/prod/88000060/20200426/2A722C15313D4ABCE338632B5A2A717A.jpg?x-oss-process=image/resize,m_fill,h_240,w_240"
					}
				]
			},
			{
				type: 'hotList',
				data: [{
						id: 1,
						imgUrl: "../../static/img/hot1.jpg",
						name: "发送到发大发大东方发送到发大发大东方发送到发大发大东方发送到发大发大东方发送到发大发大东方发送到发大发大东方",
						pprice: "299",
						oprice: "399",
						discount: "7"
					},
					{
						id: 2,
						imgUrl: "../../static/img/hot2.jpg",
						name: "发送到发大发大东方发送到发大发大东方发送到发大发大东方发送到发大发大东方发送到发大发大东方发送到发大发大东方",
						pprice: "299",
						oprice: "399",
						discount: "7"
					},
					{
						id: 3,
						imgUrl: "../../static/img/hot3.jpg",
						name: "发送到发大发大东方发送到发大发大东方发送到发大发大东方发送到发大发大东方发送到发大发大东方发送到发大发大东方",
						pprice: "299",
						oprice: "399",
						discount: "7"
					},
					{
						id: 4,
						imgUrl: "../../static/img/hot1.jpg",
						name: "发送到发大发大东方发送到发大发大东方发送到发大发大东方发送到发大发大东方发送到发大发大东方发送到发大发大东方",
						pprice: "299",
						oprice: "399",
						discount: "7"
					},
					{
						id: 5,
						imgUrl: "../../static/img/hot2.jpg",
						name: "发送到发大发大东方发送到发大发大东方发送到发大发大东方发送到发大发大东方发送到发大发大东方发送到发大发大东方",
						pprice: "299",
						oprice: "399",
						discount: "7"
					},
					{
						id: 6,
						imgUrl: "../../static/img/hot3.jpg",
						name: "发送到发大发大东方发送到发大发大东方发送到发大发大东方发送到发大发大东方发送到发大发大东方发送到发大发大东方",
						pprice: "299",
						oprice: "399",
						discount: "7"
					}
				]
			},
			{
				type: 'shopList',
				data: [{
					bigUrl: "../../static/img/shop.jpg",
					data: [{
							id: 1,
							imgUrl: "../../static/img/shop1.jpg",
							name: "发送到发大发大东方发送到发大发大东方发送到发大发大东方发送到发大发大东方发送到发大发大东方发送到发大发大东方",
							pprice: "299",
							oprice: "399",
							discount: "7"
						},
						{
							id: 2,
							imgUrl: "../../static/img/shop2.jpg",
							name: "发送到发大发大东方发送到发大发大东方发送到发大发大东方发送到发大发大东方发送到发大发大东方发送到发大发大东方",
							pprice: "299",
							oprice: "399",
							discount: "7"
						},
						{
							id: 3,
							imgUrl: "../../static/img/shop3.jpg",
							name: "发送到发大发大东方发送到发大发大东方发送到发大发大东方发送到发大发大东方发送到发大发大东方发送到发大发大东方",
							pprice: "299",
							oprice: "399",
							discount: "7"
						},
						{
							id: 4,
							imgUrl: "../../static/img/shop4.jpg",
							name: "发送到发大发大东方发送到发大发大东方发送到发大发大东方发送到发大发大东方发送到发大发大东方发送到发大发大东方",
							pprice: "299",
							oprice: "399",
							discount: "7"
						}, {
							id: 5,
							imgUrl: "../../static/img/shop1.jpg",
							name: "发送到发大发大东方发送到发大发大东方发送到发大发大东方发送到发大发大东方发送到发大发大东方发送到发大发大东方",
							pprice: "299",
							oprice: "399",
							discount: "7"
						},
						{
							id: 6,
							imgUrl: "../../static/img/shop2.jpg",
							name: "发送到发大发大东方发送到发大发大东方发送到发大发大东方发送到发大发大东方发送到发大发大东方发送到发大发大东方",
							pprice: "299",
							oprice: "399",
							discount: "7"
						},
						{
							id: 7,
							imgUrl: "../../static/img/shop3.jpg",
							name: "发送到发大发大东方发送到发大发大东方发送到发大发大东方发送到发大发大东方发送到发大发大东方发送到发大发大东方",
							pprice: "299",
							oprice: "399",
							discount: "7"
						},
						{
							id: 8,
							imgUrl: "../../static/img/shop4.jpg",
							name: "发送到发大发大东方发送到发大发大东方发送到发大发大东方发送到发大发大东方发送到发大发大东方发送到发大发大东方",
							pprice: "299",
							oprice: "399",
							discount: "7"
						}
					]
				}]
			},
			{
				type: 'commodityList',
				data: [{
						id: 1,
						imgUrl: "../../static/img/commodity1.jpg",
						name: "稻草人（MEXICAN）工装裤男 潮牌百搭休闲裤男士宽松显瘦束脚长裤子男 9F121190145 深灰 31/XL",
						pprice: "299",
						oprice: "399",
						discount: "7"
					},
					{
						id: 2,
						imgUrl: "../../static/img/commodity2.jpg",
						name: "稻草人（MEXICAN）工装裤男 潮牌百搭休闲裤男士宽松显瘦束脚长裤子男 9F121190145 深灰 31/XL",
						pprice: "299",
						oprice: "399",
						discount: "7"
					},
					{
						id: 3,
						imgUrl: "../../static/img/commodity3.jpg",
						name: "稻草人（MEXICAN）工装裤男 潮牌百搭休闲裤男士宽松显瘦束脚长裤子男 9F121190145 深灰 31/XL",
						pprice: "299",
						oprice: "399",
						discount: "7"
					},
					{
						id: 4,
						imgUrl: "../../static/img/commodity4.jpg",
						name: "稻草人（MEXICAN）工装裤男 潮牌百搭休闲裤男士宽松显瘦束脚长裤子男 9F121190145 深灰 31/XL",
						pprice: "299",
						oprice: "399",
						discount: "7"
					}
				]
			},
		]
	})
});

// 服饰内衣第一次加载的数据
router.get('/api/index_list/3/data/1', function(req, res, next) {
	res.json({
		code: 0,
		data: [{
				type: 'bannerList',
				data: "../../static/img/banner1.jpg"
			},
			{
				type: 'iconList',
				data: [{
						imgUrl: "../../static/img/icons1.png",
						name: "服饰内衣"
					},
					{
						imgUrl: "../../static/img/icons2.png",
						name: "跑步鞋"
					},
					{
						imgUrl: "../../static/img/icons3.png",
						name: "跑步鞋"
					},
					{
						imgUrl: "../../static/img/icons4.png",
						name: "跑步鞋"
					},
					{
						imgUrl: "../../static/img/icons5.png",
						name: "跑步鞋"
					},
					{
						imgUrl: "../../static/img/icons6.png",
						name: "跑步鞋"
					},
					{
						imgUrl: "../../static/img/icons7.png",
						name: "跑步鞋"
					},
					{
						imgUrl: "../../static/img/icons8.png",
						name: "跑步鞋"
					},
				]
			},
			{
				type: 'superStarList',
				data: [{
						imgUrl: "../../static/img/Children1.jpg"
					},
					{
						imgUrl: "../../static/img/Children1.jpg"
					},
					{
						imgUrl: "../../static/img/Children1.jpg"
					},
					{
						imgUrl: "../../static/img/Children1.jpg"
					},
					{
						imgUrl: "../../static/img/Children1.jpg"
					},
					{
						imgUrl: "../../static/img/Children1.jpg"
					},
					{
						imgUrl: "../../static/img/Children1.jpg"
					},
					{
						imgUrl: "../../static/img/Children1.jpg"
					}
				]
			},
			{
				type: 'hotList',
				data: [{
						id: 1,
						imgUrl: "../../static/img/hot1.jpg",
						name: "发送到发大发大东方发送到发大发大东方发送到发大发大东方发送到发大发大东方发送到发大发大东方发送到发大发大东方",
						pprice: "299",
						oprice: "399",
						discount: "7"
					},
					{
						id: 2,
						imgUrl: "../../static/img/hot2.jpg",
						name: "发送到发大发大东方发送到发大发大东方发送到发大发大东方发送到发大发大东方发送到发大发大东方发送到发大发大东方",
						pprice: "299",
						oprice: "399",
						discount: "7"
					},
					{
						id: 3,
						imgUrl: "../../static/img/hot3.jpg",
						name: "发送到发大发大东方发送到发大发大东方发送到发大发大东方发送到发大发大东方发送到发大发大东方发送到发大发大东方",
						pprice: "299",
						oprice: "399",
						discount: "7"
					},
					{
						id: 4,
						imgUrl: "../../static/img/hot1.jpg",
						name: "发送到发大发大东方发送到发大发大东方发送到发大发大东方发送到发大发大东方发送到发大发大东方发送到发大发大东方",
						pprice: "299",
						oprice: "399",
						discount: "7"
					},
					{
						id: 5,
						imgUrl: "../../static/img/hot2.jpg",
						name: "发送到发大发大东方发送到发大发大东方发送到发大发大东方发送到发大发大东方发送到发大发大东方发送到发大发大东方",
						pprice: "299",
						oprice: "399",
						discount: "7"
					},
					{
						id: 6,
						imgUrl: "../../static/img/hot3.jpg",
						name: "发送到发大发大东方发送到发大发大东方发送到发大发大东方发送到发大发大东方发送到发大发大东方发送到发大发大东方",
						pprice: "299",
						oprice: "399",
						discount: "7"
					}
				]
			},
			{
				type: 'shopList',
				data: [{
					bigUrl: "../../static/img/shop.jpg",
					data: [{
							id: 1,
							imgUrl: "../../static/img/shop1.jpg",
							name: "发送到发大发大东方发送到发大发大东方发送到发大发大东方发送到发大发大东方发送到发大发大东方发送到发大发大东方",
							pprice: "299",
							oprice: "399",
							discount: "7"
						},
						{
							id: 2,
							imgUrl: "../../static/img/shop2.jpg",
							name: "发送到发大发大东方发送到发大发大东方发送到发大发大东方发送到发大发大东方发送到发大发大东方发送到发大发大东方",
							pprice: "299",
							oprice: "399",
							discount: "7"
						},
						{
							id: 3,
							imgUrl: "../../static/img/shop3.jpg",
							name: "发送到发大发大东方发送到发大发大东方发送到发大发大东方发送到发大发大东方发送到发大发大东方发送到发大发大东方",
							pprice: "299",
							oprice: "399",
							discount: "7"
						},
						{
							id: 4,
							imgUrl: "../../static/img/shop4.jpg",
							name: "发送到发大发大东方发送到发大发大东方发送到发大发大东方发送到发大发大东方发送到发大发大东方发送到发大发大东方",
							pprice: "299",
							oprice: "399",
							discount: "7"
						}, {
							id: 5,
							imgUrl: "../../static/img/shop1.jpg",
							name: "发送到发大发大东方发送到发大发大东方发送到发大发大东方发送到发大发大东方发送到发大发大东方发送到发大发大东方",
							pprice: "299",
							oprice: "399",
							discount: "7"
						},
						{
							id: 6,
							imgUrl: "../../static/img/shop2.jpg",
							name: "发送到发大发大东方发送到发大发大东方发送到发大发大东方发送到发大发大东方发送到发大发大东方发送到发大发大东方",
							pprice: "299",
							oprice: "399",
							discount: "7"
						},
						{
							id: 7,
							imgUrl: "../../static/img/shop3.jpg",
							name: "发送到发大发大东方发送到发大发大东方发送到发大发大东方发送到发大发大东方发送到发大发大东方发送到发大发大东方",
							pprice: "299",
							oprice: "399",
							discount: "7"
						},
						{
							id: 8,
							imgUrl: "../../static/img/shop4.jpg",
							name: "发送到发大发大东方发送到发大发大东方发送到发大发大东方发送到发大发大东方发送到发大发大东方发送到发大发大东方",
							pprice: "299",
							oprice: "399",
							discount: "7"
						}
					]
				}]
			},
			{
				type: 'commodityList',
				data: [{
						id: 1,
						imgUrl: "../../static/img/commodity1.jpg",
						name: "稻草人（MEXICAN）工装裤男 潮牌百搭休闲裤男士宽松显瘦束脚长裤子男 9F121190145 深灰 31/XL",
						pprice: "299",
						oprice: "399",
						discount: "7"
					},
					{
						id: 2,
						imgUrl: "../../static/img/commodity2.jpg",
						name: "稻草人（MEXICAN）工装裤男 潮牌百搭休闲裤男士宽松显瘦束脚长裤子男 9F121190145 深灰 31/XL",
						pprice: "299",
						oprice: "399",
						discount: "7"
					},
					{
						id: 3,
						imgUrl: "../../static/img/commodity3.jpg",
						name: "稻草人（MEXICAN）工装裤男 潮牌百搭休闲裤男士宽松显瘦束脚长裤子男 9F121190145 深灰 31/XL",
						pprice: "299",
						oprice: "399",
						discount: "7"
					},
					{
						id: 4,
						imgUrl: "../../static/img/commodity4.jpg",
						name: "稻草人（MEXICAN）工装裤男 潮牌百搭休闲裤男士宽松显瘦束脚长裤子男 9F121190145 深灰 31/XL",
						pprice: "299",
						oprice: "399",
						discount: "7"
					}
				]
			},
		]
	})
});

// 首页推荐第一次触底的数据
router.get('/api/index_list/1/data/2', function(req, res, next) {
	res.json({
		code: 0,
		data: [{
			type: "commodityList", // 商品列表   
			data: [{
					id: 1,
					imgUrl: "../../static/img/commodity1.jpg",
					name: "稻草人（MEXICAN）工装裤男 潮牌百搭休闲裤男士宽松显瘦束脚长裤子男 9F121190145 深灰 31/XL",
					pprice: "299",
					oprice: "399",
					discount: "7"
				},
				{
					id: 2,
					imgUrl: "../../static/img/commodity2.jpg",
					name: "稻草人（MEXICAN）工装裤男 潮牌百搭休闲裤男士宽松显瘦束脚长裤子男 9F121190145 深灰 31/XL",
					pprice: "299",
					oprice: "399",
					discount: "7"
				},
				{
					id: 3,
					imgUrl: "../../static/img/commodity3.jpg",
					name: "稻草人（MEXICAN）工装裤男 潮牌百搭休闲裤男士宽松显瘦束脚长裤子男 9F121190145 深灰 31/XL",
					pprice: "299",
					oprice: "399",
					discount: "7"
				},
				{
					id: 4,
					imgUrl: "../../static/img/commodity4.jpg",
					name: "稻草人（MEXICAN）工装裤男 潮牌百搭休闲裤男士宽松显瘦束脚长裤子男 9F121190145 深灰 31/XL",
					pprice: "299",
					oprice: "399",
					discount: "7"
				},
				{
					id: 5,
					imgUrl: "../../static/img/commodity1.jpg",
					name: "稻草人（MEXICAN）工装裤男 潮牌百搭休闲裤男士宽松显瘦束脚长裤子男 9F121190145 深灰 31/XL",
					pprice: "299",
					oprice: "399",
					discount: "7"
				},
				{
					id: 6,
					imgUrl: "../../static/img/commodity2.jpg",
					name: "稻草人（MEXICAN）工装裤男 潮牌百搭休闲裤男士宽松显瘦束脚长裤子男 9F121190145 深灰 31/XL",
					pprice: "299",
					oprice: "399",
					discount: "7"
				},
				{
					id: 7,
					imgUrl: "../../static/img/commodity3.jpg",
					name: "稻草人（MEXICAN）工装裤男 潮牌百搭休闲裤男士宽松显瘦束脚长裤子男 9F121190145 深灰 31/XL",
					pprice: "299",
					oprice: "399",
					discount: "7"
				},
				{
					id: 8,
					imgUrl: "../../static/img/commodity4.jpg",
					name: "稻草人（MEXICAN）工装裤男 潮牌百搭休闲裤男士宽松显瘦束脚长裤子男 9F121190145 深灰 31/XL",
					pprice: "299",
					oprice: "399",
					discount: "7"
				}, {
					id: 9,
					imgUrl: "../../static/img/commodity1.jpg",
					name: "稻草人（MEXICAN）工装裤男 潮牌百搭休闲裤男士宽松显瘦束脚长裤子男 9F121190145 深灰 31/XL",
					pprice: "299",
					oprice: "399",
					discount: "7"
				},
				{
					id: 10,
					imgUrl: "../../static/img/commodity2.jpg",
					name: "稻草人（MEXICAN）工装裤男 潮牌百搭休闲裤男士宽松显瘦束脚长裤子男 9F121190145 深灰 31/XL",
					pprice: "299",
					oprice: "399",
					discount: "7"
				},
				{
					id: 11,
					imgUrl: "../../static/img/commodity3.jpg",
					name: "稻草人（MEXICAN）工装裤男 潮牌百搭休闲裤男士宽松显瘦束脚长裤子男 9F121190145 深灰 31/XL",
					pprice: "299",
					oprice: "399",
					discount: "7"
				},
				{
					id: 12,
					imgUrl: "../../static/img/commodity4.jpg",
					name: "稻草人（MEXICAN）工装裤男 潮牌百搭休闲裤男士宽松显瘦束脚长裤子男 9F121190145 深灰 31/XL",
					pprice: "299",
					oprice: "399",
					discount: "7"
				}
			]
		}]
	})
})

// 首页（推荐）第一次加载的数据
router.get('/api/index_list/data', function(req, res, next) {
	res.send({
		"code": 0,
		"data": {
			topBar: [ //
				{
					id: 1,
					name: "推荐"
				},
				{
					id: 2,
					name: "运动户外"
				},
				{
					id: 3,
					name: "服饰内衣"
				},
				{
					id: 4,
					name: "鞋靴箱包"
				},
				{
					id: 5,
					name: "美妆个护"
				},
				{
					id: 6,
					name: "家居数码"
				},
				{
					id: 7,
					name: "食品母婴"
				}
			],
			data: [{
				type: "swiperList",
				data: [{
						imgUrl: "../../static/img/swiper1.jpg"
					},
					{
						imgUrl: "../../static/img/swiper2.jpg"
					},
					{
						imgUrl: "../../static/img/swiper3.jpg"
					}
				]
			}, {
				type: "recommendList", //推荐列表
				data: [{
						bigUrl: "../../static/img/Children.jpg",
						small: [{
								imgUrl: "../../static/img/Children1.jpg"
							},
							{
								imgUrl: "../../static/img/Children2.jpg"
							},
							{
								imgUrl: "../../static/img/Children3.jpg"
							}
						]
					},
					{
						bigUrl: "../../static/img/Furnishing.jpg",
						small: [{
								imgUrl: "../../static/img/Furnishing1.jpg"
							},
							{
								imgUrl: "../../static/img/Furnishing2.jpg"
							},
							{
								imgUrl: "../../static/img/Furnishing3.jpg"
							}
						]
					},
				]
			}, {
				type: "commodityList", // 商品列表   
				data: [{
						id: 1,
						imgUrl: "../../static/img/commodity1.jpg",
						name: "稻草人（MEXICAN）工装裤男 潮牌百搭休闲裤男士宽松显瘦束脚长裤子男 9F121190145 深灰 31/XL",
						pprice: "299",
						oprice: "399",
						discount: "7"
					},
					{
						id: 2,
						imgUrl: "../../static/img/commodity2.jpg",
						name: "稻草人（MEXICAN）工装裤男 潮牌百搭休闲裤男士宽松显瘦束脚长裤子男 9F121190145 深灰 31/XL",
						pprice: "299",
						oprice: "399",
						discount: "7"
					},
					{
						id: 3,
						imgUrl: "../../static/img/commodity3.jpg",
						name: "稻草人（MEXICAN）工装裤男 潮牌百搭休闲裤男士宽松显瘦束脚长裤子男 9F121190145 深灰 31/XL",
						pprice: "299",
						oprice: "399",
						discount: "7"
					},
					{
						id: 4,
						imgUrl: "../../static/img/commodity4.jpg",
						name: "稻草人（MEXICAN）工装裤男 潮牌百搭休闲裤男士宽松显瘦束脚长裤子男 9F121190145 深灰 31/XL",
						pprice: "299",
						oprice: "399",
						discount: "7"
					}
				]
			}]
		}
	})
});


module.exports = router;
