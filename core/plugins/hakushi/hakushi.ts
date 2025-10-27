const HAKUSHI_URL = "https://api.hakush.in/gi/";

async function fetchJson<T>(relPath: string): Promise<T> {
  const link = `${HAKUSHI_URL}${relPath}`;
  const resp = await fetch(link);
  return <T>await resp.json();
}

const hakushiTool = {
  fetchJson,
};

export default hakushiTool;
