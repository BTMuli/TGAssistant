/**
 * Yatta 书籍数据类型声明文件
 * @since 2.6.0
 */

declare namespace TGACore.Plugins.Yatta.Book {
  /** 书籍列表响应。 */
  type BookResponse = TGACore.Plugins.Yatta.Base.Response2<BookItem, Record<string, string>>;

  /** 书籍详情响应。 */
  type DetailResponse = TGACore.Plugins.Yatta.Base.Response<BookDetail>;

  /** 可读内容响应。 */
  type ReadableResponse = TGACore.Plugins.Yatta.Base.Response<string>;

  /** 书籍列表项。 */
  type BookItem = {
    id: number;
    name: string;
    rank: number;
    icon: string;
    route: string;
  };

  /** 书籍详情。 */
  type BookDetail = BookItem & { volume: Array<Volume> };

  /** 书籍卷信息。 */
  type Volume = {
    id: number;
    name: string;
    description: string;
    storyId: string;
  };

  /** 带有可读内容和资源信息的本地书籍卷。 */
  type LocalVolume = Volume & {
    /** 所属书籍名称，Yatta 未提供时省略。 */
    vol?: string;
    icon: string;
    rank: number;
    story: string;
  };

  /** 带有可读内容的本地书籍详情。 */
  type LocalBook = Omit<BookDetail, "volume"> & { volume: Array<LocalVolume> };
}
