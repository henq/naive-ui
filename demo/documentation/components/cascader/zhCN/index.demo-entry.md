# 级联选择 Cascader
用来选一些树型信息。
## 演示
```demo
single-leaf-only
size
trigger
multiple-leaf-only
single
multiple
single-leaf-only-search
multiple-leaf-only-search
single-search
multiple-search
single-leaf-only-lazy
multiple-leaf-only-lazy
single-lazy
multiple-lazy
filter
```

## V-model
|Prop|Event|
|-|-|
|value|change|

## Props
|名称|类型|默认值|说明|
|-|-|-|-|
|theme|`'light' \| 'dark' \| null \| string`|`null`||
|options|`Array<CascaderOption>`|`null`||
|value|`string \| number`|`null`||
|placeholder|`string`|`'请选择'`||
|multiple|`boolean`|`false`||
|size|`'small' \| 'medium' \| 'large'`|`'medium'`||
|filterable|`boolean`|`false`|不能和 `remote` 同时为 `true`|
|disabled|`boolean`|`false`||
|expand-trigger|`'click' \| 'hover'`|`'click'`||
|leaf-only|`boolean`|`true`||
|clearable|`boolean`|`false`||
|remote|`boolean`|`false`||
|on-load|`(option: CascaderOption, resolve: (children: Array<CascaderOption>) => void) => any`|`() => {}`|在点击未加载完成节点时的回调。把获得的子节点传入 `resolve` 函数来设定这个节点的子节点。|
|separator|`string`|`'/'`||
|filter|`(pattern: string, option: CascaderOption, path: Array<CascaderOption>) => boolean`|一个基于字符串的过滤算法||

## Events
|名称|参数|说明|
|-|-|-|
|change|`(value: string \| number \| Array<string \| number>)`||
|blur|`()`||