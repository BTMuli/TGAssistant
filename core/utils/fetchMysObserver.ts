/**
 * 米游社观测枢API数据获取工具
 * @since 2.5.0
 */
const API_URL = "https://api-static.mihoyo.com/common/blackboard/ys_obc/v1/home/content/list";

/**
 * @description 获取米游社观测枢数据
 * @since 2.4.0
 * @function fetchMysObserver
 * @returns {Promise<TGACore.Plugins.Mys.WikiResponse>} 米游社观测枢数据
 */
async function fetchMysObserver(
  channel: number = 189,
): Promise<Array<TGACore.Plugins.Mys.WikiData>> {
  const resp = await fetch(`${API_URL}?app_sn=ys_obc&channel_id=${channel}`);
  const res = <TGACore.Plugins.Mys.WikiResponse>await resp.json();
  return res.data.list;
}

export default fetchMysObserver;
