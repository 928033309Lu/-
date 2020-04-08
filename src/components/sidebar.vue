<template>
  <div class="sidebar">
    <div class="closeWebPage" @click="closeWebPage"> <i class="iconfont icon-guanbi"></i> </div>
    <div class="line" v-if="!editFlag && !editSure"></div>
    <transition name="el-fade-in">
      <div class="menus">
        <div class="edit" v-if="!editFlag && !editSure" @click="enterEdit">
          <i class="iconfont icon-bianji1"></i>
        </div>
        <div class="edit mark " v-if="!editFlag && !editSure" :class="isShowMarker?'active':''" @click="showMarker">
          <i class="iconfont icon-icontag"></i>
        </div>
        <ul class="menu-list" v-if="!editFlag && !editSure">
          <li v-for="(item, index) in menus" :key="index" @click="chooseHandle(item, index)" :class="{ active: activeValue === item.value,active4:activeValue === 'bigPart' }">
            <div class="normal" v-if="activeValue != item.value">
              <span class="name">{{ item.label }}</span>
              <span class="line"></span>
              <div class="circular"></div>
            </div>
            <div class="active" v-if="activeValue == item.value">
              <div class="name" :class="{ active: activeValue == item.value }">
                <p>{{ item.label }}</p>
              </div>
              <div class="icon">
                <img src="../../public/images/menu-bg-bottom.png" alt="" />
                <img src="../../public/images/menu-bg-top.png" alt="" />
                <i class="iconfont" :class="item.icon"></i>
              </div>
              <div class="son-list son-list-margin" :class="{ active: bigPartActive === 'shipping' }" @click.stop="shippingHandle(item, index)" v-if="index === 3 && activeValue == item.value">
                <span class="name1">发货地</span>
                <span class="line1"></span>
              </div>
              <div class="son-list" :class="{ active: bigPartActive === 'receiving' }" @click.stop="receivingHandle(item, index)" v-if="index === 3 && activeValue == item.value">
                <span class="name1">接货</span>
                <span class="line1"></span>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </transition>
    <div v-if="editSure">
      <ul class="edit-list" :class="{heighter:editFlag,lower:!editFlag}">
        <li @click="quitEdit">
          <div class="close-icon">
            <i class="iconfont icon-guanbi"></i>
          </div>
        </li>
        <li v-for="(item, index) in editMenus" :key="index" @click="editItemHandle(item)" :class="{ active: activeValue == item.value,'no-active':activeValue != item.value}">
          <div class="icon" v-show="activeValue != item.value">
            <el-tooltip class="item" :content="item.label" placement="right">
              <i class="iconfont" :class="item.icon"></i>
            </el-tooltip>
          </div>
          <div class="text" v-show="activeValue == item.value">
            <span>{{ item.label }}</span>
          </div>
        </li>
      </ul>
    </div>
    <!--<transition name="el-fade-in" v-if="editSure">-->
    <!--<ul class="edit-list" :class="{heighter:editFlag,lower:!editFlag}">-->
    <!--<li @click="quitEdit">-->
    <!--<div class="close-icon">-->
    <!--<i class="iconfont icon-guanbi"></i>-->
    <!--</div>-->
    <!--</li>-->
    <!--<li v-for="(item, index) in editMenus" :key="index" @click="editItemHandle(item)" :class="{ active: activeValue == item.value,'no-active':activeValue != item.value}">-->
    <!--<div class="icon" v-show="activeValue != item.value">-->
    <!--<el-tooltip class="item" :content="item.label" placement="right">-->
    <!--<i class="iconfont" :class="item.icon"></i>-->
    <!--</el-tooltip>-->
    <!--</div>-->
    <!--<div class="text" v-show="activeValue == item.value">-->
    <!--<span>{{ item.label }}</span>-->
    <!--</div>-->
    <!--</li>-->
    <!--</ul>-->
    <!--</transition>-->
  </div>
</template>

<script>
import { closeWebPage } from "@/utils/close.js"
import { menus, editMenus } from "@/config/menu.config.js";

import { mapState, mapActions } from "vuex";
import bus from "@/utils/bus.js"
export default {
  name: "sidebar",
  data () {
    return {
      disabledBtn: false, // 是否进入了道路编辑
      turbinesBtn: false, // 是否进入了机位点编辑
      menus: [],
      editMenus: [],
      bigPartActive: "",
      activeValue: "",
      editFlag: false,
      editSure: false,
      isShowMarker: true,
      closeWebPage: closeWebPage
    };
  },
  computed: {
    ...mapState({
      projectLocation: state => state.projectGeoInfo.projectLocation,
      authorityMode: state => state.projectInfo.authorityMode
    }),
  },
  watch: {
    $route (to, from) {
      this.routeUpdate();
      this.disabledBtn = false;
      this.turbinesBtn = false;
      console.log(to.name)
      if (to.name == 'road') {
        this.disabledBtn = true;
        this.$emit("enterRoad", true)
      }
      if (from.name == 'road') {
        this.disabledBtn = false;
      }
      if (to.name == 'turbines') {
        this.turbinesBtn = true;
        this.$emit("enterTurbines", true)
      }
      if (from.name == 'turbines') {
        this.turbinesBtn = false;
        // gwmap.dataManager.locat2Layer();
        gwmap.dataManager.locat2LayerNew()
      }
      if (to.name == 'station') {
        this.$emit("enterStation", true)
      }
      if (to.name == 'projectLocation') {
        this.$emit("enterProjectLocation", true)
      }
    },
    activeValue (n, o) {
      if (n !== "bigPart") {
        gwmap.dataManager.shipmentLayer.remove();
        this.bigPartActive = "";
      }
    }
  },
  mounted () {
    this.menus = menus;
    this.editMenus = editMenus;
    setTimeout(() => {
      this.routeUpdate();
    }, 0);
  },
  methods: {
    ...mapActions("projectGeoInfo", [
      "getRoadGeoInfo",
      "postAllRoadInfo"
    ]),
    beforeUpdate () {
      this.menus.forEach(item => {
        this.$store.commit(item.value + "/showTable", false);
      })
    },
    routeUpdate () {
      this.beforeUpdate();
      let path = this.$route.path;
      if (this.$route.name == 'road') {
        this.disabledBtn = true;
        this.$emit("enter")
      }
      if (this.$route.name == 'turbines') {
        this.turbinesBtn = true;
      }
      if (path.indexOf("/edit") >= 0) {
        this.editFlag = true;
        this.editSure = true;
        path = path.replace("/edit/", "");
        this.activeValue = path.replace(/\//g, "");
        return;
      }
      this.editFlag = false;
      this.editSure = false;
      this.activeValue = path.replace(/\//g, "");

      if (this.activeValue === 'bigPart') return;
      this.switchHandle(this.activeValue);
    },
    enterEdit () {
      // mytodo
      if (this.authorityMode != 'edit') {
        this.$message.error("您没有权限进入编辑模式！")
        return;
      }
      if (this.bigPartActive === "shipping") {
        this.bigPartActive = "";
        this.$store.commit("bigPart/showTable1", false);
        // gwmap.dataManager.locat2Layer();
        gwmap.dataManager.locat2LayerNew()
        gwmap.dataManager.shipmentLayer.remove();
      }
      this.editFlag = true;
      this.editSure = true;
      this.$router.push({ path: "/edit", query: this.$route.query });
    },
    quitEdit () {
      if (this.disabledBtn) {
        bus.$emit("closeRoad", true);
        return;
      }
      if (this.turbinesBtn) {
        bus.$emit("closeTurbines", true);
        return;
      }
      this.editFlag = false;

      setTimeout(() => {
        this.editSure = false;
        this.$router.push({ path: "/", query: this.$route.query });
      }, 400)
    },
    chooseHandle (item, index) {
      gwmap.dataManager.shipmentLayer.remove();
      if (this.activeValue === item.value) {
        this.activeValue = '';
        this.$router.push({ path: '/', query: this.$route.query });
        return;
      }
      if (this.bigPartActive === "shipping") {
        this.bigPartActive = "";
        this.$store.commit("bigPart/showTable1", false);
        // gwmap.dataManager.locat2Layer();
        gwmap.dataManager.locat2LayerNew()
        gwmap.dataManager.shipmentLayer.remove();
      }
      this.activeValue = item.value;
      this.$router.push({ path: item.href, query: this.$route.query });
      if (index === 3) return;
      this.switchHandle(item.value);
    },
    switchHandle (value) {
      this.handleShow(value);
    },
    editItemHandle (item) {
      if (this.disabledBtn) {
        bus.$emit("closeRoad", true);
        return;
      }
      if (this.turbinesBtn) {
        bus.$emit("closeTurbines", true);
        return;
      }
      if (this.activeValue === item.value) {
        this.activeValue = '';
        this.$router.push({ path: '/edit', query: this.$route.query });
        return;
      }
      this.activeValue = item.value;
      this.$router.push({ path: item.href, query: this.$route.query });
    },
    handleShow (arg) {
      if (!arg || arg.length === 0) return;
      this.$store.commit(arg + "/showTable", true);
    },
    shippingHandle (item, index) {
      if (this.bigPartActive === "shipping") {
        this.bigPartActive = "";
        this.$store.commit("bigPart/showTable1", false);
        // gwmap.dataManager.locat2Layer();
        gwmap.dataManager.locat2LayerNew()
        gwmap.dataManager.shipmentLayer.remove();
        return;
      }
      this.bigPartActive = "shipping";
      this.$store.commit("bigPart/showTable", false);
      this.$store.commit("bigPart/showTable1", true);
    },
    receivingHandle (item, index) {
      gwmap.dataManager.shipmentLayer.remove();
      if (this.bigPartActive === "receiving") {
        this.bigPartActive = "";
        this.$store.commit("bigPart/showTable", false);
        return;
      }
      if (this.bigPartActive === "shipping") {
        this.bigPartActive = "";
        this.$store.commit("bigPart/showTable1", false);
        // gwmap.dataManager.locat2Layer();
        gwmap.dataManager.locat2LayerNew()
      }
      this.bigPartActive = "receiving";
      this.switchHandle(item.value);
    },
    //显示标签
    showMarker () {
      this.isShowMarker = !this.isShowMarker
      gwmap.dataManager.turbineLayer.showHideLabel(this.isShowMarker)
      gwmap.dataManager.craneLayer.showHideLabel(this.isShowMarker)
    }
  }
};
</script>

<style scoped lang="less">
.closeWebPage{
  position: absolute;
  right: 5px;
  top: 15px;
  z-index: 999999;
  color: rgba(235,242,229, 0.8);
  cursor: pointer;
  width: 26px;
  height: 26px;
  border: 1px solid rgba(235,242,229, 0.7);
  border-radius: 0 10px 0 10px;
  background: #0E1D32;
  transform: rotate(45deg);
  display: flex;
  justify-content: center;
  align-items: center;
  .iconfont{
    font-size: 10px !important;
    transform: rotate(-45deg);
  }
}
.sidebar {
  position: fixed;
  right: 20px;
  top: 0;
  width: 130px;
  height: 100%;
  > .line {
    width: 1px;
    height: 100%;
    background: @commonColor;
    opacity: 0.3;
    position: absolute;
    right: 18px;
    top: 0;
  }
  .edit-list {
    position: absolute;
    right: 0px;
    top: 27vh;
    overflow: hidden;
    // transform: translate(0, -60%);
    &.heighter {
      animation: changeHeight1 0.4s linear;
      animation-fill-mode: forwards;
    }
    &.lower {
      animation: changeHeight2 0.4s linear;
      animation-fill-mode: forwards;
    }
    li {
      overflow: hidden;
      margin: 10px 0;
      &:nth-child(1) {
        margin-top: 0;
      }
      .icon {
        width: 40px;
        height: 40px;
        border: 1px solid @editBorderColor;
        border-radius: 20px;
        text-align: center;
        line-height: 40px;
        color: @editBgColor;
        cursor: pointer;
        transition: all 0.3s;
        float: right;
        &:hover {
          background: @solidColor;
        }
        i {
          font-size: 28px;
        }
      }

      .close-icon {
        width: 40px;
        height: 40px;
        border: 1px solid @editBorderColor;
        border-radius: 20px;
        text-align: center;
        line-height: 40px;
        background: @solidColor;
        color: @editColor;
        transition: all 0.3s;
        float: right;
        i {
          font-size: 22px;
        }
        &:hover {
          background: @editBgColor;
        }
      }
      .text {
        width: 40px;
        height: 40px;
        border-radius: 20px;
        text-align: center;
        line-height: 40px;
        float: right;
        transition: width 0.4s;
      }
      &.no-active {
        .icon {
          width: 40px;
          /*animation: changeWidth4 0.4s linear;*/
          /*animation-fill-mode: forwards;*/
        }
      }
      &.active {
        .text {
          animation: changeWidth3 0.4s linear;
          animation-fill-mode: forwards;
        }
      }
    }
  }
  .menus {
    width: 100%;
    overflow: hidden;
    position: absolute;
    left: 0;
    top: 26vh;
    // transform: translate(0, -60%);
    .edit {
      width: 40px;
      height: 40px;
      background: @editBgColor;
      border-radius: 50%;
      text-align: center;
      line-height: 40px;
      margin-left: 90px;
      color: @editColor;
      margin-bottom: 28px;
      cursor: pointer;
      transition: background 0.3s;
      &:hover {
        background: @solidColor;
      }
      i {
        font-size: 20px;
      }
      &.mark {
        transform: scale(0.725);
        padding-top: 1px;
        margin-bottom: -1px;
        &.active {
          background: @solidColor;
          color: @commonColor;
        }
      }
    }
    .menu-list {
      text-align: center;
      li {
        margin: 16px 0;
        cursor: pointer;
        .normal {
          .flex-style();
          overflow: hidden;
          .name {
            color: @commonColor;
            margin-right: 5px;
            flex: 1;
            text-align: left;
            text-indent: 12px;
            font-size: 16px;
            text-shadow: rgb(0, 0, 0) 0.1em 0.1em 0.2em;
          }
          .line {
            width: 14px;
            height: 1px;
            background: @sidebarLineBgColor;
          }
          .circular {
            width: 12px;
            height: 12px;
            background: @editBgColor;
            border-radius: 50%;
            margin-right: 12px;
          }
        }
        .active {
          position: relative;
          width: 100%;
          height: 37px;
          overflow: hidden;
          .son-list {
            width: 88px;
            font-size: 0;
            margin-left: 27px;
            color: @commonColor;
            &.son-list-margin {
              margin-top: 45px;
              margin-bottom: 5px;
            }
            &.active {
              .name1 {
                background: @menuColor;
              }
            }
            .name1 {
              display: inline-block;
              vertical-align: middle;
              width: 64px;
              height: 26px;
              line-height: 26px;
              border-radius: 18px;
              font-size: 16px;
              transition: all 0.5s;
            }
            .line1 {
              display: inline-block;
              vertical-align: middle;
              width: 18px;
              height: 1px;
              background: rgba(252, 250, 225, 1);
              opacity: 0.5;
            }
          }
          > .name {
            width: 37px;
            height: 37px;
            opacity: 0;
            overflow: hidden;
            line-height: 37px;
            border-radius: 18.5px;
            color: @commonColor;
            font-weight: bold;
            text-align: left;
            background: @menuColor;
            position: absolute;
            right: 0;
            top: 0;
            animation: changeWidth2 0.8s linear;
            animation-fill-mode: forwards;
            p {
              text-indent: 12px;
              width: 130px;
              font-size: 16px;
            }
          }
          .icon {
            width: 37px;
            height: 37px;
            line-height: 37px;
            position: absolute;
            right: 0;
            top: 0;
            z-index: 2;
            color: @editBgColor;
            img {
              position: absolute;
              left: 0;
              top: 0;
            }
            i {
              position: relative;
              z-index: 2;
              font-size: 20px;
            }
          }
        }
        &.active {
          margin: 18px 0;
          .active {
            .name {
              animation: changeWidth1 0.4s linear;
              animation-fill-mode: forwards;
            }
            .icon {
              img:nth-child(1) {
                animation: imgRotate1 0.8s linear;
                animation-fill-mode: forwards;
              }
              img:nth-child(2) {
                animation: imgRotate2 0.8s linear;
                animation-fill-mode: forwards;
              }
            }
          }
          &.active4 {
            margin: 12px 0;
            .active {
              height: auto;
            }
          }
        }
      }
    }
  }
  @keyframes changeWidth1 {
    from {
      width: 0;
      opacity: 0;
    }
    to {
      width: 100%;
      opacity: 1;
    }
  }
  @keyframes changeWidth2 {
    from {
      width: 100%;
      opacity: 1;
    }
    to {
      width: 0;
      opacity: 1;
    }
  }
  @keyframes changeWidth3 {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
      background: @editBgColor;
      width: auto;
      padding: 0 20px;
      color: @editColor;
    }
  }
  @keyframes changeWidth4 {
    from {
      opacity: 1;
      background: @editBgColor;
      width: auto;
      padding: 0 20px;
      color: @editColor;
    }
    to {
      width: 40px;
      padding: 0;
    }
  }
  @keyframes imgRotate1 {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(-180deg);
    }
  }
  @keyframes imgRotate2 {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(180deg);
    }
  }
  @keyframes changeHeight1 {
    from {
      height: 40px;
    }
    to {
      height: 300px;
    }
  }
  @keyframes changeHeight2 {
    from {
      height: 300px;
    }
    to {
      height: 40px;
    }
  }
}
</style>
