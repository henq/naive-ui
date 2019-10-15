# Nested
```html
<n-collapse v-model="activeNames">
  <n-collapse-item title="right" name="1">
    <n-collapse v-model="activeNames2">
      <n-collapse-item title="right" name="1">
        <div>good</div>
      </n-collapse-item>
      <n-collapse-item title="right" name="2">
        <div>good</div>
      </n-collapse-item>
    </n-collapse>
  </n-collapse-item>
  <n-collapse-item title="right" name="2">
    <div>good</div>
  </n-collapse-item>
</n-collapse>
```
```js
export default {
  data() {
    return {
      activeNames: [],
      activeNames2: []
    }
  }
}
```