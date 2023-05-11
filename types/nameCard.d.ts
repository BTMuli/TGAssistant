/**
 * @file types - nameCard.d.ts
 * @description 名片对应的类型声明文件
 * @author BTMuli<bt-muli@outlook.com>
 * @since 1.1.0
 */

declare namespace srcData {
    /**
     * @description 名片数据类型
     * @interface NameCard
     * @property {number} index - 名片索引
     * @property {string} name - 名片名称
     * @property {string} description - 名片描述
     * @property {string} source - 名片来源
     * @returns {NameCard} - 名片数据
     */
    export interface NameCard {
        index: number;
        name: string;
        description: string;
        source: string;
    }
}

declare namespace outData {
    /**
     * @description 名片数据类型
     * @interface NameCard
     * @property {string} name - 名片名称
     * @property {number} type - 名片类型
     * @property {string} description - 名片描述
     * @property {string} source - 名片来源
     * @property {string} icon - 名片图标
     * @property {string} bg - 名片背景
     * @property {string} profile - 名片profile
     * @returns {NameCard} - 名片数据
     */
    export interface NameCard {
        name: string;
        type: number;
        description: string;
        source: string;
        icon: string;
        bg: string;
        profile: string;
    }
}
