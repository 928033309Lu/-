<template>
  <div class="hoist_container" style="width:100%;">
    <tool-bar ref='toolBar'></tool-bar>
    <import-turbine></import-turbine>
    <add-turbine></add-turbine>
    <skewing-turbine @closeSkew="closeSkew"></skewing-turbine>
    <transition name="el-zoom-in-bottom">
      <div v-show="showTable" class="transition-box" style="height: 266px">
        <div class="transition-box__header">
          <span class="transition-box__title">
            机位点
            <span class="transition-box__page">
              共 <span class="transition-box__pageNum">{{totalNum}} </span>条记录
            </span>
          </span>
          <button class="transition-box__headerbtn" @click="handleCloseTable">
            <i class="iconfont icon-guanbi"></i>
          </button>
        </div>
        <div class="transition-box__body">
          <sequece-table ref="sequece-table"></sequece-table>
        </div>
      </div>
    </transition>
  </div>
</template>
<script>
import sequeceTable from './components/sequenceTabale'
import toolBar from '@/components/tool-bar'
import importTurbine from './components/importTurbine'
import addTurbine from './components/addTurbine'
import skewingTurbine from './components/skewingTurbine'
import bus from "@/utils/bus.js"
import { mapState, mapActions } from 'vuex'
export default {
  name: 'edit-turbines',
  data () {
    return {
      show2: false,
    }
  },
  components: { sequeceTable, toolBar, importTurbine, addTurbine, skewingTurbine },
  computed: {
    ...mapState({
      showTable: function (state) {
        return state.hoist.showTable
      },
      totalNum: function (state) {
        return state.hoist.totalNum
      },
      tableData: function (state) {
        return state.hoist.tableData
      }
    })
  },
  mounted () {
    this.getTurbineStatus({
      callback: res => {
        if (!res) {
          return;
        }
        // 移除风机图层，加载风机编辑图层
        gwmap.dataManager.turbineLayer.remove()
        gwmap.dataManager.turbineEditLayer.load(res)

        // 获取吊车
        this.getCraneData({
          callback: res2 => {
            if (!res2) {
              return;
            }
            gwmap.dataManager.craneLayer.load(res2)
          }
        });
      }
    });
    bus.$on("closeTurbines",(msg)=>{
      if(msg){
        let addData = this.tableData.filter(item => item.addEdit)
        let putData = this.tableData.filter(item => item.moveEdit)
        let delData = this.$store.state.hoist.deleteEndData
        // console.log(addData.length)
        // console.log(putData.length)
        // console.log(delData.length)
        if (addData.length <=0 && putData.length <=0 && delData.length <=0){
            this.refreshLayer();
        } else{
          this.$confirm('请确认是否保存编辑的风机数据', '提示', {
              confirmButtonText: '确定',
              type: 'warning',
              // showCancelButton: false,
              center: true
            }).then(() => {
              let flag = this.$refs.toolBar.handleSave()
              // console.log(flag)
              if (flag){
                setTimeout(()=>{
                  this.refreshLayer()
                },500)
              }
            }).catch(() => {
              this.refreshLayer();
          })
        }

      }
    })
  },
  beforeDestroy(){
  　　bus.$off('closeTurbines')
  },
  methods: {
    ...mapActions("projectGeoInfo", [
      "getTurbineStatus", 'getCraneData'
    ]),
    closeSkew(){
      this.$refs.toolBar.closeSkew()
    },
    handleCloseTable () {
      this.$store.commit('hoist/showTable', false)
    },
    refreshLayer(){
        gwmap.dataManager.turbineEditLayer.remove()
        this.getTurbineStatus({
          callback: res => {
            if (!res) {
              return;
            }
            gwmap.dataManager.turbineLayer.load(res)
            // 获取吊车
            this.getCraneData({
              callback: res2 => {
                if (!res2) {
                  return;
                }
                gwmap.dataManager.craneLayer.load(res2)
              }
            });
          }
        })
        this.$router.push({ path: '/edit', query: this.$route.query });
        this.$store.commit('hoist/deleteEndDataRefresh', [])
        this.tableData.forEach((item,index)=>{
          item.addEdit = false
          item.moveEdit = false
        })
    }
  },
  watch: {
    showTable () {

    }
  }
}
</script>

<style lang="less" scoped>
</style>
