/**
 * @file http constant salt.js
 * @description salt 常量文件
 * @author BTMuli<bt-muli@outlook.com>
 * @since 1.1.0
 */

/**
 * @description salt 值
 * @since 1.1.0
 * @property {Object} BBS BBS 相关
 * @property {string} BBS.K2 BBS K2
 * @property {string} BBS.LK2 BBS LK2
 * @property {Object} Other 其他
 * @property {string} Other.X4 X4
 * @property {string} Other.X6 X6
 * @returns {Object} salt 值
 */
const Salt = {
	BBS: {
		K2: "egBrFMO1BPBG0UX5XOuuwMRLZKwTVKRV",
		LK2: "DG8lqMyc9gquwAUFc7zBS62ijQRX9XF7",
	},
	Other: {
		X4: "xV8v4Qu54lUKrEYFZkJhB8cuOh9Asafs",
		X6: "t0qEgfub6cvueAPgR5m9aQWWVciEer7v",
		prod: "JwYDpKvLj6MrMqqYU6jTKF17KNO2PXoS"
	},
};

export default Salt;