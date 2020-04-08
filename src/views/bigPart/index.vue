<template>
  <div class="hoist_container project_container" :style="showTable1?`width: 140px;height: ${turbineTypes.length*30+5}px;right: 50px;bottom: 32px;`:''" :class="{'send':$store.state.bigPart.showTable1}">
    <transition name="el-zoom-in-bottom">
      <div v-if="showTable || showTable1" class="transition-box">
        <div v-if="showTable" class="transition-box__header">
          <span class="transition-box__title">
            {{tableName}}
          </span>
          <button class="transition-box__headerbtn" @click="handleCloseTable">
            <i class="iconfont icon-guanbi"></i>
          </button>
        </div>
        <div class="transition-box__body">
          <big-part-table :big-part-info="bigPartInfo"></big-part-table>
        </div>
      </div>
    </transition>
  </div>
</template>
<script>
import bigPartTable from './components/bigPartTable'
import { mapState } from 'vuex'

export default {
  name: 'bigPart',
  data () {
    return {
      bigPartInfo: []
    }
  },
  components: { bigPartTable },
  computed: {
    ...mapState({
      showTable: function (state) {
        return state.bigPart.showTable
      },
      showTable1: function (state) {
        return state.bigPart.showTable1
      },
      projectInfo: state => state.projectInfo.projectInfo
    }),
    turbineTypes () {
      if (!this.projectInfo || !this.projectInfo.turbine) return []
      const keys = []
      for (let key in this.projectInfo.turbine) {
        keys.push(key)
      }

      if (keys.length > 0) {
        this.checkTurbineType = keys[0]
      }
      return keys
    },
    tableName () {
      if (this.$store.state.bigPart.showTable) {
        return '大部件接货'
      }
      if (this.$store.state.bigPart.showTable1) {
        return '大部件发货地'
      }
    }
  },
  mounted () {
    this.getBigPart();
  },
  methods: {
    handleCloseTable () {
      this.$store.commit('bigPart/showTable', false);
      this.$store.commit('bigPart/showTable1', false);
    },
    getBigPart () {
      apiServices.getBigPart({ contract_number: this.$store.state.projectInfo.contract_number }).then(res => {
        this.bigPartInfo = [].concat(res.data);
      })
    },
  },
  watch: {
    showTable () {

    }
  }
}
</script>

<style lang="less" scoped>
.project_container {
  width: 976px;
  /*height: 176px;*/
  height: 169px;
  &.send {
    width: 525px;
    /*height: 266px;*/
    height: 253px;
  }
}
</style>
