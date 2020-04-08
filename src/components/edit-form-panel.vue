<template>
  <panel-container>
    <template v-slot:header>
      <icon-item
        v-for="(item, index) in items"
        :icon="icon"
        :key="'icon' + index"
        :itemIndex="index"
        :showIndex="items && items.length > 1"
        :selected="currentIndex === index"
        @item-click="itemClick"
      ></icon-item>
    </template>
    <div>内容</div>
  </panel-container>
</template>
<script>
import { mapState } from "vuex";
import PanelContainer from "@/components/panel-container.vue";
import IconItem from "@/components/icon-item";
export default {
  components: { PanelContainer, IconItem },
  props: {
    icon: { default: "" },
    items: { default: [] }
  },
  data() {
    return {
      currentIndex: -1
    };
  },
  computed: {
    ...mapState({})
  },
  watch: {},
  mounted() {},
  methods: {
    itemClick(index) {
      this.currentIndex = index;
    }
  }
};
</script>

<style lang="less"></style>
