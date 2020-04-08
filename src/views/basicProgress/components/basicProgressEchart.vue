<template>
    <div class="echart-container" id="echart">

    </div>
</template>
<script>
export default {
    name: 'echart',
    props: ['basicStructureInfo'],
    data () {
        return {
            // 20,205,184 == 14CDB8
            // 53,107,207 == 356BCF
            option: {
                color: ['rgba(20,205,184, 1)', 'rgba(53,107,207, 0.5)'],
                tooltip: {
                    show: false
                },
                legend: {
                    data: ['未完成', '完成'],
                    right: '0',
                    top: '5px',
                    textStyle: {
                        color: 'rgba(212,239,246,1)'
                    },
                    icon: "rect",
                },
                grid: {
                    left: '0',
                    top: '30px',
                    right: '0',
                    bottom: '15px',
                    containLabel: true
                },
                xAxis: [
                    {
                        type: 'category',
                        data: ['基础开挖', '基础浇筑', '基础回填'],
                        axisLine: {
                            lineStyle: {
                                color: 'rgba(92,109,114,.5)'
                            }
                        },
                        axisLabel: {
                            color: 'rgba(212,239,246,1)'
                        },
                        axisTick: {
                            show: false
                        }
                    }
                ],
                yAxis: [
                    {
                        type: 'value',
                        axisLine: {
                            lineStyle: {
                                color: 'rgba(92,109,114,.5)'
                            }
                        },
                        axisLabel: {
                            color: 'rgba(212,239,246,1)'
                        },
                        splitLine: {
                            show: true,
                            lineStyle: {
                                color: ['rgba(92,109,114,.5)'],
                            }
                        },
                        axisTick: {
                            show: false
                        }
                    }
                ],
                series: [
                    {
                        name: '完成',
                        type: 'bar',
                        stack: '1',
                        label: {
                            normal: {
                                show: true,
                                position: 'inside'
                            }
                        },
                        barWidth: 50,
                        data: []
                    },
                    {
                        name: '未完成',
                        type: 'bar',
                        stack: '1',
                        label: {
                            normal: {
                                show: true,
                                position: 'inside'
                            }
                        },
                        barWidth: 50,
                        data: []
                    }
                ]
            }
        }
    },
    watch: {
        basicStructureInfo: {
            handler (n, o) {
                this.init(n);
            },
            deep: true
        }
    },
    mounted () {

    },
    methods: {
        init (n) {
            console.log(n.footing_excavation[0])
            this.option.series[0].data = [n.footing_excavation[0], n.foundation_grouting[0], n.footing_excavation[0]];
            this.option.series[1].data = [n.footing_excavation[1], n.foundation_grouting[1], n.footing_excavation[1]];
            let myChart = echarts.init(document.getElementById('echart'));
            myChart.setOption(this.option);
            console.log(this.option)
        }
    }

}
</script>

<style lang="less">
.echart-container {
  width: 365px;
  height: 230px;
}
</style>
