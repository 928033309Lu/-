<template>
  <div class="tool-bar-container" :class="showTable ?'active':''">
    <ul>
      <li :class="type=='import'?'active':''" @click="handleCarry('import')">
        <el-tooltip class="item" content="导入风机" placement="top">
          <div> <i class="iconfont icon-daoru"></i> </div>
        </el-tooltip>
      </li>
      <li :class="type=='skewing'?'active':''" @click="handleCarry('skewing')" style="border-right: 1px solid rgba(244,244,244,0.1)">
        <el-tooltip class="item" content="风机偏移" placement="top">
          <div> <i class="iconfont icon-pianyi1"></i> </div>
        </el-tooltip>
      </li>
      <li :class="type=='move'?'active':''" @click="handleCarry('move')">
        <el-tooltip class="item" content="移动风机" placement="top">
          <div class="moveturbine">
            <i class="iconfont icon-yidong"></i>
          </div>
        </el-tooltip>
      </li>
      <li :class="type=='add'?'active':''" @click="handleCarry('add')">
        <el-tooltip class="item" content="点击地面添加风机" placement="top">
          <div class="addturbine">
            <i class="iconfont icon-addFenji"></i>
          </div>
        </el-tooltip>
      </li>
      <li :class="type=='remove'?'active':''" @click="handleCarry('remove')">
        <el-tooltip class="item" content="删除地面风机" placement="top">
          <div class="removeTurbine">
            <i class="iconfont icon-removeFenji"></i>
          </div>
        </el-tooltip>
      </li>
      <li  @click="handleCarry('del')">
        <el-tooltip class="item" content="删除" placement="top">
          <div> <i class="iconfont icon-wechaticon13"></i> </div>
        </el-tooltip>
      </li>
      <li  @click="handleCarry('isEditName')" :class="isEditName ?'active':''">
        <el-tooltip class="item" content="编辑编号" placement="top">
          <div> <i class="iconfont icon-biaoqian"></i> </div>
        </el-tooltip>
      </li>
      <li  @click="handleCarry('show')">
        <el-tooltip class="item" content="查看风机列表" placement="top">
          <div> <i class="iconfont icon-unmaximize"></i> </div>
        </el-tooltip>
      </li>
      <li :class="type=='back'?'active':''" @click="handleCarry('back')" style="border-left: 1px solid rgba(244,244,244,0.1)">
        <el-tooltip class="item" content="回滚" placement="top">
          <div> <i class="iconfont icon-xindongfang-shuaxintubiao"></i> </div>
        </el-tooltip>
      </li>
      <li :class="type=='save'?'active':''" @click="handleCarry('save')">
        <el-tooltip class="item" content="保存" placement="top">
          <div> <i class="iconfont icon-baocun"></i> </div>
        </el-tooltip>
      </li>
    </ul>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
export default {
  name: 'tool-bar',
  data () {
    return {
      type: '',
      skewingMode: false // 是否进入纠偏模式
    }
  },
  computed: {
    ...mapState({
      
      isEditName: function (state) {
        return state.hoist.isEditName
      },
      showTable: function (state) {
        return state.hoist.showTable
      },
      showImport: function (state) {
        return state.hoist.showImport
      },
      tableData: function (state) {
        return state.hoist.tableData
      },
      showAdd: function (state) {
        return state.hoist.showAdd
      },
      showRemove: function (state) {
        return state.hoist.showRemove
      },
      showMove: function (state) {
        return state.hoist.showMove
      },
      showSkewing: function (state) {
        return state.hoist.showSkewing
      },
      getLayerPlan: function (state) {
        return state.hoist.getLayerPlan
      }
    })
  },
  watch:{
    showImport (val){
      if (!val && this.type == 'import'){
        this.type = ''
      }
    },
    getLayerPlan (val){
      if (!val){
        return;
      }
      if (this.showRemove){
        this.$confirm('是否删除[ '+ val +' ]风机?', '提示', {
          confirmButtonText: '确定',
          // showCancelButton:false,
          center: true,
          type: 'warning'
        }).then(() => {
          this.$store.commit ('hoist/delTableData_Name', val) 
        }).catch(() => {
               
        })
      }
      if (this.showMove){
        this.$store.commit ('hoist/moveTableData', val) 
      }
    }
  },
  mounted () {

  },
  methods: {
    ...mapActions("projectGeoInfo", ["getTurbineStatus","getCraneData"]),
    closeSkew (){
      this.type = ''
      this.skewingMode = false
      gwmap.dataManager.turbineEditLayer.switchEditMode(-1)
      this.$store.commit('hoist/showSkewing',false)
    },
    handleCarry(actionType){
      let _this = this
      console.log(this.type)
      console.log(actionType)
      if (this.type == 'isEditName' && this.type == actionType){
        console.log("0000")
        this.type = ''
        _this.$store.commit('hoist/isEditName', false)
        return
      }
      this.type = actionType
      this.$store.commit('hoist/showAdd', false)
      this.$store.commit('hoist/showRemove', false)
      this.$store.commit('hoist/showMove', false)
      this.$store.commit('hoist/showSkewing', false)
      this.$store.commit('hoist/getLayerPlan', null)
      _this.$store.commit('hoist/isEditName', false)
      gwmap.dataManager.turbineEditLayer.switchEditMode(-1)
      switch (actionType) {
        case 'isEditName':
          _this.handleSave()
          _this.$store.commit('hoist/isEditName', true)
          break;
        case 'show':
          _this.handleShow()
          break;
        case 'import':
          _this.handleImport()
          break;
        case 'save':
          _this.handleSave()
          break;
        case 'del':
          _this.handleDelete()
          break;
        case 'add':
          gwmap.dataManager.turbineEditLayer.switchEditMode(0)
          _this.$store.commit('hoist/showAdd',true)
          break;
        case 'move':
          gwmap.dataManager.turbineEditLayer.switchEditMode(1)
          _this.$store.commit('hoist/showMove',true)
          break;
        case 'back':
          _this.$store.commit('hoist/refreshTable',true)
          _this.refreshLayer()
          
          break;
        case 'skewing':
          let addData = this.tableData.filter(item => item.addEdit)
          let putData = this.tableData.filter(item => item.moveEdit)
          let delData = this.$store.state.hoist.deleteEndData
          // console.log(addData.length)
          // console.log(putData.length)
          // console.log(delData.length)
          if (addData.length <=0 && putData.length <=0 && delData.length <=0){
            gwmap.dataManager.turbineEditLayer.switchEditMode(4)
            _this.$store.commit('hoist/showSkewing',true)
            _this.skewingMode = true
          } else{
            this.$confirm('开启纠偏模式前，是否保存现编辑的风机数据', '提示', {
              confirmButtonText: '确定',
              type: 'warning',
              // showCancelButton: false,
              center: true
            }).then(() => {
              let flag = this.handleSave();
              if (flag){
                _this.$store.commit("screen/setLoadingTip", { loading: true, text: '正在保存数据，请稍后...'})
                setTimeout(()=>{
                  gwmap.dataManager.turbineEditLayer.switchEditMode(4)
                  _this.$store.commit('hoist/showSkewing',true)
                  _this.$store.commit("screen/setLoadingTip", { loading: false})
                },800)
              }
              _this.skewingMode = true
            }).catch(() => {
              _this.refreshLayer(true)
              _this.skewingMode = true
            })
          }
          
          break;
        case 'remove':
          gwmap.dataManager.turbineEditLayer.switchEditMode(2)
          _this.$store.commit('hoist/showRemove',true)
          break;
      }
    },
    refreshLayer(isTrue=false){
      let that = this
      this.getTurbineStatus({
        callback: res => {
          if (!res) {
            return;
          }
          // 移除风机图层，加载风机编辑图层
          gwmap.dataManager.turbineLayer.remove()
          gwmap.dataManager.turbineEditLayer.load(res)
          // 获取吊车
          that.getCraneData({
            callback: res2 => {
              if (!res2) {
                return;
              }
              gwmap.dataManager.craneLayer.load(res2)
            }
          });
          that.$store.commit('hoist/deleteEndDataRefresh', [])
          that.tableData.forEach((item,index)=>{
            item.addEdit = false
            item.moveEdit = false
          })
          // console.log(that.tableData)
          if(isTrue){
            gwmap.dataManager.turbineEditLayer.switchEditMode(4)
            that.$store.commit('hoist/showSkewing',true)
          }
        }
      });
    // this.$store.commit('hoist/turbineRefresh', true) 

    },
    handleShow () {
      this.$store.commit('hoist/showTable', !this.showTable)
    },
    handleImport () {
      this.$store.commit('hoist/showImport', true)
    },
    handleSave () {
      let _this = this;
      this.$store.commit('hoist/saveTable', false)
      let addData = this.tableData.filter(item => item.addEdit)
      let putData = this.tableData.filter(item => item.moveEdit)
      let delData = this.$store.state.hoist.deleteEndData
      console.log("add",addData.length)
      console.log("put",putData.length)
      console.log("del",delData.length)
      _this.$store.commit("screen/setLoadingTip", { loading: true, text: '正在保存数据，请稍后...'})
      // 删除
      var delArr = []
      delData.forEach((item,index)=>{
        delArr.push(item.id)
      })
      let requestParam = {}
      requestParam.turbine_id = delArr.join(',')
      let delP = new Promise(function(resolve, reject){
        if (delData.length > 0){
          apiServices.deleteTurbine(requestParam).then(res => {
            if(res.code != 200){
              reject(res.data)
            }
            resolve("res_del_ok")
            // console.log(res.data)
          }).catch((err)=>{
            reject(err)
          })
        } else{
          resolve('del_ok')
        }
      })
      // 修改
      let putP = putData.map((item,index, arr)=>{
        if (arr.length >0){
          return apiServices.putUploadTurbine({turbine_json: item}).then((res)=>{
              if(res.code != 200){
                throw res.data;
              }
              // console.log(res.data)
          })
        } else{
          return true;
        }
      })
      // 新增
      let addP = addData.map((item,index, arr)=>{
        if (arr.length >0){
          return apiServices.postUploadTurbine({turbine_json: item}).then((res)=>{
              if(res.code != 200){
                throw res.data;
              }
              // console.log(res.data)
          })
        } else{
          return true;
        }
      })
      
      return Promise.all([...addP]).then((resp)=>{
        return Promise.all([...putP]).then((resp)=>{
          return Promise.all([delP]).then((res)=>{
            _this.$message.success("保存成功！")
            _this.successHandle()
          }).catch((err)=>{
            _this.errhandle()
          })
        }).catch((err)=>{
          _this.errhandle()
        })
      }).catch((err)=>{
        _this.errhandle()
      })
    },
    errhandle(){
      this.$message.error("保存出错，请刷新重试！")
      this.$store.commit("screen/setLoadingTip", { loading: false})
      this.$store.commit('hoist/isEditName', false)
    },
    successHandle(){
      this.$store.commit("screen/setLoadingTip", { loading: false})
      this.refreshLayer()
    },
    handleDelete () {
      this.$store.commit('hoist/delTable', true)
    }
  }
}
</script>

<style scoped lang="less">
.tool-bar-container {
  position: fixed;
  bottom: 55px;
  right: 36px;

  height: 50px;
  background: rgba(14, 29, 50, 1);
  opacity: 0.85;
  border-radius: 2px;
  &.active {
    bottom: 315px;
    transition: 0.2s linear;
  }
  ul {
    height: 100%;
    display: flex;
    align-items: center;
    li {
      height: 100%;
      text-align: center;
      line-height: 50px;
      width: 45px;
      cursor: pointer;
      div{
        outline: none;
      }
      .iconfont {
        font-size: 23px;
        color: #ebf2e4;
        width: 23px;
        height: 23px;
        display: inline-block;
        &.icon-wechaticon13 {
          font-size: 28px;
          margin-top: -3px;
          margin-left: -2px;
        }
      }
      .icon-addFenji {
        background: url("/images/addTurbine.png") no-repeat center;
      }
      &:hover {
        .iconfont {
          color: #39cfb8;
        }
        .icon-addFenji {
          background: url("/images/addTuebineActive.png") no-repeat center;
        }
        .icon-removeFenji {
          width: 26px;
          height: 22px;
          background: url("/images/remove2.png") no-repeat center;
          background-size: 100% 100%;
        }
      }
      &.active {
        .icon-addFenji {
          background: url("/images/addTuebineActive.png") no-repeat center;
        }
        .iconfont{
          color: #39cfb8;
        }
        .icon-removeFenji {
          background: url("/images/remove2.png") no-repeat center;
          background-size: 100% 100%;
        }
        .icon-unmaximize, .icon-xindongfang-shuaxintubiao, .icon-baocun, .icon-removeFenji, .icon-wechaticon13{
          color: #ebf2e4 !important;
        }
      }
      .addturbine {
        padding-top: 6px;
      }
      .removeTurbine {
        position: relative;
        top: 4px;
        left: 1px;
      }
      .icon-removeFenji {
        width: 26px;
        height: 22px;
        background: url("/images/remove.png") no-repeat center;
        background-size: 100% 100%;
      }
    }
  }
}
</style>
