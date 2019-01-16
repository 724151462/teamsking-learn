<template>
    <el-tree :data="sourceData" :ref="treeName" @check="test" show-checkbox :props="props">
        <span class="custom-tree-node" slot-scope="{ node, data }">
            <img
            :width="15"
            v-if="sourceData.catalogId"
            style="margin-right: 3px"
            :src="require('@/assets/images/folder.png')"
            alt
            >
            <span>{{ node.label }}</span>
        </span>
    </el-tree>
</template>

<script>
export default {
    props: ['sourceData', 'props', 'treeName'],
    mounted() {
        console.log(this.sourceData,this.props)
    },
    methods: {
        test(...params) {
            let checkedList = params[1].checkedNodes.filter(element=> {
                return element.catalogId === undefined
            })
            this.$emit('checkedList', checkedList)
        }
    }
}
</script>

<style>

</style>
