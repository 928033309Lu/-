<template>
  <div id="hoist_container" class="hoist_container" style="width:100%;">
    <transition name="el-zoom-in-bottom">
      <div v-show="showTable" class="transition-box">
        <div class="transition-box__header">
          <span class="transition-box__title">
            吊装顺序
          </span>
          <button class="transition-box__headerbtn" @click="handleCloseTable">
            <i class="iconfont icon-guanbi"></i>
          </button>
        </div>
        <div class="transition-box__body">
          <hoisting-sequence-table
            :hoisting-info="hoistingInfo"
            ref="hoistingSequenceTable"
          ></hoisting-sequence-table>
        </div>
      </div>
    </transition>
  </div>
</template>
<script>
import hoistingSequenceTable from "./components/hoistingSequenceTable";
import { mapState, mapActions } from "vuex";

export default {
  name: "hoistingSequence",
  data() {
    return {
      hoistingInfo: []
    };
  },
  components: { hoistingSequenceTable },
  computed: {
    ...mapState({
      showTable: function(state) {
        return state.hoistingSequence.showTable;
      }
    })
  },
  mounted() {
    this.getHoistingSequence();
  },
  methods: {
    ...mapActions("projectGeoInfo", ["getCraneData"]),
    handleCloseTable() {
      this.$refs.hoistingSequenceTable.showRode();
      this.$store.commit("hoistingSequence/showTable", false);
      this.$router.push({ path: "/", query: this.$route.query });
    },
    getHoistingSequence() {
      this.getCraneData({
        callback: res => {
          if (!res) {
            return;
          }
          this.hoistingInfo = [].concat(res);
        }
      });
    }
  },
  watch: {
    showTable() {}
  }
};
</script>

<style lang="less" scoped></style>
