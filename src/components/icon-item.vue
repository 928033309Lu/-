<template>
  <div class="icon-item" @click="itemClick">
    <i
      :class="'iconfont icon ' + icon"
      class="item-icon"
      :style="`color: ${selected ? '#39cfb8' : '#ebf2e4'}`"
    ></i>
    <span
      v-if="showIndex"
      class="item-index"
      :style="`color: ${selected ? '#39cfb8' : '#fcfae1'}`"
      >{{ itemIndex + 1 }}</span
    >
  </div>
</template>
<script>
export default {
  components: {},
  props: {
    selected: { default: false },
    showIndex: { default: true },
    itemIndex: { default: 0 },
    icon: { default: "" }
  },
  data() {
    return {};
  },
  computed: {},
  watch: {},

  mounted() {},
  methods: {
    itemClick() {
      if (this.selected) return;
      this.$emit("item-click", this.itemIndex);
    }
  }
};
</script>

<style lang="less" scoped>
.icon-item {
  height: 50px;
  width: 50px;
  text-align: center;
  padding: 14px;
  cursor: pointer;
  display: inline-block;
  .item-icon {
    font-size: 22px;
    color: #ebf2e4;
  }
  .item-index {
    font-size: 12px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    color: #fcfae1;
    position: relative;
    top: -18px;
    left: -30px;
  }
}
</style>
