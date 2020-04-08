<template>
<div class="addTurbinePanel" v-if="showAdd && posX">
    <div class="addTurbine" >
        <div class="close" @click="onClose"><i class="iconfont icon-guanbi"></i></div>
        <el-form ref="form" :model="form" :rules="rules" label-width="100px" label-position="left" :hide-required-asterisk="true">
            <el-form-item label="经度：">
                <span> {{posX}} </span>
            </el-form-item>
            <el-form-item label="纬度：">
                <span> {{posY}} </span>
            </el-form-item>
            <el-form-item label="风机编号：" prop="name">
                <el-input v-model="form.name"></el-input>
            </el-form-item>
        </el-form>
        <div class="submit" @click="onSubmit">确定</div>
    </div>
</div>
</template>
<script>
import { mapState, mapActions } from 'vuex'
import { validateAzNumber } from "@/utils/validate.js"
export default {
    name: 'addTurbine',
    data (){
        return{
            form:{
                name: ''
            },
            addLayerItem:{
                components: [],
                crane: '',
                lon: 120,
                lat: 30,
                statues: 0,
                sub_status: 0,
                id: '',
                turbine_id: '',
                turbine_type: ''
            },
            addTableItem:{},
            posX: '',
            posY: '',
            rules:{
                name: [
                    { required: true, message: '请选择风机编号', trigger: 'blur' },
                    {validator: validateAzNumber, trigger: ['blur', 'change']}
                ]
            }
        }
    },
    computed: {
        ...mapState({
            showAdd: function (state) {
                return state.hoist.showAdd
            },
            getLayerPlan: function (state) {
                return state.hoist.getLayerPlan
            }
        })
    },
    watch:{
        getLayerPlan (val){
            if (val){
                this.posX = val[0]
                this.posY = val[1]
            }
        }
    },
    methods:{
        onClose (){
            this.posX = ''
            this.posY = ''
            this.form.name = ''
            gwmap.dataManager.turbineEditLayer.switchEditMode(0)
        },
        validateName (){
            this.$refs.form.validate((valid) => {
                if (valid) {
                    this.postValidName();
                } else {
                    return false;
                }
            })
        },
        postValidName (){
            let that = this
            let checkName = this.checkFanLonlat(this.form.name);
            if (!checkName){
                this.$message.error("此编号与现有的风机编号重复！")
                return;
            }
            let turbine_json = {
                contract_number: that.$store.state.projectInfo.contract_number,
                engineer_number: that.form.name,
                logitude: that.posX,
                latitude: that.posY
            }
            apiServices.getFarmsName ({
                turbine_json: turbine_json
            }).then(res=>{
                // console.log(res)
                if (res.code != 200){
                    this.$message.error(res.data)
                    return;
                }
                this.addTableItem = res.data;
                this.addTableItem.input_engineer_number = res.data.engineer_number;
                this.addTableItem.addEdit = true
                this.addTableItem.moveEdit = false
                this.$store.commit("hoist/addTableData", this.addTableItem);
                let item = this.initLayerItem(this.addTableItem);
                gwmap.dataManager.turbineEditLayer.addTurbines([item]);
                this.$store.commit("hoist/showAdd", false);
                this.form.name = '';
            })
        },
        initLayerItem (data){
            return {
                components: [],
                crane: '',
                lon: data.logitude,
                lat: data.latitude,
                statues: data.schedule_status,
                sub_status: 0,
                id: data.engineer_number,
                turbine_id: '',
                turbine_type: data.turbine_type
            }
        },
        checkFanLonlat (name) {
            let currentFans = this.$store.state.hoist.tableData;
            for (let i = 0; i < currentFans.length; i++) {
                if (currentFans[i].engineer_number == name) {
                    return false;
                }
            }
            return true;
        },
        onSubmit (){
            this.validateName()
        }
    }

}
</script>
<style lang="less" scoped>
.addTurbinePanel{
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 8;
    background: rgba(0,0,0,0);
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
.addTurbine{
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 9;
    margin: auto;
    width:291px;
    height:172px;
    background:rgba(14,32,53,0.8);
    padding: 10px 20px 0 20px;
    color: #D4EFF6;
    border-radius:2px;
    /deep/ .el-form-item__error{
        line-height: 0;
        left: initial;
        right: 0;
    }
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
        padding: 0 0 0 15px;
    }
    /deep/ .is-error .el-input__inner{
        border: 1px solid #F56C6C;
    }
    .submit{
        width:112px;
        height:34px;
        text-align: center;
        line-height: 34px;
        background:rgba(57,207,184,0.6);
        border-radius:2px;
        cursor: pointer;
        margin: 10px 0 0 70px;
    }
}
</style>