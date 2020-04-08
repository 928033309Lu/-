<template>
    <div class="hoist_container project_container">
        <transition name="el-zoom-in-bottom" :duration="{ enter: 2000, leave: 2000 }">
            <div v-show="showTable" class="transition-box">
                <div class="transition-box__header">
                    <span class="transition-box__title">
                        项目信息
                    </span>
                    <button class="transition-box__headerbtn" @click="handleCloseTable">
                        <i class="iconfont icon-guanbi"></i>
                    </button>
                </div>
                <div class="transition-box__body" v-if="projectInfo">
                    <project-info-table ref="projectInfoTable" v-if="projectInfo" :project-data="projectInfo.turbine"></project-info-table>
                    <div class="total">
                        <span>主吊台数 ( 台 ) </span>
                        <span>
                            <span @click="jump">{{projectInfo.crane_num}}</span>
                        </span>
                    </div>
                </div>
            </div>
        </transition>
    </div>
</template>
<script>
import projectInfoTable from './components/projectInfoTable'
import { mapState } from 'vuex'

export default {
    name: 'projectInfo',
    data () {
        return {
            projectInfo: {}
        }
    },
    components: { projectInfoTable },
    computed: {
        ...mapState({
            showTable: function (state) {
                return state.projectInfo.showTable
            }
        }),
        projectInfo () {
            return Object.assign({}, this.$store.state.projectInfo.projectInfo);
        }
    },
    mounted () {
        this.getTableData();
        this.projectInfo = Object.assign({}, this.$store.state.projectInfo.projectInfo);
    },
    methods: {
        handleCloseTable () {
            this.$refs.projectInfoTable.selectedAll()
            this.$store.commit('projectInfo/showTable', false);
            this.$router.push({ path: "/", query: this.$route.query });
        },
        getTableData () {
            apiServices.getProject(this.$route.query.contract_number).then(res => {
                this.projectInfo = Object.assign({}, res.data);
            })
        },
        jump () {
            this.$router.push({ path: '/hoistingSequence', query: this.$route.query });
        }
    },
    watch: {

    }
}
</script>

<style lang="less" scoped>
.project_container {
  width: 350px;
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
