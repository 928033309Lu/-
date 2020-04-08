<template>
    <div class="hoist_container project_container">
        <transition name="el-zoom-in-bottom">
            <div v-show="showTable" class="transition-box">
                <div class="transition-box__header">
                    <span class="transition-box__title">
                        基础施工
                    </span>
                    <button class="transition-box__headerbtn" @click="handleCloseTable">
                        <i class="iconfont icon-guanbi"></i>
                    </button>
                </div>
                <div class="transition-box__body">
                    <basic-progress-echart :basic-structure-info="basicStructureInfo"></basic-progress-echart>
                </div>
            </div>
        </transition>
    </div>
</template>
<script>
import basicProgressEchart from './components/basicProgressEchart'
import { mapState } from 'vuex'

export default {
    name: 'basicProgress',
    data () {
        return {
            basicStructureInfo: {}
        }
    },
    components: { basicProgressEchart },
    computed: {
        ...mapState({
            showTable: function (state) {
                return state.basicProgress.showTable
            }
        })
    },
    mounted () {
        this.getBasicStructure();
    },
    methods: {
        handleCloseTable () {
            this.$store.commit('basicProgress/showTable', false);
            this.$router.push({ path: "/", query: this.$route.query });
        },
        getBasicStructure () {
            apiServices.getBasicStructure({ contract_number: this.$store.state.projectInfo.contract_number }).then(res => {
                this.basicStructureInfo = Object.assign({}, res.data);
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
  width: 400px;
}
</style>
