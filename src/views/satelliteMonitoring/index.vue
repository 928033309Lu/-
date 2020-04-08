<template>
    <div class="hoist_container project_container hoist_carousel">
        <transition name="el-zoom-in-bottom">
            <div v-show="showTable" class="transition-box">
                <!--<div class="transition-box__header">-->
                    <!--<span class="transition-box__title">-->
                        <!--&lt;!&ndash;卫星监控&ndash;&gt;-->
                        <!--<navheader></navheader>-->
                    <!--</span>-->
                    <!--<button class="transition-box__headerbtn" @click="handleCloseTable">-->
                        <!--<i class="iconfont icon-guanbi"></i>-->
                    <!--</button>-->
                <!--</div>-->
                <div class="transition-box__body satellite">
                    <button class="transition-box__headerbtn" @click="handleCloseTable">
                        <i class="iconfont icon-guanbi"></i>
                    </button>
                    <satellite-monitoring-info ref="satellite"></satellite-monitoring-info>
                </div>
            </div>
        </transition>
    </div>
</template>
<script>
  import satelliteMonitoringInfo from './components/satelliteMonitoring'
  import {mapState} from 'vuex'
  import navheader from '@/components/header.vue'
  export default {
    name: 'satelliteMonitoring',
    data() {
      return {
        //projectInfo: {}
      }
    },
    components: {satelliteMonitoringInfo, navheader},
    computed: {
      ...mapState({
        showTable: function (state) {
          return state.satelliteMonitoring.showTable
        },
        contract_number: function (state) {
          return state.projectInfo.contract_number
        }
      })
    },
    mounted() {
      //this.getTableData();
    },
    methods: {
      handleCloseTable() {
        this.$store.commit('satelliteMonitoring/showTable', false);
        this.$router.push({path: "/", query: this.$route.query});
      },
      // getTableData () {
      //     apiServices.getProject(this.$route.query.contract_number).then(res => {
      //         this.projectInfo = Object.assign({}, res.data);
      //     })
      // }
      getImagesInfo() {
        let _this = this
        let params = {}
        params.contract_number = this.contract_number
        apiServices.getCarousel(params).then(res => {
          if(res.code === 200){
            _this.$refs.satellite.carouselData = res.data
          }else {
            _this.$message.error(res.message)
          }
        })
      }
    },
    watch: {
      showTable: {
        handler (n, o) {
          if (n) {
            this.getImagesInfo()
          }
        },
        deep: true
      }
    }
  }
</script>

<style lang="less" scoped>
    .project_container {
        width: 100vw;
        height: 100vh;
        right: 0;
        bottom: 0;
        z-index: 2;
        .transition-box {
            height: 100%;
            max-height: inherit;
            .transition-box__body.satellite{
                padding: 0;
                background-color: #000;
                height: 100%;
                .transition-box__headerbtn{
                    position: fixed;
                    background: 0 0;
                    border: none;
                    outline: 0;
                    cursor: pointer;
                    z-index: 998;
                    top: 20px;
                    right: 20px;
                    i{
                        font-size: 20px;
                        color: @commonColor;
                    }
                    &:hover{
                        i{
                            color: @solidColor;
                        }
                    }
                }
            }
        }
        .total {
            color: @solidColor;
            padding-left: 55px;
            .flex-style();
            height: 30px;
            line-height: 30px;
            margin-top: 5px;
            border: 1px solid @tableBorderColor;
            text-align: center;
            span:nth-child(1) {
                width: 50%;
            }
            span:nth-child(2) {
                width: 50%;
                color: @tableBottomColor;
                span {
                    text-decoration: underline;
                }
            }
        }
    }
</style>
