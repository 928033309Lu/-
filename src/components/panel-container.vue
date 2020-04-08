<template>
  <div class="panel-container">
    <div class="panel-header">
      <slot name="header"> </slot>
    </div>
    <div class="panel-content">
      <slot></slot>
    </div>
  </div>
</template>
<script>
export default {
  components: {},
  props: {
    // title: { default: "" },
    // icon: { default: "" }
  },
  data() {
    return {};
  },
  computed: {},
  watch: {},

  mounted() {},
  methods: {}
};
</script>

<style lang="less" scoped>
.panel-container {
  border-radius: 3px;
}
.panel-header {
  width: 100%;
  height: 50px;
  background: rgba(14, 29, 50, 1);
  opacity: 0.85;
}

.panel-content {
  width: 100%;
  height: calc(100% - 50px);
  background: rgba(14, 32, 53, 1);
  opacity: 0.8;
}
</style>
