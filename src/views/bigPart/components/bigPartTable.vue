<template>
  <div>
    <el-table
      v-if="$store.state.bigPart.showTable"
      :data="tableData"
      border
      style="width: 100%;"
      max-height="120px"
      class="commonTable bigPartReceiveTable"
    >
      <el-table-column prop="type" label="类型" width="120"> </el-table-column>
      <el-table-column label="塔筒">
        <el-table-column prop="tube" label="机位">
          <template slot-scope="scope">
            <span>{{
              scope.row.type === "不齐套" ? "" : scope.row.tube[0]
            }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="tube" label="机位场堆">
          <template slot-scope="scope">
            <span>{{
              scope.row.type === "不齐套" ? scope.row.tube : scope.row.tube[1]
            }}</span>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column label="机舱">
        <el-table-column prop="room" label="机位">
          <template slot-scope="scope">
            <span>{{
              scope.row.type === "不齐套" ? "" : scope.row.room[0]
            }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="tube" label="机位场堆">
          <template slot-scope="scope">
            <span>{{
              scope.row.type === "不齐套" ? scope.row.room : scope.row.room[1]
            }}</span>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column label="叶轮">
        <el-table-column prop="tube" label="机位">
          <template slot-scope="scope">
            <span>{{
              scope.row.type === "不齐套" ? "" : scope.row.impeller[0]
            }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="tube" label="机位场堆">
          <template slot-scope="scope">
            <span>{{
              scope.row.type === "不齐套"
                ? scope.row.impeller
                : scope.row.impeller[1]
            }}</span>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column label="发电机">
        <el-table-column prop="tube" label="机位">
          <template slot-scope="scope">
            <span>{{
              scope.row.type === "不齐套" ? "" : scope.row.alternator[0]
            }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="tube" label="机位场堆">
          <template slot-scope="scope">
            <span>{{
              scope.row.type === "不齐套"
                ? scope.row.alternator
                : scope.row.alternator[1]
            }}</span>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column label="叶片">
        <el-table-column prop="tube" label="机位">
          <template slot-scope="scope">
            <span>{{
              scope.row.type === "不齐套" ? "" : scope.row.blade[0]
            }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="tube" label="机位场堆">
          <template slot-scope="scope">
            <span>{{
              scope.row.type === "不齐套" ? scope.row.blade : scope.row.blade[1]
            }}</span>
          </template>
        </el-table-column>
      </el-table-column>
    </el-table>
    <div
      v-show="$store.state.bigPart.showTable1"
      ref="table1"
      style="width: 100%;"
      max-height="200px"
      class="commonTable bigPartShipTable"
    >
      <el-checkbox-group v-model="checkTurbineTypes">
        <el-checkbox
          class="edit-check"
          v-for="item in turbineTypes"
          :key="item"
          :label="item"
          >{{ item }}</el-checkbox
        >
      </el-checkbox-group>
    </div>
    <!-- <el-table v-show="$store.state.bigPart.showTable1" ref="table1" :data="tableData1" style="width: 100%;" max-height="200px" class="commonTable bigPartShipTable" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column prop="name" label="部件名称">
      </el-table-column>
      <el-table-column prop="send1" label="发货地1">
      </el-table-column>
      <el-table-column prop="distance1" label="距离(km)">
      </el-table-column>
      <el-table-column prop="send2" label="发货地1">
      </el-table-column>
      <el-table-column prop="distance2" label="距离(km)">
      </el-table-column>
    </el-table> -->
  </div>
</template>
<script>
import { mapState, mapActions } from "vuex";
export default {
  name: "bigPartTable",
  props: ["bigPartInfo"],
  data() {
    return {
      checkTurbineTypes: [],
      tableData: [
        // {
        //   type: "接货数量",
        //   tube: [12, 14],
        //   room: [1, 2],
        //   impeller: [3, 4],
        //   alternator: [5, 6],
        //   blade: [7, 8]
        // },
        // {
        //   type: "不齐套",
        //   tube: 11,
        //   room: 22,
        //   impeller: 33,
        //   alternator: 44,
        //   blade: 55
        // }
      ]
      
    };
  },
  computed: {
    ...mapState({
      projectLocation: state => state.projectGeoInfo.projectLocation,
      projectInfo: state => state.projectInfo.projectInfo,
      showTable1: function(state) {
        return state.bigPart.showTable1;
      }
    }),
    turbineTypes() {
      if (!this.projectInfo || !this.projectInfo.turbine) return [];
      const keys = [];
      for (let key in this.projectInfo.turbine) {
        keys.push(key);
      }

      if (keys.length > 0) {
        this.checkTurbineTypes = [keys[0]];
      }
      return keys;
    }
  },
  watch: {
    // bjgPartInfo: {
    bigPartInfo: {
      handler(n, o) {
        this.init(n);
      },
      deep: true
    },
    showTable1() {
      if (!this.showTable1) return;
      this.requestGetShipmentData();
    },
    checkTurbineTypes() {
      this.requestGetShipmentData();
    }
    //, '$store.state.bigPart.showTable1' (n) {
    //   if (n) {
    //     this.$nextTick(() => {
    //       // this.$refs.table1.clearSelection();
    //       // this.$refs.table1.toggleAllSelection();
    //     })
    //   }
    // }
  },
  mounted() {
    this.init(this.bigPartInfo);
  },
  methods: {
    ...mapActions("projectGeoInfo", ["getShipmentData"]),
    init(n) {
      this.tableData = [].concat(n);
    },
    requestGetShipmentData() {
      if (!this.checkTurbineTypes) return;

      this.getShipmentData({
        turbineTypes: this.checkTurbineTypes,
        callback: res => {
          gwmap.dataManager.shipmentLayer.load(res, this.projectLocation);
          setTimeout(() => {
            gwmap.dataManager.shipmentLayer.zoomToLayer();
          }, 100);
        }
      });
    }
    // handleSelectionChange (val) {
    //   this.changeSelection(val);
    // },
    // changeSelection (val) {
    //   let arr = [];
    //   val.forEach(item => {
    //     arr.push(item.type);
    //   })
    //   this.filterShipment({
    //     types: arr,
    //     callback: (res) => {
    //       if (!res) return
    //     }
    //   })
    // }
  }
};
</script>

<style lang="less" scoped></style>
