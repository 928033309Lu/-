<template>
    <div class="hoist_container project_container overall_progress">
        <transition name="el-zoom-in-bottom">
            <div v-show="showTable" class="transition-box">
                <div class="transition-box__header">
                    <span class="transition-box__title">
                        整体进度
                    </span>
                    <button class="transition-box__headerbtn" @click="handleCloseTable">
                        <i class="iconfont icon-guanbi"></i>
                    </button>
                </div>
                <div class="transition-box__body">
                    <overall-progress-table  ref='overallProgressInfo' :overall-progress-info="overallProgressInfo"></overall-progress-table>
                </div>
            </div>
        </transition>
    </div>
</template>
<script>
import overallProgressTable from './components/overallProgressTable'
import { mapState } from 'vuex'

export default {
    name: 'overallProgress',
    data () {
        return {
            overallProgressInfo: {}
        }
    },
    components: { overallProgressTable },
    computed: {
        ...mapState({
            showTable: function (state) {
                return state.overallProgress.showTable
            }
        })
    },
    mounted () {
        this.getOverallProgress();
    },
    methods: {
        handleCloseTable () {
            this.$refs.overallProgressInfo.selectedAll()
            this.$store.commit('overallProgress/showTable', false);
            this.$router.push({ path: "/", query: this.$route.query });
        },
        getOverallProgress () {
            apiServices.getOverallProgress({ contract_number: this.$store.state.projectInfo.contract_number }).then(res => {
                this.overallProgressInfo = [].concat(res.data);
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
.overall_progress {
  width: 350px;
  height: 309px;
}
</style>
