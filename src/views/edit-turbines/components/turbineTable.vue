<style lang="less">
  @import "../../../assets/style/table.less";
</style>
<template>
    <div class="turbineTable">
        <el-form :model="turbineList" ref="turbineForm">
            <div class="delAll" @click="delAll"><i class="iconfont icon-wechaticon13"></i></div>
            <el-table class="commonTable" :data="turbineList.data">
                <el-table-column label="序号" width="60px" header-align="center" align="center">
                    <template slot-scope="scope">
                        <el-form-item  >
                            <span>{{scope.$index+1}}</span>
                        </el-form-item>
                    </template>
                </el-table-column>
                <el-table-column label="风机编号">
                    <template slot-scope="scope"> 
                        <el-form-item :prop="'data.'+scope.$index+'.engineer_number'" 
                        :rules="{validator: validateTurbineName, trigger: 'blur' }">
                            <el-tooltip class="item" 
                                effect="light"
                                popper-class="mytooltip"
                                :content="validate_id_value"
                                :disabled="!validate_id_value"
                                :visible-arrow="false"
                                placement="top">
                                <el-input v-model="scope.row.engineer_number" 
                                :class="!scope.row.frams_validate ? 'frams_validate' : ''"
                                 @blur="onBlur('id', scope.row.engineer_number, true, scope.row, $event)" @focus="onBlur('id', scope.row.engineer_number)"></el-input>
                            </el-tooltip>
                        </el-form-item>
                    </template>
                </el-table-column>
                <el-table-column label="投影坐标x">
                    <template slot-scope="scope">
                        <el-form-item :prop="'data.'+scope.$index+'.coordinate_x'" v-if="!mode180"
                        :rules="{validator: validateX, trigger: 'blur' }">
                            <el-tooltip class="item" 
                                effect="light"
                                popper-class="mytooltip"
                                :content="validate_x_value"
                                :disabled="!validate_x_value"
                                :visible-arrow="false"
                                placement="top">
                                <el-input v-model="scope.row.coordinate_x" @blur="onBlur('lon', scope.row.coordinate_x)" @focus="onBlur('lon', scope.row.coordinate_x)"></el-input>
                            </el-tooltip>
                        </el-form-item>
                        <el-form-item :prop="'data.'+scope.$index+'.logitude'"  v-if="mode180"
                        :rules="{validator: validateX, trigger: 'blur' }">
                            <el-tooltip class="item" 
                                effect="light"
                                popper-class="mytooltip"
                                :content="validate_x_value"
                                :disabled="!validate_x_value"
                                :visible-arrow="false"
                                placement="top">
                                <el-input v-model="scope.row.logitude" @blur="onBlur('lon', scope.row.logitude)" @focus="onBlur('lon', scope.row.logitude)"></el-input>
                            </el-tooltip>
                        </el-form-item>
                    </template>
                </el-table-column>
                <el-table-column label="投影坐标y">
                    <template slot-scope="scope">
                        <el-form-item :prop="'data.'+scope.$index+'.coordinate_y'" v-if="!mode180"
                        :rules="{validator: validateY, trigger: 'blur' }">
                            <el-tooltip class="item" 
                                effect="light"
                                popper-class="mytooltip"
                                :content="validate_y_value"
                                :disabled="!validate_y_value"
                                :visible-arrow="false"
                                placement="top">
                                <el-input v-model="scope.row.coordinate_y" @blur="onBlur('lat', scope.row.coordinate_y)"  @focus="onBlur('lat', scope.row.coordinate_y)"></el-input>
                            </el-tooltip>
                        </el-form-item>
                        <el-form-item :prop="'data.'+scope.$index+'.latitude'" v-if="mode180"
                        :rules="{validator: validateY, trigger: 'blur' }">
                            <el-tooltip class="item" 
                                effect="light"
                                popper-class="mytooltip"
                                :content="validate_y_value"
                                :disabled="!validate_y_value"
                                :visible-arrow="false"
                                placement="top">
                                <el-input v-model="scope.row.latitude" @blur="onBlur('lat', scope.row.latitude)"  @focus="onBlur('lat', scope.row.latitude)"></el-input>
                            </el-tooltip>
                        </el-form-item>
                    </template>
                </el-table-column>
                <el-table-column label="机型">
                    <template slot-scope="scope">
                        <el-form-item >
                            <!-- <span v-if="scope.row.turbine_type"> {{scope.row.turbine_type}} </span> -->
                            <span> {{scope.row.turbine_type}} </span>
                            
                        </el-form-item>
                    </template>
                </el-table-column>
                <el-table-column label="状态" width="100px">
                    <template slot-scope="scope">
                        <el-form-item >
                            <!-- <span v-if="scope.row.schedule_status"> {{scope.row.schedule_status}} </span> -->
                            <span> {{scope.row.schedule_status}} </span>
                            
                        </el-form-item>
                    </template>
                </el-table-column>
                <el-table-column label="" width="60px">
                    <template slot-scope="scope">
                        <el-form-item >
                            <div @click="delItem(scope.row, scope.$index)"><i class="iconfont icon-wechaticon13"></i></div>
                        </el-form-item>
                    </template>
                </el-table-column>
            </el-table>
        </el-form>
        <!-- <div class="addItem" @click="addItem"> <span>+ 新增</span> </div> -->
        <!-- <el-tooltip class="item" 
            effect="light"
            popper-class="mytooltip"
            content="找不到数据文件"
            :visible-arrow="false"
            placement="top">
            <span style="color: #FC1031" v-if="!scope.row.turbine_type"> 无数据 </span>
        </el-tooltip> -->
        <!-- <el-tooltip class="item" 
            effect="light"
            popper-class="mytooltip"
            content="找不到数据文件"
            :visible-arrow="false"
            placement="top">
            <span style="color: #FC1031" v-if="!scope.row.schedule_status"> 无数据 </span>
        </el-tooltip> -->

        <div class="btnBox"> <el-button @click="onSubmit">确定</el-button> </div>
    </div>
</template>
<script>
import { mapState, mapActions } from "vuex";
import { validateTurbineName, validateWGS84X, validateWGS84Y, valUTMX, validateCoordinateX, validateCoordinateY, validateType, validateStatues } from "@/utils/validate.js"

export default {
    name: 'turbineTable',
    props:{
        tableData:{

        },
        validateMode:{
        }
    },
    data (){
        return{
            validateTurbineName: validateTurbineName,
            validateWGS84X: validateWGS84X,
            validateWGS84Y: validateWGS84Y,
            valUTMX: valUTMX,
            validateCoordinateX: validateCoordinateX,
            validateCoordinateY: validateCoordinateY,
            validateType: validateType,
            validateStatues: validateStatues,
            validate_id_value:'',
            validate_type_value:'',
            validate_x_value:'',
            validate_y_value:'',
            validate_state_value:'',
            turbineList: {
                data: []
            },
            mode180: false // 是否取经纬度字段
        }
    },
    computed:{
        validateX (){
            // this.validateMode == 1 经度：在-180～180范围内，保留四位小数；纬度：在-90～90范围内，保留四位小数；
            // this.validateMode == 2 投影坐标x值：正浮点数，整数部分6位，保留四位小数，单位：m; 投影坐标y值：正浮点数，整数部分7位，保留四位小数，单位：m
            // this.validateMode == 3 投影坐标x值：正浮点数，整数部分8位，保留四位小数，单位：m; 投影坐标y值：正浮点数，整数部分7位，保留四位小数，单位：m
            this.mode180 = false
            if (this.validateMode == 1){
                this.mode180 = true
                return this.validateWGS84X;
            } else if (this.validateMode == 2){
                return this.valUTMX;
            } else if (this.validateMode == 3){
                return this.validateCoordinateX;
            }
        },
        validateY (){
            if (this.validateMode == 1){
                return this.validateWGS84Y;
            } else if (this.validateMode == 2){
                return this.validateCoordinateY;
            } else if (this.validateMode == 3){
                return this.validateCoordinateY;
            }
        }
    },
    watch:{
        tableData (val){
            if(val){
                this.turbineList.data = this.tableData;
            }
        }
    },
    mounted(){

    },
    methods:{
        ...mapActions("projectGeoInfo", ["getTurbineStatus","getCraneData","getProjectLocation"]),
        delAll(){
            this.$confirm('确定要清空表格数据?', '提示', {
                confirmButtonText: '确定',
                // showCancelButton: false,
                type: 'warning',
                center: true
            }).then(() => {
                this.turbineList.data = []
            }).catch(() => {
                
            })
        },
        delItem(obj, num){
            this.turbineList.data.forEach((item,index)=>{
                if(index == num){
                    this.turbineList.data.splice(index, 1)
                }
            })
        },
        onSubmit (){
            if (this.turbineList.data.length <= 0){
                this.$message.error("数据不能为空,请导入数据文件！")
                return;
            }
            this.$refs.turbineForm.validate((valid) => {
                if (valid) {
                    // let flag4 = this.validateTip4()
                    // console.log(flag4)
                    // if (flag4){
                        // let flag3 = this.validateTip3()
                        // if (flag3){
                            let flag = this.validateTip()
                            let flag2 = this.validateTip2()
                            if (flag && flag2){
                                this.postSubmit()
                            }
                        // }
                    // }
                } else {
                    this.$message.error("校验不通过，请检查！")
                    return false;
                }
            })
        },
        validateTip4 (){
            var arrdata = this.turbineList.data;
            var index4 = [];
            arrdata.forEach((item,index)=>{
                // if (!item.framsValidate) {
                //     index4.push(index)
                // }
                if (!item.frams_validate) {
                    index4.push(index)
                }
            })
            
            var str4 = "";
            for(let i=0; i<index4.length; i++){
                str4 += (index4[i]+1)+",";
            }
            str4 = str4.substring(0,str4.length-1);
            if(index4.length >0) {
                this.$message.error("第"+(str4)+"个FARMS系统中没有该工程机位号！");
                return false;
            }else{
                return true;
            }
        },
        validateTip(){
            var arrdata = this.turbineList.data;
            var temp = []
            var index = []
            for(var i = 0; i < arrdata.length; i++) {
                for(var j = i + 1; j < arrdata.length; j++){
                    if ((arrdata[i].coordinate_x == arrdata[j].coordinate_x)&&(arrdata[i].coordinate_y == arrdata[j].coordinate_y)){
                        index.push(j)
                        i++;
                        j = i;
                    }
                }
                temp.push(arrdata[i]);
            }  
            for(var i = 0 ; i < index.length - 1; i ++){
                for(var j = 0 ; j < index.length - i - 1; j ++){
                    if(index[j] > index[j + 1]){	
                        var ls = index[j];
                        index[j] = index[j + 1];
                        index[j + 1] = ls;
                    }
                }
            }
            var str = "";
            for(let i=0; i<index.length; i++){
                str += (index[i]+1)+",";
            }
            str = str.substring(0,str.length-1);
            if(index.length >0) {
                this.$message.error("第"+(str)+"个与之前坐标数据有重复");
                return false;
            }else{
                return true;
            }
        },
        validateTip2(){
            var arrdata = this.turbineList.data;
            var temp2 = []
            var index2 = []
            for(var i = 0; i < arrdata.length; i++) {
                for(var j = i + 1; j < arrdata.length; j++){
                    if ((arrdata[i].engineer_number == arrdata[j].engineer_number)&&(arrdata[i].engineer_number == arrdata[j].engineer_number)){
                        index2.push(j)
                        i++;
                        j = i;
                    }
                }
                temp2.push(arrdata[i]);
            }  
            for(var i = 0 ; i < index2.length - 1; i ++){
                for(var j = 0 ; j < index2.length - i - 1; j ++){
                    if(index2[j] > index2[j + 1]){	
                        var ls2 = index[j];
                        index2[j] = index2[j + 1];
                        index2[j + 1] = ls2;
                    }
                }
            }
            var str2 = "";
            for(let i=0; i<index2.length; i++){
                str2 += (index2[i]+1)+",";
            }
            str2 = str2.substring(0,str2.length-1);
            if(index2.length >0) {
                this.$message.error("第"+(str2)+"个与之前风机编号有重复");
                return false;
            }else{
                return true;
            }
        },
        validateTip3 (){
            var arrdata = this.turbineList.data;
            var index3 = [];
            arrdata.forEach((item,index)=>{
                if (!item.schedule_status || !item.turbine_type) {
                    index3.push(index)
                }
            })
            
            var str3 = "";
            for(let i=0; i<index3.length; i++){
                str3 += (index3[i]+1)+",";
            }
            str3 = str3.substring(0,str3.length-1);
            if(index3.length >0) {
                this.$message.error("第"+(str3)+"个存在无数据！");
                return false;
            }else{
                return true;
            }
        },
        postSubmit(){
            let that = this;
            this.$store.commit("screen/setLoadingTip", { loading: true, text: '上传数据中,请稍后...'})
            let delAll = new Promise(function(resolve, reject){
                apiServices.delAllTurbine({
                    contract_number: that.$route.query.contract_number
                }).then((res)=>{
                    if (res.code != 200){
                        reject(res.data)
                    }
                    resolve("del_ok_next")
                }).catch((err)=>{
                    reject(err)
                })
            })
            
            return Promise.all([delAll]).then(()=>{
                console.log("del_ok_next")
                // let p = this.turbineList.data.map((item,index)=>{
                //     return apiServices.postUploadTurbine({turbine_json: item}).then((res)=>{
                //         if(res.code != 200){
                //             throw res.data;
                //         }
                //         console.log(res.data)
                //     })
                // }) 
                let allpost = new Promise(function(resolve, reject){
                    apiServices.postAllTurbine({
                        turbine_json: {
                            contract_number: that.$route.query.contract_number,
                            turbines: that.turbineList.data
                        }
                    }).then((res)=>{
                        if (res.code != 200){
                            reject(res.data)
                        }
                        resolve("del_ok_next")
                    }).catch((err)=>{
                        reject(err)
                    })
                })
                // return Promise.all([...p]).then(() => {
                return Promise.all([allpost]).then(() => {
                    console.log("post_ok")
                    that.getAfterUploadTurbine();
                    that.$store.commit('hoist/showImport', false)
                    that.$store.commit('hoist/showTable', true)
                    that.$store.commit('hoist/refreshTable',true)
                    that.refreshLayer()
                    that.$store.commit("screen/setLoadingTip", { loading: false})
                    that.turbineList.data = []
                }).catch((err) => {
                    console.log(err)
                    that.$message.error("上传机位点失败")
                    that.$store.commit("screen/setLoadingTip", { loading: false})
                });
            }).catch((err)=>{
                console.log(err)
                that.$message.error("请求出错，请刷新后重试！")
                that.$store.commit("screen/setLoadingTip", { loading: false})
            })
        },
        getAfterUploadTurbine (){
            let that = this
            apiServices.getAfterturbine({
               contract_number: that.$route.query.contract_number,
            }).then((res)=>{
                if (res.code != 200) {
                    return;
                }
                this.getProjectLocation({
                    callback: res => {
                    if (!res) {
                        return;
                    }
                    // console.log(res, "项目部")
                    gwmap.dataManager.projectLayer.load(res);
                    }
                });
                
            }).catch((err)=>{

            })
        },
        refreshLayer(){
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
                }
            })
        },
        addItem(){

        },
        onBlur(type, value, isTrue=false, row, event){
            let that = this
            switch (type){
                case 'id':
                    if (!value){
                        this.validate_id_value = '请输入风机编号'
                    } 
                    // else if (!/^[A-Za-z0-9-]{1,10}$/.test(value)){
                    //     this.validate_id_value = '允许输入数字、字母、中划线、字符不超10';
                    // } 
                    // else if(!/^[\w.-]{1,10}$/.test(value)){
                    //     this.validate_id_value = '允许输入数字、字母、中划线、字符不超10';
                    // } 
                    else {
                        this.validate_id_value = '';
                    }
                break;
                case 'type':
                    let arr = value.split('/')
                    if (!value){
                        this.validate_type_value = '请输入机型'
                    } else if (arr.length != 2 || arr.length <=1 ){
                        this.validate_type_value = '请正确输入机型'
                    } else{
                        this.validate_type_value = ''
                    }
                break;
                case 'statues':
                    if (!value){
                        this.validate_state_value = '请输入风机状态'
                    } else{
                        this.validate_state_value = ''
                    }
                break;
                case 'lon':
                    if (!value){
                        this.validate_x_value = '请输入投影坐标X'
                    } else if (this.validateMode == 1 && !/^(\-|\+)?(((\d|[1-9]\d|1[0-7]\d|0{1,3})\.\d{0,4})|(\d|[1-9]\d|1[0-7]\d|0{1,3})|180\.0{0,6}|180)$/.test(value)){
                        this.validate_x_value = 'X为-180-180，允许输入到小数点后八位'
                    } else if (this.validateMode == 2 && !/^[\d]{6}(\.\d{1,4})?$/.test(value)){
                        this.validate_x_value = 'X为6位正数，允许输入到小数点后八位'
                    } else if (this.validateMode == 3 && !/^[\d]{8}(\.\d{1,4})?$/.test(value)){
                        this.validate_x_value = 'X为8位正数，允许输入到小数点后八位'
                    } else{
                        this.validate_x_value = ''
                    }
                break;
                case 'lat':
                    if (!value){
                        this.validate_y_value = '请输入投影坐标Y'
                    } else if (this.validateMode == 1 && !/^-?((0|[1-8]?[0-9]?)(([.][0-9]{1,4})?)|90(([.][0]{1,4})?))$/.test(value)){
                        this.validate_y_value = 'Y为-90-90，允许输入到小数点后八位'
                    } else if (this.validateMode == 2 && !/^[\d]{7}(\.\d{1,4})?$/.test(value)){
                        this.validate_y_value = 'Y为7位正数，允许输入到小数点后八位'
                    } else if (this.validateMode == 3 && !/^[\d]{7}(\.\d{1,4})?$/.test(value)){
                        this.validate_y_value = 'Y为7位正数，允许输入到小数点后八位'
                    } else{
                        this.validate_y_value = ''
                    }
                break;
            }

            if (isTrue){
                apiServices.postValidateName({
                    contract_number : that.$route.query.contract_number,
                    engineer_number : value
                }).then((res)=>{
                    if (res.code == 410){
                        // event.target.classList.add('is_ipt_error')
                        // row.framsValidate = false
                        // this.$message.error(res.data)
                        row.frams_validate = false
                        this.$message.error(res.message)
                    } else{
                        // row.framsValidate = true
                        // event.target.classList.remove('is_ipt_error')
                        row.frams_validate = true
                    }
                }).catch((err)=>{
                    console.log(err)
                    this.$message.error('获取FARMS系统的工程机位号数据失败！')
                })
            }
        }
    }
}
</script>
<style lang="less" scoped>
.turbineTable{
    color: #D4EFF6;
    .btnBox{
        display: flex;
        justify-content: center;
        padding-top: 20px;
        .el-button{
            width: 112px;
            height: 34px;
            line-height: 34px;
            background:rgba(57,207,184,0.6);
            border-radius:2px;
            color: #FFFFFF;
            border: none;
            padding: 0;
        }
    }
    /deep/ .el-table__header-wrapper th .cell{
        padding: 0 0 0 15px !important;
    }
    /deep/ .el-table__body-wrapper{
        max-height: 300px;
        overflow-y: auto;
    }
    /deep/ .commonTable{
        tr:last-child{
            border-bottom: none;
        }
        .el-table__header-wrapper th .cell{
            line-height: 34px !important;
        }
        .el-form-item{
            margin-bottom: 0 !important;
        }
        .el-form-item__content{
            line-height: 34px;
        }
        .el-input__inner{
            transition: all 0s;
            border: none !important;
            color: #D4EFF6 !important;
            text-align: center;
            padding: 0 0 0 15px;
        }
        .el-input .el-input__inner:focus{
            border: 1px solid rgba(255, 255, 255, 0.3) !important;
        }
        .el-form-item.is-error .el-input__inner, .el-form-item.is-error .el-input__inner:focus, .el-form-item.is-error .el-textarea__inner, .el-form-item.is-error .el-textarea__inner:focus, .el-message-box__input input.invalid, .el-message-box__input input.invalid:focus{
            border: 1px solid #F56C6C !important;
        }
    }
    .icon-wechaticon13{
        color: #39CFB8;
        display: none;
        transition: all 0.4s;
        cursor: pointer;
    }
    /deep/ .el-table__row:hover .icon-wechaticon13{
        display: initial;
        transition: all 0.4s;
    }
    .delAll{
        position: absolute;
        top: 94px;
        right: 51.5px;
        z-index: 9;
        .icon-wechaticon13{
            display: inline-block;
        }
    }
    .addItem{
        text-align: center;
        border: 1px solid rgba(159,164,162, 0.5);
        border-top: none;
        height: 35px;
        line-height: 35px;
        cursor: pointer;
    }
    /deep/ .commonTable  .is_ipt_error, /deep/ .commonTable .el-input .is_ipt_error:focus{
        border: 1px solid #F56C6C !important;
    }
    /deep/ .commonTable  .frams_validate .el-input__inner, /deep/ .commonTable .frams_validate .el-input__inner:focus{
        border: 1px solid #F56C6C !important;
    }
}  
</style>