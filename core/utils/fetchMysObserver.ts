/**
 * @file core/utils/fetchMysObserver.ts
 * @description 米游社观测枢API数据获取工具
 * @since 2.4.0
 */
const API_URL = "https://api-static.mihoyo.com/common/blackboard/ys_obc/v1/home/content/list";
const REQ_URL = `${API_URL}?app_sn=ys_obc&channel_id=189`;

/**
 * @description 获取米游社观测枢数据
 * @since 2.4.0
 * @function fetchMysObserver
 * @returns {Promise<TGACore.Plugins.Mys.WikiResponse>} 米游社观测枢数据
 */
async function fetchMysObserver(): Promise<Array<TGACore.Plugins.Mys.WikiData>> {
  const resp = await fetch(REQ_URL);
  const res = <TGACore.Plugins.Mys.WikiResponse>await resp.json();
  return res.data.list;
}

export default fetchMysObserver;
