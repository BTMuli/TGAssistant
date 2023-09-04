/**
 * @file http request getGachaLogs.js
 * @description 获取抽卡记录相关的请求函数
 * @author BTMuli<bt-muli@outlook.com>
 * @since 1.4.0
 */

// Node
import axios from "axios";

/**
 * @description 获取抽卡记录
 * @since 1.4.0
 * @param {string} authKey authKey
 * @param {number} gachaType 抽卡类型
 * @param {number} endId 结束 id
 * @returns {Promise<object>} 请求返回
 */
export async function getGachaLogs(authKey, gachaType, endId = 0) {
  const url = "https://hk4e-api.mihoyo.com/event/gacha_info/api/getGachaLog";
  const params = {
    lang: "zh-cn",
    auth_appid: "webview_gacha",
    authkey: authKey,
    authkey_ver: 1,
    sign_type: 2,
    gacha_type: gachaType,
    size: 20,
    end_id: endId,
  };
  return axios.get(url, { params: params }).then((res) => {
    return res.data;
  });
}
