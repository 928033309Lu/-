<template>
<div class="skewingPanel" v-if="showSkewing && form.posX">
    <div class="skewingTurbine" >
        <div class="close" @click="onClose"><i class="iconfont icon-guanbi"></i></div>
        <el-form ref="form" :model="form" :rules="rules" label-width="40px" label-position="left" :hide-required-asterisk="true">
            <el-form-item  prop="name">
                <el-input v-model="form.posX" type="number"></el-input>
                <span class="label"> <i class="iconfont icon-xingzhuang-sanjiaoxing"></i> X = </span>
                <span class="unit">米</span>
            </el-form-item>
            <el-form-item  prop="name">
                <el-input v-model="form.posY" type="number"></el-input>
                <span class="label"> <i class="iconfont icon-xingzhuang-sanjiaoxing"></i> Y = </span>
                <span class="unit">米</span>
            </el-form-item>
        </el-form>
        <div class="submit" @click="onSubmit">确定</div>
    </div>
</div>
</template>
<script>
import { mapState, mapActions } from 'vuex'
import bus from "@/utils/bus.js"
export default {
    name: 'skewingTurbine',
    data (){
        return{
            form:{
                posX: '',
                posY: ''
            },
            rules:{
                posX: [
                    { required: true, message: '请选择X', trigger: 'blur' }
                ],
                posY: [
                    { required: true, message: '请选择Y', trigger: 'blur' }
                ],
            }
        }
    },
    computed: {
        ...mapState({
            showSkewing: function (state) {
                return state.hoist.showSkewing
            },
            getLayerPlan: function (state) {
                return state.hoist.getLayerPlan
            }
        })
    },
    watch:{
        getLayerPlan(val){
            if(val && val.varxy && val.varxy.length >0){
                this.form.posX = val.varxy[0]
                this.form.posY = val.varxy[1]
                
            }
        },
        showSkewing (val){
            if(!val){
                this.form = {
                    posX: '',
                    posY: ''
                }
            }
        }
    },
    mounted(){
        
    },
    methods:{
         ...mapActions("projectGeoInfo", [
        "getTurbineStatus", 'getCraneData'
        ]),
        onClose (){
            this.form.posX = ''
            this.form.posY = ''
            this.refreshData()
            this.$emit("closeSkew", true)
        },
        onSubmit (){
            let that = this;
            this.$store.commit("screen/setLoadingTip", { loading: true, text: '正在保存纠偏数据，请稍后...'})
            apiServices.postSave_x_y({
                json_data:{
                    contract_number: that.$route.query.contract_number,
                    variate_x: that.form.posX,
                    variate_y: that.form.posY
                }
            }).then((res)=>{
                if(res.code != 200){
                    this.$message.error(res.data)
                    return;
                }
                this.$message.success(res.data)
                this.refreshData()
                this.$store.commit('hoist/showSkewing', false)
                this.$store.commit("screen/setLoadingTip", { loading: false})
                this.$emit("closeSkew", true)
            }).catch((err)=>{
                this.$store.commit("screen/setLoadingTip", { loading: false})
            })
        },
        refreshData(){
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
        }
    }
}
</script>
<style lang="less" scoped>
.skewingPanel{
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
    background: rgba(0,0,0,0);
    z-index: 8;
}
.close{
    width: 22px;
    height: 22px;
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    top: -5px;
    right: -5px;
    z-index: 10;
    cursor: pointer;
    .iconfont{
        font-size: 11px !important;
    }
}    
.close:hover .iconfont{
    font-size: 11.5px !important;
    color: #fff !important;
}
.skewingTurbine{
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 9;
    margin: auto;
    width:204px;
    height:130px;
    background:rgba(14,32,53,0.8);
    padding: 10px 30px 0 20px;
    color: #D4EFF6;
    border-radius:2px;
    /deep/ .el-form-item__label{
        color: #D4EFF6;
        line-height: 34px;
    }
    /deep/ .el-form-item{
        margin-bottom: 0;
        span{
            color:#39CFB8;
        }
    }
    /deep/ .el-form-item__content{
        line-height: 34px;
    }
    /deep/ .el-input__inner{
        border: 1px solid rgba(255, 255, 255, 0.3);
        padding: 0 0 0 5px;
    }
    .label{
        position: absolute;
        left: -50px;
        top: 0;
        color: #D4EFF6 !important;
    }
    .unit{
        position: absolute;
        right: -20px;
        top: 0;
        color: #D4EFF6 !important;
    }
    .submit{
        width:112px;
        height:34px;
        text-align: center;
        line-height: 34px;
        background:rgba(57,207,184,0.6);
        border-radius:2px;
        cursor: pointer;
        margin: 8px 0 0 30px;
    }
}
</style>