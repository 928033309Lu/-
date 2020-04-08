<template>
  <el-table ref="table" :data="tableData" style="width: 100%;" max-height="100%" class="commonTable overallProgressTable" @selection-change="handleSelectionChange">
    <el-table-column type="selection" width="55"></el-table-column>
    <el-table-column prop="label" label="阶段">
    </el-table-column>
    <el-table-column prop="num" label="机位数量">
    </el-table-column>
  </el-table>
</template>
<script>
import { mapActions } from "vuex";
export default {
  name: 'overallProgressTable',
  props: ['overallProgressInfo'],
  data () {
    return {
      tableData: [
        {
          label: '试运行',
          value: 'polit',
          num: 5
        },
        {
          label: '吊装',
          value: 'hoisting',
          num: 3
        }
      ]
    }
  },
  watch: {
    overallProgressInfo: {
      handler (n, o) {
        this.init(n);
      },
      deep: true
    }
  },
  mounted () {
  },
  methods: {
    ...mapActions("projectGeoInfo", [
      "filterTurbines"
    ]),
    init (n) {
      this.tableData = [].concat(n);
      this.$nextTick(() => {
        this.$refs.table.toggleAllSelection();
      })
    },
    handleSelectionChange (val) {
      this.changeSelection(val);
    },
    selectedAll(){
      this.changeSelection(this.tableData);
    },
    changeSelection (val) {
      let arr = [];
      val.forEach(item => {
        if (item.statues)
          arr.push(item.statues);
      })
      this.filterTurbines({
        filterField: "statues",
        fieldValues: arr.concat([0, 1, 6]),
        callback: res => {
          if (!res) {
            return;
          }
        }
      });
    }
  }
}
</script>

<style scoped>
</style>
