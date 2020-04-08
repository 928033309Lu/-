<template>
  <el-table ref="table" :data="tableData" style="width: 100%;" max-height="88%" class="commonTable projectInfoTable" @selection-change="handleSelectionChange">
    <el-table-column type="selection" width="55"></el-table-column>
    <el-table-column prop="label" label="合同样本">
    </el-table-column>
    <el-table-column prop="value" label="数量 ( 台 ) ">
    </el-table-column>
  </el-table>
</template>
<script>
import { mapActions, mapState } from "vuex";
export default {
  name: 'projectInfo',
  props: ['projectData'],
  data () {
    return {
      tableData: []
    }
  },
  watch: {
    projectData: {
      handler (n, o) {
        this.init();
      },
      immediate: true
    },
  },
  computed: {
    ...mapState({
      showTable: function (state) {
        return state.projectInfo.showTable
      }
    }),
  },
  mounted () {

  },
  methods: {
    ...mapActions("projectGeoInfo", [
      "filterTurbines"
    ]),
    init () {
      this.tableData = [];
      if (!this.projectData) return;
      Object.keys(this.projectData).forEach((key) => {
        this.tableData.push({ label: key, value: this.projectData[key] });
      });
      this.$nextTick(() => {
        this.$refs.table.toggleAllSelection();
        this.changeSelection(this.tableData);
      })
    },
    selectedAll(){
      this.changeSelection(this.tableData);
    },
    handleSelectionChange (val) {
      this.changeSelection(val);
    },
    changeSelection (val) {
      let arr = [];
      val.forEach(item => {
        arr.push(item.label);
      })
      this.filterTurbines({
        filterField: "turbine_type",
        fieldValues: arr,
        callback: res => {
          if (!res) {
            return;
          }
        }
      });
    }
  },
}
</script>

<style scoped>
</style>
