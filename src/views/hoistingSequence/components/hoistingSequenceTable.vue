<template>
  <el-table
    :data="tableData"
    style="width: 100%;"
    max-height="200px"
    class="commonTable"
  >
    <el-table-column label="吊车编号">
      <template slot-scope="scope">
        <span @click="cranelocation(scope.row)" class="table-text">{{
          scope.row.crane_licence
        }}</span>
      </template>
    </el-table-column>
    <el-table-column prop="crane_type" label="吊车类型"> </el-table-column>
    <el-table-column prop="main_crane_model" label="主吊型号">
    </el-table-column>
    <el-table-column prop="planned_approach_time" label="计划进场时间">
    </el-table-column>
    <el-table-column prop="actual_approach_time" label="实际进场时间">
    </el-table-column>
    <el-table-column prop="departure_time" label="离场时间"> </el-table-column>
    <el-table-column label="机位吊装顺序">
      <template slot-scope="scope">
        <span
          @click="setRoad(scope.row)"
          :title="scope.row.turbine_hosting_sequence"
          class="set-road"
          >{{ scope.row.turbine_hosting_sequence }}</span
        >
      </template>
    </el-table-column>
  </el-table>
</template>
<script>
import { mapActions } from "vuex";
export default {
  name: "sequenceTbale",
  props: ["hoistingInfo"],
  data() {
    return {
      tableData: []
    };
  },
  watch: {
    hoistingInfo: {
      handler(n, o) {
        this.init(n);
      },
      deep: true
    }
  },
  mounted() {},
  methods: {
    ...mapActions("projectGeoInfo", ["getRoadGeoInfo"]),
    init(n) {
      this.tableData = [].concat(n);
    },
    cranelocation(row) {
      gwmap.dataManager.locat2FeatureById("crane", row.crane_id);
    },
    setRoad(row) {
      gwmap.dataManager.turbineLayer.filter(
        row.turbine_hosting_sequence.split(",")
      );
      // gwmap.dataManager.locat2Layer();
      gwmap.dataManager.locat2LayerNew()
    },
    showRode() {
      gwmap.dataManager.turbineLayer.filter();
    }
  }
};
</script>

<style scoped></style>
