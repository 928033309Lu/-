<template>
    <div class="overall-progress-check">
        <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange" class="all_check">
            <div class="label-show">
                <div class="label">合同数量 <span></span></div>
                <span class="branch">:</span>
                <div class="num_list">
                    <span class="first-num sameSecondbgColor"></span>
                    <span class="second-num">{{tatalNum}}</span>
                </div>
            </div>
        </el-checkbox>
        <el-checkbox-group v-model="checkedState" @change="handleCheckedChange">
            <div v-for="(stage,index) in overallProgressInfo" :key="index" class="check-item">
                <div v-if="!stage.statues && stage.statues!==0" class="no-check label-show">
                    <div class="label">{{stage.label}} <span></span></div>
                    <span class="branch">:</span>
                    <div class="num_list">
                        <span class="first-num sameSecondbgColor"></span>
                        <span class="second-num">{{stage.num}}</span>
                    </div>
                </div>
                <el-checkbox v-else  :label="stage.statues" :class="`check${stage.statues}`">
                    <div class="label-show">
                        <div class="label">{{stage.label}} <span></span></div>
                        <span class="branch">:</span>
                        <div class="num_list" >
                            <span class="first-num line" v-if="stage.statues !== 0">{{stage.num}}</span>
                            <span class="second-num" v-if="stage.statues !== 0">{{stage.cumulative_num}}</span>
                            <span class="first-num sameSecondbgColor" v-if="stage.statues === 0">{{stage.num}}</span>
                            <span class="second-num" v-if="stage.statues === 0"></span>
                        </div>
                    </div>
                </el-checkbox>
            </div>
        </el-checkbox-group>
    </div>
</template>
<script>
  import { mapActions, mapState } from "vuex";
  export default {
    data() {
      return {
        checkAll: false,
        isIndeterminate: true,
        overallProgressInfo:[],
        checkedState:[],
        allOption:[],
        arrWithStatues:[],
        tatalNum:0,
        // statusFilter:[
        //   {label:'前期', statues:0, color:"#EBF2E4" },
        //   {label:'接货', statues:1, color:"#D1FF6E" },
        //   {label:'吊装', statues:2, color:"#FDB509" },
        //   {label:'调试', statues:3, color:"#2CD0B9" },
        //   {label:'试运行', statues:4, color:"#6FEB7D" },
        //   {label:'预验收', statues:5, color:"#95A7FF" },
        //   {label:'质保', statues:6, color:"#2CB2FF" },
        // ]
      };
    },
    computed: {
        
    },
    watch:{
        
    },
    mounted(){
      let _this = this
      setTimeout(function () {
        _this.getOverallProgress()
      },200)

    },
    methods: {
      ...mapActions("projectGeoInfo", [
        "filterTurbines"
      ]),
      getOverallProgress () {
        let _this = this
        let tatalNun = 0
        let contract_number = this.$route.query.contract_number || this.$store.state.projectInfo.contract_number
        apiServices.getOverallProgress({ contract_number: contract_number}).then(res => {
          _this.overallProgressInfo = [].concat(res.data);
          _this.overallProgressInfo.forEach(function (item) {
             if(item.statues === 0 || item.statues){
               tatalNun += item.num
               _this.allOption.push(item.statues)
             }
          })
          _this.arrWithStatues = this.filterList()
          _this.handleCheckedChange(_this.allOption)
          _this.checkedState = _this.allOption
          _this.tatalNum = tatalNun
        })
      },
      handleCheckAllChange(val) {
        this.checkedState = val ? this.allOption : [];
        this.isIndeterminate = false;
        this.changeSelection(this.checkedState)
      },
      handleCheckedChange(value) {
        let checkedCount = value.length;
        this.checkAll = checkedCount === this.arrWithStatues.length;
        this.isIndeterminate = checkedCount > 0 && checkedCount < this.arrWithStatues.length;
        this.changeSelection(value)
      },
      filterList(){
        return this.overallProgressInfo.filter(stage=>{
          return stage.statues || stage.statues === 0
        })
      },
      changeSelection (val) {
        this.filterTurbines({
          filterField: "statues",
          fieldValues: val.concat([]),
          callback: res => {
            if (!res) {
              return;
            }
          }
        });
      }
    }
  };
</script>
s
<style lang="less">
    @checkedAllColor: #c5c3c3;
    @fontColor: #EBF2E4;
    @checkedIconColor: #5F482E;
    @statues:#EBF2E4,#D1FF6E,#FDB509,#2CD0B9,#6FEB7D,#95A7FF,#2CB2FF;
    @bgcardList:check0,check1,check2,check3,check4,check5,check6;
    @len:length(@statues);
    @firstNumColor:rgba(14,32,53,0.7);
    @secondNumColor:rgba(14,32,53,0.5);
    .adapterColorMixin(@index) when (@index<= @len) {
        .backgroundcard(extract(@bgcardList, @index),extract(@statues, @index));
        .adapterColorMixin(@index+1);
    }
    .adapterColorMixin(0);
    .backgroundcard(@className, @color){
        .@{className}{
           .el-checkbox__input{
               .el-checkbox__inner{
                   border-color: @color;
               }
           }
            .el-checkbox__input.is-checked .el-checkbox__inner,
            .el-checkbox__input.is-indeterminate .el-checkbox__inner{
                border-color: @color;
                background-color: @color !important;
            }
            .el-checkbox__label{
                padding-left: 5px;
                .num_list{
                    .first-num{color: @color}
                    .second-num{color: @fontColor}
                }
            }
        }
    }
    .overall-progress-check {
        position: fixed;
        left: 13px;
        bottom: 26px;
        &.bottom300{
            bottom: 300px;
        }
        .check-item{
            margin-top: 2px;
        }
        .el-checkbox{
            &.all_check{
                .el-checkbox__label{font-size: 16px;color: @fontColor;padding-left: 5px}
                .el-checkbox__inner{border-color: @checkedAllColor}
                .el-checkbox__input.is-checked .el-checkbox__inner,
                .el-checkbox__input.is-indeterminate .el-checkbox__inner{
                    background-color:  @checkedAllColor !important;
                    &:before{
                        top:7px;
                        background-color: @checkedIconColor;
                    }
                }
            }
            .el-checkbox__input{
                background-color: transparent;
                .el-checkbox__inner{
                    width: 18px;
                    height: 18px;
                    background-color: transparent;
                    &:after{
                        border-width: 2px;
                        border-color: @checkedIconColor;
                        width: 6px;
                        height: 11px;
                        top:0;
                    }
                }
            }
        }
        .label-show{
            font-size:14px;
            white-space: normal;
            display: flex;
            align-items: center;
            &.no-check{
                padding-left: 23px;
            }
            .label{
                display: inline-block;
                width: 56px;
                text-align: justify;
                vertical-align: middle;
                height: 24px;
                line-height: 24px;
                overflow: hidden;
                color: @commonColor;
                text-shadow: 1px 2px 0 #000;
                span{padding-left: 100%}
            }
            .branch{
                color: @commonColor;
                padding: 0 6px;
            }
            .num_list{
                display: inline-table;
                span{
                    display:table-cell;
                    width:34px;
                    height:24px;
                    line-height: 24px;
                    text-align: center;
                    &.first-num{
                        background-color:@firstNumColor;
                        border-radius:2px 0px 0px 2px;
                        position: relative;
                        &.sameSecondbgColor{
                            background-color:@secondNumColor;
                        }
                        &.line{
                            &:after{
                                display: inline-block;
                                content: "";
                                width: 1px;
                                height: 14px;
                                background-color: #E3EADD;
                                position: absolute;
                                top: 5px;
                                right: 0;
                            }
                        }
                    }
                    &.second-num{
                        color: @fontColor;
                        background:@secondNumColor;
                        border-radius:0px 2px 2px 0px;
                        &.sameFirstbgColor{
                            background-color:@firstNumColor;
                        }
                    }
                }
            }
        }
    }
</style>
