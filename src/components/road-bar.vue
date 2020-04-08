<template>
    <div class="road-bar-container" >
        <ul>
          <el-tooltip class="item" content="道路重新生成" placement="top">
            <li v-if="!canClickAfresh" :class="type == 'afresh' ? 'active' :''"  @click="handleCarry('afresh')">
              <i class="iconfont icon-quanbu_youwanluxian" :class="disableAfresh? 'activeAfresh' :''"></i>
            </li>
            <li v-if="canClickAfresh">
              <i class="el-icon-loading"></i>
            </li>
          </el-tooltip> 
            <el-tooltip class="item" content="切换道路" placement="top">
              <li @click="handleCarry('color')">
                <p class="iconfont select-title" @click="onShowSelect" :class="showSelect? 'showSelectColor' : ''">
                  <span :style="{background: selected.value}"></span> {{selected.label}} <i class="el-icon-arrow-down"></i>
                </p>
                <div class="selectBox" :class="showSelect? 'showSelect' : ''">
                  <ol class="select">
                    <li v-for="(item, index) of colorOptions" :key="index"
                    :class="selected.value == item.value ? 'showSelectColor' :''"
                    @click="clickItem(item)">
                      <span :style="{background: item.value}"></span>
                      <span> {{item.label}} </span>
                    </li>
                  </ol>
                </div>
              </li>
            </el-tooltip>
            <el-tooltip class="item" content="节点编辑" placement="top">
              <li :class="type=='edit'?'active':''" @click="handleCarry('edit')">
                <i class="iconfont icon-bianji"></i>
              </li>
            </el-tooltip>
            <el-tooltip class="item" content="绘制节点" placement="top">
              <li :class="type=='add'?'active':''" @click="handleCarry('add')">
                <i class="iconfont icon-tianjia"></i>
              </li>
            </el-tooltip>
            <el-tooltip class="item" content="打断支线" placement="top">
              <li :class="type=='break'?'active':''" @click="handleCarry('break')">
                <i class="iconfont icon-daduan"></i>
              </li>
            </el-tooltip>
            <el-tooltip class="item" content="合并支线" placement="top">
              <li :class="type=='com'?'active':''" @click="handleCarry('com')">
                <i class="iconfont icon-hebing"></i>
              </li>
            </el-tooltip>
            <el-tooltip class="item" content="删除支线" placement="top">
              <li :class="type=='del'?'active':''" @click="handleCarry('del')">
                <i class="iconfont icon-wechaticon13"></i> 
              </li>
            </el-tooltip>
            <el-tooltip class="item" content="回滚" placement="top">
              <li :class="type=='back'?'active':''" @click="handleCarry('back')">
                <i class="iconfont icon-xindongfang-shuaxintubiao"></i>
              </li>
            </el-tooltip>
            <el-tooltip class="item" content="保存编辑" placement="top">
              <li :class="type=='save'?'active':''" @click="handleCarry('save')">
                <i class="iconfont icon-baocun"></i>
              </li>
            </el-tooltip>
            <el-tooltip class="item" content="退出" placement="top">
              <li :class="type=='close'?'active':''" @click="handleCarry('close')">
                <i class="iconfont icon-guanbi"></i>
              </li>
            </el-tooltip>
        </ul>
    </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import bus from "@/utils/bus.js"
  export default {
    name: 'road-bar',
    props:{
      pit_road:{},
      flight_path:{},
      off_road:{}
    },
    data(){
      return{
        canClickAfresh: false,
        disableAfresh: false,
        type:'edit',
        showSelect: false,
        selected: {
          label: "场内道路",
          value: "#FFFCD8",
          type: 1
        },
        colorOptions:[
          {
            label: "场内道路",
            value: "#FFFCD8",
            type: 1
          },
          {
            label: "机位道路",
            value: "#FFEC0A",
            type: 2
          },
          {
            label: "场外道路",
            value: "#CD9F00",
            type: 3
          }
        ]
      }
    },
    computed:{
     
    },
    mounted(){
      bus.$on("closeRoad",(msg)=>{
        if(msg){
          this.roadLayerConfirm()
        }
      })
    },
    beforeDestroy(){
  　　bus.$off('closeRoad')
    },
    watch:{
      pit_road(val){
        // console.log(val)
        if(val){
          gwmap.dataManager.roadLayerEdit.startEdit()
          gwmap.dataManager.roadLayerPoint.startEdit()
          gwmap.dataManager.roadLayerOver.startEdit()
          this.handleCarry('selectedColor', 1)
        }
      },
      selected (val){
        if (val.type != 1){
          this.disableAfresh = true;
        } else{
          this.disableAfresh = false;
        }
      }
    },
    methods:{
      ...mapActions("projectGeoInfo", [
      "postAllRoadInfo",
      "getPitRoad",
      "getRoadGeoInfo2"
    ]),
      handleCarry(type, number) {
        if (type != 'color'){
          this.showSelect = false;
          this.type = type;
        } else{

        }
        switch (type) {
          case "selectedColor":
            this.type = 'edit';
            if (number == 1){
              // gwmap.dataManager.roadLayerEdit.showHide(true)   
              // gwmap.dataManager.roadLayerEdit.nodeEdit()
              // gwmap.dataManager.roadLayerPoint.showHide(false)
              // gwmap.dataManager.roadLayerOver.showHide(false)
              gwmap.dataManager.roadLayerEdit.startEdit()   
              gwmap.dataManager.roadLayerEdit.nodeEdit()
              gwmap.dataManager.roadLayerPoint.stopEdit()
              gwmap.dataManager.roadLayerOver.stopEdit()
            } else if (number == 2){
              // gwmap.dataManager.roadLayerPoint.showHide(true)
              // gwmap.dataManager.roadLayerPoint.nodeEdit()
              // gwmap.dataManager.roadLayerEdit.showHide(false)
              // gwmap.dataManager.roadLayerOver.showHide(false)
              gwmap.dataManager.roadLayerPoint.startEdit()
              gwmap.dataManager.roadLayerPoint.nodeEdit()
              gwmap.dataManager.roadLayerEdit.stopEdit()
              gwmap.dataManager.roadLayerOver.stopEdit()
            } else if (number == 3){
              // gwmap.dataManager.roadLayerOver.showHide(true)
              // gwmap.dataManager.roadLayerOver.nodeEdit()
              // gwmap.dataManager.roadLayerEdit.showHide(false)
              // gwmap.dataManager.roadLayerPoint.showHide(false)
              gwmap.dataManager.roadLayerOver.startEdit()
              gwmap.dataManager.roadLayerOver.nodeEdit()
              gwmap.dataManager.roadLayerEdit.stopEdit()
              gwmap.dataManager.roadLayerPoint.stopEdit()
            }
          break;
          case "afresh":
            this.getAfresh();
          break;
          case "add":
            this.selected.type == 1 && gwmap.dataManager.roadLayerEdit.addNode()
            this.selected.type == 2 && gwmap.dataManager.roadLayerPoint.addNode()
            this.selected.type == 3 && gwmap.dataManager.roadLayerOver.addNode()
          break;
          case "edit":
            this.selected.type == 1 && gwmap.dataManager.roadLayerEdit.nodeEdit()
            this.selected.type == 2 && gwmap.dataManager.roadLayerPoint.nodeEdit()
            this.selected.type == 3 && gwmap.dataManager.roadLayerOver.nodeEdit()
          break;
          case "break":
            this.selected.type == 1 && gwmap.dataManager.roadLayerEdit.breakEdit()
            this.selected.type == 2 && gwmap.dataManager.roadLayerPoint.breakEdit()
            this.selected.type == 3 && gwmap.dataManager.roadLayerOver.breakEdit()
          break;
          case "com":
            this.selected.type == 1 && gwmap.dataManager.roadLayerEdit.combineNode()
            this.selected.type == 2 && gwmap.dataManager.roadLayerPoint.combineNode()
            this.selected.type == 3 && gwmap.dataManager.roadLayerOver.combineNode()
          break;
          case "del":
            this.selected.type == 1 && gwmap.dataManager.roadLayerEdit.delEdit()
            this.selected.type == 2 && gwmap.dataManager.roadLayerPoint.delEdit()
            this.selected.type == 3 && gwmap.dataManager.roadLayerOver.delEdit()
          break;
          case "back":
            if (this.selected.type == 1){
              gwmap.dataManager.roadLayerEdit.stopEdit();
              gwmap.dataManager.roadLayerEdit.rollBack();
              this.type = 'edit';
              gwmap.dataManager.roadLayerEdit.startEdit();
            }
            if (this.selected.type == 2){
              gwmap.dataManager.roadLayerPoint.stopEdit();
              gwmap.dataManager.roadLayerPoint.rollBack();
              this.type = 'edit';
              gwmap.dataManager.roadLayerPoint.startEdit();
            }
            if (this.selected.type == 3){
              gwmap.dataManager.roadLayerOver.stopEdit();
              gwmap.dataManager.roadLayerOver.rollBack();
              this.type = 'edit';
              gwmap.dataManager.roadLayerOver.startEdit();
            }
          break;
          case "save":
            this.onSaveRoad()
          break;
          case "close":
            this.roadLayerConfirm();
          break;
        }
      },
      onSaveRoad(){
          gwmap.dataManager.roadLayerEdit.stopEdit();
          gwmap.dataManager.roadLayerPoint.stopEdit();
          gwmap.dataManager.roadLayerOver.stopEdit();
          let newDataJson1 = gwmap.dataManager.roadLayerEdit.saveEdit();
          let newDataJson2 = gwmap.dataManager.roadLayerPoint.saveEdit();
          let newDataJson3 = gwmap.dataManager.roadLayerOver.saveEdit();

          let pit_road = this.$store.state.projectGeoInfo.roadAllInfo.pit_road;
          let flight_path = this.$store.state.projectGeoInfo.roadAllInfo.flight_path;
          let off_road = this.$store.state.projectGeoInfo.roadAllInfo.off_road;
          pit_road.features = newDataJson1.features;
          flight_path.features = newDataJson2.features;
          off_road.features = newDataJson3.features;

          let that = this;
          let p1 = new Promise(function(resolve,reject){
            let data = {}
            data.type = 1;
            data.road_info = pit_road
            that.postAllRoadInfo({
              data,
              callback: res => {
                if (res) {
                  if(res.code != 200){
                    // this.$message.error(res.data);
                    reject('err')
                    return;
                  } 
                  // this.$message.success(res.data);
                  gwmap.dataManager.roadLayerEdit.updateEdit(newDataJson1)
  
                  setTimeout(()=>{
                    gwmap.dataManager.roadLayerEdit.startEdit()
                  },200)
                  resolve('ok')
                } else {
                  reject('err')
                  // this.$message.error("保存场内道路数据出错！");
                }
              }
            })
          })
          let p2 = new Promise(function(resolve,reject){
            let data2 = {}
            data2.type = 2;
            data2.road_info = flight_path
            that.postAllRoadInfo({
              data: data2,
              callback: res => {
                if (res) {
                  if(res.code != 200){
                    // this.$message.error(res.data);
                    reject('err')
                    return;
                  } 
                  // this.$message.success(res.data);
                  gwmap.dataManager.roadLayerPoint.updateEdit(newDataJson2)
                  setTimeout(()=>{
                    gwmap.dataManager.roadLayerPoint.startEdit()
                  },200)
                  resolve('ok')
                } else {
                  reject('err')
                  // this.$message.error("保存机位道路数据出错！");
                }
              }
            })
          })
          let p3 = new Promise(function(resolve,reject){
            let data3 = {}
            data3.type = 3;
            data3.road_info = off_road
            that.postAllRoadInfo({
              data: data3,
              callback: res => {
                if (res) {
                  if(res.code != 200){
                    // this.$message.error(res.data);
                    reject('err')
                    return;
                  } 
                  // this.$message.success(res.data);
                  gwmap.dataManager.roadLayerOver.updateEdit(newDataJson3)
                  setTimeout(()=>{
                    gwmap.dataManager.roadLayerOver.startEdit()
                  },200)
                  resolve('ok')
                } else {
                  reject('err')
                  // this.$message.error("保存场外道路数据出错！");
                }
              }
            })
          })
          Promise.all([p1, p2, p3]).then((res) => {
            // console.log(res)
            this.$message.success('道路数据保存成功！');
          }).catch((err) => {
            console.log(err)
            this.$message.error('道路数据保存失败！');
          })
        this.type = '';
      },
      roadLayerConfirm(){
        gwmap.dataManager.roadLayerEdit.stopEdit();
        gwmap.dataManager.roadLayerPoint.stopEdit();
        gwmap.dataManager.roadLayerOver.stopEdit();
        // gwmap.dataManager.roadLayerEdit.getStatus()方法有bug,临时对策，都弹框提示保存
        console.log('三维getStatus()方法, 三条道路返回的编辑状态如下:')
        console.log('场内道路--是否编辑过：'+ gwmap.dataManager.roadLayerEdit.getStatus())
        console.log('机位道路--是否编辑过：'+ gwmap.dataManager.roadLayerPoint.getStatus())
        console.log('场外道路--是否编辑过：'+ gwmap.dataManager.roadLayerOver.getStatus())

          this.$confirm('是否要保存道路数据？', '提示', {
            confirmButtonText: '确定',
            type: 'warning',
            // showCancelButton: false,
            center: true
          }).then(() => {
            this.onSaveRoad();
            setTimeout(()=>{
              this.$emit('close');
            },500)
          }).catch(() => {
            gwmap.dataManager.roadLayerEdit.stopEdit();
            gwmap.dataManager.roadLayerPoint.stopEdit();
            gwmap.dataManager.roadLayerOver.stopEdit();
            gwmap.dataManager.roadLayerEdit.rollBack();
            gwmap.dataManager.roadLayerPoint.rollBack();
            gwmap.dataManager.roadLayerOver.rollBack();
            this.$emit('close');
          })
       
      },
      getAfresh(){
        if (this.selected.type != 1) return
        this.canClickAfresh = true
        this.$confirm('将重新生成并覆盖现有道路成果，确认继续？', '提示', {
          confirmButtonText: '确定',
          // showCancelButton: false,
          type: 'warning',
          center: true
        }).then(() => {
          this.$store.commit("screen/setLoadingTip", { loading: true })
          this.getPitRoad({
            callback: res=>{
              if (res.code != 200){
                this.$message.error(res.data)
              }
              this.$message.success(res.data)
              this.$store.commit("screen/setLoadingTip", { loading: false })
              this.canClickAfresh = false
              this.getEditRoad()
            }
          })
        }).catch(() => {
          this.type = '';
          this.canClickAfresh = false
        })
      },
      getEditRoad(){
        this.getRoadGeoInfo2({
          callback: res => {
            if (!res) return;
            let roadGeoInfo = Object.assign({}, res);
            gwmap.dataManager.roadLayerEdit.load(roadGeoInfo);
            gwmap.dataManager.roadLayerEdit.zoomToLayer()
            this.type = '';
            gwmap.dataManager.roadLayerEdit.startEdit()
            gwmap.dataManager.roadLayerPoint.startEdit()
            gwmap.dataManager.roadLayerOver.startEdit()
          }
        });
       
      },
      clickItem(item) {
        this.selected = item;
        this.showSelect = false;
        this.handleCarry('selectedColor', this.selected.type);
      },
      onShowSelect(){
        this.showSelect = !this.showSelect;
      }
    }
  }
</script>

<style scoped lang="less">
.road-bar-container{
    position: fixed;
    bottom: 60px;
    right: 36px;
    height:50px;
    background:rgba(14,29,50, 0.85);
    color: #EBF2E4;
    border-radius:2px;
    .iconfont{
      font-size: 23px;
    }
    .icon-wechaticon13{
      position: relative;
      font-size: 28px;
      top: -3px;
    }
    .icon-guanbi{
      font-size: 20px;
    }
    ul{
      height: 100%;
      display: flex;
      align-items: center;
      &>li{
        width: 48px;
        height: 100%;
        line-height: 50px;
        text-align: center;
        position: relative;
        cursor: pointer;
        outline: none;
      }
      &>li:nth-of-type(2){
        width: 118px;
      }
      &>li:hover .iconfont{
        color: #39CFB8;
      }
    }
    .showSelectColor{
      color: #39CFB8;
    }
    .selectBox{
      position: absolute;
      top: 38px;
      left: 0;
      height: 0;
      overflow: hidden;
      transition: all 0.4s;
    }
    .select{
      border:1px solid rgba(75,87,90,0.7);
      background:rgba(14,29,50, 0.7);
      line-height: initial;
      width: 110px;
      text-align: left;
      &>li{
        outline: none;
        padding-left: 9px;
        cursor: pointer;
        line-height: 22px;
        span:first-child{
          display: inline-block;
          width:20px;
          height:4px;
          position: relative;
          top: -3px;
        }
      }
      &>li:hover{
        background:rgba(14,29,50, 1);
        color: #39CFB8;
      }
    }
    .select-title{
      font-size: 14px;
      span:first-child{
        display: inline-block;
        width:20px;
        height:4px;
        position: relative;
        top: -3px;
      }
    }

    .showSelect{
      animation: myfirst 0.4s;
      animation-fill-mode: forwards;
      animation-timing-function: 0.4s;
    }


  .active{
    color: #39CFB8;
  }
  .activeAfresh{
    cursor: not-allowed !important;
    color: #EBF2E4 !important;
  }
  .el-icon-loading{
    font-size: 20px;
  }
}

@keyframes myfirst
{
  0% { height: 0;}
  100% { height: initial;}
}
</style>
